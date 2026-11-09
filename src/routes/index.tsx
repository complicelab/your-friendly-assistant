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
  @media(max-width:700px){
    html,body{overflow-x:hidden!important;overscroll-behavior-x:none}
    body{-webkit-overflow-scrolling:touch}
    #pb-steps.cl-mobile-step-track{
      display:flex!important;
      gap:10px!important;
      width:100%!important;
      max-width:100vw!important;
      overflow-x:auto!important;
      overflow-y:hidden!important;
      scroll-snap-type:x mandatory!important;
      scroll-behavior:smooth!important;
      -webkit-overflow-scrolling:touch!important;
      scrollbar-width:none!important;
      overscroll-behavior-x:contain!important;
      touch-action:pan-x pan-y!important;
      padding-inline:calc(50vw - 112px)!important;
      scroll-padding-inline:calc(50vw - 112px)!important;
    }
    #pb-steps.cl-mobile-step-track::-webkit-scrollbar{display:none!important}
    #pb-steps.cl-mobile-step-track .p-st{
      flex:0 0 auto!important;
      min-width:max-content!important;
      scroll-snap-align:center!important;
      scroll-snap-stop:normal!important;
    }
    .cl-mobile-flow-line{
      z-index:3!important;
      opacity:1!important;
      visibility:visible!important;
      pointer-events:none!important;
    }
    .cl-mobile-flow-node{z-index:4!important;position:relative!important}
    .cl-booking-cta-label{position:relative!important;right:auto!important;left:auto!important}
  }
