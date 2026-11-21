import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { calendarCommand } from '@/components/crm/calendar-connection-settings';

type Contact=Pick<Tables<'crm_contacts'>,'id'|'full_name'|'brand_name'|'email'|'whatsapp'>;
type ReviewEvent={
 id:string;title:string;startsAt:string;endsAt:string;guests:string[];
 suggestedContactId:string|null;ambiguous:boolean;
};
type ReviewResult={
 pending:ReviewEvent[];ignored:ReviewEvent[];
 pending_total:number;ignored_total:number;truncated:boolean;
};
const EMPTY:ReviewResult={pending:[],ignored:[],pending_total:0,ignored_total:0,truncated:false};
const dateLabel=(value:string)=>new Intl.DateTimeFormat('es-CO',{
 dateStyle:'medium',timeStyle:'short',timeZone:'America/Bogota',
}).format(new Date(value));

export function CalendarEventReview({refreshKey}:{refreshKey:string}){
 const [result,setResult]=useState<ReviewResult>(EMPTY);
 const [contacts,setContacts]=useState<Contact[]>([]);
 const [mode,setMode]=useState<'pending'|'ignored'>('pending');
 const [selected,setSelected]=useState<Record<string,string>>({});
 const [search,setSearch]=useState('');
 const [busy,setBusy]=useState('');
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [loaded,setLoaded]=useState(false);
 const [probe,setProbe]=useState('');

 async function refresh(){
  setBusy('loading');setError('');
  try{
   const [events,clients]=await Promise.all([
    calendarCommand({action:'review'}),
    supabase.from('crm_contacts').select('id,full_name,brand_name,email,whatsapp')
      .order('created_at',{ascending:false}).limit(500),
   ]);
   if(clients.error)throw Error('No se pudo recuperar la lista de clientes del CRM.');
   setResult(events as ReviewResult);
   setContacts(clients.data||[]);
   setLoaded(true);
  }catch(e){setError(e instanceof Error?e.message:'No se pudo consultar Google Calendar.');}
  finally{setBusy('');}
 }
 useEffect(()=>{void refresh();},[refreshKey]);

 const matchingContacts=useMemo(()=>{
  const q=search.toLocaleLowerCase().trim();
  return !q?contacts:contacts.filter(c=>
   [c.full_name,c.brand_name,c.email,c.whatsapp].some(v=>(v||'').toLocaleLowerCase().includes(q)));
 },[contacts,search]);

 async function act(action:'link'|'ignore'|'restore',event:ReviewEvent){
  if(action==='link'){
   const contact=contacts.find(c=>c.id===selected[event.id]);
   if(!contact){setError('Selecciona primero al cliente correspondiente.');return;}
   if(!window.confirm('¿Vincular "'+event.title+'" con '+contact.full_name+
      '? No se enviarán nuevas confirmaciones ni se creará otro cliente.'))return;
  }
  if(action==='ignore'&&!window.confirm('¿Ignorar este evento en futuras sincronizaciones? Podrás restaurarlo.'))return;
  setError('');setNotice('');setBusy(event.id);
  try{
   const response=await calendarCommand({
    action,event_id:event.id,...(action==='link'?{contact_id:selected[event.id]!}:{}),
   });
   setNotice(action==='link'?'Cita vinculada correctamente al CRM ('+response.meeting_id+').':
    action==='ignore'?'Evento marcado como ignorado.':'Evento devuelto a revisión.');
   await refresh();
  }catch(e){setError(e instanceof Error?e.message:'No se pudo completar la operación.');}
  finally{setBusy('');}
 }
 async function testConnection(){
  setProbe('');setError('');setBusy('probe');
  try{
   const info=await calendarCommand({action:'probe'});
   setProbe('Google respondió correctamente. Calendario: '+info.calendar+
    '. Horarios ocupados en las próximas 24 horas: '+info.busyPeriodsNext24h+
    '. Prueba solo de lectura: no se creó ninguna cita.');
  }catch(e){setError(e instanceof Error?e.message:'Falló la comprobación.');}
  finally{setBusy('');}
 }
 const items=mode==='pending'?result.pending:result.ignored;
 return <section className="clb-calendar-review">
  <div className="clb-review-head">
   <div><span>REVISIÓN DE AGENDA</span><h3>Citas de Google sin cliente asociado</h3>
     <p>Revisa cada evento, relaciónalo con un cliente existente o ignóralo. No se generan contactos ni se envían avisos al vincular.</p></div>
   <div className="clb-review-actions">
    <button type="button" className="crm-secondary" disabled={!!busy}
      onClick={()=>void testConnection()}>{busy==='probe'?'Probando...':'Probar conexión (solo lectura)'}</button>
    <button type="button" className="crm-secondary" disabled={!!busy}
      onClick={()=>void refresh()}>{busy==='loading'?'Cargando...':'Actualizar citas'}</button>
   </div>
  </div>
  {probe&&<p role="status" className="clb-review-note">{probe}</p>}
  {error&&<p role="alert" className="crm-alert">{error}</p>}
  {notice&&<p role="status" className="clb-review-note">{notice}</p>}
  <div className="clb-review-tabs">
   <button type="button" className={mode==='pending'?'active':''}
    onClick={()=>setMode('pending')}>Por revisar ({result.pending_total})</button>
   <button type="button" className={mode==='ignored'?'active':''}
    onClick={()=>setMode('ignored')}>Ignoradas ({result.ignored_total})</button>
  </div>
  {loaded&&result.truncated&&<p className="crm-alert">Hay más de 150 eventos. Se muestra una muestra limitada para evitar cargar una agenda demasiado extensa.</p>}
  <div className="clb-review-list">
  {!items.length&&<p className="clb-muted">{loaded?'No hay eventos en esta categoría.':'Consultando el calendario...'}</p>}
  {items.map(event=>{
   const client=contacts.find(c=>c.id===event.suggestedContactId);
   const selectedId=selected[event.id]||'';
   return <article key={event.id} className="clb-review-event">
    <div className="clb-review-event-info">
     <strong>{event.title}</strong>
     <span>{dateLabel(event.startsAt)} · Hora de Colombia</span>
     <small>{event.guests.length?'Invitados: '+event.guests.join(', '):'Sin correo de invitado identificado'}</small>
     {event.ambiguous&&<small>Varias coincidencias posibles: requiere selección manual.</small>}
     {client&&<small>Coincidencia sugerida: {client.full_name} (verifica antes de vincular).</small>}
    </div>
    {mode==='pending'?<div className="clb-review-controls">
     <input aria-label={'Buscar cliente para '+event.title} placeholder="Filtrar clientes..."
      value={search} onChange={e=>setSearch(e.target.value)} />
     <select aria-label={'Cliente para '+event.title} value={selectedId}
      onChange={e=>setSelected(curr=>({...curr,[event.id]:e.target.value}))}>
      <option value="">Seleccionar cliente del CRM</option>
      {matchingContacts.map(c=><option key={c.id} value={c.id}>
       {c.full_name}{c.brand_name?' · '+c.brand_name:''}{c.email?' · '+c.email:''}
      </option>)}
     </select>
     <div><button type="button" className="crm-primary" disabled={!!busy||!selectedId}
      onClick={()=>void act('link',event)}>Vincular</button>
      <button type="button" className="crm-secondary" disabled={!!busy}
       onClick={()=>void act('ignore',event)}>Ignorar</button></div>
    </div>:<div className="clb-review-controls"><button type="button" className="crm-secondary"
     disabled={!!busy} onClick={()=>void act('restore',event)}>Volver a revisar</button></div>}
   </article>;
  })}
  </div>
 </section>;
}
