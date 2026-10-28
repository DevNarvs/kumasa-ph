# KUMASA Dark Cinematic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every page of the KUMASA site in the approved dark cinematic design. Photo slots stay as dark frames until real photos arrive.

**Architecture:**
- Same Next.js 15 static export, Tailwind v4 and content layer.
- New tokens and fonts replace the colour-chapters foundation.
- The home page is composed from focused section components under `components/home/`.
- Shared pieces (`Button`, `ImageSlot`, `FightCard`, `NewsList`, `JoinField`, `NameWriter`, `PageHeading`) are reused by the inner pages.
- The approved mockup `docs/superpowers/mockups/kumasa-dark.html` is the visual reference. Its CSS values are the source for every size, gap and colour.

**Tech Stack:**
- Next.js 15.5 (App Router, `output: 'export'`), React 19, TypeScript.
- Tailwind CSS v4 (`@theme`), `next/font/google`.
- Vitest + React Testing Library; Playwright.
- taste-skill scripts at `/home/user/leonxlnx/taste-skill/skills/taste-skill/scripts`.

**Spec:** `docs/superpowers/specs/2026-10-28-kumasa-dark-cinematic-design.md`

## Global Constraints

- **Fonts:** Archivo variable (`axes: ['wdth']`, weight `variable`) and Noto Sans Tagalog (`subsets: ['tagalog']`, weight `400`), both via `next/font/google`. Red Hat fonts are removed.
- **Tokens:** `--bg #0b0b0b`, `--surface #171717`, `--surface-2 #202020`, `--ink #f2f2f0`, `--muted #a8a6a1`, `--accent #d01c1f`, `--accent-ink #ffffff`, `--yellow #f2c300`, `--m clamp(20px, 2.8vw, 40px)`, `--gap clamp(96px, 12vw, 200px)`.
- **Type roles (CSS classes in `globals.css`):**
  - `.d-hero`: width 62%, weight 850, leading .8, tracking -.02em.
  - `.d-1`: width 62%, weight 800, `clamp(52px, 7.6vw, 124px)`, leading .9.
  - `.d-2`: width 70%, weight 750, `clamp(28px, 3.3vw, 50px)`, leading 1.
  - `.statement`: `clamp(22px, 2.3vw, 34px)`, leading 1.25.
  - Body 18px/1.5; small 15px in `--muted`.
- **Hero name size:** `30.6vw` at ≥701px, `28.4vw` at ≤700px. The footer name uses the same sizes.
- **House rules:**
  - No eyebrow labels, tiny tracked caps, monospace, 01/02 numbering, 1px borders or rules, gradients (except the 35% black scrim), shadows at rest, backdrop blur, emoji, or styled accent words.
  - Headings are at most two lines at 1440/768/390.
- **Motion:** transform and opacity only. Everything is disabled under `prefers-reduced-motion: reduce`, and content is never left hidden without script.
- **Content:** visible `[Placeholder]` prefixes are replaced with the mockup's sample copy. `README.md` lists every sample item.
- **Branch:** commit on `claude/busy-mendel-cjwanz`. Every commit message ends with the two attribution lines given in the session.
- **Checks (must pass at the end of each task):** `npm run lint && npm run typecheck && npm test`. Tasks that change pages also run `npm run build`.

## Review Focus

1. **No upcoming events** (empty `events.yml`, or every date in the past): the home section still renders its heading, the sentence "No events announced yet." and the "Register a club" button. Test in Task 6.
2. **Name writer input that is empty, digits, punctuation or 18 characters:**
   - empty shows ᜃᜓᜋᜐ and "KUMASA";
   - characters with no Baybayin letter pass through;
   - long names wrap inside the disc.
   Test in Task 5.
3. **Few items:** an album with no images, a post with no cover, an officer with no photo, fewer than five gallery images, or zero news posts. Each renders a flat surface frame or its empty state without crashing. Tests in Tasks 2, 7 and 9.
4. **Reduced motion:** with `prefers-reduced-motion: reduce`, `Reveal` never marks children pending and the hero letters are visible. Test in Task 4.
5. **The absolutely positioned header overlapping a page's `h1`** on inner pages and phones: the `h1` top must be at or below the header bottom. e2e test in Task 11.

