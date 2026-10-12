# 02 — Design system

## Concept: "the gallery after hours"

The platform should feel like walking through a gallery at night, with the works lit and everything else quiet. Two cues come from the real material Carl sent:

- **Brushed aluminium.** The David Law work is printed on aluminium, so the secondary colour is a cool metal grey instead of the usual gold or cream.
- **The museum wall label.** Every work is presented with a small, precise wall-label block (artist, title, year, medium, dimensions), exactly as in a gallery. This label is the one recurring visual device across the whole site and replaces generic "product cards".

**The one bold move:** the hero spotlight. Artworks on the home page and detail pages sit on a dark wall with a soft, warm pool of light behind them, as if spot-lit. Everything else stays restrained.

### Things to deliberately avoid

These read as templated:

- ALL-CAPS tracked-out labels above headings
- Rounded cards with drop shadows around every artwork
- Arrows ("→") appended to buttons and links
- Meta strings joined with middle dots ("2023 · Aluminium · 60×90"). Use the wall-label line layout instead.
- One word in a headline set in italic or a different colour
- Fade-and-slide-up entrance animations on every section

## Colour tokens

Put these in `src/app.css` under `@theme`.

| Token | Hex | Use |
|---|---|---|
| `--color-wall` | `#1A1B1D` | Page background: a cool graphite, like a dark-painted gallery wall |
| `--color-wall-deep` | `#121315` | Footer, image wells, behind artworks |
| `--color-plinth` | `#24262A` | Raised surfaces: filter panel, bid box, inputs |
| `--color-aluminium` | `#A9AEB4` | Secondary text, hairlines, inactive states |
| `--color-paper` | `#ECEAE5` | Primary text, primary button fill |
| `--color-spot` | `#F3D9A4` | **Only** for the spotlight glow (at low opacity) and focus rings |
| `--color-live` | `#E5A13A` | **Only** for live auction state: countdown, "live" dot, leading bid |
| `--color-demo` | `#7F8A9A` | Demo badges and the demo banner |

Rules:

- Body text `paper` on `wall` (about 14:1 contrast). Secondary text `aluminium` on `wall` (about 7.5:1). Both pass AA.
- `live` amber means exactly one thing: *this auction is running*. Never use it decoratively.
- Spotlight: `radial-gradient(ellipse at 50% 40%, rgb(243 217 164 / 0.10), transparent 60%)` behind the artwork, on `wall-deep`.

## Typography

| Role | Font | Package |
|---|---|---|
| Display: artwork titles, artist names, page titles | **Bodoni Moda** (variable, use the optical size axis) | `@fontsource-variable/bodoni-moda` |
| UI and body: labels, prices, filters, paragraphs | **Schibsted Grotesk** (variable) | `@fontsource-variable/schibsted-grotesk` |

Fallbacks: `"Bodoni Moda", "Didot", "Bodoni 72", Georgia, serif` and `"Schibsted Grotesk", system-ui, sans-serif`.

### Scale (ratio about 1.333, base 16px)

| Token | Size / line-height | Font | Use |
|---|---|---|---|
| `display` | clamp(2.75rem, 6vw, 5rem) / 1.02 | Bodoni, weight 400 | Hero artwork title |
| `h1` | clamp(2.25rem, 4vw, 3.25rem) / 1.08 | Bodoni, 400 | Page titles, detail page title |
| `h2` | 1.75rem / 1.15 | Bodoni, 400 | Section titles |
| `h3` | 1.25rem / 1.3 | Bodoni, 500 | Wall-label title |
| `body` | 1rem / 1.6 | Schibsted, 400 | Paragraphs (max 68ch) |
| `small` | 0.875rem / 1.5 | Schibsted, 400 | Wall-label lines, meta |
| `price` | 1.125rem / 1.3 | Schibsted, 600, `tabular-nums` | Prices and bids |

Rules:

- Titles in Bodoni, in **sentence case**, never all caps. Artwork titles are in italic only inside the wall label (the gallery convention).
- Numbers that change (countdowns, live bids) use `font-variant-numeric: tabular-nums` so they don't jitter. Static prices stay proportional: in Schibsted Grotesk the tabular thousands dot is a full digit wide and "€ 1.450" reads as "€ 1 . 450" (changed 12 Oct 2026).
- Left-align everything except the hero title block.

## Layout

- Max content width 1320px, side gutters `clamp(1rem, 4vw, 3rem)`.
- Generous vertical rhythm: sections separated by `clamp(4rem, 10vw, 8rem)`.
- **No border radius** on artwork images (artworks have hard edges). A 2px radius on inputs and buttons only.
- Hairlines: 1px `aluminium` at 25% opacity.

### Home (desktop)

