import React, { useState } from 'react';
import { X, Download, Disc, Image, Volume2, Copy, Check, Eye, Search, Filter, Sparkles, Music, Layers } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';
import ImagePreviewModal from './ImagePreviewModal';
import { toAssetUrl } from '../utils/urlHelper';

export default function AgentDetailModal({ agent, onClose }) {
  const [activeTab, setActiveTab] = useState('starterpack');
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);

  // Gauntlet Chromas state
  const [selectedChromaColor, setSelectedChromaColor] = useState('All');

  // SFX Tab filters
  const [sfxCategory, setSfxCategory] = useState('All');
  const [sfxSearch, setSfxSearch] = useState('');
  const [sfxTagFilter, setSfxTagFilter] = useState('');

  if (!agent) return null;

  const gauntletChromas = agent.assets?.gauntletChromas || {};
  const hasGauntletChromas = Object.keys(gauntletChromas).length > 0 && Object.values(gauntletChromas).some(c => (c.abilityDraftPortraits?.length > 0 || c.minimapPortraits?.length > 0 || c.killfeedIcons?.length > 0));
  const hypePreview = agent.assets?.hypePreview;

  const bannerPortrait = agent.assets?.fullPortrait || agent.assets?.bustPortrait;
  const bustPortrait = agent.assets?.bustPortrait || agent.assets?.fullPortrait;
  const fullPortrait = agent.assets?.fullPortrait;
  const squareIcon = agent.assets?.squareIcon;
  const killfeedIcon = agent.assets?.killfeedIcon;
  const minimapIcon = agent.assets?.minimapIcon;
  const wallpaper = agent.assets?.wallpaper;
  const minimapIcons = agent.assets?.minimapIcons || [];
  const abilityIcons = agent.assets?.abilityIcons || [];

  const rawPosters = agent.assets?.posters || [];
  const fullPortraitsList = agent.assets?.fullPortraitsList?.length > 0 
    ? agent.assets.fullPortraitsList 
    : rawPosters.filter(p => p.filename.toLowerCase().includes('fullportrait') || p.filename.toLowerCase().includes('portrait_complet'));
  
  const displayIconsList = agent.assets?.displayIconsList?.length > 0 
    ? agent.assets.displayIconsList 
    : rawPosters.filter(p => p.filename.toLowerCase().includes('portraitdisplayicon') || p.filename.toLowerCase().includes('icone_carree'));
  
  const wallpapersList = agent.assets?.wallpapersList?.length > 0 
    ? agent.assets.wallpapersList 
    : rawPosters.filter(p => !p.filename.toLowerCase().includes('fullportrait') && !p.filename.toLowerCase().includes('portraitdisplayicon') && !p.filename.toLowerCase().includes('portrait_complet'));

  const extraArtworks = agent.assets?.extraArtworks || [];

  const audioCategories = agent.audioCategories || {};
  const categoryNames = Object.keys(audioCategories);

  const [copiedType, setCopiedType] = useState(null);

  const handleDownloadAsset = (path, name, e) => {
    if (e) e.stopPropagation();
    const a = document.createElement('a');
    a.href = toAssetUrl(path);
    a.download = name || `${agent.name}_asset.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyAssetLink = (path, e) => {
    if (e) e.stopPropagation();
    const fullUrl = toAssetUrl(path);
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    setCopiedType('link');
    setTimeout(() => {
      setCopiedPath(null);
      setCopiedType(null);
    }, 2000);
  };

  const handleCopyImageAsset = async (path, e) => {
    if (e) e.stopPropagation();
    try {
      const fullUrl = toAssetUrl(path);
      const response = await fetch(fullUrl);
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
      console.warn('Copy image failed:', err);
      handleCopyAssetLink(path, e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0E14]/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#131722] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Fullscreen Image Preview Lightbox */}
        {previewImage && (
          <ImagePreviewModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}

        {/* Banner Header - Compact on mobile screens to ensure tabs are visible without scrolling */}
        <div className="relative h-28 sm:h-72 bg-gradient-to-r from-[#161B22] via-[#0F141C] to-[#1C2230] p-3 sm:p-6 flex flex-col justify-end overflow-hidden shrink-0 border-b border-white/5">
          {wallpaper && (
            <img
              src={toAssetUrl(wallpaper)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-[2px]"
            />
          )}

          {bannerPortrait && (
            <img
              src={toAssetUrl(bannerPortrait)}
              alt={agent.name}
              className="hidden sm:block absolute right-4 sm:right-12 top-0 h-[140%] object-cover object-top drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] pointer-events-none"
            />
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-[#0B0E14]/80 hover:bg-[#FF4655] text-slate-400 hover:text-white transition-colors border border-white/10 z-10"
            title="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="relative z-10 max-w-xl space-y-1.5 sm:space-y-3">
            <div className="flex items-center gap-2">
              {agent.roleIconPath ? (
                <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0B0E14]/90 border border-white/10 flex items-center gap-1.5 text-[10px] sm:text-xs font-display font-medium text-slate-200">
                  <img src={toAssetUrl(agent.roleIconPath)} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain shrink-0" />
                  <span className="whitespace-nowrap">{agent.role || 'Valorant Agent'}</span>
                </div>
              ) : (
                <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0B0E14]/90 border border-white/10 text-[10px] sm:text-xs font-display font-medium text-slate-200 whitespace-nowrap">
                  <span>{agent.role || 'Valorant Agent'}</span>
                </div>
              )}

              {agent.developerName && (
                <span className="text-[10px] sm:text-xs font-display text-slate-400 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/5 whitespace-nowrap">
                  Codename: {agent.developerName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {squareIcon && (
                <img
                  src={toAssetUrl(squareIcon)}
                  alt=""
                  onClick={() => setPreviewImage({ src: squareIcon, title: `${agent.name} Square Icon` })}
                  className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border-2 border-[#FF4655] shadow-lg shadow-[#FF4655]/30 object-cover shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  title="Click to view full preview"
                />
              )}
              <div>
                <h1 className="font-display font-extrabold text-xl sm:text-4xl text-white tracking-tight">
                  {agent.name}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Sticky top on modal viewport */}
        <div className="sticky top-0 z-20 px-3 sm:px-6 pt-2 sm:pt-4 bg-[#0F141C] border-b border-white/5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => setActiveTab('starterpack')}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'starterpack'
                  ? 'border-[#FF4655] text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00F0FF] shrink-0" />
              <span className="whitespace-nowrap">1. Media Packaging (Starter Pack)</span>
            </button>

            <button
              onClick={() => setActiveTab('posters')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'posters'
                  ? 'border-[#FF4655] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FF4655] shrink-0" />
              <span className="whitespace-nowrap">2. Official Wallpapers & Key Art</span>
              {wallpapersList.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#FF4655]/20 text-[#FF4655] border border-[#FF4655]/30 font-bold">
                  {wallpapersList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sfx')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'sfx'
                  ? 'border-[#FF4655] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span className="whitespace-nowrap">3. Agent SFX Library</span>
            </button>

            {hasGauntletChromas && (
              <button
                onClick={() => setActiveTab('gauntlet')}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activeTab === 'gauntlet'
                    ? 'border-[#FF4655] text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="whitespace-nowrap">4. Gauntlet Mode Chromas</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  8 Colors
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {activeTab === 'starterpack' && (
            <div className="space-y-8">
              {hasGauntletChromas && (
                <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/10 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>Filtres de Couleurs / Feutres Gauntlet Mode ({agent.name})</span>
                    </span>
                    <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      48 Chromas & Standard
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
                    {[
                      { name: 'All', label: 'Tous les Coloris', bg: 'bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500' },
                      { name: 'Standard', label: 'Standard (Normal)', bg: 'bg-slate-400' },
                      { name: 'Blue', label: 'Bleu', bg: 'bg-blue-600' },
                      { name: 'Cyan', label: 'Cyan', bg: 'bg-cyan-500' },
                      { name: 'Green', label: 'Vert', bg: 'bg-emerald-500' },
                      { name: 'Orange', label: 'Orange', bg: 'bg-orange-500' },
                      { name: 'Pink', label: 'Rose', bg: 'bg-pink-500' },
                      { name: 'Purple', label: 'Violet', bg: 'bg-purple-600' },
                      { name: 'Red', label: 'Rouge', bg: 'bg-red-600' },
                      { name: 'Yellow', label: 'Jaune', bg: 'bg-yellow-500' }
                    ].map(col => {
                      const isSel = selectedChromaColor === col.name;
                      return (
                        <button
                          key={col.name}
                          onClick={() => setSelectedChromaColor(col.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all flex items-center gap-2 shrink-0 ${
                            isSel
                              ? `${col.bg} text-white shadow-lg border-2 border-white scale-105`
                              : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${col.bg} border border-white/40 shrink-0`} />
                          <span>{col.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Full 4K Character Portraits Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-display text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Full 4K Character Portraits & Full Cutouts ({fullPortraitsList.length + (bustPortrait && !fullPortraitsList.some(p => p.relPath === bustPortrait) ? 1 : 0) + (fullPortrait && fullPortrait !== bustPortrait && !fullPortraitsList.some(p => p.relPath === fullPortrait) ? 1 : 0)})</span>
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {bustPortrait && !fullPortraitsList.some(p => p.relPath === bustPortrait) && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#00F0FF]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: bustPortrait, title: `${agent.name} Bust Portrait` })}
                        className="h-44 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(bustPortrait)} alt="" className="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 truncate" title="Bust Portrait">Bust Portrait</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(bustPortrait, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === bustPortrait ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === bustPortrait ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(bustPortrait, `${agent.name}_bust_portrait.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-300 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {fullPortraitsList.map((fp, idx) => (
                    <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between group hover:border-[#00F0FF]/40 transition-all shadow-lg">
                      <div
                        onClick={() => setPreviewImage({ src: fp.relPath || fp.path, title: `${agent.name} - ${fp.name}` })}
                        className="h-44 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(fp.thumbPath || fp.relPath || fp.path)} alt="" className="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-200 truncate max-w-[130px]" title={fp.name}>{fp.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(fp.relPath || fp.path, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === (fp.relPath || fp.path) ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === (fp.relPath || fp.path) ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(fp.relPath || fp.path, fp.filename || `${fp.name}.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-300 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display Avatars, Badges & Icons Section */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Image className="w-3.5 h-3.5 text-[#FF4655]" />
                    <span>Display Avatars, Badges & Small Icons ({displayIconsList.length + (squareIcon && !displayIconsList.some(i => i.relPath === squareIcon) ? 1 : 0) + (hypePreview ? 1 : 0)})</span>
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {squareIcon && !displayIconsList.some(i => i.relPath === squareIcon) && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: squareIcon, title: `${agent.name} Square Icon` })}
                        className="h-32 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(squareIcon)} alt="" className="w-20 h-20 object-contain rounded-xl group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 truncate">Square Icon</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(squareIcon, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === squareIcon ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === squareIcon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(squareIcon, `${agent.name}_square_icon.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {hypePreview && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-purple-500/40 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: hypePreview, title: `${agent.name} Hype Master Icon` })}
                        className="h-32 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(hypePreview)} alt="" className="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 truncate">Hype Master Icon</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(hypePreview, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === hypePreview ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === hypePreview ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(hypePreview, `${agent.name}_hype_master_icon.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {displayIconsList.map((ic, idx) => (
                    <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/40 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: ic.relPath || ic.path, title: `${agent.name} - ${ic.name}` })}
                        className="h-32 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(ic.thumbPath || ic.relPath || ic.path)} alt="" className="w-20 h-20 object-contain rounded-xl group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 truncate max-w-[100px]" title={ic.name}>{ic.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(ic.relPath || ic.path, e)}
                            className={`p-1 rounded transition-colors ${
                              copiedPath === (ic.relPath || ic.path) ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === (ic.relPath || ic.path) ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(ic.relPath || ic.path, ic.filename || `${ic.name}.png`, e)}
                            className="p-1 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {hasGauntletChromas && selectedChromaColor !== 'Standard' && (() => {
                const colors = ['Blue', 'Cyan', 'Green', 'Orange', 'Pink', 'Purple', 'Red', 'Yellow'];
                const selectedColors = selectedChromaColor === 'All' ? colors : [selectedChromaColor];
                
                const allChromaPortraits = [];
                const allChromaMinimaps = [];
                const allChromaKillfeeds = [];

                for (const cName of selectedColors) {
                  const data = gauntletChromas[cName];
                  if (data) {
                    (data.abilityDraftPortraits || []).forEach(item => allChromaPortraits.push({ ...item, colorName: cName }));
                    (data.minimapPortraits || []).forEach(item => allChromaMinimaps.push({ ...item, colorName: cName }));
                    (data.killfeedIcons || []).forEach(item => allChromaKillfeeds.push({ ...item, colorName: cName }));
                  }
                }

                return (
                  <div className="space-y-6 pt-4 border-t border-white/10">
                    {allChromaPortraits.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-display text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gauntlet Mode Ability Draft Portraits ({selectedChromaColor === 'All' ? 'Toutes les Couleurs' : selectedChromaColor})</span>
                          <span className="text-slate-500 font-normal">({allChromaPortraits.length} portraits)</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {allChromaPortraits.map((item, idx) => (
                            <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between group hover:border-purple-500/50 transition-all shadow-lg">
                              <div
                                onClick={() => setPreviewImage({ src: item.path, title: `${agent.name} ${item.colorName} Portrait (${item.state})` })}
                                className="h-44 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                              >
                                <img src={toAssetUrl(item.path)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs pt-1">
                                <span className="font-bold text-white text-[11px] truncate">{item.colorName} ({item.state})</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={(e) => handleCopyImageAsset(item.path, e)}
                                    className={`p-1.5 rounded transition-colors ${
                                      copiedPath === item.path ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                    }`}
                                    title="Copy image to clipboard"
                                  >
                                    {copiedPath === item.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={(e) => handleDownloadAsset(item.path, item.filename, e)}
                                    className="p-1.5 rounded bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {allChromaMinimaps.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-display text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gauntlet Mode Minimap Round Portraits ({selectedChromaColor === 'All' ? 'Toutes les Couleurs' : selectedChromaColor})</span>
                          <span className="text-slate-500 font-normal">({allChromaMinimaps.length} vignettes)</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {allChromaMinimaps.map((item, idx) => (
                            <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between group hover:border-cyan-500/50 transition-all shadow-lg">
                              <div
                                onClick={() => setPreviewImage({ src: item.path, title: `${agent.name} ${item.colorName} Minimap (${item.state})` })}
                                className="h-28 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                              >
                                <img src={toAssetUrl(item.path)} alt="" className="w-16 h-16 object-contain rounded-full border border-white/10 group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-5 h-5 text-white" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs pt-1">
                                <span className="font-semibold text-slate-300 text-[10px] truncate">{item.colorName} ({item.state})</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={(e) => handleCopyImageAsset(item.path, e)}
                                    className={`p-1 rounded transition-colors ${
                                      copiedPath === item.path ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                    }`}
                                    title="Copy image to clipboard"
                                  >
                                    {copiedPath === item.path ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                  <button
                                    onClick={(e) => handleDownloadAsset(item.path, item.filename, e)}
                                    className="p-1 rounded bg-white/5 hover:bg-cyan-500 text-slate-300 hover:text-white transition-colors"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {allChromaKillfeeds.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-display text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gauntlet Mode Killfeed Icons ({selectedChromaColor === 'All' ? 'Toutes les Couleurs' : selectedChromaColor})</span>
                          <span className="text-slate-500 font-normal">({allChromaKillfeeds.length} icônes)</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {allChromaKillfeeds.map((item, idx) => (
                            <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between group hover:border-red-500/50 transition-all shadow-lg">
                              <div
                                onClick={() => setPreviewImage({ src: item.path, title: `${agent.name} ${item.colorName} Killfeed (${item.state})` })}
                                className="h-24 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                              >
                                <img src={toAssetUrl(item.path)} alt="" className="h-8 object-contain group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-5 h-5 text-white" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs pt-1">
                                <span className="font-semibold text-slate-300 text-[10px] truncate">{item.colorName} ({item.state})</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={(e) => handleCopyImageAsset(item.path, e)}
                                    className={`p-1 rounded transition-colors ${
                                      copiedPath === item.path ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                    }`}
                                    title="Copy image to clipboard"
                                  >
                                    {copiedPath === item.path ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                  <button
                                    onClick={(e) => handleDownloadAsset(item.path, item.filename, e)}
                                    className="p-1 rounded bg-white/5 hover:bg-red-500 text-slate-300 hover:text-white transition-colors"
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}



              {abilityIcons.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Ability Icons
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {abilityIcons.map((abil, idx) => (
                      <div key={idx} className="bg-[#0B0E14] p-3 rounded-xl border border-white/5 flex items-center justify-between gap-2 group hover:border-[#00F0FF]/30 transition-all">
                        <div
                          onClick={() => setPreviewImage({ src: abil.path, title: `${agent.name} - ${abil.filename}` })}
                          className="w-10 h-10 rounded bg-[#131722] p-1.5 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        >
                          <img src={toAssetUrl(abil.path)} alt="" className="w-full h-full object-contain opacity-90" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-slate-300 truncate" title={abil.filename}>
                            {abil.filename.replace(/\.[^/.]+$/, '')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(abil.path, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === abil.path ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === abil.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(abil.path, abil.filename, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-400 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {minimapIcons.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Minimap Icons
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {minimapIcons.map((mm, idx) => (
                      <div key={idx} className="bg-[#0B0E14] p-3 rounded-xl border border-white/5 flex items-center justify-between gap-2 group hover:border-[#00F0FF]/30 transition-all">
                        <div
                          onClick={() => setPreviewImage({ src: mm.path, title: `${agent.name} - Minimap Icon` })}
                          className="w-10 h-10 rounded bg-[#131722] p-1.5 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        >
                          <img src={toAssetUrl(mm.path)} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-slate-300 truncate" title={mm.filename}>
                            {mm.filename.replace(/\.[^/.]+$/, '')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(mm.path, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === mm.path ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === mm.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(mm.path, mm.filename, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-400 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF4655]" />
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    Official {agent.name} Background Wallpapers & Key Art Gallery
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-display">
                  {wallpapersList.length} background wallpapers
                </span>
              </div>

              {wallpapersList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {wallpapersList.map((poster, idx) => (
                    <div key={idx} className="bg-[#0B0E14] p-3.5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between group hover:border-[#FF4655]/50 transition-all shadow-xl">
                      <div
                        onClick={() => setPreviewImage({ src: poster.relPath || poster.path, title: `${agent.name} - ${poster.name}` })}
                        className="h-56 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-1 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(poster.thumbPath || poster.relPath || poster.path)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-bold text-white truncate max-w-[180px]" title={poster.name}>{poster.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(poster.relPath || poster.path, e)}
                            className={`p-2 rounded-lg transition-colors ${
                              copiedPath === (poster.relPath || poster.path) ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === (poster.relPath || poster.path) ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(poster.relPath || poster.path, poster.filename || `${poster.name}.png`, e)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                            title="Download wallpaper"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 font-display text-xs bg-[#0B0E14] rounded-2xl border border-white/5">
                  No additional posters available for {agent.name} yet.
                </div>
              )}
            </div>
          )}

          {activeTab === 'sfx' && (() => {
            let totalSFXClips = 0;
            const parsedCategories = categoryNames.map(catName => {
              const catObj = audioCategories[catName];
              const clips = catObj?.clips || (Array.isArray(catObj) ? catObj : []);
              const iconPath = catObj?.icon;
              totalSFXClips += clips.length;
              return { name: catName, clips, iconPath };
            }).filter(cat => cat.clips.length > 0);

            const soundTags = [
              { label: 'All Types', value: '' },
              { label: 'Idle', value: 'idle' },
              { label: 'Equip', value: 'equip' },
              { label: 'Cast', value: 'cast' },
              { label: 'Hit', value: 'hit' },
              { label: 'Loop', value: 'loop' },
              { label: 'Run / Move', value: 'run' },
            ];

            const filteredCategories = parsedCategories.map(cat => {
              if (sfxCategory !== 'All' && sfxCategory !== cat.name) {
                return { ...cat, clips: [] };
              }

              const matchingClips = cat.clips.filter(clip => {
                const clipName = (clip.name || clip.filename || '').toLowerCase();
                const matchesSearch = !sfxSearch || clipName.includes(sfxSearch.toLowerCase());
                const matchesTag = !sfxTagFilter || clipName.includes(sfxTagFilter.toLowerCase());
                return matchesSearch && matchesTag;
              });

              return { ...cat, clips: matchingClips };
            }).filter(cat => cat.clips.length > 0);

            const totalFilteredClips = filteredCategories.reduce((acc, cat) => acc + cat.clips.length, 0);

            return (
              <div className="space-y-5">
                {/* SFX Filter Header & Search Bar */}
                <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                  {/* Category Pills Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
                    <button
                      onClick={() => setSfxCategory('All')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-2 shrink-0 ${
                        sfxCategory === 'All'
                          ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                          : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                      }`}
                    >
                      <Music className="w-3.5 h-3.5" />
                      <span>All Categories</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                        sfxCategory === 'All' ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'
                      }`}>
                        {totalSFXClips}
                      </span>
                    </button>

                    {parsedCategories.map(cat => {
                      const isActive = sfxCategory === cat.name;
                      const displayName = cat.name.replace(/_/g, ' ');

                      return (
                        <button
                          key={cat.name}
                          onClick={() => setSfxCategory(cat.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-2 shrink-0 ${
                            isActive
                              ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                              : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                          }`}
                        >
                          {cat.iconPath ? (
                            <img src={toAssetUrl(cat.iconPath)} alt="" className="w-4 h-4 object-contain shrink-0" />
                          ) : (
                            <Disc className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                          )}
                          <span className="whitespace-nowrap">{displayName}</span>
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                            isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'
                          }`}>
                            {cat.clips.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar & Tag Badges */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={sfxSearch}
                        onChange={(e) => setSfxSearch(e.target.value)}
                        placeholder={`Search SFX audio clips for ${agent.name}...`}
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#131722] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4655] transition-colors"
                      />
                      {sfxSearch && (
                        <button
                          onClick={() => setSfxSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Quick Tag Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 shrink-0">
                      <span className="text-[11px] font-display text-slate-500 uppercase tracking-wider font-semibold mr-1 shrink-0 flex items-center gap-1">
                        <Filter className="w-3 h-3 text-[#00F0FF]" /> Type:
                      </span>
                      {soundTags.map(tag => {
                        const isTagActive = sfxTagFilter === tag.value;
                        return (
                          <button
                            key={tag.value}
                            onClick={() => setSfxTagFilter(tag.value)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-display transition-all whitespace-nowrap shrink-0 ${
                              isTagActive
                                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                                : 'bg-[#131722] text-slate-400 hover:text-slate-200 border border-white/5'
                            }`}
                          >
                            {tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Filter Summary Bar */}
                  {(sfxSearch || sfxTagFilter || sfxCategory !== 'All') && (
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>Showing <strong className="text-white">{totalFilteredClips}</strong> of {totalSFXClips} audio clips</span>
                      </div>
                      <button
                        onClick={() => {
                          setSfxCategory('All');
                          setSfxSearch('');
                          setSfxTagFilter('');
                        }}
                        className="text-xs text-[#FF4655] hover:underline font-display font-medium"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* SFX Clips Display Grid */}
                {filteredCategories.length > 0 ? (
                  <div className="space-y-6">
                    {filteredCategories.map(cat => {
                      const displayName = cat.name.replace(/_/g, ' ');

                      return (
                        <div key={cat.name} className="space-y-3 bg-[#0B0E14]/60 p-4 rounded-2xl border border-white/5">
                          <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <div className="flex items-center gap-3">
                              {cat.iconPath ? (
                                <div className="w-8 h-8 rounded bg-[#131722] p-1 border border-white/10 flex items-center justify-center shrink-0">
                                  <img src={toAssetUrl(cat.iconPath)} alt="" className="w-full h-full object-contain" />
                                </div>
                              ) : (
                                <Disc className="w-5 h-5 text-[#FF4655] shrink-0" />
                              )}
                              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                                {displayName}
                              </h3>
                            </div>
                            <span className="text-xs font-display text-slate-400 whitespace-nowrap">
                              {cat.clips.length} audio clips
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {cat.clips.map((clip, idx) => (
                              <AudioPlayerSlim
                                key={idx}
                                title={clip.name}
                                src={toAssetUrl(clip.relPath)}
                                filename={`${agent.name}_${clip.filename}`}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 bg-[#0B0E14]/40 rounded-2xl border border-white/5 text-center text-slate-400 font-display text-sm space-y-2">
                    <p className="font-semibold text-white">No audio clips found matching your search or filters.</p>
                    <button
                      onClick={() => {
                        setSfxCategory('All');
                        setSfxSearch('');
                        setSfxTagFilter('');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FF4655] text-white text-xs font-display font-medium hover:bg-[#FF4655]/80 transition-colors inline-block mt-2"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'gauntlet' && (
            <div className="space-y-6">
              <div className="bg-[#0B0E14] p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>{agent.name} Gauntlet Mode Chromas ({selectedChromaColor})</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Explore all 8 color variants of Ability Draft portraits, minimap icons, and killfeed badges for {agent.name}.
                    </p>
                  </div>
                </div>

                {/* Color Selector Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
                  {[
                    { name: 'Blue', bg: 'bg-blue-600' },
                    { name: 'Cyan', bg: 'bg-cyan-500' },
                    { name: 'Green', bg: 'bg-emerald-500' },
                    { name: 'Orange', bg: 'bg-orange-500' },
                    { name: 'Pink', bg: 'bg-pink-500' },
                    { name: 'Purple', bg: 'bg-purple-600' },
                    { name: 'Red', bg: 'bg-red-600' },
                    { name: 'Yellow', bg: 'bg-yellow-500' }
                  ].map(col => {
                    const isSel = selectedChromaColor === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setSelectedChromaColor(col.name)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center gap-2 shrink-0 ${
                          isSel
                            ? `${col.bg} text-white shadow-lg border-2 border-white scale-105`
                            : 'bg-[#131722] text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${col.bg} border border-white/30`} />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Color Assets Grid */}
              {(() => {
                const activeChroma = gauntletChromas[selectedChromaColor] || { abilityDraftPortraits: [], minimapPortraits: [], killfeedIcons: [] };
                return (
                  <div className="space-y-6">
                    {activeChroma.abilityDraftPortraits.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <span>Ability Draft Portraits ({selectedChromaColor})</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {activeChroma.abilityDraftPortraits.map((item, idx) => (
                            <div key={idx} className="bg-[#0B0E14] p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 group hover:border-purple-500/50 transition-all shadow-xl">
                              <div
                                onClick={() => setPreviewImage({ src: item.path, title: `${agent.name} ${selectedChromaColor} AbilityDraft Portrait (${item.state})` })}
                                className="h-52 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                              >
                                <img src={toAssetUrl(item.path)} alt="" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-7 h-7 text-white" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs pt-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">State: {item.state}</span>
                                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{selectedChromaColor}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={(e) => handleCopyImageAsset(item.path, e)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      copiedPath === item.path ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                    }`}
                                    title="Copy image to clipboard"
                                  >
                                    {copiedPath === item.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={(e) => handleDownloadAsset(item.path, item.filename, e)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                                    title="Download portrait"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeChroma.minimapPortraits.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Minimap Round Portraits ({selectedChromaColor})</span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {activeChroma.minimapPortraits.map((item, idx) => (
                            <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 group hover:border-cyan-500/50 transition-all shadow-xl">
                              <div
                                onClick={() => setPreviewImage({ src: item.path, title: `${agent.name} ${selectedChromaColor} Minimap Portrait (${item.state})` })}
                                className="h-36 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                              >
                                <img src={toAssetUrl(item.path)} alt="" className="w-24 h-24 object-contain rounded-full border-2 border-white/10 group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs pt-1">
                                <span className="font-bold text-white text-[11px]">{item.state}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={(e) => handleCopyImageAsset(item.path, e)}
                                    className={`p-1 rounded transition-colors ${
                                      copiedPath === item.path ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                    }`}
                                    title="Copy image to clipboard"
                                  >
                                    {copiedPath === item.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={(e) => handleDownloadAsset(item.path, item.filename, e)}
                                    className="p-1 rounded bg-white/5 hover:bg-cyan-500 text-slate-300 hover:text-white transition-colors"
                                    title="Download minimap icon"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeChroma.killfeedIcons.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-red-400" />
                          <span>Killfeed Icons ({selectedChromaColor})</span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {activeChroma.killfeedIcons.map((item, idx) => (
                            <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 group hover:border-red-500/50 transition-all shadow-xl">
                              <div
                                onClick={() => setPreviewImage({ src: item.path, title: `${agent.name} ${selectedChromaColor} Killfeed Icon (${item.state})` })}
                                className="h-28 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                              >
                                <img src={toAssetUrl(item.path)} alt="" className="h-10 object-contain group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs pt-1">
                                <span className="font-bold text-white text-[11px]">{item.state}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={(e) => handleCopyImageAsset(item.path, e)}
                                    className={`p-1 rounded transition-colors ${
                                      copiedPath === item.path ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                                    }`}
                                    title="Copy image to clipboard"
                                  >
                                    {copiedPath === item.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={(e) => handleDownloadAsset(item.path, item.filename, e)}
                                    className="p-1 rounded bg-white/5 hover:bg-red-500 text-slate-300 hover:text-white transition-colors"
                                    title="Download killfeed icon"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
