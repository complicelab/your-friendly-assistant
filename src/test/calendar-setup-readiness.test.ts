import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('Calendar setup readiness is safe for CRM administrators', () => {
  const server = readFileSync('src/lib/calendar-connection.server.ts', 'utf8');
  const settings = readFileSync('src/components/crm/calendar-connection-settings.tsx', 'utf8');

  it('checks both private tables without returning OAuth values', () => {
    expect(server).toContain(".from('crm_calendar_oauth_states')");
    expect(server).toContain(".select('nonce', { head: true })");
    expect(server).toContain('const record = await connection()');
    expect(server).toContain('database_ready: true');
    expect(server).not.toContain('refresh_token_encrypted: record?.refresh_token_encrypted');
  });

  it('shows why linking is blocked instead of just saying Google Cloud is missing', () => {
    expect(settings).toContain('GOOGLE_CALENDAR_ENCRYPTION_KEY sea una clave de 64 caracteres hexadecimales');
    expect(settings).toContain('20261121_google_calendar_connection.sql');
    expect(settings).toContain('20261121_calendar_import_no_notifications.sql');
    expect(settings).toContain('!status.database_ready');
    expect(settings).not.toContain('Se requiere una configuración inicial única de Google Cloud');
  });
});
