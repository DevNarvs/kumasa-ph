# KUMASA website

Website for **KUMASA — Kuntaw Unified Martial Sports Advocates**, a Filipino martial arts organisation founded in 2015.

It is a static site built with Next.js (App Router), TypeScript and Tailwind CSS. All content lives in Markdown and YAML files in `content/`, so updating the site means editing a file, not code.

> **Status:** every page is built in the dark cinematic design. The text is sample copy and every photo is a dark placeholder frame. See [Before launch](#before-launch) for everything to replace.

## Design

- **Look:** black ground, light type and the badge's red as the one accent.
- **Hero:** a full-screen photo that opens out of a circle, with KUMASA set huge in Archivo.
- **Motif:** the round badge is the frame that photos are cut into (events, gallery strip, news, officers).
- **Join section:** a red field that closes every page. Visitors can type their name there and see it in Baybayin, as on the badge.
- **References:** the spec is `docs/superpowers/specs/2026-10-28-kumasa-dark-cinematic-design.md`, and the approved mockup is `docs/superpowers/mockups/kumasa-dark.html`.

## Requirements

- Node.js 22 or newer
- npm

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server at http://localhost:3000 |
| `npm run build` | Build the static site into `out/` |
| `npm run test` | Run the unit tests (Vitest) |
| `npm run e2e` | Run the browser tests (Playwright) against `out/`; run `npm run build` first |
| `npm run lint` | Lint |
| `npm run typecheck` | Type-check |

## Editing content

Every file below is read at build time. A missing required field stops the build with a message naming the file.

### Organisation details — `content/site.md`

Front matter only:
- `name`, `fullName` and `tagline`
- `founded` (a year)
- `description`: one sentence, shown under the big name on the home page
- `heroImage` and `heroAlt`: the full-screen home photo and its description
- `email`, `phone` and `address`
- `socials`: a list of `label` and `url`

### About page — `content/about.md`

Front matter:
- `title` and `excerpt` (the short introduction)
- `statement`: the "One home for Kuntaw" heading
- `facts`: short chips, at most 32 characters each
- `programmesIntro`: the sentence beside the Programmes heading
- `activities`: the four programme panels on the home page. Each has:
  - `title` and `description`
  - `word` (at most 8 characters) and `detail` (at most 24 characters)
  - `href`: where the panel links
  - `image`: the panel photo

The Markdown body is the full story.

### Events — `content/events.yml`

A list of events, each with:
- `date` (`YYYY-MM-DD`), `title`, `venue` and `detail`
- an optional `main: true`, for the one headline event (at most one)
- an optional `image`, the round photo shown on the main event

Events dated before the build date are hidden, so rebuild the site after an event has passed. With no upcoming events, the home page says "No events announced yet."

```yaml
- date: 2026-11-15
  title: National Open
  venue: Cebu City Sports Center
  detail: Sparring and forms, all divisions
  main: true
  image: /images/events/national-open.jpg
```

### History — `content/timeline.yml`

A list of entries with `year`, `title` and `description`. Entries are shown oldest first.

### Officers — `content/officers.yml`

A list of officers with `name`, `role`, `bio` and an optional `photo` (a path under `public/`, for example `/images/officers/juan.jpg`).

### Gallery albums — `content/albums/<album>.md`

One file per album; the file name is the album's id. Front matter: `title`, `description`, and `images`, a list of `src` and `alt`. Put the photos in `public/images/` and reference them as `/images/...`. Every image needs `alt` text describing it. An album with no images shows "No photos yet".

```yaml
---
title: Tournaments
description: Photos from KUMASA tournaments.
images:
  - src: /images/gallery/open-2026-01.jpg
    alt: Two competitors bowing before a sparring match
---
```

### News — `content/news/YYYY-MM-DD-<slug>.md`

Front matter: `title`, `date` (`YYYY-MM-DD`), `excerpt` and an optional `cover` image path. The body is the article in Markdown. Posts are listed newest first; the file name (without `.md`) is the post's address, for example `/news/2026-03-15-regional-open`.

## Swapping a dark frame for a real photo

Each photo slot is a path in `content/`, pointing at a placeholder in `public/images/placeholder/`.
1. Put the real photo in `public/images/`.
2. Change the path in the content file.

No code changes are needed. Round slots crop to a circle and wide slots crop to fill their panel, so keep the subject near the centre.

## Before launch

Replace this sample content with KUMASA's own:
- **`content/site.md`:**
  - email, phone, address and social links;
  - `heroImage` (the full-screen home photo).
- **`content/about.md`:**
  - the excerpt, facts, programme descriptions and the story;
  - the four programme `image` paths.
- **`content/events.yml`:** every event is a sample (National Open, Black belt grading, Coaches' seminar, Visayas inter-club meet).
- **`content/news/`:** all three posts are samples ("Team named for the National Open", "New club opens in Bacolod", "Referee course dates announced").
- **`content/timeline.yml`:** the 2018 and 2022 milestones are samples.
- **`content/officers.yml`:** names ("Name to be confirmed"), bios and photos.
- **`content/albums/`:** every image is a placeholder frame, and the Seminars album is empty.

## Contact form

The contact page shows a form when `NEXT_PUBLIC_FORM_ENDPOINT` is set to a form service URL that accepts a JSON `POST` (for example a Formspree form). Without it, the page shows an email link instead. Copy `.env.example` to `.env.local` to set it locally, and set the same variable in your hosting provider before building.

## Deploying

`npm run build` writes a complete static site to `out/`. Upload that folder to any static host:

- **Vercel:** import the repository; it detects Next.js and builds automatically.
- **Netlify:** build command `npm run build`, publish directory `out`.
- **GitHub Pages:** publish the contents of `out/` and add an empty `.nojekyll` file, or GitHub's Jekyll step will drop the `_next/` folder. If the site is served from a sub-path (`https://<user>.github.io/<repo>/`), set `basePath` in `next.config.ts` to `/<repo>` before building.

## Project layout

```
app/          pages (routes)
components/   React components
content/      the site's content (edit these)
lib/          content loading, Baybayin transliteration, helpers
public/       images and other static files
tests/        unit tests; tests/e2e/ holds the browser tests
docs/         design spec and implementation plans
```
