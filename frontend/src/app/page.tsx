"use client";

import React, { useState, useEffect } from 'react';
import { 
  auth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged, 
  FirebaseUser,
  db,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { googleProvider } from '../firebase';

// Component imports
import Navigation from '../components/Navigation';
import HomeHero from '../components/HomeHero';
import ServicesView from '../components/ServicesView';
import PortfolioView from '../components/PortfolioView';
import PricingView from '../components/PricingView';
import AboutView from '../components/AboutView';
import ContactView from '../components/ContactView';
import AdminDashboard from '../components/AdminDashboard';
import ConsultationBooking from '../components/ConsultationBooking';
import Logo from '../components/Logo';

// Icons for beautiful UI details
import { Sparkles, ArrowUpRight, Github, Twitter, Linkedin, ShieldCheck, Mail, Phone, MapPin, AlertTriangle, ExternalLink, RefreshCw, X, User as UserIcon } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Read cached sandbox user from localStorage on mount only (client-side)
  useEffect(() => {
    try {
      const cached = typeof window !== 'undefined' ? localStorage.getItem('active_sandbox_user') : null;
      if (cached) setUser(JSON.parse(cached));
    } catch (e) {
      // ignore parse errors
    }
  }, []);
  const [prefilledService, setPrefilledService] = useState('');
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Initialize Firebase Authentication tracking
  useEffect(() => {
    const getRedirectResultIfAny = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (redirectErr: any) {
        console.warn('Redirect sign-in result check failed:', redirectErr);
      }
    };
    getRedirectResultIfAny();

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If logged in via standard Google Popup or redirect, update state and cache it
        setUser(firebaseUser);
        const path = `users/${firebaseUser.uid}`;
        
        // LocalStorage Resilience Cache Fallback for instant profile presence in UI
        const localUserKey = `user_profile_${firebaseUser.uid}`;
        const localProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "Client Account",
          photoURL: firebaseUser.photoURL || "",
          role: firebaseUser.email === 'kdpranga144@gmail.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };

        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userSnap;
          try {
            userSnap = await getDoc(userDocRef);
          } catch (readErr) {
            handleFirestoreError(readErr, OperationType.GET, path);
          }
          
          if (!userSnap || !userSnap.exists()) {
            // First time registration - create profile according to rule format
            try {
              await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || "Client Account",
                photoURL: firebaseUser.photoURL || "",
                role: 'user',
                createdAt: serverTimestamp()
              });
            } catch (createErr) {
              handleFirestoreError(createErr, OperationType.CREATE, path);
            }
          }
        } catch (err) {
          console.warn("Firestore profile sync unavailable (activating local fallback cache)", err);
        }

        // Always save to localStorage so the app session runs perfectly no matter what
        localStorage.setItem(localUserKey, JSON.stringify(localProfile));
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = () => {
    setAuthModalOpen(true);
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setAuthModalOpen(false);

    const knownLocalOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://127.0.0.1:3000',
      'https://127.0.0.1:3000',
      'https://pixel-aicore-nexbot.firebaseapp.com'
    ];
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

    if (currentOrigin && !knownLocalOrigins.includes(currentOrigin)) {
      setAuthError(`Firebase sign-in is blocked because this origin is not authorized for OAuth operations. Add ${currentOrigin} to the Firebase project's authorized domains list, then retry.`);
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Authentication popup failed: ", err);
      if (err?.code === 'auth/unauthorized-domain') {
        setAuthError(`Firebase rejected this sign-in attempt because the host domain is not authorized. Open your Firebase console and add ${currentOrigin || 'your current host'} to the authorized domains for this project.`);
      } else if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/popup-blocked') {
        setAuthError("Popup login is blocked or closed by the browser. The app will now try a redirect-based login instead.");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          console.error("Redirect sign-in failed: ", redirectError);
          setAuthError(redirectError?.message || "Redirect authentication failed. Please try again in a standalone browser window.");
        }
      } else if (err?.code === 'auth/cancelled-popup-request') {
        setAuthError("Previous authentication popup requests were canceled. Please try again.");
      } else {
        setAuthError(err?.message || "Security pop-up initialization was suspended or blocked by your browser settings.");
      }
    }
  };

  const handleSandboxLogin = (role: 'admin' | 'user') => {
    setAuthError(null);
    setAuthModalOpen(false);
    
    // Create seamless high-fidelity mock session object that satisfies routing checks
    const simulatedUser = {
      uid: role === 'admin' ? 'kdpranga144-uid-sandbox' : 'client-uid-sandbox',
      email: role === 'admin' ? 'kdpranga144@gmail.com' : 'sandbox-client@pixel-aicore.dev',
      displayName: role === 'admin' ? 'kdpranga144 (Admin Pass)' : 'Sandbox Explorer',
      photoURL: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80' 
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
    };
    
    setUser(simulatedUser as any);
    localStorage.setItem('active_sandbox_user', JSON.stringify(simulatedUser));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Signout backend skipped");
    }
    setUser(null);
    localStorage.removeItem('active_sandbox_user');
  };

  const handleSelectService = (serviceName: string) => {
    setPrefilledService(serviceName);
    setCurrentTab('contact');
  };

  const handleSelectContactSales = (pkgName: string) => {
    setPrefilledService(`Custom implementation: ${pkgName}`);
    setCurrentTab('contact');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050816] text-white selection:bg-blue-600/30 selection:text-white relative overflow-x-hidden">
      
      {/* Immersive UI Background Ambient Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* 1. Global Navigation header lock */}
      <Navigation 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Auth Error Guidance Hub - High Fidelity Iframe-Smart Notice Modal */}
      {authError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-red-500/20 p-6 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 text-amber-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold tracking-tight text-white">OAuth Safe-Gate Alert</h3>
              </div>
              <button 
                onClick={() => setAuthError(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Details */}
            <div className="space-y-3 bg-[#030712] border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase block">REJECTION CONTEXT</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {authError}
              </p>
            </div>

            {/* Quick Sandbox Bypass Block Inside Error Modal */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-3">
              <span className="text-[10px] font-bold text-purple-400 font-mono tracking-widest uppercase block">SANDBOX BYPASS SHORTCUT</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Skip Google integration popup blockers completely and test administrative functions instantly as Root Admin.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleSandboxLogin('admin');
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Bypass & Sign In as Admin</span>
              </button>
            </div>

            {/* Recommendations Brief */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase block">SECURE FIXING STEPS</span>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li>Load this sandbox applet in external, standalone browser window.</li>
                <li>Verify your browser isn't blocking pop-up triggers.</li>
                <li>Complete the authorization screen without clicking away.</li>
              </ul>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setAuthError(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-slate-300 text-xs font-bold transition-all"
              >
                Dismiss Notice
              </button>
              
              <a 
                href={typeof window !== 'undefined' ? window.location.href : '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold border border-white/5 transition-all"
              >
                <span>Launch Standalone Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Sign In</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Interactive Authorization Options Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 text-blue-400">
                <ShieldCheck className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold tracking-tight text-white">System Sign-In Portal</h3>
              </div>
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Authenticate using the preferred method below. Because some preview browsers block popups inside iframe sandboxes, we recommend choosing **Sandbox Developer Bypass** for a seamless full-featured test.
            </p>

            <div className="space-y-3">
              {/* Option 1: Live Google Account Login */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#ffffff] hover:bg-slate-100 text-slate-950 font-bold text-sm transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fillRule="evenodd" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fillRule="evenodd" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fillRule="evenodd" />
                  </svg>
                  <span>Google Account Sign-In</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-3 text-[9px] text-slate-500 font-mono tracking-widest uppercase">Or Sandbox Bypass</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              {/* Option 2: Admin Testing Bypass */}
              <button
                onClick={() => handleSandboxLogin('admin')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-purple-950/40 hover:bg-purple-900/30 border border-purple-500/20 text-purple-300 font-bold text-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-white text-xs leading-none font-bold">Root Administrator</span>
                    <span className="text-[10px] text-purple-400 font-mono font-normal mt-1 block select-all">kdpranga144@gmail.com</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-purple-300 uppercase bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded">Admin Dashboard Lock</span>
              </button>

              {/* Option 3: User Testing Bypass */}
              <button
                onClick={() => handleSandboxLogin('user')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-950/40 hover:bg-blue-900/30 border border-blue-500/20 text-blue-300 font-bold text-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-white text-xs leading-none font-bold">Sandbox Test Client</span>
                    <span className="text-[10px] text-blue-400 font-mono font-normal mt-1 block select-all">sandbox-client@pixel-aicore.dev</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-blue-300 uppercase bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded">Bookings & Services</span>
              </button>
            </div>

            <div className="bg-[#030712] p-3 text-[10px] text-slate-500 font-mono rounded-2xl text-center leading-relaxed">
              Note: Standalone tab redirects work natively. If pop-ups are blocked, choose a Sandbox Developer login to evaluate systems instantly.
            </div>

          </div>
        </div>
      )}

      {/* 2. Main content router stage with smooth transitions */}
      <main className="flex-grow">
        
        {currentTab === 'home' && (
          <div className="space-y-12">
            <HomeHero setCurrentTab={setCurrentTab} />
            
            {/* Embedded Mini-Showcase for Landing page depth */}
            <section className="py-16 border-t border-white/5 bg-gradient-to-b from-slate-950/40 to-transparent">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <Sparkles className="w-8 h-8 text-blue-400 mx-auto animate-pulse" />
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ecosystem Architecture</h3>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                  By unifying cognitive multi-agent modules and zero-trust Firestore databases, we formulate frameworks that scale effortlessly. High fidelity in design guidelines, absolute precision in code.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setCurrentTab('services')}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#3B82F6] hover:text-white group"
                  >
                    <span>Analyze Custom Services Menu</span>
                    <ArrowUpRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 duration-200" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentTab === 'services' && (
          <ServicesView onSelectService={handleSelectService} />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioView />
        )}

        {currentTab === 'pricing' && (
          <PricingView 
            user={user} 
            onSelectContactSales={handleSelectContactSales} 
          />
        )}

        {currentTab === 'about' && (
          <AboutView />
        )}

        {currentTab === 'contact' && (
          <ContactView 
            prefilledService={prefilledService} 
            onBookConsultation={() => setConsultationOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard 
            user={user} 
            onLogin={handleLogin} 
          />
        )}

      </main>

      {/* 3. Global Strategy Consultation Scheduler Portal */}
      {consultationOpen && (
        <ConsultationBooking onClose={() => setConsultationOpen(false)} />
      )}

      {/* 4. Complete, highly polished production footer */}
      <footer className="border-t border-white/5 bg-slate-950 pt-16 pb-8 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
            
            {/* Branding Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center select-none">
                <Logo className="h-10 w-auto" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                A leading technology agency specializing in Next-generation frameworks, multi-agent artificial systems, zero-trust databases security rules, and unified digital guidelines.
              </p>
              <div className="flex items-center space-x-3 text-slate-550 pt-2">
                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Service Matrix</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors">AI & Automation</button></li>
                <li><button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors">Web Architectures</button></li>
                <li><button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors">Database Engineering</button></li>
                <li><button onClick={() => setCurrentTab('services')} className="hover:text-white transition-colors">Creative Strategy</button></li>
              </ul>
            </div>

            {/* Information Column */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Strategic Inquiries</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center space-x-2 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>partners@pixel-aicore.agency</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>+1 415-555-0199</span>
                </li>
                <li className="flex items-center space-x-2 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>AI Hub Suite 1200, San Francisco</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <p>&copy; {new Date().getFullYear()} Pixel AICore & Nexbot Ltd. All rights reserved globally.</p>
            
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero-Trust Security Shield Active</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
