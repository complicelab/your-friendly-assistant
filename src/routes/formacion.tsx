import { ArrowRight, BrainCircuit, Building2, CheckCircle2, Laptop2, Sparkles, Users } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { workshops } from "@/data/marketing";

export const Route = createFileRoute("/formacion")({
  head: () => ({
    meta: [
      { title: "Cursos y Talleres de IA, Marketing y Publicidad | Cómplice Lab" },
      {
        name: "description",
        content:
          "Formación práctica en inteligencia artificial, marketing, publicidad, contenido, Meta Ads, branding, reels, CapCut y creación web para personas, empresas y equipos en Colombia.",
      },
      { property: "og:title", content: "Formación práctica en IA, Marketing y Publicidad | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Cursos, talleres y capacitaciones aplicadas para emprendedores, profesionales, empresas y equipos en Colombia.",
      },
      { property: "og:url", content: "https://complicelab.com/formacion" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/formacion" }],
  }),
  component: FormationPage,
});

const whatsapp =
  "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Quiero%20informaci%C3%B3n%20sobre%20las%20formaciones%20de%20C%C3%B3mplice%20Lab.";

function FormationPage() {
  return (
    <div className="formation-page">
      <header className="formation-nav">
        <div className="nav-wrap">
          <BrandMark />
          <a className="formation-back" href="/#formacion">Ver sitio principal</a>
          <a className="button button-sm" href={whatsapp} target="_blank" rel="noreferrer noopener">
            Hablemos
          </a>
        </div>
      </header>

      <main>
        <section className="formation-hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container formation-hero-inner">
            <div>
              <p className="eyebrow">FORMACIÓN CÓMPLICE LAB · COLOMBIA + ONLINE</p>
              <h1>Aprende a usar IA, marketing y publicidad para hacer cosas reales.</h1>
              <p className="formation-lead">
                Cursos, talleres, seminarios y capacitaciones prácticas para emprendedores,
                profesionales, empresas y equipos. No se trata de acumular teoría: se trata de
                salir con herramientas, procesos y resultados que puedas aplicar.
              </p>
              <div className="hero-actions">
                <a className="button" href={whatsapp} target="_blank" rel="noreferrer noopener">
                  Quiero información <ArrowRight size={18} />
                </a>
                <a className="button button-ghost" href="#programas">Ver temas de formación</a>
              </div>
            </div>
            <div className="formation-symbol" aria-hidden="true">
              <BrainCircuit />
              <strong>APRENDER</strong>
              <span>HACIENDO</span>
            </div>
          </div>
        </section>

        <section className="section" id="programas">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">TEMAS DE FORMACIÓN</p>
              <h2>Aprendizaje aplicado a lo que hoy necesitan marcas y negocios.</h2>
              <p>
                La oferta puede adaptarse al nivel, objetivo y contexto de cada grupo. Estos son
                los ejes que actualmente trabajamos.
              </p>
            </div>
            <div className="workshop-grid">
              {workshops.map(([title, result], index) => (
                <article className="workshop-card" key={title}>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{result}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">PARA QUIÉN ES</p>
              <h2>Una misma metodología. Distintos puntos de partida.</h2>
              <p>La formación cambia según quién aprende, qué necesita resolver y cuánto acompañamiento requiere.</p>
            </div>

            <div className="formation-paths">
              <article className="formation-path-card">
                <div className="formation-path-icon"><Users /></div>
                <p className="eyebrow">PERSONAS</p>
                <h3>Emprendedores y profesionales</h3>
                <p>Para quienes quieren adquirir habilidades prácticas y aplicarlas directamente en su negocio, trabajo o proyecto.</p>
                <ul>
                  <li><CheckCircle2 /> IA aplicada al trabajo</li>
                  <li><CheckCircle2 /> Contenido y reels</li>
                  <li><CheckCircle2 /> Meta Ads</li>
                  <li><CheckCircle2 /> Branding y presencia digital</li>
                </ul>
                <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer noopener">
                  Quiero aprender <ArrowRight size={17} />
                </a>
              </article>

              <article className="formation-path-card formation-path-featured">
                <div className="formation-path-icon"><Building2 /></div>
                <p className="eyebrow">EMPRESAS Y EQUIPOS</p>
                <h3>Capacitación adaptada a objetivos reales</h3>
                <p>Para organizaciones que quieren que sus equipos incorporen IA, marketing y herramientas digitales de forma práctica.</p>
                <ul>
                  <li><CheckCircle2 /> Talleres para equipos</li>
                  <li><CheckCircle2 /> IA aplicada a procesos</li>
                  <li><CheckCircle2 /> Marketing y comunicación</li>
                  <li><CheckCircle2 /> Programas personalizados</li>
                </ul>
                <a className="button" href="/capacitacion-ia-empresas">
                  Ver capacitación para empresas <ArrowRight size={17} />
                </a>
              </article>
            </div>

            <div className="formation-format-strip">
              <div><Laptop2 /><span><b>Online</b> para ampliar el alcance en Colombia.</span></div>
              <div><Sparkles /><span><b>Práctico</b> para aprender haciendo.</span></div>
              <div><BrainCircuit /><span><b>Aplicado</b> a situaciones y objetivos reales.</span></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container formation-method-layout">
            <div className="section-heading">
              <p className="eyebrow">CÓMO ENSEÑAMOS</p>
              <h2>Menos teoría aislada. Más criterio para usar herramientas.</h2>
              <p>No buscamos que memorices plataformas. Buscamos que entiendas qué usar, cuándo usarlo y cómo convertirlo en una ventaja para tu trabajo o negocio.</p>
            </div>
            <div className="formation-method-steps">
              <article><span>01</span><h3>Entender</h3><p>Partimos del objetivo antes de elegir la herramienta.</p></article>
              <article><span>02</span><h3>Probar</h3><p>Trabajamos con ejercicios concretos, no solamente demostraciones.</p></article>
              <article><span>03</span><h3>Aplicar</h3><p>Llevamos lo aprendido a una situación propia o de tu equipo.</p></article>
              <article><span>04</span><h3>Replicar</h3><p>Te llevas una lógica de trabajo que puedas volver a utilizar.</p></article>
            </div>
          </div>
        </section>

        <section className="main-cta formation-cta">
          <div className="container">
            <p className="eyebrow">¿QUÉ QUIERES APRENDER?</p>
            <h2>Cuéntanos qué necesitas aprender o enseñar a tu equipo.</h2>
            <p>Te orientamos sobre el formato de formación más adecuado.</p>
            <div className="hero-actions">
              <a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer noopener">
                Hablar con Cómplice Lab <ArrowRight size={18} />
              </a>
              <a className="button button-outline-light" href="/">Conocer Cómplice Lab</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
