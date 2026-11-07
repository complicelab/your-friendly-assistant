import { clinicPhoto } from "../compare/demos";

const nicheData = [
  {
    key:"odonto", label:"Odontología", account:"complicedental", brand:"Cómplice Dental", initials:"CD",
    image:clinicPhoto, adTag:"Diseño de sonrisa",
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
  },
  {
    key:"abog", label:"Abogados", account:"firmalegal", brand:"Firma Legal", initials:"FL",
    image:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=82",
    adTag:"Asesoría legal",
    headline:"Tu caso merece una estrategia clara desde el primer contacto.",
    sub:"Diagnóstico inicial · atención confidencial",
    adCta:"Solicitar diagnóstico", url:"tufirma.com/diagnostico",
    landingKicker:"ASESORÍA LEGAL ESTRATÉGICA",
    landingHeadline:"Entiende tus opciones antes de tomar una decisión importante.",
    landingSub:"Cuéntanos tu caso y agenda un diagnóstico con el equipo.",
    service:"Diagnóstico legal", lead:"Andrés Gómez", phone:"+57 315 000 0000",
    waFirst:"Hola. Vi el anuncio y quisiera revisar un caso legal con su equipo.",
    waReply:"Hola, Andrés. Claro. Podemos agendar un diagnóstico confidencial con el equipo.",
    slots:["Hoy 4:30","Mañana 9:00"], selected:"Mañana a las 9:00 me sirve.",
    success:"Perfecto. Tu diagnóstico quedó reservado para mañana a las 9:00 a. m. ✅",
    metrics:[31500,1120,41]
  },
  {
    key:"ciruj", label:"Cirujanos", account:"clinicacirugia", brand:"Clínica Especializada", initials:"CE",
    image:"https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=82",
    adTag:"Valoración especializada",
    headline:"Resultados naturales comienzan con una valoración bien hecha.",
    sub:"Información clara · acompañamiento profesional",
    adCta:"Reservar valoración", url:"tuclinica.com/valoracion",
    landingKicker:"CIRUGÍA · VALORACIÓN PERSONALIZADA",
    landingHeadline:"Conoce el procedimiento, resuelve dudas y agenda tu valoración.",
    landingSub:"Una experiencia clara desde el primer contacto.",
    service:"Valoración quirúrgica", lead:"Mariana López", phone:"+57 300 555 0000",
    waFirst:"Hola 👋 Quiero información y una valoración para un procedimiento.",
    waReply:"Hola, Mariana. Con gusto. Podemos agendar una valoración con el especialista.",
    slots:["Jue 11:00","Vie 3:00"], selected:"El jueves a las 11:00 está perfecto.",
    success:"Listo ✅ Tu valoración quedó agendada para el jueves a las 11:00 a. m.",
    metrics:[56800,2410,73]
  },
  {
    key:"inmo", label:"Inmobiliarias", account:"tuinmobiliaria", brand:"Tu Inmobiliaria", initials:"TI",
    image:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=82",
    adTag:"Propiedades seleccionadas",
    headline:"Encuentra una propiedad que sí encaje contigo.",
    sub:"Asesoría directa · agenda visitas",
    adCta:"Ver propiedades", url:"tudominio.com/propiedades",
    landingKicker:"PROPIEDADES EN TU CIUDAD",
    landingHeadline:"Explora opciones y agenda una visita con un asesor.",
    landingSub:"Sin perder tiempo entre publicaciones y mensajes sueltos.",
    service:"Visita a inmueble", lead:"Carlos Ruiz", phone:"+57 310 444 0000",
    waFirst:"Hola. Me interesa la propiedad que vi en el anuncio. ¿Puedo agendar una visita?",
    waReply:"Hola, Carlos. Sí. Tenemos dos horarios disponibles para conocerla.",
    slots:["Sáb 10:00","Sáb 3:00"], selected:"El sábado a las 10:00 me funciona.",
    success:"Perfecto ✅ Tu visita quedó agendada para el sábado a las 10:00 a. m.",
    metrics:[40100,1580,58]
  }
];

