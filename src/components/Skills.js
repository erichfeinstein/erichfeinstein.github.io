import React from 'react';
import SectionHeader from './shell/SectionHeader';
import SkillGraph from './skills/SkillGraph';

export default function Skills() {
  return (
    <div>
      <SectionHeader label="skills">things i use</SectionHeader>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '1.5rem', maxWidth: 'var(--max-prose)' }}>
        hover a node to see what it connects to. click to pin. search for a buzzword — if it&apos;s here
        you&apos;ll find it, if it&apos;s not you&apos;ll see {'//'} not yet.
      </p>
      <SkillGraph />
    </div>
  );
}
