/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Instagram,
  Facebook,
  Lightbulb,
  Target,
  MessageSquare,
  Bot,
  Bookmark,
  Check,
  TrendingUp,
  Award,
  Share2,
  Zap,
  Building2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { CaptionsLab } from './components/CaptionsLab';
import { IdeasStudio } from './components/IdeasStudio';
import { StrategyArchitect } from './components/StrategyArchitect';
import { CustomerResponder } from './components/CustomerResponder';
import { CopilotChat } from './components/CopilotChat';
import { BrandModal } from './components/BrandModal';
import { VaultModal } from './components/VaultModal';
import { ActiveTab, BrandProfile, SavedItem } from './types/marketing';
import { PRESET_BRANDS } from './utils/mockBrands';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('captions');

  // Brand management with localStorage persistence
  const [allBrands, setAllBrands] = useState<BrandProfile[]>(() => {
    try {
      const saved = localStorage.getItem('omnimarket_brands');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return PRESET_BRANDS;
  });

  const [activeBrand, setActiveBrand] = useState<BrandProfile>(() => {
    try {
      const savedId = localStorage.getItem('omnimarket_active_brand_id');
      if (savedId) {
        const found = allBrands.find((b) => b.id === savedId);
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
    return PRESET_BRANDS[0];
  });

  // Vault items persistence
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem('omnimarket_vault');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [vaultModalOpen, setVaultModalOpen] = useState(false);

  // Topic passed across tabs (e.g. from Ideas to Captions)
  const [captionTopicTransfer, setCaptionTopicTransfer] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBrand = (updated: BrandProfile) => {
    setAllBrands((prev) => {
      const exists = prev.some((b) => b.id === updated.id);
      const next = exists ? prev.map((b) => (b.id === updated.id ? updated : b)) : [updated, ...prev];
      localStorage.setItem('omnimarket_brands', JSON.stringify(next));
      return next;
    });
    setActiveBrand(updated);
    localStorage.setItem('omnimarket_active_brand_id', updated.id);
    showToast(`Brand updated to "${updated.name}"`);
  };

  const handleSelectBrand = (brand: BrandProfile) => {
    setActiveBrand(brand);
    localStorage.setItem('omnimarket_active_brand_id', brand.id);
    showToast(`Switched active brand to "${brand.name}"`);
  };

  const handleSaveToVault = (type: SavedItem['type'], content: any) => {
    const newItem: SavedItem = {
      id: `item_${Date.now()}`,
      type,
      title:
        type === 'caption'
          ? `${content.platform === 'facebook' ? 'Facebook' : 'Instagram'} Caption`
          : type === 'idea'
          ? content.title || 'Content Idea'
          : type === 'strategy'
          ? content.campaignName || 'Campaign Strategy'
          : `Reply to: ${content.message?.slice(0, 30)}...`,
      createdAt: new Date().toISOString(),
      brandName: activeBrand.name,
      content,
      platform: content.platform,
    };

    const next = [newItem, ...savedItems];
    setSavedItems(next);
    localStorage.setItem('omnimarket_vault', JSON.stringify(next));
    showToast(`Saved to Vault!`);
  };

  const handleDeleteVaultItem = (id: string) => {
    const next = savedItems.filter((i) => i.id !== id);
    setSavedItems(next);
    localStorage.setItem('omnimarket_vault', JSON.stringify(next));
  };

  const handleClearAllVault = () => {
    setSavedItems([]);
    localStorage.removeItem('omnimarket_vault');
    showToast('Vault cleared');
  };

  const handleSendToCaptionLab = (topic: string) => {
    setCaptionTopicTransfer(topic);
    setActiveTab('captions');
    showToast('Topic imported to Captions Lab!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 py-2.5 px-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeBrand={activeBrand}
        onOpenBrandModal={() => setBrandModalOpen(true)}
        onOpenVault={() => setVaultModalOpen(true)}
        vaultCount={savedItems.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Brand Voice Banner */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-purple-200 dark:border-purple-800 shadow-xs">
              <img
                src={activeBrand.avatarUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=80'}
                alt={activeBrand.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeBrand.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {activeBrand.industry}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Tone:</span> {activeBrand.tone} ·{' '}
                <span className="font-semibold text-slate-600 dark:text-slate-400">Audience:</span> {activeBrand.targetAudience}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBrandModalOpen(true)}
              className="py-1.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Edit Voice Profile</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'captions' && (
          <CaptionsLab
            key={activeBrand.id + captionTopicTransfer}
            brand={activeBrand}
            initialTopic={captionTopicTransfer}
            onSaveToVault={handleSaveToVault}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasStudio
            key={activeBrand.id}
            brand={activeBrand}
            onSendToCaptionLab={handleSendToCaptionLab}
            onSaveToVault={handleSaveToVault}
          />
        )}

        {activeTab === 'strategy' && (
          <StrategyArchitect
            key={activeBrand.id}
            brand={activeBrand}
            onSaveToVault={handleSaveToVault}
          />
        )}

        {activeTab === 'replies' && (
          <CustomerResponder
            key={activeBrand.id}
            brand={activeBrand}
            onSaveToVault={handleSaveToVault}
          />
        )}

        {activeTab === 'copilot' && (
          <CopilotChat
            key={activeBrand.id}
            brand={activeBrand}
            onSendToCaptionLab={handleSendToCaptionLab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 bg-white/50 dark:bg-slate-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">OmniMarket AI</span>
            <span>·</span>
            <span>Intelligent Digital Marketing Engine for Facebook & Instagram</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <button
              onClick={() => setVaultModalOpen(true)}
              className="hover:underline text-purple-600 dark:text-purple-400 font-semibold"
            >
              Saved Assets ({savedItems.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BrandModal
        isOpen={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        activeBrand={activeBrand}
        allBrands={allBrands}
        onSelectBrand={handleSelectBrand}
        onSaveBrand={handleSaveBrand}
      />

      <VaultModal
        isOpen={vaultModalOpen}
        onClose={() => setVaultModalOpen(false)}
        savedItems={savedItems}
        onDeleteItem={handleDeleteVaultItem}
        onClearAll={handleClearAllVault}
      />
    </div>
  );
}
