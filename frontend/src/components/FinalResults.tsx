"use client";

import { SimulationSummary } from "@/lib/types";
import { GamePanel } from "@/components/GameUI";

interface FinalResultsProps {
  simulationSummary: SimulationSummary;
  showActionSummary?: boolean;
  compact?: boolean;
}

export function FinalResults({ simulationSummary, showActionSummary = true, compact = false }: FinalResultsProps) {
  const winner = simulationSummary.leaderboard[0];

  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className={`font-bold text-[#00ffff] mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>WINNER</div>
        <div className={`font-mono text-[#ff00ff] ${compact ? 'text-lg' : 'text-2xl'}`}>
          {winner?.strategy.toUpperCase()} #{winner?.agent_id}
        </div>
        <div className={`text-[#00d9ff] mt-1 ${compact ? 'text-sm' : 'text-base'}`}>
          {winner?.resources} resources
        </div>
      </div>

      <div className="border-t border-[#00ffff]/20 pt-3">
        <div className={`text-[#00d9ff] mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>LEADERBOARD</div>
        {simulationSummary.leaderboard.slice(0, compact ? 5 : 10).map((agent, index) => (
          <div key={agent.agent_id} className={`flex justify-between font-mono mb-1 ${compact ? 'text-xs' : 'text-sm'}`}>
            <span className={index === 0 ? "text-[#ff00ff]" : "text-[#00ffff]"}>
              #{index + 1} {agent.strategy} #{agent.agent_id}
            </span>
            <span className="text-[#00d9ff]">{agent.resources}</span>
          </div>
        ))}
      </div>

      {showActionSummary && (
        <div className="border-t border-[#00ffff]/20 pt-3">
          <div className={`text-[#00d9ff] mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>ACTION SUMMARY</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(simulationSummary.action_counts).map(([action, count]) => (
              <div
                key={action}
                className="flex justify-between items-center bg-[#0a0e27] border border-[#00d9ff] p-2"
              >
                <span className="text-[#00d9ff] text-sm uppercase">{action.replace('_', ' ')}</span>
                <span className="text-[#00ffff] font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}