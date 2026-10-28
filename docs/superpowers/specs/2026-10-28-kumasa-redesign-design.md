# KUMASA Website Redesign — Design Spec

**Date:** 2026-10-28
**Status:** Awaiting review
**Amends:** `2026-10-28-kumasa-website-design.md`. This document replaces that spec's section 3 (Visual design), the home-page composition in section 2, and the component list's styling. Routes, the content model, the static-export approach, the lightbox behavior, and the testing approach are unchanged except where stated here.

## 1. Why

The first design scores 8 FAIL and 3 WARN on the taste-skill inspector (before-measurements, 1440/768/390 px): small uppercase labels, a star glyph, a gradient, thin rules, outlined boxes, one picture, and almost no motion. The redesign follows taste-skill v2.1.5 (https://github.com/Leonxlnx/taste-skill, MIT) so the site is art-directed rather than assembled from stock sections.

The dealt direction sheet is saved at `2026-10-28-kumasa-direction-sheet.md`. Its section blueprints give the geometry; this spec gives the decisions.

## 2. Direction

**Colour chapters.** Every section is a full-width flat field of one colour, hung like posters in a row, held together by one typeface and one grid. Seed 16295786, palette kept from the brand.

Changes from the dealt sheet, each for a stated reason:

| Slot | Dealt | Used | Reason |
|---|---|---|---|
| Type | Roundo (Fontshare) | Red Hat Display 900 + Red Hat Text 400/500 (Google Fonts) | Fontshare is unreachable from the build environment, so the asset does not exist here. First reroll. |
| News list | Day tabs, banded agenda | Statement, table pushed right | An agenda of sessions and speakers cannot hold dated news posts. |
| Contact | Photo strip, three-cell bar | Address in display rows | The strip needs ten photographs; the bar has no message field. The form moves below the rows on `/contact`. |

## 3. Idea, argument, live feature

**Idea.** On this page, the badge's blue, red and yellow panels become the chapters, and its Baybayin line becomes a name-writer.
Known weakness: other Filipino organisations also use the flag colours. What belongs only to KUMASA here is the badge's own panel layout and its Baybayin lettering.

**Argument** (each home chapter makes one claim):
1. KUMASA is a Filipino Kuntaw organisation, active since 2015. (hero, about)
2. It trains, competes and gathers. (what we do)
3. The activity is real. (gallery)
4. It keeps people informed. (news)
5. It can be reached. (contact)

Officers and the history timeline have no claim on the home page; they live on `/about`.

**Live feature.** A Baybayin name-writer in the About chapter (section 6).

## 4. Visual system

### Colour
Flat fields only: no gradients, tints, shadows at rest, thin rules, or outlined boxes. Surfaces are told apart by tone, space and scale.

| Token | Value | Field use |
|---|---|---|
| `--red` | `#D01C1F` | hero, `/about` and error headers |
| `--blue` | `#1B3FA0` | about panel, contact |
| `--yellow` | `#F2C300` | what we do, gallery header |
| `--black` | `#0A0A0A` | page ground, gallery wall, footer |
| `--paper` | `#F5F5F5` | news, articles |
| `--white` | `#FFFFFF` | ink on red, blue, black |

Assigned inks and measured contrast: white on red 5.43:1; **black on red 3.65:1, so black on red is display size only (24px or larger)** and running text on red is white; white on blue 9.27:1; black on yellow 11.86:1; white on black 19.80:1; black on paper 18.16:1.

Adjacent fields differ clearly in lightness as well as hue. One corner radius for the whole site: **square**. One button shape: square, filled, 44px or taller.

### Type
Red Hat Display 900, uppercase, tracking −0.03em, leading 0.92 for display; Red Hat Text 400 (body, 18–20px, leading 1.5) and 500 (emphasis). Loaded with `next/font/google`. Five size steps at most: `--step-small`, `--step-body`, `--step-lead`, `--step-head`, and the hero display size. Running text is 16px or larger in the full ink. Headlines are two lines or fewer at every width. Noto Sans Tagalog (Google Fonts) is loaded only for Baybayin glyphs.

### Frame
One pair of equal outer margins, `clamp(20px, 2.8vw, 40px)`, at every width. Sections are full-bleed fields, at least 90svh tall on desktop, butted together with no gap or divider. Headings start on the same left edge in every field. Every section has a heading; the page's `h1` is on the first screen and says what the site is.

### Motion
Signature: **masked headline.** On load each headline line rises from behind its own baseline (about 900ms, strong ease-out, second line 110ms later), then the supporting sentence and action fade up. Around it: staggered entrances (heading, then text, then picture, 60–90ms apart, once, rising 16–32px); press, hover and focus feedback on every control; one moving picture (a slow scroll-linked scale on the badge in the About chapter). Transform and opacity only. Every move has a `prefers-reduced-motion` fallback that keeps the content and drops the travel. Content is visible if script fails.

### Imagery
Real pictures from the open archives are unavailable (the environment blocks them), so the page uses **drawn raster artwork** made from KUMASA's own material: the supplied badge, and tiles built from single Baybayin letters in the palette's colour pairs, rendered to WebP. They are marked as placeholders in their alt text and are replaced by KUMASA's own photographs. The skill's "at least four real pictures" floor is therefore met by raster artwork, not photographs; see section 9.

## 5. Pages

### Home (`/`)
| Chapter | Field | Blueprint | Content |
|---|---|---|---|
| Hero | red, 100svh | Stacked name, two inks | `KUMASA` in white over `KUNTAW` in black at about 19vw (21vw on a phone), flush left. Top edge: badge monogram left; About, Gallery, News, Contact right. Supporting sentence bottom-right (bottom-left on a phone), white, 30ch: "Kuntaw Unified Martial Sports Advocates, a Filipino martial arts organisation since 2015." One filled button: "About KUMASA". |
| About | black ground, blue panel inset 20px | Inset panel, shaped portrait | Statement of 7 words or fewer, a short paragraph, the name-writer, and the badge cropped to a circle by the panel's bottom edge. |
| What we do | yellow | One item per poster line | Four items at `clamp(64px, 10vw, 150px)`: Train, Compete, Gather, Serve. Each has a short fact at the right margin, 18–20px, tabular figures. Hover swaps the ink to red. A sentence-case `h2` at the lead size, "What KUMASA does", sits above the lines (the house rule of a heading on every section outranks the blueprint's "no heading"). |
| Gallery | black | Wall of word tiles | Four columns of square tiles, 8px gaps, edge to edge; the first tile holds the `h2` "Gallery" as its word; twelve tiles, then a link to `/gallery`. Tiles rotate through four colour pairs. Two columns on a phone. |
| News | paper | Statement, table pushed right | Two-line heading ("What is happening at KUMASA"). Table in columns 8–12: date, headline, arrow; the three latest posts, then "All news". |
| Contact | blue | Address in display rows | Rows at `clamp(44px, 6vw, 88px)`: organisation, address, email, phone, then a greeting row with a round arrow button that opens `mailto:`. A sentence-case `h2` at the lead size, "Get in touch", sits above the rows (same override as above). No form on the home page. |
| Footer | black | The mark, built large | `KUMASA` built from six coloured blocks of differing height with 4px gaps; four columns of links; copyright and one small button. |

### Inner pages
Each opens with a full-bleed field holding the `h1` at display size; the header navigation takes the first field's colours and is not sticky. Content follows in other fields.

- **`/about`** (red header "About KUMASA"): story on paper in a 60ch column; history as rows (year at display size left, title and description right) on yellow; officers as two-ended rows (name and role left, bio right) on blue. No card grids.
- **`/gallery`** (yellow header "Gallery"): album filters as filled blocks, active one inverted; the wall of tiles; the lightbox (unchanged behavior: arrows stop at the ends, focus is trapped and returns to the opening tile, Escape closes). An album with no images shows "No photos yet".
- **`/news`** (paper header "News"): the news table with every post, newest first; "No news yet" when empty. **`/news/[slug]`**: article on paper, title as `h1`, date, cover, body.
- **`/contact`** (blue header "Contact"): the display rows, then the form on a flat field: name, email, message; it posts to `NEXT_PUBLIC_FORM_ENDPOINT` and falls back to a `mailto:` link when that is unset.
- **Not found** (red header "Page not found") with one button back home.

## 6. Live feature: Baybayin name-writer

A text field (label "Your name") and a large output line. Typing updates the output instantly. Without script the output shows the static example `KUMASA` as `ᜃᜓᜋᜐ`. It works on a phone with a thumb, never blocks reading, and is labelled "A simple transliteration, not an authoritative one."

`toBaybayin(input: string): string` is a pure function in `lib/baybayin.ts`:
- Input is lower-cased; spaces and characters it cannot map pass through unchanged.
- Consonant letters (U+1703–U+1711): `k`→KA, `g`→GA, `ng`→NGA (a digraph, one letter), `t`→TA, `d`→DA, `n`→NA, `p`→PA, `b`→BA, `m`→MA, `y`→YA, `l`→LA, `w`→WA, `s`→SA, `h`→HA, `r`→RA (U+170D) if the loaded font covers it, otherwise DA (U+1707); checked once at build.
- Approximations: `c`→`k` (`s` before `e`/`i`), `q`→`k`, `f`→`p`, `v`→`b`, `z`→`s`, `x`→`ks`, `j`→`dy`, `ñ`→`ny`.
- A consonant carries an inherent `a`. `e`/`i` add VOWEL SIGN I (U+1712); `o`/`u` add VOWEL SIGN U (U+1713).
- A lone vowel: `a`→U+1700, `e`/`i`→U+1701, `o`/`u`→U+1702.
- A final consonant, or one followed by another consonant, takes the virama U+1714.

## 7. Content and component changes

**Content model** (extends the original spec's, test-first): `about.md` activities gain `word` (one word, at most 8 characters) and `detail` (a short fact at most 24 characters). Placeholder content keeps its `[Placeholder]` marking on details. Placeholder gallery SVGs are replaced by raster tiles; paths in `content/albums/*.md` update.

**Components.** New: `Field` (full-bleed coloured section with assigned inks), `PosterList`, `TileWall`, `NewsTable`, `DisplayRows`, `BlockMark`, `BaybayinWriter`, `FieldHeader`. Restyled: `Header` (page-top, takes the first field's colours; mobile menu becomes a full-screen field), `Footer`, `Lightbox`, `GalleryGrid`, `ImageSlot`, `ContactForm`. Removed: `SectionHeading`, `PageHeading`, `OfficerCard`, `NewsCard`, `TimelineList`, the Baybayin rule SVG, the splatter style, and the Oswald/Inter setup. `Reveal` is reworked to the staggered-entrance rules above.

## 8. Testing and acceptance

Test-driven. Existing tests that assert structure the redesign removes (eyebrows, card headings, section labels) are rewritten with the change, not deleted. New tests cover `toBaybayin` (each rule above, plus empty and unsupported input), `BaybayinWriter` (updates on input, static fallback), the new content fields, and every empty state.

Acceptance, in order:
1. `npm run lint`, `typecheck`, `test`, `build` pass with pristine output.
2. `inspect.mjs` shows **0 FAIL** at 1440, 768 and 390 px on every route, on the production build served over HTTP; every `WARN` is fixed or defended in the report.
3. Every screenshot it lists is opened and critiqued after the last change (`references/critique.md`), up to three fix rounds.
4. Real-browser checks of the lightbox, the mobile menu and the name-writer, and a contrast check of every field/ink pair.
5. The final report lists the redraws, the idea and live feature, scores, which pictures are drawn stand-ins, and sample content to replace.

## 9. Known limits

- **No found photographs.** Archive hosts are blocked; imagery is drawn raster artwork until KUMASA supplies photographs. The inspector's picture floor is met by raster artwork, not photographs.
- **The idea shares its colours with other Filipino organisations** (section 3).
- **The transliteration is approximate** and should be reviewed by a Baybayin reader before launch.
- **Sample content** (activity facts, news, officer details, the supporting sentence) is placeholder and must be confirmed.
- The inspector needs a Chromium launched with `--no-sandbox` as root; run it through a wrapper set as `CHROME_PATH`.

## 10. Out of scope

Light mode, found-picture sourcing, video, scroll-pinned scenes, a CMS, login, payments, event registration, and any change to routes or the content-file layout beyond section 7.
