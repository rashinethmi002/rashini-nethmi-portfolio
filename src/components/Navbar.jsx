import { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiCode } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS, NAV_OFFSET, SCROLL_DOCK_THRESHOLD } from '../utils/constants';
import profileImg from '../assets/images/profile.jpg';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_DOCK_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] h-[84px] flex items-center backdrop-blur-md bg-bg/80 transition-colors duration-300 border-b ${
        scrolled ? 'border-border' : 'border-transparent'
      }`}
    >
      {/* Thin gradient hairline that fades in once docked — replaces the flat
          border with something that matches the purple/gold palette instead
          of a plain grey line. */}
      <div
        className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(90deg, transparent, var(--purple) 25%, var(--gold) 75%, transparent)' }}
      />

      <nav className="max-w-[1180px] w-full mx-auto px-8 flex items-center justify-between">
        <ScrollLink to="top" smooth duration={500} className="group flex items-center gap-3 font-display text-lg cursor-pointer">
          {/* Logo mark: gradient "code" glyph instead of static RN initials,
              with a soft ambient glow behind it like the reference brief. */}
          <span
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
              scrolled ? 'w-0 opacity-0 -mr-3 scale-75' : 'opacity-100 scale-100'
            }`}
          >
            <span
              className="absolute inset-0 rounded-xl"
              style={{ background: 'linear-gradient(135deg, var(--purple) 0%, var(--purple-deep) 55%, var(--gold) 130%)' }}
            />
            <span className="absolute -inset-1.5 rounded-xl blur-md opacity-60" style={{ background: 'linear-gradient(135deg, var(--purple), var(--gold))' }} />
            <FiCode size={17} strokeWidth={2.4} className="relative text-white transition-transform duration-500 group-hover:rotate-[8deg]" />
          </span>

          <AnimatePresence>
            {scrolled && (
              <motion.span
                initial={{ opacity: 0, scale: 0.4, x: -14 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.4, x: -14 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative w-[38px] h-[38px] rounded-full p-[2px] shadow"
                style={{ background: 'linear-gradient(135deg, var(--purple), var(--gold))' }}
              >
                <span className="block w-full h-full rounded-full overflow-hidden bg-bg">
                  <img src={profileImg} alt="Rashini Nethmi" className="w-full h-full object-cover" />
                </span>
              </motion.span>
            )}
          </AnimatePresence>

          <span className="hidden sm:inline">Rashini Nethmi</span>
        </ScrollLink>

        <div className="hidden md:flex gap-9 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <ScrollLink
              key={link.to}
              to={link.to}
              smooth
              duration={500}
              offset={NAV_OFFSET}
              spy
              activeClass="text-ink"
              className="relative text-muted hover:text-ink transition-colors cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-0 after:h-[1.5px] after:bg-purple hover:after:w-full after:transition-all"
            >
              {link.label}
            </ScrollLink>
          ))}
        </div>

        <div className="flex items-center gap-3.5">
          <ThemeToggle />
          <ScrollLink
            to="contact"
            smooth
            duration={500}
            offset={NAV_OFFSET}
            className="hidden md:inline-flex items-center gap-2 rounded-full text-white text-sm font-semibold px-5 py-3 shadow-[0_10px_24px_-8px_rgba(108,76,241,0.55)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(212,175,90,0.45)] transition-all cursor-pointer"
            style={{ background: 'linear-gradient(90deg, var(--purple) 0%, var(--purple-deep) 100%)' }}
          >
            Let's Talk
          </ScrollLink>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center"
          >
            {menuOpen ? <FiX size={17} /> : <FiMenu size={17} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-[84px] left-4 right-4 bg-surface border border-border rounded-2xl p-2.5 shadow-soft overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: 'linear-gradient(90deg, var(--purple), var(--gold))' }} />
            {NAV_LINKS.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth
                duration={500}
                offset={NAV_OFFSET}
                onClick={() => setMenuOpen(false)}
                className="block px-3.5 py-3 rounded-lg text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink cursor-pointer"
              >
                {link.label}
              </ScrollLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}