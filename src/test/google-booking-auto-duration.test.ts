import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';
import {bookingDurationSample,inferAgencyBookingDuration,isAgencyBookingTitle} from '@/lib/google-booking-duration-model';

const make=(mins=45,stamp='2026-11-21T14:00:00Z')=>({
 summary:'Diagnóstico Cómplice Lab',
 status:'confirmed',created:stamp,
 start:{dateTime:'2026-11-24T09:00:00-05:00'},
 end:{dateTime:new Date(Date.parse('2026-11-24T09:00:00-05:00')+mins*60_000).toISOString()},
 attendees:[{email:'paciente@example.com'}],
});

describe('Google appointment duration evidence - not schedule metadata',()=>{
 it('accepts variations of agency diagnostic title',()=>{
  expect(isAgencyBookingTitle('Diagnóstico Cómplice Lab')).toBe(true);
  expect(isAgencyBookingTitle('Diagnostico Complice Lab · María')).toBe(true);
  expect(isAgencyBookingTitle('Diagnóstico dental otra marca')).toBe(false);
 });
 it('automatically infers 45 minutes from multiple genuine customer bookings',()=>{
  const result=inferAgencyBookingDuration([
   make(45,'2026-11-21T11:00:00Z'),
   make(45,'2026-11-20T11:00:00Z'),
   make(45,'2026-11-19T11:00:00Z'),
  ]);
  expect(result).toEqual({minutes:45,observations:3,sampleSize:3,confidence:'verified'});
 });
 it('cannot infer from a booking page availability block without a customer',()=>{
  expect(bookingDurationSample({
   summary:'Diagnóstico Cómplice Lab',start:make().start,end:make().end,
  })).toBeNull();
 });
 it('excludes CRM-origin events to avoid local settings forming a feedback loop',()=>{
  expect(bookingDurationSample({...make(60),description:'Reserva creada desde Cómplice Lab.\nCRM meeting ID: 1234'})).toBeNull();
 });
 it('excludes all day, transparent, cancelled, unrelated and abnormal durations',()=>{
  expect(bookingDurationSample({...make(),status:'cancelled'})).toBeNull();
  expect(bookingDurationSample({...make(),transparency:'transparent'})).toBeNull();
  expect(bookingDurationSample({...make(),summary:'Reunión interna'})).toBeNull();
  expect(bookingDurationSample({...make(),start:{date:'2026-11-24'}})).toBeNull();
  expect(bookingDurationSample(make(205))).toBeNull();
 });
 it('will not overwrite an existing duration from a single sample or contradictory evidence',()=>{
  expect(inferAgencyBookingDuration([make()]).minutes).toBeNull();
  expect(inferAgencyBookingDuration([
   make(45,'2026-11-21T11:00:00Z'),make(60,'2026-11-20T11:00:00Z'),
   make(30,'2026-11-19T11:00:00Z'),
  ]).minutes).toBeNull();
 });
 it('switches to recent consistent bookings after Google changes duration',()=>{
  const result=inferAgencyBookingDuration([
   make(45,'2026-11-21T13:00:00Z'),
   make(45,'2026-11-21T12:00:00Z'),
   make(45,'2026-11-21T11:00:00Z'),
   make(60,'2026-11-01T11:00:00Z'),
  ]);
  expect(result.minutes).toBe(45);
 });
});

describe('Full-stack duration consistency and admin lock',()=>{
 const db=readFileSync('supabase/migrations/20261121_google_automatic_booking_duration.sql','utf8');
 const server=readFileSync('src/lib/google-booking-duration.server.ts','utf8');
 const booking=readFileSync('src/routes/api.booking.ts','utf8');
 const settings=readFileSync('src/components/crm/booking-settings.tsx','utf8');
 const api=readFileSync('src/routes/api.calendar.ts','utf8');
 const sync=readFileSync('src/lib/google-calendar-sync.server.ts','utf8');
 it('never lets browser modify Google-owned duration through database permissions',()=>{
  expect(db).toContain("auth.role() is distinct from 'service_role'");
  expect(db).toContain("exists (select 1 from public.crm_calendar_connections where id=1)");
  expect(db).toContain('crm_lock_google_booking_duration');
  expect(settings).toContain('disabled={durationLocked}');
  expect(settings).toContain("...(durationLocked?{}:");
 });
 it('synchronizes both fields before public availability and booking confirmation',()=>{
  expect(server).toContain('meeting_duration_minutes:observed.minutes,slot_minutes:observed.minutes');
  expect((booking.match(/await syncGoogleBookingDuration\(\)/g)||[]).length).toBe(2);
  expect(booking.indexOf('await syncGoogleBookingDuration()')).toBeLessThan(
   booking.indexOf('supabase.rpc("crm_public_available_slots"'));
 });
 it('reports verification status without claiming an undocumented Google API',()=>{
  expect(settings).toContain('no ofrece mediante su API pública');
  expect(settings).toContain('reservas reales');
  expect(api).toContain("body.action==='duration_sync'");
  expect(server).toContain('inferAgencyBookingDuration(events)');
 });
 it('never overwrites last verified duration with inconclusive samples',()=>{
  expect(server).toContain('observed.minutes??old.booking_duration_minutes');
  expect(server).toContain('if(observed.minutes!==null)');
 });
 it('runs with manual/cron sync and without exposing credentials',()=>{
  expect(sync).toContain('await syncGoogleBookingDuration()');
  expect(server).toContain('googleConnectionAccess');
  expect(settings).not.toContain('GOOGLE_CALENDAR_CLIENT_SECRET');
 });
});
