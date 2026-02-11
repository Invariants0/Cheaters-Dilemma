from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class SimulationStartRequest(BaseModel):
    agent_count: int
    seed: int
    turns: Optional[int] = None


class SimulationStepRequest(BaseModel):
    steps: int = 1


class AgentState(BaseModel):
    agent_id: int
    strategy: str
    resources: int
    strength: int
    alive: bool
    trust: float
    aggression: float


class SimulationState(BaseModel):
    simulation_id: str
    current_turn: int
    agents: List[AgentState]
    rules: int  # rules version
    alive_count: int
    event_count: int


class SimulationEvent(BaseModel):
    turn: int
    actor: int
    action: str
    target: Optional[int]
    outcome: str
    rule_justification: str
    details: Dict[str, Any]


class SimulationEvents(BaseModel):
    simulation_id: str
    events: List[SimulationEvent]
    total_events: int


class SimulationSummary(BaseModel):
    simulation_id: str
    seed: int
    turns_completed: int
    leaderboard: List[AgentState]
    action_counts: Dict[str, int]
    log_digest: str
    rules_version: int