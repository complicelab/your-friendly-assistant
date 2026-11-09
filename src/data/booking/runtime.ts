export const bookingStyles = "";

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
