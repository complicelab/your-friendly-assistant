/** Server-only Google-derived booking duration for Cómplice Lab.
 * Google Calendar has no public Appointment Schedules configuration endpoint.
 * We infer only from real booked events with identifiable external customers.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { googleConnectionAccess } from '@/lib/calendar-connection.server';
import { inferAgencyBookingDuration, type GoogleDurationEvent } from '@/lib/google-booking-duration-model';

const db = supabaseAdmin as unknown as SupabaseClient;
const REFRESH_MS=5*60_000;
type DurationRow = {
 booking_duration_minutes:number|null;
 booking_duration_observations:number;
 booking_duration_checked_at:string|null;
 booking_duration_status:'pending'|'verified'|'mixed'|'error';
};
export type DurationSyncStatus={
 connected:boolean;minutes:number|null;observations:number;checkedAt:string|null;
 status:'disconnected'|'pending'|'verified'|'mixed'|'error';
 source:'confirmed_google_bookings'|'none';
};

function toStatus(row:DurationRow|null,connected:boolean):DurationSyncStatus {
 return {
  connected,
  minutes:row?.booking_duration_minutes??null,
  observations:row?.booking_duration_observations??0,
  checkedAt:row?.booking_duration_checked_at??null,
  status:connected?(row?.booking_duration_status||'pending'):'disconnected',
  source:row?.booking_duration_minutes?'confirmed_google_bookings':'none',
 };
}

async function fetchBookedExamples(access:{token:string;calendarId:string}) {
 const events:GoogleDurationEvent[]=[];
 const start=new Date(Date.now()-100*86400000).toISOString();
 const end=new Date(Date.now()+210*86400000).toISOString();
 let token='';
 for(let i=0;i<12;i++){
  const params=new URLSearchParams({
   timeMin:start,timeMax:end,singleEvents:'true',showDeleted:'false',
   maxResults:'250',
  });
  if(token)params.set('pageToken',token);
  const response=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+
    encodeURIComponent(access.calendarId)+'/events?'+params,{
    headers:{Authorization:'Bearer '+access.token},
  });
  if(!response.ok)throw Error('Google no permitió comprobar la duración de las reservas.');
  const body=await response.json() as {items?:GoogleDurationEvent[];nextPageToken?:string};
  events.push(...(body.items||[]));
  if(!body.nextPageToken)return events;
  token=body.nextPageToken;
 }
 throw Error('Hay demasiados eventos para determinar la duración de manera segura.');
}

let cached:DurationSyncStatus|null=null;
let cachedAt=0;
let running:Promise<DurationSyncStatus>|null=null;

/** Re-check before advertising/bookings; on sync and admin explicitly.
 * A failed or inconclusive sample NEVER overwrites previously saved durations.
 */
export async function syncGoogleBookingDuration(force=false):Promise<DurationSyncStatus>{
 if(!force && cached?.connected && Date.now()-cachedAt<REFRESH_MS)return cached;
 if(running)return running;
 running=(async()=>{
  const access=await googleConnectionAccess();
  if(!access){
   const current=toStatus(null,false);
   cached=current;cachedAt=Date.now();
   return current;
  }
  const {data:record,error:lookupError}=await db.from('crm_calendar_connections')
    .select('booking_duration_minutes,booking_duration_observations,booking_duration_checked_at,booking_duration_status')
    .eq('id',1).single();
  if(lookupError||!record)throw Error('Falta aplicar la migración de duración automática de Google.');
  const old=record as DurationRow;
  const last=old.booking_duration_checked_at?Date.parse(old.booking_duration_checked_at):NaN;
  if(!force && Number.isFinite(last) && Date.now()-last<REFRESH_MS){
   const result=toStatus(old,true);cached=result;cachedAt=Date.now();return result;
  }
  try {
   const events=await fetchBookedExamples(access);
   const observed=inferAgencyBookingDuration(events);
   const now=new Date().toISOString();
   if(observed.minutes!==null){
    const {data:settings,error:configError}=await db.from('crm_booking_settings')
      .select('id,meeting_duration_minutes,slot_minutes').limit(1).maybeSingle();
    if(configError||!settings)throw Error('No existe la configuración de la agenda del CRM.');
    // Both duration and default spacing use the verified meeting length. Google
    // does NOT expose its booking-page slot interval or buffer settings.
    if(settings.meeting_duration_minutes!==observed.minutes||settings.slot_minutes!==observed.minutes){
     const {error}=await db.from('crm_booking_settings').update({
      meeting_duration_minutes:observed.minutes,slot_minutes:observed.minutes,
      updated_at:now,
     }).eq('id',settings.id);
     if(error)throw Error('No se pudo actualizar la duración del CRM desde el servidor.');
    }
   }
   const nextStatus=observed.minutes!==null?'verified':observed.confidence==='mixed'?'mixed':'pending';
   const {error:stateError}=await db.from('crm_calendar_connections').update({
    booking_duration_minutes:observed.minutes??old.booking_duration_minutes,
    booking_duration_observations:observed.observations,
    booking_duration_checked_at:now,
    booking_duration_status:nextStatus,
   }).eq('id',1);
   if(stateError)throw Error('No se pudo guardar el diagnóstico de duración de Google.');
   const result:DurationSyncStatus={
    connected:true,minutes:observed.minutes??old.booking_duration_minutes,
    observations:observed.observations,checkedAt:now,
    status:nextStatus,source:(observed.minutes??old.booking_duration_minutes)?'confirmed_google_bookings':'none',
   };
   cached=result;cachedAt=Date.now();return result;
  }catch(error){
   // Do not replace a previously verified configuration on a Google outage.
   // Raise the failure for explicit admin sync; public availability can fail closed.
   throw error;
  }
 })();
 try{return await running;}
 finally{running=null;}
}

export async function readGoogleBookingDurationStatus():Promise<DurationSyncStatus>{
 const access=await googleConnectionAccess();
 if(!access)return toStatus(null,false);
 const {data,error}=await db.from('crm_calendar_connections')
  .select('booking_duration_minutes,booking_duration_observations,booking_duration_checked_at,booking_duration_status')
  .eq('id',1).single();
 if(error||!data)throw Error('Falta aplicar la migración de duración automática.');
 return toStatus(data as DurationRow,true);
}