export const marketingStyles = `
<style id="marketing-phone-v13">
  #s-marketing .sv-phone{overflow:visible}
  #s-marketing .sv-ps{background:#fff}
  #s-marketing .clm-platform-cloud{position:absolute;inset:0;z-index:12;pointer-events:none}
  #s-marketing .clm-float{position:absolute;display:flex;align-items:center;gap:7px;padding:8px 10px;border:1px solid rgba(72,92,190,.13);border-radius:14px;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);box-shadow:0 14px 30px rgba(40,58,120,.14);font:800 8px/1 "Montserrat",sans-serif;color:#19233b;white-space:nowrap;animation:clmFloat 4.8s ease-in-out infinite}
  #s-marketing .clm-float i{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;font-style:normal;font-weight:900}
  #s-marketing .clm-float.meta{left:-30px;top:17%} #s-marketing .clm-float.meta i{background:#edf4ff;color:#1877f2}
  #s-marketing .clm-float.ig{right:-36px;top:34%;animation-delay:.7s} #s-marketing .clm-float.ig i{background:linear-gradient(135deg,#fff0f8,#fff2e9);color:#c13584}
  #s-marketing .clm-float.tt{left:-26px;bottom:24%;animation-delay:1.4s} #s-marketing .clm-float.tt i{background:#f4f4f6;color:#111}
  #s-marketing .clm-float.ga{right:-36px;bottom:14%;animation-delay:2.1s} #s-marketing .clm-float.ga i{background:#eef5ff;color:#4285f4}

  #s-marketing .clm-phone{position:absolute;inset:0;display:flex;flex-direction:column;border-radius:32px;overflow:hidden;background:#fff;color:#111827;font-family:"Poppins",sans-serif}
  #s-marketing .clm-progress{height:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:0 12px;align-items:center;background:#fff;flex:none}
  #s-marketing .clm-progress i{height:4px;border-radius:999px;background:#dfe5ef;transition:.35s}
  #s-marketing .clm-progress i.on{background:linear-gradient(90deg,#1c72f2,#7254ef)}
  #s-marketing .clm-scene{flex:1;min-height:0;display:flex;flex-direction:column;animation:clmScene .42s cubic-bezier(.2,.8,.2,1)}
  #s-marketing .clm-caption{height:28px;display:flex;align-items:center;justify-content:center;border-top:1px solid #edf0f5;background:#fff;color:#5f6d86;font:700 7px "Montserrat",sans-serif;flex:none}

  /* Instagram */
  #s-marketing .clm-ig{background:#fff}
  #s-marketing .clm-ig-nav{height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-bottom:1px solid #f1f2f4;font-size:15px}
  #s-marketing .clm-ig-nav b{font-size:15px;letter-spacing:-.02em}
  #s-marketing .clm-stories{display:flex;gap:9px;padding:9px 11px;border-bottom:1px solid #f1f2f4;opacity:0;transform:translateY(-5px);transition:.35s}
  #s-marketing .clm-stories.show{opacity:1;transform:none}
  #s-marketing .clm-stories i{width:34px;height:34px;border-radius:50%;background:#eef1f6;border:2px solid #e64980;box-shadow:inset 0 0 0 3px #fff}
  #s-marketing .clm-stories i:first-child{border-color:#cad3e2}
  #s-marketing .clm-post{opacity:0;transform:translateY(8px);transition:.4s}
  #s-marketing .clm-post.show{opacity:1;transform:none}
  #s-marketing .clm-posthead{display:flex;align-items:center;gap:8px;padding:9px 11px}
  #s-marketing .clm-avatar{width:31px;height:31px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#1b72f2,#7254ef);color:#fff;font:800 8px "Montserrat",sans-serif}
  #s-marketing .clm-posthead b{display:block;font-size:9px} #s-marketing .clm-posthead small{display:block;color:#8792a4;font:500 7px "Montserrat",sans-serif}
  #s-marketing .clm-more{margin-left:auto;font-size:13px}
  #s-marketing .clm-adphoto{position:relative;min-height:226px;background-size:cover;background-position:center;overflow:hidden}
  #s-marketing .clm-adphoto:after{content:"";position:absolute;inset:36% 0 0;background:linear-gradient(transparent,rgba(7,18,49,.8))}
  #s-marketing .clm-adtag{position:absolute;z-index:2;left:11px;top:11px;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,.95);color:#3752ce;font:800 7px "Montserrat",sans-serif}
  #s-marketing .clm-adcopy{position:absolute;z-index:2;left:12px;right:12px;bottom:13px;color:#fff;opacity:0;transform:translateY(8px);transition:.45s}
  #s-marketing .clm-adcopy.show{opacity:1;transform:none}
  #s-marketing .clm-adcopy b{display:block;font-size:21px;line-height:1.02;letter-spacing:-.04em}
  #s-marketing .clm-adcopy small{display:block;margin-top:6px;color:rgba(255,255,255,.88);font:500 8px "Montserrat",sans-serif}
  #s-marketing .clm-igactions{display:flex;justify-content:space-between;padding:8px 11px 4px;font-size:13px}
  #s-marketing .clm-igtext{padding:0 11px 8px;color:#444e61;font:500 8px/1.45 "Montserrat",sans-serif}
  #s-marketing .clm-igtext b{color:#111827}
  #s-marketing .clm-primary{margin:0 10px 9px;border:0;border-radius:9px;padding:10px;background:linear-gradient(90deg,#0d99ed,#1777f2);color:#fff;font:800 9px "Montserrat",sans-serif;opacity:0;transform:translateY(6px);transition:.35s}
  #s-marketing .clm-primary.show{opacity:1;transform:none}

  /* Landing */
  #s-marketing .clm-web{background:#fff}
  #s-marketing .clm-browser{height:30px;display:flex;align-items:center;gap:5px;padding:0 9px;background:#f4f7fc;border-bottom:1px solid #e1e6f0}
  #s-marketing .clm-browser i{width:6px;height:6px;border-radius:50%;background:#cbd4e4}
  #s-marketing .clm-browser span{flex:1;margin-left:4px;padding:4px 8px;border-radius:999px;background:#fff;color:#7f8da4;font:600 7px "Montserrat",sans-serif}
  #s-marketing .clm-webnav{height:38px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;border-bottom:1px solid #edf0f5}
  #s-marketing .clm-webnav b{font-size:9px} #s-marketing .clm-webnav span{color:#748198;font:600 6px "Montserrat",sans-serif}
  #s-marketing .clm-webhero{min-height:164px;padding:17px 13px;background-size:cover;background-position:center;display:flex;flex-direction:column;justify-content:flex-end;color:#fff;position:relative}
  #s-marketing .clm-webhero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,43,125,.93),rgba(62,79,202,.42))}
  #s-marketing .clm-webhero>*{position:relative}
  #s-marketing .clm-webhero small{font:700 7px "Montserrat",sans-serif}
  #s-marketing .clm-webhero b{font-size:20px;line-height:1.02;letter-spacing:-.04em;margin:6px 0}
  #s-marketing .clm-webhero span{font:500 8px "Montserrat",sans-serif;color:rgba(255,255,255,.88)}
  #s-marketing .clm-webproof{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:8px 10px;background:#fafbfe;border-bottom:1px solid #edf0f5}
  #s-marketing .clm-webproof span{color:#56647d;font:600 7px "Montserrat",sans-serif}
  #s-marketing .clm-form{padding:10px 11px}
  #s-marketing .clm-formhead{display:flex;align-items:end;justify-content:space-between;margin-bottom:7px}
  #s-marketing .clm-formhead b{font-size:12px} #s-marketing .clm-formhead small{color:#8a95a8;font:500 6px "Montserrat",sans-serif}
  #s-marketing .clm-field{margin-bottom:6px;color:#44516b;font:700 7px "Montserrat",sans-serif}
  #s-marketing .clm-field span{display:block;min-height:28px;margin-top:3px;padding:7px 8px;border:1px solid #dce3ef;border-radius:8px;background:#fff;color:#29364d;font-weight:600;box-shadow:inset 0 0 0 1px rgba(54,104,238,0);transition:.25s}
  #s-marketing .clm-field span.typing{box-shadow:inset 0 0 0 1px rgba(54,104,238,.5)}
  #s-marketing .clm-cursor{display:inline-block;width:1px;height:11px;margin-left:2px;background:#316df1;vertical-align:-1px;animation:clmBlink .75s steps(1) infinite}
  #s-marketing .clm-form button{width:100%;border:0;border-radius:9px;padding:9px;background:linear-gradient(90deg,#1b72f2,#7155ef);color:#fff;font:800 8px "Montserrat",sans-serif;box-shadow:0 7px 16px rgba(76,81,220,.16);opacity:.38;transform:scale(.985);transition:.35s}
  #s-marketing .clm-form button.ready{opacity:1;transform:none}

  /* WhatsApp */
  #s-marketing .clm-wa{background:#efeae2}
  #s-marketing .clm-wahead{display:flex;align-items:center;gap:8px;padding:10px;background:#f0f2f5;border-bottom:1px solid #d9dee3}
  #s-marketing .clm-wa-back{font-size:19px;color:#54656f}
  #s-marketing .clm-wa-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#d9fdd3;color:#128c7e;font:800 9px "Montserrat",sans-serif}
  #s-marketing .clm-wahead b{display:block;font-size:11px} #s-marketing .clm-wahead small{display:block;color:#667781;font:500 8px "Montserrat",sans-serif}
  #s-marketing .clm-waicons{margin-left:auto;color:#54656f;font-size:12px}
  #s-marketing .clm-day{align-self:center;margin:9px 0 3px;padding:5px 9px;border-radius:6px;background:#fff;color:#667781;font:600 7px "Montserrat",sans-serif;box-shadow:0 1px 2px rgba(11,20,26,.08)}
  #s-marketing .clm-chat{flex:1;display:flex;flex-direction:column;gap:8px;padding:10px;background:radial-gradient(circle at 14px 14px,rgba(255,255,255,.32) 0 1px,transparent 1.5px) 0 0/22px 22px,#efeae2;overflow:hidden}
  #s-marketing .clm-msg{max-width:85%;padding:9px 10px;border-radius:9px;background:#fff;box-shadow:0 1px 2px rgba(11,20,26,.12);font:500 9px/1.45 "Montserrat",sans-serif;opacity:0;transform:translateY(8px) scale(.98);transition:.35s}
  #s-marketing .clm-msg.out{align-self:flex-end;background:#d9fdd3}
  #s-marketing .clm-msg.show{opacity:1;transform:none}
  #s-marketing .clm-msg time{display:block;text-align:right;margin-top:4px;color:#667781;font-size:6px}
  #s-marketing .clm-slots{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:8px;border-radius:10px;background:#fff;box-shadow:0 1px 2px rgba(11,20,26,.1);font:700 8px "Montserrat",sans-serif;opacity:0;transform:translateY(8px);transition:.35s}
  #s-marketing .clm-slots.show{opacity:1;transform:none}
  #s-marketing .clm-slots b{grid-column:1/-1}.clm-slots span{padding:7px 6px;text-align:center;border-radius:8px;background:#e7f7ef;color:#128c7e}
  #s-marketing .clm-wafoot{display:grid;grid-template-columns:auto 1fr auto;gap:7px;align-items:center;padding:8px 9px;background:#f0f2f5}
  #s-marketing .clm-wafoot b{padding:8px 10px;border-radius:999px;background:#fff;color:#7b8793;font:500 8px "Montserrat",sans-serif}
  #s-marketing .clm-wafoot i{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#25d366;color:#fff;font-style:normal}

  /* CRM */
  #s-marketing .clm-crm{background:#f6f8fc}
  #s-marketing .clm-crmbar{height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 11px;background:#111c35;color:#fff}
  #s-marketing .clm-crmbar b{font-size:10px} #s-marketing .clm-crmbar span{font-size:13px}
  #s-marketing .clm-contact{display:grid;grid-template-columns:auto 1fr auto;gap:9px;align-items:center;padding:11px;background:#fff;border-bottom:1px solid #e4e9f2;opacity:0;transform:translateY(-6px);transition:.35s}
  #s-marketing .clm-contact.show{opacity:1;transform:none}
  #s-marketing .clm-contact .clm-avatar{width:38px;height:38px}
  #s-marketing .clm-contact small{display:block;color:#6f7cef;font:700 6px "Montserrat",sans-serif} #s-marketing .clm-contact b{display:block;font-size:12px} #s-marketing .clm-contact span{display:block;color:#758198;font:500 7px "Montserrat",sans-serif}
  #s-marketing .clm-status{padding:6px 8px;border-radius:999px;background:#e7fff3;color:#11865d;font:800 7px "Montserrat",sans-serif}
  #s-marketing .clm-tags{display:flex;gap:6px;padding:8px 10px;background:#fff;opacity:0;transition:.35s}
  #s-marketing .clm-tags.show{opacity:1}
  #s-marketing .clm-tags span{padding:6px 7px;border-radius:999px;background:#edf3ff;color:#4d5ed1;font:700 6px "Montserrat",sans-serif}
  #s-marketing .clm-detail{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:9px 10px;opacity:0;transform:translateY(6px);transition:.35s}
  #s-marketing .clm-detail.show{opacity:1;transform:none}
  #s-marketing .clm-detail div{padding:9px;border:1px solid #e1e7f1;border-radius:10px;background:#fff}
  #s-marketing .clm-detail small{display:block;color:#8793a7;font:600 6px "Montserrat",sans-serif} #s-marketing .clm-detail b{display:block;margin-top:3px;font-size:8px}
  #s-marketing .clm-history-title{padding:3px 11px 5px;color:#35415b;font:800 8px "Montserrat",sans-serif}
  #s-marketing .clm-history{padding:5px 10px}
  #s-marketing .clm-history>div{position:relative;display:grid;grid-template-columns:29px 1fr;gap:8px;padding-bottom:11px;opacity:0;transform:translateY(6px);transition:.32s}
  #s-marketing .clm-history>div.show{opacity:1;transform:none}
  #s-marketing .clm-history>div:not(:last-child):before{content:"";position:absolute;left:13px;top:26px;bottom:-1px;width:2px;background:#dbe3f1}
  #s-marketing .clm-history i{width:29px;height:29px;border-radius:50%;display:grid;place-items:center;background:#edf2ff;color:#5663df;font-style:normal;font-size:8px}
  #s-marketing .clm-history .done i{background:linear-gradient(135deg,#1f73f1,#7155ef);color:#fff}
  #s-marketing .clm-history b{display:block;font-size:9px} #s-marketing .clm-history small{display:block;margin-top:2px;color:#768299;font:500 7px "Montserrat",sans-serif}

  #s-marketing .sv-flow li{cursor:pointer}
  @keyframes clmScene{from{opacity:0;transform:translateY(7px) scale(.992)}to{opacity:1;transform:none}}
  @keyframes clmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes clmBlink{0%,48%{opacity:1}49%,100%{opacity:0}}
  @media(max-width:620px){
    #s-marketing .clm-float{padding:6px 7px;font-size:6px}
    #s-marketing .clm-float i{width:19px;height:19px}
    #s-marketing .clm-float.meta{left:-12px} #s-marketing .clm-float.ig{right:-12px}
    #s-marketing .clm-float.tt{left:-10px} #s-marketing .clm-float.ga{right:-10px}
  }
</style>
`;

