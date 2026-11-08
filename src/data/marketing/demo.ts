const nicheData = [
  {
    key:"odonto", label:"Odontología", account:"complicedental", brand:"Cómplice Dental", initials:"CD",
    adImage:"/marketing/demo/social-ad-dental.webp", heroImage:"/marketing/demo/landing-hero-dental.webp", adTag:"Diseño de sonrisa",
    headline:"Tu sonrisa merece una experiencia a tu nivel.",
    sub:"Valoración personalizada · agenda online",
    adCta:"Agendar valoración", url:"complicedental.com/valoracion",
    landingKicker:"ODONTOLOGÍA PERSONALIZADA",
    landingHeadline:"Una experiencia que transmite confianza antes de la cita.",
    landingSub:"Conoce tus opciones y agenda sin llamadas.",
    service:"Diseño de sonrisa", lead:"Laura Pérez", phone:"+57 311 000 0000",
    waFirst:"Hola 👋 Vengo del anuncio y quiero agendar una valoración para diseño de sonrisa.",
    waReply:"¡Hola, Laura! Claro. Tenemos disponibilidad esta semana.",
    slots:["Mié 10:00","Jue 4:00"], selected:"Miércoles a las 10:00 me queda perfecto.",
    success:"Perfecto ✅ Tu valoración quedó agendada. Te enviaremos un recordatorio por aquí.",
    metrics:[48200,1930,96]
  }
]

import phoneCss from "./phone.css?raw";

export const marketingStyles = `<style id="marketing-phone-styles">${phoneCss}</style>`;

// Remove only the legacy marketing closure before it can register timers/listeners.
export function replaceMarketingRuntime(html: string) {
  const startMarker = "/* ===== 3. MARKETING: la persona ve el anuncio, toca, llega y agenda (en bucle) ===== */";
  const endMarker = "\n})();\n\n/* ---------- Efecto del puntero reutilizable (contacto) ---------- */";
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error("Marketing v10 runtime boundary not found");
  return html.slice(0, start) + html.slice(end);
}

const runtimeData = JSON.stringify(nicheData);

