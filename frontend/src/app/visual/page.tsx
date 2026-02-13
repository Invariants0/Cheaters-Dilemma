"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VisualGameState } from "@/lib/gameTypes";
import { generateAgents, processTick } from "@/lib/gameLogic";
import VisualGameBoard from "@/components/VisualGameBoard";
import VisualAgentCard from "@/components/VisualAgentCard";
import VisualEventLog from "@/components/VisualEventLog";
import VisualLeaderboard from "@/components/VisualLeaderboard";
import { INITIAL_AGENTS, WINNING_SCORE } from "@/lib/gameConstants";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Trophy,
  MessageSquare,
  Home,
} from "lucide-react";
import Link from "next/link";

export default function VisualSimulationPage() {
  const [gameState, setGameState] = useState<VisualGameState>({
    tick: 0,
    isRunning: false,
    winner: null,
    agents: [],
    logs: [],
    speed: 1000, // ms per tick
  });

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showInteractions, setShowInteractions] = useState<boolean>(true);

  // Initialize game on mount
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetGame = useCallback(() => {
    const agents = generateAgents(INITIAL_AGENTS);
    setGameState({
      tick: 0,
      isRunning: false,
      winner: null,
      agents,
      logs: [],
      speed: 500,
    });
    setSelectedAgentId(null);
  }, []);

  // Game Loop
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameState.isRunning && !gameState.winner) {
      timerRef.current = window.setInterval(() => {
        setGameState((prev) => {
          const { newAgents, logs: newLogs } = processTick(
            prev.agents,
            prev.tick + 1,
          );

          // Check winner
          const winner = newAgents.find((a) => a.score >= WINNING_SCORE);
          let finalWinner = prev.winner;

          if (winner) {
            finalWinner = winner;
            newLogs.push({
              id: crypto.randomUUID(),
              tick: prev.tick + 1,
              message: `🏆 GAME OVER! ${winner.name} wins with ${Math.floor(winner.score)} points!`,
              type: "win",
            });
          }

          // Also check if everyone else is dead
          const alive = newAgents.filter((a) => a.isAlive);
          if (alive.length === 1 && !winner) {
            finalWinner = alive[0];
            newLogs.push({
              id: crypto.randomUUID(),
              tick: prev.tick + 1,
              message: `🏆 GAME OVER! ${finalWinner.name} is the last survivor!`,
              type: "win",
            });
          }

          return {
            ...prev,
            tick: prev.tick + 1,
            agents: newAgents,
            logs: [...prev.logs, ...newLogs], // Keep logs history
            winner: finalWinner,
            isRunning: !finalWinner, // Stop if winner found
          };
        });
      }, gameState.speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isRunning, gameState.speed, gameState.winner]);

  const togglePlay = () => {
    if (gameState.winner) return;
    setGameState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const changeSpeed = () => {
    setGameState((prev) => ({
      ...prev,
      speed: prev.speed === 1000 ? 500 : prev.speed === 500 ? 100 : 1000,
    }));
  };

  const selectedAgent =
    gameState.agents.find((a) => a.id === selectedAgentId) || null;

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <Home size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 text-black p-1 rounded font-bold text-xs">
              VISUAL
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">
              <span className="text-yellow-500">Cheater&apos;s</span> Dilemma
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={togglePlay}
              disabled={!!gameState.winner}
              className={`p-2 rounded hover:bg-slate-700 transition ${gameState.isRunning ? "text-yellow-400" : "text-green-400"} ${!!gameState.winner ? "opacity-50 cursor-not-allowed" : ""}`}
              title={gameState.isRunning ? "Pause" : "Play"}
            >
              {gameState.isRunning ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>
            <button
              onClick={changeSpeed}
              className="p-2 rounded hover:bg-slate-700 text-blue-400 transition"
              title="Toggle Speed"
            >
              <FastForward
                size={20}
                className={gameState.speed < 500 ? "text-white" : ""}
              />
            </button>
            <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>
            <button
              onClick={() => setShowInteractions(!showInteractions)}
              className={`p-2 rounded hover:bg-slate-700 transition ${showInteractions ? "text-yellow-400" : "text-slate-500"}`}
              title="Toggle Interaction Bubbles"
            >
              <MessageSquare size={20} />
            </button>
            <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>
            <button
              onClick={resetGame}
              className="p-2 rounded hover:bg-slate-700 text-red-400 transition"
              title="Reset Simulation"
            >
              <RotateCcw size={20} />
            </button>
          </div>
          <div className="font-mono text-sm text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
            TICK: <span className="text-white">{gameState.tick}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-4 flex gap-4">
        {/* Left Column: Game Board */}
        <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-lg border-2 border-slate-700 shadow-2xl relative">
          <VisualGameBoard
            agents={gameState.agents}
            onAgentClick={(a) => setSelectedAgentId(a.id)}
            selectedAgentId={selectedAgentId}
            showInteractions={showInteractions}
          />

          {/* Winner Overlay */}
          {gameState.winner && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fade-in backdrop-blur-sm rounded-xl">
              <Trophy
                size={64}
                className="text-yellow-400 mb-4 animate-bounce"
              />
              <h2 className="text-4xl font-bold text-white mb-2">VICTORY</h2>
              <p className="text-xl text-slate-300 mb-8">
                {gameState.winner.name} dominated the world!
              </p>
              <button
                onClick={resetGame}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition transform hover:scale-105"
              >
                Start New Simulation
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Stats & Logs */}
        <div className="w-96 flex flex-col gap-4 shrink-0">
          {/* Top Right: Agent Detail */}
          <div className="shrink-0">
            <VisualAgentCard agent={selectedAgent} />
          </div>

          {/* Middle Right: Leaderboard */}
          <div className="h-56 shrink-0">
            <VisualLeaderboard agents={gameState.agents} />
          </div>

          {/* Bottom Right: Event Log */}
          <div className="flex-1 min-h-0">
            <VisualEventLog logs={gameState.logs} />
          </div>
        </div>
      </main>
    </div>
  );
}
