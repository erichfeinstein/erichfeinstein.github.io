# Site Redesign + Blog — Design

**Date:** 2026-04-19
**Scope:** Full visual redesign of erichfeinstein.github.io plus a new `/blog` section authored in markdown.

## Goals

1. Replace the current CRA + MUI resume site (dark box cards, rainbow tabs, Courier New, "hey" typewriter intro) with a distinctive, AI-coded aesthetic.
2. Add a blog where posts are authored as markdown and published by committing files. Posts will typically be AI-generated from short prompts about coding work.
3. Preserve GitHub Pages deployment via `gh-pages` with no CI changes.
4. Keep each tab's underlying content (experience data, skills list, Samply iframe, etc.) intact — only the framing and presentation change.

Non-goals: SEO, RSS, comments, tag filtering, search beyond the command palette, migration off CRA.

## Aesthetic Direction

Hybrid: **generative shader background + terminal-flavored type treatments + glitch accents**.

- UI is monochrome (white on near-black `#050507`).
- Rainbow only appears during glitch animations (scramble-lock, focus rings, drag trails) — surprise-and-delight, not persistent decoration.
- Typography: **JetBrains Mono** loaded from Google Fonts, replaces `'Courier New'` everywhere.
- Section headers follow a `// section-name` comment pattern in dim gray above the main title.

### Palette tokens

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#050507` | Page background |
| `--fg` | `#ffffff` | Primary text, chips, lines |
| `--fg-dim` | `rgba(255,255,255,0.55)` | Metadata, `//` labels, quote borders |
| `--fg-faint` | `rgba(255,255,255,0.12)` | Hairlines, timeline line, card outlines |
| `--rainbow` | CSS gradient: `linear-gradient(270deg, #ff2bd6, #00e5ff, #00ff88, #ff2bd6)` | Glitch-only: scramble hue, focus rings, drag trails, link hover |

`--rainbow` is the only place color appears in the UI. It is always animated (background-position sweep) when used, never static.

## Architecture

### Routing

Introduce `react-router-dom` with `HashRouter`:

| Route | Component |
|---|---|
| `/` | About |
| `/experience` | Experience |
| `/education` | Education |
| `/skills` | Skills |
| `/music` | Music |
| `/blog` | BlogList |
| `/blog/:slug` | BlogPost |

HashRouter is chosen so GitHub Pages needs no 404 fallback hack.

### Dependencies (new)

- `react-router-dom` — routing
- `react-markdown` + `remark-gfm` — markdown rendering with GFM extensions
- `react-syntax-highlighter` — code block rendering
- `gray-matter` — frontmatter parsing, browser build
- `framer-motion` — route transitions, intro, palette, glitch
- `three` + `@react-three/fiber` — WebGL background
- `cmdk` — command palette primitive

Existing deps kept: `@mui/material` (still used by Experience/Education/Music content), `canvas-confetti` and `react-beautiful-dnd` (Skills easter egg).

### Directory additions

```
src/
  content/posts/YYYY-MM-DD-slug.md     # authored posts
  lib/posts.js                         # post loader
  components/
    shell/
      Background.jsx                   # R3F shader canvas
      Nav.jsx                          # ~/eric $ cd <section>
      CommandPalette.jsx               # / overlay
      Intro.jsx                        # one-shot cinematic
      GlitchText.jsx                   # scramble-lock animation
    blog/
      BlogList.jsx
      BlogPost.jsx
```

`src/App.js` wraps everything in `<HashRouter>` and mounts the shell (`Background`, `Nav`, `CommandPalette`, `Intro`). `src/components/Home.js` is removed; its tab logic is superseded by routing.

## Global Shell

### Background — `Background.jsx`

Fixed full-viewport `<Canvas>` at `z-index: -1`. A single full-screen quad with a GLSL fragment shader: domain-warped simplex noise, near-black base, low-alpha violet/cyan highlights. Cursor position feeds a `uMouse` uniform; noise distorts subtly toward it. Lazy-loaded via `React.lazy` to keep initial bundle small.

