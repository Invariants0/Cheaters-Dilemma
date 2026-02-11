"""
Heuristics-based agent strategy for The Cheater's Dilemma.
Uses simple rule-based decision making.
"""

from __future__ import annotations
from typing import Dict, List, Optional, Any, Tuple
import random

from .base import BaseAgent
from ..domain.models import Agent, WorldState, AgentStrategy
from ..domain.actions import Action, CheatAction, HonestPlayAction, AttackAction


class HeuristicsAgent(BaseAgent):
    """Agent that uses simple heuristics for decision making."""

    def __init__(self, agent_id: int):
        super().__init__(agent_id, AgentStrategy.HEURISTICS)
        self.risk_threshold = 0.3  # How much risk the agent is willing to take
        self.cooperation_threshold = 0.6  # Trust level needed for cooperation

    def decide_action(self, world_state: WorldState) -> Action:
        """Decide action using simple heuristics."""
        my_agent = self._get_my_agent(world_state)

        # If very low on resources, be more aggressive
        if my_agent.resources < 20:
            return self._decide_aggressive_action(world_state, my_agent)

        # If high trust and resources, cooperate
        if my_agent.trust > self.cooperation_threshold and my_agent.resources > 50:
            return HonestPlayAction(self.agent_id)

        # If low trust but moderate resources, consider cheating
        if my_agent.trust < 0.4 and my_agent.resources > 30:
            target = self._find_cheat_target(world_state)
            if target:
                return CheatAction(self.agent_id, target.agent_id)

        # Default to honest play
        return HonestPlayAction(self.agent_id)

    def _decide_aggressive_action(self, world_state: WorldState, my_agent: Agent) -> Action:
        """Decide action when resources are low."""
        # Look for weak targets to attack
        weak_targets = [
            agent for agent in world_state.agents
            if agent.agent_id != self.agent_id and agent.alive and
            agent.resources < my_agent.resources and agent.strength < my_agent.strength
        ]

        if weak_targets and random.random() < self.risk_threshold:
            target = random.choice(weak_targets)
            return AttackAction(self.agent_id, target.agent_id)

        # If no good attack targets, try cheating
        target = self._find_cheat_target(world_state)
        if target:
            return CheatAction(self.agent_id, target.agent_id)

        # Last resort: honest play
        return HonestPlayAction(self.agent_id)

    def _find_cheat_target(self, world_state: WorldState) -> Optional[Agent]:
        """Find a suitable target for cheating."""
        potential_targets = [
            agent for agent in world_state.agents
            if agent.agent_id != self.agent_id and agent.alive and agent.resources > 20
        ]

        if not potential_targets:
            return None

        # Prefer targets with more resources
        potential_targets.sort(key=lambda a: a.resources, reverse=True)
        return potential_targets[0] if potential_targets else None

    def _get_my_agent(self, world_state: WorldState) -> Agent:
        """Get this agent's data from world state."""
        for agent in world_state.agents:
            if agent.agent_id == self.agent_id:
                return agent
        raise ValueError(f"Agent {self.agent_id} not found in world state")

    def update_beliefs(self, world_state: WorldState, action_result: Dict[str, Any]):
        """Update beliefs based on action results."""
        # Simple learning: adjust risk threshold based on success/failure
        if action_result.get("success", False):
            self.risk_threshold = min(0.5, self.risk_threshold + 0.05)
        else:
            self.risk_threshold = max(0.1, self.risk_threshold - 0.05)

    def get_agent_data(self) -> Agent:
        """Get agent data - would be populated from actual agent state."""
        # This is a placeholder - in real implementation, this would return
        # the actual agent data from the simulation
        raise NotImplementedError("HeuristicsAgent needs to be integrated with simulation")