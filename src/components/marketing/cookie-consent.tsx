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
    __compliceAnalyticsLoaded?: boolean;
  }
}

function captureCampaignAttribution() {
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
  const attribution: Record<string, string> = {};

  keys.forEach((key) => {
    const value = params.get(key);
    if (value) attribution[key] = value;
  });

  if (Object.keys(attribution).length > 0) {
    window.sessionStorage.setItem("complice-campaign-attribution", JSON.stringify(attribution));
  }
}

function loadAnalytics() {
  if (window.__compliceAnalyticsLoaded) return;
  captureCampaignAttribution();
  window.__compliceAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: true });

  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gaScript);

  const metaBootstrap = document.createElement("script");
  metaBootstrap.text = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${META_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(metaBootstrap);
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
      return;
    }

    if (window.__compliceAnalyticsLoaded) {
      window.location.reload();
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
