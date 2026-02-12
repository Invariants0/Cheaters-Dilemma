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
            <div key={agent.agent_id} className="flex justify-between items-center text-xs font-mono p-2 border-l-2 border-[#ff00ff]">
              <div className="flex-1">
                <div className="text-[#ff00ff] font-bold">#{idx + 1}</div>
                <div className="text-[#00ffff]">Agent {agent.agent_id}</div>
                <div className="text-[#00d9ff] text-xs">{agent.strategy}</div>
              </div>
              <div className="text-right">
                <div className="text-[#00ffff] font-bold">${agent.resources}</div>
                <div className="text-[#00d9ff]">STR {agent.strength}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[#00d9ff] text-center py-4">NO AGENTS ALIVE</div>
        )}
      </div>
    </GamePanel>
  );
}
