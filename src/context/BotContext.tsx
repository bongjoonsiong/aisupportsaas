import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Chatbot, 
  KnowledgeItem, 
  Conversation, 
  ChatMessage, 
  CapturedLead, 
  PlatformAnalytics, 
  FAQItem,
  ChatbotTheme,
  AIConfig
} from '../types';
import { 
  DEFAULT_CHATBOTS, 
  DEFAULT_KNOWLEDGE, 
  DEFAULT_CONVERSATIONS, 
  DEFAULT_MESSAGES, 
  DEFAULT_LEADS, 
  DEFAULT_ANALYTICS 
} from '../data/defaultData';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

interface BotContextType {
  chatbots: Chatbot[];
  activeBot: Chatbot | null;
  setActiveBot: (bot: Chatbot) => void;
  createChatbot: (botData: Partial<Chatbot>) => Promise<Chatbot>;
  updateChatbot: (botId: string, updates: Partial<Chatbot>) => Promise<void>;
  deleteChatbot: (botId: string) => Promise<void>;
  
  // Knowledge Base
  knowledgeList: KnowledgeItem[];
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id' | 'updatedAt'>) => Promise<void>;
  deleteKnowledgeItem: (itemId: string) => Promise<void>;
  autoGenerateFaqs: (content: string) => Promise<FAQItem[]>;
  crawlWebsiteUrl: (url: string) => Promise<void>;
  
  // Conversations & Live Inbox
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  conversationMessages: ChatMessage[];
  sendAgentMessage: (text: string) => Promise<void>;
  takeOverConversation: (convId: string) => Promise<void>;
  releaseToAi: (convId: string) => Promise<void>;
  resolveConversation: (convId: string) => Promise<void>;
  
  // Public / Emulator Widget Chat
  sendVisitorMessage: (text: string, convId?: string) => Promise<ChatMessage>;
  isAiGenerating: boolean;
  
  // Leads & Analytics
  leads: CapturedLead[];
  analytics: PlatformAnalytics;
  updateLeadStatus: (leadId: string, status: CapturedLead['status']) => void;
  
