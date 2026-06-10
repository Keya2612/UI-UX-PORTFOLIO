'use client';

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Wrench, TrendingUp, BookOpen } from 'lucide-react';
import { portfolioData } from '@/lib/portfolio-data';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useRef, useState, useCallback, useEffect } from 'react';

type Project = (typeof portfolioData.projects)[number];
type ImageRatioMap = Record<string, number>;

function rememberImageRatio(
  src: string,
  image: HTMLImageElement,
  setRatios: React.Dispatch<React.SetStateAction<ImageRatioMap>>
) {
  const ratio = image.naturalWidth / image.naturalHeight;

  if (!Number.isFinite(ratio) || ratio <= 0) {
    return;
  }

  setRatios((current) => {
    if (current[src] === ratio) {
      return current;
    }

    return { ...current, [src]: ratio };
  });
}

function getFrameAspect(ratio?: number, mobileHint = false) {
  const fallback = mobileHint ? 9 / 16 : 4 / 3;
  const value = ratio ?? fallback;

  if (value <= 0.48) return 9 / 16;
  if (value <= 0.82) return 3 / 4;
  if (value <= 1.18) return 1;
  if (value <= 1.48) return 4 / 3;
  return 16 / 9;
}

function getFrameWidthClass(frameAspect: number) {
  if (frameAspect <= 0.6) return 'max-w-[280px] sm:max-w-[300px] md:max-w-[320px]';
  if (frameAspect <= 0.85) return 'max-w-[400px] sm:max-w-[460px] md:max-w-[520px]';
  if (frameAspect <= 1.1) return 'max-w-[500px] sm:max-w-[560px] md:max-w-[620px]';
  if (frameAspect <= 1.4) return 'max-w-[560px] sm:max-w-[620px] md:max-w-[680px]';
  return 'max-w-[620px] sm:max-w-[680px] md:max-w-[760px]';
}

function shouldUsePhoneFrame(ratio?: number, mobileHint = false) {
  const fallback = mobileHint ? 9 / 16 : 1;
  return (ratio ?? fallback) < 0.72;
}

