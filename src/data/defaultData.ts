import { Chatbot, Conversation, KnowledgeItem, FAQItem, CapturedLead, PlatformAnalytics } from '../types';

export const DEFAULT_ORG = {
  id: 'org_acme_cloud',
  name: 'Acme Cloud Technologies',
  slug: 'acme-cloud',
  plan: 'pro' as const,
  createdAt: '2026-01-15T08:00:00Z',
  membersCount: 4,
};

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Billing & Pricing',
    question: 'How does your 14-day free trial work?',
    answer: 'Our 14-day free trial gives you full access to all Pro features with no credit card required. You can invite team members, deploy AI bots, and train on unlimited docs.',
  },
  {
    id: 'faq_2',
    category: 'Billing & Pricing',
    question: 'Can I cancel or change my subscription at any time?',
    answer: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time from Settings > Billing. Your changes will take effect at the end of the billing cycle.',
  },
  {
    id: 'faq_3',
    category: 'Installation & Integrations',
    question: 'How do I add the AI chatbot to Shopify or WordPress?',
    answer: 'Simply copy your unique JavaScript embed script from the Widget Installation tab and paste it into your Shopify theme.liquid file before the closing </body> tag, or use the WordPress Header/Footer plugin.',
  },
  {
    id: 'faq_4',
    category: 'Features & Training',
    question: 'Can the AI bot answer from my own private PDFs and help center docs?',
    answer: 'Yes! You can upload PDFs, Word docs, raw text, or enter your website sitemap/URLs. Our engine extracts and indexes the text with semantic search to provide 100% accurate responses.',
  },
  {
    id: 'faq_5',
    category: 'Human Agent Handoff',
    question: 'What happens when the AI cannot answer a question?',
    answer: 'The bot automatically detects when a customer requires human assistance or is frustrated, collects their contact details, and notifies your live agent dashboard with an instant notification.',
  },
  {
    id: 'faq_6',
    category: 'Security & Privacy',
    question: 'Is customer chat data secure and GDPR compliant?',
    answer: 'Yes, we are fully GDPR and SOC-2 compliant. Data is encrypted in transit and at rest. We never use your proprietary business training data to train public foundation models.',
  },
  {
    id: 'faq_7',
    category: 'Shipping & Returns',
    question: 'What is your return policy and how does the 30-day trial work?',
    answer: 'We offer a 100% risk-free 30-Day In-Home Trial on all audio gear and hardware. If you are not completely satisfied, you can initiate a return within 30 days of delivery for a full refund back to your original payment method. We provide a prepaid shipping return label with zero restocking fees.',
  },
  {
    id: 'faq_8',
    category: 'Shipping & Returns',
    question: 'Do you offer free shipping and how long does delivery take?',
    answer: 'Yes! We provide Free Express Shipping on all orders over $99 via DHL Express and FedEx. Orders placed before 2:00 PM EST ship same-day. Delivery typically takes 2-3 business days within North America and Europe, and 3-5 business days internationally with full real-time GPS tracking.',
  },
  {
    id: 'faq_9',
    category: 'Hardware & Warranty',
    question: 'What is included in the 2-Year Manufacturer Warranty?',
    answer: 'Every pair of Studio Pro Wireless headphones includes a comprehensive 2-Year Full Replacement Warranty covering manufacturing defects, battery health degradation below 80%, driver failure, and mechanical hardware issues. Replacements are expedited with express courier shipping.',
  },
  {
    id: 'faq_10',
    category: 'Hardware & Specs',
    question: 'How long does the battery last and does it support fast USB-C charging?',
    answer: 'The Studio Pro Wireless headphones provide up to 40 hours of continuous playback with Active Noise Cancellation (ANC) enabled, and over 60 hours with ANC turned off. Rapid USB-C charging gives you 5 hours of playback time from just a 10-minute charge, with a full 0-100% charge taking 75 minutes.',
  }
];

