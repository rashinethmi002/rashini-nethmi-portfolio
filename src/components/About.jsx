import { motion } from 'framer-motion';
import { useState } from 'react';

// Lightweight local SVG icons — solid filled shapes only (no stroke).
// A stroke+fill mix can go invisible under a global CSS reset that zeroes
// out `stroke`, so these are drawn as pure filled paths that only ever
// depend on `fill="currentColor"`, which always inherits from the
// wrapping span's text-* class.
const LayersIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2 2 8l10 6 10-6-10-6Z" />
    <path d="M2 12l10 6 10-6-2.3-1.38L12 15.6 4.3 10.62 2 12Z" opacity="0.55" />
    <path d="M2 16l10 6 10-6-2.3-1.38L12 19.6 4.3 14.62 2 16Z" opacity="0.3" />
  </svg>
);

const ProjectsIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 6a2 2 0 0 1 2-2h4.4l2 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" />
  </svg>
);

const UniversityIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3Z" />
    <path d="M6 12.2V16c0 1.66 2.69 3 6 3s6-1.34 6-3v-3.8l-6 3.27-6-3.27Z" />
  </svg>
);

const PassionIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2c1.6 3 4.5 5 4.5 8.5a4.5 4.5 0 1 1-9 0c0-1 .3-1.8.8-2.5.4 1.4 1.4 2 2.2 1.6-.7-2.4.6-4.3 1.5-7.6Z" />
  </svg>
);