---

### Task 1: Content model and dark-frame placeholders

**Files:**
- Modify: `lib/content.ts`, `lib/format.ts`
- Modify: `content/site.md`, `content/about.md`, `content/albums/*.md`, `content/news/*.md`, `content/officers.yml`, `content/timeline.yml`
- Create: `content/events.yml`
- Create/replace: `public/images/placeholder/*.svg`
- Test: `tests/content.test.ts`, `tests/format.test.ts`, `tests/fixtures/content/**`

**Interfaces:**
- Produces:
  - `SiteInfo` gains `description: string`, `heroImage: string`, `heroAlt: string`.
  - `About` gains `facts: string[]` and `programmesIntro: string`.
  - `Activity` gains `href: string` and `image: string`.
  - `type EventItem = { date: string; title: string; venue: string; detail: string; main: boolean; image?: string }`
  - `getEvents(root?: string, today?: string): EventItem[]`. `today` defaults to the current UTC date as `YYYY-MM-DD`. The result holds events on or after `today`, soonest first.
  - `formatDayMonth(iso: string): { day: string; month: string }`, e.g. `'2026-12-06'` → `{ day: '6', month: 'Dec' }` (UTC, no leading zero, month as `en-US` short).

- [ ] **Step 1: Write failing tests** in `tests/content.test.ts`. Add fixtures:
  - `tests/fixtures/content/events.yml` with four entries:
    - 2026-01-10 "Past meet";
    - 2026-11-15 "Open", `main: true`;
    - 2026-12-06 "Grading";
    - 2027-01-24 "Seminar".
  - `bad-events-main/events.yml` with two `main: true`.
  - `bad-events-date/events.yml` with `date: next week`.
  - The new fields in fixture `site.md` and `about.md`, also in `bad-word/` and `bad-detail/` `about.md`, so those keep failing only on word and detail.

```ts
test('getEvents keeps events on or after today, soonest first', () => {
  expect(getEvents(root, '2026-10-28').map((e) => e.title)).toEqual(['Open', 'Grading', 'Seminar']);
});
test('getEvents includes an event dated today', () => {
  expect(getEvents(root, '2026-11-15')[0].title).toBe('Open');
});
test('getEvents defaults main to false and reads main: true', () => {
  expect(getEvents(root, '2026-10-28').map((e) => e.main)).toEqual([true, false, false]);
});
test('getEvents returns [] when events.yml is missing', () => {
  expect(getEvents(badRoot, '2026-10-28')).toEqual([]);
});
test('getEvents rejects two main events, naming events.yml', () => {
  expect(() => getEvents(badEventsMainRoot, '2026-10-28')).toThrow(/events\.yml.*main/);
});
test('getEvents rejects a non-ISO date, naming events.yml', () => {
  expect(() => getEvents(badEventsDateRoot, '2026-10-28')).toThrow(/events\.yml.*date/);
});
test('getSite exposes description, heroImage and heroAlt', () => { /* fixture values */ });
test('getAbout exposes facts, programmesIntro, and href and image per activity', () => { /* fixture values */ });
test('getAbout rejects a fact longer than 32 characters', () => { /* bad-fact fixture */ });
```

  In `tests/format.test.ts`:

```ts
expect(formatDayMonth('2026-12-06')).toEqual({ day: '6', month: 'Dec' });
expect(formatDayMonth('2027-01-24')).toEqual({ day: '24', month: 'Jan' });
```

  Update the "placeholder content" tests:
  - all getters load, including `getEvents(undefined, '2026-10-28')`, which has length 4;
  - activities' titles are `['Training', 'Competition', 'Gradings and seminars', 'Community']`;
  - no visible content string contains `[Placeholder]`;
  - keep the empty album, the cover-less post and the photo-less officer.

- [ ] **Step 2: Run** `npx vitest run tests/content.test.ts tests/format.test.ts`. Expected: FAIL (`getEvents` is not exported, and the fields are missing).

