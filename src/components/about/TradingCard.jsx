import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

// Bars overlay the photo top/bottom on hover (no cropping of the photo itself).
const NAME_BAR_H = 28;
const STAT_STRIP_H = 44;

const nameBarStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.78rem',
  letterSpacing: '0.1em',
  color: 'var(--fg)',
  padding: '0 8px',
  borderBottom: '1px solid var(--fg-faint)',
  background: 'rgba(5, 5, 7, 0.85)',
  backdropFilter: 'blur(4px)',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 6,
  userSelect: 'none',
  pointerEvents: 'none',
  height: NAME_BAR_H,
  boxSizing: 'border-box',
};

const statStripStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.7rem',
  color: 'var(--fg)',
  padding: '4px 8px',
  borderTop: '1px solid var(--fg-faint)',
  background: 'rgba(5, 5, 7, 0.85)',
  backdropFilter: 'blur(4px)',
  lineHeight: 1.25,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  userSelect: 'none',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  height: STAT_STRIP_H,
  boxSizing: 'border-box',
};

export default function TradingCard({ src, alt }) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const { ref, onMouseMove, onMouseLeave: tiltLeave, nx, ny, active } = useCardTilt();

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

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = (e) => {
    setHover(false);
    tiltLeave(e);
  };

  // Glow opacity: 1 at cursor center, 0 at edges
  const proximity = active
    ? Math.max(0, Math.min(1, 1 - 2 * Math.max(Math.abs(nx), Math.abs(ny))))
    : 0;

  // Balatro-style: aggressive 3D tilt + slight lift + scale pop while hovering.
  const cardTransform = active
    ? `perspective(700px) translateZ(18px) rotateX(${-ny * 22}deg) rotateY(${nx * 22}deg) rotate(-1.5deg) scale(1.05)`
    : hover
    ? 'perspective(700px) translateZ(10px) rotate(-1.5deg) scale(1.03)'
    : 'rotate(-1.5deg)';

  const boxShadow = hover && active
    ? `0 0 0 1px rgba(255,43,214,${proximity * 0.2}), 0 10px 30px rgba(0,0,0,0.55), 0 0 18px rgba(255,43,214,${proximity * 0.3}), 0 0 28px rgba(0,229,255,${proximity * 0.25})`
    : hover
    ? '0 8px 24px rgba(0,0,0,0.45)'
    : 'none';

  const sheenBgPos = `${(nx + 0.5) * 100}% ${(ny + 0.5) * 100}%`;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: 220,
        display: 'inline-block',
        border: '1px solid var(--fg-faint)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transform: cardTransform,
        transition: 'transform 120ms ease-out, box-shadow 180ms ease-out',
        boxShadow,
        cursor: 'default',
        overflow: 'hidden',
        lineHeight: 0,
      }}
    >
      {/* Outer double-border ring: fades in on hover */}
      <AnimatePresence>
        {hover && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: -5,
              border: '1px solid rgba(255,43,214,0.35)',
              outline: '1px solid rgba(0,229,255,0.25)',
              outlineOffset: '2px',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
        )}
      </AnimatePresence>

      {/* Photo stays at natural aspect — untouched at rest */}
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      {/* Holographic sheen overlay — only visible on hover */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(270deg, #ff2bd6, #00e5ff, #00ff88, #ff2bd6)',
          backgroundSize: '300% 300%',
          backgroundPosition: sheenBgPos,
          mixBlendMode: 'overlay',
          opacity: hover && active ? 0.18 : 0,
          transition: 'opacity 150ms, background-position 80ms',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Name bar slides down from above on hover; overlays the top of the photo */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ y: hover ? 0 : -NAME_BAR_H, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        style={{
          ...nameBarStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        <span>ERIC FEINSTEIN</span>
        <span>
          <span style={{ color: 'var(--fg-dim)' }}>HP:</span> ∞
        </span>
      </motion.div>

      {/* Stat strip slides up from below on hover; overlays the bottom of the photo */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ y: hover ? 0 : STAT_STRIP_H, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.28, ease: 'easeOut', delay: 0.06 }}
        style={{
          ...statStripStyle,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        <span>
          <span style={{ color: 'var(--fg-dim)' }}>ATK:</span> ships on friday
        </span>
        <span>
          <span style={{ color: 'var(--fg-dim)' }}>DEF:</span> git reset --hard
        </span>
      </motion.div>

      {/* Corner rarity mark */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.25, delay: 0.22, ease: 'easeOut' }}
            className="rainbow-text"
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: STAT_STRIP_H + 4,
              right: 6,
              fontSize: '0.7rem',
              pointerEvents: 'none',
              lineHeight: 1,
              zIndex: 2,
            }}
          >
            ★★★
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
