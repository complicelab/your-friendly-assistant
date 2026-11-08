import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, Plus, Search, Shield, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CRM_ADMIN_EMAIL, isCrmAdministrator } from '@/lib/crm-access';
import { type Contact, matchesContact, SOURCES, STAGES, sourceLabel, dateLabel } from '@/lib/crm-model';
import { ContactForm } from '@/components/crm/contact-form';
import { ContactDetail } from '@/components/crm/contact-detail';
import { Security, sendRecovery } from '@/components/crm/security';
import { FormField, Stage } from '@/components/crm/shared';
import crmStyles from '@/components/crm/crm.css?inline';

export const Route = createFileRoute('/admin')({
  head: () => ({meta:[
    {title:'CRM privado | Cómplice Lab'},
    {name:'description',content:'Acceso privado al CRM interno de Cómplice Lab.'},
    {property:'og:title',content:'CRM privado | Cómplice Lab'},
    {property:'og:description',content:'Acceso exclusivo para el administrador de Cómplice Lab.'},
    {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary'},
    {name:'robots',content:'noindex,nofollow,noarchive'},
  ]}),
  component:AdminCrmPage,
});

function AdminCrmPage(){
  const router=useRouter();const queryClient=useQueryClient();
  const [authorized,setAuthorized]=useState(false);const [checking,setChecking]=useState(true);
  const [contacts,setContacts]=useState<Contact[]>([]);const [selectedId,setSelectedId]=useState('');
  const [query,setQuery]=useState('');const [status,setStatus]=useState('');const [source,setSource]=useState('');
  const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);const [loading,setLoading]=useState(false);
  const [createOpen,setCreateOpen]=useState(false);const [securityOpen,setSecurityOpen]=useState(false);
  const [reload,setReload]=useState(0);
  useEffect(()=>{let active=true;let revision=0;
    async function verify(){const current=++revision;const {data}=await supabase.auth.getUser();if(!active||current!==revision)return;
      const allowed=isCrmAdministrator(data.user);setAuthorized(allowed);setChecking(false);
      if(!allowed){setContacts([]);setSelectedId('');setCreateOpen(false);setSecurityOpen(false);if(data.user)setMessage('Este correo no tiene acceso al CRM.');}
    }
    const {data}=supabase.auth.onAuthStateChange((event)=>{if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED','INITIAL_SESSION'].includes(event))queueMicrotask(()=>{void verify();});});
    void verify();return()=>{active=false;data.subscription.unsubscribe();};
  },[]);
  useEffect(()=>{if(!authorized)return;let active=true;setLoading(true);
    // Read every page rather than silently truncating the dashboard to 300 rows.
    async function load(){const rows:Contact[]=[];let offset=0;try{while(true){const {data,error}=await supabase.from('crm_contacts').select('*').order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+499);if(error)throw error;if(!active)return;rows.push(...(data??[]));if(!data||data.length<500)break;offset+=500;}if(active)setContacts(rows);}catch{if(active)setMessage('No se pudieron cargar los contactos. Intenta actualizar.');}finally{if(active)setLoading(false);}}
    void load();return()=>{active=false;};
  },[authorized,reload]);
  async function login(event:React.FormEvent<HTMLFormElement>){event.preventDefault();const password=String(new FormData(event.currentTarget).get('password')??'');setBusy(true);setMessage('');
    try{const {error}=await supabase.auth.signInWithPassword({email:CRM_ADMIN_EMAIL,password});if(error)throw error;const {data}=await supabase.auth.getUser();if(!isCrmAdministrator(data.user)){await supabase.auth.signOut();throw new Error('denied');}event.currentTarget?.reset();setAuthorized(true);}catch{setMessage('No se pudo entrar. Revisa tu contraseña o utiliza la recuperación.');}finally{setBusy(false);}
  }
  async function logout(){setBusy(true);await queryClient.cancelQueries();queryClient.clear();setAuthorized(false);setContacts([]);setSelectedId('');setCreateOpen(false);setSecurityOpen(false);setMessage('');await supabase.auth.signOut();await router.navigate({to:'/admin',replace:true});setBusy(false);}
  const filtered=useMemo(()=>contacts.filter(contact=>matchesContact(contact,query,status,source)),[contacts,query,status,source]);
  const selected=contacts.find(contact=>contact.id===selectedId);
  const metrics=[['Nuevos',contacts.filter(c=>c.status==='nuevo').length],['Citas agendadas',contacts.filter(c=>c.status==='cita_agendada').length],['Seguimiento',contacts.filter(c=>c.status==='seguimiento').length],['Ganados',contacts.filter(c=>c.status==='ganado').length],['Total contactos',contacts.length]] as const;
  const style=<style>{crmStyles}</style>;
  if(!authorized)return <main className="crm-ui crm-shell crm-locked">{style}<img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab"/><section className="crm-login"><small>ACCESO PRIVADO</small><h1>CRM Interno</h1><p className="crm-subtle">Acceso exclusivo del administrador.</p><form onSubmit={login} className="crm-stack"><FormField label="Correo"><input type="email" value={CRM_ADMIN_EMAIL} readOnly autoComplete="username"/></FormField><FormField label="Contraseña"><input name="password" type="password" required autoComplete="current-password"/></FormField><Button disabled={checking||busy} type="submit">{checking?'Verificando acceso…':busy?'Entrando…':'Entrar al CRM'}</Button><Button variant="link" type="button" disabled={busy||checking} onClick={async()=>{setBusy(true);try{await sendRecovery();setMessage('Revisa tu correo para restablecer la contraseña.');}catch(error){setMessage(error instanceof Error?error.message:'No se pudo enviar.');}finally{setBusy(false);}}}>Olvidé mi contraseña</Button></form>{message&&<p className="crm-notice" role="status">{message}</p>}</section></main>;
  return <main className="crm-ui crm-shell">{style}<header className="crm-topbar"><img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab"/><div className="crm-admin-tools"><small>{CRM_ADMIN_EMAIL}</small><Button variant="ghost" onClick={()=>setSecurityOpen(true)}><Shield/> Seguridad</Button><Button variant="ghost" disabled={busy} onClick={logout}><LogOut/> Salir</Button></div></header><div className="crm-content"><section className="crm-heading"><div><small>CRM INTERNO</small><h1>Oportunidades</h1><p>Contactos, actividad y próximos seguimientos.</p></div><Button onClick={()=>setCreateOpen(true)}><Plus/> Nuevo contacto</Button></section><div className="crm-metrics">{metrics.map(([label,value])=><div className="crm-metric" key={label}><span>{label}</span><b>{loading?'—':value}</b></div>)}</div><div className="crm-integration"><b>WhatsApp / Agente IA: no conectado</b><span>No responde mensajes automáticamente. Integración futura pendiente.</span></div>{message&&<p className="crm-notice" role="status">{message}</p>}<div className={'crm-grid'+(selected?' crm-has-selection':'')}><section className="crm-list"><header className="crm-list-heading"><h2>Contactos</h2><span className="crm-count">{filtered.length}</span><Button size="icon" variant="ghost" disabled={loading} aria-label="Actualizar contactos" title="Actualizar contactos" onClick={()=>{setMessage('');setReload(value=>value+1);}}><RefreshCw/></Button></header><div className="crm-filters"><label className="crm-search"><Search/><input aria-label="Buscar contactos" placeholder="Nombre, marca, WhatsApp, correo…" value={query} onChange={event=>setQuery(event.target.value)}/></label><select aria-label="Filtrar por estado" value={status} onChange={event=>setStatus(event.target.value)}><option value="">Todas las etapas</option>{STAGES.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select><select aria-label="Filtrar por origen" value={source} onChange={event=>setSource(event.target.value)}><option value="">Todos los orígenes</option>{Array.from(new Set([...SOURCES.map(([value])=>String(value)),...contacts.map(c=>c.source)])).map(value=><option value={value} key={value}>{sourceLabel(value)}</option>)}</select></div>{loading?<p className="crm-subtle">Cargando contactos…</p>:!filtered.length?<div className="crm-empty"><Users size={30}/><h2>{contacts.length?'Sin coincidencias':'Todavía no hay contactos'}</h2><p>{contacts.length?'No hay contactos con estos filtros.':'Registra tu primera oportunidad y organiza su seguimiento.'}</p>{contacts.length?<Button variant="outline" onClick={()=>{setQuery('');setStatus('');setSource('');}}>Limpiar filtros</Button>:<Button onClick={()=>setCreateOpen(true)}><Plus/> Crear primer contacto</Button>}</div>:filtered.map(contact=><Button variant="ghost" className={'crm-contact'+(selectedId===contact.id?' is-active':'')} key={contact.id} onClick={()=>{setSelectedId(contact.id);setMessage('');}} aria-label={'Ver '+contact.full_name}><span className="crm-avatar">{contact.full_name.slice(0,2).toUpperCase()}</span><span className="crm-contact-main"><span className="crm-contact-title"><b>{contact.full_name}</b><Stage value={contact.status}/></span><p>{contact.brand_name||contact.business_type||'Sin empresa registrada'}</p><p>{contact.whatsapp||'Sin WhatsApp'}</p><small>{sourceLabel(contact.source)} · {dateLabel(contact.created_at)}</small>{contact.next_follow_up_at&&<small>Seguimiento: {dateLabel(contact.next_follow_up_at)}</small>}</span></Button>)}</section>{selected?<ContactDetail key={selected.id} contact={selected} onUpdated={updated=>setContacts(items=>items.map(c=>c.id===updated.id?updated:c))} onBack={()=>setSelectedId('')}/>:<aside className="crm-detail-placeholder"><Users size={36}/><h2>Detalle de oportunidad</h2><p className="crm-subtle">Selecciona un contacto para ver su actividad y seguimiento.</p></aside>}</div></div><ContactForm open={createOpen} onOpenChange={setCreateOpen} onCreated={(contact,warning)=>{setContacts(items=>[contact,...items]);setSelectedId(contact.id);setMessage(warning);}}/><Security open={securityOpen} onOpenChange={setSecurityOpen}/></main>;
}
