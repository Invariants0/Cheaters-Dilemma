# Deployment Checklist - DILEMMA Token

## Pre-Deployment

### Environment Setup

- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed (if using Hardhat)
- [ ] Foundry installed (if using Foundry)
- [ ] Git repository cloned
- [ ] All dependencies installed

```bash
cd backend
pip install -r requirements.txt  # or use pyproject.toml
pip install web3 eth-account
```

### Monad Testnet Setup

- [ ] Monad testnet RPC URL obtained
- [ ] Monad testnet chain ID verified (41454)
- [ ] Monad testnet explorer URL obtained
- [ ] Testnet faucet URL identified

### Wallet Setup

- [ ] Deployer wallet created
- [ ] Deployer private key secured (in .env, not committed)
- [ ] Deployer wallet funded with testnet tokens
- [ ] Backup of deployer wallet created

### Smart Contract Preparation

- [ ] Contract code reviewed (`contracts/DilemmaToken.sol`)
- [ ] OpenZeppelin contracts installed
- [ ] Contract compiled successfully
- [ ] Contract tests written (optional but recommended)
- [ ] Contract tests passing (if written)

```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts
forge build
forge test  # if tests exist
```

## Simulation Phase

### Run Simulation

- [ ] Simulation configuration reviewed
  - [ ] Seed value chosen
  - [ ] Agent count set
  - [ ] Turn count set
  - [ ] Initial token range configured

- [ ] Simulation executed successfully
```bash
cd backend
python demo_flow.py
```

- [ ] Simulation results generated
  - [ ] `simulation_results_demo_seed42.json` created
  - [ ] Results reviewed for correctness
  - [ ] Winner identified
  - [ ] Token distribution analyzed

### Verify Determinism

- [ ] Determinism verification script run
```bash
python verify_determinism.py
```

- [ ] All runs produced identical results
- [ ] Simulation hash computed correctly
- [ ] No non-deterministic behavior detected

### Analyze Results

- [ ] Leaderboard reviewed
  - [ ] Winner makes sense
  - [ ] Token distribution reasonable
  - [ ] Survival rate acceptable

- [ ] Metrics analyzed
  - [ ] Gini coefficient calculated
  - [ ] Governance capture measured
  - [ ] Event statistics reviewed

- [ ] Governance history examined
  - [ ] Rule changes logged
  - [ ] Voting patterns analyzed
  - [ ] Power concentration identified

## Deployment Phase

### Pre-Deployment Checks

- [ ] Simulation results file exists
- [ ] Simulation results validated
- [ ] Deployer wallet has sufficient funds
- [ ] RPC endpoint is accessible
- [ ] Network configuration correct

### Environment Variables

Create `.env` file:

```bash
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
MONAD_CHAIN_ID=41454
MONAD_EXPLORER=https://testnet-explorer.monad.xyz
DEPLOYER_PRIVATE_KEY=0x...
GAS_LIMIT=3000000
GAS_PRICE_GWEI=20
```

- [ ] `.env` file created
- [ ] All variables set correctly
- [ ] `.env` added to `.gitignore`
- [ ] Private key never committed to git

### Deploy Token Contract

- [ ] Deployment script reviewed
```bash
cd backend
python scripts/deploy_token.py simulation_results_demo_seed42.json
```

- [ ] Deployment executed successfully
- [ ] Contract address obtained
- [ ] Transaction hash obtained
- [ ] Deployment confirmed on explorer

### Verify Deployment

- [ ] Contract visible on block explorer
- [ ] Total supply matches simulation
- [ ] Agent count correct
- [ ] Simulation hash stored correctly
- [ ] All agents received correct balances

### Save Deployment Information

- [ ] Contract address saved
- [ ] Transaction hash saved
- [ ] Deployment timestamp recorded
- [ ] Agent wallet file saved (`agent_wallets_seed42.json`)
- [ ] Agent wallet file backed up securely
- [ ] Deployment summary documented

## Post-Deployment

### Contract Verification

- [ ] Contract source code verified on explorer
```bash
forge verify-contract \
  --chain-id 41454 \
  --compiler-version v0.8.20 \
  0x... \
  DilemmaToken
```

- [ ] Verification successful
- [ ] Contract code visible on explorer
- [ ] Constructor arguments verified

### Functional Testing

- [ ] Read functions tested
  - [ ] `totalSupply()` returns correct value
  - [ ] `balanceOf()` returns correct balances
  - [ ] `simulationHash()` returns correct hash
  - [ ] `agentCount()` returns correct count
  - [ ] `getAgentWallet()` returns correct addresses
  - [ ] `getDeploymentInfo()` returns correct data

- [ ] Transfer restrictions tested
  - [ ] `transfer()` reverts correctly
  - [ ] `transferFrom()` reverts correctly
  - [ ] `approve()` reverts correctly

- [ ] Verification functions tested
  - [ ] `verifySimulationHash()` works correctly

### Documentation

- [ ] Deployment report created
  - [ ] Contract address
  - [ ] Deployment transaction
  - [ ] Deployment timestamp
  - [ ] Total supply
  - [ ] Agent count
  - [ ] Simulation hash
  - [ ] Token distribution summary

- [ ] Agent wallet information documented
  - [ ] Agent IDs
  - [ ] Wallet addresses
  - [ ] Token balances
  - [ ] Survival status

- [ ] Governance analysis documented
  - [ ] Gini coefficient
  - [ ] Governance capture percentage
  - [ ] Winner analysis
  - [ ] Key events

