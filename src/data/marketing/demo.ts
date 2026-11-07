import { clinicPhoto } from "../compare/demos";

const phoneMarkup = `
<div class="clm-phone-ui" data-clm-phone-ui>
  <div class="clm-phone-progress">
    <i class="active"></i><i></i><i></i><i></i>
  </div>

  <section class="clm-phone-scene active" data-clm-phone-scene="0">
    <div class="clm-ad-head">
      <span class="clm-brand-dot">CL</span>
      <div><b>Cómplice Dental</b><small>Publicidad · Instagram</small></div>
      <span class="clm-sponsored">Patrocinado</span>
    </div>
    <div class="clm-ad-image" style="background-image:linear-gradient(0deg,rgba(8,24,69,.58),rgba(12,49,130,.05)),url('${clinicPhoto}')">
      <span class="clm-ad-pill">Diseño de sonrisa</span>
      <div class="clm-ad-overlay"><strong>Una sonrisa que se siente tan bien como se ve.</strong><small>Valoración personalizada · agenda online</small></div>
    </div>
    <div class="clm-ad-body">
      <p>Conoce tus opciones de estética dental y agenda una valoración.</p>
      <button data-clm-phone-next>Agendar valoración →</button>
    </div>
  </section>

  <section class="clm-phone-scene" data-clm-phone-scene="1">
    <div class="clm-mini-browser"><span></span><span></span><span></span><b>complicedental.com/valoracion</b></div>
    <div class="clm-mini-webhero" style="background-image:linear-gradient(90deg,rgba(18,57,154,.92),rgba(57,86,223,.46)),url('${clinicPhoto}')">
      <small>ODONTOLOGÍA PERSONALIZADA</small>
      <strong>Tu sonrisa merece una experiencia a tu nivel.</strong>
      <span>Agenda tu valoración en pocos pasos.</span>
    </div>
    <div class="clm-mini-form">
      <b>Quiero una valoración</b>
      <label>Nombre <span>Laura Pérez</span></label>
      <label>WhatsApp <span>+57 311 000 0000</span></label>
      <label>Servicio <span>Diseño de sonrisa</span></label>
      <button data-clm-phone-next>Continuar por WhatsApp</button>
    </div>
  </section>

  <section class="clm-phone-scene clm-wa-scene" data-clm-phone-scene="2">
    <div class="clm-wa-header">
      <span class="clm-wa-avatar">CD</span>
      <div><b>Cómplice Dental</b><small>en línea</small></div>
      <span>⋮</span>
    </div>
    <div class="clm-wa-day">Hoy</div>
    <div class="clm-wa-chat">
      <div class="clm-wa-msg out">Hola 👋 Vengo de la página. Quiero agendar una valoración.<time>10:24 ✓✓</time></div>
      <div class="clm-wa-msg in">¡Hola, Laura! Tenemos disponibilidad miércoles 10:00 a. m. o jueves 4:00 p. m.<time>10:25</time></div>
      <div class="clm-wa-msg out">Miércoles a las 10 me queda perfecto.<time>10:25 ✓✓</time></div>
      <div class="clm-wa-msg in final">¡Listo! Tu valoración quedó agendada ✅<time>10:26</time></div>
    </div>
    <div class="clm-wa-input"><span>Escribe un mensaje</span><i>➤</i></div>
  </section>

  <section class="clm-phone-scene" data-clm-phone-scene="3">
    <div class="clm-crm-top"><small>CRM · NUEVO CONTACTO</small><b>Laura Pérez</b><span>Contacto activo</span></div>
    <div class="clm-crm-card">
      <div class="clm-crm-avatar">LP</div>
      <div><b>Laura Pérez</b><small>+57 311 000 0000</small><small>Interés: Diseño de sonrisa</small></div>
      <em>Cita</em>
    </div>
    <div class="clm-crm-origin">Origen: Meta Ads → Landing → WhatsApp</div>
    <div class="clm-crm-flow">
      <div><i>1</i><span><b>Contacto registrado</b><small>10:24 · Meta Ads</small></span></div>
      <div><i>2</i><span><b>Conversación iniciada</b><small>WhatsApp</small></span></div>
      <div><i>3</i><span><b>Cita agendada</b><small>Miércoles · 10:00 a. m.</small></span></div>
      <div><i>4</i><span><b>Recordatorio</b><small>Programado 24 h antes</small></span></div>
    </div>
  </section>

  <div class="clm-phone-caption">
    <span data-clm-caption>Campaña diseñada y publicada por nosotros</span>
  </div>
</div>
`;

