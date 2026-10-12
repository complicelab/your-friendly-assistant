import { ArrowDown, ArrowUpRight, BarChart3, Check, Globe2, Layers3, Megaphone, MousePointer2, Palette, Sparkles, WandSparkles } from "lucide-react";
import "./hero-creative.css";

const whatsapp = "https://api.whatsapp.com/send?phone=573161772880&text=" + encodeURIComponent("Hola, vi la web de Cómplice Lab. Quiero contarles mi negocio y recibir orientación sobre cómo mejorar mi marca, publicidad o página web.");

function ExperienceScene() {
  return (
    <div className="hc-scene" aria-label="Composición creativa con ejemplos conceptuales de páginas web, branding y publicidad">
      <div className="hc-glow" aria-hidden="true" />
      <div className="hc-outline hc-outline-one" aria-hidden="true" />
      <div className="hc-outline hc-outline-two" aria-hidden="true" />
      <div className="hc-browser">
        <div className="hc-browser-bar"><div className="hc-dots"><i/><i/><i/></div><span>UNA MARCA · UNA EXPERIENCIA</span><Globe2 size={14}/></div>
        <div className="hc-browser-display">
          <div className="hc-demo-nav"><strong>crea<span>↗</span></strong><span>ESTRATEGIA · DISEÑO · WEB</span></div>
          <div className="hc-demo-body">
            <span className="hc-demo-kicker">DISEÑO CON INTENCIÓN</span>
            <h3>Ideas que<br/><em>se hacen realidad.</em></h3>
            <span className="hc-demo-button">Comencemos <ArrowUpRight size={12}/></span>
          </div>
          <div className="hc-demo-graphic"><div className="hc-demo-sphere"/><span>01 / INNOVACIÓN</span></div>
        </div>
        <div className="hc-browser-footer"><span><Check size={12}/> DISEÑO RESPONSIVE</span><span>EXPERIENCIAS DIGITALES</span></div>
      </div>
      <div className="hc-brand-piece">
        <span>IDENTIDAD / 02</span>
        <div className="hc-brand-symbol"><span>C</span><div/></div>
        <strong>Una marca.<br/>Mil posibilidades.</strong>
        <div className="hc-palette"><i/><i/><i/><i/></div>
      </div>
      <div className="hc-social-piece">
        <div className="hc-social-tag"><Megaphone size={13}/> CAMPAÑAS QUE CONECTAN</div>
        <div className="hc-social-center"><Sparkles size={34}/><strong>QUE SE<br/>NOTE.</strong></div>
        <div className="hc-social-bottom">IDEAS · CONTENIDO · PUBLICIDAD <ArrowUpRight size={16}/></div>
      </div>
      <div className="hc-floating hc-floating-a"><MousePointer2 size={15}/> EXPERIENCIA WEB</div>
      <div className="hc-floating hc-floating-b"><Palette size={15}/> BRANDING</div>
      <div className="hc-floating hc-floating-c"><BarChart3 size={15}/> ESTRATEGIA</div>
      <div className="hc-scene-caption">DIRECCIÓN DE ARTE · CÓMPLICE LAB ®</div>
    </div>
  );
}
export function Hero() {
  return (
    <section id="inicio" className="hero hc-hero">
      <div className="hc-grid" aria-hidden="true"/>
      <div className="container hc-hero-inner">
        <div className="hc-copy">
          <p className="hc-eyebrow"><WandSparkles size={16}/> AGENCIA CREATIVA EN MANIZALES · COLOMBIA</p>
          <h1>Tu negocio tiene algo especial.<br/><em>Hagamos que se note.</em></h1>
          <p className="hc-description">Creamos marcas que se recuerdan, páginas web que invitan a contactar y publicidad con ideas que conectan. También te enseñamos a aprovechar la inteligencia artificial para llevar tus proyectos más lejos.</p>
          <div className="hc-actions">
            <a className="button hc-primary-cta" href={whatsapp} target="_blank" rel="noopener noreferrer">Quiero transformar mi negocio <ArrowUpRight size={18}/></a>
            <a className="hc-explore-link" href="#servicios">Descubre lo que podemos crear <ArrowDown size={17}/></a>
          </div>
          <div className="hc-trust"><span className="hc-trust-stamp"><Layers3 size={17}/></span><span>CREAMOS <b>·</b> ENSEÑAMOS <b>·</b> IMPLEMENTAMOS</span></div>
        </div>
        <ExperienceScene/>
      </div>
      <div className="container hc-underhero"><div className="hc-underhero-left"><span className="hc-pulse"/><span>NO VENDEMOS PLANTILLAS SIN PERSONALIDAD.</span></div><span>CONSTRUIMOS EXPERIENCIAS CON CRITERIO.</span><a href="#proyectos">Ver proyectos <ArrowUpRight size={14}/></a></div>
    </section>
  );
}