Fallback (static CSS radial gradient) when any of the following is true:
- viewport width < 768px
- `prefers-reduced-motion: reduce`
- WebGL2 unavailable

### Nav — `Nav.jsx`

Fixed top bar, ~48px tall, backdrop-filter blur. Left: `~/eric $ cd <current-section>` with a blinking block cursor after the segment. Right: `press /` pill that opens the palette on click. No visible section links — discovery is via the palette.

On mobile the pill label becomes `menu` and the palette opens fullscreen.

### Command Palette — `CommandPalette.jsx`

Built on `cmdk`. Hotkey: `/` (bound globally with `preventDefault` so it does not insert into focused inputs — except inside the palette's own search input). Also opens via click on the nav pill.

Centered modal, backdrop-blurred black (~70% opacity). Search input with blinking cursor. Lists:
- Sections: About, Experience, Education, Skills, Music, Blog
- Posts: every post as `Blog / <title>`

Fuzzy search via cmdk's default. Enter navigates. Esc closes. Fully keyboard-accessible (cmdk handles ARIA).

### Intro — `Intro.jsx`

One-shot cinematic on first visit per session (`sessionStorage.intro_played_v1`). Full-screen black overlay above everything. Sequence (~2.2s):

1. `booting...` fades in (200ms)
2. `~/eric $ whoami` types character-by-character (600ms)
3. `eric feinstein` appears scrambling through random chars for ~400ms; each character locks left-to-right with a brief rainbow hue on lock, settling to white
4. Overlay dissolves upward; background shader fades in underneath (400ms)

Skippable via any click or keypress. Skipped entirely on mobile and when `prefers-reduced-motion` is set.

### GlitchText — `GlitchText.jsx`

Reusable animation primitive. Props: `children: string`, `trigger?: any` (re-runs on change), `duration?: number`. On trigger, renders random characters in place for the duration, locking one character at a time left-to-right. Rainbow hue on each character during scramble; settles to `currentColor`. Used by the intro, section headers on route change, and post titles on hover.

### Route transitions

`framer-motion` `AnimatePresence` wrapping `<Routes>`. Exit: fade + 8px translate up, 180ms. Enter: header glitch-ins, body fades in, 220ms.

## Per-Tab Treatments

All tabs lose the existing `#121212` rounded card. Content sits directly on the shader with generous negative space. Each section begins with `// <section-label>` in dim gray, then a glitch-in title.

**About** — Left: big asymmetric headline "front-end engineer / guitarist / vibe-coder" with each role cycling on a 3s timer via GlitchText. Below: existing About body text in larger JetBrains Mono with generous line-height. Right: the existing `me.jpg` in a tilted frame with subtle cursor-driven parallax and a CSS chromatic-aberration hover effect.

**Experience** — Vertical timeline, left-aligned. 1px low-alpha vertical line on the left with dots at each entry. Each row: company name (large), title + period (dim metadata), bullets. Logo to the right of the company name, grayscale by default, colorizes on row hover.

**Education** — Same timeline pattern as Experience for consistency. Two rows. `// formally` section label.

**Skills** — Keep drag-to-sort chips and the confetti easter egg. Redesign chips: outlined pill (1px border, no fill), monochrome. On drag, chip gets a glitch-burst trailing effect and leaves a rainbow ghost outline where it was. Category headers become `// languages`, `// frameworks`, etc.

**Music** — Keep the Samply iframe (primary content). Wrap in a thin outlined card with a one-shot glitch-scan sweep on mount. `// now playing` label. Existing copy tightened to feel more like liner notes.

**Blog** — Covered in detail below.

## Blog

### Authoring format

Posts live at `src/content/posts/YYYY-MM-DD-<slug>.md`. Frontmatter schema:

```yaml
---
title: "Why I let Claude rewrite my resume site"
date: "2026-04-19"
slug: "claude-rewrote-my-site"
excerpt: "A one-line hook for the list view."
tags: ["claude", "react", "meta"]
---
```

All frontmatter fields are required. The filename date is redundant with the frontmatter date but exists so files sort naturally in the filesystem.

### Loading — `src/lib/posts.js`

Uses CRA's `require.context` to glob `src/content/posts/*.md` at build time, imports each as a raw string, parses frontmatter with `gray-matter`. Exports:

- `getAllPosts(): PostMeta[]` — sorted newest-first, frontmatter only
- `getPostBySlug(slug): Post | null` — full content + frontmatter

If CRA5 / Webpack 5 does not raw-import markdown out of the box, fallback is a tiny `scripts/build-posts.js` that runs in `prebuild` and writes `src/content/posts.generated.json`.

### BlogList — `BlogList.jsx`

One row per post (no cards, no thumbnails):

```
2026-04-19   Why I let Claude rewrite my resume site
             A one-line hook for the list view.
             3 min read · claude · react · meta
```

Date in dim gray, title large and hover-glitches, excerpt body-size, metadata dim. Newest first. Tags are displayed but not interactive.

### BlogPost — `BlogPost.jsx`

- Title large at top, glitch-in on mount
- Metadata strip: date · read time · tags
- Body: `react-markdown` + `remark-gfm`, max width ~72ch
- Custom renderers:
  - `h1`/`h2`/`h3` get the `//` comment treatment
  - `code` (inline) — subtle background, monospace
  - `pre code` — `react-syntax-highlighter` with a custom theme matching the site palette (no green-on-black)
  - `blockquote` — 2px `--fg-dim` left border, italic text
  - `a` — underlined in `--fg-faint`, underline becomes `--rainbow` on hover
  - `img` — full-width, subtle frame
- Reading time: `Math.ceil(wordCount / 225)` minutes
- Back-to-blog link at the bottom

### Command palette integration

Every post appears in the palette under a `Blog` group as `Blog / <title>`. Fuzzy-matchable. Enter navigates to `/#/blog/<slug>`.

## Accessibility & Motion

- `prefers-reduced-motion: reduce`:
  - Shader background → static CSS radial gradient
  - GlitchText → simple fade (no scramble)
  - Intro → skipped
  - Route transitions → instant
  - Photo chromatic aberration → disabled
- Focus rings present on all interactive elements (1px rainbow outline)
- Color contrast white-on-`#050507` is ~20:1 (WCAG AAA)
- Command palette is keyboard-first by construction (cmdk)
- All images keep alt text

## Mobile

- Command palette opens fullscreen; trigger label is `menu`
- Shader disabled (static gradient fallback)
- Intro skipped on first visit
- Single-column layout everywhere
- Blog body at 16px base; code blocks scroll horizontally

## Deployment

Unchanged. `npm run deploy` still runs `gh-pages -d build`. HashRouter means no `404.html` redirect trick is needed. Bundle size grows (~500KB gzipped from R3F/three) — acceptable; `<Background>` is lazy-loaded so it does not block first paint.

## Risks & Callouts

- **CRA markdown loading** — Webpack 5 should handle `?raw` / asset modules cleanly. Fallback plan: `scripts/build-posts.js` emitting JSON.
- **Three.js bundle size** — mitigated by lazy-loading the shader canvas.
- **`react-beautiful-dnd`** — unmaintained but still works for the Skills drag. Not replacing today.
- **MDX later** — if we want interactive demos in posts, we would need CRA ejection or a migration (Astro / Next.js). Not blocking anything now.
- **SEO** — HashRouter URLs are not crawled by search engines. Explicitly accepted: SEO is a non-goal.

## Out of Scope (deferred)

- Tag filtering / tag pages
- RSS feed
- Post pagination
- Comments
- Search beyond the command palette
- MDX / interactive post content
- Migration off CRA
