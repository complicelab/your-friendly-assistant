import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Bell, Bot, CalendarCheck2, CalendarDays, Check, CheckCircle2, Clock3, Database, LayoutDashboard, MessageCircle, MousePointer2, Send, Sparkles, UserRound, Workflow } from "lucide-react";
import "./systems-storyboard.css";
import { SearchScene, AgendaScene, CampaignScene, MetricsScene } from "./systems-eight-flow";

/**
 * All scenes are simulations with invented interface labels, not real clients,
 * not connected to CRM, WhatsApp API, or analytics. Independent, in-view timers
 * follow the homepage demo model: reveal / typed state / manual replay.
 */
const entries = [
 { number:"01", eyebrow:"DESCUBRIMIENTO", title:"Primero, alguien necesita encontrarte.", accent:"Y entender por qué elegirte.", text:"Tu presencia digital ayuda a que una persona conozca tu propuesta y pueda dar el siguiente paso. El sistema se diseña alrededor de esa primera oportunidad, sin prometer posiciones en buscadores.", tags:["Visibilidad","Confianza","Primer contacto"], duration:5 },
 { number:"02", eyebrow:"WEB + CAPTACIÓN", title:"Tu página recibe la oportunidad.", accent:"Y el contacto ya tiene dónde llegar.", text:"Una persona llena un formulario. La demostración muestra cómo sus datos pasan a la ficha de un CRM en lugar de quedarse en un correo olvidado.", tags:["Página web","Formulario","CRM"], duration:5 },
 { number:"03", eyebrow:"AGENDA CONECTADA", title:"La persona puede elegir cuándo hablar.", accent:"Y dejar su cita organizada.", text:"Cuando el proyecto incluye agendamiento, el visitante selecciona un horario disponible. El equipo puede gestionar la solicitud sin llamadas de ida y vuelta.", tags:["Agenda","Disponibilidad","Cita"], duration:5 },
 { number:"04", eyebrow:"ATENCIÓN CON IA", title:"Tu agente conversa con el cliente.", accent:"Y recoge lo que necesita.", text:"Un asistente puede responder dudas iniciales, orientar hacia una cita y dejar el contexto para el equipo. Aquí se ve la conversación paso por paso.", tags:["Agente IA","Conversación","Contexto"], duration:7 },
 { number:"05", eyebrow:"CRM A TU MEDIDA", title:"Cada oportunidad entra en tu CRM.", accent:"Y avanza con información.", text:"La ficha muestra quién llegó, su interés, la etapa comercial y la próxima acción. Puedes ver cómo el contacto cambia de estado.", tags:["CRM","Estados","Seguimiento"], duration:5 },
 { number:"06", eyebrow:"PANEL ADMINISTRATIVO", title:"Tu equipo sabe lo que tiene pendiente.", accent:"Sin buscar en cinco lugares.", text:"Un espacio administrativo reúne contactos, agenda, responsables y tareas según el trabajo diario de tu negocio.", tags:["Panel","Equipo","Control"], duration:5 },
 { number:"07", eyebrow:"CAMPAÑAS Y SEGUIMIENTO", title:"Tus clientes también pueden recibir algo especial.", accent:"Y tener una razón para volver.", text:"Imagina una campaña de Amor y Amistad: tus contactos autorizados reciben una invitación a conocer un bono de regalo. El sistema puede ayudarte a preparar el mensaje y continuar la conversación. Aquí ves un ejemplo, no un envío real.", tags:["Amor y Amistad","WhatsApp","Bono de regalo"], duration:5 },
 { number:"08", eyebrow:"INDICADORES", title:"Finalmente, sabes qué está pasando.", accent:"Y qué necesita atención.", text:"El panel revela las oportunidades, las citas, las tareas y los indicadores que realmente ayudan a tomar decisiones. Los datos de la visual son ilustrativos.", tags:["Indicadores","Trazabilidad","Decisiones"], duration:5 },
] as const;

