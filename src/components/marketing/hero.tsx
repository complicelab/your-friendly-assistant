import { ArrowDown, ArrowUpRight, BarChart3, Check, Globe2, Layers3, Megaphone, MousePointer2, Palette, Sparkles, WandSparkles } from "lucide-react";
import "./hero-creative.css";
import { peopleImages } from "@/data/visual-story";

const whatsapp = "https://api.whatsapp.com/send?phone=573161772880&text=" + encodeURIComponent("Hola, vi la web de Cómplice Lab. Quiero contarles mi negocio y recibir orientación sobre cómo mejorar mi marca, publicidad o página web.");

function ExperienceScene() {
  return <div className="hc-human-scene" aria-label="Escenas de negocios que buscan vender y agendar más">
    <div className="hc-human-main"><img src={peopleImages.dentist.src} alt={peopleImages.dentist.alt} loading="eager" fetchPriority="high" width={610} height={700} /><span>UNA IDEA PUEDE LLEGAR MUY LEJOS.</span></div>
    <div className="hc-human-small"><img src={peopleImages.realtor.src} alt={peopleImages.realtor.alt} loading="lazy" width={320} height={400}/><span>MÁS INTERESADOS EN TU NEGOCIO</span></div>
    <div className="hc-human-pill hc-pill-one"><Globe2 size={15}/> Que te encuentren</div>
    <div className="hc-human-pill hc-pill-two"><Megaphone size={15}/> Que te recuerden</div>
    <div className="hc-human-pill hc-pill-three"><Sparkles size={15}/> Que te elijan</div>
    
  </div>;
}
export function Hero() {
  return (
    <section id="inicio" className="hero hc-hero">
      <div className="hc-grid" aria-hidden="true"/>
      <div className="container hc-hero-inner">
        <div className="hc-copy">
          <p className="hc-eyebrow"><WandSparkles size={16}/> AGENCIA CREATIVA EN MANIZALES · COLOMBIA</p>
          <h1>Haz que tu negocio<br/><em>reciba más consultas, citas y pedidos.</em></h1>
          <p className="hc-description">Diseñamos páginas web para vender y agendar, campañas que dan a conocer tus servicios e imágenes que hacen lucir tus productos. Si tienes un negocio o apenas una idea, podemos ayudarte a dar el siguiente paso.</p>
          <div className="hc-actions">
            <a className="button hc-primary-cta" href={whatsapp} target="_blank" rel="noopener noreferrer">Quiero más clientes para mi negocio <ArrowUpRight size={18}/></a>
            <a className="hc-explore-link" href="#servicios">Descubre lo que podemos crear <ArrowDown size={17}/></a>
          </div>
          <a className="hc-team-proof" href="#nosotros"><span className="hc-team-portraits"><img src="/founders/camilo-latest.webp" alt="Camilo Moreno, cofundador" width={43} height={43}/><img src="/founders/cristian.jpg?v=20261005-centered" alt="Cristian Roman, cofundador" width={43} height={43}/></span><span><strong>Personas reales detrás de cada idea.</strong><small>Conoce a Camilo y Cristian, los fundadores <ArrowUpRight size={12}/></small></span></a>
          <div className="hc-trust"><span className="hc-trust-stamp"><Layers3 size={17}/></span><span>CREAMOS <b>·</b> ENSEÑAMOS <b>·</b> IMPLEMENTAMOS</span></div>
        </div>
        <ExperienceScene/>
      </div>
      <div className="container hc-underhero"><div className="hc-underhero-left"><span className="hc-pulse"/><span>TU NEGOCIO NECESITA MÁS QUE UNA PÁGINA BONITA.</span></div><span>CONSTRUIMOS EXPERIENCIAS CON CRITERIO.</span><a href="#proyectos">Ver proyectos <ArrowUpRight size={14}/></a></div>
    </section>
  );
}
