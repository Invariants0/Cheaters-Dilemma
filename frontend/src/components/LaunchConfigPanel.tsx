"use client";

import { GamePanel, GameButton } from "@/components/GameUI";
import Link from "next/link";

interface SimulationConfig {
  agent_count: number;
  seed: number;
  turns: number | undefined;
}

interface LaunchConfigPanelProps {
  config: SimulationConfig;
  onConfigChange: (patch: Partial<SimulationConfig>) => void;
  onStart: () => void;
  isRunning: boolean;
}

function parseIntOrFallback(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function LaunchConfigPanel({
  config,
  onConfigChange,
  onStart,
  isRunning,
}: LaunchConfigPanelProps) {
  return (
    <GamePanel title="LAUNCH SIMULATION" className="max-w-md w-full">
      <div className="space-y-4">
        <div>
          <label className="stat-label block mb-2">AGENT COUNT</label>
          <input
            type="number"
            min="5"
            max="20"
            value={config.agent_count}
            onChange={(e) =>
              onConfigChange({
                agent_count: parseIntOrFallback(e.target.value, config.agent_count),
              })
            }
            className="w-full bg-[#0f1419] border-2 border-[#eab308] text-[#eab308] px-3 py-2 font-mono focus:outline-none focus:border-[#475569]"
          />
        </div>
        <div>
          <label className="stat-label block mb-2">RANDOM SEED</label>
          <input
            type="number"
            value={config.seed}
            onChange={(e) =>
              onConfigChange({ seed: parseIntOrFallback(e.target.value, config.seed) })
            }
            className="w-full bg-[#0f1419] border-2 border-[#eab308] text-[#eab308] px-3 py-2 font-mono focus:outline-none focus:border-[#475569]"
          />
        </div>
        <div>
          <label className="stat-label block mb-2">MAX TURNS (OPTIONAL)</label>
          <input
            type="number"
            placeholder="500"
            value={config.turns || ""}
            onChange={(e) =>
              onConfigChange({
                turns: e.target.value ? parseIntOrFallback(e.target.value, config.turns ?? 500) : undefined,
              })
            }
            className="w-full bg-[#0f1419] border-2 border-[#eab308] text-[#eab308] px-3 py-2 font-mono focus:outline-none focus:border-[#475569]"
          />
        </div>
        <div className="flex gap-2">
          <GameButton onClick={onStart} disabled={isRunning} className="flex-1">
            {isRunning ? "LOADING..." : "LAUNCH"}
          </GameButton>
          <Link href="/" className="flex-1">
            <GameButton className="w-full">BACK</GameButton>
          </Link>
        </div>
      </div>
    </GamePanel>
  );
}

