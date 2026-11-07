import { clinicPhoto } from "../compare/demos";

const phoneMarkup = `
<div class="clm-phone-ui" data-clm-phone-ui>
  <div class="clm-phone-progress"><i class="active"></i><i></i><i></i><i></i></div>

  <section class="clm-phone-scene clm-ig-scene active" data-clm-phone-scene="0">
    <div class="clm-ig-top"><b>Instagram</b><span>♡　⌁</span></div>
    <div class="clm-ig-stories">
      <i class="me"></i><i></i><i></i><i></i><i></i>
    </div>
    <div class="clm-ig-post-head">
      <span class="clm-ig-avatar">CD</span>
      <div><b>complicedental</b><small>Publicidad</small></div>
      <strong>•••</strong>
    </div>
    <div class="clm-ig-photo" style="background-image:linear-gradient(0deg,rgba(10,24,71,.60),rgba(10,24,71,.04) 58%),url('${clinicPhoto}')">
      <span>Diseño de sonrisa</span>
      <div><b>Tu sonrisa merece una experiencia a tu nivel.</b><small>Valoración personalizada · agenda online</small></div>
    </div>
    <div class="clm-ig-actions"><span>♡　◯　⌁</span><b>Guardar</b></div>
    <div class="clm-ig-copy"><b>complicedental</b> Conoce tus opciones de estética dental y agenda una valoración.</div>
    <button class="clm-ig-cta" data-clm-phone-next>Agendar valoración</button>
  </section>

  <section class="clm-phone-scene clm-web-scene" data-clm-phone-scene="1">
    <div class="clm-mini-browser"><span></span><span></span><span></span><b>complicedental.com/valoracion</b></div>
    <div class="clm-webnav"><b>✦ Cómplice Dental</b><span>Tratamientos　Opiniones</span></div>
    <div class="clm-mini-webhero" style="background-image:linear-gradient(90deg,rgba(15,49,135,.94),rgba(49,83,215,.52)),url('${clinicPhoto}')">
      <small>ODONTOLOGÍA PERSONALIZADA</small>
      <strong>Una experiencia que transmite confianza antes de la cita.</strong>
      <span>Conoce el tratamiento y agenda sin llamadas.</span>
    </div>
    <div class="clm-web-benefits"><span>✓ Atención personalizada</span><span>✓ Agenda inmediata</span></div>
    <div class="clm-mini-form">
      <div class="clm-form-title"><b>Quiero una valoración</b><small>Déjanos tus datos</small></div>
      <label>Nombre <span>Laura Pérez</span></label>
      <label>WhatsApp <span>+57 311 000 0000</span></label>
      <label>Servicio <span>Diseño de sonrisa</span></label>
      <button data-clm-phone-next>Continuar por WhatsApp　→</button>
    </div>
  </section>

  <section class="clm-phone-scene clm-wa-scene" data-clm-phone-scene="2">
    <div class="clm-wa-header">
      <span class="clm-wa-back">‹</span>
      <span class="clm-wa-avatar">CD</span>
      <div><b>Cómplice Dental</b><small>en línea</small></div>
      <span class="clm-wa-icons">⌕　⋮</span>
    </div>
    <div class="clm-wa-day">Hoy</div>
    <div class="clm-wa-chat">
      <div class="clm-wa-msg out">Hola 👋 Vengo de la página y quiero agendar una valoración para diseño de sonrisa.<time>10:24　✓✓</time></div>
      <div class="clm-wa-msg in">¡Hola, Laura! Claro. Tenemos disponibilidad esta semana.<time>10:25</time></div>
      <div class="clm-wa-slot"><b>Horarios disponibles</b><span>Mié 10:00</span><span>Jue 4:00</span></div>
      <div class="clm-wa-msg out">Miércoles a las 10:00 me queda perfecto.<time>10:25　✓✓</time></div>
      <div class="clm-wa-msg in success">Perfecto ✅ Tu valoración quedó agendada. Te enviaremos un recordatorio por aquí.<time>10:26</time></div>
    </div>
    <div class="clm-wa-input"><span>＋</span><b>Escribe un mensaje</b><i>➤</i></div>
  </section>

  <section class="clm-phone-scene clm-crm-scene" data-clm-phone-scene="3">
    <div class="clm-crm-bar"><b>CRM · Contactos</b><span>⋮</span></div>
    <div class="clm-crm-summary">
      <div class="clm-crm-avatar">LP</div>
      <div><small>NUEVO CONTACTO</small><b>Laura Pérez</b><span>+57 311 000 0000</span></div>
      <em>Agendada</em>
    </div>
    <div class="clm-crm-tags"><span>Diseño de sonrisa</span><span>Meta Ads</span><span>WhatsApp</span></div>
    <div class="clm-crm-detail">
      <div><small>Origen</small><b>Instagram → Landing</b></div>
      <div><small>Próxima acción</small><b>Recordatorio 24 h</b></div>
    </div>
    <div class="clm-crm-title">Historial del contacto</div>
    <div class="clm-crm-flow">
      <div class="done"><i>✓</i><span><b>Vio el anuncio</b><small>Instagram · 10:22</small></span></div>
      <div class="done"><i>✓</i><span><b>Dejó sus datos</b><small>Landing · 10:24</small></span></div>
      <div class="done"><i>✓</i><span><b>Conversó por WhatsApp</b><small>Interés confirmado</small></span></div>
      <div class="done"><i>✓</i><span><b>Cita agendada</b><small>Miércoles · 10:00 a. m.</small></span></div>
      <div><i>5</i><span><b>Seguimiento</b><small>Programado después de la cita</small></span></div>
    </div>
  </section>

  <div class="clm-phone-caption"><span data-clm-caption>Campaña diseñada por Cómplice Lab</span></div>
</div>
`;

