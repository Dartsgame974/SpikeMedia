import React, { useState } from 'react';
import { Radio, Disc, Flame, MapPin, Zap, Shield, Sparkles } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';
import { toAssetUrl } from '../utils/urlHelper';

export default function UISFXSection({ uiCategories }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const rawCategories = Object.keys(uiCategories || {});
  const totalClipsCount = rawCategories.reduce((acc, cat) => acc + (uiCategories[cat]?.length || 0), 0);

  // Clean Display Names for Categories
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

      {/* Clean Category Navigation Pills Bar */}
      <div className="bg-[#131722] p-4 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Disc className="w-4 h-4 text-[#00F0FF]" /> Audio Categories ({rawCategories.length})
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
            }`}
          >
            <span>All Categories</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${selectedCategory === 'All' ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'}`}>
              {totalClipsCount}
            </span>
          </button>

          {rawCategories.map(cat => {
            const IconComp = getCategoryIcon(cat);
            const isActive = selectedCategory === cat;
            const clipsCount = uiCategories[cat]?.length || 0;
            const displayName = cat.replace(/^Maps - /, '').replace(/^Spike - /, '');

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                    : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#00F0FF]'}`} />
                <span>{displayName}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'}`}>
                  {clipsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Playlists List */}
      <div className="space-y-6">
        {rawCategories.map(cat => {
          if (selectedCategory !== 'All' && selectedCategory !== cat) return null;

          const clips = uiCategories[cat] || [];
          if (clips.length === 0) return null;

          const IconComp = getCategoryIcon(cat);

          return (
            <div key={cat} className="space-y-3 bg-[#131722]/60 p-5 rounded-2xl border border-white/5 shadow-md">
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
    </section>
  );
}

