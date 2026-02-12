"use client";

import { SimulationEvent } from "@/lib/types";

interface EventVisualizationProps {
  events: SimulationEvent[];
  worldWidth?: number;
  worldHeight?: number;
}

export function EventVisualization({
  events,
  worldWidth = 800,
  worldHeight = 600,
}: EventVisualizationProps) {
  // Note: This component is designed for visual event overlays on the world canvas.
  // Events are passed in but can be rendered as visual indicators on the world.

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {events.slice(-8).map((event, idx) => {
        const actionColor = event.outcome.includes("success")
          ? "#00ffff"
          : "#ff0055";
        return (
          <div
            key={`${event.turn}-${idx}`}
            className="text-xs font-mono p-2 border-l-2 border-[#ff00ff] bg-[#0a0e27]"
            style={{ borderLeftColor: actionColor }}
          >
            <div className="text-[#00d9ff]">
              T{event.turn}: <span style={{ color: actionColor }}>{event.action.toUpperCase()}</span>
            </div>
            <div className="text-[#00d9ff] opacity-75">
              Agent {event.actor}
              {event.target !== null && ` → Agent ${event.target}`}
            </div>
            <div className="text-[#00d9ff] opacity-50">{event.outcome}</div>
          </div>
        );
      })}
    </div>
  );
}
