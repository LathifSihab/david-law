# 03 — Data model

All data is static TypeScript in `src/lib/data/`. The shapes are designed to map **one-to-one onto Carl's future Excel file**, so the real import (phase 2 of the quote) is a column mapping, not a redesign.

## Types (`src/lib/types.ts`)

```ts
export type ArtworkStatus = 'te-koop' | 'veiling' | 'verkocht' | 'op-aanvraag';

export interface ArtworkImage {
  src: string;          // e.g. '/artworks/david-law-crypto-nick-cave-vi/main.webp'
  thumb: string;        // 480px version for tiles and thumbnails
  width: number;        // intrinsic px, used for aspect ratio
  height: number;
  alt: string;          // Dutch, descriptive
  role: 'main' | 'detail' | 'signature' | 'context';
}

export interface Edition {
  size: number;               // number of regular prints, e.g. 8
  artistProofs?: number;      // e.g. 4
  label?: string;             // this specific copy, e.g. '1/4 E.A.' or '3/8'
}

export interface Artwork {
  id: string;                 // stable id, maps to Excel "ID" column
  slug: string;               // url-safe, unique
  title: string;
  artistSlug: string;
  series?: string;            // e.g. 'Crypto Rock Special Series'
  year: number;
  technique: string;          // Dutch, e.g. 'Fotografische compositie'
  support: string;            // Dutch, e.g. 'Print op aluminium'
  widthCm: number;
  heightCm: number;
  depthCm?: number;
  edition?: Edition;          // undefined = unique work
  signed: boolean;
  signatureNote?: string;     // e.g. 'Genummerd en gesigneerd op de achterzijde'
  certificate: boolean;       // show "Certificaat van echtheid inbegrepen". NEVER the certificate itself
  description: string;        // Dutch, public description (1–3 short paragraphs)
  details?: string[];         // extra public bullet facts (mounting, protection, ...)
  priceEur?: number;          // undefined = "Prijs op aanvraag"
  status: ArtworkStatus;
  auctionSlug?: string;       // set when status === 'veiling'
  images: ArtworkImage[];     // first image with role 'main' is used for tiles
  featured?: boolean;         // show on home page
  addedAt: string;            // ISO date, used for "Nieuwste" sort
  isDemo: boolean;            // true = placeholder work, shows DemoBadge
}

export interface Artist {
  slug: string;
  name: string;
  basedIn?: string;           // e.g. 'Parijs'
  shortBio: string;           // 1–2 sentences, for tiles
  bio: string[];              // paragraphs, public only
  portrait?: ArtworkImage;
  isDemo: boolean;
}

export interface Bid {
  amountEur: number;
  bidderLabel: string;        // anonymised, e.g. 'Bieder 4821'. Never real names
  placedAt: string;           // ISO
  isYou?: boolean;            // bids placed in this session
}

export interface AuctionLot {
  slug: string;
  artworkId: string;
  lotNumber: number;
  startingBidEur: number;
  reserveMet: boolean;
  bidIncrementEur: number;    // minimum step
  buyerFeePct: number;        // shown as info only
  endsInMs: number;           // DEMO: end time = page open + this. Keeps the countdown always live
  state: 'live' | 'binnenkort' | 'gesloten';
  seedBids: Bid[];            // newest first
  isDemo: boolean;
}
```

## Mapping to Carl's Excel (proposed columns)

Carl's Excel file hasn't arrived yet. When it does, map its columns to these fields. This table can also be sent to Carl as a suggested template.

| Proposed Excel column | Field | Notes |
|---|---|---|
| ID | `id` | Required, unique |
| Kunstenaar | `artistSlug` (via name lookup) | Creates an artist if new |
| Titel | `title` | |
| Reeks | `series` | Optional |
| Jaar | `year` | |
| Techniek | `technique` | |
| Drager | `support` | |
| Breedte (cm) / Hoogte (cm) / Diepte (cm) | `widthCm` / `heightCm` / `depthCm` | |
| Oplage / E.A. / Exemplaar | `edition.size` / `edition.artistProofs` / `edition.label` | Empty = unique work |
| Gesigneerd (ja/nee) | `signed` | |
| Certificaat (ja/nee) | `certificate` | |
| Beschrijving | `description` | Public text only |
| Prijs (€) | `priceEur` | Empty = op aanvraag |
| Status | `status` | te koop / veiling / verkocht / op aanvraag |
| Afbeeldingen | `images` | Folder name or file list |
| *Interne notities, aankoopprijs, herkomst-documenten, contact kunstenaar* | **never imported** | See `docs/07` |

The slug is generated as `slugify(artist + '-' + title)` and de-duplicated by appending `-2`, `-3`, and so on.

## Real artwork — David Law

Source: Carl's folder (description .docx, certificate PDF, 5 images). Images are already optimised in `assets/artworks/david-law-crypto-nick-cave-vi/`. Copy that folder to `static/artworks/`.

