import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const root=process.cwd();
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'enhancements.js'),'utf8');
const css=fs.readFileSync(path.join(root,'premium.css'),'utf8');
const config=JSON.parse(fs.readFileSync(path.join(root,'site-content.json'),'utf8'));
const sql=fs.readFileSync(path.join(root,'supabase/schema.sql'),'utf8');
const admin=fs.readFileSync(path.join(root,'admin.html'),'utf8');

assert.match(html,/property=["']og:title["']/i,'Open Graph title exists');
assert.match(html,/property=["']og:image["']/i,'Open Graph image exists');
assert.match(html,/id=["']shareInvite["']/i,'WhatsApp share action exists');
assert.match(html,/id=["']copyInviteLink["']/i,'Copy-link action exists');
assert.match(html,/id=["']venueDirections["']/i,'Venue directions exist');
assert.doesNotMatch(html,/id=["'](?:toggleLookbookPreview|lookbookPdfPreview|lookbookPdfFrame)["']/i,'PDF is not embedded in the page');
const wardrobe=html.split('id="lookbookSection"')[1].split('</section>')[0];
assert.match(wardrobe,/href="lookbook-naman-shreya\.pdf"[^>]*target="_blank"/i,'Wardrobe provides a view link to the detailed PDF');
assert.match(wardrobe,/href="lookbook-naman-shreya\.pdf"[^>]*download=/i,'Wardrobe provides a PDF download link');
assert.match(wardrobe,/id="openRsvpForm" href="#rsvpSection"/,'Wardrobe has a clear RSVP form button');
assert.match(wardrobe,/id="openWishForm" href="#messageSection"/,'Wardrobe has a clear wishes form button');
assert.match(css,/response-actions \.response-primary/,'RSVP action is visually emphasized');
assert.doesNotMatch(wardrobe,/data-calendar-event|Add to calendar/i,'Wardrobe section has no calendar controls');
assert.doesNotMatch(wardrobe,/The Emerald Lawns|The Starlit Banquet|The Azure Poolside|The Grand Regal Mandap/i,'Venue labels remain in the wedding scroll, not the wardrobe section');
assert.equal((html.match(/class="pill event-calendar" data-calendar-event=/g)||[]).length,4,'Calendar actions exist only on the four wedding-scroll event cards');
assert.match(html,/id=["']addAllCalendar["']/i,'Guests can add all events to Apple/Google-compatible calendar');
assert.match(html,/text\/calendar/,'All-events calendar download uses iCalendar format');
for(const venue of ['The Emerald Lawns','The Starlit Banquet','The Azure Poolside','The Grand Regal Mandap']) assert.ok(html.includes(venue),'Official venue is shown in the wedding scroll: '+venue);
assert.doesNotMatch(html,/id=["']copyWish["']/i,'Redundant copy-wish button is removed');
assert.doesNotMatch(html,/Your wish is private to the couple|Your response is visible only in the couple/i,'Redundant privacy disclaimers are removed');
assert.match(html,/id=["']musicBtn["']/i,'Visible play/mute control exists');
assert.match(html,/startMusic\(/,'Music control handler exists');
assert.match(html,/scroll-paper\.open/,'Scroll open state exists');
assert.doesNotMatch(html,/max-height\s*:\s*1200px/i,'Old fixed scroll cap is absent');
assert.match(html,/premium\.css/,'Premium stylesheet is linked');
assert.match(html,/id=["']wishName["']/i,'Wish sender name field exists');
assert.match(html,/id=["']submitWish["']/i,'Guest wish submission button exists');
assert.match(html,/id=["']shareInvite["']/i,'WhatsApp share button exists');
assert.match(js,/id='rsvpSection'/,'RSVP section is present');
assert.match(js,/id="rsvpForm"/,'RSVP form is present');
assert.match(js,/💌 Send RSVP</,'RSVP button uses a concise label');
assert.doesNotMatch(js,/Your response is visible only in the couple/i,'RSVP privacy disclaimer removed');
assert.match(js,/wedding_rsvps/,'RSVP is wired to Supabase table');
assert.match(js,/wedding_notes/,'Wishes are wired to Supabase table');
assert.match(js,/insertPrivateRecord/,'Private database insertion helper exists');
assert.match(admin,/Guest submissions/,'Admin guest dashboard exists');
assert.match(admin,/draft-preview/,'Admin includes a draft preview before publishing');
assert.match(admin,/backgroundTarget/,'Admin can upload per-page backgrounds');
assert.match(admin,/musicPreview/,'Admin can preview an audio file before publishing');
assert.match(admin,/weddingStartDateTime/,'Admin can adjust the countdown target');
assert.ok(admin.includes('Download guest list Excel (.xlsx)'),'Admin can export guest RSVPs to Excel');
assert.ok(admin.includes('Download wishes Excel (.xlsx)'),'Admin can export guest wishes to Excel');
assert.match(admin,/function exportExcel/,'Admin creates real Excel workbooks when the workbook library is available');
for(const id of ['acceptCount','declineCount','maybeCount','attendeeCount','submissionDisplayNote']) assert.ok(admin.includes('id="'+id+'"')||admin.includes("id='"+id+"'"),'Admin shows RSVP summary '+id);
assert.match(js,/<option value="20">20<\/option>/,'RSVP can record exact counts up to the database limit');
assert.match(admin,/fetchAllRows/,'Admin computes totals across all database pages');
assert.match(admin,/supabaseAnonKey/,'Admin can configure Supabase');
assert.match(admin,/dbLogin/,'Admin can authenticate to the database');
assert.match(sql,/enable row level security/i,'RLS is enabled');
assert.match(sql,/is_invitation_admin/i,'Admin allow-list policy exists');
assert.match(sql,/for insert to anon, authenticated/i,'Guests can submit');
assert.match(sql,/for select to authenticated/i,'Private admin reads are policy gated');
assert.ok(config.venueMapsUrl,'Venue map URL exists');
assert.ok(config.weddingStartDateTime,'Countdown target is configured');
for(const key of ['coverBackground','scrollBackground','photoBackground','lookbookBackground','familyBackground','countdownBackground','rsvpBackground','wishesBackground']) assert.ok(key in config,'Per-page background setting exists: '+key);
assert.ok(config.rsvpWhatsappNumber!==undefined,'WhatsApp fallback configuration exists');
assert.ok(config.supabaseUrl!==undefined&&config.supabaseAnonKey!==undefined,'Supabase keys exist');
assert.equal(config.musicPath,'assets/wedding-music-1791958796894.mp3','Keep the currently selected user-uploaded track');
for(const asset of [config.photoPath,config.lookbookPath,config.musicPath,'floral-frame.svg','invitation-board.jpg']){
  assert.ok(fs.existsSync(path.join(root,asset)), 'Configured asset exists: '+asset);
}
assert.match(css,/prefers-reduced-motion/,'Reduced-motion preference is supported');
assert.match(css,/@media\(max-width:760px\)/,'Mobile layout rules exist');
assert.match(css,/event-engagement/,'Distinct ceremony palettes exist');
assert.match(sql,/approved = false/,'Guest wishes require moderation before approval');

function checkInlineScripts(fileName,source){
 const scripts=[...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([,attrs,body])=>!/\bsrc\s*=/.test(attrs)&&body.trim());
 scripts.forEach(([,attrs,body],i)=>{
  const file=path.join(os.tmpdir(),fileName+'-inline-'+i+'.js');
  fs.writeFileSync(file,body);
  execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
 });
}
checkInlineScripts('invite',html);
checkInlineScripts('admin',admin);
execFileSync(process.execPath,['--check',path.join(root,'enhancements.js')],{stdio:'pipe'});
console.log('PASS: code syntax, assets, social sharing, maps, responsive styling, music, RSVP, wishes, admin and Supabase RLS checks.');
