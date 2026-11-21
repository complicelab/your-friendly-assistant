import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calendarApi, calendarCommand } from '@/components/crm/calendar-connection-settings';
import type { Tables } from '@/integrations/supabase/types';
import { BOOKING_TIMEZONE, MEETING_STATUSES, attendanceStatusClass, attendanceStatusLabel, formatMeetingDate, meetingStatusLabel, notificationStatusLabel } from '@/lib/booking-model';

type ContactSummary = Pick<Tables<'crm_contacts'>, 'id'|'full_name'|'brand_name'|'whatsapp'|'email'|'solution_interest'>;
export type CrmMeeting = Tables<'crm_meetings'> & { crm_contacts: ContactSummary | null };
type Notification = Tables<'crm_notifications'>;
type GoogleAgendaEvent = {
  id:string; title:string; startsAt:string; endsAt:string; allDay:boolean;
  eventType:string; transparent:boolean; guestsCount:number;
};
type GoogleAgendaResult = {
  events:GoogleAgendaEvent[]; calendar:string; from:string; to:string; checkedAt:string;
};
function googleEventOverlapsDay(event:GoogleAgendaEvent,day:string) {
 const begin=Date.parse(day+'T00:00:00-05:00');
 return Date.parse(event.startsAt)<begin+86400000&&Date.parse(event.endsAt)>begin;
}

const WEEKDAYS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

