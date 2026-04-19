import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const GLYPHS = '!<>-_\\/[]{}=+*^?#________';

function randChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export default function GlitchText({
  children,
  duration = 600,
  trigger,
  className = '',
  as: Tag = 'span',
}) {
  const target = String(children);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? target : ''.padEnd(target.length, ' '));
  const rafRef = useRef();
  const startRef = useRef();

  useEffect(() => {
    if (reduced) {
      setDisplay(target);
      return;
    }
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      const locked = Math.floor(progress * target.length);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < locked) out += target[i];
        else if (target[i] === ' ') out += ' ';
        else out += randChar();
      }
      setDisplay(out);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, trigger, reduced]);

  const isScrambling = display !== target && !reduced;

  return (
    <Tag
      data-testid="glitch-text"
      className={`${className} ${isScrambling ? 'rainbow-text' : ''}`.trim()}
    >
      {display}
    </Tag>
  );
}
