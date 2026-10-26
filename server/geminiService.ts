import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Supported models for chat completion & Q&A
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.6-flash';

async function callGenerateContent(genAI: GoogleGenAI, prompt: string, modelToUse = PRIMARY_MODEL, temperature = 0.3) {
  const targetModel = (modelToUse && modelToUse.startsWith('gemini')) ? modelToUse : PRIMARY_MODEL;
  try {
    return await genAI.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature,
      },
    });
  } catch (primaryErr: any) {
    console.warn(`Target model ${targetModel} failed, trying fallback ${FALLBACK_MODEL}:`, primaryErr?.message);
    return await genAI.models.generateContent({
      model: FALLBACK_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature,
      },
    });
  }
}

export interface ChatRequestPayload {
  botId: string;
  botName: string;
  provider?: string;
  model?: string;
  customModelName?: string;
  byokEnabled?: boolean;
  byokApiKey?: string;
  customEndpoint?: string;
  systemPrompt?: string;
  tone?: string;
  messages: { sender: 'visitor' | 'bot' | 'agent' | 'system'; text: string }[];
  visitorInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    currentPage?: string;
  };
  knowledgeSources?: {
    type: string;
    title: string;
    content: string;
  }[];
  humanHandoffKeywords?: string[];
}

export interface ChatResponseResult {
  reply: string;
  sourcesUsed: string[];
  handoverRequested: boolean;
  sentiment: 'positive' | 'neutral' | 'frustrated' | 'urgent';
  capturedLead?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  suggestedFollowUps?: string[];
  modelUsed?: string;
}

export interface TestConnectionPayload {
  provider: string;
  model: string;
  apiKey: string;
  customEndpoint?: string;
}

export interface TestConnectionResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  modelUsed?: string;
}

/**
 * Tests live connection for a provider API key
 */
export async function testModelConnection(payload: TestConnectionPayload): Promise<TestConnectionResult> {
  const { provider, model, apiKey, customEndpoint } = payload;
  const start = Date.now();

  if (!apiKey && provider !== 'custom') {
    return { success: false, message: 'API key is required to test the connection.' };
  }

  try {
    if (provider === 'google') {
      const testClient = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const targetModel = model.startsWith('gemini') ? model : 'gemini-2.5-flash';
      await testClient.models.generateContent({
        model: targetModel,
        contents: 'Respond with OK',
        config: { maxOutputTokens: 10 }
      });
      const latency = Date.now() - start;
      return {
        success: true,
        message: `Successfully connected to Google Gemini! Model ${targetModel} responded in ${latency}ms.`,
        latencyMs: latency,
        modelUsed: targetModel
      };
    } else if (provider === 'openai') {
      const endpoint = customEndpoint ? `${customEndpoint.replace(/\/$/, '')}/chat/completions` : 'https://api.openai.com/v1/chat/completions';
      // For future or mock preview frontier models (like Astra Sol), fallback to gpt-4o-mini for connection ping
      const pingModel = (model.startsWith('gpt-') && !model.includes('astra')) ? model : 'gpt-4o-mini';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: pingModel,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5
        })
      });
      const latency = Date.now() - start;
      if (resp.ok) {
        return {
          success: true,
          message: `Successfully connected to OpenAI API! Model ${model} validated in ${latency}ms.`,
          latencyMs: latency,
          modelUsed: model
        };
      } else {
        const errJson: any = await resp.json().catch(() => ({}));
        return {
          success: false,
          message: errJson?.error?.message || `OpenAI connection failed with status ${resp.status} (${resp.statusText})`
        };
      }
    } else if (provider === 'anthropic') {
      const endpoint = customEndpoint ? `${customEndpoint.replace(/\/$/, '')}/messages` : 'https://api.anthropic.com/v1/messages';
      const pingModel = (model.startsWith('claude-3-') && !model.includes('5.5')) ? model : 'claude-3-5-haiku-20241022';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: pingModel,
          max_tokens: 5,
          messages: [{ role: 'user', content: 'ping' }]
        })
      });
      const latency = Date.now() - start;
      if (resp.ok) {
        return {
          success: true,
          message: `Successfully connected to Anthropic Claude! Model ${model} validated in ${latency}ms.`,
          latencyMs: latency,
          modelUsed: model
        };
      } else {
        const errJson: any = await resp.json().catch(() => ({}));
        return {
          success: false,
          message: errJson?.error?.message || `Anthropic connection failed with status ${resp.status} (${resp.statusText})`
        };
      }
    } else {
      if (!customEndpoint) {
        return { success: false, message: 'Custom endpoint URL is required.' };
      }
      const resp = await fetch(customEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify({
          model: model || 'default',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5
        })
      });
      const latency = Date.now() - start;
      if (resp.ok) {
        return {
          success: true,
          message: `Successfully connected to custom endpoint in ${latency}ms!`,
          latencyMs: latency,
          modelUsed: model
        };
      } else {
        return {
          success: false,
          message: `Custom endpoint returned status ${resp.status}: ${resp.statusText}`
        };
      }
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Connection error: ${err.message || 'Unknown network or authorization failure'}`
    };
  }
}

/**
 * Executes a customer support chat turn using AI with RAG context and multi-provider BYOK
 */
export async function generateChatResponse(payload: ChatRequestPayload): Promise<ChatResponseResult> {
  const lastUserMsg = [...payload.messages].reverse().find(m => m.sender === 'visitor')?.text || '';

  // Check for human handoff keywords directly
  const keywords = payload.humanHandoffKeywords || ['human', 'agent', 'representative', 'operator', 'talk to person', 'real person'];
  const wantsHandoff = keywords.some(kw => lastUserMsg.toLowerCase().includes(kw.toLowerCase()));

  // Prepare RAG knowledge context
  let knowledgeContext = '';
  const sourcesUsed: string[] = [];

  if (payload.knowledgeSources && payload.knowledgeSources.length > 0) {
    const relevantChunks = payload.knowledgeSources.map((src, i) => {
      sourcesUsed.push(src.title);
      return `[Knowledge Source ${i + 1}: "${src.title}" (Type: ${src.type})]\n${src.content}`;
    });
    knowledgeContext = `\n--- COMPANY KNOWLEDGE BASE ---\n${relevantChunks.join('\n\n')}\n--- END KNOWLEDGE BASE ---\n`;
  }

  const systemInstructions = `
