import React, { useState, useMemo, useDeferredValue, useTransition } from 'react';
import { Radio, Disc, Flame, MapPin, Zap, Shield, Sparkles, Search, ChevronDown, Loader2 } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';
import { toAssetUrl } from '../utils/urlHelper';

export default function UISFXSection({ uiCategories }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGroup, setActiveGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [isPending, startTransition] = useTransition();

  const [visibleCounts, setVisibleCounts] = useState({});

  const rawCategories = useMemo(() => Object.keys(uiCategories || {}), [uiCategories]);
  
  const totalClipsCount = useMemo(() => {
    return rawCategories.reduce((acc, cat) => acc + (uiCategories[cat]?.length || 0), 0);
  }, [rawCategories, uiCategories]);

  // Group definitions for high level filtering
  const groups = useMemo(() => [
    { id: 'All', label: 'All Audio' },
    { id: 'Spike', label: 'Spike & Bomb' },
    { id: 'Maps', label: 'Map Interactive SFX' },
    { id: 'Modes', label: 'Game Modes' },
    { id: 'Combat', label: 'Combat & UI' },
  ], []);

  const getCategoryIcon = (catName) => {
    const l = catName.toLowerCase();
    if (l.includes('spike') || l.includes('bomb')) return Flame;
    if (l.includes('map') || l.includes('bind') || l.includes('canyon') || l.includes('range') || l.includes('jam') || l.includes('summit')) return MapPin;
    if (l.includes('kill') || l.includes('spray') || l.includes('combat')) return Shield;
    if (l.includes('barri') || l.includes('mode') || l.includes('gungame')) return Sparkles;
    return Zap;
  };

  // Filter categories by active group & search query
  const filteredCategories = useMemo(() => {
    return rawCategories.filter(cat => {
      const catLower = cat.toLowerCase();
      
      // Group check
      if (activeGroup === 'Spike' && !catLower.includes('spike')) return false;
      if (activeGroup === 'Maps' && !catLower.includes('maps')) return false;
      if (activeGroup === 'Modes' && (!catLower.includes('mode') && !catLower.includes('escalat') && !catLower.includes('gungame'))) return false;
      if (activeGroup === 'Combat' && (catLower.includes('spike') || catLower.includes('maps'))) return false;

      // Category check
      if (selectedCategory !== 'All' && selectedCategory !== cat) return false;

      // Search query check
      if (deferredSearch.trim()) {
        const query = deferredSearch.toLowerCase().trim();
        const matchesCat = catLower.includes(query);
        const matchesClips = (uiCategories[cat] || []).some(clip => clip.name.toLowerCase().includes(query) || clip.filename.toLowerCase().includes(query));
        return matchesCat || matchesClips;
      }

      return true;
    });
  }, [rawCategories, activeGroup, selectedCategory, deferredSearch, uiCategories]);

  const handleGroupSelect = (groupId) => {
    startTransition(() => {
      setActiveGroup(groupId);
      setSelectedCategory('All');
    });
  };

  const handleCategorySelect = (catName) => {
    startTransition(() => {
      setSelectedCategory(catName);
    });
  };

  const loadMoreClips = (catName) => {
    setVisibleCounts(prev => ({
      ...prev,
      [catName]: (prev[catName] || 20) + 30
    }));
  };

  return (
    <section className="space-y-6">
      {/* Title & Description Header */}
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
          <span className="px-3.5 py-1.5 rounded-2xl bg-[#FF4655]/10 border border-[#FF4655]/20 text-[#FF4655] font-display text-xs font-bold shadow-lg shadow-[#FF4655]/10">
            {totalClipsCount} Audio Clips Indexed
          </span>
        </div>
      </div>

      {/* Control Bar: High-level Group Tabs & Search Bar */}
      <div className="bg-[#131722] p-4 rounded-2xl border border-white/5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Group Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {groups.map(grp => (
              <button
                key={grp.id}
                onClick={() => handleGroupSelect(grp.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all whitespace-nowrap ${
                  activeGroup === grp.id
                    ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                    : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>

          {/* Realtime Instant Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audio clips (e.g. Spike, Plant, Door, Teleport)..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B0E14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
            />
          </div>
        </div>

        {/* Sub-Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20 font-bold'
                : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <span>All Subcategories</span>
          </button>

          {rawCategories.map(cat => {
            const isActive = selectedCategory === cat;
            const clipsCount = uiCategories[cat]?.length || 0;
            const displayName = cat.replace(/^Maps - /, '').replace(/^Spike - /, '');

            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#00F0FF] text-black shadow-md shadow-[#00F0FF]/20 font-bold'
                    : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{displayName}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/5 text-slate-400'}`}>
                  {clipsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Playlists Grid with Lazy Chunk Limit */}
      {isPending && (
        <div className="flex items-center justify-center gap-2.5 p-3 bg-[#131722] rounded-xl border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-display font-semibold animate-pulse shadow-lg shadow-[#00F0FF]/10">
          <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF]" />
          <span>Updating audio catalog view...</span>
        </div>
      )}

      <div className={`space-y-6 transition-opacity duration-200 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
        {filteredCategories.length === 0 ? (
          <div className="bg-[#131722]/60 p-12 rounded-2xl border border-white/5 text-center space-y-2">
            <Radio className="w-8 h-8 text-slate-500 mx-auto opacity-50" />
            <p className="text-sm text-slate-300 font-medium">No matching sound effects found</p>
            <p className="text-xs text-slate-500">Try adjusting your search terms or group filters.</p>
          </div>
        ) : (
          filteredCategories.map(cat => {
            let clips = uiCategories[cat] || [];
            
            // Filter clips by search query if active
            if (deferredSearch.trim()) {
              const query = deferredSearch.toLowerCase().trim();
              clips = clips.filter(c => c.name.toLowerCase().includes(query) || c.filename.toLowerCase().includes(query));
            }

            if (clips.length === 0) return null;

            const IconComp = getCategoryIcon(cat);
            const currentLimit = visibleCounts[cat] || 20;
            const displayedClips = clips.slice(0, currentLimit);
            const hasMore = clips.length > currentLimit;

            return (
              <div key={cat} className="space-y-3 bg-[#131722]/60 p-5 rounded-2xl border border-white/5 shadow-md">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <IconComp className="w-4 h-4 text-[#FF4655]" />
                    {cat}
                  </h3>
                  <span className="text-xs font-display text-slate-400">
                    Showing {displayedClips.length} of {clips.length} clips
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {displayedClips.map((clip, idx) => (
                    <AudioPlayerSlim
                      key={`${cat}-${clip.filename}-${idx}`}
                      title={clip.name}
                      src={toAssetUrl(clip.relPath)}
                      filename={`UI_${cat.replace(/\s+/g, '_')}_${clip.filename}`}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => loadMoreClips(cat)}
                      className="px-4 py-2 bg-[#0B0E14] hover:bg-white/10 text-xs text-[#00F0FF] border border-[#00F0FF]/30 hover:border-[#00F0FF] rounded-xl font-display font-semibold transition-all inline-flex items-center gap-1.5 shadow-md"
                    >
                      <span>Show more audio clips ({clips.length - currentLimit} remaining)</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
