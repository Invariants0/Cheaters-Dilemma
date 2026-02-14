"use client";

import { useEffect, useRef, useState } from "react";
import { AgentSummary, SimulationEvent } from "@/lib/types";
import { GamePanel } from "@/components/GameUI";

interface WorldPosition {
  x: number;
  y: number;
}

interface TerrainTile {
  x: number;
  y: number;
  type: "grass" | "water" | "mountain" | "forest" | "settlement";
  seed: number;
}

interface WorldAgent {
  agent_id: number;
  position: WorldPosition;
  resources: number;
  strength: number;
  alive: boolean;
  strategy: string;
}

interface InteractiveWorldProps {
  agents: AgentSummary[];
  turn: number;
  seed: number;
  events?: SimulationEvent[];
  onAgentSelect?: (agentId: number) => void;
}

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;
const TILE_SIZE = 40;
const GRID_W = Math.ceil(WORLD_WIDTH / TILE_SIZE);
const GRID_H = Math.ceil(WORLD_HEIGHT / TILE_SIZE);
const AGENT_RADIUS = 4; // Keep circles small

// Seeded random number generator
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateTerrainMap(seed: number): TerrainTile[] {
  const terrain: TerrainTile[] = [];
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const tileSeed = seed + x * 73856093 ^ y * 19349663;
      const rand = seededRandom(tileSeed);
      
      let type: TerrainTile["type"];
      if (rand < 0.4) type = "grass";
      else if (rand < 0.55) type = "water";
      else if (rand < 0.7) type = "forest";
      else if (rand < 0.85) type = "mountain";
      else type = "settlement";
      
      terrain.push({ x, y, type, seed: tileSeed });
    }
  }
  return terrain;
}

function getTerrainColor(type: string): string {
  switch (type) {
    case "grass": return "#1a4d1a";
    case "water": return "#0a3d66";
    case "mountain": return "#4a4a4a";
    case "forest": return "#0d6b0d";
    case "settlement": return "#6b4423";
    default: return "#1a1a2e";
  }
}

function getStrategyColor(strategy: string): string {
  switch (strategy?.toLowerCase()) {
    case "cheater": return "#ff0055";
    case "greedy": return "#ff9900";
    case "politician": return "#ffff00";
    case "warlord": return "#ff3366";
    default: return "#eab308";
  }
}

