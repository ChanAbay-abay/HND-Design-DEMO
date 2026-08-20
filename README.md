# HND Design + Build — Demo

Client-facing Next.js demo for **HND Design + Build**, a Cebu-based architectural
design + build firm. Built from the Iridel Demo Template. Cold-pitch demo — HND has
no existing website, only a Facebook page — so the goal is to show what real online
presence looks like for their portfolio.

**Stack:** Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript · Radix UI · Lenis (smooth scroll) · GSAP

Full brand/content brief, stats, and copy source: [`PRD.md`](./PRD.md).
Build conventions (per-client customization rules, component list, workflow): [`CLAUDE.md`](./CLAUDE.md).

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Site map

| Route | What it is |
| --- | --- |
| `/` | Home — hero, studio intro, services, sketches, showcase, gallery teaser, footer |
| `/about` | Firm statement, mission/vision, team, showcase |
| `/gallery` | Portfolio index (floating wall grid of all houses) |
| `/gallery/[slug]` | Individual project page — hero, info, image gallery |
| `/contact` | Contact hero, address, details, parallax section |

Each route has its own `_sections/` folder (all copy inline in the section file that
renders it — see `CLAUDE.md` for the convention). Gallery project data lives in
`src/app/gallery/_data/houses.ts`.

---

## Known gaps before this goes to the client

- **Team bios are placeholders** — `src/app/about/_sections/team.tsx` still has a
  `TODO` for real team member names, titles, and photos. Needs real info from HND.
- **Formatting** — `npm run format:check` currently flags 10 files (mostly the
  animation-heavy components: `zoom-parallax.tsx`, `sketch-reveal.tsx`,
  `animated-slideshow.tsx`, plus a few section files). Run `npm run format` before
  final delivery.
- Typecheck and lint are clean.

Run the full delivery check:

```bash
npm run validate                # typecheck + lint + format:check
grep -r "placeholderImg" src/   # should be empty — currently still referenced in
                                 # component defaults (image-card, hero-section,
                                 # feature-row, testimonial-section, lib/images.ts);
                                 # confirm no page actually calls it with real content
grep -r "TODO" src/             # team.tsx — see above
```

---

## Notable custom pieces (not in the base template)

These live in `src/components/ui/` and `src/lib/` and were added specifically for
this demo — don't assume they exist in a fresh template checkout:

- `zoom-parallax.tsx` — scroll-pinned zoom effect (hero image sequence)
- `animated-slideshow.tsx`, `circular-gallery.tsx`, `parallax-floating.tsx`,
  `sketch-reveal.tsx` — portfolio/gallery motion pieces
- `lib/lenis.ts` — smooth-scroll wrapper (Lenis), wired in `layout.tsx`
- `components/common/page-transition.tsx` — route transition wrapper

If you're extending this demo for another client, decide per-component whether these
belong back in the shared template or are one-off for HND.

---

## Assets

`public/images/` is organized in subfolders for this project (`hnd_photos/`,
`hnd_sketches/`, `renders/`, `hero-zoom-complete/`) — this diverges from the base
template's "flat, no subfolders" rule because of the volume of client-supplied
photography and renders. Source PDF (`2026 - HND Design Build - Company Profile and
Design Portfolio - 1.pdf`) is gitignored — client material only, not committed.

---

## Scripts

```bash
npm run dev           # dev server
npm run build          # production build
npm run validate       # typecheck + lint + format check (run before delivery)
npm run lint            # ESLint
npm run lint:css        # Stylelint
npm run format          # Prettier (write)
npm run typecheck       # TypeScript
```
