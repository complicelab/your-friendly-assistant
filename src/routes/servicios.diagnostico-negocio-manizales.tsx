import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicios/diagnostico-negocio-manizales")({
  beforeLoad: () => { throw redirect({ to: "/", replace: true }); },
});
