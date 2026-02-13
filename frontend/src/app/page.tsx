import Link from "next/link";
import { GamePanel, GameButton } from "@/components/GameUI";
import { LandingSocketStatus } from "@/components/LandingSocketStatus";

export default function Home() {
  return (
    <div className="w-full h-full overflow-auto p-4">
      <div className="mx-auto max-w-6xl space-y-6 pb-10">
        <section className="relative overflow-hidden border-2 border-[#00ffff] bg-[#0f1629] p-6 scanlines">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(0,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,0,255,0.14), transparent 50%)",
            }}
          />
          <div className="relative">
            <div className="mb-3 inline-block border border-[#ff00ff] bg-[#ff00ff]/10 px-3 py-1 text-[11px] text-[#ff00ff]">
              MULTI-AGENT GOVERNANCE LAB
            </div>
            <h1 className="retro-title text-4xl md:text-5xl">
              THE CHEATER&apos;S DILEMMA
            </h1>
            <p className="retro-subtitle mt-2 text-base">
              &gt; WINNING CAN REWRITE THE RULEBOOK &lt;
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#00d9ff] font-mono">
              Simulate strategic agents in a hostile economy where cooperation, theft, violence,
              and rule-voting collide. Explore how power centralizes and how governance shifts under pressure.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
              <Link href="/simulation" className="block">
                <GameButton className="w-full">LAUNCH WORLD</GameButton>
              </Link>
              <Link href="/replays" className="block">
                <GameButton className="w-full">OPEN REPLAYS</GameButton>
              </Link>
              <Link href="/agents" className="block">
                <GameButton className="w-full">AGENT INDEX</GameButton>
              </Link>
              <Link href="/rules" className="block">
                <GameButton className="w-full">RULE MATRIX</GameButton>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <GamePanel title="SYSTEM MODEL">
            <div className="space-y-2 text-xs font-mono text-[#00d9ff]">
              <div><span className="text-[#ff00ff]">&gt;</span> Agents pursue asymmetric strategies.</div>
              <div><span className="text-[#ff00ff]">&gt;</span> Action set: work, steal, attack, propose, vote.</div>
              <div><span className="text-[#ff00ff]">&gt;</span> Outcomes feed trust, aggression, and rankings.</div>
            </div>
          </GamePanel>
          <GamePanel title="COMPETITION PRESSURE">
            <div className="space-y-2 text-xs font-mono text-[#00d9ff]">
              <div><span className="text-[#00ffff]">[1]</span> Resources compound advantages.</div>
              <div><span className="text-[#00ffff]">[2]</span> Strong actors can suppress rivals.</div>
              <div><span className="text-[#00ffff]">[3]</span> Collusion can overpower fair play.</div>
            </div>
          </GamePanel>
          <GamePanel title="GOVERNANCE LOOP">
            <div className="space-y-2 text-xs font-mono text-[#00d9ff]">
              <div><span className="text-[#ffff00]">T1</span> Proposals introduced by agents.</div>
              <div><span className="text-[#ffff00]">T2</span> Voting applies majority outcomes.</div>
              <div><span className="text-[#ffff00]">T3</span> New rules reshape incentives.</div>
            </div>
          </GamePanel>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GamePanel title="EXPERIMENT TRACKS" neon>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="border border-[#00d9ff] bg-[#0a0e27] p-3">
                  <div className="text-[#ff00ff] text-xs font-mono mb-1">RESOURCE INEQUALITY</div>
                  <p className="text-xs text-[#00d9ff] font-mono">
                    Compare Gini and HHI shifts as aggressive strategies dominate passive workers.
                  </p>
                </div>
                <div className="border border-[#00d9ff] bg-[#0a0e27] p-3">
                  <div className="text-[#ff00ff] text-xs font-mono mb-1">RULE CAPTURE</div>
                  <p className="text-xs text-[#00d9ff] font-mono">
                    Track who controls proposals and how often voting drifts toward concentrated power.
                  </p>
                </div>
                <div className="border border-[#00d9ff] bg-[#0a0e27] p-3">
                  <div className="text-[#ff00ff] text-xs font-mono mb-1">SURVIVAL DYNAMICS</div>
                  <p className="text-xs text-[#00d9ff] font-mono">
                    Measure elimination patterns and late-stage stability under repeated conflict.
                  </p>
                </div>
                <div className="border border-[#00d9ff] bg-[#0a0e27] p-3">
                  <div className="text-[#ff00ff] text-xs font-mono mb-1">TRUST COLLAPSE</div>
                  <p className="text-xs text-[#00d9ff] font-mono">
                    Observe how short-term betrayal impacts long-term coalition opportunities.
                  </p>
                </div>
              </div>
            </GamePanel>
          </div>

          <GamePanel title="BACKEND SOCKET LINK">
            <LandingSocketStatus />
          </GamePanel>
        </section>
      </div>
    </div>
  );
}
