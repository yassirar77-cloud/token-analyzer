// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
/**
 * @title StreamingAccess
 * @dev Manages permanent streaming access rights for music tracks
 * Users who purchase streaming access gain permanent rights to stream a track
 */
contract StreamingAccess is AccessControl {
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");

    struct StreamingRight {
        uint256 trackId;
        address owner;
        uint256 purchaseDate;
        uint256 price;
    }

    // User => Track ID => Has Access
    mapping(address => mapping(uint256 => bool)) private _streamingAccess;

    // User => Track ID => Purchase Details
    mapping(address => mapping(uint256 => StreamingRight)) private _purchaseHistory;

    // Track ID => Total purchases
    mapping(uint256 => uint256) public trackPurchaseCount;

    // Track ID => Total revenue
    mapping(uint256 => uint256) public trackRevenue;

    // User => All purchased track IDs
    mapping(address => uint256[]) private _userPurchases;

    event StreamingAccessGranted(address indexed user, uint256 indexed trackId, uint256 price);
    event StreamingAccessRevoked(address indexed user, uint256 indexed trackId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MARKETPLACE_ROLE, msg.sender);
    }

    /**
     * @dev Grant streaming access to a user (called by marketplace)
     * @param user Address to grant access to
     * @param trackId Track ID to grant access for
     * @param price Price paid for access
     */
    function grantAccess(address user, uint256 trackId, uint256 price) external onlyRole(MARKETPLACE_ROLE) {
        require(user != address(0), "Invalid user address");
        require(!_streamingAccess[user][trackId], "User already has access");

        _streamingAccess[user][trackId] = true;

        _purchaseHistory[user][trackId] = StreamingRight({
            trackId: trackId,
            owner: user,
            purchaseDate: block.timestamp,
            price: price
        });

        _userPurchases[user].push(trackId);
        trackPurchaseCount[trackId]++;
        trackRevenue[trackId] += price;

        emit StreamingAccessGranted(user, trackId, price);
    }

    /**
     * @dev Revoke streaming access (admin only, for emergencies)
     * @param user Address to revoke access from
     * @param trackId Track ID to revoke access for
     */
    function revokeAccess(address user, uint256 trackId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_streamingAccess[user][trackId], "User doesn't have access");

        _streamingAccess[user][trackId] = false;

        emit StreamingAccessRevoked(user, trackId);
    }

    /**
     * @dev Check if user has streaming access to a track
     * @param user Address to check
     * @param trackId Track ID to check
     */
    function hasAccess(address user, uint256 trackId) external view returns (bool) {
        return _streamingAccess[user][trackId];
    }

    /**
     * @dev Get purchase details for a user and track
     * @param user Address to check
     * @param trackId Track ID to check
     */
    function getPurchaseDetails(address user, uint256 trackId) external view returns (StreamingRight memory) {
        require(_streamingAccess[user][trackId], "User doesn't have access");
        return _purchaseHistory[user][trackId];
    }

    /**
     * @dev Get all tracks purchased by a user
     * @param user Address to check
     */
    function getUserPurchases(address user) external view returns (uint256[] memory) {
        return _userPurchases[user];
    }

    /**
     * @dev Get analytics for a track
     * @param trackId Track ID to check
     */
    function getTrackAnalytics(uint256 trackId) external view returns (uint256 purchases, uint256 revenue) {
        return (trackPurchaseCount[trackId], trackRevenue[trackId]);
    }

    /**
     * @dev Batch check access for multiple tracks
     * @param user Address to check
     * @param trackIds Array of track IDs to check
     */
    function batchCheckAccess(address user, uint256[] calldata trackIds) external view returns (bool[] memory) {
        bool[] memory accessList = new bool[](trackIds.length);
        for (uint256 i = 0; i < trackIds.length; i++) {
            accessList[i] = _streamingAccess[user][trackIds[i]];
        }
        return accessList;
    }

    /**
     * @dev Set marketplace contract address
     * @param marketplace Address of the marketplace contract
     */
    function setMarketplace(address marketplace) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(marketplace != address(0), "Invalid marketplace address");
        _grantRole(MARKETPLACE_ROLE, marketplace);
    }
}
