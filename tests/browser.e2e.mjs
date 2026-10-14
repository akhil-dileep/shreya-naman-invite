import assert from 'node:assert/strict';
import fs from 'node:fs';
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
  assert.equal(await page.locator('#rsvpForm select[name="guests"] option').count(),20,'RSVP guest count offers exact headcounts from 1 through 20, with no ambiguous 5+ option');
  assert.equal(await page.locator('#rsvpForm select[name="guests"] option').last().getAttribute('value'),'20','Guest count maximum matches database validation');
  await page.locator('#rsvpForm button[type="submit"]').click();
  await page.locator('#rsvpStatus').waitFor({ state: 'visible' });
  assert.match(await page.locator('#rsvpStatus').innerText(), /not saved to the guest list|RSVP has been received/i, 'RSVP reports truthful save/fallback status');

  await page.locator('#messageSection').waitFor({ state: 'visible' });
  await page.locator('#wishName').fill('Automated Guest');
  await page.locator('#wish').fill('Wishing you both a beautiful life together.');
  await page.locator('#submitWish').click();
  await page.waitForFunction(() => document.querySelector('#toast')?.innerText.length > 0);
  assert.match(await page.locator('#toast').innerText(), /could not be sent|wish has been received/i, 'Wish reports truthful save/fallback status');

  await page.locator('#venueDirections').waitFor({ state: 'attached' });
  await page.locator('#lookbookPdfLink').waitFor({ state: 'attached' });
  await page.locator('#lookbookDownloadLink').waitFor({ state: 'attached' });
  await page.locator('#shareInvite').waitFor({ state: 'visible' });
  await page.locator('a[href="#photoSection"]').first().click();
  await page.locator('#photoSection').waitFor({ state: 'visible' });
  await page.locator('a[href="#lookbookSection"]').first().click();
  await page.locator('#lookbookSection').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#toggleLookbookPreview').count(),0,'No embedded PDF preview is shown');
  assert.equal(await page.locator('#lookbookPdfPreview').count(),0,'No cropped in-page PDF container exists');
  assert.equal(await page.locator('#lookbookPdfLink').innerText(),'View lookbook PDF ↗');
  assert.equal(await page.locator('#lookbookDownloadLink').isVisible(),true,'PDF download remains available');
  assert.equal(await page.locator('#lookbookSection .events [data-calendar-event]').count(),4,'Every colour-theme card has an add-to-calendar action');
  assert.equal(await page.locator('#dateSection .events [data-calendar-event]').count(),4,'Every ceremony card has an add-to-calendar action');
  assert.equal(await page.locator('#addAllCalendar').isVisible(),true,'Guests can download one calendar file for all events');
  assert.equal(await page.locator('#copyWish').count(),0,'Redundant copy-wish action is removed');
  assert.equal(await page.locator('#messageSection .tiny').count(),0,'Redundant wish privacy disclaimer is removed');
  for(const venue of ['The Emerald Lawns','The Starlit Banquet','The Azure Poolside','The Grand Regal Mandap']) {
    assert.ok((await page.locator('#lookbookSection').innerText()).includes(venue),'Lookbook card shows confirmed venue '+venue);
  }

  await page.goto('http://127.0.0.1:4173/admin.html', { waitUntil: 'networkidle' });
  assert.match(await page.title(), /Invitation Admin/);
  await page.locator('#guestAdmin').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#dbLogin').isVisible(), true, 'Admin guest database panel is available');
  assert.equal(await page.locator('#backgroundTarget').isVisible(), true, 'Admin supports individual page backgrounds');
  assert.equal(await page.locator('#musicPreview').count(), 1, 'Admin has a music preview player');
  assert.equal(await page.locator('#previewBride').innerText(), 'Shreya Arora', 'Draft preview displays the configured bride name');
  assert.equal(await page.locator('#previewGroom').innerText(), 'Naman Dora', 'Draft preview displays the configured groom name');
  assert.equal(await page.locator('#field-weddingStartDateTime').inputValue(), '2026-12-14T16:00:00+05:30', 'Countdown target is editable in the admin');

  // Exercise the configured database success path against a local mock of the Supabase REST/Auth API.
  const baseConfig=JSON.parse(fs.readFileSync('site-content.json','utf8'));
  const mockConfig={...baseConfig,supabaseUrl:'http://127.0.0.1:4173/mock-supabase',supabaseAnonKey:'mock-publishable-key'};
  const dbPosts=[];
  const dbPage=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  dbPage.on('pageerror',error=>errors.push('mock-db page: '+error.message));
  await dbPage.route('**/site-content.json*',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(mockConfig)}));
  await dbPage.route('http://127.0.0.1:4173/mock-supabase/**',async route=>{
    const request=route.request(),url=new URL(request.url());
    if(url.pathname.endsWith('/auth/v1/token')){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({access_token:'mock-admin-jwt',token_type:'bearer',expires_in:3600,user:{id:'mock-admin-user',email:'admin@example.test'}})});
      return;
    }
    if(url.pathname.endsWith('/rest/v1/wedding_rsvps')&&request.method()==='POST'){
      dbPosts.push({table:'wedding_rsvps',body:request.postDataJSON()});
      await route.fulfill({status:201,body:''});return;
    }
    if(url.pathname.endsWith('/rest/v1/wedding_notes')&&request.method()==='POST'){
      dbPosts.push({table:'wedding_notes',body:request.postDataJSON()});
      await route.fulfill({status:201,body:''});return;
    }
    if(url.pathname.endsWith('/rest/v1/wedding_rsvps')&&request.method()==='GET'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{id:'mock-rsvp',created_at:'2026-10-14T07:00:00Z',full_name:'Sample Guest',email:'guest@example.test',phone:'',attendance:'yes',guest_count:2,message:null}])});return;
    }
    if(url.pathname.endsWith('/rest/v1/wedding_notes')&&request.method()==='GET'){
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{id:'mock-note',created_at:'2026-10-14T07:01:00Z',sender_name:'Auntie',message:'Wishing you both a beautiful life!',approved:false}])});return;
    }
    if(request.method()==='PATCH'||request.method()==='OPTIONS'){await route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*'}});return;}
    await route.fulfill({status:200,contentType:'application/json',body:'[]'});
  });

  await dbPage.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await dbPage.evaluate(()=>window.inviteConfigPromise);
  await dbPage.locator('#openSeal').click();
  await dbPage.locator('#familyContinue').click();
  await dbPage.locator('#countdownContinue').click();
  await dbPage.locator('#pullScroll').click();
  await dbPage.locator('a[href="#rsvpSection"]').first().click();
  await dbPage.locator('#rsvpForm input[name="name"]').fill('Database Test Guest');
  await dbPage.locator('#rsvpForm select[name="attendance"]').selectOption('yes');
  await dbPage.locator('#rsvpForm select[name="guests"]').selectOption('3');
  await dbPage.locator('#rsvpForm button[type="submit"]').click();
  await dbPage.waitForFunction(()=>/RSVP has been received/.test(document.querySelector('#rsvpStatus')?.innerText||''));
  await dbPage.locator('#messageSection').waitFor({state:'visible'});
  await dbPage.locator('#wishName').fill('Database Test Guest');
  await dbPage.locator('#wish').fill('A test blessing for your new journey.');
  await dbPage.locator('#submitWish').click();
  await dbPage.waitForFunction(()=>/wish has been received/.test(document.querySelector('#toast')?.innerText||''));
  assert.equal(dbPosts.length,2,'Both RSVP and guest wish were posted to database endpoints');
  assert.equal(dbPosts[0].body.full_name,'Database Test Guest');
  assert.equal(dbPosts[0].body.guest_count,3);
  assert.equal(dbPosts[1].body.sender_name,'Database Test Guest');

  await dbPage.goto('http://127.0.0.1:4173/admin.html',{waitUntil:'networkidle'});
  await dbPage.locator('#dbEmail').fill('admin@example.test');
  await dbPage.locator('#dbPassword').fill('mock-password');
  await dbPage.locator('#dbLogin').click();
  await dbPage.waitForFunction(()=>/Private guest submissions loaded/.test(document.querySelector('#dbStatus')?.innerText||''));
  assert.match(await dbPage.locator('#rsvpRecords').innerText(),/Sample Guest/,'Admin can view RSVP submissions');
  assert.match(await dbPage.locator('#noteRecords').innerText(),/Wishing you both a beautiful life/,'Admin can view guest wishes');
  assert.equal(await dbPage.locator('#rsvpCount').innerText(),'RSVP responses: 1','Admin counts stored RSVP records');
  assert.equal(await dbPage.locator('#acceptCount').innerText(),'Accepting: 1','Admin separates accepting parties');
  assert.equal(await dbPage.locator('#declineCount').innerText(),'Declined: 0','Admin counts declined parties');
  assert.equal(await dbPage.locator('#maybeCount').innerText(),'Maybe: 0','Admin counts tentative parties');
  assert.equal(await dbPage.locator('#attendeeCount').innerText(),'Expected guests: 2','Admin sums party sizes for accepted RSVPs');
  const [csvDownload]=await Promise.all([dbPage.waitForEvent('download'),dbPage.locator('#dbExportRsvps').click()]);
  assert.equal(csvDownload.suggestedFilename(),'shreya-naman-rsvps.csv','Admin can export RSVP CSV');

  assert.deepEqual(errors, [], 'No uncaught JavaScript page errors'); 
  console.log('PASS: mobile/tablet/laptop layouts, scroll open-close-reopen, audio controls, WhatsApp share, venue/PDF, RSVP/wish fallback and success paths, mock admin login, guest dashboard and CSV export.');
  console.log('Scroll metrics:', JSON.stringify(scrollMetrics));
} finally {
  await browser.close();
}
