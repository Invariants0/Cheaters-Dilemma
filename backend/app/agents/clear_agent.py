"""
Clear AI Agent - Utility-Based Strategic Decision Making

This agent uses explicit utility computation to make strategic decisions:
Utility(action) = α × expected_token_gain
                - β × retaliation_risk
                + γ × governance_influence_gain
                - δ × reputation_loss

Each agent has internal coefficients that define their personality:
- risk_tolerance: How willing to take risks (0.0 - 1.0)
- aggression: How likely to attack/steal (0.0 - 1.0)
- governance_bias: How much to participate in governance (0.0 - 1.0)
- corruption_threshold: When to engage in corrupt behavior (0.0 - 1.0)

All decisions are deterministic given the same RNG seed.
"""

from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, Tuple

from ..domain.actions import Action, ActionType
from ..domain.agent import Agent, AgentObservation


@dataclass
class AgentPersonality:
    """Personality coefficients for utility computation."""
    risk_tolerance: float  # α - willingness to take risks
    aggression: float      # β - likelihood of hostile actions
    governance_bias: float # γ - participation in governance
    corruption_threshold: float  # δ - threshold for corrupt behavior


class ClearAgent(Agent):
    """
    Utility-based strategic agent with explicit decision-making logic.
    
    This agent computes utility for each possible action and selects
    the action with the highest expected utility.
    """
    name = "clear"
    
    def __init__(self, personality: AgentPersonality):
        self.personality = personality
    
    def decide(self, obs: AgentObservation, rng) -> Action:
        """
        Decide action by computing utility for all possible actions
        and selecting the one with highest expected utility.
        """
        # Handle pending governance proposals first
        if obs.pending_proposal is not None:
            return self._decide_vote(obs, rng)
        
        # Compute utility for all possible actions
        actions_with_utility = []
        
        # WORK action
        work_utility = self._compute_work_utility(obs)
        actions_with_utility.append((work_utility, Action(actor=obs.self_id, kind=ActionType.WORK)))
        
        # STEAL actions (for each potential target)
        others = [aid for aid in obs.alive_ids if aid != obs.self_id]
        for target_id in others:
            if obs.token_balance_by_agent[target_id] > 0:
                steal_utility = self._compute_steal_utility(obs, target_id)
                actions_with_utility.append((
                    steal_utility,
                    Action(actor=obs.self_id, kind=ActionType.STEAL, target=target_id)
                ))
        
        # ATTACK actions (for each potential target)
        for target_id in others:
            attack_utility = self._compute_attack_utility(obs, target_id)
            actions_with_utility.append((
                attack_utility,
                Action(actor=obs.self_id, kind=ActionType.ATTACK, target=target_id)
            ))
        
        # PROPOSE_RULE action
        if self._should_propose_rule(obs, rng):
            proposal_utility = self._compute_proposal_utility(obs)
            proposal_action = self._generate_strategic_proposal(obs)
            actions_with_utility.append((proposal_utility, proposal_action))
        
        # Select action with highest utility
        if not actions_with_utility:
            return Action(actor=obs.self_id, kind=ActionType.WORK)
        
        best_utility, best_action = max(actions_with_utility, key=lambda x: x[0])
        return best_action
    
    def _compute_work_utility(self, obs: AgentObservation) -> float:
        """Compute utility of working (safe, guaranteed income)."""
        work_income = obs.current_rules.get("work_income", [2, 4])
        expected_gain = sum(work_income) / 2.0
        
        # Work is safe and reliable
        utility = expected_gain * (1.0 + self.personality.risk_tolerance * 0.2)
        return utility
    
    def _compute_steal_utility(self, obs: AgentObservation, target_id: int) -> float:
        """Compute utility of stealing from a specific target."""
        # Check if we can afford to steal
        min_balance = obs.current_rules.get("steal_min_token_balance", 0)
        if obs.self_token_balance < min_balance:
            return -1000.0  # Cannot afford
        
        # Expected token gain
        steal_amount = min(
            obs.current_rules.get("steal_amount", 3),
            obs.token_balance_by_agent[target_id]
        )
        success_base = obs.current_rules.get("steal_success_base", 0.45)
        strength_edge = (obs.self_strength - obs.strength_by_agent[target_id]) * 0.03
        success_prob = min(0.9, max(0.05, success_base + strength_edge))
        
        expected_gain = steal_amount * success_prob
        
        # Retaliation risk
        target_aggression = obs.aggression_by_agent.get(target_id, 0.5)
        retaliation_risk = target_aggression * obs.token_balance_by_agent[target_id] * 0.1
        
        # Reputation loss
        target_trust = obs.trust_by_agent.get(target_id, 0.5)
        reputation_loss = (1.0 - target_trust) * 2.0
        
        # Governance influence (stealing doesn't help governance)
        governance_gain = 0.0
        
        # Compute utility
        utility = (
            self.personality.risk_tolerance * expected_gain
            - (1.0 - self.personality.aggression) * retaliation_risk
            + self.personality.governance_bias * governance_gain
            - (1.0 - self.personality.corruption_threshold) * reputation_loss
        )
        
        return utility
    
    def _compute_attack_utility(self, obs: AgentObservation, target_id: int) -> float:
        """Compute utility of attacking a specific target."""
        attack_cost = obs.current_rules.get("attack_cost", 8)
        
        # Check if we can afford to attack
        if obs.self_token_balance < attack_cost:
            return -1000.0  # Cannot afford
        
        # Expected token gain
        success_base = obs.current_rules.get("attack_success_base", 0.12)
        strength_edge = (obs.self_strength - obs.strength_by_agent[target_id]) * 0.04
        success_prob = min(0.75, max(0.01, success_base + strength_edge))
        
        loot_ratio = obs.current_rules.get("attack_loot_ratio", 0.4)
        expected_loot = obs.token_balance_by_agent[target_id] * loot_ratio * success_prob
        expected_gain = expected_loot - attack_cost
        
        # Retaliation risk (eliminated targets can't retaliate)
        retaliation_risk = (1.0 - success_prob) * obs.strength_by_agent[target_id] * 0.5
        
        # Reputation loss (attacking is aggressive)
        reputation_loss = 5.0
        
        # Governance influence (eliminating competitors helps)
        alive_count = len(obs.alive_ids)
        governance_gain = (obs.token_balance_by_agent[target_id] / alive_count) * success_prob
        
        # Compute utility
        utility = (
            self.personality.risk_tolerance * expected_gain
            - (1.0 - self.personality.aggression) * retaliation_risk
            + self.personality.governance_bias * governance_gain
            - (1.0 - self.personality.corruption_threshold) * reputation_loss
        )
        
        # Bonus for late game elimination
        if alive_count <= 4:
            utility *= 1.5
        
        return utility
    
    def _compute_proposal_utility(self, obs: AgentObservation) -> float:
        """Compute utility of proposing a rule change."""
        # Governance participation has inherent value
        base_utility = 3.0 * self.personality.governance_bias
        
        # Higher rank agents benefit more from governance
        rank_bonus = (len(obs.alive_ids) - obs.self_rank) * 0.5
        
        return base_utility + rank_bonus
    
    def _should_propose_rule(self, obs: AgentObservation, rng) -> bool:
        """Determine if agent should consider proposing a rule."""
        # Only propose occasionally
        if rng.random() > 0.15:
            return False
        
        # Must have governance bias
        if self.personality.governance_bias < 0.3:
            return False
        
        return True
    
    def _generate_strategic_proposal(self, obs: AgentObservation) -> Action:
        """Generate a strategic rule proposal based on agent's situation."""
        # If we're winning, make attacks more expensive
        if obs.self_rank <= 2:
            return Action(
                actor=obs.self_id,
                kind=ActionType.PROPOSE_RULE,
                payload={
                    "key": "attack_cost",
                    "value": min(15, obs.current_rules.get("attack_cost", 8) + 2)
                }
            )
        
        # If we're losing, increase work income
        if obs.self_rank > len(obs.alive_ids) // 2:
            current_income = obs.current_rules.get("work_income", [2, 4])
            return Action(
                actor=obs.self_id,
                kind=ActionType.PROPOSE_RULE,
                payload={
                    "key": "work_income",
                    "value": [current_income[0] + 1, current_income[1] + 1]
                }
            )
        
        # Default: increase steal success rate if we're aggressive
        if self.personality.aggression > 0.6:
            return Action(
                actor=obs.self_id,
                kind=ActionType.PROPOSE_RULE,
                payload={
                    "key": "steal_success_base",
                    "value": min(0.9, obs.current_rules.get("steal_success_base", 0.45) + 0.05)
                }
            )
        
        # Conservative: increase steal penalties
        return Action(
            actor=obs.self_id,
            kind=ActionType.PROPOSE_RULE,
            payload={
                "key": "steal_catch_penalty",
                "value": min(8, obs.current_rules.get("steal_catch_penalty", 2) + 1)
            }
        )
    
    def _decide_vote(self, obs: AgentObservation, rng) -> Action:
        """Decide how to vote on a pending proposal using utility analysis."""
        proposal = obs.pending_proposal
        if not proposal:
            return Action(actor=obs.self_id, kind=ActionType.WORK)
        
        key = proposal.get("key")
        value = proposal.get("value")
        proposer = proposal.get("actor")
        
        # Analyze if proposal benefits us
        vote_yes = self._should_support_proposal(obs, key, value, proposer)
        
        return Action(
            actor=obs.self_id,
            kind=ActionType.VOTE_RULE,
            payload={"vote": "yes" if vote_yes else "no"}
        )
    
    def _should_support_proposal(
        self,
        obs: AgentObservation,
        key: str,
        value: any,
        proposer: int
    ) -> bool:
        """Determine if we should support a proposal based on utility."""
        # Trust the proposer if they have high trust
        proposer_trust = obs.trust_by_agent.get(proposer, 0.5)
        if proposer_trust > 0.7 and self.personality.corruption_threshold < 0.5:
            return True
        
        # Analyze specific proposals
        if key == "work_income":
            # Always support higher work income
            current = obs.current_rules.get("work_income", [2, 4])
            return value[-1] > current[-1]
        
        if key == "attack_cost":
            # Support higher cost if we're winning, oppose if losing
            return obs.self_rank <= len(obs.alive_ids) // 2
        
        if key == "steal_success_base" or key == "steal_amount":
            # Support if we're aggressive
            return self.personality.aggression > 0.5
        
        if key == "steal_catch_penalty":
            # Support higher penalties if we're not aggressive
            return self.personality.aggression < 0.5
        
        # Default: vote based on proposer trust
        return proposer_trust > 0.5


# Factory function to create agents with different personalities
def create_clear_agent(agent_type: str) -> ClearAgent:
    """Create a ClearAgent with predefined personality based on type."""
    personalities = {
        "conservative": AgentPersonality(
            risk_tolerance=0.3,
            aggression=0.2,
            governance_bias=0.7,
            corruption_threshold=0.2
        ),
        "aggressive": AgentPersonality(
            risk_tolerance=0.8,
            aggression=0.9,
            governance_bias=0.3,
            corruption_threshold=0.8
        ),
        "balanced": AgentPersonality(
            risk_tolerance=0.5,
            aggression=0.5,
            governance_bias=0.5,
            corruption_threshold=0.5
        ),
        "politician": AgentPersonality(
            risk_tolerance=0.4,
            aggression=0.3,
            governance_bias=0.9,
            corruption_threshold=0.6
        ),
        "opportunist": AgentPersonality(
            risk_tolerance=0.7,
            aggression=0.6,
            governance_bias=0.4,
            corruption_threshold=0.9
        ),
    }
    
    personality = personalities.get(agent_type, personalities["balanced"])
    return ClearAgent(personality)
