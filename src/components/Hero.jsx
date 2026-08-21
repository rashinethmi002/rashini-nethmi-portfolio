import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link as ScrollLink } from 'react-scroll';
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { typedRoles } from '../data/personal';
// NOTE: filename corrected to match your actual transparent cutout.
import profileImg from '../assets/images/profilepic.png';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } }),
};

// ---------------------------------------------------------------------------
// Background: constellation canvas. Now denser and more visible so it reads
// clearly behind the whole hero, not just a faint texture.
// ---------------------------------------------------------------------------
function Constellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr, points, raf;

    const themeColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--purple').trim() || '#6C4CF1';
    const hexToRgb = (hex) => {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
      const n = parseInt(hex, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = rect.width;
      h = rect.height;
      // Denser field than before (was /20000, min 28 max 60).
      const count = Math.max(45, Math.min(95, Math.round((w * h) / 13000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.5 + 0.9,
      }));
    }

    function frame() {
      const [pr, pg, pb] = hexToRgb(themeColor().length === 7 ? themeColor() : '#6C4CF1');
      ctx.clearRect(0, 0, w, h);
      for (const p of points) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(${pr},${pg},${pb},${(1 - dist / 150) * 0.5})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of points) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${pr},${pg},${pb},0.9)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) frame(); else { frame(); cancelAnimationFrame(raf); }

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // Much more visible now: opacity raised, and the mask is looser so
      // the constellation reaches the edges instead of fading out early.
      className="absolute inset-0 w-full h-full z-0 opacity-[.32] dark:opacity-70"
      style={{
        maskImage: 'radial-gradient(circle at 30% 45%, transparent 0%, black 92%)',
        WebkitMaskImage: 'radial-gradient(circle at 30% 45%, transparent 0%, black 92%)',
      }}
    />
  );
}

