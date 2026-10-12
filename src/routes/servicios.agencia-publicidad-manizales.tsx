import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route=createFileRoute("/servicios/agencia-publicidad-manizales")({
 beforeLoad:()=>{throw redirect({to:"/servicios/diagnostico-negocio-manizales",replace:true});}
});
