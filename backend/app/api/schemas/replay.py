from typing import Any, Dict, List
from pydantic import BaseModel


class ReplaySummary(BaseModel):
    replay_id: str
    seed: int
    agent_count: int
    turns_completed: int
    winner_strategy: str
    winner_resources: int
    created_at: str


class ReplayDetail(BaseModel):
    replay_id: str
    seed: int
    agent_count: int
    turns_completed: int
    leaderboard: List[Dict[str, Any]]
    events: List[Dict[str, Any]]
    log_digest: str