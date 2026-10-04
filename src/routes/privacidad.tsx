import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad y Cookies | Cómplice Lab" },
      {
        name: "description",
        content:
          "Consulta cómo Cómplice Lab trata los datos personales, utiliza herramientas de medición y gestiona el consentimiento de cookies.",
      },
      { property: "og:title", content: "Política de Privacidad y Cookies | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Información sobre privacidad, cookies, Google Analytics y Meta Pixel en complicelab.com.",
      },
      { property: "og:url", content: "https://complicelab.com/privacidad" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/privacidad" }],
  }),
  component: PrivacyPage,
});

function openCookiePreferences() {
  window.dispatchEvent(new Event("complice:open-cookie-settings"));
}

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
            <p className="eyebrow">PRIVACIDAD · COOKIES · DATOS</p>
            <h1>Política de privacidad y cookies.</h1>
            <p>
              Esta política explica qué información puede tratar Cómplice Lab cuando visitas
              complicelab.com, cómo usamos herramientas de medición y cómo puedes controlar tu
              consentimiento.
            </p>
            <p className="legal-updated">Última actualización: 4 de octubre de 2026.</p>
          </div>

          <article className="legal-content">
            <section>
              <h2>1. Responsable y contacto</h2>
              <p>
                Cómplice Lab gestiona este sitio web y los canales asociados a la marca. Para
                consultas relacionadas con privacidad o tratamiento de datos puedes escribir a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a> o comunicarte al
                <a href="https://api.whatsapp.com/send?phone=+573161772880" target="_blank" rel="noreferrer noopener">
                  {" "}+57 316 177 2880
                </a>.
              </p>
            </section>

            <section>
              <h2>2. Qué información podemos tratar</h2>
              <p>
                Podemos recibir la información que nos entregas voluntariamente cuando nos
                contactas por correo, WhatsApp u otros canales. También podemos obtener datos
                técnicos y de navegación cuando autorizas las herramientas de medición, como
                páginas visitadas, interacciones, tipo de dispositivo, navegador y datos de
                campaña.
              </p>
            </section>

            <section>
              <h2>3. Para qué usamos la información</h2>
              <p>
                La utilizamos para responder solicitudes, prestar y mejorar nuestros servicios,
                entender el rendimiento del sitio, medir campañas publicitarias, mejorar la
                experiencia digital y analizar qué contenidos o páginas resultan más útiles.
              </p>
            </section>

            <section id="cookies">
              <h2>4. Cookies y tecnologías de medición</h2>
              <p>
                El sitio utiliza un sistema de consentimiento. Google Analytics 4 y Meta Pixel se
                activan únicamente cuando eliges “Aceptar” en el banner de privacidad. Si eliges
                “Rechazar”, esas herramientas de medición no se cargan desde nuestro sitio.
              </p>
              <div className="legal-table">
                <div><b>Preferencia de consentimiento</b><span>Necesaria</span><p>Guarda localmente si aceptaste o rechazaste las herramientas de medición.</p></div>
                <div><b>Google Analytics 4</b><span>Analítica</span><p>Nos ayuda a entender visitas, páginas vistas e interacciones con el sitio.</p></div>
                <div><b>Meta Pixel</b><span>Publicidad y medición</span><p>Nos ayuda a medir el rendimiento de campañas de Meta y acciones como el contacto por WhatsApp.</p></div>
              </div>
              <button className="button button-ghost legal-cookie-button" type="button" onClick={openCookiePreferences}>
                Cambiar preferencias de cookies
              </button>
            </section>

            <section>
              <h2>5. Terceros</h2>
              <p>
                Algunas mediciones pueden ser procesadas por proveedores tecnológicos como Google
                y Meta cuando has dado tu consentimiento. Sus propios términos y políticas pueden
                aplicar al tratamiento que realizan en sus plataformas.
              </p>
            </section>

            <section>
              <h2>6. Conservación y seguridad</h2>
              <p>
                Procuramos conservar la información solo durante el tiempo necesario para las
                finalidades descritas y aplicar medidas razonables para protegerla. Los plazos
                específicos pueden variar según el tipo de información, el servicio utilizado y
                las obligaciones aplicables.
              </p>
            </section>

            <section>
              <h2>7. Tus solicitudes sobre datos</h2>
              <p>
                Puedes solicitar información sobre tus datos, pedir su actualización o corrección,
                solicitar su eliminación cuando corresponda o retirar autorizaciones previamente
                otorgadas, de acuerdo con la normativa aplicable. Para hacerlo, escribe a
                <a href="mailto:info@complicelab.com"> info@complicelab.com</a>.
              </p>
            </section>

            <section>
              <h2>8. Cambios a esta política</h2>
              <p>
                Podemos actualizar esta política cuando cambien nuestros servicios, herramientas o
                prácticas de tratamiento. La versión vigente se publicará siempre en esta página
                con su fecha de actualización.
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
