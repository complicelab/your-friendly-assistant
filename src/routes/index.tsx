// preview-rebuild-v10
import { createFileRoute } from "@tanstack/react-router";
import { gunzipSync } from "node:zlib";
import { compareStyles, compareInteractions, replaceCompareScenes } from "@/data/compare/demos";
import { flowStyles, flowInteractions, replaceFlowScenes } from "@/data/flow/demos";
import { marketingStyles, marketingInteractions, replaceMarketingRuntime } from "@/data/marketing/demo";
import { bookingStyles, replaceBookingRuntime } from "@/data/booking/runtime";

import part1 from "@/data/v10/part-1";
import part2 from "@/data/v10/part-2";
import part3 from "@/data/v10/part-3";
import part4 from "@/data/v10/part-4";
import part5 from "@/data/v10/part-5";
import part6 from "@/data/v10/part-6";
import part7 from "@/data/v10/part-7";
import part8 from "@/data/v10/part-8";
import part9 from "@/data/v10/part-9";
import part10 from "@/data/v10/part-10";
import part11 from "@/data/v10/part-11";
import part12 from "@/data/v10/part-12";

const COMPRESSED_HTML = part1 + part2 + part3 + part4 + part5 + part6 + part7 + part8 + part9 + part10 + part11 + part12;

const SECTION_TITLE_WEIGHT_OVERRIDE = `
<style id="section-title-weight-v10">
  .h2,
  .p-h h2,
  .svc h3,
  .projects-head .h2,
  .contact-copy .h2,
  .ex-copy .h2 {
    font-weight: 700 !important;
    letter-spacing: -0.035em !important;
  }

  .h2,
  .p-h h2 {
    line-height: 1.04 !important;
  }

  .svc h3 {
    line-height: 1.06 !important;
  }

  @media (max-width: 700px) {
    .h2,
    .p-h h2,
    .svc h3 {
      letter-spacing: -0.03em !important;
    }
  }
</style>
`;

const MOBILE_FLOW_FIXES = `
<style id="mobile-flow-fixes-v10">
  @media (max-width: 700px) {
    .cl-mobile-step-track {
      overflow-x: auto !important;
      overflow-y: hidden !important;
      scroll-snap-type: x mandatory !important;
      scroll-behavior: smooth !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
      overscroll-behavior-x: contain !important;
      padding-right: 18vw !important;
    }

    .cl-mobile-step-track::-webkit-scrollbar {
      display: none !important;
    }

    .cl-mobile-step-track > * {
      scroll-snap-align: center !important;
      flex: 0 0 auto !important;
    }

    .cl-mobile-step-track::after {
      content: "";
      flex: 0 0 10vw;
      width: 10vw;
      display: block;
    }

    .cl-mobile-flow-line {
      z-index: 3 !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: none !important;
    }

    .cl-mobile-flow-node {
      z-index: 4 !important;
      position: relative !important;
    }
  }
</style>
`;


const HOMEPAGE_COPY_FIX = `
<script id="homepage-copy-fix-v10">
(function(){
  function normalized(el){ return (el && el.textContent ? el.textContent : "").replace(/\\s+/g," ").trim(); }

  function textNodes(el){
    return Array.from(el.childNodes).filter(function(n){ return n.nodeType===3 && (n.nodeValue||"").trim(); });
  }

  function patchHeading(match, firstText, accentText){
    var headings=Array.from(document.querySelectorAll("h1,h2,h3")).filter(function(el){
      return normalized(el).indexOf(match)!==-1;
    });
    headings.forEach(function(el){
      var nodes=textNodes(el);
      if(nodes.length){
        nodes[0].nodeValue=firstText+" ";
      } else {
        el.insertBefore(document.createTextNode(firstText+" "),el.firstChild);
      }
      var accent=Array.from(el.children).find(function(child){
        return normalized(child) && normalized(child)!==normalized(el);
      });
      if(accent) accent.textContent=accentText;
    });
  }

  function patchParagraph(oldStart,newText){
    var nodes=Array.from(document.querySelectorAll("p"));
    nodes.forEach(function(el){
      var t=normalized(el);
      if(t.indexOf(oldStart)===0) el.textContent=newText;
    });
  }

  function run(){
    patchHeading("Míralo funcionar","Así","trabajamos.");
    patchHeading("Sistemas con IA a la medida","Creamos sistemas con IA","a la medida");
    patchHeading("Agentes de IA automatizados","Creamos agentes de IA","automatizados");
    patchHeading("Atraemos clientes con marketing digital","Creamos tus campañas","de marketing digital");

    patchParagraph(
      "Tres servicios, tres demostraciones",
      "Tres servicios, tres demostraciones que muestran cómo captamos, atendemos y convertimos contactos en oportunidades reales. Si quieres, toca cualquier paso."
    );
    patchParagraph(
      "Que ningún contacto se pierda",
      "Conectamos tu web, agendamiento, CRM, automatizaciones y seguimiento para que ningún contacto se pierda y tu negocio sepa qué hacer después."
    );
    patchParagraph(
      "Que nadie se quede sin respuesta",
      "Responden, filtran, agendan y hacen seguimiento incluso cuando tú no estás, para que tu equipo atienda a quienes realmente están listos para avanzar."
    );
    patchParagraph(
      "Que más personas te encuentren",
      "Diseñamos campañas para atraer a las personas correctas y conectamos cada anuncio con una experiencia que capta sus datos, agenda y deja el seguimiento listo."
    );
    patchParagraph(
      "Déjanos tus datos y seguimos por WhatsApp",
      "Déjanos tus datos, elige un horario disponible y agenda tu diagnóstico. Todo queda registrado para que podamos preparar la conversación antes de hablar contigo."
    );
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run);
  else run();
  setTimeout(run,250);
  setTimeout(run,900);
})();
</script>
`;

