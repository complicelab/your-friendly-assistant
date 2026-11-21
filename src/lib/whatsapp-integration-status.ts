/**
 * A successful CRM inbound activity proves that a WhatsApp IA event was recorded,
 * not that the external Meta API, agent replies, or outbound delivery are healthy now.
 * Keep those concepts separate in every status label.
 */
export type WhatsAppReceiptPhase = "checking" | "recent" | "historical" | "contacts_only" | "no_events" | "error";
export type WhatsAppNotificationState = "sent" | "pending" | "error" | "none" | "unavailable";

export type WhatsAppIntegrationStatus = {
  phase: WhatsAppReceiptPhase;
  lastInboundAt: string | null;
  contactCount: number;
  lastEventType: string | null;
  notice: WhatsAppNotificationState;
  lastNotificationAt: string | null;
};

export const INITIAL_WHATSAPP_STATUS: WhatsAppIntegrationStatus = {
  phase: "checking", lastInboundAt: null, contactCount: 0,
  lastEventType: null, notice: "none", lastNotificationAt: null,
};

export function receiptPhase(lastInboundAt: string | null, contactCount = 0, now = Date.now()): WhatsAppReceiptPhase {
  if (lastInboundAt) {
    const last = Date.parse(lastInboundAt);
    if (!Number.isFinite(last)) return "error";
    // Recent inbound evidence is a time-bounded observation, not a live API ping.
    return last <= now && now - last <= 72 * 60 * 60 * 1000 ? "recent" : "historical";
  }
  return contactCount > 0 ? "contacts_only" : "no_events";
}

export function whatsAppReceiptLabel(phase: WhatsAppReceiptPhase) {
  switch (phase) {
    case "recent": return "WhatsApp IA · recepción reciente";
    case "historical": return "WhatsApp IA · eventos registrados";
    case "contacts_only": return "WhatsApp IA · contactos registrados";
    case "no_events": return "WhatsApp IA · sin eventos registrados";
    case "error": return "WhatsApp IA · verificación no disponible";
    default: return "WhatsApp IA · consultando historial";
  }
}

export function whatsappNoticeLabel(status: WhatsAppNotificationState) {
  switch (status) {
    case "sent": return "Proveedor aceptó el último aviso; entrega sin verificar";
    case "pending": return "Último aviso pendiente";
    case "error": return "Último aviso con error";
    case "unavailable": return "No se pudo consultar";
    default: return "Sin notificaciones registradas";
  }
}

export function formatWhatsAppTimestamp(value: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Sin fecha registrada";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium", timeStyle: "short", timeZone: "America/Bogota",
  }).format(new Date(value));
}

export const isWhatsAppEventForContact = (activity: { channel: string | null }) =>
  activity.channel === "whatsapp_ia";
