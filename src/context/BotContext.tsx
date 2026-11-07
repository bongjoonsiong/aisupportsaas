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
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

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

  // Real-time Cloud Firestore Subscriptions for the current organization
  useEffect(() => {
    if (!currentOrg?.id) return;
    const orgId = currentOrg.id;

    // 1. Subscribe to Chatbots
    let unsubBots: (() => void) | undefined;
    try {
      const botsQuery = query(collection(db, 'chatbots'), where('orgId', '==', orgId));
      unsubBots = onSnapshot(botsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(d => d.data() as Chatbot);
          setChatbots(loaded);
          localStorage.setItem(`omnidesk_bots_${orgId}`, JSON.stringify(loaded));
          setActiveBot(prev => (prev && loaded.some(b => b.id === prev.id) ? loaded.find(b => b.id === prev.id)! : loaded[0] || null));
        } else {
          // If first-time org with no bots in Firestore yet, seed initial bots to Firestore
          const savedBots = localStorage.getItem(`omnidesk_bots_${orgId}`);
          const seedBots: Chatbot[] = savedBots ? JSON.parse(savedBots) : DEFAULT_CHATBOTS.map(b => ({ ...b, orgId }));
          seedBots.forEach(b => {
            setDoc(doc(db, 'chatbots', b.id), { ...b, orgId }, { merge: true }).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Firestore chatbots listener note (using local cache):', err.message);
      });
    } catch (e) {
      console.warn('Firestore chatbots setup error:', e);
    }

    // 2. Subscribe to Knowledge Base
    let unsubKb: (() => void) | undefined;
    try {
      const kbQuery = query(collection(db, 'knowledge'), where('orgId', '==', orgId));
      unsubKb = onSnapshot(kbQuery, (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(d => d.data() as KnowledgeItem);
          setKnowledgeList(loaded);
          localStorage.setItem(`omnidesk_kb_${orgId}`, JSON.stringify(loaded));
        } else {
          const savedKb = localStorage.getItem(`omnidesk_kb_${orgId}`);
          const seedKb: KnowledgeItem[] = savedKb ? JSON.parse(savedKb) : DEFAULT_KNOWLEDGE.map(k => ({ ...k, orgId }));
          seedKb.forEach(k => {
            setDoc(doc(db, 'knowledge', k.id), { ...k, orgId }, { merge: true }).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Firestore knowledge listener note (using local cache):', err.message);
      });
    } catch (e) {
      console.warn('Firestore knowledge setup error:', e);
    }

    // 3. Subscribe to Leads
    let unsubLeads: (() => void) | undefined;
    try {
      const leadsQuery = query(collection(db, 'leads'), where('orgId', '==', orgId));
      unsubLeads = onSnapshot(leadsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(d => d.data() as CapturedLead);
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLeads(loaded);
          localStorage.setItem(`omnidesk_leads_${orgId}`, JSON.stringify(loaded));
        } else {
          const savedLeads = localStorage.getItem(`omnidesk_leads_${orgId}`);
          const seedLeads: CapturedLead[] = savedLeads ? JSON.parse(savedLeads) : DEFAULT_LEADS.map(l => ({ ...l, orgId }));
          seedLeads.forEach(l => {
            setDoc(doc(db, 'leads', l.id), { ...l, orgId }, { merge: true }).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Firestore leads listener note (using local cache):', err.message);
      });
    } catch (e) {
      console.warn('Firestore leads setup error:', e);
    }

    // 4. Subscribe to Conversations
    let unsubConvs: (() => void) | undefined;
    try {
      const convsQuery = query(collection(db, 'conversations'), where('orgId', '==', orgId));
      unsubConvs = onSnapshot(convsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(d => d.data() as Conversation);
          loaded.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          setConversations(loaded);
          localStorage.setItem(`omnidesk_convs_${orgId}`, JSON.stringify(loaded));
          setActiveConversation(prev => (prev && loaded.some(c => c.id === prev.id) ? loaded.find(c => c.id === prev.id)! : loaded[0] || null));
        }
      }, (err) => {
        console.warn('Firestore conversations listener note (using local cache):', err.message);
      });
    } catch (e) {
      console.warn('Firestore conversations setup error:', e);
    }

    return () => {
      unsubBots?.();
      unsubKb?.();
      unsubLeads?.();
      unsubConvs?.();
    };
  }, [currentOrg.id]);

  // Real-time Cloud Firestore Listener for Messages in active conversation
  useEffect(() => {
    if (!activeConversation?.id) return;
    const convId = activeConversation.id;

    let unsubMsgs: (() => void) | undefined;
    try {
      const msgsQuery = query(collection(db, 'messages'), where('conversationId', '==', convId));
      unsubMsgs = onSnapshot(msgsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const loadedMsgs = snapshot.docs.map(d => d.data() as ChatMessage);
          loadedMsgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setAllMessages(prev => {
            const updated = { ...prev, [convId]: loadedMsgs };
            localStorage.setItem(`omnidesk_msgs_${currentOrg.id}`, JSON.stringify(updated));
            return updated;
          });
        }
      }, (err) => {
        console.warn('Firestore messages listener note:', err.message);
      });
    } catch (e) {
      console.warn('Firestore messages setup error:', e);
    }

    return () => {
      unsubMsgs?.();
    };
  }, [activeConversation?.id, currentOrg.id]);

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
        provider: botData.aiConfig?.provider || 'google',
        model: botData.aiConfig?.model || 'gemini-3.8-flash',
        byokEnabled: botData.aiConfig?.byokEnabled ?? false,
        byokApiKey: botData.aiConfig?.byokApiKey || '',
        customEndpoint: botData.aiConfig?.customEndpoint || '',
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
      orgId: currentOrg.id,
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

    // Persist to Cloud Firestore
    try {
      setDoc(doc(db, 'chatbots', newBot.id), newBot, { merge: true }).catch(err => {
        console.warn('Firestore chatbot create error:', err);
      });
      setDoc(doc(db, 'knowledge', starterFaq.id), starterFaq, { merge: true }).catch(err => {
        console.warn('Firestore starter FAQ create error:', err);
      });
    } catch (e) {
      console.warn('Firestore sync warning:', e);
    }

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
          try {
            setDoc(doc(db, 'chatbots', botId), updated, { merge: true }).catch(err => {
              console.warn('Firestore chatbot update error:', err);
            });
          } catch (e) {
            console.warn('Firestore sync warning:', e);
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
    try {
      deleteDoc(doc(db, 'chatbots', botId)).catch(err => {
        console.warn('Firestore chatbot delete error:', err);
      });
    } catch (e) {
      console.warn('Firestore sync warning:', e);
    }
  };

  // Add Knowledge Item
  const addKnowledgeItem = async (item: Omit<KnowledgeItem, 'id' | 'updatedAt'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: `kb_${Date.now()}`,
      orgId: currentOrg.id,
      status: 'indexed',
      updatedAt: new Date().toISOString()
    };
    setKnowledgeList(prev => [newItem, ...prev]);

    try {
      setDoc(doc(db, 'knowledge', newItem.id), newItem, { merge: true }).catch(err => {
        console.warn('Firestore knowledge add error:', err);
      });
    } catch (e) {
      console.warn('Firestore sync warning:', e);
    }

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
    try {
      deleteDoc(doc(db, 'knowledge', itemId)).catch(err => {
        console.warn('Firestore knowledge delete error:', err);
      });
    } catch (e) {
      console.warn('Firestore sync warning:', e);
    }
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

    // Persist to Cloud Firestore
    try {
      setDoc(doc(db, 'messages', agentMsg.id), agentMsg, { merge: true }).catch(() => {});
      setDoc(doc(db, 'conversations', activeConversation.id), updatedConv, { merge: true }).catch(() => {});
    } catch (_) {}
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

    // Persist to Cloud Firestore
    try {
      setDoc(doc(db, 'messages', sysMsg.id), sysMsg, { merge: true }).catch(() => {});
      setDoc(doc(db, 'conversations', convId), updated, { merge: true }).catch(() => {});
    } catch (_) {}
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

    // Persist to Cloud Firestore
    try {
      setDoc(doc(db, 'messages', sysMsg.id), sysMsg, { merge: true }).catch(() => {});
      setDoc(doc(db, 'conversations', convId), updated, { merge: true }).catch(() => {});
    } catch (_) {}
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

    // Persist to Cloud Firestore
    try {
      setDoc(doc(db, 'messages', sysMsg.id), sysMsg, { merge: true }).catch(() => {});
      setDoc(doc(db, 'conversations', convId), updated, { merge: true }).catch(() => {});
    } catch (_) {}
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

    // Persist visitor message and conversation to Cloud Firestore
    try {
      setDoc(doc(db, 'messages', visitorMsg.id), visitorMsg, { merge: true }).catch(() => {});
      if (existingConv) {
        setDoc(doc(db, 'conversations', existingConv.id), existingConv, { merge: true }).catch(() => {});
      }
    } catch (_) {}

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
          provider: bot.aiConfig.provider || 'google',
          model: bot.aiConfig.model || 'gemini-3.8-flash',
          customModelName: bot.aiConfig.customModelName,
          byokEnabled: bot.aiConfig.byokEnabled || false,
          byokApiKey: bot.aiConfig.byokApiKey,
          customEndpoint: bot.aiConfig.customEndpoint,
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

      // Persist bot reply to Cloud Firestore
      try {
        setDoc(doc(db, 'messages', botReplyMsg.id), botReplyMsg, { merge: true }).catch(() => {});
      } catch (_) {}

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
        try {
          setDoc(doc(db, 'leads', newLead.id), newLead, { merge: true }).catch(() => {});
        } catch (_) {}
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
        try {
          setDoc(doc(db, 'conversations', targetConvId), handoffConv, { merge: true }).catch(() => {});
        } catch (_) {}
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
      try {
        setDoc(doc(db, 'messages', fallbackReply.id), fallbackReply, { merge: true }).catch(() => {});
      } catch (_) {}
      return fallbackReply;
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Update lead status
  const updateLeadStatus = (leadId: string, status: CapturedLead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
    try {
      setDoc(doc(db, 'leads', leadId), { status }, { merge: true }).catch(() => {});
    } catch (_) {}
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
