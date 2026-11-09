export const bookingStyles = `
<style id="complice-real-booking">
  .booking-loading{padding:.8rem 0;color:var(--gris);font-size:.88rem}
  .booking-empty{padding:1rem;border:1px solid var(--linea);border-radius:14px;background:var(--hielo);color:var(--gris);font-size:.88rem;line-height:1.5}
  .booking-success-note{margin-top:1rem;color:var(--gris);font-size:.82rem;line-height:1.55}
  .day:disabled,.slot:disabled{opacity:.55;cursor:not-allowed}
  .ag,.ag-pick,.ag-form{min-width:0;box-sizing:border-box}
  .ag{max-width:100%}
  .days,.slots{max-width:100%;box-sizing:border-box}
  @media(max-width:700px){
    #m-content{width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important;max-height:none!important;touch-action:pan-y!important}
    #m-host{width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important}
    .ag{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:16px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important}
    .ag-pick,.ag-form{width:100%!important;max-width:100%!important;min-width:0!important;overflow:visible!important}
    .days,.slots{overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;touch-action:pan-x pan-y!important}
    .days::-webkit-scrollbar,.slots::-webkit-scrollbar{display:none!important}
    .day,.slot{max-width:100%;box-sizing:border-box}
    #m-form input,#m-form select,#m-form textarea,#m-form button{max-width:100%;box-sizing:border-box}
  }
</style>
`;

type BookingPublicConfig = { url: string; key: string };

/**
 * Replaces only the agenda branch of the existing v10 modal. The original
 * modal, lead form, WhatsApp flow, navigation and every other section stay intact.
 */
export function replaceBookingRuntime(html: string, _config: BookingPublicConfig) {
  const legacyStart = html.indexOf("function nextDays(n){");
  const legacyEnd = html.indexOf("\n\nfunction openModal(mode,preset){", legacyStart);
  if (legacyStart < 0 || legacyEnd < 0) throw new Error("No se encontró la disponibilidad ficticia anterior.");
  html = html.slice(0, legacyStart) + html.slice(legacyEnd + 2);
  html = html.replace("function openModal(mode,preset){", "window.openModal=function openModal(mode,preset){");

  const startMarker = `  }else{\n    mbox.classList.add('wide');`;
  const endMarker = `    if(preset)f2.setPreset(preset);\n  }`;
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start < 0 || end < 0 || html.indexOf(startMarker, start + 1) >= 0) {
    throw new Error("No se encontró un único bloque de agenda pública para reemplazar.");
  }

  const replacement = `  }else{
    if(window.__clOpenBookingModal){
      window.__clOpenBookingModal();
      return;
    }
    window.__clBookingOpenRequested=true;
    return;
  }`;

  return html.slice(0, start) + replacement + html.slice(end + endMarker.length);
}
