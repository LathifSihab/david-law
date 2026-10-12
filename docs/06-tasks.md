# 06 — Build tasks

Run these **in order**, one per Claude Code turn. Each task has a prompt you can paste, the work involved, and acceptance criteria. After each task, Claude Code must run `npm run check` and `npm run build` and report the results.

---

## Task 1 — Project setup

**Prompt:**
> Do Task 1 from docs/06-tasks.md.

**Work**
1. Scaffold the project in the current folder: `npx sv create . --template minimal --types ts`, adding `tailwindcss`, `prettier` and `eslint` through the `sv` add-ons. Keep the existing `CLAUDE.md`, `docs/` and `assets/` intact.
2. Install `@sveltejs/adapter-static`, configure it in `svelte.config.js` (fallback: none, every route prerendered), and add `export const prerender = true;` and `export const trailingSlash = 'never';` to `src/routes/+layout.ts`.
3. Install the fonts: `@fontsource-variable/bodoni-moda` (include the italic) and `@fontsource-variable/schibsted-grotesk`. Import them in `+layout.svelte`.
4. Copy `assets/artworks/*` to `static/artworks/`.
5. Create the folder structure from `CLAUDE.md` with empty or stub files.
6. Create `src/lib/config.ts` with `brandName`, `isDemo: true`, `contactEmail: 'info@example.com'` (placeholder) and `locale: 'nl-BE'`.
7. Set `<html lang="nl">` in `src/app.html` and add `<meta name="robots" content="noindex">`.
8. Initialise git and make the first commit.

**Done when**
- [ ] `npm run dev` shows a blank page with no errors
- [ ] `npm run build` produces `build/` with `index.html`
- [ ] `static/artworks/david-law-crypto-nick-cave-vi/` contains 10 .webp files

---

## Task 2 — Design tokens and base components

**Prompt:**
> Do Task 2 from docs/06-tasks.md. Follow docs/02-design-system.md exactly.

**Work**
1. In `src/app.css`, define all colour tokens, the font families, the type scale (as utility classes or `@theme` font-size tokens), the focus ring, base body styles (`wall` background, `paper` text) and the `prefers-reduced-motion` reset.
2. Build these components in `src/lib/components/`: `Button.svelte` (primary, secondary and link variants; renders `<a>` when given `href`), `DemoBadge.svelte`, `DemoBanner.svelte`, `Toast.svelte` plus a tiny toast store (`toast.svelte.ts` using a `$state` rune), `SpotlightFrame.svelte`, `Countdown.svelte` (props: `endsAt: number`; renders `--` until mounted, to avoid hydration mismatch) and `Dialog.svelte` (native `<dialog>`, focus handling, Esc closes).
3. Create `src/routes/styleguide/+page.svelte` showing every token and component (not linked from navigation). This is for you to check the look quickly.

**Done when**
- [ ] `/styleguide` shows colours, type scale and all components on the dark wall
- [ ] Tab focus is clearly visible on every interactive element
- [ ] The countdown ticks, and with reduced motion on nothing animates

---

## Task 3 — Data, i18n and layout shell

**Prompt:**
> Do Task 3 from docs/06-tasks.md, using docs/03 and docs/05.

**Work**
1. `src/lib/types.ts`: the types from `docs/03`.
2. `src/lib/i18n/nl.ts`: the copy from `docs/05`. `src/lib/i18n/index.ts`: a `t(key, params?)` helper with typed dot-path keys if that's easy, otherwise a string key with a dev warning for missing keys. Add a `plural()` helper.
3. `src/lib/utils/format.ts`: `formatPrice`, `formatDimensions`, `formatCountdown`, `formatRelative`, `slugify`.
4. `scripts/generate-placeholders.ts`: generates 11 abstract SVGs in `static/placeholders/` with the aspect ratios in docs/03. Each one has a different composition style (colour fields, concentric shapes, horizontal bands, grids, soft gradients with an SVG noise filter), in muted palettes, deterministic from a seed. Add `npm run placeholders`.
5. `src/lib/data/artists.ts`, `artworks.ts`, `auctions.ts`: the real David Law data plus the 11 placeholder works and 5 invented artists exactly as in docs/03. Add selector helpers: `getArtwork(slug)`, `getArtist(slug)`, `getWorksByArtist(slug)`, `getAuction(slug)`, `getFeatured()`, `getLiveAuctions()`.
6. `+layout.svelte`: DemoBanner, header (with mobile menu sheet and scroll translucency), `<main id="content">`, footer, a skip link, and a global Toast container.

