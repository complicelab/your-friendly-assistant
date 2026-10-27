import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Layers3, MousePointer2, Sparkles, Workflow } from "lucide-react";
import "./lab-home.css";

const sectors = ["Odontología", "Cirugía", "Medicina", "Derecho", "Servicios premium"];
const outcomes = [
  { n: "01", title: "Que te encuentren", text: "Una presencia que transmite nivel, autoridad y claridad desde el primer segundo." },
  { n: "02", title: "Que confíen", text: "Diseño, mensaje y experiencia pensados para reducir dudas antes de la primera conversación." },
  { n: "03", title: "Que actúen", text: "Rutas claras para agendar, escribir, cotizar o iniciar un proceso comercial." },
  { n: "04", title: "Que no se pierdan", text: "Sistemas y automatizaciones para organizar contactos, seguimiento y oportunidades." },
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

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={"lab-tilt " + className}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
        el.style.setProperty("--rx", rx + "deg");
        el.style.setProperty("--ry", ry + "deg");
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--rx", "0deg");
        ref.current?.style.setProperty("--ry", "0deg");
      }}
    >
      {children}
    </div>
  );
}

export function LabHome() {
  usePointerGlow();
  const [menu, setMenu] = useState(false);

  return (
    <main className="lab-home">
      <div className="lab-pointer-light" />
      <header className="lab-nav">
        <a href="/" className="lab-logo"><img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab" /></a>
        <nav className={menu ? "is-open" : ""}>
          <a href="#enfoque">Enfoque</a>
          <a href="#sistema">Qué construimos</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Hablemos</a>
        </nav>
        <a className="lab-nav-cta" href="#contacto">Quiero elevar mi presencia <ArrowUpRight size={16}/></a>
        <button className="lab-menu" onClick={() => setMenu(!menu)} aria-label="Abrir menú">MENÚ</button>
      </header>

      <section className="lab-hero">
        <div className="lab-hero-copy">
          <p className="lab-kicker"><span /> PARA PROFESIONALES QUE NO PUEDEN VERSE COMO UNO MÁS</p>
          <h1>Tu reputación ya vale mucho.<br/><em>Tu presencia digital debería demostrarlo.</em></h1>
          <p className="lab-lead">Creamos páginas y sistemas digitales para profesionales de alto valor que necesitan convertir atención en confianza, citas y oportunidades reales de negocio.</p>
          <div className="lab-actions">
            <a href="#contacto" className="lab-primary">Quiero una propuesta <ArrowUpRight size={18}/></a>
            <a href="#sistema" className="lab-text-link">Ver cómo lo hacemos <span>↘</span></a>
          </div>
          <div className="lab-sector-rail">{sectors.map(x => <span key={x}>{x}</span>)}</div>
        </div>

        <div className="lab-hero-stage" aria-hidden="true">
          <div className="lab-orbit orbit-a" />
          <div className="lab-orbit orbit-b" />
          <div className="lab-core">
            <div className="lab-core-ring" />
            <strong>REPUTACIÓN</strong>
            <small>→ OPORTUNIDADES</small>
          </div>
          <div className="lab-float-card card-a"><MousePointer2 size={17}/><span>Te encuentran</span></div>
          <div className="lab-float-card card-b"><Sparkles size={17}/><span>Confían</span></div>
          <div className="lab-float-card card-c"><CalendarDays size={17}/><span>Agendan</span></div>
          <div className="lab-float-card card-d"><Workflow size={17}/><span>Das seguimiento</span></div>
          <div className="lab-coordinate">05°04'N · 75°31'W</div>
        </div>
      </section>

      <section className="lab-statement" id="enfoque">
        <p>NO VENDEMOS “UNA WEB”.</p>
        <h2>Construimos la experiencia que hace que alguien piense:</h2>
        <div className="lab-quote">“Estos sí están a mi nivel. <span>Quiero trabajar con ellos.</span>”</div>
      </section>

      <section className="lab-outcomes">
        <div className="lab-section-head">
          <p className="lab-kicker"><span /> EL SISTEMA</p>
          <h2>Antes de hablar contigo, tu cliente ya tomó varias decisiones.</h2>
          <p>Diseñamos cada punto digital para que esas decisiones jueguen a tu favor.</p>
        </div>
        <div className="lab-outcome-grid">
          {outcomes.map((o) => (
            <TiltCard key={o.n} className="lab-outcome">
              <span className="lab-num">{o.n}</span>
              <h3>{o.title}</h3>
              <p>{o.text}</p>
              <div className="lab-scan" />
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="lab-system" id="sistema">
        <div className="lab-system-sticky">
          <p className="lab-kicker"><span /> QUÉ CONSTRUIMOS</p>
          <h2>No piezas sueltas.<br/>Un ecosistema que trabaja junto.</h2>
        </div>
        <div className="lab-system-track">
          <article><b>01</b><Layers3/><h3>Páginas de alto impacto</h3><p>Webs y landing pages con narrativa, diseño y conversión pensados para servicios premium.</p></article>
          <article><b>02</b><Workflow/><h3>Sistemas comerciales</h3><p>CRM, paneles, formularios, agendas y flujos que organizan lo que pasa después del clic.</p></article>
          <article><b>03</b><Sparkles/><h3>Automatización útil</h3><p>Conectamos procesos para reducir tareas manuales y acelerar el seguimiento sin volverlo impersonal.</p></article>
        </div>
      </section>

      <section className="lab-difference">
        <div className="lab-difference-left">
          <span className="lab-big-index">/ 04</span>
          <h2>Tu cliente no compra tecnología.<br/><em>Compra tranquilidad, estatus, tiempo y resultados.</em></h2>
        </div>
        <div className="lab-difference-right">
          <p>Por eso no empezamos preguntando qué color te gusta. Empezamos entendiendo qué necesita creer, sentir y hacer la persona que te va a contratar.</p>
          <div className="lab-mini-rule"><span>ESTRATEGIA</span><span>DISEÑO</span><span>TECNOLOGÍA</span><span>CONVERSIÓN</span></div>
        </div>
      </section>

      <section className="lab-projects" id="proyectos">
        <div className="lab-section-head compact">
          <p className="lab-kicker"><span /> EXPERIENCIA</p>
          <h2>Diseñamos negocios digitales que se sienten hechos a medida.</h2>
        </div>
        <div className="lab-project-grid">
          <a href="/proyectos/complice-lab" className="lab-project p1"><span>Brand system / Web</span><strong>CÓMPLICE LAB</strong><i>Ver proyecto ↗</i></a>
          <a href="/proyectos/mi-raiz" className="lab-project p2"><span>Real estate system</span><strong>MI RAÍZ</strong><i>Ver proyecto ↗</i></a>
          <a href="/proyectos/b2home" className="lab-project p3"><span>Commerce experience</span><strong>B2 HOME</strong><i>Ver proyecto ↗</i></a>
        </div>
      </section>

      <section className="lab-cta" id="contacto">
        <div className="lab-cta-orbit"/>
        <p className="lab-kicker light"><span /> PRÓXIMO PROYECTO</p>
        <h2>Si eres excelente en lo que haces,<br/><em>haz que se note antes de decir una palabra.</em></h2>
        <p>Cuéntanos qué vendes, a quién quieres atraer y qué debería empezar a pasar gracias a tu presencia digital.</p>
        <a href="https://wa.me/573161772880?text=Hola%20Cómplice%20Lab,%20quiero%20hablar%20sobre%20mi%20proyecto." className="lab-cta-button">Hablemos de tu proyecto <ArrowUpRight size={20}/></a>
        <div className="lab-cta-footer"><span>complicelab.com</span><span>Manizales · Colombia</span><span>Proyectos selectos</span></div>
      </section>
    </main>
  );
}
