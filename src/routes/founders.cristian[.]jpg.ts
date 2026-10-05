import { createFileRoute } from "@tanstack/react-router";
import imageBase64 from "@/data/founder-cristian-image";

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

export const Route = createFileRoute("/founders/cristian.jpg")({
  server: {
    handlers: {
      GET: async () => {
        const bytes = decodeBase64(imageBase64);
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
