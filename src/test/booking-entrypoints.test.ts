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

  it('keeps external booking CTAs connected to the real modal',()=>{
    expect(index).toContain('window.openModal("booking")');
    expect(runtime).toContain('window.openModal=function openModal(mode,preset){');
    expect(runtime).toContain("leadForm('m','Agendar diagnóstico')");
  });

  it('routes both booking experiences through the same API and CRM RPC',()=>{
    expect(index).toContain('fetch("/api/booking",{method:"POST"');
    expect(runtime).toContain("fetch('/api/booking'");
    expect(api).toContain('supabase.rpc("crm_public_book_meeting"');
    expect(api).toContain('supabase.rpc("crm_public_available_slots"');
  });
});
