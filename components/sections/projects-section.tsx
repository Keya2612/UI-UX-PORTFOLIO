'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
} from 'framer-motion';
import { portfolioData } from '@/lib/portfolio-data';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useCallback, useEffect } from 'react';

function normalizeProjectTitle(text: string) {
  return text
    .replace(/Quizzo.*Quiz App/, 'Quizzo Quiz Application')
    .replace(/Â·/g, '·');
}

function cleanDisplayText(text: string) {
  return text.replace(/Ã¢â‚¬â€œ/g, '-').replace(/Â·/g, '·');
}

/* ════════════════════════════════════════════════
   MOUSE-TRACKING SPOTLIGHT  (follows cursor inside card)
════════════════════════════════════════════════ */
function useMouseSpotlight(ref: React.RefObject<HTMLDivElement>) {
  const [pos, setPos] = useState({ x: '50%', y: '50%' });
  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({
        x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
        y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
      });
    },
    [ref]
  );
  return { pos, onMove };
}

/* ════════════════════════════════════════════════
   3-D TILT CARD
════════════════════════════════════════════════ */
function TiltCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28 });
  const sy = useSpring(my, { stiffness: 260, damping: 28 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-5deg', '5deg']);
  const { pos, onMove } = useMouseSpotlight(ref as React.RefObject<HTMLDivElement>);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
        onMove(e);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      className={className}
      data-spotlight-x={pos.x}
      data-spotlight-y={pos.y}
    >
      {/* pass spotlight coords via CSS var trick */}
      <div
        style={{ '--sx': pos.x, '--sy': pos.y } as React.CSSProperties}
        className="h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   SHIMMER BORDER  (animated gradient border)
════════════════════════════════════════════════ */
function ShimmerBorder() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
      transition={{ duration: 0.4 }}
      style={{
        background: 'transparent',
        padding: '1px',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          background:
            'linear-gradient(120deg, transparent 20%, rgba(139,92,246,0.6) 40%, rgba(192,132,252,0.8) 50%, rgba(139,92,246,0.6) 60%, transparent 80%)',
          backgroundSize: '200% 200%',
        }}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   PARTICLE BURST on hover enter
════════════════════════════════════════════════ */
const PARTICLES = Array.from({ length: 6 }, (_, i) => i);

function ParticleBurst({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active &&
        PARTICLES.map((i) => {
          const angle = (360 / PARTICLES.length) * i;
          const rad = (angle * Math.PI) / 180;
          const tx = Math.cos(rad) * 38;
          const ty = Math.sin(rad) * 28;
          return (
            <motion.span
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 block w-1 h-1 rounded-full bg-violet-400"
              initial={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
              animate={{ opacity: 0, x: `calc(-50% + ${tx}px)`, y: `calc(-50% + ${ty}px)`, scale: 0 }}
              exit={{}}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          );
        })}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════
   ANIMATED TAG
════════════════════════════════════════════════ */
function Tag({ label, i }: { label: string; i: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * i, duration: 0.3, ease: 'backOut' }}
      whileHover={{ scale: 1.06, borderColor: 'rgba(139,92,246,0.5)', color: 'rgba(255,255,255,0.85)' }}
      className="inline-flex items-center px-2.5 py-[3px] rounded-sm text-[10px] tracking-widest uppercase font-medium border border-white/[0.09] text-white/35 bg-white/[0.02] transition-colors cursor-default"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {label}
    </motion.span>
  );
}

/* ════════════════════════════════════════════════
   STAGGERED TEXT REVEAL  (word by word)
════════════════════════════════════════════════ */
function RevealTitle({ text, inView }: { text: string; inView: boolean }) {
  const words = normalizeProjectTitle(text).split(' ');
  return (
    <h3
      style={{ fontFamily: "'Syne', sans-serif" }}
      className="text-[1.3rem] md:text-[1.45rem] font-bold text-white leading-tight tracking-tight mb-3 flex flex-wrap gap-x-[0.32em]"
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {w}
        </motion.span>
      ))}
    </h3>
  );
}

