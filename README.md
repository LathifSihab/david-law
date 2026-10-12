# Kunstkamer — Demo Plan (Carl Reymen art platform)

Planning pack for a **free first demo** of a Catawiki-inspired art marketplace for Carl Reymen.
Built to be executed step by step with **Claude Code**.

**Deadline:** Wednesday 14 October 2026
**Stack:** SvelteKit 2 + Svelte 5 + Tailwind CSS v4, fully static (prerendered), deployed to Vercel
**Theme:** dark gallery
**UI language:** Dutch, with all copy in one dictionary so English can be added later
**Data:** 1 real artwork (David Law) + placeholder works clearly marked as demo

## What's in this folder

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project rules for Claude Code. Copy it to the root of the new repo. |
| `docs/01-scope.md` | What the demo is, what's in, what's out, and why |
| `docs/02-design-system.md` | Colours, type, spacing, components, motion |
| `docs/03-data-model.md` | Artwork/artist/auction types, Excel column mapping, seed data |
| `docs/04-pages.md` | Page-by-page spec with layout and behaviour |
| `docs/05-copy-nl.md` | All Dutch UI copy, ready to drop into the dictionary |
| `docs/06-tasks.md` | Ordered build tasks with acceptance criteria, ready to paste into Claude Code |
| `docs/07-privacy-and-content.md` | What must never be published, and data handling rules |
| `docs/08-open-questions.md` | Things to confirm with Dries/Carl, with the default used meanwhile |
| `assets/artworks/david-law-crypto-nick-cave-vi/` | Optimised WebP images of the real work, plus thumbnails |

The certificate of authenticity scan was **deliberately left out** of `assets/` (see `docs/07`).

## How to run this with Claude Code

1. Create an empty folder for the project and `cd` into it.
2. Copy `CLAUDE.md`, the `docs/` folder and the `assets/` folder into it.
3. Start Claude Code and say:
   > Read CLAUDE.md and everything in docs/. Then do Task 1 from docs/06-tasks.md. Stop after each task so I can check it.
4. Continue task by task: "Do Task 2", "Do Task 3", and so on.
5. Before sending the link, run through the demo checklist at the end of `docs/06-tasks.md`.

Going one task at a time is slower than "build everything", but it keeps each step reviewable and lets you course-correct before the next one builds on it.

## Time budget (Mon afternoon → Wed)

| When | Tasks |
|---|---|
| Monday | 1–3: setup, design tokens, data + layout shell |
| Tuesday | 4–7: home, catalogue, artwork detail, artist page |
| Wednesday morning | 8: auction lot. 9 (admin import mock) only if ahead of schedule |
| Wednesday midday | 10: polish, mobile pass, deploy, checklist |
