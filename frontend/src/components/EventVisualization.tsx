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
          ? "#eab308"
          : "#dc2626";
        return (
          <div
            key={`${event.turn}-${idx}`}
            className="text-xs font-mono p-2 border-l-2 border-slate-600 bg-slate-900 rounded-sm"
            style={{ borderLeftColor: actionColor }}
          >
            <div className="text-slate-300">
              T{event.turn}:{" "}
              <span style={{ color: actionColor }}>
                {event.action.toUpperCase()}
              </span>
            </div>
            <div className="text-slate-400 opacity-75">
              Agent {event.actor}
              {event.target !== null && ` → Agent ${event.target}`}
            </div>
            <div className="text-slate-500 opacity-50">{event.outcome}</div>
          </div>
        );
      })}
    </div>
  );
}

