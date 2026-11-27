/**
 * Private read-only reconciliation preview and explicit one-time backfill.
 * Does not touch Railway's agent, conversation history, responses or schedules.
 * Railway connection must use a dedicated SELECT-only Postgres account.
 */
import type {RailwayConversationSnapshot} from '@/lib/railway-conversation-reconcile';
import {reconciliationPreview} from '@/lib/railway-conversation-reconcile';
import type {SupabaseClient} from '@supabase/supabase-js';
import {supabaseAdmin} from '@/integrations/supabase/client.server';

const MAX_RAILWAY_CONVERSATIONS=5000;
const PAGE_SIZE=1000;
const MAX_CRM_CONTACTS=20000;
type CrmPhone={id:string;whatsapp:string|null};
type Action='preview'|'import';

async function loadCrmPhones():Promise<CrmPhone[]>{
 const all:CrmPhone[]=[];
 const db=supabaseAdmin as unknown as SupabaseClient;
 for(let offset=0;offset<MAX_CRM_CONTACTS;offset+=PAGE_SIZE){
  const {data,error}=await db.from('crm_contacts').select('id,whatsapp')
   .order('created_at',{ascending:false})
   .range(offset,offset+PAGE_SIZE-1);
  if(error)throw Error('No se pudo comparar con los contactos del CRM.');
  all.push(...data||[]);
  if(!data||data.length<PAGE_SIZE)return all;
 }
 throw Error('El CRM supera el límite de reconciliación. No se importó ningún contacto.');
}
async function loadRailwayConversations():Promise<RailwayConversationSnapshot[]>{
 const connection=String(process.env['RAILWAY_READONLY_DATABASE_URL']||'').trim();
 if(!connection)throw Error('Falta configurar RAILWAY_READONLY_DATABASE_URL en el servidor Lovable Cloud.');
 let url:URL;
 try{url=new URL(connection);}catch{throw Error('La dirección segura de lectura de Railway no es válida.');}
 if(!['postgres:','postgresql:'].includes(url.protocol)||!url.username||
    !url.password||!url.hostname)throw Error('La dirección de Railway debe ser PostgreSQL con acceso de solo lectura.');
 const {default:postgres}=await import('postgres');
 const sql=postgres(connection,{max:1,prepare:false,connect_timeout:8,
  idle_timeout:5,ssl:'require',onnotice:()=>{}});
 try{
  // Histories stay entirely server-side; only a role/direction signal is used.
  // Neither chat text nor phone numbers are sent to the browser or logs.
  const rows=await sql.unsafe(
    'select wa_id,updated_at,case when octet_length(history_json)<=262144 then history_json else null end as history_json from public.conversations order by updated_at desc nulls last limit $1',
    [MAX_RAILWAY_CONVERSATIONS+1]
  ) as RailwayConversationSnapshot[];
  if(rows.length>MAX_RAILWAY_CONVERSATIONS)
   throw Error('Railway supera el límite de lectura seguro; no se realizó la importación.');
  return rows.map(row=>({
   wa_id:String(row.wa_id||''),
   updated_at:row.updated_at?String(row.updated_at):null,
   history_json:typeof row.history_json==='string'?row.history_json:null,
  }));
 }catch(error){
  if(error instanceof Error&&/supera el límite/.test(error.message))throw error;
  throw Error('No fue posible leer conversaciones en Railway con la cuenta de solo lectura.');
 }finally{await sql.end({timeout:3});}
}
export async function reconcileRailwayContacts(action:Action){
 const [rows,crm]=await Promise.all([loadRailwayConversations(),loadCrmPhones()]);
 const {counts,toImport}=reconciliationPreview(rows,crm);
 if(action==='preview')return {counts,imported:0,errors:0,mode:'preview'};
 const db=supabaseAdmin as unknown as SupabaseClient;
 let imported=0,errors=0;
 // The existing RPC serializes contact creation by phone and never invents
 // meetings, RSVP confirmations, calendar links or marketing consent.
 for(const candidate of toImport){
  const timestamp=candidate.lastSeenAt&&Number.isFinite(Date.parse(candidate.lastSeenAt))
   ?new Date(candidate.lastSeenAt).toISOString():new Date().toISOString();
  const {error}=await db.rpc('crm_receive_whatsapp_event',{
   p_event_type:'lead_creado',p_wa_id:candidate.phone,
   p_timestamp:timestamp,p_payload:{origen:'railway_historical_reconciliation'},
  });
  if(error)errors++;
  else imported++;
 }
 return {counts,imported,errors,mode:'import'};
}
