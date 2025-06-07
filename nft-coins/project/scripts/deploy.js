const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to", network.name);
  console.log("=====================================");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH/BNB");
  
  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.warn("⚠️  Warning: Low balance. Deployment may fail.");
  }

  console.log("\n🏗️  Deploying RewardToken...");
  
  // Deploy RewardToken
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();
  
  console.log("✅ RewardToken deployed to:", rewardToken.address);
  console.log("🔍 Transaction hash:", rewardToken.deployTransaction.hash);
  
  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await rewardToken.deployTransaction.wait(2);
  
  console.log("\n🏗️  Deploying StakingRewards...");
  
  // Deploy StakingRewards contract
  const StakingRewards = await ethers.getContractFactory("StakingRewards");
  const stakingRewards = await StakingRewards.deploy(
    rewardToken.address, // staking token (same as reward token for this demo)
    rewardToken.address  // rewards token
  );
  await stakingRewards.deployed();
  
  console.log("✅ StakingRewards deployed to:", stakingRewards.address);
  console.log("🔍 Transaction hash:", stakingRewards.deployTransaction.hash);
  
  // Wait for confirmations
  console.log("⏳ Waiting for confirmations...");
  await stakingRewards.deployTransaction.wait(2);
  
  console.log("\n🔧 Setting up permissions...");
  
  // Add staking contract as minter
  const addMinterTx = await rewardToken.addMinter(stakingRewards.address);
  await addMinterTx.wait(1);
  console.log("✅ StakingRewards contract added as minter");
  
  // Mint some initial tokens for rewards (optional)
  if (network.name !== "bsc-mainnet") {
    console.log("\n💰 Minting initial reward tokens...");
    const mintAmount = ethers.utils.parseEther("100000"); // 100k tokens for rewards
    const mintTx = await rewardToken.mint(stakingRewards.address, mintAmount);
    await mintTx.wait(1);
    console.log("✅ Minted", ethers.utils.formatEther(mintAmount), "RWT tokens for rewards");
  }
  
  console.log("\n📊 Deployment Summary");
  console.log("=====================================");
  console.log("🪙 RewardToken Address:", rewardToken.address);
  console.log("🥩 StakingRewards Address:", stakingRewards.address);
  console.log("🌐 Network:", network.name);
  console.log("⛽ Gas Used: Check transaction details above");
  
  // Get token info
  const tokenName = await rewardToken.name();
  const tokenSymbol = await rewardToken.symbol();
  const totalSupply = await rewardToken.totalSupply();
  
  console.log("\n📈 Token Details");
  console.log("=====================================");
  console.log("Name:", tokenName);
  console.log("Symbol:", tokenSymbol);
  console.log("Total Supply:", ethers.utils.formatEther(totalSupply), "RWT");
  console.log("Deployer Balance:", ethers.utils.formatEther(await rewardToken.balanceOf(deployer.address)), "RWT");
  
  // Verification instructions
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n🔍 Contract Verification");
    console.log("=====================================");
    console.log("To verify RewardToken on BSCScan:");
    console.log(`npx hardhat verify --network ${network.name} ${rewardToken.address}`);
    console.log("\nTo verify StakingRewards on BSCScan:");
    console.log(`npx hardhat verify --network ${network.name} ${stakingRewards.address} "${rewardToken.address}" "${rewardToken.address}"`);
  }
  
  // Save deployment addresses
  const fs = require('fs');
  const deploymentInfo = {
    network: network.name,
    rewardToken: rewardToken.address,
    stakingRewards: stakingRewards.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };
  
  fs.writeFileSync(
    `deployment-${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n💾 Deployment info saved to deployment-${network.name}.json`);
  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });