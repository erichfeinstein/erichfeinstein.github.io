import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { getAllPosts } from '../../lib/posts';

const SECTIONS = [
  { label: 'About',      path: '/' },
  { label: 'Experience', path: '/experience' },
  { label: 'Education',  path: '/education' },
  { label: 'Skills',     path: '/skills' },
  { label: 'Music',      path: '/music' },
  { label: 'Blog',       path: '/blog' },
];

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => { setPosts(getAllPosts()); }, []);

  const go = (path) => { onOpenChange(false); navigate(path); };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Command palette"
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(5,5,7,0.7)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '12vh',
      }}
    >
      <Command
        label="Global command menu"
        style={{
          width: 'min(560px, 92vw)',
          background: '#0a0a0c',
          border: '1px solid var(--fg-faint)',
          borderRadius: 8,
          padding: 8,
          fontFamily: 'inherit',
        }}
      >
        <Command.Input
          autoFocus
          placeholder="type to search..."
          style={{
            width: '100%', background: 'transparent', color: 'var(--fg)',
            border: 'none', outline: 'none', padding: '8px 12px',
            fontFamily: 'inherit', fontSize: '1rem',
          }}
        />
        <Command.List style={{ maxHeight: 320, overflow: 'auto', marginTop: 8 }}>
          <Command.Empty style={{ padding: 12, color: 'var(--fg-dim)' }}>
            no matches.
          </Command.Empty>
          <Command.Group heading="Sections">
            {SECTIONS.map((s) => (
              <Command.Item key={s.path} value={s.label} onSelect={() => go(s.path)}>
                <ItemRow label={s.label} hint={s.path} />
              </Command.Item>
            ))}
          </Command.Group>
          {posts.length > 0 && (
            <Command.Group heading="Blog">
              {posts.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`Blog ${p.title} ${p.tags.join(' ')}`}
                  onSelect={() => go(`/blog/${p.slug}`)}
                >
                  <ItemRow label={p.title} hint={p.date} />
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}

function ItemRow({ label, hint }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer' }}>
      <span>{label}</span>
      <span style={{ color: 'var(--fg-dim)', fontSize: '0.85rem' }}>{hint}</span>
    </div>
  );
}
