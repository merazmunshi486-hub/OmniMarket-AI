import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Copy,
  Check,
  Sparkles,
  Lightbulb,
  Hash,
  Image as ImageIcon
} from 'lucide-react';
import { InstagramCaptionData, BrandProfile } from '../types/marketing';

interface InstagramPreviewProps {
  data: InstagramCaptionData;
  brand: BrandProfile;
  suggestedVisual?: string;
  onRefineText?: (action: string) => void;
  onSaveToVault?: (type: 'caption', content: any) => void;
}

export const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  data,
  brand,
  suggestedVisual,
  onRefineText,
  onSaveToVault,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [activeHook, setActiveHook] = useState(data.hook || '');

  // Handle swapping hook
  const fullCaption = activeHook && activeHook !== data.hook
    ? data.caption.replace(data.hook, activeHook)
    : data.caption;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(fullCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyHashtags = () => {
    const tags = data.hashtags ? data.hashtags.join(' ') : '';
    navigator.clipboard.writeText(tags);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const username = brand.instagramHandle || 'yourbrand_official';

  return (
    <div className="space-y-4">
      {/* Hook Switcher Bar */}
      {data.alternativeHooks && data.alternativeHooks.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Test Viral Hook Variations (click to swap live):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveHook(data.hook)}
              className={`px-2.5 py-1.5 rounded-lg border text-left transition ${
                activeHook === data.hook
                  ? 'bg-amber-500 text-white font-medium shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="font-bold mr-1">Hook 1 (Original):</span>
              "{data.hook}"
            </button>
            {data.alternativeHooks.map((altHook, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHook(altHook)}
                className={`px-2.5 py-1.5 rounded-lg border text-left transition ${
                  activeHook === altHook
                    ? 'bg-amber-500 text-white font-medium shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="font-bold mr-1">Hook {idx + 2}:</span>
                "{altHook}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instagram Feed Mockup */}
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all">
        {/* IG Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
              <img
                src={brand.avatarUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&auto=format&fit=crop&q=80'}
                alt={brand.name}
                className="w-full h-full object-cover rounded-full bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {username}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
              </div>
              <p className="text-[10px] text-slate-400">Original audio</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* IG Image / Creative Area */}
        <div className="relative aspect-square w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 flex flex-col justify-end p-5 text-white overflow-hidden group">
          <img
            src={brand.avatarUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80'}
            alt="Post visual"
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Visual Concept pill */}
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium text-white border border-white/20">
              <ImageIcon className="w-3.5 h-3.5 text-pink-300" />
              <span>Suggested Visual Aesthetic</span>
            </div>
            <p className="text-xs text-white/90 line-clamp-3 leading-relaxed drop-shadow-md">
              {suggestedVisual || 'High-contrast product focus with vibrant aesthetic background.'}
            </p>
          </div>
        </div>

        {/* IG Action Bar */}
        <div className="px-3.5 pt-2.5 pb-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="transition transform active:scale-125"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'
                }`}
              />
            </button>
            <button className="hover:text-blue-500">
              <MessageCircle className="w-6 h-6 -rotate-90" />
            </button>
            <button className="hover:text-emerald-500">
              <Send className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="transition transform active:scale-125"
          >
            <Bookmark
              className={`w-6 h-6 ${
                isSaved ? 'fill-slate-900 dark:fill-white text-slate-900 dark:text-white' : 'hover:text-slate-900'
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="px-3.5 py-1 text-xs font-semibold text-slate-900 dark:text-white">
          {isLiked ? '1,843 likes' : '1,842 likes'}
        </div>

        {/* Caption Body */}
        <div className="px-3.5 py-1 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
            {username}
          </span>
          {isExpanded ? fullCaption : (
            <>
              {fullCaption.slice(0, 140)}
              {fullCaption.length > 140 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium ml-1"
                >
                  ...more
                </button>
              )}
            </>
          )}
        </div>

        {/* Hashtags display */}
        {data.hashtags && data.hashtags.length > 0 && (
          <div className="px-3.5 py-1.5 flex flex-wrap gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            {data.hashtags.slice(0, isExpanded ? 30 : 6).map((tag, i) => (
              <span key={i} className="hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
            {!isExpanded && data.hashtags.length > 6 && (
              <span className="text-slate-400">+{data.hashtags.length - 6} more</span>
            )}
          </div>
        )}

        {/* View all comments teaser */}
        <div className="px-3.5 py-1 text-[11px] text-slate-400">
          View all 48 comments
        </div>

        {/* Timestamp */}
        <div className="px-3.5 pb-3 text-[9px] uppercase tracking-wider text-slate-400">
          2 hours ago
        </div>

        {/* Quick Toolbar Inside IG Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleCopyCaption}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 transition shadow-2xs"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
          </button>

          <button
            onClick={handleCopyHashtags}
            className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Copy hashtags only"
          >
            {copiedHashtags ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Hash className="w-3.5 h-3.5" />}
            <span>Tags</span>
          </button>

          {onSaveToVault && (
            <button
              onClick={() => onSaveToVault('caption', { platform: 'instagram', caption: fullCaption, hashtags: data.hashtags, hook: activeHook })}
              className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
              title="Save to Vault"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      {/* Strategic Posting Tip */}
      {data.postTip && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-xl p-3 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Instagram Growth Tip: </span>
            {data.postTip}
          </div>
        </div>
      )}

      {/* Hashtag Breakdown Section */}
      {data.hashtagBreakdown && (
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs space-y-2">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-pink-500" />
              Categorized Hashtag Mix:
            </span>
            <button
              onClick={handleCopyHashtags}
              className="text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 font-medium"
            >
              {copiedHashtags ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            {data.hashtagBreakdown.trending && (
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                <span className="font-semibold text-purple-600 dark:text-purple-400 block mb-1">🔥 High Reach (Broad):</span>
                <span className="text-slate-600 dark:text-slate-300">{data.hashtagBreakdown.trending.join(' ')}</span>
              </div>
            )}
            {data.hashtagBreakdown.niche && (
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">🎯 Niche Specific:</span>
                <span className="text-slate-600 dark:text-slate-300">{data.hashtagBreakdown.niche.join(' ')}</span>
              </div>
            )}
            {data.hashtagBreakdown.community && (
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1">🤝 Community & Saves:</span>
                <span className="text-slate-600 dark:text-slate-300">{data.hashtagBreakdown.community.join(' ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refine Options Toolbar */}
      {onRefineText && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-medium">Quick Polish:</span>
          <button
            onClick={() => onRefineText('Make it punchier, high energy with maximum curiosity')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
          >
            ⚡ Punchier
          </button>
          <button
            onClick={() => onRefineText('Shorten caption by 40% while keeping the core hook and CTA intact')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
          >
            ✂️ Shorten 40%
          </button>
          <button
            onClick={() => onRefineText('Add aesthetic and tasteful emojis throughout the caption')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
          >
            ✨ Add Emojis
          </button>
        </div>
      )}
    </div>
  );
};
