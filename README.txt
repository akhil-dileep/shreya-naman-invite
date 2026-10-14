SHREYA & NAMAN — INTERACTIVE WEDDING INVITATION
Website: https://akhil-dileep.github.io/shreya-naman-invite/
Admin: https://akhil-dileep.github.io/shreya-naman-invite/admin.html

Guest features: wax seal, wedding scroll, event details, countdown, scratch-to-reveal photo, wardrobe lookbook, Google Maps directions, music play/mute, WhatsApp sharing, RSVP and private wishes.

Admin: Use a GitHub fine-grained token limited to this repository with Contents: Read and write. Uploaded photos, music, SVG and PDF are public in the repository; upload only assets you have permission to publish. Clear the token from the browser page when done.

Database: RSVP and wishes require one-time Supabase setup. Run supabase/schema.sql in the Supabase SQL Editor, create an admin Auth user, add that user's UUID to public.invitation_admins, disable public signups, then save the Supabase project URL and publishable/anon key in Admin -> Backend and sharing settings. See docs/PRODUCTION-SETUP.md. Never expose a service_role key.

Backup: backup/pre-upgrade-2026-10-14
Upgrade branch: upgrade/best-in-class-invite
