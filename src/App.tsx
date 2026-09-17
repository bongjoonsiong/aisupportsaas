import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BotProvider, useBot } from './context/BotContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { LiveInbox } from './components/inbox/LiveInbox';
import { ChatbotList } from './components/bots/ChatbotList';
import { KnowledgeBase } from './components/training/KnowledgeBase';
import { WidgetCustomizer } from './components/customizer/WidgetCustomizer';
import { EmbedCodeGenerator } from './components/embed/EmbedCodeGenerator';
import { LeadsAnalytics } from './components/leads/LeadsAnalytics';
import { SettingsPage } from './components/settings/SettingsPage';
import { LiveWidgetSimulator } from './components/widget/LiveWidgetSimulator';
import { NewBotModal } from './components/bots/NewBotModal';
import { AuthModal } from './components/AuthModal';
import { PublicNavbar } from './components/landing/PublicNavbar';
import { PublicFooter } from './components/landing/PublicFooter';
import { LandingPage } from './components/landing/LandingPage';
import { PricingPage } from './components/landing/PricingPage';
import { SubscribeModal } from './components/billing/SubscribeModal';
import { Chatbot } from './types';

function MainAppContent() {
  // Top-level View Mode: 'public' (Marketing Home & Pricing) vs 'dashboard' (Tenant Workspace)
  const [pageMode, setPageMode] = useState<'public' | 'dashboard'>('public');
  
  // Public Marketing Tab: 'home' | 'pricing' | 'features' | 'demo'
  const [publicTab, setPublicTab] = useState<'home' | 'pricing' | 'features' | 'demo'>('home');

  // Tenant Dashboard Sub-view
  const [dashboardView, setDashboardView] = useState<NavTab>('bots');

  // Modals
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorBotOverride, setSimulatorBotOverride] = useState<Chatbot | undefined>(undefined);
  const [showNewBotModal, setShowNewBotModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [subscribeModalConfig, setSubscribeModalConfig] = useState<{
    isOpen: boolean;
    plan: 'starter' | 'pro' | 'enterprise';
    cycle: 'monthly' | 'annual';
  }>({
    isOpen: false,
    plan: 'pro',
    cycle: 'annual'
  });

  const { activeBot, setActiveBot } = useBot();
  const { user } = useAuth();

  // If user signs out or user profile becomes null, automatically redirect to public home
  useEffect(() => {
    if (!user && pageMode === 'dashboard') {
      setPageMode('public');
      setPublicTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [user, pageMode]);

  const handleOpenCustomizer = (bot: Chatbot) => {
    setActiveBot(bot);
    setDashboardView('customizer');
  };

  const handleOpenTraining = (bot: Chatbot) => {
    setActiveBot(bot);
    setDashboardView('training');
  };

  const handleOpenEmbed = (bot: Chatbot) => {
    setActiveBot(bot);
    setDashboardView('embed');
  };

  const handleSelectPlanToSubscribe = (plan: 'starter' | 'pro' | 'enterprise', cycle: 'monthly' | 'annual' = 'annual') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSubscribeModalConfig({
      isOpen: true,
      plan,
      cycle
    });
  };

  const handleOpenPricingFromAnywhere = () => {
    setPageMode('public');
    setPublicTab('pricing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      {pageMode === 'public' ? (
        /* PUBLIC MARKETING FRONT-END (Landing Page & Inner Pricing Page) */
        <div className="flex-1 flex flex-col">
          {/* Public Navbar */}
          <PublicNavbar
            currentTab={publicTab}
            onSelectTab={(tab) => {
              if (tab === 'demo') {
                setSimulatorBotOverride(undefined);
                setShowSimulator(true);
              } else if (tab === 'features') {
                setPublicTab('home');
                setTimeout(() => {
                  const elem = document.getElementById('features-rag-section');
                  if (elem) {
                    elem.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 550, behavior: 'smooth' });
                  }
                }, 50);
              } else {
                setPublicTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onOpenAuthModal={() => setShowAuthModal(true)}
            onGoToDashboard={() => setPageMode('dashboard')}
            onOpenLiveSimulator={() => {
              setSimulatorBotOverride(undefined);
              setShowSimulator(true);
            }}
          />

          {/* Public Page View Switcher */}
          <main className="flex-1">
            {publicTab === 'pricing' ? (
              <PricingPage
                onSelectPlanToSubscribe={handleSelectPlanToSubscribe}
                onOpenAuthModal={() => setShowAuthModal(true)}
                onGoToDashboard={() => setPageMode('dashboard')}
              />
            ) : (
              <LandingPage
                onSelectTab={(tab) => {
                  if (tab === 'demo') {
                    setSimulatorBotOverride(undefined);
                    setShowSimulator(true);
                  } else {
                    setPublicTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onOpenAuthModal={() => setShowAuthModal(true)}
                onGoToDashboard={() => setPageMode('dashboard')}
                onOpenLiveSimulator={() => {
                  setSimulatorBotOverride(undefined);
                  setShowSimulator(true);
                }}
              />
            )}
          </main>

          {/* Public Footer */}
          <PublicFooter
            onSelectTab={(tab) => {
              if (tab === 'demo') {
                setSimulatorBotOverride(undefined);
                setShowSimulator(true);
              } else {
                setPublicTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onOpenAuthModal={() => setShowAuthModal(true)}
            onOpenLiveSimulator={() => {
              setSimulatorBotOverride(undefined);
              setShowSimulator(true);
            }}
          />
        </div>
      ) : (
        /* TENANT WORKSPACE DASHBOARD */
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
          {/* Navigation Sidebar */}
          <Sidebar
            currentTab={dashboardView}
            onSelectTab={setDashboardView}
            onOpenSimulator={() => {
              setSimulatorBotOverride(activeBot || undefined);
              setShowSimulator(true);
            }}
            onBackToWebsite={() => setPageMode('public')}
            onOpenPricing={handleOpenPricingFromAnywhere}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
            {/* Top Global Header */}
            <Header
              onOpenWidgetSimulator={() => setShowSimulator(true)}
              onOpenNewBotModal={() => setShowNewBotModal(true)}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenPricing={handleOpenPricingFromAnywhere}
              onBackToWebsite={() => setPageMode('public')}
            />

            {/* Tenant View Switcher */}
            <main className="flex-1 flex overflow-hidden bg-[#F8FAFC]">
              {dashboardView === 'inbox' && <LiveInbox />}
              
              {dashboardView === 'bots' && (
                <ChatbotList
                  onOpenCustomizer={handleOpenCustomizer}
                  onOpenTraining={handleOpenTraining}
                  onOpenEmbed={handleOpenEmbed}
                  onOpenNewBotModal={() => setShowNewBotModal(true)}
                />
              )}

              {dashboardView === 'training' && <KnowledgeBase />}

              {dashboardView === 'customizer' && <WidgetCustomizer />}

              {dashboardView === 'embed' && <EmbedCodeGenerator />}

              {dashboardView === 'leads' && <LeadsAnalytics />}

              {dashboardView === 'settings' && (
                <SettingsPage
                  onOpenPricing={handleOpenPricingFromAnywhere}
                  onOpenSubscribeModal={(p) => handleSelectPlanToSubscribe(p, 'annual')}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Global Interactive Modals (accessible across public & dashboard) */}
      {showSimulator && (
        <LiveWidgetSimulator 
          botOverride={simulatorBotOverride}
          onClose={() => {
            setShowSimulator(false);
            setSimulatorBotOverride(undefined);
          }} 
        />
      )}

      {showNewBotModal && (
        <NewBotModal
          onClose={() => setShowNewBotModal(false)}
          onCreated={() => {
            setShowNewBotModal(false);
            setPageMode('dashboard');
            setDashboardView('bots');
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setPageMode('dashboard');
          }} 
        />
      )}

      {subscribeModalConfig.isOpen && (
        <SubscribeModal
          selectedPlan={subscribeModalConfig.plan}
          billingCycle={subscribeModalConfig.cycle}
          onClose={() => setSubscribeModalConfig(prev => ({ ...prev, isOpen: false }))}
          onSuccess={() => {
            setPageMode('dashboard');
            setDashboardView('settings');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BotProvider>
        <MainAppContent />
      </BotProvider>
    </AuthProvider>
  );
}
