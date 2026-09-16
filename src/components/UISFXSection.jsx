import React, { useState } from 'react';
import { Radio, Search, Disc } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';

export default function UISFXSection({ uiCategories }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Object.keys(uiCategories || {});

  const totalClipsCount = categories.reduce((acc, cat) => acc + (uiCategories[cat]?.length || 0), 0);

  return (
    <section className="space-y-6">
      {/* Title & Description Header */}
      <div className="bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FF4655]" />
            <h2 className="font-display font-extrabold text-2xl text-white">General UI Sound Effects</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Complete collection of Valorant interface sounds including Spike plant/defuse, Kill alerts, Round status, Shop buy cues, menu interactions, and announcements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1 rounded-full bg-[#FF4655]/10 border border-[#FF4655]/20 text-[#FF4655] font-display text-xs font-bold">
            {totalClipsCount} Indexed Audio Clips
          </span>
        </div>
      </div>

      {/* Filters & Local Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#131722] p-3 rounded-2xl border border-white/5">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search UI sound effects..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0B0E14] border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#FF4655] transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#FF4655] text-white'
                : 'bg-[#0B0E14] text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            All Categories ({categories.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FF4655] text-white'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {cat} ({uiCategories[cat]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Audio Playlists List */}
      <div className="space-y-6">
        {categories.map(cat => {
          if (selectedCategory !== 'All' && selectedCategory !== cat) return null;

          const rawClips = uiCategories[cat] || [];
          const filteredClips = rawClips.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.filename.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredClips.length === 0) return null;

          return (
            <div key={cat} className="space-y-3 bg-[#131722]/60 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="font-display text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Disc className="w-4 h-4 text-[#00F0FF]" />
                  {cat}
                </h3>
                <span className="text-xs font-display text-slate-400">
                  {filteredClips.length} clips
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filteredClips.map((clip, idx) => (
                  <AudioPlayerSlim
                    key={idx}
                    title={clip.name}
                    src={`/${clip.relPath}`}
                    filename={`UI_${cat}_${clip.filename}`}
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

