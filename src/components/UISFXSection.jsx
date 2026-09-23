import React, { useState, useMemo, useEffect } from 'react';
import { Radio, Disc, Flame, MapPin, Zap, Shield, Sparkles, Search, X, Filter, Loader2, Volume2 } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';
import { toAssetUrl } from '../utils/urlHelper';

export default function UISFXSection({ uiCategories }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchCategory, setSearchCategory] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const rawCategories = Object.keys(uiCategories || {});
  const totalClipsCount = rawCategories.reduce((acc, cat) => acc + (uiCategories[cat]?.length || 0), 0);

  const filteredCategories = useMemo(() => {
    if (!searchCategory.trim()) return rawCategories;
    return rawCategories.filter(cat => cat.toLowerCase().includes(searchCategory.toLowerCase()));
  }, [rawCategories, searchCategory]);

  const handleSelectCategory = (cat) => {
    if (cat === selectedCategory) return;
    setIsCategoryLoading(true);
    setMobileFilterOpen(false);
    setTimeout(() => {
      setSelectedCategory(cat);
      setTimeout(() => setIsCategoryLoading(false), 150);
    }, 40);
  };

  // Clean Display Names & Icons for Categories
  const getCategoryIcon = (catName) => {
    const l = catName.toLowerCase();
    if (l.includes('spike') || l.includes('bomb')) return Flame;
    if (l.includes('map') || l.includes('bind') || l.includes('canyon') || l.includes('range') || l.includes('jam') || l.includes('summit')) return MapPin;
    if (l.includes('kill') || l.includes('spray') || l.includes('combat')) return Shield;
    if (l.includes('barri') || l.includes('mode') || l.includes('gungame')) return Sparkles;
    return Zap;
  };

  return (
    <section className="space-y-6">
      {/* Title & Description Header Banner */}
      <div className="bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FF4655]" />
            <h2 className="font-display font-extrabold text-2xl text-white">Valorant UI & Map Sound Effects</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Complete audio library featuring Spike plant/defuse timers, map interactive doors and teleporters, Range target dummies, round status, shop buy cues, and game modes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-3.5 py-2 rounded-xl bg-[#131722] border border-white/10 text-white font-display text-xs font-semibold flex items-center gap-2"
          >
            <Filter className="w-4 h-4 text-[#FF4655]" />
            <span>Categories ({rawCategories.length})</span>
          </button>

          <span className="px-3.5 py-1.5 rounded-2xl bg-[#FF4655]/10 border border-[#FF4655]/20 text-[#FF4655] font-display text-xs font-bold shadow-lg shadow-[#FF4655]/10">
            {totalClipsCount} Audio Clips
          </span>
        </div>
      </div>

      {/* Main Container: Left Filter Panel + Right Audio Grid */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Left Filter Navigation Sidebar */}
        <aside
          className={`w-full md:w-72 shrink-0 bg-[#131722] p-5 rounded-3xl border border-white/10 space-y-5 shadow-xl transition-all ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-xs font-display font-bold text-white uppercase tracking-wider">
              <Filter className="w-4 h-4 text-[#00F0FF]" />
              <span>Audio Navigation</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
              {rawCategories.length} Categories
            </span>
          </div>

          {/* Category Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="Search category..."
              className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#0B0E14] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4655]"
            />
            {searchCategory && (
              <button
                onClick={() => setSearchCategory('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Categories Buttons List */}
          <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            <button
              onClick={() => handleSelectCategory('All')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center justify-between ${
                selectedCategory === 'All'
                  ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20 border-l-4 border-white'
                  : 'bg-[#0B0E14]/60 text-slate-300 hover:text-white hover:bg-[#0B0E14] border border-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#00F0FF]" />
                <span>All Categories</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${selectedCategory === 'All' ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'}`}>
                {totalClipsCount}
              </span>
            </button>

            {filteredCategories.map(cat => {
              const IconComp = getCategoryIcon(cat);
              const isActive = selectedCategory === cat;
              const clipsCount = uiCategories[cat]?.length || 0;
              const displayName = cat.replace(/^Maps - /, '').replace(/^Spike - /, '');

              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center justify-between text-left ${
                    isActive
                      ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20 border-l-4 border-[#00F0FF]'
                      : 'bg-[#0B0E14]/60 text-slate-300 hover:text-white hover:bg-[#0B0E14] border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-[#00F0FF]'}`} />
                    <span className="truncate" title={displayName}>{displayName}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] shrink-0 ${isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'}`}>
                    {clipsCount}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Audio Content View */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Active Category Header Bar */}
          <div className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-[#FF4655]" />
              <span className="font-display text-sm font-bold text-white uppercase tracking-wider">
                {selectedCategory === 'All' ? 'All UI & Map Audio Categories' : selectedCategory}
              </span>
            </div>
            {isCategoryLoading && (
              <div className="flex items-center gap-2 text-xs font-display text-[#00F0FF]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading audio clips...</span>
              </div>
            )}
          </div>

          {/* Loading Indicator Spinner */}
          {isCategoryLoading ? (
            <div className="py-20 bg-[#131722] rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-3 text-slate-400 font-display text-xs">
              <Loader2 className="w-8 h-8 text-[#FF4655] animate-spin" />
              <span>Loading category sound effects...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {rawCategories.map(cat => {
                if (selectedCategory !== 'All' && selectedCategory !== cat) return null;

                const clips = uiCategories[cat] || [];
                if (clips.length === 0) return null;

                const IconComp = getCategoryIcon(cat);

                return (
                  <div key={cat} className="space-y-3 bg-[#131722]/80 p-5 rounded-3xl border border-white/5 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <IconComp className="w-4 h-4 text-[#FF4655]" />
                        {cat}
                      </h3>
                      <span className="text-xs font-display text-slate-400">
                        {clips.length} audio clips
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {clips.map((clip, idx) => (
                        <AudioPlayerSlim
                          key={idx}
                          title={clip.name}
                          src={toAssetUrl(clip.relPath)}
                          filename={`UI_${cat.replace(/\s+/g, '_')}_${clip.filename}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
