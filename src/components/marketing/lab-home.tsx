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

      <section className="lab-proof-strip" aria-label="Posicionamiento">
        <div className="lab-marquee-track">
          <div className="lab-marquee-group">
            <span>NO HACEMOS WEBS PARA “ESTAR EN INTERNET”</span><i>✦</i>
            <span>DISEÑAMOS PARA SER ELEGIDOS</span><i>✦</i>
            <span>ESTRATEGIA · DISEÑO · TECNOLOGÍA · CONVERSIÓN</span><i>✦</i>
          </div>
          <div className="lab-marquee-group" aria-hidden="true">
            <span>NO HACEMOS WEBS PARA “ESTAR EN INTERNET”</span><i>✦</i>
            <span>DISEÑAMOS PARA SER ELEGIDOS</span><i>✦</i>
            <span>ESTRATEGIA · DISEÑO · TECNOLOGÍA · CONVERSIÓN</span><i>✦</i>
          </div>
        </div>
      </section>

      <section className="lab-manifesto" id="enfoque">
        <div className="perception-grid"/>
        <div className="perception-glow pg1"/>
        <div className="perception-glow pg2"/>

        <div className="lab-manifesto-copy">
          <p className="lab-kicker light"><span /> EL PROBLEMA NO SIEMPRE ES TU SERVICIO</p>
          <h2>
            Puedes ser excelente y aun así
            <em>parecer una opción más.</em>
          </h2>
          <p>
            Antes de llamarte, tu cliente ya comparó, dudó y descartó. Si tu presencia digital no transmite
            autoridad, claridad y nivel, puedes perder la oportunidad sin siquiera saber que existió.
          </p>

          <div className="lab-pain-list">
            <div><span>01</span><b>Te encuentran, pero no entienden por qué elegirte.</b></div>
            <div><span>02</span><b>Ven tu perfil, pero no sienten suficiente confianza para escribir.</b></div>
            <div><span>03</span><b>Preguntan, pero el seguimiento se enfría o se pierde.</b></div>
          </div>
        </div>

        <div className="perception-stage" aria-hidden="true">
          <div className="perception-orbit po1"/>
          <div className="perception-orbit po2"/>
          <div className="perception-core">
            <div className="core-face front">
              <span>PERCEPCIÓN</span>
              <strong>¿TE ELIGEN?</strong>
            </div>
            <div className="core-face back">
              <span>REALIDAD</span>
              <strong>ERES BUENO</strong>
            </div>
          </div>

          <div className="float-signal fs1">
            <small>01 · DESCUBRIMIENTO</small>
            <strong>Te vio.</strong>
            <span>Pero todavía no sabe por qué tú.</span>
          </div>
          <div className="float-signal fs2">
            <small>02 · COMPARACIÓN</small>
            <strong>Te comparó.</strong>
            <span>La percepción decide antes que el precio.</span>
          </div>
          <div className="float-signal fs3">
            <small>03 · DECISIÓN</small>
            <strong>Te escribió.</strong>
            <span>Ahora toca no perder la oportunidad.</span>
          </div>

          <div className="perception-chip chip-bad"><i/>SE VE GENÉRICO</div>
          <div className="perception-chip chip-good"><i/>SE SIENTE PREMIUM</div>
          <div className="perception-chip chip-trust"><i/>GENERA CONFIANZA</div>

          <div className="perception-scanline"/>
          <div className="perception-caption">LA DECISIÓN EMPIEZA ANTES DEL PRIMER MENSAJE</div>
        </div>
      </section>

      <section className="lab-decisions">
        <div className="lab-section-head">
          <p className="lab-kicker"><span /> ANTES DE HABLAR CONTIGO</p>
          <h2>Tu cliente ya tomó varias decisiones.</h2>
          <p>Diseñamos cada punto digital para que esas decisiones jueguen a tu favor.</p>
        </div>
        <div className="lab-decision-grid">
          {decisions.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className={"lab-decision d" + (index + 1)} key={item.n}>
                <div className="lab-decision-top"><span>{item.n}</span><Icon size={22}/></div>
                <div className="lab-decision-orbit" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="lab-decision-line" />
              </article>
            );
          })}
        </div>
      </section>

      <section className="lab-system" id="sistema">
        <div className="lab-system-intro">
          <p className="lab-kicker"><span /> CÓMO FUNCIONA</p>
          <h2>De visitante a cliente.<br/><em>Sin perderlo en el camino.</em></h2>
          <p>Una experiencia simple para la persona. Un sistema claro para tu negocio.</p>
        </div>

        <div className="lab-conversion-map">
          <div className="conversion-path">
            <div className="conversion-node n1">
              <span>01</span>
              <MousePointer2 size={21}/>
              <b>Te descubre</b>
              <small>Web · campaña · búsqueda</small>
            </div>

            <div className="conversion-arrow">→</div>

            <div className="conversion-node n2">
              <span>02</span>
              <Sparkles size={21}/>
              <b>Confía</b>
              <small>Mensaje · diseño · autoridad</small>
            </div>

            <div className="conversion-arrow">→</div>

            <div className="conversion-node n3">
              <span>03</span>
              <CalendarDays size={21}/>
              <b>Actúa</b>
              <small>Cita · WhatsApp · formulario</small>
            </div>
          </div>

          <div className="conversion-result">
            <div className="conversion-result-icon"><Workflow size={25}/></div>
            <div>
              <span>Y DESPUÉS DEL CLIC</span>
              <h3>Todo queda organizado.</h3>
              <p>CRM, seguimiento, estados y automatizaciones para que la oportunidad no se pierda.</p>
            </div>
            <div className="conversion-mini-ui">
              <i/><i/><i/><i/>
            </div>
          </div>
        </div>
      </section>

      <section className="lab-projects" id="proyectos">
        <div className="lab-projects-head">
          <p className="lab-kicker"><span /> SISTEMAS REALES</p>
          <h2>Proyectos que no solo se ven bien.<br/><span>Se sienten hechos para vender.</span></h2>
          <p>Cada sistema parte de un negocio distinto. Por eso cada experiencia también debe sentirse distinta.</p>
        </div>

        <div className="lab-showcase-editorial">
          <a href="https://complicedental.com" target="_blank" rel="noreferrer" className="showcase-hero dental-editorial">
            <div className="showcase-copy">
              <span>01 · CÓMPLICE DENTAL</span>
              <h3>Captar pacientes.<br/>Gestionar mejor.<br/><em>Vender con sistema.</em></h3>
              <p>Una experiencia para odontólogos que conecta presencia digital, citas, contactos y seguimiento comercial.</p>
              <div className="showcase-meta"><i>Web</i><i>CRM</i><i>Agenda</i><i>Seguimiento</i></div>
              <b>Explorar Cómplice Dental <ArrowUpRight size={16}/></b>
            </div>

            <div className="showcase-visual">
              <div className="device-backplate"/>
              <div className="showcase-screen">
                <div className="screen-top"><i/><i/><i/><span>complicedental / dashboard</span></div>
                <div className="screen-body">
                  <aside><span/><span/><span/><span/></aside>
                  <div className="screen-main">
                    <div className="screen-headline"><small>HOY</small><strong>Tu operación en un solo lugar.</strong></div>
                    <div className="screen-metrics"><div/><div/><div/></div>
                    <div className="screen-lower"><div className="screen-graph"/><div className="screen-queue"/></div>
                  </div>
                </div>
              </div>
              <div className="showcase-bubble bubble-one"><small>NUEVO LEAD</small><strong>Paciente interesado</strong></div>
              <div className="showcase-bubble bubble-two"><small>AGENDA</small><strong>Valoración confirmada ✓</strong></div>
            </div>
          </a>

          <div className="showcase-secondary-grid">
            <a href="https://demo.complicedental.com" target="_blank" rel="noreferrer" className="showcase-secondary showroom-editorial">
              <div className="secondary-art showroom-art">
                <div className="showroom-sheet s1"/>
                <div className="showroom-sheet s2"/>
                <div className="showroom-sheet s3">
                  <span>PROPUESTA</span>
                  <strong>Tu futura web,<br/>antes de comprarla.</strong>
                </div>
              </div>
              <div className="secondary-copy">
                <span>02 · SHOWROOM INTERACTIVO</span>
                <h3>Una propuesta que se siente real.</h3>
                <p>El cliente ve su marca, su estilo y su experiencia antes de tomar la decisión.</p>
                <b>Ver showroom <ArrowUpRight size={15}/></b>
              </div>
            </a>

            <a href="https://miraiz.com.co" target="_blank" rel="noreferrer" className="showcase-secondary raiz-editorial">
              <div className="secondary-art raiz-art">
                <div className="raiz-orbit"/>
                <div className="raiz-house-card">
                  <small>INMUEBLE</small>
                  <strong>$ 480 M</strong>
                  <span>3 hab · 2 baños · 96 m²</span>
                </div>
                <div className="raiz-ops-card">
                  <small>OPERACIÓN</small>
                  <strong>Comisiones + asesores + catálogo</strong>
                </div>
              </div>
              <div className="secondary-copy">
                <span>03 · MI RAÍZ</span>
                <h3>Una inmobiliaria, convertida en sistema.</h3>
                <p>Catálogo, operación, asesores y gestión comercial en una experiencia integrada.</p>
                <b>Ver proyecto <ArrowUpRight size={15}/></b>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="lab-standard">
        <div className="lab-standard-head">
          <p className="lab-kicker"><span /> EL ESTÁNDAR CÓMPLICE</p>
          <h2>Que se vea premium no es decoración.<br/><em>Es parte de cómo te eligen.</em></h2>
          <p>Diseñamos cada proyecto para que estrategia, percepción y operación trabajen juntas.</p>
        </div>

        <div className="lab-standard-orbit">
          <div className="standard-core">
            <span>CÓMPLICE</span>
            <strong>LAB</strong>
            <small>SISTEMA DE VALOR</small>
          </div>

          <article className="standard-card sc1">
            <span>01</span>
            <b>Dirección creativa</b>
            <p>Una identidad visual que se siente propia desde el primer segundo.</p>
          </article>
          <article className="standard-card sc2">
            <span>02</span>
            <b>Arquitectura comercial</b>
            <p>Cada bloque guía una decisión: entender, confiar, actuar.</p>
          </article>
          <article className="standard-card sc3">
            <span>03</span>
            <b>Tecnología útil</b>
            <p>Lo complejo sucede detrás; el cliente solo siente que todo funciona.</p>
          </article>
          <article className="standard-card sc4">
            <span>04</span>
            <b>Detalle obsesivo</b>
            <p>Movimiento, jerarquía, contraste, velocidad y consistencia.</p>
          </article>

          <div className="standard-orbit-ring r1"/><div className="standard-orbit-ring r2"/>
        </div>
      </section>

      <section className="lab-cta" id="contacto">
        <div className="lab-cta-mesh"/>
        <div className="lab-cta-disc"/>

        <div className="lab-cta-layout">
          <div className="lab-cta-copy">
            <p className="lab-kicker light"><span /> CÓMO HACEMOS TU DIAGNÓSTICO</p>
            <h2>Primero entendemos <em>qué está frenando tu crecimiento.</em></h2>
            <p>
              Llena esta información y podremos llegar a la conversación con contexto: quién eres, desde dónde nos escribes, qué vendes y qué problema quieres solucionar.
            </p>

            <div className="lab-cta-signals">
              <div><span>01</span><b>Entendemos tu situación</b></div>
              <div><span>02</span><b>Detectamos el cuello de botella</b></div>
              <div><span>03</span><b>Te proponemos una solución concreta</b></div>
            </div>

            <div className="lab-contact-badge">
              <div className="contact-dot"/>
              <div>
                <small>CONTACTO DIRECTO</small>
                <strong>WhatsApp · Cómplice Lab</strong>
              </div>
            </div>
          </div>

          <div className="lab-cta-form-wrap">
            <div className="lab-form-glow g1"/>
            <div className="lab-form-glow g2"/>
            <LeadCaptureForm />
          </div>
        </div>

        <div className="lab-cta-footer"><span>complicelab.com</span><span>Manizales · Colombia</span><span>Proyectos selectos</span></div>
      </section>
    </main>
  );
}
