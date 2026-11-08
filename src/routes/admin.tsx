import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CRM_ADMIN_EMAIL, isCrmAdministrator } from "@/lib/crm-access";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "CRM privado | Cómplice Lab" },
      { name: "description", content: "Acceso privado al CRM interno de Cómplice Lab." },
      { property: "og:title", content: "CRM privado | Cómplice Lab" },
      { property: "og:description", content: "Acceso privado al CRM interno de Cómplice Lab." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: AdminCrmPage,
});

type Contact = Tables<"crm_contacts">;
type Activity = Tables<"crm_activities">;
type Task = Tables<"crm_tasks">;

const ADMIN_EMAIL = CRM_ADMIN_EMAIL;
const STATUS = [
  ["nuevo", "Nuevo"],
  ["contactado", "Contactado"],
  ["calificado", "Calificado"],
  ["cita_agendada", "Cita agendada"],
  ["propuesta", "Propuesta"],
  ["seguimiento", "Seguimiento"],
  ["ganado", "Ganado"],
  ["perdido", "Perdido"],
] as const;
const SOURCES = ["manual","web","WhatsApp","Meta Ads","Instagram","referido","otro"] as const;
const SERVICES = ["Sistemas con IA a la medida","Agente de IA automatizado","Marketing digital","Otro"] as const;

const emptyContact = {
  full_name:"",
  brand_name:"",
  whatsapp:"",
  email:"",
  country:"Colombia",
  profession:"",
  business_type:"",
  need:"",
  solution_interest:"Sistemas con IA a la medida",
  source:"manual",
  status:"nuevo",
  next_follow_up_at:"",
  notes:"",
  consent_marketing:false,
};

