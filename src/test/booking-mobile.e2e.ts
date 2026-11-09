import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});

test('mobile booking popup scrolls and inline form gets date/time', async ({ page, context }) => {
  const slots = [
    { slot_start: '2026-11-10T09:00:00-05:00', slot_end: '2026-11-10T10:00:00-05:00' },
    { slot_start: '2026-11-10T10:00:00-05:00', slot_end: '2026-11-10T11:00:00-05:00' },
  ];

  await page.route('**/api/booking**', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, slots }) });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.cl-contact-date')).toHaveCount(1);
  await expect(page.locator('.cl-contact-time')).toHaveCount(1);

  const externalCta = page.locator('a.cl-booking-cta-label,button.cl-booking-cta-label').filter({ hasText: 'Agendar diagnóstico' }).first();
  await externalCta.click();

  const overlay = page.locator('#cl-booking-overlay');
  const panel = page.locator('#cl-booking-overlay .cl-booking-panel');
  await expect(overlay).toHaveClass(/is-open/);
  await expect(panel).toBeVisible();

  const metrics = await panel.evaluate(el => ({
    clientHeight: el.clientHeight,
    scrollHeight: el.scrollHeight,
    overflowY: getComputedStyle(el).overflowY,
    touchAction: getComputedStyle(el).touchAction,
  }));

  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
  expect(metrics.overflowY).toBe('auto');
  expect(metrics.touchAction).toContain('pan-y');

  const box = await panel.boundingBox();
  expect(box).not.toBeNull();
  const client = await context.newCDPSession(page);
  const x = Math.round((box?.x ?? 0) + (box?.width ?? 390) / 2);
  const yStart = Math.round((box?.y ?? 0) + Math.min((box?.height ?? 700) - 80, 700));
  const yEnd = Math.max(Math.round((box?.y ?? 0) + 180), 180);

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y: yStart, radiusX: 8, radiusY: 8, force: 1, id: 1 }],
  });
  for (const y of [yStart - 80, yStart - 160, yStart - 240, yEnd]) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: Math.max(y, yEnd), radiusX: 8, radiusY: 8, force: 1, id: 1 }],
    });
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(250);

  expect(await panel.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
});