</style>
`


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

    var track=document.getElementById("pb-steps");
    if(!track)return;
    track.classList.add("cl-mobile-step-track");

    var items=Array.from(track.querySelectorAll(".p-st"));
    if(items.length<2)return;

    function activeItem(){
      return items.find(function(el){
        return el.classList.contains("on")||
          el.classList.contains("s")||
          el.classList.contains("active")||
          el.getAttribute("aria-selected")==="true"||
          el.getAttribute("aria-current")==="true";
      })||items[0];
    }

    function center(el,behavior){
      if(!el)return;
      var left=el.offsetLeft-(track.clientWidth-el.offsetWidth)/2;
      var max=Math.max(0,track.scrollWidth-track.clientWidth);
      track.scrollTo({left:Math.max(0,Math.min(max,left)),behavior:behavior||"smooth"});
    }

    if(track.dataset.clCenterReady!=="1"){
      track.dataset.clCenterReady="1";
      items.forEach(function(item){
        item.addEventListener("click",function(){
          requestAnimationFrame(function(){center(item,"smooth");});
        },{passive:true});
      });

      var observer=new MutationObserver(function(){
        var current=activeItem();
        requestAnimationFrame(function(){center(current,"smooth");});
      });
      items.forEach(function(item){
        observer.observe(item,{attributes:true,attributeFilter:["class","aria-selected","aria-current"]});
      });
    }

    requestAnimationFrame(function(){center(activeItem(),"auto");});
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
    });
  } else {
    setTimeout(run, 120);
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
  .cl-contact-booking{margin:8px 0 10px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;grid-column:1/-1;width:auto;max-width:100%;min-width:0;justify-self:stretch;box-sizing:border-box}
  .cl-contact-booking,.cl-contact-booking *{box-sizing:border-box}
  .cl-contact-booking label{display:grid;grid-template-columns:minmax(0,1fr);gap:7px;min-width:0;max-width:100%}
  .cl-contact-booking label>span{font:700 12px/1.25 "Montserrat",sans-serif;color:#111827;min-width:0}
  .cl-contact-booking input,.cl-contact-booking select{display:block;width:100%;max-width:100%;min-width:0;height:48px;border:1px solid #d9e0ea;border-radius:14px;background:#fff;color:#17233a;padding:0 13px;font:500 13px/1 "Montserrat",sans-serif;outline:none}
  .cl-contact-booking input:focus,.cl-contact-booking select:focus{border-color:#4d6ff0;box-shadow:0 0 0 3px rgba(77,111,240,.10)}
  .cl-contact-booking select:disabled{background:#f7f9fc;color:#8a96aa}
  .cl-contact-booking-note{grid-column:1/-1;margin:0;font:500 11px/1.45 "Montserrat",sans-serif;color:#71809b}
  .cl-contact-booking-note.is-error{color:#b4233b}
  @media(max-width:700px){
    a.cl-booking-cta-label,button.cl-booking-cta-label{max-width:100%;white-space:normal}
    .cl-contact-booking{grid-template-columns:minmax(0,1fr);gap:10px;width:auto!important;max-width:100%!important;min-width:0!important;margin-left:0!important;margin-right:0!important}
    .cl-contact-booking label{width:100%;max-width:100%;min-width:0}
    .cl-contact-booking input,.cl-contact-booking select{width:100%!important;max-width:100%!important;min-width:0!important;height:46px;font-size:16px}
    .cl-contact-date{-webkit-appearance:none;appearance:none}
    .cl-contact-date::-webkit-date-and-time-value{text-align:left;min-width:0}
  }
</style>
<script id="cl-unified-booking-cta">
(function(){
  var CTA_TEXTS=["Continuar por WhatsApp","Hablar por WhatsApp","Agendar videollamada de diagnóstico","Solicitar videollamada","Solicitar videollamada de diagnóstico","Agendar diagnóstico"];
  var state={root:null,slots:[],slot:"",loading:false};

  function norm(el){return (el&&el.textContent?el.textContent:"").replace(/\\s+/g," ").trim();}
  function dateKey(value){
    var parts=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"America/Bogota"}).formatToParts(new Date(value));
    var map={};parts.forEach(function(p){map[p.type]=p.value;});
    return map.year+"-"+map.month+"-"+map.day;
  }
  function longDate(value){return new Intl.DateTimeFormat("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(value));}
  function timeLabel(value){return new Intl.DateTimeFormat("es-CO",{hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(value));}
  function scrollToContact(root){
    if(!root)return;
    var heading=Array.from(document.querySelectorAll("h1,h2,h3")).find(function(el){
      var t=norm(el).toLowerCase();return t.indexOf("hablemos de")!==-1&&t.indexOf("negocio")!==-1;
    });
    var section=heading?(heading.closest("section")||heading.parentElement):root.closest("section");
    var target=section||root;
    var header=document.querySelector("header");
    var offset=(header?header.getBoundingClientRect().height:0)+16;
    var top=target.getBoundingClientRect().top+window.scrollY-offset;
    window.scrollTo({top:Math.max(0,top),behavior:"smooth"});
  }

  function fieldByLabel(root,text){
    var wanted=text.toLowerCase();
    var label=Array.from(root.querySelectorAll("label")).find(function(el){return norm(el).toLowerCase().indexOf(wanted)!==-1;});
    if(!label)return null;
    var controls=Array.from(label.querySelectorAll("input,textarea,select"));
    if(wanted.indexOf("whatsapp")!==-1){
      return controls.find(function(el){return el.tagName==="INPUT"&&(el.type==="tel"||el.type==="text");})||controls.find(function(el){return el.tagName==="INPUT";})||null;
    }
    return controls.find(function(el){return el.tagName==="INPUT"||el.tagName==="TEXTAREA";})||controls[0]||null;
  }

  function findContactRoot(){
    var heading=Array.from(document.querySelectorAll("h1,h2,h3")).find(function(el){
      var t=norm(el).toLowerCase(); return t.indexOf("hablemos de")!==-1&&t.indexOf("negocio")!==-1;
    });
    var section=heading?(heading.closest("section")||heading.parentElement):null;
    if(!section)return null;
    var candidates=Array.from(section.querySelectorAll("form,div")).filter(function(el){
      var t=norm(el).toLowerCase();
      return el.querySelectorAll("input").length>=3 &&
        t.indexOf("marca personal o empresa")!==-1 &&
        t.indexOf("whatsapp")!==-1 &&
        t.indexOf("correo")!==-1 &&
        t.indexOf("servicio te interesa")!==-1 &&
        t.indexOf("agendar diagnóstico")!==-1;
    });
    candidates.sort(function(a,b){return a.querySelectorAll("*").length-b.querySelectorAll("*").length;});
    return candidates[0]||null;
  }

  function directChildUnder(node,root){
    if(!node||!root)return null;
    var current=node;
    while(current.parentElement&&current.parentElement!==root)current=current.parentElement;
    return current.parentElement===root?current:null;
  }

  function serviceFromRoot(root){
    var phrases=["sistemas con ia","agentes de ia","marketing digital","quiero un diagnóstico","quiero un diagnostico"];
    var checked=Array.from(root.querySelectorAll('input[type="radio"]:checked,input[type="checkbox"]:checked'));
    for(var i=0;i<checked.length;i++){
      var lab=checked[i].closest("label"); if(lab&&phrases.some(function(p){return norm(lab).toLowerCase().indexOf(p)!==-1;}))return norm(lab);
    }
    var active=Array.from(root.querySelectorAll("label,button,[role=button]")).find(function(el){
      var t=norm(el).toLowerCase();
      if(!phrases.some(function(p){return t.indexOf(p)!==-1;}))return false;
      var cls=(el.className||"").toString();
      return /active|selected|checked|(^|\\s)(sel|on|s)(\\s|$)/i.test(cls)||el.getAttribute("aria-checked")==="true"||el.getAttribute("aria-pressed")==="true";
    });
    return active?norm(active):"";
  }

  function value(root,names,label){
    if(root.elements&&root.elements.namedItem){
      for(var i=0;i<names.length;i++){var el=root.elements.namedItem(names[i]);if(el&&String(el.value||"").trim())return String(el.value).trim();}
    }
    var field=fieldByLabel(root,label); return field?String(field.value||"").trim():"";
  }

  function collect(root){
    var codeSelect=Array.from(root.querySelectorAll("select")).find(function(el){return String(el.value||"").trim().charAt(0)==="+";});
    var phone=value(root,["phone","whatsapp","telefono"],"WhatsApp");
    return {
      name:value(root,["name","nombre","full_name"],"Nombre y apellido"),
      brand:value(root,["brand","marca","brand_name"],"Marca personal o empresa"),
      phone:phone,
      code:codeSelect?codeSelect.value:"+57",
      email:value(root,["email","correo"],"Correo"),
      service:serviceFromRoot(root)
    };
  }

  function setTimes(root,date){
    var select=root.querySelector(".cl-contact-time");
    if(!select)return;
    state.slot="";
    var rows=state.slots.filter(function(slot){return dateKey(slot.slot_start)===date;});
    select.innerHTML='<option value="">'+(rows.length?"Selecciona una hora":"Sin horarios disponibles")+'</option>'+rows.map(function(slot){return '<option value="'+slot.slot_start+'">'+timeLabel(slot.slot_start)+'</option>';}).join("");
    select.disabled=!rows.length;
  }

  async function loadAvailability(root){
    if(state.loading)return;
    state.loading=true;
    var note=root.querySelector(".cl-contact-booking-note");
    var dateInput=root.querySelector(".cl-contact-date");
    var timeSelect=root.querySelector(".cl-contact-time");
    if(note){note.textContent="Consultando disponibilidad…";note.classList.remove("is-error");}
    try{
      var response=await fetch("/api/booking?start="+encodeURIComponent(dateKey(new Date()))+"&days=60",{headers:{"Accept":"application/json"}});
      var data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.error||"No fue posible cargar la disponibilidad.");
      state.slots=Array.isArray(data.slots)?data.slots:[];
      if(state.slots.length&&dateInput){
        var dates=state.slots.map(function(s){return dateKey(s.slot_start);}).sort();
        dateInput.min=dates[0];dateInput.max=dates[dates.length-1];
      }
      if(timeSelect){timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Selecciona primero una fecha</option>';}
      if(note)note.textContent="Selecciona una fecha para ver las horas disponibles.";
    }catch(error){
      state.slots=[];
      if(timeSelect){timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Sin disponibilidad</option>';}
      if(note){note.textContent="No pudimos cargar la disponibilidad. Recarga la página para intentarlo de nuevo.";note.classList.add("is-error");}
    }
    state.loading=false;
  }

  function installScheduler(root){
    if(!root||root.dataset.clScheduler==="1")return;
    root.dataset.clScheduler="1";state.root=root;

    var consent=Array.from(root.querySelectorAll('input[type="checkbox"]')).find(function(input){
      var label=input.closest("label")||input.parentElement;return label&&norm(label).toLowerCase().indexOf("autorizo")!==-1;
    });
    var submit=Array.from(root.querySelectorAll("button,a")).find(function(el){return norm(el)==="Agendar diagnóstico";});
    var anchor=consent?(consent.closest("label")||consent.parentElement):submit;
    var rootAnchor=directChildUnder(anchor,root)||anchor;

    var box=document.createElement("div");
    box.className="cl-contact-booking";
    box.innerHTML='<label><span>Fecha preferida</span><input class="cl-contact-date" type="date" aria-label="Fecha preferida"></label><label><span>Hora disponible</span><select class="cl-contact-time" aria-label="Hora disponible" disabled><option value="">Selecciona primero una fecha</option></select></label><p class="cl-contact-booking-note">Consultando disponibilidad…</p>';

    if(rootAnchor&&rootAnchor.parentElement===root)root.insertBefore(box,rootAnchor);else root.appendChild(box);

    var dateInput=box.querySelector(".cl-contact-date");
    var timeSelect=box.querySelector(".cl-contact-time");
    dateInput.addEventListener("change",function(){setTimes(root,dateInput.value);var note=root.querySelector(".cl-contact-booking-note");if(note){note.textContent=dateInput.value?"Selecciona una hora disponible. Hora de Colombia.":"Selecciona una fecha para ver las horas disponibles.";note.classList.remove("is-error");}});
    timeSelect.addEventListener("change",function(){state.slot=timeSelect.value||"";var note=root.querySelector(".cl-contact-booking-note");if(note&&state.slot){note.textContent="Horario seleccionado: "+longDate(state.slot)+" · hora de Colombia.";note.classList.remove("is-error");}});
    loadAvailability(root);
  }

  async function submitBooking(root,button){
    var note=root.querySelector(".cl-contact-booking-note");
    var data=collect(root);
    if(!data.name||!data.phone||!data.email){if(note){note.textContent="Completa nombre, WhatsApp y correo.";note.classList.add("is-error");}return;}
    if(!data.service){if(note){note.textContent="Selecciona el servicio que te interesa.";note.classList.add("is-error");}return;}
    if(!state.slot){if(note){note.textContent="Elige una fecha y una hora disponibles.";note.classList.add("is-error");}return;}
    var consent=Array.from(root.querySelectorAll('input[type="checkbox"]')).find(function(input){var label=input.closest("label")||input.parentElement;return label&&norm(label).toLowerCase().indexOf("autorizo")!==-1;});
    if(consent&&!consent.checked){if(note){note.textContent="Autoriza el uso de tus datos para gestionar la reserva.";note.classList.add("is-error");}return;}

    var fullPhone=(data.phone.indexOf("+")===0?data.phone:(data.code||"+57")+data.phone).replace(/\\s+/g,"");
    var old=button.textContent;button.disabled=true;button.textContent="Agendando…";
    try{
      var response=await fetch("/api/booking",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({full_name:data.name,brand_name:data.brand,country:"Colombia",country_code:data.code,whatsapp:fullPhone,email:data.email,solution_interest:data.service,starts_at:state.slot})});
      var result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.error||"No fue posible confirmar el diagnóstico.");
      root.innerHTML='<div style="grid-column:1/-1;padding:28px 22px;border:1px solid #dce5f3;border-radius:22px;background:#f8fbff"><h3 style="margin:0 0 8px;font:700 24px/1.1 Poppins,sans-serif;color:#0d172a">Diagnóstico agendado.</h3><p style="margin:0;color:#66758f;font:500 13px/1.55 Montserrat,sans-serif">Tu cita quedó confirmada para <strong>'+longDate(state.slot)+'</strong>, hora de Colombia. Ya quedó registrada en nuestro CRM.</p></div>';
    }catch(error){
      if(note){note.textContent=error&&error.message?error.message:"No pudimos guardar la cita. Intenta nuevamente.";note.classList.add("is-error");}
      button.disabled=false;button.textContent=old||"Agendar diagnóstico";
    }
  }

  function normalize(){
    var root=findContactRoot();
    if(root)installScheduler(root);
    Array.from(document.querySelectorAll("a,button")).forEach(function(el){
      var text=norm(el);
      if(CTA_TEXTS.indexOf(text)===-1)return;
      el.textContent="Agendar diagnóstico";el.classList.add("cl-booking-cta-label");
      if(root&&root.contains(el))return;
      el.removeAttribute("onclick");
      if(el.tagName==="A"){el.removeAttribute("target");el.setAttribute("href","#");}
    });
  }

  document.addEventListener("click",function(event){
    var action=event.target&&event.target.closest?event.target.closest("a,button"):null;
    if(!action||norm(action)!=="Agendar diagnóstico")return;
    var root=findContactRoot();
    if(root&&root.contains(action)){
      event.preventDefault();event.stopPropagation();if(event.stopImmediatePropagation)event.stopImmediatePropagation();
      installScheduler(root);submitBooking(root,action);return;
    }
    event.preventDefault();event.stopPropagation();if(event.stopImmediatePropagation)event.stopImmediatePropagation();
    if(root)scrollToContact(root);
  },true);

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){normalize();setTimeout(normalize,300);},{once:true});
  else normalize();
  window.addEventListener("load",normalize,{once:true});
})();
</script>
`
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
