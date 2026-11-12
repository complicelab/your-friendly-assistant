import { useState } from "react";
import { ArrowUpRight, Bell, CalendarCheck2, CalendarDays, Check, CheckCheck, CheckCircle2, ChevronDown, Clock3, Database, Globe2, LayoutDashboard, MessageCircle, MousePointer2, Search, Send, ShieldCheck, Users } from "lucide-react";
import "./systems-eight-flow.css";

/** Four full-fledged explanatory scenes. Everything shown is an illustrative simulation,
 * not actual Google placement, CRM results, bookings, outbound messages or client data.
 * Timed steps are controlled by the existing viewport-driven storyboard. */
export function SearchScene({step=4}:{step?:number}){
 const searched=step>=1;
 const found=step>=2;
 return <div className="sd-scene sd-search" aria-label="Simulación de cómo se ve una búsqueda de servicios">
  <div className="sd-search-chrome"><span className="sd-google-word" aria-label="Búsqueda estilo Google"><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b></span><div className="sd-search-query"><span>profesionales de confianza para mi proyecto</span><Search size={17}/></div><div className="sd-search-avatar">V</div></div>
  <div className="sd-search-tabs"><span className="active">Todo</span><span>Imágenes</span><span>Videos</span><span>Noticias</span><span>Más</span></div>
  <div className="sd-serp-main">
   <div className="sd-search-result"><div className="sd-serp-favicon"><Globe2 size={18}/></div><div className="sd-serp-url"><strong>Tu marca · Sitio oficial</strong><small>https://tumarca.com/servicios</small></div><span className="sd-serp-more">⋮</span></div>
   <h3>Una experiencia profesional que transmite confianza</h3>
   <p>Conoce nuestros servicios, cómo trabajamos y cuál es el siguiente paso para recibir atención personalizada.</p>
   <div className="sd-serp-sitelinks"><span>Conoce nuestros servicios</span><span>Agenda una conversación</span></div>
   <div className={"sd-serp-action "+(found?"active":"")}><span className="sd-serp-pulse"/><strong>{found?"La persona encuentra una página clara":"La presentación del resultado se prepara"}</strong><ArrowUpRight size={16}/></div>
  </div>
  <div className="sd-serp-foot"><ShieldCheck size={15}/><span>Montaje de búsqueda ilustrativo. No representa una posición real ni ofrecemos posicionamiento en Google.</span></div>
  <span className={"sd-search-pointer "+(step>=3?"active":"")} aria-hidden="true"><MousePointer2 size={20}/></span>
 </div>;
}

export function AgendaScene({step=4}:{step?:number}){
 return <div className="sd-scene sd-agenda" aria-label="Simulación de una agenda de citas">
  <div className="sd-agenda-top"><div className="sd-agenda-brand"><span><CalendarCheck2 size={20}/></span><div><strong>Agenda de tu negocio</strong><small>Reserva online · Ejemplo</small></div></div><span className="sd-agenda-secure"><ShieldCheck size={13}/> Reserva de ejemplo</span></div>
  <div className="sd-agenda-layout">
   <aside className="sd-agenda-service"><span>01 / SERVICIO</span><div className="sd-agenda-service-card"><CalendarDays size={22}/><strong>Reunión de orientación</strong><small>30 minutos · Videollamada</small></div><div className="sd-agenda-benefit"><CheckCircle2 size={16}/> Sin llamadas de ida y vuelta</div><span className="sd-agenda-note">Los horarios de este montaje son ficticios.</span></aside>
   <div className="sd-agenda-calendar"><div className="sd-agenda-month"><strong>Selecciona un día</strong><span>Noviembre <ChevronDown size={14}/></span></div><div className="sd-calendar-weekdays">{["L","M","M","J","V","S","D"].map((x,i)=><span key={i}>{x}</span>)}</div><div className="sd-calendar-days">{Array.from({length:28},(_,i)=><span key={i} className={i===17&&step>=1?"selected":i===7||i===14||i===21?"soft":""}>{i+1}</span>)}</div><div className="sd-agenda-date-preview"><Clock3 size={14}/>{step>=1?"Miércoles 18 · horario elegido":"Elige el día que más te convenga"}</div></div>
   <div className="sd-agenda-hours"><strong>Horarios</strong>{["09:00 a. m.","10:30 a. m.","02:00 p. m.","04:30 p. m."].map((time,i)=><span key={time} className={i===1&&step>=2?"selected":""}>{time}</span>)}<div className={"sd-booking-feedback "+(step>=3?"visible":"")}><CheckCircle2 size={17}/><div><strong>Horario seleccionado</strong><small>Solicitud preparada para confirmar</small></div></div></div>
  </div>
  <div className="sd-agenda-footer"><span><Check size={14}/> Datos y disponibilidad en un mismo lugar</span><span>AGENDA · DEMO</span></div>
 </div>;
}

