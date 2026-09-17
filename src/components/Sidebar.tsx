import React from 'react';
import { 
  Inbox, 
  Bot, 
  BrainCircuit, 
  Palette, 
  Code2, 
  Users, 
  BarChart3, 
  Settings,
  HelpCircle,
  Zap,
  Globe
} from 'lucide-react';
import { useBot } from '../context/BotContext';

export type NavTab = 'inbox' | 'bots' | 'training' | 'customizer' | 'embed' | 'leads' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSimulator?: () => void;
  onBackToWebsite?: () => void;
  onOpenPricing?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  onOpenSimulator,
  onBackToWebsite,
  onOpenPricing
}) => {
  const { conversations, leads } = useBot();

  const waitingCount = conversations.filter(c => c.status === 'waiting_human').length;
  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  const navItems = [
    {
      id: 'inbox' as NavTab,
      label: 'Live Inbox',
      icon: Inbox,
      badge: waitingCount > 0 ? `${waitingCount} urgent` : conversations.filter(c => c.unreadByAgent).length || undefined,
      badgeVariant: waitingCount > 0 ? 'urgent' : 'default'
    },
    {
      id: 'bots' as NavTab,
      label: 'AI Chatbots',
      icon: Bot,
    },
    {
      id: 'training' as NavTab,
      label: 'Knowledge & AI',
      icon: BrainCircuit,
    },
    {
      id: 'customizer' as NavTab,
      label: 'Widget Studio',
      icon: Palette,
    },
    {
      id: 'embed' as NavTab,
      label: 'Embed Code',
      icon: Code2,
    },
    {
      id: 'leads' as NavTab,
      label: 'Leads & Analytics',
      icon: Users,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : undefined,
      badgeVariant: 'success'
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings & Team',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-[#1E293B] flex flex-col shrink-0 text-white border-r border-slate-700">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md">
            O
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              OmniDesk <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30">AI</span>
            </span>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">Geometric Support System</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Navigation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                    item.badgeVariant === 'urgent'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : item.badgeVariant === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Website & Pricing Shortcuts */}
      <div className="px-4 py-2 space-y-1">
        {onBackToWebsite && (
          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>← Back to Website</span>
          </button>
        )}

        {onOpenPricing && (
          <button
            onClick={onOpenPricing}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400 fill-current" />
              <span>Subscription Plans</span>
            </div>
            <span className="text-[9px] bg-blue-500 text-slate-950 font-black px-1.5 py-0.5 rounded">UPGRADE</span>
          </button>
        )}
      </div>

      {/* Footer Info / Gemini Status & Org */}
      <div className="p-4 border-t border-slate-700">
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Gemini 3.8 Flash
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Online</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Multi-Tenant RAG Engine Active
          </p>
        </div>
      </div>
    </aside>
  );
};
