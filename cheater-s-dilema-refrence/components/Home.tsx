import React from 'react';
import { View } from '../types';
import { Terminal, Cpu, ShieldAlert, Play, BarChart3, BookOpen, Sigma, Scale, Users, Skull } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center">
      
      {/* Title Section */}
      <div className="text-center space-y-4 mb-10 animate-fade-in-up w-full max-w-6xl">
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-yellow-500 font-pixel tracking-tighter drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] whitespace-nowrap">
          THE CHEATER'S DILEMMA
        </h1>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        <h2 className="text-lg md:text-xl text-blue-400 font-pixel tracking-widest mt-4">
          &gt; MULTI AGENT WAR GAME &lt;
        </h2>
        <p className="text-slate-500 font-mono text-xs md:text-sm tracking-[0.2em] uppercase">
          WHERE TRUST IS A LIABILITY AND BETRAYAL IS A STRATEGY
        </p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left Column: The Philosophy (Glorified Game Theory) */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* Main Manifesto */}
            <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-sm shadow-xl relative group hover:border-yellow-600/50 transition-colors">
              <div className="absolute -top-3 left-4 bg-slate-950 px-2 text-yellow-500 font-pixel text-[10px] border border-slate-800">
                [ THE MATHEMATICS OF BETRAYAL ]
              </div>
              
              <div className="prose prose-invert max-w-none font-mono text-slate-300 space-y-4 text-sm">
                <p className="leading-relaxed">
                  <span className="text-yellow-400 font-bold">Game Theory</span> dictates that in a zero-sum environment lacking a central enforcer, the "Rational Actor" will always choose to cheat. It is the <span className="italic text-white">Nash Equilibrium</span> of survival—if you play fair while others defect, you die.
                </p>
                <p className="leading-relaxed">
                  This simulation explores the <span className="text-red-400 font-bold">Prisoner's Dilemma</span> at scale. Trust is an expensive luxury. Betrayal is a free optimization. When 20 agents compete for finite resources, the "rules" become suggestions, and morality becomes a weakness.
                </p>
                <p className="leading-relaxed border-l-2 border-slate-600 pl-4 italic text-slate-400 text-xs">
                  "The easiest way to win is to break the rules before your opponent realizes they are playing a game."
                </p>
              </div>
            </div>

            {/* Real World Reflection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 border-l-4 border-blue-500 rounded-r shadow-lg">
                    <div className="flex items-center gap-3 mb-2 text-blue-400 font-bold font-pixel text-[10px]">
                        <Scale size={16} />
                        <span>THE GINI COEFFICIENT</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                        As high-performing agents (or successful cheaters) accumulate wealth, inequality spikes. Does the system collapse? Or do the weak band together to topple the giants?
                    </p>
                </div>

                <div className="bg-slate-900/50 p-4 border-l-4 border-red-500 rounded-r shadow-lg">
                    <div className="flex items-center gap-3 mb-2 text-red-400 font-bold font-pixel text-[10px]">
                        <Users size={16} />
                        <span>ALLIANCE PARADOX</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                        Formation of alliances provides safety, but the "First Mover" paints a target on their back. Being the first to trust is dangerous; being the last to trust is fatal.
                    </p>
                </div>
            </div>

        </div>

        {/* Right Column: Menu & Actions */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
            
            {/* Launch Visual Sim */}
            <button 
                onClick={() => onNavigate('simulation')}
                className="group relative bg-slate-900 hover:bg-slate-800 border-2 border-yellow-600/30 hover:border-yellow-500 p-6 transition-all duration-300 text-left overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.1)]"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Terminal size={100} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl text-yellow-500 font-pixel mb-3 group-hover:translate-x-2 transition-transform">
                        &gt; LAUNCH WORLD &lt;
                    </h3>
                    <p className="text-slate-400 font-mono text-xs max-w-[85%]">
                        Initialize 20 autonomous agents. Observe real-time combat, stealing algorithms, and emergent social dynamics.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-yellow-600">
                        <Play size={12} className="animate-pulse" /> <span>SIMULATION ENGINE READY</span>
                    </div>
                </div>
            </button>

            {/* Sub Menu Grid */}
            <div className="grid grid-cols-1 gap-3 flex-1">
                <button 
                    onClick={() => onNavigate('agents')}
                    className="flex items-center justify-between bg-slate-900 border border-slate-700 hover:border-blue-400 hover:bg-slate-800/50 p-4 group transition-all"
                >
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2 mb-1 text-slate-300 group-hover:text-blue-400">
                            <Cpu size={18} /> <span className="font-pixel text-xs">[ AGENTS ]</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Behavioral Architectures & Avatars</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 font-mono text-lg">&gt;</div>
                </button>

                <button 
                    onClick={() => onNavigate('rules')}
                    className="flex items-center justify-between bg-slate-900 border border-slate-700 hover:border-green-400 hover:bg-slate-800/50 p-4 group transition-all"
                >
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2 mb-1 text-slate-300 group-hover:text-green-400">
                            <BookOpen size={18} /> <span className="font-pixel text-xs">[ RULES ]</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">The Logic of Systemic Corruption</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400 font-mono text-lg">&gt;</div>
                </button>

                <button 
                    onClick={() => onNavigate('replays')}
                    className="flex items-center justify-between bg-slate-900 border border-slate-700 hover:border-red-400 hover:bg-slate-800/50 p-4 group transition-all"
                >
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2 mb-1 text-slate-300 group-hover:text-red-400">
                            <BarChart3 size={18} /> <span className="font-pixel text-xs">[ REPLAYS ]</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Historical Outcomes & Analysis</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 font-mono text-lg">&gt;</div>
                </button>
            </div>
        </div>
      </div>

      {/* Footer / Stats Tape */}
      <div className="w-full max-w-6xl border-t border-slate-800 pt-4 flex justify-between items-end text-slate-600 font-mono text-[10px]">
        <div className="space-y-1">
            <div className="flex items-center gap-2"><Sigma size={12}/> <span>TOTAL SIMULATIONS RUN: 14,092</span></div>
            <div className="flex items-center gap-2"><Skull size={12}/> <span>TOTAL AGENT DEATHS: 248,101</span></div>
        </div>
        <div>
            SYSTEM VERSION 1.0.4 // <span className="text-green-500 animate-pulse">ONLINE</span>
        </div>
      </div>

    </div>
  );
};

export default Home;