### Security Review

- [ ] Private keys secured
  - [ ] Agent wallet file encrypted or secured
  - [ ] Deployer private key removed from scripts
  - [ ] No private keys in git history
  - [ ] Backup stored securely

- [ ] Contract security reviewed
  - [ ] No upgrade mechanism (confirmed)
  - [ ] No additional minting (confirmed)
  - [ ] Transfer restrictions working (confirmed)
  - [ ] Immutable data verified (confirmed)

### Communication

- [ ] Deployment announcement prepared
- [ ] Explorer links shared
- [ ] Documentation links shared
- [ ] Simulation results shared
- [ ] Verification instructions provided

## Verification & Audit

### Simulation Verification

Anyone can verify the simulation:

- [ ] Simulation results JSON published
- [ ] Seed value disclosed
- [ ] Configuration parameters disclosed
- [ ] Verification instructions provided

```bash
# Others can verify by running:
python demo_flow.py  # with same seed
python verify_determinism.py
```

### On-Chain Verification

Anyone can verify the deployment:

- [ ] Contract address published
- [ ] Simulation hash published
- [ ] Agent-wallet mappings visible
- [ ] Token distribution visible

```python
# Others can verify by:
from scripts.deploy_token import SimulationHasher
computed_hash = SimulationHasher.compute_hash(results)
contract.functions.verifySimulationHash(computed_hash).call()
# Should return True
```

### Reproducibility Test

- [ ] Fresh clone of repository
- [ ] Run simulation with same seed
- [ ] Compare results with original
- [ ] Verify hashes match
- [ ] Confirm determinism

## Maintenance

### Monitoring

- [ ] Contract address monitored
- [ ] Token balances monitored
- [ ] No unexpected transactions
- [ ] Explorer link bookmarked

### Documentation Updates

- [ ] README updated with deployment info
- [ ] Deployment guide updated
- [ ] Contract address added to docs
- [ ] Explorer links added to docs

### Backup

- [ ] All deployment files backed up
  - [ ] Simulation results JSON
  - [ ] Agent wallet JSON
  - [ ] Deployment logs
  - [ ] Contract artifacts

- [ ] Backup stored securely
- [ ] Backup tested (can restore)

## Troubleshooting

### Common Issues

#### Issue: RPC Connection Failed
- [ ] Verify RPC URL is correct
- [ ] Check network connectivity
- [ ] Try alternative RPC endpoint
- [ ] Check Monad testnet status

#### Issue: Insufficient Funds
- [ ] Check deployer wallet balance
- [ ] Get more testnet tokens from faucet
- [ ] Verify gas price settings
- [ ] Reduce gas limit if possible

#### Issue: Contract Deployment Failed
- [ ] Check gas limit
- [ ] Check gas price
- [ ] Verify contract compiles
- [ ] Check constructor arguments
- [ ] Review error message

#### Issue: Verification Failed
- [ ] Check compiler version
- [ ] Verify constructor arguments
- [ ] Check optimization settings
- [ ] Try manual verification

#### Issue: Simulation Results Mismatch
- [ ] Verify seed is correct
- [ ] Check configuration parameters
- [ ] Ensure no code changes
- [ ] Run determinism verification

## Final Checklist

### Before Going Live

- [ ] All tests passing
- [ ] Determinism verified
- [ ] Contract deployed successfully
- [ ] Contract verified on explorer
- [ ] All functions tested
- [ ] Documentation complete
- [ ] Security review done
- [ ] Backups created
- [ ] Private keys secured

### After Going Live

- [ ] Deployment announced
- [ ] Documentation published
- [ ] Explorer links shared
- [ ] Verification instructions provided
- [ ] Monitoring in place
- [ ] Support channels ready

## Sign-Off

### Deployment Team

- [ ] Backend Engineer: _______________  Date: _______
- [ ] Smart Contract Engineer: _______________  Date: _______
- [ ] Security Reviewer: _______________  Date: _______

### Deployment Details

- **Deployment Date**: _______________________
- **Network**: Monad Testnet
- **Contract Address**: _______________________
- **Transaction Hash**: _______________________
- **Simulation Seed**: _______________________
- **Total Supply**: _______________________
- **Agent Count**: _______________________

### Notes

_______________________________________________________
_______________________________________________________
_______________________________________________________

---

## Quick Reference

### Essential Commands

```bash
# Run simulation
cd backend && python demo_flow.py

# Verify determinism
cd backend && python verify_determinism.py

# Deploy token
cd backend && python scripts/deploy_token.py simulation_results_demo_seed42.json

# Compile contract
cd contracts && forge build

# Verify contract
forge verify-contract --chain-id 41454 --compiler-version v0.8.20 0x... DilemmaToken
```

### Essential Files

- `backend/demo_flow.py` - Run simulation
- `backend/scripts/deploy_token.py` - Deploy token
- `backend/verify_determinism.py` - Verify determinism
- `contracts/DilemmaToken.sol` - Token contract
- `simulation_results_demo_seed42.json` - Simulation output
- `agent_wallets_seed42.json` - Agent wallets (SECURE!)

### Essential Links

- Monad Docs: https://docs.monad.xyz
- OpenZeppelin: https://docs.openzeppelin.com
- Foundry: https://book.getfoundry.sh
- Project README: README.md
- Deployment Guide: DEPLOYMENT_GUIDE.md

---

**Status**: [ ] Not Started  [ ] In Progress  [ ] Complete

**Last Updated**: _______________________
