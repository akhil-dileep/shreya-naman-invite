import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'enhancements.js'), 'utf8');
const config = JSON.parse(fs.readFileSync(path.join(root, 'site-content.json'), 'utf8'));
const sql = fs.readFileSync(path.join(root, 'supabase/schema.sql'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'admin.html'), 'utf8');

assert.match(html, /property=["']og:title["']/i, 'Open Graph title is present');
assert.match(html, /property=["']og:image["']/i, 'Open Graph image is present');
assert.match(html, /id=["']shareInvite["']/i, 'WhatsApp share action exists');
assert.match(html, /id=["']venueDirections["']/i, 'Venue directions are available');
assert.match(html, /id=["']musicBtn["']/i, 'Visible play/mute control exists');
assert.match(html, /startMusic\(/, 'Music control handler exists');
assert.match(html, /scroll-paper\.open/, 'Scroll open state exists');
assert.doesNotMatch(html, /max-height\s*:\s*1200px/i, 'No old fixed scroll cap remains');
assert.match(js, /id='rsvpSection'/, 'RSVP section exists');
assert.match(js, /id="submitWish"/, 'Database-backed wish button exists');
assert.match(js, /wedding_rsvps/, 'RSVP is wired to database table');
assert.match(js, /wedding_notes/, 'Wishes are wired to database table');
assert.match(admin, /Guest submissions/, 'Admin dashboard for guest submissions exists');
assert.match(admin, /CSV/, 'Admin supports CSV export');
assert.match(admin, /supabaseUrl/, 'Admin exposes public Supabase configuration');
assert.match(sql, /enable row level security/i, 'RLS is enabled');
assert.match(sql, /is_invitation_admin/i, 'Admin allow-list guard exists');
assert.match(sql, /for insert to anon, authenticated/i, 'Guest submission is allowed');
assert.match(sql, /for select to authenticated/i, 'Private admin read policy exists');
assert.ok(config.venueMapsUrl, 'Venue map URL is configured');
assert.ok(config.rsvpWhatsappNumber !== undefined, 'WhatsApp host-number field exists');
assert.ok(config.supabaseUrl !== undefined && config.supabaseAnonKey !== undefined, 'Supabase configuration keys exist');
assert.equal(config.musicPath, 'assets/wedding-music-1791958796894.mp3', 'Keep the selected user-uploaded music');
assert.ok(fs.existsSync(path.join(root, config.photoPath)), 'Configured couple photo asset exists');
assert.ok(fs.existsSync(path.join(root, config.lookbookPath)), 'Configured lookbook asset exists');
assert.ok(fs.existsSync(path.join(root, 'floral-frame.svg')), 'Floral frame asset exists');

const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attrs, body]) => !/\bsrc\s*=/.test(attrs) && body.trim());
for (const [index, [, , body]] of scripts.entries()) {
  const file = path.join(os.tmpdir(), 'invite-inline-' + index + '.js');
  fs.writeFileSync(file, body);
  execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
}
execFileSync(process.execPath, ['--check', path.join(root, 'enhancements.js')], { stdio: 'pipe' });
console.log('Invitation smoke checks passed: HTML metadata, JavaScript syntax, assets, music, RLS schema, RSVP, notes, admin and map.');
