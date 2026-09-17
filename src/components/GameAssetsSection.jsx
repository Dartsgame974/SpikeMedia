import React, { useState } from 'react';
import { Crosshair, Download, Image, Shield, Layers, Award, Box, Sparkles, Copy, Check, Eye, Film, Video, FileImage, MapPin } from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';
import { toAssetUrl, getRealBundleDisplayName, getRealBundleCodename } from '../utils/urlHelper';

export default function GameAssetsSection({ registry }) {
  const [activeSubTab, setActiveSubTab] = useState('icons'); // 'icons', 'maps', 'weapons', 'logos', 'ranks', 'backgrounds', 'overlays', 'spritesheets', 'misc'
  const [selectedIconSubCat, setSelectedIconSubCat] = useState('All');
  const [selectedMapCat, setSelectedMapCat] = useState('All');
  const [selectedBgCat, setSelectedBgCat] = useState('All');
  const [selectedWeaponFolder, setSelectedWeaponFolder] = useState('All');
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

  return (
    <section className="space-y-6">
      {/* Fullscreen Image Preview Lightbox */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="font-display font-extrabold text-2xl text-white">Valorant Game Assets & Image Library</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Browse and download high-resolution weapons artwork, all icon subdirectories, competitive rank badges, official logos, organized backgrounds, animated spritesheets, overlays, and player banner decorations.
          </p>
        </div>
      </div>

      {/* Sub-navigation Tabs (Grid Layout - 0 Horizontal Scrollbar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 bg-[#131722] p-1.5 rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveSubTab('icons')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'icons'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
          <span className="truncate">Icons ({iconCatNames.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('maps')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'maps'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Full Valorant Maps & Overhead Tactical Minimap Grids"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Maps ({mapsData.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('weapons')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'weapons'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="truncate">Weapons ({weapons.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logos')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'logos'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
          <span className="truncate">Logos ({imageLibraries.logos?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ranks')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'ranks'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Rankings & Competitive Badges"
        >
          <img src={toAssetUrl("Valorantek/ranks/Rang_27_RADIANT_icone_petite.png")} alt="" className="w-4 h-4 object-contain shrink-0" />
          <span className="truncate">Rankings ({imageLibraries.rankings?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('backgrounds')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'backgrounds'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Image className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Backgrounds ({imageLibraries.backgrounds?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('spritesheets')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'spritesheets'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Animated Spritesheets (GIF, MOV, MP4, PNG)"
        >
          <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="truncate">Spritesheets ({spritesheets.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('overlays')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'overlays'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Overlays ({imageLibraries.playerbannerAssets?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('misc')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-w-0 ${
            activeSubTab === 'misc'
              ? 'bg-[#FF4655] text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Box className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Misc ({imageLibraries.misc?.length || 0})</span>
        </button>
      </div>

      {/* MAPS & MINIMAPS CATALOG TAB */}
      {activeSubTab === 'maps' && (() => {
        const mapCategories = ['All', 'Competitive / Unrated', 'Team Deathmatch (TDM)', 'Training & Special'];
        const filteredMapsList = mapsData.filter(m => selectedMapCat === 'All' || m.category === selectedMapCat);

        return (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {mapCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedMapCat(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    selectedMapCat === cat
                      ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                      : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat} ({cat === 'All' ? mapsData.length : mapsData.filter(m => m.category === cat).length})
                </button>
              ))}
            </div>

            {/* Maps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMapsList.map((mapItem, idx) => {
                const mapImg = mapItem.minimap || mapItem.splash || mapItem.backgroundImage;
                if (!mapImg) return null;

                return (
                  <div
                    key={idx}
                    className="bg-[#131722] p-4 rounded-2xl border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 group relative overflow-hidden"
                  >
                    {/* Map Header Info */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display font-bold text-base text-white truncate group-hover:text-emerald-400 transition-colors">
                          {mapItem.displayName}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-display font-semibold shrink-0 ${
                          mapItem.category === 'Team Deathmatch (TDM)'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : mapItem.category === 'Competitive / Unrated'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {mapItem.category === 'Team Deathmatch (TDM)' ? 'TDM' : mapItem.category === 'Competitive / Unrated' ? 'Ranked' : 'Special'}
                        </span>
                      </div>
                      {mapItem.coordinates && (
                        <p className="text-[10px] font-mono text-slate-500 truncate">{mapItem.coordinates}</p>
                      )}
                    </div>

                    {/* Image Box */}
                    <div
                      onClick={() => setPreviewImage({ src: mapImg, title: `${mapItem.displayName} Map Asset` })}
                      className="h-56 bg-[#0B0E14] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative border border-white/5"
                    >
                      <img
                        src={toAssetUrl(mapImg)}
                        alt={mapItem.displayName}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform drop-shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                      <span className="text-[11px] font-mono text-slate-400 truncate">
                        {mapItem.minimap ? 'Tactical Minimap' : 'Map Splash Art'}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleCopyImage(mapImg, e)}
                          className={`p-1.5 rounded transition-colors ${
                            copiedPath === mapImg && copiedType === 'image'
                              ? 'bg-[#00F0FF]/20 text-[#00F0FF]'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                          title="Copy image to clipboard"
                        >
                          {copiedPath === mapImg && copiedType === 'image' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => handleDownload(mapImg, `${mapItem.displayName}_map.png`, e)}
                          className="p-1.5 rounded bg-white/5 hover:bg-emerald-500 text-slate-300 hover:text-white transition-colors"
                          title="Download map image"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ICONS CATALOG TAB */}
      {activeSubTab === 'icons' && (
        <div className="space-y-6">
          {/* Sub-category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedIconSubCat('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedIconSubCat === 'All'
                  ? 'bg-[#FF4655] text-white'
                  : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              All Categories ({iconCatNames.length})
            </button>
            {iconCatNames.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedIconSubCat(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  selectedIconSubCat === cat
                    ? 'bg-[#FF4655] text-white'
                    : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat} ({iconCategories[cat]?.length || 0})
              </button>
            ))}
          </div>

          {/* Icon Category Playlists */}
          <div className="space-y-6">
            {iconCatNames.map(cat => {
              if (selectedIconSubCat !== 'All' && selectedIconSubCat !== cat) return null;
              const iconsList = iconCategories[cat] || [];
              if (iconsList.length === 0) return null;

              return (
                <div key={cat} className="space-y-3">
                  <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>{cat}</span>
                    <span className="text-slate-500 font-normal">({iconsList.length} items)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {iconsList.slice(0, getLimit(cat, 36)).map((img, idx) => (
                      <div key={idx} className="bg-[#131722] p-3 rounded-2xl border border-white/5 flex flex-col justify-between space-y-2 group hover:border-[#00F0FF]/30 transition-all">
                        <div
                          onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                          className="h-28 bg-[#0B0E14] rounded-xl p-2 flex items-center justify-center cursor-pointer relative"
                          title="Click for full-screen preview"
                        >
                          <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" loading="lazy" decoding="async" />
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="font-medium text-slate-300 truncate" title={img.name}>{img.name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleCopyImage(img.relPath, e)}
                              className={`p-1.5 rounded transition-colors ${
                                copiedPath === img.relPath && copiedType === 'image'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                              }`}
                              title="Copier l'image dans le presse-papier"
                            >
                              {copiedPath === img.relPath && copiedType === 'image' ? <Check className="w-3.5 h-3.5" /> : <FileImage className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => handleCopyLink(img.relPath, e)}
                              className={`p-1.5 rounded transition-colors ${
                                copiedPath === img.relPath && copiedType === 'link'
                                  ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                                  : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                              }`}
                              title="Copier le lien"
                            >
                              {copiedPath === img.relPath && copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                              className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-300 transition-colors shrink-0"
                              title="Download icon"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {iconsList.length > getLimit(cat, 36) && (
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={() => handleShowMore(cat, 48)}
                        className="px-4 py-2 rounded-xl text-xs font-display font-semibold bg-[#131722] hover:bg-[#00F0FF] hover:text-black text-slate-300 border border-white/10 transition-colors"
                      >
                        Show More ({iconsList.length - getLimit(cat, 36)} remaining)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEAPONS TAB */}
      {activeSubTab === 'weapons' && (
        <div className="space-y-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedWeaponFolder('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedWeaponFolder === 'All'
                  ? 'bg-[#FF4655] text-white'
                  : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              All Weapons ({weapons.length})
            </button>
            {weapons.map(w => (
              <button
                key={w.name}
                onClick={() => setSelectedWeaponFolder(w.name)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  selectedWeaponFolder === w.name
                    ? 'bg-[#FF4655] text-white'
                    : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {w.name} ({w.imagesCount})
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {weapons.map(w => {
              if (selectedWeaponFolder !== 'All' && selectedWeaponFolder !== w.name) return null;

              return (
                <div key={w.name} className="space-y-3">
                  <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-[#FF4655]" />
                    <span>{w.name}</span>
                    <span className="text-slate-500 font-normal">({w.imagesCount} renders)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {w.images.map((img, idx) => (
                      <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 space-y-3 group hover:border-[#FF4655]/30 transition-all flex flex-col justify-between">
                        <div
                          onClick={() => setPreviewImage({ src: img.relPath, title: `${w.name} - ${img.displayName || img.name}` })}
                          className="h-32 bg-[#0B0E14] rounded-xl p-3 flex items-center justify-center cursor-pointer relative"
                          title="Click for full-screen preview"
                        >
                          <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" loading="lazy" decoding="async" />
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="font-medium text-slate-300 truncate" title={img.displayName || img.name}>{img.displayName || img.name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleCopyImage(img.relPath, e)}
                              className={`p-1.5 rounded transition-colors ${
                                copiedPath === img.relPath && copiedType === 'image'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                              }`}
                              title="Copier l'image dans le presse-papier"
                            >
                              {copiedPath === img.relPath && copiedType === 'image' ? <Check className="w-3.5 h-3.5" /> : <FileImage className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => handleCopyLink(img.relPath, e)}
                              className={`p-1.5 rounded transition-colors ${
                                copiedPath === img.relPath && copiedType === 'link'
                                  ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                                  : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                              }`}
                              title="Copier le lien"
                            >
                              {copiedPath === img.relPath && copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                              className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors shrink-0"
                              title="Download weapon image"
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
        </div>
      )}

      {/* LOGOS TAB */}
      {activeSubTab === 'logos' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(imageLibraries.logos || []).map((img, idx) => (
            <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3 group hover:border-[#00F0FF]/30 transition-all">
              <div
                onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                className="h-32 bg-[#0B0E14] rounded-xl p-3 flex items-center justify-center cursor-pointer relative"
                title="Click for full-screen preview"
              >
                <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" loading="lazy" decoding="async" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 truncate" title={img.name}>{img.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleCopyImage(img.relPath, e)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedPath === img.relPath && copiedType === 'image'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                    }`}
                    title="Copier l'image dans le presse-papier"
                  >
                    {copiedPath === img.relPath && copiedType === 'image' ? <Check className="w-3.5 h-3.5" /> : <FileImage className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleCopyLink(img.relPath, e)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedPath === img.relPath && copiedType === 'link'
                        ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                        : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                    }`}
                    title="Copier le lien"
                  >
                    {copiedPath === img.relPath && copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                    className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-300 transition-colors shrink-0"
                    title="Download logo"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RANKS TAB */}
      {activeSubTab === 'ranks' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(imageLibraries.rankings || []).map((img, idx) => (
            <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3 group hover:border-[#FF4655]/30 transition-all">
              <div
                onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                className="h-28 bg-[#0B0E14] rounded-xl p-3 flex items-center justify-center cursor-pointer relative"
                title="Click for full-screen preview"
              >
                <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" loading="lazy" decoding="async" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 truncate" title={img.name}>{img.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleCopyImage(img.relPath, e)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedPath === img.relPath && copiedType === 'image'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                    }`}
                    title="Copier l'image dans le presse-papier"
                  >
                    {copiedPath === img.relPath && copiedType === 'image' ? <Check className="w-3.5 h-3.5" /> : <FileImage className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleCopyLink(img.relPath, e)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedPath === img.relPath && copiedType === 'link'
                        ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                        : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                    }`}
                    title="Copier le lien"
                  >
                    {copiedPath === img.relPath && copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                    className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors shrink-0"
                    title="Download rank badge"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BACKGROUNDS TAB WITH ORGANIZED SUBCATEGORIES */}
      {activeSubTab === 'backgrounds' && (
        <div className="space-y-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedBgCat('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedBgCat === 'All'
                  ? 'bg-[#FF4655] text-white'
                  : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              All Backgrounds
            </button>
            {bgCatNames.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedBgCat(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  selectedBgCat === cat
                    ? 'bg-[#FF4655] text-white'
                    : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat} ({backgroundCategories[cat]?.length || 0})
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {bgCatNames.map(cat => {
              if (selectedBgCat !== 'All' && selectedBgCat !== cat) return null;
              const bgList = backgroundCategories[cat] || [];
              if (bgList.length === 0) return null;

              return (
                <div key={cat} className="space-y-3">
                  <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Image className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>{cat}</span>
                    <span className="text-slate-500 font-normal">({bgList.length} wallpapers)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {bgList.slice(0, getLimit(`bg_${cat}`, 24)).map((img, idx) => {
                      const displayTitle = getRealBundleDisplayName(img);
                      const displayCode = getRealBundleCodename(img);
                      return (
                        <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 space-y-3 group hover:border-[#FF4655]/30 transition-all">
                          <div
                            onClick={() => setPreviewImage({ src: img.relPath, title: displayTitle })}
                            className="h-44 bg-[#0B0E14] rounded-xl overflow-hidden cursor-pointer relative"
                            title="Click for full-screen preview"
                          >
                            <img src={toAssetUrl(img.thumbPath || img.relPath)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" decoding="async" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-white truncate text-sm" title={displayTitle}>
                                {displayTitle}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/20 truncate" title={`Internal Codename: ${displayCode}`}>
                                Codename: {displayCode}
                              </span>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={(e) => handleCopyImage(img.relPath, e)}
                                className={`p-1.5 rounded transition-colors ${
                                  copiedPath === img.relPath && copiedType === 'image'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                                }`}
                                title="Copy image to clipboard"
                              >
                                {copiedPath === img.relPath && copiedType === 'image' ? <Check className="w-3.5 h-3.5" /> : <FileImage className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={(e) => handleCopyLink(img.relPath, e)}
                                className={`p-1.5 rounded transition-colors ${
                                  copiedPath === img.relPath && copiedType === 'link'
                                    ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                                    : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                                }`}
                                title="Copy asset URL"
                              >
                                {copiedPath === img.relPath && copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                                className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors flex items-center gap-1 shrink-0 text-xs whitespace-nowrap"
                              >
                                <Download className="w-3 h-3 shrink-0" />
                                <span className="whitespace-nowrap">Download</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                  {bgList.length > getLimit(`bg_${cat}`, 24) && (
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={() => handleShowMore(`bg_${cat}`, 24)}
                        className="px-4 py-2 rounded-xl text-xs font-display font-semibold bg-[#131722] hover:bg-[#FF4655] hover:text-white text-slate-300 border border-white/10 transition-colors"
                      >
                        Show More Wallpapers ({bgList.length - getLimit(`bg_${cat}`, 24)} remaining)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SPRITESHEETS TAB (ANIMATED GIF, MOV, MP4, RAW PNG) */}
      {activeSubTab === 'spritesheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spritesheets.map((sp, idx) => (
            <div key={idx} className="bg-[#131722] p-5 rounded-3xl border border-white/5 space-y-4 group hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-400" />
                    <span>{sp.name}</span>
                  </h3>
                  <span className="text-[10px] font-display font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Animated Spritesheet
                  </span>
                </div>
                {/* Media Preview Box */}
                <div
                  onClick={() => setPreviewImage({ src: sp.gif || sp.rawPng, title: sp.name })}
                  className="h-56 bg-[#0B0E14] rounded-2xl overflow-hidden flex items-center justify-center p-3 cursor-pointer relative group/img"
                  title="Click for full-screen preview"
                >
                  {sp.mp4 ? (
                    <video
                      src={toAssetUrl(sp.mp4)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-h-full max-w-full object-contain rounded-xl"
                    />
                  ) : sp.gif ? (
                    <img src={toAssetUrl(sp.gif)} alt="" className="max-h-full max-w-full object-contain rounded-xl" />
                  ) : (
                    <img src={toAssetUrl(sp.rawPng)} alt="" className="max-h-full max-w-full object-contain rounded-xl" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Multi-Format Download & Copy Bar */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Download Formats & Export Versions</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyImage(sp.rawPng, e)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        copiedPath === sp.rawPng && copiedType === 'image'
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                      }`}
                      title="Copier l'image dans le presse-papier"
                    >
                      {copiedPath === sp.rawPng && copiedType === 'image' ? <Check className="w-3 h-3" /> : <FileImage className="w-3 h-3" />}
                      <span>Copier Image</span>
                    </button>
                    <button
                      onClick={(e) => handleCopyLink(sp.rawPng, e)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        copiedPath === sp.rawPng && copiedType === 'link'
                          ? 'bg-[#00F0FF] text-black'
                          : 'bg-[#00F0FF]/10 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black border border-[#00F0FF]/20'
                      }`}
                      title="Copier le lien"
                    >
                      {copiedPath === sp.rawPng && copiedType === 'link' ? <Check className="w-3 h-3" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>

                {/* Native / Square Version (Pure Animation) */}
                <div className="bg-[#0B0E14] p-2.5 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-display uppercase tracking-widest text-slate-400 font-bold block">
                    Version 1: Native 1:1 (Square Pure Animation)
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sp.gif && (
                      <button
                        onClick={(e) => handleDownload(sp.gif, `${sp.baseName}_square.gif`, e)}
                        className="px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                        title="Download Native Square GIF"
                      >
                        <Download className="w-3 h-3 shrink-0" />
                        <span>GIF (1:1)</span>
                      </button>
                    )}
                    {sp.mov && (
                      <button
                        onClick={(e) => handleDownload(sp.mov, `${sp.baseName}_square.mov`, e)}
                        className="px-2 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                        title="Download Native Square MOV with Alpha Transparency"
                      >
                        <Download className="w-3 h-3 shrink-0" />
                        <span>MOV (Alpha)</span>
                      </button>
                    )}
                    {sp.mp4 && (
                      <button
                        onClick={(e) => handleDownload(sp.mp4, `${sp.baseName}_square.mp4`, e)}
                        className="px-2 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                        title="Download Native Square MP4"
                      >
                        <Download className="w-3 h-3 shrink-0" />
                        <span>MP4 (1:1)</span>
                      </button>
                    )}
                    {sp.rawPng && (
                      <button
                        onClick={(e) => handleDownload(sp.rawPng, `${sp.baseName}_raw_spritesheet.png`, e)}
                        className="px-2 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                        title="Download Raw Spritesheet Grid PNG"
                      >
                        <Download className="w-3 h-3 shrink-0" />
                        <span>Raw PNG</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 16:9 Widescreen Stretched Version */}
                {sp.has16x9 && sp.widescreen16x9 && (
                  <div className="bg-[#0B0E14] p-2.5 rounded-xl border border-purple-500/20 space-y-1.5">
                    <span className="text-[10px] font-display uppercase tracking-widest text-purple-300 font-bold block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Version 2: 16:9 Widescreen Stretched (1920x1080 HD Transition)</span>
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {sp.widescreen16x9.gif && (
                        <button
                          onClick={(e) => handleDownload(sp.widescreen16x9.gif, `${sp.baseName}_16x9.gif`, e)}
                          className="px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          title="Download 16:9 Widescreen Stretched GIF"
                        >
                          <Download className="w-3 h-3 shrink-0" />
                          <span>GIF 16:9</span>
                        </button>
                      )}
                      {sp.widescreen16x9.mov && (
                        <button
                          onClick={(e) => handleDownload(sp.widescreen16x9.mov, `${sp.baseName}_16x9.mov`, e)}
                          className="px-2 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          title="Download 16:9 Widescreen MOV with Alpha Transparency"
                        >
                          <Download className="w-3 h-3 shrink-0" />
                          <span>MOV 16:9 (Alpha)</span>
                        </button>
                      )}
                      {sp.widescreen16x9.mp4 && (
                        <button
                          onClick={(e) => handleDownload(sp.widescreen16x9.mp4, `${sp.baseName}_16x9.mp4`, e)}
                          className="px-2 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          title="Download 16:9 Widescreen MP4 Video"
                        >
                          <Download className="w-3 h-3 shrink-0" />
                          <span>MP4 16:9</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OVERLAYS TAB */}
      {activeSubTab === 'overlays' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(imageLibraries.playerbannerAssets || []).concat(imageLibraries.overlays || []).map((img, idx) => (
            <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3 group hover:border-[#00F0FF]/30 transition-all">
              <div
                onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                className="h-32 bg-[#0B0E14] rounded-xl p-2 flex items-center justify-center cursor-pointer relative"
                title="Click for full-screen preview"
              >
                <img src={toAssetUrl(img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 truncate" title={img.name}>{img.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleCopyImage(img.relPath, e)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedPath === img.relPath && copiedType === 'image'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                    }`}
                    title="Copier l'image dans le presse-papier"
                  >
                    {copiedPath === img.relPath && copiedType === 'image' ? <Check className="w-3.5 h-3.5" /> : <FileImage className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleCopyLink(img.relPath, e)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedPath === img.relPath && copiedType === 'link'
                        ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                        : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                    }`}
                    title="Copier le lien"
                  >
                    {copiedPath === img.relPath && copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                    className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-300 transition-colors shrink-0"
                    title="Download banner asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MISC TAB */}
      {activeSubTab === 'misc' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(imageLibraries.misc || []).map((img, idx) => (
            <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3 group hover:border-[#FF4655]/30 transition-all">
              <div
                onClick={() => setPreviewImage({ src: img.relPath, title: img.name })}
                className="h-32 bg-[#0B0E14] rounded-xl p-2 flex items-center justify-center cursor-pointer relative"
                title="Click for full-screen preview"
              >
                <img src={toAssetUrl(img.relPath)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 truncate" title={img.name}>{img.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleCopyImage(img.relPath, e)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedPath === img.relPath && copiedType === 'image'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30'
                    }`}
                    title="Copier l'image dans le presse-papier"
                  >
                    {copiedPath === img.relPath && copiedType === 'image' ? <Check className="w-3.5 h-3.5" /> : <FileImage className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleCopyLink(img.relPath, e)}
                    className={`p-1.5 rounded transition-colors ${
                      copiedPath === img.relPath && copiedType === 'link'
                        ? 'text-[#00F0FF] bg-[#00F0FF]/10'
                        : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                    }`}
                    title="Copier le lien"
                  >
                    {copiedPath === img.relPath && copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => handleDownload(img.relPath, img.filename, e)}
                    className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors shrink-0"
                    title="Download misc asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Lightbox Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          imageSrc={previewImage.src}
          title={previewImage.title}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </section>
  );
}