function AuroraWaves() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -inset-[10%] opacity-30 dark:opacity-55 blur-[80px] motion-safe:animate-[auraDrift_18s_ease-in-out_infinite]"
        style={{ background: 'conic-gradient(from 120deg at 30% 20%, var(--purple) 0deg, transparent 90deg, var(--gold) 200deg, transparent 300deg)' }}
      />
      <div
        className="absolute -inset-[10%] opacity-20 dark:opacity-35 blur-[100px] motion-safe:animate-[auraDrift_22s_ease-in-out_infinite_reverse]"
        style={{ background: 'radial-gradient(55% 40% at 78% 60%, var(--gold) 0%, transparent 70%)' }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Decorative art sitting directly behind the portrait. Richer / higher
// contrast than before: bigger blur fields, a second dashed orbit ring
// spinning the opposite way, and more twinkling star dots, so the photo
// has real presence behind it the way the reference image does.
// ---------------------------------------------------------------------------
function PhotoArt() {
  return (
    <div className="absolute -inset-[22%] -z-[1] pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 rounded-full blur-[55px] sm:blur-[78px] opacity-75 motion-safe:animate-[auraDrift_11s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(circle at 32% 28%, var(--purple) 0%, transparent 62%)' }}
      />
      <div
        className="absolute inset-0 rounded-full blur-[60px] sm:blur-[85px] opacity-55 motion-safe:animate-[auraDrift_15s_ease-in-out_infinite_reverse]"
        style={{ background: 'radial-gradient(circle at 72% 70%, var(--gold) 0%, transparent 58%)' }}
      />
      <div
        className="absolute inset-0 rounded-full blur-[70px] opacity-40 motion-safe:animate-[auraDrift_20s_ease-in-out_infinite]"
        style={{ background: 'conic-gradient(from 40deg, var(--purple) 0deg, transparent 100deg, var(--gold) 220deg, transparent 320deg)' }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-55" viewBox="0 0 200 240" fill="none" aria-hidden="true">
        <path d="M2 72C42 72 48 102 96 112" stroke="var(--purple)" strokeOpacity=".65" strokeWidth=".7" />
        <path d="M2 126C42 126 55 118 96 116" stroke="var(--purple)" strokeOpacity=".42" strokeWidth=".6" />
        <path d="M198 68C160 68 151 102 104 112" stroke="var(--purple)" strokeOpacity=".65" strokeWidth=".7" />
        <path d="M198 116C160 116 148 118 104 116" stroke="var(--gold)" strokeOpacity=".48" strokeWidth=".6" />
        <path d="M198 166C158 166 150 135 104 122" stroke="var(--purple)" strokeOpacity=".42" strokeWidth=".6" />
        <circle cx="2" cy="72" r="1.6" fill="var(--purple)" />
        <circle cx="2" cy="126" r="1.4" fill="var(--purple)" />
        <circle cx="198" cy="68" r="1.6" fill="var(--purple)" />
        <circle cx="198" cy="116" r="1.4" fill="var(--gold)" />
        <circle cx="198" cy="166" r="1.4" fill="var(--purple)" />
      </svg>

      <div className="absolute left-[8%] bottom-[5%] w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-purple/60 blur-[2px] opacity-80 motion-safe:animate-[auraDrift_9s_ease-in-out_infinite]" />
      <div className="absolute left-[24%] bottom-[1%] w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gold/55 blur-[3px] opacity-75 motion-safe:animate-[auraDrift_12s_ease-in-out_infinite_reverse]" />
      <div className="absolute right-[10%] bottom-[4%] w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gold/50 blur-[2px] opacity-80 motion-safe:animate-[auraDrift_10s_ease-in-out_infinite_reverse]" />
      <div className="absolute right-[27%] bottom-[0%] w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-purple/55 blur-[2px] opacity-70 motion-safe:animate-[auraDrift_13s_ease-in-out_infinite]" />

      {/* Two dashed orbit rings, spinning opposite directions. */}
      <svg className="absolute inset-0 w-full h-full motion-safe:animate-[spin_46s_linear_infinite] motion-reduce:hidden" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="95" stroke="var(--purple)" strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="1 7" />
        <circle cx="100" cy="100" r="80" stroke="var(--gold)" strokeOpacity="0.22" strokeWidth="0.6" strokeDasharray="0.5 9" />
      </svg>
      <svg className="absolute inset-0 w-full h-full motion-safe:animate-[spin_60s_linear_infinite_reverse] motion-reduce:hidden" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="88" stroke="var(--purple)" strokeOpacity="0.16" strokeWidth="0.5" strokeDasharray="0.5 10" />
      </svg>

      {/* Twinkling star-dot accents. */}
      {[
        { top: '5%', left: '15%', delay: 0 },
        { top: '18%', left: '90%', delay: 0.4 },
        { top: '40%', left: '4%', delay: 0.9 },
        { top: '78%', left: '8%', delay: 1.1 },
        { top: '92%', left: '80%', delay: 1.6 },
        { top: '60%', left: '95%', delay: 2.0 },
      ].map((d, i) => (
        <motion.span
          key={i}
          className="absolute w-[3px] h-[3px] rounded-full bg-gold motion-reduce:opacity-50"
          style={{ top: d.top, left: d.left }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.6, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Photo + connected role labels, as ONE unit. Labels are positioned as
// percentages of THIS container's own height, so they stay locked to the
// photo at every size. No badges on the photo itself anymore — just the
// art behind it (PhotoArt) and the image.
// ---------------------------------------------------------------------------
function ProfileWithRoles() {
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverCapable = window.matchMedia('(hover: hover)').matches;
    if (!stage || !img || reduced || !hoverCapable) return;

    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    };
    const onLeave = () => { img.style.transform = 'rotateY(0) rotateX(0)'; };

    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    return () => {
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Reuses your real typedRoles copy — no invented labels.
  const roles = (Array.isArray(typedRoles) ? typedRoles.filter((r) => typeof r === 'string') : []).slice(0, 4);
  const positions = ['13%', '37%', '61%', '85%'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-full"
    >
      <div
        ref={stageRef}
        className="relative w-[380px] sm:w-[460px] lg:w-[540px] xl:w-[600px] max-w-full"
        style={{ perspective: '1000px' }}
      >
        <PhotoArt />

        {!imgFailed ? (
          <img
            ref={imgRef}
            src={profileImg}
            alt="Rashini Nethmi"
            onError={() => setImgFailed(true)}
            className="relative z-[1] block w-full h-auto max-h-[68vh] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.45)] transition-transform duration-300"
            style={{ transformStyle: 'preserve-3d' }}
          />
        ) : (
          <div className="relative z-[1] aspect-[3/4] flex items-center justify-center">
            <span className="font-display italic text-[clamp(26px,8vw,72px)] text-purple">RN</span>
          </div>
        )}

        {/* Connector overlay — active from lg (1024px). `top: %` here is a
            percentage of THIS same box, i.e. the photo's own rendered
            height — that's what keeps it aligned. */}
        <div className="hidden lg:block absolute inset-0 z-[2] pointer-events-none">
          {roles.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-full flex items-center pointer-events-auto"
              style={{ top: positions[i], transform: 'translateY(-50%)' }}
            >
              <span
                className="w-7 xl:w-9 h-px"
                style={{ background: 'linear-gradient(90deg, var(--purple) 0%, transparent 100%)' }}
              />
              <span className="relative -ml-[1px] w-2 h-2 rounded-full shrink-0" style={{ background: i % 2 === 0 ? 'var(--purple)' : 'var(--gold)' }}>
                <motion.span
                  className="absolute inset-0 rounded-full motion-reduce:hidden"
                  style={{ boxShadow: `0 0 0 1px ${i % 2 === 0 ? 'var(--purple)' : 'var(--gold)'}` }}
                  animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.6, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: 1.4 + i * 0.2, ease: 'easeInOut' }}
                />
              </span>
              <span className="ml-2 xl:ml-2.5 text-[12.5px] xl:text-[13.5px] font-medium text-ink/90 whitespace-nowrap">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    // Bottom padding cut way down (was pb-14/pb-20) so the section ends
    // right where the About card starts, matching the reference image —
    // no dead air between the photo and the next section.
    <section id="top" data-smoke-theme="purple-gold" className="relative pt-[128px] sm:pt-[150px] pb-0 overflow-hidden">
      <AuroraWaves />
      <Constellation />
      {/* Glow blurs now sized/positioned to bleed past the bottom edge of
          the section instead of stopping short, so the purple/gold glow
          carries through into whatever section follows — same as the
          reference, where the tint doesn't just cut off behind the photo. */}
      <div className="absolute w-[520px] h-[520px] rounded-full blur-[90px] opacity-30 bg-purple -top-[180px] -right-[120px] pointer-events-none" />
      <div className="absolute w-[420px] h-[420px] rounded-full blur-[100px] opacity-20 bg-gold -bottom-[220px] -left-[120px] pointer-events-none" />
      <div className="absolute w-[460px] h-[460px] rounded-full blur-[110px] opacity-[.14] bg-purple -bottom-[260px] left-[30%] pointer-events-none" />

      <div className="relative z-[1] max-w-[1180px] mx-auto px-6 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-9 lg:gap-10 xl:gap-14">

          <div className="lg:max-w-[360px] xl:max-w-[400px] lg:pt-1 order-1 shrink-0">
            <motion.p
              variants={fadeUp} custom={0.1} initial="hidden" animate="show"
              className="flex items-center gap-2.5 font-mono text-[11px] sm:text-[12.5px] tracking-[.1em] sm:tracking-[.14em] uppercase text-purple"
            >
              <motion.span
                className="w-[6px] h-[6px] rounded-full bg-purple"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              IT Undergraduate — Aspiring Software Developer
            </motion.p>

            <motion.h1
              variants={fadeUp} custom={0.25} initial="hidden" animate="show"
              className="font-display font-medium leading-[1.02] tracking-tight text-[clamp(34px,9vw,68px)] mt-3"
            >
              Rashini<br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, var(--purple) 0%, var(--purple-deep) 60%, var(--gold) 130%)' }}
              >
                Nethmi
              </span>
            </motion.h1>

            <motion.div
              variants={fadeUp} custom={0.4} initial="hidden" animate="show"
              className="font-mono text-[clamp(13px,2vw,18px)] text-muted mt-3 h-[24px] flex items-center"
            >
              I build&nbsp;
              <TypeAnimation sequence={typedRoles} wrapper="span" speed={62} deletionSpeed={80} repeat={Infinity} cursor />
            </motion.div>

            <motion.p
              variants={fadeUp} custom={0.5} initial="hidden" animate="show"
              className="mt-3.5 text-[14.5px] sm:text-[15.5px] text-muted max-w-[360px]"
            >
              Building efficient, scalable web experiences.
            </motion.p>

            <motion.div
              variants={fadeUp} custom={0.6} initial="hidden" animate="show"
              className="mt-6 flex gap-3 flex-wrap"
            >
              <ScrollLink
                to="projects" smooth duration={500} offset={-84}
                className="group inline-flex items-center gap-2 rounded-full text-white text-sm font-semibold px-5 py-3 shadow-[0_10px_24px_-8px_rgba(108,76,241,0.55)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(212,175,90,0.45)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50"
                style={{ background: 'linear-gradient(90deg, var(--purple) 0%, var(--purple-deep) 100%)' }}
              >
                View Projects
                <FiArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </ScrollLink>

              <a
                href="/resume.pdf" download
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-sm font-semibold px-5 py-3 hover:border-purple hover:text-purple hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50"
              >
                Download CV
                <FiDownload size={15} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp} custom={0.7} initial="hidden" animate="show"
              className="mt-6 flex gap-3"
            >
              <a href="https://github.com/rashinethmi002" target="_blank" rel="noopener" aria-label="GitHub" className="w-[38px] h-[38px] rounded-full border border-border bg-surface/40 backdrop-blur-sm flex items-center justify-center text-muted hover:text-purple hover:border-purple hover:-translate-y-1 hover:shadow-[0_8px_18px_-8px_rgba(108,76,241,0.5)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50">
                <FiGithub size={16} />
              </a>
              <a href="https://www.linkedin.com/in/rashini-nethmi-80b6b4346/" target="_blank" rel="noopener" aria-label="LinkedIn" className="w-[38px] h-[38px] rounded-full border border-border bg-surface/40 backdrop-blur-sm flex items-center justify-center text-muted hover:text-purple hover:border-purple hover:-translate-y-1 hover:shadow-[0_8px_18px_-8px_rgba(108,76,241,0.5)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50">
                <FiLinkedin size={16} />
              </a>
              <a href="mailto:rashinethmi002@gmail.com" aria-label="Email" className="w-[38px] h-[38px] rounded-full border border-border bg-surface/40 backdrop-blur-sm flex items-center justify-center text-muted hover:text-purple hover:border-purple hover:-translate-y-1 hover:shadow-[0_8px_18px_-8px_rgba(108,76,241,0.5)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/50">
                <FiMail size={16} />
              </a>
            </motion.div>
          </div>

          {/* justify-start at every size now (was justify-center on mobile)
              so the photo sits close to the text column, left-shifted like
              the reference, instead of centering itself with empty space
              on either side. */}
          <div className="order-2 flex-1 flex justify-start lg:min-w-0 lg:-ml-24 xl:-ml-36">
            <ProfileWithRoles />
          </div>
        </div>
      </div>
    </section>
  );
}