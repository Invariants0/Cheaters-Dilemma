"use client";

import { GamePanel, GameButton } from "@/components/GameUI";
import Link from "next/link";

interface SimulationConfig {
  agent_count: number;
  seed: number;
  turns: number | undefined;
}

interface SimulationConfigPanelProps {
  config: SimulationConfig;
  onConfigChange: (patch: Partial<SimulationConfig>) => void;
  onStart: () => void;
  isRunning: boolean;
}

function parseIntOrFallback(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function SimulationConfigPanel({
  config,
  onConfigChange,
  onStart,
  isRunning,
}: SimulationConfigPanelProps) {
  return (
    <GamePanel title="CONFIGURATION">
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-[#00d9ff] mb-1">AGENTS</label>
          <input
            type="number"
            value={config.agent_count}
            onChange={(e) =>
              onConfigChange({ agent_count: parseIntOrFallback(e.target.value, config.agent_count) })
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
            value={config.seed}
            onChange={(e) =>
              onConfigChange({ seed: parseIntOrFallback(e.target.value, config.seed) })
            }
            className="w-full bg-[#0f1629] border border-[#00d9ff] text-[#00ffff] px-2 py-1 text-xs font-mono"
          />
        </div>
        <GameButton onClick={onStart} className="w-full" disabled={isRunning}>
          START NEW
        </GameButton>
        <Link href="/" className="block">
          <GameButton className="w-full">BACK TO HOME</GameButton>
        </Link>
      </div>
    </GamePanel>
  );
}