- [ ] **Step 3: Implement** the new getters and fields in `lib/content.ts` with the existing helpers:
  - `requireString`;
  - a new `requireStringList(data, key, file, max)`;
  - `normalizeDate`;
  - `ContentError` messages: `at most one event may set "main"`, and `fact must be at most 32 characters`.
  - A missing `events.yml` returns `[]`.
  - Add `formatDayMonth` to `lib/format.ts`.

- [ ] **Step 4: Rewrite the content files** with the mockup's copy:
  - **`site.md`:**
    - `description: We train, grade and compete in Kuntaw, the Filipino martial art, across the Philippines.`
    - `heroImage: /images/placeholder/hero.svg`
    - `heroAlt: Sparring final at the National Open`
    - `email: info@kumasa.ph`
    - `phone: +63 917 000 0000`
    - `address: Quezon City, Philippines`
  - **`about.md`:**
    - `statement: One home for Kuntaw`
    - excerpt: `KUMASA brings Kuntaw clubs, coaches and fighters under one badge, so a student in any club trains to the same standard.`
    - `facts: [Since 2015, Kuntaw, Clubs across the Philippines]`
    - `programmesIntro: From a first class at your local club to a national final, every programme follows the same KUMASA syllabus.`
    - The four activities, with titles, descriptions, `href` and `image` from the mockup:
      - Training: `/contact`, `programme-training.svg`
      - Competition: `/#events`, `programme-competition.svg`
      - Gradings and seminars: `/#events`, `programme-grading.svg`
      - Community: `/contact`, `programme-community.svg`
  - **`events.yml`:** the mockup's four events:
    - 2026-11-15 National Open, Cebu City Sports Center, "Sparring and forms, all divisions", main, `event-national-open.svg`;
    - 2026-12-06 Black belt grading, Quezon City, "Grading, by invitation";
    - 2027-01-24 Coaches' seminar, Davao City, "Seminar, two days";
    - 2027-02-21 Visayas inter-club meet, Iloilo City, "Sparring, juniors and seniors".
  - **News:** the three posts become:
    - "Team named for the National Open" (2026-10-12, cover);
    - "New club opens in Bacolod" (2026-09-28, cover);
    - "Referee course dates announced" (2026-09-03, no cover).
    - Rename the files to match their dates and slugs, and update the e2e route in Task 11.
  - **Albums:** titles stay. Alt texts become plain descriptions.
  - **Officers and timeline:** drop the `[Placeholder]` prefixes.

- [ ] **Step 5: Redraw the placeholder SVGs** as flat frames with Archivo-free text (`font-family: sans-serif`):
  - **Wide** (1600×1000, `#171717` fill, caption 30px `#a8a6a1` at x=48 y=72):
    - `hero.svg`: caption right-aligned at x=1552 y=150, "Photo: sparring final, National Open";
    - the four `programme-*.svg`, with the mockup captions.
  - **Square** (1000×1000, caption centred): `event-national-open.svg`, `events-1..6.svg`, `training-1..4.svg`, `news-1..2.svg`, `officer-1.svg`. Captions are "Photo: Events 1" etc.

- [ ] **Step 6: Run** `npx vitest run tests/content.test.ts tests/format.test.ts`. Expected: PASS.

- [ ] **Step 7: Commit:** `feat: content model for dark cinematic design (events, facts, hero image)`.

