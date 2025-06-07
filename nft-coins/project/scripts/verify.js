const { run } = require("hardhat");

async function main() {
  const networkName = network.name;
  
  console.log("🔍 Starting contract verification on", networkName);
  console.log("=====================================");

  // Read deployment addresses from file
  const fs = require('fs');
  let deploymentInfo;
  
  try {
    const deploymentFile = `deployment-${networkName}.json`;
    deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  } catch (error) {
    console.error("❌ Could not read deployment file. Please deploy contracts first.");
    process.exit(1);
  }

  const { rewardToken, stakingRewards } = deploymentInfo;

  try {
    console.log("\n🔍 Verifying RewardToken...");
    await run("verify:verify", {
      address: rewardToken,
      constructorArguments: [],
    });
    console.log("✅ RewardToken verified successfully");
  } catch (error) {
    console.log("⚠️  RewardToken verification failed:", error.message);
  }

  try {
    console.log("\n🔍 Verifying StakingRewards...");
    await run("verify:verify", {
      address: stakingRewards,
      constructorArguments: [rewardToken, rewardToken],
    });
    console.log("✅ StakingRewards verified successfully");
  } catch (error) {
    console.log("⚠️  StakingRewards verification failed:", error.message);
  }

  console.log("\n🎉 Verification process completed!");
  console.log("=====================================");
  console.log("📋 Contract Addresses:");
  console.log("🪙 RewardToken:", rewardToken);
  console.log("🥩 StakingRewards:", stakingRewards);
  console.log("\n🔗 View on BSCScan:");
  
  if (networkName === "bsc-mainnet") {
    console.log(`RewardToken: https://bscscan.com/address/${rewardToken}`);
    console.log(`StakingRewards: https://bscscan.com/address/${stakingRewards}`);
  } else if (networkName === "bsc-testnet") {
    console.log(`RewardToken: https://testnet.bscscan.com/address/${rewardToken}`);
    console.log(`StakingRewards: https://testnet.bscscan.com/address/${stakingRewards}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:");
    console.error(error);
    process.exit(1);
  });