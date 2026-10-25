import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Trash2,
  Copy,
  Check,
  Download,
  Instagram,
  Facebook,
  Lightbulb,
  Target,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { SavedItem } from '../types/marketing';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const [filter, setFilter] = useState<'all' | 'caption' | 'idea' | 'strategy' | 'reply'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = savedItems.filter((item) => filter === 'all' || item.type === filter);

  const handleCopy = (item: SavedItem) => {
    let textToCopy = '';
    if (typeof item.content === 'string') {
      textToCopy = item.content;
    } else if (item.content.caption) {
      textToCopy = item.content.caption;
    } else if (item.content.reply) {
      textToCopy = item.content.reply;
    } else if (item.content.campaignName) {
      textToCopy = `${item.content.campaignName}: ${item.content.executiveSummary}`;
    } else if (item.content.title) {
      textToCopy = `${item.content.title}\nHook: ${item.content.hook}`;
    } else {
      textToCopy = JSON.stringify(item.content, null, 2);
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `omnimarket_saved_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'caption':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'idea':
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case 'strategy':
        return <Target className="w-4 h-4 text-purple-600" />;
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Marketing Vault & Saved Assets</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold">
                  {savedItems.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Quickly access and copy your favorite winning captions, ideas, and campaigns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedItems.length > 0 && (
              <button
                onClick={handleExportJSON}
                className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition text-xs font-medium flex items-center gap-1"
                title="Export JSON"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {(['all', 'caption', 'idea', 'strategy', 'reply'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`py-1.5 px-3 rounded-lg font-semibold capitalize transition ${
                  filter === t
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {savedItems.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] text-rose-500 hover:underline font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {item.brandName}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed">
                  {typeof item.content === 'string'
                    ? item.content
                    : item.content.caption ||
                      item.content.reply ||
                      item.content.hook ||
                      JSON.stringify(item.content, null, 2)}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleCopy(item)}
                    className="py-1 px-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <Bookmark className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">
                No items in your Vault yet
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Click the bookmark "Save" button on any generated caption, strategy, idea, or reply to collect them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
