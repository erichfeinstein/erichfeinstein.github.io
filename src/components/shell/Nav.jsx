import React from 'react';
import { useLocation } from 'react-router-dom';

const sectionLabel = (path) => {
  if (path === '/' || path === '') return 'about';
  if (path.startsWith('/blog/')) return `blog / ${path.slice('/blog/'.length)}`;
  return path.slice(1);
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
      }}
    >
      <span style={{ color: 'var(--fg-dim)' }}>~/eric $ cd&nbsp;</span>
      <span className="blink-cursor">{sectionLabel(pathname)}</span>
      <div style={{ flex: 1 }} />
      <button
        onClick={onOpenPalette}
        aria-label="Open command palette"
        style={{
          background: 'transparent',
          color: 'var(--fg)',
          border: '1px solid var(--fg-faint)',
          borderRadius: 6,
          padding: '4px 10px',
          fontFamily: 'inherit',
          fontSize: '0.85rem',
          cursor: 'pointer',
        }}
      >
        press <kbd style={{ padding: '0 4px', border: '1px solid var(--fg-faint)', borderRadius: 3 }}>/</kbd>
      </button>
    </header>
  );
}
