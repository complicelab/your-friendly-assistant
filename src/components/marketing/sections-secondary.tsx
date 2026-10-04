import {
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  Lightbulb,
  MapPin,
  Network,
  Rocket,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

import { faqs, principles, projects } from "@/data/marketing";
import { SectionHeading } from "./brand";

export function AboutSection() {
  return (
    <section id="nosotros" className="section section-deep">
      <div className="container">
        <SectionHeading
          eyebrow="POR QUÉ CÓMPLICE LAB"
          title="No aprendimos esto solamente en un salón de clases."
          copy="Cómplice Lab nace de años de aprender, emprender, equivocarnos, volver a intentar y descubrir qué funciona realmente."
        />
        <p className="about-intro reveal">Detrás del Lab estamos Camilo y Cristian. Dos caminos diferentes que terminaron encontrándose alrededor de la publicidad, las marcas, los negocios, la tecnología y la enseñanza.</p>
        <div className="founders-grid">
          <article className="founder-card reveal">
            <div className="founder-avatar"><span>CM</span></div>
            <div><p className="eyebrow">CAMILO</p><h3>Publicista · Emprendedor · Estratega creativo</h3>
              <p>Camilo es publicista de profesión y emprendedor desde joven. Ha creado y participado en diferentes negocios. Algunos funcionaron y otros no, y precisamente esas experiencias le permitieron entender que emprender también significa probar, equivocarse, aprender y volver a construir.</p>
              <p>Con los años desarrolló habilidades en diferentes áreas creativas, publicitarias y empresariales, aprendiendo qué herramientas realmente aportan resultados.</p>
            </div>
          </article>
          <article className="founder-card reveal">
            <div className="founder-avatar"><span>CR</span></div>
            <div><p className="eyebrow">CRISTIAN</p><h3>Estrategia · Marcas · Publicidad · Tecnología</h3>
              <p>Cristian cuenta con más de 15 años de experiencia alrededor de la publicidad, el marketing, la creación de marcas y el desarrollo de proyectos.</p>
              <p>Aunque su formación profesional no comenzó directamente en publicidad, ha dedicado años a estudiar, experimentar y aplicar conocimientos relacionados con estrategia, comunicación, diseño, contenido, tecnología y negocios.</p>
            </div>
          </article>
        </div>
        <div className="joint-quote reveal"><span>Dos experiencias diferentes.</span><strong>Una misma obsesión: entender cómo hacer las cosas mejor.</strong><em>La teoría ayuda. Hacer las cosas es lo que realmente enseña.</em></div>
      </div>
    </section>
  );
}

export function EntrepreneurSection() {
  const jobs = ["Atiendes clientes.","Vendes.","Cotizas.","Publicas.","Tomas fotos.","Respondes mensajes.","Administras.","Diseñas.","Aprendes."];
  return (
    <section className="section">
      <div className="container entrepreneur-layout">
        <div>
          <SectionHeading eyebrow="ENTENDEMOS A QUIEN EMPRENDE" title="Sabemos que cuando estás empezando, haces de todo."/>
          <div className="job-cloud reveal">{jobs.map((job)=><span key={job}>{job}</span>)}</div>
        </div>
        <div className="entrepreneur-copy reveal">
          <p className="body-large">Y además se supone que debes aprender publicidad, redes sociales, diseño, inteligencia artificial y páginas web.</p>
          <h3>Por eso enseñamos herramientas que simplifican el trabajo.</h3>
          <p>Hoy existen herramientas gratuitas o accesibles que permiten investigar, generar ideas, diseñar, crear contenido, escribir y construir páginas en mucho menos tiempo.</p>
          <p>Nuestro trabajo es enseñarte cuáles utilizar, cuándo utilizarlas y cómo obtener mejores resultados.</p>
          <strong>No necesitas hacerlo todo solo. Necesitas mejores herramientas y alguien que te enseñe a utilizarlas.</strong>
        </div>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section id="proyectos" className="section section-deep">
      <div className="container">
        <SectionHeading
          eyebrow="PROYECTOS"
          title="Ideas que ya hemos convertido en realidad."
          copy="Proyectos propios y marcas donde hemos aplicado estrategia, creatividad, contenido, publicidad, tecnología y diseño."
        />
        <div className="projects-grid">
          {projects.map((project,index)=>(
            <article className={`project-card project-${index + 1} reveal`} key={project}>
              <div className="project-art" aria-hidden="true"><span>0{index + 1}</span><i/><i/></div>
              <div className="project-meta">
                <div><span>PROYECTO</span><h3>{project}</h3></div>
                <p>Categorías y caso de estudio preparados para completar posteriormente.</p>
                <span className="project-arrow"><ArrowRight/></span>
              </div>
            </article>
          ))}
        </div>
        <p className="project-note reveal">Estructura preparada para: EL RETO · QUÉ HICIMOS · EL PROCESO · EL RESULTADO</p>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    ["ENTENDEMOS","Tu idea, negocio, público y objetivo.", Search],
    ["PENSAMOS","Definimos la estrategia y el camino.", Lightbulb],
    ["POTENCIAMOS","Integramos herramientas de IA donde realmente generan valor.", Sparkles],
    ["EJECUTAMOS","Creamos, enseñamos o implementamos contigo.", Rocket],
  ] as const;
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="CÓMO TRABAJAMOS" title="De la idea a la ejecución."/>
        <div className="process-grid">
          {steps.map(([title,copy,Icon],index)=>(
            <article className="process-step reveal" key={title}>
              <div className="step-head"><span>0{index+1}</span><Icon size={19}/></div>
              <h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
        <p className="mega-line reveal">Menos complicaciones. <span>Más claridad.</span> Mejor ejecución.</p>
      </div>
    </section>
  );
}

export function ReachSection() {
  return (
    <section className="section section-reach">
      <div className="container reach-layout">
        <div>
          <SectionHeading eyebrow="MÁS ALLÁ DE MANIZALES" title="De Manizales para donde haya una buena idea."/>
          <p className="body-large reveal">Trabajamos con emprendedores, profesionales, marcas, negocios, empresas, equipos, instituciones y organizaciones.</p>
          <p className="reveal">Desarrollamos proyectos y formaciones de manera online y presencial. Queremos llevar nuestros talleres y experiencias a diferentes ciudades y municipios de Colombia.</p>
          <div className="reach-pills reveal"><span><MapPin/>MANIZALES</span><span><Compass/>COLOMBIA</span><span><Network/>ONLINE</span></div>
        </div>
        <div className="map-abstract reveal" aria-label="Manizales, Colombia y trabajo online">
          <div className="map-glow"/><span className="map-dot main-dot"/><span className="map-label">MANIZALES</span>
          <span className="map-dot dot-2"/><span className="map-dot dot-3"/><span className="map-dot dot-4"/>
          <svg viewBox="0 0 420 480" aria-hidden="true"><path d="M178 16 238 40 270 84 300 104 306 145 336 175 315 220 290 245 278 290 248 318 246 360 215 392 194 454 154 426 145 382 118 352 109 316 81 284 90 236 69 196 94 155 112 107 146 80Z"/></svg>
        </div>
      </div>
    </section>
  );
}

export function PrinciplesSection() {
  const icons=[Target,Sparkles,Check,Compass,Lightbulb];
  return (
    <section className="section section-deep">
      <div className="container">
        <SectionHeading eyebrow="POR QUÉ TRABAJAR CON NOSOTROS" title="Principios que guían cómo pensamos y cómo hacemos."/>
        <div className="principles-grid">
          {principles.map(([title,copy],index)=>{
            const Icon=icons[index] ?? Check;
            return <article className="principle reveal" key={title}><Icon/><span>0{index+1}</span><h3>{title}</h3><p>{copy}</p></article>
          })}
        </div>
      </div>
    </section>
  );
}

export function MainCtaSection() {
  return (
    <section id="contacto" className="main-cta">
      <div className="cta-orb" aria-hidden="true"/>
      <div className="container reveal">
        <p className="eyebrow">HABLEMOS</p>
        <h2>Las buenas ideas necesitan un Cómplice.</h2>
        <p>Cuéntanos qué quieres crear, aprender o implementar.</p>
        <div className="hero-actions">
          <a
            className="button button-light"
            href="https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Me%20interesa%20sus%20servicios%20de..."
            target="_blank"
            rel="noreferrer noopener"
          ><span>Hablar con Cómplice Lab</span><ArrowRight/></a>
          <a className="button button-outline-light" href="#servicios">Conocer nuestros servicios</a>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="section">
      <div className="container faq-layout">
        <SectionHeading eyebrow="FAQ" title="Preguntas frecuentes." copy="Respuestas claras antes de empezar."/>
        <div className="faq-list">
          {faqs.map(([question,answer])=>(
            <details className="faq-item reveal" key={question}>
              <summary>{question}<ChevronDown size={19}/></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
