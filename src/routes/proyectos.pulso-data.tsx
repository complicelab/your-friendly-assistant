import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Gauge,
  Globe2,
  Layers3,
  LineChart,
  MonitorSmartphone,
  Network,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export const Route = createFileRoute("/proyectos/pulso-data")({
  head: () => ({
    meta: [
      { title: "Pulso Data — Caso de Estudio | Cómplice Lab" },
      {
        name: "description",
        content:
          "Caso de estudio de Pulso Data: plataforma financiera por suscripción con flujo de opciones, earnings, macroeconomía, múltiples APIs y visualización de datos de mercado.",
      },
      { property: "og:title", content: "Pulso Data — Caso de Estudio | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Construimos desde cero una app financiera para centralizar flujo de opciones, earnings, macro y lectura de mercado en una sola experiencia.",
      },
      { property: "og:url", content: "https://complicelab.com/proyectos/pulso-data" },
      { property: "og:image", content: "https://complicelab.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/proyectos/pulso-data" }],
  }),
  component: PulsoDataCase,
});

const whatsapp =
  "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Quiero%20hablar%20sobre%20un%20producto%20digital%20como%20Pulso%20Data.";

const capabilities = [
  ["Data product", Database, "Arquitectura de producto pensada para reunir información financiera compleja en un solo entorno."],
  ["Flujo de opciones", Activity, "Visualización de OI, GEX, DEX, gamma flip, walls, magneto y actividad inusual."],
  ["Earnings", BarChart3, "Módulo para revisar reportes, movimiento esperado, histórico y contexto alrededor de resultados trimestrales."],
  ["Macroeconomía", Gauge, "Indicadores oficiales, sentimiento, Fear & Greed, VIX, FRED y contexto macro para lectura de mercado."],
  ["Integración de APIs", Network, "Investigación e integración de múltiples proveedores externos para consolidar la información."],
  ["Búsqueda por activo", Search, "Consulta de símbolos para analizar activos y navegar rápidamente entre herramientas."],
  ["Membresía", WalletCards, "Acceso recurrente mediante suscripción mensual al producto y sus módulos."],
  ["Responsive", MonitorSmartphone, "Experiencia adaptada a desktop y móvil sin perder densidad de información ni legibilidad."],
] as const;

