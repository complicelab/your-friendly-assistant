/** Banco editorial de escenas por sector, sin presentarlas como casos de éxito ni pacientes reales de la agencia. */
const pexels=(id:number,w=1000)=>`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
export const peopleImages = {
  dentist: {src:pexels(3881423),alt:"Odontóloga atendiendo a una paciente en su consultorio"},
  dentistDetail: {src:pexels(5622000),alt:"Atención profesional en un consultorio odontológico"},
  realtor: {src:pexels(7641856),alt:"Agente inmobiliario mostrando una vivienda a sus clientes"},
  realtorDetail: {src:pexels(7937705),alt:"Asesor inmobiliario hablando con compradores"},
  doctor: {src:pexels(3884101),alt:"Profesional de salud conversando con una paciente"},
  restaurant: {src:pexels(19595138),alt:"Atención y servicio en un restaurante"},
  restaurantDish: {src:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",alt:"Restaurante con una presentación atractiva"},
  fastfood: {src:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",alt:"Hamburguesa presentada para una promoción de comida rápida"},
  fastfoodDetail:{src:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80",alt:"Hamburguesa para pedidos y domicilios"},
  consultancy:{src:"https://images.unsplash.com/photo-1758518727077-ffb66ffccced?auto=format&fit=crop&w=1000&q=80",alt:"Empresarios conversando sobre oportunidades comerciales"},
  brand:{src:pexels(7598019),alt:"Mesa de trabajo con referencias visuales, identidad y colores de marca"},
  entrepreneur:{src:"https://images.unsplash.com/photo-1765648580808-76d75e4f3833?auto=format&fit=crop&w=1000&q=80",alt:"Emprendedora usando un computador para su negocio"},
  salon:{src:"https://images.unsplash.com/photo-1746723372913-5bd18f616e3a?auto=format&fit=crop&w=1000&q=80",alt:"Atención a clientes en un establecimiento comercial"},
  teamwork:{src:pexels(8117471),alt:"Equipo desarrollando ideas en una sesión creativa"},
  business:{src:"https://images.unsplash.com/photo-1758519290803-f2b25952a5d7?auto=format&fit=crop&w=1000&q=80",alt:"Emprendedor trabajando en un establecimiento"},
  appointment:{src:pexels(3884101),alt:"Profesional de salud y paciente"},
} as const;
export type StoryImageKey=keyof typeof peopleImages;
export const photoForService:Record<string,StoryImageKey[]>={
 "diagnostico-negocio-manizales":["consultancy","realtor","brand"],
 "paginas-web-manizales":["dentist","realtor","restaurant","fastfood","doctor"],
 "contenido-publicitario-manizales":["restaurant","fastfood","brand"],
 "publicidad-meta-ads":["realtorDetail","dentistDetail","fastfoodDetail"],
 "crear-marca-negocio-desde-cero":["brand","entrepreneur","consultancy"],
};
