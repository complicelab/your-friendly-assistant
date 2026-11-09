import { describe, expect, it } from 'vitest';
import { replaceBookingRuntime } from '@/data/booking/runtime';

function fixtureHtml() {
  return `<!doctype html><html><body><script>
function nextDays(n){return n;}
function legacySlots(){return [];}

function openModal(mode,preset){
  var mbox={classList:{add:function(){}}};
  var mcontent={innerHTML:''};
  var $=function(){return {textContent:'',addEventListener:function(){},setPreset:function(){}}};
  var $$=function(){return []};
  var cap1=function(x){return x};
  var leadForm=function(){return '<form id="m-form"></form>'};
  var bindLead=function(){};
  if(mode==='lead'){
    mcontent.innerHTML='lead';
  }else{
    mbox.classList.add('wide');
    mcontent.innerHTML='legacy booking';
    var f2=$('#m-form');
    if(preset)f2.setPreset(preset);
  }
}
</script></body></html>`;
}

describe('booking runtime transformation', () => {
  it('exposes the original modal opener and replaces the legacy booking branch', () => {
    const output=replaceBookingRuntime(fixtureHtml(),{url:'https://example.supabase.co',key:'anon'});
    expect(output).toContain('window.openModal=function openModal(mode,preset){');
    expect(output).toContain("fetch('/api/booking?'+params.toString()");
    expect(output).toContain("fetch('/api/booking'");
    expect(output).toContain("leadForm('m','Agendar diagnóstico')");
    expect(output).toContain('crm_public_book_meeting');
    expect(output).toContain('if(window.__clOpenBookingModal){window.__clOpenBookingModal();return;}');
    expect(output).not.toContain("mcontent.innerHTML='legacy booking'");
  });

  it('fails loudly if the expected original modal runtime is missing', () => {
    expect(()=>replaceBookingRuntime('<html></html>',{url:'x',key:'y'})).toThrow();
  });
});
