import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {
 hasVerifiableInboundMessage,normalizeRailwayWhatsappId,railwayCandidates,
 reconciliationPreview,type RailwayConversationSnapshot,
} from '@/lib/railway-conversation-reconcile';
const row=(wa_id:string,history_json:string|null):RailwayConversationSnapshot=>({
 wa_id,history_json,updated_at:'2026-11-27T15:00:00Z',
});
const inbound=JSON.stringify([{role:'user',content:'Quiero conocer el servicio'},{role:'assistant',content:'Gracias'}]);
const outbound=JSON.stringify([{role:'assistant',content:'Bienvenido'}]);
describe('Railway conversation and CRM contact counts are different concepts',()=>{
 it('normalizes real individual numbers without merging groups, broadcasts and junk',()=>{
  expect(normalizeRailwayWhatsappId('+57 300 111 2233')).toBe('573001112233');
  expect(normalizeRailwayWhatsappId('573001112233@s.whatsapp.net')).toBe('573001112233');
  expect(normalizeRailwayWhatsappId('573001112233@c.us')).toBe('573001112233');
  expect(normalizeRailwayWhatsappId('573001112233@g.us')).toBeNull();
  expect(normalizeRailwayWhatsappId('status@broadcast')).toBeNull();
  expect(normalizeRailwayWhatsappId('12345')).toBeNull();
  expect(normalizeRailwayWhatsappId('somebody@example.com')).toBeNull();
 });
 it('imports only histories with explicit inbound customer messages',()=>{
  expect(hasVerifiableInboundMessage(inbound)).toBe(true);
  expect(hasVerifiableInboundMessage(outbound)).toBe(false);
  expect(hasVerifiableInboundMessage(JSON.stringify({messages:[{direction:'inbound',text:'Hola'}]}))).toBe(true);
  expect(hasVerifiableInboundMessage(JSON.stringify({messages:[{from_me:false,text:'Hola'}]}))).toBe(true);
  expect(hasVerifiableInboundMessage('not json')).toBe(false);
  expect(hasVerifiableInboundMessage(null)).toBe(false);
  expect(hasVerifiableInboundMessage(JSON.stringify([{role:'system',content:'Prompt'}]))).toBe(false);
 });
 it('deduplicates by normal phone and excludes invalid/system IDs',()=>{
  const result=railwayCandidates([row('573001112233',inbound),
   row('+57 300 111 2233',outbound),row('status@broadcast',inbound)]);
  expect(result.candidates).toHaveLength(1);
  expect(result.duplicatePhones).toBe(1);
  expect(result.invalidOrSystem).toBe(1);
  expect(result.candidates[0]?.eligible).toBe(true);
 });
 it('compares with ALL CRM contacts, not just WhatsApp IA source',()=>{
  const rows=[row('573001112233',inbound),row('573001112244',inbound),
   row('573001112255',outbound),row('status@broadcast',inbound)];
  const crm=[{id:'manual',whatsapp:'+573001112233'}];
  const result=reconciliationPreview(rows,crm);
  expect(result.counts).toEqual({
   railwayRows:4,validPhoneConversations:3,invalidOrSystem:1,
   duplicatePhones:0,alreadyInCrm:1,readyToImport:1,needsReview:1,
   crmPhoneDuplicates:0,
  });
  expect(result.toImport).toHaveLength(1);
  expect(result.toImport[0]?.phone).toBe('573001112244');
 });
 it('does not import the same number when CRM has duplicate contacts',()=>{
  const result=reconciliationPreview([row('573001112233',inbound)],[
   {id:'a',whatsapp:'573001112233'},{id:'b',whatsapp:'+573001112233'},
  ]);
  expect(result.counts.crmPhoneDuplicates).toBe(1);
  expect(result.counts.alreadyInCrm).toBe(1);
  expect(result.counts.readyToImport).toBe(0);
 });
});
describe('Railway CRM backfill is an authenticated server-only feature',()=>{
 const route=readFileSync('src/routes/api.railway.reconcile.ts','utf8');
 const server=readFileSync('src/lib/railway-conversation-reconcile.server.ts','utf8');
 const ui=readFileSync('src/components/crm/railway-conversation-reconciler.tsx','utf8');
 const admin=readFileSync('src/routes/admin.tsx','utf8');
 it('requires admin, protects the connection secret and supports preview',()=>{
  expect(route).toContain('requireCalendarAdmin(request)');
  expect(route).toContain("body.action!=='preview'&&body.action!=='import'");
  expect(server).toContain("process.env['RAILWAY_READONLY_DATABASE_URL']");
  expect(server).toContain("ssl:'require'");
  expect(ui).toContain("request('preview')");
 });
 it('reuses CRM phone-scoped idempotent RPC and never changes appointments',()=>{
  expect(server).toContain("db.rpc('crm_receive_whatsapp_event'");
  expect(server).toContain("p_event_type:'lead_creado'");
  expect(server).not.toContain("from('crm_meetings').insert(");
  expect(server).not.toContain("asistencia_confirmada");
  expect(server).not.toContain("sendWhatsApp");
  expect(server).not.toContain("DELETE");
 });
 it('requires explicit user import action, not import on mount',()=>{
  expect(ui).toContain('window.confirm(');
  expect(ui).toContain("request('import')");
  expect(admin).toContain('RailwayConversationReconciler');
  expect(admin).toContain('Contactos CRM');
  expect(admin).toContain('Etapa cita (sin verificar)');
 });
});
