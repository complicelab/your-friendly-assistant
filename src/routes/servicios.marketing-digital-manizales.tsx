import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicios/marketing-digital-manizales")({
  beforeLoad: () => { throw redirect({ to: "/", replace: true }); },
});
