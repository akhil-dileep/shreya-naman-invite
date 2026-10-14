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
assert.match(html,/id=["']toggleLookbookPreview["']/i,'In-page PDF preview toggle exists');
assert.match(html,/id=["']lookbookPdfPreview["']/i,'Embedded lookbook preview container exists');
assert.match(html,/id=["']lookbookDownloadLink["']/i,'Download fallback remains available');
assert.match(html,/data-src="lookbook-naman-shreya\.pdf#view=FitH"/i,'Viewer points to the lookbook PDF');
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
assert.match(js,/wedding_rsvps/,'RSVP is wired to Supabase table');
assert.match(js,/wedding_notes/,'Wishes are wired to Supabase table');
assert.match(js,/insertPrivateRecord/,'Private database insertion helper exists');
assert.match(admin,/Guest submissions/,'Admin guest dashboard exists');
assert.match(admin,/draft-preview/,'Admin includes a draft preview before publishing');
assert.match(admin,/backgroundTarget/,'Admin can upload per-page backgrounds');
assert.match(admin,/musicPreview/,'Admin can preview an audio file before publishing');
assert.match(admin,/weddingStartDateTime/,'Admin can adjust the countdown target');
assert.match(admin,/Export RSVPs CSV/,'Admin can export RSVPs');
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