function useKineticScene(duration=5) {
 const ref=useRef<HTMLElement>(null);
 const [inView,setInView]=useState(false);
 const [step,setStep]=useState(0);
 const [reduce,setReduce]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>setReduce(media.matches);update();
  media.addEventListener?.("change",update);
  return()=>media.removeEventListener?.("change",update);
 },[]);
 useEffect(()=>{
  const node=ref.current;if(!node)return;
  if(!("IntersectionObserver" in window)){setInView(true);return;}
  const ob=new IntersectionObserver((items)=>setInView(Boolean(items[0]?.isIntersecting)),{threshold:.18});
  ob.observe(node);return()=>ob.disconnect();
 },[]);
 useEffect(()=>{
  if(!inView||reduce)return;
  const id=window.setInterval(()=>setStep(x=>(x+1)%duration),1350);
  return()=>window.clearInterval(id);
 },[inView,reduce,duration]);
 const select=(n:number)=>setStep(n);
 return {ref,step,reduce,select};
}
function V({on,children,className=""}:{on:boolean;children:ReactNode;className?:string}){return <div className={"sk-reveal "+className+(on?" on":"")}>{children}</div>}
function Dots(){return <span className="sk-window-dots"><i/><i/><i/></span>}
function Cursor({active}:{active:boolean}){return <span className={"sk-cursor "+(active?"on":"")} aria-hidden="true"><MousePointer2 size={18} fill="currentColor"/></span>}
function DemoFrame({label,children,className=""}:{label:string;children:ReactNode;className?:string}){return <div className={"sk-frame "+className}><div className="sk-frame-top"><Dots/><span>{label}</span><span className="sk-frame-pill">DEMO</span></div>{children}</div>}
function LeadsScene({step}:{step:number}){return <div className="sk-leads-scene">
 <div className="sk-leads-web"><DemoFrame label="tusitio.com/contacto" className="sk-leads-browser"><div className="sk-leads-hero"><div className="sk-leads-symbol">✳</div><small>ATENCIÓN PERSONALIZADA</small><h3>Conversemos sobre lo que necesitas.</h3><p>Déjanos tus datos y te contactaremos.</p></div><div className="sk-leads-form"><label>Nombre <span className={"sk-faux-input "+(step>=1?"is-filled":"")}>{step>=1?"Valeria Gómez":""}{step===1?<i className="sk-type-caret"/>:null}</span></label><label>¿En qué podemos ayudarte? <span className={"sk-faux-input "+(step>=2?"is-filled":"")}>{step>=2?"Quiero conocer el servicio":""}</span></label><div className={"sk-leads-submit "+(step>=3?"is-sent":"")}>{step>=3?<><Check size={15}/> Solicitud enviada</>:"Enviar solicitud"} <Cursor active={step===2}/></div></div></DemoFrame></div>
 <div className="sk-bridge"><div className="sk-bridge-line"/><div className={"sk-bridge-packet "+(step>=3?"on":"")}><ArrowRight size={18}/></div><span>CONEXIÓN</span></div>
 <div className="sk-leads-crm"><div className="sk-mini-label"><Database size={15}/> CRM · Contactos</div><V on={step>=3}><div className="sk-contact-pop"><div className="sk-avatar">VG</div><div><small>NUEVA OPORTUNIDAD</small><strong>Valeria Gómez</strong><span>Interés: conocer el servicio</span></div><CheckCircle2 size={21}/></div></V><V on={step>=4}><div className="sk-leads-stamps"><span>Origen: Web</span><span>Estado: Pendiente de atención</span></div><div className="sk-complete-note"><Check size={15}/> Contacto registrado en el ejemplo</div></V></div>
 </div>}

