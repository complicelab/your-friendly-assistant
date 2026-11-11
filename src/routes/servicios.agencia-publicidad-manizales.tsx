import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicios/agencia-publicidad-manizales")({
  beforeLoad: () => { throw redirect({ to: "/servicios/publicidad-meta-ads", replace: true }); },
});
