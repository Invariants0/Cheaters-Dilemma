"""
Data repository layer for The Cheater's Dilemma.
Handles data persistence and retrieval.
"""

from __future__ import annotations
from typing import List, Optional, Dict, Any
from abc import ABC, abstractmethod

from ..domain.models import Agent, WorldState, Rule
from .db import get_database


class SimulationRepository(ABC):
    """Abstract base class for simulation data persistence."""

    @abstractmethod
    async def save_simulation_state(self, world_state: WorldState) -> None:
        """Save the current simulation state."""
        pass

    @abstractmethod
    async def load_simulation_state(self, simulation_id: str) -> Optional[WorldState]:
        """Load a simulation state by ID."""
        pass

    @abstractmethod
    async def save_agent(self, agent: Agent) -> None:
        """Save an agent's state."""
        pass

    @abstractmethod
    async def get_agents_for_simulation(self, simulation_id: str) -> List[Agent]:
        """Get all agents for a simulation."""
        pass

    @abstractmethod
    async def save_rule(self, rule: Rule) -> None:
        """Save a rule."""
        pass

    @abstractmethod
    async def get_rules_for_simulation(self, simulation_id: str) -> List[Rule]:
        """Get all rules for a simulation."""
        pass


class InMemorySimulationRepository(SimulationRepository):
    """In-memory implementation of simulation repository."""

    def __init__(self):
        self._simulations: Dict[str, WorldState] = {}
        self._agents: Dict[str, List[Agent]] = {}
        self._rules: Dict[str, List[Rule]] = {}

    async def save_simulation_state(self, world_state: WorldState) -> None:
        """Save simulation state in memory."""
        self._simulations[world_state.simulation_id] = world_state

    async def load_simulation_state(self, simulation_id: str) -> Optional[WorldState]:
        """Load simulation state from memory."""
        return self._simulations.get(simulation_id)

    async def save_agent(self, agent: Agent) -> None:
        """Save agent in memory."""
        # For now, agents are stored within WorldState
        # In a real implementation, this might save to a separate collection
        pass

    async def get_agents_for_simulation(self, simulation_id: str) -> List[Agent]:
        """Get agents for a simulation."""
        world_state = self._simulations.get(simulation_id)
        return world_state.agents if world_state else []

    async def save_rule(self, rule: Rule) -> None:
        """Save rule in memory."""
        # Rules are currently stored within WorldState
        pass

    async def get_rules_for_simulation(self, simulation_id: str) -> List[Rule]:
        """Get rules for a simulation."""
        # In current implementation, rules are part of WorldState
        # This would need to be expanded for proper rule management
        return []


class PostgresSimulationRepository(SimulationRepository):
    """PostgreSQL implementation of simulation repository."""

    def __init__(self):
        self.db = get_database()

    async def save_simulation_state(self, world_state: WorldState) -> None:
        """Save simulation state to PostgreSQL."""
        # Placeholder for actual PostgreSQL implementation
        query = """
        INSERT INTO simulation_states (simulation_id, current_turn, agents, rules, alive_count, event_count)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (simulation_id) DO UPDATE SET
            current_turn = EXCLUDED.current_turn,
            agents = EXCLUDED.agents,
            rules = EXCLUDED.rules,
            alive_count = EXCLUDED.alive_count,
            event_count = EXCLUDED.event_count
        """
        await self.db.execute(query, {
            "simulation_id": world_state.simulation_id,
            "current_turn": world_state.current_turn,
            "agents": [agent.__dict__ for agent in world_state.agents],
            "rules": world_state.rules,
            "alive_count": world_state.alive_count,
            "event_count": world_state.event_count
        })

    async def load_simulation_state(self, simulation_id: str) -> Optional[WorldState]:
        """Load simulation state from PostgreSQL."""
        # Placeholder implementation
        query = "SELECT * FROM simulation_states WHERE simulation_id = $1"
        result = await self.db.fetch_one(query, {"simulation_id": simulation_id})

        if not result:
            return None

        # Convert back to WorldState - this would need proper deserialization
        return None  # Placeholder

    async def save_agent(self, agent: Agent) -> None:
        """Save agent to PostgreSQL."""
        # Placeholder
        pass

    async def get_agents_for_simulation(self, simulation_id: str) -> List[Agent]:
        """Get agents from PostgreSQL."""
        # Placeholder
        return []

    async def save_rule(self, rule: Rule) -> None:
        """Save rule to PostgreSQL."""
        # Placeholder
        pass

    async def get_rules_for_simulation(self, simulation_id: str) -> List[Rule]:
        """Get rules from PostgreSQL."""
        # Placeholder
        return []


# Global repository instance - defaults to in-memory for now
_repository_instance: Optional[SimulationRepository] = None


def get_simulation_repository() -> SimulationRepository:
    """Get the global simulation repository instance."""
    global _repository_instance
    if _repository_instance is None:
        # Use in-memory repository for now
        # In production, this could be configured to use Postgres
        _repository_instance = InMemorySimulationRepository()
    return _repository_instance