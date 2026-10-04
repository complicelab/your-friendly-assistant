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
          "Consulta los términos generales de uso del sitio, contratación de servicios y participación en formaciones de Cómplice Lab.",
      },
      { property: "og:title", content: "Términos y Condiciones | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Condiciones generales aplicables al uso de complicelab.com, servicios, propuestas y formaciones de Cómplice Lab.",
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
            <p className="eyebrow">TÉRMINOS · SERVICIOS · FORMACIÓN</p>
            <h1>Términos y condiciones.</h1>
            <p>
              Estos términos establecen condiciones generales para el uso de complicelab.com y
              sirven como marco de referencia para los servicios, proyectos y actividades de
              formación ofrecidos por Cómplice Lab.
            </p>
            <p className="legal-updated">Última actualización: 4 de octubre de 2026.</p>
          </div>

          <article className="legal-content">
            <section>
              <h2>1. Uso del sitio</h2>
              <p>
                El contenido de este sitio tiene fines informativos y comerciales. Puedes navegar,
                consultar nuestros servicios y comunicarte con nosotros utilizando los canales
                disponibles. No debes utilizar el sitio de forma que afecte su funcionamiento,
                seguridad o disponibilidad.
              </p>
            </section>

            <section>
              <h2>2. Servicios y propuestas</h2>
              <p>
                La información publicada describe de forma general los servicios que podemos
                prestar. El alcance, entregables, tiempos, precio, forma de pago, revisiones y demás
                condiciones de cada proyecto se definirán en la propuesta, cotización o acuerdo
                correspondiente antes de iniciar el trabajo.
              </p>
            </section>

            <section>
              <h2>3. Formación, talleres y capacitaciones</h2>
              <p>
                Los contenidos, formatos, duración, modalidad, fechas y condiciones de cursos,
                talleres, seminarios o capacitaciones pueden variar según el programa o acuerdo
                realizado. La participación en una formación no implica una garantía de resultados
                comerciales específicos, ya que su aplicación depende también de las decisiones,
                recursos y contexto de cada participante u organización.
              </p>
            </section>

            <section>
              <h2>4. Pagos, cambios y cancelaciones</h2>
              <p>
                Cuando un servicio o formación tenga condiciones de pago, reserva, cancelación,
                reprogramación o devolución, estas se informarán antes de la contratación. Las
                condiciones específicas aceptadas para cada servicio prevalecerán sobre esta
                descripción general.
              </p>
            </section>

            <section>
              <h2>5. Propiedad intelectual</h2>
              <p>
                Los textos, diseño, identidad visual, metodología, materiales propios y demás
                contenidos originales de Cómplice Lab están protegidos por las normas aplicables de
                propiedad intelectual. Los derechos sobre piezas o entregables creados para un
                cliente se regirán por lo acordado específicamente en la propuesta o contrato de
                cada proyecto.
              </p>
            </section>

            <section>
              <h2>6. Herramientas y servicios de terceros</h2>
              <p>
                Algunos proyectos o formaciones pueden involucrar plataformas, software,
                inteligencia artificial, redes sociales o servicios de terceros. Su disponibilidad,
                funcionamiento, precios, políticas y resultados dependen de sus respectivos
                proveedores y pueden cambiar sin intervención de Cómplice Lab.
              </p>
            </section>

            <section>
              <h2>7. Resultados y responsabilidad</h2>
              <p>
                Trabajamos con criterios profesionales y orientados a objetivos, pero no podemos
                garantizar resultados comerciales, publicitarios, financieros o de posicionamiento
                determinados. Los resultados pueden verse afectados por factores externos como el
                mercado, presupuesto, plataformas, competencia, implementación y decisiones del
                cliente.
              </p>
            </section>

            <section>
              <h2>8. Enlaces y contenido externo</h2>
              <p>
                El sitio puede contener enlaces a plataformas o servicios externos. Cómplice Lab no
                controla esos sitios ni sus políticas y no asume responsabilidad por su contenido,
                disponibilidad o prácticas.
              </p>
            </section>

            <section>
              <h2>9. Privacidad y datos personales</h2>
              <p>
                El tratamiento de información personal y el uso de herramientas de medición se
                explican en nuestra <a href="/privacidad">Política de privacidad y cookies</a>.
              </p>
            </section>

            <section>
              <h2>10. Actualizaciones</h2>
              <p>
                Podemos actualizar estos términos cuando cambien nuestros servicios, procesos o
                condiciones generales. La versión vigente se publicará en esta página con la fecha
                de su última actualización.
              </p>
            </section>

            <section>
              <h2>11. Contacto</h2>
              <p>
                Para preguntas relacionadas con estos términos o con un servicio, puedes escribir a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a> o comunicarte al
                <a
                  href="https://api.whatsapp.com/send?phone=+573161772880"
                  target="_blank"
                  rel="noreferrer noopener"
                >
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
