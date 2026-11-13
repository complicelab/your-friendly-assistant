import fs from 'node:fs';
import { chromium, webkit } from '@playwright/test';

const source=fs.readFileSync(new URL('../routes/index.tsx',import.meta.url),'utf8');
const declaration=source.indexOf('const UNIFIED_BOOKING_CTA');
const firstTick=declaration>=0?source.indexOf(String.fromCharCode(96),declaration):-1;
// End at the booking module's own client script, not at a later homepage module.
const lastScript=firstTick>=0?source.indexOf('</script>',firstTick):-1;
if(declaration<0||firstTick<0||lastScript<=firstTick)throw new Error('Could not extract UNIFIED_BOOKING_CTA from index.tsx');
const runtime=source.slice(firstTick+1,lastScript+'</script>'.length);

const slots=[
  {slot_start:'2026-11-10T09:00:00-05:00',slot_end:'2026-11-10T10:00:00-05:00'},
  {slot_start:'2026-11-10T10:00:00-05:00',slot_end:'2026-11-10T11:00:00-05:00'},
  {slot_start:'2026-11-10T14:00:00-05:00',slot_end:'2026-11-10T15:00:00-05:00'}
];

async function runMobileScenario(browserType,label){
  const browser=await browserType.launch({headless:true});
  const context=await browser.newContext({
    viewport:{width:390,height:844},
    isMobile:true,
    hasTouch:true,
    deviceScaleFactor:2,
    userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
  });
  const page=await context.newPage();

  await page.route('**/api/booking**',async route=>{
    if(route.request().method()==='GET'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,slots})});
    }else{
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,meeting_id:'mobile-test'})});
    }
  });

  await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><base href="https://complicelab.com/"></head><body><main style="min-height:3000px"></main>'+runtime+'</body></html>',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.__clOpenBookingModal==='function',{timeout:10000});
  await page.evaluate(()=>window.__clOpenBookingModal());

  const overlay=page.locator('#cl-booking-overlay');
  await overlay.waitFor({state:'visible'});
  const panel=page.locator('#cl-booking-overlay .cl-booking-panel');
  const duplicateInlineScheduler=page.locator('#cl-booking-overlay .cl-contact-booking');
  if(await duplicateInlineScheduler.count())throw new Error(label+' popup contains duplicated inline date/time block');

  const beforeOverlay=await overlay.evaluate(el=>({
    overflowY:getComputedStyle(el).overflowY,
    touchAction:getComputedStyle(el).touchAction,
    clientHeight:el.clientHeight,
    scrollHeight:el.scrollHeight
  }));
  if(beforeOverlay.overflowY!=='hidden')throw new Error(label+' overlay must stay fixed/non-scrollable: '+JSON.stringify(beforeOverlay));
  if(!beforeOverlay.touchAction.includes('pan-y'))throw new Error(label+' overlay blocks vertical touch gestures: '+JSON.stringify(beforeOverlay));

  const beforePanel=await panel.evaluate(el=>({
    overflowY:getComputedStyle(el).overflowY,
    touchAction:getComputedStyle(el).touchAction,
    clientHeight:el.clientHeight,
    scrollHeight:el.scrollHeight
  }));
  if(beforePanel.overflowY!=='auto')throw new Error(label+' panel is not the mobile scroll container: '+JSON.stringify(beforePanel));
  if(!beforePanel.touchAction.includes('pan-y'))throw new Error(label+' panel does not allow vertical panning: '+JSON.stringify(beforePanel));

  const scheduleStep=page.locator('#cl-booking-overlay [data-cl-step="schedule"]');
  const dataStep=page.locator('#cl-booking-overlay [data-cl-step="data"]');
  await scheduleStep.waitFor({state:'visible'});
  if(await dataStep.isVisible())throw new Error(label+' data step must be hidden before choosing a time');

  const day=page.locator('#cl-booking-overlay .cl-booking-day').first();
  await day.waitFor({state:'visible'});
  await day.click();
  const time=page.locator('#cl-booking-overlay .cl-booking-time').first();
  await time.waitFor({state:'visible'});
  await time.click();

  const next=page.locator('#cl-booking-overlay .cl-booking-mobile-next');
  if(await next.isDisabled())throw new Error(label+' continue button stayed disabled after selecting a time');
  await next.click();
  await dataStep.waitFor({state:'visible'});
  if(await scheduleStep.isVisible())throw new Error(label+' schedule step stayed visible after continuing');

  const name=page.locator('#cl-booking-overlay input[name="full_name"]');
  await name.fill('Cliente Prueba');
  await name.focus();

  await page.setViewportSize({width:390,height:520});
  await page.waitForTimeout(220);

  const email=page.locator('#cl-booking-overlay input[name="email"]');
  await email.scrollIntoViewIfNeeded();
  await email.focus();
  await page.waitForTimeout(380);

  const afterFocus=await panel.evaluate(el=>({
    scrollTop:el.scrollTop,
    clientHeight:el.clientHeight,
    scrollHeight:el.scrollHeight,
    rect:{top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom}
  }));
  if(afterFocus.scrollTop<=0)throw new Error(label+' panel did not move after focusing lower field: '+JSON.stringify(afterFocus));

  const consent=page.locator('#cl-booking-overlay input[name="consent"]');
  await consent.scrollIntoViewIfNeeded();
  await page.waitForTimeout(80);

  const submit=page.locator('#cl-booking-overlay .cl-booking-submit');
  await submit.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const submitBox=await submit.boundingBox();
  if(!submitBox)throw new Error(label+' submit button is not reachable');
  const viewport=page.viewportSize();
  if(submitBox.y<0||submitBox.y+submitBox.height>(viewport?.height||520)+4){
    throw new Error(label+' submit button remains outside visible viewport: '+JSON.stringify({submitBox,viewport,scrollTop:await panel.evaluate(el=>el.scrollTop)}));
  }

  const panelMetrics=await panel.evaluate(el=>({
    overflowY:getComputedStyle(el).overflowY,
    height:getComputedStyle(el).height,
    maxHeight:getComputedStyle(el).maxHeight,
    touchAction:getComputedStyle(el).touchAction
  }));
  if(panelMetrics.overflowY!=='auto'){
    throw new Error(label+' panel lost mobile scrolling: '+JSON.stringify(panelMetrics));
  }

  // Complete the real booking flow after keyboard/scroll checks.
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(120);

  await page.locator('#cl-booking-overlay input[name="brand_name"]').fill('Marca Prueba');
  await page.locator('#cl-booking-overlay input[name="whatsapp"]').fill('3001234567');
  await page.locator('#cl-booking-overlay input[name="email"]').fill('prueba@example.com');
  await page.locator('#cl-booking-overlay select[name="solution_interest"]').selectOption({label:'Creamos sistemas con IA a la medida'});
  await page.locator('#cl-booking-overlay input[name="consent"]').check();

  const finalSubmit=page.locator('#cl-booking-overlay .cl-booking-submit');
  await finalSubmit.scrollIntoViewIfNeeded();
  await finalSubmit.click();

  await page.locator('#cl-booking-overlay .cl-booking-success').waitFor({state:'visible',timeout:10000});
  const successText=(await page.locator('#cl-booking-overlay .cl-booking-success').innerText()).toLowerCase();
  if(!successText.includes('diagnóstico agendado'))throw new Error(label+' booking did not reach success state: '+successText);

  await browser.close();
  console.log('MOBILE_BOOKING_'+label.toUpperCase()+'_OK');
}

await runMobileScenario(chromium,'chromium');
await runMobileScenario(webkit,'webkit');
console.log('MOBILE_BOOKING_BROWSER_TEST_OK');
