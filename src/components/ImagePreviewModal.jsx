import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function ImagePreviewModal({ image, onClose }) {
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F141C] border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 truncate max-w-xl">
            <h3 className="font-display font-bold text-lg text-white truncate">
              {title}
            </h3>
            {copied && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 text-xs font-display font-medium shrink-0 animate-fade-in">
                Link Copied!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Copy Direct URL Button */}
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                copied
                  ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                  : 'bg-[#1C2230] text-slate-300 hover:text-white border-white/10 hover:border-white/20'
              }`}
              title="Copy direct image URL to clipboard"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="whitespace-nowrap">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF4655] hover:bg-[#FF4655]/90 text-white text-xs font-semibold shadow-md shadow-[#FF4655]/20 transition-all flex items-center gap-2 shrink-0"
              title="Download image file"
            >
              <Download className="w-4 h-4" />
              <span className="whitespace-nowrap">Download</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 ml-2"
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
