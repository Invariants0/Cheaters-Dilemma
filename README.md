# The Cheater's Dilemma - Agent + Token Integration

> A deterministic multi-agent governance war simulation demonstrating how autonomous AI agents compete for tokens, capture governance through token accumulation, and how institutional corruption emerges naturally.

## 🎯 Overview

The Cheater's Dilemma is a simulation where AI agents compete for tokens in a world with governance rules they can change through voting. The final token distribution is encoded on-chain via an ERC20 token, representing the final political power distribution.

### Key Features

✅ **Token-Based Economics** - Token balance is the core economic unit  
✅ **Token-Weighted Governance** - Voting power = token balance  
✅ **Utility-Based AI Agents** - Strategic decision making with personality traits  
✅ **Deterministic Simulation** - Same seed = same results every time  
✅ **On-Chain Distribution** - Final power encoded via ERC20 token  
✅ **Clean Architecture** - Simulation, blockchain, and API layers separated  

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+ (for frontend, optional)
- Foundry (for smart contract deployment, optional)

### Run the Demo

```bash
# 1. Run the simulation
cd backend
python demo_flow.py

# 2. Deploy tokens (demo mode)
python scripts/deploy_token.py simulation_results_demo_seed42.json

# 3. Verify determinism
python verify_determinism.py
```

**Expected output**: Complete simulation with token distribution and deployment summary.

See [QUICK_START.md](QUICK_START.md) for detailed instructions.

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 3 steps
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete technical details
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deploy to Monad Testnet
- **[contracts/README.md](contracts/README.md)** - Smart contract documentation

## 🏗️ Architecture

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
                            │ JSON Results
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

## 🎮 How It Works

### 1. Token-Based Economics

Every agent has a token balance that represents their economic power:

- **WORK**: Gain 2-4 tokens (safe, guaranteed)
- **STEAL**: Take 3 tokens from target (risky, can be caught)
- **ATTACK**: Eliminate target, loot 40% of tokens (costs 8 tokens)

### 2. Token-Weighted Governance

Agents can propose and vote on rule changes:

- **Voting weight = token balance** (not one-agent-one-vote)
- **Proposal passes if YES votes > 50% of total token supply**
- Agents with more tokens have more governance influence

### 3. Utility-Based Decisions

Each agent computes utility for every possible action:

```
Utility(action) = α × expected_token_gain
                - β × retaliation_risk
                + γ × governance_influence_gain
                - δ × reputation_loss
```

Agents have different personalities:
- **Conservative**: Low risk, high governance participation
- **Aggressive**: High risk, attacks frequently
- **Politician**: Heavy governance focus
- **Opportunist**: Exploits opportunities

### 4. Emergent Behavior

The simulation demonstrates:
- **Governance capture** through token accumulation
- **Institutional corruption** emerging naturally
- **Strategic alliances** forming implicitly
- **Power concentration** over time

## 🔬 Determinism Guarantee

The simulation is **100% deterministic**:

```bash
# Run 1
python demo_flow.py  # seed=42
# Winner: Agent 3 with 456 tokens

# Run 2
python demo_flow.py  # seed=42
# Winner: Agent 3 with 456 tokens (identical!)
```

