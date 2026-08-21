import { useEffect, useRef } from 'react';

const CONFIG = {
  particleLifespan: 60,
  spawnPerMove: 2,
  baseSize: 18,
  growth: 0.6,
  driftX: 0.4,
  driftY: -0.6,
  maxParticles: 300,
};

export const SMOKE_THEMES = {
  'purple-gold': ['108,76,241', '200,147,63'],
  gold: ['200,147,63', '230,180,90'],
  purple: ['108,76,241', '150,110,255'],
  default: ['108,76,241', '200,147,63'],
};

export default function SmokeCursor() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const posRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  const rafRef = useRef(null);
  const colorsRef = useRef(SMOKE_THEMES.default);

  // Track which section is in view and update the active color palette
  useEffect(() => {
    const sections = document.querySelectorAll('[data-smoke-theme]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const theme = visible.target.dataset.smokeTheme;
          colorsRef.current = SMOKE_THEMES[theme] || SMOKE_THEMES.default;
        }
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Canvas + particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticle = (x, y) => {
      const palette = colorsRef.current;
      const color = palette[Math.floor(Math.random() * palette.length)];

      if (particlesRef.current.length > CONFIG.maxParticles) {
        particlesRef.current.shift();
      }

      particlesRef.current.push({
        x,
        y,
        size: CONFIG.baseSize * (0.6 + Math.random() * 0.6),
        life: 0,
        maxLife: CONFIG.particleLifespan * (0.7 + Math.random() * 0.6),
        vx: (Math.random() - 0.5) * CONFIG.driftX,
        vy: CONFIG.driftY * (0.5 + Math.random() * 0.8),
        color,
      });
    };

    const spawnAlongPath = (x, y) => {
      const dist = Math.hypot(x - posRef.current.lastX, y - posRef.current.lastY);
      const steps = Math.min(Math.max(Math.floor(dist / 8), 1), 6);
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        spawnParticle(
          posRef.current.lastX + (x - posRef.current.lastX) * t,
          posRef.current.lastY + (y - posRef.current.lastY) * t
        );
      }
      posRef.current = { x, y, lastX: x, lastY: y };
    };

    // Desktop mouse
    const handleMouseMove = (e) => spawnAlongPath(e.clientX, e.clientY);

    // Mobile touch
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      posRef.current = { x: touch.clientX, y: touch.clientY, lastX: touch.clientX, lastY: touch.clientY };
      spawnParticle(touch.clientX, touch.clientY);
    };
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      spawnAlongPath(touch.clientX, touch.clientY);
    };

    // Scroll puff (uses last known pointer position)
    const handleScroll = () => {
      spawnParticle(posRef.current.x, posRef.current.y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.size += CONFIG.growth;

        const progress = p.life / p.maxLife;
        const opacity = Math.max(0, 0.35 * (1 - progress));
        if (progress >= 1) return false;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(${p.color}, ${opacity})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen"
    />
  );
}