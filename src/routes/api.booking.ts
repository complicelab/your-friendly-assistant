import { createFileRoute } from "@tanstack/react-router";
import { normalizedServiceInterest } from "@/lib/crm-model";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const BOOKING_TIMEZONE = "America/Bogota";
const DEFAULT_ADMIN_EMAIL = "complicelab@gmail.com";

type DeliveryResult = {
  channel: "email" | "whatsapp";
  recipient_type: "attendee" | "admin";
  recipient: string;
  template_key: string;
  status: "enviado" | "pendiente" | "error";
  error?: string;
};

function env(name: string) {
  return typeof process !== "undefined" ? String(process.env[name] || "").trim() : "";
}

function serverAdminClient() {
  const url = env("SUPABASE_URL") || env("VITE_SUPABASE_URL");
  const key = env("SUPABASE_SECRET_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[char] || char);
}

function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: BOOKING_TIMEZONE,
  }).format(new Date(value));
}

function cleanWhatsapp(value: string) {
  return value.replace(/[^0-9]/g, "");
}

async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  recipient_type: "attendee" | "admin";
  template_key: string;
}): Promise<DeliveryResult> {
  const apiKey = env("RESEND_API_KEY");
  const from = env("RESEND_FROM_EMAIL");
  if (!apiKey || !from) {
    return {
      channel: "email",
      recipient_type: input.recipient_type,
      recipient: input.to,
      template_key: input.template_key,
      status: "pendiente",
      error: "Proveedor de correo no configurado.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      throw new Error(detail || `Resend respondió ${response.status}`);
    }
    return {
      channel: "email",
      recipient_type: input.recipient_type,
      recipient: input.to,
      template_key: input.template_key,
      status: "enviado",
    };
  } catch (error) {
    return {
      channel: "email",
      recipient_type: input.recipient_type,
      recipient: input.to,
      template_key: input.template_key,
      status: "error",
      error: error instanceof Error ? error.message : "Error enviando correo.",
    };
  }
}

async function sendWhatsAppTemplate(input: {
  to: string;
  template: string;
  parameters: string[];
  recipient_type: "attendee" | "admin";
  template_key: string;
}): Promise<DeliveryResult> {
  const token = env("META_WHATSAPP_TOKEN");
  const phoneNumberId = env("META_WHATSAPP_PHONE_NUMBER_ID");
  const apiVersion = env("META_GRAPH_API_VERSION");
  const languageCode = env("META_WHATSAPP_LANGUAGE_CODE") || "es";
  const recipient = cleanWhatsapp(input.to);

  if (!token || !phoneNumberId || !apiVersion || !input.template || !recipient) {
    return {
      channel: "whatsapp",
      recipient_type: input.recipient_type,
      recipient: input.to,
      template_key: input.template_key,
      status: "pendiente",
      error: "Meta WhatsApp Cloud API o plantilla no configurada.",
    };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${encodeURIComponent(apiVersion)}/${encodeURIComponent(phoneNumberId)}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient,
          type: "template",
          template: {
            name: input.template,
            language: { code: languageCode },
            components: [{
              type: "body",
              parameters: input.parameters.map((text) => ({ type: "text", text })),
            }],
          },
        }),
      },
    );
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 700);
      throw new Error(detail || `Meta respondió ${response.status}`);
    }
    return {
      channel: "whatsapp",
      recipient_type: input.recipient_type,
      recipient: input.to,
      template_key: input.template_key,
      status: "enviado",
    };
  } catch (error) {
    return {
      channel: "whatsapp",
      recipient_type: input.recipient_type,
      recipient: input.to,
      template_key: input.template_key,
      status: "error",
      error: error instanceof Error ? error.message : "Error enviando WhatsApp.",
    };
  }
}

async function persistDeliveryResults(meetingId: string, results: DeliveryResult[]) {
  const admin = serverAdminClient();
  if (!admin) return;

  for (const item of results) {
    const { data: current } = await admin
      .from("crm_notifications")
      .select("id,attempts")
      .eq("meeting_id", meetingId)
      .eq("channel", item.channel)
      .eq("recipient_type", item.recipient_type)
      .eq("template_key", item.template_key)
      .maybeSingle();

    const patch = {
      recipient: item.recipient,
      status: item.status,
      attempts: Number(current?.attempts || 0) + 1,
      sent_at: item.status === "enviado" ? new Date().toISOString() : null,
      last_error: item.error || null,
    };

    if (current?.id) {
      await admin.from("crm_notifications").update(patch).eq("id", current.id);
    } else {
      await admin.from("crm_notifications").insert({
        meeting_id: meetingId,
        channel: item.channel,
        recipient_type: item.recipient_type,
        recipient: item.recipient,
        template_key: item.template_key,
        status: item.status,
        attempts: 1,
        sent_at: item.status === "enviado" ? new Date().toISOString() : null,
        last_error: item.error || null,
        payload: {},
      });
    }
  }
}

