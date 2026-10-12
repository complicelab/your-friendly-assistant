import { createFileRoute } from "@tanstack/react-router";
import { ServiceExperience } from "@/components/marketing/service-experience";
import { commercialServices } from "@/data/commercial-services";
const service=commercialServices.find(item=>item.slug==="crear-marca-negocio-desde-cero")!;
const canonical="https://complicelab.com/servicios/crear-marca-negocio-desde-cero";
export const Route=createFileRoute("/servicios/crear-marca-negocio-desde-cero")({
 head:()=>({
  meta:[{title:service.title},{name:"description",content:service.description},{property:"og:title",content:service.title},{property:"og:description",content:service.description},{property:"og:url",content:canonical},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}],
  links:[{rel:"canonical",href:canonical}]
 }),
 component:()=> <ServiceExperience service={service}/>
});
