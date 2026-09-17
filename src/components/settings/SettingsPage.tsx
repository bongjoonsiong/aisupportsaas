import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBot } from '../../context/BotContext';
import { 
  Settings, 
  Building2, 
  Users, 
  Key, 
  Bell, 
  ShieldCheck, 
  Check, 
  Plus, 
  Mail, 
  Sparkles,
  Zap
} from 'lucide-react';

interface SettingsPageProps {
  onOpenPricing?: () => void;
  onOpenSubscribeModal?: (plan: 'starter' | 'pro' | 'enterprise') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  onOpenPricing, 
  onOpenSubscribeModal 
}) => {
  const { currentOrg, updateOrg, user } = useAuth();
  const { chatbots } = useBot();
  const [orgName, setOrgName] = useState(currentOrg.name);
  const [orgSlug, setOrgSlug] = useState(currentOrg.slug);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'agent'>('agent');

  const planLimits = {
    starter: { bots: 2, messages: '5,000', seats: 2, sources: 25 },
    pro: { bots: 10, messages: '30,000', seats: 5, sources: 150 },
    enterprise: { bots: 'Unlimited', messages: '150,000+', seats: 'Unlimited', sources: 'Unlimited' },
  }[currentOrg.plan] || { bots: 10, messages: '30,000', seats: 5, sources: 150 };

  const teamMembers = [
    { name: 'Alex Chen', email: 'alex.chen@acmecloud.io', role: 'Owner', status: 'Active', isYou: user?.email === 'alex.chen@acmecloud.io' },
    { name: 'Marcus Vance', email: 'marcus.v@acmecloud.io', role: 'Admin', status: 'Active', isYou: false },
    { name: 'Sarah Jenkins', email: 'sarah.j@acmecloud.io', role: 'Support Agent', status: 'Active', isYou: false },
  ];

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrg({ name: orgName, slug: orgSlug });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#F8FAFC] overflow-y-auto max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-600" />
          Workspace Settings &amp; Team
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your organization profile, human agent seats, and AI infrastructure settings.
        </p>
      </div>

      {/* 1. Organization Details */}
      <form onSubmit={handleSaveOrg} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Organization Profile</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 uppercase">
            {currentOrg.plan} Subscription
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Company / Workspace Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Workspace Slug
            </label>
            <input
              type="text"
              value={orgSlug}
              onChange={e => setOrgSlug(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              required
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </button>
          {savedSuccess && <span className="text-xs font-semibold text-emerald-600">Saved!</span>}
        </div>
      </form>

      {/* 2. Subscription & Plan Quotas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Subscription Plan &amp; Quotas</h3>
              <p className="text-xs text-slate-400">Current tier allowances and monthly message allocation.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenPricing && (
              <button
                type="button"
                onClick={onOpenPricing}
                className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
              >
                View All Plans
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenSubscribeModal ? onOpenSubscribeModal('pro') : onOpenPricing?.()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade Plan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Plan</span>
            <span className="text-base font-black text-blue-600 capitalize block mt-0.5">{currentOrg.plan} Tier</span>
            <span className="text-[10px] text-slate-500">Autonomous SaaS</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chatbots Allowed</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">{chatbots.length} / {planLimits.bots}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Active in Workspace</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly AI Messages</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">{planLimits.messages}</span>
            <span className="text-[10px] text-slate-500">Auto-renews monthly</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Knowledge Sources</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">{planLimits.sources} max</span>
            <span className="text-[10px] text-slate-500">URLs &amp; PDF files</span>
          </div>
        </div>
      </div>

      {/* 2. Team Members */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Support Team &amp; Agents</h3>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Invite Agent
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {teamMembers.map((m, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{m.name} {m.isYou && '(You)'}</span>
                  <span className="text-slate-400">{m.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                  {m.role}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Seat" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Engine & Security */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">Gemini AI Model &amp; Architecture</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-800 block">Server-Side Gemini 2.5 Flash</span>
            <p className="text-slate-500 leading-relaxed">
              API keys are strictly isolated on the Express backend (<code className="font-mono text-blue-600">/api/chat</code>) to prevent browser exposure.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-800 block">Real-time RAG Knowledge Engine</span>
            <p className="text-slate-500 leading-relaxed">
              Hybrid keyword and vector semantic retrieval provides grounded, hallucination-free answers.
            </p>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              Enter their email to send an invite to your customer support workspace.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="agent@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs md:text-sm"
                >
                  <option value="agent">Support Agent (Handle chats)</option>
                  <option value="admin">Administrator (Manage bots &amp; training)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
