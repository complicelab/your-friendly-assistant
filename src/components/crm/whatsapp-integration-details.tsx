import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  INITIAL_WHATSAPP_STATUS, formatWhatsAppTimestamp, receiptPhase,
  whatsAppReceiptLabel, whatsappNoticeLabel,
  type WhatsAppIntegrationStatus, type WhatsAppNotificationState,
} from "@/lib/whatsapp-integration-status";

export function useWhatsAppIntegrationStatus(accessToken: string) {
  const [status, setStatus] = useState<WhatsAppIntegrationStatus>(INITIAL_WHATSAPP_STATUS);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (!accessToken) {
      setStatus(INITIAL_WHATSAPP_STATUS);
      return;
    }
    setRefreshing(true);
    try {
      const [inboundResult, contactsResult, noticeResult] = await Promise.all([
        supabase.from("crm_activities")
          .select("created_at,activity_type")
          .eq("channel", "whatsapp_ia")
          .order("created_at", { ascending: false })
          .limit(1),
        supabase.from("crm_contacts")
          .select("id", { count: "exact", head: true })
          .eq("source", "whatsapp_ia"),
        supabase.from("crm_notifications")
          .select("created_at,status")
          .eq("channel", "whatsapp")
          .order("created_at", { ascending: false })
          .limit(1),
      ]);
      if (inboundResult.error || contactsResult.error) {
        setStatus({
          ...INITIAL_WHATSAPP_STATUS,
          phase: "error",
          notice: noticeResult.error ? "unavailable" : "none",
        });
        return;
      }
      const last = inboundResult.data?.[0] ?? null;
      const count = contactsResult.count ?? 0;
      const notification = noticeResult.data?.[0] ?? null;
      const notice: WhatsAppNotificationState = noticeResult.error
        ? "unavailable"
        : notification?.status === "enviado" ? "sent"
        : notification?.status === "pendiente" ? "pending"
        : notification?.status === "error" ? "error" : "none";
      setStatus({
        phase: receiptPhase(last?.created_at ?? null, count),
        lastInboundAt: last?.created_at ?? null,
        lastEventType: last?.activity_type ?? null,
        contactCount: count,
        notice,
        lastNotificationAt: notification?.created_at ?? null,
      });
    } catch {
      setStatus({ ...INITIAL_WHATSAPP_STATUS, phase: "error", notice: "unavailable" });
    } finally {
      setRefreshing(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    void refresh();
    const checkWhenVisible = () => { if (!document.hidden) void refresh(); };
    const timer = window.setInterval(checkWhenVisible, 60_000);
    window.addEventListener("focus", checkWhenVisible);
    document.addEventListener("visibilitychange", checkWhenVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", checkWhenVisible);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [accessToken, refresh]);

  return { status, refreshing, refresh };
}

export function CrmWhatsAppIntegrationDetails({
  status, refreshing, onRefresh,
}: {
  status: WhatsAppIntegrationStatus;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return <section className="clb-settings-card clb-whatsapp-audit">
    <div className="clb-panel-title">
      <div><span>INTEGRACIONES</span><h2>WhatsApp IA · diagnóstico del CRM</h2></div>
      <button type="button" className="crm-secondary" onClick={onRefresh} disabled={refreshing}>
        {refreshing ? "Comprobando…" : "Actualizar estado"}
      </button>
    </div>
    <p className="clb-muted">Esta comprobación usa los datos reales del CRM autenticado. No da por conectada una API solamente porque existan contactos antiguos.</p>
    <div className="clb-whatsapp-audit-grid">
      <div>
        <span>Recepción de eventos → CRM</span>
        <strong>{whatsAppReceiptLabel(status.phase)}</strong>
        <small>Último evento: {formatWhatsAppTimestamp(status.lastInboundAt)}</small>
      </div>
      <div>
        <span>Contactos originados en WhatsApp IA</span>
        <strong>{status.phase === "error" ? "Sin poder consultar" : status.contactCount}</strong>
        <small>La cifra proviene del campo de origen del CRM.</small>
      </div>
      <div>
        <span>Avisos de reservas por WhatsApp</span>
        <strong>{whatsappNoticeLabel(status.notice)}</strong>
        <small>Último registro: {formatWhatsAppTimestamp(status.lastNotificationAt)}</small>
      </div>
    </div>
    <p className="clb-muted"><strong>Respuestas automáticas del agente:</strong> no se puede confirmar el envío o entrega de sus mensajes con estos registros. Los eventos entrantes solo prueban que el CRM los recibió. Para comprobar el agente externo y Meta se requieren registros de envío y estado de entrega de ese proveedor.</p>
  </section>;
}
