import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {verifyAppointmentEvidence,auditReplyLabel,
 type AppointmentAuditMeeting,type AppointmentAuditActivity,
} from '@/lib/crm-appointment-evidence';

const date='2026-12-02T15:00:00Z';
const meeting:AppointmentAuditMeeting={
 id:'11111111-1111-4111-8111-111111111111',contact_id:'33333333-3333-4333-8333-333333333333',
 status:'pendiente',attendance_status:'por_confirmar',
 starts_at:date,ends_at:'2026-12-02T15:45:00Z',
 external_calendar_id:'cl-test',attendance_reminder_at:null,attendance_responded_at:null,
 attendance_response_source:null,calendar_cancel_pending:false,
};
const google=[{id:'cl-test',startsAt:date,endsAt:'2026-12-02T15:45:00Z'}];
const range={from:'2026-12-01',to:'2026-12-08'};
const reminder='2026-12-01T16:00:00Z';
const yes='2026-12-01T18:00:00Z';
const activity=(type:string,eventTimestamp:string,meetId=meeting.id):AppointmentAuditActivity=>({
 contact_id:meeting.contact_id,channel:'whatsapp_ia',
 activity_type:type,created_at:eventTimestamp,
 metadata:{meeting_id:meetId,message_id:'wamid.reply.unique123',event_timestamp:eventTimestamp},
});
const confirmed:AppointmentAuditMeeting={...meeting,status:'confirmada',
 attendance_status:'confirmada',attendance_reminder_at:reminder,
 attendance_responded_at:yes,attendance_response_source:'whatsapp_ia'};
describe('Cross-source meeting verification: agent conversation / CRM / Google',()=>{
 it('does not infer confirmation from Google event alone',()=>{
  const x=verifyAppointmentEvidence(meeting,[],google,range);
  expect(x.booking).toBe('calendar_match');
  expect(x.confirmed).toBe(false);
  expect(x.reply).toBe('unconfirmed');
 });
 it('requires exact WhatsApp meeting event, message ID and response time',()=>{
  const x=verifyAppointmentEvidence(confirmed,[activity('asistencia_confirmada',yes)],google,range);
  expect(x.booking).toBe('calendar_match');
  expect(x.reply).toBe('verified');
  expect(x.confirmed).toBe(true);
 });
 it('does not count an old "cita_confirmada" or a fabricated reply',()=>{
  const commercial=activity('cita_confirmada',yes);
  expect(verifyAppointmentEvidence(confirmed,[commercial],google,range).confirmed).toBe(false);
  const wrong=activity('asistencia_confirmada',yes,'22222222-2222-4222-8222-222222222222');
  expect(verifyAppointmentEvidence(confirmed,[wrong],google,range).confirmed).toBe(false);
 });
 it('requires matching reply timestamp and message ID',()=>{
  const bad={...activity('asistencia_confirmada',yes),metadata:{
   meeting_id:meeting.id,message_id:'bad',event_timestamp:'2026-12-01T11:00:00Z',
  }};
  expect(verifyAppointmentEvidence(confirmed,[bad],google,range).reply).toBe('inconsistent');
 });
 it('latest doubtful response invalidates earlier affirmative evidence',()=>{
  const a=activity('asistencia_confirmada',yes);
  const b=activity('asistencia_dudosa','2026-12-01T19:00:00Z');
  expect(verifyAppointmentEvidence(confirmed,[a,b],google,range).confirmed).toBe(false);
 });
 it('highlights cancelled events still visible on Google without restoring them',()=>{
  const x=verifyAppointmentEvidence({...meeting,status:'cancelada',
    attendance_status:'no_asistira',calendar_cancel_pending:true},[],google,range);
  expect(x.reply).toBe('declined');
  expect(x.requiresReview).toBe(true);
  expect(x.findings.join(' ')).toMatch(/continúa visible/);
 });
 it('detects missing calendar sync and changed time',()=>{
  const x=verifyAppointmentEvidence(confirmed,[activity('asistencia_confirmada',yes)],[],range);
  expect(x.booking).toBe('calendar_missing');
  expect(x.requiresReview).toBe(true);
  const moved=verifyAppointmentEvidence(meeting,[],[{...google[0]!,startsAt:'2026-12-02T16:00:00Z'}],range);
  expect(moved.booking).toBe('calendar_mismatch');
 });
 it('does not count transparent or all-day Google events as customer appointments',()=>{
  const transparent=verifyAppointmentEvidence(confirmed,[activity('asistencia_confirmada',yes)],[{...google[0]!,transparent:true}],range);
  expect(transparent.booking).toBe('calendar_mismatch');
  const allDay=verifyAppointmentEvidence(confirmed,[activity('asistencia_confirmada',yes)],[{...google[0]!,allDay:true}],range);
  expect(allDay.booking).toBe('calendar_mismatch');
 });
 it('does not report missing events for months the Google query never checked',()=>{
  expect(verifyAppointmentEvidence(meeting,[],[],{from:'2026-11-01',to:'2026-11-30'}).booking).toBe('calendar_unchecked');
  expect(auditReplyLabel('verified')).toContain('WhatsApp');
 });
});
describe('CRM calendar must not show unverified meetings as green',()=>{
 const agenda=readFileSync('src/components/crm/agenda.tsx','utf8');
 it('requires both the WhatsApp message and the actual matching Google event',()=>{
  expect(agenda).toContain("audit?.confirmed&&audit.booking==='calendar_match'");
  expect(agenda).toContain("Confirmó WhatsApp · Google sin verificar");
  expect(agenda).toContain("Confirmación sin verificar");
  expect(agenda).toContain("chatBookingClaimsWithoutReservation");
 });
});
describe('Google sync cannot fabricate a customer confirmation',()=>{
 const sync=readFileSync('src/lib/google-calendar-sync.server.ts','utf8');
 it('never sets a cancelled meeting back to confirmed',()=>{
  expect(sync).not.toContain("if(existing.status==='cancelada')patch['status']='confirmada'");
  expect(sync).toContain("if(existing.status==='cancelada'){stats.linked++;continue;}");
 });
 it('demotes legacy future confirmations without WhatsApp RSVP to pending',()=>{
  expect(sync).toContain("existing.attendance_status!=='confirmada'");
  expect(sync).toContain("patch['status']='pendiente'");
 });
});
