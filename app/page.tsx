"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, ArrowUp, ArrowRight, Image as ImageIcon, X, Sparkles, User, Activity, Globe as GlobeIcon } from 'lucide-react';
import WorldMap from "@/components/ui/world-map";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { CodeComparison } from "@/registry/magicui/code-comparison";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { SmoothInput } from "@/components/ui/smooth-input";
import { motion, useScroll, useTransform, useInView, useMotionValue } from "motion/react";
import Goo from "gooey-react";
import ReactLenis from "lenis/react";

const beforeCode = `import { NextRequest } from 'next/server';

export const middleware = async (req: NextRequest) => {
  let user = undefined;
  let team = undefined;
  const token = req.headers.get('token'); 

  if(req.nextUrl.pathname.startsWith('/auth')) {
    user = await getUserByToken(token);

    if(!user) {
      return NextResponse.redirect('/login');
    }
  }

  if(req.nextUrl.pathname.startsWith('/team')) {
    user = await getUserByToken(token);

    if(!user) {
      return NextResponse.redirect('/login');
    }

    const slug = req.nextUrl.query.slug;
    team = await getTeamBySlug(slug); // [!code highlight]

    if(!team) { // [!code highlight]
      return NextResponse.redirect('/'); // [!code highlight]
    } // [!code highlight]
  } // [!code highlight]

  return NextResponse.next(); // [!code highlight]
}

export const config = {
  matcher: ['/((?!_next/|_static|_vercel|[\\w-]+\\.\\w+).*)'], // [!code highlight]
};`

const afterCode = `import { createMiddleware, type MiddlewareFunctionProps } from '@app/(auth)/auth/_middleware';
import { auth } from '@/app/(auth)/auth/_middleware'; // [!code --]
import { auth } from '@/app/(auth)/auth/_middleware'; // [!code ++]
import { team } from '@/app/(team)/team/_middleware';

const middlewares = {
  '/auth{/:path?}': auth,
  '/team{/:slug?}': [ auth, team ],
};

export const middleware = createMiddleware(middlewares); // [!code focus]

export const config = {
  matcher: ['/((?!_next/|_static|_vercel|[\\w-]+\\.\\w+).*)'],
};`

function CodeComparisonDemo() {
  return (
    <CodeComparison
      beforeCode={beforeCode}
      afterCode={afterCode}
      language="typescript"
      filename="middleware.ts"
      lightTheme="github-light"
      darkTheme="github-dark"
      highlightColor="rgba(101, 117, 133, 0.16)"
    />
  )
}

