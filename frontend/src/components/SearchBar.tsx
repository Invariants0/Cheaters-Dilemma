"use client";

import { InputHTMLAttributes } from "react";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "SEARCH...", ...props }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-full px-4 py-2 bg-[#0a0e27] border-2 border-[#00d9ff] text-[#00ffff] font-mono text-sm placeholder-[#00d9ff] placeholder-opacity-50 focus:outline-none focus:border-[#ff00ff] focus:shadow-[0_0_10px_#ff00ff]"
        {...props}
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#00d9ff] opacity-50">🔍</span>
    </div>
  );
}
