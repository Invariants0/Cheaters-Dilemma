// TypeScript types matching backend Pydantic schemas

export interface AgentSummary {
  agent_id: number;
  strategy: string;
  resources: number;
  strength: number;
  alive: boolean;
  trust: number;
  aggression: number;
  rank: number;
}

export interface AgentDetail extends AgentSummary {
  total_actions: number;
  successful_actions: number;
  failed_actions: number;
  reputation_history: number[];
  resource_history: number[];
}

export interface SimulationState {
  simulation_id: string;
  current_turn: number;
  agents: AgentSummary[];
  rules: number;
  alive_count: number;
  event_count: number;
}

export interface SimulationEvent {
  turn: number;
  actor: number;
  action: string;
  target: number | null;
  outcome: string;
  rule_justification: string;
  details: Record<string, any>;
}

export interface SimulationEvents {
  simulation_id: string;
  events: SimulationEvent[];
  total_events: number;
}

export interface SimulationSummary {
  simulation_id: string;
  seed: number;
  turns_completed: number;
  leaderboard: AgentSummary[];
  action_counts: Record<string, number>;
  log_digest: string;
  rules_version: number;
}

export interface Ruleset {
  version: number;
  rules: Record<string, any>;
}

export interface RuleHistory {
  turn: number;
  version: number;
  change_type: string;
  changed_by: number | null;
  key: string | null;
  old_value: any;
  new_value: any;
  description: string;
}

export interface ReplaySummary {
  replay_id: string;
  seed: number;
  agent_count: number;
  turns_completed: number;
  winner_strategy: string;
  winner_resources: number;
  created_at: string;
}

export interface ReplayDetail {
  replay_id: string;
  seed: number;
  agent_count: number;
  turns_completed: number;
  leaderboard: Record<string, any>[];
  events: Record<string, any>[];
  log_digest: string;
}