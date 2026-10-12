import { ArrowUpRight, Megaphone, Globe2, Palette, MousePointer2, Film, PenTool, Target } from "lucide-react";
import { commercialServices, serviceHref } from "@/data/commercial-services";
import "./service-index.css";
const order = [
 ["diagnostico-negocio-manizales","01",Target,"Detectar qué mejorar para atraer clientes y vender."],
 ["paginas-web-manizales","02",Globe2,"Agendar citas, recibir pedidos, vender o administrar."],
 ["contenido-publicitario-manizales","03",Film,"Imágenes y reels que muestran tus productos como merecen."],
 ["publicidad-meta-ads","04",Megaphone,"Promocionar tus servicios en Facebook e Instagram."],
 ["crear-marca-negocio-desde-cero","05",Palette,"Construir tu marca desde la primera idea."]
] as const;
export function ServiceIndex() {
  return <section className="si-section" id="todos-los-servicios"><div className="container">
    <div className="si-intro"><div><p className="si-kicker">CATÁLOGO DE SOLUCIONES · CÓMPLICE LAB</p><h2>Cinco soluciones para<br/><em>que tu negocio avance.</em></h2></div><p>No tienes que saber de diseño o publicidad. Encuentra lo que quieres lograr y conversemos sobre cómo hacerlo.</p></div>
    <div className="si-list">{order.map(([slug,num,Icon,copy])=>{const item=commercialServices.find(service=>service.slug===slug);if(!item)return null;return <a className="si-item" key={slug} href={serviceHref(slug)}>
      <span className="si-number">{num}</span><span className="si-icon"><Icon size={25} strokeWidth={1.45}/></span><span className="si-service-name">{item.name}</span><span className="si-description">{copy}</span><span className="si-arrow"><ArrowUpRight size={24}/></span>
    </a>})}</div>
    <p className="si-footnote">¿Tu necesidad combina varios servicios? <a href="https://api.whatsapp.com/send?phone=573161772880&text=Hola%2C%20quiero%20hablar%20sobre%20una%20soluci%C3%B3n%20a%20medida%20para%20mi%20negocio." target="_blank" rel="noopener noreferrer">Hablemos de una solución a tu medida <ArrowUpRight size={16}/></a></p>
  </div></section>;
}
