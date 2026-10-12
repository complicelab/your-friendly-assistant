import { ArrowUpRight, Megaphone, Globe2, Palette, MousePointer2, Film, PenTool, Target } from "lucide-react";
import { commercialServices, serviceHref } from "@/data/commercial-services";
import "./service-index.css";
const order = [
  ["paginas-web-manizales","01",Globe2,"Webs que despiertan interés y facilitan el contacto."],
  ["agencia-publicidad-manizales","02",Megaphone,"Ideas con dirección para que tu marca se note."],
  ["branding-identidad-marca","03",Palette,"Marcas con personalidad, no copias de otras."],
  ["contenido-redes-sociales","04",Film,"Historias, reels y contenido que conectan."],
  ["publicidad-meta-ads","05",Target,"Campañas con intención, prueba y aprendizaje."],
  ["marketing-digital-manizales","06",MousePointer2,"Canales conectados por una estrategia."],
  ["diseno-grafico-publicitario","07",PenTool,"Comunicación visual que deja una impresión."],
] as const;
export function ServiceIndex() {
  return <section className="si-section" id="todos-los-servicios"><div className="container">
    <div className="si-intro"><div><p className="si-kicker">CATÁLOGO DE SOLUCIONES · CÓMPLICE LAB</p><h2>Una idea grande merece<br/><em>más que una plantilla.</em></h2></div><p>Descubre nuestros servicios y encuentra el punto de partida para tu siguiente proyecto. Cada marca tiene una historia diferente.</p></div>
    <div className="si-list">{order.map(([slug,num,Icon,copy])=>{const item=commercialServices.find(service=>service.slug===slug);if(!item)return null;return <a className="si-item" key={slug} href={serviceHref(slug)}>
      <span className="si-number">{num}</span><span className="si-icon"><Icon size={25} strokeWidth={1.45}/></span><span className="si-service-name">{item.name}</span><span className="si-description">{copy}</span><span className="si-arrow"><ArrowUpRight size={24}/></span>
    </a>})}</div>
    <p className="si-footnote">¿Tu necesidad combina varios servicios? <a href="https://api.whatsapp.com/send?phone=573161772880&text=Hola%2C%20quiero%20hablar%20sobre%20una%20soluci%C3%B3n%20a%20medida%20para%20mi%20negocio." target="_blank" rel="noopener noreferrer">Hablemos de una solución a tu medida <ArrowUpRight size={16}/></a></p>
  </div></section>;
}
