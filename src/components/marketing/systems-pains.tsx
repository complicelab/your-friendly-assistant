import { useEffect, useRef, useState, type ReactNode } from "react";
import {
 ArrowRight, Bell, BellRing, CalendarCheck2, CalendarClock, CalendarDays,
 Check, CheckCheck, CheckCircle2, ChevronRight, CircleAlert, Clock3,
 Database, Globe2, LayoutDashboard, MessageCircle, MousePointer2,
 RotateCcw, Send, UserRound, Users, Workflow
} from "lucide-react";
import "./systems-pains.css";

/** All names, conversations, dates and dashboard values below are illustrative.
 * These scenes describe possible workflows, not working integrations or outcomes. */
const situations=[
 {category:"MENSAJES SIN RESPUESTA",question:"¿Te escriben y no siempre alcanzas a responder?",brief:"La consulta llega, pero nadie la ve a tiempo.",pain:"El cliente escribe y espera respuesta",solution:"Su consulta queda visible para atenderla",icon:MessageCircle},
 {category:"CITAS POR TODAS PARTES",question:"¿Agendar una cita implica muchos mensajes?",brief:"Una hora puede requerir demasiadas idas y vueltas.",pain:"Ponerse de acuerdo toma demasiado tiempo",solution:"El cliente puede elegir un horario",icon:CalendarClock},
 {category:"CONTACTOS QUE SE OLVIDAN",question:"¿Hay interesados a los que nadie vuelve a contactar?",brief:"Después del primer mensaje, no hay un siguiente paso claro.",pain:"Un contacto interesado queda sin seguimiento",solution:"Cada persona tiene una próxima acción",icon:BellRing},
 {category:"POCA CLARIDAD",question:"¿Sabes cuántas oportunidades siguen abiertas?",brief:"La información vive en varios lugares.",pain:"Cada dato está en un lugar diferente",solution:"Todo el negocio se entiende en una vista",icon:LayoutDashboard}
] as const;