### Task 2: Foundation (tokens, fonts, Button, ImageSlot, removals)

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`, `components/ImageSlot.tsx`
- Create: `components/Button.tsx`
- Delete:
  - `components/Field.tsx`, `components/BlockMark.tsx`, `components/MaskedLines.tsx`, `lib/tones.ts`
  - `components/Hero.tsx`, `components/SectionHeading.tsx`, `components/NewsCard.tsx`, `components/OfficerCard.tsx`, `components/TimelineList.tsx`
  - `public/images/baybayin-rule.svg`
  - the tests for these: `tests/Field.test.tsx`, `tests/BlockMark.test.tsx`, `tests/tones.test.ts`, and the related blocks in `tests/home.test.tsx` and `tests/layout.test.tsx`
- Test: `tests/Button.test.tsx`, `tests/ImageSlot.test.tsx`

**Interfaces:**
- Produces:
  - `Button({ href, children, variant = 'accent', arrow = true, className? }: { href: string; children: ReactNode; variant?: 'accent' | 'ink'; arrow?: boolean; className?: string })`.
    - Renders `next/link` for paths starting with `/` or `#`, and `<a>` otherwise (`mailto:`, `https:`).
    - Square and flat; `min-h-14`, `px-7`, 18px, weight 700, width 85%.
    - `accent` = `--accent` fill with `--accent-ink` text; `ink` = `--bg` fill with `--ink` text.
    - The arrow is `<span aria-hidden="true">→</span>`, which moves 5px on hover.
  - `ImageSlot({ src?, alt, shape = 'video', className? })`:
    - `shape: 'video' | 'square' | 'round' | 'fill'`;
    - `round` = `aspect-square rounded-full`; `fill` = `absolute inset-0`;
    - always on a `--surface` fill.
    - With no `src`, a plain `role="img"` div with `aria-label={alt}` and no star or stripes.
  - CSS classes `.d-hero .d-1 .d-2 .statement .wrap` (`padding-inline: var(--m)`) and the `@keyframes open, drift, rise` from the mockup, all in `globals.css`.
  - The font CSS variables `--font-archivo` and `--font-noto-tagalog`.

- [ ] **Step 1: Write failing tests:**
  - `Button`: an internal href renders an `<a>` with `href="/contact"`; `href="mailto:x@y"` renders an `<a>`; `variant="ink"` adds the ink class; `arrow={false}` renders no `→`.
  - `ImageSlot`:
    - `shape="round"` has `rounded-full`;
    - with no src there is no `★` and no `<img>`, and `getByRole('img', { name: alt })` exists;
    - with a src it renders `<img>` with that alt.
- [ ] **Step 2: Run** `npx vitest run tests/Button.test.tsx tests/ImageSlot.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement:**
  - `Button` and `ImageSlot`.
  - Replace `globals.css` tokens and type classes with the Global Constraints values. Drop `.hero-splatter` and the old `--color-gold` usages, and keep `.post-body` restyled to full ink.
  - Switch `layout.tsx` fonts to Archivo plus Noto Sans Tagalog.
  - Rename `ImageSlot`'s `aspect` prop to `shape` at every call site (`GalleryGrid`, `Lightbox` if used, the news pages).
  - Delete the listed files and their tests. Fix the remaining imports (the pages are rewritten in later tasks; for now replace removed components with plain markup so the build stays green).
- [ ] **Step 4: Run** `npm run lint && npm run typecheck && npm test && npm run build`. Expected: all pass.
- [ ] **Step 5: Commit:** `feat: dark cinematic tokens, Archivo, Button and flat ImageSlot`.

### Task 3: Header and footer

**Files:**
- Modify: `components/Header.tsx`, `components/SiteHeader.tsx`, `components/Footer.tsx`, `lib/nav.ts`, `app/layout.tsx`
- Test: `tests/Header.test.tsx`, `tests/SiteHeader.test.tsx`, `tests/layout.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 2), `SiteInfo` (Task 1).
- Produces:
  - `navLinks = [{ href: '/about', label: 'About' }, { href: '/#events', label: 'Events' }, { href: '/gallery', label: 'Gallery' }, { href: '/news', label: 'News' }]`.
  - `footerLinks = [...navLinks, { href: '/contact', label: 'Contact' }]`.
  - `SiteHeader` renders `<Header />` positioned `absolute inset-x-0 top-0 z-50` with `px-[var(--m)] py-5`.

- [ ] **Step 1: Update tests:**
  - **Header:**
    - the home link has name "KUMASA home" and contains the visible text "KUMASA";
    - the Main nav has the four links above;
    - a "Join a club" link points to `/contact`;
    - the mobile menu button toggles `aria-expanded`;
    - Escape closes it and returns focus;
    - Tab wraps (the existing tests are kept).
  - **Footer:**
    - a `p` with "KUMASA" is `aria-hidden`;
    - the Footer nav has the five links plus "Back to top" (`#main`);
    - the email shows as text;
    - the line `Kuntaw Unified Martial Sports Advocates. Filipino martial art, since 2015.`.
