"use client";

export function AgentCardSkeleton() {
  return (
    <div className="retro-panel mb-3 border-[#94a3b8] animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-6 w-12 bg-[#475569] rounded opacity-50" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#eab308] rounded opacity-50 w-24" />
          <div className="h-3 bg-[#94a3b8] rounded opacity-50 w-16" />
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <div className="h-3 bg-[#94a3b8] rounded opacity-50 w-16" />
          <div className="h-3 bg-[#eab308] rounded opacity-50 w-12" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-[#94a3b8] rounded opacity-50 w-16" />
          <div className="h-3 bg-[#eab308] rounded opacity-50 w-12" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-[#94a3b8] rounded opacity-50 w-16" />
          <div className="h-3 bg-[#eab308] rounded opacity-50 w-12" />
        </div>
      </div>
    </div>
  );
}

export function PanelSkeleton({ height = "h-32" }: { height?: string }) {
  return (
    <div className={`retro-panel ${height} animate-pulse`}>
      <div className="border-b-2 border-[#eab308] px-4 py-3 mb-3">
        <div className="h-4 bg-[#eab308] rounded opacity-50 w-24" />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-[#94a3b8] rounded opacity-50 w-full" />
        <div className="h-3 bg-[#94a3b8] rounded opacity-50 w-5/6" />
        <div className="h-3 bg-[#94a3b8] rounded opacity-50 w-4/6" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <AgentCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="retro-panel overflow-hidden animate-pulse">
      {/* Header */}
      <div className="border-b-2 border-[#eab308] px-4 py-3 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-[#eab308] rounded opacity-50" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="border-b border-[#eab308]/20 px-4 py-3 grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-[#94a3b8] rounded opacity-50 w-20" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  // Fixed heights to avoid purity violations
  const heights = [25, 45, 30, 55, 40, 35, 50, 28, 60, 32, 48, 38];

  return (
    <div className="retro-panel h-64 animate-pulse">
      <div className="border-b-2 border-[#eab308] px-4 py-3 mb-3">
        <div className="h-4 bg-[#eab308] rounded opacity-50 w-32" />
      </div>
      <div className="p-4 h-48 flex items-end justify-around gap-2">
        {heights.map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-[#eab308] rounded opacity-50"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

