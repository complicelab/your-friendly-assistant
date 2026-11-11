import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Términos y Condiciones | Cómplice Lab" },
      {
        name: "description",
        content:
          "Términos generales de uso, servicios, publicidad digital, automatización e inteligencia artificial de Cómplice Lab.",
      },
      { property: "og:title", content: "Términos y Condiciones | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Condiciones generales aplicables al uso de complicelab.com y a los servicios de Cómplice Lab.",
      },
      { property: "og:url", content: "https://complicelab.com/terminos" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/terminos" }],
  }),
  component: TermsPage,
});

function TermsPage() {
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
            <p className="eyebrow">INFORMACIÓN LEGAL · SERVICIOS</p>
            <h1>Términos y condiciones.</h1>
            <p>
              Estos términos regulan el uso de complicelab.com y establecen el marco general de los
              servicios ofrecidos por Cómplice Lab. Las condiciones particulares de cada proyecto se
              definirán en la propuesta, orden de servicio o contrato correspondiente.
            </p>
            <p className="legal-updated">Última actualización: 8 de noviembre de 2026.</p>
          </div>

          <article className="legal-content">
            <section>
              <h2>1. Uso del sitio</h2>
              <p>
                El sitio tiene fines informativos y comerciales. No debes utilizarlo de forma que
                afecte su seguridad, disponibilidad, integridad o funcionamiento, ni intentar acceder
                sin autorización a sistemas, datos o áreas administrativas.
              </p>
            </section>

            <section>
              <h2>2. Servicios de Cómplice Lab</h2>
              <p>
                Cómplice Lab ofrece principalmente sistemas con IA a la medida, agentes de IA
                automatizados y servicios de captación mediante marketing digital. El alcance exacto
                puede incluir páginas web, asistentes, agendamiento, registro de contactos, CRM,
                automatizaciones, campañas de WhatsApp o correo, paneles administrativos, indicadores,
                Meta Ads y contenido creado con apoyo de inteligencia artificial, según lo acordado en
                cada proyecto.
              </p>
            </section>

            <section>
              <h2>3. Propuestas y contratación</h2>
              <p>
                Ningún texto general del sitio constituye por sí solo una oferta contractual
                irrevocable. Alcance, entregables, tiempos, precio, forma de pago, revisiones, soporte,
                integraciones y responsabilidades se definirán en el documento particular aceptado por
                las partes. En caso de diferencia, prevalecerá ese documento particular.
              </p>
            </section>

            <section>
              <h2>4. Publicidad digital y Meta Ads</h2>
              <p>
                Las campañas publicitarias se ejecutan a través de plataformas de terceros y están
                sujetas a sus políticas, revisiones, restricciones técnicas, disponibilidad y procesos
                de aprobación. Cómplice Lab no controla las decisiones de aprobación, rechazo,
                limitación o suspensión adoptadas por Meta u otras plataformas.
              </p>
              <p>
                En el flujo interno de Cómplice Lab, las campañas de Meta Ads se preparan en pausa para
                revisión antes de cualquier activación que genere gasto. El presupuesto publicitario,
                forma de pago a la plataforma y condiciones de administración se definirán en cada
                propuesta.
              </p>
            </section>

            <section>
              <h2>5. Información y activos suministrados por el cliente</h2>
              <p>
                El cliente es responsable de que la información, imágenes, marcas, testimonios,
                ofertas, promociones, bases de datos y demás materiales que entregue puedan utilizarse
                legalmente y sean veraces. Cómplice Lab puede solicitar ajustes cuando un material
                presente riesgos legales, de plataforma, reputacionales o de experiencia.
              </p>
            </section>

            <section>
              <h2>6. Leads, formularios y datos personales</h2>
              <p>
                Los datos obtenidos mediante formularios propios, formularios de Meta u otros canales
                se utilizarán de acuerdo con nuestra
                <a href="/privacidad"> Política de privacidad</a>, las finalidades informadas y la
                normativa aplicable. Cómplice Lab no comercializa bases de datos de prospectos obtenidas
                para atender solicitudes de sus servicios.
              </p>
            </section>

            <section>
              <h2>7. WhatsApp, correo y seguimiento</h2>
              <p>
                Las comunicaciones por WhatsApp, correo u otros canales deben respetar la autorización,
                finalidad y preferencias del destinatario. La disponibilidad de APIs, plantillas,
                categorías de mensajes, costos y reglas depende de cada proveedor y puede cambiar.
              </p>
            </section>

            <section>
              <h2>8. Automatización y agentes de IA</h2>
              <p>
                Algunos sistemas pueden utilizar inteligencia artificial para responder, clasificar,
                resumir, agendar o apoyar seguimiento. Estos sistemas pueden requerir configuración,
                supervisión, límites de actuación y acceso a información necesaria para cumplir la
                finalidad contratada. Salvo confirmación expresa en la propuesta, una demostración no
                implica que todas las integraciones mostradas estén operativas en producción.
              </p>
            </section>

            <section>
              <h2>9. CRM, integraciones y servicios de terceros</h2>
              <p>
                Los proyectos pueden conectarse con bases de datos, CRM, calendarios, mensajería,
                hosting, analítica, IA y otros servicios de terceros. Cambios en APIs, precios,
                políticas, disponibilidad o límites de esos proveedores pueden afectar funciones y
                requerir ajustes posteriores.
              </p>
            </section>

            <section>
              <h2>10. Resultados y expectativas</h2>
              <p>
                Cómplice Lab diseña sistemas y campañas orientados a mejorar percepción, captación,
                organización y seguimiento, pero no garantiza cantidades específicas de clientes,
                ventas, citas, facturación, retorno publicitario ni resultados económicos. El
                desempeño depende también de oferta, reputación, mercado, competencia, inversión,
                capacidad comercial y decisiones de terceros.
              </p>
            </section>

            <section>
              <h2>11. Demos, proyectos y cifras de ejemplo</h2>
              <p>
                Las demostraciones, mockups, showrooms y cifras expresamente identificadas como ejemplo
                tienen fines ilustrativos. Los proyectos construidos pueden mostrarse como ejemplos de
                sistemas creados con IA, sin que ello implique atribuir resultados comerciales,
                testimonios o funcionalidades operativas no confirmadas.
              </p>
            </section>

            <section>
              <h2>12. Propiedad intelectual</h2>
              <p>
                La identidad, textos, conceptos, diseños, código, metodologías y materiales originales
                de Cómplice Lab están protegidos por la normativa aplicable. La titularidad y permisos
                sobre entregables específicos se regirán por lo acordado en la propuesta o contrato.
              </p>
            </section>

            <section>
              <h2>13. Pagos, cambios y cancelaciones</h2>
              <p>
                Las condiciones de pago, anticipo, renovación, suspensión, reprogramación, cambios,
                cancelación o devolución se informarán en el documento particular del servicio y
                prevalecerán sobre estos términos generales.
              </p>
            </section>

            <section>
              <h2>14. Disponibilidad y seguridad</h2>
              <p>
                Podemos actualizar, modificar o suspender temporalmente funciones por mantenimiento,
                seguridad, cambios de proveedores o razones técnicas. No está permitido intentar
                vulnerar controles de acceso, extraer información sin autorización o interferir con
                los sistemas.
              </p>
            </section>

            <section>
              <h2>15. Privacidad</h2>
              <p>
                El tratamiento de datos personales se rige por nuestra
                <a href="/privacidad"> Política de privacidad y tratamiento de datos</a>.
              </p>
            </section>

            <section>
              <h2>16. Ley aplicable</h2>
              <p>
                Estos términos se interpretan conforme a las leyes de la República de Colombia, sin
                perjuicio de las normas imperativas aplicables en cada caso.
              </p>
            </section>

            <section>
              <h2>17. Contacto</h2>
              <p>
                Para preguntas sobre estos términos puedes escribir a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a> o a
                <a href="mailto:complicelab@gmail.com"> complicelab@gmail.com</a>.
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
