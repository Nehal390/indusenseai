import React, { useState } from 'react';
import { Sparkles, LogIn, User, Upload, Shield, Database, ChevronDown, Check, Layers } from 'lucide-react';
import { UserProfile, Dataset } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenUpload: () => void;
  user: UserProfile;
  activeDataset: Dataset;
  isDemoMode: boolean;
  onToggleDemoDataset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenUpload,
  user,
  activeDataset,
  isDemoMode,
  onToggleDemoDataset,
}) => {
  const [isDatasetMenuOpen, setIsDatasetMenuOpen] = useState(false);

  // Public navigation tabs when not signed in
  const publicNavItems = [
    { id: 'landing', label: 'Platform Overview' },
    { id: 'transformation', label: 'How It Works' },
    { id: 'audit', label: 'Messy Data Audit' },
  ];

  // Workspace navigation tabs when signed in
  const authenticatedNavItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'explorer', label: 'Explorer' },
    { id: 'search', label: 'AI Search' },
    { id: 'compare', label: 'Compare' },
    { id: 'duplicates', label: 'Duplicate Shield' },
    { id: 'analytics', label: 'Quality & Health' },
    { id: 'copilot', label: 'Copilot' },
  ];

  const handleNavClick = (tabId: string) => {
    if (tabId === 'transformation' || tabId === 'audit') {
      setCurrentTab('landing');
      setTimeout(() => {
        const el = document.getElementById(tabId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    if (!user.isAuthenticated && tabId !== 'landing') {
      onOpenAuth();
      return;
    }

    setCurrentTab(tabId);
  };

  const visibleNavItems = user.isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* ZONE 1: BRAND TITLE (Wordmark, single-line) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2 focus-visible:outline-none"
          >
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-700/80 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight text-zinc-100 whitespace-nowrap">
              INDUSENSE<span className="text-cyan-400">.AI</span>
            </span>
          </button>

          {/* Dataset Status Pill / Switcher */}
          {user.isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setIsDatasetMenuOpen(!isDatasetMenuOpen)}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition ${
                  isDemoMode
                    ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
                title="Active Catalog Repository"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="truncate max-w-[140px] font-medium">
                  {isDemoMode ? 'Demo Catalog' : activeDataset.name}
                </span>
                <span className="text-zinc-500">({activeDataset.products.length})</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {/* Dataset Popover Dropdown */}
              {isDatasetMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 p-2 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl z-50 font-mono text-xs space-y-1">
                  <div className="text-[10px] text-zinc-400 px-2 py-1 uppercase tracking-wider">
                    Select Catalog Workspace
                  </div>
                  
                  <button
                    onClick={() => {
                      if (isDemoMode) onToggleDemoDataset();
                      setIsDatasetMenuOpen(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left transition flex items-center justify-between ${
                      !isDemoMode ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
                    }`}
                  >
                    <div>
                      <div className="text-xs">My Private Catalog</div>
                      <div className="text-[10px] text-zinc-500">Custom user feed</div>
                    </div>
                    {!isDemoMode && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => {
                      if (!isDemoMode) onToggleDemoDataset();
                      setIsDatasetMenuOpen(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left transition flex items-center justify-between ${
                      isDemoMode ? 'bg-zinc-800 text-cyan-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
                    }`}
                  >
                    <div>
                      <div className="text-xs">14-SKU Demo Catalog</div>
                      <div className="text-[10px] text-zinc-500">Trial pre-loaded SKUs</div>
                    </div>
                    {isDemoMode && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ZONE 2: NAVIGATION LINKS (Single-line controls) */}
        <nav className="hidden md:flex items-center gap-1">
          {visibleNavItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ZONE 3: PRIMARY ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          {user.isAuthenticated ? (
            <>
              <button
                onClick={onOpenUpload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition whitespace-nowrap font-mono"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Ingest Catalog</span>
                <span className="sm:hidden">Ingest</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition font-mono whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[110px]">
                  {user.name ? user.name.split(' ')[0] : 'Profile'}
                </span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 transition whitespace-nowrap font-mono"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition whitespace-nowrap font-mono"
              >
                <span>Launch Workspace</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center gap-1 px-4 py-1.5 border-t border-zinc-800/60 overflow-x-auto no-scrollbar">
        {visibleNavItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
