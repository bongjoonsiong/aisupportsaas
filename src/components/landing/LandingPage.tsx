import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBot } from '../../context/BotContext';
import { 
  Zap, 
  Sparkles, 
  Bot, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  Globe, 
  Palette, 
  Users, 
  Headphones, 
  Send, 
  Layers, 
  Code2, 
  BarChart3, 
  Star, 
  TrendingUp,
  Cpu,
  Clock,
  DollarSign
} from 'lucide-react';

interface LandingPageProps {
  onSelectTab: (tab: 'home' | 'pricing' | 'features' | 'demo') => void;
  onOpenAuthModal: () => void;
  onGoToDashboard: () => void;
  onOpenLiveSimulator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectTab,
  onOpenAuthModal,
  onGoToDashboard,
  onOpenLiveSimulator
}) => {
  const { user } = useAuth();
  const { activeBot, sendVisitorMessage } = useBot();

  // Interactive Hero Chat State
  const [heroMessages, setHeroMessages] = useState<Array<{ sender: 'bot' | 'visitor'; text: string; sources?: string[] }>>([
    {
      sender: 'bot',
      text: "👋 Hi there! I'm OmniDesk AI. Ask me anything about our AI customer support SaaS, integrations, or pricing!",
      sources: ['OmniDesk Knowledge Base']
    }
  ]);
  const [heroInput, setHeroInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Workflow Active Tab
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'train' | 'design' | 'inbox' | 'analytics'>('train');

  // ROI Calculator State
  const [monthlyTickets, setMonthlyTickets] = useState(3000);
  const [costPerTicket, setCostPerTicket] = useState(8);

  const calculateSavings = () => {
    const aiDeflectionRate = 0.88; // 88% deflection
    const deflectedTickets = monthlyTickets * aiDeflectionRate;
    const monthlyCostSaved = deflectedTickets * costPerTicket;
    const annualSavings = monthlyCostSaved * 12;
    const hoursSaved = (deflectedTickets * 12) / 60; // 12 mins per ticket
    return {
      annualSavings: Math.round(annualSavings).toLocaleString(),
      monthlyCostSaved: Math.round(monthlyCostSaved).toLocaleString(),
      hoursSaved: Math.round(hoursSaved).toLocaleString()
    };
  };

  const savings = calculateSavings();

  const handleSendHeroMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInput.trim() || isTyping) return;

    const userText = heroInput;
    setHeroInput('');
    setHeroMessages(prev => [...prev, { sender: 'visitor', text: userText }]);
    setIsTyping(true);

    try {
      const response = await sendVisitorMessage(userText);
      setHeroMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: response.text,
          sources: response.sourcesUsed && response.sourcesUsed.length > 0 ? response.sourcesUsed : ['OmniDesk Documentation']
        }
      ]);
    } catch (e) {
      setHeroMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "OmniDesk AI natively supports website URL crawling, PDF parsing, live human agent handoff, and 1-click embedding on Shopify, WordPress, and React!",
          sources: ['Live Documentation']
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Powered by Gemini 2.5 Flash &amp; Instant RAG</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Autonomous AI Support for{' '}
                <span className="text-blue-600">Every Business</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Train custom, branded AI support agents on your website URLs, menus, catalogs, listings, and FAQ docs in under 2 minutes. Deflect 90%+ of tickets, capture leads, and seamlessly escalate to humans across <strong>E-Commerce, SaaS, F&amp;B, Real Estate, &amp; Financial Advisory</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                {user ? (
                  <button
                    onClick={onGoToDashboard}
                    className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Enter Your Tenant Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onOpenAuthModal}
                    className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={onOpenLiveSimulator}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Interactive Fullscreen Demo</span>
                </button>
              </div>

              {/* Guarantee & Social Proof micro-bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>1-Click Embed Snippet</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Human-in-the-Loop Handoff</span>
                </div>
              </div>

              {/* Key Metrics Strip */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 block">92.4%</span>
                  <span className="text-[11px] text-slate-500 font-medium">Autonomous Deflection</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-blue-600 block">&lt; 1.8s</span>
                  <span className="text-[11px] text-slate-500 font-medium">Avg. AI Response</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 block">14.2M+</span>
                  <span className="text-[11px] text-slate-500 font-medium">Chats Handled</span>
                </div>
              </div>
            </div>

            {/* Right Column: Real-time Live Interactive Hero Chatbot */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[520px]">
                {/* Chat Header */}
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">OmniDesk AI Assistant</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <span className="text-[10px] text-slate-400">Live Interactive Sandbox</span>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-black tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded">
                    Gemini 2.5
                  </span>
                </div>

                {/* Chat Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
                  {heroMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'visitor' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                          msg.sender === 'visitor'
                            ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                            : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none font-medium'
                        }`}
                      >
                        {msg.text}

                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[10px] text-slate-400">
                            <span className="font-bold text-blue-600">RAG:</span>
                            {msg.sources.map((s, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 p-3 bg-white rounded-2xl border border-slate-200 w-24">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>

                {/* Quick Prompts */}
                <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto">
                  {['How do I embed on Shopify?', 'What are the pricing tiers?', 'Can agents take over live?'].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setHeroInput(prompt);
                      }}
                      className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg text-[10px] font-bold transition-colors shrink-0"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendHeroMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    placeholder="Ask our AI a question to test live..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isTyping}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LOGOS & INTEGRATIONS STRIP */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by 5,000+ Fast-Growing SaaS, E-Commerce, &amp; Cloud Teams
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center opacity-70">
            <div className="font-black text-slate-400 text-lg tracking-tight">ACME CLOUD</div>
            <div className="font-black text-slate-400 text-lg tracking-tight">STRIPESHOP</div>
            <div className="font-black text-slate-400 text-lg tracking-tight">DATALAYER</div>
            <div className="font-black text-slate-400 text-lg tracking-tight">NEXUSHQ</div>
            <div className="font-black text-slate-400 text-lg tracking-tight">SCALEFLOW</div>
            <div className="font-black text-slate-400 text-lg tracking-tight">VOICEFLOW</div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PRODUCT SHOWCASE (4 STEPS) */}
      <section id="features-rag-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            Complete Autonomous Support Suite &amp; RAG Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How OmniDesk AI Powers Any Industry
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Engineered for E-Commerce, SaaS, Restaurants/F&amp;B, Real Estate Agencies, Financial Advisors, Healthcare, and Professional Services.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 border border-slate-300/60 max-w-3xl w-full">
            <button
              onClick={() => setActiveWorkflowTab('train')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeWorkflowTab === 'train' ? 'bg-white text-blue-600 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. Ingest Knowledge</span>
            </button>
            <button
              onClick={() => setActiveWorkflowTab('design')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeWorkflowTab === 'design' ? 'bg-white text-blue-600 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>2. Widget Studio</span>
            </button>
            <button
              onClick={() => setActiveWorkflowTab('inbox')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeWorkflowTab === 'inbox' ? 'bg-white text-blue-600 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>3. Live Inbox &amp; Agent</span>
            </button>
            <button
              onClick={() => setActiveWorkflowTab('analytics')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeWorkflowTab === 'analytics' ? 'bg-white text-blue-600 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>4. CRM &amp; Leads</span>
            </button>
          </div>
        </div>

        {/* Tab Content Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
          {activeWorkflowTab === 'train' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">RAG Knowledge Base</span>
                <h3 className="text-2xl font-black text-slate-900">
                  Instant Auto-Ingestion &amp; FAQ Generation
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Crawl your help docs, Notion pages, and terms of service. Upload PDF user guides or use our Gemini AI extractor to turn raw product specifications into structured Q&amp;A pairs with one click.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Recursive website URL crawler with sitemap support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Automatic FAQ extraction from raw product descriptions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Live source citations attached to every AI answer</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl text-white font-mono text-xs space-y-3">
                <div className="text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>Knowledge Source Ingestion</span>
                  <span className="text-emerald-400">Status: 24 Sources Indexed</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                  <span>🌐 https://docs.yourcompany.com/sla</span>
                  <span className="text-emerald-400 text-[10px] font-bold">INDEXED</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                  <span>📄 Enterprise_Product_Manual_v2.pdf</span>
                  <span className="text-emerald-400 text-[10px] font-bold">INDEXED</span>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between">
                  <span>❓ Extracted FAQ: Return &amp; Refund Policy</span>
                  <span className="text-emerald-400 text-[10px] font-bold">ACTIVE</span>
                </div>
              </div>
            </div>
          )}

          {activeWorkflowTab === 'design' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Widget Studio</span>
                <h3 className="text-2xl font-black text-slate-900">
                  Pixel-Perfect Customization to Match Your Brand
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Tailor your launcher icon, custom primary hex color, avatar, greeting copy, and lead capture form rules. Preview live updates in desktop and mobile device frames instantly.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Custom brand hex codes &amp; header gradients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Pre-chat or intent-triggered lead capture forms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>White-labeling to remove "Powered by" branding</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-100 p-6 rounded-2xl flex items-center justify-center">
                <div className="w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="p-3 bg-blue-600 text-white flex items-center justify-between">
                    <span className="font-bold text-xs">Customer Support AI</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Online</span>
                  </div>
                  <div className="p-4 space-y-2 text-[11px]">
                    <div className="bg-slate-100 p-2.5 rounded-xl text-slate-700">
                      Welcome to TechCorp! How can we help today?
                    </div>
                    <div className="bg-blue-600 text-white p-2.5 rounded-xl ml-auto max-w-[80%]">
                      Can I get a custom quote for 50 seats?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeWorkflowTab === 'inbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Live Human Handoff</span>
                <h3 className="text-2xl font-black text-slate-900">
                  Seamless AI-to-Agent Takeover &amp; Sentiment Alerts
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  When a customer asks for a human or shows high urgency, the system notifies agents instantly. Agents can take over live, or use "✨ Generate AI Draft Reply" to respond in 1 click.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Real-time conversation stream with Firestore sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Urgent sentiment detection and automated tag routing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>One-click AI response suggestion for support agents</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-800">Active Conversation #4910</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-700">
                    Urgent • Waiting Human
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  ⚠️ Visitor requested human agent assistance for enterprise contract.
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                  <Headphones className="w-3.5 h-3.5" />
                  Take Over Conversation as Live Agent
                </button>
              </div>
            </div>
          )}

          {activeWorkflowTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Leads &amp; Intelligence</span>
                <h3 className="text-2xl font-black text-slate-900">
                  Turn Inquiries into High-Converting Pipeline
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Capture visitor emails, company names, and phone numbers directly inside chats. View lead scores, export to CSV, or push prospects directly to your CRM.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Automatic lead scoring based on conversation intent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>1-Click CSV export for HubSpot, Salesforce, &amp; Notion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>CSAT ratings &amp; resolution rate analytics</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Captured Leads</span>
                  <div className="text-2xl font-black text-blue-600 mt-1">428</div>
                  <span className="text-[10px] text-emerald-600 font-bold">+24% this week</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400">CSAT Score</span>
                  <div className="text-2xl font-black text-amber-500 mt-1">4.9 / 5.0</div>
                  <span className="text-[10px] text-slate-500">1,200+ ratings</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. INTERACTIVE ROI & SAVINGS CALCULATOR */}
      <section className="py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                <DollarSign className="w-3.5 h-3.5" />
                Interactive ROI Calculator
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Calculate How Much OmniDesk Saves Your Team
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                By automating 88%+ of repetitive queries, your customer support agents can focus exclusively on complex inquiries and VIP relationships.
              </p>

              {/* Slider 1: Monthly Tickets */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Monthly Customer Tickets</span>
                  <span className="text-blue-400 font-mono text-sm">{monthlyTickets.toLocaleString()} Tickets / mo</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="250"
                  value={monthlyTickets}
                  onChange={(e) => setMonthlyTickets(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Cost Per Ticket */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Estimated Support Cost Per Ticket</span>
                  <span className="text-blue-400 font-mono text-sm">${costPerTicket} / ticket</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  step="1"
                  value={costPerTicket}
                  onChange={(e) => setCostPerTicket(Number(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-blue-500/30 shadow-2xl space-y-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Estimated Annual Impact
              </span>

              <div className="space-y-2">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                  ${savings.annualSavings}
                </span>
                <span className="text-xs text-slate-400 block font-semibold">
                  Saved in Annual Operational &amp; Support Costs (${savings.monthlyCostSaved}/month)
                </span>
              </div>

              <div className="pt-6 border-t border-slate-700 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-2xl font-black text-white">{savings.hoursSaved}</span>
                  <span className="text-[11px] text-slate-400 block font-medium">Agent Hours Saved / Year</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-blue-400">88.5%</span>
                  <span className="text-[11px] text-slate-400 block font-medium">Ticket Deflection Rate</span>
                </div>
              </div>

              <button
                onClick={() => onSelectTab('pricing')}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>View Pricing &amp; Start Saving</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Loved by Founders &amp; Support Teams
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            See how modern companies use OmniDesk AI to deliver lightning-fast support around the clock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic">
              "We ingested our entire documentation sitemap in 90 seconds. OmniDesk now resolves 91% of our incoming tier-1 tickets without human intervention."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                SL
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Sarah Lin</div>
                <div className="text-[11px] text-slate-400">Head of Support @ CloudScale</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic">
              "The live human handoff is pure magic. If a VIP customer has a billing question, our agents get alerted on their dashboard and can take over seamlessly."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                DK
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">David Keller</div>
                <div className="text-[11px] text-slate-400">Founder @ StripeShop Commerce</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic">
              "The widget embed snippet works on Shopify and Webflow with zero coding. We captured over 400 new qualified leads in the first month alone."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                EM
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Elena Martinez</div>
                <div className="text-[11px] text-slate-400">VP Marketing @ Nexus Growth</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
