import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
page.on('pageerror', error => errors.push(error.message));
try {
  const response = await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 30000 });
  assert.equal(response.status(), 200, 'Invitation home page loads');
  await page.evaluate(() => window.inviteConfigPromise);
  assert.match(await page.title(), /Shreya.*Naman.*Wedding Invitation/i);
  assert.equal(await page.locator('meta[property="og:title"]').count(), 1, 'WhatsApp/social title metadata exists');
  assert.equal(await page.locator('meta[property="og:image"]').count(), 1, 'WhatsApp/social preview image exists');
  assert.equal(await page.locator('#musicBtn').isVisible(), true, 'Visible music control is available');

  await page.locator('#openSeal').click();
  await page.locator('#familySection').waitFor({ state: 'visible' });
  assert.match(await page.locator('#familySection').innerText(), /Daughter of/);
  assert.match(await page.locator('#familySection').innerText(), /Son of/);
  await page.locator('#familyContinue').click();
  await page.locator('#countdownSection').waitFor({ state: 'visible' });
  await page.locator('#countdownContinue').click();
  await page.locator('#dateSection').waitFor({ state: 'visible' });

  await page.locator('#pullScroll').click();
  await page.waitForFunction(() => {
    const p = document.querySelector('#scrollPaper');
    return p && p.classList.contains('open') && p.getBoundingClientRect().height > 300;
  });
  assert.equal(await page.locator('#dateSection .events .event').count(), 4, 'All four ceremony cards render');
  assert.match(await page.locator('#scrollPaper').innerText(), /We can’t wait to celebrate with you\./);
  await page.waitForTimeout(900);
  const scrollMetrics = await page.locator('#scrollPaper').evaluate(el => ({
    width: el.getBoundingClientRect().width,
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    maxHeight: getComputedStyle(el).maxHeight
  }));
  assert.ok(scrollMetrics.width <= 390, 'Scroll fits mobile viewport width');
  assert.ok(scrollMetrics.scrollWidth <= scrollMetrics.clientWidth + 1, 'Scroll does not create horizontal clipping');
  assert.ok(scrollMetrics.scrollHeight <= scrollMetrics.clientHeight + 2, 'Expanded scroll content is not clipped');
  assert.equal(await page.locator('html').evaluate(el => el.scrollWidth <= window.innerWidth + 1), true, 'Whole page has no horizontal overflow');
  // Verify closing and reopening the scroll does not trap its content on touch devices.
  await page.locator('#pullScroll').click();
  await page.waitForFunction(() => {
    const p = document.querySelector('#scrollPaper');
    return p && !p.classList.contains('open') && p.style.maxHeight === '0px';
  });
  await page.locator('#pullScroll').click();
  await page.waitForFunction(() => {
    const p = document.querySelector('#scrollPaper');
    return p && p.classList.contains('open') && p.getBoundingClientRect().height > 300;
  });
  await page.waitForTimeout(900);
  assert.match(await page.locator('#scrollPaper').innerText(), /The Royal Wedding/);

  // Tablet and laptop widths: no horizontal overflow and all event cards remain in layout.
  for (const viewport of [{ width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(100);
    const metrics = await page.evaluate(() => ({
      width: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      cards: document.querySelectorAll('#dateSection .events .event').length
    }));
    assert.ok(metrics.documentWidth <= metrics.width + 1, 'No horizontal overflow at viewport ' + viewport.width);
    assert.equal(metrics.cards, 4, 'All ceremony cards remain present at viewport ' + viewport.width);
  }
  await page.setViewportSize({ width: 390, height: 844 });


  const music = page.locator('#musicBtn');
  if (await music.getAttribute('aria-pressed') === 'true') await music.click();
  await music.click();
  await page.waitForTimeout(500);
  assert.equal(await music.getAttribute('aria-pressed'), 'true', 'Music can be started from the visible control');
  await music.click();
  assert.equal(await music.getAttribute('aria-pressed'), 'false', 'Music can be muted');

  await page.locator('a[href="#rsvpSection"]').first().click();
  await page.locator('#rsvpSection').waitFor({ state: 'visible' });
  await page.locator('#rsvpForm input[name="name"]').fill('Automated Guest');
  await page.locator('#rsvpForm select[name="attendance"]').selectOption('yes');
  await page.locator('#rsvpForm select[name="guests"]').selectOption('2');
  await page.locator('#rsvpForm button[type="submit"]').click();
  await page.locator('#rsvpStatus').waitFor({ state: 'visible' });
  assert.match(await page.locator('#rsvpStatus').innerText(), /not saved to the guest list|received privately/i, 'RSVP reports truthful save/fallback status');

  await page.locator('#messageSection').waitFor({ state: 'visible' });
  await page.locator('#wishName').fill('Automated Guest');
  await page.locator('#wish').fill('Wishing you both a beautiful life together.');
  await page.locator('#submitWish').click();
  await page.waitForFunction(() => document.querySelector('#toast')?.innerText.length > 0);
  assert.match(await page.locator('#toast').innerText(), /not saved to the private guestbook|saved privately/i, 'Wish reports truthful save/fallback status');

  await page.locator('#venueDirections').waitFor({ state: 'attached' });
  await page.locator('#lookbookPdfLink').waitFor({ state: 'attached' });
  await page.locator('#shareInvite').waitFor({ state: 'visible' });

  await page.goto('http://127.0.0.1:4173/admin.html', { waitUntil: 'networkidle' });
  assert.match(await page.title(), /Invitation Admin/);
  await page.locator('#guestAdmin').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#dbLogin').isVisible(), true, 'Admin guest database panel is available');
  assert.equal(await page.locator('#backgroundTarget').isVisible(), true, 'Admin supports individual page backgrounds');
  assert.equal(await page.locator('#musicPreview').count(), 1, 'Admin has a music preview player');
  assert.equal(await page.locator('#previewBride').innerText(), 'Shreya Arora', 'Draft preview displays the configured bride name');
  assert.equal(await page.locator('#previewGroom').innerText(), 'Naman Dora', 'Draft preview displays the configured groom name');
  assert.equal(await page.locator('#field-weddingStartDateTime').inputValue(), '2026-12-14T16:00:00+05:30', 'Countdown target is editable in the admin');

  assert.deepEqual(errors, [], 'No uncaught JavaScript page errors');
  console.log('PASS: mobile/tablet/laptop layouts, scroll open-close-reopen, all ceremony cards, audio controls, RSVP/wish fallback, venue, PDF, WhatsApp share UI and admin panel.');
  console.log('Scroll metrics:', JSON.stringify(scrollMetrics));
} finally {
  await browser.close();
}
