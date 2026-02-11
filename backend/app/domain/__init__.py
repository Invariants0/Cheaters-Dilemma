"""
Domain layer for The Cheater's Dilemma.
Contains core business logic and domain entities.
"""

# Import main domain classes for convenience
from .world import World
from .agent import Agent, AgentObservation
from .actions import Action, ActionType
from .models import AgentStrategy

__all__ = [
    "World",
    "Agent",
    "AgentObservation",
    "Action",
    "ActionType",
    "AgentStrategy",
]