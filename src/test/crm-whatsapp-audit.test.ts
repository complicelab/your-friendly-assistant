import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  receiptPhase, whatsAppReceiptLabel, whatsappNoticeLabel,
  formatWhatsAppTimestamp,
} from '@/lib/whatsapp-integration-status';

describe('audit 1: WhatsApp IA inbound evidence never implies API delivery', () => {
  const at = Date.parse('2026-11-21T13:00:00Z');
  it('calls only recent records recent, without asserting live Meta API', () => {
    expect(receiptPhase('2026-11-21T12:00:00Z', 5, at)).toBe('recent');
    expect(whatsAppReceiptLabel('recent')).toContain('recepción reciente');
    expect(whatsAppReceiptLabel('recent')).not.toContain('API conectada');
  });
  it('keeps older messages as history, never as disconnected or active', () => {
    expect(receiptPhase('2026-11-01T13:00:00Z', 5, at)).toBe('historical');
    expect(whatsAppReceiptLabel('historical')).toContain('eventos registrados');
  });
  it('distinguishes contacts-only, empty and malformed data', () => {
    expect(receiptPhase(null, 3, at)).toBe('contacts_only');
    expect(receiptPhase(null, 0, at)).toBe('no_events');
    expect(receiptPhase('bad', 5, at)).toBe('error');
  });
  it('never equates an accepted WhatsApp notification with delivered messages', () => {
    expect(whatsappNoticeLabel('sent')).toContain('entrega sin verificar');
    expect(whatsappNoticeLabel('error')).toContain('error');
    expect(formatWhatsAppTimestamp('not-a-date')).toBe('Sin fecha registrada');
  });
});

describe('audit 2: admin uses observed activity instead of static connection strings', () => {
  const admin = readFileSync('src/routes/admin.tsx', 'utf8');
  const details = readFileSync('src/components/crm/whatsapp-integration-details.tsx', 'utf8');
  it('removes both old false pending-connection labels', () => {
    expect(admin).not.toContain('WhatsApp / Agente IA: conexión pendiente de verificar');
    expect(admin).not.toContain('WhatsApp / agente <b>Recepción de eventos pendiente de verificar');
    expect(admin).not.toContain('WhatsApp / Agente IA seguirá indicando conexión pendiente');
  });
  it('uses real CRM rows and keeps an admin-only diagnostics panel', () => {
    expect(admin).toContain('useWhatsAppIntegrationStatus(token)');
    expect(admin).toContain('whatsAppReceiptLabel(whatsappStatus.phase)');
    expect(admin).toContain('<CrmWhatsAppIntegrationDetails status={whatsappStatus}');
    expect(details).toContain('.eq("channel", "whatsapp_ia")');
    expect(details).toContain('supabase.from("crm_activities")');
    expect(details).toContain('supabase.from("crm_notifications")');
  });
  it('does not falsely declare agent replies delivered', () => {
    expect(details).toContain('no se puede confirmar el envío o entrega');
    expect(details).toContain('Respuestas automáticas del agente');
    expect(admin).toContain('Entrega no verificable desde este CRM');
  });
});