export const DEFAULT_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'kb_1',
    botId: 'bot_support_pro',
    type: 'faq',
    title: 'Acme Cloud & E-Commerce Core FAQ Guide',
    content: JSON.stringify(DEFAULT_FAQS),
    itemCount: DEFAULT_FAQS.length,
    status: 'indexed',
    updatedAt: '2026-08-28T14:30:00Z',
    metadata: { tags: ['pricing', 'features', 'setup', 'shipping', 'returns', 'warranty'] }
  },
  {
    id: 'kb_2',
    botId: 'bot_support_pro',
    type: 'url',
    title: 'Nordic Audio Pro - Store Shipping, Returns & Warranty Guide',
    sourceUrl: 'https://demo-store.com/policies/returns-and-shipping',
    content: 'Nordic Audio Store Policy Guide:\n• 30-Day Risk-Free Trial: Return any gear within 30 days of delivery for a 100% full refund. Prepaid DHL/FedEx return shipping labels are provided.\n• Free Express Shipping: Orders over $99 qualify for free 2-3 day express shipping with same-day dispatch before 2 PM EST.\n• 2-Year Full Replacement Warranty: Covers internal acoustic drivers, ANC components, Bluetooth 5.4 wireless modules, and battery degradation.\n• Battery Life: 40 hours with ANC active, 60 hours in standard mode. 10-minute quick charge delivers 5 hours of listening.\n• Human Support & Concierge: Our live audio specialist agents are available 24/7 for order modifications, sizing assistance, and technical troubleshooting.',
    itemCount: 1,
    status: 'indexed',
    updatedAt: '2026-08-30T10:15:00Z',
  },
  {
    id: 'kb_3',
    botId: 'bot_support_pro',
    type: 'pdf',
    title: 'Enterprise SLA & Security Whitepaper.pdf',
    content: 'Enterprise customers receive a dedicated Customer Success Manager, guaranteed sub-15 minute response time for critical incidents, custom SAML/SSO integration, audit logs retention for 365 days, and role-based access control (RBAC). Data residency options include US-East, EU-Central, and AP-East.',
    itemCount: 8,
    status: 'indexed',
    updatedAt: '2026-08-31T09:00:00Z',
    metadata: { fileSize: '1.4 MB', pageCount: 8 }
  }
];

// Dedicated, isolated public demo bot for the interactive storefront showcase
export const PUBLIC_STOREFRONT_BOT: Chatbot = {
  id: 'bot_aura_sound_showcase',
  orgId: 'demo_public_showcase',
  name: 'Aura Sound Concierge',
  description: 'Public showroom assistant for Aura Sound high-fidelity headphones, shipping, and returns.',
  category: 'sales',
  status: 'active',
  knowledgeCount: 2,
  totalConversations: 850,
  avgRating: 4.95,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-09-01T00:00:00Z',
  theme: {
    primaryColor: '#059669', // Emerald-600
    accentColor: '#10b981',
    textColor: '#ffffff',
    headerBackground: 'solid',
    bubbleRadius: 'rounded',
    position: 'bottom-right',
    offsetX: 24,
    offsetY: 24,
    welcomeTitle: 'Welcome to Aura Sound! 🎧',
    welcomeSubtitle: 'Ask me about Studio Pro ANC, 30-day trials, or express shipping',
    placeholderText: 'Ask about battery life, returns, or warranty...',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    brandLogoUrl: '',
    launcherIcon: 'chat',
    launcherText: 'Ask Aura Concierge',
    soundEnabled: true,
    autoOpenDelaySeconds: 0,
    showPoweredBy: true,
    enableDarkMode: false,
  },
  aiConfig: {
    model: 'gemini-3.8-flash',
    systemPrompt: 'You are the knowledgeable, polite audio concierge for Aura Sound Storefront. You answer questions about Studio Pro Wireless ANC Headphones ($299, 40h ANC battery, 30-day trial, free 2-day express shipping, 2-year warranty). Be helpful, concise, and friendly.',
    tone: 'friendly',
    creativity: 0.3,
    suggestedQuestions: [
      'What is the return & 30-day trial policy?',
      'How long does the battery last with ANC?',
      'Does it come with a replacement warranty?',
      'What is included inside the box?'
    ],
    fallbackMessage: "I'd be glad to check that with our audio engineering team! Feel free to leave your email or reach out to support@aurasound.store.",
    humanHandoffEnabled: true,
    humanHandoffTriggerKeywords: ['agent', 'human', 'representative', 'operator', 'refund'],
    autoSummaryEnabled: true,
    sentimentAnalysisEnabled: true,
    leadCapture: {
      enabled: true,
      trigger: 'on_intent',
      title: 'Get 10% off your first order',
      description: 'Leave your email to receive an instant coupon code.',
      requireName: true,
      requireEmail: true,
      requirePhone: false,
      requireCompany: false,
    }
  }
};

