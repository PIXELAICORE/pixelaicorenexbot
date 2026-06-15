import React, { useState } from 'react';
import { PORTFOLIO } from '../data';
import { ExternalLink, Tag, Sparkles } from 'lucide-react';

export default function PortfolioView() {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'AI Projects', 'Mobile Apps', 'Business Websites', 'eCommerce Stores', 'Branding Projects'];

  const filteredItems = filter === 'All'
    ? PORTFOLIO
    : PORTFOLIO.filter(item => item.category === filter);

  return (
    <section id="portfolio-section" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-3 py-1 text-xs text-cyan-300 font-semibold mb-4 tracking-wider uppercase">
            <span>High-Fidelity Project Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Empowering Modern Brands
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Take a comprehensive look at previous digital transformations, multi-agent frameworks, interactive designs, and high-conversion assets delivered globally.
          </p>
        </div>

        {/* Filter Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-white/5 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`portfolio-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-white/5 hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Project Cards Grid with beautiful animation and image placeholders */}
        <div id="portfolio-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`portfolio-card-${item.id}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 backdrop-blur-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Card Image Area */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Visual gradient cover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D22] via-[#090D22]/40 to-transparent"></div>
                
                {/* Float tag */}
                <span className="absolute top-4 left-4 inline-flex items-center space-x-1.5 rounded-full bg-slate-950/85 px-3 py-1 text-[10px] font-bold tracking-wider text-cyan-400 uppercase border border-cyan-500/30 shadow-md">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span>{item.category}</span>
                </span>
              </div>

              {/* Card Body Details */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Vector Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[10px] font-semibold text-slate-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded"
                      >
                        <Tag className="w-2.5 h-2.5 mr-1 text-slate-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Active external showcase simulation */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[11px] font-mono text-slate-500">Case ID: {item.id.toUpperCase()}</span>
                    <a
                      href={item.link}
                      className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-white transition-colors"
                    >
                      Explore Audit
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty status check safety */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-[#090D22]/20 border border-white/5 rounded-3xl">
            <p className="text-slate-400 text-base">No deployment cases found for this classification query.</p>
          </div>
        )}

      </div>
    </section>
  );
}
