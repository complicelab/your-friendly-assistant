import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicios/crear-marca-negocio-desde-cero")({
  beforeLoad: () => { throw redirect({ to: "/", replace: true }); },
});
