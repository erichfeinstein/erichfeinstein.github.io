import React from 'react';
import { CATEGORIES, NODES } from './data';

// Group nodes by category, preserving CATEGORIES order
const GROUPED = Object.keys(CATEGORIES).map((cat) => ({
  cat,
  label: CATEGORIES[cat].label,
  nodes: NODES.filter(([, , c]) => c === cat).map(([id, label]) => ({ id, label })),
})).filter((g) => g.nodes.length > 0);

export default function SkillList({ onSelect, focusedId }) {
  return (
    <div style={{ fontFamily: 'var(--mono)' }}>
      {GROUPED.map(({ cat, label, nodes }) => (
        <div key={cat} style={{ marginBottom: '1rem' }}>
          <div
            style={{
              color: 'var(--fg-dim)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.35rem',
              userSelect: 'none',
            }}
          >
            {label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {nodes.map(({ id, label: nodeLabel }) => {
              const isFocused = focusedId === id;
              return (
                <button
                  key={id}
                  onClick={() => onSelect(isFocused ? null : id)}
                  style={{
                    background: 'transparent',
                    border: isFocused ? '1px solid var(--fg)' : '1px solid var(--fg-faint)',
                    borderRadius: 3,
                    color: isFocused ? 'var(--fg)' : 'var(--fg-dim)',
                    fontFamily: 'var(--mono)',
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s',
                    outline: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isFocused) {
                      e.currentTarget.style.borderColor = 'var(--fg-dim)';
                      e.currentTarget.style.color = 'var(--fg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isFocused) {
                      e.currentTarget.style.borderColor = 'var(--fg-faint)';
                      e.currentTarget.style.color = 'var(--fg-dim)';
                    }
                  }}
                >
                  {nodeLabel}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
