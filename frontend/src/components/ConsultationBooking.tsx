import React, { useState } from 'react';
import { Calendar, Clock, Video, BookOpen, Check, AlertCircle } from 'lucide-react';

interface ConsultationBookingProps {
  onClose: () => void;
}

export default function ConsultationBooking({ onClose }: ConsultationBookingProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM (EST)');
  const [topic, setTopic] = useState('AI & Automation Strategy');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const timeSlots = [
    '09:00 AM - 10:00 AM (EST)',
    '10:00 AM - 11:00 AM (EST)',
    '11:00 AM - 12:00 PM (EST)',
    '02:00 PM - 03:00 PM (EST)',
    '03:00 PM - 04:00 PM (EST)',
    '04:00 PM - 05:00 PM (EST)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !date) {
      setErrorMsg("Please specify client details and calendar date.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientName,
          clientEmail,
          date,
          timeSlot,
          topic,
          description,
          paid: false
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Failed to compile booking parameters.");
      }
    } catch (err: any) {
      setErrorMsg("Connection failure schedules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="booking-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-cyan-300 animate-pulse" />
            <h3 className="text-base font-extrabold tracking-tight">Strategy Consultation Booking</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-400 font-semibold text-xs py-1 px-2.5 rounded hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="p-6">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="marcus@apex.dev"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Available Time slot *</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs text-white focus:outline-none"
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Briefing Topic Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. PayPal Webhook Validation Audit"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Goal Description (Optional)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What key queries or architectural outlines do we evaluate?"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs text-white focus:outline-none"
                ></textarea>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-xs text-red-400 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 cursor-pointer text-white font-bold text-xs uppercase tracking-widest transition-all"
              >
                {isSubmitting ? 'Reserving slot...' : 'Secure Appointment Slot'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">Consultation Reserved!</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Your strategy briefing is successfully saved in Firestore database. Meeting link guidelines have been sent to {clientEmail}.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white"
              >
                Back To Main Page
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
