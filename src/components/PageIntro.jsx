import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

function ConnectionField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
    >
      <g fill="none" stroke="var(--purple)" strokeWidth="1">
        <path d="M-80 610 L210 420 L470 520 L710 270 L1260 430" opacity=".28" />
        <path d="M80 110 L330 245 L610 190 L940 330 L1210 130" opacity=".2" />
        <path d="M300 820 L470 520 L610 190 L850 -40" opacity=".2" />
      </g>
      <g fill="var(--gold)">
        <circle cx="210" cy="420" r="2" />
        <circle cx="710" cy="270" r="2" />
        <circle cx="610" cy="190" r="1.5" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Glyph set — deliberately NOT the classic katakana Matrix charset.  */
/*  Latin letters, digits, code punctuation, and a few quiet geometric */
/*  marks, so the rain reads as "developer / generative" rather than   */
/*  a 1990s hacker-movie cliché.                                       */
/* ------------------------------------------------------------------ */

const RAIN_GLYPHS =
  '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=<>#%&{}[]()_~^•·◆◇▢▣△○'.split('');

function randomGlyph() {
  return RAIN_GLYPHS[(Math.random() * RAIN_GLYPHS.length) | 0];
}

function CodeTyping({ active, reduceMotion }) {
  const code = `const identity = {\n  name: "Rashini Nethmi",\n  role: "Web Developer"\n};`;
  const [visibleCharacters, setVisibleCharacters] = useState(reduceMotion ? code.length : 0);

  useEffect(() => {
    if (reduceMotion) {
      setVisibleCharacters(code.length);
      return undefined;
    }
    if (!active) return undefined;

    setVisibleCharacters(0);
    const typingTimer = window.setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= code.length) {
          window.clearInterval(typingTimer);
          return current;
        }
        return current + 1;
      });
    }, 16);
    return () => window.clearInterval(typingTimer);
  }, [active, code.length, reduceMotion]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 8 }}
      animate={active ? { opacity: 0.78, y: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-1/2 top-1/2 z-10 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-[1.8] text-purple sm:text-xs"
    >
      <span className="text-gold">&gt; initializing identity</span>
      <br />
      <span className="whitespace-pre">{code.slice(0, visibleCharacters)}</span>
      <motion.span
        animate={reduceMotion ? { opacity: 0 } : { opacity: [0, 1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity }}
        className="ml-0.5 inline-block h-[1em] w-px translate-y-[2px] bg-gold"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CodeRain — canvas-based falling-character field.                   */
/*  Reads its behaviour from a `stageRef` so the whole animation is    */
/*  driven by one rAF loop instead of re-mounting per phase.           */
/*  Stages: 'idle' | 'rain' | 'dense' | 'converge' | 'fadeOut' |       */
/*          'disperse'                                                */
/* ------------------------------------------------------------------ */

function CodeRain({ stageRef, reduceMotion, isMobile }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let columns = [];
    let raf = 0;

    // Tight, edge-to-edge columns (like classic Matrix rain) rather than
    // airy gaps — density is controlled by how many columns are "active"
    // at a given stage, not by column spacing.
    const fontSize = isMobile ? 13 : 15;
    const colGap = fontSize;

    function buildColumns() {
      const count = Math.max(10, Math.ceil(width / colGap));
      const centerX = width / 2;
      const nameHalfWidth = Math.min(width * 0.42, isMobile ? 170 : 320);

      columns = Array.from({ length: count }, (_, i) => {
        const x = i * colGap + colGap / 2;
        const distFromCenter = Math.abs(x - centerX);
        const nearName = distFromCenter < nameHalfWidth;
        return {
          x,
          y: -Math.random() * height,
          baseSpeed: (isMobile ? 60 : 85) + Math.random() * 110,
          len: 12 + Math.floor(Math.random() * 12),
          glyphs: Array.from({ length: 26 }, randomGlyph),
          nearName,
          goldAt: Math.floor(Math.random() * 26),
          // fixed per-column threshold — determines at what density stage
          // this column "switches on", so growth reads as more streams
          // joining rather than existing ones flickering in and out
          activeAt: Math.random(),
        };
      });
    }

    function resize() {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildColumns();
    }

    resize();
    window.addEventListener('resize', resize);

    const styles = getComputedStyle(document.documentElement);
    const purpleCss = styles.getPropertyValue('--purple').trim() || '#8b7bd8';
    const goldCss = styles.getPropertyValue('--gold').trim() || '#d8b26b';

    // Resolve CSS colors (any format) to RGB triples via a 1x1 probe canvas,
    // so we can blend toward white for a bright "head" glyph — the
    // near-white-over-dim-trail look from the reference, kept on-palette.
    function resolveRGB(cssColor) {
      const probe = document.createElement('canvas');
      probe.width = 1;
      probe.height = 1;
      const pctx = probe.getContext('2d');
      pctx.fillStyle = cssColor;
      pctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = pctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b];
    }
    function mixRGB(c1, c2, t) {
      return `rgb(${Math.round(c1[0] + (c2[0] - c1[0]) * t)}, ${Math.round(c1[1] + (c2[1] - c1[1]) * t)}, ${Math.round(
        c1[2] + (c2[2] - c1[2]) * t
      )})`;
    }

    const purpleRGB = resolveRGB(purpleCss);
    const goldRGB = resolveRGB(goldCss);
    const white = [255, 255, 255];
    const purple = mixRGB(purpleRGB, white, 0.05); // body glyph color
    const purpleHead = mixRGB(purpleRGB, white, 0.72); // bright lead glyph
    const gold = mixRGB(goldRGB, white, 0.05);
    const goldHead = mixRGB(goldRGB, white, 0.6);

    let last = performance.now();

    function draw(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const stage = stageRef.current;

      ctx.clearRect(0, 0, width, height);

      if (stage === 'idle') {
        raf = requestAnimationFrame(draw);
        return;
      }

      // Density now controls how many columns are switched on, not how
      // often an active column advances — active streams flow continuously,
      // matching the reference's unbroken vertical movement.
      const density = stage === 'rain' ? 0.6 : stage === 'dense' || stage === 'converge' ? 1 : stage === 'fadeOut' ? 0.35 : 0;
      const converge = stage === 'converge';
      const globalFade = stage === 'fadeOut' ? 0.5 : stage === 'disperse' ? 0.12 : 1;
      const disperse = stage === 'disperse';

      ctx.font = `${fontSize}px ui-monospace, "SF Mono", Menlo, monospace`;
      ctx.textBaseline = 'top';

      const centerY = height * 0.46;

      columns.forEach((col) => {
        const on = col.activeAt < density;

        let speed = col.baseSpeed;
        if (converge && col.nearName) speed *= 0.4; // slow near the name, as if gathering
        if (disperse) speed = -col.baseSpeed * 2.4; // shoot back upward/outward
        col.y += speed * dt;

        if (col.y > height + col.len * fontSize) {
          col.y = -col.len * fontSize - Math.random() * height * 0.4;
          col.glyphs = Array.from({ length: 26 }, randomGlyph);
        }
        if (!on) return;

        for (let i = 0; i < col.len; i += 1) {
          let yPos = col.y - i * fontSize;

          if (converge && col.nearName) {
            // pull rows gently toward the name band, tightening the field
            yPos += (centerY - yPos) * 0.02 * i;
          }

          if (yPos < -fontSize || yPos > height + fontSize) continue;

          const isHead = i === 0;
          const isSecondary = i === 1;
          const isGoldHead = isHead && Math.random() > 0.965;
          // exponential falloff: sharp near the tail, bright near the head
          const trailAlpha = Math.pow(Math.max(0, 1 - i / col.len), 1.7) * globalFade;
          if (trailAlpha <= 0.015) continue;

          if (Math.random() < 0.025) col.glyphs[i] = randomGlyph();

          if (isHead) {
            ctx.fillStyle = isGoldHead ? goldHead : purpleHead;
            ctx.globalAlpha = Math.min(1, trailAlpha * 1.6);
          } else if (isSecondary) {
            ctx.fillStyle = purple;
            ctx.globalAlpha = Math.min(0.9, trailAlpha * 1.2);
          } else {
            ctx.fillStyle = i === col.goldAt ? gold : purple;
            ctx.globalAlpha = trailAlpha * 0.75;
          }
          if (disperse) ctx.globalAlpha *= 0.5;
          ctx.fillText(col.glyphs[i], col.x, yPos);
        }
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduceMotion, isMobile, stageRef]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ filter: 'blur(0.2px)' }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  DecodingText — cycles random glyphs per character, then locks each */
/*  one into its true letter, staggered left to right. This is the     */
/*  "characters resolve into the name" mechanic, not text over rain.   */
/* ------------------------------------------------------------------ */

function DecodingText({ text, active, reduceMotion, stagger = 42, className, glyphClassName, style }) {
  const chars = useMemo(() => text.split(''), [text]);
  const revealedRef = useRef(chars.map(() => reduceMotion));
  const [display, setDisplay] = useState(() => chars.map((c) => (reduceMotion ? c : c === ' ' ? ' ' : randomGlyph())));
  const [justResolved, setJustResolved] = useState(() => chars.map(() => false));

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(chars);
      return undefined;
    }
    if (!active) return undefined;

    revealedRef.current = chars.map(() => false);
    const timers = [];

    const scrambleInterval = setInterval(() => {
      setDisplay((prev) =>
        prev.map((c, i) => {
          if (chars[i] === ' ') return ' ';
          return revealedRef.current[i] ? chars[i] : randomGlyph();
        })
      );
    }, 40);
    timers.push(scrambleInterval);

    chars.forEach((c, i) => {
      if (c === ' ') return;
      const t = setTimeout(() => {
        revealedRef.current[i] = true;
        setJustResolved((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setTimeout(() => {
          setJustResolved((prev) => {
            const next = [...prev];
            next[i] = false;
            return next;
          });
        }, 260);
      }, i * stagger + 40);
      timers.push(t);
    });

    return () => timers.forEach((t) => clearInterval(t) || clearTimeout(t));
  }, [active, reduceMotion, chars, stagger]);

  return (
    <span className={className} style={style} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={`${c}-${i}`}
          aria-hidden="true"
          className={glyphClassName}
          style={{
            display: 'inline-block',
            filter: reduceMotion ? 'none' : justResolved[i] ? 'blur(0px)' : revealedRef.current[i] ? 'blur(0px)' : 'blur(2px)',
            opacity: reduceMotion ? 1 : revealedRef.current[i] || display[i] === ' ' ? 1 : 0.55,
            color: justResolved[i] ? 'var(--gold)' : undefined,
            transform: justResolved[i] ? 'scale(1.06)' : 'scale(1)',
            transition: 'filter 0.22s ease, color 0.35s ease, transform 0.22s ease, opacity 0.18s ease',
          }}
        >
          {display[i] === ' ' ? '\u00A0' : display[i]}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  PageIntro                                                          */
/* ------------------------------------------------------------------ */

const TIMING = {
  glow: 150,
  network: 200,
  rainStart: 250,
  densify: 600,
  converge: 800,
  nameStart: 1200,
  nameReadable: 1550,
  subtitle: 1650,
  sweep: 1800,
  rainFadeOut: 2000,
  hold: 2200,
  disperseStart: 2300,
  exit: 2800,
};

export default function PageIntro({ children }) {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState('start'); // start -> glow -> rain -> name -> subtitle -> sweep -> disperse
  const stageRef = useRef('idle'); // consumed by CodeRain's rAF loop

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      stageRef.current = 'idle';
      setPhase('name');
      const t = setTimeout(() => setVisible(false), 650);
      return () => clearTimeout(t);
    }

    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    at(TIMING.glow, () => setPhase('glow'));
    at(TIMING.rainStart, () => {
      stageRef.current = 'rain';
      setPhase('rain');
    });
    at(TIMING.densify, () => {
      stageRef.current = 'dense';
    });
    at(TIMING.converge, () => {
      stageRef.current = 'converge';
    });
    at(TIMING.nameStart, () => setPhase('name'));
    at(TIMING.subtitle, () => setPhase('subtitle'));
    at(TIMING.sweep, () => setPhase('sweep'));
    at(TIMING.rainFadeOut, () => {
      stageRef.current = 'fadeOut';
    });
    at(TIMING.disperseStart, () => {
      stageRef.current = 'disperse';
      setPhase('disperse');
    });
    at(TIMING.exit, () => setVisible(false));

    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  const nameActive = phase === 'name' || phase === 'subtitle' || phase === 'sweep' || phase === 'disperse';
  const dispersing = phase === 'disperse';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: visible ? 0 : 1, y: visible ? 10 : 0 }}
        transition={{ duration: 0.75, delay: visible ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {visible && (
          <motion.div
            key="page-intro"
            role="status"
            aria-label="Rashini Nethmi, Web Developer — portfolio loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[300] flex min-h-dvh items-center justify-center overflow-hidden bg-bg"
          >
            {/* Layer 1 — very subtle background gradient */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                background:
                  'radial-gradient(60% 55% at 50% 42%, color-mix(in srgb, var(--purple) 16%, transparent), transparent 72%), radial-gradient(34% 30% at 82% 82%, color-mix(in srgb, var(--gold) 10%, transparent), transparent 76%)',
              }}
            />

            {/* Layer 2 — existing connection / network field */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 opacity-0"
              animate={{ opacity: dispersing ? 0.25 : 0.55 }}
              transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.15 }}
            >
              <ConnectionField />
            </motion.div>

            {/* Layers 3–5 — canvas character rain (distant + main + converging) */}
            <CodeTyping
              active={phase === 'start' || phase === 'glow' || phase === 'rain' || phase === 'dense' || phase === 'converge'}
              reduceMotion={reduceMotion}
            />
            <CodeRain stageRef={stageRef} reduceMotion={reduceMotion} isMobile={isMobile} />

            {/* Layer 6–7 — main typography + gold highlights */}
            <motion.div
              className="relative z-10 flex flex-col items-center px-6 text-center"
              animate={
                !nameActive
                  ? { opacity: 0, scale: 0.98, filter: 'blur(5px)' }
                  : dispersing
                  ? { opacity: 0, scale: 1.08, filter: 'blur(6px)' }
                  : { opacity: 1, scale: 1, filter: 'blur(0px)' }
              }
              transition={{ duration: dispersing ? 0.55 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1
                className="font-display select-none text-[13vw] font-bold leading-none tracking-tight sm:text-[64px]"
                style={{ color: 'var(--ink)' }}
              >
                <DecodingText
                  text="RASHINI NETHMI"
                  active={nameActive}
                  reduceMotion={reduceMotion}
                  stagger={38}
                  glyphClassName="font-display"
                  style={{ color: 'var(--ink)' }}
                />

                {/* purple → gold energy sweep, triggered once the name resolves */}
                {!reduceMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 mix-blend-overlay"
                    initial={{ x: '-120%', opacity: 0 }}
                    animate={
                      phase === 'sweep' || phase === 'disperse'
                        ? { x: '120%', opacity: [0, 0.6, 0] }
                        : { x: '-120%', opacity: 0 }
                    }
                    transition={{ duration: 0.48, ease: 'easeInOut' }}
                    style={{
                      background:
                        'linear-gradient(100deg, transparent, color-mix(in srgb, var(--gold) 70%, white) , transparent)',
                      width: '40%',
                    }}
                  />
                )}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === 'subtitle' || phase === 'sweep' || phase === 'disperse'
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.42em] sm:text-[13px]"
                style={{ color: 'color-mix(in srgb, var(--gold) 80%, var(--ink) 10%)' }}
              >
                Web Developer
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={
                  phase === 'subtitle' || phase === 'sweep' || phase === 'disperse' ? { opacity: 0.5 } : { opacity: 0 }
                }
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-5 font-mono text-[9px] uppercase tracking-[0.3em]"
                style={{ color: 'color-mix(in srgb, var(--ink) 45%, transparent)' }}
              >
                Portfolio / 2026
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}