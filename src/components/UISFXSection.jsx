import React, { useState } from 'react';
import { Radio, Search, Disc, Filter, Sparkles, Zap, Flame, MapPin, Shield } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';
import { toAssetUrl } from '../utils/urlHelper';

export default function UISFXSection({ uiCategories }) {
  const [selectedGroup, setSelectedGroup] = useState('All'); // 'All', 'Spike', 'Maps', 'Interface', 'Combat', 'Modes'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const rawCategories = Object.keys(uiCategories || {});

  // Grouping logic for categories
  const GROUPS = [
    { id: 'All', name: 'All SFX', icon: Disc },
    { id: 'Spike', name: 'Spike & Bomb (Plant/Defuse)', icon: Flame },
    { id: 'Maps', name: 'Map Events (Portals, Doors, Range)', icon: MapPin },
    { id: 'Interface', name: 'UI & Menus (Shop, HUD, Cues)', icon: Zap },
    { id: 'Combat', name: 'Kills & Combat (Sprays, Fall)', icon: Shield },
    { id: 'Modes', name: 'Game Modes & Barriers', icon: Sparkles },
  ];

  const matchesGroup = (catName, groupId) => {
    if (groupId === 'All') return true;
    const catLower = catName.toLowerCase();
    if (groupId === 'Spike') return catLower.includes('spike') || catLower.includes('bomb');
    if (groupId === 'Maps') return catLower.includes('maps') || catLower.includes('bind') || catLower.includes('canyon') || catLower.includes('range') || catLower.includes('jam') || catLower.includes('summit');
    if (groupId === 'Interface') return ['aftergame', 'bip', 'confirmation', 'error', 'hovering', 'inventory', 'loading screen', 'match found', 'notifications', 'ping', 'playerbanners join', 'round', 'select agent menu', 'shop in game', 'shopmenu'].some(k => catLower.includes(k));
    if (groupId === 'Combat') return ['kill', 'flexes & spray', 'enemy', 'fall damage', 'leveling', 'commons abilitys', 'weapons', 'win & loose'].some(k => catLower.includes(k));
    if (groupId === 'Modes') return catLower.includes('barri') || catLower.includes('mode') || catLower.includes('gungame');
    return true;
  };

  const groupCategories = rawCategories.filter(cat => matchesGroup(cat, selectedGroup));

  const totalClipsCount = rawCategories.reduce((acc, cat) => acc + (uiCategories[cat]?.length || 0), 0);

  return (
    <section className="space-y-6">
      {/* Title & Description Header */}
      <div className="bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FF4655]" />
            <h2 className="font-display font-extrabold text-2xl text-white">General UI & Map Sound Effects</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Complete Valorant sound library featuring Spike plant/defuse timers, map interactive doors and teleporters, Range targets, round status, shop buy cues, and game modes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3.5 py-1.5 rounded-2xl bg-[#FF4655]/10 border border-[#FF4655]/20 text-[#FF4655] font-display text-xs font-bold shadow-lg shadow-[#FF4655]/10">
            {totalClipsCount} Audio Clips Indexed
          </span>
        </div>
      </div>

      {/* Control Bar: Main Group Filter Tabs + Search */}
      <div className="bg-[#131722] p-4 rounded-2xl border border-white/5 space-y-4">
        {/* Main Group Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {GROUPS.map(grp => {
            const IconComp = grp.icon;
            const isActive = selectedGroup === grp.id;
            const groupClipsCount = rawCategories
              .filter(cat => matchesGroup(cat, grp.id))
              .reduce((acc, cat) => acc + (uiCategories[cat]?.length || 0), 0);

            return (
              <button
                key={grp.id}
                onClick={() => {
                  setSelectedGroup(grp.id);
                  setSelectedCategory('All');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                    : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#00F0FF]'}`} />
                <span>{grp.name}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'}`}>
                  {groupClipsCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Sub-category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SFX by clip name or keyword (e.g. Spike, Plant, Defuse, Portal, Door, Range)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0E14] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>

          {/* Sub-category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 py-0.5">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              All Categories ({groupCategories.length})
            </button>
            {groupCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                    : 'bg-[#0B0E14] text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat.replace(/^Maps - /, '').replace(/^Spike - /, '')} ({uiCategories[cat]?.length || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Playlists List */}
      <div className="space-y-6">
        {groupCategories.map(cat => {
          if (selectedCategory !== 'All' && selectedCategory !== cat) return null;

          const rawClips = uiCategories[cat] || [];
          const filteredClips = rawClips.filter(c =>
            !searchQuery ||
            (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (c.filename && c.filename.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          if (filteredClips.length === 0) return null;

          return (
            <div key={cat} className="space-y-3 bg-[#131722]/60 p-5 rounded-2xl border border-white/5 shadow-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Disc className="w-4 h-4 text-[#FF4655]" />
                  {cat}
                </h3>
                <span className="text-xs font-display text-slate-400">
                  {filteredClips.length} audio clips
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filteredClips.map((clip, idx) => (
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
    </section>
  );
}