const runtimeData = JSON.stringify(nicheData);

export const marketingInteractions = `
<script id="marketing-phone-runtime-v13">
(function(){
  var DATA=${runtimeData};
  var sec=document.getElementById("s-marketing");
  if(!sec||sec.dataset.clmV13==="1")return;
  sec.dataset.clmV13="1";

  var oldScreen=document.getElementById("mk-screen");
  var oldNiches=document.getElementById("mk-niches");
  var oldSteps=document.getElementById("mk-steps");
  var oldRes=document.getElementById("mk-res");
  if(!oldScreen||!oldNiches||!oldSteps||!oldRes)return;

  function detachClone(el){var clone=el.cloneNode(true);el.parentNode.replaceChild(clone,el);return clone}
  var screen=detachClone(oldScreen),niches=detachClone(oldNiches),stepsWrap=detachClone(oldSteps),results=detachClone(oldRes);
  var steps=Array.from(stepsWrap.querySelectorAll("li"));
  var phone=screen.closest(".sv-phone");

  var cloud=document.createElement("div");
  cloud.className="clm-platform-cloud";
  cloud.innerHTML='<span class="clm-float meta"><i>∞</i>Meta Ads</span><span class="clm-float ig"><i>◎</i>Instagram</span><span class="clm-float tt"><i>♪</i>TikTok</span><span class="clm-float ga"><i>A</i>Google Ads</span>';
  phone.appendChild(cloud);

  niches.innerHTML=DATA.map(function(n,i){return '<button type="button" class="sv-niche" data-i="'+i+'">'+n.label+'</button>'}).join("");

  var nicheIndex=0,stepIndex=0,cycle=null,runId=0,subTimers=[];
  function fmt(n){return new Intl.NumberFormat("es-CO").format(n)}
  function stopSubs(){subTimers.forEach(clearTimeout);subTimers=[]}
  function later(ms,fn,id){var t=setTimeout(function(){if(id===runId)fn()},ms);subTimers.push(t)}
  function photoStyle(n){return 'background-image:url("'+String(n.image).replace(/"/g,"%22")+'")'}

  function igScene(n){
    return '<div class="clm-scene clm-ig">'+
      '<div class="clm-ig-nav"><b>Instagram</b><span>♡　⌁</span></div>'+
      '<div class="clm-stories" data-ig-stories><i></i><i></i><i></i><i></i><i></i></div>'+
      '<div class="clm-post" data-ig-post>'+
        '<div class="clm-posthead"><span class="clm-avatar">'+n.initials+'</span><div><b>'+n.account+'</b><small>Publicidad</small></div><span class="clm-more">•••</span></div>'+
        '<div class="clm-adphoto" style="'+photoStyle(n)+'"><span class="clm-adtag">'+n.adTag+'</span><div class="clm-adcopy" data-ig-copy><b>'+n.headline+'</b><small>'+n.sub+'</small></div></div>'+
        '<div class="clm-igactions"><span>♡　◯　⌁</span><span>Guardar</span></div>'+
        '<div class="clm-igtext"><b>'+n.account+'</b> '+n.sub+'.</div>'+
        '<button class="clm-primary" data-ig-cta data-next>'+n.adCta+'</button>'+
      '</div>'+
    '</div>';
  }

  function landingScene(n){
    return '<div class="clm-scene clm-web">'+
      '<div class="clm-browser"><i></i><i></i><i></i><span>'+n.url+'</span></div>'+
      '<div class="clm-webnav"><b>✦ '+n.brand+'</b><span>Servicios　Opiniones</span></div>'+
      '<div class="clm-webhero" style="'+photoStyle(n)+'"><small>'+n.landingKicker+'</small><b>'+n.landingHeadline+'</b><span>'+n.landingSub+'</span></div>'+
      '<div class="clm-webproof"><span>✓ Atención personalizada</span><span>✓ Respuesta rápida</span></div>'+
      '<div class="clm-form"><div class="clm-formhead"><b>Quiero avanzar</b><small>Déjanos tus datos</small></div>'+
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
        '<div class="done" data-crm-row="3"><i>✓</i><span><b>Cita agendada</b><small>'+n.slots[0]+'</small></span></div>'+
        '<div data-crm-row="4"><i>5</i><span><b>Seguimiento</b><small>Programado después de la cita</small></span></div>'+
      '</div>'+
    '</div>';
  }

  function renderResults(n){results.innerHTML='<div><small>Personas alcanzadas</small><b>'+fmt(n.metrics[0])+'</b></div><div><small>Clics al anuncio</small><b>'+fmt(n.metrics[1])+'</b></div><div><small>Citas agendadas</small><b>'+fmt(n.metrics[2])+'</b></div>'}

  function syncRight(){
    steps.forEach(function(li,i){li.classList.toggle("on",i===stepIndex);li.classList.toggle("done",i<stepIndex)});
    Array.from(niches.querySelectorAll(".sv-niche")).forEach(function(b,i){b.classList.toggle("on",i===nicheIndex)});
  }

  function typeInto(el,text,id,delay){
    later(delay,function(){
      el.classList.add("typing");
      var i=0;
      function tick(){
        if(id!==runId)return;
        el.innerHTML=text.slice(0,i)+'<i class="clm-cursor"></i>';
        i++;
        if(i<=text.length){var t=setTimeout(tick,28);subTimers.push(t)}
        else{el.textContent=text;el.classList.remove("typing")}
      }
      tick();
    },id);
  }

  function animateScene(id){
    if(stepIndex===0){
      var stories=screen.querySelector("[data-ig-stories]"),post=screen.querySelector("[data-ig-post]"),copy=screen.querySelector("[data-ig-copy]"),cta=screen.querySelector("[data-ig-cta]");
      later(180,function(){if(stories)stories.classList.add("show")},id);
      later(520,function(){if(post)post.classList.add("show")},id);
      later(1050,function(){if(copy)copy.classList.add("show")},id);
      later(1650,function(){if(cta)cta.classList.add("show")},id);
    }
    if(stepIndex===1){
      var fills=Array.from(screen.querySelectorAll("[data-fill]")),btn=screen.querySelector("[data-form-cta]");
      fills.forEach(function(el,i){typeInto(el,el.getAttribute("data-value")||"",id,450+i*700)});
      later(2850,function(){if(btn)btn.classList.add("ready")},id);
    }
    if(stepIndex===2){
      Array.from(screen.querySelectorAll("[data-wa]")).forEach(function(el,i){later(350+i*650,function(){el.classList.add("show")},id)});
    }
    if(stepIndex===3){
      var c=screen.querySelector("[data-crm-contact]"),tags=screen.querySelector("[data-crm-tags]"),detail=screen.querySelector("[data-crm-detail]");
      later(250,function(){if(c)c.classList.add("show")},id);
      later(650,function(){if(tags)tags.classList.add("show")},id);
      later(1000,function(){if(detail)detail.classList.add("show")},id);
      Array.from(screen.querySelectorAll("[data-crm-row]")).forEach(function(el,i){later(1350+i*420,function(){el.classList.add("show")},id)});
    }
  }

  function render(){
    stopSubs();
    var id=runId;
    var n=DATA[nicheIndex];
    var scene=[igScene,landingScene,waScene,crmScene][stepIndex](n);
    var labels=["Anuncio en Instagram","Landing del nicho con formulario","Conversación y agenda por WhatsApp","Contacto organizado en el CRM"];
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
      if(stepIndex>3){stepIndex=0;nicheIndex=(nicheIndex+1)%DATA.length}
      runId++;render();schedule();
    },5600);
  }
  function manualStep(i){stop();stepIndex=i;render();schedule()}
  function manualNiche(i){stop();nicheIndex=i;stepIndex=0;render();schedule()}

  niches.addEventListener("click",function(e){var b=e.target.closest(".sv-niche");if(!b)return;manualNiche(+b.dataset.i)});
  steps.forEach(function(li,i){li.addEventListener("click",function(){manualStep(i)})});

  runId=1;render();schedule();
})();
</script>
`;
