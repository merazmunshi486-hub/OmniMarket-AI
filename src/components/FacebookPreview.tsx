import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Globe,
  MoreHorizontal,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { FacebookCaptionData, BrandProfile } from '../types/marketing';

interface FacebookPreviewProps {
  data: FacebookCaptionData;
  brand: BrandProfile;
  suggestedVisual?: string;
  onRefineText?: (action: string) => void;
  onSaveToVault?: (type: 'caption', content: any) => void;
}

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({
  data,
  brand,
  suggestedVisual,
  onRefineText,
  onSaveToVault,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedHook, setSelectedHook] = useState(data.headline || '');

  const displayHeadline = selectedHook || data.headline;

  const fullFacebookPost = `${displayHeadline ? `${displayHeadline}\n\n` : ''}${data.caption}\n\n${
    data.discussionQuestion ? `👉 ${data.discussionQuestion}` : ''
  }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullFacebookPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageName = brand.facebookPage || brand.name || 'Brand Page';

  return (
    <div className="space-y-4">
      {/* Alternative Headlines / Hooks */}
      {data.alternativeHooks && data.alternativeHooks.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Facebook Headline Variations (click to swap):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedHook(data.headline)}
              className={`px-2.5 py-1.5 rounded-lg border text-left transition ${
                displayHeadline === data.headline
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="font-bold mr-1">Primary:</span>
              "{data.headline}"
            </button>
            {data.alternativeHooks.map((alt, i) => (
              <button
                key={i}
                onClick={() => setSelectedHook(alt)}
                className={`px-2.5 py-1.5 rounded-lg border text-left transition ${
                  displayHeadline === alt
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300'
              }`}
              >
                <span className="font-bold mr-1">Option {i + 2}:</span>
                "{alt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Facebook Card Mockup */}
      <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all">
        {/* Post Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <img
              src={brand.avatarUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&auto=format&fit=crop&q=80'}
              alt={pageName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white hover:underline cursor-pointer">
                  {pageName}
                </span>
                <span className="bg-blue-600 text-white rounded-full p-0.5 text-[10px]">
                  ✓
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>3 hrs</span>
                <span>·</span>
                <Globe className="w-3 h-3 text-slate-400 inline" />
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Post Text Body */}
        <div className="p-3.5 space-y-3">
          {displayHeadline && (
            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {displayHeadline}
            </h4>
          )}
          <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {data.caption}
          </div>

          {/* Discussion Question Callout */}
          {data.discussionQuestion && (
            <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-blue-800 dark:text-blue-400">
                <HelpCircle className="w-4 h-4" />
                <span>Comments Catalyst Question:</span>
              </div>
              <p className="font-medium">{data.discussionQuestion}</p>
            </div>
          )}
        </div>

        {/* Visual Graphic Banner */}
        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex items-end p-4 text-white">
          <img
            src={brand.avatarUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80'}
            alt="Facebook creative"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="relative z-10">
            <p className="text-xs text-white/90 font-medium line-clamp-2">
              📸 {suggestedVisual || 'Engaging branded lifestyle photo or high-contrast product demo.'}
            </p>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="px-3.5 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">👍</span>
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold">❤️</span>
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-bold">😮</span>
            </div>
            <span>{isLiked ? '349' : '348'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>54 comments</span>
            <span>21 shares</span>
          </div>
        </div>

        {/* FB Action Bar */}
        <div className="px-2 py-1 flex items-center justify-around text-slate-600 dark:text-slate-300 font-medium text-xs">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              isLiked ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>Like</span>
          </button>
          <button className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </button>
          <button className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Full Post'}</span>
          </button>

          {onSaveToVault && (
            <button
              onClick={() => onSaveToVault('caption', { platform: 'facebook', caption: fullFacebookPost, headline: displayHeadline })}
              className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition border border-purple-200 dark:border-purple-800"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      {/* Strategic Algorithm Tip */}
      {data.postTip && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Facebook Feed Algorithm Tip: </span>
            {data.postTip}
          </div>
        </div>
      )}

      {/* Refine Options Toolbar */}
      {onRefineText && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-medium">Quick Polish:</span>
          <button
            onClick={() => onRefineText('Make it more conversational and storytelling style for Facebook')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
          >
            📖 Storytelling Angle
          </button>
          <button
            onClick={() => onRefineText('Emphasize urgency and add high-converting direct response elements')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
          >
            🔥 High-Conversion / FOMO
          </button>
        </div>
      )}
    </div>
  );
};
