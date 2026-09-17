/**
 * Generates the embeddable standalone widget.js script for website integration
 */
export function generateWidgetJs(originUrl: string): string {
  return `
(function () {
  'use strict';

  if (window.__OmniDeskInitialized) return;
  window.__OmniDeskInitialized = true;

  // Find script tag and extract bot ID and options
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var botId = currentScript ? (currentScript.getAttribute('data-bot-id') || currentScript.getAttribute('data-bot')) : null;
  var customHost = currentScript ? currentScript.getAttribute('data-host') : null;
  var serverHost = customHost || "${originUrl}";

  if (!botId) {
    console.warn('[OmniDesk AI] No data-bot-id provided on script tag.');
  }

  // Inject widget CSS styles
  var style = document.createElement('style');
  style.id = 'omnidesk-widget-styles';
  style.innerHTML = \`
    .omnidesk-launcher-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483640;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #2563eb;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
      border: none;
      outline: none;
      color: white;
    }
    .omnidesk-launcher-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 14px 28px -4px rgba(0, 0, 0, 0.3);
    }
    .omnidesk-launcher-btn:active {
      transform: scale(0.95);
    }
    .omnidesk-window-container {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 580px;
      max-height: calc(100vh - 120px);
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.06);
      z-index: 2147483640;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
      opacity: 0;
      visibility: hidden;
      transform: translateY(16px) scale(0.96);
    }
    .omnidesk-window-container.omnidesk-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    .omnidesk-header {
      background: #2563eb;
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .omnidesk-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .omnidesk-msg-bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.45;
      word-break: break-word;
    }
    .omnidesk-msg-bot {
      align-self: flex-start;
      background: #ffffff;
      color: #1e293b;
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 4px;
    }
    .omnidesk-msg-user {
      align-self: flex-end;
      background: #2563eb;
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .omnidesk-footer {
      padding: 12px 14px;
      background: #ffffff;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .omnidesk-input {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      padding: 9px 14px;
      font-size: 14px;
      outline: none;
      background: #f8fafc;
    }
    .omnidesk-input:focus {
      border-color: #2563eb;
      background: #ffffff;
    }
    .omnidesk-send-btn {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  \`;
  document.head.appendChild(style);

  // Create launcher button
  var launcher = document.createElement('button');
  launcher.className = 'omnidesk-launcher-btn';
  launcher.setAttribute('aria-label', 'Open support chat');
  launcher.innerHTML = \`
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  \`;
  document.body.appendChild(launcher);

  // Create chat frame window
  var win = document.createElement('div');
  win.className = 'omnidesk-window-container';
  win.innerHTML = \`
    <div class="omnidesk-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background: #4ade80;"></div>
        <div>
          <div style="font-weight: 600; font-size: 15px;" id="omnidesk-bot-title">AI Support</div>
          <div style="font-size: 12px; opacity: 0.85;">Replies in seconds</div>
        </div>
      </div>
      <button id="omnidesk-close-btn" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="omnidesk-messages" id="omnidesk-msg-list">
      <div class="omnidesk-msg-bubble omnidesk-msg-bot">
        Hi there! 👋 How can we help you today?
      </div>
    </div>
    <div class="omnidesk-footer">
      <input type="text" class="omnidesk-input" id="omnidesk-text-input" placeholder="Type a message..." />
      <button class="omnidesk-send-btn" id="omnidesk-send-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
      </button>
    </div>
  \`;
  document.body.appendChild(win);

  var isOpen = false;
  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      win.classList.add('omnidesk-open');
      document.getElementById('omnidesk-text-input').focus();
    } else {
      win.classList.remove('omnidesk-open');
    }
  }

  launcher.addEventListener('click', toggleChat);
  document.getElementById('omnidesk-close-btn').addEventListener('click', toggleChat);

  var messages = [
    { sender: 'bot', text: 'Hi there! 👋 How can we help you today?' }
  ];

  async function sendMessage() {
    var input = document.getElementById('omnidesk-text-input');
    var text = (input.value || '').trim();
    if (!text) return;
    input.value = '';

    var msgList = document.getElementById('omnidesk-msg-list');
    
    // Append user message
    var userBubble = document.createElement('div');
    userBubble.className = 'omnidesk-msg-bubble omnidesk-msg-user';
    userBubble.innerText = text;
    msgList.appendChild(userBubble);
    msgList.scrollTop = msgList.scrollHeight;

    messages.push({ sender: 'visitor', text: text });

    // Typing indicator
    var typingBubble = document.createElement('div');
    typingBubble.className = 'omnidesk-msg-bubble omnidesk-msg-bot';
    typingBubble.id = 'omnidesk-typing';
    typingBubble.innerText = 'AI is typing...';
    msgList.appendChild(typingBubble);
    msgList.scrollTop = msgList.scrollHeight;

    try {
      var res = await fetch(serverHost + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId: botId || 'bot_support_pro',
          botName: 'Customer Support',
          messages: messages,
          visitorInfo: {
            currentPage: window.location.href,
            referrer: document.referrer
          }
        })
      });
      var data = await res.json();
      
      var typing = document.getElementById('omnidesk-typing');
      if (typing) typing.remove();

      var botBubble = document.createElement('div');
      botBubble.className = 'omnidesk-msg-bubble omnidesk-msg-bot';
      botBubble.innerText = data.reply || "Thanks for your message! An agent has received your request.";
      msgList.appendChild(botBubble);
      msgList.scrollTop = msgList.scrollHeight;

      messages.push({ sender: 'bot', text: data.reply });
    } catch (e) {
      var typingErr = document.getElementById('omnidesk-typing');
      if (typingErr) typingErr.remove();
      var errBubble = document.createElement('div');
      errBubble.className = 'omnidesk-msg-bubble omnidesk-msg-bot';
      errBubble.innerText = "Thank you! Our team has received your message.";
      msgList.appendChild(errBubble);
      msgList.scrollTop = msgList.scrollHeight;
    }
  }

  document.getElementById('omnidesk-send-btn').addEventListener('click', sendMessage);
  document.getElementById('omnidesk-text-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Public SDK API on window
  window.OmniDesk = {
    open: function () { win.classList.add('omnidesk-open'); isOpen = true; },
    close: function () { win.classList.remove('omnidesk-open'); isOpen = false; },
    toggle: toggleChat,
    identify: function (user) { console.log('[OmniDesk] User identified', user); }
  };
})();
`;
}
