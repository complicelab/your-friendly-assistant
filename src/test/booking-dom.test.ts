import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import part1 from '../data/v10/part-1';
import part2 from '../data/v10/part-2';
import part3 from '../data/v10/part-3';
import part4 from '../data/v10/part-4';
import part5 from '../data/v10/part-5';
import part6 from '../data/v10/part-6';
import part7 from '../data/v10/part-7';
import part8 from '../data/v10/part-8';
import part9 from '../data/v10/part-9';
import part10 from '../data/v10/part-10';
import part11 from '../data/v10/part-11';
import part12 from '../data/v10/part-12';

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
    <section id="contact-copy">
      <div class="copy">
        <h2>Hablemos de <span>tu negocio.</span></h2>
        <button id="left-cta">Agendar videollamada de diagnóstico</button>
      </div>
    </section>
    <section id="contact-fields">
      <form id="contact-form" action="https://wa.me/573000000000" onsubmit="window.__legacySubmit=true">
        <label>Nombre y apellido<input name="name"></label>
        <label>Marca personal o empresa<input name="brand"></label>
        <label>WhatsApp<select name="country"><option value="+57">+57</option></select><input name="phone" type="tel"></label>
        <label>Correo<input name="email" type="email"></label>
        <div>¿Qué servicio te interesa?
          <button type="button">Creamos sistemas con IA a la medida</button>
        </div>
        <label><input type="checkbox"> Autorizo el uso de mis datos para responder esta solicitud.</label>
        <button id="submit" type="submit" onclick="window.__legacyClick=true">Continuar por WhatsApp →</button>
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
    Object.defineProperty(window,'fetch',{configurable:true,writable:true,value:vi.fn(async()=>({
      ok:true,
      json:async()=>({ok:true,slots})
    }))});

    window.eval(bookingScript());
    await Promise.resolve();
    await Promise.resolve();

    const form=window.document.querySelector('#contact-form')!;
    expect(form.querySelector('.cl-contact-date')).toBeTruthy();
    expect(form.querySelector('.cl-contact-time')).toBeTruthy();
    const submit=window.document.querySelector('#submit') as HTMLButtonElement;
    expect(submit?.textContent).toBe('Agendar diagnóstico');
    expect(submit?.type).toBe('button');
    expect(submit?.getAttribute('onclick')).toBeNull();
    expect((form as HTMLFormElement).getAttribute('action')).toBeNull();
    expect((form as HTMLFormElement).getAttribute('onsubmit')).toBeNull();
    expect(window.document.querySelector('#left-cta')).toBeNull();

    const hero=window.document.querySelector('#hero-cta') as HTMLElement;
    hero.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));

    const overlay=window.document.querySelector('#cl-booking-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.classList.contains('is-open')).toBe(true);
    expect(overlay?.querySelector('.cl-booking-form')).toBeTruthy();
  });

  it('enhances the actual compressed homepage contact form',async()=>{
    const compressed=part1+part2+part3+part4+part5+part6+part7+part8+part9+part10+part11+part12;
    const html=gunzipSync(Buffer.from(compressed,'base64')).toString('utf8');
    const dom=new JSDOM(html,{url:'https://complicelab.com/',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(window){
      Object.defineProperty(window,'matchMedia',{value:()=>({matches:true,addEventListener:()=>{},removeEventListener:()=>{}})});
      Object.defineProperty(window,'visualViewport',{value:{height:780,addEventListener:()=>{},removeEventListener:()=>{}}});
      Object.defineProperty(window,'requestAnimationFrame',{value:(cb:FrameRequestCallback)=>{cb(0);return 1;}});
      Object.defineProperty(window,'scrollTo',{value:()=>{}});
      Object.defineProperty(window.HTMLElement.prototype,'scrollTo',{value:()=>{}});
      Object.defineProperty(window.HTMLCanvasElement.prototype,'getContext',{value:()=>new Proxy({},{
        get(target,prop){
          if(prop==='canvas')return null;
          if(prop==='measureText')return ()=>({width:0});
          return ()=>{};
        },
        set(){return true;}
      })});
      if(window.SVGElement){
        Object.defineProperty(window.SVGElement.prototype,'getTotalLength',{value:()=>100});
        Object.defineProperty(window.SVGElement.prototype,'getPointAtLength',{value:()=>({x:0,y:0})});
      }
    }});
    const {window}=dom;
    await new Promise(resolve=>setTimeout(resolve,80));

    const slots=[
      {slot_start:'2026-11-10T14:00:00-05:00',slot_end:'2026-11-10T15:00:00-05:00'},
      {slot_start:'2026-11-10T15:00:00-05:00',slot_end:'2026-11-10T16:00:00-05:00'}
    ];
    Object.defineProperty(window,'fetch',{configurable:true,writable:true,value:vi.fn(async()=>({
      ok:true,
      json:async()=>({ok:true,slots})
    }))});

    window.eval(bookingScript());
    await Promise.resolve();
    await Promise.resolve();

    if(window.document.querySelectorAll('.cl-contact-date').length===0){
      const texts=Array.from(window.document.querySelectorAll('body *')).filter(el=>{
        const t=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
        return t==='nombre y apellido' || t.includes('autorizo el uso de mis datos') || t.includes('continuar por whatsapp') || t.includes('agendar diagnóstico');
      }).slice(0,20);
      console.log('BOOKING_DIAGNOSTIC_MATCHES',texts.map(el=>({
        tag:el.tagName,id:(el as HTMLElement).id,cls:(el as HTMLElement).className,
        text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,180)
      })));
      const structures=Array.from(window.document.querySelectorAll('form,section,div')).filter(el=>{
        const inputs=el.querySelectorAll('input').length;
        const checks=el.querySelectorAll('input[type="checkbox"]').length;
        const t=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
        return inputs>=3 && (checks>0 || t.includes('nombre y apellido') || t.includes('servicio te interesa'));
      }).sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length).slice(0,30);
      console.log('BOOKING_DIAGNOSTIC_STRUCTURES',structures.map(el=>({
        tag:el.tagName,id:(el as HTMLElement).id,cls:(el as HTMLElement).className,
        text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,700),
        inputs:el.querySelectorAll('input').length,
        buttons:el.querySelectorAll('button,a').length,
        checks:el.querySelectorAll('input[type="checkbox"]').length,
        labels:el.querySelectorAll('label').length
      })));
    }
    expect(window.document.querySelectorAll('.cl-contact-date').length).toBe(1);
    expect(window.document.querySelectorAll('.cl-contact-time').length).toBe(1);

    const inlineBox=window.document.querySelector('.cl-contact-booking');
    expect(inlineBox).toBeTruthy();
    const inlineRoot=inlineBox?.parentElement;
    expect((inlineRoot?.textContent||'').toLowerCase()).toContain('autorizo');

    const external=Array.from(window.document.querySelectorAll('a,button')).find(el=>
      (el.textContent||'').toLowerCase().includes('agendar diagnóstico') &&
      !el.closest('.cl-contact-booking') &&
      !el.closest('#cl-booking-overlay')
    ) as HTMLElement | undefined;
    expect(external).toBeTruthy();
    external?.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));

    const overlay=window.document.querySelector('#cl-booking-overlay');
    expect(overlay?.classList.contains('is-open')).toBe(true);

    const actualInlineBox=window.document.querySelector('.cl-contact-booking') as HTMLElement;
    const root=actualInlineBox.parentElement as HTMLElement;

    const labels=Array.from(root.querySelectorAll('label'));
    const byLabel=(needle:string)=>labels.find(el=>(el.textContent||'').toLowerCase().includes(needle.toLowerCase()));

    const nameInput=byLabel('Nombre y apellido')?.querySelector('input') as HTMLInputElement | null;
    const brandInput=byLabel('Marca personal o empresa')?.querySelector('input') as HTMLInputElement | null;
    const emailInput=byLabel('Correo')?.querySelector('input') as HTMLInputElement | null;
    const whatsappLabel=byLabel('WhatsApp');
    const phoneInput=Array.from(whatsappLabel?.querySelectorAll('input')||[]).find(el=>(el as HTMLInputElement).type!=='checkbox') as HTMLInputElement | undefined;

    if(nameInput)nameInput.value='Prueba Cómplice';
    if(brandInput)brandInput.value='Marca Prueba';
    if(emailInput)emailInput.value='prueba@example.com';
    if(phoneInput)phoneInput.value='3001234567';

    const serviceButton=Array.from(root.querySelectorAll('button,[role="button"],label')).find(el=>(el.textContent||'').toLowerCase().includes('sistemas con ia')) as HTMLElement | undefined;
    if(serviceButton){
      serviceButton.classList.add('selected');
      serviceButton.setAttribute('aria-pressed','true');
    }

    const consent=Array.from(root.querySelectorAll('input[type="checkbox"]')).find(input=>{
      const lab=input.closest('label')||input.parentElement;
      return !!lab && (lab.textContent||'').toLowerCase().includes('autorizo');
    }) as HTMLInputElement | undefined;
    if(consent)consent.checked=true;

    await new Promise(resolve=>setTimeout(resolve,25));
    const dateInput=root.querySelector('.cl-contact-date') as HTMLInputElement;
    dateInput.value='2026-11-10';
    dateInput.dispatchEvent(new window.Event('change',{bubbles:true}));

    const timeSelect=root.querySelector('.cl-contact-time') as HTMLSelectElement;
    expect(timeSelect.options.length).toBeGreaterThan(1);
    timeSelect.value=slots[0].slot_start;
    timeSelect.dispatchEvent(new window.Event('change',{bubbles:true}));

    const postBodies:any[]=[];
    const originalFetch=window.fetch as any;
    window.fetch=vi.fn(async(input:any,init?:any)=>{
      if(init?.method==='POST'){
        postBodies.push(JSON.parse(init.body));
        return {ok:true,json:async()=>({ok:true,meeting_id:'meeting-test'})};
      }
      return originalFetch(input,init);
    }) as any;

    const inlineAction=Array.from(window.document.querySelectorAll('[data-cl-clean-booking-action="1"]')).find(el=>!el.closest('#cl-booking-overlay')) as HTMLElement | undefined;
    expect(inlineAction).toBeTruthy();
    inlineAction?.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));
    await Promise.resolve();
    await Promise.resolve();

    if(postBodies.length===0){
      console.log('BOOKING_SUBMIT_DIAGNOSTIC',{
        note:(root.querySelector('.cl-contact-booking-note')?.textContent||'').trim(),
        name:nameInput?.value||'',
        brand:brandInput?.value||'',
        email:emailInput?.value||'',
        phone:phoneInput?.value||'',
        consent:!!consent?.checked,
        date:dateInput.value,
        time:timeSelect.value,
        actionText:inlineAction?.textContent||'',
        serviceButton:serviceButton?.textContent||'',
        serviceClass:(serviceButton as HTMLElement|undefined)?.className||'',
        servicePressed:serviceButton?.getAttribute('aria-pressed')||''
      });
    }
    expect(postBodies.length).toBe(1);
    expect(postBodies[0].starts_at).toBe(slots[0].slot_start);
    expect(postBodies[0].full_name).toBe('Prueba Cómplice');
    expect(postBodies[0].email).toBe('prueba@example.com');
    expect(postBodies[0].solution_interest).toBeTruthy();
  });

});
