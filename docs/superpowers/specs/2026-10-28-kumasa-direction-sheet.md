# Direction sheet used for the KUMASA redesign

Generated with taste-skill v2.1.5 (https://github.com/Leonxlnx/taste-skill, commit 12af471, MIT licence) on 2026-10-28.
Command: `draw.mjs --sector nonprofit --sections about,list,gallery,list,contact,footer --keep palette --direction colour-chapters`, seed 16295786.
Three slots were changed from the dealt sheet; see section 2 of `2026-10-28-kumasa-redesign-design.md`.
The sheet below is the final, reprinted version (`draw.mjs --show`). It is third-party design guidance, kept here for traceability.

---

# DIRECTION SHEET — Colour chapters
seed 16295786 · drawn 2026-10-28 · redraws: 3 · sector nonprofit
Brief: KUMASA, Kuntaw Unified Martial Sports Advocates: a Filipino martial arts organization founded in 2015, with an about page, a photo gallery of its activities, news and contact

| | |
| --- | --- |
| Direction | Colour chapters |
| Hero | Stacked name, two inks |
| Type | Red Hat Display / Red Hat Text |
| Colour | kept from the brand |
| Sections | about (Inset panel, shaped portrait) → list (One item per poster line) → gallery (Wall of word tiles) → list (Statement, table pushed right) → contact (Address in display rows) → footer (The mark, built large) |
| Motion | Masked headline |
| Photographs | the "People" set, as atmosphere |

This is the direction for this build. Adopt it. Do not blend it with the layout you would have made anyway,
and do not redraw because it is unfamiliar: unfamiliar is the point. Redraw a slot only when it conflicts
with a stated brand constraint or needs an asset that does not exist, and say why in your report.

The parts of this sheet were written separately and will disagree in small ways. Settle every disagreement in this order:
**house rules** (including type no smaller than 13px and body text of 16px or more) → **the direction** (the idea, the composition habits, where the
one accent goes) → **the type system and the palette** (which face does which job, the five size steps, which colour is the ground and where the
accent goes) → **the hero blueprint** → **the section blueprints**. Under each blueprint below, "Adjusted for this page" lists where it disagrees.
In practice: take geometry from blueprints (columns, proportions, what sits where) and take everything else from above them. Map every size a
blueprint names onto one of your five type steps instead of adding a sixth. Use one button shape, one corner radius and one pair of page margins on
the whole page, whatever individual blueprints say. If a blueprint names a kind of typeface (a light serif, a heavy grotesk), use the dealt face.

## 1. The idea
Every section is a chapter with its own flat colour, floor to ceiling. The page reads like a set of posters hung in a row, held together by one typeface and one grid. The colours are not decoration: they come from the subject (the brand's packaging, the artist's record sleeves, the product's own colour ways, the categories of the content) and each chapter's colour means that chapter. Decide the sequence like a designer orders a book: a strong opener, a quiet second, a surprise in the middle, a dark or very light closer.

Before anything else, write one sentence in your notes: "On this page, <the subject's own material> becomes <the device>."
Fill the first blank from your inventory of what only this client has (its name and what it means, its street, its numbers, its
constraint), then put the nearest competitor in the sentence: if it still works, the idea is the category's, not the client's.
Then name the one live thing the visitor can do on the page (SKILL.md step 4).

## 2. Composition
Sections are full-bleed fields, each at least 90svh tall, butted directly against each other with no gap and no divider. Inside every field the same 12-column grid and the same margins apply, and each field holds one thing: a huge heading (8–12vw) with a small paragraph, or one photograph with a caption, or one list. Text colour is chosen per field for strong contrast (ink or paper, never grey). Headings start on the same left edge in every chapter, so the eye feels the system as colours change. The navigation and the footer take the colours of the first and last chapter.

## 3. Type — Red Hat Display / Red Hat Text
A geometric black with round bowls and flat terminals, cleaner and more even than a grotesque at the same weight. Suits fintech, apps and portfolios that want heavy type with a tidy, technical finish.
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@900&family=Red+Hat+Text:wght@400;500&display=swap" rel="stylesheet">
```
- Display: **Red Hat Display** — weight 900 · tracking -0.03em · leading 0.92 · uppercase; centred three-line stacks work well
- Text: **Red Hat Text** — 400 for body, 500 for emphasis · leading 1.5 · tracking 0
```css
:root {
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2.5rem, 1.2rem + 5vw, 5.5rem);
}
```
One typeface in two weights. Headings very large and tight; body 18–20px. Because colour is loud, the type stays plain: no italics, no second face.
The direction decides sizes and how many of them; the type system decides how this face is set. Where the two give different tracking or leading, use the values of the type system: they are tuned to this face.
The display size itself comes from the hero blueprint below.

## 4. Colour
Kept from the brand. Four to six flat fields used at full strength, one per section, each with its assigned text colour. No tints, no gradients between them: the hard edge where two fields meet is the look.

## 5. Imagery
**The project has no photographs of its own yet.** First choice: **real pictures of the subject's world from the open collections**: its city and street in old postcards and photographs, an old map of the neighbourhood, its materials up close, its trade in engravings, museum objects of its kind (references/imagery.md §3). Start with `node /home/user/leonxlnx/taste-skill/skills/taste-skill/scripts/assets.mjs "organization founded"`, then queries from your inventory (its street, its materials, its trade's tools and history). Download what you use into the project with `--get` and credit every one on the page (`--credits` prints the footer line). They show the world around the client, never the client's own room, dish, product, person or team. Second, for what no honest picture exists of: draw the subject's own things in code, large, in one flat graphic language and the palette's real colours (its tiles, its windows, its objects; references/imagery.md §8). Third: the dealt photographs, only where an honestly generic picture fits (the sea, the weather, a material), never one a visitor could take for the thing itself and never an unrelated scene. One treatment for all of them. If this direction is built on photographs, plan the set before building (four to six pictures of one family) and reuse them at different crops and scales instead of finding or drawing a new picture for every slot; keep drawings as `<symbol>` + `<use>` or generate them with a small script so the page stays light. List every found picture (with its source and licence), every dealt photograph and every drawing that stands in for photography in your report.

Sparing. One photograph or object per chapter at most, either cut out and sitting directly on the colour, or a plain rectangle with generous colour around it. Photographs should be simple enough not to fight the field.

**Floor (the inspector checks it):** at least four real pictures on the page, usually six to twelve; SVG drawings do not count. One moving picture where an honest clip exists: `node <skill>/scripts/assets.mjs --video "<query>"`, used as a muted loop with a poster frame. Whatever this direction says about pictures, it is carried out with real ones.

Photographs dealt for this build, from the "People" set (figures, silhouettes and portraits, mostly unposed)
Order of preference for imagery: (1) the project's own photographs and product shots; (2) images you generate, if an image tool is
available; (3) real pictures of the subject's world found in the open collections (assets.mjs, downloaded and credited on the page);
(4) drawings of the subject in code; (5) these. They are real photographs (Unsplash licence, served by picsum.photos) of places, light and
texture. They are atmosphere, never a stand-in for a specific product, dish, person or interface. List the ones you use in your report so
they can be replaced.
- `https://picsum.photos/id/685/1600/1000` — Man sitting on a rock looking over a sea of clouds · mid tone · pale gold, grey, dark brown · calm area: right · native landscape · photo: Joshua Earle
- `https://picsum.photos/id/338/1600/1000` — Person in a hooded coat seen from behind facing a misty sea · mid tone · slate blue, grey, charcoal · calm area: left · native landscape · photo: Patryk Sobczak
- `https://picsum.photos/id/177/1600/1000` — Hiker with a backpack looking over a hazy mountain valley · mid tone · warm tan, hazy gold, olive · calm area: left · native landscape · photo: Danka & Peter
- `https://picsum.photos/id/669/1600/1000` — Person in a mustard jacket and grey beanie seen from behind in fog · light tone · mustard, pale grey, white · calm area: left · native landscape · photo: Luke Pamer
- `https://picsum.photos/id/1011/1600/1000` — Woman paddling a canoe on a turquoise lake edged by forest · mid tone · turquoise, dark green, rust red · native landscape · photo: Roberto Nickson
- `https://picsum.photos/id/821/1600/1000` — Woman seen from behind on a platform as a train blurs past · light tone · white, grey, black · black-and-white · calm area: left · native landscape · photo: Eutah Mizushima
- `https://picsum.photos/id/768/1600/1000` — Person sitting alone on a bench facing sandy dunes · light tone · sand beige, pale blue, soft white · calm area: top · native landscape · photo: Mikael Kristenson
- `https://picsum.photos/id/841/1600/1000` — Swimmer mid-stroke in a dark lake beneath moody mountains · dark tone · slate grey, dark blue, charcoal · calm area: top · native landscape · photo: Todd Quackenbush
The last two path numbers are width and height: request the exact crop you render (`/1200/1500` for a 4:5 portrait, `/2400/1350` for a hero) and
add `?grayscale` to desaturate. Use three to six of them, not all eight. Always set `width`, `height`, `alt` and `loading="lazy"` (not on the hero image).
Other sets that fit this brief: architecture, fog-and-quiet, mountain, forest — `node draw.mjs --photos <set>` prints one in full; `--photos list` shows all sets. Taking photographs from another set is your call and is not a redraw; keep them to one light and one treatment.

## 6. Hero — Stacked name, two inks
One saturated flat field covers the whole 1440×900 viewport and there is no image. The name is broken into two lines and set flush left from a 40px margin at clamp(110px, 15vw, 230px), heavy weight, tracking -0.04em, line-height 0.82 so the lines almost touch. The block starts 14% down and fills the top 58% of the screen; the longer line reaches at least column 11. Line one is set in the light ink and line two in the dark ink, so the break reads as a change of voice: split a two-word name between the lines, or break one long name with a hyphen at a syllable. The top edge carries only small text at 15px, 24px in: a monogram top-left, and two or three text links plus the single action as an underlined link top-right. The supporting sentence, 18px in the light ink and max 30ch, is right-aligned in the bottom-right corner on columns 9–12, its last line 40px above the bottom edge. The bottom-left corner stays empty. The next section begins as a different flat field exactly at the fold.

On a phone: The field fills 100svh. The name keeps its two lines and two inks at 21vw, flush left at a 16px margin, starting 18% down; a long name hyphenates rather than dropping below 18vw. The supporting sentence moves to the bottom-left at 16px across the full width, with the action as an underlined link beneath it, 24px above the bottom edge. The top-right links reduce to one word.
Headline: The name on exactly two lines, one per ink, each line up to about 8 characters at 15vw on desktop and 21vw on a phone.

Adjusted for this page:
- Its action is a text link: the primary action on the first screen is a real button (filled or solid-bordered, 44px or taller), placed where the blueprint puts the link. A second action may stay a link.

## 7. Sections, in order
Each is a composition to rebuild with this project's content. Keep the geometry; change the subject. Re-order or drop a
section when the argument of the page needs it (see references/copy.md), never to fall back to a card grid.

### 1. about — Inset panel, shaped portrait (split)
A deep-toned panel inset 20px from the page edges with a 12px radius, about 110svh tall, `overflow: hidden`. Left half: a two-line statement of four to seven words at clamp(40px, 4.4vw, 64px) in a pale ink, top-left with 56px padding; it is the heading and has nothing above it. Below it a photograph of the person or the workshop, masked with `clip-path` or an SVG `mask` to one bold shape taken from the subject (a four-lobed flower, a circle, an arch, a chamfered block), 38vw across, positioned so the panel's bottom edge crops its lowest fifth. Right side, starting at 63% of the width and 56px from the top: two text blocks 300px wide and 64px apart, each a subhead at 22px over a four-line paragraph at 15px; then one solid button in the accent colour. Between the statement and the text blocks the panel is empty. One photograph only.
On a phone: The panel is inset 10px and stacks: the statement at 8.5vw, then the two text blocks at full width, the button, and last the shaped photograph at 86vw across, centred and cropped by the panel's bottom edge by a quarter of its height.

Adjusted for this page:
- It names its own corners: use the one radius of this page (square unless the direction says otherwise) and one button shape.
- It sets a sentence large over several lines: jurors read that as a long headline. Either cut it to a two-line headline at display size, or keep it a statement at 36px or less on three lines (24px, four lines on a phone).

### 2. list — One item per poster line (statement)
A short list set as a poster. Four to seven items (services, headline acts, courses, opening days) stack one per line at clamp(64px, 10vw, 150px) in the display weight, all capitals or all lowercase, leading 0.92, flush left at a 20px margin on a flat field. Its one detail (a price, a date, a time range) sits at the right margin on the same baseline at 18–20px with tabular figures, so the page has two alignments only: giant words left, small facts right. Items too long for one line at this size are shortened, not shrunk. Between items there is only the tight leading. Hovering an item swaps its ink for the accent. There is no heading: the first item starts 80px below the section top and the last ends 80px above the bottom. The list reuses the hero title's exact type size, so it reads as another poster.
On a phone: Items at 15vw, one per line, flush left with 16px margins. Each detail moves beneath its item at 15px, left-aligned, with 6px above and 22px below. If any single word is wider than the screen at 15vw, drop the whole list to 12vw rather than breaking a word.

Adjusted for this page:
- It names a kind of typeface: use the dealt faces (display Red Hat Display, text Red Hat Text) and their settings; capitals only where the type system sets them.

### 3. gallery — Wall of word tiles (grid)
A gallery that works with no photographs: a four-column grid of identical square cells with 8px gaps running three or more rows, edge to edge with 8px margins. Each cell is a flat filled tile and centres one large element about 55% of the cell's width: a single word, a letter, a figure with its unit, or a simple inline SVG shape taken from the subject, set at clamp(56px, 9vw, 150px) in the display face. A one- or two-word caption at 14px sits centred 18px above the cell's bottom edge. Tile and ink colours rotate through three or four palette pairs in a fixed order, so a uniform grid looks varied. Where photographs exist, every third or fourth cell is a photograph covering its tile, all given one treatment. There is no hierarchy between cells: it is a specimen sheet. A heading is optional; if used, it occupies the first cell as that cell's word.
On a phone: Two columns with 6px gaps; cells stay square and the central element is set at 22vw. Captions stay at 13px. Twelve cells make six rows; if there are more than sixteen, show twelve and let the rest follow after a full-width tile holding a text link.

### 4. list — Statement, table pushed right (table)
A heading of four to six words spans the full width on two lines at clamp(40px, 4.5vw, 68px), left-aligned with its first line indented 3vw and leading 0.98. 96px below, the table is pushed into the right-hand five columns (8–12) and the left stays open. One plain word naming the table (offices, hours, rates) hangs at 14px in column 7, top-aligned with the first row. Each row is a three-part line at 15–16px with 26px between rows: the kind or day in the soft ink at the left of the measure, the place or service at 30%, and the address, time or price right-aligned, with a small arrow where the row links. Rows are separated by space only; every fourth row has 44px above it to form groups. In columns 1–4, bottom-aligned with the last row, one 4:5 photograph 22vw wide may sit alone. Holds 5–14 rows.
On a phone: Heading at 9.5vw without the indent. The table takes the full width at 16px; each row stacks the kind above the place, with the value right-aligned on the first line. The naming word is dropped because the heading already says it. The photograph follows at 60% width on the right margin.

### 5. contact — Address in display rows (list)
The contact block is a stack of five full-width rows, every one set at the same size, clamp(44px, 6vw, 88px), regular weight, left-aligned with a 20px inset and leading 1.0: the building or venue name, the street, the city with postcode, the opening hours as one compact line, the phone number. Each row is about 150px tall with the text sitting in its lower third; rows are told apart by alternating two flat tones of the section colour as full-width bands, or by 28px of space alone. A sixth row holds a one-word greeting at the same size followed, 24px to its right and centred on the x-height, by a solid round button 0.9em across with an arrow, which opens the email or booking link. Street and phone rows are links (map, call). No heading and no form. Optionally, one small round photograph sits at the right end of the first row.
On a phone: Rows at 9.6vw with 16px insets, about 84px tall; the hours break onto two rows (days, then times). The greeting row becomes a full-width band in the accent colour with the round arrow button at its right end, 56px across.

### 6. footer — The mark, built large (band)
On a flat colour field, the brand closes the page as a construction rather than as set type. Across the full content width and about 34svh tall, the wordmark is built from blocks: each letter is knocked out of its own solid rectangle in a palette colour, the rectangles differ in height (60–100% of the band) and butt together with 4px gaps, bottoms on one line. Where the project has a simple geometric mark or motif, enlarge that instead, drawn as inline SVG from flat rectangles, circles and quarter-arcs with the same 4px gaps. Below, 56px lower: four columns of plain links at 15px across columns 1–8, and two addresses or contact lines in columns 9–12. A last row carries the copyright at the left and one small filled button at the right. Space and the block construction do all the separating.
On a phone: The block wordmark spans the full width at about 22svh tall; a long name breaks into two rows of blocks. Link columns go two across at 15px, contact lines beneath at full width, then copyright and the small button on one row.

## 8. Motion — Masked headline
On load, each line of the headline rises from behind its own baseline, about 900ms with a strong ease-out, the second line 110ms after the first; the supporting sentence and the action then fade up together. Nothing else on the page performs. Because headlines are two lines at most, you author the line breaks and wrap each line yourself. Recipe: 'Masked line reveal' in references/motion.md.
This is the signature move, the one loud moment. Around it the page still needs the rest of the motion layer (SKILL.md step 9): an entrance for the parts of every section, feedback on every control, and one moving picture. The inspector fails a page that barely moves. Recipes: references/motion.md.

## 10. Where the richness comes from
Colour at scale. A whole screen of one saturated colour is rich on its own, so a chapter needs few elements; it still needs its content at full size, because a coloured screen with one small line on it reads as empty.

## 11. How this direction goes wrong
Check contrast on every field with the palette's assigned ink. Do not put cards on the fields. Do not use more than six colours. Two neighbouring fields should differ clearly in lightness as well as hue.

## 12. Real references
Studied sites that work this way. Take the principle, never the specifics: no names, copy, images or signature assets of theirs.
- **Paul Kalkbrenner** (Awwwards Site of the Day, studied score 8.1) `aww-paul-kalkbrenner`
  Idea: Swiss poster typography for a techno artist: the name as one black line with a photo set inside it like a glyph, then every chapter gets its own flat colour and visible grid.
  Hero: Pure white viewport. The artist's name sits on one line at exact vertical centre in bold black neo-grotesk, about 10.4vw, spanning roughly 78% of the width with equal side margins. The space between first and last name is replaced by a small landscape black-and-white photo, x-height tall and resting on the baseline. Top-left is a tiny circular monogram; eight nav links in 13px bold are spread at even intervals across the right half of the top edge. Bottom edge: equaliser bars with a grey label over a track title at left, a three-line bold blurb starting just left of centre, a sound toggle hard right. About 85% is empty.
  Worth taking: Replace the space between the two words of a giant name with a small photo cropped to x-height.
- **Ai in Design Report 2026** (Awwwards Site of the Day, studied score 8.4) `aww-ai-in-design-report-2026`
  Idea: A research report laid out like a colour-blocked print annual: a thermal-blurred video collage on top, an oversized tight grotesk title, and flat orange, lilac, sage and black blocks carrying stats, quotes and chapters.
  Hero: The top 53% is a full-width video band: blurred, heat-map-like abstract footage in orange, lilac and sage, overlaid with four or five hard-edged rectangles of the same footage in grey or green, two tagged with tiny mono labels in white boxes. The header sits flush on top: a black logo block at far left, an orange link tab running to 40% of the width, two plain links at right. Below the band, on white: a two-line deck at about 1.4vw on a 1% left margin, and from 42% across a two-line title at 8.3vw, medium weight, tracking -0.06em. Bottom row: mono credit left, scroll cue and arrow aligned to the title column.
  Worth taking: Start most headings and text at a fixed column line about 42% across, leaving the left for small decks, credits and chapter numbers.
Full notes on any of them: `node draw.mjs --site <id>`.

## Always
Headlines two lines or fewer at every width. No eyebrow labels, no monospace, no 01/02/03, no thin rules, no gradients, no shadows at rest,
no cream-and-terracotta, no violet. The frame: one h1 on the first screen that says what this is, equal outer margins, no
section huddled on one side with the other half empty, no blank stretch over half a screen, a heading on every section.
`inspect.mjs` measures all of it.

Saved to /home/user/kumasa-ph/.taste-skill/direction.json · reprint with `node draw.mjs --show`