/* ════════════════════════════════════════════════
   SCANNING LINE  (top sweep animation)
════════════════════════════════════════════════ */
function ScanLine({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none absolute left-0 right-0 h-[1.5px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(167,139,250,0.7) 40%, rgba(196,181,253,1) 50%, rgba(167,139,250,0.7) 60%, transparent)',
            boxShadow: '0 0 12px 3px rgba(139,92,246,0.4)',
          }}
          initial={{ top: '-2px', opacity: 0 }}
          animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════
   SINGLE PROJECT CARD
════════════════════════════════════════════════ */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof portfolioData.projects)[number];
  index: number;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);
  const [scanKey, setScanKey] = useState(0);

  const handleEnter = () => {
    setHovered(true);
    setScanKey((k) => k + 1);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard
        onClick={() => router.push(`/projects/${project.id}`)}
        className="group cursor-pointer"
      >
        {/* ── Card shell ── */}
        <div
          onMouseEnter={handleEnter}
          onMouseLeave={() => setHovered(false)}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0e] transition-colors duration-500 group-hover:border-white/[0.12]"
        >

          {/* Radial mouse spotlight */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `radial-gradient(480px circle at var(--sx,50%) var(--sy,50%), rgba(124,58,237,0.11), transparent 65%)`,
            }}
          />

          {/* Animated scan line on enter */}
          <ScanLine active={hovered} key={scanKey} />

          {/* Shimmer border */}
          <ShimmerBorder />

          {/* Particle burst */}
          <div className="absolute top-1/2 left-1/2">
            <ParticleBurst active={hovered} />
          </div>

          {/* ── Content ── */}
          <div className="relative flex items-start gap-5 px-6 md:px-8 py-6 md:py-7">

            {/* Index column */}
            <div className="hidden md:flex flex-col items-center gap-2 pt-0.5 select-none">
              <motion.span
                animate={hovered ? { color: 'rgba(167,139,250,0.7)' } : { color: 'rgba(255,255,255,0.18)' }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.15em' }}
              >
                {String(index + 1).padStart(2, '0')}
              </motion.span>
              <motion.div
                className="w-px bg-gradient-to-b from-violet-500/40 to-transparent origin-top"
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.7, delay: index * 0.1 + 0.3 }}
                style={{ height: 44 }}
              />
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">

              {/* Meta */}
              <motion.div
                className="flex items-center gap-2 mb-2.5 overflow-hidden"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 + 0.2 }}
              >
                <span
                  style={{ fontFamily: "'DM Mono', monospace" }}
                  className="text-[10px] text-violet-400/60 tracking-[0.18em] uppercase"
                >
                  {project.category}
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
                <span
                  style={{ fontFamily: "'DM Mono', monospace" }}
                  className="text-[10px] text-white/20 tracking-widest"
                >
                  {project.year}
                </span>
              </motion.div>

              {/* Title (word-by-word) */}
              <RevealTitle text={project.title} inView={inView} />

              {/* Description */}
              <motion.p
                className="text-[13px] text-white/40 leading-[1.75] mb-4 max-w-lg"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 + 0.35 }}
              >
                {project.description}
              </motion.p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, ti) => (
                  <Tag key={tag} label={tag} i={ti} />
                ))}
              </div>
            </div>

            {/* Arrow button */}
            <motion.div
              className="flex-shrink-0 mt-0.5"
              initial={{ opacity: 0 }}
              animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                className="w-9 h-9 rounded-full border border-violet-500/30 bg-violet-500/10 flex items-center justify-center"
                style={{ boxShadow: '0 0 18px rgba(139,92,246,0.25)' }}
              >
                <ArrowUpRight className="w-4 h-4 text-violet-300" />
              </motion.div>
            </motion.div>

          </div>

          {/* Glowing bottom edge on hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            animate={
              hovered
                ? { opacity: 1, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5) 50%, transparent)' }
                : { opacity: 0 }
            }
            transition={{ duration: 0.4 }}
          />
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   ROOT EXPORT
════════════════════════════════════════════════ */
export default function ProjectsSection() {
  return (
    <>

      <div className="relative space-y-4">
        {portfolioData.projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
