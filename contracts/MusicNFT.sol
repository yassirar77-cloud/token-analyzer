// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MusicNFT
 * @dev ERC-721 contract for limited edition music NFTs with built-in royalties
 * Each track can have multiple limited editions with automatic 10% artist royalties on resales
 */
contract MusicNFT is ERC721, ERC721URIStorage, ERC721Royalty, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct TrackInfo {
        uint256 trackId;
        string artist;
        string title;
        string ipfsHash;
        uint256 price;
        uint256 maxEditions;
        uint256 mintedEditions;
        address artistAddress;
        bool exists;
    }

    struct Edition {
        uint256 trackId;
        uint256 editionNumber;
    }

    // Track ID => Track Info
    mapping(uint256 => TrackInfo) public tracks;

    // Token ID => Edition Info
    mapping(uint256 => Edition) public editions;

    // Counter for track IDs
    Counters.Counter private _trackIdCounter;

    // Mapping to track verified artists
    mapping(address => bool) public verifiedArtists;

    event TrackCreated(uint256 indexed trackId, address indexed artist, string title, uint256 maxEditions);
    event EditionMinted(uint256 indexed tokenId, uint256 indexed trackId, uint256 editionNumber, address indexed owner);
    event ArtistVerified(address indexed artist, bool verified);

    constructor() ERC721("Back Street Dogs Music", "BSDM") Ownable(msg.sender) {}

    /**
     * @dev Create a new track with limited editions
     * @param artist Artist name
     * @param title Track title
     * @param ipfsHash IPFS hash of the music file
     * @param price Price for each NFT edition
     * @param maxEditions Maximum number of editions to mint
     * @param metadataURI Base URI for metadata (will append edition number)
     */
    function createTrack(
        string memory artist,
        string memory title,
        string memory ipfsHash,
        uint256 price,
        uint256 maxEditions,
        string memory metadataURI
    ) external returns (uint256) {
        require(maxEditions > 0 && maxEditions <= 10000, "Invalid edition count");

        uint256 trackId = _trackIdCounter.current();
        _trackIdCounter.increment();

        tracks[trackId] = TrackInfo({
            trackId: trackId,
            artist: artist,
            title: title,
            ipfsHash: ipfsHash,
            price: price,
            maxEditions: maxEditions,
            mintedEditions: 0,
            artistAddress: msg.sender,
            exists: true
        });

        emit TrackCreated(trackId, msg.sender, title, maxEditions);

        return trackId;
    }

    /**
     * @dev Mint a new edition of a track
     * @param trackId The track to mint an edition of
     * @param to Address to mint the NFT to
     * @param tokenURI Metadata URI for this specific edition
     */
    function mintEdition(uint256 trackId, address to, string memory tokenURI) external returns (uint256) {
        TrackInfo storage track = tracks[trackId];
        require(track.exists, "Track does not exist");
        require(track.mintedEditions < track.maxEditions, "All editions minted");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        uint256 editionNumber = track.mintedEditions + 1;
        track.mintedEditions++;

        editions[tokenId] = Edition({
            trackId: trackId,
            editionNumber: editionNumber
        });

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Set 10% royalty to artist
        _setTokenRoyalty(tokenId, track.artistAddress, 1000); // 1000 = 10% in basis points

        emit EditionMinted(tokenId, trackId, editionNumber, to);

        return tokenId;
    }

    /**
     * @dev Get track information
     */
    function getTrack(uint256 trackId) external view returns (TrackInfo memory) {
        require(tracks[trackId].exists, "Track does not exist");
        return tracks[trackId];
    }

    /**
     * @dev Get edition information for a token
     */
    function getEdition(uint256 tokenId) external view returns (Edition memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return editions[tokenId];
    }

    /**
     * @dev Verify an artist
     */
    function verifyArtist(address artist, bool verified) external onlyOwner {
        verifiedArtists[artist] = verified;
        emit ArtistVerified(artist, verified);
    }

    /**
     * @dev Check if an artist is verified
     */
    function isVerifiedArtist(address artist) external view returns (bool) {
        return verifiedArtists[artist];
    }

    /**
     * @dev Get total number of tracks
     */
    function getTotalTracks() external view returns (uint256) {
        return _trackIdCounter.current();
    }

    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }
}
