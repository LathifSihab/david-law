# CLAUDE.md — Kunstkamer demo

You are building a **front-end demo** of an art marketplace (Catawiki-inspired) for a client, Carl Reymen.
The full spec is in `docs/`. Read `docs/01` to `docs/08` before writing code. Work through `docs/06-tasks.md` **one task at a time** and stop after each task with a short summary of what changed and how to check it.

## Stack (do not swap without asking)

- SvelteKit 3 (Vite 8) with **Svelte 5 runes** (`$state`, `$derived`, `$props`, `$effect`). No legacy `export let` or `$:` syntax.
- TypeScript, strict mode.
- Tailwind CSS v4 via `@tailwindcss/vite`. Design tokens live in `src/app.css` under `@theme`.
- `@sveltejs/adapter-static`, with every route prerendered (`export const prerender = true` in the root `+layout.ts`). Kit 3 has no `svelte.config.js`: the adapter and compiler options live in `vite.config.ts`, and `src/lib` is imported via the `#lib` alias (package.json `imports`).
- Fonts: self-hosted through `@fontsource` packages (no Google Fonts requests).
- No backend, no database, no auth, no payments. All data is static TypeScript in `src/lib/data/`.

## Project structure

```
src/
  app.css                  # Tailwind + @theme tokens (docs/02)
  lib/
    config.ts              # brand name, demo flag, contact info
    i18n/nl.ts             # ALL UI copy (docs/05). No hardcoded Dutch strings in components.
    i18n/index.ts          # t() helper
    types.ts               # Artwork, Artist, AuctionLot, ... (docs/03)
    data/artists.ts
    data/artworks.ts
    data/auctions.ts
    utils/format.ts        # formatPrice (nl-BE, EUR), formatDimensions, slugify
    components/            # reusable UI (docs/02 "Components")
  routes/
    +layout.svelte         # header, footer, demo banner
    +page.svelte           # home
    collectie/             # catalogue + [slug] detail
    kunstenaars/           # index + [slug] artist page
    veilingen/             # index + [slug] auction lot
    admin/import/          # optional Task 9
static/
  artworks/<slug>/*.webp   # copied from assets/
  placeholders/*.svg       # generated abstract placeholders
```

## Rules

1. **Copy:** every user-facing string comes from `src/lib/i18n/nl.ts`. Dutch is the only language for now, but the structure must make adding `en.ts` trivial.
2. **Privacy:** never add the certificate scan, registration numbers, SIRET/AGESSA numbers, purchase prices, supplier info or contact details of artists to the site. See `docs/07`. If source material contains something that looks private, leave it out and mention it in your summary.
3. **Placeholder works:** every placeholder artwork has `isDemo: true`, an invented artist and title, and an abstract generated SVG image. They show a visible "Demo-werk" badge. Never use images of real artworks other than the David Law files in `assets/`. Never invent works by real artists.
4. **Images:** always set `width`/`height` (or aspect-ratio), use `loading="lazy"` below the fold, `decoding="async"`, and meaningful Dutch `alt` text.
5. **Accessibility:** semantic HTML, visible focus states, keyboard-usable gallery/filters/bid form, contrast at least WCAG AA on the dark theme.
6. **Responsive:** mobile-first. Check 375px, 768px and 1280px widths.
7. **Demo actions:** buttons like "Kopen" or "Bod plaatsen" never pretend to complete a real transaction. They update local state and/or show a toast that says this is a demo (copy in `docs/05`).
8. **Keep it simple:** no state libraries, no component libraries, no animation libraries. Svelte transitions and CSS are enough.
9. **Formatting:** prices via `Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' })`, dates via `Intl.DateTimeFormat('nl-BE')`.
10. **Before finishing each task:** run `npm run check` and `npm run build`, and fix all errors and warnings.

## Commands

```
npm run dev       # local dev
npm run check     # svelte-check / types
npm run build     # static build into build/
npm run preview   # preview the build
```
