import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicios/branding-identidad-marca")({
  beforeLoad: () => { throw redirect({ to: "/", replace: true }); },
});
