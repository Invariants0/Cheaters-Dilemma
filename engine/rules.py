from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from engine.actions import Action, ActionType


@dataclass
class RuleSet:
    values: dict[str, Any]
    version: int = 1
    history: list[dict[str, Any]] = field(default_factory=list)

    def validate_action(self, action: Action, actor_state: dict[str, Any]) -> tuple[bool, str]:
        if action.kind == ActionType.WORK:
            return True, "work_always_allowed"

        if action.kind == ActionType.DO_NOTHING:
            return True, "idle_allowed"

        if action.kind == ActionType.STEAL:
            if not self.values.get("allow_steal", True):
                return False, "rule_disallows_steal"
            if action.target is None:
                return False, "steal_requires_target"
            if actor_state["resources"] < int(self.values.get("steal_min_resources", 0)):
                return False, "insufficient_resources_for_steal"
            return True, "steal_allowed_by_rules"

        if action.kind == ActionType.ATTACK:
            if not self.values.get("allow_attack", True):
                return False, "rule_disallows_attack"
            if action.target is None:
                return False, "attack_requires_target"
            cost = int(self.values.get("attack_cost", 0))
            if actor_state["resources"] < cost:
                return False, "insufficient_resources_for_attack"
            return True, "attack_allowed_by_rules"

        if action.kind == ActionType.PROPOSE_RULE:
            if not self.values.get("allow_proposals", True):
                return False, "rule_disallows_proposals"
            if not action.payload:
                return False, "proposal_payload_required"
            key = action.payload.get("key")
            if key not in set(self.values.get("mutable_keys", [])):
                return False, "proposal_key_not_mutable"
            return True, "proposal_allowed"

        if action.kind == ActionType.VOTE_RULE:
            if not self.values.get("allow_votes", True):
                return False, "rule_disallows_voting"
            vote = action.payload.get("vote")
            if vote not in {"yes", "no"}:
                return False, "vote_must_be_yes_or_no"
            return True, "vote_allowed"

        return False, "unknown_action"

    def apply_mutation(self, proposal: dict[str, Any], by_agent: int, turn: int) -> tuple[bool, str]:
        key = proposal.get("key")
        value = proposal.get("value")
        mutable_keys = set(self.values.get("mutable_keys", []))
        if key not in mutable_keys:
            return False, "key_not_mutable"

        min_max = self.values.get("key_ranges", {}).get(key)
        if isinstance(min_max, dict) and isinstance(value, (int, float)):
            if value < min_max.get("min", value) or value > min_max.get("max", value):
                return False, "value_out_of_range"

        self.values[key] = value
        self.version += 1
        self.history.append(
            {
                "turn": turn,
                "by": by_agent,
                "version": self.version,
                "key": key,
                "value": value,
            }
        )
        return True, "rule_updated"