```
┌──────────────────────────────────────────────────────────────┐
│ Kunstkamer        Collectie  Kunstenaars  Veilingen   [zoek]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   Crypto Nick Cave VI          ░░░░░░░░░░░░░░░░              │
│   David Law                    ░░  spot-lit   ░░             │
│                                ░░  artwork    ░░             │
│   Veiling sluit over           ░░             ░░             │
│   1d 14u 22m                   ░░░░░░░░░░░░░░░░              │
│   [Bekijk de veiling]                                         │
├──────────────────────────────────────────────────────────────┤
│ Uitgelicht                                     Alle werken   │
│  ▓▓▓      ▓▓▓▓▓     ▓▓▓     ▓▓▓▓    (bottom-aligned, real    │
│  ▓▓▓      ▓▓▓▓▓     ▓▓▓     ▓▓▓▓     aspect ratios)          │
│  label    label     label   label                            │
└──────────────────────────────────────────────────────────────┘
```

### Catalogue: the "eye line" grid

Artworks keep their **real aspect ratio** (never cropped to squares) and each row is **bottom-aligned**, like works hung on a wall at the same eye line. The wall label sits under each work.

- Implementation: CSS grid, `align-items: end` on the image wrapper, images `max-height: 340px; width: auto; max-width: 100%`.
- 4 columns at 1280px or wider, 3 at 1024px, 2 at 640px, 1 below that.

```
 ▓▓▓▓▓            ▓▓▓▓▓▓▓▓▓            ▓▓▓
 ▓▓▓▓▓   ▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓    ▓▓▓
 ▓▓▓▓▓   ▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓    ▓▓▓
 ───────────────────────────────────────────  ← shared eye line
 label   label    label       label    label
```

## Components

### `WallLabel`
The signature component. Used in catalogue tiles, the artist page, the detail page and the auction page.

```
David Law                       ← Schibsted 600, paper
Crypto Nick Cave VI, 2023       ← Bodoni italic title, then year
Fotografische compositie op     ← small, aluminium
aluminium, 60 × 90 cm
Oplage van 8 + 4 E.A.
€ 1.250                         ← price style (or "Huidig bod € 900" in live amber)
```

Props: `artwork`, `variant: 'tile' | 'full'`, `showPrice = true`. The `full` variant adds edition, signature and certificate lines.

### `ArtworkTile`
An image (real aspect ratio) plus a `WallLabel` (tile variant), linking to the detail page. Hover state: the image brightens slightly (`filter: brightness(1.06)`) and the artist name underlines. No lift, no shadow, no scale. Shows `DemoBadge` when `isDemo`.

### `SpotlightFrame`
Wraps a hero or detail image. `wall-deep` background with the spotlight gradient and generous padding, so the artwork appears to hang lit on a wall.

### `Gallery` (detail page)
The main image in a `SpotlightFrame` with a thumbnail strip underneath. Thumbnails can be activated with click, arrow keys or swipe. Clicking the main image opens a full-screen lightbox (Esc closes it, arrow keys navigate, focus is trapped).

### `DemoBadge`
A small pill: `demo` colour border, text "Demo-werk". Top-left over the image.

### `DemoBanner`
A thin bar at the very top of every page: "Dit is een demo. Er worden geen echte aankopen of biedingen verwerkt." It can be dismissed, but only for the session (component state only, no storage).

### `Countdown`
Shows `1d 14u 22m 05s` in tabular numbers and `live` colour. Updates every second. Below one hour it shows minutes and seconds only. At zero it shows "Veiling gesloten".

### `BidBox`
A `plinth` panel showing the current bid (large, live amber), minimum next bid, a bid input with quick-bid buttons (+€50 / +€100 / +€250), a "Bod plaatsen" button, and a short note about the buyer's fee. See `docs/04` for behaviour.

### `Toast`
Bottom-centre on mobile, bottom-right on desktop, auto-dismisses after 4s, `aria-live="polite"`.

### Buttons
- Primary: `paper` fill with `wall` text, 2px radius, 48px tall.
- Secondary: transparent with a 1px `paper` border.
- Text link: `paper` with an underline offset of 4px, underline thickens on hover.
- Focus ring on everything: 2px `spot` outline, 3px offset.

## Motion

- **One orchestrated moment:** on home page load, the hero spotlight fades from 0 to full over 900ms, then the hero text fades in over 400ms. "The lights come on."
- Responsive motion only beyond that: lightbox open and close, bid confirmation (the new bid number briefly flashes `live`), filter panel opening on mobile.
- Respect `prefers-reduced-motion`: no fades, instant state changes.

## Placeholder artwork images

Generate **11 abstract SVGs** in `static/placeholders/`, one per placeholder work. They should be clearly abstract (colour fields, geometric compositions, gradients and noise) so nobody mistakes them for real art. Vary the aspect ratios (portrait 2:3, landscape 4:3, square 1:1, tall 1:2) so the eye-line grid looks realistic. Use muted palettes that sit well on the dark wall. A generator script lives in `scripts/generate-placeholders.ts` so they can be regenerated.
