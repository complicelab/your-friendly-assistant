import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { classifyCalendarReview, matchCalendarContact, type ReviewInput } from '@/lib/calendar-review-model';

const start='2026-11-24T14:00:00Z', end='2026-11-24T15:00:00Z';
const events:ReviewInput[]=Array.from({length:8},(_,i)=>({
 id:'calendar_event_'+(i+1),summary:'Cita '+(i+1),
 start:{dateTime:start},end:{dateTime:end},
 ...(i===0?{attendees:[{email:'ana@empresa.com'}]}:{}),
}));
const contacts=[{id:'client-1',email:'ana@empresa.com',whatsapp:'+57 300 111 1111'},
 {id:'client-2',email:'pablo@empresa.com',whatsapp:'+57 300 222 2222'}];

describe('Google Calendar unmatched event review',()=>{
 it('represents all 8 example unmatched events without importing or creating clients',()=>{
  const review=classifyCalendarReview(events,contacts,new Set(),new Set());
  expect(review.pending_total).toBe(8);
  expect(review.pending).toHaveLength(8);
  expect(review.pending[0]?.suggestedContactId).toBe('client-1');
  expect(review.pending[1]?.suggestedContactId).toBeNull();
  expect(review.truncated).toBe(false);
 });
 it('keeps ignored decisions separate and excludes linked events',()=>{
  const review=classifyCalendarReview(events,contacts,
   new Set(['calendar_event_2']),new Set(['calendar_event_1']));
  expect(review.pending_total).toBe(6);
  expect(review.ignored_total).toBe(1);
  expect(review.ignored[0]?.id).toBe('calendar_event_1');
 });
 it('does not import cancelled or all-day events as client meetings',()=>{
  const review=classifyCalendarReview([
   {id:'cancelled',status:'cancelled',start:{dateTime:start},end:{dateTime:end}},
   {id:'all-day',start:{date:'2026-11-24'},end:{date:'2026-11-25'}},
   {id:'no-end',start:{dateTime:start}},...events,
  ],contacts,new Set(),new Set());
  expect(review.pending_total).toBe(8);
 });
 it('refuses ambiguous matches and ignores an unlabelled name',()=>{
  expect(matchCalendarContact({summary:'Ana consultorio'},contacts)).toEqual({contactId:null,ambiguous:false});
  expect(matchCalendarContact({attendees:[{email:'ana@empresa.com'}],
   description:'Correo: pablo@empresa.com'},contacts)).toEqual({contactId:null,ambiguous:true});
 });
 it('does not leak full Google descriptions to the client browser',()=>{
  const review=classifyCalendarReview([{...events[0]!,description:'Nota privada del cliente'}],
   contacts,new Set(),new Set());
  expect(JSON.stringify(review)).not.toContain('Nota privada');
 });
});

describe('Google Calendar integration implementation safeguards',()=>{
 const server=readFileSync('src/lib/calendar-review.server.ts','utf8');
 const api=readFileSync('src/routes/api.calendar.ts','utf8');
 const migration=readFileSync('supabase/migrations/20261121_calendar_review_and_attach.sql','utf8');
 const schedule=readFileSync('.github/workflows/calendar-scheduled-sync.yml','utf8');
 it('requires admin session and verifies live event before linking',()=>{
  expect(api).toContain('await cal.requireCalendarAdmin(request)');
  expect(server).toContain('await fetchGoogleEvent(access,eventId)');
  expect(server).toContain("db.rpc('crm_attach_google_calendar_event'");
 });
 it('requires service role, checks ownership and suppresses duplicate meeting insertion',()=>{
  expect(migration).toContain("auth.role() <> 'service_role'");
  expect(migration).toContain('event already belongs to a different contact');
  expect(migration).toContain('pg_advisory_xact_lock');
  expect(migration).toContain("source, external_calendar_id, meeting_url");
  expect(migration).toContain("source, external_calendar_id");
 });
 it('guards rescheduling with Google ETag and CRM overlap checks',()=>{
  expect(server).toContain("'If-Match'");
  expect(server).toContain(".neq('status','cancelada')");
  expect(server).toContain('No se pudo verificar el nuevo horario en Google');
  expect(server).toContain('revisión manual inmediata');
 });
 it('only enables cron with authenticated server secret',()=>{
  expect(schedule).toContain('secrets.CRM_CALENDAR_CRON_SECRET');
  expect(schedule).toContain('https://complicelab.com/api/calendar/cron');
  expect(readFileSync('src/routes/api.calendar.cron.ts','utf8'))
   .toContain('CRM_CALENDAR_CRON_SECRET');
 });
 it('offers read-only connection test without creating an appointment',()=>{
  expect(server).toContain('verifyCalendarConnectionWithoutWrites');
  const block=server.slice(server.indexOf('export async function verifyCalendarConnectionWithoutWrites'),
    server.indexOf('function normalizeStart'));
  expect(block).not.toContain("method:'POST',headers:{Authorization:");
  expect(block).not.toContain('crm_meetings');
 });
});
