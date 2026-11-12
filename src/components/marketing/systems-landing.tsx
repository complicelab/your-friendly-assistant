import { createContext, useContext, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown, Clock3, Database, LayoutDashboard, MessageCircle, Sparkles, Workflow } from "lucide-react";
import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import "./systems-landing.css";
import { SystemsStoryboards } from "./systems-storyboard";
import { SystemsEightFlow } from "./systems-eight-flow";
import { SystemsProjects } from "./systems-projects";
import { SystemsBooking } from "./systems-booking";

const BookingOpenContext=createContext<()=>void>(()=>{});

const stages = [
  { title:"Llegó una oportunidad", eyebrow:"01 · ENTRADA", description:"Una persona escribe, agenda o deja sus datos. El sistema registra de dónde viene y qué necesita.", chip:"Contacto recibido", type:"inbox" },
  { title:"La información queda en su lugar", eyebrow:"02 · ORGANIZACIÓN", description:"Tu equipo ve el contacto, su necesidad y el estado del proceso en un mismo lugar.", chip:"Contacto organizado", type:"crm" },
  { title:"Cada oportunidad tiene un siguiente paso", eyebrow:"03 · SEGUIMIENTO", description:"El sistema ayuda a activar recordatorios, tareas o automatizaciones de acuerdo con lo que definamos.", chip:"Seguimiento preparado", type:"follow" },
  { title:"Puedes entender qué está pasando", eyebrow:"04 · VISIBILIDAD", description:"Un panel reúne lo que tu negocio necesita observar: entradas, pendientes y acciones por resolver.", chip:"Vista administrativa", type:"panel" },
] as const;

function Action({children}:{children:ReactNode}) { const open=useContext(BookingOpenContext);return <button className="sys-action" type="button" onClick={open}>{children}<ArrowUpRight size={17}/></button> }

function SystemDemo() {
 const [active,setActive]=useState(0);
 const item=stages[active]!;
 return <div className="sys-demo" aria-label="Demostración conceptual de un sistema con IA">
  <div className="sys-demo-top"><div className="sys-demo-brand"><span className="sys-demo-mark">C<span>•</span></span><span>CÓMPLICE LAB <small>DEMO CONCEPTUAL</small></span></div><div className="sys-demo-live"><span/> Vista interactiva</div></div>
  <div className="sys-demo-shell">
   <div className="sys-demo-sidebar"><div className="sys-sidebar-label">MI NEGOCIO</div>{[{icon:MessageCircle,label:"Entradas"},{icon:Database,label:"Contactos"},{icon:Workflow,label:"Seguimiento"},{icon:LayoutDashboard,label:"Indicadores"}].map((x,i)=><button type="button" key={x.label} className={active===i?"is-active":""} onClick={()=>setActive(i)} aria-pressed={active===i}><x.icon size={17}/><span>{x.label}</span></button>)}<div className="sys-sidebar-bottom"><Sparkles size={14}/> Sistema conectado</div></div>
   <div className="sys-demo-main"><div className="sys-demo-meta"><span>VISTA DEL PROCESO</span><span><span className="sys-mini-dot"/> EJEMPLO ILUSTRATIVO</span></div><div className="sys-demo-heading"><div><small>{item.eyebrow}</small><h3>{item.title}</h3></div><span className="sys-demo-check"><Check size={19}/></span></div>
    <div className="sys-demo-dynamic" key={active}>
     {active===0?<><div className="sys-mock-message"><div className="sys-avatar">CL</div><div><strong>Nueva consulta recibida</strong><span>Hola, quisiera conocer cómo funciona el servicio y agendar una conversación.</span><small>Desde formulario web · Hace un momento</small></div></div><div className="sys-demo-status"><CheckCircle2 size={15}/> Registro inicial creado</div></>:null}
     {active===1?<><div className="sys-mock-profile"><div className="sys-avatar">CL</div><div><small>FICHA DE CONTACTO</small><strong>Nueva oportunidad</strong><span>Interés: solicitar información</span></div><span className="sys-status-pill">Por contactar</span></div><div className="sys-mock-fields"><span>Origen: página web</span><span>Siguiente acción: revisar solicitud</span></div></>:null}
     {active===2?<><div className="sys-mock-task"><div className="sys-task-check"><Check size={17}/></div><div><strong>Contacto recibido</strong><span>Información registrada</span></div><small>Completado</small></div><div className="sys-mock-task"><div className="sys-task-next"><Clock3 size={16}/></div><div><strong>Programar siguiente contacto</strong><span>Asignar responsable y recordatorio</span></div><small>Pendiente</small></div></>:null}
     {active===3?<><div className="sys-mock-stats"><div><small>OPORTUNIDADES</small><strong>Registro centralizado</strong></div><div><small>SEGUIMIENTO</small><strong>Pendientes visibles</strong></div></div><div className="sys-mock-bars"><i/><i/><i/><i/><i/><i/><i/></div><span className="sys-mock-disclaimer">Vista de ejemplo, sin cifras reales</span></>:null}
    </div>
    <div className="sys-demo-progress"><span>{item.chip}</span><div>{stages.map((s,i)=><button type="button" key={s.eyebrow} aria-label={"Ver etapa "+(i+1)} aria-pressed={active===i} onClick={()=>setActive(i)} className={active===i?"is-active":""}/>)}</div></div>
   </div>
  </div>
  <div className="sys-demo-footer"><span><span className="sys-demo-pulse"/> Así puede funcionar un sistema a medida</span><button type="button" onClick={()=>setActive((active+1)%stages.length)}>Explorar siguiente etapa <ArrowRight size={16}/></button></div>
 </div>
}

