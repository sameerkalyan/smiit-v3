# SMIIT CyberAI — Homepage Architecture Document

> **Audience:** Frontend engineers, designers, and AI agents working on this clone.
> **Source of truth:** `src/app/page.tsx` wires all sections top-to-bottom; `src/components/site-data.ts` holds every string, array, and link shown on the page.

---

## 1. Executive Summary

SMIIT CyberAI is a London-based AI governance and infrastructure consultancy. The homepage is a single un-paginated editorial scroll designed to establish authority for regulated-industry buyers (financial services, healthcare, energy/CNI). The tone is deliberately restrained — Swiss/minimalist typographic hierarchy with no photographic imagery. The default colorway is a warm paper-tone background (`#faf9f5`) with electric-blue accents (`#2440e0`).

---

## 2. Design System

### 2.1 Color Tokens

All tokens live in CSS custom properties on `:root` and are consumed via Tailwind utility classes like `bg-[var(--pa)]`, `text-[var(--ink)]`. The site ships three selectable paper-tone themes (user-selectable via a `data-props` config on the source site; classes `.paper-warm`, `.paper-grey`, `.paper-white` are available in `globals.css`). Default is **Warm bone**.

| Token | Default value | Role |
|---|---|---|
| `--pa` / `--background` | `#faf9f5` | Page background |
| `--pa2` / `--secondary` | `#ece7dc` | Alternating section background |
| `--card` / `--surface` | `#fbf9f3` | Card backgrounds |
| `--ink` / `--foreground` | `#1c1a16` | Primary text (near-black) |
| `--ink2` | `#56503f` | Secondary / body text |
| `--ink3` / `--muted-foreground` | `#938c7c` | Metadata, labels, captions |
| `--accent` / `--ring` | `#2440e0` | Accent blue — tags, progress-fill, CTA-fills, all bullets, selection highlight |
| `--line` | `rgba(28,26,22,.13)` | Subtle borders |
| `--line2` | `rgba(28,26,22,.26)` | Stronger borders / divider |
| `--charcoal` | `#1c1a16` | Dark sections (Final CTA bg) |
| `--destructive` | `#c41230` | Error states |
| `--oside` | `rgba(36,64,224,.16)` | Text selection highlight |

**Accent palette alternatives** (not active but configurable): teal `#1F6F5C`, rust `#9E3A1F`, ink `#1C1A16`.

### 2.2 Typography

Three font families, loaded as CSS variables via `next/font` in `src/app/layout.tsx`. Swap/render strategy is `display: swap` (fonts are self-loaded from Google CDN; no FOIT).

| Family | Weights / Styles | CSS Variable | Usage |
|---|---|---|---|
| **IBM Plex Sans** | 400, 500, 600, 700 | `--font-sans` | Body text, nav, buttons, card text, headings |
| **IBM Plex Mono** | 400, 500 | `--font-mono` | Labels, metadata, section kickers, framework badges, discipline numbers |
| **Newsreader** (serif) | 300–600, italic + normal | `--font-heading` | Display headings, hero H1, taglines, pull-quotes |

Key typographic utilities defined in `globals.css`:
- `.font-heading` — forces Newsreader
- `.leading-heading` — `line-height: 1.08; letter-spacing: -0.02em`
- `.text-balance` — `text-wrap: balance` on headines
- `selection:` pseudo-element uses `rgba(36,64,224,.16)` background

### 2.3 Spacing System

Sections use **generous vertical rhythm**:
- Section padding: `py-24` (6rem = 96px) on mobile → `md:py-32` (8rem = 128px) on desktop for hero/CTA.
- Container: `max-w-7xl` (80rem) with `px-6 lg:px-8`.
- Card padding: `p-8` → `md:p-10`.
- Gap system: `gap-2` → `gap-6` → `gap-8` → `gap-12` → `gap-16` depending on relationship.

### 2.4 Border Radius

`--radius: 0.5rem` (8px) by default. Rounded corners used:
- `rounded-xl` = `calc(0.5 * 1.2 = 0.625rem / 10px)` — standard cards
- `rounded-2xl` = `calc(0.5 * 1.4 = 0.7rem / 12px`) — hero readiness panel, hero CTAs
- `rounded-full` — pill buttons, tags, progress bar tracks

