# KUMASA Website — Design Spec

**Date:** 2026-10-28
**Status:** Approved for planning

## 1. Purpose

A modern, static marketing and identity website for **KUMASA — Kuntaw Unified
Martial Sports Advocates**, a Filipino martial arts organization founded in
2015.

The site exists to establish credibility and awareness. A visitor should come
away knowing who KUMASA is, what it does, and how to reach it, after browsing
a gallery of the organization's activities.

**Primary visitor action:** learn about the organization.
**Secondary action:** get in touch.

This is a site about the *organization*, not an instructional resource about
Kuntaw as a martial art.

### Success criteria

- A first-time visitor can state what KUMASA is within 10 seconds of landing.
- The gallery is browsable on mobile and desktop without layout breakage.
- An officer with no coding background can add a news post or gallery album by
  editing one Markdown file.
- The site builds to a static export deployable on free hosting.

### Known at spec time

- Organization name, tagline ("Filipino Martial Art"), founding year (2015),
  and logo are real, supplied by the user.
- All body copy, officer names, club data, news posts, and gallery photos are
  **placeholder** and will be replaced by the user.

## 2. Architecture

A hybrid structure: a content-rich home page for storytelling, with dedicated
pages where content will grow.

### Routes

| Route | Contents |
|---|---|
| `/` | Hero, about preview, what KUMASA does, officers, gallery preview (6 images), latest news (3 posts), contact CTA |
| `/about` | Full organization story, mission, history timeline, officers grid |
| `/gallery` | Album-filterable image grid with lightbox viewer |
| `/news` | List of all news posts |
| `/news/[slug]` | Individual news post |
| `/contact` | Contact details, location placeholder, social links, contact form |

### Content model

Content lives as Markdown and data files in the repository. There is no
database and no CMS; editing a file and pushing updates the site.

```
content/
  site.md           # org name, tagline, contact details, social links
  about.md          # full story, mission
  timeline.yml      # history entries: { year, title, description }
  officers.yml      # officers: { name, role, photo, bio }
  albums/
    <album>.md      # album title, description, ordered image list
  news/
    YYYY-MM-DD-<slug>.md   # title, date, excerpt, cover, body
public/images/      # all site imagery, including real photos when supplied
assets/             # source assets (logo)
```

Officers, timeline entries, and albums are structured data files so adding an
entry is a data edit, never a code change.

Content is read and parsed at build time. News post routes are generated via
`generateStaticParams`.

### Components

Each component lives in its own file under `components/`, with one clear
responsibility:

- `Header` — sticky compact nav; slide-in menu under 768px
- `Hero` — full-viewport opening with logo, name, tagline
- `SectionHeading` — heading with Baybayin rule motif
- `ImageSlot` — renders a real image when present, a styled placeholder when not
- `OfficerCard` — portrait, name, role
- `GalleryGrid` — responsive masonry-style grid with album filter
- `Lightbox` — keyboard-navigable full-screen image viewer
- `NewsCard` — cover, title, date, excerpt
- `TimelineList` — vertical history timeline
- `ContactSection` — details, socials, form
- `Footer` — logo mark, nav, copyright

`ImageSlot` is the isolation boundary for the placeholder strategy: swapping
placeholders for real photos is a content change, never a layout change.

## 3. Visual design

Derived directly from the KUMASA badge logo.

### Color tokens

| Token | Value | Use |
|---|---|---|
| `--color-base` | `#0A0A0A` | Page background |
| `--color-surface` | `#141414` | Cards, raised surfaces |
| `--color-text` | `#F5F5F5` | Body text |
| `--color-muted` | `#A3A3A3` | Secondary text |
| `--color-accent` | `#D01C1F` | Primary accent, CTAs (logo red) |
| `--color-gold` | `#F2C300` | Secondary accent, highlights (logo yellow) |
| `--color-blue` | `#1B3FA0` | Tertiary accent, used sparingly (logo blue) |

Dark-only. A light mode would fight the black badge and is explicitly out of
scope.

### Typography

- **Display:** `Oswald` (Google Fonts) for headings — condensed, echoing the
  KUMASA wordmark's weight and compression.
- **Body:** `Inter` (Google Fonts) for body text and UI.
- Both loaded via `next/font/google`, self-hosted at build time.
- Large headings, generous line height, wide gutters.

### Logo motifs

Used sparingly so the design reads as refined rather than busy:

- The white star as a section divider and list bullet.
- The Baybayin script line as a subtle rule beneath section headings.
- A faint splatter texture behind the hero only.

### Motion

Fade-and-rise on scroll entry; smooth lightbox open/close. Nothing bouncing or
looping. All motion respects `prefers-reduced-motion`.

### Responsive

Mobile-first. Single column under 768px. Header collapses to a compact bar with
a slide-in menu.

### Accessibility

- WCAG 2.1 AA contrast on all text and interactive elements.
- Lightbox and mobile menu fully keyboard-navigable, with focus trapping and
  Escape to close.
- Alt text on every image, including placeholder slots.
- Semantic landmarks and a visible focus ring throughout.

## 4. Technical approach

- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4.
- **Output:** `output: 'export'` — a fully static site. No server, no database.
- **Content parsing:** `gray-matter` for frontmatter, `remark` for Markdown to
  HTML, `yaml` for data files. All at build time.
- **Images:** `next/image` with `unoptimized: true`, required for static export.
- **Contact form:** posts to a third-party form endpoint (Formspree or similar),
  configured via an environment variable; falls back to a `mailto:` link when
  unset. No backend.

### Error handling

- A missing or malformed content file fails the build with a clear message
  naming the file — content errors surface at build time, never at runtime.
- `ImageSlot` renders its styled placeholder whenever an image path is absent.
- A `not-found` page covers unknown routes, including bad news slugs.

### Testing

Test-driven, per the superpowers workflow.

- **Vitest + React Testing Library:** content-layer parsing (frontmatter, data
  files, sorting, slug generation) and component rendering, including
  `ImageSlot` placeholder behavior and `Lightbox` keyboard handling.
- **Playwright smoke suite:** each route loads; nav works; lightbox opens,
  advances, and closes; mobile menu toggles.
- **Build verification:** `npm run build` must produce a clean static export,
  with lint and typecheck passing, before any completion claim.

### Deployment

Static output in `out/`, deployable to Vercel, Netlify, or GitHub Pages. The
README documents the build and deploy steps and how to replace placeholder
content.

## 5. Out of scope

- Light mode.
- Membership registration, login, or any authenticated area.
- A CMS or admin interface.
- E-commerce or payments.
- Multi-language content (English only).
- Event registration or tournament results systems.
