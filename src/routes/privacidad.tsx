import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad | Cómplice Lab" },
      {
        name: "description",
        content:
          "Consulta cómo Cómplice Lab trata los datos personales recibidos a través de su sitio y canales de contacto.",
      },
      { property: "og:title", content: "Política de Privacidad | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Información sobre tratamiento de datos personales y derechos de los titulares en complicelab.com.",
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
            <h1>Política de privacidad.</h1>
            <p>
              Esta política explica qué información personal puede tratar Cómplice Lab cuando
              visitas complicelab.com o te comunicas con nosotros y cómo puedes ejercer tus derechos.
            </p>
            <p className="legal-updated">Última actualización: 5 de noviembre de 2026.</p>
          </div>

          <article className="legal-content">
            <section>
              <h2>1. Responsable y contacto</h2>
              <p>
                Para los datos personales recolectados a través de este sitio y de los canales
                asociados a la marca, el responsable opera bajo la marca Cómplice Lab. Para
                consultas relacionadas con privacidad o tratamiento de datos puedes escribir a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a> o comunicarte al
                <a href="https://api.whatsapp.com/send?phone=573161772880" target="_blank" rel="noreferrer noopener">
                  {" "}+57 316 177 2880
                </a>.
              </p>
            </section>

            <section>
              <h2>2. Marco general</h2>
              <p>
                El tratamiento de datos personales se realiza de acuerdo con la normativa colombiana
                aplicable, incluida la Ley 1581 de 2012 y sus normas reglamentarias vigentes.
              </p>
            </section>

            <section>
              <h2>3. Información que podemos tratar</h2>
              <p>
                Dependiendo de tu interacción con el sitio, podemos recibir datos como nombre y
                apellido, marca personal o empresa, país, ciudad, indicativo telefónico, WhatsApp o
                teléfono, correo electrónico, profesión, sector, tipo de negocio e información sobre
                necesidades, intereses o problemas comerciales.
              </p>
              <p>
                También pueden generarse datos técnicos básicos relacionados con la navegación,
                seguridad o funcionamiento del sitio a través del navegador, servidor o proveedores
                tecnológicos utilizados para prestar el servicio.
              </p>
            </section>

            <section>
              <h2>4. Finalidades</h2>
              <p>Podemos utilizar la información para:</p>
              <ul>
                <li>responder solicitudes de información o contacto;</li>
                <li>realizar un diagnóstico inicial del negocio;</li>
                <li>preparar propuestas, cotizaciones o recomendaciones;</li>
                <li>coordinar reuniones o conversaciones comerciales;</li>
                <li>dar seguimiento a oportunidades y solicitudes;</li>
                <li>prestar y administrar servicios contratados;</li>
                <li>mejorar el sitio, sus formularios, seguridad y experiencia;</li>
                <li>cumplir obligaciones legales o contractuales.</li>
              </ul>
            </section>

            <section>
              <h2>5. Autorización</h2>
              <p>
                Cuando la ley requiera autorización, esta podrá obtenerse mediante formularios,
                casillas de aceptación, comunicaciones electrónicas, contratos u otros mecanismos
                que permitan acreditar una manifestación previa, expresa e informada del titular.
              </p>
            </section>

            <section>
              <h2>6. Derechos de los titulares</h2>
              <p>
                Puedes solicitar conocer, actualizar, rectificar o suprimir tus datos, pedir prueba
                de la autorización cuando corresponda, conocer el uso dado a tu información,
                presentar consultas o reclamos y revocar la autorización cuando legalmente proceda.
              </p>
            </section>

            <section>
              <h2>7. Cómo ejercer tus derechos</h2>
              <p>
                Puedes enviar una solicitud a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a>. Para atenderla
                podremos solicitar información razonable que permita verificar tu identidad y
                localizar los datos relacionados.
              </p>
            </section>

            <section>
              <h2>8. Proveedores y terceros</h2>
              <p>
                Podemos utilizar proveedores tecnológicos para hosting, formularios, automatización,
                correo, mensajería, seguridad, almacenamiento, CRM u otras funciones operativas.
                Dichos proveedores pueden procesar información por cuenta nuestra y estar ubicados
                dentro o fuera de Colombia, sujetos a las obligaciones contractuales y legales que
                correspondan.
              </p>
            </section>

            <section>
              <h2>9. WhatsApp y servicios externos</h2>
              <p>
                Cuando decides continuar una conversación mediante WhatsApp u otro servicio externo,
                la información también puede ser tratada por el proveedor de ese servicio conforme a
                sus propios términos y políticas.
              </p>
            </section>

            <section>
              <h2>10. Cookies y tecnologías similares</h2>
              <p>
                El sitio puede utilizar tecnologías técnicas necesarias para funcionamiento,
                seguridad o preferencias. Si se incorporan herramientas de analítica, publicidad o
                seguimiento que requieran consentimiento o información adicional, se implementarán
                los avisos y controles correspondientes.
              </p>
            </section>

            <section>
              <h2>11. Seguridad y conservación</h2>
              <p>
                Aplicamos medidas razonables de carácter técnico, organizacional y administrativo
                orientadas a proteger la información. Los datos se conservarán durante el tiempo
                razonablemente necesario para cumplir las finalidades informadas, gestionar la
                relación comercial y atender obligaciones legales o contractuales.
              </p>
            </section>

            <section>
              <h2>12. Datos de menores</h2>
              <p>
                Los servicios de Cómplice Lab están dirigidos principalmente a profesionales y
                empresas. No buscamos recolectar intencionalmente datos de menores de edad mediante
                los formularios comerciales generales del sitio.
              </p>
            </section>

            <section>
              <h2>13. Cambios a esta política</h2>
              <p>
                Podemos actualizar esta política por cambios legales, tecnológicos, operativos o en
                nuestros servicios. La versión vigente será la publicada en esta página con su fecha
                de actualización.
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
