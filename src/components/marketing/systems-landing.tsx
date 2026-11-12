import { createContext, useContext, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown, Clock3, Database, LayoutDashboard, MessageCircle, Sparkles, Workflow } from "lucide-react";
import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";
import "./systems-landing.css";
import { SystemsStoryboards } from "./systems-storyboard";
import { SystemsPains } from "./systems-pains";
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

const questions = [
  {title:"¿Qué te está costando más hoy?",options:["Los contactos llegan, pero se pierden","Mi equipo pierde tiempo en tareas manuales","Mis herramientas están desconectadas"]},
  {title:"¿Qué te gustaría tener más organizado?",options:["CRM y oportunidades","Agendamiento y atención","Todo el proceso en un mismo sistema"]},
  {title:"¿Qué debería mejorar primero?",options:["La atención al cliente","El seguimiento comercial","La visibilidad de lo que ocurre"]}
] as const;
function Closing(){
 const [step,setStep]=useState(0);
 const [answers,setAnswers]=useState<string[]>([]);
 const open=useContext(BookingOpenContext);
 const finished=step>=questions.length;
 const choose=(text:string)=>{setAnswers(x=>[...x.slice(0,step),text]);setStep(x=>x+1)};
 const restart=()=>{setStep(0);setAnswers([])};
 const insight=answers.includes("Los contactos llegan, pero se pierden")||answers.includes("CRM y oportunidades")?"Conectar el primer contacto con un CRM y un seguimiento visible podría ser un buen punto de partida.":answers.includes("Mi equipo pierde tiempo en tareas manuales")||answers.includes("Agendamiento y atención")?"Revisar las tareas repetitivas y los pasos de atención puede revelar qué conviene automatizar.":"Podemos revisar cómo conectar tus procesos para que tu equipo tenga más contexto y control.";
 return <section className="sys-closing" id="orientacion"><div className="sys-wrap sys-closing-layout"><div className="sys-closing-copy"><span className="sys-closing-marker">EMPECEMOS POR TU NEGOCIO</span><h2>¿Por dónde <em>empezaríamos?</em></h2><p>Responde tres preguntas rápidas y descubre qué parte de tu operación valdría la pena revisar primero. Después podemos aterrizarlo en un diagnóstico.</p><div className="sys-quiz-foot"><span className="sys-quiz-dot"/> Tu sistema empieza con una buena pregunta.</div></div><div className="sys-closing-card">
 {!finished?<><div className="sys-quiz-progress">{questions.map((q,i)=><span key={q.title} className={i<=step?"active":""}/>)}</div><span className="sys-quiz-index">PREGUNTA {step+1} DE {questions.length}</span><h3>{questions[step]?.title}</h3><div className="sys-quiz-options">{questions[step]?.options.map(option=><button type="button" key={option} onClick={()=>choose(option)}><span>{option}</span><i/></button>)}</div>{step>0?<button type="button" className="sys-quiz-back" onClick={()=>setStep(x=>Math.max(0,x-1))}>← Volver a la anterior</button>:null}</>:<><div className="sys-quiz-progress">{questions.map((q)=><span key={q.title} className="active"/>)}</div><span className="sys-quiz-index">TU PRIMERA ORIENTACIÓN</span><h3>Ya tenemos un punto de partida.</h3><p className="sys-quiz-insight">{insight}</p><div className="sys-quiz-notice">Es una orientación ilustrativa, no un diagnóstico definitivo.</div><button className="sys-quiz-book" type="button" onClick={open}>Agendar diagnóstico <ArrowUpRight size={17}/></button><button type="button" className="sys-quiz-back" onClick={restart}>Volver a empezar</button></>}
 </div></div></section>
}

