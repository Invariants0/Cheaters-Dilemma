"""
Probabilistic agent strategy for The Cheater's Dilemma.
Uses probability distributions for decision making.
"""

from __future__ import annotations
from typing import Dict, List, Optional, Any, Tuple
import random

from .base import BaseAgent
from ..domain.models import Agent, WorldState, AgentStrategy
from ..domain.actions import Action, CheatAction, HonestPlayAction, AttackAction


class ProbabilisticAgent(BaseAgent):
    """Agent that uses probabilistic decision making."""

    def __init__(self, agent_id: int):
        super().__init__(agent_id, AgentStrategy.PROBABILISTIC)
        # Probability weights for different actions
        self.action_weights = {
            "honest_play": 0.4,
            "cheat": 0.3,
            "attack": 0.2,
            "propose_rule": 0.1
        }
        self.adaptiveness = 0.1  # How much to adjust weights based on experience

    def decide_action(self, world_state: WorldState) -> Action:
        """Decide action using weighted probability distribution."""
        my_agent = self._get_my_agent(world_state)

        # Adjust weights based on current state
        adjusted_weights = self._adjust_weights_for_state(my_agent, world_state)

        # Select action based on weights
        action_type = self._weighted_choice(adjusted_weights)

        if action_type == "honest_play":
            return HonestPlayAction(self.agent_id)
        elif action_type == "cheat":
            target = self._select_random_target(world_state)
            if target:
                return CheatAction(self.agent_id, target.agent_id)
            else:
                return HonestPlayAction(self.agent_id)  # Fallback
        elif action_type == "attack":
            target = self._select_attack_target(world_state, my_agent)
            if target:
                return AttackAction(self.agent_id, target.agent_id)
            else:
                return HonestPlayAction(self.agent_id)  # Fallback
        else:  # propose_rule or other
            return HonestPlayAction(self.agent_id)  # Simplified for now

    def _adjust_weights_for_state(self, my_agent: Agent, world_state: WorldState) -> Dict[str, float]:
        """Adjust action weights based on current agent and world state."""
        weights = self.action_weights.copy()

        # If low on resources, increase cheating and attacking probability
        if my_agent.resources < 30:
            weights["cheat"] *= 1.5
            weights["attack"] *= 1.3
            weights["honest_play"] *= 0.7

        # If high on resources, favor honest play
        elif my_agent.resources > 80:
            weights["honest_play"] *= 1.4
            weights["cheat"] *= 0.6

        # If high trust, more likely to cooperate
        if my_agent.trust > 0.7:
            weights["honest_play"] *= 1.2
            weights["cheat"] *= 0.8

        # If high aggression, more likely to attack
        if my_agent.aggression > 0.7:
            weights["attack"] *= 1.3
            weights["honest_play"] *= 0.9

        # Normalize weights
        total = sum(weights.values())
        return {k: v/total for k, v in weights.items()}

    def _weighted_choice(self, weights: Dict[str, float]) -> str:
        """Select an action based on weighted probabilities."""
        rand_val = random.random()
        cumulative = 0.0

        for action, weight in weights.items():
            cumulative += weight
            if rand_val <= cumulative:
                return action

        return "honest_play"  # Fallback

    def _select_random_target(self, world_state: WorldState) -> Optional[Agent]:
        """Select a random living agent as target."""
        living_agents = [
            agent for agent in world_state.agents
            if agent.agent_id != self.agent_id and agent.alive
        ]
        return random.choice(living_agents) if living_agents else None

    def _select_attack_target(self, world_state: WorldState, my_agent: Agent) -> Optional[Agent]:
        """Select a target for attack (weaker agents preferred)."""
        potential_targets = [
            agent for agent in world_state.agents
            if agent.agent_id != self.agent_id and agent.alive and
            agent.strength < my_agent.strength
        ]

        if not potential_targets:
            return None

        # Weight towards weaker targets
        weights = []
        for target in potential_targets:
            strength_diff = my_agent.strength - target.strength
            weight = max(0.1, strength_diff / my_agent.strength)
            weights.append(weight)

        # Normalize weights
        total_weight = sum(weights)
        if total_weight == 0:
            return random.choice(potential_targets)

        normalized_weights = [w/total_weight for w in weights]

        # Weighted selection
        rand_val = random.random()
        cumulative = 0.0
        for i, weight in enumerate(normalized_weights):
            cumulative += weight
            if rand_val <= cumulative:
                return potential_targets[i]

        return potential_targets[-1]  # Fallback

    def _get_my_agent(self, world_state: WorldState) -> Agent:
        """Get this agent's data from world state."""
        for agent in world_state.agents:
            if agent.agent_id == self.agent_id:
                return agent
        raise ValueError(f"Agent {self.agent_id} not found in world state")

    def update_beliefs(self, world_state: WorldState, action_result: Dict[str, Any]):
        """Update action weights based on success/failure."""
        if not action_result:
            return

        success = action_result.get("success", False)
        action_type = action_result.get("action_type", "")

        if action_type in self.action_weights:
            if success:
                # Increase weight for successful actions
                self.action_weights[action_type] *= (1 + self.adaptiveness)
            else:
                # Decrease weight for failed actions
                self.action_weights[action_type] *= (1 - self.adaptiveness)

            # Renormalize weights
            total = sum(self.action_weights.values())
            self.action_weights = {k: v/total for k, v in self.action_weights.items()}

    def get_agent_data(self) -> Agent:
        """Get agent data - would be populated from actual agent state."""
        raise NotImplementedError("ProbabilisticAgent needs to be integrated with simulation")