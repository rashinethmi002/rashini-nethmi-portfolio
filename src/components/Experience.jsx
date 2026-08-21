import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { fadeUp, staggerContainer } from '../utils/motionVariants';
import { experience } from '../data/experience';

export default function Experience() {
  return (
    <section id="experience" data-smoke-theme="purple-gold" className="py-[120px] bg-bg-alt">
      <div className="max-w-[1180px] mx-auto px-8">
        <SectionTitle index="02" label="Journey">
          Where I've <span className="italic font-medium text-purple">learned</span> and built.
        </SectionTitle>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="border-l-[1.5px] border-border ml-1.5"
        >
          {experience.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative pl-[34px] pb-[46px] last:pb-0"
            >
              <span className="absolute -left-[6.5px] top-1 w-[11px] h-[11px] rounded-full bg-purple shadow-[0_0_0_5px_var(--purple-soft)]" />
              <div className="font-mono text-xs text-gold tracking-wide mb-1.5">{item.year}</div>
              <h3 className="text-xl font-semibold font-display">{item.title}</h3>
              <div className="text-purple font-semibold text-sm mt-1">{item.org}</div>
              <p className="text-muted mt-2.5 text-[15px] leading-[1.7] max-w-[590px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}