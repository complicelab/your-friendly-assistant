import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  CreditCard,
  Gauge,
  Layers3,
  MonitorSmartphone,
  Palette,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export const Route = createFileRoute("/proyectos/camilo-respiro")({
  head: () => ({
    meta: [
      { title: "Camilo Respiro — Caso de Estudio | Cómplice Lab" },
      {
        name: "description",
        content:
          "Caso de estudio de Camilo Respiro: marca, sitio web, campus educativo, membresías, pagos, back office, contenido y ecosistema digital desarrollado por Cómplice Lab.",
      },
      { property: "og:title", content: "Camilo Respiro — Caso de Estudio | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Construimos un ecosistema completo de formación en trading: marca, web, campus, membresías, pagos y back office.",
      },
      { property: "og:url", content: "https://complicelab.com/proyectos/camilo-respiro" },
      { property: "og:image", content: "https://complicelab.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://complicelab.com/proyectos/camilo-respiro" },
    ],
  }),
  component: CamiloRespiroCase,
});

const whatsapp =
  "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Quiero%20hablar%20sobre%20un%20proyecto%20digital%20como%20el%20de%20Camilo%20Respiro.";

const capabilities = [
  ["Marca e identidad", Palette, "Creación de logo, lenguaje visual y sistema gráfico desde cero."],
  ["Web comercial", MonitorSmartphone, "Arquitectura, diseño y desarrollo de la experiencia pública en desktop y móvil."],
  ["Campus privado", BookOpenCheck, "Programas, módulos, lecciones, videos y seguimiento del progreso del alumno."],
  ["Membresías", ShieldCheck, "Control de acceso, estados de membresía y desbloqueo de contenido."],
  ["Pagos y compras", CreditCard, "Flujo de compra y seguimiento conectado con el acceso a la plataforma."],
  ["Back office", Gauge, "Administración centralizada de alumnos, membresías, solicitudes, compras y soporte."],
  ["Gestión de alumnos", Users, "Herramientas internas para organizar usuarios y operación educativa."],
  ["Contenido y pauta", BarChart3, "Piezas, reels, producción audiovisual, redes sociales y Meta Ads."],
] as const;

