import { createFileRoute } from "@tanstack/react-router";
import { gunzipSync } from "node:zlib";

import part1 from "@/data/complice-v3-part-1";
import part2 from "@/data/complice-v3-part-2";
import part3 from "@/data/complice-v3-part-3";
import part4 from "@/data/complice-v3-part-4";
import part5 from "@/data/complice-v3-part-5";
import part6 from "@/data/complice-v3-part-6";
import part7 from "@/data/complice-v3-part-7";

const WA_NUMBER = "573000000000";

const COMPRESSED_HTML =
  part1 + part2 + part3 + part4 + part5 + part6 + part7;

const HERO_SITE_ORIGINAL = `      <div class="site">
        <div class="site-bar"><i></i><i></i><i></i><span>dracamilarestrepo.com</span></div>
        <div class="site-body">
          <div class="site-nav"><b>Camila Restrepo</b><span></span><span></span><span></span><em>Agendar</em></div>
          <div class="site-hero">
            <div class="site-text">
              <small>Cirugía maxilofacial</small>
              <strong>Precisión quirúrgica, trato cercano.</strong>
              <span class="ln"></span><span class="ln short"></span>
              <em class="site-cta">Agendar valoración</em>
            </div>
            <div class="portrait"><span class="head"></span><span class="body"></span></div>
          </div>
          <div class="site-trust"><span>4,9 en Google</span><span>12 años de experiencia</span><span>Manizales</span></div>
        </div>
      </div>`;

const HERO_SITE_SHOWROOM = `      <div class="site site-dark">
        <div class="site-bar"><i></i><i></i><i></i><span>dracamilarestrepo.com</span></div>
        <div class="site-dark-body">
          <div class="site-dark-nav">
            <b>Camila Restrepo</b>
            <div class="site-dark-navlinks"><span></span><span></span><span></span></div>
            <em>Agendar</em>
          </div>
          <div class="site-dark-hero">
            <div class="site-dark-copy">
              <small>Cirugía maxilofacial</small>
              <strong>Precisión quirúrgica,<br><i>trato cercano.</i></strong>
              <p>Experiencia, criterio y tecnología para una atención de alto nivel.</p>
              <span class="site-dark-cta">Agendar valoración</span>
              <div class="site-dark-trust"><b>4,9</b><span>Google</span><b>12+</b><span>años de experiencia</span></div>
            </div>
            <div class="site-dark-photo" role="img" aria-label="Fotografía real de una profesional de la salud"></div>
          </div>
        </div>
        <div class="site-dark-glare"></div>
      </div>`;

