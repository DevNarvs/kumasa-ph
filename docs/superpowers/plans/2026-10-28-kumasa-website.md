# KUMASA Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static KUMASA organization website (home, about, gallery, news, contact) with a logo-derived dark design.

**Architecture:** Next.js App Router site exported statically. All content is Markdown/YAML in `content/`, parsed at build time by a single content module (`lib/content.ts`); pages and components only consume its typed functions. `ImageSlot` is the only place that decides placeholder vs. real image.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, `gray-matter`, `remark` + `remark-html`, `yaml`, Vitest + React Testing Library, Playwright. Node v22 / npm 10 are installed.

**Spec:** `docs/superpowers/specs/2026-10-28-kumasa-website-design.md`

## Global Constraints

- `next.config` uses `output: 'export'` and `images: { unoptimized: true }`; no server code, no database.
- Dark-only theme. Color tokens exactly: base `#0A0A0A`, surface `#141414`, text `#F5F5F5`, muted `#A3A3A3`, accent `#D01C1F`, gold `#F2C300`, blue `#1B3FA0`.
- Fonts via `next/font/google`: `Oswald` (display), `Inter` (body).
- Org name "KUMASA", full name "Kuntaw Unified Martial Sports Advocates", tagline "Filipino Martial Art", founded 2015.
- Routes: `/`, `/about`, `/gallery`, `/news`, `/news/[slug]`, `/contact`, plus `not-found`.
- Mobile-first; single column under 768px. WCAG 2.1 AA contrast; every image has alt text; visible focus ring.
- All motion honors `prefers-reduced-motion`.
- Each component in its own file under `components/`. Content errors must fail the build with a message naming the file.
- Out of scope: light mode, auth, CMS, payments, i18n, event registration.
- All body copy, officers, news, and photos are placeholders; mark placeholder copy with a leading `[Placeholder]` so it is findable.

## Review Focus

1. Album with zero images — gallery shows an empty state instead of crashing (Task 6).
2. Unknown news slug — resolves to the not-found page, not a build error or blank page (Task 7).
3. Officer without `photo` / news post without `cover` — placeholder renders with alt text (Task 3).
4. Lightbox at first/last image and on close — arrows stop at the ends and focus returns to the thumbnail that opened it (Task 6).
5. Contact form with no endpoint env var — falls back to a `mailto:` link rather than a dead form (Task 8).

---

### Task 1: Scaffold, tooling, design tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (stub), `tests/smoke.test.tsx`, `.gitignore`
- Copy: `assets/kumasa-logo.webp` → `public/images/kumasa-logo.webp`

**Interfaces:**
- Produces: Tailwind theme tokens `base`, `surface`, `text`, `muted`, `accent`, `gold`, `blue` (usable as `bg-base`, `text-gold`, …); font CSS variables `--font-display`, `--font-body`; npm scripts `dev`, `build`, `lint`, `typecheck`, `test`, `e2e`.

- [ ] **Step 1:** Initialize in the repo root (`git` already present): `npx create-next-app@15 . --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm`, then `npm i gray-matter remark remark-html yaml` and `npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test`. Confirm Tailwind resolves to v4 (`npm ls tailwindcss`); if it does not, stop and report.
- [ ] **Step 2: Write the failing test** `tests/smoke.test.tsx`: renders `app/page.tsx` default export and asserts `screen.getByRole('heading', { level: 1 })` has text `KUMASA`.
- [ ] **Step 3: Run** `npx vitest run tests/smoke.test.tsx` — Expected: FAIL (stub page has no such heading).
- [ ] **Step 4: Implement** configs and tokens: `next.config.mjs` with the two export settings; Vitest with jsdom + `vitest.setup.ts` importing `@testing-library/jest-dom/vitest`; tokens declared in `app/globals.css` via Tailwind v4 `@theme`, body background `base`; `app/layout.tsx` loads both fonts and sets `<html lang="en">`; add scripts `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `e2e` (`playwright test`); `app/page.tsx` renders `<h1>KUMASA</h1>`.
- [ ] **Step 5: Run** `npm run test && npm run lint && npm run typecheck && npm run build` — Expected: all pass; `out/index.html` exists.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: scaffold static Next.js site with tokens and tooling"`

### Task 2: Content layer

