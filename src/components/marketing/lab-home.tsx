import { useEffect, useRef, useState } from "react";
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
        <div className="lab-marquee">
          <span>NO HACEMOS WEBS PARA “ESTAR EN INTERNET”</span><i>✦</i>
          <span>DISEÑAMOS PARA SER ELEGIDOS</span><i>✦</i>
          <span>NO HACEMOS WEBS PARA “ESTAR EN INTERNET”</span><i>✦</i>
          <span>DISEÑAMOS PARA SER ELEGIDOS</span><i>✦</i>
        </div>
      </section>

      <section className="lab-manifesto" id="enfoque">
        <div className="lab-manifesto-orb" />

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

        <div className="lab-perception-panel">
          <div className="lab-perception-before">
            <span>ASÍ SE PIERDE UNA OPORTUNIDAD</span>
            <div className="lab-fake-search">
              <small>Especialista recomendado</small>
              <strong>Tu nombre aparece.</strong>
              <p>Pero la experiencia no confirma el nivel que prometes.</p>
            </div>
            <div className="lab-drop-row"><i/>Confianza <b>↓</b></div>
            <div className="lab-drop-row"><i/>Diferenciación <b>↓</b></div>
            <div className="lab-drop-row"><i/>Probabilidad de contacto <b>↓</b></div>
          </div>

          <div className="lab-perception-arrow">→</div>

          <div className="lab-perception-after">
            <span>LO QUE DEBERÍA PASAR</span>
            <div className="lab-signal-orb"><Sparkles size={20}/></div>
            <strong>“Se ve serio. Se ve diferente. Quiero hablar con ellos.”</strong>
            <p>Eso es lo que diseñamos: percepción que mueve a la acción.</p>
            <a href="#sistema">Ver cómo lo conectamos <ArrowUpRight size={14}/></a>
          </div>
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
          <h2>No hablamos de posibilidades.<br/><span>Mostramos lo que ya sabemos construir.</span></h2>
          <p>Tres sistemas, tres negocios distintos y una misma idea: que la tecnología ayude a vender, operar y crecer.</p>
        </div>

        <div className="lab-project-stage">
          <a href="https://complicedental.com" target="_blank" rel="noreferrer" className="lab-case-feature">
            <div className="case-feature-copy">
              <span>01 · HEALTH TECH / ODONTOLOGÍA</span>
              <h3>CÓMPLICE DENTAL</h3>
              <p>Un ecosistema para captar pacientes, agendar, gestionar contactos y hacer seguimiento desde un mismo sistema.</p>
              <div className="case-pills"><i>Web</i><i>CRM</i><i>Citas</i><i>Seguimiento</i></div>
              <b>Explorar sistema <ArrowUpRight size={16}/></b>
            </div>
            <div className="case-feature-ui">
              <div className="case-window">
                <div className="case-window-bar"><i/><i/><i/><span>dashboard.complicedental</span></div>
                <div className="case-window-body">
                  <div className="case-sidebar"><div/><div/><div/><div/></div>
                  <div className="case-dashboard">
                    <div className="case-kpis"><span/><span/><span/></div>
                    <div className="case-chart"><i/><i/><i/><i/><i/><i/></div>
                    <div className="case-list"><span/><span/><span/></div>
                  </div>
                </div>
              </div>
              <div className="case-floating-metric m1"><small>CONTACTOS</small><strong>CRM activo</strong></div>
              <div className="case-floating-metric m2"><small>FLUJO</small><strong>Citas →</strong></div>
            </div>
          </a>

          <div className="lab-case-side">
            <a href="https://demo.complicedental.com" target="_blank" rel="noreferrer" className="lab-case-mini showroom-v2">
              <div className="mini-browser">
                <div className="mini-browser-top"><i/><i/><i/></div>
                <div className="mini-browser-hero"/>
                <div className="mini-browser-grid"><span/><span/><span/></div>
              </div>
              <div className="mini-copy">
                <span>02 · SHOWROOM INTERACTIVO</span>
                <h3>Que el cliente vea su futuro antes de comprar.</h3>
                <p>Propuestas personalizadas con identidad, contenido y experiencia propia.</p>
                <b>Ver showroom <ArrowUpRight size={15}/></b>
              </div>
            </a>

            <a href="https://miraiz.com.co" target="_blank" rel="noreferrer" className="lab-case-mini raiz-v2">
              <div className="raiz-map">
                <div className="raiz-map-grid"/>
                <div className="raiz-pin p1"/><div className="raiz-pin p2"/><div className="raiz-pin p3"/>
                <div className="raiz-card"><small>OPERACIÓN</small><strong>Panel + catálogo + comisiones</strong></div>
              </div>
              <div className="mini-copy">
                <span>03 · REAL ESTATE SYSTEM</span>
                <h3>Mi Raíz</h3>
                <p>Un sistema inmobiliario con presencia comercial y operación integrada.</p>
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
        <p className="lab-kicker light"><span /> PRÓXIMO PROYECTO</p>
        <h2>Que tu primera impresión<br/><em>parezca una ventaja competitiva.</em></h2>
        <p>Cuéntanos qué vendes, a quién quieres atraer y qué debería empezar a pasar gracias a tu presencia digital.</p>
        <Magnetic href="https://wa.me/573161772880?text=Hola%20Cómplice%20Lab,%20quiero%20hablar%20sobre%20mi%20proyecto." className="lab-cta-button">
          Hablemos de tu proyecto <ArrowUpRight size={20}/>
        </Magnetic>
        <div className="lab-cta-footer"><span>complicelab.com</span><span>Manizales · Colombia</span><span>Proyectos selectos</span></div>
      </section>
    </main>
  );
}
