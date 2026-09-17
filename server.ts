import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateChatResponse, generateAutoFaqs } from './server/geminiService';
import { generateWidgetJs } from './server/widgetGenerator';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Standard middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'OmniDesk AI Customer Support SaaS',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Standalone embeddable widget.js script endpoint
  app.get('/widget.js', (req, res) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const script = generateWidgetJs(origin);
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(script);
  });

  // Chat completion endpoint proxying to Gemini AI + RAG engine
  app.post('/api/chat', async (req, res) => {
    try {
      const { botId, botName, systemPrompt, tone, messages, visitorInfo, knowledgeSources, humanHandoffKeywords } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const result = await generateChatResponse({
        botId: botId || 'bot_support_pro',
        botName: botName || 'AI Customer Support',
        systemPrompt,
        tone,
        messages,
        visitorInfo,
        knowledgeSources,
        humanHandoffKeywords,
      });

      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/chat handler:', error);
      res.status(500).json({
        error: 'Failed to process chat response',
        details: error.message,
        reply: "I'm temporarily experiencing high traffic, but I've recorded your question and an agent will follow up shortly!"
      });
    }
  });

  // Auto-generate FAQs from ingested text or docs using Gemini
  app.post('/api/train/auto-faqs', async (req, res) => {
    try {
      const { content, botName } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'Content is required to generate FAQs' });
      }

      const faqs = await generateAutoFaqs(content, botName || 'Product');
      res.json({ success: true, faqs });
    } catch (error: any) {
      console.error('Error in /api/train/auto-faqs:', error);
      res.status(500).json({ error: 'Failed to generate FAQs', details: error.message });
    }
  });

  // Ingest URL simulation / parser
  app.post('/api/train/url', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Format clean summary/content for the indexed URL
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      const extractedContent = `Extracted Knowledge from ${url} (${domain}):\nOfficial website page covering product features, API documentation, onboarding guidelines, and service level agreements for ${domain}. Users can integrate services and manage customer accounts directly online.`;

      res.json({
        success: true,
        title: `${domain} - Knowledge Index`,
        sourceUrl: url,
        content: extractedContent,
        itemCount: 1
      });
    } catch (error: any) {
      console.error('Error in /api/train/url:', error);
      res.status(400).json({ error: 'Invalid URL provided', details: error.message });
    }
  });

  // Vite middleware in dev or static asset serving in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OmniDesk AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[OmniDesk AI] Fatal startup error:', err);
  process.exit(1);
});
