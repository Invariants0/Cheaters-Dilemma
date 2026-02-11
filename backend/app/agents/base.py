"""
Base agent interface for The Cheater's Dilemma simulation.
All agent strategies must implement this interface.
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any, Tuple

from ..domain.models import Agent, WorldState, AgentStrategy
from ..domain.actions import Action


class BaseAgent(ABC):
    """Abstract base class for all agent strategies."""

    def __init__(self, agent_id: int, strategy: AgentStrategy):
        self.agent_id = agent_id
        self.strategy = strategy
        self.memory: Dict[str, Any] = {}

    @abstractmethod
    def decide_action(self, world_state: WorldState) -> Action:
        """
        Decide what action to take given the current world state.

        Args:
            world_state: Current state of the simulation world

        Returns:
            Action to execute
        """
        pass

    @abstractmethod
    def update_beliefs(self, world_state: WorldState, action_result: Dict[str, Any]):
        """
        Update internal beliefs based on action results.

        Args:
            world_state: Current world state
            action_result: Result of the last action taken
        """
        pass

    def get_agent_data(self) -> Agent:
        """Get the current agent state."""
        # This will be implemented by concrete agents
        raise NotImplementedError

    def __str__(self) -> str:
        return f"{self.strategy.value.capitalize()}Agent-{self.agent_id}"