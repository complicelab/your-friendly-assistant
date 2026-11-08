import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { CRM_ADMIN_EMAIL, isCrmAdministrator } from "@/lib/crm-access";
import { prepareCrmAccess } from "@/lib/crm-auth.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "CRM privado | Cómplice Lab" },
      { name: "description", content: "Acceso privado al CRM interno de Cómplice Lab." },
      { property: "og:title", content: "CRM privado | Cómplice Lab" },
      { property: "og:description", content: "Acceso exclusivo para el administrador de Cómplice Lab." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
  component: AdminCrmPage,
});

type Contact = {
  id: string;
  created_at: string;
  full_name: string;
  brand_name: string | null;
  whatsapp: string | null;
  email: string | null;
  profession: string | null;
  business_type: string | null;
  need: string | null;
  solution_interest: string | null;
  source: string;
  status: string;
  next_follow_up_at: string | null;
  consent_marketing: boolean;
  agent_status: string;
};

const ADMIN_EMAIL = CRM_ADMIN_EMAIL;
const STATUS = [
  ["nuevo", "Nuevo"],
  ["contactado", "Contactado"],
  ["calificado", "Calificado"],
  ["cita_agendada", "Cita agendada"],
  ["propuesta", "Propuesta"],
  ["seguimiento", "Seguimiento"],
  ["ganado", "Ganado"],
  ["perdido", "Perdido"],
] as const;

