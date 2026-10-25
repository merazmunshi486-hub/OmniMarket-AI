import React, { useState } from 'react';
import {
  Sparkles,
  Instagram,
  Facebook,
  Send,
  Loader2,
  Sliders,
  RefreshCw,
  Wand2,
  Copy,
  Check,
  Zap,
  Tag,
  Smile,
  AlertCircle
} from 'lucide-react';
import { BrandProfile, CaptionResponse } from '../types/marketing';
import { InstagramPreview } from './InstagramPreview';
import { FacebookPreview } from './FacebookPreview';
import { CAPTION_PROMPT_PRESETS } from '../utils/mockBrands';

interface CaptionsLabProps {
  brand: BrandProfile;
  initialTopic?: string;
  onSaveToVault: (type: 'caption', content: any) => void;
}

export const CaptionsLab: React.FC<CaptionsLabProps> = ({
  brand,
  initialTopic = '',
  onSaveToVault,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [platform, setPlatform] = useState<'both' | 'instagram' | 'facebook'>('both');
  const [goal, setGoal] = useState('engagement');
  const [tone, setTone] = useState(brand.tone || 'Friendly & Conversational');
  const [cta, setCta] = useState('comment');
  const [customCta, setCustomCta] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CaptionResponse | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'instagram' | 'facebook'>('instagram');

  const [refining, setRefining] = useState(false);

  const handleGenerate = async (overrideTopic?: string) => {
    const finalTopic = overrideTopic || topic;
    if (!finalTopic.trim()) {
      setError('Please enter a topic, product offer, or event first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/marketing/captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: finalTopic,
          platform,
          goal,
          tone,
          cta,
          customCta,
          length,
          includeEmojis,
          includeHashtags,
          brand,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate captions');
      }

      const data: CaptionResponse = await response.json();
      setResults(data);

      if (platform === 'facebook' && !data.instagram) {
        setActivePreviewTab('facebook');
      } else {
        setActivePreviewTab('instagram');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: typeof CAPTION_PROMPT_PRESETS[0]) => {
    setTopic(preset.topic);
    setGoal(preset.goal);
    setCustomCta(preset.cta);
    handleGenerate(preset.topic);
  };

  const handleRefine = async (action: string) => {
    if (!results) return;
    setRefining(true);
    try {
      const targetText =
        activePreviewTab === 'instagram'
          ? results.instagram?.caption
          : results.facebook?.caption;

      if (!targetText) return;

      const res = await fetch('/api/marketing/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: targetText,
          action,
          brand,
        }),
      });

      if (!res.ok) throw new Error('Refine failed');
      const data = await res.json();

      if (activePreviewTab === 'instagram' && results.instagram) {
        setResults({
          ...results,
          instagram: {
            ...results.instagram,
            caption: data.refinedText,
          },
        });
      } else if (activePreviewTab === 'facebook' && results.facebook) {
        setResults({
          ...results,
          facebook: {
            ...results.facebook,
            caption: data.refinedText,
          },
        });
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setRefining(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form & Controls */}
      <div className="lg:col-span-6 space-y-6">
        {/* Preset Starters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Inspiration Starters
            </span>
            <span className="text-[11px] text-slate-400">1-click fill & generate</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CAPTION_PROMPT_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition group"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {preset.label}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {preset.topic}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Social Caption Composer
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Optimized for algorithms, organic reach, and high audience engagement
              </p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-medium text-purple-700 dark:text-purple-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{brand.name}</span>
            </div>
          </div>

          {/* Topic Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>What are you posting about? *</span>
              <span className="text-[11px] text-slate-400 font-normal">
                Product, discount, tip, announcement
              </span>
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Announcing our 2-day Flash Sale on organic face oils. 20% off with code GLOW20. Highlight natural botanical ingredients and morning routine benefits..."
              className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Platform Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPlatform('both')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  platform === 'both'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex -space-x-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <Facebook className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span>Both (IG + FB)</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('instagram')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  platform === 'instagram'
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('facebook')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  platform === 'facebook'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Goal & Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="engagement">Maximize Comments & Saves</option>
                <option value="sales">Drive Direct Sales / Conversions</option>
                <option value="education">Educational & Authority</option>
                <option value="storytelling">Storytelling & Founder Journey</option>
                <option value="traffic">Drive Traffic to Website / Bio Link</option>
                <option value="giveaway">Viral Giveaway / Tag Friends</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Conversational & Authentic">Conversational & Authentic</option>
                <option value="High-Energy & Urgent">High-Energy & Urgent (FOMO)</option>
                <option value="Warm & Empowering">Warm & Empowering</option>
                <option value="Witty & Playful">Witty, Humorous & Relatable</option>
                <option value="Luxury & Minimalist">Luxury & Editorial Minimal</option>
                <option value="Authoritative & Data-Driven">Authoritative & Data-Driven</option>
              </select>
            </div>
          </div>

          {/* Call-to-Action & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Call-to-Action (CTA)
              </label>
              <select
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Drop a comment with your opinion below">Drop a comment below</option>
                <option value="Tap link in bio to shop before stock sells out">Tap link in bio to shop</option>
                <option value="Save this post for later so you dont lose it">Save this post for later</option>
                <option value="DM us the word INFO for direct access">DM us "INFO" for link</option>
                <option value="Tag a friend who needs to see this">Tag a friend</option>
                <option value="custom">Custom CTA...</option>
              </select>
              {cta === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter custom call to action..."
                  value={customCta}
                  onChange={(e) => setCustomCta(e.target.value)}
                  className="w-full mt-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Length Format
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs capitalize transition ${
                      length === l
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                Include Emojis
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-500" />
                Include Targeted Hashtags
              </span>
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting High-Converting Captions...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Social Media Captions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Live Simulated Previews */}
      <div className="lg:col-span-6 space-y-4">
        {results ? (
          <div>
            {/* Platform Tab Toggles */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xs mb-4">
              <div className="flex items-center gap-1">
                {results.instagram && (
                  <button
                    onClick={() => setActivePreviewTab('instagram')}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                      activePreviewTab === 'instagram'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram Preview</span>
                  </button>
                )}
                {results.facebook && (
                  <button
                    onClick={() => setActivePreviewTab('facebook')}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                      activePreviewTab === 'facebook'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook Preview</span>
                  </button>
                )}
              </div>

              {refining && (
                <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium px-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Polishing copy...</span>
                </div>
              )}
            </div>

            {/* Preview Component */}
            {activePreviewTab === 'instagram' && results.instagram && (
              <InstagramPreview
                data={results.instagram}
                brand={brand}
                suggestedVisual={results.suggestedVisualPrompt}
                onRefineText={handleRefine}
                onSaveToVault={onSaveToVault}
              />
            )}

            {activePreviewTab === 'facebook' && results.facebook && (
              <FacebookPreview
                data={results.facebook}
                brand={brand}
                suggestedVisual={results.suggestedVisualPrompt}
                onRefineText={handleRefine}
                onSaveToVault={onSaveToVault}
              />
            )}
          </div>
        ) : (
          /* Empty State Placeholder */
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[460px] text-slate-400 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-100 to-pink-100 dark:from-purple-950/40 dark:to-pink-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-sm space-y-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Ready to preview your high-converting post
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose a topic on the left or click any inspiration preset to see realistic Instagram and Facebook feed posts with alternative hooks, algorithm tips, and copyable hashtag clusters.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleApplyPreset(CAPTION_PROMPT_PRESETS[0])}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition"
              >
                Try "Summer Flash Sale"
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(CAPTION_PROMPT_PRESETS[1])}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Try "Myth Busting"
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
