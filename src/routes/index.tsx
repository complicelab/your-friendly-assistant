import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/marketing/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Páginas web, publicidad y marcas en Manizales | Cómplice Lab" },
      { name: "description", content: "Creamos páginas web para citas, ventas y pedidos, contenido publicitario, campañas Meta Ads y marcas desde cero en Manizales. Solicita un diagnóstico." },
      { property: "og:title", content: "Haz que tu negocio venda, agende y se destaque | Cómplice Lab" },
      { property: "og:description", content: "Páginas web, sistemas, publicidad y marcas para atraer consultas, citas, pedidos y oportunidades." },
      { property: "og:url", content: "https://complicelab.com/" }
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/" }],
  }),
  component: Index,
});

function Index() {
  return <LandingPage />;
}
