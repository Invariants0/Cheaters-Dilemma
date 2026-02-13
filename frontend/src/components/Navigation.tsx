"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "HOME", icon: "[H]" },
    { href: "/simulation", label: "SIMULATION", icon: "[SIM]" },
    { href: "/agents", label: "AGENTS", icon: "[AG]" },
    { href: "/rules", label: "RULES", icon: "[RL]" },
    { href: "/replays", label: "REPLAYS", icon: "[RP]" },
  ];

  return (
    <nav className="bg-[#0a0e27] border-b-2 border-[#00ffff] p-4 flex items-center justify-between scanlines">
      <Link href="/" className="text-xl font-bold text-[#00ffff] glitch" data-text="CHEATER'S DILEMMA">
        CHEATER&apos;S DILEMMA
      </Link>
      <div className="flex gap-2">
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
    </nav>
  );
}
