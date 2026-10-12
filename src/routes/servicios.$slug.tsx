import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServiceExperience } from "@/components/marketing/service-experience";
import { commercialServices, serviceHref } from "@/data/commercial-services";

const base = "https://complicelab.com";
function getService(slug: string) { return commercialServices.find(s => s.slug === slug); }
export const Route = createFileRoute("/servicios/$slug")({
  beforeLoad: ({ params }) => { if (!getService(params.slug)) throw notFound(); },
  head: ({ params }) => {
    const service = getService(params.slug);
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
  component: ServicePage,
});
function ServicePage() {
  const { slug } = Route.useParams();
  const service = getService(slug);
  if (!service) return null;
  return <ServiceExperience service={service} />;
}
