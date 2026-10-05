import { createFileRoute } from "@tanstack/react-router";
import image from "@/data/pb-web";
import { imageResponse } from "@/lib/base64-image";

export const Route = createFileRoute("/pb-web.webp")({
  server: {
    handlers: {
      GET: async () => imageResponse(image),
    },
  },
});
