import React, { useState } from 'react';
import { useBot } from '../../context/BotContext';
import { Bot, Sparkles, Headphones, ShoppingBag, Zap, Check } from 'lucide-react';

interface NewBotModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export const NewBotModal: React.FC<NewBotModalProps> = ({ onClose, onCreated }) => {
  const { createChatbot } = useBot();
  const [botName, setBotName] = useState('');
  const [category, setCategory] = useState<'support' | 'sales' | 'onboarding'>('support');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const templates = [
    {
      id: 'support',
      title: '24/7 Customer Support',
      desc: 'Trained on FAQs and docs to resolve customer inquiries and technical questions automatically.',
      color: '#2563eb',
      icon: Headphones,
    },
    {
      id: 'sales',
      title: 'Sales & Lead Qualifier',
      desc: 'Proactively greets visitors, qualifies prospects, books demos, and collects contact details.',
      color: '#059669',
      icon: ShoppingBag,
    },
    {
      id: 'onboarding',
      title: 'User Onboarding & Guide',
      desc: 'Guides new users through features, steps, and setup instructions interactively.',
      color: '#7c3aed',
      icon: Zap,
    }
  ];

  const handleSelectTemplate = (tmpl: typeof templates[0]) => {
    setCategory(tmpl.id as any);
    setPrimaryColor(tmpl.color);
    if (!botName) {
      setBotName(tmpl.title);
    }
    setDescription(tmpl.desc);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createChatbot({
        name: botName.trim(),
        category,
        description: description || 'AI Assistant for customer inquiries.',
        theme: {
          primaryColor,
          accentColor: primaryColor,
          textColor: '#ffffff',
          headerBackground: category === 'sales' ? 'gradient' : 'solid',
          bubbleRadius: 'rounded',
          position: 'bottom-right',
          offsetX: 24,
          offsetY: 24,
          welcomeTitle: `Hi there! 👋 How can we help you today?`,
          welcomeSubtitle: 'Our AI assistant typically replies in under 5 seconds',
          placeholderText: 'Type your message...',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          launcherIcon: category === 'sales' ? 'sparkles' : 'chat',
          launcherText: category === 'sales' ? 'Book a Demo' : 'Chat with Us',
          soundEnabled: true,
          autoOpenDelaySeconds: 0,
          showPoweredBy: true,
          enableDarkMode: false,
        }
      });
      onCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create New AI Chatbot</h2>
              <p className="text-xs text-slate-500">Choose a specialized template or configure from scratch.</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {/* Template Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. Select Bot Archetype
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templates.map(tmpl => {
              const Icon = tmpl.icon;
              const isSelected = category === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: tmpl.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">{tmpl.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{tmpl.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bot Name & Description */}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              2. Chatbot Name
            </label>
            <input
              type="text"
              placeholder="e.g., Acme Technical Support AI"
              value={botName}
              onChange={e => setBotName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Role &amp; Objective
            </label>
            <textarea
              rows={2}
              placeholder="Describe what this bot is responsible for..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !botName.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Creating Chatbot...' : 'Create & Launch Bot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