function Closing(){return <section className="sys-closing"><div className="sys-wrap sys-closing-layout"><div><span className="sys-section-label">03 / TU SIGUIENTE PASO</span><h2>Cuéntanos cómo funciona tu negocio.<br/><em>Te ayudamos a conectar lo que falta.</em></h2><p>Revisamos contigo dónde se están perdiendo oportunidades, qué necesita tu equipo y qué vale la pena construir. Sin ofrecerte un sistema genérico.</p><Action>Agendar diagnóstico</Action></div><div className="sys-closing-card"><span>ASÍ EMPEZAMOS</span><div><b>01</b> Entendemos el recorrido actual</div><div><b>02</b> Definimos qué debe resolver el sistema</div><div><b>03</b> Construimos y probamos por etapas</div><div className="sys-closing-end"><CheckCircle2 size={18}/> Una solución según tu operación, no al revés</div></div></div></section>}

function Questions(){const [open,setOpen]=useState<number|null>(0);const items=[
 ["¿Qué es un sistema con IA a la medida?","Es una solución construida para la forma en que trabaja tu negocio. Puede unir registro de contactos, agenda, automatizaciones, paneles y funciones de IA según las necesidades reales."],
 ["¿Necesito cambiar todas mis herramientas?","No necesariamente. Primero revisamos qué ya tienes, qué funciona y qué conviene conectar, mejorar o construir."],
 ["¿Incluye una página web o un agente de IA?","Pueden formar parte de un sistema más amplio cuando el proyecto lo necesita. También se pueden contratar como servicios independientes; el alcance se define antes de construir."],
 ["¿Trabajan con empresas fuera de Manizales?","Sí. Trabajamos de forma online con profesionales y empresas en Colombia y otros mercados."]
];return <section className="sys-faq"><div className="sys-wrap sys-faq-layout"><div><div className="sys-section-label">04 / RESPUESTAS CLARAS</div><h2>Lo importante es que <em>entiendas qué estás construyendo.</em></h2></div><div>{items.map(([q,a],i)=><div className="sys-faq-item" key={q}><button type="button" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}>{q}<ChevronDown size={19}/></button>{open===i?<p>{a}</p>:null}</div>)}</div></div></section>}

export function SystemsLanding(){const [bookingOpen,setBookingOpen]=useState(false);return <BookingOpenContext.Provider value={()=>setBookingOpen(true)}><div className="sys-page">
<header className="sys-navigation"><div className="sys-nav-inner"><BrandMark/><nav aria-label="Navegación de servicios"><a href="/">Inicio</a><a href="#captacion">Cómo funciona</a><a href="#ejemplo">Ejemplo visual</a></nav><Action>Agendar diagnóstico</Action></div></header>
<main><section className="sys-hero"><div className="sys-hero-ambient"/><div className="sys-wrap sys-hero-layout"><div className="sys-hero-copy"><span className="sys-eyebrow"><span/> SISTEMAS CON INTELIGENCIA ARTIFICIAL</span><h1>Sistemas con IA <em>a la medida de tu negocio.</em></h1><p>Construimos el sistema que conecta tu información, tus procesos y tu equipo para que cada oportunidad tenga un siguiente paso claro.</p><div className="sys-hero-actions"><Action>Solicitar diagnóstico</Action><a href="#como-funciona">Mira cómo funciona <ArrowRight size={17}/></a></div><div className="sys-hero-micro"><CheckCircle2 size={16}/> Sin plantillas genéricas. Primero entendemos tu operación.</div></div><div id="ejemplo" className="sys-hero-showcase"><SystemDemo/><div className="sys-hero-visual-caption">Simulación interactiva de un posible sistema. No representa datos reales de clientes.</div></div></div><div className="sys-hero-bottom"><span>ESTRATEGIA</span><i/><span>DISEÑO DEL PROCESO</span><i/><span>CONSTRUCCIÓN CON IA</span><i/><span>SEGUIMIENTO</span></div></section>
<SystemsEightFlow/><SystemsStoryboards/><SystemsProjects/><Closing/><Questions/><section id="diagnostico" className="sys-booking-section"><div className="sys-wrap"><div className="sys-booking-heading"><span>AGENDA TU DIAGNÓSTICO</span><h2>El siguiente sistema puede ser <em>el de tu negocio.</em></h2><p>Cuéntanos qué necesitas construir. Elige un horario real disponible y conversemos por videollamada.</p></div><SystemsBooking/></div></section>
<div className="sys-other-services sys-wrap"><span>OTRAS SOLUCIONES DE CÓMPLICE LAB</span><div><a href="/agentes-de-ia">Agentes de IA <ArrowUpRight size={16}/></a><a href="/paginas-web">Páginas Web <ArrowUpRight size={16}/></a><a href="/publicidad-digital">Publicidad Digital <ArrowUpRight size={16}/></a></div></div></main><SiteFooter/><WhatsAppFloat/>
{bookingOpen?<SystemsBooking modal onClose={()=>setBookingOpen(false)}/>:null}</div></BookingOpenContext.Provider>}
