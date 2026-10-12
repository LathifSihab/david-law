# 07 — Privacy and content rules

Carl explicitly wrote: *"Sommige info is niet voor publicatie"* (some information is not for publication). A demo link gets forwarded, so treat everything as potentially public.

## Never publish (not on the page, not in the HTML source, not in `static/`)

| Item | Where it came from | Why |
|---|---|---|
| The certificate of authenticity scan (PDF or image) | `CoA David Law ... .pdf` | Contains the artist's signature in reusable form, plus official registration numbers |
| The artist's SIRET number, AGESSA number and Insee registration | The certificate | Official business/author registration identifiers of a private person |
| Gmail URLs or other metadata from the certificate PDF | PDF footer | Points to Carl's mailbox |
| Carl's phone number and email address | Email thread | Personal contact data. Use the placeholder in `config.ts` |
| Purchase prices, margins, owner/provenance notes | Future Excel | Commercial and private |
| Any field Carl marks as internal | Future Excel | Ask when unsure |

The certificate PDF was **intentionally not copied** into `assets/`. If it ever shows up in the repo, delete it.

## Allowed to publish

- Title, artist name, series, year, technique, support, dimensions, edition information
- The public description (rewritten from Carl's .docx into fluent Dutch, adding no new claims)
- The fact that a certificate of authenticity is included, as text only
- The five supplied images of the work, including the signature detail (the signature as it appears on the artwork is part of the work's documentation). If Carl prefers not to show the signature crop, remove that one image (docs/08 Q7).

## Artist bio rule

Don't invent biographical facts about real people. For David Law, only use what can be seen in the material Carl sent (based in Paris, photographer, the Crypto Rock series concept) until an official bio arrives.

## Placeholder content rule

- Invented artists and works only, all marked `isDemo: true` with visible badges.
- Abstract generated images only. No stock photos of artworks, no images of other real artists' work, no AI imitations of a recognisable artist's style.

## Subject of the real work

The David Law work portrays a real, well-known musician (Nick Cave). That's fine for a listing of an existing artwork. Don't add marketing copy that implies endorsement by or affiliation with Nick Cave, and don't use his name in the brand, navigation or headlines beyond the artwork's own title.

## Data handling in the demo

- The inquiry form and the bid form keep data only in component state. No `fetch`, no storage, no analytics.
- No third-party scripts, trackers or embeds. Fonts are self-hosted.
- The admin Excel import (if built) reads the file in the browser only and never uploads it.
