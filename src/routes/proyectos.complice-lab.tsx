import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Gauge,
  Globe2,
  GraduationCap,
  Layers3,
  MonitorSmartphone,
  Palette,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export const Route = createFileRoute("/proyectos/complice-lab")({
  head: () => ({
    meta: [
      { title: "Cómplice Lab — Caso de Estudio | Cómplice Lab" },
      {
        name: "description",
        content:
          "Caso de estudio de Cómplice Lab: estrategia, branding, web, formación, analítica, SEO, medición, privacidad y ecosistema digital desarrollado desde cero.",
      },
      { property: "og:title", content: "Cómplice Lab — Caso de Estudio" },
      {
        property: "og:description",
        content:
          "Construimos nuestra propia marca como laboratorio de estrategia, creatividad, formación, tecnología e inteligencia artificial aplicada.",
      },
      { property: "og:url", content: "https://complicelab.com/proyectos/complice-lab" },
      { property: "og:image", content: "https://complicelab.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/proyectos/complice-lab" }],
  }),
  component: CompliceLabCase,
});

const whatsapp =
  "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Quiero%20hablar%20sobre%20un%20proyecto%20como%20Cómplice%20Lab.";

const capabilities = [
  ["Estrategia de marca", Target, "Definimos posicionamiento, propuesta, tono, oferta y arquitectura comercial."],
  ["Branding e identidad", Palette, "Construimos logo, paleta, lenguaje visual y sistema gráfico propio."],
  ["Web y UX/UI", MonitorSmartphone, "Diseñamos y desarrollamos una experiencia completa para desktop y mobile."],
  ["Formación", GraduationCap, "Creamos una oferta educativa práctica en IA, marketing, publicidad y herramientas digitales."],
  ["SEO", SearchCheck, "Estructura técnica, metadata, sitemap y páginas específicas para mejorar descubrimiento orgánico."],
  ["Medición", BarChart3, "Integramos GA4, Meta Pixel, eventos, conversiones y atribución UTM."],
  ["Privacidad", ShieldCheck, "Consentimiento de cookies, política de privacidad y términos integrados al sitio."],
  ["Casos y contenido", Layers3, "Construimos un sistema reusable para mostrar proyectos, casos y aprendizajes reales."],
] as const;