export function CampaignScene({step=4}:{step?:number}){
 return <div className="sd-scene sd-campaign" aria-label="Simulación de seguimiento por WhatsApp y correo electrónico">
  <div className="sd-campaign-management">
   <div className="sd-campaign-overline"><span>SEGUIMIENTO CONECTADO</span><span className="sd-campaign-status"><span/> DEMO · SIN ENVÍOS</span></div>
   <h3>Una conversación no tiene por qué terminar ahí.</h3>
   <p>Desde el sistema se podría preparar el siguiente contacto con personas que autorizaron recibirlo.</p>
   <div className="sd-campaign-flow">
    <div className={"sd-campaign-flow-row "+(step>=0?"active":"")}><span className="sd-flow-icon"><Database size={18}/></span><div><strong>Contacto en CRM</strong><small>Interés registrado</small></div><Check size={15}/></div>
    <div className="sd-flow-connector"/>
    <div className={"sd-campaign-flow-row "+(step>=1?"active":"")}><span className="sd-flow-icon"><Users size={18}/></span><div><strong>Grupo definido</strong><small>Personas con autorización</small></div><Check size={15}/></div>
    <div className="sd-flow-connector"/>
    <div className={"sd-campaign-flow-row "+(step>=3?"active":"")}><span className="sd-flow-icon"><MessageCircle size={18}/></span><div><strong>Mensaje preparado</strong><small>WhatsApp o correo según el caso</small></div><Check size={15}/></div>
   </div>
   <div className="sd-campaign-legal"><ShieldCheck size={15}/><span>Sin conexión a la API ni envío real. Flujo sujeto a configuración y consentimiento.</span></div>
  </div>
  <div className="sd-campaign-phone-wrap">
   <div className="sd-campaign-phone">
    <div className="sd-phone-status"><strong>9:41</strong><span>●●●  ▮▮  ▰</span></div>
    <div className="sd-phone-header"><span>‹</span><div className="sd-phone-avatar">✳</div><div><strong>Tu negocio</strong><small>Cuenta comercial · Ejemplo</small></div><span>⋮</span></div>
    <div className="sd-phone-chat"><div className="sd-chat-date">Hoy</div><div className="sd-phone-bubble incoming">Hola, quería recibir información del servicio.<small>09:31</small></div><div className={"sd-phone-bubble outgoing "+(step>=2?"show":"")}>¡Hola, Valeria! Gracias por contactarnos. Podemos ayudarte a continuar con tu solicitud.<small>09:32 <CheckCheck size={11}/></small></div><div className={"sd-phone-bubble outgoing "+(step>=3?"show":"")}>¿Quieres que nuestro equipo te proponga un horario para conversar?<small>09:32 <CheckCheck size={11}/></small></div>{step>=4?<div className="sd-phone-reminder"><CalendarDays size={13}/> Seguimiento ilustrativo</div>:null}</div>
    <div className="sd-phone-compose"><span>Escribe un mensaje…</span><Send size={15}/></div>
   </div>
   <span className="sd-phone-float"><MessageCircle size={16}/> Mensajes con contexto</span>
  </div>
 </div>;
}