  // Quick Switcher / Refresh
  notificationSound: boolean;
  setNotificationSound: (val: boolean) => void;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentOrg, user } = useAuth();

  // Chatbots State
  const [chatbots, setChatbots] = useState<Chatbot[]>(() => {
    const saved = localStorage.getItem(`omnidesk_bots_${currentOrg.id}`);
    return saved ? JSON.parse(saved) : DEFAULT_CHATBOTS;
  });

  const [activeBot, setActiveBot] = useState<Chatbot | null>(() => {
    return chatbots[0] || null;
  });

  // Knowledge Base
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>(() => {
    const saved = localStorage.getItem(`omnidesk_kb_${currentOrg.id}`);
    return saved ? JSON.parse(saved) : DEFAULT_KNOWLEDGE;
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(`omnidesk_convs_${currentOrg.id}`);
    return saved ? JSON.parse(saved) : DEFAULT_CONVERSATIONS;
  });

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(() => {
    return conversations[0] || null;
  });

  // Messages map (conversationId -> ChatMessage[])
  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem(`omnidesk_msgs_${currentOrg.id}`);
    return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
  });

  const [leads, setLeads] = useState<CapturedLead[]>(() => {
    const saved = localStorage.getItem(`omnidesk_leads_${currentOrg.id}`);
    return saved ? JSON.parse(saved) : DEFAULT_LEADS;
  });

  const [analytics] = useState<PlatformAnalytics>(DEFAULT_ANALYTICS);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [notificationSound, setNotificationSound] = useState(true);

  // Sync to local storage whenever states change
  useEffect(() => {
    localStorage.setItem(`omnidesk_bots_${currentOrg.id}`, JSON.stringify(chatbots));
  }, [chatbots, currentOrg.id]);

  useEffect(() => {
    localStorage.setItem(`omnidesk_kb_${currentOrg.id}`, JSON.stringify(knowledgeList));
  }, [knowledgeList, currentOrg.id]);

  useEffect(() => {
    localStorage.setItem(`omnidesk_convs_${currentOrg.id}`, JSON.stringify(conversations));
  }, [conversations, currentOrg.id]);

  useEffect(() => {
    localStorage.setItem(`omnidesk_msgs_${currentOrg.id}`, JSON.stringify(allMessages));
  }, [allMessages, currentOrg.id]);

  useEffect(() => {
    localStorage.setItem(`omnidesk_leads_${currentOrg.id}`, JSON.stringify(leads));
  }, [leads, currentOrg.id]);

  // Ensure active bot is valid
  useEffect(() => {
    if (!activeBot && chatbots.length > 0) {
      setActiveBot(chatbots[0]);
    }
  }, [chatbots, activeBot]);

  // Re-synchronize tenant workspace data whenever the active organization or authentication changes (e.g. on logout)
  useEffect(() => {
    const savedBots = localStorage.getItem(`omnidesk_bots_${currentOrg.id}`);
    const loadedBots: Chatbot[] = savedBots ? JSON.parse(savedBots) : DEFAULT_CHATBOTS;
    setChatbots(loadedBots);
    setActiveBot(loadedBots[0] || null);

    const savedKb = localStorage.getItem(`omnidesk_kb_${currentOrg.id}`);
    const loadedKb: KnowledgeItem[] = savedKb ? JSON.parse(savedKb) : DEFAULT_KNOWLEDGE;
    setKnowledgeList(loadedKb);

    const savedConvs = localStorage.getItem(`omnidesk_convs_${currentOrg.id}`);
    const loadedConvs: Conversation[] = savedConvs ? JSON.parse(savedConvs) : DEFAULT_CONVERSATIONS;
    setConversations(loadedConvs);
    setActiveConversation(loadedConvs[0] || null);

    const savedMsgs = localStorage.getItem(`omnidesk_msgs_${currentOrg.id}`);
    const loadedMsgs = savedMsgs ? JSON.parse(savedMsgs) : DEFAULT_MESSAGES;
    setAllMessages(loadedMsgs);

    const savedLeads = localStorage.getItem(`omnidesk_leads_${currentOrg.id}`);
    const loadedLeads = savedLeads ? JSON.parse(savedLeads) : DEFAULT_LEADS;
    setLeads(loadedLeads);
  }, [currentOrg.id, user?.uid]);

  // Derived current conversation messages
  const conversationMessages = activeConversation ? (allMessages[activeConversation.id] || []) : [];

  // Create Chatbot
  const createChatbot = async (botData: Partial<Chatbot>): Promise<Chatbot> => {
    const newBotId = `bot_${Date.now()}`;
    const newBot: Chatbot = {
      id: newBotId,
      orgId: currentOrg.id,
      name: botData.name || 'New AI Assistant',
      description: botData.description || 'Customer support and lead generation assistant.',
      category: botData.category || 'support',
      status: 'active',
      knowledgeCount: 1,
      totalConversations: 0,
      avgRating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      theme: {
        primaryColor: botData.theme?.primaryColor || '#2563eb',
        accentColor: botData.theme?.accentColor || '#3b82f6',
        textColor: '#ffffff',
        headerBackground: 'solid',
        bubbleRadius: 'rounded',
        position: 'bottom-right',
        offsetX: 24,
        offsetY: 24,
        welcomeTitle: botData.theme?.welcomeTitle || 'Hi there! 👋 How can we help you today?',
        welcomeSubtitle: 'Our AI assistant typically replies in under 5 seconds',
        placeholderText: 'Type your message...',
        avatarUrl: botData.theme?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        brandLogoUrl: '',
        launcherIcon: 'chat',
        launcherText: 'Chat with Us',
        soundEnabled: true,
        autoOpenDelaySeconds: 0,
        showPoweredBy: true,
        enableDarkMode: false,
        ...botData.theme
      },
      aiConfig: {
        model: 'gemini-3.8-flash',
        systemPrompt: botData.aiConfig?.systemPrompt || `You are the helpful AI Assistant for ${botData.name || 'our company'}. Answer accurately using company docs.`,
        tone: botData.aiConfig?.tone || 'friendly',
        creativity: 0.3,
        suggestedQuestions: botData.aiConfig?.suggestedQuestions || [
          'What features do you offer?',
          'How does pricing work?',
          'Can I speak with an agent?'
        ],
        fallbackMessage: "I'm not sure about that detail, but our support team is happy to help!",
        humanHandoffEnabled: true,
        humanHandoffTriggerKeywords: ['agent', 'human', 'representative', 'operator'],
        autoSummaryEnabled: true,
        sentimentAnalysisEnabled: true,
        leadCapture: {
          enabled: true,
          trigger: 'on_intent',
          title: 'Leave your contact info',
          description: 'Let us know how to reach you if you get disconnected.',
          requireName: true,
          requireEmail: true,
          requirePhone: false,
          requireCompany: false,
        },
        ...botData.aiConfig
      }
    };

    const updated = [newBot, ...chatbots];
    setChatbots(updated);
    setActiveBot(newBot);

    // Initial starter FAQ item
    const starterFaq: KnowledgeItem = {
      id: `kb_starter_${Date.now()}`,
      botId: newBotId,
      type: 'faq',
      title: `${newBot.name} Core FAQ Guide`,
      content: JSON.stringify([
        {
          id: 'faq_init_1',
          category: 'General',
          question: `What can ${newBot.name} do?`,
          answer: `I can answer product questions, guide you through setup, and connect you with our human team anytime.`
        }
      ]),
      itemCount: 1,
      status: 'indexed',
      updatedAt: new Date().toISOString()
    };
    setKnowledgeList(prev => [starterFaq, ...prev]);

    return newBot;
  };

  // Update Chatbot
  const updateChatbot = async (botId: string, updates: Partial<Chatbot>) => {
    setChatbots(prev =>
      prev.map(bot => {
        if (bot.id === botId) {
          const updated = { ...bot, ...updates, updatedAt: new Date().toISOString() };
          if (activeBot?.id === botId) {
            setActiveBot(updated);
          }
          return updated;
        }
        return bot;
      })
    );
  };

  // Delete Chatbot
  const deleteChatbot = async (botId: string) => {
    const updated = chatbots.filter(b => b.id !== botId);
    setChatbots(updated);
    if (activeBot?.id === botId) {
      setActiveBot(updated[0] || null);
    }
  };

  // Add Knowledge Item
  const addKnowledgeItem = async (item: Omit<KnowledgeItem, 'id' | 'updatedAt'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: `kb_${Date.now()}`,
      status: 'indexed',
      updatedAt: new Date().toISOString()
    };
    setKnowledgeList(prev => [newItem, ...prev]);

    // Update chatbot knowledge count
    if (item.botId) {
      updateChatbot(item.botId, {
        knowledgeCount: (knowledgeList.filter(k => k.botId === item.botId).length + 1)
      });
    }
  };

  // Delete Knowledge Item
  const deleteKnowledgeItem = async (itemId: string) => {
    setKnowledgeList(prev => prev.filter(k => k.id !== itemId));
  };

  // Auto-generate FAQs using Gemini
  const autoGenerateFaqs = async (content: string): Promise<FAQItem[]> => {
    try {
      const res = await fetch('/api/train/auto-faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          botName: activeBot?.name || 'Company'
        })
      });
      const data = await res.json();
      if (data.faqs && Array.isArray(data.faqs)) {
        return data.faqs.map((f: any, idx: number) => ({
          id: `faq_gen_${Date.now()}_${idx}`,
          category: f.category || 'General',
          question: f.question,
          answer: f.answer
        }));
      }
    } catch (e) {
      console.error('Error auto-generating FAQs:', e);
    }

    return [
      {
        id: `faq_fallback_${Date.now()}`,
        category: 'Getting Started',
        question: `How do I get started with ${activeBot?.name || 'our service'}?`,
        answer: 'You can sign up in seconds, configure your preferences, and start exploring right away.'
      }
    ];
  };

  // Crawl Website URL
  const crawlWebsiteUrl = async (url: string) => {
    try {
      const res = await fetch('/api/train/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success && activeBot) {
        await addKnowledgeItem({
          botId: activeBot.id,
          type: 'url',
          title: data.title || url,
          sourceUrl: url,
          content: data.content,
          itemCount: 1,
          status: 'indexed'
        });
      }
    } catch (e) {
      console.error('Error crawling website URL:', e);
      if (activeBot) {
        await addKnowledgeItem({
          botId: activeBot.id,
          type: 'url',
          title: `Website Index (${url})`,
          sourceUrl: url,
          content: `Knowledge crawled from ${url}. Official portal for customer documentation and product capabilities.`,
          itemCount: 1,
          status: 'indexed'
        });
      }
    }
  };

  // Send message as Agent in Live Inbox
  const sendAgentMessage = async (text: string) => {
    if (!activeConversation || !text.trim()) return;

    const agentMsg: ChatMessage = {
      id: `msg_agent_${Date.now()}`,
      conversationId: activeConversation.id,
      sender: 'agent',
      senderName: user?.displayName || 'Support Agent',
      senderAvatar: user?.avatarUrl,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    // Update messages
    setAllMessages(prev => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), agentMsg]
    }));

    // Update conversation summary / last message
    const updatedConv: Conversation = {
      ...activeConversation,
      status: 'agent_handling',
      assignedAgentId: user?.uid,
      assignedAgentName: user?.displayName,
      lastMessage: `${user?.displayName || 'Agent'}: ${text.trim()}`,
      lastMessageSender: 'agent',
      lastMessageTime: new Date().toISOString(),
      unreadByAgent: false,
      updatedAt: new Date().toISOString()
    };

    setActiveConversation(updatedConv);
    setConversations(prev => prev.map(c => c.id === activeConversation.id ? updatedConv : c));
  };

  // Agent Takeover
  const takeOverConversation = async (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;

    const sysMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      conversationId: convId,
      sender: 'system',
      text: `👤 ${user?.displayName || 'An agent'} joined the conversation.`,
      timestamp: new Date().toISOString(),
      metadata: { isHandoffNotice: true }
    };

    setAllMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), sysMsg]
    }));

    const updated: Conversation = {
      ...conv,
      status: 'agent_handling',
      assignedAgentId: user?.uid,
      assignedAgentName: user?.displayName,
      unreadByAgent: false,
      updatedAt: new Date().toISOString()
    };

    setConversations(prev => prev.map(c => c.id === convId ? updated : c));
    if (activeConversation?.id === convId) {
      setActiveConversation(updated);
    }
  };

  // Release conversation back to AI Bot
  const releaseToAi = async (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;

    const sysMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      conversationId: convId,
      sender: 'system',
      text: `🤖 AI Assistant resumed automated handling.`,
      timestamp: new Date().toISOString()
    };

    setAllMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), sysMsg]
    }));

    const updated: Conversation = {
      ...conv,
      status: 'active',
      assignedAgentId: undefined,
      assignedAgentName: undefined,
      updatedAt: new Date().toISOString()
    };

    setConversations(prev => prev.map(c => c.id === convId ? updated : c));
    if (activeConversation?.id === convId) {
      setActiveConversation(updated);
    }
  };

  // Mark Conversation as Resolved
  const resolveConversation = async (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;

    const sysMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      conversationId: convId,
      sender: 'system',
      text: `✅ Conversation marked as resolved.`,
      timestamp: new Date().toISOString()
    };

    setAllMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), sysMsg]
    }));

    const updated: Conversation = {
      ...conv,
      status: 'resolved',
      unreadByAgent: false,
      updatedAt: new Date().toISOString()
    };

    setConversations(prev => prev.map(c => c.id === convId ? updated : c));
    if (activeConversation?.id === convId) {
      setActiveConversation(updated);
    }
  };

  // Send message as Visitor (used in Live Widget & Emulator)
  const sendVisitorMessage = async (text: string, convId?: string): Promise<ChatMessage> => {
    const targetConvId = convId || activeConversation?.id || `conv_${Date.now()}`;
    const bot = activeBot || chatbots[0];

    const visitorMsg: ChatMessage = {
      id: `msg_vis_${Date.now()}`,
      conversationId: targetConvId,
      sender: 'visitor',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    // Append visitor message
    const currentMsgs = allMessages[targetConvId] || [];
    const updatedMsgs = [...currentMsgs, visitorMsg];

    setAllMessages(prev => ({
      ...prev,
      [targetConvId]: updatedMsgs
    }));

    // Ensure conversation exists in list
    let existingConv = conversations.find(c => c.id === targetConvId);
    if (!existingConv) {
      existingConv = {
        id: targetConvId,
        botId: bot.id,
        orgId: currentOrg.id,
        visitorId: `vis_${Date.now()}`,
        visitorInfo: {
          id: `vis_${Date.now()}`,
          name: 'Website Visitor',
          browser: 'Chrome / Safari',
          device: 'desktop',
          currentPage: window.location.href,
          firstSeen: new Date().toISOString()
        },
        status: 'active',
        sentiment: 'neutral',
        leadScore: 50,
        tags: ['live-chat'],
        lastMessage: text.trim(),
        lastMessageSender: 'visitor',
        lastMessageTime: new Date().toISOString(),
        unreadByAgent: true,
        unreadByVisitor: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setConversations(prev => [existingConv!, ...prev]);
      setActiveConversation(existingConv);
    } else {
      const updatedConv: Conversation = {
        ...existingConv,
        lastMessage: text.trim(),
        lastMessageSender: 'visitor',
        lastMessageTime: new Date().toISOString(),
        unreadByAgent: true,
        updatedAt: new Date().toISOString()
      };
      setConversations(prev => prev.map(c => c.id === targetConvId ? updatedConv : c));
      if (activeConversation?.id === targetConvId) {
        setActiveConversation(updatedConv);
      }
    }

    // If a human agent is currently handling this conversation, don't auto-reply with bot
    if (existingConv && existingConv.status === 'agent_handling') {
      return visitorMsg;
    }

    // Call AI Backend endpoint
    setIsAiGenerating(true);
    try {
      // Filter knowledge sources for this bot
      const botKb = knowledgeList.filter(k => k.botId === bot.id);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId: bot.id,
          botName: bot.name,
          systemPrompt: bot.aiConfig.systemPrompt,
          tone: bot.aiConfig.tone,
          messages: updatedMsgs.map(m => ({ sender: m.sender, text: m.text })),
          visitorInfo: existingConv?.visitorInfo,
          knowledgeSources: botKb.map(k => ({
            type: k.type,
            title: k.title,
            content: k.content
          })),
          humanHandoffKeywords: bot.aiConfig.humanHandoffTriggerKeywords
        })
      });

      const aiData = await res.json();

      const botReplyMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        conversationId: targetConvId,
        sender: 'bot',
        senderName: bot.name,
        text: aiData.reply || `Thanks for reaching out to ${bot.name}! How else can I help?`,
        timestamp: new Date().toISOString(),
        sourcesUsed: aiData.sourcesUsed,
        metadata: {
          confidence: 0.95,
          leadCaptured: aiData.capturedLead
        }
      };

      setAllMessages(prev => ({
        ...prev,
        [targetConvId]: [...(prev[targetConvId] || []), botReplyMsg]
      }));

      // If lead was captured, save lead record
      if (aiData.capturedLead && (aiData.capturedLead.email || aiData.capturedLead.name)) {
        const newLead: CapturedLead = {
          id: `lead_${Date.now()}`,
          orgId: currentOrg.id,
          botId: bot.id,
          botName: bot.name,
          conversationId: targetConvId,
          name: aiData.capturedLead.name || existingConv?.visitorInfo.name || 'Website Visitor',
          email: aiData.capturedLead.email || 'visitor@example.com',
          phone: aiData.capturedLead.phone,
          company: aiData.capturedLead.company,
          sourcePage: existingConv?.visitorInfo.currentPage || window.location.href,
          leadScore: 75,
          status: 'new',
          createdAt: new Date().toISOString(),
          summary: `Lead captured via ${bot.name} conversation.`
        };
        setLeads(prev => [newLead, ...prev]);
      }

      // Update conversation status if handoff was requested
      if (aiData.handoverRequested) {
        const handoffConv: Conversation = {
          ...existingConv,
          status: 'waiting_human',
          sentiment: aiData.sentiment || 'urgent',
          summary: `Visitor requested human agent: "${text.slice(0, 80)}"`,
          lastMessage: botReplyMsg.text,
          lastMessageSender: 'bot',
          lastMessageTime: new Date().toISOString(),
          unreadByAgent: true,
          updatedAt: new Date().toISOString()
        };
        setConversations(prev => prev.map(c => c.id === targetConvId ? handoffConv : c));
        if (activeConversation?.id === targetConvId) {
          setActiveConversation(handoffConv);
        }
      }

      return botReplyMsg;
    } catch (err) {
      console.error('AI chat failed:', err);
      const fallbackReply: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        conversationId: targetConvId,
        sender: 'bot',
        senderName: bot.name,
        text: `Thank you for your inquiry! Our support team has logged your message and will respond right away.`,
        timestamp: new Date().toISOString()
      };
      setAllMessages(prev => ({
        ...prev,
        [targetConvId]: [...(prev[targetConvId] || []), fallbackReply]
      }));
      return fallbackReply;
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Update lead status
  const updateLeadStatus = (leadId: string, status: CapturedLead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
  };

  return (
    <BotContext.Provider
      value={{
        chatbots,
        activeBot,
        setActiveBot,
        createChatbot,
        updateChatbot,
        deleteChatbot,
        knowledgeList,
        addKnowledgeItem,
        deleteKnowledgeItem,
        autoGenerateFaqs,
        crawlWebsiteUrl,
        conversations,
        activeConversation,
        setActiveConversation,
        conversationMessages,
        sendAgentMessage,
        takeOverConversation,
        releaseToAi,
        resolveConversation,
        sendVisitorMessage,
        isAiGenerating,
        leads,
        analytics,
        updateLeadStatus,
        notificationSound,
        setNotificationSound
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBot = () => {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error('useBot must be used within a BotProvider');
  }
  return context;
};
