import React, { useState, useEffect } from 'react';
import { Search, Code, Shield, Crosshair, Box, Layers, Copy, Check, MapPin, Gamepad2, Loader2 } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function CodenamesSection({ registry }) {
  const [codenamesData, setCodenamesData] = useState({ agents: [], weapons: [], maps: [], bundles: [], gameModes: [], skins: [] });
  const [loading, setLoading] = useState(true);
  const [isSubTabLoading, setIsSubTabLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('agents'); // 'agents', 'weapons', 'maps', 'bundles', 'gamemodes', 'skins'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const handleSelectSubTab = (tab) => {
    if (tab === activeSubTab) return;
    setIsSubTabLoading(true);
    setActiveSubTab(tab);
    setTimeout(() => setIsSubTabLoading(false), 200);
  };

  useEffect(() => {
    fetch(toAssetUrl('codenames.json'))
      .then(res => res.json())
      .then(json => {
        setCodenamesData(json);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load codenames.json:', err);
        setLoading(false);
      });
  }, []);

  const handleCopy = (text, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const query = searchQuery.toLowerCase().trim();

  // Combine local registry agent data with codenames database if available
  const registryAgents = registry?.agents || [];
  const agentsList = (codenamesData.agents && codenamesData.agents.length > 0)
    ? codenamesData.agents
    : registryAgents.map(a => ({
        developerName: a.developerName || a.id,
        displayName: a.name,
        role: a.role,
        displayIcon: a.assets?.squareIcon ? toAssetUrl(a.assets.squareIcon) : null
      }));

  const filteredAgents = agentsList.filter(a => 
    !query || a.displayName.toLowerCase().includes(query) || (a.developerName && a.developerName.toLowerCase().includes(query)) || (a.role && a.role.toLowerCase().includes(query))
  );

  const filteredMaps = (codenamesData.maps || []).filter(m =>
    !query || m.displayName.toLowerCase().includes(query) || (m.developerName && m.developerName.toLowerCase().includes(query))
  );

  const filteredWeapons = (codenamesData.weapons || []).filter(w => 
    !query || w.displayName.toLowerCase().includes(query) || w.codename.toLowerCase().includes(query) || (w.category && w.category.toLowerCase().includes(query))
  );

  const filteredBundles = (codenamesData.bundles || []).filter(b => 
    !query || b.displayName.toLowerCase().includes(query) || b.codename.toLowerCase().includes(query)
  );

  const filteredGameModes = (codenamesData.gameModes || []).filter(gm =>
    !query || gm.displayName.toLowerCase().includes(query) || (gm.developerName && gm.developerName.toLowerCase().includes(query)) || (gm.description && gm.description.toLowerCase().includes(query))
  );

  const filteredSkins = (codenamesData.skins || []).filter(s => 
    !query || s.displayName.toLowerCase().includes(query) || s.codename.toLowerCase().includes(query) || (s.theme && s.theme.toLowerCase().includes(query))
  );

  return (
    <section className="space-y-6">
      {/* Title Header Banner */}
      <div className="bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230] p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF4655]/10 border border-[#FF4655]/20 flex items-center justify-center text-[#FF4655]">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-2xl text-white">Valorant Codenames Index</h2>
                <span className="text-[10px] font-display uppercase tracking-widest px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
                  Developer Names
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                Complete mapping between Valorant internal developer codenames and official English display names for Agents, Maps, Game Modes, Weapons, Bundles, and Skins.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-[#0B0E14] px-4 py-2.5 rounded-2xl border border-white/5 text-xs text-slate-300">
          <div>
            <span className="text-[#FF4655] font-bold text-sm block">{agentsList.length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-display">Agents</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <span className="text-emerald-400 font-bold text-sm block">{(codenamesData.maps || []).length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-display">Maps</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <span className="text-amber-400 font-bold text-sm block">{(codenamesData.gameModes || []).length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-display">Game Modes</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <span className="text-[#00F0FF] font-bold text-sm block">{(codenamesData.bundles || []).length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-display">Bundles</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <span className="text-purple-400 font-bold text-sm block">{(codenamesData.weapons || []).length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-display">Weapons</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Sub-tabs */}
      <div className="bg-[#131722] p-4 rounded-2xl border border-white/5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by developer codename or English display name (e.g. Bomb, QuickBomb, GunGame, HURM, Canyon, Fracture, Duality, Aggrobot, Odin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0E14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4655] transition-colors"
          />
        </div>

        {/* Sub Tab Navigation Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => handleSelectSubTab('agents')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'agents'
                ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20'
                : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Agents ({filteredAgents.length})</span>
          </button>

          <button
            onClick={() => handleSelectSubTab('maps')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'maps'
                ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20'
                : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Maps ({filteredMaps.length})</span>
          </button>

          <button
            onClick={() => handleSelectSubTab('gamemodes')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'gamemodes'
                ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20'
                : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>Game Modes ({filteredGameModes.length})</span>
          </button>

          <button
            onClick={() => handleSelectSubTab('bundles')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'bundles'
                ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20'
                : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-[#00F0FF]" />
            <span>Bundles ({filteredBundles.length})</span>
          </button>

          <button
            onClick={() => handleSelectSubTab('weapons')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'weapons'
                ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20'
                : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Crosshair className="w-4 h-4 text-[#00F0FF]" />
            <span>Weapons ({filteredWeapons.length})</span>
          </button>

          <button
            onClick={() => handleSelectSubTab('skins')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeSubTab === 'skins'
                ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/20'
                : 'bg-[#0B0E14] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Skins Index ({filteredSkins.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {loading || isSubTabLoading ? (
        <div className="py-20 bg-[#131722] rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-3 text-slate-400 font-display text-xs">
          <Loader2 className="w-8 h-8 text-[#FF4655] animate-spin" />
          <span>Loading codenames data...</span>
        </div>
      ) : (
        <>
          {/* 1. AGENTS TAB */}
          {activeSubTab === 'agents' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAgents.map((agent, idx) => (
                <div 
                  key={idx}
                  className="bg-[#131722] p-4 rounded-2xl border border-white/5 hover:border-[#FF4655]/40 transition-all flex items-center justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {agent.displayIcon ? (
                      <img src={agent.displayIcon} alt="" className="w-12 h-12 rounded-xl object-cover bg-[#0B0E14] p-1 border border-white/5 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#0B0E14] border border-white/5 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">
                        {agent.displayName.slice(0, 2)}
                      </div>
                    )}
                    <div className="space-y-0.5 truncate">
                      <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-[#FF4655] transition-colors">
                        {agent.displayName}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/20 truncate font-semibold">
                          {agent.developerName}
                        </span>
                        {agent.role && (
                          <span className="text-[9px] uppercase font-display text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                            {agent.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopy(agent.developerName, e)}
                    title="Copy developer codename"
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#FF4655] text-slate-400 hover:text-white transition-colors shrink-0"
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

          {/* 2. MAPS TAB */}
          {activeSubTab === 'maps' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMaps.map((mapItem, idx) => (
                <div 
                  key={idx}
                  className="bg-[#131722] p-4 rounded-2xl border border-white/5 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {mapItem.displayIcon ? (
                      <img src={mapItem.displayIcon} alt="" className="w-12 h-12 rounded-xl object-cover bg-[#0B0E14] p-1 border border-white/5 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#0B0E14] border border-white/5 flex items-center justify-center text-[#00F0FF] font-bold text-sm shrink-0">
                        {mapItem.displayName.slice(0, 2)}
                      </div>
                    )}
                    <div className="space-y-0.5 truncate">
                      <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
                        {mapItem.displayName}
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 truncate font-semibold inline-block">
                        {mapItem.developerName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopy(mapItem.developerName, e)}
                    title="Copy map codename"
                    className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500 text-slate-400 hover:text-white transition-colors shrink-0"
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

          {/* 3. GAME MODES TAB */}
          {activeSubTab === 'gamemodes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGameModes.map((gm, idx) => (
                <div 
                  key={idx}
                  className="bg-[#131722] p-4 rounded-2xl border border-white/5 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {gm.displayIcon ? (
                      <img src={gm.displayIcon} alt="" className="w-12 h-12 rounded-xl object-contain bg-[#0B0E14] p-1 border border-white/5 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#0B0E14] border border-white/5 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                        {gm.displayName.slice(0, 2)}
                      </div>
                    )}
                    <div className="space-y-0.5 truncate">
                      <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-amber-400 transition-colors" title={gm.displayName}>
                        {gm.displayName}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 truncate font-semibold inline-block">
                          {gm.developerName}
                        </span>
                        {gm.duration && (
                          <span className="text-[9px] font-display uppercase text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                            {gm.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopy(gm.developerName, e)}
                    title="Copy game mode codename"
                    className="p-2 rounded-xl bg-white/5 hover:bg-amber-500 text-slate-400 hover:text-white transition-colors shrink-0"
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

          {/* 4. BUNDLES TAB */}
          {activeSubTab === 'bundles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBundles.map((b, idx) => (
                <div 
                  key={idx}
                  className="bg-[#131722] p-4 rounded-2xl border border-white/5 hover:border-[#FF4655]/40 transition-all flex items-center justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {b.displayIcon ? (
                      <img src={b.displayIcon} alt="" className="w-12 h-12 rounded-xl object-contain bg-[#0B0E14] p-1 border border-white/5 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#0B0E14] border border-white/5 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">
                        {b.displayName.slice(0, 2)}
                      </div>
                    )}
                    <div className="space-y-0.5 truncate">
                      <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-[#FF4655] transition-colors" title={b.displayName}>
                        {b.displayName}
                      </h4>
                      <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/20 truncate font-semibold inline-block">
                        {b.codename}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopy(b.codename, e)}
                    title="Copy bundle codename"
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#FF4655] text-slate-400 hover:text-white transition-colors shrink-0"
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

          {/* 3. WEAPONS TAB */}
          {activeSubTab === 'weapons' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredWeapons.map((w, idx) => (
                <div 
                  key={idx}
                  className="bg-[#131722] p-4 rounded-2xl border border-white/5 hover:border-[#FF4655]/40 transition-all flex items-center justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {w.displayIcon ? (
                      <img src={w.displayIcon} alt="" className="w-14 h-9 object-contain bg-[#0B0E14] p-1 rounded-xl border border-white/5 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#0B0E14] border border-white/5 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">
                        {w.displayName.slice(0, 2)}
                      </div>
                    )}
                    <div className="space-y-0.5 truncate">
                      <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-[#FF4655] transition-colors">
                        {w.displayName}
                      </h4>
                      <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/20 truncate font-semibold inline-block">
                        {w.codename}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopy(w.codename, e)}
                    title="Copy weapon codename"
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#FF4655] text-slate-400 hover:text-white transition-colors shrink-0"
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

          {/* 4. SKINS TAB */}
          {activeSubTab === 'skins' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSkins.map((s, idx) => (
                <div 
                  key={idx}
                  className="bg-[#131722] p-4 rounded-2xl border border-white/5 hover:border-[#FF4655]/40 transition-all flex items-center justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {s.displayIcon ? (
                      <img src={s.displayIcon} alt="" className="w-14 h-9 object-contain bg-[#0B0E14] p-1 rounded-xl border border-white/5 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#0B0E14] border border-white/5 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">
                        {s.displayName.slice(0, 2)}
                      </div>
                    )}
                    <div className="space-y-0.5 truncate">
                      <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-[#FF4655] transition-colors" title={s.displayName}>
                        {s.displayName}
                      </h4>
                      <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/20 truncate font-semibold inline-block">
                        {s.codename}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopy(s.codename, e)}
                    title="Copy skin codename"
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#FF4655] text-slate-400 hover:text-white transition-colors shrink-0"
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
    </section>
  );
}
