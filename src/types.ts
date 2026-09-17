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

export interface AIConfig {
  model: string;
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
