"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const typeColors: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: {
    bg: "bg-[#1a1f2e]",
    border: "border-[#00ff00]",
    text: "text-[#00ff00]",
  },
  error: {
    bg: "bg-[#1a1f2e]",
    border: "border-[#ff0055]",
    text: "text-[#ff0055]",
  },
  info: {
    bg: "bg-[#1a1f2e]",
    border: "border-[#94a3b8]",
    text: "text-[#94a3b8]",
  },
  warning: {
    bg: "bg-[#1a1f2e]",
    border: "border-[#ffff00]",
    text: "text-[#ffff00]",
  },
};

export function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
  const colors = typeColors[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={`${colors.bg} border-2 ${colors.border} p-4 rounded max-w-sm font-mono text-sm animate-pulse`}
      role="alert"
    >
      <div className={`${colors.text} flex items-center gap-2`}>
        <span className="font-bold">
          {type === "success" && "✓"}
          {type === "error" && "✗"}
          {type === "info" && "ℹ"}
          {type === "warning" && "⚠"}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}