export const PUBLIC_STOREFRONT_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'kb_aura_sound_specs',
    botId: 'bot_aura_sound_showcase',
    type: 'text',
    title: 'Aura Studio Pro Wireless ANC Product Specifications',
    content: `Product: Aura Studio Pro Wireless ANC Headphones
Price: $299 USD (Special Launch Price, Regular $349)
Acoustic Drivers: Custom 40mm Beryllium dynamic acoustic drivers
Active Noise Cancellation: Hybrid ANC reducing up to 38dB of ambient background noise
Transparency Mode: One-tap ambient passthrough mode for hearing surroundings
Battery Life: 40 hours with Active Noise Cancellation enabled; 60 hours in standard Bluetooth mode
Quick Charge: USB-C fast charging gives 5 hours playback from a 10-minute charge; 0-100% in 75 minutes
Bluetooth: Bluetooth 5.4 with multipoint pairing (connect phone and laptop simultaneously), supports AAC, LDAC, SBC
Microphones: 4 beamforming microphones with AI environmental noise suppression for crystal-clear calls
Weight: 260 grams, memory foam earcups wrapped in breathable vegan leather
What's in the Box: Studio Pro Headphones, Magnetic Hard Travel Case, 1.2m 3.5mm audio cable, USB-C to USB-C charging cable, Airplane adapter`,
    itemCount: 1,
    status: 'indexed',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'kb_aura_sound_policies',
    botId: 'bot_aura_sound_showcase',
    type: 'url',
    title: 'Aura Sound Shipping, 30-Day Risk-Free Trial & 2-Year Warranty',
    sourceUrl: 'https://aurasound.store/policies',
    content: `Aura Sound Customer Policies:
• 30-Day Risk-Free In-Home Trial: Try Aura Studio Pro in your home for 30 days. If you don't love them, return them for a 100% full refund with free prepaid return shipping.
• Shipping: Free 2-3 day express shipping worldwide on all orders. Same-day dispatch for orders placed before 2 PM EST.
• 2-Year Full Replacement Warranty: Covers internal acoustic drivers, ANC sensors, wireless Bluetooth modules, and battery degradation below 80%.
• Customer Support: Available 24/7 via live chat or at support@aurasound.store.`,
    itemCount: 1,
    status: 'indexed',
    updatedAt: '2026-09-01T00:00:00Z',
  }
];

