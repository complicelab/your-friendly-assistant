import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  calendarEventsNotInCrm,
  googleAgendaEventOverlapsDay,
  normalizeGoogleAgendaEvent,
  validateAgendaWindow,
} from '@/lib/calendar-agenda.server';

const google1={
 id:'google-1',summary:'Diagnóstico Cómplice Lab',
 start:{dateTime:'2026-11-21T09:30:00-05:00'},
 end:{dateTime:'2026-11-21T10:15:00-05:00'},
 attendees:[{email:'cliente@example.com'}],
};
const google2={
 id:'google-2',summary:'Reunión ya vinculada',
 start:{dateTime:'2026-11-21T12:45:00-05:00'},
 end:{dateTime:'2026-11-21T13:30:00-05:00'},
};

describe('Google Calendar agenda read-only event projection',()=>{
 it('shows Google reservations even if not associated with a CRM contact',()=>{
  const a=normalizeGoogleAgendaEvent(google1);
  expect(a?.title).toBe('Diagnóstico Cómplice Lab');
  expect(a?.startsAt).toBe('2026-11-21T14:30:00.000Z');
  expect(a?.guestsCount).toBe(1);
  expect(a?.allDay).toBe(false);
 });
 it('removes only events already linked by external ID, not same-title entries',()=>{
  const data=[normalizeGoogleAgendaEvent(google1)!,normalizeGoogleAgendaEvent(google2)!];
  expect(calendarEventsNotInCrm(data,['google-2'])).toHaveLength(1);
  expect(calendarEventsNotInCrm(data,['google-2'])[0]?.id).toBe('google-1');
  expect(calendarEventsNotInCrm(data,[null,'another-id'])).toHaveLength(2);
 });
 it('distinguishes all-day calendar events from booked appointments',()=>{
  const allDay=normalizeGoogleAgendaEvent({
   id:'all-day',summary:'Independencia de Cartagena',
   start:{date:'2026-11-16'},end:{date:'2026-11-17'},
  });
  expect(allDay?.allDay).toBe(true);
  expect(googleAgendaEventOverlapsDay(allDay!,'2026-11-16')).toBe(true);
  expect(googleAgendaEventOverlapsDay(allDay!,'2026-11-17')).toBe(false);
 });
 it('does not display deleted, cancelled or malformed events',()=>{
  expect(normalizeGoogleAgendaEvent({...google1,status:'cancelled'})).toBeNull();
  expect(normalizeGoogleAgendaEvent({id:'broken',start:google1.start})).toBeNull();
  expect(normalizeGoogleAgendaEvent({...google1,end:google1.start})).toBeNull();
 });
 it('enforces limited exact date ranges, including real month views',()=>{
  expect(validateAgendaWindow('2026-10-26','2026-12-07').start)
   .toBe('2026-10-26T00:00:00-05:00');
  expect(()=>validateAgendaWindow('2026-11-21','2027-05-01')).toThrow();
  expect(()=>validateAgendaWindow('2026-02-30','2026-03-07')).toThrow();
 });
});

describe('CRM agenda actually renders Google events',()=>{
 const admin=readFileSync('src/routes/admin.tsx','utf8');
 const agenda=readFileSync('src/components/crm/agenda.tsx','utf8');
 const api=readFileSync('src/routes/api.calendar.ts','utf8');
 const server=readFileSync('src/lib/calendar-agenda.server.ts','utf8');
 it('has authenticated read-only action and no calendar writing in that action',()=>{
  expect(api).toContain("await cal.requireCalendarAdmin(request)");
  expect(api).toContain("body.action==='agenda'");
  expect(server).toContain("showDeleted:'false'");
  expect(server).toContain("singleEvents:'true'");
  expect(server).not.toContain("method:'PATCH'");
  expect(server).not.toContain("method:'DELETE'");
  expect(server).not.toContain("method:'POST'");
 });
 it('shows events in month cells, day list and upcoming with separate Google badge',()=>{
  expect(agenda).toContain("googleItems.slice(0,2)");
  expect(agenda).toContain("dayGoogle.map(event=>");
  expect(agenda).toContain("upcomingGoogle.slice(0,12)");
  expect(agenda).toContain("Google Calendar · sin vínculo con un cliente del CRM");
  expect(agenda).toContain("googleLoaded&&");
 });
 it('does not silently claim empty agenda when Google API fails',()=>{
  expect(agenda).toContain("googleError&&");
  expect(agenda).toContain("No es posible mostrar Google Calendar");
  expect(agenda).toContain("Mostrar eventos reales de Google Calendar");
  expect(agenda).toContain("googleSequence.current");
 });
 it('links the review workflow without implicitly creating contacts',()=>{
  expect(admin).toContain('onOpenReview={()=>setView("configuracion")}');
  expect(agenda).toContain('Revisar y vincular cliente');
  expect(agenda).not.toContain("supabase.from('crm_contacts').insert");
 });
});
