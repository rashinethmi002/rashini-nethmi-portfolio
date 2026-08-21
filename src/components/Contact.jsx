import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Button from './Button';
import { personal } from '../data/personal';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const infoCards = [
  { icon: FiMail, label: 'Email', value: personal.email, href: `mailto:${personal.email}`, accent: 'purple' },
  { icon: FiPhone, label: 'Phone', value: personal.phone, href: `tel:${personal.phone.replace(/\s/g, '')}`, accent: 'gold' },
  { icon: FiMapPin, label: 'Location', value: personal.location, href: `https://maps.google.com/?q=${encodeURIComponent(personal.location)}`, accent: 'purple' },
];

// small floating dots scattered across the section
const particles = [
  { top: '18%', left: '12%', size: 5, color: 'bg-purple', delay: 0 },
  { top: '70%', left: '8%', size: 4, color: 'bg-gold', delay: 0.8 },
  { top: '25%', left: '88%', size: 6, color: 'bg-gold', delay: 1.4 },
  { top: '78%', left: '85%', size: 4, color: 'bg-purple', delay: 0.4 },
  { top: '50%', left: '95%', size: 3, color: 'bg-purple', delay: 1.9 },
];

// constellation nodes, positioned in a 1000x500 viewBox coordinate space
const nodes = [
  { id: 'n1', x: 90, y: 80 },
  { id: 'n2', x: 210, y: 170 },
  { id: 'n3', x: 60, y: 260 },
  { id: 'n4', x: 180, y: 350 },
  { id: 'n5', x: 340, y: 90 },
  { id: 'n6', x: 900, y: 120 },
  { id: 'n7', x: 800, y: 250 },
  { id: 'n8', x: 940, y: 340 },
  { id: 'n9', x: 780, y: 400 },
  { id: 'n10', x: 660, y: 300 },
];

// hand-picked edges so it reads as a constellation, not a mess
const edges = [
  ['n1', 'n2'], ['n2', 'n3'], ['n2', 'n5'], ['n3', 'n4'], ['n4', 'n2'],
  ['n6', 'n7'], ['n7', 'n8'], ['n8', 'n9'], ['n9', 'n10'], ['n10', 'n7'],
];

function Constellation() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* connecting lines — soft, slowly breathing opacity */}
      {edges.map(([a, b], i) => {
        const na = nodes.find((n) => n.id === a);
        const nb = nodes.find((n) => n.id === b);
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="currentColor"
            className="text-purple"
            strokeWidth="1"
            initial={{ opacity: 0.08 }}
            animate={{ opacity: [0.08, 0.22, 0.08] }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.35,
            }}
          />
        );
      })}

      {/* nodes — gentle drift + twinkle, alternating purple/gold */}
      {nodes.map((n, i) => (
        <motion.circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={i % 3 === 0 ? 3.5 : 2.5}
          className={i % 2 === 0 ? 'fill-purple' : 'fill-gold'}
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            cx: [n.x, n.x + 6, n.x - 4, n.x],
            cy: [n.y, n.y - 5, n.y + 4, n.y],
          }}
          transition={{
            duration: 7 + (i % 5),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </svg>
  );
}

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setStatus('success');
        formRef.current.reset();
        setTimeout(() => setStatus('idle'), 4000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      });
  };

  return (
    <section id="contact" data-smoke-theme="purple-gold" className="relative py-[120px] overflow-hidden">
      {/* ambient color blobs — slowly drifting + breathing */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full blur-[110px] bg-purple -top-16 -left-32 pointer-events-none"
        animate={{
          opacity: [0.22, 0.34, 0.22],
          x: [0, 30, -10, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[340px] h-[340px] rounded-full blur-[110px] bg-gold -bottom-20 -right-16 pointer-events-none"
        animate={{
          opacity: [0.14, 0.26, 0.14],
          x: [0, -25, 10, 0],
          y: [0, 20, -15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* constellation layer — connected nodes on both sides */}
      <Constellation />

      {/* faint drifting particles for extra depth */}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full ${p.color} pointer-events-none`}
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, opacity: 0.5 }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      <div className="relative max-w-[1180px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[28px] px-6 py-16 sm:px-12 sm:py-[72px] text-center bg-surface/70 backdrop-blur-xl border border-border shadow-soft"
        >
          {/* faint theme-matching tint, not a solid fill */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(108,76,241,.10),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(200,147,63,.10),transparent_50%)] pointer-events-none" />

          <div className="relative">
            <p className="flex items-center justify-center gap-2.5 font-mono text-[12.5px] tracking-[.14em] uppercase text-purple mb-5">
              Get in touch
            </p>
            <h2 className="font-display font-medium text-[clamp(28px,4.5vw,44px)] leading-[1.05] text-ink">
              Let's build something<br />worth shipping.
            </h2>
            <p className="mt-4 text-muted text-[15.5px] max-w-md mx-auto">
              Available for software engineering internships — immediately. Based in Galle, open to remote or on-site work anywhere in Sri Lanka.
            </p>

            {/* colored info cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {infoCards.map(({ icon: Icon, label, value, href, accent }) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'Location' ? '_blank' : undefined}
                  rel={label === 'Location' ? 'noopener noreferrer' : undefined}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple hover:shadow-soft"
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      accent === 'gold'
                        ? 'bg-gold-soft text-gold group-hover:bg-gold group-hover:text-white'
                        : 'bg-purple-soft text-purple group-hover:bg-purple group-hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-muted font-mono">{label}</span>
                  <span className="text-[13px] font-semibold text-ink break-all">{value}</span>
                </a>
              ))}
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto flex flex-col gap-3.5 text-left">
              <input
                type="text"
                name="from_name"
                placeholder="Your name"
                required
                className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm text-ink placeholder-muted outline-none transition-all focus:border-purple focus:ring-2 focus:ring-purple/25"
              />
              <input
                type="email"
                name="from_email"
                placeholder="Your email"
                required
                className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm text-ink placeholder-muted outline-none transition-all focus:border-purple focus:ring-2 focus:ring-purple/25"
              />
              <textarea
                name="message"
                placeholder="What are you looking to build?"
                required
                rows={4}
                className="w-full rounded-xl bg-surface-2 border border-border px-4 py-3 text-sm text-ink placeholder-muted outline-none transition-all resize-none focus:border-purple focus:ring-2 focus:ring-purple/25"
              />

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-5 py-3.5 text-white bg-gradient-to-r from-purple to-purple-deep shadow-[0_14px_30px_-10px_rgba(108,76,241,0.5)] transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending…' : status === 'success' ? 'Sent ✓' : 'Send Message'}
              </motion.button>

              {status === 'error' && (
                <p className="text-sm text-red-500">Something went wrong — try again, or email me directly below.</p>
              )}
            </form>

            <div className="mt-8 flex justify-center gap-3.5 flex-wrap">
              <Button as="a" href={`mailto:${personal.email}`} variant="primary">
                Email Me
              </Button>
              <Button as="a" href={`tel:${personal.phone.replace(/\s/g, '')}`} variant="ghost">
                {personal.phone}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}