export const marketingInteractions = `
<script id="marketing-phone-runtime">
(function(){
  var DATA=${runtimeData};
  var sec=document.getElementById("s-marketing");
  if(!sec||sec.dataset.clmPhone==="1")return;
  sec.dataset.clmPhone="1";

  var screen=document.getElementById("mk-screen"),niches=document.getElementById("mk-niches"),stepsWrap=document.getElementById("mk-steps"),results=document.getElementById("mk-res");
  if(!screen||!niches||!stepsWrap||!results)return;
  var steps=Array.from(stepsWrap.querySelectorAll("li"));
  var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  niches.innerHTML="";

  var nicheIndex=0,stepIndex=0,cycle=null,runId=0,subTimers=[];
  function fmt(n){return new Intl.NumberFormat("es-CO").format(n)}
  function stopSubs(){subTimers.forEach(clearTimeout);subTimers=[]}
  function later(ms,fn,id){var t=setTimeout(function(){if(id===runId)fn()},reduced?0:ms);subTimers.push(t)}
  function imageStyle(src){return "background-image:url("+String(src).replace(/[()'\"]/g,"")+")"}

  function igScene(n){
    return '<div class="clm-scene clm-ig">'+
      '<div class="clm-ig-nav"><b>Instagram</b><span>♡　⌁</span></div>'+
      '<div class="clm-post" data-ig-post>'+
        '<div class="clm-posthead"><span class="clm-avatar">'+n.initials+'</span><div><b>'+n.account+'</b><small>Publicidad · '+n.adTag+'</small></div><span class="clm-more">•••</span></div>'+
        '<div class="clm-adcreative-wrap" style="'+imageStyle(n.adImage)+'"></div>'+
        '<div class="clm-igactions"><span>♡　◯　⌁</span><span>Guardar</span></div>'+
        '<div class="clm-igtext"><b>'+n.account+'</b> '+n.sub+'.</div>'+
        '<button class="clm-primary" data-ig-cta data-next>'+n.adCta+'</button>'+
      '</div>'+
    '</div>';
  }

  function landingScene(n){
    return '<div class="clm-scene clm-web">'+
      '<div class="clm-browser"><i></i><i></i><i></i><span>'+n.url+'</span></div>'+
      '<div class="clm-webnav"><b>✦ '+n.brand+'</b><span>☰</span></div>'+
      '<div class="clm-webhero" style="'+imageStyle(n.heroImage)+'"><small>'+n.landingKicker+'</small><b>'+n.landingHeadline+'</b><span>'+n.landingSub+'</span></div>'+
      '<div class="clm-webproof"><span>✓ Atención personalizada</span><span>✓ Respuesta rápida</span></div>'+
      '<div class="clm-form"><div class="clm-formhead"><b>'+n.adCta+'</b><small>Atención personal</small></div>'+
      '<div class="clm-field">Nombre<span data-fill data-value="'+n.lead.replace(/"/g,"&quot;")+'"></span></div>'+
      '<div class="clm-field">WhatsApp<span data-fill data-value="'+n.phone.replace(/"/g,"&quot;")+'"></span></div>'+
      '<div class="clm-field">Servicio<span data-fill data-value="'+n.service.replace(/"/g,"&quot;")+'"></span></div>'+
      '<button data-form-cta data-next>Continuar por WhatsApp　→</button></div>'+
    '</div>';
  }

  function waScene(n){
    return '<div class="clm-scene clm-wa">'+
      '<div class="clm-wahead"><span class="clm-wa-back">‹</span><span class="clm-wa-avatar">'+n.initials+'</span><div><b>'+n.brand+'</b><small>en línea</small></div><span class="clm-waicons">⌕　⋮</span></div>'+
      '<div class="clm-day">Hoy</div>'+
      '<div class="clm-chat">'+
        '<div class="clm-msg out" data-wa="0">'+n.waFirst+'<time>10:24　✓✓</time></div>'+
        '<div class="clm-msg" data-wa="1">'+n.waReply+'<time>10:25</time></div>'+
        '<div class="clm-slots" data-wa="2"><b>Horarios disponibles</b><span>'+n.slots[0]+'</span><span>'+n.slots[1]+'</span></div>'+
        '<div class="clm-msg out" data-wa="3">'+n.selected+'<time>10:25　✓✓</time></div>'+
        '<div class="clm-msg" data-wa="4">'+n.success+'<time>10:26</time></div>'+
      '</div>'+
      '<div class="clm-wafoot"><span>＋</span><b>Escribe un mensaje</b><i>➤</i></div>'+
    '</div>';
  }

  function crmScene(n){
    return '<div class="clm-scene clm-crm">'+
      '<div class="clm-crmbar"><b>CRM · Contactos</b><span>⋮</span></div>'+
      '<div class="clm-contact" data-crm-contact><span class="clm-avatar">'+n.initials+'</span><div><small>NUEVO CONTACTO</small><b>'+n.lead+'</b><span>'+n.phone+'</span></div><em class="clm-status">Agendada</em></div>'+
      '<div class="clm-tags" data-crm-tags><span>'+n.service+'</span><span>Meta Ads</span><span>WhatsApp</span></div>'+
      '<div class="clm-detail" data-crm-detail><div><small>Origen</small><b>Instagram → Landing</b></div><div><small>Próxima acción</small><b>Recordatorio 24 h</b></div></div>'+
      '<div class="clm-history-title">Historial del contacto</div>'+
      '<div class="clm-history">'+
        '<div class="done" data-crm-row="0"><i>✓</i><span><b>Vio el anuncio</b><small>Instagram · 10:22</small></span></div>'+
        '<div class="done" data-crm-row="1"><i>✓</i><span><b>Dejó sus datos</b><small>Landing · 10:24</small></span></div>'+
        '<div class="done" data-crm-row="2"><i>✓</i><span><b>Conversó por WhatsApp</b><small>Interés confirmado</small></span></div>'+
        '<div class="done" data-crm-row="3"><i>✓</i><span><b>Cita agendada</b><small>'+(n.key==='abog'?n.slots[1]:n.slots[0])+'</small></span></div>'+
        '<div data-crm-row="4"><i>5</i><span><b>Seguimiento</b><small>Programado después de la cita</small></span></div>'+
      '</div>'+
    '</div>';
  }

  function renderResults(n){results.innerHTML='<div><small>Personas alcanzadas</small><b>'+fmt(n.metrics[0])+'</b></div><div><small>Clics al anuncio</small><b>'+fmt(n.metrics[1])+'</b></div><div><small>Citas agendadas</small><b>'+fmt(n.metrics[2])+'</b></div>'}

  function syncRight(){
    steps.forEach(function(li,i){li.classList.toggle("on",i===stepIndex);li.classList.toggle("done",i<stepIndex)});
    // Single marketing example: no niche tabs.
  }

  function typeInto(el,text,id,delay){
    later(delay,function(){
      el.classList.add("typing");
      var i=0;
      function tick(){
        if(id!==runId)return;
        el.textContent=text.slice(0,i);
        /* Safe demo data: text only, no HTML typing. */
        el.innerHTML=el.textContent+'<i class="clm-cursor"></i>';
        i++;
        if(i<=text.length){var t=setTimeout(tick,reduced?0:28);subTimers.push(t)}
        else{el.textContent=text;el.classList.remove("typing")}
      }
      tick();
    },id);
  }

  function animateScene(id){
    if(stepIndex===0){
      var post=screen.querySelector("[data-ig-post]"),cta=screen.querySelector("[data-ig-cta]");
      later(240,function(){if(post)post.classList.add("show")},id);
      later(1050,function(){if(cta)cta.classList.add("show")},id);
    }
    if(stepIndex===1){
      var fills=Array.from(screen.querySelectorAll("[data-fill]")),btn=screen.querySelector("[data-form-cta]");
      fills.forEach(function(el,i){typeInto(el,el.getAttribute("data-value")||"",id,450+i*700)});
      later(2850,function(){if(btn)btn.classList.add("ready")},id);
    }
    if(stepIndex===2){
      Array.from(screen.querySelectorAll("[data-wa]")).forEach(function(el,i){later(350+i*650,function(){el.classList.add("show");var chat=el.closest(".clm-chat");if(chat)chat.scrollTo({top:chat.scrollHeight,behavior:reduced?"instant":"smooth"})},id)});
    }
    if(stepIndex===3){
      var c=screen.querySelector("[data-crm-contact]"),tags=screen.querySelector("[data-crm-tags]"),detail=screen.querySelector("[data-crm-detail]");
      later(250,function(){if(c)c.classList.add("show")},id);
      later(650,function(){if(tags)tags.classList.add("show")},id);
      later(1000,function(){if(detail)detail.classList.add("show")},id);
      Array.from(screen.querySelectorAll("[data-crm-row]")).forEach(function(el,i){later(1350+i*420,function(){el.classList.add("show");var chat=el.closest(".clm-chat");if(chat)chat.scrollTo({top:chat.scrollHeight,behavior:reduced?"instant":"smooth"})},id)});
    }
  }

  function render(){
    stopSubs();
    var id=runId;
    var n=DATA[nicheIndex];
    var scene=[igScene,landingScene,waScene,crmScene][stepIndex](n);
    var labels=["Anuncio en Instagram","Landing del nicho con formulario","Conversación y agenda por WhatsApp","Contacto organizado en el CRM"];
    screen.dataset.step=String(stepIndex+1);screen.dataset.niche=n.key;
    screen.innerHTML='<div class="clm-phone"><div class="clm-progress">'+[0,1,2,3].map(function(i){return '<i class="'+(i===stepIndex?"on":"")+'"></i>'}).join("")+'</div>'+scene+'<div class="clm-caption">'+labels[stepIndex]+'</div></div>';
    syncRight();renderResults(n);animateScene(id);
    var next=screen.querySelector("[data-next]");if(next)next.addEventListener("click",function(){manualStep(Math.min(stepIndex+1,3))});
  }

  function stop(){if(cycle){clearTimeout(cycle);cycle=null}runId++;stopSubs()}
  function schedule(){
    var id=runId;
    if(cycle)clearTimeout(cycle);
    cycle=setTimeout(function(){
      if(id!==runId)return;
      stepIndex++;
      if(stepIndex>3){stepIndex=0}
      runId++;render();schedule();
    },5600);
  }
  function manualStep(i){stop();stepIndex=i;render();schedule()}
  steps.forEach(function(li,i){li.addEventListener("click",function(){manualStep(i)})});

  var started=false;
  function start(){if(started)return;started=true;runId=1;render();schedule()}
  // Start when the section enters view, just like the adjacent Agents demo.
  var observer=new IntersectionObserver(function(entries){if(entries.some(function(e){return e.isIntersecting})){start();observer.disconnect()}},{threshold:0.1});
  observer.observe(sec);
  document.addEventListener("visibilitychange",function(){if(!started)return;if(document.hidden)stop();else{render();schedule()}});
})();
</script>
`;
