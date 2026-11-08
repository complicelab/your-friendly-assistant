import { describe, expect, it } from 'vitest';
import { nextUpcomingMeeting, notificationStatusLabel, validateAvailabilityRanges, validateBookingSettings } from '@/lib/booking-model';

describe('booking settings and availability', () => {
  it('accepts a 60 minute meeting and 60 minute interval with the administrator email', () => {
    expect(validateBookingSettings({meeting_duration_minutes:60,slot_minutes:60,admin_email:'complicelab@gmail.com'})).toBe('');
  });
  it('rejects a meeting shorter than 15 minutes', () => {
    expect(validateBookingSettings({meeting_duration_minutes:10,slot_minutes:60,admin_email:'complicelab@gmail.com'})).toContain('15');
  });
  it('rejects an interval below the database minimum of 15 minutes', () => {
    expect(validateBookingSettings({meeting_duration_minutes:60,slot_minutes:5,admin_email:'complicelab@gmail.com'})).toContain('15');
  });
  it('accepts two separate ranges on Monday', () => {
    expect(validateAvailabilityRanges([
      {day_of_week:1,start_time:'09:00',end_time:'12:00'},
      {day_of_week:1,start_time:'14:00',end_time:'17:00'},
    ])).toBe('');
  });
  it('rejects overlapping ranges on the same day', () => {
    expect(validateAvailabilityRanges([
      {day_of_week:1,start_time:'09:00',end_time:'14:00'},
      {day_of_week:1,start_time:'13:00',end_time:'17:00'},
    ])).toContain('cruzarse');
  });
  it('rejects a range whose end is not after its start', () => {
    expect(validateAvailabilityRanges([{day_of_week:2,start_time:'17:00',end_time:'09:00'}])).toContain('posterior');
  });
  it('selects the nearest future confirmed meeting instead of a later or cancelled one', () => {
    const now=Date.parse('2026-11-08T12:00:00Z');
    const next=nextUpcomingMeeting([
      {id:'later',starts_at:'2026-11-10T14:00:00Z',status:'confirmada'},
      {id:'cancelled',starts_at:'2026-11-08T15:00:00Z',status:'cancelada'},
      {id:'next',starts_at:'2026-11-09T14:00:00Z',status:'confirmada'},
    ],now);
    expect(next?.id).toBe('next');
  });
  it('returns no next meeting when every meeting is past or cancelled', () => {
    const now=Date.parse('2026-11-08T12:00:00Z');
    expect(nextUpcomingMeeting([
      {starts_at:'2026-11-07T14:00:00Z',status:'confirmada'},
      {starts_at:'2026-11-09T14:00:00Z',status:'cancelada'},
    ],now)).toBeNull();
  });
  it('never presents pending email or WhatsApp jobs as sent', () => {
    expect(notificationStatusLabel('email','pendiente')).toBe('Pendiente de conectar proveedor');
    expect(notificationStatusLabel('whatsapp','pendiente')).toBe('Pendiente de conectar WhatsApp API');
  });
});
