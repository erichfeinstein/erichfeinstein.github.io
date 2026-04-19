import React from 'react';
import SectionHeader from './shell/SectionHeader';

const educationItems = [
  {
    institution: 'Fullstack Academy of Code',
    period: 'October 2018 - February 2019',
    degree: 'Software Engineering Immersive Program',
    location: 'New York, NY',
  },
  {
    institution: 'Case Western Reserve University',
    period: 'August 2014 - May 2018',
    degree: 'Bachelor of Arts, Computer Science',
    location: 'Cleveland, OH',
  },
];

export default function Education() {
  return (
    <div>
      <SectionHeader label="formally">education</SectionHeader>
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'var(--fg-faint)' }} />
        {educationItems.map((edu, i) => (
          <article key={i} style={{ position: 'relative', marginBottom: '2rem' }}>
            <span style={{
              position: 'absolute', left: -21, top: 10, width: 9, height: 9, borderRadius: '50%',
              background: 'var(--bg)', border: '1px solid var(--fg)',
            }} />
            <h2 style={{ fontSize: '1.4rem' }}>{edu.institution}</h2>
            <div>{edu.degree}</div>
            <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>{edu.period} · {edu.location}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
