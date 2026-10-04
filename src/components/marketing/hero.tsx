import { ArrowDown, ArrowUpRight, Bot, Globe2, Megaphone, Palette, Shapes, Sparkles } from "lucide-react";

const orbitItems = [
  ["Branding", Shapes],
  ["Meta Ads", Megaphone],
  ["Web", Globe2],
  ["Contenido", Sparkles],
  ["Diseño", Palette],
  ["IA", Bot],
] as const;

export function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow reveal">PUBLICIDAD · CREATIVIDAD · TECNOLOGÍA</p>
          <h1 className="reveal">
            Haz más con tu marca.
            <br />
            Hazlo <span className="gradient-text">con IA.</span>
          </h1>
          <p className="hero-lead reveal">
            Creamos, enseñamos e implementamos publicidad, contenido, marcas y experiencias digitales potenciadas por inteligencia artificial.
          </p>
          <p className="hero-triad reveal">CREAMOS. ENSEÑAMOS. IMPLEMENTAMOS.</p>
          <div className="hero-actions reveal">
            <a className="button" href="#formas">
              Quiero que lo hagan por mí <ArrowUpRight size={18} />
            </a>
            <a className="button button-ghost" href="#formacion">
              Quiero aprender a hacerlo
            </a>
          </div>
        </div>
        <div className="hero-visual reveal" aria-label="Áreas de trabajo de Cómplice Lab">
          <div className="core">
            <div className="core-ring" />
            <div className="core-label">
              <span>CÓMPLICE</span>
              <b>LAB</b>
            </div>
          </div>
          {orbitItems.map(([label, Icon], index) => (
            <div key={label} className={`orbit-card orbit-${index + 1}`}>
              <Icon size={16} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <a className="scroll-cue" href="#cambio" aria-label="Bajar a la siguiente sección">
        <ArrowDown size={18} />
      </a>
    </section>
  );
}
