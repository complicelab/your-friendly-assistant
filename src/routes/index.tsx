// preview-rebuild-v10
import { createFileRoute } from "@tanstack/react-router";
import { gunzipSync } from "node:zlib";
import { compareStyles, compareInteractions, replaceCompareScenes } from "@/data/compare/demos";

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
  return replaceCompareScenes(html)
    .replace("</head>", SECTION_TITLE_WEIGHT_OVERRIDE + MOBILE_FLOW_FIXES + compareStyles + "\n  <link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"shortcut icon\" type=\"image/png\" href=\"/favicon.png\">\n  <link rel=\"apple-touch-icon\" href=\"/favicon.png\">\n" + "</head>")
    .replace("</body>", MOBILE_FLOW_SCRIPT + compareInteractions + "</body>");
}

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Cómplice Lab | Páginas web y crecimiento para tu negocio" },
    { name: "description", content: "Cómplice Lab: diseño web, agendas digitales y estrategias para conectar tu negocio con nuevos clientes." },
    { property: "og:title", content: "Cómplice Lab | Páginas web y crecimiento" },
    { property: "og:description", content: "Diseño web y estrategias digitales para que tu negocio conecte, agende y crezca." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
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
