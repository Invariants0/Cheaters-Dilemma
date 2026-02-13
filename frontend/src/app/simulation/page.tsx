"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { getSimulationStreamSocketUrl } from "@/lib/ws";
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

type StreamStatus = "idle" | "connecting" | "connected" | "paused" | "complete" | "error";

interface SimulationPageState {
  simulationId: string | null;
  simulationState: SimulationState | null;
  events: SimulationEvent[];
  displayTurn: number;
  isRunning: boolean;
  isAutoPlaying: boolean;
  isStepping: boolean;
  streamStatus: StreamStatus;
  streamError: string | null;
  config: SimulationConfig;
}

type SimulationPageAction =
  | { type: "SET_CONFIG"; patch: Partial<SimulationConfig> }
  | { type: "START_REQUEST" }
  | { type: "START_SUCCESS"; simulationId: string; simulationState: SimulationState }
  | { type: "START_FAILURE"; error?: string }
  | { type: "STREAM_CONNECTING"; mode: "play" | "step" }
  | { type: "STREAM_CONNECTED" }
  | { type: "STREAM_TURN"; turn: number; events: SimulationEvent[] }
  | { type: "STREAM_PAUSED" }
  | { type: "STREAM_COMPLETE"; turnsCompleted: number }
  | { type: "STREAM_ERROR"; error: string }
  | { type: "RESET" };

const DEFAULT_CONFIG: SimulationConfig = {
  agent_count: 10,
  seed: 42,
  turns: undefined,
};

const initialState: SimulationPageState = {
  simulationId: null,
  simulationState: null,
  events: [],
  displayTurn: 0,
  isRunning: false,
  isAutoPlaying: false,
  isStepping: false,
  streamStatus: "idle",
  streamError: null,
  config: DEFAULT_CONFIG,
};

