const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BSDToken", function () {
  let bsdToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  const INITIAL_SUPPLY = 1000000; // 1 million tokens

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const BSDToken = await ethers.getContractFactory("BSDToken");
    bsdToken = await BSDToken.deploy(INITIAL_SUPPLY);
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await bsdToken.name()).to.equal("Back Street Dogs");
      expect(await bsdToken.symbol()).to.equal("BSD");
    });

    it("Should assign total supply to owner", async function () {
      const ownerBalance = await bsdToken.balanceOf(owner.address);
      expect(await bsdToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should exclude owner from fees", async function () {
      expect(await bsdToken.isExcludedFromFee(owner.address)).to.be.true;
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = ethers.parseUnits("100", 18);

      await bsdToken.transfer(addr1.address, amount);
      expect(await bsdToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should apply reflection fee on transfers between non-excluded accounts", async function () {
      const amount = ethers.parseUnits("1000", 18);

      // Transfer from owner (excluded) to addr1
      await bsdToken.transfer(addr1.address, amount);

      // Transfer from addr1 to addr2 (both not excluded)
      const balanceBefore = await bsdToken.balanceOf(addr2.address);
      await bsdToken.connect(addr1).transfer(addr2.address, amount);
      const balanceAfter = await bsdToken.balanceOf(addr2.address);

      // Should receive 90% (10% reflection fee)
      const expectedAmount = amount * BigInt(90) / BigInt(100);
      expect(balanceAfter - balanceBefore).to.equal(expectedAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await bsdToken.balanceOf(owner.address);

      await expect(
        bsdToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.reverted;

      expect(await bsdToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Reflection Mechanism", function () {
    it("Should distribute reflections to holders", async function () {
      const amount = ethers.parseUnits("1000", 18);

      // Setup: Give tokens to addr1 and addr2
      await bsdToken.transfer(addr1.address, amount);
      await bsdToken.transfer(addr2.address, amount);

      const addr1BalanceBefore = await bsdToken.balanceOf(addr1.address);

      // addr2 makes a transfer (creates reflection)
      await bsdToken.connect(addr2).transfer(addr3.address, amount / BigInt(2));

      // addr1 should have slightly more tokens due to reflections
      const addr1BalanceAfter = await bsdToken.balanceOf(addr1.address);
      expect(addr1BalanceAfter).to.be.gt(addr1BalanceBefore);
    });

    it("Should track total fees collected", async function () {
      const amount = ethers.parseUnits("1000", 18);

      await bsdToken.transfer(addr1.address, amount);

      const feesBefore = await bsdToken.totalFees();
      await bsdToken.connect(addr1).transfer(addr2.address, amount);
      const feesAfter = await bsdToken.totalFees();

      expect(feesAfter).to.be.gt(feesBefore);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to exclude address from fees", async function () {
      await bsdToken.excludeFromFee(addr1.address, true);
      expect(await bsdToken.isExcludedFromFee(addr1.address)).to.be.true;

      await bsdToken.excludeFromFee(addr1.address, false);
      expect(await bsdToken.isExcludedFromFee(addr1.address)).to.be.false;
    });

    it("Should allow owner to change reflection fee", async function () {
      await bsdToken.setReflectionFee(15);
      expect(await bsdToken.reflectionFee()).to.equal(15);
    });

    it("Should not allow setting fee above 20%", async function () {
      await expect(bsdToken.setReflectionFee(25)).to.be.revertedWith("Fee too high");
    });

    it("Should not allow non-owner to change settings", async function () {
      await expect(
        bsdToken.connect(addr1).setReflectionFee(5)
      ).to.be.reverted;
    });
  });
});
