import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type CalendarStatus={
  configured:boolean;connected:boolean;email:string|null;
  last_synced_at:string|null;last_error:string|null;
};
type SyncStats={reviewed:number;linked:number;imported:number;updated:number;unlinked:number;ambiguous:number};
const INITIAL:CalendarStatus={configured:false,connected:false,email:null,last_synced_at:null,last_error:null};

async function calendarApi(action?:string,meeting_id?:string) {
 const {data}=await supabase.auth.getSession();
 const token=data.session?.access_token;
 if(!token)throw Error('Inicia sesión nuevamente para administrar la conexión.');
 const response=await fetch('/api/calendar',{
  method:action?'POST':'GET',
  headers:{Authorization:'Bearer '+token,...(action?{'Content-Type':'application/json'}:{})},
  ...(action?{body:JSON.stringify({action,meeting_id})}:{}),
  cache:'no-store',
 });
 const result=await response.json();
 if(!response.ok||!result.ok)throw Error(result.error||'No fue posible conectar el calendario.');
 return result;
}
export {calendarApi};

export function CalendarConnectionSettings(){
 const [status,setStatus]=useState<CalendarStatus>(INITIAL);
 const [loading,setLoading]=useState(true);
 const [action,setAction]=useState('');
 const [message,setMessage]=useState('');
 const [stats,setStats]=useState<SyncStats|null>(null);

 async function refresh(){
  setLoading(true);
  try{setStatus(await calendarApi());}
  catch(error){setMessage(error instanceof Error?error.message:'No se pudo consultar el calendario.');}
  finally{setLoading(false);}
 }
 async function synchronize(){
  setAction('sync');setMessage('');
  try {
   const result=await calendarApi('sync');
   setStats(result.stats);
   setMessage('Sincronización finalizada. Los eventos sin coincidencia quedan sin vincular para proteger los datos.');
   await refresh();
  }catch(error){setMessage(error instanceof Error?error.message:'La sincronización falló.');}
  finally{setAction('');}
 }
 async function connect(){
  setAction('connect');setMessage('');
  try{
   const result=await calendarApi('connect');
   window.location.assign(result.url);
  }catch(error){setMessage(error instanceof Error?error.message:'No se pudo iniciar el enlace.');setAction('');}
 }
 async function disconnect(){
  if(!window.confirm('¿Desconectar Google Calendar? No se eliminarán citas existentes.'))return;
  setAction('disconnect');setMessage('');
  try{await calendarApi('disconnect');setStats(null);setMessage('Google Calendar quedó desconectado.');await refresh();}
  catch(error){setMessage(error instanceof Error?error.message:'No se pudo desconectar.');}
  finally{setAction('');}
 }
 useEffect(()=>{
  void refresh();
  const qp=new URL(window.location.href).searchParams;
  const state=qp.get('calendar');
  if(state){
   const next=new URL(window.location.href);
   next.searchParams.delete('calendar');
   window.history.replaceState({},'',next.pathname+next.search+next.hash);
   if(state==='connected'){
    setMessage('Google autorizó la conexión. Vinculando citas existentes...');
    void synchronize();
   }else setMessage(state==='denied'?'Se canceló la autorización de Google.':'No se completó la conexión con Google. Reintenta desde aquí.');
  }
 },[]);
 useEffect(()=>{
  if(!status.connected)return;
  let busy=false;
  const tick=async()=>{
   if(document.hidden||busy)return;
   busy=true;
   try{await calendarApi('sync');await refresh();}
   catch{/* Failure is shown in the manual sync/status area. */}
   finally{busy=false;}
  };
  const timer=window.setInterval(()=>void tick(),300000);
  const visible=()=>{if(!document.hidden)void tick();};
  document.addEventListener('visibilitychange',visible);
  return()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',visible);};
 },[status.connected]);
 const date=status.last_synced_at?new Intl.DateTimeFormat('es-CO',{
  timeZone:'America/Bogota',dateStyle:'medium',timeStyle:'short',
 }).format(new Date(status.last_synced_at)):null;
 return <section className="clb-settings-card clb-google-card">
  <div className="clb-panel-title">
   <div><span>INTEGRACIONES</span><h2>Google Calendar</h2></div>
   <b>{loading?'Consultando...':status.connected?'Conectado':'Sin conectar'}</b>
  </div>
  <p className="clb-google-copy">Enlaza el calendario de <strong>complicelab@gmail.com</strong> para bloquear horarios ocupados, enviar nuevas reservas al calendario y relacionar citas anteriores con tus clientes.</p>
  {status.connected&&<div className="clb-google-details">
    <span>Cuenta vinculada <strong>{status.email}</strong></span>
    <span>Última sincronización <strong>{date||'Pendiente'}</strong></span>
  </div>}
  {status.last_error&&<p role="alert" className="crm-alert">Última sincronización: {status.last_error}</p>}
  {!loading&&!status.configured&&<p className="crm-alert">Se requiere una configuración inicial única de Google Cloud por parte del administrador técnico. Después podrás conectar o reconectar aquí con un botón.</p>}
  {message&&<p role="status" className="crm-alert">{message}</p>}
  {stats&&<div className="clb-google-stats">
    <span><b>{stats.imported}</b>Nuevas citas vinculadas</span>
    <span><b>{stats.linked}</b>Ya relacionadas</span>
    <span><b>{stats.updated}</b>Actualizadas</span>
    <span><b>{stats.unlinked+stats.ambiguous}</b>Sin vincular / revisión</span>
  </div>}
  <div className="clb-google-actions">
   {!status.connected?
     <button className="crm-primary" type="button" onClick={()=>void connect()} disabled={loading||!!action||!status.configured}>{action==='connect'?'Abriendo Google...':'Enlazar Google Calendar'}</button>:
     <><button className="crm-primary" type="button" onClick={()=>void synchronize()} disabled={!!action}>{action==='sync'?'Sincronizando...':'Sincronizar ahora'}</button>
     <button type="button" className="crm-secondary" onClick={()=>void disconnect()} disabled={!!action}>{action==='disconnect'?'Desconectando...':'Desconectar'}</button></>}
  </div>
  <p className="clb-muted">Las reuniones se relacionan por correo o WhatsApp verificable. Si Google no permite identificar de forma inequívoca al cliente, no se crean registros de contacto nuevos. Para sincronización permanente con el panel cerrado se requiere activar la tarea programada del servidor.</p>
 </section>;
}
