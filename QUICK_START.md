# Quick Start Guide - The Cheater's Dilemma

## 🚀 Run the Complete Demo in 3 Steps

### Step 1: Run the Simulation

```bash
cd backend
python demo_flow.py
```

**Output**: `simulation_results_demo_seed42.json`

**What happens**:
- 8 AI agents compete for tokens
- Token-weighted governance voting
- Utility-based strategic decisions
- Deterministic results (seed=42)
- ~200 turns of gameplay

**Expected runtime**: 5-10 seconds

---

### Step 2: Deploy the Token (Demo Mode)

```bash
cd backend
python scripts/deploy_token.py simulation_results_demo_seed42.json
```

**Output**: 
- `agent_wallets_seed42.json` (⚠️ contains private keys!)
- Console output with deployment summary

**What happens**:
- Reads simulation results
- Computes simulation hash
- Generates deterministic wallets for agents
- Simulates contract deployment
- Shows token distribution

**Expected runtime**: 1-2 seconds

---

### Step 3: Verify Determinism

```bash
cd backend
python demo_flow.py
```

**What to check**:
- Results should be identical to Step 1
- Same winner, same balances, same events
- Proves deterministic replay

---

## 📊 Understanding the Output

### Simulation Summary

```
============================================================
THE CHEATER'S DILEMMA - AGENT + TOKEN INTEGRATION DEMO
============================================================

🏆 LEADERBOARD:
   1. Agent 3 (politician): 456 tokens (alive)
   2. Agent 1 (warlord): 234 tokens (eliminated)
   3. Agent 5 (greedy): 178 tokens (alive)
   ...

📈 FINAL METRICS:
   - Winner: Agent 3 (politician)
   - Final Gini Coefficient: 0.45678
   - Governance Capture: 67.5%
   - Alive Agents: 5/8
```

**Key Metrics Explained**:

- **Winner**: Agent with highest token balance
- **Gini Coefficient**: Inequality measure (0=equal, 1=unequal)
- **Governance Capture**: % of proposals passed by top agents
- **Alive Agents**: Agents not eliminated by attacks

### Token Distribution

```
💰 TOKEN BALANCE DISTRIBUTION:
   Agent  0 (greedy    ):  456 tokens (alive)
   Agent  1 (warlord   ):  234 tokens (eliminated)
   Agent  2 (politician):  178 tokens (alive)
   ...
```

**What it means**:
- Final token balance = final political power
- Alive agents survived all attacks
- Eliminated agents were attacked successfully

### Deployment Summary

```
============================================================
🎉 DEPLOYMENT SUMMARY
============================================================
✅ Contract Address: 0x...
✅ Total Supply: 1234 DLM
✅ Simulation Hash: 0x...
✅ Agent Count: 8

📊 TOKEN DISTRIBUTION:
   1. Agent 3 (politician): 456 DLM (37.0%)
   2. Agent 1 (warlord): 234 DLM (19.0%)
   ...
```

**What it means**:
- Contract address: Where token is deployed
- Total supply: Sum of all agent balances
- Simulation hash: Verification hash
- Distribution: Who got how many tokens

---

## 🎮 How the Simulation Works

### Token-Based Economics

1. **Initial Distribution**
   - Each agent starts with 8-14 tokens (random)
   - Token balance = economic power

2. **Actions Affect Tokens**
   - **WORK**: Gain 2-4 tokens (safe)
   - **STEAL**: Take 3 tokens from target (risky)
   - **ATTACK**: Eliminate target, loot 40% of their tokens (costs 8 tokens)

3. **Governance Costs Nothing**
   - **PROPOSE_RULE**: Suggest rule change
   - **VOTE_RULE**: Vote yes/no on proposal

### Token-Weighted Governance

1. **Voting Weight = Token Balance**
   - Agent with 100 tokens = 100 votes
   - Agent with 10 tokens = 10 votes

2. **Proposal Passes If**
   - YES votes > 50% of total token supply
   - Example: Total supply = 1000 tokens
   - Need: >500 tokens voting YES

3. **Strategic Voting**
   - Agents vote based on self-interest
   - Consider proposal impact on token balance
   - Form implicit alliances

### Utility-Based Decisions

Each agent computes utility for every possible action:

```
Utility(action) = α × expected_token_gain
                - β × retaliation_risk
                + γ × governance_influence_gain
                - δ × reputation_loss
```

**Agent Personalities**:
- **Conservative**: Low risk, high governance
- **Aggressive**: High risk, attacks frequently
- **Balanced**: Moderate everything
- **Politician**: Heavy governance focus
- **Opportunist**: Exploits opportunities

