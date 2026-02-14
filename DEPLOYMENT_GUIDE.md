# DILEMMA Token Deployment Guide

## Overview

This guide explains how to deploy the DILEMMA (DLM) token to Monad Testnet after running The Cheater's Dilemma simulation.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SIMULATION LAYER                          │
│  (Pure Deterministic Python - Off-Chain)                     │
│                                                               │
│  • Token-based economics                                     │
│  • Utility-based agent decisions                             │
│  • Token-weighted governance voting                          │
│  • Deterministic RNG                                         │
│  • No blockchain calls                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Simulation Results
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT LAYER                           │
│  (Post-Simulation - One-Time)                                │
│                                                               │
│  • Read simulation output                                    │
│  • Generate agent wallets                                    │
│  • Compute simulation hash                                   │
│  • Deploy ERC20 contract                                     │
│  • Mint token distribution                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Contract Address
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   BLOCKCHAIN LAYER                           │
│  (Monad Testnet - Immutable)                                 │
│                                                               │
│  • DILEMMA (DLM) ERC20 Token                                 │
│  • Immutable simulation hash                                 │
│  • Non-transferable tokens                                   │
│  • Final political power encoded                             │
└─────────────────────────────────────────────────────────────┘
```

## Token Economics

### Core Principles

1. **Token Balance = Economic Power**
   - All resources in the simulation are token balances
   - Economic gains/losses directly affect token balance
   - Elimination costs deduct from token balance

2. **Token Balance = Governance Power**
   - Voting weight = token balance (not one-agent-one-vote)
   - Proposals pass if YES votes > 50% of total token supply
   - Agents with more tokens have more governance influence

3. **Utility-Based Decision Making**
   ```
   Utility(action) = α × expected_token_gain
                   - β × retaliation_risk
                   + γ × governance_influence_gain
                   - δ × reputation_loss
   ```

4. **Agent Personalities**
   - `risk_tolerance`: Willingness to take risks (0.0 - 1.0)
   - `aggression`: Likelihood of hostile actions (0.0 - 1.0)
   - `governance_bias`: Participation in governance (0.0 - 1.0)
   - `corruption_threshold`: Threshold for corrupt behavior (0.0 - 1.0)

## Prerequisites

### 1. Python Environment

```bash
cd backend
pip install web3 eth-account
```

### 2. Monad Testnet Setup

- **RPC URL**: Get from Monad documentation
- **Chain ID**: 41454 (verify with Monad docs)
- **Faucet**: Get testnet tokens for deployment

### 3. Solidity Compiler

```bash
# Install Foundry (recommended)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Or use Hardhat
npm install --save-dev hardhat @openzeppelin/contracts
```

## Step-by-Step Deployment

### Step 1: Run the Simulation

```bash
cd backend
python demo_flow.py
```

This generates `simulation_results_demo_seed42.json` with:
- Final token balances for each agent
- Simulation hash
- Complete event log
- Governance history

### Step 2: Compile the Smart Contract

#### Using Foundry:

```bash
cd contracts
forge init
forge install OpenZeppelin/openzeppelin-contracts
forge build
```

#### Using Hardhat:

```bash
cd contracts
npx hardhat compile
```

### Step 3: Configure Deployment

Create `.env` file:

```bash
# Monad Testnet Configuration
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
MONAD_CHAIN_ID=41454
MONAD_EXPLORER=https://testnet-explorer.monad.xyz

# Deployer Wallet (KEEP SECURE!)
DEPLOYER_PRIVATE_KEY=0x...

# Gas Settings
GAS_LIMIT=3000000
GAS_PRICE_GWEI=20
```

### Step 4: Deploy the Token

```bash
cd backend
python scripts/deploy_token.py simulation_results_demo_seed42.json
```

This will:
1. ✅ Load simulation results
2. ✅ Compute simulation hash
3. ✅ Generate deterministic wallets for agents
4. ✅ Deploy DILEMMA token contract
5. ✅ Mint tokens to agent wallets
6. ✅ Save wallet information
7. ✅ Print deployment summary

### Step 5: Verify Deployment

Expected output:

```
============================================================
🎉 DEPLOYMENT SUMMARY
============================================================
✅ Contract Address: 0x...
✅ Transaction Hash: 0x...
✅ Total Supply: 1234 DLM
✅ Agent Count: 8
✅ Simulation Hash: 0x...
✅ Network: Monad Testnet

🔍 Explorer: https://testnet-explorer.monad.xyz/address/0x...
🔍 Transaction: https://testnet-explorer.monad.xyz/tx/0x...

📊 TOKEN DISTRIBUTION:
   1. Agent 3 (politician): 456 DLM (37.0%)
   2. Agent 1 (warlord): 234 DLM (19.0%)
   3. Agent 5 (greedy): 178 DLM (14.4%)
   ...

📈 Gini Coefficient: 0.45678
   (Measure of inequality: 0 = perfect equality, 1 = perfect inequality)

