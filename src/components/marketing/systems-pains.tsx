import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight, BellRing, CalendarClock, ChevronRight,
  CircleAlert, Clock3, FileText, Inbox, Mail, MessageCircle,
  MessageSquare, MoreHorizontal, UserRound
} from "lucide-react";
import "./systems-pains.css";

/**
 * This section is deliberately about unresolved customer pain ONLY.
 * The eight independent modules below explain how a tailored system can solve it.
 * All names, messages, timings, and scenes are illustrative, not client evidence.
 */
const situations = [
  {
    eyebrow: "CONSULTAS QUE QUEDAN EN ESPERA",
    title: "Mensajes que se quedan esperando.",
    question: "¿Te escriben y no siempre alcanzas a responder?",
    brief: "El cliente pregunta, espera y puede buscar otra opción.",
    moments: ["Llega una consulta", "Nadie alcanza a responder", "La oportunidad se enfría"],
    icon: MessageCircle,
  },
  {
    eyebrow: "MUCHAS IDAS Y VUELTAS",
    title: "Una cita que tarda demasiado en concretarse.",
    question: "¿Agendar una cita implica muchos mensajes?",
    brief: "Coordinar una sola hora consume tiempo del equipo y del cliente.",
    moments: ["Preguntan por horarios", "Los horarios no coinciden", "La cita sigue sin confirmar"],
    icon: CalendarClock,
  },
  {
    eyebrow: "INTERÉS SIN CONTINUIDAD",
    title: "Personas interesadas que dejan de insistir.",
    question: "¿Hay interesados a los que nadie vuelve a contactar?",
    brief: "La conversación empezó, pero no hubo un siguiente paso.",
    moments: ["Alguien pide información", "Vuelve a preguntar", "El interés se enfría"],
    icon: BellRing,
  },
  {
    eyebrow: "INFORMACIÓN REPARTIDA",
    title: "Mucho movimiento. Poca claridad.",
    question: "¿Sabes cuántas oportunidades siguen abiertas?",
    brief: "Los datos están en mensajes, notas, correo y calendario.",
    moments: ["Cada dato está en un lugar", "El equipo tiene que buscar", "Nadie tiene la vista completa"],
    icon: Inbox,
  },
] as const;

function Window({children,caption,className=""}:{children:ReactNode;caption:string;className?:string}) {
  return <div className={"sx-pain-window "+className}>
    <div className="sx-pain-window-bar"><span className="sx-pain-dots"><i/><i/><i/></span><span>{caption}</span><MoreHorizontal size={13}/></div>
    {children}
  </div>;
}
function Flag({children,show,className=""}:{children:ReactNode;show:boolean;className?:string}) {
  return <div className={"sx-pain-flag "+className+(show?" is-visible":"")} aria-hidden={!show}>{children}</div>;
}

function UnansweredMessages({moment}:{moment:number}) {
  return <div className="sx-pain-scene sx-pain-unanswered" aria-label="El cliente escribe varias veces, pero no obtiene respuesta">
    <div className="sx-pain-phone-halo" aria-hidden="true"/>
    <div className="sx-pain-phone">
      <div className="sx-pain-phone-status"><b>9:41</b><i/><span>●●● ▰</span></div>
      <div className="sx-pain-phone-header"><span>‹</span><div className="sx-pain-phone-photo"><UserRound size={17}/></div><div><strong>Mi negocio</strong><small>Chat de ejemplo</small></div><MoreHorizontal size={17}/></div>
      <div className="sx-pain-chat">
        <span className="sx-pain-chat-date">Hoy</span>
        <div className="sx-pain-bubble">Hola, quisiera conocer los servicios que ofrecen.<small>10:08</small></div>
        {moment>=1?<div className="sx-pain-bubble">¿Tienen disponibilidad para esta semana?<small>10:18</small></div>:null}
        {moment>=2?<div className="sx-pain-bubble">Hola, ¿siguen disponibles?<small>10:43</small></div>:null}
        <span className="sx-pain-chat-quiet"><Clock3 size={12}/> Sin respuesta</span>
      </div>
      <div className="sx-pain-phone-compose"><span>Escribe un mensaje…</span><MessageCircle size={15}/></div>
      <div className="sx-pain-phone-home"><i/></div>
    </div>
    <Flag show={moment>=0} className="sx-pain-unread"><span className="sx-pain-flag-icon"><BellRing size={17}/></span><span><strong>Mensaje nuevo</strong><small>Una persona quiere información</small></span></Flag>
    <Flag show={moment>=1} className="sx-pain-waiting"><Clock3 size={17}/><span><strong>El equipo está ocupado</strong><small>La consulta sigue esperando</small></span></Flag>
    <Flag show={moment>=2} className="sx-pain-cooling"><CircleAlert size={18}/><span><strong>Puede buscar otra opción</strong><small>No recibió respuesta a tiempo</small></span></Flag>
  </div>;
}

