import React, { useState, useRef, useEffect } from 'react';
import { useBot } from '../../context/BotContext';
import { useAuth } from '../../context/AuthContext';
import { Conversation, ConversationStatus, SentimentType } from '../../types';
import { 
  Search, 
  Filter, 
  Send, 
  User, 
  Bot, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Globe, 
  Monitor, 
  Mail, 
  Phone, 
  Building, 
  Tag, 
  ArrowRight,
  RefreshCw,
  MessageSquare,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  ExternalLink,
  Check,
  Flame
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const LiveInbox: React.FC = () => {
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation, 
    conversationMessages, 
    sendAgentMessage, 
    takeOverConversation, 
    releaseToAi, 
    resolveConversation,
    activeBot
  } = useBot();
  const { user } = useAuth();

  const [filterTab, setFilterTab] = useState<'all' | 'waiting' | 'agent' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, activeConversation]);

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    // Search query filter
    const matchesQuery = 
      c.visitorInfo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.visitorInfo.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (filterTab === 'waiting') return c.status === 'waiting_human';
    if (filterTab === 'agent') return c.status === 'agent_handling';
    if (filterTab === 'resolved') return c.status === 'resolved';
    return true;
  });

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendAgentMessage(replyText);
      setReplyText('');
    } finally {
      setIsSending(false);
    }
  };

  const getSentimentIcon = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-3.5 h-3.5 text-emerald-500" />;
      case 'frustrated':
      case 'urgent':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Meh className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: ConversationStatus) => {
    switch (status) {
      case 'waiting_human':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
            <ShieldAlert className="w-3 h-3" /> Needs Human
          </span>
        );
      case 'agent_handling':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <User className="w-3 h-3" /> Human Agent Active
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Bot className="w-3 h-3" /> AI Handling
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-100">
      {/* 1. Left List: Conversations Column */}
      <div className="w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Search & Header */}
        <div className="p-3.5 border-b border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Live Conversations
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredConversations.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search visitor, email, messages..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                filterTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({conversations.length})
            </button>
            <button
              onClick={() => setFilterTab('waiting')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                filterTab === 'waiting'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              Urgent ({conversations.filter(c => c.status === 'waiting_human').length})
            </button>
            <button
              onClick={() => setFilterTab('agent')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                filterTab === 'agent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Live Agent
            </button>
            <button
              onClick={() => setFilterTab('resolved')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                filterTab === 'resolved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* List of Conversations */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No conversations found</p>
              <p className="text-xs text-slate-400 mt-1">Try changing your search or filter tab</p>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isSelected = activeConversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-3.5 text-left transition-all flex flex-col gap-1.5 relative ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                        {conv.visitorInfo.name ? conv.visitorInfo.name.charAt(0) : 'V'}
                      </div>
                      <div className="truncate">
                        <span className="text-xs md:text-sm font-semibold text-slate-800 truncate block">
                          {conv.visitorInfo.name || 'Anonymous Visitor'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {getSentimentIcon(conv.sentiment)}
                      <span className="text-[11px] text-slate-400">
                        {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {getStatusBadge(conv.status)}
                    {conv.leadScore > 70 && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        Score {conv.leadScore}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Middle: Live Chat Transcript & Reply Box */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Active Conversation Top Bar */}
          <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                {activeConversation.visitorInfo.name?.charAt(0) || 'V'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm md:text-base font-bold text-slate-800">
                    {activeConversation.visitorInfo.name || 'Anonymous Visitor'}
                  </h3>
                  {getStatusBadge(activeConversation.status)}
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Globe className="w-3 h-3" />
                  {activeConversation.visitorInfo.city || activeConversation.visitorInfo.country || 'Global Visitor'} • {activeConversation.visitorInfo.currentPage || 'Website'}
                </p>
              </div>
            </div>

            {/* Quick Actions (Takeover, Release, Resolve) */}
            <div className="flex items-center gap-2">
              {activeConversation.status === 'agent_handling' ? (
                <button
                  onClick={() => releaseToAi(activeConversation.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  Switch Back to AI
                </button>
              ) : (
                <button
                  onClick={() => takeOverConversation(activeConversation.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Take Over as Live Agent
                </button>
              )}

              {activeConversation.status !== 'resolved' && (
                <button
                  onClick={() => resolveConversation(activeConversation.id)}
                  className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolve
                </button>
              )}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
            {activeConversation.summary && (
              <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-blue-800">AI Context Summary: </span>
                  {activeConversation.summary}
                </div>
              </div>
            )}

            {conversationMessages.map(msg => {
              const isVisitor = msg.sender === 'visitor';
              const isAgent = msg.sender === 'agent';
              const isBot = msg.sender === 'bot';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="px-3 py-1 rounded-full bg-slate-200/80 text-slate-600 text-xs font-medium">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isVisitor ? 'justify-start' : 'justify-end'}`}
                >
                  {isVisitor && (
                    <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0 mt-1">
                      {activeConversation.visitorInfo.name?.charAt(0) || 'V'}
                    </div>
                  )}

                  <div className={`max-w-[75%] space-y-1 ${isVisitor ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-700">
                        {isVisitor ? (activeConversation.visitorInfo.name || 'Visitor') : isAgent ? (msg.senderName || 'Agent') : (msg.senderName || activeBot?.name || 'AI Assistant')}
                      </span>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-xl text-xs md:text-sm leading-relaxed shadow-sm ${
                        isVisitor
                          ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          : isAgent
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-900 text-slate-100 rounded-tr-none'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 text-inherit font-medium">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>

                      {msg.sourcesUsed && msg.sourcesUsed.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-700/40 text-[10px] text-slate-300 flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-blue-300 uppercase tracking-wider">RAG Sources:</span>
                          {msg.sourcesUsed.map((src, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                              {src}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {!isVisitor && (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 mt-1 ${isAgent ? 'bg-blue-600' : 'bg-slate-900'}`}>
                      {isAgent ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input Box */}
          <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 bg-white">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={
                  activeConversation.status === 'agent_handling'
                    ? 'Type your live agent response... (Enter to send)'
                    : 'Take over or send direct reply...'
                }
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || isSending}
                className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">Enter</kbd> to send directly to the website visitor</span>
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sync Connected
              </span>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white text-slate-400">
          <div className="text-center max-w-sm p-6">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Select a conversation</h3>
            <p className="text-xs text-slate-400 mt-1">
              Choose a visitor session on the left to monitor live conversations, view AI transcripts, or take over with human agent support.
            </p>
          </div>
        </div>
      )}

      {/* 3. Right: Visitor Intelligence & Lead Data Sidebar */}
      {activeConversation && (
        <div className="w-72 md:w-80 bg-slate-50 border-l border-slate-200 p-4 space-y-4 overflow-y-auto hidden lg:block">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Visitor Profile</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                Lead Score {activeConversation.leadScore}/100
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">{activeConversation.visitorInfo.name || 'Anonymous'}</span>
              </div>

              {activeConversation.visitorInfo.email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${activeConversation.visitorInfo.email}`} className="text-blue-600 hover:underline truncate">
                    {activeConversation.visitorInfo.email}
                  </a>
                </div>
              )}

              {activeConversation.visitorInfo.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeConversation.visitorInfo.phone}</span>
                </div>
              )}

              {activeConversation.visitorInfo.company && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activeConversation.visitorInfo.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Session Technical Intelligence */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-100 pb-2">
              Device & Browsing
            </span>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="font-medium text-slate-800">{activeConversation.visitorInfo.city || 'San Francisco'}, {activeConversation.visitorInfo.country || 'USA'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Browser/OS:</span>
                <span className="font-medium text-slate-800">{activeConversation.visitorInfo.browser || 'Chrome'} • {activeConversation.visitorInfo.os || 'Desktop'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Page:</span>
                <span className="font-medium text-blue-600 truncate max-w-[140px]" title={activeConversation.visitorInfo.currentPage}>
                  {activeConversation.visitorInfo.currentPage || '/pricing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">First Seen:</span>
                <span className="font-medium text-slate-800">
                  {new Date(activeConversation.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">Conversation Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {activeConversation.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
