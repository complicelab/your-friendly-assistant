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

function getOriginalHtml() {
  const original = gunzipSync(Buffer.from(COMPRESSED_HTML, "base64")).toString("utf8");
  const html = original.replace(
    'var WA_NUMBER = "573000000000";',
    `var WA_NUMBER = "${WA_NUMBER}";`,
  );

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
