from typing import List
from pydantic import BaseModel


class AgentSummary(BaseModel):
    agent_id: int
    strategy: str
    resources: int
    strength: int
    alive: bool
    trust: float
    aggression: float
    rank: int


class AgentDetail(AgentSummary):
    total_actions: int
    successful_actions: int
    failed_actions: int
    reputation_history: List[float]
    resource_history: List[int]