function CompliceHomeMockup() {
  return (
    <div className="case-browser clab-browser" aria-label="Representación de la web de Cómplice Lab">
      <div className="case-browser-bar">
        <div><i/><i/><i/></div><span>complicelab.com</span>
      </div>
      <div className="clab-ui">
        <header><BrandMark/><nav><span>Servicios</span><span>Creamos</span><span>Enseñamos</span><span>Implementamos</span></nav></header>
        <div className="clab-hero-ui">
          <div>
            <small>FORMACIÓN · PUBLICIDAD · CREATIVIDAD · IA</small>
            <h3>Aprende. Crea. Haz más. <em>Hazlo con IA.</em></h3>
            <p>Formación práctica y ejecución para marcas, emprendedores, profesionales, empresas y equipos.</p>
            <div className="clab-actions"><span>Quiero que lo hagan por mí</span><span>Quiero aprender</span></div>
          </div>
          <div className="clab-orbit">
            <div className="clab-core"><span>CÓMPLICE</span><b>LAB</b></div>
            <span className="clab-node n1">Branding</span>
            <span className="clab-node n2">Meta Ads</span>
            <span className="clab-node n3">Web</span>
            <span className="clab-node n4">Contenido</span>
            <span className="clab-node n5">IA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMockup() {
  return (
    <div className="clab-mobile-wrap">
      <div className="clab-phone">
        <div className="clab-phone-notch"/>
        <BrandMark/>
        <small>FORMACIÓN · PUBLICIDAD · CREATIVIDAD · IA</small>
        <h3>Aprende.<br/>Crea. Haz más.<br/><em>Hazlo con IA.</em></h3>
        <p>Formación práctica en inteligencia artificial, marketing y publicidad.</p>
        <span className="clab-phone-cta">Quiero que lo hagan por mí</span>
        <span className="clab-phone-ghost">Quiero aprender</span>
      </div>
      <div className="clab-phone clab-phone-projects">
        <div className="clab-phone-notch"/>
        <BrandMark/>
        <small>CASOS Y PROYECTOS</small>
        <h3>Proyectos que diseñamos, construimos e implementamos.</h3>
        <div className="clab-mini-card"><i/><i/><i/></div>
        <b>Camilo Respiro</b>
      </div>
    </div>
  );
}

function CompliceLabCase() {
  return (
    <div className="case-page clab-case">
      <header className="formation-nav case-nav">
        <div className="nav-wrap">
          <BrandMark/>
          <a className="formation-back" href="/#proyectos"><ArrowLeft size={16}/> Volver a proyectos</a>
          <a className="button button-sm" href={whatsapp} target="_blank" rel="noreferrer noopener">Hablemos</a>
        </div>
      </header>

      <main>
        <section className="case-hero">
          <div className="hero-grid" aria-hidden="true"/>
          <div className="container">
            <p className="eyebrow">CASO DE ESTUDIO · MARCA PROPIA</p>
            <div className="case-hero-grid">
              <div>
                <h1>Cómplice<br/><span>Lab</span></h1>
                <p className="case-hero-lead">
                  Construimos nuestra propia marca como laboratorio para unir estrategia, creatividad,
                  publicidad, formación, tecnología e inteligencia artificial aplicada.
                </p>
                <div className="case-service-tags">
                  {["Estrategia","Branding","Web","Formación","SEO","Analytics","Meta Pixel","Privacidad","Casos"].map(x=><span key={x}>{x}</span>)}
                </div>
              </div>
              <div className="case-metrics">
                <div><strong>3</strong><span>formas de trabajar: creamos, enseñamos e implementamos</span></div>
                <div><strong>2</strong><span>líneas principales: ejecución y formación</span></div>
                <div><strong>360°</strong><span>marca + web + medición + contenido</span></div>
                <div><strong>1</strong><span>ecosistema digital propio</span></div>
              </div>
            </div>
            <div className="case-hero-preview"><CompliceHomeMockup/></div>
          </div>
        </section>

        <section className="section">
          <div className="container case-story-grid">
            <div>
              <p className="eyebrow">EL RETO</p>
              <h2>Crear una agencia que no se sintiera como <span className="case-accent-blue">otra agencia más.</span></h2>
            </div>
            <div className="case-story-copy">
              <p>
                Cómplice Lab nació con una premisa clara: no repetir el modelo tradicional de agencia,
                sino construir una propuesta capaz de crear, enseñar e implementar.
              </p>
              <p>
                El desafío era convertir experiencia real en publicidad, negocios, creatividad y tecnología
                en una marca propia, con una presencia digital sólida y una oferta comprensible para personas,
                empresas y equipos.
              </p>
              <strong>La marca tenía que demostrar en sí misma la forma en que pensamos y ejecutamos.</strong>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">QUÉ CONSTRUIMOS</p>
              <h2>La marca también es <span className="case-accent-blue">nuestro laboratorio.</span></h2>
              <p>Cada parte del proyecto funciona como una demostración real de lo que hacemos con clientes y equipos.</p>
            </div>
            <div className="case-capabilities">
              {capabilities.map(([title,Icon,copy])=>(
                <article key={title}><Icon/><h3>{title}</h3><p>{copy}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">EXPERIENCIA DIGITAL</p>
              <h2>Desktop y mobile con el <span className="case-accent-blue">mismo lenguaje.</span></h2>
              <p>El sistema visual mantiene jerarquía, contraste y consistencia sin perder impacto en pantallas pequeñas.</p>
            </div>
            <MobileMockup/>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container case-system-grid">
            <div>
              <p className="eyebrow">TRES FORMAS DE TRABAJAR</p>
              <h2>Una marca. <span className="case-accent-blue">Tres caminos claros.</span></h2>
            </div>
            <div className="case-flow">
              {[
                ["01","Creamos","Lo hacemos por ti: branding, diseño, contenido, publicidad y web."],
                ["02","Enseñamos","Formación práctica para personas, equipos y organizaciones."],
                ["03","Implementamos","Estrategia, análisis y acompañamiento para construir contigo."],
              ].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p><ArrowRight/></article>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container case-tech-grid">
            <div>
              <p className="eyebrow">MEDICIÓN Y CRECIMIENTO</p>
              <h2>Una web bonita no basta. <span className="case-accent-blue">También debe medir.</span></h2>
              <p className="body-large">
                El sitio integra analítica, eventos, seguimiento de conversiones, consentimiento,
                estructura SEO y atribución para que la presencia digital tenga una base técnica real.
              </p>
            </div>
            <div className="case-stack">
              {["GA4","Meta Pixel","UTM","Search Console","SEO técnico","Consentimiento"].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}
              <p>La medición quedó integrada desde el inicio para poder tomar decisiones con datos cuando lleguen campañas y tráfico.</p>
            </div>
          </div>
        </section>

        <section className="case-result">
          <div className="container">
            <p className="eyebrow">EL RESULTADO</p>
            <h2>Una marca que funciona como <span>portafolio, producto, escuela y laboratorio.</span></h2>
            <div className="case-result-pills">
              <span><CheckCircle2/> Marca propia</span>
              <span><Sparkles/> IA aplicada</span>
              <span><BookOpenCheck/> Formación</span>
              <span><Gauge/> Medición</span>
              <span><Globe2/> Escalable online</span>
            </div>
          </div>
        </section>

        <section className="main-cta formation-cta">
          <div className="container">
            <p className="eyebrow">ESTO ES CÓMPLICE LAB</p>
            <h2>Aprende. Crea. Haz más. <span className="case-accent-light">Hazlo con IA.</span></h2>
            <p>Creamos, enseñamos e implementamos para ayudarte a avanzar con más claridad y mejores herramientas.</p>
            <div className="hero-actions">
              <a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer noopener">Hablemos <ArrowRight size={18}/></a>
              <a className="button button-outline-light" href="/formacion">Ver formación</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter/>
      <WhatsAppFloat/>
    </div>
  );
}
