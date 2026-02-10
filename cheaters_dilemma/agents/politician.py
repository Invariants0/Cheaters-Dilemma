from __future__ import annotations

from cheaters_dilemma.engine.actions import Action, ActionType
from cheaters_dilemma.engine.agent import Agent, AgentObservation


class PoliticianAgent(Agent):
    name = "politician"

    def decide(self, obs: AgentObservation, rng) -> Action:
        if obs.pending_proposal is not None:
            proposer = int(obs.pending_proposal.get("actor", -1))
            proposer_trust = obs.trust_by_agent.get(proposer, 0.5)
            proposer_aggr = obs.aggression_by_agent.get(proposer, 0.0)
            support = proposer_trust - 0.4 * proposer_aggr
            if support > 0.3:
                return Action(actor=obs.self_id, kind=ActionType.VOTE_RULE, payload={"vote": "yes"})
            return Action(actor=obs.self_id, kind=ActionType.VOTE_RULE, payload={"vote": "no"})

        if rng.random() < 0.2:
            if obs.self_rank > len(obs.alive_ids) // 2:
                return Action(
                    actor=obs.self_id,
                    kind=ActionType.PROPOSE_RULE,
                    payload={"key": "steal_catch_penalty", "value": min(5, int(obs.current_rules.get("steal_catch_penalty", 2)) + 1)},
                )
            return Action(
                actor=obs.self_id,
                kind=ActionType.PROPOSE_RULE,
                payload={"key": "attack_cost", "value": min(10, int(obs.current_rules.get("attack_cost", 5)) + 1)},
            )

        return Action(actor=obs.self_id, kind=ActionType.WORK)
