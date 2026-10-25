import React from 'react';
import {
  Sparkles,
  Instagram,
  Facebook,
  Lightbulb,
  Target,
  MessageSquare,
  Bot,
  Bookmark,
  ChevronDown,
  Building2
} from 'lucide-react';
import { ActiveTab, BrandProfile } from '../types/marketing';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeBrand: BrandProfile;
  onOpenBrandModal: () => void;
  onOpenVault: () => void;
  vaultCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  activeBrand,
  onOpenBrandModal,
  onOpenVault,
  vaultCount,
}) => {
  const tabs = [
    { id: 'captions' as const, label: 'Captions Lab', icon: Sparkles, badge: 'FB + IG' },
    { id: 'ideas' as const, label: 'Ideas & Calendar', icon: Lightbulb, badge: 'Matrix' },
    { id: 'strategy' as const, label: 'Campaign Strategy', icon: Target, badge: '360°' },
    { id: 'replies' as const, label: 'Customer Responder', icon: MessageSquare, badge: 'DMs' },
    { id: 'copilot' as const, label: 'Marketing Copilot', icon: Bot, badge: 'AI' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                  OmniMarket
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 text-white tracking-wide uppercase">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Digital Marketing & Social Growth Suite
              </p>
            </div>
          </div>

          {/* Center: Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Brand Switcher & Vault */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Brand Switcher Button */}
            <button
              onClick={onOpenBrandModal}
              className="flex items-center gap-2 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition text-xs shadow-2xs group"
              title="Change active brand"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-purple-300 dark:border-purple-600">
                <img
                  src={activeBrand.avatarUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=100&auto=format&fit=crop&q=80'}
                  alt={activeBrand.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] leading-tight truncate max-w-[120px]">
                  {activeBrand.name}
                </span>
                <span className="text-[9px] text-slate-400 block leading-none">
                  {activeBrand.industry}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition" />
            </button>

            {/* Saved Vault Button */}
            <button
              onClick={onOpenVault}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition shadow-2xs"
              title="Open Saved Vault"
            >
              <Bookmark className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              {vaultCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {vaultCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation Tabs */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
