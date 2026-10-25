import React, { useState } from 'react';
import {
  Lightbulb,
  Calendar as CalendarIcon,
  Video,
  Layers,
  Image as ImageIcon,
  CheckCircle,
  Copy,
  Download,
  ArrowRight,
  Loader2,
  Bookmark,
  Sparkles,
  BarChart3,
  Clock,
  Filter
} from 'lucide-react';
import { BrandProfile, ContentIdea, IdeasResponse } from '../types/marketing';

interface IdeasStudioProps {
  brand: BrandProfile;
  onSendToCaptionLab: (topic: string) => void;
  onSaveToVault: (type: 'idea', content: any) => void;
}

export const IdeasStudio: React.FC<IdeasStudioProps> = ({
  brand,
  onSendToCaptionLab,
  onSaveToVault,
}) => {
  const [niche, setNiche] = useState(brand.industry || 'Health & Wellness');
  const [format, setFormat] = useState('all');
  const [timeframe, setTimeframe] = useState<'7-day' | '14-day'>('7-day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<IdeasResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'ideas' | 'calendar'>('ideas');
  const [copiedCalendar, setCopiedCalendar] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/marketing/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: `${brand.name} - ${niche}`,
          format,
          count: 6,
          includeCalendar: true,
          timeframe,
          brand,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate ideas');
      }

      const data: IdeasResponse = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Error creating content ideas.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!results || !results.calendar) return;

    const headers = ['Day', 'Pillar', 'Title', 'Format', 'Platform', 'Recommended Time', 'Hook'];
    const rows = results.calendar.map((c) => [
      `"${c.day}"`,
      `"${c.pillar}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.format}"`,
      `"${c.platform}"`,
      `"${c.recommendedTime}"`,
      `"${c.hook.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${brand.name.toLowerCase().replace(/\s+/g, '_')}_content_calendar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCalendar = () => {
    if (!results || !results.calendar) return;
    const text = results.calendar
      .map((c) => `📅 ${c.day} [${c.pillar} | ${c.format}]\n📌 ${c.title}\n⏰ Time: ${c.recommendedTime} (${c.platform})\n🎣 Hook: "${c.hook}"\n`)
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopiedCalendar(true);
    setTimeout(() => setCopiedCalendar(false), 2000);
  };

  const getFormatBadge = (formatType: string) => {
    switch (formatType.toLowerCase()) {
      case 'reels':
      case 'video':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <Video className="w-3 h-3" />
            Reels / Short Video
          </span>
        );
      case 'carousel':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Layers className="w-3 h-3" />
            Multi-Slide Carousel
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ImageIcon className="w-3 h-3" />
            {formatType}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Content Idea Generator & Calendar Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Brainstorm viral Reels, step-by-step Carousels, and plan a high-converting publishing schedule for{' '}
              <strong className="text-purple-600 dark:text-purple-400">{brand.name}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="py-2.5 px-5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Brainstorming Strategies...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate New Ideas & Matrix</span>
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Industry Focus
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Clean Skincare, Gym Apparel, B2B SaaS"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Format Filter
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            >
              <option value="all">Mix of All Formats (Balanced)</option>
              <option value="reels">Viral Reels & Short Videos Only</option>
              <option value="carousel">Educational Carousel Slides Only</option>
              <option value="static">High-Aesthetic Single Photos Only</option>
              <option value="stories">Interactive Story Polls & Quizzes</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Calendar Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTimeframe('7-day')}
                className={`py-2 px-3 rounded-xl border font-medium transition ${
                  timeframe === '7-day'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                7-Day Matrix
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('14-day')}
                className={`py-2 px-3 rounded-xl border font-medium transition ${
                  timeframe === '14-day'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                14-Day Sprint
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {results ? (
        <div className="space-y-6">
          {/* Sub Navigation Bar: Ideas vs Calendar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('ideas')}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'ideas'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Creative Idea Blueprints ({results.ideas?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'calendar'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Posting Schedule ({results.calendar?.length || 0} Days)</span>
              </button>
            </div>

            {activeTab === 'calendar' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCalendar}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                >
                  {copiedCalendar ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCalendar ? 'Copied Calendar!' : 'Copy Matrix'}</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>

          {/* IDEAS CARDS VIEW */}
          {activeTab === 'ideas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.ideas?.map((idea, index) => (
                <div
                  key={idea.id || index}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      {getFormatBadge(idea.format)}
                      <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        {idea.targetGoal}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {idea.title}
                    </h3>

                    {/* Viral Hook */}
                    <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                      <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
                        ⚡ Scroll-Stopping Hook:
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        "{idea.hook}"
                      </p>
                    </div>

                    {/* Visual Concept */}
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                        🎥 Visual Direction:
                      </span>
                      {idea.visualConcept}
                    </div>

                    {/* Slide breakdown / script */}
                    {idea.scriptOrSlides && idea.scriptOrSlides.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">
                          Step-by-Step Flow:
                        </span>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                          {idea.scriptOrSlides.map((slide, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1 shrink-0"></span>
                              <span>{slide}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSendToCaptionLab(`${idea.title}: ${idea.hook}. Visual: ${idea.visualConcept}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition"
                    >
                      <span>Draft Caption from This</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSaveToVault('idea', idea)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                      title="Save to Vault"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CALENDAR VIEW */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.calendar?.map((slot, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {slot.day}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {slot.pillar}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {slot.title}
                  </h4>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">Opening Hook:</span>
                    <p className="text-slate-700 dark:text-slate-300 italic text-[11px]">
                      "{slot.hook}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.recommendedTime}</span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {slot.format}
                    </span>
                  </div>

                  <button
                    onClick={() => onSendToCaptionLab(`${slot.title} (${slot.pillar}). Hook: ${slot.hook}`)}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40 transition flex items-center justify-center gap-1"
                  >
                    <span>Write Caption</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500">
            <Lightbulb className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Never Run Out of Content Ideas
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate structured video scripts, viral carousel breakdowns, and a day-by-day posting matrix tailored to {brand.name}'s audience.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="py-2.5 px-6 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm"
          >
            {loading ? 'Analyzing Trends...' : 'Generate Content Matrix'}
          </button>
        </div>
      )}
    </div>
  );
};
