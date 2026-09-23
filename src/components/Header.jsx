import React, { useState } from 'react';
import { Search, Radio, Disc, ExternalLink, Box, Code, Type, Menu, X, Loader2 } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function Header({ activeTab, setActiveTab, isTabSwitching, onOpenSearch, stats }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'agents', label: 'Agents', icon: Disc, color: 'text-white' },
    { id: 'ui', label: 'UI SFX', icon: Radio, color: 'text-[#00F0FF]' },
    { id: 'gameassets', label: 'Game Assets', icon: Box, color: 'text-[#00F0FF]' },
    { id: 'fonts', label: 'Fonts', icon: Type, color: 'text-[#00F0FF]' },
    { id: 'codenames', label: 'Codenames', icon: Code, color: 'text-[#FF4655]' },
    { id: 'community', label: 'Resources', icon: ExternalLink, color: 'text-slate-300' }
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#0B0E14]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => handleSelectTab('agents')}>
          <div className="w-9 h-9 rounded-xl bg-[#131722] border border-white/10 p-1.5 shadow-lg shadow-[#FF4655]/10 flex items-center justify-center shrink-0 hover:border-[#FF4655]/50 transition-colors">
            <img src={toAssetUrl('logo.svg')} alt="Spike Media Logo" className="w-full h-full object-contain" />
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">SPIKE MEDIA</span>
              <span className="text-[9px] sm:text-[10px] font-display uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/20 whitespace-nowrap">
                HUB
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 font-medium whitespace-nowrap">Valorant Asset & Audio Archive</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#131722] p-1.5 rounded-xl border border-white/5 shrink-0">
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && isTabSwitching ? (
                  <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-white" />
                ) : (
                  <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                )}
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Search Trigger & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131722] hover:bg-[#1C2230] border border-white/10 text-slate-400 hover:text-slate-200 text-xs transition-colors shrink-0 whitespace-nowrap group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4655] shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Search...</span>
          </button>

          {stats && (
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-display text-slate-400 border-l border-white/10 pl-3 shrink-0 whitespace-nowrap">
              <span className="text-[#00F0FF] font-semibold">{stats.agentsCount}</span> Agents
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#131722] border border-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF4655]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Horizontal Scrollable Tab Bar */}
      <div className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-[#0B0E14] border-t border-white/5 overflow-x-auto scrollbar-none">
        {navItems.map(item => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/30'
                  : 'bg-[#131722] text-slate-400 border border-white/5'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : item.color}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Full Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131722] border-b border-white/10 p-4 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#FF4655] text-white shadow-lg'
                      : 'bg-[#0B0E14] text-slate-300 border border-white/5 hover:border-white/20'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}


