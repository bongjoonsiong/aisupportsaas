import React, { useState } from 'react';
import { useBot } from '../../context/BotContext';
import { ChatbotTheme, LeadCaptureConfig } from '../../types';
import { 
  Palette, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Check, 
  Bot, 
  Send, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Smile, 
  RotateCcw,
  Sliders,
  Eye
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const WidgetCustomizer: React.FC = () => {
  const { activeBot, updateChatbot, sendVisitorMessage, isAiGenerating } = useBot();

  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [testInput, setTestInput] = useState('');
  const [emulatorMessages, setEmulatorMessages] = useState<Array<{ sender: 'visitor' | 'bot'; text: string }>>([
    { sender: 'bot', text: activeBot?.theme.welcomeTitle || 'Hi there! 👋 How can we help you today?' }
  ]);
  const [saveToast, setSaveToast] = useState(false);

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select an active chatbot.</div>;
  }

  const { theme, aiConfig } = activeBot;

  const colorPresets = [
    { name: 'Royal Blue', color: '#2563eb' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Violet', color: '#7c3aed' },
    { name: 'Rose', color: '#e11d48' },
    { name: 'Amber', color: '#d97706' },
    { name: 'Slate Dark', color: '#0f172a' },
  ];

  const handleThemeChange = (partial: Partial<ChatbotTheme>) => {
    updateChatbot(activeBot.id, {
      theme: { ...theme, ...partial }
    });
  };

  const handleLeadCaptureChange = (partial: Partial<LeadCaptureConfig>) => {
    updateChatbot(activeBot.id, {
      aiConfig: {
        ...aiConfig,
        leadCapture: { ...aiConfig.leadCapture, ...partial }
      }
    });
  };

  const handleSendTestMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testInput.trim() || isAiGenerating) return;

    const userText = testInput.trim();
    setTestInput('');
    setEmulatorMessages(prev => [...prev, { sender: 'visitor', text: userText }]);

    const reply = await sendVisitorMessage(userText, 'emulator_test_session');
    setEmulatorMessages(prev => [...prev, { sender: 'bot', text: reply.text }]);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-[#F8FAFC]">
      {/* 1. Left: Controls & Customization Panel */}
      <div className="w-full lg:w-[480px] bg-white border-r border-slate-200 overflow-y-auto p-6 space-y-6 shrink-0">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            Widget Studio & Customizer
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tailor the widget branding, colors, launcher icon, and pre-chat lead forms.
          </p>
        </div>

        {/* Brand Colors */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Brand Accent Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {colorPresets.map(preset => (
              <button
                key={preset.color}
                onClick={() => handleThemeChange({ primaryColor: preset.color })}
                style={{ backgroundColor: preset.color }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform ${
                  theme.primaryColor.toLowerCase() === preset.color.toLowerCase()
                    ? 'ring-2 ring-offset-2 ring-blue-600 scale-110'
                    : 'hover:scale-105'
                }`}
                title={preset.name}
              >
                {theme.primaryColor.toLowerCase() === preset.color.toLowerCase() && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}

            {/* Custom Hex Picker */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={e => handleThemeChange({ primaryColor: e.target.value })}
                className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono font-medium text-slate-700">{theme.primaryColor}</span>
            </div>
          </div>
        </div>

        {/* Header Style & Position */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Header Style
            </label>
            <select
              value={theme.headerBackground}
              onChange={e => handleThemeChange({ headerBackground: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="solid">Solid Color</option>
              <option value="gradient">Modern Gradient</option>
              <option value="dark">Dark Minimal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Screen Position
            </label>
            <select
              value={theme.position}
              onChange={e => handleThemeChange({ position: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>
        </div>

        {/* Welcome Messages */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Welcome Headline
            </label>
            <input
              type="text"
              value={theme.welcomeTitle}
              onChange={e => handleThemeChange({ welcomeTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={theme.welcomeSubtitle}
              onChange={e => handleThemeChange({ welcomeSubtitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Input Placeholder
            </label>
            <input
              type="text"
              value={theme.placeholderText}
              onChange={e => handleThemeChange({ placeholderText: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Launcher Button Text & Style */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Launcher Pill Text (Optional)
            </label>
            <input
              type="text"
              value={theme.launcherText || ''}
              onChange={e => handleThemeChange({ launcherText: e.target.value })}
              placeholder="e.g., Chat with Support"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Audio Chime Effects</span>
            <button
              onClick={() => handleThemeChange({ soundEnabled: !theme.soundEnabled })}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                theme.soundEnabled ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {theme.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {theme.soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>
        </div>

        {/* Lead Capture Settings */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Lead Capture Form
            </span>
            <input
              type="checkbox"
              checked={aiConfig.leadCapture.enabled}
              onChange={e => handleLeadCaptureChange({ enabled: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>

          {aiConfig.leadCapture.enabled && (
            <div className="space-y-2 pt-1 text-xs">
              <label className="block font-semibold text-slate-700">When to trigger</label>
              <select
                value={aiConfig.leadCapture.trigger}
                onChange={e => handleLeadCaptureChange({ trigger: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="on_intent">Automatically when user shares contact / intent</option>
                <option value="before_chat">Before starting conversation (Gatekeeper)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 2. Right: Live Interactive Emulator */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 relative">
        {/* Device Switcher Header */}
        <div className="mb-4 bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1 z-10">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              deviceView === 'desktop' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop Preview
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              deviceView === 'mobile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile Frame
          </button>
          <button
            onClick={() => {
              setEmulatorMessages([{ sender: 'bot', text: theme.welcomeTitle }]);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            title="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Emulator Container */}
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-300/80 overflow-hidden flex flex-col transition-all relative ${
            deviceView === 'mobile' ? 'w-[360px] h-[640px]' : 'w-[400px] h-[600px]'
          }`}
        >
          {/* Widget Header */}
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
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  referrerPolicy="no-referrer"
                />
                <span className="w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full absolute bottom-0 right-0" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{activeBot.name}</h4>
                <p className="text-[11px] opacity-90 leading-tight mt-0.5">{theme.welcomeSubtitle}</p>
              </div>
            </div>

            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
              Live AI
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-3 text-xs">
            {emulatorMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 max-w-[85%] rounded-2xl leading-relaxed shadow-sm ${
                    msg.sender === 'visitor'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                  style={msg.sender === 'visitor' ? { backgroundColor: theme.primaryColor } : {}}
                >
                  <div className="prose prose-sm max-w-none prose-p:my-0 text-inherit">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isAiGenerating && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-500 border border-slate-200 p-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span>{activeBot.name} is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Quick Action Pills */}
          {aiConfig.suggestedQuestions.length > 0 && emulatorMessages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-100 border-t border-slate-200/60 flex gap-1.5 overflow-x-auto text-[11px]">
              {aiConfig.suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTestInput(q);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded-full whitespace-nowrap text-slate-700 hover:text-blue-600 transition-colors font-medium shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input */}
          <form onSubmit={handleSendTestMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder={theme.placeholderText}
              value={testInput}
              onChange={e => setTestInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!testInput.trim() || isAiGenerating}
              className="p-2 rounded-xl text-white disabled:opacity-40 transition-transform active:scale-95 shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
