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
 ["Diagnóstico de negocio y ventas","Aprende a revisar tu marca, tu oferta y qué puedes mejorar para captar consultas y oportunidades."],
 ["Diseño de páginas web con IA","Crea sitios que presenten servicios, reciban citas, pedidos o ventas, sin empezar programando."],
 ["Sistemas y academias online","Conoce cómo plantear paneles administrativos, áreas privadas y cursos digitales."],
 ["Imágenes publicitarias y contenido","Aprende a crear anuncios, catálogos, ideas visuales y piezas atractivas para tus productos."],
 ["Reels y video para redes","Guion, grabación y edición práctica para comunicar tus servicios."],
 ["Publicidad en Facebook e Instagram","Aprende a estructurar anuncios, públicos y objetivos con Meta Ads."],
 ["Construcción de marca desde cero","De la idea al nombre, identidad visual, comunicación y primeros pasos del negocio."],
 ["IA aplicada al trabajo","Aprende a utilizar herramientas, prompts y flujos que faciliten las tareas de tu negocio o equipo."]
] as const;

export type Project = {
  name: string;
  category: string;
  description: string;
  services: string[];
  href?: string;
  visual: "camilo" | "home" | "brand" | "interiors" | "roots" | "pulse";
};

export const projects: Project[] = [
  {
    name: "Camilo Respiro",
    category: "Ecosistema digital · Formación",
    description: "Marca, web, campus privado, membresías, pagos y back office construidos como un solo sistema.",
    services: ["Branding", "UX/UI", "Web", "Campus", "Back office"],
    href: "/proyectos/camilo-respiro",
    visual: "camilo",
  },
  {
    name: "B2Home",
    category: "Negocio digital · Home services",
    description: "Naming, marca, estrategia, web y herramientas comerciales creadas desde cero para una propuesta orientada a Latinoamérica.",
    services: ["Naming", "Branding", "Estrategia", "Web", "Producto digital"],
    href: "/proyectos/b2home",
    visual: "home",
  },
  {
    name: "Cómplice Lab",
    category: "Marca propia · Agencia · Formación",
    description: "Estrategia, branding, web, formación, SEO, analítica y sistema digital construidos como laboratorio de nuestra propia metodología.",
    services: ["Estrategia", "Branding", "Web", "Formación", "Analytics"],
    href: "/proyectos/complice-lab",
    visual: "brand",
  },
  {
    name: "Persianas & Black Out",
    category: "Marca · Negocio creado desde cero",
    description: "Naming, identidad, dirección creativa y comunicación visual desarrollados desde cero para una marca de persianas y soluciones de control de luz.",
    services: ["Branding", "Identidad", "Dirección creativa", "Contenido", "Comercial"],
    href: "/proyectos/persianas-blackout",
    visual: "interiors",
  },
  {
    name: "Mi Raíz",
    category: "Plataforma inmobiliaria · PropTech",
    description: "Marca, web, buscador, panel administrativo y operación inmobiliaria desarrollados como un ecosistema completo.",
    services: ["Branding", "UX/UI", "Web", "Back office", "Asesores"],
    href: "/proyectos/mi-raiz",
    visual: "roots",
  },
  {
    name: "Pulso Data",
    category: "Data app financiera · Membresía",
    description: "Plataforma de análisis bursátil creada desde cero con flujo de opciones, earnings, macroeconomía e integración de múltiples APIs.",
    services: ["UX/UI", "Web App", "APIs", "Data", "Membresía"],
    href: "/proyectos/pulso-data",
    visual: "pulse",
  },
];

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
