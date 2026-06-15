import React, { useState } from 'react';
import { Menu, X, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { FirebaseUser } from '../firebase';
import Logo from './Logo';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navigation({ currentTab, setCurrentTab, user, onLogin, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'admin', label: 'Dashboard', icon: Shield }
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header id="site-header" className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050816]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Authentic high-fidelity corporate brand Logo - Fully Responsive & Precise */}
        <div 
          id="branding-logo" 
          onClick={() => handleTabClick('home')} 
          className="flex items-center cursor-pointer select-none group"
        >
          <Logo className="h-11 sm:h-14 w-auto transform group-hover:scale-[1.03] transition-all duration-300" />
        </div>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-blue-600/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 mr-1 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side user authentication flow */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3 bg-white/5 border border-white/5 pl-3 pr-2 py-1.5 rounded-full">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                  {user.displayName || 'Client Account'}
                </span>
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest leading-none">
                  {user.email === 'kdpranga144@gmail.com' ? 'ADMIN' : 'CLIENT'}
                </span>
              </div>
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-blue-500/30" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <button
                id="btn-nav-logout"
                onClick={onLogout}
                title="Sign Out"
                className="p-1 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-login"
              onClick={onLogin}
              className="px-5 py-2.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu triggers */}
        <div className="flex md:hidden items-center space-x-3">
          {user && (
            <img 
              src={user.photoURL || undefined} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-blue-500/20" 
            />
          )}
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="md:hidden border-t border-white/5 bg-slate-950 px-4 py-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex w-full items-center px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? 'text-white bg-blue-600/15 border-l-4 border-blue-500'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 mr-3" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{user.displayName || 'Authorized User'}</span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded bg-red-950/40 border border-red-500/20 text-xs text-red-400 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="w-full py-2.5 rounded-lg text-center font-semibold text-white bg-blue-600 hover:bg-blue-500"
              >
                Sign In With Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
