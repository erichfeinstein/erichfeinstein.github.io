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

export default function TradingCard({ src, alt }) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { ref, onMouseMove, onMouseLeave: tiltLeave, nx, ny, active } = useCardTilt();

  if (reduced) {
    return (
      <div
        style={{
          width: 220,
          border: '1px solid var(--fg-faint)',
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
  const handleClick = () => setFlipped((f) => !f);

  const proximity = active
    ? Math.max(0, Math.min(1, 1 - 2 * Math.max(Math.abs(nx), Math.abs(ny))))
    : 0;

  const flipRot = flipped ? ' rotateY(180deg)' : '';
  const cardTransform = active
    ? `perspective(700px) translateZ(18px) rotateX(${-ny * 22}deg) rotateY(${nx * 22}deg) scale(1.05)${flipRot}`
    : hover
    ? `perspective(700px) translateZ(10px) scale(1.03)${flipRot}`
    : `perspective(700px)${flipRot}`;

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
      onClick={handleClick}
      style={{
        position: 'relative',
        width: 220,
        display: 'inline-block',
        border: '1px solid var(--fg-faint)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transform: cardTransform,
        transition: 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms ease-out',
        boxShadow,
        cursor: 'pointer',
        lineHeight: 0,
      }}
    >
      {/* Outer double-border ring: fades in on hover. Lives on both faces
          visually because it's outside the card body. */}
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

      {/* Front face — the photo */}
      <div
        style={{
          position: 'relative',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {/* Holographic sheen overlay (front only) */}
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
      </div>

      {/* Back face — rainbow gradient with centered name */}
      <div
        aria-hidden={!flipped}
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 14,
          overflow: 'hidden',
        }}
      >
        {/* Animated rainbow wash behind the text */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(270deg, #ff2bd6, #00e5ff, #00ff88, #ff2bd6)',
            backgroundSize: '400% 100%',
            animation: 'rainbow-sweep 6s linear infinite',
            opacity: 0.35,
            mixBlendMode: 'screen',
          }}
        />
        {/* Rainbow hairline frame */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 6,
            border: '1px solid rgba(255,255,255,0.22)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            fontFamily: 'var(--mono)',
            color: 'var(--fg)',
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.3em', color: 'var(--fg-dim)' }}>
            {'// back'}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em', marginTop: 8 }}>
            ERIC FEINSTEIN
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)', marginTop: 6 }}>
            made with claude · nyc
          </div>
        </div>
      </div>
    </div>
  );
}
