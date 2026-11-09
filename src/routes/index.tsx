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
      "Déjanos tus datos, elige fecha y hora y agenda tu diagnóstico. También puedes usar cualquier botón de Agendar diagnóstico para abrir la agenda rápida."
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
  body.cl-booking-modal-open{overflow:hidden!important}
  .cl-booking-overlay{position:fixed;inset:0;width:100%;height:100dvh;max-height:100dvh;z-index:2147483000;display:none;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;pointer-events:auto;background:rgba(11,18,32,.64);padding:max(18px,env(safe-area-inset-top)) 16px max(28px,env(safe-area-inset-bottom))}
  .cl-booking-overlay.is-open{display:block}
  .cl-booking-panel{position:relative;width:min(920px,100%);margin:0 auto;background:#fff;border-radius:28px;box-shadow:0 28px 90px rgba(11,18,32,.28);overflow:visible}
  .cl-booking-modal-head{position:sticky;top:0;z-index:4;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 24px 18px;background:rgba(255,255,255,.96);backdrop-filter:blur(16px);border-bottom:1px solid #e8edf5;border-radius:28px 28px 0 0}
  .cl-booking-modal-head h2{margin:0;font:700 26px/1.1 "Poppins",sans-serif;color:#0d172a}
  .cl-booking-modal-head p{margin:7px 0 0;font:500 12px/1.5 "Montserrat",sans-serif;color:#6d7d98}
  .cl-booking-close{flex:0 0 auto;width:40px;height:40px;border:1px solid #dde5f0;border-radius:999px;background:#fff;color:#0d172a;font-size:24px;line-height:1;cursor:pointer}
  .cl-booking-modal-body{padding:22px 24px 26px}
  .cl-booking-modal-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:22px}
  .cl-booking-box{min-width:0;border:1px solid #e1e8f2;border-radius:20px;background:#fbfcff;padding:18px}
  .cl-booking-box h3{margin:0 0 6px;font:700 16px/1.25 "Poppins",sans-serif;color:#0d172a}
  .cl-booking-box>p{margin:0 0 15px;font:500 11px/1.5 "Montserrat",sans-serif;color:#71809b}
  .cl-booking-days{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px;touch-action:pan-x pan-y}
  .cl-booking-days::-webkit-scrollbar{display:none}
  .cl-booking-day{flex:0 0 auto;min-width:72px;padding:10px 9px;border:1px solid #dfe6f0;border-radius:13px;background:#fff;color:#26354e;font:700 11px/1.25 "Montserrat",sans-serif;cursor:pointer}
  .cl-booking-day small{display:block;margin-top:3px;font-weight:500;color:#8390a5}
  .cl-booking-day.is-active{border-color:#3f68ef;background:#eef3ff;color:#245fea;box-shadow:0 0 0 2px rgba(63,104,239,.08)}
  .cl-booking-times{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}
  .cl-booking-time{min-width:0;padding:11px 8px;border:1px solid #dfe6f0;border-radius:12px;background:#fff;color:#26354e;font:700 11px/1.2 "Montserrat",sans-serif;cursor:pointer}
  .cl-booking-time.is-active{border-color:#3f68ef;background:#eef3ff;color:#245fea}
  .cl-booking-summary{margin:12px 0 0!important;padding:10px 12px;border-radius:12px;background:#fff;border:1px solid #e2e8f2;font:600 11px/1.45 "Montserrat",sans-serif;color:#455572}
  .cl-booking-form{display:grid;grid-template-columns:1fr 1fr;gap:12px;min-width:0}
  .cl-booking-form label{display:grid;gap:6px;min-width:0}
  .cl-booking-form label.full{grid-column:1/-1}
  .cl-booking-form label>span{font:700 11px/1.25 "Montserrat",sans-serif;color:#17233a}
  .cl-booking-form input,.cl-booking-form select{width:100%;max-width:100%;min-width:0;height:46px;border:1px solid #dbe3ed;border-radius:13px;background:#fff;color:#17233a;padding:0 12px;font:500 13px/1 "Montserrat",sans-serif;outline:none;box-sizing:border-box}
  .cl-booking-form input:focus,.cl-booking-form select:focus{border-color:#456bf0;box-shadow:0 0 0 3px rgba(69,107,240,.1)}
  .cl-booking-phone{display:grid;grid-template-columns:110px minmax(0,1fr);gap:8px}
  .cl-booking-consent{grid-column:1/-1;display:flex!important;align-items:flex-start;gap:9px!important;font:500 11px/1.5 "Montserrat",sans-serif;color:#6d7d98}
  .cl-booking-consent input{width:18px!important;height:18px!important;flex:0 0 18px;margin-top:1px;padding:0}
  .cl-booking-submit{grid-column:1/-1;height:50px;border:0;border-radius:999px;background:linear-gradient(90deg,#1f6fe8,#6653e9);color:#fff;font:700 14px/1 "Montserrat",sans-serif;cursor:pointer;box-shadow:0 12px 26px rgba(49,91,220,.22)}
  .cl-booking-submit:disabled{opacity:.65;cursor:wait}
  .cl-booking-error{grid-column:1/-1;margin:0;min-height:16px;font:600 11px/1.4 "Montserrat",sans-serif;color:#b4233b}
  .cl-booking-loading{font:500 11px/1.45 "Montserrat",sans-serif;color:#71809b}
  .cl-booking-success{padding:34px 24px;text-align:center}
  .cl-booking-success h3{margin:0 0 10px;font:700 26px/1.15 "Poppins",sans-serif;color:#0d172a}
  .cl-booking-success p{margin:0 auto;max-width:560px;font:500 13px/1.6 "Montserrat",sans-serif;color:#66758f}
  .cl-contact-booking{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;width:100%;max-width:100%;min-width:0;margin:8px 0 10px;box-sizing:border-box}
  .cl-contact-booking,.cl-contact-booking *{box-sizing:border-box}
  .cl-contact-booking label{display:grid;grid-template-columns:minmax(0,1fr);gap:7px;min-width:0}
  .cl-contact-booking label>span{font:700 12px/1.25 "Montserrat",sans-serif;color:#111827}
  .cl-contact-booking input,.cl-contact-booking select{display:block;width:100%;max-width:100%;min-width:0;height:48px;border:1px solid #d9e0ea;border-radius:14px;background:#fff;color:#17233a;padding:0 13px;font:500 13px/1 "Montserrat",sans-serif;outline:none}
  .cl-contact-booking input:focus,.cl-contact-booking select:focus{border-color:#4d6ff0;box-shadow:0 0 0 3px rgba(77,111,240,.10)}
  .cl-contact-booking select:disabled{background:#f7f9fc;color:#8a96aa}
  .cl-contact-booking-note{grid-column:1/-1;margin:0;font:500 11px/1.45 "Montserrat",sans-serif;color:#71809b}
  .cl-contact-booking-note.is-error{color:#b4233b}
  @media(max-width:700px){
    a.cl-booking-cta-label,button.cl-booking-cta-label{max-width:100%;white-space:normal}
    .cl-contact-booking{grid-template-columns:minmax(0,1fr);gap:10px}
    .cl-contact-booking input,.cl-contact-booking select{height:46px;font-size:16px}
    .cl-contact-date{-webkit-appearance:none;appearance:none;text-align:center}
    .cl-contact-date::-webkit-date-and-time-value{text-align:center;min-width:0}
    #m-content .ag{max-width:100%!important;overflow:hidden}
    #m-content .ag-pick,#m-content .ag-form{min-width:0!important}
    .cl-booking-overlay{padding:max(10px,env(safe-area-inset-top)) 0 max(16px,env(safe-area-inset-bottom));background:rgba(11,18,32,.72)}
    .cl-booking-panel{width:100%;min-height:100dvh;margin:0;border-radius:0;box-shadow:none}
    .cl-booking-modal-head{top:0;padding:16px 16px 14px;border-radius:0}
    .cl-booking-modal-head h2{font-size:22px}
    .cl-booking-modal-body{padding:16px 16px 28px}
    .cl-booking-modal-grid{grid-template-columns:minmax(0,1fr);gap:14px}
    .cl-booking-box{padding:15px;border-radius:17px}
    .cl-booking-form{grid-template-columns:minmax(0,1fr);gap:11px}
    .cl-booking-form label,.cl-booking-form label.full,.cl-booking-consent,.cl-booking-submit,.cl-booking-error{grid-column:1/-1}
    .cl-booking-phone{grid-template-columns:98px minmax(0,1fr)}
    .cl-booking-times{grid-template-columns:repeat(2,minmax(0,1fr))}
    #modal,#m-overlay,.m-overlay,.modal-overlay,[role="dialog"].modal{
      height:100dvh!important;max-height:100dvh!important;overflow-x:hidden!important;overflow-y:auto!important;
      -webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;touch-action:pan-y!important;
      align-items:flex-start!important;padding-top:max(10px,env(safe-area-inset-top))!important;padding-bottom:max(24px,env(safe-area-inset-bottom))!important;
    }
    #m-box,.m-box,.modal-box,.modal-card{
      height:auto!important;max-height:none!important;overflow:visible!important;margin-top:0!important;margin-bottom:20px!important;
    }
    #m-content,.m-content{
      height:auto!important;max-height:none!important;overflow:visible!important;touch-action:pan-y!important;
    }
  }
</style>
<script id="cl-unified-booking-cta">
(function(){
  var CTA_TEXTS=["Continuar por WhatsApp","Hablar por WhatsApp","Agendar videollamada de diagnóstico","Solicitar videollamada","Solicitar videollamada de diagnóstico","Agendar diagnóstico"];
  var inline={root:null,slots:[],slot:"",loading:false};
  var modalState={slots:[],day:"",slot:"",loading:false};
  var availabilityCache={slots:[],fetchedAt:0,promise:null,error:null};
  var AVAILABILITY_CACHE_MS=180000;
  var AVAILABILITY_STORAGE_KEY="cl-booking-availability-v1";

  function norm(el){return (el&&el.textContent?el.textContent:"").replace(/\\s+/g," ").trim();}
  function isInsideModal(el){return !!(el&&el.closest&&el.closest("#modal,.modal,.m-overlay,#m-overlay,[role=dialog],#m-content,.ag,.ag-form"));}
  function dateKey(value){
    var parts=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"America/Bogota"}).formatToParts(new Date(value));
    var map={};parts.forEach(function(p){map[p.type]=p.value;});return map.year+"-"+map.month+"-"+map.day;
  }
  function longDate(value){return new Intl.DateTimeFormat("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(value));}
  function timeLabel(value){return new Intl.DateTimeFormat("es-CO",{hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(value));}

  function findContactRoot(){
    var heading=Array.from(document.querySelectorAll("h1,h2,h3")).find(function(el){
      var t=norm(el).toLowerCase();return t.indexOf("hablemos de")!==-1&&t.indexOf("negocio")!==-1;
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
    var cur=node;while(cur.parentElement&&cur.parentElement!==root)cur=cur.parentElement;
    return cur.parentElement===root?cur:null;
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

  function value(root,names,label){
    if(root.elements&&root.elements.namedItem){
      for(var i=0;i<names.length;i++){var el=root.elements.namedItem(names[i]);if(el&&String(el.value||"").trim())return String(el.value).trim();}
    }
    var field=fieldByLabel(root,label);return field?String(field.value||"").trim():"";
  }

  function serviceFromRoot(root){
    var phrases=["sistemas con ia","agentes de ia","marketing digital","quiero un diagnóstico","quiero un diagnostico"];
    var checked=Array.from(root.querySelectorAll('input[type="radio"]:checked,input[type="checkbox"]:checked'));
    for(var i=0;i<checked.length;i++){
      var lab=checked[i].closest("label");
      if(lab&&phrases.some(function(p){return norm(lab).toLowerCase().indexOf(p)!==-1;}))return norm(lab);
    }
    var active=Array.from(root.querySelectorAll("label,button,[role=button]")).find(function(el){
      var t=norm(el).toLowerCase();
      if(!phrases.some(function(p){return t.indexOf(p)!==-1;}))return false;
      var cls=(el.className||"").toString();
      return /active|selected|checked|(^|\\s)(sel|on|s)(\\s|$)/i.test(cls)||el.getAttribute("aria-checked")==="true"||el.getAttribute("aria-pressed")==="true";
    });
    return active?norm(active):"";
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

  function hydrateAvailabilityCache(){
    try{
      var raw=sessionStorage.getItem(AVAILABILITY_STORAGE_KEY);
      if(!raw)return;
      var saved=JSON.parse(raw);
      if(!saved||!Array.isArray(saved.slots)||!saved.fetchedAt)return;
      if(Date.now()-saved.fetchedAt>=AVAILABILITY_CACHE_MS)return;
      availabilityCache.slots=saved.slots;
      availabilityCache.fetchedAt=saved.fetchedAt;
    }catch(error){}
  }

  function persistAvailabilityCache(){
    try{
      sessionStorage.setItem(AVAILABILITY_STORAGE_KEY,JSON.stringify({
        slots:availabilityCache.slots,
        fetchedAt:availabilityCache.fetchedAt
      }));
    }catch(error){}
  }

  function fetchSharedAvailability(force){
    var fresh=availabilityCache.slots.length&&Date.now()-availabilityCache.fetchedAt<AVAILABILITY_CACHE_MS;
    if(!force&&fresh)return Promise.resolve(availabilityCache.slots);
    if(availabilityCache.promise)return availabilityCache.promise;
    availabilityCache.promise=fetch("/api/booking?start="+encodeURIComponent(dateKey(new Date()))+"&days=60",{headers:{"Accept":"application/json"}})
      .then(function(response){
        return response.json().then(function(data){
          if(!response.ok||!data.ok)throw new Error(data.error||"No fue posible cargar la disponibilidad.");
          availabilityCache.slots=Array.isArray(data.slots)?data.slots:[];
          availabilityCache.fetchedAt=Date.now();
          availabilityCache.error=null;
          persistAvailabilityCache();
          return availabilityCache.slots;
        });
      })
      .catch(function(error){
        availabilityCache.error=error;
        throw error;
      })
      .finally(function(){availabilityCache.promise=null;});
    return availabilityCache.promise;
  }

  function prewarmAvailability(){
    fetchSharedAvailability(false).catch(function(){});
  }

  function setTimes(root,date){
    var select=root.querySelector(".cl-contact-time");if(!select)return;
    inline.slot="";
    var rows=inline.slots.filter(function(slot){return dateKey(slot.slot_start)===date;});
    select.innerHTML='<option value="">'+(rows.length?"Selecciona una hora":"Sin horarios disponibles")+'</option>'+rows.map(function(slot){return '<option value="'+slot.slot_start+'">'+timeLabel(slot.slot_start)+'</option>';}).join("");
    select.disabled=!rows.length;
  }

  async function loadInlineAvailability(root){
    if(inline.loading)return;inline.loading=true;
    var note=root.querySelector(".cl-contact-booking-note");
    var dateInput=root.querySelector(".cl-contact-date");
    var timeSelect=root.querySelector(".cl-contact-time");
    try{
      var slots=await fetchSharedAvailability(false);
      inline.slots=slots.slice();
      if(dateInput&&inline.slots.length){
        var dates=inline.slots.map(function(slot){return dateKey(slot.slot_start);}).sort();
        dateInput.min=dates[0];dateInput.max=dates[dates.length-1];
      }
      if(timeSelect){timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Selecciona primero una fecha</option>';}
      if(note)note.textContent="Selecciona una fecha para ver las horas disponibles.";
    }catch(error){
      inline.slots=[];
      if(timeSelect){timeSelect.disabled=true;timeSelect.innerHTML='<option value="">Sin disponibilidad</option>';}
      if(note){note.textContent="No pudimos cargar la disponibilidad. Recarga la página para intentarlo de nuevo.";note.classList.add("is-error");}
    }
    inline.loading=false;
  }

  function installInlineScheduler(root){
    if(!root||root.dataset.clScheduler==="1")return;
    root.dataset.clScheduler="1";inline.root=root;
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
    dateInput.addEventListener("change",function(){
      setTimes(root,dateInput.value);
      var note=root.querySelector(".cl-contact-booking-note");
      if(note){note.textContent=dateInput.value?"Selecciona una hora disponible. Hora de Colombia.":"Selecciona una fecha para ver las horas disponibles.";note.classList.remove("is-error");}
    });
    timeSelect.addEventListener("change",function(){
      inline.slot=timeSelect.value||"";
      var note=root.querySelector(".cl-contact-booking-note");
      if(note&&inline.slot){note.textContent="Horario seleccionado: "+longDate(inline.slot)+" · hora de Colombia.";note.classList.remove("is-error");}
    });
    loadInlineAvailability(root);
  }

  async function submitInline(root,button){
    var note=root.querySelector(".cl-contact-booking-note");
    var data=collect(root);
    if(!data.name||!data.phone||!data.email){if(note){note.textContent="Completa nombre, WhatsApp y correo.";note.classList.add("is-error");}return;}
    if(!data.service){if(note){note.textContent="Selecciona el servicio que te interesa.";note.classList.add("is-error");}return;}
    if(!inline.slot){if(note){note.textContent="Elige una fecha y una hora disponibles.";note.classList.add("is-error");}return;}
    var consent=Array.from(root.querySelectorAll('input[type="checkbox"]')).find(function(input){
      var label=input.closest("label")||input.parentElement;return label&&norm(label).toLowerCase().indexOf("autorizo")!==-1;
    });
    if(consent&&!consent.checked){if(note){note.textContent="Autoriza el uso de tus datos para gestionar la reserva.";note.classList.add("is-error");}return;}

    var fullPhone=(data.phone.indexOf("+")===0?data.phone:(data.code||"+57")+data.phone).replace(/\\s+/g,"");
    var old=button.textContent;button.disabled=true;button.textContent="Agendando…";
    try{
      var response=await fetch("/api/booking",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({
        full_name:data.name,brand_name:data.brand,country:"Colombia",country_code:data.code,whatsapp:fullPhone,email:data.email,solution_interest:data.service,starts_at:inline.slot
      })});
      var result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.error||"No fue posible confirmar el diagnóstico.");
      root.innerHTML='<div style="grid-column:1/-1;padding:28px 22px;border:1px solid #dce5f3;border-radius:22px;background:#f8fbff"><h3 style="margin:0 0 8px;font:700 24px/1.1 Poppins,sans-serif;color:#0d172a">Diagnóstico agendado.</h3><p style="margin:0;color:#66758f;font:500 13px/1.55 Montserrat,sans-serif">Tu cita quedó confirmada para <strong>'+longDate(inline.slot)+'</strong>, hora de Colombia. Ya quedó registrada en nuestro CRM.</p></div>';
    }catch(error){
      if(note){note.textContent=error&&error.message?error.message:"No pudimos guardar la cita. Intenta nuevamente.";note.classList.add("is-error");}
      button.disabled=false;button.textContent=old||"Agendar diagnóstico";
      if(String(error&&error.message||"").toLowerCase().indexOf("horario")!==-1)loadInlineAvailability(root);
    }
  }

  function modalDateLabel(value){
    return new Intl.DateTimeFormat("es-CO",{weekday:"short",day:"numeric",month:"short",timeZone:"America/Bogota"}).format(new Date(value)).replace(".","");
  }

  function ensureBookingModal(){
    var existing=document.getElementById("cl-booking-overlay");
    if(existing)return existing;
    var overlay=document.createElement("div");
    overlay.id="cl-booking-overlay";
    overlay.className="cl-booking-overlay";
    overlay.setAttribute("role","dialog");
    overlay.setAttribute("aria-modal","true");
    overlay.setAttribute("aria-labelledby","cl-booking-title");
    overlay.innerHTML='<div class="cl-booking-panel"><div class="cl-booking-modal-head"><div><h2 id="cl-booking-title">Agenda tu diagnóstico</h2><p>Elige un horario y completa tus datos. La cita queda registrada en nuestro CRM.</p></div><button type="button" class="cl-booking-close" aria-label="Cerrar">×</button></div><div class="cl-booking-modal-body"><div class="cl-booking-modal-grid"><section class="cl-booking-box"><h3>1. Elige fecha y hora</h3><p>Todos los horarios se muestran en hora de Colombia.</p><div class="cl-booking-days"><span class="cl-booking-loading">Elige tu horario</span></div><div class="cl-booking-times"></div><p class="cl-booking-summary">Selecciona un día y una hora.</p></section><section class="cl-booking-box"><h3>2. Tus datos</h3><p>Los usamos únicamente para gestionar tu diagnóstico.</p><form class="cl-booking-form" novalidate><label><span>Nombre y apellido</span><input name="full_name" autocomplete="name" required></label><label><span>Marca personal o empresa</span><input name="brand_name" autocomplete="organization"></label><label class="full"><span>WhatsApp</span><span class="cl-booking-phone"><select name="country_code" aria-label="Indicativo"><option value="+57">🇨🇴 +57</option></select><input name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" required></span></label><label class="full"><span>Correo</span><input name="email" type="email" inputmode="email" autocomplete="email" required></label><label class="full"><span>¿Qué servicio te interesa?</span><select name="solution_interest" required><option value="">Selecciona una opción</option><option>Creamos sistemas con IA a la medida</option><option>Agentes de IA automatizados</option><option>Atraemos clientes con marketing digital</option><option>Aún no lo sé, quiero un diagnóstico</option></select></label><label class="cl-booking-consent"><input name="consent" type="checkbox" required><span>Autorizo el uso de mis datos para gestionar esta solicitud y contactarme sobre el diagnóstico.</span></label><p class="cl-booking-error" role="alert"></p><button class="cl-booking-submit" type="submit">Agendar diagnóstico</button></form></section></div></div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector(".cl-booking-close").addEventListener("click",closeBookingModal);
    overlay.addEventListener("click",function(event){if(event.target===overlay)closeBookingModal();});
    overlay.querySelector(".cl-booking-form").addEventListener("submit",submitModalBooking);
    return overlay;
  }

  function closeBookingModal(){
    var overlay=document.getElementById("cl-booking-overlay");
    if(!overlay)return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("cl-booking-modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow-y");
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow-y");
  }

  function renderModalTimes(){
    var overlay=ensureBookingModal();
    var host=overlay.querySelector(".cl-booking-times");
    var rows=modalState.slots.filter(function(slot){return dateKey(slot.slot_start)===modalState.day;});
    modalState.slot="";
    host.innerHTML=rows.length?rows.map(function(slot){return '<button type="button" class="cl-booking-time" data-slot="'+slot.slot_start+'">'+timeLabel(slot.slot_start)+'</button>';}).join(""):'<span class="cl-booking-loading">No hay horarios disponibles para este día.</span>';
    host.querySelectorAll(".cl-booking-time").forEach(function(button){
      button.addEventListener("click",function(){
        modalState.slot=button.getAttribute("data-slot")||"";
        host.querySelectorAll(".cl-booking-time").forEach(function(x){x.classList.toggle("is-active",x===button);});
        overlay.querySelector(".cl-booking-summary").textContent=modalState.slot?"Horario seleccionado: "+longDate(modalState.slot)+" · hora de Colombia.":"Selecciona un día y una hora.";
        overlay.querySelector(".cl-booking-error").textContent="";
      });
    });
  }

  function renderModalDays(){
    var overlay=ensureBookingModal();
    var host=overlay.querySelector(".cl-booking-days");
    var keys=Array.from(new Set(modalState.slots.map(function(slot){return dateKey(slot.slot_start);}))).sort();
    if(!keys.length){host.innerHTML='<span class="cl-booking-loading">No hay horarios disponibles en los próximos días.</span>';overlay.querySelector(".cl-booking-times").innerHTML="";return;}
    host.innerHTML=keys.map(function(key){
      var first=modalState.slots.find(function(slot){return dateKey(slot.slot_start)===key;});
      return '<button type="button" class="cl-booking-day" data-day="'+key+'">'+modalDateLabel(first.slot_start)+'</button>';
    }).join("");
    host.querySelectorAll(".cl-booking-day").forEach(function(button){
      button.addEventListener("click",function(){
        modalState.day=button.getAttribute("data-day")||"";modalState.slot="";
        host.querySelectorAll(".cl-booking-day").forEach(function(x){x.classList.toggle("is-active",x===button);});
        renderModalTimes();
      });
    });
    if(!modalState.day){
      var first=host.querySelector(".cl-booking-day");
      if(first){modalState.day=first.getAttribute("data-day")||"";first.classList.add("is-active");renderModalTimes();}
    }
  }

  function applyModalAvailability(slots){
    modalState.slots=Array.isArray(slots)?slots.slice():[];
    modalState.day="";
    modalState.slot="";
    renderModalDays();
  }

  async function loadModalAvailability(force){
    if(modalState.loading)return;
    modalState.loading=true;
    try{
      var slots=await fetchSharedAvailability(!!force);
      applyModalAvailability(slots);
    }catch(error){
      var overlay=ensureBookingModal();
      if(!modalState.slots.length){
        overlay.querySelector(".cl-booking-days").innerHTML='<span class="cl-booking-loading">No pudimos consultar la disponibilidad. Cierra e intenta nuevamente.</span>';
        overlay.querySelector(".cl-booking-times").innerHTML="";
      }
    }
    modalState.loading=false;
  }

  function clearLegacyBookingShell(){
    Array.from(document.querySelectorAll("#modal,#m-overlay,.m-overlay,.modal-overlay,.modal")).forEach(function(node){
      if(node.id==="cl-booking-overlay"||node.closest&&node.closest("#cl-booking-overlay"))return;
      node.setAttribute("aria-hidden","true");
      node.style.setProperty("display","none","important");
      node.style.setProperty("pointer-events","none","important");
    });
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow-y");
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow-y");
  }

  function openBookingModal(){
    clearLegacyBookingShell();
    var overlay=ensureBookingModal();
    if(availabilityCache.slots.length){
      applyModalAvailability(availabilityCache.slots);
    }
    overlay.classList.add("is-open");
    document.body.classList.add("cl-booking-modal-open");
    overlay.scrollTop=0;
    var root=findContactRoot();
    if(root){
      var data=collect(root);
      var form=overlay.querySelector(".cl-booking-form");
      if(data.name)form.elements.full_name.value=data.name;
      if(data.brand)form.elements.brand_name.value=data.brand;
      if(data.phone)form.elements.whatsapp.value=data.phone.replace(/^\+?57/,"");
      if(data.email)form.elements.email.value=data.email;
    }
    var stale=!availabilityCache.fetchedAt||Date.now()-availabilityCache.fetchedAt>=AVAILABILITY_CACHE_MS;
    if(!availabilityCache.slots.length){
      loadModalAvailability(false);
    }else if(stale){
      fetchSharedAvailability(true).then(function(slots){
        if(overlay.classList.contains("is-open")&&!modalState.slot)applyModalAvailability(slots);
      }).catch(function(){});
    }
    requestAnimationFrame(function(){overlay.scrollTop=0;});
  }

  window.__clOpenBookingModal=openBookingModal;

  async function submitModalBooking(event){
    event.preventDefault();
    var form=event.currentTarget;
    var overlay=ensureBookingModal();
    var error=overlay.querySelector(".cl-booking-error");
    error.textContent="";
    if(!modalState.slot){error.textContent="Elige primero un día y una hora disponibles.";return;}
    if(!form.reportValidity())return;
    var button=form.querySelector(".cl-booking-submit");
    button.disabled=true;button.textContent="Agendando…";
    var code=form.elements.country_code.value||"+57";
    var phone=String(form.elements.whatsapp.value||"").trim();
    var fullPhone=(phone.indexOf("+")===0?phone:code+phone).replace(/\s+/g,"");
    try{
      var response=await fetch("/api/booking",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({
        full_name:String(form.elements.full_name.value||"").trim(),
        brand_name:String(form.elements.brand_name.value||"").trim(),
        country:"Colombia",country_code:code,whatsapp:fullPhone,
        email:String(form.elements.email.value||"").trim(),
        solution_interest:String(form.elements.solution_interest.value||"").trim(),
        starts_at:modalState.slot
      })});
      var data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.error||"No fue posible confirmar el diagnóstico.");
      overlay.querySelector(".cl-booking-modal-body").innerHTML='<div class="cl-booking-success"><h3>Diagnóstico agendado.</h3><p>Tu cita quedó confirmada para <strong>'+longDate(modalState.slot)+'</strong>, hora de Colombia. Ya quedó registrada en nuestro CRM.</p></div>';
      overlay.scrollTop=0;
    }catch(err){
      error.textContent=err&&err.message?err.message:"No pudimos guardar la cita. Intenta nuevamente.";
      button.disabled=false;button.textContent="Agendar diagnóstico";
      if(String(err&&err.message||"").toLowerCase().indexOf("horario")!==-1)loadModalAvailability();
    }
  }

  function routeLegacyBookingToSafeModal(){
    if(typeof window.openModal!=="function")return;
    if(window.openModal.__clSafeBookingRouter)return;
    var legacy=window.openModal;
    var routed=function(mode,preset){
      if(mode==="booking"){
        openBookingModal();
        return;
      }
      return legacy.apply(this,arguments);
    };
    routed.__clSafeBookingRouter=true;
    routed.__clLegacy=legacy;
    window.openModal=routed;
  }

  function normalize(){
    routeLegacyBookingToSafeModal();
    prewarmAvailability();
    var root=findContactRoot();
    if(root)installInlineScheduler(root);
    Array.from(document.querySelectorAll("a,button")).forEach(function(el){
      var text=norm(el);
      if(CTA_TEXTS.indexOf(text)===-1)return;
      if(isInsideModal(el))return;
      el.textContent="Agendar diagnóstico";el.classList.add("cl-booking-cta-label");
    });
  }

  document.addEventListener("click",function(event){
    var action=event.target&&event.target.closest?event.target.closest("a,button"):null;
    if(!action||isInsideModal(action)||norm(action)!=="Agendar diagnóstico")return;

    var root=findContactRoot();
    if(root&&root.contains(action)){
      event.preventDefault();event.stopPropagation();if(event.stopImmediatePropagation)event.stopImmediatePropagation();
      installInlineScheduler(root);submitInline(root,action);return;
    }

    event.preventDefault();event.stopPropagation();if(event.stopImmediatePropagation)event.stopImmediatePropagation();
    openBookingModal();
  },true);

  hydrateAvailabilityCache();
  prewarmAvailability();

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",function(){normalize();setTimeout(normalize,250);setTimeout(normalize,900);},{once:true});
  }else normalize();
  window.addEventListener("load",function(){normalize();setTimeout(normalize,120);},{once:true});
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
