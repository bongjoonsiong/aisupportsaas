import React, { useState, useEffect } from 'react';
import { useBot } from '../../context/BotContext';
import { KnowledgeItem, FAQItem, AVAILABLE_MODELS, LLMProvider } from '../../types';
import { 
  BrainCircuit, 
  Globe, 
  FileText, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Upload, 
  RefreshCw, 
  Sliders, 
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Cpu,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  Server,
  Zap,
  Layers
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { 
    activeBot, 
    updateChatbot, 
    knowledgeList, 
    addKnowledgeItem, 
    deleteKnowledgeItem, 
    autoGenerateFaqs, 
    crawlWebsiteUrl 
  } = useBot();

  const [activeTab, setActiveTab] = useState<'faqs' | 'urls' | 'docs' | 'prompt' | 'model'>('faqs');
  
  // FAQ state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [isGeneratingFaqs, setIsGeneratingFaqs] = useState(false);
  const [faqGenPrompt, setFaqGenPrompt] = useState('');
  const [showFaqModal, setShowFaqModal] = useState(false);

  // URL state
  const [urlInput, setUrlInput] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);

  // Document / PDF state
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Prompt Tuning State
  const [systemPrompt, setSystemPrompt] = useState(activeBot?.aiConfig.systemPrompt || '');
  const [tone, setTone] = useState(activeBot?.aiConfig.tone || 'friendly');
  const [creativity, setCreativity] = useState(activeBot?.aiConfig.creativity ?? 0.3);
  const [fallbackMessage, setFallbackMessage] = useState(activeBot?.aiConfig.fallbackMessage || '');
  const [keywords, setKeywords] = useState(activeBot?.aiConfig.humanHandoffTriggerKeywords.join(', ') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Model & BYOK State
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>(activeBot?.aiConfig.provider || 'google');
  const [selectedModel, setSelectedModel] = useState<string>(activeBot?.aiConfig.model || 'gemini-3.8-flash');
  const [customModelName, setCustomModelName] = useState<string>(activeBot?.aiConfig.customModelName || '');
  const [byokEnabled, setByokEnabled] = useState<boolean>(Boolean(activeBot?.aiConfig.byokEnabled));
  const [byokApiKey, setByokApiKey] = useState<string>(activeBot?.aiConfig.byokApiKey || '');
  const [customEndpoint, setCustomEndpoint] = useState<string>(activeBot?.aiConfig.customEndpoint || '');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [testKeyStatus, setTestKeyStatus] = useState<{
    loading: boolean;
    result?: { success: boolean; message: string; latencyMs?: number; modelUsed?: string };
  }>({ loading: false });
  const [saveModelSuccess, setSaveModelSuccess] = useState(false);

  // Sync state when activeBot switches
  useEffect(() => {
    if (activeBot) {
      setSystemPrompt(activeBot.aiConfig.systemPrompt || '');
      setTone(activeBot.aiConfig.tone || 'friendly');
      setCreativity(activeBot.aiConfig.creativity ?? 0.3);
      setFallbackMessage(activeBot.aiConfig.fallbackMessage || '');
      setKeywords(activeBot.aiConfig.humanHandoffTriggerKeywords.join(', ') || '');
      setSelectedProvider(activeBot.aiConfig.provider || 'google');
      setSelectedModel(activeBot.aiConfig.model || 'gemini-3.8-flash');
      setCustomModelName(activeBot.aiConfig.customModelName || '');
      setByokEnabled(Boolean(activeBot.aiConfig.byokEnabled));
      setByokApiKey(activeBot.aiConfig.byokApiKey || '');
      setCustomEndpoint(activeBot.aiConfig.customEndpoint || '');
      setTestKeyStatus({ loading: false });
    }
  }, [activeBot?.id]);

  if (!activeBot) {
    return (
      <div className="flex-1 p-8 text-center text-slate-500">
        Please select or create a chatbot first.
      </div>
    );
  }

  // Filter knowledge items for active bot
  const botKnowledge = knowledgeList.filter(k => k.botId === activeBot.id);

  // Extract FAQs from knowledge items
  const faqItem = botKnowledge.find(k => k.type === 'faq');
  let currentFaqs: FAQItem[] = [];
  if (faqItem) {
    try {
      currentFaqs = JSON.parse(faqItem.content);
    } catch (_) {}
  }

  // Add a single FAQ
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newFaq: FAQItem = {
      id: `faq_${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory || 'General'
    };

    const updatedFaqs = [...currentFaqs, newFaq];
    if (faqItem) {
      await deleteKnowledgeItem(faqItem.id);
    }

    await addKnowledgeItem({
      botId: activeBot.id,
      type: 'faq',
      title: `${activeBot.name} FAQ Guide (${updatedFaqs.length} Q&As)`,
      content: JSON.stringify(updatedFaqs),
      itemCount: updatedFaqs.length,
      status: 'indexed'
    });

    setNewQuestion('');
    setNewAnswer('');
  };

  // Delete an FAQ
  const handleDeleteFaq = async (faqId: string) => {
    const updatedFaqs = currentFaqs.filter(f => f.id !== faqId);
    if (faqItem) {
      await deleteKnowledgeItem(faqItem.id);
    }
    if (updatedFaqs.length > 0) {
      await addKnowledgeItem({
        botId: activeBot.id,
        type: 'faq',
        title: `${activeBot.name} FAQ Guide (${updatedFaqs.length} Q&As)`,
        content: JSON.stringify(updatedFaqs),
        itemCount: updatedFaqs.length,
        status: 'indexed'
      });
    }
  };

  // Auto Generate FAQs with Gemini
  const handleAutoGenerateFaqs = async () => {
    if (!faqGenPrompt.trim() || isGeneratingFaqs) return;
    setIsGeneratingFaqs(true);
    try {
      const generated = await autoGenerateFaqs(faqGenPrompt);
      const updatedFaqs = [...currentFaqs, ...generated];
      if (faqItem) {
        await deleteKnowledgeItem(faqItem.id);
      }
      await addKnowledgeItem({
        botId: activeBot.id,
        type: 'faq',
        title: `${activeBot.name} FAQ Guide (${updatedFaqs.length} Q&As)`,
        content: JSON.stringify(updatedFaqs),
        itemCount: updatedFaqs.length,
        status: 'indexed'
      });
      setShowFaqModal(false);
      setFaqGenPrompt('');
    } finally {
      setIsGeneratingFaqs(false);
    }
  };

  // Handle URL Crawling
  const handleCrawlUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isCrawling) return;
    setIsCrawling(true);
    try {
      await crawlWebsiteUrl(urlInput.trim());
      setUrlInput('');
    } finally {
      setIsCrawling(false);
    }
  };

  // Handle Document Upload
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim() || isUploading) return;
    setIsUploading(true);
    try {
      await addKnowledgeItem({
        botId: activeBot.id,
        type: 'pdf',
        title: docTitle.endsWith('.pdf') ? docTitle : `${docTitle}.pdf`,
        content: docContent,
        itemCount: 1,
        status: 'indexed'
      });
      setDocTitle('');
      setDocContent('');
    } finally {
      setIsUploading(false);
    }
  };

  // Save AI Config & Prompt
  const handleSaveAiConfig = async () => {
    const kwList = keywords.split(',').map(k => k.trim()).filter(Boolean);
    await updateChatbot(activeBot.id, {
      aiConfig: {
        ...activeBot.aiConfig,
        systemPrompt,
        tone: tone as any,
        creativity,
        fallbackMessage,
        humanHandoffTriggerKeywords: kwList
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Save Model & BYOK Config
  const handleSaveModelConfig = async () => {
    if (!activeBot) return;
    await updateChatbot(activeBot.id, {
      aiConfig: {
        ...activeBot.aiConfig,
        provider: selectedProvider,
        model: customModelName.trim() || selectedModel,
        customModelName: customModelName.trim() || undefined,
        byokEnabled,
        byokApiKey: byokApiKey.trim(),
        customEndpoint: customEndpoint.trim() || undefined
      }
    });
    setSaveModelSuccess(true);
    setTimeout(() => setSaveModelSuccess(false), 2500);
  };

  // Test Live Connection for Provider API Key
  const handleTestConnection = async () => {
    if (byokEnabled && !byokApiKey.trim() && selectedProvider !== 'custom') {
      setTestKeyStatus({
        loading: false,
        result: { success: false, message: 'Please enter your API key to test connection.' }
      });
      return;
    }

    setTestKeyStatus({ loading: true });
    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          model: customModelName.trim() || selectedModel,
          apiKey: byokApiKey.trim(),
          customEndpoint: customEndpoint.trim() || undefined
        })
      });
      const data = await res.json();
      setTestKeyStatus({ loading: false, result: data });
    } catch (err: any) {
      setTestKeyStatus({
        loading: false,
        result: { success: false, message: err.message || 'Connection test request failed.' }
      });
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#F8FAFC] dark:bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Knowledge Base &amp; AI Training
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Train <span className="font-bold text-slate-800 dark:text-slate-200">{activeBot.name}</span> on website links, product manuals, PDFs, and choose your foundation LLM model.
          </p>
        </div>

        {/* Source Counts Summary */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {botKnowledge.length} Active Training Sources
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'faqs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Q&amp;A &amp; FAQs ({currentFaqs.length})
        </button>

        <button
          onClick={() => setActiveTab('urls')}
          className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'urls'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          Website URLs ({botKnowledge.filter(k => k.type === 'url').length})
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'docs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          PDFs &amp; Documents ({botKnowledge.filter(k => k.type === 'pdf' || k.type === 'text').length})
        </button>

        <button
          onClick={() => setActiveTab('prompt')}
          className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'prompt'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          AI Persona &amp; Instructions
        </button>

        <button
          onClick={() => setActiveTab('model')}
          className={`px-4 py-2.5 text-xs md:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'model'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          AI Engine &amp; BYOK
        </button>
      </div>

      {/* 1. FAQs TAB */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500">Provide direct answers to the most common customer inquiries.</p>
            </div>

            <button
              onClick={() => setShowFaqModal(true)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ✨ Auto-Generate with Gemini
            </button>
          </div>

          {/* Add New FAQ Form */}
          <form onSubmit={handleAddFaq} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Add New Q&A Pair</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question</label>
                <input
                  type="text"
                  placeholder="e.g., How do I reset my account password?"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g., Billing, Onboarding"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Answer</label>
              <textarea
                rows={3}
                placeholder="Provide a clear, accurate answer the AI bot can quote to users..."
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add FAQ
            </button>
          </form>

          {/* FAQ List */}
          <div className="space-y-3">
            {currentFaqs.map(faq => (
              <div
                key={faq.id}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-start justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                      {faq.category || 'General'}
                    </span>
                    <h5 className="font-bold text-slate-800 text-sm">{faq.question}</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-1">{faq.answer}</p>
                </div>

                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. URLS TAB */}
      {activeTab === 'urls' && (
        <div className="space-y-6">
          <form onSubmit={handleCrawlUrl} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Crawl Website URLs</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingest your documentation portal, pricing page, or blog to keep the AI assistant synchronized.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                placeholder="https://yourwebsite.com/docs or pricing"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isCrawling}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {isCrawling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                {isCrawling ? 'Crawling & Indexing...' : 'Index URL'}
              </button>
            </div>
          </form>

          {/* Indexed URLs List */}
          <div className="space-y-3">
            {botKnowledge.filter(k => k.type === 'url').map(k => (
              <div key={k.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h5 className="font-bold text-slate-800 text-sm truncate">{k.title}</h5>
                    <a href={k.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      {k.sourceUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Indexed
                  </span>
                  <button
                    onClick={() => deleteKnowledgeItem(k.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DOCS & PDFS TAB */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <form onSubmit={handleAddDocument} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Upload PDF or Documentation Text</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste product manuals, whitepapers, internal guidelines, or company policies.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g., Enterprise SLA & Security Guidelines.pdf"
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Content</label>
              <textarea
                rows={6}
                placeholder="Paste the raw text content of your document, policy, or onboarding manual..."
                value={docContent}
                onChange={e => setDocContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs md:text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Index Document
            </button>
          </form>

          {/* List of Documents */}
          <div className="space-y-3">
            {botKnowledge.filter(k => k.type === 'pdf' || k.type === 'text').map(k => (
              <div key={k.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h5 className="font-bold text-slate-800 text-sm truncate">{k.title}</h5>
                    <p className="text-xs text-slate-400 line-clamp-1">{k.content.slice(0, 100)}...</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Indexed
                  </span>
                  <button
                    onClick={() => deleteKnowledgeItem(k.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PROMPT & PERSONA TAB */}
      {activeTab === 'prompt' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-sm max-w-3xl">
          <div>
            <h4 className="font-bold text-slate-800 text-base">AI Persona & Custom Instructions</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize how Gemini speaks to your customers, tone of voice, and safety rules.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              System Prompt / Instructions
            </label>
            <textarea
              rows={5}
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="friendly">Friendly & Warm</option>
                <option value="professional">Professional & Formal</option>
                <option value="empathic">Empathic & Patient</option>
                <option value="concise">Concise & Direct</option>
                <option value="technical">Technical & Precise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Creativity (Temperature): {creativity}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={creativity}
                onChange={e => setCreativity(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Exact & Fact-Strict</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Human Escalation Trigger Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="agent, human, refund, cancel, manager"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Fallback Response (when no info found)
            </label>
            <input
              type="text"
              value={fallbackMessage}
              onChange={e => setFallbackMessage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSaveAiConfig}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              Save AI Persona
            </button>
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 animate-in fade-in">
                Saved successfully!
              </span>
            )}
          </div>
        </div>
      )}

      {/* 5. AI MODEL & BYOK ENGINE TAB */}
      {activeTab === 'model' && (
        <div className="space-y-6 max-w-4xl">
          {/* Overview Hero Box */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Multi-LLM Foundation &amp; BYOK Architecture</span>
              </div>
              <h3 className="text-xl font-black tracking-tight">AI Model Selection &amp; Bring Your Own Key</h3>
              <p className="text-xs md:text-sm text-blue-100 max-w-2xl leading-relaxed">
                Empower <span className="font-bold underline decoration-blue-300">{activeBot.name}</span> with next-generation reasoning. Choose from frontier models like Google Gemini 4 Arton, ChatGPT 6 Astra Sol, and Claude Opus 5.5, or plug in your enterprise API key to pay wholesale token prices with zero platform markups.
              </p>
            </div>
          </div>

          {/* BYOK Toggle Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setByokEnabled(false)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                !byokEnabled 
                  ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 shadow-sm' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    !byokEnabled ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">OmniDesk Managed Cloud</h4>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Included in SaaS Subscription</span>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="byok_mode"
                  checked={!byokEnabled} 
                  onChange={() => setByokEnabled(false)} 
                  className="w-4 h-4 text-blue-600 accent-blue-600 mt-1 cursor-pointer" 
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                No developer account or API keys required. All conversational tokens and embeddings run automatically on OmniDesk's high-speed Google Cloud Run enterprise cluster.
              </p>
            </div>

            <div 
              onClick={() => setByokEnabled(true)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                byokEnabled 
                  ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-sm' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    byokEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bring Your Own Key (BYOK)</h4>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Wholesale Billing · Zero Markup</span>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="byok_mode"
                  checked={byokEnabled} 
                  onChange={() => setByokEnabled(true)} 
                  className="w-4 h-4 text-emerald-600 accent-emerald-600 mt-1 cursor-pointer" 
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                Connect your organization's Google AI Studio, OpenAI, or Anthropic account. Pay providers directly at wholesale rates with unlimited quota and custom compliance agreements.
              </p>
            </div>
          </div>

          {/* Provider Selector Tabs */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                1. Select AI Provider
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'google', name: 'Google Gemini', desc: 'Gemini 3.8 / 4 Arton' },
                  { id: 'openai', name: 'OpenAI ChatGPT', desc: 'GPT-4o / Astra Sol' },
                  { id: 'anthropic', name: 'Anthropic Claude', desc: 'Sonnet & Opus 5.5' },
                  { id: 'custom', name: 'Custom / Private', desc: 'Azure / Self-Hosted' }
                ].map(p => {
                  const isSelected = selectedProvider === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedProvider(p.id as LLMProvider);
                        const firstModel = AVAILABLE_MODELS.find(m => m.provider === p.id);
                        if (firstModel) setSelectedModel(firstModel.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs md:text-sm block">{p.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Selection Grid */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  2. Choose Intelligence Model Tier
                </label>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {AVAILABLE_MODELS.filter(m => m.provider === selectedProvider).length} Models Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_MODELS.filter(m => m.provider === selectedProvider).map(model => {
                  const isSelected = selectedModel === model.id;
                  const isFrontier = model.tier === 'frontier';

                  return (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/30 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            {model.name}
                          </h5>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                            isFrontier
                              ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                              : model.tier === 'pro'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {model.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                          {model.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 dark:text-slate-500">Context: <strong className="text-slate-700 dark:text-slate-300">{model.contextWindow}</strong></span>
                        <span className="text-slate-400 dark:text-slate-500">Speed: <strong className="text-slate-700 dark:text-slate-300">{model.speed}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Model Input if Custom Selected */}
              {(selectedModel === 'custom-model' || selectedProvider === 'custom') && (
                <div className="mt-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Custom Model String / Deployment Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ft:gpt-4o:org-enterprise-2026, deepseek-ai/DeepSeek-R1, or claude-custom-deployment"
                    value={customModelName}
                    onChange={e => setCustomModelName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400">
                    Enter the exact model identifier from your fine-tuned model checkpoint or custom Azure deployment.
                  </p>
                </div>
              )}
            </div>

            {/* BYOK Key & Endpoint Configuration */}
            {byokEnabled && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    3. {selectedProvider === 'google' ? 'Google Gemini' : selectedProvider === 'openai' ? 'OpenAI' : selectedProvider === 'anthropic' ? 'Anthropic' : 'Provider'} API Key
                  </label>
                  {selectedProvider === 'google' && (
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 font-semibold"
                    >
                      Get Key from Google AI Studio <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedProvider === 'openai' && (
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold"
                    >
                      Get Key from OpenAI Platform <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedProvider === 'anthropic' && (
                    <a 
                      href="https://console.anthropic.com/settings/keys" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 font-semibold"
                    >
                      Get Key from Anthropic Console <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={byokApiKey}
                    onChange={e => setByokApiKey(e.target.value)}
                    placeholder={
                      selectedProvider === 'google' 
                        ? 'AIzaSy...' 
                        : selectedProvider === 'openai' 
                        ? 'sk-proj-... or sk-...' 
                        : selectedProvider === 'anthropic' 
                        ? 'sk-ant-api...' 
                        : 'Enter custom API key'
                    }
                    className="w-full pl-10 pr-24 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs md:text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                      title={showApiKey ? 'Hide Key' : 'Reveal Key'}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testKeyStatus.loading}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {testKeyStatus.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      Test
                    </button>
                  </div>
                </div>

                {/* Optional Custom Base URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Custom Base URL / Enterprise Endpoint (Optional)
                  </label>
                  <input
                    type="text"
                    value={customEndpoint}
                    onChange={e => setCustomEndpoint(e.target.value)}
                    placeholder="https://api.openai.com/v1 or https://my-resource.openai.azure.com"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-xs md:text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Connection Test Result Indicator */}
                {testKeyStatus.result && (
                  <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs animate-in fade-in ${
                    testKeyStatus.result.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}>
                    {testKeyStatus.result.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold block">
                        {testKeyStatus.result.success ? 'API Connection Verified!' : 'Connection Validation Failed'}
                      </span>
                      <p className="mt-0.5 leading-relaxed">{testKeyStatus.result.message}</p>
                    </div>
                  </div>
                )}

                {/* Security Guarantee */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Your credentials are encrypted at rest using AES-256 and executed strictly within isolated Cloud Run backend workers. They are never sent to visitors or visible in client browsers.
                  </span>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveModelConfig}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                Save AI Engine &amp; BYOK Configuration
              </button>
              {saveModelSuccess && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved successfully! Bot updated to {customModelName || selectedModel}.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auto-Generate FAQs Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                ✨ Auto-Generate FAQs with Gemini AI
              </h3>
              <button onClick={() => setShowFaqModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste product text, sales pitch, or features description. Gemini will automatically extract and format 5-8 ready-to-use FAQ question/answer pairs.
            </p>

            <textarea
              rows={5}
              placeholder="e.g., We provide cloud servers starting at $10/mo with 99.99% uptime, 24/7 technical support, automatic backups, and free migration..."
              value={faqGenPrompt}
              onChange={e => setFaqGenPrompt(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFaqModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAutoGenerateFaqs}
                disabled={isGeneratingFaqs || !faqGenPrompt.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {isGeneratingFaqs ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isGeneratingFaqs ? 'Generating FAQs...' : 'Generate & Save FAQs'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
