import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/marketing/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ property: "og:url", content: "https://complicelab.com/" }],
    links: [{ rel: "canonical", href: "https://complicelab.com/" }],
  }),
  component: Index,
});

function Index() {
  return <LandingPage />;
}
