// Utility functions

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}

/**
 * Get contrast color for readability
 */
export function getContrastColor(bgColor: string): "light" | "dark" {
  // Simple heuristic: if background is dark, use light text
  if (bgColor.includes("0a0e27") || bgColor.includes("0f1629")) {
    return "light";
  }
  return "dark";
}

/**
 * Delay execution
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calculate Gini coefficient from values
 */
export function calculateGini(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;

  if (mean === 0) return 0;

  let sum = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      sum += Math.abs(sorted[i] - sorted[j]);
    }
  }

  return sum / (2 * n * n * mean);
}

/**
 * Round to specified decimals
 */
export function round(value: number, decimals = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate URL params from object
 */
export function generateQueryParams(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
}

/**
 * Parse simulation ID from URL or storage
 */
export function getActiveSimulationId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("activeSimulationId");
}

/**
 * Save simulation ID to storage
 */
export function setActiveSimulationId(id: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("activeSimulationId", id);
  }
}

/**
 * Clear simulation ID from storage
 */
export function clearActiveSimulationId(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("activeSimulationId");
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Get agent rank by resources
 */
export function getRank(agents: Array<{ resources: number }>, index: number): number {
  const sorted = [...agents].sort((a, b) => b.resources - a.resources);
  return sorted.findIndex((a) => a === agents[index]) + 1;
}
