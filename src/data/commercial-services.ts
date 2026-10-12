export type CommercialService = {
  slug: string;
  name: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  audience: string;
  deliverables: string[];
  process: string[];
  questions: [string, string][];
  cta: string;
};
export const commercialServices: CommercialService[] = [
  {
    slug: "diseno-grafico-publicitario", name: "Diseño y comunicación", title: "Diseño gráfico publicitario en Manizales | Cómplice Lab",
    description: "Diseño gráfico para marcas y negocios: piezas publicitarias, carruseles, catálogos, presentaciones y comunicación visual en Manizales.",
    headline: "Diseño publicitario que comunica antes de decorar.",
    intro: "Creamos piezas gráficas que responden al mensaje, al público y al canal. Buscamos consistencia visual para que tu marca se vea profesional en cada punto de contacto.",
    audience: "Negocios que necesitan materiales gráficos para campañas, redes sociales, propuestas comerciales y comunicación de marca.",
    deliverables: ["Piezas publicitarias digitales e impresas según alcance", "Carruseles, posts y materiales para redes", "Presentaciones y catálogos", "Adaptaciones a formatos y canales", "Consistencia con la identidad de marca"],
    process: ["Entendemos objetivo y mensaje", "Definimos estilo y formatos", "Diseñamos propuestas para revisión", "Entregamos los archivos acordados"],
    questions: [["¿Diseñan piezas sin crear la marca?", "Sí. Podemos trabajar con tu identidad existente y sus lineamientos."],["¿También realizan catálogos?", "Sí, según contenido, cantidad de productos y formatos requeridos."]],
    cta: "Solicitar propuesta de diseño"
  },
  {
    slug: "contenido-redes-sociales", name: "Contenido para redes", title: "Creación de contenido y reels en Manizales | Cómplice Lab",
    description: "Estrategia y creación de contenido para redes sociales en Manizales: ideas, guiones, reels, grabación, edición y piezas para marcas.",
    headline: "Contenido con una idea clara detrás de cada publicación.",
    intro: "Diseñamos contenido que conecta la personalidad de tu marca con lo que le interesa a tu público. Desde el concepto y el guion hasta las piezas y reels según el proyecto.",
    audience: "Marcas, emprendimientos y empresas que quieren comunicar mejor sus productos y servicios en redes sociales.",
    deliverables: ["Ideas y estrategia de contenido", "Conceptos y guiones", "Reels y edición según alcance", "Piezas para redes y publicaciones", "Calendario y recomendaciones de comunicación"],
    process: ["Conocemos marca y audiencia", "Planeamos temas y formatos", "Producimos las piezas acordadas", "Revisamos resultados y aprendizajes"],
    questions: [["¿Graban y editan reels?", "Sí, la grabación y edición pueden incluirse en la propuesta según necesidades y logística."],["¿El servicio incluye publicación?", "Definimos si la programación y publicación forman parte del alcance antes de comenzar."]],
    cta: "Hablar sobre mi contenido"
  },
  {
    slug: "paginas-web-manizales", name: "Páginas web", title: "Creación de páginas web en Manizales | Cómplice Lab",
    description: "Diseño y creación de páginas web, landing pages y sitios comerciales en Manizales y Colombia. Hablemos de una web clara, rápida y orientada a clientes.",
    headline: "Páginas web pensadas para convertir visitas en oportunidades.",
    intro: "Creamos sitios para presentar tus servicios, recibir solicitudes, mostrar productos y facilitar el contacto. Partimos del objetivo de tu negocio y diseñamos una experiencia adaptable a celular y computador.",
    audience: "Emprendedores, profesionales y empresas que necesitan presencia digital, una landing para campañas o una web comercial.",
    deliverables: ["Estructura y contenido según tus objetivos", "Diseño responsive y experiencia de usuario", "Landing pages o sitios corporativos según alcance", "Llamadas a la acción y canales de contacto", "Configuración y publicación acordadas para cada proyecto"],
    process: ["Diagnóstico del negocio y objetivo principal", "Propuesta de estructura, mensajes y recorrido del cliente", "Diseño, desarrollo y revisión", "Publicación y orientación para gestionar el sitio"],
    questions: [["¿Pueden crear una página desde cero?", "Sí. Definimos juntos el alcance, el contenido, las funcionalidades y los requisitos técnicos antes de cotizar."],["¿Puede tener WhatsApp, formularios o reservas?", "Podemos evaluar esas funciones según tu proceso comercial y las integraciones disponibles."],["¿Trabajan fuera de Manizales?", "Sí. Estamos en Manizales y podemos desarrollar proyectos para clientes en otras ciudades de Colombia."]],
    cta: "Solicitar diagnóstico de mi página web"
  },
  {
    slug: "agencia-publicidad-manizales", name: "Agencia de publicidad", title: "Agencia de publicidad en Manizales | Cómplice Lab",
    description: "Agencia creativa en Manizales: estrategia, diseño, campañas, contenido y soluciones digitales para marcas. Solicita un diagnóstico de tu publicidad.",
    headline: "Publicidad con estrategia, creatividad y objetivos claros.",
    intro: "Acompañamos a marcas y negocios a definir qué comunicar, a quién llegar y qué acciones priorizar. Combinamos criterio publicitario, diseño, contenido y herramientas digitales.",
    audience: "Negocios, emprendedores y empresas que necesitan ordenar su comunicación o poner en marcha una estrategia publicitaria.",
    deliverables: ["Diagnóstico de comunicación y oportunidades", "Estrategia y concepto creativo", "Diseño de piezas y mensajes", "Propuesta de medios y canales según el objetivo", "Acompañamiento para medir y ajustar"],
    process: ["Conocemos tu negocio, oferta y público", "Definimos objetivos y prioridades", "Diseñamos una propuesta de acciones", "Ejecutamos y revisamos resultados según el servicio contratado"],
    questions: [["¿Debo contratar todos los servicios?", "No. Puedes solicitar un proyecto puntual o una propuesta de acompañamiento."],["¿Trabajan con negocios pequeños?", "Sí. Evaluamos necesidades de emprendedores, marcas y empresas."],["¿Garantizan ventas?", "No ofrecemos promesas de ventas ni posiciones garantizadas. Definimos objetivos y métricas realistas para cada proyecto."]],
    cta: "Agendar diagnóstico publicitario"
  },
  {
    slug: "marketing-digital-manizales", name: "Marketing digital", title: "Marketing digital en Manizales para negocios | Cómplice Lab",
    description: "Estrategia de marketing digital en Manizales y Colombia: campañas, contenido, presencia web y medición. Conoce cómo podemos acompañar tu negocio.",
    headline: "Marketing digital conectado con lo que necesita tu negocio.",
    intro: "Organizamos acciones digitales alrededor de una oferta, un público y un resultado medible. Evitamos publicar por publicar: estudiamos el recorrido desde el primer contacto hasta la consulta comercial.",
    audience: "Empresas y emprendedores que quieren ordenar sus canales, mejorar sus mensajes y captar oportunidades.",
    deliverables: ["Revisión de presencia y canales digitales", "Definición de público y propuesta de valor", "Plan de contenido y campañas según necesidad", "Recomendaciones de páginas de destino y contacto", "Indicadores y acciones de mejora"],
    process: ["Diagnóstico de objetivos y situación actual", "Priorización de canales y recursos", "Implementación del plan acordado", "Seguimiento y ajustes"],
    questions: [["¿Necesito redes sociales y página web?", "Depende de tu público, oferta y objetivos. Recomendamos los canales después del diagnóstico."],["¿Ofrecen campañas de pago?", "Sí. Podemos estructurar estrategias que incluyan publicidad digital según el alcance."],["¿Es solo para Manizales?", "No. Trabajamos desde Manizales con proyectos en Colombia."]],
    cta: "Solicitar diagnóstico de marketing"
  },
  {
    slug: "publicidad-meta-ads", name: "Publicidad en Meta Ads", title: "Publicidad en Facebook e Instagram Ads | Cómplice Lab",
    description: "Estrategia y gestión de campañas Meta Ads en Facebook e Instagram para negocios. Creativos, segmentación, pruebas y optimización según tus objetivos.",
    headline: "Campañas de Meta Ads que parten de una estrategia.",
    intro: "Una campaña necesita más que activar anuncios. Revisamos oferta, creatividad, público, destino y seguimiento para construir un proceso de mejora basado en datos.",
    audience: "Negocios que desean dar a conocer sus servicios, captar interesados o promocionar productos mediante Facebook e Instagram.",
    deliverables: ["Revisión de oferta y objetivo de campaña", "Estructura de campañas y públicos", "Mensajes y propuestas creativas", "Configuración y pruebas según alcance", "Lectura de métricas y oportunidades de optimización"],
    process: ["Diagnóstico de producto, público y activos", "Plan de campañas y presupuesto propuesto", "Activación, medición y pruebas", "Revisión de resultados y próximos pasos"],
    questions: [["¿El presupuesto publicitario está incluido?", "La inversión en anuncios se define por separado dentro de la propuesta comercial."],["¿Pueden dirigir anuncios a WhatsApp?", "Sí, cuando sea apropiado para el objetivo y la configuración de la campaña."],["¿Garantizan resultados?", "No. La respuesta depende de factores como oferta, competencia, presupuesto y mercado."]],
    cta: "Revisar mis campañas de Meta Ads"
  },
  {
    slug: "branding-identidad-marca", name: "Branding e identidad", title: "Branding y diseño de marca en Manizales | Cómplice Lab",
    description: "Naming, estrategia de marca, identidad visual, logotipo y sistemas gráficos en Manizales y Colombia. Construye una marca coherente con Cómplice Lab.",
    headline: "Una identidad de marca que tenga sentido antes de verse bonita.",
    intro: "Diseñamos marcas con una dirección clara: qué representan, cómo se diferencian y cómo deben comunicarse. El resultado visual responde a decisiones estratégicas.",
    audience: "Emprendedores que crean una marca y empresas que necesitan ordenar o renovar su identidad.",
    deliverables: ["Análisis inicial de marca y contexto", "Concepto y dirección creativa", "Logotipo e identidad visual según alcance", "Paleta, tipografías y sistema gráfico", "Aplicaciones y lineamientos de uso acordados"],
    process: ["Conversación sobre negocio y público", "Definición conceptual y dirección visual", "Desarrollo y validación de propuestas", "Entrega de archivos y recomendaciones según alcance"],
    questions: [["¿Solo hacen logotipos?", "Podemos evaluar entregables puntuales, pero recomendamos partir del contexto de la marca."],["¿También crean nombres?", "Sí. El naming forma parte de los servicios que podemos proponer según las necesidades del proyecto."],["¿Trabajan marcas fuera de Manizales?", "Sí. Podemos trabajar de manera remota con clientes de Colombia."]],
    cta: "Solicitar diagnóstico de mi marca"
  }
];
export const serviceHref = (slug: string) => `/servicios/${slug}`;