function ProjectFallbackVisual({ project }: { project: Project }) {
  const overview = cleanDisplayText(project.description);
  const tools = project.tools.slice(0, 3);
  const tags = project.tags.slice(0, 3);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-3 md:p-4">
      <div className="relative h-full w-full overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-[linear-gradient(140deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-3 md:p-5 shadow-[0_28px_80px_rgba(0,0,0,0.4)]">
        <div
          className="absolute -left-16 top-1/4 h-40 w-40 rounded-full blur-3xl"
          style={{ background: 'rgba(168,85,247,0.2)' }}
        />
        <div
          className="absolute -right-12 top-0 h-36 w-36 rounded-full blur-3xl"
          style={{ background: 'rgba(236,72,153,0.14)' }}
        />

        <div className="relative grid h-full gap-4 md:grid-cols-[220px_1fr]">
          <aside className="flex flex-col rounded-[1.5rem] border border-white/[0.06] bg-[#101021] p-4 text-white/80">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xs font-bold text-[#120f24]">
                KS
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{normalizeProjectTitle(project.title)}</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">{project.category}</p>
              </div>
            </div>

            <div className="space-y-2">
              {['Dashboard', 'Discover Talent', 'Post Projects', 'Messages'].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    index === 1 ? 'bg-white text-[#120f24]' : 'bg-white/[0.04] text-white/70'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-auto rounded-[1.3rem] border border-white/[0.07] bg-white/[0.04] p-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Tools</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/75"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex min-h-0 flex-col rounded-[1.5rem] bg-[#f8f6ff] p-4 text-[#140f23] md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#6d28d9]/60">Marketplace UI</p>
                <h3 className="mt-1 text-xl font-bold md:text-2xl">{normalizeProjectTitle(project.title)}</h3>
              </div>
              <div className="rounded-full bg-[#120f24] px-3 py-1 text-[11px] font-medium text-white">
                {project.year}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Flows', value: '04' },
                { label: 'Screens', value: '12+' },
                { label: 'Focus', value: 'Hiring' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.2rem] border border-[#d9cffd] bg-white p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#7c3aed]/55">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-[#140f23]">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid flex-1 gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.4rem] border border-[#ddd4ff] bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">Project Pipeline</p>
                  <span className="rounded-full bg-[#ede9fe] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#6d28d9]">
                    Live briefs
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    'Create a project brief',
                    'Match with top freelancers',
                    'Track proposals and delivery',
                  ].map((card, index) => (
                    <div key={card} className="rounded-[1.1rem] border border-[#e7defd] bg-[#faf8ff] p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c3aed]/50">Step 0{index + 1}</p>
                      <p className="mt-2 text-sm font-medium leading-6 text-[#140f23]">{card}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-[#4c4560]">{overview}</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="rounded-[1.4rem] border border-[#ddd4ff] bg-[#120f24] p-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Featured Talent</p>
                  <div className="mt-3 space-y-2.5">
                    {['UI Designer', 'Frontend Developer', 'Product Strategist'].map((role) => (
                      <div key={role} className="rounded-[1rem] bg-white/[0.06] px-3 py-2.5">
                        <p className="text-sm font-medium text-white">{role}</p>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">Available now</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-[#ddd4ff] bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#7c3aed]/55">Highlights</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#ded4ff] bg-[#f6f2ff] px-2.5 py-1 text-[11px] font-medium text-[#5b34c8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 rounded-[1rem] bg-[#faf8ff] p-3 text-sm leading-6 text-[#4c4560]">
                    Clear discovery, structured proposals, and smoother collaboration flows for both freelancers and clients.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeProjectTitle(text: string) {
  return text
    .replace(/Quizzo.*Quiz App/, 'Quizzo Quiz Application')
    .replace(/Â·/g, '·');
}

function cleanDisplayText(text: string) {
  return text.replace(/Ã¢â‚¬â€œ/g, '-').replace(/Â·/g, '·');
}

/* ── Progress bar ── */
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg,#7c3aed,#a855f7,#c084fc)' }}
    />
  );
}

/* ── Scan line ── */
function ScanLine({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div key={trigger}
          className="pointer-events-none absolute left-0 right-0 h-[1.5px] z-30"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,.85) 40%,rgba(216,180,254,1) 50%,rgba(167,139,250,.85) 60%,transparent)', boxShadow: '0 0 10px 3px rgba(139,92,246,.4)' }}
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
          exit={{}}
          transition={{ duration: .65, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}

/* ── Slider ── */
function Slider({ images, title, mobileView = false }: { images: string[]; title: string; mobileView?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1|-1>(1);
  const [scanKey, setScanKey] = useState(0);
  const [imageRatios, setImageRatios] = useState<ImageRatioMap>({});
  const total = images.length;
  const displayTitle = normalizeProjectTitle(title);
  const activeRatio = imageRatios[images[idx]];
  const frameAspect = getFrameAspect(activeRatio, mobileView);
  const frameWidthClass = getFrameWidthClass(frameAspect);
  const usePhoneFrame = shouldUsePhoneFrame(activeRatio, mobileView);
  const displayRatio = activeRatio ?? (mobileView ? 9 / 16 : 1);
  const mediaHeightClass = usePhoneFrame ? 'max-h-[520px] md:max-h-[560px]' : 'max-h-[340px] md:max-h-[420px]';

  const go = useCallback((d: 1|-1) => {
    setDir(d); setScanKey(k=>k+1);
    setIdx(i => (i + d + total) % total);
  }, [total]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key==='ArrowRight') go(1); if (e.key==='ArrowLeft') go(-1); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [go]);

  return (
    <div className={`mx-auto w-full ${frameWidthClass}`}>
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[1.75rem] border border-white/[0.08] bg-white/[0.02] p-4 md:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
      >
        <AnimatePresence custom={dir} initial={false} mode="wait">
          <motion.div key={idx} custom={dir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit:   (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0, scale: 0.985 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: .52, ease: [.22,1,.36,1] }}
            className="flex items-center justify-center"
          >
            <div className={`w-full ${usePhoneFrame ? 'max-w-[300px] md:max-w-[320px]' : 'max-w-full'}`}>
              <div className="relative overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[#111119] p-2 md:p-3 shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-center rounded-[1rem] bg-[#181824] px-2 py-2 md:px-3 md:py-3">
                  <img
                    src={images[idx]}
                    alt={`${displayTitle} ${idx+1}`}
                    onLoad={(event) => rememberImageRatio(images[idx], event.currentTarget, setImageRatios)}
                    className={`block w-auto max-w-full ${mediaHeightClass} rounded-lg object-contain`}
                    style={{ aspectRatio: String(displayRatio) }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <ScanLine trigger={scanKey} />
        <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[1.75rem] bg-gradient-to-r from-purple-500/50 via-purple-400/20 to-transparent z-10" />

        {total > 1 && <>
          {([-1,1] as const).map(d => (
            <button key={d} onClick={() => go(d)}
              className={`absolute ${d===-1?'left-3 md:left-4':'right-3 md:right-4'} top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-white/10 bg-black/65 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/15 transition-all`}>
              {d === -1 ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          ))}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {Array.from({length:total}).map((_,i) => (
              <button key={i} onClick={()=>{setDir(i>idx?1:-1);setScanKey(k=>k+1);setIdx(i);}}
                className="h-[3px] rounded-full transition-all duration-300"
                style={{width:i===idx?24:7,background:i===idx?'rgba(192,132,252,1)':'rgba(255,255,255,.2)'}} />
            ))}
          </div>
          <div className="absolute top-3 right-3 z-20 text-[10px] text-white/40 tracking-widest bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/[0.07]">
            {String(idx+1).padStart(2,'0')} / {String(total).padStart(2,'0')}
          </div>
        </>}
      </motion.div>
    </div>
  );
}

/* ── Reveal wrapper ── */
function Reveal({ children, delay=0, className='' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration: .55, delay, ease: [.22,1,.36,1] }}>
      {children}
    </motion.div>
  );
}

/* ── Section heading ── */
function SectionHeading({ eyebrow, title, icon: Icon }: { eyebrow: string; title: string; icon: React.ComponentType<{className?:string}> }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-purple-400/60" />
        <span className="text-[10px] uppercase tracking-[.2em] text-purple-400/60">{eyebrow}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ value, label, i }: { value: string; label: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [hov, setHov] = useState(false);
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:16, scale:.93 }}
      animate={inView?{opacity:1,y:0,scale:1}:{}}
      transition={{ delay:.06*i, duration:.45, ease:[.22,1,.36,1] }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-center cursor-default"
      style={{ borderColor: hov ? 'rgba(168,85,247,.4)' : undefined }}
    >
      <motion.div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-transparent pointer-events-none"
        initial={{width:0}} animate={hov?{width:'100%'}:{width:0}} transition={{duration:.35}} />
      <motion.p className="text-3xl font-bold mb-1"
        animate={hov?{color:'rgba(192,132,252,1)'}:{color:'rgba(255,255,255,.9)'}} transition={{duration:.25}}>
        {value}
      </motion.p>
      <p className="text-[11px] text-white/35 uppercase tracking-[.15em]">{label}</p>
    </motion.div>
  );
}

/* ── Tool chip ── */
function ToolChip({ tool, i }: { tool: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [hov, setHov] = useState(false);
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, x:-10 }}
      animate={inView?{opacity:1,x:0}:{}}
      transition={{ delay:.05*i, duration:.4 }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/[0.06] bg-white/[0.02] cursor-default transition-colors duration-200"
      style={{ borderColor: hov?'rgba(168,85,247,.3)':undefined, background: hov?'rgba(139,92,246,.05)':undefined }}
    >
      <motion.span className="w-1.5 h-1.5 rounded-full bg-purple-500/60 flex-shrink-0"
        animate={hov?{scale:1.6,backgroundColor:'rgba(168,85,247,.9)'}:{scale:1}} transition={{duration:.2}} />
      <span className="text-sm text-white/60" style={{ color: hov?'rgba(255,255,255,.85)':undefined, transition:'color .2s' }}>{tool}</span>
    </motion.div>
  );
}

/* ── Tag ── */
function TagChip({ tag, i }: { tag: string; i: number }) {
  return (
    <motion.span
      initial={{ opacity:0, scale:.85 }}
      whileInView={{ opacity:1, scale:1 }}
      viewport={{ once:true }}
      transition={{ delay:.04*i, ease:'backOut' }}
      whileHover={{ borderColor:'rgba(168,85,247,.6)', color:'rgba(255,255,255,.9)' }}
      className="px-3 py-1 text-xs rounded-full border border-purple-500/25 bg-purple-500/[.07] text-white/55 transition-colors cursor-default"
    >{tag}</motion.span>
  );
}

/* ── Next project button ── */
function NextProjectBtn({ project, onClick }: { project: any; onClick: ()=>void }) {
  const [hov, setHov] = useState(false);
  const [scan, setScan] = useState(0);
  return (
    <motion.button onClick={onClick}
      onMouseEnter={()=>{setHov(true);setScan(k=>k+1);}}
      onMouseLeave={()=>setHov(false)}
      whileTap={{scale:.98}}
      className="relative overflow-hidden w-full text-left p-5 rounded-2xl border border-white/[.08] bg-white/[.02] cursor-pointer transition-colors duration-300"
      style={{ borderColor: hov?'rgba(168,85,247,.45)':undefined }}
    >
      <ScanLine trigger={scan} />
      <motion.div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-transparent pointer-events-none"
        initial={{width:0}} animate={hov?{width:'100%'}:{width:0}} transition={{duration:.4}} />
      <p className="text-[10px] text-white/25 uppercase tracking-[.2em] mb-3">Up Next</p>
      <div className="flex items-center justify-between gap-4">
        <div>
          <motion.h4 className="text-base font-bold text-white/80 leading-snug"
            animate={hov?{x:4}:{x:0}} transition={{duration:.22}}>{normalizeProjectTitle(project.title)}</motion.h4>
          <p className="text-xs text-white/25 mt-1 uppercase tracking-widest">{project.category} · {project.year}</p>
        </div>
        <motion.div
          className="w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0"
          animate={hov?{borderColor:'rgba(168,85,247,.6)',background:'rgba(139,92,246,.15)',boxShadow:'0 0 16px rgba(139,92,246,.3)'}:{borderColor:'rgba(255,255,255,.1)',background:'rgba(255,255,255,.03)'}}
          transition={{duration:.25}}
        >
          <ArrowUpRight className="w-4 h-4" style={{ color: hov?'rgba(192,132,252,1)':'rgba(255,255,255,.3)', transition:'color .2s' }} />
        </motion.div>
      </div>
    </motion.button>
  );
}

/* ════════════════════════════════════════════
   PAGE
════════════════════════════════════════════ */
export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const pidx = portfolioData.projects.findIndex(p => p.id === id);
  const project = pidx === -1 ? undefined : portfolioData.projects[pidx];
  const next = project ? portfolioData.projects[(pidx+1) % portfolioData.projects.length] : null;

  if (!project) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-5">
        <p className="text-white/30 text-xs uppercase tracking-widest">Error 404</p>
        <h1 className="text-4xl font-bold text-white">Project Not Found</h1>
        <button onClick={()=>router.back()} className="px-6 py-3 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors">Go Back</button>
      </div>
    </div>
  );

  const allImages = [...(project.image?[project.image]:[]), ...(project.images??[])];
  const isMobileProject = project.tags?.some((tag: string) => /mobile/i.test(tag)) ?? false;

  // extract numbers from description for stat cards if available
  const stats = [
    { value: project.year?.toString() ?? '—', label: 'Year' },
    { value: project.tools?.length ? `${project.tools.length}+` : '—', label: 'Tools' },
    { value: project.tags?.length ? `${project.tags.length}` : '—', label: 'Tags' },
  ];

  return (
    <>
      <ProgressBar />
      <div className="min-h-screen bg-[#080810] text-white">

        {/* Ambient */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-48 left-1/4 w-[700px] h-[500px] rounded-full opacity-50"
            style={{ background: 'radial-gradient(ellipse, rgba(109,40,217,.1), transparent 70%)' }} />
          <div className="absolute top-1/2 -right-32 w-[400px] h-[600px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(ellipse, rgba(192,38,211,.07), transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pt-10 pb-28">

          {/* Back */}
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:.4}}
            className="flex items-center gap-3 mb-12">
            <motion.button onClick={()=>router.push('/#projects')} whileHover={{x:-3}} whileTap={{scale:.95}}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[.08] bg-white/[.02] text-white/40 hover:text-white/80 hover:border-purple-500/40 transition-all text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </motion.button>
          </motion.div>

          {/* ── HERO BLOCK ── */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
            transition={{duration:.6,delay:.05,ease:[.22,1,.36,1]}}
            className="mb-14 max-w-4xl">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/25 bg-purple-500/[.08]">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-[10px] uppercase tracking-[.18em] text-purple-300/70">{project.category}</span>
                <span className="text-white/20 mx-1">·</span>
                <span className="text-[10px] text-white/30 tracking-widest">{project.year}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.03] tracking-tight">
                {normalizeProjectTitle(project.title)}
              </h1>
              <p className="text-white/50 text-base leading-[1.8] max-w-md">
                {project.description}
              </p>
            </div>
          </motion.div>

          {/* ── SLIDER ── */}
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{delay:.2,duration:.6,ease:[.22,1,.36,1]}} className="mb-16">
            {allImages.length > 0
              ? <Slider images={allImages} title={project.title} mobileView={isMobileProject} />
              : (
                <div className="mx-auto w-full max-w-5xl">
                  <div
                    className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black"
                    style={{ aspectRatio:'16 / 10' }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_40%),linear-gradient(180deg,rgba(10,10,16,0.78),rgba(18,18,28,0.92))]" />
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-500/60 via-purple-400/30 to-transparent z-10" />
                    <ProjectFallbackVisual project={project} />
                  </div>
                </div>
              )
            }
          </motion.div>

          {/* ── MAIN CONTENT + SIDEBAR ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

            {/* MAIN */}
            <div className="space-y-14">

              {/* Overview */}
              <Reveal>
                <SectionHeading eyebrow="Case Study" title="Project Overview" icon={BookOpen} />
                <div className="relative pl-5 border-l border-purple-500/20">
                  <motion.div className="absolute left-0 top-0 w-[1px] bg-gradient-to-b from-purple-500 to-purple-500/0 origin-top"
                    initial={{height:0}} whileInView={{height:'100%'}} viewport={{once:true}}
                    transition={{duration:.8,ease:[.22,1,.36,1]}} />
                  <p className="text-white/65 leading-[1.95] text-[15px]">{project.fullDescription}</p>
                </div>
              </Reveal>

              {/* Outcome */}
              <Reveal delay={.05}>
                <SectionHeading eyebrow="Results" title="Outcome & Impact" icon={TrendingUp} />
                <div className="relative overflow-hidden rounded-2xl border border-purple-500/15 bg-purple-500/[.03] p-7">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-purple-500/60 via-purple-400/30 to-transparent" />
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                    style={{ background:'radial-gradient(circle,rgba(139,92,246,.12),transparent 70%)' }} />
                  <p className="text-white/65 leading-[1.95] text-[15px] relative">{project.outcome}</p>
                </div>
              </Reveal>

            </div>

            {/* SIDEBAR */}
            <div className="space-y-8">

              {/* Role */}
              <Reveal>
                <div className="p-5 rounded-2xl border border-white/[.07] bg-white/[.02] space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
                    <p className="text-[10px] uppercase tracking-[.2em] text-white/25">My Role</p>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{project.role}</p>
                </div>
              </Reveal>

              {/* Tools */}
              <Reveal delay={.04}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-purple-400/60" />
                    <p className="text-[10px] uppercase tracking-[.2em] text-white/25">Tools Used</p>
                  </div>
                  <div className="space-y-2">
                    {project.tools.map((t,i) => <ToolChip key={t} tool={t} i={i} />)}
                  </div>
                </div>
              </Reveal>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-white/[.05] to-transparent" />

              {/* Next */}
              {next && (
                <Reveal delay={.08}>
                  <NextProjectBtn project={next} onClick={()=>router.push(`/projects/${next.id}`)} />
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
