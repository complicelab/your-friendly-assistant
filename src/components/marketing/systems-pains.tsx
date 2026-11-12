import { useEffect, useRef, useState } from "react";
import { ArrowRight, BellRing, CalendarClock, CheckCircle2, Clock3, MessageCircle, Search, UserRound, Workflow } from "lucide-react";
import "./systems-pains.css";

/** Illustrative situations, not actual client messages or business performance. */
const examples=[
 {category:"MENSAJES SIN RESPUESTA",question:"¿Te escriben y no siempre alcanzas a responder?",detail:"Entra una consulta mientras tu equipo está ocupado. La persona espera, nadie ve el mensaje y puede buscar otra opción.",before:"Consulta sin respuesta",after:"Contacto visible y tarea asignada",icon:MessageCircle},
 {category:"CITAS POR TODAS PARTES",question:"¿Agendar una cita implica muchos mensajes?",detail:"Uno propone una hora, el otro no puede y alguien tiene que volver a escribir. El proceso depende de tiempo que tu equipo no siempre tiene.",before:"Pendiente de confirmar",after:"Solicitud de agenda organizada",icon:CalendarClock},
 {category:"CONTACTOS QUE SE OLVIDAN",question:"¿Hay interesados a los que nadie vuelve a contactar?",detail:"Llegan por WhatsApp, la web o una recomendación. Después de la primera conversación, no queda claro quién debe continuar.",before:"Sin próximo paso",after:"Seguimiento y responsable visibles",icon:BellRing},
 {category:"POCA CLARIDAD",question:"¿Sabes cuántas oportunidades siguen abiertas?",detail:"Tienes conversaciones, agendas y notas en distintos lugares. Revisar cómo va el negocio exige preguntar a varias personas.",before:"Información dispersa",after:"Todo en una vista de trabajo",icon:Search}
] as const;

export function SystemsPains(){
 const [active,setActive]=useState(0);
 const [phase,setPhase]=useState(0);
 const [visible,setVisible]=useState(false);
 const node=useRef<HTMLElement>(null);
 useEffect(()=>{if(!node.current)return;const obs=new IntersectionObserver(x=>setVisible(Boolean(x[0]?.isIntersecting)),{threshold:.18});obs.observe(node.current);return()=>obs.disconnect()},[]);
 useEffect(()=>{if(!visible||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const timer=window.setInterval(()=>setPhase(p=>(p+1)%4),1250);return()=>window.clearInterval(timer)},[visible,active]);
 function choose(i:number){setActive(i);setPhase(0)}
 const selected=examples[active]!;
 return <section className="sx-pains" id="situaciones-reales" ref={node}><div className="sys-wrap">
  <div className="sx-pains-head"><span>ANTES DE HABLAR DE TECNOLOGÍA</span><h2>¿Te pasa alguna de estas cosas <em>en tu negocio?</em></h2><p>Si reconoces una de estas situaciones, ya sabes por qué vale la pena conectar mejor tu atención y tus procesos. No necesitas saber qué es un CRM para entenderlo.</p></div>
  <div className="sx-pains-composition">
   <div className="sx-pains-choices">{examples.map((x,i)=><button key={x.category} type="button" className={active===i?"active":""} aria-pressed={active===i} onClick={()=>choose(i)}><span>0{i+1}</span><strong>{x.question}</strong><ArrowRight size={18}/></button>)}</div>
   <div className="sx-pains-demo"><div className="sx-pains-demo-title"><div><span className="sx-pains-small">UN DÍA CUALQUIERA EN TU NEGOCIO</span><h3>{selected.category.toLocaleLowerCase("es-CO")}</h3></div><span className="sx-pains-demo-tag">EJEMPLO</span></div>
    <div className="sx-pains-animation" key={active}>
      <div className={"sx-pains-msg "+(phase>=0?"visible":"")}><div className="sx-pains-icon"><UserRound size={19}/></div><div><strong>Una persona interesada</strong><p>{active===0?"Hola, ¿me pueden contar cómo funciona el servicio?":active===1?"Hola, quiero agendar una cita, ¿qué horarios tienen?":active===2?"Hola, quedo pendiente de la información. Gracias.":"Hola, quisiera saber cómo va mi solicitud."}</p><small>Consulta ilustrativa · Ahora</small></div></div>
      <div className={"sx-pains-warning "+(phase>=1?"visible":"")}><Clock3 size={17}/><div><b>{selected.before}</b><span>{selected.detail}</span></div></div>
      <div className={"sx-pains-bridge "+(phase>=2?"visible":"")}><div className="sx-pains-bridge-line"/><div className="sx-pains-bridge-mark"><Workflow size={18}/></div></div>
      <div className={"sx-pains-resolution "+(phase>=3?"visible":"")}><div><CheckCircle2 size={23}/><span>ASÍ PODRÍA VERSE CON UN SISTEMA</span></div><strong>{selected.after}</strong><small>El ejemplo muestra un proceso posible; no afirma una automatización activa.</small></div>
    </div>
    <div className="sx-pains-controls">{examples.map((x,i)=><button type="button" key={x.category} onClick={()=>choose(i)} aria-label={"Ver situación "+(i+1)} aria-pressed={i===active} className={i===active?"active":""}/>)}</div>
   </div>
  </div>
  <div className="sx-pains-transition"><div><span>LA IDEA ES SENCILLA</span><strong>Que ninguna oportunidad dependa solo de recordar, buscar o preguntar.</strong></div><a href="#recorrido-sistema">Así se puede resolver <ArrowRight size={17}/></a></div>
 </div></section>;
}
