const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function toSocketBaseUrl(url: string): string {
  const normalized = normalizeBaseUrl(url);
  if (normalized.startsWith("wss://") || normalized.startsWith("ws://")) {
    return normalized;
  }
  if (normalized.startsWith("https://")) {
    return `wss://${normalized.slice("https://".length)}`;
  }
  if (normalized.startsWith("http://")) {
    return `ws://${normalized.slice("http://".length)}`;
  }
  return `ws://${normalized}`;
}

export function getSimulationHealthSocketUrl(): string {
  return `${toSocketBaseUrl(API_BASE_URL)}/simulation/ws/health`;
}

export function getSimulationStreamSocketUrl(
  simulationId: string,
  intervalMs: number = 250,
  fromTurn: number = 1
): string {
  const params = new URLSearchParams({
    interval_ms: String(intervalMs),
    from_turn: String(fromTurn),
  });
  return `${toSocketBaseUrl(API_BASE_URL)}/simulation/ws/stream/${simulationId}?${params.toString()}`;
}
