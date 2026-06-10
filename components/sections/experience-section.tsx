'use client';

import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { portfolioData } from '@/lib/portfolio-data';
import { useRef, useState } from 'react';

/* ════════════ PARTICLE BURST ════════════ */
const BURST = Array.from({ length: 8 }, (_, i) => i);
function ParticleBurst({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && BURST.map((i) => {
        const angle = (360 / BURST.length) * i;
        const r = (angle * Math.PI) / 180;
        const tx = Math.cos(r) * 22;
        const ty = Math.sin(r) * 22;
        return (
          <motion.span
            key={i}
            className="pointer-events-none absolute block rounded-full bg-purple-400"
            style={{ width: 4, height: 4, left: '50%', top: '50%' }}
            initial={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
            animate={{ opacity: 0, x: `calc(-50% + ${tx}px)`, y: `calc(-50% + ${ty}px)`, scale: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        );
      })}
    </AnimatePresence>
  );
}

/* ════════════ DOT ════════════ */
function TimelineDot({ inView, hovered, index }: { inView: boolean; hovered: boolean; index: number }) {
  const [burst, setBurst] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.1 + 0.15, type: 'spring', stiffness: 300, damping: 18 }}
      className="absolute left-0 md:left-3 top-2 z-10"
      onAnimationComplete={() => setBurst(true)}
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Ripple */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="ripple"
              className="absolute inset-0 rounded-full border-2 border-purple-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Outer ring */}
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-purple-500 bg-black flex items-center justify-center"
          animate={hovered
            ? { boxShadow: '0 0 20px rgba(168,85,247,0.7), 0 0 40px rgba(168,85,247,0.3)' }
            : { boxShadow: '0 0 0px rgba(168,85,247,0)' }}
          transition={{ duration: 0.3 }}
        >
          {/* Inner dot */}
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-purple-500"
            animate={hovered ? { scale: 1.4 } : { scale: 1 }}
            transition={{ duration: 0.25 }}
          />
        </motion.div>

        {/* Entry particle burst */}
        <ParticleBurst active={burst} />
      </div>
    </motion.div>
  );
}

/* ════════════ CARD ════════════ */
function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof portfolioData.experience)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState(false);
  const [scanKey, setScanKey] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 25 });
  const sy = useSpring(my, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['3deg', '-3deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-3deg', '3deg']);
  const [spotX, setSpotX] = useState('50%');
  const [spotY, setSpotY] = useState('50%');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-24 md:pl-32"
    >
      <TimelineDot inView={inView} hovered={hovered} index={index} />

      {/* 3D tilt wrapper */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
          setSpotX(`${((e.clientX - r.left) / r.width) * 100}%`);
          setSpotY(`${((e.clientY - r.top) / r.height) * 100}%`);
        }}
        onMouseLeave={() => { mx.set(0); my.set(0); setHovered(false); }}
        onMouseEnter={() => { setHovered(true); setScanKey(k => k + 1); }}
      >
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-300"
          style={{ borderColor: hovered ? 'rgba(168,85,247,0.5)' : undefined }}
        >
          {/* Mouse spotlight */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(380px circle at ${spotX} ${spotY}, rgba(139,92,246,0.1), transparent 65%)`,
            }}
          />

          {/* Scan line */}
          <AnimatePresence>
            {scanKey > 0 && (
              <motion.div
                key={scanKey}
                className="pointer-events-none absolute left-0 right-0 h-[1.5px] z-20"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.85) 40%, rgba(216,180,254,1) 50%, rgba(167,139,250,0.85) 60%, transparent)',
                  boxShadow: '0 0 10px 3px rgba(139,92,246,0.4)',
                }}
                initial={{ top: 0, opacity: 0 }}
                animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                exit={{}}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>

          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 via-purple-400 to-transparent pointer-events-none"
            initial={{ width: 0 }}
            animate={hovered ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Left accent bar — glows on hover */}
          <motion.div
            className="absolute left-0 top-0 w-[3px] rounded-r-full"
            animate={hovered
              ? { height: '100%', background: 'linear-gradient(to bottom, #a855f7, #7c3aed, transparent)', boxShadow: '2px 0 16px rgba(168,85,247,0.5)' }
              : { height: '40%', background: 'linear-gradient(to bottom, rgba(168,85,247,0.4), transparent)', boxShadow: 'none' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Bottom glow edge */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            animate={hovered
              ? { opacity: 1, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.45) 50%, transparent)' }
              : { opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          {/* Content */}
          <div className="relative pl-5 pr-5 py-5 space-y-3">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
              <div>
                <motion.h3
                  className="text-lg md:text-xl font-bold text-white"
                  animate={hovered ? { x: 5 } : { x: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {exp.role}
                </motion.h3>
                <motion.p
                  className="text-sm text-purple-400 mt-0.5"
                  animate={hovered
                    ? { textShadow: '0 0 18px rgba(168,85,247,0.7)' }
                    : { textShadow: '0 0 0px rgba(168,85,247,0)' }}
                  transition={{ duration: 0.3 }}
                >
                  {exp.company}
                </motion.p>
              </div>

              <motion.span
                className="self-start text-[11px] px-3 py-1.5 rounded-full font-semibold border whitespace-nowrap tracking-wide"
                style={{ fontVariantNumeric: 'tabular-nums' }}
                animate={hovered
                  ? { borderColor: 'rgba(168,85,247,0.9)', backgroundColor: 'rgba(168,85,247,0.25)', color: 'rgba(255,255,255,1)', boxShadow: '0 0 16px rgba(139,92,246,0.35)' }
                  : { borderColor: 'rgba(168,85,247,0.5)', backgroundColor: 'rgba(168,85,247,0.12)', color: 'rgba(255,255,255,0.9)' }}
                transition={{ duration: 0.3 }}
              >
                {exp.duration.replace(/â€"/g, '–').replace(/–/g, ' – ')}
              </motion.span>
            </div>

            <p className="text-xs text-white/40 uppercase tracking-widest">
              📍 {exp.location}
            </p>

            <p className="text-sm text-white/70 leading-relaxed">
              {exp.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════ ROOT ════════════ */
export default function ExperienceSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-0"
    >
      <div className="relative" ref={lineRef}>

        {/* Timeline line draws itself down */}
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-purple-500 via-purple-500/40 to-transparent"
            initial={{ height: 0 }}
            animate={lineInView ? { height: '100%' } : {}}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />
        </div>

        {/* Glowing orb travels the line on load */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            left: 'calc(2rem - 4px)',
            width: 10,
            height: 10,
            background: 'rgba(168,85,247,1)',
            boxShadow: '0 0 16px 5px rgba(168,85,247,0.65)',
            zIndex: 5,
          }}
          initial={{ top: 0, opacity: 0 }}
          animate={lineInView
            ? { top: '100%', opacity: [0, 1, 1, 0] }
            : {}}
          transition={{ duration: 1.3, ease: 'easeInOut', delay: 0.1 }}
        />

        <div className="space-y-8">
          {portfolioData.experience.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}