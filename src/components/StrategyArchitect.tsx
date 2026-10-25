import React, { useState } from 'react';
import {
  Target,
  Rocket,
  Users,
  Compass,
  TrendingUp,
  Download,
  Copy,
  CheckCircle,
  Loader2,
  Bookmark,
  Sparkles,
  PieChart,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { BrandProfile, StrategyResponse } from '../types/marketing';

interface StrategyArchitectProps {
  brand: BrandProfile;
  onSaveToVault: (type: 'strategy', content: any) => void;
}

export const StrategyArchitect: React.FC<StrategyArchitectProps> = ({
  brand,
  onSaveToVault,
}) => {
  const [productOrService, setProductOrService] = useState(
    brand.offer || `${brand.name} Core Offering`
  );
  const [goal, setGoal] = useState('Acquisition & Sales Conversion Blitz');
  const [budget, setBudget] = useState('Modest paid testing ($300 - $1,500/mo) + Organic Social');
  const [timeline, setTimeline] = useState('30-Day Campaign');
  const [competitors, setCompetitors] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<StrategyResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!productOrService.trim()) {
      setError('Please provide the product or service you want to build a strategy for.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/marketing/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productOrService,
          goal,
          budget,
          timeline,
          competitors,
          brand,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate strategy');
      }

      const data: StrategyResponse = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Error creating marketing strategy.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!results) return;

    let md = `# Campaign Strategy: ${results.campaignName}\n`;
    md += `*Tagline: "${results.tagline}"*\n\n`;
    md += `## Executive Summary\n${results.executiveSummary}\n\n`;

    md += `## Target Audience Personas\n`;
    results.targetPersonas.forEach((p) => {
      md += `### ${p.personaName}\n- **Demographics:** ${p.demographics}\n- **Core Pain:** ${p.corePain}\n- **Desire:** ${p.desire}\n- **Trigger:** ${p.trigger}\n\n`;
    });

    md += `## Content Pillars\n`;
    results.contentPillars.forEach((c) => {
      md += `- **${c.title} (${c.allocation}):** ${c.objective}\n  Topics: ${c.exampleTopics.join(', ')}\n`;
    });

    md += `\n## Channel Tactics\n`;
    md += `### Instagram\n- **Strategy:** ${results.channelTactics.instagram.strategy}\n- **Frequency:** ${results.channelTactics.instagram.frequency}\n- **Growth Hack:** ${results.channelTactics.instagram.growthHack}\n\n`;
    md += `### Facebook\n- **Strategy:** ${results.channelTactics.facebook.strategy}\n- **Frequency:** ${results.channelTactics.facebook.frequency}\n- **Growth Hack:** ${results.channelTactics.facebook.growthHack}\n\n`;

    md += `## Phased Roadmap\n`;
    results.phasedRoadmap.forEach((phase) => {
      md += `### ${phase.phase}\n`;
      phase.actions.forEach((a) => {
        md += `- ${a}\n`;
      });
      md += `\n`;
    });

    md += `## KPI Targets\n`;
    results.kpis.forEach((k) => {
      md += `- **${k.metric}:** ${k.benchmark} (${k.notes})\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Campaign Strategy Architect
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Develop a 360° growth strategy, persona matrix, content distribution plan, and roadmap
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="py-2.5 px-6 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Formulating Blueprint...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Build Marketing Strategy</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Product / Focus Offer *
            </label>
            <input
              type="text"
              value={productOrService}
              onChange={(e) => setProductOrService(e.target.value)}
              placeholder="e.g. Summer Skincare Bundle ($48) or SaaS Annual Subscription"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Campaign Objective
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            >
              <option value="Acquisition & Sales Conversion Blitz">Customer Acquisition & Direct Sales Blitz</option>
              <option value="New Product Launch & Waitlist Hype">New Product Launch & Waitlist Hype</option>
              <option value="Brand Awareness & Organic Follower Growth">Brand Authority & High-Velocity Reach</option>
              <option value="Black Friday / Holiday Season Sale">Holiday / Seasonal Event Flash Promotion</option>
              <option value="Community Engagement & UGC Building">User Generated Content (UGC) & Community Love</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Budget & Ad Resources
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. $500 total ad testing + organic Instagram & Facebook"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Timeline Duration
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            >
              <option value="14-Day Sprint">14-Day High-Intensity Sprint</option>
              <option value="30-Day Campaign">30-Day Comprehensive Campaign</option>
              <option value="60-Day Scaling Cycle">60-Day Scale & Retargeting Cycle</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results ? (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-300 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Strategic Campaign Blueprint</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                {results.campaignName}
              </h3>
              <p className="text-sm md:text-base text-purple-200 font-medium italic">
                "{results.tagline}"
              </p>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl pt-1">
                {results.executiveSummary}
              </p>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2 pt-3">
                <button
                  onClick={handleCopyMarkdown}
                  className="py-1.5 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Brief!' : 'Copy Full Strategy'}</span>
                </button>
                <button
                  onClick={() => onSaveToVault('strategy', results)}
                  className="py-1.5 px-3.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 text-xs font-semibold border border-purple-400/30 transition flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save to Vault</span>
                </button>
              </div>
            </div>
          </div>

          {/* Persona Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Target Customer Personas
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.targetPersonas.map((persona, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {persona.personaName}
                    </span>
                  </div>

                  <div className="text-slate-500 text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Profile:</span> {persona.demographics}
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-900 dark:text-rose-300">
                    <span className="font-bold block mb-0.5">Core Frustration / Pain:</span>
                    <p className="text-[11px] leading-relaxed">{persona.corePain}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300">
                    <span className="font-bold block mb-0.5">Desired Transformation:</span>
                    <p className="text-[11px] leading-relaxed">{persona.desire}</p>
                  </div>

                  <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">💳 Buying Trigger:</span> {persona.trigger}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Pillars */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Content Pillars & Share of Voice
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.contentPillars.map((pillar, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{pillar.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                      {pillar.allocation}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {pillar.objective}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[10px] uppercase">Sample Topics:</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                      {pillar.exampleTopics.map((top, tIdx) => (
                        <li key={tIdx} className="truncate">• {top}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Specific Tactics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instagram */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>📸 Instagram Strategy</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Core Tactic:</span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {results.channelTactics.instagram.strategy}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Rhythm:</span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {results.channelTactics.instagram.frequency}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/30 text-pink-900 dark:text-pink-300">
                <span className="font-bold block mb-0.5">⚡ Growth Hack:</span>
                <p className="text-[11px]">{results.channelTactics.instagram.growthHack}</p>
              </div>
            </div>

            {/* Facebook */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>🌐 Facebook Strategy</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Core Tactic:</span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {results.channelTactics.facebook.strategy}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Rhythm:</span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {results.channelTactics.facebook.frequency}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-900 dark:text-blue-300">
                <span className="font-bold block mb-0.5">⚡ Facebook Algorithm Hack:</span>
                <p className="text-[11px]">{results.channelTactics.facebook.growthHack}</p>
              </div>
            </div>

            {/* Paid Ads */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>🎯 Paid Ad Blueprint</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Budget Split:</span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {results.channelTactics.paidAds.budgetSplit}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Ad Creative Hook Angles:</span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  {results.channelTactics.paidAds.hookAngles.map((angle, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-1">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{angle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Phased Roadmap & KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                Execution Roadmap Phases
              </h4>
              <div className="space-y-4">
                {results.phasedRoadmap.map((phase, pIdx) => (
                  <div key={pIdx} className="border-l-2 border-purple-500 pl-4 space-y-1.5 text-xs">
                    <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                      {phase.phase}
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                      {phase.actions.map((act, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Target KPIs & Benchmarks
              </h4>
              <div className="space-y-3">
                {results.kpis.map((kpi, kIdx) => (
                  <div
                    key={kIdx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{kpi.metric}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{kpi.benchmark}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{kpi.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600">
            <Target className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Build a Complete Campaign Architecture
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Define customer personas, balance your content pillars, craft channel tactics, and establish benchmark KPIs for {brand.name}.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="py-2.5 px-6 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm"
          >
            {loading ? 'Assembling Strategy...' : 'Create Marketing Strategy'}
          </button>
        </div>
      )}
    </div>
  );
};
