import React, { useState } from 'react';
import { useBot } from '../../context/BotContext';
import { 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Globe, 
  Layers, 
  Terminal,
  CheckCircle2
} from 'lucide-react';

export const EmbedCodeGenerator: React.FC = () => {
  const { activeBot } = useBot();
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<'html' | 'shopify' | 'wordpress' | 'webflow' | 'react'>('html');

  if (!activeBot) {
    return <div className="p-8 text-center text-slate-500">Please select an active chatbot first.</div>;
  }

  const originUrl = window.location.origin;
  const scriptSnippet = `<script 
  src="${originUrl}/widget.js" 
  data-bot-id="${activeBot.id}" 
  async>
</script>`;

  const reactSnippet = `import { useEffect } from 'react';

export default function SupportChat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "${originUrl}/widget.js";
    script.setAttribute('data-bot-id', "${activeBot.id}");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#F8FAFC] overflow-y-auto max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Code2 className="w-6 h-6 text-blue-600" />
          Widget Installation & Embed Code
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Deploy <span className="font-bold text-slate-800">{activeBot.name}</span> on any website by adding a single line of JavaScript.
        </p>
      </div>

      {/* Main Snippet Card */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Widget Integration Code
          </h3>

          <span className="font-mono text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
            bot_id: {activeBot.id}
          </span>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto border border-slate-700/60">
          <code>{scriptSnippet}</code>
        </div>

        <button
          onClick={() => handleCopy(scriptSnippet)}
          className="w-full py-2.5 bg-slate-700 rounded-lg text-sm font-bold hover:bg-slate-600 text-white transition-colors flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard!' : 'Copy Embed Code'}
        </button>

        <p className="text-[10px] text-slate-500 text-center">
          Compatible with WordPress, Shopify, React & Webflow
        </p>
      </div>

      {/* Platform Instructions Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Step-by-Step Installation Guides</h3>
          <p className="text-xs text-slate-500 mt-0.5">Select your CMS or web framework below:</p>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
          {[
            { id: 'html', label: 'HTML / Vanilla' },
            { id: 'shopify', label: 'Shopify' },
            { id: 'wordpress', label: 'WordPress' },
            { id: 'webflow', label: 'Webflow' },
            { id: 'react', label: 'React / Next.js' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setPlatform(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                platform === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Instructions Content */}
        {platform === 'html' && (
          <div className="space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900">Vanilla HTML Installation</h4>
            <ol className="list-decimal list-inside space-y-2 pl-1 font-medium">
              <li>Open your project's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs">index.html</code> file.</li>
              <li>Scroll down to the closing <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs">&lt;/body&gt;</code> tag.</li>
              <li>Paste the script snippet right before <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs">&lt;/body&gt;</code>.</li>
              <li>Save and deploy. The floating chat bubble will appear instantly!</li>
            </ol>
          </div>
        )}

        {platform === 'shopify' && (
          <div className="space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900">Shopify Integration</h4>
            <ol className="list-decimal list-inside space-y-2 pl-1 font-medium">
              <li>Log in to your <strong>Shopify Admin</strong> dashboard.</li>
              <li>Navigate to <strong>Online Store &gt; Themes</strong>.</li>
              <li>Click the three dots (<strong>...</strong>) next to your active theme and choose <strong>Edit code</strong>.</li>
              <li>In the file tree on the left, locate and open <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs">theme.liquid</code>.</li>
              <li>Scroll to the bottom and paste the script snippet right before <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs">&lt;/body&gt;</code>.</li>
              <li>Click <strong>Save</strong>.</li>
            </ol>
          </div>
        )}

        {platform === 'wordpress' && (
          <div className="space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900">WordPress Integration</h4>
            <ol className="list-decimal list-inside space-y-2 pl-1 font-medium">
              <li>Log in to your <strong>WordPress WP-Admin</strong> panel.</li>
              <li>Go to <strong>Plugins &gt; Add New</strong> and search for <em>"Insert Headers and Footers"</em> (or <em>WPCode</em>).</li>
              <li>Install and Activate the plugin.</li>
              <li>Go to <strong>Code Snippets &gt; Header &amp; Footer</strong>.</li>
              <li>Paste your script snippet into the <strong>Footer</strong> section and click <strong>Save Changes</strong>.</li>
            </ol>
          </div>
        )}

        {platform === 'webflow' && (
          <div className="space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900">Webflow Custom Code</h4>
            <ol className="list-decimal list-inside space-y-2 pl-1 font-medium">
              <li>Open your project in <strong>Webflow Designer</strong>.</li>
              <li>Go to <strong>Project Settings &gt; Custom Code</strong>.</li>
              <li>Scroll down to the <strong>Footer Code</strong> section.</li>
              <li>Paste your script snippet into the editor and click <strong>Save Changes</strong>.</li>
              <li>Publish your site to production.</li>
            </ol>
          </div>
        )}

        {platform === 'react' && (
          <div className="space-y-3 text-xs md:text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900">React &amp; Next.js Component</h4>
            <p className="text-xs text-slate-500">Add the following React hook component to your application layout:</p>
            <pre className="p-4 bg-slate-900 text-blue-300 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              <code>{reactSnippet}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