**Files:**
- Create: `lib/content.ts`, `tests/content.test.ts`, `tests/fixtures/content/` (small valid fixture set + `bad/` with one malformed file)

**Interfaces:**
- Produces (all take optional `root: string = path.join(process.cwd(), 'content')`):
  - `type SiteInfo = { name: string; fullName: string; tagline: string; founded: number; email: string; phone: string; address: string; socials: { label: string; url: string }[] }`
  - `type TimelineEntry = { year: number; title: string; description: string }`
  - `type Officer = { name: string; role: string; bio: string; photo?: string }`
  - `type Album = { slug: string; title: string; description: string; images: { src: string; alt: string }[] }`
  - `type NewsPost = { slug: string; title: string; date: string /* YYYY-MM-DD */; excerpt: string; cover?: string; html: string }`
  - `getSite(root?): SiteInfo`, `getAbout(root?): { title: string; excerpt: string; activities: { title: string; description: string }[]; html: string }` (`excerpt` and `activities` come from `about.md` frontmatter; `html` is the body), `getTimeline(root?): TimelineEntry[]` (ascending by year), `getOfficers(root?): Officer[]`, `getAlbums(root?): Album[]`, `getNewsPosts(root?): NewsPost[]` (newest first; ties by slug ascending), `getNewsPost(slug: string, root?): NewsPost | undefined`.

- [ ] **Step 1: Write failing tests** in `tests/content.test.ts` against the fixtures:
  - `getNewsPosts sorts newest first and breaks date ties by slug`
  - `getNewsPosts normalizes unquoted YAML dates to YYYY-MM-DD strings` (gray-matter yields `Date` objects; assert `typeof date === 'string'` and equals `'2026-01-05'`)
  - `getNewsPost returns undefined for an unknown slug`
  - `getNewsPost renders markdown body to html` (`html` contains `<strong>`)
  - `getTimeline sorts ascending by year`
  - `getOfficers allows a missing photo` (`photo` is `undefined`)
  - `getAbout exposes excerpt and activities from frontmatter`
  - `getAlbums derives slug from filename and keeps image order`
  - `malformed content throws an error naming the file` (`expect(() => getOfficers(badRoot)).toThrow(/officers\.yml/)`)
- [ ] **Step 2: Run** `npx vitest run tests/content.test.ts` — Expected: FAIL (module missing).
- [ ] **Step 3: Implement** `lib/content.ts` with the signatures above. Use `gray-matter` for `.md`, `yaml` for `.yml`, `remark`+`remark-html` for bodies. Wrap every file read/parse so errors are rethrown as `Error(\`Invalid content in ${relativePath}: ${reason}\`)`. Validate required fields; do not validate beyond that.
- [ ] **Step 4: Run** `npx vitest run tests/content.test.ts` — Expected: all PASS.
- [ ] **Step 5: Commit** — `git add lib tests && git commit -m "feat: add typed build-time content layer"`

### Task 3: Placeholder content and ImageSlot

**Files:**
- Create: `content/site.md`, `content/about.md`, `content/timeline.yml`, `content/officers.yml`, `content/albums/events.md`, `content/albums/training.md`, `content/albums/seminars.md`, `content/news/2026-01-05-placeholder-news-one.md` (+ two more dated posts), `components/ImageSlot.tsx`, `tests/ImageSlot.test.tsx`

**Interfaces:**
- Consumes: Task 2 types (content must satisfy them; add a test `placeholder content loads without error` in `tests/content.test.ts` calling every getter with the default root).
- Produces: `ImageSlot(props: { src?: string; alt: string; aspect?: 'square' | 'video' | 'portrait'; className?: string })` — renders `<img src alt>` when `src` is set, otherwise a patterned placeholder element with `role="img"` and `aria-label={alt}`.

- [ ] **Step 1: Write failing tests** `tests/ImageSlot.test.tsx`: `renders an img with alt when src is provided`; `renders a labelled placeholder when src is missing` (`getByRole('img', { name: 'Officer portrait' })` is not an `<img>` element); `applies aspect class`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** `ImageSlot`; author placeholder content (three albums with 6, 4, and 0 images respectively — the empty one backs Review Focus 1; three news posts, one without `cover`; four officers, one without `photo`; timeline starting 2015). Site data uses the real name, full name, tagline, and founded year; everything else is `[Placeholder]`.
- [ ] **Step 4: Run** `npm run test` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add placeholder content and ImageSlot"`