function dateKey(date: Date) { return date.toISOString().slice(0,10); }
function meetingDateKey(value: string) {
  const parts = new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:BOOKING_TIMEZONE}).formatToParts(new Date(value));
  const map = Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return `${map['year']}-${map['month']}-${map['day']}`;
}
function monthLabel(date: Date) { return new Intl.DateTimeFormat('es-CO',{month:'long',year:'numeric',timeZone:'UTC'}).format(date); }
function shortMeetingDate(value: string) { return new Intl.DateTimeFormat('es-CO',{weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit',hour12:true,timeZone:BOOKING_TIMEZONE}).format(new Date(value)); }
function bogotaDatetimeInput(value:string) {
 return new Date(Date.parse(value)-5*60*60*1000).toISOString().slice(0,16);
}

export function CrmAgenda({onOpenContact,onChanged,onOpenReview}:{onOpenContact:(contactId:string)=>void;onChanged:()=>void;onOpenReview:()=>void}) {
  const [meetings,setMeetings]=useState<CrmMeeting[]>([]);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState('');
  const [mode,setMode]=useState<'month'|'week'>('month');
  const [cursor,setCursor]=useState(()=>{const now=new Date();return new Date(Date.UTC(now.getFullYear(),now.getMonth(),1));});
  const [selectedDay,setSelectedDay]=useState(()=>meetingDateKey(new Date().toISOString()));
  const [selected,setSelected]=useState<CrmMeeting|null>(null);
  const [notifications,setNotifications]=useState<Notification[]>([]);
  const [saving,setSaving]=useState(false);
  const [newAppointmentStart,setNewAppointmentStart]=useState('');
  const [googleEvents,setGoogleEvents]=useState<GoogleAgendaEvent[]>([]);
  const [googleLoaded,setGoogleLoaded]=useState(false);
  const [googleLoading,setGoogleLoading]=useState(false);
  const [googleError,setGoogleError]=useState('');
  const [googleCheckedAt,setGoogleCheckedAt]=useState<string|null>(null);
  const [showGoogle,setShowGoogle]=useState(true);
  const [selectedGoogle,setSelectedGoogle]=useState<GoogleAgendaEvent|null>(null);
  const googleSequence=useRef(0);
  useEffect(()=>{
    setNewAppointmentStart(selected?bogotaDatetimeInput(selected.starts_at):'');
  },[selected?.id,selected?.starts_at]);
  async function rescheduleMeeting(){
    if(!selected||!newAppointmentStart||!selected.external_calendar_id)return;
    if(!window.confirm('¿Reprogramar esta cita en Google Calendar y en el CRM? Se informará a los invitados desde Google.'))return;
    setSaving(true);setMessage('');
    try{
      const result=await calendarCommand({
        action:'reschedule',meeting_id:selected.id,
        starts_at:newAppointmentStart+':00-05:00',
      });
      const updated={...selected,starts_at:String(result.starts_at),ends_at:String(result.ends_at)};
      setMeetings(prev=>prev.map(m=>m.id===updated.id?updated:m));
      setSelected(updated);onChanged();
      setMessage('La cita se actualizó en Google Calendar y en el CRM.');
    }catch(e){
      setMessage(e instanceof Error?e.message:'No se pudo cambiar el horario.');
    }finally{setSaving(false);}
  }

  async function loadMeetings(silent=false) {
    if(!silent)setLoading(true);
    const {data,error}=await supabase.from('crm_meetings')
      .select('*, crm_contacts(id,full_name,brand_name,whatsapp,email,solution_interest)')
      .order('starts_at',{ascending:true}).limit(500);
    if(error)setMessage('No pude cargar las reuniones.');
    else {
      const updated=(data||[]) as CrmMeeting[];
      setMeetings(updated);
      setSelected(current=>current?updated.find(m=>m.id===current.id)||current:null);
    }
    if(!silent)setLoading(false);
  }
  useEffect(()=>{
    void loadMeetings();
    const refresh=()=>{if(!document.hidden)void loadMeetings(true);};
    const timer=window.setInterval(refresh,60_000);
    window.addEventListener('focus',refresh);
    document.addEventListener('visibilitychange',refresh);
    return()=>{
      window.clearInterval(timer);
      window.removeEventListener('focus',refresh);
      document.removeEventListener('visibilitychange',refresh);
    };
  },[]);
  useEffect(()=>{
    if(!selected){setNotifications([]);return;}
    void supabase.from('crm_notifications').select('*').eq('meeting_id',selected.id).order('created_at',{ascending:true})
      .then(({data,error})=>{if(error)setMessage('No pude cargar los estados de notificación.');else setNotifications(data||[]);});
  },[selected?.id]);

  const days=useMemo(()=>{
    if(mode==='week'){
      const anchor=new Date(selectedDay+'T12:00:00Z');
      const mondayOffset=(anchor.getUTCDay()+6)%7;
      const start=new Date(anchor);start.setUTCDate(start.getUTCDate()-mondayOffset);
      return Array.from({length:7},(_,index)=>{const day=new Date(start);day.setUTCDate(day.getUTCDate()+index);return day;});
    }
    const first=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth(),1));
    const offset=(first.getUTCDay()+6)%7;
    const start=new Date(first);start.setUTCDate(start.getUTCDate()-offset);
    return Array.from({length:42},(_,index)=>{const day=new Date(start);day.setUTCDate(day.getUTCDate()+index);return day;});
  },[cursor,mode,selectedDay]);

  const googleRange=useMemo(()=>{
    const first=days[0]!,last=new Date(days[days.length-1]!);
    last.setUTCDate(last.getUTCDate()+1);
    return {from:dateKey(first),to:dateKey(last)};
  },[days]);
  const loadGoogle=useCallback(async()=>{
    const seq=++googleSequence.current;
    setGoogleLoading(true);setGoogleError('');
    try{
      const result=await calendarCommand({action:'agenda',from:googleRange.from,to:googleRange.to}) as GoogleAgendaResult;
      if(seq!==googleSequence.current)return;
      setGoogleEvents(result.events);
      setGoogleCheckedAt(result.checkedAt);
      setGoogleLoaded(true);
    }catch(error){
      if(seq!==googleSequence.current)return;
      setGoogleEvents([]);setGoogleLoaded(false);
      setGoogleError(error instanceof Error?error.message:'No se pudo consultar Google Calendar.');
    }finally{
      if(seq===googleSequence.current)setGoogleLoading(false);
    }
  },[googleRange.from,googleRange.to]);

  useEffect(()=>{
    void loadGoogle();
    const refresh=()=>{if(!document.hidden)void loadGoogle();};
    const timer=window.setInterval(refresh,60_000);
    window.addEventListener('focus',refresh);
    document.addEventListener('visibilitychange',refresh);
    return()=>{
      googleSequence.current++;
      window.clearInterval(timer);
      window.removeEventListener('focus',refresh);
      document.removeEventListener('visibilitychange',refresh);
    };
  },[loadGoogle]);

  const linkedGoogleIds=useMemo(()=>new Set(meetings.map(m=>m.external_calendar_id).filter((s):s is string=>!!s)),[meetings]);
  const googleOnly=useMemo(()=>googleEvents.filter(e=>!linkedGoogleIds.has(e.id)),[googleEvents,linkedGoogleIds]);
  const upcoming=useMemo(()=>meetings.filter(meeting=>new Date(meeting.starts_at).getTime()>=Date.now()&&['pendiente','confirmada'].includes(meeting.status)),[meetings]);
  const upcomingGoogle=googleOnly.filter(e=>Date.parse(e.endsAt)>=Date.now());
  const futureMeetings=meetings.filter(m=>Date.parse(m.starts_at)>=Date.now());
  const attendanceCounts={
    pending:futureMeetings.filter(m=>m.attendance_status==='por_confirmar' &&
      m.status!=='cancelada' && m.status!=='realizada').length,
    confirmed:futureMeetings.filter(m=>m.attendance_status==='confirmada' &&
      m.status==='confirmada').length,
    reminded:futureMeetings.filter(m=>m.attendance_reminder_at &&
      m.attendance_status==='por_confirmar'&&m.status==='pendiente').length,
    needsAttention:futureMeetings.filter(m=>m.attendance_status==='requiere_atencion' &&
      m.status!=='cancelada').length,
    cancelled:futureMeetings.filter(m=>m.status==='cancelada').length,
  };
  const dayGoogle=showGoogle?googleOnly.filter(e=>googleEventOverlapsDay(e,selectedDay)):[];

  const dayMeetings=meetings.filter(meeting=>meetingDateKey(meeting.starts_at)===selectedDay);

  function move(amount:number){
    if(mode==='week'){
      const anchor=new Date(selectedDay+'T12:00:00Z');anchor.setUTCDate(anchor.getUTCDate()+amount*7);setSelectedDay(dateKey(anchor));
      setCursor(new Date(Date.UTC(anchor.getUTCFullYear(),anchor.getUTCMonth(),1)));
    }else setCursor(new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()+amount,1)));
  }
  function today(){
    const now=new Date();const key=meetingDateKey(now.toISOString());setSelectedDay(key);
    const [year,month]=key.split('-').map(Number);if(year&&month)setCursor(new Date(Date.UTC(year,month-1,1)));
  }
  async function updateMeetingStatus(status:string){
    if(!selected)return;
    setSaving(true);setMessage('');
    if(status==='cancelada'&&!window.confirm('¿Cancelar esta reunión también en Google Calendar?')){setSaving(false);return;}
    let data: Tables<'crm_meetings'> | null = null;
    let errorMessage = '';
    if(status==='cancelada'){
      try {
        await calendarApi('cancel',selected.id);
        data={...selected,status:'cancelada',updated_at:new Date().toISOString()};
      } catch(error){errorMessage=error instanceof Error?error.message:'No se pudo cancelar la reunión.';}
    } else {
      const result=await supabase.from('crm_meetings').update({status,updated_at:new Date().toISOString()}).eq('id',selected.id).select('*').single();
      data=result.data;errorMessage=result.error?.message||'';
    }
    if(errorMessage||!data)setMessage(errorMessage||'No pude actualizar el estado de la reunión.');
    else{
      const updated={...selected,...data,crm_contacts:selected.crm_contacts};
      setMeetings(items=>items.map(item=>item.id===updated.id?updated:item));setSelected(updated);onChanged();
    }
    setSaving(false);
  }

  return <section className="clb-agenda">
    <div className="clb-toolbar">
      <div className="clb-segment"><button className={mode==='month'?'active':''} onClick={()=>setMode('month')}>Mes</button><button className={mode==='week'?'active':''} onClick={()=>setMode('week')}>Semana</button></div>
      <div className="clb-calendar-nav"><button onClick={()=>move(-1)} aria-label="Anterior">←</button><b>{mode==='month'?monthLabel(cursor):'Semana seleccionada'}</b><button onClick={()=>move(1)} aria-label="Siguiente">→</button><button onClick={today}>Hoy</button></div>
    </div>
    {message&&<div className="crm-alert">{message}</div>}
    <div className="clb-attendance-summary" aria-label="Confirmaciones de asistencia del agente WhatsApp">
      <div><span>Por confirmar</span><strong>{attendanceCounts.pending}</strong></div>
      <div><span>Confirmadas por respuesta</span><strong>{attendanceCounts.confirmed}</strong></div>
      <div><span>Recordatorios enviados sin respuesta</span><strong>{attendanceCounts.reminded}</strong></div>
      <div><span>Requieren atención</span><strong>{attendanceCounts.needsAttention}</strong></div>
      <div><span>Canceladas</span><strong>{attendanceCounts.cancelled}</strong></div>
    </div>
    <p className="clb-muted clb-attendance-help">Reservar una cita no confirma asistencia.
      El agente pregunta aproximadamente 24 horas antes y el CRM cambia el estado
      cuando recibe una respuesta verificada de esa cita.</p>
    <div className="clb-agenda-google-tools">
      <label><input type="checkbox" checked={showGoogle} onChange={event=>setShowGoogle(event.target.checked)}/>
        Mostrar eventos reales de Google Calendar
      </label>
      <span>{googleLoading?'Consultando Google...':googleError?'Google no disponible':
        googleLoaded?`${googleOnly.length} eventos de Google sin vínculo CRM · ${linkedGoogleIds.size} reuniones vinculadas`:'Sin comprobar'}</span>
      <button type="button" className="crm-secondary" disabled={googleLoading}
        onClick={()=>void loadGoogle()}>Actualizar Google</button>
    </div>
    {googleError&&<div className="crm-alert" role="alert">
      No es posible mostrar Google Calendar: {googleError}
      <button type="button" onClick={onOpenReview}>Revisar Configuración</button>
    </div>}
    {googleLoaded&&<p className="clb-muted clb-google-agenda-explainer">
      Los eventos de Google se muestran aunque no tengan cliente en el CRM. Las franjas de disponibilidad
      de la página de reservas de Google no son citas confirmadas y no se importan como reuniones.
      {googleCheckedAt?' Última consulta: '+shortMeetingDate(googleCheckedAt)+'.':''}
    </p>}
    <div className="clb-agenda-grid">
      <div className="clb-calendar-card">
        <div className="clb-weekdays">{WEEKDAYS.map(day=><span key={day}>{day}</span>)}</div>
        <div className={'clb-calendar '+mode}>
          {days.map(day=>{
            const key=dateKey(day);const items=meetings.filter(meeting=>meetingDateKey(meeting.starts_at)===key);
            const googleItems=showGoogle?googleOnly.filter(event=>googleEventOverlapsDay(event,key)):[];
            const outside=mode==='month'&&day.getUTCMonth()!==cursor.getUTCMonth();
            return <button key={key} className={'clb-day '+(outside?'outside ':'')+(key===selectedDay?'selected':'')} onClick={()=>setSelectedDay(key)}>
              <span>{day.getUTCDate()}</span><div>
                {items.slice(0,2).map(meeting=><i key={meeting.id} className={'meeting-'+attendanceStatusClass(meeting.attendance_status,meeting.status)} title={meeting.crm_contacts?.full_name||'Reunión'}>{shortMeetingDate(meeting.starts_at).split(', ').pop()} · {meeting.crm_contacts?.full_name||'Reunión'}</i>)}
                {googleItems.slice(0,2).map(event=><i key={'google-'+event.id} className="clb-google-day-marker" title={'Google Calendar: '+event.title}>{event.allDay?'Todo el día':shortMeetingDate(event.startsAt).split(', ').pop()} · {event.title}</i>)}
                {items.length+googleItems.length>4&&<small>+{items.length+googleItems.length-4} más</small>}
              </div>
            </button>;
          })}
        </div>
        <div className="clb-day-list">
          <h3>Agenda del {selectedDay.split('-').reverse().join('/')}</h3>
          {!dayMeetings.length&&(!dayGoogle.length||!googleLoaded)&&
            <p>{googleLoading?'Cargando eventos de Google...':'No hay reuniones del CRM para esta fecha.'}</p>}
          {dayMeetings.map(meeting=><MeetingRow key={meeting.id} meeting={meeting} onClick={()=>setSelected(meeting)}/>)}
          {dayGoogle.map(event=><GoogleAgendaRow key={event.id} event={event} onClick={()=>setSelectedGoogle(event)}/>)}
        </div>
      </div>
      <aside className="clb-upcoming"><div className="clb-panel-title"><div><span>AGENDA</span><h2>Próximas reuniones del CRM</h2></div><b>{upcoming.length}</b></div>
        {loading?<p className="clb-muted">Cargando agenda…</p>:!upcoming.length?<p className="clb-muted">No hay citas próximas del CRM confirmadas o pendientes.</p>:upcoming.map(meeting=><MeetingRow key={meeting.id} meeting={meeting} onClick={()=>setSelected(meeting)}/>) }
        {showGoogle&&<div className="clb-google-upcoming">
          <h3>Eventos próximos de Google <b>{googleLoaded?upcomingGoogle.length:'—'}</b></h3>
          {googleLoading&&!googleLoaded?<p className="clb-muted">Cargando eventos...</p>:
          googleLoaded&&!upcomingGoogle.length?<p className="clb-muted">No hay eventos adicionales en el período visible.</p>:
          upcomingGoogle.slice(0,12).map(event=><GoogleAgendaRow key={event.id} event={event} onClick={()=>setSelectedGoogle(event)}/>)}
        </div>}
      </aside>
    </div>
    {selectedGoogle&&<div className="crm-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedGoogle(null);}}>
      <section className="crm-modal">
        <div className="crm-modal-head"><div><span>GOOGLE CALENDAR · SIN VINCULAR</span>
          <h2>{selectedGoogle.title}</h2><p>{selectedGoogle.allDay?'Evento de día completo':shortMeetingDate(selectedGoogle.startsAt)} · Colombia</p></div>
          <button type="button" onClick={()=>setSelectedGoogle(null)} aria-label="Cerrar">×</button>
        </div>
        <p className="clb-muted">Este evento existe en Google, pero no tiene una ficha de reunión vinculada en el CRM.
          No se ha creado un cliente ficticio ni se ha enviado ninguna confirmación.</p>
        <p className="clb-muted">{selectedGoogle.allDay?'Evento de día completo, no necesariamente una reserva.':
          'Comprueba quién realizó la reserva antes de vincularlo a un cliente.'}</p>
        <div className="crm-modal-actions">
          <button type="button" onClick={()=>setSelectedGoogle(null)}>Cerrar</button>
          {!selectedGoogle.allDay&&<button type="button" className="crm-primary"
            onClick={()=>{setSelectedGoogle(null);onOpenReview();}}>Revisar y vincular cliente</button>}
        </div>
      </section>
    </div>}
    {selected&&<div className="crm-modal-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)setSelected(null);}}><section className="crm-modal clb-meeting-modal">
      <div className="crm-modal-head"><div><span>REUNIÓN</span><h2>{selected.crm_contacts?.full_name||'Contacto'}</h2><p>{formatMeetingDate(selected.starts_at)} · Hora de Colombia</p></div><button onClick={()=>setSelected(null)} aria-label="Cerrar">×</button></div>
      <div className="crm-fields"><Field label="Marca / empresa" value={selected.crm_contacts?.brand_name}/><Field label="Servicio" value={selected.service_interest||selected.crm_contacts?.solution_interest}/><Field label="WhatsApp" value={selected.attendee_whatsapp||selected.crm_contacts?.whatsapp}/><Field label="Correo" value={selected.attendee_email||selected.crm_contacts?.email}/></div>
      <div className="clb-attendance-detail" role="status">
        <span>CONFIRMACIÓN DE ASISTENCIA · WHATSAPP IA</span>
        <strong className={'meeting-'+attendanceStatusClass(selected.attendance_status,selected.status)}>
          {attendanceStatusLabel(selected.attendance_status,selected.status)}</strong>
        <small>Recordatorio 24 horas antes: {selected.attendance_reminder_at
          ? shortMeetingDate(selected.attendance_reminder_at)+' (envío registrado por el agente)'
          : 'sin envío registrado en el CRM'}</small>
        <small>Respuesta del cliente: {selected.attendance_responded_at
          ? shortMeetingDate(selected.attendance_responded_at):'sin respuesta registrada'}</small>
        {selected.attendance_response_text&&<p>Respuesta: {selected.attendance_response_text}</p>}
        {selected.calendar_cancel_pending&&<p className="crm-alert">El cliente rechazó la asistencia.
          La cita ya está cancelada en el CRM, pero falta comprobar su cancelación en Google Calendar.</p>}
        {selected.attendance_status==='no_asistira'&&!selected.external_calendar_id&&
          <p className="crm-alert">El CRM canceló la cita. Este registro no tiene un identificador de Google
            vinculado; revisa si existe una reserva independiente en Google Calendar.</p>}
        <small>El evento "cita_confirmada" del agente comercial NO significa que el cliente haya aceptado asistir.</small>
      </div>
      <label className="crm-control-label">Resultado operativo de la reunión</label>
      <select className="crm-control" value={selected.status} disabled={saving}
        onChange={event=>void updateMeetingStatus(event.target.value)}>
        {!MEETING_STATUSES.some(([value])=>value===selected.status)&&
          <option value={selected.status}>{meetingStatusLabel(selected.status)}</option>}
        {MEETING_STATUSES.filter(([value])=>value===selected.status ||
          (selected.status!=='cancelada'&&['realizada','no_asistio','cancelada'].includes(value)))
          .map(([value,label])=><option key={value} value={value}>{label}</option>)}
      </select>
      <p className="clb-muted">La confirmación de asistencia la determina el agente.
        El administrador puede registrar resultados posteriores o cancelar por motivos operativos.</p>
      <div className="clb-notifications"><h3>Notificaciones</h3>{!notifications.length&&<p className="clb-muted">No hay registros de notificación para esta reunión.</p>}{notifications.map(notification=><div key={notification.id}><span><b>{notification.channel==='whatsapp'?'WhatsApp':'Email'} · {notification.recipient_type==='admin'?'Administrador':'Cliente'}</b><small>{notification.recipient}</small></span><em className={'notification-'+notification.status}>{notificationStatusLabel(notification.channel,notification.status)}</em></div>)}</div>
      {selected.external_calendar_id
        ? <div className="clb-meeting-reschedule">
            <strong>Google Calendar vinculado</strong>
            <p className="clb-muted">Puedes cambiar el horario aquí. Se comprobarán los conflictos en Google y en el CRM antes de confirmar.</p>
            {selected.status!=='cancelada'&&<>
              <label className="crm-control-label" htmlFor="crm-reschedule-start">Nuevo día y hora (Colombia)</label>
              <input id="crm-reschedule-start" type="datetime-local" value={newAppointmentStart}
                onChange={e=>setNewAppointmentStart(e.target.value)} disabled={saving}/>
              <button type="button" className="crm-secondary" disabled={saving||!newAppointmentStart}
                onClick={()=>void rescheduleMeeting()}>Guardar nuevo horario en ambos calendarios</button>
            </>}
          </div>
        : <p className="clb-muted">Esta reserva está guardada en el CRM, pero no tiene una sincronización confirmada con Google Calendar. Revisa la configuración y el estado del calendario.</p>}
      {selected.meeting_url
        ? <p><a href={selected.meeting_url} target="_blank" rel="noopener noreferrer">Abrir enlace de videollamada</a></p>
        : <p className="clb-muted">Todavía no se ha generado un enlace de videollamada.</p>}
      <div className="crm-modal-actions"><button onClick={()=>setSelected(null)}>Cerrar</button><button className="crm-primary" onClick={()=>{const id=selected.contact_id;setSelected(null);onOpenContact(id);}}>Ir al contacto</button></div>
    </section></div>}
  </section>;
}

function MeetingRow({meeting,onClick}:{meeting:CrmMeeting;onClick:()=>void}){
  return <button className="clb-meeting-row" onClick={onClick}><span className="clb-meeting-date">{shortMeetingDate(meeting.starts_at)}</span><span><b>{meeting.crm_contacts?.full_name||'Contacto'}</b><small>{meeting.crm_contacts?.brand_name||meeting.service_interest||'Diagnóstico'}</small></span><em className={'meeting-'+attendanceStatusClass(meeting.attendance_status,meeting.status)}>
        {attendanceStatusLabel(meeting.attendance_status,meeting.status)}
      </em></button>;
}
function GoogleAgendaRow({event,onClick}:{event:GoogleAgendaEvent;onClick:()=>void}){
 return <button type="button" className="clb-meeting-row clb-google-event-row" onClick={onClick}>
   <span className="clb-meeting-date">{event.allDay?'Todo el día':shortMeetingDate(event.startsAt)}</span>
   <span><b>{event.title}</b><small>Google Calendar · sin vínculo con un cliente del CRM</small></span>
   <em>Google</em>
 </button>;
}

function Field({label,value}:{label:string;value:string|null|undefined}){return <div className="crm-field"><span>{label}</span><b>{value||'—'}</b></div>;}
