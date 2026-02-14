import React from 'react';
import { Agent } from '../types';
import { AVATAR_API_BASE, STRATEGY_COLORS } from '../constants';
import { Shield, Sword, Heart, Trophy, Skull } from 'lucide-react';

interface AgentCardProps {
  agent: Agent | null;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  if (!agent) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex items-center justify-center text-slate-500 text-sm italic">
        Select an agent to view details
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 p-4 rounded-lg border-2 ${agent.isAlive ? STRATEGY_COLORS[agent.strategy] : 'border-gray-600'} shadow-lg transition-all`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
          <img 
            src={`${AVATAR_API_BASE}${agent.avatarSeed}`} 
            alt={agent.name} 
            className={`w-full h-full object-cover ${!agent.isAlive ? 'grayscale opacity-50' : ''}`}
          />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            {agent.name}
            {!agent.isAlive && <Skull size={16} className="text-gray-400" />}
          </h3>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            {agent.strategy} CLASS
          </div>
          <div className="text-xs text-yellow-400 font-bold mt-1">
            SCORE: {Math.floor(agent.score)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-900/50 p-2 rounded flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1"><Heart size={12}/> HP</span>
          <span className={`${agent.health < 15 ? 'text-red-500' : 'text-green-400'} font-mono`}>{agent.health}/50</span>
        </div>
        <div className="bg-slate-900/50 p-2 rounded flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1"><Trophy size={12}/> Kills</span>
          <span className="text-white font-mono">{agent.kills}</span>
        </div>
        <div className="bg-slate-900/50 p-2 rounded flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1"><Sword size={12}/> STR</span>
          <span className="text-white font-mono">{agent.strength.toFixed(1)}</span>
        </div>
        <div className="bg-slate-900/50 p-2 rounded flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1"><Shield size={12}/> DEF</span>
          <span className="text-white font-mono">{agent.defense.toFixed(1)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-1">CURRENT STATUS</div>
        <div className="text-sm text-white">
          {agent.isAlive ? (
             <span className="italic">
               {agent.lastAction === 'IDLE' ? 'Waiting...' : 
                agent.lastAction === 'ATTACK' ? `Attacking ${agent.lastActionTarget}!` :
                agent.lastAction === 'STEAL' ? `Stealing from ${agent.lastActionTarget}!` :
                agent.lastAction === 'MOVE' ? 'Moving positions.' :
                agent.lastAction === 'GATHER' ? 'Working honestly.' :
                agent.lastAction === 'HEAL' ? 'Recovering health.' : ''}
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