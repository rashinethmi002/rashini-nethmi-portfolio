import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const points = [
  [12, 26], [28, 16], [43, 31], [61, 18], [79, 28], [91, 15],
  [20, 68], [39, 78], [56, 61], [73, 76], [88, 61],
];

const links = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 6], [1, 6], [1, 7], [2, 7], [2, 8], [3, 8],
  [3, 9], [4, 9], [4, 10], [5, 10], [6, 7], [7, 8], [8, 9], [9, 10],
];

function ConnectionField() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full opacity-45"
    >
      {links.map(([from, to]) => (
        <motion.line
          key={`${from}-${to}`}
          x1={points[from][0]}
          y1={points[from][1]}
          x2={points[to][0]}
          y2={points[to][1]}
          stroke="var(--purple)"
          strokeWidth="0.12"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.65 }}
          transition={{ duration: 1.2, delay: 0.15, ease: 'easeOut' }}
        />
      ))}
      {points.map(([x, y], index) => (
        <motion.circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={index % 3 === 0 ? 0.42 : 0.28}
          fill={index % 4 === 0 ? 'var(--gold)' : 'var(--purple)'}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.035 }}
        />
      ))}
    </svg>
  );
}

export default function PageIntro({ children }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1900);
    return () => window.clearTimeout(timer);
  }, []);

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
            aria-label="Rashini Nethmi portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[300] flex min-h-dvh items-center justify-center overflow-hidden bg-bg"
          >
            <ConnectionField />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(108,76,241,0.12),transparent_52%)] dark:bg-[radial-gradient(circle_at_center,rgba(164,136,255,0.13),transparent_52%)]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative px-6 text-center"
            >
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-gold sm:text-xs">
                Portfolio / 2026
              </p>
              <h1 className="font-display text-[clamp(1.5rem,6vw,4.2rem)] font-medium leading-none tracking-tight text-ink [text-shadow:0_0_30px_color-mix(in_srgb,var(--purple)_25%,transparent)]">
                RASHINI NETHMI
              </h1>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.65, ease: 'easeOut' }}
                className="mx-auto mt-6 h-px w-24 origin-center bg-gradient-to-r from-transparent via-purple to-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}