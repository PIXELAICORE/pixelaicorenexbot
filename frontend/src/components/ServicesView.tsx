import React from 'react';
import { SERVICES } from '../data';
import * as Icons from 'lucide-react';

interface ServicesViewProps {
  onSelectService: (serviceName: string) => void;
}

export default function ServicesView({ onSelectService }: ServicesViewProps) {
  return (
    <section id="services-section" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Services Page Header Layout */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-3 py-1 text-xs text-purple-300 font-semibold mb-4 tracking-wider uppercase">
            <span>Specialized Intelligence Operations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Elite Digital Architecture & Services
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            We operate at the forefront of digital excellence, offering specialized solutions to scale enterprise projects and automate business ecosystems.
          </p>
        </div>

        {/* Dynamic Service Grid (10 items) */}
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Cpu;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-blue-500/50 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 transform hover:-translate-y-1 block"
              >
                {/* Decorative glow panel */}
                <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>

                <div className="relative z-10">
                  {/* Category Pill Tag */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white/5 px-2.5 py-1 rounded">
                      {service.category}
                    </span>
                    <span className="text-xs font-semibold text-blue-400 font-mono tracking-wider">
                      Est. from {service.price}
                    </span>
                  </div>

                  {/* Icon wrapper */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-[#8B5CF6]/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:text-cyan-400 group-hover:border-blue-400/40 transition-colors mb-6 shadow-inner">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title and details */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Card Button footer */}
                <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-300 transition-colors">
                    SLA Checked Solution
                  </span>
                  <button
                    onClick={() => onSelectService(service.title)}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-blue-400 group-hover:text-white group-hover:translate-x-1 duration-200"
                  >
                    Discuss Quote
                    <Icons.ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature block warning for quality index */}
        <div className="mt-16 bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:border-blue-500/50 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-600/10 text-blue-400">
              <Icons.ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Need a dynamic, custom technology agreement?</h4>
              <p className="text-sm text-slate-400 mt-1">Our system supports specialized integrations, compliance auditing, and custom non-disclosure terms.</p>
            </div>
          </div>
          <button
            onClick={() => onSelectService("Custom Enterprise Solution")}
            className="w-full md:w-auto px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-slate-900 bg-white hover:bg-slate-200 transition-colors shrink-0"
          >
            Request Custom Brief
          </button>
        </div>

      </div>
    </section>
  );
}