---

## 🧪 Experiment with Different Scenarios

### Change the Seed

```python
# In demo_flow.py, modify:
world = service.create_world(
    agent_count=8,
    seed=123,  # Change this!
    turns=200
)
```

**Different seeds = different outcomes**

### Change Agent Count

```python
world = service.create_world(
    agent_count=12,  # More agents!
    seed=42,
    turns=200
)
```

**More agents = more complex dynamics**

### Change Turn Count

```python
world = service.create_world(
    agent_count=8,
    seed=42,
    turns=500  # Longer game!
)
```

**More turns = more governance changes**

---

## 🔍 Analyzing Results

### Check Governance Capture

Look for:
- High Gini coefficient (>0.5) = inequality
- High governance capture (>60%) = power concentration
- Few alive agents = aggressive gameplay

### Check Token Distribution

Look for:
- Winner's percentage of total supply
- Gap between 1st and 2nd place
- Number of eliminated agents

### Check Event Log

```python
# In simulation_results_demo_seed42.json
{
  "events": [
    {
      "turn": 1,
      "actor": 0,
      "action": "WORK",
      "outcome": "success",
      "details": {"gain": 3}
    },
    {
      "turn": 2,
      "actor": 1,
      "action": "STEAL",
      "target": 0,
      "outcome": "success",
      "details": {"amount": 3}
    }
  ]
}
```

**Analyze**:
- Which actions were most common?
- Which agents were most aggressive?
- When did governance changes happen?

---

## 🛠️ Troubleshooting

### Issue: ModuleNotFoundError

```
ModuleNotFoundError: No module named 'app'
```

**Solution**: Make sure you're in the `backend` directory:
```bash
cd backend
python demo_flow.py
```

### Issue: File not found

```
FileNotFoundError: simulation_results_demo_seed42.json
```

**Solution**: Run the simulation first:
```bash
python demo_flow.py
```

### Issue: Import errors

```
ImportError: cannot import name 'ClearAgent'
```

**Solution**: Make sure all files are in place:
```bash
ls app/agents/clear_agent.py  # Should exist
```

---

## 📚 Next Steps

### 1. Understand the Code

Read these files in order:
1. `backend/app/domain/models.py` - Core data structures
2. `backend/app/domain/world.py` - Simulation engine
3. `backend/app/agents/clear_agent.py` - Agent decision logic
4. `backend/app/core/governance.py` - Governance system

### 2. Deploy to Monad Testnet

Follow the full deployment guide:
```bash
cat DEPLOYMENT_GUIDE.md
```

### 3. Analyze Multiple Runs

```bash
# Run with different seeds
for seed in 42 123 456 789; do
    # Modify demo_flow.py to use $seed
    python demo_flow.py
done

# Compare results
```

### 4. Customize Agents

Create your own agent personality:
```python
from app.agents.clear_agent import AgentPersonality, ClearAgent

my_agent = ClearAgent(AgentPersonality(
    risk_tolerance=0.9,
    aggression=0.1,
    governance_bias=0.8,
    corruption_threshold=0.3
))
```

---

## 🎯 Key Takeaways

### What This Demonstrates

✅ **Autonomous AI agents** competing for resources  
✅ **Token-weighted governance** (not one-agent-one-vote)  
✅ **Governance capture** through token accumulation  
✅ **Institutional corruption** emerging naturally  
✅ **Deterministic replay** for verification  
✅ **On-chain encoding** of final political power  

### Architecture Principles

✅ **Clean separation**: Simulation ≠ Blockchain  
✅ **Determinism**: Same seed = same results  
✅ **No LLMs**: Pure algorithmic agents  
✅ **No async**: No blockchain calls during simulation  
✅ **Post-simulation**: Deploy tokens after simulation  

### Real-World Parallels

- **Token accumulation** = Wealth concentration
- **Governance capture** = Political lobbying
- **Strategic voting** = Coalition building
- **Corruption threshold** = Ethical boundaries
- **Elimination** = Market competition

---

## 📖 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete technical details
- **DEPLOYMENT_GUIDE.md** - Full deployment instructions
- **contracts/README.md** - Smart contract documentation
- **BACKEND_CHANGES_DOCUMENTATION.md** - Original backend docs

---

## 🤝 Support

For questions or issues:
1. Check the error message
2. Review the relevant documentation
3. Verify your environment setup
4. Check file paths and permissions

---

**Ready to see governance corruption in action? Run the demo now!**

```bash
cd backend && python demo_flow.py
```
