"use client";

import { AgentSummary } from "@/lib/types";
import { GamePanel, StatDisplay, AgentCard } from "@/components/GameUI";

interface ScoreboardProps {
  agents: AgentSummary[];
  maxRows?: number;
}

export function Scoreboard({ agents, maxRows = 5 }: ScoreboardProps) {
  const sorted = [...agents]
    .filter((a) => a.alive)
    .sort((a, b) => b.resources - a.resources)
    .slice(0, maxRows);

  return (
    <GamePanel title="LEADERBOARD">
      <div className="space-y-2">
        {sorted.length > 0 ? (
          sorted.map((agent, idx) => (
            <div key={agent.agent_id} className="flex justify-between items-center text-xs font-mono p-2 border-l-2 border-[#475569]">
              <div className="flex-1">
                <div className="text-[#475569] font-bold">#{idx + 1}</div>
                <div className="text-[#eab308]">Agent {agent.agent_id}</div>
                <div className="text-[#94a3b8] text-xs">{agent.strategy}</div>
              </div>
              <div className="text-right">
                <div className="text-[#eab308] font-bold">${agent.resources}</div>
                <div className="text-[#94a3b8]">STR {agent.strength}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[#94a3b8] text-center py-4">NO AGENTS ALIVE</div>
        )}
      </div>
    </GamePanel>
  );
}

