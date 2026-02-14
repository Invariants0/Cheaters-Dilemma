#!/usr/bin/env python3
"""
Deploy DILEMMA token via NAD.fun platform

NAD.fun is the token creation platform on Monad.
This script uses the NAD.fun API to create the DILEMMA token.

References:
- NAD.fun API (Testnet): https://dev-api.nadapp.net
- Token Creation Guide: https://nad.fun/create.md
- NAD.fun Skill: https://nad.fun/skill.md
"""

import json
import sys
import requests
from pathlib import Path
from typing import Dict

# NAD.fun API endpoints
NADFUN_API_TESTNET = "https://dev-api.nadapp.net"
NADFUN_API_MAINNET = "https://api.nadapp.net"


def load_simulation_results(filepath: str) -> Dict:
    """Load simulation results from JSON file."""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Simulation results not found: {filepath}")
    
    with open(path, 'r') as f:
        data = json.load(f)
    
    if "result" in data:
        return data["result"]
    return data


def create_token_via_nadfun(simulation_result: Dict, use_testnet: bool = True):
    """
    Create DILEMMA token via NAD.fun platform.
    
    Args:
        simulation_result: The simulation output
        use_testnet: Whether to use testnet (True) or mainnet (False)
    """
    api_base = NADFUN_API_TESTNET if use_testnet else NADFUN_API_MAINNET
    network = "testnet" if use_testnet else "mainnet"
    
    print("="*60)
    print("DILEMMA TOKEN CREATION VIA NAD.FUN")
    print("="*60)
    print(f"\nNetwork: Monad {network}")
    print(f"API: {api_base}")
    
    # Extract token information
    seed = simulation_result.get("seed", 42)
    leaderboard = simulation_result.get("leaderboard", [])
    total_supply = sum(agent["token_balance"] for agent in leaderboard)
    winner = leaderboard[0] if leaderboard else None
    
    print(f"\n📊 Token Details:")
    print(f"   Name: DILEMMA")
    print(f"   Symbol: DLM")
    print(f"   Total Supply: {total_supply}")
    print(f"   Agents: {len(leaderboard)}")
    print(f"   Winner: Agent {winner['agent_id']} ({winner['strategy']}) - {winner['token_balance']} tokens")
    
    # Token metadata
    token_metadata = {
        "name": "DILEMMA",
        "symbol": "DLM",
        "description": "The Cheater's Dilemma - A token representing final political power distribution from a multi-agent governance war simulation",
        "image": "",  # Optional: Add image URL
        "simulation_seed": seed,
        "total_supply": total_supply,
        "agent_count": len(leaderboard),
        "winner_agent_id": winner["agent_id"] if winner else None,
        "winner_strategy": winner["strategy"] if winner else None,
    }
    
    print(f"\n📝 Token Metadata:")
    print(json.dumps(token_metadata, indent=2))
    
    print(f"\n🚀 To create this token on NAD.fun:")
    print(f"   1. Visit: https://nad.fun")
    print(f"   2. Connect your wallet")
    print(f"   3. Click 'Create Token'")
    print(f"   4. Enter token details:")
    print(f"      - Name: DILEMMA")
    print(f"      - Symbol: DLM")
    print(f"      - Description: {token_metadata['description']}")
    print(f"      - Initial Supply: {total_supply}")
    print(f"   5. Confirm transaction")
    
    print(f"\n💡 Alternative: Use NAD.fun API")
    print(f"   API Documentation: https://nad.fun/skill.md")
    print(f"   Token Creation Guide: https://nad.fun/create.md")
    
    print(f"\n📊 Distribution Plan:")
    print(f"   After token creation, distribute to agents:")
    for i, agent in enumerate(leaderboard[:5], 1):
        percentage = (agent["token_balance"] / total_supply) * 100
        print(f"   {i}. Agent {agent['agent_id']} ({agent['strategy']}): {agent['token_balance']} DLM ({percentage:.1f}%)")
    
    if len(leaderboard) > 5:
        print(f"   ... and {len(leaderboard) - 5} more agents")
    
    print("\n" + "="*60)
    print("✅ Token creation instructions complete")
    print("="*60)
    
    # Save token metadata
    metadata_file = f"dilemma_token_metadata_seed{seed}.json"
    with open(metadata_file, 'w') as f:
        json.dump(token_metadata, f, indent=2)
    print(f"\n💾 Token metadata saved to: {metadata_file}")


def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python scripts/deploy_via_nadfun.py <simulation_results.json>")
        print("\nExample:")
        print("  python scripts/deploy_via_nadfun.py simulation_results_demo_seed42.json")
        sys.exit(1)
    
    results_file = sys.argv[1]
    
    try:
        print("\n🔍 Loading simulation results...")
        simulation_result = load_simulation_results(results_file)
        
        print("✅ Simulation results loaded")
        
        # Create token via NAD.fun
        create_token_via_nadfun(simulation_result, use_testnet=True)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
