/**
 * Commercial funnel analytics, independent of appointment attendance.
 *
 * A CRM contact's current sales stage is NOT proof of completed transactions.
 * Booked consultations come exclusively from crm_meetings, RSVP only from
 * attendance_status, won only from explicit commercial status "ganado".
 * Abandonment must be an EXPLICIT agent/CRM event: silence is not abandonment.
 *
 * Period-based metrics are lead-cohort metrics: count contacts created during
 * the selected period and their subsequent milestones (including appointments
 * after the period). Do not quietly confuse them with bookings made during
 * that calendar period.
 */
export type FunnelContact={
 id:string;created_at:string;status:string;source:string|null;
 full_name?:string|null;source_detail?:string|null;last_contact_at?:string|null;
 solution_interest?:string|null;
};
export type FunnelMeeting={
 id:string;contact_id:string;status:string;attendance_status:string|null;
 starts_at:string;created_at:string;
};
export type FunnelActivity={
 contact_id:string;activity_type:string;created_at:string;
};
export type CommercialStage=
 |'nuevo'|'en_conversacion'|'interesado'|'cita_agendada'
 |'asistencia_confirmada'|'diagnostico_realizado'|'cita_cancelada'
 |'propuesta'|'ganado'|'perdido'|'no_interesado'
 |'no_contactar'|'abandonado';
export type ContactFunnelState={
 contactId:string;stage:CommercialStage;interested:boolean;booked:boolean;
 attendanceConfirmed:boolean;attended:boolean;won:boolean;
 explicitlyAbandoned:boolean;
};
export type FunnelCounts={
 leads:number;contacted:number;interested:number;booked:number;
 attendanceConfirmed:number;attended:number;won:number;
 noInterested:number;optedOut:number;explicitlyAbandoned:number;
};
export type SourceFunnel=FunnelCounts&{source:string};
export type FunnelResult={
 totals:FunnelCounts;
 stages:Record<CommercialStage,number>;
 bySource:SourceFunnel[];
 contactStates:ContactFunnelState[];
 abandonmentMeasurable:boolean;
 funnelNotes:string[];
};

export const FUNNEL_STAGE_LABELS:Record<CommercialStage,string>={
 nuevo:'Nuevo',
 en_conversacion:'En conversación',
 interesado:'Interesado',
 cita_agendada:'Cita agendada',
 asistencia_confirmada:'Asistencia confirmada',
 diagnostico_realizado:'Diagnóstico realizado',
 cita_cancelada:'Cita cancelada',
 propuesta:'Propuesta enviada',
 ganado:'Cliente ganado',
 perdido:'Oportunidad perdida',
 no_interesado:'No interesado',
 no_contactar:'No contactar',
 abandonado:'Abandono registrado',
};

const interestedStatuses=new Set([
 'calificado','diagnostico_solicitado','cita_agendada',
 'propuesta','seguimiento','ganado',
]);
const contactedStatuses=new Set([
 'contactado','calificado','diagnostico_solicitado','requiere_atencion',
 'cita_agendada','seguimiento','propuesta','ganado','perdido','no_interesado',
]);
const explicitAbandonmentEvents=new Set(['prospecto_abandonado','abandono_confirmado']);
const interestedEvents=new Set(['diagnostico_solicitado','interes_confirmado']);
const actualBookedStates=new Set(['pendiente','confirmada','realizada','no_asistio','cancelada']);

export const isTestContact=(contact:FunnelContact)=>
 /^PRUEBA(?:\b|[_\s-])|^TEST(?:\b|[_\s-])/iu.test((contact.full_name||'').trim())||
 /^(prueba_tecnica|test_fixture)$/iu.test((contact.source_detail||'').trim());

const empty=():FunnelCounts=>({
 leads:0,contacted:0,interested:0,booked:0,
 attendanceConfirmed:0,attended:0,won:0,
 noInterested:0,optedOut:0,explicitlyAbandoned:0,
});
const increase=(count:FunnelCounts, state:{
 contacted:boolean;interested:boolean;booked:boolean;
 attendanceConfirmed:boolean;attended:boolean;won:boolean;
 noInterested:boolean;optedOut:boolean;explicitlyAbandoned:boolean;
})=>{
 count.leads++;
 if(state.contacted)count.contacted++;
 if(state.interested)count.interested++;
 if(state.booked)count.booked++;
 if(state.attendanceConfirmed)count.attendanceConfirmed++;
 if(state.attended)count.attended++;
 if(state.won)count.won++;
 if(state.noInterested)count.noInterested++;
 if(state.optedOut)count.optedOut++;
 if(state.explicitlyAbandoned)count.explicitlyAbandoned++;
};