============================================================
✅ DEPLOYMENT COMPLETE
============================================================
```

## Smart Contract Details

### Contract: DilemmaToken.sol

```solidity
contract DilemmaToken is ERC20 {
    bytes32 public immutable simulationHash;
    uint256 public immutable deploymentTimestamp;
    uint256 public immutable agentCount;
    
    mapping(uint256 => address) public agentWallets;
    mapping(address => uint256) public walletToAgent;
    
    constructor(
        bytes32 _simulationHash,
        uint256[] memory _agentIds,
        address[] memory _recipients,
        uint256[] memory _balances
    ) ERC20("DILEMMA", "DLM") {
        // Mint tokens based on simulation results
    }
    
    // Tokens are non-transferable
    function transfer(address, uint256) public pure override returns (bool) {
        revert("DILEMMA tokens are non-transferable");
    }
}
```

### Key Features

1. **Immutable Distribution**
   - Tokens minted only at deployment
   - Distribution based on final simulation balances
   - No additional minting possible

2. **Non-Transferable**
   - Tokens cannot be transferred
   - Represents final political power
   - Prevents post-simulation manipulation

3. **Verifiable**
   - Simulation hash stored on-chain
   - Anyone can verify the simulation results
   - Deterministic replay possible

4. **Agent Mapping**
   - Each agent ID mapped to wallet address
   - Bidirectional lookup
   - Transparent ownership

## Wallet Generation

Wallets are generated deterministically:

```python
seed_string = f"cheaters_dilemma_agent_{agent_id}_seed_{seed}"
seed_hash = hashlib.sha256(seed_string.encode()).digest()
account = Account.from_key(seed_hash)
```

This ensures:
- Same seed = same wallets
- Reproducible for verification
- No external wallet required
- Fully deterministic

## Security Considerations

### 1. Private Key Management

⚠️ **CRITICAL**: The deployment script generates `agent_wallets_seed{seed}.json` containing private keys.

```json
{
  "seed": 42,
  "simulation_hash": "0x...",
  "wallets": [
    {
      "agent_id": 0,
      "strategy": "politician",
      "address": "0x...",
      "private_key": "0x...",
      "balance": 456,
      "alive": true
    }
  ]
}
```

**Keep this file secure!** It contains all agent private keys.

### 2. Deployer Wallet

- Fund deployer wallet with testnet tokens before deployment
- Keep deployer private key in `.env` file (never commit!)
- Use hardware wallet for mainnet deployments

### 3. Contract Verification

After deployment, verify the contract on the block explorer:

```bash
forge verify-contract \
  --chain-id 41454 \
  --compiler-version v0.8.20 \
  0x... \
  contracts/DilemmaToken.sol:DilemmaToken
```

## Verification & Replay

### Verify Simulation Hash

Anyone can verify the simulation results:

1. Download simulation results JSON
2. Compute hash using same algorithm
3. Compare with on-chain hash

```python
from scripts.deploy_token import SimulationHasher

# Load simulation results
with open('simulation_results_demo_seed42.json', 'r') as f:
    results = json.load(f)

# Compute hash
computed_hash = SimulationHasher.compute_hash(results['result'])

# Verify on-chain
contract.functions.verifySimulationHash(computed_hash).call()
# Returns: True
```

### Replay Simulation

Deterministic replay with same seed:

```bash
cd backend
python demo_flow.py  # Uses seed 42

# Compare results
diff simulation_results_demo_seed42.json previous_results.json
# Should be identical
```

## Governance Demonstration

The simulation demonstrates:

1. **Token Accumulation = Power**
   - Agents accumulate tokens through work, stealing, attacking
   - More tokens = more governance influence

2. **Governance Capture**
   - Top agents can pass proposals with token weight
   - Minority agents have less influence
   - Corruption emerges naturally

3. **Strategic Voting**
   - Agents vote based on utility calculation
   - Consider proposal impact on token balance
   - Form implicit alliances

4. **Institutional Corruption**
   - Powerful agents change rules to benefit themselves
   - Increase attack costs to protect position
   - Decrease penalties for their preferred actions

## Metrics & Analytics

### Key Metrics

1. **Gini Coefficient**
   - Measures token distribution inequality
   - 0 = perfect equality
   - 1 = perfect inequality

2. **Governance Capture**
   - % of proposals passed by top 2 agents
   - Indicates concentration of power

3. **Winner Analysis**
   - Final token balance
   - Strategy used
   - Survival status

4. **Event Statistics**
   - Total actions taken
   - Success/failure rates
   - Governance participation

## Troubleshooting

### Issue: Cannot connect to RPC

```
❌ Error: Cannot connect to RPC: https://testnet-rpc.monad.xyz
```

**Solution**: Verify Monad testnet RPC URL in documentation.

### Issue: Insufficient funds

```
❌ Error: Insufficient funds for gas
```

**Solution**: Fund deployer wallet from Monad testnet faucet.

### Issue: Contract deployment failed

```
❌ Error: Contract deployment failed
```

**Solution**: Check gas limit and gas price settings.

### Issue: Simulation results not found

```
❌ Error: Simulation results not found: simulation_results_demo_seed42.json
```

**Solution**: Run `python demo_flow.py` first to generate results.

## Production Deployment Checklist

- [ ] Run simulation with production seed
- [ ] Verify simulation results
- [ ] Compile smart contract
- [ ] Test deployment on testnet
- [ ] Verify contract on explorer
- [ ] Test token distribution
- [ ] Verify simulation hash on-chain
- [ ] Document deployment parameters
- [ ] Secure private keys
- [ ] Create deployment report

## Additional Resources

- **Monad Documentation**: https://docs.monad.xyz
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts
- **Foundry Book**: https://book.getfoundry.sh
- **Web3.py Documentation**: https://web3py.readthedocs.io

## Support

For issues or questions:
1. Check simulation logs
2. Verify configuration
3. Review error messages
4. Check Monad testnet status

## License

MIT License - See LICENSE file for details.
