'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
} from 'framer-motion';
import Image from 'next/image';
import { portfolioData } from '@/lib/portfolio-data';
import { useRef, useState, useEffect } from 'react';

/* ── Scan line (sweeps on mount) ── */
function ScanLine() {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 600); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {go && (
        <motion.div
          key="scan"
          className="pointer-events-none absolute left-0 right-0 h-[2px] z-20"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.9) 40%, rgba(216,180,254,1) 50%, rgba(167,139,250,0.9) 60%, transparent)',
            boxShadow: '0 0 14px 4px rgba(139,92,246,0.5)',
          }}
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}

/* ── Image with tilt + spotlight ── */
function ProfileCard({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 22 });
  const sy = useSpring(my, { stiffness: 200, damping: 22 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-6deg', '6deg']);
  const [spotX, setSpotX] = useState('50%');
  const [spotY, setSpotY] = useState('50%');
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
        setSpotX(`${((e.clientX - r.left) / r.width) * 100}%`);
        setSpotY(`${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      className="relative w-full lg:w-80 flex-shrink-0"
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: hovered
            ? ['0 0 60px rgba(168,85,247,0.35)', '0 0 90px rgba(168,85,247,0.5)', '0 0 60px rgba(168,85,247,0.35)']
            : ['0 0 40px rgba(168,85,247,0.15)', '0 0 60px rgba(168,85,247,0.25)', '0 0 40px rgba(168,85,247,0.15)'],
        }}
        transition={{ duration: hovered ? 2 : 4, repeat: Infinity }}
      />

      {/* Slow orbit ring */}
      <motion.div
        className="absolute inset-[-14px] rounded-xl border border-purple-500/10 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ borderRadius: '16px' }}
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.9)]" />
      </motion.div>

      {/* Top accent sweep on hover */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 via-purple-400 to-transparent rounded-t-xl z-10 pointer-events-none"
        initial={{ width: 0 }}
        animate={hovered ? { width: '100%' } : { width: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Image */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/10">
        <Image src={src} alt={alt} fill className="object-cover" priority />
        <ScanLine />

        {/* Mouse spotlight overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at ${spotX} ${spotY}, rgba(139,92,246,0.15) 0%, transparent 65%)`,
          }}
        />

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Available badge */}
      <motion.div
        className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm"
        initial={{ opacity: 0, y: 8, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.45, ease: 'backOut' }}
      >
        <motion.span
          className="w-2 h-2 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="text-[10px] text-white/60 tracking-widest uppercase">Available for work</span>
      </motion.div>
    </motion.div>
  );
}

/* ── Animated stat card ── */
function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 * index + 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-lg overflow-hidden cursor-default"
    >
      {/* Shimmer border on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: 'inset 0 0 0 1px rgba(139,92,246,0.4), 0 0 24px rgba(139,92,246,0.12)' }}
      />

      {/* Top accent */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-transparent pointer-events-none"
        initial={{ width: 0 }}
        animate={hovered ? { width: '100%' } : { width: 0 }}
        transition={{ duration: 0.35 }}
      />

      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25 }}
        className="relative p-4 rounded-lg border border-white border-opacity-20 backdrop-blur-sm bg-white/[0.02]"
      >
        {/* Glow behind value */}
        <motion.div
          className="absolute inset-0 bg-purple-500 rounded-lg pointer-events-none"
          animate={hovered ? { opacity: 0.06 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="text-2xl font-bold text-purple-400 mb-1 relative"
          animate={hovered ? { textShadow: '0 0 20px rgba(168,85,247,0.7)' } : { textShadow: '0 0 0px rgba(168,85,247,0)' }}
          transition={{ duration: 0.3 }}
        >
          {value}
        </motion.div>
        <p className="text-xs uppercase tracking-widest text-white text-opacity-60 font-medium relative">
          {label}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ── Root ── */
export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start">

        {/* ── Profile image ── */}
        <ProfileCard src="/keya-photo.jpg" alt="Profile" />

        {/* ── Content ── */}
        <div className="flex-1 space-y-8">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              About Me
            </h2>
            {/* Animated underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: 40 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p
              className="text-base md:text-lg text-white text-opacity-80 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              {portfolioData.about.intro}
            </motion.p>
          </motion.div>

          {/* Bio with animated left border */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative pl-6 space-y-3"
          >
            {/* Animated border line */}
            <motion.div
              className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-purple-500 via-purple-500/50 to-transparent rounded-full"
              initial={{ height: 0 }}
              animate={inView ? { height: '100%' } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <p className="text-base text-white text-opacity-75 leading-relaxed">
              {portfolioData.about.bio}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: 'Projects', value: String(portfolioData.projects.length) },
              { label: 'Certifications', value: String(portfolioData.certifications.length) },
            ].map((stat, i) => (
              <StatCard key={i} value={stat.value} label={stat.label} index={i} />
            ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