function mergeEvents(existing: SimulationEvent[], incoming: SimulationEvent[]): SimulationEvent[] {
  if (incoming.length === 0) return existing;
  const seen = new Set(existing.map((e) => `${e.turn}:${e.actor}:${e.action}:${e.target}:${e.outcome}`));
  const merged = [...existing];
  for (const event of incoming) {
    const key = `${event.turn}:${event.actor}:${event.action}:${event.target}:${event.outcome}`;
    if (!seen.has(key)) {
      merged.push(event);
      seen.add(key);
    }
  }
  return merged;
}

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
        streamStatus: "idle",
        streamError: null,
      };
    case "START_SUCCESS":
      return {
        ...state,
        simulationId: action.simulationId,
        simulationState: action.simulationState,
        events: [],
        displayTurn: 0,
        isRunning: false,
        isAutoPlaying: false,
        isStepping: false,
        streamStatus: "idle",
        streamError: null,
      };
    case "START_FAILURE":
      return {
        ...state,
        isRunning: false,
        streamStatus: "error",
        streamError: action.error || "Failed to start simulation",
      };
    case "STREAM_CONNECTING":
      return {
        ...state,
        isAutoPlaying: action.mode === "play",
        isStepping: action.mode === "step",
        streamStatus: "connecting",
        streamError: null,
      };
    case "STREAM_CONNECTED":
      return {
        ...state,
        streamStatus: "connected",
      };
    case "STREAM_TURN":
      return {
        ...state,
        displayTurn: Math.max(state.displayTurn, action.turn),
        events: mergeEvents(state.events, action.events),
      };
    case "STREAM_PAUSED":
      return {
        ...state,
        isAutoPlaying: false,
        isStepping: false,
        streamStatus: "paused",
      };
    case "STREAM_COMPLETE":
      return {
        ...state,
        displayTurn: Math.max(state.displayTurn, action.turnsCompleted),
        isAutoPlaying: false,
        isStepping: false,
        streamStatus: "complete",
      };
    case "STREAM_ERROR":
      return {
        ...state,
        isAutoPlaying: false,
        isStepping: false,
        streamStatus: "error",
        streamError: action.error,
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

interface StreamMessage {
  type: string;
  turn?: number;
  turns_completed?: number;
  events?: SimulationEvent[];
  message?: string;
}

export default function SimulationPage() {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  const socketRef = useRef<WebSocket | null>(null);
  const streamModeRef = useRef<"play" | "step" | null>(null);
  const expectedCloseRef = useRef(false);

  const closeStream = useCallback((status: "paused" | "complete" = "paused") => {
    expectedCloseRef.current = true;
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    streamModeRef.current = null;
    if (status === "complete") {
      return;
    }
    dispatch({ type: "STREAM_PAUSED" });
  }, []);

  const connectStream = useCallback(
    (mode: "play" | "step") => {
      if (!state.simulationId) return;

      const maxTurn = state.simulationState?.current_turn ?? 0;
      if (state.displayTurn >= maxTurn) {
        dispatch({ type: "STREAM_COMPLETE", turnsCompleted: maxTurn });
        return;
      }

      if (socketRef.current && socketRef.current.readyState <= WebSocket.OPEN) {
        return;
      }

      const fromTurn = state.displayTurn + 1;
      const intervalMs = mode === "step" ? 60 : 300;
      const url = getSimulationStreamSocketUrl(state.simulationId, intervalMs, fromTurn);

      dispatch({ type: "STREAM_CONNECTING", mode });
      streamModeRef.current = mode;
      expectedCloseRef.current = false;

      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        dispatch({ type: "STREAM_CONNECTED" });
      };

      socket.onmessage = (event) => {
        let payload: StreamMessage;
        try {
          payload = JSON.parse(event.data) as StreamMessage;
        } catch {
          return;
        }

        if (payload.type === "turn" && typeof payload.turn === "number") {
          dispatch({ type: "STREAM_TURN", turn: payload.turn, events: payload.events ?? [] });

          if (streamModeRef.current === "step") {
            closeStream("paused");
          }
          return;
        }

        if (payload.type === "complete") {
          const turnsCompleted = payload.turns_completed ?? state.simulationState?.current_turn ?? state.displayTurn;
          dispatch({ type: "STREAM_COMPLETE", turnsCompleted });
          expectedCloseRef.current = true;
          socket.close();
          socketRef.current = null;
          streamModeRef.current = null;
          return;
        }

        if (payload.type === "error") {
          dispatch({ type: "STREAM_ERROR", error: payload.message || "Stream error" });
          expectedCloseRef.current = true;
          socket.close();
          socketRef.current = null;
          streamModeRef.current = null;
        }
      };

      socket.onerror = () => {
        dispatch({ type: "STREAM_ERROR", error: "WebSocket connection error" });
      };

      socket.onclose = () => {
        socketRef.current = null;
        if (expectedCloseRef.current) {
          expectedCloseRef.current = false;
          return;
        }
        dispatch({ type: "STREAM_PAUSED" });
      };
    },
    [
      closeStream,
      state.displayTurn,
      state.simulationId,
      state.simulationState?.current_turn,
    ]
  );

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        expectedCloseRef.current = true;
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  const startSimulation = async () => {
    try {
      if (socketRef.current) {
        expectedCloseRef.current = true;
        socketRef.current.close();
        socketRef.current = null;
      }
      dispatch({ type: "START_REQUEST" });
      const response = await apiClient.startSimulation(state.config);
      const simulationState = await apiClient.getSimulationState(response.simulation_id);

      dispatch({
        type: "START_SUCCESS",
        simulationId: response.simulation_id,
        simulationState,
      });
    } catch (error) {
      console.error("Failed to start simulation:", error);
      dispatch({ type: "START_FAILURE", error: "Failed to start simulation" });
    }
  };

  const stepSimulation = useCallback(async () => {
    connectStream("step");
  }, [connectStream]);

  const playSimulation = () => {
    connectStream("play");
  };

  const pauseSimulation = () => {
    closeStream("paused");
  };

  const resetSimulation = () => {
    if (socketRef.current) {
      expectedCloseRef.current = true;
      socketRef.current.close();
      socketRef.current = null;
    }
    streamModeRef.current = null;
    dispatch({ type: "RESET" });
  };

  const maxTurns = state.simulationState?.current_turn || state.config.turns;

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
            isRunning={state.isRunning || state.isAutoPlaying || state.isStepping || state.streamStatus === "connecting"}
            currentTurn={state.displayTurn}
            maxTurns={maxTurns}
            onStep={stepSimulation}
            onPlay={playSimulation}
            onPause={pauseSimulation}
            onReset={resetSimulation}
            seedValue={state.config.seed}
            agentCount={state.config.agent_count}
          />

          <GamePanel title="STREAM STATUS">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#00d9ff]">STATE:</span>
                <span className="text-[#00ffff]">{state.streamStatus.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00d9ff]">TURN:</span>
                <span className="text-[#00ffff]">{state.displayTurn}/{maxTurns || "?"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00d9ff]">EVENTS:</span>
                <span className="text-[#00ffff]">{state.events.length}</span>
              </div>
              {state.streamError && (
                <div className="text-[#ff0055]">{state.streamError}</div>
              )}
            </div>
          </GamePanel>

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
          <AllianceGraph alliances={[]} loading={state.isRunning || state.isStepping || state.streamStatus === "connecting"} />

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
              live={state.isAutoPlaying || state.isStepping || state.streamStatus === "connecting" || state.streamStatus === "connected"}
              maxHeight="h-[28rem]"
            />
          </GamePanel>
        </div>
      </div>
    </div>
  );
}
