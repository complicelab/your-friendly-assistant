// preview-rebuild-v10
import { createFileRoute } from "@tanstack/react-router";
import { gunzipSync } from "node:zlib";
import { compareStyles, compareInteractions, replaceCompareScenes } from "@/data/compare/demos";
import { flowStyles, flowInteractions, replaceFlowScenes } from "@/data/flow/demos";
import { marketingStyles, marketingInteractions, replaceMarketingRuntime } from "@/data/marketing/demo";

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


type GoogleReviewItem = {
  author: string;
  authorUri: string;
  avatar: string;
  rating: number;
  relativeTime: string;
  text: string;
};

type GoogleReviewSnapshot = {
  rating: number;
  count: number;
  mapsUri: string;
  reviews: GoogleReviewItem[];
};

let googleReviewsCache: { expiresAt: number; value: GoogleReviewSnapshot | null } | null = null;

function serverEnv(name: string) {
  return typeof process !== "undefined" ? String(process.env[name] || "").trim() : "";
}

async function resolveGooglePlaceId(apiKey: string): Promise<string> {
  const configured = serverEnv("GOOGLE_PLACE_ID");
  if (configured) return configured;

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName",
      },
      body: JSON.stringify({
        textQuery: "Complice Lab, Manizales, Colombia",
        languageCode: "es",
        maxResultCount: 5,
        locationBias: {
          circle: {
            center: { latitude: 4.837385, longitude: -75.5908125 },
            radius: 5000,
          },
        },
      }),
    });

    if (!response.ok) {
      console.error("Google Places place-id lookup failed", response.status, (await response.text()).slice(0, 500));
      return "";
    }

    const payload = await response.json() as Record<string, any>;
    const candidates = Array.isArray(payload["places"]) ? payload["places"] : [];
    const exact = candidates.find((place: Record<string, any>) => {
      const name = String(place?.["displayName"]?.["text"] || "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
      return name === "complice lab";
    });
    return String((exact || candidates[0])?.["id"] || "");
  } catch (error) {
    console.error("Google Places place-id lookup error", error);
    return "";
  }
}

async function fetchGoogleReviewSnapshot(): Promise<GoogleReviewSnapshot | null> {
  const apiKey = serverEnv("GOOGLE_PLACES_API_KEY");
  if (!apiKey) return null;

  const placeId = await resolveGooglePlaceId(apiKey);
  if (!placeId) return null;

  const now = Date.now();
  if (googleReviewsCache && googleReviewsCache.expiresAt > now) return googleReviewsCache.value;

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri,reviews",
        },
      },
    );

    if (!response.ok) {
      console.error("Google Places reviews request failed", response.status, (await response.text()).slice(0, 500));
      googleReviewsCache = { expiresAt: now + 60 * 1000, value: null };
      return null;
    }

    const payload = await response.json() as Record<string, any>;
    const reviews = Array.isArray(payload["reviews"])
      ? payload["reviews"].map((review: Record<string, any>) => ({
          author: String(review?.["authorAttribution"]?.["displayName"] || "Cliente"),
          authorUri: String(review?.["authorAttribution"]?.["uri"] || ""),
          avatar: String(review?.["authorAttribution"]?.["photoUri"] || ""),
          rating: Number(review?.["rating"] || 0),
          relativeTime: String(review?.["relativePublishTimeDescription"] || ""),
          text: String(review?.["text"]?.["text"] || review?.["originalText"]?.["text"] || "").trim(),
        })).filter((review: GoogleReviewItem) => review.text && review.rating > 0)
      : [];

    const value: GoogleReviewSnapshot = {
      rating: Number(payload["rating"] || 0),
      count: Number(payload["userRatingCount"] || 0),
      mapsUri: String(payload["googleMapsUri"] || ""),
      reviews,
    };

    googleReviewsCache = { expiresAt: now + 6 * 60 * 60 * 1000, value };
    return value;
  } catch (error) {
    console.error("Google Places reviews request error", error);
    googleReviewsCache = { expiresAt: now + 60 * 1000, value: null };
    return null;
  }
}

