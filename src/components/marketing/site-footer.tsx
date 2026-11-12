/** Shared footer based on the actual homepage: white surface, three columns,
 * original dark-on-white brand logo, navigation, built projects and legal links.
 * Section anchors use home URLs so they work on every service landing.
 */
const projects = [
  { name: "Cómplice Dental", url: "https://complicedental.com" },
  { name: "Mi Raíz", url: "https://miraiz.com.co" },
  { name: "Camilo Respiro", url: "https://camilorespiro.com" },
  { name: "Pulso", url: "https://pulsodt.com" },
  { name: "Be2Home", url: "https://be2home.co" },
] as const;

type SiteFooterProps = {
  /** Preserve the current page's scheduling flow when one is available. */
  onSchedule?: () => void;
};

export function SiteFooter({ onSchedule }: SiteFooterProps) {
  return (
    <footer id="footer" className="footer cl-site-footer">
      <div className="footer-home-wrap">
        <div className="footer-home-grid">
          <div className="footer-home-brand">
            <a className="cl-footer-official-logo" href="/" aria-label="Cómplice Lab, inicio">
              <img src="/brand/complice-lab-logo.svg" alt="Cómplice Lab" />
            </a>
            <p>Sistemas con IA, agentes automatizados y marketing digital para profesionales y empresas donde la confianza decide la compra.</p>
          </div>

          <nav className="footer-home-column" aria-label="Navegación del pie de página">
            <h3>Navegar</h3>
            <ul>
              <li><a href="/#servicios">Servicios</a></li>
              <li><a href="/#proyectos">Proyectos</a></li>
              <li><a href="/#contacto">Contacto</a></li>
              <li>
                {onSchedule ? (
                  <button type="button" onClick={onSchedule}>Agendar diagnóstico</button>
                ) : (
                  <a href="/#contacto">Agendar diagnóstico</a>
                )}
              </li>
            </ul>
          </nav>

          <nav className="footer-home-column" aria-label="Proyectos que hemos construido">
            <h3>Lo que hemos construido</h3>
            <ul>
              {projects.map((project) => (
                <li key={project.name}>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">{project.name}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="cl-footer-legal-links">
          <a href="/privacidad">Política de privacidad</a>
          <a href="/terminos">Términos y condiciones</a>
        </div>
        <p className="footer-home-end">© 2026 Cómplice Lab. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
