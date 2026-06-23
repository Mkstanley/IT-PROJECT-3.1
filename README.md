# KejaHunt 🏠

**Verified rentals for urban Kenya.** Real prices, real locations, real landlords — no brokers, no fake photos, no ghost homes.

A Strathmore University BBIT 2026 project. KejaHunt tackles the information asymmetry, listing fraud, and poor communication that make house-hunting in Nairobi painful: every listing is ownership-checked by an admin before it goes live, renters search and compare on a map, and tenants and landlords message safely in-app.

> **Status:** fully working prototype. 9 pages, a complete localStorage-backed mock backend, and a green test suite (9 page-boot smoke tests + 25 behavioral flow tests).

---

## Quickstart

No build step, no server, no dependencies to run it — it's a static site.

```bash
# Option A — just open it
open index.html            # macOS  (or double-click the file)

# Option B — serve it (nicer URLs, recommended)
npm run serve              # → http://localhost:8000
# or: python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### Running the tests

The tests use [jsdom](https://github.com/jsdom/jsdom) to boot every page in a headless DOM and exercise the data layer. Install once, then run:

```bash
npm install          # pulls jsdom (dev dependency only)
npm test             # smoke (page boots) + flows (behavior) — 9 + 25 checks
npm run test:smoke   # just the page-boot checks
npm run test:flows   # just the behavioral flows
```

---

## Demo logins

Data is seeded automatically on first load. Use the **Quick demo login** buttons on the login page, or sign in with these seeded emails (any password works in the demo):

| Role     | Email                | What you'll see                                   |
|----------|----------------------|---------------------------------------------------|
| Tenant   | `aisha@example.com`  | Saved homes, viewings, messages, profile          |
| Landlord | `grace@example.com`  | Dashboard, post/edit/delete listings, enquiries   |
| Admin    | *(use Admin button)* | Verification queue, approve/reject, audit log      |

To wipe everything back to the seed state: **Account → Data & privacy → Reset demo data** (or run `KH.reset()` in the console).

---

## What's built

**Renter side**
- Landing page with hero search, live stats marquee, featured listings, neighborhood explorer
- Browse page: filter by neighborhood, type, budget, bedrooms, amenities; sort; mock map with price pins; active-filter chips; all driven from the URL so searches are shareable
- Property detail: gallery, amenities, location map, reviews, move-in cost breakdown, save-to-favorites, message landlord
- Account: saved homes, viewings, message previews, profile & settings, DPA data controls

**Landlord / agent side**
- Dashboard with stats (total / live / awaiting review / average rent)
- Post a listing (full form: basics, pricing, description, amenities, photo + ownership-proof upload zones)
- Edit and delete listings; rejected listings show the admin's reason and re-enter review on resubmit

**Admin side**
- Verification queue: approve / reject pending listings with a reason
- Platform stats and an audit log of every moderation action

**Cross-cutting**
- Role-aware navigation, in-app messaging with threads, favorites, reviews, toasts, modals
- Verification badges throughout; "no broker fees" messaging; Kenya Data Protection Act (2019) touchpoints

See [`PLAN.md`](PLAN.md) for the full feature roadmap and what's intentionally left as future work.

---

## How it fits together

Three shared files power all 9 pages, loaded in order on every page:

1. **`css/styles.css`** — the entire design system (color/space/radius tokens + every shared component). Forest-green-on-warm-paper "trust" brand, Plus Jakarta Sans + Space Mono.
2. **`js/data.js`** → `window.KH` — the mock "backend": seed data, `localStorage` persistence, auth/session, listings CRUD, moderation, favorites, threads, reviews, stats, audit log.
3. **`js/app.js`** → `window.ICN` (inline SVG icons) + `window.KejaUI` (view helpers like `listingCard`, `mountNav`, `statusBadge`, `toast`, `modal`).

The HTML pages are thin views — they call into `KH` / `KejaUI` / `ICN` and add only page-specific layout. Because there's no backend, the whole thing runs from the filesystem.

For architecture details, the data model, and conventions when extending the project, read [`CLAUDE.md`](CLAUDE.md).

---

## Project layout

```
kejahunt/
├── index.html         listings.html      property.html
├── account.html       landlord.html      admin.html
├── login.html         register.html      messages.html
├── css/styles.css     design system (tokens + components)
├── js/data.js         window.KH — mock backend
├── js/app.js          window.KejaUI + window.ICN — view layer
├── assets/            thumbnail
├── run-smoke.js       boots all 9 pages in jsdom
├── flows.test.js      25 behavioral checks against KH
├── README.md          you are here
├── PLAN.md            build plan + roadmap
└── CLAUDE.md          architecture & contributor guide
```

## Tech & scope

Vanilla HTML/CSS/JS — no framework, no bundler, no server. State lives in the browser via `localStorage`. This keeps the prototype easy to run and demo; the data layer in `js/data.js` is deliberately shaped like a REST API so it can later be swapped for a real backend without touching the pages. See `PLAN.md` for that path.

*Built for educational purposes. Listings, users, and reviews are fictional seed data.*
