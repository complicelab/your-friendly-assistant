import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { BOOKING_TIMEZONE, MEETING_STATUSES, formatMeetingDate, meetingStatusLabel, notificationStatusLabel } from '@/lib/booking-model';

type ContactSummary = Pick<Tables<'crm_contacts'>, 'id'|'full_name'|'brand_name'|'whatsapp'|'email'|'solution_interest'>;
export type CrmMeeting = Tables<'crm_meetings'> & { crm_contacts: ContactSummary | null };
type Notification = Tables<'crm_notifications'>;

const WEEKDAYS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

function dateKey(date: Date) { return date.toISOString().slice(0,10); }
function meetingDateKey(value: string) {
  const parts = new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:BOOKING_TIMEZONE}).formatToParts(new Date(value));
  const map = Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return `${map['year']}-${map['month']}-${map['day']}`;
}
function monthLabel(date: Date) { return new Intl.DateTimeFormat('es-CO',{month:'long',year:'numeric',timeZone:'UTC'}).format(date); }
function shortMeetingDate(value: string) { return new Intl.DateTimeFormat('es-CO',{weekday:'short',day:'numeric',month:'short',hour:'numeric',minute:'2-digit',hour12:true,timeZone:BOOKING_TIMEZONE}).format(new Date(value)); }