### 2.5 Animations

| Animation | CSS Class | Duration / Easing | Use |
|---|---|---|---|
| Pulsing dot | `animate-ping` (tw-animate) | 1s cubic-bezier | Status indicator |
| Custom blink | `animate-pulse-slow` via `@keyframes blink` | 2.5s ease-in-out | Entity presence dot |
| Infinite ticker | `animate-marquee` via `@keyframes mq` | 40s linear | Frameworks strip |
| Fade-up entrance | `animate-fade-up` via `@keyframes fadeUp` | 0.55s ease-out | Scroll-triggered (CSS-hook, JS-driven in readiness bars) |

### 2.6 Scroll Behavior

- `html { scroll-behavior: smooth; }` — native smooth anchor scrolling.
- No Lenis / Locomotive Scroll detected. All scroll-driven state is emulated via JS intersections.

---

## 3. Layout Architecture

### 3.1 Z-Index Stack

| Layer | z-index | Element |
|---|---|---|
| Navbar | `z-50` | Fixed top |
| Announcement banner | Implicit (flows below nav) | Static |
| All main sections | `relative` (default flow) | — |
| Final CTA watermark text | `overflow-hidden` clipped giant text | `select-none pointer-events-none` |

### 3.2 Navigation Model

```text
[ Fixed Navbar  z-50 ]
  └─ Logo (SC monogram + SMIIT CyberAI wordmark)
  └─ Desktop links: Services · Frameworks · Insights · Talk to us
  └─ Desktop actions: Readiness check (text link) | Book a call (filled btn)
  └─ Mobile: hamburger button → slide-down drawer
```

**Scroll behavior of Navbar:**  
At `scrollY === 0` → fully transparent `bg-transparent`.  
At `scrollY > 40px` → `bg-[var(--pa)]/85 backdrop-blur` with `border-b-[var(--line)]`.  
Transition: `transition-all duration-300`.  
State is set once (flag stays true after first scroll) — no reverse on scroll-up.

### 3.3 Intersection Zones

Most sections use **none** scroll-driven triggering (the original is fully rendered on load). The two exceptions:
- **Readiness Panel bars:** width animated 0% → target% on mount (CSS transition `duration-700`).
- **Discipline links hover:** onMouseEnter sets `activeDiscipline` index (rotate every 3.5s via `setInterval`).

---

## 4. Component Catalogue

Files exist under `src/components/`. All components are exported as named functions. No default exports except the barrel `page.tsx`.

### 4.1 `Navbar` — `src/components/navbar.tsx`

**State:** `scrolled: boolean` (scroll listener, passive), `mobileOpen: boolean`.  
**Breakpoints:** Md-up shows inline nav; md-down shows hamburger toggle.  
**Behavior:** Hamburger opens/closes a border-top drawer containing the same links plus the CTA button. Drawer has no animation (instant mount/unmount) — the original's behavior here is simple.

### 4.2 `AnnouncementBanner` — `src/components/announcement-banner.tsx`

Dark full-width band (`bg-[var(--ink)] text-[var(--pa)]`). 
- Left cluster: pulsing blue status dot (CSS `animate-ping`) + `"Now active"` mono label + urgency copy.  
- Right: `"Download the readiness guide →"` link.  
- Mobile: stacks vertically; desktop: inline with gap.

### 4.3 `HeroSection` — `src/components/hero-section.tsx`

**Layout:** 12-column grid → `lg:col-span-7` (copy) + `lg:col-span-5` (panel). Mobile: full-width stack.

| Element | Class / Behavior |
|---|---|
| Top label | `handwriting italic text-[var(--ink2)]`, pulsing blue dot |
| H1 "Most enterprise AI is" | `italic text-[var(--ink2)]`, tight `leading-heading` |
| H1 "ungoverned." | `font-bold text-5xl → lg:text-7xl` |
| H1 "We change that." | `italic text-[var(--accent)]` |
| Subtitle | `text-lg md:text-xl text-[var(--ink2)] max-w-2xl` |
| Primary CTA | `bg-[var(--accent)] text-white rounded-full px-6 py-3.5` |
| Secondary CTA | Text link with `→` icon |
| Discipline nav (`01–06`) | Hover sets `activeDiscipline` index; `setInterval` auto-cycles every 3500 ms |