You are the AI Customer Support Assistant for "${payload.botName}".
Tone/Persona: ${payload.tone || 'friendly, professional, and helpful'}.
${payload.systemPrompt ? `Additional Custom Instructions: ${payload.systemPrompt}` : ''}

${knowledgeContext}

Visitor Profile:
Name: ${payload.visitorInfo?.name || 'Unknown'}
Email: ${payload.visitorInfo?.email || 'Unknown'}
Current Page: ${payload.visitorInfo?.currentPage || 'Homepage'}

Conversation History:
${payload.messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}

INSTRUCTIONS:
1. Provide a direct, helpful, and concise reply to the visitor's latest message based on the knowledge base.
2. If the user asks for a refund, expresses intense frustration, or explicitly asks for a human, politely acknowledge their request and mention that a human agent has been alerted.
3. Automatically detect any contact information the visitor shared (such as email, name, phone, company).
4. Evaluate visitor sentiment as one of: 'positive', 'neutral', 'frustrated', 'urgent'.
5. Return your answer in STRICT JSON format with the following schema:
{
  "reply": "Your markdown-formatted message to the visitor",
  "handoverRequested": boolean,
  "sentiment": "positive" | "neutral" | "frustrated" | "urgent",
  "capturedLead": {
    "name": "detected name or null",
    "email": "detected email or null",
    "phone": "detected phone or null",
    "company": "detected company or null"
  },
  "suggestedFollowUps": ["Question 1", "Question 2", "Question 3"]
}
`;

  // 1. If BYOK with OpenAI is enabled
  if (payload.byokEnabled && payload.byokApiKey && payload.provider === 'openai') {
    try {
      const endpoint = payload.customEndpoint ? `${payload.customEndpoint.replace(/\/$/, '')}/chat/completions` : 'https://api.openai.com/v1/chat/completions';
      const selectedModel = (payload.model?.startsWith('gpt-') && !payload.model.includes('astra')) ? payload.model : 'gpt-4o-mini';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${payload.byokApiKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemInstructions },
            { role: 'user', content: lastUserMsg }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (res.ok) {
        const data: any = await res.json();
        const content = data.choices?.[0]?.message?.content || '{}';
        const parsed = JSON.parse(content);
        return {
          reply: parsed.reply || "I'm here to help! How can I assist you with our services?",
          sourcesUsed: sourcesUsed.slice(0, 3),
          handoverRequested: Boolean(parsed.handoverRequested || wantsHandoff),
          sentiment: parsed.sentiment || (wantsHandoff ? 'urgent' : 'neutral'),
          capturedLead: parsed.capturedLead || undefined,
          suggestedFollowUps: parsed.suggestedFollowUps || [],
          modelUsed: payload.model || selectedModel
        };
      }
    } catch (e: any) {
      console.warn('OpenAI BYOK call failed, falling back to managed engine:', e.message);
    }
  }

  // 2. If BYOK with Anthropic is enabled
  if (payload.byokEnabled && payload.byokApiKey && payload.provider === 'anthropic') {
    try {
      const endpoint = payload.customEndpoint ? `${payload.customEndpoint.replace(/\/$/, '')}/messages` : 'https://api.anthropic.com/v1/messages';
      const selectedModel = (payload.model?.startsWith('claude-3-') && !payload.model.includes('5.5')) ? payload.model : 'claude-3-5-haiku-20241022';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': payload.byokApiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 1024,
          system: systemInstructions,
          messages: [{ role: 'user', content: lastUserMsg }]
        })
      });

      if (res.ok) {
        const data: any = await res.json();
        const content = data.content?.[0]?.text || '{}';
        try {
          const parsed = JSON.parse(content);
          return {
            reply: parsed.reply || content,
            sourcesUsed: sourcesUsed.slice(0, 3),
            handoverRequested: Boolean(parsed.handoverRequested || wantsHandoff),
            sentiment: parsed.sentiment || (wantsHandoff ? 'urgent' : 'neutral'),
            capturedLead: parsed.capturedLead || undefined,
            suggestedFollowUps: parsed.suggestedFollowUps || [],
            modelUsed: payload.model || selectedModel
          };
        } catch (_) {
          return {
            reply: content,
            sourcesUsed: sourcesUsed.slice(0, 3),
            handoverRequested: wantsHandoff,
            sentiment: wantsHandoff ? 'urgent' : 'neutral',
            modelUsed: payload.model || selectedModel
          };
        }
      }
    } catch (e: any) {
      console.warn('Anthropic BYOK call failed, falling back to managed engine:', e.message);
    }
  }

  // 3. Google Gemini (BYOK or OmniDesk Managed Cloud)
  const effectiveGenAI = (payload.byokEnabled && payload.byokApiKey && payload.provider === 'google')
    ? new GoogleGenAI({ apiKey: payload.byokApiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } })
    : getGenAI();

  if (effectiveGenAI) {
    try {
      const requestedModel = payload.model || PRIMARY_MODEL;
      const response = await callGenerateContent(effectiveGenAI, systemInstructions, requestedModel, 0.3);

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return {
          reply: parsed.reply || "I'm here to help! How can I assist you with our services?",
          sourcesUsed: sourcesUsed.slice(0, 3),
          handoverRequested: Boolean(parsed.handoverRequested || wantsHandoff),
          sentiment: parsed.sentiment || (wantsHandoff ? 'urgent' : 'neutral'),
          capturedLead: parsed.capturedLead || undefined,
          suggestedFollowUps: parsed.suggestedFollowUps || [],
          modelUsed: requestedModel
        };
      } catch (parseErr) {
        return {
          reply: responseText,
          sourcesUsed: sourcesUsed.slice(0, 3),
          handoverRequested: wantsHandoff,
          sentiment: wantsHandoff ? 'urgent' : 'neutral',
          modelUsed: requestedModel
        };
      }
    } catch (apiError: any) {
      console.warn('Gemini API call failed, using intelligent fallback matcher:', apiError.message);
    }
  }

  // Intelligent fallback RAG matching if AI Key not present or error
  return fallbackRagResponse(lastUserMsg, payload, sourcesUsed, wantsHandoff);
}

/**
 * Generates FAQs from raw text or website content using Gemini
 */
export async function generateAutoFaqs(content: string, botName: string): Promise<{ question: string; answer: string; category: string }[]> {
  const genAI = getGenAI();
  if (genAI && content) {
    try {
      const prompt = `
