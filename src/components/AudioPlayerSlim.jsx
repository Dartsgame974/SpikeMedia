import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, Copy, Check } from 'lucide-react';

export default function AudioPlayerSlim({ title, src, filename }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);

  // Generate 40 deterministic height values for static SVG waveform
  const waveformBars = useMemo(() => {
    const bars = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const seed = (title.charCodeAt(i % title.length) || 42) + i * 13;
      const normalized = ((Math.sin(seed) + 1) / 2) * 0.7 + 0.3;
      bars.push(Math.round(normalized * 100));
    }
    return bars;
  }, [title]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audioRef.current) a.pause();
      });
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = src;
    a.download = filename || title + '.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const fullUrl = `${window.location.origin}${src.startsWith('/') ? src : '/' + src}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  const isIdle = useMemo(() => {
    const t = (title || '').toLowerCase();
    const f = (filename || '').toLowerCase();
    const s = (src || '').toLowerCase();
    return t.includes('idle') || f.includes('idle') || s.includes('idle');
  }, [title, filename, src]);

  const isEquip = useMemo(() => {
    const t = (title || '').toLowerCase();
    const f = (filename || '').toLowerCase();
    const s = (src || '').toLowerCase();
    return t.includes('equip') || f.includes('equip') || s.includes('equip') || t.includes('draw') || f.includes('draw');
  }, [title, filename, src]);

  const isLoop = useMemo(() => {
    const t = (title || '').toLowerCase();
    const f = (filename || '').toLowerCase();
    const s = (src || '').toLowerCase();
    return t.includes('loop') || f.includes('loop') || s.includes('loop');
  }, [title, filename, src]);

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-[#131722]/90 hover:bg-[#1C2230] border border-white/5 hover:border-[#FF4655]/30 rounded-xl transition-colors group">
      <audio ref={audioRef} src={src} preload="none" />

      {/* Play/Pause Toggle */}
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-[#FF4655] hover:bg-[#ff5d6a] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF4655]/20 transition-transform active:scale-95"
        title={isPlaying ? "Pause" : "Play"}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
      </button>

      {/* Audio Title & Static SVG Waveform (Zero CPU Load) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 cursor-pointer" onClick={handleSeek}>
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-medium text-slate-200 truncate group-hover:text-white transition-colors" title={title}>
              {title}
            </span>
            {isIdle && (
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 font-bold">
                Idle
              </span>
            )}
            {isEquip && (
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 font-bold">
                Equip
              </span>
            )}
            {isLoop && !isIdle && (
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 font-bold">
                Loop
              </span>
            )}
          </div>
          <span className="font-display text-[10px] text-slate-400 shrink-0">
            {formatTime(currentTime)} {duration > 0 ? `/ ${formatTime(duration)}` : ''}
          </span>
        </div>

        {/* Lightweight SVG Waveform Bars */}
        <div className="h-4 w-full flex items-center gap-0.5 cursor-pointer">
          {waveformBars.map((heightPercent, idx) => {
            const isPlayed = idx / waveformBars.length <= progressRatio;
            return (
              <div
                key={idx}
                className={`flex-1 rounded-sm transition-colors ${
                  isPlayed ? 'bg-[#FF4655]' : 'bg-white/15 group-hover:bg-white/25'
                } ${isPlaying && isPlayed ? 'animate-pulse' : ''}`}
                style={{ height: `${heightPercent}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={toggleMute}
          className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleCopyLink}
          className={`p-1.5 rounded transition-colors ${
            copied ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-slate-400 hover:text-[#00F0FF] hover:bg-white/5'
          }`}
          title={copied ? "Copied link to clipboard!" : "Copy audio URL"}
          aria-label="Copy audio URL"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleDownload}
          className="p-1.5 text-slate-400 hover:text-[#00F0FF] hover:bg-white/5 rounded transition-colors"
          title="Download audio file"
          aria-label="Download audio file"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
