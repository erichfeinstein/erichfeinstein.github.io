import React from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../../lib/posts';
import SectionHeader from '../shell/SectionHeader';

export default function BlogList() {
  const posts = getAllPosts();
  return (
    <div>
      <SectionHeader label="blog">writing</SectionHeader>
      {posts.length === 0 && <p style={{ color: 'var(--fg-dim)' }}>nothing here yet.</p>}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {posts.map((p) => (
          <li key={p.slug}>
            <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>{p.date}</div>
            <Link
              to={`/blog/${p.slug}`}
              style={{ textDecoration: 'none', color: 'var(--fg)' }}
            >
              <h2 style={{ margin: '0.25rem 0' }}>{p.title}</h2>
            </Link>
            <p style={{ color: 'var(--fg-dim)', margin: '0.25rem 0 0.5rem' }}>{p.excerpt}</p>
            <div style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>
              {p.tags.map((t) => `#${t}`).join(' · ')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
