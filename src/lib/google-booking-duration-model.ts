/**
 * The public Google Calendar API does not expose an Appointment Schedule's
 * configured duration. This ONLY infers a duration from independently booked,
 * confirmed "Diagnóstico Cómplice Lab" calendar events. Never parse a calendar
 * availability background as an actual booking or claim that this is Google
 * Appointment Schedules metadata.
 */
export type GoogleDurationEvent={
 summary?:string;status?:string;transparency?:string;created?:string;
 start?:{dateTime?:string;date?:string};end?:{dateTime?:string;date?:string};
 attendees?:{email?:string;self?:boolean}[];
 organizer?:{email?:string};creator?:{email?:string};
 description?:string;
};
export type DurationInference={minutes:number|null;observations:number;sampleSize:number;confidence:'verified'|'insufficient'|'mixed'};

const agency='complicelab@gmail.com';
export const isAgencyBookingTitle=(title:string|undefined)=>
 /^diagn[oó]stico\s+c[oó]mplice\s+lab(?:\s*[·:–-].*)?$/iu.test((title||'').trim());

export function bookingDurationSample(event:GoogleDurationEvent):{minutes:number;created:number}|null {
 if(event.status==='cancelled'||event.transparency==='transparent'||
  !isAgencyBookingTitle(event.summary)||
  !event.start?.dateTime||!event.end?.dateTime||
  /CRM meeting ID\s*:|Reserva creada desde C[oó]mplice Lab/i.test(event.description||''))return null;
 // A real customer participant/organizer is required. Availability templates and
 // own calendar blocks with no customer identity cannot influence CRM bookings.
 const participant=event.attendees?.some(a=>!!a.email && a.email.toLowerCase()!==agency && !a.self)||
   [event.organizer?.email,event.creator?.email].some(e=>Boolean(e)&&e!.toLowerCase()!==agency);
 if(!participant)return null;
 const ms=Date.parse(event.end.dateTime)-Date.parse(event.start.dateTime);
 if(!Number.isFinite(ms)||ms<=0||ms%60_000!==0)return null;
 const minutes=ms/60_000;
 if(!Number.isInteger(minutes)||minutes<15||minutes>180||minutes%5!==0)return null;
 const created=Date.parse(event.created||event.start.dateTime);
 return {minutes,created:Number.isFinite(created)?created:0};
}

export function inferAgencyBookingDuration(events:GoogleDurationEvent[]):DurationInference{
 const candidates=events.map(bookingDurationSample).filter((x):x is NonNullable<typeof x>=>!!x)
  .sort((a,b)=>b.created-a.created).slice(0,16);
 if(candidates.length<2)return {minutes:null,observations:candidates.length,
   sampleSize:candidates.length,confidence:'insufficient'};
 // Follow latest confirmed reservations, not older samples from another booking
 // setup. A mixed or tied set must NEVER silently overwrite CRM duration.
 const recent=candidates.slice(0,Math.min(6,candidates.length));
 const counts=new Map<number,number>();
 for(const sample of recent)counts.set(sample.minutes,(counts.get(sample.minutes)||0)+1);
 const ranked=[...counts].sort((a,b)=>b[1]-a[1]);
 const [minutes,count]=ranked[0]!;
 if(count<2||count/recent.length<2/3||
    (ranked[1]&&ranked[1][1]===count))
  return {minutes:null,observations:count,sampleSize:recent.length,confidence:'mixed'};
 return {minutes,observations:count,sampleSize:recent.length,confidence:'verified'};
}
