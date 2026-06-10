'use client';

import Image from 'next/image';
import { Download, MessageCircle, ArrowDown } from 'lucide-react';
import { portfolioData } from '@/lib/portfolio-data';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

/* ── Magnetic button ── */
function MagBtn({ children, className, href, onClick, download }: {
  children: React.ReactNode; className?: string;
  href?: string; onClick?: () => void; download?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx,{stiffness:180,damping:18});
  const sy = useSpring(my,{stiffness:180,damping:18});
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX-r.left-r.width/2)*0.28);
    my.set((e.clientY-r.top-r.height/2)*0.28);
  };
  const Tag = href ? motion.a : motion.button;
  return (
    <Tag ref={ref as any} href={href} onClick={onClick}
      download={href ? download : undefined}
      style={{ x:sx, y:sy }} onMouseMove={onMove}
      onMouseLeave={()=>{mx.set(0);my.set(0);}}
      whileTap={{scale:.96}}
      className={className}>
      {children}
    </Tag>
  );
}

/* ── Profile image ── */
function ProfileImage({ src, name }: { src: string; name: string }) {
  const [scanned, setScanned] = useState(false);
  useEffect(()=>{ const t = setTimeout(()=>setScanned(true),900); return ()=>clearTimeout(t); },[]);

  return (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-[360px] md:h-[360px]">

      {/* Outermost orbit ring with dot */}
      <motion.div className="absolute inset-[-24px] rounded-full border border-purple-500/[.12] pointer-events-none"
        animate={{rotate:360}} transition={{duration:28,repeat:Infinity,ease:'linear'}}>
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400"
          style={{boxShadow:'0 0 10px 3px rgba(168,85,247,.9)'}} />
      </motion.div>

      {/* Counter-rotating dashed ring */}
      <motion.div className="absolute inset-[-6px] rounded-full border border-dashed border-purple-500/[.15] pointer-events-none"
        animate={{rotate:-360}} transition={{duration:18,repeat:Infinity,ease:'linear'}} />

      {/* Pulsing glow */}
      <motion.div className="absolute inset-0 rounded-full pointer-events-none"
        animate={{boxShadow:[
          '0 0 40px 6px rgba(139,92,246,.22)',
          '0 0 70px 20px rgba(139,92,246,.38)',
          '0 0 40px 6px rgba(139,92,246,.22)',
        ]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}} />

      {/* Spinning arc */}
      <motion.div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400/60 border-r-purple-500/40 pointer-events-none"
        animate={{rotate:360}} transition={{duration:16,repeat:Infinity,ease:'linear'}} />

      {/* Image */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-purple-500/25 z-10">
        <Image src={src} alt={name} fill className="object-cover" priority />

        {/* Scan line entry */}
        <AnimatePresence>
          {scanned && (
            <motion.div key="scan"
              className="absolute left-0 right-0 h-[2px] z-20"
              style={{
                background:'linear-gradient(90deg,transparent,rgba(167,139,250,.9) 40%,rgba(216,180,254,1) 50%,rgba(167,139,250,.9) 60%,transparent)',
                boxShadow:'0 0 14px 4px rgba(139,92,246,.5)',
              }}
              initial={{top:0,opacity:0}}
              animate={{top:'105%',opacity:[0,1,1,0]}}
              transition={{duration:1.1,ease:'easeInOut'}}
            />
          )}
        </AnimatePresence>

        {/* Hover tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Available badge */}
      <motion.div
        className="absolute bottom-4 right-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-sm"
        initial={{opacity:0,scale:.7,y:8}}
        animate={{opacity:1,scale:1,y:0}}
        transition={{delay:1.4,duration:.45,ease:'backOut'}}
      >
        <motion.span className="w-2 h-2 rounded-full bg-emerald-400"
          animate={{opacity:[1,.3,1],scale:[1,1.4,1]}} transition={{duration:1.8,repeat:Infinity}} />
        <span className="text-[10px] text-white/55 tracking-widest uppercase">Available</span>
      </motion.div>
    </div>
  );
}

/* ── Word-split title ── */
function SplitName({ name }: { name: string }) {
  return (
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white flex flex-wrap gap-x-[.25em]">
      {name.split(' ').map((w,i) => (
        <motion.span key={i} className="inline-block"
          initial={{opacity:0,y:28}}
          animate={{opacity:1,y:0}}
          transition={{duration:.55,delay:.3+i*.1,ease:[.22,1,.36,1]}}>
          {w}
        </motion.span>
      ))}
    </h1>
  );
}

/* ════════ ROOT ════════ */
export function HeroSection() {
  const { hero } = portfolioData;
  const contactHref = '/#contact';
  const resumeHref = '/Keya-Sheth-Resume.pdf';

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-20 md:py-0">

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{background:'radial-gradient(circle,rgba(109,40,217,.15),transparent 70%)'}}
          animate={{scale:[1,1.15,1],x:[0,20,0],y:[0,-15,0]}} transition={{duration:9,repeat:Infinity,ease:'easeInOut'}} />
        <motion.div className="absolute -bottom-40 -right-20 w-[420px] h-[420px] rounded-full"
          style={{background:'radial-gradient(circle,rgba(192,38,211,.1),transparent 70%)'}}
          animate={{scale:[1,1.2,1],x:[0,-25,0],y:[0,18,0]}} transition={{duration:11,repeat:Infinity,ease:'easeInOut',delay:1.5}} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid min-h-screen grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── LEFT ── */}
          <div className="space-y-8">

            {/* Greeting pill */}
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[.08] bg-white/[.04] backdrop-blur-sm"
              initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.5}}>
              <motion.span className="w-1.5 h-1.5 rounded-full bg-violet-400"
                animate={{scale:[1,1.6,1]}} transition={{duration:2,repeat:Infinity}} />
              <span className="text-[11px] text-white/50 tracking-[.18em] uppercase">{hero.greeting}</span>
            </motion.div>

            {/* Name */}
            <div className="space-y-2">
              <SplitName name={hero.name} />
            </div>

            {/* Role */}
            <motion.p className="text-xl text-white/70 md:text-2xl"
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:.4}}>
              I&apos;m a{' '}
              <motion.span className="font-semibold text-purple-400"
                animate={{textShadow:['0 0 0px rgba(168,85,247,0)','0 0 20px rgba(168,85,247,.6)','0 0 0px rgba(168,85,247,0)']}}
                transition={{duration:2.5,repeat:Infinity,ease:'easeInOut'}}>
                {hero.subtitle}
              </motion.span>
            </motion.p>

            {/* Description */}
            <motion.p className="max-w-lg text-base leading-[1.85] text-white/50 md:text-lg"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.9,duration:.5}}>
              {hero.description}
            </motion.p>

            {/* CTAs */}
            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:1.05,duration:.5}}>

              <MagBtn href={resumeHref} download="Keya-Sheth-Resume.pdf"
                className="relative group overflow-hidden flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-3.5 font-semibold text-sm text-white hover:bg-purple-500 transition-colors duration-300 cursor-pointer"
                style={{ boxShadow:'0 0 30px rgba(139,92,246,.25)' } as any}>
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700" />
                <Download size={16} />
                Download Resume
              </MagBtn>

              <MagBtn href={contactHref}
                className="relative group overflow-hidden flex items-center gap-2 rounded-xl border border-white/[.12] px-8 py-3.5 font-semibold text-sm text-white/80 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 bg-white/[.03] transition-all duration-300 cursor-pointer">
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent transition-transform duration-700" />
                <MessageCircle size={16} />
                Let&apos;s Talk
              </MagBtn>
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <motion.div className="relative flex min-h-96 items-center justify-center lg:min-h-screen"
            initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
            transition={{delay:.4,duration:.8,ease:[.22,1,.36,1]}}>
            <motion.div animate={{y:[0,-12,0]}} transition={{duration:4.5,repeat:Infinity,ease:'easeInOut'}}>
              <ProfileImage src="/keya-photo.jpg" name={hero.name} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