const linePoints="0,112 32,102 64,110 96,78 128,85 160,55 192,66 224,32 256,44 288,17 320,29";
export function MetricsScene({step=4}:{step?:number}){
 const [tab,setTab]=useState<"oportunidades"|"atencion">("oportunidades");
 return <div className="sd-scene sd-metrics" aria-label="Panel de indicadores de ejemplo, todos los valores son ficticios">
  <div className="sd-metrics-sidebar"><span className="sd-logo">✳</span><LayoutDashboard size={20} className="active"/><Database size={19}/><MessageCircle size={19}/><CalendarDays size={19}/><Bell size={19}/></div>
  <div className="sd-metrics-main">
   <header><div><span>PANEL DEL NEGOCIO <small>· DEMO</small></span><h3>Indicadores del sistema</h3></div><span className="sd-metrics-period"><CalendarDays size={13}/> Este mes <ChevronDown size={13}/></span></header>
   <div className="sd-metric-cards">
    {[{label:"Clics en enlaces",value:"248",change:"Interacciones",icon:ArrowUpRight},{label:"Nuevas consultas",value:"36",change:"Contactos",icon:Users},{label:"Citas solicitadas",value:"12",change:"Agenda",icon:CalendarDays},{label:"Pendientes",value:"08",change:"Seguimiento",icon:Bell}].map((item,i)=><div className={"sd-metric-card "+(step>=i?"lit":"")} key={item.label}><div><span>{item.label}</span><item.icon size={16}/></div><strong>{item.value}</strong><small>{item.change} · ejemplo</small></div>)}
   </div>
   <div className="sd-metrics-data">
    <div className="sd-analytics-chart"><div className="sd-chart-head"><div><strong>Actividad y oportunidades</strong><small>Vista simulada de los canales de entrada</small></div><span className="sd-chart-legend"><i/> Consultas</span></div>
     <div className="sd-chart-grid">
      <div className="sd-chart-axis"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
      <svg viewBox="0 0 320 140" preserveAspectRatio="none" aria-hidden="true">
       <defs><linearGradient id="sd-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#5179ea" stopOpacity=".29"/><stop offset="100%" stopColor="#5179ea" stopOpacity="0"/></linearGradient></defs>
       {[22,54,86,118].map(y=><line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#dbe4f2" strokeWidth="1" strokeDasharray="4 6"/>)}
       <polygon points={"0,140 "+linePoints+" 320,140"} fill="url(#sd-chart-fill)"/>
       <polyline points={linePoints} fill="none" stroke="#446fec" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={step>=2?"sd-line-drawn":""}/>
       <circle cx="288" cy="17" r="5" fill="#fff" stroke="#4c6fe9" strokeWidth="3"/>
      </svg>
     </div><div className="sd-chart-dates"><span>01 nov</span><span>08 nov</span><span>15 nov</span><span>22 nov</span><span>30 nov</span></div>
    </div>
    <div className="sd-metrics-sources"><strong>¿Qué ocurre con los contactos?</strong><div className="sd-tab-row"><button type="button" className={tab==="oportunidades"?"active":""} onClick={()=>setTab("oportunidades")}>Etapas</button><button type="button" className={tab==="atencion"?"active":""} onClick={()=>setTab("atencion")}>Atención</button></div>
     {tab==="oportunidades"?<div className="sd-funnel"><div><span>Recibidos</span><i style={{width:"95%"}}/><b>36</b></div><div><span>Contactados</span><i style={{width:"72%"}}/><b>27</b></div><div><span>Con cita</span><i style={{width:"43%"}}/><b>12</b></div><div><span>Pendientes</span><i style={{width:"30%"}}/><b>08</b></div></div>:<div className="sd-activity-list"><div><CheckCircle2 size={15}/> 27 contactos atendidos</div><div><CalendarDays size={15}/> 12 citas solicitadas</div><div><Clock3 size={15}/> 08 pendientes de revisar</div></div>}
    </div>
   </div>
   <footer><span><ShieldCheck size={14}/> Todas las cifras son ficticias y se usan únicamente para explicar la interfaz.</span><span className="sd-dashboard-demo">DEMO INTERACTIVA</span></footer>
  </div>
 </div>;
}
