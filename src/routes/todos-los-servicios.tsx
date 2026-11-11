import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { commercialServices, serviceHref } from "@/data/commercial-services";
import { peopleImages, photoForService } from "@/data/visual-story";
import "@/components/marketing/service-directory.css";

export const Route = createFileRoute("/todos-los-servicios")({
  head: () => ({
    meta: [
      { title: "Servicios de Cómplice Lab | Web, pauta y sistemas con IA" },
      { name: "description", content: "Conoce los servicios actuales de Cómplice Lab para captar y gestionar oportunidades: páginas web, pauta en Meta Ads y soluciones conectadas al proceso comercial." },
      { property: "og:title", content: "Servicios para captar y gestionar oportunidades | Cómplice Lab" },
      { property: "og:url", content: "https://complicelab.com/todos-los-servicios" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/todos-los-servicios" }],
  }),
  component: ServiceDirectory,
});
function ServiceDirectory() {
  const whatsapp="https://api.whatsapp.com/send?phone=573161772880&text="+encodeURIComponent("Hola, quiero saber qué servicio de Cómplice Lab necesita mi negocio. ¿Podemos conversar?");
  return <div className="sd-page">
    <header className="sd-nav"><BrandMark/><a href="/">Volver a Cómplice Lab</a><a className="sd-nav-cta" href={whatsapp} target="_blank" rel="noopener noreferrer">Pedir diagnóstico <ArrowUpRight size={16}/></a></header>
    <main>
      <section className="sd-hero"><div><p>CÓMPLICE LAB · MANIZALES</p><h1>¿Qué necesita<br/><em>tu negocio para crecer?</em></h1><span>Construimos experiencias y campañas que ayudan a representar mejor tu nivel, atraer oportunidades y facilitar el siguiente paso comercial.</span></div><img src={peopleImages.realtor.src} alt={peopleImages.realtor.alt} loading="eager" width={580} height={550}/></section>
      <section className="sd-grid" aria-label="Nuestros servicios">{commercialServices.map((service,i)=>{
        const image=peopleImages[photoForService[service.slug]?.[0] ?? "entrepreneur"];
        return <a className="sd-card" href={serviceHref(service.slug)} key={service.slug}><div className="sd-card-photo"><img src={image.src} alt={image.alt} loading="lazy" width={500} height={340}/></div><div className="sd-card-body"><span>0{i+1} / CÓMPLICE LAB</span><h2>{service.name}</h2><p>{service.intro}</p><strong>Conocer cómo podemos ayudarte <ArrowUpRight size={16}/></strong></div></a>;
      })}</section>
      <div className="sd-bottom"><h2>¿No sabes qué elegir?<br/><em>Te ayudamos.</em></h2><p>Cuéntanos tu negocio y te orientamos para dar el siguiente paso.</p><a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/> Hablar con Cómplice Lab</a></div>
      
    </main><SiteFooter/>
  </div>;
}
