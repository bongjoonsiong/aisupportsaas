import React, { useState, useRef, useEffect } from 'react';
import { useBot } from '../../context/BotContext';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MessageSquare, 
  Globe, 
  ShoppingBag, 
  ShieldCheck, 
  Star, 
  ArrowRight,
  Headphones,
  CheckCircle2,
  Volume2,
  Truck,
  RotateCcw,
  Zap,
  Layers,
  Search,
  Heart,
  Sliders,
  ChevronRight,
  HelpCircle,
  ThumbsUp,
  Award,
  Radio,
  Clock,
  ExternalLink,
  UserCheck
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PUBLIC_STOREFRONT_BOT, PUBLIC_STOREFRONT_KNOWLEDGE } from '../../data/defaultData';
import { Chatbot } from '../../types';

interface LiveWidgetSimulatorProps {
  onClose: () => void;
  botOverride?: Chatbot;
}

export const LiveWidgetSimulator: React.FC<LiveWidgetSimulatorProps> = ({ onClose, botOverride }) => {
  const { activeBot, sendVisitorMessage, isAiGenerating: contextAiGenerating } = useBot();
  const [localAiGenerating, setLocalAiGenerating] = useState(false);
  
  // Strict multi-tenant isolation:
  // If botOverride is explicitly supplied from dashboard preview, use it.
  // When launched from public navbar/hero/footer, ALWAYS use the dedicated PUBLIC_STOREFRONT_BOT.
  const botToUse = botOverride || PUBLIC_STOREFRONT_BOT;
  const isPublicShowcase = !botOverride;
  const isAiGenerating = isPublicShowcase ? localAiGenerating : contextAiGenerating;

  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [activeSiteType, setActiveSiteType] = useState<'ecommerce' | 'saas'>('ecommerce');
  
  // E-Commerce Store Interactive States
  const [selectedColor, setSelectedColor] = useState<'onyx' | 'silver' | 'sage'>('onyx');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(2);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'shipping'>('specs');

  const productImages = {
    onyx: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=80'
    ],
    silver: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&auto=format&fit=crop&q=80'
    ],
    sage: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop&q=80'
    ]
  };
  
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'visitor' | 'bot' | 'agent' | 'system';
    text: string;
    sources?: string[];
  }>>([
    {
      id: 'init_msg',
      sender: 'bot',
      text: botToUse.theme.welcomeTitle || 'Welcome to Aura Sound! 🎧 How can we help you today?'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiGenerating]);

  const { theme, aiConfig } = botToUse;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAiGenerating) return;

    // Ensure the floating widget pops open when an on-page action button is clicked
    setIsOpen(true);
    setInputText('');

    const userMsg = {
      id: `vis_${Date.now()}`,
      sender: 'visitor' as const,
      text: text
    };
    setMessages(prev => [...prev, userMsg]);

    if (isPublicShowcase) {
      setLocalAiGenerating(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            botId: PUBLIC_STOREFRONT_BOT.id,
            botName: PUBLIC_STOREFRONT_BOT.name,
            systemPrompt: PUBLIC_STOREFRONT_BOT.aiConfig.systemPrompt,
            tone: PUBLIC_STOREFRONT_BOT.aiConfig.tone,
            creativity: PUBLIC_STOREFRONT_BOT.aiConfig.creativity,
            knowledgeSources: PUBLIC_STOREFRONT_KNOWLEDGE.map(k => ({
              type: k.type,
              title: k.title,
              content: k.content
            })),
            messages: [
              ...messages.filter(m => m.sender === 'visitor' || m.sender === 'bot').map(m => ({
                sender: m.sender,
                text: m.text
              })),
              { sender: 'visitor', text }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(prev => [
            ...prev,
            {
              id: `bot_${Date.now()}`,
              sender: 'bot',
              text: data.replyText || "Thank you for asking! Aura Studio Pro ANC offers 40 hours of active noise cancellation battery and a 30-day risk-free trial.",
              sources: data.sourcesUsed || ['Aura Sound Product Specifications']
            }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              id: `bot_${Date.now()}`,
              sender: 'bot',
              text: "Aura Studio Pro features 40h ANC battery life, custom 40mm Beryllium drivers, and a 30-day risk-free trial. Let me know if you need anything else!",
              sources: ['Aura Sound Knowledge Base']
            }
          ]);
        }
      } catch (err) {
        console.error('Simulator chat error:', err);
        setMessages(prev => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: "Aura Studio Pro features 40h ANC battery life, USB-C fast charging, and a 2-year warranty.",
            sources: ['Aura Sound Knowledge Base']
          }
        ]);
      } finally {
        setLocalAiGenerating(false);
      }
    } else {
      try {
        const reply = await sendVisitorMessage(text);
        setMessages(prev => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            sender: reply.sender,
            text: reply.text,
            sources: reply.sourcesUsed
          }
        ]);
      } catch (err) {
        console.error('Simulator chat error:', err);
      }
    }
  };

  const handleAddToCart = () => {
    setCartCount(prev => prev + quantity);
    setCartToast(`Added ${quantity}x Studio Pro Wireless (${selectedColor.toUpperCase()}) to cart!`);
    setTimeout(() => setCartToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col animate-in fade-in duration-200">
      {/* Top Simulator Control Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer hover:opacity-80" onClick={onClose} title="Close Preview" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>

          <div className="h-4 w-[1px] bg-slate-700 mx-2" />

          {/* Browser Address Bar */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/90 rounded-lg text-xs font-mono text-slate-300 w-56 sm:w-80 md:w-96 truncate border border-slate-700/50">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>https://aurasound.store/{activeSiteType === 'ecommerce' ? 'products/studio-pro-wireless-anc' : 'enterprise-cloud'}</span>
          </div>

          {/* Website Theme Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs border border-slate-700/50">
            <button
              onClick={() => setActiveSiteType('ecommerce')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeSiteType === 'ecommerce' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              E-Commerce Store
            </button>
            <button
              onClick={() => setActiveSiteType('saas')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeSiteType === 'saas' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              SaaS Landing
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Simulating Bot: <strong className="text-white">{activeBot.name}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mock Website Canvas */}
      <div className="flex-1 bg-white overflow-y-auto relative font-sans">
        {/* Cart Toast Notification */}
        {cartToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{cartToast}</span>
            <button 
              onClick={() => handleSendMessage("Can I check my order and shipping status?")}
              className="ml-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
            >
              Ask Support
            </button>
          </div>
        )}

        {activeSiteType === 'ecommerce' ? (
          /* ================= PROFESSIONAL E-COMMERCE AUDIO STORE ================= */
          <div className="min-h-full bg-slate-50/50 pb-24 text-slate-900">
            {/* Top Announcement Bar */}
            <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 text-center font-medium border-b border-slate-800 flex items-center justify-between">
              <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Flagship Store
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> Ships within 24 Hours
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mx-auto md:mx-0 font-medium text-[11px] sm:text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Spring Audio Event: <strong>Free Worldwide Shipping</strong> &amp; <strong>30-Day Risk-Free In-Home Trial</strong></span>
              </div>

              <div className="hidden md:flex items-center gap-3 text-slate-400 text-[11px]">
                <span className="font-semibold text-slate-300">USD ($)</span>
                <span>•</span>
                <button 
                  onClick={() => handleSendMessage("Do you offer international shipping to Europe and Asia?")} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Global Delivery
                </button>
              </div>
            </div>

            {/* Store Navigation Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
                {/* Brand Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black tracking-wider text-base shadow-sm">
                    <Headphones className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-lg font-black tracking-tight text-slate-950 block leading-tight">
                      AURA<span className="text-emerald-600">SOUND</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block leading-none">
                      Nordic Acoustics Lab
                    </span>
                  </div>
                </div>

                {/* Categories */}
                <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <a href="#product" className="text-emerald-600 font-extrabold flex items-center gap-1">
                    Over-Ear ANC <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </a>
                  <a href="#specs" className="hover:text-slate-950 transition-colors">Acoustic Specs</a>
                  <a href="#reviews" className="hover:text-slate-950 transition-colors">Studio Reviews</a>
                  <a href="#guarantee" className="hover:text-slate-950 transition-colors">30-Day Guarantee</a>
                  <button 
                    onClick={() => handleSendMessage("What accessories are included in the box with the Studio Pro?")}
                    className="hover:text-emerald-600 transition-colors font-semibold normal-case text-xs text-slate-500"
                  >
                    What's in the Box?
                  </button>
                </nav>

                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                  <div className="relative hidden sm:block w-48 lg:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search specs, warranty..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage(`Search store: ${(e.target as HTMLInputElement).value}`);
                        }
                      }}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <button 
                    onClick={() => handleSendMessage("I want to check my cart and apply available promo discounts")}
                    className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-2 text-xs font-bold"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-900" />
                    <span className="hidden sm:inline">Bag</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                      {cartCount}
                    </span>
                  </button>
                </div>
              </div>
            </header>

            {/* Main Product Showcase Section */}
            <main id="product" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>Home</span>
                <ChevronRight className="w-3 h-3" />
                <span>Over-Ear Wireless</span>
                <ChevronRight className="w-3 h-3" />
                <span>Reference Series</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-800 font-bold">Studio Pro Wireless Mark II ANC</span>
              </div>

              {/* Product Hero Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                
                {/* Product Media Gallery (Left Column - 7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Main Large Image Display */}
                  <div className="relative bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm overflow-hidden group">
                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-950 text-white shadow-md">
                        <Award className="w-3.5 h-3.5 text-amber-400" /> Red Dot 2026 Winner
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Lossless LDAC Audio
                      </span>
                    </div>

                    <div className="h-80 sm:h-[440px] w-full flex items-center justify-center overflow-hidden">
                      <img
                        src={productImages[selectedColor][activeImageIndex] || productImages[selectedColor][0]}
                        alt="Nordic Studio Pro Wireless Headphones"
                        className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>40mm Beryllium Drivers</span>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="grid grid-cols-4 gap-3">
                    {productImages[selectedColor].map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`h-22 rounded-2xl bg-white p-2 border transition-all overflow-hidden flex items-center justify-center ${
                          activeImageIndex === idx 
                            ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm scale-102' 
                            : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-contain" />
                      </button>
                    ))}
                  </div>

                  {/* Quick Feature Badges Bar */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Noise Cancellation</span>
                      <span className="text-sm font-black text-slate-900 block">45dB Hybrid ANC</span>
                      <span className="text-[10px] text-slate-500">4-mic acoustic array</span>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Battery Playtime</span>
                      <span className="text-sm font-black text-slate-900 block">40h / 60h Total</span>
                      <span className="text-[10px] text-emerald-600 font-bold">10m charge = 5h play</span>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Connectivity</span>
                      <span className="text-sm font-black text-slate-900 block">Bluetooth 5.4</span>
                      <span className="text-[10px] text-slate-500">Multipoint Dual Pairing</span>
                    </div>
                  </div>
                </div>

                {/* Product Purchase & Details Panel (Right Column - 5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                  {/* Rating & Series */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                      Studio Reference Series
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-900">4.94</span>
                      <span className="text-xs text-slate-400 font-medium">(2,180 Reviews)</span>
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                      Studio Pro Wireless Mark II ANC
                    </h1>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Engineered in Copenhagen. Custom acoustic 40mm bio-cellulose drivers, 45dB hybrid active noise cancellation, and ultra-plush memory foam for 12+ hour studio sessions.
                    </p>

                    <div className="flex items-baseline gap-3 pt-2">
                      <span className="text-3xl font-black text-slate-950">$299.00</span>
                      <span className="text-base text-slate-400 line-through">$349.00</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        Save $50 (14% OFF)
                      </span>
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Colorway:</span>
                      <span className="font-semibold text-slate-600 capitalize">{selectedColor === 'onyx' ? 'Obsidian Onyx Black' : selectedColor === 'silver' ? 'Lunar Titanium Silver' : 'Nordic Forest Sage'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setSelectedColor('onyx'); setActiveImageIndex(0); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                          selectedColor === 'onyx' 
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-white/40" />
                        <span>Obsidian Black</span>
                      </button>

                      <button
                        onClick={() => { setSelectedColor('silver'); setActiveImageIndex(0); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                          selectedColor === 'silver' 
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400" />
                        <span>Lunar Silver</span>
                      </button>

                      <button
                        onClick={() => { setSelectedColor('sage'); setActiveImageIndex(0); }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                          selectedColor === 'sage' 
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-900 border border-emerald-500" />
                        <span>Forest Sage</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Primary Checkout Buttons */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-xs text-slate-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        <span>Add to Cart • ${(299 * quantity).toFixed(2)}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleSendMessage("How can I purchase with express 1-click checkout?")}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Instant Checkout with Free Express Shipping</span>
                    </button>
                  </div>

                  {/* ========================================================================= */}
                  {/* REAL-TIME AI CHATBOT PRE-PURCHASE PROMPTS (FULLY FUNCTIONAL & INTERACTIVE) */}
                  {/* ========================================================================= */}
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-emerald-950">
                          Ask 24/7 AI Audio Concierge
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        Instant 2s Reply
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                      Click any prompt below to test our real-time AI customer support answering store questions:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* FIX & ENHANCE: The exact "Ask Chatbot About Returns" button */}
                      <button
                        id="ask-chatbot-returns-btn"
                        onClick={() => handleSendMessage("What is your 30-day return policy and how do returns work?")}
                        className="p-2.5 bg-white hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left text-xs font-bold text-emerald-900 transition-all hover:shadow-xs flex items-center gap-2 group"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">Ask Chatbot About Returns</span>
                      </button>

                      <button
                        onClick={() => handleSendMessage("Do you offer free shipping and how long does delivery take?")}
                        className="p-2.5 bg-white hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left text-xs font-bold text-emerald-900 transition-all hover:shadow-xs flex items-center gap-2 group"
                      >
                        <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">Ask About Free Shipping</span>
                      </button>

                      <button
                        onClick={() => handleSendMessage("What is covered under the 2-year warranty and repair policy?")}
                        className="p-2.5 bg-white hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left text-xs font-bold text-emerald-900 transition-all hover:shadow-xs flex items-center gap-2 group"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">Ask About 2-Year Warranty</span>
                      </button>

                      <button
                        onClick={() => handleSendMessage("How long does the battery last and does it support fast USB-C charging?")}
                        className="p-2.5 bg-white hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left text-xs font-bold text-emerald-900 transition-all hover:shadow-xs flex items-center gap-2 group"
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">Ask Battery &amp; Charging</span>
                      </button>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] border-t border-emerald-200/60 text-emerald-800">
                      <span>Need a human agent?</span>
                      <button
                        onClick={() => handleSendMessage("I want to speak with a human audio specialist")}
                        className="font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" /> Test Human Handoff
                      </button>
                    </div>
                  </div>

                  {/* Trust List */}
                  <div className="space-y-2.5 pt-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Free 2-3 Day Express Courier</strong> (Orders over $99)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>30-Day Risk-Free Trial</strong> • 100% Full Money Back</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>2-Year Hardware Replacement Guarantee</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Column Store Guarantees Banner */}
              <div id="guarantee" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Free Express Shipping</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Same-day courier dispatch via DHL Express &amp; FedEx with real-time GPS tracking.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">30-Day In-Home Trial</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Test in your own studio. Free prepaid return label included with zero restocking fees.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">2-Year Full Warranty</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Direct manufacturer hardware replacement for acoustic drivers, battery, and ANC sensors.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">24/7 AI + Live Support</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Instant automated answers grounded in verified store policies with human escalation.
                  </p>
                </div>
              </div>

              {/* Technical Specifications & Acoustic Matrix */}
              <div id="specs" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Technical Specifications &amp; Acoustic Engineering</h3>
                    <p className="text-xs text-slate-500">Lossless audiophile hardware designed for music production and daily listening.</p>
                  </div>

                  <button
                    onClick={() => handleSendMessage("What are the full technical specs and frequency response of the Studio Pro?")}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Ask AI About Specs
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">Acoustic Drivers</span>
                    <span className="font-bold text-slate-900 text-sm block">40mm Custom Bio-Cellulose Beryllium</span>
                    <p className="text-slate-500 text-[11px]">Sub-0.05% THD harmonic distortion with natural spatial staging.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">Frequency Response</span>
                    <span className="font-bold text-slate-900 text-sm block">10 Hz – 45,000 Hz</span>
                    <p className="text-slate-500 text-[11px]">Full Hi-Res Audio Certified with extended sub-bass extension.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">Active Noise Cancellation</span>
                    <span className="font-bold text-slate-900 text-sm block">45 dB Hybrid Quad-Mic ANC</span>
                    <p className="text-slate-500 text-[11px]">Real-time adaptive sound cancellation with Natural Transparency mode.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">Bluetooth &amp; Codecs</span>
                    <span className="font-bold text-slate-900 text-sm block">Bluetooth 5.4 • LDAC • aptX Lossless</span>
                    <p className="text-slate-500 text-[11px]">Multipoint connection for seamless laptop and phone switching.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">Battery &amp; Charging</span>
                    <span className="font-bold text-slate-900 text-sm block">40h (ANC On) / 60h (Standard)</span>
                    <p className="text-slate-500 text-[11px]">Fast USB-C: 10 minutes gives 5 hours playtime; 75 min full charge.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">Weight &amp; Comfort</span>
                    <span className="font-bold text-slate-900 text-sm block">248g • Memory Foam Cushion</span>
                    <p className="text-slate-500 text-[11px]">Sweat-resistant vegan protein leather for zero pressure points.</p>
                  </div>
                </div>
              </div>

              {/* Verified Customer Reviews Hub */}
              <div id="reviews" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Verified Studio &amp; Audiophile Reviews</h3>
                    <p className="text-xs text-slate-500">Over 2,180 verified buyers rate Studio Pro Wireless 4.94 / 5.0 stars.</p>
                  </div>

                  <button
                    onClick={() => handleSendMessage("What do customers say about the noise cancellation and comfort for long flights?")}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Ask AI Review Summary
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs">"Incredible soundstage and ANC on flights"</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "I commute between London and NY weekly. The 45dB noise cancellation completely cuts airplane cabin engine drone, and the battery lasted 4 transcontinental trips on one charge."
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">Julian K. • Audio Engineer</span>
                      <span className="text-emerald-600 font-semibold">Verified Buyer</span>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs">"Hassle-free 30-day trial gave me confidence"</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "Was debating between Sony XM5 and these. The 30-day risk-free trial made it an easy decision. The build quality and aluminum tactile buttons blew away plastic competitors."
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">Elena Rostova • Producer</span>
                      <span className="text-emerald-600 font-semibold">Verified Buyer</span>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs">"Customer support bot was instant &amp; helpful"</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "Asked the website chat bot at 2 AM about DAC compatibility with my Mac Studio. Got an immediate technical answer and links to recommended cables."
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">Marcus Vance • Music Director</span>
                      <span className="text-emerald-600 font-semibold">Verified Buyer</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        ) : (
          /* ================= SAAS CLOUD LANDING MOCKUP ================= */
          <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
            <header className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">A</div>
                <span>Acme Cloud Inc.</span>
              </div>
              <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                <span>Products</span>
                <span>Solutions</span>
                <span>Pricing</span>
                <span>Docs</span>
                <button 
                  onClick={() => handleSendMessage("What are the enterprise cloud pricing plans and SLAs?")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </header>

            <div className="text-center max-w-3xl mx-auto space-y-6 pt-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Cloud Infrastructure
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Scalable Cloud Infrastructure for Modern Development Teams
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Deploy databases, manage compute pipelines, and scale effortlessly with 99.99% guaranteed SLA.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <button 
                  onClick={() => handleSendMessage("What are your pricing plans and SLAs?")}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md transition-colors text-xs"
                >
                  Ask AI About Pricing
                </button>
                <button 
                  onClick={() => handleSendMessage("I want to speak with a human support agent")}
                  className="px-6 py-3 bg-slate-100 text-slate-800 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-xs"
                >
                  Test Human Escalation
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900">Instant Global Deploy</h3>
                <p className="text-xs text-slate-600">Edge routing with sub-50ms latency in 32 global data centers.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900">SOC-2 &amp; HIPAA Certified</h3>
                <p className="text-xs text-slate-600">Enterprise security with automated compliance and encryption.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900">24/7 AI &amp; Human Support</h3>
                <p className="text-xs text-slate-600">Instant AI answers grounded in real docs with human agent handoff.</p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- LIVE FLOATING WIDGET ---------------- */}
        <div 
          className={`fixed z-50 transition-all ${
            theme.position === 'bottom-left' ? 'left-6 bottom-6' : 'right-6 bottom-6'
          }`}
        >
          {/* Chat Window Container */}
          {isOpen && (
            <div className="mb-4 w-96 max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
              {/* Header */}
              <div
                className="p-4 text-white flex items-center justify-between"
                style={{
                  background:
                    theme.headerBackground === 'gradient'
                      ? `linear-gradient(135deg, ${theme.primaryColor} 0%, #1e1b4b 100%)`
                      : theme.headerBackground === 'dark'
                      ? '#0f172a'
                      : theme.primaryColor
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={theme.avatarUrl}
                      alt={activeBot.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <span className="w-2.5 h-2.5 bg-emerald-400 border border-slate-900 rounded-full absolute bottom-0 right-0" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{activeBot.name}</h4>
                    <p className="text-[11px] opacity-90 leading-tight mt-0.5">{theme.welcomeSubtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
                  aria-label="Minimize Chatbot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-3 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 max-w-[85%] rounded-2xl leading-relaxed shadow-sm ${
                        m.sender === 'visitor'
                          ? 'text-white rounded-tr-none'
                          : m.sender === 'agent'
                          ? 'bg-blue-600 text-white rounded-tl-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}
                      style={m.sender === 'visitor' ? { backgroundColor: theme.primaryColor } : {}}
                    >
                      <div className="prose prose-sm max-w-none prose-p:my-0 text-inherit">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>

                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-slate-200 text-[10px] text-slate-400 flex items-center gap-1 flex-wrap">
                          <span>Source:</span>
                          {m.sources.map((s, i) => (
                            <span key={i} className="font-medium text-slate-600 bg-slate-100 px-1 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAiGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-500 border border-slate-200 p-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                      <span>{activeBot.name} is thinking &amp; typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {aiConfig.suggestedQuestions.length > 0 && messages.length <= 2 && (
                <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
                  {aiConfig.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded-full whitespace-nowrap text-slate-700 hover:text-blue-600 transition-colors font-medium shrink-0"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Footer */}
              <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={theme.placeholderText}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isAiGenerating}
                  className="p-2 rounded-xl text-white disabled:opacity-40 transition-transform active:scale-95 shrink-0 shadow-sm"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Launcher Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full shadow-2xl text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: theme.primaryColor }}
            aria-label="Toggle support chat"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
};
