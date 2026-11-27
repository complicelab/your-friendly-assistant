import {useCallback,useState} from 'react';
import type {RailwayReconciliationPreview} from '@/lib/railway-conversation-reconcile';
import './railway-conversation-reconciler.css';

type Result={ok:boolean;error?:string;mode?:'preview'|'import';
 counts?:RailwayReconciliationPreview;imported?:number;errors?:number};
export function RailwayConversationReconciler({accessToken,onImport}:{
 accessToken:string;onImport:()=>void;
}){
 const [result,setResult]=useState<Result|null>(null);
 const [busy,setBusy]=useState(false);
 const request=useCallback(async(action:'preview'|'import')=>{
  if(!accessToken)return;
  if(action==='import'&&!window.confirm(
   '¿Importar únicamente conversaciones de Railway con mensajes entrantes verificables y sin contacto previo? No se alterarán respuestas del agente, conversaciones, citas ni Google Calendar.'))return;
  setBusy(true);
  try{
   const response=await fetch('/api/railway/reconcile',{
    method:'POST',headers:{Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},
    body:JSON.stringify({action}),cache:'no-store',
   });
   const body=await response.json() as Result;
   if(!response.ok||!body.ok)throw Error(body.error||'No fue posible conciliar.');
   setResult(body);
   if(action==='import'&&Number(body.imported)>0)onImport();
  }catch(error){setResult({ok:false,error:error instanceof Error?error.message:'No fue posible consultar Railway.'});}
  finally{setBusy(false);}
 },[accessToken,onImport]);
 const c=result?.counts;
 return <section className="clb-settings-card clb-railway-reconcile">
  <div className="clb-panel-title"><div><span>CONTROL DE CAPTACIÓN</span>
   <h2>Conversaciones Railway ↔ contactos CRM</h2></div>
   <button className="crm-secondary" disabled={busy||!accessToken}
    onClick={()=>void request('preview')}>{busy?'Comparando…':'Comparar registros'}</button>
  </div>
  <p className="clb-muted">El total de «Oportunidades» cuenta contactos guardados en Lovable Cloud,
   no todas las conversaciones del agente. Esta comparación consulta Railway en modo lectura,
   identifica WhatsApp únicos y evita importar números de sistema o chats sin evidencia de un
   mensaje entrante.</p>
  {result?.error&&<p className="crm-alert" role="alert">{result.error}
    {result.error.includes('no está configurada')&&
     ' Esta conexión es independiente del plugin de Railway de ChatGPT: se necesita una credencial PostgreSQL de SOLO LECTURA guardada como secreto RAILWAY_READONLY_DATABASE_URL en el servidor de Lovable Cloud.'}
  </p>}
  {c&&<>
   <div className="clb-railway-counts" aria-label="Conciliación Railway y CRM">
    <div><span>Conversaciones Railway</span><strong>{c.railwayRows}</strong><small>Filas reales leídas</small></div>
    <div><span>WhatsApp únicos válidos</span><strong>{c.validPhoneConversations}</strong></div>
    <div><span>Ya están en el CRM</span><strong>{c.alreadyInCrm}</strong></div>
    <div><span>Para importar</span><strong>{c.readyToImport}</strong><small>Con entrada humana verificable</small></div>
    <div><span>Revisión necesaria</span><strong>{c.needsReview}</strong><small>Formato de historial desconocido</small></div>
    <div><span>Excluidos</span><strong>{c.invalidOrSystem}</strong><small>IDs no válidos o del sistema</small></div>
   </div>
   {c.duplicatePhones>0&&<p className="clb-muted">{c.duplicatePhones} conversaciones comparten un mismo teléfono normalizado.</p>}
   {c.crmPhoneDuplicates>0&&<p className="crm-alert">Hay {c.crmPhoneDuplicates} teléfonos duplicados entre los contactos del CRM. Deben revisarse antes de fusionar fichas.</p>}
   <div className="clb-railway-actions">
    <button type="button" className="crm-primary" disabled={busy||c.readyToImport===0}
      onClick={()=>void request('import')}>Importar {c.readyToImport} contactos válidos</button>
    <small>La importación crea contactos «Nuevos», sin marcar interesados, agendados
      o confirmados. No envía mensajes ni modifica el agente.</small>
   </div>
   {result?.mode==='import'&&<p role="status" className="clb-railway-result">
    Se registraron {result.imported||0} contactos. {result.errors||0} registros
    requieren revisión. Actualiza la comparación para comprobar cuántos faltan.
   </p>}
  </>}
  {!result&&<p className="clb-muted">Pulsa «Comparar registros» para medir la diferencia real.
    El dato de Railway en la página de estado de PostgreSQL es estimado y no sirve
    para concluir automáticamente que faltan 68 clientes.</p>}
 </section>;
}
