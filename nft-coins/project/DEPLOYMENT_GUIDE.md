# 🚀 Nori Farm Deployment Guide

This guide provides step-by-step instructions for deploying the Nori Farm reward system to Binance Smart Chain.

## 📋 Prerequisites

Before deploying, ensure you have:

- Node.js (v16 or higher)
- npm or yarn package manager
- A BSC wallet with BNB for gas fees
- BSCScan API key (for contract verification)
- Git for version control

## 🔧 Environment Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repository-url>
cd nori-farm-reward-system

# Install dependencies
npm install

# Install additional Hardhat dependencies
npm install --save-dev @nomiclabs/hardhat-ethers ethereum-waffle chai
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Wallet Configuration (KEEP PRIVATE!)
PRIVATE_KEY=your_private_key_here

# Network Configuration
BSC_RPC_URL=https://bsc-dataseed.binance.org/
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# API Keys
BSCSCAN_API_KEY=your_bscscan_api_key_here

# Token Configuration
TOKEN_NAME=RewardToken
TOKEN_SYMBOL=RWT
TOTAL_SUPPLY=1000000
```

### 3. Network Setup

Add BSC networks to your MetaMask:

**BSC Mainnet:**
- Network Name: Smart Chain
- RPC URL: https://bsc-dataseed.binance.org/
- Chain ID: 56
- Symbol: BNB
- Block Explorer: https://bscscan.com

**BSC Testnet:**
- Network Name: Smart Chain Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
- Chain ID: 97
- Symbol: tBNB
- Block Explorer: https://testnet.bscscan.com

## 🧪 Local Development

### 1. Start Local Hardhat Network

```bash
# Terminal 1: Start local blockchain
npx hardhat node
```

### 2. Deploy to Local Network

```bash
# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Run Tests

```bash
# Run comprehensive test suite
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/RewardToken.test.js
```

### 4. Start Frontend

```bash
# Start the React development server
npm run dev
```

## 🌐 Testnet Deployment

### 1. Get Testnet BNB

Visit the [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart) to get test BNB.

### 2. Deploy to BSC Testnet

```bash
# Deploy contracts to testnet
npx hardhat run scripts/deploy.js --network bsc-testnet
```

### 3. Verify Contracts

```bash
# Verify contracts on BSCScan testnet
npx hardhat run scripts/verify.js --network bsc-testnet
```

### 4. Test Contract Interactions

```bash
# Run interaction script to test functionality
npx hardhat run scripts/interact.js --network bsc-testnet
```

## 🚀 Mainnet Deployment

⚠️ **WARNING**: Mainnet deployment uses real BNB. Ensure thorough testing on testnet first!

### 1. Final Preparations

```bash
# Run final tests
npm run test

# Compile contracts
npx hardhat compile

# Check contract sizes
npx hardhat size-contracts
```

### 2. Deploy to BSC Mainnet

```bash
# Deploy to mainnet (requires real BNB)
npx hardhat run scripts/deploy.js --network bsc-mainnet
```

### 3. Verify on BSCScan

```bash
# Verify contracts on BSCScan mainnet
npx hardhat run scripts/verify.js --network bsc-mainnet
```

### 4. Update Frontend Configuration

Update your frontend environment variables:

```env
REACT_APP_TOKEN_ADDRESS=0x_your_deployed_token_address
REACT_APP_STAKING_ADDRESS=0x_your_deployed_staking_address
REACT_APP_NETWORK_ID=56
```

## 📊 Post-Deployment Tasks

### 1. Initial Token Distribution

```javascript
// Example distribution script
const distributionPlan = {
  stakingRewards: "400000", // 40%
  liquidityPool: "250000",  // 25%
  development: "150000",    // 15%
  marketing: "100000",      // 10%
  team: "100000"           // 10%
};

// Execute distribution according to your tokenomics
```

### 2. Set Up Liquidity

1. **PancakeSwap Listing**:
   - Add liquidity to PancakeSwap
   - Create RWT/BNB trading pair
   - Set initial price and liquidity amount

2. **Price Monitoring**:
   - Set up price alerts
   - Monitor trading volume
   - Track liquidity metrics

### 3. Security Measures

1. **Multi-sig Setup** (Recommended):
   - Transfer ownership to multi-sig wallet
   - Require multiple signatures for critical operations
   - Set up emergency procedures

2. **Monitoring**:
   - Set up contract monitoring
   - Track unusual transactions
   - Monitor reward distribution

## 🔍 Verification and Testing

### Contract Verification Checklist

- [ ] RewardToken contract verified on BSCScan
- [ ] StakingRewards contract verified on BSCScan
- [ ] Source code matches deployed bytecode
- [ ] Constructor parameters are correct
- [ ] Contract ownership is properly set

### Functionality Testing

- [ ] Token minting works correctly
- [ ] Staking mechanism functions properly
- [ ] Reward calculation is accurate
- [ ] Unstaking returns correct amounts
- [ ] Emergency functions are accessible to owner only

### Frontend Integration

- [ ] Wallet connection works
- [ ] Contract interactions are successful
- [ ] Real-time data updates correctly
- [ ] Error handling is robust
- [ ] Mobile responsiveness is maintained

## 🆘 Troubleshooting

### Common Issues

1. **Gas Estimation Failed**:
   ```bash
   # Increase gas limit in hardhat.config.js
   gas: 5000000,
   gasPrice: 20000000000
   ```

2. **Verification Failed**:
   ```bash
   # Ensure exact compiler version and settings match
   # Check constructor parameters are correct
   # Verify network configuration
   ```

3. **Transaction Reverted**:
   ```bash
   # Check contract state and permissions
   # Verify sufficient token balances
   # Ensure proper approvals are set
   ```

### Getting Help

- Check the [Hardhat Documentation](https://hardhat.org/docs)
- Review [BSC Developer Docs](https://docs.binance.org/smart-chain/developer/deploy/hardhat.html)
- Join the [BSC Developer Community](https://t.me/BinanceSmartChain)

## 📈 Monitoring and Maintenance

### Key Metrics to Track

1. **Token Metrics**:
   - Total supply and circulation
   - Holder distribution
   - Transfer volume

2. **Staking Metrics**:
   - Total value locked (TVL)
   - Active stakers count
   - Average staking duration
   - Reward distribution rate

3. **Contract Health**:
   - Gas usage patterns
   - Transaction success rate
   - Error frequency

### Regular Maintenance

- Monitor contract balances
- Check reward pool sustainability
- Update documentation as needed
- Respond to community feedback
- Plan future upgrades

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ All contracts are deployed and verified
- ✅ Frontend connects and interacts properly
- ✅ Staking and rewards work as expected
- ✅ Security measures are in place
- ✅ Documentation is complete and accurate
- ✅ Community can easily interact with the system

---

**Remember**: Always test thoroughly on testnet before mainnet deployment. Keep your private keys secure and consider using hardware wallets for mainnet operations.