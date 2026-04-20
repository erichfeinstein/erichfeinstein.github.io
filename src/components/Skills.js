import React, { useState } from 'react';
import SectionHeader from './shell/SectionHeader';
import SkillGraph from './skills/SkillGraph';
import SkillList from './skills/SkillList';

export default function Skills() {
  const [focusedId, setFocusedId] = useState(null);

  return (
    <div>
      <SectionHeader label="skills">things i use</SectionHeader>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '1.5rem', maxWidth: 'var(--max-prose)' }}>
        hover a node to see connections. click to pin, or pick from the list. search for a buzzword —
        if it&apos;s here you&apos;ll find it, if it&apos;s not you&apos;ll see {'//'} not yet.
      </p>
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Graph — takes remaining space */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <SkillGraph
            focusedId={focusedId}
            onUnfocus={() => setFocusedId(null)}
          />
        </div>
        {/* Category list — fixed width, scrollable */}
        <div
          style={{
            width: 260,
            flexShrink: 0,
            maxHeight: 660,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            // Stack below graph on narrow viewports via media query workaround:
            // We use a CSS custom property trick — see the wrapper below.
          }}
          className="skills-list-panel"
        >
          <SkillList onSelect={setFocusedId} focusedId={focusedId} />
        </div>
      </div>
      {/* Inline responsive style */}
      <style>{`
        @media (max-width: 960px) {
          .skills-list-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
