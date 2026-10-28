# KUMASA Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the KUMASA site to the "colour chapters" direction and add the Baybayin name-writer, finishing the contact page, e2e suite and README the first plan left open.

**Architecture:** The content layer, routes and static export stay. Pages are rebuilt from full-bleed `Field` sections (one tone each) and a small set of chapter components; the page's first field carries the `Header`, so the header takes that field's colours. Old components are deleted once nothing uses them.

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4, Vitest + React Testing Library, Playwright, `serve`, Pillow (artwork conversion only). Node 22.

**Spec:** `docs/superpowers/specs/2026-10-28-kumasa-redesign-design.md` (direction sheet: `2026-10-28-kumasa-direction-sheet.md`). Supersedes tasks 8 and 9 of `2026-10-28-kumasa-website.md`; tasks 1–7 of that plan are done.

## Global Constraints

- Palette exactly: red `#D01C1F`, blue `#1B3FA0`, yellow `#F2C300`, black `#0A0A0A`, paper `#F5F5F5`, white `#FFFFFF`. Black on red is display size only (24px or larger); running text on red is white.
- Fonts via `next/font/google`: Red Hat Display 900 (display, uppercase, tracking −0.03em, leading 0.92), Red Hat Text 400/500 (body 18–20px, leading 1.5), Noto Sans Tagalog (Baybayin glyphs only). At most five size steps.
- One pair of equal outer margins `clamp(20px, 2.8vw, 40px)`; fields are full-bleed, at least 90svh tall on desktop, butted with no gap or divider. One radius: square. One button shape: filled, square, 44px or taller.
- Banned (the inspector measures them): eyebrow labels, tiny uppercase tracked labels, emoji, monospace, index numbering, thin rules, outlined boxes, gradients, shadows at rest, glass, icon-topped cards, rows of identical cards, styled accent words. Every section has a heading; one `h1` per page on the first screen; headlines are two lines or fewer at every width.
- Motion uses transform and opacity only, has a `prefers-reduced-motion` fallback, and never hides content if script fails.
- Existing 52 tests stay green at every commit; a test that asserts a replaced chapter is rewritten in the same task as that chapter.
- All text content is placeholder unless it is the real name, full name, tagline, founding year or badge; placeholder strings keep the `[Placeholder]` marker.
- Inspector tooling: `node $TASTE/scripts/inspect.mjs <url>` with `TASTE=/home/user/leonxlnx/taste-skill/skills/taste-skill` (re-clone `GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/Leonxlnx/taste-skill` and check out `12af471` if missing) and `CHROME_PATH` set to a script that runs `/opt/pw-browsers/chromium --no-sandbox "$@"`. Inspect the production build served over HTTP, never a `file://` page.

## Review Focus

1. Name-writer with empty, whitespace-only, emoji, digit and 200-character input: never blank, never throws, long output wraps (Task 7).
2. Contrast of every tone's ink against its ground, and no black body text on red (Task 3).
3. Home chapters with no news, no gallery images or no activities: render an empty state or omit the chapter, never crash (Tasks 8, 9).
4. Headline and hero content visible with no script and under reduced motion (Task 13).
5. Long email, address and phone strings in the contact rows at 390px: no horizontal scroll (Tasks 9, 15).

---

### Task 1: Content fields for the new design

**Files:**
- Modify: `lib/content.ts`, `tests/content.test.ts`, `tests/fixtures/content/about.md`, `content/about.md`

**Interfaces:**
- Produces: `About.statement: string`; `About.activities: { title: string; description: string; word: string; detail: string }[]`. `word` is at most 8 characters, `detail` at most 24; violating either throws `Invalid content in about.md: …`.

- [ ] **Step 1: Write failing tests** in `tests/content.test.ts`: `getAbout exposes statement, and word and detail for each activity`; `getAbout rejects an activity word longer than 8 characters, naming about.md`; `getAbout rejects an activity detail longer than 24 characters`; `placeholder about has four activities and a statement of 8 words or fewer` (default root; words are Train, Compete, Gather, Serve).
- [ ] **Step 2: Run** `npx vitest run tests/content.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** the type and validation in `lib/content.ts`; update the fixture; rewrite `content/about.md` activities to the four words with details such as `[Placeholder] Weekly` (24 characters at most) and add `statement: "[Placeholder] One home for Kuntaw"`.
- [ ] **Step 4: Run** `npm run test && npm run typecheck` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add statement, word and detail content fields"`

