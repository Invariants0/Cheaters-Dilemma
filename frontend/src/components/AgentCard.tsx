"use client";

import React from 'react';
import { AgentSummary } from '@/lib/types';
import { Shield, Sword, Heart, Trophy, Skull } from 'lucide-react';

interface AgentCardProps {
  agent: AgentSummary | null;
}

const AVATAR_API_BASE = "https://api.dicebear.com/7.x/pixel-art/svg?seed=";

const STRATEGY_COLORS = {
  HONEST: 'border-blue-500',
  AGGRESSIVE: 'border-red-600',
  DECEPTIVE: 'border-purple-500',
  CHAOTIC: 'border-orange-500'
};

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  if (!agent) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex items-center justify-center text-slate-500 text-sm italic">
        Select an agent to view details
      </div>
    );
  }

  const getStrategyColor = (strategy: string) => {
    switch(strategy.toLowerCase()) {
      case 'honest': return 'border-blue-500';
      case 'aggressive': return 'border-red-600';
      case 'deceptive': return 'border-purple-500';
      case 'chaotic': return 'border-orange-500';
      default: return 'border-slate-500';
    }
  };

  return (
    <div className={`bg-slate-800 p-4 rounded-lg border-2 ${agent.alive ? getStrategyColor(agent.strategy) : 'border-gray-600'} shadow-lg transition-all`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
          <img
            src={`${AVATAR_API_BASE}${agent.agent_id}`}
            alt={`Agent ${agent.agent_id}`}
            className={`w-full h-full object-cover pixelated ${!agent.alive ? 'grayscale opacity-50' : ''}`}
          />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            Agent {agent.agent_id}
            {!agent.alive && <Skull size={16} className="text-gray-400" />}
          </h3>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            {agent.strategy} CLASS
          </div>
          <div className="text-xs text-yellow-400 font-bold mt-1">
            RESOURCES: {Math.floor(agent.resources)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-900/50 p-2 rounded flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1"><Heart size={12}/> ALIVE</span>
          <span className={`${agent.alive ? 'text-green-400' : 'text-red-500'} font-mono`}>
            {agent.alive ? 'YES' : 'NO'}
          </span>
        </div>
        <div className="bg-slate-900/50 p-2 rounded flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1"><Trophy size={12}/> TRUST</span>
          <span className="text-white font-mono">{agent.trust.toFixed(2)}</span>
        </div>
        <div className="bg-slate-900/50 p-2 rounded flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1"><Sword size={12}/> STRENGTH</span>
          <span className="text-white font-mono">{agent.strength.toFixed(1)}</span>
        </div>
        <div className="bg-slate-900/50 p-2 rounded flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1"><Shield size={12}/> AGGRESSION</span>
          <span className="text-white font-mono">{agent.aggression.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-1">CURRENT STATUS</div>
        <div className="text-sm text-white">
          {agent.alive ? (
             <span className="italic">
               Active in simulation
             </span>
          ) : (
            <span className="text-red-500 font-bold">ELIMINATED</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;