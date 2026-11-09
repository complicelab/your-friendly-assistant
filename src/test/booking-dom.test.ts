import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'node:fs';

function bookingScript(){
  const source=fs.readFileSync(new URL('../routes/index.tsx',import.meta.url),'utf8');
  const start=source.indexOf('const UNIFIED_BOOKING_CTA = `');
  const end=source.indexOf('`\n\nfunction getOriginalHtml()',start);
  if(start<0||end<0)throw new Error('booking script not found');
  const fragment=source.slice(start+'const UNIFIED_BOOKING_CTA = `'.length,end);
  const match=fragment.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  if(!match)throw new Error('booking client script not found');
  return match[1];
}

function fixture(){
  return `<!doctype html>
  <html><body>
    <section id="contact">
      <div class="copy">
        <h2>Hablemos de <span>tu negocio.</span></h2>
        <button id="left-cta">Agendar videollamada de diagnóstico</button>
      </div>
      <form id="contact-form">
        <label>Nombre y apellido<input name="name"></label>
        <label>Marca personal o empresa<input name="brand"></label>
        <label>WhatsApp<select name="country"><option value="+57">+57</option></select><input name="phone" type="tel"></label>
        <label>Correo<input name="email" type="email"></label>
        <div>¿Qué servicio te interesa?
          <label><input type="radio" name="service"> Creamos sistemas con IA a la medida</label>
        </div>
        <label><input type="checkbox"> Autorizo el uso de mis datos para responder esta solicitud.</label>
        <button id="submit">Continuar por WhatsApp</button>
      </form>
    </section>
    <button id="hero-cta">Agendar diagnóstico</button>
  </body></html>`;
}

describe('booking client DOM flow',()=>{
  it('restores inline date/time and opens the dedicated popup from external CTAs',async()=>{
    const dom=new JSDOM(fixture(),{url:'https://complicelab.com/',runScripts:'outside-only',pretendToBeVisual:true});
    const {window}=dom;
    Object.defineProperty(window,'matchMedia',{value:()=>({matches:true,addEventListener:()=>{},removeEventListener:()=>{}})});
    Object.defineProperty(window,'visualViewport',{value:{height:780,addEventListener:()=>{},removeEventListener:()=>{}}});
    Object.defineProperty(window,'requestAnimationFrame',{value:(cb:FrameRequestCallback)=>{cb(0);return 1;}});
    const slots=[
      {slot_start:'2026-11-10T14:00:00-05:00',slot_end:'2026-11-10T15:00:00-05:00'},
      {slot_start:'2026-11-10T15:00:00-05:00',slot_end:'2026-11-10T16:00:00-05:00'}
    ];
    Object.defineProperty(window,'fetch',{value:vi.fn(async()=>({
      ok:true,
      json:async()=>({ok:true,slots})
    }))});

    window.eval(bookingScript());
    await Promise.resolve();
    await Promise.resolve();

    const form=window.document.querySelector('#contact-form')!;
    expect(form.querySelector('.cl-contact-date')).toBeTruthy();
    expect(form.querySelector('.cl-contact-time')).toBeTruthy();
    expect(window.document.querySelector('#submit')?.textContent).toBe('Agendar diagnóstico');
    expect(window.document.querySelector('#left-cta')).toBeNull();

    const hero=window.document.querySelector('#hero-cta') as HTMLElement;
    hero.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));

    const overlay=window.document.querySelector('#cl-booking-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.classList.contains('is-open')).toBe(true);
    expect(overlay?.querySelector('.cl-booking-form')).toBeTruthy();
  });
});
