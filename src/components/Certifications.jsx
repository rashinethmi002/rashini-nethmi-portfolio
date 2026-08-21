import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiAward, FiArrowRight } from 'react-icons/fi';
import SectionTitle from './SectionTitle';
import { certifications } from '../data/certifications';

const VISIBLE_DEPTH = 4;

// each accent stays attached to a cert (by original index), independent of stack position
const ACCENTS = [
  { badgeBg: 'bg-purple-soft', badgeText: 'text-purple', ring: 'border-purple/40', dot: '#6C4CF1', glow: 'rgba(108,76,241,0.4)', tagBg: 'bg-purple-soft', tagText: 'text-purple', tagBorder: 'border-purple/20' },
  { badgeBg: 'bg-gold-soft', badgeText: 'text-gold', ring: 'border-gold/40', dot: '#C8933F', glow: 'rgba(200,147,63,0.4)', tagBg: 'bg-gold-soft', tagText: 'text-gold', tagBorder: 'border-gold/20' },
  { badgeBg: 'bg-[#14b8a6]/12', badgeText: 'text-[#14b8a6]', ring: 'border-[#14b8a6]/40', dot: '#14b8a6', glow: 'rgba(20,184,166,0.4)', tagBg: 'bg-[#14b8a6]/12', tagText: 'text-[#14b8a6]', tagBorder: 'border-[#14b8a6]/25' },
  { badgeBg: 'bg-[#f43f5e]/12', badgeText: 'text-[#f43f5e]', ring: 'border-[#f43f5e]/40', dot: '#f43f5e', glow: 'rgba(244,63,94,0.4)', tagBg: 'bg-[#f43f5e]/12', tagText: 'text-[#f43f5e]', tagBorder: 'border-[#f43f5e]/25' },
  { badgeBg: 'bg-[#3b82f6]/12', badgeText: 'text-[#3b82f6]', ring: 'border-[#3b82f6]/40', dot: '#3b82f6', glow: 'rgba(59,130,246,0.4)', tagBg: 'bg-[#3b82f6]/12', tagText: 'text-[#3b82f6]', tagBorder: 'border-[#3b82f6]/25' },
];

function getCardStyle(depth) {
  if (depth === 0) return { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, blur: 0 };
  const dir = depth % 2 === 0 ? -1 : 1;
  return {
    x: dir * (14 + depth * 13),
    y: depth * 12,
    rotate: dir * (4 + depth * 4.5),
    scale: 1 - depth * 0.045,
    opacity: depth < VISIBLE_DEPTH ? 1 - depth * 0.22 : 0,
    blur: depth < VISIBLE_DEPTH ? depth * 0.6 : 0,
  };
}

function CertificationStack({ certifications, frontTitle }) {
  const withAccents = useMemo(
    () => certifications.map((c, i) => ({ ...c, accent: ACCENTS[i % ACCENTS.length] })),
    [certifications]
  );

  const initialOrder = useMemo(() => {
    const idx = withAccents.findIndex((c) => c.title === frontTitle);
    if (idx <= 0) return withAccents;
    const copy = [...withAccents];
    const [item] = copy.splice(idx, 1);
    return [item, ...copy];
  }, [withAccents, frontTitle]);

  const [order, setOrder] = useState(initialOrder);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-120px' });

  const advance = () =>
    setOrder((prev) => {
      const [front, ...rest] = prev;
      return [...rest, front];
    });

  const bringToFront = (title) =>
    setOrder((prev) => {
      const idx = prev.findIndex((c) => c.title === title);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      return [item, ...copy];
    });

  useEffect(() => {
    if (paused || !inView) return undefined;
    timerRef.current = setInterval(advance, 4200);
    return () => clearInterval(timerRef.current);
  }, [paused, inView]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex flex-col items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ambient color glow behind the stack */}
      <div className="pointer-events-none absolute -z-10 h-[380px] w-[380px] rounded-full bg-purple/25 blur-[90px] top-10 -left-6" />
      <div className="pointer-events-none absolute -z-10 h-[300px] w-[300px] rounded-full bg-gold/20 blur-[90px] bottom-0 -right-6" />

      <div className="relative z-0 h-[620px] w-[92vw] max-w-[480px]">
        {order.map((cert, depth) => {
          const style = getCardStyle(depth);
          const isFront = depth === 0;
          const accent = cert.accent;

          return (
            <motion.div
              key={cert.title}
              onClick={() => (isFront ? advance() : bringToFront(cert.title))}
              initial={{ x: 0, y: 220, rotate: 0, scale: 0.82, opacity: 0 }}
              animate={
                inView
                  ? { x: style.x, y: style.y, rotate: style.rotate, scale: style.scale, opacity: style.opacity }
                  : { x: 0, y: 220, rotate: 0, scale: 0.82, opacity: 0 }
              }
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
                delay: inView ? depth * 0.09 : 0,
              }}
              style={{
                zIndex: 20 - depth,
                filter: `blur(${style.blur}px)`,
                transformOrigin: 'bottom center',
                pointerEvents: style.opacity <= 0 ? 'none' : 'auto',
                boxShadow: isFront
                  ? `0 30px 60px -20px ${accent.glow}`
                  : '0 24px 50px -28px rgba(0,0,0,0.45)',
              }}
              className={`absolute inset-0 flex cursor-pointer flex-col rounded-[28px] border bg-surface p-7 transition-colors duration-300 ${
                isFront ? accent.ring : 'border-border'
              }`}
            >
              <div className="relative h-[280px] shrink-0 overflow-hidden rounded-2xl bg-surface-2">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted/60">
                    <FiAward size={25} />
                    <span className="font-mono text-[9px] uppercase tracking-[.14em]">
                      Certificate preview
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent.badgeBg} ${accent.badgeText}`}>
                  <FiAward size={19} />
                </span>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent.dot }} />
              </div>

              <div className="mt-6 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted/70">
                  {cert.year}
                </p>
                <h4 className="mt-2 text-xl font-semibold font-display leading-snug text-ink">
                  {cert.title}
                </h4>
                <p className="mt-2 text-sm text-muted">{cert.issuer}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {cert.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide ${accent.tagBg} ${accent.tagText} ${accent.tagBorder}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {isFront && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-5 text-center text-[11px] text-muted/60"
                >
                  Tap to see the next one
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.button
        onClick={advance}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9, rotate: 180 }}
        aria-label="Show next certification"
        className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-purple-deep text-white shadow-lg"
      >
        <FiArrowRight size={18} />
      </motion.button>
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" data-smoke-theme="purple-gold" className="scroll-mt-[104px] py-[120px]">
      <div className="max-w-[1180px] mx-auto px-8">
        <SectionTitle index="03" label="Certifications">
          Credentials I've <span className="italic font-medium text-purple">earned</span> along the way.
        </SectionTitle>

        <CertificationStack certifications={certifications} frontTitle={certifications[0]?.title} />
      </div>
    </section>
  );
}