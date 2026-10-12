# 02 — Design system

> **Changed 12 Oct 2026: marketplace redesign.** The first version followed a sparse dark "gallery after hours" concept. Against the reference (catawiki.com) it read as too bare, so the site is now a light, dense marketplace: an always-visible search bar, a category strip, rounded lot cards with a countdown, a favourite heart and the bid, and home-page sections for promos, trust, categories, artists and a newsletter. The gallery idea survives in two places: the featured lot hangs on a dark, spot-lit wall in the home hero, and artworks are never cropped on cards.

## Concept: a curated marketplace

The site should feel like a trustworthy, busy auction platform where the art is the colour and the interface stays neutral.

- **White canvas, grey wells.** Pages are white. Every artwork sits uncropped in a light grey "well" with a soft drop shadow, as if it were hanging on a wall.
- **One brand colour.** A saturated blue (`brand`) marks every primary action and link. Nothing else is coloured, apart from the auction state (`live`).
- **Density with order.** Many items per screen, in cards with clear hierarchy: artist (muted), title (bold), specs (muted) and price (large, bold).

### Things to avoid

- ALL-CAPS tracked-out labels above headings
- Cropping artworks to fill a frame on cards or detail pages. Small decorative thumbnails (promo stacks, artist avatars) may crop.
- Coloured or gradient section backgrounds other than `surface`, `brand-tint`, `brand` (newsletter only) and `night` (hero and footer)
- Fade-and-slide-up entrance animations on every section

## Colour tokens

These live in `src/app.css` under `@theme`. Tailwind's default palette is removed.

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#FFFFFF` | Page background, cards |
| `well` | `#F3F4F6` | Image wells behind artworks |
| `surface` | `#F7F8FA` | Panels: bid box, trust list, "how it works", empty states |
| `ink` | `#15171C` | Primary text |
| `muted` | `#5A6170` | Secondary text (6.2:1 on white) |
| `line` | `#E2E5EA` | Card borders and hairlines |
| `brand` | `#2340E6` | Primary buttons, links, active nav, checkboxes, saved heart (7.1:1 with white) |
| `brand-strong` | `#1A30B8` | Hover on brand |
| `brand-tint` | `#EEF1FE` | Soft brand backgrounds: promo card, filter chips, icon circles |
| `focus` | `#2340E6` | Focus rings (white on `night`, `brand` and `demo` backgrounds) |
| `live` | `#C2410C` | **Only** for a running auction: countdown, live dot, current bid |
| `live-tint` | `#FFF1E8` | Reserved for live-state backgrounds |
| `demo` | `#5B6676` | Demo badges and the demo banner (white text) |
| `night` | `#101218` | Home hero banner and footer |
| `night-muted` | `#A6ADBB` | Secondary text on `night` (8.3:1) |

Rules:

- All text pairs pass WCAG AA; check new pairs before adding them.
- `live` means exactly one thing: *this auction is running*. Never use it decoratively, including for hearts or sale badges.

## Typography

| Role | Font | Package |
|---|---|---|
| Everything: headings, UI, body | **Schibsted Grotesk** (variable) | `@fontsource-variable/schibsted-grotesk` |
| Wordmark "Kunstkamer" only | **Bodoni Moda** (variable) | `@fontsource-variable/bodoni-moda` |

| Utility | Size / line-height | Weight | Use |
|---|---|---|---|
| `type-display` | clamp(2rem, 3.6vw, 3rem) / 1.08 | 700, -0.025em | Home hero headline |
| `type-h1` | clamp(1.875rem, 3.2vw, 2.5rem) / 1.12 | 700 | Page titles |
| `type-h2` | clamp(1.375rem, 2.2vw, 1.75rem) / 1.2 | 700 | Section titles |
| `type-h3` | 1.0625rem / 1.35 | 600 | Card and panel titles |
| `type-body` | 1rem / 1.6 | 400 | Paragraphs (max 68ch) |
| `type-small` | 0.875rem / 1.5 | 400 | Meta, labels |
| `type-price` | 1.125rem / 1.3 | 700 | Prices and bids |

- Titles in sentence case, never all caps. Artwork titles are no longer italic.
- Ticking numbers (countdowns, live bids) use `tabular-nums`. Static prices stay proportional: in Schibsted Grotesk the tabular thousands dot is a full digit wide ("€ 1 . 450").

## Layout

- Max content width 1320px, side gutters `clamp(1rem, 4vw, 3rem)`, sections separated by `clamp(3rem, 7vw, 5.5rem)`.
- Radii: `rounded-card` (14px) for cards and panels, `rounded-control` (8px) for buttons and inputs, `rounded-full` for pills, search, chips and the heart.
- Shadows: `shadow-card` for resting raised elements (header when scrolled, sticky purchase panel), `shadow-raised` on card hover. Cards rest flat with a 1px `line` border.
- Card grids (`CARD_GRID` in `src/lib/utils/layout.ts`): 2 columns on phones, 3 from 768px, 4 from 1280px (3 next to the catalogue sidebar). Rows on the home page (`TILE_ROW`) scroll horizontally with snap below 1024px.
- Detail pages: gallery left, a sticky bordered purchase panel right (`top-36`, below the two-row header).

