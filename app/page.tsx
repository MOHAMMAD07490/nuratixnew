"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, ArrowUp, ArrowRight, Image as ImageIcon, X, Sparkles, User, Activity, Globe as GlobeIcon } from 'lucide-react';
import createGlobe from "cobe";

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

// --- Interactive WebGL Globe Component ---
function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef<number>(0);

  useEffect(() => {
    let currentWidth = 0;
    const onResize = () => {
      if (canvasRef.current) {
        currentWidth = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Prevent cobe from crashing if width is 0 during initial mount
    if (currentWidth === 0) currentWidth = 400; 

    let phi = 0;
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: currentWidth * 2,
      height: currentWidth * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [0.1, 0.1, 0.1], // Dark gray
      markerColor: [1, 1, 1], // White markers
      glowColor: [0.05, 0.05, 0.05],
      markers: [
        { location: [40.7128, -74.006], size: 0.07 }, // USA (New York)
        { location: [25.2048, 55.2708], size: 0.08 }, // Dubai
        { location: [20.5937, 78.9629], size: 0.1 },  // India
      ],
      onRender: (state: any) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = currentWidth * 2;
        state.height = currentWidth * 2;
      }
    } as any);

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 100);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`absolute inset-0 mx-auto aspect-square w-full max-w-[600px] flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-1000 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          if(canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if(canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if(canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
      />
    </div>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const latestArticle = {
    title: "Google Meets AI: How NoxyAI Supercharges Gmail, Drive, and Sheets",
    url: "/blog/145b93d5",
    thumbnail_url: "https://conjfpheubfkpmmhvswj.supabase.co/storage/v1/object/public/thumbnails/bc796316-1782492391573.png"
  };
  const nuratixLogo = "https://nuratix.com/logo.png";
  const noxyaiLogo = "https://noxyai.com/logo-white.png";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-white/30 overflow-x-hidden">
      {/* --- Global Styles for Animations & Magic UI --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-chat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
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

        /* Footer Gradient Sweeps */
        @keyframes orb-move-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          33% { transform: translate(25vw, -15vh) scale(1.3); opacity: 1; }
          66% { transform: translate(-10vw, 15vh) scale(0.9); opacity: 0.7; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
        }
        @keyframes orb-move-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          33% { transform: translate(-20vw, 20vh) scale(1.2); opacity: 0.9; }
          66% { transform: translate(25vw, -10vh) scale(1.4); opacity: 0.6; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
        }
        @keyframes orb-move-3 {
          0% { transform: translate(0, 0) scale(1.2); opacity: 0.7; }
          50% { transform: translate(15vw, 15vh) scale(0.9); opacity: 1; }
          100% { transform: translate(0, 0) scale(1.2); opacity: 0.7; }
        }

        /* Animated White Beams */
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
          animation: beam-flow-anim 2s linear infinite;
          filter: drop-shadow(0 0 5px rgba(255,255,255,0.8));
        }

        /* Utilities */
        .magic-border { position: relative; }
        .magic-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(255,255,255,0.05), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .bento-card {
          background: radial-gradient(150% 150% at 50% 0%, rgba(20,20,25,1) 0%, rgba(5,5,5,1) 100%);
        }
      `}} />

      {/* --- Navigation --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <img src={nuratixLogo} alt="Nuratix" className="h-6 md:h-7 group-hover:opacity-80 transition-opacity" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
              TRY NOXYAI
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black/95 z-40 backdrop-blur-3xl transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl font-medium">
          <a href="#" className="hover:text-gray-400 transition-colors">Products</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Company</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Blog</a>
          <button className="mt-4 px-8 py-3 rounded-full bg-white text-black text-lg font-medium hover:bg-gray-200 transition-colors">
            TRY NOXYAI
          </button>
        </div>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105">
            <source src="https://duzutjzl3g9ejjou.private.blob.vercel-storage.com/238264.mp4?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfRHV6VVRqWkwzZzllampvVSIsIm93bmVySWQiOiJ0ZWFtX1RudmdYdEdSM0luVGZXTXUxaFREWEMyeCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyNDk2NTMwMDMyLCJpYXQiOjE3ODI0NTMzMzEwMjF9.27SPHG1DaledMf_dd2aGWQDAf-V0y20lSzX8E7prdpM&vercel-blob-signature=9kRsROI-LMFDWLVy3UBw1UV6W5mhS_s4aJf3PH2RjDI" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#030303]"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-32 flex flex-col items-center text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter leading-[0.9] mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/20 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Understand<br />The Universe
            </span>
          </h1>
          <div className="w-full max-w-md mx-auto group">
            <div className="relative magic-border bg-white/5 backdrop-blur-xl rounded-[2rem] p-2 flex items-center transition-all duration-300 group-hover:bg-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <input type="text" placeholder="Ask anything..." className="w-full bg-transparent border-none outline-none px-6 py-3 text-lg placeholder-white/40 text-white" />
              <button className="bg-white text-black p-3 rounded-full hover:scale-105 transition-transform flex-shrink-0">
                <ArrowUp size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Trusted Logo Ticker --- */}
      <section className="py-12 border-b border-white/5 bg-[#030303] overflow-hidden">
        <p className="text-center text-xs tracking-widest text-gray-500 uppercase font-semibold mb-8">Trusted by fast-growing startups</p>
        <div className="flex w-[200%] md:w-[150%]">
          <div className="flex w-1/2 justify-around items-center animate-[marquee_20s_linear_infinite]">
            {['OpenAI', 'Retool', 'Stripe', 'Wise', 'Loom', 'Medium', 'Cash App', 'Linear'].map((logo, i) => (
              <div key={i} className="text-xl md:text-2xl font-bold text-white/30 hover:text-white/60 transition-colors px-8 font-serif tracking-tight">{logo}</div>
            ))}
          </div>
          <div className="flex w-1/2 justify-around items-center animate-[marquee_20s_linear_infinite]">
            {['OpenAI', 'Retool', 'Stripe', 'Wise', 'Loom', 'Medium', 'Cash App', 'Linear'].map((logo, i) => (
              <div key={i+10} className="text-xl md:text-2xl font-bold text-white/30 hover:text-white/60 transition-colors px-8 font-serif tracking-tight">{logo}</div>
            ))}
          </div>
        </div>
      </section>

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

          {/* Card 2: Charts */}
          <div className="magic-border bento-card rounded-3xl p-8 min-h-[400px] flex flex-col justify-between group overflow-hidden">
            <div className="relative h-48 w-full mt-8">
              <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 80 Q 40 70 80 50 T 160 30 T 200 60" fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="300" strokeDashoffset="300" style={{ animation: 'draw-line 2s ease forwards' }} />
                <path d="M 0 80 Q 40 70 80 50 T 160 30 T 200 60 L 200 100 L 0 100 Z" fill="url(#fillGrad)" className="opacity-0 animate-[fade-in_1s_ease_1s_forwards]" />
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 transform translate-x-[80px] translate-y-[50px]">
                  <circle r="4" fill="white" />
                  <circle r="12" fill="none" stroke="white" strokeWidth="1" className="animate-[pulse-ring_2s_infinite]" />
                  <rect x="-20" y="-35" width="40" height="20" rx="4" fill="black" stroke="rgba(255,255,255,0.2)" />
                  <text x="0" y="-22" fill="white" fontSize="10" textAnchor="middle">2,101</text>
                </g>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Instant Insight Reporting</h3>
              <p className="text-gray-400 text-sm">Transform raw data into clear insights in seconds. Empower smarter decisions with real-time, always-learning intelligence.</p>
            </div>
          </div>

          {/* Card 3: Automation */}
          <div className="magic-border bento-card rounded-3xl p-8 min-h-[400px] flex flex-col justify-between group overflow-hidden">
            <div className="relative h-48 w-full flex items-center justify-center">
               <div className="w-full max-w-[80%] space-y-3">
                  <div className="flex text-[10px] text-gray-500 justify-between px-4 mb-2">
                    <span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                  </div>
                  <div className="h-8 bg-blue-600 rounded-full w-full relative flex items-center justify-center text-xs font-medium group-hover:scale-[1.02] transition-transform">
                    <div className="absolute top-[-25px] bg-black border border-white/10 px-2 py-1 rounded text-[10px]">12:00 AM</div>
                    <div className="absolute top-[-10px] bottom-[-60px] w-px bg-white/20 left-1/2"></div>
                    Bento Grid
                  </div>
                  <div className="h-8 bg-blue-500/40 rounded-full w-3/4 ml-auto flex items-center justify-center text-xs font-medium border border-blue-400/20 group-hover:bg-blue-500/60 transition-colors">
                    Landing Page
                  </div>
                  <div className="h-8 bg-white/5 border border-dashed border-white/20 rounded-full w-1/2 ml-10 flex items-center justify-center text-xs text-gray-400 group-hover:border-white/40 transition-colors">
                    + Add Task
                  </div>
               </div>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Smart Automation</h3>
              <p className="text-gray-400 text-sm">Set it, forget it. Your AI Agent tackles repetitive tasks so you can focus on strategy, innovation, and growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Connect Google Workspace (Animated Beams UI) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-400 mb-6 font-medium tracking-wide">
              <Activity size={16} /> Connect Apps
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Connect your Google Workspace with NoxyAI</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Deploy intelligent agents that securely connect to your workspace. Search through Gmail, Google Sheets, and Google Drive to synthesize answers in real-time.
            </p>
          </div>

          {/* Absolute Positioned Beam Visualizer */}
          <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center rounded-3xl overflow-hidden magic-border bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]">
            
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" preserveAspectRatio="none">
              <defs>
                <filter id="beam-glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Static faint paths */}
              <path d="M 20% 20% L 50% 50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
              <path d="M 20% 50% L 50% 50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
              <path d="M 20% 80% L 50% 50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
              <path d="M 50% 50% L 80% 50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />

              {/* Glowing animated white paths */}
              <path d="M 20% 20% L 50% 50%" pathLength="100" className="animated-beam-glow" filter="url(#beam-glow)" style={{ animationDelay: '0s' }} />
              <path d="M 20% 50% L 50% 50%" pathLength="100" className="animated-beam-glow" filter="url(#beam-glow)" style={{ animationDelay: '1.2s' }} />
              <path d="M 20% 80% L 50% 50%" pathLength="100" className="animated-beam-glow" filter="url(#beam-glow)" style={{ animationDelay: '2.4s' }} />
              <path d="M 50% 50% L 80% 50%" pathLength="100" className="animated-beam-glow" filter="url(#beam-glow)" style={{ animationDelay: '0.6s' }} />
            </svg>

            {/* Floating Nodes */}
            <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
              
              {/* Drive Node */}
              <div className="absolute left-[20%] top-[20%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/20 bg-[#0A0A0A] p-3 md:p-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <img src="https://www.noxyai.com/google-drive.png" alt="Drive" className="w-full h-full object-contain brightness-0 invert" />
              </div>

              {/* Sheets Node */}
              <div className="absolute left-[20%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/20 bg-[#0A0A0A] p-3 md:p-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <img src="https://www.noxyai.com/google-sheets.png" alt="Sheets" className="w-full h-full object-contain brightness-0 invert" />
              </div>

              {/* Gmail Node */}
              <div className="absolute left-[20%] top-[80%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/20 bg-[#0A0A0A] p-3 md:p-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <img src="https://www.noxyai.com/gmail.png" alt="Gmail" className="w-full h-full object-contain brightness-0 invert" />
              </div>

              {/* Center NoxyAI Node */}
              <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full border border-white/30 bg-[#050505] p-5 shadow-[0_0_30px_rgba(255,255,255,0.15)] pointer-events-auto">
                <img src={noxyaiLogo} alt="NoxyAI" className="w-full h-full object-contain brightness-0 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>

              {/* Output User Node */}
              <div className="absolute left-[80%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/20 bg-[#111111] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <User className="text-white w-6 h-6 md:w-8 md:h-8" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- Globe / Global Reach Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-400 mb-6 font-medium tracking-wide uppercase">
              <GlobeIcon size={16} /> Active in 120+ countries worldwide
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Trusted by teams at rapidly growing startups.</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Developers choose our AI agents to accelerate development. Join the global movement toward intelligent coding. Trusted by teams in hubs like <span className="text-white font-medium">India</span>, <span className="text-white font-medium">Dubai</span>, and the <span className="text-white font-medium">USA</span>.
            </p>
          </div>

          <div className="relative flex h-[400px] md:h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] magic-border">
            <Globe />
            {/* Ambient Overlay to blend edges */}
            <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_80px_rgba(3,3,3,1)]"></div>
          </div>
        </div>
      </section>

      {/* --- Cosmic Intelligence (Clean Orbiting Models) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-semibold tracking-[0.2em] uppercase">
              <Sparkles size={16} /> POWERED BY WORLD-CLASS AI MODELS
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">Cosmic Intelligence, In Depth</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              A premium core, sculpted in light and glass — engineered for clarity, speed and depth.
            </p>
          </div>

          {/* Clean Orb Component */}
          <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl">
            
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

      {/* --- Visual Realities Section --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">VISUAL<br/>REALITIES</h2>
        <p className="text-gray-400 text-xl max-w-2xl leading-relaxed mb-12">Generate stunning, hyper-realistic images from simple text descriptions. Turn your cosmic imagination into reality.</p>
        <button className="magic-border bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md px-8 py-4 rounded-full flex items-center gap-3 hover:scale-105 transition-all duration-300 mb-16 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <span className="font-semibold tracking-wider text-sm uppercase">CREATE IMAGES</span><ImageIcon size={20} />
        </button>
        <div className="w-full rounded-[2.5rem] overflow-hidden relative magic-border">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" alt="AI Generated Reality" className="w-full h-[50vh] md:h-[70vh] object-cover hover:scale-105 transition-transform duration-[2s] ease-in-out" />
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24 relative">
            {[
              { title: "TRY NURATIX.COM ON", links: ["Web", "Android"] },
              { title: "PRODUCTS", links: ["NoxyAI", "Image"] },
              { title: "COMPANY", links: ["About Us", "Blog", "Support"] },
              { title: "LEGAL", links: ["Privacy", "Terms", "Community"] }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col gap-6 text-sm">
                <h4 className="text-gray-300 tracking-[0.2em] uppercase font-semibold text-xs mb-2 drop-shadow-md">{col.title}</h4>
                {col.links.map((link, lIdx) => (
                  <a key={lIdx} href="#" className="text-white hover:text-white inline-block transition-all duration-300 hover:translate-x-1 hover:-translate-y-0.5 drop-shadow-md font-medium">{link}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/20 gap-4 relative z-20">
            <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
              <img src={nuratixLogo} alt="Nuratix" className="h-6 brightness-0 invert" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
            </div>
            <p className="text-gray-300 text-sm font-medium drop-shadow-md">© 2025 nuratix.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
