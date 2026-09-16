import React, { useState } from 'react';
import { X, Download, Disc, Image, Volume2, Copy, Check, Eye } from 'lucide-react';
import AudioPlayerSlim from './AudioPlayerSlim';
import ImagePreviewModal from './ImagePreviewModal';

export default function AgentDetailModal({ agent, onClose }) {
  const [activeTab, setActiveTab] = useState('starterpack');
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);

  if (!agent) return null;

  // Use fullPortrait cropped at top half for large crisp banner background
  const bannerPortrait = agent.assets?.fullPortrait || agent.assets?.bustPortrait;
  const bustPortrait = agent.assets?.bustPortrait || agent.assets?.fullPortrait;
  const fullPortrait = agent.assets?.fullPortrait;
  const squareIcon = agent.assets?.squareIcon;
  const killfeedIcon = agent.assets?.killfeedIcon;
  const minimapIcon = agent.assets?.minimapIcon;
  const wallpaper = agent.assets?.wallpaper;
  const minimapIcons = agent.assets?.minimapIcons || [];
  const abilityIcons = agent.assets?.abilityIcons || [];

  const audioCategories = agent.audioCategories || {};
  const categoryNames = Object.keys(audioCategories);

  const [copiedType, setCopiedType] = useState(null);

  const handleDownloadAsset = (path, name, e) => {
    if (e) e.stopPropagation();
    const a = document.createElement('a');
    a.href = `/${path}`;
    a.download = name || `${agent.name}_asset.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyAssetLink = (path, e) => {
    if (e) e.stopPropagation();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = `${window.location.origin}${cleanPath}`;
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
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const response = await fetch(cleanPath);
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

        {/* Banner Header framing the top half of Full Portrait cleanly */}
        <div className="relative h-64 sm:h-72 bg-gradient-to-r from-[#161B22] via-[#0F141C] to-[#1C2230] p-6 flex flex-col justify-end overflow-hidden shrink-0 border-b border-white/5">
          {wallpaper && (
            <img
              src={`/${wallpaper}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-[2px]"
            />
          )}

          {/* Top half of Full Portrait framed large on right side */}
          {bannerPortrait && (
            <img
              src={`/${bannerPortrait}`}
              alt={agent.name}
              className="absolute right-4 sm:right-12 top-0 h-[140%] object-cover object-top drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] pointer-events-none"
            />
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0E14]/80 hover:bg-[#FF4655] text-slate-400 hover:text-white transition-colors border border-white/10 z-10"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Agent Meta Header */}
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              {agent.roleIconPath ? (
                <div className="px-3 py-1 rounded-full bg-[#0B0E14]/90 border border-white/10 flex items-center gap-2 text-xs font-display font-medium text-slate-200">
                  <img src={`/${agent.roleIconPath}`} alt="" className="w-4 h-4 object-contain shrink-0" />
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
                  src={`/${squareIcon}`}
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

        {/* Modal Navigation Tabs (Single line whitespace-nowrap) */}
        <div className="px-6 pt-4 bg-[#0F141C] border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('starterpack')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'starterpack'
                  ? 'border-[#FF4655] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Image className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <span className="whitespace-nowrap">1. Media Packaging (Starter Pack)</span>
            </button>

            <button
              onClick={() => setActiveTab('sfx')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'sfx'
                  ? 'border-[#FF4655] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#FF4655] shrink-0" />
              <span className="whitespace-nowrap">2. Agent SFX Library</span>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: MEDIA STARTER PACK */}
          {activeTab === 'starterpack' && (
            <div className="space-y-8">
              
              {/* Agent Artwork Cards */}
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest">
                  High-Resolution Portraits & Badges
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  {/* Bust Portrait */}
                  {bustPortrait && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: bustPortrait, title: `${agent.name} Bust Portrait` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                        title="Click for full-screen preview"
                      >
                        <img src={`/${bustPortrait}`} alt="" className="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">Bust Portrait</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyAssetLink(bustPortrait, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === bustPortrait ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image link"
                          >
                            {copiedPath === bustPortrait ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(bustPortrait, `${agent.name}_bust_portrait.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                            title="Download Bust Portrait"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Full Portrait */}
                  {fullPortrait && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: fullPortrait, title: `${agent.name} Full Portrait` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                        title="Click for full-screen preview"
                      >
                        <img src={`/${fullPortrait}`} alt="" className="h-full object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">Full Portrait</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyAssetLink(fullPortrait, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === fullPortrait ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image link"
                          >
                            {copiedPath === fullPortrait ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(fullPortrait, `${agent.name}_full_portrait.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                            title="Download Full Portrait"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Square Icon */}
                  {squareIcon && (
                    <div className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: squareIcon, title: `${agent.name} Square Icon` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                        title="Click for full-screen preview"
                      >
                        <img src={`/${squareIcon}`} alt="" className="w-24 h-24 object-contain rounded-xl group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">Square Icon</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyAssetLink(squareIcon, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === squareIcon ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image link"
                          >
                            {copiedPath === squareIcon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(squareIcon, `${agent.name}_square_icon.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                            title="Download Square Icon"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Killfeed Icons (Multiple Forms support ex: Veto Pine & Sym) */}
                  {(agent.assets?.killfeedIcons || [killfeedIcon]).filter(Boolean).map((kfIcon, idx) => (
                    <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: kfIcon, title: `${agent.name} Killfeed Icon ${idx > 0 ? `(Form ${idx + 1} / Sym)` : ''}` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                        title="Click for full-screen preview"
                      >
                        <img src={`/${kfIcon}`} alt="" className="h-10 object-contain group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">
                          {idx === 0 ? 'Killfeed Icon' : `Killfeed (Form ${idx + 1})`}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyAssetLink(kfIcon, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === kfIcon ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image link"
                          >
                            {copiedPath === kfIcon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(kfIcon, `${agent.name}_killfeed_icon_${idx + 1}.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                            title="Download Killfeed Icon"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Minimap Head Portraits (Multiple Forms support ex: Veto Pine & Sym) */}
                  {(agent.assets?.minimapPortraits || [minimapIcon]).filter(Boolean).map((mmPortrait, idx) => (
                    <div key={idx} className="bg-[#0B0E14] p-3 rounded-2xl border border-white/5 space-y-2 flex flex-col justify-between group hover:border-[#FF4655]/30 transition-all">
                      <div
                        onClick={() => setPreviewImage({ src: mmPortrait, title: `${agent.name} Minimap Head Portrait ${idx > 0 ? `(Form ${idx + 1} / Sym)` : ''}` })}
                        className="h-40 bg-[#131722] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer relative"
                        title="Click for full-screen preview"
                      >
                        <img src={`/${mmPortrait}`} alt="" className="w-20 h-20 object-contain rounded-full border border-white/10 group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-medium text-slate-300 whitespace-nowrap">
                          {idx === 0 ? 'Minimap Portrait' : `Minimap (Form ${idx + 1})`}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyAssetLink(mmPortrait, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === mmPortrait ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                            title="Copy image link"
                          >
                            {copiedPath === mmPortrait ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(mmPortrait, `${agent.name}_minimap_portrait_${idx + 1}.png`, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#FF4655] text-slate-300 hover:text-white transition-colors"
                            title="Download Minimap Head Portrait"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* Ability Icons Grid */}
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
                          title="Click to preview icon"
                        >
                          <img src={`/${abil.path}`} alt="" className="w-full h-full object-contain opacity-90" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-slate-300 truncate" title={abil.filename}>
                            {abil.filename.replace(/\.[^/.]+$/, '')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyAssetLink(abil.path, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === abil.path ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                            }`}
                            title="Copy link"
                          >
                            {copiedPath === abil.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(abil.path, abil.filename, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-400 transition-colors"
                            title="Download icon"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Minimap Icons Grid */}
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
                          title="Click to preview icon"
                        >
                          <img src={`/${mm.path}`} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-slate-300 truncate" title={mm.filename}>
                            {mm.filename.replace(/\.[^/.]+$/, '')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleCopyAssetLink(mm.path, e)}
                            className={`p-1.5 rounded transition-colors ${
                              copiedPath === mm.path ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
                            }`}
                            title="Copy link"
                          >
                            {copiedPath === mm.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDownloadAsset(mm.path, mm.filename, e)}
                            className="p-1.5 rounded bg-white/5 hover:bg-[#00F0FF] hover:text-black text-slate-400 transition-colors"
                            title="Download minimap icon"
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

          {/* TAB 2: SFX LIBRARY */}
          {activeTab === 'sfx' && (
            <div className="space-y-6">
              {categoryNames.length > 0 ? (
                <div className="space-y-6">
                  {categoryNames.map(catName => {
                    const catObj = audioCategories[catName];
                    const clips = catObj?.clips || (Array.isArray(catObj) ? catObj : []);
                    const iconPath = catObj?.icon;

                    if (clips.length === 0) return null;

                    return (
                      <div key={catName} className="space-y-3 bg-[#0B0E14]/60 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            {iconPath ? (
                              <div className="w-8 h-8 rounded bg-[#131722] p-1 border border-white/10 flex items-center justify-center shrink-0">
                                <img src={`/${iconPath}`} alt="" className="w-full h-full object-contain" />
                              </div>
                            ) : (
                              <Disc className="w-5 h-5 text-[#FF4655] shrink-0" />
                            )}
                            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                              {catName}
                            </h3>
                          </div>
                          <span className="text-xs font-display text-slate-400 whitespace-nowrap">
                            {clips.length} audio clips
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {clips.map((clip, idx) => (
                            <AudioPlayerSlim
                              key={idx}
                              title={clip.name}
                              src={`/${clip.relPath}`}
                              filename={`${agent.name}_${clip.filename}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 font-display text-sm">
                  No specific SFX clips indexed for {agent.name}.
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
