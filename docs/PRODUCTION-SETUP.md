# Shreya & Naman invitation — production setup and verification

## Backup and release strategy

The pre-upgrade site is preserved on branch `backup/pre-upgrade-2026-10-14`. The polished version is being prepared on `upgrade/best-in-class-invite`; merge that branch only after the quality workflow passes.

## One-time setup for RSVP and private guest wishes

GitHub Pages serves static files and cannot run a private database itself. This project integrates with Supabase Postgres using Row Level Security (RLS). Until the project URL and publishable/anon key are entered, the site deliberately shows a setup message rather than pretending that a response was saved.

1. Create a project at https://supabase.com/dashboard (a free project is enough for a small invitation).
2. In the project's SQL Editor, run every statement in `supabase/schema.sql`.
3. In Supabase Authentication settings, turn off public sign-ups. Create one admin user under Authentication -> Users with an email and password you control.
4. Copy that user's UUID and run this query in SQL Editor (replace the UUID):
   `insert into public.invitation_admins (user_id) values ('YOUR_AUTH_USER_UUID');`
5. In Project Settings -> API, copy the **Project URL** and **publishable/anon key**. Never use or paste the `service_role` key into the website.
6. Open `admin.html`, enter the GitHub fine-grained token (Contents: Read and write), load the settings, paste the Supabase Project URL and publishable/anon key into Backend setup, and save.
7. Wait for GitHub Pages to deploy. Submit a test RSVP and a test wish using a private browser tab. In Admin -> Guest submissions, sign in with the Supabase admin email/password and confirm both entries appear.
8. Delete the test entries from the admin dashboard after verification if desired.

The browser-visible Supabase publishable/anon key is designed for public clients. Access control is enforced by SQL policies: guests may submit, but only a UUID listed in `invitation_admins` can read/manage the responses. Do not add secrets such as service_role keys to `site-content.json`.

## Lookbook review and display

The supplied six-page PDF is not embedded because its mobile inline preview was cropped. The invitation now offers only “View lookbook PDF” (opens the original in a separate tab) and “Download PDF”. Each of the four event cards and four wardrobe-colour cards also displays its confirmed official venue and an “Add to calendar” link. The PDF was inspected page by page:
- Page 1: cover and resort illustration.
- Page 2: Mehendi, Sunday 13 December 2026.
- Page 3: Engagement & Cocktail, Sunday 13 December 2026.
- Page 4: Haldi, Monday 14 December 2026.
- Page 5: Wedding, Monday 14 December 2026.
- Page 6: after-party guidance.

The invitation and wardrobe-colour cards now use the confirmed official venue labels: “The Emerald Lawns”, “The Starlit Banquet”, “The Azure Poolside”, and “The Grand Regal Mandap”. The original supplied PDF remains unchanged; its artwork still contains earlier venue wording, so use the webpage's venue cards as the authoritative labels. Temperatures printed in the PDF are estimates, not live forecasts.

Calendar links open a prefilled Google Calendar event using the listed start time and a two-hour placeholder duration because exact end times were not supplied. Guests can adjust the end time in Google Calendar before saving.

## WhatsApp preview and sharing

The HTML contains Open Graph metadata and uses the existing `invitation-board.jpg` as the preview image. Sharing services cache previews; after publishing, paste the URL into a fresh WhatsApp chat to check it. If the old preview remains, wait for cache refresh; use a separate preview/debug tool where supported.

## Sound

The current audio asset is `assets/wedding-music-1791958796894.mp3`, selected through the admin interface. Browser autoplay may be blocked; the invitation includes a visible play/mute control. Always test sound on a phone, at a moderate device volume, before sending to guests.

## Final launch checklist

- Confirm each event's venue, date and time with the families.
- Ensure the music file is licensed or you own the rights to publish it.
- Test iPhone Safari, Android Chrome, laptop and tablet.
- Test scroll open/close, photo scratch reveal, maps, lookbook, RSVP submission, wish submission, admin sign-in and CSV export.
- Verify WhatsApp preview image/title/description after the final deployment.
