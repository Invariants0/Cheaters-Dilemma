from __future__ import annotations

from ..domain.actions import Action, ActionType
from ..domain.agent import Agent, AgentObservation


class GreedyAgent(Agent):
    name = "greedy"

    def decide(self, obs: AgentObservation, rng) -> Action:
        if obs.pending_proposal is not None:
            key = obs.pending_proposal.get("key")
            value = obs.pending_proposal.get("value")
            if key == "work_income" and isinstance(value, list) and value[-1] >= obs.current_rules["work_income"][-1]:
                return Action(actor=obs.self_id, kind=ActionType.VOTE_RULE, payload={"vote": "yes"})
            if key in {"steal_amount", "attack_cost"}:
                return Action(actor=obs.self_id, kind=ActionType.VOTE_RULE, payload={"vote": "no"})
            return Action(actor=obs.self_id, kind=ActionType.VOTE_RULE, payload={"vote": "yes"})

        others = [aid for aid in obs.alive_ids if aid != obs.self_id]
        if not others:
            return Action(actor=obs.self_id, kind=ActionType.WORK)

        richest = max(others, key=lambda aid: obs.resources_by_agent[aid])
        if (
            obs.resources_by_agent[richest] > obs.self_resources + 2
            and obs.self_resources >= obs.current_rules.get("steal_min_resources", 0)
            and rng.random() < 0.35
        ):
            return Action(actor=obs.self_id, kind=ActionType.STEAL, target=richest)

        if rng.random() < 0.05:
            return Action(
                actor=obs.self_id,
                kind=ActionType.PROPOSE_RULE,
                payload={"key": "work_income", "value": [3, 5]},
            )

        return Action(actor=obs.self_id, kind=ActionType.WORK)
