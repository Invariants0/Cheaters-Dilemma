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
        className="w-full px-4 py-2 bg-[#0f1419] border-2 border-[#94a3b8] text-[#eab308] font-mono text-sm placeholder-[#94a3b8] placeholder-opacity-50 focus:outline-none focus:border-[#475569] focus:shadow-[0_0_10px_#475569]"
        {...props}
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] opacity-50">🔍</span>
    </div>
  );
}

