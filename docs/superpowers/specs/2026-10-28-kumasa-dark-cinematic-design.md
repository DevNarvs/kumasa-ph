# KUMASA website: dark cinematic redesign

Status: approved by the user on 2026-10-28 (mockup: `docs/superpowers/mockups/kumasa-dark.html`,
published at https://claude.ai/artifact/7N7UNP4hQ9WTLgjww7Z1J9).

This replaces the colour-chapters direction in `2026-10-28-kumasa-redesign-design.md`. Stack, routes,
content layer, gallery lightbox, contact form behaviour, and tests stay. The look and the page compositions change.

## Direction

The user picked "dark cinematic federation", with the German Handball Federation site (dhb.de) as the reference:
- Black ground, light type, and the badge's red as the one accent. Blue and yellow appear sparingly, for example the yellow star in the name writer.
- A full-screen photo hero with KUMASA in huge condensed type and one button.
- The round badge as the recurring motif: photos are cropped into circles.

**Idea:** On this site, the round KUMASA badge becomes the frame that photographs are cut into.

**Live thing:** type your name and see it in Baybayin on a black disc, matching the Baybayin line on the badge.

### Photos
- There are no real photos yet, so every photo slot is a **dark frame**: a flat `--surface` fill with a short caption naming the photo that belongs there (e.g. "Photo: Saturday class, all ranks").
- Each frame is a real `<img>` path in content (a placeholder SVG of that flat frame), so dropping in a real photo means changing a path, not code.
- The only real picture is the badge (`/images/kumasa-logo.webp`).

### House rules (taste-skill)
- No eyebrows above headings, tiny tracked caps, monospace, index numbering, thin rules, gradients, resting shadows, glass, emoji, or styled accent words.
- Every headline is at most two lines at 1440, 768 and 390 px.
- Equal outer margins, and every section has a heading.

## Tokens

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#0b0b0b` | ground |
| `--surface` | `#171717` | frames, panels, rows |
| `--surface-2` | `#202020` | alternate rows, frame on a surface |
| `--ink` | `#f2f2f0` | text |
| `--muted` | `#a8a6a1` | secondary text (8:1 on `--bg`) |
| `--accent` | `#d01c1f` | primary button, Join field |
| `--accent-ink` | `#ffffff` | text on the accent |
| `--yellow` | `#f2c300` | the star in the name writer only |
| `--m` | `clamp(20px, 2.8vw, 40px)` | outer margin |
| `--gap` | `clamp(96px, 12vw, 200px)` | space between sections |

**Type:**
- Archivo (variable: width 62–125, weight 100–900) for everything.
- Noto Sans Tagalog for Baybayin.
- Both are loaded with `next/font/google`. Red Hat Display and Red Hat Text are removed.

| Role | Setting |
| --- | --- |
| hero name | width 62%, weight 850, 30.6vw desktop / 28.4vw phone, leading .8, tracking -.02em |
| d-1 (section headings) | width 62%, weight 800, `clamp(52px, 7.6vw, 124px)`, leading .9 |
| d-2 (item headings) | width 70%, weight 750, `clamp(28px, 3.3vw, 50px)`, leading 1 |
| statement | `clamp(22px, 2.3vw, 34px)`, leading 1.25 (as `<p>`, at most about 25 words) |
| body | 18px / 1.5 |
| small | 15px, `--muted` |

**Buttons:** square, flat, at least 56px tall (46px in the header). They are accent-filled, or `--bg`-filled on the red field and for secondary actions. Hover lifts 3px and the arrow moves 5px.

## Global shell

**Header**
- Absolute over the top of each page, not sticky.
- Left: the badge (52px circle) and "KUMASA".
- Right: links and a "Join a club" button pointing to `/contact`.
  - Links: About (`/about`), Events (`/#events`), Gallery (`/gallery`), News (`/news`).
- On phones, the badge, the wordmark and a menu button. The existing full-screen menu is kept, with Escape, focus wrap and close-on-link, restyled to the new tokens.

**Footer**
- KUMASA at full width (same size as the hero name).
- A line with the full name, "Filipino martial art, since {founded}".
- Footer links: About, Events, Gallery, News, Contact, Back to top.
- Email, phone and socials from `site.md`.

## Home (`/`), in order

1. **Hero.** Full-screen.
   - Behind: a dark frame inside a large circle that opens from scale .06 to 1 on load, then drifts slowly (scale 1→1.06).
   - The frame's caption sits top right, below the header.
   - `h1` "KUMASA" spans the width; each letter rises in turn.
   - Under it on the left: the supporting line at statement size, "{fullName}. {site.description}".
   - On the right: the "Join a club" button.
2. **One home for Kuntaw.** Split.
   - Left: `about.statement` as d-1, `about.excerpt` as a statement paragraph, and `about.facts` as filled chips at d-2 weight.
   - Right (columns 8–12): the badge image, which turns up to ±12° as it crosses the screen.
3. **Programmes** (`#programmes`). Heading, plus one sentence on the right (`about.programmesIntro`).
   - A mosaic of four photo panels built from `about.activities`:
     - the first spans 7 columns × 2 rows;
     - the second and third span 5 columns each;
     - the fourth is full width.
   - Each panel has a dark frame with a caption, a red round arrow button at top right, and a bottom text band (title as d-2, description). The band sits on a 35% black scrim.
   - Hovering scales the frame to 1.04. Each panel links to `activity.href`.
4. **Coming up** (`#events`). Heading, plus a secondary "Register a club" button pointing to `/contact`.
   - A fight-card list from the new `content/events.yml`. Each row is one link.
   - Main event (`main: true`, at most one): bigger title, with a round frame on the right.
   - Other rows: big day number and month, title as d-2, venue with detail under it, and a round arrow.
   - Rows alternate `--surface` and `--surface-2` and slide 10px on hover.
   - Only events on or after the build date are shown, soonest first.
   - With none: the sentence "No events announced yet." plus the button.
5. **From the mat** (`#gallery`). Heading, plus "Open the gallery" pointing to `/gallery`.
   - A strip of five round frames: the first five images across albums, each labelled with its album title.
   - Columns: 5 on desktop, 3 on tablet, 2 on phone (four shown).
6. **News.** Heading.
   - The latest post as the lead: a round frame from the cover, then title as d-2, date, and excerpt.
   - The next two posts as text rows: title, then date.
   - A link to `/news`.
7. **Train with us** (`#join`). A full red field.
   - Left: heading, statement, a "Write to us" button (mailto, `--bg`-filled), and the email address and socials shown as text.
   - Right: the name writer:
     - a black disc with the yellow star, the Baybayin output (Noto Sans Tagalog) and the Latin name under it;
     - a labelled input below the disc: "Your name in Baybayin, as on our badge".
     - The default shows "KUMASA" → ᜃᜓᜋᜐ.
     - Uses `lib/baybayin.ts`. It works with keyboard and thumb, and without script the default stays readable.

## Inner pages

Each page opens with `PageHeading`:
- top padding clears the header;
- `h1` as d-1;
- an optional intro as a statement paragraph.

The Join field (section 7) closes every page except Contact.

- **About:**
  - The story (`about.html`) at body size, in two columns on desktop: the left holds the statement, the right the story.
  - **History:** a fight-card list of `timeline.yml`, with the year big where the day goes on the home cards, then title and description.
  - **Officers:** a strip of round frames with name and role.
- **Gallery:**
  - Album filters as flat square buttons (`--surface`; the active one is ink-filled with `--bg` text, with `aria-pressed`).
  - A grid of square frames: 2, 3 or 4 columns.
  - The lightbox is unchanged in behaviour and restyled.
- **News index:** the latest post as the lead, the rest as text rows. Empty state: "No news yet".
- **News article:**
  - a back link ("All news");
  - `h1` at d-2 size so long titles stay within two lines;
  - the date under the title;
  - a full-width 16:9 frame from the cover;
  - the body at 18px in full ink, with a measure of about 68ch.
- **Contact:**
  - The red field as the page itself: heading, then contact details as text.
  - `ContactForm` with fields filled `--bg`, no borders, and visible focus.
  - With no endpoint it shows the mailto sentence (current behaviour).
- **Not found:** `h1` "Page not found", one sentence, and a "Back to home" button.

## Content changes

| File | Change |
| --- | --- |
| `site.md` | add `description` (one sentence, required), `heroImage` (path, required) and `heroAlt` (required) |
| `about.md` | add `facts` (list of short strings, ≤32 chars each) and `programmesIntro` (required); add `href` and `image` to each activity (both required) |
| `events.yml` (new) | list of `{date: YYYY-MM-DD, title, venue, detail, main?: bool, image?: string}` |
| `albums/*.md`, `news/*.md`, `officers.yml` | image paths point at the new dark-frame SVGs |
| `public/images/placeholder/*.svg` | redrawn as flat `#171717` frames with a caption in `#a8a6a1` |

Visible `[Placeholder]` prefixes in content are replaced with the mockup's sample copy (realistic but invented: events, news, album names, contact details). The README lists every sample item to replace before launch.

`lib/content.ts` gains `getEvents(root, today)`, with the same `ContentError` messages naming the file and field.
- The `date` uses the existing `normalizeDate`.
- At most one event may set `main: true`; otherwise the error names the file.

## Motion

Transform and opacity only, all dropped under `prefers-reduced-motion`.
- **Hero:** the circle opening, the letters rising, the lede and button rising.
- **Badge:** turns with the scroll.
- **Section entrances:** each section's parts rise 28px in turn, 80ms apart, once.
  - `Reveal` takes a `stagger` mode that applies this to its direct children.
  - Content stays visible without script.
- **Hover and press:** on buttons, panels, rows, strip circles and news rows.

## Removed

The colour-chapters pieces are removed with their tests:
- `Field`, `BlockMark`, `MaskedLines`, `lib/tones.ts`
- `Hero`, `SectionHeading`, `NewsCard`, `OfficerCard`, `TimelineList`
- the `ImageSlot` star placeholder
- `.hero-splatter`
- `baybayin-rule.svg`

## Verification

**Must pass:**
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run e2e`.
- The e2e suite is extended with: the name writer converting a typed name, the events list, and the home anchors.

**Taste-skill gate:**
- `lint.mjs` on `app` and `components`: 0 FAIL.
- `inspect.mjs` on the built `out/` home page: 0 FAIL, except `few-pictures` and `blank-gap`, which come from the empty photo frames until real photos arrive.
  - Each remaining WARN is defended in the report.
- Screenshots at 1440, 768 and 390 are looked at, and the critique is written in the `references/critique.md` §4 shape.
