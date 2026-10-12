# 04 — Pages

All copy keys referenced here (`t('...')`) are defined in `docs/05-copy-nl.md`.

> **Changed 12 Oct 2026:** the marketplace redesign (`docs/02`) replaces the visual layout below: the header, the home sections, the eye-line grids (now card grids), the auction rows (now cards) and the artist index (now cards). Behaviour, routes, data and copy rules below still apply. `WallLabel` was removed; its content now lives in the lot card and the purchase panel. New: a session-only favourites page at `/favorieten`.

## Global layout (`+layout.svelte`)

**DemoBanner** sits above everything (see `docs/02`).

**Header:** the wordmark "Kunstkamer" (Bodoni, links to `/`). Navigation: Collectie (`/collectie`), Kunstenaars (`/kunstenaars`), Veilingen (`/veilingen`). A search icon opens an inline search field that navigates to `/collectie?q=...`.
- On mobile, navigation collapses into a menu button that opens a full-height sheet.
- The header becomes slightly translucent (`wall` at 85% opacity with backdrop blur) when scrolled.

**Footer:** `wall-deep` background with the wordmark, a one-line description, the navigation links again, "Contact" (mailto placeholder from `config.ts`) and "© 2026 Kunstkamer — demo". No social icons.

**Meta:** each page sets `<title>` and `<meta name="description">`. Add `<meta name="robots" content="noindex">` site-wide, because this is a client demo.

---

## 1. Home `/`

The home page sells **the platform**, not one artist (docs/01 Positioning). Order: Hero, Sluit binnenkort, Uitgelicht, Ontdek per techniek, Over het platform, Kunstenaars.

### Hero
- Split layout. **Left:** the platform headline (`brand.tagline`, `display` size, Bodoni), a one-line intro (`home.heroIntro`), a primary button "Bekijk de collectie" (`/collectie`) and a secondary button "Alle veilingen" (`/veilingen`). **Right:** the featured lot (CR-0001) in a `SpotlightFrame`, with a compact caption underneath: "Uitgelichte kavel" with the amber live dot, the `WallLabel` (tile variant), the current bid, the `Countdown` and a text link "Naar de veiling".
- The featured lot is framed as one lot among many. The headline never names the artist.
- On mobile the text block comes first, then the featured lot.
- Load animation: "the lights come on" (`docs/02` Motion), on the featured lot's spotlight.

### Sluit binnenkort (closing soon)
- The Catawiki core: section title "Sluit binnenkort" with a text link "Alle veilingen" on the right.
- An eye-line row of all live lots **sorted by end time, soonest first**: image, `WallLabel` (tile variant), current bid in `live` amber and a `Countdown`. Each item links to its lot page. On mobile it becomes a horizontal scroll-snap row.

### Uitgelicht (featured)
- Section title "Uitgelicht" with a text link "Bekijk de hele collectie" on the right.
- An eye-line row of 4 `ArtworkTile`s (the featured works other than the featured lot). On mobile it becomes a horizontal scroll-snap row.

### Ontdek per techniek (browse by technique)
- Four large text links in Bodoni at `h2` size (Schilderkunst, Fotografie, Zeefdruk, Werk op papier), each with its work count in `small`, linking to `/collectie?techniek=...`. Uses the same technique grouping as the catalogue filter. No icons or image cards.

### Over het platform
- Short text block (max 60ch), three short paragraphs: curated works, every work checked with a certificate, and buy directly or bid. Copy is in `docs/05`.
- No icons, no "feature cards". Plain, confident text.

### Kunstenaars
- A horizontal list of artist names in Bodoni at `h2` size, each linking to its page, with the number of works in `small`. Hovering a name shows the thumbnail of their first work beside the list on desktop only.

---

## 2. Catalogue `/collectie`

### Top bar
- Title "Collectie", the result count ("12 werken"), a search field (searches title, artist, technique) and a sort select: Nieuwste, Prijs laag–hoog, Prijs hoog–laag, Kunstenaar A–Z.