async function deliverBookingNotifications(input: {
  meetingId: string;
  fullName: string;
  email: string;
  whatsapp: string;
  startsAt: string;
  service: string;
}) {
  const when = formatBookingDate(input.startsAt);
  const firstName = input.fullName.trim().split(/\s+/)[0] || input.fullName;
  const adminEmail = env("CRM_ADMIN_EMAIL") || DEFAULT_ADMIN_EMAIL;
  const adminWhatsapp = env("CRM_ADMIN_WHATSAPP");

  const attendeeHtml = `
  <div style="font-family:Arial,sans-serif;color:#111827;max-width:620px;margin:auto">
    <h1 style="font-size:25px">Tu diagnóstico quedó agendado</h1>
    <p>Hola ${escapeHtml(firstName)}, estaremos felices de atenderte.</p>
    <p><strong>Fecha y hora:</strong> ${escapeHtml(when)} · hora de Colombia<br>
    <strong>Interés:</strong> ${escapeHtml(input.service)}</p>
    <p>Si necesitamos confirmar algún detalle nos comunicaremos contigo por los datos que registraste.</p>
    <p style="color:#64748b">Cómplice Lab</p>
  </div>`;

  const adminHtml = `
  <div style="font-family:Arial,sans-serif;color:#111827;max-width:620px;margin:auto">
    <h1 style="font-size:25px">Nuevo diagnóstico agendado</h1>
    <p><strong>Contacto:</strong> ${escapeHtml(input.fullName)}<br>
    <strong>Correo:</strong> ${escapeHtml(input.email)}<br>
    <strong>WhatsApp:</strong> ${escapeHtml(input.whatsapp)}<br>
    <strong>Fecha y hora:</strong> ${escapeHtml(when)} · hora de Colombia<br>
    <strong>Interés:</strong> ${escapeHtml(input.service)}</p>
    <p>La reserva está registrada en el CRM de Cómplice Lab.</p>
  </div>`;

  const deliveries: Promise<DeliveryResult>[] = [
    sendEmail({
      to: input.email,
      subject: "Tu diagnóstico con Cómplice Lab quedó agendado",
      html: attendeeHtml,
      recipient_type: "attendee",
      template_key: "booking_confirmation_attendee",
    }),
    sendEmail({
      to: adminEmail,
      subject: `Nuevo diagnóstico agendado · ${input.fullName}`,
      html: adminHtml,
      recipient_type: "admin",
      template_key: "booking_confirmation_admin",
    }),
    sendWhatsAppTemplate({
      to: input.whatsapp,
      template: env("META_WHATSAPP_BOOKING_TEMPLATE_ATTENDEE"),
      parameters: [firstName, when, input.service],
      recipient_type: "attendee",
      template_key: "booking_confirmation_attendee",
    }),
  ];

  if (adminWhatsapp) {
    deliveries.push(sendWhatsAppTemplate({
      to: adminWhatsapp,
      template: env("META_WHATSAPP_BOOKING_TEMPLATE_ADMIN"),
      parameters: [input.fullName, when, input.service],
      recipient_type: "admin",
      template_key: "booking_confirmation_admin",
    }));
  }

  const results = await Promise.all(deliveries);
  await persistDeliveryResults(input.meetingId, results);
  return results;
}

export const Route = createFileRoute("/api/booking")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const start = url.searchParams.get("start") || new Date().toISOString().slice(0,10);
        const rawDays = Number(url.searchParams.get("days") || "14");
        const days = Number.isFinite(rawDays) ? Math.max(1, Math.min(60, rawDays)) : 14;
        const { data, error } = await supabase.rpc("crm_public_available_slots", {
          p_start_date: start,
          p_days: days,
        });
        if (error) return Response.json({ ok:false, error:"No fue posible cargar la disponibilidad." }, { status:500 });
        return Response.json({ ok:true, timezone:BOOKING_TIMEZONE, slots:data || [] });
      },
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try { body = await request.json(); }
        catch { return Response.json({ ok:false, error:"Solicitud inválida." }, { status:400 }); }

        const required = ["full_name","whatsapp","email","solution_interest","starts_at"] as const;
        for (const key of required) {
          if (!String(body[key] || "").trim()) {
            return Response.json({ ok:false, error:"Completa todos los campos obligatorios." }, { status:400 });
          }
        }

        const fullName = String(body["full_name"] || "").trim();
        const whatsapp = String(body["whatsapp"] || "").trim();
        const email = String(body["email"] || "").trim();
        const solutionInterest = normalizedServiceInterest(String(body["solution_interest"] || "").trim());
        const startsAt = String(body["starts_at"] || "").trim();

        const { data, error } = await supabase.rpc("crm_public_book_meeting", {
          p_full_name: fullName,
          p_brand_name: String(body["brand_name"] || "").trim(),
          p_country: String(body["country"] || "Colombia").trim(),
          p_country_code: String(body["country_code"] || "+57").trim(),
          p_whatsapp: whatsapp,
          p_email: email,
          p_solution_interest: solutionInterest,
          p_starts_at: startsAt,
          p_consent_text: "Autorizo el uso de mis datos para gestionar el diagnóstico solicitado y las confirmaciones relacionadas con la reserva.",
        });

        if (error) {
          const message = /Horario no disponible/i.test(error.message || "")
            ? "Ese horario acaba de ocuparse. Elige otro disponible."
            : "No fue posible confirmar el diagnóstico.";
          return Response.json({ ok:false, error:message }, { status:409 });
        }

        const meetingId = String(data || "");
        const notifications = meetingId
          ? await deliverBookingNotifications({
              meetingId,
              fullName,
              email,
              whatsapp,
              startsAt,
              service: solutionInterest,
            })
          : [];

        return Response.json({
          ok:true,
          meeting_id:meetingId,
          notifications:notifications.map(({channel,recipient_type,status})=>({channel,recipient_type,status})),
        });
      },
    },
  },
});
