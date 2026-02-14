import React from 'react';
import { Agent, Position } from '../types';
import { GRID_SIZE, AVATAR_API_BASE, STRATEGY_COLORS } from '../constants';
import { Skull, Swords, Footprints, HandCoins, ShieldPlus } from 'lucide-react';

interface GameBoardProps {
  agents: Agent[];
  onAgentClick: (agent: Agent) => void;
  selectedAgentId: string | null;
  showInteractions: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ agents, onAgentClick, selectedAgentId, showInteractions }) => {
  // Create grid cells
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      cells.push({ x, y });
    }
  }

  const getAgentAt = (pos: Position) => agents.find(a => a.isAlive && a.position.x === pos.x && a.position.y === pos.y);

  const getActionIcon = (agent: Agent) => {
    switch (agent.lastAction) {
        case 'ATTACK': return <Swords size={12} className="text-red-500 animate-pulse" />;
        case 'STEAL': return <HandCoins size={12} className="text-yellow-500" />;
        case 'MOVE': return <Footprints size={12} className="text-slate-400" />;
        case 'HEAL': return <ShieldPlus size={12} className="text-green-500" />;
        default: return null;
    }
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

  return (
    <div 
      className="grid gap-1 bg-slate-800 p-2 rounded-lg border-2 border-slate-700 shadow-2xl overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        aspectRatio: '1/1',
        maxHeight: '80vh',
        maxWidth: '80vh'
      }}
    >
      {cells.map((cell) => {
        const agent = getAgentAt(cell);
        const isSelected = agent && agent.id === selectedAgentId;

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
                <div className={`w-full h-full rounded overflow-hidden border-2 ${STRATEGY_COLORS[agent.strategy]} bg-slate-950`}>
                   <img 
                    src={`${AVATAR_API_BASE}${agent.avatarSeed}`} 
                    alt={agent.name} 
                    className="w-full h-full object-cover pixelated"
                   />
                </div>

                {/* Status Overlay (HP Bar) */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                    <div 
                        className="h-full bg-green-500 transition-all duration-300" 
                        style={{ width: `${(agent.health / 50) * 100}%` }}
                    />
                </div>

                {/* Action Bubble Icon */}
                {agent.lastAction !== 'IDLE' && (
                    <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-0.5 border border-slate-600 z-20 shadow-md">
                        {getActionIcon(agent)}
                    </div>
                )}
                
                {/* Interaction Details Bubble (Toggleable) */}
                {showInteractions && agent.lastActionDetails && agent.lastAction !== 'MOVE' && agent.lastAction !== 'IDLE' && (
                    <div className={`
                        absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-30
                        px-1.5 py-0.5 rounded text-[8px] font-bold border shadow-lg pointer-events-none
                        ${getInteractionColor(agent.lastAction)}
                        animate-fade-in-up
                    `}>
                        {agent.lastActionDetails}
                    </div>
                )}
                
                {/* Score Tag */}
                <div className="absolute top-0 left-0 bg-black/60 text-[8px] text-white px-1 rounded-br backdrop-blur-sm font-mono">
                    {Math.floor(agent.score)}
                </div>
              </div>
            )}
            
            {/* Render Dead Bodies */}
            {!agent && agents.find(a => !a.isAlive && a.position.x === cell.x && a.position.y === cell.y) && (
               <div className="opacity-30 grayscale">
                  <Skull size={16} className="text-slate-600" />
               </div>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;