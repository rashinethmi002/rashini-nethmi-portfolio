import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/* ---------------------------------------------------------------------- */
/*  Collage backdrop — unchanged from the current intro.                  */
/* ---------------------------------------------------------------------- */

const collagePanels = [
  {
    id: 'panel-1',
    className: 'absolute left-[0%] top-[4%] h-[26%] w-[54%] rounded-[28px] mix-blend-soft-light',
    background: 'color-mix(in srgb, var(--purple) 60%, transparent)',
    from: { x: -170, y: -70, rotate: -26, opacity: 0 },
    to: { x: 0, y: 0, rotate: -7, opacity: 0.4 },
    delay: 0.0,
  },
  {
    id: 'panel-2',
    className: 'absolute right-[-2%] top-[44%] h-[24%] w-[50%] rounded-[24px] mix-blend-screen',
    background: 'color-mix(in srgb, var(--gold) 55%, transparent)',
    from: { x: 180, y: 50, rotate: 22, opacity: 0 },
    to: { x: 0, y: 0, rotate: 6, opacity: 0.28 },
    delay: 0.06,
  },
  {
    id: 'panel-3',
    className: 'absolute bottom-[2%] left-[6%] h-[20%] w-[42%] rounded-[22px] mix-blend-overlay',
    background: 'color-mix(in srgb, var(--purple) 65%, transparent)',
    from: { x: -140, y: 140, rotate: -18, opacity: 0 },
    to: { x: 0, y: 0, rotate: 3, opacity: 0.3 },
    delay: 0.12,
  },
  {
    id: 'line-1',
    className: 'absolute left-[27%] top-[-6%] h-[132%] w-px mix-blend-screen',
    background:
      'linear-gradient(180deg, transparent, color-mix(in srgb, var(--gold) 75%, transparent), transparent)',
    from: { y: -190, rotate: -6, opacity: 0 },
    to: { y: 0, rotate: 8, opacity: 0.5 },
    delay: 0.09,
  },
  {
    id: 'line-2',
    className: 'absolute right-[6%] top-[36%] h-px w-[48%] mix-blend-screen',
    background:
      'linear-gradient(90deg, transparent, color-mix(in srgb, var(--gold) 65%, transparent), transparent)',
    from: { x: 210, rotate: 14, opacity: 0 },
    to: { x: 0, rotate: -9, opacity: 0.42 },
    delay: 0.15,
  },
];

const collageFragments = [
  {
    id: 'frag-1',
    text: 'PORTFOLIO',
    className: 'absolute right-[2%] top-[1%] mix-blend-overlay',
    color: 'var(--ink)',
    from: { x: 150, y: -30, opacity: 0 },
    to: { x: 0, y: 0, opacity: 0.22 },
    delay: 0.18,
  },
  {
    id: 'frag-2',
    text: '2026',
    className: 'absolute left-[3%] bottom-[4%] mix-blend-screen',
    color: 'var(--gold)',
    from: { x: -150, y: 40, opacity: 0 },
    to: { x: 0, y: 0, opacity: 0.3 },
    delay: 0.22,
  },
];

