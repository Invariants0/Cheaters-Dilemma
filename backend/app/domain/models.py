"""
Domain models for The Cheater's Dilemma simulation.
Contains core business entities and value objects.
"""

from __future__ import annotations
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum


class AgentStrategy(Enum):
    """Available agent strategies."""
    CHEATER = "cheater"
    GREEDY = "greedy"
    POLITICIAN = "politician"
    WARLORD = "warlord"
    HEURISTICS = "heuristics"
    PROBABILISTIC = "probabilistic"


@dataclass
class Agent:
    """Core agent entity."""
    agent_id: int
    strategy: AgentStrategy
    resources: int
    strength: int
    alive: bool = True
    trust: float = 0.5
    aggression: float = 0.5
    rank: int = 0
    total_actions: int = 0
    successful_actions: int = 0
    failed_actions: int = 0
    reputation_history: List[float] = None
    resource_history: List[int] = None

    def __post_init__(self):
        if self.reputation_history is None:
            self.reputation_history = []
        if self.resource_history is None:
            self.resource_history = []


@dataclass
class WorldState:
    """Current state of the simulation world."""
    simulation_id: str
    current_turn: int
    agents: List[Agent]
    rules: Dict[str, Any]
    alive_count: int = 0
    event_count: int = 0

    def __post_init__(self):
        self.alive_count = sum(1 for agent in self.agents if agent.alive)


@dataclass
class Rule:
    """A governance rule in the simulation."""
    rule_id: str
    name: str
    description: str
    enabled: bool = True
    parameters: Dict[str, Any] = None

    def __post_init__(self):
        if self.parameters is None:
            self.parameters = {}


@dataclass
class Alliance:
    """Relationship between agents."""
    agent1_id: int
    agent2_id: int
    trust_level: float
    strength: int
    formed_turn: int