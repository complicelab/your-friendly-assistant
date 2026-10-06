import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Compass,
  GraduationCap,
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
    <section id="nosotros" className="section section-deep founders-section">
      <div className="container">
        <div className="founders-heading reveal">
          <p className="eyebrow">NOSOTROS</p>
          <h2>Dos fundadores. <span>Una visión complementaria.</span></h2>
          <p>
            Experiencia para pensar, criterio para decidir y capacidad para ejecutar.
          </p>
        </div>

        <div className="founders-grid founders-grid-circles">
          <article className="founder-card founder-card-circle reveal">
            <div className="founder-avatar-wrap">
              <div className="founder-avatar-ring">
                <img
                  src="/founders/camilo-latest.webp"
                  alt="Camilo Moreno, cofundador de Cómplice Lab"
                  loading="lazy"
                />
              </div>
              <span className="founder-role-pill">COFUNDADOR</span>
            </div>

            <div className="founder-profile founder-profile-circle">
              <p className="founder-name">CAMILO MORENO</p>
              <h3>Publicista · Emprendedor · Estratega creativo</h3>
              <p className="founder-summary">
                Más de 15 años convirtiendo ideas en marcas, negocios y proyectos reales.
                Su experiencia combina visión publicitaria, criterio creativo y ejecución
                para construir propuestas que no se queden en el papel.
              </p>

              <div className="founder-badges founder-badges-circle">
                <div><BriefcaseBusiness size={19}/><strong>+15 años</strong><span>de experiencia</span></div>
                <div><GraduationCap size={19}/><strong>Publicista</strong><span>U. Católica de Manizales</span></div>
                <div><Rocket size={19}/><strong>Emprendedor</strong><span>negocios desde cero</span></div>
              </div>
            </div>
          </article>

          <article className="founder-card founder-card-circle reveal">
            <div className="founder-avatar-wrap">
              <div className="founder-avatar-ring">
                <div className="founder-avatar-clip founder-avatar-clip-cristian">
                  <img
                    src="/founders/cristian.jpg?v=20261005-final"
                    alt="Cristian Roman, cofundador de Cómplice Lab"
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="founder-role-pill">COFUNDADOR</span>
            </div>

            <div className="founder-profile founder-profile-circle">
              <p className="founder-name">CRISTIAN ROMAN</p>
              <h3>Estrategia · Marcas · Publicidad · Tecnología</h3>
              <p className="founder-summary">
                Más de 10 años conectando estrategia, comunicación y tecnología para transformar
                ideas en operaciones reales. Su enfoque está en entender el negocio, estructurarlo
                y llevarlo desde el concepto hasta una solución funcional.
              </p>

              <div className="founder-badges founder-badges-circle">
                <div><BriefcaseBusiness size={19}/><strong>+10 años</strong><span>de experiencia</span></div>
                <div><Rocket size={19}/><strong>Emprendedor</strong><span>negocios desde cero</span></div>
                <div><Network size={19}/><strong>Estrategia</strong><span>marcas + tecnología</span></div>
              </div>
            </div>
          </article>
        </div>

        <div className="founders-manifesto reveal">
          <p className="eyebrow">POR QUÉ CÓMPLICE</p>
          <h3>Sabemos lo que significa empezar con una idea y tener que aprender a hacer de todo.</h3>
          <p>
            Los dos hemos construido negocios desde cero. Hemos tenido que vender, diseñar,
            comunicar, aprender herramientas, tomar decisiones, equivocarnos y volver a intentar.
            Por eso Cómplice Lab no nace desde la teoría solamente: nace desde haber estado del
            otro lado de la mesa.
          </p>
          <strong>La experiencia nos enseñó. La tecnología nos permite hacer más. El criterio sigue siendo humano.</strong>
        </div>
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

