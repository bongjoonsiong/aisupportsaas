import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowLeft,
  Printer,
  Sparkles,
  Server,
  Key,
  Database,
  Globe
} from 'lucide-react';

export type LegalTab = 'terms' | 'privacy' | 'security';

interface LegalPageProps {
  initialTab?: LegalTab;
  onBackToHome: () => void;
  onOpenPricing: () => void;
  onOpenAuthModal: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  initialTab = 'terms',
  onBackToHome,
  onOpenPricing,
  onOpenAuthModal
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const effectiveDate = "November 7, 2026";
  const lastUpdated = "November 7, 2026 (Version 2.4 - Enterprise Release)";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to OmniDesk AI</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Document
            </button>
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-100 to-[#F8FAFC] dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
            <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Legal, Privacy &amp; Regulatory Compliance
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Trust &amp; Legal Center
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transparent, enterprise-grade policies covering AI output liability, Personal Data Protection Act (PDPA), GDPR, and Bring Your Own Key (BYOK) governance.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-500 pt-2">
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span>•</span>
            <span>{lastUpdated}</span>
          </div>

          {/* Tab Selector */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-800/80 rounded-2xl shadow-inner max-w-full overflow-x-auto">
              <button
                onClick={() => setActiveTab('terms')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'terms'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Terms of Service
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Privacy &amp; PDPA / GDPR
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  activeTab === 'security'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                Security &amp; BYOK Safety
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* ========================================================= */}
        {/* TAB 1: TERMS OF SERVICE */}
        {/* ========================================================= */}
        {activeTab === 'terms' && (
          <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {/* Quick Summary Box */}
            <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Plain English Summary of Key Rights &amp; Protections
              </div>
              <ul className="list-disc pl-5 text-xs text-blue-900/80 dark:text-blue-200/80 space-y-1">
                <li><strong>You Own Your Data:</strong> You retain complete ownership of your uploaded knowledge manuals, FAQs, and brand assets.</li>
                <li><strong>AI Disclaimer:</strong> AI models can occasionally hallucinate. You are responsible for supervising customer-facing bot configurations.</li>
                <li><strong>BYOK (Bring Your Own Key):</strong> If you supply your own API key (Gemini, OpenAI, Anthropic), you are directly billed by that provider at wholesale rates.</li>
                <li><strong>Zero Model Training:</strong> Your business documents are never used to train public AI foundation models.</li>
              </ul>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                1. Acceptance of Terms &amp; Scope of Service
              </h2>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you or the entity you represent (&ldquo;Customer&rdquo;, &ldquo;Tenant&rdquo;, or &ldquo;You&rdquo;) and <strong>OmniDesk AI Inc.</strong> (&ldquo;OmniDesk&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
              </p>
              <p>
                By registering for an account, embedding our JavaScript widget on your website, configuring AI chatbots, or accessing our cloud application at <code>aisupport.onemoregood.com</code> (or related domains), you acknowledge that you have read, understood, and agreed to be bound by these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                2. Multi-Tenant Architecture &amp; Service Delivery
              </h2>
              <p>
                OmniDesk AI provides a multi-tenant Software-as-a-Service (SaaS) platform enabling businesses to train, customize, and deploy conversational artificial intelligence assistants. The Service includes Retrieval-Augmented Generation (RAG) knowledge indexing, live human agent escalation handoff, lead qualification tools, and embeddable web chat widgets.
              </p>
              <p>
                Each tenant is logically isolated within our cloud runtime. Tenants are granted a non-exclusive, non-transferable, revocable right to access and use the platform in accordance with their purchased subscription tier (Starter, Pro, or Enterprise).
              </p>
            </section>

            {/* Crucial AI Disclaimer Alert */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                3. Artificial Intelligence Disclaimer &amp; Hallucination Limitation
              </h2>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-mono">
                NOTICE: THE SERVICE UTILIZES ADVANCED LARGE LANGUAGE MODELS (LLMS), INCLUDING GOOGLE GEMINI, OPENAI GPT, AND ANTHROPIC CLAUDE. ARTIFICIAL INTELLIGENCE OUTPUT IS PROBABILISTIC AND MAY IN CERTAIN INSTANCES GENERATE INACCURATE, OUTDATED, MISLEADING, OR HALLUCINATED RESPONSES.
              </div>
              <p>
                You explicitly acknowledge and agree that:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li>OmniDesk AI makes no warranty or representation regarding the factual accuracy, reliability, completeness, or fitness for a particular purpose of any automated AI-generated answer.</li>
                <li>The Tenant is solely responsible for verifying the accuracy of the knowledge base documents provided to the bot and configuring appropriate human handoff trigger keywords.</li>
                <li>OmniDesk AI shall not be held liable for commercial losses, customer refund disputes, erroneous product specifications, or reputational damage arising from answers generated by the chatbot.</li>
                <li>The chatbot does not provide certified legal, financial, accounting, or medical counsel. If your business operates in regulated sectors (insurance, finance, healthcare), you must configure mandatory disclaimers and human agent escalation routes.</li>
              </ul>
            </section>

            {/* BYOK Specific Clause */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                4. Bring Your Own Key (BYOK) Terms &amp; Provider Billing
              </h2>
              <p>
                OmniDesk AI provides an optional Bring Your Own Key (BYOK) feature enabling Tenants to input API credentials from third-party AI providers (such as Google Cloud Vertex/AI Studio, OpenAI, or Anthropic PBC).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li><strong>Wholesale Billing:</strong> When BYOK is enabled, all token usage, API billing, rate limits, and quota expenses are billed directly by your third-party provider to your developer payment card. OmniDesk AI levies zero markup on your BYOK tokens.</li>
                <li><strong>Credential Confidentiality:</strong> OmniDesk isolates BYOK API keys strictly on server-side worker runtimes using AES-256 encryption. They are never exposed to website visitors, client browsers, or bundled into embed scripts.</li>
                <li><strong>Tenant Sole Responsibility:</strong> You are solely responsible for compliance with the respective provider&rsquo;s terms (e.g. OpenAI Usage Policies, Anthropic Commercial Terms, Google Cloud Service Agreement). OmniDesk AI is not liable for API outages, revoked keys, or unexpected token spending on your provider account.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                5. Acceptable Use Policy (AUP)
              </h2>
              <p>You agree not to use OmniDesk AI to generate, host, or disseminate:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li>Malicious, fraudulent, phishing, or deceptive material;</li>
                <li>Harassment, hate speech, defamation, or content violating third-party intellectual property;</li>
                <li>Spam, unsolicited mass advertisements, or unauthorized scraping;</li>
                <li>Attempts to reverse engineer, decompile, or perform denial-of-service (DoS) attacks against our Google Cloud Run container infrastructure.</li>
              </ul>
              <p>
                We reserve the right to immediately suspend or terminate any chatbot or tenant workspace found in violation of this Acceptable Use Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                6. Service Level Agreement (SLA) &amp; Cloud Maintenance
              </h2>
              <p>
                OmniDesk AI targets an operational uptime of <strong>99.9%</strong> for the cloud chat widget infrastructure.
              </p>
              <p>
                Uptime measurements exclude scheduled maintenance windows (notified in advance where feasible), catastrophic acts of God, force majeure events, or upstream outages originating from public cloud providers (Google Cloud Platform) or AI model providers (OpenAI / Anthropic APIs).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                7. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL OMNIDESK AI INC., ITS DIRECTORS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF BUSINESS OPPORTUNITIES, OR LOSS OF DATA).
              </p>
              <p>
                OMNIDESK AI&rsquo;S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE GREATER OF (A) ONE HUNDRED US DOLLARS ($100 USD) OR (B) THE TOTAL FEES PAID BY TENANT TO OMNIDESK AI DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                8. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Singapore / Malaysia (or applicable neutral commercial jurisdiction), without regard to its conflict of law principles. Any dispute arising out of or in connection with these Terms shall be resolved via binding amicable commercial negotiation, or submitted to the jurisdiction of the competent courts.
              </p>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRIVACY POLICY (PDPA & GDPR COMPLIANT) */}
        {/* ========================================================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {/* Regulatory Badge Header */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Compliance Guarantee: Personal Data Protection Act (PDPA) &amp; EU GDPR
              </div>
              <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80">
                OmniDesk AI adheres strictly to the statutory guidelines established under the <strong>Personal Data Protection Act 2012 (Singapore PDPA)</strong>, the <strong>Personal Data Protection Act 2010 (Malaysia PDPA)</strong>, and the <strong>EU General Data Protection Regulation (Regulation 2016/679)</strong>.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                1. Roles: Data Controller vs. Data Intermediary / Processor
              </h2>
              <p>To ensure regulatory clarity:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li>
                  <strong>For Website Visitors &amp; Inquiries to Tenants:</strong> The <strong>Tenant</strong> is the <strong>Data Controller</strong> who determines the purposes for collecting customer personal data. OmniDesk AI acts solely as a <strong>Data Intermediary (under PDPA)</strong> and <strong>Data Processor (under GDPR)</strong>, processing chat sessions on the Tenant&rsquo;s direct instruction.
                </li>
                <li>
                  <strong>For Tenant Account Management:</strong> OmniDesk AI is the Data Controller for your organization administrative billing records, tenant logins, and invoicing data.
                </li>
              </ul>
            </section>

            {/* Zero Public Model Training Commitment */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                2. Enterprise Privacy: No Foundation Model Training
              </h2>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-800 dark:text-slate-200 font-medium">
                🔒 WE PLEDGE: YOUR PROPRIETARY DATA IS NEVER USED TO TRAIN PUBLIC FOUNDATION MODELS.
              </div>
              <p>
                When you ingest documents, product manuals, FAQs, or chat histories into OmniDesk AI:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li>Your data is used solely for real-time Retrieval-Augmented Generation (RAG) vector synthesis to formulate replies for your authorized bot.</li>
                <li>Neither OmniDesk AI nor our cloud inference partners (Google Cloud Vertex, OpenAI, Anthropic) utilize your private customer interactions or internal PDFs to train, improve, or fine-tune public foundation models.</li>
                <li>Enterprise inference data agreements ensure zero retention of prompts for foundation model training.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                3. Categories of Personal Data Collected
              </h2>
              <p>We may collect and process the following classifications of data:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Tenant Administrator Data</span>
                  <p className="text-slate-500 dark:text-slate-400">
                    Full name, corporate email address, hashed authentication credentials, billing records, organization name, and seat assignment.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">End-User Visitor Chat Data</span>
                  <p className="text-slate-500 dark:text-slate-400">
                    Conversation message strings, timestamp, visitor IP address (for geographical routing), browser type, and voluntary lead capture info (name, email, phone number).
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                4. Disclosure of LocalStorage Usage
              </h2>
              <p>
                In compliance with global e-Privacy directives, we transparently disclose our use of client-side browser storage:
              </p>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 text-xs">
                <p>
                  OmniDesk AI does not use invasive third-party cross-site tracking cookies. We utilize browser <code>localStorage</code> strictly for functional client-side user preferences:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>omnidesk_lang</code>: Remembers the visitor&rsquo;s preferred interface language (e.g. English, Chinese, Spanish, Japanese).</li>
                  <li><code>omnidesk_theme</code>: Remembers the visitor&rsquo;s light or dark mode theme toggle.</li>
                  <li><code>omnidesk_convs_*</code>: Caches local conversation state so a visitor returning to your site can resume their active chat.</li>
                </ul>
                <p className="text-slate-400 dark:text-slate-500 pt-1">
                  This data resides 100% on the visitor&rsquo;s local physical drive and is never broadcast to external marketing aggregators.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                5. Statutory Rights of Individuals (Access, Correction &amp; Erasure)
              </h2>
              <p>Under the PDPA and GDPR, individuals whose personal data has been processed possess the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li><strong>Access:</strong> Request confirmation and copies of personal data held about them.</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data records.</li>
                <li><strong>Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request the permanent deletion of conversation logs and captured leads.</li>
                <li><strong>Withdrawal of Consent:</strong> Withdraw consent for further communication at any time.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tenants can execute immediate lead deletion and conversation purges directly from the OmniDesk Live Inbox and Leads Analytics dashboard.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                6. Data Protection Officer (DPO) Contact
              </h2>
              <p>
                For any inquiries regarding data protection, PDPA compliance audits, or data deletion requests, please contact our designated Data Protection Officer:
              </p>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Data Protection Office — OmniDesk AI</span>
                <p className="text-slate-500">Email: <a href="mailto:dpo@onemoregood.com" className="text-blue-600 font-semibold underline">dpo@onemoregood.com</a></p>
                <p className="text-slate-500">Physical Compliance Inquiries: Attn: Legal &amp; Data Protection Unit, OmniDesk AI Inc.</p>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SECURITY & BYOK ARCHITECTURE */}
        {/* ========================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {/* Overview Security Box */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 space-y-2">
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold text-sm">
                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Enterprise Security Architecture &amp; Zero-Trust Isolation
              </div>
              <p className="text-xs text-indigo-900/80 dark:text-indigo-200/80">
                OmniDesk AI applies defense-in-depth principles across every layer: automated container sandboxing on Google Cloud Run, TLS 1.3 encryption, and strict backend isolation for tenant API credentials.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                1. Cloud Run Infrastructure &amp; Container Hardening
              </h2>
              <p>
                Our services run on Google Cloud Run serverless microservices. Each request is evaluated inside ephemeral, isolated execution sandboxes with zero persistent file retention on the compute nodes.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li>Automated DDoS protection via Google Cloud Armor and Cloudflare edge proxies.</li>
                <li>Continuous integration &amp; deployment (CI/CD) automated security vulnerability scanning on container images.</li>
                <li>All traffic between visitors, backend nodes, and LLM APIs enforces TLS 1.3 encryption with Perfect Forward Secrecy (PFS).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                2. BYOK Secret Key Cryptography &amp; Leak Prevention
              </h2>
              <p>
                A core architectural pillar of OmniDesk AI is preventing customer API key leaks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Strict Server-Side Isolation
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tenant API keys are never bundled into the public JavaScript embed script (<code>widget.js</code>). The browser communicates exclusively with <code>/api/chat</code> on our backend proxy.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    AES-256 Encryption at Rest
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Stored API keys are encrypted at rest using industry-standard AES-256 cipher keys managed through Google Cloud Key Management Service (KMS).
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                3. Tenant Password &amp; Credential Governance
              </h2>
              <p>
                We adhere strictly to modern zero-trust identity architecture:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li><strong>No Plaintext Passwords:</strong> We never store, transmit, or view raw user passwords. Authentication is powered by Google Firebase Identity Platform utilizing salt-hashed scrypt algorithms.</li>
                <li><strong>Session Token Rotation:</strong> JSON Web Tokens (JWT) are signed, time-limited, and automatically refreshed to thwart replay hijacking attacks.</li>
                <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions enforce separation between Workspace Owners, Administrators, and Live Support Agents.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                4. Automated AI Guardrails &amp; Human Intervention
              </h2>
              <p>
                To prevent prompt injection and abusive bot exploitation:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                <li><strong>Keyword Handoff Triggers:</strong> Conversations containing frustration indicators, legal threats, or refund requests automatically bypass the LLM and escalate to your live human agent inbox.</li>
                <li><strong>Sentiment Analysis:</strong> Real-time heuristic scoring categorizes conversations as positive, neutral, frustrated, or urgent.</li>
                <li><strong>Input Sanitization:</strong> Strict payload schema validation strips dangerous script tags and code injection attacks before sending content to AI inference endpoints.</li>
              </ul>
            </section>
          </div>
        )}

        {/* Bottom CTA Box */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 text-center space-y-4 shadow-xl">
          <h3 className="text-xl font-bold">Have Questions About Legal Compliance or Enterprise DPA?</h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Our legal and data privacy teams are available to execute custom Data Processing Agreements (DPA), Business Associate Agreements (BAA), and corporate security questionnaires.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="mailto:legal@onemoregood.com"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs transition-all"
            >
              Contact Legal &amp; Compliance
            </a>
            <button
              onClick={onOpenPricing}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
            >
              View Enterprise Plans
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
