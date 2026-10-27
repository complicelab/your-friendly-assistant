import { createFileRoute } from "@tanstack/react-router";
import { LabHome } from "@/components/marketing/lab-home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cómplice Lab | Sistemas digitales para profesionales de alto valor" },
      { name: "description", content: "Diseñamos páginas, sistemas comerciales y automatizaciones para profesionales de alto valor que quieren convertir su reputación en citas, clientes y oportunidades." },
      { property: "og:title", content: "Tu reputación ya vale mucho. Haz que tu presencia digital lo demuestre. | Cómplice Lab" },
      { property: "og:description", content: "Estrategia, diseño y tecnología para profesionales que no pueden verse como uno más." },
      { property: "og:url", content: "https://complicelab.com/" },
      { name: "theme-color", content: "#F6F8FC" }
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/" }],
  }),
  component: LabHome,
});
