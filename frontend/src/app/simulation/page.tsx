"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { SimulationState, SimulationEvent } from "@/lib/types";
import { GameLayout, TopBar } from "@/components/GameLayout";
import { GamePanel, GameButton, StatDisplay, AgentCard, EventLog } from "@/components/GameUI";

export default function SimulationPage() {
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState({
    agent_count: 10,
    seed: 42,
    turns: undefined as number | undefined,
  });

  const startSimulation = async () => {
    try {
      setIsRunning(true);
      const response = await apiClient.startSimulation(config);
      setSimulationId(response.simulation_id);

      // Get initial state
      const state = await apiClient.getSimulationState(response.simulation_id);
      setSimulationState(state);

      // Get initial events
      const eventsData = await apiClient.getSimulationEvents(response.simulation_id);
      setEvents(eventsData.events);
    } catch (error) {
      console.error("Failed to start simulation:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const stepSimulation = async () => {
    if (!simulationId) return;

    try {
      const state = await apiClient.stepSimulation(simulationId, 1);
      setSimulationState(state);

      // Get new events
      const eventsData = await apiClient.getSimulationEvents(simulationId);
      setEvents(eventsData.events);
    } catch (error) {
      console.error("Failed to step simulation:", error);
    }
  };

  if (!simulationId) {
    return (
      <div className="w-full h-screen bg-[#0a0e27] p-8 flex items-center justify-center">
        <GamePanel title="LAUNCH SIMULATION" className="max-w-md w-full">
          <div className="space-y-4">
            <div>
              <label className="stat-label block mb-2">AGENT COUNT</label>
              <input
                type="number"
                min="5"
                max="20"
                value={config.agent_count}
                onChange={(e) => setConfig(prev => ({ ...prev, agent_count: parseInt(e.target.value) }))}
                className="w-full bg-[#0a0e27] border-2 border-[#00ffff] text-[#00ffff] px-3 py-2 font-mono focus:outline-none focus:border-[#ff00ff]"
              />
            </div>
            <div>
              <label className="stat-label block mb-2">RANDOM SEED</label>
              <input
                type="number"
                value={config.seed}
                onChange={(e) => setConfig(prev => ({ ...prev, seed: parseInt(e.target.value) }))}
                className="w-full bg-[#0a0e27] border-2 border-[#00ffff] text-[#00ffff] px-3 py-2 font-mono focus:outline-none focus:border-[#ff00ff]"
              />
            </div>
            <div>
              <label className="stat-label block mb-2">MAX TURNS (OPTIONAL)</label>
              <input
                type="number"
                placeholder="500"
                value={config.turns || ""}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  turns: e.target.value ? parseInt(e.target.value) : undefined
                }))}
                className="w-full bg-[#0a0e27] border-2 border-[#00ffff] text-[#00ffff] px-3 py-2 font-mono focus:outline-none focus:border-[#ff00ff]"
              />
            </div>
            <div className="flex gap-2">
              <GameButton onClick={startSimulation} disabled={isRunning} className="flex-1">
                {isRunning ? "LOADING..." : "LAUNCH"}
              </GameButton>
              <Link href="/" className="flex-1">
                <GameButton className="w-full">BACK</GameButton>
              </Link>
            </div>
          </div>
        </GamePanel>
      </div>
    );
  }

  // Simulation Running View
  const mockAgents = simulationState?.agents.slice(0, 5).map((agent, idx) => ({
    id: agent.agent_id,
    name: `Agent ${agent.agent_id}`,
    type: agent.strategy || "unknown",
    resources: agent.resources || 0,
    strength: agent.strength || 0,
    trust: agent.trust || 0,
    alive: agent.alive,
  })) || [];

  return (
    <GameLayout
      topBar={<TopBar />}
      leftPanel={
        <>
          <GamePanel title="SIMULATION CONTROL" className="flex-shrink-0">
            <div className="space-y-3">
              <StatDisplay label="SIM ID" value={simulationId.slice(0, 8)} />
              <StatDisplay label="TURN" value={simulationState?.current_turn || 0} />
              <StatDisplay label="ALIVE" value={simulationState?.alive_count || 0} unit="/" className="inline" />
              <div className="text-xs text-[#00d9ff]">/{simulationState?.agents.length || 0}</div>
              <GameButton onClick={stepSimulation} className="w-full mt-4">
                STEP FORWARD
              </GameButton>
            </div>
          </GamePanel>

          <GamePanel title="LEADERBOARD">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockAgents.map((agent, idx) => (
                <AgentCard key={agent.id} agent={agent} rank={idx + 1} />
              ))}
            </div>
          </GamePanel>
        </>
      }
      rightPanel={
        <>
          <GamePanel title="METRICS">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#ff00ff]">GINI:</span>
                <span className="float-right text-[#00ffff] font-bold">
                  {simulationState?.metrics?.gini_resources?.toFixed(3) || "?.???"}
                </span>
              </div>
              <div>
                <span className="text-[#ff00ff]">HHI:</span>
                <span className="float-right text-[#00ffff] font-bold">
                  {simulationState?.metrics?.hhi_resources?.toFixed(0) || "?.?"}
                </span>
              </div>
              <div>
                <span className="text-[#ff00ff]">EVENTS:</span>
                <span className="float-right text-[#00ffff] font-bold">
                  {simulationState?.event_count || 0}
                </span>
              </div>
            </div>
          </GamePanel>

          <GamePanel title="EVENT LOG" className="flex-1 overflow-hidden flex flex-col">
            <EventLog events={events.slice(-15).map(e => ({
              turn: e.turn,
              message: `${e.action} ${e.target ? `→ ${e.target}` : ""}`
            }))} maxHeight="h-auto" />
          </GamePanel>

          <Link href="/" className="block">
            <GameButton className="w-full">BACK TO MENU</GameButton>
          </Link>
        </>
      }
      centerContent={
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#00ffff] mb-4 glitch" data-text="WORLD VIEW">
              WORLD VIEW
            </div>
            <div className="text-[#00d9ff] font-mono text-sm mb-6">
              &gt; BEAUTIFUL GAME WORLD VISUALIZATION AREA &lt;
            </div>
            <div className="space-y-2 text-xs text-[#00d9ff]">
              <div>&gt; Central game world will render here</div>
              <div>&gt; Agents interact, strategies evolve</div>
              <div>&gt; Governance emerges dynamically</div>
            </div>
          </div>
        </div>
      }
    />
  );
}