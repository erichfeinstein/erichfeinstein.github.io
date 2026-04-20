# Mobile layout fixes: About + Skills

## Problem

On narrow viewports (~375–700px), two pages break:

- **About** (`src/components/About.js`): the two-column grid (`minmax(0, 1fr) auto`) does not collapse. The 220px `<TradingCard>` sits beside a squeezed text column; "eric feinstein" wraps mid-name and the photo crowds the right edge.
- **Skills** (`src/components/Skills.js`): the page container uses a viewport-escape trick (`width: min(1400px, calc(100vw - 48px))` + `translateX(-50%)`) to let the graph extend past the 960px main content width. On mobile this produces horizontal overflow — the top nav is clipped, and the SVG force-directed graph is non-interactive on touch (the core interaction is hover-to-reveal-labels).

## Goals

- About page renders cleanly at ≥375px with no cramped text or overflow.
- Skills page fits the viewport at ≥375px with no horizontal scroll and no clipped nav.
- Skills remains useful on mobile: the list of chips (already grouped by category) is the mobile experience.
- Desktop behavior unchanged.

## Non-goals

- Redesigning the skill graph for touch (tap-to-reveal-labels, pinch-zoom, etc.). Dropped in favor of the list.
- Responsive images / srcset for the photo. It's 220px and already small.
- Tablet-specific tuning. One breakpoint covers phone vs. not-phone.

## Design

### Breakpoint

Single breakpoint: **`max-width: 700px`**. Applies to both pages.

Rationale: below 700px the About text column becomes too narrow next to a 220px photo, and the Skills graph has no benefit over the list.

### About changes

Target: `src/components/About.js`.

- Replace the inline-styled grid with a single CSS block (scoped `<style>` inside the component, matching the pattern already used in `Skills.js`).
- Desktop (≥701px): unchanged — same 2-column grid, same card offset.
- Mobile (≤700px):
  - `grid-template-columns: 1fr` (single column).
  - Card renders first: use `order: -1` on the card wrapper (JSX order stays the same, semantics preserved for screen readers of either order — visual order is what matters here).
  - Drop `margin-top: 1.75rem` on the card wrapper — the offset only exists to align with the desktop headline.
  - Center the card: `justify-self: center` on the card wrapper. (The card itself stays 220px — no need to grow it.)
  - Reduce grid `gap` from `2rem` to `1.25rem` to tighten vertical rhythm.

### Skills changes

Target: `src/components/Skills.js`.

- Gate the `<SkillGraph>` render on a `useIsMobile()` hook (see "Shared" below). On mobile, render only the list.
- Container width trick (`width: min(1400px, calc(100vw - 48px))` + `translateX(-50%)`) applies only when the graph is shown. On mobile, the page uses the normal main-content width (no escape).
  - Implementation: conditional inline style — if mobile, use `{ width: '100%' }`; otherwise the existing escape-trick block.
- Intro copy: on mobile, replace `"hover a node to see connections. click to pin, or pick from the list."` with `"tap a category below."` (short, accurate, no dead-on-touch affordance mentioned).
- Skills-layout styles (`@media (max-width: 960px)`) remain for the 701–960px range, where the graph still renders and the list stacks below it. No change needed there.

### Shared: `useIsMobile` hook

New file: `src/hooks/useIsMobile.js`.

```js
import { useEffect, useState } from 'react';

export function useIsMobile(query = '(max-width: 700px)') {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

Used by both `About.js` (for conditional layout, though CSS media query can also handle it — prefer CSS there) and `Skills.js` (required, since we're skipping an expensive component mount).

Note: for About, pure CSS handles the layout change — no hook needed there. Only Skills needs the hook, to skip mounting the graph at all. Keep the hook general (parameterized) since it's a reusable primitive.

## Testing

Manual: open the site at 375px (iPhone SE), 414px (iPhone 14 Pro Max), and 700px (breakpoint boundary). Verify on both About and Skills:

- No horizontal scroll. Nav is not clipped.
- About: card sits above the name, centered. Name doesn't wrap mid-word. Paragraph text flows full-width.
- Skills: graph is absent below 700px. List renders below the intro copy. Intro copy reads correctly for touch.
- Resize through the breakpoint: no flicker, no layout break. Graph remounts when crossing 700px upward.

Also verify desktop (≥1000px) is pixel-identical to before.

## Risks

- `useIsMobile` SSR path: the site is static/CSR (Create React App style), so `window` is safe in the initial state. Guard is defensive.
- Remounting the graph on resize (when crossing 700px) re-runs the d3 simulation from scratch. Acceptable — resizes across that boundary are rare in practice.
