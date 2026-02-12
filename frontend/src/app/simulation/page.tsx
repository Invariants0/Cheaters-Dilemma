"use client";

import { useCallback, useEffect, useReducer } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { SimulationState, SimulationEvent } from "@/lib/types";
import { InteractiveWorld } from "@/components/InteractiveWorld";
import { AllianceGraph } from "@/components/AllianceGraph";
import { SimulationControls } from "@/components/SimulationControls";
import { LiveEventLog } from "@/components/LiveEventLog";
import { GamePanel, GameButton } from "@/components/GameUI";

interface SimulationConfig {
  agent_count: number;
  seed: number;
  turns: number | undefined;
}

interface SimulationPageState {
  simulationId: string | null;
  simulationState: SimulationState | null;
  allEvents: SimulationEvent[];
  events: SimulationEvent[];
  displayTurn: number;
  isRunning: boolean;
  isAutoPlaying: boolean;
  isStepping: boolean;
  config: SimulationConfig;
}

type SimulationPageAction =
  | { type: "SET_CONFIG"; patch: Partial<SimulationConfig> }
  | { type: "START_REQUEST" }
  | { type: "START_SUCCESS"; simulationId: string; simulationState: SimulationState; allEvents: SimulationEvent[] }
  | { type: "START_FAILURE" }
  | { type: "STEP_REQUEST" }
  | { type: "STEP_COMPLETE"; nextTurn: number; turnEvents: SimulationEvent[]; reachedEnd: boolean }
  | { type: "STEP_FAILURE" }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "RESET" };

const DEFAULT_CONFIG: SimulationConfig = {
  agent_count: 10,
  seed: 42,
  turns: undefined,
};

const initialState: SimulationPageState = {
  simulationId: null,
  simulationState: null,
  allEvents: [],
  events: [],
  displayTurn: 0,
  isRunning: false,
  isAutoPlaying: false,
  isStepping: false,
  config: DEFAULT_CONFIG,
};

function simulationReducer(state: SimulationPageState, action: SimulationPageAction): SimulationPageState {
  switch (action.type) {
    case "SET_CONFIG":
      return {
        ...state,
        config: {
          ...state.config,
          ...action.patch,
        },
      };
    case "START_REQUEST":
      return {
        ...state,
        isRunning: true,
        isAutoPlaying: false,
        isStepping: false,
      };
    case "START_SUCCESS":
      return {
        ...state,
        simulationId: action.simulationId,
        simulationState: action.simulationState,
        allEvents: action.allEvents,
        events: [],
        displayTurn: 0,
        isRunning: false,
        isAutoPlaying: false,
        isStepping: false,
      };
    case "START_FAILURE":
      return {
        ...state,
        isRunning: false,
      };
    case "STEP_REQUEST":
      return {
        ...state,
        isStepping: true,
      };
    case "STEP_COMPLETE":
      return {
        ...state,
        displayTurn: action.nextTurn,
        events: action.turnEvents.length > 0 ? [...state.events, ...action.turnEvents] : state.events,
        isStepping: false,
        isAutoPlaying: action.reachedEnd ? false : state.isAutoPlaying,
      };
    case "STEP_FAILURE":
      return {
        ...state,
        isStepping: false,
      };
    case "PLAY":
      return {
        ...state,
        isAutoPlaying: true,
      };
    case "PAUSE":
      return {
        ...state,
        isAutoPlaying: false,
      };
    case "RESET":
      return {
        ...initialState,
        config: state.config,
      };
    default:
      return state;
  }
}

