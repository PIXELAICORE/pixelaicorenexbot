import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, Calendar, Sparkles, CheckCircle, Shield } from 'lucide-react';

interface ContactViewProps {
  prefilledService?: string;
  onBookConsultation: () => void;
}

export default function ContactView({ prefilledService, onBookConsultation }: ContactViewProps) {
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState(prefilledService || 'AI Solutions & Automation');
  const [budget, setBudget] = useState('$5,000 - $10,000');
  const [message, setMessage] = useState('');

  // Status controls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReport, setSuccessReport] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (prefilledService) {
      setProjectType(prefilledService);
    }
  }, [prefilledService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessReport(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          projectType,
          budget,
          message,
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessReport(`Thank you, ${name}! Your strategic outline has been successfully cataloged under Lead reference: #${data.id.substring(0, 8).toUpperCase()}.`);
        // Reset inputs
        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
        setMessage('');
      } else {
        setErrorMessage(data.error || "Failed to catalog contact session.");
      }
    } catch (err: any) {
      setErrorMessage("Network error: Could not submit lead records.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    'AI Solutions & Automation',
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Branding & Graphic Design',
    'Firestore Database Solutions',
    'Backend API Development',
    'PayPal Integration',
    'Photo Editing',
    'Amazon KDP Design',
    'Custom consultation / advisory brief'
  ];

  const budgets = [
    'Under $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+'
  ];

  return (
    <section id="contact-section" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-3 py-1 text-xs text-cyan-300 font-semibold mb-4 tracking-wider uppercase">
            <span>Corporate Communications</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Inquire Strategic Partners
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Submit your dynamic requirements, operational budgets, and technical objectives. Our system schedules briefings within 4 SLA hours.
          </p>
        </div>

        {/* Contact Page dual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Info channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-white">Pixel-HQ Contact Hub</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect directly with our architects to analyze schemas, review PayPal checkout APIs, or outline complete brand guideline assets.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-sm">408/A, Dehigahawela Maha Induruwa, Sri Lanka</span>
                </div>
                
                <div className="flex items-center space-x-3 text-slate-300">
                  <Mail className="w-5 h-5 text-purple-400 shrink-0" />
                  <span className="text-sm">pixelaicorenexbot@gmail.com</span>
                </div>

                <div className="flex items-center space-x-3 text-slate-300">
                  <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-sm">+94775304888</span>
                </div>
              </div>
            </div>

            {/* Strategy Consultation Booking Callout widget */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-blue-500/20 backdrop-blur-xl space-y-6 hover:scale-[1.01] transition-transform">
              <div className="flex items-center space-x-3 text-amber-400">
                <Calendar className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wider uppercase">Instant Strategy Briefings</span>
              </div>
              <h4 className="text-lg font-bold text-white">Book an Executive Meeting Now</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Skip form filing and instantly reserve an direct hourly strategy appointment with our AI solutions directors. Select free or paid options.
              </p>
              <button
                onClick={onBookConsultation}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest cursor-pointer hover:shadow-lg hover:shadow-blue-600/15 transition-all text-center"
              >
                Schedule Meeting Slot
              </button>
            </div>
          </div>

          {/* Right panel: Active dynamic intake form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-xl relative">
              
              {isSubmitting && (
                <div className="absolute inset-0 rounded-3xl bg-slate-950/70 backdrop-blur-sm z-20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-blue-400 animate-spin mx-auto"></div>
                    <p className="text-xs text-slate-400 tracking-widest uppercase">Archiving lead parameters...</p>
                  </div>
                </div>
              )}

              {successReport ? (
                /* Success report feedback block */
                <div className="text-center py-8 space-y-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-extrabold text-white">Leads Saved In Firestore</h4>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                      {successReport}
                    </p>
                  </div>
                  <button
                    onClick={() => setSuccessReport(null)}
                    className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                /* Main form container */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Dr. John Stark"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-[#3B82F6] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Primary Email *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@starkindustries.com"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-[#3B82F6] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Contact Phone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+94775304888"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-[#3B82F6] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Company Organism</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Stark Industries"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-[#3B82F6] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Requested Directive</label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-none"
                      >
                        {projectTypes.map(t => (
                          <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Estimated Budget SLA</label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-none"
                      >
                        {budgets.map(b => (
                          <option key={b} value={b} className="bg-slate-900 text-white">{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Message / Requirements Script *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="Outline your tech challenges, databases needs, or brand system criteria..."
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-white/5 text-sm text-white focus:border-blue-500 focus:outline-[#3B82F6] transition-colors"
                    ></textarea>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-950/45 border border-red-500/20 text-xs text-red-400 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Shield className="w-4 h-4 text-slate-600" />
                      <span>Data compiled under strictly safe compliance</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      Audit & Send Leads &rarr;
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
