/** Pure review logic: no network and no database access. */
export type ReviewIdentity = {id:string;email:string|null;whatsapp:string|null};
export type ReviewInput = {
 id?:string;status?:string;summary?:string;
 start?:{dateTime?:string;date?:string};
 end?:{dateTime?:string;date?:string};
 attendees?:{email?:string;self?:boolean}[];
 organizer?:{email?:string};
 description?:string;
};
export type ReviewSummary={
 id:string;title:string;startsAt:string;endsAt:string;guests:string[];
 suggestedContactId:string|null;ambiguous:boolean;
};
const clean=(value?:string|null)=>String(value||'').trim().toLowerCase();
const phone=(value?:string|null)=>String(value||'').replace(/\D/g,'');
export function matchCalendarContact(event:ReviewInput,contacts:ReviewIdentity[]) {
 const emails=new Set((event.attendees||[]).filter(g=>!g.self).map(g=>clean(g.email))
  .filter(e=>e&&e!=='complicelab@gmail.com'));
 if(event.organizer?.email&&clean(event.organizer.email)!=='complicelab@gmail.com')
  emails.add(clean(event.organizer.email));
 const em=event.description?.match(/(?:^|\n)\s*(?:correo|email)\s*:\s*([^\s,;]+)/i)?.[1];
 if(em&&clean(em)!=='complicelab@gmail.com')emails.add(clean(em));
 const number=phone(event.description?.match(/(?:^|\n)\s*(?:whatsapp|telefono|teléfono)\s*:\s*([+\d ()-]{8,25})/i)?.[1]);
 const matches=contacts.filter(c=>(c.email&&emails.has(clean(c.email)))||
  (number.length>=10&&phone(c.whatsapp)===number));
 return {contactId:matches.length===1?matches[0]!.id:null,ambiguous:matches.length>1};
}
export function classifyCalendarReview(
 events:ReviewInput[],contacts:ReviewIdentity[],
 linkedIds:Set<string>,ignoredIds:Set<string>,
){
 const pending:ReviewSummary[]=[],ignored:ReviewSummary[]=[];
 for(const event of events){
  if(!event.id||linkedIds.has(event.id)||event.status==='cancelled'||
   !event.start?.dateTime||!event.end?.dateTime)continue;
  const start=Date.parse(event.start.dateTime),end=Date.parse(event.end.dateTime);
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)continue;
  const matched=matchCalendarContact(event,contacts);
  const item:ReviewSummary={
    id:event.id,title:String(event.summary||'Evento sin título').slice(0,180),
    startsAt:new Date(start).toISOString(),endsAt:new Date(end).toISOString(),
    guests:(event.attendees||[]).filter(g=>!g.self&&!!g.email&&
      clean(g.email)!=='complicelab@gmail.com').slice(0,5)
      .map(g=>String(g.email).slice(0,180)),
    suggestedContactId:matched.contactId,ambiguous:matched.ambiguous,
  };
  (ignoredIds.has(event.id)?ignored:pending).push(item);
 }
 return {pending:pending.slice(0,150),ignored:ignored.slice(0,150),
  pending_total:pending.length,ignored_total:ignored.length,
  truncated:pending.length>150||ignored.length>150};
}