**Done when**
- [ ] Header and footer render on every route, on mobile and desktop
- [ ] 11 placeholder SVGs exist and look clearly abstract
- [ ] No hardcoded Dutch strings in components (grep for common words like " de " and " het " in `.svelte` files)
- [ ] `npm run check` passes with strict types

---

## Task 3b — Marketplace inventory (added 12 Oct 2026)

Added after the team confirmed the positioning: a Catawiki-style marketplace where David Law is one artist among many (docs/01 Positioning). Tasks 1–3 stay as they are; this task only extends the data.

**Prompt:**
> Do Task 3b from docs/06-tasks.md, using docs/03.

**Work**
1. `scripts/generate-placeholders.ts`: add the 12 new works (D-12 to D-23) and three styles for the new artists (warm arcs and discs, monochrome stepped greys, fine drawn lines). Regenerate.
2. `src/lib/types.ts`: add `reservePriceEur` to `AuctionLot` (`startsInMs` already exists).
3. `src/lib/data/`: the 3 new invented artists, the 12 new works and auction lots 4–6, with reserves exactly as in docs/03. Update the featured list (CR-0001, D-11, D-14, D-09, D-15).
4. `src/lib/i18n/nl.ts`: the new `home.*` keys from docs/05.
5. Rename the package from `david-law` to `kunstkamer` in `package.json`.

**Done when**
- [ ] 23 placeholder SVGs exist, clearly abstract, each artist's works still read as a series
- [ ] 9 artists, 24 works, 6 auction lots (5 live, 1 upcoming), all placeholders `isDemo: true`
- [ ] No identifier, title or copy outside the David Law artwork and artist records mentions David Law

---

## Task 4 — Home page

**Prompt:**
> Do Task 4 from docs/06-tasks.md (docs/04 section 1).

**Work**
1. Build `WallLabel.svelte` and `ArtworkTile.svelte` (docs/02).
2. Build the home page in the order from docs/04: platform hero with the featured lot in the spotlight and the "lights on" load animation, Sluit binnenkort (live lots sorted by end time), Uitgelicht row, Ontdek per techniek, Over het platform, Kunstenaars list.
3. Countdowns use `endsAt = mountTime + lot.endsInMs`. Store the computed `endsAt` in a module-level map keyed by lot slug, so the home page, overview and lot page all show the same time within one session.
4. Put the technique grouping (technique/support → Schilderkunst, Fotografie, Zeefdruk, Werk op papier) in `src/lib/utils/catalogue.ts` now, so Task 5 reuses it.

**Done when**
- [ ] The home page reads as a marketplace: the headline is about the platform, not one artist
- [ ] The featured lot looks spot-lit and premium at 1280px and on a 375px phone
- [ ] Sluit binnenkort shows all 5 live lots, soonest first, with ticking countdowns
- [ ] The featured row bottom-aligns works of different ratios on one eye line
- [ ] All links go to valid routes (temporary stub pages are OK for routes built later)

---

## Task 5 — Catalogue

**Prompt:**
> Do Task 5 from docs/06-tasks.md (docs/04 section 2).

**Work**
1. Build the eye-line grid, the filter sidebar and mobile bottom sheet, active-filter chips, sort, search, result count and the empty state.
2. URL-synced state as described in docs/04.
3. Map technique and support to technique groups, longest side to size groups, and the width/height ratio to orientation (square when within 5% of 1:1).

**Done when**
- [ ] Every filter combination works, counts update, and the URL reflects the state
- [ ] Reloading a filtered URL restores the same view
- [ ] The back button steps through filter changes sensibly (use `replaceState` for search typing and `pushState`-style navigation for checkbox changes)
- [ ] The mobile filter sheet works with the keyboard and traps focus

---

## Task 6 — Artwork detail

**Prompt:**
> Do Task 6 from docs/06-tasks.md (docs/04 section 3).

**Work**
1. `Gallery.svelte` with thumbnails, keyboard and swipe support, and a lightbox.
2. The detail page with breadcrumb, sticky action column, status-dependent action area, trust row, about/specs, artist section and related works.
3. The buy dialog and the price inquiry dialog, both ending in demo toasts. The inquiry form doesn't send or store anything.
4. Prerender all slugs via `entries()`. Unknown slugs return a 404 with a friendly page ("Dit werk bestaat niet (meer)." plus a link to the collection).

