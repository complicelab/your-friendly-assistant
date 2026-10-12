import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import { commercialServices, serviceHref } from "@/data/commercial-services";

const base = "https://complicelab.com";
function getService(slug: string) { return commercialServices.find(s => s.slug === slug); }
export const Route = createFileRoute("/servicios/$slug")({
  beforeLoad: ({ params }) => { if (!getService(params.slug)) throw notFound(); },
  head: ({ params }) => {
    const service = getService(params.slug);
    if (!service) return {};
    const url = base + serviceHref(service.slug);
    return {
      meta: [
        { title: service.title },
        { name: "description", content: service.description },
        { property: "og:title", content: service.title },
        { property: "og:description", content: service.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: base + "/og-image.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ServicePage,
});
function ServicePage() {
  const { slug } = Route.useParams();
  const service = getService(slug);
  if (!service) return null;
  const whatsapp = "https://api.whatsapp.com/send?phone=573161772880&text=" + encodeURIComponent("Hola, soy cliente potencial de Cómplice Lab. Quiero " + service.cta.toLowerCase() + ". ¿Podemos hablar?");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    serviceType: service.name,
    provider: { "@id": base + "/#organization" },
    areaServed: [{ "@type": "City", name: "Manizales" }, { "@type": "Country", name: "Colombia" }],
    url: base + serviceHref(service.slug),
  };
  return (
    <div className="formation-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="formation-nav"><div className="nav-wrap">
        <BrandMark />
        <a className="formation-back" href="/#servicios">Ver todos los servicios</a>
        <a className="button button-sm" href={whatsapp} target="_blank" rel="noopener noreferrer">Solicitar diagnóstico</a>
      </div></header>
      <main>
        <section className="formation-hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container formation-hero-inner">
            <div>
              <p className="eyebrow">CÓMPLICE LAB · MANIZALES Y COLOMBIA</p>
              <h1>{service.headline}</h1>
              <p className="formation-lead">{service.intro}</p>
              <div className="hero-actions">
                <a className="button" href={whatsapp} target="_blank" rel="noopener noreferrer">{service.cta} <ArrowRight size={18}/></a>
                <a className="button button-ghost" href="#incluye">Conocer el servicio</a>
              </div>
            </div>
          </div>
        </section>
        <section className="section" id="incluye"><div className="container">
          <div className="section-heading"><p className="eyebrow">QUÉ PODEMOS HACER POR TI</p><h2>Una propuesta ajustada a tus objetivos.</h2><p>{service.audience}</p></div>
          <div className="company-outcome-list">{service.deliverables.map(x => <div key={x}><CheckCircle2/><p><b>{x}</b></p></div>)}</div>
        </div></section>
        <section className="section section-deep"><div className="container">
          <div className="section-heading"><p className="eyebrow">NUESTRA FORMA DE TRABAJAR</p><h2>Del diagnóstico a la implementación.</h2></div>
          <div className="company-outcome-list">{service.process.map((step,i) => <div key={step}><CheckCircle2/><p><b>{String(i+1).padStart(2,"0")} · {step}</b></p></div>)}</div>
        </div></section>
        <section className="section"><div className="container">
          <div className="section-heading"><p className="eyebrow">PREGUNTAS FRECUENTES</p><h2>Lo que necesitas saber antes de empezar.</h2></div>
          <div className="company-outcome-list">{service.questions.map(([q,a]) => <div key={q}><CheckCircle2/><p><b>{q}</b><span>{a}</span></p></div>)}</div>
        </div></section>
        <section className="section section-deep main-cta"><div className="container">
          <div className="section-heading"><p className="eyebrow">HABLEMOS DE TU PROYECTO</p><h2>Comencemos con un diagnóstico de lo que necesitas.</h2><p>Cuéntanos el reto de tu negocio para definir alcance, prioridades y siguientes pasos sin compromisos de resultados irreales.</p></div>
          <a className="button" href={whatsapp} target="_blank" rel="noopener noreferrer">{service.cta} <ArrowRight size={18}/></a>
        </div></section>
        <section className="section"><div className="container">
          <div className="section-heading"><h2>Explora otros servicios de Cómplice Lab</h2></div>
          <div className="services-grid">{commercialServices.filter(x => x.slug!==slug).map(x=><article className="service-card" key={x.slug}><h3>{x.name}</h3><p>{x.description}</p><a className="text-link" href={serviceHref(x.slug)}>Conocer servicio <ArrowRight size={17}/></a></article>)}</div>
        </div></section>
      </main>
      <SiteFooter /><WhatsAppFloat />
    </div>
  );
}
