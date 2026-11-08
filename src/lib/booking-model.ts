export const BOOKING_TIMEZONE = 'America/Bogota';
export const MEETING_STATUSES = [
  ['confirmada', 'Confirmada'],
  ['realizada', 'Realizada'],
  ['no_asistio', 'No asistió'],
  ['cancelada', 'Cancelada'],
] as const;

export type AvailabilityRangeInput = {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

export function validateBookingSettings(input: {
  meeting_duration_minutes: number;
  slot_minutes: number;
  admin_email: string;
}) {
  if (!Number.isInteger(input.meeting_duration_minutes) || input.meeting_duration_minutes < 15 || input.meeting_duration_minutes > 180) {
    return 'La duración debe ser un número entero entre 15 y 180 minutos.';
  }
  if (!Number.isInteger(input.slot_minutes) || input.slot_minutes < 5 || input.slot_minutes > 180) {
    return 'El intervalo debe ser un número entero entre 5 y 180 minutos.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.admin_email.trim())) return 'Escribe un correo administrador válido.';
  return '';
}

export function validateAvailabilityRanges(ranges: AvailabilityRangeInput[]) {
  const byDay = new Map<number, AvailabilityRangeInput[]>();
  for (const range of ranges) {
    if (range.day_of_week < 0 || range.day_of_week > 6 || !Number.isInteger(range.day_of_week)) return 'Hay un día de disponibilidad no válido.';
    if (!/^\d{2}:\d{2}$/.test(range.start_time) || !/^\d{2}:\d{2}$/.test(range.end_time)) return 'Completa las horas de cada franja activa.';
    if (range.start_time >= range.end_time) return 'La hora final debe ser posterior a la hora inicial.';
    const dayRanges = byDay.get(range.day_of_week) ?? [];
    dayRanges.push(range);
    byDay.set(range.day_of_week, dayRanges);
  }
  for (const dayRanges of byDay.values()) {
    if (dayRanges.length > 2) return 'Cada día admite máximo dos franjas horarias.';
    const ordered = [...dayRanges].sort((a, b) => a.start_time.localeCompare(b.start_time));
    if (ordered.length === 2 && ordered[0].end_time > ordered[1].start_time) return 'Las franjas de un mismo día no pueden cruzarse.';
  }
  return '';
}

export function meetingStatusLabel(status: string) {
  if (status === 'no asistió') return 'No asistió';
  return MEETING_STATUSES.find(([value]) => value === status)?.[1] ?? status.replaceAll('_', ' ');
}

export function notificationStatusLabel(channel: string, status: string) {
  if (status === 'pendiente') return channel === 'whatsapp' ? 'Pendiente de conectar WhatsApp API' : 'Pendiente de conectar proveedor';
  if (status === 'enviado') return 'Enviado';
  if (status === 'error') return 'Error';
  if (status === 'omitido') return 'Omitido';
  return status;
}

export function formatMeetingDate(value: string) {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: BOOKING_TIMEZONE,
  }).format(new Date(value));
}