const HOMEPAGE_FOOTER_ENHANCEMENT = `
<style id="homepage-footer-enhancement-v10">
  header .cl-header-official-logo{display:inline-flex;align-items:center;text-decoration:none;line-height:0}
  header .cl-header-official-logo img{display:block;width:148px;height:auto}
  footer .cl-footer-official-logo{display:inline-flex;align-items:center;text-decoration:none;margin-bottom:18px;line-height:0}
  footer .cl-footer-official-logo img{display:block;width:176px;max-width:78%;height:auto}
  footer .cl-footer-legal-links{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:18px}
  footer .cl-footer-legal-links a{color:#63738f;text-decoration:none;font:500 13px/1.4 "Montserrat",sans-serif}
  footer .cl-footer-legal-links a:hover{color:#245fea;text-decoration:underline;text-underline-offset:4px}
  @media(max-width:700px){
    header .cl-header-official-logo img{width:136px}
    footer .cl-footer-official-logo img{width:164px}
    footer .cl-footer-legal-links{gap:8px 14px;margin-top:14px}
  }
</style>
<script>
(function(){
  function enhanceBranding(){
    var header=document.querySelector("header");
    if(header && header.dataset.clBrandReady!=="1"){
      var headerNodes=Array.from(header.querySelectorAll("*")).filter(function(el){
        return el.children.length===0 && (el.textContent||"").trim()==="Cómplice Lab";
      });
      var headerBrand=headerNodes[0];
      if(headerBrand){
        var carrier=headerBrand.parentElement || headerBrand;
        carrier.innerHTML='<a class="cl-header-official-logo" href="/" aria-label="Cómplice Lab"><img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab"></a>';
        header.dataset.clBrandReady="1";
      }
    }

    var footer=document.querySelector("footer");
    if(footer && footer.dataset.clBrandReady!=="1"){
      var footerNodes=Array.from(footer.querySelectorAll("*")).filter(function(el){
        return el.children.length===0 && (el.textContent||"").trim()==="Cómplice Lab";
      });
      var footerBrand=footerNodes[0];
      if(footerBrand){
        var oldMark=footerBrand.previousElementSibling;
        if(oldMark && !(oldMark.textContent||"").trim()){
          var markRect=oldMark.getBoundingClientRect();
          if(markRect.width <= 80 && markRect.height <= 80){
            oldMark.remove();
          }
        }
        footerBrand.innerHTML='<a class="cl-footer-official-logo" href="/" aria-label="Cómplice Lab"><img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab"></a>';
      }
      footer.dataset.clBrandReady="1";
    }
  }

  function enhanceFooter(){
    var footer=document.querySelector("footer");
    if(!footer||footer.dataset.clLegalReady==="1") return;
    footer.dataset.clLegalReady="1";

    if(!footer.querySelector(".cl-footer-legal-links")){
      var copyright=Array.from(footer.querySelectorAll("*")).find(function(el){
        return el.children.length===0 && /Todos los derechos reservados/i.test(el.textContent||"");
      });
      var links=document.createElement("div");
      links.className="cl-footer-legal-links";
      links.innerHTML='<a href="/privacidad">Política de privacidad</a><a href="/terminos">Términos y condiciones</a>';
      if(copyright && copyright.parentElement){
        copyright.parentElement.insertBefore(links,copyright);
      } else {
        footer.appendChild(links);
      }
    }
  }
  function run(){
    enhanceBranding();
    enhanceFooter();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run);
  else run();
  setTimeout(run,300);
  setTimeout(run,900);
})();
</script>
`;

