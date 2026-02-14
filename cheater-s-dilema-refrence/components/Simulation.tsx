import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Agent, View } from '../types';
import { generateAgents, processTick } from '../utils/gameLogic';
import GameBoard from './GameBoard';
import AgentCard from './AgentCard';
import EventLog from './EventLog';
import Leaderboard from './Leaderboard';
import { INITIAL_AGENTS, WINNING_SCORE } from '../constants';
import { Play, Pause, RotateCcw, FastForward, Trophy, MessageSquare, ArrowLeft } from 'lucide-react';

interface SimulationProps {
  onBack: () => void;
}

const Simulation: React.FC<SimulationProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>({
    tick: 0,
    isRunning: false,
    winner: null,
    agents: [],
    logs: [],
    speed: 1000 // ms per tick
  });
  
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showInteractions, setShowInteractions] = useState<boolean>(true);
  
  // Initialize game on mount
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetGame = useCallback(() => {
    const agents = generateAgents(INITIAL_AGENTS);
    setGameState({
      tick: 0,
      isRunning: false,
      winner: null,
      agents,
      logs: [],
      speed: 500
    });
    setSelectedAgentId(null);
  }, []);

  // Game Loop
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState.isRunning && !gameState.winner) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => {
          const { newAgents, logs: newLogs } = processTick(prev.agents, prev.tick + 1);
          
          // Check winner
          const winner = newAgents.find(a => a.score >= WINNING_SCORE);
          let finalWinner = prev.winner;
          
          if (winner) {
             finalWinner = winner;
             newLogs.push({
                 id: crypto.randomUUID(),
                 tick: prev.tick + 1,
                 message: `🏆 GAME OVER! ${winner.name} wins with ${Math.floor(winner.score)} points!`,
                 type: 'win'
             });
          }
          
          // Also check if everyone else is dead
          const alive = newAgents.filter(a => a.isAlive);
          if (alive.length === 1 && !winner) {
             finalWinner = alive[0];
             newLogs.push({
                 id: crypto.randomUUID(),
                 tick: prev.tick + 1,
                 message: `🏆 GAME OVER! ${finalWinner.name} is the last survivor!`,
                 type: 'win'
             });
          }

          return {
            ...prev,
            tick: prev.tick + 1,
            agents: newAgents,
            logs: [...prev.logs, ...newLogs], // Keep logs history
            winner: finalWinner,
            isRunning: !finalWinner // Stop if winner found
          };
        });
      }, gameState.speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isRunning, gameState.speed, gameState.winner]);

  const togglePlay = () => {
    if (gameState.winner) return;
    setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const changeSpeed = () => {
      setGameState(prev => ({
          ...prev,
          speed: prev.speed === 1000 ? 500 : prev.speed === 500 ? 100 : 1000
      }));
  };

  const selectedAgent = gameState.agents.find(a => a.id === selectedAgentId) || null;

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 shadow-md z-20">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-xs">
                <ArrowLeft size={16} /> EXIT
            </button>
            <div className="w-[1px] h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2">
                <div className="bg-yellow-500 text-black p-1 rounded font-bold font-pixel text-[10px]">RPG</div>
                <h1 className="font-bold text-sm tracking-tight text-white hidden sm:block"><span className="text-yellow-500">Cheater's</span> Dilemma</h1>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-inner">
                <button 
                    onClick={togglePlay}
                    disabled={!!gameState.winner}
                    className={`p-2 rounded hover:bg-slate-700 transition ${gameState.isRunning ? 'text-yellow-400' : 'text-green-400'} ${!!gameState.winner ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={gameState.isRunning ? "Pause" : "Play"}
                >
                    {gameState.isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
                <button 
                    onClick={changeSpeed}
                    className="p-2 rounded hover:bg-slate-700 text-blue-400 transition"
                    title="Toggle Speed"
                >
                    <FastForward size={18} className={gameState.speed < 500 ? 'text-white' : ''} />
                </button>
                <div className="w-[1px] h-5 bg-slate-700 mx-1"></div>
                <button 
                    onClick={() => setShowInteractions(!showInteractions)}
                    className={`p-2 rounded hover:bg-slate-700 transition ${showInteractions ? 'text-yellow-400' : 'text-slate-500'}`}
                    title="Toggle Interaction Bubbles"
                >
                    <MessageSquare size={18} />
                </button>
                <div className="w-[1px] h-5 bg-slate-700 mx-1"></div>
                <button 
                    onClick={resetGame}
                    className="p-2 rounded hover:bg-slate-700 text-red-400 transition"
                    title="Reset Simulation"
                >
                    <RotateCcw size={18} />
                </button>
            </div>
            <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800 shadow-inner min-w-[100px] text-center">
                TICK: <span className="text-white font-bold">{gameState.tick}</span>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-4 flex gap-4 bg-slate-950">
        
        {/* Left Column: Game Board */}
        <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800 relative shadow-inner">
             <GameBoard 
                agents={gameState.agents} 
                onAgentClick={(a) => setSelectedAgentId(a.id)}
                selectedAgentId={selectedAgentId}
                showInteractions={showInteractions}
             />
             
             {/* Winner Overlay */}
             {gameState.winner && (
                 <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fade-in backdrop-blur-sm rounded-xl">
                     <Trophy size={64} className="text-yellow-400 mb-4 animate-bounce" />
                     <h2 className="text-4xl font-bold text-white font-pixel mb-2">VICTORY</h2>
                     <p className="text-xl text-slate-300 mb-8 font-mono">{gameState.winner.name} dominated the world!</p>
                     <div className="flex gap-4">
                        <button 
                            onClick={resetGame}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded font-pixel text-xs shadow-lg transition transform hover:scale-105"
                        >
                            RESTART
                        </button>
                        <button 
                            onClick={onBack}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded font-pixel text-xs shadow-lg transition transform hover:scale-105"
                        >
                            EXIT
                        </button>
                     </div>
                 </div>
             )}
        </div>

        {/* Right Column: Stats & Logs */}
        <div className="w-80 lg:w-96 flex flex-col gap-4 shrink-0">
            {/* Top Right: Agent Detail */}
            <div className="h-64 shrink-0">
                <AgentCard agent={selectedAgent} />
            </div>

            {/* Middle Right: Leaderboard */}
            <div className="h-48 shrink-0">
                <Leaderboard agents={gameState.agents} />
            </div>

            {/* Bottom Right: Event Log */}
            <div className="flex-1 min-h-0">
                <EventLog logs={gameState.logs} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default Simulation;