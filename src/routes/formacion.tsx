import { ArrowRight, BrainCircuit, Building2, Laptop2, Sparkles, Users } from "lucide-react";
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
              <h2>Formación para aprender, aplicar y luego avanzar.</h2>
            </div>
            <div className="formation-audience">
              <article><Users /><h3>Emprendedores y profesionales</h3><p>Para aprender herramientas que permitan crear, comunicar y trabajar con mayor autonomía.</p></article>
              <article><Building2 /><h3>Empresas y equipos</h3><p>Capacitaciones adaptables a objetivos de marketing, comunicación, productividad y adopción de IA.</p></article>
              <article><Laptop2 /><h3>Online en Colombia</h3><p>Formación remota para ampliar el alcance más allá de nuestra ubicación actual en Manizales.</p></article>
              <article><Sparkles /><h3>Aprender haciendo</h3><p>Ejercicios y aplicación práctica sobre ideas, marcas, negocios o situaciones reales.</p></article>
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
