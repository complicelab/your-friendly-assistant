import {useCallback,useEffect,useMemo,useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {
 commercialFunnel,FUNNEL_STAGE_LABELS,percent,
 type FunnelContact,type FunnelMeeting,type FunnelActivity,
 type CommercialStage,
} from '@/lib/crm-funnel-model';
import './crm-funnel-dashboard.css';

const MAX_ROWS=12000;
const PAGE=1000;
type Period='30'|'90'|'365'|'all';
const sourceName=(source:string)=>{
 const names:Record<string,string>={
  whatsapp_ia:'WhatsApp IA',web:'Sitio web',manual:'Manual',
  meta_ads:'Meta Ads',referido:'Referidos',instagram:'Instagram',
  sin_origen:'Sin origen registrado',
 };
 return names[source]||source.replaceAll('_',' ');
};
type Data={contacts:FunnelContact[];meetings:FunnelMeeting[];activities:FunnelActivity[];truncated:boolean};
const emptyData:Data={contacts:[],meetings:[],activities:[],truncated:false};
async function readPages<T>(loader:(from:number,to:number)=>Promise<{data:T[]|null;error:unknown}>) {
 const all:T[]=[];
 for(let offset=0;offset<MAX_ROWS;offset+=PAGE){
  const {data,error}=await loader(offset,offset+PAGE-1);
  if(error)throw new Error('No fue posible consultar los datos del CRM con permisos de administrador.');
  const rows=data||[];
  all.push(...rows);
  if(rows.length<PAGE)return {rows:all,truncated:false};
 }
 return {rows:all,truncated:true};
}
export function CrmFunnelDashboard(){
 const [period,setPeriod]=useState<Period>('30');
 const [source,setSource]=useState('todos');
 const [includeTests,setIncludeTests]=useState(false);
 const [data,setData]=useState<Data>(emptyData);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [updatedAt,setUpdatedAt]=useState<string|null>(null);
 const refresh=useCallback(async()=>{
  setLoading(true);setError('');
  try {
   const cutoff=period==='all'?null:new Date(Date.now()-Number(period)*86400000).toISOString();
   const [contacts,meetings,activities]=await Promise.all([
    readPages<FunnelContact>(async(from,to)=>{
     let query=supabase.from('crm_contacts')
      .select('id,created_at,status,source,full_name,source_detail,last_contact_at,solution_interest');
     if(cutoff)query=query.gte('created_at',cutoff);
     const {data,error}=await query.order('created_at',{ascending:false}).range(from,to);
     return {data,error};
    }),
    readPages<FunnelMeeting>(async(from,to)=>{
     const {data,error}=await supabase.from('crm_meetings')
      .select('id,contact_id,status,attendance_status,starts_at,created_at')
      .order('created_at',{ascending:false}).range(from,to);
     return {data,error};
    }),
    readPages<FunnelActivity>(async(from,to)=>{
     const {data,error}=await supabase.from('crm_activities')
      .select('contact_id,activity_type,created_at')
      .in('activity_type',['diagnostico_solicitado','interes_confirmado','prospecto_abandonado','abandono_confirmado'])
      .order('created_at',{ascending:false}).range(from,to);
     return {data,error};
    }),
   ]);
   setData({
    contacts:contacts.rows,meetings:meetings.rows,activities:activities.rows,
    truncated:contacts.truncated||meetings.truncated||activities.truncated,
   });
   setUpdatedAt(new Date().toISOString());
  }catch(e){
   setError(e instanceof Error?e.message:'No se pudo generar el embudo.');
  }finally{setLoading(false);}
 },[period]);
 useEffect(()=>{
  void refresh();
  const onFocus=()=>{if(!document.hidden)void refresh();};
  const timer=window.setInterval(onFocus,5*60_000);
  window.addEventListener('focus',onFocus);
  return()=>{window.clearInterval(timer);window.removeEventListener('focus',onFocus);};
 },[refresh]);

 const sources=useMemo(()=>[...new Set(data.contacts.map(c=>c.source||'sin_origen'))].sort(),[data.contacts]);
 const considered=useMemo(()=>source==='todos'
   ?data.contacts:data.contacts.filter(c=>(c.source||'sin_origen')===source),[data.contacts,source]);
 const report=useMemo(()=>commercialFunnel(considered,data.meetings,data.activities,
  {excludeTests:!includeTests}),[considered,data.meetings,data.activities,includeTests]);
 const n=report.totals;
 const stages=(Object.keys(FUNNEL_STAGE_LABELS) as CommercialStage[])
  .map(stage=>({stage,label:FUNNEL_STAGE_LABELS[stage],value:report.stages[stage]}))
  .filter(x=>x.value>0).sort((a,b)=>b.value-a.value);
 const shownTotal=data.contacts.length;
 const eligibleTotal=commercialFunnel(data.contacts,[],[],{excludeTests:true}).totals.leads;
 const excludedCount=shownTotal-eligibleTotal;
 const couldCalculate= !data.truncated && !loading && !error;
 return <section className="cl-funnel">
  <div className="cl-funnel-top">
   <div><span className="cl-funnel-kicker">INTELIGENCIA COMERCIAL</span>
    <h2>Embudo de ventas y efectividad</h2>
    <p>Contactos únicos por fecha de captación. Las citas se verifican contra el CRM;
      la asistencia y las ventas no se deducen de mensajes del agente.</p>
   </div>
   <button type="button" onClick={()=>void refresh()} disabled={loading}>
    {loading?'Actualizando…':'Actualizar métricas'}
   </button>
  </div>
  <div className="cl-funnel-filters">
   <label>Período de captación
    <select value={period} onChange={e=>setPeriod(e.target.value as Period)}>
     <option value="30">Últimos 30 días</option>
     <option value="90">Últimos 90 días</option>
     <option value="365">Últimos 12 meses</option>
     <option value="all">Todos los registros</option>
    </select></label>
   <label>Canal
    <select value={source} onChange={e=>setSource(e.target.value)}>
     <option value="todos">Todos los canales</option>
     {sources.map(s=><option key={s} value={s}>{sourceName(s)}</option>)}
    </select></label>
   <label className="cl-funnel-test"><input type="checkbox" checked={includeTests}
     onChange={e=>setIncludeTests(e.target.checked)}/>
     Incluir contactos de prueba identificados ({excludedCount})
   </label>
  </div>
  {error&&<div className="crm-alert" role="alert">{error}</div>}
  {data.truncated&&<div className="crm-alert" role="alert">
    Se alcanzó el límite de lectura del panel. Los indicadores no son exhaustivos.
    Se necesita una agregación en el servidor para analizar este volumen de datos.</div>}
  {updatedAt&&<p className="cl-funnel-updated">Última consulta: {
    new Intl.DateTimeFormat('es-CO',{dateStyle:'short',timeStyle:'short',timeZone:'America/Bogota'})
     .format(new Date(updatedAt))} · Datos {couldCalculate?'completos para el rango consultado':'en revisión'}
  </p>}
  {!couldCalculate?<p className="cl-funnel-loading" role="status">
   {loading?'Calculando métricas verificables…':'No hay métricas completas disponibles.'}</p>:<>
  <div className="cl-funnel-kpis">
   <Kpi label="Leads recibidos" value={String(n.leads)} note="Contactos únicos"/>
   <Kpi label="Con interés registrado" value={String(n.interested)} note={percent(n.interested,n.leads)+' de leads'}/>
   <Kpi label="Interesados sin cita" value={String(Math.max(0,n.interested-n.booked))}
    note="Seguimiento comercial prioritario"/>
   <Kpi label="Agendaron cita" value={String(n.booked)} note={percent(n.booked,n.leads)+' de leads'}/>
   <Kpi label="Confirmaron asistencia" value={String(n.attendanceConfirmed)}
    note={percent(n.attendanceConfirmed,n.booked)+' de agendados'}/>
   <Kpi label="Asistencia efectiva" value={percent(n.attendedAppointments,n.attendedAppointments+n.noShowAppointments)}
    note={(n.attendedAppointments+n.noShowAppointments)+' citas con resultado definitivo'}/>
   <Kpi label="Citas canceladas" value={String(n.cancelledAppointments)}
    note={percent(n.cancelledAppointments,n.appointments)+' de reservas'}/>
   <Kpi label="Ventas ganadas" value={String(n.won)}
    note={percent(n.won,n.leads)+' de leads'}/>
  </div>
  <div className="cl-funnel-columns">
   <article className="cl-funnel-card">
    <h3>Conversión por etapa</h3>
    <p>Hitos acumulados de los mismos clientes, no una suma de estados actuales.</p>
    {[
     {label:'Leads',value:n.leads},
     {label:'Interesados',value:n.interested},
     {label:'Agendaron',value:n.booked},
     {label:'Confirmaron asistencia',value:n.attendanceConfirmed},
     {label:'Asistieron',value:n.attended},
     {label:'Venta ganada',value:n.won},
    ].map((step,i)=><div className="cl-funnel-bar" key={step.label}>
     <div><span>{i+1}. {step.label}</span><b>{step.value} · {percent(step.value,n.leads)}</b></div>
     <div className="cl-funnel-bar-track"><i style={{width:n.leads?Math.min(100,100*step.value/n.leads)+'%':'0%'}}/></div>
    </div>)}
   </article>
   <article className="cl-funnel-card">
    <h3>Situación actual del cliente</h3>
    <p>Estados mutuamente excluyentes para saber dónde quedó cada contacto.</p>
    {stages.length?stages.map(x=><div className="cl-funnel-stage" key={x.stage}>
     <span>{x.label}</span><strong>{x.value}</strong>
    </div>):<p>No hay contactos en esta selección.</p>}
    <div className="cl-funnel-abandoned">
     <strong>Abandono comercial: {report.abandonmentMeasurable?n.explicitlyAbandoned:'Sin medición verificada'}</strong>
     <p>Una conversación sin respuesta no se clasifica automáticamente como abandonada.
      Para medirla, Railway debe enviar una señal explícita con fecha y motivo.</p>
    </div>
   </article>
  </div>
  <article className="cl-funnel-card">
   <h3>Efectividad por canal de captación</h3>
   <p>Compara de dónde llegan los contactos y cuáles terminan agendando; no mezcla fuentes con resultados. Para atribución por campaña y retorno de pauta se necesitan UTMs y gasto real.</p>
   <div className="cl-funnel-table-wrap"><table>
    <thead><tr><th>Canal</th><th>Leads</th><th>Interesados</th><th>Agendaron</th><th>Tasa de agendamiento</th><th>Ventas ganadas</th></tr></thead>
    <tbody>{report.bySource.map(x=><tr key={x.source}>
     <td>{sourceName(x.source)}</td><td>{x.leads}</td><td>{x.interested}</td>
     <td>{x.booked}</td><td>{percent(x.booked,x.leads)}</td><td>{x.won}</td>
    </tr>)}</tbody>
   </table></div>
  </article>
  <div className="cl-funnel-explain">
   <strong>Cómo interpretar estos números</strong>
   {report.funnelNotes.map(note=><p key={note}>{note}</p>)}
   <p>«Agendaron» incluye a quienes posteriormente cancelaron; eso permite medir tanto la
    capacidad de agendamiento como las pérdidas posteriores. Los registros de prueba identificados
    por su nombre u origen se excluyen por defecto; revisa esas etiquetas si faltan casos.</p>
  </div>
  </>}
 </section>;
}
function Kpi({label,value,note}:{label:string;value:string;note:string}){
 return <div className="cl-funnel-kpi"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}