function ProjectVisual({ visual, name }: { visual: string; name: string }) {
  if (visual === "camilo") {
    return (
      <div className="project-visual project-visual-camilo" aria-label="Vista previa del ecosistema digital Camilo Respiro">
        <div className="preview-browser">
          <div className="preview-browser-top"><i/><i/><i/><span>camilorespiro.com</span></div>
          <div className="preview-camilo-layout">
            <div>
              <b>camilo<br/>respiro</b>
              <small>DATA INSTITUCIONAL · MACROECONOMÍA</small>
              <strong>Aprende a ver<br/><em>dónde está el dinero.</em></strong>
              <span>Web · Campus · Membresías · Back office</span>
            </div>
            <div className="preview-chart">
              <i/><i/><i/><i/><i/><svg viewBox="0 0 220 100" aria-hidden="true"><path d="M0 82 C34 78, 30 58, 58 61 S88 39, 111 45 S139 20, 162 31 S194 8, 220 14"/></svg>
            </div>
          </div>
        </div>
        <div className="preview-phone">
          <div className="preview-phone-notch"/>
          <b>camilo<br/>respiro</b>
          <small>CAMPUS PRIVADO</small>
          <strong>Continúa donde<br/>lo dejaste</strong>
          <span/>
          <span/>
          <span/>
        </div>
      </div>
    );
  }


  if (visual === "home") {
    return (
      <div className="project-visual project-visual-b2home" aria-label="Vista previa del proyecto B2Home">
        <div className="b2-preview-browser">
          <div className="b2-preview-top"><i/><i/><i/><span>be2home.co</span></div>
          <div className="b2-preview-layout">
            <div className="b2-preview-copy">
              <b>b2home↗</b>
              <small>LATINOAMÉRICA · HOME SERVICES</small>
              <strong>El sistema de crecimiento para empresas de <em>home services.</em></strong>
              <span>Marketing · WhatsApp · Ventas</span>
            </div>
            <div className="b2-preview-panel">
              <small>PANEL B2HOME</small>
              <b>Crecimiento del mes</b>
              <div className="b2-preview-stats">
                <span>LEADS<strong>47</strong></span>
                <span>VISITAS<strong>18</strong></span>
                <span>COTIZACIONES<strong>12</strong></span>
                <span>VENTAS<strong>6</strong></span>
              </div>
              <div className="b2-preview-bars">
                <i/><i/><i/><i/><i/><i/><i/>
              </div>
            </div>
          </div>
        </div>
        <div className="b2-preview-phone">
          <div className="b2-preview-phone-notch"/>
          <b>b2home↗</b>
          <small>DIAGNÓSTICO</small>
          <strong>¿Qué tan sano está tu proceso comercial?</strong>
          <span/><span/><span/>
        </div>
      </div>
    );
  }


  if (visual === "brand") {
    return (
      <div className="project-visual project-visual-complice" aria-label="Vista previa del proyecto Cómplice Lab">
        <div className="clab-preview-browser">
          <div className="clab-preview-top"><i/><i/><i/><span>complicelab.com</span></div>
          <div className="clab-preview-layout">
            <div className="clab-preview-copy">
              <b>CÓMPLICE<br/><span>LAB</span></b>
              <small>FORMACIÓN · PUBLICIDAD · CREATIVIDAD · IA</small>
              <strong>Aprende. Crea. Haz más. <em>Hazlo con IA.</em></strong>
              <span>Creamos · Enseñamos · Implementamos</span>
            </div>
            <div className="clab-preview-orbit">
              <div><small>CÓMPLICE</small><b>LAB</b></div>
              <span className="p1">Branding</span>
              <span className="p2">Meta Ads</span>
              <span className="p3">Web</span>
              <span className="p4">Contenido</span>
            </div>
          </div>
        </div>
        <div className="clab-preview-phone">
          <div className="clab-preview-phone-notch"/>
          <b>CÓMPLICE<br/><span>LAB</span></b>
          <small>CASOS Y PROYECTOS</small>
          <strong>Proyectos que diseñamos, construimos e implementamos.</strong>
          <i/><i/>
        </div>
      </div>
    );
  }


  if (visual === "interiors") {
    return (
      <div className="project-visual project-visual-pb" aria-label="Vista previa del proyecto Persianas & Black Out">
        <div className="pb-preview-browser">
          <div className="pb-preview-top">
            <i/><i/><i/><span>persianasyblackout.com</span>
          </div>
          <div className="pb-preview-scene">
            <div className="pb-preview-copy">
              <div className="pb-preview-logo">
                <span>P&amp;B</span>
                <small>PERSIANAS &amp; BLACK OUT</small>
              </div>
              <em>ESPACIOS QUE INSPIRAN</em>
              <strong>Persianas <b>&amp;</b> Black Out</strong>
              <p>Control de luz, privacidad y diseño para cada espacio.</p>
              <div className="pb-preview-button">Ver productos <b>→</b></div>
            </div>
            <div className="pb-preview-room">
              <div className="pb-preview-window">
                <span/><span/><span/>
              </div>
              <div className="pb-preview-sofa"><i/><i/><i/></div>
              <div className="pb-preview-table"><i/></div>
              <div className="pb-preview-light"/>
            </div>
          </div>
          <div className="pb-preview-benefits">
            <span><b>☼</b> Control de luz</span>
            <span><b>◉</b> Privacidad</span>
            <span><b>◇</b> Diseño a tu medida</span>
          </div>
        </div>

        <div className="pb-preview-phone">
          <div className="pb-preview-notch"/>
          <div className="pb-phone-logo"><span>P&amp;B</span><small>PERSIANAS &amp; BLACK OUT</small></div>
          <div className="pb-phone-room">
            <div className="pb-phone-slats"/>
            <div className="pb-phone-chair"/>
          </div>
          <small>CONFORT EN CADA DETALLE</small>
          <strong>Persianas <em>&amp; Black Out</em></strong>
          <div className="pb-phone-cta">Cotizar ahora <b>→</b></div>
        </div>
      </div>
    );
  }

  if (visual === "roots") {
    return (
      <div className="project-visual project-visual-miraiz" aria-label="Vista previa del proyecto Mi Raíz">
        <div className="miraiz-preview-browser">
          <div className="miraiz-preview-top"><i/><i/><i/><span>miraiz.com.co</span></div>
          <div className="miraiz-preview-layout">
            <div className="miraiz-preview-copy">
              <b><span>M</span>miraiz</b>
              <small>MANIZALES · PEREIRA · ARMENIA</small>
              <strong>Encuentra tu hogar en el Eje Cafetero</strong>
              <span>Compra · Arriendo · Hipotecas · Avalúos</span>
              <div className="miraiz-preview-search"><i/><i/><i/><b>Buscar</b></div>
            </div>
            <div className="miraiz-preview-admin">
              <small>DASHBOARD</small>
              <b>Operación inmobiliaria</b>
              <div><span>LIBRES<strong>30</strong></span><span>NEGOCIOS<strong>1</strong></span><span>ASESORES<strong>•</strong></span><span>AGENDA<strong>•</strong></span></div>
            </div>
          </div>
        </div>
        <div className="miraiz-preview-phone">
          <div className="miraiz-preview-phone-notch"/>
          <b><span>M</span>miraiz</b>
          <small>INMUEBLES</small>
          <strong>Gestiona propiedades y procesos</strong>
          <i/><i/><i/>
        </div>
      </div>
    );
  }


  if (visual === "pulse") {
    return (
      <div className="project-visual project-visual-pulso" aria-label="Vista previa del proyecto Pulso Data">
        <div className="pulso-preview-browser">
          <div className="pulso-preview-top"><i/><i/><i/><span>pulsodt.com</span></div>
          <div className="pulso-preview-layout">
            <div className="pulso-preview-copy">
              <b><em>Pulso</em><span>data</span></b>
              <small>FLUJO · EARNINGS · MACRO</small>
              <strong>Lee el mercado antes de operar.</strong>
              <span>Opciones · Earnings · FRED · Contexto</span>
            </div>
            <div className="pulso-preview-panel">
              <small>CONTEXTO DEL DÍA · _SPX</small>
              <b>Flujo de Opciones</b>
              <div className="pulso-preview-bars">
                <i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/>
              </div>
              <div className="pulso-preview-tags"><span>GEX</span><span>DEX</span><span>Gamma</span></div>
            </div>
          </div>
        </div>
        <div className="pulso-preview-phone">
          <div className="pulso-preview-phone-notch"/>
          <b><em>Pulso</em><span>data</span></b>
          <small>EARNINGS</small>
          <strong>Apple Inc. (AAPL)</strong>
          <div><span>$333.60</span><span>4.5%</span></div>
          <i/><i/>
        </div>
      </div>
    );
  }

return (
    <div className={`project-visual project-visual-fallback visual-${visual}`} aria-label={`Vista conceptual de ${name}`}>
      <div className="fallback-grid"/>
      <span className="fallback-kicker">CÓMPLICE LAB · PROYECTO</span>
      <strong>{name}</strong>
      <div className="fallback-orb"/>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="proyectos" className="section section-deep">
      <div className="container">
        <SectionHeading
          eyebrow="CASOS Y PROYECTOS"
          title="Proyectos que diseñamos, construimos e implementamos."
          copy="Marcas, webs, plataformas y ecosistemas digitales desarrollados con una estructura visual preparada para mostrar cada caso con la profundidad que realmente tenga."
        />
        <div className="projects-grid projects-grid-pro">
          {projects.map((project,index)=>{
            const content = (
              <>
                <ProjectVisual visual={project.visual} name={project.name} />
                <div className="project-meta project-meta-pro">
                  <div>
                    <span>{project.category}</span>
                    <h3>{project.name}</h3>
                  </div>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.services.map((service)=><span key={service}>{service}</span>)}
                  </div>
                  <span className="project-arrow" aria-hidden="true"><ArrowRight/></span>
                </div>
              </>
            );

            return project.href ? (
              <a className={`project-card project-card-pro project-${index + 1} reveal`} key={project.name} href={project.href} aria-label={`Ver caso de estudio de ${project.name}`}>
                {content}
              </a>
            ) : (
              <article className={`project-card project-card-pro project-${index + 1} reveal`} key={project.name}>
                {content}
              </article>
            );
          })}
        </div>
        <p className="project-note reveal">Cada caso puede crecer con imágenes, proceso, funcionalidades y resultados sin romper la consistencia visual del portafolio.</p>
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
