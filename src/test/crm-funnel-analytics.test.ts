import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {
 commercialFunnel,percent,isTestContact,
 type FunnelContact,type FunnelMeeting,type FunnelActivity,
} from '@/lib/crm-funnel-model';
const contact=(id:string,status:string,source='whatsapp_ia'):FunnelContact=>({
 id,created_at:'2026-11-26T14:00:00Z',status,source,
 full_name:'Cliente '+id,last_contact_at:null,source_detail:null,
});
const meeting=(id:string,contact_id:string,status='pendiente',attendance_status='por_confirmar'):FunnelMeeting=>({
 id,contact_id,status,attendance_status,starts_at:'2026-12-05T14:00:00Z',
 created_at:'2026-11-27T14:00:00Z',
});
const activity=(contact_id:string,activity_type:string):FunnelActivity=>({
 contact_id,activity_type,created_at:'2026-11-27T14:00:00Z',
});
describe('commercial funnel uses verified records, not hopeful guesses',()=>{
 it('never counts agent claim cita_confirmada as a real booked consultation',()=>{
  const r=commercialFunnel([contact('one','nuevo')],[],[activity('one','cita_confirmada')]);
  expect(r.totals.booked).toBe(0);
  expect(r.contactStates[0]?.stage).toBe('nuevo');
 });
 it('counts an actual booked appointment even when later cancelled',()=>{
  const r=commercialFunnel([contact('one','nuevo')],[meeting('a','one','cancelada')],[]);
  expect(r.totals.booked).toBe(1);
  expect(r.stages.cita_cancelada).toBe(1);
  expect(r.totals.attendanceConfirmed).toBe(0);
 });
 it('calculates attendance rate from decided past outcomes, not future slots',()=>{
  const result=commercialFunnel([contact('a','cita_agendada'),contact('b','cita_agendada')],
   [meeting('m1','a','realizada'),meeting('m2','a','no_asistio'),
    meeting('m3','b','pendiente'),meeting('m4','b','cancelada')],[]);
  expect(result.totals).toMatchObject({
   leads:2,booked:2,appointments:4,attendedAppointments:1,
   noShowAppointments:1,cancelledAppointments:1,
  });
  expect(percent(result.totals.attendedAppointments,
   result.totals.attendedAppointments+result.totals.noShowAppointments)).toContain('50');
 });
 it('keeps interested, booked, RSVP, attended and won separate',()=>{
  const c=[contact('one','calificado'),contact('two','cita_agendada'),
   contact('three','ganado')];
  const m=[meeting('a','two','confirmada','confirmada'),
   meeting('b','three','realizada','confirmada')];
  const r=commercialFunnel(c,m,[]);
  expect(r.totals).toMatchObject({
   leads:3,interested:3,booked:2,attendanceConfirmed:2,attended:1,won:1,
  });
  expect(r.stages.interesado).toBe(1);
  expect(r.stages.asistencia_confirmada).toBe(1);
  expect(r.stages.ganado).toBe(1);
 });
 it('silence, non-interest and opt-out never become abandonment',()=>{
  const c=[contact('one','nuevo'),contact('two','no_interesado'),contact('three','no_contactar')];
  const r=commercialFunnel(c,[],[]);
  expect(r.totals.noInterested).toBe(1);
  expect(r.totals.optedOut).toBe(1);
  expect(r.totals.explicitlyAbandoned).toBe(0);
  expect(r.abandonmentMeasurable).toBe(false);
 });
 it('only explicit abandonment signal can mark a lead abandoned',()=>{
  const r=commercialFunnel([contact('one','nuevo')],[],
   [activity('one','prospecto_abandonado')]);
  expect(r.contactStates[0]?.stage).toBe('abandonado');
  expect(r.totals.explicitlyAbandoned).toBe(1);
  expect(r.abandonmentMeasurable).toBe(true);
 });
 it('uses historical interest event even after a sales stage changes',()=>{
  const r=commercialFunnel([contact('one','contactado')],[],
   [activity('one','diagnostico_solicitado')]);
  expect(r.totals.interested).toBe(1);
  expect(r.stages.interesado).toBe(1);
 });
 it('groups real lead cohort results by source',()=>{
  const r=commercialFunnel([contact('a','nuevo','web'),contact('b','calificado','web'),
   contact('c','nuevo','whatsapp_ia')],[meeting('m','b')],[]);
  expect(r.totals.leads).toBe(3);
  expect(r.bySource.find(x=>x.source==='web')).toMatchObject({leads:2,booked:1,interested:1});
  expect(r.bySource.find(x=>x.source==='whatsapp_ia')).toMatchObject({leads:1,booked:0});
 });
 it('excludes clearly labelled test contacts by default, allows including them',()=>{
  const dummy={...contact('test','nuevo'),full_name:'PRUEBA agente IA'};
  expect(isTestContact(dummy)).toBe(true);
  expect(commercialFunnel([dummy,contact('real','nuevo')],[],[]).totals.leads).toBe(1);
  expect(commercialFunnel([dummy],[],[],{excludeTests:false}).totals.leads).toBe(1);
 });
 it('is robust to duplicate appointments: one booked contact, not multiple leads',()=>{
  const r=commercialFunnel([contact('one','nuevo')],
   [meeting('m1','one'),meeting('m2','one')],[]);
  expect(r.totals.booked).toBe(1);
  expect(r.totals.leads).toBe(1);
 });
 it('formats empty denominators without invented percentages',()=>{
  expect(percent(4,0)).toBe('—');
  expect(percent(1,4)).toContain('25');
 });
});
describe('CRM analytic screen integration',()=>{
 const panel=readFileSync('src/components/crm/crm-funnel-dashboard.tsx','utf8');
 const admin=readFileSync('src/routes/admin.tsx','utf8');
 it('adds metrics to the existing protected admin view',()=>{
  expect(admin).toContain('Embudo y métricas');
  expect(admin).toContain('view==="analitica"&&<CrmFunnelDashboard/>');
 });
 it('does not use the old 500-row contact list for KPI denominators',()=>{
  expect(panel).toContain('readPages<FunnelContact>');
  expect(panel).toContain('data.truncated');
  expect(panel).toContain('Los indicadores no son exhaustivos');
  expect(panel).toContain("attendance_status");
 });
 it('labels the cohort and avoids fabricating abandonment',()=>{
  expect(panel).toContain('Período de captación');
  expect(panel).toContain('Sin medición verificada');
  expect(panel).toContain('Agendaron');
  expect(panel).toContain('Confirmaron asistencia');
 });
});