### Header

```
┌────────────────────────────────────────────────────────────────────┐
│ Kunstkamer  [🔍 Zoek op titel, kunstenaar of techniek   (Zoeken)]  👤 Inloggen  ♡ │
├────────────────────────────────────────────────────────────────────┤
│ Veilingen  Collectie  Kunstenaars │ Schilderkunst  Fotografie  …  │
└────────────────────────────────────────────────────────────────────┘
```

On phones the search bar gets its own row under the logo, the category strip scrolls sideways and the rest goes into the menu sheet. "Inloggen" shows a demo toast. The heart links to `/favorieten` and shows a count badge.

### Home (top to bottom)

1. **Hero:** left, a `night` banner with the tagline (h1), the intro, a featured-lot box (title, artist, current bid, countdown) and "Bied mee" / "Bekijk de collectie"; the featured lot hangs on the dark wall beside it under a warm spotlight that fades in. Right, two promo cards: "Lopende veilingen" (`brand-tint`) and "Koop direct" (`surface`), each with a stack of thumbnails.
2. **Trust strip:** four promises with icons in one bordered row.
3. **Sluit binnenkort:** live lots as cards, soonest first.
4. **Populaire categorieën:** four tiles with a representative work and a count.
5. **Uitgelicht**, then **Zo werkt Kunstkamer** (three numbered steps on `surface`), then **Nieuw in de collectie**.
6. **Kunstenaars:** a row of round avatars with names and counts.
7. **Over het platform** next to the **newsletter** band (`brand`). Signing up validates, then shows a demo toast; nothing is sent or stored.

## Components

### `ArtworkTile` (the lot card)
A square `well` with the artwork uncropped (`object-contain`, soft shadow, slight zoom on hover), `DemoBadge`/"Verkocht" chips top left, the `FavouriteButton` top right, and for auction lots a white countdown chip bottom left ("Start over …" for upcoming lots). Below: artist (muted), title (semibold, 2 lines max, underlines on hover), technique and size (hidden on phones), then the price block: "Huidig bod"/"Startbod" with the amount in `live` for running lots plus the bid count, "Koop direct" with the price, "Prijs op aanvraag" or "Verkocht". The whole card is one link. A lot is taken from the artwork's `auctionSlug` when no `lot` is passed.

### `FavouriteButton`
A round white heart button with `aria-pressed`. It toggles the artwork in `favourites` (`src/lib/data/favourites.svelte.ts`, a module-level `SvelteSet`: it survives client-side navigation, not a reload, and nothing is stored) and shows a demo toast.

### `SpotlightFrame`
A rounded `well` with a soft white glow, used by the detail gallery and the artist page.

### `Gallery` (detail page)
Main image in a `SpotlightFrame`, rounded thumbnails underneath (active one ringed in `brand`). Click, arrow keys or swipe; the lightbox closes on Esc, navigates with the arrow keys and traps focus.

### `DemoBadge`
A small solid `demo` pill with white text: "Demo-werk" (over an image) or "Demo-kunstenaar".

### `DemoBanner`
A thin `demo` bar at the very top of every page: "Dit is een demo. Er worden geen echte aankopen of biedingen verwerkt." It can be dismissed for the session only (component state, no storage).

### `Countdown`
`1d 14u 22m 05s` in tabular numbers, in `live` for running lots. Below one hour it shows only minutes and seconds; at zero it shows "Veiling gesloten".

### `BidBox`
A `surface` panel inside the purchase panel: the current bid (large, `live`), bid count, countdown, reserve state, the bid input, quick-bid pills, a full-width "Bod plaatsen" button and the buyer's fee note.

### `Toast`
A `night` pill, bottom-centre on phones and bottom-right on desktop. Auto-dismisses after 4s, `aria-live="polite"`.

### Buttons
- Primary: `brand` fill, white text, 8px radius, 48px tall, semibold.
- Secondary: white with a 1px `ink` border.
- Ghost: for dark backgrounds, with a translucent white border.
- Link: `brand` text, underline offset of 4px, thicker underline on hover.
- Focus ring on everything: a 2px `focus` outline with a 3px offset; it turns white on `night`, `brand` and `demo` backgrounds.

## Motion

- On home page load, the hero spotlight behind the featured lot fades in over 900ms.
- Beyond that, motion only responds to the user: card hover (shadow and a 3% image zoom), lightbox open and close, bid confirmation (the new bid briefly flashes `live`) and the mobile filter sheet opening.
- Respect `prefers-reduced-motion`: no fades, instant state changes.

## Placeholder artwork images

There are **22 abstract SVGs** in `static/placeholders/`, one per placeholder work, generated by `scripts/generate-placeholders.ts` so they can be regenerated. They are clearly abstract (colour fields, geometric compositions, gradients and noise) so nobody mistakes them for real art. Their aspect ratios vary (portrait 2:3, landscape 4:3, square 1:1, tall 1:2), and their muted palettes sit well in the light grey wells.