function Questions(){const [open,setOpen]=useState<number|null>(0);const items=[
 ["¿Qué es un sistema con IA a la medida?","Es una solución construida para la forma en que trabaja tu negocio. Puede unir registro de contactos, agenda, automatizaciones, paneles y funciones de IA según las necesidades reales."],
 ["¿Necesito cambiar todas mis herramientas?","No necesariamente. Primero revisamos qué ya tienes, qué funciona y qué conviene conectar, mejorar o construir."],
 ["¿Incluye una página web o un agente de IA?","Pueden formar parte de un sistema más amplio cuando el proyecto lo necesita. También se pueden contratar como servicios independientes; el alcance se define antes de construir."],
 ["¿Trabajan con empresas fuera de Manizales?","Sí. Trabajamos de forma online con profesionales y empresas en Colombia y otros mercados."]
];return <section className="sys-faq"><div className="sys-wrap sys-faq-layout"><div><div className="sys-section-label">04 / RESPUESTAS CLARAS</div><h2>Lo importante es que <em>entiendas qué estás construyendo.</em></h2></div><div>{items.map(([q,a],i)=><div className="sys-faq-item" key={q}><button type="button" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}>{q}<ChevronDown size={19}/></button>{open===i?<p>{a}</p>:null}</div>)}</div></div></section>}

export function SystemsLanding(){const [bookingOpen,setBookingOpen]=useState(false);return <BookingOpenContext.Provider value={()=>setBookingOpen(true)}><div className="sys-page">
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Service","name":"Sistemas con IA a la medida","description":"Sistemas con inteligencia artificial para conectar la captación, el CRM, la agenda, los procesos y el seguimiento según las necesidades de profesionales y empresas.","serviceType":"Sistemas con IA a la medida","url":"https://complicelab.com/sistemas-ia-a-la-medida","provider":{"@type":"Organization","@id":"https://complicelab.com/#organization","name":"Cómplice Lab","url":"https://complicelab.com/"},"areaServed":[{"@type":"Country","name":"Colombia"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"Mexico"}]})}}/>
<header className="sys-navigation"><div className="sys-nav-inner"><BrandMark/><nav aria-label="Navegación de servicios"><a href="/">Inicio</a><a href="#recorrido-sistema">Cómo funciona</a><a href="#sistemas-construidos">Proyectos</a><a href="#diagnostico">Contacto</a></nav><Action>Agendar diagnóstico</Action></div></header>
<main><section className="sys-hero"><div className="sys-hero-ambient"/><div className="sys-wrap sys-hero-layout"><div className="sys-hero-copy"><span className="sys-eyebrow"><span/> SISTEMAS CON INTELIGENCIA ARTIFICIAL</span><h1>Sistemas con IA <em>a la medida de tu negocio.</em></h1><p>Construimos el sistema que conecta tu información, tus procesos y tu equipo para que cada oportunidad tenga un siguiente paso claro.</p><div className="sys-hero-actions"><Action>Agendar diagnóstico</Action><a href="#situaciones-reales">Mira qué podemos resolver <ArrowRight size={17}/></a></div><div className="sys-hero-micro"><CheckCircle2 size={16}/> Sin plantillas genéricas. Primero entendemos tu operación.</div></div><div id="ejemplo" className="sys-hero-showcase"><SystemDemo/><div className="sys-hero-visual-caption">Simulación interactiva de un posible sistema. No representa datos reales de clientes.</div></div></div><div className="sys-hero-bottom"><span>ESTRATEGIA</span><i/><span>DISEÑO DEL PROCESO</span><i/><span>CONSTRUCCIÓN CON IA</span><i/><span>SEGUIMIENTO</span></div></section>
<SystemsPains/><SystemsStoryboards/><SystemsProjects/><Closing/><Questions/><section id="diagnostico" className="sys-booking-section"><div className="sys-wrap"><div className="sys-booking-heading"><span>AGENDA TU DIAGNÓSTICO</span><h2>El siguiente sistema puede ser <em>el de tu negocio.</em></h2><p>Cuéntanos qué necesitas construir. Elige un horario real disponible y conversemos por videollamada.</p></div><SystemsBooking/></div></section>
<div className="sys-other-services sys-wrap"><span>OTRAS SOLUCIONES DE CÓMPLICE LAB</span><div><a href="/agentes-de-ia">Agentes de IA <ArrowUpRight size={16}/></a><a href="/paginas-web">Páginas Web <ArrowUpRight size={16}/></a><a href="/publicidad-digital">Publicidad Digital <ArrowUpRight size={16}/></a></div></div></main><SiteFooter/><WhatsAppFloat/>
{bookingOpen?<SystemsBooking modal onClose={()=>setBookingOpen(false)}/>:null}</div></BookingOpenContext.Provider>}
