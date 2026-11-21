import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
type Contact=Pick<Tables<'crm_contacts'>,'id'|'full_name'|'brand_name'|'email'|'whatsapp'|'country'|'created_at'|'last_contact_at'|'status'>;
const PAGE_SIZE=30;
const fmt=(date:string)=>new Intl.DateTimeFormat('es-CO',{dateStyle:'medium',timeZone:'America/Bogota'}).format(new Date(date));
export function CrmClientsList({onOpen}:{onOpen:(id:string)=>void}){
 const [items,setItems]=useState<Contact[]>([]);
 const [query,setQuery]=useState('');
 const [page,setPage]=useState(0);
 const [total,setTotal]=useState(0);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const safeSearch=useMemo(()=>query.trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@._+\s-]/g,'').slice(0,100),[query]);
 useEffect(()=>{
  let live=true;
  (async()=>{
   setLoading(true);setError('');
   let request=supabase.from('crm_contacts').select('id,full_name,brand_name,email,whatsapp,country,created_at,last_contact_at,status',{count:'exact'});
   if(safeSearch){
    const key='%'+safeSearch+'%';
    request=request.or('full_name.ilike.'+key+',email.ilike.'+key+',whatsapp.ilike.'+key+',country.ilike.'+key);
   }
   const {data,count,error}=await request.order('created_at',{ascending:false}).range(page*PAGE_SIZE,page*PAGE_SIZE+PAGE_SIZE-1);
   if(!live)return;
   if(error){setItems([]);setError('No se pudo cargar el listado de clientes.');}
   else{setItems(data||[]);setTotal(count||0);}
   setLoading(false);
  })();
  return()=>{live=false;};
 },[safeSearch,page]);
 return <section className="clb-clients">
  <div className="clb-clients-head"><div><span>BASE COMERCIAL</span><h2>Clientes y contactos</h2><p>Organizados por la fecha en que llegaron al CRM.</p></div><b>{total} registros</b></div>
  <div className="clb-clients-search"><input value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}} aria-label="Buscar clientes" placeholder="Buscar por nombre, correo, WhatsApp o país..."/></div>
  {error&&<p role="alert" className="crm-alert">{error}</p>}
  <div className="clb-client-table-wrap"><table className="clb-client-table">
   <thead><tr><th>Cliente / Empresa</th><th>Correo</th><th>WhatsApp</th><th>País</th><th>Fecha de contacto</th><th>Estado</th><th></th></tr></thead>
   <tbody>
    {items.map(c=><tr key={c.id}>
     <td><strong>{c.full_name}</strong><small>{c.brand_name||'Sin empresa registrada'}</small></td>
     <td>{c.email?<a href={'mailto:'+c.email}>{c.email}</a>:'—'}</td>
     <td>{c.whatsapp?<a href={'https://wa.me/'+c.whatsapp.replace(/\D/g,'')} target="_blank" rel="noopener noreferrer">{c.whatsapp}</a>:'—'}</td>
     <td>{c.country||'—'}</td><td>{fmt(c.last_contact_at||c.created_at)}</td>
     <td><span className="clb-client-status">{c.status.replaceAll('_',' ')}</span></td>
     <td><button type="button" onClick={()=>onOpen(c.id)}>Ver ficha</button></td>
    </tr>)}
   </tbody>
  </table></div>
  {loading?<p className="clb-muted">Cargando clientes...</p>:items.length===0?<p className="clb-muted">No hay registros con esta búsqueda.</p>:null}
  <div className="clb-clients-pager"><span>Página {page+1} de {Math.max(1,Math.ceil(total/PAGE_SIZE))}</span><div>
   <button disabled={page===0||loading} onClick={()=>setPage(n=>Math.max(0,n-1))}>Anterior</button>
   <button disabled={(page+1)*PAGE_SIZE>=total||loading} onClick={()=>setPage(n=>n+1)}>Siguiente</button>
  </div></div>
 </section>;
}
