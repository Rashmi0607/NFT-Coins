import React, { useState } from 'react';
import { Book, Terminal, Zap, Shield, ExternalLink } from 'lucide-react';

export function Documentation() {
  const [activeSection, setActiveSection] = useState<'overview' | 'setup' | 'deployment' | 'api'>('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: <Book className="w-4 h-4" /> },
    { id: 'setup', label: 'Setup Guide', icon: <Terminal className="w-4 h-4" /> },
    { id: 'deployment', label: 'Deployment', icon: <Zap className="w-4 h-4" /> },
    { id: 'api', label: 'API Reference', icon: <Shield className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                Nori Farm is an advanced NFT-based reward system built on Binance Smart Chain. The platform allows users to stake RewardTokens (RWT) 
                and earn passive income through time-based reward distribution. The system consists of two main smart contracts: the RewardToken 
                contract and the StakingRewards contract.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">RewardToken (RWT)</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• ERC-20 compliant token</li>
                  <li>• 1,000,000 total supply</li>
                  <li>• 18 decimal places</li>
                  <li>• Controlled minting system</li>
                  <li>• Burn functionality</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">StakingRewards</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Time-based reward calculation</li>
                  <li>• 1% hourly reward rate (876% APY)</li>
                  <li>• Flexible staking/unstaking</li>
                  <li>• Real-time reward tracking</li>
                  <li>• Reentrancy protection</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Architecture</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The system follows a modular architecture with clear separation of concerns:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm text-gray-300">
                <div>RewardToken.sol (ERC-20 Token)</div>
                <div>├── Minting capabilities</div>
                <div>├── Supply management</div>
                <div>└── Access control</div>
                <div className="mt-2">StakingRewards.sol (Reward Distribution)</div>
                <div>├── Stake management</div>
                <div>├── Reward calculation</div>
                <div>└── Security features</div>
              </div>
            </div>
          </div>
        );

      case 'setup':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Development Setup</h2>
              <p className="text-gray-300 mb-6">
                Follow these steps to set up the development environment and deploy the smart contracts.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Prerequisites</h3>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm">
{`# Install Node.js (v16 or higher)
# Install npm or yarn
# Install Git

# Verify installations
node --version
npm --version
git --version`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Environment Setup</h3>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm">
{`# Clone the repository
git clone https://github.com/your-username/nori-farm
cd nori-farm

# Install dependencies
npm install

# Install Hardhat and OpenZeppelin contracts
npm install --save-dev hardhat
npm install @openzeppelin/contracts

# Create .env file
cp .env.example .env`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Configuration</h3>
                <p className="text-gray-300 mb-3">Update your .env file with the following variables:</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm">
{`# Wallet private key (DO NOT SHARE)
PRIVATE_KEY=your_private_key_here

# BSC RPC URL
BSC_RPC_URL=https://bsc-dataseed.binance.org/

# BSCScan API key (for contract verification)
BSCSCAN_API_KEY=your_bscscan_api_key

# Token parameters
TOKEN_NAME=RewardToken
TOKEN_SYMBOL=RWT
TOTAL_SUPPLY=1000000`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Local Testing</h3>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm">
{`# Start local Hardhat network
npx hardhat node

# Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost

# Run tests
npx hardhat test

# Check contract size
npx hardhat size-contracts`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        );

      case 'deployment':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Deployment Guide</h2>
              <p className="text-gray-300 mb-6">
                Step-by-step instructions for deploying the smart contracts to Binance Smart Chain.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">1. Prepare Deployment Scripts</h3>
                <p className="text-gray-300 mb-3">Create the deployment script:</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm">
{`// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying RewardToken...");
  
  // Deploy RewardToken
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();
  
  console.log("RewardToken deployed to:", rewardToken.address);
  
  // Deploy StakingRewards
  const StakingRewards = await ethers.getContractFactory("StakingRewards");
  const stakingRewards = await StakingRewards.deploy(
    rewardToken.address, // staking token
    rewardToken.address  // rewards token
  );
  await stakingRewards.deployed();
  
  console.log("StakingRewards deployed to:", stakingRewards.address);
  
  // Add staking contract as minter
  await rewardToken.addMinter(stakingRewards.address);
  console.log("StakingRewards added as minter");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">2. Deploy to BSC Testnet</h3>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm">
{`# Deploy to BSC testnet first
npx hardhat run scripts/deploy.js --network bsc-testnet

# Verify contracts on BSCScan testnet
npx hardhat verify --network bsc-testnet CONTRACT_ADDRESS

# Test contract interactions
npx hardhat run scripts/test-interactions.js --network bsc-testnet`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">3. Deploy to BSC Mainnet</h3>
                <div className="bg-amber-600/20 border border-amber-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="text-amber-400 font-semibold">Warning</h4>
                      <p className="text-gray-300 text-sm">
                        Mainnet deployment requires real BNB for gas fees. Ensure you have sufficient funds and have thoroughly tested on testnet.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm">
{`# Deploy to BSC mainnet
npx hardhat run scripts/deploy.js --network bsc-mainnet

# Verify contracts on BSCScan
npx hardhat verify --network bsc-mainnet TOKEN_ADDRESS
npx hardhat verify --network bsc-mainnet STAKING_ADDRESS TOKEN_ADDRESS TOKEN_ADDRESS

# Update frontend configuration
echo "REACT_APP_TOKEN_ADDRESS=0x..." >> .env
echo "REACT_APP_STAKING_ADDRESS=0x..." >> .env`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">4. Post-Deployment Setup</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Contract Verification</h4>
                    <p className="text-gray-300 text-sm">Verify your contracts on BSCScan to enable public interaction and trust.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Initial Token Distribution</h4>
                    <p className="text-gray-300 text-sm">Distribute initial tokens according to your tokenomics plan.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Liquidity Setup</h4>
                    <p className="text-gray-300 text-sm">Add liquidity to PancakeSwap for token trading.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Smart Contract API Reference</h2>
              <p className="text-gray-300 mb-6">
                Detailed documentation of all public functions and events in the smart contracts.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">RewardToken Contract</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-green-400 font-mono text-sm mb-2">mint(address to, uint256 amount)</h4>
                    <p className="text-gray-300 text-sm mb-2">Mint new tokens to a specified address.</p>
                    <div className="text-xs text-gray-400">
                      <div><strong>Parameters:</strong></div>
                      <div>• to: Recipient address</div>
                      <div>• amount: Amount of tokens to mint</div>
                      <div><strong>Requirements:</strong> Only authorized minters</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-green-400 font-mono text-sm mb-2">addMinter(address minter)</h4>
                    <p className="text-gray-300 text-sm mb-2">Add a new address as an authorized minter.</p>
                    <div className="text-xs text-gray-400">
                      <div><strong>Parameters:</strong></div>
                      <div>• minter: Address to grant minting permissions</div>
                      <div><strong>Requirements:</strong> Only contract owner</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-green-400 font-mono text-sm mb-2">burn(uint256 amount)</h4>
                    <p className="text-gray-300 text-sm mb-2">Burn tokens from caller's balance.</p>
                    <div className="text-xs text-gray-400">
                      <div><strong>Parameters:</strong></div>
                      <div>• amount: Amount of tokens to burn</div>
                      <div><strong>Requirements:</strong> Sufficient balance</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">StakingRewards Contract</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-blue-400 font-mono text-sm mb-2">stake(uint256 amount)</h4>
                    <p className="text-gray-300 text-sm mb-2">Stake tokens to start earning rewards.</p>
                    <div className="text-xs text-gray-400">
                      <div><strong>Parameters:</strong></div>
                      <div>• amount: Amount of tokens to stake</div>
                      <div><strong>Effects:</strong> Claims pending rewards first</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-blue-400 font-mono text-sm mb-2">unstake(uint256 amount)</h4>
                    <p className="text-gray-300 text-sm mb-2">Unstake tokens and claim all rewards.</p>
                    <div className="text-xs text-gray-400">
                      <div><strong>Parameters:</strong></div>
                      <div>• amount: Amount of tokens to unstake</div>
                      <div><strong>Requirements:</strong> Sufficient staked balance</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-blue-400 font-mono text-sm mb-2">calculateRewards(address user) → uint256</h4>
                    <p className="text-gray-300 text-sm mb-2">Calculate pending rewards for a user.</p>
                    <div className="text-xs text-gray-400">
                      <div><strong>Parameters:</strong></div>
                      <div>• user: User address to check</div>
                      <div><strong>Returns:</strong> Amount of pending rewards</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-blue-400 font-mono text-sm mb-2">getStakeInfo(address user) → (uint256, uint256, uint256)</h4>
                    <p className="text-gray-300 text-sm mb-2">Get complete staking information for a user.</p>
                    <div className="text-xs text-gray-400">
                      <div><strong>Returns:</strong></div>
                      <div>• Staked amount</div>
                      <div>• Stake timestamp</div>
                      <div>• Pending rewards</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Events</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-purple-400 font-mono text-sm mb-2">Staked(address user, uint256 amount)</h4>
                    <p className="text-gray-300 text-xs">Emitted when tokens are staked</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-purple-400 font-mono text-sm mb-2">Unstaked(address user, uint256 amount)</h4>
                    <p className="text-gray-300 text-xs">Emitted when tokens are unstaked</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-purple-400 font-mono text-sm mb-2">RewardsClaimed(address user, uint256 amount)</h4>
                    <p className="text-gray-300 text-xs">Emitted when rewards are claimed</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-purple-400 font-mono text-sm mb-2">MinterAdded(address minter)</h4>
                    <p className="text-gray-300 text-xs">Emitted when a minter is added</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Documentation</h1>
        <p className="text-gray-400">Complete guide for using and deploying the Nori Farm reward system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 sticky top-4">
            <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-6 pt-4 border-t border-white/20">
              <h4 className="text-sm font-medium text-white mb-2">Quick Links</h4>
              <div className="space-y-1">
                <a
                  href="https://github.com/your-username/nori-farm"
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>GitHub Repository</span>
                </a>
                <a
                  href="https://bscscan.com"
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>BSCScan</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}