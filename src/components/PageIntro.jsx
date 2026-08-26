import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const NAME = 'RASHINI NETHMI';
const GLYPHS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}/*+=#$%:;·◊◇';

function glyph(index) {
  return GLYPHS[(index * 17 + 11) % GLYPHS.length];
}

function ConnectionField() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-35" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <g fill="none" stroke="var(--purple)" strokeWidth="1">
        <path d="M-80 610 L210 420 L470 520 L710 270 L1260 430" opacity=".28" />
        <path d="M80 110 L330 245 L610 190 L940 330 L1210 130" opacity=".2" />
        <path d="M300 820 L470 520 L610 190 L850 -40" opacity=".2" />
      </g>
      <g fill="var(--gold)"><circle cx="210" cy="420" r="2" /><circle cx="710" cy="270" r="2" /><circle cx="610" cy="190" r="1.5" /></g>
    </svg>
  );
}

function CharacterRain({ reduceMotion }) {
  const particles = useMemo(() => Array.from({ length: reduceMotion ? 24 : 120 }, (_, index) => ({
    character: glyph(index), left: (index * 41 + 7) % 100, top: -8 - ((index * 23) % 50),
    duration: 1.6 + ((index * 13) % 22) / 10, delay: ((index * 19) % 18) / 20,
    size: 9 + ((index * 7) % 7), opacity: .16 + ((index * 11) % 34) / 100, gold: index % 23 === 0,
  })), [reduceMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <span key={index} className="absolute font-mono leading-none" style={{
          left: `${particle.left}%`, top: `${particle.top}%`, fontSize: `${particle.size}px`,
          color: particle.gold ? 'var(--gold)' : 'var(--purple)', opacity: particle.opacity,
          filter: index % 4 === 0 ? 'blur(.7px)' : 'none',
          animation: reduceMotion ? 'none' : `page-intro-rain ${particle.duration}s linear ${particle.delay}s infinite`,
        }}>{particle.character}</span>
      ))}
    </div>
  );
}

function IdentityLockup({ reduceMotion }) {
  const [letters, setLetters] = useState(() => NAME.split('').map((character, index) => character === ' ' ? ' ' : glyph(index + 50)));

  useEffect(() => {
    if (reduceMotion) { setLetters(NAME.split('')); return undefined; }
    const timers = NAME.split('').map((character, index) => window.setTimeout(() => {
      setLetters((current) => current.map((value, letterIndex) => letterIndex === index ? character : value));
    }, 790 + index * 38));
    return () => timers.forEach(window.clearTimeout);
  }, [reduceMotion]);

  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="relative flex max-w-[92vw] items-center justify-center whitespace-pre font-display text-[clamp(28px,7.8vw,88px)] font-medium leading-none tracking-[.015em] text-ink">
        <motion.div aria-hidden="true" className="absolute -inset-x-4 -inset-y-5 rounded-full" initial={{ opacity: 0, scaleX: .45 }} animate={reduceMotion ? { opacity: 0 } : { opacity: [0, .25, 0], scaleX: [.45, 1.1, 1.25] }} transition={{ delay: 1.3, duration: .55, ease: 'easeInOut' }} style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--purple) 45%, transparent), color-mix(in srgb, var(--gold) 48%, transparent), transparent)', filter: 'blur(14px)' }} />
        {letters.map((letter, index) => (
          <motion.span key={index} className={letter === ' ' ? 'w-[.28em]' : 'inline-block'} initial={reduceMotion ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 13, filter: 'blur(8px)', scale: .82 }} animate={{ opacity: letter === NAME[index] ? 1 : .7, y: 0, filter: letter === NAME[index] ? 'blur(0px)' : 'blur(1.5px)', scale: 1 }} transition={{ duration: .38, delay: reduceMotion ? 0 : .72 + index * .038, ease: [0.16, 1, 0.3, 1] }} style={{ color: letter === NAME[index] ? 'var(--ink)' : 'var(--purple)' }}>{letter}</motion.span>
        ))}
      </div>
      <motion.p initial={{ opacity: 0, y: 10, letterSpacing: '.35em' }} animate={{ opacity: 1, y: 0, letterSpacing: '.28em' }} transition={{ duration: .45, delay: reduceMotion ? 0 : 1.42, ease: [0.16, 1, 0.3, 1] }} className="mt-5 font-mono text-[10px] uppercase text-purple sm:text-xs">Web Developer</motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: .58 }} transition={{ duration: .35, delay: reduceMotion ? 0 : 1.62 }} className="mt-5 font-mono text-[8px] uppercase tracking-[.32em] text-gold">Portfolio / 2026</motion.p>
    </div>
  );
}

export default function PageIntro({ children }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setVisible(false), reduceMotion ? 650 : 2350);
    return () => window.clearTimeout(exitTimer);
  }, [reduceMotion]);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: visible ? 0 : 1, y: visible ? 14 : 0 }} transition={{ duration: .72, delay: visible ? 0 : .04, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
      <AnimatePresence>
        {visible && <motion.div key="page-intro" role="status" aria-label="Rashini Nethmi, Web Developer - portfolio loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-[300] flex min-h-dvh items-center justify-center overflow-hidden bg-bg">
          <style>{`@keyframes page-intro-rain { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(0, 125vh, 0); } }`}</style>
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 50% 45%, color-mix(in srgb, var(--purple) 16%, transparent), transparent 72%), radial-gradient(42% 45% at 82% 78%, color-mix(in srgb, var(--gold) 9%, transparent), transparent 76%)' }} />
          <ConnectionField />
          <CharacterRain reduceMotion={reduceMotion} />
          <motion.div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-purple" initial={{ scaleX: 0, opacity: 0 }} animate={reduceMotion ? { scaleX: 1, opacity: .08 } : { scaleX: [0, 1, 1, 0], opacity: [0, .13, .1, 0] }} transition={{ duration: reduceMotion ? .1 : 2.15, delay: reduceMotion ? 0 : .18, ease: 'easeInOut' }} style={{ transformOrigin: 'center', filter: 'blur(2px)' }} />
          <IdentityLockup reduceMotion={reduceMotion} />
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={reduceMotion ? { opacity: 0 } : { opacity: [0, 0, .32, 0] }} transition={{ duration: 2.25, times: [0, .7, .78, 1], ease: 'easeOut' }} style={{ background: 'radial-gradient(circle at 50% 50%, transparent 12%, color-mix(in srgb, var(--purple) 18%, transparent) 24%, transparent 46%)' }} />
        </motion.div>}
      </AnimatePresence>
    </>
  );
}
