import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, Globe2, Layers3, MousePointer2, Play, Sparkles, Target, WandSparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { commercialServices, serviceHref, type CommercialService } from "@/data/commercial-services";
import "./service-experience.css";

const visualLanguage: Record<string, { eyebrow: string; title: string; highlight: string; subtitle: string; punch: string; insight: string; elements: [string,string,string]; }> = {
  "paginas-web-manizales": {
    eyebrow: "DISEÑO WEB + EXPERIENCIA + CONVERSIÓN", title: "Tu negocio merece una web que", highlight: "trabaje por ti.", subtitle: "No otra página bonita que nadie usa. Diseñamos experiencias que muestran tu valor y facilitan que te contacten, compren o reserven.", punch: "Deja de enviar clientes a una página que no los convence.", insight: "Tu próxima oportunidad puede comenzar con un clic.", elements: ["UNA MARCA QUE DESTACA","UNA EXPERIENCIA CLARA","UN SIGUIENTE PASO"],
  },
  "agencia-publicidad-manizales": {
    eyebrow: "IDEAS + ESTRATEGIA + PUBLICIDAD", title: "No necesitas más anuncios.", highlight: "Necesitas mejores ideas.", subtitle: "Convertimos lo que hace diferente a tu marca en mensajes, experiencias y campañas que merezcan atención.", punch: "Que te vean no basta. Que te recuerden importa.", insight: "La creatividad sin estrategia hace ruido. Juntas generan dirección.", elements: ["DESCUBRIMOS TU DIFERENCIA","CREAMOS EL CONCEPTO","ACTIVAMOS TU MENSAJE"],
  },
  "marketing-digital-manizales": {
    eyebrow: "ESTRATEGIA + CANALES + DECISIONES", title: "Que cada canal tenga", highlight: "un propósito.", subtitle: "Conectamos tus mensajes, contenidos y campañas para que el camino entre descubrir tu negocio y contactarte sea más sencillo.", punch: "Menos acciones aisladas. Más claridad para crecer.", insight: "El crecimiento no comienza publicando más. Comienza entendiendo mejor.", elements: ["ATRAER","CONECTAR","CONVERTIR"],
  },
  "publicidad-meta-ads": {
    eyebrow: "META ADS + CREATIVIDAD + MEDICIÓN", title: "No se trata de gastar en anuncios.", highlight: "Se trata de tener dirección.", subtitle: "Desarrollamos campañas de Facebook e Instagram con una oferta clara, piezas relevantes y decisiones basadas en datos.", punch: "Tu presupuesto necesita una estrategia, no improvisación.", insight: "Cada campaña tiene una hipótesis. Cada resultado, algo que enseñarnos.", elements: ["MENSAJE","AUDIENCIA","OPTIMIZACIÓN"],
  },
  "branding-identidad-marca": {
    eyebrow: "IDENTIDAD + ESTRATEGIA + DISEÑO", title: "Una marca no es solo un logo.", highlight: "Es lo que haces sentir.", subtitle: "Diseñamos marcas con personalidad, coherencia y una idea que las personas puedan reconocer y recordar.", punch: "Que tu marca se vea como lo que quieres construir.", insight: "Primero definimos qué significa tu marca. Después cómo se ve.", elements: ["ESENCIA","IDENTIDAD","EXPRESIÓN"],
  },
  "diseno-grafico-publicitario": {
    eyebrow: "DISEÑO + MENSAJE + IMPACTO", title: "No es llenar espacios.", highlight: "Es captar miradas.", subtitle: "Hacemos diseño publicitario que organiza ideas, comunica beneficios y le da carácter a cada punto de contacto con tu marca.", punch: "Diseños que no solo se ven. Se entienden.", insight: "Una buena pieza comunica antes de que alguien termine de leer.", elements: ["CONCEPTO","COMPOSICIÓN","IMPACTO"],
  },
  "contenido-redes-sociales": {
    eyebrow: "IDEAS + REELS + STORYTELLING", title: "No publiques por publicar.", highlight: "Haz que importe.", subtitle: "Transformamos ideas en guiones, contenido y reels que conectan la personalidad de tu marca con las personas que quieres alcanzar.", punch: "Más historias que vale la pena contar. Menos relleno.", insight: "El mejor contenido no empieza con la cámara. Empieza con una idea.", elements: ["IDEA","HISTORIA","ACCIÓN"],
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
function CreativeVisual({ service }: {service:CommercialService}) {
  const content=visualLanguage[service.slug];
  const visualType=service.slug;
  return <div className={`sx-visual sx-visual-${visualType}`} aria-label={`Representación visual conceptual de ${service.name}`}>
    <div className="sx-visual-orbit sx-orbit-one"/><div className="sx-visual-orbit sx-orbit-two"/>
    <div className="sx-visual-glow"/>
    <div className="sx-visual-top"><span className="sx-live-dot"/> CÓMPLICE / CREATIVE STUDIO <span>↗ 2026</span></div>
    <div className="sx-showcase">
      <div className="sx-showcase-overline">ESTRATEGIA & CREATIVIDAD</div>
      <div className="sx-showcase-mark">{service.slug==="paginas-web-manizales" ? <Globe2/> : service.slug==="publicidad-meta-ads" ? <Target/> : service.slug==="contenido-redes-sociales" ? <Play/> : service.slug==="branding-identidad-marca" ? <Sparkles/> : <WandSparkles/>}</div>
      <div className="sx-showcase-type">{content.elements[0]}<span>{content.elements[1]}</span><strong>{content.elements[2]}</strong></div>
      <div className="sx-showcase-progress"><span/><span/><span/></div>
      <div className="sx-floating-chip sx-chip-a"><MousePointer2 size={16}/> DISEÑO CON INTENCIÓN</div>
      <div className="sx-floating-chip sx-chip-b"><Layers3 size={16}/> CÓMPLICE LAB</div>
    </div>
    <div className="sx-visual-bottom"><span>UNA IDEA. MUCHAS POSIBILIDADES.</span><span>01 / 07</span></div>
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
      <Action service={service} context="Quiero hablar de este servicio.">Hablemos <span className="sx-desktop-only">de tu proyecto</span></Action>
    </div></header>
    <main>
      <section className="sx-hero"><div className="sx-hero-noise" aria-hidden="true"/>
        <div className="sx-wrap sx-hero-layout">
          <div className="sx-hero-copy">
            <div className="sx-eyebrow"><span className="sx-star">✳</span> {creative.eyebrow} <span className="sx-location">MANIZALES · COLOMBIA</span></div>
            <h1>{creative.title} <em>{creative.highlight}</em></h1>
            <p className="sx-lead">{creative.subtitle}</p>
            <div className="sx-hero-actions"><Action service={service}>{service.cta}</Action><a className="sx-secondary-link" href="#como-lo-hacemos">Descubre cómo lo hacemos <ArrowRight size={17}/></a></div>
            <div className="sx-microproof"><span className="sx-microproof-icon"><Check size={15}/></span> Estrategia, criterio humano e IA aplicada donde aporta valor.</div>
          </div>
          <CreativeVisual service={service}/>
        </div>
        <div className="sx-scroll-line"><span>DESCUBRE TU PRÓXIMO PASO</span><ChevronDown size={18}/></div>
      </section>
      <section className="sx-marquee" aria-label="Nuestra propuesta"><div>C R E A M O S <span>✳</span> E N S E Ñ A M O S <span>✳</span> I M P L E M E N T A M O S <span>✳</span> C R E A M O S <span>✳</span> E N S E Ñ A M O S</div></section>
      <section className="sx-section sx-promise" id="como-lo-hacemos"><div className="sx-wrap sx-promise-layout">
        <div><div className="sx-section-label"><span>01 / TU OPORTUNIDAD</span></div><h2>{creative.punch}</h2><p>{service.intro}</p><Action service={service}>Solicitar una propuesta</Action></div>
        <div className="sx-promise-art"><div className="sx-promise-ring"><span>DE LA IDEA</span><strong>A LA ACCIÓN</strong><ArrowUpRight size={38}/></div><div className="sx-art-corner">CÓMPLICE LAB ®</div></div>
      </div></section>
      <section className="sx-section sx-offer" id="incluye"><div className="sx-wrap">
        <div className="sx-section-label"><span>02 / QUÉ PODEMOS CREAR</span><span>PARA MARCAS QUE QUIEREN AVANZAR ↗</span></div>
        <div className="sx-offer-heading"><h2>Menos discurso.<br/><em>Más posibilidades.</em></h2><p>{service.audience}</p></div>
        <div className="sx-offer-grid">{service.deliverables.map((item,i)=><article className={`sx-offer-tile sx-tile-${i+1}`} key={item}><span className="sx-tile-number">0{i+1} /</span><div className="sx-tile-glyph">{i===0?<Target/>:i===1?<Layers3/>:i===2?<Globe2/>:i===3?<MousePointer2/>:<Sparkles/>}</div><h3>{item}</h3><ArrowUpRight className="sx-tile-arrow" size={24}/></article>)}</div>
      </div></section>
      <section className="sx-statement"><div className="sx-wrap"><span>UNA IDEA PARA RECORDAR</span><h2>“{creative.insight}”</h2><div className="sx-statement-line"/></div></section>
      <section className="sx-section sx-method"><div className="sx-wrap">
        <div className="sx-section-label"><span>03 / NUESTRO PROCESO</span><span>DE LA PRIMERA CONVERSACIÓN A LA ENTREGA</span></div>
        <div className="sx-method-layout"><div><h2>No improvisamos.<br/><em>Construimos contigo.</em></h2><p>Empezamos por conocer tu negocio. El alcance y los entregables se definen antes de comenzar.</p><Action service={service}>Empezar con un diagnóstico</Action></div>
        <div className="sx-steps">{service.process.map((step,i)=><div className="sx-step" key={step}><div className="sx-step-num">0{i+1}</div><div><span>ETAPA {i+1}</span><h3>{step}</h3></div><ChevronRight size={22}/></div>)}</div></div>
      </div></section>
      <section className="sx-section sx-work"><div className="sx-wrap">
        <div className="sx-section-label"><span>04 / PROYECTOS</span><span>IDEAS QUE SE HAN CONVERTIDO EN PROYECTOS ↗</span></div>
        <div className="sx-work-heading"><h2>Lo que hacemos<br/><em>también habla por nosotros.</em></h2><p>Conoce algunos de los proyectos que forman parte de nuestra experiencia creativa y digital.</p></div>
        <div className="sx-cases">{cases.map((item,i)=><a key={item.url} className={`sx-case sx-case-${item.tone}`} href={item.url}><div className="sx-case-art"><span className="sx-case-watermark">{item.name.slice(0,2).toUpperCase()}</span><div className="sx-case-grid"/><span className="sx-case-index">0{i+1} / PROYECTO</span></div><div className="sx-case-caption"><div><h3>{item.name}</h3><p>{item.note}</p></div><ArrowUpRight size={25}/></div></a>)}</div>
      </div></section>
      <section className="sx-section sx-faq"><div className="sx-wrap sx-faq-layout"><div><div className="sx-section-label"><span>05 / SIN VUELTAS</span></div><h2>Preguntas claras.<br/><em>Respuestas directas.</em></h2><p>Queremos que sepas qué esperar antes de comenzar.</p></div><div className="sx-faq-items">{service.questions.map(([q,a],i)=><div className={`sx-faq-item ${openFaq===i?"is-open":""}`} key={q}><button type="button" aria-expanded={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?null:i)}><span>{q}</span><ChevronDown size={21}/></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>
      <section className="sx-final"><div className="sx-final-orb" aria-hidden="true"/><div className="sx-wrap sx-final-inner"><div className="sx-section-label"><span>TU SIGUIENTE PASO COMIENZA AQUÍ</span></div><h2>¿Y si hacemos<br/><em>que pase?</em></h2><p>Cuéntanos qué quieres lograr. Te ayudamos a identificar por dónde empezar y qué tiene sentido para tu negocio.</p><Action service={service} light>{service.cta}</Action><span className="sx-final-note">Conversamos sobre tu necesidad y definimos juntos los próximos pasos.</span></div></section>
      <section className="sx-related"><div className="sx-wrap"><div className="sx-section-label"><span>EXPLORA MÁS CÓMPLICE</span></div><h2>Tu próxima idea puede estar aquí.</h2><div className="sx-related-links">{otherServices.map(other=><a href={serviceHref(other.slug)} key={other.slug}><span>{other.name}</span><ArrowUpRight size={22}/></a>)}</div></div></section>
    </main><SiteFooter/><WhatsAppFloat/>
  </div>;
}
