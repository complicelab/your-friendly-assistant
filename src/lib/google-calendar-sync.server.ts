/** Server-only: reconcile Google Calendar appointments with CRM contacts. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { googleConnectionAccess, recordCalendarSync } from '@/lib/calendar-connection.server';
const db = supabaseAdmin as unknown as SupabaseClient;
const cleanEmail=(s?:string|null)=>String(s||'').trim().toLowerCase();
const cleanPhone=(s?:string|null)=>String(s||'').replace(/\D/g,'');

export type ContactIdentity={id:string;email:string|null;whatsapp:string|null};
export type GoogleEventIdentity={attendees?:{email?:string;self?:boolean}[];organizer?:{email?:string};description?:string};
export function matchContactForGoogleEvent(event:GoogleEventIdentity,contacts:ContactIdentity[]){
 const emails=new Set((event.attendees||[]).filter(a=>!a.self).map(a=>cleanEmail(a.email)).filter(e=>e&&e!=='complicelab@gmail.com'));
 const organizer=cleanEmail(event.organizer?.email);
 if(organizer&&organizer!=='complicelab@gmail.com')emails.add(organizer);
 const em=event.description?.match(/(?:^|\n)\s*(?:correo|email)\s*:\s*([^\s,;]+)/i)?.[1];
 if(em&&cleanEmail(em)!=='complicelab@gmail.com')emails.add(cleanEmail(em));
 const phone=cleanPhone(event.description?.match(/(?:^|\n)\s*(?:whatsapp|telefono|teléfono)\s*:\s*([+\d ()-]{8,25})/i)?.[1]);
 const ids=new Set(contacts.filter(c=>(c.email&&emails.has(cleanEmail(c.email)))||
  (phone.length>=10&&cleanPhone(c.whatsapp)===phone)).map(c=>c.id));
 return {contactId:ids.size===1?[...ids][0]!:null,ambiguous:ids.size>1};
}
export type GoogleEvent=GoogleEventIdentity & {id?:string;status?:string;summary?:string;hangoutLink?:string;
  start?:{dateTime?:string;date?:string};end?:{dateTime?:string;date?:string};transparency?:string};
type Contact=ContactIdentity & {full_name:string;solution_interest:string|null};
type Meeting={id:string;contact_id:string;external_calendar_id:string|null;starts_at:string;ends_at:string;status:string;source:string};
export async function loadAll(table:string,columns:string){
 const result:Record<string,unknown>[]=[];
 for(let offset=0;offset<20000;offset+=1000){
  const {data,error}=await db.from(table).select(columns).range(offset,offset+999);
  if(error)throw Error('No se pudieron cargar datos del CRM.');
  result.push(...((data||[]) as unknown as Record<string,unknown>[]));
  if(!data||data.length<1000)return result;
 }
 throw Error('Hay demasiados registros para sincronizar en una operación.');
}
export async function listGoogleEvents(access:{token:string;calendarId:string}){
 const start=new Date(Date.now()-180*86400000).toISOString();
 const end=new Date(Date.now()+365*86400000).toISOString();
 const events:GoogleEvent[]=[];
 let pageToken='';
 for(let page=0;page<12;page++){
  const query=new URLSearchParams({timeMin:start,timeMax:end,singleEvents:'true',showDeleted:'true',maxResults:'2500'});
  if(pageToken)query.set('pageToken',pageToken);
  const response=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(access.calendarId)+'/events?'+query,{
   headers:{Authorization:'Bearer '+access.token},
  });
  if(!response.ok)throw Error('Google Calendar no permitió leer las citas.');
  const body=await response.json() as {items?:GoogleEvent[];nextPageToken?:string};
  events.push(...(body.items||[]));
  if(!body.nextPageToken)return events;
  pageToken=body.nextPageToken;
 }
 throw Error('La agenda tiene demasiados eventos; reduce el rango de importación.');
}
export type SyncStats={reviewed:number;linked:number;imported:number;updated:number;unlinked:number;ambiguous:number};
export async function synchronizeGoogleAppointments(source:'manual'|'cron'='manual'):Promise<SyncStats>{
 const access=await googleConnectionAccess();
 if(!access)throw Error('Primero conecta Google Calendar.');
 try {
  const [events,c,m,ignoredRows]=await Promise.all([
   listGoogleEvents(access),loadAll('crm_contacts','id,full_name,email,whatsapp,solution_interest'),
   loadAll('crm_meetings','id,contact_id,external_calendar_id,starts_at,ends_at,status,source'),
   loadAll('crm_calendar_event_reviews','event_id'),
  ]);
  const ignored=new Set(ignoredRows.map(row=>String(row['event_id'])));
  const contacts=c as unknown as Contact[],meetings=m as unknown as Meeting[];
  const linked=new Map(meetings.filter(x=>x.external_calendar_id).map(x=>[x.external_calendar_id!,x]));
  const stats:SyncStats={reviewed:0,linked:0,imported:0,updated:0,unlinked:0,ambiguous:0};
  for(const event of events){
   if(!event.id || ignored.has(event.id))continue;
   const existing=linked.get(event.id);
   if(event.status==='cancelled'){
    if(existing&&existing.status!=='cancelada'){
     const result=await db.from('crm_meetings').update({status:'cancelada'}).eq('id',existing.id);
     if(result.error)throw Error('No se pudo actualizar una cancelación.');
     stats.updated++;
    }
    continue;
   }
   if(!event.start?.dateTime||!event.end?.dateTime||event.transparency==='transparent')continue;
   stats.reviewed++;
   const starts_at=new Date(event.start.dateTime).toISOString();
   const ends_at=new Date(event.end.dateTime).toISOString();
   if(existing){
    const patch:Record<string,unknown>={};
    if(existing.starts_at!==starts_at||existing.ends_at!==ends_at){
      patch['starts_at']=starts_at;patch['ends_at']=ends_at;
    }
    if(existing.status==='cancelada')patch['status']='confirmada';
    if(Object.keys(patch).length){
      const result=await db.from('crm_meetings').update(patch).eq('id',existing.id);
      if(result.error)throw Error('No se pudo actualizar una reunión vinculada.');
      stats.updated++;
    }
    stats.linked++;continue;
   }
   const match=matchContactForGoogleEvent(event,contacts);
   if(match.ambiguous){stats.ambiguous++;continue;}
   if(!match.contactId){stats.unlinked++;continue;}
   const alreadyAtTime=meetings.find(x=>x.contact_id===match.contactId &&
    Date.parse(x.starts_at)===Date.parse(starts_at)&&x.status!=='cancelada'&&!x.external_calendar_id);
   // The DB RPC serializes attachments, checks ownership and suppresses booking notices.
   const {data:attachedId,error:attachError}=await db.rpc('crm_attach_google_calendar_event',{
    p_event_id:event.id,p_contact_id:match.contactId,p_start:starts_at,p_end:ends_at,
    p_title:event.summary||'Cita de Google Calendar',p_meeting_url:event.hangoutLink||null,
   });
   if(attachError||!attachedId)throw Error('No se pudo relacionar el evento con el CRM.');
   const created:Meeting={id:String(attachedId),contact_id:match.contactId,starts_at,ends_at,
    external_calendar_id:event.id,status:'confirmada',source:'google_calendar'};
   meetings.push(created);linked.set(event.id,created);
   if(alreadyAtTime)stats.linked++;
   else stats.imported++;
  }
  // Keep CRM duration in line with real Google customer bookings on each sync.
  // If the external sample is unavailable, retain the last verified policy;
  // do not fail existing contact/event reconciliation due to a duration probe.
  try {
   const {syncGoogleBookingDuration}=await import('@/lib/google-booking-duration.server');
   await syncGoogleBookingDuration();
  } catch(error) {
   console.warn('[calendar] No se pudo verificar automáticamente la duración de reservas.');
  }
  await recordCalendarSync({source});
  return stats;
 }catch(error){
  await recordCalendarSync({error:error instanceof Error?error.message:'Falló la sincronización.',source});
  throw error;
 }
}
export async function cancelGoogleMeeting(id:string){
 if(!/^[0-9a-f-]{36}$/i.test(id))throw Error('Cita inválida.');
 const {data,error}=await db.from('crm_meetings').select('id,external_calendar_id').eq('id',id).single();
 if(error||!data)throw Error('Cita no encontrada.');
 if(data.external_calendar_id){
  const access=await googleConnectionAccess();
  if(!access)throw Error('Conecta Google Calendar antes de cancelar la cita.');
  const response=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+
   encodeURIComponent(access.calendarId)+'/events/'+encodeURIComponent(data.external_calendar_id)+'?sendUpdates=all',{
    method:'DELETE',headers:{Authorization:'Bearer '+access.token},
   });
  if(!response.ok&&response.status!==404&&response.status!==410)throw Error('Google no confirmó la cancelación; no se modificó el CRM.');
 }
 const result=await db.from('crm_meetings').update({status:'cancelada'}).eq('id',id);
 if(result.error)throw Error('Google canceló la cita pero el CRM necesita revisión manual.');
}
