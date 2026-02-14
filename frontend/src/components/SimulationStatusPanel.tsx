"use client";

import { GamePanel } from "@/components/GameUI";

type StreamStatus = "idle" | "connecting" | "connected" | "paused" | "complete" | "error";

interface SimulationStatusPanelProps {
  streamStatus: StreamStatus;
  currentTurn: number;
  maxTurns: number | undefined;
  eventCount: number;
  streamError: string | null;
}

export function SimulationStatusPanel({
  streamStatus,
  currentTurn,
  maxTurns,
  eventCount,
  streamError,
}: SimulationStatusPanelProps) {
  return (
    <GamePanel title="STREAM STATUS">
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-[#00d9ff]">STATE:</span>
          <span className="text-[#00ffff]">{streamStatus.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00d9ff]">TURN:</span>
          <span className="text-[#00ffff]">{currentTurn}/{maxTurns || "?"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00d9ff]">EVENTS:</span>
          <span className="text-[#00ffff]">{eventCount}</span>
        </div>
        {streamError && (
          <div className="text-[#ff0055]">{streamError}</div>
        )}
      </div>
    </GamePanel>
  );
}