function parseIntOrFallback(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export default function SimulationPage() {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  const startSimulation = async () => {
    try {
      dispatch({ type: "START_REQUEST" });
      const response = await apiClient.startSimulation(state.config);
      const simulationState = await apiClient.getSimulationState(response.simulation_id);
      const eventsData = await apiClient.getSimulationEvents(response.simulation_id);
      const sortedEvents = [...eventsData.events].sort((a, b) => a.turn - b.turn);

      dispatch({
        type: "START_SUCCESS",
        simulationId: response.simulation_id,
        simulationState,
        allEvents: sortedEvents,
      });
    } catch (error) {
      console.error("Failed to start simulation:", error);
      dispatch({ type: "START_FAILURE" });
    }
  };

  const stepSimulation = useCallback(async () => {
    if (!state.simulationId || state.isStepping) return;

    try {
      dispatch({ type: "STEP_REQUEST" });

      const maxTurn = state.simulationState?.current_turn ?? 0;
      if (state.displayTurn >= maxTurn) {
        dispatch({
          type: "STEP_COMPLETE",
          nextTurn: state.displayTurn,
          turnEvents: [],
          reachedEnd: true,
        });
        return;
      }

      const nextTurn = state.displayTurn + 1;
      const nextTurnEvents = state.allEvents.filter((event) => event.turn === nextTurn);

      dispatch({
        type: "STEP_COMPLETE",
        nextTurn,
        turnEvents: nextTurnEvents,
        reachedEnd: nextTurn >= maxTurn,
      });
    } catch (error) {
      console.error("Failed to step simulation:", error);
      dispatch({ type: "STEP_FAILURE" });
    }
  }, [state.simulationId, state.isStepping, state.simulationState, state.displayTurn, state.allEvents]);

  const resetSimulation = () => {
    dispatch({ type: "RESET" });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isAutoPlaying && state.simulationId && !state.isRunning && !state.isStepping) {
      interval = setInterval(() => {
        stepSimulation();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isAutoPlaying, state.simulationId, state.isRunning, state.isStepping, stepSimulation]);

  const playSimulation = () => {
    dispatch({ type: "PLAY" });
  };

  const pauseSimulation = () => {
    dispatch({ type: "PAUSE" });
  };

  if (!state.simulationId) {
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
                value={state.config.agent_count}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONFIG",
                    patch: { agent_count: parseIntOrFallback(e.target.value, state.config.agent_count) },
                  })
                }
                className="w-full bg-[#0a0e27] border-2 border-[#00ffff] text-[#00ffff] px-3 py-2 font-mono focus:outline-none focus:border-[#ff00ff]"
              />
            </div>
            <div>
              <label className="stat-label block mb-2">RANDOM SEED</label>
              <input
                type="number"
                value={state.config.seed}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONFIG",
                    patch: { seed: parseIntOrFallback(e.target.value, state.config.seed) },
                  })
                }
                className="w-full bg-[#0a0e27] border-2 border-[#00ffff] text-[#00ffff] px-3 py-2 font-mono focus:outline-none focus:border-[#ff00ff]"
              />
            </div>
            <div>
              <label className="stat-label block mb-2">MAX TURNS (OPTIONAL)</label>
              <input
                type="number"
                placeholder="500"
                value={state.config.turns || ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONFIG",
                    patch: {
                      turns: e.target.value ? parseIntOrFallback(e.target.value, state.config.turns ?? 500) : undefined,
                    },
                  })
                }
                className="w-full bg-[#0a0e27] border-2 border-[#00ffff] text-[#00ffff] px-3 py-2 font-mono focus:outline-none focus:border-[#ff00ff]"
              />
            </div>
            <div className="flex gap-2">
              <GameButton onClick={startSimulation} disabled={state.isRunning} className="flex-1">
                {state.isRunning ? "LOADING..." : "LAUNCH"}
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

  return (
    <div className="w-full h-full overflow-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        <div className="lg:col-span-1 space-y-4">
          <SimulationControls
            isRunning={state.isRunning || state.isAutoPlaying || state.isStepping}
            currentTurn={state.displayTurn}
            maxTurns={state.config.turns}
            onStep={stepSimulation}
            onPlay={playSimulation}
            onPause={pauseSimulation}
            onReset={resetSimulation}
            seedValue={state.config.seed}
            agentCount={state.config.agent_count}
          />

          <GamePanel title="CONFIGURATION">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#00d9ff] mb-1">AGENTS</label>
                <input
                  type="number"
                  value={state.config.agent_count}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CONFIG",
                      patch: { agent_count: parseIntOrFallback(e.target.value, state.config.agent_count) },
                    })
                  }
                  className="w-full bg-[#0f1629] border border-[#00d9ff] text-[#00ffff] px-2 py-1 text-xs font-mono"
                  min="2"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-xs text-[#00d9ff] mb-1">SEED</label>
                <input
                  type="number"
                  value={state.config.seed}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CONFIG",
                      patch: { seed: parseIntOrFallback(e.target.value, state.config.seed) },
                    })
                  }
                  className="w-full bg-[#0f1629] border border-[#00d9ff] text-[#00ffff] px-2 py-1 text-xs font-mono"
                />
              </div>
              <GameButton onClick={startSimulation} className="w-full" disabled={state.isRunning || state.isStepping}>
                START NEW
              </GameButton>
            </div>
          </GamePanel>
        </div>

        <div className="lg:col-span-2">
          <GamePanel title="WORLD VISUALIZATION" className="h-full">
            {!state.simulationState ? (
              <div className="h-full flex items-center justify-center text-[#00d9ff] font-mono text-center">
                <div>
                  <div className="text-xl font-bold text-[#00ffff] mb-4">&gt; READY TO LAUNCH &lt;</div>
                  <div className="text-sm opacity-50">Configure parameters and start simulation</div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 mb-4 min-h-0">
                  <InteractiveWorld
                    agents={state.simulationState.agents}
                    turn={state.displayTurn}
                    seed={state.config.seed}
                    events={state.events}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <GamePanel title="RESOURCE DISTRIBUTION">
                    <div className="space-y-2 text-xs font-mono">
                      {state.simulationState.agents.slice(0, 5).map((agent) => (
                        <div key={agent.agent_id} className="flex justify-between">
                          <span className="text-[#00d9ff]">Agent {agent.agent_id}:</span>
                          <span className="text-[#00ffff]">${agent.resources}</span>
                        </div>
                      ))}
                      {state.simulationState.agents.length > 5 && (
                        <div className="text-[#00d9ff] opacity-50">... +{state.simulationState.agents.length - 5} more</div>
                      )}
                    </div>
                  </GamePanel>
                  <GamePanel title="TRUST DISTRIBUTION">
                    <div className="space-y-2 text-xs font-mono">
                      {state.simulationState.agents.slice(0, 5).map((agent) => (
                        <div key={agent.agent_id} className="flex justify-between">
                          <span className="text-[#00d9ff]">Agent {agent.agent_id}:</span>
                          <span className="text-[#00ffff]">{agent.trust?.toFixed(2)}</span>
                        </div>
                      ))}
                      {state.simulationState.agents.length > 5 && (
                        <div className="text-[#00d9ff] opacity-50">... +{state.simulationState.agents.length - 5} more</div>
                      )}
                    </div>
                  </GamePanel>
                  <GamePanel title="METRICS">
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#00d9ff]">GINI:</span>
                        <span className="text-[#00ffff]">{state.simulationState.metrics?.gini_resources?.toFixed(3) || "0.000"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#00d9ff]">HHI:</span>
                        <span className="text-[#00ffff]">{state.simulationState.metrics?.hhi_resources?.toFixed(3) || "0.000"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#00d9ff]">AVG STR:</span>
                        <span className="text-[#00ffff]">{state.simulationState.metrics?.avg_strength?.toFixed(2) || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#00d9ff]">AVG RES:</span>
                        <span className="text-[#00ffff]">{state.simulationState.metrics?.avg_resources?.toFixed(2) || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#00d9ff]">GOV:</span>
                        <span className="text-[#00ffff]">{state.simulationState.metrics?.governance_level?.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>
                  </GamePanel>
                </div>
              </div>
            )}
          </GamePanel>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <AllianceGraph alliances={[]} loading={state.isRunning || state.isStepping} />

          <GamePanel title="EVENT LOG">
            <LiveEventLog
              events={state.events.map((event) => ({
                turn: event.turn,
                action: event.action,
                actor: event.actor,
                target: event.target,
                message: `${event.action.toUpperCase()}: ${event.actor} -> ${event.target ?? "WORLD"}`,
                type: event.outcome.includes("success") ? "success" : "neutral",
              }))}
              live={state.isAutoPlaying || state.isStepping}
              maxHeight="h-[28rem]"
            />
          </GamePanel>
        </div>
      </div>
    </div>
  );
}
