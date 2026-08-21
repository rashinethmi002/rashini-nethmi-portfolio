import { motion } from 'framer-motion';
import { fadeUp } from '../utils/motionVariants';

/**
 * index    - "01", "02" etc (pass null to skip the numbering)
 * label    - eyebrow text, e.g. "About"
 * children - the heading content, can include a styled span for emphasis
 */
export default function SectionTitle({ index, label, children }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="max-w-[640px] mb-14"
    >
      <p className="flex items-center gap-2.5 font-mono text-[12.5px] tracking-[.14em] uppercase text-purple mb-5 before:content-[''] before:w-[22px] before:h-[1.5px] before:bg-purple">
        {index ? `${index} — ${label}` : label}
      </p>
      <h2 className="font-display font-medium leading-[1.05] tracking-tight text-[clamp(30px,4vw,44px)]">
        {children}
      </h2>
    </motion.div>
  );
}