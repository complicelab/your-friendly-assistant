import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { BOOKING_TIMEZONE, validateAvailabilityRanges, validateBookingSettings, type AvailabilityRangeInput } from '@/lib/booking-model';

type Settings = Tables<'crm_booking_settings'>;
type Exception = Tables<'crm_availability_exceptions'>;
type Range = AvailabilityRangeInput & {active?:boolean};
const DAYS=[['Domingo',0],['Lunes',1],['Martes',2],['Miércoles',3],['Jueves',4],['Viernes',5],['Sábado',6]] as const;
const DEFAULT_RANGES:Record<number,Range[]>={0:[],1:[],2:[],3:[],4:[],5:[],6:[]};

export function CrmBookingSettings(){
  const [settings,setSettings]=useState<Settings|null>(null);
  const [duration,setDuration]=useState('60');const [interval,setInterval]=useState('60');
  const [adminEmail,setAdminEmail]=useState('complicelab@gmail.com');const [adminWhatsapp,setAdminWhatsapp]=useState('');
  const [ranges,setRanges]=useState<Record<number,Range[]>>(DEFAULT_RANGES);
  const [exceptions,setExceptions]=useState<Exception[]>([]);
  const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [message,setMessage]=useState('');
  const [exceptionDate,setExceptionDate]=useState('');const [exceptionAvailable,setExceptionAvailable]=useState(false);
  const [exceptionStart,setExceptionStart]=useState('09:00');const [exceptionEnd,setExceptionEnd]=useState('12:00');const [exceptionReason,setExceptionReason]=useState('');

  async function load(){
    setLoading(true);
    const [settingsResult,rulesResult,exceptionsResult]=await Promise.all([
      supabase.from('crm_booking_settings').select('*').limit(1).maybeSingle(),
      supabase.from('crm_availability_rules').select('*').order('day_of_week').order('start_time'),
      supabase.from('crm_availability_exceptions').select('*').order('date',{ascending:true}),
    ]);
    if(settingsResult.error||rulesResult.error||exceptionsResult.error)setMessage('No pude cargar la configuración de agenda.');
    const value=settingsResult.data;setSettings(value);
    if(value){setDuration(String(value.meeting_duration_minutes));setInterval(String(value.slot_minutes));setAdminEmail(value.admin_email);setAdminWhatsapp(value.admin_whatsapp||'');}
    const next:Record<number,Range[]>={0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
    (rulesResult.data||[]).filter(rule=>rule.active).forEach(rule=>next[rule.day_of_week].push({id:rule.id,day_of_week:rule.day_of_week,start_time:rule.start_time.slice(0,5),end_time:rule.end_time.slice(0,5)}));
    setRanges(next);setExceptions(exceptionsResult.data||[]);setLoading(false);
  }
  useEffect(()=>{void load();},[]);

  function updateRange(day:number,index:number,key:'start_time'|'end_time',value:string){setRanges(current=>({...current,[day]:current[day].map((range,i)=>i===index?{...range,[key]:value}:range)}));}
  function toggleDay(day:number,enabled:boolean){setRanges(current=>({...current,[day]:enabled?(current[day].length?current[day]:[{day_of_week:day,start_time:'09:00',end_time:'17:00'}]):[]}));}
  function toggleSecondRange(day:number){setRanges(current=>{const existing=current[day];return {...current,[day]:existing.length===2?[existing[0]]:[...existing,{day_of_week:day,start_time:'14:00',end_time:'17:00'}]};});}

  async function save(){
    setMessage('');
    const settingsError=validateBookingSettings({meeting_duration_minutes:Number(duration),slot_minutes:Number(interval),admin_email:adminEmail});
    if(settingsError)return setMessage(settingsError);
    const activeRanges=Object.values(ranges).flat();
    const rangeError=validateAvailabilityRanges(activeRanges);
    if(rangeError)return setMessage(rangeError);
    setSaving(true);
    const payload={meeting_duration_minutes:Number(duration),slot_minutes:Number(interval),admin_email:adminEmail.trim(),admin_whatsapp:adminWhatsapp.trim()||null,timezone:BOOKING_TIMEZONE,updated_at:new Date().toISOString()};
    const settingsQuery=settings?supabase.from('crm_booking_settings').update(payload).eq('id',settings.id):supabase.from('crm_booking_settings').insert(payload);
    const {error:settingsSaveError}=await settingsQuery;
    if(settingsSaveError){setMessage('No pude guardar la configuración general.');setSaving(false);return;}
    const {data:existing}=await supabase.from('crm_availability_rules').select('id');
    const rows=activeRanges.map(range=>({...(range.id?{id:range.id}:{}),day_of_week:range.day_of_week,start_time:range.start_time,end_time:range.end_time,active:true,updated_at:new Date().toISOString()}));
    if(rows.length){const {error}=await supabase.from('crm_availability_rules').upsert(rows);if(error){setMessage('No pude guardar las franjas semanales.');setSaving(false);return;}}
    const kept=new Set(activeRanges.map(range=>range.id).filter(Boolean));
    const obsolete=(existing||[]).map(row=>row.id).filter(id=>!kept.has(id));
    if(obsolete.length){const {error}=await supabase.from('crm_availability_rules').delete().in('id',obsolete);if(error){setMessage('Los horarios se guardaron, pero no pude retirar algunas franjas anteriores. Revisa la lista.');setSaving(false);return;}}
    setMessage('Disponibilidad guardada. La home la consultará directamente, sin republicar.');await load();setSaving(false);
  }

  async function addException(){
    setMessage('');
    if(!exceptionDate)return setMessage('Elige la fecha de la excepción.');
    if(exceptionAvailable&&exceptionStart>=exceptionEnd)return setMessage('La hora final de la excepción debe ser posterior a la inicial.');
    setSaving(true);
    const {error}=await supabase.from('crm_availability_exceptions').insert({date:exceptionDate,is_available:exceptionAvailable,start_time:exceptionAvailable?exceptionStart:null,end_time:exceptionAvailable?exceptionEnd:null,reason:exceptionReason.trim()||null});
    if(error)setMessage('No pude crear la excepción.');else{setExceptionDate('');setExceptionReason('');setMessage('Excepción creada. La disponibilidad pública ya la tendrá en cuenta.');await load();}
    setSaving(false);
  }
  async function removeException(id:string){setSaving(true);const {error}=await supabase.from('crm_availability_exceptions').delete().eq('id',id);setMessage(error?'No pude eliminar la excepción.':'Excepción eliminada.');if(!error)await load();setSaving(false);}

  if(loading)return <section className="clb-settings"><p className="clb-muted">Cargando configuración…</p></section>;
  return <section className="clb-settings">
    {message&&<div className="crm-alert">{message}</div>}
    <div className="clb-settings-card"><div className="clb-panel-title"><div><span>AGENDA DE DIAGNÓSTICO</span><h2>Configuración general</h2></div><b>{BOOKING_TIMEZONE}</b></div>
      <div className="clb-settings-grid"><label>Duración de reunión (minutos)<input type="number" min="15" max="180" step="5" value={duration} onChange={event=>setDuration(event.target.value)}/></label><label>Intervalo entre horarios (minutos)<input type="number" min="5" max="180" step="5" value={interval} onChange={event=>setInterval(event.target.value)}/></label><label>Correo administrador<input type="email" value={adminEmail} onChange={event=>setAdminEmail(event.target.value)}/></label><label>WhatsApp administrador<input value={adminWhatsapp} onChange={event=>setAdminWhatsapp(event.target.value)} placeholder="+57…"/></label></div>
      <p className="clb-muted">Zona horaria fija: America/Bogota. La duración y el intervalo cambian los horarios que se ofrecen en la home.</p>
    </div>
    <div className="clb-settings-card"><div className="clb-panel-title"><div><span>DISPONIBILIDAD SEMANAL</span><h2>Días y franjas horarias</h2></div></div>
      <div className="clb-rules">{DAYS.map(([label,day])=><div className={'clb-rule '+(ranges[day].length?'active':'')} key={day}><label className="clb-day-toggle"><input type="checkbox" checked={ranges[day].length>0} onChange={event=>toggleDay(day,event.target.checked)}/><b>{label}</b></label><div className="clb-ranges">{!ranges[day].length&&<span>No disponible</span>}{ranges[day].map((range,index)=><div className="clb-range" key={range.id||index}><input aria-label={`Inicio ${label} ${index+1}`} type="time" value={range.start_time} onChange={event=>updateRange(day,index,'start_time',event.target.value)}/><span>a</span><input aria-label={`Fin ${label} ${index+1}`} type="time" value={range.end_time} onChange={event=>updateRange(day,index,'end_time',event.target.value)}/></div>)}</div>{ranges[day].length>0&&<button className="clb-text-button" onClick={()=>toggleSecondRange(day)}>{ranges[day].length===2?'Quitar segunda franja':'+ Segunda franja'}</button>}</div>)}</div>
      <div className="clb-save-row"><button className="crm-primary" disabled={saving} onClick={()=>void save()}>{saving?'Guardando…':'Guardar disponibilidad'}</button></div>
    </div>
    <div className="clb-settings-card"><div className="clb-panel-title"><div><span>FECHAS ESPECÍFICAS</span><h2>Bloqueos y excepciones</h2></div></div>
      <div className="clb-exception-form"><label>Fecha<input type="date" value={exceptionDate} onChange={event=>setExceptionDate(event.target.value)}/></label><label>Tipo<select value={exceptionAvailable?'available':'blocked'} onChange={event=>setExceptionAvailable(event.target.value==='available')}><option value="blocked">No disponible</option><option value="available">Disponible con horario especial</option></select></label>{exceptionAvailable&&<><label>Inicio<input type="time" value={exceptionStart} onChange={event=>setExceptionStart(event.target.value)}/></label><label>Fin<input type="time" value={exceptionEnd} onChange={event=>setExceptionEnd(event.target.value)}/></label></>}<label>Motivo<input value={exceptionReason} onChange={event=>setExceptionReason(event.target.value)} placeholder="Opcional"/></label><button className="crm-secondary" disabled={saving} onClick={()=>void addException()}>Añadir excepción</button></div>
      <div className="clb-exceptions">{!exceptions.length&&<p className="clb-muted">No hay fechas con excepciones.</p>}{exceptions.map(exception=><div key={exception.id}><span><b>{exception.date}</b><small>{exception.is_available?`Disponible · ${exception.start_time?.slice(0,5)}–${exception.end_time?.slice(0,5)}`:'No disponible'}{exception.reason?` · ${exception.reason}`:''}</small></span><button onClick={()=>void removeException(exception.id)} disabled={saving}>Eliminar</button></div>)}</div>
    </div>
  </section>;
}
