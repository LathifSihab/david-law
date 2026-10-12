# 01 — Scope

## Context

Carl Reymen wants a platform with his own branding, inspired by Catawiki, to sell roughly 150–200 artworks that he currently keeps in an Excel file, with a spec/description file per work. The quote covers six phases:

1. Security and technical backend
2. User experience and catalogue
3. Secure transactions
4. Auctions
5. Fraud prevention
6. Dashboard with data and reporting

Carl can start small (marketplace first) and add auctions later.

**This demo is free.** Its only job is to give Carl a convincing first impression of phase 2 (UX and catalogue), with a glimpse of phase 4 (auctions) and of the Excel import idea. It is not the start of the production codebase. If it turns out reusable, that's a bonus, not a goal.

## Goal of the demo

When Carl opens the link, he should think: *"This is my platform, with my artworks, and it looks more premium than Catawiki."*

## In scope

| # | Page / feature | Why |
|---|---|---|
| 1 | Home | First impression, brand feel, featured works, auction teaser |
| 2 | Catalogue (`/collectie`) with filters and sorting | Shows that 150–200 works will be easy to browse |
| 3 | Artwork detail (`/collectie/[slug]`) | The heart of the platform, built from Carl's real spec sheet |
| 4 | Artist page (`/kunstenaars/[slug]`) | Makes it feel like a real gallery |
| 5 | Auctions overview (`/veilingen`) and auction lot (`/veilingen/[slug]`) with countdown and mock bidding | The "Catawiki feel" and a preview of phase 4 |
| 6 | Demo banner and demo toasts | Honest framing, nothing pretends to be live |
| 7 | *(Stretch)* Admin Excel import mock (`/admin/import`) | Visualises the Excel pipeline that's in the quote |

## Out of scope (mention as "coming in later phases" if Carl asks)

- Accounts, login, registration, KYC
- Real payments, Klarna, invoices, VAT
- Real bidding engine, websockets, anti-sniping rules
- Fraud prevention, moderation
- Seller dashboard, reporting, analytics
- Email/notification system
- CMS or real database
- SEO work beyond basic meta tags
- Multi-language switching (structure is ready, content isn't)

## Success criteria

- [ ] All in-scope pages work on mobile and desktop, with no console errors
- [ ] The David Law work is shown with all its public details and five images
- [ ] The catalogue feels full: 1 real work plus 11 placeholder works, all placeholders marked as demo
- [ ] Filters, sorting and search work on the client side
- [ ] The auction countdown is live and placing a bid visibly updates the lot
- [ ] No private data from `docs/07` appears anywhere, including in the HTML source
- [ ] Lighthouse performance score of 90 or higher on mobile for home and detail pages
- [ ] Deployed to a shareable URL by Wednesday
