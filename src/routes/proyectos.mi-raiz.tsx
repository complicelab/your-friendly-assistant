import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Database,
  Globe2,
  Home,
  LineChart,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { BrandMark } from "@/components/marketing/brand";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WhatsAppFloat } from "@/components/marketing/whatsapp-float";

export const Route = createFileRoute("/proyectos/mi-raiz")({
  head: () => ({
    meta: [
      { title: "Mi Raíz — Caso de Estudio | Cómplice Lab" },
      {
        name: "description",
        content:
          "Caso de estudio de Mi Raíz: marca inmobiliaria, web, buscador, panel administrativo, asesores, inmuebles, agenda, negocios, clientes, avalúos, hipotecas y operación digital.",
      },
      { property: "og:title", content: "Mi Raíz — Caso de Estudio | Cómplice Lab" },
      {
        property: "og:description",
        content:
          "Construimos desde cero una plataforma inmobiliaria completa para operar, vender, arrendar y acompañar clientes en el Eje Cafetero.",
      },
      { property: "og:url", content: "https://complicelab.com/proyectos/mi-raiz" },
      { property: "og:image", content: "https://complicelab.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://complicelab.com/proyectos/mi-raiz" }],
  }),
  component: MiRaizCase,
});

const whatsapp =
  "https://api.whatsapp.com/send?phone=+573161772880&text=Hola.%20Quiero%20hablar%20sobre%20un%20proyecto%20digital%20como%20Mi%20Raíz.";

const capabilities = [
  ["Marca inmobiliaria", Home, "Nombre, identidad visual y presencia digital construidos desde cero."],
  ["Buscador de inmuebles", Search, "Filtros por operación, tipo, ciudad, barrio y criterios relevantes para cada usuario."],
  ["Panel de asesores", Users, "Cada asesor puede gestionar su inventario, inmuebles y procesos desde un entorno propio."],
  ["Agenda y seguimiento", CalendarDays, "Gestión de citas, oportunidades y avances comerciales dentro de la operación."],
  ["Negocios y clientes", ClipboardList, "Seguimiento de procesos de venta y arriendo, clientes y estados de cada inmueble."],
  ["Back office", Database, "Dashboard, inventario, asesores, equipo, finanzas, clientes, agenda, blog y tasas."],
  ["Servicios inmobiliarios", Building2, "Compra, arriendo, hipotecas, avalúos, inversión y soluciones corporativas."],
  ["Experiencia responsive", MonitorSmartphone, "Toda la plataforma fue diseñada para funcionar también desde celular."],
] as const;

