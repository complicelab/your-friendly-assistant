import { useState } from "react";
import { ArrowRight, ArrowUpRight, Bell, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, Database, LayoutDashboard, MessageCircle, MoveUpRight, Sparkles, Workflow } from "lucide-react";
import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import "./systems-landing.css";

const contact = "https://api.whatsapp.com/send?phone=573161772880&text=" + encodeURIComponent("Hola, quiero agendar un diagnóstico para construir un sistema con IA a la medida de mi negocio.");

const stages = [
  { title:"Llegó una oportunidad", eyebrow:"01 · ENTRADA", description:"Una persona escribe, agenda o deja sus datos. El sistema registra de dónde viene y qué necesita.", chip:"Contacto recibido", type:"inbox" },
  { title:"La información queda en su lugar", eyebrow:"02 · ORGANIZACIÓN", description:"Tu equipo ve el contacto, su necesidad y el estado del proceso en un mismo lugar.", chip:"Contacto organizado", type:"crm" },
  { title:"Cada oportunidad tiene un siguiente paso", eyebrow:"03 · SEGUIMIENTO", description:"El sistema ayuda a activar recordatorios, tareas o automatizaciones de acuerdo con lo que definamos.", chip:"Seguimiento preparado", type:"follow" },
  { title:"Puedes entender qué está pasando", eyebrow:"04 · VISIBILIDAD", description:"Un panel reúne lo que tu negocio necesita observar: entradas, pendientes y acciones por resolver.", chip:"Vista administrativa", type:"panel" },
] as const;

function Action({children,secondary=false}:{children:React.ReactNode;secondary?:boolean}) { return <a className={secondary?"sys-action sys-action-secondary":"sys-action"} href={contact} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={17}/></a> }

function SystemDemo({compact=false}:{compact?:boolean}) {
 const [active,setActive]=useState(0);
 const item=stages[active]!;
 return <div className={compact?"sys-demo sys-demo-compact":"sys-demo"} aria-label="Demostración conceptual de un sistema con IA">
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

function SystemsJourney() {
 const [active,setActive]=useState(0);
 return <section id="como-funciona" className="sys-journey"><div className="sys-wrap"><div className="sys-section-label">01 / LO QUE CAMBIA</div><div className="sys-journey-top"><h2>Tu negocio no necesita más herramientas.<br/><em>Necesita que trabajen juntas.</em></h2><p>Cuando la información vive en varios lugares, el equipo pierde tiempo buscando qué pasó y qué debe hacer. Diseñamos un recorrido claro para cada oportunidad.</p></div>
 <div className="sys-journey-content"><div className="sys-journey-steps">{stages.map((s,i)=><button key={s.title} className={"sys-journey-step "+(active===i?"is-active":"")} type="button" onClick={()=>setActive(i)} aria-pressed={active===i}><span className="sys-step-num">0{i+1}</span><span className="sys-step-text"><strong>{s.title}</strong>{active===i?<small>{s.description}</small>:null}</span><MoveUpRight size={17}/></button>)}</div><div className="sys-journey-preview"><div className="sys-journey-frame"><span>EL RECORRIDO / ETAPA 0{active+1}</span><div className="sys-journey-visual"><div className="sys-journey-flow-dot"><CheckCircle2 size={23}/></div><div><small>{stages[active]?.eyebrow}</small><strong>{stages[active]?.chip}</strong><p>{stages[active]?.description}</p></div></div><div className="sys-journey-line">{stages.map((s,i)=><div key={s.eyebrow} className={i<=active?"is-active":""}/>)}</div></div><div className="sys-journey-caption">Recorrido ilustrativo. El flujo real se define según tu negocio.</div></div></div></div></section>
}

const capabilities=[
 {number:"01",title:"Un lugar para cada oportunidad",text:"Información comercial organizada para saber quién llegó, qué necesita y quién debe atenderlo.",icon:Database},
 {number:"02",title:"Procesos que no dependen de la memoria",text:"Agendas, tareas, avisos y automatizaciones conectadas al funcionamiento del equipo.",icon:CalendarDays},
 {number:"03",title:"Una visión clara del negocio",text:"Paneles administrativos e indicadores útiles para tomar decisiones y no perder seguimiento.",icon:LayoutDashboard}
];
function Capabilities(){return <section className="sys-capabilities"><div className="sys-wrap"><div className="sys-section-label">02 / CONSTRUIDO A TU MEDIDA</div><div className="sys-capabilities-heading"><h2>No empiezas comprando un software.<br/><em>Empezamos entendiendo tu negocio.</em></h2><p>Puede ser una función puntual, un sistema administrativo o un ecosistema completo. No añadimos módulos solo para que parezca más grande.</p></div><div className="sys-capabilities-list">{capabilities.map(x=><article key={x.title}><div className="sys-cap-icon"><x.icon size={24}/></div><div><span>{x.number} / POSIBILIDAD</span><h3>{x.title}</h3><p>{x.text}</p></div><ArrowUpRight size={19}/></article>)}</div></div></section>}

function Closing(){return <section className="sys-closing"><div className="sys-wrap sys-closing-layout"><div><span className="sys-section-label">03 / TU SIGUIENTE PASO</span><h2>Cuéntanos cómo funciona tu negocio.<br/><em>Te ayudamos a conectar lo que falta.</em></h2><p>Revisamos contigo dónde se están perdiendo oportunidades, qué necesita tu equipo y qué vale la pena construir. Sin ofrecerte un sistema genérico.</p><Action>Hablemos de tu sistema</Action></div><div className="sys-closing-card"><span>ASÍ EMPEZAMOS</span><div><b>01</b> Entendemos el recorrido actual</div><div><b>02</b> Definimos qué debe resolver el sistema</div><div><b>03</b> Construimos y probamos por etapas</div><div className="sys-closing-end"><CheckCircle2 size={18}/> Una solución según tu operación, no al revés</div></div></div></section>}

function Questions(){const [open,setOpen]=useState<number|null>(0);const items=[
 ["¿Qué es un sistema con IA a la medida?","Es una solución construida para la forma en que trabaja tu negocio. Puede unir registro de contactos, agenda, automatizaciones, paneles y funciones de IA según las necesidades reales."],
 ["¿Necesito cambiar todas mis herramientas?","No necesariamente. Primero revisamos qué ya tienes, qué funciona y qué conviene conectar, mejorar o construir."],
 ["¿Incluye una página web o un agente de IA?","Pueden formar parte de un sistema más amplio cuando el proyecto lo necesita. También se pueden contratar como servicios independientes; el alcance se define antes de construir."],
 ["¿Trabajan con empresas fuera de Manizales?","Sí. Trabajamos de forma online con profesionales y empresas en Colombia y otros mercados."]
];return <section className="sys-faq"><div className="sys-wrap sys-faq-layout"><div><div className="sys-section-label">04 / RESPUESTAS CLARAS</div><h2>Lo importante es que <em>entiendas qué estás construyendo.</em></h2></div><div>{items.map(([q,a],i)=><div className="sys-faq-item" key={q}><button type="button" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}>{q}<ChevronDown size={19}/></button>{open===i?<p>{a}</p>:null}</div>)}</div></div></section>}

