import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AgentGrid from './components/AgentGrid';
import AgentDetailModal from './components/AgentDetailModal';
import UISFXSection from './components/UISFXSection';
import GameAssetsSection from './components/GameAssetsSection';
import CodenamesSection from './components/CodenamesSection';
import RecommendedSites from './components/RecommendedSites';
import SearchOverlay from './components/SearchOverlay';
import CodenamesModal from './components/CodenamesModal';
import Footer from './components/Footer';
import { Disc, Radio, Search, Sparkles, Loader2, Box, Code } from 'lucide-react';
import { toAssetUrl } from './utils/urlHelper';

export default function App() {
  const [registryData, setRegistryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('agents'); // 'agents', 'ui', 'gameassets', 'codenames', 'community'
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCodenamesOpen, setIsCodenamesOpen] = useState(false);

  const fetchRegistry = useCallback(() => {
    const baseUrl = import.meta.env.BASE_URL || './';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const primaryUrl = '/api/registry';
    const fallbackUrl = `${cleanBase}registry.json?t=${Date.now()}`;

    fetch(primaryUrl)
      .then(res => {
        if (!res.ok) throw new Error('API unavailable, fallback to static JSON');
        return res.json();
      })
      .catch(() => fetch(fallbackUrl).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} when fetching static registry`);
        return res.json();
      }))
      .then(data => {
        setRegistryData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load registry:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  const stats = {
    agentsCount: registryData?.agentsCount || 0,
    uiCategoriesCount: Object.keys(registryData?.uiCategories || {}).length
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#161B22] via-[#0F141C] to-[#1C2230] p-6 sm:p-10 border border-white/10 overflow-hidden shadow-2xl space-y-4">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4655]/10 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          {/* Blurred Spike Media Background Vector Logo */}
          <img 
            src={toAssetUrl('logo.svg')} 
            alt="" 
            className="absolute -right-8 -bottom-12 sm:-right-4 sm:-bottom-8 w-72 sm:w-96 h-72 sm:h-96 opacity-15 filter blur-[2px] pointer-events-none select-none transform rotate-12"
          />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4655]/10 border border-[#FF4655]/20 text-[#FF4655] font-display text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Minimalist Valorant SFX & Asset Library
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-none">
              SPIKE MEDIA
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Explore, stream, and download individual agent abilities, killfeed icons, minimap icons, high-res portraits, weapons, and general UI sound effects.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'agents'
                    ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                    : 'bg-[#131722] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Disc className="w-4 h-4" />
                Browse {stats.agentsCount} Agents
              </button>

              <button
                onClick={() => setActiveTab('ui')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'ui'
                    ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                    : 'bg-[#131722] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Radio className="w-4 h-4 text-[#00F0FF]" />
                UI SFX Catalog
              </button>

              <button
                onClick={() => setActiveTab('gameassets')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'gameassets'
                    ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                    : 'bg-[#131722] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Box className="w-4 h-4 text-[#00F0FF]" />
                Weapons & Assets
              </button>

              <button
                onClick={() => setActiveTab('codenames')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === 'codenames'
                    ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                    : 'bg-[#FF4655]/10 hover:bg-[#FF4655]/20 text-[#FF4655] border border-[#FF4655]/20'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Codenames Index
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-2 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Quick Search
              </button>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400 font-display text-sm">
            <Loader2 className="w-8 h-8 text-[#FF4655] animate-spin" />
            <span>Loading Valorant Asset Index...</span>
          </div>
        ) : (
          <>
            {/* View Switching */}
            {activeTab === 'agents' && (
              <AgentGrid
                agents={registryData?.agents || []}
                roleIcons={registryData?.roleIcons || {}}
                onSelectAgent={setSelectedAgent}
              />
            )}

            {activeTab === 'ui' && (
              <UISFXSection
                uiCategories={registryData?.uiCategories || {}}
              />
            )}

            {activeTab === 'gameassets' && (
              <GameAssetsSection
                registry={registryData}
              />
            )}

            {activeTab === 'codenames' && (
              <CodenamesSection
                registry={registryData}
              />
            )}

            {activeTab === 'community' && (
              <RecommendedSites />
            )}
          </>
        )}

      </main>

      {/* Agent Detail Sheet / Modal */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {/* Global Search Modal */}
      {registryData && (
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          registry={registryData}
          onSelectAgent={setSelectedAgent}
        />
      )}

      {/* Codenames Reference Modal */}
      {isCodenamesOpen && (
        <CodenamesModal
          onClose={() => setIsCodenamesOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}


