"use client";

import { GamePanel } from "@/components/GameUI";
import { AgentSummary } from "@/lib/types";

interface WorldVisualizationProps {
  agents: AgentSummary[];
  turn: number;
  loading?: boolean;
}

export function WorldVisualization({ agents, turn, loading = false }: WorldVisualizationProps) {
  const aliveCount = agents.filter((a) => a.alive).length;
  const maxResources = Math.max(...agents.map((a) => a.resources), 1);

  if (loading) {
    return (
      <GamePanel title={`WORLD VIEW [TURN ${turn}]`} className="h-96">
        <div className="w-full h-full flex items-center justify-center text-[#00d9ff]">
          RENDERING WORLD...
        </div>
      </GamePanel>
    );
  }

  return (
    <GamePanel title={`WORLD VIEW [TURN ${turn}]`} className="h-96">
      <div className="relative w-full h-full bg-[#050810] border border-[#00ffff]/30 overflow-hidden">
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-10" style={{ backgroundSize: "20px 20px" }}>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00ffff" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Agents visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-5 gap-2 p-4">
            {agents.length > 0 ? (
              agents.map((agent) => {
                const resourceRatio = agent.resources / maxResources;
                const size = Math.max(20, resourceRatio * 40);
                const color = agent.alive ? "#00ffff" : "#ff0055";

                return (
                  <div
                    key={agent.agent_id}
                    className="flex flex-col items-center"
                    title={`Agent ${agent.agent_id} (${agent.strategy}): \$${agent.resources}`}
                  >
                    <div
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: color,
                        opacity: agent.alive ? 0.8 : 0.3,
                        border: `2px solid ${color}`,
                      }}
                      className="rounded-full flex items-center justify-center text-xs font-bold text-[#0a0e27]"
                    >
                      {agent.agent_id}
                    </div>
                    <div className="text-xs text-[#00d9ff] mt-1">${agent.resources}</div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-5 text-center text-[#00d9ff]">NO AGENTS</div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 text-xs text-[#00d9ff] font-mono space-y-1 bg-[#0a0e27]/80 p-2 border border-[#00ffff]">
          <div>🟦 Alive: {aliveCount}</div>
          <div>🟥 Dead: {agents.length - aliveCount}</div>
        </div>
      </div>
    </GamePanel>
  );
}
