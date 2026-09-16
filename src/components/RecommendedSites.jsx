import React from 'react';
import { ExternalLink, Layers, BookOpen, Youtube, Wrench, Eye, MessageSquare, Code, Terminal, Crosshair, Cpu, Sparkles, Radio } from 'lucide-react';
import { toAssetUrl } from '../utils/urlHelper';

export default function RecommendedSites() {
  const communityDiscords = [
    {
      title: 'VALORANT 3D & Editing',
      desc: 'Discord community for 3D artists, animators, cinematic editors, and asset extractors.',
      url: 'https://discord.gg/vZH8WamvcB',
      tag: 'Discord Community',
      icon: <MessageSquare className="w-5 h-5 text-[#FF4655]" />
    },
    {
      title: 'Valorant App Developers',
      desc: 'Hub for software developers, API creators, overlay engineers, and bot builders.',
      url: 'https://discord.gg/nbFJqjCQuv',
      tag: 'Discord Community',
      icon: <Code className="w-5 h-5 text-[#00F0FF]" />
    }
  ];

  const developerApis = [
    {
      title: 'Valorant-API (Unofficial API)',
      desc: 'Free, public REST API providing high-res game assets, weapons, cards, and agent data.',
      url: 'https://valorant-api.com/',
      tag: 'REST API',
      image: toAssetUrl('resources/valorant_api_og.webp'),
      icon: <Terminal className="w-5 h-5 text-[#00F0FF]" />
    },
    {
      title: 'Riot Games Developer Portal',
      desc: 'Official Riot Games developer documentation for Valorant APIs and policies.',
      url: 'https://developer.riotgames.com/docs/valorant',
      tag: 'Official Docs',
      icon: <Cpu className="w-5 h-5 text-[#FF4655]" />
    },
    {
      title: 'HenrikDev Valorant API',
      desc: 'Popular API wrapper for match stats, MMR ratings, store offers, and player profiles.',
      url: 'https://docs.henrikdev.xyz/valorant/general',
      tag: 'API Docs',
      icon: <Code className="w-5 h-5 text-[#A855F7]" />
    },
    {
      title: 'FModel Datamining Tool',
      desc: 'Open-source Unreal Engine 4 datamining software used to extract Valorant game files.',
      url: 'https://fmodel.app/',
      tag: 'Datamining Software',
      image: toAssetUrl('resources/fmodel_og.webp'),
      icon: <Wrench className="w-5 h-5 text-[#22C55E]" />
    }
  ];

  const onlineTools = [
    {
      title: 'Valorant Crosshair Database (VCRDB)',
      desc: 'Browse and copy pro player crosshair codes, custom reticles, and crosshair profiles.',
      url: 'https://www.vcrdb.net/',
      image: toAssetUrl('resources/vcrdb_og.webp'),
      icon: <Crosshair className="w-5 h-5 text-[#00F0FF]" />
    },
    {
      title: 'Valorant Killfeed Generator',
      desc: 'Custom killfeed overlay generator for video editing and content creators.',
      url: 'https://valorant-killfeed-generator.onrender.com/',
      image: toAssetUrl('resources/killfeed_gen_og.webp'),
      icon: <Wrench className="w-5 h-5 text-[#FF4655]" />
    },
    {
      title: 'ValSkins (3D/2D Viewer)',
      desc: 'Interactive 3D and 2D skin viewer and cosmetic database.',
      url: 'https://www.val-skins.com/',
      image: toAssetUrl('resources/Valskins.webp'),
      icon: <Eye className="w-5 h-5 text-[#A855F7]" />
    },
    {
      title: 'Kingdom Archives Database',
      desc: 'Complete player cards, kill banners, 3D models, and voiceline library.',
      url: 'https://kingdomarchives.com',
      image: toAssetUrl('resources/kingdomarchives_og.webp'),
      icon: <Layers className="w-5 h-5 text-[#22C55E]" />
    }
  ];

  const youtubeShowcases = [
    {
      title: 'Kingdom Archives',
      desc: 'Skin showcases & homescreen archives.',
      url: 'https://www.youtube.com/@kingdomarchives18',
      channelTag: '@kingdomarchives18'
    },
    {
      title: 'MeoxVal Showcase',
      desc: 'Valorant weapon skin showcases & menu homescreens.',
      url: 'https://www.youtube.com/@MeoxVal/videos',
      channelTag: '@MeoxVal'
    },
    {
      title: 'Valorant Showcase by Reven',
      desc: 'High quality weapon skins showcase and gameplay inspection.',
      url: 'https://www.youtube.com/@REVENVALORANT/videos',
      channelTag: '@REVENVALORANT'
    },
    {
      title: 'Valorant LAB (JP)',
      desc: 'Japanese skin showcases and cosmetics preview.',
      url: 'https://www.youtube.com/@VALORANTLab_JP/videos',
      channelTag: '@VALORANTLab_JP'
    },
    {
      title: 'Valorant LAB (EN)',
      desc: 'English skin showcases, bundles, and finisher previews.',
      url: 'https://www.youtube.com/@ValorantLab_EN',
      channelTag: '@ValorantLab_EN'
    }
  ];

  const featuredCreators = [
    {
      name: 'valohabercisi',
      handle: '@valohabercisi',
      url: 'https://x.com/valohabercisi',
      tag: 'Top Dataminer & Leaker',
      image: toAssetUrl('resources/valohabercisi.webp'),
      desc: 'The most relevant, trusted, and well-known Valorant dataminer and leaker in the community.'
    },
    {
      name: 'BDERADIANTE',
      handle: '@BDERADIANTE',
      url: 'https://x.com/BDERADIANTE',
      tag: 'Spanish News & Info',
      desc: 'Spanish-language informational account covering Valorant news on Console, Mobile, and PC platform updates.'
    },
    {
      name: 'kohteihep',
      handle: '@kohteihep',
      url: 'https://x.com/kohteihep',
      tag: 'Datamining & Dev',
      desc: 'Valorant enthusiast covering datamining, dev insights, leak suppression, and game content analysis.'
    },
    {
      name: 'Strawberry79',
      handle: '@Strawberry79',
      url: 'https://x.com/Strawberry79',
      tag: 'Lore Specialist & Artist',
      desc: 'Valorant lore nerd and digital artist sharing original character artwork and deep lore threads.'
    },
    {
      name: 'shade',
      handle: '@shadeiol',
      url: 'https://x.com/shadeiol',
      tag: '3D Editing & Motion',
      desc: 'High-tier Valorant 3D animator and video editor creating cinematic edits with XLR8System.'
    },
    {
      name: 'Marpkat',
      handle: '@Marpkat_',
      url: 'https://x.com/Marpkat_',
      tag: 'Brazilian Leaker',
      desc: 'Brazilian Valorant leaker and content creator sharing early game news, leaks, and updates.'
    },
    {
      name: 'urnotjustin',
      handle: '@urnotjustin',
      url: 'https://www.youtube.com/@urnotjustin/shorts',
      tag: 'Skin Specialist',
      image: toAssetUrl('resources/urnotjustin.webp'),
      desc: 'Valorant cosmetics specialist owning every skin in the game, creating weekly Shorts, skin tests, and gameplay reviews.'
    }
  ];

  return (
    <section className="space-y-12">
      
      {/* Interactive Web Tools with Official OG Embed Screenshots & Banners */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00F0FF]"></div>
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Featured Online Tools & Visual Viewers
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Handy online generators, crosshair databases, and interactive cosmetic viewers with official preview thumbnails.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {onlineTools.map((tool, idx) => (
            <a
              key={idx}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#131722] hover:bg-[#1C2230] border border-white/10 hover:border-[#00F0FF]/50 rounded-3xl p-4 transition-all group flex flex-col justify-between space-y-4 shadow-xl hover:shadow-[#00F0FF]/10 overflow-hidden"
            >
              {/* Mini Banner Screenshot Preview */}
              <div className="h-44 bg-[#0B0E14] rounded-2xl overflow-hidden relative border border-white/5 flex items-center justify-center">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#161B22] to-[#0F141C] flex items-center justify-center">
                    {tool.icon}
                  </div>
                )}
                <div className="absolute top-3 right-3 p-2 rounded-xl bg-[#0B0E14]/80 backdrop-blur-md border border-white/10 text-white group-hover:bg-[#00F0FF] group-hover:text-black transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 px-1">
                <h3 className="font-display font-bold text-base text-white group-hover:text-[#00F0FF] transition-colors flex items-center justify-between">
                  <span>{tool.title}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#00F0FF] font-semibold">
                <span className="flex items-center gap-1.5">
                  {tool.icon}
                  <span>Open Tool</span>
                </span>
                <span className="text-slate-500 font-normal">web tool</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Featured Community Specialists & Leakers */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#FF4655]"></div>
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Featured Community Specialists, Leakers & Artists
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Essential Twitter/X and YouTube creators covering Valorant news, 3D edits, lore analysis, datamined leaks, and skin collection archives.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {featuredCreators.map((creator, idx) => (
            <a
              key={idx}
              href={creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#131722] hover:bg-[#1C2230] border border-white/10 hover:border-[#FF4655]/40 rounded-3xl p-4 transition-all group flex flex-col justify-between space-y-4 shadow-xl hover:shadow-[#FF4655]/10 overflow-hidden"
            >
              {creator.image ? (
                <div className="h-44 bg-[#0B0E14] rounded-2xl overflow-hidden relative border border-white/5">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-[#0B0E14]/80 backdrop-blur-md border border-white/10 text-white group-hover:bg-[#FF4655] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="h-28 bg-gradient-to-r from-[#1A1F2C] via-[#0F141C] to-[#251928] rounded-2xl p-4 flex flex-col justify-between relative border border-white/5 overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#FF4655]/10 rounded-full blur-xl pointer-events-none"></div>
                  <span className="text-[10px] font-display uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FF4655]/20 text-[#FF4655] border border-[#FF4655]/30 font-semibold w-fit">
                    {creator.tag}
                  </span>
                  <div className="flex items-center justify-between z-10">
                    <span className="font-display font-bold text-lg text-white group-hover:text-[#FF4655] transition-colors">
                      {creator.name}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white group-hover:text-[#FF4655] transition-colors">
                    {creator.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">{creator.handle}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {creator.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#FF4655] font-semibold">
                <span>Visit Profile</span>
                <span className="text-slate-500 font-normal">{creator.url.includes('youtube') ? 'YouTube' : 'Twitter / X'}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Developer APIs & Datamining */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00F0FF]"></div>
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Developer APIs, Datamining & Documentation
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Official Riot documentation, datamining tools, and public REST APIs for game data & assets.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {developerApis.map((api, idx) => (
            <a
              key={idx}
              href={api.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#131722] hover:bg-[#1C2230] border border-white/10 hover:border-[#00F0FF]/40 rounded-3xl p-4 transition-all group flex flex-col justify-between space-y-4 shadow-xl hover:shadow-[#00F0FF]/5 overflow-hidden"
            >
              {api.image ? (
                <div className="h-44 bg-[#0B0E14] rounded-2xl overflow-hidden relative border border-white/5 flex items-center justify-center p-2">
                  <img
                    src={api.image}
                    alt={api.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 p-2 rounded-xl bg-[#0B0E14]/80 backdrop-blur-md border border-white/10 text-white group-hover:bg-[#00F0FF] group-hover:text-black transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="h-28 bg-gradient-to-r from-[#131722] via-[#0F141C] to-[#1C2230] rounded-2xl p-4 flex flex-col justify-between relative border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-[#0B0E14] border border-white/10 shrink-0">
                      {api.icon}
                    </div>
                    <span className="text-[10px] font-display uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                      {api.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-[#00F0FF] transition-colors">
                    {api.title}
                  </h3>
                </div>
              )}

              <div className="space-y-1 px-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white group-hover:text-[#00F0FF] transition-colors">
                    {api.title}
                  </h3>
                  <span className="text-[10px] font-display uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                    {api.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {api.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#00F0FF] font-semibold">
                <span className="flex items-center gap-1.5">
                  {api.icon}
                  <span>Open API Docs</span>
                </span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Community Discords */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#A855F7]"></div>
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Valorant Creator & Developer Discords
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Join active community servers for 3D animators, video editors, and application developers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {communityDiscords.map((discord, idx) => (
            <a
              key={idx}
              href={discord.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-gradient-to-r from-[#131722] to-[#1C2230] border border-white/10 hover:border-[#A855F7]/40 rounded-3xl transition-all group flex items-start justify-between gap-4 shadow-lg hover:shadow-[#A855F7]/5"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#0B0E14] border border-white/10 shrink-0">
                  {discord.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-white group-hover:text-[#A855F7] transition-colors">
                      {discord.title}
                    </h3>
                    <span className="text-[10px] font-display uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                      {discord.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {discord.desc}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0 mt-1" />
            </a>
          ))}
        </div>
      </div>

      {/* YouTube Showcase Channels */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#FF4655]"></div>
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Skin Showcase & Homescreen Media Channels
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          High quality YouTube creators providing homescreen showcases, weapon skin inspections, and finisher archives.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {youtubeShowcases.map((channel, idx) => (
            <a
              key={idx}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-[#131722] hover:bg-[#1C2230] border border-white/5 hover:border-[#FF4655]/40 rounded-3xl transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#FF4655]/10 text-[#FF4655]">
                      <Youtube className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{channel.channelTag}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-bold text-sm text-white group-hover:text-[#FF4655] transition-colors">
                  {channel.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {channel.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#FF4655] font-semibold">
                <span>View Channel</span>
                <span>YouTube</span>
              </div>
            </a>
          ))}
        </div>
      </div>

    </section>
  );
}