export function InteractiveWorld({
  agents,
  turn,
  seed,
  events = [],
  onAgentSelect,
}: InteractiveWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [terrain, setTerrain] = useState<TerrainTile[]>([]);
  const [worldAgents, setWorldAgents] = useState<WorldAgent[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [activeEvents, setActiveEvents] = useState<Map<number, number>>(new Map()); // agentId -> animation frame

  // Generate terrain on mount and when seed changes
  useEffect(() => {
    setTerrain(generateTerrainMap(seed));
  }, [seed]);

  // Update agent positions
  useEffect(() => {
    const newWorldAgents = agents.map((agent) => {
      const positionSeed = seed + agent.agent_id * 12345;
      const xRand = seededRandom(positionSeed);
      const yRand = seededRandom(positionSeed + 1);

      return {
        agent_id: agent.agent_id,
        position: {
          x: xRand * (WORLD_WIDTH - 30),
          y: yRand * (WORLD_HEIGHT - 30),
        },
        resources: agent.resources,
        strength: agent.strength,
        alive: agent.alive,
        strategy: agent.strategy,
      };
    });
    setWorldAgents(newWorldAgents);
  }, [agents, seed]);

  // Animate events - highlight agents involved in recent events
  useEffect(() => {
    if (events.length === 0) return;

    const lastEvent = events[events.length - 1];
    // Add actors and targets to active events.
    setActiveEvents((prev) => {
      const next = new Map(prev);
      if (lastEvent.actor !== null && lastEvent.actor !== undefined) {
        next.set(lastEvent.actor, 10); // 10 animation frames
      }
      if (lastEvent.target !== null && lastEvent.target !== undefined) {
        next.set(lastEvent.target, 10);
      }
      return next;
    });

    // Decay animation frames
    const timer = setInterval(() => {
      setActiveEvents((prev) => {
        const updated = new Map(prev);
        for (const [agentId, frames] of updated.entries()) {
          if (frames <= 1) {
            updated.delete(agentId);
          } else {
            updated.set(agentId, frames - 1);
          }
        }
        return updated;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [events]);

  // Draw world
  useEffect(() => {
    if (!canvasRef.current || terrain.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = "#0f1419";
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Draw terrain
    terrain.forEach((tile) => {
      ctx.fillStyle = getTerrainColor(tile.type);
      ctx.fillRect(
        tile.x * TILE_SIZE,
        tile.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );

      // Add subtle grid
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.1;
      ctx.strokeRect(
        tile.x * TILE_SIZE,
        tile.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
      ctx.globalAlpha = 1;
    });

    // Draw agents
    worldAgents.forEach((agent) => {
      if (!agent.alive) return; // Only show active agents

      const color = getStrategyColor(agent.strategy);
      const isActive = activeEvents.has(agent.agent_id);
      const animationFrame = activeEvents.get(agent.agent_id) || 0;
      const pulseSize = AGENT_RADIUS + (animationFrame / 10) * 3;

      // Draw glow effect if agent is active
      if (isActive) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3 * (animationFrame / 10);
        ctx.beginPath();
        ctx.arc(agent.position.x, agent.position.y, pulseSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw agent circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(agent.position.x, agent.position.y, AGENT_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Draw border - brighter if active
      ctx.strokeStyle = isActive ? "#eab308" : color;
      ctx.lineWidth = isActive ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(agent.position.x, agent.position.y, AGENT_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // Draw agent ID only on hover
      if (hoveredAgent === agent.agent_id) {
        ctx.fillStyle = "#eab308";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${agent.agent_id}`, agent.position.x, agent.position.y);
      }
    });

    // Draw interaction lines for recent events
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      if (lastEvent.actor !== null && lastEvent.actor !== undefined && lastEvent.target !== null && lastEvent.target !== undefined) {
        const actorAgent = worldAgents.find((a) => a.agent_id === lastEvent.actor);
        const targetAgent = worldAgents.find((a) => a.agent_id === lastEvent.target);

        if (actorAgent && targetAgent) {
          const animFrame = activeEvents.get(lastEvent.actor) || activeEvents.get(lastEvent.target) || 0;
          ctx.strokeStyle = lastEvent.outcome.includes("success") ? "#eab308" : "#ff0055";
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = (animFrame / 10) * 0.6;
          ctx.setLineDash([3, 3]);

          ctx.beginPath();
          ctx.moveTo(actorAgent.position.x, actorAgent.position.y);
          ctx.lineTo(targetAgent.position.x, targetAgent.position.y);
          ctx.stroke();

          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }
      }
    }

    // Draw turn indicator
    ctx.fillStyle = "#eab308";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`TURN: ${turn}`, 10, 10);
    ctx.fillText(`AGENTS: ${worldAgents.filter(a => a.alive).length}/${worldAgents.length}`, 10, 30);
  }, [terrain, worldAgents, turn, activeEvents, events, hoveredAgent]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked agent
    for (const agent of worldAgents) {
      const size = Math.max(6, (agent.resources / 100) * 15);
      const dist = Math.sqrt(
        (x - agent.position.x) ** 2 + (y - agent.position.y) ** 2
      );
      if (dist <= size + 5) {
        onAgentSelect?.(agent.agent_id);
        return;
      }
    }
  };

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = false;
    for (const agent of worldAgents) {
      const size = Math.max(6, (agent.resources / 100) * 15);
      const dist = Math.sqrt(
        (x - agent.position.x) ** 2 + (y - agent.position.y) ** 2
      );
      if (dist <= size + 5) {
        setHoveredAgent(agent.agent_id);
        found = true;
        break;
      }
    }
    if (!found) setHoveredAgent(null);
  };

  return (
    <GamePanel title="INTERACTIVE WORLD" className="h-full">
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasHover}
          onMouseLeave={() => setHoveredAgent(null)}
          className="w-full border-2 border-[#eab308] bg-[#0f1419] cursor-pointer hover:border-[#475569] transition-colors"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Hovered Agent Info */}
        {hoveredAgent !== null && (
          <div className="absolute top-4 right-4 bg-[#0f1419] border-2 border-[#475569] p-3 text-xs font-mono">
            <div className="text-[#475569]">AGENT #{hoveredAgent}</div>
            {worldAgents
              .filter((a) => a.agent_id === hoveredAgent)
              .map((a) => (
                <div key={a.agent_id} className="space-y-1 text-[#94a3b8]">
                  <div>STRATEGY: {a.strategy}</div>
                  <div>RESOURCES: ${a.resources}</div>
                  <div>STRENGTH: {a.strength}</div>
                </div>
              ))}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-[#0f1419]/80 border-2 border-[#eab308] p-3 text-xs font-mono space-y-1">
          <div className="text-[#eab308] font-bold mb-2">&gt; LEGEND &lt;</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff0055]"></div>
            <span className="text-[#ff0055]">CHEATER</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff9900]"></div>
            <span className="text-[#ff9900]">GREEDY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ffff00]"></div>
            <span className="text-[#ffff00]">POLITICIAN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff3366]"></div>
            <span className="text-[#ff3366]">WARLORD</span>
          </div>
        </div>
      </div>
    </GamePanel>
  );
}

