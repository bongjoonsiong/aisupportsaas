export type UserRole = 'owner' | 'admin' | 'agent';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  orgId: string;
  isOnline: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'pro' | 'enterprise';
  createdAt: string;
  membersCount: number;
}

export type KnowledgeType = 'url' | 'pdf' | 'faq' | 'text';

export interface KnowledgeItem {
  id: string;
  botId: string;
  type: KnowledgeType;
  title: string;
  sourceUrl?: string;
  content: string;
  itemCount?: number;
  status: 'indexed' | 'training' | 'error';
  updatedAt: string;
  metadata?: {
    fileSize?: string;
    pageCount?: number;
    tags?: string[];
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ChatbotTheme {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  headerBackground: 'solid' | 'gradient' | 'dark' | 'glass';
  bubbleRadius: 'rounded' | 'full' | 'square';
  position: 'bottom-right' | 'bottom-left';
  offsetX: number;
  offsetY: number;
  welcomeTitle: string;
  welcomeSubtitle: string;
  placeholderText: string;
  brandLogoUrl?: string;
  avatarUrl: string;
  launcherIcon: 'chat' | 'sparkles' | 'headset' | 'help' | 'bot';
  launcherText?: string;
  soundEnabled: boolean;
  autoOpenDelaySeconds: number;
  showPoweredBy: boolean;
  enableDarkMode: boolean;
}

export interface LeadCaptureConfig {
  enabled: boolean;
  trigger: 'before_chat' | 'first_message' | 'on_intent';
  title: string;
  description: string;
  requireName: boolean;
  requireEmail: boolean;
  requirePhone: boolean;
  requireCompany: boolean;
}

export type LLMProvider = 'google' | 'openai' | 'anthropic' | 'custom';
export type ModelTier = 'standard' | 'high_speed' | 'pro' | 'frontier';

export interface ModelOption {
  id: string;
  name: string;
  provider: LLMProvider;
  tier: ModelTier;
  description: string;
  badge: string;
  contextWindow: string;
  speed: 'Instant' | 'Fast' | 'Balanced' | 'Deep Think';
}

export const AVAILABLE_MODELS: ModelOption[] = [
  // Google Gemini
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'google',
    tier: 'standard',
    badge: 'Recommended · Ultra Fast',
    description: 'Sub-second latency with multimodal reasoning. Optimal default for real-time customer support widgets.',
    contextWindow: '1M tokens',
    speed: 'Instant'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    tier: 'high_speed',
    badge: 'High Throughput',
    description: 'Ultra cost-effective model tuned for high concurrency and immediate response generation.',
    contextWindow: '1M tokens',
    speed: 'Instant'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    tier: 'pro',
    badge: 'Deep Reasoning',
    description: 'Advanced logical reasoning across extensive enterprise documentation, contracts, and manuals.',
    contextWindow: '2M tokens',
    speed: 'Balanced'
  },
  {
    id: 'gemini-4-arton',
    name: 'Gemini 4 Arton',
    provider: 'google',
    tier: 'frontier',
    badge: 'Frontier Flagship ⭐',
    description: 'Next-generation frontier AI with agentic self-reflection, multimodal synthesis, and near-zero hallucination rate.',
    contextWindow: '4M tokens',
    speed: 'Deep Think'
  },

  // OpenAI / ChatGPT
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'openai',
    tier: 'high_speed',
    badge: 'Fast & Budget-Friendly',
    description: 'Lightweight conversational intelligence engineered for high-frequency customer chats and quick FAQ answers.',
    contextWindow: '128K tokens',
    speed: 'Fast'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Flagship',
    provider: 'openai',
    tier: 'pro',
    badge: 'Omnimodal Intelligence',
    description: 'Versatile, high-precision natural language model for nuanced multi-turn customer engagements and sales.',
    contextWindow: '128K tokens',
    speed: 'Balanced'
  },
  {
    id: 'chatgpt-6-astra-sol',
    name: 'ChatGPT 6 Astra Sol',
    provider: 'openai',
    tier: 'frontier',
    badge: 'Next-Gen Frontier ⭐',
    description: 'Next-generation cognitive architecture with predictive customer empathy, emotional EQ, and deep intent recognition.',
    contextWindow: '512K tokens',
    speed: 'Deep Think'
  },

