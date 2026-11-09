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
  .cl-inline-booking{grid-column:1/-1;margin:4px 0 8px;padding:0;border:0;background:transparent;box-shadow:none;overflow:visible}
  .cl-inline-booking-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .cl-inline-booking-field{display:grid;gap:6px;min-width:0}
  .cl-inline-booking-field>span{font:700 11px/1.25 "Montserrat",sans-serif;color:#17233a}
  .cl-inline-date,.cl-inline-time-select{width:100%;height:48px;border:1px solid #dfe5ee;border-radius:14px;background:#fff;color:#17233a;padding:0 13px;font:500 12px/1 "Montserrat",sans-serif;outline:none;transition:border-color .18s ease,box-shadow .18s ease}
  .cl-inline-date:focus,.cl-inline-time-select:focus{border-color:#4f6ff0;box-shadow:0 0 0 3px rgba(79,111,240,.10)}
  .cl-inline-time-select:disabled{color:#8a96aa;background:#f7f9fc;cursor:not-allowed}
  .cl-inline-booking-note{grid-column:1/-1;margin:0;font:500 10px/1.45 "Montserrat",sans-serif;color:#7b879b}
  .cl-inline-booking-note.is-error{color:#a72a44}
  .cl-inline-booking-summary{display:none}
  .cl-inline-success{grid-column:1/-1;padding:28px 22px;border-radius:22px;border:1px solid #dce5f3;background:linear-gradient(145deg,#f8fbff,#f3f0ff);text-align:left}
  .cl-inline-success i{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#246ce8,#6659ed);color:#fff;font-style:normal;font-size:20px;margin-bottom:14px}
  .cl-inline-success h3{margin:0 0 8px;font:700 24px/1.1 "Poppins",sans-serif;color:#0d172a}
  .cl-inline-success p{margin:0;color:#66758f;font:500 13px/1.55 "Montserrat",sans-serif}
  .cl-inline-success strong{color:#17233a}
  @media(max-width:700px){
    .cl-inline-booking-grid{grid-template-columns:1fr}
    .cl-inline-date,.cl-inline-time-select{height:46px}
  }
</style>
<script id="cl-unified-booking-cta">
(function(){
  var CTA_TEXTS=["Continuar por WhatsApp","Hablar por WhatsApp","Agendar videollamada de diagnóstico","Solicitar videollamada","Solicitar videollamada de diagnóstico"];
  var inlineState={form:null,slots:[],slot:"",loading:false};

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
  function inputDate(value){
    var parts=new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"America/Bogota"}).formatToParts(new Date(value));
    var map={};parts.forEach(function(p){map[p.type]=p.value;});
    return map.year+"-"+map.month+"-"+map.day;
  }
  function setTimeOptions(form,dateKey){
    var select=form.querySelector(".cl-inline-time-select");
    if(!select)return;
    var available=inlineState.slots.filter(function(slot){return bookingDateKey(new Date(slot.slot_start))===dateKey;});
    select.innerHTML='<option value="">'+(available.length?"Selecciona una hora":"Sin horarios disponibles")+'</option>'+
      available.map(function(slot){return '<option value="'+slot.slot_start+'">'+shortTime(slot.slot_start)+'</option>';}).join("");
    select.disabled=!available.length;
    inlineState.slot="";
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

  async function loadInlineAvailability(form){
    inlineState.form=form;
    inlineState.loading=true;
    var note=form.querySelector(".cl-inline-booking-note");
    var dateInput=form.querySelector(".cl-inline-date");
    var timeSelect=form.querySelector(".cl-inline-time-select");
    if(note){note.textContent="Consultando disponibilidad…";note.classList.remove("is-error");}
    if(timeSelect){timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Cargando horarios…</option>';}
    try{
      var response=await fetch("/api/booking?start="+encodeURIComponent(bookingDateKey(new Date()))+"&days=60",{headers:{"Accept":"application/json"}});
      var data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.error||"No fue posible consultar horarios.");
      inlineState.slots=Array.isArray(data.slots)?data.slots:[];
      if(dateInput&&inlineState.slots.length){
        var dates=inlineState.slots.map(function(slot){return bookingDateKey(new Date(slot.slot_start));}).sort();
        dateInput.min=dates[0];
        dateInput.max=dates[dates.length-1];
      }
      if(note)note.textContent="Selecciona una fecha para ver las horas disponibles.";
      if(timeSelect){timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Selecciona primero una fecha</option>';}
    }catch(error){
      inlineState.slots=[];
      if(note){note.textContent="No pudimos cargar la disponibilidad. Recarga la página para intentarlo de nuevo.";note.classList.add("is-error");}
      if(timeSelect){timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Sin disponibilidad</option>';}
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
    box.innerHTML='<div class="cl-inline-booking-grid"><label class="cl-inline-booking-field"><span>Fecha preferida</span><input type="date" class="cl-inline-date" aria-label="Fecha preferida"></label><label class="cl-inline-booking-field"><span>Hora disponible</span><select class="cl-inline-time-select" aria-label="Hora disponible" disabled><option value="">Selecciona primero una fecha</option></select></label><p class="cl-inline-booking-note">Consultando disponibilidad…</p></div>';

    if(rootAnchor&&rootAnchor.parentElement===form)form.insertBefore(box,rootAnchor);
    else form.appendChild(box);

    var dateInput=box.querySelector(".cl-inline-date");
    var timeSelect=box.querySelector(".cl-inline-time-select");
    if(dateInput)dateInput.addEventListener("change",function(){
      inlineState.slot="";
      setTimeOptions(form,dateInput.value);
      var note=form.querySelector(".cl-inline-booking-note");
      if(note){note.textContent=dateInput.value?"Selecciona la hora que mejor te funcione. Hora de Colombia.":"Selecciona una fecha para ver las horas disponibles.";note.classList.remove("is-error");}
    });
    if(timeSelect)timeSelect.addEventListener("change",function(){
      inlineState.slot=timeSelect.value||"";
      var note=form.querySelector(".cl-inline-booking-note");
      if(note&&inlineState.slot){note.textContent="Horario seleccionado: "+longDate(inlineState.slot)+" · hora de Colombia.";note.classList.remove("is-error");}
    });

    loadInlineAvailability(form);
  }

  async function submitInlineBooking(form,button){
    if(inlineState.loading)return;
    var values=collect(form),status=form.querySelector(".cl-inline-booking-note");
    if(!values.name||!values.phone||!values.email){if(status){status.textContent="Completa nombre, WhatsApp y correo.";status.classList.add("is-error");}return;}
    if(!values.service){if(status){status.textContent="Selecciona el servicio que te interesa.";status.classList.add("is-error");}return;}
    if(!inlineState.slot){
      var note=form.querySelector(".cl-inline-booking-note");
      if(note){note.textContent="Elige una fecha y una hora disponibles.";note.classList.add("is-error");}
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
