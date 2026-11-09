import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('diagnostic booking entrypoints', () => {
  const index=fs.readFileSync(new URL('../routes/index.tsx',import.meta.url),'utf8');
  const runtime=fs.readFileSync(new URL('../data/booking/runtime.ts',import.meta.url),'utf8');
  const api=fs.readFileSync(new URL('../routes/api.booking.ts',import.meta.url),'utf8');

  it('keeps date and time inside the visible contact form',()=>{
    expect(index).toContain('class="cl-contact-date"');
    expect(index).toContain('class="cl-contact-time"');
    expect(index).toContain('submitInline(root,action)');
  });

  it('uses an isolated scroll-safe modal for external booking CTAs',()=>{
    expect(index).toContain('id="cl-booking-overlay"');
    expect(index).toContain('openBookingModal();');
    expect(index).toContain('overflow-y:auto');
    expect(index).toContain('-webkit-overflow-scrolling:touch');
    expect(index).toContain('touch-action:pan-y');
    expect(index).toContain('height:100dvh');
    expect(index).toContain('window.__clOpenBookingModal=openBookingModal');
    expect(index).toContain('function clearLegacyBookingShell()');
    expect(index).not.toContain('window.openModal("booking")');
  });

  it('routes both booking experiences through the same API and CRM RPC',()=>{
    expect((index.match(/fetch\("\/api\/booking"/g)||[]).length).toBeGreaterThanOrEqual(2);
    expect(index).toContain('submitInline(root,action)');
    expect(index).toContain('submitModalBooking');
    expect(runtime).not.toContain("fetch('/api/booking'");
    expect(runtime).toContain('window.__clOpenBookingModal');
    expect(api).toContain('supabase.rpc("crm_public_book_meeting"');
    expect(api).toContain('supabase.rpc("crm_public_available_slots"');
  });
  it('runs the booking enhancer after the original DOM and normalizes before locating the contact form',()=>{
    const headInjection=index.match(/\.replace\("<\/head>"[\s\S]*?\)\s*\.replace\("<\/body>"/)?.[0]||'';
    const bodyInjection=index.match(/\.replace\("<\/body>",[\s\S]*?"<\/body>"\)/)?.[0]||'';
    expect(headInjection).not.toContain('UNIFIED_BOOKING_CTA');
    expect(bodyInjection).toContain('UNIFIED_BOOKING_CTA');

    const normalizeStart=index.indexOf('function normalize(){');
    const normalizeEnd=index.indexOf('document.addEventListener("click"',normalizeStart);
    const normalize=index.slice(normalizeStart,normalizeEnd);
    expect(normalize.indexOf('document.querySelectorAll("a,button")')).toBeLessThan(normalize.indexOf('var root=findContactRoot();'));
    expect(normalize).toContain('installInlineScheduler(root)');
    expect(normalize).toContain('if(root.contains(el))return;');
    expect(normalize).toContain('el.remove();');
  });

  it('uses one mobile scroll container and follows the visual viewport when the keyboard opens',()=>{
    expect(index).toContain('window.visualViewport');
    expect(index).toContain('--cl-booking-vh');
    expect(index).toContain('--cl-booking-vv-top');
    expect(index).toContain('var(--cl-booking-vh,100dvh)');
    expect(index).toContain('body.cl-booking-modal-open{overflow:hidden!important;touch-action:auto!important');
    expect(index).toContain('overflow-y:auto!important');
    expect(index).toContain('-webkit-overflow-scrolling:touch!important');
    expect(index).toContain('.cl-booking-panel{');
    expect(index).toContain('height:auto!important;max-height:none!important');
    expect(index).toContain('overflow:visible!important;touch-action:pan-y');
    expect(index).toContain('function keepFocusedBookingFieldVisible()');
    expect(index).toContain('bookingForm.addEventListener("focusin"');
  });

});
