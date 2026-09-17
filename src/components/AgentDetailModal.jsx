import React, { useState, useMemo, useDeferredValue, useTransition } from 'react';
import { X, Download, Disc, Image, Volume2, Copy, Check, Eye, Search, Filter, Sparkles, Music, ChevronDown, Loader2 } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';
import ImagePreviewModal from './ImagePreviewModal';
import { toAssetUrl } from '../utils/urlHelper';

export default function AgentDetailModal({ agent, onClose }) {
  const [activeTab, setActiveTab] = useState('starterpack');
  const [isPendingTab, startTabTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);

  // SFX Tab filters
  const [sfxCategory, setSfxCategory] = useState('All');
  const [sfxSearch, setSfxSearch] = useState('');
  const deferredSfxSearch = useDeferredValue(sfxSearch);
  const [sfxTagFilter, setSfxTagFilter] = useState('');
  const [isPendingSfx, startSfxTransition] = useTransition();
  const [visibleCounts, setVisibleCounts] = useState({});

  if (!agent) return null;

  const bannerPortrait = agent.assets?.fullPortrait || agent.assets?.bustPortrait;
  const bustPortrait = agent.assets?.bustPortrait || agent.assets?.fullPortrait;
  const fullPortrait = agent.assets?.fullPortrait;
  const squareIcon = agent.assets?.squareIcon;
  const killfeedIcon = agent.assets?.killfeedIcon;
  const minimapIcon = agent.assets?.minimapIcon;
  const wallpaper = agent.assets?.wallpaper;
  const minimapIcons = agent.assets?.minimapIcons || [];
  const abilityIcons = agent.assets?.abilityIcons || [];

  const extraArtworks = agent.assets?.extraArtworks || [];

  const audioCategories = agent.audioCategories || {};
  const categoryNames = Object.keys(audioCategories);

  const [copiedType, setCopiedType] = useState(null);

  const handleTabChange = (tabId) => {
    startTabTransition(() => {
      setActiveTab(tabId);
    });
  };

  const handleSfxCategoryChange = (catName) => {
    startSfxTransition(() => {
      setSfxCategory(catName);
    });
  };

  const handleSfxTagChange = (tagValue) => {
    startSfxTransition(() => {
      setSfxTagFilter(tagValue);
    });
  };

  const loadMoreAgentClips = (catName) => {
    setVisibleCounts(prev => ({
      ...prev,
      [catName]: (prev[catName] || 16) + 24
    }));
  };

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

        {/* Banner Header */}
        <div className="relative h-64 sm:h-72 bg-gradient-to-r from-[#161B22] via-[#0F141C] to-[#1C2230] p-6 flex flex-col justify-end overflow-hidden shrink-0 border-b border-white/5">
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
              className="absolute right-4 sm:right-12 top-0 h-[140%] object-cover object-top drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] pointer-events-none"
            />
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0E14]/80 hover:bg-[#FF4655] text-slate-400 hover:text-white transition-colors border border-white/10 z-10"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              {agent.roleIconPath ? (
                <div className="px-3 py-1 rounded-full bg-[#0B0E14]/90 border border-white/10 flex items-center gap-2 text-xs font-display font-medium text-slate-200">
                  <img src={toAssetUrl(agent.roleIconPath)} alt="" className="w-4 h-4 object-contain shrink-0" />
                  <span className="whitespace-nowrap">{agent.role || 'Valorant Agent'}</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full bg-[#0B0E14]/90 border border-white/10 text-xs font-display font-medium text-slate-200 whitespace-nowrap">
                  <span>{agent.role || 'Valorant Agent'}</span>
                </div>
              )}

              {agent.developerName && (
                <span className="text-xs font-display text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 whitespace-nowrap">
                  Codename: {agent.developerName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {squareIcon && (
                <img
                  src={toAssetUrl(squareIcon)}
                  alt=""
                  onClick={() => setPreviewImage({ src: squareIcon, title: `${agent.name} Square Icon` })}
                  className="w-16 h-16 rounded-2xl border-2 border-[#FF4655] shadow-lg shadow-[#FF4655]/30 object-cover shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  title="Click to view full preview"
                />
              )}
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {agent.name}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (2-Column Segmented Control Grid for Mobile & Desktop) */}
        <div className="px-4 sm:px-6 pt-4 pb-3 bg-[#0F141C] border-b border-white/5 shrink-0">
          <div className="grid grid-cols-2 p-1 bg-[#0B0E14] border border-white/10 rounded-2xl gap-1 max-w-lg mx-auto sm:mx-0 shadow-inner">
            <button
              onClick={() => handleTabChange('starterpack')}
              className={`py-2.5 px-3 text-xs font-display font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'starterpack'
                  ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Image className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>1. Media Packaging</span>
            </button>

            <button
              onClick={() => handleTabChange('sfx')}
              className={`py-2.5 px-3 text-xs font-display font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'sfx'
                  ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span>2. Agent SFX Library</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {isPendingTab ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-display text-sm">
              <Loader2 className="w-7 h-7 text-[#FF4655] animate-spin" />
              <span>Loading agent content...</span>
            </div>
          ) : activeTab === 'starterpack' ? (
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest">
                  High-Resolution Portraits & Badges
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {bustPortrait && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: bustPortrait, title: `${agent.name} Bust Portrait` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(bustPortrait)} alt="" className="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">Bust Portrait</span>
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
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {fullPortrait && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: fullPortrait, title: `${agent.name} Full Portrait` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(fullPortrait)} alt="" className="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">Full Portrait</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(fullPortrait, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === fullPortrait ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === fullPortrait ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(fullPortrait, `${agent.name}_full_portrait.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {squareIcon && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: squareIcon, title: `${agent.name} Square Icon` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(squareIcon)} alt="" className="w-24 h-24 object-contain rounded-xl group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">Square Icon</span>
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

                  {(agent.assets?.killfeedIcons || [killfeedIcon]).filter(Boolean).map((kfIcon, idx) => (
                    <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: kfIcon, title: `${agent.name} Killfeed Icon` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(kfIcon)} alt="" className="h-10 object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">Killfeed Icon</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(kfIcon, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === kfIcon ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === kfIcon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(kfIcon, `${agent.name}_killfeed_icon.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(agent.assets?.minimapPortraits || [minimapIcon]).filter(Boolean).map((mmPortrait, idx) => (
                    <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: mmPortrait, title: `${agent.name} Minimap Portrait` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(mmPortrait)} alt="" className="w-20 h-20 object-contain rounded-full border border-white/10 group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">Minimap Portrait</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(mmPortrait, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === mmPortrait ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === mmPortrait ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(mmPortrait, `${agent.name}_minimap_portrait.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {extraArtworks.map((art, idx) => (
                    <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#00F0FF]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: art.path, title: `${agent.name} - ${art.name}` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                      >
                        <img src={toAssetUrl(art.path)} alt="" className="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 truncate" title={art.name}>{art.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyImageAsset(art.path, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === art.path ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image to clipboard"
                          >
                            {copiedPath === art.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(art.path, art.filename, e)}
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
          ) : (
            (() => {
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
                  const matchesSearch = !deferredSfxSearch || clipName.includes(deferredSfxSearch.toLowerCase());
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
                    {/* Category Pills Bar (Wrapping on Mobile for Instant Visibility) */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleSfxCategoryChange('All')}
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
                            onClick={() => handleSfxCategoryChange(cat.name)}
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
                              onClick={() => handleSfxTagChange(tag.value)}
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
                            handleSfxCategoryChange('All');
                            setSfxSearch('');
                            handleSfxTagChange('');
                          }}
                          className="text-xs text-[#FF4655] hover:underline font-display font-medium"
                        >
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Visual Loading Banner for Category / Tag Switching */}
                  {isPendingSfx && (
                    <div className="flex items-center justify-center gap-2.5 p-3 bg-[#0B0E14] rounded-xl border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-display font-semibold animate-pulse shadow-lg shadow-[#00F0FF]/10">
                      <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF]" />
                      <span>Filtering agent sound effects...</span>
                    </div>
                  )}

                  {/* SFX Clips Display Grid with Lazy Chunk Pagination */}
                  <div className={`space-y-6 transition-opacity duration-200 ${isPendingSfx ? 'opacity-60' : 'opacity-100'}`}>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map(cat => {
                        const displayName = cat.name.replace(/_/g, ' ');
                        const currentLimit = visibleCounts[cat.name] || 16;
                        const displayedClips = cat.clips.slice(0, currentLimit);
                        const hasMore = cat.clips.length > currentLimit;

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
                                Showing {displayedClips.length} of {cat.clips.length} audio clips
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {displayedClips.map((clip, idx) => (
                                <AudioPlayerSlim
                                  key={`${cat.name}-${clip.filename}-${idx}`}
                                  title={clip.name}
                                  src={toAssetUrl(clip.relPath)}
                                  filename={`${agent.name}_${clip.filename}`}
                                />
                              ))}
                            </div>

                            {hasMore && (
                              <div className="pt-2 text-center">
                                <button
                                  onClick={() => loadMoreAgentClips(cat.name)}
                                  className="px-4 py-2 bg-[#131722] hover:bg-white/10 text-xs text-[#00F0FF] border border-[#00F0FF]/30 hover:border-[#00F0FF] rounded-xl font-display font-semibold transition-all inline-flex items-center gap-1.5 shadow-md"
                                >
                                  <span>Show more audio clips ({cat.clips.length - currentLimit} remaining)</span>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 bg-[#0B0E14]/40 rounded-2xl border border-white/5 text-center text-slate-400 font-display text-sm space-y-2">
                        <p className="font-semibold text-white">No audio clips found matching your search or filters.</p>
                        <button
                          onClick={() => {
                            handleSfxCategoryChange('All');
                            setSfxSearch('');
                            handleSfxTagChange('');
                          }}
                          className="px-4 py-2 rounded-xl bg-[#FF4655] text-white text-xs font-display font-medium hover:bg-[#FF4655]/80 transition-colors inline-block mt-2"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          )}
        </div>

      </div>
    </div>
  );
}
