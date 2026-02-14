from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .rules import RuleSet


@dataclass
class GovernanceSystem:
    rules: RuleSet
    pending: dict[str, Any] | None = None
    votes: dict[int, str] = field(default_factory=dict)
    proposal_counter: int = 0

    def propose(self, actor: int, payload: dict[str, Any], turn: int) -> tuple[bool, str]:
        if self.pending is not None:
            return False, "proposal_already_pending"
        self.proposal_counter += 1
        self.pending = {
            "proposal_id": self.proposal_counter,
            "actor": actor,
            "turn": turn,
            "key": payload.get("key"),
            "value": payload.get("value"),
        }
        self.votes.clear()
        return True, "proposal_registered"

    def vote(self, actor: int, vote: str) -> tuple[bool, str]:
        if self.pending is None:
            return False, "no_pending_proposal"
        self.votes[actor] = vote
        return True, "vote_recorded"

    def try_resolve(self, alive_ids: list[int], turn: int, force: bool = False, token_balances: dict[int, int] = None) -> tuple[bool, str, dict[str, Any] | None]:
        if self.pending is None:
            return False, "no_pending_proposal", None

        if token_balances is None:
            token_balances = {}
        
        total_alive = len(alive_ids)
        if total_alive == 0:
            return False, "no_alive_agents", None

        # Calculate total token supply of alive agents
        total_token_supply = sum(token_balances.get(aid, 0) for aid in alive_ids)
        
        # Calculate YES and NO vote weights
        yes_vote_weight = sum(token_balances.get(aid, 0) for aid in alive_ids if self.votes.get(aid) == "yes")
        no_vote_weight = sum(token_balances.get(aid, 0) for aid in alive_ids if self.votes.get(aid) == "no")
        
        # Proposal passes if YES votes exceed 50% of total token supply
        passed = yes_vote_weight > (total_token_supply / 2)
        failed = no_vote_weight >= (total_token_supply / 2) or (yes_vote_weight + (total_token_supply - yes_vote_weight - no_vote_weight)) <= (total_token_supply / 2)

        if not force and not passed and not failed:
            return False, "awaiting_votes", None

        proposal = self.pending
        self.pending = None
        self.votes.clear()

        if not passed:
            return True, "proposal_rejected", proposal

        ok, reason = self.rules.apply_mutation(
            proposal=proposal,
            by_agent=int(proposal["actor"]),
            turn=turn,
        )
        if ok:
            return True, "proposal_passed", proposal
        return True, f"proposal_passed_but_mutation_failed:{reason}", proposal
