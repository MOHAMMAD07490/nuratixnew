import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#010103] flex items-center justify-center text-white selection:bg-white/30 relative overflow-hidden font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
        <div className="mb-8 relative">
          <h1 className="text-[12rem] md:text-[18rem] font-bold leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-overlay opacity-50">
             <div className="w-full h-full border border-white/20 rounded-full animate-[pulse-ring_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
          System Override
        </h2>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-12 font-light leading-relaxed">
          The node you are trying to reach has drifted into the void. Verify your coordinates or return to the main sequence.
        </p>
        
        <Link 
          href="/"
          className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2 tracking-wide font-semibold">
            RETURN TO BASE
          </span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-200 to-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} 
      />
    </div>
  );
}
