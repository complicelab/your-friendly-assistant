import { createFileRoute } from "@tanstack/react-router";

import part1 from "@/data/og-image-part-1";
import part2 from "@/data/og-image-part-2";
import part3 from "@/data/og-image-part-3";
import part4 from "@/data/og-image-part-4";
import part5 from "@/data/og-image-part-5";
import part6 from "@/data/og-image-part-6";
import part7 from "@/data/og-image-part-7";
import part8 from "@/data/og-image-part-8";
import part9 from "@/data/og-image-part-9";
import part10 from "@/data/og-image-part-10";

const base64Image = part1 + part2 + part3 + part4 + part5 + part6 + part7 + part8 + part9 + part10;

function decodeBase64(input: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const padding = input.endsWith("==") ? 2 : input.endsWith("=") ? 1 : 0;
  const output = new Uint8Array((input.length / 4) * 3 - padding);
  let offset = 0;

  for (let index = 0; index < input.length; index += 4) {
    const a = alphabet.indexOf(input[index] ?? "A");
    const b = alphabet.indexOf(input[index + 1] ?? "A");
    const c = input[index + 2] === "=" ? 0 : alphabet.indexOf(input[index + 2] ?? "A");
    const d = input[index + 3] === "=" ? 0 : alphabet.indexOf(input[index + 3] ?? "A");
    const value = (a << 18) | (b << 12) | (c << 6) | d;

    if (offset < output.length) output[offset++] = (value >> 16) & 0xff;
    if (offset < output.length) output[offset++] = (value >> 8) & 0xff;
    if (offset < output.length) output[offset++] = value & 0xff;
  }

  return output;
}

export const Route = createFileRoute("/og-image.jpg")({
  server: {
    handlers: {
      GET: async () => {
        const bytes = decodeBase64(base64Image);

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
