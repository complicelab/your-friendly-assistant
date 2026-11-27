/**
 * Railway conversation backfill classification (NO agent messaging).
 *
 * Railway stores one row per wa_id in conversations. CRM stores one contact
 * per person, and message_logs store many messages per conversation.
 * Counting these as the same thing leads to false "missing 68" claims.
 *
 * Only an explicit incoming user role/direction in a parseable history
 * qualifies for automatic backfill. Unknown historical formats are held
 * for review, never silently imported.
 */
export type RailwayConversationSnapshot = {
 wa_id:string;updated_at:string|null;history_json:string|null;
};
export type RailwayConversationCandidate = {
 phone:string;lastSeenAt:string|null;eligible:boolean;
 reason:'inbound_verified'|'history_unrecognized';
};
export type RailwayReconciliationPreview={
 railwayRows:number;validPhoneConversations:number;invalidOrSystem:number;
 duplicatePhones:number;alreadyInCrm:number;readyToImport:number;
 needsReview:number;crmPhoneDuplicates:number;
};
const asObject=(x:unknown):Record<string,unknown>|null=>
 x!==null&&typeof x==='object'&&!Array.isArray(x)?x as Record<string,unknown>:null;

export function normalizeRailwayWhatsappId(value:string):string|null{
 const raw=value.trim().toLowerCase();
 if(!raw||/@g\.us$|@broadcast$|@newsletter$|^status\b|^broadcast\b|^group\b/.test(raw))return null;
 // WhatsApp individual JIDs only. Do not turn arbitrary e-mails / group IDs
 // into false phone numbers.
 if(raw.includes('@')&&!/@(?:s\.whatsapp\.net|c\.us)$/.test(raw))return null;
 const prefix=raw.replace(/@(?:s\.whatsapp\.net|c\.us)$/,'');
 if(!/^\+?[0-9 ()-]+$/.test(prefix))return null;
 const digits=prefix.replace(/\D/g,'');
 if(digits.length<8||digits.length>15||/^0+$/.test(digits))return null;
 return digits;
}

function isIncoming(value:unknown){
 const msg=asObject(value);if(!msg)return false;
 const actor=String(msg['role']??msg['sender']??msg['actor']??'').toLowerCase();
 const direction=String(msg['direction']??msg['type_direction']??'').toLowerCase();
 return ['user','human','customer','cliente','client','contact'].includes(actor)||
  ['inbound','incoming','received','entrante'].includes(direction)||
  msg['from_me']===false||msg['fromMe']===false;
}
function containsIncomingMessage(value:unknown,depth=0):boolean{
 if(depth>4)return false;
 if(Array.isArray(value))return value.slice(0,500).some(x=>containsIncomingMessage(x,depth+1));
 const obj=asObject(value);
 if(!obj)return false;
 if(isIncoming(obj))return true;
 for(const key of ['history','messages','items','entries','chat','turns','conversation','data']){
  if(key in obj&&containsIncomingMessage(obj[key],depth+1))return true;
 }
 return false;
}
export function hasVerifiableInboundMessage(history:string|null):boolean{
 if(!history||history.length>262144)return false;
 try{
  let parsed:unknown=JSON.parse(history);
  if(typeof parsed==='string'&&parsed.length<262144)parsed=JSON.parse(parsed);
  return containsIncomingMessage(parsed);
 }catch{return false;}
}
export function railwayCandidates(rows:RailwayConversationSnapshot[]){
 const unique=new Map<string,RailwayConversationCandidate>();
 let invalidOrSystem=0,duplicatePhones=0;
 for(const row of rows){
  const phone=normalizeRailwayWhatsappId(row.wa_id);
  if(!phone){invalidOrSystem++;continue;}
  const eligible=hasVerifiableInboundMessage(row.history_json);
  const previous=unique.get(phone);
  if(previous)duplicatePhones++;
  if(!previous||eligible&&!previous.eligible)unique.set(phone,{
   phone,lastSeenAt:row.updated_at||null,eligible,
   reason:eligible?'inbound_verified':'history_unrecognized',
  });
 }
 return {candidates:[...unique.values()],invalidOrSystem,duplicatePhones};
}
export function reconciliationPreview(
 rows:RailwayConversationSnapshot[],
 crmContacts:{id:string;whatsapp:string|null}[],
):{counts:RailwayReconciliationPreview;toImport:RailwayConversationCandidate[]}{
 const {candidates,invalidOrSystem,duplicatePhones}=railwayCandidates(rows);
 const crmPhones=new Map<string,number>();
 for(const c of crmContacts){
  const phone=normalizeRailwayWhatsappId(c.whatsapp||'');
  if(phone)crmPhones.set(phone,(crmPhones.get(phone)||0)+1);
 }
 const crmPhoneDuplicates=[...crmPhones.values()].filter(n=>n>1).length;
 let alreadyInCrm=0,needsReview=0;const toImport:RailwayConversationCandidate[]=[];
 for(const candidate of candidates){
  if(crmPhones.has(candidate.phone)){alreadyInCrm++;continue;}
  if(!candidate.eligible){needsReview++;continue;}
  toImport.push(candidate);
 }
 return {
  counts:{
   railwayRows:rows.length,validPhoneConversations:candidates.length,
   invalidOrSystem,duplicatePhones,alreadyInCrm,readyToImport:toImport.length,
   needsReview,crmPhoneDuplicates,
  },toImport,
 };
}
