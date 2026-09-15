# Zakariae's Guitar Studio

Create a portfolio website with a booking system for Zakariae AHAJI, a state-certified teacher with dual degrees in music theory (solfège) and classical guitar.

CREATIVE DIRECTION (important — not a generic template)

Overall tone: warm, crafted, unhurried — the world of a classical guitar teacher, not a rock band. I want a specific, memorable visual identity, not the default AI aesthetic (no cream+terracotta palette, no black background with a neon accent, no identical SaaS cards with the same grey shadow).

Palette:

- Warm paper background: #f2ecdf (light) / #1a130c (dark)

- Ink: #21160d (light) / #ecdfc7 (dark)

- Wood/walnut (primary accent): #8a5a34, deep walnut #432c1c

- Mustard (secondary accent): #c99a3a

- Olive (tertiary accent, used sparingly): #5b5c3f

- Rust (errors / blocked days): #a8432a

Typography: a sturdy slab-serif for headings (something like Bitter) + a warm, readable sans-serif for body text (something like Karla). No Playfair, no overly delicate display serif.

Hero's bold element: the profile photo should be framed like a classical guitar's ROSETTE — thin concentric rings around the circle, not just a simple gold border. Two-column asymmetric hero layout (text left-aligned, photo on the right), not centered.

Below the hero, once only: a decorative band representing guitar STRINGS (6 horizontal lines of increasing thickness on a dark wood background, with a few subtle vertical fret markers). Don't repeat this motif elsewhere — one strong gesture, keep the rest of the page restrained.

Dark/light toggle: styled like a guitar PICK (rounded triangle shape). Light-colored pick (cream celluloid) = light mode. Black pick = dark mode.

Avoid entirely: tracked-out uppercase eyebrow labels, "WORD — fragment" labels with an em dash, numbered markers like 01/02/03, buttons with a trailing "→" arrow, identical cards all sharing the same soft shadow.

SITE STRUCTURE

1. Navigation: text logo "Zakariae AHAJI", links to Videos / Teaching / Booking / Contact, a language switcher, the pick-shaped dark/light toggle.

2. Hero: a short kicker line ("Private classical guitar lessons"), name, title "State-certified teacher, dual-degree holder in music theory and guitar", a tagline, "Book a session" and WhatsApp buttons (official WhatsApp icon, not a generic one).

3. Video section: a gallery of 6 videos of him playing/teaching (the user will upload their own files), in a 3x2 grid, with a cover thumbnail and click-to-play.

4. Teaching section: present a method adapted to 4 profiles — Kids (musical awakening through play), Teenagers (engaging repertoire, exam prep), Adults (flexible lessons), Seniors (calm pace, no performance pressure). Use small dots styled like fret markers as visual bullets, not generic icons. Add a line: "Lessons available in: French, English, Spanish, Arabic".

5. Booking section (the core of the site):

   - Level selection: "Beginner (Solfège / Guitar)" at 350 DH/hour, or "Intermediate (Guitar)" at 350 DH/hour — the price displays and recalculates automatically

   - A real monthly calendar to choose a date (past days disabled, days marked unavailable by the admin greyed out and struck through)

   - Once a date is picked, show hourly time slots from 08:00 to 20:00 (every hour, including 13:00); the client can select MULTIPLE hours (not just one), and the total price updates accordingly (price × number of hours)

   - Full name + phone number fields

   - On confirmation: save the booking to the database AND automatically open WhatsApp with a pre-filled message summarizing the booking (name, level, date, hours, price, phone) sent to Zakariae's number

6. Footer: professional title (no city), social icons (Instagram, TikTok, YouTube), a floating WhatsApp button.

7. Admin area (hidden access, NO visible button on the public site):

   - Only reachable via a hidden route like /admin

   - Protected by real authentication (real email + password, not a password hardcoded in the code)

   - Calendar view of all bookings, with an indicator on days that have bookings

   - Selecting a day shows that day's bookings (hour(s), name, phone, level, price), with Edit and Delete buttons

   - A "+ New booking" button to manually create a booking (same multi-hour selector as the client side)

   - A "Day unavailable" button to block an entire day

   - A grid of that day's time slots, where the admin can select one or more specific hours and click "Block selected hours" to make them unavailable (distinct from blocking a whole day); show clear save confirmation after each action

MULTILINGUAL

Language switcher for French / English / Spanish / العربية. When Arabic is selected, the entire layout must switch to RTL (right-to-left), not just the text.

TECHNICAL REQUIREMENTS

- Use a real database (enable Supabase) so bookings, blocked days, and blocked hours actually persist, not just in local memory

- Admin authentication must be real (e.g. Supabase Auth), with a single admin account created for Zakariae

- Security rules: anyone can read availability and create a booking; only the logged-in admin can edit or delete a booking, or block a day/hour

- Responsive site (mobile-first — most visitors will come from their phone)

CONTENT TO KEEP AS-IS

- Pricing: 350 DH/hour for both levels (Beginner and Intermediate)

- Time slots: 08:00 to 20:00, every hour, including 13:00

- Languages spoken: French, English, Spanish, Arabic

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zakariae-guitar-booking.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/06d489ad-cb3a-4271-9d60-c02b35806d38).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
