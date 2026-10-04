import { createFileRoute } from "@tanstack/react-router";

import part1 from "@/data/og-image-part-1";
import part2 from "@/data/og-image-part-2";
import part3 from "@/data/og-image-part-3";
import part4 from "@/data/og-image-part-4";
import part5 from "@/data/og-image-part-5";
import part6 from "@/data/og-image-part-6";
import part7 from "@/data/og-image-part-7";

const base64Image = part1 + part2 + part3 + part4 + part5 + part6 + part7;

export const Route = createFileRoute("/og-image.jpg")({
  server: {
    handlers: {
      GET: async () => {
        const binary = atob(base64Image);
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

        return new Response(bytes, {
          headers: {
            "Content-Type": "image/jpeg",
            "Content-Length": String(bytes.byteLength),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
