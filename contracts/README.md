# DILEMMA Token Smart Contract

## Overview

The DILEMMA (DLM) token is an ERC20 token that encodes the final political power distribution from The Cheater's Dilemma simulation on-chain.

## Contract Details

- **Name**: DILEMMA
- **Symbol**: DLM
- **Network**: Monad Testnet
- **Solidity Version**: 0.8.20
- **Base**: OpenZeppelin ERC20

## Features

### 1. Immutable Distribution
- Tokens minted only at deployment
- Distribution based on final simulation balances
- No additional minting possible

### 2. Non-Transferable
- `transfer()` reverts with error message
- `transferFrom()` reverts with error message
- `approve()` reverts with error message
- Tokens represent final political power and cannot be moved

### 3. Simulation Verification
- Immutable `simulationHash` stored on-chain
- Anyone can verify simulation results
- `verifySimulationHash()` function for verification

### 4. Agent Mapping
- `agentWallets` mapping: agent ID → wallet address
- `walletToAgent` mapping: wallet address → agent ID
- Bidirectional lookup for transparency

## Compilation

### Using Foundry

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Compile
forge build

# Test (if tests are added)
forge test
```

### Using Hardhat

```bash
# Install dependencies
npm install --save-dev hardhat @openzeppelin/contracts

# Compile
npx hardhat compile
```

## Deployment

### Prerequisites

1. **Monad Testnet RPC URL**
   ```bash
   export MONAD_RPC_URL="https://testnet-rpc.monad.xyz"
   ```

2. **Deployer Private Key**
   ```bash
   export DEPLOYER_PRIVATE_KEY="0x..."
   ```

3. **Fund Deployer Wallet**
   - Get testnet tokens from Monad faucet

### Deploy Using Python Script

```bash
cd ../backend
python scripts/deploy_token.py simulation_results_demo_seed42.json
```

### Deploy Using Foundry

```bash
# Set environment variables
export MONAD_RPC_URL="https://testnet-rpc.monad.xyz"
export DEPLOYER_PRIVATE_KEY="0x..."

# Deploy
forge create DilemmaToken \
  --rpc-url $MONAD_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --constructor-args \
    "0x..." \  # simulationHash
    "[0,1,2,3,4,5,6,7]" \  # agentIds
    "[0x...,0x...,...]" \  # recipients
    "[456,234,178,...]"    # balances
```

## Contract Interface

### Constructor

```solidity
constructor(
    bytes32 _simulationHash,
    uint256[] memory _agentIds,
    address[] memory _recipients,
    uint256[] memory _balances
)
```

**Parameters**:
- `_simulationHash`: SHA256 hash of simulation results
- `_agentIds`: Array of agent IDs from simulation
- `_recipients`: Array of wallet addresses (one per agent)
- `_balances`: Array of token amounts (final simulation balances)

**Requirements**:
- All arrays must have same length
- At least one agent required
- Simulation hash must not be zero
- All recipients must be valid addresses
- All balances must be positive

### Read Functions

#### `simulationHash() → bytes32`
Returns the immutable simulation hash.

#### `deploymentTimestamp() → uint256`
Returns the timestamp when contract was deployed.

#### `agentCount() → uint256`
Returns the total number of agents.

#### `agentWallets(uint256 agentId) → address`
Returns the wallet address for a specific agent ID.

#### `walletToAgent(address wallet) → uint256`
Returns the agent ID for a specific wallet address.

#### `getAgentWallet(uint256 agentId) → address`
Returns the wallet address for a specific agent ID.

#### `getAgentId(address wallet) → uint256`
Returns the agent ID for a specific wallet address.

#### `verifySimulationHash(bytes32 _hash) → bool`
Verifies if a hash matches the stored simulation hash.

#### `getDeploymentInfo() → (bytes32, uint256, uint256, uint256)`
Returns deployment information:
- Simulation hash
- Deployment timestamp
- Agent count
- Total supply

### ERC20 Functions (Overridden)

#### `transfer(address, uint256) → bool`
**Reverts** with "DILEMMA tokens are non-transferable"

#### `transferFrom(address, address, uint256) → bool`
**Reverts** with "DILEMMA tokens are non-transferable"

#### `approve(address, uint256) → bool`
**Reverts** with "DILEMMA tokens cannot be approved"

### Standard ERC20 Functions (Inherited)

- `balanceOf(address) → uint256`
- `totalSupply() → uint256`
- `name() → string` (returns "DILEMMA")
- `symbol() → string` (returns "DLM")
- `decimals() → uint8` (returns 18)

## Events

### `AgentTokensMinted`

```solidity
event AgentTokensMinted(
    uint256 indexed agentId,
    address indexed wallet,
    uint256 amount
)
```

Emitted when tokens are minted to an agent during deployment.

## Verification

### Verify Contract on Explorer

```bash
forge verify-contract \
  --chain-id 41454 \
  --compiler-version v0.8.20 \
  --constructor-args $(cast abi-encode "constructor(bytes32,uint256[],address[],uint256[])" ...) \
  0x... \
  DilemmaToken
```

### Verify Simulation Hash

```python
from scripts.deploy_token import SimulationHasher
import json

# Load simulation results
with open('simulation_results_demo_seed42.json', 'r') as f:
    results = json.load(f)

# Compute hash
computed_hash = SimulationHasher.compute_hash(results['result'])

# Verify on-chain (using web3)
contract.functions.verifySimulationHash(computed_hash).call()
# Returns: True
```

## Security Considerations

### 1. Immutability
- Contract has no owner
- No upgrade mechanism
- No additional minting
- Distribution is final

### 2. Non-Transferability
- Tokens cannot be transferred
- Prevents post-simulation manipulation
- Represents final political power

### 3. Transparency
- Simulation hash stored on-chain
- Agent-wallet mappings public
- All data verifiable

### 4. No External Dependencies
- No oracles
- No external contracts
- Self-contained logic

## Gas Estimates

Approximate gas costs (may vary):

- **Deployment**: ~2,500,000 gas (for 8 agents)
- **Read functions**: ~30,000 gas
- **Transfer attempts**: ~25,000 gas (reverts)

## Testing

### Unit Tests (Example)

```solidity
// test/DilemmaToken.t.sol
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../DilemmaToken.sol";

contract DilemmaTokenTest is Test {
    DilemmaToken token;
    
    function setUp() public {
        bytes32 hash = keccak256("test");
        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;
        
        address[] memory recipients = new address[](2);
        recipients[0] = address(0x1);
        recipients[1] = address(0x2);
        
        uint256[] memory balances = new uint256[](2);
        balances[0] = 100;
        balances[1] = 200;
        
        token = new DilemmaToken(hash, ids, recipients, balances);
    }
    
    function testTotalSupply() public {
        assertEq(token.totalSupply(), 300);
    }
    
    function testTransferReverts() public {
        vm.expectRevert("DILEMMA tokens are non-transferable");
        token.transfer(address(0x3), 10);
    }
}
```

Run tests:
```bash
forge test
```

## License

MIT License

## Support

For issues or questions:
1. Check deployment logs
2. Verify configuration
3. Review error messages
4. Check Monad testnet status

## Additional Resources

- [OpenZeppelin ERC20 Documentation](https://docs.openzeppelin.com/contracts/4.x/erc20)
- [Foundry Book](https://book.getfoundry.sh)
- [Monad Documentation](https://docs.monad.xyz)
