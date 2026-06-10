'use client';

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { portfolioData } from '@/lib/portfolio-data';
import { useRef, useState } from 'react';

/* ── Map skill names → lucide icon names (rendered as SVG inline) ── */
const SKILL_ICONS: Record<string, React.ReactNode> = {
  // Design
  'Wireframing':    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h18M3 10h18M3 15h10M3 20h6" />,
  'Prototyping':    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2a4 4 0 014 4v1h1a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1V6a4 4 0 014-4zm0 2a2 2 0 00-2 2v1h4V6a2 2 0 00-2-2z" />,
  'UI/UX Design':   <><rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={1.5} stroke="currentColor" fill="none"/><path strokeLinecap="round" strokeWidth={1.5} d="M8 21h8M12 17v4" /></>,
  'User Research':  <><circle cx="12" cy="8" r="4" strokeWidth={1.5} stroke="currentColor" fill="none"/><path strokeLinecap="round" strokeWidth={1.5} d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" /></>,
  // Frontend
  'HTML':           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4l1.5 16L12 22l6.5-2L20 4H4zm4 4h8l-.5 5H8.5l.25 3 3.25.75 3.25-.75.25-2h2l-.5 4-5 1.5-5-1.5-.5-5.5" />,
  'CSS':            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4l1.5 16L12 22l6.5-2L20 4H4zm4 6h8l-.25 3H9l.25 2.5 2.75.75 2.75-.75.25-2h2l-.5 3.5-4.5 1.25L7.5 16" />,
  'JavaScript':     <><rect x="2" y="2" width="20" height="20" rx="3" strokeWidth={1.5} stroke="currentColor" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17c0 1.5-1 2-2 2s-2-1-2-2m8-5v3c0 1.5-.5 2-1.5 2S13 17 13 16" /></>,
  'React':          <><circle cx="12" cy="12" r="2" strokeWidth={1.5} stroke="currentColor" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="4" strokeWidth={1.5} stroke="currentColor" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="4" strokeWidth={1.5} stroke="currentColor" fill="none" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" strokeWidth={1.5} stroke="currentColor" fill="none" transform="rotate(120 12 12)"/></>,
  'Tailwind CSS':   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6C9 6 7.5 7.5 7 10c1-1.5 2-2 3.5-1.5C11.3 8.8 12 9.7 12.8 10.5 14 11.8 15.3 13 18 13c3 0 4.5-1.5 5-4-1 1.5-2 2-3.5 1.5C18.7 10.2 18 9.3 17.2 8.5 16 7.2 14.7 6 12 6zm-6 7c-3 0-4.5 1.5-5 4 1-1.5 2-2 3.5-1.5.8.3 1.5 1.2 2.3 2C8 18.8 9.3 20 12 20c3 0 4.5-1.5 5-4-1 1.5-2 2-3.5 1.5-.8-.3-1.5-1.2-2.3-2C10 13.2 8.7 12 6 13z" />,
  'Bootstrap':      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 4h7a4 4 0 014 4 3.5 3.5 0 01-2 3.2A4 4 0 0117 15a4 4 0 01-4 4H6V4zm2 7h5a2 2 0 000-4H8v4zm0 6h5.5a2 2 0 000-4H8v4z" />,
  // Fallback
  'default':        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />,
};

function SkillIcon({ name }: { name: string }) {
  const icon = SKILL_ICONS[name] || SKILL_ICONS['default'];
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      {icon}
    </svg>
  );
}

