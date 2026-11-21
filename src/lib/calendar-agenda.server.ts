/**
 * Read-only Google Calendar agenda. The CRM can display Google events without
 * inserting fictitious clients or incorrectly treating appointment-schedule
 * availability blocks as confirmed bookings.
 */
import { googleConnectionAccess } from '@/lib/calendar-connection.server';

export type GoogleAgendaEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  eventType: string;
  transparent: boolean;
  guestsCount: number;
};

type GoogleEventRecord = {
  id?: string;
  status?: string;
  summary?: string;
  eventType?: string;
  transparency?: string;
  start?: {dateTime?: string;date?: string};
  end?: {dateTime?: string;date?: string};
  attendees?: {email?: string}[];
};

const dayPattern=/^\d{4}-\d{2}-\d{2}$/;
function parseDay(date:string) {
  if(!dayPattern.test(date))throw Error('Rango de fechas inválido.');
  const ms=Date.parse(date+'T00:00:00Z');
  if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==date)
    throw Error('Fecha inválida.');
  return ms;
}

export function validateAgendaWindow(from:string,to:string) {
  const start=parseDay(from),end=parseDay(to);
  if(end<=start||end-start>50*86400000)
    throw Error('Consulta únicamente un período de hasta 50 días.');
  return {
    start: from+'T00:00:00-05:00',
    end: to+'T00:00:00-05:00',
  };
}

export function normalizeGoogleAgendaEvent(event:GoogleEventRecord):GoogleAgendaEvent|null {
  if(!event.id||event.status==='cancelled')return null;
  const allDay=Boolean(event.start?.date && event.end?.date &&
    !event.start?.dateTime && !event.end?.dateTime);
  const from=allDay?event.start?.date+'T00:00:00-05:00':event.start?.dateTime;
  const to=allDay?event.end?.date+'T00:00:00-05:00':event.end?.dateTime;
  if(!from||!to)return null;
  const fromDate=Date.parse(from),toDate=Date.parse(to);
  if(!Number.isFinite(fromDate)||!Number.isFinite(toDate)||toDate<=fromDate)return null;
  return {
    id:event.id,
    title:(event.summary||'Evento de Google sin título').slice(0,160),
    startsAt:new Date(fromDate).toISOString(),
    endsAt:new Date(toDate).toISOString(),
    allDay,
    eventType:event.eventType||'default',
    transparent:event.transparency==='transparent',
    guestsCount:(event.attendees||[]).filter(g=>Boolean(g.email)).length,
  };
}

export function googleAgendaEventOverlapsDay(event:GoogleAgendaEvent,day:string) {
  const start=Date.parse(day+'T00:00:00-05:00');
  return Date.parse(event.startsAt)<start+86400000 && Date.parse(event.endsAt)>start;
}

export function calendarEventsNotInCrm(
  google:GoogleAgendaEvent[],linkedIds:Iterable<string|null|undefined>,
) {
  const ids=new Set(Array.from(linkedIds).filter((id):id is string=>Boolean(id)));
  return google.filter(event=>!ids.has(event.id));
}

export async function googleAgendaForAdmin(from:string,to:string) {
  const range=validateAgendaWindow(from,to);
  const access=await googleConnectionAccess();
  if(!access)throw Error('Conecta Google Calendar desde Configuración para ver sus eventos.');
  const events:GoogleAgendaEvent[]=[];
  let pageToken='';
  for(let page=0;page<12;page++){
    const params=new URLSearchParams({
      timeMin:range.start,
      timeMax:range.end,
      singleEvents:'true',
      showDeleted:'false',
      orderBy:'startTime',
      maxResults:'2500',
    });
    if(pageToken)params.set('pageToken',pageToken);
    const response=await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/'+
      encodeURIComponent(access.calendarId)+'/events?'+params,
      {headers:{Authorization:'Bearer '+access.token}},
    );
    if(!response.ok)throw Error('No fue posible leer Google Calendar. Comprueba la autorización.');
    const data=await response.json() as {
      items?:GoogleEventRecord[];
      nextPageToken?:string;
    };
    for(const record of data.items||[]){
      const normalized=normalizeGoogleAgendaEvent(record);
      if(normalized)events.push(normalized);
    }
    if(!data.nextPageToken){
      return {events,calendar:access.calendarId,from,to,checkedAt:new Date().toISOString()};
    }
    pageToken=data.nextPageToken;
  }
  throw Error('Demasiados eventos en este rango; no se muestra una agenda incompleta.');
}