### Task 2: Baybayin transliteration

**Files:**
- Create: `lib/baybayin.ts`, `tests/baybayin.test.ts`

**Interfaces:**
- Produces: `toBaybayin(input: string): string` following spec section 6.

- [ ] **Step 1: Check glyph coverage.** Fetch the Noto Sans Tagalog TTF named in `https://fonts.googleapis.com/css2?family=Noto+Sans+Tagalog`, and test whether its cmap includes U+170D (`pip install fonttools`, then `TTFont(...).getBestCmap()`). Record the result in the ledger. Decision rule: covered → `r` maps to U+170D; not covered → `r` maps to U+1707.
- [ ] **Step 2: Write failing tests** (expected strings use the spec's code points): `kumasa` → `ᜃᜓᜋᜐ`; `kuntaw` → `ᜃᜓᜈ᜔ᜆᜏ᜔`; `ngayon` → `ᜅᜌᜓᜈ᜔`; `mabuhay` → `ᜋᜊᜓᜑᜌ᜔`; `ako` → `ᜀᜃᜓ`; `isa` → `ᜁᜐ`; `kita` → `ᜃᜒᜆ`; `cebu` → `ᜐᜒᜊᜓ` and `cola` → `ᜃᜓᜎ` (c→s before e/i, else k); `ñ` maps as `ny`; spaces and digits pass through (`ana 2015` keeps the space and `2015`); upper case is folded; `''` returns `''`; an emoji passes through unchanged; a 200-character input returns without throwing; the `r` test matches the decision from Step 1.
- [ ] **Step 3: Run** `npx vitest run tests/baybayin.test.ts` — Expected: FAIL.
- [ ] **Step 4: Implement** `toBaybayin`: lower-case; scan for the digraph `ng` first; read consonant+vowel units; add U+1712/U+1713 for e,i/o,u; add U+1714 to a consonant that ends the word or precedes another consonant; map the approximations (`c q f v z x j`) before scanning.
- [ ] **Step 5: Run** `npm run test && npm run lint && npm run typecheck` — Expected: PASS.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: add Baybayin transliteration"`

### Task 3: Design foundation — tokens, fonts, Field, MaskedLines

**Files:**
- Create: `lib/tones.ts`, `components/Field.tsx`, `components/MaskedLines.tsx`, `tests/tones.test.ts`, `tests/Field.test.tsx`
- Modify: `app/layout.tsx` (fonts), `app/globals.css` (new tokens, tone variables)

**Interfaces:**
- Produces: `type Tone = 'red' | 'blue' | 'yellow' | 'black' | 'paper'`; `TONES: Record<Tone, { ground: string; ink: string; displayInk: string }>`; `contrastRatio(a: string, b: string): number` (hex in, WCAG ratio out); `Field(props: { tone: Tone; as?: 'section' | 'div' | 'header' | 'footer'; label?: string; tall?: boolean; className?: string; children: ReactNode })` which renders `data-tone`, sets CSS variables `--ground` and `--ink`, gets `aria-label` from `label`, and is `min-h-[90svh]` when `tall` (default true); `MaskedLines(props: { lines: string[]; as?: 'h1' | 'h2'; className?: string })`, one `<span>` mask per line inside a single heading.
- Old tokens and components stay until Task 14.

- [ ] **Step 1: Write failing tests.** `tests/tones.test.ts`: `every tone's ink meets 4.5:1 on its ground`; `the display ink on red meets 3:1 and the red ink is not black` (Review Focus 2); `adjacent chapter tones differ in lightness` for the home order red, blue, yellow, black, paper, blue. `tests/Field.test.tsx`: `Field exposes its tone and label as a region`; `Field is tall by default and not when tall is false`; `MaskedLines renders every line inside one heading and is visible without script`.
- [ ] **Step 2: Run** `npx vitest run tests/tones.test.ts tests/Field.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** the files above; load the three fonts with `next/font/google` as `--font-display`, `--font-body`, `--font-baybayin`; declare the six colour tokens and per-tone variables in `app/globals.css`.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add colour tokens, fonts, Field and MaskedLines"`

### Task 4: Shell — Header, Footer, BlockMark

**Files:**
- Create: `components/BlockMark.tsx`, `tests/BlockMark.test.tsx`
- Modify: `components/Header.tsx`, `components/Footer.tsx`, `app/layout.tsx`, `tests/Header.test.tsx`, `tests/layout.test.tsx`

**Interfaces:**
- Consumes: `Field`, `navLinks`.
- Produces: `Header()` (client, placed inside a `Field`, not sticky, colours from `--ground` and `--ink`; the open mobile menu is a full-screen field with Escape, focus wrap and close-on-link kept); `BlockMark(props: { text: string })` (an element with `role="img"` and `aria-label={text}`, one solid block per letter in a fixed cycle of palette colours, heights 60–100% in a fixed repeating pattern, 4px gaps, bottoms aligned); `Footer({ site: SiteInfo })` as a black `Field` with `BlockMark`, four link columns, copyright and one small button.
- `app/layout.tsx` stops rendering `Header`; pages place it inside their first field (Tasks 6 and 10–12).

- [ ] **Step 1: Write failing tests:** `BlockMark labels the whole word and draws one block per letter`; `BlockMark is deterministic for the same text`; `Footer has the copyright, the BlockMark, every nav link and the contact email`; Header tests keep their four behaviours (toggle, Escape returns focus, five links, focus wrap) and add `Header takes its ink from the surrounding Field` (a class or style referencing `--ink`).
- [ ] **Step 2: Run** `npx vitest run tests/BlockMark.test.tsx tests/Header.test.tsx tests/layout.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** the components; remove `Header` from `app/layout.tsx` (keep the skip link and `Footer`).
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS. Pages built before Tasks 6 and 10–12 have no header until those tasks; that is expected.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add colour-aware header, block-mark footer"`

### Task 5: Placeholder raster artwork

**Files:**
- Create: `scripts/make-tiles.mjs`, `public/images/tiles/*.png`
- Modify: `content/albums/events.md`, `content/albums/training.md`, `content/news/*.md`, `content/officers.yml`, `components/ImageSlot.tsx`, `tests/content.test.ts`, `tests/ImageSlot.test.tsx`, `docs/superpowers/specs/2026-10-28-kumasa-redesign-design.md` (§4 Imagery: PNG instead of WebP)
- Delete: `public/images/placeholder/*.svg`

**Interfaces:**
- Produces: twelve 800×800 PNG tiles (`events-1..6`, `training-1..6`) each a single Baybayin letter in one of four palette pairs (blue/white, red/white, yellow/black, white/black); two 1600×900 covers (`news-1`, `news-2`); `scripts/make-tiles.mjs` regenerates them with Playwright (Chromium, Noto Sans Tagalog from Google Fonts). Albums become events 6, training 6, seminars 0. Officers no longer carry `photo`. `ImageSlot` keeps its props; its placeholder is a flat tone with no pattern, gradient or glyph.

- [ ] **Step 1: Write failing tests:** in `tests/content.test.ts` `every image path in content exists under public/` (albums, news covers, officer photos) and update `placeholder content has an empty album…` to album sizes `[0, 6, 6]`; in `tests/ImageSlot.test.tsx` `placeholder has no gradient or pattern class`.
- [ ] **Step 2: Run** `npm run test` — Expected: FAIL.
- [ ] **Step 3: Implement** `scripts/make-tiles.mjs` (Playwright screenshot to PNG, `CHROME_PATH`-style no-sandbox launch when running as root), run it, update the content files and `ImageSlot`, delete the old SVGs, edit the spec sentence to say PNG because Playwright cannot emit WebP.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: replace placeholder SVGs with drawn raster tiles"`

### Task 6: Hero

**Files:**
- Create: `tests/Hero.test.tsx`
- Modify: `components/Hero.tsx`, `app/page.tsx`, `tests/home.test.tsx`

**Interfaces:**
- Consumes: `Field`, `MaskedLines`, `Header`, `SiteInfo`.
- Produces: `Hero({ site: SiteInfo })`: a red `Field` (tall, 100svh) containing `Header`, `MaskedLines` with `lines = [site.name, first word of site.fullName]` as the `h1`, a white supporting sentence `${site.fullName}, a Filipino martial arts organisation since ${site.founded}.` at most 30ch wide, bottom-right on desktop and bottom-left on a phone, and one filled link-button "About KUMASA" to `/about`.

- [ ] **Step 1: Write failing tests** (`tests/Hero.test.tsx`): `hero h1 has the name and the art on two lines`; `hero shows the supporting sentence with the founding year`; `hero has exactly one primary button, linking to /about`; `hero contains the site navigation`. Update `tests/home.test.tsx` so the hero assertions use the new hero.
- [ ] **Step 2: Run** `npx vitest run tests/Hero.test.tsx tests/home.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** `Hero` per the spec's home table and swap it into `app/page.tsx`; the other chapters stay as they are until Tasks 7–9.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add stacked-name hero"`

### Task 7: About chapter and Baybayin name-writer

**Files:**
- Create: `components/BaybayinWriter.tsx`, `components/AboutChapter.tsx`, `tests/BaybayinWriter.test.tsx`, `tests/AboutChapter.test.tsx`
- Modify: `app/page.tsx`, `tests/home.test.tsx`

**Interfaces:**
- Consumes: `toBaybayin`, `About`, `Field`.
- Produces: `BaybayinWriter()` (client; a labelled text field "Your name", an `aria-live="polite"` output in `--font-baybayin` with `lang="tl-Tglg"`; empty or whitespace-only input shows the example `KUMASA` → `ᜃᜓᜋᜐ`; a note "A simple transliteration, not an authoritative one."; the output wraps with `overflow-wrap: anywhere`); `AboutChapter({ about: About })` (a black ground with an inset blue panel, region labelled "About": the `statement` as the `h2`, `excerpt` as a paragraph, `BaybayinWriter`, and the badge image cropped to a circle by the panel's bottom edge).

- [ ] **Step 1: Write failing tests:** `empty input shows the KUMASA example`; `whitespace-only input shows the example, not a blank`; `typing kuntaw shows ᜃᜓᜈ᜔ᜆᜏ᜔`; `emoji and digits pass through without error`; `a 200-character name renders and the output can wrap` (class check); `the output has lang tl-Tglg and is a polite live region`; `the label and the approximation note are present` (Review Focus 1). For `AboutChapter`: `shows the statement as h2 inside the About region`; `contains the writer and the badge image`.
- [ ] **Step 2: Run** `npx vitest run tests/BaybayinWriter.test.tsx tests/AboutChapter.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** both components; replace the old about preview section in `app/page.tsx`; fix `tests/home.test.tsx` for the new region.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add about chapter and Baybayin name-writer"`

### Task 8: What-we-do poster lines and the tile wall

**Files:**
- Create: `components/WhatWeDo.tsx`, `components/PosterList.tsx`, `components/TileWall.tsx`, `tests/WhatWeDo.test.tsx`, `tests/TileWall.test.tsx`
- Modify: `app/page.tsx`, `tests/home.test.tsx`

**Interfaces:**
- Consumes: `Field`, `ImageSlot`, `About['activities']`, `Album['images']`.
- Produces: `PosterList(props: { items: { word: string; detail: string }[] })` (a `<ul>`; word at `clamp(64px, 10vw, 150px)` left, detail 18–20px right with tabular figures; hover swaps the ink to red); `WhatWeDo({ activities })` (yellow `Field` labelled "What we do" with an `h2` "What KUMASA does" at the lead size, or `null` for an empty list); `TileWall(props: { images: { src: string; alt: string }[]; heading?: string; limit?: number; onSelect?: (index: number, trigger: HTMLElement) => void })` (four columns, two on a phone, 8px gaps, edge to edge; the first tile holds `heading` as an `h2`; tile colour pairs rotate in a fixed order; with `onSelect` each tile is a button named `View larger: ${alt}`; empty images show "No photos yet").

- [ ] **Step 1: Write failing tests:** `PosterList shows each word and its detail`; `WhatWeDo renders nothing for an empty list` (Review Focus 3); `WhatWeDo has its h2`; `TileWall respects limit`; `TileWall rotates colour pairs in a fixed order` (data attribute); `TileWall shows its heading tile and No photos yet when empty`; `TileWall tiles are buttons only when onSelect is given`.
- [ ] **Step 2: Run** `npx vitest run tests/WhatWeDo.test.tsx tests/TileWall.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement**; in `app/page.tsx` replace the old what-we-do cards and the old gallery preview with `WhatWeDo` and a black `Field` holding `TileWall` (`heading="Gallery"`, `limit={12}`) plus a "See the full gallery" link; fix `tests/home.test.tsx`.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add poster lines and tile wall"`

### Task 9: News table, contact rows and home composition

**Files:**
- Create: `components/NewsTable.tsx`, `components/DisplayRows.tsx`, `tests/NewsTable.test.tsx`, `tests/DisplayRows.test.tsx`
- Modify: `app/page.tsx`, `tests/home.test.tsx`

**Interfaces:**
- Consumes: `NewsPost`, `SiteInfo`, `formatDate`, `Field`.
- Produces: `NewsTable(props: { posts: NewsPost[]; limit?: number })` (rows of `<time>`, headline link to `/news/${slug}`, arrow glyph `→` marked `aria-hidden`; empty shows "No news yet"); `DisplayRows({ site: SiteInfo })` (rows at `clamp(44px, 6vw, 88px)`: organisation, address linking to a map search, email as `mailto:`, phone as `tel:` with digits only, then a greeting row with a round arrow button to `mailto:`; every row has `overflow-wrap: anywhere`).
- Home composes: `Hero`, `AboutChapter`, `WhatWeDo`, wall, a paper news `Field` (two-line `h2` "What is happening at KUMASA", `NewsTable limit={3}`, "All news" link), a blue contact `Field` (`h2` "Get in touch", `DisplayRows`); the old officers section is removed.

- [ ] **Step 1: Write failing tests:** `NewsTable lists posts newest first as links`; `NewsTable limit shows only the latest three`; `NewsTable shows No news yet when empty`; `DisplayRows links are mailto, tel with digits only, and a map search`; `DisplayRows rows can wrap long strings` (a 60-character email gets the wrap class; Review Focus 5); `home regions are About, What we do, Gallery, News, Contact in that order`; `home has one h1`; `home renders with no news, no images and no activities` (mock the content getters to empty; Review Focus 3).
- [ ] **Step 2: Run** `npx vitest run tests/NewsTable.test.tsx tests/DisplayRows.test.tsx tests/home.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** the components and the final home composition.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add news table, contact rows and compose the home page"`

### Task 10: Inner pages — about, news, article, not found

**Files:**
- Create: `components/FieldHeader.tsx`, `components/HistoryRows.tsx`, `components/OfficerRows.tsx`, `tests/FieldHeader.test.tsx`
- Modify: `app/about/page.tsx`, `app/news/page.tsx`, `app/news/[slug]/page.tsx`, `app/not-found.tsx`, `tests/about.test.tsx`, `tests/news.test.tsx`

**Interfaces:**
- Consumes: `Field`, `Header`, `MaskedLines`, `NewsTable`, `getAbout`, `getTimeline`, `getOfficers`.
- Produces: `FieldHeader(props: { tone: Tone; lines: string[]; intro?: string })` (a tall `Field` with `Header` and the page `h1` from `MaskedLines`); `HistoryRows({ entries: TimelineEntry[] })` (year at display size left, title and description right, no rules); `OfficerRows({ officers: Officer[] })` (name and role left, bio right).
- Pages: `/about` red header `['About','KUMASA']`, story on paper in a 60ch column, history on yellow, officers on blue; `/news` paper header with `NewsTable` of every post; `/news/[slug]` paper field with `Header`, `h1`, date, cover and body; not found red header `['Page','not found']` with one button home.

- [ ] **Step 1: Write failing tests:** `FieldHeader has one h1 made of its lines and the nav`; update `tests/about.test.tsx` (h1, mission h2 in the story, history rows in year order, four officer rows each with a role); update `tests/news.test.tsx` (the six existing behaviours, with rows instead of `h3` headings).
- [ ] **Step 2: Run** `npm run test` — Expected: FAIL.
- [ ] **Step 3: Implement** the components and rebuild the four pages.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: rebuild about, news, article and not-found pages"`

### Task 11: Gallery page

**Files:**
- Modify: `components/GalleryGrid.tsx`, `components/Lightbox.tsx`, `app/gallery/page.tsx`, `tests/GalleryGrid.test.tsx`, `tests/Lightbox.test.tsx`, `tests/gallery-page.test.tsx`

**Interfaces:**
- Consumes: `TileWall`, `FieldHeader`, `Album`.
- Produces: a yellow `FieldHeader` `['Gallery']`; album filters as filled square blocks with `aria-pressed` (active inverted); `GalleryGrid` renders `TileWall` with `onSelect`; `Lightbox` keeps its props and behaviour (arrows stop at the ends, focus trapped, Escape closes, focus returns to the opening tile) in the new tones.

- [ ] **Step 1: Write failing tests:** keep the existing GalleryGrid and Lightbox behaviours as written; add `gallery page has one h1 and a filter per album`; `the active filter is inverted` (class or aria check).
- [ ] **Step 2: Run** `npm run test` — Expected: FAIL.
- [ ] **Step 3: Implement** the restyle and the page.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: restyle gallery and lightbox"`

### Task 12: Contact page and form

**Files:**
- Create: `components/ContactForm.tsx`, `app/contact/page.tsx`, `.env.example`, `tests/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `FieldHeader`, `DisplayRows`, `getSite`.
- Produces: `ContactForm(props: { endpoint?: string; email: string })` (labelled name, email, message; posts JSON to `endpoint`; falls back to a `mailto:` link when `endpoint` is unset); page: blue header `['Contact']`, `DisplayRows`, then the form on a flat field; `.env.example` documents `NEXT_PUBLIC_FORM_ENDPOINT=`.

- [ ] **Step 1: Write failing tests:** `with an endpoint the form posts name, email and message and shows a success message` (mock `fetch`); `a failed post shows an error and keeps the typed values`; `without an endpoint it renders a mailto link instead of a form`; `required fields block submission`; `contact page has one h1, the display rows and the form`.
- [ ] **Step 2: Run** `npx vitest run tests/ContactForm.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** the form (an `aria-live` status region, visible field labels) and the page; ensure `.env.example` is not ignored by `.gitignore`.
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add contact page and form"`

### Task 13: Motion layer

**Files:**
- Modify: `components/MaskedLines.tsx`, `components/Reveal.tsx`, `components/AboutChapter.tsx`, `app/globals.css`, `tests/Field.test.tsx`
- Create: `tests/Reveal.test.tsx`

**Interfaces:**
- Produces: the masked headline reveal as CSS animation (about 900ms, strong ease-out, second line delayed 110ms) that leaves the text visible when it is not running; `Reveal(props: { children: ReactNode; delay?: number })` as a staggered entrance (rise 16–32px with opacity, once, 60–90ms steps) that renders visible with no `IntersectionObserver` and under reduced motion; press, hover and focus feedback classes on every button and link; a slow scroll-linked scale of the badge in `AboutChapter` behind `@supports (animation-timeline: view())`. All inside `@media (prefers-reduced-motion: no-preference)` except the resting states.

- [ ] **Step 1: Write failing tests:** `masked lines carry no hidden or translated resting class` (Review Focus 4); `Reveal renders its children visible when IntersectionObserver is missing`; `Reveal stays visible under reduced motion`; `Reveal applies increasing delays to successive children`.
- [ ] **Step 2: Run** `npx vitest run tests/Reveal.test.tsx tests/Field.test.tsx` — Expected: FAIL.
- [ ] **Step 3: Implement** the motion; wrap each chapter's parts in `Reveal` (heading, then text, then picture).
- [ ] **Step 4: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add motion layer"`

### Task 14: Inspector gate, look-and-fix, cleanup

**Files:**
- Create: `scripts/inspect-site.sh`
- Delete: `components/SectionHeading.tsx`, `components/PageHeading.tsx`, `components/OfficerCard.tsx`, `components/NewsCard.tsx`, `components/TimelineList.tsx`, `public/images/baybayin-rule.svg`, their tests, old tokens and the splatter and `post-body` rules no longer used
- Modify: any file the inspector or the critique flags

**Interfaces:**
- Produces: `scripts/inspect-site.sh [route…]` — builds, serves `out/` with `serve` on 4173 as a script file (never pattern-kill), writes the `CHROME_PATH` wrapper to a temp file, runs `inspect.mjs` for each route (default `/`, `/about`, `/gallery`, `/news`, `/news/2026-01-05-placeholder-news-one`, `/contact`, `/does-not-exist`) into `.taste-skill/after/<route>`, then stops the server by PID.

- [ ] **Step 1: Delete** the components and styles that nothing imports (confirm with a search), with their tests; run `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: PASS.
- [ ] **Step 2: Write** `scripts/inspect-site.sh` and run it. Expected: a per-route result with counts.
- [ ] **Step 3: Fix** every `FAIL` at 1440, 768 and 390 px; fix each `WARN` or write a one-sentence defence in the ledger. Re-run until every route has 0 FAIL.
- [ ] **Step 4: Look.** Open every screenshot the inspector lists, critique with `references/critique.md` §4 (in `$TASTE`), fix the top three problems, re-run; at most three rounds. Real-browser checks: lightbox, mobile menu, name-writer, and `prefers-reduced-motion` content visibility.
- [ ] **Step 5: Verify** `npm run lint && npm run typecheck && npm run test && npm run build` — Expected: PASS; record before (8 FAIL, 3 WARN on `/`) and after counts in the ledger.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: pass the inspector gate and remove the old design"`

### Task 15: E2E smoke suite, README, final verification

**Files:**
- Create: `tests/e2e/smoke.spec.ts`, `README.md`
- Modify: `playwright.config.ts`

**Interfaces:**
- Consumes: the built `out/` served by `node_modules/.bin/serve out -l 4173`.

- [ ] **Step 1: Write the e2e tests** in `tests/e2e/smoke.spec.ts`: `each route returns 200 with one h1 and no 4xx sub-requests` (`/`, `/about`, `/gallery`, `/news`, one `/news/<slug>`, `/contact`); `an unknown path returns 404 and shows the not-found page`; `no route scrolls horizontally at 390px` (Review Focus 5); `desktop navigation reaches the gallery`; `lightbox opens, ArrowRight advances, Escape closes and focus returns`; `mobile menu opens as a full-screen field with its links inside the viewport`; `the name-writer turns kuntaw into ᜃᜓᜈ᜔ᜆᜏ᜔`. Configure Playwright's `webServer` and Chromium (`--no-sandbox` when root).
- [ ] **Step 2: Run** `npm run build && npm run e2e` — Expected: PASS.
- [ ] **Step 3: Write `README.md`:** what the site is; run, build and test commands; how to add a news post, officer, album image and activity (file shapes); how to replace placeholders (search `[Placeholder]`); how to regenerate tiles (`scripts/make-tiles.mjs`); how to run the inspector (`scripts/inspect-site.sh`, `TASTE`, `CHROME_PATH`); deploying `out/` to Vercel, Netlify or GitHub Pages; `NEXT_PUBLIC_FORM_ENDPOINT`; credit taste-skill (MIT).
- [ ] **Step 4: Final verification** — `npm run lint && npm run typecheck && npm run test && npm run build && npm run e2e`; Expected: all pass. Run `scripts/inspect-site.sh` once more on the final build; Expected: 0 FAIL on every route.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add e2e suite and README"`