### Task 4: Layout shell — Header, Footer, SectionHeading

**Files:**
- Create: `components/Header.tsx`, `components/Footer.tsx`, `components/SectionHeading.tsx`, `components/Reveal.tsx`, `public/images/baybayin-rule.svg`, `tests/Header.test.tsx`
- Modify: `app/layout.tsx` (wrap children in Header/Footer, skip-link to `#main`)

**Interfaces:**
- Produces: `Header()` (client component; nav links Home, About, Gallery, News, Contact; hamburger button `aria-expanded` toggles a slide-in menu under 768px), `Footer({ site: SiteInfo })`, `SectionHeading(props: { title: string; eyebrow?: string })` (renders `<h2>` plus Baybayin rule), `Reveal({ children })` (fade-and-rise on scroll; no animation under `prefers-reduced-motion`).

- [ ] **Step 1: Write failing tests** `tests/Header.test.tsx`: `menu button toggles aria-expanded`; `Escape closes the open menu and returns focus to the button`; `nav contains links to all five routes`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** components. The Baybayin rule is a simple decorative SVG with `aria-hidden`; the star motif is the list/divider bullet. Logo in the header links to `/`.
- [ ] **Step 4: Run** `npm run test && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add header, footer, section heading, reveal"`

### Task 5: Home page

**Files:**
- Create: `components/Hero.tsx`, `components/OfficerCard.tsx`, `components/NewsCard.tsx`, `components/TimelineList.tsx`, `tests/home.test.tsx`
- Modify: `app/page.tsx`, `tests/smoke.test.tsx` (delete it; `tests/home.test.tsx` supersedes it by rendering the async server component with `render(await Home())`)

**Interfaces:**
- Consumes: `getSite`, `getAbout`, `getOfficers`, `getAlbums`, `getNewsPosts`; `ImageSlot`, `SectionHeading`, `Reveal`.
- Produces: `Hero({ site: SiteInfo })`, `OfficerCard({ officer: Officer })`, `NewsCard({ post: NewsPost })` (links to `/news/${slug}`), `TimelineList({ entries: TimelineEntry[] })`.

- [ ] **Step 1: Write failing tests** `tests/home.test.tsx`: `hero shows KUMASA as the h1 with the full name and tagline`; `home shows exactly 3 latest news cards, newest first`; `home gallery preview shows at most 6 images`; `OfficerCard shows a placeholder when photo is missing`; `NewsCard shows a placeholder when cover is missing`; `contact CTA links to /contact`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** the components and compose `app/page.tsx` as an async server component in spec order: hero, about preview (`excerpt` + link to `/about`), what-we-do (from `activities`), officers, gallery preview (links to `/gallery`), latest news, contact CTA. Splatter texture behind the hero only.
- [ ] **Step 4: Run** `npm run test && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: build home page"`

### Task 6: Gallery with lightbox

**Files:**
- Create: `components/GalleryGrid.tsx`, `components/Lightbox.tsx`, `app/gallery/page.tsx`, `tests/Lightbox.test.tsx`, `tests/GalleryGrid.test.tsx`

**Interfaces:**
- Consumes: `getAlbums`, `Album`, `ImageSlot`.
- Produces: `GalleryGrid({ albums: Album[] })` (client; album filter buttons "All" + one per album, `aria-pressed`); `Lightbox(props: { images: { src: string; alt: string }[]; index: number; onClose: () => void; onIndexChange: (i: number) => void })`.

- [ ] **Step 1: Write failing tests:**
  - `Lightbox`: `ArrowRight advances and ArrowLeft goes back`; `ArrowRight on the last image stays on the last image` (stops, no wrap); `ArrowLeft on the first image stays on the first`; `Escape calls onClose`; `focus is trapped inside the dialog`.
  - `GalleryGrid`: `clicking a thumbnail opens the lightbox on that image`; `closing the lightbox returns focus to the thumbnail that opened it`; `selecting an album filters thumbnails and the lightbox navigates only within that album`; `an album with no images shows "No photos yet" instead of a grid`; `with no albums at all the page shows the empty state`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** with a native `<dialog>` or `role="dialog" aria-modal` plus manual focus trap; transitions disabled under reduced motion. `app/gallery/page.tsx` is a server component passing `getAlbums()` to `GalleryGrid`.