**Done when**
- [ ] The David Law page shows all 5 images, every spec row and "Certificaat van echtheid inbegrepen"
- [ ] The main image never upscales beyond 1.25× its intrinsic size
- [ ] The edition line reads "Exemplaar 1/4 E.A. uit een oplage van 8 + 4 E.A."
- [ ] All four status variants render correctly (check D-01, D-02, D-04 and CR-0001)

---

## Task 7 — Artist pages

**Prompt:**
> Do Task 7 from docs/06-tasks.md (docs/04 section 4).

**Done when**
- [ ] `/kunstenaars` lists all 9 artists with counts
- [ ] `/kunstenaars/david-law` shows the bio, a detail-crop visual instead of a portrait, and his work
- [ ] Placeholder artists show the "Demo-kunstenaar" badge

---

## Task 8 — Auctions

**Prompt:**
> Do Task 8 from docs/06-tasks.md (docs/04 sections 5 and 6).

**Work**
1. `/veilingen` with Lopend and Binnenkort tabs.
2. `/veilingen/[slug]` with the full `BidBox`, validation, confirm step, bid history, simulated counter-bids (max 2 per session), reserve logic, soft close and the "Hoe werkt bieden?" steps.
3. Bid state lives in a shared module (`src/lib/data/auction-state.svelte.ts`) so the current bid shown on the home page and overview matches the lot page within a session.

**Done when**
- [ ] A bid below the minimum shows the inline error; a valid bid goes through confirm, then history, then a toast
- [ ] A bid of €900 or more flips the reserve to "Minimumprijs bereikt"
- [ ] A counter-bid arrives 20–40 seconds after the user's bid, at most twice
- [ ] Going back to the home page shows the updated current bid
- [ ] To test soft close, temporarily set `endsInMs` to 70 seconds, bid at under 60 seconds left, and the timer extends by 1 minute. Revert afterwards.

---

## Task 9 — (Stretch) Admin Excel import

**Only start this if Tasks 1–8 are done and polished by Wednesday morning.**

**Prompt:**
> Do Task 9 from docs/06-tasks.md (docs/04 section 7).

**Done when**
- [ ] The downloaded template opens in Excel with the correct headers and the David Law row
- [ ] Uploading that template back shows a preview with 1 OK row
- [ ] A broken file shows the read error, not a crash

---

## Task 10 — Polish, checks and deploy

**Prompt:**
> Do Task 10 from docs/06-tasks.md. Then run the demo checklist and report every item.

**Work**
1. Responsive pass at 375, 768, 1024 and 1280px. Fix overflow, tap targets (44px minimum) and text wrapping (long Dutch words: use `hyphens: auto` with `lang="nl"`).
2. Accessibility pass: headings in order, alt texts, labels on every input, `aria-live` on the toast and current bid, keyboard-only walkthrough of buy, inquiry and bid.
3. Performance: preload the hero image, lazy-load below the fold, and confirm fonts are subset to Latin. Run Lighthouse (mobile) on `/` and `/collectie/david-law-crypto-nick-cave-vi`.
4. Add a favicon (simple "K" in Bodoni on `wall`) and an Open Graph image (the hero artwork in its spotlight frame, 1200×630), plus `og:title`/`og:description`.
5. Delete or protect `/styleguide` (simplest: exclude it from the build with an env check, or just delete it).
6. Deploy: push to GitHub and import into Vercel (it auto-detects SvelteKit and serves the static `build/` output). Alternatively, drag the `build/` folder onto Netlify Drop.

## Demo checklist (before sending the link)

- [ ] No private data from docs/07 anywhere. Search the built `build/` folder case-insensitively for "siret", "agessa", "insee", "certificat d", "0499" and for email addresses (`grep -rEio "[a-z0-9._-]+@[a-z0-9-]+\.[a-z]+" build/`). Only the placeholder contact email should appear.
- [ ] Every placeholder work and artist shows a demo badge
- [ ] The demo banner is visible on first load
- [ ] No console errors on any page
- [ ] Lighthouse mobile: performance 90+, accessibility 95+
- [ ] Tested on a real phone (iOS Safari and Android Chrome if possible)
- [ ] Every open question in docs/08 is either resolved or its default is acceptable for the demo
- [ ] The link works in a private/incognito window