const MOBILE_FLOW_SCRIPT = `
<script id="mobile-flow-runtime-v10">
(function () {
  function exactText(text) {
    return Array.from(document.querySelectorAll("body *")).find(function (el) {
      return el.children.length === 0 && el.textContent && el.textContent.trim() === text;
    });
  }

  function commonAncestor(a, b) {
    if (!a || !b) return null;
    var seen = new Set();
    var n = a;
    while (n) { seen.add(n); n = n.parentElement; }
    n = b;
    while (n) {
      if (seen.has(n)) return n;
      n = n.parentElement;
    }
    return null;
  }

  function directChildUnder(node, ancestor) {
    if (!node || !ancestor) return null;
    var n = node;
    while (n.parentElement && n.parentElement !== ancestor) n = n.parentElement;
    return n;
  }

  function fixStepScroller() {
    if (!window.matchMedia("(max-width: 700px)").matches) return;

    var a = exactText("Te buscan");
    var b = exactText("Tu página");
    if (!a || !b) return;

    var base = commonAncestor(a, b);
    if (!base) return;

    var ca = directChildUnder(a, base);
    var cb = directChildUnder(b, base);

    if (!ca || !cb || ca === cb) {
      base = commonAncestor(a.parentElement, b.parentElement);
      if (!base) return;
    }

    var candidates = [base, base.parentElement].filter(Boolean);
    var track = candidates.find(function (el) {
      var s = getComputedStyle(el);
      return el.scrollWidth > el.clientWidth + 20 || s.display === "flex" || s.display === "grid";
    }) || base;

    track.classList.add("cl-mobile-step-track");

    Array.from(track.children).forEach(function (child) {
      child.style.scrollSnapAlign = "center";
      child.style.flexShrink = "0";
    });

    if (track.dataset.clAutoScroll === "1") return;
    track.dataset.clAutoScroll = "1";

    var items = Array.from(track.children).filter(function (el) {
      var r = el.getBoundingClientRect();
      return r.width > 80 && r.height > 30;
    });
    if (items.length < 3) return;

    var index = 0;
    var paused = false;

    function centerItem(item, behavior) {
      if (!item) return;
      var rawLeft = item.offsetLeft + item.offsetWidth / 2 - track.clientWidth / 2;
      var maxLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      var left = Math.max(0, Math.min(maxLeft, rawLeft));
      track.scrollTo({ left: left, behavior: behavior || "smooth" });
    }

    function goNext() {
      if (paused || document.hidden) return;
      index = (index + 1) % items.length;
      centerItem(items[index], "smooth");
    }

    centerItem(items[0], "auto");

    var timer = setInterval(goNext, 2400);

    ["touchstart", "pointerdown", "wheel"].forEach(function (evt) {
      track.addEventListener(evt, function () {
        paused = true;
        clearInterval(timer);
      }, { passive: true, once: true });
    });
  }

  function fixDiagnosticFlow() {
    if (!window.matchMedia("(max-width: 700px)").matches) return;

    var heading = exactText("¿Por dónde empezarías?");
    if (!heading) return;

    var section = heading.closest("section") || heading.parentElement;
    if (!section) return;

    var nodes = Array.from(section.querySelectorAll("*")).filter(function (el) {
      var r = el.getBoundingClientRect();
      var s = getComputedStyle(el);
      var radius = parseFloat(s.borderRadius) || 0;
      return r.width >= 18 && r.width <= 44 && r.height >= 18 && r.height <= 44 && radius >= 10;
    });

    var lineCandidates = Array.from(section.querySelectorAll("*")).filter(function (el) {
      var r = el.getBoundingClientRect();
      var s = getComputedStyle(el);
      var pos = s.position;
      return (pos === "absolute" || pos === "fixed") && r.width > 0 && r.width <= 8 && r.height > 180;
    });

    var line = lineCandidates.sort(function (x, y) {
      return y.getBoundingClientRect().height - x.getBoundingClientRect().height;
    })[0];

    if (line) {
      line.classList.add("cl-mobile-flow-line");

      var refNode = nodes.find(function (el) {
        var r = el.getBoundingClientRect();
        var sr = section.getBoundingClientRect();
        return r.left < sr.left + 80;
      });

      if (refNode) {
        var nr = refNode.getBoundingClientRect();
        var sr = section.getBoundingClientRect();
        var lr = line.getBoundingClientRect();
        line.style.left = (nr.left - sr.left + nr.width / 2 - lr.width / 2) + "px";
      }
    }

    nodes.forEach(function (el) {
      el.classList.add("cl-mobile-flow-node");
    });
  }

  function run() {
    fixStepScroller();
    fixDiagnosticFlow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(run, 120);
      setTimeout(run, 700);
    });
  } else {
    setTimeout(run, 120);
    setTimeout(run, 700);
  }

  window.addEventListener("resize", function () {
    clearTimeout(window.__clFlowResize);
    window.__clFlowResize = setTimeout(run, 180);
  });
})();
</script>
`;


