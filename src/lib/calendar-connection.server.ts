/** Server only: admin-authenticated OAuth and encrypted calendar credentials. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

const ADMIN_EMAIL = 'complicelab@gmail.com';
const db = supabaseAdmin as unknown as SupabaseClient;

const env = (name: string) => String(process.env[name] || '').trim();
const clientId = () => env('GOOGLE_CALENDAR_CLIENT_ID');
const clientSecret = () => env('GOOGLE_CALENDAR_CLIENT_SECRET');
const redirectUri = () => env('GOOGLE_CALENDAR_REDIRECT_URI');
const keyBytes = () => {
  const value = env('GOOGLE_CALENDAR_ENCRYPTION_KEY');
  if (!/^[a-f0-9]{64}$/i.test(value)) {
    throw new Error('Falta una clave de cifrado de 32 bytes (64 caracteres hexadecimales).');
  }
  return Uint8Array.from(value.match(/.{2}/g)!.map((item) => parseInt(item, 16)));
};
const ready = () =>
  Boolean(clientId() && clientSecret() && redirectUri() &&
    /^[a-f0-9]{64}$/i.test(env('GOOGLE_CALENDAR_ENCRYPTION_KEY')));

const toB64 = (bytes: Uint8Array) =>
  btoa(Array.from(bytes, (v) => String.fromCharCode(v)).join(''))
    .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
const fromB64 = (value: string) =>
  Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), (v) => v.charCodeAt(0));

async function seal(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey('raw', keyBytes(), 'AES-GCM', false, ['encrypt']);
  const encoded = new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, new TextEncoder().encode(value)));
  return toB64(iv) + '.' + toB64(encoded);
}
async function open(value: string) {
  const [iv, cipherText] = value.split('.');
  if (!iv || !cipherText) throw new Error('Credencial almacenada inválida.');
  const key = await crypto.subtle.importKey('raw', keyBytes(), 'AES-GCM', false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv:fromB64(iv)}, key, fromB64(cipherText));
  return new TextDecoder().decode(plain);
}

type Connection = {
  id: number;
  google_email: string;
  calendar_id: string;
  refresh_token_encrypted: string;
  connected_at: string;
  last_synced_at: string | null;
  last_error: string | null;
};

async function connection(): Promise<Connection | null> {
  const { data, error } = await db.from('crm_calendar_connections').select('*').eq('id', 1).maybeSingle();
  if (error) throw new Error('No se pudo consultar la conexión; revisa la migración de Calendar.');
  return data as Connection | null;
}

export async function requireCalendarAdmin(request: Request) {
  const header = request.headers.get('Authorization') || '';
  const token = header.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!token) throw new Error('NO_AUTH');
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user || data.user.email?.toLowerCase() !== ADMIN_EMAIL ||
      !data.user.email_confirmed_at) throw new Error('NO_AUTH');
  return data.user;
}

export async function calendarStatus() {
  const configured = ready();
  const unavailable = {
    configured,
    database_ready: false,
    connected: false,
    email: null as string | null,
    last_synced_at: null as string | null,
    last_error: null as string | null,
  };
  if (!configured) return unavailable;
  try {
    // Read-only readiness check: both private tables must exist with server grants.
    // Never return stored OAuth tokens, environment values or database error internals.
    const stateCheck = await db.from('crm_calendar_oauth_states')
      .select('nonce', { head: true }).limit(1);
    if (stateCheck.error) return unavailable;
    const record = await connection();
    return {
      configured,
      database_ready: true,
      connected: Boolean(record),
      email: record?.google_email || null,
      last_synced_at: record?.last_synced_at || null,
      last_error: record?.last_error || null,
    };
  } catch {
    return unavailable;
  }
}

export async function startCalendarConsent(request: Request) {
  if (!ready()) throw new Error('La aplicación de Google aún necesita configuración inicial en el servidor.');
  const user = await requireCalendarAdmin(request);
  const nonce = crypto.randomUUID();
  const verifier = toB64(crypto.getRandomValues(new Uint8Array(48)));
  const challenge = toB64(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
  const { error } = await db.from('crm_calendar_oauth_states').insert({
    nonce, requested_by: user.id, verifier_encrypted: await seal(verifier),
    expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
  });
  if (error) throw new Error('No se pudo preparar una autorización segura de Google.');
  const params = new URLSearchParams({
    client_id: clientId(),
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'openid email https://www.googleapis.com/auth/calendar',
    access_type: 'offline',
    prompt: 'consent select_account',
    state: nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  return 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();
}

export async function completeCalendarConsent(code: string, nonce: string) {
  if (!ready()) throw new Error('Google Calendar no está configurado.');
  if (!/^[a-f0-9-]{36}$/i.test(nonce)) throw new Error('Estado de autorización inválido.');
  const { data: state, error } = await db.from('crm_calendar_oauth_states')
    .update({ consumed_at: new Date().toISOString() }).eq('nonce', nonce)
    .is('consumed_at', null).gt('expires_at', new Date().toISOString())
    .select('requested_by,verifier_encrypted').maybeSingle();
  if (error || !state) throw new Error('La autorización venció o ya se utilizó.');
  const verifier = await open(String(state.verifier_encrypted));
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId(), client_secret: clientSecret(), redirect_uri: redirectUri(),
      code, grant_type: 'authorization_code', code_verifier: verifier,
    }),
  });
  if (!tokenResponse.ok) throw new Error('Google no aceptó la autorización.');
  const credentials = await tokenResponse.json() as { access_token?: string; refresh_token?: string };
  if (!credentials.access_token || !credentials.refresh_token) {
    throw new Error('Google no proporcionó acceso permanente. Vuelve a enlazar la cuenta.');
  }
  const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: 'Bearer ' + credentials.access_token },
  });
  if (!profileResponse.ok) throw new Error('No se pudo identificar la cuenta de Google.');
  const profile = await profileResponse.json() as { email?: string; email_verified?: boolean };
  if (profile.email?.toLowerCase() !== ADMIN_EMAIL || !profile.email_verified) {
    throw new Error('La cuenta de Google no corresponde a Cómplice Lab.');
  }
  // The connected calendar must belong to the verified agency account.
  const { error: saveError } = await db.from('crm_calendar_connections').upsert({
    id: 1,
    google_email: ADMIN_EMAIL,
    calendar_id: ADMIN_EMAIL,
    refresh_token_encrypted: await seal(credentials.refresh_token),
    connected_at: new Date().toISOString(),
    last_synced_at: null,
    last_error: null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
  if (saveError) throw new Error('Google autorizó el acceso, pero no se pudo guardar la conexión.');
}

type TokenCache = { token: string; until: number; encrypted: string };
let tokenCache: TokenCache | null = null;

export async function googleConnectionAccess(): Promise<{token:string; calendarId:string} | null> {
  if (!ready()) return null;
  const record = await connection();
  if (!record) return null;
  if (tokenCache && tokenCache.encrypted === record.refresh_token_encrypted &&
      tokenCache.until > Date.now() + 60_000) {
    return { token: tokenCache.token, calendarId: record.calendar_id };
  }
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId(), client_secret: clientSecret(),
      refresh_token: await open(record.refresh_token_encrypted), grant_type: 'refresh_token',
    }),
  });
  if (!response.ok) throw new Error('La cuenta Google debe volver a autorizarse en Configuración.');
  const value = await response.json() as { access_token?: string; expires_in?: number };
  if (!value.access_token) throw new Error('No se pudo renovar el acceso al calendario.');
  tokenCache = {
    token: value.access_token,
    encrypted: record.refresh_token_encrypted,
    until: Date.now() + Math.max(60, Number(value.expires_in || 3600)) * 1000,
  };
  return { token: value.access_token, calendarId: record.calendar_id };
}

export async function disconnectCalendar() {
  const record = await connection();
  if (record) {
    // Revocation is best effort; delete locally regardless. No calendar events are deleted.
    try {
      await fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({token:await open(record.refresh_token_encrypted)}),
      });
    } catch { /* local disconnect remains authoritative */ }
  }
  const { error } = await db.from('crm_calendar_connections').delete().eq('id', 1);
  if (error) throw new Error('No se pudo desconectar el calendario.');
  tokenCache = null;
}

export async function recordCalendarSync(result: { error?: string }) {
  const patch: Record<string,string|null> = { last_error: result.error || null };
  if (!result.error) patch['last_synced_at'] = new Date().toISOString();
  const { error } = await db.from('crm_calendar_connections').update(patch).eq('id', 1);
  if (error) throw new Error('No se pudo guardar el estado de sincronización.');
}
