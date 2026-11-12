export type CommercialService = {
  slug:string;name:string;title:string;description:string;headline:string;intro:string;audience:string;
  deliverables:string[];process:string[];questions:[string,string][];cta:string;benefits:string[];
  scenarios:{kind:string;title:string;detail:string;action:string}[];
};

export const commercialServices:CommercialService[]=[
{
  slug:"paginas-web",
  name:"Páginas Web",
  title:"Páginas Web para Profesionales y Empresas | Cómplice Lab",
  description:"Creamos páginas web premium para profesionales y empresas, pensadas para transmitir confianza y facilitar que las personas escriban, agenden o dejen sus datos.",
  headline:"Páginas web que representan tu nivel y facilitan el siguiente paso.",
  intro:"Creamos páginas web comerciales para profesionales y empresas que necesitan transmitir confianza, explicar mejor su valor y facilitar que una persona escriba, agende o deje sus datos. La página se concentra en presentar mejor el negocio y convertir visitas en contactos; si el proyecto necesita CRM, automatizaciones o seguimiento avanzado, eso se desarrolla dentro de un sistema con IA.",
  audience:"Para profesionales, marcas personales y empresas donde la confianza influye en la compra y una presencia digital genérica ya no representa su nivel.",
  deliverables:[
    "Página web comercial adaptada a celular",
    "Captación mediante agenda, formulario o WhatsApp según el objetivo",
    "Estructura de contenido pensada para explicar valor y facilitar la decisión",
    "Paneles y funciones a medida cuando el proyecto lo requiere"
  ],
  process:[
    "Entendemos el negocio, el cliente y el objetivo comercial",
    "Definimos el recorrido que debe seguir el visitante",
    "Diseñamos y construimos la experiencia",
    "Probamos captación, navegación y funcionamiento antes de publicar"
  ],
  questions:[
    ["¿La página incluye CRM y automatizaciones?","La página se enfoca en presencia, claridad y conversión. Si necesitas CRM, automatizaciones, seguimiento o paneles, los construimos como parte de un sistema con IA a la medida."],
    ["¿Trabajan únicamente en Manizales?","No. Trabajamos 100% online con profesionales y empresas en Colombia y otros mercados."]
  ],
  cta:"Quiero una página que represente mi nivel",
  benefits:["Mejor percepción de valor","Más facilidad para contactar o agendar","Una base digital preparada para crecer"],
  scenarios:[
    {kind:"consultancy",title:"Una presencia digital a la altura del servicio",detail:"La página debe explicar bien tu valor y facilitar el siguiente paso, no limitarse a verse bonita.",action:"Quiero mejorar mi página"}
  ]
},
{
  slug:"publicidad-digital",
  name:"Publicidad Digital",
  title:"Publicidad Digital para Profesionales y Empresas | Cómplice Lab",
  description:"Creamos campañas de publicidad digital en Meta Ads, Google Ads y otras plataformas para atraer personas interesadas en servicios de alto valor.",
  headline:"Publicidad para atraer a las personas correctas.",
  intro:"Diseñamos y gestionamos campañas pagas para poner tu oferta frente a personas con mayor probabilidad de interesarse. Según el negocio y la intención de búsqueda podemos trabajar Meta Ads, Google Ads u otras plataformas. El foco de este servicio es atraer demanda; la página web, la agenda, el CRM y las automatizaciones se construyen por separado cuando el negocio las necesita.",
  audience:"Para profesionales y empresas que ya tienen una oferta clara y quieren aumentar su visibilidad ante personas con intención real de conocer, consultar o contratar.",
  deliverables:[
    "Estrategia de campaña según oferta, público y objetivo comercial",
    "Campañas en Meta Ads, Google Ads u otras plataformas cuando la estrategia lo justifica",
    "Creatividades y piezas publicitarias creadas con apoyo de IA, dicho con claridad",
    "Configuración, seguimiento y optimización de campañas",
    "Lectura de métricas para entender qué anuncios y audiencias generan mejor respuesta"
  ],
  process:[
    "Revisamos la oferta, el cliente y el objetivo",
    "Definimos plataforma, mensajes y recorrido de captación",
    "Creamos las campañas en pausa para revisión",
    "Después de tu aprobación, se activan y se optimizan con datos reales"
  ],
  questions:[
    ["¿Trabajan únicamente Meta Ads?","No. La plataforma se define según el objetivo y el tipo de demanda. Podemos trabajar Meta Ads, Google Ads u otras plataformas cuando la estrategia lo justifica."],
    ["¿La publicidad incluye página web, CRM o automatizaciones?","No necesariamente. Publicidad Digital se concentra en atraer oportunidades. Si el negocio necesita una nueva página, CRM, agenda o automatizaciones, eso se desarrolla como un servicio adicional o como parte de un sistema más completo."],
    ["¿Garantizan una cantidad de clientes?","No. Podemos mejorar la captación y la calidad de la campaña, pero no prometer una cantidad fija de ventas."]
  ],
  cta:"Quiero atraer mejores oportunidades",
  benefits:["Más personas correctas viendo tu oferta","Mayor claridad sobre qué mensajes generan respuesta","Mejor control de qué campañas atraen interés"],
  scenarios:[
    {kind:"doctor",title:"Del anuncio a una acción concreta",detail:"La campaña lleva a una experiencia donde la persona entiende la oferta y puede agendar, escribir o dejar sus datos sin perderse.",action:"Quiero revisar mi captación"},
    {kind:"realtor",title:"Menos contactos sueltos",detail:"La captación se organiza para que el negocio sepa quién llegó, qué necesita y cuál es el siguiente paso.",action:"Quiero organizar mis oportunidades"}
  ]
},
{
  slug:"sistemas-ia-a-la-medida",
  name:"Sistemas con IA a la medida",
  title:"Sistemas con IA a la Medida | Cómplice Lab",
  description:"Construimos sistemas con IA a la medida para organizar, automatizar y dar seguimiento a procesos del negocio mediante CRM, agenda, paneles, integraciones, automatizaciones y agentes de IA.",
  headline:"Tecnología construida alrededor de cómo realmente funciona tu negocio.",
  intro:"Construimos sistemas alrededor de cómo realmente funciona el negocio: CRM, agenda, paneles administrativos, automatizaciones, agentes de IA, integraciones e indicadores. Cuando una página web forma parte del ecosistema, puede conectarse al sistema, pero el foco de este servicio es organizar y hacer avanzar la operación y el seguimiento.",
  audience:"Para profesionales y empresas que necesitan una solución construida alrededor de su operación, desde una función puntual hasta un ecosistema completo para captar, atender, administrar o dar seguimiento.",
  deliverables:[
    "Página web, portal o experiencia digital cuando el proyecto lo necesita",
    "Sistema administrativo o paneles para la operación",
    "CRM, agendamiento y registro de oportunidades según el alcance",
    "Automatizaciones, agentes de IA y seguimiento cuando aportan valor",
    "Indicadores, integraciones y funciones específicas construidas a medida"
  ],
  process:[
    "Entendemos cómo funciona el negocio y qué necesita resolver",
    "Definimos qué debe hacer el sistema, qué información necesita y quién lo usa",
    "Construimos e integramos únicamente los componentes necesarios",
    "Probamos cada recorrido antes de ponerlo en operación"
  ],
  questions:[
    ["¿Es un software estándar que se adapta?","No. El alcance se define a partir del proceso real del negocio y construimos los componentes que necesita, desde una página o panel hasta un sistema administrativo completo."],
    ["¿Todo tiene que automatizarse?","No. Automatizamos solo lo que mejora la experiencia, la operación o el seguimiento; lo que necesita criterio humano puede quedarse en manos del equipo."]
  ],
  cta:"Quiero revisar mi proceso",
  benefits:["Menos oportunidades perdidas","Información comercial organizada","Un proceso más fácil de seguir"],
  scenarios:[
    {kind:"consultancy",title:"De varios puntos sueltos a un solo recorrido",detail:"La web, la agenda, el CRM y el seguimiento dejan de funcionar por separado y comparten la misma información.",action:"Quiero ver cómo se conectaría"},
    {kind:"dentist",title:"Cada contacto con contexto",detail:"El negocio puede saber quién llegó, qué necesita, cuándo tiene cita y qué acción sigue.",action:"Quiero organizar mi proceso"}
  ]
},
{
  slug:"agentes-de-ia",
  name:"Agentes de IA automatizados",
  title:"Agentes de IA para Profesionales y Empresas | Cómplice Lab",
  description:"Creamos agentes de IA que responden, filtran, agendan y hacen seguimiento dentro de procesos definidos para profesionales y empresas.",
  headline:"Atención que sigue avanzando incluso cuando tú no estás.",
  intro:"Construimos agentes de IA para responder consultas, filtrar oportunidades, ayudar a agendar y hacer seguimiento dentro de un proceso definido. El objetivo es que el equipo reciba mejor contexto y atienda mejor las oportunidades que requieren intervención humana.",
  audience:"Para negocios que reciben consultas repetitivas o pierden oportunidades porque no siempre pueden responder, filtrar y hacer seguimiento a tiempo.",
  deliverables:[
    "Agente de IA diseñado alrededor del proceso del negocio",
    "Respuestas y criterios de filtrado definidos con contexto",
    "Conexión con agenda o captura de datos cuando aplica",
    "Escalamiento al equipo cuando la conversación necesita intervención humana",
    "Seguimiento y registro según las integraciones disponibles"
  ],
  process:[
    "Definimos qué preguntas debe resolver y cuáles debe escalar",
    "Construimos el flujo y el contexto que necesita el agente",
    "Probamos conversaciones y casos límite",
    "Conectamos agenda, datos o seguimiento cuando el alcance lo requiere"
  ],
  questions:[
    ["¿El agente reemplaza a una persona?","No necesariamente. Su función es resolver tareas repetitivas, organizar contexto y escalar al equipo cuando una conversación necesita criterio humano."],
    ["¿Puede agendar y hacer seguimiento?","Sí, cuando esas funciones forman parte del alcance y las integraciones necesarias están disponibles y configuradas."]
  ],
  cta:"Quiero ver un agente aplicado a mi negocio",
  benefits:["Respuesta más consistente","Mejor filtro antes de intervenir","Seguimiento más ordenado"],
  scenarios:[
    {kind:"doctor",title:"Responder y orientar antes de la cita",detail:"El agente puede resolver preguntas iniciales, recoger contexto y facilitar el agendamiento sin fingir que reemplaza la evaluación profesional.",action:"Quiero ver el flujo"},
    {kind:"consultancy",title:"Filtrar antes de pasar al equipo",detail:"Las consultas llegan con mejor contexto para que el equipo dedique tiempo a quienes realmente necesitan avanzar.",action:"Quiero revisar un caso"}
  ]
}
];

export const serviceHref=(slug:string)=>`/${slug}`;
