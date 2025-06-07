import React, { useState } from 'react';
import { Code, FileText, Download, ExternalLink } from 'lucide-react';

export function SmartContracts() {
  const [activeContract, setActiveContract] = useState<'token' | 'staking'>('token');

  const contracts = [
    {
      id: 'token',
      name: 'RewardToken.sol',
      description: 'ERC-20 token contract with minting and burning capabilities',
      verified: true,
      address: '0x1234567890123456789012345678901234567890',
    },
    {
      id: 'staking',
      name: 'StakingRewards.sol',
      description: 'Time-based staking contract with reward distribution',
      verified: true,
      address: '0x0987654321098765432109876543210987654321',
    },
  ];

  const tokenContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC-20 token with minting capabilities for the Nori Farm reward system
 */
contract RewardToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1M tokens
    
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized to mint");
        _;
    }
    
    constructor() ERC20("RewardToken", "RWT") {
        // Initial allocation
        _mint(msg.sender, 100000 * 10**18); // 100k to deployer
        minters[msg.sender] = true;
    }
    
    /**
     * @dev Mint new tokens (only by authorized minters)
     */
    function mint(address to, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
    
    /**
     * @dev Add a new minter
     */
    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Remove a minter
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}`;

  const stakingContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title StakingRewards
 * @dev Time-based staking contract with reward distribution
 */
contract StakingRewards is ReentrancyGuard, Ownable {
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;
    
    // Reward rate: 1% per hour (876% APY)
    uint256 public constant REWARD_RATE = 100; // 1% = 100 basis points
    uint256 public constant RATE_PRECISION = 10000;
    uint256 public constant HOUR_IN_SECONDS = 3600;
    
    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        uint256 lastClaimTime;
    }
    
    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }
    
    /**
     * @dev Stake tokens to earn rewards
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0 tokens");
        
        // Claim pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimRewards();
        }
        
        stakingToken.transferFrom(msg.sender, address(this), amount);
        
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;
        stakes[msg.sender].lastClaimTime = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     */
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot unstake 0 tokens");
        require(stakes[msg.sender].amount >= amount, "Insufficient staked amount");
        
        // Claim all pending rewards
        _claimRewards();
        
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;
        
        stakingToken.transfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external nonReentrant {
        _claimRewards();
    }
    
    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards() internal {
        uint256 reward = calculateRewards(msg.sender);
        if (reward > 0) {
            stakes[msg.sender].lastClaimTime = block.timestamp;
            rewardsToken.transfer(msg.sender, reward);
            emit RewardsClaimed(msg.sender, reward);
        }
    }
    
    /**
     * @dev Calculate pending rewards for a user
     */
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - userStake.lastClaimTime;
        uint256 hoursStaked = timeStaked / HOUR_IN_SECONDS;
        
        return (userStake.amount * REWARD_RATE * hoursStaked) / RATE_PRECISION;
    }
    
    /**
     * @dev Get staking info for a user
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 timestamp,
        uint256 pendingRewards
    ) {
        StakeInfo memory userStake = stakes[user];
        return (
            userStake.amount,
            userStake.timestamp,
            calculateRewards(user)
        );
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Smart Contracts</h1>
        <p className="text-gray-400">View and interact with the deployed smart contracts</p>
      </div>

      {/* Contract Selection */}
      <div className="flex space-x-4">
        {contracts.map((contract) => (
          <button
            key={contract.id}
            onClick={() => setActiveContract(contract.id as 'token' | 'staking')}
            className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeContract === contract.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Code className="w-5 h-5" />
            <span>{contract.name}</span>
          </button>
        ))}
      </div>

      {/* Contract Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all duration-200 ${
                activeContract === contract.id
                  ? 'border-purple-500'
                  : 'border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{contract.name}</h3>
                {contract.verified && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{contract.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white font-mono">
                    {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white">BSC Mainnet</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200">
                  <ExternalLink className="w-4 h-4" />
                  <span>View on BSCScan</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contract Code */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">
                  {activeContract === 'token' ? 'RewardToken.sol' : 'StakingRewards.sol'}
                </h3>
              </div>
              <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
            
            <div className="p-4">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>
                  {activeContract === 'token' ? tokenContract : stakingContract}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">RewardToken Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>ERC-20 standard compliance</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Controlled minting mechanism</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Maximum supply cap (1M tokens)</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Burn functionality</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Owner-controlled minter permissions</span>
            </li>
          </ul>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Staking Contract Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Time-based reward calculation</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>1% hourly reward rate</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Reentrancy protection</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Flexible stake/unstake</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Emergency withdrawal function</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}