function PublicSiteMockup() {
  return (
    <div className="case-browser case-browser-public" aria-label="Representación de la web pública de Camilo Respiro">
      <div className="case-browser-bar">
        <div><i/><i/><i/></div>
        <span>camilorespiro.com</span>
      </div>
      <div className="case-camilo-home">
        <header><b>camilo<br/>respiro</b><nav><span>Calculadora IC</span><span>Mi campus</span><span>Perfil</span></nav></header>
        <div className="case-camilo-ticker">SP500 · FLUJO DE OPCIONES · EXPOSICIÓN GAMMA · SESIÓN NUEVA YORK · MACROECONOMÍA</div>
        <div className="case-camilo-hero">
          <div>
            <small>DATA INSTITUCIONAL · MACROECONOMÍA</small>
            <h3>Aprende a ver <em>dónde está el dinero.</em> No solo el precio.</h3>
            <p>Trading visto desde el lado de los inversores institucionales.</p>
            <div><span>Unirme a la membresía</span><span>Ver el método</span></div>
          </div>
          <div className="case-market-card">
            <div><span>S&P 500 INDEX</span><b>SPX 7,605.10</b><em>▲ 0.28%</em></div>
            <div className="case-candles"><i/><i/><i/><i/><i/><i/><i/><i/></div>
            <svg viewBox="0 0 420 170" aria-hidden="true"><path d="M0 145 C55 140,40 110,89 113 S145 75,185 87 S232 45,277 62 S340 28,420 33"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampusMockup() {
  return (
    <div className="case-browser case-campus" aria-label="Representación del campus privado de Camilo Respiro">
      <div className="case-browser-bar"><div><i/><i/><i/></div><span>Campus privado</span></div>
      <div className="case-campus-ui">
        <header><b>camilo<br/>respiro</b><nav><span>Calculadora IC</span><span className="active">Mi campus</span><span>Perfil</span></nav></header>
        <section>
          <small>CAMPUS PRIVADO</small>
          <h3>Bienvenido de nuevo,<br/><em>camilo</em></h3>
          <p>Todo tu recorrido en un solo lugar.</p>
          <div className="case-progress-box"><small>TU PROGRESO</small><b>0</b><span>lecciones completadas</span></div>
        </section>
        <div className="case-membership-box"><b>MI MEMBRESÍA</b><p>Gestiona el acceso y continúa tus programas.</p><span>Reactivar membresía →</span></div>
        <div className="case-course-row"><div/><div/><div/></div>
      </div>
    </div>
  );
}

function AdminMockup() {
  return (
    <div className="case-browser case-admin" aria-label="Representación del back office de Camilo Respiro">
      <div className="case-browser-bar"><div><i/><i/><i/></div><span>Back office</span></div>
      <div className="case-admin-ui">
        <aside><b>camilo<br/>respiro</b>{["Resumen","Reuniones","Servicios","Solicitudes","Alumnos","Membresías","Compras","Testimonios","Soporte"].map((x,i)=><span className={i===0?"active":""} key={x}>{x}</span>)}</aside>
        <main>
          <small>BACK OFFICE</small><h3>Resumen</h3>
          <div className="case-admin-stats">
            {["INGRESOS","ALUMNOS APROBADOS","NUEVOS APROBADOS","MEMBRESÍAS"].map((x,i)=><div key={x}><span>{x}</span><b>{i===1?"43":i===2?"1":"—"}</b></div>)}
          </div>
          <div className="case-admin-wide"><b>Ingresos por producto/servicio</b><span>Panel de seguimiento operativo</span></div>
        </main>
      </div>
    </div>
  );
}

function MobileMockups() {
  return (
    <div className="case-mobile-pair">
      <div className="case-phone case-phone-home">
        <div className="case-phone-speaker"/>
        <b>camilo<br/>respiro</b>
        <small>DATA INSTITUCIONAL · MACROECONOMÍA</small>
        <h3>Aprende a ver <em>dónde está el dinero.</em></h3>
        <p>Una experiencia pensada para aprender y operar desde cualquier dispositivo.</p>
        <span className="case-phone-cta">Unirme a la membresía</span>
      </div>
      <div className="case-phone case-phone-course">
        <div className="case-phone-speaker"/>
        <small>CURSO</small>
        <h3>Forex Intradía / Swing</h3>
        <div className="case-video-card"><div>▶</div></div>
        <b>Trading desde cero</b>
        <span className="case-phone-cta">Marcar como vista</span>
        <div className="case-lesson-list"><i/><i/><i/><i/></div>
      </div>
    </div>
  );
}

function CamiloRespiroCase() {
  return (
    <div className="case-page">
      <header className="formation-nav case-nav">
        <div className="nav-wrap">
          <BrandMark />
          <a className="formation-back" href="/#proyectos"><ArrowLeft size={16}/> Volver a proyectos</a>
          <a className="button button-sm" href={whatsapp} target="_blank" rel="noreferrer noopener">Hablemos</a>
        </div>
      </header>

      <main>
        <section className="case-hero">
          <div className="hero-grid" aria-hidden="true"/>
          <div className="container">
            <p className="eyebrow">CASO DE ESTUDIO · PRODUCTO DIGITAL</p>
            <div className="case-hero-grid">
              <div>
                <h1>Camilo<br/><span>Respiro</span></h1>
                <p className="case-hero-lead">
                  Construimos un ecosistema completo de formación en trading: marca, web,
                  membresías, campus privado, pagos, back office y operación digital.
                </p>
                <div className="case-service-tags">
                  {["Branding","UX/UI","Web","Campus","Membresías","Pagos","Back office","Contenido","Meta Ads"].map(x=><span key={x}>{x}</span>)}
                </div>
              </div>
              <div className="case-metrics">
                <div><strong>+3.000</strong><span>estudiantes en la trayectoria de la marca</span></div>
                <div><strong>9</strong><span>años enseñando</span></div>
                <div><strong>5</strong><span>programas de formación</span></div>
                <div><strong>360°</strong><span>ecosistema digital</span></div>
              </div>
            </div>
            <div className="case-hero-preview"><PublicSiteMockup/></div>
          </div>
        </section>

        <section className="section">
          <div className="container case-story-grid">
            <div>
              <p className="eyebrow">EL RETO</p>
              <h2>Mucho más que una página para vender cursos.</h2>
            </div>
            <div className="case-story-copy">
              <p>
                Camilo Respiro necesitaba una plataforma propia capaz de conectar captación, venta,
                pago, acceso, formación y administración en una sola experiencia.
              </p>
              <p>
                El público principal incluye personas que comienzan en trading y personas ocupadas
                que buscan desarrollar una fuente adicional de ingresos. Eso exigía una experiencia
                clara, fácil de recorrer y funcional tanto en computador como en celular.
              </p>
              <strong>La solución debía sostener el negocio, no solamente presentarlo.</strong>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">QUÉ CONSTRUIMOS</p>
              <h2>Un sistema completo, no solo una web.</h2>
              <p>Diseñamos la marca y conectamos la experiencia comercial, educativa y administrativa.</p>
            </div>
            <div className="case-capabilities">
              {capabilities.map(([title,Icon,copy])=>(
                <article key={title}>
                  <Icon/>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section case-gallery-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">WEB · CAMPUS · BACK OFFICE</p>
              <h2>Tres experiencias. Un mismo ecosistema.</h2>
              <p>La estructura visual del caso está diseñada para mantener proporciones profesionales y adaptarse a proyectos con mucho o poco material.</p>
            </div>
            <div className="case-gallery">
              <article className="case-gallery-wide">
                <div className="case-gallery-head"><span>01</span><div><b>Sitio web público</b><p>Captación, posicionamiento y venta de la membresía.</p></div></div>
                <PublicSiteMockup/>
              </article>
              <article className="case-gallery-wide">
                <div className="case-gallery-head"><span>02</span><div><b>Campus privado</b><p>Acceso, continuidad de programas y progreso del alumno.</p></div></div>
                <CampusMockup/>
              </article>
              <article className="case-gallery-wide">
                <div className="case-gallery-head"><span>03</span><div><b>Back office</b><p>Operación, alumnos, membresías, compras y soporte.</p></div></div>
                <AdminMockup/>
              </article>
              <article className="case-gallery-mobile">
                <div className="case-gallery-head"><span>04</span><div><b>Experiencia móvil</b><p>Diseñada para conservar jerarquía y usabilidad en pantallas pequeñas.</p></div></div>
                <MobileMockups/>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container case-system-grid">
            <div>
              <p className="eyebrow">DE LA VISITA A LA OPERACIÓN</p>
              <h2>Un flujo conectado de principio a fin.</h2>
            </div>
            <div className="case-flow">
              {[
                ["01","Captación","Contenido, redes sociales, reels y Meta Ads."],
                ["02","Conversión","Web comercial y propuesta de membresía."],
                ["03","Pago","Compra integrada al acceso de la plataforma."],
                ["04","Formación","Campus, programas, lecciones y progreso."],
                ["05","Gestión","Back office para administrar la operación."],
              ].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p><ArrowRight/></article>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container case-tech-grid">
            <div>
              <p className="eyebrow">TECNOLOGÍA Y EJECUCIÓN</p>
              <h2>Estrategia humana. Herramientas modernas.</h2>
              <p className="body-large">
                El proyecto fue construido con un stack ágil que permitió integrar producto,
                operación y experiencia sin perder el criterio creativo y estratégico.
              </p>
            </div>
            <div className="case-stack">
              {["Lovable","Supabase","Claude","ChatGPT"].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}
              <p>La IA aceleró procesos. La estrategia, el diseño y las decisiones siguieron siendo humanas.</p>
            </div>
          </div>
        </section>

        <section className="case-result">
          <div className="container">
            <p className="eyebrow">EL RESULTADO</p>
            <h2>No construimos solo una página.<br/><span>Construimos el sistema digital que sostiene el negocio.</span></h2>
            <div className="case-result-pills">
              <span><CheckCircle2/> Plataforma propia</span>
              <span><Layers3/> Ecosistema integrado</span>
              <span><ShoppingCart/> Venta + formación</span>
              <span><MonitorSmartphone/> Responsive</span>
            </div>
          </div>
        </section>

        <section className="main-cta formation-cta">
          <div className="container">
            <p className="eyebrow">¿TIENES ALGO QUE QUIERES CONSTRUIR?</p>
            <h2>Las buenas ideas necesitan un Cómplice.</h2>
            <p>Creamos marcas, webs, plataformas y sistemas digitales pensados para vender, operar y crecer.</p>
            <div className="hero-actions">
              <a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer noopener">
                Hablemos <ArrowRight size={18}/>
              </a>
              <a className="button button-outline-light" href="/#proyectos">Ver más proyectos</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter/>
      <WhatsAppFloat/>
    </div>
  );
}
