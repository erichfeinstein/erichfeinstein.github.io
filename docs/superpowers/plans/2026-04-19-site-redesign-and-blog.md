# Site Redesign + Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing CRA + MUI resume site with a hybrid aesthetic (shader background + terminal cues + glitch accents), add a HashRouter-based `/blog` section authored as markdown files, and ship a command palette (`/` hotkey) as the sole navigation.

**Architecture:** React 18 SPA remains on CRA. Introduce `react-router-dom` HashRouter. Add a global shell (background shader, nav, command palette, intro) that sits over all routes. Posts live as markdown files under `src/content/posts/`, loaded at build time via `require.context` and `gray-matter`, rendered with `react-markdown`. Existing tab components are re-dressed to drop their inner cards and adopt the new type/palette.

**Tech Stack:** React 18, CRA 5 (Webpack 5), react-router-dom 6, cmdk, framer-motion, @react-three/fiber + three, react-markdown + remark-gfm, react-syntax-highlighter, gray-matter, JetBrains Mono (Google Fonts).

**Spec:** `docs/superpowers/specs/2026-04-19-site-redesign-and-blog-design.md`

**Testing note:** CRA ships with Jest + React Testing Library preconfigured. `npm test` runs the watcher; `CI=true npm test` runs once. Tests live next to modules as `*.test.js`. TDD is applied where it fits (pure logic like the post loader, the GlitchText scramble). Visual components (shader, intro, layout changes) get smoke tests only (mounts without crashing, key elements render) — their real QA is manual `npm start` inspection, called out in each task.

---

## File Structure

New files:
- `src/content/posts/2026-04-19-first-post.md` — sample post
- `src/lib/posts.js` — post loader (build-time)
- `src/lib/posts.test.js`
- `src/components/shell/Background.jsx` — R3F shader canvas
- `src/components/shell/Nav.jsx` — top bar with the section path
- `src/components/shell/CommandPalette.jsx` — `/` overlay
- `src/components/shell/Intro.jsx` — one-shot cinematic
- `src/components/shell/GlitchText.jsx` — scramble-lock animation
- `src/components/shell/GlitchText.test.jsx`
- `src/components/shell/SectionHeader.jsx` — `// label` + glitch title
- `src/components/blog/BlogList.jsx`
- `src/components/blog/BlogPost.jsx`
- `src/styles/theme.css` — palette tokens, font, resets
- `src/hooks/useReducedMotion.js` — `prefers-reduced-motion` wrapper

Modified files:
- `package.json` — new deps, `homepage` field unchanged
- `public/index.html` — JetBrains Mono `<link>`
- `src/index.js` — upgrade to `createRoot`, wrap in `<HashRouter>`
- `src/App.js` — mount shell + `<Routes>`
- `src/components/About.js` — redesigned, drop inner card
- `src/components/Experience.js` — timeline redesign
- `src/components/Education.js` — timeline redesign
- `src/components/Skills.js` — outlined chips, no inner card
- `src/components/Music.js` — outlined frame around iframe
- `src/styles/index.css` — remove old animations, keep what's reused

Deleted files:
- `src/components/Home.js` — superseded by router
- `src/components/ResumeHeader.js`, `src/components/ResumeHeader.css` — unused
- `src/components/RibbonContainer.js`, `src/styles/ribbons.css` — unused

---

## Task 1: Install dependencies, set up font, palette tokens

**Files:**
- Modify: `package.json`
- Modify: `public/index.html`
- Create: `src/styles/theme.css`
- Modify: `src/styles/index.css`

- [ ] **Step 1: Install new dependencies**

Run:
```bash
npm install react-router-dom@6 cmdk framer-motion three @react-three/fiber react-markdown remark-gfm react-syntax-highlighter gray-matter
```
Expected: `package.json` gains the listed deps with `^` semver ranges; `package-lock.json` updates; no install errors. If peer-dep warnings appear they're fine — we're on React 18 which all of these support.

- [ ] **Step 2: Add JetBrains Mono to `public/index.html`**

Replace the entire file contents with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="./favicon.ico" type="image/x-icon"/>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <title>Eric Feinstein</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

- [ ] **Step 3: Create `src/styles/theme.css` with palette tokens**

```css
:root {
  --bg: #050507;
  --fg: #ffffff;
  --fg-dim: rgba(255, 255, 255, 0.55);
  --fg-faint: rgba(255, 255, 255, 0.12);
  --rainbow: linear-gradient(270deg, #ff2bd6, #00e5ff, #00ff88, #ff2bd6);
  --mono: 'JetBrains Mono', ui-monospace, 'Courier New', monospace;
  --max-prose: 72ch;
  --max-content: 960px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--mono);
  font-weight: 400;
  min-height: 100%;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--fg);
  text-decoration: underline;
  text-decoration-color: var(--fg-faint);
  text-underline-offset: 3px;
  transition: text-decoration-color 200ms;
}
a:hover { text-decoration-color: transparent; }

::selection { background: var(--fg); color: var(--bg); }

@keyframes rainbow-sweep {
  0% { background-position: 0% 50%; }
  100% { background-position: 400% 50%; }
}

.rainbow-text {
  background: var(--rainbow);
  background-size: 400% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow-sweep 4s linear infinite;
}

.section-label {
  color: var(--fg-dim);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.blink-cursor::after {
  content: '_';
  display: inline-block;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 4: Replace `src/styles/index.css` with a minimal import**

```css
@import './theme.css';

