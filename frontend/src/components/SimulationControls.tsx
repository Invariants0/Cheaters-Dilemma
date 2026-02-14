"use client";

import { GamePanel, GameButton, StatDisplay } from "@/components/GameUI";

interface SimulationControlsProps {
  isRunning: boolean;
  currentTurn: number;
  maxTurns?: number;
  onStep?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onExport?: () => void;
  seedValue?: number;
  agentCount?: number;
}

export function SimulationControls({
  isRunning,
  currentTurn,
  maxTurns,
  onStep,
  onPlay,
  onPause,
  onReset,
  onExport,
  seedValue,
  agentCount,
}: SimulationControlsProps) {
  const progress = maxTurns ? (currentTurn / maxTurns) * 100 : 0;

  return (
    <GamePanel title="SIMULATION">
      <div className="space-y-4">
        {/* Current Stats */}
        <div className="space-y-2 text-xs">
          <StatDisplay label="TURN" value={currentTurn} unit={maxTurns ? `/ ${maxTurns}` : ""} />
          <StatDisplay label="AGENTS" value={agentCount || "?"} />
          {seedValue && <StatDisplay label="SEED" value={seedValue} />}
        </div>

        {/* Progress Bar */}
        <div className="bg-[#0f1419] border border-[#eab308] h-6 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#eab308] to-[#475569]"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center text-xs font-bold text-[#0f1419]">
            {progress.toFixed(0)}%
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {onStep && (
            <GameButton onClick={onStep} disabled={isRunning} className="text-xs py-1">
              ⏭ STEP
            </GameButton>
          )}
          {onPlay && (
            <GameButton onClick={onPlay} disabled={isRunning} className="text-xs py-1">
              ▶ PLAY
            </GameButton>
          )}
          {onPause && (
            <GameButton onClick={onPause} disabled={!isRunning} className="text-xs py-1">
              ⏸ PAUSE
            </GameButton>
          )}
          {onReset && (
            <GameButton onClick={onReset} className="text-xs py-1 border-[#ff0055] text-[#ff0055]">
              🔄 RESET
            </GameButton>
          )}
        </div>

        {/* Export Button */}
        {onExport && (
          <GameButton onClick={onExport} className="w-full text-xs py-1">
            💾 EXPORT
          </GameButton>
        )}
      </div>
    </GamePanel>
  );
}