- [ ] **Step 2: Run** `npx vitest run tests/Header.test.tsx tests/layout.test.tsx tests/SiteHeader.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** to the mockup's `.bar`, `.brand`, `.nav` and `.foot` rules:
  - The header uses no `Field`. The mobile panel is `fixed inset-0 bg-[var(--bg)]` with 52px d-1 links.
  - The footer name uses `.d-hero` at the hero sizes.
- [ ] **Step 4: Run** `npm run lint && npm run typecheck && npm test`. Expected: PASS.
- [ ] **Step 5: Commit:** `feat: dark cinematic header and footer`.

### Task 4: Motion primitives (Reveal stagger, SpinBadge)

**Files:**
- Modify: `components/Reveal.tsx`
- Create: `components/SpinBadge.tsx`
- Test: `tests/Reveal.test.tsx`, `tests/SpinBadge.test.tsx`

**Interfaces:**
- Produces:
  - `Reveal({ children, stagger = false, as = 'div', className? })`:
    - with `stagger`, each direct child gets `data-pending` and `style.transitionDelay = i*80ms` until the group intersects;
    - the pending style is `opacity: 0; transform: translateY(28px)` via `[data-pending]` in `globals.css`;
    - groups already on screen at mount, with reduced motion, or without IntersectionObserver never get `data-pending`.
  - `SpinBadge({ src, alt, size })`: a client `<img>` that sets `style.transform = rotate(p*-24deg)` on scroll, with `p` = offset of its centre from the viewport centre ÷ viewport height. No listener under reduced motion.

- [ ] **Step 1: Write failing tests** with mocked `IntersectionObserver`, `matchMedia` and `getBoundingClientRect`:
  - children below the fold get `data-pending` and delays `0ms`, `80ms`, `160ms`;
  - firing the intersection removes `data-pending`;
  - with `matchMedia('(prefers-reduced-motion: reduce)').matches = true`, no child gets `data-pending`;
  - SpinBadge sets no transform under reduced motion, and sets `rotate(...)` after a scroll event otherwise.
- [ ] **Step 2: Run** `npx vitest run tests/Reveal.test.tsx tests/SpinBadge.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** both, plus the `[data-pending]` CSS and its transition (`opacity .7s, transform .8s cubic-bezier(.2,.7,.1,1)`).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit:** `feat: staggered Reveal and scroll-turned badge`.

### Task 5: Name writer

**Files:**
- Create: `components/NameWriter.tsx`
- Test: `tests/NameWriter.test.tsx`

**Interfaces:**
- Consumes: `toBaybayin(input: string): string` from `lib/baybayin.ts`.
- Produces: `NameWriter({ id = 'baybayin-name' })`:
  - a client component;
  - a black disc holding: the yellow star SVG (24×24 path from the mockup), the output with `lang="tl-Tglg"` in `font-[family-name:var(--font-noto-tagalog)]` at `clamp(52px, 5vw, 76px)` with `break-all`, and the Latin caption in 15px muted;
  - the disc is `aria-live="polite"`;
  - below it, a `<label for={id}>Your name in Baybayin, as on our badge</label>` and an `<input id={id} maxLength={18} autoComplete="given-name" placeholder="Type your name">` filled `--bg` with no border.

- [ ] **Step 1: Write failing tests:**
  - it renders ᜃᜓᜋᜐ and "KUMASA" initially;
  - typing "Ana" shows ᜀᜈ and caption "Ana";
  - clearing restores ᜃᜓᜋᜐ and "KUMASA";
  - typing "Jo 2" shows `toBaybayin('Jo 2')`, with the digit passed through;
  - the input has `maxlength="18"`;
  - the label is associated with the input (`getByLabelText`).
