/**
 * Evidence-first CRM appointment audit.
 *
 * A WhatsApp lead event called "cita_confirmada" is never RSVP proof.
 * A Google Calendar event is never proof of customer acceptance.
 * Only a meeting-bound, signed-agent-recorded "asistencia_confirmada" event
 * with a unique message_id and a matching reply time can verify RSVP.
 *
 * This module is read-only; it does not create bookings, change attendance,
 * send messages, or delete calendar events.
 */
export type AppointmentAuditMeeting = {
  id:string;contact_id:string;status:string;attendance_status:string;
  starts_at:string;ends_at:string;external_calendar_id:string|null;
  attendance_reminder_at:string|null;attendance_responded_at:string|null;
  attendance_response_source:string|null;calendar_cancel_pending:boolean;
};
export type AppointmentAuditActivity={
  contact_id:string;activity_type:string;channel:string|null;
  metadata:unknown;created_at:string;
};
export type AppointmentAuditGoogleEvent={
  id:string;startsAt:string;endsAt:string;
};
export type AppointmentAuditResult={
  booking:'calendar_match'|'calendar_missing'|'calendar_mismatch'|'calendar_unlinked'|'calendar_unchecked';
  reply:'verified'|'unconfirmed'|'declined'|'needs_attention'|'inconsistent';
  confirmed:boolean;
  requiresReview:boolean;
  findings:string[];
};
function obj(value:unknown):Record<string,unknown>|null{
  return value !== null && typeof value==='object' && !Array.isArray(value)
    ?value as Record<string,unknown>:null;
}
function validDate(value:unknown){
  return typeof value==='string'&&value.length>0&&Number.isFinite(Date.parse(value));
}
function withinRange(iso:string,range:{from:string;to:string}|null){
  if(!range)return false;
  const time=Date.parse(iso);
  return Number.isFinite(time)&&time>=Date.parse(range.from+'T00:00:00-05:00')&&
    time<Date.parse(range.to+'T00:00:00-05:00');
}
function sameInstant(a:string,b:string){
  return Number.isFinite(Date.parse(a))&&Number.isFinite(Date.parse(b))&&
    Math.abs(Date.parse(a)-Date.parse(b))<60_000;
}
export function verifyAppointmentEvidence(
 meeting:AppointmentAuditMeeting,
 activities:AppointmentAuditActivity[],
 googleEvents:AppointmentAuditGoogleEvent[]|null,
 googleRange:{from:string;to:string}|null,
):AppointmentAuditResult{
 const findings:string[]=[];
 const related=activities.filter(a=>{
  if(a.contact_id!==meeting.contact_id||a.channel!=='whatsapp_ia')return false;
  const metadata=obj(a.metadata);
  return metadata?.meeting_id===meeting.id&&[
   'recordatorio_asistencia_enviado','asistencia_confirmada','asistencia_rechazada','asistencia_dudosa',
  ].includes(a.activity_type);
 });
 const byTime=[...related].sort((a,b)=>{
  const am=obj(a.metadata),bm=obj(b.metadata);
  const t=(v:Record<string,unknown>|null,created:string)=>
   validDate(v?.event_timestamp)?Date.parse(String(v!.event_timestamp)):Date.parse(created);
  return t(bm,b.created_at)-t(am,a.created_at);
 });
 const responses=byTime.filter(a=>a.activity_type!=='recordatorio_asistencia_enviado');
 const latest=responses[0];
 const evidence=obj(latest?.metadata);
 const date=validDate(evidence?.event_timestamp)
   ?Date.parse(String(evidence!.event_timestamp)):NaN;
 const reminder=meeting.attendance_reminder_at?Date.parse(meeting.attendance_reminder_at):NaN;
 const replied=meeting.attendance_responded_at?Date.parse(meeting.attendance_responded_at):NaN;
 const exactResponse=!!latest&&latest.activity_type==='asistencia_confirmada'&&
   typeof evidence?.message_id==='string'&&
   /^[A-Za-z0-9_.:/+=-]{6,180}$/.test(evidence.message_id)&&
   Number.isFinite(date)&&Number.isFinite(reminder)&&Number.isFinite(replied)&&
   date>=reminder&&Math.abs(date-replied)<60_000&&date<=Date.parse(meeting.starts_at);
 let reply:AppointmentAuditResult['reply']='unconfirmed';
 if(meeting.status==='cancelada'||meeting.attendance_status==='no_asistira')reply='declined';
 else if(meeting.attendance_status==='requiere_atencion')reply='needs_attention';
 else if(meeting.status==='confirmada'||meeting.attendance_status==='confirmada'){
   if(meeting.status==='confirmada'&&meeting.attendance_status==='confirmada'&&
      meeting.attendance_response_source==='whatsapp_ia'&&exactResponse){
    reply='verified';
   }else{
    reply='inconsistent';
    findings.push('La cita figura confirmada, pero no se pudo verificar la respuesta inequívoca del cliente asociada a esta reunión.');
   }
 } else if(latest?.activity_type==='asistencia_confirmada') {
   findings.push('El historial contiene una respuesta anterior, pero el estado actual aún requiere verificación.');
 }
 let booking:AppointmentAuditResult['booking']='calendar_unchecked';
 if(!meeting.external_calendar_id){
   booking='calendar_unlinked';
   if(meeting.status!=='cancelada')findings.push('Reserva en CRM sin identificador de evento Google vinculado.');
 }else if(googleEvents&&withinRange(meeting.starts_at,googleRange)){
   const event=googleEvents.find(x=>x.id===meeting.external_calendar_id);
   if(!event){
     booking='calendar_missing';
     if(meeting.status!=='cancelada')findings.push('No se encontró el evento vinculado en Google Calendar durante el período consultado.');
   }else if(!sameInstant(event.startsAt,meeting.starts_at)||!sameInstant(event.endsAt,meeting.ends_at)){
     booking='calendar_mismatch';
     findings.push('El horario de Google Calendar no coincide con el de la cita registrada en CRM.');
   }else{
     booking='calendar_match';
     if(meeting.status==='cancelada')findings.push('La cita está cancelada en el CRM, pero su evento continúa visible en Google.');
   }
 }else{
   booking='calendar_unchecked';
 }
 if(meeting.calendar_cancel_pending)findings.push('Cancelación pendiente de confirmar en Google Calendar.');
 if(reply==='unconfirmed')findings.push('Reserva registrada, pero falta una respuesta afirmativa de asistencia del cliente.');
 if(reply==='needs_attention')findings.push('El cliente tiene dudas: requiere atención antes de afirmar su asistencia.');
 return {
  booking,reply,confirmed:reply==='verified',
  requiresReview:findings.some(x=>!x.startsWith('Reserva registrada,'))||
    reply==='needs_attention'||reply==='inconsistent',
  findings,
 };
}
export function auditReplyLabel(reply:AppointmentAuditResult['reply']){
 return ({
  verified:'Confirmación verificada por WhatsApp',
  unconfirmed:'Asistencia por confirmar',
  declined:'Cancelada / no asistirá',
  needs_attention:'Requiere atención',
  inconsistent:'Revisar confirmación sin evidencia',
 })[reply];
}
export function auditCalendarLabel(booking:AppointmentAuditResult['booking']){
 return ({
  calendar_match:'Coincide con Google',
  calendar_missing:'No encontrada en Google',
  calendar_mismatch:'Horario diferente en Google',
  calendar_unlinked:'Sin vínculo Google',
  calendar_unchecked:'Google aún no verificado',
 })[booking];
}
