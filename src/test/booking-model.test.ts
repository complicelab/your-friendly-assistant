import { describe, expect, it } from 'vitest';
import { notificationStatusLabel, validateAvailabilityRanges, validateBookingSettings } from '@/lib/booking-model';

describe('booking settings and availability', () => {
  it('accepts a 60 minute meeting and 60 minute interval with the administrator email', () => {
    expect(validateBookingSettings({meeting_duration_minutes:60,slot_minutes:60,admin_email:'complicelab@gmail.com'})).toBe('');
  });
  it('rejects a meeting shorter than 15 minutes', () => {
    expect(validateBookingSettings({meeting_duration_minutes:10,slot_minutes:60,admin_email:'complicelab@gmail.com'})).toContain('15');
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
  it('never presents pending email or WhatsApp jobs as sent', () => {
    expect(notificationStatusLabel('email','pendiente')).toBe('Pendiente de conectar proveedor');
    expect(notificationStatusLabel('whatsapp','pendiente')).toBe('Pendiente de conectar WhatsApp API');
  });
});