const BOOKING_RUNTIME = `
<style id="cl-booking-runtime-styles">
  .cl-booking-days,.cl-booking-times{display:flex;gap:8px;flex-wrap:wrap}
  .cl-booking-days{flex-wrap:nowrap;overflow-x:auto;padding:2px 2px 8px;scrollbar-width:none}
  .cl-booking-days::-webkit-scrollbar{display:none}
  .cl-booking-day,.cl-booking-time{border:0;background:#f1f6ff;color:#17233a;border-radius:14px;padding:11px 14px;font:700 13px/1.1 "Montserrat",sans-serif;cursor:pointer;transition:.2s ease;min-width:78px}
  .cl-booking-day{display:grid;gap:3px;text-align:center;flex:0 0 auto}
  .cl-booking-day small{font-size:10px;font-weight:500;color:#6f7d95}
  .cl-booking-day.is-active,.cl-booking-time.is-active{background:linear-gradient(90deg,#216ae9,#6f54ed);color:#fff;box-shadow:0 8px 20px rgba(53,89,224,.22)}
  .cl-booking-day.is-active small{color:rgba(255,255,255,.8)}
  .cl-booking-times{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
  .cl-booking-time{min-width:0}
  .cl-booking-live{margin-top:2px}
  .cl-booking-live>span{display:block;font:700 13px/1.2 "Montserrat",sans-serif;color:#17233a;margin:0 0 9px}
  .cl-booking-live+.cl-booking-live{margin-top:14px}
  .cl-booking-feedback{margin:12px 0 0;border-radius:14px;padding:11px 13px;font:600 12px/1.45 "Montserrat",sans-serif;display:none}
  .cl-booking-feedback.is-visible{display:block}
  .cl-booking-feedback.is-error{background:#fff0f2;color:#a82d46;border:1px solid #ffd1d9}
  .cl-booking-feedback.is-success{background:#eaf9f2;color:#11744d;border:1px solid #c9eedf}
  .cl-booking-empty{padding:12px 14px;background:#f7f9fd;border:1px solid #e5eaf2;border-radius:13px;color:#6e7c94;font:500 12px/1.4 "Montserrat",sans-serif}
  @media(max-width:700px){.cl-booking-times{grid-template-columns:repeat(2,minmax(0,1fr))}.cl-booking-day,.cl-booking-time{font-size:12px;padding:10px 11px}}
</style>
<script id="cl-booking-runtime">
(function(){
  var state={root:null,slots:[],groups:{},date:"",slot:"",service:"",loading:false,ready:false};

  function norm(el){return (el&&el.textContent?el.textContent:"").replace(/\\s+/g," ").trim();}
  function leafExact(text,root){
    return Array.from((root||document).querySelectorAll("*")).find(function(el){
      return el.children.length===0 && norm(el)===text;
    });
  }
  function modalRoot(){
    var heading=Array.from(document.querySelectorAll("h1,h2,h3,div,p")).find(function(el){
      return norm(el).indexOf("Agenda tu videollamada de diagnóstico")!==-1;
    });
    if(!heading)return null;
    var n=heading;
    for(var i=0;i<9&&n;i++,n=n.parentElement){
      var txt=norm(n);
      if(txt.indexOf("Solicitar videollamada")!==-1 && n.querySelectorAll("input").length>=3)return n;
    }
    return null;
  }
  function blockFor(labelText,root){
    var label=leafExact(labelText,root) || Array.from(root.querySelectorAll("label,div,span,p")).find(function(el){return norm(el)===labelText;});
    if(!label)return null;
    var n=label.parentElement;
    for(var i=0;i<4&&n&&n!==root;i++,n=n.parentElement){
      var btns=n.querySelectorAll("button").length;
      if(btns>=3 && norm(n).length<800)return n;
    }
    return label.parentElement;
  }
  function localDateKey(iso){
    var parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Bogota",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(iso));
    var map={};parts.forEach(function(p){map[p.type]=p.value;});
    return map.year+"-"+map.month+"-"+map.day;
  }
  function dayLabel(key){
    var d=new Date(key+"T12:00:00-05:00");
    return {
      weekday:new Intl.DateTimeFormat("es-CO",{weekday:"short",timeZone:"America/Bogota"}).format(d).replace(".",""),
      date:new Intl.DateTimeFormat("es-CO",{day:"numeric",month:"short",timeZone:"America/Bogota"}).format(d).replace(".","")
    };
  }
  function timeLabel(iso){
    return new Intl.DateTimeFormat("es-CO",{hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(iso));
  }
  function todayBogota(){
    var parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Bogota",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
    var m={};parts.forEach(function(p){m[p.type]=p.value;});
    return m.year+"-"+m.month+"-"+m.day;
  }
  function feedback(root,msg,type){
    var box=root.querySelector(".cl-booking-feedback");
    if(!box){
      box=document.createElement("div");box.className="cl-booking-feedback";
      var submit=Array.from(root.querySelectorAll("button,a")).find(function(el){return norm(el).indexOf("Solicitar videollamada")!==-1;});
      if(submit&&submit.parentElement)submit.parentElement.insertBefore(box,submit);
      else root.appendChild(box);
    }
    box.textContent=msg;box.className="cl-booking-feedback is-visible "+(type==="success"?"is-success":"is-error");
  }
  function render(root){
    var oldDay=blockFor("Día",root), oldTime=blockFor("Hora",root);
    if(!oldDay||!oldTime)return false;

    if(!root.querySelector(".cl-booking-days-live")){
      var dayWrap=document.createElement("div");
      dayWrap.className="cl-booking-live cl-booking-days-live";
      dayWrap.innerHTML='<span>Día</span><div class="cl-booking-days"></div>';
      oldDay.style.display="none";
      oldDay.parentElement.insertBefore(dayWrap,oldDay);
    }
    if(!root.querySelector(".cl-booking-times-live")){
      var timeWrap=document.createElement("div");
      timeWrap.className="cl-booking-live cl-booking-times-live";
      timeWrap.innerHTML='<span>Hora</span><div class="cl-booking-times"></div>';
      oldTime.style.display="none";
      oldTime.parentElement.insertBefore(timeWrap,oldTime);
    }

    var daysEl=root.querySelector(".cl-booking-days"), timesEl=root.querySelector(".cl-booking-times");
    var dates=Object.keys(state.groups).sort().slice(0,7);
    if(!dates.length){
      daysEl.innerHTML='<div class="cl-booking-empty">No hay horarios disponibles en los próximos días.</div>';
      timesEl.innerHTML="";
      state.date="";state.slot="";return true;
    }
    if(!state.date||!state.groups[state.date])state.date=dates[0];
    daysEl.innerHTML="";
    dates.forEach(function(key){
      var info=dayLabel(key),b=document.createElement("button");b.type="button";
      b.className="cl-booking-day"+(key===state.date?" is-active":"");
      b.innerHTML='<b>'+info.weekday+'</b><small>'+info.date+'</small>';
      b.onclick=function(){state.date=key;state.slot="";render(root);};
      daysEl.appendChild(b);
    });
    var list=state.groups[state.date]||[];
    timesEl.innerHTML="";
    list.forEach(function(slot){
      var b=document.createElement("button");b.type="button";
      b.className="cl-booking-time"+(slot.slot_start===state.slot?" is-active":"");
      b.textContent=timeLabel(slot.slot_start);
      b.onclick=function(){state.slot=slot.slot_start;render(root);};
      timesEl.appendChild(b);
    });
    return true;
  }
  async function load(root){
    if(state.loading)return;
    state.loading=true;
    try{
      var res=await fetch("/api/booking?start="+encodeURIComponent(todayBogota())+"&days=21",{headers:{"Accept":"application/json"}});
      var json=await res.json();
      if(!res.ok||!json.ok)throw new Error(json.error||"No fue posible cargar la agenda.");
      state.slots=json.slots||[];state.groups={};
      state.slots.forEach(function(slot){
        var key=localDateKey(slot.slot_start);
        (state.groups[key]||(state.groups[key]=[])).push(slot);
      });
      state.date="";state.slot="";render(root);
    }catch(err){feedback(root,err&&err.message?err.message:"No fue posible cargar la disponibilidad.","error");}
    state.loading=false;
  }
  function field(root,labelText){
    var labels=Array.from(root.querySelectorAll("label"));
    var label=labels.find(function(el){return norm(el).indexOf(labelText)!==-1;});
    if(label){
      var direct=label.querySelector("input,textarea,select");if(direct)return direct;
      if(label.parentElement){var near=label.parentElement.querySelector("input,textarea,select");if(near)return near;}
    }
    var leaf=leafExact(labelText,root);
    if(leaf){
      var n=leaf.parentElement;
      for(var i=0;i<3&&n;i++,n=n.parentElement){
        var inp=n.querySelector("input,textarea,select");if(inp)return inp;
      }
    }
    return null;
  }
  function whatsappInfo(root){
    var marker=leafExact("WhatsApp",root)||Array.from(root.querySelectorAll("label,div,span")).find(function(el){return norm(el)==="WhatsApp";});
    var n=marker?marker.parentElement:null;
    for(var i=0;i<4&&n&&n!==root;i++,n=n.parentElement){
      var input=n.querySelector('input[type="tel"],input:not([type])');
      var select=n.querySelector("select");
      if(input)return {number:input.value||"",code:select?select.value||"+57":"+57"};
    }
    var fallback=field(root,"WhatsApp");
    return {number:fallback?fallback.value:"",code:"+57"};
  }
  function selectedServiceFromClick(el){
    var t=norm(el);
    if(t.indexOf("sistemas con IA")!==-1||t.indexOf("Sistemas con IA")!==-1)return "Sistemas con IA a la medida";
    if(t.indexOf("Agentes de IA")!==-1)return "Agente de IA automatizado";
    if(t.indexOf("marketing digital")!==-1||t.indexOf("Marketing digital")!==-1)return "Marketing digital";
    if(t.indexOf("Aún no lo sé")!==-1||t.indexOf("diagnóstico")!==-1&&t.length<80)return "Otro";
    return "";
  }
  async function submit(root,button){
    if(state.loading)return;
    var name=field(root,"Nombre y apellido"),brand=field(root,"Marca personal o empresa"),email=field(root,"Correo");
    var wa=whatsappInfo(root);
    if(!name||!name.value.trim()||!email||!email.value.trim()||!wa.number.trim()||!state.service||!state.slot){
      feedback(root,"Completa tus datos, elige el servicio y selecciona un horario disponible.","error");return;
    }
    state.loading=true;
    var original=norm(button);button.setAttribute("aria-busy","true");button.style.pointerEvents="none";button.textContent="Confirmando…";
    try{
      var res=await fetch("/api/booking",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({
        full_name:name.value.trim(),brand_name:brand?brand.value.trim():"",
        country:"Colombia",country_code:wa.code,whatsapp:wa.number.trim(),email:email.value.trim(),
        solution_interest:state.service,starts_at:state.slot
      })});
      var json=await res.json();
      if(!res.ok||!json.ok)throw new Error(json.error||"No fue posible confirmar la videollamada.");
      var when=timeLabel(state.slot)+" · "+new Intl.DateTimeFormat("es-CO",{weekday:"long",day:"numeric",month:"long",timeZone:"America/Bogota"}).format(new Date(state.slot));
      feedback(root,"Videollamada confirmada para "+when+" (hora de Colombia). Quedó registrada en nuestro CRM.","success");
      button.textContent="Videollamada confirmada ✓";button.disabled=true;
      state.loading=false;
      setTimeout(function(){load(root);},600);
      return;
    }catch(err){
      feedback(root,err&&err.message?err.message:"No fue posible confirmar la videollamada.","error");
      button.textContent=original||"Solicitar videollamada";button.style.pointerEvents="";button.removeAttribute("aria-busy");
      await load(root);
    }
    state.loading=false;
  }
  function init(){
    var root=modalRoot();
    if(!root)return;
    if(state.root!==root){state.root=root;state.service="";state.date="";state.slot="";state.ready=false;}
    root.classList.add("cl-booking-ready");
    if(!state.ready){state.ready=true;load(root);}
  }

  document.addEventListener("click",function(e){
    var root=modalRoot();if(!root)return;
    var clickable=e.target&&e.target.closest?e.target.closest("button,a,label,div"):null;
    if(clickable&&root.contains(clickable)){
      var service=selectedServiceFromClick(clickable);if(service)state.service=service;
    }
    var action=e.target&&e.target.closest?e.target.closest("button,a"):null;
    if(action&&root.contains(action)&&norm(action).indexOf("Solicitar videollamada")!==-1){
      e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      submit(root,action);
    }
  },true);

  var observer=new MutationObserver(function(){init();});
  observer.observe(document.documentElement,{subtree:true,childList:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
  setInterval(init,1200);
})();
</script>
`;


