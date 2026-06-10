'use client';

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { portfolioData } from '@/lib/portfolio-data';

/* ── Floating particle behind each card ───────────────────────────────────── */
function OrbParticle({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 120,
        height: 120,
        background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
        filter: 'blur(24px)',
      }}
      animate={{
        x: [0, 30, -20, 10, 0],
        y: [0, -20, 30, -10, 0],
        scale: [1, 1.2, 0.9, 1.1, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── Shimmering scan-line overlay ─────────────────────────────────────────── */
function ScanLine() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      style={{ zIndex: 10 }}
    >
      <motion.div
        className="absolute w-full h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
        }}
        animate={{ top: ['-4px', '104%'] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      />
    </motion.div>
  );
}

/* ── Tilt card with magnetic hover ───────────────────────────────────────── */
function TiltCard({
  cert,
  index,
  accentColor,
  glowColor,
  icon,
}: {
  cert: { title: string; issuer: string; year: string | number };
  index: number;
  accentColor: string;
  glowColor: string;
  icon: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-60, 60], [12, -12]);
  const rotateY = useTransform(x, [-60, 60], [-12, 12]);

  const springRotX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
      className="relative"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: 'preserve-3d' }}
        className="relative cursor-pointer"
      >
        {/* ── Glow halo (behind card) ── */}
        <motion.div
          className="absolute -inset-4 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${glowColor}55, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* ── Card shell ── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 10, 18, 0.72)',
            backdropFilter: 'blur(28px) saturate(160%)',
            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
            border: `1px solid rgba(255,255,255,0.08)`,
            boxShadow: hovered
              ? `0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}55, inset 0 1px 0 rgba(255,255,255,0.12)`
              : '0 8px 24px rgba(0,0,0,0.35)',
            transition: 'box-shadow 0.35s ease',
          }}
        >
          <ScanLine />

          {/* ── Noise grain texture ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />

          {/* ── Accent stripe top ── */}
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${accentColor} 40%, ${glowColor} 60%, transparent 100%)`,
              opacity: hovered ? 1 : 0.4,
              transition: 'opacity 0.35s ease',
            }}
          />

          {/* ── Floating orb inside card ── */}
          <div className="absolute -top-6 -right-6 opacity-40">
            <OrbParticle color={accentColor} />
          </div>

          {/* ── Content ── */}
          <div className="relative p-7 space-y-5" style={{ transform: 'translateZ(12px)' }}>

            {/* Icon badge */}
            <motion.div
              animate={hovered ? { rotate: -8, scale: 1.15 } : { rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`,
                border: `1px solid ${accentColor}55`,
                boxShadow: hovered ? `0 0 24px ${accentColor}44` : 'none',
                transition: 'box-shadow 0.35s ease',
              }}
            >
              {icon}
            </motion.div>

            {/* Text */}
            <div className="space-y-1.5">
              <motion.h3
                animate={hovered ? { x: 5 } : { x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="text-[17px] font-semibold leading-snug"
                style={{
                  color: '#f0eeff',
                  letterSpacing: '-0.01em',
                  fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                }}
              >
                {cert.title}
              </motion.h3>
              <p
                className="text-sm font-medium"
                style={{
                  color: accentColor,
                  fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                  letterSpacing: '0.01em',
                }}
              >
                {cert.issuer}
              </p>
            </div>

            {/* Divider */}
            <motion.div
              className="h-[1px] w-full"
              style={{
                background: `linear-gradient(90deg, ${accentColor}33 0%, rgba(255,255,255,0.06) 100%)`,
              }}
              animate={{ scaleX: hovered ? 1 : 0.85, originX: 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}
              >
                Awarded
              </span>

              <motion.div
                className="flex items-center gap-2"
                animate={hovered ? { scale: 1.08 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {/* Year pill */}
                <span
                  className="px-3 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}28, ${accentColor}18)`,
                    border: `1px solid ${accentColor}44`,
                    color: accentColor,
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: '0.05em',
                  }}
                >
                  {cert.year}
                </span>

                {/* Arrow icon */}
                <motion.span
                  animate={hovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: accentColor, fontSize: 16 }}
                >
                  →
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Section header ───────────────────────────────────────────────────────── */
/* ── Accent palette per card index ───────────────────────────────────────── */
const ACCENTS = [
  { accent: '#a78bfa', glow: '#7c3aed', icon: '🎓' },
  { accent: '#34d399', glow: '#059669', icon: '🏅' },
  { accent: '#f472b6', glow: '#db2777', icon: '⭐' },
  { accent: '#60a5fa', glow: '#2563eb', icon: '🔖' },
  { accent: '#fbbf24', glow: '#d97706', icon: '🏆' },
  { accent: '#e879f9', glow: '#9333ea', icon: '💎' },
];

/* ── Main export ──────────────────────────────────────────────────────────── */
export default function CertificationsSection() {
  return (
    <div className="relative">
      {/* Global ambient glow */}
      <div
        className="absolute -inset-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {portfolioData.certifications.map((cert, index) => {
            const { accent, glow, icon } = ACCENTS[index % ACCENTS.length];
            return (
              <TiltCard
                key={index}
                cert={cert}
                index={index}
                accentColor={accent}
                glowColor={glow}
                icon={icon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