.jiggle { animation: jiggleAnim 0.5s ease; }
@keyframes jiggleAnim {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(3deg); }
  50% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
  100% { transform: rotate(0deg); }
}
```

(We're dropping the orb background, typewriter CSS, and `bgColorAnimation` — they're replaced by the shader and GlitchText.)

- [ ] **Step 5: Delete unused files**

Run:
```bash
rm src/components/ResumeHeader.js src/components/ResumeHeader.css src/components/RibbonContainer.js src/styles/ribbons.css src/styles/animations.css
```
Expected: files removed. `animations.css` is removed because its only content (`jiggle`) is now in `index.css`.

- [ ] **Step 6: Verify app still compiles**

Run: `CI=true npm run build`
Expected: build succeeds. Warnings about unused imports in About/Home are OK for now (About imports `useEffect` which is still used).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: add redesign deps, JetBrains Mono, palette tokens"
```

---

## Task 2: Introduce HashRouter, preserve existing tabs temporarily

**Goal:** Switch to routing without changing UX. Tabs become router-aware. The shell doesn't exist yet — `Home.js` continues to render tabs.

**Files:**
- Modify: `src/index.js`
- Modify: `src/App.js`
- Modify: `src/components/Home.js`

- [ ] **Step 1: Upgrade `src/index.js` to `createRoot` and wrap in `<HashRouter>`**

Replace file contents:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
```

- [ ] **Step 2: Simplify `src/App.js` — remove MUI ThemeProvider, render Home**

Replace file contents:

```jsx
import React from 'react';
import Home from './components/Home';

function App() {
  return <Home />;
}

export default App;
```

(MUI's ThemeProvider stays inside `Home.js` for now — we'll remove it in Task 5.)

- [ ] **Step 3: Rewrite `src/components/Home.js` to use `<Routes>` while keeping MUI tabs**

Replace file contents:

```jsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Tabs, Tab, Box, CssBaseline, useMediaQuery, IconButton, List, ListItem,
  ListItemText, AppBar, Toolbar, Typography, SwipeableDrawer,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import About from './About';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Music from './Music';

const theme = createTheme({
  palette: { text: { primary: '#fff' }, background: { default: '#000' } },
  typography: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
});

