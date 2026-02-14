"use client";

import { GamePanel } from "@/components/GameUI";

interface Alliance {
  alliance_id: string;
  member_ids: number[];
  collective_strength: number;
  created_turn: number;
}

interface AllianceGraphProps {
  alliances: Alliance[];
  loading?: boolean;
}

export function AllianceGraph({
  alliances,
  loading = false,
}: AllianceGraphProps) {
  if (loading) {
    return (
      <GamePanel title="ALLIANCES">
        <div className="text-slate-400 text-center py-8">
          ANALYZING ALLIANCES...
        </div>
      </GamePanel>
    );
  }

  if (alliances.length === 0) {
    return (
      <GamePanel title="ALLIANCES">
        <div className="text-slate-500 text-center py-8 opacity-50">
          NO ACTIVE ALLIANCES
        </div>
      </GamePanel>
    );
  }

  return (
    <GamePanel title={`${alliances.length} ACTIVE ALLIANCES`} variant="green">
      <div className="space-y-3">
        {alliances.map((alliance) => (
          <div
            key={alliance.alliance_id}
            className="p-3 border-l-2 border-green-600 bg-green-950/20 rounded-sm"
          >
            <div className="text-green-400 font-bold text-xs mb-2">
              ALLIANCE {alliance.alliance_id.substring(0, 8)}
            </div>
            <div className="text-slate-300 text-xs mb-1">
              Members: {alliance.member_ids.join(", ")}
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>STRENGTH: {alliance.collective_strength}</span>
              <span>FORMED: T{alliance.created_turn}</span>
            </div>
          </div>
        ))}
      </div>
    </GamePanel>
  );
}