function SceneWindow({children,label,className=""}:{children:ReactNode;label:string;className?:string}){
 return <div className={"sx-interface "+className}><div className="sx-interface-top"><span className="sx-interface-dots"><i/><i/><i/></span><span>{label}</span><span className="sx-interface-demo">DEMO</span></div>{children}</div>;
}
function Pop({children,show,className=""}:{children:ReactNode;show:boolean;className?:string}){
 return <div className={"sx-pop "+className+(show?" is-on":"")}>{children}</div>;
}
function MessagePain({phase}:{phase:number}){
 return <div className="sx-scene sx-scene-messages" aria-label="Ejemplo animado: un mensaje sin respuesta se convierte en una tarea visible">
  <div className="sx-messages-ambient" aria-hidden="true"/>
  <div className="sx-phone-scene">
   <div className="sx-phone-top"><strong>9:41</strong><span className="sx-phone-notch"/><span>▴ ▰ ▰</span></div>
   <div className="sx-phone-contact"><span className="sx-phone-back">‹</span><span className="sx-phone-person"><UserRound size={17}/></span><span><strong>Mi negocio</strong><small>Cuenta de ejemplo</small></span><span className="sx-phone-menu">⋮</span></div>
   <div className="sx-phone-conversation"><span className="sx-conversation-date">Hoy</span><div className="sx-chat-message incoming">Hola, ¿me pueden explicar cómo funciona su servicio?<small>10:08</small></div><div className={"sx-chat-status "+(phase>=1?"is-urgent":"")}><Clock3 size={13}/><span>{phase>=1?"Consulta pendiente de respuesta":"Nueva consulta"}</span></div>{phase>=3?<div className="sx-chat-message outgoing">¡Hola, Valeria! Gracias por escribirnos. Nuestro equipo continuará contigo.<small>10:09 <CheckCheck size={11}/></small></div>:null}</div>
   <div className="sx-phone-input"><span>Escribe un mensaje…</span><Send size={14}/></div><div className="sx-phone-home"><i/></div>
  </div>
  <Pop show={phase>=0} className="sx-messages-alert"><span className="sx-pop-symbol warning"><BellRing size={18}/></span><span><strong>Mensaje pendiente</strong><small>El equipo está ocupado</small></span><CircleAlert size={16}/></Pop>
  <Pop show={phase>=2} className="sx-messages-contact"><span className="sx-pop-symbol blue"><Database size={18}/></span><span><strong>Nuevo contacto</strong><small>Valeria · Consulta por WhatsApp</small></span><CheckCircle2 size={17}/></Pop>
  <Pop show={phase>=3} className="sx-messages-resolved"><span className="sx-pop-symbol mint"><Check size={18}/></span><span><strong>Hay alguien a cargo</strong><small>Respuesta y seguimiento visibles</small></span></Pop>
  <div className="sx-messages-trace" aria-hidden="true"><span/><span/><span/></div>
 </div>;
}
function SchedulePain({phase}:{phase:number}){
 return <div className="sx-scene sx-scene-schedule" aria-label="Ejemplo animado de coordinación de una cita con calendario">
  <div className="sx-schedule-rays" aria-hidden="true"/>
  <SceneWindow label="tunegocio.com/agenda" className={"sx-schedule-window "+(phase<2?"is-before":"is-after")}>
   <div className="sx-calendar-heading"><div><span>AGENDA DE EJEMPLO</span><h4>Encuentra un horario</h4></div><CalendarDays size={24}/></div>
   <div className="sx-calendar-caption">Noviembre <span>‹ &nbsp; ›</span></div>
   <div className="sx-calendar-weekdays">{["L","M","M","J","V","S","D"].map((x,i)=><span key={i}>{x}</span>)}</div>
   <div className="sx-calendar-month">{Array.from({length:28},(_,i)=><span key={i} className={(i===17&&phase>=2?"picked ": "")+(i===7||i===14||i===21?"suggested":"")}>{i+1}</span>)}</div>
   <div className="sx-calendar-slot-list"><strong>Horarios de ejemplo</strong><div>{["9:00","10:30","14:00"].map((h,i)=><span className={i===1&&phase>=2?"picked":""} key={h}>{h}</span>)}</div></div>
   <div className={"sx-calendar-confirm "+(phase>=3?"confirmed":"")}><CalendarCheck2 size={16}/>{phase>=3?"Solicitud de cita preparada":"Selecciona fecha y hora"}</div>
  </SceneWindow>
  <div className={"sx-schedule-before "+(phase<2?"is-visible":"")} aria-hidden={phase>=2}>
   <div className="sx-schedule-before-head"><span><MessageCircle size={15}/></span><strong>Coordinar por mensajes</strong><small>Conversación de ejemplo</small></div>
   <div className="sx-schedule-before-chat"><span>¿Tienes cita el martes?</span><span>Ese día no puedo…</span><span>¿Entonces el miércoles?</span><span>Déjame revisar.</span></div>
   <div className="sx-schedule-before-foot"><Clock3 size={14}/> Varias respuestas y todavía sin horario</div>
  </div>
  
  <Pop show={phase>=2} className="sx-schedule-selected"><span className="sx-pop-symbol violet"><MousePointer2 size={16}/></span><span><strong>Horario elegido</strong><small>Miércoles · 10:30 a. m.</small></span></Pop>
  <Pop show={phase>=3} className="sx-schedule-success"><CheckCircle2 size={20}/><span><strong>Una solicitud organizada</strong><small>El equipo puede continuar</small></span></Pop>
 </div>;
}
function FollowUpPain({phase}:{phase:number}){
 const target=phase>=3?2:phase>=2?1:0;
 return <div className="sx-scene sx-scene-followup" aria-label="Ejemplo animado del movimiento de un contacto hacia seguimiento">
  <div className="sx-followup-track" aria-hidden="true"><span/><span/></div>
  <SceneWindow label="sistema.com/oportunidades" className="sx-followup-window">
   <div className="sx-pipeline-head"><div><span>GESTIÓN DE OPORTUNIDADES</span><h4>¿En qué va cada persona?</h4></div><span className="sx-view-label"><Workflow size={13}/> Etapas</span></div>
   <div className="sx-pipeline-columns">{["Nuevo","En conversación","Seguimiento"].map((name,i)=><div className={"sx-pipeline-col "+(target===i?"selected":"")} key={name}>
    <div className="sx-pipeline-col-title"><i/>{name}<small>{target===i?"01":"—"}</small></div>
    {target===i?<div key={target} className="sx-pipeline-lead"><span className="sx-pipeline-avatar">VG</span><strong>Valeria Gómez</strong><small>Consulta inicial</small><span className={"sx-lead-stage "+(target===2?"good":"")}>{i===0?"Sin próximo paso":i===1?"Interés confirmado":"Contactar esta semana"}</span></div>:<div className="sx-pipeline-empty">+</div>}
   </div>)}</div>
   <div className="sx-pipeline-bottom"><span><Users size={14}/> Contactos de ejemplo</span><span>{phase>=3?"Próxima acción visible":"Una oportunidad necesita continuidad"}</span></div>
  </SceneWindow>
  <Pop show={phase<3} className="sx-followup-alert"><span className="sx-pop-symbol warning"><Clock3 size={18}/></span><span><strong>Contacto sin seguimiento</strong><small>¿Quién vuelve a escribirle?</small></span></Pop>
  <Pop show={phase>=2} className="sx-followup-task"><span className="sx-pop-symbol violet"><Bell size={18}/></span><span><strong>Recordatorio preparado</strong><small>Asignado al equipo</small></span></Pop>
  <Pop show={phase>=3} className="sx-followup-done"><CheckCircle2 size={20}/><span><strong>Próximo paso definido</strong><small>La oportunidad no queda olvidada</small></span></Pop>
 </div>;
}
function VisibilityPain({phase}:{phase:number}){
 return <div className="sx-scene sx-scene-visibility" aria-label="Ejemplo animado: información de distintos canales reunida en un panel">
  <div className="sx-visibility-lines" aria-hidden="true"><span/><span/><span/></div>
  <SceneWindow label="panel.tunegocio.com" className="sx-visibility-window">
   <div className="sx-visibility-app"><aside><span>✳</span><LayoutDashboard size={18}/><Database size={17}/><CalendarDays size={17}/></aside><div className="sx-visibility-body">
    <div className="sx-visibility-title"><div><span>MI NEGOCIO · EJEMPLO</span><h4>Todo a la vista.</h4></div><span className="sx-online-dot">{phase<2?"Sin información reunida":"Vista general"}</span></div>
    <div className={"sx-visibility-kpis "+(phase<2?"sx-is-unavailable":"")}><div><span>Contactos</span><strong>36</strong><small>Consultas recibidas</small></div><div><span>Citas</span><strong>12</strong><small>Solicitudes registradas</small></div><div><span>Pendientes</span><strong>08</strong><small>Acciones por revisar</small></div></div>
    <div className={"sx-visibility-chart "+(phase<2?"sx-is-unavailable":"")}><div><strong>Actividad del negocio</strong><small>Datos ficticios</small></div><svg viewBox="0 0 310 110" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sx-pains-chart-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5f83e9" stopOpacity=".27"/><stop offset="100%" stopColor="#5f83e9" stopOpacity="0"/></linearGradient></defs>{[27,53,79].map(y=><line key={y} x1="0" x2="310" y1={y} y2={y} stroke="#dfe8f5" strokeDasharray="4 5"/>)}<polygon points="0,110 0,90 35,78 70,88 105,53 140,66 175,39 210,47 245,23 280,34 310,16 310,110" fill="url(#sx-pains-chart-fade)"/><polyline points="0,90 35,78 70,88 105,53 140,66 175,39 210,47 245,23 280,34 310,16" className={phase>=2?"is-traced":""} fill="none" stroke="#4773e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
    <div className="sx-visibility-foot">{phase<2?<><CircleAlert size={14}/> Mensajes, web y citas aún separados</>:<><CheckCircle2 size={14}/>{phase>=3?"Contactos, citas y tareas reunidos":"La información empieza a conectarse"}</>}</div>
   </div></div>
  </SceneWindow>
  <div className={"sx-visibility-disconnected "+(phase<2?"is-visible":"")} aria-hidden={phase>=2}><CircleAlert size={19}/><div><strong>¿Cuántos siguen esperando?</strong><span>Mensajes, citas y contactos en lugares distintos.</span></div></div>
  <Pop show={true} className="sx-visibility-source one"><span className="sx-pop-symbol mint"><MessageCircle size={17}/></span><span><strong>Mensajes</strong><small>Consultas</small></span></Pop>
  <Pop show={phase>=1} className="sx-visibility-source two"><span className="sx-pop-symbol blue"><Globe2 size={17}/></span><span><strong>Página web</strong><small>Formularios</small></span></Pop>
  <Pop show={phase>=2} className="sx-visibility-source three"><span className="sx-pop-symbol violet"><CalendarDays size={17}/></span><span><strong>Agenda</strong><small>Citas</small></span></Pop>
  <Pop show={phase>=3} className="sx-visibility-summary"><span className="sx-pop-symbol mint"><Check size={18}/></span><span><strong>Un lugar para decidir</strong><small>El equipo ve qué necesita atención</small></span></Pop>
 </div>;
}
const scenes=[MessagePain,SchedulePain,FollowUpPain,VisibilityPain] as const;