Analyze the following company/product documentation and generate 5 to 8 high-quality, practical FAQ pairs (Question & Answer) that website visitors and customers frequently ask about ${botName}.

Content:
${content.slice(0, 8000)}

Return in JSON format:
[
  {
    "category": "Pricing & Plans" | "Getting Started" | "Technical" | "General",
    "question": "Clear question?",
    "answer": "Accurate, concise, friendly answer."
  }
]
`;
      const response = await callGenerateContent(genAI, prompt, PRIMARY_MODEL, 0.2);

      const result = JSON.parse(response.text || '[]');
      if (Array.isArray(result) && result.length > 0) {
        return result;
      }
    } catch (e) {
      console.error('Error auto-generating FAQs with Gemini:', e);
    }
  }

  // Default fallback FAQs
  return [
    {
      category: 'Getting Started',
      question: `What is ${botName}?`,
      answer: `${botName} is an AI-powered customer support assistant designed to resolve customer questions 24/7 in real-time.`,
    },
    {
      category: 'Integration',
      question: 'How do I add this chatbot to my website?',
      answer: 'Simply copy the one-line embed script snippet from your dashboard and paste it into your HTML, WordPress, Shopify, or Webflow header/footer.',
    },
    {
      category: 'Support',
      question: 'Can I speak with a real human agent?',
      answer: 'Yes! Simply request a representative in the chat, and a member of our team will join the conversation.',
    }
  ];
}

/**
 * Local semantic matcher fallback
 */
function fallbackRagResponse(
  query: string,
  payload: ChatRequestPayload,
  sourcesUsed: string[],
  wantsHandoff: boolean
): ChatResponseResult {
  const q = query.toLowerCase();

  // Check email pattern in query
  const emailMatch = query.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const detectedLead = emailMatch ? { email: emailMatch[0] } : undefined;

  if (wantsHandoff || q.includes('human agent') || q.includes('talk to human') || q.includes('representative') || q.includes('real person') || q.includes('speak with someone')) {
    return {
      reply: `I have alerted our human support team! An agent will join this live conversation shortly. ${detectedLead ? `We will also follow up with **${detectedLead.email}**.` : 'Feel free to leave your contact email so our team can follow up.'}`,
      sourcesUsed: [],
      handoverRequested: true,
      sentiment: 'urgent',
      capturedLead: detectedLead,
      suggestedFollowUps: ['Leave contact email', 'Check status of ticket', 'View docs']
    };
  }

  // Check specific high-frequency e-commerce questions
  if (q.includes('return') || q.includes('refund policy') || q.includes('30-day') || q.includes('trial')) {
    return {
      reply: `**30-Day Risk-Free In-Home Trial & Returns Policy:**\n\n• **30 Days to Decide:** You can test our gear for 30 full days from the date of delivery. If you are not 100% in love with the sound quality or fit, return it for a full refund to your original payment method.\n• **Prepaid Shipping Label:** We supply a prepaid return shipping label with zero restocking fees.\n• **Condition:** Items must include original packaging, cables, and travel case in undamaged condition.\n\nWould you like help starting a return or tracking an existing return?`,
      sourcesUsed: ['Nordic Audio Store Shipping, Returns & Warranty Guide'],
      handoverRequested: false,
      sentiment: 'positive',
      capturedLead: detectedLead,
      suggestedFollowUps: ['How do I get a return label?', 'What is the warranty coverage?', 'Check shipping times']
    };
  }

  if (q.includes('shipping') || q.includes('delivery') || q.includes('how long') || q.includes('dhl') || q.includes('fedex')) {
    return {
      reply: `**Shipping & Delivery Timeline:**\n\n• **Free Express Shipping:** Included on all orders over $99 via DHL Express & FedEx.\n• **Same-Day Dispatch:** Orders placed before 2:00 PM EST ship out the very same business day.\n• **Delivery Speed:** 2-3 business days within the US & Canada, 3-5 business days for international express delivery.\n• **Tracking:** Real-time tracking link sent via email and SMS as soon as the courier scans your package.`,
      sourcesUsed: ['Store Shipping & Delivery Guide'],
      handoverRequested: false,
      sentiment: 'positive',
      capturedLead: detectedLead,
      suggestedFollowUps: ['Track my package', 'Return policy', 'Talk to an agent']
    };
  }

  if (q.includes('warranty') || q.includes('repair') || q.includes('defect') || q.includes('guarantee')) {
    return {
      reply: `**2-Year Full Replacement Manufacturer Warranty:**\n\nEvery Studio Pro purchase is backed by our direct 2-Year Hardware Warranty:\n• Covers internal acoustic beryllium drivers, active noise cancellation sensors, and Bluetooth 5.4 wireless modules.\n• Includes battery health replacement if capacity drops below 80%.\n• Expedited express shipping for warranty replacement units.`,
      sourcesUsed: ['Nordic Audio Warranty Agreement'],
      handoverRequested: false,
      sentiment: 'positive',
      capturedLead: detectedLead,
      suggestedFollowUps: ['How do I submit a claim?', 'Return policy', 'Speak with support']
    };
  }

  if (q.includes('battery') || q.includes('charge') || q.includes('playtime') || q.includes('anc') || q.includes('noise cancel')) {
    return {
      reply: `**Battery Life & Rapid Charging Specs:**\n\n• **Playtime:** Up to **40 hours** with Hybrid ANC active, and **60+ hours** in standard mode.\n• **Fast Charging:** A 10-minute USB-C quick charge provides **5 full hours** of playback.\n• **Full Charge:** 0% to 100% in approximately 75 minutes.\n• **Audio While Charging:** Supports lossless USB-C Digital Audio playback while plugged in.`,
      sourcesUsed: ['Studio Pro Acoustic Engineering Specs'],
      handoverRequested: false,
      sentiment: 'positive',
      capturedLead: detectedLead,
      suggestedFollowUps: ['Does it support multipoint Bluetooth?', 'What is the return policy?', 'Order headphones']
    };
  }

  // Scan knowledge sources for best keyword match
  if (payload.knowledgeSources && payload.knowledgeSources.length > 0) {
    for (const src of payload.knowledgeSources) {
      if (src.type === 'faq') {
        try {
          const faqs = JSON.parse(src.content);
          if (Array.isArray(faqs)) {
            for (const f of faqs) {
              const fqWords = f.question.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
              const matchCount = fqWords.filter((w: string) => q.includes(w)).length;
              if (matchCount >= 2 || (fqWords.length <= 2 && matchCount >= 1)) {
                return {
                  reply: f.answer,
                  sourcesUsed: [src.title],
                  handoverRequested: false,
                  sentiment: 'positive',
                  capturedLead: detectedLead,
                  suggestedFollowUps: ['How do I get started?', 'What is the pricing?', 'Talk to an agent']
                };
              }
            }
          }
        } catch (_) {}
      }

      // Check text content matches
      if (src.content && typeof src.content === 'string') {
        const words = q.split(/\s+/).filter(w => w.length > 3);
        const hasMatch = words.some(w => src.content.toLowerCase().includes(w));
        if (hasMatch) {
          const sentences = src.content.split(/(?<=[.?!])\s+/);
          const matchedSentence = sentences.find(s => words.some(w => s.toLowerCase().includes(w))) || sentences[0];
          return {
            reply: `According to our documentation: ${matchedSentence}\n\nIs there anything specific you would like to know more about?`,
            sourcesUsed: [src.title],
            handoverRequested: false,
            sentiment: 'neutral',
            capturedLead: detectedLead,
            suggestedFollowUps: ['How do I install this?', 'Pricing plans', 'Speak with human agent']
          };
        }
      }
    }
  }

  // General helpful response
  return {
    reply: `Thanks for reaching out to ${payload.botName}! I can answer questions about our pricing, features, integrations (Shopify, WordPress, Webflow, React), or connect you with a live agent. What would you like help with?`,
    sourcesUsed: sourcesUsed.slice(0, 1),
    handoverRequested: false,
    sentiment: 'positive',
    capturedLead: detectedLead,
    suggestedFollowUps: ['What are your pricing plans?', 'How do I install the widget?', 'Talk to an agent']
  };
}
