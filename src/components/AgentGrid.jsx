import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function AgentGrid({ agents, roleIcons, onSelectAgent }) {
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const roles = [
    { key: 'All', label: 'All Agents', icon: roleIcons?.All ? `/${roleIcons.All}` : null },
    { key: 'Duelist', label: 'Duelist', icon: roleIcons?.Duelist ? `/${roleIcons.Duelist}` : null },
    { key: 'Initiator', label: 'Initiator', icon: roleIcons?.Initiator ? `/${roleIcons.Initiator}` : null },
    { key: 'Controller', label: 'Controller', icon: roleIcons?.Controller ? `/${roleIcons.Controller}` : null },
    { key: 'Sentinel', label: 'Sentinel', icon: roleIcons?.Sentinel ? `/${roleIcons.Sentinel}` : null }
  ];

  const filteredAgents = agents.filter(agent => {
    const agentRoleNorm = agent.role ? agent.role.toLowerCase() : '';
    const selectedRoleNorm = selectedRole.toLowerCase();

    const matchesRole = selectedRole === 'All' ||
      agentRoleNorm === selectedRoleNorm ||
      (selectedRoleNorm === 'duelist' && (agentRoleNorm.includes('duelliste') || agentRoleNorm.includes('duelist'))) ||
      (selectedRoleNorm === 'initiator' && (agentRoleNorm.includes('initiateur') || agentRoleNorm.includes('initiator'))) ||
      (selectedRoleNorm === 'controller' && (agentRoleNorm.includes('contrôleur') || agentRoleNorm.includes('controller'))) ||
      (selectedRoleNorm === 'sentinel' && (agentRoleNorm.includes('sentinelle') || agentRoleNorm.includes('sentinel')));

    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesRole && matchesSearch;
  });

  return (
    <section className="space-y-6">
      {/* Role Filters & Local Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#131722] p-3 rounded-2xl border border-white/5">
        
        {/* Role Filter Pills with English Labels & Official PNG Icons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {roles.map(r => (
            <button
              key={r.key}
              onClick={() => setSelectedRole(r.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-2 ${
                selectedRole === r.key
                  ? 'bg-[#FF4655] text-white shadow-md shadow-[#FF4655]/20'
                  : 'bg-[#0B0E14] text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/10'
              }`}
            >
              {r.icon && (
                <img src={r.icon} alt="" className="w-4 h-4 object-contain shrink-0" />
              )}
              <span className="whitespace-nowrap">{r.label}</span>
            </button>
          ))}
        </div>

        {/* Count Badge */}
        <div className="text-xs font-display text-slate-400 shrink-0 whitespace-nowrap">
          Showing <span className="text-white font-bold">{filteredAgents.length}</span> of {agents.length} Agents
        </div>
      </div>

      {/* Agents Archipelago Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredAgents.map(agent => {
          const portrait = agent.assets?.bustPortrait || agent.assets?.fullPortrait || agent.assets?.squareIcon;
          const sfxCount = Object.values(agent.audioCategories || {}).reduce((acc, cat) => acc + (cat?.clips?.length || cat?.length || 0), 0);

          return (
            <div
              key={agent.id || agent.name}
              onClick={() => onSelectAgent(agent)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between border border-white/5 hover:border-[#FF4655]/40 transition-all transform hover:-translate-y-1"
            >
              {/* Bust / Top-half of Agent framed cleanly */}
              <div className="relative h-56 bg-gradient-to-b from-[#1C2230] via-[#131722] to-[#0F141C] flex items-start justify-center overflow-hidden">
                {portrait ? (
                  <img
                    src={`/${portrait}`}
                    alt={agent.name}
                    className="w-full h-full object-cover object-top origin-top scale-[2.1] group-hover:scale-[2.25] transition-transform duration-300 pointer-events-none"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-display font-bold text-2xl">
                    {agent.name.substring(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Official Role Icon Badge */}
                {agent.roleIconPath && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-[#0B0E14]/85 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[10px] font-display font-medium text-slate-200">
                    <img src={`/${agent.roleIconPath}`} alt="" className="w-3.5 h-3.5 object-contain shrink-0" />
                    <span className="whitespace-nowrap">{agent.role || 'Agent'}</span>
                  </div>
                )}
              </div>

              {/* Agent Card Footer */}
              <div className="p-3.5 space-y-2 bg-[#131722]/90">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white group-hover:text-[#FF4655] transition-colors truncate">
                    {agent.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF4655] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* Ability Icons Strip */}
                <div className="flex items-center gap-1.5 pt-1">
                  {agent.assets?.abilityIcons?.slice(0, 4).map((abil, idx) => (
                    <div key={idx} className="w-6 h-6 rounded bg-[#0B0E14] border border-white/5 p-0.5 flex items-center justify-center shrink-0">
                      <img src={`/${abil.path}`} alt="" className="w-full h-full object-contain opacity-80 group-hover:opacity-100" />
                    </div>
                  ))}
                  {sfxCount > 0 && (
                    <span className="ml-auto text-[10px] font-display px-1.5 py-0.5 rounded bg-white/5 text-slate-400 whitespace-nowrap">
                      {sfxCount} SFX
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
