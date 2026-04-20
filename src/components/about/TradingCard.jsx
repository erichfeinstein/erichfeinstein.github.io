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

  const boxShadow = hover && active
    ? `0 0 0 1px rgba(255,43,214,${proximity * 0.3}), 0 0 24px rgba(255,43,214,${proximity * 0.5}), 0 0 40px rgba(0,229,255,${proximity * 0.4})`
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
        lineHeight: 0,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transform: cardTransform,
        transition: 'transform 150ms ease-out, box-shadow 150ms',
        boxShadow,
        cursor: 'default',
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

      {/* Name bar — slides down from above */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={nameBarStyle}
          >
            ERIC FEINSTEIN
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo with inset frame */}
      <div
        style={{
          border: '1px solid var(--fg-faint)',
          overflow: 'hidden',
          lineHeight: 0,
          position: 'relative',
        }}
      >
        <img src={src} alt={alt} style={{ width: '100%', height: 'auto', display: 'block' }} />

        {/* Holographic sheen overlay — sits inside photo area */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(270deg, #ff2bd6, #00e5ff, #00ff88, #ff2bd6)',
            backgroundSize: '300% 300%',
            backgroundPosition: sheenBgPos,
            mixBlendMode: 'color-dodge',
            opacity: hover && active ? 0.35 : 0,
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

      {/* Stat strip — slides up from below */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.06 }}
            style={statStripStyle}
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
        )}
      </AnimatePresence>
    </div>
  );
}
