// preview-rebuild-v10
import { createFileRoute } from "@tanstack/react-router";
import { gunzipSync } from "node:zlib";

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
      scroll-snap-align: start !important;
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

const PREMIUM_COMPARE_DEMOS_CSS = \`
<style id="premium-compare-demos-v10">
  .cl-premium-demo{
    position:absolute;
    left:16px; right:16px; top:62px; bottom:72px;
    z-index:8;
    border-radius:18px;
    overflow:hidden;
    background:#fff;
    border:1px solid rgba(65,96,255,.18);
    box-shadow:0 18px 45px rgba(35,66,154,.12);
    font-family:"Poppins",sans-serif;
    animation:clDemoIn .38s cubic-bezier(.2,.8,.2,1);
  }
  .cl-premium-demo *{box-sizing:border-box}
  .cl-premium-demo .cl-browser{
    height:28px;display:flex;align-items:center;gap:6px;padding:0 10px;
    background:#f4f7ff;border-bottom:1px solid #e4e9f5;color:#8190aa;font:600 9px/1 "Montserrat",sans-serif
  }
  .cl-premium-demo .cl-browser i{width:7px;height:7px;border-radius:50%;background:#cfd7e7}
  .cl-premium-demo .cl-url{margin-left:5px;background:#fff;border:1px solid #e4e9f5;border-radius:999px;padding:4px 9px;min-width:140px}
  .cl-premium-demo .cl-site{height:calc(100% - 28px);overflow:hidden;background:#fff;position:relative}
  .cl-premium-demo .cl-site-nav{height:38px;display:flex;align-items:center;gap:12px;padding:0 14px;border-bottom:1px solid rgba(18,37,75,.08);background:rgba(255,255,255,.94)}
  .cl-premium-demo .cl-logo{display:flex;align-items:center;gap:6px;font-weight:800;color:#0d1830;font-size:10px}
  .cl-premium-demo .cl-logo-mark{width:18px;height:18px;border-radius:6px;background:linear-gradient(135deg,#1677ff,#7656f6);box-shadow:0 5px 12px rgba(50,84,220,.25)}
  .cl-premium-demo .cl-navlinks{margin-left:auto;display:flex;gap:10px;font:600 7px "Montserrat",sans-serif;color:#516079}
  .cl-premium-demo .cl-mini-btn{padding:7px 10px;border-radius:999px;background:linear-gradient(90deg,#1677ff,#7354f6);color:#fff;font:800 7px "Montserrat",sans-serif;box-shadow:0 7px 15px rgba(72,79,230,.22)}
  .cl-web-hero{height:142px;position:relative;display:grid;grid-template-columns:1.05fr .95fr;overflow:hidden;background:
    radial-gradient(circle at 78% 20%,rgba(107,95,255,.7),transparent 34%),
    linear-gradient(135deg,#0e2d78 0%,#1e5be6 55%,#6e55ef 100%);color:#fff}
  .cl-web-hero:before{content:"";position:absolute;inset:-40% -10% auto auto;width:240px;height:240px;border:1px solid rgba(255,255,255,.22);border-radius:50%;animation:clOrbit 9s linear infinite}
  .cl-web-copy{padding:18px 8px 12px 18px;position:relative;z-index:2}
  .cl-eyebrow{display:inline-flex;padding:5px 7px;border-radius:999px;background:rgba(255,255,255,.14);font:700 6px "Montserrat",sans-serif}
  .cl-web-copy h4{margin:9px 0 5px;font-size:21px;line-height:.98;letter-spacing:-.04em}
  .cl-web-copy p{margin:0;max-width:170px;font:500 7px/1.45 "Montserrat",sans-serif;color:rgba(255,255,255,.8)}
  .cl-web-actions{display:flex;gap:6px;margin-top:10px}
  .cl-web-actions span{padding:6px 8px;border-radius:999px;font:800 6px "Montserrat",sans-serif;background:#fff;color:#1c42b5}
  .cl-web-actions span+span{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.5)}
  .cl-web-photo{position:relative;overflow:hidden}
  .cl-web-photo:before{content:"";position:absolute;inset:0;background:
      radial-gradient(circle at 55% 35%,#f1c4a5 0 12%,transparent 12.5%),
      radial-gradient(circle at 55% 30%,#38291f 0 22%,transparent 22.5%),
      linear-gradient(160deg,transparent 0 42%,rgba(255,255,255,.13) 42.5% 100%);
    transform:scale(1.18);filter:saturate(.9)}
  .cl-face{position:absolute;right:18%;top:22%;width:54px;height:54px;border-radius:50%;background:
    radial-gradient(circle at 58% 58%,#fff 0 10%,transparent 11%),
    radial-gradient(circle at 43% 42%,#3d2a22 0 4%,transparent 5%),
    radial-gradient(circle at 65% 42%,#3d2a22 0 4%,transparent 5%),
    linear-gradient(150deg,#f3c7aa,#d99e7f);box-shadow:0 14px 32px rgba(4,16,63,.24)}
  .cl-face:after{content:"";position:absolute;left:-10px;right:-10px;bottom:-32px;height:42px;border-radius:28px 28px 0 0;background:#f7fafc}
  .cl-float-chip{position:absolute;right:8px;bottom:13px;padding:7px 9px;border-radius:11px;background:rgba(255,255,255,.94);color:#25314d;font:700 6px/1.3 "Montserrat",sans-serif;box-shadow:0 10px 24px rgba(5,26,81,.24);animation:clFloat 3.2s ease-in-out infinite}
  .cl-features{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px 10px;background:#fff}
  .cl-feature{padding:7px 5px;border:1px solid #e8edf7;border-radius:9px;background:linear-gradient(#fff,#f8faff);text-align:center;font:700 6px/1.25 "Montserrat",sans-serif;color:#23304a}
  .cl-feature b{display:block;color:#4356e8;margin-bottom:2px}
  .cl-section-title{display:flex;justify-content:space-between;align-items:end;padding:3px 11px 6px;font-size:9px;font-weight:800;color:#0d1830}
  .cl-section-title span{font:700 6px "Montserrat",sans-serif;color:#5268ee}
  .cl-treatment-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:0 10px}
  .cl-treatment{height:54px;border-radius:9px;background:linear-gradient(145deg,#eef4ff,#fff);border:1px solid #dfe7f7;box-shadow:0 6px 14px rgba(38,65,130,.08);padding:7px;font:700 6px/1.2 "Montserrat",sans-serif;color:#15213b;animation:clCardPulse 5s ease-in-out infinite}
  .cl-treatment:nth-child(2){animation-delay:.4s}.cl-treatment:nth-child(3){animation-delay:.8s}.cl-treatment:nth-child(4){animation-delay:1.2s}
  .cl-treatment i{display:block;width:20px;height:20px;border-radius:8px;background:linear-gradient(135deg,#b9d5ff,#7d69f7);margin-bottom:5px;opacity:.8}
  .cl-reviews{display:grid;grid-template-columns:.72fr 1.28fr;gap:7px;padding:8px 10px}
  .cl-rating,.cl-review-card{border-radius:10px;background:#f8faff;border:1px solid #e4eaf7;padding:7px;font:600 6px/1.35 "Montserrat",sans-serif;color:#4b5b75}
  .cl-rating b{font:800 13px "Poppins",sans-serif;color:#0d1830}.cl-stars{color:#ff9b16}
  .cl-review-card b{display:block;color:#0d1830;margin-bottom:2px}
  .cl-bottom-cta{margin:0 10px 8px;padding:8px 10px;border-radius:10px;background:linear-gradient(90deg,#156cf1,#7456f6);color:#fff;display:flex;align-items:center;justify-content:space-between;font:800 7px "Montserrat",sans-serif;box-shadow:0 8px 18px rgba(72,82,235,.22)}
  .cl-bottom-cta span{padding:5px 8px;border-radius:999px;background:#fff;color:#3553d7}

  .cl-agenda-hero{height:104px;display:grid;grid-template-columns:1.1fr .9fr;position:relative;overflow:hidden;background:
    radial-gradient(circle at 78% 25%,rgba(136,82,255,.72),transparent 30%),
    linear-gradient(135deg,#102863,#204cca 56%,#6d4be6);color:#fff}
  .cl-agenda-copy{padding:17px 16px}.cl-agenda-copy h4{font-size:18px;line-height:1;margin:0 0 5px;letter-spacing:-.04em}.cl-agenda-copy p{margin:0;font:500 7px "Montserrat",sans-serif;color:rgba(255,255,255,.78)}
  .cl-calendar-3d{position:relative;margin:auto;width:72px;height:58px;border-radius:14px;background:linear-gradient(145deg,#eef2ff,#b9aefb);box-shadow:0 18px 28px rgba(13,23,82,.28);transform:rotate(6deg);animation:clFloat 3s ease-in-out infinite}
  .cl-calendar-3d:before{content:"";position:absolute;left:11px;right:11px;top:14px;height:6px;border-radius:4px;background:#6b58ef;box-shadow:0 11px 0 #fff,0 22px 0 #fff}
  .cl-calendar-3d:after{content:"✓";position:absolute;right:-8px;bottom:-7px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#1cc99a;color:#fff;font-weight:900;box-shadow:0 8px 18px rgba(28,201,154,.35)}
  .cl-booking{margin:-14px 10px 0;position:relative;z-index:2;border-radius:14px;background:#fff;border:1px solid #e3e8f5;box-shadow:0 14px 30px rgba(25,50,120,.14);padding:10px}
  .cl-booking-stepper{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:8px;font:700 6px "Montserrat",sans-serif;color:#8a96aa}
  .cl-booking-stepper span{padding:5px 6px;border-radius:999px;background:#f2f5fb;text-align:center}.cl-booking-stepper span:first-child{background:#eeeaff;color:#5d45dc}
  .cl-booking-title{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:#0d1830;margin-bottom:2px}.cl-booking-sub{font:500 6px "Montserrat",sans-serif;color:#7b879d;margin-bottom:7px}
  .cl-booking-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:8px}
  .cl-label{font:800 6px "Montserrat",sans-serif;color:#21304f;margin-bottom:4px}
  .cl-days{display:grid;grid-template-columns:repeat(5,1fr);gap:3px}.cl-days span,.cl-times span{padding:5px 3px;border-radius:7px;background:#f4f7fc;text-align:center;font:700 6px "Montserrat",sans-serif;color:#63718a}
  .cl-days span:nth-child(4),.cl-times span:nth-child(2){background:linear-gradient(90deg,#196cf0,#6e54ee);color:#fff;box-shadow:0 6px 12px rgba(75,76,230,.2)}
  .cl-times{display:grid;grid-template-columns:1fr;gap:4px}
  .cl-fields{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px}.cl-field{border:1px solid #dfe6f4;border-radius:7px;padding:6px 7px;font:600 6px "Montserrat",sans-serif;color:#26334c;background:#fff}
  .cl-confirm{margin-top:7px;border-radius:9px;padding:8px;background:linear-gradient(90deg,#176df1,#7554ef);color:#fff;text-align:center;font:800 7px "Montserrat",sans-serif;position:relative;overflow:hidden}
  .cl-confirm:after{content:"";position:absolute;top:0;bottom:0;width:34%;left:-45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg);animation:clShine 2.5s linear infinite}
  .cl-success{display:flex;align-items:center;gap:7px;margin-top:7px;padding:7px 8px;border-radius:9px;background:#eafaf3;color:#164f3b;font:700 6px/1.2 "Montserrat",sans-serif;border:1px solid #c7efdf}
  .cl-success i{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#25be88;color:#fff;font-style:normal;font-weight:900}
  @keyframes clDemoIn{from{opacity:0;transform:translateY(8px) scale(.985)}to{opacity:1;transform:none}}
  @keyframes clFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @keyframes clOrbit{to{transform:rotate(360deg)}}
  @keyframes clCardPulse{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
  @keyframes clShine{to{left:130%}}
  @media(max-width:700px){
    .cl-premium-demo{left:8px;right:8px;top:58px;bottom:66px;border-radius:14px}
    .cl-premium-demo .cl-navlinks{display:none}
    .cl-web-hero{height:128px}
    .cl-web-copy h4{font-size:18px}
    .cl-treatment-grid{grid-template-columns:repeat(2,1fr)}
    .cl-treatment:nth-child(n+3){display:none}
    .cl-reviews{grid-template-columns:1fr}
    .cl-review-card{display:none}
    .cl-agenda-hero{height:94px}
    .cl-booking{margin-top:-10px}
  }
</style>
\`;

const PREMIUM_COMPARE_DEMOS_SCRIPT = \`
<script id="premium-compare-demos-runtime-v10">
(function(){
  function leaf(text){
    return Array.from(document.querySelectorAll("body *")).find(function(el){
      return el.children.length===0 && el.textContent && el.textContent.trim()===text;
    });
  }
  function clickable(el){
    if(!el) return null;
    return el.closest("button,a,[role=button]") || el.parentElement;
  }
  function rightPanel(){
    var label=leaf("Con Cómplice");
    if(!label) return null;
    var n=label;
    while(n && n!==document.body){
      var r=n.getBoundingClientRect();
      var txt=(n.textContent||"");
      if(r.width>320 && r.height>300 && txt.indexOf("Sin Cómplice")===-1) return n;
      n=n.parentElement;
    }
    return null;
  }
  function webDemo(){
    return '<div class="cl-premium-demo" data-cl-demo="web">'+
      '<div class="cl-browser"><i></i><i></i><i></i><span class="cl-url">tunegocio.com</span></div>'+
      '<div class="cl-site">'+
        '<div class="cl-site-nav"><div class="cl-logo"><span class="cl-logo-mark"></span>Cómplice Dental</div><div class="cl-navlinks"><span>Tratamientos</span><span>Nosotros</span><span>Opiniones</span><span>Contacto</span></div><span class="cl-mini-btn">Agendar cita</span></div>'+
        '<div class="cl-web-hero"><div class="cl-web-copy"><span class="cl-eyebrow">✦ Clínica dental de confianza</span><h4>Tu sonrisa,<br>nuestro cómplice</h4><p>Odontología moderna, cercana y con resultados que se notan.</p><div class="cl-web-actions"><span>Agendar cita →</span><span>Conocer tratamientos</span></div></div><div class="cl-web-photo"><div class="cl-face"></div><div class="cl-float-chip">🦷 Sonrisas reales<br>+5.000 pacientes</div></div></div>'+
        '<div class="cl-features"><div class="cl-feature"><b>◫</b>Citas en línea</div><div class="cl-feature"><b>◇</b>Tecnología 3D</div><div class="cl-feature"><b>◎</b>Equipo experto</div><div class="cl-feature"><b>◆</b>Experiencia premium</div></div>'+
        '<div class="cl-section-title">Tratamientos para ti <span>Ver todos →</span></div>'+
        '<div class="cl-treatment-grid"><div class="cl-treatment"><i></i>Blanqueamiento</div><div class="cl-treatment"><i></i>Ortodoncia</div><div class="cl-treatment"><i></i>Implantes</div><div class="cl-treatment"><i></i>Estética dental</div></div>'+
        '<div class="cl-reviews"><div class="cl-rating"><b>4,9</b> <span class="cl-stars">★★★★★</span><br>120 reseñas verificadas</div><div class="cl-review-card"><b>Lo que dicen nuestros pacientes</b>“La atención fue increíble y el resultado superó mis expectativas.”</div></div>'+
        '<div class="cl-bottom-cta">¿Listo para tu nueva sonrisa?<span>Agendar ahora →</span></div>'+
      '</div></div>';
  }
  function agendaDemo(){
    return '<div class="cl-premium-demo" data-cl-demo="agenda">'+
      '<div class="cl-browser"><i></i><i></i><i></i><span class="cl-url">tunegocio.com/agendar</span></div>'+
      '<div class="cl-site">'+
        '<div class="cl-site-nav"><div class="cl-logo"><span class="cl-logo-mark"></span>Tu Negocio</div><div class="cl-navlinks"><span>Servicios</span><span>Equipo</span><span>Contacto</span></div><span class="cl-mini-btn">Agendar cita</span></div>'+
        '<div class="cl-agenda-hero"><div class="cl-agenda-copy"><h4>Especialistas en<br>tu cuidado</h4><p>Agenda tu cita online en 1 minuto</p></div><div class="cl-calendar-3d"></div></div>'+
        '<div class="cl-booking"><div class="cl-booking-stepper"><span>1 Servicio</span><span>2 Fecha y hora</span><span>3 Confirmación</span></div><div class="cl-booking-title">▣ Agenda tu cita</div><div class="cl-booking-sub">Elige el día y la hora que más te acomode.</div>'+
        '<div class="cl-booking-grid"><div><div class="cl-label">Selecciona una fecha</div><div class="cl-days"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span></div></div><div><div class="cl-label">Selecciona un horario</div><div class="cl-times"><span>9:00 a. m.</span><span>10:00 a. m.</span><span>11:00 a. m.</span></div></div></div>'+
        '<div class="cl-fields"><div class="cl-field">👤 Marta Gómez ✓</div><div class="cl-field">☏ +57 300 000 0000 ✓</div></div>'+
        '<div class="cl-confirm">▣ Confirmar cita →</div><div class="cl-success"><i>✓</i><span><strong>Cita agendada</strong><br>Miércoles · 10:00 a. m.</span></div></div>'+
        '<div class="cl-bottom-cta">☺ Agenda en un minuto, ahí mismo</div>'+
      '</div></div>';
  }
  function mount(kind){
    var panel=rightPanel();
    if(!panel) return;
    panel.style.position="relative";
    var old=panel.querySelector(".cl-premium-demo");
    if(old) old.remove();
    if(kind==="web") panel.insertAdjacentHTML("beforeend",webDemo());
    if(kind==="agenda") panel.insertAdjacentHTML("beforeend",agendaDemo());
  }
  function bind(){
    var web=clickable(leaf("Tu página"));
    var agenda=clickable(leaf("Agenda web"));
    if(web && !web.dataset.clPremiumBound){
      web.dataset.clPremiumBound="1";
      web.addEventListener("click",function(){setTimeout(function(){mount("web")},80)});
    }
    if(agenda && !agenda.dataset.clPremiumBound){
      agenda.dataset.clPremiumBound="1";
      agenda.addEventListener("click",function(){setTimeout(function(){mount("agenda")},80)});
    }
    var active=Array.from(document.querySelectorAll("body *")).find(function(el){
      var t=(el.textContent||"").trim();
      var s=getComputedStyle(el);
      return (t==="Tu página" || t==="Agenda web") && (s.backgroundColor!=="rgba(0, 0, 0, 0)" || s.boxShadow!=="none");
    });
    if(active){
      var t=(active.textContent||"").trim();
      if(t==="Tu página") mount("web");
      if(t==="Agenda web") mount("agenda");
    }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){setTimeout(bind,500)});
  else setTimeout(bind,500);
  document.addEventListener("click",function(){setTimeout(bind,180)},true);
})();
</script>
\`;

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
      child.style.scrollSnapAlign = "start";
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

    function goNext() {
      if (paused || document.hidden) return;
      index = (index + 1) % items.length;
      var left = Math.max(0, items[index].offsetLeft - 18);
      track.scrollTo({ left: left, behavior: "smooth" });
    }

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

function getOriginalHtml() {
  const html = gunzipSync(Buffer.from(COMPRESSED_HTML, "base64")).toString("utf8");
  return html
    .replace("</head>", SECTION_TITLE_WEIGHT_OVERRIDE + MOBILE_FLOW_FIXES + PREMIUM_COMPARE_DEMOS_CSS + "\n  <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"shortcut icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"apple-touch-icon\" href=\"/favicon.png\">\n" + "</head>")
    .replace("</body>", MOBILE_FLOW_SCRIPT + PREMIUM_COMPARE_DEMOS_SCRIPT + "</body>");
}

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async () => {
        const html = getOriginalHtml();
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
