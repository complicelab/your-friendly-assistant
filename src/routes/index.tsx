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
    var contactHeading=Array.from(document.querySelectorAll("h1,h2,h3")).find(function(el){
      return normalized(el).toLowerCase().indexOf("hablemos de")!==-1 && normalized(el).toLowerCase().indexOf("negocio")!==-1;
    });
    var contactSection=contactHeading ? (contactHeading.closest("section") || contactHeading.parentElement) : null;
    if(contactSection){
      var candidates=Array.from(contactSection.querySelectorAll("a,button")).filter(function(el){
        return normalized(el)==="Agendar diagnóstico";
      });
      if(candidates.length>1)candidates.slice(0,-1).forEach(function(el){el.remove();});
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run);
  else run();
  setTimeout(run,250);
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


const UNIFIED_BOOKING_CTA = `
<style id="cl-unified-booking-cta-styles">
  .cl-booking-cta-label{white-space:nowrap}
  .cl-inline-booking-root{height:auto!important;max-height:none!important;overflow:visible!important}
  .cl-inline-booking{grid-column:1/-1;contain:layout paint;margin:4px 0 8px;padding:0;border:1px solid #dce5f3;border-radius:18px;background:#fff;box-shadow:none;overflow:visible}
  .cl-inline-booking-toggle{width:100%;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;gap:10px;align-items:center;padding:12px 14px;border:0;background:linear-gradient(145deg,#f8fbff 0%,#f4f2ff 100%);border-radius:18px;cursor:pointer;text-align:left}
  .cl-inline-booking-toggle:hover{background:linear-gradient(145deg,#f3f8ff 0%,#efedff 100%)}
  .cl-inline-booking-field{min-width:0}
  .cl-inline-booking-field span{display:block;font:700 10px/1.2 "Montserrat",sans-serif;color:#71809b;margin-bottom:4px}
  .cl-inline-booking-field b{display:block;font:700 12px/1.3 "Montserrat",sans-serif;color:#17233a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .cl-inline-booking-action{display:inline-flex;align-items:center;gap:6px;font:700 11px/1 "Montserrat",sans-serif;color:#2d63e8;background:#fff;border:1px solid #d8e2f3;border-radius:999px;padding:9px 11px;white-space:nowrap}
  .cl-inline-booking-action:after{content:"⌄";font-size:13px;transition:transform .2s ease}
  .cl-inline-booking.is-open .cl-inline-booking-action:after{transform:rotate(180deg)}
  .cl-inline-booking-panel{display:none;padding:14px;border-top:1px solid #e6ebf4;background:#fff;border-radius:0 0 18px 18px}
  .cl-inline-booking.is-open .cl-inline-booking-panel{display:block}
  .cl-inline-booking-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:12px}
  .cl-inline-booking-head span{display:block;font:700 10px/1.2 "Montserrat",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#3971ec;margin-bottom:4px}
  .cl-inline-booking-head b{font:700 14px/1.3 "Poppins",sans-serif;color:#0f172a}
  .cl-inline-booking-head small{font:500 10px/1.4 "Montserrat",sans-serif;color:#71809b;text-align:right}
  .cl-inline-days{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 8px;scrollbar-width:none}
  .cl-inline-days::-webkit-scrollbar{display:none}
  .cl-inline-day{flex:0 0 auto;min-width:74px;border:1px solid #dfe6f0;background:#fff;color:#17233a;border-radius:14px;padding:10px 12px;display:grid;gap:2px;text-align:center;font:700 12px/1.15 "Montserrat",sans-serif;cursor:pointer;transition:.2s ease}
  .cl-inline-day small{font-size:10px;font-weight:500;color:#7b879c}
  .cl-inline-day.is-active{border-color:#3c6ff0;background:linear-gradient(90deg,#246ce8,#6659ed);color:#fff;box-shadow:0 9px 20px rgba(54,87,224,.2)}
  .cl-inline-day.is-active small{color:rgba(255,255,255,.82)}
  .cl-inline-times{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}
  .cl-inline-time{border:1px solid #dfe6f0;background:#fff;color:#17233a;border-radius:13px;padding:11px 8px;font:700 12px/1.15 "Montserrat",sans-serif;cursor:pointer;transition:.2s ease}
  .cl-inline-time.is-active{border-color:#3c6ff0;background:#eaf1ff;color:#245ee7;box-shadow:inset 0 0 0 1px #8ba9ff}
  .cl-inline-booking-state{margin:9px 0 0;font:500 11px/1.45 "Montserrat",sans-serif;color:#71809b}
  .cl-inline-booking-state.is-error{color:#a72a44}
  .cl-inline-booking-summary{display:none;margin-top:10px;padding:9px 10px;border-radius:11px;background:#f8faff;border:1px solid #e3e8f1;font:600 10px/1.45 "Montserrat",sans-serif;color:#34435e}
  .cl-inline-booking-summary.is-visible{display:block}
  .cl-inline-success{grid-column:1/-1;padding:28px 22px;border-radius:22px;border:1px solid #dce5f3;background:linear-gradient(145deg,#f8fbff,#f3f0ff);text-align:left}
  .cl-inline-success i{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#246ce8,#6659ed);color:#fff;font-style:normal;font-size:20px;margin-bottom:14px}
  .cl-inline-success h3{margin:0 0 8px;font:700 24px/1.1 "Poppins",sans-serif;color:#0d172a}
  .cl-inline-success p{margin:0;color:#66758f;font:500 13px/1.55 "Montserrat",sans-serif}
  .cl-inline-success strong{color:#17233a}
  @media(max-width:700px){
    .cl-inline-booking{border-radius:16px}
    .cl-inline-booking-toggle{grid-template-columns:1fr 1fr;padding:11px 12px;border-radius:16px}
    .cl-inline-booking-action{grid-column:1/-1;justify-self:stretch;justify-content:center}
    .cl-inline-booking-panel{padding:12px;border-radius:0 0 16px 16px}
    .cl-inline-booking-head{display:block}
    .cl-inline-booking-head small{display:block;text-align:left;margin-top:4px}
    .cl-inline-times{grid-template-columns:repeat(2,minmax(0,1fr))}
  }
</style>
<script id="cl-unified-booking-cta">
(function(){
  var CTA_TEXTS=["Continuar por WhatsApp","Hablar por WhatsApp","Agendar videollamada de diagnóstico","Solicitar videollamada","Solicitar videollamada de diagnóstico"];
  var inlineState={form:null,days:[],day:"",slot:"",loading:false,loaded:false};

  function norm(el){return (el&&el.textContent?el.textContent:"").replaceAll("\\n"," ").replaceAll("\\t"," ").split(" ").filter(Boolean).join(" ").trim();}
  function bookingDateKey(value){
    var parts=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"America/Bogota"}).formatToParts(value);
    var map={};parts.forEach(function(p){map[p.type]=p.value;});
    return map.year+"-"+map.month+"-"+map.day;
  }
  function longDate(value){return new Intl.DateTimeFormat("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(value));}
  function shortDay(value){return new Intl.DateTimeFormat("es-CO",{weekday:"short",timeZone:"America/Bogota"}).format(new Date(value)).replace(".","");}
  function shortDate(value){return new Intl.DateTimeFormat("es-CO",{day:"numeric",month:"short",timeZone:"America/Bogota"}).format(new Date(value)).replace(".","");}
  function shortTime(value){return new Intl.DateTimeFormat("es-CO",{hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(value));}
  function compactDate(value){return new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"America/Bogota"}).format(new Date(value));}
  function syncCompactBooking(form){
    if(!form)return;
    var dateEl=form.querySelector("[data-cl-selected-date]");
    var timeEl=form.querySelector("[data-cl-selected-time]");
    var action=form.querySelector(".cl-inline-booking-action");
    if(dateEl)dateEl.textContent=inlineState.slot?compactDate(inlineState.slot):"Elegir fecha";
    if(timeEl)timeEl.textContent=inlineState.slot?shortTime(inlineState.slot):"Elegir hora";
    if(action)action.textContent=inlineState.slot?"Cambiar horario":"Elegir horario";
  }
  function closeBookingPanel(form){
    var box=form&&form.querySelector(".cl-inline-booking");
    if(box)box.classList.remove("is-open");
    var toggle=form&&form.querySelector(".cl-inline-booking-toggle");
    if(toggle)toggle.setAttribute("aria-expanded","false");
  }
  function openBookingPanel(form){
    var box=form&&form.querySelector(".cl-inline-booking");
    var toggle=form&&form.querySelector(".cl-inline-booking-toggle");
    if(!box)return;
    box.classList.add("is-open");
    if(toggle)toggle.setAttribute("aria-expanded","true");
    if(!inlineState.loaded&&!inlineState.loading)loadInlineAvailability(form);
  }

  function isBookingModal(el){
    if(!el)return false;
    var node=el;
    for(var i=0;i<12&&node;i++,node=node.parentElement){
      var txt=norm(node);
      var hasPicker=!!(node.querySelector&&node.querySelector(".days")&&node.querySelector(".slots"));
      if(hasPicker&&(txt.indexOf("Agenda tu diagnóstico")!==-1||txt.indexOf("Agenda tu videollamada de diagnóstico")!==-1))return true;
    }
    return false;
  }

  function fieldByLabel(root,labelText){
    var labels=Array.from(root.querySelectorAll("label"));
    var wanted=labelText.toLowerCase();
    var label=labels.find(function(el){return norm(el).toLowerCase().indexOf(wanted)!==-1;});
    if(label){
      var controls=Array.from(label.querySelectorAll("input,textarea,select"));
      var input=null;
      if(wanted.indexOf("whatsapp")!==-1){
        input=controls.find(function(el){return el.tagName==="INPUT"&&(el.type==="tel"||el.type==="text");})
          || controls.find(function(el){return el.tagName==="INPUT"&&el.type!=="checkbox"&&el.type!=="radio";});
      }else{
        input=controls.find(function(el){return el.tagName==="INPUT"||el.tagName==="TEXTAREA";})
          || controls[0];
      }
      if(input)return input;
      if(label.htmlFor){var linked=root.querySelector("#"+CSS.escape(label.htmlFor));if(linked)return linked;}
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

  function serviceFromForm(form){
    var phrases=["sistemas con ia","agentes de ia","marketing digital","quiero un diagnóstico","quiero un diagnostico"];
    var radios=Array.from(form.querySelectorAll('input[type="radio"]:checked,input[type="checkbox"]:checked'));
    for(var i=0;i<radios.length;i++){
      var lab=radios[i].closest("label");
      if(lab&&phrases.some(function(p){return norm(lab).toLowerCase().indexOf(p)!==-1;}))return norm(lab);
    }
    var active=Array.from(form.querySelectorAll("label,button,[role=button]")).find(function(el){
      var t=norm(el).toLowerCase();
      if(!phrases.some(function(p){return t.indexOf(p)!==-1;}))return false;
      var cls=(el.className||"").toString();
      return /active|selected|checked|(^|\s)(sel|on|s)(\s|$)/i.test(cls)||el.getAttribute("aria-checked")==="true"||el.getAttribute("aria-pressed")==="true";
    });
    return active?norm(active):"";
  }

  function collect(form){
    var code="";
    var codeSelect=Array.from(form.querySelectorAll("select")).find(function(el){return String(el.value||"").trim().charAt(0)==="+";});
    if(codeSelect)code=codeSelect.value;
    var phone=valueFrom(form,["phone","whatsapp","telefono"],"WhatsApp");
    return {
      name:valueFrom(form,["name","nombre","full_name"],"Nombre y apellido"),
      brand:valueFrom(form,["brand","marca","brand_name"],"Marca personal o empresa"),
      phone:phone,
      code:code||"+57",
      email:valueFrom(form,["email","correo"],"Correo"),
      country:valueFrom(form,["pais","country"],"País")||"Colombia",
      service:serviceFromForm(form)
    };
  }

  function isContactBookingRoot(root){
    if(!root||!root.querySelectorAll)return false;
    var text=norm(root).toLowerCase();
    return root.querySelectorAll("input").length>=3
      &&text.indexOf("marca personal o empresa")!==-1
      &&text.indexOf("whatsapp")!==-1
      &&text.indexOf("correo")!==-1
      &&text.indexOf("servicio te interesa")!==-1;
  }

  function contactBookingRoot(from){
    if(!from)return null;
    var node=from;
    while(node&&node!==document.body){
      if(isContactBookingRoot(node))return node;
      node=node.parentElement;
    }
    return null;
  }

  function findContactBookingRoot(){
    var candidates=Array.from(document.querySelectorAll("form,section,div")).filter(isContactBookingRoot);
    if(!candidates.length)return null;
    candidates.sort(function(a,b){
      var ai=a.querySelectorAll("*").length;
      var bi=b.querySelectorAll("*").length;
      return ai-bi;
    });
    return candidates[0];
  }

  function renderInlineTimes(){
    var form=inlineState.form;if(!form)return;
    var host=form.querySelector(".cl-inline-times"),summary=form.querySelector(".cl-inline-booking-summary");
    var day=inlineState.days.find(function(item){return item.key===inlineState.day;});
    if(!host)return;
    host.innerHTML=day?day.slots.map(function(slot){
      return '<button type="button" class="cl-inline-time'+(slot.slot_start===inlineState.slot?' is-active':'')+'" data-inline-slot="'+slot.slot_start+'">'+shortTime(slot.slot_start)+'</button>';
    }).join(""):"";
    Array.from(host.querySelectorAll("[data-inline-slot]")).forEach(function(btn){
      btn.addEventListener("click",function(){
        inlineState.slot=btn.getAttribute("data-inline-slot")||"";
        renderInlineTimes();
        syncCompactBooking(form);
        setTimeout(function(){closeBookingPanel(form);},120);
      });
    });
    if(summary){
      if(inlineState.slot){summary.textContent="Seleccionaste: "+longDate(inlineState.slot)+" · Hora de Colombia";summary.classList.add("is-visible");}
      else{summary.textContent="";summary.classList.remove("is-visible");}
    }
  }

  function renderInlineDays(){
    var form=inlineState.form;if(!form)return;
    var host=form.querySelector(".cl-inline-days");if(!host)return;
    host.innerHTML=inlineState.days.map(function(day){
      var first=day.slots[0].slot_start;
      return '<button type="button" class="cl-inline-day'+(day.key===inlineState.day?' is-active':'')+'" data-inline-day="'+day.key+'"><span>'+shortDay(first)+'</span><small>'+shortDate(first)+'</small></button>';
    }).join("");
    Array.from(host.querySelectorAll("[data-inline-day]")).forEach(function(btn){
      btn.addEventListener("click",function(){inlineState.day=btn.getAttribute("data-inline-day")||"";inlineState.slot="";renderInlineDays();renderInlineTimes();});
    });
  }

  async function loadInlineAvailability(form){
    inlineState.form=form;inlineState.loading=true;inlineState.loaded=false;
    var status=form.querySelector(".cl-inline-booking-state");
    if(status){status.textContent="Consultando horarios disponibles…";status.classList.remove("is-error");}
    try{
      var response=await fetch("/api/booking?start="+encodeURIComponent(bookingDateKey(new Date()))+"&days=14",{headers:{"Accept":"application/json"}});
      var data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.error||"No fue posible consultar horarios.");
      var grouped={};
      (data.slots||[]).forEach(function(slot){
        var key=bookingDateKey(new Date(slot.slot_start));
        if(!grouped[key])grouped[key]={key:key,slots:[]};
        grouped[key].slots.push(slot);
      });
      inlineState.days=Object.keys(grouped).sort().map(function(key){return grouped[key];});
      if(inlineState.days.length)inlineState.day=inlineState.days[0].key;
      renderInlineDays();renderInlineTimes();
      inlineState.loaded=true;
      if(status)status.textContent=inlineState.days.length?"Elige la hora que mejor te funcione. Todos los horarios son hora de Colombia.":"No hay horarios disponibles en los próximos días.";
    }catch(error){
      inlineState.days=[];
      if(status){status.textContent="No pudimos cargar los horarios. Recarga la página para intentarlo de nuevo.";status.classList.add("is-error");}
    }
    inlineState.loading=false;
  }

  function directChildUnder(node,root){
    if(!node||!root)return null;
    var current=node;
    while(current.parentElement&&current.parentElement!==root)current=current.parentElement;
    return current.parentElement===root?current:null;
  }

  function enhanceContactForm(form){
    if(!form||form.dataset.clInlineBooking==="1")return;
    form.dataset.clInlineBooking="1";

    var consent=Array.from(form.querySelectorAll('input[type="checkbox"]')).find(function(input){
      var label=input.closest("label")||input.parentElement;
      return label&&norm(label).toLowerCase().indexOf("autorizo")!==-1;
    });
    var submit=Array.from(form.querySelectorAll("button,a")).find(function(el){
      return isUnifiedCta(el)||CTA_TEXTS.indexOf(norm(el))!==-1;
    });
    var anchor=consent?(consent.closest("label")||consent.parentElement):submit;
    var rootAnchor=directChildUnder(anchor,form)||anchor;

    form.classList.add("cl-inline-booking-root");
    form.style.setProperty("height","auto","important");
    form.style.setProperty("max-height","none","important");
    form.style.setProperty("overflow","visible","important");

    var box=document.createElement("div");
    box.className="cl-inline-booking";
    box.setAttribute("data-cl-booking-ui","1");
    box.innerHTML='<button type="button" class="cl-inline-booking-toggle" aria-expanded="false"><span class="cl-inline-booking-field"><span>Fecha preferida</span><b data-cl-selected-date>Elegir fecha</b></span><span class="cl-inline-booking-field"><span>Hora disponible</span><b data-cl-selected-time>Elegir hora</b></span><span class="cl-inline-booking-action">Elegir horario</span></button><div class="cl-inline-booking-panel"><div class="cl-inline-booking-head"><div><span>Agenda tu diagnóstico</span><b>Elige fecha y hora</b></div><small>Disponibilidad real · hora de Colombia</small></div><div class="cl-inline-days"></div><div class="cl-inline-times"></div><p class="cl-inline-booking-state">Abre el selector para consultar horarios disponibles.</p><div class="cl-inline-booking-summary"></div></div>';

    if(rootAnchor&&rootAnchor.parentElement===form)form.insertBefore(box,rootAnchor);
    else form.appendChild(box);

    var toggle=box.querySelector(".cl-inline-booking-toggle");
    if(toggle)toggle.addEventListener("click",function(){
      if(box.classList.contains("is-open"))closeBookingPanel(form);
      else openBookingPanel(form);
    });
    syncCompactBooking(form);
  }

  async function submitInlineBooking(form,button){
    if(inlineState.loading)return;
    var values=collect(form),status=form.querySelector(".cl-inline-booking-state");
    if(!values.name||!values.phone||!values.email){if(status){status.textContent="Completa nombre, WhatsApp y correo.";status.classList.add("is-error");}return;}
    if(!values.service){if(status){status.textContent="Selecciona el servicio que te interesa.";status.classList.add("is-error");}return;}
    if(!inlineState.slot){
      openBookingPanel(form);
      if(status){status.textContent="Elige una fecha y una hora disponibles.";status.classList.add("is-error");}
      return;
    }
    var consent=Array.from(form.querySelectorAll('input[type="checkbox"]')).find(function(input){
      var label=input.closest("label")||input.parentElement;
      return label&&norm(label).toLowerCase().indexOf("autorizo")!==-1;
    });
    if(consent&&!consent.checked){if(status){status.textContent="Autoriza el uso de tus datos para gestionar la reserva.";status.classList.add("is-error");}return;}
    var fullPhone=(values.phone.indexOf("+")===0?values.phone:(values.code||"+57")+values.phone).split(" ").join("");
    var original=button.textContent;button.disabled=true;button.textContent="Agendando…";
    if(status){status.textContent="Guardando tu diagnóstico…";status.classList.remove("is-error");}
    try{
      var response=await fetch("/api/booking",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({
        full_name:values.name,brand_name:values.brand,country:values.country,country_code:values.code,whatsapp:fullPhone,email:values.email,solution_interest:values.service,starts_at:inlineState.slot
      })});
      var data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.error||"No fue posible agendar.");
      var first=values.name.trim().split(" ")[0]||values.name;
      form.innerHTML='<div class="cl-inline-success"><i>✓</i><h3>Diagnóstico agendado, '+first+'.</h3><p>Tu cita quedó confirmada para <strong>'+longDate(inlineState.slot)+'</strong>, hora de Colombia. La reserva ya quedó registrada en nuestro CRM y preparada para las confirmaciones correspondientes.</p></div>';
    }catch(error){
      if(status){status.textContent=error&&error.message?error.message:"No pudimos guardar la cita. Intenta nuevamente.";status.classList.add("is-error");}
      button.disabled=false;button.textContent=original||"Agendar diagnóstico";
      if(String(error&&error.message||"").toLowerCase().indexOf("horario")!==-1)loadInlineAvailability(form);
    }
  }

  function initializeBookingUI(){
    Array.from(document.querySelectorAll("button,a")).forEach(function(el){
      var text=norm(el);
      if(CTA_TEXTS.indexOf(text)!==-1){
        el.textContent="Agendar diagnóstico";
        el.classList.add("cl-booking-cta-label");
        el.removeAttribute("onclick");
        if(el.tagName==="A"){
          el.removeAttribute("target");
          el.removeAttribute("href");
        }
      }
    });
    var bookingRoot=findContactBookingRoot();
    if(bookingRoot)enhanceContactForm(bookingRoot);
  }

  function isUnifiedCta(el){
    if(!el)return false;
    var t=norm(el);
    return t==="Agendar diagnóstico"||CTA_TEXTS.indexOf(t)!==-1;
  }

  document.addEventListener("click",function(event){
    var action=event.target&&event.target.closest?event.target.closest("button,a"):null;
    if(!action||!isUnifiedCta(action)||isBookingModal(action))return;

    var root=contactBookingRoot(action)||findContactBookingRoot();
    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation)event.stopImmediatePropagation();

    if(root){
      enhanceContactForm(root);
      submitInlineBooking(root,action);
      return;
    }
    if(typeof window.openModal==="function")window.openModal("booking");
  },true);

  document.addEventListener("submit",function(event){
    var form=event.target;
    if(!(form instanceof HTMLFormElement)||isBookingModal(form))return;
    var action=Array.from(form.querySelectorAll("button,input[type=submit]")).find(function(el){
      return isUnifiedCta(el)||el.value==="Agendar diagnóstico";
    });
    if(!action)return;

    var root=contactBookingRoot(action)||contactBookingRoot(form)||findContactBookingRoot();
    if(!root)return;

    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation)event.stopImmediatePropagation();
    enhanceContactForm(root);
    submitInlineBooking(root,action);
  },true);

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",function(){
      initializeBookingUI();
      setTimeout(initializeBookingUI,350);
    },{once:true});
  }else{
    initializeBookingUI();
  }
  window.addEventListener("load",function(){setTimeout(initializeBookingUI,100);},{once:true});
})();
</script>
`;