export const marketingStyles = `
<style id="marketing-phone-v10">
  .clm-platform-cloud{position:absolute;inset:0;pointer-events:none;z-index:6}
  .clm-float{position:absolute;display:flex;align-items:center;gap:7px;padding:9px 11px;border:1px solid rgba(84,104,230,.18);border-radius:15px;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);box-shadow:0 14px 34px rgba(38,58,132,.16);font:700 9px/1 "Montserrat",sans-serif;color:#17213a;animation:clmOrbitFloat 4.6s ease-in-out infinite}
  .clm-float i{width:24px;height:24px;border-radius:9px;display:grid;place-items:center;font-style:normal;font-weight:900}
  .clm-float.meta{left:-72px;top:15%}.clm-float.meta i{background:#edf4ff;color:#1877f2}
  .clm-float.ig{right:-88px;top:26%;animation-delay:.7s}.clm-float.ig i{background:linear-gradient(135deg,#fff0f8,#fff1e9);color:#c13584}
  .clm-float.tt{left:-62px;bottom:27%;animation-delay:1.4s}.clm-float.tt i{background:#f5f5f7;color:#111}
  .clm-float.ga{right:-94px;bottom:15%;animation-delay:2.1s}.clm-float.ga i{background:#eef5ff;color:#4285f4}
  .clm-phone-ui{height:100%;min-height:100%;display:flex;flex-direction:column;background:#fff;color:#111b21;font-family:"Poppins",sans-serif;overflow:hidden}
  .clm-phone-progress{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:8px 10px 5px;background:#fff}
  .clm-phone-progress i{height:3px;border-radius:999px;background:#e3e8f2;overflow:hidden;position:relative}
  .clm-phone-progress i.active{background:linear-gradient(90deg,#1972f2,#7254ef)}
  .clm-phone-scene{display:none;flex:1;min-height:0;animation:clmSceneIn .45s cubic-bezier(.2,.8,.2,1)}
  .clm-phone-scene.active{display:flex;flex-direction:column}
  .clm-ad-head{display:flex;align-items:center;gap:7px;padding:8px 9px;background:#fff}
  .clm-brand-dot{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#1c72f2,#7354ef);color:#fff;font:800 7px "Montserrat",sans-serif}
  .clm-ad-head b{display:block;font-size:9px}.clm-ad-head small{display:block;font:500 6px "Montserrat",sans-serif;color:#7c879b}
  .clm-sponsored{margin-left:auto;font:600 6px "Montserrat",sans-serif;color:#8a95a8}
  .clm-ad-image{min-height:190px;position:relative;background-size:cover;background-position:center;border-radius:0;overflow:hidden}
  .clm-ad-pill{position:absolute;left:10px;top:10px;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,.92);font:800 6px "Montserrat",sans-serif;color:#3153d7}
  .clm-ad-overlay{position:absolute;left:12px;right:12px;bottom:12px;color:#fff}.clm-ad-overlay strong{display:block;font-size:19px;line-height:1.02;letter-spacing:-.04em}.clm-ad-overlay small{display:block;margin-top:5px;font:500 7px/1.35 "Montserrat",sans-serif;color:rgba(255,255,255,.82)}
  .clm-ad-body{padding:10px}.clm-ad-body p{font:500 8px/1.4 "Montserrat",sans-serif;color:#55627b;margin:0 0 9px}.clm-ad-body button,.clm-mini-form button{width:100%;border:0;border-radius:999px;padding:9px;background:linear-gradient(90deg,#1972f2,#7254ef);color:#fff;font:800 8px "Montserrat",sans-serif;box-shadow:0 8px 16px rgba(74,78,224,.18)}
  .clm-mini-browser{height:29px;display:flex;align-items:center;gap:4px;padding:0 8px;background:#f4f7fc;border-bottom:1px solid #e1e6f0}.clm-mini-browser span{width:6px;height:6px;border-radius:50%;background:#ccd5e5}.clm-mini-browser b{margin-left:3px;flex:1;padding:4px 7px;border-radius:999px;background:#fff;font:600 6px "Montserrat",sans-serif;color:#8190a7}
  .clm-mini-webhero{min-height:150px;padding:16px 13px;background-size:cover;background-position:center;color:#fff;display:flex;flex-direction:column;justify-content:flex-end}.clm-mini-webhero small{font:700 6px "Montserrat",sans-serif}.clm-mini-webhero strong{font-size:18px;line-height:1.02;letter-spacing:-.035em;margin:5px 0}.clm-mini-webhero span{font:500 7px "Montserrat",sans-serif;color:rgba(255,255,255,.84)}
  .clm-mini-form{padding:11px}.clm-mini-form>b{display:block;font-size:11px;margin-bottom:7px}.clm-mini-form label{display:block;margin-bottom:6px;font:700 6px "Montserrat",sans-serif;color:#44516b}.clm-mini-form label span{display:block;margin-top:3px;padding:7px 8px;border:1px solid #dfe5ef;border-radius:7px;background:#fff;font-weight:500;color:#68758d}
  .clm-wa-scene{background:#efeae2}
  .clm-wa-header{display:flex;align-items:center;gap:8px;padding:9px 10px;background:#f0f2f5;border-bottom:1px solid #d9dee3}.clm-wa-avatar{width:29px;height:29px;border-radius:50%;display:grid;place-items:center;background:#d9fdd3;color:#128c7e;font-size:8px;font-weight:800}.clm-wa-header b{display:block;font-size:9px}.clm-wa-header small{display:block;font:500 6px "Montserrat",sans-serif;color:#667781}.clm-wa-header>span:last-child{margin-left:auto}
  .clm-wa-day{align-self:center;margin:8px 0 0;padding:4px 8px;border-radius:6px;background:#fff;font:600 6px "Montserrat",sans-serif;color:#667781;box-shadow:0 1px 2px rgba(11,20,26,.08)}
  .clm-wa-chat{padding:8px;display:flex;flex-direction:column;gap:7px;flex:1;background:radial-gradient(circle at 14px 14px,rgba(255,255,255,.36) 0 1px,transparent 1.5px) 0 0/22px 22px,#efeae2}
  .clm-wa-msg{max-width:84%;padding:7px 8px;border-radius:8px;background:#fff;box-shadow:0 1px 2px rgba(11,20,26,.12);font:500 7px/1.42 "Montserrat",sans-serif;animation:clmMsgIn .4s both}.clm-wa-msg.out{align-self:flex-end;background:#d9fdd3}.clm-wa-msg:nth-child(2){animation-delay:.7s}.clm-wa-msg:nth-child(3){animation-delay:1.4s}.clm-wa-msg:nth-child(4){animation-delay:2.1s}.clm-wa-msg time{display:block;text-align:right;margin-top:3px;font-size:5px;color:#667781}
  .clm-wa-input{display:flex;gap:6px;align-items:center;padding:7px 8px;background:#f0f2f5}.clm-wa-input span{flex:1;padding:7px 9px;border-radius:999px;background:#fff;font:500 6px "Montserrat",sans-serif;color:#7b8793}.clm-wa-input i{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#25d366;color:#fff;font-style:normal}
  .clm-crm-top{padding:11px;border-bottom:1px solid #e5eaf4;background:linear-gradient(135deg,#f8faff,#fff)}.clm-crm-top small{display:block;font:700 6px "Montserrat",sans-serif;color:#6070e8}.clm-crm-top b{display:block;font-size:16px}.clm-crm-top span{display:inline-flex;margin-top:5px;padding:4px 7px;border-radius:999px;background:#e7fff3;color:#11865d;font:700 6px "Montserrat",sans-serif}
  .clm-crm-card{display:grid;grid-template-columns:auto 1fr auto;gap:7px;align-items:center;margin:9px;border:1px solid #e3e8f2;border-radius:10px;padding:8px;box-shadow:0 5px 12px rgba(32,55,118,.06)}.clm-crm-avatar{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#dceaff,#ece3ff);color:#5263df;font-size:7px;font-weight:800}.clm-crm-card b{display:block;font-size:9px}.clm-crm-card small{display:block;font:500 6px/1.35 "Montserrat",sans-serif;color:#758198}.clm-crm-card em{font-style:normal;padding:4px 6px;border-radius:999px;background:#eef2ff;color:#5362df;font:700 6px "Montserrat",sans-serif}
  .clm-crm-origin{margin:0 9px;padding:7px 8px;border-radius:8px;background:#f5f8ff;font:600 6px "Montserrat",sans-serif;color:#5e6a83}
  .clm-crm-flow{padding:9px}.clm-crm-flow>div{display:grid;grid-template-columns:24px 1fr;gap:7px;position:relative;padding-bottom:9px}.clm-crm-flow>div:not(:last-child):before{content:"";position:absolute;left:11px;top:23px;bottom:0;width:2px;background:#dce4f3}.clm-crm-flow i{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#1f73f1,#7155ef);color:#fff;font-style:normal;font-size:7px}.clm-crm-flow b{display:block;font-size:8px}.clm-crm-flow small{display:block;font:500 6px "Montserrat",sans-serif;color:#768299}
  .clm-phone-caption{min-height:30px;display:flex;align-items:center;justify-content:center;padding:6px 8px;border-top:1px solid #e7ebf3;background:#fff;font:700 6px "Montserrat",sans-serif;color:#53617a;text-align:center}
  @keyframes clmSceneIn{from{opacity:0;transform:translateY(7px) scale(.99)}to{opacity:1;transform:none}}@keyframes clmMsgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes clmOrbitFloat{0%,100%{transform:translate3d(0,0,0) rotate(-1deg)}50%{transform:translate3d(0,-8px,0) rotate(1deg)}}
  @media(max-width:700px){
    .clm-float{padding:7px 8px;font-size:7px}.clm-float i{width:20px;height:20px}
    .clm-float.meta{left:-18px;top:12%}.clm-float.ig{right:-18px;top:24%}.clm-float.tt{left:-14px;bottom:24%}.clm-float.ga{right:-16px;bottom:12%}
    .clm-ad-image{min-height:170px}.clm-ad-overlay strong{font-size:16px}
  }
</style>
`;