const UNIFIED_BOOKING_CTA = \`
<style id="cl-unified-booking-cta-styles">
  .cl-booking-cta-label{white-space:nowrap}
</style>
<script id="cl-unified-booking-cta">
(function(){
  var CTA_TEXTS=[
    "Continuar por WhatsApp",
    "Hablar por WhatsApp",
    "Agendar videollamada de diagnóstico",
    "Solicitar videollamada",
    "Solicitar videollamada de diagnóstico"
  ];

  function norm(el){
    return (el&&el.textContent?el.textContent:"").replace(/\\s+/g," ").trim();
  }

  function isBookingModal(el){
    if(!el)return false;
    var node=el;
    for(var i=0;i<10&&node;i++,node=node.parentElement){
      var txt=norm(node);
      if((txt.indexOf("Agenda tu diagnóstico")!==-1||txt.indexOf("Agenda tu videollamada de diagnóstico")!==-1) && node.querySelectorAll("input").length>=3){
        return true;
      }
    }
    return false;
  }

  function fieldByLabel(root,labelText){
    var labels=Array.from(root.querySelectorAll("label"));
    var label=labels.find(function(el){return norm(el).toLowerCase().indexOf(labelText.toLowerCase())!==-1;});
    if(label){
      var input=label.querySelector("input,select,textarea");
      if(input)return input;
      if(label.htmlFor){
        var linked=root.querySelector("#"+CSS.escape(label.htmlFor));
        if(linked)return linked;
      }
      var next=label.nextElementSibling;
      if(next&&next.matches&&next.matches("input,select,textarea"))return next;
    }
    return null;
  }

  function valueFrom(form,names,label){
    if(!form)return "";
    for(var i=0;i<names.length;i++){
      var el=form.elements&&form.elements.namedItem?form.elements.namedItem(names[i]):null;
      if(el&&typeof el.value==="string"&&el.value.trim())return el.value.trim();
    }
    var labelled=fieldByLabel(form,label);
    return labelled&&typeof labelled.value==="string"?labelled.value.trim():"";
  }

  function selectedService(form){
    if(!form)return "";
    var selected=form.querySelector('input[type="radio"]:checked,input[type="checkbox"]:checked');
    if(selected){
      var lab=selected.closest("label");
      if(lab)return norm(lab);
      if(selected.value)return selected.value;
    }
    var buttons=Array.from(form.querySelectorAll("button,[role=button],label")).filter(function(el){
      var cls=(el.className||"").toString();
      var aria=el.getAttribute&&el.getAttribute("aria-checked");
      return /active|selected|checked/i.test(cls)||aria==="true";
    });
    var svc=buttons.find(function(el){
      var t=norm(el);
      return /sistemas con ia|agentes de ia|marketing digital|diagnóstico/i.test(t);
    });
    return svc?norm(svc):"";
  }

  function collect(form){
    return {
      name:valueFrom(form,["name","nombre","full_name"],"Nombre y apellido"),
      brand:valueFrom(form,["brand","marca","brand_name"],"Marca personal o empresa"),
      phone:valueFrom(form,["phone","whatsapp","telefono"],"WhatsApp"),
      email:valueFrom(form,["email","correo"],"Correo"),
      service:selectedService(form)
    };
  }

  function setValue(el,value){
    if(!el||!value)return;
    el.value=value;
    el.dispatchEvent(new Event("input",{bubbles:true}));
    el.dispatchEvent(new Event("change",{bubbles:true}));
  }

  function prefill(values){
    if(!values)return;
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      var heading=Array.from(document.querySelectorAll("h1,h2,h3")).find(function(el){
        var t=norm(el);
        return t.indexOf("Agenda tu diagnóstico")!==-1||t.indexOf("Agenda tu videollamada de diagnóstico")!==-1;
      });
      if(!heading){if(tries>12)clearInterval(timer);return;}
      var root=heading;
      for(var i=0;i<10&&root;i++,root=root.parentElement){
        if(root.querySelectorAll&&root.querySelectorAll("input").length>=3)break;
      }
      if(!root){if(tries>12)clearInterval(timer);return;}

      setValue(fieldByLabel(root,"Nombre y apellido"),values.name);
      setValue(fieldByLabel(root,"Marca personal o empresa"),values.brand);
      setValue(fieldByLabel(root,"WhatsApp"),values.phone);
      setValue(fieldByLabel(root,"Correo"),values.email);

      if(values.service){
        var serviceNodes=Array.from(root.querySelectorAll("button,label,[role=button]"));
        var wanted=values.service.toLowerCase();
        var match=serviceNodes.find(function(el){
          var t=norm(el).toLowerCase();
          if(!t)return false;
          if(wanted.indexOf("sistemas")!==-1)return t.indexOf("sistemas")!==-1;
          if(wanted.indexOf("agentes")!==-1)return t.indexOf("agentes")!==-1;
          if(wanted.indexOf("marketing")!==-1)return t.indexOf("marketing")!==-1;
          if(wanted.indexOf("diagnóstico")!==-1||wanted.indexOf("diagnostico")!==-1)return t.indexOf("diagnóstico")!==-1||t.indexOf("diagnostico")!==-1;
          return false;
        });
        if(match)match.click();
      }
      clearInterval(timer);
    },120);
  }

  function openBooking(values){
    if(typeof window.openModal==="function"){
      window.openModal("booking");
      prefill(values);
      return true;
    }
    var trigger=Array.from(document.querySelectorAll("button,a")).find(function(el){
      var t=norm(el);
      return t==="Agendar diagnóstico"||t==="Agendar videollamada de diagnóstico";
    });
    if(trigger){
      trigger.click();
      prefill(values);
      return true;
    }
    return false;
  }

  function patchText(){
    Array.from(document.querySelectorAll("button,a")).forEach(function(el){
      var text=norm(el);
      if(CTA_TEXTS.indexOf(text)!==-1){
        el.textContent="Agendar diagnóstico";
        el.classList.add("cl-booking-cta-label");
        if(el.tagName==="A")el.removeAttribute("target");
      }
    });
  }

  function isUnifiedCta(el){
    if(!el)return false;
    var t=norm(el);
    return t==="Agendar diagnóstico"||CTA_TEXTS.indexOf(t)!==-1;
  }

  document.addEventListener("click",function(event){
    var action=event.target&&event.target.closest?event.target.closest("button,a"):null;
    if(!action||!isUnifiedCta(action)||isBookingModal(action))return;
    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation)event.stopImmediatePropagation();
    var form=action.closest("form");
    openBooking(collect(form));
  },true);

  document.addEventListener("submit",function(event){
    var form=event.target;
    if(!(form instanceof HTMLFormElement)||isBookingModal(form))return;
    var action=Array.from(form.querySelectorAll("button,input[type=submit]")).find(function(el){
      return isUnifiedCta(el)||el.value==="Agendar diagnóstico";
    });
    if(!action)return;
    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation)event.stopImmediatePropagation();
    openBooking(collect(form));
  },true);

  var observer=new MutationObserver(patchText);
  observer.observe(document.documentElement,{subtree:true,childList:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",patchText);else patchText();
  setTimeout(patchText,300);
  setTimeout(patchText,1200);
})();
</script>
\`;

function getOriginalHtml() {
  const html = gunzipSync(Buffer.from(COMPRESSED_HTML, "base64")).toString("utf8")
    .replace("Míralo funcionar.", "Así trabajamos.")
    .replace(
      "Tres servicios, tres demostraciones que se mueven solas. Si quieres, toca cualquier paso.",
      "Tres servicios, tres demostraciones que muestran cómo captamos, atendemos y convertimos contactos en oportunidades reales. Si quieres, toca cualquier paso."
    )
    .replace("Sistemas con IA a la medida", "Creamos sistemas con IA a la medida")
    .replace(
      "Que ningún contacto se pierda y sepas quién llegó, qué necesita y cuándo hacer seguimiento.",
      "Conectamos tu web, agendamiento, CRM, automatizaciones y seguimiento para que ningún contacto se pierda y tu negocio sepa qué hacer después."
    )
    .replace("Agentes de IA", "Creamos agentes de IA")
    .replace(
      "Que nadie se quede sin respuesta, ni de noche ni en fines de semana, y tu equipo atienda solo a quien ya está listo para avanzar.",
      "Responden, filtran, agendan y hacen seguimiento incluso cuando tú no estás, para que tu equipo atienda a quienes realmente están listos para avanzar."
    )
    .replace("Atraemos clientes", "Creamos tus campañas")
    .replace("con marketing digital", "de marketing digital")
    .replace(
      "Que más personas te encuentren, entiendan por qué elegirte y dejen sus datos.",
      "Diseñamos campañas para atraer a las personas correctas y conectamos cada anuncio con una experiencia que capta sus datos, agenda y deja el seguimiento listo."
    );
  return replaceMarketingRuntime(replaceFlowScenes(replaceCompareScenes(html)))
    .replace("</head>", SECTION_TITLE_WEIGHT_OVERRIDE + MOBILE_FLOW_FIXES + compareStyles + flowStyles + marketingStyles + bookingStyles + `\n  <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://complicelab.com/#organization","name":"Cómplice Lab","url":"https://complicelab.com/","logo":"https://complicelab.com/brand/complice-lab-logo.svg","email":"complicelab@gmail.com","telephone":"+57 316 177 2880","areaServed":{"@type":"Country","name":"Colombia"},"sameAs":["https://www.instagram.com/complicelab/"]},{"@type":"WebSite","@id":"https://complicelab.com/#website","url":"https://complicelab.com/","name":"Cómplice Lab","publisher":{"@id":"https://complicelab.com/#organization"},"inLanguage":"es-CO"},{"@type":"Service","name":"Sistemas con IA a la medida","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":{"@type":"Country","name":"Colombia"},"serviceType":"Sistemas con inteligencia artificial a la medida"},{"@type":"Service","name":"Agentes de IA automatizados","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":{"@type":"Country","name":"Colombia"},"serviceType":"Agentes de inteligencia artificial automatizados"},{"@type":"Service","name":"Marketing digital para atraer clientes","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":{"@type":"Country","name":"Colombia"},"serviceType":"Marketing digital, Meta Ads y captación de oportunidades"}]}</script>\n  <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"shortcut icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"apple-touch-icon\" href=\"/favicon.png\">\n` + "</head>")
    .replace("</body>", HOMEPAGE_COPY_FIX + HOMEPAGE_FOOTER_ENHANCEMENT + MOBILE_FLOW_SCRIPT + UNIFIED_BOOKING_CTA + compareInteractions + flowInteractions + marketingInteractions + "</body>");
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cómplice Lab | Sistemas con IA, Agentes de IA y Marketing Digital" },
      { name: "description", content: "Creamos sistemas con IA a la medida, agentes automatizados y campañas de marketing digital para profesionales y empresas donde la confianza decide la compra." },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Cómplice Lab | Sistemas con IA, Agentes de IA y Marketing Digital" },
      { property: "og:description", content: "Sistemas con IA, agentes automatizados y marketing digital para atraer, atender y gestionar mejores oportunidades." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://complicelab.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/" }],
  }),
  server: {
    handlers: {
      GET: async () => {
        const html = replaceBookingRuntime(getOriginalHtml(), {
          url: import.meta.env["VITE_SUPABASE_URL"],
          key: import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
        });
        const body = Buffer.from(html, "utf8");

        return new Response(body, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Content-Length": String(body.byteLength),
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
