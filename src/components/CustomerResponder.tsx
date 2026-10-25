import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Bookmark,
  Smile,
  Frown,
  HelpCircle,
  ShieldAlert,
  ThumbsUp,
  Instagram,
  Facebook,
  Zap,
  ArrowRight
} from 'lucide-react';
import { BrandProfile, RepliesResponse, ReplyVariation } from '../types/marketing';
import { REPLY_PRESETS } from '../utils/mockBrands';

interface CustomerResponderProps {
  brand: BrandProfile;
  onSaveToVault: (type: 'reply', content: any) => void;
}

export const CustomerResponder: React.FC<CustomerResponderProps> = ({
  brand,
  onSaveToVault,
}) => {
  const [customerMessage, setCustomerMessage] = useState('');
  const [channel, setChannel] = useState<'instagram_dm' | 'facebook_comment' | 'facebook_messenger' | 'public_review'>('instagram_dm');
  const [businessContext, setBusinessContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RepliesResponse | null>(null);
  const [selectedReplyIndex, setSelectedReplyIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (overrideMsg?: string, overrideContext?: string) => {
    const finalMsg = overrideMsg || customerMessage;
    if (!finalMsg.trim()) {
      setError('Please provide the customer message or comment.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/marketing/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerMessage: finalMsg,
          channel,
          businessContext: overrideContext || businessContext,
          brand,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate replies');
      }

      const data: RepliesResponse = await response.json();
      setResults(data);
      setSelectedReplyIndex(0);
    } catch (err: any) {
      setError(err.message || 'Error drafting replies.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof REPLY_PRESETS[0]) => {
    setCustomerMessage(preset.message);
    setChannel(preset.channel);
    setBusinessContext(preset.context);
    handleGenerate(preset.message, preset.context);
  };

  const handleCopyReply = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSentimentBadge = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes('positive')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Smile className="w-3.5 h-3.5 text-emerald-500" />
          {sentiment}
        </span>
      );
    }
    if (s.includes('frustrated') || s.includes('complaint')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          {sentiment}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
        {sentiment}
      </span>
    );
  };

  const activeReply = results?.variations[selectedReplyIndex]?.reply || '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form & Presets */}
      <div className="lg:col-span-6 space-y-6">
        {/* Presets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              Common Support Scenarios
            </span>
            <span className="text-[11px] text-slate-400">1-click test</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REPLY_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-left text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition group"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {p.label}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  "{p.message}"
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Customer Message & Comment Assistant
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft on-brand, de-escalating, and high-converting replies for DMs, post comments, and public reviews
            </p>
          </div>

          {/* Channel Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Communication Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setChannel('instagram_dm')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  channel === 'instagram_dm'
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                <span>Instagram DM</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('facebook_comment')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  channel === 'facebook_comment'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>FB Comment</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('facebook_messenger')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  channel === 'facebook_messenger'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                <span>Messenger</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('public_review')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  channel === 'public_review'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>⭐ Public Review</span>
              </button>
            </div>
          </div>

          {/* Customer Message input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Customer Message or Comment *</span>
              <span className="text-[11px] text-slate-400">Paste exact customer text</span>
            </label>
            <textarea
              rows={4}
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="e.g. Hi! Where do you source your ingredients? Also does the hydration cream clog pores?"
              className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Business Context / Policy */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Specific Store Policy or Fact (Optional)</span>
              <span className="text-[11px] text-slate-400">Discount codes, return policy, ingredients</span>
            </label>
            <input
              type="text"
              value={businessContext}
              onChange={(e) => setBusinessContext(e.target.value)}
              placeholder="e.g. Non-comedogenic, cruelty-free certified, 30-day money back guarantee, free shipping over $50"
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Sentiment & Drafting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Draft Smart Replies</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Sentiment Analysis & Live Chat Simulator */}
      <div className="lg:col-span-6 space-y-4">
        {results ? (
          <div className="space-y-4">
            {/* Sentiment & Intent Pill */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Detected Sentiment:</span>
                  {getSentimentBadge(results.detectedSentiment)}
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {results.keyIntent}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                "{results.sentimentSummary}"
              </p>
            </div>

            {/* Simulated DM / Chat Bubble Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
              {/* Chat Header */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{brand.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Active Now · {channel.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40">
                  Preview Simulator
                </span>
              </div>

              {/* Chat Conversation Area */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 space-y-3 min-h-[220px] max-h-[360px] overflow-y-auto">
                {/* Customer Bubble */}
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 shrink-0 font-bold">
                    C
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-800 dark:text-slate-200 shadow-2xs leading-relaxed">
                    {customerMessage}
                  </div>
                </div>

                {/* Brand Reply Bubble */}
                <div className="flex items-start justify-end gap-2 max-w-[85%] ml-auto">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl rounded-tr-xs p-3.5 text-xs text-white shadow-xs leading-relaxed whitespace-pre-line">
                    {activeReply}
                  </div>
                  <img
                    src={brand.avatarUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&auto=format&fit=crop&q=80'}
                    alt={brand.name}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                </div>
              </div>

              {/* Tone Variation Selector Buttons */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Select Reply Tone:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {results.variations.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedReplyIndex(idx)}
                      className={`p-2 rounded-xl border text-left text-xs transition ${
                        selectedReplyIndex === idx
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-semibold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{v.tone}</span>
                        {selectedReplyIndex === idx && <Check className="w-3.5 h-3.5 text-purple-600" />}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{v.badge}</div>
                    </button>
                  ))}
                </div>

                {/* Copy & Save Action Bar */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleCopyReply(activeReply)}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Reply to Clipboard!' : 'Copy Selected Reply'}</span>
                  </button>

                  <button
                    onClick={() => onSaveToVault('reply', { message: customerMessage, reply: activeReply, tone: results.variations[selectedReplyIndex]?.tone })}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Community Manager Advice Note */}
            {results.internalAdvice && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Community Manager Pro-Tip: </span>
                  {results.internalAdvice}
                  {results.recommendedNextAction && (
                    <div className="mt-1 font-semibold text-amber-800 dark:text-amber-400">
                      Next Action: {results.recommendedNextAction}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[380px]">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Turn Customer Inquiries into Lifelong Fans
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste any customer comment, question, or complaint on the left, or test one of the preset scenarios to preview empathetic, high-converting replies.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleApplyPreset(REPLY_PRESETS[0])}
              className="py-2.5 px-6 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm"
            >
              Test "Delayed Package" Scenario
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