- [ ] **Step 2: Run** `npx vitest run tests/NameWriter.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** `NameWriter`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit:** `feat: Baybayin name writer`.

### Task 6: Home, part one (hero, intro, programmes, events)

**Files:**
- Create: `components/home/HomeHero.tsx`, `components/home/HomeIntro.tsx`, `components/home/Programmes.tsx`, `components/FightCard.tsx`, `components/home/EventsSection.tsx`
- Test: `tests/home-sections.test.tsx`

**Interfaces:**
- Consumes: `SiteInfo`, `About`, `EventItem`, `formatDayMonth`, `Button`, `ImageSlot`, `Reveal`, `SpinBadge`.
- Produces:
  - `HomeHero({ site }: { site: SiteInfo })`:
    - `h1` with `aria-label={site.name}` and one `<span>` per letter;
    - the lede is `` `${site.fullName}. ${site.description}` `` as `p.statement`;
    - `<Button href="/contact">Join a club</Button>`;
    - the hero image `ImageSlot shape="fill"` sits inside a `160vmax` round wrapper animated with `open` then `drift`.
  - `HomeIntro({ about, logoSrc })`: `h2.d-1` `about.statement`, the excerpt `p.statement`, `ul` of facts, and `SpinBadge` in columns 8–12.
  - `Programmes({ about })`:
    - `section#programmes` with `h2` "Programmes" and the intro;
    - four `<Link href={activity.href}>` panels in mockup grid positions (classes `p-1..p-4`);
    - each has `h3.d-2` and the description over the 35% scrim.
  - `FightCard({ items })`:
    - `items: { key: string; big: string; small?: string; title: string; where?: string; detail?: string; href?: string; main?: boolean; image?: string; imageAlt?: string }[]`;
    - renders an `<ol>`; each `<li>` is a single link when `href` is set, otherwise a plain row;
    - main rows get the round frame and the larger title.
  - `EventsSection({ events })`:
    - `section#events` with `h2` "Coming up" and `<Button href="/contact" variant="ink">Register a club</Button>`;
    - `FightCard` with `big = day`, `small = month`, `href = '/contact'`;
    - with no events, `p` "No events announced yet.".

- [ ] **Step 1: Write failing tests:**
  - HomeHero: the h1 accessible name is "KUMASA"; the lede contains the full name and description; the Join link points to `/contact`.
  - HomeIntro: the h2 is "One home for Kuntaw"; three facts; the badge alt starts with "The KUMASA badge".
  - Programmes: four links with names containing their titles and the hrefs from content.
  - EventsSection:
    - three events render three links in date order;
    - the main event row has an `img` or role img for its frame;
    - "15" and "Nov" are visible;
    - `events=[]` shows "No events announced yet." and the Register link.
- [ ] **Step 2: Run** `npx vitest run tests/home-sections.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** the five components to the mockup's `.hero`, `.home`, `.prog`/`.mosaic`/`.panel` and `.events`/`.bout` rules, including the tablet (≤1020px) and phone (≤700px) layouts.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit:** `feat: home hero, intro, programmes and events`.

### Task 7: Home, part two (gallery strip, news, join) and the page

**Files:**
- Create: `components/home/GalleryStrip.tsx`, `components/NewsList.tsx`, `components/JoinField.tsx`
- Modify: `app/page.tsx`
- Test: `tests/home.test.tsx` (rewritten)

**Interfaces:**
- Consumes: Task 6 components, `NameWriter`, `getSite/getAbout/getEvents/getAlbums/getNewsPosts`, `formatDate`.
- Produces:
  - `GalleryStrip({ albums })`:
    - `section#gallery` with `h2` "From the mat" and `<Button href="/gallery" variant="ink">Open the gallery</Button>`;
    - a `ul` of the first five images across albums, each a link to `/gallery` with a round `ImageSlot` and the album title.
  - `NewsList({ posts, lead = true })`:
    - the lead (first post): round cover `ImageSlot`, `h3.d-2` title linking to `/news/{slug}`, `time` with `formatDate`, and the excerpt;
    - the remaining posts are rows: `h3` title, then `time`;
    - with no posts, `p` "No news yet".
  - `JoinField({ site, heading = 'Train with us', as = 'section' })`:
    - `section#join` on `--accent`;
    - `h2` (or `h1` when `as="header-page"`, used by Contact);
    - statement `Find a club near you, or start one. Write to us and the nearest KUMASA coach will reply.`;
    - `<Button href={mailto with subject "Joining KUMASA"} variant="ink">Write to us</Button>`;
    - the email and socials as text;
    - a `children` slot on the right that defaults to `<NameWriter />`.
  - `app/page.tsx` composes, in order: HomeHero, HomeIntro, Programmes, EventsSection, GalleryStrip, a News section (`h2` "News", `NewsList` with the first three posts, link "All news" to `/news`), JoinField.

