import React from 'react';
import { ArrowUpRight, Zap, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface HomeHeroProps {
  setCurrentTab: (tab: string) => void;
}

export default function HomeHero({ setCurrentTab }: HomeHeroProps) {
  const stats = [
    { value: "13+", label: "Years Experience", desc: "Enterprise operations" },
    { value: "500+", label: "Projects Completed", desc: "Delivered on-time" },
    { value: "Global", label: "Client Base", desc: "Scaling boundaries" },
    { value: "100%", label: "Client Satisfaction", desc: "Exceptional reviews" }
  ];

  return (
    <section id="hero-section" className="relative shrink-0 overflow-hidden pt-12 pb-24 md:py-32">
      {/* Decorative dark background ambient mesh gradient overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full"></div>
        <div className="absolute top-2/3 right-1/2 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Futuristic glowing badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full w-auto backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-400">
              Where Creativity Meets Artificial Intelligence
            </span>
          </div>
        </div>

        {/* Core Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white font-sans bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Transforming Ideas Into<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] filter drop-shadow-md">
              Intelligent Solutions
            </span>
          </h1>
          <p className="mt-8 text-md sm:text-lg text-white/50 font-normal leading-relaxed text-center max-w-2xl mx-auto">
            <strong className="text-white">PIXEL AICORE & NEXBOT</strong> delivers enterprise-grade AI innovation, high-performance web architecture, and digital transformation services for the world's most ambitious startups.
          </p>
        </div>

        {/* Action Call to buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 z-10 relative">
          <button
            id="btn-hero-contact"
            onClick={() => setCurrentTab('contact')}
            className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] rounded-xl font-bold text-sm tracking-wide text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Get Started Now</span>
            <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
          </button>
          
          <button
            id="btn-hero-portfolio"
            onClick={() => setCurrentTab('portfolio')}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-sm tracking-wide text-slate-200 transition-all duration-300 cursor-pointer backdrop-blur-sm hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>View Our Portfolio</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Glassmorphic Statistics panels structured in a polished grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 border-t border-white/5 pt-16">
          {stats.map((stat, idx) => {
            // Pick a beautiful color bar matching the design assets
            const colors = [
              "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
              "bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]",
              "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]",
              "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            ];
            const colorBar = colors[idx] || colors[0];

            return (
              <div 
                key={idx}
                id={`stat-box-${idx}`}
                className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl group hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                  {stat.label}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  {stat.desc}
                </div>
                <div className={`mt-4 h-1 w-12 ${colorBar} rounded-full`}></div>
              </div>
            );
          })}
        </div>

        {/* Ticker logos or feature tags section for validation */}
        <div className="mt-24 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-6">
            Leading Businesses Trust Pixel AICore & Nexbot
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {["Next.js Core", "Rest APIs", "Security Hardening", "PayPal Secured", "Zero-Trust Firestore"].map((tech, idx) => (
              <span key={idx} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors tracking-widest uppercase">
                // {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
