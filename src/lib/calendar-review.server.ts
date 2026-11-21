/** Private, authenticated calendar event review and CRM scheduling operations. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { googleConnectionAccess } from '@/lib/calendar-connection.server';
import { listGoogleEvents, loadAll, type GoogleEvent } from '@/lib/google-calendar-sync.server';
import { classifyCalendarReview } from '@/lib/calendar-review-model';

const db = supabaseAdmin as unknown as SupabaseClient;
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const idValid = (s:string) => s.length>0 && s.length<=512 && /^[\w@.-]+$/.test(s);
const googleBase = (calendar:string) =>
 'https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(calendar)+'/events';
const iso = (d:string) => new Date(d).toISOString();

async function accessOrThrow(){
 const access=await googleConnectionAccess();
 if(!access)throw Error('Google Calendar no está conectado.');
 return access;
}
function meetsEventCriteria(event:GoogleEvent){
 return !!event.id && event.status!=='cancelled' &&
  !!event.start?.dateTime && !!event.end?.dateTime &&
  Number.isFinite(Date.parse(event.start.dateTime)) &&
  Number.isFinite(Date.parse(event.end.dateTime)) &&
  Date.parse(event.end.dateTime)>Date.parse(event.start.dateTime);
}

export type CalendarReviewEvent={
 id:string; title:string; startsAt:string; endsAt:string; guests:string[];
 suggestedContactId:string|null; ambiguous:boolean;
};
export async function reviewCalendarEvents(){
 const access=await accessOrThrow();
 const [events,contacts,meetings,reviewRows]=await Promise.all([
  listGoogleEvents(access),loadAll('crm_contacts','id,email,whatsapp'),
  loadAll('crm_meetings','external_calendar_id'),
  loadAll('crm_calendar_event_reviews','event_id,calendar_id,action'),
 ]);
 const linked=new Set(meetings.map(m=>String(m['external_calendar_id']||'')).filter(Boolean));
 const ignored=new Set(reviewRows.filter(row=>row['action']==='ignored' &&
    row['calendar_id']===access.calendarId).map(row=>String(row['event_id'])));
 return classifyCalendarReview(events,contacts as unknown as {id:string;email:string|null;whatsapp:string|null}[],
  linked,ignored);
}

async function fetchGoogleEvent(access:{token:string;calendarId:string},eventId:string){
 if(!idValid(eventId))throw Error('El identificador del evento no es válido.');
 const response=await fetch(googleBase(access.calendarId)+'/'+encodeURIComponent(eventId),{
  headers:{Authorization:'Bearer '+access.token},
 });
 if(!response.ok)throw Error('No fue posible verificar este evento directamente con Google.');
 const event=await response.json() as GoogleEvent & {etag?:string};
 if(!meetsEventCriteria(event)||event.id!==eventId)throw Error('El evento fue cancelado o no tiene horario verificable.');
 return event;
}

export async function markCalendarEventIgnored(eventId:string){
 const access=await accessOrThrow();
 await fetchGoogleEvent(access,eventId); // Confirm this belongs to the connected calendar.
 const {data:existing,error:lookupError}=await db.from('crm_meetings')
  .select('id').eq('external_calendar_id',eventId).limit(1);
 if(lookupError)throw Error('No se pudo verificar si el evento ya estaba vinculado.');
 if(existing?.length)throw Error('La cita ya está vinculada y no se puede ignorar.');
 const {error}=await db.from('crm_calendar_event_reviews').upsert({
  event_id:eventId,calendar_id:access.calendarId,action:'ignored',
  reviewed_at:new Date().toISOString(),
 },{onConflict:'event_id'});
 if(error)throw Error('No se pudo guardar la decisión de ignorar.');
}
export async function restoreCalendarEvent(eventId:string){
 const access=await accessOrThrow();
 if(!idValid(eventId))throw Error('El identificador no es válido.');
 const {error}=await db.from('crm_calendar_event_reviews').delete()
  .eq('event_id',eventId).eq('calendar_id',access.calendarId);
 if(error)throw Error('No se pudo restaurar la cita para revisión.');
}

export async function linkCalendarEventToClient(eventId:string,contactId:string){
 if(!uuid.test(contactId))throw Error('Selecciona un cliente válido del CRM.');
 const access=await accessOrThrow();
 const event=await fetchGoogleEvent(access,eventId);
 const {data,error}=await db.rpc('crm_attach_google_calendar_event',{
  p_event_id:eventId,p_contact_id:contactId,
  p_start:event.start!.dateTime,p_end:event.end!.dateTime,
  p_title:event.summary||'Cita de Google Calendar',
  p_meeting_url:event.hangoutLink||null,
 });
 if(error||!data)throw Error('No se pudo vincular sin duplicar. Verifica que la migración esté aplicada y que este evento no pertenezca a otro cliente.');
 return {meeting_id:String(data)};
}

export async function verifyCalendarConnectionWithoutWrites(){
 const access=await accessOrThrow();
 const response=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+
  encodeURIComponent(access.calendarId),{headers:{Authorization:'Bearer '+access.token}});
 if(!response.ok)throw Error('Google rechazó la consulta del calendario.');
 const details=await response.json() as {id?:string;timeZone?:string};
 if(details.id!==access.calendarId)throw Error('La cuenta conectada no coincide con el calendario esperado.');
 const from=new Date().toISOString(),to=new Date(Date.now()+86400000).toISOString();
 const free=await fetch('https://www.googleapis.com/calendar/v3/freeBusy',{
  method:'POST',headers:{Authorization:'Bearer '+access.token,'Content-Type':'application/json'},
  body:JSON.stringify({timeMin:from,timeMax:to,items:[{id:access.calendarId}]}),
 });
 if(!free.ok)throw Error('La API de Google no permitió comprobar disponibilidad.');
 const result=await free.json() as {calendars?:Record<string,{busy?:unknown[];errors?:unknown[]}>};
 const calendar=result.calendars?.[access.calendarId];
 if(!calendar||!Array.isArray(calendar.busy)||calendar.errors?.length)
  throw Error('La API devolvió una disponibilidad incompleta.');
 return {calendar:access.calendarId,timezone:details.timeZone||'America/Bogota',
  busyPeriodsNext24h:calendar.busy.length,mode:'solo_lectura'};
}

function normalizeStart(value:string) {
 // Explicit offset is mandatory so datetime-local values are never mistaken for UTC.
 if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?(?:Z|[+-]\d\d:\d\d)$/.test(value))
  throw Error('La nueva fecha debe incluir la zona horaria (por ejemplo -05:00).');
 const timestamp=Date.parse(value);
 if(!Number.isFinite(timestamp)||timestamp<=Date.now()+5*60_000)
  throw Error('Selecciona una fecha válida al menos cinco minutos en el futuro.');
 return new Date(timestamp);
}

export async function moveCalendarMeeting(meetingId:string,newStartRaw:string) {
 if(!uuid.test(meetingId))throw Error('Cita inválida.');
 const access=await accessOrThrow();
 const {data:meeting,error}=await db.from('crm_meetings').select(
  'id,starts_at,ends_at,status,external_calendar_id').eq('id',meetingId).single();
 if(error||!meeting)throw Error('La cita no existe en el CRM.');
 if(!meeting.external_calendar_id)throw Error('Primero vincula esta cita con Google Calendar.');
 if(meeting.status==='cancelada')throw Error('No se pueden reprogramar citas canceladas.');
 const start=normalizeStart(newStartRaw),oldStart=Date.parse(meeting.starts_at);
 const duration=Date.parse(meeting.ends_at)-oldStart;
 if(!(duration>0&&duration<=8*60*60*1000))throw Error('La duración anterior es inválida.');
 const end=new Date(start.getTime()+duration);
 const startIso=start.toISOString(),endIso=end.toISOString();
 if(startIso===iso(meeting.starts_at))return {starts_at:startIso,ends_at:endIso};
 const {data:collision,error:collisionError}=await db.from('crm_meetings')
  .select('id').neq('id',meetingId).neq('status','cancelada')
  .lt('starts_at',endIso).gt('ends_at',startIso).limit(1);
 if(collisionError)throw Error('No se pudo comprobar la disponibilidad del CRM.');
 if(collision?.length)throw Error('El nuevo horario ya está ocupado en el CRM.');

 const event=await fetchGoogleEvent(access,meeting.external_calendar_id);
 if(iso(event.start!.dateTime!)!==iso(meeting.starts_at) ||
    iso(event.end!.dateTime!)!==iso(meeting.ends_at))
  throw Error('La cita cambió en Google. Sincroniza primero antes de reprogramar.');
 // Include all-day/recurring busy events; exclude only the event being moved.
 const params=new URLSearchParams({singleEvents:'true',timeMin:startIso,timeMax:endIso,maxResults:'2500'});
 const check=await fetch(googleBase(access.calendarId)+'?'+params.toString(),{
  headers:{Authorization:'Bearer '+access.token},
 });
 if(!check.ok)throw Error('No se pudo verificar el nuevo horario en Google.');
 const windowEvents=await check.json() as {items?:GoogleEvent[];nextPageToken?:string};
 if(windowEvents.nextPageToken)throw Error('Demasiados eventos en el horario para confirmar disponibilidad.');
 const conflicts=(windowEvents.items||[]).filter(e=>{
  if(e.id===event.id || e.status==='cancelled'||e.transparency==='transparent')return false;
  const begin=e.start?.dateTime?Date.parse(e.start.dateTime):
    e.start?.date?Date.parse(e.start.date+'T00:00:00-05:00'):NaN;
  const finish=e.end?.dateTime?Date.parse(e.end.dateTime):
    e.end?.date?Date.parse(e.end.date+'T00:00:00-05:00'):NaN;
  return Number.isFinite(begin)&&Number.isFinite(finish)&&start.getTime()<finish&&end.getTime()>begin;
 });
 if(conflicts.length)throw Error('Google Calendar tiene otro evento durante ese horario.');
 const url=googleBase(access.calendarId)+'/'+encodeURIComponent(meeting.external_calendar_id)+'?sendUpdates=all';
 const body={
  start:{dateTime:newStartRaw,timeZone:'America/Bogota'},
  end:{dateTime:new Date(end.getTime()-5*60*60*1000).toISOString().slice(0,19)+'-05:00',timeZone:'America/Bogota'},
 };
 const patch=await fetch(url,{
  method:'PATCH',headers:{
   Authorization:'Bearer '+access.token,'Content-Type':'application/json',
   ...(event.etag?{'If-Match':event.etag}:{}),
  },body:JSON.stringify(body),
 });
 if(!patch.ok)throw Error('Google no confirmó el cambio de horario; no se modificó el CRM.');
 const newEvent=await patch.json() as {etag?:string};
 const {error:saveError}=await db.from('crm_meetings').update({
  starts_at:startIso,ends_at:endIso,updated_at:new Date().toISOString(),
 }).eq('id',meetingId).eq('starts_at',meeting.starts_at).select('id').single();
 if(saveError){
  // Best-effort compensating update; report failure rather than claiming success.
  const rollback=await fetch(url,{
   method:'PATCH',headers:{
    Authorization:'Bearer '+access.token,'Content-Type':'application/json',
    ...(newEvent.etag?{'If-Match':newEvent.etag}:{}),
   },
   body:JSON.stringify({start:{dateTime:meeting.starts_at,timeZone:'America/Bogota'},
    end:{dateTime:meeting.ends_at,timeZone:'America/Bogota'}}),
  });
  if(!rollback.ok)throw Error('Google cambió la hora y el CRM falló; requiere revisión manual inmediata.');
  throw Error('No se guardó en el CRM. Google volvió al horario anterior.');
 }
 return {starts_at:startIso,ends_at:endIso};
}
