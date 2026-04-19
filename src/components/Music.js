import React from 'react';
import SectionHeader from './shell/SectionHeader';

export default function Music() {
  return (
    <div>
      <SectionHeader label="now playing">music</SectionHeader>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1rem' }}>
        Music is the other thing. I play guitar, sing, and lately I've been taking drum lessons.
        Writing songs and jamming with other people is what connects me to my community — some
        of the best nights of the last few years have been in rehearsal rooms with people I love.
        I'm in a few bands, produce stuff on the side, and I've played live around New York City.
      </p>
      <p style={{ color: 'var(--fg-dim)', marginBottom: '2rem' }}>
        What's below is my Samply — where I dump works-in-progress. Some are finished, most aren't.
        Poke around.
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
