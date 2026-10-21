import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, X, User, Volume2, Image as ImageIcon, ChevronRight, Sparkles, 
  Shield, Award, Download, Copy, Check, Eye, Link as LinkIcon, Crosshair, 
  Layers, ArrowRight, Radio
} from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';
import ImagePreviewModal from './ImagePreviewModal';
import { toAssetUrl } from '../utils/urlHelper';
import { copyImageAsset, copyLinkText } from '../utils/copyHelper';

const safePath = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.relPath || val.path || val.src || '';
  }
  return '';
};

const safeFilename = (val, fallback = 'asset.png') => {
  if (!val) return fallback;
  if (typeof val === 'string') return val.split('/').pop() || fallback;
  if (typeof val === 'object') {
    if (val.filename) return val.filename;
    const p = val.relPath || val.path || val.src;
    if (typeof p === 'string') return p.split('/').pop() || fallback;
  }
  return fallback;
};

export default function SearchOverlay({ isOpen, onClose, registry, onSelectAgent }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'agents' | 'portraits' | 'logos' | 'icons' | 'wallpapers' | 'weapons' | 'sfx'
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);
  const inputRef = useRef(null);

  // Close with Escape and toggle with Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (previewImage) {
          setPreviewImage(null);
        } else {
          onClose();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, previewImage]);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // 1. Build Unified Catalog Memoized from registry with defensive type-safety
  const catalog = useMemo(() => {
    if (!registry) {
      return { agents: [], portraits: [], logos: [], icons: [], wallpapers: [], weapons: [], sfx: [] };
    }

    const libs = registry.imageLibraries || {};
    const agents = registry.agents || [];

    // --- A. Portraits & Cutouts ---
    const portraitsMap = new Map();
    (libs.allAgentFullPortraits || []).forEach(p => {
      const pPath = safePath(p);
      if (pPath && !portraitsMap.has(pPath)) {
        portraitsMap.set(pPath, {
          ...p,
          relPath: pPath,
          thumbPath: safePath(p.thumbPath) || pPath,
          filename: safeFilename(p, 'portrait.png'),
          category: p.agentName ? `${p.agentName} Portrait` : 'Character Portrait',
          displayName: p.displayName || p.name?.replace(/^TX_Character_FullPortrait_/, '').replace(/^TX_Character_/, '').replace(/_/g, ' ') || 'Character Portrait'
        });
      }
    });
    // Ensure agent base fullPortraits & bustPortraits are included
    agents.forEach(a => {
      const fullP = safePath(a.assets?.fullPortrait);
      if (fullP && !portraitsMap.has(fullP)) {
        portraitsMap.set(fullP, {
          name: `${a.name} Full Portrait`,
          displayName: `${a.name} Full Portrait`,
          filename: safeFilename(a.assets?.fullPortrait, `${a.name}_full_portrait.png`),
          relPath: fullP,
          thumbPath: fullP,
          agentName: a.name,
          category: `${a.name} Portrait`
        });
      }
      (a.assets?.fullPortraitsList || []).forEach(fp => {
        const pPath = safePath(fp);
        if (pPath && !portraitsMap.has(pPath)) {
          portraitsMap.set(pPath, {
            ...fp,
            relPath: pPath,
            thumbPath: safePath(fp.thumbPath) || pPath,
            filename: safeFilename(fp, `${a.name}_portrait.png`),
            agentName: a.name,
            category: `${a.name} Portrait`,
            displayName: fp.displayName || fp.name?.replace(/_/g, ' ') || `${a.name} Portrait`
          });
        }
      });
    });
    const portraits = Array.from(portraitsMap.values());

    // --- B. Official Logos ---
    const logos = (libs.logos || []).map(l => {
      const lPath = safePath(l);
      const pathParts = lPath.split('/');
      const folder = pathParts[2] || 'Brand Kit';
      return {
        ...l,
        relPath: lPath,
        thumbPath: safePath(l.thumbPath) || lPath,
        filename: safeFilename(l, 'logo.png'),
        category: folder.replace(/_/g, ' '),
        displayName: l.displayName || l.name?.replace(/_/g, ' ') || 'Official Logo'
      };
    });

    // --- C. Icons & Badges ---
    const iconsMap = new Map();
    const iconCats = libs.iconCategories || {};
    Object.keys(iconCats).forEach(cat => {
      (iconCats[cat] || []).forEach(item => {
        const itemPath = safePath(item);
        if (itemPath && !iconsMap.has(itemPath)) {
          iconsMap.set(itemPath, {
            ...item,
            relPath: itemPath,
            thumbPath: safePath(item.thumbPath) || itemPath,
            filename: safeFilename(item, 'icon.png'),
            category: cat,
            displayName: item.displayName || item.name?.replace(/^TX_UI_/, '').replace(/^TX_/, '').replace(/_/g, ' ') || 'Icon'
          });
        }
      });
    });
    // Rankings & Competitive Badges
    (libs.rankings || []).forEach(r => {
      const rPath = safePath(r);
      if (rPath && !iconsMap.has(rPath)) {
        iconsMap.set(rPath, {
          ...r,
          relPath: rPath,
          thumbPath: safePath(r.thumbPath) || rPath,
          filename: safeFilename(r, 'rank_badge.png'),
          category: 'Rankings & Badges',
          displayName: r.displayName || r.name?.replace(/_/g, ' ') || 'Rank Badge'
        });
      }
    });
    // Role Icons
    Object.entries(registry.roleIcons || {}).forEach(([role, iconVal]) => {
      const iconPath = safePath(iconVal);
      if (iconPath && !iconsMap.has(iconPath)) {
        iconsMap.set(iconPath, {
          name: `${role} Role Icon`,
          displayName: `${role} Role Icon`,
          filename: safeFilename(iconVal, `${role}_role_icon.png`),
          relPath: iconPath,
          thumbPath: iconPath,
          category: 'Role Icons'
        });
      }
    });
    // Agent Ability & Minimap Icons
    agents.forEach(a => {
      (a.assets?.abilityIcons || []).forEach((ab, idx) => {
        const abPath = safePath(ab);
        if (abPath && !iconsMap.has(abPath)) {
          const abName = a.abilities?.[idx]?.displayName || `Ability ${idx + 1}`;
          iconsMap.set(abPath, {
            name: `${a.name} - ${abName}`,
            displayName: `${a.name} - ${abName}`,
            filename: safeFilename(ab, `${a.name}_ability_${idx + 1}.png`),
            relPath: abPath,
            thumbPath: abPath,
            category: `${a.name} Abilities`
          });
        }
      });
      const kPath = safePath(a.assets?.killfeedIcon);
      if (kPath && !iconsMap.has(kPath)) {
        iconsMap.set(kPath, {
          name: `${a.name} Killfeed Icon`,
          displayName: `${a.name} Killfeed Icon`,
          filename: safeFilename(a.assets?.killfeedIcon, `${a.name}_killfeed.png`),
          relPath: kPath,
          thumbPath: kPath,
          category: 'Killfeed'
        });
      }
      const mPath = safePath(a.assets?.minimapIcon);
      if (mPath && !iconsMap.has(mPath)) {
        iconsMap.set(mPath, {
          name: `${a.name} Minimap Icon`,
          displayName: `${a.name} Minimap Icon`,
          filename: safeFilename(a.assets?.minimapIcon, `${a.name}_minimap.png`),
          relPath: mPath,
          thumbPath: mPath,
          category: 'Minimap'
        });
      }
    });
    const icons = Array.from(iconsMap.values());

    // --- D. Wallpapers & Posters ---
    const wallpapersMap = new Map();
    (libs.allAgentWallpapers || []).forEach(w => {
      const wPath = safePath(w);
      if (wPath && !wallpapersMap.has(wPath)) {
        wallpapersMap.set(wPath, {
          ...w,
          relPath: wPath,
          thumbPath: safePath(w.thumbPath) || wPath,
          filename: safeFilename(w, 'wallpaper.png'),
          category: w.agentName ? `${w.agentName} Wallpaper` : 'Agent Wallpaper',
          displayName: w.displayName || w.name?.replace(/^TX_AgentMastery_/, '').replace(/_/g, ' ') || 'Wallpaper'
        });
      }
    });
    (libs.backgrounds || []).slice(0, 300).forEach(bg => {
      const bgPath = safePath(bg);
      if (bgPath && !wallpapersMap.has(bgPath)) {
        wallpapersMap.set(bgPath, {
          ...bg,
          relPath: bgPath,
          thumbPath: safePath(bg.thumbPath) || bgPath,
          filename: safeFilename(bg, 'background.png'),
          category: 'Key Art & Backgrounds',
          displayName: bg.displayName || bg.name?.replace(/_/g, ' ') || 'Background'
        });
      }
    });
    const wallpapers = Array.from(wallpapersMap.values());

    // --- E. Weapons & HD Renders ---
    const weaponsList = [];
    (registry.weapons || []).forEach(w => {
      (w.images || []).forEach(img => {
        const imgPath = safePath(img);
        if (imgPath) {
          weaponsList.push({
            ...img,
            relPath: imgPath,
            thumbPath: safePath(img.thumbPath) || imgPath,
            filename: safeFilename(img, `${w.name}.png`),
            weaponName: w.name,
            category: `${w.name} Render`,
            displayName: img.displayName || img.name?.replace(/_/g, ' ') || `${w.name} HD Render`
          });
        }
      });
    });

    // --- F. Sound Effects (UI + Agent Abilities) ---
    const sfxList = [];
    const uiCats = registry.uiCategories || {};
    Object.keys(uiCats).forEach(cat => {
      (uiCats[cat] || []).forEach(clip => {
        const clipPath = safePath(clip);
        if (clipPath) {
          sfxList.push({
            ...clip,
            relPath: clipPath,
            filename: safeFilename(clip, 'sound.mp3'),
            category: cat,
            sourceType: 'UI'
          });
        }
      });
    });
    agents.forEach(a => {
      const audioCats = a.audioCategories || {};
      Object.keys(audioCats).forEach(cat => {
        const catData = audioCats[cat];
        const clips = catData?.clips || (Array.isArray(catData) ? catData : []);
        clips.forEach(clip => {
          const clipPath = safePath(clip);
          if (clipPath) {
            sfxList.push({
              ...clip,
              relPath: clipPath,
              filename: safeFilename(clip, 'ability_sfx.mp3'),
              agentName: a.name,
              category: `${a.name} - ${cat}`,
              sourceType: 'Agent'
            });
          }
        });
      });
    });

    return {
      agents,
      portraits,
      logos,
      icons,
      wallpapers,
      weapons: weaponsList,
      sfx: sfxList
    };
  }, [registry]);

  // 2. High-speed Multi-token Search Engine
  const searchResults = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) {
      return {
        agents: [],
        portraits: [],
        logos: [],
        icons: [],
        wallpapers: [],
        weapons: [],
        sfx: [],
        total: 0
      };
    }

    const terms = raw.split(/\s+/).filter(Boolean);

    const matchesItem = (item, extraFields = []) => {
      const searchTarget = [
        item.name,
        item.displayName,
        item.filename,
        item.category,
        item.agentName,
        item.weaponName,
        item.codename,
        ...extraFields
      ].filter(Boolean).join(' ').toLowerCase();

      return terms.every(t => searchTarget.includes(t));
    };

    // Semantic category synonyms
    const isLogoSearch = terms.some(t => ['logo', 'logos', 'brand', 'emblem', 'lockup', 'crest', 'icon'].includes(t));
    const isPortraitSearch = terms.some(t => ['portrait', 'portraits', 'cutout', 'render', 'fullbody', 'bust'].includes(t));
    const isIconSearch = terms.some(t => ['icon', 'icons', 'badge', 'killfeed', 'minimap', 'currency', 'rank', 'armor'].includes(t));
    const isWallpaperSearch = terms.some(t => ['wallpaper', 'wallpapers', 'poster', 'background', 'keyart', 'art'].includes(t));
    const isSfxSearch = terms.some(t => ['sfx', 'sound', 'audio', 'voice', 'effect', 'noise'].includes(t));

    // Matching Agents
    const matchingAgents = catalog.agents.filter(a => 
      matchesItem(a, [a.role, a.developerName, 'agent', ...(a.characterTags || [])])
    );

    // Matching Portraits
    const matchingPortraits = catalog.portraits.filter(p => 
      matchesItem(p, [p.agentName, 'portrait', 'cutout', 'fullportrait', isPortraitSearch ? 'portrait' : ''])
    );

    // Matching Logos
    const matchingLogos = catalog.logos.filter(l => 
      matchesItem(l, ['logo', 'brand', 'emblem', 'lockup', 'official', isLogoSearch ? 'logo' : ''])
    );

    // Matching Icons & Badges
    const matchingIcons = catalog.icons.filter(i => 
      matchesItem(i, ['icon', 'badge', i.category, isIconSearch ? 'icon' : ''])
    );

    // Matching Wallpapers
    const matchingWallpapers = catalog.wallpapers.filter(w => 
      matchesItem(w, ['wallpaper', 'poster', 'background', w.agentName, isWallpaperSearch ? 'wallpaper' : ''])
    );

    // Matching Weapons
    const matchingWeapons = catalog.weapons.filter(w => 
      matchesItem(w, ['weapon', w.weaponName, 'render', 'gun'])
    );

    // Matching SFX
    const matchingSfx = catalog.sfx.filter(s => 
      matchesItem(s, [s.category, s.agentName, s.sourceType, 'sfx', 'audio', 'sound', isSfxSearch ? 'sfx' : ''])
    );

    const total = 
      matchingAgents.length +
      matchingPortraits.length +
      matchingLogos.length +
      matchingIcons.length +
      matchingWallpapers.length +
      matchingWeapons.length +
      matchingSfx.length;

    return {
      agents: matchingAgents,
      portraits: matchingPortraits,
      logos: matchingLogos,
      icons: matchingIcons,
      wallpapers: matchingWallpapers,
      weapons: matchingWeapons,
      sfx: matchingSfx,
      total
    };
  }, [query, catalog]);

  if (!isOpen) return null;

  // Direct clipboard copying helpers
  const handleCopyImage = async (path, e) => {
    if (e) e.stopPropagation();
    await copyImageAsset(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleCopyLink = async (path, e) => {
    if (e) e.stopPropagation();
    await copyLinkText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleDownload = (path, name, e) => {
    if (e) e.stopPropagation();
    const a = document.createElement('a');
    a.href = toAssetUrl(path);
    a.download = name || `${path.split('/').pop()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Category Tabs Configuration
  const tabs = [
    { id: 'all', label: 'All', count: searchResults.total, icon: Layers },
    { id: 'agents', label: 'Agents', count: searchResults.agents.length, icon: User },
    { id: 'portraits', label: 'Portraits', count: searchResults.portraits.length, icon: ImageIcon },
    { id: 'logos', label: 'Logos', count: searchResults.logos.length, icon: Shield },
    { id: 'icons', label: 'Icons & Badges', count: searchResults.icons.length, icon: Sparkles },
    { id: 'wallpapers', label: 'Wallpapers', count: searchResults.wallpapers.length, icon: ImageIcon },
    { id: 'weapons', label: 'Weapons', count: searchResults.weapons.length, icon: Crosshair },
    { id: 'sfx', label: 'Sound Effects', count: searchResults.sfx.length, icon: Volume2 }
  ];

  const quickSearchChips = [
    'Official Logos',
    'Red Logo',
    'Duelist',
    'Hush',
    'Chamber',
    'Rank Badges',
    'Killfeed',
    'Headshot SFX',
    'Spike SFX',
    'Astra',
    'Champions',
    'V Bug'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-12 px-3 sm:px-6 bg-[#0B0E14]/85 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-5xl bg-[#131722] border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-[#0F141C]">
          <Search className="w-5 h-5 text-[#FF4655] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (activeTab !== 'all') setActiveTab('all');
            }}
            placeholder="Search agents, portraits, logos, icons, wallpapers, weapons, SFX..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          {query && (
            <span className="hidden sm:inline-block text-xs font-display font-medium text-[#00F0FF] bg-[#00F0FF]/10 px-2.5 py-1 rounded-full border border-[#00F0FF]/20 shrink-0">
              {searchResults.total} found
            </span>
          )}
          {query && (
            <button 
              onClick={() => setQuery('')} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose} 
            className="px-2.5 py-1 text-xs font-display text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Filter Navigation Tabs Bar */}
        {query.trim().length > 0 && (
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0B0E14] border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              if (tab.id !== 'all' && tab.count === 0) return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-display font-medium transition-all shrink-0 border ${
                    isActive
                      ? 'bg-[#FF4655] text-white border-[#FF4655] shadow-md shadow-[#FF4655]/20'
                      : 'bg-[#131722] text-slate-400 hover:text-white hover:bg-white/5 border-white/5'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search Results Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* Empty Query State & Discovery Hub */}
          {!query.trim() && (
            <div className="py-8 sm:py-12 px-4 text-center space-y-6">
              <div className="max-w-xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 text-xs font-display font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Global Archive Search
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Find any Valorant asset in seconds
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Search across <span className="text-white font-semibold">{catalog.agents.length} Agents</span>,{' '}
                  <span className="text-white font-semibold">{catalog.portraits.length} Character Portraits</span>,{' '}
                  <span className="text-white font-semibold">{catalog.logos.length} Official Logos</span>,{' '}
                  <span className="text-white font-semibold">{catalog.icons.length} Icons</span>, and thousands of SFX clips.
                </p>
              </div>

              {/* Quick Search Chips */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-display uppercase tracking-widest text-slate-500 font-semibold">
                  Popular Searches
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
                  {quickSearchChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(chip)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 hover:border-white/15 text-xs font-display font-medium transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Results Fallback */}
          {query.trim() && searchResults.total === 0 && (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-slate-500 border border-white/5">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-white">
                No assets found for "{query}"
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try searching by agent name (e.g. Jett, Hush), asset type (Logo, Portrait, Killfeed, Rank), or sound effect keyword (Headshot, Spike).
              </p>
            </div>
          )}

          {/* --- 1. Agents Section --- */}
          {(activeTab === 'all' || activeTab === 'agents') && searchResults.agents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FF4655]" />
                  <span>Agents ({searchResults.agents.length})</span>
                </div>
                {activeTab === 'all' && searchResults.agents.length > 4 && (
                  <button 
                    onClick={() => setActiveTab('agents')} 
                    className="text-xs text-[#FF4655] hover:underline flex items-center gap-1 font-display"
                  >
                    View all ({searchResults.agents.length}) <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(activeTab === 'all' ? searchResults.agents.slice(0, 4) : searchResults.agents).map(agent => (
                  <div
                    key={agent.name}
                    onClick={() => {
                      onSelectAgent(agent);
                      onClose();
                    }}
                    className="p-3 bg-[#0B0E14] hover:bg-[#1C2230] border border-white/5 hover:border-[#FF4655]/40 rounded-2xl cursor-pointer flex items-center justify-between transition-all group shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {agent.assets?.squareIcon ? (
                        <img 
                          src={toAssetUrl(agent.assets.squareIcon)} 
                          alt="" 
                          className="w-10 h-10 rounded-xl object-cover shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs text-slate-400 shrink-0">
                          {agent.name.substring(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm text-white group-hover:text-[#FF4655] transition-colors truncate">
                          {agent.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {agent.role || 'Agent'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF4655] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 2. Character Portraits & Cutouts Section --- */}
          {(activeTab === 'all' || activeTab === 'portraits') && searchResults.portraits.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00F0FF]" />
                  <span>Portraits & Character Renders ({searchResults.portraits.length})</span>
                </div>
                {activeTab === 'all' && searchResults.portraits.length > 6 && (
                  <button 
                    onClick={() => setActiveTab('portraits')} 
                    className="text-xs text-[#00F0FF] hover:underline flex items-center gap-1 font-display"
                  >
                    View all ({searchResults.portraits.length}) <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {(activeTab === 'all' ? searchResults.portraits.slice(0, 6) : searchResults.portraits).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImage({ src: item.relPath, title: item.displayName || item.name, filename: item.filename })}
                    className="p-2 bg-[#0B0E14] hover:bg-[#161D2B] border border-white/5 hover:border-[#00F0FF]/40 rounded-2xl cursor-pointer flex flex-col justify-between transition-all group relative overflow-hidden shadow-md"
                  >
                    <div className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 relative">
                      <img
                        src={toAssetUrl(item.thumbPath || item.relPath)}
                        alt={item.displayName}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button
                          onClick={(e) => handleCopyImage(item.relPath, e)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-[#00F0FF] text-white hover:text-black transition-colors"
                          title="Copy image directly"
                        >
                          {copiedPath === item.relPath ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => handleDownload(item.relPath, item.filename, e)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-[#00F0FF] text-white hover:text-black transition-colors"
                          title="Download image"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-black/60 text-white"
                          title="Preview full size"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="pt-2 px-1 space-y-0.5">
                      <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-[#00F0FF] transition-colors" title={item.displayName}>
                        {item.displayName}
                      </p>
                      <span className="inline-block text-[10px] text-slate-500 font-mono truncate">
                        {item.agentName || 'Valorant Agent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 3. Official Logos Section --- */}
          {(activeTab === 'all' || activeTab === 'logos') && searchResults.logos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF4655]" />
                  <span>Official Logos & Brand Kit ({searchResults.logos.length})</span>
                </div>
                {activeTab === 'all' && searchResults.logos.length > 6 && (
                  <button 
                    onClick={() => setActiveTab('logos')} 
                    className="text-xs text-[#FF4655] hover:underline flex items-center gap-1 font-display"
                  >
                    View all ({searchResults.logos.length}) <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {(activeTab === 'all' ? searchResults.logos.slice(0, 6) : searchResults.logos).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImage({ src: item.relPath, title: item.displayName || item.name, filename: item.filename })}
                    className="p-2.5 bg-[#0B0E14] hover:bg-[#161D2B] border border-white/5 hover:border-[#FF4655]/40 rounded-2xl cursor-pointer flex flex-col justify-between transition-all group shadow-md"
                  >
                    {/* Subtle checkered backdrop so transparent white/black logos stand out */}
                    <div className="h-28 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-3 relative bg-[radial-gradient(#1c2230_1px,transparent_1px)] [background-size:12px_12px]">
                      <img
                        src={toAssetUrl(item.thumbPath || item.relPath)}
                        alt={item.displayName}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button
                          onClick={(e) => handleCopyImage(item.relPath, e)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-[#FF4655] text-white transition-colors"
                          title="Copy logo"
                        >
                          {copiedPath === item.relPath ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => handleDownload(item.relPath, item.filename, e)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-[#FF4655] text-white transition-colors"
                          title="Download logo"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg bg-black/60 text-white"
                          title="Preview full logo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="pt-2 px-1 space-y-0.5">
                      <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-[#FF4655] transition-colors" title={item.displayName}>
                        {item.displayName}
                      </p>
                      <span className="inline-block text-[10px] text-slate-500 font-mono truncate">
                        {item.category || 'Brand Kit'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 4. Icons & Badges Section --- */}
          {(activeTab === 'all' || activeTab === 'icons') && searchResults.icons.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Icons, Badges & UI Elements ({searchResults.icons.length})</span>
                </div>
                {activeTab === 'all' && searchResults.icons.length > 8 && (
                  <button 
                    onClick={() => setActiveTab('icons')} 
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-display"
                  >
                    View all ({searchResults.icons.length}) <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                {(activeTab === 'all' ? searchResults.icons.slice(0, 8) : searchResults.icons).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImage({ src: item.relPath, title: item.displayName || item.name, filename: item.filename })}
                    className="p-2 bg-[#0B0E14] hover:bg-[#161D2B] border border-white/5 hover:border-amber-400/40 rounded-2xl cursor-pointer flex flex-col items-center justify-between text-center transition-all group shadow-sm"
                  >
                    <div className="w-14 h-14 bg-[#131722] rounded-xl flex items-center justify-center p-2 mb-1.5 group-hover:scale-110 transition-transform">
                      <img
                        src={toAssetUrl(item.thumbPath || item.relPath)}
                        alt={item.displayName}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full space-y-0.5">
                      <p className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-amber-300 transition-colors" title={item.displayName}>
                        {item.displayName}
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono truncate" title={item.category}>
                        {item.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 5. Wallpapers & Posters Section --- */}
          {(activeTab === 'all' || activeTab === 'wallpapers') && searchResults.wallpapers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>Wallpapers & Posters ({searchResults.wallpapers.length})</span>
                </div>
                {activeTab === 'all' && searchResults.wallpapers.length > 4 && (
                  <button 
                    onClick={() => setActiveTab('wallpapers')} 
                    className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-display"
                  >
                    View all ({searchResults.wallpapers.length}) <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(activeTab === 'all' ? searchResults.wallpapers.slice(0, 4) : searchResults.wallpapers).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImage({ src: item.relPath, title: item.displayName || item.name, filename: item.filename })}
                    className="bg-[#0B0E14] hover:bg-[#161D2B] border border-white/5 hover:border-purple-400/40 rounded-2xl cursor-pointer overflow-hidden transition-all group flex flex-col shadow-md"
                  >
                    <div className="relative aspect-video bg-[#131722] overflow-hidden flex items-center justify-center">
                      <img
                        src={toAssetUrl(item.thumbPath || item.relPath)}
                        alt={item.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => handleCopyImage(item.relPath, e)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-purple-400 text-white hover:text-black transition-colors"
                          title="Copy image"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDownload(item.relPath, item.filename, e)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-purple-400 text-white hover:text-black transition-colors"
                          title="Download wallpaper"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-black/60 text-white" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 space-y-0.5">
                      <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300 transition-colors" title={item.displayName}>
                        {item.displayName}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono truncate block">
                        {item.agentName ? `${item.agentName} Mastery` : (item.category || 'Wallpaper')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 6. Weapons & HD Renders Section --- */}
          {(activeTab === 'all' || activeTab === 'weapons') && searchResults.weapons.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-emerald-400" />
                  <span>Weapons & Renders ({searchResults.weapons.length})</span>
                </div>
                {activeTab === 'all' && searchResults.weapons.length > 4 && (
                  <button 
                    onClick={() => setActiveTab('weapons')} 
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-display"
                  >
                    View all ({searchResults.weapons.length}) <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(activeTab === 'all' ? searchResults.weapons.slice(0, 4) : searchResults.weapons).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImage({ src: item.relPath, title: item.displayName || item.name, filename: item.filename })}
                    className="p-3 bg-[#0B0E14] hover:bg-[#161D2B] border border-white/5 hover:border-emerald-400/40 rounded-2xl cursor-pointer transition-all group flex flex-col justify-between shadow-md"
                  >
                    <div className="h-28 bg-[#131722] rounded-xl flex items-center justify-center p-3 relative overflow-hidden">
                      <img
                        src={toAssetUrl(item.thumbPath || item.relPath)}
                        alt={item.displayName}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="pt-2 space-y-0.5">
                      <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-300 transition-colors">
                        {item.displayName}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono truncate block">
                        {item.weaponName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 7. Sound Effects Section --- */}
          {(activeTab === 'all' || activeTab === 'sfx') && searchResults.sfx.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="text-xs font-display font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#00F0FF]" />
                  <span>Sound Effects ({searchResults.sfx.length})</span>
                </div>
                {activeTab === 'all' && searchResults.sfx.length > 8 && (
                  <button 
                    onClick={() => setActiveTab('sfx')} 
                    className="text-xs text-[#00F0FF] hover:underline flex items-center gap-1 font-display"
                  >
                    View all ({searchResults.sfx.length}) <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(activeTab === 'all' ? searchResults.sfx.slice(0, 8) : searchResults.sfx).map((clip, idx) => (
                  <AudioPlayerSlim
                    key={idx}
                    title={`[${clip.category}] ${clip.name}`}
                    src={toAssetUrl(clip.relPath)}
                    filename={`${clip.category.replace(/[^a-zA-Z0-9_-]/g, '_')}_${clip.filename}`}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Search Modal Footer */}
        <div className="px-5 py-3 bg-[#0F141C] border-t border-white/5 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-4">
            <span>Click any image to view in 4K, copy or download</span>
            <span className="hidden sm:inline-block">Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono text-[10px]">ESC</kbd> to close, <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono text-[10px]">Ctrl+K</kbd> to open</span>
          </div>
          <span className="font-mono text-[11px] text-[#FF4655]">Spike Media Archive</span>
        </div>

      </div>

      {/* Full Resolution Image Inspection Modal */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}
