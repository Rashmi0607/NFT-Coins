# 🚀 Nori Farm - NFT-Based Reward System

A comprehensive NFT-based reward system built on Binance Smart Chain featuring time-based staking rewards and a modern React frontend.

![Nori Farm Dashboard](https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## 📋 Overview

Nori Farm is an advanced decentralized finance (DeFi) platform that allows users to stake RewardTokens (RWT) and earn passive income through a sophisticated time-based reward system. The platform features a beautiful, responsive web interface and production-ready smart contracts deployed on Binance Smart Chain.

### 🎯 Key Features

- **RewardToken (RWT)**: Custom ERC-20 token with controlled minting and burning
- **Time-Based Staking**: Earn 1% hourly rewards (876% APY) through smart contract automation
- **Real-Time Dashboard**: Monitor your staking performance with live updates
- **Secure Smart Contracts**: Audited and verified contracts with reentrancy protection
- **Responsive Design**: Beautiful UI that works perfectly on all devices
- **BSC Integration**: Built on Binance Smart Chain for low fees and fast transactions

## 🏗️ Architecture

### Smart Contracts

1. **RewardToken.sol**
   - ERC-20 compliant token
   - 1,000,000 total supply
   - Controlled minting system
   - Burn functionality for deflation

2. **StakingRewards.sol**
   - Time-based reward calculation
   - Flexible staking/unstaking
   - Automatic reward distribution
   - Emergency withdrawal protection

### Token Allocation

| Category | Percentage | Amount | Purpose |
|----------|------------|--------|---------|
| Staking Rewards | 40% | 400,000 RWT | Long-term incentives |
| Liquidity Pool | 25% | 250,000 RWT | DEX liquidity |
| Development | 15% | 150,000 RWT | Platform development |
| Marketing | 10% | 100,000 RWT | Community growth |
| Team | 10% | 100,000 RWT | Team allocation |

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet
- BNB for gas fees (BSC network)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nori-farm
   cd nori-farm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Wallet Configuration
   PRIVATE_KEY=your_private_key_here
   
   # Network Configuration
   BSC_RPC_URL=https://bsc-dataseed.binance.org/
   BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
   
   # API Keys
   BSCSCAN_API_KEY=your_bscscan_api_key
   
   # Token Parameters
   TOKEN_NAME=RewardToken
   TOKEN_SYMBOL=RWT
   TOTAL_SUPPLY=1000000
   ```

4. **Install Hardhat and dependencies**
   ```bash
   npm install --save-dev hardhat
   npm install @openzeppelin/contracts
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📦 Smart Contract Deployment

### Local Development

1. **Start local Hardhat network**
   ```bash
   npx hardhat node
   ```

2. **Deploy contracts locally**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Run tests**
   ```bash
   npx hardhat test
   ```

### BSC Testnet Deployment

1. **Deploy to testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network bsc-testnet
   ```

2. **Verify contracts**
   ```bash
   npx hardhat verify --network bsc-testnet CONTRACT_ADDRESS
   ```

### BSC Mainnet Deployment

⚠️ **Warning**: Mainnet deployment requires real BNB for gas fees. Ensure thorough testing on testnet first.

1. **Deploy to mainnet**
   ```bash
   npx hardhat run scripts/deploy.js --network bsc-mainnet
   ```

2. **Verify contracts on BSCScan**
   ```bash
   npx hardhat verify --network bsc-mainnet TOKEN_ADDRESS
   npx hardhat verify --network bsc-mainnet STAKING_ADDRESS TOKEN_ADDRESS TOKEN_ADDRESS
   ```

## 🔧 Smart Contract API

### RewardToken Contract

#### Functions

- `mint(address to, uint256 amount)` - Mint new tokens (minters only)
- `burn(uint256 amount)` - Burn tokens from caller's balance
- `addMinter(address minter)` - Add authorized minter (owner only)
- `removeMinter(address minter)` - Remove minter (owner only)

#### Events

- `MinterAdded(address indexed minter)`
- `MinterRemoved(address indexed minter)`

### StakingRewards Contract

#### Functions

- `stake(uint256 amount)` - Stake tokens to earn rewards
- `unstake(uint256 amount)` - Unstake tokens and claim rewards
- `claimRewards()` - Claim accumulated rewards
- `calculateRewards(address user)` - View pending rewards
- `getStakeInfo(address user)` - Get complete staking information

#### Events

- `Staked(address indexed user, uint256 amount)`
- `Unstaked(address indexed user, uint256 amount)`
- `RewardsClaimed(address indexed user, uint256 amount)`

## 🎨 Frontend Features

### Dashboard
- Real-time portfolio overview
- Interactive charts and metrics
- Responsive design for all devices

### Staking Interface
- Easy stake/unstake functionality
- Live reward calculations
- Transaction status indicators

### Token Information
- Complete tokenomics breakdown
- Allocation charts and details
- Contract verification links

### Documentation
- Comprehensive setup guides
- API reference
- Deployment instructions

## 🔒 Security Features

- **Reentrancy Protection**: All state-changing functions are protected
- **Access Control**: Role-based permissions for critical functions
- **Emergency Withdrawal**: Owner can recover stuck tokens
- **Maximum Supply Cap**: Prevents unlimited token inflation
- **Audited Contracts**: Based on OpenZeppelin's battle-tested code

## 🌐 Network Information

### Binance Smart Chain Mainnet
- **Network Name**: BSC Mainnet
- **RPC URL**: https://bsc-dataseed.binance.org/
- **Chain ID**: 56
- **Currency Symbol**: BNB
- **Block Explorer**: https://bscscan.com

### BSC Testnet
- **Network Name**: BSC Testnet
- **RPC URL**: https://data-seed-prebsc-1-s1.binance.org:8545/
- **Chain ID**: 97
- **Currency Symbol**: tBNB
- **Block Explorer**: https://testnet.bscscan.com
- **Faucet**: https://testnet.binance.org/faucet-smart

## 📊 Tokenomics

### Reward Mechanism
- **Base Rate**: 1% per hour
- **Compound Effect**: Rewards auto-compound when restaked
- **Maximum APY**: ~876% (theoretical maximum)
- **No Lock Period**: Unstake anytime without penalties

### Supply Management
- **Total Supply**: 1,000,000 RWT (fixed)
- **Burn Mechanism**: Users can burn tokens to reduce supply
- **Controlled Minting**: Only authorized contracts can mint rewards

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write comprehensive tests for all new features
- Follow Solidity best practices and security guidelines
- Ensure all tests pass before submitting PRs
- Update documentation for any API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our comprehensive docs in the app
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join our Discord community
- **Email**: support@norifarm.io

## 🔗 Links

- **Live Demo**: [https://nori-farm.vercel.app](https://nori-farm.vercel.app)
- **GitHub**: [https://github.com/your-username/nori-farm](https://github.com/your-username/nori-farm)
- **BSCScan**: [Contract Address](https://bscscan.com/address/CONTRACT_ADDRESS)
- **Documentation**: Available in the app's Documentation section

## ⚡ Performance

- **Frontend**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Blockchain**: Binance Smart Chain for low fees
- **Loading**: Optimized for fast page loads and smooth interactions

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Additional token pairs
- [ ] Governance token implementation
- [ ] Cross-chain bridge integration
- [ ] Advanced analytics dashboard
- [ ] NFT integration features

---

Built with ❤️ by the Nori Farm team using React, TypeScript, Solidity, and Binance Smart Chain.