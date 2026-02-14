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
    <div className="w-screen h-screen bg-slate-950 overflow-hidden flex flex-col fixed inset-0">
      {topBar && (
        <div className="border-b border-slate-700 bg-slate-900/50 px-6 py-4 flex items-center justify-between scanlines z-10">
          {topBar}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden gap-0">
        {leftPanel && (
          <div className="w-64 flex flex-col gap-2 overflow-y-auto border-r border-slate-700 p-2">
            {leftPanel}
          </div>
        )}

        <div className="flex-1 bg-slate-950 relative overflow-hidden">
          {centerContent ? (
            centerContent
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-500 mb-4 font-pixel">
                  &gt; SIMULATION AREA &lt;
                </div>
                <div className="text-sm opacity-50 font-mono">
                  &gt; WAITING FOR INPUT &lt;
                </div>
              </div>
            </div>
          )}
        </div>

        {rightPanel && (
          <div className="w-80 flex flex-col gap-2 overflow-y-auto border-l border-slate-700 p-2">
            {rightPanel}
          </div>
        )}
      </div>

      <div className="border-t border-slate-700 bg-slate-900/50 px-6 py-2 text-xs font-mono text-slate-400 flex justify-between scanlines z-10">
        <div>&gt; SYSTEM READY &lt;</div>
        <div>&gt; VERSION 1.0.4 &lt;</div>
      </div>
    </div>
  );
}

export function TopBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/simulation", label: "SIMULATION" },
    { href: "/agents", label: "AGENTS" },
    { href: "/rules", label: "RULES" },
    { href: "/replays", label: "REPLAYS" },
  ];

  return (
    <>
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold text-yellow-500 font-pixel tracking-tight">
          THE CHEATER&apos;S DILEMMA
        </div>
        <div className="flex gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1 text-xs font-mono border transition-all duration-200 rounded-sm ${
                pathname === item.href
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                  : "border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-300"
              }`}
            >
              [ {item.label} ]
            </Link>
          ))}
        </div>
      </div>
      <div className="flex gap-6 text-xs font-mono text-slate-500">
        <div>
          <span className="text-slate-300">&gt; STATUS:</span>{" "}
          <span className="text-green-400 animate-pulse">ONLINE</span>
        </div>
      </div>
    </>
  );
}

