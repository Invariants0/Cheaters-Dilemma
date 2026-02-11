"""
Replay service for managing simulation replays.
Handles replay storage, retrieval, and analysis.
"""

from __future__ import annotations
from typing import List, Optional, Dict, Any
from pathlib import Path
import json
import os
from datetime import datetime


class ReplayService:
    """Service for managing simulation replays."""

    def __init__(self, replay_dir: Optional[str] = None):
        self.replay_dir = Path(replay_dir) if replay_dir else Path("replays")
        self.replay_dir.mkdir(exist_ok=True)

    def save_replay(self, simulation_id: str, simulation_data: Dict[str, Any]) -> str:
        """Save a simulation replay to disk."""
        replay_id = simulation_id
        replay_file = self.replay_dir / f"{replay_id}.json"

        replay_data = {
            "replay_id": replay_id,
            "simulation_id": simulation_id,
            "seed": simulation_data.get("seed", 42),
            "agent_count": len(simulation_data.get("leaderboard", [])),
            "turns_completed": simulation_data.get("turns_completed", 0),
            "winner_strategy": self._determine_winner_strategy(simulation_data),
            "winner_resources": self._get_winner_resources(simulation_data),
            "created_at": datetime.now().isoformat(),
            "data": simulation_data
        }

        with open(replay_file, 'w') as f:
            json.dump(replay_data, f, indent=2, default=str)

        return replay_id

    def load_replay(self, replay_id: str) -> Optional[Dict[str, Any]]:
        """Load a replay from disk."""
        replay_file = self.replay_dir / f"{replay_id}.json"

        if not replay_file.exists():
            return None

        try:
            with open(replay_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return None

    def get_replay_summary(self, replay_id: str) -> Optional[Dict[str, Any]]:
        """Get a summary of a replay without full data."""
        full_replay = self.load_replay(replay_id)
        if not full_replay:
            return None

        return {
            "replay_id": full_replay["replay_id"],
            "simulation_id": full_replay["simulation_id"],
            "seed": full_replay["seed"],
            "agent_count": full_replay["agent_count"],
            "turns_completed": full_replay["turns_completed"],
            "winner_strategy": full_replay["winner_strategy"],
            "winner_resources": full_replay["winner_resources"],
            "created_at": full_replay["created_at"]
        }

    def list_replays(self) -> List[Dict[str, Any]]:
        """List all available replays."""
        replays = []

        for replay_file in self.replay_dir.glob("*.json"):
            try:
                with open(replay_file, 'r') as f:
                    replay_data = json.load(f)
                    replays.append(self.get_replay_summary(replay_data["replay_id"]))
            except (json.JSONDecodeError, IOError, KeyError):
                continue

        # Sort by creation date, newest first
        replays.sort(key=lambda x: x["created_at"] if x else "", reverse=True)
        return [r for r in replays if r is not None]

    def delete_replay(self, replay_id: str) -> bool:
        """Delete a replay file."""
        replay_file = self.replay_dir / f"{replay_id}.json"

        if replay_file.exists():
            try:
                replay_file.unlink()
                return True
            except OSError:
                return False

        return False

    def compare_replays(self, replay_id1: str, replay_id2: str) -> Optional[Dict[str, Any]]:
        """Compare two replays for determinism testing."""
        replay1 = self.load_replay(replay_id1)
        replay2 = self.load_replay(replay_id2)

        if not replay1 or not replay2:
            return None

        return {
            "replay1_id": replay_id1,
            "replay2_id": replay_id2,
            "identical": replay1["data"] == replay2["data"],
            "differences": self._find_differences(replay1["data"], replay2["data"])
        }

    def _determine_winner_strategy(self, simulation_data: Dict[str, Any]) -> Optional[str]:
        """Determine the winning strategy from simulation data."""
        leaderboard = simulation_data.get("leaderboard", [])
        if not leaderboard:
            return None

        # Find the agent with most resources
        winner = max(leaderboard, key=lambda x: x.get("resources", 0))
        return winner.get("strategy")

    def _get_winner_resources(self, simulation_data: Dict[str, Any]) -> Optional[int]:
        """Get the winner's resources."""
        leaderboard = simulation_data.get("leaderboard", [])
        if not leaderboard:
            return None

        winner = max(leaderboard, key=lambda x: x.get("resources", 0))
        return winner.get("resources")

    def _find_differences(self, data1: Dict[str, Any], data2: Dict[str, Any]) -> List[str]:
        """Find differences between two data structures."""
        differences = []

        def compare_dicts(d1, d2, path=""):
            if type(d1) != type(d2):
                differences.append(f"{path}: Type mismatch ({type(d1)} vs {type(d2)})")
                return

            if isinstance(d1, dict):
                for key in set(d1.keys()) | set(d2.keys()):
                    new_path = f"{path}.{key}" if path else key
                    if key not in d1:
                        differences.append(f"{new_path}: Missing in first")
                    elif key not in d2:
                        differences.append(f"{new_path}: Missing in second")
                    else:
                        compare_dicts(d1[key], d2[key], new_path)
            elif isinstance(d1, list):
                if len(d1) != len(d2):
                    differences.append(f"{path}: Length mismatch ({len(d1)} vs {len(d2)})")
                else:
                    for i, (v1, v2) in enumerate(zip(d1, d2)):
                        compare_dicts(v1, v2, f"{path}[{i}]")
            elif d1 != d2:
                differences.append(f"{path}: Value mismatch ({d1} vs {d2})")

        compare_dicts(data1, data2)
        return differences