export function commercialFunnel(
 contacts:FunnelContact[],meetings:FunnelMeeting[],activities:FunnelActivity[],
 {excludeTests=true}:{excludeTests?:boolean}={}
):FunnelResult{
 const eligible=excludeTests?contacts.filter(c=>!isTestContact(c)):contacts;
 const meetingByContact=new Map<string,FunnelMeeting[]>();
 for(const meeting of meetings){
  if(!actualBookedStates.has(meeting.status))continue;
  const group=meetingByContact.get(meeting.contact_id)||[];
  group.push(meeting);meetingByContact.set(meeting.contact_id,group);
 }
 const activitiesByContact=new Map<string,Set<string>>();
 for(const activity of activities){
  const set=activitiesByContact.get(activity.contact_id)||new Set<string>();
  set.add(activity.activity_type);activitiesByContact.set(activity.contact_id,set);
 }
 const totals=empty();
 const stages=Object.fromEntries((Object.keys(FUNNEL_STAGE_LABELS) as CommercialStage[])
  .map(stage=>[stage,0])) as Record<CommercialStage,number>;
 const sources=new Map<string,FunnelCounts>();
 const states:ContactFunnelState[]=[];
 let hasAbandonmentEvents=false;
 for(const contact of eligible){
  const contactMeetings=meetingByContact.get(contact.id)||[];
  const activityTypes=activitiesByContact.get(contact.id)||new Set<string>();
  const booked=contactMeetings.length>0;
  const attended=contactMeetings.some(m=>m.status==='realizada');
  const attendanceConfirmed=contactMeetings.some(m=>m.attendance_status==='confirmada'&&
   ['confirmada','realizada','no_asistio'].includes(m.status));
  const hasInterestEvent=[...activityTypes].some(type=>interestedEvents.has(type));
  const interested=interestedStatuses.has(contact.status)||hasInterestEvent||booked;
  const contacted=Boolean(contact.last_contact_at)||contactedStatuses.has(contact.status)||interested;
  const won=contact.status==='ganado';
  const noInterested=contact.status==='no_interesado';
  const optedOut=contact.status==='no_contactar';
  const explicitlyAbandoned=contact.status==='abandonado'||
   [...activityTypes].some(type=>explicitAbandonmentEvents.has(type));
  if(explicitlyAbandoned)hasAbandonmentEvents=true;
  const latest=[...contactMeetings].sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at))[0];
  let stage:CommercialStage='nuevo';
  if(won)stage='ganado';
  else if(optedOut)stage='no_contactar';
  else if(noInterested)stage='no_interesado';
  else if(contact.status==='perdido')stage='perdido';
  else if(explicitlyAbandoned)stage='abandonado';
  else if(contact.status==='propuesta')stage='propuesta';
  else if(latest?.status==='realizada')stage='diagnostico_realizado';
  else if(latest?.status==='cancelada')stage='cita_cancelada';
  else if(latest&&latest.attendance_status==='confirmada'&&latest.status==='confirmada')stage='asistencia_confirmada';
  else if(booked)stage='cita_agendada';
  else if(interested)stage='interesado';
  else if(contacted)stage='en_conversacion';

  const state:ContactFunnelState={contactId:contact.id,stage,interested,
   booked,attendanceConfirmed,attended,won,explicitlyAbandoned};
  states.push(state);
  stages[stage]++;
  const data={contacted,interested,booked,attendanceConfirmed,attended,
   won,noInterested,optedOut,explicitlyAbandoned};
  increase(totals,data);
  const source=(contact.source||'sin_origen').trim()||'sin_origen';
  const sourceCounts=sources.get(source)||empty();
  increase(sourceCounts,data);sources.set(source,sourceCounts);
 }
 return {
  totals,stages,contactStates:states,
  bySource:[...sources].map(([source,values])=>({source,...values}))
   .sort((a,b)=>b.leads-a.leads||a.source.localeCompare(b.source)),
  abandonmentMeasurable:hasAbandonmentEvents,
  funnelNotes:[
   'Cada porcentaje utiliza como base los contactos creados en el período seleccionado, no las citas creadas en ese período.',
   'Agendada significa una reunión real en el CRM, incluso si luego fue cancelada; una señal del agente no crea por sí sola una reserva.',
   'Confirmación de asistencia y diagnóstico realizado son hechos diferentes de interesado y venta ganada.',
   'Abandono requiere una señal explícita del agente o una decisión comercial: no se deduce del silencio ni de la falta de citas.',
  ],
 };
}
export function percent(part:number,total:number):string{
 return total>0?(100*part/total).toLocaleString('es-CO',{maximumFractionDigits:1})+' %':'—';
}
