# KUMASA website

Website for **KUMASA — Kuntaw Unified Martial Sports Advocates**, a Filipino martial arts organisation founded in 2015.

It is a static site built with Next.js (App Router), TypeScript and Tailwind CSS. All content lives in Markdown and YAML files in `content/`, so updating the site means editing a file, not code.

> **Status:** the pages and features work, and all text and pictures are placeholders. A visual redesign is in progress (see `docs/superpowers/`). Search the project for `[Placeholder]` to find everything that still needs real content.

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

Front matter only: `name`, `fullName`, `tagline`, `founded` (a year), `email`, `phone`, `address`, and `socials` (a list of `label` and `url`).

### About page — `content/about.md`

Front matter: `title`, `excerpt` (the short introduction), `statement`, and `activities`. Each activity has `title`, `description`, `word` (one word, at most 8 characters) and `detail` (a short fact, at most 24 characters). The Markdown body is the full story.

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
