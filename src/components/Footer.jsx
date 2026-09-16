import React from 'react';
import { ShieldAlert, Heart, ExternalLink, Mail, Twitter, Instagram } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0E14] border-t border-white/10 mt-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Ko-fi Hosting Donation Banner */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1C1827] via-[#131722] to-[#0F141C] p-6 rounded-3xl border border-[#FF5E5B]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5E5B]/10 border border-[#FF5E5B]/30 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 text-[#FF5E5B] animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-[#FFFFFF]">Support Site Hosting</h3>
              <span className="text-[10px] uppercase font-display px-2 py-0.5 rounded bg-[#FF5E5B]/20 text-[#FF5E5B] border border-[#FF5E5B]/30">
                Ko-fi
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Currently looking for a low-cost web hosting provider. If you would like to participate in hosting fees, feel free to drop a tip on Ko-fi! All contributions will serve strictly to host the website under better performance conditions.
            </p>
          </div>
        </div>

        <a
          href="https://ko-fi.com/dartsgame"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl bg-[#FF5E5B] hover:bg-[#ff726f] text-[#FFFFFF] text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#FF5E5B]/20 transition-all active:scale-95 shrink-0"
        >
          Support on Ko-fi
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Main Footer Header & Social Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          
          {/* Brand & Vibe Coding Note */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#131722] border border-white/10 p-1.5 flex items-center justify-center shrink-0 mt-1">
              <img src={toAssetUrl('logo.svg')} alt="Spike Media Logo" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-1">
              <span className="font-display text-lg font-bold text-white tracking-tight">SPIKE MEDIA</span>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                This site was <span className="text-[#00F0FF] font-semibold">vibe-coded</span> with passionate manual research. Created non-commercially for free to help everyone (creators, video editors, and developers).
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://x.com/dartsgamekz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#131722] hover:bg-[#1C2230] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Twitter className="w-4 h-4 text-[#00F0FF]" />
              <span>@dartsgamekz</span>
            </a>

            <a
              href="https://www.instagram.com/dartsgame974"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#131722] hover:bg-[#1C2230] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span>@dartsgame974</span>
            </a>

            <a
              href="mailto:dartsgamekaizoku@gmail.com"
              className="px-3.5 py-2 rounded-xl bg-[#131722] hover:bg-[#1C2230] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4 text-[#22C55E]" />
              <span>dartsgamekaizoku@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Legal Copyright Disclaimer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400 font-normal leading-relaxed">
          <p>
            Spike Media is an independent fan project and is not created, endorsed, or sponsored by Riot Games. All Valorant game assets, trademarks, sound effects, and artwork belong strictly to Riot Games, Inc., under their &quot;<a
              href="https://www.riotgames.com/en/legal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 hover:text-[#FF4655] underline underline-offset-2 transition-colors font-medium"
            >Legal Jibber Jabber</a>&quot; terms.
          </p>

          <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Non-Commercial Community Project</span>
          </div>
        </div>

      </div>
    </footer>
  );
}



