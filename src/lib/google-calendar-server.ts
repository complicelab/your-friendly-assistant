/**
 * Server-only bridge for the single Cómplice Lab Google Calendar.
 * Never import this module in React components. Secrets are supplied as
 * deployment environment variables, never VITE_ variables.
 *
 * OAuth consent must include https://www.googleapis.com/auth/calendar.
 */
const SECRET_NAMES = [
  'GOOGLE_CALENDAR_CLIENT_ID',
  'GOOGLE_CALENDAR_CLIENT_SECRET',
  'GOOGLE_CALENDAR_REFRESH_TOKEN',
  'GOOGLE_CALENDAR_ID',
] as const;

const env = (name: string) =>
  typeof process === 'undefined' ? '' : String(process.env[name] ?? '').trim();

const calendarId = () => env('GOOGLE_CALENDAR_ID');

export function isGoogleCalendarConfigured() {
  return SECRET_NAMES.every((name) => Boolean(env(name)));
}

function ensureCompleteConfiguration() {
  if (!isGoogleCalendarConfigured()) {
    if (SECRET_NAMES.some((name) => Boolean(env(name)))) {
      throw new Error('La configuración de Google Calendar está incompleta.');
    }
    return false;
  }
  return true;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env('GOOGLE_CALENDAR_CLIENT_ID'),
      client_secret: env('GOOGLE_CALENDAR_CLIENT_SECRET'),
      refresh_token: env('GOOGLE_CALENDAR_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
  });
  if (!response.ok) throw new Error('Google rechazó la autorización del calendario.');
  const body = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) throw new Error('Google no devolvió un token de acceso.');
  tokenCache = {
    token: body.access_token,
    expiresAt: Date.now() + Math.max(60, Number(body.expires_in || 3600)) * 1000,
  };
  return tokenCache.token;
}

export type BusyPeriod = { start: string; end: string };

export async function googleCalendarBusy(
  timeMin: string,
  timeMax: string,
): Promise<BusyPeriod[] | null> {
  if (!ensureCompleteConfiguration()) return null;
  const token = await getAccessToken();
  const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: 'America/Bogota',
      items: [{ id: calendarId() }],
    }),
  });
  if (!response.ok) throw new Error('No fue posible consultar la disponibilidad de Google Calendar.');
  const body = (await response.json()) as {
    calendars?: Record<string, { errors?: unknown[]; busy?: BusyPeriod[] }>;
  };
  const entry = body.calendars?.[calendarId()];
  if (!entry || (entry.errors?.length ?? 0) > 0 || !Array.isArray(entry.busy)) {
    throw new Error('Google Calendar no devolvió una disponibilidad verificable.');
  }
  return entry.busy;
}

export function overlapsBusy(start: string, end: string, busy: BusyPeriod[]) {
  const from = Date.parse(start);
  const until = Date.parse(end);
  if (!Number.isFinite(from) || !Number.isFinite(until) || from >= until) return true;
  return busy.some((period) => from < Date.parse(period.end) && until > Date.parse(period.start));
}

export type CreateCalendarEventInput = {
  meetingId: string;
  fullName: string;
  attendeeEmail: string;
  attendeeWhatsapp: string;
  service: string;
  startsAt: string;
  endsAt: string;
};

export async function createGoogleCalendarEvent(input: CreateCalendarEventInput):
  Promise<{ id: string; meetingUrl: string | null } | null> {
  if (!ensureCompleteConfiguration()) return null;
  const uuid = input.meetingId.toLowerCase().replace(/-/g, '');
  if (!/^[a-f0-9]{32}$/.test(uuid)) throw new Error('El identificador de la reunión no es válido.');
  const eventId = 'cl' + uuid; // Google event IDs only allow base32hex (0-9, a-v).
  const token = await getAccessToken();
  const baseUrl = 'https://www.googleapis.com/calendar/v3/calendars/' +
    encodeURIComponent(calendarId()) + '/events';
  const details = [
    'Reserva creada desde Cómplice Lab.',
    'Cliente: ' + input.fullName,
    'Servicio: ' + input.service,
    'Correo: ' + input.attendeeEmail,
    'WhatsApp: ' + input.attendeeWhatsapp,
    'CRM meeting ID: ' + input.meetingId,
  ].join('\n');
  const response = await fetch(baseUrl + '?sendUpdates=all', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: eventId,
      summary: 'Diagnóstico Cómplice Lab · ' + input.fullName,
      description: details,
      start: { dateTime: input.startsAt, timeZone: 'America/Bogota' },
      end: { dateTime: input.endsAt, timeZone: 'America/Bogota' },
      attendees: [{ email: input.attendeeEmail, displayName: input.fullName }],
    }),
  });

  // An idempotent retry may find the existing event: never make a duplicate.
  if (response.status === 409) {
    const existing = await fetch(baseUrl + '/' + eventId, {
      headers: { Authorization: 'Bearer ' + token },
    });
    if (!existing.ok) throw new Error('La reserva existe en Google, pero no pudo comprobarse.');
    const body = (await existing.json()) as { id?: string; hangoutLink?: string };
    return { id: body.id || eventId, meetingUrl: body.hangoutLink || null };
  }
  if (!response.ok) throw new Error('No fue posible crear el evento en Google Calendar.');
  const body = (await response.json()) as { id?: string; hangoutLink?: string };
  if (!body.id) throw new Error('Google Calendar no confirmó el identificador del evento.');
  return { id: body.id, meetingUrl: body.hangoutLink || null };
}