export const DEFAULT_CHATBOTS: Chatbot[] = [
  {
    id: 'bot_support_pro',
    orgId: 'org_acme_cloud',
    name: 'Acme AI Assistant',
    description: 'Primary customer support & onboarding AI assistant trained on Acme documentation and pricing.',
    category: 'support',
    status: 'active',
    knowledgeCount: 3,
    totalConversations: 1248,
    avgRating: 4.88,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-08-31T12:00:00Z',
    theme: {
      primaryColor: '#2563eb', // Blue-600
      accentColor: '#3b82f6',
      textColor: '#ffffff',
      headerBackground: 'solid',
      bubbleRadius: 'rounded',
      position: 'bottom-right',
      offsetX: 24,
      offsetY: 24,
      welcomeTitle: 'Hi there! 👋 How can we help you today?',
      welcomeSubtitle: 'Our AI assistant typically replies in under 5 seconds',
      placeholderText: 'Type your question here...',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      brandLogoUrl: '',
      launcherIcon: 'chat',
      launcherText: 'Chat with Support',
      soundEnabled: true,
      autoOpenDelaySeconds: 0,
      showPoweredBy: true,
      enableDarkMode: false,
    },
    aiConfig: {
      model: 'gemini-3.8-flash',
      systemPrompt: 'You are the intelligent, polite, and helpful AI Support Specialist for Acme Cloud. Answer user inquiries accurately based on the provided company knowledge base. If you do not know the answer or the user asks for a refund/human agent, politely collect their contact info and assure them an agent will follow up.',
      tone: 'friendly',
      creativity: 0.3,
      suggestedQuestions: [
        'What pricing plans do you offer?',
        'How do I install the widget on Shopify?',
        'Can I train on custom PDFs?',
        'Speak to a human representative'
      ],
      fallbackMessage: "I'm not completely sure about that specific detail, but I've alerted our team! Would you like to leave your email so an agent can reach out right away?",
      humanHandoffEnabled: true,
      humanHandoffTriggerKeywords: ['agent', 'human', 'representative', 'operator', 'refund', 'cancel subscription', 'manager'],
      autoSummaryEnabled: true,
      sentimentAnalysisEnabled: true,
      leadCapture: {
        enabled: true,
        trigger: 'on_intent',
        title: 'Get in touch with our team',
        description: 'Leave your contact info so we can follow up with tailored advice.',
        requireName: true,
        requireEmail: true,
        requirePhone: false,
        requireCompany: true,
      }
    }
  },
  {
    id: 'bot_sales_lead',
    orgId: 'org_acme_cloud',
    name: 'Growth & Sales Qualifier',
    description: 'Specialized bot that engages website visitors, qualifies enterprise leads, and books demos.',
    category: 'sales',
    status: 'active',
    knowledgeCount: 2,
    totalConversations: 520,
    avgRating: 4.92,
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-08-29T16:00:00Z',
    theme: {
      primaryColor: '#059669', // Emerald-600
      accentColor: '#10b981',
      textColor: '#ffffff',
      headerBackground: 'gradient',
      bubbleRadius: 'full',
      position: 'bottom-right',
      offsetX: 24,
      offsetY: 24,
      welcomeTitle: 'Looking to accelerate your team? 🚀',
      welcomeSubtitle: 'Discover how Acme Cloud saves 40+ hours per engineer',
      placeholderText: 'Ask about ROI, enterprise pricing, or demos...',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      brandLogoUrl: '',
      launcherIcon: 'sparkles',
      launcherText: 'Book a Demo',
      soundEnabled: true,
      autoOpenDelaySeconds: 5,
      showPoweredBy: true,
      enableDarkMode: false,
    },
    aiConfig: {
      model: 'gemini-3.8-flash',
      systemPrompt: 'You are an enthusiastic Enterprise Solutions Consultant for Acme Cloud. Your goal is to understand the visitor\'s company size, tech stack, and primary pain points, then guide them to schedule an enterprise demo or sign up for a Pro trial.',
      tone: 'professional',
      creativity: 0.4,
      suggestedQuestions: [
        'How does enterprise pricing work?',
        'Can I schedule an executive demo?',
        'Compare Acme with alternatives',
        'What security compliance do you have?'
      ],
      fallbackMessage: "I'd love to connect you with our solutions architecture team. Could you share your work email and team size?",
      humanHandoffEnabled: true,
      humanHandoffTriggerKeywords: ['quote', 'enterprise', 'demo', 'custom contract', 'sales rep'],
      autoSummaryEnabled: true,
      sentimentAnalysisEnabled: true,
      leadCapture: {
        enabled: true,
        trigger: 'before_chat',
        title: 'Talk to Sales',
        description: 'Fill in your details to explore tailored volume pricing.',
        requireName: true,
        requireEmail: true,
        requirePhone: true,
        requireCompany: true,
      }
    }
  }
];