**Proof**:
- ✅ Deterministic RNG (Python's Random with fixed seed)
- ✅ No external API calls
- ✅ No async operations
- ✅ No blockchain reads during simulation
- ✅ Pure Python computation

Verify yourself:
```bash
python backend/verify_determinism.py
```

## 🔗 Smart Contract

### DILEMMA (DLM) Token

- **Network**: Monad Testnet
- **Type**: ERC20 (OpenZeppelin)
- **Features**:
  - Minted only at deployment
  - Non-transferable (represents final power)
  - Immutable simulation hash stored
  - Agent-wallet mappings on-chain

### Contract Interface

```solidity
contract DilemmaToken is ERC20 {
    bytes32 public immutable simulationHash;
    uint256 public immutable deploymentTimestamp;
    uint256 public immutable agentCount;
    
    mapping(uint256 => address) public agentWallets;
    mapping(address => uint256) public walletToAgent;
    
    function verifySimulationHash(bytes32 _hash) external view returns (bool);
    function getDeploymentInfo() external view returns (...);
}
```

See [contracts/README.md](contracts/README.md) for full documentation.

## 📊 Example Results

```
============================================================
🏆 LEADERBOARD:
   1. Agent 3 (politician): 456 tokens (alive)
   2. Agent 1 (warlord): 234 tokens (eliminated)
   3. Agent 5 (greedy): 178 tokens (alive)
   4. Agent 0 (cheater): 145 tokens (alive)
   5. Agent 7 (balanced): 98 tokens (alive)
   6. Agent 2 (aggressive): 67 tokens (eliminated)
   7. Agent 4 (conservative): 34 tokens (eliminated)
   8. Agent 6 (opportunist): 22 tokens (eliminated)

📈 FINAL METRICS:
   - Winner: Agent 3 (politician)
   - Final Gini Coefficient: 0.45678
   - Governance Capture: 67.5%
   - Alive Agents: 5/8
   - Total Events: 1234

🏛️  GOVERNANCE CHANGES:
   - Turn 45: Attack cost increased to 10 (by Agent 3)
   - Turn 78: Work income increased to [3,5] (by Agent 0)
   - Turn 123: Steal penalty increased to 4 (by Agent 3)
```

## 🛠️ Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── clear_agent.py      # Utility-based agent (NEW)
│   │   │   ├── cheater.py
│   │   │   ├── greedy.py
│   │   │   ├── politician.py
│   │   │   └── warlord.py
│   │   ├── core/
│   │   │   ├── governance.py       # Token-weighted voting (MODIFIED)
│   │   │   ├── rules.py
│   │   │   └── ...
│   │   ├── domain/
│   │   │   ├── models.py           # Uses token_balance
│   │   │   ├── world.py            # Simulation engine
│   │   │   ├── resolver.py         # Action resolution
│   │   │   └── ...
│   │   └── services/
│   ├── scripts/
│   │   └── deploy_token.py         # Deployment script (NEW)
│   ├── demo_flow.py                # Main demo (UPDATED)
│   └── verify_determinism.py       # Determinism test (NEW)
├── contracts/
│   ├── DilemmaToken.sol            # ERC20 token (NEW)
│   ├── foundry.toml                # Foundry config (NEW)
│   └── README.md                   # Contract docs (NEW)
├── docs/
│   ├── QUICK_START.md              # Quick start guide (NEW)
│   ├── IMPLEMENTATION_SUMMARY.md   # Technical details (NEW)
│   └── DEPLOYMENT_GUIDE.md         # Deployment guide (NEW)
└── README.md                       # This file
```

## 🧪 Testing

### Run Simulation Tests

```bash
cd backend
python demo_flow.py
```

### Verify Determinism

```bash
cd backend
python verify_determinism.py
```

### Test Smart Contract

```bash
cd contracts
forge test
```

## 🚢 Deployment

### Deploy to Monad Testnet

1. **Compile Contract**
   ```bash
   cd contracts
   forge build
   ```

2. **Configure Environment**
   ```bash
   export MONAD_RPC_URL="https://testnet-rpc.monad.xyz"
   export DEPLOYER_PRIVATE_KEY="0x..."
   ```

3. **Run Simulation**
   ```bash
   cd backend
   python demo_flow.py
   ```

4. **Deploy Token**
   ```bash
   python scripts/deploy_token.py simulation_results_demo_seed42.json
   ```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete instructions.

## 📈 Key Metrics

### Gini Coefficient
Measures token distribution inequality:
- **0.0** = Perfect equality (everyone has same tokens)
- **1.0** = Perfect inequality (one agent has all tokens)
- **0.3-0.5** = Moderate inequality (typical result)

### Governance Capture
Percentage of proposals passed by top agents:
- **<30%** = Distributed governance
- **30-60%** = Moderate capture
- **>60%** = High capture (power concentration)

### Survival Rate
Percentage of agents still alive at end:
- **<40%** = Aggressive gameplay
- **40-70%** = Balanced gameplay
- **>70%** = Conservative gameplay

## 🎯 What This Demonstrates

### Autonomous AI Agents
- Strategic decision making
- Personality-driven behavior
- No human intervention
- No LLM required

### Governance Capture
- Token accumulation = power
- Top agents control rule changes
- Minority agents have less influence
- Corruption emerges naturally

### Institutional Corruption
- Powerful agents change rules to benefit themselves
- Increase costs to protect position
- Decrease penalties for preferred actions
- Strategic voting and alliances

### Deterministic Replay
- Same seed = same results
- Verifiable outcomes
- Reproducible for auditing
- Trust through transparency

### On-Chain Encoding
- Final power distribution immutable
- Simulation hash verifiable
- Agent-wallet mappings transparent
- Non-transferable representation

## 🔒 Security Considerations

### Simulation Layer
- ✅ Deterministic (no external randomness)
- ✅ No blockchain calls during simulation
- ✅ Pure Python computation
- ✅ Reproducible results

### Deployment Layer
- ⚠️ Private keys generated (keep secure!)
- ⚠️ Deployer wallet needs funding
- ✅ Deterministic wallet generation
- ✅ Simulation hash verification

### Blockchain Layer
- ✅ Immutable distribution
- ✅ Non-transferable tokens
- ✅ No upgrade mechanism
- ✅ Transparent mappings

## 🤝 Contributing

This is a demonstration project. For production use:

1. Audit smart contracts
2. Test with multiple seeds
3. Verify determinism extensively
4. Secure private key management
5. Use hardware wallets for deployment

## 📄 License

MIT License - See LICENSE file for details.

## 🙏 Acknowledgments

- **OpenZeppelin** - ERC20 implementation
- **Foundry** - Smart contract development
- **Monad** - Testnet infrastructure
- **Python** - Simulation engine

## 📞 Support

For questions or issues:
1. Check [QUICK_START.md](QUICK_START.md)
2. Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
3. Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
4. Check error messages and logs

## 🎓 Learn More

- **Governance Theory**: How token-weighted voting affects outcomes
- **Game Theory**: Strategic decision making in multi-agent systems
- **Mechanism Design**: How rules shape emergent behavior
- **Blockchain**: Immutable encoding of political power

---

**Ready to see governance corruption in action?**

```bash
cd backend && python demo_flow.py
```

**Prove determinism yourself:**

```bash
cd backend && python verify_determinism.py
```

**Deploy to blockchain:**

```bash
cd backend && python scripts/deploy_token.py simulation_results_demo_seed42.json
```

---

Built with ❤️ to demonstrate how autonomous agents compete for power and how governance can be captured through token accumulation.
