# 08 — Open questions

Send these to Dries (or Carl) on Monday. For each one, the demo uses the **default** shown, so building is never blocked. Update the data when answers come in.

| # | Question | Why it matters | Default used in the demo |
|---|---|---|---|
| Q1 | **The email mentions Andrea Giorgi, but the folder contains a David Law work and no bio.** Was the wrong folder sent? Is there a Giorgi folder and a bio coming? | The artist page needs a real bio, and Carl may expect to see Giorgi | Build with David Law and a minimal factual bio. If Giorgi material arrives, add Giorgi as a second real artist (same data shape) |
| Q2 | Year of the work: the description text says **April 2023**, the spec sheet in the same .docx says **2022**, and the certificate says **Paris, 2024** | A wrong year on an artwork page looks careless to an art seller | 2023 (creation date in the description text; the certificate may show the year the certificate was issued) |
| Q3 | Should the David Law work appear **as an auction lot** in the demo, and if so with what starting bid? Or as a fixed-price work? | Showing a real work with fake bids might bother Carl or the artist | Auction lot with clearly demo amounts (start €400, current €850, reserve €900), because it shows off the Catawiki feel best. Switching it to `te-koop` or `op-aanvraag` is a one-line data change |
| Q4 | Can we get **high-resolution images** (2000px+ on the long side)? | The supplied main image is only 369×751 px, which looks soft in the hero on large screens | Use what we have and cap upscaling at 1.25× |
| Q5 | Shipping, returns and buyer's fee policy | The trust row and bid fine print mention them | "Verzekerd verzonden", "14 dagen bedenktijd" and a 9% buyer's fee, all as demo copy. Note: in the EU, the right of withdrawal can work differently for public auctions, so get real policy text before going live |
| Q6 | Formal "u" or informal "je" in the copy? | Tone of the whole site | "je" (as Catawiki does). It's a find-and-replace in `nl.ts` |
| Q7 | OK to show the **signature detail** image publicly? | Some sellers prefer not to publish signatures | Shown, as the 5th gallery image |
| Q8 | Brand name and logo | The quote talks about "eigen branding" (own branding) | Working name "Kunstkamer" with a typographic wordmark, both swappable in `config.ts` |
| Q9 | Can Carl share **the Excel file** (or 5–10 rows of it), even without images? | Real data would replace placeholders and validate the column mapping in docs/03 | 11 placeholder works marked as demo |
| Q10 | Which fields in the spec files are "niet voor publicatie" (not for publication), exactly? | Avoid publishing private data from future files | Everything listed in docs/07 is treated as private |
| Q11 | **Internal (our team):** which items from the quote must be *visible* in Wednesday's preliminary demo? The plan is based on the six-phase summary in docs/01; the full quote hasn't been checked line by line yet | It's the second-biggest pending quote; the demo should preview what Carl is paying for | Phase 2 (catalogue and UX) in full, a working glimpse of phase 4 (auctions), and the Excel import mock if time allows. Later phases are mentioned as "coming in later phases" |
| Q12 | **Positioning (resolved 12 Oct 2026):** a Catawiki-style multi-artist marketplace, with David Law as one of many artists, not his own website | Shapes the home page and the inventory size | Applied in docs/01, 03, 04, 05 and Task 3b |
| Q13 | The spec sheet in the description .docx lists **height 60 cm, width 90 cm**, the title **"Crypto Nick Cave VI XXL"** and **"Aantal items: 8"** | The image is portrait, so height and width look swapped; "XXL" isn't on the certificate; 8 is probably the edition size, not the number of items in this lot | 60 wide × 90 high (matches the image), title without "XXL" as on the certificate, "Aantal items" not shown. Depth 2 cm, weight 4 kg, condition "Uitstekend", country "Frankrijk" and "Rechtstreeks van de kunstenaar" are shown as given |

## Message to send (Dutch, ready to paste)

> Hoi Dries,
>
> We zijn gestart met de demo voor Carl. Een paar korte vragen zodat alles klopt:
>
> 1. In de mail staat Andrea Giorgi, maar de map bevat een werk van David Law (Crypto Nick Cave VI) en geen bio. Komt de info over Giorgi nog, of is het David Law?
> 2. Het jaartal: de beschrijving zegt april 2023, de specificatietabel 2022 en het certificaat Parijs 2024. Welk jaartal mogen we tonen?
> 3. Mogen we dit werk in de demo als veilingkavel tonen (met fictieve biedingen), of liever met een vaste prijs?
> 4. Zijn er foto's in hoge resolutie beschikbaar?
> 5. Kan Carl al een deel van zijn Excel-bestand delen (5–10 rijen is genoeg)?
> 6. In de specificatietabel staan hoogte 60 en breedte 90 cm, maar het werk is staand. Klopt 60 breed × 90 hoog? En heet het werk "Crypto Nick Cave VI" of "Crypto Nick Cave VI XXL"?
> 7. Welke info is precies niet voor publicatie? We tonen alvast geen certificaat en geen registratienummers.
>
> Voor alles wat nog niet duidelijk is, gebruiken we in de demo voorlopig een tijdelijke invulling, zodat we gewoon verder kunnen bouwen.
>
> Bedankt!
