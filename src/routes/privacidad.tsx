import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad y Tratamiento de Datos | Cómplice Lab" },
      {
        name: "description",
        content:
          "Política de privacidad y tratamiento de datos de Cómplice Lab para formularios, CRM, Meta Ads, WhatsApp, automatización e inteligencia artificial.",
      },
      { property: "og:title", content: "Política de Privacidad | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Conoce cómo Cómplice Lab recolecta, usa, protege y permite gestionar tus datos personales.",
      },
      { property: "og:url", content: "https://complicelab.com/privacidad" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/privacidad" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="legal-page">
      <header className="formation-nav">
        <div className="nav-wrap">
          <BrandMark />
          <a className="formation-back" href="/">Volver al sitio</a>
        </div>
      </header>

      <main className="section">
        <div className="container legal-layout">
          <div className="legal-intro">
            <p className="eyebrow">PRIVACIDAD · DATOS PERSONALES</p>
            <h1>Política de privacidad y tratamiento de datos.</h1>
            <p>
              Esta política explica cómo Cómplice Lab trata la información que recibimos desde
              complicelab.com, formularios, campañas publicitarias, WhatsApp, correo y otros canales
              usados para atender solicitudes y gestionar oportunidades comerciales.
            </p>
            <p className="legal-updated">Última actualización: 8 de noviembre de 2026.</p>
          </div>

          <article className="legal-content">
            <section>
              <h2>1. Responsable y canales de contacto</h2>
              <p>
                Para los datos recolectados directamente por este sitio y por los canales comerciales
                asociados, el responsable actúa bajo la marca Cómplice Lab. Para consultas, reclamos o
                solicitudes relacionadas con datos personales puedes escribir a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a> o a
                <a href="mailto:complicelab@gmail.com"> complicelab@gmail.com</a>, o comunicarte por
                WhatsApp al
                <a href="https://api.whatsapp.com/send?phone=573161772880" target="_blank" rel="noreferrer noopener">
                  {" "}+57 316 177 2880
                </a>.
              </p>
              <p>
                Antes de usar esta política como documento corporativo definitivo, los datos de
                identificación legal del responsable deberán completarse cuando corresponda.
              </p>
            </section>

            <section>
              <h2>2. Marco aplicable</h2>
              <p>
                Cómplice Lab trata datos personales conforme a la normativa colombiana aplicable,
                incluida la Ley 1581 de 2012 y sus normas reglamentarias incorporadas en el Decreto
                1074 de 2015, además de las obligaciones aplicables al uso de plataformas de terceros.
              </p>
            </section>

            <section>
              <h2>3. Qué información podemos recolectar</h2>
              <p>
                Dependiendo del canal, podemos recibir nombre y apellido, marca personal o empresa,
                país, ciudad, indicativo, teléfono o WhatsApp, correo electrónico, profesión, sector,
                tipo de negocio, servicio de interés, necesidades comerciales, mensajes enviados,
                fecha y fuente del contacto, estado de seguimiento, citas, notas comerciales y
                respuestas dadas durante una conversación.
              </p>
              <p>
                También podemos registrar información técnica razonable para seguridad, funcionamiento,
                analítica y atribución, como página de origen, campaña, anuncio, dispositivo, navegador,
                fecha, hora y eventos de navegación cuando las herramientas utilizadas lo permitan.
              </p>
            </section>

            <section>
              <h2>4. De dónde pueden provenir los datos</h2>
              <ul>
                <li>formularios de complicelab.com y landings de Cómplice Lab;</li>
                <li>formularios instantáneos o herramientas de generación de clientes potenciales de Meta;</li>
                <li>conversaciones iniciadas por el usuario en WhatsApp, Instagram, Messenger o correo;</li>
                <li>agendamientos, videollamadas y formularios conectados a nuestros sistemas;</li>
                <li>información entregada directamente por clientes, prospectos o representantes autorizados.</li>
              </ul>
            </section>

            <section>
              <h2>5. Para qué usamos la información</h2>
              <ul>
                <li>responder una solicitud y entender qué necesita la persona o empresa;</li>
                <li>realizar un diagnóstico inicial y recomendar el servicio más adecuado;</li>
                <li>contactar, agendar y confirmar reuniones o videollamadas;</li>
                <li>registrar el contacto en nuestro CRM y evitar que una oportunidad se pierda;</li>
                <li>organizar estados, tareas, notas, recordatorios y seguimiento comercial;</li>
                <li>preparar propuestas, cotizaciones o comunicaciones relacionadas con la solicitud;</li>
                <li>medir el origen de los contactos y el funcionamiento de campañas y páginas;</li>
                <li>mejorar la experiencia, seguridad y funcionamiento de nuestros sistemas;</li>
                <li>cumplir obligaciones legales, contractuales y de seguridad.</li>
              </ul>
            </section>

            <section>
              <h2>6. WhatsApp, automatización y agentes de IA</h2>
              <p>
                Cuando una persona solicita contacto o inicia una conversación, Cómplice Lab puede
                utilizar herramientas de automatización o inteligencia artificial para clasificar la
                solicitud, responder preguntas iniciales, recopilar información necesaria, proponer
                horarios, registrar interacciones, generar recordatorios y apoyar el seguimiento.
              </p>
              <p>
                El uso de automatización no autoriza finalidades distintas de las informadas. Las
                comunicaciones comerciales adicionales se enviarán únicamente cuando exista una base
                legal o autorización adecuada, y el titular podrá solicitar que cesen.
              </p>
            </section>

            <section>
              <h2>7. Meta Ads, formularios de Meta y tecnologías publicitarias</h2>
              <p>
                Cómplice Lab puede utilizar Meta Ads y sus herramientas para promocionar servicios,
                medir campañas y recibir solicitudes. Cuando un usuario completa un formulario de Meta,
                la información entregada será usada para atender esa solicitud, registrarla en el CRM y
                realizar el seguimiento informado.
              </p>
              <p>
                Si se utilizan Pixel de Meta, Conversion API u otras tecnologías de medición, se
                informará y gestionará su uso de acuerdo con la configuración implementada, la normativa
                aplicable y las políticas vigentes de la plataforma. Cómplice Lab no vende los datos de
                prospectos obtenidos mediante formularios publicitarios.
              </p>
            </section>

            <section>
              <h2>8. Autorización y comunicaciones comerciales</h2>
              <p>
                Cuando la ley lo requiera, solicitaremos autorización previa, expresa e informada. La
                autorización necesaria para responder una solicitud no implica por sí sola aceptar
                publicidad futura. Cuando se solicite autorización para promociones, novedades,
                campañas o comunicaciones comerciales adicionales, esta se presentará de forma
                diferenciada cuando corresponda.
              </p>
            </section>

            <section>
              <h2>9. CRM y conservación de historial</h2>
              <p>
                Los contactos pueden almacenarse en un CRM interno para conocer quién llegó, desde qué
                canal, qué necesita, en qué etapa se encuentra y cuándo corresponde hacer seguimiento.
                El historial puede incluir mensajes relevantes, citas, estados, etiquetas, tareas,
                notas y eventos comerciales necesarios para gestionar la relación.
              </p>
            </section>

            <section>
              <h2>10. Proveedores, encargados y transferencias</h2>
              <p>
                Para operar el sitio y los servicios podemos utilizar proveedores de hosting,
                almacenamiento, bases de datos, CRM, analítica, automatización, correo, WhatsApp,
                inteligencia artificial y publicidad. Estos terceros pueden tratar información por
                cuenta nuestra o bajo sus propias políticas según el servicio utilizado, incluso desde
                otros países. Procuramos limitar el acceso a lo necesario para la finalidad informada.
              </p>
            </section>

            <section>
              <h2>11. Derechos del titular</h2>
              <p>
                El titular puede conocer, actualizar y rectificar sus datos; solicitar prueba de la
                autorización cuando corresponda; conocer el uso dado a su información; presentar
                consultas o reclamos; solicitar supresión cuando proceda; y revocar la autorización en
                los casos permitidos por la ley.
              </p>
            </section>

            <section>
              <h2>12. Cómo ejercer tus derechos</h2>
              <p>
                Envía tu solicitud a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a> indicando tu nombre,
                medio de contacto, petición concreta y la información necesaria para identificar el
                registro. Podemos solicitar una verificación razonable de identidad antes de entregar,
                modificar o eliminar información.
              </p>
            </section>

            <section>
              <h2>13. Seguridad</h2>
              <p>
                Aplicamos medidas técnicas, administrativas y organizacionales razonables para reducir
                riesgos de pérdida, alteración, consulta, uso o acceso no autorizado. Los accesos al CRM
                y a herramientas internas deben estar restringidos a usuarios autorizados.
              </p>
            </section>

            <section>
              <h2>14. Conservación y eliminación</h2>
              <p>
                Conservamos la información durante el tiempo necesario para atender la solicitud,
                gestionar la relación comercial, cumplir obligaciones contractuales o legales y
                mantener registros razonables de seguridad y trazabilidad. Cuando la información deje
                de ser necesaria y no exista obligación de conservarla, podrá eliminarse o anonimizarse.
              </p>
            </section>

            <section>
              <h2>15. Datos sensibles y menores</h2>
              <p>
                Nuestros formularios comerciales no están diseñados para recolectar datos sensibles ni
                información de menores de edad. Si un servicio excepcionalmente requiriera datos de esta
                naturaleza, se aplicarán las medidas y autorizaciones adicionales correspondientes.
              </p>
            </section>

            <section>
              <h2>16. Cookies y medición</h2>
              <p>
                El sitio puede utilizar tecnologías necesarias para seguridad y funcionamiento, y
                herramientas de analítica o medición publicitaria. Cuando una tecnología requiera
                consentimiento o información adicional, se implementarán los avisos y controles
                correspondientes antes de su uso cuando sea exigible.
              </p>
            </section>

            <section>
              <h2>17. Cambios a esta política</h2>
              <p>
                Esta política puede actualizarse por cambios legales, tecnológicos, operativos o en
                nuestros servicios. La versión vigente estará disponible en esta URL con su fecha de
                actualización.
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
