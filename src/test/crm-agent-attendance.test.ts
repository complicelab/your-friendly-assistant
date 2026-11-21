import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {attendanceStatusLabel,attendanceStatusClass,meetingStatusLabel} from '@/lib/booking-model';

describe('CRM status is about attendance, not simply having booked',()=>{
 it('marks newly scheduled appointments as por confirmar until customer responds',()=>{
  expect(attendanceStatusLabel('por_confirmar','pendiente')).toBe('Por confirmar');
  expect(attendanceStatusClass('por_confirmar','pendiente')).toBe('pendiente');
  expect(meetingStatusLabel('pendiente')).toBe('Por confirmar');
 });
 it('only an explicitly affirmed RSVP appears as confirmed',()=>{
  expect(attendanceStatusLabel('confirmada','confirmada')).toBe('Confirmada');
  expect(attendanceStatusLabel('por_confirmar','confirmada')).toBe('Por confirmar');
 });
 it('marks declined as cancelled, ambiguous as attention needed',()=>{
  expect(attendanceStatusLabel('no_asistira','cancelada')).toBe('Cancelada');
  expect(attendanceStatusLabel('requiere_atencion','pendiente'))
   .toBe('Por confirmar · requiere atención');
 });
 it('does not confuse post-meeting outcome with future RSVP',()=>{
  expect(attendanceStatusLabel('confirmada','realizada')).toBe('Realizada');
  expect(attendanceStatusLabel('por_confirmar','no_asistio')).toBe('No asistió');
 });
});

describe('Authenticated WhatsApp agent confirmation contract',()=>{
 const edge=readFileSync('supabase/functions/recibir-prospecto-whatsapp/index.ts','utf8');
 const sql=readFileSync('supabase/migrations/20261121_agent_attendance_confirmation.sql','utf8');
 it('keeps legacy booking confirmation separate from attendance RSVP',()=>{
  expect(edge).toContain('"cita_confirmada"');
  expect(edge).toContain('"asistencia_confirmada"');
  expect(edge).toContain('"asistencia_rechazada"');
  expect(edge).toContain('"asistencia_dudosa"');
  expect(edge).toContain('"recordatorio_asistencia_enviado"');
  expect(edge).toContain('attendanceEvent');
  expect(edge).toContain('crm_apply_attendance_agent_event');
  expect(edge).toContain('crm_receive_whatsapp_event');
 });
 it('requires exact meeting ID and a unique provider message ID',()=>{
  expect(edge).toContain('payload.meeting_id');
  expect(edge).toContain('payload.message_id');
  expect(sql).toContain("p_payload->>'meeting_id'");
  expect(sql).toContain("p_payload->>'message_id'");
  expect(sql).toContain('phone does not belong to appointment');
  expect(sql).toContain("where id=v_mid for update");
 });
 it('never creates a contact when receiving confirmation answers',()=>{
  const procedure=sql.slice(sql.indexOf('create or replace function public.crm_apply_attendance_agent_event'));
  expect(procedure).not.toContain('insert into public.crm_contacts');
  expect(procedure).toContain("auth.role() is distinct from 'service_role'");
  expect(sql).toContain('revoke all on function public.crm_apply_attendance_agent_event');
 });
 it('requires a matching reminder and refuses stale or cancelled replies',()=>{
  expect(sql).toContain('no matching reminder for this meeting');
  expect(sql).toContain('p_timestamp<=v_meeting.attendance_responded_at');
  expect(sql).toContain("v_meeting.attendance_status='no_asistira'");
  expect(sql).toContain("v_meeting.status='cancelada'");
  expect(sql).toContain("p_timestamp<v_meeting.starts_at-interval '36 hours'");
 });
 it('handles affirmative, negative and doubtful replies without duplicating history',()=>{
  expect(sql).toContain("'asistencia_confirmada' then 'confirmada'");
  expect(sql).toContain("'asistencia_rechazada' then 'cancelada'");
  expect(sql).toContain("else 'pendiente' end");
  expect(sql).toContain('if exists(select 1 from public.crm_activities');
  expect(sql).toContain('external_id=v_fingerprint');
  expect(sql).toContain('on conflict do nothing');
 });
 it('admin cannot independently change RSVP to pending/confirmed or reopen a decline',()=>{
  expect(sql).toContain("new.status in ('pendiente','confirmada')");
  expect(sql).toContain("or old.attendance_status='no_asistira'");
  const agenda=readFileSync('src/components/crm/agenda.tsx','utf8');
  expect(agenda).toContain("selected.status!=='cancelada'&&['realizada','no_asistio','cancelada'].includes(value)");
 });
 it('protects browser updates and future meetings are initially unconfirmed',()=>{
  expect(sql).toContain("new.status:='pendiente'");
  expect(sql).toContain("auth.role() is distinct from 'service_role'");
  expect(sql).toContain("status='pendiente'");
  expect(sql).toContain("and attendance_responded_at is null");
 });
});

describe('Google and CRM safeguards for 24-hour agent cancellations',()=>{
 const sync=readFileSync('src/lib/google-calendar-sync.server.ts','utf8');
 const agenda=readFileSync('src/components/crm/agenda.tsx','utf8');
 const admin=readFileSync('src/routes/admin.tsx','utf8');
 const types=readFileSync('src/integrations/supabase/types.ts','utf8');
 it('queues Google cancellations and never reopens a declined RSVP',()=>{
  const cancellation=readFileSync('src/lib/calendar-attendance.server.ts','utf8');
  expect(sync).toContain("m.attendance_status==='no_asistira'");
  expect(sync).toContain('m.calendar_cancel_pending');
  expect(cancellation).toContain("method:'DELETE'");
  expect(sync).toContain("if(existing?.attendance_status==='no_asistira')continue;");
  expect(cancellation).toContain("calendar_cancel_synced_at:new Date().toISOString()");
 });
 it('shows dashboard states, customer evidence and Google pending status',()=>{
  expect(agenda).toContain('Confirmadas por respuesta');
  expect(agenda).toContain('Recordatorio 24 horas antes');
  expect(agenda).toContain('attendance_response_text');
  expect(agenda).toContain('calendar_cancel_pending');
  expect(agenda).toContain('attendanceStatusLabel');
  expect(agenda).toContain("loadMeetings(true)");
  expect(admin).toContain('asistencia_confirmada:"Asistencia confirmada');
  expect(admin).toContain('asistencia_rechazada:"Asistencia rechazada');
 });
 it('types and RLS existing table carry the 24-hour reply state',()=>{
  expect(types).toContain('attendance_status: string');
  expect(types).toContain('attendance_reminder_at: string | null');
  expect(types).toContain('attendance_responded_at: string | null');
  expect(types).toContain('calendar_cancel_pending: boolean');
 });
});
