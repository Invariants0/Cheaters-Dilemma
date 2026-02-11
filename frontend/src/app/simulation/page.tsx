"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { SimulationState, SimulationEvent } from "@/lib/types";
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

  const resetSimulation = () => {
    setSimulationId(null);
    setSimulationState(null);
    setEvents([]);
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
  const mockAgents = simulationState?.agents.slice(0, 5).map((agent) => ({
    id: agent.agent_id,
    name: `Agent ${agent.agent_id}`,
    type: agent.strategy || "unknown",
    resources: agent.resources || 0,
    strength: agent.strength || 0,
    trust: agent.trust || 0,
    alive: agent.alive,
  })) || [];

  return (
    <div className="w-full h-full overflow-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* Left Panel - Simulation Control */}
        <div className="lg:col-span-1 space-y-4">
          <GamePanel title="SIMULATION CONTROL" className="flex-shrink-0">
            <div className="space-y-3">
              <StatDisplay label="SIM ID" value={simulationId?.slice(0, 8) || "NONE"} />
              <StatDisplay label="TURN" value={simulationState?.current_turn || 0} />
              <StatDisplay label="ALIVE" value={simulationState?.alive_count || 0} unit="/" className="inline" />
              <div className="text-xs text-[#00d9ff]">/{simulationState?.agents.length || 0}</div>
              <GameButton onClick={stepSimulation} className="w-full mt-4" disabled={!simulationId || isRunning}>
                STEP
              </GameButton>
              <GameButton onClick={resetSimulation} className="w-full" disabled={isRunning}>
                RESET
              </GameButton>
            </div>
          </GamePanel>

          <GamePanel title="CONFIGURATION">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#00d9ff] mb-1">AGENTS</label>
                <input
                  type="number"
                  value={config.agent_count}
                  onChange={(e) => setConfig({ ...config, agent_count: parseInt(e.target.value) })}
                  className="w-full bg-[#0f1629] border border-[#00d9ff] text-[#00ffff] px-2 py-1 text-xs font-mono"
                  min="2"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-xs text-[#00d9ff] mb-1">SEED</label>
                <input
                  type="number"
                  value={config.seed}
                  onChange={(e) => setConfig({ ...config, seed: parseInt(e.target.value) })}
                  className="w-full bg-[#0f1629] border border-[#00d9ff] text-[#00ffff] px-2 py-1 text-xs font-mono"
                />
              </div>
              <GameButton onClick={startSimulation} className="w-full" disabled={isRunning}>
                START NEW
              </GameButton>
            </div>
          </GamePanel>
        </div>

        {/* Center - World Visualization */}
        <div className="lg:col-span-2">
          <GamePanel title="WORLD VISUALIZATION" className="h-full">
            {!simulationState ? (
              <div className="h-full flex items-center justify-center text-[#00d9ff] font-mono text-center">
                <div>
                  <div className="text-xl font-bold text-[#00ffff] mb-4">&gt; READY TO LAUNCH &lt;</div>
                  <div className="text-sm opacity-50">Configure parameters and start simulation</div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* World Canvas Placeholder */}
                <div className="flex-1 bg-[#0a0e27] border border-[#00d9ff] rounded mb-4 flex items-center justify-center">
                  <div className="text-center text-[#00d9ff] font-mono">
                    <div className="text-lg font-bold text-[#00ffff] mb-2">&gt; WORLD MAP &lt;</div>
                    <div className="text-xs opacity-50">[ Interactive visualization coming soon ]</div>
                  </div>
                </div>

                {/* Agent List */}
                <div className="flex-1">
                  <div className="text-xs text-[#00d9ff] mb-2 font-mono">&gt; AGENTS ({mockAgents.length})</div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {mockAgents.map((agent, idx) => (
                      <AgentCard key={agent.id} agent={agent} rank={idx + 1} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </GamePanel>
        </div>

        {/* Right Panel - Events & Stats */}
        <div className="lg:col-span-1 space-y-4">
          <GamePanel title="EVENT LOG">
            <EventLog events={events.slice(-10).map(e => ({
              turn: e.turn,
              message: `${e.action.toUpperCase()}: ${e.actor} → ${e.target || 'WORLD'}`,
              type: e.outcome.includes('success') ? 'success' : 'neutral'
            }))} />
          </GamePanel>

          <GamePanel title="METRICS">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#00d9ff]">GINI:</span>
                <span className="text-[#00ffff]">{simulationState?.metrics?.gini_resources?.toFixed(3) || '0.000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00d9ff]">HHI:</span>
                <span className="text-[#00ffff]">{simulationState?.metrics?.hhi_resources?.toFixed(3) || '0.000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00d9ff]">GOV:</span>
                <span className="text-[#00ffff]">{simulationState?.metrics?.governance_level?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </GamePanel>
        </div>
      </div>
    </div>
  );
}