const routes = [
  { path: '/',           label: 'About',      element: <About /> },
  { path: '/experience', label: 'Experience', element: <Experience /> },
  { path: '/education',  label: 'Education',  element: <Education /> },
  { path: '/skills',     label: 'Skills',     element: <Skills /> },
  { path: '/music',      label: 'Music',      element: <Music /> },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const activeIndex = Math.max(0, routes.findIndex((r) => r.path === location.pathname));

  const handleChange = (_e, newValue) => navigate(routes[newValue].path);

  const handleNavItemClick = (index) => {
    navigate(routes[index].path);
    setDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {isMobile ? (
          <>
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ width: 48, height: 48 }}>
                  <Typography variant="h4" component="span" sx={{ color: 'white' }}>menu</Typography>
                </IconButton>
                <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h5" component="span">{routes[activeIndex].label}</Typography>
                </Box>
                <Box sx={{ width: 48, height: 48 }} />
              </Toolbar>
            </AppBar>
            <SwipeableDrawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onOpen={() => setDrawerOpen(true)}
              disableSwipeToOpen
              sx={{ '& .MuiDrawer-paper': { width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }}
            >
              <Box onClick={() => setDrawerOpen(false)} sx={{ position: 'absolute', left: 16, top: 16, cursor: 'pointer' }}>
                <Typography variant="h4" sx={{ color: '#777' }}>back</Typography>
              </Box>
              <List sx={{ width: '100%', textAlign: 'center' }}>
                {routes.map((r, index) => (
                  <ListItem button key={r.label} onClick={() => handleNavItemClick(index)} sx={{ justifyContent: 'center' }}>
                    <ListItemText primary={r.label} sx={{ '& span': { fontSize: '3.5rem !important' } }} />
                  </ListItem>
                ))}
              </List>
            </SwipeableDrawer>
          </>
        ) : (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeIndex} onChange={handleChange} centered>
              {routes.map((r) => <Tab key={r.label} label={r.label} />)}
            </Tabs>
          </Box>
        )}

        <Box sx={{ p: { xs: 2, sm: 3 }, color: 'white' }}>
          <Routes>
            {routes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Home;
```

- [ ] **Step 4: Verify the app runs and navigates**

Run: `npm start` (opens browser). Click each tab. Expected: URL hash updates (`#/`, `#/experience`, etc.); correct section renders. Refresh on `#/skills` still shows Skills. Close the dev server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add HashRouter, migrate tabs to routes"
```

---

## Task 3: Post loader module (TDD)

**Files:**
- Create: `src/lib/posts.js`
- Create: `src/lib/posts.test.js`
- Create: `src/content/posts/2026-04-19-first-post.md` (fixture for tests)

- [ ] **Step 1: Create the sample post**

`src/content/posts/2026-04-19-first-post.md`:

```markdown
---
title: "hello, this site is alive now"
date: "2026-04-19"
slug: "hello-this-site-is-alive"
excerpt: "Spinning up the blog and vibing with Claude."
tags: ["meta", "claude"]
---

This is the first post. The site got redesigned; the blog exists now.

## What's next

- more posts
- more vibes
```

- [ ] **Step 2: Write `src/lib/posts.test.js`**

```jsx
import { getAllPosts, getPostBySlug } from './posts';

describe('posts loader', () => {
  test('getAllPosts returns posts sorted newest-first', () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  test('each post has required frontmatter fields', () => {
    for (const p of getAllPosts()) {
      expect(typeof p.title).toBe('string');
      expect(typeof p.date).toBe('string');
      expect(typeof p.slug).toBe('string');
      expect(typeof p.excerpt).toBe('string');
      expect(Array.isArray(p.tags)).toBe(true);
    }
  });

  test('getPostBySlug returns full post content', () => {
    const p = getPostBySlug('hello-this-site-is-alive');
    expect(p).not.toBeNull();
    expect(p.title).toBe('hello, this site is alive now');
    expect(p.content).toMatch(/first post/);
  });

  test('getPostBySlug returns null for unknown slug', () => {
    expect(getPostBySlug('does-not-exist')).toBeNull();
  });
});
```

- [ ] **Step 3: Run the test and confirm it fails**

Run: `CI=true npm test -- --testPathPattern=posts.test`
Expected: FAIL — "Cannot find module './posts'".

- [ ] **Step 4: Implement `src/lib/posts.js`**

```jsx
import matter from 'gray-matter';

const req = require.context('!!raw-loader!../content/posts', false, /\.md$/);

const _posts = req.keys().map((key) => {
  const raw = req(key).default;
  const { data, content } = matter(raw);
  return {
    title: data.title,
    date: data.date,
    slug: data.slug,
    excerpt: data.excerpt,
    tags: data.tags || [],
    content,
  };
});

_posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getAllPosts() {
  return _posts.map(({ content, ...meta }) => meta);
}

export function getPostBySlug(slug) {
  return _posts.find((p) => p.slug === slug) || null;
}

export function getReadingTimeMinutes(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}
```

Note: `!!raw-loader!` inlines `raw-loader` at the import site so we don't need to configure Webpack. CRA already bundles `raw-loader` as a transitive dep of `react-scripts`. If for some reason that's not available, fall back: install it explicitly via `npm install --save-dev raw-loader`.

- [ ] **Step 5: Run the test and confirm it passes**

Run: `CI=true npm test -- --testPathPattern=posts.test`
Expected: PASS (4 tests).

If it fails with "cannot find raw-loader": `npm install --save-dev raw-loader` and re-run.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add markdown post loader with tests"
```

---

## Task 4: GlitchText component (TDD)

**Files:**
- Create: `src/components/shell/GlitchText.jsx`
- Create: `src/components/shell/GlitchText.test.jsx`
- Create: `src/hooks/useReducedMotion.js`

- [ ] **Step 1: Create `src/hooks/useReducedMotion.js`**

```jsx
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Write `src/components/shell/GlitchText.test.jsx`**

```jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import GlitchText from './GlitchText';

jest.useFakeTimers();

describe('GlitchText', () => {
  test('renders the final string after the duration', () => {
    render(<GlitchText duration={100}>hello</GlitchText>);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  test('scramble output has the same length as the final string', () => {
    render(<GlitchText duration={500}>abcdef</GlitchText>);
    act(() => { jest.advanceTimersByTime(50); });
    const node = document.querySelector('[data-testid="glitch-text"]');
    expect(node.textContent.length).toBe(6);
  });

  test('re-scrambles when trigger changes', () => {
    const { rerender } = render(<GlitchText duration={100} trigger={1}>one</GlitchText>);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.getByText('one')).toBeInTheDocument();

    rerender(<GlitchText duration={100} trigger={2}>two</GlitchText>);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.getByText('two')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test and confirm it fails**

Run: `CI=true npm test -- --testPathPattern=GlitchText.test`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `src/components/shell/GlitchText.jsx`**

```jsx
import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const GLYPHS = '!<>-_\\/[]{}=+*^?#________';

function randChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export default function GlitchText({
  children,
  duration = 600,
  trigger,
  className = '',
  as: Tag = 'span',
}) {
  const target = String(children);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? target : ''.padEnd(target.length, ' '));
  const rafRef = useRef();
  const startRef = useRef();

  useEffect(() => {
    if (reduced) {
      setDisplay(target);
      return;
    }
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const locked = Math.floor(progress * target.length);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < locked) out += target[i];
        else if (target[i] === ' ') out += ' ';
        else out += randChar();
      }
      setDisplay(out);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, trigger, reduced]);

  const isScrambling = display !== target && !reduced;

  return (
    <Tag
      data-testid="glitch-text"
      className={`${className} ${isScrambling ? 'rainbow-text' : ''}`.trim()}
    >
      {display}
    </Tag>
  );
}
```

Note: during tests `useReducedMotion` returns `false` by default (jsdom's `matchMedia` doesn't match), so the RAF scramble runs. The tests use `jest.useFakeTimers()` — but we use `requestAnimationFrame`, which Jest advances alongside timers via `jest.advanceTimersByTime`. If a test flakes, add `jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] })` and rely on `setTimeout` instead — but try the plain setup first.

- [ ] **Step 5: Run the test and confirm it passes**

Run: `CI=true npm test -- --testPathPattern=GlitchText.test`
Expected: PASS (3 tests).

If a test fails because `matchMedia` is undefined in jsdom, add this to `src/setupTests.js` (create if missing):

```jsx
import '@testing-library/jest-dom';

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  });
}
```

CRA auto-detects `src/setupTests.js`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add GlitchText scramble-lock component with tests"
```

---

## Task 5: Nav + CommandPalette (removes old tabs)

**Goal:** Swap the MUI tabs/drawer for the new shell: a top Nav showing `~/eric $ cd <section>` and a `press /` pill that opens a `cmdk` palette. After this task, there are no visible links — navigation is palette-only.

**Files:**
- Create: `src/components/shell/Nav.jsx`
- Create: `src/components/shell/CommandPalette.jsx`
- Modify: `src/App.js`
- Delete: `src/components/Home.js`

- [ ] **Step 1: Create `src/components/shell/Nav.jsx`**

```jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const sectionLabel = (path) => {
  if (path === '/' || path === '') return 'about';
  if (path.startsWith('/blog/')) return `blog / ${path.slice('/blog/'.length)}`;
  return path.slice(1);
};

export default function Nav({ onOpenPalette }) {
  const { pathname } = useLocation();
  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        height: 48, display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 12,
        backdropFilter: 'blur(8px)',
        background: 'rgba(5,5,7,0.55)',
        borderBottom: '1px solid var(--fg-faint)',
        fontSize: '0.95rem',
      }}
    >
      <span style={{ color: 'var(--fg-dim)' }}>~/eric $ cd&nbsp;</span>
      <span className="blink-cursor">{sectionLabel(pathname)}</span>
      <div style={{ flex: 1 }} />
      <button
        onClick={onOpenPalette}
        aria-label="Open command palette"
        style={{
          background: 'transparent',
          color: 'var(--fg)',
          border: '1px solid var(--fg-faint)',
          borderRadius: 6,
          padding: '4px 10px',
          fontFamily: 'inherit',
          fontSize: '0.85rem',
          cursor: 'pointer',
        }}
      >
        press <kbd style={{ padding: '0 4px', border: '1px solid var(--fg-faint)', borderRadius: 3 }}>/</kbd>
      </button>
    </header>
  );
}
```

- [ ] **Step 2: Create `src/components/shell/CommandPalette.jsx`**

```jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { getAllPosts } from '../../lib/posts';

const SECTIONS = [
  { label: 'About',      path: '/' },
  { label: 'Experience', path: '/experience' },
  { label: 'Education',  path: '/education' },
  { label: 'Skills',     path: '/skills' },
  { label: 'Music',      path: '/music' },
  { label: 'Blog',       path: '/blog' },
];

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => { setPosts(getAllPosts()); }, []);

  const go = (path) => { onOpenChange(false); navigate(path); };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Command palette"
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(5,5,7,0.7)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '12vh',
      }}
    >
      <Command
        label="Global command menu"
        style={{
          width: 'min(560px, 92vw)',
          background: '#0a0a0c',
          border: '1px solid var(--fg-faint)',
          borderRadius: 8,
          padding: 8,
          fontFamily: 'inherit',
        }}
      >
        <Command.Input
          autoFocus
          placeholder="type to search..."
          style={{
            width: '100%', background: 'transparent', color: 'var(--fg)',
            border: 'none', outline: 'none', padding: '8px 12px',
            fontFamily: 'inherit', fontSize: '1rem',
          }}
        />
        <Command.List style={{ maxHeight: 320, overflow: 'auto', marginTop: 8 }}>
          <Command.Empty style={{ padding: 12, color: 'var(--fg-dim)' }}>
            no matches.
          </Command.Empty>
          <Command.Group heading="Sections">
            {SECTIONS.map((s) => (
              <Command.Item key={s.path} value={s.label} onSelect={() => go(s.path)}>
                <ItemRow label={s.label} hint={s.path} />
              </Command.Item>
            ))}
          </Command.Group>
          {posts.length > 0 && (
            <Command.Group heading="Blog">
              {posts.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`Blog ${p.title} ${p.tags.join(' ')}`}
                  onSelect={() => go(`/blog/${p.slug}`)}
                >
                  <ItemRow label={p.title} hint={p.date} />
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}

function ItemRow({ label, hint }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer' }}>
      <span>{label}</span>
      <span style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>{hint}</span>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `src/App.js` to mount shell + routes**

```jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Music from './components/Music';
import Nav from './components/shell/Nav';
import CommandPalette from './components/shell/CommandPalette';

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <main style={{ paddingTop: 64, paddingInline: 24, maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/music" element={<Music />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
```

- [ ] **Step 4: Delete `src/components/Home.js`**

Run:
```bash
rm src/components/Home.js
```

- [ ] **Step 5: Verify manually**

Run: `npm start`. Expected: no MUI tabs. Top bar shows `~/eric $ cd about` with a blinking cursor and a `press /` pill. Pressing `/` opens the palette. Type `exp` then Experience highlights; Enter navigates to `/#/experience` and the path segment updates. Esc closes. Click backdrop closes. Focus is in the palette input on open.

The `/blog` route doesn't exist yet — selecting "Blog" will redirect to `/` via the wildcard. Fine for now; Task 9 adds it.

Stop the dev server with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: replace tabs with Nav + command palette"
```

---

## Task 6: Background shader

**Files:**
- Create: `src/components/shell/Background.jsx`
- Modify: `src/App.js`

- [ ] **Step 1: Create `src/components/shell/Background.jsx`**

```jsx
import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec2  uRes;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m = max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0*fract(p*C.www)-1.0;
    vec3 h = abs(x)-0.5;
    vec3 ox = floor(x+0.5);
    vec3 a0 = x-ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x*x0.x + h.x*x0.y;
    g.yz = a0.yz*x12.xz + h.yz*x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p  = (uv - 0.5) * vec2(uRes.x/uRes.y, 1.0);
    vec2 m  = (uMouse - 0.5) * vec2(uRes.x/uRes.y, 1.0);

    float t = uTime * 0.05;
    vec2 q = vec2(snoise(p + t), snoise(p + 3.1 + t));
    vec2 r = vec2(snoise(p + 1.7 * q + 0.02 * m + t), snoise(p + 0.8 * q - t));
    float n = snoise(p + 2.0 * r);

    vec3 base   = vec3(0.019, 0.019, 0.027);
    vec3 violet = vec3(0.25, 0.05, 0.45);
    vec3 cyan   = vec3(0.0, 0.5, 0.6);
    vec3 col = base + 0.06 * mix(violet, cyan, 0.5 + 0.5 * n);
    col += 0.02 * r.y;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderPlane() {
  const matRef = useRef();
  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRes:   { value: new THREE.Vector2(1, 1) },
  }), []);

  useFrame(({ clock, size, mouse }) => {
    uniforms.uTime.value  = clock.elapsedTime;
    uniforms.uRes.value.set(size.width, size.height);
    uniforms.uMouse.value.set((mouse.x + 1) / 2, (mouse.y + 1) / 2);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={matRef} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

const gradientFallback = {
  position: 'fixed', inset: 0, zIndex: -1,
  background: 'radial-gradient(ellipse at 30% 20%, rgba(50,10,90,0.35), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,100,120,0.3), transparent 60%), #050507',
};

export default function Background() {
  const reduced = useReducedMotion();
  const isNarrow = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;

  if (reduced || isNarrow) {
    return <div style={gradientFallback} aria-hidden="true" />;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1 }} aria-hidden="true">
      <Suspense fallback={<div style={gradientFallback} />}>
        <Canvas orthographic camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
          <ShaderPlane />
        </Canvas>
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Lazy-load `Background` in `src/App.js`**

Replace `src/App.js` contents with:

```jsx
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Music from './components/Music';
import Nav from './components/shell/Nav';
import CommandPalette from './components/shell/CommandPalette';

const Background = lazy(() => import('./components/shell/Background'));

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (e.key === '/' && !typing) { e.preventDefault(); setPaletteOpen(true); }
      else if (e.key === 'Escape') { setPaletteOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Suspense fallback={null}><Background /></Suspense>
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <main style={{ paddingTop: 64, paddingInline: 24, maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/music" element={<Music />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
```

- [ ] **Step 3: Verify manually**

Run: `npm start`. Expected on desktop: animated noise-blob background slowly drifting behind the UI, subtly responds when you move the cursor across the viewport. Set `prefers-reduced-motion` via browser devtools (DevTools → Rendering → Emulate CSS) and the shader disappears, static gradient appears. Narrow the window below 768px, static gradient. Ctrl+C to stop.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add R3F shader background with reduced-motion fallback"
```

---

## Task 7: Intro cinematic

**Files:**
- Create: `src/components/shell/Intro.jsx`
- Modify: `src/App.js`
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Create `src/components/shell/Intro.jsx`**

```jsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GlitchText from './GlitchText';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const KEY = 'intro_played_v1';

export default function Intro() {
  const reduced = useReducedMotion();
  const isNarrow = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  const skip = reduced || isNarrow || (typeof window !== 'undefined' && sessionStorage.getItem(KEY));

  const [stage, setStage] = useState(skip ? -1 : 0);
  const [gone, setGone] = useState(skip);

  useEffect(() => {
    if (skip) return;
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 900),
      setTimeout(() => { setGone(true); sessionStorage.setItem(KEY, '1'); }, 2200),
    ];
    const bail = () => {
      timers.forEach(clearTimeout);
      setGone(true);
      sessionStorage.setItem(KEY, '1');
    };
    window.addEventListener('keydown', bail);
    window.addEventListener('pointerdown', bail);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', bail);
      window.removeEventListener('pointerdown', bail);
    };
  }, [skip]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200, background: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16,
          }}
          aria-hidden="true"
        >
          <div style={{ color: 'var(--fg-dim)', fontSize: '0.9rem' }}>
            {stage >= 0 && 'booting...'}
          </div>
          <div style={{ color: 'var(--fg-dim)', fontSize: '1rem' }}>
            {stage >= 1 && <span className="blink-cursor">~/eric $ whoami</span>}
          </div>
          {stage >= 2 && (
            <GlitchText duration={800} trigger={stage} as="h1">
              eric feinstein
            </GlitchText>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Mount `Intro` in `src/App.js`**

Add import at top:
```jsx
import Intro from './components/shell/Intro';
```

Mount it as the first child inside the returned fragment, above `<Background />`:

```jsx
return (
  <>
    <Intro />
    <Suspense fallback={null}><Background /></Suspense>
    <Nav onOpenPalette={() => setPaletteOpen(true)} />
    <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    <main style={{ paddingTop: 64, paddingInline: 24, maxWidth: 'var(--max-content)', margin: '0 auto' }}>
      ...
    </main>
  </>
);
```

- [ ] **Step 3: Add typography sizes to `src/styles/theme.css`**

Append to the bottom of `src/styles/theme.css`:

```css
h1 { font-size: clamp(2rem, 6vw, 4.5rem); font-weight: 500; letter-spacing: -0.02em; }
h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 500; letter-spacing: -0.015em; }
h3 { font-size: 1.25rem; font-weight: 500; }
```

- [ ] **Step 4: Verify manually**

Run: `npm start`. Expected first load: black overlay, then "booting..." appears, then "~/eric $ whoami" with blinking cursor, then "eric feinstein" scrambles in (rainbow hue during scramble, then white), then the overlay fades upward revealing the shader background and site. Click during the intro instantly skips. Open a new tab to the same URL and navigate to `/#/experience`, no intro replay (sessionStorage). Close tab and reopen, intro replays.

To force-test repeat: `sessionStorage.clear()` in devtools console and reload.

Ctrl+C when done.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add one-shot cinematic intro"
```

---

## Task 8: Route transitions

**Files:**
- Modify: `src/App.js`

- [ ] **Step 1: Wrap routes in `AnimatePresence` and add motion wrappers**

Replace the relevant section of `src/App.js`. Add `AnimatePresence`, `motion`, and `useLocation` imports:

```jsx
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
```

Inside `App()`, add:

```jsx
const location = useLocation();
```

Replace the `<main>...</main>` block with:

```jsx
<main style={{ paddingTop: 64, paddingInline: 24, maxWidth: 'var(--max-content)', margin: '0 auto' }}>
  <AnimatePresence mode="wait">
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
    >
      <Routes location={location}>
        <Route path="/" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/education" element={<Education />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/music" element={<Music />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </motion.div>
  </AnimatePresence>
</main>
```

- [ ] **Step 2: Verify manually**

Run: `npm start`. Open palette, switch sections. Expected: 180-220ms smooth fade + vertical nudge on each transition. Enable `prefers-reduced-motion` — transitions become instant. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add route transitions with framer-motion"
```

---

## Task 9: BlogList + BlogPost routes

**Files:**
- Create: `src/components/blog/BlogList.jsx`
- Create: `src/components/blog/BlogPost.jsx`
- Create: `src/components/shell/SectionHeader.jsx`
- Modify: `src/App.js`

- [ ] **Step 1: Create `src/components/shell/SectionHeader.jsx`**

```jsx
import React from 'react';
import GlitchText from './GlitchText';

export default function SectionHeader({ label, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="section-label">// {label}</div>
      <GlitchText as="h1" duration={700}>{children}</GlitchText>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/blog/BlogList.jsx`**

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../../lib/posts';
import SectionHeader from '../shell/SectionHeader';

export default function BlogList() {
  const posts = getAllPosts();
  return (
    <div>
      <SectionHeader label="blog">writing</SectionHeader>
      {posts.length === 0 && <p style={{ color: 'var(--fg-dim)' }}>nothing here yet.</p>}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {posts.map((p) => (
          <li key={p.slug}>
            <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>{p.date}</div>
            <Link
              to={`/blog/${p.slug}`}
              style={{ textDecoration: 'none', color: 'var(--fg)' }}
            >
              <h2 style={{ margin: '0.25rem 0' }}>{p.title}</h2>
            </Link>
            <p style={{ color: 'var(--fg-dim)', margin: '0.25rem 0 0.5rem' }}>{p.excerpt}</p>
            <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
              {p.tags.map((t) => `#${t}`).join(' · ')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/blog/BlogPost.jsx`**

```jsx
import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getPostBySlug, getReadingTimeMinutes } from '../../lib/posts';
import SectionHeader from '../shell/SectionHeader';

const mdComponents = {
  h1: ({ children }) => <h2 style={{ marginTop: '2rem' }}>// {children}</h2>,
  h2: ({ children }) => <h2 style={{ marginTop: '2rem' }}>// {children}</h2>,
  h3: ({ children }) => <h3 style={{ marginTop: '1.5rem', color: 'var(--fg-dim)' }}>// {children}</h3>,
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '2px solid var(--fg-dim)',
      paddingLeft: '1rem', margin: '1rem 0', fontStyle: 'italic', color: 'var(--fg-dim)',
    }}>{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt} style={{ width: '100%', border: '1px solid var(--fg-faint)', borderRadius: 4, margin: '1rem 0' }} />
  ),
  code({ inline, className, children }) {
    const match = /language-(\w+)/.exec(className || '');
    if (inline) {
      return (
        <code style={{ background: 'var(--fg-faint)', padding: '0 4px', borderRadius: 3 }}>
          {children}
        </code>
      );
    }
    return (
      <SyntaxHighlighter language={match ? match[1] : 'text'} style={vscDarkPlus} PreTag="div">
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  if (!post) return <Navigate to="/blog" replace />;

  const minutes = getReadingTimeMinutes(post.content);

  return (
    <article style={{ maxWidth: 'var(--max-prose)' }}>
      <SectionHeader label={`blog / ${post.slug}`}>{post.title}</SectionHeader>
      <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        {post.date} · {minutes} min read · {post.tags.map((t) => `#${t}`).join(' · ')}
      </div>
      <div style={{ lineHeight: 1.7 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {post.content}
        </ReactMarkdown>
      </div>
      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--fg-faint)', paddingTop: '1rem' }}>
        <Link to="/blog" style={{ color: 'var(--fg-dim)' }}>back to blog</Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Add blog routes in `src/App.js`**

Add imports at the top:

```jsx
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
```

Inside the `<Routes>` block, add before the catch-all:

```jsx
<Route path="/blog" element={<BlogList />} />
<Route path="/blog/:slug" element={<BlogPost />} />
```

- [ ] **Step 5: Verify manually**

Run: `npm start`. Press `/`, type `blog`, Blog entry visible. Enter, list shows one post (the one created in Task 3). Click the title, post renders: title up top, metadata strip, markdown body with `// What's next` header, back link at bottom. Open the palette again, the post title appears under the "Blog" group. Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add /blog list and post routes with markdown rendering"
```

---

## Task 10: Redesign About

**Files:**
- Modify: `src/components/About.js`

- [ ] **Step 1: Replace `src/components/About.js`**

```jsx
import React, { useEffect, useState } from 'react';
import GlitchText from './shell/GlitchText';
import SectionHeader from './shell/SectionHeader';

const ROLES = ['front-end engineer', 'guitarist', 'vibe-coder'];

export default function About() {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <SectionHeader label="whoami">eric feinstein</SectionHeader>

      <div style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)', marginBottom: '2rem', color: 'var(--fg-dim)' }}>
        i am a{' '}
        <GlitchText duration={500} trigger={roleIdx} className="rainbow-text">
          {ROLES[roleIdx]}
        </GlitchText>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: '2rem',
        alignItems: 'start',
      }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
          With over 5 years of experience, I am a front-end software engineer with a strong
          foundation in computer science and extensive knowledge of modern TypeScript and React.
          I thrive on collaborating with designers, product owners, and fellow engineers to
          create outstanding user experiences.
        </p>
        <img
          src="/me.jpg"
          alt="eric feinstein"
          style={{
            width: 220, height: 'auto',
            border: '1px solid var(--fg-faint)',
            transform: 'rotate(-1.5deg)',
            transition: 'filter 200ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'drop-shadow(2px 0 0 #ff2bd6) drop-shadow(-2px 0 0 #00e5ff)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm start`. Land on `/`. Expected: `// whoami` label, glitch-in "eric feinstein" title, cycling role line every 3s with a scramble effect, body paragraph on the left, tilted photo on the right with a chromatic-aberration RGB split on hover. No inner dark card. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: redesign About with glitch roles and tilted photo"
```

---

## Task 11: Redesign Experience + Education

**Files:**
- Modify: `src/components/Experience.js`
- Modify: `src/components/Education.js`

- [ ] **Step 1: Replace `src/components/Experience.js`**

```jsx
import React from 'react';
import SectionHeader from './shell/SectionHeader';

const experiences = [
  {
    company: 'Grubhub',
    logo: require('../assets/photos/grubhub.png'),
    title: 'Senior Software Engineer',
    period: 'Dec 2021 - Present',
    details: [
      'Led implementation of a BFF for dynamically generated merchant and product pages, leveraging Protobuf and a web renderer which I developed',
      'Built a content management tool for the Grubhub+ program in React which reduced the number of SEVs related to page performance and legal copy',
      'Unified the offers and promotions platform for enterprise and small business restaurants, lowering the overhead of maintaining both portals',
    ],
  },
  {
    company: 'Branding Brand',
    logo: require('../assets/photos/bb.png'),
    title: 'Development Manager',
    period: 'June 2020 - Dec 2021',
    details: [
      'Led team of engineers to build COVID-19 vaccination and PPE management forms, as well as e-commerce pages in React for Fortune 500 pharmaceuticals retailer',
      'Maintained and contributed to Flagship, an open-source code platform for developing e-commerce solutions across Web, iOS and Android using React Native Web',
    ],
  },
  {
    company: 'Cedrus Digital',
    logo: require('../assets/photos/cedrus.png'),
    title: 'Software Engineer',
    period: 'April 2019 - May 2020',
    details: [
      'Developed enterprise web application for an international auto rental company, scaffolded and built out pages for account management',
      'Created reusable and well-tested components using React, partnered with design team to develop efficient and responsive solutions for a great user experience',
    ],
  },
];

export default function Experience() {
  return (
    <div>
      <SectionHeader label="professionally">experience</SectionHeader>
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'var(--fg-faint)' }} />
        {experiences.map((exp, i) => (
          <article key={i} style={{ position: 'relative', marginBottom: '2.5rem' }}>
            <span style={{
              position: 'absolute', left: -21, top: 10, width: 9, height: 9, borderRadius: '50%',
              background: 'var(--bg)', border: '1px solid var(--fg)',
            }} />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem' }}>{exp.company}</h2>
                <div style={{ color: 'var(--fg-dim)' }}>{exp.title}</div>
                <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>{exp.period}</div>
              </div>
              <img
                src={exp.logo}
                alt={`${exp.company} logo`}
                style={{
                  width: 72, height: 72, objectFit: 'contain',
                  filter: 'grayscale(1) opacity(0.6)', transition: 'filter 200ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'none'; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(1) opacity(0.6)'; }}
              />
            </header>
            <ul style={{ listStyle: 'none', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {exp.details.map((d, j) => (
                <li key={j} style={{ paddingLeft: '1rem', position: 'relative', lineHeight: 1.6 }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--fg-dim)' }}>&gt;</span>
                  {d}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `src/components/Education.js`**

```jsx
import React from 'react';
import SectionHeader from './shell/SectionHeader';

const educationItems = [
  {
    institution: 'Fullstack Academy of Code',
    period: 'October 2018 - February 2019',
    degree: 'Software Engineering Immersive Program',
    location: 'New York, NY',
  },
  {
    institution: 'Case Western Reserve University',
    period: 'August 2014 - May 2018',
    degree: 'Bachelor of Arts, Computer Science',
    location: 'Cleveland, OH',
  },
];

export default function Education() {
  return (
    <div>
      <SectionHeader label="formally">education</SectionHeader>
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'var(--fg-faint)' }} />
        {educationItems.map((edu, i) => (
          <article key={i} style={{ position: 'relative', marginBottom: '2rem' }}>
            <span style={{
              position: 'absolute', left: -21, top: 10, width: 9, height: 9, borderRadius: '50%',
              background: 'var(--bg)', border: '1px solid var(--fg)',
            }} />
            <h2 style={{ fontSize: '1.4rem' }}>{edu.institution}</h2>
            <div>{edu.degree}</div>
            <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>{edu.period} · {edu.location}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify manually**

Run: `npm start`. Navigate to `/experience` and `/education`. Expected: left-aligned timeline with a faint vertical line and dots; company names big, titles dim; grayscale logos that color on hover; no inner card. Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: redesign Experience and Education as timelines"
```

---

## Task 12: Redesign Skills

**Files:**
- Modify: `src/components/Skills.js`

- [ ] **Step 1: Replace `src/components/Skills.js`**

```jsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import confetti from 'canvas-confetti';
import SectionHeader from './shell/SectionHeader';

const initialCategories = {
  Languages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
  'Markup & Styling': ['HTML', 'CSS', 'Sass'],
  Frameworks: ['React', 'React Native', 'Redux', 'Node', 'Jest', 'Jasmine'],
  APIs: ['REST APIs', 'GraphQL'],
  Tools: ['Git', 'GitHub', 'Jenkins', 'Spinnaker', 'Datadog', 'Sentry'],
  Databases: ['SQL', 'PostgreSQL'],
  'Coding Assistance': ['GitHub Copilot', 'Cursor AI', 'Claude Code'],
};

const isSortedAlphabetically = (arr) => arr.join() === [...arr].sort().join();

const triggerConfetti = () => {
  for (let i = 0; i < 10; i++) {
    confetti({ particleCount: 20, spread: 70, origin: { x: Math.random(), y: Math.random() } });
  }
};

const Chip = React.forwardRef(({ children, dragging, ...rest }, ref) => (
  <span
    ref={ref}
    {...rest}
    style={{
      ...(rest.style || {}),
      padding: '4px 10px',
      border: '1px solid var(--fg-faint)',
      borderRadius: 999,
      color: 'var(--fg)',
      background: dragging ? 'var(--fg-faint)' : 'transparent',
      cursor: 'grab',
      userSelect: 'none',
    }}
  >
    {children}
  </span>
));

export default function Skills() {
  const [categories, setCategories] = useState(initialCategories);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.droppableId !== result.destination.droppableId) return;
    const category = result.source.droppableId;
    const items = Array.from(categories[category]);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setCategories((prev) => ({ ...prev, [category]: items }));
    if (isSortedAlphabetically(items)) triggerConfetti();
  };

  return (
    <div>
      <SectionHeader label="skills">things i use</SectionHeader>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '2rem' }}>
        sort any category alphabetically for a surprise.
      </p>
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(categories).map(([categoryName, skills]) => (
          <div key={categoryName} style={{ marginBottom: '1.75rem' }}>
            <div className="section-label">// {categoryName.toLowerCase()}</div>
            <Droppable droppableId={categoryName} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
                >
                  {skills.map((skill, index) => (
                    <Draggable key={skill} draggableId={skill} index={index}>
                      {(p, snapshot) => (
                        <Chip
                          ref={p.innerRef}
                          dragging={snapshot.isDragging}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                        >
                          {skill}
                        </Chip>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm start`. Navigate to `/skills`. Expected: outlined pill chips, `// languages` style headers, drag-and-drop still works, confetti fires when a category is sorted alphabetically. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: redesign Skills with outlined chips"
```

---

## Task 13: Redesign Music

**Files:**
- Modify: `src/components/Music.js`

- [ ] **Step 1: Replace `src/components/Music.js`**

```jsx
import React from 'react';
import SectionHeader from './shell/SectionHeader';

export default function Music() {
  return (
    <div>
      <SectionHeader label="now playing">music</SectionHeader>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
        Music is my passion. I play guitar, sing, and have been taking drum lessons lately. Writing
        songs and jamming connects me to the world. I'm in a few bands and produce on the side
        and I've played live at several venues in New York City.
      </p>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '2rem' }}>
        Below is my Samply, where I frequently upload new jams. Thanks for listening.
      </p>
      <div style={{
        border: '1px solid var(--fg-faint)',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <iframe
          src="https://samply.app/p/ivorLTFc2loWYeNEzfJ7?si=sUxJEaYbIBMM1tIPK5MFHPm2g2r2"
          title="Samply Music Player"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          style={{ width: '100%', height: 600, border: 'none', display: 'block' }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify manually**

Run: `npm start`. Navigate to `/music`. Expected: `// now playing` label, thin outlined frame around the Samply iframe, liner-notes-style copy, no inner dark card. Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: redesign Music with outlined iframe frame"
```

---

## Task 14: Final pass — production build + deploy smoke

**Files:**
- Modify: `src/content/posts/2026-04-19-first-post.md` (flesh out for a real first post)

- [ ] **Step 1: Rewrite the first post to match the site's voice**

Replace `src/content/posts/2026-04-19-first-post.md`:

```markdown
---
title: "i let claude redesign my website"
date: "2026-04-19"
slug: "claude-redesigned-my-website"
excerpt: "one conversation, full redesign, zero hand-written JSX."
tags: ["claude", "react", "meta"]
---

This site got a full redesign. I didn't open a file. Claude did.

The old version was a CRA + MUI tab layout with a "hey" typewriter intro
and rainbow gradient tabs. It was fine. It wasn't mine.

## what changed

- a generative shader background running a domain-warped simplex noise field
- a `/` command palette as the only navigation, no visible links
- a glitch-scramble intro cinematic that plays once per session
- this blog, authored in markdown, rendered at build time

## the prompt that did it

I told Claude: "make my website sexy as fuck." Then we went through
about a dozen choices together on aesthetic direction, font, accent,
nav pattern, and post format. Every decision was a multiple-choice
question I could answer in one word.

More to come.
```

- [ ] **Step 2: Run the test suite**

Run: `CI=true npm test`
Expected: all tests pass (posts loader + GlitchText).

- [ ] **Step 3: Run the production build**

Run: `CI=true npm run build`
Expected: build succeeds; `build/` directory generated. Bundle-size warnings are acceptable (R3F/three are large). No errors.

- [ ] **Step 4: Serve the build locally and smoke-test**

Run: `npx serve -s build -l 5000` (installs `serve` if missing). Open `http://localhost:5000/`.

Smoke checklist:
- [ ] Intro plays once, skippable
- [ ] Shader background is visible and animates
- [ ] `press /` pill is in the top-right; clicking opens palette
- [ ] `/` key opens palette; Esc closes; Enter navigates
- [ ] All six sections (About, Experience, Education, Skills, Music, Blog) render without errors
- [ ] Blog list shows the post; clicking it loads the post page; back link returns to list
- [ ] Palette lists the post under "Blog"
- [ ] Deep-link `http://localhost:5000/#/blog/claude-redesigned-my-website` loads directly
- [ ] Resize below 768px: shader replaced with static gradient; palette opens; layout reflows to single column
- [ ] In devtools, enable `prefers-reduced-motion: reduce`, intro skipped, shader replaced, GlitchText renders final string immediately, transitions instant

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: polish first post, run full smoke check"
```

- [ ] **Step 6: Deploy**

Run: `npm run deploy`
Expected: `gh-pages` pushes `build/` to the `gh-pages` branch. Visit `https://erichfeinstein.github.io` after a minute, full redesign live.

Do NOT commit a separate deploy step, `npm run deploy` handles the push.

---

## Self-Review Notes

- **Spec coverage check:** Every section of the spec maps to a task. Routing → T2. Deps/palette → T1. Post loader → T3. GlitchText + reduced-motion hook → T4. Nav + Palette → T5. Shader → T6. Intro → T7. Route transitions → T8. BlogList/Post → T9. Per-tab redesigns → T10-T13. Mobile/a11y/reduced-motion handled inline across T4, T6, T7; final smoke in T14. No orphan requirements.
- **Placeholder scan:** No "TBD", no "similar to", no "implement error handling" — every step has concrete code and exact commands.
- **Type/naming consistency:** `getAllPosts`, `getPostBySlug`, `getReadingTimeMinutes` are defined in T3 and consumed identically in T5 and T9. `GlitchText` props (`children`, `duration`, `trigger`, `as`, `className`) are defined in T4 and used consistently in T7, T9, T10. `SectionHeader` (`label`, `children`) is defined in T9 and used by all redesigned pages from T9 onward.
- **Known intermediate states:** Between Task 5 and Task 9, the palette's "Blog" entry redirects to `/` (via the `*` catch-all) because the blog routes don't exist yet. Called out in T5 Step 5.
