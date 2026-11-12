// Live integration checks. Only the explicitly fictitious phone below may be changed.
const base = Deno.env.get('SUPABASE_URL');
const secret = Deno.env.get('CRM_WEBHOOK_SECRET');
const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const phone = '573000000112';
const name = 'PRUEBA WhatsApp IA 20261112';
const timestamp = '2026-11-12T02:50:00Z';
function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
function config() {
  assert(base && secret && service, 'Live integration configuration required');
  return {base, secret, service};
}
const event = (type = 'lead_creado', payload: Record<string, unknown> = {nombre:name, empresa:'Empresa ficticia de verificación', resumen_necesidad:'Prueba técnica, no contactar', origen:'prueba_tecnica'}) => ({event_type:type,wa_id:phone,timestamp,payload});
async function send(body: unknown, authorized = true, method = 'POST', raw = false, wrong = false) {
  const cfg=config();
  const headers: Record<string,string>={'content-type':'application/json'};
  if (authorized) headers['x-clave']=wrong?'intentionally-invalid-test-key':cfg.secret;
  const result=await fetch(cfg.base+'/functions/v1/recibir-prospecto-whatsapp', {method,headers,...(method==='POST'?{body:raw?String(body):JSON.stringify(body)}:{})});
  await result.text();
  return result.status;
}
async function rows(table: string, query: string) {
  const cfg=config();
  const headers: Record<string,string>={apikey:cfg.service};
  if(cfg.service.startsWith('ey')) headers.Authorization='Bearer '+cfg.service;
  const result=await fetch(cfg.base+'/rest/v1/'+table+'?'+query,{headers});
  assert(result.ok,'Database verification must succeed');
  return await result.json() as Array<Record<string,unknown>>;
}
async function contact() {
  const result=await rows('crm_contacts','whatsapp=eq.%2B'+phone+'&select=*');
  assert(result.length===1,'Exactly one fictitious contact must exist');
  const c=result[0];
  assert(c,'Fictitious contact required');
  return c;
}
Deno.test('security: missing x-clave returns 401 with no writes',async()=>{
  const before=await rows('crm_contacts','whatsapp=eq.%2B'+phone+'&select=id');
  assert(await send(event(),false)===401,'Missing key must be rejected');
  const after=await rows('crm_contacts','whatsapp=eq.%2B'+phone+'&select=id');
  assert(after.length===before.length,'Unauthorized request must not create contacts');
});
Deno.test('security: incorrect x-clave returns 401',async()=>{assert(await send(event(),true,'POST',false,true)===401,'Incorrect key must be rejected');});
Deno.test('security: GET returns 405',async()=>{assert(await send(null,false,'GET')===405,'GET must be rejected');});
Deno.test('security: invalid JSON returns 400',async()=>{assert(await send('{',true,'POST',true)===400,'Invalid JSON must be rejected');});
Deno.test('security: invalid event returns 400',async()=>{assert(await send(event('unknown'))===400,'Unknown event must be rejected');});
Deno.test('security: invalid phone returns 400',async()=>{assert(await send({...event(),wa_id:'12'})===400,'Invalid phone must be rejected');});
Deno.test('security: oversized request returns 413',async()=>{assert(await send(event('lead_creado',{mensaje:'x'.repeat(17000)}))===413,'Oversized request must be rejected');});
Deno.test('prospect: valid event creates contact and activity without consent',async()=>{
  assert(await send(event())===200,'Valid event must succeed');
  const c=await contact();
  assert(c.full_name===name&&c.source==='whatsapp_ia','Name and source must persist');
  assert(c.consent_service===false&&c.consent_marketing===false,'Consent must not be invented');
  const activities=await rows('crm_activities','contact_id=eq.'+c.id+'&channel=eq.whatsapp_ia&activity_type=eq.lead_creado&select=id');
  assert(activities.length>=1,'Inbound activity must exist');
});
Deno.test('duplicates: identical and concurrent retries create no additional activity',async()=>{
  const c=await contact();
  const query='contact_id=eq.'+c.id+'&channel=eq.whatsapp_ia&select=id';
  const before=await rows('crm_activities',query);
  const results=await Promise.all([send(event()),send(event()),send(event())]);
  assert(results.every(s=>s===200),'Retries must succeed');
  assert((await rows('crm_activities',query)).length===before.length,'Retries must not add activities');
});
Deno.test('updates: blank fields preserve existing contact fields',async()=>{
  assert(await send(event('diagnostico_solicitado',{nombre:'',empresa:'',resumen_necesidad:'',interes:'Automatización de prueba'}))===200,'Update must succeed');
  const c=await contact();
  assert(c.full_name===name&&c.brand_name==='Empresa ficticia de verificación'&&c.need==='Prueba técnica, no contactar','Blank values must not erase fields');
  assert(c.solution_interest==='Automatización de prueba','Nonempty values must update');
});
Deno.test('stages: all events advance safely and opt-out prevents regression',async()=>{
  const pairs=[['cita_confirmada','cita_agendada'],['escalado_a_humano','cita_agendada'],['no_interesado','no_interesado'],['opt_out','no_contactar'],['lead_creado','no_contactar']];
  for(const [type,status] of pairs){
    assert(type&&status,'Test event required');
    assert(await send(event(type,{mensaje:'verificación '+type}))===200,'Stage update must succeed');
    assert((await contact()).status===status,'Stage must not regress');
  }
  const c=await contact();
  const metadata=c.metadata as Record<string,Record<string,unknown>>;
  assert(metadata.whatsapp_ia?.no_contactar===true,'Opt-out must be recorded');
});