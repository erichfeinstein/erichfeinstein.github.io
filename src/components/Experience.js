import React from 'react';
import SectionHeader from './shell/SectionHeader';

const experiences = [
  {
    company: 'Grubhub',
    title: 'Senior Software Engineer',
    period: 'Dec 2021 - Present',
    details: [
      'Led implementation of a BFF for dynamically generated merchant and product pages, leveraging Protobuf and a web renderer which I developed',
      'Built a content management tool for the Grubhub+ program in React which reduced the number of SEVs related to page performance and legal copy',
      'Unified the offers and promotions platform for enterprise and small business restaurants, lowering the overhead of maintaining both portals',
    ],
  },
  {
    company: 'Branding Brand',
    title: 'Development Manager',
    period: 'June 2020 - Dec 2021',
    details: [
      'Led team of engineers to build COVID-19 vaccination and PPE management forms, as well as e-commerce pages in React for Fortune 500 pharmaceuticals retailer',
      'Maintained and contributed to Flagship, an open-source code platform for developing e-commerce solutions across Web, iOS and Android using React Native Web',
    ],
  },
  {
    company: 'Cedrus Digital',
    title: 'Software Engineer',
    period: 'April 2019 - May 2020',
    details: [
      'Developed enterprise web application for an international auto rental company, scaffolded and built out pages for account management',
      'Created reusable and well-tested components using React, partnered with design team to develop efficient and responsive solutions for a great user experience',
    ],
  },
];

export default function Experience() {
  return (
    <div>
      <SectionHeader label="professionally">experience</SectionHeader>
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'var(--fg-faint)' }} />
        {experiences.map((exp, i) => (
          <article key={i} style={{ position: 'relative', marginBottom: '2.5rem' }}>
            <span style={{
              position: 'absolute', left: -21, top: 10, width: 9, height: 9, borderRadius: '50%',
              background: 'var(--bg)', border: '1px solid var(--fg)',
            }} />
            <header>
              <h2 style={{ fontSize: '1.6rem' }}>{exp.company}</h2>
              <div style={{ color: 'var(--fg-dim)' }}>{exp.title}</div>
              <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>{exp.period}</div>
            </header>
            <ul style={{ listStyle: 'none', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {exp.details.map((d, j) => (
                <li key={j} style={{ paddingLeft: '1rem', position: 'relative', lineHeight: 1.6 }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--fg-dim)' }}>&gt;</span>
                  {d}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