### Filters
- **Desktop:** a left sidebar, 260px, sticky.
- **Mobile:** a "Filters" button opens a bottom sheet with "Toon X werken" and "Wis alles" buttons.
- Filter groups:
  - **Status:** Te koop, In veiling, Verkocht, Op aanvraag (checkboxes)
  - **Kunstenaar:** checkboxes with counts
  - **Techniek:** Schilderkunst, Fotografie, Zeefdruk, Werk op papier. Derive these from the `technique`/`support` fields with a small mapping in code.
  - **Prijs:** min/max number inputs
  - **Formaat:** Klein (<50 cm), Middel (50–100 cm), Groot (>100 cm), based on the longest side
  - **Oriëntatie:** Staand, Liggend, Vierkant
- Active filters are shown as removable chips above the grid.

### State and URL
- All filter, sort and search state lives in URL search params (`?status=te-koop&kunstenaar=yuna-breckx&sort=prijs-asc&q=getij`), so links can be shared and the back button works.
- Filtering happens client-side with `$derived`. Because the site is prerendered, read the params in the browser (`$page.url` after hydration) and use `goto(..., { replaceState: true, keepFocus: true, noScroll: true })` on change.

### Grid
- The eye-line grid of `ArtworkTile`s (`docs/02`).
- Sold works show "Verkocht" instead of a price, with the image at 70% opacity.
- **Empty state:** "Geen werken gevonden voor deze filters." plus a "Wis alle filters" button.

---

## 3. Artwork detail `/collectie/[slug]`

Generate a page for every artwork using `entries()` in `+page.ts` for prerendering.

### Layout (desktop)
```
┌───────────────────────────────┬─────────────────────────┐
│                               │ David Law               │
│        Gallery                │ Crypto Nick Cave VI     │
│   (SpotlightFrame + thumbs)   │ 2023                    │
│                               │                         │
│                               │ [BidBox or BuyBox]      │
│                               │                         │
│                               │ Certificaat van         │
│                               │ echtheid inbegrepen     │
├───────────────────────────────┴─────────────────────────┤
│ Over dit werk        │ Specificaties (definition list)  │
├──────────────────────┴──────────────────────────────────┤
│ Over de kunstenaar (short bio + link)                   │
├─────────────────────────────────────────────────────────┤
│ Meer van deze kunstenaar / Misschien ook iets voor jou  │
└─────────────────────────────────────────────────────────┘
```
- The right column is sticky on desktop while the gallery scrolls.
- **Breadcrumb:** Collectie / Artist / Title.

### Action area (depends on status)
- `te-koop`: price in `price` style with a "Kopen" primary button and a "Stel een vraag" secondary button. "Kopen" opens a small dialog with a summary (work, price, "Verzending wordt berekend bij afrekenen") and a "Doorgaan naar afrekenen" button that shows the demo toast. **Nothing is "bought".**
- `veiling`: a compact `BidBox` summary (current bid, countdown, number of bids) with a "Naar de veiling" button.
- `op-aanvraag`: "Prijs op aanvraag" with a "Prijs aanvragen" button that opens a dialog with a 3-field form (naam, e-mail, bericht). Submitting it shows the demo toast. The form data is not sent anywhere and not stored.
- `verkocht`: "Dit werk is verkocht" with a "Vergelijkbare werken" link to the catalogue filtered by artist.

### Trust row (under the action area)
Three short lines, each with a small inline SVG icon (single stroke, `aluminium`): "Certificaat van echtheid inbegrepen" (only when `certificate`), "Zorgvuldig verpakt en verzekerd verzonden", "14 dagen bedenktijd bij aankoop". The last two are demo copy (docs/08 Q5).

### Specificaties
A `<dl>` with: Kunstenaar, Titel, Reeks, Jaar, Techniek, Drager, Afmetingen ("60 × 90 cm"), Oplage ("Exemplaar 1/4 E.A. uit een oplage van 8 + 4 E.A."), Gesigneerd, Certificaat. Skip rows whose value is empty.

### Related works
An eye-line row of up to 4 other works by the same artist. If there are fewer than 2, fill with works sharing the same technique group.

---

## 4. Artists index `/kunstenaars` and artist page `/kunstenaars/[slug]`

**Index:** the same artist list as on the home page (names in Bodoni at `h2` size, with work counts), full width, with one representative thumbnail per artist. Simple; this page exists only so the navigation link has a home.