```ts
// src/lib/data/artworks.ts
{
  id: 'CR-0001',
  slug: 'david-law-crypto-nick-cave-vi',
  title: 'Crypto Nick Cave VI',
  artistSlug: 'david-law',
  series: 'Crypto Rock Special Series',
  year: 2023, // TODO confirm: description says April 2023, certificate says Paris 2024 (docs/08 Q2)
  technique: 'Fotografische compositie',
  support: 'Print op wit vinyl, gelamineerd op twee aluminium platen',
  widthCm: 60,
  heightCm: 90,
  edition: { size: 8, artistProofs: 4, label: '1/4 E.A.' },
  signed: true,
  signatureNote: 'Genummerd en gesigneerd op de achterzijde',
  certificate: true,
  description:
    'Uit de Crypto Rock Special Series: een portret van Nick Cave, gereconstrueerd uit honderden foto\'s van de afgebeelde kunstenaar zelf. Van op afstand een krachtig, donker portret; van dichtbij een mozaïek van beelden.',
  details: [
    'Beperkte oplage van 8 exemplaren en 4 artist proofs (E.A.)',
    'Bevestiging aan de achterzijde, klaar om op te hangen',
    'Flexibele laminering aan de voorzijde ter bescherming tegen uv en vocht',
  ],
  priceEur: undefined,      // auction lot, see auctions.ts
  status: 'veiling',
  auctionSlug: 'crypto-nick-cave-vi',
  featured: true,
  addedAt: '2026-10-09',
  isDemo: false,
  images: [
    { src: '/artworks/david-law-crypto-nick-cave-vi/main.webp',          thumb: '/artworks/david-law-crypto-nick-cave-vi/main-thumb.webp',          width: 369,  height: 751, role: 'main',      alt: 'Crypto Nick Cave VI van David Law: portret van Nick Cave in donker pak tegen een zwarte achtergrond, opgebouwd uit een mozaïek van kleine foto\'s' },
    { src: '/artworks/david-law-crypto-nick-cave-vi/detail-face.webp',   thumb: '/artworks/david-law-crypto-nick-cave-vi/detail-face-thumb.webp',   width: 653,  height: 803, role: 'detail',    alt: 'Detail van het gezicht, waarin de afzonderlijke mozaïekfoto\'s zichtbaar worden' },
    { src: '/artworks/david-law-crypto-nick-cave-vi/detail-mosaic.webp', thumb: '/artworks/david-law-crypto-nick-cave-vi/detail-mosaic-thumb.webp', width: 1162, height: 833, role: 'detail',    alt: 'Close-up van kraag en kin: honderden kleine foto\'s vormen samen het beeld' },
    { src: '/artworks/david-law-crypto-nick-cave-vi/detail-hand.webp',   thumb: '/artworks/david-law-crypto-nick-cave-vi/detail-hand-thumb.webp',   width: 320,  height: 768, role: 'detail',    alt: 'Detail van de opgestoken hand' },
    { src: '/artworks/david-law-crypto-nick-cave-vi/signature.webp',     thumb: '/artworks/david-law-crypto-nick-cave-vi/signature-thumb.webp',     width: 493,  height: 213, role: 'signature', alt: 'Handtekening van David Law' },
  ],
}
```

Note: the supplied main image is only 369×751 px. It's fine for tiles but soft on large screens. In the `SpotlightFrame`, cap its display height at its intrinsic height × 1.25 so it never upscales badly. Ask for high-res files (docs/08 Q4).

```ts
// src/lib/data/artists.ts
{
  slug: 'david-law',
  name: 'David Law',
  basedIn: 'Parijs',
  shortBio: 'Fotograaf uit Parijs die iconen uit de rockmuziek herbouwt uit duizenden foto\'s.',
  bio: [
    // TODO: replace with the official bio once received (docs/08 Q1).
    // Until then keep it to facts we can see in the material. Do not invent biography.
    'David Law is een fotograaf gevestigd in Parijs. In zijn Crypto Rock Special Series reconstrueert hij portretten van muzikanten uit honderden foto\'s van de afgebeelde artiest zelf.',
  ],
  isDemo: false,
}
```

## Auctions (`src/lib/data/auctions.ts`)

| Slug | Artwork | State | Start | Seed bids | endsInMs |
|---|---|---|---|---|---|
| `crypto-nick-cave-vi` | CR-0001 (real) | live | €400 | 6 bids up to €850 | 1d 14h 22m |
| `demo-veiling-2` | placeholder D-07 | live | €200 | 3 bids up to €340 | 5h 10m |
| `demo-veiling-3` | placeholder D-10 | binnenkort | €300 | none | starts in 3 days |
| `demo-veiling-4` | placeholder D-13 | live | €600 | 4 bids up to €875 | 42m (shows the under-one-hour format) |
| `demo-veiling-5` | placeholder D-16 | live | €250 | 2 bids up to €310 | 2d 6h |
| `demo-veiling-6` | placeholder D-20 | live | €150 | 5 bids up to €275 | 3h 45m |

Five live lots with staggered end times make the "Sluit binnenkort" row on the home page look like a busy auction house.

