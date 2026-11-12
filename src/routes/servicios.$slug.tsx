import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

const redirects: Record<string, string> = {
  "sistemas-ia-a-la-medida": "/sistemas-ia-a-la-medida",
  "agentes-de-ia": "/agentes-de-ia",
  "paginas-web": "/paginas-web",
  "publicidad-digital": "/publicidad-digital",
  "paginas-web-manizales": "/paginas-web",
  "marketing-digital-manizales": "/publicidad-digital",
  "publicidad-meta-ads": "/publicidad-digital",
};

export const Route = createFileRoute("/servicios/$slug")({
  beforeLoad: ({ params }) => {
    const target = redirects[params.slug];
    if (target) throw redirect({ href: target, statusCode: 301 });
    throw notFound();
  },
  component: () => null,
});
