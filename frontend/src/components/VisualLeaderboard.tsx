"use client";

import React from "react";
import { GameAgent } from "@/lib/gameTypes";
import { Crown, Skull } from "lucide-react";

interface LeaderboardProps {
  agents: GameAgent[];
}

const VisualLeaderboard: React.FC<LeaderboardProps> = ({ agents }) => {
  const sortedAgents = [...agents].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 h-full overflow-hidden flex flex-col">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest border-b border-slate-700 pb-2 flex justify-between">
        <span>Leaderboard</span>
        <span>Target: 100</span>
      </h3>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="pb-2">#</th>
              <th className="pb-2">Agent</th>
              <th className="pb-2 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedAgents.map((agent, index) => (
              <tr
                key={agent.id}
                className={`border-b border-slate-800/50 ${!agent.isAlive ? "opacity-40" : ""}`}
              >
                <td className="py-2 font-mono text-slate-500 w-6">
                  {index === 0 && agent.score > 0 ? (
                    <Crown size={12} className="text-yellow-500 inline" />
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="py-2 font-medium truncate max-w-[100px]">
                  {agent.name}
                  {!agent.isAlive && (
                    <Skull size={10} className="inline ml-1 text-red-500" />
                  )}
                </td>
                <td className="py-2 text-right font-mono">
                  <div className="relative">
                    <div className="absolute top-1 right-0 h-1 bg-slate-700 w-full rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min(100, agent.score)}%` }}
                      />
                    </div>
                    <span className="relative z-10 text-[10px]">
                      {Math.floor(agent.score)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisualLeaderboard;