function PulsoDashboardMockup() {
  return (
    <div className="case-browser pulso-browser" aria-label="Representación de Pulso Data">
      <div className="case-browser-bar"><div><i/><i/><i/></div><span>pulsodt.com</span></div>
      <div className="pulso-ui">
        <header>
          <b><em>Pulso</em><span>data</span></b>
          <nav><span>Earnings</span><span className="active">Flujo de Opciones</span><span>Macro</span><span>Mi cuenta</span></nav>
        </header>
        <div className="pulso-dashboard">
          <div className="pulso-title-row"><div><small>FLUJO DE OPCIONES</small><h3>Contexto del día · _SPX</h3></div><div className="pulso-search"><span>_SPX</span><b>Buscar</b></div></div>
          <div className="pulso-context">
            <article><small>RÉGIMEN MACRO</small><b>Mixto</b><p>Dólar -0.18% · 10Y -0.95% · VIX +0.31%</p></article>
            <article><small>RÉGIMEN GEX</small><b>Rangos</b><p>GEX positivo · volatilidad contenida</p></article>
            <article><small>MUROS DE OI</small><b>Más recorrido abajo</b><p>Call wall · Put wall · Spot</p></article>
          </div>
          <div className="pulso-chart">
            <div className="pulso-bars">
              {[28,18,34,12,44,22,15,10,8,14,18,31,48,72,38,56,80,44,66,88].map((h,i)=><i key={i} className={i<9?"neg":"pos"} style={{height:h+"%"}}/>)}
            </div>
            <span className="spot">Spot 7722.72</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PulsoModules() {
  return (
    <div className="pulso-modules-grid">
      <article>
        <div className="pulso-module-head"><small>EARNINGS</small><span>AAPL</span></div>
        <h3>Movimiento esperado</h3>
        <div className="pulso-kpi-row"><strong>$333.60</strong><b>4.5%</b></div>
        <div className="pulso-alert">STRANGLE CARO · evento detectado</div>
        <div className="pulso-mini-bars">{[20,28,24,18,30,31,5,6,72,46,45,43].map((h,i)=><i key={i} style={{height:h+"%"}}/>)}</div>
      </article>
      <article>
        <div className="pulso-module-head"><small>MACRO</small><span>FRED</span></div>
        <h3>Indicadores adelantados</h3>
        <div className="pulso-macro-number">3.71% <b>+0.17 pp</b></div>
        <div className="pulso-macro-list"><span>CPI</span><span>PCE</span><span>Tasa Fed</span><span>PIB</span></div>
        <div className="pulso-line-mini"><svg viewBox="0 0 300 100"><path d="M0 79 C24 72, 31 25, 57 45 S93 56, 112 35 S145 22, 163 44 S195 56, 216 33 S254 25, 300 18"/></svg></div>
      </article>
    </div>
  );
}

function PulsoMobilePair() {
  return (
    <div className="pulso-mobile-pair">
      <div className="pulso-phone">
        <div className="pulso-phone-notch"/>
        <b><em>Pulso</em><span>data</span></b>
        <nav><span>Earnings</span><span className="active">Flujo</span><span>Macro</span><span>Cuenta</span></nav>
        <small>CONTEXTO DEL DÍA · _SPX</small>
        <h3>Lectura rápida del mercado</h3>
        <div className="pulso-phone-card"><span>RÉGIMEN MACRO</span><b>Mixto</b><p>Dólar · 10Y · VIX · crédito</p></div>
        <div className="pulso-phone-card"><span>RÉGIMEN GEX</span><b>Rangos</b><p>GEX positivo · volatilidad contenida</p></div>
      </div>
      <div className="pulso-phone">
        <div className="pulso-phone-notch"/>
        <b><em>Pulso</em><span>data</span></b>
        <nav><span className="active">Earnings</span><span>Flujo</span><span>Macro</span><span>Cuenta</span></nav>
        <small>ACTIVO ANALIZADO</small>
        <h3>Apple Inc. (AAPL)</h3>
        <div className="pulso-price">$333.60</div>
        <div className="pulso-phone-split"><span>CALL<b>$345</b></span><span>PUT<b>$325</b></span></div>
        <div className="pulso-phone-alert">STRANGLE CARO</div>
      </div>
    </div>
  );
}

function PulsoDataCase() {
  return (
    <div className="case-page pulso-case">
      <header className="formation-nav case-nav">
        <div className="nav-wrap">
          <BrandMark/>
          <a className="formation-back" href="/#proyectos"><ArrowLeft size={16}/> Volver a proyectos</a>
          <a className="button button-sm" href={whatsapp} target="_blank" rel="noreferrer noopener">Hablemos</a>
        </div>
      </header>

      <main>
        <section className="case-hero">
          <div className="hero-grid" aria-hidden="true"/>
          <div className="container">
            <p className="eyebrow">CASO DE ESTUDIO · DATA APP FINANCIERA</p>
            <div className="case-hero-grid">
              <div>
                <h1>Pulso<br/><span>Data</span></h1>
                <p className="case-hero-lead">
                  Construimos desde cero una plataforma de análisis bursátil por suscripción para reunir
                  flujo de opciones, earnings, macroeconomía y lectura de mercado en una sola experiencia.
                </p>
                <div className="case-service-tags">
                  {["Producto digital","UX/UI","Web App","APIs","Data","Dashboard","Membresía","Responsive"].map(x=><span key={x}>{x}</span>)}
                </div>
              </div>
              <div className="case-metrics">
                <div><strong>3</strong><span>núcleos principales: earnings, opciones y macro</span></div>
                <div><strong>API</strong><span>integración de múltiples proveedores de información</span></div>
                <div><strong>24/7</strong><span>producto digital pensado para consulta recurrente</span></div>
                <div><strong>1</strong><span>experiencia centralizada de análisis</span></div>
              </div>
            </div>
            <div className="case-hero-preview"><PulsoDashboardMockup/></div>
          </div>
        </section>

        <section className="section">
          <div className="container case-story-grid">
            <div>
              <p className="eyebrow">EL RETO</p>
              <h2>Convertir data financiera dispersa en una <span className="case-accent-blue">herramienta usable.</span></h2>
            </div>
            <div className="case-story-copy">
              <p>
                Pulso Data es una herramienta creada por Camilo para facilitar la lectura de información bursátil
                que normalmente vive repartida entre múltiples fuentes, plataformas y proveedores de datos.
              </p>
              <p>
                El proyecto exigió una investigación exhaustiva de APIs, fuentes y proveedores, además de diseñar
                una experiencia capaz de presentar información técnica sin perder velocidad de lectura ni contexto.
              </p>
              <strong>El objetivo no era mostrar más datos. Era organizarlos para que fueran más fáciles de interpretar antes de operar.</strong>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">QUÉ CONSTRUIMOS</p>
              <h2>Un producto financiero completo, <span className="case-accent-blue">no una landing.</span></h2>
              <p>Marca, producto, visualización, lógica de suscripción, integraciones y experiencia de usuario fueron trabajados como un solo sistema.</p>
            </div>
            <div className="case-capabilities">
              {capabilities.map(([title,Icon,copy])=><article key={title}><Icon/><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">MÓDULOS PRINCIPALES</p>
              <h2>Tres formas de entender <span className="case-accent-blue">qué está moviendo el mercado.</span></h2>
              <p>La plataforma organiza información de earnings, flujo de opciones y macroeconomía dentro de una experiencia coherente.</p>
            </div>
            <PulsoModules/>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container case-system-grid">
            <div>
              <p className="eyebrow">ARQUITECTURA DE DATOS</p>
              <h2>De muchas fuentes a <span className="case-accent-blue">una sola lectura.</span></h2>
            </div>
            <div className="case-flow">
              {[
                ["01","Investigación","Búsqueda y evaluación de proveedores, APIs y fuentes de datos."],
                ["02","Integración","Conexión de servicios externos dentro de una arquitectura común."],
                ["03","Normalización","Organización de formatos, símbolos, fechas, métricas y estados."],
                ["04","Cálculo","Transformación de datos en métricas y lecturas útiles para cada módulo."],
                ["05","Visualización","Dashboards, tablas, alertas y gráficos orientados a lectura rápida."],
                ["06","Acceso","Membresía y experiencia de usuario para consulta recurrente del producto."],
              ].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p><ArrowRight/></article>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container case-tech-grid">
            <div>
              <p className="eyebrow">LECTURA DE MERCADO</p>
              <h2>Más contexto. <span className="case-accent-blue">Menos ruido.</span></h2>
              <p className="body-large">
                La interfaz ayuda a leer relaciones entre volatilidad, posicionamiento, open interest,
                gamma, earnings y variables macro sin obligar al usuario a saltar entre múltiples herramientas.
              </p>
            </div>
            <div className="case-stack">
              {["OI / Open Interest","GEX / DEX","Gamma Flip","Call & Put Walls","Earnings","FRED & Macro"].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}
              <p>El producto presenta información analítica; no sustituye criterio, gestión de riesgo ni asesoría financiera profesional.</p>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">RESPONSIVE</p>
              <h2>Data densa, también legible <span className="case-accent-blue">desde el celular.</span></h2>
              <p>Los paneles se reorganizan para conservar jerarquía, navegación y contexto en pantallas pequeñas.</p>
            </div>
            <PulsoMobilePair/>
          </div>
        </section>

        <section className="section">
          <div className="container case-story-grid">
            <div>
              <p className="eyebrow">MODELO DE NEGOCIO</p>
              <h2>Un producto pensado para <span className="case-accent-blue">valor recurrente.</span></h2>
            </div>
            <div className="case-story-copy">
              <p>
                Pulso Data se estructuró como una membresía mensual: el usuario paga por acceder de forma recurrente
                a las herramientas, datos y módulos de análisis disponibles dentro de la plataforma.
              </p>
              <p>
                Esto obligó a pensar el proyecto no solo como software, sino como producto: propuesta de valor,
                acceso, navegación, utilidad continua y evolución futura.
              </p>
              <strong>La membresía convierte la plataforma en un producto que debe justificar su valor cada mes.</strong>
            </div>
          </div>
        </section>

        <section className="case-result">
          <div className="container">
            <p className="eyebrow">EL RESULTADO</p>
            <h2>Una app propia que convierte <span>data compleja en una experiencia de análisis centralizada.</span></h2>
            <div className="case-result-pills">
              <span><CheckCircle2/> Producto desde cero</span>
              <span><Database/> Integración de datos</span>
              <span><RefreshCcw/> Actualización recurrente</span>
              <span><LineChart/> Visualización financiera</span>
              <span><ShieldCheck/> Acceso por membresía</span>
            </div>
          </div>
        </section>

        <section className="main-cta formation-cta">
          <div className="container">
            <p className="eyebrow">¿TIENES UNA IDEA DE PRODUCTO DIGITAL?</p>
            <h2>Podemos convertirla en una <span className="case-accent-light">herramienta real.</span></h2>
            <p>Diseñamos marcas, productos, dashboards y experiencias que van mucho más allá de una página web.</p>
            <div className="hero-actions">
              <a className="button button-light" href={whatsapp} target="_blank" rel="noreferrer noopener">Hablemos <ArrowRight size={18}/></a>
              <a className="button button-outline-light" href="/#proyectos">Ver más proyectos</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter/>
      <WhatsAppFloat/>
    </div>
  );
}