export const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_101',
    botId: 'bot_support_pro',
    orgId: 'org_acme_cloud',
    visitorId: 'vis_david_99',
    visitorInfo: {
      id: 'vis_david_99',
      name: 'David Miller',
      email: 'david.miller@fintechops.io',
      company: 'FintechOps Global',
      phone: '+1 (415) 890-3412',
      country: 'United States',
      city: 'San Francisco',
      browser: 'Chrome 128',
      os: 'macOS Sonoma',
      device: 'desktop',
      currentPage: 'https://acmecloud.io/pricing',
      referrer: 'https://google.com',
      timezone: 'America/Los_Angeles',
      firstSeen: '2026-09-02T08:15:00Z',
    },
    status: 'waiting_human',
    sentiment: 'frustrated',
    summary: 'Customer inquiring about custom SSO & HIPAA compliance; requested to speak with a human support engineer.',
    leadScore: 88,
    tags: ['enterprise', 'urgent', 'sso', 'compliance'],
    lastMessage: 'Can someone from security jump on to answer HIPAA compliance specifics?',
    lastMessageSender: 'visitor',
    lastMessageTime: '2026-09-02T09:32:00Z',
    unreadByAgent: true,
    unreadByVisitor: false,
    createdAt: '2026-09-02T09:20:00Z',
    updatedAt: '2026-09-02T09:32:00Z',
  },
  {
    id: 'conv_102',
    botId: 'bot_support_pro',
    orgId: 'org_acme_cloud',
    visitorId: 'vis_sarah_44',
    visitorInfo: {
      id: 'vis_sarah_44',
      name: 'Sarah Jenkins',
      email: 'sarah@nordicretail.se',
      company: 'Nordic Retail Group',
      country: 'Sweden',
      city: 'Stockholm',
      browser: 'Safari 18',
      os: 'iOS 18',
      device: 'mobile',
      currentPage: 'https://acmecloud.io/docs/shopify-integration',
      firstSeen: '2026-09-02T09:05:00Z',
    },
    status: 'active',
    sentiment: 'positive',
    summary: 'Successfully guided visitor on embedding widget.js into Shopify theme.liquid.',
    leadScore: 65,
    tags: ['shopify', 'resolved-by-ai'],
    rating: 5,
    ratingFeedback: 'Super fast answer! Code snippet worked on first try.',
    lastMessage: 'Awesome, the widget is now live on our Shopify store! Thank you so much.',
    lastMessageSender: 'visitor',
    lastMessageTime: '2026-09-02T09:18:00Z',
    unreadByAgent: false,
    unreadByVisitor: false,
    createdAt: '2026-09-02T09:05:00Z',
    updatedAt: '2026-09-02T09:18:00Z',
  },
  {
    id: 'conv_103',
    botId: 'bot_sales_lead',
    orgId: 'org_acme_cloud',
    visitorId: 'vis_alex_88',
    visitorInfo: {
      id: 'vis_alex_88',
      name: 'Alexandre Dubois',
      email: 'alex.dubois@lyonhealth.fr',
      company: 'Lyon Health Solutions',
      country: 'France',
      city: 'Paris',
      browser: 'Firefox 130',
      os: 'Windows 11',
      device: 'desktop',
      currentPage: 'https://acmecloud.io/enterprise-demo',
      firstSeen: '2026-09-02T07:45:00Z',
    },
    status: 'agent_handling',
    assignedAgentId: 'agent_1',
    assignedAgentName: 'Marcus Vance',
    sentiment: 'positive',
    summary: 'Enterprise lead for 150+ seats. Demo scheduled for Thursday 2 PM CET.',
    leadScore: 96,
    tags: ['high-value', 'demo-booked', 'enterprise'],
    lastMessage: 'Marcus: I have sent the Google Meet calendar invite to your email. Talk soon!',
    lastMessageSender: 'agent',
    lastMessageTime: '2026-09-02T08:50:00Z',
    unreadByAgent: false,
    unreadByVisitor: false,
    createdAt: '2026-09-02T07:45:00Z',
    updatedAt: '2026-09-02T08:50:00Z',
  },
  {
    id: 'conv_104',
    botId: 'bot_support_pro',
    orgId: 'org_acme_cloud',
    visitorId: 'vis_elena_12',
    visitorInfo: {
      id: 'vis_elena_12',
      name: 'Elena Rostova',
      email: 'elena@berlincode.de',
      country: 'Germany',
      city: 'Berlin',
      browser: 'Chrome 128',
      os: 'Linux Ubuntu',
      device: 'desktop',
      currentPage: 'https://acmecloud.io/pricing',
      firstSeen: '2026-09-01T16:20:00Z',
    },
    status: 'resolved',
    sentiment: 'neutral',
    summary: 'Inquired about annual billing discounts (20% off) and European VAT invoices.',
    leadScore: 50,
    tags: ['billing', 'resolved'],
    lastMessage: 'Got it, thank you for explaining the tax exemptions.',
    lastMessageSender: 'visitor',
    lastMessageTime: '2026-09-01T16:35:00Z',
    unreadByAgent: false,
    unreadByVisitor: false,
    createdAt: '2026-09-01T16:20:00Z',
    updatedAt: '2026-09-01T16:35:00Z',
  }
];

