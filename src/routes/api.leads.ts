import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_STATUS = "nuevo";

function text(value: unknown, max = 500) {
  if (typeof value !== "string") return null;
  const clean = value.trim().replace(/\s+/g, " ");
  return clean ? clean.slice(0, max) : null;
}

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !serviceKey) {
          return Response.json(
            { ok: false, code: "CRM_NOT_CONNECTED", message: "La base del CRM todavía no está habilitada." },
            { status: 503 },
          );
        }

        let input: Record<string, unknown>;
        try {
          input = await request.json();
        } catch {
          return Response.json({ ok: false, message: "Solicitud inválida." }, { status: 400 });
        }

        const fullName = text(input.full_name ?? input.name, 140);
        const whatsapp = text(input.whatsapp ?? input.phone, 50);
        const consentService = input.consent_service === true;

        if (!fullName || !whatsapp || !consentService) {
          return Response.json(
            { ok: false, message: "Nombre, WhatsApp y autorización de tratamiento son obligatorios." },
            { status: 422 },
          );
        }

        const payload = {
          full_name: fullName,
          brand_name: text(input.brand_name ?? input.brand, 180),
          email: text(input.email, 180),
          country: text(input.country, 90),
          country_code: text(input.country_code ?? input.dial_code, 12),
          whatsapp: whatsapp,
          profession: text(input.profession, 160),
          business_type: text(input.business_type ?? input.business, 180),
          need: text(input.need, 800),
          solution_interest: text(input.solution_interest ?? input.solution, 240),
          source: text(input.source, 60) || "web",
          source_detail: text(input.source_detail, 180),
          utm_source: text(input.utm_source, 140),
          utm_medium: text(input.utm_medium, 140),
          utm_campaign: text(input.utm_campaign, 180),
          utm_content: text(input.utm_content, 180),
          meta_lead_id: text(input.meta_lead_id, 180),
          status: ALLOWED_STATUS,
          owner_email: "complicelab@gmail.com",
          consent_service: true,
          consent_marketing: input.consent_marketing === true,
          consent_at: new Date().toISOString(),
          consent_text: text(input.consent_text, 1000),
          metadata: typeof input.metadata === "object" && input.metadata ? input.metadata : {},
        };

        const response = await fetch(url.replace(/\/$/, "") + "/rest/v1/crm_contacts", {
          method: "POST",
          headers: {
            apikey: serviceKey,
            Authorization: "Bearer " + serviceKey,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(payload),
        });

        const body = await response.text();
        if (!response.ok) {
          console.error("CRM lead insert failed", response.status, body);
          return Response.json({ ok: false, message: "No fue posible registrar el contacto." }, { status: 502 });
        }

        const rows = body ? JSON.parse(body) : [];
        return Response.json({ ok: true, id: rows?.[0]?.id ?? null }, { status: 201 });
      },
    },
  },
});
