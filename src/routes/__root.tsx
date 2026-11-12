import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CookieConsent } from "../components/marketing/cookie-consent";

const analyticsEventsScript = `
(function () {
  if (window.__compliceAnalyticsBound) return;
  window.__compliceAnalyticsBound = true;

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;

    var link = target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var text = (link.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 100);
    var placement =
      link.classList.contains('whatsapp-float') ? 'floating_button' :
      link.classList.contains('desktop-cta') ? 'header' :
      link.closest('footer') ? 'footer' :
      link.closest('.main-cta') ? 'main_cta' :
      link.closest('.formation-hero') ? 'hero' :
      'content';

    var attribution = {};
    try {
      attribution = JSON.parse(window.sessionStorage.getItem('complice-campaign-attribution') || '{}');
    } catch (error) {
      attribution = {};
    }

    var common = Object.assign({
      link_text: text,
      link_url: href,
      placement: placement,
      page_path: window.location.pathname
    }, attribution);

    if (href.indexOf('api.whatsapp.com') !== -1 || href.indexOf('wa.me') !== -1) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'whatsapp_click', common);
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', Object.assign({
          content_name: 'WhatsApp',
          content_category: placement,
          link_text: text
        }, attribution));
      }
      return;
    }

    if (href.indexOf('mailto:') === 0) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'email_click', common);
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', Object.assign({
          content_name: 'Email',
          content_category: placement,
          link_text: text
        }, attribution));
      }
    }
  }, { capture: true });
})();
`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://complicelab.com/#organization",
      name: "Cómplice Lab",
      url: "https://complicelab.com/",
      logo: "https://complicelab.com/brand/complice-lab-logo.svg",
      email: "info@complicelab.com",
      telephone: "+573161772880",
      description:
        "Cómplice Lab construye sistemas con IA a la medida, agentes de IA automatizados, páginas web y campañas de publicidad para profesionales y empresas.",
      areaServed: [
        { "@type": "Country", name: "Colombia" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "Mexico" },
        { "@type": "Country", name: "Dominican Republic" },
        { "@type": "AdministrativeArea", name: "Puerto Rico" },
      ],
      sameAs: [
        "https://www.instagram.com/complicelab",
        "https://www.tiktok.com/@complicelab",
        "https://www.facebook.com/complicelab",
        "https://www.youtube.com/@complicelab",
      ],
      knowsAbout: [
        "Sistemas con IA a la medida",
        "Agentes de IA automatizados",
        "Páginas web",
        "Publicidad en redes sociales",
        "Meta Ads",
        "TikTok Ads",
        "Google Ads",
        "CRM",
        "Agendamiento digital",
        "Automatización comercial",
        "Captación y seguimiento de oportunidades",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+573161772880",
        email: "info@complicelab.com",
        availableLanguage: ["es"],
        areaServed: ["CO", "US", "MX", "DO", "PR"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://complicelab.com/#website",
      url: "https://complicelab.com/",
      name: "Cómplice Lab",
      alternateName: "Complice Lab",
      publisher: { "@id": "https://complicelab.com/#organization" },
      inLanguage: "es-419",
    },
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página no pudo cargar
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Puedes intentar actualizar o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Cómplice Lab | Sistemas IA, Páginas Web y Publicidad Digital" },
      {
        name: "description",
        content:
          "Especialistas en sistemas con IA a la medida, agentes de IA, páginas web y publicidad digital para atraer, atender y gestionar oportunidades.",
      },
      { name: "author", content: "Cómplice Lab" },
      { name: "theme-color", content: "#F6F8FC" },
      { property: "og:title", content: "Cómplice Lab | Sistemas IA, Páginas Web y Publicidad Digital" },
      {
        property: "og:description",
        content:
          "Sistemas con IA a la medida, agentes de IA automatizados, páginas web y publicidad en redes sociales para profesionales y empresas que necesitan atraer y gestionar oportunidades.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Cómplice Lab" },
      { property: "og:locale", content: "es_419" },
      { property: "og:image", content: "https://complicelab.com/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://complicelab.com/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Cómplice Lab — sistemas con IA, agentes, páginas web y pauta" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://complicelab.com/og-image.jpg" },
      { name: "twitter:image:alt", content: "Cómplice Lab — sistemas con IA aplicados al negocio" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png?v=5", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png?v=5" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {children}
        <CookieConsent />
        <script dangerouslySetInnerHTML={{ __html: analyticsEventsScript }} />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
