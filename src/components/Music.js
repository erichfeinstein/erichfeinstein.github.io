import React from 'react';
import SectionHeader from './shell/SectionHeader';

export default function Music() {
  return (
    <div>
      <SectionHeader label="now playing">music</SectionHeader>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
        Music is my passion. I play guitar, sing, and have been taking drum lessons lately. Writing
        songs and jamming connects me to the world. I'm in a few bands and produce on the side
        and I've played live at several venues in New York City.
      </p>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '2rem' }}>
        Below is my Samply, where I frequently upload new jams. Thanks for listening.
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
