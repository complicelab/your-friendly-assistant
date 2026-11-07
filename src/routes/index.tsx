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

function getOriginalHtml() {
  return gunzipSync(Buffer.from(COMPRESSED_HTML, "base64"));
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