export function CrmAgenda({onOpenContact,onChanged}:{onOpenContact:(contactId:string)=>void;onChanged:()=>void}) {
  const [meetings,setMeetings]=useState<CrmMeeting[]>([]);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState('');
  const [mode,setMode]=useState<'month'|'week'>('month');
  const [cursor,setCursor]=useState(()=>{const now=new Date();return new Date(Date.UTC(now.getFullYear(),now.getMonth(),1));});
  const [selectedDay,setSelectedDay]=useState(()=>meetingDateKey(new Date().toISOString()));
  const [selected,setSelected]=useState<CrmMeeting|null>(null);
  const [notifications,setNotifications]=useState<Notification[]>([]);
  const [saving,setSaving]=useState(false);

  async function loadMeetings() {
    setLoading(true);
    const {data,error}=await supabase.from('crm_meetings')
      .select('*, crm_contacts(id,full_name,brand_name,whatsapp,email,solution_interest)')
      .order('starts_at',{ascending:true}).limit(500);
    if(error)setMessage('No pude cargar las reuniones.');
    else setMeetings((data||[]) as CrmMeeting[]);
    setLoading(false);
  }
  useEffect(()=>{void loadMeetings();},[]);
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

  const upcoming=useMemo(()=>meetings.filter(meeting=>new Date(meeting.starts_at).getTime()>=Date.now()&&['pendiente','confirmada'].includes(meeting.status)),[meetings]);
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
    const {data,error}=await supabase.from('crm_meetings').update({status,updated_at:new Date().toISOString()}).eq('id',selected.id).select('*').single();
    if(error||!data)setMessage('No pude actualizar el estado de la reunión.');
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
    <div className="clb-agenda-grid">
      <div className="clb-calendar-card">
        <div className="clb-weekdays">{WEEKDAYS.map(day=><span key={day}>{day}</span>)}</div>
        <div className={'clb-calendar '+mode}>
          {days.map(day=>{
            const key=dateKey(day);const items=meetings.filter(meeting=>meetingDateKey(meeting.starts_at)===key);
            const outside=mode==='month'&&day.getUTCMonth()!==cursor.getUTCMonth();
            return <button key={key} className={'clb-day '+(outside?'outside ':'')+(key===selectedDay?'selected':'')} onClick={()=>setSelectedDay(key)}>
              <span>{day.getUTCDate()}</span><div>{items.slice(0,3).map(meeting=><i key={meeting.id} className={'meeting-'+meeting.status} title={meeting.crm_contacts?.full_name||'Reunión'}>{shortMeetingDate(meeting.starts_at).split(', ').pop()} · {meeting.crm_contacts?.full_name||'Reunión'}</i>)}{items.length>3&&<small>+{items.length-3} más</small>}</div>
            </button>;
          })}
        </div>
        <div className="clb-day-list"><h3>Reuniones del {selectedDay.split('-').reverse().join('/')}</h3>{!dayMeetings.length&&<p>No hay reuniones para esta fecha.</p>}{dayMeetings.map(meeting=><MeetingRow key={meeting.id} meeting={meeting} onClick={()=>setSelected(meeting)}/>)}</div>
      </div>
      <aside className="clb-upcoming"><div className="clb-panel-title"><div><span>AGENDA</span><h2>Próximas reuniones</h2></div><b>{upcoming.length}</b></div>
        {loading?<p className="clb-muted">Cargando agenda…</p>:!upcoming.length?<p className="clb-muted">No hay citas próximas confirmadas o pendientes.</p>:upcoming.map(meeting=><MeetingRow key={meeting.id} meeting={meeting} onClick={()=>setSelected(meeting)}/>) }
      </aside>
    </div>
    {selected&&<div className="crm-modal-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)setSelected(null);}}><section className="crm-modal clb-meeting-modal">
      <div className="crm-modal-head"><div><span>REUNIÓN</span><h2>{selected.crm_contacts?.full_name||'Contacto'}</h2><p>{formatMeetingDate(selected.starts_at)} · Hora de Colombia</p></div><button onClick={()=>setSelected(null)} aria-label="Cerrar">×</button></div>
      <div className="crm-fields"><Field label="Marca / empresa" value={selected.crm_contacts?.brand_name}/><Field label="Servicio" value={selected.service_interest||selected.crm_contacts?.solution_interest}/><Field label="WhatsApp" value={selected.attendee_whatsapp||selected.crm_contacts?.whatsapp}/><Field label="Correo" value={selected.attendee_email||selected.crm_contacts?.email}/></div>
      <label className="crm-control-label">Estado de la reunión</label><select className="crm-control" value={selected.status} disabled={saving} onChange={event=>void updateMeetingStatus(event.target.value)}>{!MEETING_STATUSES.some(([value])=>value===selected.status)&&<option value={selected.status}>{meetingStatusLabel(selected.status)}</option>}{MEETING_STATUSES.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select>
      <div className="clb-notifications"><h3>Notificaciones</h3>{!notifications.length&&<p className="clb-muted">No hay registros de notificación para esta reunión.</p>}{notifications.map(notification=><div key={notification.id}><span><b>{notification.channel==='whatsapp'?'WhatsApp':'Email'} · {notification.recipient_type==='admin'?'Administrador':'Cliente'}</b><small>{notification.recipient}</small></span><em className={'notification-'+notification.status}>{notificationStatusLabel(notification.channel,notification.status)}</em></div>)}</div>
      <p className="clb-muted">El enlace de videollamada se agregará cuando exista una integración real. No se ha generado ninguno.</p>
      <div className="crm-modal-actions"><button onClick={()=>setSelected(null)}>Cerrar</button><button className="crm-primary" onClick={()=>{const id=selected.contact_id;setSelected(null);onOpenContact(id);}}>Ir al contacto</button></div>
    </section></div>}
  </section>;
}

function MeetingRow({meeting,onClick}:{meeting:CrmMeeting;onClick:()=>void}){
  return <button className="clb-meeting-row" onClick={onClick}><span className="clb-meeting-date">{shortMeetingDate(meeting.starts_at)}</span><span><b>{meeting.crm_contacts?.full_name||'Contacto'}</b><small>{meeting.crm_contacts?.brand_name||meeting.service_interest||'Diagnóstico'}</small></span><em className={'meeting-'+meeting.status}>{meetingStatusLabel(meeting.status)}</em></button>;
}
function Field({label,value}:{label:string;value:string|null|undefined}){return <div className="crm-field"><span>{label}</span><b>{value||'—'}</b></div>;}
