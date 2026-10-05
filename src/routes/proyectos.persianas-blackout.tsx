import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Layers3,
  MonitorSmartphone,
  Palette,
  Sparkles,
  Target,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export const Route = createFileRoute("/proyectos/persianas-blackout")({
  head: () => ({
    meta: [
      { title: "Persianas & Black Out — Caso de Estudio | Cómplice Lab" },
      {
        name: "description",
        content:
          "Caso de estudio de Persianas & Black Out: naming, marca, identidad, dirección creativa y comunicación comercial desarrolladas desde cero.",
      },
      { property: "og:title", content: "Persianas & Black Out — Caso de Estudio | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Creamos desde cero una marca de persianas y soluciones de control de luz con identidad, concepto y sistema visual propio.",
      },
      { property: "og:url", content: "https://complicelab.com/proyectos/persianas-blackout" },
      { property: "og:image", content: "https://complicelab.com/pb-hero.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://complicelab.com/pb-hero.webp" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/proyectos/persianas-blackout" }],
  }),
  component: PersianasCase,
});

const whatsapp =
  "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Quiero%20hablar%20sobre%20un%20proyecto%20de%20marca%20como%20Persianas%20%26%20Black%20Out.";

const capabilities = [
  ["Marca desde cero", Palette, "Concepto, identidad y sistema visual para darle al negocio una presencia propia desde el inicio."],
  ["Dirección creativa", Sparkles, "Un lenguaje elegante, limpio y adaptable a comunicación comercial y digital."],
  ["Concepto visual", Eye, "Luz, privacidad, confort y transformación de espacios convertidos en una idea de marca."],
  ["Sistema gráfico", Layers3, "Tipografía, composición y recursos preparados para mantener consistencia entre formatos."],
  ["Comunicación comercial", Target, "Mensajes enfocados en beneficios, estética y funcionalidad para presentar mejor la oferta."],
  ["Aplicación digital", MonitorSmartphone, "Una identidad preparada para piezas, redes y futuros puntos de contacto digitales."],
] as const;

function PersianasCase() {
  return (
    <div className="case-page pb-case">
      <header className="formation-nav case-nav">
        <div className="nav-wrap">
          <BrandMark />
          <a className="formation-back" href="/#proyectos">
            <ArrowLeft size={16} /> Volver a proyectos
          </a>
          <a className="button button-sm" href={whatsapp} target="_blank" rel="noreferrer noopener">
            Hablemos
          </a>
        </div>
      </header>

      <main>
        <section className="case-hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container">
            <p className="eyebrow">CASO DE ESTUDIO · BRANDING</p>
            <div className="case-hero-grid">
              <div className="pb-hero-copy">
                <h1>
                  Persianas
                  <span>&amp; Black Out</span>
                </h1>
                <p className="case-hero-lead">
                  Creamos desde cero una marca enfocada en diseño, privacidad y control de luz
                  para espacios residenciales y comerciales.
                </p>
                <div className="case-service-tags">
                  {["Branding", "Identidad", "Dirección creativa", "Contenido", "Comercial"].map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>

              <div className="case-metrics">
                <div><strong>0→1</strong><span>marca construida desde cero</span></div>
                <div><strong>360°</strong><span>identidad preparada para múltiples aplicaciones</span></div>
                <div><strong>P&amp;B</strong><span>sistema visual propio</span></div>
                <div><strong>1</strong><span>concepto central: controlar la luz con diseño</span></div>
              </div>
            </div>

            <figure className="pb-image-frame pb-image-frame-hero">
              <img
                src="/pb-hero.webp"
                alt="Presentación visual premium de Persianas & Black Out con aplicaciones de marca"
              />
            </figure>
          </div>
        </section>

        <section className="section">
          <div className="container case-story-grid">
            <div>
              <p className="eyebrow">EL PUNTO DE PARTIDA</p>
              <h2>
                Una empresa nueva necesitaba verse como una{" "}
                <span className="pb-accent">marca real desde el primer día.</span>
              </h2>
            </div>
            <div className="case-story-copy">
              <p>
                Persianas &amp; Black Out fue creada desde cero como proyecto empresarial de Cristian.
                No existía una identidad previa: había que construir concepto, lenguaje, estética y
                una forma clara de presentar el servicio.
              </p>
              <p>
                La oportunidad estaba en salir del código visual típico del sector y construir una
                presencia más limpia, elegante y preparada para crecer.
              </p>
              <strong>
                No diseñamos solamente un logo. Construimos una base de marca capaz de sostener un negocio.
              </strong>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">DIRECCIÓN VISUAL</p>
              <h2>
                Una marca pensada para <span className="pb-accent">vestir espacios.</span>
              </h2>
              <p>
                La identidad toma elementos del producto —planos, luz, sombra, textura y control—
                y los convierte en una presencia visual sobria y reconocible.
              </p>
            </div>
            <figure className="pb-image-frame pb-image-frame-editorial">
              <img
                src="/pb-hero.webp"
                alt="Dirección visual de Persianas & Black Out aplicada a interiores, escritorio y móvil"
                loading="lazy"
              />
              <figcaption>Visualización conceptual creada para presentar la dirección de marca.</figcaption>
            </figure>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">QUÉ CONSTRUIMOS</p>
              <h2>
                Una identidad que puede vivir en{" "}
                <span className="pb-accent">todo el recorrido comercial.</span>
              </h2>
            </div>
            <div className="case-capabilities">
              {capabilities.map(([title, Icon, copy]) => (
                <article key={title}>
                  <Icon />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-deep pb-digital-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">APLICACIÓN DIGITAL</p>
              <h2>
                La marca llevada a una experiencia{" "}
                <span className="pb-accent">desktop y responsive.</span>
              </h2>
              <p>
                Estas piezas son visualizaciones conceptuales del sistema de marca; no representan
                una web publicada ni instalaciones reales.
              </p>
            </div>

            <div className="pb-media-grid">
              <figure className="pb-image-frame pb-media-main">
                <img
                  src="/pb-web.webp"
                  alt="Concepto de experiencia web para Persianas & Black Out en computador"
                  loading="lazy"
                />
                <figcaption>Exploración de experiencia web en formato desktop.</figcaption>
              </figure>
              <figure className="pb-image-frame pb-media-mobile">
                <img
                  src="/pb-hero.webp"
                  alt="Aplicaciones responsive y móviles de Persianas & Black Out"
                  loading="lazy"
                />
                <figcaption>Aplicaciones móviles integradas dentro del sistema visual.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="case-result">
          <div className="container">
            <p className="eyebrow">EL RESULTADO</p>
            <h2>
              Una marca nueva con una base visual lista para{" "}
              <span>salir al mercado y seguir creciendo.</span>
            </h2>
            <div className="case-result-pills">
              <span><CheckCircle2 /> Marca creada desde cero</span>
              <span><Palette /> Identidad propia</span>
              <span><Sparkles /> Dirección creativa</span>
              <span><MonitorSmartphone /> Preparada para digital</span>
            </div>
          </div>
        </section>

        <section className="main-cta formation-cta">
          <div className="container">
            <p className="eyebrow">¿QUIERES CREAR UNA MARCA DESDE CERO?</p>
            <h2>
              Tu idea también puede tener una{" "}
              <span className="case-accent-light">identidad que se sienta propia.</span>
            </h2>
            <p>Construimos concepto, marca, comunicación y presencia digital alrededor de tu negocio.</p>
            <div className="hero-actions">
              <a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer noopener">
                Hablemos <ArrowRight size={18} />
              </a>
              <a className="button button-outline-light" href="/#proyectos">
                Ver más proyectos
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
