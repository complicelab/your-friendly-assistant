import { BrandMark } from "./brand";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <BrandMark />
          <p className="footer-tag">Creamos. Enseñamos. Implementamos.</p>
          <p>Publicidad, creatividad, tecnología y formación potenciadas por inteligencia artificial.</p>
        </div>
        <div>
          <b>Contacto</b>
          <p>complicelab.com</p>
          <p>@complicelab</p>
        </div>
        <div>
          <b>Redes</b>
          <p>Instagram</p>
          <p>Facebook · TikTok · LinkedIn · WhatsApp</p>
          <small>Espacios preparados para configurar enlaces oficiales.</small>
        </div>
      </div>
      <div className="container footer-bottom">© Cómplice Lab.</div>
    </footer>
  );
}