function CollageBackdrop({ reduceMotion }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[300px] -translate-x-1/2 -translate-y-1/2 sm:h-[480px] sm:w-[380px]"
    >
      {collagePanels.map((panel) => (
        <motion.div
          key={panel.id}
          initial={reduceMotion ? { opacity: 0 } : panel.from}
          animate={reduceMotion ? { opacity: panel.to.opacity * 0.7 } : panel.to}
          transition={{
            duration: reduceMotion ? 0.4 : 0.6,
            delay: reduceMotion ? 0 : panel.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={panel.className}
          style={{ background: panel.background }}
        />
      ))}
      {collageFragments.map((frag) => (
        <motion.span
          key={frag.id}
          initial={reduceMotion ? { opacity: 0 } : frag.from}
          animate={reduceMotion ? { opacity: frag.to.opacity * 0.7 } : frag.to}
          transition={{
            duration: reduceMotion ? 0.4 : 0.55,
            delay: reduceMotion ? 0 : frag.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`${frag.className} select-none font-mono text-[11px] font-semibold uppercase tracking-[0.5em] sm:text-[13px]`}
          style={{ color: frag.color }}
        >
          {frag.text}
        </motion.span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Physical badge hardware                                               */
/* ---------------------------------------------------------------------- */

/** One segment of the fabric strap — woven texture + subtle fold shading. */
function StrapSegment({ reduceMotion, delay, height, skew, rounded }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleY: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.26, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'top center' }}
      className={`w-4 sm:w-5 ${height}`}
    >
      <div
        className={`h-full w-full ${rounded}`}
        style={{
          transform: `skewX(${skew}deg)`,
          backgroundImage:
            'linear-gradient(90deg, rgba(0,0,0,0.32), color-mix(in srgb, var(--purple) 72%, black) 30%, color-mix(in srgb, var(--purple) 48%, white 12%) 58%, rgba(0,0,0,0.26)), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.28)',
        }}
      />
    </motion.div>
  );
}

/** Small metal/plastic connector the strap winds into. */
function Connector({ reduceMotion }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ scale: reduceMotion ? 1 : 0.3, opacity: reduceMotion ? 1 : 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.28, delay: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 h-9 w-9 rounded-full sm:h-11 sm:w-11"
      style={{
        background:
          'radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--purple) 55%, white 15%), color-mix(in srgb, var(--purple) 88%, black) 60%, color-mix(in srgb, var(--purple) 70%, black) 100%)',
        boxShadow:
          '0 6px 14px -4px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.35)',
      }}
    >
      <div
        className="absolute inset-[4px] rounded-full"
        style={{ border: '1px solid color-mix(in srgb, var(--gold) 45%, transparent)' }}
      />
    </motion.div>
  );
}

/** Solid plastic badge clip — the attachment between connector and holder. */
function BadgeClip({ reduceMotion }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleY: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.2, delay: reduceMotion ? 0 : 0.42, ease: 'easeOut' }}
      style={{ transformOrigin: 'top center' }}
      className="flex flex-col items-center"
    >
      <div className="h-2 w-px" style={{ background: 'color-mix(in srgb, var(--ink) 40%, silver)' }} />
      <div
        className="h-3.5 w-3.5 rounded-[4px]"
        style={{
          backgroundImage: 'linear-gradient(160deg, #e2e2e2, #97979a)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.4)',
        }}
      />
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/*  PageIntro                                                             */
/* ---------------------------------------------------------------------- */

export default function PageIntro({ children }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [settled, setSettled] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const tiltX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const tiltY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  function handlePointerMove(event) {
    if (reduceMotion || !settled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  useEffect(() => {
    const settleTimer = window.setTimeout(() => setSettled(true), reduceMotion ? 0 : 950);
    const exitTimer = window.setTimeout(() => setVisible(false), reduceMotion ? 750 : 2000);
    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(exitTimer);
    };
  }, [reduceMotion]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: visible ? 0 : 1, y: visible ? 10 : 0 }}
        transition={{ duration: 0.75, delay: visible ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
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
            exit={{ opacity: 0, y: -30, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[300] flex min-h-dvh items-center justify-center overflow-hidden bg-bg"
          >
            {/* atmospheric glow — unchanged */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(65% 60% at 50% 32%, color-mix(in srgb, var(--purple) 22%, transparent), transparent 72%), radial-gradient(38% 34% at 84% 80%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 74%)',
              }}
            />

            <CollageBackdrop reduceMotion={reduceMotion} />

            {/* SEGMENT A — upper strap, pivots gently from the fixed top point */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              style={{ perspective: 1500 }}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              initial={{ rotate: reduceMotion ? 0 : -9 }}
              animate={{ rotate: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { type: 'spring', stiffness: 42, damping: 7, mass: 0.6, delay: 0.05 }
              }
            >
              <div style={{ transformOrigin: 'top center' }} className="flex flex-col items-center">
                <StrapSegment reduceMotion={reduceMotion} delay={0.02} height="h-12 sm:h-16" skew={4} rounded="rounded-t-md" />
                <StrapSegment reduceMotion={reduceMotion} delay={0.12} height="h-7 sm:h-9" skew={-4} rounded="" />
              </div>

              <Connector reduceMotion={reduceMotion} />
              <BadgeClip reduceMotion={reduceMotion} />

              {/* SEGMENT B — holder + card, full pendulum swing, draggable once settled */}
              <motion.div
                drag={!reduceMotion && settled}
                dragConstraints={{ left: -24, right: 24, top: 0, bottom: 4 }}
                dragElastic={0.55}
                dragTransition={{ bounceStiffness: 260, bounceDamping: 14 }}
                whileDrag={{ cursor: 'grabbing' }}
                initial={{ y: reduceMotion ? 0 : -130, rotate: reduceMotion ? 0 : -17 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{
                  y: reduceMotion
                    ? { duration: 0.01 }
                    : { type: 'spring', stiffness: 190, damping: 17, mass: 0.72, delay: 0.24 },
                  rotate: reduceMotion
                    ? { duration: 0.01 }
                    : { type: 'spring', stiffness: 58, damping: 8.5, mass: 0.9, delay: 0.24 },
                }}
                style={{
                  transformOrigin: 'top center',
                  touchAction: settled ? 'none' : 'auto',
                  cursor: settled && !reduceMotion ? 'grab' : 'default',
                }}
                className="relative z-10 -mt-0.5"
              >
                {/* 3D layer: perspective settle + slight forward/back depth + live pointer tilt */}
                <motion.div
                  initial={{
                    rotateX: reduceMotion ? 0 : -18,
                    rotateY: reduceMotion ? 0 : 10,
                    z: reduceMotion ? 0 : -55,
                    opacity: reduceMotion ? 1 : 0,
                  }}
                  animate={{ rotateX: settled ? tiltX : 0, rotateY: settled ? tiltY : 0, z: 0, opacity: 1 }}
                  transition={{
                    rotateX: reduceMotion ? { duration: 0.01 } : { duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] },
                    rotateY: reduceMotion ? { duration: 0.01 } : { duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] },
                    z: reduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 130, damping: 15, delay: 0.24 },
                    opacity: { duration: 0.3, delay: reduceMotion ? 0 : 0.24 },
                  }}
                  whileHover={!reduceMotion && settled ? { scale: 1.015 } : undefined}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative"
                >
                  {/* gold accent mark */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: reduceMotion ? 0.1 : 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -right-1 -top-1 z-20 h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
                    style={{
                      background: 'color-mix(in srgb, var(--gold) 85%, white)',
                      boxShadow: '0 0 10px 2px color-mix(in srgb, var(--gold) 55%, transparent)',
                    }}
                  />

                  {/* CARD HOLDER — solid physical frame the card sits inside */}
                  <div
                    className="relative rounded-[24px] p-[7px] sm:p-[8px]"
                    style={{
                      backgroundImage:
                        'linear-gradient(160deg, color-mix(in srgb, var(--ink) 8%, #f2f0ea), color-mix(in srgb, var(--purple) 6%, #e6e3d9))',
                      border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                      boxShadow: '0 24px 46px -18px rgba(20,10,40,0.55), 0 3px 10px rgba(0,0,0,0.22)',
                    }}
                  >
                    {/* holder sheen */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-3 top-1 h-7 rounded-full opacity-25"
                      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.85), transparent)' }}
                    />

                    {/* attachment loop connecting to the clip above */}
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 -top-1.5 z-10 h-3 w-7 -translate-x-1/2 rounded-full"
                      style={{
                        backgroundImage: 'linear-gradient(160deg, #e8e8e8, #9c9c9f)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.35)',
                      }}
                    />

                    {/* thickness illusion — a darker layer peeking from behind the card */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-[7px] translate-x-[3px] translate-y-[4px] rounded-[18px] sm:inset-[8px]"
                      style={{ backgroundImage: 'linear-gradient(165deg, #e2ded2, #d5d0c2)' }}
                    />

                    {/* CARD — fully opaque solid surface */}
                    <div
                      className="relative w-[186px] max-w-[74vw] overflow-hidden rounded-[18px] sm:w-[220px]"
                      style={{
                        backgroundImage: 'linear-gradient(165deg, #fdfbf7, #eeeae0)',
                        border: '1px solid rgba(0,0,0,0.09)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 10px 22px -10px rgba(0,0,0,0.4)',
                      }}
                    >
                      {/* punch hole */}
                      <div className="absolute left-1/2 top-2 z-10 h-1.5 w-6 -translate-x-1/2 rounded-full bg-black/15" />

                      <div className="relative flex min-h-[258px] flex-col justify-between px-4 pb-4 pt-7 sm:min-h-[296px] sm:px-5 sm:pb-5 sm:pt-8">
                        {/* large outline monogram, top-left */}
                        <motion.span
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: reduceMotion ? 0.05 : 0.62, ease: [0.16, 1, 0.3, 1] }}
                          aria-hidden="true"
                          className="font-display select-none text-[68px] font-bold leading-none sm:text-[82px]"
                          style={{
                            color: 'transparent',
                            WebkitTextStroke: '1.5px color-mix(in srgb, var(--gold) 65%, var(--purple) 20%)',
                          }}
                        >
                          R
                        </motion.span>

                        {/* vertical name lockup, right edge */}
                        <div
                          className="pointer-events-none absolute right-2.5 top-7 bottom-14 flex items-center overflow-hidden sm:right-3 sm:top-8 sm:bottom-16"
                          style={{ writingMode: 'vertical-rl' }}
                        >
                          <motion.span
                            initial={{ y: reduceMotion ? '0%' : '105%', opacity: reduceMotion ? 1 : 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            transition={{ duration: 0.35, delay: reduceMotion ? 0.1 : 0.78, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display text-[12px] font-bold tracking-tight text-[color-mix(in_srgb,var(--purple)_75%,#14101f)] sm:text-[14px]"
                          >
                            Rashini<span className="font-normal opacity-80">Nethmi</span>
                          </motion.span>
                          <motion.span
                            initial={{ y: reduceMotion ? '0%' : '105%', opacity: reduceMotion ? 1 : 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            transition={{ duration: 0.3, delay: reduceMotion ? 0.15 : 0.88, ease: [0.16, 1, 0.3, 1] }}
                            className="ml-1 font-mono text-[7px] uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--gold)_75%,var(--ink)_25%)] sm:text-[8px]"
                          >
                            + Web Developer
                          </motion.span>
                        </div>

                        {/* bottom identity block */}
                        <div className="relative">
                          <div className="overflow-hidden">
                            <motion.p
                              initial={{ y: reduceMotion ? '0%' : '100%', opacity: reduceMotion ? 1 : 0 }}
                              animate={{ y: '0%', opacity: 1 }}
                              transition={{ duration: 0.4, delay: reduceMotion ? 0.2 : 0.95, ease: [0.16, 1, 0.3, 1] }}
                              className="font-display text-[18px] font-bold leading-tight text-[color-mix(in_srgb,var(--purple)_72%,#14101f)] sm:text-[21px]"
                            >
                              Rashini
                              <br />
                              Nethmi
                            </motion.p>
                          </div>
                          <div className="mt-1 overflow-hidden">
                            <motion.p
                              initial={{ y: reduceMotion ? '0%' : '100%', opacity: reduceMotion ? 1 : 0 }}
                              animate={{ y: '0%', opacity: 1 }}
                              transition={{ duration: 0.35, delay: reduceMotion ? 0.28 : 1.12, ease: [0.16, 1, 0.3, 1] }}
                              className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--ink)_55%,transparent)] sm:text-[10px]"
                            >
                              Web Developer
                            </motion.p>
                          </div>
                        </div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.35, delay: reduceMotion ? 0.35 : 1.25 }}
                          className="absolute bottom-3.5 right-4 font-mono text-[7px] uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--ink)_40%,transparent)] sm:bottom-4 sm:right-5"
                        >
                          Portfolio / 2026
                        </motion.p>
                      </div>

                      {/* elegant light sweep once settled */}
                      {!reduceMotion && (
                        <motion.div
                          aria-hidden="true"
                          initial={{ x: '-130%', opacity: 0 }}
                          animate={{ x: '170%', opacity: [0, 0.55, 0] }}
                          transition={{ duration: 0.8, delay: 1.35, ease: 'easeInOut' }}
                          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 mix-blend-overlay bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.75),transparent)]"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* contact shadow — shifts and softens with the swing */}
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, scaleX: 0.7, x: reduceMotion ? 0 : 8 }}
                  animate={{
                    opacity: settled ? 0.3 : 0.2,
                    scaleX: 1,
                    x: reduceMotion ? 0 : [8, -7, 4, -1.5, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: reduceMotion ? 0 : 0.68 },
                    scaleX: { duration: 0.5, delay: reduceMotion ? 0 : 0.68 },
                    x: { duration: 1.0, delay: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className="mx-auto mt-3 h-3 w-[64%] rounded-[50%] bg-black blur-md"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}