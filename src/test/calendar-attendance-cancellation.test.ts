import { beforeEach, describe, expect, it, vi } from 'vitest';

const fixture=vi.hoisted(()=>({meeting:{id:'11111111-1111-4111-8111-111111111111',contact_id:'contact',
  external_calendar_id:'verified-event',starts_at:'2026-11-23T14:00:00Z',ends_at:'2026-11-23T14:45:00Z',
  status:'cancelada',attendance_status:'no_asistira',calendar_cancel_pending:true},updates:[] as unknown[]}));
vi.mock('@/integrations/supabase/client.server',()=>({supabaseAdmin:{from:(table:string)=>{
  const query={select:()=>query,eq:()=>query,single:async()=>({data:table==='crm_meetings'?fixture.meeting:
    {email:'controlled@example.invalid',whatsapp:'+573000002121'},error:null}),
    update:(payload:unknown)=>{fixture.updates.push(payload);return {eq:()=>({eq:async()=>({error:null})})};}};
  return query;
}}}));
vi.mock('@/lib/calendar-connection.server',()=>({googleConnectionAccess:async()=>({token:'test-only',calendarId:'agency-test'})}));
import { reconcileAttendanceCancellation } from '@/lib/calendar-attendance.server';

describe('Verified Google cancellation after agent rejection',()=>{
  beforeEach(()=>{fixture.updates.length=0;vi.restoreAllMocks();});
  const event={id:'verified-event',etag:'test-etag',status:'confirmed',
    start:{dateTime:'2026-11-23T14:00:00Z'},end:{dateTime:'2026-11-23T14:45:00Z'},
    description:'CRM meeting ID: 11111111-1111-4111-8111-111111111111'};
  it('cancels only the verified matching event and records Google acknowledgement',async()=>{
    const fetcher=vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(Response.json(event))
      .mockResolvedValueOnce(new Response(null,{status:204}));
    expect(await reconcileAttendanceCancellation(fixture.meeting.id)).toEqual({pending:false});
    expect(fetcher.mock.calls[1]?.[0]).toContain('/events/verified-event?sendUpdates=all');
    expect(fetcher.mock.calls[1]?.[1]?.method).toBe('DELETE');
    expect(fixture.updates).toEqual([expect.objectContaining({calendar_cancel_pending:false})]);
  });
  it('Google failure leaves the CRM cancellation pending, never confirmed',async()=>{
    vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(Response.json(event))
      .mockResolvedValueOnce(new Response(null,{status:503}));
    await expect(reconcileAttendanceCancellation(fixture.meeting.id)).rejects.toThrow('Google no confirmó');
    expect(fixture.updates).toHaveLength(0);
    expect(fixture.meeting.status).toBe('cancelada');
  });
  it('refuses to delete an event belonging to a different appointment',async()=>{
    const fetcher=vi.spyOn(globalThis,'fetch').mockResolvedValueOnce(Response.json({...event,
      description:'Unrelated meeting',start:{dateTime:'2026-11-23T15:00:00Z'}}));
    await expect(reconcileAttendanceCancellation(fixture.meeting.id)).rejects.toThrow('vinculación');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fixture.updates).toHaveLength(0);
  });
});