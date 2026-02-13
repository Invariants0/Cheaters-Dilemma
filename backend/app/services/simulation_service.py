from typing import Any, Dict, Optional

from ..agents.cheater import CheaterAgent
from ..agents.greedy import GreedyAgent
from ..agents.politician import PoliticianAgent
from ..agents.warlord import WarlordAgent
from ..domain.world import World


class SimulationService:
    """Service layer for managing simulations"""

    def __init__(self):
        pass

    def start_simulation(
        self,
        agent_count: int,
        seed: int,
        turns: Optional[int] = None
    ) -> Dict[str, Any]:
        """Start a new simulation and run it to completion"""
        if not (5 <= agent_count <= 20):
            raise ValueError("agent_count must be within [5, 20]")

        # Build agents
        agents = self._build_agents(agent_count)

        # Load configs
        import yaml
        import os
        config_dir = os.path.join(os.path.dirname(__file__), "..", "config")

        with open(os.path.join(config_dir, "world.yaml"), "r") as f:
            world_cfg = yaml.safe_load(f)

        with open(os.path.join(config_dir, "rules.yaml"), "r") as f:
            rules_cfg = yaml.safe_load(f)

        max_turns = turns if turns is not None else int(world_cfg["max_turns"])

        # Create world
        world = World(
            agents=agents,
            rules=rules_cfg,
            max_turns=max_turns,
            seed=seed,
            initial_resource_range=world_cfg["initial_resource_range"],
            strength_range=world_cfg["strength_range"],
        )

        # Run simulation
        result = world.run()

        return result

    def _build_agents(self, count: int):
        """Build the roster of agents"""
        classes = [GreedyAgent, CheaterAgent, PoliticianAgent, WarlordAgent]
        return [classes[i % len(classes)]() for i in range(count)]