function SchedulingFriction({moment}:{moment:number}) {
  return <div className="sx-pain-scene sx-pain-scheduling" aria-label="Varios mensajes de coordinación sin lograr confirmar una cita">
    <div className="sx-pain-schedule-rings" aria-hidden="true"/>
    <Window caption="Conversación · coordinación de cita" className="sx-pain-chat-window">
      <div className="sx-pain-chat-window-head"><span className="sx-pain-convo-icon"><MessageSquare size={20}/></span><div><strong>Coordinar una cita</strong><small>Conversación de ejemplo</small></div><span className="sx-pain-unconfirmed"><Clock3 size={12}/> Sin confirmar</span></div>
      <div className="sx-pain-thread">
        <div className="sx-pain-thread-line left"><span>Cliente</span>Hola, ¿puedo ir el martes a las 4?</div>
        <div className="sx-pain-thread-line right"><span>Recepción</span>Lo reviso. A esa hora no tenemos disponibilidad.</div>
        {moment>=1?<><div className="sx-pain-thread-line left"><span>Cliente</span>¿Y el miércoles en la mañana?</div><div className="sx-pain-thread-line right"><span>Recepción</span>Déjame consultar nuevamente…</div></>:null}
        {moment>=2?<div className="sx-pain-thread-line left"><span>Cliente</span>¿Qué otros horarios tienen? Necesito organizarme.</div>:null}
      </div>
      <div className="sx-pain-thread-compose"><span>Escribe una respuesta…</span><MessageCircle size={15}/></div>
    </Window>
    <Flag show={moment>=0} className="sx-pain-schedule-note"><CalendarClock size={18}/><span><strong>Horarios por confirmar</strong><small>Depende de revisar y responder</small></span></Flag>
    <Flag show={moment>=1} className="sx-pain-schedule-loop"><Clock3 size={17}/><span><strong>Otra ida y vuelta</strong><small>Más tiempo de ambos lados</small></span></Flag>
    <Flag show={moment>=2} className="sx-pain-schedule-result"><CircleAlert size={18}/><span><strong>Todavía sin cita</strong><small>Muchos mensajes, ninguna reserva</small></span></Flag>
  </div>;
}

function ForgottenInterest({moment}:{moment:number}) {
  return <div className="sx-pain-scene sx-pain-forgotten" aria-label="Una persona pide información, vuelve a escribir y sigue sin seguimiento">
    <div className="sx-pain-forgotten-track" aria-hidden="true"/>
    <Window caption="Bandeja de conversaciones" className="sx-pain-inbox">
      <div className="sx-pain-inbox-head"><div><span>BANDEJA DE ENTRADA</span><strong>Conversaciones</strong></div><Inbox size={22}/></div>
      <div className="sx-pain-inbox-row"><div className="sx-pain-inbox-avatar">VG</div><div><strong>Valeria Gómez</strong><span>Quedo atenta a la información que hablamos.</span></div><small>Día 1</small></div>
      <div className={"sx-pain-inbox-row sx-pain-inbox-follow "+(moment>=1?"is-shown":"")}><div className="sx-pain-inbox-avatar">VG</div><div><strong>Valeria Gómez</strong><span>Hola, ¿pudieron enviarme la propuesta?</span></div><small>Día 3</small></div>
      <div className={"sx-pain-inbox-row sx-pain-inbox-last "+(moment>=2?"is-shown":"")}><div className="sx-pain-inbox-avatar">VG</div><div><strong>Valeria Gómez</strong><span>Sigo sin novedades. Gracias.</span></div><small>Día 5</small></div>
      <div className="sx-pain-inbox-foot"><Clock3 size={14}/><span>No se ha registrado una respuesta de seguimiento</span></div>
    </Window>
    <Flag show={moment>=0} className="sx-pain-forgotten-initial"><Mail size={16}/><span><strong>Pidió información</strong><small>Mostró interés en el servicio</small></span></Flag>
    <Flag show={moment>=1} className="sx-pain-forgotten-overdue"><BellRing size={17}/><span><strong>Nadie retomó el contacto</strong><small>No hay un siguiente paso claro</small></span></Flag>
    <Flag show={moment>=2} className="sx-pain-forgotten-consequence"><CircleAlert size={18}/><span><strong>El interés se enfría</strong><small>La persona deja de insistir</small></span></Flag>
  </div>;
}

