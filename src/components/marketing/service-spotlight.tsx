import { ArrowUpRight, Globe2, Megaphone, Palette, Sparkles } from "lucide-react";
import { serviceHref } from "@/data/commercial-services";
import "./service-spotlight.css";
import { peopleImages } from "@/data/visual-story";

const featured = [
  { label: "WEB & EXPERIENCIAS", head: "Una web para recibir citas, pedidos y ventas.", desc: "Citas, reservas, productos, pagos o sistemas para atender mejor.", slug: "paginas-web-manizales", icon: Globe2, theme: "web", photo: peopleImages.restaurant, cta: "Quiero una página que venda" },
  { label: "PUBLICIDAD & ESTRATEGIA", head: "Anuncios para mostrarte a más personas interesadas.", desc: "Publicidad para dar a conocer lo que vendes y despertar interés.", slug: "publicidad-meta-ads", icon: Megaphone, theme: "ads", photo: peopleImages.realtor, cta: "Quiero anunciar mi negocio" },
  { label: "BRANDING & IDENTIDAD", head: "Tu nueva marca comienza con una gran idea.", desc: "Que te reconozcan, te recuerden y confíen más al elegirte.", slug: "crear-marca-negocio-desde-cero", icon: Palette, theme: "brand", photo: peopleImages.brand, cta: "Quiero construir mi marca" },
];
export function ServiceSpotlight() {
  return <section id="servicios" className="ss-section" aria-labelledby="ss-title"><div className="container">
    <div className="ss-kicker"><Sparkles size={16}/> IDEAS QUE HACEN QUE LAS COSAS PASEN</div>
    <div className="ss-heading"><h2 id="ss-title">Lo que haces es importante.<br/><em>Cómo lo muestras también.</em></h2><p>Explora nuestras soluciones, conoce cómo trabajamos y elige por dónde quieres comenzar.</p></div>
    <div className="ss-grid">{featured.map(({label,head,desc,slug,icon:Icon,theme,photo,cta},i)=><a className={`ss-card ss-${theme}`} href={serviceHref(slug)} key={slug}>
      <div className="ss-top"><span>0{i+1} / {label}</span><ArrowUpRight size={23}/></div>
      <div className="ss-photo"><img src={photo.src} alt={photo.alt} loading="lazy" width={550} height={460}/></div>
      <div className="ss-card-copy"><h3>{head}</h3><p>{desc}</p><strong>{cta} <ArrowUpRight size={17}/></strong></div>
    </a>)}</div>
    <div className="ss-bottom"><span>¿NO SABES POR DÓNDE EMPEZAR?</span><a href="https://api.whatsapp.com/send?phone=573161772880&text=Hola%2C%20quiero%20un%20diagn%C3%B3stico%20para%20saber%20qu%C3%A9%20servicio%20necesita%20mi%20negocio." target="_blank" rel="noopener noreferrer">Cuéntanos tu idea y la pensamos contigo <ArrowUpRight size={18}/></a></div>
  </div></section>;
}