export function SystemsLanding(){return <div className="sys-page">
<header className="sys-navigation"><div className="sys-nav-inner"><BrandMark/><nav aria-label="Navegación de servicios"><a href="/">Inicio</a><a href="#como-funciona">Cómo funciona</a><a href="#ejemplo">Ejemplo visual</a></nav><Action>Agendar diagnóstico</Action></div></header>
<main><section className="sys-hero"><div className="sys-hero-ambient"/><div className="sys-wrap sys-hero-layout"><div className="sys-hero-copy"><span className="sys-eyebrow"><span/> SISTEMAS CON INTELIGENCIA ARTIFICIAL</span><h1>Sistemas con IA <em>a la medida de tu negocio.</em></h1><p>Construimos el sistema que conecta tu información, tus procesos y tu equipo para que cada oportunidad tenga un siguiente paso claro.</p><div className="sys-hero-actions"><Action>Agendar diagnóstico</Action><a href="#como-funciona">Mira cómo funciona <ArrowRight size={17}/></a></div><div className="sys-hero-micro"><CheckCircle2 size={16}/> Sin plantillas genéricas. Primero entendemos tu operación.</div></div><div id="ejemplo" className="sys-hero-showcase"><SystemDemo/><div className="sys-hero-visual-caption">Simulación interactiva de un posible sistema. No representa datos reales de clientes.</div></div></div><div className="sys-hero-bottom"><span>ESTRATEGIA</span><i/><span>DISEÑO DEL PROCESO</span><i/><span>CONSTRUCCIÓN CON IA</span><i/><span>SEGUIMIENTO</span></div></section>
<SystemsJourney/><Capabilities/><Closing/><Questions/>
<div className="sys-other-services sys-wrap"><span>OTRAS SOLUCIONES DE CÓMPLICE LAB</span><div><a href="/agentes-de-ia">Agentes de IA <ArrowUpRight size={16}/></a><a href="/paginas-web">Páginas Web <ArrowUpRight size={16}/></a><a href="/publicidad-digital">Publicidad Digital <ArrowUpRight size={16}/></a></div></div></main><SiteFooter/><WhatsAppFloat/>
</div>}
