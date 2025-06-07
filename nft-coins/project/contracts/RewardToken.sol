// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RewardToken
 * @dev ERC-20 token with minting capabilities for the Nori Farm reward system
 * 
 * Features:
 * - Fixed maximum supply of 1,000,000 tokens
 * - Controlled minting through authorized minters
 * - Burn functionality for supply reduction
 * - Owner-controlled minter permissions
 */
contract RewardToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1M tokens with 18 decimals
    
    // Mapping to track authorized minters
    mapping(address => bool) public minters;
    
    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    /**
     * @dev Modifier to restrict function access to authorized minters only
     */
    modifier onlyMinter() {
        require(minters[msg.sender], "RewardToken: caller is not an authorized minter");
        _;
    }
    
    /**
     * @dev Constructor - deploys the RewardToken with initial supply
     * Sets the deployer as the initial owner and minter
     */
    constructor() ERC20("RewardToken", "RWT") {
        // Mint initial supply to the deployer (100k tokens for initial distribution)
        _mint(msg.sender, 100000 * 10**18);
        
        // Set deployer as initial minter
        minters[msg.sender] = true;
        emit MinterAdded(msg.sender);
    }
    
    /**
     * @dev Mint new tokens to a specified address
     * Can only be called by authorized minters
     * Respects the maximum supply limit
     * 
     * @param to The address to receive the minted tokens
     * @param amount The amount of tokens to mint (in wei)
     */
    function mint(address to, uint256 amount) external onlyMinter {
        require(to != address(0), "RewardToken: cannot mint to zero address");
        require(amount > 0, "RewardToken: mint amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "RewardToken: minting would exceed max supply");
        
        _mint(to, amount);
    }
    
    /**
     * @dev Add a new authorized minter
     * Can only be called by the contract owner
     * 
     * @param minter The address to authorize as a minter
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "RewardToken: cannot add zero address as minter");
        require(!minters[minter], "RewardToken: address is already a minter");
        
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Remove an authorized minter
     * Can only be called by the contract owner
     * 
     * @param minter The address to remove from minters
     */
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "RewardToken: address is not a minter");
        
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    /**
     * @dev Burn tokens from the caller's balance
     * Reduces total supply permanently
     * 
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external {
        require(amount > 0, "RewardToken: burn amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "RewardToken: insufficient balance to burn");
        
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from a specified address (with allowance)
     * Reduces total supply permanently
     * 
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external {
        require(amount > 0, "RewardToken: burn amount must be greater than 0");
        
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "RewardToken: burn amount exceeds allowance");
        
        _approve(from, msg.sender, currentAllowance - amount);
        _burn(from, amount);
    }
    
    /**
     * @dev Check if an address is an authorized minter
     * 
     * @param account The address to check
     * @return bool True if the address is a minter, false otherwise
     */
    function isMinter(address account) external view returns (bool) {
        return minters[account];
    }
    
    /**
     * @dev Get the remaining supply that can be minted
     * 
     * @return uint256 The amount of tokens that can still be minted
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}