import React from 'react';
import GlitchText from './GlitchText';

export default function SectionHeader({ label, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="section-label">{'// '}{label}</div>
      <GlitchText as="h1" duration={700}>{children}</GlitchText>
    </div>
  );
}