function AgentScene({step}:{step:number}){
 const chatRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const chat=chatRef.current;
  if(!chat)return;
  const frame=window.requestAnimationFrame(()=>{
   chat.scrollTo({top:step===0?0:chat.scrollHeight,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  });
  return()=>window.cancelAnimationFrame(frame);
 },[step]);
 const analysis=[
  {at:1,number:"01",heading:"Entiende la intención",detail:"La persona quiere agendar",symbol:MessageCircle},
  {at:3,number:"02",heading:"Pregunta lo necesario",detail:"Es su primera consulta",symbol:Bot},
  {at:5,number:"03",heading:"Recoge el contexto",detail:"Prefiere esta semana",symbol:CalendarDays},
  {at:6,number:"04",heading:"Prepara el siguiente paso",detail:"Solicitud lista para el equipo",symbol:Database},
 ];
 return <div className="sk-ai-stage" aria-label="Conversación ilustrativa de un agente de IA que atiende una solicitud y organiza el contexto">
  <div className="sk-ai-device-column">
   <div className="sk-ai-signal" aria-hidden="true"><span/><span/><span/></div>
   <div className="sk-ai-phone">
    <div className="sk-ai-status"><strong>9:41</strong><span className="sk-ai-island"/><span>●●● ▰</span></div>
    <div className="sk-ai-chat-header"><span className="sk-ai-chevron">‹</span><span className="sk-ai-avatar"><Bot size={21}/></span><span className="sk-ai-contact"><strong>Asistente de atención</strong><small>WhatsApp · Ejemplo de conversación</small></span><span className="sk-ai-menu">⋮</span></div>
    <div className="sk-ai-chat-body" ref={chatRef}>
     <span className="sk-ai-day">Hoy</span>
     <div className="sk-ai-bubble sk-ai-customer">Hola, ¿puedo agendar una primera consulta?<small>10:24 ✓✓</small></div>
     {step>=1?<div className="sk-ai-bubble sk-ai-agent">¡Claro! ¿Es tu primera consulta o ya has venido?<small>10:24</small></div>:<div className="sk-ai-typing"><i/><i/><i/><span>El agente está leyendo…</span></div>}
     {step>=2?<div className="sk-ai-bubble sk-ai-customer">Es mi primera vez.<small>10:25 ✓✓</small></div>:null}
     {step>=3?<div className="sk-ai-bubble sk-ai-agent">Perfecto. ¿Prefieres esta semana o la próxima?<small>10:25</small></div>:null}
     {step>=4?<div className="sk-ai-bubble sk-ai-customer">Esta semana, por favor.<small>10:26 ✓✓</small></div>:null}
     {step>=5?<div className="sk-ai-bubble sk-ai-agent">Gracias. Dejo tu solicitud lista para consultar horarios y continuar con el equipo.<small>10:26</small></div>:null}
     {step>=6?<div className="sk-ai-chat-finish"><CheckCircle2 size={14}/> Solicitud preparada · ejemplo</div>:null}
    </div>
    <div className="sk-ai-compose"><span>Escribe un mensaje…</span><Send size={14}/></div><div className="sk-ai-homebar"><i/></div>
   </div>
   <div className={"sk-ai-insight-chip "+(step>=1?"visible":"")}><Sparkles size={15}/><span>{step>=6?"Contexto listo":step>=5?"Identifica disponibilidad":step>=3?"Hace la pregunta adecuada":"Detecta intención: agendar"}</span></div>
  </div>
  <div className="sk-ai-explainer">
   <div className="sk-ai-brain"><div className="sk-ai-brain-mark"><Sparkles size={23}/></div><div><span>ASISTENTE CON IA</span><strong>Entiende y acompaña</strong></div><i/></div>
   <div className="sk-ai-analysis-steps">{analysis.map(item=>{
    const Icon=item.symbol;const done=step>=item.at;const current=done&&step<(analysis.find(x=>x.at>item.at)?.at??7);
    return <div key={item.number} className={"sk-ai-analysis-step "+(done?"is-complete ":"")+(current?"is-current":"")}>
     <div className="sk-ai-step-marker"><span>{done?<Check size={13}/>:item.number}</span></div>
     <div className="sk-ai-step-copy"><strong>{item.heading}</strong><small>{item.detail}</small></div>
     <Icon size={15} className="sk-ai-step-icon"/>
    </div>;
   })}</div>
   <div className={"sk-ai-handoff "+(step>=6?"is-ready":"")}>
    <div><Database size={18}/><span>FICHA PARA EL EQUIPO</span></div>
    <strong>Valeria Gómez</strong>
    <small>Primera consulta · Esta semana</small>
    <span className="sk-ai-handoff-status"><CheckCircle2 size={13}/>{step>=6?"Contexto listo para continuar":"Se prepara con la conversación"}</span>
   </div>
   <div className="sk-ai-microcopy">Así el equipo conoce la necesidad antes de continuar la atención.</div>
  </div>
 </div>;
}