**Artist page:**

- Header: name in `h1`, "Gevestigd in Parijs", and the bio paragraphs (max 65ch).
- If there's no portrait, don't show an empty frame. Use a large detail crop of their first work instead, in a `SpotlightFrame`.
- "Werken van David Law (n)": the eye-line grid.
- Placeholder artists show a `DemoBadge` next to their name.

---

## 5. Auctions overview `/veilingen`

- Title "Veilingen" with tabs: "Lopend" and "Binnenkort".
- Each lot is a wide row: image, lot number ("Kavel 001"), `WallLabel`, current bid or starting bid, `Countdown` (or "Start over 3 dagen") and a button.
- "Lopend" is sorted by end time, soonest first (the same order as "Sluit binnenkort" on the home page).

---

## 6. Auction lot `/veilingen/[slug]`

The Catawiki-style page. Same two-column layout as the detail page, but the right column is a full `BidBox`.

### BidBox content (top to bottom)
1. "Kavel 001" in `small` and "Live" with a pulsing amber dot (no pulse with reduced motion)
2. "Huidig bod" with **€ 850** (large, `live` colour) and "6 biedingen" (a link that scrolls to the bid history)
3. `Countdown`: "Sluit over 1d 14u 22m 05s"
4. Reserve status: "Minimumprijs nog niet bereikt" / "Minimumprijs bereikt" (with a check)
5. Bid input pre-filled with the minimum next bid (current + increment), with a € prefix
6. Quick-bid buttons: "€ 875", "€ 900", "€ 950" (computed from increments)
7. Primary button "Bod plaatsen"
8. Fine print: "Koperskosten: 9% van het winnende bod. Dit is een demo — er wordt niets aangerekend."

### Bidding behaviour (client-side only, `$state`)
- Validate that the bid is at least the minimum next bid. Otherwise show an inline error: "Je bod moet minstens € 875 zijn."
- On a valid bid: a confirm step inside the box ("Bevestig je bod van € 900" with "Bevestigen" and "Annuleren"), then:
  - prepend the bid to the history with `bidderLabel: 'Jij'` and `isYou: true`
  - update the current bid, briefly flash it, and update the bid count and the next minimum
  - if the bid is €900 or more, set the reserve to met
  - show the toast "Bod geplaatst (demo). Je bent de hoogste bieder."
- **Simulated competition (keeps the demo alive):** 20–40 seconds after the user's bid, add one counter-bid from a random "Bieder ####" at user bid + increment. Toast: "Je bent overboden." Do this at most twice per session, so it's charming rather than annoying.
- **Soft close** (Catawiki-like): if a bid is placed with less than 1 minute left, extend by 1 minute and show "Verlengd met 1 minuut". Unlikely to trigger in the demo, but it's cheap to implement and good to mention to Carl.

### Bid history
A table with Bieder, Bod and Tijd (relative, for example "12 min geleden", using `Intl.RelativeTimeFormat('nl-BE')`). The user's own bids are highlighted with a subtle `plinth` background and "Jij".

### Rest of the page
"Over dit werk", "Specificaties" and "Over de kunstenaar", the same as on the detail page (reuse the components). Then "Hoe werkt bieden?": 4 short numbered steps (a real sequence, so numbers are appropriate there) explaining bidding, the buyer's fee, payment after winning, and shipping.

---

## 7. (Stretch) Admin import `/admin/import`

Shows Carl how his Excel file becomes the catalogue. Not linked in the main navigation; reachable via a link in the footer ("Beheer (demo)").

1. A drop zone: "Sleep je Excel-bestand hierheen". Parse the file client-side with SheetJS (install from the official CDN tarball: `npm i https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`).
2. Show a preview table of the first 20 rows, mapped to the columns in `docs/03`, with per-row validation chips ("OK", "Afbeelding ontbreekt", "Prijs ontbreekt").
3. A summary: "34 werken klaar om te importeren, 3 met waarschuwingen".
4. An "Importeren" button that shows a demo toast. Nothing is persisted.
5. A "Download voorbeeldbestand" button that generates an .xlsx with the proposed column headers plus the David Law row, using SheetJS `writeFile`.

If there's no time, skip this page entirely. Don't ship it half-done.
