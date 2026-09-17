import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBot } from '../context/BotContext';
import { 
  Bot, 
  ChevronDown, 
  Bell, 
  Sparkles, 
  Play, 
  LogOut, 
  User, 
  Building2, 
  Check, 
  Plus, 
  Circle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface HeaderProps {
  onOpenWidgetSimulator: () => void;
  onOpenNewBotModal: () => void;
  onOpenAuthModal: () => void;
  onOpenPricing?: () => void;
  onBackToWebsite?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenWidgetSimulator, 
  onOpenNewBotModal,
  onOpenAuthModal,
  onOpenPricing,
  onBackToWebsite
}) => {
  const { user, currentOrg, toggleOnlineStatus, logout, loginAsDemo } = useAuth();
  const { chatbots, activeBot, setActiveBot, conversations } = useBot();

  const [showBotDropdown, setShowBotDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  const waitingCount = conversations.filter(c => c.status === 'waiting_human').length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Organization & Bot Selector */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Workspace / Org */}
        <div className="relative">
          <button
            onClick={() => {
              setShowOrgDropdown(!showOrgDropdown);
              setShowBotDropdown(false);
              setShowUserDropdown(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentOrg.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[140px]">
                {currentOrg.name}
              </div>
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">
                {currentOrg.plan} Plan
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showOrgDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Workspace</p>
              </div>
              
              <button
                onClick={() => {
                  loginAsDemo('owner', 'Acme Cloud Technologies');
                  setShowOrgDropdown(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between text-sm text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">A</div>
                  <span>Acme Cloud Technologies</span>
                </div>
                {currentOrg.slug === 'acme-cloud' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => {
                  loginAsDemo('owner', 'StripeShop Commerce');
                  setShowOrgDropdown(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between text-sm text-slate-700 font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">S</div>
                  <span>StripeShop Commerce</span>
                </div>
                {currentOrg.slug === 'stripeshop-commerce' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowOrgDropdown(false);
                    onOpenAuthModal();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Organization
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

        {/* Active Bot Switcher */}
        {activeBot && (
          <div className="relative">
            <button
              onClick={() => {
                setShowBotDropdown(!showBotDropdown);
                setShowOrgDropdown(false);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 transition-colors text-left border border-slate-200"
            >
              <div 
                className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[11px] font-bold"
                style={{ backgroundColor: activeBot.theme.primaryColor }}
              >
                <Bot className="w-3 h-3" />
              </div>
              <span className="text-sm font-bold text-slate-800 truncate max-w-[130px] md:max-w-[180px]">
                {activeBot.name}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                Active
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showBotDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Chatbots</span>
                  <span className="text-xs font-bold text-slate-500">{chatbots.length} Total</span>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {chatbots.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveBot(b);
                        setShowBotDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        activeBot.id === b.id ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs shrink-0"
                          style={{ backgroundColor: b.theme.primaryColor }}
                        >
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-bold text-slate-800 truncate">{b.name}</p>
                          <p className="text-xs text-slate-400 truncate capitalize">{b.category} • {b.knowledgeCount} Sources</p>
                        </div>
                      </div>
                      {activeBot.id === b.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-1 px-3">
                  <button
                    onClick={() => {
                      setShowBotDropdown(false);
                      onOpenNewBotModal();
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create New AI Chatbot
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions, Live Simulator Button, Agent Status, Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Create New Bot Button */}
        <button
          onClick={onOpenNewBotModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Bot</span>
        </button>

        {/* Live Widget Simulator Button */}
        <button
          onClick={onOpenWidgetSimulator}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs md:text-sm font-semibold shadow-sm transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Test Live Widget</span>
        </button>

        {/* Agent Online / Offline Toggle */}
        <button
          onClick={toggleOnlineStatus}
          title={user?.isOnline ? 'Online - Receiving live chats' : 'Offline - Automated AI mode'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            user?.isOnline 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <Circle className={`w-2 h-2 fill-current ${user?.isOnline ? 'text-emerald-500' : 'text-slate-400'}`} />
          <span className="hidden md:inline">{user?.isOnline ? 'Agent Online' : 'Agent Away'}</span>
        </button>

        {/* Escalation alert badge */}
        {waitingCount > 0 && (
          <div 
            title={`${waitingCount} visitor(s) waiting for human assistance`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>{waitingCount} Urgent</span>
          </div>
        )}

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowBotDropdown(false);
              setShowOrgDropdown(false);
            }}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:ring-2 hover:ring-slate-300 transition-all font-bold text-xs bg-slate-100"
          >
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.displayName} 
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{user?.displayName.charAt(0) || 'U'}</span>
            )}
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.displayName}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-700 uppercase">
                  {user?.role} Role
                </div>
              </div>

              <div className="py-1">
                {onBackToWebsite && (
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onBackToWebsite();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Public Website
                  </button>
                )}
                {onOpenPricing && (
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenPricing();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Upgrade Subscription
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAuthModal();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account & Profiles
                </button>
                <button
                  onClick={async () => {
                    setShowUserDropdown(false);
                    await logout();
                    if (onBackToWebsite) {
                      onBackToWebsite();
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
