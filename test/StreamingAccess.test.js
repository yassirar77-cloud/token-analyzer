const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StreamingAccess", function () {
  let streamingAccess;
  let owner;
  let marketplace;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, marketplace, user1, user2] = await ethers.getSigners();

    const StreamingAccess = await ethers.getContractFactory("StreamingAccess");
    streamingAccess = await StreamingAccess.deploy();

    // Grant marketplace role
    const MARKETPLACE_ROLE = await streamingAccess.MARKETPLACE_ROLE();
    await streamingAccess.grantRole(MARKETPLACE_ROLE, marketplace.address);
  });

  describe("Deployment", function () {
    it("Should grant admin role to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await streamingAccess.DEFAULT_ADMIN_ROLE();
      expect(await streamingAccess.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should grant marketplace role to deployer", async function () {
      const MARKETPLACE_ROLE = await streamingAccess.MARKETPLACE_ROLE();
      expect(await streamingAccess.hasRole(MARKETPLACE_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Granting Access", function () {
    it("Should allow marketplace to grant access", async function () {
      const trackId = 1;
      const price = ethers.parseUnits("10", 18);

      await streamingAccess.connect(marketplace).grantAccess(user1.address, trackId, price);

      expect(await streamingAccess.hasAccess(user1.address, trackId)).to.be.true;
    });

    it("Should emit event when access granted", async function () {
      const trackId = 1;
      const price = ethers.parseUnits("10", 18);

      await expect(streamingAccess.connect(marketplace).grantAccess(user1.address, trackId, price))
        .to.emit(streamingAccess, "StreamingAccessGranted")
        .withArgs(user1.address, trackId, price);
    });

    it("Should not allow granting access twice", async function () {
      const trackId = 1;
      const price = ethers.parseUnits("10", 18);

      await streamingAccess.connect(marketplace).grantAccess(user1.address, trackId, price);

      await expect(
        streamingAccess.connect(marketplace).grantAccess(user1.address, trackId, price)
      ).to.be.revertedWith("User already has access");
    });

    it("Should not allow non-marketplace to grant access", async function () {
      const trackId = 1;
      const price = ethers.parseUnits("10", 18);

      await expect(
        streamingAccess.connect(user1).grantAccess(user2.address, trackId, price)
      ).to.be.reverted;
    });

    it("Should update purchase count and revenue", async function () {
      const trackId = 1;
      const price = ethers.parseUnits("10", 18);

      await streamingAccess.connect(marketplace).grantAccess(user1.address, trackId, price);
      await streamingAccess.connect(marketplace).grantAccess(user2.address, trackId, price);

      const [purchases, revenue] = await streamingAccess.getTrackAnalytics(trackId);
      expect(purchases).to.equal(2);
      expect(revenue).to.equal(price * BigInt(2));
    });
  });

  describe("Purchase History", function () {
    it("Should store purchase details", async function () {
      const trackId = 1;
      const price = ethers.parseUnits("10", 18);

      await streamingAccess.connect(marketplace).grantAccess(user1.address, trackId, price);

      const purchase = await streamingAccess.getPurchaseDetails(user1.address, trackId);
      expect(purchase.trackId).to.equal(trackId);
      expect(purchase.owner).to.equal(user1.address);
      expect(purchase.price).to.equal(price);
    });

    it("Should track all user purchases", async function () {
      await streamingAccess.connect(marketplace).grantAccess(
        user1.address,
        1,
        ethers.parseUnits("10", 18)
      );
      await streamingAccess.connect(marketplace).grantAccess(
        user1.address,
        2,
        ethers.parseUnits("20", 18)
      );
      await streamingAccess.connect(marketplace).grantAccess(
        user1.address,
        3,
        ethers.parseUnits("30", 18)
      );

      const purchases = await streamingAccess.getUserPurchases(user1.address);
      expect(purchases.length).to.equal(3);
      expect(purchases[0]).to.equal(1);
      expect(purchases[1]).to.equal(2);
      expect(purchases[2]).to.equal(3);
    });
  });

  describe("Batch Operations", function () {
    it("Should batch check access for multiple tracks", async function () {
      await streamingAccess.connect(marketplace).grantAccess(
        user1.address,
        1,
        ethers.parseUnits("10", 18)
      );
      await streamingAccess.connect(marketplace).grantAccess(
        user1.address,
        3,
        ethers.parseUnits("30", 18)
      );

      const trackIds = [1, 2, 3, 4];
      const accessList = await streamingAccess.batchCheckAccess(user1.address, trackIds);

      expect(accessList[0]).to.be.true;  // Has access to track 1
      expect(accessList[1]).to.be.false; // No access to track 2
      expect(accessList[2]).to.be.true;  // Has access to track 3
      expect(accessList[3]).to.be.false; // No access to track 4
    });
  });

  describe("Revoking Access", function () {
    it("Should allow admin to revoke access", async function () {
      const trackId = 1;
      const price = ethers.parseUnits("10", 18);

      await streamingAccess.connect(marketplace).grantAccess(user1.address, trackId, price);
      expect(await streamingAccess.hasAccess(user1.address, trackId)).to.be.true;

      await streamingAccess.revokeAccess(user1.address, trackId);
      expect(await streamingAccess.hasAccess(user1.address, trackId)).to.be.false;
    });

    it("Should emit event when access revoked", async function () {
      const trackId = 1;
      await streamingAccess.connect(marketplace).grantAccess(
        user1.address,
        trackId,
        ethers.parseUnits("10", 18)
      );

      await expect(streamingAccess.revokeAccess(user1.address, trackId))
        .to.emit(streamingAccess, "StreamingAccessRevoked")
        .withArgs(user1.address, trackId);
    });

    it("Should not allow non-admin to revoke access", async function () {
      const trackId = 1;
      await streamingAccess.connect(marketplace).grantAccess(
        user1.address,
        trackId,
        ethers.parseUnits("10", 18)
      );

      await expect(
        streamingAccess.connect(user1).revokeAccess(user1.address, trackId)
      ).to.be.reverted;
    });
  });

  describe("Marketplace Management", function () {
    it("Should allow admin to set marketplace", async function () {
      const MARKETPLACE_ROLE = await streamingAccess.MARKETPLACE_ROLE();

      await streamingAccess.setMarketplace(user2.address);

      expect(await streamingAccess.hasRole(MARKETPLACE_ROLE, user2.address)).to.be.true;
    });

    it("Should not allow non-admin to set marketplace", async function () {
      await expect(
        streamingAccess.connect(user1).setMarketplace(user2.address)
      ).to.be.reverted;
    });
  });
});