export const DEFAULT_MESSAGES: Record<string, any[]> = {
  conv_101: [
    {
      id: 'msg_101_1',
      conversationId: 'conv_101',
      sender: 'bot',
      text: 'Hi there! 👋 How can we help you today?',
      timestamp: '2026-09-02T09:20:01Z',
    },
    {
      id: 'msg_101_2',
      conversationId: 'conv_101',
      sender: 'visitor',
      text: 'Hello, we are evaluating your platform for our fintech infrastructure. Do you support HIPAA and SOC2 Type II compliance?',
      timestamp: '2026-09-02T09:21:10Z',
    },
    {
      id: 'msg_101_3',
      conversationId: 'conv_101',
      sender: 'bot',
      text: 'Yes! Acme Cloud is fully SOC-2 Type II certified and supports HIPAA Business Associate Agreements (BAAs) on our Enterprise tier. All data is encrypted in transit using TLS 1.3 and at rest with AES-256.',
      sourcesUsed: ['Enterprise SLA & Security Whitepaper.pdf'],
      timestamp: '2026-09-02T09:21:14Z',
    },
    {
      id: 'msg_101_4',
      conversationId: 'conv_101',
      sender: 'visitor',
      text: 'Can someone from security jump on to answer HIPAA compliance specifics?',
      timestamp: '2026-09-02T09:32:00Z',
    },
    {
      id: 'msg_101_5',
      conversationId: 'conv_101',
      sender: 'system',
      text: '🔔 Human agent requested. Notifying support team members on duty...',
      timestamp: '2026-09-02T09:32:02Z',
      metadata: { isHandoffNotice: true }
    }
  ],
  conv_102: [
    {
      id: 'msg_102_1',
      conversationId: 'conv_102',
      sender: 'bot',
      text: 'Hi there! 👋 How can we help you today?',
      timestamp: '2026-09-02T09:05:00Z',
    },
    {
      id: 'msg_102_2',
      conversationId: 'conv_102',
      sender: 'visitor',
      text: 'How do I add the AI chatbot to Shopify?',
      timestamp: '2026-09-02T09:05:40Z',
    },
    {
      id: 'msg_102_3',
      conversationId: 'conv_102',
      sender: 'bot',
      text: 'To install on Shopify: \n1. Go to Shopify Admin > Online Store > Themes\n2. Click "..." and select "Edit code"\n3. Open `theme.liquid`\n4. Paste your widget script tag right before the closing `</body>` tag and save!',
      sourcesUsed: ['Acme Cloud Core Help Center FAQs'],
      timestamp: '2026-09-02T09:05:45Z',
    },
    {
      id: 'msg_102_4',
      conversationId: 'conv_102',
      sender: 'visitor',
      text: 'Awesome, the widget is now live on our Shopify store! Thank you so much.',
      timestamp: '2026-09-02T09:18:00Z',
    }
  ]
};

