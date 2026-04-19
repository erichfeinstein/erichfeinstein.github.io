import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GlitchText from './GlitchText';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const KEY = 'intro_played_v1';

export default function Intro() {
  const reduced = useReducedMotion();
  const isNarrow = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  const skip = reduced || isNarrow || (typeof window !== 'undefined' && sessionStorage.getItem(KEY));

  const [stage, setStage] = useState(skip ? -1 : 0);
  const [gone, setGone] = useState(skip);

  useEffect(() => {
    if (skip) return;
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 900),
      setTimeout(() => { setGone(true); sessionStorage.setItem(KEY, '1'); }, 2200),
    ];
    const bail = () => {
      timers.forEach(clearTimeout);
      setGone(true);
      sessionStorage.setItem(KEY, '1');
    };
    window.addEventListener('keydown', bail);
    window.addEventListener('pointerdown', bail);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', bail);
      window.removeEventListener('pointerdown', bail);
    };
  }, [skip]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200, background: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16,
          }}
          aria-hidden="true"
        >
          <div style={{ color: 'var(--fg-dim)', fontSize: '0.9rem' }}>
            {stage >= 0 && 'booting...'}
          </div>
          <div style={{ color: 'var(--fg-dim)', fontSize: '1rem' }}>
            {stage >= 1 && <span className="blink-cursor">~/eric $ whoami</span>}
          </div>
          {stage >= 2 && (
            <GlitchText duration={800} trigger={stage} as="h1">
              eric feinstein
            </GlitchText>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
