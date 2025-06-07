// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title StakingRewards
 * @dev Time-based staking contract with reward distribution for Nori Farm
 * 
 * Features:
 * - Time-based reward calculation (1% per hour)
 * - Flexible staking and unstaking
 * - Automatic reward claiming
 * - Reentrancy protection
 * - Emergency withdrawal capabilities
 */
contract StakingRewards is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    // Token interfaces
    IERC20 public immutable stakingToken;  // Token used for staking
    IERC20 public immutable rewardsToken;  // Token used for rewards
    
    // Reward calculation constants
    uint256 public constant REWARD_RATE = 100;        // 1% = 100 basis points
    uint256 public constant RATE_PRECISION = 10000;   // Precision for percentage calculations
    uint256 public constant HOUR_IN_SECONDS = 3600;   // Seconds in an hour
    
    // Staking information structure
    struct StakeInfo {
        uint256 amount;         // Amount of tokens staked
        uint256 timestamp;      // When the stake was created
        uint256 lastClaimTime;  // Last time rewards were claimed
    }
    
    // State variables
    mapping(address => StakeInfo) public stakes;  // User staking information
    uint256 public totalStaked;                   // Total amount of tokens staked
    uint256 public totalRewardsPaid;              // Total rewards distributed
    
    // Events
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);
    event RewardsClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event EmergencyWithdraw(address indexed token, uint256 amount);
    
    /**
     * @dev Constructor - initializes the staking contract
     * 
     * @param _stakingToken Address of the token used for staking
     * @param _rewardsToken Address of the token used for rewards
     */
    constructor(address _stakingToken, address _rewardsToken) {
        require(_stakingToken != address(0), "StakingRewards: staking token cannot be zero address");
        require(_rewardsToken != address(0), "StakingRewards: rewards token cannot be zero address");
        
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }
    
    /**
     * @dev Stake tokens to earn rewards
     * Claims any pending rewards before staking additional tokens
     * 
     * @param amount The amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "StakingRewards: cannot stake 0 tokens");
        require(stakingToken.balanceOf(msg.sender) >= amount, "StakingRewards: insufficient balance");
        
        // Claim pending rewards first if user already has a stake
        if (stakes[msg.sender].amount > 0) {
            _claimRewards();
        }
        
        // Transfer tokens from user to contract
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update stake information
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;
        stakes[msg.sender].lastClaimTime = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Unstake tokens and automatically claim all rewards
     * 
     * @param amount The amount of tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "StakingRewards: cannot unstake 0 tokens");
        require(stakes[msg.sender].amount >= amount, "StakingRewards: insufficient staked amount");
        
        // Claim all pending rewards first
        _claimRewards();
        
        // Update stake information
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;
        
        // Transfer tokens back to user
        stakingToken.safeTransfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Claim accumulated rewards without unstaking
     */
    function claimRewards() external nonReentrant {
        require(stakes[msg.sender].amount > 0, "StakingRewards: no tokens staked");
        _claimRewards();
    }
    
    /**
     * @dev Internal function to claim and distribute rewards
     */
    function _claimRewards() internal {
        uint256 reward = calculateRewards(msg.sender);
        
        if (reward > 0) {
            // Update last claim time
            stakes[msg.sender].lastClaimTime = block.timestamp;
            totalRewardsPaid += reward;
            
            // Transfer rewards to user
            rewardsToken.safeTransfer(msg.sender, reward);
            
            emit RewardsClaimed(msg.sender, reward, block.timestamp);
        }
    }
    
    /**
     * @dev Calculate pending rewards for a user based on time staked
     * Formula: (stakedAmount * rewardRate * hoursStaked) / ratePrecision
     * 
     * @param user The address of the user to calculate rewards for
     * @return uint256 The amount of pending rewards
     */
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        
        // Return 0 if user has no stake
        if (userStake.amount == 0) {
            return 0;
        }
        
        // Calculate time since last claim
        uint256 timeStaked = block.timestamp - userStake.lastClaimTime;
        uint256 hoursStaked = timeStaked / HOUR_IN_SECONDS;
        
        // Calculate rewards: 1% per hour
        uint256 reward = (userStake.amount * REWARD_RATE * hoursStaked) / RATE_PRECISION;
        
        return reward;
    }
    
    /**
     * @dev Get comprehensive staking information for a user
     * 
     * @param user The address of the user
     * @return amount The amount of tokens staked
     * @return timestamp When the stake was created
     * @return lastClaimTime When rewards were last claimed
     * @return pendingRewards Current pending rewards
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 timestamp,
        uint256 lastClaimTime,
        uint256 pendingRewards
    ) {
        StakeInfo memory userStake = stakes[user];
        return (
            userStake.amount,
            userStake.timestamp,
            userStake.lastClaimTime,
            calculateRewards(user)
        );
    }
    
    /**
     * @dev Get contract statistics
     * 
     * @return _totalStaked Total amount of tokens currently staked
     * @return _totalRewardsPaid Total rewards distributed so far
     * @return _contractBalance Current token balance of the contract
     */
    function getContractStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalRewardsPaid,
        uint256 _contractBalance
    ) {
        return (
            totalStaked,
            totalRewardsPaid,
            rewardsToken.balanceOf(address(this))
        );
    }
    
    /**
     * @dev Calculate the Annual Percentage Yield (APY) based on current reward rate
     * 
     * @return uint256 The APY as a percentage (e.g., 876 for 876%)
     */
    function getAPY() external pure returns (uint256) {
        // 1% per hour = 24% per day = 876% per year (365.25 days)
        return (REWARD_RATE * 24 * 365) / 100;
    }
    
    /**
     * @dev Emergency withdrawal function - can only be called by owner
     * Allows owner to withdraw any ERC20 token from the contract
     * 
     * @param token The address of the token to withdraw
     * @param amount The amount of tokens to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(0), "StakingRewards: token cannot be zero address");
        require(amount > 0, "StakingRewards: amount must be greater than 0");
        
        IERC20(token).safeTransfer(owner(), amount);
        
        emit EmergencyWithdraw(token, amount);
    }
    
    /**
     * @dev Pause the contract (inherited from Ownable)
     * Can be used to stop all staking activities in case of emergency
     */
    function pause() external onlyOwner {
        // Implementation would depend on using OpenZeppelin's Pausable contract
        // For simplicity, this is a placeholder for the pause functionality
    }
}