function CRMScene({step}:{step:number}){
 const stage=step<=1?0:step===2?1:2;
 const cols=[{name:"Nuevos",status:"Nuevo contacto"},{name:"En conversación",status:"Respondimos al interés"},{name:"Seguimiento",status:"Próxima acción definida"}];
 return <div className="sk-crm-scene"><DemoFrame label="crm.tunegocio.com/oportunidades" className="sk-crm-frame">
  <div className="sk-crm-shell">
   <aside><div className="sk-crm-company">✳ <span>MI NEGOCIO</span></div><div className="sk-crm-sidebar-item active"><Database size={16}/> Contactos</div><div className="sk-crm-sidebar-item"><CalendarDays size={16}/> Agenda</div><div className="sk-crm-sidebar-item"><Workflow size={16}/> Seguimiento</div></aside>
   <div className="sk-crm-workarea">
    <div className="sk-crm-heading"><div><small>GESTIÓN COMERCIAL · DEMO</small><h3>Oportunidades</h3></div><span>Vista por etapas</span></div>
    <div className="sk-kanban">{cols.map((col,i)=><div className={"sk-kanban-column "+(stage===i?"highlight":"")} key={col.name}>
     <div className="sk-kanban-heading"><span className={"sk-column-dot col-"+i}/>{col.name}<b>{stage===i?"01":"—"}</b></div>
     {stage===i?<div key={stage} className="sk-kanban-card sk-card-move"><div className="sk-kanban-avatar">VG</div><strong>Valeria Gómez</strong><small>Primera consulta · Vía web</small><span>{col.status}</span><div className="sk-kanban-progress"><i/></div></div>:<div className="sk-kanban-placeholder"><span>+</span></div>}
    </div>)}</div>
    <div className="sk-crm-bottom"><div className="sk-crm-inspector"><div className="sk-mini-label">FICHA DE CONTACTO</div><b>Valeria Gómez</b><div><span><MessageCircle size={13}/> Consulta recibida</span><span><Clock3 size={13}/> {step>=3?"Próximo contacto agendado":"Próxima acción por definir"}</span><span><UserRound size={13}/> Equipo comercial</span></div></div></div>
   </div>
  </div></DemoFrame>
  <div className={"sk-crm-bubble "+(step>=2?"active":"")}><CheckCircle2 size={18}/><div><strong>{step>=3?"Seguimiento preparado":"Etapa actualizada"}</strong><small>{step>=3?"Hay una próxima acción visible":"Valeria avanza en su proceso"}</small></div></div>
 </div>
}

function FollowScene({step}:{step:number}){return <div className="sk-follow-scene"><DemoFrame label="sistema.com/seguimientos" className="sk-follow-planner"><div className="sk-follow-header"><div><small>AUTOMATIZACIONES</small><h3>Seguimiento</h3></div><span><Workflow size={14}/> Flujo ilustrativo</span></div><div className="sk-follow-timeline">
 <V on={step>=0} className="sk-follow-event"><div className="sk-follow-icon success"><Check size={16}/></div><div><strong>Solicitud recibida</strong><small>Se crea la oportunidad en CRM</small></div><span>01</span></V>
 <V on={step>=1} className="sk-follow-event"><div className="sk-follow-icon"><CalendarCheck2 size={16}/></div><div><strong>Se define el siguiente paso</strong><small>Revisión del responsable</small></div><span>02</span></V>
 <V on={step>=2} className="sk-follow-event"><div className="sk-follow-icon"><Bell size={16}/></div><div><strong>Recordatorio programado</strong><small>La tarea aparece para el equipo</small></div><span>03</span></V>
 <V on={step>=4} className="sk-follow-event"><div className="sk-follow-icon success"><Check size={16}/></div><div><strong>Historial actualizado</strong><small>El equipo puede continuar el proceso</small></div><span>04</span></V>
 </div></DemoFrame><V on={step>=3} className="sk-follow-message"><div className="sk-message-head"><MessageCircle size={19}/><span>WhatsApp · ejemplo de mensaje</span></div><div>Hola, Valeria 👋 Tu solicitud quedó registrada. Nuestro equipo se comunicará contigo para continuar.</div><small>Mensaje de ejemplo · envío no realizado</small></V></div>}