function getOriginalHtml() {
  const html = gunzipSync(Buffer.from(COMPRESSED_HTML, "base64")).toString("utf8")
    .replace(/El diagnóstico es una sesión de pago[^<]*/g, "El diagnóstico es una sesión gratuita para entender tu negocio, detectar dónde se pierde la oportunidad y definir el mejor siguiente paso.")
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
    .replace("</head>", SECTION_TITLE_WEIGHT_OVERRIDE + MOBILE_FLOW_FIXES + compareStyles + flowStyles + marketingStyles + bookingStyles + UNIFIED_BOOKING_CTA + `\n  <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://complicelab.com/#organization","name":"Cómplice Lab","url":"https://complicelab.com/","logo":"https://complicelab.com/brand/complice-lab-logo.svg","email":"complicelab@gmail.com","telephone":"+57 316 177 2880","areaServed":{"@type":"Country","name":"Colombia"},"sameAs":["https://www.instagram.com/complicelab/"]},{"@type":"WebSite","@id":"https://complicelab.com/#website","url":"https://complicelab.com/","name":"Cómplice Lab","publisher":{"@id":"https://complicelab.com/#organization"},"inLanguage":"es-CO"},{"@type":"Service","name":"Sistemas con IA a la medida","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":{"@type":"Country","name":"Colombia"},"serviceType":"Sistemas con inteligencia artificial a la medida"},{"@type":"Service","name":"Agentes de IA automatizados","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":{"@type":"Country","name":"Colombia"},"serviceType":"Agentes de inteligencia artificial automatizados"},{"@type":"Service","name":"Marketing digital para atraer clientes","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":{"@type":"Country","name":"Colombia"},"serviceType":"Marketing digital, Meta Ads y captación de oportunidades"}]}</script>\n  <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"shortcut icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"apple-touch-icon\" href=\"/favicon.png\">\n` + "</head>")
    .replace("</body>", HOMEPAGE_COPY_FIX + HOMEPAGE_FOOTER_ENHANCEMENT + MOBILE_FLOW_SCRIPT + compareInteractions + flowInteractions + marketingInteractions + "</body>");
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
