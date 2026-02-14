"""
Agent implementations for The Cheater's Dilemma.
Contains different agent strategies and behaviors.
"""

from .cheater import CheaterAgent
from .greedy import GreedyAgent
from .politician import PoliticianAgent
from .warlord import WarlordAgent
from .clear_agent import ClearAgent, create_clear_agent

__all__ = [
    "CheaterAgent",
    "GreedyAgent",
    "PoliticianAgent",
    "WarlordAgent",
    "ClearAgent",
    "create_clear_agent",
]