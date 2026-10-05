import { createFileRoute } from "@tanstack/react-router";
import part1 from "@/data/pb-hero-part-1";
import part2 from "@/data/pb-hero-part-2";
import { imageResponse } from "@/lib/base64-image";

const image = part1 + part2;

export const Route = createFileRoute("/pb-hero.webp")({
  server: {
    handlers: {
      GET: async () => imageResponse(image),
    },
  },
});
