const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingRewards", function () {
  let RewardToken;
  let StakingRewards;
  let rewardToken;
  let stakingRewards;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy RewardToken
    RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy();
    await rewardToken.deployed();

    // Deploy StakingRewards
    StakingRewards = await ethers.getContractFactory("StakingRewards");
    stakingRewards = await StakingRewards.deploy(
      rewardToken.address,
      rewardToken.address
    );
    await stakingRewards.deployed();

    // Add staking contract as minter
    await rewardToken.addMinter(stakingRewards.address);

    // Mint some tokens for testing
    const mintAmount = ethers.utils.parseEther("10000");
    await rewardToken.mint(stakingRewards.address, mintAmount); // For rewards
    await rewardToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await rewardToken.transfer(addr2.address, ethers.utils.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set the correct staking and rewards tokens", async function () {
      expect(await stakingRewards.stakingToken()).to.equal(rewardToken.address);
      expect(await stakingRewards.rewardsToken()).to.equal(rewardToken.address);
    });

    it("Should set the correct reward rate constants", async function () {
      expect(await stakingRewards.REWARD_RATE()).to.equal(100); // 1%
      expect(await stakingRewards.RATE_PRECISION()).to.equal(10000);
      expect(await stakingRewards.HOUR_IN_SECONDS()).to.equal(3600);
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      
      // Approve staking contract to spend tokens
      await rewardToken.connect(addr1).approve(stakingRewards.address, stakeAmount);
      
      // Stake tokens
      await stakingRewards.connect(addr1).stake(stakeAmount);
      
      const stakeInfo = await stakingRewards.getStakeInfo(addr1.address);
      expect(stakeInfo.amount).to.equal(stakeAmount);
      expect(await stakingRewards.totalStaked()).to.equal(stakeAmount);
    });

    it("Should not allow staking 0 tokens", async function () {
      await expect(
        stakingRewards.connect(addr1).stake(0)
      ).to.be.revertedWith("StakingRewards: cannot stake 0 tokens");
    });

    it("Should not allow staking more than balance", async function () {
      const balance = await rewardToken.balanceOf(addr1.address);
      const stakeAmount = balance.add(1);
      
      await rewardToken.connect(addr1).approve(stakingRewards.address, stakeAmount);
      
      await expect(
        stakingRewards.connect(addr1).stake(stakeAmount)
      ).to.be.revertedWith("StakingRewards: insufficient balance");
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      await rewardToken.connect(addr1).approve(stakingRewards.address, stakeAmount);
      await stakingRewards.connect(addr1).stake(stakeAmount);
    });

    it("Should allow users to unstake tokens", async function () {
      const unstakeAmount = ethers.utils.parseEther("50");
      const initialBalance = await rewardToken.balanceOf(addr1.address);
      
      await stakingRewards.connect(addr1).unstake(unstakeAmount);
      
      const finalBalance = await rewardToken.balanceOf(addr1.address);
      expect(finalBalance).to.equal(initialBalance.add(unstakeAmount));
      
      const stakeInfo = await stakingRewards.getStakeInfo(addr1.address);
      expect(stakeInfo.amount).to.equal(ethers.utils.parseEther("50"));
    });

    it("Should not allow unstaking more than staked", async function () {
      const unstakeAmount = ethers.utils.parseEther("200");
      
      await expect(
        stakingRewards.connect(addr1).unstake(unstakeAmount)
      ).to.be.revertedWith("StakingRewards: insufficient staked amount");
    });
  });

  describe("Rewards Calculation", function () {
    it("Should calculate rewards correctly", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      await rewardToken.connect(addr1).approve(stakingRewards.address, stakeAmount);
      await stakingRewards.connect(addr1).stake(stakeAmount);
      
      // Fast forward time by 1 hour
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine");
      
      const expectedReward = stakeAmount.mul(100).div(10000); // 1% of staked amount
      const actualReward = await stakingRewards.calculateRewards(addr1.address);
      
      expect(actualReward).to.equal(expectedReward);
    });

    it("Should return 0 rewards for non-stakers", async function () {
      const rewards = await stakingRewards.calculateRewards(addr2.address);
      expect(rewards).to.equal(0);
    });
  });

  describe("Claiming Rewards", function () {
    beforeEach(async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      await rewardToken.connect(addr1).approve(stakingRewards.address, stakeAmount);
      await stakingRewards.connect(addr1).stake(stakeAmount);
      
      // Fast forward time by 1 hour
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine");
    });

    it("Should allow users to claim rewards", async function () {
      const initialBalance = await rewardToken.balanceOf(addr1.address);
      const pendingRewards = await stakingRewards.calculateRewards(addr1.address);
      
      await stakingRewards.connect(addr1).claimRewards();
      
      const finalBalance = await rewardToken.balanceOf(addr1.address);
      expect(finalBalance).to.equal(initialBalance.add(pendingRewards));
    });

    it("Should reset rewards after claiming", async function () {
      await stakingRewards.connect(addr1).claimRewards();
      
      const rewards = await stakingRewards.calculateRewards(addr1.address);
      expect(rewards).to.equal(0);
    });
  });

  describe("Contract Statistics", function () {
    it("Should return correct contract stats", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      await rewardToken.connect(addr1).approve(stakingRewards.address, stakeAmount);
      await stakingRewards.connect(addr1).stake(stakeAmount);
      
      const stats = await stakingRewards.getContractStats();
      expect(stats._totalStaked).to.equal(stakeAmount);
      expect(stats._totalRewardsPaid).to.equal(0);
    });

    it("Should return correct APY", async function () {
      const apy = await stakingRewards.getAPY();
      expect(apy).to.equal(876); // 1% per hour * 24 hours * 365 days / 100
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to emergency withdraw", async function () {
      const withdrawAmount = ethers.utils.parseEther("100");
      const initialOwnerBalance = await rewardToken.balanceOf(owner.address);
      
      await stakingRewards.emergencyWithdraw(rewardToken.address, withdrawAmount);
      
      const finalOwnerBalance = await rewardToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.add(withdrawAmount));
    });

    it("Should not allow non-owners to emergency withdraw", async function () {
      const withdrawAmount = ethers.utils.parseEther("100");
      
      await expect(
        stakingRewards.connect(addr1).emergencyWithdraw(rewardToken.address, withdrawAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});