Readiness panel: `lg:col-span-5`. See §4.4.

### 4.4 `ReadinessPanel` — `src/components/readiness-panel.tsx`

Rendered inside `HeroSection` (not as a global wrapper).  
Structure:
```
[ Governance Readiness Index · FIG.01 ]
  × 6 rows:
    [ Label (mono) ] ---- [ Pct% ]
    [ progress track (bg-[var(--pa2] rounded-full h-1.5) ]
        [ bar (bg-[var(--accent)] width animated 0→pct%) ]
  [ footnote: "Illustitative framework…" ]
```
Bar animation: loaded via `useEffect` which queries `[data-pct]` and sets `style.width = pct + "%"`. CSS transition handles the rest (`duration-700 ease-out`).

Data: `READINESS_DATA` shipped from `site-data.ts` (Policy 72%, Risk 58%, Inventory 45%, Compliance 65%, Infra 52%, Agent 38%).

### 4.5 `TheClaimStats` — `src/components/the-claim-stats.tsx`

Full-width section with background `bg-[var(--card)]` and `border-y border-[var(--line)]` (sits like a thick horizontal divider).

- Left: `73%` in `text-8xl → lg:text-9xl` font-heading, tight leading.  
- Right: H2 `of organisations have deployed AI without a governance framework.`  
- Body paragraph: longer copy.  
- Blockquote: `border-l-2 border-[var(--accent)] pl-6`, italic serif.  
- Bottom CTA: `"Explore our services →"` text link.

### 4.6 `TwoPillarDisciplines` — `src/components/two-pillar-disciplines.tsx`

Two equal-height cards showcasing `SERVICES[0]` (AI Governance) and `SERVICES[1]` (AI Infrastructure).  
Each card:
- Kicker label: `Pillar 01 — Primary · AI Governance` (mono uppercase tracked).  
- Title: `text-xl md:text-2xl font-heading font-semibold`.  
- Description.  
- First 4 bullets (checkmark icons, `text-[var(--ink2)]`).  
- Divider + `Explore {tag} →` link.

### 4.7 `ServicesTabs` — `src/components/services-tabs.tsx`

**Interaction model: click-driven tab switcher.**  
Desktop layout: vertical pill list (left 1/3) + detail panel (right 2/3).  
Mobile: tabs wrap into a multi-row flex wrap + panel below.

| Element | Detail |
|---|---|
| Tab list | Horizontal row of 10 pills; active pill = `bg-[var(--ink)] text-[var(--pa)]` |
| Detail panel | `border border-[var(--line)] rounded-xl bg-[var(--card)]` |
| Tag badge | `bg-[var(--accent)]/10 text-[var(--accent)] rounded-full` |
| Frameworks sidebar (xl only) | `xl:w-64 border-t xl:border-t-0 xl:border-l`, framework rows with category badge |
| Stack coverage | `Capex`-style "Covered" pill label |

Data: `SERVICES` array (ten entries, id 1–10).

### 4.8 `FrameworksMarquee` — `src/components/frameworks-marquee.tsx`

Horizontal infinite ticker strip.  
- Container: `overflow-hidden border-y border-[var(--line)]`.  
- Items span 3 repeats (`REPEATS = 3`).  
- Rendered as `inline-flex` with `animate-marquee` (40s linear, pauses on hover).  
- Separator: `·` (mid-dot) between items.  
- On `mouseenter` / `mouseleave` the animation play-state toggles to paused / running.

### 4.9 `FrameworksSection` — `src/components/frameworks-section.tsx`

- Header: `"Standards"` mono kicker + `"Every engagement anchored to recognised standards."` heading.  
- Marquee inserts between header and table.  
- Reference table: 7-row `divide-y`, each row has [category mono badge] [name] [description].

