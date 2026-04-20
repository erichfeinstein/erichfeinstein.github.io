# Mobile Layout Fixes (About + Skills) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix mobile layout on About and Skills pages so they render cleanly at ≥375px viewports with no horizontal overflow.

**Architecture:** Add a small `useIsMobile` hook (matchMedia wrapper). Use pure CSS media queries in About to collapse the 2-column grid and reorder card above text. In Skills, use the hook to conditionally skip the `<SkillGraph>` render on mobile and swap the container-width escape-trick for a plain `width: 100%`. Single breakpoint at `max-width: 700px`.

**Tech Stack:** React 18 (CRA), Jest + React Testing Library, plain CSS via inline `<style>` blocks (matches existing pattern in `Skills.js`).

**Spec:** `docs/superpowers/specs/2026-04-20-mobile-layout-about-skills-design.md`

---

## File Structure

- **Create:** `src/hooks/useIsMobile.js` — matchMedia-based hook returning a boolean, parameterized by query string (default `(max-width: 700px)`).
- **Create:** `src/hooks/useIsMobile.test.js` — unit tests for the hook.
- **Modify:** `src/components/About.js` — replace inline grid styles with a scoped `<style>` block that collapses to single column + reorders card above text at ≤700px.
- **Modify:** `src/components/Skills.js` — import the hook, conditionally render `<SkillGraph>`, swap container width on mobile, swap intro copy on mobile.

No test files for About/Skills — layout is verified visually via the dev server at multiple viewport widths (see Task 4).

---

## Task 1: Create `useIsMobile` hook with TDD

**Files:**
- Create: `src/hooks/useIsMobile.js`
- Test: `src/hooks/useIsMobile.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useIsMobile.test.js`:

```jsx
import React from 'react';
import { render, act } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';

function Probe({ query }) {
  const isMobile = useIsMobile(query);
  return <span data-testid="result">{isMobile ? 'yes' : 'no'}</span>;
}

describe('useIsMobile', () => {
  let listeners;
  let matches;

  beforeEach(() => {
    listeners = [];
    matches = false;
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      addEventListener: (_evt, cb) => listeners.push(cb),
      removeEventListener: (_evt, cb) => {
        const i = listeners.indexOf(cb);
        if (i >= 0) listeners.splice(i, 1);
      },
    }));
  });

  test('returns false when query does not match on mount', () => {
    matches = false;
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('result').textContent).toBe('no');
  });

  test('returns true when query matches on mount', () => {
    matches = true;
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('result').textContent).toBe('yes');
  });

  test('updates when matchMedia fires a change event', () => {
    matches = false;
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('result').textContent).toBe('no');

    act(() => {
      listeners.forEach((cb) => cb({ matches: true }));
    });
    expect(getByTestId('result').textContent).toBe('yes');
  });

  test('uses default query when none supplied', () => {
    matches = false;
    render(<Probe />);
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 700px)');
  });

  test('uses custom query when supplied', () => {
    matches = false;
    render(<Probe query="(max-width: 500px)" />);
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 500px)');
  });

  test('removes listener on unmount', () => {
    matches = false;
    const { unmount } = render(<Probe />);
    expect(listeners.length).toBe(1);
    unmount();
    expect(listeners.length).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --watchAll=false src/hooks/useIsMobile.test.js`
Expected: FAIL with "Cannot find module './useIsMobile'".

- [ ] **Step 3: Implement the hook**

Create `src/hooks/useIsMobile.js`:

```js
import { useEffect, useState } from 'react';

export function useIsMobile(query = '(max-width: 700px)') {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --watchAll=false src/hooks/useIsMobile.test.js`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useIsMobile.js src/hooks/useIsMobile.test.js
git commit -m "feat(hooks): add useIsMobile matchMedia hook"
```

---

## Task 2: Collapse About page grid on mobile

**Files:**
- Modify: `src/components/About.js`

- [ ] **Step 1: Replace inline grid styles with a scoped `<style>` block**

Replace the entire return statement in `src/components/About.js`. The new version moves styling into a `<style>` block (matching the pattern in `Skills.js`) and adds a `@media (max-width: 700px)` rule that collapses the grid and reorders the card.

Full new `About.js`:

```jsx
import React, { useEffect, useState } from 'react';
import GlitchText from './shell/GlitchText';
import SectionHeader from './shell/SectionHeader';
import TradingCard from './about/TradingCard';

