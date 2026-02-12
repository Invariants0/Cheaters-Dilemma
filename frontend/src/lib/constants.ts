// Game constants and strategy definitions

export const STRATEGIES = {
  CHEATER: "cheater",
  GREEDY: "greedy",
  POLITICIAN: "politician",
  WARLORD: "warlord",
} as const;

export const STRATEGY_COLORS: Record<string, string> = {
  [STRATEGIES.CHEATER]: "text-[#ff0055]", // Red
  [STRATEGIES.GREEDY]: "text-[#ffff00]", // Yellow
  [STRATEGIES.POLITICIAN]: "text-[#00d9ff]", // Light cyan
  [STRATEGIES.WARLORD]: "text-[#ff6600]", // Orange
};

export const STRATEGY_BG_COLORS: Record<string, string> = {
  [STRATEGIES.CHEATER]: "bg-[#ff0055]/20",
  [STRATEGIES.GREEDY]: "bg-[#ffff00]/20",
  [STRATEGIES.POLITICIAN]: "bg-[#00d9ff]/20",
  [STRATEGIES.WARLORD]: "bg-[#ff6600]/20",
};

export const STRATEGY_DESCRIPTIONS: Record<string, string> = {
  [STRATEGIES.CHEATER]: "Aggressive theft & rule manipulation",
  [STRATEGIES.GREEDY]: "Selective stealing, mostly honest",
  [STRATEGIES.POLITICIAN]: "Control governance & alliances",
  [STRATEGIES.WARLORD]: "Kill competitors, build strength",
};

export const ACTION_TYPES = {
  WORK: "work",
  STEAL: "steal",
  ATTACK: "attack",
  PROPOSE_RULE: "propose_rule",
  VOTE_RULE: "vote_rule",
} as const;

export const ACTION_LABELS: Record<string, string> = {
  [ACTION_TYPES.WORK]: "Work",
  [ACTION_TYPES.STEAL]: "Steal",
  [ACTION_TYPES.ATTACK]: "Attack",
  [ACTION_TYPES.PROPOSE_RULE]: "Propose Rule",
  [ACTION_TYPES.VOTE_RULE]: "Vote on Rule",
};

export const DEFAULT_AGENT_COUNT = 10;
export const DEFAULT_SEED = 42;
export const DEFAULT_MAX_TURNS = 500;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const TOAST_DURATION = 3000; // milliseconds