export const DEFAULT_LEADS: CapturedLead[] = [
  {
    id: 'lead_1',
    orgId: 'org_acme_cloud',
    botId: 'bot_support_pro',
    botName: 'Acme AI Assistant',
    conversationId: 'conv_101',
    name: 'David Miller',
    email: 'david.miller@fintechops.io',
    phone: '+1 (415) 890-3412',
    company: 'FintechOps Global',
    sourcePage: 'https://acmecloud.io/pricing',
    leadScore: 88,
    status: 'qualified',
    createdAt: '2026-09-02T09:21:00Z',
    summary: 'Evaluating enterprise tier with HIPAA compliance requirement.',
  },
  {
    id: 'lead_2',
    orgId: 'org_acme_cloud',
    botId: 'bot_sales_lead',
    botName: 'Growth & Sales Qualifier',
    conversationId: 'conv_103',
    name: 'Alexandre Dubois',
    email: 'alex.dubois@lyonhealth.fr',
    phone: '+33 6 12 34 56 78',
    company: 'Lyon Health Solutions',
    sourcePage: 'https://acmecloud.io/enterprise-demo',
    leadScore: 96,
    status: 'converted',
    createdAt: '2026-09-02T07:48:00Z',
    summary: 'Scheduled 150-seat enterprise demo with Marcus.',
  },
  {
    id: 'lead_3',
    orgId: 'org_acme_cloud',
    botId: 'bot_support_pro',
    botName: 'Acme AI Assistant',
    conversationId: 'conv_102',
    name: 'Sarah Jenkins',
    email: 'sarah@nordicretail.se',
    company: 'Nordic Retail Group',
    sourcePage: 'https://acmecloud.io/docs/shopify-integration',
    leadScore: 65,
    status: 'new',
    createdAt: '2026-09-02T09:05:00Z',
    summary: 'Shopify merchant installed live widget on production store.',
  }
];

export const DEFAULT_ANALYTICS: PlatformAnalytics = {
  totalConversations: 1768,
  aiHandledPercentage: 87.4,
  avgResponseTimeMs: 1420,
  avgCsat: 4.89,
  totalLeads: 248,
  resolvedCount: 1545,
  escalatedToHumanCount: 223,
  dailyTrend: [
    { date: 'Aug 27', conversations: 184, leads: 24, resolutionRate: 88 },
    { date: 'Aug 28', conversations: 210, leads: 28, resolutionRate: 86 },
    { date: 'Aug 29', conversations: 245, leads: 35, resolutionRate: 89 },
    { date: 'Aug 30', conversations: 198, leads: 22, resolutionRate: 85 },
    { date: 'Aug 31', conversations: 225, leads: 31, resolutionRate: 91 },
    { date: 'Sep 01', conversations: 270, leads: 42, resolutionRate: 87 },
    { date: 'Sep 02', conversations: 236, leads: 38, resolutionRate: 90 },
  ],
  topTopics: [
    { topic: 'Shopify / WordPress Embed Installation', count: 412, sentiment: 'positive' },
    { topic: 'Pricing Plans & 14-Day Free Trial', count: 358, sentiment: 'positive' },
    { topic: 'PDF & Knowledge Base Uploads', count: 289, sentiment: 'positive' },
    { topic: 'Human Agent Handoff & Escalation', count: 184, sentiment: 'neutral' },
    { topic: 'HIPAA / SOC2 Data Privacy', count: 125, sentiment: 'urgent' },
  ]
};
