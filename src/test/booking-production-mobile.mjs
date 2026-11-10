import { chromium, webkit } from '@playwright/test';

const slots=[
  {slot_start:'2026-11-10T09:00:00-05:00',slot_end:'2026-11-10T10:00:00-05:00'},
  {slot_start:'2026-11-10T10:00:00-05:00',slot_end:'2026-11-10T11:00:00-05:00'},
  {slot_start:'2026-11-10T14:00:00-05:00',slot_end:'2026-11-10T15:00:00-05:00'}
];

async function run(engine,label){
  const browser=await engine.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});

  await page.route('**/api/booking**',async route=>{
    if(route.request().method()==='GET'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,slots})});
      return;
    }
    await route.abort();
  });

  await page.goto('https://complicelab.com/',{waitUntil:'domcontentloaded',timeout:30000});

  const cta=page.locator('a,button').filter({hasText:'Agendar diagnóstico'}).first();
  await cta.waitFor({state:'visible',timeout:15000});
  await cta.click();

  const overlay=page.locator('#cl-booking-overlay');
  await overlay.waitFor({state:'visible',timeout:10000});

  const schedule=overlay.locator('[data-cl-step="schedule"]');
  const data=overlay.locator('[data-cl-step="data"]');
  const next=overlay.locator('.cl-booking-mobile-next');

  if(!(await schedule.isVisible()))throw new Error(label+' production schedule step is not visible');
  if(await data.isVisible())throw new Error(label+' production data step is visible too early');

  const day=overlay.locator('.cl-booking-day').first();
  await day.waitFor({state:'visible',timeout:10000});
  await day.click();
  const time=overlay.locator('.cl-booking-time').first();
  await time.waitFor({state:'visible',timeout:10000});
  await time.click();

  if(await next.isDisabled())throw new Error(label+' production continue button stayed disabled');
  await next.click();

  if(await schedule.isVisible())throw new Error(label+' production schedule did not hide after continue');
  if(!(await data.isVisible()))throw new Error(label+' production data step did not appear');

  const panel=overlay.locator('.cl-booking-panel');
  const name=overlay.locator('input[name="full_name"]');
  await name.fill('Prueba visual');
  await name.focus();
  await page.setViewportSize({width:390,height:520});
  await page.waitForTimeout(250);

  const email=overlay.locator('input[name="email"]');
  await email.scrollIntoViewIfNeeded();
  await email.focus();
  await page.waitForTimeout(300);

  const metrics=await panel.evaluate(el=>({
    overflowY:getComputedStyle(el).overflowY,
    scrollTop:el.scrollTop,
    clientHeight:el.clientHeight,
    scrollHeight:el.scrollHeight
  }));
  if(metrics.overflowY!=='auto')throw new Error(label+' production panel overflowY='+metrics.overflowY);
  if(metrics.scrollHeight<=metrics.clientHeight)throw new Error(label+' production data step is not scrollable '+JSON.stringify(metrics));

  const submit=overlay.locator('.cl-booking-submit');
  await submit.scrollIntoViewIfNeeded();
  const box=await submit.boundingBox();
  const vp=page.viewportSize();
  if(!box||box.y<0||box.y+box.height>(vp?.height||520)+4){
    throw new Error(label+' production submit is not reachable with keyboard viewport '+JSON.stringify({box,vp,metrics}));
  }

  console.log('PRODUCTION_'+label.toUpperCase()+'_MOBILE_OK');
  await browser.close();
}

await run(chromium,'chromium');
await run(webkit,'webkit');
console.log('PRODUCTION_MOBILE_BOOKING_OK');