function MiRaizHomeMockup() {
  return (
    <div className="case-browser miraiz-browser" aria-label="Representación de la web pública de Mi Raíz">
      <div className="case-browser-bar"><div><i/><i/><i/></div><span>miraiz.com.co</span></div>
      <div className="miraiz-home-ui">
        <header><b><span>M</span>miraiz</b><nav><span>Comprar</span><span>Arriendo</span><span>Hipotecas</span><span>Avalúos</span><span>Empresas</span></nav></header>
        <div className="miraiz-hero-ui">
          <div>
            <small>MANIZALES · PEREIRA · ARMENIA</small>
            <h3>Encuentra tu hogar en el Eje Cafetero</h3>
            <p>Arriendos, venta, hipotecas y avalúos con acompañamiento humano de principio a fin.</p>
          </div>
          <div className="miraiz-searchbar">
            <span><small>QUIERO</small><b>Comprar</b></span>
            <span><small>TIPO</small><b>Todos los tipos</b></span>
            <span><small>CIUDAD</small><b>Manizales</b></span>
            <span><small>BARRIO</small><b>Todos los barrios</b></span>
            <strong>Buscar</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminMockup() {
  return (
    <div className="case-browser miraiz-admin-browser" aria-label="Representación del back office de Mi Raíz">
      <div className="case-browser-bar"><div><i/><i/><i/></div><span>Panel administrativo</span></div>
      <div className="miraiz-admin-ui">
        <aside>
          <b>ADMINISTRACIÓN</b>
          {["Dashboard","Inmuebles","Asesores","Equipo","Negocios","Financiero","Clientes","Agenda","Blog","Tasas"].map((x,i)=><span className={i===1?"active":""} key={x}>{x}</span>)}
        </aside>
        <main>
          <div className="miraiz-admin-head"><div><small>INMUEBLES</small><h3>Inventario y operación</h3></div><button>+ Nuevo inmueble</button></div>
          <div className="miraiz-filters"><span>Buscar por código o sector</span><span>Todos los estados</span><span>Todas las ciudades</span></div>
          <div className="miraiz-table">
            {[
              ["MZ–1030","Casa ubicada en el sector de Chipre","Venta","Casa","$ 833.000.000"],
              ["MZ–1029","Venta casa cerca a parque Caldas","Venta","Casa","$ 590.000.000"],
              ["MZ–1028","Casa en venta en zona comercial","Venta","Casa","$ 810.000.000"],
              ["MZ–1025","Apartamento en arriendo","Arriendo","Apartamento","$ 2.800.000"],
            ].map(row=><div key={row[0]}>{row.map((x,i)=><span key={i}>{x}</span>)}</div>)}
          </div>
        </main>
      </div>
    </div>
  );
}

function MobilePair() {
  return (
    <div className="miraiz-mobile-pair">
      <div className="miraiz-phone">
        <div className="miraiz-phone-notch"/>
        <b><span>M</span>miraiz</b>
        <small>MANIZALES · PEREIRA · ARMENIA</small>
        <h3>Encuentra tu hogar en el Eje Cafetero</h3>
        <p>Arriendos, venta, hipotecas y avalúos.</p>
        <div className="miraiz-form"><i/><i/><i/><i/><strong>Buscar</strong></div>
      </div>
      <div className="miraiz-phone miraiz-phone-admin">
        <div className="miraiz-phone-notch"/>
        <b><span>M</span>miraiz</b>
        <small>DASHBOARD</small>
        <h3>Datos en vivo de tu operación</h3>
        <div className="miraiz-kpis"><span>LIBRES<b>30</b></span><span>EN PROCESO<b>0</b></span><span>VENDIDOS<b>0</b></span><span>ARRENDADOS<b>0</b></span></div>
      </div>
    </div>
  );
}

function MiRaizCase() {
  return (
    <div className="case-page miraiz-case">
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
            <p className="eyebrow">CASO DE ESTUDIO · PLATAFORMA INMOBILIARIA</p>
            <div className="case-hero-grid">
              <div>
                <h1>Mi<br/><span>Raíz</span></h1>
                <p className="case-hero-lead">
                  Construimos desde cero una marca inmobiliaria y una plataforma completa para buscar,
                  publicar, administrar y acompañar procesos de venta, arriendo e inversión.
                </p>
                <div className="case-service-tags">
                  {["Branding","Web","UX/UI","Buscador","Back office","Asesores","Agenda","Negocios","Responsive"].map(x=><span key={x}>{x}</span>)}
                </div>
              </div>
              <div className="case-metrics">
                <div><strong>3</strong><span>ciudades del Eje Cafetero como foco de búsqueda</span></div>
                <div><strong>10+</strong><span>módulos operativos dentro del back office</span></div>
                <div><strong>360°</strong><span>captación + inventario + operación</span></div>
                <div><strong>1</strong><span>ecosistema inmobiliario completo</span></div>
              </div>
            </div>
            <div className="case-hero-preview"><MiRaizHomeMockup/></div>
          </div>
        </section>

        <section className="section">
          <div className="container case-story-grid">
            <div>
              <p className="eyebrow">EL RETO</p>
              <h2>Construir una inmobiliaria que también funcionara como <span className="case-accent-blue">plataforma operativa.</span></h2>
            </div>
            <div className="case-story-copy">
              <p>
                Mi Raíz nació como una empresa inmobiliaria de Camilo y requería mucho más que un sitio para mostrar propiedades.
                La operación necesitaba búsquedas públicas, múltiples servicios, asesores, inventario, agenda, clientes y procesos de negocio.
              </p>
              <p>
                Además, cada asesor debía poder administrar sus propios inmuebles, gestionar estados y acompañar procesos de venta o arriendo
                sin depender de herramientas separadas.
              </p>
              <strong>La web debía convertirse en una herramienta de trabajo diaria para la inmobiliaria.</strong>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">QUÉ CONSTRUIMOS</p>
              <h2>Una inmobiliaria por fuera. <span className="case-accent-blue">Un sistema de operación por dentro.</span></h2>
              <p>La experiencia conecta captación, búsqueda, asesores, inmuebles, agenda, clientes, negocios y administración.</p>
            </div>
            <div className="case-capabilities">
              {capabilities.map(([title,Icon,copy])=><article key={title}><Icon/><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">BACK OFFICE</p>
              <h2>La operación completa en <span className="case-accent-blue">un solo lugar.</span></h2>
              <p>El panel interno concentra inventario, asesores, equipo, negocios, finanzas, clientes, agenda, contenidos y tasas.</p>
            </div>
            <AdminMockup/>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container case-system-grid">
            <div>
              <p className="eyebrow">FLUJO INMOBILIARIO</p>
              <h2>De la publicación al <span className="case-accent-blue">cierre del negocio.</span></h2>
            </div>
            <div className="case-flow">
              {[
                ["01","Inventario","Cada asesor puede cargar y gestionar sus inmuebles."],
                ["02","Publicación","Propiedades visibles en el sitio con filtros y fichas comerciales."],
                ["03","Captación","Usuarios buscan, consultan y solicitan acompañamiento."],
                ["04","Agenda","Citas y seguimiento organizados dentro de la operación."],
                ["05","Negocio","Proceso de venta o arriendo con estado y asesor responsable."],
                ["06","Control","Dashboard y módulos internos para administrar la operación."],
              ].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p><ArrowRight/></article>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">SERVICIOS Y SEGMENTOS</p>
              <h2>Más que compra y arriendo. <span className="case-accent-blue">Un ecosistema inmobiliario.</span></h2>
              <p>La plataforma contempla diferentes necesidades alrededor de vivienda, inversión y soluciones corporativas.</p>
            </div>
            <div className="case-stack">
              {["Compra","Arriendo","Hipotecas","Avalúos","Inversión desde el exterior","Empresas"].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}
              <p>También se integran contenidos, tasas de referencia y herramientas para acompañar mejor la toma de decisiones.</p>
            </div>
          </div>
        </section>

        <section className="section section-deep">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">EXPERIENCIA RESPONSIVE</p>
              <h2>El negocio también se administra <span className="case-accent-blue">desde el celular.</span></h2>
              <p>La experiencia pública y el panel administrativo mantienen funcionalidad y claridad en pantallas pequeñas.</p>
            </div>
            <MobilePair/>
          </div>
        </section>

        <section className="case-result">
          <div className="container">
            <p className="eyebrow">EL RESULTADO</p>
            <h2>Una marca inmobiliaria con <span>producto digital propio y operación centralizada.</span></h2>
            <div className="case-result-pills">
              <span><CheckCircle2/> Marca creada desde cero</span>
              <span><Database/> Back office</span>
              <span><Users/> Gestión de asesores</span>
              <span><WalletCards/> Procesos comerciales</span>
              <span><Globe2/> Web pública</span>
            </div>
          </div>
        </section>

        <section className="main-cta formation-cta">
          <div className="container">
            <p className="eyebrow">¿NECESITAS ALGO MÁS QUE UNA WEB?</p>
            <h2>También construimos <span className="case-accent-light">sistemas para operar.</span></h2>
            <p>Diseñamos marcas, plataformas y herramientas digitales que se convierten en parte real del negocio.</p>
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
