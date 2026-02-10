from __future__ import annotations

from dataclasses import dataclass
from random import Random
from typing import Any

from engine.actions import Action, ActionType
from engine.agent import Agent, AgentObservation
from engine.governance import GovernanceSystem
from engine.logger import EventLogger
from engine.reputation import ReputationBook
from engine.resolver import ConflictResolver
from engine.rules import RuleSet


@dataclass
class AgentSlot:
    agent_id: int
    brain: Agent
    label: str


class World:
    def __init__(
        self,
        *,
        agents: list[Agent],
        rules: dict[str, Any],
        max_turns: int,
        seed: int,
        initial_resource_range: list[int],
        strength_range: list[int],
    ) -> None:
        self.seed = seed
        self.rng = Random(seed)
        self.max_turns = max_turns

        self.rule_set = RuleSet(values=rules)
        self.logger = EventLogger()
        self.reputation = ReputationBook()
        self.governance = GovernanceSystem(rules=self.rule_set)
        self.resolver = ConflictResolver(rules=self.rule_set)

        self.agent_slots: list[AgentSlot] = [
            AgentSlot(agent_id=i, brain=agent, label=agent.name) for i, agent in enumerate(agents)
        ]
        self.resources: dict[int, int] = {
            slot.agent_id: self.rng.randint(int(initial_resource_range[0]), int(initial_resource_range[1]))
            for slot in self.agent_slots
        }
        self.strength: dict[int, int] = {
            slot.agent_id: self.rng.randint(int(strength_range[0]), int(strength_range[1]))
            for slot in self.agent_slots
        }
        self.alive: set[int] = {slot.agent_id for slot in self.agent_slots}
        self.reputation.bootstrap(sorted(self.alive))

        self.action_counts: dict[str, int] = {kind.value: 0 for kind in ActionType}
        self.turns_completed: int = 0

    def _rank_of(self, agent_id: int) -> int:
        ordered = sorted(self.alive, key=lambda aid: (-self.resources[aid], aid))
        return ordered.index(agent_id) + 1

    def _observation_for(self, slot: AgentSlot, turn: int) -> AgentObservation:
        aid = slot.agent_id
        alive_ids = tuple(sorted(self.alive))
        return AgentObservation(
            turn=turn,
            self_id=aid,
            self_resources=self.resources[aid],
            self_strength=self.strength[aid],
            self_rank=self._rank_of(aid),
            alive_ids=alive_ids,
            resources_by_agent={i: self.resources[i] for i in alive_ids},
            strength_by_agent={i: self.strength[i] for i in alive_ids},
            trust_by_agent={i: self.reputation.trust[i] for i in alive_ids},
            aggression_by_agent={i: self.reputation.aggression[i] for i in alive_ids},
            current_rules=dict(self.rule_set.values),
            pending_proposal=dict(self.governance.pending) if self.governance.pending else None,
            last_harm_from=self.reputation.last_harm_from.get(aid),
        )

    def _validate_target(self, actor: int, target: int | None) -> tuple[bool, str]:
        if target is None:
            return False, "missing_target"
        if target == actor:
            return False, "self_target_not_allowed"
        if target not in self.alive:
            return False, "target_not_alive"
        return True, "target_valid"

    def _log_action(self, turn: int, action: Action, outcome: str, reason: str, details: dict[str, Any] | None = None) -> None:
        payload = dict(details or {})
        if action.actor in self.alive:
            payload["actor_rank"] = self._rank_of(action.actor)
        self.logger.log(
            turn=turn,
            actor=action.actor,
            action=action.kind.value,
            target=action.target,
            outcome=outcome,
            rule_justification=reason,
            details=payload,
        )

    def _try_governance_resolution(self, turn: int, force: bool = False) -> None:
        changed, status, proposal = self.governance.try_resolve(sorted(self.alive), turn, force=force)
        if not changed:
            return
        actor = int(proposal["actor"]) if proposal else -1
        self.logger.log(
            turn=turn,
            actor=actor,
            action="RULE_CHANGE" if status == "proposal_passed" else "RULE_VOTE_RESULT",
            target=None,
            outcome=status,
            rule_justification="simple_majority",
            details={
                "proposal": proposal,
                "rules_version": self.rule_set.version,
            },
        )

    def run(self) -> dict[str, Any]:
        for turn in range(1, self.max_turns + 1):
            if len(self.alive) <= 1:
                break

            for slot in self.agent_slots:
                actor = slot.agent_id
                if actor not in self.alive:
                    continue

                obs = self._observation_for(slot, turn)
                action = slot.brain.decide(obs, self.rng)
                self.action_counts[action.kind.value] += 1

                valid, reason = self.rule_set.validate_action(
                    action=action,
                    actor_state={"resources": self.resources[actor]},
                )
                if not valid:
                    self._log_action(turn, action, "blocked", reason)
                    continue

                if action.kind == ActionType.WORK:
                    outcome = self.resolver.resolve_work(actor, self.resources, self.rng)
                    self.reputation.record_work(actor)
                    self._log_action(turn, action, "success", reason, details=outcome)
                    continue

                if action.kind == ActionType.STEAL:
                    target_ok, target_reason = self._validate_target(actor, action.target)
                    if not target_ok:
                        self._log_action(turn, action, "blocked", target_reason)
                        continue
                    result = self.resolver.resolve_steal(
                        actor=actor,
                        target=int(action.target),
                        resources=self.resources,
                        strength=self.strength,
                        rng=self.rng,
                    )
                    self.reputation.record_steal(actor, int(action.target), bool(result["success"]))
                    status = "success" if result["success"] else "failed"
                    self._log_action(turn, action, status, reason, details=result)
                    continue

                if action.kind == ActionType.ATTACK:
                    target_ok, target_reason = self._validate_target(actor, action.target)
                    if not target_ok:
                        self._log_action(turn, action, "blocked", target_reason)
                        continue
                    result = self.resolver.resolve_attack(
                        actor=actor,
                        target=int(action.target),
                        resources=self.resources,
                        strength=self.strength,
                        alive=self.alive,
                        rng=self.rng,
                    )
                    self.reputation.record_attack(actor, int(action.target), bool(result["success"]))
                    status = "success" if result["success"] else "failed"
                    self._log_action(turn, action, status, reason, details=result)
                    continue

                if action.kind == ActionType.PROPOSE_RULE:
                    ok, proposal_reason = self.governance.propose(actor, action.payload, turn)
                    status = "accepted" if ok else "rejected"
                    proposal_id = self.governance.pending["proposal_id"] if ok and self.governance.pending else None
                    self._log_action(
                        turn,
                        action,
                        status,
                        reason,
                        details={"proposal_reason": proposal_reason, "proposal_id": proposal_id},
                    )
                    self._try_governance_resolution(turn, force=False)
                    continue

                if action.kind == ActionType.VOTE_RULE:
                    ok, vote_reason = self.governance.vote(actor, action.payload.get("vote", ""))
                    status = "accepted" if ok else "rejected"
                    self._log_action(turn, action, status, reason, details={"vote_reason": vote_reason})
                    self._try_governance_resolution(turn, force=False)
                    continue

                self._log_action(turn, action, "noop", reason)

            self._try_governance_resolution(turn, force=True)
            self.turns_completed = turn

        return self.snapshot()

    def snapshot(self) -> dict[str, Any]:
        leaderboard = sorted(
            (
                {
                    "agent_id": slot.agent_id,
                    "strategy": slot.label,
                    "resources": self.resources[slot.agent_id],
                    "strength": self.strength[slot.agent_id],
                    "alive": slot.agent_id in self.alive,
                    "trust": round(self.reputation.trust[slot.agent_id], 4),
                    "aggression": round(self.reputation.aggression[slot.agent_id], 4),
                }
                for slot in self.agent_slots
            ),
            key=lambda row: (-row["resources"], row["agent_id"]),
        )

        return {
            "seed": self.seed,
            "turns_completed": self.turns_completed,
            "rules_version": self.rule_set.version,
            "leaderboard": leaderboard,
            "alive": sorted(self.alive),
            "action_counts": dict(self.action_counts),
            "event_count": len(self.logger.events),
            "log_digest": self.logger.digest(),
            "events": self.logger.events,
        }
