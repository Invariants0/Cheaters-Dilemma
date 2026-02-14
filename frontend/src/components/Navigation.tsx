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
    <nav className="bg-[#0f1419] border-b-2 border-[#eab308] p-4 flex items-center justify-between scanlines">
      <Link href="/" className="text-xl font-bold text-[#eab308] glitch" data-text="CHEATER'S DILEMMA">
        CHEATER&apos;S DILEMMA
      </Link>
      <div className="flex gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1 text-xs font-mono border transition-all duration-200 ${
              pathname === item.href
                ? "border-[#475569] bg-[#475569]/20 text-[#475569] shadow-[0_0_10px_#475569]"
                : "border-[#94a3b8] text-[#94a3b8] hover:border-[#475569] hover:text-[#475569] hover:shadow-[0_0_5px_#475569]"
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

