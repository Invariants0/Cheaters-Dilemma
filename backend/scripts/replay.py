from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PARENT = ROOT.parent
if str(PARENT) not in sys.path:
    sys.path.insert(0, str(PARENT))

from .run import run_simulation


def main() -> None:
    parser = argparse.ArgumentParser(description="Replay determinism check for The Cheater's Dilemma")
    parser.add_argument("--agents", type=int, default=10, help="Number of agents (5-20)")
    parser.add_argument("--seed", type=int, default=42, help="Seed for deterministic replay")
    parser.add_argument("--turns", type=int, default=None, help="Optional override for turn count")
    args = parser.parse_args()

    first = run_simulation(agent_count=args.agents, seed=args.seed, turns=args.turns)
    second = run_simulation(agent_count=args.agents, seed=args.seed, turns=args.turns)

    first_blob = json.dumps(first, sort_keys=True, separators=(",", ":"))
    second_blob = json.dumps(second, sort_keys=True, separators=(",", ":"))

    if first_blob != second_blob:
        raise SystemExit("Replay mismatch: deterministic guarantee violated")

    print("Replay matched exactly.")
    print(f"seed={args.seed} agents={args.agents} turns={args.turns}")
    print(f"log_digest={first['log_digest']}")
    print("top3:")
    for row in first["leaderboard"][:3]:
        print(
            f"agent={row['agent_id']} strategy={row['strategy']} "
            f"resources={row['resources']} alive={row['alive']}"
        )


if __name__ == "__main__":
    main()
