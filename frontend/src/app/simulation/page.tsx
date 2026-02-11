"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";
import { SimulationState, SimulationEvent } from "@/lib/types";

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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Simulation Control</h1>

      {!simulationId ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Start New Simulation</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Agents
              </label>
              <input
                type="number"
                min="5"
                max="20"
                value={config.agent_count}
                onChange={(e) => setConfig(prev => ({ ...prev, agent_count: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Random Seed
              </label>
              <input
                type="number"
                value={config.seed}
                onChange={(e) => setConfig(prev => ({ ...prev, seed: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Turns (optional)
              </label>
              <input
                type="number"
                placeholder="500"
                value={config.turns || ""}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  turns: e.target.value ? parseInt(e.target.value) : undefined
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? "Starting..." : "Start Simulation"}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Simulation Controls */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Simulation #{simulationId}</h2>
              <button
                onClick={stepSimulation}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Step Forward
              </button>
            </div>

            {simulationState && (
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-2xl font-bold text-gray-900">{simulationState.current_turn}</div>
                  <div className="text-sm text-gray-600">Current Turn</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-2xl font-bold text-gray-900">{simulationState.agents.length}</div>
                  <div className="text-sm text-gray-600">Total Agents</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-2xl font-bold text-gray-900">{simulationState.alive_count}</div>
                  <div className="text-sm text-gray-600">Alive Agents</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-2xl font-bold text-gray-900">{simulationState.event_count}</div>
                  <div className="text-sm text-gray-600">Total Events</div>
                </div>
              </div>
            )}
          </div>

          {/* Agent Status */}
          {simulationState && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Agent Status</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Strategy</th>
                      <th className="px-4 py-2 text-left">Resources</th>
                      <th className="px-4 py-2 text-left">Strength</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Trust</th>
                      <th className="px-4 py-2 text-left">Aggression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationState.agents.map((agent) => (
                      <tr key={agent.agent_id} className="border-t">
                        <td className="px-4 py-2">{agent.agent_id}</td>
                        <td className="px-4 py-2">{agent.strategy}</td>
                        <td className="px-4 py-2">{agent.resources}</td>
                        <td className="px-4 py-2">{agent.strength}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            agent.alive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {agent.alive ? 'Alive' : 'Dead'}
                          </span>
                        </td>
                        <td className="px-4 py-2">{agent.trust.toFixed(2)}</td>
                        <td className="px-4 py-2">{agent.aggression.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Event Log */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Event Log</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {events.slice(-20).map((event, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Turn {event.turn}</span>
                    <span className="text-sm text-gray-600">Agent {event.actor}</span>
                  </div>
                  <div className="mt-1">
                    <span className="font-medium text-blue-600">{event.action}</span>
                    {event.target && <span className="ml-2 text-gray-600">→ Agent {event.target}</span>}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{event.outcome}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}