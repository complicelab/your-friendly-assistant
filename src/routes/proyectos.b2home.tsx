import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  Globe2,
  MessageCircleMore,
  MonitorSmartphone,
  Network,
  Palette,
  Route as RouteIcon,
  Settings2,
  Target,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export const Route = createFileRoute("/proyectos/b2home")({
  head: () => ({
    meta: [
      { title: "B2Home — Caso de Estudio | Cómplice Lab" },
      {
        name: "description",
        content:
          "Caso de estudio de B2Home: naming, branding, web, diagnóstico interactivo, calculadora comercial, estrategia, contenido y sistema digital para home services en Latinoamérica.",
      },
      { property: "og:title", content: "B2Home — Caso de Estudio | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Construimos desde cero una marca y sistema comercial digital para empresas de home services en Latinoamérica.",
      },
      { property: "og:url", content: "https://complicelab.com/proyectos/b2home" },
      { property: "og:image", content: "https://complicelab.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/proyectos/b2home" }],
  }),
  component: B2HomeCase,
});

const whatsapp =
  "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Quiero%20hablar%20sobre%20un%20proyecto%20digital%20como%20B2Home.";

const capabilities = [
  ["Naming y marca", Palette, "Nombre, logo, identidad visual y lenguaje de marca construidos desde cero."],
  ["Estrategia comercial", Target, "Posicionamiento, propuesta de valor, nichos, recorrido comercial y oferta."],
  ["Web responsive", MonitorSmartphone, "Sitio comercial completo diseñado para desktop y móvil."],
  ["Diagnóstico interactivo", Settings2, "Experiencia de preguntas para evaluar el proceso comercial del prospecto."],
  ["Calculadora", Calculator, "Herramienta de proyección para visualizar leads, ventas e ingresos estimados."],
  ["WhatsApp comercial", MessageCircleMore, "WhatsApp planteado como eje del proceso de conversación y seguimiento."],
  ["Arquitectura de ventas", RouteIcon, "Atracción, conversación, calificación, agenda, cierre y control conectados."],
  ["Contenido y redes", BarChart3, "Creación de redes, piezas, contenido y comunicación de marca."],
] as const;

