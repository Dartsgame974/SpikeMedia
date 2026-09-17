import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';
import { copyImageAsset, copyLinkText } from '../utils/copyHelper';

export default function ImagePreviewModal({ image, onClose }) {
  const [copiedType, setCopiedType] = useState(null); // 'image' | 'link' | null

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  const rawSrc = typeof image === 'string' ? image : image.src || image.path || image.relPath;
  const src = toAssetUrl(rawSrc);
  const fullUrl = rawSrc.startsWith('http') ? rawSrc : new URL(src, window.location.href).href;
  const title = image.title || image.name || image.filename || 'Image Asset';

  const handleCopyImage = async (e) => {
    e.stopPropagation();
    const result = await copyImageAsset(rawSrc);
    setCopiedType(result || 'image');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    await copyLinkText(rawSrc);
    setCopiedType('link');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = src;
    a.download = image.filename || `${title.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0E14]/90 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl max-h-[92vh] w-full bg-[#131722] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-[#0F141C] border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 truncate max-w-xl">
            <h3 className="font-display font-bold text-lg text-white truncate">
              {title}
            </h3>
            {copiedType && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 text-xs font-display font-medium shrink-0 animate-fade-in">
                {copiedType === 'image' ? 'Image Copied!' : 'Link Copied!'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Copy Image Button */}
            <button
              onClick={handleCopyImage}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                copiedType === 'image'
                  ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                  : 'bg-[#00F0FF]/10 text-[#00F0FF] hover:bg-[#00F0FF]/20 border-[#00F0FF]/30'
              }`}
              title="Copy image directly to clipboard"
            >
              {copiedType === 'image' ? <Check className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              <span className="whitespace-nowrap">{copiedType === 'image' ? 'Image Copied!' : 'Copy Image'}</span>
            </button>

            {/* Copy Direct URL Link Button */}
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                copiedType === 'link'
                  ? 'bg-white text-black border-white'
                  : 'bg-[#1C2230] text-slate-300 hover:text-white border-white/10 hover:border-white/20'
              }`}
              title="Copy direct image URL link"
            >
              {copiedType === 'link' ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              <span className="whitespace-nowrap">{copiedType === 'link' ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF4655] hover:bg-[#FF4655]/90 text-white text-xs font-semibold shadow-md shadow-[#FF4655]/20 transition-all flex items-center gap-1.5 shrink-0"
              title="Download image file"
            >
              <Download className="w-4 h-4" />
              <span className="whitespace-nowrap">Download</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 ml-1"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Large Image Canvas */}
        <div className="flex-1 p-6 flex items-center justify-center bg-[#0B0E14] overflow-auto min-h-[50vh]">
          <img
            src={src}
            alt={title}
            className="max-h-[75vh] max-w-full object-contain rounded-xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Bottom Bar Details */}
        <div className="px-6 py-3 bg-[#0F141C] border-t border-white/5 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="truncate">URL: {fullUrl}</span>
          <span className="whitespace-nowrap font-mono text-[11px] text-slate-500">Spike Media Assets</span>
        </div>
      </div>
    </div>
  );
}
