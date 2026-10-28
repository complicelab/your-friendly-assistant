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

      <section className="clx-index-strip" aria-label="Posicionamiento">
        <span>ESTRATEGIA</span><i>✦</i>
        <span>DISEÑO</span><i>✦</i>
        <span>TECNOLOGÍA</span><i>✦</i>
        <span>CONVERSIÓN</span>
        <strong>NO HACEMOS WEBS PARA “ESTAR”. DISEÑAMOS PARA SER ELEGIDOS.</strong>
      </section>

      <section className="clx-problem" id="enfoque">
        <div className="clx-problem-copy">
          <p className="clx-eyebrow">EL PROBLEMA NO SIEMPRE ES TU SERVICIO</p>
          <h2>Puedes ser excelente<br/>y aun así <em>parecer reemplazable.</em></h2>
          <p className="clx-body">
            Antes de hablar contigo, una persona ya te encontró, te comparó y formó una impresión.
            Diseñamos esa experiencia para que tu nivel se entienda antes de que tengas que explicarlo.
          </p>
          <div className="clx-proof-lines">
            <span><b>01</b> Que entiendan por qué tú.</span>
            <span><b>02</b> Que sientan confianza antes de escribir.</span>
            <span><b>03</b> Que la oportunidad no se pierda después.</span>
          </div>
        </div>

        <div className="clx-perception-machine" aria-hidden="true">
          <div className="clx-orbital-disc disc-one"/>
          <div className="clx-orbital-disc disc-two"/>
          <div className="clx-perception-object">
            <small>PERCEPCIÓN</small>
            <strong>Tu presencia<br/>habla primero.</strong>
            <span>Y puede subir o bajar el valor que perciben.</span>
          </div>
          <div className="clx-float-note note-a"><small>TE ENCUENTRA</small><b>Primera impresión</b></div>
          <div className="clx-float-note note-b"><small>TE COMPARA</small><b>Valor percibido</b></div>
          <div className="clx-float-note note-c"><small>DECIDE</small><b>Confianza</b></div>
          <div className="clx-perception-pulse"/>
        </div>
      </section>

      <section className="clx-decisions">
        <div className="clx-decisions-intro">
          <p className="clx-eyebrow light">ANTES DEL PRIMER MENSAJE</p>
          <h2>Tu cliente ya está<br/><em>tomando decisiones.</em></h2>
          <p>Cada punto digital debe empujar una decisión distinta. No llenamos páginas: construimos secuencias.</p>
        </div>

        <div className="clx-decision-rail">
          <article>
            <span>01</span><MousePointer2 size={24}/>
            <h3>Te descubre</h3>
            <p>Una presencia que consigue atención correcta, no solo tráfico.</p>
          </article>
          <article>
            <span>02</span><Sparkles size={24}/>
            <h3>Te cree</h3>
            <p>Diseño, mensaje y prueba visual reducen la duda.</p>
          </article>
          <article>
            <span>03</span><CalendarDays size={24}/>
            <h3>Da el paso</h3>
            <p>Agendar, escribir o cotizar se vuelve obvio y simple.</p>
          </article>
          <article>
            <span>04</span><Workflow size={24}/>
            <h3>No se pierde</h3>
            <p>El sistema conserva contexto, seguimiento y oportunidad.</p>
          </article>
          <div className="clx-rail-light"/>
        </div>
      </section>

      <section className="clx-system" id="sistema">
        <div className="clx-system-head">
          <p className="clx-eyebrow">UN SISTEMA, NO PIEZAS SUELTAS</p>
          <h2>Por fuera se siente simple.<br/><em>Por dentro todo está conectado.</em></h2>
          <p>La persona ve una experiencia clara. Tu negocio recibe estructura, información y continuidad.</p>
        </div>

        <div className="clx-system-map">
          <div className="clx-map-core">
            <Network size={34}/>
            <strong>TU NEGOCIO</strong>
            <small>un solo sistema</small>
          </div>
          <div className="clx-map-node node-web"><Layers3 size={20}/><b>Web</b><span>atrae</span></div>
          <div className="clx-map-node node-lead"><MousePointer2 size={20}/><b>Lead</b><span>entra</span></div>
          <div className="clx-map-node node-book"><CalendarDays size={20}/><b>Cita</b><span>avanza</span></div>
          <div className="clx-map-node node-crm"><Workflow size={20}/><b>CRM</b><span>organiza</span></div>
          <div className="clx-map-node node-follow"><Sparkles size={20}/><b>Seguimiento</b><span>continúa</span></div>
          <svg className="clx-map-lines" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
            <path d="M120 180 C250 80 360 150 500 260" />
            <path d="M215 400 C310 320 390 340 500 260" />
            <path d="M500 260 C630 150 750 120 870 185" />
            <path d="M500 260 C640 350 750 375 875 390" />
          </svg>
          <div className="clx-map-beam"/>
        </div>
      </section>

      <section className="clx-projects" id="proyectos">
        <div className="clx-projects-head">
          <p className="clx-eyebrow">SISTEMAS REALES</p>
          <h2>No mostramos “portafolio”.<br/><em>Mostramos negocios funcionando.</em></h2>
        </div>

        <div className="clx-project-spread">
          <a className="clx-project-main" href="https://complicedental.com" target="_blank" rel="noreferrer">
            <div className="clx-project-copy">
              <span>01 / HEALTH TECH</span>
              <h3>CÓMPLICE<br/>DENTAL</h3>
              <p>Web, CRM, citas, seguimiento y gestión comercial para odontólogos.</p>
              <b>Explorar sistema <ArrowUpRight size={16}/></b>
            </div>
            <div className="clx-dental-ui">
              <div className="clx-window-bar"><i/><i/><i/><small>panel comercial</small></div>
              <div className="clx-dashboard-shell">
                <aside><i/><i/><i/><i/></aside>
                <div><span/><span/><span/><strong/><strong/></div>
              </div>
              <div className="clx-ui-chip chip-lead">Nuevo lead</div>
              <div className="clx-ui-chip chip-cita">Cita confirmada</div>
            </div>
          </a>

          <div className="clx-project-side">
            <a href="https://demo.complicedental.com" target="_blank" rel="noreferrer" className="clx-project-mini clx-showroom">
              <span>02 / SHOWROOM</span>
              <div className="clx-paper-stack"><i/><i/><i/></div>
              <h3>Que vea su futuro<br/>antes de comprar.</h3>
              <b>Ver showroom <ArrowUpRight size={15}/></b>
            </a>
            <a href="https://miraiz.com.co" target="_blank" rel="noreferrer" className="clx-project-mini clx-raiz">
              <span>03 / REAL ESTATE SYSTEM</span>
              <div className="clx-raiz-symbol"><i/><i/></div>
              <h3>Mi Raíz</h3>
              <p>Catálogo, asesores, comisiones y operación conectada.</p>
              <b>Ver proyecto <ArrowUpRight size={15}/></b>
            </a>
          </div>
        </div>
      </section>

      <section className="clx-standard">
        <div className="clx-standard-type">
          <p className="clx-eyebrow">EL ESTÁNDAR CÓMPLICE</p>
          <h2>Diseño que se ve.<br/>Estrategia que se siente.<br/><em>Tecnología que trabaja.</em></h2>
        </div>
        <div className="clx-standard-stage" aria-hidden="true">
          <div className="clx-standard-ring ring-a"/>
          <div className="clx-standard-ring ring-b"/>
          <div className="clx-standard-core"><span>CÓMPLICE</span><strong>LAB</strong></div>
          <div className="clx-standard-label sl1"><b>Dirección creativa</b><small>que no parece plantilla</small></div>
          <div className="clx-standard-label sl2"><b>Arquitectura comercial</b><small>cada bloque mueve una decisión</small></div>
          <div className="clx-standard-label sl3"><b>Tecnología útil</b><small>lo complejo sucede detrás</small></div>
          <div className="clx-standard-label sl4"><b>Detalle obsesivo</b><small>jerarquía, ritmo y consistencia</small></div>
        </div>
      </section>

      <section className="clx-contact" id="contacto">
        <div className="clx-contact-copy">
          <p className="clx-eyebrow light">CÓMO HACEMOS TU DIAGNÓSTICO</p>
          <h2>Antes de proponerte algo,<br/><em>entendemos qué está frenando tu crecimiento.</em></h2>
          <p>Cuéntanos quién eres, qué vendes y qué debería empezar a pasar. Llegamos a la conversación con contexto, no con un discurso genérico.</p>
          <div className="clx-contact-steps">
            <span><b>01</b> Entendemos tu situación.</span>
            <span><b>02</b> Detectamos el cuello de botella.</span>
            <span><b>03</b> Te proponemos una solución concreta.</span>
          </div>
        </div>
        <div className="clx-contact-form">
          <LeadCaptureForm />
        </div>
        <div className="clx-contact-orb orb-a"/><div className="clx-contact-orb orb-b"/>
      </section>
    </main>
  );
}