const HERO_SHOWROOM_CSS = `
.site.site-dark{background:#08172f;border-color:rgba(255,255,255,.15);box-shadow:0 34px 90px rgba(17,38,92,.26);overflow:hidden}
.site.site-dark .site-bar{background:#0d1d38;border-bottom:1px solid rgba(255,255,255,.09);color:#b9c9e8}
.site.site-dark .site-bar i{background:#405374}
.site-dark-body{height:390px;background:
  radial-gradient(circle at 75% 16%,rgba(88,91,255,.28),transparent 34%),
  radial-gradient(circle at 35% 90%,rgba(25,192,235,.16),transparent 34%),
  linear-gradient(135deg,#08172f 0%,#0b203d 54%,#0d1832 100%);
  color:#fff;position:relative;overflow:hidden}
.site-dark-body:before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.11) .7px,transparent .7px);background-size:18px 18px;opacity:.28;pointer-events:none}
.site-dark-nav{position:relative;z-index:4;height:52px;display:flex;align-items:center;gap:16px;padding:0 22px;border-bottom:1px solid rgba(255,255,255,.08)}
.site-dark-nav>b{font:600 14px/1 "Newsreader",serif;font-style:italic;color:#fff}
.site-dark-navlinks{display:flex;gap:12px;margin-left:auto}
.site-dark-navlinks span{display:block;width:24px;height:3px;border-radius:999px;background:rgba(255,255,255,.25)}
.site-dark-nav em{font-style:normal;font:800 8px/1 "Montserrat",sans-serif;background:#d7f7e9;color:#10231d;border-radius:999px;padding:10px 14px}
.site-dark-hero{position:relative;z-index:2;display:grid;grid-template-columns:.92fr 1.08fr;height:338px}
.site-dark-copy{position:relative;z-index:3;padding:36px 10px 22px 27px;display:flex;flex-direction:column;align-items:flex-start}
.site-dark-copy small{font:700 7px/1 "Montserrat",sans-serif;letter-spacing:.08em;color:#73dff7}
.site-dark-copy strong{margin-top:12px;font:500 clamp(22px,2.15vw,34px)/1 "Newsreader",serif;letter-spacing:-.035em;color:#fff}
.site-dark-copy strong i{font-style:italic;color:#b7c8ff}
.site-dark-copy p{margin:13px 0 0;max-width:230px;font:500 8.5px/1.55 "Montserrat",sans-serif;color:#9fb1cd}
.site-dark-cta{margin-top:18px;padding:10px 13px;border-radius:999px;background:#fff;color:#0b1b35;font:800 7px/1 "Montserrat",sans-serif}
.site-dark-trust{display:grid;grid-template-columns:auto auto auto auto;gap:4px 7px;align-items:center;margin-top:auto;padding-top:15px;color:#91a7c7}
.site-dark-trust b{font:800 8px "Montserrat",sans-serif;color:#fff}.site-dark-trust span{font:600 6.5px "Montserrat",sans-serif}
.site-dark-photo{position:relative;height:100%;overflow:hidden;background:
  linear-gradient(90deg,#0a1a34 0%,rgba(10,26,52,.20) 34%,rgba(10,26,52,0) 56%),
  linear-gradient(0deg,rgba(7,18,37,.35),transparent 48%),
  url("https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&q=90&fit=crop") center 22%/cover no-repeat;
  filter:saturate(.9) contrast(1.06) brightness(.92)}
.site-dark-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,27,53,.56),transparent 35%),linear-gradient(0deg,rgba(7,17,34,.28),transparent 45%);pointer-events:none}
.site-dark-glare{pointer-events:none;position:absolute;top:-55%;left:-35%;width:34%;height:210%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);transform:rotate(24deg);transition:left .8s ease;z-index:8}
.site.site-dark:hover .site-dark-glare{left:125%}
#h1 .focus.grad-text{margin-top:0!important;padding-top:0!important;transform:none!important;line-height:inherit!important}
#h1{row-gap:0!important}
@media(max-width:920px){
  .site-dark-body{height:390px}
  .site-dark-hero{height:338px}
  .site-dark-copy{padding-left:22px}
}
@media(max-width:560px){
  .site-dark-body{height:340px}
  .site-dark-nav{height:46px;padding:0 14px}
  .site-dark-navlinks{display:none}
  .site-dark-hero{height:294px;grid-template-columns:1fr}
  .site-dark-copy{position:absolute;left:0;top:0;bottom:0;width:58%;padding:24px 8px 18px 18px;background:linear-gradient(90deg,rgba(7,21,43,.96),rgba(7,21,43,.78) 72%,transparent);z-index:4}
  .site-dark-copy strong{font-size:23px}
  .site-dark-copy p{font-size:7.5px;max-width:175px}
  .site-dark-photo{position:absolute;right:0;top:0;width:66%;height:100%;background-position:center 20%}
}
`;

function getOriginalHtml() {
  const original = gunzipSync(Buffer.from(COMPRESSED_HTML, "base64")).toString("utf8");

  const html = original
    .replace(
      'var WA_NUMBER = "573000000000";',
      `var WA_NUMBER = "${WA_NUMBER}";`,
    )
    .replace(HERO_SITE_ORIGINAL, HERO_SITE_SHOWROOM)
    .replace(
      '<h1 id="h1">Eres de los mejores en lo tuyo. <span class="focus grad-text">Tu presencia digital todavía no lo sabe.</span></h1>',
      '<h1 id="h1">Trabajamos con los mejores <span class="focus grad-text">para que no parezcan uno más.</span></h1>',
    )
    .replace(
      '<p class="lede">Usamos IA para <b>posicionar tu marca</b>, atraer a las personas correctas y no dejar escapar a ninguna. Así te perciben con el nivel que tienes y puedes <b>cobrar lo que vales</b>.</p>',
      '<p class="lede">Usamos IA para <b>posicionar tu marca a otro nivel</b>, atraer a las personas correctas y no dejar escapar a ninguna. Así te perciben con el nivel que tienes y puedes <b>cobrar lo que vales</b>.</p>',
    )
    .replace("</style>", HERO_SHOWROOM_CSS + "</style>");

  return Buffer.from(html, "utf8");
}

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async () => {
        const html = getOriginalHtml();

        return new Response(html, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Content-Length": String(html.byteLength),
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
