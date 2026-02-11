"""
Agent implementations for The Cheater's Dilemma.
Contains different agent strategies and behaviors.
"""

from .cheater import CheaterAgent
from .greedy import GreedyAgent
from .politician import PoliticianAgent
from .warlord import WarlordAgent

__all__ = [
    "CheaterAgent",
    "GreedyAgent",
    "PoliticianAgent",
    "WarlordAgent",
]