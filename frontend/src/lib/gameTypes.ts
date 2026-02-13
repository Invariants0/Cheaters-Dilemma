export interface Position {
  x: number;
  y: number;
}

export enum AgentStrategy {
  HONEST = "HONEST",
  AGGRESSIVE = "AGGRESSIVE",
  DECEPTIVE = "DECEPTIVE",
  CHAOTIC = "CHAOTIC",
}

export enum ActionType {
  MOVE = "MOVE",
  GATHER = "GATHER",
  STEAL = "STEAL",
  ATTACK = "ATTACK",
  HEAL = "HEAL",
  IDLE = "IDLE",
}

export interface GameAgent {
  id: string;
  name: string;
  avatarSeed: string;
  position: Position;
  score: number;
  health: number;
  strength: number; // Modifies attack damage
  defense: number; // Modifies defense chance
  reputation: number; // 0-100, affects likelyhood of being targeted
  strategy: AgentStrategy;
  isAlive: boolean;
  kills: number;
  lastAction: ActionType;
  lastActionTarget?: string; // Name of target
  lastActionDetails?: string; // Short description of result (e.g., "-5 HP", "Miss")
}

export interface GameLog {
  id: string;
  tick: number;
  message: string;
  type: "info" | "combat" | "death" | "win" | "cheat";
}

export interface VisualGameState {
  tick: number;
  isRunning: boolean;
  winner: GameAgent | null;
  agents: GameAgent[];
  logs: GameLog[];
  speed: number;
}
