"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { ReplayDetail, ReplayEvent, AgentLeaderboardEntry } from "@/lib/types";
import { GamePanel, GameButton, StatDisplay, EventLog, AgentCard } from "@/components/GameUI";

export default function ReplayDetailPage() {
  const params = useParams();
  const replayId = params.id as string;
  const [replay, setReplay] = useState<ReplayDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(0);

  useEffect(() => {
    const loadReplay = async () => {
      try {
        const replayData = await apiClient.getReplayDetail(replayId);
        setReplay(replayData);
      } catch (error) {
        console.error("Failed to load replay:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReplay();
  }, [replayId]);

  if (loading) {
    return (
      <div className="w-full h-full overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="text-[#00ffff] font-mono text-2xl">LOADING REPLAY...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!replay) {
    return (
      <div className="w-full h-full overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          <div className="lg:col-span-4 flex items-center justify-center">
            <GamePanel title="ERROR">
              <p className="text-[#ff0055] font-mono">Replay not found</p>
              <Link href="/replays" className="block mt-4">
                <GameButton className="w-full">BACK TO REPLAYS</GameButton>
              </Link>
            </GamePanel>
          </div>
        </div>
      </div>
    );
  }

  // Filter events for current turn
  const turnEvents = replay.events.filter(
    (e: ReplayEvent) => e.turn === currentTurn
  );

  // Get leaderboard at current turn (simplified - would need turn snapshots in real implementation)
  const leaderboardAtTurn = replay.leaderboard.slice(0, 5);

  const maxTurn = replay.turns_completed - 1;
  const progress = (currentTurn / maxTurn) * 100;

  return (
    <div className="w-full h-full overflow-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
        {/* Left Panel - Controls & Leaderboard */}
        <div className="lg:col-span-1 space-y-4">
          <GamePanel title="REPLAY CONTROL">
            <div className="space-y-3 text-xs">
              <StatDisplay label="Seed" value={replay.seed} />
              <StatDisplay label="Agents" value={replay.agent_count} />
              <StatDisplay label="Total Turns" value={replay.turns_completed} />
              <StatDisplay label="Current Turn" value={currentTurn} />
            </div>
          </GamePanel>

          <GamePanel title="LEADERBOARD AT TURN {currentTurn}">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {leaderboardAtTurn.map((agent: AgentLeaderboardEntry, idx: number) => (
                <AgentCard
                  key={agent.agent_id}
                  agent={agent}
                  rank={idx + 1}
                />
              ))}
            </div>
          </GamePanel>

          <Link href="/replays" className="block">
            <GameButton className="w-full">BACK TO REPLAYS</GameButton>
          </Link>
        </div>

        {/* Center - Replay Controls & Events */}
        <div className="lg:col-span-3">
          <div className="space-y-4 h-full overflow-y-auto">
            <GamePanel title={`TURN ${currentTurn} / ${maxTurn}`} className="mb-4">
              <div className="space-y-4">
                {/* Turn Scrubber */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#00d9ff] font-mono">
                    <span>TURN TIMELINE</span>
                    <span>{currentTurn}/{maxTurn}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxTurn}
                    value={currentTurn}
                    onChange={(e) => setCurrentTurn(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#0a0e27] border-2 border-[#00ffff] appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #00ffff 0%, #00ffff ${progress}%, #0a0e27 ${progress}%, #0a0e27 100%)`,
                    }}
                  />
                </div>

                {/* Playback Controls */}
                <div className="grid grid-cols-4 gap-2">
                  <GameButton
                    onClick={() => setCurrentTurn(0)}
                    disabled={currentTurn === 0}
                  >
                    START
                  </GameButton>
                  <GameButton
                    onClick={() => setCurrentTurn(Math.max(0, currentTurn - 1))}
                    disabled={currentTurn === 0}
                  >
                    PREV
                  </GameButton>
                  <GameButton
                    onClick={() => setCurrentTurn(Math.min(maxTurn, currentTurn + 1))}
                    disabled={currentTurn === maxTurn}
                  >
                    NEXT
                  </GameButton>
                  <GameButton
                    onClick={() => setCurrentTurn(maxTurn)}
                    disabled={currentTurn === maxTurn}
                  >
                    END
                  </GameButton>
                </div>
              </div>
            </GamePanel>

            {/* Events at this turn */}
            <GamePanel title={`EVENTS (${turnEvents.length})`}>
              <EventLog
                events={turnEvents.map((e: ReplayEvent) => ({
                  turn: e.turn,
                  message: `${e.action} ${e.target ? `→ Agent ${e.target}` : ""}`,
                }))}
                maxHeight="h-auto"
              />
              {turnEvents.length === 0 && (
                <p className="text-[#00d9ff] font-mono text-xs">No events on this turn</p>
              )}
            </GamePanel>
          </div>
        </div>
      </div>
    </div>
  );
}