Data: `FRAMEWORKS` array.

### 4.10 `InsightsSection` — `src/components/insights-section.tsx`

**Interaction model: click-driven filter** — buttons act as toggle tabs.

- Filter row: pills — `"All topics"`, `"AI Governance"`, `"Infrastructure"`, `"AI Agents"`, `"Transformation"`. Active = filled `bg-[var(--ink)] text-[var(--pa)]`; inactive = outline.  
- Grid: `md:grid-cols-2 lg:grid-cols-3` (3 cards per row desktop, 2 tablet, 1 mobile).  
- Card structure: `[date · readTime] [title — hover:text-[var(--accent])] [excerpt] [footer: Read article →]`.  
- Newsletter card: full-width two-col below grid on desktop; single column on mobile. Contains email input and Subscribe button (both full-pill).

Data: `BLOG_ARTICLES` (6 entries).

### 4.11 `IndustriesSection` — `src/components/industries-section.tsx`

Full-width, alternating background `bg-[var(--pa2)]`.  
- 3-column responsive grid:
  - Name (font-semibold)
  - Description
  - Tags (mono px-2.5 py-1 rounded-full bg-[var(--pa)] border-[var(--line)])

Data: `INDUSTRIES` (3 entries).

### 4.12 `FreeResourcesSection` — `src/components/free-resources-section.tsx`

3-column grid of lead-magnet cards. Each card:
- `border-t-4 border-t-[var(--accent)]` as visual top border (blue thumb height = 4px).  
- Icon box: `h-10 w-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]` inline-flex.  
- Structure: `[title: "Free Assessment"] [subtitle: "AI Governance Readiness Check"] [description] [cta →]`

Data: `LEAD_MAGNETS` (3 entries).

### 4.13 `BookingSection` — `src/components/booking-section.tsx`

3-column grid of Cal.com booking cards. Links open in new tab (`target="_blank"`).  
- Each card: icon (calendar) + duration label (mono) + heading (hover:text-[var(--accent)]) + description + `Book now →` link.  
- Cards have `hover:border-[var(--ink)]` transition.

Data: `BOOKING_TYPES` (3 entries: Initial Discovery 30m, Technical Consulting 60m, Partnership 30m).

### 4.14 `FinalCTASection` — `src/components/final-cta-section.tsx`

Dark inverted section `bg-[var(--ink)] text-[var(--pa)]`.  
- Background: giant decorative `"governed"` wordmark set at `text-[20rem] lg:text-[28rem] font-heading text-[var(--pa)]/5 opacity-5` positioned in the right column, clipped by `overflow-hidden`, `select-none pointer-events-none`.  
- Layout: 2-col grid — copy left (with mono `"Ready to begin?"` kicker), visual right.  
- Two CTAs: `Book a discovery call` (filled accent) and `Take the free assessment` (text link accent).

### 4.15 `Footer` — `src/components/footer.tsx`

`bg-[var(--ink)] text-[var(--pa)]`. `py-16 md:py-20`.  
Layout: 6-column grid (4 group columns + 1 spanning brand column).

| Area | Content |
|---|---|
| Brand column (2 cols) | `SC` monogram + `SMIIT CyberAI`, paragraph, social links (LinkedIn, X, Email) |
| Services | 8 links |
| Intelligence | 5 links |
| Frameworks | 5 links |
| Company | 4 links (About, Contact, Careers, Privacy) |
| Bottom bar | `© 2026 SMIIT CyberAI` + Privacy · Terms · Cookies |

Social icons use inline SVG components from `/icons.tsx`.

---

## 5. Shared Utilities (`src/components/icons.tsx`)

Single-file icon library. Exports:
- **`<Icon name="..." />`** — lookup dispatcher for all named SVGs.
- **`MARQUEE_ITEMS`** + **`REPEATS`** — ticker data, consumed by `frameworks-marquee.tsx`.

Current named SVG icons (16 total): `arrowRight`, `arrowDown`, `check`, `x`, `chevronDown`, `menu`, `mail`, `linkedin`, `xTwitter`, `download`, `logoSC`, `calendar`, `clock`, `star`, `blink` (pulsing dot CSS animation exposed as a component class), plus `MarqueeItems` data.

