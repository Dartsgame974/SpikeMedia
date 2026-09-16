import React from 'react';
import { Search, Radio, Disc, ExternalLink, Box } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenSearch, stats }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#0B0E14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('agents')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF4655] to-[#990011] p-0.5 shadow-lg shadow-[#FF4655]/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0B0E14] rounded-[7px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-[#FF4655]" />
            </div>
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

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#131722] p-1.5 rounded-xl border border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'agents'
                ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Disc className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Agents</span>
          </button>

          <button
            onClick={() => setActiveTab('ui')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'ui'
                ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0 text-[#00F0FF]" />
            <span className="whitespace-nowrap">UI SFX</span>
          </button>

          <button
            onClick={() => setActiveTab('gameassets')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'gameassets'
                ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Box className="w-3.5 h-3.5 shrink-0 text-[#00F0FF]" />
            <span className="whitespace-nowrap">Game Assets</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'community'
                ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Resources</span>
          </button>
        </nav>

        {/* Global Search Trigger & Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#131722] hover:bg-[#1C2230] border border-white/10 text-slate-400 hover:text-slate-200 text-xs transition-colors shrink-0 whitespace-nowrap group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4655] shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Search assets or SFX...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-display text-slate-500 bg-[#0B0E14] rounded border border-white/5 whitespace-nowrap">
              CTRL + K
            </kbd>
          </button>

          {stats && (
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-display text-slate-400 border-l border-white/10 pl-3 shrink-0 whitespace-nowrap">
              <span className="text-[#00F0FF] font-semibold">{stats.agentsCount}</span> Agents
            </div>
          )}
        </div>

      </div>
    </header>
  );
}


