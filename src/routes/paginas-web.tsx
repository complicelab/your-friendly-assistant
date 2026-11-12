import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServiceExperience } from "@/components/marketing/service-experience";
import { commercialServices, serviceHref } from "@/data/commercial-services";

const base = "https://complicelab.com";
const slug = "paginas-web";
const service = commercialServices.find((item) => item.slug === slug);

export const Route = createFileRoute("/paginas-web")({
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
  component: () => service ? <ServiceExperience service={service} /> : null,
});
