/**
 * Fotografía editorial ilustrativa bajo licencia Unsplash.
 * Estas imágenes NO representan clientes, colaboradores ni resultados reales de Cómplice Lab.
 * Mantener sus créditos/fuentes para revisar licencias y reemplazarlas por material propio.
 */
export const peopleImages = {
  entrepreneur: {
    src: "https://images.unsplash.com/photo-1765648580808-76d75e4f3833?auto=format&fit=crop&w=1100&q=82",
    alt: "Emprendedora sonriente trabajando con su computador en un café",
    credit: "FOTOGRAFÍA EDITORIAL / Unsplash",
    source: "https://unsplash.com/photos/a-smiling-woman-works-on-a-laptop-at-a-cafe-9nk--dNEPyE",
  },
  salon: {
    src: "https://images.unsplash.com/photo-1746723372913-5bd18f616e3a?auto=format&fit=crop&w=950&q=82",
    alt: "Atención comercial a una cliente en un salón de belleza",
    credit: "SumUp / Unsplash",
    source: "https://unsplash.com/photos/a-hairstylist-checks-out-a-customer-at-the-register-bpHR9U5XiTE",
  },
  teamwork: {
    src: "https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?auto=format&fit=crop&w=1150&q=82",
    alt: "Equipo creativo reunido alrededor de una pantalla trabajando en conjunto",
    credit: "Vitaly Gariev / Unsplash",
    source: "https://unsplash.com/photos/team-collaborating-around-a-computer-in-an-office-UikYLDQj9_I",
  },
  consultancy: {
    src: "https://images.unsplash.com/photo-1758518727077-ffb66ffccced?auto=format&fit=crop&w=1100&q=82",
    alt: "Profesionales conversando acerca de un proyecto empresarial",
    credit: "Vitaly Gariev / Unsplash",
    source: "https://unsplash.com/photos/three-people-in-a-business-meeting-discussing-documents-1uf2JCPFAkU",
  },
  business: {
    src: "https://images.unsplash.com/photo-1758519290803-f2b25952a5d7?auto=format&fit=crop&w=1100&q=82",
    alt: "Emprendedor satisfecho trabajando con su computador en un café",
    credit: "Vitaly Gariev / Unsplash",
    source: "https://unsplash.com/photos/man-laughing-while-working-on-laptop-in-cafe-pP_g_3qea0E",
  },
  appointment: {
    src: "https://images.unsplash.com/photo-1750263147723-ebd447918d89?auto=format&fit=crop&w=1100&q=82",
    alt: "Profesional atendiendo a una cliente en su negocio",
    credit: "SumUp / Unsplash",
    source: "https://unsplash.com/photos/a-hairstylist-is-working-on-a-customers-hair-ok2aIXX8fZw",
  },
} as const;
export const photoForService: Record<string, (keyof typeof peopleImages)[]> = {
  "paginas-web-manizales": ["salon", "entrepreneur", "appointment"],
  "agencia-publicidad-manizales": ["consultancy", "salon", "teamwork"],
  "marketing-digital-manizales": ["entrepreneur", "consultancy", "salon"],
  "publicidad-meta-ads": ["business", "salon", "teamwork"],
  "branding-identidad-marca": ["salon", "entrepreneur", "consultancy"],
  "diseno-grafico-publicitario": ["entrepreneur", "salon", "teamwork"],
  "contenido-redes-sociales": ["salon", "appointment", "entrepreneur"],
};
