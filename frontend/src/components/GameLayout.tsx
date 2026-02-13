"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface GameLayoutProps {
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  topBar?: ReactNode;
  centerContent?: ReactNode;
}

export function GameLayout({
  leftPanel,
  rightPanel,
  topBar,
  centerContent,
}: GameLayoutProps) {
  return (
    <div className="w-screen h-screen bg-[#0a0e27] overflow-hidden flex flex-col fixed inset-0">
      {topBar && (
        <div className="border-b-2 border-[#00ffff] bg-[#0f1629] p-3 flex items-center justify-between scanlines z-10">
          {topBar}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden gap-2 p-2">
        {leftPanel && <div className="w-64 flex flex-col gap-2 overflow-y-auto">{leftPanel}</div>}

        <div className="flex-1 retro-panel relative overflow-hidden">
          {centerContent ? (
            centerContent
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#00d9ff] font-mono text-center">
              <div>
                <div className="text-2xl font-bold text-[#00ffff] mb-4">&gt; WORLD VISUALIZATION &lt;</div>
                <div className="text-sm opacity-50">[ Beautiful game world will render here ]</div>
              </div>
            </div>
          )}
        </div>

        {rightPanel && <div className="w-80 flex flex-col gap-2 overflow-y-auto">{rightPanel}</div>}
      </div>

      <div className="border-t-2 border-[#00ffff] bg-[#0f1629] px-4 py-2 text-xs font-mono text-[#00d9ff] flex justify-between scanlines z-10">
        <div>&gt; STATUS: READY &lt;</div>
        <div>&gt; TICK: 0000 &lt;</div>
        <div>&gt; CYCLE: DAY &lt;</div>
      </div>
    </div>
  );
}

export function TopBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "HOME", icon: "[H]" },
    { href: "/simulation", label: "SIMULATION", icon: "[SIM]" },
    { href: "/agents", label: "AGENTS", icon: "[AG]" },
    { href: "/rules", label: "RULES", icon: "[RL]" },
    { href: "/replays", label: "REPLAYS", icon: "[RP]" },
  ];

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-[#00ffff] glitch" data-text="CHEATER'S DILEMMA">
          CHEATER&apos;S DILEMMA
        </div>
        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 text-xs font-mono border transition-all duration-200 ${
                pathname === item.href
                  ? "border-[#ff00ff] bg-[#ff00ff]/20 text-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
                  : "border-[#00d9ff] text-[#00d9ff] hover:border-[#ff00ff] hover:text-[#ff00ff] hover:shadow-[0_0_5px_#ff00ff]"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-xs font-mono">
        <div>
          <span className="text-[#ff00ff]">&gt; AGENTS:</span> <span className="text-[#00ffff]">10</span>
        </div>
        <div>
          <span className="text-[#ff00ff]">&gt; SEED:</span> <span className="text-[#00ffff]">42</span>
        </div>
        <div>
          <span className="text-[#ff00ff]">&gt; GINI:</span> <span className="text-[#00ffff]">0.234</span>
        </div>
      </div>
    </>
  );
}
