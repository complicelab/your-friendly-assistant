import { describe, expect, it } from 'vitest';
import { overlapsBusy } from '@/lib/google-calendar-server';

const busy = [{ start: '2026-11-23T15:00:00Z', end: '2026-11-23T16:00:00Z' }];

describe('Google Calendar busy-time overlap', () => {
  it('rejects a booking overlapping a Google event', () => {
    expect(overlapsBusy('2026-11-23T15:30:00Z', '2026-11-23T16:30:00Z', busy)).toBe(true);
    expect(overlapsBusy('2026-11-23T14:30:00Z', '2026-11-23T15:30:00Z', busy)).toBe(true);
  });
  it('accepts adjacent meetings with no overlap', () => {
    expect(overlapsBusy('2026-11-23T14:00:00Z', '2026-11-23T15:00:00Z', busy)).toBe(false);
    expect(overlapsBusy('2026-11-23T16:00:00Z', '2026-11-23T17:00:00Z', busy)).toBe(false);
  });
  it('fails closed on invalid input', () => {
    expect(overlapsBusy('invalid', '2026-11-23T17:00:00Z', busy)).toBe(true);
    expect(overlapsBusy('2026-11-23T17:00:00Z', '2026-11-23T16:00:00Z', busy)).toBe(true);
  });
});
