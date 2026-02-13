import { ReactNode } from "react";
import { GameButtonProps, StatDisplayProps, AgentCardProps, EventLogEntry, EventLogProps } from "@/lib/types";

interface GamePanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
  neon?: boolean;
}

export function GamePanel({ title, children, className = "", neon = false }: GamePanelProps) {
  return (
    <div className={`retro-panel ${neon ? "border-yellow-500" : ""} ${className}`}>
      {title && (
        <div className="border-b-2 border-slate-700 px-4 py-3 mb-3">
          <h3 className="retro-subtitle uppercase font-bold tracking-widest text-slate-200">
            [ {title} ]
          </h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function GameButton({ children, className = "", onClick, disabled = false }: GameButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`retro-button ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      &gt; {children} &lt;
    </button>
  );
}

export function StatDisplay({ label, value, unit = "", className = "" }: StatDisplayProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="stat-label mb-1">{label}</div>
      <div className="stat-value">
        {value} <span className="text-sm text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

export function AgentCard({ agent, rank }: AgentCardProps) {
  return (
    <div className="retro-panel mb-3 border-slate-600 hover:border-slate-500">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-lg font-bold text-yellow-500">#{rank}</div>
        <div className="flex-1">
          <div className="font-bold text-white">{agent.name || `Agent ${agent.id}`}</div>
          <div className="text-xs text-slate-400">{agent.type || "agent"}</div>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">RESOURCE:</span>
          <span className="text-white font-bold">{agent.resources || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">STRENGTH:</span>
          <span className="text-white font-bold">{agent.strength || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">TRUST:</span>
          <span className="text-white font-bold">
            {typeof agent.trust === "number" ? agent.trust.toFixed(2) : agent.trust}
          </span>
        </div>
      </div>
    </div>
  );
}

export function EventLog({ events, maxHeight = "h-64" }: EventLogProps) {
  return (
    <div className={`retro-panel ${maxHeight} overflow-y-auto`}>
      {events && events.length > 0 ? (
        <div className="space-y-2 text-xs font-mono">
          {events.map((event: EventLogEntry, idx: number) => (
            <div key={idx} className="text-slate-300 border-l-2 border-yellow-500 pl-2 py-1">
              <span className="text-yellow-500">[{event.turn || "?"}]</span> {event.message || event.type}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-slate-500 opacity-50 text-center py-8">
          &gt; NO EVENTS &lt;
        </div>
      )}
    </div>
  );
}
