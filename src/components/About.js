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
