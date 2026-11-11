import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicios/contenido-publicitario-manizales")({
  beforeLoad: () => { throw redirect({ to: "/servicios/publicidad-meta-ads", replace: true }); },
});
