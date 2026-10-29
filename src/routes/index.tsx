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

const HERO_SITE_SHOWROOM = `      <div class="site">
        <div class="site-bar"><i></i><i></i><i></i><span>demo.complicedental.com</span></div>
        <div class="site-live">
          <iframe title="Vista previa del showroom de Cómplice Dental" src="https://demo.complicedental.com" loading="eager" referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
      </div>`;

const HERO_SHOWROOM_CSS = `
.site-live{position:relative;height:390px;background:#fff;overflow:hidden}
.site-live iframe{position:relative;top:-76px;width:160%;height:760px;border:0;transform:scale(.625);transform-origin:top left;pointer-events:none}
.site-live::after{content:"";position:absolute;top:-55%;left:-36%;width:34%;height:210%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent);transform:rotate(24deg);pointer-events:none;transition:left .75s ease}
.site:hover .site-live::after{left:125%}
@media(max-width:920px){.site-live{height:390px}.site-live iframe{top:-68px;height:750px}}
@media(max-width:560px){.site-live{height:340px}.site-live iframe{top:-52px;width:180%;height:720px;transform:scale(.556)}}
`;

function getOriginalHtml() {
  const original = gunzipSync(Buffer.from(COMPRESSED_HTML, "base64")).toString("utf8");

  const html = original
    .replace(
      'var WA_NUMBER = "573000000000";',
      `var WA_NUMBER = "${WA_NUMBER}";`,
    )
    .replace(HERO_SITE_ORIGINAL, HERO_SITE_SHOWROOM)
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
