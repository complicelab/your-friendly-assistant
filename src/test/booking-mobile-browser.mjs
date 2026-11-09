import { chromium } from '@playwright/test';

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({
  viewport:{width:390,height:844},
  isMobile:true,
  hasTouch:true,
  deviceScaleFactor:2,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
});
const page=await context.newPage();

const slots=[
  {slot_start:'2026-11-10T09:00:00-05:00',slot_end:'2026-11-10T10:00:00-05:00'},
  {slot_start:'2026-11-10T10:00:00-05:00',slot_end:'2026-11-10T11:00:00-05:00'},
  {slot_start:'2026-11-10T14:00:00-05:00',slot_end:'2026-11-10T15:00:00-05:00'}
];

await page.route('**/api/booking**',async route=>{
  if(route.request().method()==='GET'){
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,slots})});
  }else{
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,meeting_id:'mobile-test'})});
  }
});

await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>typeof window.__clOpenBookingModal==='function',{timeout:30000});
await page.evaluate(()=>window.__clOpenBookingModal());

const overlay=page.locator('#cl-booking-overlay');
await overlay.waitFor({state:'visible'});
const panel=page.locator('#cl-booking-overlay .cl-booking-panel');

const before=await overlay.evaluate(el=>({
  overflowY:getComputedStyle(el).overflowY,
  touchAction:getComputedStyle(el).touchAction,
  clientHeight:el.clientHeight,
  scrollHeight:el.scrollHeight
}));
if(before.overflowY!=='auto')throw new Error('Overlay is not the mobile scroll container: '+JSON.stringify(before));
if(before.scrollHeight<=before.clientHeight)throw new Error('Overlay is not scrollable: '+JSON.stringify(before));

const name=page.locator('#cl-booking-overlay input[name="full_name"]');
await name.fill('Cliente Prueba');
await name.focus();

// Simulate the visual area shrinking when the software keyboard appears.
await page.setViewportSize({width:390,height:520});
await page.waitForTimeout(180);

const email=page.locator('#cl-booking-overlay input[name="email"]');
await email.scrollIntoViewIfNeeded();
await email.focus();
await page.waitForTimeout(350);

const afterFocus=await overlay.evaluate(el=>({
  scrollTop:el.scrollTop,
  clientHeight:el.clientHeight,
  scrollHeight:el.scrollHeight,
  rect:el.getBoundingClientRect().toJSON()
}));
if(afterFocus.scrollTop<=0)throw new Error('Overlay did not move after focusing lower field: '+JSON.stringify(afterFocus));

const submit=page.locator('#cl-booking-overlay .cl-booking-submit');
await submit.scrollIntoViewIfNeeded();
await page.waitForTimeout(120);
const submitBox=await submit.boundingBox();
if(!submitBox)throw new Error('Submit button is not reachable');
const viewport=page.viewportSize();
if(submitBox.y<0||submitBox.y+submitBox.height>(viewport?.height||520)+4){
  throw new Error('Submit button remains outside visible viewport: '+JSON.stringify({submitBox,viewport,scrollTop:await overlay.evaluate(el=>el.scrollTop)}));
}

// Ensure the overlay remains the only scroll container on mobile.
const panelMetrics=await panel.evaluate(el=>({
  overflowY:getComputedStyle(el).overflowY,
  height:getComputedStyle(el).height,
  maxHeight:getComputedStyle(el).maxHeight
}));
if(panelMetrics.overflowY==='auto'||panelMetrics.overflowY==='scroll'){
  throw new Error('Panel still owns mobile scrolling: '+JSON.stringify(panelMetrics));
}

await browser.close();
console.log('MOBILE_BOOKING_BROWSER_TEST_OK');
