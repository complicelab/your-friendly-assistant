import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";

import { BrandMark } from "./brand";
import { commercialServices, serviceHref } from "@/data/commercial-services";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/complicelab", icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@complicelab", icon: null },
  { label: "Facebook", href: "https://www.facebook.com/complicelab", icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/@complicelab", icon: Youtube },
] as const;

export function SiteFooter() {
  return (
    <footer id="footer" className="footer">
      <div className="container footer-grid">
        <div>
          <BrandMark />
          <p className="footer-tag">Creamos. Enseñamos. Implementamos.</p>
          <p>Publicidad, creatividad, tecnología y formación potenciadas por inteligencia artificial.</p>
        </div>

        <div>
          <b>CONTACTO</b>
          <a className="footer-link" href="mailto:info@complicelab.com">
            <Mail size={15} />
            info@complicelab.com
          </a>
          <a
            className="footer-link"
            href="https://api.whatsapp.com/send?phone=573161772880&text=Hola%2C%20quiero%20hablar%20con%20C%C3%B3mplice%20Lab%20sobre%20mi%20negocio."
            target="_blank"
            rel="noreferrer noopener"
          >
            <Phone size={15} />
            +57 316 177 2880
          </a>
          <a className="footer-link" href="https://complicelab.com">
            complicelab.com
          </a>
        </div>

        <div>
          <b>SERVICIOS</b>
          <a className="footer-link" href="/todos-los-servicios">Ver todos los servicios →</a>
          {commercialServices.map((service) => <a className="footer-link" key={service.slug} href={serviceHref(service.slug)}>{service.name}</a>)}
        </div>

        <div>
          <b>REDES</b>
          <div className="social-links">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer noopener" aria-label={label}>
                {Icon ? <Icon size={17} /> : <span className="tiktok-mark">TT</span>}
                <span>{label}</span>
              </a>
            ))}
          </div>
          <p className="social-handle">@complicelab</p>
          <div className="footer-legal">
            <a href="/privacidad">Privacidad y cookies</a>
            <a href="/terminos">Términos y condiciones</a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("complice:open-cookie-settings"))}
            >
              Preferencias de cookies
            </button>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 Cómplice Lab. Todos los derechos reservados.</div>
    </footer>
  );
}
