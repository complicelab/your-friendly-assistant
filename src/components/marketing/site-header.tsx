import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { BrandMark } from "./brand";

const links = [
  ["Inicio", "/#inicio"],
  ["Servicios", "/#servicios"],
  ["Creamos", "/#formas"],
  ["Enseñamos", "/formacion"],
  ["Implementamos", "/#formas"],
  ["Proyectos", "/#proyectos"],
  ["Nosotros", "/#nosotros"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-wrap">
        <BrandMark />
        <nav className={open ? "is-open" : ""} aria-label="Principal">
          {links.map(([label, id]) => (
            <a key={id + label} href={id} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="button button-sm desktop-cta"
          href="https://api.whatsapp.com/send?phone=573161772880&text=Hola%2C%20quiero%20un%20diagn%C3%B3stico%20de%20mi%20negocio%20con%20C%C3%B3mplice%20Lab.%20%C2%BFPodemos%20hablar%3F"
          target="_blank"
          rel="noreferrer noopener"
        >
          Pedir diagnóstico
        </a>
        <button
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