function PromptToCodeDemo() {
  const [step, setStep] = useState(0);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, 500], [0, 10]);
  const translateY = useTransform(scrollY, [0, 500], [0, 12]);
  
  const targetInput = "easily add animation, generate landing page";
  const targetOutput = `import { motion } from "motion/react";

export function AnimatedLanding() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-12 text-center bg-black border border-white/10 rounded-2xl"
    >
      <h1 className="text-white text-3xl font-mono">[GENERATE LANDING PAGE]</h1>
      <p className="text-gray-400 mt-4">AI generated code is done.</p>
    </motion.div>
  );
}`;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 0) {
      setInputText("");
      setOutputText("");
      timer = setTimeout(() => setStep(1), 1000);
    } else if (step === 1) {
      if (inputText.length < targetInput.length) {
        timer = setTimeout(() => {
          setInputText(targetInput.slice(0, inputText.length + 1));
        }, 50);
      } else {
        timer = setTimeout(() => setStep(2), 800);
      }
    } else if (step === 2) {
      timer = setTimeout(() => setStep(3), 600);
    } else if (step === 3) {
      if (outputText.length < targetOutput.length) {
        timer = setTimeout(() => {
          setOutputText(targetOutput.slice(0, outputText.length + 8));
        }, 12);
      } else {
        timer = setTimeout(() => setStep(4), 4000);
      }
    } else if (step === 4) {
      timer = setTimeout(() => setStep(0), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, inputText, outputText]);

  return (
    <div className="mx-auto w-full max-w-[1100px] relative">
      <motion.div 
        style={{
          rotateX: rotateX,
          translateY: translateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full rounded-xl border border-zinc-800 bg-black overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-3">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 tracking-wider">noxyai-generator.sh</span>
          <div className="w-10"></div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 w-full">
            <span className="text-zinc-500 font-mono text-sm">prompt$</span>
            <SmoothInput
              isSimulating={step === 1}
              value={inputText}
              placeholder="Enter your prompt..."
              wrapperClassName="flex-1"
              readOnly
            />
            <button 
              className={cn(
                "px-5 py-3 rounded-xl font-mono text-xs transition-all duration-300 font-semibold self-stretch flex items-center justify-center border border-zinc-800",
                step >= 2 ? "bg-white text-black scale-95 shadow-[0_0_10px_rgba(255,255,255,0.3)] border-white" : "bg-zinc-800 text-zinc-500"
              )}
            >
              [SEND]
            </button>
          </div>

          <div className={cn("transition-opacity duration-500", step >= 3 ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <div className="border border-zinc-800 rounded-lg bg-black overflow-hidden flex flex-col">
              <div className="flex items-center justify-between bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 text-[10px] font-mono text-zinc-500">
                <span>OUTPUT: GENERATED CODE</span>
                {outputText.length === targetOutput.length && step >= 3 && (
                  <span className="text-emerald-500 font-bold animate-pulse">DONE</span>
                )}
              </div>
              <pre className="p-4 overflow-x-auto text-left font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap min-h-[240px]">
                <code>
                  {outputText}
                  {outputText.length < targetOutput.length && step >= 3 && (
                    <span className="inline-block w-1.5 h-4 bg-emerald-500 ml-0.5 animate-pulse"></span>
                  )}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



// --- Custom Node Component for Animated Beams ---
interface CircleNodeProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const CircleNode: React.FC<CircleNodeProps> = ({ className, children, style }) => (
  <div className={`z-10 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full border border-white/20 bg-[#0A0A0A] p-3 shadow-[0_0_20px_rgba(255,255,255,0.05)] ${className}`} style={style}>
    {children}
  </div>
);


export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const latestArticle = {
    title: "Google Meets AI: How NoxyAI Supercharges Gmail, Drive, and Sheets",
    url: "/blog/145b93d5",
    thumbnail_url: "https://conjfpheubfkpmmhvswj.supabase.co/storage/v1/object/public/thumbnails/bc796316-1782492391573.png"
  };
  const nuratixLogo = "/white-logo.png";
  const noxyaiLogo = "https://noxyai.com/logo-white.png";

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    const handleScroll = () => {
      setIsDocked(window.scrollY > (window.innerHeight * 0.45 * 0.65));
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const isDesktop = windowWidth >= 768;
  
  // Morph completes smoothly over the first 45% of the viewport height
  const threshold = windowHeight * 0.45;

  const startWidth = isDesktop ? 540 : windowWidth * 0.90;
  const targetWidth = windowWidth;

  const startHeight = 64;
  const targetHeight = isDesktop ? 80 : 68;

  // GPU translation coordinates
  const startY = windowHeight * 0.58; 
  const targetY = 0; // Lock flush with top edge

  const { scrollY } = useScroll();

  // Morph values linked natively to scrollY using Framer Motion
  const activeWidth = useTransform(scrollY, [0, threshold], [startWidth, targetWidth]);
  const activeHeight = useTransform(scrollY, [0, threshold], [startHeight, targetHeight]);
  const activeY = useTransform(scrollY, [0, threshold], [startY, targetY]);
  const activeRadius = useTransform(scrollY, [0, threshold], [32, 0]);
  const activeBg = useTransform(scrollY, [0, threshold], ["rgba(255, 255, 255, 0.02)", "rgba(255, 255, 255, 0.06)"]);
  const activeBorderBottom = useTransform(scrollY, [0, threshold], ["1px solid rgba(255, 255, 255, 0.1)", "1px solid rgba(255, 255, 255, 0.15)"]);
  
  // Intense glassy dimensional shadows
  const activeShadow = useTransform(scrollY, [0, threshold * 0.1, threshold], [
    "0 35px 70px -15px rgba(0,0,0,0.95), inset 0 1.5px 0 0 rgba(255,255,255,0.22), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 0 40px -20px rgba(255,255,255,0.15)",
    "0 35px 70px -15px rgba(0,0,0,0.95), inset 0 1.5px 0 0 rgba(255,255,255,0.22), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 0 40px -20px rgba(255,255,255,0.15)",
    "0 20px 45px -15px rgba(0,0,0,0.95)"
  ]);

  // Inner element morph styles
  const glassGlareOpacity = useTransform(scrollY, [0, threshold], [1, 0]);
  const inputOpacity = useTransform(scrollY, [0, threshold * 0.4], [1, 0]);
  const inputScale = useTransform(scrollY, [0, threshold * 0.4], [1, 0.92]);

  const logoOpacity = useTransform(scrollY, [threshold * 0.5, threshold], [0, 1]);
  const logoScale = useTransform(scrollY, [threshold * 0.5, threshold], [0.92, 1]);

  const headlineOpacity = useTransform(scrollY, [0, threshold * 0.85], [1, 0]);
  const headlineY = useTransform(scrollY, [0, threshold * 0.85], [0, -60]);

  return (
    <div className="min-h-screen bg-[#010103] text-white font-sans selection:bg-white/30 overflow-x-hidden relative">
      {/* --- CSS Animations Block --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-chat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.1; }
          100% { transform: scale(1.1); opacity: 0; }
        }

        /* Iridescent liquid chrome title animation */
        @keyframes liquid-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes liquid-mercury {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg) skewX(0deg); }
          50% { transform: translateY(-5px) scale(1.015) rotate(-0.3deg) skewX(0.5deg); }
        }
        .fluid-headline {
          background: linear-gradient(
            110deg, 
            #ffffff 0%, 
            #f8fafc 12%, 
            #cbd5e1 28%, 
            #64748b 45%, 
            #1e293b 55%, 
            #64748b 65%, 
            #cbd5e1 78%, 
            #f1f5f9 90%, 
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: liquid-gradient 5s ease-in-out infinite, liquid-mercury 5.5s ease-in-out infinite;
          display: inline-block;
          filter: drop-shadow(0 4px 20px rgba(255,255,255,0.12));
          will-change: transform, background-position;
        }

        /* Glass Specular Glare Animation */
        @keyframes glass-glare {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        .glass-specular {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.01) 20%,
            rgba(255, 255, 255, 0.08) 40%,
            rgba(255, 255, 255, 0.12) 50%,
            rgba(255, 255, 255, 0.08) 60%,
            rgba(255, 255, 255, 0.01) 80%,
            transparent
          );
          animation: glass-glare 8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          pointer-events: none;
        }

        /* Connective Laser Beams */
        @keyframes beam-flow-anim {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        .animated-beam-glow {
          stroke: #ffffff;
          stroke-width: 3px;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 15 85; 
          animation: beam-flow-anim 2.2s linear infinite;
        }

        /* Orbit Animations (Hardcoded radii to prevent React style variable crashes) */
        @keyframes orbit-90 {
          0% { transform: rotate(0deg) translateY(-90px) rotate(0deg); }
          100% { transform: rotate(360deg) translateY(-90px) rotate(-360deg); }
        }
        @keyframes orbit-140 {
          0% { transform: rotate(0deg) translateY(-140px) rotate(0deg); }
          100% { transform: rotate(360deg) translateY(-140px) rotate(-360deg); }
        }
        @keyframes orbit-reverse-140 {
          0% { transform: rotate(360deg) translateY(-140px) rotate(-360deg); }
          100% { transform: rotate(0deg) translateY(-140px) rotate(0deg); }
        }

        .magic-border { position: relative; }
        .magic-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(
            to bottom right, 
            rgba(255, 255, 255, 0.45) 0%, 
            rgba(255, 255, 255, 0.08) 40%, 
            rgba(255, 255, 255, 0.02) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .bento-card {
          background: radial-gradient(140% 140% at 50% 0%, rgba(18,18,22,1) 0%, rgba(3,3,4,1) 100%);
        }
      `}} />

      {/* --- PERSISTENT GLOBAL HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-[100] p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center pointer-events-auto cursor-pointer">
           <img src={nuratixLogo} alt="Nuratix" className="h-6 md:h-7" />
        </div>
      </header>

      {/* --- Ambient Fluid Space Light (Tracks cursor) --- */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 opacity-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.04), transparent 50%)`
        }}
      />

      {/* --- Infinite Black Hole Video Backdrop --- */}
      <div className="absolute top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-102 opacity-85">
          <source src="https://nuratixnew.vercel.app/black-hole.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#010103]"></div>
      </div>

      {/* --- Liquid Cosmic Title Text --- */}
      <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none z-10">
        <motion.div 
          className="px-4 mt-[-14vh]"
          style={{ 
            opacity: headlineOpacity, 
            y: headlineY 
          }}
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-[0.9] mb-4">
            <span className="fluid-headline pb-4">
              Understand<br />The Universe
            </span>
          </h1>
          <p className="text-white/30 text-[10px] md:text-xs tracking-[0.3em] uppercase font-light mt-3 max-w-md mx-auto">
            Autonomous Horizon. Pure Gravity.
          </p>
        </motion.div>
      </div>

      {/* --- DYNAMIC LIQUID-GLASS MORPHING SYSTEM --- */}
      <motion.div 
        className="fixed z-40 left-1/2 overflow-hidden"
        style={{
          x: "-50%",
          y: activeY,
          width: activeWidth,
          height: activeHeight,
          borderRadius: activeRadius,
          backgroundColor: activeBg,
          backdropFilter: `blur(30px) saturate(185%)`,
          borderBottom: activeBorderBottom,
          boxShadow: activeShadow,
          willChange: 'transform, width, height, border-radius',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
        }}
      >
        {/* Animated Refraction Sweep on Surface */}
        <motion.div className="glass-specular" style={{ opacity: glassGlareOpacity }} />

        <div className="w-full h-full relative flex items-center justify-between px-8 sm:px-12 max-w-7xl mx-auto">
          
          {/* --- STATE A: PROMPT BOX (Fades and dissolves dynamically as page is scrolled) --- */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-between"
            style={{
              opacity: inputOpacity,
              scale: inputScale,
              pointerEvents: !isDocked ? 'auto' : 'none',
              padding: '8px 10px 8px 24px'
            }}
          >
            <input 
              type="text" 
              placeholder="Ask NoxyAI anything..." 
              className="w-full bg-transparent border-none outline-none py-2 text-sm md:text-base placeholder-white/35 text-white font-normal tracking-wide" 
            />
            
            {/* Glass-Beveled High-Contrast Submit Token */}
            <button className="bg-white hover:bg-neutral-100 text-black p-3 rounded-full shrink-0 transition-transform active:scale-95 shadow-md flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </motion.div>

          {/* --- STATE B: DOCKED HEADER CONTROLS --- */}
          {/* LEFT ELEMENT: NURATIX Logo png (with Gooey Split/Merge response) */}
          <motion.div 
            className="flex items-center justify-start shrink-0 relative"
            style={{
              opacity: logoOpacity,
              scale: logoScale,
              pointerEvents: isDocked ? 'auto' : 'none'
            }}
          >
            <Goo>
              <div className="flex items-center gap-3 relative">
                <img src={nuratixLogo} alt="Nuratix" className="h-5 md:h-6 shrink-0" />

                {/* Gooey Animation Effect */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 flex items-center pointer-events-none z-0">
                  <motion.div
                    animate={!isDocked ? {
                      x: 0,
                      scale: 1,
                      borderRadius: 40,
                    } : {
                      x: 20,
                      scale: [1, 1.2, 0.8, 0],
                      borderRadius: 40,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    className="bg-white absolute w-3 h-3 rounded-full"
                  />
                  <motion.div
                    className="bg-white w-3 h-3 rounded-full"
                  />
                </div>
              </div>
            </Goo>
          </motion.div>

          {/* RIGHT ELEMENT: Navigation Bar & CTA */}
          <motion.div 
            className="flex items-center justify-end gap-6 md:gap-8 text-xs font-semibold tracking-[0.2em] uppercase text-white/50"
            style={{
              opacity: logoOpacity,
              scale: logoScale,
              pointerEvents: isDocked ? 'auto' : 'none'
            }}
          >
            <a href="https://policies.noxyai.com/terms" className="hover:text-white transition-colors duration-300">Terms</a>
            <a href="https://policies.noxyai.com/privacy" className="hover:text-white transition-colors duration-300">Privacy</a>
            <a href="https://noxyai.com" className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 text-[10px] font-bold tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap">
              TRY NOXYAI
            </a>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </motion.div>

        </div>
      </motion.div>
      {/* --- Mobile Slide-out Navigation Drawer --- */}
      <div className={`fixed inset-0 bg-black/95 z-50 backdrop-blur-3xl transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute top-6 left-6">
          <img src={nuratixLogo} alt="Nuratix" className="h-6" />
        </div>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-xl font-medium relative">
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <a href="https://policies.noxyai.com/terms" className="hover:text-gray-400 transition-colors">Terms</a>
          <a href="https://policies.noxyai.com/privacy" className="hover:text-gray-400 transition-colors">Privacy</a>
          <a href="https://noxyai.com" className="mt-4 px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors">
            TRY NOXYAI
          </a>
        </div>
      </div>

      {/* --- Main Contents Area --- */}
      <main className="w-full relative z-20">
        
        {/* Generous spacer representing the main visual viewport */}
        <div className="h-[100vh] w-full pointer-events-none"></div>

        {/* --- Scrollable Body Segment --- */}
        <div className="bg-[#030303] relative z-20">

      {/* --- Sticky Image Scroll --- */}
      <Skiper34 />

      {/* Trusted By Section Removed */}

      {/* --- Bento Grid --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Empower Your Workflow with AI</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Ask your AI Agent for real-time collaboration, seamless integrations, and actionable insights to streamline your operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Chat (Spans 2 columns) */}
          <div className="magic-border bento-card rounded-3xl p-8 min-h-[350px] flex flex-col justify-between group overflow-hidden md:col-span-2">
            <div className="relative h-48 w-full max-w-2xl mx-auto mt-4">
              <div className="absolute top-4 left-4 md:left-10 bg-blue-600 text-white text-sm md:text-base p-4 md:p-5 rounded-2xl rounded-tl-none max-w-[80%] shadow-lg" style={{ animation: 'float-chat 4s ease-in-out infinite' }}>
                Hey, I need help scheduling a team meeting that works well for everyone.
              </div>
              <div className="absolute bottom-4 right-4 md:right-10 bg-white/10 backdrop-blur-md text-white text-sm md:text-base p-4 md:p-5 rounded-2xl rounded-br-none max-w-[80%] border border-white/5" style={{ animation: 'float-chat 5s ease-in-out infinite reverse' }}>
                Based on your calendar patterns, I recommend Tuesday at 2pm.
              </div>
            </div>
            <div className="text-center mt-8">
              <h3 className="text-2xl font-medium mb-3">Real-time AI Collaboration</h3>
              <p className="text-gray-400 text-base max-w-2xl mx-auto">Experience real-time assistance. Ask your AI Agent to coordinate tasks, answer questions, and maintain team alignment effortlessly.</p>
            </div>
          </div>

          {/* Card 3: Automation */}
          <div className="magic-border bento-card rounded-3xl p-8 min-h-[400px] flex flex-col justify-between group overflow-hidden md:col-span-2">
            <div className="relative h-48 w-full flex items-center justify-center">
               <div className="w-full max-w-[80%] space-y-3">
                  <div className="flex text-[10px] text-gray-500 justify-between px-4 mb-2">
                    <span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                  </div>
                  <div className="h-8 bg-white text-black rounded-full w-full relative flex items-center justify-center text-xs font-semibold group-hover:scale-[1.02] transition-transform">
                    <div className="absolute top-[-25px] bg-black border border-white/10 px-2 py-1 rounded text-[10px] text-white">12:00 AM</div>
                    <div className="absolute top-[-10px] bottom-[-60px] w-px bg-white/20 left-1/2"></div>
                    Bento Grid
                  </div>
                  <div className="h-8 bg-zinc-900 rounded-full w-3/4 ml-auto flex items-center justify-center text-xs font-medium border border-zinc-800 group-hover:bg-zinc-800 transition-colors text-white">
                    Landing Page
                  </div>
                  <div className="h-8 bg-white/5 border border-dashed border-white/20 rounded-full w-1/2 ml-10 flex items-center justify-center text-xs text-gray-400 group-hover:border-white/40 transition-colors">
                    + Add Task
                  </div>
               </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-2xl font-medium mb-3">Smart Automation</h3>
              <p className="text-gray-400 text-base max-w-2xl mx-auto">Set it, forget it. Your AI Agent tackles repetitive tasks so you can focus on strategy, innovation, and growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Standalone GPU Architecture (Plain & Big) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 text-center flex flex-col items-center">
        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase font-semibold mb-4">[ GPU INFRASTRUCTURE ]</p>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Cosmic Core Architecture</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
          Powered by hyper-efficient scheduling and next-generation neural routing to deliver instantaneous response times.
        </p>
        <div className="w-full max-w-5xl h-auto">
          <CpuArchitecture className="text-white/80 w-full h-auto max-h-[450px]" />
        </div>
      </section>

      {/* --- Code Refactoring / Middleware Comparison Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 text-center flex flex-col items-center bg-black text-white">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Refactor code in seconds</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16">
          Compare how NoxyAI refactors complex legacy middleware setups into highly modular, developer-friendly codebase.
        </p>
        <div className="w-full">
          <CodeComparisonDemo />
        </div>
      </section>

      {/* --- Prompt to Code Section with Dot Pattern --- */}
      <section className="relative w-full border-t border-white/5 bg-black py-24 overflow-hidden">
        {/* DotPattern Background */}
        <DotPattern
          width={24}
          height={24}
          glow={true}
          className="opacity-20 text-zinc-700"
        />
        
        {/* Gradient Mask for fading dot pattern edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 text-sm text-white mb-6 font-mono tracking-wider">
            <span>[CODE WITH PROMPT]</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-white">Generate with natural language</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-16">
            Easily add animations, generate landing pages, click send, and watch the AI write production-ready code in seconds.
          </p>
          <div className="w-full">
            <PromptToCodeDemo />
          </div>
        </div>
      </section>

      {/* --- World Map / Global Reach Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center gap-2 text-sm text-white mb-6 font-mono tracking-wider">
          <span>[Active in 120+ countries worldwide]</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Trusted by teams at rapidly growing startups.</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
          Developers choose our AI agents to accelerate development. Join the global movement toward intelligent coding. Trusted by teams in hubs like <span className="text-white font-medium">India</span>, <span className="text-white font-medium">Dubai</span>, and the <span className="text-white font-medium">USA</span>.
        </p>

        <div className="w-full flex flex-col items-center justify-center scale-105">
          <WorldMap
            lineColor="#00ff66"
            dots={[
              {
                start: { lat: 64.2008, lng: -149.4937 }, // Alaska
                end: { lat: 34.0522, lng: -118.2437 }, // LA
              },
              {
                start: { lat: 64.2008, lng: -149.4937 },
                end: { lat: -15.7975, lng: -47.8919 }, // Brazil
              },
              {
                start: { lat: -15.7975, lng: -47.8919 },
                end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
              },
              {
                start: { lat: 51.5074, lng: -0.1278 }, // London
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 28.6139, lng: 77.209 },
                end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
              },
              {
                start: { lat: 28.6139, lng: 77.209 },
                end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
              },
            ]}
          />
        </div>
      </section>

      {/* --- Cosmic Intelligence (Clean Orbiting Models) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center justify-center gap-2 text-sm text-white mb-6 font-mono tracking-wider">
              <span>[POWERED BY WORLD-CLASS AI MODELS]</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Cosmic Intelligence, In Depth</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              A premium core, sculpted in light and glass — engineered for clarity, speed and depth.
            </p>
          </div>

          {/* Clean Orb Component */}
          <div className="relative flex min-h-[400px] lg:min-h-[550px] w-full flex-col items-center justify-center rounded-3xl">
            
            <div className="absolute inset-20 md:inset-16 bg-[radial-gradient(circle_at_center,rgba(60,60,120,0.15)_0%,transparent_70%)] rounded-full z-0"></div>

            {/* Faint Center Crosshair */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.15]">
               <div className="w-[150px] md:w-[250px] h-px bg-white"></div>
               <div className="absolute h-[150px] md:h-[250px] w-px bg-white"></div>
            </div>

            {/* Center Node (NoxyAI Logo) */}
            <div className="z-20 flex h-20 w-20 items-center justify-center rounded-full bg-[#030303] border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)] p-4">
               <img src={noxyaiLogo} alt="NoxyAI" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] brightness-0 invert" />
            </div>

            {/* Inner Ring (Zai & Moonshot) */}
            <div className="absolute w-[180px] h-[180px] border border-white/10 rounded-full pointer-events-none z-10"></div>
            <div className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center pointer-events-none z-20">
              <div className="absolute" style={{ animation: 'orbit-90 18s linear infinite' }}>
                <div className="absolute -top-6 -left-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0A0A] border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] p-2.5">
                  <img src="https://www.noxyai.com/zai.png" alt="Zai" className="w-full h-full object-contain brightness-0 invert" />
                </div>
              </div>
              <div className="absolute" style={{ animation: 'orbit-90 18s linear infinite', animationDelay: '-9s' }}>
                <div className="absolute -top-6 -left-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0A0A] border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] p-2.5">
                  <img src="https://www.noxyai.com/moonshot.png" alt="Moonshot" className="w-full h-full object-contain brightness-0 invert" />
                </div>
              </div>
            </div>

            {/* Outer Ring (Nvidia & Mistral) */}
            <div className="absolute w-[280px] h-[280px] border border-white/5 rounded-full pointer-events-none z-10"></div>
            <div className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center pointer-events-none z-20">
              <div className="absolute" style={{ animation: 'orbit-reverse-140 25s linear infinite' }}>
                <div className="absolute -top-7 -left-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A0A0A] border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] p-3">
                  <img src="https://www.noxyai.com/nvidia.png" alt="Nvidia" className="w-full h-full object-contain brightness-0 invert" />
                </div>
              </div>
              <div className="absolute" style={{ animation: 'orbit-reverse-140 25s linear infinite', animationDelay: '-12.5s' }}>
                <div className="absolute -top-7 -left-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A0A0A] border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] p-3">
                  <img src="https://www.noxyai.com/mistral.png" alt="Mistral" className="w-full h-full object-contain brightness-0 invert" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Featured Insights (Blog) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] text-gray-500 uppercase font-semibold mb-4">[ FEATURED ]</p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Latest Insights</h2>
        </div>
        <a href={latestArticle.url} className="group block cursor-pointer">
          <div className="magic-border bg-[#0A0A0A] rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,100,255,0.1)]">
            <div className="h-64 md:h-96 w-full relative overflow-hidden bg-gradient-to-br from-blue-900/10 to-black">
              <img src={latestArticle.thumbnail_url} alt={latestArticle.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>
            </div>
            <div className="p-8 md:p-12 relative z-10 -mt-20">
              <h3 className="text-2xl md:text-4xl font-medium mb-8 max-w-3xl leading-snug">{latestArticle.title}</h3>
              <div className="flex items-center text-sm tracking-widest text-gray-400 group-hover:text-white transition-colors uppercase font-semibold">
                READ <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* --- Products Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="text-xs tracking-[0.2em] text-gray-500 uppercase font-semibold mb-8">[ PRODUCTS ]</p>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-16">AI for all humanity</h2>
            <div className="space-y-6 max-w-md">
              <h3 className="text-3xl font-medium">NoxyAI</h3>
              <p className="text-gray-400 text-lg leading-relaxed">NoxyAI is your cosmic guide, now accessible on web, iOS, and Android. Explore the universe with AI.</p>
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0">
            <div className="magic-border bg-gradient-to-b from-[#111] to-[#050505] rounded-[2.5rem] aspect-square flex flex-col justify-end p-8 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-shadow duration-500">
              <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700">
                <img src={noxyaiLogo} alt="NoxyAI" className="w-1/2 h-1/2 object-contain brightness-0 invert" />
              </div>
              <div className="relative z-10 self-end">
                <button className="magic-border bg-white/10 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all font-medium text-sm">
                  USE NOW <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Realities Component Replaced */}

      {/* --- Talk With Avatars Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center border-t border-white/5">
        <div className="flex flex-col items-center gap-12">
          {/* Einstein Morph Circle */}
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative" style={{ animation: 'orb-move-1 10s ease-in-out infinite alternate' }}>
            <img src="/einstein-photo-BGOcxese.jpg" alt="Albert Einstein Avatar" className="w-full h-full object-cover scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Talk with Avatars</h2>
          <p className="text-gray-400 text-xl max-w-2xl leading-relaxed">Experience dynamic, lifelike conversations with brilliant minds.</p>
          
          <a href="https://www.noxyai.com/public/avatars" className="magic-border px-8 py-4 rounded-full bg-white text-black font-semibold tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2">
            START TALKING <ArrowRight size={18} />
          </a>

          {/* Landscape Avatars Banner */}
          <div className="w-full mt-8 rounded-3xl overflow-hidden border border-white/10 relative group">
            <img src="/avatars-banner-DT1Pa3ly.png" alt="Avatars Landscape" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.2em] text-gray-500 uppercase font-semibold mb-4">[ SUPPORT ]</p>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-8 text-left">
          {[
            {
              q: "How do I cancel my subscription?",
              a: "Go to /subscription and click Cancel. Cancellations are allowed during the first 3 days of each billing cycle."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept payments via stripe, supporting credit cards, debit cards and net banking."
            },
            {
              q: "What happens if I exceed my token limit?",
              a: "NoxyAI does not use token-based limits. Free plan gives access to basic models with unlimited usage. Pro plan offers unlimited access to all models."
            },
            {
              q: "How do I request a refund?",
              a: "Email support@noxyai.com within 7 days of purchase. Refunds are issued only for verified technical issues."
            },
            {
              q: "How many AI models can Pro users access?",
              a: "Pro users have access to all available models and can switch between them at any time."
            },
            {
              q: "Can I switch models during a conversation?",
              a: "Yes. Pro users can switch models at any time. The new model will not retain context from earlier messages."
            }
          ].map((faq, i) => (
            <div key={i} className="border-b border-white/10 pb-6 group cursor-pointer hover:border-white/30 transition-colors">
              <h3 className="text-xl font-medium text-white group-hover:text-blue-400 transition-colors mb-3">{faq.q}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Footer with VIBRANT Magic Motion --- */}
      <footer className="relative pt-40 pb-12 overflow-hidden border-t border-white/10 group">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-[35rem] bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10"></div>
          <div className="absolute top-[10%] left-[10%] w-[45rem] h-[45rem] bg-cyan-600/40 rounded-full blur-[100px] mix-blend-screen" style={{ animation: 'orb-move-1 18s ease-in-out infinite' }}></div>
          <div className="absolute top-[20%] right-[10%] w-[40rem] h-[40rem] bg-purple-600/50 rounded-full blur-[100px] mix-blend-screen" style={{ animation: 'orb-move-2 20s ease-in-out infinite' }}></div>
          <div className="absolute bottom-[-10%] left-[35%] w-[50rem] h-[50rem] bg-orange-500/40 rounded-full blur-[120px] mix-blend-screen" style={{ animation: 'orb-move-3 22s ease-in-out infinite' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-24 relative">
            {[
              { title: "TRY NURATIX.COM ON", links: [{name: "Web", url: "https://noxyai.com"}, {name: "Android", url: "https://noxyai.com"}] },
              { title: "PRODUCTS", links: [{name: "NoxyAI", url: "https://noxyai.com"}, {name: "Image", url: "https://noxyai.com/image"}] },
              { title: "COMPANY", links: [{name: "About Us", url: "https://aboutus.nuratix.com"}, {name: "Blog", url: "https://blog.noxyai.com"}, {name: "Support", url: "https://support.noxyai.com"}] },
              { title: "LEGAL", links: [{name: "Privacy", url: "https://policies.noxyai.com/privacy"}, {name: "Terms", url: "https://policies.noxyai.com/terms"}, {name: "Community", url: "https://community.noxyai.com"}] },
              { title: "SOCIALS", links: [{name: "Follow Us", url: "https://linktree.noxyai.com"}] }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col gap-6 text-sm">
                <h4 className="text-gray-300 tracking-[0.2em] uppercase font-semibold text-xs mb-2 drop-shadow-md">{col.title}</h4>
                {col.links.map((link, lIdx) => (
                  <a key={lIdx} href={link.url} className="text-white hover:text-white inline-block transition-all duration-300 hover:translate-x-1 hover:-translate-y-0.5 drop-shadow-md font-medium">{link.name}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/20 gap-4 relative z-20">
            <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
              <img src={nuratixLogo} alt="Nuratix" className="h-6" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
            </div>
            <p className="text-gray-300 text-sm font-medium drop-shadow-md">© 2025 nuratix.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
      </main>
    </div>
  );
}

const images = [
  "/img23.png",
  "/tn.jpeg",
  "/tn (1).jpeg",
  "/tn (2).jpeg",
  "/tn (3).jpeg",
  "/tn (4).jpeg",
];

const Skiper34 = () => {
  return (
    <ReactLenis root>
      <section className="relative flex w-screen flex-col items-center gap-[10vh] px-4 pt-[20vh] pb-[20vh]">
        <div className="absolute left-1/2 top-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            scroll down
          </span>
        </div>
        {images.map((img, idx) => (
          <StickyCard_003 key={idx} imgUrl={img} />
        ))}
        {/* Generate Images CTA */}
        <div className="flex flex-col items-center justify-center mt-32 mb-16 gap-6 relative z-30">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Generate images with AI and more etc
          </h2>
          <a href="https://noxyai.com/image" className="px-8 py-4 rounded-full bg-white text-black font-semibold tracking-wider hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            IMAGEN
          </a>
        </div>
      </section>
    </ReactLenis>
  );
};

const StickyCard_003 = ({ imgUrl }: { imgUrl: string }) => {
  const vertMargin = 10;
  const container = useRef(null);
  const [maxScrollY, setMaxScrollY] = useState(Infinity);

  const filter = useMotionValue(0);
  const negateFilter = useTransform(filter, (value: number) => -value);

  const { scrollY } = useScroll({
    target: container,
  });
  
  const scale = useTransform(scrollY, [maxScrollY, maxScrollY + 1200], [1, 0]);
  const isInView = useInView(container, {
    margin: `0px 0px -${100 - vertMargin}% 0px`,
    once: true,
  });

  scrollY.on("change", (scrollYValue) => {
    let animationValue = 1;
    if (scrollYValue > maxScrollY) {
      animationValue = Math.max(0, 1 - (scrollYValue - maxScrollY) / 1200);
    }
    scale.set(animationValue);
    filter.set((1 - animationValue) * 100);
  });

  useEffect(() => {
    if (isInView) {
      setMaxScrollY(scrollY.get());
    }
  }, [isInView, scrollY]);

  return (
    <motion.div
      ref={container}
      className="rounded-[3rem] sticky h-[200px] w-full max-w-5xl overflow-hidden bg-neutral-900 shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10"
      style={{
        scale: scale,
        rotate: filter,
        height: `${100 - 2 * vertMargin}vh`,
        top: `${vertMargin}vh`,
      }}
    >
      <motion.img
        src={imgUrl}
        alt={imgUrl}
        style={{
          rotate: negateFilter,
        }}
        className="h-full w-full scale-125 object-cover"
        sizes="90vw"
      />
    </motion.div>
  );
};
