# CLAUDE.md — KejaHunt

Guidance for working on this repo with Claude Code. Read this before editing.

## What this is
KejaHunt is a **verified rentals** web app for urban Kenya (Strathmore BBIT project).
It is a **static, front-end-only** site: 9 HTML pages + 3 shared assets, no build step,
no server. All data lives in the browser via `localStorage` (key `kejahunt_v1`), seeded
from `js/data.js`. Open any `.html` file in a browser and it runs.

## Architecture (the contract)
Every page is a thin view that boots from three globals loaded in this order:

1. `css/styles.css` — the entire design system (tokens + components). Pages add only
   page-specific layout in an inline `<style>`; all shared classes live here.
2. `js/data.js` → `window.KH` — the "database" + data API. Seed data, localStorage
   persistence, auth/session, listings CRUD, moderation, favorites, threads, reviews,
   stats, audit log.
3. `js/app.js` → `window.ICN` (SVG icon set) and `window.KejaUI` (view helpers:
   `mountNav`, `mountFooter`, `listingCard`, `statusBadge`, `amenityIcon`, `initials`,
   `fmtKES`, `qs`, `el`, `toast`, `modal`, `closeModal`).

**Rule:** the HTML pages are the source of truth for the API shape. If you change a
`KH`/`KejaUI`/`ICN` signature, update every caller, or you will silently break a page.
Run the tests (below) after any change.

## Data model
- **user**: `{ id, role: tenant|landlord|agent|admin, name, email, phone, verified, joined }`
- **listing**: `{ id, title, type, hood, bedrooms, bathrooms, available, rent, deposit,
  desc, amenities[], landlordId, status: verified|pending|rejected, rejectReason?,
  rating, furnished, createdAt }`
- **thread**: `{ id, listingId, tenantId, landlordId, messages: [{from, text, at}] }`
  (`at` is `"YYYY-MM-DD HH:MM"` — pages slice it for date/time, do not change the format)
- **review**: `{ listingId, by, date, rating, text }`
- **audit**: `{ at, who, action, target }`

Constants on `KH`: `NEIGHBORHOODS` (`{name,x,y,tier}`, x/y are map %), `TYPES`, `ALL_AMENITIES`.

## Conventions
- No frameworks, no bundler. Vanilla ES. Keep it that way unless asked.
- Money: always render with `KejaUI.fmtKES(n)`.
- Icons: reference `ICN.<name>` (string of inline SVG, sized via CSS `em`/explicit width).
- Mutations to `KH` data must call the internal `save()` (already wired) so they persist.
- Colors/spacing: use the CSS custom properties in `:root`. Don't hard-code hex.
- Copy style: sentence case, plain verbs, action labels match their result toast.

## Run & verify
No install needed to use the site — just open `index.html`.
For the test harness (jsdom):
```
npm install            # installs jsdom (dev only)
npm run test:smoke     # boots all 9 pages headless, asserts they render error-free
npm run test:flows     # exercises KH: moderation+audit, favorites, messaging, auth
npm test               # both
```
Tests are the safety net for the page↔API contract. Keep them green.

## Demo logins (see login.html)
Tenant `aisha@example.com` · Landlord `grace@example.com` · Admin via the Admin quick button.
Any page that needs a session auto-logs-in a demo user if none is set.

## Backlog (“yet to be done”, good next tickets)
- Tenant-submitted reviews (currently seed-only) + recompute listing `rating`.
- Real photo uploads (replace the intentional `.ph` placeholder system).
- "Request a viewing" as a scheduled event distinct from messaging.
- Price-change alerts for saved homes (account page promises this).
- Saved-search + email-style notifications.
- Map: swap the mock SVG map for Leaflet/OSM using `NEIGHBORHOODS` coords.
- Pagination/infinite scroll on `listings.html` for large datasets.
- Export/delete personal data actions (account page, DPA 2019) — wire to real handlers.
- Move `KH` behind a tiny REST API + DB when leaving the prototype stage.
