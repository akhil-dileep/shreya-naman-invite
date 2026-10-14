# Shreya & Naman — Interactive Wedding Invitation

A mobile-first, multi-section wedding invitation for 13–14 December 2026. Hosted as a static GitHub Pages site.

## Guest experience

- Wax-seal opening and wedding scroll with ceremony details
- Individual ivory/floral and emerald/gold visual treatments
- Live countdown and scratch-to-reveal couple photo
- Wardrobe lookbook PDF and Google Maps venue directions
- User-selected MP3 with visible play/mute control and autoplay fallback
- WhatsApp sharing and Open Graph link preview metadata
- RSVP and private wishes submission UI

## Admin

Open `admin.html` on the published website. Use a fine-grained GitHub token scoped to this repository with Contents: Read and write to change invitation copy and upload the photo, SVG frame, lookbook or licensed audio. The token stays in page memory; clear it before leaving. Uploaded assets are public.

The admin page also includes a private guest dashboard backed by Supabase Auth and Postgres RLS. **The database does not become active until the one-time setup in `docs/PRODUCTION-SETUP.md` is completed.** Never put a Supabase `service_role` key in this public repository. The publishable/anon key is safe to expose only when RLS is correctly configured.

## Local checks

The `Invitation quality checks` GitHub Actions workflow runs `tests/smoke.test.mjs`, which validates inline JavaScript syntax, assets, sharing metadata, responsive styles, and the backend contract.

## Backup / release

The pre-change snapshot is preserved on branch `backup/pre-upgrade-2026-10-14`. The proposed release is on `upgrade/best-in-class-invite`; merge to `main` only after the quality workflow passes and the Supabase project has been configured and tested.
