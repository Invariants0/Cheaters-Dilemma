"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps {
  options: DropdownOption[];
  onSelect: (value: string | number) => void;
  label?: string;
  defaultValue?: string | number;
}

export function Dropdown({
  options,
  onSelect,
  label = "SELECT",
  defaultValue,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>(
    options.find((o) => o.value === defaultValue) || null,
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-600 text-slate-300 font-mono text-sm flex justify-between items-center hover:border-slate-500 hover:bg-slate-800 transition-all rounded-sm"
      >
        <span>{selected?.label || label}</span>
        <span className="text-slate-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border-2 border-slate-600 z-50 max-h-64 overflow-y-auto rounded-sm">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-2 text-slate-300 font-mono text-sm hover:bg-slate-800 hover:text-white border-b border-slate-700/50 last:border-b-0 transition-colors"
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-slate-500 text-center text-sm">
              No options
            </div>
          )}
        </div>
      )}
    </div>
  );
}

