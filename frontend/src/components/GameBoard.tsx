"use client";

import React from 'react';
import { AgentSummary } from '@/lib/types';
import { Skull, Swords, Footprints, HandCoins, ShieldPlus } from 'lucide-react';


export const AVATAR_API_BASE = "https://api.dicebear.com/7.x/pixel-art/svg?seed=";
interface Position {
  x: number;
  y: number;
}

interface GameBoardProps {
  agents: AgentSummary[];
  onAgentClick: (agent: AgentSummary) => void;
  selectedAgentId: number | null;
  showInteractions?: boolean;
  agentCount?: number;
  seed?: number;
}

const GRID_SIZE = 15;

const STRATEGY_COLORS = {
  HONEST: 'border-blue-500',
  AGGRESSIVE: 'border-red-600',
  DECEPTIVE: 'border-purple-500',
  CHAOTIC: 'border-orange-500'
};

const GameBoard: React.FC<GameBoardProps> = ({
  agents,
  onAgentClick,
  selectedAgentId,
  showInteractions = false,
  agentCount = 10,
  seed = 42
}) => {
  // Filter only alive agents
  const aliveAgents = agents.filter(agent => agent.alive);

  // Simple seeded random number generator
  const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
  };

  // Generate random position for agent
  const getAgentPosition = (agentId: number): Position => {
    const rng = seededRandom(`${seed}-${agentId}`);
    const x = Math.floor(rng() * GRID_SIZE);
    const y = Math.floor(rng() * GRID_SIZE);
    return { x, y };
  };

  // Create grid cells
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      cells.push({ x, y });
    }
  }

  // Find agent at position (only alive agents)
  const getAgentAt = (pos: Position) => {
    return aliveAgents.find(agent => {
      const agentPos = getAgentPosition(agent.agent_id);
      return agentPos.x === pos.x && agentPos.y === pos.y;
    }) || null;
  };

  const getActionIcon = (agent: AgentSummary) => {
    // Map actions to icons (simplified for now)
    if (agent.aggression > 0.7) return <Swords size={12} className="text-red-500 animate-pulse" />;
    if (agent.resources > 50) return <HandCoins size={12} className="text-yellow-500" />;
    if (agent.strength > 50) return <ShieldPlus size={12} className="text-green-500" />;
    return <Footprints size={12} className="text-slate-400" />;
  };

  const getInteractionColor = (action: string) => {
    switch(action) {
        case 'ATTACK': return 'text-red-300 bg-red-900/80 border-red-500';
        case 'STEAL': return 'text-yellow-300 bg-yellow-900/80 border-yellow-500';
        case 'HEAL': return 'text-green-300 bg-green-900/80 border-green-500';
        case 'GATHER': return 'text-blue-300 bg-blue-900/80 border-blue-500';
        default: return 'text-slate-200 bg-slate-900/80 border-slate-500';
    }
  };

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
    <div className="space-y-2">
      <div className="text-xs text-slate-400 font-mono">
        Agents: {aliveAgents.length}/{agentCount} alive | Seed: {seed}
      </div>
      <div 
        className="grid gap-1 bg-slate-800 p-2 rounded-lg border-2 border-slate-700 shadow-2xl overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          aspectRatio: '1/1',
          width: '600px',
          height: '600px'
        }}
      >
      {cells.map((cell) => {
        const agent = getAgentAt(cell);
        const isSelected = agent && agent.agent_id === selectedAgentId;

        return (
          <div
            key={`${cell.x}-${cell.y}`}
            className={`
              relative bg-slate-900/50 rounded-sm border border-slate-800/50
              flex items-center justify-center transition-all duration-300
              ${agent ? 'cursor-pointer hover:bg-slate-800' : ''}
              ${isSelected ? 'ring-2 ring-yellow-400 z-10' : ''}
            `}
            onClick={() => agent && onAgentClick(agent)}
          >
            {agent && (
              <div className="relative w-full h-full p-0.5 group">
                {/* Agent Avatar */}
                <div className={`w-full h-full rounded overflow-hidden border-2 ${getStrategyColor(agent.strategy)} bg-slate-950`}>
                   <img
                    src={`${AVATAR_API_BASE}${agent.agent_id}`}
                    alt={`Agent ${agent.agent_id}`}
                    className="w-full h-full object-cover pixelated"
                   />
                </div>

                {/* Status Overlay (HP Bar) */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (agent.resources / 100) * 100)}%` }}
                    />
                </div>

                {/* Action Bubble Icon */}
                {agent.aggression > 0.5 && (
                    <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-0.5 border border-slate-600 z-20 shadow-md">
                        {getActionIcon(agent)}
                    </div>
                )}

                {/* Score Tag */}
                <div className="absolute top-0 left-0 bg-black/60 text-[8px] text-white px-1 rounded-br backdrop-blur-sm font-mono">
                    {Math.floor(agent.resources)}
                </div>
              </div>
            )}

            {/* Render Dead Bodies */}
            {!agent && agents.find(a => !a.alive) && (
               <div className="opacity-30 grayscale">
                  <Skull size={16} className="text-slate-600" />
               </div>
            )}

          </div>
        );
      })}
    </div>
    </div>
  );
};

export default GameBoard;

