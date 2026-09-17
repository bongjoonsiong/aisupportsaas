import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Lock,
  Building2,
  Calendar
} from 'lucide-react';

interface SubscribeModalProps {
  selectedPlan: 'starter' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  onClose: () => void;
  onSuccess?: () => void;
}

const PLAN_DETAILS = {
  starter: {
    name: 'Starter Plan',
    monthlyPrice: 29,
    annualPrice: 23,
    description: 'Perfect for startups and small websites starting with AI automation.',
    features: [
      '2 Active AI Chatbots',
      '5,000 AI Messages / month',
      '25 Knowledge Base Sources',
      'Standard Website Embed Widget',
      'Pre-Chat Lead Capture Form',
      '2 Team Member Seats',
      'Email & Community Support'
    ]
  },
  pro: {
    name: 'Professional Plan',
    monthlyPrice: 79,
    annualPrice: 63,
    description: 'Our most popular plan for scaling businesses and high-growth SaaS.',
    features: [
      '10 Active AI Chatbots',
      '30,000 AI Messages / month',
      '150 Knowledge Base Sources (URLs + PDFs)',
      'Remove "Powered by OmniDesk" Branding',
      'Live Agent Handoff & Real-time Inbox',
      '✨ AI Draft Reply Generator for Agents',
      'Shopify, Webflow, & Webhook Integrations',
      '5 Team Member Seats',
      'Priority 24/7 Support'
    ]
  },
  enterprise: {
    name: 'Enterprise Plan',
    monthlyPrice: 199,
    annualPrice: 159,
    description: 'Custom AI solutions, high throughput, and enterprise-grade SLA & security.',
    features: [
      'Unlimited Active AI Chatbots',
      '150,000+ AI Messages / month',
      'Unlimited Knowledge Base & Sitemap Crawlers',
      'Custom LLM Fine-Tuning & Custom System Prompts',
      'Dedicated Account Manager & Onboarding',
      '99.9% Uptime SLA & SOC2 Compliance',
      'Unlimited Team Member Seats',
      'Custom Domain White-labeling'
    ]
  }
};

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  selectedPlan: initialPlan,
  billingCycle: initialCycle,
  onClose,
  onSuccess
}) => {
  const { currentOrg, updateOrg, user } = useAuth();
  const [plan, setPlan] = useState<'starter' | 'pro' | 'enterprise'>(initialPlan);
  const [cycle, setCycle] = useState<'monthly' | 'annual'>(initialCycle);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [billingName, setBillingName] = useState(user?.displayName || 'Alex Chen');

  const currentPlanInfo = PLAN_DETAILS[plan];
  const unitPrice = cycle === 'annual' ? currentPlanInfo.annualPrice : currentPlanInfo.monthlyPrice;
  const totalPrice = cycle === 'annual' ? unitPrice * 12 : unitPrice;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // Update tenant workspace organization plan in state and persistence
      updateOrg({
        plan: plan
      });

      setIsProcessing(false);
      setIsCompleted(true);

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          ✕
        </button>

        {isCompleted ? (
          <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Subscription Active!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your workspace <span className="font-bold text-slate-900">{currentOrg.name}</span> has been upgraded to the <span className="font-bold text-blue-600 uppercase">{plan} Plan</span>.
            </p>
            <div className="pt-2 text-xs font-semibold text-slate-400">
              Redirecting to your enhanced tenant dashboard...
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Workspace Subscription Upgrade
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Upgrade {currentOrg.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Unlock higher AI message limits, custom training sources, and live agent human handoff.
              </p>
            </div>

            {/* Plan Selector Buttons */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              {(['starter', 'pro', 'enterprise'] as const).map((p) => {
                const isSelected = plan === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="capitalize">{p}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ${cycle === 'annual' ? PLAN_DETAILS[p].annualPrice : PLAN_DETAILS[p].monthlyPrice}/mo
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">Billing Cycle</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCycle('monthly')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    cycle === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setCycle('annual')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 ${
                    cycle === 'annual' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-black">SAVE 20%</span>
                </button>
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{currentPlanInfo.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    Billed {cycle === 'annual' ? 'annually' : 'monthly'} • Cancel anytime
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    ${totalPrice}
                    <span className="text-xs text-slate-400 font-normal">/{cycle === 'annual' ? 'year' : 'mo'}</span>
                  </div>
                  {cycle === 'annual' && (
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      Effective ${unitPrice}/month (2 months free)
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                {currentPlanInfo.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Form */}
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  Payment Details
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 normal-case font-medium">
                  <Lock className="w-3 h-3 text-emerald-600" /> 256-bit Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs md:text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs md:text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="MM/YY"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3 py-2 text-xs md:text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Subscription...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Subscribe to {currentPlanInfo.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  14-Day Money-Back Guarantee
                </span>
                <span>•</span>
                <span>Instant Activation</span>
                <span>•</span>
                <span>Cancel Anytime</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
