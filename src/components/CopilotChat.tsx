import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Trash2,
  Zap,
  HelpCircle
} from 'lucide-react';
import { BrandProfile } from '../types/marketing';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface CopilotChatProps {
  brand: BrandProfile;
  onSendToCaptionLab?: (text: string) => void;
}

const STARTER_PROMPTS = [
  'How do I structure a Black Friday / Flash Sale campaign to maximize ROAS without degrading brand value?',
  'Give me 5 psychological hooks to stop users from scrolling past our organic Reels.',
  'How can I get my first 1,000 email subscribers from our Instagram bio link funnel?',
  'What is the ideal Facebook ad testing structure for a modest $1,000 monthly budget?',
];

export const CopilotChat: React.FC<CopilotChatProps> = ({ brand, onSendToCaptionLab }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello! I am your OmniMarket AI Copilot for **${brand.name}**. I can help you with high-converting Facebook ad angles, Instagram growth frameworks, conversion rate optimization, or copywriting audits. What would you like to brainstorm today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/marketing/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          brand,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Sorry, I encountered an error connecting to the marketing intelligence engine. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'model',
        content: `Chat cleared. Ready for fresh marketing questions for **${brand.name}**!`,
      },
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Marketing Strategy Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </h3>
            <p className="text-xs text-slate-500">
              Personalized for {brand.name} ({brand.industry})
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-xs flex items-center gap-1 font-medium"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'model' && (
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-line prose dark:prose-invert text-xs sm:text-sm max-w-none">
                {m.content}
              </div>

              {m.role === 'model' && (
                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(m.content, idx)}
                      className="hover:text-purple-600 dark:hover:text-purple-400 transition flex items-center gap-1"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {onSendToCaptionLab && (
                    <button
                      onClick={() => onSendToCaptionLab(m.content.slice(0, 200))}
                      className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                    >
                      Use as Caption Topic →
                    </button>
                  )}
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span>Formulating expert marketing advice...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Questions */}
      {messages.length <= 2 && (
        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-400 font-semibold shrink-0">💡 Try:</span>
          {STARTER_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-600 dark:text-slate-300 transition"
            >
              {prompt.slice(0, 50)}...
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about marketing strategy, conversion funnels, copywriting audits, or ad testing..."
            className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
