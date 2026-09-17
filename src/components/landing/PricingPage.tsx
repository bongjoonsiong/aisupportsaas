import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Check, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Bot, 
  FileText, 
  Users, 
  MessageSquare, 
  CreditCard,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PricingPageProps {
  onSelectPlanToSubscribe: (plan: 'starter' | 'pro' | 'enterprise', cycle: 'monthly' | 'annual') => void;
  onOpenAuthModal: () => void;
  onGoToDashboard: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onSelectPlanToSubscribe,
  onOpenAuthModal,
  onGoToDashboard
}) => {
  const { user, currentOrg } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const plans = [
    {
      id: 'starter' as const,
      name: 'Starter',
      description: 'Ideal for early-stage startups and small stores establishing 24/7 AI automation.',
      monthlyPrice: 29,
      annualPrice: 23,
      badge: null,
      highlight: false,
      ctaText: user ? (currentOrg.plan === 'starter' ? 'Current Plan' : 'Switch to Starter') : 'Start 14-Day Free Trial',
      features: [
        { title: '2 Active AI Chatbots', strong: true },
        { title: '5,000 AI Messages / month', strong: true },
        { title: '25 Knowledge Base Sources', strong: false },
        { title: 'Standard Website Embed Widget', strong: false },
        { title: 'Pre-Chat Lead Capture Form', strong: false },
        { title: '2 Team Member Seats', strong: false },
        { title: 'Email & Community Support', strong: false },
        { title: 'Standard Gemini 2.5 Flash', strong: false },
      ]
    },
    {
      id: 'pro' as const,
      name: 'Professional',
      description: 'The standard choice for growing SaaS, e-commerce stores, and high-volume teams.',
      monthlyPrice: 79,
      annualPrice: 63,
      badge: 'MOST POPULAR',
      highlight: true,
      ctaText: user ? (currentOrg.plan === 'pro' ? 'Current Active Plan' : 'Upgrade to Pro') : 'Start 14-Day Free Trial',
      features: [
        { title: '10 Active AI Chatbots', strong: true },
        { title: '30,000 AI Messages / month', strong: true },
        { title: '150 Knowledge Sources (URLs + PDFs)', strong: true },
        { title: 'Remove "Powered by" OmniDesk Badge', strong: true },
        { title: 'Live Agent Handoff & Real-time Inbox', strong: true },
        { title: '✨ AI Draft Reply Generator for Agents', strong: true },
        { title: 'Shopify, Webflow & Webhook Integrations', strong: false },
        { title: '5 Team Member Seats', strong: false },
        { title: 'Priority 24/7 Fast Support', strong: false },
      ]
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise',
      description: 'Tailored for large organizations requiring custom SLAs, high concurrency, and fine-tuning.',
      monthlyPrice: 199,
      annualPrice: 159,
      badge: 'MAX PERFORMANCE',
      highlight: false,
      ctaText: user ? (currentOrg.plan === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise') : 'Contact / Start Enterprise',
      features: [
        { title: 'Unlimited Active AI Chatbots', strong: true },
        { title: '150,000+ AI Messages / month', strong: true },
        { title: 'Unlimited Knowledge & Sitemap Crawlers', strong: true },
        { title: 'Custom LLM Fine-Tuning & Prompt Tuning', strong: true },
        { title: 'Dedicated Customer Success Manager', strong: true },
        { title: '99.9% Guaranteed Uptime SLA', strong: true },
        { title: 'Unlimited Team Seats', strong: false },
        { title: 'Custom Domain White-labeling', strong: false },
        { title: 'SOC-2 Compliance & DPA Signing', strong: false },
      ]
    }
  ];

  const comparisonCategories = [
    {
      category: 'AI & Chatbot Core',
      rows: [
        { feature: 'Active Chatbots Included', starter: '2 Bots', pro: '10 Bots', enterprise: 'Unlimited' },
        { feature: 'Monthly AI Message Allowance', starter: '5,000', pro: '30,000', enterprise: '150,000+' },
        { feature: 'AI Engine', starter: 'Gemini 2.5 Flash', pro: 'Gemini 2.5 Flash + Pro', enterprise: 'Custom Fine-Tuned Gemini' },
        { feature: 'Sub-second Response Speed', starter: '✓', pro: '✓', enterprise: '✓' },
        { feature: 'Tone & Persona Customization', starter: '✓', pro: '✓', enterprise: '✓' }
      ]
    },
    {
      category: 'Knowledge Base & RAG Engine',
      rows: [
        { feature: 'Training Sources (URLs, Docs, FAQs)', starter: '25 Sources', pro: '150 Sources', enterprise: 'Unlimited' },
        { feature: 'Website URL & Sitemap Auto-Crawler', starter: 'Manual URLs', pro: 'Auto Recursive Crawler', enterprise: 'Full Site Scheduled Sync' },
        { feature: 'PDF, Word & Manuals Upload', starter: '✓ (Up to 10MB)', pro: '✓ (Up to 50MB)', enterprise: '✓ (Unlimited file sizes)' },
        { feature: 'Gemini 1-Click FAQ Extractor', starter: '✓', pro: '✓', enterprise: '✓' },
        { feature: 'Live RAG Citation Sources in Chat', starter: '—', pro: '✓', enterprise: '✓' }
      ]
    },
    {
      category: 'Widget Studio & Customization',
      rows: [
        { feature: 'Universal JS Embed Snippet', starter: '✓', pro: '✓', enterprise: '✓' },
        { feature: 'Custom Hex Color & Theme Studio', starter: '✓', pro: '✓', enterprise: '✓' },
        { feature: 'Pre-Chat Lead Capture Form', starter: 'Basic', pro: 'Advanced Multi-field', enterprise: 'Dynamic Intent Triggered' },
        { feature: 'Remove "Powered by OmniDesk" Brand', starter: '—', pro: '✓', enterprise: '✓' },
        { feature: 'Custom Domain Hosting (CNAME)', starter: '—', pro: '—', enterprise: '✓' }
      ]
    },
    {
      category: 'Human-in-the-Loop & Team Seats',
      rows: [
        { feature: 'Team Member Seats Included', starter: '2 Seats', pro: '5 Seats', enterprise: 'Unlimited Seats' },
        { feature: 'Live Inbox & Human Takeover', starter: '—', pro: '✓', enterprise: '✓' },
        { feature: 'Agent Online/Away Status Indicator', starter: '—', pro: '✓', enterprise: '✓' },
        { feature: '✨ AI Draft Reply Assistant for Agents', starter: '—', pro: '✓', enterprise: '✓' },
        { feature: 'Sentiment & Frustration Escalations', starter: '—', pro: '✓', enterprise: '✓' }
      ]
    }
  ];

  const faqs = [
    {
      q: 'How does the 14-day free trial work?',
      a: 'You get full access to all features of the Professional plan for 14 days without entering any credit card. You can train bots on your documents, customize the embed widget, and test real-time AI responses immediately.'
    },
    {
      q: 'What counts as an AI message?',
      a: 'Each response generated by your AI chatbot or agent assistant in response to a customer query counts as one AI message. System notifications, typing indicators, and human agent direct typing do not consume AI messages.'
    },
    {
      q: 'Can I upgrade, downgrade, or cancel at any time?',
      a: 'Yes, absolutely! You can change your plan or cancel your subscription at any time directly from your Tenant Workspace Settings. When upgrading, changes take effect immediately and are prorated.'
    },
    {
      q: 'Can I use one subscription across multiple websites and domains?',
      a: 'Yes! Depending on your plan (Starter: 2 bots, Pro: 10 bots, Enterprise: Unlimited), each bot can have its own unique knowledge base, styling, and can be embedded across different domains simultaneously.'
    },
    {
      q: 'Is my customer data and training content private and secure?',
      a: 'Yes. Your uploaded files, website URLs, and visitor chats are strictly isolated within your organization’s tenant partition. We do not use your private company data to train public foundation models.'
    }
  ];

  const handlePlanClick = (planId: 'starter' | 'pro' | 'enterprise') => {
    if (user) {
      onSelectPlanToSubscribe(planId, billingCycle);
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header Banner */}
      <section className="pt-16 pb-12 md:pt-20 md:pb-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Transparent Pricing for Every Stage
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Invest in Autonomous AI Support.<br className="hidden sm:inline" />
          <span className="text-blue-600">Save 80%+ on Support Costs.</span>
        </h1>
        <p className="mt-4 text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Start with a 14-day free trial. Choose a flexible monthly plan or save 20% with annual billing. No setup fees or hidden surprises.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-300/60 shadow-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            const isCurrent = user && currentOrg.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/10'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Name & Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        Active Workspace Plan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 min-h-[36px] leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-black text-slate-900">${price}</span>
                      <span className="text-xs font-semibold text-slate-500">
                        / month {billingCycle === 'annual' && ' (billed annually)'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-[11px] font-bold text-emerald-600 mt-1">
                        Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Everything Included:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={feat.strong ? 'font-bold text-slate-900' : 'font-medium'}>
                          {feat.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <button
                  onClick={() => handlePlanClick(plan.id)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                      : isCurrent
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Money Back Guarantee Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">14-Day Risk-Free Money-Back Guarantee</h4>
              <p className="text-xs text-slate-500">
                Try OmniDesk on your live website. If you're not seeing 80%+ ticket deflection within 14 days, get a full refund with zero questions asked.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectPlanToSubscribe('pro', billingCycle)}
            className="shrink-0 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Upgrade Workspace
          </button>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Detailed Plan Feature Comparison
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2">
            Compare all capabilities across Starter, Professional, and Enterprise tiers.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="py-4 px-6 font-bold text-slate-900 text-sm w-2/5">Capabilities</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-center w-1/5">Starter ($29/mo)</th>
                  <th className="py-4 px-4 font-black text-blue-600 text-center w-1/5 bg-blue-50/40">Pro ($79/mo)</th>
                  <th className="py-4 px-4 font-bold text-slate-900 text-center w-1/5">Enterprise ($199/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonCategories.map((cat, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="bg-slate-100/60 font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      <td colSpan={4} className="py-2.5 px-6">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-6 font-medium text-slate-800">{row.feature}</td>
                        <td className="py-3 px-4 text-center text-slate-600 font-semibold">{row.starter}</td>
                        <td className="py-3 px-4 text-center text-blue-700 font-bold bg-blue-50/20">{row.pro}</td>
                        <td className="py-3 px-4 text-center text-slate-900 font-bold">{row.enterprise}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Have questions about billing, quotas, or deployment? We've got answers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
