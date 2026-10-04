import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Gauge,
  Megaphone,
  Sparkles,
  Users,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export const Route = createFileRoute("/capacitacion-ia-empresas")({
  head: () => ({
    meta: [
      { title: "Capacitación en IA para Empresas en Colombia | Cómplice Lab" },
      {
        name: "description",
        content:
          "Capacitación práctica en inteligencia artificial para empresas y equipos en Colombia. Talleres aplicados a marketing, contenido, productividad, comunicación y procesos reales.",
      },
      {
        property: "og:title",
        content: "Capacitación en IA para Empresas | Cómplice Lab",
      },
      {
        property: "og:description",
        content:
          "Talleres y capacitaciones prácticas para que equipos incorporen inteligencia artificial a situaciones reales de trabajo.",
      },
      {
        property: "og:url",
        content: "https://complicelab.com/capacitacion-ia-empresas",
      },
      { property: "og:image", content: "https://complicelab.com/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Cómplice Lab — IA aplicada a tu negocio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://complicelab.com/og-image.jpg" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://complicelab.com/capacitacion-ia-empresas",
      },
    ],
  }),
  component: CompanyTrainingPage,
});

const whatsapp =
  "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Quiero%20informaci%C3%B3n%20sobre%20capacitaci%C3%B3n%20en%20IA%20para%20mi%20empresa%20o%20equipo.";

const applications = [
  ["Marketing y publicidad", Megaphone, "Ideación, investigación, copies, campañas, análisis y apoyo creativo."],
  ["Contenido y comunicación", Sparkles, "Procesos para desarrollar ideas, guiones, piezas y comunicación con mayor agilidad."],
  ["Productividad y procesos", Gauge, "Uso de IA para investigar, organizar información, documentar y reducir tareas repetitivas."],
  ["Equipos y adopción", Users, "Criterio para elegir herramientas, crear mejores instrucciones y utilizar IA de manera más consistente."],
] as const;

function CompanyTrainingPage() {
  return (
    <div className="formation-page company-training-page">
      <header className="formation-nav">
        <div className="nav-wrap">
          <BrandMark />
          <a className="formation-back" href="/formacion">Ver formación</a>
          <a className="button button-sm" href={whatsapp} target="_blank" rel="noreferrer noopener">
            Hablemos
          </a>
        </div>
      </header>

      <main>
        <section className="formation-hero company-hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container formation-hero-inner">
            <div>
              <p className="eyebrow">CAPACITACIÓN EN IA PARA EMPRESAS · COLOMBIA</p>
              <h1>Que tu equipo no solo conozca la IA. Que sepa usarla.</h1>
              <p className="formation-lead">
                Diseñamos capacitaciones prácticas para que empresas y equipos entiendan cómo aplicar
                inteligencia artificial a situaciones reales de marketing, contenido, comunicación,
                productividad y trabajo diario.
              </p>
              <div className="hero-actions">
                <a className="button" href={whatsapp} target="_blank" rel="noreferrer noopener">
                  Quiero capacitar a mi equipo <ArrowRight size={18} />
                </a>
                <a className="button button-ghost" href="#enfoque">Ver cómo funciona</a>
              </div>
            </div>

            <div className="company-training-visual" aria-hidden="true">
              <BrainCircuit />
              <div>
                <span>EQUIPO</span>
                <strong>+ IA</strong>
                <small>+ CRITERIO</small>
              </div>
            </div>
          </div>
        </section>

        <section id="enfoque" className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">NO SE TRATA DE MOSTRAR HERRAMIENTAS</p>
              <h2>La capacitación parte del trabajo que tu equipo realmente hace.</h2>
              <p>
                Antes de hablar de plataformas, buscamos entender los retos, tareas y oportunidades
                donde la IA puede aportar. A partir de ahí construimos una experiencia práctica y
                comprensible para el equipo.
              </p>
            </div>

            <div className="company-app-grid">
              {applications.map(([title, Icon, copy]) => (
                <article key={title}>
                  <Icon />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container company-outcomes">
            <div className="section-heading">
              <p className="eyebrow">QUÉ BUSCAMOS LOGRAR</p>
              <h2>Que el equipo salga con una forma más clara de trabajar con IA.</h2>
            </div>
            <div className="company-outcome-list">
              <div><CheckCircle2 /><p><b>Entender posibilidades y límites.</b><span>Usar IA con criterio en lugar de depender de resultados automáticos.</span></p></div>
              <div><CheckCircle2 /><p><b>Hacer mejores instrucciones.</b><span>Aprender a dar contexto, objetivos y criterios para obtener respuestas más útiles.</span></p></div>
              <div><CheckCircle2 /><p><b>Aplicar sobre casos reales.</b><span>Trabajar con ejemplos cercanos a las tareas y necesidades del equipo.</span></p></div>
              <div><CheckCircle2 /><p><b>Crear procesos replicables.</b><span>Convertir aprendizajes aislados en formas de trabajo que puedan repetirse.</span></p></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container company-format-layout">
            <div>
              <p className="eyebrow">FORMATO ADAPTABLE</p>
              <h2>Una capacitación no tiene por qué ser igual para todas las empresas.</h2>
              <p className="body-large">
                Podemos adaptar el enfoque según el área, nivel de conocimiento, objetivos y tipo
                de equipo. La modalidad puede plantearse online o presencial según el alcance del
                programa.
              </p>
            </div>
            <div className="company-format-card">
              <BriefcaseBusiness />
              <span>01</span>
              <h3>Entendemos el contexto</h3>
              <p>Qué hace el equipo, dónde pierde tiempo y qué quiere mejorar.</p>
              <span>02</span>
              <h3>Definimos el enfoque</h3>
              <p>Seleccionamos contenidos y ejercicios alrededor de esos objetivos.</p>
              <span>03</span>
              <h3>Capacitamos aplicando</h3>
              <p>El aprendizaje ocurre sobre tareas y escenarios concretos.</p>
            </div>
          </div>
        </section>

        <section className="main-cta formation-cta">
          <div className="container">
            <p className="eyebrow">CAPACITA A TU EQUIPO</p>
            <h2>Cuéntanos qué hace tu equipo y qué quieren lograr con IA.</h2>
            <p>Te ayudamos a definir una capacitación útil para su contexto.</p>
            <div className="hero-actions">
              <a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer noopener">
                Hablar sobre la capacitación <ArrowRight size={18} />
              </a>
              <a className="button button-outline-light" href="/formacion">
                Ver toda la formación
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <WhatsAppFloat />
    </div>
  );
}
