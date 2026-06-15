import React from 'react';
import { Target, Compass, Award, Users, Milestone, ShieldCheck } from 'lucide-react';

export default function AboutView() {
  const milestones = [
    { year: "2013", title: "Foundation in San Francisco", desc: "Pixel AICore starts as a small layout and database consultancy firm." },
    { year: "2016", title: "Merger with NexBot Labs", desc: "Joined forces with a leading cognitive automation team to scale research." },
    { year: "2020", title: "Multi-Agent Launch", desc: "First deployment of autonomous machine-learning pipelines for logistics." },
    { year: "2026", title: "Global Scaling Expansion", desc: "Serving 500+ global brands with high-trust Firestore setups." }
  ];

  const team = [
    { name: "Dr. Alexander Sterling", role: "Co-Chief Exec & AI Principal", quote: "Solving high-dimension scale needs premium UI and security invariants." },
    { name: "Yuki Takahashi", role: "Chief Design Architect", quote: "Visual balance isn't generic; it's a deliberate pairing of negative space." },
    { name: "Christopher Vance", role: "Lead Systems Engineer", quote: "Hardened Firestore rules and Express endpoints form a bulletproof core." }
  ];

  return (
    <section id="about-section" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* About Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs text-purple-300 font-semibold mb-4 tracking-wider uppercase">
            <span>Corporate Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            The Pixel AICore Legacy
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Pioneering autonomous web infrastructures, secure database security architectures, and premium graphic design systems for international enterprise businesses.
          </p>
        </div>

        {/* Company Story & Cohesive Mission/Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          
          {/* Main Story Paragraphs */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Where Creativity Meets Artificial Intelligence</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Founded over 13 years ago, Pixel AICore was bootstrapped on a simple premise: technology should not only perform efficiently, but possess absolute visual and UX superiority. Our team merged with NexBot Labs in 2016, driving deep cognitive research into practical SaaS applications.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Today, our dual focus encompasses cutting-edge AI Agent solutions, automated PayPal multi-tier workflows, and zero-trust Firestore access guidelines that protect corporate assets from exploits. We deliver flawless, production-ready systems for agencies and publishers worldwide.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <span className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-green-400 bg-green-950/20 px-4 py-2 rounded-full border border-green-500/20">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Trust Audited</span>
              </span>
              <span className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/20 px-4 py-2 rounded-full border border-blue-500/20">
                <Award className="w-4 h-4" />
                <span>13+ Years Excellence</span>
              </span>
            </div>
          </div>

          {/* Mission and Vision Bento Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Mission Box */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 hover:border-purple-500/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Our Mission</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                To build high-performance software systems that eliminate mundane workflows, empowering international brands to scale with cognitive automations.
              </p>
            </div>

            {/* Vision Box */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-10 h-10 rounded-lg bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Our Vision</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                To create a seamless unified digital landscape where complex AI automations are governed by pristine typography and zero-trust security profiles.
              </p>
            </div>

          </div>
        </div>

        {/* Milestone Timeline Map */}
        <div className="border-t border-white/5 pt-20 mb-24">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-12 text-center flex items-center justify-center">
            <Milestone className="w-5 h-5 mr-3 text-cyan-400" />
            Corporate Milestones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m) => (
              <div key={m.year} className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 relative group hover:border-blue-500/50 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]">
                <span className="text-xs font-mono font-bold text-[#3B82F6]">{m.year}</span>
                <h4 className="text-base font-bold text-slate-200 mt-2 mb-1.5">{m.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Team Members section */}
        <div id="team-section" className="border-t border-white/5 pt-20">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-12 text-center flex items-center justify-center">
            <Users className="w-5 h-5 mr-3 text-purple-400" />
            Executive Leadership
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 text-center flex flex-col justify-between backdrop-blur-xl hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]">
                <div>
                  <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400 font-bold mb-6">
                    {t.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <h4 className="text-lg font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-blue-400 font-mono tracking-widest mt-1 uppercase">{t.role}</p>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed mt-6 border-t border-white/5 pt-4">
                  "{t.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
