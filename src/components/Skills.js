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
      <div className="skills-layout">
        <div className="skills-graph-col">
          <SkillGraph
            focusedId={focusedId}
            onUnfocus={() => setFocusedId(null)}
          />
        </div>
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
      `}</style>
    </div>
  );
}
