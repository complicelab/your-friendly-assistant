/** Only cancel a declined CRM appointment after verifying the exact Google event. */
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { googleConnectionAccess } from '@/lib/calendar-connection.server';

export async function reconcileAttendanceCancellation(meetingId:string) {
  const {data:meeting,error}=await supabaseAdmin.from('crm_meetings')
    .select('id,contact_id,external_calendar_id,starts_at,ends_at,status,attendance_status,calendar_cancel_pending')
    .eq('id',meetingId).single();
  if(error||!meeting)throw Error('No se pudo consultar la cita para cancelar.');
  if(meeting.status!=='cancelada'||meeting.attendance_status!=='no_asistira'||!meeting.calendar_cancel_pending)
    return {pending:false};
  if(!meeting.external_calendar_id)return {pending:true};
  const access=await googleConnectionAccess();
  if(!access)return {pending:true};
  const url='https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(access.calendarId)+
    '/events/'+encodeURIComponent(meeting.external_calendar_id);
  const headers={Authorization:'Bearer '+access.token};
  const lookup=await fetch(url,{headers});
  let alreadyCancelled=lookup.status===404||lookup.status===410;
  let etag:string|undefined;
  if(!alreadyCancelled){
    if(!lookup.ok)throw Error('Google no permitió verificar la cancelación.');
    const event=await lookup.json() as {id?:string;status?:string;etag?:string;description?:string;
      start?:{dateTime?:string};end?:{dateTime?:string};attendees?:{email?:string}[]};
    if(event.id!==meeting.external_calendar_id)throw Error('El evento no corresponde a la cita.');
    alreadyCancelled=event.status==='cancelled';
    if(!alreadyCancelled){
      const {data:contact,error:contactError}=await supabaseAdmin.from('crm_contacts')
        .select('email,whatsapp').eq('id',meeting.contact_id).single();
      if(contactError||!contact)throw Error('No se pudo comprobar al cliente.');
      const email=contact.email?.trim().toLowerCase();
      const phone=contact.whatsapp?.replace(/\D/g,'');
      const describedPhone=event.description?.match(/(?:^|\n)\s*(?:whatsapp|teléfono|telefono)\s*:\s*([+\d ()-]{8,25})/i)?.[1]?.replace(/\D/g,'');
      const marker=event.description?.match(/(?:^|\n)CRM meeting ID:\s*([a-f\d-]{36})(?:\s|$)/i)?.[1];
      const identity=marker===meeting.id || (email&&event.attendees?.some(a=>a.email?.toLowerCase()===email)) ||
        (phone&&phone===describedPhone);
      if(!identity||Date.parse(event.start?.dateTime||'')!==Date.parse(meeting.starts_at)||
        Date.parse(event.end?.dateTime||'')!==Date.parse(meeting.ends_at))
        throw Error('La vinculación con Google necesita revisión antes de cancelar.');
      etag=event.etag;
    }
  }
  if(!alreadyCancelled){
    const response=await fetch(url+'?sendUpdates=all',{method:'DELETE',headers:{...headers,...(etag?{'If-Match':etag}:{})}});
    if(!response.ok&&response.status!==404&&response.status!==410)throw Error('Google no confirmó la cancelación.');
  }
  const saved=await supabaseAdmin.from('crm_meetings').update({calendar_cancel_pending:false,
    calendar_cancel_synced_at:new Date().toISOString()}).eq('id',meeting.id).eq('attendance_status','no_asistira');
  if(saved.error)throw Error('Falta registrar la cancelación comprobada.');
  return {pending:false};
}