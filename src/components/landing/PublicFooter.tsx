import React from 'react';
import { Zap, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface PublicFooterProps {
  onSelectTab: (tab: 'home' | 'pricing' | 'features' | 'demo') => void;
  onOpenAuthModal: () => void;
  onOpenLiveSimulator: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onSelectTab,
  onOpenAuthModal,
  onOpenLiveSimulator
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      {/* Top Pre-Footer CTA */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="bg-gradient-to-r from-blue-900/40 via-slate-800 to-indigo-900/40 rounded-3xl p-8 md:p-12 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                14-Day Free Trial • No Credit Card Required
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Ready to automate 90% of your customer tickets?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Deploy your custom trained AI support chatbot in under 2 minutes. Integrate with Shopify, WordPress, Webflow, or React seamlessly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
              <button
                onClick={onOpenAuthModal}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Create Free Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenLiveSimulator}
                className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-sm transition-all"
              >
                Test Live Widget
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">OmniDesk AI</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            The next-generation autonomous AI customer support platform. Powered by Google Gemini and real-time Retrieval-Augmented Generation (RAG).
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC-2 Type II Certified • 99.9% Uptime SLA • GDPR Compliant</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-xs">Product</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onSelectTab('features')} className="hover:text-white transition-colors">
                RAG Training Engine
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('features')} className="hover:text-white transition-colors">
                Live Human Handoff
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('features')} className="hover:text-white transition-colors">
                Widget Studio
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('features')} className="hover:text-white transition-colors">
                CRM &amp; Lead Scoring
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-xs">Integrations</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer">Shopify App &amp; Liquid</li>
            <li className="hover:text-white cursor-pointer">WordPress &amp; WooCommerce</li>
            <li className="hover:text-white cursor-pointer">Webflow Custom Code</li>
            <li className="hover:text-white cursor-pointer">React &amp; Next.js</li>
            <li className="hover:text-white cursor-pointer">REST API &amp; Webhooks</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-xs">Platform</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onSelectTab('pricing')} className="hover:text-white transition-colors">
                Pricing &amp; Plans
              </button>
            </li>
            <li>
              <button onClick={onOpenAuthModal} className="hover:text-white transition-colors">
                Tenant Sign In
              </button>
            </li>
            <li>
              <button onClick={onOpenLiveSimulator} className="hover:text-white transition-colors">
                Interactive Simulator
              </button>
            </li>
            <li className="text-emerald-400 flex items-center gap-1.5 pt-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} OmniDesk AI Inc. All rights reserved. Multi-tenant autonomous support platform.
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-400 cursor-pointer">Security Overview</span>
        </div>
      </div>
    </footer>
  );
};