export function SystemsPains(){
 const [active,setActive]=useState(0);
 const [phase,setPhase]=useState(0);
 const [visible,setVisible]=useState(false);
 const [reduceMotion,setReduceMotion]=useState(false);
  const section=useRef<HTMLElement>(null);
 useEffect(()=>{
  const query=window.matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>setReduceMotion(query.matches);
  update();
  query.addEventListener?.("change",update);
  return()=>query.removeEventListener?.("change",update);
 },[]);
 useEffect(()=>{
  if(!section.current)return;
  const observer=new IntersectionObserver(([entry])=>setVisible(!!entry?.isIntersecting),{threshold:.12});
  observer.observe(section.current);
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  if(!visible||reduceMotion)return;
  // Each pain tells its own before → after story, then advances automatically.
  // Stopping offscreen avoids skipping explanations while the visitor scrolls.
  const timer=window.setTimeout(()=>{
   if(phase<3)setPhase(p=>p+1);
   else {setActive(i=>(i+1)%situations.length);setPhase(0);}
  },phase===3?2800:2300);
  return()=>window.clearTimeout(timer);
 },[visible,reduceMotion,active,phase]);
 function choose(i:number){setActive(i);setPhase(reduceMotion?3:0)}
 const Scene=scenes[active]!;
 const selected=situations[active]!;
 const effectivePhase=reduceMotion?3:phase;
 return <section className="sx-pains" id="situaciones-reales" ref={section}><div className="sys-wrap">
  <div className="sx-pains-head"><span>ANTES DE HABLAR DE TECNOLOGÍA</span><h2>¿Te pasa alguna de estas cosas <em>en tu negocio?</em></h2><p>No necesitas saber de tecnología para reconocer lo que cuesta perder un mensaje, coordinar una cita o recordar a quién hay que llamar.</p></div>
  <div className="sx-pains-composition">
   <div className="sx-pains-choices" aria-label="Situaciones cotidianas">{situations.map((item,i)=><button key={item.category} type="button" className={active===i?"active":""} aria-pressed={active===i} onClick={()=>choose(i)}><span className="sx-choice-number">0{i+1}</span><span className="sx-choice-text"><strong>{item.question}</strong><small>{item.brief}</small></span><ChevronRight size={18}/></button>)}</div>
   <div className={"sx-pains-demo sx-pains-demo-"+active}>
    <div className="sx-pains-demo-title"><div><span>{effectivePhase<2?"EL PROBLEMA EN TU NEGOCIO":"ASÍ PODRÍA RESOLVERSE"}</span><h3>{effectivePhase<2?selected.pain:selected.solution}</h3></div><span className="sx-pains-demo-tag"><i/> EJEMPLO</span></div>
    <div className="sx-stage" key={active}><Scene phase={effectivePhase}/></div>
    <div className="sx-pains-demo-bottom"><div className="sx-pains-progress"><span>ASÍ PASA</span>{Array.from({length:4},(_,i)=><button key={i} type="button" className={effectivePhase===i?"active":""} aria-pressed={effectivePhase===i} aria-label={"Ver momento "+(i+1)} onClick={()=>setPhase(i)}><i/></button>)}<span>{effectivePhase+1} / 4</span><small className="sx-pains-autoplay">Las situaciones cambian solas</small></div><button type="button" className="sx-replay" onClick={()=>setPhase(reduceMotion?3:0)}><RotateCcw size={14}/> Repetir</button></div>
    <p className="sx-demo-disclaimer">Montaje ilustrativo. No representa un cliente, mensaje enviado ni resultado real.</p>
   </div>
  </div>
  <div className="sx-pains-transition"><div><span>LA IDEA ES SENCILLA</span><strong>Que las oportunidades no dependan de buscar mensajes ni de recordar qué sigue.</strong></div><a href="#recorrido-sistema">Mira cómo puede funcionar <ArrowRight size={17}/></a></div>
 </div></section>;
}
