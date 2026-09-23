import React, { useState } from 'react';
import { Type, Download, Sparkles, Sliders, Check, Copy, Layers, Eye, RefreshCw, FileText } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function FontsSection() {
  const [sampleText, setSampleText] = useState('SPIKE PLANTED - DEFEND THE SITE');
  const [fontSize, setFontSize] = useState(36);
  const [isUppercase, setIsUppercase] = useState(true);
  const [letterSpacing, setLetterSpacing] = useState('normal'); // 'normal', 'wide', 'widest'
  const [copiedFont, setCopiedFont] = useState(null);

  const presetTexts = [
    'SPIKE PLANTED - DEFEND THE SITE',
    'ACE - CLUTCH 1v5 MATCH POINT',
    'VALORANT CHAMPIONS TOUR 2026',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'KINGDOM LABORATORIES ARCHIVE'
  ];

  const fontCatalog = [
    {
      id: 'tungsten',
      name: 'Tungsten',
      subtitle: 'Official Valorant Display Header & Title Font',
      family: 'Tungsten',
      category: 'Display / Header',
      weights: ['Bold (700)'],
      formats: ['TTF', 'WOFF', 'WOFF2', 'EOT'],
      zipPath: 'fonts/Tungsten-Font.zip',
      directPath: 'fonts/tungsten/Tungsten-Bold.ttf',
      description: 'The iconic ultra-condensed typography featured prominently across Valorant title screens, match banners, agent victory cards, and UI killfeed headlines.',
      cssCode: `@font-face {\n  font-family: 'Tungsten';\n  src: url('/fonts/tungsten/Tungsten-Bold.ttf') format('truetype');\n  font-weight: 700;\n  font-style: normal;\n}`,
      previewStyles: [
        { label: 'Tungsten Bold', weight: '700', style: 'normal' }
      ]
    },
    {
      id: 'biosans',
      name: 'BioSans',
      subtitle: 'Official Valorant HUD, Subtitles & Interface Font',
      family: 'BioSans',
      category: 'UI / Sans-Serif',
      weights: ['ExtraLight', 'Light', 'Regular (400)', 'SemiBold (600)', 'Bold (700)', 'ExtraBold (800)'],
      formats: ['OTF'],
      zipPath: 'fonts/biosans.zip',
      directPath: 'fonts/biosans/Flat-it - BioSans-Bold.otf',
      description: 'Versatile geometry sans-serif used extensively for Valorant HUD UI elements, weapon stats, loadout details, inventory menus, and in-game notifications.',
      cssCode: `@font-face {\n  font-family: 'BioSans';\n  src: url('/fonts/biosans/Flat-it - BioSans-Regular.otf') format('opentype');\n  font-weight: 400;\n}\n@font-face {\n  font-family: 'BioSans';\n  src: url('/fonts/biosans/Flat-it - BioSans-Bold.otf') format('opentype');\n  font-weight: 700;\n}`,
      previewStyles: [
        { label: 'BioSans Regular', weight: '400', style: 'normal' },
        { label: 'BioSans SemiBold', weight: '600', style: 'normal' },
        { label: 'BioSans Bold', weight: '700', style: 'normal' },
        { label: 'BioSans ExtraBold', weight: '800', style: 'normal' }
      ]
    },
    {
      id: 'pf-dintext-pro',
      name: 'PF DinText Pro',
      subtitle: 'Official Valorant Technical Body, Metrics & Data Display Font',
      family: 'PFDinTextPro',
      category: 'Technical / Sans-Serif',
      weights: ['Regular (400)', 'Bold (700)'],
      formats: ['TTF'],
      zipPath: 'fonts/pf-dintext-pro.zip',
      directPath: 'fonts/pf-dintext-pro/PFDinTextPro-Regular.ttf',
      description: 'Clean industrial DIN typeface used across tactical overlays, match summary data, combat report numbers, and weapon telemetry panels.',
      cssCode: `@font-face {\n  font-family: 'PFDinTextPro';\n  src: url('/fonts/pf-dintext-pro/PFDinTextPro-Regular.ttf') format('truetype');\n  font-weight: 400;\n}\n@font-face {\n  font-family: 'PFDinTextPro';\n  src: url('/fonts/pf-dintext-pro/PFDinTextPro-Bold.ttf') format('truetype');\n  font-weight: 700;\n}`,
      previewStyles: [
        { label: 'PF DinText Pro Regular', weight: '400', style: 'normal' },
        { label: 'PF DinText Pro Bold', weight: '700', style: 'normal' }
      ]
    },
    {
      id: 'valorant',
      name: 'Valorant Logo Font',
      subtitle: 'Official Stylized Valorant Branding & Graphic Font',
      family: 'ValorantFont',
      category: 'Branding / Display',
      weights: ['Regular (400)'],
      formats: ['TTF'],
      zipPath: 'fonts/valorant.zip',
      directPath: 'fonts/valorant/Valorant Font.ttf',
      description: 'High-impact geometric stencil vector font based on the official Valorant logo typography, perfect for esports banners, thumbnails, and custom graphics.',
      cssCode: `@font-face {\n  font-family: 'ValorantFont';\n  src: url('/fonts/valorant/Valorant Font.ttf') format('truetype');\n  font-weight: 400;\n  font-style: normal;\n}`,
      previewStyles: [
        { label: 'Valorant Stencil Regular', weight: '400', style: 'normal' }
      ]
    }
  ];

  const handleCopyCss = (fontId, cssCode) => {
    navigator.clipboard.writeText(cssCode);
    setCopiedFont(fontId);
    setTimeout(() => setCopiedFont(null), 2000);
  };

  const getTrackingClass = () => {
    if (letterSpacing === 'wide') return 'tracking-widest';
    if (letterSpacing === 'widest') return 'tracking-[0.2em]';
    return 'tracking-normal';
  };

  const formattedText = isUppercase ? sampleText.toUpperCase() : sampleText;

  return (
    <section className="space-y-8">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#161B22] via-[#0F141C] to-[#1C2230] p-6 sm:p-8 border border-white/10 overflow-hidden shadow-2xl space-y-3">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/10 rounded-full filter blur-3xl pointer-events-none -mr-16 -mt-16"></div>
        
        <div className="flex items-center gap-2 text-[#00F0FF] font-display text-xs font-semibold uppercase tracking-wider">
          <Type className="w-4 h-4" />
          <span>Valorant Official Typography Catalog</span>
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
          Download & Preview Valorant Fonts
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Interactive Google Fonts-style preview tool for official Valorant typefaces. Test custom sentences, adjust font size and tracking, copy CSS snippets, and download high-quality font packages.
        </p>
      </div>

      {/* Global Interactive Preview Controller */}
      <div className="bg-[#131722] p-5 sm:p-6 rounded-3xl border border-white/10 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF4655]" />
            <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Live Preview Controls
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time @font-face engine</span>
        </div>

        {/* Input Text Box */}
        <div className="space-y-2">
          <label className="text-xs font-display text-slate-300 font-semibold flex items-center justify-between">
            <span>Custom Text Preview:</span>
            <span className="text-slate-500 font-normal">{sampleText.length} characters</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Type anything to test font preview..."
              className="w-full px-4 py-3 rounded-2xl bg-[#0B0E14] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF] transition-colors"
            />
            {sampleText && (
              <button
                onClick={() => setSampleText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white px-2 py-1 rounded bg-white/5"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Preset Sentences Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-500 font-display font-semibold shrink-0">Presets:</span>
          {presetTexts.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setSampleText(preset)}
              className="px-3 py-1 rounded-xl text-xs bg-[#0B0E14] hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/20 whitespace-nowrap transition-colors"
            >
              {preset.length > 28 ? preset.substring(0, 28) + '...' : preset}
            </button>
          ))}
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
          {/* Size Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-display text-slate-300">
              <span>Font Size:</span>
              <span className="font-mono text-[#00F0FF] font-bold">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[#00F0FF] bg-[#0B0E14] rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-1.5">
            <span className="text-xs font-display text-slate-300 block">Letter Spacing:</span>
            <div className="grid grid-cols-3 gap-1 bg-[#0B0E14] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setLetterSpacing('normal')}
                className={`py-1 rounded-lg text-xs font-display transition-all ${
                  letterSpacing === 'normal' ? 'bg-[#FF4655] text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setLetterSpacing('wide')}
                className={`py-1 rounded-lg text-xs font-display transition-all ${
                  letterSpacing === 'wide' ? 'bg-[#FF4655] text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wide
              </button>
              <button
                onClick={() => setLetterSpacing('widest')}
                className={`py-1 rounded-lg text-xs font-display transition-all ${
                  letterSpacing === 'widest' ? 'bg-[#FF4655] text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ultra
              </button>
            </div>
          </div>

          {/* Case Toggle */}
          <div className="space-y-1.5">
            <span className="text-xs font-display text-slate-300 block">Text Case:</span>
            <div className="grid grid-cols-2 gap-1 bg-[#0B0E14] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setIsUppercase(true)}
                className={`py-1 rounded-lg text-xs font-display transition-all ${
                  isUppercase ? 'bg-[#00F0FF] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                ALL CAPS
              </button>
              <button
                onClick={() => setIsUppercase(false)}
                className={`py-1 rounded-lg text-xs font-display transition-all ${
                  !isUppercase ? 'bg-[#00F0FF] text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Normal Case
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Font Cards List */}
      <div className="space-y-8">
        {fontCatalog.map((font) => (
          <div
            key={font.id}
            className="bg-[#131722] border border-white/10 hover:border-white/20 rounded-3xl p-6 transition-all space-y-6 shadow-2xl"
          >
            {/* Font Details Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                    {font.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-display font-semibold bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/20">
                    {font.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  {font.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyCss(font.id, font.cssCode)}
                  className={`px-3 py-2 rounded-xl text-xs font-display font-semibold flex items-center gap-2 transition-all ${
                    copiedFont === font.id
                      ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/30'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                  title="Copy CSS @font-face code snippet"
                >
                  {copiedFont === font.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFont === font.id ? 'CSS Copied!' : 'Copy CSS'}</span>
                </button>

                <a
                  href={toAssetUrl(font.zipPath)}
                  download={`${font.name}_Font_Archive.zip`}
                  className="px-4 py-2 rounded-xl text-xs font-display font-bold bg-[#FF4655] hover:bg-[#FF4655]/90 text-white shadow-lg shadow-[#FF4655]/30 flex items-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Archive (.zip)</span>
                </a>
              </div>
            </div>

            {/* Weights Badges & Formats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-semibold text-slate-500 uppercase text-[10px]">Styles:</span>
                {font.weights.map((w, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#0B0E14] border border-white/5 text-slate-300 font-mono text-[11px]">
                    {w}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-slate-500 uppercase text-[10px]">Formats:</span>
                {font.formats.map((fmt, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[#00F0FF] font-mono text-[11px] font-bold">
                    .{fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Font Preview Box */}
            <div className="space-y-4">
              {font.previewStyles.map((pStyle, pIdx) => (
                <div
                  key={pIdx}
                  className="bg-[#0B0E14] p-6 rounded-2xl border border-white/5 space-y-3 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-white/5 pb-2">
                    <span className="font-display font-semibold text-slate-400">{pStyle.label}</span>
                    <span className="font-mono text-[11px]">font-family: '{font.family}', weight: {pStyle.weight}</span>
                  </div>

                  <div
                    style={{
                      fontFamily: `'${font.family}', sans-serif`,
                      fontSize: `${fontSize}px`,
                      fontWeight: pStyle.weight,
                      fontStyle: pStyle.style,
                      lineHeight: 1.2
                    }}
                    className={`text-white break-words transition-all ${getTrackingClass()}`}
                  >
                    {formattedText || 'TYPE SOMETHING TO PREVIEW'}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
