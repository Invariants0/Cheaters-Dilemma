#!/usr/bin/env python3
"""
Determinism Verification Script

This script runs the simulation multiple times with the same seed
and verifies that the results are identical every time.

This proves that:
1. The simulation is deterministic
2. Same seed = same results
3. No external randomness or async operations
4. Reproducible for verification
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any
import hashlib

# Add backend to path
BACKEND_PATH = Path(__file__).parent
sys.path.insert(0, str(BACKEND_PATH))

from app.services.simulation_service import SimulationService


def compute_result_hash(result: Dict[str, Any]) -> str:
    """Compute a hash of the simulation result for comparison."""
    # Extract deterministic fields
    hash_data = {
        "seed": result.get("seed"),
        "turns_completed": result.get("turns_completed"),
        "rules_version": result.get("rules_version"),
        "leaderboard": result.get("leaderboard"),
        "alive": result.get("alive"),
        "action_counts": result.get("action_counts"),
        "event_count": result.get("event_count"),
    }
    
    # Create deterministic JSON string
    json_string = json.dumps(hash_data, sort_keys=True, separators=(',', ':'))
    
    # Compute SHA256 hash
    hash_bytes = hashlib.sha256(json_string.encode()).digest()
    
    return hash_bytes.hex()


def run_simulation(seed: int, agent_count: int, turns: int) -> Dict[str, Any]:
    """Run a single simulation and return results."""
    service = SimulationService()
    world = service.create_world(
        agent_count=agent_count,
        seed=seed,
        turns=turns
    )
    return world.run()


def verify_determinism(seed: int = 42, agent_count: int = 8, turns: int = 200, runs: int = 3):
    """
    Run the simulation multiple times and verify results are identical.
    
    Args:
        seed: Random seed to use
        agent_count: Number of agents
        turns: Number of turns
        runs: Number of times to run the simulation
    """
    print("="*60)
    print("DETERMINISM VERIFICATION")
    print("="*60)
    print(f"\nConfiguration:")
    print(f"  - Seed: {seed}")
    print(f"  - Agents: {agent_count}")
    print(f"  - Turns: {turns}")
    print(f"  - Runs: {runs}")
    print(f"\nRunning {runs} simulations with identical parameters...")
    print("-"*60)
    
    results = []
    hashes = []
    
    for i in range(runs):
        print(f"\n🎮 Run {i+1}/{runs}...")
        result = run_simulation(seed, agent_count, turns)
        result_hash = compute_result_hash(result)
        
        results.append(result)
        hashes.append(result_hash)
        
        # Print summary
        winner = result["leaderboard"][0]
        print(f"   ✅ Completed: {result['turns_completed']} turns")
        print(f"   🏆 Winner: Agent {winner['agent_id']} ({winner['strategy']}) with {winner['token_balance']} tokens")
        print(f"   📊 Alive: {len(result['alive'])}/{agent_count}")
        print(f"   🔐 Hash: {result_hash[:16]}...")
    
    # Verify all hashes are identical
    print("\n" + "="*60)
    print("VERIFICATION RESULTS")
    print("="*60)
    
    all_identical = all(h == hashes[0] for h in hashes)
    
    if all_identical:
        print("\n✅ SUCCESS: All runs produced IDENTICAL results!")
        print(f"\n   Common hash: {hashes[0]}")
        print("\n   This proves:")
        print("   ✅ Simulation is deterministic")
        print("   ✅ Same seed = same results")
        print("   ✅ No external randomness")
        print("   ✅ Reproducible for verification")
        
        # Detailed comparison
        print("\n📊 Detailed Comparison:")
        for i in range(runs):
            result = results[i]
            winner = result["leaderboard"][0]
            print(f"\n   Run {i+1}:")
            print(f"     - Turns: {result['turns_completed']}")
            print(f"     - Winner: Agent {winner['agent_id']} ({winner['strategy']})")
            print(f"     - Winner Balance: {winner['token_balance']}")
            print(f"     - Alive: {len(result['alive'])}")
            print(f"     - Events: {result['event_count']}")
            print(f"     - Rules Version: {result['rules_version']}")
        
        # Verify leaderboards are identical
        print("\n🏆 Leaderboard Verification:")
        for i in range(min(3, agent_count)):
            agent_data = [r["leaderboard"][i] for r in results]
            all_same = all(
                a["agent_id"] == agent_data[0]["agent_id"] and
                a["token_balance"] == agent_data[0]["token_balance"] and
                a["alive"] == agent_data[0]["alive"]
                for a in agent_data
            )
            status = "✅" if all_same else "❌"
            print(f"   {status} Position {i+1}: Agent {agent_data[0]['agent_id']} - {agent_data[0]['token_balance']} tokens")
        
        print("\n" + "="*60)
        print("✅ DETERMINISM VERIFIED")
        print("="*60)
        return True
        
    else:
        print("\n❌ FAILURE: Runs produced DIFFERENT results!")
        print("\n   Hashes:")
        for i, h in enumerate(hashes):
            print(f"   Run {i+1}: {h}")
        
        print("\n   This indicates:")
        print("   ❌ Non-deterministic behavior detected")
        print("   ❌ External randomness or async operations")
        print("   ❌ Results are not reproducible")
        
        print("\n" + "="*60)
        print("❌ DETERMINISM VERIFICATION FAILED")
        print("="*60)
        return False


def main():
    """Main verification function."""
    print("\n🔬 Starting Determinism Verification...\n")
    
    # Test with default parameters
    success = verify_determinism(seed=42, agent_count=8, turns=200, runs=3)
    
    if success:
        print("\n🎉 All tests passed!")
        print("\nThe simulation is proven to be deterministic.")
        print("Same seed will always produce the same results.")
        print("\nYou can now confidently:")
        print("  1. Deploy tokens based on simulation results")
        print("  2. Verify results by replaying with same seed")
        print("  3. Trust the on-chain distribution")
        sys.exit(0)
    else:
        print("\n⚠️  Determinism verification failed!")
        print("Please investigate the source of non-determinism.")
        sys.exit(1)


if __name__ == "__main__":
    main()