function DashboardScene({step}:{step:number}){
 const actions=[{title:"Nueva solicitud",detail:"Valeria Gómez · Consulta desde web",icon:MessageCircle},{title:"Revisar cita",detail:"Pendiente de confirmar horario",icon:CalendarDays},{title:"Seguimiento",detail:"Asignado al equipo de atención",icon:Clock3}];
 return <div className="sk-dashboard-scene"><DemoFrame label="panel.tunegocio.com/administracion" className="sk-dashboard-frame">
 <div className="sk-dash-app"><aside><div className="sk-dash-mark">✳</div><div className="sk-dash-side active"><LayoutDashboard size={19}/></div><div className="sk-dash-side"><Database size={18}/></div><div className="sk-dash-side"><CalendarDays size={18}/></div><div className="sk-dash-side"><Bell size={18}/></div></aside>
 <div className="sk-dash-body"><div className="sk-dash-heading"><div><small>MI NEGOCIO / PANEL ADMINISTRATIVO</small><h3>Tu operación, a la vista.</h3></div><span className="sk-dash-demo-label">DEMO</span></div>
  <div className="sk-dash-kpis"><div className={step>=0?"lit":""}><small>CONTACTOS</small><strong>Organizados</strong><span><Database size={14}/> Ver fichas</span></div><div className={step>=1?"lit":""}><small>CITAS</small><strong>Agenda visible</strong><span><CalendarDays size={14}/> Ver agenda</span></div><div className={step>=2?"lit":""}><small>SEGUIMIENTO</small><strong>Tareas asignadas</strong><span><Bell size={14}/> Ver tareas</span></div></div>
  <div className="sk-dash-workspace"><div className="sk-dash-activity"><div className="sk-dash-activity-top"><strong>Actividad reciente</strong><small>Hoy · Ejemplo</small></div>{actions.map((item,i)=><div key={item.title} className={"sk-dash-activity-row "+(step>=i+1?"is-new":"")}><span className="sk-dash-activity-icon"><item.icon size={15}/></span><div><b>{item.title}</b><small>{item.detail}</small></div><CheckCircle2 size={15}/></div>)}</div>
   <div className="sk-dash-agenda"><span>PRÓXIMA ACCIÓN</span><div className="sk-dash-task-hero"><CalendarDays size={19}/><strong>Revisar solicitud</strong><small>El equipo puede ver qué sigue pendiente.</small></div><div className={"sk-dash-task-status "+(step>=3?"active":"")}><Check size={13}/>{step>=3?"Responsable informado":"Pendiente de atención"}</div></div>
  </div>
 </div></div></DemoFrame>
 <div className={"sk-panel-toast "+(step>=3?"active":"")}><Bell size={16}/><span>El equipo ve su siguiente paso</span></div>
 </div>
}

const scenes=[SearchScene,LeadsScene,AgendaScene,AgentScene,CRMScene,DashboardScene,CampaignScene,MetricsScene];
function KineticModule({index}:{index:number}) {
 const content=entries[index]!;
 const anim=useKineticScene(content.duration);
 const Scene=scenes[index]!;
 const currentStep=anim.reduce?content.duration-1:anim.step;
 const id=["descubrimiento","captacion","agenda","agente","crm","administracion","campanas","indicadores"][index];
 return <section className={"sk-module sk-module-"+index} id={id} ref={anim.ref}><div className="sys-wrap sk-module-grid">
  <div className="sk-module-copy"><div className="sk-module-top"><span className="sk-module-id">{content.number} / 08</span><span className="sk-module-eyebrow">{content.eyebrow}</span></div><h2>{content.title} <em>{content.accent}</em></h2><p>{content.text}</p><div className="sk-module-tags">{content.tags.map(t=><span key={t}>{t}</span>)}</div></div>
  <div className={"sk-module-art "+([0,2,6,7].includes(index)?"sk-full-scene":"")}><div className="sk-art-glow" aria-hidden="true"/><div className="sk-scene-accent sk-scene-accent-a" aria-hidden="true"/><div className="sk-scene-accent sk-scene-accent-b" aria-hidden="true"/><Scene step={currentStep}/><div className="sk-timeline-controls"><span>ETAPA</span>{Array.from({length:content.duration},(_,i)=><button type="button" key={i} aria-label={"Mostrar momento "+(i+1)+" de la demostración "+content.number} aria-pressed={currentStep===i} onClick={()=>anim.select(i)} className={currentStep===i?"active":""}><i/></button>)}<span>{String(currentStep+1).padStart(2,"0")} / 0{content.duration}</span></div><p className="sk-simulation-note">Demostración conceptual. No está conectada con clientes, WhatsApp ni datos reales.</p></div>
 </div></section>;
}
export function SystemsStoryboards(){return <div className="sk-storyboards"><div className="sk-intro-band" id="recorrido-sistema"><div className="sys-wrap"><span>ASÍ PUEDE FUNCIONAR TU SISTEMA</span><h2>No necesitas imaginarlo.<em>Te mostramos el recorrido.</em></h2><p>Estos ejemplos muestran cómo se pueden conectar las piezas. Cada proyecto se define según la operación del negocio.</p><a href="#descubrimiento">Explora el primer módulo <ArrowRight size={17}/></a></div></div>{entries.map((x,i)=><KineticModule key={x.number} index={i}/>)}</div>}