function AdminCrmPage() {
  const prepareAccess = useServerFn(prepareCrmAccess);
  const [token, setToken] = useState("");
  const [checking, setChecking] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let revision = 0;
    async function checkAccess() {
      const current = ++revision;
      const { data, error } = await supabase.auth.getUser();
      if (!active || current !== revision) return;
      if (error || !isCrmAdministrator(data.user)) {
        setToken("");
        setContacts([]);
        setSelected(null);
        if (data.user) setMessage("Este correo no tiene acceso al CRM.");
      } else {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!active || current !== revision) return;
        setToken(sessionData.session?.access_token || "");
      }
      setChecking(false);
    }
    // The generated client owns callback processing, persistence and token refresh.
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      queueMicrotask(() => { void checkAccess(); });
    });
    sessionStorage.removeItem("cl_crm_token");
    void checkAccess();
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    void supabase.from("crm_contacts").select("*").order("created_at", { ascending: false }).limit(300)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setMessage("No pude cargar los contactos del CRM.");
        else setContacts(data || []);
        setLoading(false);
      });
    return () => { active = false; };
  }, [token]);

  async function requestAccess() {
    setLoading(true);
    setMessage("");
    try {
      await prepareAccess();
      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
        options: { shouldCreateUser: false, emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) throw error;
      setMessage("Enviamos un enlace de acceso a " + ADMIN_EMAIL + ". Revisa también la carpeta de spam.");
    } catch {
      setMessage("No fue posible enviar el enlace. Intenta de nuevo en unos minutos.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(contact: Contact, status: string) {
    if (!token) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!isCrmAdministrator(userData.user)) return;
    const { data: updated, error } = await supabase.from("crm_contacts")
      .update({ status, last_contact_at: status === "contactado" ? new Date().toISOString() : undefined })
      .eq("id", contact.id).select("*").single();
    if (error || !updated) return setMessage("No pude actualizar el estado.");
    setContacts((items) => items.map((item) => item.id === updated.id ? updated : item));
    setSelected(updated);
  }

  async function logout() {
    setToken("");
    setContacts([]);
    setSelected(null);
    setMessage("");
    await supabase.auth.signOut();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      [c.full_name, c.brand_name, c.whatsapp, c.email, c.profession, c.business_type, c.source, c.status]
        .filter(Boolean).join(" ").toLowerCase().includes(q),
    );
  }, [contacts, query]);

  const metrics = useMemo(() => ({
    nuevos: contacts.filter((c) => c.status === "nuevo").length,
    citas: contacts.filter((c) => c.status === "cita_agendada").length,
    seguimiento: contacts.filter((c) => c.status === "seguimiento").length,
    ganados: contacts.filter((c) => c.status === "ganado").length,
  }), [contacts]);

  if (!token) {
    return (
      <main className="crm-shell crm-locked">
        <img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab" />
        <div className="crm-lock-card">
          <span>ACCESO PRIVADO</span>
          <h1>CRM de Cómplice Lab</h1>
          <p>Solo el administrador autorizado puede consultar contactos, seguimientos y oportunidades.</p>
          <div className="crm-admin-email">{ADMIN_EMAIL}</div>
          <button onClick={requestAccess} disabled={loading || checking}>
            {checking ? "Verificando acceso…" : loading ? "Solicitando…" : "Enviar enlace de acceso"}
          </button>
          {message && <p className="crm-message">{message}</p>}
        </div>
        <CrmStyles />
      </main>
    );
  }

  return (
    <main className="crm-shell">
      <header className="crm-topbar">
        <img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab" />
        <div>
          <span className="crm-agent-dot" /> Agente IA preparado · conexión pendiente
          <button onClick={logout}>Salir</button>
        </div>
      </header>

      <section className="crm-content">
        <div className="crm-heading">
          <div>
            <span>CRM INTERNO</span>
            <h1>Oportunidades</h1>
            <p>Quién llegó, qué necesita y qué toca hacer después.</p>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar contacto, marca, WhatsApp…" />
        </div>

        <div className="crm-metrics">
          <Metric label="Nuevos" value={metrics.nuevos} />
          <Metric label="Citas" value={metrics.citas} />
          <Metric label="Seguimiento" value={metrics.seguimiento} />
          <Metric label="Ganados" value={metrics.ganados} />
        </div>

        {message && <div className="crm-alert">{message}</div>}

        <div className="crm-grid">
          <section className="crm-list">
            <div className="crm-list-head">
              <b>Contactos</b>
              <span>{filtered.length}</span>
            </div>
            {loading && !contacts.length ? <div className="crm-empty">Cargando…</div> : null}
            {!loading && !filtered.length ? <div className="crm-empty">Todavía no hay contactos.</div> : null}
            {filtered.map((contact) => (
              <button
                className={"crm-contact " + (selected?.id === contact.id ? "is-active" : "")}
                key={contact.id}
                onClick={() => setSelected(contact)}
              >
                <div className="crm-avatar">{contact.full_name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <b>{contact.full_name}</b>
                  <span>{contact.brand_name || contact.business_type || "Sin marca registrada"}</span>
                  <small>{contact.source} · {new Date(contact.created_at).toLocaleDateString("es-CO")}</small>
                </div>
                <Status status={contact.status} />
              </button>
            ))}
          </section>

          <aside className="crm-detail">
            {!selected ? (
              <div className="crm-empty-detail">
                <span>Selecciona un contacto</span>
                <h2>Aquí verás todo el contexto antes de escribirle.</h2>
              </div>
            ) : (
              <>
                <div className="crm-detail-head">
                  <div>
                    <span>CONTACTO</span>
                    <h2>{selected.full_name}</h2>
                    <p>{selected.brand_name || selected.business_type || "Sin marca registrada"}</p>
                  </div>
                  <Status status={selected.status} />
                </div>

                <div className="crm-fields">
                  <Field label="WhatsApp" value={selected.whatsapp} />
                  <Field label="Correo" value={selected.email} />
                  <Field label="Profesión / negocio" value={selected.profession || selected.business_type} />
                  <Field label="Origen" value={selected.source} />
                  <Field label="Qué necesita" value={selected.need} wide />
                  <Field label="Servicio de interés" value={selected.solution_interest} wide />
                </div>

                <div className="crm-status-editor">
                  <label>Etapa comercial</label>
                  <select value={selected.status} onChange={(e) => updateStatus(selected, e.target.value)}>
                    {STATUS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                  </select>
                </div>

                <div className="crm-consent">
                  <b>Permisos y automatización</b>
                  <span>Respuesta a solicitud: autorizada</span>
                  <span>Marketing adicional: {selected.consent_marketing ? "autorizado" : "no autorizado"}</span>
                  <span>Agente IA: {selected.agent_status}</span>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
      <CrmStyles />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="crm-metric"><span>{label}</span><b>{value}</b></div>;
}

function Field({ label, value, wide = false }: { label: string; value: string | null; wide?: boolean }) {
  return <div className={"crm-field " + (wide ? "wide" : "")}><span>{label}</span><b>{value || "—"}</b></div>;
}

function Status({ status }: { status: string }) {
  const label = STATUS.find(([value]) => value === status)?.[1] || status;
  return <span className={"crm-status status-" + status}>{label}</span>;
}

function CrmStyles() {
  return <style>{`
    :root{font-family:"Montserrat",system-ui,sans-serif;color:#0d1830;background:#f4f7ff}
    *{box-sizing:border-box} body{margin:0;background:#f4f7ff}
    .crm-shell{min-height:100vh;background:radial-gradient(circle at 85% 8%,#e8e3ff 0,transparent 28%),radial-gradient(circle at 8% 12%,#dff5ff 0,transparent 30%),#f7f9ff;color:#0b1530}
    .crm-topbar{height:78px;padding:0 4vw;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.88);backdrop-filter:blur(18px);border-bottom:1px solid #e3e9f4;position:sticky;top:0;z-index:10}
    .crm-topbar img,.crm-locked>img{width:168px;height:auto}.crm-topbar>div{display:flex;align-items:center;gap:18px;font-size:13px;color:#64738e}.crm-topbar button{border:1px solid #dce3ef;background:#fff;border-radius:999px;padding:9px 15px;cursor:pointer}.crm-agent-dot{width:8px;height:8px;background:#21b879;border-radius:50%;display:inline-block}
    .crm-content{max-width:1380px;margin:auto;padding:42px 4vw 70px}.crm-heading{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:24px}.crm-heading>div>span,.crm-detail-head span,.crm-lock-card>span{font-size:11px;font-weight:800;letter-spacing:.1em;color:#3568ee}.crm-heading h1{font-family:"Poppins",sans-serif;font-size:42px;line-height:1;margin:7px 0 8px;letter-spacing:-.04em}.crm-heading p{margin:0;color:#6b7892}.crm-heading input{width:min(420px,40vw);height:48px;border:1px solid #dae2f0;border-radius:16px;padding:0 16px;background:#fff;font:inherit;outline:none}.crm-heading input:focus{border-color:#4969f2;box-shadow:0 0 0 3px rgba(73,105,242,.12)}
    .crm-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.crm-metric{background:#fff;border:1px solid #e0e6f1;border-radius:20px;padding:18px 20px;box-shadow:0 12px 30px rgba(44,70,125,.06)}.crm-metric span{display:block;color:#71809a;font-size:12px}.crm-metric b{display:block;font-family:"Poppins",sans-serif;font-size:28px;margin-top:5px}
    .crm-grid{display:grid;grid-template-columns:minmax(430px,.9fr) minmax(520px,1.25fr);gap:18px}.crm-list,.crm-detail{background:#fff;border:1px solid #e0e6f1;border-radius:26px;box-shadow:0 22px 55px rgba(39,66,120,.08);overflow:hidden}.crm-list-head{padding:18px 20px;border-bottom:1px solid #e7ebf3;display:flex;justify-content:space-between}.crm-list-head span{background:#eff4ff;padding:4px 9px;border-radius:999px;font-size:12px}
    .crm-contact{width:100%;display:grid;grid-template-columns:46px 1fr auto;gap:12px;align-items:center;padding:15px 18px;background:#fff;border:0;border-bottom:1px solid #edf0f5;text-align:left;cursor:pointer}.crm-contact:hover,.crm-contact.is-active{background:#f3f7ff}.crm-avatar{width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#2569ea,#7457ed);color:#fff;display:grid;place-items:center;font-weight:800}.crm-contact b{display:block;font-size:14px}.crm-contact span:not(.crm-status){display:block;color:#65748d;font-size:12px;margin-top:3px}.crm-contact small{display:block;color:#95a0b3;font-size:10px;margin-top:4px}
    .crm-status{display:inline-flex;align-items:center;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:800;background:#eef2f8;color:#5f6d83}.status-nuevo{background:#fff0d9;color:#b56b00}.status-contactado,.status-calificado{background:#e8f1ff;color:#2760d8}.status-cita_agendada{background:#e3f8ee;color:#128454}.status-propuesta,.status-seguimiento{background:#efeaff;color:#6a4ee5}.status-ganado{background:#daf8e8;color:#0f8652}.status-perdido{background:#ffe8ec;color:#b92f48}
    .crm-detail{padding:24px}.crm-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding-bottom:20px;border-bottom:1px solid #e9edf4}.crm-detail-head h2{font:700 28px/1 "Poppins",sans-serif;letter-spacing:-.03em;margin:6px 0}.crm-detail-head p{margin:0;color:#6b7892}.crm-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0}.crm-field{background:#f7f9fd;border:1px solid #e7ebf3;border-radius:16px;padding:14px}.crm-field.wide{grid-column:1/-1}.crm-field span{display:block;color:#7a879d;font-size:11px;margin-bottom:5px}.crm-field b{font-size:13px;line-height:1.45}.crm-status-editor{display:grid;gap:7px;margin:16px 0}.crm-status-editor label{font-size:12px;color:#6b7892}.crm-status-editor select{height:46px;border:1px solid #dce3ef;border-radius:14px;padding:0 12px;background:#fff;font:inherit}.crm-consent{display:grid;gap:8px;background:linear-gradient(135deg,#edf5ff,#f2edff);border-radius:18px;padding:16px}.crm-consent span{font-size:12px;color:#5f6e87}
    .crm-empty,.crm-empty-detail{padding:34px;color:#7b879b}.crm-empty-detail{min-height:420px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}.crm-empty-detail h2{font:700 28px/1.15 "Poppins",sans-serif;max-width:460px;letter-spacing:-.03em}.crm-alert,.crm-message{padding:12px 14px;border-radius:14px;background:#fff5df;color:#8f6400;margin:12px 0;font-size:13px}
    .crm-locked{display:grid;place-items:center;align-content:center;gap:28px;padding:36px}.crm-lock-card{width:min(620px,94vw);padding:34px;background:#fff;border:1px solid #dfe6f2;border-radius:28px;box-shadow:0 28px 70px rgba(37,67,127,.12);text-align:center}.crm-lock-card h1{font:700 36px/1.05 "Poppins",sans-serif;letter-spacing:-.04em;margin:10px 0 14px}.crm-lock-card p{color:#697891;line-height:1.65}.crm-admin-email{margin:18px 0;background:#f4f7ff;border-radius:14px;padding:13px;font-weight:700}.crm-lock-card button{border:0;border-radius:999px;background:linear-gradient(90deg,#176ae8,#7254ed);color:#fff;font-weight:800;padding:14px 22px;cursor:pointer}
    @media(max-width:900px){.crm-grid{grid-template-columns:1fr}.crm-heading{align-items:stretch;flex-direction:column}.crm-heading input{width:100%}.crm-metrics{grid-template-columns:1fr 1fr}.crm-detail{min-height:unset}}
    @media(max-width:560px){.crm-content{padding:28px 18px 50px}.crm-topbar{padding:0 18px}.crm-topbar>div{font-size:0}.crm-heading h1{font-size:34px}.crm-metrics{gap:10px}.crm-metric{padding:15px}.crm-contact{grid-template-columns:42px 1fr}.crm-contact>.crm-status{grid-column:2}.crm-fields{grid-template-columns:1fr}.crm-field.wide{grid-column:auto}.crm-lock-card{padding:26px 20px}.crm-lock-card h1{font-size:30px}}
  `}</style>;
}