export const marketingStyles = `
<style id="marketing-phone-v11">
  .clm-platform-cloud{position:absolute;inset:0;pointer-events:none;z-index:30;overflow:visible}
  .clm-float{position:absolute;display:flex;align-items:center;gap:6px;padding:7px 9px;border:1px solid rgba(255,255,255,.78);border-radius:15px;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);box-shadow:0 14px 30px rgba(32,53,125,.16);font:800 7px/1 "Montserrat",sans-serif;color:#17213a;animation:clmOrbitFloat 5s ease-in-out infinite;white-space:nowrap}
  .clm-float i{width:22px;height:22px;border-radius:8px;display:grid;place-items:center;font-style:normal;font-weight:900}
  .clm-float.meta{left:-28px;top:15%}.clm-float.meta i{background:#edf4ff;color:#1877f2}
  .clm-float.ig{right:-34px;top:31%;animation-delay:.7s}.clm-float.ig i{background:linear-gradient(135deg,#fff0f8,#fff1e9);color:#c13584}
  .clm-float.tt{left:-24px;bottom:24%;animation-delay:1.4s}.clm-float.tt i{background:#f5f5f7;color:#111}
  .clm-float.ga{right:-34px;bottom:13%;animation-delay:2.1s}.clm-float.ga i{background:#eef5ff;color:#4285f4}

  .clm-phone-ui{position:absolute;z-index:20;left:8px;right:8px;top:30px;bottom:8px;display:flex;flex-direction:column;background:#fff;color:#111b21;font-family:"Poppins",sans-serif;overflow:hidden;border-radius:22px}
  .clm-phone-progress{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:6px 10px 4px;background:#fff}
  .clm-phone-progress i{height:3px;border-radius:999px;background:#e3e8f2}.clm-phone-progress i.active{background:linear-gradient(90deg,#1972f2,#7254ef)}
  .clm-phone-scene{display:none;flex:1;min-height:0;animation:clmSceneIn .4s cubic-bezier(.2,.8,.2,1)}.clm-phone-scene.active{display:flex;flex-direction:column}

  .clm-ig-scene{background:#fff}
  .clm-ig-top{height:37px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;border-bottom:1px solid #f0f0f2}.clm-ig-top b{font-size:13px}.clm-ig-top span{font-size:13px}
  .clm-ig-stories{display:flex;gap:8px;padding:8px 9px;border-bottom:1px solid #f2f3f5}.clm-ig-stories i{width:29px;height:29px;border-radius:50%;background:#f3f4f7;border:2px solid #ec4d89;box-shadow:inset 0 0 0 3px #fff}.clm-ig-stories i.me{border-color:#cfd6e4}
  .clm-ig-post-head{display:flex;align-items:center;gap:7px;padding:8px 9px}.clm-ig-avatar{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#1d72f2,#7254ef);color:#fff;font:800 7px "Montserrat",sans-serif}.clm-ig-post-head b{display:block;font-size:8px}.clm-ig-post-head small{display:block;font:500 6px "Montserrat",sans-serif;color:#7d8799}.clm-ig-post-head strong{margin-left:auto;font-size:10px}
  .clm-ig-photo{min-height:210px;position:relative;background-size:cover;background-position:center;overflow:hidden}.clm-ig-photo>span{position:absolute;left:10px;top:10px;padding:5px 7px;border-radius:999px;background:rgba(255,255,255,.93);color:#3153d7;font:800 6px "Montserrat",sans-serif}.clm-ig-photo>div{position:absolute;left:11px;right:11px;bottom:12px;color:#fff}.clm-ig-photo b{display:block;font-size:19px;line-height:1.02;letter-spacing:-.04em}.clm-ig-photo small{display:block;margin-top:5px;font:500 7px "Montserrat",sans-serif;color:rgba(255,255,255,.84)}
  .clm-ig-actions{display:flex;justify-content:space-between;padding:8px 10px 4px;font-size:11px}.clm-ig-actions b{font:700 7px "Montserrat",sans-serif}.clm-ig-copy{padding:0 10px 7px;font:500 7px/1.4 "Montserrat",sans-serif;color:#3e4657}.clm-ig-copy b{font-weight:800;color:#111}
  .clm-ig-cta{margin:0 9px 8px;border:0;border-radius:8px;padding:9px;background:#0095f6;color:#fff;font:800 8px "Montserrat",sans-serif}

  .clm-web-scene{background:#fff}
  .clm-mini-browser{height:27px;display:flex;align-items:center;gap:4px;padding:0 8px;background:#f4f7fc;border-bottom:1px solid #e1e6f0}.clm-mini-browser span{width:5px;height:5px;border-radius:50%;background:#ccd5e5}.clm-mini-browser b{margin-left:3px;flex:1;padding:4px 7px;border-radius:999px;background:#fff;font:600 6px "Montserrat",sans-serif;color:#8190a7}
  .clm-webnav{height:34px;display:flex;align-items:center;justify-content:space-between;padding:0 9px;border-bottom:1px solid #eef1f6}.clm-webnav b{font-size:8px}.clm-webnav span{font:600 5px "Montserrat",sans-serif;color:#738099}
  .clm-mini-webhero{min-height:155px;padding:15px 12px;background-size:cover;background-position:center;color:#fff;display:flex;flex-direction:column;justify-content:flex-end}.clm-mini-webhero small{font:700 6px "Montserrat",sans-serif}.clm-mini-webhero strong{font-size:18px;line-height:1.02;letter-spacing:-.035em;margin:5px 0}.clm-mini-webhero span{font:500 7px "Montserrat",sans-serif;color:rgba(255,255,255,.84)}
  .clm-web-benefits{display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:7px 9px;background:#fafbfe;border-bottom:1px solid #edf0f5}.clm-web-benefits span{font:600 6px "Montserrat",sans-serif;color:#58657d}
  .clm-mini-form{padding:9px 10px 10px;background:#fff}.clm-form-title{display:flex;justify-content:space-between;align-items:end;margin-bottom:6px}.clm-form-title b{font-size:10px}.clm-form-title small{font:500 5px "Montserrat",sans-serif;color:#8a95a8}.clm-mini-form label{display:block;margin-bottom:5px;font:700 6px "Montserrat",sans-serif;color:#44516b}.clm-mini-form label span{display:block;margin-top:2px;padding:6px 7px;border:1px solid #dfe5ef;border-radius:7px;background:#fff;font-weight:500;color:#68758d}.clm-mini-form button{width:100%;border:0;border-radius:8px;padding:8px;background:linear-gradient(90deg,#1972f2,#7254ef);color:#fff;font:800 7px "Montserrat",sans-serif;box-shadow:0 7px 15px rgba(74,78,224,.16)}

  .clm-wa-scene{background:#efeae2}
  .clm-wa-header{display:flex;align-items:center;gap:7px;padding:8px 9px;background:#f0f2f5;border-bottom:1px solid #d9dee3}.clm-wa-back{font-size:18px;color:#54656f}.clm-wa-avatar{width:31px;height:31px;border-radius:50%;display:grid;place-items:center;background:#d9fdd3;color:#128c7e;font-size:8px;font-weight:800}.clm-wa-header b{display:block;font-size:10px}.clm-wa-header small{display:block;font:500 7px "Montserrat",sans-serif;color:#667781}.clm-wa-icons{margin-left:auto;color:#54656f;font-size:11px}
  .clm-wa-day{align-self:center;margin:8px 0 2px;padding:4px 8px;border-radius:6px;background:#fff;font:600 6px "Montserrat",sans-serif;color:#667781;box-shadow:0 1px 2px rgba(11,20,26,.08)}
  .clm-wa-chat{padding:9px;display:flex;flex-direction:column;gap:7px;flex:1;background:radial-gradient(circle at 14px 14px,rgba(255,255,255,.34) 0 1px,transparent 1.5px) 0 0/22px 22px,#efeae2}
  .clm-wa-msg{max-width:82%;padding:8px 9px;border-radius:8px;background:#fff;box-shadow:0 1px 2px rgba(11,20,26,.12);font:500 8px/1.42 "Montserrat",sans-serif;animation:clmMsgIn .38s both}.clm-wa-msg.out{align-self:flex-end;background:#d9fdd3}.clm-wa-msg:nth-child(2){animation-delay:.55s}.clm-wa-msg:nth-child(4){animation-delay:1.15s}.clm-wa-msg:nth-child(5){animation-delay:1.7s}.clm-wa-msg time{display:block;text-align:right;margin-top:3px;font-size:5px;color:#667781}
  .clm-wa-slot{display:grid;grid-template-columns:1fr 1fr;gap:5px;background:#fff;border-radius:9px;padding:7px;box-shadow:0 1px 2px rgba(11,20,26,.1);font:700 7px "Montserrat",sans-serif}.clm-wa-slot b{grid-column:1/-1;color:#263238}.clm-wa-slot span{padding:6px 5px;text-align:center;border-radius:7px;background:#e8f7ef;color:#128c7e}.clm-wa-msg.success{border-left:3px solid #25d366}
  .clm-wa-input{display:grid;grid-template-columns:auto 1fr auto;gap:6px;align-items:center;padding:7px 8px;background:#f0f2f5}.clm-wa-input>b{padding:7px 9px;border-radius:999px;background:#fff;font:500 7px "Montserrat",sans-serif;color:#7b8793}.clm-wa-input i{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#25d366;color:#fff;font-style:normal}

  .clm-crm-scene{background:#f7f9fc}
  .clm-crm-bar{height:36px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:#101b34;color:#fff}.clm-crm-bar b{font-size:9px}.clm-crm-bar span{font-size:12px}
  .clm-crm-summary{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;padding:10px;background:#fff;border-bottom:1px solid #e6eaf2}.clm-crm-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#dceaff,#ece3ff);color:#5263df;font-size:9px;font-weight:800}.clm-crm-summary small{display:block;font:700 5px "Montserrat",sans-serif;color:#6673e8}.clm-crm-summary b{display:block;font-size:11px}.clm-crm-summary span{display:block;font:500 6px "Montserrat",sans-serif;color:#748198}.clm-crm-summary em{font-style:normal;padding:5px 7px;border-radius:999px;background:#e7fff3;color:#11865d;font:800 6px "Montserrat",sans-serif}
  .clm-crm-tags{display:flex;gap:5px;padding:7px 9px;background:#fff}.clm-crm-tags span{padding:5px 6px;border-radius:999px;background:#eef3ff;color:#4d5ed1;font:700 5px "Montserrat",sans-serif}
  .clm-crm-detail{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:8px 9px}.clm-crm-detail>div{padding:8px;border:1px solid #e3e8f1;border-radius:8px;background:#fff}.clm-crm-detail small{display:block;font:600 5px "Montserrat",sans-serif;color:#8893a6}.clm-crm-detail b{display:block;margin-top:2px;font-size:7px}
  .clm-crm-title{padding:3px 10px 5px;font:800 7px "Montserrat",sans-serif;color:#35415b}
  .clm-crm-flow{padding:4px 9px 6px}.clm-crm-flow>div{display:grid;grid-template-columns:26px 1fr;gap:7px;position:relative;padding-bottom:9px}.clm-crm-flow>div:not(:last-child):before{content:"";position:absolute;left:12px;top:23px;bottom:-1px;width:2px;background:#dbe3f1}.clm-crm-flow i{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#eef2ff;color:#5663df;font-style:normal;font-size:7px}.clm-crm-flow .done i{background:linear-gradient(135deg,#1f73f1,#7155ef);color:#fff}.clm-crm-flow b{display:block;font-size:8px}.clm-crm-flow small{display:block;margin-top:1px;font:500 6px "Montserrat",sans-serif;color:#768299}
  .clm-phone-caption{min-height:28px;display:flex;align-items:center;justify-content:center;padding:5px 7px;border-top:1px solid #e7ebf3;background:#fff;font:700 5px "Montserrat",sans-serif;color:#53617a;text-align:center}

  @keyframes clmSceneIn{from{opacity:0;transform:translateY(7px) scale(.99)}to{opacity:1;transform:none}}@keyframes clmMsgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes clmOrbitFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-7px,0)}}
  @media(max-width:700px){.clm-float{padding:6px 7px;font-size:6px}.clm-float i{width:18px;height:18px}.clm-float.meta{left:-15px}.clm-float.ig{right:-15px}.clm-float.tt{left:-12px}.clm-float.ga{right:-12px}}
</style>
`;

