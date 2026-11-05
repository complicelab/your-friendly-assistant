import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones | Cómplice Lab" },
      {
        name: "description",
        content:
          "Consulta los términos generales de uso del sitio y contratación de servicios de Cómplice Lab.",
      },
      { property: "og:title", content: "Términos y Condiciones | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Condiciones generales aplicables al uso de complicelab.com y a los servicios ofrecidos por Cómplice Lab.",
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
              Estos términos regulan el acceso y uso de complicelab.com y sirven como marco general
              para la información comercial y los servicios ofrecidos por Cómplice Lab.
            </p>
            <p className="legal-updated">Última actualización: 5 de noviembre de 2026.</p>
          </div>

          <article className="legal-content">
            <section>
              <h2>1. Uso del sitio</h2>
              <p>
                El contenido de este sitio tiene fines informativos y comerciales. Puedes navegar,
                consultar nuestros servicios y comunicarte con nosotros mediante los canales
                disponibles. No debes utilizar el sitio de forma que afecte su funcionamiento,
                seguridad, integridad o disponibilidad.
              </p>
            </section>

            <section>
              <h2>2. Servicios y propuestas</h2>
              <p>
                La información publicada describe de forma general servicios relacionados con
                estrategia, presencia digital, páginas web, sistemas comerciales, CRM,
                automatización, integraciones, captación, seguimiento y otras soluciones creativas
                o tecnológicas.
              </p>
              <p>
                El alcance, entregables, tiempos, precio, forma de pago, revisiones, soporte y demás
                condiciones de cada proyecto se definirán en la propuesta, cotización, orden de
                servicio o contrato correspondiente. Cuando exista una diferencia, prevalecerá el
                documento particular aceptado por las partes.
              </p>
            </section>

            <section>
              <h2>3. Resultados y expectativas</h2>
              <p>
                Cómplice Lab trabaja con criterios profesionales orientados a posicionamiento,
                experiencia, conversión y organización comercial. Sin embargo, no garantiza
                cantidades determinadas de clientes, ventas, citas, posiciones en buscadores,
                retornos publicitarios ni resultados económicos específicos, porque estos dependen
                también de factores externos como mercado, presupuesto, competencia, plataformas,
                implementación y decisiones del cliente.
              </p>
            </section>

            <section>
              <h2>4. Pagos, cambios y cancelaciones</h2>
              <p>
                Cuando un servicio tenga condiciones de pago, reserva, cancelación, reprogramación,
                renovación o devolución, estas se informarán antes de la contratación. Las
                condiciones específicas aceptadas para cada servicio prevalecerán sobre esta
                descripción general.
              </p>
            </section>

            <section>
              <h2>5. Propiedad intelectual</h2>
              <p>
                Los textos, diseño, identidad visual, metodologías, conceptos, demostraciones,
                código y demás contenidos originales de Cómplice Lab están protegidos por las
                normas aplicables de propiedad intelectual. Los derechos sobre entregables creados
                para un cliente se regirán por lo acordado en cada propuesta o contrato.
              </p>
            </section>

            <section>
              <h2>6. Demos, showrooms y casos</h2>
              <p>
                Las demostraciones, mockups, showrooms y casos presentados en el sitio pueden tener
                fines ilustrativos. No implican que todos los clientes recibirán exactamente las
                mismas funcionalidades, diseño o resultados.
              </p>
            </section>

            <section>
              <h2>7. Herramientas y servicios de terceros</h2>
              <p>
                Algunos proyectos pueden involucrar plataformas, software, inteligencia artificial,
                redes sociales, hosting, mensajería, publicidad o servicios de terceros. Su
                disponibilidad, funcionamiento, precios, políticas y resultados dependen de sus
                respectivos proveedores y pueden cambiar sin intervención de Cómplice Lab.
              </p>
            </section>

            <section>
              <h2>8. Formularios y comunicaciones</h2>
              <p>
                Al enviar un formulario o iniciar una conversación por WhatsApp, correo u otro canal,
                declaras que la información suministrada es correcta y que cuentas con autorización
                para compartirla. El envío de una solicitud no implica aceptación automática de un
                proyecto ni celebración de un contrato.
              </p>
            </section>

            <section>
              <h2>9. Disponibilidad y responsabilidad</h2>
              <p>
                Podemos actualizar, modificar o suspender temporalmente contenidos y funcionalidades
                por razones técnicas, comerciales, de seguridad o mantenimiento. No asumimos
                responsabilidad por fallas de terceros, usos indebidos del sitio o decisiones tomadas
                exclusivamente con base en contenidos generales sin una evaluación particular.
              </p>
            </section>

            <section>
              <h2>10. Privacidad y datos personales</h2>
              <p>
                El tratamiento de información personal se explica en nuestra
                <a href="/privacidad"> Política de privacidad</a>.
              </p>
            </section>

            <section>
              <h2>11. Actualizaciones</h2>
              <p>
                Podemos actualizar estos términos cuando cambien nuestros servicios, procesos o
                requisitos legales. La versión vigente será la publicada en esta página con su fecha
                de actualización.
              </p>
            </section>

            <section>
              <h2>12. Ley aplicable</h2>
              <p>
                Estos términos se interpretan conforme a las leyes de la República de Colombia, sin
                perjuicio de las normas imperativas que resulten aplicables en cada caso.
              </p>
            </section>

            <section>
              <h2>13. Contacto</h2>
              <p>
                Para preguntas relacionadas con estos términos puedes escribir a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a> o comunicarte al
                <a href="https://api.whatsapp.com/send?phone=573161772880" target="_blank" rel="noreferrer noopener">
                  {" "}+57 316 177 2880
                </a>.
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
