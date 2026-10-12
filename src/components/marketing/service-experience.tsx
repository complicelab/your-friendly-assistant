import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, Globe2, Layers3, MousePointer2, Play, Sparkles, Target, WandSparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { commercialServices, serviceHref, type CommercialService } from "@/data/commercial-services";
import "./service-experience.css";
import { peopleImages, photoForService } from "@/data/visual-story";

const visualLanguage: Record<string, { eyebrow: string; title: string; highlight: string; subtitle: string; punch: string; insight: string; elements: [string,string,string]; }> = {
  "paginas-web-manizales": {
    eyebrow: "PÁGINAS WEB PARA NEGOCIOS", title: "Haz que más personas conozcan tu negocio y", highlight: "te escriban más fácil.", subtitle: "Muestra lo que vendes, recibe preguntas por WhatsApp y facilita citas, pedidos o reservas desde un mismo lugar.", punch: "Deja de enviar clientes a una página que no los convence.", insight: "Tu próxima oportunidad puede comenzar con un clic.", elements: ["UNA MARCA QUE DESTACA","UNA EXPERIENCIA CLARA","UN SIGUIENTE PASO"],
  },
  "agencia-publicidad-manizales": {
    eyebrow: "IDEAS + ESTRATEGIA + PUBLICIDAD", title: "Tu negocio merece", highlight: "que más personas lo conozcan.", subtitle: "Creamos publicidad que explica por qué elegirte y anima a las personas interesadas a conocer tus productos o escribirte.", punch: "Que te vean no basta. Que te recuerden importa.", insight: "La creatividad sin estrategia hace ruido. Juntas generan dirección.", elements: ["DESCUBRIMOS TU DIFERENCIA","CREAMOS EL CONCEPTO","ACTIVAMOS TU MENSAJE"],
  },
  "marketing-digital-manizales": {
    eyebrow: "MÁS PERSONAS CONOCIENDO TU NEGOCIO", title: "Haz que las personas", highlight: "encuentren tu negocio.", subtitle: "Te ayudamos a organizar tus redes, publicidad y página web para que tus posibles clientes sepan qué ofreces y cómo contactarte.", punch: "Menos acciones aisladas. Más claridad para crecer.", insight: "El crecimiento no comienza publicando más. Comienza entendiendo mejor.", elements: ["ATRAER","CONECTAR","CONVERTIR"],
  },
  "publicidad-meta-ads": {
    eyebrow: "PUBLICIDAD EN FACEBOOK E INSTAGRAM", title: "Que más personas descubran", highlight: "lo que ofreces.", subtitle: "Promocionamos tus productos o servicios en Facebook e Instagram para acercarte a personas interesadas. Revisamos los resultados para mejorar.", punch: "Tu presupuesto necesita una estrategia, no improvisación.", insight: "Cada campaña tiene una hipótesis. Cada resultado, algo que enseñarnos.", elements: ["MENSAJE","AUDIENCIA","OPTIMIZACIÓN"],
  },
  "branding-identidad-marca": {
    eyebrow: "IDENTIDAD + ESTRATEGIA + DISEÑO", title: "Haz que tu negocio", highlight: "inspire confianza.", subtitle: "Creamos una imagen profesional y reconocible para que tus clientes recuerden tu negocio y sientan confianza desde el primer vistazo.", punch: "Que tu marca se vea como lo que quieres construir.", insight: "Primero definimos qué significa tu marca. Después cómo se ve.", elements: ["ESENCIA","IDENTIDAD","EXPRESIÓN"],
  },
  "diseno-grafico-publicitario": {
    eyebrow: "DISEÑO + MENSAJE + IMPACTO", title: "Muestra tus productos", highlight: "como se merecen.", subtitle: "Creamos imágenes, anuncios, catálogos y piezas que hacen que tus productos y servicios se vean atractivos y fáciles de entender.", punch: "Diseños que no solo se ven. Se entienden.", insight: "Una buena pieza comunica antes de que alguien termine de leer.", elements: ["CONCEPTO","COMPOSICIÓN","IMPACTO"],
  },
  "contenido-redes-sociales": {
    eyebrow: "REDES SOCIALES QUE CONECTAN", title: "Que tus redes dejen", highlight: "de pasar desapercibidas.", subtitle: "Te ayudamos con ideas, videos y publicaciones que muestran tus productos, cuentan tu historia y despiertan interés.", punch: "Más historias que vale la pena contar. Menos relleno.", insight: "El mejor contenido no empieza con la cámara. Empieza con una idea.", elements: ["IDEA","HISTORIA","ACCIÓN"],
  },
};
const cases = [
  { name: "B2Home", note: "Marca, estrategia y experiencia web", url: "/proyectos/b2home", tone:"blue" },
  { name: "Mi Raíz", note: "Identidad y plataforma digital", url: "/proyectos/mi-raiz", tone:"purple" },
  { name: "Camilo Respiro", note: "Marca y ecosistema digital", url: "/proyectos/camilo-respiro", tone:"cyan" },
];
function makeWhatsapp(service: CommercialService, context: string) {
  return "https://api.whatsapp.com/send?phone=573161772880&text=" + encodeURIComponent("Hola, vi el servicio de " + service.name + " en la web de Cómplice Lab. " + context + " ¿Podemos conversar?");
}
function Action({ service, children, context = "Quiero agendar un diagnóstico para mi negocio.", light = false }: { service: CommercialService; children: ReactNode; context?: string; light?: boolean }) {
  return <a className={light ? "sx-btn sx-btn-light" : "sx-btn"} href={makeWhatsapp(service,context)} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={19} aria-hidden="true"/></a>;
}
const getPhoto = (slug: string, index: number) => peopleImages[photoForService[slug]?.[index] ?? "entrepreneur"];
function CreativeVisual({ service }: {service:CommercialService}) {
  const main=getPhoto(service.slug,0);
  const secondary=getPhoto(service.slug,1);
  return <div className="sx-human-visual" aria-label="Fotografías ilustrativas de personas y negocios">
    <div className="sx-human-main"><img src={main.src} alt={main.alt} loading="eager" width={680} height={730}/></div>
    <div className="sx-human-secondary"><img src={secondary.src} alt={secondary.alt} loading="lazy" width={350} height={410}/></div>
    <div className="sx-human-message"><span>PARA TU NEGOCIO</span><strong>{service.slug==="paginas-web-manizales"?"Más consultas. Más posibilidades.":service.slug==="branding-identidad-marca"?"Que te reconozcan y te recuerden.":service.slug==="contenido-redes-sociales"?"Que tu contenido conecte.":service.slug==="publicidad-meta-ads"?"Que más personas conozcan tu negocio.":"Que tu negocio destaque."}</strong></div>
    <span className="sx-human-label">Fotografías ilustrativas</span>
  </div>;
}
export function ServiceExperience({service}: {service:CommercialService}) {
  const [openFaq,setOpenFaq]=useState<number|null>(0);
  const creative=visualLanguage[service.slug];
  const otherServices=commercialServices.filter(s=>s.slug!==service.slug).slice(0,3);
  return <div className={`sx-page sx-theme-${service.slug}`}>
    <header className="sx-header"><div className="sx-nav">
      <BrandMark/>
      <nav aria-label="Navegación de servicios"><a href="/">Inicio</a><a href="/#servicios">Servicios</a><a href="/#proyectos">Proyectos</a><a href="/formacion">Formación</a></nav>
      <Action service={service} context="Quiero información sobre este servicio.">Hablemos <span className="sx-desktop-only">de tu proyecto</span></Action>
    </div></header>
    <main>
      <section className="sx-hero"><div className="sx-hero-noise" aria-hidden="true"/>
        <div className="sx-wrap sx-hero-layout">
          <div className="sx-hero-copy">
            <div className="sx-eyebrow"><span className="sx-star">✳</span> {creative.eyebrow} <span className="sx-location">MANIZALES · COLOMBIA</span></div>
            <h1>{creative.title} <em>{creative.highlight}</em></h1>
            <p className="sx-lead">{creative.subtitle}</p>
            <div className="sx-hero-actions"><Action service={service}>{service.cta}</Action><a className="sx-secondary-link" href="#como-lo-hacemos">Descubre cómo lo hacemos <ArrowRight size={17}/></a></div>
            <div className="sx-microproof"><span className="sx-microproof-icon"><Check size={15}/></span> Te explicamos las opciones sin términos complicados.</div>
          </div>
          <CreativeVisual service={service}/>
        </div>
        <div className="sx-scroll-line"><span>DESCUBRE TU PRÓXIMO PASO</span><ChevronDown size={18}/></div>
      </section>
      <section className="sx-marquee" aria-label="Nuestra propuesta"><div>TU NEGOCIO <span>✳</span> TU MARCA <span>✳</span> TUS CLIENTES <span>✳</span> TU PRÓXIMO PASO</div></section>
      <section className="sx-section sx-promise" id="como-lo-hacemos"><div className="sx-wrap sx-promise-layout">
        <div><div className="sx-section-label"><span>01 / TU OPORTUNIDAD</span></div><h2>{creative.punch}</h2><p>{service.intro}</p><Action service={service}>Solicitar una propuesta</Action></div>
        <div className="sx-real-photo"><img src={getPhoto(service.slug,2).src} alt={peopleImages[(photoForService[service.slug]||["entrepreneur","teamwork","salon"])[2]].alt} loading="lazy" width={700} height={500}/><span>Tu negocio es el protagonista</span><small>Fotografía ilustrativa</small></div>
      </div></section>
      <section className="sx-section sx-offer" id="incluye"><div className="sx-wrap">
        <div className="sx-section-label"><span>02 / QUÉ PODEMOS CREAR</span><span>SOLUCIONES CONCRETAS SEGÚN LO QUE NECESITES</span></div>
        <div className="sx-offer-heading"><h2>¿Qué podemos hacer<br/><em>por tu negocio?</em></h2><p>{service.audience}</p></div>
        <div className="sx-offer-grid">{service.deliverables.map((item,i)=><article className={`sx-offer-tile sx-tile-${i+1}`} key={item}><span className="sx-tile-number">0{i+1} /</span><div className="sx-tile-glyph">{i===0?<Target/>:i===1?<Layers3/>:i===2?<Globe2/>:i===3?<MousePointer2/>:<Sparkles/>}</div><h3>{item}</h3><ArrowUpRight className="sx-tile-arrow" size={24}/></article>)}</div>
      </div></section>
      <section className="sx-statement"><div className="sx-wrap"><span>EL OBJETIVO</span><h2>“{creative.insight}”</h2><div className="sx-statement-line"/></div></section>
      <section className="sx-section sx-method"><div className="sx-wrap">
        <div className="sx-section-label"><span>03 / NUESTRO PROCESO</span><span>TE ACOMPAÑAMOS DESDE EL PRIMER MENSAJE</span></div>
        <div className="sx-method-layout"><div><h2>Así de sencillo.<br/><em>Hablemos y empecemos.</em></h2><p>Empezamos por conocer tu negocio. El alcance y los entregables se definen antes de comenzar.</p><Action service={service}>Empezar con un diagnóstico</Action></div>
        <div className="sx-steps">{service.process.map((step,i)=><div className="sx-step" key={step}><div className="sx-step-num">0{i+1}</div><div><span>ETAPA {i+1}</span><h3>{step}</h3></div><ChevronRight size={22}/></div>)}</div></div>
      </div></section>
      <section className="sx-section sx-work"><div className="sx-wrap">
        <div className="sx-section-label"><span>04 / PROYECTOS</span><span>ALGUNOS PROYECTOS EN LOS QUE HEMOS TRABAJADO</span></div>
        <div className="sx-work-heading"><h2>Mira lo que<br/><em>podemos construir.</em></h2><p>Conoce algunos de los proyectos que forman parte de nuestra experiencia creativa y digital.</p></div>
        <div className="sx-cases">{cases.map((item,i)=><a key={item.url} className={`sx-case sx-case-${item.tone}`} href={item.url}><div className="sx-case-art"><span className="sx-case-watermark">{item.name.slice(0,2).toUpperCase()}</span><div className="sx-case-grid"/><span className="sx-case-index">0{i+1} / PROYECTO</span></div><div className="sx-case-caption"><div><h3>{item.name}</h3><p>{item.note}</p></div><ArrowUpRight size={25}/></div></a>)}</div>
      </div></section>
      <section className="sx-section sx-faq"><div className="sx-wrap sx-faq-layout"><div><div className="sx-section-label"><span>05 / SIN VUELTAS</span></div><h2>Preguntas claras.<br/><em>Respuestas directas.</em></h2><p>Queremos que sepas qué esperar antes de comenzar.</p></div><div className="sx-faq-items">{service.questions.map(([q,a],i)=><div className={`sx-faq-item ${openFaq===i?"is-open":""}`} key={q}><button type="button" aria-expanded={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?null:i)}><span>{q}</span><ChevronDown size={21}/></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>
      <section className="sx-final"><div className="sx-final-orb" aria-hidden="true"/><div className="sx-wrap sx-final-inner"><div className="sx-section-label"><span>TU SIGUIENTE PASO COMIENZA AQUÍ</span></div><h2>Tu negocio puede<br/><em>dar el siguiente paso.</em></h2><p>Cuéntanos qué quieres lograr. Te ayudamos a identificar por dónde empezar y qué tiene sentido para tu negocio.</p><Action service={service} light>{service.cta}</Action><span className="sx-final-note">Conversamos sobre tu necesidad y definimos juntos los próximos pasos.</span></div></section>
      <section className="sx-related"><div className="sx-wrap"><div className="sx-section-label"><span>EXPLORA MÁS CÓMPLICE</span></div><h2>Tu próxima idea puede estar aquí.</h2><div className="sx-related-links">{otherServices.map(other=><a href={serviceHref(other.slug)} key={other.slug}><span>{other.name}</span><ArrowUpRight size={22}/></a>)}</div></div></section>
    </main><SiteFooter/><WhatsAppFloat/>
  </div>;
}
