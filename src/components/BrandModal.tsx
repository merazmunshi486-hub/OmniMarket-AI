import React, { useState } from 'react';
import { X, Check, Building2, Sparkles, Plus, Trash2 } from 'lucide-react';
import { BrandProfile } from '../types/marketing';
import { PRESET_BRANDS } from '../utils/mockBrands';

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBrand: BrandProfile;
  allBrands: BrandProfile[];
  onSelectBrand: (brand: BrandProfile) => void;
  onSaveBrand: (brand: BrandProfile) => void;
}

export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  activeBrand,
  allBrands,
  onSelectBrand,
  onSaveBrand,
}) => {
  if (!isOpen) return null;

  const [editingBrand, setEditingBrand] = useState<BrandProfile>({ ...activeBrand });
  const [keywordsInput, setKeywordsInput] = useState(
    (editingBrand.keywords || []).join(', ')
  );
  const [prohibitedInput, setProhibitedInput] = useState(
    (editingBrand.prohibitedWords || []).join(', ')
  );

  const handleSelectPreset = (b: BrandProfile) => {
    setEditingBrand({ ...b });
    setKeywordsInput((b.keywords || []).join(', '));
    setProhibitedInput((b.prohibitedWords || []).join(', '));
  };

  const handleCreateNew = () => {
    const newBrand: BrandProfile = {
      id: `custom_${Date.now()}`,
      name: 'My New Brand',
      industry: 'E-commerce / Retail',
      targetAudience: 'Target customer demographic',
      tone: 'Friendly, modern, and engaging',
      offer: 'Our flagship product / service',
      keywords: ['quality', 'trusted', 'fast shipping'],
      prohibitedWords: ['cheap', 'spam'],
      instagramHandle: 'mybrand_official',
      facebookPage: 'My Brand',
    };
    setEditingBrand(newBrand);
    setKeywordsInput(newBrand.keywords.join(', '));
    setProhibitedInput(newBrand.prohibitedWords.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BrandProfile = {
      ...editingBrand,
      keywords: keywordsInput.split(',').map((s) => s.trim()).filter(Boolean),
      prohibitedWords: prohibitedInput.split(',').map((s) => s.trim()).filter(Boolean),
    };
    onSaveBrand(updated);
    onSelectBrand(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Brand Voice & Profile Manager
              </h3>
              <p className="text-xs text-slate-500">
                AI captions, strategies, and customer replies will automatically adapt to this brand
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Brand Switcher Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Available Brand Profiles:</span>
            <button
              type="button"
              onClick={handleCreateNew}
              className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Brand</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {allBrands.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectPreset(b)}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  editingBrand.id === b.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <div className="truncate">{b.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{b.industry}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Brand / Business Name *
              </label>
              <input
                type="text"
                required
                value={editingBrand.name}
                onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Industry / Niche *
              </label>
              <input
                type="text"
                required
                value={editingBrand.industry}
                onChange={(e) => setEditingBrand({ ...editingBrand, industry: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Target Audience Persona
            </label>
            <textarea
              rows={2}
              value={editingBrand.targetAudience}
              onChange={(e) => setEditingBrand({ ...editingBrand, targetAudience: e.target.value })}
              placeholder="e.g. Women aged 25-45 looking for organic non-toxic solutions..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Tone of Voice
              </label>
              <input
                type="text"
                value={editingBrand.tone}
                onChange={(e) => setEditingBrand({ ...editingBrand, tone: e.target.value })}
                placeholder="e.g. Empowering, warm, educational"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Main Offer / Product Focus
              </label>
              <input
                type="text"
                value={editingBrand.offer}
                onChange={(e) => setEditingBrand({ ...editingBrand, offer: e.target.value })}
                placeholder="e.g. Ceramide Hydrating Cream ($42)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Instagram Handle (without @)
              </label>
              <input
                type="text"
                value={editingBrand.instagramHandle || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand, instagramHandle: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Facebook Page Name
              </label>
              <input
                type="text"
                value={editingBrand.facebookPage || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand, facebookPage: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Keywords to Emphasize (comma-separated)</span>
            </label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="e.g. barrier health, dermatologically tested, clean"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Prohibited / Words to Avoid (comma-separated)</span>
            </label>
            <input
              type="text"
              value={prohibitedInput}
              onChange={(e) => setProhibitedInput(e.target.value)}
              placeholder="e.g. cheap, toxic, miracle cure"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Set Active Brand</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
