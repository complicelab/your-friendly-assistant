import { useEffect, useState } from "react";

const CONSENT_KEY = "complice-cookie-consent";
const GA_MEASUREMENT_ID = "G-GM6V155DF5";
const META_PIXEL_ID = "2947877528938358";

type ConsentValue = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    __compliceAnalyticsLoaded?: boolean;
  }
}

function loadAnalytics() {
  if (window.__compliceAnalyticsLoaded) return;
  window.__compliceAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: true });

  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gaScript);

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      const fn = fbq as typeof fbq & { queue?: unknown[][]; callMethod?: (...params: unknown[]) => void };
      if (fn.callMethod) {
        fn.callMethod(...args);
      } else {
        fn.queue = fn.queue || [];
        fn.queue.push(args);
      }
    } as typeof window.fbq & { queue?: unknown[][]; loaded?: boolean; version?: string };

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;

    const metaScript = document.createElement("script");
    metaScript.async = true;
    metaScript.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(metaScript);
  }

  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");
}

export function CookieConsent() {
  const [choice, setChoice] = useState<ConsentValue | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
    setChoice(saved);
    setOpen(saved === null);

    if (saved === "accepted") {
      loadAnalytics();
    }

    const reopen = () => setOpen(true);
    window.addEventListener("complice:open-cookie-settings", reopen);
    return () => window.removeEventListener("complice:open-cookie-settings", reopen);
  }, []);

  const save = (value: ConsentValue) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setChoice(value);
    setOpen(false);

    if (value === "accepted") {
      loadAnalytics();
    }
  };

  if (!open) return null;

  return (
    <aside className="cookie-banner" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <div className="cookie-copy">
        <p className="eyebrow">PRIVACIDAD Y COOKIES</p>
        <h2 id="cookie-title">Tú decides qué datos de medición usamos.</h2>
        <p>
          Usamos Google Analytics y Meta Pixel para entender el rendimiento del sitio y de nuestras campañas.
          Solo los activamos si aceptas. Las cookies necesarias para el funcionamiento del sitio no dependen de esta elección.
        </p>
        <a href="/privacidad#cookies">Ver política de privacidad y cookies</a>
      </div>
      <div className="cookie-actions">
        <button className="button button-ghost" type="button" onClick={() => save("rejected")}>
          Rechazar
        </button>
        <button className="button" type="button" onClick={() => save("accepted")}>
          Aceptar
        </button>
      </div>
      {choice !== null && (
        <button className="cookie-close" type="button" onClick={() => setOpen(false)} aria-label="Cerrar preferencias">
          ×
        </button>
      )}
    </aside>
  );
}
