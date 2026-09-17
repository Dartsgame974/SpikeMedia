import React, { useState } from 'react';
import { Search, Radio, Disc, ExternalLink, Box, Code, Menu, X, ChevronRight, Film } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function Header({ activeTab, setActiveTab, onOpenSearch, stats }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'agents', label: 'Agents', icon: Disc, color: 'text-white' },
    { id: 'ui', label: 'UI SFX', icon: Radio, color: 'text-[#00F0FF]' },
    { id: 'gameassets', label: 'Game Assets', icon: Box, color: 'text-[#00F0FF]' },
    { id: 'showcase', label: 'Motion Showcase', icon: Film, color: 'text-[#FF4655]' },
    { id: 'codenames', label: 'Codenames', icon: Code, color: 'text-[#FF4655]' },
    { id: 'community', label: 'Resources', icon: ExternalLink, color: 'text-slate-300' },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#0B0E14]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleNavClick('agents')}>
          <div className="w-10 h-10 rounded-xl bg-[#131722] border border-white/10 p-1.5 shadow-lg shadow-[#FF4655]/10 flex items-center justify-center shrink-0 hover:border-[#FF4655]/50 transition-colors">
            <img src={toAssetUrl('logo.svg')} alt="Spike Media Logo" className="w-full h-full object-contain" />
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap">SPIKE MEDIA</span>
              <span className="text-[10px] font-display uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/20 whitespace-nowrap">
                HUB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Valorant Asset & Audio Archive</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#131722] p-1.5 rounded-xl border border-white/5 shrink-0">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Search Trigger, Mobile Menu Toggle & Stats */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1C2230] border border-white/10 text-slate-400 hover:text-slate-200 text-xs transition-colors shrink-0 whitespace-nowrap group"
            title="Search assets or SFX"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4655] shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Search assets or SFX...</span>
            <span className="inline sm:hidden font-medium text-[11px]">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-display text-slate-500 bg-[#0B0E14] rounded border border-white/5 whitespace-nowrap">
              CTRL + K
            </kbd>
          </button>

          {stats && (
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-display text-slate-400 border-l border-white/10 pl-3 shrink-0 whitespace-nowrap">
              <span className="text-[#00F0FF] font-semibold">{stats.agentsCount}</span> Agents
            </div>
          )}

          {/* Mobile Hamburger Navigation Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#131722] border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#FF4655]" /> : <Menu className="w-5 h-5 text-[#00F0FF]" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0F141C] p-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-400 px-2 pb-1">
            Navigation Menu
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
                    isActive
                      ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20'
                      : 'bg-[#131722] text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