export const marketingInteractions = '<script id="marketing-phone-runtime-v11">(function(){'+
'function norm(s){return (s||"").replace(/\\s+/g," ").trim().toLowerCase()}'+
'function heading(){return Array.from(document.querySelectorAll("h1,h2,h3,h4")).find(function(el){var t=norm(el.textContent);return t.indexOf("atraemos clientes")!==-1&&t.indexOf("marketing digital")!==-1})}'+
'function phoneFrom(sec){var texts=Array.from(sec.querySelectorAll("*")).filter(function(el){var t=norm(el.textContent);return t==="odontología estética y general"||t==="agendar en la web"||t==="escribir por whatsapp"});for(var z=0;z<texts.length;z++){var n=texts[z];while(n&&n!==sec){var r=n.getBoundingClientRect(),s=getComputedStyle(n);if(r.width>190&&r.width<390&&r.height>330&&r.height<760&&parseFloat(s.borderRadius)>=20)return n;n=n.parentElement}}var c=Array.from(sec.querySelectorAll("div,article")).filter(function(el){var r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>190&&r.width<390&&r.height>350&&r.height<760&&r.height/r.width>1.45&&parseFloat(s.borderRadius)>=20});c.sort(function(a,b){return b.getBoundingClientRect().height-a.getBoundingClientRect().height});return c[0]||null}'+
'function rightSteps(sec){var labels=["ve tu anuncio en instagram","lo toca y llega a la página de su nicho","agenda en la web o por whatsapp","queda en tu crm"];return labels.map(function(label){var leaf=Array.from(sec.querySelectorAll("*")).find(function(el){return el.children.length===0&&norm(el.textContent)===label});if(!leaf)return null;var n=leaf;while(n&&n!==sec){var r=n.getBoundingClientRect();if(r.width>300&&r.height>42&&r.height<110)return n;n=n.parentElement}return leaf.parentElement}).filter(Boolean)}'+
'function mount(){var h=heading();if(!h)return;var sec=h.closest(".svc")||h.closest("[data-service]")||h.parentElement;if(!sec||sec.dataset.clmPhoneMounted)return;sec.dataset.clmPhoneMounted="1";var phone=phoneFrom(sec);if(!phone)return;phone.style.position="relative";phone.style.overflow="visible";var oldUi=phone.querySelector("[data-clm-phone-ui]");if(oldUi)oldUi.remove();var oldCloud=phone.querySelector(".clm-platform-cloud");if(oldCloud)oldCloud.remove();var cloud=document.createElement("div");cloud.className="clm-platform-cloud";cloud.innerHTML=\'<span class="clm-float meta"><i>∞</i>Meta</span><span class="clm-float ig"><i>◎</i>Instagram</span><span class="clm-float tt"><i>♪</i>TikTok</span><span class="clm-float ga"><i>A</i>Google Ads</span>\';phone.appendChild(cloud);phone.insertAdjacentHTML("beforeend",'+JSON.stringify(phoneMarkup)+');var root=phone.querySelector("[data-clm-phone-ui]"),scenes=Array.from(root.querySelectorAll("[data-clm-phone-scene]")),bars=Array.from(root.querySelectorAll(".clm-phone-progress i")),caption=root.querySelector("[data-clm-caption]"),steps=rightSteps(sec),labels=["Anuncio realista en Instagram","Landing premium con formulario","WhatsApp agenda la cita","Contacto y seguimiento en CRM"];var idx=0,timer=null;function show(n){idx=n;scenes.forEach(function(x,i){x.classList.toggle("active",i===n)});bars.forEach(function(x,i){x.classList.toggle("active",i===n)});steps.forEach(function(x,i){x.classList.toggle("clm-ext-active",i===n);if(i===n){x.style.borderColor="#6a72f4";x.style.background="linear-gradient(135deg,#eef4ff,#f7f4ff)";}else{x.style.borderColor="";x.style.background="";}});if(caption)caption.textContent=labels[n]}function auto(){clearInterval(timer);timer=setInterval(function(){show((idx+1)%4)},4400)}steps.forEach(function(step,i){step.addEventListener("click",function(){show(i);auto()})});root.addEventListener("click",function(e){if(!e.target.closest("[data-clm-phone-next]"))return;show((idx+1)%4);auto()});show(0);auto()}'+
'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(mount,550)});else setTimeout(mount,550);})();</script>';

export { phoneMarkup };
