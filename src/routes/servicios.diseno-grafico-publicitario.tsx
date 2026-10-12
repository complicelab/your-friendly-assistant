import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route=createFileRoute("/servicios/diseno-grafico-publicitario")({
 beforeLoad:()=>{throw redirect({to:"/servicios/contenido-publicitario-manizales",replace:true});}
});
