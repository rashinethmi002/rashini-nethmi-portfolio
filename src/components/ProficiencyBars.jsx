import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

/**
 * Drop-in replacement for ProficiencyBars.
 * Pass your real data as `skills`, or edit the DEFAULT_SKILLS array below.
 * Shape: { name: string, value: number (0-100), accent?: 'purple' | 'gold' }
 */
const DEFAULT_SKILLS = [
  { name: 'React', value: 88, accent: 'purple' },
  { name: 'Node.js / Express', value: 82, accent: 'gold' },
  { name: 'MongoDB', value: 78, accent: 'purple' },
  { name: 'JavaScript', value: 90, accent: 'gold' },
  { name: 'Java / C#', value: 75, accent: 'purple' },
  { name: 'SQL (MySQL / PostgreSQL)', value: 70, accent: 'gold' },
];

function Bar({ name, value, accent, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v}%`);
  const dotLeft = useTransform(progress, (v) => `calc(${v}% - 3px)`);
  const [display, setDisplay] = useState(0);
  const [settled, setSettled] = useState(false);

  const delay = 0.15 * index;
  const fillDuration = 1.3;

  useEffect(() => {
    if (!inView) return undefined;

    setSettled(false);
    const unsub = progress.on('change', (v) => setDisplay(Math.round(v)));

    const controls = animate(progress, value, {
      duration: fillDuration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => setSettled(true),
    });

    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const isPurple = accent === 'purple';
  const trackFrom = isPurple ? '#6C4CF1' : '#C8933F';
  const trackTo = isPurple ? '#4A32B0' : '#6C4CF1';
  const dotColor = isPurple ? '#6C4CF1' : '#C8933F';

  return (
    <div ref={ref} className="py-3">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[13.5px] font-medium text-ink flex items-center gap-2">
          {name}
          {!settled && inView && (
            <motion.span
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              className="font-mono text-[9.5px] tracking-[.12em] uppercase"
              style={{ color: dotColor }}
            >
              processing
            </motion.span>
          )}
        </span>

        <span
          className="font-mono text-[13px] tabular-nums"
          style={{ color: dotColor }}
        >
          {display}%
        </span>
      </div>

      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(120, 120, 140, 0.14)' }}
      >
        {/* faint tick marks for a 'grid' / instrumentation feel */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(120,120,140,0.25) 0px, rgba(120,120,140,0.25) 1px, transparent 1px, transparent 10%)',
          }}
        />

        {/* fill */}
        <motion.div
          className="relative h-full rounded-full overflow-hidden"
          style={{
            width,
            background: `linear-gradient(90deg, ${trackFrom}, ${trackTo})`,
          }}
        >
          {/* scanning shimmer sweep, loops once the fill settles */}
          {settled && (
            <motion.div
              className="absolute top-0 bottom-0 w-1/3"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
              }}
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>

        {/* leading edge pulse while filling */}
        {!settled && inView && (
          <motion.div
            className="absolute top-1/2 w-1.5 h-1.5 rounded-full"
            style={{
              left: dotLeft,
              top: '50%',
              translateY: '-50%',
              background: dotColor,
              boxShadow: `0 0 0 4px ${dotColor}33`,
            }}
            animate={{ scale: [1, 1.6, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
    </div>
  );
}

export default function ProficiencyBars({ skills = DEFAULT_SKILLS }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
      {skills.map((skill, i) => (
        <Bar
          key={skill.name}
          name={skill.name}
          value={skill.value}
          accent={skill.accent ?? (i % 2 === 0 ? 'purple' : 'gold')}
          index={i}
        />
      ))}
    </div>
  );
}