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
          <p className="lab-kicker light"><span /> QUÉ CONSTRUIMOS</p>
          <h2>Un sistema que lleva a tu cliente<br/><em>de “te vi” a “quiero trabajar contigo”.</em></h2>
          <p>No son módulos aislados. Cada pieza empuja a la siguiente y todo termina conectado a un mismo objetivo comercial.</p>
        </div>

        <div className="lab-system-flow">
          <div className="lab-flow-line" />

          <article className="lab-flow-step attract">
            <div className="lab-flow-number">01</div>
            <div className="lab-flow-icon"><MousePointer2 size={22}/></div>
            <span>ATRAER</span>
            <h3>Presencia que llama la atención correcta.</h3>
            <p>Webs y landings con dirección visual, mensaje y estructura para que el prospecto entienda rápido por qué tú.</p>
            <div className="lab-flow-tags"><i>Web</i><i>Landing</i><i>Posicionamiento</i></div>
          </article>

          <article className="lab-flow-step convert">
            <div className="lab-flow-number">02</div>
            <div className="lab-flow-icon"><CalendarDays size={22}/></div>
            <span>CONVERTIR</span>
            <h3>Que la atención termine en una acción.</h3>
            <p>Agenda, WhatsApp, formularios, solicitudes y rutas de conversión sin fricción.</p>
            <div className="lab-flow-tags"><i>Citas</i><i>Leads</i><i>WhatsApp</i></div>
          </article>

          <article className="lab-flow-step manage">
            <div className="lab-flow-number">03</div>
            <div className="lab-flow-icon"><Workflow size={22}/></div>
            <span>GESTIONAR</span>
            <h3>Que ninguna oportunidad se pierda después del clic.</h3>
            <p>CRM, paneles, estados, seguimiento, cotizaciones y operación comercial en un mismo lugar.</p>
            <div className="lab-flow-tags"><i>CRM</i><i>Panel</i><i>Seguimiento</i></div>
          </article>

          <article className="lab-flow-step grow">
            <div className="lab-flow-number">04</div>
            <div className="lab-flow-icon"><Sparkles size={22}/></div>
            <span>CRECER</span>
            <h3>Menos trabajo repetitivo. Más capacidad para vender.</h3>
            <p>Automatizaciones y conexiones que aceleran respuestas, tareas internas y continuidad comercial.</p>
            <div className="lab-flow-tags"><i>Automatización</i><i>Integraciones</i><i>IA</i></div>
          </article>

          <div className="lab-flow-result">
            <div className="lab-flow-result-orb"><Network size={26}/></div>
            <div>
              <small>TODO CONECTA EN</small>
              <strong>UN SOLO SISTEMA</strong>
              <p>Tu presencia, tus contactos, tus citas y tu operación trabajando juntos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lab-projects" id="proyectos">
        <div className="lab-projects-head">
          <p className="lab-kicker"><span /> SISTEMAS QUE YA EXISTEN</p>
          <h2>Esto no es una promesa.<br/><span>Ya lo estamos construyendo.</span></h2>
          <p>Productos reales, pensados para negocios que necesitan vender, agendar, gestionar y crecer.</p>
        </div>

        <div className="lab-project-showcase">
          <a href="https://complicedental.com" target="_blank" rel="noreferrer" className="lab-project-card dental">
            <div className="project-glow" />
            <div className="project-ui">
              <div className="project-ui-bar"><i/><i/><i/></div>
              <div className="project-ui-shell">
                <div className="project-ui-side"/>
                <div className="project-ui-main">
                  <div className="project-ui-kpi"/><div className="project-ui-kpi"/><div className="project-ui-kpi"/>
                  <div className="project-ui-chart"/>
                </div>
              </div>
            </div>
            <div className="project-copy">
              <span>ECOSISTEMA PARA ODONTÓLOGOS</span>
              <h3>CÓMPLICE<br/>DENTAL</h3>
              <p>Web + CRM + citas + seguimiento + gestión comercial.</p>
              <b>Ver sistema <ArrowUpRight size={16}/></b>
            </div>
          </a>

          <a href="https://demo.complicedental.com" target="_blank" rel="noreferrer" className="lab-project-card showroom">
            <div className="project-grid-art"/>
            <div className="project-copy">
              <span>SHOWROOM INTERACTIVO</span>
              <h3>PROPUESTAS QUE SE VENDEN SOLAS</h3>
              <p>Demostraciones personalizadas para que cada profesional vea su futura experiencia antes de comprarla.</p>
              <b>Explorar showroom <ArrowUpRight size={16}/></b>
            </div>
          </a>

          <a href="https://miraiz.com.co" target="_blank" rel="noreferrer" className="lab-project-card raiz">
            <div className="project-rings"/>
            <div className="project-copy">
              <span>SISTEMA INMOBILIARIO</span>
              <h3>MI RAÍZ</h3>
              <p>Catálogo, gestión, comisiones, operación y presencia comercial en una sola experiencia.</p>
              <b>Ver proyecto <ArrowUpRight size={16}/></b>
            </div>
          </a>
        </div>
      </section>

      <section className="lab-standard">
        <div className="lab-standard-left">
          <p className="lab-kicker"><span /> EL ESTÁNDAR</p>
          <h2>Si tu servicio es premium, tu presencia no puede sentirse genérica.</h2>
        </div>
        <div className="lab-standard-stack">
          <div><span>01</span><b>Dirección creativa</b><p>Una idea visual que se siente propia, no una plantilla.</p></div>
          <div><span>02</span><b>Arquitectura comercial</b><p>Cada sección cumple una función dentro de la decisión.</p></div>
          <div><span>03</span><b>Tecnología visible e invisible</b><p>Lo complejo trabaja por debajo; para el cliente todo se siente simple.</p></div>
          <div><span>04</span><b>Detalle obsesivo</b><p>Microinteracciones, ritmo, jerarquía, respuesta y consistencia.</p></div>
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
