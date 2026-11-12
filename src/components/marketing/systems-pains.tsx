import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight, BellRing, CalendarClock, ChevronLeft, ChevronRight,
  CircleAlert, Clock3, FileText, Mail, MessageCircle,
  MoreHorizontal, MoreVertical, Mic, Paperclip, Phone, Video
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
    icon: MessageCircle,
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

/* All WhatsApp-like chats are fictional representations of everyday customer pains.
 * White bubbles are incoming customer messages, pale green are business replies.
 * Never show replies in the unanswered and forgotten examples. */
function WhatsAppPhone({contact,children,mode="messages",moment=0}:{contact:string;children:ReactNode;mode?:string;moment?:number}){
 const chatRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const chat=chatRef.current;
  if(!chat)return;
  chat.scrollTop=chat.scrollHeight;
 },[moment]);
 return <div className={"sx-wa-phone sx-wa-phone-"+mode}>
  <div className="sx-wa-status"><b>9:41</b><i/><span>●●● ▰</span></div>
  <div className="sx-wa-header"><ChevronLeft size={21}/><span className="sx-wa-avatar">VG</span><div className="sx-wa-contact"><strong>{contact}</strong><small>WhatsApp · ejemplo ilustrativo</small></div><Video size={16}/><Phone size={16}/><MoreVertical size={16}/></div>
  <div className="sx-wa-chat" ref={chatRef}><div className="sx-wa-chat-inner"><div className="sx-wa-day">HOY</div>{children}</div></div>
  <div className="sx-wa-footer"><span>+</span><div>Mensaje</div><Paperclip size={15}/><span className="sx-wa-mic"><Mic size={15}/></span></div>
  <div className="sx-wa-home"><i/></div>
 </div>
}
function WhatsAppBubble({children,time="10:08",outgoing=false}:{children:ReactNode;time?:string;outgoing?:boolean}){
 return <div className={"sx-wa-bubble "+(outgoing?"out":"in")}><span>{children}</span><small>{time}</small></div>;
}
function UnansweredMessages({moment}:{moment:number}){
 return <div className="sx-pain-scene sx-pain-unanswered" aria-label="Ejemplo: mensajes por WhatsApp sin respuesta">
  <div className="sx-pain-phone-halo" aria-hidden="true"/>
  <WhatsAppPhone contact="Valeria Gómez" moment={moment}>
   <WhatsAppBubble time="10:08">Hola, quisiera conocer los servicios que ofrecen.</WhatsAppBubble>
   {moment>=1?<WhatsAppBubble time="10:18">¿Tienen disponibilidad esta semana?</WhatsAppBubble>:null}
   {moment>=2?<WhatsAppBubble time="10:43">Hola, ¿siguen disponibles?</WhatsAppBubble>:null}
   <span className="sx-wa-no-reply"><Clock3 size={12}/> Sin respuesta del negocio</span>
  </WhatsAppPhone>
  <Flag show className="sx-pain-unread"><span className="sx-pain-flag-icon"><MessageCircle size={17}/></span><span><strong>Llega por WhatsApp</strong><small>Una persona pide información</small></span></Flag>
  <Flag show={moment>=1} className="sx-pain-waiting"><Clock3 size={17}/><span><strong>El cliente insiste</strong><small>El mensaje sigue esperando</small></span></Flag>
  <Flag show={moment>=2} className="sx-pain-cooling"><CircleAlert size={18}/><span><strong>Puede elegir otra opción</strong><small>Nadie alcanzó a responder</small></span></Flag>
 </div>;
}
function SchedulingFriction({moment}:{moment:number}){
 return <div className="sx-pain-scene sx-pain-scheduling" aria-label="Ejemplo: una conversación por WhatsApp que se alarga sin cerrar la cita">
  <div className="sx-pain-schedule-rings" aria-hidden="true"/>
  <WhatsAppPhone contact="Valeria Gómez" mode="schedule" moment={moment}>
   <WhatsAppBubble time="9:05">Hola, ¿puedo ir el martes a las 4?</WhatsAppBubble>
   <WhatsAppBubble outgoing time="9:12">A esa hora no tenemos disponibilidad.</WhatsAppBubble>
   {moment>=1?<><WhatsAppBubble time="9:23">¿Y el miércoles en la mañana?</WhatsAppBubble><WhatsAppBubble outgoing time="9:35">Déjame consultar de nuevo.</WhatsAppBubble></>:null}
   {moment>=2?<WhatsAppBubble time="10:02">¿Qué otros horarios tienen? Necesito organizarme.</WhatsAppBubble>:null}
  </WhatsAppPhone>
  <Flag show className="sx-pain-schedule-note"><CalendarClock size={18}/><span><strong>Coordinar por mensajes</strong><small>Proponer y revisar horarios</small></span></Flag>
  <Flag show={moment>=1} className="sx-pain-schedule-loop"><Clock3 size={17}/><span><strong>Otra ida y vuelta</strong><small>Tiempo de ambas personas</small></span></Flag>
  <Flag show={moment>=2} className="sx-pain-schedule-result"><CircleAlert size={18}/><span><strong>La cita sigue pendiente</strong><small>Sin horario confirmado</small></span></Flag>
 </div>;
}
function ForgottenInterest({moment}:{moment:number}){
 return <div className="sx-pain-scene sx-pain-forgotten" aria-label="Ejemplo: un cliente interesado escribe por WhatsApp durante días y deja de insistir">
  <div className="sx-pain-forgotten-track" aria-hidden="true"/>
  <WhatsAppPhone contact="Valeria Gómez" mode="forgotten" moment={moment}>
   <div className="sx-wa-day sx-wa-history-day">DÍA 1</div>
   <WhatsAppBubble time="11:20">Quedo atenta a la información que hablamos.</WhatsAppBubble>
   {moment>=1?<><div className="sx-wa-day sx-wa-history-day">DÍA 3</div><WhatsAppBubble time="3:16">Hola, ¿pudieron enviarme la propuesta?</WhatsAppBubble></>:null}
   {moment>=2?<><div className="sx-wa-day sx-wa-history-day">DÍA 5</div><WhatsAppBubble time="5:42">Sigo sin novedades. Gracias.</WhatsAppBubble></>:null}
   <span className="sx-wa-no-reply"><Clock3 size={12}/> No hubo seguimiento</span>
  </WhatsAppPhone>
  <Flag show className="sx-pain-forgotten-initial"><MessageCircle size={17}/><span><strong>Mostró interés</strong><small>Quedó esperando información</small></span></Flag>
  <Flag show={moment>=1} className="sx-pain-forgotten-overdue"><BellRing size={17}/><span><strong>Volvió a escribir</strong><small>Nadie retomó el contacto</small></span></Flag>
  <Flag show={moment>=2} className="sx-pain-forgotten-consequence"><CircleAlert size={18}/><span><strong>Dejó de insistir</strong><small>La oportunidad se enfría</small></span></Flag>
 </div>;
}
function ScatteredInformation({moment}:{moment:number}){
 return <div className="sx-pain-scene sx-pain-scattered" aria-label="WhatsApp, correo, notas y calendario separados, sin una vista general">
  <div className="sx-pain-fragment-lines" aria-hidden="true"><i/><i/><i/></div>
  <div className="sx-pain-frag sx-pain-frag-chat sx-fragment-whatsapp">
   <div className="sx-fragment-wa-head"><span className="sx-fragment-wa-logo"><MessageCircle size={16}/></span><strong>WhatsApp</strong><small>12 sin leer</small></div>
   <div className="sx-fragment-wa-body"><div>¿Todavía tienen cupos?<small>10:08</small></div><div>Quedo pendiente, gracias.<small>10:43</small></div></div>
  </div>
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
