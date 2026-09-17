import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Film, Sparkles, Disc, Radio, Box, Code, ExternalLink, Check, Copy, Flame, MapPin } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function ShowcaseVideo({ registry }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const totalDuration = 52; // 52 seconds total showcase

  // Scene timing thresholds (in seconds)
  const isScene1 = currentTime >= 0 && currentTime < 4;   // Hook
  const isScene2 = currentTime >= 4 && currentTime < 10;  // SaaS Interface
  const isScene3 = currentTime >= 10 && currentTime < 22; // Agent SFX & Jett
  const isScene4 = currentTime >= 22 && currentTime < 32; // Spike & Maps Audio
  const isScene5 = currentTime >= 32 && currentTime < 40; // Minimaps & Weapons
  const isScene6 = currentTime >= 40 && currentTime < 46; // Creator Resources
  const isScene7 = currentTime >= 46;                     // Outro CTA

  // Timeline loop ticker
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 0.05;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync sound effects to exact scene triggers
  useEffect(() => {
    if (!isPlaying || isMuted) return;

    // Trigger specific sound effects during showcase playback
    if (Math.abs(currentTime - 10.5) < 0.1 && audioRef.current) {
      audioRef.current.src = toAssetUrl('Valorantek/SFX/UI/Agents/Jett/Abilities/Ability_X_Ultimate_Blade_Storm/Play_AbilX_BladeStorm_Equip (SFX).mp3');
      audioRef.current.play().catch(() => {});
    } else if (Math.abs(currentTime - 22.5) < 0.1 && audioRef.current) {
      audioRef.current.src = toAssetUrl('Valorantek/SFX/Spike/Operations/Rad_Pulse_Stage_4 (SFX).mp3');
      audioRef.current.play().catch(() => {});
    } else if (Math.abs(currentTime - 26.5) < 0.1 && audioRef.current) {
      audioRef.current.src = toAssetUrl('Valorantek/SFX/Maps/Bind_Duality/Play_Teleporter_CharacterTeleport_1P (1071232599).mp3');
      audioRef.current.play().catch(() => {});
    }
  }, [currentTime, isPlaying, isMuted]);

  const togglePlay = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(ratio * totalDuration);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatSecs = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const jettAgent = registry?.agents?.find(a => a.name.toLowerCase() === 'jett') || registry?.agents?.[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230] p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#FF4655]" />
            <h2 className="font-display font-extrabold text-2xl text-white">Spike Media — Motion Design Showcase</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            SaaS-style 16:9 programmatic motion design video (60 FPS). Pure CSS cubic-bezier spring physics, dynamic assets, live audio streaming, and kinetic typography.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3.5 py-1.5 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] font-display text-xs font-bold shadow-lg shadow-[#00F0FF]/10">
            16:9 1080p @ 60 FPS
          </span>
        </div>
      </div>

      {/* 16:9 Motion Design Canvas */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-[#0B0E14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none group"
      >
        <audio ref={audioRef} />

        {/* Ambient Glowing Background Particle Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4655]/15 rounded-full filter blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F0FF]/15 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        {/* Dynamic Scene Renderer */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center p-6 sm:p-12 z-10 overflow-hidden">
          
          {/* SCENE 1: Kinetic Intro Hook */}
          {isScene1 && (
            <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4655]/20 border border-[#FF4655]/40 text-[#FF4655] font-display text-xs font-bold shadow-xl">
                <Sparkles className="w-4 h-4" />
                VALORANT CREATOR ASSET ARCHIVE
              </div>
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 drop-shadow-2xl">
                ELEVATE YOUR VALORANT CONTENT.
              </h1>
              <p className="text-base sm:text-xl text-slate-300 font-medium">
                All official game assets, agent portraits, and audio in one minimalist hub.
              </p>
            </div>
          )}

          {/* SCENE 2: SaaS Interface 3D Tilt Reveal */}
          {isScene2 && (
            <div className="w-full max-w-4xl space-y-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] font-display text-xs font-bold uppercase tracking-widest">
                POWERFUL ARCHIVE • ZERO ADS • ZERO LOGIN
              </div>
              
              {/* 3D Perspective Glass Card Showcase */}
              <div
                className="bg-[#131722]/90 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-700 space-y-6"
                style={{ transform: 'perspective(1000px) rotateX(8deg) rotateY(-4deg) scale(0.95)' }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF4655] p-2 flex items-center justify-center text-white font-bold shadow-lg shadow-[#FF4655]/30">
                      SM
                    </div>
                    <span className="font-display font-extrabold text-xl text-white">SPIKE MEDIA HUB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#FF4655]/20 text-[#FF4655] text-xs font-bold rounded-lg border border-[#FF4655]/30">
                      29 AGENTS INDEXED
                    </span>
                    <span className="px-3 py-1 bg-[#00F0FF]/20 text-[#00F0FF] text-xs font-bold rounded-lg border border-[#00F0FF]/30">
                      50 SFX CATEGORIES
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-left">
                  <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/5 space-y-1">
                    <Disc className="w-5 h-5 text-[#FF4655]" />
                    <h4 className="font-display font-bold text-sm text-white">Agent Media Packs</h4>
                    <p className="text-xs text-slate-400">4K Portraits, Badges, Abilities</p>
                  </div>
                  <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/5 space-y-1">
                    <Radio className="w-5 h-5 text-[#00F0FF]" />
                    <h4 className="font-display font-bold text-sm text-white">UI & Map SFX</h4>
                    <p className="text-xs text-slate-400">Spike Timers, Doors, Portals</p>
                  </div>
                  <div className="bg-[#0B0E14] p-4 rounded-2xl border border-white/5 space-y-1">
                    <Box className="w-5 h-5 text-purple-400" />
                    <h4 className="font-display font-bold text-sm text-white">Game Assets</h4>
                    <p className="text-xs text-slate-400">25 Tactical Minimap Grids</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 3: Agent SFX & Jett Deep Dive */}
          {isScene3 && (
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-in zoom-in-95 duration-500">
              {/* Left Column: Jett Card */}
              <div className="bg-[#131722] p-6 rounded-3xl border border-[#FF4655]/40 shadow-2xl relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4655]/20 rounded-full filter blur-2xl" />
                <div className="flex items-center gap-4">
                  {jettAgent?.assets?.squareIcon && (
                    <img src={toAssetUrl(jettAgent.assets.squareIcon)} alt="" className="w-16 h-16 rounded-2xl border-2 border-[#FF4655] shadow-lg shadow-[#FF4655]/30 object-cover" />
                  )}
                  <div>
                    <span className="text-xs font-display text-[#00F0FF] uppercase tracking-widest font-bold">VALORANT DUELIST</span>
                    <h3 className="font-display font-extrabold text-3xl text-white">JETT</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-bold text-slate-200 border border-white/10 flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5 text-[#00F0FF]" /> 1-Click Copy Image
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#FF4655]/20 text-[#FF4655] text-xs font-bold border border-[#FF4655]/30">
                    4K Renders
                  </span>
                </div>
              </div>

              {/* Right Column: Audio Waveform Live Stream */}
              <div className="space-y-4">
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#FF4655]/20 border border-[#FF4655]/40 text-[#FF4655] font-display text-xs font-bold">
                  29 AGENTS • 4K PORTRAITS • INSTANT SFX STREAMING
                </div>

                {/* Animated Audio Player Card */}
                <div className="bg-[#131722] p-5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-[#FF4655] animate-pulse" />
                      Jett - Blade Storm Equip SFX
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">0:02 / 0:02</span>
                  </div>

                  {/* Pulsing Frequency Waveform */}
                  <div className="h-8 w-full flex items-center gap-1">
                    {[40, 85, 60, 95, 30, 70, 100, 50, 80, 45, 90, 65, 80, 40, 95, 75, 30, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#FF4655] to-[#00F0FF] rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 4: Spike Timers & Map Interactive Audio */}
          {isScene4 && (
            <div className="w-full max-w-4xl space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FF4655]/20 border border-[#FF4655]/40 text-[#FF4655] font-display text-xs font-bold uppercase tracking-widest">
                SPIKE TIMERS & MAP INTERACTIVE AUDIO
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="bg-[#131722] p-5 rounded-2xl border border-white/10 space-y-2 shadow-xl">
                  <Flame className="w-6 h-6 text-[#FF4655]" />
                  <h4 className="font-display font-bold text-white text-base">Spike Plant & Defuse</h4>
                  <p className="text-xs text-slate-400">Stage 1-5 pulse risers, ring tones, and defuse shutdown cues.</p>
                </div>

                <div className="bg-[#131722] p-5 rounded-2xl border border-white/10 space-y-2 shadow-xl">
                  <MapPin className="w-6 h-6 text-[#00F0FF]" />
                  <h4 className="font-display font-bold text-white text-base">Bind Teleporters</h4>
                  <p className="text-xs text-slate-400">1P/3P portal enter & exit sound effects, door triggers.</p>
                </div>

                <div className="bg-[#131722] p-5 rounded-2xl border border-white/10 space-y-2 shadow-xl">
                  <Radio className="w-6 h-6 text-purple-400" />
                  <h4 className="font-display font-bold text-white text-base">Lotus & Fracture Doors</h4>
                  <p className="text-xs text-slate-400">Rotating stone doors, automatic glass barriers, shooting range dummies.</p>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 5: Tactical Minimaps & Weapons */}
          {isScene5 && (
            <div className="w-full max-w-4xl text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] font-display text-xs font-bold uppercase tracking-widest">
                25 TACTICAL MINIMAPS & 4K WEAPON RENDERS
              </div>

              <div className="grid grid-cols-3 gap-4">
                {['Ascent', 'Bind', 'Haven'].map((mapName, idx) => (
                  <div key={idx} className="bg-[#131722] p-4 rounded-2xl border border-white/10 space-y-2 shadow-xl transform hover:scale-105 transition-transform">
                    <div className="h-32 bg-[#0B0E14] rounded-xl flex items-center justify-center p-2 border border-white/5">
                      <MapPin className="w-10 h-10 text-[#00F0FF]" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{mapName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Tactical Map</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCENE 6: Curated Creator Resources */}
          {isScene6 && (
            <div className="w-full max-w-4xl text-center space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-display text-xs font-bold uppercase tracking-widest">
                CURATED CREATOR TOOLS & COMMUNITY RESOURCES
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-[#131722] p-5 rounded-2xl border border-white/10 space-y-2">
                  <ExternalLink className="w-5 h-5 text-[#00F0FF]" />
                  <h4 className="font-display font-bold text-white text-base">Valorant API Official Docs</h4>
                  <p className="text-xs text-slate-400">Direct endpoint reference for raw Valorant endpoints and assets.</p>
                </div>
                <div className="bg-[#131722] p-5 rounded-2xl border border-white/10 space-y-2">
                  <Code className="w-5 h-5 text-[#FF4655]" />
                  <h4 className="font-display font-bold text-white text-base">Developer Codenames Index</h4>
                  <p className="text-xs text-slate-400">Full internal codenames database for maps and agent assets.</p>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 7: Outro & Call to Action */}
          {isScene7 && (
            <div className="text-center space-y-6 animate-in zoom-in-90 duration-500 max-w-2xl">
              <div className="w-20 h-20 rounded-3xl bg-[#FF4655] p-4 mx-auto shadow-2xl shadow-[#FF4655]/40 flex items-center justify-center">
                <img src={toAssetUrl('logo.svg')} alt="" className="w-full h-full object-contain" />
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                  SPIKE MEDIA
                </h2>
                <p className="text-base text-slate-300 font-medium">
                  100% Free & Open Source. Everything you need to elevate your Valorant content.
                </p>
              </div>

              <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF4655] to-[#00F0FF] text-black font-display font-extrabold text-lg shadow-2xl shadow-[#FF4655]/30 tracking-wider">
                SPIKEMEDIA.DARTSGAME.FR
              </div>
            </div>
          )}

        </div>

        {/* Video Controls Scrub Bar */}
        <div className="relative z-20 bg-[#0F141C]/95 border-t border-white/10 p-3 sm:p-4 flex items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#FF4655] hover:bg-[#ff5d6a] text-white flex items-center justify-center shadow-lg shadow-[#FF4655]/30 transition-transform active:scale-95"
              title={isPlaying ? "Pause Showcase" : "Play Showcase"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => setCurrentTime(0)}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Restart Showcase"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-slate-300 font-bold">
              {formatSecs(currentTime)} / {formatSecs(totalDuration)}
            </span>
          </div>

          {/* Timeline Progress Slider */}
          <div
            onClick={handleSeek}
            className="flex-1 h-3 bg-[#131722] border border-white/10 rounded-full overflow-hidden cursor-pointer relative group"
          >
            <div
              className="h-full bg-gradient-to-r from-[#FF4655] via-[#00F0FF] to-purple-500 transition-all duration-75"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
              title={isMuted ? "Unmute Audio Cues" : "Mute Audio Cues"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#00F0FF]" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Toggle Fullscreen 16:9"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
