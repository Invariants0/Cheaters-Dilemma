"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { AgentSummary } from "@/lib/types";
import { GameLayout, TopBar } from "@/components/GameLayout";
import { GamePanel, GameButton, StatDisplay, AgentCard } from "@/components/GameUI";

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [simulationId, setSimulationId] = useState<string>("default");

  useEffect(() => {
    const loadAgents = async () => {
      try {
        // In a real app, this would be the active simulation
        // For now, we'll load from a default simulation
        const agentsData = await apiClient.getAgents(simulationId);
        setAgents(agentsData);
      } catch (error) {
        console.error("Failed to load agents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, [simulationId]);

  const strategies = ["cheater", "greedy", "politician", "warlord"];
  const strategyDescriptions: Record<string, string> = {
    cheater: "Aggressive theft & rule manipulation",
    greedy: "Selective stealing, mostly honest",
    politician: "Control governance & alliances",
    warlord: "Kill competitors, build strength",
  };

  const filtered = selectedStrategy
    ? agents.filter((a) => a.strategy === selectedStrategy)
    : agents;

  const sortedByResources = [...filtered].sort((a, b) => b.resources - a.resources);

  return (
    <GameLayout
      topBar={<TopBar />}
      leftPanel={
        <div className="space-y-4">
          <GamePanel title="AGENT STRATEGIES">
            <div className="space-y-2 text-xs font-mono">
              {strategies.map((strat) => (
                <button
                  key={strat}
                  onClick={() => setSelectedStrategy(selectedStrategy === strat ? null : strat)}
                  className={`w-full text-left p-2 border-2 ${
                    selectedStrategy === strat
                      ? "border-[#ff00ff] bg-[#1a1f3a]"
                      : "border-[#00ffff] hover:border-[#ff00ff]"
                  } text-[#00d9ff] transition-all`}
                >
                  <div className="font-bold uppercase text-[#00ffff]">{strat}</div>
                  <div className="text-[#00d9ff] text-xs mt-1">
                    {strategyDescriptions[strat]}
                  </div>
                </button>
              ))}
            </div>
          </GamePanel>

          <GamePanel title="STATISTICS" className="flex-1">
            <div className="space-y-3 text-xs">
              <StatDisplay label="Total Agents" value={agents.length} />
              <StatDisplay label="Alive" value={agents.filter((a) => a.alive).length} />
              <StatDisplay label="Average Resources" value={(agents.reduce((s, a) => s + a.resources, 0) / agents.length).toFixed(0)} />
              <StatDisplay label="Average Strength" value={(agents.reduce((s, a) => s + a.strength, 0) / agents.length).toFixed(1)} />
            </div>
          </GamePanel>

          <Link href="/" className="block">
            <GameButton className="w-full">BACK TO MENU</GameButton>
          </Link>
        </div>
      }
      centerContent={
        <div className="w-full h-full overflow-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-[#00ffff] font-mono">LOADING AGENTS...</div>
            </div>
          ) : (
            <div className="space-y-4">
              <GamePanel title={selectedStrategy ? selectedStrategy.toUpperCase() : "ALL AGENTS"} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedByResources.map((agent, idx) => (
                    <Link key={agent.agent_id} href={`/agents/${agent.agent_id}`}>
                      <AgentCard agent={agent} rank={idx + 1} />
                    </Link>
                  ))}
                </div>
              </GamePanel>
            </div>
          )}
        </div>
      }
    />
  );
}