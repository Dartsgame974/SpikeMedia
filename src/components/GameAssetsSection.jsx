import React, { useState, useMemo } from 'react';
import { 
  Crosshair, Download, Image, Shield, Layers, Award, Box, Sparkles, 
  Copy, Check, Eye, Film, FileImage, MapPin, Search, ChevronDown, 
  ChevronRight, Menu, X, Filter, FolderTree, Compass, Tag
} from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';
import { toAssetUrl, getRealBundleDisplayName, getRealBundleCodename } from '../utils/urlHelper';

export default function GameAssetsSection({ registry }) {
  const [activeSubTab, setActiveSubTab] = useState('icons'); // 'icons', 'maps', 'weapons', 'logos', 'ranks', 'backgrounds', 'overlays', 'spritesheets', 'misc'
  const [selectedIconSubCat, setSelectedIconSubCat] = useState('All');
  const [selectedMapCat, setSelectedMapCat] = useState('All');
  const [selectedBgCat, setSelectedBgCat] = useState('All');
  const [selectedWeaponFolder, setSelectedWeaponFolder] = useState('All');
  
  // Navigation & Search State
  const [searchSubCat, setSearchSubCat] = useState('');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({
    icons: true,
    maps: true,
    weapons: true,
    backgrounds: true
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);
  const [copiedType, setCopiedType] = useState(null);
  const [visibleCounts, setVisibleCounts] = useState({});

  const getLimit = (key, defaultLimit = 36) => visibleCounts[key] || defaultLimit;
  const handleShowMore = (key, step = 36) => setVisibleCounts(prev => ({ ...prev, [key]: (prev[key] || 36) + step }));

  const weapons = registry?.weapons || [];
  const mapsData = registry?.mapsData || [];
  const imageLibraries = registry?.imageLibraries || {};
  const iconCategories = imageLibraries?.iconCategories || {};
  const iconCatNames = Object.keys(iconCategories);
  const backgroundCategories = imageLibraries?.backgroundCategories || {};
  const bgCatNames = Object.keys(backgroundCategories);
  const spritesheets = imageLibraries?.spritesheets || [];

  const toggleCategoryExpand = (catKey, e) => {
    if (e) e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [catKey]: !prev[catKey] }));
  };

  const handleDownload = (path, name, e) => {
    if (e) e.stopPropagation();
    const a = document.createElement('a');
    a.href = toAssetUrl(path);
    a.download = name || 'asset.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = (path, e) => {
    if (e) e.stopPropagation();
    const fullUrl = new URL(toAssetUrl(path), window.location.href).href;
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    setCopiedType('link');
    setTimeout(() => {
      setCopiedPath(null);
      setCopiedType(null);
    }, 2000);
  };

  const handleCopyImage = async (path, e) => {
    if (e) e.stopPropagation();
    try {
      const response = await fetch(toAssetUrl(path));
      const blob = await response.blob();
      
      let pngBlob = blob;
      if (blob.type !== 'image/png') {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        await new Promise(resolve => img.onload = resolve);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob })
      ]);
      setCopiedPath(path);
      setCopiedType('image');
      setTimeout(() => {
        setCopiedPath(null);
        setCopiedType(null);
      }, 2000);
    } catch (err) {
      console.warn('Copy image failed, falling back to URL copy:', err);
      handleCopyLink(path, e);
    }
  };

  // Filtered Subcategories based on search query in sidebar
  const filteredIconCatNames = useMemo(() => {
    if (!searchSubCat.trim()) return iconCatNames;
    return iconCatNames.filter(c => c.toLowerCase().includes(searchSubCat.toLowerCase()));
  }, [iconCatNames, searchSubCat]);

  const filteredBgCatNames = useMemo(() => {
    if (!searchSubCat.trim()) return bgCatNames;
    return bgCatNames.filter(c => c.toLowerCase().includes(searchSubCat.toLowerCase()));
  }, [bgCatNames, searchSubCat]);

  const filteredWeaponsList = useMemo(() => {
    if (!searchSubCat.trim()) return weapons;
    return weapons.filter(w => w.name.toLowerCase().includes(searchSubCat.toLowerCase()));
  }, [weapons, searchSubCat]);

  const mapCategories = ['All', 'Competitive / Unrated', 'Team Deathmatch (TDM)', 'Training & Special'];

  // Left Sidebar Component Content
  const renderSidebarContent = () => (
    <div className="space-y-4">
      {/* Navigator Title */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-display font-bold text-sm uppercase tracking-wider">
          <FolderTree className="w-4 h-4 text-[#FF4655]" />
          <span>Asset Navigator</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF4655]/10 text-[#FF4655] font-semibold border border-[#FF4655]/20">
          Left Panel
        </span>
      </div>

      {/* Subcategory Filter Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchSubCat}
          onChange={(e) => setSearchSubCat(e.target.value)}
          placeholder="Filter categories..."
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B0E14] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF] transition-colors"
        />
        {searchSubCat && (
          <button
            onClick={() => setSearchSubCat('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Accordion Categories Tree */}
      <div className="space-y-3 text-xs">
        
        {/* 1. ICONS SECTION */}
        <div className="space-y-1 bg-[#0B0E14]/60 p-2.5 rounded-2xl border border-white/5">
          <div
            onClick={() => {
              setActiveSubTab('icons');
              setIsMobileDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
              activeSubTab === 'icons'
                ? 'bg-[#FF4655]/15 text-[#FF4655] font-bold border border-[#FF4655]/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span className="truncate font-display font-semibold">Icons & UI Badges</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-slate-400 font-mono">
                {iconCatNames.length}
              </span>
              <button
                onClick={(e) => toggleCategoryExpand('icons', e)}
                className="p-1 hover:text-white text-slate-400 rounded"
              >
                {expandedCategories.icons ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Subcategories List for Icons */}
          {expandedCategories.icons && (
            <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-[#00F0FF]/30 ml-2 mt-1">
              <button
                onClick={() => {
                  setActiveSubTab('icons');
                  setSelectedIconSubCat('All');
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors text-xs ${
                  activeSubTab === 'icons' && selectedIconSubCat === 'All'
                    ? 'bg-[#FF4655] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="truncate">All Categories</span>
                <span className="text-[10px] font-mono opacity-80">{iconCatNames.length}</span>
              </button>

              {filteredIconCatNames.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveSubTab('icons');
                    setSelectedIconSubCat(cat);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors text-xs ${
                    activeSubTab === 'icons' && selectedIconSubCat === cat
                      ? 'bg-[#FF4655] text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate" title={cat}>{cat}</span>
                  <span className="text-[10px] font-mono opacity-70 shrink-0 ml-1">
                    {iconCategories[cat]?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. MAPS SECTION */}
        <div className="space-y-1 bg-[#0B0E14]/60 p-2.5 rounded-2xl border border-white/5">
          <div
            onClick={() => {
              setActiveSubTab('maps');
              setIsMobileDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
              activeSubTab === 'maps'
                ? 'bg-[#FF4655]/15 text-[#FF4655] font-bold border border-[#FF4655]/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate font-display font-semibold">Maps & Minimaps</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-slate-400 font-mono">
                {mapsData.length}
              </span>
              <button
                onClick={(e) => toggleCategoryExpand('maps', e)}
                className="p-1 hover:text-white text-slate-400 rounded"
              >
                {expandedCategories.maps ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {expandedCategories.maps && (
            <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-emerald-500/30 ml-2 mt-1">
              {mapCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveSubTab('maps');
                    setSelectedMapCat(cat);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors text-xs ${
                    activeSubTab === 'maps' && selectedMapCat === cat
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  <span className="text-[10px] font-mono opacity-70 shrink-0 ml-1">
                    {cat === 'All' ? mapsData.length : mapsData.filter(m => m.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. WEAPONS SECTION */}
        <div className="space-y-1 bg-[#0B0E14]/60 p-2.5 rounded-2xl border border-white/5">
          <div
            onClick={() => {
              setActiveSubTab('weapons');
              setIsMobileDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
              activeSubTab === 'weapons'
                ? 'bg-[#FF4655]/15 text-[#FF4655] font-bold border border-[#FF4655]/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Crosshair className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate font-display font-semibold">Weapons & Arsenal</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-slate-400 font-mono">
                {weapons.length}
              </span>
              <button
                onClick={(e) => toggleCategoryExpand('weapons', e)}
                className="p-1 hover:text-white text-slate-400 rounded"
              >
                {expandedCategories.weapons ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {expandedCategories.weapons && (
            <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-amber-500/30 ml-2 mt-1">
              <button
                onClick={() => {
                  setActiveSubTab('weapons');
                  setSelectedWeaponFolder('All');
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors text-xs ${
                  activeSubTab === 'weapons' && selectedWeaponFolder === 'All'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="truncate">All Weapons</span>
                <span className="text-[10px] font-mono opacity-80">{weapons.length}</span>
              </button>

              {filteredWeaponsList.map(w => (
                <button
                  key={w.name}
                  onClick={() => {
                    setActiveSubTab('weapons');
                    setSelectedWeaponFolder(w.name);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors text-xs ${
                    activeSubTab === 'weapons' && selectedWeaponFolder === w.name
                      ? 'bg-amber-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{w.name}</span>
                  <span className="text-[10px] font-mono opacity-70 shrink-0 ml-1">{w.imagesCount}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. BACKGROUNDS SECTION */}
        <div className="space-y-1 bg-[#0B0E14]/60 p-2.5 rounded-2xl border border-white/5">
          <div
            onClick={() => {
              setActiveSubTab('backgrounds');
              setIsMobileDrawerOpen(false);
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
              activeSubTab === 'backgrounds'
                ? 'bg-[#FF4655]/15 text-[#FF4655] font-bold border border-[#FF4655]/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Image className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="truncate font-display font-semibold">Wallpapers & Bundles</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-slate-400 font-mono">
                {imageLibraries.backgrounds?.length || 0}
              </span>
              <button
                onClick={(e) => toggleCategoryExpand('backgrounds', e)}
                className="p-1 hover:text-white text-slate-400 rounded"
              >
                {expandedCategories.backgrounds ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {expandedCategories.backgrounds && (
            <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-purple-500/30 ml-2 mt-1">
              <button
                onClick={() => {
                  setActiveSubTab('backgrounds');
                  setSelectedBgCat('All');
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors text-xs ${
                  activeSubTab === 'backgrounds' && selectedBgCat === 'All'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="truncate">All Backgrounds</span>
                <span className="text-[10px] font-mono opacity-80">{imageLibraries.backgrounds?.length || 0}</span>
              </button>

              {filteredBgCatNames.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveSubTab('backgrounds');
                    setSelectedBgCat(cat);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors text-xs ${
                    activeSubTab === 'backgrounds' && selectedBgCat === cat
                      ? 'bg-purple-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate" title={cat}>{cat}</span>
                  <span className="text-[10px] font-mono opacity-70 shrink-0 ml-1">
                    {backgroundCategories[cat]?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DIRECT OTHER TABS */}
        <button
          onClick={() => {
            setActiveSubTab('logos');
            setIsMobileDrawerOpen(false);
          }}
          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border border-white/5 transition-all ${
            activeSubTab === 'logos'
              ? 'bg-[#FF4655] text-white font-bold shadow-md'
              : 'bg-[#0B0E14]/60 text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="w-4 h-4 text-[#00F0FF] shrink-0" />
            <span className="truncate font-display font-semibold">Official Logos</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">
            {imageLibraries.logos?.length || 0}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('ranks');
            setIsMobileDrawerOpen(false);
          }}
          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border border-white/5 transition-all ${
            activeSubTab === 'ranks'
              ? 'bg-[#FF4655] text-white font-bold shadow-md'
              : 'bg-[#0B0E14]/60 text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate font-display font-semibold">Competitive Ranks</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">
            {imageLibraries.rankings?.length || 0}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('spritesheets');
            setIsMobileDrawerOpen(false);
          }}
          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border border-white/5 transition-all ${
            activeSubTab === 'spritesheets'
              ? 'bg-[#FF4655] text-white font-bold shadow-md'
              : 'bg-[#0B0E14]/60 text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Film className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate font-display font-semibold">Animated Spritesheets</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">
            {spritesheets.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('overlays');
            setIsMobileDrawerOpen(false);
          }}
          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border border-white/5 transition-all ${
            activeSubTab === 'overlays'
              ? 'bg-[#FF4655] text-white font-bold shadow-md'
              : 'bg-[#0B0E14]/60 text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate font-display font-semibold">Overlays & Banners</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">
            {imageLibraries.playerbannerAssets?.length || 0}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('misc');
            setIsMobileDrawerOpen(false);
          }}
          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border border-white/5 transition-all ${
            activeSubTab === 'misc'
              ? 'bg-[#FF4655] text-white font-bold shadow-md'
              : 'bg-[#0B0E14]/60 text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Box className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate font-display font-semibold">Misc Assets</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">
            {imageLibraries.misc?.length || 0}
          </span>
        </button>

      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      {/* Fullscreen Image Preview Lightbox */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}

      {/* Main Title Header Banner */}
      <div className="bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="font-display font-extrabold text-2xl text-white">Valorant Game Assets & Image Library</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Explore high-resolution weapons, icon categories, rank badges, official logos, organized wallpapers, animated spritesheets, overlays, and player banner assets.
          </p>
        </div>

        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="md:hidden w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FF4655] text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF4655]/30"
        >
          <Filter className="w-4 h-4" />
          <span>Browse Subcategories Panel</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: LEFT SIDEBAR + RIGHT CONTENT */}
      <div className="flex gap-6 items-start">

        {/* DESKTOP LEFT NAVIGATION SIDEBAR PANEL */}
        <aside className="w-72 shrink-0 hidden md:block sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto bg-[#131722] border border-white/10 rounded-3xl p-4 shadow-2xl custom-scrollbar">
          {renderSidebarContent()}
        </aside>

        {/* MOBILE OVERLAY DRAWER */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md flex justify-start">
            <div className="w-80 max-w-[85vw] h-full bg-[#131722] border-r border-white/10 p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-display font-bold text-sm text-white">Select Asset Category</span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderSidebarContent()}
            </div>
          </div>
        )}

        {/* RIGHT MAIN CONTENT DISPLAY PANEL */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* Top Active Category Breadcrumb & Filter Bar */}
          <div className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-display">
              <Compass className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-slate-400">Assets</span>
              <span className="text-slate-600">/</span>
              <span className="text-[#FF4655] font-bold uppercase tracking-wider">{activeSubTab}</span>
              <span className="text-slate-600">/</span>
              <span className="text-white font-semibold truncate max-w-[200px]">
                {activeSubTab === 'icons' ? selectedIconSubCat : activeSubTab === 'maps' ? selectedMapCat : activeSubTab === 'weapons' ? selectedWeaponFolder : activeSubTab === 'backgrounds' ? selectedBgCat : 'All Items'}
              </span>
            </div>

            {/* In-View Asset Search Input */}
            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={assetSearchQuery}
                onChange={(e) => setAssetSearchQuery(e.target.value)}
                placeholder="Search in view..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B0E14] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]"
              />
              {assetSearchQuery && (
                <button
                  onClick={() => setAssetSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 1. ICONS TAB CONTENT */}
          {activeSubTab === 'icons' && (
            <div className="space-y-6">
              {iconCatNames.map(cat => {
                if (selectedIconSubCat !== 'All' && selectedIconSubCat !== cat) return null;
                let iconsList = iconCategories[cat] || [];
                if (assetSearchQuery.trim()) {
                  iconsList = iconsList.filter(img => img.name.toLowerCase().includes(assetSearchQuery.toLowerCase()));
                }
                if (iconsList.length === 0) return null;

                return (
                  <div key={cat} className="space-y-3 bg-[#131722]/60 p-5 rounded-3xl border border-white/5">
                    <h3 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>{cat}</span>
                      </div>
                      <span className="text-slate-500 font-normal font-mono">({iconsList.length} items)</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {iconsList.slice(0, getLimit(cat, 35)).map((img, idx) => (
                        <div key={idx} className="bg-[#131722] p-3 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2 group hover:border-[#00F0FF]/40 transition-all">
                          <div
                            onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                            className="h-28 bg-[#0B0E14] rounded-xl p-2 flex items-center justify-center cursor-pointer relative"
                            title="Click for preview"
                          >
                            <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" loading="lazy" decoding="async" />
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="font-medium text-slate-300 truncate text-[11px]" title={img.name}>{img.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => handleCopyImage(img.relPath, e)}
                                className={`p-1 rounded transition-colors ${
                                  copiedPath === img.relPath && copiedType === 'image'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                                }`}
                                title="Copy image"
                              >
                                {copiedPath === img.relPath && copiedType === 'image' ? <Check className="w-3 h-3" /> : <FileImage className="w-3 h-3" />}
                              </button>
                              <button
                                onClick={(e) => handleCopyLink(img.relPath, e)}
                                className={`p-1 rounded transition-colors ${
                                  copiedPath === img.relPath && copiedType === 'link'
                                    ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                                    : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                                }`}
                                title="Copy link"
                              >
                                {copiedPath === img.relPath && copiedType === 'link' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                              <button
                                onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                                className="p-1 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-300 transition-colors shrink-0"
                                title="Download icon"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {iconsList.length > getLimit(cat, 35) && (
                      <div className="pt-2 flex justify-center">
                        <button
                          onClick={() => handleShowMore(cat, 35)}
                          className="px-4 py-2 rounded-xl text-xs font-display font-semibold bg-[#131722] hover:bg-[#00F0FF] hover:text-black text-slate-300 border border-white/10 transition-colors"
                        >
                          Show More ({iconsList.length - getLimit(cat, 35)} remaining)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. MAPS TAB CONTENT */}
          {activeSubTab === 'maps' && (() => {
            let filteredMapsList = mapsData.filter(m => selectedMapCat === 'All' || m.category === selectedMapCat);
            if (assetSearchQuery.trim()) {
              filteredMapsList = filteredMapsList.filter(m => m.displayName.toLowerCase().includes(assetSearchQuery.toLowerCase()));
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMapsList.map((mapItem, idx) => {
                  const mapImg = mapItem.minimap || mapItem.splash || mapItem.backgroundImage;
                  if (!mapImg) return null;

                  return (
                    <div
                      key={idx}
                      className="bg-[#131722] p-4 rounded-2xl border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 group relative overflow-hidden shadow-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-display font-bold text-base text-white truncate group-hover:text-emerald-400 transition-colors">
                            {mapItem.displayName}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-display font-semibold shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {mapItem.category === 'Team Deathmatch (TDM)' ? 'TDM' : mapItem.category === 'Competitive / Unrated' ? 'Ranked' : 'Special'}
                          </span>
                        </div>
                        {mapItem.coordinates && (
                          <p className="text-[10px] font-mono text-slate-500 truncate">{mapItem.coordinates}</p>
                        )}
                      </div>

                      <div
                        onClick={() => setPreviewImage({ src: mapImg, title: `${mapItem.displayName} Map` })}
                        className="h-48 bg-[#0B0E14] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative border border-white/5"
                      >
                        <img
                          src={toAssetUrl(mapImg)}
                          alt={mapItem.displayName}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                        <span className="text-[11px] font-mono text-slate-400 truncate">Tactical Minimap</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImage(mapImg, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                          >
                            <FileImage className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDownload(mapImg, `${mapItem.displayName}_map.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-emerald-500 text-slate-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* 3. WEAPONS TAB CONTENT */}
          {activeSubTab === 'weapons' && (
            <div className="space-y-6">
              {weapons.map(w => {
                if (selectedWeaponFolder !== 'All' && selectedWeaponFolder !== w.name) return null;
                let images = w.images || [];
                if (assetSearchQuery.trim()) {
                  images = images.filter(img => (img.displayName || img.name).toLowerCase().includes(assetSearchQuery.toLowerCase()));
                }
                if (images.length === 0) return null;

                return (
                  <div key={w.name} className="space-y-3 bg-[#131722]/60 p-5 rounded-3xl border border-white/5">
                    <h3 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                        <span>{w.name}</span>
                      </div>
                      <span className="text-slate-500 font-normal font-mono">({images.length} renders)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 space-y-3 group hover:border-amber-500/30 transition-all flex flex-col justify-between">
                          <div
                            onClick={() => setPreviewImage({ src: img.relPath, title: `${w.name} - ${img.displayName || img.name}` })}
                            className="h-32 bg-[#0B0E14] rounded-xl p-3 flex items-center justify-center cursor-pointer relative"
                          >
                            <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="font-medium text-slate-300 truncate" title={img.displayName || img.name}>{img.displayName || img.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => handleCopyImage(img.relPath, e)}
                                className="p-1.5 rounded bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                              >
                                <FileImage className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                                className="p-1.5 rounded bg-white/5 hover:bg-amber-500 text-slate-300 hover:text-black transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. BACKGROUNDS TAB CONTENT */}
          {activeSubTab === 'backgrounds' && (
            <div className="space-y-6">
              {bgCatNames.map(cat => {
                if (selectedBgCat !== 'All' && selectedBgCat !== cat) return null;
                let bgList = backgroundCategories[cat] || [];
                if (assetSearchQuery.trim()) {
                  bgList = bgList.filter(img => getRealBundleDisplayName(img).toLowerCase().includes(assetSearchQuery.toLowerCase()));
                }
                if (bgList.length === 0) return null;

                return (
                  <div key={cat} className="space-y-3 bg-[#131722]/60 p-5 rounded-3xl border border-white/5">
                    <h3 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image className="w-3.5 h-3.5 text-purple-400" />
                        <span>{cat}</span>
                      </div>
                      <span className="text-slate-500 font-normal font-mono">({bgList.length} wallpapers)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bgList.slice(0, getLimit(`bg_${cat}`, 24)).map((img, idx) => {
                        const displayTitle = getRealBundleDisplayName(img);
                        const displayCode = getRealBundleCodename(img);
                        return (
                          <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 space-y-3 group hover:border-purple-500/40 transition-all flex flex-col justify-between">
                            <div
                              onClick={() => setPreviewImage({ src: img.relPath, title: displayTitle })}
                              className="h-40 bg-[#0B0E14] rounded-xl overflow-hidden cursor-pointer relative"
                            >
                              <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="space-y-2">
                              <span className="font-bold text-white truncate text-xs block" title={displayTitle}>
                                {displayTitle}
                              </span>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/20 truncate">
                                  {displayCode}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => handleCopyImage(img.relPath, e)}
                                    className="p-1 rounded bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                                  >
                                    <FileImage className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                                    className="px-2 py-1 rounded bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors text-[11px] font-semibold"
                                  >
                                    Download
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 5. LOGOS TAB CONTENT */}
          {activeSubTab === 'logos' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(imageLibraries.logos || []).map((img, idx) => (
                <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3 group hover:border-[#00F0FF]/30 transition-all">
                  <div
                    onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                    className="h-32 bg-[#0B0E14] rounded-xl p-3 flex items-center justify-center cursor-pointer relative"
                  >
                    <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 truncate" title={img.name}>{img.name}</span>
                    <button
                      onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                      className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-300 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. RANKS TAB CONTENT */}
          {activeSubTab === 'ranks' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {(imageLibraries.rankings || []).map((img, idx) => (
                <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3 group hover:border-[#FF4655]/30 transition-all">
                  <div
                    onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                    className="h-28 bg-[#0B0E14] rounded-xl p-3 flex items-center justify-center cursor-pointer relative"
                  >
                    <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 truncate text-[11px]" title={img.name}>{img.name}</span>
                    <button
                      onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                      className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 7. SPRITESHEETS TAB CONTENT */}
          {activeSubTab === 'spritesheets' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {spritesheets.map((sp, idx) => (
                <div key={idx} className="bg-[#131722] p-5 rounded-3xl border border-white/5 space-y-4 group hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-purple-400" />
                      <span>{sp.name}</span>
                    </h3>
                    <span className="text-[10px] font-display font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Animated
                    </span>
                  </div>

                  <div
                    onClick={() => setPreviewImage({ src: sp.gif || sp.rawPng, title: sp.name })}
                    className="h-52 bg-[#0B0E14] rounded-2xl overflow-hidden flex items-center justify-center p-3 cursor-pointer relative"
                  >
                    {sp.mp4 ? (
                      <video src={toAssetUrl(sp.mp4)} autoPlay loop muted playsInline className="max-h-full max-w-full object-contain rounded-xl" />
                    ) : sp.gif ? (
                      <img src={toAssetUrl(sp.gif)} alt="" className="max-h-full max-w-full object-contain rounded-xl" />
                    ) : (
                      <img src={toAssetUrl(sp.rawPng)} alt="" className="max-h-full max-w-full object-contain rounded-xl" />
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                    {sp.gif && (
                      <button
                        onClick={(e) => handleDownload(sp.gif, `${sp.baseName}.gif`, e)}
                        className="py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold flex items-center justify-center gap-1 transition-colors text-[11px]"
                      >
                        <Download className="w-3 h-3" /> GIF
                      </button>
                    )}
                    {sp.mp4 && (
                      <button
                        onClick={(e) => handleDownload(sp.mp4, `${sp.baseName}.mp4`, e)}
                        className="py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold flex items-center justify-center gap-1 transition-colors text-[11px]"
                      >
                        <Download className="w-3 h-3" /> MP4
                      </button>
                    )}
                    {sp.rawPng && (
                      <button
                        onClick={(e) => handleDownload(sp.rawPng, `${sp.baseName}.png`, e)}
                        className="py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold flex items-center justify-center gap-1 transition-colors text-[11px]"
                      >
                        <Download className="w-3 h-3" /> Raw PNG
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 8. OVERLAYS TAB CONTENT */}
          {activeSubTab === 'overlays' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(imageLibraries.playerbannerAssets || []).concat(imageLibraries.overlays || []).map((img, idx) => (
                <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3 group hover:border-[#00F0FF]/30 transition-all">
                  <div
                    onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                    className="h-32 bg-[#0B0E14] rounded-xl p-2 flex items-center justify-center cursor-pointer relative"
                  >
                    <img src={toAssetUrl(img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 truncate" title={img.name}>{img.name}</span>
                    <button
                      onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                      className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-300 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 9. MISC TAB CONTENT */}
          {activeSubTab === 'misc' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(imageLibraries.misc || []).map((img, idx) => (
                <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3 group hover:border-[#FF4655]/30 transition-all">
                  <div
                    onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                    className="h-32 bg-[#0B0E14] rounded-xl p-2 flex items-center justify-center cursor-pointer relative"
                  >
                    <img src={toAssetUrl(img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 truncate" title={img.name}>{img.name}</span>
                    <button
                      onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                      className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

    </section>
  );
}