For all lots: `bidIncrementEur: 25` below €1,000 and 50 above, `buyerFeePct: 9`. Each lot has an internal `reservePriceEur` (never displayed as an amount): `reserveMet` is `false` until a bid reaches it. Reserves: CR-0001 €900 (docs/08 Q3), D-07 €400, D-13 €1.000, D-16 €350, D-20 €300, D-10 €450. Add `reservePriceEur: number` and `startsInMs?: number` (for `binnenkort` lots) to `AuctionLot`.

**All amounts are demo values** (docs/08 Q3). Bidder labels are random four-digit numbers, for example "Bieder 4821".

## Placeholder works (23)

All have `isDemo: true`, invented artists, abstract generated SVG images and the "Demo-werk" badge. Eight invented artists, so the marketplace feels populated and David Law is clearly one artist among many. The names are invented and are not meant to refer to real people.

| ID | Artist (invented) | Title | Year | Technique / support | Size (cm) | Ratio | Status | Price |
|---|---|---|---|---|---|---|---|---|
| D-01 | Lotte Vanderzande | Getijde I | 2022 | Acryl op doek | 80×100 | 4:5 | te koop | €1.450 |
| D-02 | Lotte Vanderzande | Getijde II | 2022 | Acryl op doek | 80×100 | 4:5 | verkocht | €1.450 |
| D-03 | Milan Okafor-Peeters | Stille kamer | 2024 | Olie op paneel | 40×40 | 1:1 | te koop | €980 |
| D-04 | Milan Okafor-Peeters | Noordlicht, Oostende | 2023 | Olie op doek | 120×90 | 4:3 | op aanvraag | — |
| D-05 | Inès Marrot | Fragment 12 | 2021 | Gemengde techniek op papier | 50×70 | 5:7 | te koop | €640 |
| D-06 | Inès Marrot | Fragment 19 | 2021 | Gemengde techniek op papier | 50×70 | 5:7 | te koop | €640 |
| D-07 | Ward Stoffels | Zonder titel (blauw) | 2020 | Zeefdruk, oplage 30 | 70×100 | 7:10 | veiling | — |
| D-08 | Ward Stoffels | Raster 3 | 2025 | Zeefdruk, oplage 20 | 50×50 | 1:1 | te koop | €420 |
| D-09 | Yuna Breckx | Hoogwater | 2024 | Fotografie, pigmentprint op dibond | 60×120 | 1:2 | te koop | €1.900 |
| D-10 | Yuna Breckx | Laagwater | 2024 | Fotografie, pigmentprint op dibond | 120×60 | 2:1 | veiling (binnenkort) | — |
| D-11 | Lotte Vanderzande | Getijde III | 2025 | Acryl op doek | 100×150 | 2:3 | te koop | €2.600 |
| D-12 | Noor El Amrani | Woestijnkleur 1 | 2023 | Olie op doek | 90×90 | 1:1 | te koop | €1.750 |
| D-13 | Noor El Amrani | Woestijnkleur 2 | 2023 | Olie op doek | 90×90 | 1:1 | veiling | — |
| D-14 | Noor El Amrani | Middaghitte | 2025 | Olie op doek | 140×100 | 7:5 | te koop | €3.200 |
| D-15 | Pieter-Jan Lauwers | Haven, 05:40 | 2022 | Fotografie, zilvergelatinedruk | 40×50 | 4:5 | te koop | €750 |
| D-16 | Pieter-Jan Lauwers | Dok 7 | 2023 | Fotografie, pigmentprint, oplage 7 | 100×70 | 10:7 | veiling | — |
| D-17 | Pieter-Jan Lauwers | Mist over de Schelde | 2024 | Fotografie, pigmentprint op dibond | 150×100 | 3:2 | op aanvraag | — |
| D-18 | Sanne Dewulf | Lijnstudie 4 | 2024 | Inkt op papier | 30×40 | 3:4 | te koop | €290 |
| D-19 | Sanne Dewulf | Lijnstudie 9 | 2024 | Inkt op papier | 30×40 | 3:4 | verkocht | €290 |
| D-20 | Sanne Dewulf | Wolkenatlas | 2025 | Houtskool op papier | 70×100 | 7:10 | veiling | — |
| D-21 | Ward Stoffels | Raster 5 | 2025 | Zeefdruk, oplage 20 | 50×50 | 1:1 | te koop | €420 |
| D-22 | Inès Marrot | Fragment 23 | 2022 | Gemengde techniek op papier | 50×70 | 5:7 | te koop | €690 |
| D-23 | Milan Okafor-Peeters | Atelier, winter | 2025 | Olie op paneel | 30×40 | 3:4 | te koop | €850 |

The three new artists get their own generator styles, so each artist still reads as a series: Noor El Amrani warm arcs and discs, Pieter-Jan Lauwers monochrome stepped greys, Sanne Dewulf fine drawn lines on paper.

Each placeholder artist gets a one-paragraph invented bio that ends with "(Demo-kunstenaar)". Each placeholder work gets a two-sentence invented description.

Featured on home: CR-0001 (the featured lot in the hero, framed as one lot among many), then D-11, D-14, D-09, D-15 in the Uitgelicht row.