// Decorative quote mark drawn as a shape, replacing the plain "..." text
// characters entirely — the copy below no longer has any quote characters
// in it, so there's only ever one (nice) quote mark, not two competing ones.
const QuoteIcon = ({ size = 17, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 18v-4.8C3 8.8 5.4 5.7 10 4.5l1 2.4C7.9 8 6.7 9.9 6.5 12H11v6H3Z" />
    <path d="M13 18v-4.8c0-4.4 2.4-7.5 7-8.7l1 2.4c-3.1 1.1-4.3 3-4.5 5.1H21v6h-8Z" />
  </svg>
);

import SectionTitle from './SectionTitle';
import ProficiencyBars from './ProficiencyBars';
import { fadeUp, staggerContainer } from '../utils/motionVariants';
import { skillGroups } from '../data/skills';

const stats = [
  { icon: LayersIcon, value: '8+', label: 'Tech Stack', accent: 'purple' },
  { icon: ProjectsIcon, value: '4+', label: 'Projects', accent: 'sunset' },
  { icon: UniversityIcon, value: '2 Years', label: 'University', accent: 'purple' },
  { icon: PassionIcon, value: '100%', label: 'Passion', accent: 'sunset' },
];

function StatTiles() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="grid grid-cols-2 gap-5 mt-8"
    >
      {stats.map((stat) => {
        const isPurple = stat.accent === 'purple';
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className={`group relative flex items-center gap-3.5 bg-surface border border-border rounded-2xl px-5 py-4.5 overflow-hidden transition-all duration-300 ${
              isPurple
                ? 'hover:border-[#932191] hover:shadow-[0_20px_45px_-18px_rgba(147,33,145,0.3)]'
                : 'hover:border-[#FF653F]/70 hover:shadow-[0_20px_45px_-18px_rgba(255,101,63,0.3)]'
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${
                isPurple ? 'bg-[#932191]' : 'bg-gradient-to-r from-[#E17327] via-[#FF653F] to-[#AD3D6F]'
              }`}
            />

            <span className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <span
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${
                  isPurple
                    ? 'bg-[#932191]/10 text-[#932191] group-hover:bg-[#932191] group-hover:text-white'
                    : 'bg-gradient-to-br from-[#E17327]/15 to-[#AD3D6F]/15 text-[#AD3D6F] group-hover:from-[#E17327] group-hover:to-[#AD3D6F] group-hover:text-white'
                }`}
              >
                <Icon size={17} />
              </span>
            </span>

            <div>
              <p className="font-display text-lg font-bold text-ink leading-none">{stat.value}</p>
              <p className="text-[12px] text-muted mt-1.5">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function PhilosophyQuote() {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      className="relative mt-6 md:col-span-2 overflow-hidden rounded-2xl border border-[#E17327]/35 bg-surface-2 px-5 py-5 sm:px-7 sm:py-6 transition-shadow duration-300 hover:shadow-[0_16px_35px_-18px_rgba(225,115,39,0.22)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          background: 'linear-gradient(115deg, #E17327 0%, #AD3D6F 48%, #932191 100%)',
        }}
      />

      <div className="relative">
      <div className="flex items-center gap-2 mb-5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF653F]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E17327]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#932191]" />
      </div>

      <div className="font-mono text-[15px] leading-[1.8] sm:text-[18px] sm:leading-[1.75]">
        <p>
          <span className="text-[#E17327]">SELECT</span>{' '}
          <span className="text-[#FF653F]">*</span>{' '}
          <span className="text-[#E17327]">FROM</span>{' '}
          <span className="text-ink">mindset</span>
        </p>
        <p>
          <span className="text-[#E17327]">WHERE</span>{' '}
          <span className="text-ink">focus</span>{' '}
          <span className="text-[#AD3D6F]">=</span>{' '}
          <span className="text-[#932191]">'positive'</span>
        </p>
        <p>
          <span className="text-[#E17327]">AND</span>{' '}
          <span className="text-ink">distractions</span>{' '}
          <span className="text-[#AD3D6F]">=</span>{' '}
          <span className="text-[#932191]">'null'</span>;
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
        <QuoteIcon size={13} className="text-[#FF653F]" />
        <p className="font-mono text-[10px] tracking-[.14em] uppercase text-[#AD3D6F]">
          My Philosophy
        </p>
      </div>
      </div>
    </motion.div>
  );
}

function ProficiencyPanel() {
  const [replayKey, setReplayKey] = useState(0);
  const [justClicked, setJustClicked] = useState(false);

  function handleClick() {
    setReplayKey((k) => k + 1);
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 900);
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className="relative mt-12 w-full text-left bg-surface border border-border rounded-2xl px-7 py-9 sm:px-10 sm:py-10 overflow-hidden cursor-pointer transition-colors duration-300 hover:border-[#932191]/50 hover:shadow-[0_20px_45px_-18px_rgba(147,33,145,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#932191]/60"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#E17327] via-[#FF653F] to-[#932191]"
        initial={{ scaleX: 0 }}
        animate={justClicked ? { scaleX: [0, 1] } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ transformOrigin: 'left' }}
      />

      <div className="flex items-center justify-between mb-1.5">
          <p className="font-mono text-[11.5px] tracking-[.14em] uppercase text-[#AD3D6F]">
          Where I currently stand
        </p>
        <motion.span
          animate={justClicked ? { opacity: [0, 1, 0], rotate: 180 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="font-mono text-[10px] tracking-[.1em] uppercase text-pink-500"
        >
          recalculating
        </motion.span>
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-medium mb-8">Skill Proficiency</h3>
      <ProficiencyBars key={replayKey} />

      <p className="mt-6 font-mono text-[10px] tracking-[.08em] uppercase text-muted/70">
        Tap to re-run
      </p>
    </motion.button>
  );
}

export default function About() {
  return (
    <section id="about" data-smoke-theme="purple-gold" className="py-[120px]">
      <div className="max-w-[1180px] mx-auto px-8">
        <SectionTitle index="01" label="About">
          Building real things,<br />
          the <span className="italic font-medium text-purple">SDLC</span> way.
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-16 items-start">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={fadeUp} className="text-muted text-base leading-[1.85]">
              I'm doing my HND in IT at SLIATE, Dehiwala. Most of what I actually know came from
              breaking something and figuring out why, not from a lecture slide.
            </motion.p>
            <motion.p variants={fadeUp} className="text-muted text-base leading-[1.85] mt-4.5">
              Day to day I build with <strong className="text-ink">React, Node, Express, and MongoDB</strong>.
              Java and C# taught me how to actually structure code, and I've picked up JWT auth,
              REST APIs, and SQL (MySQL, PostgreSQL) along the way — mostly by needing them, not by
              studying them.
            </motion.p>
            <motion.p variants={fadeUp} className="text-muted text-base leading-[1.85] mt-4.5">
              I don't know everything, but I learn fast and I don't quit when something's hard.
              Looking for an internship where someone can point out what I'm doing wrong.
            </motion.p>

            <StatTiles />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {skillGroups.map((group, i) => {
                const accent = i % 2 === 0 ? 'purple' : 'sunset';
                const Icon = group.icon;
                return (
                  <motion.div
                    key={group.title}
                    variants={fadeUp}
                    className={`group relative bg-surface border border-border rounded-2xl px-[22px] pt-[22px] pb-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                      accent === 'purple'
                        ? 'hover:border-purple hover:shadow-[0_20px_45px_-18px_rgba(108,76,241,0.4)]'
                        : 'hover:border-pink-400/60 hover:shadow-[0_20px_45px_-18px_rgba(236,73,153,0.35)]'
                    }`}
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${
                        accent === 'purple' ? 'bg-gradient-to-r from-purple to-purple-deep' : 'bg-gradient-to-r from-orange-400 to-pink-500'
                      }`}
                    />

                    <div className="flex items-center gap-2.5 mb-3.5">
                      <span className="relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                        <span
                          className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${
                            accent === 'purple'
                              ? 'bg-[#932191]/10 text-[#932191]'
                              : 'bg-gradient-to-br from-[#E17327]/15 to-[#AD3D6F]/15 text-[#AD3D6F]'
                          }`}
                        >
                          <Icon size={15} />
                        </span>
                      </span>
                      <h4 className="text-[13px] tracking-[.06em] uppercase font-bold text-ink">
                        {group.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className={`text-[12.5px] px-3 py-1.5 rounded-full font-medium border transition-colors duration-300 ${
                            accent === 'purple'
                              ? 'bg-[#932191]/10 text-[#932191] border-transparent group-hover:bg-[#932191] group-hover:text-white'
                              : 'bg-transparent text-[#AD3D6F] border-[#FF653F]/40 group-hover:bg-gradient-to-r group-hover:from-[#E17327] group-hover:to-[#AD3D6F] group-hover:text-white group-hover:border-transparent'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </motion.div>

          <PhilosophyQuote />
        </div>

        <ProficiencyPanel />
      </div>
    </section>
  );
}