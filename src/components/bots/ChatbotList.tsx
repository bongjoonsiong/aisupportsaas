import React, { useState } from 'react';
import { useBot } from '../../context/BotContext';
import { Chatbot } from '../../types';
import { 
  Bot, 
  Plus, 
  Sparkles, 
  Settings, 
  Palette, 
  Trash2, 
  Copy, 
  Check, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  ArrowUpRight,
  Zap,
  Globe,
  Headphones,
  ShoppingBag
} from 'lucide-react';

interface ChatbotListProps {
  onOpenCustomizer: (bot: Chatbot) => void;
  onOpenTraining: (bot: Chatbot) => void;
  onOpenEmbed: (bot: Chatbot) => void;
  onOpenNewBotModal: () => void;
}

export const ChatbotList: React.FC<ChatbotListProps> = ({
  onOpenCustomizer,
  onOpenTraining,
  onOpenEmbed,
  onOpenNewBotModal
}) => {
  const { chatbots, activeBot, setActiveBot, deleteChatbot } = useBot();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case 'onboarding':
        return <Zap className="w-4 h-4 text-amber-500" />;
      default:
        return <Headphones className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#F8FAFC] overflow-y-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-blue-600" />
            AI Chatbots Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Deploy specialized AI agents for customer support, sales qualification, or interactive help centers.
          </p>
        </div>

        <button
          onClick={onOpenNewBotModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New AI Chatbot
        </button>
      </div>

      {/* Chatbots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map(bot => {
          const isActive = activeBot?.id === bot.id;
          return (
            <div
              key={bot.id}
              onClick={() => setActiveBot(bot)}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all cursor-pointer relative shadow-sm hover:shadow-md ${
                isActive 
                  ? 'border-blue-500 ring-2 ring-blue-500/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Top Row: Avatar, Name, Status */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md relative"
                      style={{ backgroundColor: bot.theme.primaryColor }}
                    >
                      <Bot className="w-6 h-6" />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{bot.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 capitalize mt-0.5 font-medium">
                        {getCategoryIcon(bot.category)}
                        <span>{bot.category} Assistant</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {bot.description}
                </p>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Trained KB</span>
                    <span className="text-sm font-black text-slate-800">{bot.knowledgeCount} Sources</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Chats</span>
                    <span className="text-sm font-black text-slate-800">{bot.totalConversations}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">CSAT Score</span>
                    <span className="text-sm font-black text-amber-600 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {bot.avgRating}
                    </span>
                  </div>
                </div>

                {/* Bot ID Copy */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
                  <span className="font-mono text-[11px] truncate max-w-[180px]">ID: {bot.id}</span>
                  <button
                    onClick={(e) => handleCopyId(bot.id, e)}
                    className="hover:text-blue-600 flex items-center gap-1 text-[11px] font-bold"
                  >
                    {copiedId === bot.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === bot.id ? 'Copied' : 'Copy ID'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTraining(bot);
                  }}
                  className="flex-1 py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Train AI
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCustomizer(bot);
                  }}
                  className="flex-1 py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  Design
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEmbed(bot);
                  }}
                  className="py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  title="Get Embed Code"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Embed
                </button>
              </div>
            </div>
          );
        })}

        {/* Create New Card */}
        <div
          onClick={onOpenNewBotModal}
          className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white/60 hover:bg-blue-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[300px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
            <Plus className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">Add Another AI Bot</h3>
          <p className="text-xs text-slate-500 max-w-[200px]">
            Configure specialized assistants for sales, support, or documentation.
          </p>
        </div>
      </div>
    </div>
  );
};
