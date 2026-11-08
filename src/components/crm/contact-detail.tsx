import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { isCrmAdministrator } from '@/lib/crm-access';
import { type Contact,type Activity,type Task, STAGES,dateLabel,localDate,sourceLabel,stageLabel } from '@/lib/crm-model';
import { Field,FormField,Stage } from './shared';

export function ContactDetail({contact,onUpdated,onBack}: {contact:Contact;onUpdated:(contact:Contact)=>void;onBack:()=>void}) {
  const [activities,setActivities]=useState<Activity[]>([]);const [tasks,setTasks]=useState<Task[]>([]);
  const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [revision,setRevision]=useState(0);
  useEffect(()=>{let active=true;setLoading(true);
    void Promise.all([supabase.from('crm_activities').select('*').eq('contact_id',contact.id).order('created_at',{ascending:false}),supabase.from('crm_tasks').select('*').eq('contact_id',contact.id).order('created_at',{ascending:false})]).then(([activityResult,taskResult])=>{
      if(!active)return;
      if(activityResult.error||taskResult.error)setMessage('No se pudo cargar todo el historial o las tareas.');
      setActivities(activityResult.data??[]);setTasks(taskResult.data??[]);setLoading(false);
    });return()=>{active=false;};
  },[contact.id,revision]);
  async function authorized(){const {data}=await supabase.auth.getUser();if(!isCrmAdministrator(data.user))throw new Error('Tu sesión no tiene acceso.');}
  async function save(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();const form=new FormData(event.currentTarget);setBusy(true);setMessage('');
    try{await authorized();const status=String(form.get('status'));const next=String(form.get('next_follow_up_at')??'');
      const {data,error}=await supabase.from('crm_contacts').update({status,next_follow_up_at:next?new Date(next).toISOString():null,notes:String(form.get('notes')??'').trim()||null,...(status==='contactado'&&contact.status!==status?{last_contact_at:new Date().toISOString()}:{})}).eq('id',contact.id).select('*').single();
      if(error||!data)throw new Error('No se pudieron guardar los cambios.');
      onUpdated(data);
      let warning='';
      if(contact.status!==status){const {error:activityError}=await supabase.from('crm_activities').insert({contact_id:contact.id,actor_type:'admin',activity_type:'status_changed',body:stageLabel(contact.status)+' → '+stageLabel(status),metadata:{from:contact.status,to:status}});if(activityError)warning=' No se pudo registrar la actividad.';}
      setRevision(value=>value+1);setMessage('Cambios guardados.'+warning);
    }catch(error){setMessage(error instanceof Error?error.message:'No se pudo guardar.');}finally{setBusy(false);}
  }
  async function addTask(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();const element=event.currentTarget;const form=new FormData(element);const title=String(form.get('title')??'').trim();if(!title)return;setBusy(true);setMessage('');
    try{await authorized();const date=String(form.get('due_at')??'');const {error}=await supabase.from('crm_tasks').insert({contact_id:contact.id,title,due_at:date?new Date(date).toISOString():null});if(error)throw new Error('No se pudo crear la tarea.');element.reset();setRevision(value=>value+1);setMessage('Tarea creada.');}catch(error){setMessage(error instanceof Error?error.message:'No se pudo guardar.');}finally{setBusy(false);}
  }
  async function completeTask(task:Task){setBusy(true);try{await authorized();const {error}=await supabase.from('crm_tasks').update({status:'completada',completed_at:new Date().toISOString()}).eq('id',task.id).select('id').single();if(error)throw error;setRevision(value=>value+1);}catch{setMessage('No se pudo completar la tarea.');}finally{setBusy(false);}}
  const activityLabel=(value:string)=>({contact_created:'Contacto creado',status_changed:'Cambio de etapa',new_contact:'Nuevo contacto',task_created:'Tarea creada'}[value]??value);
  return <aside className="crm-detail" aria-label="Detalle del contacto">
    <Button variant="ghost" className="crm-back" onClick={onBack}><ArrowLeft/> Contactos</Button>
    <header className="crm-detail-heading"><div className="crm-avatar crm-avatar-large">{contact.full_name.slice(0,2).toUpperCase()}</div><div><small>OPORTUNIDAD</small><h2>{contact.full_name}</h2><p>{contact.brand_name||'Sin empresa registrada'}</p></div><Stage value={contact.status}/></header>
    {message&&<p className="crm-notice" role="status">{message}</p>}
    <section className="crm-detail-section"><h3>Identidad y contacto</h3><dl className="crm-fields"><Field label="Marca / empresa" value={contact.brand_name}/><Field label="Profesión" value={contact.profession}/><Field label="Tipo de negocio" value={contact.business_type}/><Field label="País" value={contact.country}/><Field label="WhatsApp" value={contact.whatsapp}/><Field label="Correo" value={contact.email}/></dl></section>
    <section className="crm-detail-section"><h3>Oportunidad</h3><dl className="crm-fields"><Field label="Qué necesita" value={contact.need}/><Field label="Servicio de interés" value={contact.solution_interest}/></dl></section>
    <section className="crm-detail-section"><h3>Seguimiento</h3><p className="crm-subtle">Último contacto: {dateLabel(contact.last_contact_at)}</p><form key={contact.updated_at} onSubmit={save} className="crm-form-grid"><FormField label="Etapa comercial"><select name="status" defaultValue={contact.status}>{!STAGES.some(([value])=>value===contact.status)&&<option value={contact.status}>{contact.status}</option>}{STAGES.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></FormField><FormField label="Próximo seguimiento"><input type="datetime-local" name="next_follow_up_at" defaultValue={localDate(contact.next_follow_up_at)}/></FormField><FormField label="Notas" wide><textarea name="notes" defaultValue={contact.notes??''} rows={3}/></FormField><div className="crm-wide"><Button type="submit" disabled={busy}><Save/> Guardar cambios</Button></div></form></section>
    <section className="crm-detail-section"><h3>Tareas <span className="crm-count">{tasks.filter(task=>task.status!=='completada'&&!task.completed_at).length} pendientes</span></h3>{loading?<p className="crm-subtle">Cargando tareas…</p>:!tasks.length?<p className="crm-subtle">Sin tareas registradas.</p>:<ul className="crm-task-list">{tasks.map(task=><li key={task.id}><div><b>{task.title}</b><small>{dateLabel(task.due_at)} · {task.completed_at?'Completada':task.status}</small></div>{!task.completed_at&&task.status!=='completada'&&<Button size="icon" variant="outline" disabled={busy} aria-label={'Completar '+task.title} title="Completar tarea" onClick={()=>completeTask(task)}><Check/></Button>}</li>)}</ul>}<form onSubmit={addTask} className="crm-task-form"><FormField label="Título de tarea"><input name="title" required maxLength={250}/></FormField><FormField label="Fecha de tarea"><input name="due_at" type="datetime-local"/></FormField><Button disabled={busy} type="submit"><Plus/> Crear tarea</Button></form></section>
    <section className="crm-detail-section"><h3>Actividad</h3>{loading?<p className="crm-subtle">Cargando actividad…</p>:activities.length?<ol className="crm-timeline">{activities.map(activity=><li key={activity.id}><b>{activityLabel(activity.activity_type)}</b><p>{activity.body}</p><small>{dateLabel(activity.created_at)} · {activity.actor_type}{activity.channel?' · '+activity.channel:''}</small></li>)}</ol>:<p className="crm-subtle">Sin actividad registrada.</p>}</section>
    <section className="crm-detail-section"><h3>Origen y atribución</h3><dl className="crm-fields"><Field label="Origen" value={sourceLabel(contact.source)}/><Field label="Detalle" value={contact.source_detail}/><Field label="Fecha de llegada" value={dateLabel(contact.created_at)}/>{[['UTM source',contact.utm_source],['UTM medium',contact.utm_medium],['UTM campaign',contact.utm_campaign],['UTM content',contact.utm_content]].map(([label,value])=>value&&<Field key={label} label={label??''} value={value}/>)}</dl></section>
    <section className="crm-detail-section"><h3>Permisos y automatización</h3><dl className="crm-fields"><Field label="Atención de solicitud" value={contact.consent_service?'Autorizada':'No autorizada'}/><Field label="Marketing" value={contact.consent_marketing?'Autorizado':'No autorizado'}/><Field label="agent_enabled (registro)" value={contact.agent_enabled?'Sí':'No'}/><Field label="agent_status (registro)" value={contact.agent_status}/></dl><p className="crm-integration">WhatsApp / Agente IA: no conectado. No responde mensajes automáticamente.</p></section>
  </aside>;
}