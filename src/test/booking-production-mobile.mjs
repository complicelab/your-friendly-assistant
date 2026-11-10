import { chromium, webkit } from '@playwright/test';

const slots=[
  {slot_start:'2026-11-10T09:00:00-05:00',slot_end:'2026-11-10T10:00:00-05:00'},
  {slot_start:'2026-11-10T10:00:00-05:00',slot_end:'2026-11-10T11:00:00-05:00'},
  {slot_start:'2026-11-10T14:00:00-05:00',slot_end:'2026-11-10T15:00:00-05:00'}
];

async function run(engine,label){
  const browser=await engine.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const pageErrors=[];
  page.on('pageerror',err=>pageErrors.push(String(err&&err.stack||err)));
  page.on('console',msg=>{
    const text=msg.text();
    if(/booking|agenda|modal|error/i.test(text))console.log('PRODUCTION_CONSOLE_'+label.toUpperCase(),msg.type(),text);
  });

  await page.route('**/api/booking**',async route=>{
    if(route.request().method()==='GET'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,slots})});
      return;
    }
    await route.abort();
  });

  await page.goto('https://complicelab.com/',{waitUntil:'domcontentloaded',timeout:30000});

  const ctaCandidates=page.locator('a,button').filter({hasText:'Agendar diagnóstico'});
  const ctaInfo=await ctaCandidates.evaluateAll(nodes=>nodes.map((el,index)=>{
    const r=el.getBoundingClientRect();
    const cs=getComputedStyle(el);
    return {
      index,tag:el.tagName,id:el.id||'',cls:String(el.className||''),text:(el.textContent||'').replace(/\\s+/g,' ').trim(),
      dataOpen:el.getAttribute('data-open')||'',href:el.getAttribute('href')||'',
      display:cs.display,visibility:cs.visibility,opacity:cs.opacity,
      rect:{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right},
      inViewport:r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth
    };
  }));
  console.log('PRODUCTION_CTA_INFO_'+label.toUpperCase(),JSON.stringify(ctaInfo));
  const viewportCandidate=ctaInfo.find(x=>x.inViewport&&x.display!=='none'&&x.visibility!=='hidden'&&Number(x.opacity)>0);
  if(!viewportCandidate)throw new Error(label+' no booking CTA inside viewport: '+JSON.stringify(ctaInfo));
  const cta=ctaCandidates.nth(viewportCandidate.index);
  await cta.click();

  await page.waitForTimeout(700);
  const overlay=page.locator('#cl-booking-overlay');
  if(!(await overlay.isVisible().catch(()=>false))){
    const visibleCandidates=await page.locator('body *:visible').evaluateAll(nodes=>nodes.filter(el=>{
      const id=(el.id||'').toLowerCase();
      const cls=String(el.className||'').toLowerCase();
      const role=(el.getAttribute('role')||'').toLowerCase();
      const text=(el.textContent||'').replace(/\\s+/g,' ').trim().toLowerCase();
      return id.includes('modal')||id.includes('overlay')||cls.includes('modal')||cls.includes('overlay')||role==='dialog'||text.includes('agenda tu videollamada de diagnóstico');
    }).slice(0,40).map(el=>({
      tag:el.tagName,id:el.id||'',cls:String(el.className||''),role:el.getAttribute('role')||'',
      text:(el.textContent||'').replace(/\\s+/g,' ').trim().slice(0,260)
    })));
    throw new Error(label+' production CTA did not open #cl-booking-overlay. Page errors: '+JSON.stringify(pageErrors)+' Visible modal candidates: '+JSON.stringify(visibleCandidates));
  }

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

const only=(process.env.PROBE_ENGINE||'').toLowerCase();
if(!only||only==='chromium')await run(chromium,'chromium');
if(!only||only==='webkit')await run(webkit,'webkit');
console.log('PRODUCTION_MOBILE_BOOKING_OK');
