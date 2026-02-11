"""
Domain outcomes for The Cheater's Dilemma simulation.
Defines how actions affect the world state.
"""

from __future__ import annotations
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from enum import Enum

from .models import Agent, WorldState


class ActionResult(Enum):
    """Result of an action execution."""
    SUCCESS = "success"
    FAILURE = "failure"
    BLOCKED = "blocked"
    INVALID = "invalid"


@dataclass
class ActionOutcome:
    """Result of executing an action."""
    action_type: str
    actor_id: int
    target_id: Optional[int]
    result: ActionResult
    resource_change: int = 0
    trust_change: float = 0.0
    aggression_change: float = 0.0
    rule_violation: bool = False
    rule_justification: str = ""
    details: Dict[str, Any] = None

    def __post_init__(self):
        if self.details is None:
            self.details = {}


class OutcomeCalculator:
    """Calculates outcomes of actions on the world state."""

    @staticmethod
    def apply_cheat_outcome(world: WorldState, actor: Agent, target: Optional[Agent]) -> ActionOutcome:
        """Apply the outcome of a cheat action."""
        if not target:
            return ActionOutcome(
                action_type="cheat",
                actor_id=actor.agent_id,
                target_id=None,
                result=ActionResult.INVALID,
                rule_justification="Cheat action requires a target"
            )

        # Cheater gains resources but loses trust
        resource_gain = min(target.resources // 4, 50)  # Steal up to 25% or 50 max
        trust_loss = 0.2

        return ActionOutcome(
            action_type="cheat",
            actor_id=actor.agent_id,
            target_id=target.agent_id,
            result=ActionResult.SUCCESS,
            resource_change=resource_gain,
            trust_change=-trust_loss,
            rule_violation=True,
            rule_justification="Direct resource theft violates cooperation rules",
            details={"stolen_amount": resource_gain}
        )

    @staticmethod
    def apply_honest_play_outcome(world: WorldState, actor: Agent, target: Optional[Agent]) -> ActionOutcome:
        """Apply the outcome of an honest play action."""
        # Honest play gives small resource gain and trust boost
        resource_gain = 10
        trust_gain = 0.1

        return ActionOutcome(
            action_type="honest_play",
            actor_id=actor.agent_id,
            target_id=None,
            result=ActionResult.SUCCESS,
            resource_change=resource_gain,
            trust_change=trust_gain,
            rule_justification="Honest cooperation rewarded"
        )

    @staticmethod
    def apply_attack_outcome(world: WorldState, actor: Agent, target: Agent) -> ActionOutcome:
        """Apply the outcome of an attack action."""
        if actor.strength <= target.strength:
            # Attack fails
            return ActionOutcome(
                action_type="attack",
                actor_id=actor.agent_id,
                target_id=target.agent_id,
                result=ActionResult.FAILURE,
                aggression_change=0.1,
                rule_justification="Insufficient strength for attack"
            )

        # Attack succeeds - target dies, attacker gains resources
        resource_gain = target.resources // 2
        aggression_gain = 0.2

        return ActionOutcome(
            action_type="attack",
            actor_id=actor.agent_id,
            target_id=target.agent_id,
            result=ActionResult.SUCCESS,
            resource_change=resource_gain,
            aggression_change=aggression_gain,
            rule_violation=True,
            rule_justification="Violent attack violates non-aggression rules",
            details={"target_killed": True, "resources_gained": resource_gain}
        )

    @staticmethod
    def apply_propose_rule_outcome(world: WorldState, actor: Agent, rule_proposal: Dict[str, Any]) -> ActionOutcome:
        """Apply the outcome of a rule proposal action."""
        # Rule proposals cost resources but can improve governance
        resource_cost = 20

        if actor.resources < resource_cost:
            return ActionOutcome(
                action_type="propose_rule",
                actor_id=actor.agent_id,
                target_id=None,
                result=ActionResult.BLOCKED,
                rule_justification="Insufficient resources for rule proposal"
            )

        return ActionOutcome(
            action_type="propose_rule",
            actor_id=actor.agent_id,
            target_id=None,
            result=ActionResult.SUCCESS,
            resource_change=-resource_cost,
            trust_change=0.05,  # Small trust gain for governance participation
            rule_justification="Rule proposal submitted for voting",
            details={"proposed_rule": rule_proposal}
        )

    @staticmethod
    def apply_vote_outcome(world: WorldState, actor: Agent, vote: bool, rule_id: str) -> ActionOutcome:
        """Apply the outcome of a voting action."""
        # Voting is free but affects reputation
        trust_change = 0.02 if vote else -0.01  # Small reward for participation

        return ActionOutcome(
            action_type="vote",
            actor_id=actor.agent_id,
            target_id=None,
            result=ActionResult.SUCCESS,
            trust_change=trust_change,
            rule_justification=f"Vote {'approved' if vote else 'rejected'} for rule {rule_id}",
            details={"rule_id": rule_id, "vote": vote}
        )