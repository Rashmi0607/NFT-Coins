const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardToken", function () {
  let RewardToken;
  let rewardToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    RewardToken = await ethers.getContractFactory("RewardToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new RewardToken contract for each test
    rewardToken = await RewardToken.deploy();
    await rewardToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await rewardToken.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await rewardToken.balanceOf(owner.address);
      expect(await rewardToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set correct token details", async function () {
      expect(await rewardToken.name()).to.equal("RewardToken");
      expect(await rewardToken.symbol()).to.equal("RWT");
      expect(await rewardToken.decimals()).to.equal(18);
    });

    it("Should set owner as initial minter", async function () {
      expect(await rewardToken.isMinter(owner.address)).to.equal(true);
    });
  });

  describe("Minting", function () {
    it("Should allow authorized minters to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await rewardToken.mint(addr1.address, mintAmount);
      
      expect(await rewardToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-minters to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      
      await expect(
        rewardToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWith("RewardToken: caller is not an authorized minter");
    });

    it("Should not allow minting beyond max supply", async function () {
      const maxSupply = await rewardToken.MAX_SUPPLY();
      const currentSupply = await rewardToken.totalSupply();
      const excessAmount = maxSupply.sub(currentSupply).add(1);
      
      await expect(
        rewardToken.mint(addr1.address, excessAmount)
      ).to.be.revertedWith("RewardToken: minting would exceed max supply");
    });
  });

  describe("Minter Management", function () {
    it("Should allow owner to add minters", async function () {
      await rewardToken.addMinter(addr1.address);
      expect(await rewardToken.isMinter(addr1.address)).to.equal(true);
    });

    it("Should allow owner to remove minters", async function () {
      await rewardToken.addMinter(addr1.address);
      await rewardToken.removeMinter(addr1.address);
      expect(await rewardToken.isMinter(addr1.address)).to.equal(false);
    });

    it("Should not allow non-owners to add minters", async function () {
      await expect(
        rewardToken.connect(addr1).addMinter(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their tokens", async function () {
      const burnAmount = ethers.utils.parseEther("100");
      const initialBalance = await rewardToken.balanceOf(owner.address);
      
      await rewardToken.burn(burnAmount);
      
      const finalBalance = await rewardToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance.sub(burnAmount));
    });

    it("Should not allow burning more than balance", async function () {
      const balance = await rewardToken.balanceOf(addr1.address);
      const burnAmount = balance.add(1);
      
      await expect(
        rewardToken.connect(addr1).burn(burnAmount)
      ).to.be.revertedWith("RewardToken: insufficient balance to burn");
    });
  });

  describe("Utility Functions", function () {
    it("Should return correct remaining supply", async function () {
      const maxSupply = await rewardToken.MAX_SUPPLY();
      const currentSupply = await rewardToken.totalSupply();
      const expectedRemaining = maxSupply.sub(currentSupply);
      
      expect(await rewardToken.remainingSupply()).to.equal(expectedRemaining);
    });
  });
});