import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route=createFileRoute("/servicios/contenido-redes-sociales")({
 beforeLoad:()=>{throw redirect({to:"/servicios/contenido-publicitario-manizales",replace:true});}
});
