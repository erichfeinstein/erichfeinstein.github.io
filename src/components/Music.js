import React from 'react';
import SectionHeader from './shell/SectionHeader';

export default function Music() {
  return (
    <div>
      <SectionHeader label="now playing">music</SectionHeader>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
        I play guitar and sing, take drum lessons, and write songs with friends. I'm in a few bands
        and play around New York City.
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
