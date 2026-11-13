import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown, ChevronLeft, CircleAlert, Clock3, Globe2, LayoutDashboard, MessageCircle, MessageSquare, MousePointer2, Phone, Search, Send, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { BrandMark } from "./brand";
import { SiteFooter } from "./site-footer";
import { WhatsAppFloat } from "./whatsapp-float";
import { SystemsProjects } from "./systems-projects";
import { SystemsBooking } from "./systems-booking";
import { commercialServices, type CommercialService } from "@/data/commercial-services";
import { peopleImages } from "@/data/visual-story";
import "./systems-landing.css";
import "./pillar-landings.css";

type Kind="agentes-de-ia"|"paginas-web"|"publicidad-digital";
type ServiceData={
 name:string; eyebrow:string; hero:string; accent:string; intro:string; heroAside:string;
 painHeading:string;painAccent:string;painIntro:string;
 pains:{question:string;description:string;label:string;consequence:string;}[];
 storyEyebrow:string;storyTitle:string;storyAccent:string;storyIntro:string;
 moments:{label:string;title:string;description:string;}[];
 howHeading:string;howAccent:string;howIntro:string;
 how:{title:string;description:string;}[];
 quiz:{question:string;options:string[]}[];
 quizResult:string;
 faq:[string,string][];
 bookingTitle:string;bookingAccent:string;bookingIntro:string; interest:string;
};
const content:Record<Kind,ServiceData>={
 "agentes-de-ia":{
  name:"Agentes de IA",eyebrow:"ATENCIÓN INTELIGENTE · CÓMPLICE LAB",
  hero:"Agentes de IA para atender tus consultas.",accent:"Sin perder el trato humano.",
  intro:"Diseñamos agentes de IA para responder dudas, entender qué necesita una persona y dejar el contexto listo para tu equipo. Sin hacerle sentir que está hablando con un formulario.",
  heroAside:"Una conversación que entiende qué busca la persona.",
  painHeading:"No todos los mensajes llegan",painAccent:"cuando puedes atenderlos.",
  painIntro:"Muchas oportunidades se complican antes de que una persona de tu equipo pueda conversar con el interesado.",
  pains:[
   {question:"¿Te escriben cuando ya cerraste?",description:"La consulta llega fuera del horario y espera hasta el día siguiente.",label:"Una pregunta fuera de horario",consequence:"Puede buscar una respuesta en otro lugar."},
   {question:"¿Tu equipo contesta lo mismo una y otra vez?",description:"Horarios, servicios y disponibilidad ocupan tiempo que necesitas para otros casos.",label:"Preguntas repetidas",consequence:"La atención se vuelve una tarea manual constante."},
   {question:"¿Te llegan consultas sin información suficiente?",description:"Tu equipo empieza cada conversación preguntando lo mismo desde cero.",label:"Sin contexto",consequence:"La persona debe explicar otra vez qué necesita."},
   {question:"¿Algunos interesados se quedan esperando?",description:"El mensaje llega, pero nadie sabe quién debe retomarlo.",label:"Sin continuidad",consequence:"Un interés real puede enfriarse sin seguimiento."}
  ],
  storyEyebrow:"ASÍ SE VERÍA UNA CONVERSACIÓN",storyTitle:"Un agente que pregunta lo necesario.",storyAccent:"Y reconoce cuándo debe intervenir tu equipo.",
  storyIntro:"Prueba distintos motivos de consulta. La escena recrea cómo puede conversar un agente con criterios definidos y cómo prepararía el contexto para la siguiente atención.",
  moments:[
   {label:"Recibe",title:"La persona pregunta",description:"Una duda llega al canal de atención."},
   {label:"Orienta",title:"La respuesta tiene contexto",description:"El agente usa información aprobada del negocio para orientar."},
   {label:"Entiende",title:"Pregunta lo necesario",description:"Identifica si es una primera consulta, un seguimiento o una solicitud específica."},
   {label:"Prepara",title:"El equipo sabe qué sigue",description:"Recoge la información que sería útil para continuar o agendar, según el alcance."}
  ],
  howHeading:"No se trata de responder por responder.",howAccent:"Se trata de saber cuándo actuar.",
  howIntro:"Un buen agente entiende las reglas del negocio y tiene límites claros. No reemplaza el criterio de quien presta el servicio.",
  how:[
   {title:"Definimos las preguntas y respuestas",description:"Acordamos qué información puede entregar y cómo debe hablarle a cada persona."},
   {title:"Diseñamos decisiones y límites",description:"Identificamos qué debe preguntar, cuándo orientar y cuándo pasar el caso a alguien."},
   {title:"Probamos las conversaciones",description:"Revisamos respuestas ambiguas, preguntas sensibles y situaciones que requieren intervención humana."},
   {title:"Conectamos solo lo necesario",description:"Agenda, registro o seguimiento pueden integrarse según las herramientas disponibles y el alcance contratado."}
  ],
  quiz:[
   {question:"¿Qué consulta recibe más tu negocio?",options:["Preguntas sobre el servicio","Solicitudes para agendar","Casos que requieren asesoría"]},
   {question:"¿En qué momento se pierden oportunidades?",options:["Fuera de horario","Cuando hay muchos mensajes","Después del primer contacto"]},
   {question:"¿Qué necesita más tu equipo?",options:["Responder con más claridad","Recibir contactos con contexto","Dar continuidad a las conversaciones"]}
  ],
  quizResult:"Podemos diseñar un primer recorrido de conversación y definir qué debe responder la IA y qué conviene dejar en manos del equipo.",
  faq:[
   ["¿Un agente responde cualquier cosa?","No. Lo configuramos con información, instrucciones y límites del negocio. Cuando un caso requiere criterio profesional o humano, debe escalarlo."],
   ["¿Puede agendar citas?","Puede ayudar a hacerlo cuando la agenda, la disponibilidad y las integraciones están configuradas dentro del alcance del proyecto."],
   ["¿Se conecta automáticamente con WhatsApp?","No lo damos por hecho. La conexión requiere definir la herramienta, los permisos, la cuenta y las integraciones disponibles."],
   ["¿Reemplaza a mi recepcionista o equipo?","Está pensado para asumir tareas repetitivas y entregar mejor contexto. La decisión sobre qué casos atiende una persona se define desde el diseño."]
  ],
  bookingTitle:"Hablemos de las conversaciones",bookingAccent:"que hoy se te escapan.",
  bookingIntro:"Cuéntanos cómo llegan tus consultas. Diseñaremos un diagnóstico para entender qué podría resolver un agente de IA.",
  interest:"Agentes de IA automatizados"
 },
 "paginas-web":{
  name:"Páginas Web",eyebrow:"PRESENCIA DIGITAL · CÓMPLICE LAB",
  hero:"Páginas web que representan tu nivel.",accent:"Y facilitan el siguiente paso.",
  intro:"Construimos páginas web para profesionales y empresas que necesitan transmitir confianza, explicar por qué elegirlos y facilitar que una persona pregunte, escriba o agende.",
  heroAside:"Una presencia que se ve profesional y facilita el contacto.",
  painHeading:"Tu cliente compara antes de escribirte.",painAccent:"¿Qué encuentra cuando llega?",
  painIntro:"Una web puede verse bonita y aun así dejar preguntas sin resolver, generar dudas o esconder el contacto.",
  pains:[
   {question:"¿Tu página no representa el nivel de tu servicio?",description:"El visitante ve algo genérico y no alcanza a percibir tu experiencia.",label:"Primera impresión débil",consequence:"Puede comparar solo por precio."},
   {question:"¿Cuesta entender qué ofreces?",description:"Los textos hablan de la empresa, pero no resuelven lo que el cliente quiere saber.",label:"Propuesta poco clara",consequence:"La persona no entiende por qué elegirte."},
   {question:"¿Encontrar cómo escribirte toma demasiados pasos?",description:"La información está, pero el botón o formulario se pierde entre secciones.",label:"Contacto escondido",consequence:"El visitante puede irse antes de preguntar."},
   {question:"¿En celular la experiencia se siente incómoda?",description:"Textos pequeños, elementos apretados o formularios difíciles de usar.",label:"Fricción móvil",consequence:"Un interesado abandona antes de completar la acción."}
  ],
  storyEyebrow:"RECORRIDO VISUAL DE UNA WEB",storyTitle:"Tu propuesta se entiende.",storyAccent:"Y el siguiente paso está a la vista.",
  storyIntro:"Explora el recorrido de una página: primera impresión, explicación del servicio, señales de confianza y una forma sencilla de contactar.",
  moments:[
   {label:"Primera impresión",title:"Se entiende qué haces",description:"El visitante reconoce en segundos el servicio y a quién va dirigido."},
   {label:"Confianza",title:"Ve por qué considerarte",description:"Una estructura clara explica experiencia, forma de trabajo y propuesta de valor."},
   {label:"Decisión",title:"Sabe qué puede hacer",description:"La página conduce a una acción visible sin tener que buscarla."},
   {label:"Contacto",title:"Deja de haber barreras",description:"El visitante puede escribir o completar un formulario pensado para móvil."}
  ],
  howHeading:"No empezamos eligiendo colores.",howAccent:"Empezamos entendiendo la decisión.",
  howIntro:"La tecnología y la estética importan, pero después de saber qué necesita entender el cliente y por qué debería confiar.",
  how:[
   {title:"Entendemos a quién quieres atraer",description:"Definimos qué busca esa persona y qué dudas debe resolver tu página."},
   {title:"Dibujamos el recorrido de decisión",description:"Ordenamos servicio, diferenciadores, pruebas y llamadas a la acción."},
   {title:"Diseñamos una experiencia propia",description:"Creamos la versión visual para escritorio y móvil, con contenido que represente tu nivel."},
   {title:"Comprobamos que sea fácil contactar",description:"Revisamos navegación, velocidad percibida, formularios o botones de contacto según el proyecto."}
  ],
  quiz:[
   {question:"¿Qué quieres que haga quien visita tu web?",options:["Agendar una conversación","Pedir información","Conocer mejor mis servicios"]},
   {question:"¿Qué te preocupa de tu página actual?",options:["No transmite confianza","No explica bien lo que hago","Es difícil usarla desde el celular"]},
   {question:"¿Qué debe destacar tu nueva presencia?",options:["Mi experiencia y diferencial","Mis servicios y procesos","Una forma clara de contactarme"]}
  ],
  quizResult:"El punto de partida es diseñar una página que explique tu propuesta y facilite una acción concreta, sin elementos que distraigan.",
  faq:[
   ["¿La página incluye un CRM completo?","No por defecto. Esta oferta se concentra en presencia, claridad y captación mediante formulario, agenda o WhatsApp según el objetivo. Un CRM completo se define como otro alcance."],
   ["¿Puedo tener una página adaptada a mi marca?","Sí. La estructura, el contenido y la dirección visual se definen según tu negocio, no desde una plantilla genérica."],
   ["¿Incluye campañas publicitarias?","No automáticamente. Si también necesitas atraer visitas, podemos plantear Publicidad Digital como un servicio independiente."],
   ["¿Solo trabajan en Manizales?","No. Trabajamos online con profesionales y empresas de Colombia y otros mercados."]
  ],
  bookingTitle:"Tu próxima página debe contar",bookingAccent:"mejor el valor de tu negocio.",
  bookingIntro:"Conversemos sobre tu servicio, tu público y lo que necesitas que ocurra cuando alguien entre a tu web.",
  interest:"Páginas Web"
 },
 "publicidad-digital":{
  name:"Publicidad Digital",eyebrow:"CAMPAÑAS CON INTENCIÓN · CÓMPLICE LAB",
  hero:"Publicidad digital para atraer interés real.",accent:"Con un siguiente paso claro.",
  intro:"Planeamos y gestionamos publicidad digital en Meta Ads, Google Ads y otras plataformas cuando la estrategia lo justifica. Para profesionales y empresas que necesitan atraer consultas de personas interesadas en un servicio de alto valor.",
  heroAside:"Del anuncio a una acción que tenga sentido para tu negocio.",
  painHeading:"Invertir en anuncios no basta.",painAccent:"Importa lo que pasa después.",
  painIntro:"Puedes tener anuncios activos y aun así no saber qué oferta atrae interés o qué debe hacer quien llega.",
  pains:[
   {question:"¿Publicas, pero casi nadie pregunta?",description:"El mensaje no habla de lo que la persona realmente quiere resolver.",label:"Mensaje sin conexión",consequence:"La publicidad pasa desapercibida."},
   {question:"¿Llegan personas que no buscan tu servicio?",description:"La campaña muestra una oferta demasiado general a públicos poco adecuados.",label:"Interés poco relevante",consequence:"El equipo invierte tiempo filtrando consultas."},
   {question:"¿Hacen clic y después se pierden?",description:"El anuncio promete algo, pero el siguiente paso no resulta claro.",label:"Recorrido incompleto",consequence:"La persona no sabe cómo continuar."},
   {question:"¿No sabes qué anuncio merece más atención?",description:"Falta distinguir qué mensajes y audiencias están generando respuesta.",label:"Decisiones sin señales claras",consequence:"Resulta difícil saber qué ajustar."}
  ],
  storyEyebrow:"RECORRIDO DE CAMPAÑA",storyTitle:"Una oferta clara llega a quien interesa.",storyAccent:"Y conduce a la siguiente acción.",
  storyIntro:"Explora cómo se presenta una oferta en redes sociales o anuncios de búsqueda, a quién se dirige y qué debería ocurrir cuando alguien hace clic.",
  moments:[
   {label:"Mensaje",title:"El anuncio se entiende",description:"Presentamos un beneficio concreto, no una frase vacía."},
   {label:"Público",title:"Se dirige a un perfil definido",description:"El mensaje se diseña según el tipo de persona que podría necesitar el servicio."},
   {label:"Acción",title:"Sabe dónde continuar",description:"La campaña invita a escribir, agendar o visitar una experiencia de destino existente."},
   {label:"Aprendizaje",title:"Se revisa lo que responde el público",description:"Las métricas reales, cuando la campaña esté activa, permitirán ajustar mensajes y segmentación."}
  ],
  howHeading:"La campaña no empieza con el botón publicar.",howAccent:"Empieza con una decisión comercial.",
  howIntro:"El objetivo no es inflar impresiones. Queremos entender qué oferta puede interesar a las personas correctas y a dónde las llevará el anuncio.",
  how:[
   {title:"Revisamos oferta y cliente",description:"Definimos qué servicio se promociona, cuál es su valor y qué acción esperamos."},
   {title:"Elegimos el canal y el mensaje",description:"Meta Ads, Google Ads u otra plataforma se plantea según el tipo de demanda y el objetivo."},
   {title:"Creamos para revisión",description:"Preparamos anuncios y creatividades con apoyo de IA. Las campañas quedan en pausa hasta tu aprobación."},
   {title:"Medimos y optimizamos cuando estén activas",description:"Con datos reales revisamos clics, consultas y otras señales disponibles, sin prometer ventas garantizadas."}
  ],
  quiz:[
   {question:"¿Qué quieres promocionar?",options:["Un servicio profesional","Una consulta o diagnóstico","Una propuesta de alto valor"]},
   {question:"¿Qué sucede después del anuncio?",options:["La persona escribe por WhatsApp","Llega a una página web","Quiero definir mejor ese recorrido"]},
   {question:"¿Qué te cuesta más hoy?",options:["Llegar al público correcto","Conseguir que pregunten","Entender qué campaña funciona"]}
  ],
  quizResult:"Podemos definir el mensaje, el público y el destino de los anuncios antes de crear una campaña. La pauta se decide con un objetivo claro.",
  faq:[
   ["¿Solo trabajan publicidad en Instagram y Facebook?","No. Según el caso podemos trabajar Meta Ads, Google Ads u otras plataformas. Elegimos el canal por el objetivo, no por moda."],
   ["¿La publicidad incluye página web o CRM?","No automáticamente. Publicidad Digital atrae interés; la página web, el CRM, la agenda y las automatizaciones tienen alcances independientes."],
   ["¿Los anuncios se activan sin mi autorización?","No. Preparamos las campañas en pausa, las revisas y solo se activan después de tu autorización expresa para gastar presupuesto."],
   ["¿Garantizan un número de clientes?","No. La inversión publicitaria permite probar y optimizar campañas, pero las ventas dependen de más factores y no se garantizan."],
   ["¿Usan inteligencia artificial para crear piezas?","Sí, podemos apoyar la producción de contenido y creatividades con IA, junto con dirección y revisión del equipo. Lo comunicamos con transparencia."]
  ],
  bookingTitle:"Hablemos de cómo atraer",bookingAccent:"las oportunidades correctas.",
  bookingIntro:"Cuéntanos qué servicio quieres promocionar y qué ocurre cuando alguien te contacta. La campaña debe partir de ese recorrido.",
  interest:"Publicidad Digital"
 }
};
const BookingContext=createContext<()=>void>(()=>{});
function CTA({children,secondary=false}:{children:ReactNode;secondary?:boolean}){const open=useContext(BookingContext);return <button type="button" onClick={open} className={secondary?"pl-outline-cta":"sys-action"}>{children}{!secondary?<ArrowUpRight size={17}/>:null}</button>}
function useAutoMoment(length:number,ms=2700){
 const ref=useRef<HTMLDivElement>(null);const [active,setActive]=useState(0);const [visible,setVisible]=useState(false);const [reduced,setReduced]=useState(false);
 useEffect(()=>{const media=window.matchMedia("(prefers-reduced-motion: reduce)");const sync=()=>setReduced(media.matches);sync();media.addEventListener?.("change",sync);return()=>media.removeEventListener?.("change",sync)},[]);
 useEffect(()=>{if(!ref.current)return;const obs=new IntersectionObserver(([entry])=>setVisible(!!entry?.isIntersecting),{threshold:.16});obs.observe(ref.current);return()=>obs.disconnect()},[]);
 useEffect(()=>{if(!visible||reduced)return;const timer=window.setTimeout(()=>setActive(x=>(x+1)%length),ms);return()=>window.clearTimeout(timer)},[visible,reduced,active,length,ms]);
 return {ref,active:reduced?length-1:active,setActive};
}
function ChatPhone({children,label="WhatsApp"}:{children:ReactNode;label?:string}){
 return <div className="pl-wa-phone"><div className="pl-phone-status"><span>9:41</span><i/><span>••• ▰</span></div><div className="pl-wa-head"><ChevronLeft size={18}/><span className="pl-wa-avatar"><Sparkles size={17}/></span><span><strong>{label==="WhatsApp"?"Tu negocio":label}</strong><small>WhatsApp</small></span><Phone size={16}/></div><div className="pl-wa-conversation"><span className="pl-wa-day">HOY</span>{children}</div><div className="pl-wa-input"><span>Escribe un mensaje…</span><Send size={14}/></div><div className="pl-phone-bottom"><i/></div></div>;
}
function Bubble({children,out=false}:{children:ReactNode;out?:boolean}){return <div className={"pl-wa-bubble "+(out?"out":"in")}>{children}<small>10:24</small></div>}
function AgentVisual({stage=0,variant=0}:{stage?:number;variant?:number}){
 const chats=[
  {q:"Hola, ¿cómo puedo agendar una primera consulta?",a:"¡Hola! Con gusto te oriento. ¿Es tu primera consulta?",q2:"Sí, es mi primera vez.",a2:"Perfecto. ¿Te queda mejor esta semana o la próxima?"},
  {q:"Hola, ¿qué servicios ofrecen?",a:"¡Hola! Cuéntame qué necesitas para orientarte mejor.",q2:"Quiero conocer las opciones.",a2:"Puedo explicarte la información general o ayudarte a hablar con el equipo."},
  {q:"Necesito hablar con una persona.",a:"Claro, puedo ayudarte a dejar tu solicitud al equipo.",q2:"Es sobre un caso especial.",a2:"Entiendo. Lo correcto es que el equipo lo revise contigo."}
 ];
 const c=chats[variant]??chats[0]!;
 return <div className="pl-agent-composition">
  <div className="pl-agent-lights"/>
  <ChatPhone>{stage>=0?<Bubble>{c.q}</Bubble>:null}{stage>=1?<Bubble out>{c.a}</Bubble>:null}{stage>=2?<Bubble>{c.q2}</Bubble>:null}{stage>=3?<Bubble out>{c.a2}</Bubble>:null}</ChatPhone>
  <div className={"pl-floating pl-agent-signal "+(stage>=1?"is-shown":"")}><Sparkles size={19}/><span><strong>Entiende la consulta</strong><small>Responde con información definida</small></span></div>
  <div className={"pl-floating pl-agent-context "+(stage>=2?"is-shown":"")}><Users size={18}/><span><strong>Reconoce el motivo</strong><small>{variant===2?"Debe pasar al equipo":"Primera consulta · ejemplo"}</small></span></div>
  <div className={"pl-floating pl-agent-handoff "+(stage>=3?"is-shown":"")}><CheckCircle2 size={18}/><span><strong>Contexto preparado</strong><small>El siguiente paso queda claro</small></span></div>
 </div>;
}
function WebBrowser({stage=0,compact=false}:{stage?:number;compact?:boolean}){
 return <div className={"pl-web-browser "+(compact?"is-compact":"")}><div className="pl-browser-chrome"><span className="pl-browser-dots"><i/><i/><i/></span><span>tumarca.com</span><span>↗</span></div>
  <div className="pl-web-site">
   <div className="pl-site-top"><span><Sparkles size={18}/> TU MARCA</span><span>Servicios　 Sobre mí　 Contacto</span></div>
   {stage===1?<div className="pl-web-services"><img src={peopleImages.doctor.src} loading="lazy" alt="Atención profesional"/><div><small>QUÉ PUEDES ESPERAR</small><strong>Conoce el servicio antes de decidir.</strong><p>Una explicación sencilla del proceso, la atención y los siguientes pasos.</p><ul><li><CheckCircle2 size={13}/> Cómo trabajamos</li><li><CheckCircle2 size={13}/> Qué incluye la atención</li><li><CheckCircle2 size={13}/> Cómo continuar</li></ul></div></div>:
   stage===3?<div className="pl-web-form-example"><div><small>CONTÁCTANOS</small><strong>Conversemos sobre lo que necesitas.</strong><p>Un formulario claro, con los datos necesarios para empezar.</p></div><div className="pl-web-form-fields"><label>Nombre<span>Tu nombre</span></label><label>Correo<span>correo@ejemplo.com</span></label><label>¿Qué necesitas?<span>Cuéntanos brevemente…</span></label><div className="pl-web-form-button">Preparar solicitud <ArrowUpRight size={13}/></div></div></div>:
   <div className="pl-site-hero"><div className="pl-site-copy"><small>ATENCIÓN PROFESIONAL</small><strong>Una atención que inspira confianza.</strong><p>Conoce cómo trabajamos, qué puedes esperar y cuál es el siguiente paso.</p><span className={"pl-site-button "+(stage===2?"is-highlighted":"")}>Solicitar información <ArrowUpRight size={13}/></span></div><img src={peopleImages.doctor.src} alt="Profesional conversando con una persona en un consultorio" loading="lazy"/></div>}
   <div className="pl-site-chapter">{stage===0?<><span><ShieldCheck size={16}/> Presentación clara</span><span><Globe2 size={16}/> Presencia profesional</span></>:stage===1?<><span><ShieldCheck size={16}/> Así trabajamos</span><span><Users size={16}/> Quién te atenderá</span></>:stage===2?<><span><CheckCircle2 size={16}/> Paso siguiente visible</span><span><Phone size={16}/> Escribir o agendar</span></>:<><span><MessageSquare size={16}/> Formulario simple</span><span><CheckCircle2 size={16}/> Solicitud preparada</span></>}</div>
  </div>
 </div>;
}
function WebVisual({stage=0}:{stage?:number}){return <div className="pl-web-composition"><div className="pl-web-halo"/><WebBrowser stage={stage}/><div className="pl-web-mobile"><div className="pl-mobile-top"><i/> <small>tumarca.com</small></div><div className="pl-mobile-image"><img src={peopleImages.doctor.src} alt="" loading="lazy"/></div><strong>Una atención a tu medida.</strong><span>Conoce el servicio</span><div className="pl-mobile-button">Escribir ahora ↗</div></div><div className={"pl-floating pl-web-callout "+(stage===2?"is-shown":"")}><MousePointer2 size={18}/><span><strong>El siguiente paso se ve</strong><small>Sin buscar entre menús</small></span></div><div className={"pl-floating pl-web-contact "+(stage===3?"is-shown":"")}><CheckCircle2 size={18}/><span><strong>Contacto más sencillo</strong><small>Desde computador o celular</small></span></div></div>}
function AdVisual({stage=0,platform="meta"}:{stage?:number;platform?:"meta"|"google"}){
 return <div className={"pl-ads-composition pl-ads-"+platform}><div className="pl-ads-backlight"/>
  {platform==="meta"?<div className="pl-social-post"><div className="pl-ad-post-head"><span className="pl-ad-avatar">✳</span><span><strong>Tu marca profesional</strong><small>Contenido patrocinado</small></span><span>•••</span></div><div className="pl-ad-creative"><img src={peopleImages.dentistDetail.src} alt="Profesional de salud con paciente, fotografía ilustrativa de publicidad" loading="lazy"/><div className="pl-ad-creative-text"><small>ATENCIÓN QUE INSPIRA CONFIANZA</small><strong>Tu próxima consulta empieza con información clara.</strong></div></div><div className="pl-ad-post-bottom"><span>Conoce una atención pensada para ti.</span><b>Más información <ArrowUpRight size={13}/></b></div></div>:
  <div className="pl-search-ad"><div className="pl-search-top"><span className="pl-search-logo">G</span><div>consultar profesional de confianza<Search size={16}/></div></div><span className="pl-search-caption">Patrocinado</span><div className="pl-search-result"><span className="pl-search-mini">✳</span><div><strong>Tu marca profesional</strong><small>tumarca.com / consulta</small></div></div><h3>Atención profesional | Conoce nuestros servicios</h3><p>Información clara sobre la atención, el equipo y cómo solicitar una consulta.</p><div className="pl-search-sitelinks"><span>Servicios</span><span>Conoce al equipo</span><span>Solicitar información</span></div></div>}
  <div className={"pl-floating pl-ad-target "+(stage===1?"is-shown":"")}><Target size={17}/><span><strong>Para un público definido</strong><small>Según objetivo y servicio</small></span></div>
  <div className={"pl-floating pl-ad-action "+(stage===2?"is-shown":"")}><MousePointer2 size={17}/><span><strong>Una acción clara</strong><small>Escribir, agendar o conocer más</small></span></div>
  <div className={"pl-ad-review-board "+(stage===3?"is-shown":"")}><div><LayoutDashboard size={17}/><strong>Qué revisaríamos</strong></div><span><CheckCircle2 size={13}/> Mensaje y creatividad</span><span><CheckCircle2 size={13}/> Respuesta del público</span><span><CheckCircle2 size={13}/> Acción de destino</span><small>Campaña en pausa · revisión previa</small></div>
 </div>;
}
function Hero({kind,data}:{kind:Kind;data:ServiceData}){
 return <section className={"pl-hero pl-hero-"+kind}><div className="sys-wrap pl-hero-grid"><div className="pl-hero-copy"><span className="sys-eyebrow"><i/> {data.eyebrow}</span><h1>{data.hero} <em>{data.accent}</em></h1><p>{data.intro}</p><div className="pl-hero-actions"><CTA>Agendar diagnóstico</CTA><a href="#problemas">Mira qué está pasando <ArrowRight size={17}/></a></div><div className="pl-hero-trust"><ShieldCheck size={16}/> Primero entendemos el negocio. Después diseñamos la solución.</div></div><div className="pl-hero-art">{kind==="agentes-de-ia"?<AgentVisual stage={3}/>:kind==="paginas-web"?<WebVisual stage={3}/>:<AdVisual stage={2}/>}<span className="pl-hero-art-caption">{data.heroAside}</span></div></div><div className="pl-hero-base"><span>ESTRATEGIA</span><i/><span>DISEÑO A MEDIDA</span><i/><span>CONVERSIÓN</span></div></section>;
}
function PainPicture({kind,index}:{kind:Kind;index:number}){
 const icon=[MessageCircle,Clock3,Users,LayoutDashboard][index]??MessageCircle;
 const Icon=icon;
 if(kind==="agentes-de-ia"){
  return <div className="pl-pain-visual pl-pain-agent"><div className="pl-pain-phone-clip"><div className="pl-pain-phone-top"><MessageCircle size={18}/><strong>WhatsApp</strong><span>Conversación</span></div><div className="pl-pain-message">Hola, quisiera saber si puedo agendar una consulta.<small>20:47</small></div>{index>0?<div className="pl-pain-message">{index===1?"¿Qué horarios tienen disponibles?":index===2?"¿Qué información necesitas de mi parte?":"Hola, sigo pendiente de respuesta."}<small>21:03</small></div>:null}<div className="pl-pain-warning"><Clock3 size={16}/>{index===0?"Fuera del horario":index===1?"Respuesta repetida":index===2?"Falta contexto":"Sin seguimiento"}</div></div><div className="pl-pain-floating-note"><Icon size={18}/><span>{index===0?"La pregunta sigue esperando":index===1?"El equipo repite tareas":index===2?"Toca empezar desde cero":"El interés pierde continuidad"}</span></div></div>
 }
 if(kind==="paginas-web"){
  return <div className="pl-pain-visual pl-pain-web"><div className="pl-broken-web"><div className="pl-broken-browser"><span>●　●　●</span><span>miempresa.com</span></div><div className="pl-broken-site"><span>BIENVENIDOS A NUESTRA EMPRESA</span><strong>{index===0?"Somos líderes en soluciones":index===1?"Innovación y compromiso":index===2?"Descubre todo lo que hacemos":"Nuestros servicios"}</strong><p>{index===0?"Una presentación que no dice por qué elegirte.":index===1?"Mucho texto, pocas respuestas concretas.":index===2?"La forma de contactar está escondida al final.":"Un sitio incómodo de navegar en celular."}</p><div className="pl-broken-lines"><i/><i/><i/></div></div></div><div className="pl-pain-web-flag"><CircleAlert size={17}/><span>{index===0?"Tu valor no se percibe":index===1?"La propuesta no se entiende":index===2?"Nadie encuentra el siguiente paso":"El visitante abandona"}</span></div></div>
 }
 return <div className="pl-pain-visual pl-pain-ad"><div className="pl-pain-ad-post"><div className="pl-pain-ad-top"><span className="pl-ad-avatar">✳</span><span>Publicidad de ejemplo</span></div><div className="pl-pain-ad-creative"><Target size={43}/><strong>{index===0?"Conoce más de nosotros":index===1?"Servicios para todos":index===2?"Mira nuestra promoción":"Campaña activa"}</strong></div><div className="pl-pain-ad-bottom"><span>{index===2?"¿Y después del clic?":"¿Por qué alguien debería preguntar?"}</span><MousePointer2 size={18}/></div></div><div className="pl-pain-ad-tag"><CircleAlert size={18}/><span>{index===0?"Mensaje que no despierta interés":index===1?"Público demasiado amplio":index===2?"Falta un destino claro":"Sin señales para decidir"}</span></div></div>;
}
function Problems({kind,data}:{kind:Kind;data:ServiceData}){
 const auto=useAutoMoment(data.pains.length,7500);const pain=data.pains[auto.active]!;
 return <section id="problemas" className={"pl-problems pl-problems-"+kind}><div className="sys-wrap"><div className="pl-heading-block"><span className="pl-kicker">ANTES DE HABLAR DE TECNOLOGÍA</span><h2>{data.painHeading} <em>{data.painAccent}</em></h2><p>{data.painIntro}</p></div><div className="pl-problems-row" ref={auto.ref}><div className="pl-problems-list">{data.pains.map((p,i)=><button type="button" key={p.question} onClick={()=>auto.setActive(i)} aria-pressed={auto.active===i} className={auto.active===i?"active":""}><span className="pl-problem-num">0{i+1}</span><span><strong>{p.question}</strong><small>{p.description}</small></span><ArrowRight size={18}/></button>)}</div><div className="pl-pain-right" key={auto.active}><div className="pl-pain-visual-heading"><span>{pain.label}</span><h3>{pain.consequence}</h3></div><PainPicture kind={kind} index={auto.active}/></div></div><div className="pl-problems-takeaway"><span>LA IDEA ES SENCILLA</span><p>{kind==="agentes-de-ia"?"La atención no debería depender de que alguien esté disponible para escribir cada respuesta.":kind==="paginas-web"?"Tu web debe explicar el valor del servicio y facilitar la decisión, no solo verse bien.":"Cada anuncio debe llevar a una acción concreta y permitir aprender de lo que ocurre."}</p><a href="#demostracion">Mira cómo podría funcionar <ArrowRight size={18}/></a></div></div></section>;
}
function Demonstration({kind,data}:{kind:Kind;data:ServiceData}){
 const auto=useAutoMoment(data.moments.length,3200);
 const [agentScenario,setAgentScenario]=useState(0);
 const [platform,setPlatform]=useState<"meta"|"google">("meta");
 const current=data.moments[auto.active]!;
 return <section id="demostracion" className={"pl-demonstration pl-demonstration-"+kind}><div className="sys-wrap"><div className="pl-demo-intro"><span className="pl-kicker">{data.storyEyebrow}</span><h2>{data.storyTitle} <em>{data.storyAccent}</em></h2><p>{data.storyIntro}</p></div><div className="pl-demo-layout" ref={auto.ref}><div className="pl-demo-art"><div className="pl-demo-switches">{kind==="agentes-de-ia"?<><button type="button" className={agentScenario===0?"active":""} aria-pressed={agentScenario===0} onClick={()=>{setAgentScenario(0);auto.setActive(0)}}>Primera consulta</button><button type="button" className={agentScenario===1?"active":""} aria-pressed={agentScenario===1} onClick={()=>{setAgentScenario(1);auto.setActive(0)}}>Servicios</button><button type="button" className={agentScenario===2?"active":""} aria-pressed={agentScenario===2} onClick={()=>{setAgentScenario(2);auto.setActive(0)}}>Hablar con alguien</button></>:kind==="publicidad-digital"?<><button type="button" className={platform==="meta"?"active":""} aria-pressed={platform==="meta"} onClick={()=>{setPlatform("meta");auto.setActive(0)}}>Meta Ads</button><button type="button" className={platform==="google"?"active":""} aria-pressed={platform==="google"} onClick={()=>{setPlatform("google");auto.setActive(0)}}>Google Ads</button></>:<><span className="pl-demo-note"><Globe2 size={15}/> Diseño para computador y celular</span></>}</div>{kind==="agentes-de-ia"?<AgentVisual stage={auto.active} variant={agentScenario}/>:kind==="paginas-web"?<WebVisual stage={auto.active}/>:<AdVisual stage={auto.active} platform={platform}/>}</div><div className="pl-demo-explainer"><span className="pl-kicker">EL RECORRIDO, PASO A PASO</span><div className="pl-demo-current" key={current.title}><span>{current.label}</span><h3>{current.title}</h3><p>{current.description}</p></div><div className="pl-demo-path">{data.moments.map((m,i)=><button type="button" key={m.label} className={auto.active===i?"active":""} onClick={()=>auto.setActive(i)} aria-pressed={auto.active===i}><span className="pl-path-dot"/><strong>{m.label}</strong><small>{m.description}</small></button>)}</div><div className="pl-demo-reality"><ShieldCheck size={17}/><span>{kind==="agentes-de-ia"?"Cada respuesta y conexión se define y prueba antes de operar.":kind==="paginas-web"?"El diseño final se construye a partir de tu marca, servicio y objetivo.":"Los anuncios de pago se preparan en pausa y solo se activan con autorización."}</span></div></div></div></div></section>;
}
function BusinessProcess({data,kind}:{data:ServiceData;kind:Kind}){
 return <section className={"pl-process pl-process-"+kind}><div className="sys-wrap pl-process-layout"><div className="pl-process-copy"><span className="pl-kicker">ASÍ TRABAJAMOS CONTIGO</span><h2>{data.howHeading} <em>{data.howAccent}</em></h2><p>{data.howIntro}</p><CTA>Hablemos de mi negocio</CTA></div><div className="pl-process-timeline">{data.how.map((m,i)=><div className="pl-process-event" key={m.title}><span>0{i+1}</span><div><strong>{m.title}</strong><p>{m.description}</p></div>{i===data.how.length-1?<CheckCircle2 size={18}/>:null}</div>)}</div></div></section>;
}
function Scope({kind,service}:{kind:Kind;service:CommercialService}){
 const note=kind==="agentes-de-ia"
  ?"Agendamiento, registro y canales de mensajería se conectan únicamente cuando se acuerdan y es viable integrarlos."
  :kind==="paginas-web"
  ?"La página web no incluye por defecto CRM completo, automatizaciones ni campañas de pauta. Podemos construirlos con un alcance aparte."
  :"La publicidad no incluye automáticamente web, agenda, CRM o automatizaciones. Las campañas se preparan en pausa y necesitan aprobación antes de gastar dinero.";
 const lead=kind==="agentes-de-ia"?"Qué puede hacer un agente diseñado para tu negocio."
  :kind==="paginas-web"?"Una página que representa tu nivel y facilita el contacto."
  :"Lo que hacemos para atraer oportunidades con publicidad.";
 return <section className="pl-scope"><div className="sys-wrap pl-scope-layout">
  <div className="pl-scope-intro"><span className="pl-kicker">ALCANCE DEL SERVICIO</span><h2>{lead}</h2><p>Definimos la solución a partir de tu servicio, de cómo decide tu cliente y de qué tendría que ocurrir después.</p><div className="pl-scope-note"><ShieldCheck size={18}/><span>{note}</span></div><CTA>Revisemos mi caso</CTA></div>
  <div className="pl-scope-list">{service.deliverables.map((item,i)=><div className="pl-scope-row" key={item}><span>0{i+1}</span><strong>{item}</strong><CheckCircle2 size={18}/></div>)}</div>
 </div></section>;
}
function Quiz({data}:{data:ServiceData}){
 const [step,setStep]=useState(0),[answers,setAnswers]=useState<string[]>([]);
 const open=useContext(BookingContext);
 const done=step===data.quiz.length;
 return <section className="pl-quiz"><div className="sys-wrap pl-quiz-layout"><div className="pl-quiz-copy"><span className="pl-kicker">EMPECEMOS POR TU NEGOCIO</span><h2>¿Por dónde <em>empezaríamos?</em></h2><p>Responde tres preguntas sencillas. Tendremos un punto de partida para conversar sobre lo que de verdad necesitas.</p></div><div className="pl-quiz-form"><div className="pl-quiz-track">{data.quiz.map((q,i)=><span key={q.question} className={i<=step?"active":""}/>)}</div>{!done?<><span className="pl-quiz-label">PREGUNTA {step+1} DE {data.quiz.length}</span><h3>{data.quiz[step]?.question}</h3><div className="pl-quiz-choices">{data.quiz[step]?.options.map(o=><button type="button" key={o} onClick={()=>{setAnswers(x=>[...x.slice(0,step),o]);setStep(x=>x+1)}}>{o}<span/></button>)}</div>{step>0?<button className="pl-quiz-back" type="button" onClick={()=>setStep(x=>x-1)}>← Volver</button>:null}</>:<><span className="pl-quiz-label">UN BUEN PUNTO DE PARTIDA</span><h3>Ya sabemos por dónde conversar.</h3><p>{data.quizResult}</p><p className="pl-quiz-answer">Tu prioridad: {answers[2]}</p><button className="pl-quiz-submit" type="button" onClick={open}>Agendar diagnóstico <ArrowUpRight size={17}/></button><button className="pl-quiz-back" type="button" onClick={()=>{setStep(0);setAnswers([])}}>Empezar de nuevo</button></>}</div></div></section>;
}
function FAQ({data}:{data:ServiceData}){const [open,setOpen]=useState<number|null>(0);return <section className="pl-faq"><div className="sys-wrap pl-faq-layout"><div><span className="pl-kicker">RESPUESTAS CLARAS</span><h2>Sin complicaciones. <em>Sin letras pequeñas.</em></h2><p>Queremos que sepas exactamente qué incluye el servicio y qué se define por separado.</p></div><div>{data.faq.map(([question,answer],i)=><div className="pl-faq-item" key={question}><button type="button" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}>{question}<ChevronDown size={19}/></button>{open===i?<p>{answer}</p>:null}</div>)}</div></div></section>}
const otherServices=[
 {slug:"sistemas-ia-a-la-medida",name:"Sistemas con IA"},
 {slug:"agentes-de-ia",name:"Agentes de IA"},
 {slug:"paginas-web",name:"Páginas Web"},
 {slug:"publicidad-digital",name:"Publicidad Digital"}
] as const;
export function PillarLanding({kind}:{kind:Kind}){
 const data=content[kind], service=commercialServices.find((x:CommercialService)=>x.slug===kind)!;
 const [bookingOpen,setBookingOpen]=useState(false);
 const showBooking=()=>setBookingOpen(true);
 return <BookingContext.Provider value={showBooking}><div className={"sys-page pl-page pl-page-"+kind}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Service",name:service.name,serviceType:service.name,description:service.description,url:"https://complicelab.com/"+kind,provider:{"@id":"https://complicelab.com/#organization","@type":"Organization",name:"Cómplice Lab"},areaServed:[{"@type":"Country",name:"Colombia"},{"@type":"Country",name:"United States"},{"@type":"Country",name:"Mexico"}]})}}/>
  <header className="sys-navigation"><div className="sys-nav-inner"><BrandMark/><nav aria-label="Navegación de la página"><a href="/">Inicio</a><a href="#problemas">El problema</a><a href="#demostracion">Cómo funciona</a><a href="#sistemas-construidos">Proyectos</a><a href="#diagnostico">Contacto</a></nav><CTA>Agendar diagnóstico</CTA></div></header>
  <main><Hero data={data} kind={kind}/><Problems kind={kind} data={data}/><Demonstration kind={kind} data={data}/><BusinessProcess kind={kind} data={data}/><Scope kind={kind} service={service}/><SystemsProjects/><Quiz data={data}/><FAQ data={data}/>
  <section id="diagnostico" className="sys-booking-section"><div className="sys-wrap"><div className="sys-booking-heading"><span>AGENDA TU DIAGNÓSTICO</span><h2>{data.bookingTitle} <em>{data.bookingAccent}</em></h2><p>{data.bookingIntro}</p></div><SystemsBooking serviceName={data.name} interest={data.interest}/></div></section>
  <div className="sys-other-services sys-wrap"><span>OTRAS SOLUCIONES DE CÓMPLICE LAB</span><div>{otherServices.filter(x=>x.slug!==kind).map(item=><a key={item.slug} href={"/"+item.slug}>{item.name} <ArrowUpRight size={16}/></a>)}</div></div></main><SiteFooter onSchedule={showBooking}/><WhatsAppFloat/>
  {bookingOpen?<SystemsBooking modal onClose={()=>setBookingOpen(false)} serviceName={data.name} interest={data.interest}/>:null}
 </div></BookingContext.Provider>;
}