export const marketingInteractions = '<script id="marketing-phone-runtime-v10">(function(){'+
'function norm(s){return (s||"").replace(/\\s+/g," ").trim().toLowerCase()}'+
'function heading(){return Array.from(document.querySelectorAll("h1,h2,h3,h4")).find(function(el){var t=norm(el.textContent);return t.indexOf("atraemos clientes")!==-1&&t.indexOf("marketing digital")!==-1})}'+
'function phoneFrom(sec){var texts=Array.from(sec.querySelectorAll("*")).filter(function(el){var t=norm(el.textContent);return t==="odontología estética y general"||t==="agendar en la web"||t==="escribir por whatsapp"});for(var z=0;z<texts.length;z++){var n=texts[z];while(n&&n!==sec){var r=n.getBoundingClientRect(),s=getComputedStyle(n);if(r.width>190&&r.width<390&&r.height>330&&r.height<760&&parseFloat(s.borderRadius)>=20)return n;n=n.parentElement}}var c=Array.from(sec.querySelectorAll("div,article")).filter(function(el){var r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>190&&r.width<390&&r.height>350&&r.height<760&&r.height/r.width>1.45&&parseFloat(s.borderRadius)>=20});c.sort(function(a,b){return b.getBoundingClientRect().height-a.getBoundingClientRect().height});return c[0]||null}'+
'function innerScreen(phone){var c=Array.from(phone.children).filter(function(el){var r=el.getBoundingClientRect(),p=phone.getBoundingClientRect();return r.width>p.width*.72&&r.height>p.height*.72});return c[c.length-1]||phone}'+
'function mount(){var h=heading();if(!h)return;var sec=h.closest(".svc")||h.closest("[data-service]")||h.parentElement;if(!sec||sec.dataset.clmPhoneMounted)return;sec.dataset.clmPhoneMounted="1";var paras=Array.from(sec.querySelectorAll("p"));var p=paras.find(function(x){var t=norm(x.textContent);return t.indexOf("más personas")!==-1||t.indexOf("que más personas")!==-1});if(p)p.textContent="Creamos y diseñamos tus campañas por ti, las llevamos a los canales correctos y conectamos cada anuncio con una experiencia que convierte la atención en oportunidades.";var phone=phoneFrom(sec);if(!phone)return;phone.style.position="relative";var holder=phone.parentElement||phone;holder.style.position="relative";var cloud=document.createElement("div");cloud.className="clm-platform-cloud";cloud.innerHTML=\'<span class="clm-float meta"><i>∞</i>Meta Ads</span><span class="clm-float ig"><i>◎</i>Instagram</span><span class="clm-float tt"><i>♪</i>TikTok</span><span class="clm-float ga"><i>A</i>Google Ads</span>\';holder.appendChild(cloud);var screen=innerScreen(phone);screen.innerHTML='+JSON.stringify(phoneMarkup)+';screen.style.overflow="hidden";var root=screen.querySelector("[data-clm-phone-ui]"),scenes=Array.from(root.querySelectorAll("[data-clm-phone-scene]")),bars=Array.from(root.querySelectorAll(".clm-phone-progress i")),caption=root.querySelector("[data-clm-caption]"),labels=["Campaña diseñada y publicada por nosotros","Página con formulario de registro","WhatsApp convierte el interés en una cita","El contacto queda organizado en tu CRM"];var idx=0,timer=null;function show(n){idx=n;scenes.forEach(function(x,i){x.classList.toggle("active",i===n)});bars.forEach(function(x,i){x.classList.toggle("active",i===n)});if(caption)caption.textContent=labels[n]}function auto(){clearInterval(timer);timer=setInterval(function(){show((idx+1)%4)},3600)}root.addEventListener("click",function(e){if(!e.target.closest("[data-clm-phone-next]"))return;show((idx+1)%4);auto()});show(0);auto()}'+
'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(mount,500)});else setTimeout(mount,500);})();</script>';

export { phoneMarkup };