  // Anthropic Claude
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    tier: 'high_speed',
    badge: 'Lightning Speed',
    description: 'Near-instantaneous responsiveness suited for rapid FAQ lookup and live agent co-pilot suggestions.',
    contextWindow: '200K tokens',
    speed: 'Instant'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    tier: 'pro',
    badge: 'Gold Standard Reasoning',
    description: 'Industry-leading benchmark for complex instructions, safety compliance, and nuanced brand voice adherence.',
    contextWindow: '200K tokens',
    speed: 'Fast'
  },
  {
    id: 'claude-sonnet-5-5',
    name: 'Claude Sonnet 5.5',
    provider: 'anthropic',
    tier: 'frontier',
    badge: 'Enterprise Frontier ⭐',
    description: 'Next-gen enterprise workhorse with ultra-strict compliance, legal audit trails, and zero-deviation policy adherence.',
    contextWindow: '1M tokens',
    speed: 'Balanced'
  },
  {
    id: 'claude-opus-5-5',
    name: 'Claude Opus 5.5',
    provider: 'anthropic',
    tier: 'frontier',
    badge: 'Ultimate Frontier Intelligence ⭐',
    description: 'Unrivaled cognitive depth, long-horizon multi-step problem solving, and complex dispute resolution for high-value enterprise accounts.',
    contextWindow: '2M tokens',
    speed: 'Deep Think'
  },

  // Custom / Fine-Tuned
  {
    id: 'custom-model',
    name: 'Custom / Fine-Tuned Enterprise Model',
    provider: 'custom',
    tier: 'pro',
    badge: 'Enterprise BYOK',
    description: 'Connect your private fine-tuned checkpoint, Azure OpenAI deployment, DeepSeek-R1, or self-hosted endpoint.',
    contextWindow: 'Custom',
    speed: 'Balanced'
  }
];

export interface AIConfig {
  provider?: LLMProvider;
  model: string;
  customModelName?: string;
  byokEnabled?: boolean;
  byokApiKey?: string;
  customEndpoint?: string;
  systemPrompt: string;
  tone: 'professional' | 'friendly' | 'empathic' | 'concise' | 'technical';
  creativity: number; // 0 to 1
  suggestedQuestions: string[];
  fallbackMessage: string;
  humanHandoffEnabled: boolean;
  humanHandoffTriggerKeywords: string[];
  autoSummaryEnabled: boolean;
  sentimentAnalysisEnabled: boolean;
  leadCapture: LeadCaptureConfig;
}

export interface Chatbot {
  id: string;
  orgId: string;
  name: string;
  description: string;
  category: 'support' | 'sales' | 'onboarding' | 'custom';
  status: 'active' | 'draft' | 'archived';
  theme: ChatbotTheme;
  aiConfig: AIConfig;
  knowledgeCount: number;
  totalConversations: number;
  avgRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorInfo {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  ip?: string;
  country?: string;
  city?: string;
  browser?: string;
  os?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  currentPage?: string;
  referrer?: string;
  timezone?: string;
  firstSeen?: string;
}

export type ConversationStatus = 'active' | 'waiting_human' | 'agent_handling' | 'resolved' | 'archived';
export type SentimentType = 'positive' | 'neutral' | 'frustrated' | 'urgent';

export interface Conversation {
  id: string;
  botId: string;
  orgId: string;
  visitorId: string;
  visitorInfo: VisitorInfo;
  status: ConversationStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  sentiment: SentimentType;
  summary?: string;
  leadScore: number;
  tags: string[];
  rating?: number;
  ratingFeedback?: string;
  lastMessage: string;
  lastMessageSender: 'visitor' | 'bot' | 'agent' | 'system';
  lastMessageTime: string;
  unreadByAgent: boolean;
  unreadByVisitor: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'visitor' | 'bot' | 'agent' | 'system';
  senderName?: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  sourcesUsed?: string[];
  metadata?: {
    isHandoffNotice?: boolean;
    leadCaptured?: Partial<VisitorInfo>;
    confidence?: number;
  };
}

export interface CapturedLead {
  id: string;
  orgId: string;
  botId: string;
  botName: string;
  conversationId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  sourcePage?: string;
  leadScore: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  createdAt: string;
  summary?: string;
}

export interface PlatformAnalytics {
  totalConversations: number;
  aiHandledPercentage: number;
  avgResponseTimeMs: number;
  avgCsat: number;
  totalLeads: number;
  resolvedCount: number;
  escalatedToHumanCount: number;
  dailyTrend: { date: string; conversations: number; leads: number; resolutionRate: number }[];
  topTopics: { topic: string; count: number; sentiment: SentimentType }[];
}
