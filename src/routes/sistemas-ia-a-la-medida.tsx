import { createFileRoute, notFound } from "@tanstack/react-router";
import { SystemsLanding } from "@/components/marketing/systems-landing";
import { commercialServices, serviceHref } from "@/data/commercial-services";

const base = "https://complicelab.com";
const slug = "sistemas-ia-a-la-medida";
const service = commercialServices.find((item) => item.slug === slug);

export const Route = createFileRoute("/sistemas-ia-a-la-medida")({
  beforeLoad: () => { if (!service) throw notFound(); },
  head: () => {
    if (!service) return {};
    const url = base + serviceHref(service.slug);
    return {
      meta: [
        { title: service.title },
        { name: "description", content: service.description },
        { property: "og:title", content: service.title },
        { property: "og:description", content: service.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: base + "/og-image.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: () => service ? <SystemsLanding /> : null,
});