- [ ] **Step 4: Run** `npm run test && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add gallery with keyboard-accessible lightbox"`

### Task 7: About, News, and not-found pages

**Files:**
- Create: `app/about/page.tsx`, `app/news/page.tsx`, `app/news/[slug]/page.tsx`, `app/not-found.tsx`, `tests/news.test.tsx`

**Interfaces:**
- Consumes: `getAbout`, `getTimeline`, `getOfficers`, `getNewsPosts`, `getNewsPost`; `TimelineList`, `OfficerCard`, `NewsCard`.
- Produces: `generateStaticParams(): { slug: string }[]` in `app/news/[slug]/page.tsx`; the slug page calls `notFound()` when `getNewsPost` returns `undefined`.

- [ ] **Step 1: Write failing tests** `tests/news.test.tsx`: `generateStaticParams returns one entry per post`; `slug page calls notFound for an unknown slug` (mock `next/navigation`); `news index lists all posts newest first`; `not-found page links back to home`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** the pages. Post body is rendered from the trusted build-time `html` field. `export const dynamicParams = false` on the slug page.
- [ ] **Step 4: Run** `npm run test && npm run build` — Expected: PASS; `out/news/<slug>/index.html` exists for each post.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add about, news, and not-found pages"`

### Task 8: Contact page and form

**Files:**
- Create: `components/ContactSection.tsx`, `components/ContactForm.tsx`, `app/contact/page.tsx`, `.env.example`, `tests/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `getSite`, `SiteInfo`.
- Produces: `ContactForm(props: { endpoint?: string; email: string })`. Page passes `process.env.NEXT_PUBLIC_FORM_ENDPOINT` as `endpoint`. `.env.example` documents `NEXT_PUBLIC_FORM_ENDPOINT=`.

- [ ] **Step 1: Write failing tests** `tests/ContactForm.test.tsx`: `with an endpoint, the form posts name/email/message to it` (mock `fetch`; success message appears); `a failed post shows an error message and keeps the typed values`; `without an endpoint, renders a mailto link for the given email instead of a form`; `required fields block submission`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement** the form (labelled inputs, `aria-live` status region) and the contact section (address, phone, email, social links, location placeholder via `ImageSlot`).
- [ ] **Step 4: Run** `npm run test && npm run build` — Expected: PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add contact page with endpoint-or-mailto form"`

### Task 9: E2E smoke suite, README, final verification

**Files:**
- Create: `tests/e2e/smoke.spec.ts`, `README.md`
- Modify: `playwright.config.ts` (serve `out/` via `npx serve out -l 3000` as `webServer`; add `serve` as devDependency)

- [ ] **Step 1: Write the E2E tests** in `tests/e2e/smoke.spec.ts`: `each route returns 200 and has one h1` (`/`, `/about`, `/gallery`, `/news`, `/contact`, one `/news/<slug>`); `unknown path shows the not-found page`; `desktop nav reaches the gallery`; `lightbox opens, ArrowRight advances, Escape closes`; `mobile viewport: menu button opens the menu and a link navigates`.
- [ ] **Step 2: Run** `npm run build && npx playwright install chromium && npm run e2e` — Expected: PASS (Chromium is pre-installed at `/opt/pw-browsers/chromium`; if `playwright install` is unnecessary or conflicts, use the existing browser via `executablePath`).
- [ ] **Step 3: Write `README.md`:** what the site is; run/build commands; how to add a news post, officer, and album (file shapes from the spec); how to replace placeholders (search `[Placeholder]`); how to deploy `out/` to Vercel, Netlify, and GitHub Pages; the `NEXT_PUBLIC_FORM_ENDPOINT` variable.
- [ ] **Step 4: Final verification** — run `npm run lint && npm run typecheck && npm run test && npm run build && npm run e2e`; Expected: all pass. Manually check contrast of `muted` on `base` and `accent` on `base` meets 4.5:1 for text use (report ratios); if a token fails for text, restrict it to non-text use and say so.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: add e2e smoke suite and README"`
