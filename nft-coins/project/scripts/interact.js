const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 Contract Interaction Script");
  console.log("=====================================");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Interacting with contracts using account:", deployer.address);

  // Read deployment addresses
  const fs = require('fs');
  const networkName = network.name;
  
  let deploymentInfo;
  try {
    const deploymentFile = `deployment-${networkName}.json`;
    deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  } catch (error) {
    console.error("❌ Could not read deployment file. Please deploy contracts first.");
    process.exit(1);
  }

  // Get contract instances
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const StakingRewards = await ethers.getContractFactory("StakingRewards");
  
  const rewardToken = RewardToken.attach(deploymentInfo.rewardToken);
  const stakingRewards = StakingRewards.attach(deploymentInfo.stakingRewards);

  console.log("\n📊 Current Contract State");
  console.log("=====================================");

  // Token information
  const tokenName = await rewardToken.name();
  const tokenSymbol = await rewardToken.symbol();
  const totalSupply = await rewardToken.totalSupply();
  const maxSupply = await rewardToken.MAX_SUPPLY();
  const remainingSupply = await rewardToken.remainingSupply();
  const deployerBalance = await rewardToken.balanceOf(deployer.address);

  console.log("🪙 Token Information:");
  console.log(`   Name: ${tokenName}`);
  console.log(`   Symbol: ${tokenSymbol}`);
  console.log(`   Total Supply: ${ethers.utils.formatEther(totalSupply)} RWT`);
  console.log(`   Max Supply: ${ethers.utils.formatEther(maxSupply)} RWT`);
  console.log(`   Remaining Supply: ${ethers.utils.formatEther(remainingSupply)} RWT`);
  console.log(`   Deployer Balance: ${ethers.utils.formatEther(deployerBalance)} RWT`);

  // Staking contract information
  const contractStats = await stakingRewards.getContractStats();
  const apy = await stakingRewards.getAPY();
  const rewardRate = await stakingRewards.REWARD_RATE();

  console.log("\n🥩 Staking Information:");
  console.log(`   Total Staked: ${ethers.utils.formatEther(contractStats._totalStaked)} RWT`);
  console.log(`   Total Rewards Paid: ${ethers.utils.formatEther(contractStats._totalRewardsPaid)} RWT`);
  console.log(`   Contract Balance: ${ethers.utils.formatEther(contractStats._contractBalance)} RWT`);
  console.log(`   Reward Rate: ${rewardRate / 100}% per hour`);
  console.log(`   APY: ${apy}%`);

  // Check if deployer has any stake
  const stakeInfo = await stakingRewards.getStakeInfo(deployer.address);
  if (stakeInfo.amount.gt(0)) {
    console.log("\n👤 Your Staking Information:");
    console.log(`   Staked Amount: ${ethers.utils.formatEther(stakeInfo.amount)} RWT`);
    console.log(`   Stake Timestamp: ${new Date(stakeInfo.timestamp * 1000).toLocaleString()}`);
    console.log(`   Pending Rewards: ${ethers.utils.formatEther(stakeInfo.pendingRewards)} RWT`);
  }

  // Demonstrate basic interactions (only on testnet)
  if (networkName === "bsc-testnet" || networkName === "localhost") {
    console.log("\n🧪 Demonstrating Contract Interactions (Testnet Only)");
    console.log("=====================================");

    try {
      // Example: Stake some tokens
      const stakeAmount = ethers.utils.parseEther("10");
      if (deployerBalance.gte(stakeAmount)) {
        console.log(`\n📝 Staking ${ethers.utils.formatEther(stakeAmount)} RWT...`);
        
        // Approve staking contract
        const approveTx = await rewardToken.approve(stakingRewards.address, stakeAmount);
        await approveTx.wait();
        console.log("✅ Approval transaction confirmed");
        
        // Stake tokens
        const stakeTx = await stakingRewards.stake(stakeAmount);
        await stakeTx.wait();
        console.log("✅ Staking transaction confirmed");
        
        // Check updated stake info
        const updatedStakeInfo = await stakingRewards.getStakeInfo(deployer.address);
        console.log(`   New Staked Amount: ${ethers.utils.formatEther(updatedStakeInfo.amount)} RWT`);
      } else {
        console.log("⚠️  Insufficient balance for staking demonstration");
      }
    } catch (error) {
      console.log("⚠️  Interaction demonstration failed:", error.message);
    }
  }

  console.log("\n🎉 Contract interaction completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Interaction failed:");
    console.error(error);
    process.exit(1);
  });