Icon wrapper uses `cn()` from `lib/utils` for prop-passing; fallback is `null`.

---

## 6. Data Layer (`src/components/site-data.ts`)

Single barrel file exporting all site content. This is the **content source of truth** — not JSON, not MDX, just typed TS const arrays.

| Export | Items |
|---|---|
| `NAV_ITEMS` | 4 anchor links |
| `BOOKING_TYPES` | 3 booking flow objects |
| `DISCIPLINES` | 6 string labels |
| `SERVICES` | 10 service entries (bullet, framework, tag) |
| `BLOG_ARTICLES` | 6 articles (title, date, category, excerpt, readTime) |
| `FRAMEWORKS` | 7 regulation/standard rows |
| `INDUSTRIES` | 3 industry cards |
| `LEAD_MAGNETS` | 3 lead magnets |
| `READINESS_DATA` | 6 `{label, pct}` readiness dimensions |
| `FOOTER_LINKS` | Nested groupings for footer columns |

New content items are added here and referenced purely in components. No CMS, no fetch.

---

## 7. Type Definitions (`src/types/index.ts`)

Shared interfaces used across multiple components:

```tsx
Service, BlogArticle, FrameworkRow, IndustryCard, LeadMagnet,
ReadinessItem, BookingType, FooterLink, NavItem
```

`site-data.ts` also implicitly types via `as const` and JSDoc inference, but `types/index.ts` exists for cross-component type imports (e.g. `InsightsSection` imports `BlogArticle`; `ServicesTabs` imports `Service`).

---

## 8. Responsive Behavior

Breakpoints follow Tailwind defaults (`md = 768px`, `lg = 1024px`, `xl = 1280px`):

| Section | Desktop (>lg) | Tablet (md) | Mobile (<md) |
|---|---|---|---|
| Navbar | Horizontal links | Same | Hamburger drawer |
| Hero | 12-col grid, col-span-7+5 | col-span-12 stack | col-span-12 stack |
| Services tabs | Vertical tab strip + side panel | Wrap tabs + panel below | Tabs wrap; panel below |
| Blog grid | 3 cols | 2 cols | 1 col |
| Booking | 3 cols | 2 cols | 1 col (stack) |
| Footer | 4 col + 2-col brand | 2 col | Stack (2 → 1) |
| Final CTA | 2 col (copy + giant text) | Stack, hide image | Stack |

Text size scaling uses `clamp()`-style responsive utilities (e.g. `text-5xl md:text-6xl lg:text-7xl`).

No mobile-specific navigation patterns other than drawer.

---

## 9. Global Pillar Patterns

### 9.1 Section `<header>` Pattern
Almost every section's header uses:
```tsx
<p className="text-sm font-mono text-[var(--ink3)] uppercase tracking-widest mb-3">
  {kicker}
</p>
<h2 className="text-3xl md:text-4xl font-heading font-semibold leading-heading text-[var(--ink)]">
  {heading}
</h2>
{margin-bottom wrapper}
```

### 9.2 Card Pattern
Generic card composable via:
```tsx
className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 hover:border-[var(--ink)] transition-colors"
```

### 9.3 Pill / Badge Pattern
```tsx
className="px-2.5 py-1 text-xs font-mono font-medium bg-[var(--accent)]/10 text-[var(--accent)] rounded-full"
```

### 9.4 Link-with-Arrow Pattern
```tsx
<Link href="#" className="inline-flex items-center gap-1.5 text-sm font-medium">
  Text <Icon name="arrowRight" />
</Link>
```

---

## 10. File Inventory

