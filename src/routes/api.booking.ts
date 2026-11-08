import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

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
        return Response.json({ ok:true, timezone:"America/Bogota", slots:data || [] });
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

        const { data, error } = await supabase.rpc("crm_public_book_meeting", {
          p_full_name: String(body["full_name"] || "").trim(),
          p_brand_name: String(body["brand_name"] || "").trim(),
          p_country: String(body["country"] || "Colombia").trim(),
          p_country_code: String(body["country_code"] || "+57").trim(),
          p_whatsapp: String(body["whatsapp"] || "").trim(),
          p_email: String(body["email"] || "").trim(),
          p_solution_interest: String(body["solution_interest"] || "").trim(),
          p_starts_at: String(body["starts_at"] || "").trim(),
          p_consent_text: "Autorizo el uso de mis datos para responder esta solicitud. No implica recibir publicidad adicional.",
        });

        if (error) {
          const message = /Horario no disponible/i.test(error.message || "")
            ? "Ese horario acaba de ocuparse. Elige otro disponible."
            : "No fue posible confirmar la videollamada.";
          return Response.json({ ok:false, error:message }, { status:409 });
        }
        return Response.json({ ok:true, meeting_id:data });
      },
    },
  },
});
