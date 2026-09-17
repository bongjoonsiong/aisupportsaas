import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  LayoutDashboard, 
  ChevronDown, 
  User, 
  Bot,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

interface PublicNavbarProps {
  currentTab: 'home' | 'pricing' | 'features' | 'demo';
  onSelectTab: (tab: 'home' | 'pricing' | 'features' | 'demo') => void;
  onOpenAuthModal: () => void;
  onGoToDashboard: () => void;
  onOpenLiveSimulator: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuthModal,
  onGoToDashboard,
  onOpenLiveSimulator
}) => {
  const { user, currentOrg } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => {
            onSelectTab('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 group-hover:bg-blue-700 transition-colors flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              OmniDesk <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">AI</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium leading-none">Autonomous Support Platform</p>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'home'
                ? 'bg-white text-blue-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onSelectTab('features')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'features'
                ? 'bg-white text-blue-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Features &amp; RAG
          </button>

          <button
            onClick={() => onSelectTab('pricing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'pricing'
                ? 'bg-white text-blue-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Pricing Plans
          </button>

          <button
            onClick={onOpenLiveSimulator}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white/80 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Interactive Demo</span>
          </button>
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm hover:shadow"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
                <span className="hidden sm:inline text-[10px] bg-blue-500/50 px-1.5 py-0.5 rounded font-black uppercase">
                  {currentOrg.name}
                </span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onOpenAuthModal}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs md:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Customer Sign In
              </button>

              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm hover:shadow"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentTab === 'home' ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('features');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentTab === 'features' ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Features &amp; RAG Architecture</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('pricing');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentTab === 'pricing' ? 'bg-blue-50 text-blue-600 font-black' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Pricing Plans</span>
          </button>

          <button
            onClick={() => {
              onOpenLiveSimulator();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Interactive Live Storefront Simulator</span>
          </button>

          {!user && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Sign In to Customer Workspace
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
