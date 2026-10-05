import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/founders/camilo.jpg")({
  server: {
    handlers: {
      GET: async ({ request }) =>
        Response.redirect(new URL("/founders/camilo-latest.webp", request.url).toString(), 301),
    },
  },
});
