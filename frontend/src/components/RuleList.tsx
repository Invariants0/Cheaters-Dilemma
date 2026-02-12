"use client";

import { Ruleset, RuleHistory } from "@/lib/types";
import { GamePanel } from "@/components/GameUI";

interface RuleListProps {
  ruleset: Ruleset | null;
  loading?: boolean;
}

export function RuleList({ ruleset, loading = false }: RuleListProps) {
  if (loading) {
    return (
      <GamePanel title="RULES">
        <div className="text-[#00d9ff] text-center py-4">LOADING RULESET...</div>
      </GamePanel>
    );
  }

  if (!ruleset) {
    return (
      <GamePanel title="RULES">
        <div className="text-[#ff0055] text-center py-4">NO RULESET AVAILABLE</div>
      </GamePanel>
    );
  }

  return (
    <GamePanel title={`RULESET V${ruleset.version}`}>
      <div className="space-y-2 text-xs font-mono">
        {Object.entries(ruleset.rules).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center p-2 border-l-2 border-[#00ffff] hover:bg-[#00ffff]/10">
            <span className="text-[#00ffff] uppercase word-break flex-1">{key}</span>
            <span className="text-[#ff00ff] font-bold ml-2">
              {typeof value === "boolean" ? (value ? "ON" : "OFF") : String(value)}
            </span>
          </div>
        ))}
      </div>
    </GamePanel>
  );
}

interface RuleTimelineProps {
  history: RuleHistory[];
  loading?: boolean;
}

export function RuleTimeline({ history, loading = false }: RuleTimelineProps) {
  if (loading) {
    return (
      <GamePanel title="RULE HISTORY">
        <div className="text-[#00d9ff] text-center py-4">LOADING HISTORY...</div>
      </GamePanel>
    );
  }

  return (
    <GamePanel title={`HISTORY (${history.length} CHANGES)`} className="max-h-96 overflow-y-auto">
      <div className="space-y-2 text-xs font-mono">
        {history.length > 0 ? (
          history
            .sort((a, b) => b.turn - a.turn)
            .map((change, idx) => (
              <div
                key={idx}
                className="p-2 border-l-2 border-[#ff00ff] hover:bg-[#ff00ff]/10 text-[#00d9ff]"
              >
                <div className="text-[#ff00ff] font-bold">
                  TURN {change.turn} - V{change.version}
                </div>
                <div className="text-[#00ffff]">{change.change_type}</div>
                <div className="text-[#00d9ff] text-xs mt-1">
                  {change.key}: {String(change.old_value)} → {String(change.new_value)}
                </div>
                {change.description && (
                  <div className="text-[#00d9ff]/70 text-xs mt-1 italic">{change.description}</div>
                )}
              </div>
            ))
        ) : (
          <div className="text-[#00d9ff] text-center py-4">NO CHANGES YET</div>
        )}
      </div>
    </GamePanel>
  );
}
