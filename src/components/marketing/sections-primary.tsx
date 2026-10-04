import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Brush,
  Code2,
  Gauge,
  Layers3,
  Megaphone,
  PenTool,
  Rocket,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { services, ways, workshops } from "@/data/marketing";
import { SectionHeading } from "./brand";

const before = ["Procesos lentos", "Horas investigando", "Muchas herramientas", "Más tareas manuales", "Mayor dependencia técnica"];
const now = ["IA + estrategia", "IA + creatividad", "IA + publicidad", "IA + contenido", "IA + diseño", "IA + web"];
const aiNodes = ["BRANDING", "CONTENIDO", "ADS", "WEB", "DISEÑO", "INVESTIGACIÓN", "FORMACIÓN"];

export function ChangeSection() {
  return (
    <section id="cambio" className="section section-deep">
      <div className="container">
        <SectionHeading
          eyebrow="LA FORMA DE TRABAJAR CAMBIÓ"
          title="Más posibilidades. Menos fricción."
          copy="Hoy una marca puede investigar, diseñar, crear contenido, desarrollar páginas web y construir campañas mucho más rápido gracias a la inteligencia artificial."
        />
        <div className="statement reveal">
          <span>Pero tener acceso a IA no es suficiente.</span>
          <strong>La diferencia está en saber usarla.</strong>
        </div>
        <div className="compare-grid">
          <article className="compare-card reveal">
            <p className="card-kicker muted">ANTES</p>
            {before.map((item) => <div className="compare-row" key={item}><span>—</span>{item}</div>)}
          </article>
          <article className="compare-card compare-card-now reveal">
            <p className="card-kicker">AHORA</p>
            {now.map((item) => <div className="compare-row" key={item}><Sparkles size={15}/>{item}</div>)}
          </article>
        </div>
        <p className="mega-line reveal">Tecnología sencilla. <span>Estrategia humana.</span> Resultados profesionales.</p>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const icons = [Layers3, Brush, PenTool, Megaphone, Code2];
  return (
    <section id="servicios" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SERVICIOS"
          title="Todo lo que una marca necesita para verse, comunicar y crecer mejor."
          copy="La inteligencia artificial atraviesa nuestro proceso; no reemplaza el criterio, la estrategia ni la experiencia."
        />
        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <article className="service-card reveal" key={service.title}>
                <div className="card-icon"><Icon size={22}/></div>
                <span className="card-number">0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="tag-cloud">
                  {service.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WaysSection() {
  return (
    <section id="formas" className="section section-deep">
      <div className="container">
        <SectionHeading
          eyebrow="TRES FORMAS DE TRABAJAR"
          title="Elige cómo quieres trabajar con tu Cómplice."
          align="center"
        />
        <div className="ways-grid">
          {ways.map((way, index) => (
            <article className={`way-card reveal ${index === 1 ? "featured" : ""}`} key={way.key}>
              <span className="way-index">0{index + 1}</span>
              <p className="eyebrow">{way.key}</p>
              <h3>{way.tagline}</h3>
              <p>{way.description}</p>
              <div className="tag-cloud">
                {way.items.map((item) => <span key={item}>{item}</span>)}
              </div>
              <a href={way.key === "ENSEÑAMOS" ? "#formacion" : "#contacto"} className="text-link">
                {way.cta} <ArrowRight size={17}/>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AiMethodSection() {
  return (
    <section className="section ai-section">
      <div className="container ai-layout">
        <div>
          <SectionHeading
            eyebrow="IA COMO METODOLOGÍA"
            title="IA en el centro. Personas detrás de las decisiones."
            copy="La inteligencia artificial hace parte de nuestra manera de investigar, crear, diseñar, escribir, analizar y desarrollar soluciones."
          />
          <p className="statement compact reveal"><span>La IA acelera.</span><strong>La estrategia decide.</strong></p>
          <p className="body-large reveal">No necesitas convertirte en experto en inteligencia artificial. Necesitas aprender a utilizarla a favor de lo que ya haces.</p>
        </div>
        <div className="ai-orbit reveal" aria-label="Áreas potenciadas por inteligencia artificial">
          <div className="ai-core"><BrainCircuit size={32}/><b>IA</b><span>+ criterio humano</span></div>
          {aiNodes.map((node, index) => <span key={node} className={`ai-node ai-node-${index + 1}`}>{node}</span>)}
        </div>
      </div>
    </section>
  );
}

export function TrainingSection() {
  return (
    <section id="formacion" className="section section-training">
      <div className="container">
        <div className="training-hero reveal">
          <p className="eyebrow">FORMACIÓN CÓMPLICE LAB</p>
          <h2>Formación práctica en IA, marketing y publicidad.</h2>
          <p className="training-callout">Aprendes haciendo.<br/><span>Terminas aplicando.</span></p>
          <p>Desarrollamos cursos, talleres, seminarios y capacitaciones de inteligencia artificial, marketing digital, publicidad, contenido, Meta Ads, branding, reels, CapCut y creación web. La formación está pensada para emprendedores, profesionales, empresas y equipos en Colombia, en formatos online y presenciales según cada programa.</p>
        </div>
        <div className="workshop-grid">
          {workshops.map(([title, result], index) => (
            <article className="workshop-card reveal" key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{result}</p>
            </article>
          ))}
        </div>
        <a href="/formacion" className="button reveal">Conocer nuestras formaciones <ArrowRight size={18}/></a>
      </div>
    </section>
  );
}

export function SimpleSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="LO HACEMOS SIMPLE" title="Lo difícil no tiene que sentirse complicado." />
        <div className="simple-grid">
          <div className="simple-lines reveal">
            {["No necesitas ser diseñador.","No necesitas ser programador.","No necesitas ser experto en publicidad.","No necesitas saber de inteligencia artificial."].map((line) => <p key={line}>{line}</p>)}
            <strong>Necesitas saber qué herramientas utilizar, para qué sirven y cómo pedirles lo que necesitas.</strong>
          </div>
          <div className="prompt-demo reveal">
            <div className="demo-top"><span/><span/><span/><b>CÓMPLICE / LAB</b></div>
            <div className="demo-flow">
              <div><WandSparkles size={18}/><span>IDEA</span></div>
              <ArrowRight/>
              <div><Bot size={18}/><span>PROMPT</span></div>
              <ArrowRight/>
              <div className="result-tile"><Rocket size={18}/><span>RESULTADO</span></div>
            </div>
            <div className="demo-output">
              <div><Brush/>Diseño</div><div><Code2/>Web</div><div><PenTool/>Contenido</div><div><Gauge/>Anuncio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
