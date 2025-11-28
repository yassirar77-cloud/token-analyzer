const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MusicMarketplace", function () {
  let bsdToken;
  let musicNFT;
  let streamingAccess;
  let marketplace;
  let owner;
  let platformWallet;
  let artist;
  let buyer1;
  let buyer2;

  const INITIAL_SUPPLY = 1000000;
  const STREAMING_PRICE = ethers.parseUnits("10", 18);
  const NFT_PRICE = ethers.parseUnits("100", 18);

  beforeEach(async function () {
    [owner, platformWallet, artist, buyer1, buyer2] = await ethers.getSigners();

    // Deploy BSDToken
    const BSDToken = await ethers.getContractFactory("BSDToken");
    bsdToken = await BSDToken.deploy(INITIAL_SUPPLY);

    // Deploy MusicNFT
    const MusicNFT = await ethers.getContractFactory("MusicNFT");
    musicNFT = await MusicNFT.deploy();

    // Deploy StreamingAccess
    const StreamingAccess = await ethers.getContractFactory("StreamingAccess");
    streamingAccess = await StreamingAccess.deploy();

    // Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("MusicMarketplace");
    marketplace = await Marketplace.deploy(
      await bsdToken.getAddress(),
      await musicNFT.getAddress(),
      await streamingAccess.getAddress(),
      platformWallet.address
    );

    // Setup: Grant marketplace role to marketplace contract
    const MARKETPLACE_ROLE = await streamingAccess.MARKETPLACE_ROLE();
    await streamingAccess.grantRole(MARKETPLACE_ROLE, await marketplace.getAddress());

    // Exclude marketplace from BSD fees
    await bsdToken.excludeFromFee(await marketplace.getAddress(), true);

    // Give buyers some BSD tokens
    const buyerAmount = ethers.parseUnits("10000", 18);
    await bsdToken.transfer(buyer1.address, buyerAmount);
    await bsdToken.transfer(buyer2.address, buyerAmount);

    // Create a track
    await musicNFT.connect(artist).createTrack(
      "Test Artist",
      "Test Track",
      "QmTestHash",
      NFT_PRICE,
      10,
      "ipfs://metadata/"
    );

    // Set streaming price
    await marketplace.connect(artist).setStreamingPrice(0, STREAMING_PRICE);
  });

  describe("Deployment", function () {
    it("Should set correct token addresses", async function () {
      expect(await marketplace.bsdToken()).to.equal(await bsdToken.getAddress());
      expect(await marketplace.musicNFT()).to.equal(await musicNFT.getAddress());
      expect(await marketplace.streamingAccess()).to.equal(await streamingAccess.getAddress());
    });

    it("Should set correct revenue shares", async function () {
      expect(await marketplace.artistShare()).to.equal(70);
      expect(await marketplace.platformShare()).to.equal(20);
      expect(await marketplace.reflectionShare()).to.equal(10);
    });

    it("Should set platform wallet", async function () {
      expect(await marketplace.platformWallet()).to.equal(platformWallet.address);
    });
  });

  describe("Streaming Purchases", function () {
    it("Should allow purchasing streaming access", async function () {
      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), STREAMING_PRICE);

      await expect(marketplace.connect(buyer1).purchaseStreaming(0))
        .to.emit(marketplace, "StreamingPurchased")
        .withArgs(buyer1.address, 0, STREAMING_PRICE);

      expect(await streamingAccess.hasAccess(buyer1.address, 0)).to.be.true;
    });

    it("Should distribute revenue correctly for streaming", async function () {
      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), STREAMING_PRICE);

      const artistBalanceBefore = await bsdToken.balanceOf(artist.address);
      const platformBalanceBefore = await bsdToken.balanceOf(platformWallet.address);

      await marketplace.connect(buyer1).purchaseStreaming(0);

      const artistBalanceAfter = await bsdToken.balanceOf(artist.address);
      const platformBalanceAfter = await bsdToken.balanceOf(platformWallet.address);

      const artistReceived = artistBalanceAfter - artistBalanceBefore;
      const platformReceived = platformBalanceAfter - platformBalanceBefore;

      // Artist should receive 70%
      expect(artistReceived).to.equal(STREAMING_PRICE * BigInt(70) / BigInt(100));

      // Platform should receive 20% + 10% (reflection goes to platform in test)
      expect(platformReceived).to.equal(STREAMING_PRICE * BigInt(30) / BigInt(100));
    });

    it("Should not allow purchasing streaming twice", async function () {
      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), STREAMING_PRICE);
      await marketplace.connect(buyer1).purchaseStreaming(0);

      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), STREAMING_PRICE);
      await expect(
        marketplace.connect(buyer1).purchaseStreaming(0)
      ).to.be.revertedWith("Already have access");
    });

    it("Should fail if streaming not available", async function () {
      await expect(
        marketplace.connect(buyer1).purchaseStreaming(999)
      ).to.be.revertedWith("Streaming not available for this track");
    });

    it("Should only allow artist to set streaming price", async function () {
      await expect(
        marketplace.connect(buyer1).setStreamingPrice(0, STREAMING_PRICE)
      ).to.be.revertedWith("Only artist can set price");
    });
  });

  describe("NFT Edition Purchases", function () {
    it("Should allow purchasing NFT editions", async function () {
      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), NFT_PRICE);

      await expect(marketplace.connect(buyer1).purchaseNFTEdition(0, "ipfs://metadata/1"))
        .to.emit(marketplace, "NFTEditionPurchased");

      expect(await musicNFT.ownerOf(0)).to.equal(buyer1.address);

      const edition = await musicNFT.getEdition(0);
      expect(edition.editionNumber).to.equal(1);
    });

    it("Should distribute revenue correctly for NFT purchase", async function () {
      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), NFT_PRICE);

      const artistBalanceBefore = await bsdToken.balanceOf(artist.address);
      const platformBalanceBefore = await bsdToken.balanceOf(platformWallet.address);

      await marketplace.connect(buyer1).purchaseNFTEdition(0, "ipfs://metadata/1");

      const artistBalanceAfter = await bsdToken.balanceOf(artist.address);
      const platformBalanceAfter = await bsdToken.balanceOf(platformWallet.address);

      const artistReceived = artistBalanceAfter - artistBalanceBefore;

      expect(artistReceived).to.equal(NFT_PRICE * BigInt(70) / BigInt(100));
    });

    it("Should mint multiple editions with correct numbers", async function () {
      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), NFT_PRICE * BigInt(2));
      await marketplace.connect(buyer1).purchaseNFTEdition(0, "ipfs://metadata/1");
      await marketplace.connect(buyer1).purchaseNFTEdition(0, "ipfs://metadata/2");

      const edition1 = await musicNFT.getEdition(0);
      const edition2 = await musicNFT.getEdition(1);

      expect(edition1.editionNumber).to.equal(1);
      expect(edition2.editionNumber).to.equal(2);
    });

    it("Should not allow purchasing beyond max editions", async function () {
      // Purchase all 10 editions
      for (let i = 0; i < 10; i++) {
        await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), NFT_PRICE);
        await marketplace.connect(buyer1).purchaseNFTEdition(0, `ipfs://metadata/${i}`);
      }

      // Try to purchase 11th
      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), NFT_PRICE);
      await expect(
        marketplace.connect(buyer1).purchaseNFTEdition(0, "ipfs://metadata/11")
      ).to.be.revertedWith("All editions sold out");
    });
  });

  describe("NFT Resale Marketplace", function () {
    beforeEach(async function () {
      // Buyer1 purchases an NFT
      await bsdToken.connect(buyer1).approve(await marketplace.getAddress(), NFT_PRICE);
      await marketplace.connect(buyer1).purchaseNFTEdition(0, "ipfs://metadata/1");
    });

    it("Should allow listing NFT for resale", async function () {
      const resalePrice = ethers.parseUnits("150", 18);

      await musicNFT.connect(buyer1).approve(await marketplace.getAddress(), 0);
      await expect(marketplace.connect(buyer1).listNFT(0, resalePrice))
        .to.emit(marketplace, "NFTListed")
        .withArgs(0, buyer1.address, resalePrice);

      const listing = await marketplace.getListing(0);
      expect(listing.seller).to.equal(buyer1.address);
      expect(listing.price).to.equal(resalePrice);
      expect(listing.active).to.be.true;
    });

    it("Should transfer NFT to marketplace when listing", async function () {
      const resalePrice = ethers.parseUnits("150", 18);

      await musicNFT.connect(buyer1).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(buyer1).listNFT(0, resalePrice);

      expect(await musicNFT.ownerOf(0)).to.equal(await marketplace.getAddress());
    });

    it("Should allow unlisting NFT", async function () {
      const resalePrice = ethers.parseUnits("150", 18);

      await musicNFT.connect(buyer1).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(buyer1).listNFT(0, resalePrice);

      await expect(marketplace.connect(buyer1).unlistNFT(0))
        .to.emit(marketplace, "NFTUnlisted")
        .withArgs(0, buyer1.address);

      expect(await musicNFT.ownerOf(0)).to.equal(buyer1.address);
    });

    it("Should allow purchasing listed NFT with royalties", async function () {
      const resalePrice = ethers.parseUnits("150", 18);

      await musicNFT.connect(buyer1).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(buyer1).listNFT(0, resalePrice);

      const artistBalanceBefore = await bsdToken.balanceOf(artist.address);
      const seller1BalanceBefore = await bsdToken.balanceOf(buyer1.address);

      await bsdToken.connect(buyer2).approve(await marketplace.getAddress(), resalePrice);
      await marketplace.connect(buyer2).purchaseListedNFT(0);

      const artistBalanceAfter = await bsdToken.balanceOf(artist.address);
      const seller1BalanceAfter = await bsdToken.balanceOf(buyer1.address);

      // Artist receives 10% royalty
      const royaltyAmount = resalePrice * BigInt(10) / BigInt(100);
      expect(artistBalanceAfter - artistBalanceBefore).to.equal(royaltyAmount);

      // Seller receives 90%
      const sellerAmount = resalePrice - royaltyAmount;
      expect(seller1BalanceAfter - seller1BalanceBefore).to.equal(sellerAmount);

      // Buyer2 now owns the NFT
      expect(await musicNFT.ownerOf(0)).to.equal(buyer2.address);
    });

    it("Should track active listings", async function () {
      const resalePrice = ethers.parseUnits("150", 18);

      await musicNFT.connect(buyer1).approve(await marketplace.getAddress(), 0);
      await marketplace.connect(buyer1).listNFT(0, resalePrice);

      const activeListings = await marketplace.getActiveListings();
      expect(activeListings.length).to.equal(1);
      expect(activeListings[0]).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update revenue shares", async function () {
      await marketplace.updateRevenueShares(60, 30, 10);

      expect(await marketplace.artistShare()).to.equal(60);
      expect(await marketplace.platformShare()).to.equal(30);
      expect(await marketplace.reflectionShare()).to.equal(10);
    });

    it("Should not allow invalid revenue shares", async function () {
      await expect(
        marketplace.updateRevenueShares(60, 30, 20)
      ).to.be.revertedWith("Shares must total 100");
    });

    it("Should allow owner to update platform wallet", async function () {
      await marketplace.updatePlatformWallet(buyer1.address);
      expect(await marketplace.platformWallet()).to.equal(buyer1.address);
    });

    it("Should not allow non-owner to update settings", async function () {
      await expect(
        marketplace.connect(buyer1).updateRevenueShares(60, 30, 10)
      ).to.be.reverted;

      await expect(
        marketplace.connect(buyer1).updatePlatformWallet(buyer2.address)
      ).to.be.reverted;
    });
  });
});
