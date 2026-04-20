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

// Name bar: ~28px total (5+4px padding + 1px border + ~12px text line)
const NAME_BAR_H = 28;
// Stat strip: ~25px total (4+5px padding + 1px border + ~11px text line)
const STAT_STRIP_H = 25;
// Photo frame: fixed height so object-fit: cover can fill it
const PHOTO_H = 220;
// Total fixed container height — never changes between rest and hover
const CARD_H = NAME_BAR_H + PHOTO_H + STAT_STRIP_H;

const nameBarStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.8rem',
  letterSpacing: '0.12em',
  color: 'var(--fg)',
  padding: '5px 8px 4px',
  borderBottom: '1px solid var(--fg-faint)',
  background: 'rgba(5, 5, 7, 0.9)',
  lineHeight: 1,
  textAlign: 'center',
  userSelect: 'none',
  pointerEvents: 'none',
  overflow: 'hidden',
};

const statStripStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.72rem',
  color: 'var(--fg)',
  padding: '4px 8px 5px',
  borderTop: '1px solid var(--fg-faint)',
  background: 'rgba(5, 5, 7, 0.9)',
  lineHeight: 1,
  textAlign: 'center',
  userSelect: 'none',
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
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

  const cardTransform = active
    ? `perspective(1000px) rotateX(${-ny * 8}deg) rotateY(${nx * 8}deg) rotate(-1.5deg)`
    : 'rotate(-1.5deg)';

  // Edge glow halved in strength compared to original
  const boxShadow = hover && active
    ? `0 0 0 1px rgba(255,43,214,${proximity * 0.15}), 0 0 12px rgba(255,43,214,${proximity * 0.25}), 0 0 20px rgba(0,229,255,${proximity * 0.2})`
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
        height: CARD_H,
        display: 'inline-flex',
        flexDirection: 'column',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transform: cardTransform,
        transition: 'transform 150ms ease-out, box-shadow 150ms',
        boxShadow,
        cursor: 'default',
        overflow: 'hidden',
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
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Name bar — animates from height 0 to NAME_BAR_H; photo crops from top */}
      <motion.div
        aria-hidden="true"
        animate={{ height: hover ? NAME_BAR_H : 0, opacity: hover ? 1 : 0 }}
        initial={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ ...nameBarStyle, flexShrink: 0 }}
      >
        ERIC FEINSTEIN
      </motion.div>

      {/* Photo frame — flex: 1 so it fills whatever space remains; image uses object-fit: cover */}
      <div
        style={{
          flex: 1,
          border: '1px solid var(--fg-faint)',
          overflow: 'hidden',
          lineHeight: 0,
          position: 'relative',
          minHeight: 0,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center top' }}
        />

        {/* Holographic sheen overlay — subtler: overlay blend + lower opacity */}
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
          }}
        />

        {/* Corner rarity mark — bottom-right of photo */}
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.25, delay: 0.2, ease: 'easeOut' }}
              className="rainbow-text"
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 4,
                right: 6,
                fontSize: '0.7rem',
                pointerEvents: 'none',
                lineHeight: 1,
              }}
            >
              ★★★
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stat strip — animates from height 0 to STAT_STRIP_H; photo crops from bottom */}
      <motion.div
        animate={{ height: hover ? STAT_STRIP_H : 0, opacity: hover ? 1 : 0 }}
        initial={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut', delay: 0.06 }}
        style={{ ...statStripStyle, flexShrink: 0 }}
      >
        <span style={{ color: 'var(--fg-dim)' }}>HP:</span>{' '}
        <span>∞</span>
        {' · '}
        <span style={{ color: 'var(--fg-dim)' }}>ATK:</span>{' '}
        <span>ships on friday</span>
        {' · '}
        <span style={{ color: 'var(--fg-dim)' }}>DEF:</span>{' '}
        <span>git reset --hard</span>
      </motion.div>
    </div>
  );
}
