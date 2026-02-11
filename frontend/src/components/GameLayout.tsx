import { ReactNode } from "react";

interface GameLayoutProps {
  children: ReactNode;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  topBar?: ReactNode;
  centerContent?: ReactNode;
}

export function GameLayout({
  children,
  leftPanel,
  rightPanel,
  topBar,
  centerContent,
}: GameLayoutProps) {
  return (
    <div className="w-full h-screen bg-[#0a0e27] overflow-hidden flex flex-col">
      {/* Top Bar */}
      {topBar && (
        <div className="border-b-2 border-[#00ffff] bg-[#0f1629] p-3 flex items-center justify-between scanlines">
          {topBar}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden gap-2 p-2">
        {/* Left Panel */}
        {leftPanel && (
          <div className="w-64 flex flex-col gap-2 overflow-y-auto">{leftPanel}</div>
        )}

        {/* Center World/Canvas Area */}
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

        {/* Right Panel */}
        {rightPanel && (
          <div className="w-80 flex flex-col gap-2 overflow-y-auto">{rightPanel}</div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t-2 border-[#00ffff] bg-[#0f1629] px-4 py-2 text-xs font-mono text-[#00d9ff] flex justify-between scanlines">
        <div>&gt; STATUS: READY &lt;</div>
        <div>&gt; TICK: 0000 &lt;</div>
        <div>&gt; CYCLE: DAY &lt;</div>
      </div>
    </div>
  );
}

export function TopBar() {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-[#00ffff] glitch" data-text="THE CHEATER'S DILEMMA">
          THE CHEATER&apos;S DILEMMA
        </div>
      </div>
      <div className="flex gap-4 text-xs font-mono">
        <div>
          <span className="text-[#ff00ff]">AGENTS:</span> <span className="text-[#00ffff]">10</span>
        </div>
        <div>
          <span className="text-[#ff00ff]">SEED:</span> <span className="text-[#00ffff]">42</span>
        </div>
        <div>
          <span className="text-[#ff00ff]">GINI:</span> <span className="text-[#00ffff]">0.234</span>
        </div>
      </div>
    </>
  );
}
