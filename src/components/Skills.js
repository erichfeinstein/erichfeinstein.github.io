import React, { useState } from 'react';
import SectionHeader from './shell/SectionHeader';
import SkillGraph from './skills/SkillGraph';
import SkillList from './skills/SkillList';

export default function Skills() {
  const [focusedId, setFocusedId] = useState(null);

  return (
    <div
      style={{
        width: 'min(1400px, calc(100vw - 48px))',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <SectionHeader label="skills">things i use</SectionHeader>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '1rem', maxWidth: 'var(--max-prose)' }}>
        hover a node to see connections. click to pin, or pick from the list.
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
            maxHeight: 620,
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
          className="skills-list-panel"
        >
          <SkillList onSelect={setFocusedId} focusedId={focusedId} />
        </div>
      </div>
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