- [ ] **Step 1: Rewrite `tests/home.test.tsx`.** Mock content with five posts and a two-album set holding six images.
  - The page has exactly one h1, plus h2s in this order: `One home for Kuntaw`, `Programmes`, `Coming up`, `From the mat`, `News`, `Train with us`.
  - The strip has five items, labelled with album titles.
  - The news lead is the newest post; there are two rows (posts 2 and 3 only).
  - The Join mailto contains `subject=Joining%20KUMASA`.
  - The name-writer input is present.
  - With `getAlbums` returning a single empty album, the strip renders zero items and no crash.
  - With `getNewsPosts` returning `[]`, "No news yet" shows.
- [ ] **Step 2: Run** `npx vitest run tests/home.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** the three components and the page.
- [ ] **Step 4: Run** `npm run lint && npm run typecheck && npm test && npm run build`. Expected: PASS.
- [ ] **Step 5: Commit:** `feat: home gallery strip, news, join field and page`.

### Task 8: About and not-found

**Files:**
- Modify: `components/PageHeading.tsx`, `app/about/page.tsx`, `app/not-found.tsx`
- Test: `tests/about.test.tsx`, `tests/notfound.test.tsx`

**Interfaces:**
- Consumes: `FightCard`, `ImageSlot`, `JoinField`, `Reveal`, `Button`.
- Produces: `PageHeading({ title, intro? })`:
  - a `header` with `pt-[clamp(140px,14vw,220px)]` and `.wrap`;
  - `h1.d-1`;
  - an optional `p.statement`, max 36ch.

- [ ] **Step 1: Write failing tests:**
  - **About:**
    - h1 "About KUMASA";
    - h2s "One home for Kuntaw", "Our history" and "Our officers";
    - the timeline as an `ol` with years 2015 first;
    - officers as a list of round frames showing name and role;
    - the officer without a photo renders a role img (no `<img>`);
    - the Join field is present.
  - **Not found:** h1 "Page not found"; a "Back to home" link to `/`.
- [ ] **Step 2: Run** `npx vitest run tests/about.test.tsx tests/notfound.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** both pages:
  - About: the story in a 12-column split, then History via `FightCard` (`big = year`), then the officers strip (same grid as GalleryStrip).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit:** `feat: about and not-found pages in the dark design`.

### Task 9: Gallery, news index and article

**Files:**
- Modify: `app/gallery/page.tsx`, `components/GalleryGrid.tsx`, `components/Lightbox.tsx`, `app/news/page.tsx`, `app/news/[slug]/page.tsx`
- Test: `tests/GalleryGrid.test.tsx`, `tests/gallery-page.test.tsx`, `tests/Lightbox.test.tsx`, `tests/news.test.tsx`

**Interfaces:**
- Consumes: `PageHeading`, `NewsList`, `ImageSlot`, `JoinField`, `Button`.
- Produces: no new exports.
- GalleryGrid filter buttons:
  - flat square, `min-h-12 px-5`, `--surface` fill;
  - the pressed one is ink-filled with `--bg` text.
- The square frame grid has 2, 3 or 4 columns with a 12px gap.
- The Lightbox keeps its behaviour, on a `--bg` backdrop with square buttons.

- [ ] **Step 1: Update tests:**
  - **Existing behaviour still passes:** filter, open, next, close, focus return.
  - **Filter buttons:** no `border` class; the pressed state is via `aria-pressed`.
  - **Seminars album selected:** shows "No photos yet".
  - **News index:** h1 "News"; the lead is the newest post; the other two are rows.
  - **Article:**
    - the h1 is the post title with class `d-2`;
    - the date follows the h1;
    - the cover-less post renders a role-img frame;
    - "All news" links to `/news`.
