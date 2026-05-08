import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageSquare, X, Trash2, Loader2 } from 'lucide-react';
import { buildDashboardContext, callHuggingFace, ruleBasedFallback } from '../utils/chatbot';

const Chatbot = ({ appData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Hello! I'm your Space AI Assistant. I can answer questions about current ISS data, people in space, and news.", sender: 'bot' }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages.slice(-30)));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const context = buildDashboardContext(appData);

    try {
      let botText = "";
      const hfToken = import.meta.env.VITE_HF_TOKEN;

      if (hfToken) {
        botText = await callHuggingFace(context, input);
      } else {
        botText = ruleBasedFallback(context, input);
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
    } catch (err) {
      console.error(err);
      const fallbackText = ruleBasedFallback(context, input);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: fallbackText, sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initialMessage = { id: Date.now(), text: "Chat history cleared. How can I help you?", sender: 'bot' };
    setMessages([initialMessage]);
    localStorage.removeItem('chat_history');
  };

  return (
    <div className="chatbot-floating">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-accent-blue" />
              <div>
                <h3 className="font-bold text-sm">Space AI Assistant</h3>
                <div className="status-indicator">
                  <div className="status-dot" />
                  Live Sync
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} title="Clear Chat" className="text-text-secondary hover:text-error transition-colors bg-transparent border-none cursor-pointer">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white bg-transparent border-none cursor-pointer">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Message AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="chat-send-btn" disabled={isTyping}>
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)} title="Chat with AI">
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default Chatbot;
