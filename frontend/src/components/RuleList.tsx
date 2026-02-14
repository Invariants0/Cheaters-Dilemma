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
        <div className="text-[#94a3b8] text-center py-4">LOADING RULESET...</div>
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
          <div key={key} className="flex justify-between items-center p-2 border-l-2 border-[#eab308] hover:bg-[#eab308]/10">
            <span className="text-[#eab308] uppercase word-break flex-1">{key}</span>
            <span className="text-[#475569] font-bold ml-2">
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
        <div className="text-[#94a3b8] text-center py-4">LOADING HISTORY...</div>
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
                className="p-2 border-l-2 border-[#475569] hover:bg-[#475569]/10 text-[#94a3b8]"
              >
                <div className="text-[#475569] font-bold">
                  TURN {change.turn} - V{change.version}
                </div>
                <div className="text-[#eab308]">{change.change_type}</div>
                <div className="text-[#94a3b8] text-xs mt-1">
                  {change.key}: {String(change.old_value)} → {String(change.new_value)}
                </div>
                {change.description && (
                  <div className="text-[#94a3b8]/70 text-xs mt-1 italic">{change.description}</div>
                )}
              </div>
            ))
        ) : (
          <div className="text-[#94a3b8] text-center py-4">NO CHANGES YET</div>
        )}
      </div>
    </GamePanel>
  );
}

