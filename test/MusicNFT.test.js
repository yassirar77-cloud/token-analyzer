const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MusicNFT", function () {
  let musicNFT;
  let owner;
  let artist;
  let buyer;
  let addr2;

  beforeEach(async function () {
    [owner, artist, buyer, addr2] = await ethers.getSigners();

    const MusicNFT = await ethers.getContractFactory("MusicNFT");
    musicNFT = await MusicNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await musicNFT.name()).to.equal("Back Street Dogs Music");
      expect(await musicNFT.symbol()).to.equal("BSDM");
    });

    it("Should set the deployer as owner", async function () {
      expect(await musicNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Track Creation", function () {
    it("Should create a new track", async function () {
      const tx = await musicNFT.connect(artist).createTrack(
        "Artist Name",
        "Track Title",
        "QmIPFSHash123",
        ethers.parseUnits("100", 18),
        100,
        "ipfs://metadata/"
      );

      await expect(tx)
        .to.emit(musicNFT, "TrackCreated")
        .withArgs(0, artist.address, "Track Title", 100);

      const track = await musicNFT.getTrack(0);
      expect(track.artist).to.equal("Artist Name");
      expect(track.title).to.equal("Track Title");
      expect(track.ipfsHash).to.equal("QmIPFSHash123");
      expect(track.maxEditions).to.equal(100);
      expect(track.mintedEditions).to.equal(0);
      expect(track.artistAddress).to.equal(artist.address);
    });

    it("Should not allow creating track with 0 editions", async function () {
      await expect(
        musicNFT.connect(artist).createTrack(
          "Artist",
          "Title",
          "Hash",
          ethers.parseUnits("100", 18),
          0,
          "uri"
        )
      ).to.be.revertedWith("Invalid edition count");
    });

    it("Should not allow creating track with too many editions", async function () {
      await expect(
        musicNFT.connect(artist).createTrack(
          "Artist",
          "Title",
          "Hash",
          ethers.parseUnits("100", 18),
          10001,
          "uri"
        )
      ).to.be.revertedWith("Invalid edition count");
    });
  });

  describe("NFT Minting", function () {
    beforeEach(async function () {
      await musicNFT.connect(artist).createTrack(
        "Artist Name",
        "Track Title",
        "QmIPFSHash123",
        ethers.parseUnits("100", 18),
        10,
        "ipfs://metadata/"
      );
    });

    it("Should mint an edition", async function () {
      const tx = await musicNFT.mintEdition(0, buyer.address, "ipfs://metadata/1");

      await expect(tx)
        .to.emit(musicNFT, "EditionMinted")
        .withArgs(0, 0, 1, buyer.address);

      expect(await musicNFT.ownerOf(0)).to.equal(buyer.address);

      const edition = await musicNFT.getEdition(0);
      expect(edition.trackId).to.equal(0);
      expect(edition.editionNumber).to.equal(1);
    });

    it("Should mint multiple editions with incrementing numbers", async function () {
      await musicNFT.mintEdition(0, buyer.address, "ipfs://metadata/1");
      await musicNFT.mintEdition(0, addr2.address, "ipfs://metadata/2");

      const edition1 = await musicNFT.getEdition(0);
      const edition2 = await musicNFT.getEdition(1);

      expect(edition1.editionNumber).to.equal(1);
      expect(edition2.editionNumber).to.equal(2);
    });

    it("Should not allow minting beyond max editions", async function () {
      // Mint all 10 editions
      for (let i = 0; i < 10; i++) {
        await musicNFT.mintEdition(0, buyer.address, `ipfs://metadata/${i}`);
      }

      // Try to mint 11th
      await expect(
        musicNFT.mintEdition(0, buyer.address, "ipfs://metadata/11")
      ).to.be.revertedWith("All editions minted");
    });

    it("Should set 10% royalty for artist", async function () {
      await musicNFT.mintEdition(0, buyer.address, "ipfs://metadata/1");

      const price = ethers.parseUnits("100", 18);
      const [receiver, royaltyAmount] = await musicNFT.royaltyInfo(0, price);

      expect(receiver).to.equal(artist.address);
      expect(royaltyAmount).to.equal(price * BigInt(10) / BigInt(100)); // 10%
    });
  });

  describe("Artist Verification", function () {
    it("Should allow owner to verify artists", async function () {
      await musicNFT.verifyArtist(artist.address, true);
      expect(await musicNFT.isVerifiedArtist(artist.address)).to.be.true;

      await musicNFT.verifyArtist(artist.address, false);
      expect(await musicNFT.isVerifiedArtist(artist.address)).to.be.false;
    });

    it("Should not allow non-owner to verify artists", async function () {
      await expect(
        musicNFT.connect(artist).verifyArtist(addr2.address, true)
      ).to.be.reverted;
    });
  });

  describe("Track Queries", function () {
    it("Should return correct total tracks", async function () {
      expect(await musicNFT.getTotalTracks()).to.equal(0);

      await musicNFT.connect(artist).createTrack(
        "Artist",
        "Track 1",
        "Hash1",
        ethers.parseUnits("100", 18),
        10,
        "uri"
      );

      expect(await musicNFT.getTotalTracks()).to.equal(1);

      await musicNFT.connect(artist).createTrack(
        "Artist",
        "Track 2",
        "Hash2",
        ethers.parseUnits("100", 18),
        10,
        "uri"
      );

      expect(await musicNFT.getTotalTracks()).to.equal(2);
    });
  });
});
