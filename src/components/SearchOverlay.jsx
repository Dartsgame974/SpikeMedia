import React, { useState, useEffect } from 'react';
import { Search, X, Disc, User, Volume2, Image, ChevronRight } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';

export default function SearchOverlay({ isOpen, onClose, registry, onSelectAgent }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const agents = registry?.agents || [];
  const uiCategories = registry?.uiCategories || {};

  const matchingAgents = query.trim()
    ? agents.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || (a.role && a.role.toLowerCase().includes(query.toLowerCase())))
    : [];

  // Match UI SFX clips
  const matchingSfx = [];
  if (query.trim().length >= 2) {
    Object.keys(uiCategories).forEach(cat => {
      uiCategories[cat].forEach(clip => {
        if (clip.name.toLowerCase().includes(query.toLowerCase())) {
          matchingSfx.push({ category: cat, ...clip });
        }
      });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-[#0B0E14]/80 backdrop-blur-xl">
      <div className="w-full max-w-3xl bg-[#131722] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#0F141C]">
          <Search className="w-5 h-5 text-[#FF4655] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type agent name, role, or SFX title (e.g., 'Jett', 'Spike', 'Headshot')..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-2 py-1 text-xs font-display text-slate-400 hover:text-white bg-white/5 rounded border border-white/5">
            ESC
          </button>
        </div>

        {/* Search Results Container */}
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          {!query.trim() && (
            <div className="text-center py-12 space-y-2 text-slate-500 font-display text-xs">
              <p>Type to search across <span className="text-slate-300 font-semibold">{agents.length} Agents</span> and hundreds of audio assets.</p>
            </div>
          )}

          {/* Agents Results */}
          {matchingAgents.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF4655]" />
                Agents ({matchingAgents.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingAgents.map(agent => (
                  <div
                    key={agent.name}
                    onClick={() => {
                      onSelectAgent(agent);
                      onClose();
                    }}
                    className="p-3 bg-[#0B0E14] hover:bg-[#1C2230] border border-white/5 hover:border-[#FF4655]/40 rounded-xl cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {agent.assets?.squareIcon ? (
                        <img src={`/${agent.assets.squareIcon}`} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-slate-400">
                          {agent.name.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <p className="font-display font-bold text-sm text-white group-hover:text-[#FF4655] transition-colors">
                          {agent.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{agent.role || 'Agent'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF4655] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SFX Results */}
          {matchingSfx.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-display font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#00F0FF]" />
                Sound Effects ({matchingSfx.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {matchingSfx.slice(0, 10).map((clip, idx) => (
                  <AudioPlayerSlim
                    key={idx}
                    title={`[${clip.category}] ${clip.name}`}
                    src={`/${clip.relPath}`}
                    filename={`${clip.category}_${clip.filename}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
