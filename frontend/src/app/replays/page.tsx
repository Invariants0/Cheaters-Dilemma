"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { ReplaySummary } from "@/lib/types";

export default function ReplaysPage() {
  const [replays, setReplays] = useState<ReplaySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReplays = async () => {
      try {
        const data = await apiClient.getReplays();
        setReplays(data);
      } catch (error) {
        console.error("Failed to fetch replays:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReplays();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-600">Loading replays...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Simulation Replays</h1>

      {replays.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No replays available yet</div>
          <Link
            href="/simulation"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Start Your First Simulation
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {replays.map((replay) => (
            <div key={replay.replay_id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Simulation {replay.replay_id}
                </h3>
                <Link
                  href={`/replays/${replay.replay_id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  View Replay
                </Link>
              </div>

              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{replay.agent_count}</div>
                  <div className="text-sm text-gray-600">Agents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{replay.turns_completed}</div>
                  <div className="text-sm text-gray-600">Turns</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{replay.winner_strategy}</div>
                  <div className="text-sm text-gray-600">Winner</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{replay.winner_resources}</div>
                  <div className="text-sm text-gray-600">Final Resources</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Seed: {replay.seed} • Created: {new Date(replay.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}