const ROLES = [
  'front-end engineer',
  'musician',
  'react native dev',
  'guitarist',
  'songwriter',
  'vibe-coder',
  'producer',
  'new yorker',
];

export default function About() {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="about-grid">
      <div className="about-text">
        <SectionHeader label="whoami">eric feinstein</SectionHeader>

        <div style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)', marginBottom: '0.5rem', color: 'var(--fg-dim)' }}>
          i am a{' '}
          <GlitchText duration={500} trigger={roleIdx} className="rainbow-text">
            {ROLES[roleIdx]}
          </GlitchText>
        </div>

        <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          BA, Computer Science · Case Western Reserve '18 &nbsp;·&nbsp; Fullstack Academy '19
        </div>

        <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
          With over 7 years of experience, I am a front-end software engineer with a strong
          foundation in computer science and extensive knowledge of modern TypeScript and React.
          I thrive on collaborating with designers, product owners, and fellow engineers to
          create outstanding user experiences.
        </p>
      </div>

      {/* Offset so the card's top aligns with 'eric feinstein', not '// whoami' */}
      <div className="about-card">
        <TradingCard src="/me.jpg" alt="eric feinstein" />
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 2rem;
          align-items: start;
        }
        .about-card { margin-top: 1.75rem; }

        @media (max-width: 700px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .about-card {
            order: -1;
            margin-top: 0;
            justify-self: center;
          }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Start the dev server (background)**

Run: `npm start` (in background, or a separate terminal).
Wait for "Compiled successfully" / server ready on localhost:3000.

- [ ] **Step 3: Verify About at desktop width**

Open http://localhost:3000/#/about in a browser at ≥1000px width.
Expected: identical to pre-change — 2-column grid, card on the right, text on the left, card top aligned with "eric feinstein" headline.

- [ ] **Step 4: Verify About at mobile width**

Use browser devtools to set viewport to 375px × 667px (iPhone SE).
Expected:
- Card renders first (above the name), centered horizontally.
- "eric feinstein" headline sits below the card, at full width, no mid-word wrapping.
- Paragraph flows full-width.
- No horizontal scroll.

Also test at 414px and 700px (breakpoint edge — still mobile layout) and 701px (desktop layout kicks in).

- [ ] **Step 5: Commit**

```bash
git add src/components/About.js
git commit -m "fix(about): collapse grid and stack card above text on mobile"
```

---

## Task 3: Skip SkillGraph on mobile and fix container overflow

**Files:**
- Modify: `src/components/Skills.js`

- [ ] **Step 1: Update `Skills.js` to use `useIsMobile` and conditionally render the graph**

Replace the entire `src/components/Skills.js` with:

```jsx
import React, { useState } from 'react';
import SectionHeader from './shell/SectionHeader';
import SkillGraph from './skills/SkillGraph';
import SkillList from './skills/SkillList';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Skills() {
  const [focusedId, setFocusedId] = useState(null);
  const isMobile = useIsMobile();

  const containerStyle = isMobile
    ? { width: '100%' }
    : {
        width: 'min(1400px, calc(100vw - 48px))',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
      };

  return (
    <div style={containerStyle}>
      <SectionHeader label="skills">things i use</SectionHeader>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '1rem', maxWidth: 'var(--max-prose)' }}>
        {isMobile
          ? 'tap a category below.'
          : 'hover a node to see connections. click to pin, or pick from the list.'}
      </p>
      <div className="skills-layout">
        {!isMobile && (
          <div className="skills-graph-col">
            <SkillGraph
              focusedId={focusedId}
              onUnfocus={() => setFocusedId(null)}
            />
          </div>
        )}
        <div className="skills-list-panel">
          <SkillList onSelect={setFocusedId} focusedId={focusedId} />
        </div>
      </div>
      <style>{`
        .skills-layout {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .skills-graph-col { flex: 1; min-width: 0; }
        .skills-list-panel {
          width: 260px;
          flex-shrink: 0;
          max-height: 620px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .skills-list-panel::-webkit-scrollbar { display: none; }

        @media (max-width: 960px) {
          .skills-layout { flex-direction: column; }
          .skills-list-panel {
            width: 100%;
            max-height: none;
            overflow-y: visible;
            margin-top: 1.5rem;
            border-top: 1px solid var(--fg-faint);
            padding-top: 1rem;
          }
        }

        @media (max-width: 700px) {
          .skills-list-panel {
            margin-top: 0;
            border-top: none;
            padding-top: 0;
          }
        }
      `}</style>
    </div>
  );
}
```

Notes:
- When `isMobile` is true, `focusedId` still works (the list toggles focus on itself via its border/color styling), but the pin-in-graph effect is moot because the graph isn't mounted.
- The extra `@media (max-width: 700px)` rule removes the top border/margin on the list panel when there's no graph above it — otherwise there's a stray divider at the top.

- [ ] **Step 2: Verify Skills at desktop width**

With dev server running, open http://localhost:3000/#/skills at ≥1000px width.
Expected: identical to pre-change — graph on the left, list on the right, container escapes the 960px content width.

- [ ] **Step 3: Verify Skills at mobile width**

Set viewport to 375px × 667px.
Expected:
- No graph visible — only header ("// skills / things i use"), the short intro ("tap a category below."), and the category-grouped list of chips.
- No horizontal scroll. Top nav is fully visible (not clipped).
- List chips wrap cleanly inside the viewport.

Also test 414px, 700px (mobile), 701px (graph reappears), 960px (graph stacks above list via the existing rule), and 1200px (side-by-side).

- [ ] **Step 4: Verify breakpoint transition**

Drag the browser window width across 700px in both directions.
Expected: graph mounts/unmounts cleanly. No console errors. No layout flash beyond one natural re-render.

- [ ] **Step 5: Commit**

```bash
git add src/components/Skills.js
git commit -m "fix(skills): skip graph and disable width escape on mobile"
```

---

## Task 4: Full-site regression sweep

**Files:** (no changes — verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --watchAll=false`
Expected: all tests pass, including the new `useIsMobile` tests and the existing `GlitchText` / `posts` tests.

- [ ] **Step 2: Verify all pages at 375px**

With dev server running, visit each route at 375px viewport width:
- `/#/about` — card above text, no overflow
- `/#/experience`
- `/#/skills` — no graph, just list
- `/#/music`
- `/#/blog`

Expected: no horizontal scroll on any page. Top nav is fully visible on all.

- [ ] **Step 3: Verify all pages at 1280px**

Same routes at 1280px viewport width.
Expected: About and Skills look identical to pre-change. Other pages unchanged.

- [ ] **Step 4: Build production bundle**

Run: `npm run build`
Expected: build completes with no errors and no new warnings beyond pre-existing ones.

- [ ] **Step 5: Commit (if any stray fixes needed from regressions)**

If regressions were found and fixed in the sweep:
```bash
git add <files>
git commit -m "fix: address mobile regressions found in sweep"
```

Otherwise skip this step.

---

## Self-review notes

- Spec coverage: breakpoint (700px), About grid collapse + card reorder, Skills graph skip, container width swap, intro copy swap, new `useIsMobile` hook — all mapped to tasks.
- Placeholder scan: no TBDs, no "add appropriate X", all code blocks complete.
- Type consistency: hook signature `useIsMobile(query?)` returns boolean; both callsites (only `Skills.js`) pass no argument and use the default.
- Task 2 does not use the hook (uses pure CSS) — this matches the spec's note that About doesn't need the hook.
