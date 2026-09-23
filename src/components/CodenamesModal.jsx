import React, { useState, useEffect } from 'react';
import { X, Search, Code, Shield, Crosshair, Box, Layers, Copy, Check, MapPin, Gamepad2 } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function CodenamesModal({ onClose }) {
  const [data, setData] = useState({ agents: [], weapons: [], maps: [], bundles: [], gameModes: [], skins: [] });
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('agents'); // 'agents', 'weapons', 'maps', 'bundles', 'gamemodes', 'skins'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetch(toAssetUrl('codenames.json'))
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load codenames.json:', err);
        setLoading(false);
      });
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const query = searchQuery.toLowerCase().trim();

  const filteredAgents = (data.agents || []).filter(a => 
    !query || a.displayName.toLowerCase().includes(query) || a.developerName.toLowerCase().includes(query) || (a.role && a.role.toLowerCase().includes(query))
  );

  const filteredMaps = (data.maps || []).filter(m =>
    !query || m.displayName.toLowerCase().includes(query) || m.developerName.toLowerCase().includes(query)
  );

  const filteredWeapons = (data.weapons || []).filter(w => 
    !query || w.displayName.toLowerCase().includes(query) || w.codename.toLowerCase().includes(query) || (w.category && w.category.toLowerCase().includes(query))
  );

  const filteredBundles = (data.bundles || []).filter(b => 
    !query || b.displayName.toLowerCase().includes(query) || b.codename.toLowerCase().includes(query)
  );

  const filteredGameModes = (data.gameModes || []).filter(gm =>
    !query || gm.displayName.toLowerCase().includes(query) || (gm.developerName && gm.developerName.toLowerCase().includes(query)) || (gm.description && gm.description.toLowerCase().includes(query))
  );

  const filteredSkins = (data.skins || []).filter(s => 
    !query || s.displayName.toLowerCase().includes(query) || s.codename.toLowerCase().includes(query) || (s.theme && s.theme.toLowerCase().includes(query))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0B0E14] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF4655]/10 border border-[#FF4655]/20 flex items-center justify-center text-[#FF4655]">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-white">Valorant Codenames Index</h2>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 font-display">
                  Developer Names
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official internal codenames mapped to real English Valorant display names.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs Controls */}
        <div className="p-4 border-b border-white/5 bg-[#131722]/50 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by codename or English display name (e.g., Bomb, QuickBomb, GunGame, HURM, Canyon, Fracture, Duality, Odin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0E14] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>

          {/* Sub Tab Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setActiveSubTab('agents')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSubTab === 'agents'
                  ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Agents ({filteredAgents.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('maps')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSubTab === 'maps'
                  ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Maps ({filteredMaps.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('gamemodes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSubTab === 'gamemodes'
                  ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Game Modes ({filteredGameModes.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('bundles')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSubTab === 'bundles'
                  ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Bundles ({filteredBundles.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('weapons')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSubTab === 'weapons'
                  ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Weapons ({filteredWeapons.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('skins')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSubTab === 'skins'
                  ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Skins Preview ({filteredSkins.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading codenames index...</div>
          ) : (
            <>
              {/* AGENTS TAB */}
              {activeSubTab === 'agents' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredAgents.map((agent, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#131722] border border-white/5 hover:border-[#FF4655]/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {agent.displayIcon ? (
                          <img src={agent.displayIcon} alt="" className="w-10 h-10 rounded-xl object-cover bg-white/5 p-1 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                            {agent.displayName.slice(0, 2)}
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="font-display font-bold text-sm text-white truncate">{agent.displayName}</h4>
                          <p className="text-[11px] font-mono text-[#00F0FF] font-semibold truncate">
                            {agent.developerName}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(agent.developerName)}
                        title="Copy developer codename"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {copiedCode === agent.developerName ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* MAPS TAB */}
              {activeSubTab === 'maps' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredMaps.map((mapItem, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#131722] border border-white/5 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {mapItem.displayIcon ? (
                          <img src={mapItem.displayIcon} alt="" className="w-10 h-10 rounded-xl object-cover bg-black/40 p-1 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                            {mapItem.displayName.slice(0, 2)}
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="font-display font-bold text-sm text-white truncate">{mapItem.displayName}</h4>
                          <span className="text-[11px] font-mono text-emerald-400 font-semibold block truncate">
                            {mapItem.developerName}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(mapItem.developerName)}
                        title="Copy map codename"
                        className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500 text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {copiedCode === mapItem.developerName ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* GAME MODES TAB */}
              {activeSubTab === 'gamemodes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredGameModes.map((gm, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#131722] border border-white/5 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {gm.displayIcon ? (
                          <img src={gm.displayIcon} alt="" className="w-10 h-10 rounded-xl object-contain bg-black/40 p-1 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                            {gm.displayName.slice(0, 2)}
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="font-display font-bold text-sm text-white truncate">{gm.displayName}</h4>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-mono text-amber-400 font-semibold block truncate">
                              {gm.developerName}
                            </span>
                            {gm.duration && (
                              <span className="text-[9px] uppercase font-display text-slate-400 bg-white/5 px-1 py-0.5 rounded border border-white/5">
                                {gm.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(gm.developerName)}
                        title="Copy game mode codename"
                        className="p-2 rounded-lg bg-white/5 hover:bg-amber-500 text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {copiedCode === gm.developerName ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* BUNDLES TAB */}
              {activeSubTab === 'bundles' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredBundles.map((b, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#131722] border border-white/5 hover:border-[#FF4655]/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {b.displayIcon ? (
                          <img src={b.displayIcon} alt="" className="w-10 h-10 rounded-xl object-cover bg-black/40 p-1 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                            {b.displayName.slice(0, 2)}
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="font-display font-bold text-sm text-white truncate">{b.displayName}</h4>
                          <span className="text-[11px] font-mono text-[#00F0FF] font-semibold block truncate">
                            {b.codename}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(b.codename)}
                        title="Copy bundle codename"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {copiedCode === b.codename ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* WEAPONS TAB */}
              {activeSubTab === 'weapons' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredWeapons.map((w, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#131722] border border-white/5 hover:border-[#FF4655]/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {w.displayIcon ? (
                          <img src={w.displayIcon} alt="" className="w-12 h-8 object-contain bg-black/40 p-1 rounded-lg shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                            {w.displayName.slice(0, 2)}
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="font-display font-bold text-sm text-white truncate">{w.displayName}</h4>
                          <span className="text-[11px] font-mono text-[#00F0FF] font-semibold block truncate">
                            {w.codename}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(w.codename)}
                        title="Copy weapon codename"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {copiedCode === w.codename ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* SKINS TAB */}
              {activeSubTab === 'skins' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredSkins.map((s, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#131722] border border-white/5 hover:border-[#FF4655]/40 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {s.displayIcon ? (
                          <img src={s.displayIcon} alt="" className="w-12 h-8 object-contain bg-black/40 p-1 rounded-lg shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                            {s.displayName.slice(0, 2)}
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="font-display font-bold text-sm text-white truncate">{s.displayName}</h4>
                          <span className="text-[11px] font-mono text-[#00F0FF] font-semibold block truncate">
                            {s.codename}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(s.codename)}
                        title="Copy skin codename"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {copiedCode === s.codename ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
