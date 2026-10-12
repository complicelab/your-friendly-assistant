import { createFileRoute } from "@tanstack/react-router";
import { ServiceExperience } from "@/components/marketing/service-experience";
import { commercialServices } from "@/data/commercial-services";

const service = commercialServices.find(item => item.slug === "marketing-digital-manizales")!;
const url = "https://complicelab.com/servicios/marketing-digital-manizales";
export const Route = createFileRoute("/servicios/marketing-digital-manizales")({
  head: () => ({
    meta: [
      { title: service.title },
      { name: "description", content: service.description },
      { property: "og:title", content: service.title },
      { property: "og:description", content: service.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://complicelab.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: () => <ServiceExperience service={service} />,
});
