import Link from "next/link";
import { GamePanel, GameButton } from "@/components/GameUI";

export default function Home() {
  return (
    <div className="w-full h-full overflow-auto p-4">
      {/* Animated Header */}
      <div className="border-b-2 border-slate-700 bg-slate-900 p-6 text-center mb-6 rounded-lg shadow-xl">
        <h1 className="retro-title mb-2 text-4xl">
          THE CHEATER&apos;S DILEMMA
        </h1>
        <p className="retro-subtitle text-base">
          &gt; A MULTI-AGENT GAME-THEORETIC SIMULATION &lt;
        </p>
        <p className="text-slate-400 text-sm mt-4 font-mono">
          WHERE WINNING CORRUPTS THE RULES
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* About Panel */}
        <GamePanel title="ABOUT" className="col-span-1 md:col-span-2">
          <p className="text-slate-300 font-mono text-sm leading-relaxed">
            Explore emergent behaviors when rational agents compete in a world
            where cheating is often the fastest strategy, but rules themselves
            can be rewritten as strategic assets. Violence is possible but
            costly, and <span className="text-yellow-400 font-bold">power</span>{" "}
            emerges through alliances,{" "}
            <span className="text-red-400 font-bold">strength</span>, and
            governance capture.
          </p>
        </GamePanel>

        {/* Start Simulation */}
        <GamePanel title="START SIMULATION">
          <div className="space-y-4">
            <p className="text-slate-400 text-sm mb-4">
              Launch a new multi-agent simulation with customizable parameters.
            </p>
            <Link href="/simulation" className="block">
              <GameButton className="w-full">LAUNCH WORLD</GameButton>
            </Link>
          </div>
        </GamePanel>

        {/* View Replays */}
        <GamePanel title="VIEW REPLAYS">
          <div className="space-y-4">
            <p className="text-slate-400 text-sm mb-4">
              Browse completed simulations and analyze outcomes.
            </p>
            <Link href="/replays" className="block">
              <GameButton className="w-full">REPLAY LOG</GameButton>
            </Link>
          </div>
        </GamePanel>

        {/* Game Info */}
        <GamePanel title="GAME INFO">
          <div className="space-y-3 text-xs font-mono text-[#00d9ff]">
            <div>
              <span className="text-[#ff00ff]">&gt;</span> AGENTS: Dynamic
              behavioral strategies
            </div>
            <div>
              <span className="text-[#ff00ff]">&gt;</span> ACTIONS: Work, Steal,
              Attack, Propose, Vote
            </div>
            <div>
              <span className="text-[#ff00ff]">&gt;</span> METRICS: Gini
              Coefficient, HHI, Governance
            </div>
          </div>
        </GamePanel>

        {/* Rules Info */}
        <GamePanel title="RULES">
          <div className="space-y-3 text-xs font-mono text-[#00d9ff]">
            <div>
              <span className="text-[#00ffff]">[ 1 ]</span> Agents can propose
              rule changes
            </div>
            <div>
              <span className="text-[#00ffff]">[ 2 ]</span> Voting determines if
              rules take effect
            </div>
            <div>
              <span className="text-[#00ffff]">[ 3 ]</span> Winners shape the
              world forever
            </div>
          </div>
        </GamePanel>

        {/* Visual Simulation */}
        <GamePanel
          title="VISUAL BATTLE ROYALE"
          className="col-span-1 md:col-span-2"
          neon
        >
          <div className="space-y-4">
            <p className="text-[#00ffff] text-sm mb-4">
              Watch agents compete in a{" "}
              <span className="text-[#ff00ff] font-bold">
                dynamic grid-based arena
              </span>{" "}
              with real-time combat, stealing, and survival mechanics.
              Experience{" "}
              <span className="text-[#00ffff]">pixel art avatars</span>, health
              bars, and action bubbles showing every move.
            </p>
            <Link href="/visual" className="block">
              <GameButton className="w-full">LAUNCH VISUAL SIM</GameButton>
            </Link>
          </div>
        </GamePanel>

        {/* Explore More */}
        <GamePanel title="EXPLORE" className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/agents" className="block">
              <GameButton className="w-full">AGENTS</GameButton>
            </Link>
            <Link href="/rules" className="block">
              <GameButton className="w-full">RULES</GameButton>
            </Link>
          </div>
        </GamePanel>
      </div>
    </div>
  );
}
