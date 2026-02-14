"use client";

import { useState, useEffect } from "react";
import { GamePanel, GameButton, StatDisplay } from "@/components/GameUI";
import { ReplayEvent } from "@/lib/types";

interface ReplayPlayerProps {
  events: ReplayEvent[];
  totalTurns: number;
  onTurnChange?: (turn: number) => void;
}

export function ReplayPlayer({ events, totalTurns, onTurnChange }: ReplayPlayerProps) {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const turnEvents = events.filter((e) => e.turn === currentTurn);

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTurn((prev) => {
        if (prev >= totalTurns - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, totalTurns]);

  // Notify parent of turn change
  useEffect(() => {
    onTurnChange?.(currentTurn);
  }, [currentTurn, onTurnChange]);

  const progress = (currentTurn / totalTurns) * 100;

  return (
    <GamePanel title="REPLAY CONTROL">
      <div className="space-y-4">
        {/* Current Turn Display */}
        <StatDisplay
          label="CURRENT TURN"
          value={`${currentTurn} / ${totalTurns}`}
        />

        {/* Progress Bar */}
        <div className="relative w-full h-6 bg-[#0f1419] border border-[#eab308]">
          <div
            className="h-full bg-linear-to-r from-[#eab308] to-[#475569] transition-all"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#0f1419] pointer-events-none">
            {progress.toFixed(0)}%
          </div>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="0"
          max={totalTurns - 1}
          value={currentTurn}
          onChange={(e) => setCurrentTurn(parseInt(e.target.value))}
          className="w-full accent-[#475569]"
        />

        {/* Controls */}
        <div className="grid grid-cols-4 gap-2">
          <GameButton
            onClick={() => setCurrentTurn(0)}
            className="text-xs py-1"
            disabled={currentTurn === 0}
          >
            ⏮
          </GameButton>
          <GameButton
            onClick={() => setCurrentTurn(Math.max(0, currentTurn - 1))}
            className="text-xs py-1"
            disabled={currentTurn === 0}
          >
            ◀
          </GameButton>
          {!isPlaying ? (
            <GameButton
              onClick={() => setIsPlaying(true)}
              className="text-xs py-1"
              disabled={currentTurn >= totalTurns - 1}
            >
              ▶
            </GameButton>
          ) : (
            <GameButton
              onClick={() => setIsPlaying(false)}
              className="text-xs py-1 border-[#ffff00] text-[#ffff00]"
            >
              ⏸
            </GameButton>
          )}
          <GameButton
            onClick={() => setCurrentTurn(Math.min(totalTurns - 1, currentTurn + 1))}
            className="text-xs py-1"
            disabled={currentTurn >= totalTurns - 1}
          >
            ▶▶
          </GameButton>
          <GameButton
            onClick={() => setCurrentTurn(totalTurns - 1)}
            className="col-span-4 text-xs py-1"
            disabled={currentTurn === totalTurns - 1}
          >
            ⏭ END
          </GameButton>
        </div>

        {/* Events at current turn */}
        <div className="bg-[#0f1419] border border-[#eab308] p-3 max-h-64 overflow-y-auto">
          <div className="text-[#475569] font-bold text-xs mb-2">
            EVENTS AT TURN {currentTurn}
          </div>
          {turnEvents.length > 0 ? (
            <div className="space-y-2 text-xs font-mono">
              {turnEvents.map((event, idx) => (
                <div key={idx} className="text-[#94a3b8] border-l-2 border-[#475569] pl-2">
                  <div className="text-[#475569]">
                    Agent {event.actor} {event.action}
                    {event.target ? ` on Agent ${event.target}` : ""}
                  </div>
                  {event.outcome && (
                    <div className="text-[#94a3b8]/70">{event.outcome}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#94a3b8] text-center py-4 text-xs opacity-50">
              NO EVENTS THIS TURN
            </div>
          )}
        </div>
      </div>
    </GamePanel>
  );
}