function ScatteredInformation({moment}:{moment:number}) {
  return <div className="sx-pain-scene sx-pain-scattered" aria-label="Consultas, citas, notas y correos dispersos sin una vista general">
    <div className="sx-pain-fragment-lines" aria-hidden="true"><i/><i/><i/></div>
    <Window caption="Mensajes" className="sx-pain-frag sx-pain-frag-chat">
      <div className="sx-pain-frag-head"><MessageCircle size={15}/><strong>Mensajes</strong><small>12 sin leer</small></div>
      <div><span>¿Todavía tienen cupos?</span><span>Quedo pendiente, gracias.</span></div>
    </Window>
    <Window caption="Calendario" className={"sx-pain-frag sx-pain-frag-calendar "+(moment>=1?"is-arrived":"")}>
      <div className="sx-pain-frag-head"><CalendarClock size={16}/><strong>Agenda</strong></div>
      <div className="sx-pain-frag-days"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span></div>
      <small className="sx-pain-frag-footer">¿Se confirmó la cita del miércoles?</small>
    </Window>
    <div className={"sx-pain-frag sx-pain-frag-note "+(moment>=1?"is-arrived":"")}><span><FileText size={15}/> NOTAS SUELTAS</span><strong>Volver a llamar</strong><small>¿A quién? ¿Cuándo?</small><i/></div>
    <Window caption="Correo" className={"sx-pain-frag sx-pain-frag-mail "+(moment>=2?"is-arrived":"")}>
      <div className="sx-pain-frag-head"><Mail size={15}/><strong>Correo</strong><small>5 pendientes</small></div>
      <p>Asunto: Solicitud de información</p><span>Quedo a la espera de su respuesta…</span>
    </Window>
    <Flag show={moment>=2} className="sx-pain-scattered-question"><CircleAlert size={19}/><span><strong>¿Qué sigue abierto?</strong><small>Hay actividad, pero no una vista completa</small></span></Flag>
  </div>;
}

const scenes=[UnansweredMessages,SchedulingFriction,ForgottenInterest,ScatteredInformation] as const;

export function SystemsPains() {
  const [active,setActive]=useState(0);
  const [moment,setMoment]=useState(0);
  const [visible,setVisible]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const section=useRef<HTMLElement>(null);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync=()=>setReducedMotion(media.matches);
    sync();
    media.addEventListener?.("change",sync);
    return()=>media.removeEventListener?.("change",sync);
  },[]);
  useEffect(()=>{
    if(!section.current)return;
    const observer=new IntersectionObserver(([entry])=>setVisible(Boolean(entry?.isIntersecting)),{threshold:.18});
    observer.observe(section.current);
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!visible||reducedMotion)return;
    const timeout=window.setTimeout(()=>{
      if(moment<2)setMoment(m=>m+1);
      else{setActive(i=>(i+1)%situations.length);setMoment(0);}
    },moment===2?3200:2450);
    return()=>window.clearTimeout(timeout);
  },[visible,reducedMotion,active,moment]);
  function selectSituation(index:number){setActive(index);setMoment(reducedMotion?2:0);}
  const Scene=scenes[active]!;
  const situation=situations[active]!;
  const displayedMoment=reducedMotion?2:moment;
  return <section className="sx-pains" ref={section} id="situaciones-reales"><div className="sys-wrap">
    <div className="sx-pains-head"><span>ANTES DE HABLAR DE TECNOLOGÍA</span><h2>¿Te pasa alguna de estas cosas <em>en tu negocio?</em></h2><p>Hay oportunidades que se pierden sin hacer ruido: una pregunta sin respuesta, una cita que nunca se concreta o una persona interesada a la que nadie vuelve a escribir.</p></div>
    <div className="sx-pains-composition">
      <div className="sx-pains-choices" aria-label="Situaciones cotidianas">
        {situations.map((item,i)=><button type="button" key={item.eyebrow} className={active===i?"active":""} aria-pressed={active===i} onClick={()=>selectSituation(i)}>
          <span className="sx-choice-number">0{i+1}</span><span className="sx-choice-text"><strong>{item.question}</strong><small>{item.brief}</small></span><ChevronRight size={18}/>
        </button>)}
      </div>
      <div className={"sx-pains-demo sx-pains-demo-"+active}>
        <div className="sx-pains-demo-title"><div><span>{situation.eyebrow}</span><h3>{situation.title}</h3></div><span className="sx-pains-demo-tag"><i/> EJEMPLO</span></div>
        <div className="sx-stage" key={active}><Scene moment={displayedMoment}/></div>
        <div className="sx-pains-demo-bottom">
          <div className="sx-pains-progress"><span>EN EL DÍA A DÍA</span>{[0,1,2].map(i=><button key={i} type="button" aria-label={"Ver momento "+(i+1)} aria-pressed={displayedMoment===i} className={displayedMoment===i?"active":""} onClick={()=>setMoment(i)}><i/></button>)}<span>{displayedMoment+1} / 3</span></div>
          
        </div>
        <p className="sx-pain-moment"><span>{["01 · QUÉ SUCEDE","02 · QUÉ SE COMPLICA","03 · QUÉ CONSECUENCIA TIENE"][displayedMoment]}</span>{situation.moments[displayedMoment]}</p>
        <p className="sx-demo-disclaimer">Escenas ilustrativas: no representan conversaciones, clientes ni resultados reales.</p>
      </div>
    </div>
    <div className="sx-pains-transition"><div><span>LA IDEA ES SENCILLA</span><strong>Si reconoces estas situaciones, vale la pena revisar cómo llegan y se atienden las oportunidades.</strong></div><a href="#recorrido-sistema">Mira cómo podría funcionar <ArrowRight size={17}/></a></div>
  </div></section>;
}
