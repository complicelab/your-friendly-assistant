export type Service = {
  title: string;
  description: string;
  items: string[];
};

export const services: Service[] = [
  {
    title: "Branding e identidad",
    description: "Construimos marcas capaces de comunicar incluso antes de explicar lo que venden.",
    items: ["Naming", "Concepto de marca", "Logotipo", "Identidad visual", "Paleta de colores", "Tipografías", "Sistema gráfico", "Manual de identidad", "Aplicaciones de marca", "Rediseño de marca"],
  },
  {
    title: "Diseño y comunicación",
    description: "Diseño que comunica antes de decorar.",
    items: ["Piezas publicitarias", "Carruseles", "Posts", "Presentaciones", "Catálogos", "Material comercial", "Publicidad digital", "Piezas impresas"],
  },
  {
    title: "Contenido para redes",
    description: "Convertimos ideas en contenido diseñado para comunicar, conectar y vender.",
    items: ["Estrategia", "Ideas", "Conceptos", "Guiones", "Reels", "Grabación", "Edición", "Calendarios", "Contenido apoyado por IA"],
  },
  {
    title: "Publicidad digital",
    description: "No pautamos por pautar. Diseñamos campañas con un objetivo claro.",
    items: ["Meta Ads", "Facebook Ads", "Instagram Ads", "Estrategia", "Creativos", "Copies", "Campañas", "Pruebas", "Optimización"],
  },
  {
    title: "Web y presencia digital",
    description: "Diseñamos experiencias digitales que hacen que tu negocio se vea tan profesional como realmente es.",
    items: ["Landing pages", "Web corporativa", "Web comercial", "Dominio", "Configuración", "Publicación", "Diseño responsive", "Contenido", "Integraciones básicas"],
  },
];

export const ways = [
  {
    key: "CREAMOS",
    tagline: "Lo hacemos por ti.",
    description: "Para personas, marcas y organizaciones que necesitan ejecución profesional sin tener que hacerlo internamente.",
    items: ["Branding", "Diseño", "Contenido", "Publicidad", "Web"],
    cta: "Quiero que lo hagan",
  },
  {
    key: "ENSEÑAMOS",
    tagline: "Te enseñamos a hacerlo.",
    description: "Formación práctica para emprendedores, profesionales, equipos, organizaciones e instituciones.",
    items: ["IA", "Prompts", "Contenido", "Reels", "CapCut", "Meta Ads", "Branding", "Web"],
    cta: "Quiero aprender",
  },
  {
    key: "IMPLEMENTAMOS",
    tagline: "Lo construimos contigo.",
    description: "Para quienes necesitan análisis, estrategia, claridad y acompañamiento.",
    items: ["Estudios de mercado", "Consultoría", "Estrategia de marca", "Estrategia de contenido", "Estrategia publicitaria", "Meta Ads", "IA aplicada", "Acompañamiento"],
    cta: "Quiero implementarlo",
  },
] as const;

export const workshops = [
  ["IA aplicada a negocios", "Herramientas que puedes comenzar a utilizar en tu trabajo desde el mismo día."],
  ["Creación de contenido con IA", "Convierte ideas en conceptos, guiones y piezas con un proceso más ágil."],
  ["Prompts", "Aprende a pedir mejor para obtener resultados más útiles."],
  ["Reels desde cero", "No solamente aprendes cómo se hace. Terminas creando uno."],
  ["CapCut", "Edita contenido con un flujo práctico y replicable."],
  ["Meta Ads", "No solamente ves la plataforma. Terminas entendiendo cómo estructurar una campaña."],
  ["Branding", "Construye decisiones visuales con criterio de marca."],
  ["Creación de páginas web con IA", "Aprendes cómo convertir una idea en una página funcional."],
] as const;

export const projects = [
  "B2Home",
  "Cómplice Lab",
  "Persianas y Blackouts",
  "Mi Raíz",
  "Camilo Respiro",
  "Pulso",
] as const;

export const principles = [
  ["Pensamos antes de crear", "No hacemos piezas porque sí."],
  ["IA aplicada, no IA por moda", "Utilizamos tecnología cuando realmente aporta."],
  ["Enseñamos lo que utilizamos", "Nuestras formaciones nacen de procesos que aplicamos."],
  ["Experiencia real", "Parte de lo que enseñamos viene de haberlo probado."],
  ["Hacemos lo complejo más simple", "Tecnología útil sin complicaciones innecesarias."],
] as const;

export const faqs = [
  ["¿Trabajan solamente en Manizales?", "No. Estamos en Manizales, pero trabajamos con personas, marcas, empresas y equipos de toda Colombia mediante formatos online y proyectos presenciales según el alcance. La propuesta está preparada para crecer también hacia mercados internacionales."],
  ["¿Trabajan solamente con empresas?", "No. Trabajamos con emprendedores, profesionales, marcas, negocios, empresas, equipos, instituciones y organizaciones."],
  ["¿Puedo contratar solamente un servicio?", "Sí. Analizamos qué necesitas y construimos una propuesta según el alcance del proyecto."],
  ["¿También capacitan equipos?", "Sí. Diseñamos talleres y capacitaciones de inteligencia artificial, marketing, publicidad, contenido y herramientas digitales para equipos, empresas, instituciones y organizaciones."],
  ["¿Necesito conocimientos de inteligencia artificial?", "No. Nuestras formaciones están diseñadas para explicar las herramientas de una manera sencilla y práctica."],
  ["¿Ustedes hacen el trabajo o solamente enseñan?", "Ambas opciones. Podemos hacerlo por ti, enseñarte a hacerlo o implementarlo contigo."],
  ["¿Crean páginas web?", "Sí. Desarrollamos landing pages, páginas corporativas y páginas comerciales, además de acompañar la configuración de dominio y presencia digital."],
] as const;
