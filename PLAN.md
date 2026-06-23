# KejaHunt — Build Plan & Roadmap

This is the plan that drove the build, plus the forward roadmap. It records *what was
delivered*, *how it was approached*, and *what is deliberately left for later* so anyone
picking up the project knows where the edges are.

---

## The starting point

The project arrived as **9 finished HTML pages and nothing else**. Every page linked to
three files that did not exist:

- `css/styles.css`
- `js/data.js` (expecting a global `KH` object)
- `js/app.js` (expecting globals `KejaUI` and `ICN`)

Without those three files the pages rendered blank. So the pages themselves were the
*specification*: the build had to reverse-engineer the exact API the markup already
calls, then implement it — without modifying the 9 HTML files.

## Approach

1. **Extract the contract.** Read all 9 pages and catalog every symbol they reference:
   `KH.*` (data/backend), `KejaUI.*` (view helpers), `ICN.*` (icons), plus every CSS
   class. This defined the surface area to build.
2. **Build the data layer (`js/data.js`).** A `localStorage`-backed mock database with a
   REST-shaped API, seeded with realistic Nairobi data.
3. **Build the view layer (`js/app.js`).** The icon set and the DOM helpers the pages
   compose with.
4. **Build the design system (`css/styles.css`).** All shared tokens and components.
5. **Test continuously.** A jsdom smoke harness (do all 9 pages boot without error?) and
   a behavioral suite (do the core user journeys actually work?).
6. **Document** for handoff (`README.md`, `CLAUDE.md`, this file).

## Guardrails honored

- **The 9 HTML pages were never edited.** They remain the source of truth for the API.
- **No frameworks, no bundler.** Vanilla ES, runnable straight from the filesystem.
- **Format contracts preserved** — e.g. message timestamps stay `"YYYY-MM-DD HH:MM"`
  because pages slice that string for date/time.

---

## What was delivered ✅

### Data layer — `window.KH`
Seeded with 6 users, 15 listings (12 verified / 2 pending / 1 rejected), 2 message
threads, 5 reviews, favorites, and an audit log.

- **Constants:** `NEIGHBORHOODS` (14, each with map coordinates + cost tier), `TYPES`, `ALL_AMENITIES`
- **Auth/session:** `currentUser`, `loginAs`, `login`, `logout`, `register`
- **Listings:** `listings(filter)`, `listing(id)`, `verifiedListings`, `addListing`, `updateListing`, `deleteListing`
- **Moderation:** `setStatus(id, status, reason)` — writes to the audit log
- **Favorites:** `favorites`, `isFav`, `toggleFav` (per-user)
- **Messaging:** `threads`, `thread`, `findOrCreateThread` (idempotent), `sendMessage`
- **Reviews / stats / audit:** `reviews`, `stats`, `auditLog`, `logAudit`
- **Persistence:** everything reads/writes `localStorage` (`kejahunt_v1`); `reset()` restores seed

### View layer — `window.KejaUI` + `window.ICN`
- `ICN`: ~30 inline SVG icons (Lucide-style, `currentColor`)
- Helpers: `mountNav` (role-aware + mobile drawer), `mountFooter`, `listingCard`,
  `statusBadge`, `amenityIcon`, `initials`, `fmtKES`, `qs`, `el`, `toast`, `modal`, `closeModal`

### Design system — `css/styles.css`
Full token set (color, radius, shadow, spacing) and every shared component: buttons,
badges, forms, cards, listing cards, stars, empty states, nav, footer, modal, toast, the
dashboard shell, stat grids, and tables. Responsive at 980 / 760 / 560px; honors
`prefers-reduced-motion`. Brand: forest-green on warm paper, Plus Jakarta Sans + Space Mono.

### Tests
- **`run-smoke.js`** — boots all 9 pages in jsdom with realistic URLs (`?id=`, `?t=`),
  asserts error-free render and expected content. **9/9 pass.**
- **`flows.test.js`** — drives `KH` directly through seed integrity, the
  post→pending→approve/reject moderation loop (with audit assertions), per-user favorites
  persistence, idempotent threads + messaging visible to both parties, registration +
  session, delete, and reset. **25/25 pass.**

---

## Roadmap — future work 🔭

Deliberately out of scope for the prototype, roughly in priority order. None of these are
required for the current demo to be complete; they're the natural next steps.

### Near-term (still front-end only)
1. **Tenant-submitted reviews** with automatic rating recompute on the listing.
2. **Real photo uploads** — replace the labelled `.ph` placeholders with stored images
   (data URLs in localStorage for the demo).
3. **"Request a viewing" as a real scheduled event** rather than reusing the message flow,
   with a date/time picker and a viewings list that reflects status.
4. **Listings pagination / lazy loading** for when the catalog outgrows one screen.
5. **Wire the DPA "export my data" / "delete my data" buttons** to actually serialize or
   clear the user's localStorage records.

### Medium-term
6. **Saved searches + notifications** — alert a renter when a new listing matches their
   filters, and on **price changes** to a saved home (the UI already promises this).
7. **Real map** — swap the mock map for Leaflet + OpenStreetMap using the lat/long-style
   coordinates already on each `NEIGHBORHOOD`.

### Long-term (backend)
8. **Real REST API + database.** `js/data.js` is intentionally shaped like a REST client,
   so the pages shouldn't need to change much — replace the localStorage calls with
   `fetch`, add real auth, server-side verification workflow, and image storage.

---

## How to extend safely

1. Read `CLAUDE.md` first — it documents the contract and the data model.
2. If you change a `KH` / `KejaUI` / `ICN` signature, update **every** calling page.
3. Run `npm test` after any change. Green = the contract still holds across all 9 pages.