/* ════════════ ANIMATED PROGRESS BAR ════════════ */
function ProficiencyBar({ value, delay }: { value: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="relative w-full h-[3px] bg-white/[0.06] rounded-full">
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)' }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : {}}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Glowing tip */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-400"
        style={{ boxShadow: '0 0 8px 3px rgba(168,85,247,0.7)' }}
        initial={{ left: '0%', opacity: 0 }}
        animate={inView ? { left: `${value}%`, opacity: 1 } : {}}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ════════════ SKILL CARD ════════════ */
function SkillCard({ skill, index }: { skill: typeof portfolioData.otherSkills[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [hovered, setHovered] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 22 });
  const sy = useSpring(my, { stiffness: 220, damping: 22 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-5deg', '5deg']);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.045, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 600 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); setHovered(false); }}
      onMouseEnter={() => { setHovered(true); setScanKey(k => k + 1); }}
      className="relative group cursor-default"
    >
      <div
        className="relative overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.025] p-4 flex flex-col items-center gap-3 text-center transition-all duration-300"
        style={{ borderColor: hovered ? 'rgba(168,85,247,0.5)' : undefined }}
      >
        {/* Scan line */}
        <AnimatePresence>
          {scanKey > 0 && (
            <motion.div
              key={scanKey}
              className="pointer-events-none absolute left-0 right-0 h-[1.5px] z-20"
              style={{
                background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.85) 40%,rgba(216,180,254,1) 50%,rgba(167,139,250,0.85) 60%,transparent)',
                boxShadow: '0 0 10px 3px rgba(139,92,246,0.4)',
              }}
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
              exit={{}}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

        {/* Top accent */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-transparent pointer-events-none"
          initial={{ width: 0 }}
          animate={hovered ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* Radial glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          animate={hovered ? { background: 'radial-gradient(circle at 50% 40%, rgba(139,92,246,0.13), transparent 70%)', opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10 text-white/50 group-hover:text-purple-400 transition-colors duration-300"
          animate={hovered ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'backOut' }}
        >
          <SkillIcon name={skill.name} />
        </motion.div>

        <div className="relative z-10">
          <p className="text-[9px] text-white/30 uppercase tracking-[0.18em] mb-1">{skill.category}</p>
          <p className="text-xs font-medium text-white/75 group-hover:text-white transition-colors duration-200">{skill.name}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════ DESIGN TOOL CARD ════════════ */
function DesignToolCard({ tool }: { tool: typeof portfolioData.designTools[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="flex flex-col items-center gap-3 px-5 min-w-max cursor-default"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-black overflow-hidden flex items-center justify-center border-2 transition-all duration-300"
        style={{ borderColor: hovered ? `${tool.color}90` : 'rgba(255,255,255,0.1)' }}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="scan"
              className="pointer-events-none absolute left-0 right-0 h-[1.5px] z-20"
              style={{
                background: `linear-gradient(90deg,transparent,${tool.color}cc 50%,transparent)`,
                boxShadow: `0 0 8px 3px ${tool.color}80`,
              }}
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
              exit={{}}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>
        <motion.div
          className="absolute inset-0"
          animate={hovered ? { background: `radial-gradient(circle, ${tool.color}20, transparent 70%)` } : { background: 'transparent' }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10 text-xl font-bold" style={{ color: tool.color }}>{tool.logo}</span>
      </div>
      <motion.p
        className="text-xs font-medium whitespace-nowrap transition-colors duration-200"
        animate={hovered ? { color: 'rgba(255,255,255,0.95)' } : { color: 'rgba(255,255,255,0.45)' }}
      >
        {tool.name}
      </motion.p>
    </motion.div>
  );
}

/* ════════════ SECTION LABEL ════════════ */
function SectionLabel({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex items-center gap-3">
      <motion.div className="h-px bg-gradient-to-r from-purple-500 to-transparent"
        initial={{ width: 0 }} animate={inView ? { width: 28 } : {}}
        transition={{ duration: 0.5 }}
      />
      <p className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.22em]">{text}</p>
    </div>
  );
}

/* ════════════ ROOT ════════════ */
export default function SkillsSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-14">

      {/* Title */}
      <div ref={titleRef} className="space-y-3">
        <motion.h3 className="text-3xl md:text-4xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }} animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >Skills & Tools</motion.h3>
        <motion.div className="h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full"
          initial={{ width: 0 }} animate={titleInView ? { width: 48 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Design Tools */}
      <div className="space-y-5">
        <SectionLabel text="Design Tools" />
        <div className="scroll-container">
          <div className="scroll-content">
            {[...portfolioData.designTools, ...portfolioData.designTools].map((tool, i) => (
              <DesignToolCard key={`${tool.name}-${i}`} tool={tool} />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <motion.div className="h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.2) 40%,rgba(168,85,247,0.2) 60%,transparent)' }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}
      />

      {/* Professional Skills */}
      <div className="space-y-6">
        <SectionLabel text="Professional Skills" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {portfolioData.otherSkills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <motion.div className="h-px"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.2) 40%,rgba(168,85,247,0.2) 60%,transparent)' }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}
      />

      {/* Proficiency */}
      <div className="space-y-8">
        <SectionLabel text="Proficiency Levels" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          {portfolioData.skills.map((group, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div key={group.category} ref={ref}
                initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }} className="space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h5 className="text-sm font-semibold text-white/80">{group.category}</h5>
                  <motion.span className="text-xs font-semibold tabular-nums text-purple-300/80"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: i * 0.08 + 0.95 }}
                  >{group.proficiency}%</motion.span>
                </div>
                <ProficiencyBar value={group.proficiency} delay={i * 0.08 + 0.15} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}