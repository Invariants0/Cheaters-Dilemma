import React from 'react';
import { ArrowLeft, Target, Heart, Footprints, HandCoins, Crown, Scale, AlertOctagon, HelpCircle } from 'lucide-react';

interface RulesInfoProps {
  onBack: () => void;
}

const RulesInfo: React.FC<RulesInfoProps> = ({ onBack }) => {
  return (
    <div className="h-full w-full p-8 md:p-12 flex flex-col overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        
        <button onClick={onBack} className="mb-8 text-slate-500 hover:text-white flex items-center gap-2 font-mono text-sm transition-colors">
            <ArrowLeft size={16} /> RETURN TO TERMINAL
        </button>

        <div className="border-b border-slate-700 pb-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-pixel text-green-500 mb-2">
                SYSTEM <span className="text-white">RULES</span>
            </h2>
            <p className="font-mono text-slate-500 text-lg uppercase tracking-wider">
                & The Emergent Meta-Game
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-mono text-slate-300">
            
            {/* Left Col: Core Mechanics */}
            <div className="lg:col-span-7 space-y-10">
                
                <section>
                    <h3 className="text-2xl text-white font-bold mb-6 flex items-center gap-3">
                        <Crown className="text-yellow-500" /> VICTORY CONDITIONS
                    </h3>
                    <div className="bg-slate-900 p-6 rounded border border-slate-700 space-y-4 shadow-lg">
                        <p className="leading-relaxed">
                            The simulation operates on a <span className="text-yellow-400">Score Accumulation</span> basis.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-slate-400 ml-2">
                            <li>First agent to reach <span className="text-white font-bold">100 POINTS</span> triggers Game Over.</li>
                            <li>If only one agent remains alive (Last Man Standing), they win regardless of score.</li>
                            <li>Scores are accumulated by <span className="text-blue-400">Working (+2)</span>, <span className="text-yellow-400">Stealing (+5)</span>, or <span className="text-red-400">Killing (+50% of victim's total)</span>.</li>
                        </ul>
                    </div>
                </section>

                <section>
                     <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-3">
                        <Scale className="text-blue-400" /> ACTION MATRIX
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded border-l-2 border-blue-500 hover:bg-slate-800 transition-colors">
                            <h4 className="font-bold text-blue-400 flex items-center gap-2 mb-2 text-sm">
                                <Footprints size={14} /> MOVE
                            </h4>
                            <p className="text-xs text-slate-400">
                                1 tile/tick. Navigation utilizes simple pathfinding to seek targets or flee threats.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded border-l-2 border-green-500 hover:bg-slate-800 transition-colors">
                            <h4 className="font-bold text-green-400 flex items-center gap-2 mb-2 text-sm">
                                <Target size={14} /> GATHER (WORK)
                            </h4>
                            <p className="text-xs text-slate-400">
                                The "Honest" strategy. Slow, steady, safe. Generates value for the system.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded border-l-2 border-red-500 hover:bg-slate-800 transition-colors">
                            <h4 className="font-bold text-red-400 flex items-center gap-2 mb-2 text-sm">
                                <SwordIcon /> ATTACK
                            </h4>
                            <p className="text-xs text-slate-400">
                                Violence is costly. Attack rolls utilize STR vs DEF. Damage persists until healed.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded border-l-2 border-yellow-500 hover:bg-slate-800 transition-colors">
                            <h4 className="font-bold text-yellow-400 flex items-center gap-2 mb-2 text-sm">
                                <HandCoins size={14} /> STEAL (CHEAT)
                            </h4>
                            <p className="text-xs text-slate-400">
                                The "Defect" strategy. Transfers wealth without generating it. 40% chance of failure (Getting Caught).
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-3">
                        <Heart className="text-pink-500" /> SURVIVAL
                    </h3>
                    <div className="bg-slate-900 p-6 rounded border border-slate-700">
                        <p className="mb-4 text-sm text-slate-300">
                            Agents possess a standard 50 HP. Health does not regenerate automatically; agents must choose to <span className="text-green-400">REST</span> (+10 HP) instead of moving or scoring, creating an opportunity cost.
                        </p>
                        <div className="flex items-center gap-2 text-xs bg-red-950/30 text-red-400 p-2 border border-red-900/50 rounded">
                            <AlertOctagon size={12} />
                            <span>DEATH IS PERMANENT. THERE ARE NO RESPAWNS.</span>
                        </div>
                    </div>
                </section>

            </div>

            {/* Right Col: The Meta Game (Lore) */}
            <div className="lg:col-span-5 space-y-8">
                
                <div className="bg-yellow-900/10 border border-yellow-600/30 p-8 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <HelpCircle size={100} />
                    </div>
                    
                    <h3 className="text-xl text-yellow-500 font-pixel mb-6 relative z-10">
                        THE CHEATER'S META
                    </h3>
                    
                    <div className="space-y-6 text-sm relative z-10">
                        <p>
                            <span className="font-bold text-white">"Will the AI choose fair play?"</span>
                        </p>
                        <p>
                            The mathematical answer is almost always <span className="text-red-400 font-bold">NO</span>. 
                        </p>
                        <p>
                            In a system where <span className="text-blue-400">Working</span> grants +2 points and <span className="text-yellow-400">Stealing</span> grants +5 points, the expected utility of cheating (even with a risk of punishment) often outweighs honest labor.
                        </p>
                        <p>
                            However, if every agent chooses to cheat, no value is generated, and the economy stagnates. This is the tragedy of the commons.
                        </p>
                        <div className="h-px bg-yellow-600/30 my-4"></div>
                        <p className="italic text-slate-400">
                            "Civilization is just a treaty to stop us from killing each other for points."
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                    <h4 className="text-white font-bold mb-2">REWRITING THE RULES</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        While the simulation code is fixed, the "Social Rules" are fluid. 
                        An aggressive agent effectively rewrites the rule "Do not kill" into "Kill if profitable".
                        An honest agent enforces the rule "Punish cheaters" by attacking those with low reputation.
                        <br/><br/>
                        The winner is often the one who breaks the implicit rules first, but before the others realize the game has changed.
                    </p>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

const SwordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/></svg>
);

export default RulesInfo;