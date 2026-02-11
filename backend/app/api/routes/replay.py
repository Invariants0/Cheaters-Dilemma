from typing import List
from fastapi import APIRouter, HTTPException

from ..schemas.replay import ReplaySummary, ReplayDetail

router = APIRouter()


@router.get("/", response_model=List[ReplaySummary])
async def get_replays() -> List[ReplaySummary]:
    """Get list of completed simulations"""
    # Mock data - in real implementation, get from database/storage
    return [
        ReplaySummary(
            replay_id="sim-001",
            seed=42,
            agent_count=10,
            turns_completed=500,
            winner_strategy="cheater",
            winner_resources=67,
            created_at="2024-02-11T10:00:00Z"
        ),
        ReplaySummary(
            replay_id="sim-002",
            seed=123,
            agent_count=15,
            turns_completed=350,
            winner_strategy="politician",
            winner_resources=89,
            created_at="2024-02-11T10:30:00Z"
        )
    ]


@router.get("/{replay_id}", response_model=ReplayDetail)
async def get_replay_detail(replay_id: str) -> ReplayDetail:
    """Get detailed replay data for playback"""
    # Mock data - in real implementation, load from storage
    return ReplayDetail(
        replay_id=replay_id,
        seed=42,
        agent_count=10,
        turns_completed=500,
        leaderboard=[
            {
                "agent_id": 0,
                "strategy": "cheater",
                "resources": 67,
                "strength": 9,
                "alive": True,
                "trust": 0.2,
                "aggression": 0.9
            }
        ],
        events=[
            {
                "turn": 1,
                "actor": 0,
                "action": "WORK",
                "target": None,
                "outcome": "success",
                "rule_justification": "work_always_allowed",
                "details": {"gain": 3}
            }
        ],
        log_digest="abc123..."
    )