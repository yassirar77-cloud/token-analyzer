// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MusicNFT.sol";
import "./StreamingAccess.sol";
import "./BSDToken.sol";

/**
 * @title MusicMarketplace
 * @dev Marketplace for buying streaming access and NFT editions with BSD tokens
 * Revenue split: 70% artist, 20% platform, 10% reflections (handled by BSD token)
 */
contract MusicMarketplace is IERC721Receiver, ReentrancyGuard, Ownable {
    BSDToken public bsdToken;
    MusicNFT public musicNFT;
    StreamingAccess public streamingAccess;

    address public platformWallet;

    // Revenue split percentages (out of 100)
    uint256 public artistShare = 70;
    uint256 public platformShare = 20;
    uint256 public reflectionShare = 10;

    // Track ID => Streaming Price
    mapping(uint256 => uint256) public streamingPrices;

    // NFT Resale Listings
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public nftListings;
    uint256[] public activeListings;

    event StreamingPurchased(address indexed buyer, uint256 indexed trackId, uint256 price);
    event NFTEditionPurchased(address indexed buyer, uint256 indexed trackId, uint256 tokenId, uint256 editionNumber, uint256 price);
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId, address indexed seller);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event StreamingPriceSet(uint256 indexed trackId, uint256 price);
    event RevenueDistributed(address indexed artist, uint256 artistAmount, uint256 platformAmount, uint256 reflectionAmount);

    constructor(
        address _bsdToken,
        address _musicNFT,
        address _streamingAccess,
        address _platformWallet
    ) Ownable(msg.sender) {
        require(_bsdToken != address(0), "Invalid BSD token address");
        require(_musicNFT != address(0), "Invalid MusicNFT address");
        require(_streamingAccess != address(0), "Invalid StreamingAccess address");
        require(_platformWallet != address(0), "Invalid platform wallet");

        bsdToken = BSDToken(_bsdToken);
        musicNFT = MusicNFT(_musicNFT);
        streamingAccess = StreamingAccess(_streamingAccess);
        platformWallet = _platformWallet;
    }

    /**
     * @dev Set streaming price for a track (artist only)
     * @param trackId Track ID
     * @param price Price in BSD tokens
     */
    function setStreamingPrice(uint256 trackId, uint256 price) external {
        MusicNFT.TrackInfo memory track = musicNFT.getTrack(trackId);
        require(track.artistAddress == msg.sender, "Only artist can set price");
        require(price > 0, "Price must be greater than 0");

        streamingPrices[trackId] = price;
        emit StreamingPriceSet(trackId, price);
    }

    /**
     * @dev Purchase streaming access to a track
     * @param trackId Track ID to purchase
     */
    function purchaseStreaming(uint256 trackId) external nonReentrant {
        require(streamingPrices[trackId] > 0, "Streaming not available for this track");
        require(!streamingAccess.hasAccess(msg.sender, trackId), "Already have access");

        uint256 price = streamingPrices[trackId];
        MusicNFT.TrackInfo memory track = musicNFT.getTrack(trackId);

        // Transfer BSD tokens from buyer to this contract
        require(bsdToken.transferFrom(msg.sender, address(this), price), "Transfer failed");

        // Distribute revenue (70% artist, 20% platform, 10% reflections)
        uint256 artistAmount = (price * artistShare) / 100;
        uint256 platformAmount = (price * platformShare) / 100;
        uint256 reflectionAmount = price - artistAmount - platformAmount;

        // Transfer to artist (no fee since contract is excluded)
        require(bsdToken.transfer(track.artistAddress, artistAmount), "Artist payment failed");

        // Transfer to platform (no fee since contract is excluded)
        require(bsdToken.transfer(platformWallet, platformAmount), "Platform payment failed");

        // Transfer reflection amount to a holder address to trigger reflection
        // This creates a taxable transaction that distributes to all holders
        require(bsdToken.transfer(platformWallet, reflectionAmount), "Reflection distribution failed");

        // Grant streaming access
        streamingAccess.grantAccess(msg.sender, trackId, price);

        emit StreamingPurchased(msg.sender, trackId, price);
        emit RevenueDistributed(track.artistAddress, artistAmount, platformAmount, reflectionAmount);
    }

    /**
     * @dev Purchase an NFT edition of a track
     * @param trackId Track ID to purchase
     * @param metadataURI Metadata URI for the NFT
     */
    function purchaseNFTEdition(uint256 trackId, string memory metadataURI) external nonReentrant returns (uint256) {
        MusicNFT.TrackInfo memory track = musicNFT.getTrack(trackId);
        require(track.mintedEditions < track.maxEditions, "All editions sold out");

        uint256 price = track.price;
        require(price > 0, "NFT not for sale");

        // Transfer BSD tokens from buyer
        require(bsdToken.transferFrom(msg.sender, address(this), price), "Transfer failed");

        // Distribute revenue
        uint256 artistAmount = (price * artistShare) / 100;
        uint256 platformAmount = (price * platformShare) / 100;
        uint256 reflectionAmount = price - artistAmount - platformAmount;

        require(bsdToken.transfer(track.artistAddress, artistAmount), "Artist payment failed");
        require(bsdToken.transfer(platformWallet, platformAmount), "Platform payment failed");
        require(bsdToken.transfer(platformWallet, reflectionAmount), "Reflection distribution failed");

        // Mint NFT to buyer
        uint256 tokenId = musicNFT.mintEdition(trackId, msg.sender, metadataURI);
        MusicNFT.Edition memory edition = musicNFT.getEdition(tokenId);

        emit NFTEditionPurchased(msg.sender, trackId, tokenId, edition.editionNumber, price);
        emit RevenueDistributed(track.artistAddress, artistAmount, platformAmount, reflectionAmount);

        return tokenId;
    }

    /**
     * @dev List an NFT for resale
     * @param tokenId Token ID to list
     * @param price Price in BSD tokens
     */
    function listNFT(uint256 tokenId, uint256 price) external {
        require(musicNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(!nftListings[tokenId].active, "Already listed");

        // Transfer NFT to marketplace
        musicNFT.safeTransferFrom(msg.sender, address(this), tokenId);

        nftListings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true
        });

        activeListings.push(tokenId);

        emit NFTListed(tokenId, msg.sender, price);
    }

    /**
     * @dev Unlist an NFT from resale
     * @param tokenId Token ID to unlist
     */
    function unlistNFT(uint256 tokenId) external {
        Listing storage listing = nftListings[tokenId];
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender, "Not the seller");

        listing.active = false;

        // Transfer NFT back to seller
        musicNFT.safeTransferFrom(address(this), msg.sender, tokenId);

        // Remove from active listings
        _removeFromActiveListings(tokenId);

        emit NFTUnlisted(tokenId, msg.sender);
    }

    /**
     * @dev Purchase a listed NFT
     * @param tokenId Token ID to purchase
     */
    function purchaseListedNFT(uint256 tokenId) external nonReentrant {
        Listing storage listing = nftListings[tokenId];
        require(listing.active, "Not listed");

        uint256 price = listing.price;
        address seller = listing.seller;

        // Get royalty info (ERC-2981)
        (address royaltyReceiver, uint256 royaltyAmount) = musicNFT.royaltyInfo(tokenId, price);

        // Transfer BSD tokens from buyer
        require(bsdToken.transferFrom(msg.sender, address(this), price), "Transfer failed");

        // Pay royalty to artist (10%)
        require(bsdToken.transfer(royaltyReceiver, royaltyAmount), "Royalty payment failed");

        // Pay seller (90%)
        uint256 sellerAmount = price - royaltyAmount;
        require(bsdToken.transfer(seller, sellerAmount), "Seller payment failed");

        // Transfer NFT to buyer
        musicNFT.safeTransferFrom(address(this), msg.sender, tokenId);

        listing.active = false;
        _removeFromActiveListings(tokenId);

        emit NFTSold(tokenId, seller, msg.sender, price);
    }

    /**
     * @dev Get all active NFT listings
     */
    function getActiveListings() external view returns (uint256[] memory) {
        return activeListings;
    }

    /**
     * @dev Get listing details
     */
    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return nftListings[tokenId];
    }

    /**
     * @dev Update revenue split percentages (owner only)
     */
    function updateRevenueShares(uint256 _artistShare, uint256 _platformShare, uint256 _reflectionShare) external onlyOwner {
        require(_artistShare + _platformShare + _reflectionShare == 100, "Shares must total 100");
        artistShare = _artistShare;
        platformShare = _platformShare;
        reflectionShare = _reflectionShare;
    }

    /**
     * @dev Update platform wallet (owner only)
     */
    function updatePlatformWallet(address _platformWallet) external onlyOwner {
        require(_platformWallet != address(0), "Invalid address");
        platformWallet = _platformWallet;
    }

    /**
     * @dev Remove token from active listings array
     */
    function _removeFromActiveListings(uint256 tokenId) private {
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == tokenId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
    }

    /**
     * @dev Handle NFT received
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
