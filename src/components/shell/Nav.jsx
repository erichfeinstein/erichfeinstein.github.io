import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SECTIONS = [
  { label: 'about',      path: '/' },
  { label: 'experience', path: '/experience' },
  { label: 'skills',     path: '/skills' },
  { label: 'music',      path: '/music' },
  { label: 'blog',       path: '/blog' },
];

const isActive = (pathname, path) => {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(path + '/');
};

export default function Nav({ onOpenPalette }) {
  const { pathname } = useLocation();
  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        height: 48, display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 12,
        backdropFilter: 'blur(8px)',
        background: 'rgba(5,5,7,0.55)',
        borderBottom: '1px solid var(--fg-faint)',
        fontSize: '0.95rem',
        overflow: 'hidden',
      }}
    >
      <span style={{ color: 'var(--fg-dim)', whiteSpace: 'nowrap' }}>~/eric $</span>
      <nav
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {SECTIONS.map((s) => {
          const active = isActive(pathname, s.path);
          return (
            <NavLink
              key={s.path}
              to={s.path}
              end={s.path === '/'}
              style={{
                textDecoration: 'none',
                color: active ? 'var(--fg)' : 'var(--fg-dim)',
                whiteSpace: 'nowrap',
                paddingBottom: 2,
                borderBottom: active ? '1px solid var(--fg)' : '1px solid transparent',
                transition: 'color 150ms, border-color 150ms',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--fg)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--fg-dim)'; }}
            >
              {s.label}
            </NavLink>
          );
        })}
      </nav>
      <div style={{ flex: 1 }} />
      <button
        onClick={onOpenPalette}
        aria-label="Open command palette"
        style={{
          background: 'transparent',
          color: 'var(--fg-dim)',
          border: '1px solid var(--fg-faint)',
          borderRadius: 6,
          padding: '4px 10px',
          fontFamily: 'inherit',
          fontSize: '0.85rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        press <kbd style={{ padding: '0 4px', border: '1px solid var(--fg-faint)', borderRadius: 3 }}>/</kbd>
      </button>
    </header>
  );
}