function AdminCrmPage() {
  const [token,setToken]=useState("");
  const [checking,setChecking]=useState(true);
  const [loading,setLoading]=useState(false);
  const [contacts,setContacts]=useState<Contact[]>([]);
  const [selected,setSelected]=useState<Contact|null>(null);
  const [activities,setActivities]=useState<Activity[]>([]);
  const [tasks,setTasks]=useState<Task[]>([]);
  const [query,setQuery]=useState("");
  const [statusFilter,setStatusFilter]=useState("todos");
  const [sourceFilter,setSourceFilter]=useState("todos");
  const [message,setMessage]=useState("");
  const [loginPassword,setLoginPassword]=useState("");
  const [showCreate,setShowCreate]=useState(false);
  const [showSecurity,setShowSecurity]=useState(false);
  const [newPassword,setNewPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [form,setForm]=useState({...emptyContact});
  const [editNotes,setEditNotes]=useState("");
  const [editFollowUp,setEditFollowUp]=useState("");
  const [taskTitle,setTaskTitle]=useState("");
  const [taskDue,setTaskDue]=useState("");

  async function checkAccess(){
    const {data,error}=await supabase.auth.getUser();
    if(error || !isCrmAdministrator(data.user)){
      setToken("");
      setContacts([]);
      setSelected(null);
      setChecking(false);
      return;
    }
    const {data:sessionData}=await supabase.auth.getSession();
    setToken(sessionData.session?.access_token||"");
    setChecking(false);
  }

  useEffect(()=>{
    let active=true;
    void checkAccess();
    const {data:subscription}=supabase.auth.onAuthStateChange(()=>{
      queueMicrotask(()=>{if(active) void checkAccess();});
    });
    return()=>{active=false;subscription.subscription.unsubscribe();};
  },[]);

  async function loadContacts(){
    if(!token)return;
    setLoading(true);
    const {data,error}=await supabase.from("crm_contacts").select("*").order("created_at",{ascending:false}).limit(500);
    if(error)setMessage("No pude cargar los contactos del CRM.");
    else setContacts(data||[]);
    setLoading(false);
  }

  useEffect(()=>{void loadContacts();},[token]);

  async function loadContext(contact:Contact){
    setSelected(contact);
    setEditNotes(contact.notes||"");
    setEditFollowUp(toLocalInput(contact.next_follow_up_at));
    const [a,t]=await Promise.all([
      supabase.from("crm_activities").select("*").eq("contact_id",contact.id).order("created_at",{ascending:false}).limit(100),
      supabase.from("crm_tasks").select("*").eq("contact_id",contact.id).order("created_at",{ascending:false}).limit(100),
    ]);
    setActivities(a.data||[]);
    setTasks(t.data||[]);
  }

  async function login(e:FormEvent){
    e.preventDefault();
    setLoading(true); setMessage("");
    const {data,error}=await supabase.auth.signInWithPassword({email:ADMIN_EMAIL,password:loginPassword});
    if(error || !isCrmAdministrator(data.user)){
      if(data.session) await supabase.auth.signOut();
      setMessage("Correo o contraseña incorrectos.");
    } else {
      setLoginPassword("");
    }
    setLoading(false);
  }

  async function recoverPassword(){
    setLoading(true);setMessage("");
    const {error}=await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL,{redirectTo:window.location.origin+"/admin#recovery"});
    setMessage(error ? "No fue posible enviar la recuperación." : "Te enviamos un enlace únicamente para restablecer la contraseña.");
    setLoading(false);
  }

  async function savePassword(e:FormEvent){
    e.preventDefault(); setMessage("");
    if(newPassword.length<8)return setMessage("La contraseña debe tener al menos 8 caracteres.");
    if(newPassword!==confirmPassword)return setMessage("Las contraseñas no coinciden.");
    setLoading(true);
    const {error}=await supabase.auth.updateUser({password:newPassword});
    if(error)setMessage("No pude actualizar la contraseña. Intenta nuevamente.");
    else {
      setMessage("Contraseña actualizada. Desde ahora puedes entrar con correo y contraseña.");
      setNewPassword("");setConfirmPassword("");setShowSecurity(false);
    }
    setLoading(false);
  }

  async function logout(){
    setToken("");setContacts([]);setSelected(null);setActivities([]);setTasks([]);setMessage("");
    await supabase.auth.signOut();
  }

  async function createContact(e:FormEvent){
    e.preventDefault(); setMessage("");
    if(!form.full_name.trim())return setMessage("El nombre del contacto es obligatorio.");
    setLoading(true);
    const payload={
      full_name:form.full_name.trim(),
      brand_name:nullIfEmpty(form.brand_name),
      whatsapp:nullIfEmpty(form.whatsapp),
      email:nullIfEmpty(form.email),
      country:nullIfEmpty(form.country),
      profession:nullIfEmpty(form.profession),
      business_type:nullIfEmpty(form.business_type),
      need:nullIfEmpty(form.need),
      solution_interest:nullIfEmpty(form.solution_interest),
      source:form.source,
      status:form.status,
      next_follow_up_at:form.next_follow_up_at ? new Date(form.next_follow_up_at).toISOString() : null,
      notes:nullIfEmpty(form.notes),
      consent_service:true,
      consent_marketing:form.consent_marketing,
      consent_at:new Date().toISOString(),
      agent_enabled:false,
      agent_status:"no_conectado",
    };
    const {data,error}=await supabase.from("crm_contacts").insert(payload).select("*").single();
    if(error||!data){setMessage("No pude crear el contacto.");setLoading(false);return;}
    await supabase.from("crm_activities").insert({
      contact_id:data.id,activity_type:"contact_created",actor_type:"admin",channel:"crm",
      body:"Contacto creado manualmente desde el CRM.",
    });
    setContacts(items=>[data,...items]);
    setForm({...emptyContact});
    setShowCreate(false);
    await loadContext(data);
    setMessage("Contacto creado correctamente.");
    setLoading(false);
  }

  async function updateStatus(contact:Contact,status:string){
    const patch:TablesUpdate<"crm_contacts">={status,updated_at:new Date().toISOString()};
    if(status==="contactado")patch.last_contact_at=new Date().toISOString();
    const {data,error}=await supabase.from("crm_contacts").update(patch).eq("id",contact.id).select("*").single();
    if(error||!data)return setMessage("No pude actualizar la etapa.");
    await supabase.from("crm_activities").insert({
      contact_id:contact.id,activity_type:"status_changed",actor_type:"admin",channel:"crm",
      body:`Etapa actualizada a ${statusLabel(status)}.`,
    });
    setContacts(items=>items.map(item=>item.id===data.id?data:item));
    await loadContext(data);
  }

  async function saveFollowUp(){
    if(!selected)return;
    const next=editFollowUp ? new Date(editFollowUp).toISOString() : null;
    const {data,error}=await supabase.from("crm_contacts")
      .update({next_follow_up_at:next,notes:nullIfEmpty(editNotes),updated_at:new Date().toISOString()})
      .eq("id",selected.id).select("*").single();
    if(error||!data)return setMessage("No pude guardar el seguimiento.");
    await supabase.from("crm_activities").insert({
      contact_id:selected.id,activity_type:"follow_up_updated",actor_type:"admin",channel:"crm",
      body:next?"Próximo seguimiento actualizado.":"Seguimiento actualizado.",
    });
    setContacts(items=>items.map(item=>item.id===data.id?data:item));
    await loadContext(data);
    setMessage("Seguimiento guardado.");
  }

  async function createTask(e:FormEvent){
    e.preventDefault(); if(!selected||!taskTitle.trim())return;
    const {data,error}=await supabase.from("crm_tasks").insert({
      contact_id:selected.id,title:taskTitle.trim(),
      due_at:taskDue?new Date(taskDue).toISOString():null,status:"pendiente",
    }).select("*").single();
    if(error||!data)return setMessage("No pude crear la tarea.");
    setTasks(items=>[data,...items]);setTaskTitle("");setTaskDue("");
  }

  async function toggleTask(task:Task){
    const done=task.status!=="completada";
    const {data,error}=await supabase.from("crm_tasks").update({
      status:done?"completada":"pendiente",completed_at:done?new Date().toISOString():null,
    }).eq("id",task.id).select("*").single();
    if(!error&&data)setTasks(items=>items.map(i=>i.id===data.id?data:i));
  }

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return contacts.filter(c=>{
      const matchQ=!q||[c.full_name,c.brand_name,c.whatsapp,c.email,c.profession,c.business_type,c.source,c.status,c.need,c.solution_interest]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
      const matchStatus=statusFilter==="todos"||c.status===statusFilter;
      const matchSource=sourceFilter==="todos"||c.source===sourceFilter;
      return matchQ&&matchStatus&&matchSource;
    });
  },[contacts,query,statusFilter,sourceFilter]);

  const metrics=useMemo(()=>({
    total:contacts.length,
    nuevos:contacts.filter(c=>c.status==="nuevo").length,
    citas:contacts.filter(c=>c.status==="cita_agendada").length,
    seguimiento:contacts.filter(c=>c.status==="seguimiento").length,
    ganados:contacts.filter(c=>c.status==="ganado").length,
  }),[contacts]);

  if(checking)return <main className="crm-shell crm-locked"><img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab"/><div className="crm-lock-card"><span>CRM PRIVADO</span><h1>Verificando acceso…</h1></div><CrmStyles/></main>;

  if(!token)return(
    <main className="crm-shell crm-locked">
      <img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab"/>
      <form className="crm-lock-card" onSubmit={login}>
        <span>ACCESO PRIVADO</span>
        <h1>CRM de Cómplice Lab</h1>
        <p>Ingresa con tu correo administrador y contraseña.</p>
        <label>Correo</label>
        <input value={ADMIN_EMAIL} readOnly aria-label="Correo administrador"/>
        <label>Contraseña</label>
        <input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="Tu contraseña" autoComplete="current-password"/>
        <button type="submit" disabled={loading||!loginPassword}>{loading?"Entrando…":"Entrar al CRM"}</button>
        <button className="crm-link-btn" type="button" onClick={recoverPassword} disabled={loading}>Olvidé mi contraseña</button>
        {message&&<p className="crm-message">{message}</p>}
      </form>
      <CrmStyles/>
    </main>
  );

  return(
    <main className="crm-shell">
      <header className="crm-topbar">
        <img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab"/>
        <div className="crm-top-actions">
          <span className="crm-integration"><i/> WhatsApp / Agente IA: no conectado</span>
          <button onClick={()=>setShowSecurity(true)}>Seguridad</button>
          <button onClick={logout}>Salir</button>
        </div>
      </header>

      <section className="crm-content">
        <div className="crm-heading">
          <div><span>CRM INTERNO</span><h1>Oportunidades</h1><p>Quién llegó, qué necesita y qué toca hacer después.</p></div>
          <div className="crm-heading-actions">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar contacto, marca, WhatsApp…"/>
            <button className="crm-primary" onClick={()=>setShowCreate(true)}>+ Nuevo contacto</button>
          </div>
        </div>

        <div className="crm-notice">
          <b>CRM activo.</b>
          <span>La conexión con WhatsApp y el agente de IA todavía no está configurada. Ningún mensaje se responde automáticamente.</span>
        </div>

        <div className="crm-metrics">
          <Metric label="Total" value={metrics.total}/>
          <Metric label="Nuevos" value={metrics.nuevos}/>
          <Metric label="Citas" value={metrics.citas}/>
          <Metric label="Seguimiento" value={metrics.seguimiento}/>
          <Metric label="Ganados" value={metrics.ganados}/>
        </div>

        <div className="crm-filters">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="todos">Todas las etapas</option>
            {STATUS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <select value={sourceFilter} onChange={e=>setSourceFilter(e.target.value)}>
            <option value="todos">Todos los orígenes</option>
            {SOURCES.map(v=><option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {message&&<div className="crm-alert">{message}</div>}

        <div className="crm-grid">
          <section className="crm-list">
            <div className="crm-list-head"><b>Contactos</b><span>{filtered.length}</span></div>
            {loading&&!contacts.length?<div className="crm-empty">Cargando…</div>:null}
            {!loading&&!filtered.length?<div className="crm-empty crm-empty-action"><b>Todavía no hay contactos.</b><span>Crea el primero manualmente o espera a que llegue desde la web.</span><button onClick={()=>setShowCreate(true)}>Crear primer contacto</button></div>:null}
            {filtered.map(contact=>(
              <button className={"crm-contact "+(selected?.id===contact.id?"is-active":"")} key={contact.id} onClick={()=>void loadContext(contact)}>
                <div className="crm-avatar">{initials(contact.full_name)}</div>
                <div className="crm-contact-main">
                  <b>{contact.full_name}</b>
                  <span>{contact.brand_name||contact.business_type||"Sin marca registrada"}</span>
                  <small>{contact.whatsapp||contact.email||"Sin dato de contacto"} · {contact.source}</small>
                  {contact.next_follow_up_at&&<em>Próximo: {formatDateTime(contact.next_follow_up_at)}</em>}
                </div>
                <Status status={contact.status}/>
              </button>
            ))}
          </section>

          <aside className="crm-detail">
            {!selected?(
              <div className="crm-empty-detail"><span>Selecciona un contacto</span><h2>Aquí verás toda la historia antes de escribirle.</h2><p>Datos, origen, oportunidad, seguimiento, actividades y tareas en un solo lugar.</p></div>
            ):(
              <>
                <div className="crm-detail-head">
                  <div><span>CONTACTO</span><h2>{selected.full_name}</h2><p>{selected.brand_name||selected.business_type||"Sin marca registrada"}</p></div>
                  <Status status={selected.status}/>
                </div>

                <section className="crm-section">
                  <h3>Identidad y contacto</h3>
                  <div className="crm-fields">
                    <Field label="WhatsApp" value={selected.whatsapp}/>
                    <Field label="Correo" value={selected.email}/>
                    <Field label="País" value={selected.country}/>
                    <Field label="Profesión" value={selected.profession}/>
                    <Field label="Tipo de negocio" value={selected.business_type}/>
                    <Field label="Marca / empresa" value={selected.brand_name}/>
                  </div>
                </section>

                <section className="crm-section">
                  <h3>Oportunidad</h3>
                  <div className="crm-fields">
                    <Field label="Qué necesita" value={selected.need} wide/>
                    <Field label="Servicio de interés" value={selected.solution_interest} wide/>
                  </div>
                  <label className="crm-control-label">Etapa comercial</label>
                  <select className="crm-control" value={selected.status} onChange={e=>void updateStatus(selected,e.target.value)}>
                    {STATUS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </section>

                <section className="crm-section">
                  <h3>Origen</h3>
                  <div className="crm-fields">
                    <Field label="Canal" value={selected.source}/>
                    <Field label="Detalle" value={selected.source_detail}/>
                    <Field label="UTM source" value={selected.utm_source}/>
                    <Field label="UTM campaign" value={selected.utm_campaign}/>
                  </div>
                </section>

                <section className="crm-section">
                  <h3>Seguimiento</h3>
                  <label className="crm-control-label">Próxima acción</label>
                  <input className="crm-control" type="datetime-local" value={editFollowUp} onChange={e=>setEditFollowUp(e.target.value)}/>
                  <label className="crm-control-label">Notas</label>
                  <textarea className="crm-control crm-textarea" value={editNotes} onChange={e=>setEditNotes(e.target.value)} placeholder="Contexto comercial, objeciones, acuerdos…"/>
                  <button className="crm-secondary" onClick={()=>void saveFollowUp()}>Guardar seguimiento</button>
                </section>

                <section className="crm-section">
                  <h3>Permisos e integración</h3>
                  <div className="crm-permissions">
                    <span>Respuesta a solicitud <b>{selected.consent_service?"Autorizada":"No registrada"}</b></span>
                    <span>Marketing adicional <b>{selected.consent_marketing?"Autorizado":"No autorizado"}</b></span>
                    <span>WhatsApp / agente <b>No conectado</b></span>
                  </div>
                </section>

                <section className="crm-section">
                  <h3>Tareas</h3>
                  <form className="crm-task-form" onSubmit={createTask}>
                    <input value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} placeholder="Ej. Enviar propuesta"/>
                    <input type="datetime-local" value={taskDue} onChange={e=>setTaskDue(e.target.value)}/>
                    <button className="crm-secondary" type="submit">Añadir</button>
                  </form>
                  <div className="crm-task-list">
                    {!tasks.length&&<span className="crm-muted">No hay tareas para este contacto.</span>}
                    {tasks.map(task=><button key={task.id} className={"crm-task "+(task.status==="completada"?"is-done":"")} onClick={()=>void toggleTask(task)}>
                      <i>{task.status==="completada"?"✓":""}</i><span><b>{task.title}</b><small>{task.due_at?formatDateTime(task.due_at):"Sin fecha"}</small></span>
                    </button>)}
                  </div>
                </section>

                <section className="crm-section">
                  <h3>Actividad</h3>
                  <div className="crm-timeline">
                    {!activities.length&&<span className="crm-muted">Todavía no hay actividad registrada.</span>}
                    {activities.map(a=><div key={a.id} className="crm-activity"><i/><div><b>{activityLabel(a.activity_type)}</b><p>{a.body||"Actividad registrada"}</p><small>{formatDateTime(a.created_at)}</small></div></div>)}
                  </div>
                </section>
              </>
            )}
          </aside>
        </div>
      </section>

      {showCreate&&<div className="crm-modal-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)setShowCreate(false);}}>
        <form className="crm-modal" onSubmit={createContact}>
          <div className="crm-modal-head"><div><span>NUEVA OPORTUNIDAD</span><h2>Crear contacto</h2></div><button type="button" onClick={()=>setShowCreate(false)}>×</button></div>
          <div className="crm-form-grid">
            <Input label="Nombre y apellido *" value={form.full_name} onChange={v=>setForm({...form,full_name:v})}/>
            <Input label="Marca / empresa" value={form.brand_name} onChange={v=>setForm({...form,brand_name:v})}/>
            <Input label="WhatsApp" value={form.whatsapp} onChange={v=>setForm({...form,whatsapp:v})}/>
            <Input label="Correo" value={form.email} onChange={v=>setForm({...form,email:v})}/>
            <Input label="País" value={form.country} onChange={v=>setForm({...form,country:v})}/>
            <Input label="Profesión" value={form.profession} onChange={v=>setForm({...form,profession:v})}/>
            <Input label="Tipo de negocio" value={form.business_type} onChange={v=>setForm({...form,business_type:v})}/>
            <Select label="Origen" value={form.source} options={SOURCES as unknown as string[]} onChange={v=>setForm({...form,source:v})}/>
            <Select label="Servicio de interés" value={form.solution_interest} options={SERVICES as unknown as string[]} onChange={v=>setForm({...form,solution_interest:v})}/>
            <Select label="Estado inicial" value={form.status} options={STATUS.map(([v])=>v)} labels={Object.fromEntries(STATUS)} onChange={v=>setForm({...form,status:v})}/>
            <Input label="Próximo seguimiento" type="datetime-local" value={form.next_follow_up_at} onChange={v=>setForm({...form,next_follow_up_at:v})}/>
            <label className="crm-input wide"><span>Qué necesita</span><textarea value={form.need} onChange={e=>setForm({...form,need:e.target.value})}/></label>
            <label className="crm-input wide"><span>Notas</span><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
            <label className="crm-check wide"><input type="checkbox" checked={form.consent_marketing} onChange={e=>setForm({...form,consent_marketing:e.target.checked})}/><span>El contacto autorizó comunicaciones de marketing adicionales.</span></label>
          </div>
          <div className="crm-modal-actions"><button type="button" onClick={()=>setShowCreate(false)}>Cancelar</button><button className="crm-primary" type="submit" disabled={loading}>{loading?"Guardando…":"Guardar contacto"}</button></div>
        </form>
      </div>}

      {showSecurity&&<div className="crm-modal-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)setShowSecurity(false);}}>
        <form className="crm-modal crm-security" onSubmit={savePassword}>
          <div className="crm-modal-head"><div><span>SEGURIDAD</span><h2>Establecer o cambiar contraseña</h2></div><button type="button" onClick={()=>setShowSecurity(false)}>×</button></div>
          <p>Hazlo ahora si esta es tu primera sesión. Después entrarás siempre con {ADMIN_EMAIL} y esta contraseña.</p>
          <Input label="Nueva contraseña" type="password" value={newPassword} onChange={setNewPassword}/>
          <Input label="Confirmar contraseña" type="password" value={confirmPassword} onChange={setConfirmPassword}/>
          <div className="crm-modal-actions"><button type="button" onClick={()=>setShowSecurity(false)}>Cancelar</button><button className="crm-primary" type="submit" disabled={loading}>Guardar contraseña</button></div>
        </form>
      </div>}
      <CrmStyles/>
    </main>
  );
}

function Metric({label,value}:{label:string;value:number}){return <div className="crm-metric"><span>{label}</span><b>{value}</b></div>;}
function Field({label,value,wide=false}:{label:string;value:string|null;wide?:boolean}){return <div className={"crm-field "+(wide?"wide":"")}><span>{label}</span><b>{value||"—"}</b></div>;}
function Status({status}:{status:string}){return <span className={"crm-status status-"+status}>{statusLabel(status)}</span>;}
function Input({label,value,onChange,type="text"}:{label:string;value:string;onChange:(v:string)=>void;type?:string}){return <label className="crm-input"><span>{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)}/></label>;}
function Select({label,value,options,labels,onChange}:{label:string;value:string;options:string[];labels?:Record<string,string>;onChange:(v:string)=>void}){return <label className="crm-input"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{labels?.[o]||o}</option>)}</select></label>;}
function nullIfEmpty(v:string){const t=v.trim();return t||null;}
function initials(v:string){return v.split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();}
function statusLabel(v:string){return STATUS.find(([x])=>x===v)?.[1]||v.replaceAll("_"," ");}
function activityLabel(v:string){return ({contact_created:"Contacto creado",status_changed:"Etapa actualizada",follow_up_updated:"Seguimiento actualizado"} as Record<string,string>)[v]||v.replaceAll("_"," ");}
function formatDateTime(v:string){return new Intl.DateTimeFormat("es-CO",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v));}
function toLocalInput(v:string|null){if(!v)return"";const d=new Date(v);const offset=d.getTimezoneOffset();return new Date(d.getTime()-offset*60000).toISOString().slice(0,16);}