- [ ] **Step 2: Run** `npx vitest run tests/GalleryGrid.test.tsx tests/gallery-page.test.tsx tests/Lightbox.test.tsx tests/news.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** the restyles and page compositions. The Join field closes the gallery, news and article pages.
- [ ] **Step 4: Run** the same command, then `npm run build`. Expected: PASS.
- [ ] **Step 5: Commit:** `feat: gallery, news and article in the dark design`.

### Task 10: Contact

**Files:**
- Modify: `app/contact/page.tsx`, `components/ContactForm.tsx`
- Test: `tests/ContactForm.test.tsx`, `tests/contact-page.test.tsx`

**Interfaces:**
- Consumes: `JoinField` (h1 mode), `ContactForm({ endpoint?, email })`, unchanged.
- The page is `JoinField` with `as="header-page"` and `heading="Contact KUMASA"`. Its right slot holds `ContactForm`; the page top padding clears the header.
- Form fields:
  - filled `--bg`, no border, `min-h-14`, ink text;
  - `focus-visible:outline-[3px] outline-[var(--accent-ink)]`;
  - the submit is `--bg`-filled, square and flat.

- [ ] **Step 1: Update tests:**
  - The existing ContactForm behaviour tests still pass.
  - The contact page has one h1, "Contact KUMASA".
  - With no endpoint, the mailto sentence shows.
  - The phone and address show as text.
- [ ] **Step 2: Run** `npx vitest run tests/ContactForm.test.tsx tests/contact-page.test.tsx`. Expected: FAIL on the page test.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm run lint && npm run typecheck && npm test && npm run build`. Expected: PASS.
- [ ] **Step 5: Commit:** `feat: contact page on the red field`.

### Task 11: E2E, README, taste-skill gate

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`, `README.md`
- Modify: `docs/superpowers/plans/2026-10-28-kumasa-redesign.md` (add a "Superseded by 2026-10-28-kumasa-dark-cinematic.md" note at the top)

**Interfaces:**
- Consumes: the built `out/`.

- [ ] **Step 1: Extend the e2e tests:**
  - Routes use the renamed news slug.
  - **New tests:**
    - typing "Ana" into "Your name in Baybayin, as on our badge" on `/` shows ᜀᜈ;
    - `/` shows four rows under "Coming up";
    - the Events nav link from `/about` lands on `/#events`, and the `#events` section is in the viewport;
    - on every route at 390 and 1440, the `h1` top is ≥ the header's bottom;
    - with `reducedMotion: 'reduce'`, all six hero letter spans have computed opacity 1.
  - Keep the existing tests: the mobile menu, the lightbox, no horizontal scroll, and 404.
- [ ] **Step 2: Run** `npm run build && npm run e2e`. Expected: all pass. Fix any failure in the owning component, then re-run.
- [ ] **Step 3: Run the taste gate:**
  - `node <skill>/scripts/lint.mjs app components`. Expected: 0 FAIL.
  - Serve `out/`, then `CHROME_PATH=<scratchpad>/chrome-nosandbox.sh node <skill>/scripts/inspect.mjs http://localhost:4173/`. Expected: 0 FAIL other than `few-pictures` and `blank-gap`.
  - Read every listed screenshot.
  - Write the critique in the `references/critique.md` §4 shape to `.taste-skill/critique-dark.md`.
  - Fix the top three problems and re-inspect, at most three rounds.
- [ ] **Step 4: Update `README.md`:**
  - the design summary and a link to the spec;
  - the `events.yml` format, and that past events disappear at the next build;
  - how to swap a dark frame for a real photo (replace the path in content);
  - the full list of sample content to replace before launch: events, news, album alt texts, officers, timeline, contact details, `heroImage`, and the programme images.
- [ ] **Step 5: Run** `npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`. Expected: all pass.
- [ ] **Step 6: Commit and push:** `docs: README and e2e for the dark cinematic site`, then `git push -u origin claude/busy-mendel-cjwanz`.
