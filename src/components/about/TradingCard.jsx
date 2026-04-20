import React, { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function useCardTilt() {
  const ref = useRef(null);
  const [state, setState] = useState({ nx: 0, ny: 0, active: false });

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setState({ nx, ny, active: true });
  }, []);

  const onMouseLeave = useCallback(() => {
    setState({ nx: 0, ny: 0, active: false });
  }, []);

  return { ref, onMouseMove, onMouseLeave, ...state };
}

export default function TradingCard({ src, alt }) {
  const reduced = useReducedMotion();
  const { ref, onMouseMove, onMouseLeave, nx, ny, active } = useCardTilt();

  if (reduced) {
    return (
      <div
        style={{
          width: 220,
          border: '1px solid var(--fg-faint)',
          transform: 'rotate(-1.5deg)',
          display: 'inline-block',
          lineHeight: 0,
        }}
      >
        <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    );
  }

  // Glow opacity: 1 at cursor center, 0 at edges
  const proximity = active
    ? Math.max(0, Math.min(1, 1 - 2 * Math.max(Math.abs(nx), Math.abs(ny))))
    : 0;

  const cardTransform = active
    ? `perspective(1000px) rotateX(${-ny * 8}deg) rotateY(${nx * 8}deg) rotate(-1.5deg)`
    : 'rotate(-1.5deg)';

  const boxShadow = active
    ? `0 0 24px rgba(255,43,214,${proximity * 0.5}), 0 0 40px rgba(0,229,255,${proximity * 0.5})`
    : 'none';

  const sheenBgPos = `${(nx + 0.5) * 100}% ${(ny + 0.5) * 100}%`;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        width: 220,
        display: 'inline-block',
        lineHeight: 0,
        border: '1px solid var(--fg-faint)',
        transform: cardTransform,
        transition: 'transform 150ms, box-shadow 150ms',
        willChange: 'transform',
        boxShadow,
        cursor: 'default',
      }}
    >
      <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block' }} />

      {/* Holographic sheen overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(270deg, #ff2bd6, #00e5ff, #00ff88, #ff2bd6)',
          backgroundSize: '300% 300%',
          backgroundPosition: sheenBgPos,
          mixBlendMode: 'color-dodge',
          opacity: active ? 0.35 : 0,
          transition: 'opacity 150ms, background-position 150ms',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