function CrmStyles(){return <style>{`
:root{font-family:"Montserrat",system-ui,sans-serif;color:#0d1830;background:#f4f7ff}*{box-sizing:border-box}body{margin:0;background:#f4f7ff}.crm-shell{min-height:100vh;background:radial-gradient(circle at 85% 8%,#e9e5ff 0,transparent 28%),radial-gradient(circle at 8% 10%,#def6ff 0,transparent 31%),#f7f9ff;color:#0b1530}.crm-topbar{height:76px;padding:0 4vw;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.9);backdrop-filter:blur(18px);border-bottom:1px solid #e2e8f2;position:sticky;top:0;z-index:20}.crm-topbar img,.crm-locked>img{width:150px;height:auto}.crm-top-actions{display:flex;align-items:center;gap:10px}.crm-top-actions button,.crm-modal-head button{border:1px solid #dae2ee;background:#fff;border-radius:999px;padding:9px 14px;cursor:pointer}.crm-integration{display:flex;align-items:center;gap:8px;font-size:12px;color:#65748d;background:#f7f8fc;border:1px solid #e3e8f0;border-radius:999px;padding:9px 12px}.crm-integration i{width:8px;height:8px;border-radius:50%;background:#f3a01a}.crm-content{max-width:1450px;margin:auto;padding:38px 4vw 72px}.crm-heading{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:18px}.crm-heading>div:first-child>span,.crm-detail-head>div>span,.crm-modal-head span,.crm-lock-card>span{font-size:11px;font-weight:800;letter-spacing:.12em;color:#3568ee}.crm-heading h1{font:700 42px/1 "Poppins",sans-serif;letter-spacing:-.045em;margin:7px 0 8px}.crm-heading p{margin:0;color:#687791}.crm-heading-actions{display:flex;gap:10px;align-items:center}.crm-heading-actions input{width:360px;height:48px;border:1px solid #dbe3ef;border-radius:16px;padding:0 15px;font:inherit;background:#fff}.crm-primary{border:0!important;background:linear-gradient(90deg,#176ae8,#7254ed)!important;color:#fff!important;border-radius:14px!important;padding:14px 18px!important;font-weight:800;cursor:pointer}.crm-notice{display:flex;gap:10px;align-items:center;background:#fff9ea;border:1px solid #f2dfaa;color:#765818;border-radius:16px;padding:11px 15px;margin-bottom:14px;font-size:12px}.crm-metrics{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:14px}.crm-metric{background:#fff;border:1px solid #e0e6f1;border-radius:18px;padding:16px 18px;box-shadow:0 10px 25px rgba(44,70,125,.05)}.crm-metric span{display:block;color:#71809a;font-size:11px}.crm-metric b{display:block;font:700 26px/1 "Poppins",sans-serif;margin-top:6px}.crm-filters{display:flex;gap:8px;margin-bottom:14px}.crm-filters select,.crm-control{height:44px;border:1px solid #dce3ef;border-radius:12px;padding:0 12px;background:#fff;font:inherit;color:#17233a}.crm-grid{display:grid;grid-template-columns:minmax(390px,.82fr) minmax(560px,1.38fr);gap:16px}.crm-list,.crm-detail{background:#fff;border:1px solid #e0e6f1;border-radius:24px;box-shadow:0 22px 55px rgba(39,66,120,.075);overflow:hidden}.crm-list{align-self:start;max-height:760px;overflow:auto}.crm-list-head{padding:17px 18px;border-bottom:1px solid #e7ebf3;display:flex;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:2}.crm-list-head span{background:#eff4ff;padding:4px 9px;border-radius:999px;font-size:11px}.crm-contact{width:100%;display:grid;grid-template-columns:44px 1fr auto;gap:11px;align-items:center;padding:14px 16px;background:#fff;border:0;border-bottom:1px solid #edf0f5;text-align:left;cursor:pointer}.crm-contact:hover,.crm-contact.is-active{background:#f3f7ff}.crm-avatar{width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,#2569ea,#7457ed);color:#fff;display:grid;place-items:center;font-weight:800}.crm-contact-main b{display:block;font-size:13px}.crm-contact-main span{display:block;color:#687791;font-size:11px;margin-top:2px}.crm-contact-main small{display:block;color:#96a1b4;font-size:10px;margin-top:4px}.crm-contact-main em{display:block;color:#5b5be6;font-size:10px;font-style:normal;margin-top:5px}.crm-status{display:inline-flex;align-items:center;border-radius:999px;padding:6px 8px;font-size:9px;font-weight:800;background:#eef2f8;color:#5f6d83}.status-nuevo{background:#fff0d9;color:#a86400}.status-contactado,.status-calificado{background:#e8f1ff;color:#2760d8}.status-cita_agendada{background:#e3f8ee;color:#128454}.status-propuesta,.status-seguimiento{background:#efeaff;color:#674de1}.status-ganado{background:#daf8e8;color:#0f8652}.status-perdido{background:#ffe8ec;color:#b92f48}.crm-detail{padding:22px;min-height:560px}.crm-detail-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding-bottom:18px;border-bottom:1px solid #e9edf4}.crm-detail-head h2{font:700 29px/1 "Poppins",sans-serif;letter-spacing:-.035em;margin:6px 0}.crm-detail-head p{margin:0;color:#6b7892}.crm-section{padding:18px 0;border-bottom:1px solid #edf0f5}.crm-section:last-child{border-bottom:0}.crm-section h3{font:700 15px/1.2 "Poppins",sans-serif;margin:0 0 12px}.crm-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}.crm-field{background:#f7f9fd;border:1px solid #e7ebf3;border-radius:13px;padding:12px}.crm-field.wide{grid-column:1/-1}.crm-field span{display:block;color:#7a879d;font-size:10px;margin-bottom:4px}.crm-field b{font-size:12px;line-height:1.45}.crm-control{width:100%}.crm-control-label{display:block;font-size:11px;color:#6b7892;margin:10px 0 6px}.crm-textarea{height:90px;padding:12px;resize:vertical}.crm-secondary{border:1px solid #cdd8eb;background:#fff;color:#214caa;border-radius:12px;padding:10px 13px;font-weight:700;cursor:pointer;margin-top:9px}.crm-permissions{display:grid;gap:8px;background:linear-gradient(135deg,#edf6ff,#f1edff);border-radius:15px;padding:14px}.crm-permissions span{display:flex;justify-content:space-between;gap:12px;font-size:11px;color:#60708b}.crm-permissions b{color:#1b2943}.crm-task-form{display:grid;grid-template-columns:1fr 190px auto;gap:8px}.crm-task-form input{height:42px;border:1px solid #dce3ef;border-radius:11px;padding:0 10px;font:inherit}.crm-task-form .crm-secondary{margin:0}.crm-task-list{display:grid;gap:7px;margin-top:10px}.crm-task{display:flex;align-items:center;gap:10px;width:100%;border:1px solid #e4e9f2;background:#fff;border-radius:12px;padding:10px;text-align:left;cursor:pointer}.crm-task i{width:20px;height:20px;border:1px solid #aab8ce;border-radius:6px;display:grid;place-items:center;color:#fff;font-style:normal}.crm-task.is-done{opacity:.65}.crm-task.is-done i{background:#25ad72;border-color:#25ad72}.crm-task span{display:grid;gap:2px}.crm-task b{font-size:11px}.crm-task small{font-size:9px;color:#8290a7}.crm-timeline{display:grid;gap:12px}.crm-activity{display:grid;grid-template-columns:12px 1fr;gap:10px}.crm-activity>i{width:8px;height:8px;border-radius:50%;background:#4f63ee;margin-top:5px;box-shadow:0 0 0 4px #edf0ff}.crm-activity b{font-size:11px}.crm-activity p{font-size:11px;color:#687791;margin:3px 0}.crm-activity small{font-size:9px;color:#94a0b3}.crm-muted{color:#8692a6;font-size:11px}.crm-empty,.crm-empty-detail{padding:32px;color:#7b879b}.crm-empty-action{display:grid;gap:10px}.crm-empty-action b{color:#1a2740}.crm-empty-action button{justify-self:start;border:0;background:#eef3ff;color:#295cce;border-radius:11px;padding:10px 12px;font-weight:700;cursor:pointer}.crm-empty-detail{min-height:500px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}.crm-empty-detail h2{font:700 28px/1.15 "Poppins",sans-serif;max-width:480px;letter-spacing:-.03em;margin:8px 0}.crm-empty-detail p{max-width:520px}.crm-alert,.crm-message{padding:11px 13px;border-radius:13px;background:#fff5df;color:#8f6400;margin:10px 0;font-size:12px}.crm-locked{display:grid;place-items:center;align-content:center;gap:24px;padding:32px}.crm-lock-card{width:min(520px,94vw);padding:30px;background:#fff;border:1px solid #dfe6f2;border-radius:26px;box-shadow:0 28px 70px rgba(37,67,127,.12);display:grid;gap:10px}.crm-lock-card h1{font:700 34px/1.05 "Poppins",sans-serif;letter-spacing:-.04em;margin:4px 0}.crm-lock-card p{color:#697891;line-height:1.55;margin:0 0 6px}.crm-lock-card label{font-size:11px;font-weight:700;color:#53617b}.crm-lock-card input{height:46px;border:1px solid #dce3ef;border-radius:12px;padding:0 12px;font:inherit}.crm-lock-card>button[type=submit]{border:0;border-radius:13px;background:linear-gradient(90deg,#176ae8,#7254ed);color:#fff;font-weight:800;padding:13px;cursor:pointer}.crm-link-btn{border:0;background:transparent;color:#3568ee;cursor:pointer;padding:8px}.crm-modal-backdrop{position:fixed;inset:0;background:rgba(10,20,42,.38);backdrop-filter:blur(5px);display:grid;place-items:center;padding:24px;z-index:50}.crm-modal{width:min(860px,96vw);max-height:90vh;overflow:auto;background:#fff;border-radius:24px;padding:24px;box-shadow:0 40px 110px rgba(12,28,63,.3)}.crm-security{width:min(560px,96vw)}.crm-modal-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px}.crm-modal-head h2{font:700 29px/1 "Poppins",sans-serif;margin:5px 0}.crm-modal-head>button{font-size:22px;line-height:1;padding:7px 11px}.crm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.crm-input{display:grid;gap:6px}.crm-input.wide,.crm-check.wide{grid-column:1/-1}.crm-input span{font-size:11px;font-weight:700;color:#596982}.crm-input input,.crm-input select,.crm-input textarea{width:100%;border:1px solid #dce3ef;border-radius:11px;padding:11px;font:inherit;background:#fff}.crm-input textarea{min-height:80px;resize:vertical}.crm-check{display:flex;gap:9px;align-items:flex-start;font-size:11px;color:#60708a}.crm-modal-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:18px}.crm-modal-actions>button:not(.crm-primary){border:1px solid #dce3ef;background:#fff;border-radius:12px;padding:11px 14px;cursor:pointer}
@media(max-width:980px){.crm-grid{grid-template-columns:1fr}.crm-heading{align-items:stretch;flex-direction:column}.crm-heading-actions{width:100%}.crm-heading-actions input{flex:1;width:auto}.crm-metrics{grid-template-columns:repeat(3,1fr)}.crm-list{max-height:none}.crm-detail{min-height:unset}}
@media(max-width:680px){.crm-content{padding:26px 16px 50px}.crm-topbar{padding:0 16px}.crm-topbar img{width:132px}.crm-integration{display:none}.crm-heading h1{font-size:34px}.crm-heading-actions{flex-direction:column;align-items:stretch}.crm-heading-actions input{width:100%}.crm-metrics{grid-template-columns:1fr 1fr}.crm-notice{align-items:flex-start;flex-direction:column}.crm-contact{grid-template-columns:40px 1fr}.crm-contact>.crm-status{grid-column:2;justify-self:start}.crm-fields,.crm-form-grid{grid-template-columns:1fr}.crm-field.wide,.crm-input.wide,.crm-check.wide{grid-column:auto}.crm-task-form{grid-template-columns:1fr}.crm-modal-backdrop{padding:10px}.crm-modal{padding:19px}.crm-top-actions button{padding:8px 10px;font-size:11px}}
`}</style>;}