```
src/
├── app/
│   ├── layout.tsx          — Root layout, fonts, metadata, viewport
│   ├── page.tsx            — Homepage barrel; imports and renders all 14 components
│   └── globals.css         — Design tokens (3 theme classes), keyframes, utilities
│
├── components/
│   ├── icons.tsx           — Named SVG icon library + marquee data
│   ├── site-data.ts        — Content layer (all strings, arrays, links)
│   ├── navbar.tsx          — Fixed top navigation
│   ├── announcement-banner.tsx  — EU AI Act alert band
│   ├── hero-section.tsx    — H1, CTAs, disciplines nav, readiness panel
│   ├── readiness-panel.tsx — Governance readiness progress bars
│   ├── the-claim-stats.tsx — 73% stat block + pull-quote
│   ├── two-pillar-disciplines.tsx — Governance / Infrastructure cards
│   ├── services-tabs.tsx   — 10-tab service detail switcher
│   ├── frameworks-marquee.tsx   — Infinite animated ticker
│   ├── frameworks-section.tsx   — Standards reference table
│   ├── insights-section.tsx     — Blog grid + newsletter
│   ├── industries-section.tsx   — 3 industry target blocks
│   ├── free-resources-section.tsx — 3 lead-magnet cards
│   ├── booking-section.tsx      — Cal.com 3-slot cards
│   ├── final-cta-section.tsx    — Inverted dark CTA
│   └── footer.tsx               — 4-column footer
│
├── lib/
│   └── utils.ts            — cn() (Tailwind clsx + tailwind-merge)
│
└── types/
    └── index.ts            — TypeScript interfaces (Service, BlogArticle, …)
```

---

## 11. Technical Stack (as built)

| Layer | Tooling |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| Runtime | React 19.2.4, TypeScript strict (noEmit check passes) |
| Styling | Tailwind CSS v4 + `shadcn/tailwind.css` + `tw-animate-css` |
| UI Primitives | shadcn/ui infrastructure present (no `<Button>` etc. used — site uses native semantic buttons) |
| Fonts | `next/font/google` (IBM Plex Sans 400/500/600/700, IBM Plex Mono 400/500, Newsreader 300/600 italic) |
| Icons | Hand-authored inline SVG React components (no lucide-react dependency used) |
| Linting | ESLint (`eslint.config.mjs`) |
| Build | `next build` (Turbopack). Static prerender — zero runtime fetches |

---

## 12. Build & Verify

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # TypeScript + production build (must pass — currently green)
npm run typecheck  # tsc --noEmit only
npm run lint       # eslint
```

**Current build status: ✅ passing** — zero type errors, zero lint errors. All 4 static pages generated.

---

## 13. Notable Implementation Decisions

1. **Framework components lean on raw HTML elements** rather than shadcn `<Button>` because the original uses very specific pill/outlined styles that don't map 1:1 to shadcn primitives. shadcn's `cn()` is still used in `icons.tsx` to merge `className` props.

2. **No client-side router/navigation** (beyond anchor links) — practice of anchor-driven single-page scroll.

3. **`data-pct` pattern for readiness bars** avoids `requestAnimationFrame`; the 700ms CSS transition on `width` handles smoothness on its own.

4. **Discipline auto-cycle** (`setInterval 3500ms`) is purely cosmetic; the index is not displayed as a highlighted state (it's a potential enhancement gap — the original may use the index to highlight discipline tabs in the services panel dynamically, which is not yet wired).

5. **Final CTA "governed" watermark** is rendered as a decorative text node, not an image asset. It lives in DOM; CSS `overflow-hidden` on the section clips it to bounds.

---

## 14. Known Gaps / Post-Clone Enhancements

- [ ] Cal.com links are placeholder URLs (`https://cal.com/smiit-cyberai/...`) — replace with real booking slugs.
- [ ] Newsletter form is cosmetic — wire to a real provider (ConvertKit / Buttondown).
- [ ] `activeDiscipline` state is not consumed to visually highlight anything beyond the nav hover — the original likely cross-links discipline nav and services panel; that wiring is open.
- [ ] No dark/light theme switcher; `.dark` class exists in `globals.css` but no toggle UI.
- [ ] No real favicon / OG image — `public/seo/` is empty. Inject favicon.ico and generate social cards.
- [ ] No mobile menu animation (instant mount/unmount).
- [ ] Frameworks marquee has a minor visual issue in current build: leading/trailing `·` on each item can feel uneven at loop boundaries; consider trimming based on design-mirroring vs. original.