function safeJsonForHtml(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

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
  .cl-hero-gradient-descender{
    padding-bottom:.20em !important;
  }
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


const HOMEPAGE_POSITIONING_STYLES = `
<style id="homepage-positioning-v11">
  .cl-scope-rail{display:flex;flex-wrap:wrap;gap:7px;margin-top:16px}
  .cl-scope-rail span{display:inline-flex;align-items:center;min-height:31px;padding:6px 10px;border:1px solid rgba(36,95,234,.16);border-radius:999px;background:rgba(36,95,234,.045);color:#334765;font:600 11px/1.25 "Montserrat",sans-serif}
  h1 .cl-hero-gradient,
  .cl-hero-gradient{
    display:inline-block!important;
    background-image:linear-gradient(90deg,#1f6fe8 0%,#6653e9 100%)!important;
    background-repeat:no-repeat!important;
    -webkit-background-clip:text!important;
    background-clip:text!important;
    -webkit-text-fill-color:transparent!important;
    color:transparent!important;
  }
  @media(max-width:700px){
    .cl-scope-rail{gap:6px}
    .cl-scope-rail span{font-size:10px}
  }
</style>
`


const HOMEPAGE_GOOGLE_REVIEWS_STYLES = `
<style id="homepage-google-reviews-v1">
  .cl-google-proof{
    display:inline-flex;align-items:center;gap:10px;margin-top:18px;padding:9px 13px;
    border:1px solid rgba(36,95,234,.14);border-radius:999px;background:rgba(255,255,255,.82);
    box-shadow:0 10px 28px rgba(26,52,96,.07);text-decoration:none!important;color:#17233b!important;
    backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
    font:600 12px/1.2 "Montserrat",sans-serif
  }
  .cl-google-proof:hover{border-color:rgba(36,95,234,.30);transform:translateY(-1px)}
  .cl-google-proof-g{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#fff;border:1px solid #e8edf6;font-weight:800;color:#245fea}
  .cl-google-proof-stars{color:#f4a000;letter-spacing:.02em}
  .cl-google-proof small{display:block;margin-top:2px;color:#6b7890;font:500 10px/1.2 "Montserrat",sans-serif}

  .cl-google-reviews{position:relative;padding:54px 0 60px;background:#fff;overflow:hidden;border-top:1px solid rgba(27,50,91,.05);border-bottom:1px solid rgba(27,50,91,.05)}
  .cl-google-reviews:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 78% 18%,rgba(74,104,255,.08),transparent 31%);pointer-events:none}
  .cl-google-reviews-inner{position:relative;width:min(1120px,calc(100% - 48px));margin:0 auto}
  .cl-google-reviews-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:30px;align-items:end;margin-bottom:34px}
  .cl-google-reviews-kicker{display:block;margin-bottom:12px;color:#245fea;font:700 11px/1 "Montserrat",sans-serif;letter-spacing:.16em;text-transform:uppercase}
  .cl-google-reviews h2{margin:0;max-width:790px;color:#0d1525;font:700 clamp(30px,3.6vw,50px)/1.03 "Montserrat",sans-serif;letter-spacing:-.04em}
  .cl-google-reviews h2 span{background:linear-gradient(90deg,#2269e8 0%,#6653e9 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
  .cl-google-score{min-width:210px;padding:18px 20px;border:1px solid #e6ebf4;border-radius:22px;background:rgba(255,255,255,.88);box-shadow:0 16px 42px rgba(27,50,91,.08)}
  .cl-google-score-label{display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#53627c;font:600 11px/1.2 "Montserrat",sans-serif}
  .cl-google-score-label b{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#fff;border:1px solid #e8edf6;color:#245fea;font-size:13px}
  .cl-google-score-main{display:flex;align-items:center;gap:10px}
  .cl-google-score-main strong{color:#101827;font:750 34px/1 "Montserrat",sans-serif}
  .cl-google-score-stars{color:#f4a000;font-size:17px;letter-spacing:.02em}
  .cl-google-score-count{margin-top:5px;color:#7a879d;font:500 11px/1.3 "Montserrat",sans-serif}
  .cl-google-review-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
  .cl-google-review-card{min-height:210px;padding:20px;border:1px solid #e7ecf5;border-radius:20px;background:#fff;box-shadow:0 12px 32px rgba(21,41,78,.05)}
  .cl-google-review-author{display:flex;align-items:center;gap:12px;margin-bottom:14px;text-decoration:none!important}
  .cl-google-review-avatar{display:grid;place-items:center;width:42px;height:42px;flex:0 0 42px;border-radius:50%;overflow:hidden;background:#eef3ff;color:#245fea;font:700 14px/1 "Montserrat",sans-serif}
  .cl-google-review-avatar img{width:100%;height:100%;object-fit:cover}
  .cl-google-review-name{display:block;color:#172036;font:700 13px/1.25 "Montserrat",sans-serif}
  .cl-google-review-time{display:block;margin-top:3px;color:#8a95a8;font:500 10px/1.2 "Montserrat",sans-serif}
  .cl-google-review-stars{margin-bottom:13px;color:#f4a000;font-size:15px;letter-spacing:.03em}
  .cl-google-review-text{margin:0;color:#526078;font:500 13px/1.7 "Montserrat",sans-serif}
  .cl-google-reviews-foot{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:26px}
  .cl-google-reviews-note{color:#8994a6;font:500 10px/1.4 "Montserrat",sans-serif}
  .cl-google-reviews-link{display:inline-flex;align-items:center;gap:8px;padding:11px 15px;border:1px solid rgba(36,95,234,.18);border-radius:999px;color:#245fea!important;text-decoration:none!important;font:650 11px/1 "Montserrat",sans-serif}
  .cl-google-reviews-link:hover{background:#f6f8ff}
  @media(max-width:800px){
    .cl-google-reviews{padding:68px 0 72px}
    .cl-google-reviews-inner{width:min(100% - 28px,1120px)}
    .cl-google-reviews-top{grid-template-columns:1fr;align-items:start}
    .cl-google-score{min-width:0;width:min(100%,270px)}
    .cl-google-review-card{min-height:auto}
    .cl-google-reviews-foot{align-items:flex-start;flex-direction:column}
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
    var heroH1=document.querySelector("main h1")||document.querySelector("h1");
    if(heroH1){
      heroH1.innerHTML='Especialistas en <span class="cl-hero-gradient">sistemas con IA,</span> páginas web y <span class="cl-hero-gradient cl-hero-gradient-descender">publicidad digital</span>';
    }

    var heroParagraph=heroH1 && (heroH1.parentElement||document).querySelector("p");
    if(heroParagraph){
      heroParagraph.textContent="Construimos sistemas a la medida, agentes de IA, páginas web y campañas de publicidad para atraer, atender y gestionar oportunidades.";
    }

    patchHeading("Míralo funcionar","Así","trabajamos.");
    patchHeading("Sistemas con IA a la medida","Creamos sistemas con IA","a la medida");
    patchHeading("Agentes de IA automatizados","Creamos agentes de IA","automatizados");
    patchHeading("Páginas web y publicidad en redes sociales","Creamos páginas web y publicidad","en redes sociales");

    patchParagraph(
      "Tres servicios, tres demostraciones",
      "Tres servicios, tres demostraciones que muestran cómo captamos, atendemos y convertimos contactos en oportunidades reales. Si quieres, toca cualquier paso."
    );
    patchParagraph(
      "Que ningún contacto se pierda",
      "Construimos lo que tu negocio necesita: desde una página web o un sistema administrativo hasta CRM, agendamiento, automatizaciones, agentes de IA, paneles e indicadores, todo conectado según el proyecto."
    );
    patchParagraph(
      "Que nadie se quede sin respuesta",
      "Responden, filtran, agendan y hacen seguimiento incluso cuando tú no estás, para que tu equipo atienda a quienes realmente están listos para avanzar."
    );
    patchParagraph(
      "Que más personas te encuentren",
      "Creamos páginas web y campañas pagas en redes sociales para atraer personas interesadas y llevarlas a una acción clara. Puedes contratar cada servicio por separado o conectarlos dentro de un sistema más completo."
    );
    patchParagraph(
      "Déjanos tus datos y seguimos por WhatsApp",
      "Déjanos tus datos, elige fecha y hora y agenda tu diagnóstico. También puedes usar cualquier botón de Agendar diagnóstico para abrir la agenda rápida."
    );
    var serviceHeadings=Array.from(document.querySelectorAll(".svc h3,h2,h3"));
    var systemsHeading=serviceHeadings.find(function(el){ return normalized(el).indexOf("Creamos sistemas con IA")!==-1; });
    var systemsBox=systemsHeading ? (systemsHeading.closest(".svc") || systemsHeading.parentElement) : null;
    if(systemsBox && !systemsBox.querySelector(".cl-scope-rail")){
      var systemsRail=document.createElement("div");
      systemsRail.className="cl-scope-rail";
      systemsRail.setAttribute("aria-label","Ejemplos de componentes de un sistema con IA a la medida");
      systemsRail.innerHTML="<span>Página o portal</span><span>Sistema administrativo</span><span>CRM y agenda</span><span>Agentes de IA</span><span>Paneles e indicadores</span>";
      var systemsText=systemsBox.querySelector("p");
      (systemsText||systemsHeading).insertAdjacentElement("afterend",systemsRail);
    }

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


const HOMEPAGE_GOOGLE_REVIEWS_RUNTIME = `
<script id="homepage-google-reviews-runtime-v1">
(function(){
  var REVIEWS_ENABLED=false;
  if(!REVIEWS_ENABLED) return;
  var data=__CL_GOOGLE_REVIEWS_PAYLOAD__;
  if(!data || !Array.isArray(data.reviews) || data.reviews.length===0){
    data={
      rating:5,
      count:2,
      mapsUri:"https://www.google.com/maps/place/Complice+Lab/@4.8373049,-75.9211506,10z/data=!3m1!4b1!4m6!3m5!1s0x995f3135fcb395b:0x60ec8b8cfb72027b!8m2!3d4.837385!4d-75.5908125!16s%2Fg%2F11z_8qcm6s",
      reviews:[]
    };
  }

  function text(el,value){el.textContent=value==null?"":String(value);return el}
  function starString(rating){
    var full=Math.max(1,Math.min(5,Math.round(Number(rating)||0)));
    return "★".repeat(full)+"☆".repeat(5-full);
  }
  function initials(name){
    return String(name||"C").trim().split(/\\s+/).slice(0,2).map(function(x){return x.charAt(0).toUpperCase()}).join("");
  }

  function mount(){
    if(document.querySelector(".cl-google-reviews")) return;

    var heroH1=document.querySelector("main h1")||document.querySelector("h1");
    var heroCopy=heroH1 && heroH1.parentElement;
    var heroParagraph=heroCopy && heroCopy.querySelector("p");
    if(heroCopy && heroParagraph && !heroCopy.querySelector(".cl-google-proof")){
      var badge=document.createElement(data.mapsUri?"a":"div");
      badge.className="cl-google-proof";
      if(data.mapsUri){
        badge.href=data.mapsUri;badge.target="_blank";badge.rel="noopener noreferrer";
        badge.setAttribute("aria-label","Ver opiniones de Cómplice Lab en Google");
      }
      var g=document.createElement("span");g.className="cl-google-proof-g";g.textContent="G";
      var wrap=document.createElement("span");
      var main=document.createElement("span");
      var rating=Number(data.rating||0).toLocaleString("es-CO",{minimumFractionDigits:1,maximumFractionDigits:1});
      main.innerHTML='<span class="cl-google-proof-stars">★</span> <strong>'+rating+'</strong> en Google';
      var small=document.createElement("small");
      small.textContent=(Number(data.count||0))+" "+(Number(data.count||0)===1?"opinión real":"opiniones reales");
      wrap.appendChild(main);wrap.appendChild(small);badge.appendChild(g);badge.appendChild(wrap);
      heroParagraph.insertAdjacentElement("afterend",badge);
    }

    var section=document.createElement("section");section.className="cl-google-reviews";section.setAttribute("aria-label","Opiniones reales de Cómplice Lab en Google");
    var inner=document.createElement("div");inner.className="cl-google-reviews-inner";
    var top=document.createElement("div");top.className="cl-google-reviews-top";
    var heading=document.createElement("div");
    var kicker=document.createElement("span");kicker.className="cl-google-reviews-kicker";kicker.textContent="Opiniones en Google";
    var h2=document.createElement("h2");h2.innerHTML='Confianza que también puedes <span>comprobar en Google.</span>';
    heading.appendChild(kicker);heading.appendChild(h2);

    var score=document.createElement("div");score.className="cl-google-score";
    var scoreLabel=document.createElement("div");scoreLabel.className="cl-google-score-label";scoreLabel.innerHTML="<b>G</b><span>Experiencias en Google</span>";
    var scoreMain=document.createElement("div");scoreMain.className="cl-google-score-main";
    var scoreNumber=document.createElement("strong");scoreNumber.textContent=Number(data.rating||0).toLocaleString("es-CO",{minimumFractionDigits:1,maximumFractionDigits:1});
    var scoreStars=document.createElement("span");scoreStars.className="cl-google-score-stars";scoreStars.textContent=starString(data.rating);
    scoreMain.appendChild(scoreNumber);scoreMain.appendChild(scoreStars);
    var count=document.createElement("div");count.className="cl-google-score-count";count.textContent=(Number(data.count||0))+" opiniones en el perfil de Google";
    score.appendChild(scoreLabel);score.appendChild(scoreMain);score.appendChild(count);
    top.appendChild(heading);top.appendChild(score);inner.appendChild(top);

    var grid=document.createElement("div");grid.className="cl-google-review-grid";
    data.reviews.slice(0,5).forEach(function(review){
      var card=document.createElement("article");card.className="cl-google-review-card";
      var author=document.createElement(review.authorUri?"a":"div");author.className="cl-google-review-author";
      if(review.authorUri){author.href=review.authorUri;author.target="_blank";author.rel="noopener noreferrer";}
      var avatar=document.createElement("span");avatar.className="cl-google-review-avatar";
      if(review.avatar){
        var img=document.createElement("img");img.src=review.avatar;img.alt="";img.loading="lazy";img.referrerPolicy="no-referrer";avatar.appendChild(img);
      }else{avatar.textContent=initials(review.author);}
      var authorMeta=document.createElement("span");
      var name=document.createElement("span");name.className="cl-google-review-name";name.textContent=review.author||"Cliente";
      var time=document.createElement("span");time.className="cl-google-review-time";time.textContent=review.relativeTime||"Opinión en Google";
      authorMeta.appendChild(name);authorMeta.appendChild(time);author.appendChild(avatar);author.appendChild(authorMeta);
      var stars=document.createElement("div");stars.className="cl-google-review-stars";stars.setAttribute("aria-label",(review.rating||0)+" de 5 estrellas");stars.textContent=starString(review.rating);
      var p=document.createElement("p");p.className="cl-google-review-text";p.textContent=review.text;
      card.appendChild(author);card.appendChild(stars);card.appendChild(p);grid.appendChild(card);
    });
    if(data.reviews.length){
      inner.appendChild(grid);
    } else {
      var trust=document.createElement("div");
      trust.className="cl-google-review-card";
      trust.style.minHeight="0";
      trust.innerHTML='<div class="cl-google-review-stars" aria-label="5 de 5 estrellas">★★★★★</div><p class="cl-google-review-text">Cómplice Lab tiene actualmente 2 opiniones públicas en Google con una calificación de 5,0. Puedes verificarlas directamente en el perfil.</p>';
      inner.appendChild(trust);
    }

    var foot=document.createElement("div");foot.className="cl-google-reviews-foot";
    var note=document.createElement("span");note.className="cl-google-reviews-note";note.textContent="Opiniones mostradas desde el perfil de Cómplice Lab en Google. El contenido pertenece a sus autores.";
    foot.appendChild(note);
    if(data.mapsUri){
      var link=document.createElement("a");link.className="cl-google-reviews-link";link.href=data.mapsUri;link.target="_blank";link.rel="noopener noreferrer";link.textContent="Ver todas en Google ↗";foot.appendChild(link);
    }
    inner.appendChild(foot);section.appendChild(inner);

    var contactHeading=Array.from(document.querySelectorAll("h1,h2,h3")).find(function(el){
      var value=(el.textContent||"").replace(/\\s+/g," ").trim().toLowerCase();
      return value.indexOf("hablemos de")!==-1 && value.indexOf("negocio")!==-1;
    });
    var contactSection=contactHeading && (contactHeading.closest("section")||contactHeading.parentElement);
    var mainEl=document.querySelector("main");
    if(contactSection && contactSection.parentElement) contactSection.parentElement.insertBefore(section,contactSection);
    else if(mainEl) mainEl.appendChild(section);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);
  else mount();
  setTimeout(mount,350);
})();
</script>
`

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
  .cl-booking-overlay{position:fixed;inset:0;width:100%;height:var(--cl-booking-vh,100dvh);max-height:var(--cl-booking-vh,100dvh);z-index:2147483000;display:none;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;pointer-events:auto;background:rgba(11,18,32,.64);padding:max(18px,env(safe-area-inset-top)) 16px max(28px,env(safe-area-inset-bottom))}
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
  .cl-booking-success p{margin:0 auto;max-width:560px;font:500 13px/1.6 "Montserrat",sans-serif;color:#66758f}\n  .cl-booking-mobile-next,.cl-booking-mobile-back{display:none}
  .cl-contact-booking{grid-column:1/-1;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;width:100%;max-width:100%;min-width:0;margin:18px 0 14px;padding:18px;border:1px solid #dfe6f0;border-radius:18px;background:#f8faff;box-sizing:border-box;visibility:visible!important;opacity:1!important;position:relative!important;height:auto!important;max-height:none!important;overflow:visible!important}
  .cl-contact-booking,.cl-contact-booking *{box-sizing:border-box}
  .cl-contact-booking-head{grid-column:1/-1;margin:0 0 2px}
  .cl-contact-booking-head strong{display:block;font:700 15px/1.25 "Poppins",sans-serif;color:#0d172a}
  .cl-contact-booking-head span{display:block;margin-top:4px;font:500 11px/1.45 "Montserrat",sans-serif;color:#71809b}
  .cl-contact-booking label{display:grid;grid-template-columns:minmax(0,1fr);gap:7px;min-width:0}
  .cl-contact-booking label>span{font:700 12px/1.25 "Montserrat",sans-serif;color:#111827}
  .cl-contact-booking input,.cl-contact-booking select{display:block;width:100%;max-width:100%;min-width:0;height:48px;border:1px solid #d9e0ea;border-radius:14px;background:#fff;color:#17233a;padding:0 13px;font:500 13px/1 "Montserrat",sans-serif;outline:none}
  .cl-contact-booking input:focus,.cl-contact-booking select:focus{border-color:#4d6ff0;box-shadow:0 0 0 3px rgba(77,111,240,.10)}
  .cl-contact-booking select:disabled{background:#f7f9fc;color:#8a96aa}
  .cl-contact-booking-note{grid-column:1/-1;margin:0;font:500 11px/1.45 "Montserrat",sans-serif;color:#71809b}
  .cl-contact-booking-note.is-error{color:#b4233b}
  #cl-booking-overlay .cl-contact-booking,
  #modal .cl-contact-booking,
  #m-overlay .cl-contact-booking,
  #m-content .cl-contact-booking,
  [role="dialog"] .cl-contact-booking{display:none!important}
  @media(max-width:700px){
    body.cl-booking-modal-open{overflow:hidden!important;touch-action:auto!important}
    a.cl-booking-cta-label,button.cl-booking-cta-label{max-width:100%;white-space:normal}
    .cl-contact-booking{grid-template-columns:minmax(0,1fr);gap:10px;margin:16px 0 14px;padding:14px;border-radius:16px}
    .cl-contact-booking input,.cl-contact-booking select{height:46px;font-size:16px}
    .cl-contact-date{-webkit-appearance:none;appearance:none;text-align:center}
    .cl-contact-date::-webkit-date-and-time-value{text-align:center;min-width:0}
    #m-content .ag{max-width:100%!important;overflow:hidden}
    #m-content .ag-pick,#m-content .ag-form{min-width:0!important}
    .cl-booking-overlay{
      top:0!important;right:0!important;bottom:0!important;left:0!important;
      width:100%!important;height:100dvh!important;max-height:100dvh!important;
      padding:0!important;background:#fff!important;overflow:hidden!important;
      overscroll-behavior:none!important;touch-action:pan-y!important
    }
    .cl-booking-panel{
      position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:100%!important;min-height:0!important;
      margin:0!important;border-radius:0!important;box-shadow:none!important;background:#fff!important;
      overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;
      overscroll-behavior-y:contain!important;touch-action:pan-y!important;scroll-behavior:auto!important
    }
    .cl-booking-modal-head{top:0;padding:16px 16px 14px;border-radius:0}
    .cl-booking-modal-head h2{font-size:22px}
    .cl-booking-modal-body{padding:0 0 max(24px,env(safe-area-inset-bottom))}
    .cl-booking-modal-grid{display:block!important}
    .cl-booking-box{padding:20px 18px 24px;border:0!important;border-radius:0!important;background:#fff!important}
    .cl-booking-box[data-cl-step="data"]{display:none}
    .cl-booking-overlay.cl-mobile-step-data .cl-booking-box[data-cl-step="schedule"]{display:none}
    .cl-booking-overlay.cl-mobile-step-data .cl-booking-box[data-cl-step="data"]{display:block}
    .cl-booking-form{grid-template-columns:minmax(0,1fr);gap:14px}
    .cl-booking-form label,.cl-booking-form label.full,.cl-booking-consent,.cl-booking-submit,.cl-booking-error{grid-column:1/-1}
    .cl-booking-phone{grid-template-columns:98px minmax(0,1fr)}
    .cl-booking-form input,.cl-booking-form select{height:52px;font-size:16px}
    .cl-booking-times{grid-template-columns:repeat(2,minmax(0,1fr))}
    .cl-booking-mobile-next{display:block;width:100%;height:52px;margin-top:18px;border:0;border-radius:999px;background:linear-gradient(90deg,#1f6fe8,#6653e9);color:#fff;font:700 14px/1 "Montserrat",sans-serif}
    .cl-booking-mobile-next:disabled{opacity:.45}
    .cl-booking-mobile-back{display:inline-flex;align-items:center;gap:6px;margin:0 0 16px;padding:0;border:0;background:transparent;color:#245fea;font:700 13px/1.2 "Montserrat",sans-serif}
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
  function isBookingActionText(value){
    var t=String(value||"").toLowerCase().replace(/diagnostico/g,"diagnóstico");
    return t.indexOf("agendar diagnóstico")!==-1 ||
      t.indexOf("agendar videollamada")!==-1 ||
      t.indexOf("solicitar videollamada")!==-1 ||
      t.indexOf("continuar por whatsapp")!==-1 ||
      t.indexOf("hablar por whatsapp")!==-1;
  }
  function isInsideModal(el){return !!(el&&el.closest&&el.closest("#cl-booking-overlay,#modal,#m-overlay,#m-content"));}
  function dateKey(value){
    var parts=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"America/Bogota"}).formatToParts(new Date(value));
    var map={};parts.forEach(function(p){map[p.type]=p.value;});return map.year+"-"+map.month+"-"+map.day;
  }
  function longDate(value){return new Intl.DateTimeFormat("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(value));}
  function timeLabel(value){return new Intl.DateTimeFormat("es-CO",{hour:"numeric",minute:"2-digit",hour12:true,timeZone:"America/Bogota"}).format(new Date(value));}

  function findContactRoot(){
    var nameInput=document.querySelector('input[name="nombre"]');
    var brandInput=document.querySelector('input[name="marca"]');
    var phoneInput=document.querySelector('input[name="whatsapp"]');
    var emailInput=document.querySelector('input[name="email"]');
    var consentInput=document.querySelector('input[name="consent"]');
    if(!nameInput||!brandInput||!phoneInput||!emailInput||!consentInput)return null;

    var node=consentInput.parentElement;
    while(node&&node!==document.body){
      if(node.contains(nameInput)&&node.contains(brandInput)&&node.contains(phoneInput)&&node.contains(emailInput)){
        var hasService=node.querySelector('input[name="servicio"]');
        var hasAction=Array.from(node.querySelectorAll("a,button")).some(function(action){
          return isBookingActionText(norm(action));
        });
        if(hasService&&hasAction)return node;
      }
      node=node.parentElement;
    }
    return null;
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
    var phrases=["sistemas con ia","agentes de ia","pagina web","paginas web","publicidad digital","publicidad en redes","marketing digital","quiero un diagnóstico","quiero un diagnostico"];
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
    if(!root)return;
    inline.root=root;

    var consent=Array.from(root.querySelectorAll('input[type="checkbox"]')).find(function(input){
      var label=input.closest("label")||input.parentElement;
      return label&&norm(label).toLowerCase().indexOf("autorizo")!==-1;
    });

    var submit=Array.from(root.querySelectorAll("button,a")).find(function(el){
      return isBookingActionText(norm(el));
    });
    if(submit&&submit.dataset.clCleanBookingAction!=="1"){
      var clean=submit.cloneNode(true);
      clean.dataset.clCleanBookingAction="1";
      clean.textContent="Agendar diagnóstico";
      clean.classList.add("cl-booking-cta-label");
      clean.removeAttribute("href");
      clean.removeAttribute("target");
      clean.removeAttribute("onclick");
      if(clean.tagName==="BUTTON")clean.setAttribute("type","button");
      submit.parentElement.replaceChild(clean,submit);
      submit=clean;
      submit.addEventListener("click",function(event){
        event.preventDefault();
        event.stopPropagation();
        if(event.stopImmediatePropagation)event.stopImmediatePropagation();
        submitInline(root,submit);
      },true);
    }else if(submit){
      submit.textContent="Agendar diagnóstico";
      if(submit.tagName==="BUTTON")submit.setAttribute("type","button");
    }

    var box=root.querySelector(".cl-contact-booking");
    if(!box){
      var anchor=consent?(consent.closest("label")||consent.parentElement):submit;
      var rootAnchor=directChildUnder(anchor,root)||directChildUnder(submit,root);
      box=document.createElement("div");
      box.className="cl-contact-booking";
      box.setAttribute("data-cl-inline-booking","1");
      box.innerHTML='<div class="cl-contact-booking-head"><strong>Elige fecha y hora para tu videollamada</strong><span>Selecciona un horario disponible. Todos los horarios son hora de Colombia.</span></div><label><span>Fecha preferida</span><input class="cl-contact-date" type="date" aria-label="Fecha preferida"></label><label><span>Hora disponible</span><select class="cl-contact-time" aria-label="Hora disponible" disabled><option value="">Selecciona primero una fecha</option></select></label><p class="cl-contact-booking-note">Consultando disponibilidad…</p>';
      if(rootAnchor&&rootAnchor.parentElement===root){
        root.insertBefore(box,rootAnchor);
      }else if(anchor&&anchor.parentElement){
        anchor.parentElement.insertBefore(box,anchor);
      }else{
        root.appendChild(box);
      }
    }

    root.dataset.clScheduler="1";
    var dateInput=box.querySelector(".cl-contact-date");
    var timeSelect=box.querySelector(".cl-contact-time");
    if(!dateInput||!timeSelect)return;

    if(box.dataset.clBound!=="1"){
      box.dataset.clBound="1";
      dateInput.addEventListener("change",function(){
        setTimes(root,dateInput.value);
        var note=root.querySelector(".cl-contact-booking-note");
        if(note){
          note.textContent=dateInput.value?"Selecciona una hora disponible. Hora de Colombia.":"Selecciona una fecha para ver las horas disponibles.";
          note.classList.remove("is-error");
        }
      });
      timeSelect.addEventListener("change",function(){
        inline.slot=timeSelect.value||"";
        var note=root.querySelector(".cl-contact-booking-note");
        if(note&&inline.slot){
          note.textContent="Horario seleccionado: "+longDate(inline.slot)+" · hora de Colombia.";
          note.classList.remove("is-error");
        }
      });
    }

    if(root.tagName==="FORM"&&root.dataset.clSubmitBound!=="1"){
      root.dataset.clSubmitBound="1";
      root.addEventListener("submit",function(event){
        event.preventDefault();
        event.stopPropagation();
        if(event.stopImmediatePropagation)event.stopImmediatePropagation();
        var action=Array.from(root.querySelectorAll("button,a")).find(function(el){
          return isBookingActionText(norm(el));
        });
        if(action)submitInline(root,action);
      },true);
      root.removeAttribute("action");
      root.removeAttribute("onsubmit");
    }

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
    overlay.innerHTML='<div class="cl-booking-panel"><div class="cl-booking-modal-head"><div><h2 id="cl-booking-title">Agenda tu diagnóstico</h2><p>Elige un horario y completa tus datos. La cita queda registrada en nuestro CRM.</p></div><button type="button" class="cl-booking-close" aria-label="Cerrar">×</button></div><div class="cl-booking-modal-body"><div class="cl-booking-modal-grid"><section class="cl-booking-box" data-cl-step="schedule"><h3>1. Elige fecha y hora</h3><p>Todos los horarios se muestran en hora de Colombia.</p><div class="cl-booking-days"><span class="cl-booking-loading">Elige tu horario</span></div><div class="cl-booking-times"></div><p class="cl-booking-summary">Selecciona un día y una hora.</p><button type="button" class="cl-booking-mobile-next" disabled>Continuar con mis datos</button></section><section class="cl-booking-box" data-cl-step="data"><button type="button" class="cl-booking-mobile-back">← Cambiar horario</button><h3>2. Tus datos</h3><p>Los usamos únicamente para gestionar tu diagnóstico.</p><form class="cl-booking-form" novalidate><label><span>Nombre y apellido</span><input name="full_name" autocomplete="name" required></label><label><span>Marca personal o empresa</span><input name="brand_name" autocomplete="organization"></label><label class="full"><span>WhatsApp</span><span class="cl-booking-phone"><select name="country_code" aria-label="Indicativo"><option value="+57">🇨🇴 +57</option></select><input name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" required></span></label><label class="full"><span>Correo</span><input name="email" type="email" inputmode="email" autocomplete="email" required></label><label class="full"><span>¿Qué servicio te interesa?</span><select name="solution_interest" required><option value="">Selecciona una opción</option><option value="Sistemas con IA a la medida">Sistemas con IA a la medida</option><option value="Agentes de IA automatizados">Agentes de IA automatizados</option><option value="Páginas Web">Páginas Web</option><option value="Publicidad Digital">Publicidad Digital</option><option value="Diagnóstico general">Aún no lo sé, quiero orientación</option></select></label><label class="cl-booking-consent"><input name="consent" type="checkbox" required><span>Autorizo el uso de mis datos para gestionar esta solicitud y contactarme sobre el diagnóstico.</span></label><p class="cl-booking-error" role="alert"></p><button class="cl-booking-submit" type="submit">Agendar diagnóstico</button></form></section></div></div></div>';
    document.body.appendChild(overlay);
    overlay.querySelectorAll(".cl-contact-booking").forEach(function(node){node.remove();});
    overlay.querySelector(".cl-booking-close").addEventListener("click",closeBookingModal);
    overlay.addEventListener("click",function(event){if(event.target===overlay)closeBookingModal();});
    var bookingForm=overlay.querySelector(".cl-booking-form");
    var mobileNext=overlay.querySelector(".cl-booking-mobile-next");
    var mobileBack=overlay.querySelector(".cl-booking-mobile-back");
    mobileNext.addEventListener("click",function(){
      if(!modalState.slot)return;
      overlay.classList.add("cl-mobile-step-data");
      var scroller=bookingScrollContainer();
      if(scroller)scroller.scrollTop=0;
    });
    mobileBack.addEventListener("click",function(){
      if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
      overlay.classList.remove("cl-mobile-step-data");
      var scroller=bookingScrollContainer();
      if(scroller)scroller.scrollTop=0;
    });
    bookingForm.addEventListener("submit",submitModalBooking);
    bookingForm.addEventListener("focusin",function(){
      syncBookingViewport();
      requestAnimationFrame(keepFocusedBookingFieldVisible);
      setTimeout(function(){
        syncBookingViewport();
        keepFocusedBookingFieldVisible();
      },120);
      setTimeout(function(){
        syncBookingViewport();
        keepFocusedBookingFieldVisible();
      },360);
    });
    return overlay;
  }

  function closeBookingModal(){
    var overlay=document.getElementById("cl-booking-overlay");
    if(!overlay)return;
    overlay.classList.remove("is-open","cl-mobile-step-data");
    document.body.classList.remove("cl-booking-modal-open");
    unlockBookingPage();
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
        var next=overlay.querySelector(".cl-booking-mobile-next");
        if(next)next.disabled=!modalState.slot;
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

  function syncBookingViewport(){
    var vv=window.visualViewport;
    var h=vv&&vv.height?vv.height:window.innerHeight;
    if(h)document.documentElement.style.setProperty("--cl-booking-vh",Math.max(320,Math.round(h))+"px");
  }

  function bookingScrollContainer(){
    var overlay=document.getElementById("cl-booking-overlay");
    if(!overlay)return null;
    return window.matchMedia&&window.matchMedia("(max-width:700px)").matches
      ? overlay.querySelector(".cl-booking-panel")
      : overlay;
  }

  function keepFocusedBookingFieldVisible(){
    var overlay=document.getElementById("cl-booking-overlay");
    if(!overlay||!overlay.classList.contains("is-open"))return;
    var active=document.activeElement;
    if(!active||!overlay.contains(active))return;
    var scroller=bookingScrollContainer();
    if(!scroller)return;
    var rect=active.getBoundingClientRect();
    var bounds=scroller.getBoundingClientRect();
    var safeTop=bounds.top+88;
    var safeBottom=bounds.bottom-24;
    if(rect.bottom>safeBottom){
      scroller.scrollTop+=Math.ceil(rect.bottom-safeBottom+20);
    }else if(rect.top<safeTop){
      scroller.scrollTop-=Math.ceil(safeTop-rect.top+16);
    }
  }

  var bookingPageScrollY=0;
  function lockBookingPage(){
    bookingPageScrollY=window.scrollY||window.pageYOffset||0;
    document.documentElement.style.setProperty("overflow","hidden");
    document.body.style.setProperty("overflow","hidden");
    document.body.style.setProperty("overscroll-behavior","none");
  }

  function unlockBookingPage(){
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("overscroll-behavior");
    window.scrollTo(0,bookingPageScrollY||0);
  }

  function clearLegacyBookingShell(){
    Array.from(document.querySelectorAll("#modal,#m-overlay,.m-overlay,.modal-overlay,.modal")).forEach(function(node){
      if(node.id==="cl-booking-overlay"||node.closest&&node.closest("#cl-booking-overlay"))return;
      node.querySelectorAll(".cl-contact-booking").forEach(function(extra){extra.remove();});
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
    syncBookingViewport();
    var overlay=ensureBookingModal();
    if(availabilityCache.slots.length){
      applyModalAvailability(availabilityCache.slots);
    }
    overlay.classList.remove("cl-mobile-step-data");
    var mobileNext=overlay.querySelector(".cl-booking-mobile-next");
    if(mobileNext)mobileNext.disabled=!modalState.slot;
    overlay.classList.add("is-open");
    document.body.classList.add("cl-booking-modal-open");
    lockBookingPage();
    var openScroller=bookingScrollContainer();
    if(openScroller)openScroller.scrollTop=0;
    var root=findContactRoot();
    if(root){
      var data=collect(root);
      var form=overlay.querySelector(".cl-booking-form");
      if(data.name)form.elements.full_name.value=data.name;
      if(data.brand)form.elements.brand_name.value=data.brand;
      if(data.phone)form.elements.whatsapp.value=data.phone.replace(/^\\+?57/,"");
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
    requestAnimationFrame(function(){
      syncBookingViewport();
      var openScroller=bookingScrollContainer();
      if(openScroller)openScroller.scrollTop=0;
    });
  }

  window.__clOpenBookingModal=openBookingModal;
  if(window.__clBookingOpenRequested){
    window.__clBookingOpenRequested=false;
    setTimeout(openBookingModal,0);
  }

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
    var fullPhone=(phone.indexOf("+")===0?phone:code+phone).replace(/\\s+/g,"");
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
      var successScroller=bookingScrollContainer();
      if(successScroller)successScroller.scrollTop=0;
    }catch(err){
      error.textContent=err&&err.message?err.message:"No pudimos guardar la cita. Intenta nuevamente.";
      button.disabled=false;button.textContent="Agendar diagnóstico";
      if(String(err&&err.message||"").toLowerCase().indexOf("horario")!==-1)loadModalAvailability();
    }
  }

  function normalize(){
    if(!window.__clBookingViewportReady){
      window.__clBookingViewportReady=true;
      syncBookingViewport();
      window.addEventListener("resize",syncBookingViewport,{passive:true});
      if(window.visualViewport){
        window.visualViewport.addEventListener("resize",function(){
          syncBookingViewport();
          requestAnimationFrame(keepFocusedBookingFieldVisible);
        },{passive:true});
        window.visualViewport.addEventListener("scroll",function(){
          syncBookingViewport();
          requestAnimationFrame(keepFocusedBookingFieldVisible);
        },{passive:true});
      }
    }
    prewarmAvailability();

    Array.from(document.querySelectorAll("a,button")).forEach(function(el){
      var text=norm(el);
      if(!isBookingActionText(text))return;
      if(isInsideModal(el))return;
      if(text!=="Agendar diagnóstico")el.textContent="Agendar diagnóstico";
      el.classList.add("cl-booking-cta-label");
      if(el.tagName==="A"){
        el.removeAttribute("href");
        el.removeAttribute("target");
      }
      el.removeAttribute("onclick");
    });

    var root=findContactRoot();
    if(root){
      installInlineScheduler(root);

      var heading=Array.from(document.querySelectorAll("h1,h2,h3")).find(function(el){
        var t=norm(el).toLowerCase();
        return t.indexOf("hablemos de")!==-1&&t.indexOf("negocio")!==-1;
      });
      var section=heading?(heading.closest("section")||heading.parentElement):null;
      if(section){
        Array.from(section.querySelectorAll("a,button")).forEach(function(el){
          if(!isBookingActionText(norm(el)))return;
          if(root.contains(el))return;
          el.remove();
        });
      }
    }
  }

  var lastBookingPointerAt=0;
  function handleBookingAction(event){
    var action=event.target&&event.target.closest?event.target.closest("a,button"):null;
    if(!action||isInsideModal(action))return;
    var actionText=norm(action);
    if(!isBookingActionText(actionText))return;

    if(event.type==="click"&&Date.now()-lastBookingPointerAt<650){
      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation)event.stopImmediatePropagation();
      return;
    }
    if(event.type==="pointerup")lastBookingPointerAt=Date.now();

    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation)event.stopImmediatePropagation();

    var root=findContactRoot();
    if(root&&root.contains(action)){
      if(norm(action)!=="Agendar diagnóstico")action.textContent="Agendar diagnóstico";
      installInlineScheduler(root);
      submitInline(root,action);
      return;
    }

    openBookingModal();
  }

  if(window.PointerEvent)window.addEventListener("pointerup",handleBookingAction,true);
  window.addEventListener("click",handleBookingAction,true);

  hydrateAvailabilityCache();
  prewarmAvailability();
  normalize();
  window.addEventListener("load",function(){
    normalize();
    setTimeout(normalize,120);
    setTimeout(normalize,400);
    setTimeout(normalize,1000);
  },{once:true});

  if(window.MutationObserver){
    var bodyObserver=null;
    var contactObserver=null;
    var currentObservedRoot=null;
    var observerBusy=false;

    function attachContactObserver(root){
      if(currentObservedRoot===root&&contactObserver)return;
      if(contactObserver)contactObserver.disconnect();
      currentObservedRoot=root;
      contactObserver=new MutationObserver(function(){
        if(observerBusy)return;
        var liveRoot=findContactRoot();
        if(!liveRoot)return;
        if(liveRoot!==currentObservedRoot){
          attachContactObserver(liveRoot);
        }
        if(!liveRoot.querySelector(".cl-contact-date")||!liveRoot.querySelector(".cl-contact-time")){
          liveRoot.dataset.clScheduler="";
          installInlineScheduler(liveRoot);
        }
      });
      contactObserver.observe(root,{childList:true,subtree:true});
    }

    function ensureInlineBookingMounted(){
      if(observerBusy)return;
      observerBusy=true;
      try{
        normalize();
        var root=findContactRoot();
        if(!root)return;
        attachContactObserver(root);
        if(!root.querySelector(".cl-contact-date")||!root.querySelector(".cl-contact-time")){
          root.dataset.clScheduler="";
          installInlineScheduler(root);
        }
      }finally{
        observerBusy=false;
      }
    }

    bodyObserver=new MutationObserver(function(){
      var root=findContactRoot();
      if(!root)return;
      if(root!==currentObservedRoot){
        attachContactObserver(root);
      }
      if(!root.querySelector(".cl-contact-date")||!root.querySelector(".cl-contact-time")){
        ensureInlineBookingMounted();
      }
    });
    bodyObserver.observe(document.body,{childList:true,subtree:true});
    ensureInlineBookingMounted();
  }
})();
</script>
`

const HOMEPAGE_STRATEGIC_CTAS = `
<style id="cl-home-strategic-ctas-v1">
.cl-home-bridge{position:relative;display:block;width:100%;padding:43px 24px;background:#fff;isolation:isolate;border-top:1px solid #e8eef8;border-bottom:1px solid #e8eef8}
.cl-home-bridge.is-accent{background:linear-gradient(110deg,#f4f8ff,#fff 72%)}
.cl-home-bridge-inner{display:flex;align-items:center;justify-content:space-between;gap:34px;width:min(1130px,100%);margin:auto}
.cl-home-bridge-copy{flex:1;min-width:0}
.cl-home-bridge-eyebrow{display:block;font:800 11px/1.3 "Montserrat",sans-serif;letter-spacing:.12em;color:#3569d9}
.cl-home-bridge h3{margin:12px 0 8px;font:750 clamp(22px,2.2vw,29px)/1.25 "Montserrat",sans-serif;letter-spacing:-.038em;color:#111e37}
.cl-home-bridge p{margin:0;max-width:780px;font:500 15px/1.8 "Montserrat",sans-serif;color:#60728f}
.cl-home-bridge button{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:80px;background:linear-gradient(104deg,#246fe8,#6754e7);box-shadow:0 13px 29px #315fe92d;padding:15px 24px;color:white;font:750 14px/1.3 "Montserrat",sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s}
.cl-home-bridge button:hover{transform:translateY(-2px);box-shadow:0 15px 32px #315fe944}
.cl-home-bridge button:focus-visible{outline:3px solid #9fb5ff;outline-offset:4px}
@media(max-width:720px){.cl-home-bridge{padding:34px 22px}.cl-home-bridge-inner{display:flex;flex-direction:column;gap:20px;align-items:flex-start}.cl-home-bridge h3{font-size:22px}.cl-home-bridge p{font-size:14px}.cl-home-bridge button{font-size:13px;padding:14px 20px}}
</style>
<script id="cl-home-strategic-ctas-runtime">
(function(){
 function norm(el){return String(el&&el.textContent||"").replace(/\\s+/g," ").trim().toLowerCase();}
 function sectionFor(selectors,words){
  for(var k=0;k<selectors.length;k++){var target=document.querySelector(selectors[k]);if(target){var section=target.closest("section");if(section)return section;}}
  var headings=Array.from(document.querySelectorAll("main h2, main h3, section h2, section h3"));
  for(var i=0;i<words.length;i++){var heading=headings.find(function(el){return norm(el).indexOf(words[i])!==-1;});if(heading){var host=heading.closest("section");if(host)return host;}}
  return null;
 }
 function insert(id,host,eyebrow,title,detail,accent){
  if(!host||document.getElementById(id))return;
  var box=document.createElement("aside");box.id=id;
  box.className="cl-home-bridge"+(accent?" is-accent":"");
  box.setAttribute("aria-label","Invitación a agendar un diagnóstico");
  var inner=document.createElement("div");inner.className="cl-home-bridge-inner";
  var copy=document.createElement("div");copy.className="cl-home-bridge-copy";
  var small=document.createElement("span");small.className="cl-home-bridge-eyebrow";small.textContent=eyebrow;
  var heading=document.createElement("h3");heading.textContent=title;
  var paragraph=document.createElement("p");paragraph.textContent=detail;
  var button=document.createElement("button");button.type="button";button.textContent="Agendar diagnóstico";button.className="cl-booking-cta-label";
  copy.append(small,heading,paragraph);inner.append(copy,button);box.appendChild(inner);
  host.insertAdjacentElement("afterend",box);
 }
 function mount(){
  var services=sectionFor(["#servicios",".svc"],["creamos sistemas con ia","nuestros servicios"]);
  insert("cl-home-after-services",services,"TU NEGOCIO, TU PUNTO DE PARTIDA","No tienes que decidir qué tecnología necesitas.","Revisemos dónde se pierden oportunidades y qué tendría sentido construir primero.",false);
  var demos=sectionFor(["#como-funciona","#como-trabajamos"],["así trabajamos","mira cómo funciona"]);
  if(demos&&demos!==services)insert("cl-home-after-demo",demos,"LLEVEMOS EL EJEMPLO A TU NEGOCIO","¿Te gustaría ver cómo funcionaría en tu operación?","Un diagnóstico nos ayuda a entender tu proceso y diseñar el recorrido adecuado.",true);
  var projects=sectionFor(["#proyectos",".projects-head"],["proyectos que hemos construido","lo que hemos construido"]);
  if(projects&&projects!==services&&projects!==demos)insert("cl-home-after-projects",projects,"ANTES DE CONSTRUIR","Hablemos de lo que quieres conseguir.","No necesitas una propuesta técnica lista. Empecemos por tu negocio y tu cliente.",false);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
 else mount();
 window.addEventListener("load",function(){setTimeout(mount,250);},{once:true});
})();
</script>
`;

function getOriginalHtml() {
  const html = gunzipSync(Buffer.from(COMPRESSED_HTML, "base64")).toString("utf8")
    .replaceAll("Continuar por WhatsApp", "Agendar diagnóstico")
    .replaceAll("Agendar videollamada de diagnóstico", "Agendar diagnóstico")
    .replaceAll("Solicitar videollamada de diagnóstico", "Agendar diagnóstico")
    .replaceAll("Solicitar videollamada", "Agendar diagnóstico")
    .replace(
      "    '<div><label class=\"consent\"><input type=\"checkbox\" name=\"consent\" id=\"'+p+'-consent\" aria-describedby=\"'+p+'-e-consent\"><span>Autorizo el uso de mis datos para responder esta solicitud. No implica recibir publicidad adicional.</span></label><p class=\"err\" id=\"'+p+'-e-consent\" role=\"alert\"></p></div>'+",
      "    '<div class=\"cl-contact-booking\" data-cl-inline-booking=\"1\"><div class=\"cl-contact-booking-head\"><strong>Elige fecha y hora para tu videollamada</strong><span>Selecciona un horario disponible. Todos los horarios son hora de Colombia.</span></div><label><span>Fecha preferida</span><input class=\"cl-contact-date\" type=\"date\" aria-label=\"Fecha preferida\"></label><label><span>Hora disponible</span><select class=\"cl-contact-time\" aria-label=\"Hora disponible\" disabled><option value=\"\">Selecciona primero una fecha</option></select></label><p class=\"cl-contact-booking-note\">Consultando disponibilidad…</p></div>'+\n    '<div><label class=\"consent\"><input type=\"checkbox\" name=\"consent\" id=\"'+p+'-consent\" aria-describedby=\"'+p+'-e-consent\"><span>Autorizo el uso de mis datos para responder esta solicitud. No implica recibir publicidad adicional.</span></label><p class=\"err\" id=\"'+p+'-e-consent\" role=\"alert\"></p></div>'+"
    )
    .replace(/El diagnóstico es una sesión de pago[^<]*/g, "El diagnóstico es una sesión gratuita para entender tu negocio, detectar dónde se pierde la oportunidad y definir el mejor siguiente paso.")
    .replace("Míralo funcionar.", "Así trabajamos.")
    .replace(
      "Tres servicios, tres demostraciones que se mueven solas. Si quieres, toca cualquier paso.",
      "Tres servicios, tres demostraciones que muestran cómo captamos, atendemos y convertimos contactos en oportunidades reales. Si quieres, toca cualquier paso."
    )
    .replace("Sistemas con IA a la medida", "Creamos sistemas con IA a la medida")
    .replace(
      "Que ningún contacto se pierda y sepas quién llegó, qué necesita y cuándo hacer seguimiento.",
      "Construimos lo que tu negocio necesita: desde una página web o un sistema administrativo hasta CRM, agendamiento, automatizaciones, agentes de IA, paneles e indicadores, todo conectado según el proyecto."
    )
    .replace("Agentes de IA", "Creamos agentes de IA")
    .replace(
      "Que nadie se quede sin respuesta, ni de noche ni en fines de semana, y tu equipo atienda solo a quien ya está listo para avanzar.",
      "Responden, filtran, agendan y hacen seguimiento incluso cuando tú no estás, para que tu equipo atienda a quienes realmente están listos para avanzar."
    )
    .replace("Atraemos clientes", "Creamos páginas web y publicidad")
    .replace("con marketing digital", "en redes sociales")
    .replace(
      "Que más personas te encuentren, entiendan por qué elegirte y dejen sus datos.",
      "Creamos páginas web y campañas pagas en redes sociales para atraer personas interesadas y llevarlas a una acción clara. Puedes contratar cada servicio por separado o conectarlos dentro de un sistema más completo."
    );
  const seoAlignedHtml = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/i, "<title>Cómplice Lab | Sistemas IA, Páginas Web y Publicidad Digital</title>")
    .replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      '<meta name="description" content="Especialistas en sistemas con IA a la medida, agentes de IA, páginas web y publicidad digital para atraer, atender y gestionar oportunidades.">'
    )
    .replace(
      /<meta\s+property=["']og:title["'][^>]*>/i,
      '<meta property="og:title" content="Cómplice Lab | Sistemas IA, Páginas Web y Publicidad Digital">'
    )
    .replace(
      /<meta\s+property=["']og:description["'][^>]*>/i,
      '<meta property="og:description" content="Sistemas con IA a la medida, agentes de IA automatizados, páginas web y publicidad en redes sociales para profesionales y empresas.">'
    );
  return replaceMarketingRuntime(replaceFlowScenes(replaceCompareScenes(seoAlignedHtml)))
    .replace("</head>", SECTION_TITLE_WEIGHT_OVERRIDE + MOBILE_FLOW_FIXES + HOMEPAGE_POSITIONING_STYLES + compareStyles + flowStyles + marketingStyles + `\n  <meta name="complice-build" content="mobile-booking-two-step-2026-11-09-v2">\n  <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://complicelab.com/#organization","name":"Cómplice Lab","url":"https://complicelab.com/","logo":"https://complicelab.com/brand/complice-lab-logo.svg","email":"info@complicelab.com","telephone":"+573161772880","description":"Cómplice Lab construye sistemas con IA a la medida, agentes de IA automatizados, páginas web y campañas de publicidad para profesionales y empresas.","areaServed":[{"@type":"Country","name":"Colombia"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"Mexico"},{"@type":"Country","name":"Dominican Republic"},{"@type":"AdministrativeArea","name":"Puerto Rico"}],"sameAs":["https://www.instagram.com/complicelab","https://www.facebook.com/complicelab","https://www.youtube.com/@complicelab"]},{"@type":"WebSite","@id":"https://complicelab.com/#website","url":"https://complicelab.com/","name":"Cómplice Lab","publisher":{"@id":"https://complicelab.com/#organization"},"inLanguage":"es-419"},{"@type":"Service","name":"Sistemas con IA a la medida","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":[{"@type":"Country","name":"Colombia"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"Mexico"},{"@type":"Country","name":"Dominican Republic"},{"@type":"AdministrativeArea","name":"Puerto Rico"}],"serviceType":"Sistemas con inteligencia artificial a la medida"},{"@type":"Service","name":"Agentes de IA automatizados","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":[{"@type":"Country","name":"Colombia"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"Mexico"},{"@type":"Country","name":"Dominican Republic"},{"@type":"AdministrativeArea","name":"Puerto Rico"}],"serviceType":"Agentes de inteligencia artificial automatizados"},{"@type":"Service","name":"Páginas web y publicidad en redes sociales","provider":{"@id":"https://complicelab.com/#organization"},"areaServed":[{"@type":"Country","name":"Colombia"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"Mexico"},{"@type":"Country","name":"Dominican Republic"},{"@type":"AdministrativeArea","name":"Puerto Rico"}],"serviceType":"Páginas web, publicidad en redes sociales, Meta Ads, TikTok Ads y Google Ads"}]}</script>\n  <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"shortcut icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"apple-touch-icon\" href=\"/favicon.png\">\n` + "</head>")
    .replace("</body>", HOMEPAGE_COPY_FIX + HOMEPAGE_GOOGLE_REVIEWS_RUNTIME + HOMEPAGE_FOOTER_ENHANCEMENT + MOBILE_FLOW_SCRIPT + compareInteractions + flowInteractions + marketingInteractions + UNIFIED_BOOKING_CTA + HOMEPAGE_STRATEGIC_CTAS + "</body>");
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cómplice Lab | Sistemas IA, Páginas Web y Publicidad Digital" },
      { name: "description", content: "Especialistas en sistemas con IA a la medida, agentes de IA, páginas web y publicidad digital para atraer, atender y gestionar oportunidades." },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Cómplice Lab | Sistemas IA, Páginas Web y Publicidad Digital" },
      { property: "og:description", content: "Sistemas con IA a la medida, agentes de IA automatizados, páginas web y publicidad en redes sociales para atraer y gestionar oportunidades." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://complicelab.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/" }],
  }),
  server: {
    handlers: {
      GET: async () => {
        const googleReviews = await fetchGoogleReviewSnapshot();
        const html = getOriginalHtml().replace(
          "__CL_GOOGLE_REVIEWS_PAYLOAD__",
          safeJsonForHtml(googleReviews),
        );
        const body = Buffer.from(html, "utf8");

        return new Response(body, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Content-Length": String(body.byteLength),
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
            "Surrogate-Control": "no-store",
            "X-Complice-Build": "mobile-booking-two-step-2026-11-09-v2",
          },
        });
      },
    },
  },
});
