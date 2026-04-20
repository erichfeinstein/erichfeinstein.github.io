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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: '2rem',
        alignItems: 'start',
      }}
    >
      <div>
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

      <TradingCard src="/me.jpg" alt="eric feinstein" />
    </div>
  );
}