function B2HomeMockup() {
  return (
    <div className="case-browser b2-browser" aria-label="Representación de la web de B2Home">
      <div className="case-browser-bar">
        <div><i/><i/><i/></div><span>be2home.co</span>
      </div>
      <div className="b2-ui">
        <header><b>b2home↗</b><nav><span>Sistema</span><span>Nichos</span><span>Calculadora</span><span>Diagnóstico</span></nav></header>
        <div className="b2-hero-ui">
          <div>
            <small>LATINOAMÉRICA · HOME SERVICES</small>
            <h3>El sistema de crecimiento <em>#1</em> para empresas de <i>home services</i> en Latinoamérica.</h3>
            <p>Marketing, WhatsApp comercial y proceso de ventas como un solo sistema medible.</p>
            <div className="b2-actions"><span>Agenda tu diagnóstico</span><span>Ver cómo funciona</span></div>
          </div>
          <div className="b2-panel">
            <small>PANEL B2HOME</small><b>Crecimiento del mes</b>
            <div className="b2-stats"><span>LEADS<strong>47</strong></span><span>VISITAS<strong>18</strong></span><span>COTIZACIONES<strong>12</strong></span><span>VENTAS<strong>6</strong></span></div>
            <div className="b2-bars">{[32,44,38,58,50,66,61,75,69,86].map((h,i)=><i key={i} style={{height:h+"%"}}/>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolsMockup() {
  return (
    <div className="b2-tools-grid">
      <div className="b2-tool-card">
        <small>DIAGNÓSTICO INTERACTIVO</small>
        <h3>¿Qué tan sano está tu proceso comercial?</h3>
        <p>6 preguntas · score personalizado</p>
        {["Solo referidos y boca a boca","Redes orgánicas, sin pauta","Pauta esporádica","Pauta constante y medida"].map(x=><span key={x}>{x}</span>)}
      </div>
      <div className="b2-tool-card">
        <small>CALCULADORA DE PROYECCIÓN</small>
        <h3>¿Cuántos leads podrías generar este mes?</h3>
        <div className="b2-calc-lines"><span>País <b>Colombia</b></span><span>Ciudad <b>Bogotá</b></span><span>Segmento <b>Persianas</b></span></div>
        <div className="b2-result-box"><small>PROYECCIÓN ESTIMADA</small><b>29</b><span>leads / mes</span></div>
      </div>
    </div>
  );
}

function B2HomeCase() {
  return (
    <div className="case-page b2-case">
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
            <p className="eyebrow">CASO DE ESTUDIO · NEGOCIO DIGITAL</p>
            <div className="case-hero-grid">
              <div>
                <h1>B2<br/><span>Home</span></h1>
                <p className="case-hero-lead">
                  Construimos desde cero una marca y sistema comercial digital pensado para empresas
                  de home services en Latinoamérica.
                </p>
                <div className="case-service-tags">
                  {["Naming","Branding","Estrategia","Web","UX/UI","Diagnóstico","Calculadora","Contenido","Redes"].map(x=><span key={x}>{x}</span>)}
                </div>
              </div>
              <div className="case-metrics">
                <div><strong>7</strong><span>mercados latinoamericanos contemplados por la propuesta</span></div>
                <div><strong>5</strong><span>nichos de home services</span></div>
                <div><strong>9</strong><span>piezas del sistema comercial</span></div>
                <div><strong>360°</strong><span>marca + producto + ventas</span></div>
              </div>
            </div>
            <div className="case-hero-preview"><B2HomeMockup/></div>
          </div>
        </section>

        <section className="section">
          <div className="container case-story-grid">
            <div>
              <p className="eyebrow">EL RETO</p>
              <h2>Convertir una idea en un <span className="case-accent-blue">negocio internacional.</span></h2>
            </div>
            <div className="case-story-copy">
              <p>
                B2Home nació como un proyecto propio de Cristian con una ambición clara: construir una
                propuesta especializada para empresas de servicios para el hogar, con una estructura
                comercial más profunda que una agencia tradicional.
              </p>
              <p>
                El proyecto exigía crear desde cero el nombre, la marca, el lenguaje visual, la web,
                las herramientas interactivas, la propuesta comercial, las redes y la arquitectura
                del negocio.
              </p>
              <strong>La meta era construir una marca lista para crecer en distintos mercados de Latinoamérica.</strong>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">QUÉ CONSTRUIMOS</p>
              <h2>Marca, estrategia y producto. <span className="case-accent-blue">Todo conectado.</span></h2>
              <p>El proyecto se planteó como un sistema comercial completo, no como una simple presencia web.</p>
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
              <p className="eyebrow">PRODUCTO DIGITAL</p>
              <h2>Herramientas que convierten la web en <span className="case-accent-blue">experiencia.</span></h2>
              <p>Diagnóstico y calculadora ayudan a que el usuario entienda su situación y visualice escenarios antes de hablar con el equipo.</p>
            </div>
            <ToolsMockup/>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container case-system-grid">
            <div>
              <p className="eyebrow">ARQUITECTURA DEL SISTEMA</p>
              <h2>Seis etapas. <span className="case-accent-blue">Un solo sistema medible.</span></h2>
            </div>
            <div className="case-flow">
              {[
                ["01","Atracción","Campañas y comunicación para atraer al comprador correcto."],
                ["02","Conversación","WhatsApp como eje del proceso comercial."],
                ["03","Calificación","Validación rápida del prospecto y su proyecto."],
                ["04","Conversión","Agenda de visita sin fricción."],
                ["05","Cierre","Cotización y seguimiento comercial."],
                ["06","Control","Métricas para entender el avance de cada etapa."],
              ].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p><ArrowRight/></article>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container case-tech-grid">
            <div>
              <p className="eyebrow">MERCADO Y ESCALA</p>
              <h2>Diseñado para <span className="case-accent-blue">Latinoamérica.</span></h2>
              <p className="body-large">
                La propuesta contempla Colombia, México, Ecuador, Perú, Chile, Bolivia y República Dominicana,
                adaptando el lenguaje comercial a categorías de home services y a mercados locales.
              </p>
            </div>
            <div className="case-stack">
              {["Persianas","Aire acondicionado","Cocinas & closets","Piscinas","Mobiliario","+ ciudades y zonas"].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}
              <p>La especialización por nicho permite estructurar mensajes, recorridos y herramientas con mayor contexto comercial.</p>
            </div>
          </div>
        </section>

        <section className="case-result">
          <div className="container">
            <p className="eyebrow">EL RESULTADO</p>
            <h2>De cero a una marca preparada para <span>competir más allá de un solo mercado.</span></h2>
            <div className="case-result-pills">
              <span><CheckCircle2/> Marca creada desde cero</span>
              <span><Network/> Sistema comercial</span>
              <span><Globe2/> Enfoque regional</span>
              <span><MonitorSmartphone/> Responsive</span>
            </div>
          </div>
        </section>

        <section className="main-cta formation-cta">
          <div className="container">
            <p className="eyebrow">¿TIENES UNA IDEA QUE QUIERES CONVERTIR EN NEGOCIO?</p>
            <h2>Las buenas ideas necesitan un <span className="case-accent-light">Cómplice.</span></h2>
            <p>Construimos marcas, productos digitales y sistemas pensados para operar de verdad.</p>
            <div className="hero-actions">
              <a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer noopener">Hablemos <ArrowRight size={18}/></a>
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
