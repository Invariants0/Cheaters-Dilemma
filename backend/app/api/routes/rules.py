from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException

from ..schemas.rules import Ruleset, RuleHistory

router = APIRouter()


@router.get("/", response_model=Ruleset)
async def get_current_rules(simulation_id: str) -> Ruleset:
    """Get current ruleset for a simulation"""
    # Mock data - in real implementation, get from simulation service
    return Ruleset(
        version=1,
        rules={
            "allow_steal": True,
            "allow_attack": True,
            "allow_proposals": True,
            "allow_votes": True,
            "work_income": [2, 4],
            "steal_min_resources": 1,
            "steal_amount": 3,
            "steal_success_base": 0.45,
            "steal_catch_prob": 0.25,
            "steal_catch_penalty": 2,
            "steal_fail_penalty": 1,
            "attack_cost": 8,
            "attack_success_base": 0.12,
            "attack_fail_penalty": 2,
            "attack_loot_ratio": 0.4
        }
    )


@router.get("/history", response_model=List[RuleHistory])
async def get_rules_history(simulation_id: str) -> List[RuleHistory]:
    """Get rules change history for a simulation"""
    # Mock data - in real implementation, get from simulation service
    return [
        RuleHistory(
            turn=0,
            version=1,
            change_type="initial",
            changed_by=None,
            key=None,
            old_value=None,
            new_value=None,
            description="Initial ruleset"
        )
    ]