import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDot,
  Layers3,
  MousePointer2,
  Network,
  Orbit,
  Sparkles,
  Workflow,
} from "lucide-react";
import "./lab-home.css";

const sectors = ["Odontología", "Cirugía", "Medicina", "Derecho", "Servicios premium"];

const decisions = [
  { n: "01", title: "Te descubre", text: "Una presencia que se siente seria, deseable y a la altura de tu experiencia.", icon: MousePointer2 },
  { n: "02", title: "Te cree", text: "Mensaje, diseño y prueba visual que reducen dudas antes de la primera conversación.", icon: Sparkles },
  { n: "03", title: "Da el paso", text: "Rutas claras para agendar, escribir, cotizar o iniciar un proceso comercial.", icon: CalendarDays },
  { n: "04", title: "No se pierde", text: "Sistemas que organizan contactos, seguimiento y oportunidades después del clic.", icon: Workflow },
];

function usePointerGlow() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      document.documentElement.style.setProperty("--lab-x", e.clientX + "px");
      document.documentElement.style.setProperty("--lab-y", e.clientY + "px");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
}

function Magnetic({ children, className = "", href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.12;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.12;
        el.style.transform = `translate(${x}px,${y}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0,0)";
      }}
    >
      {children}
    </a>
  );
}


const countries = [
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "México", code: "+52", flag: "🇲🇽" },
  { name: "Estados Unidos", code: "+1", flag: "🇺🇸" },
  { name: "España", code: "+34", flag: "🇪🇸" },
  { name: "Perú", code: "+51", flag: "🇵🇪" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Panamá", code: "+507", flag: "🇵🇦" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Rep. Dominicana", code: "+1", flag: "🇩🇴" },
  { name: "Otro", code: "+", flag: "🌎" },
];

function LeadCaptureForm() {
  const [country, setCountry] = useState("Colombia");
  const [dialCode, setDialCode] = useState("+57");

  function handleCountryChange(value: string) {
    setCountry(value);
    const match = countries.find((item) => item.name === value);
    if (match) setDialCode(match.code);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hola Cómplice Lab, quiero que revisen mi caso.",
      "",
      "Nombre y apellido: " + String(data.get("name") || ""),
      "Marca personal / empresa: " + String(data.get("brand") || ""),
      "País: " + country,
      "WhatsApp: " + dialCode + " " + String(data.get("phone") || ""),
      "Profesión / negocio: " + String(data.get("business") || ""),
      "Quiero resolver: " + String(data.get("need") || ""),
      "Tipo de solución: " + String(data.get("solution") || ""),
    ].join("\n");

    window.open(
      "https://wa.me/573161772880?text=" + encodeURIComponent(message),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form className="lab-lead-form" onSubmit={handleSubmit}>
      <div className="lead-form-topline">
        <span>DIAGNÓSTICO INICIAL</span>
        <small>≈ 60 segundos</small>
      </div>

      <div className="lead-field-grid">
        <label className="lead-field lead-field-wide">
          <span>Nombre y apellido</span>
          <input name="name" placeholder="Ej. Camilo Roman" required />
        </label>

        <label className="lead-field lead-field-wide">
          <span>Marca personal o empresa</span>
          <input name="brand" placeholder="Ej. Clínica Sonríe / Dra. Laura Gómez" required />
        </label>

        <label className="lead-field">
          <span>País</span>
          <select value={country} onChange={(e) => handleCountryChange(e.target.value)}>
            {countries.map((item) => <option key={item.name} value={item.name}>{item.flag} {item.name}</option>)}
          </select>
        </label>

        <label className="lead-field">
          <span>WhatsApp</span>
          <div className="lead-phone">
            <select
              className="lead-code-select"
              value={dialCode}
              onChange={(e) => {
                const selected = countries.find((item) => item.code === e.target.value);
                setDialCode(e.target.value);
                if (selected) setCountry(selected.name);
              }}
              aria-label="Indicativo del país"
            >
              {countries.map((item) => <option key={item.name + item.code} value={item.code}>{item.flag} {item.code}</option>)}
            </select>
            <input name="phone" placeholder="300 000 0000" inputMode="tel" required />
          </div>
        </label>

        <label className="lead-field lead-field-wide">
          <span>Profesión o tipo de negocio</span>
          <input name="business" placeholder="Ej. odontología, cirugía plástica, derecho, inmobiliaria..." required />
        </label>

        <label className="lead-field lead-field-wide">
          <span>¿Qué quieres que deje de pasar?</span>
          <textarea name="need" placeholder="Ej. tengo visitas pero no me escriben, pierdo leads, mi web no refleja mi nivel..." required />
        </label>

        <label className="lead-field lead-field-wide">
          <span>¿Qué te gustaría construir?</span>
          <select name="solution" defaultValue="Página + sistema comercial">
            <option>Página + sistema comercial</option>
            <option>Landing para captar clientes</option>
            <option>CRM / seguimiento de leads</option>
            <option>Automatización de procesos</option>
            <option>Rediseño de mi presencia actual</option>
            <option>No estoy seguro, necesito diagnóstico</option>
          </select>
        </label>
      </div>

      <button type="submit" className="lead-submit">
        <span>Quiero que revisen mi caso</span>
        <ArrowUpRight size={20}/>
      </button>

      <p className="lead-form-note">
        Te llevamos a WhatsApp con tu información organizada para continuar la conversación sin hacerte repetir todo.
      </p>
    </form>
  );
}

export function LabHome() {
  usePointerGlow();
  const [menu, setMenu] = useState(false);

  return (
    <main className="lab-home">
      <div className="lab-pointer-light" />

      <header className="lab-nav">
        <a href="/" className="lab-brand" aria-label="Cómplice Lab">
          <img src="/favicon.svg" alt="" />
          <span>CÓMPLICE <b>LAB</b></span>
        </a>
        <nav className={menu ? "is-open" : ""}>
          <a href="#enfoque">Enfoque</a>
          <a href="#sistema">Qué construimos</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Hablemos</a>
        </nav>
        <Magnetic className="lab-nav-cta" href="#contacto">Elevar mi presencia <ArrowUpRight size={16}/></Magnetic>
        <button className="lab-menu" onClick={() => setMenu(!menu)} aria-label="Abrir menú">MENÚ</button>
      </header>

      <section className="lab-hero">
        <div className="lab-hero-aurora a1" />
        <div className="lab-hero-aurora a2" />
        <div className="lab-hero-grid" />

        <div className="lab-hero-copy">
          <p className="lab-kicker"><span /> PARA PROFESIONALES QUE NO PUEDEN VERSE COMO UNO MÁS</p>
          <h1>
            Tu reputación ya tiene valor.
            <span className="lab-display-gradient">Hagamos que se vea.</span>
          </h1>
          <p className="lab-lead">
            Diseñamos páginas y sistemas digitales que convierten percepción en confianza,
            confianza en conversación y conversaciones en oportunidades reales.
          </p>
          <div className="lab-actions">
            <Magnetic href="#contacto" className="lab-primary">Quiero una propuesta <ArrowUpRight size={18}/></Magnetic>
            <a href="#proyectos" className="lab-ghost-link">Ver sistemas reales <span>↓</span></a>
          </div>
          <div className="lab-sector-rail">{sectors.map((x) => <span key={x}>{x}</span>)}</div>
        </div>

        <div className="lab-hero-stage" aria-hidden="true">
          <div className="lab-halo halo-1" />
          <div className="lab-halo halo-2" />
          <div className="lab-halo halo-3" />
          <div className="lab-glass-slab slab-a">
            <small>PERCEPCIÓN</small>
            <strong>Autoridad</strong>
            <span>+ confianza visual</span>
          </div>
          <div className="lab-glass-slab slab-b">
            <small>SISTEMA</small>
            <strong>Conversión</strong>
            <span>+ seguimiento</span>
          </div>
          <div className="lab-hero-core">
            <div className="lab-core-noise" />
            <Orbit size={32}/>
            <strong>REPUTACIÓN</strong>
            <span>→ OPORTUNIDADES</span>
          </div>
          <div className="lab-float-chip chip-a"><CircleDot size={14}/> Te encuentran</div>
          <div className="lab-float-chip chip-b"><Sparkles size={14}/> Confían</div>
          <div className="lab-float-chip chip-c"><CalendarDays size={14}/> Agendan</div>
          <div className="lab-float-chip chip-d"><Workflow size={14}/> Sigues el proceso</div>
          <div className="lab-stage-caption">ESTRATEGIA · DISEÑO · TECNOLOGÍA · CONVERSIÓN</div>
        </div>
      </section>

      <section className="nx-pulsebar" aria-label="Posicionamiento">
        <div className="nx-pulse-track">
          <span>ESTRATEGIA</span><i>✦</i><span>DISEÑO</span><i>✦</i><span>TECNOLOGÍA</span><i>✦</i><span>CONVERSIÓN</span><i>✦</i>
          <b>DISEÑAMOS PARA QUE TE ELIJAN ANTES DE HABLAR CONTIGO</b>
        </div>
      </section>

      <section className="nx-manifesto" id="enfoque">
        <div className="nx-manifesto-copy">
          <p className="nx-kicker">EL PROBLEMA NO SIEMPRE ES TU SERVICIO</p>
          <h2>Ser excelente no basta<br/>si <em>nadie lo percibe.</em></h2>
          <p>Tu cliente no empieza comparando funciones. Empieza comparando sensaciones: quién se ve más claro, más serio, más confiable y más fácil de elegir.</p>
          <div className="nx-manifesto-points">
            <span><b>01</b> Te encuentra</span>
            <span><b>02</b> Te interpreta</span>
            <span><b>03</b> Te compara</span>
            <span><b>04</b> Decide si avanza</span>
          </div>
        </div>
        <div className="nx-signal-stage" aria-hidden="true">
          <div className="nx-signal-ring ring1"/><div className="nx-signal-ring ring2"/><div className="nx-signal-ring ring3"/>
          <div className="nx-signal-core">
            <small>SEÑAL DIGITAL</small>
            <strong>¿Se nota<br/>tu nivel?</strong>
          </div>
          <div className="nx-signal-card sc-a"><span>PERCEPCIÓN</span><b>Autoridad</b></div>
          <div className="nx-signal-card sc-b"><span>CLARIDAD</span><b>Entiende rápido</b></div>
          <div className="nx-signal-card sc-c"><span>ACCIÓN</span><b>Da el paso</b></div>
          <div className="nx-light-sweep"/>
        </div>
      </section>

      <section className="nx-journey">
        <div className="nx-journey-head">
          <p className="nx-kicker light">ANTES DEL PRIMER MENSAJE</p>
          <h2>Diseñamos la secuencia<br/>que convierte atención <em>en acción.</em></h2>
        </div>
        <div className="nx-timeline">
          <div className="nx-line"/>
          <article className="nx-stop s1"><span>01</span><MousePointer2 size={22}/><h3>Te descubre</h3><p>La primera impresión filtra si sigues o no en la conversación.</p></article>
          <article className="nx-stop s2"><span>02</span><Sparkles size={22}/><h3>Te cree</h3><p>La experiencia confirma que estás a la altura de lo que prometes.</p></article>
          <article className="nx-stop s3"><span>03</span><CalendarDays size={22}/><h3>Actúa</h3><p>Agendar, escribir o cotizar se vuelve evidente y simple.</p></article>
          <article className="nx-stop s4"><span>04</span><Workflow size={22}/><h3>No se pierde</h3><p>El sistema conserva contexto, seguimiento y oportunidad.</p></article>
        </div>
      </section>

      <section className="nx-engine" id="sistema">
        <div className="nx-engine-copy">
          <p className="nx-kicker">LO QUE CONSTRUIMOS</p>
          <h2>Una experiencia por fuera.<br/><em>Un motor comercial por dentro.</em></h2>
          <p>No entregamos piezas aisladas. Conectamos presencia, captación, citas, seguimiento y operación para que todo empuje en la misma dirección.</p>
          <div className="nx-engine-tags"><span>WEB</span><span>CRM</span><span>AGENDA</span><span>AUTOMATIZACIÓN</span><span>SEGUIMIENTO</span></div>
        </div>
        <div className="nx-engine-ui">
          <div className="nx-engine-window">
            <div className="nx-window-top"><i/><i/><i/><small>ecosistema comercial</small></div>
            <div className="nx-window-body">
              <aside><span/><span/><span/><span/></aside>
              <main>
                <div className="nx-metric-row"><i/><i/><i/></div>
                <div className="nx-flow-panel">
                  <div className="nx-flow-node n1">Visita</div>
                  <div className="nx-flow-node n2">Lead</div>
                  <div className="nx-flow-node n3">Cita</div>
                  <div className="nx-flow-node n4">Seguimiento</div>
                  <svg viewBox="0 0 600 220" preserveAspectRatio="none"><path d="M70 110 C150 20 230 200 300 110 S450 20 530 110"/></svg>
                </div>
              </main>
            </div>
          </div>
          <div className="nx-float-stat stat1"><small>LEADS</small><strong>Organizados</strong></div>
          <div className="nx-float-stat stat2"><small>CITAS</small><strong>Visibles</strong></div>
        </div>
      </section>

      <section className="nx-work" id="proyectos">
        <div className="nx-work-head">
          <p className="nx-kicker light">SISTEMAS REALES</p>
          <h2>Ideas que ya están<br/><em>trabajando en negocios reales.</em></h2>
        </div>
        <div className="nx-work-stage">
          <a href="https://complicedental.com" target="_blank" rel="noreferrer" className="nx-work-feature">
            <div className="nx-work-copy"><span>01 / HEALTH TECH</span><h3>CÓMPLICE<br/>DENTAL</h3><p>Captación, CRM, citas y seguimiento para odontólogos.</p><b>Explorar sistema <ArrowUpRight size={16}/></b></div>
            <div className="nx-work-screen">
              <div className="nx-screen-top"><i/><i/><i/></div>
              <div className="nx-screen-body"><aside/><div><span/><span/><span/><strong/></div></div>
            </div>
          </a>
          <a href="https://demo.complicedental.com" target="_blank" rel="noreferrer" className="nx-work-card nx-wc-show"><span>02 / SHOWROOM</span><div className="nx-stack"><i/><i/><i/></div><h3>Que el cliente vea su futuro antes de comprar.</h3><b>Ver showroom <ArrowUpRight size={15}/></b></a>
          <a href="https://miraiz.com.co" target="_blank" rel="noreferrer" className="nx-work-card nx-wc-raiz"><span>03 / REAL ESTATE</span><div className="nx-rings"><i/><i/></div><h3>Mi Raíz</h3><p>Catálogo, operación, asesores y comisiones.</p><b>Ver proyecto <ArrowUpRight size={15}/></b></a>
        </div>
      </section>

      <section className="nx-code">
        <div className="nx-code-copy">
          <p className="nx-kicker">EL ESTÁNDAR CÓMPLICE</p>
          <h2>No diseñamos para decorar.<br/><em>Diseñamos para posicionar.</em></h2>
          <p>Dirección creativa, arquitectura comercial y tecnología útil trabajando como una sola cosa.</p>
        </div>
        <div className="nx-code-object" aria-hidden="true">
          <div className="nx-code-cube">
            <div className="nx-face front"><span>CÓMPLICE</span><b>LAB</b></div>
            <div className="nx-face side"><span>ESTRATEGIA</span></div>
            <div className="nx-face top"><span>DISEÑO</span></div>
          </div>
          <div className="nx-code-label l1">Dirección creativa</div>
          <div className="nx-code-label l2">Arquitectura comercial</div>
          <div className="nx-code-label l3">Tecnología útil</div>
          <div className="nx-code-label l4">Detalle obsesivo</div>
        </div>
      </section>

      <section className="nx-contact" id="contacto">
        <div className="nx-contact-copy">
          <p className="nx-kicker light">DIAGNÓSTICO INICIAL</p>
          <h2>Cuéntanos qué debería<br/><em>empezar a pasar.</em></h2>
          <p>Primero entendemos tu negocio. Después decidimos qué construir, qué conectar y qué debe cambiar para que tu presencia digital empiece a trabajar a tu favor.</p>
          <div className="nx-contact-notes"><span><b>01</b> Contexto</span><span><b>02</b> Cuello de botella</span><span><b>03</b> Solución concreta</span></div>
        </div>
        <div className="nx-contact-form"><LeadCaptureForm /></div>
        <div className="nx-contact-beam"/>
      </section>
    </main>
  );
}
