// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

/// @title BSDPrivateIdentity
/// @notice Allows BSD members to prove group membership via ZK proofs (Semaphore)
///         without revealing their wallet address.
contract BSDPrivateIdentity {
    ISemaphore public semaphore;
    uint256 public groupId;
    address public admin;

    // Track nullifiers to prevent double-actions
    mapping(uint256 => bool) public usedNullifiers;

    event MemberJoined(uint256 indexed identityCommitment);
    event MemberVerified(uint256 indexed nullifier, uint256 message);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(address _semaphore, uint256 _groupId) {
        semaphore = ISemaphore(_semaphore);
        groupId = _groupId;
        admin = msg.sender;
    }

    /// @notice Add member commitment (called when user joins BSD)
    /// @param identityCommitment The Semaphore identity commitment of the new member
    function joinGroup(uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
        emit MemberJoined(identityCommitment);
    }

    /// @notice Verify membership without revealing identity
    /// @param merkleTreeDepth Depth of the Semaphore merkle tree
    /// @param merkleTreeRoot Root of the Semaphore merkle tree
    /// @param nullifier Unique nullifier to prevent double-use
    /// @param message Arbitrary message being signed/proven
    /// @param proof The Groth16 proof points
    /// @return True if the proof is valid
    function verifyMember(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 message,
        uint256[8] calldata proof
    ) external returns (bool) {
        require(!usedNullifiers[nullifier], "Proof already used");
        usedNullifiers[nullifier] = true;

        semaphore.validateProof(groupId, ISemaphore.SemaphoreProof({
            merkleTreeDepth: merkleTreeDepth,
            merkleTreeRoot: merkleTreeRoot,
            nullifier: nullifier,
            message: message,
            scope: groupId,
            points: proof
        }));

        emit MemberVerified(nullifier, message);
        return true;
    }

    /// @notice Check if a nullifier has been used
    /// @param nullifier The nullifier to check
    /// @return True if the nullifier has been used
    function isNullifierUsed(uint256 nullifier) external view returns (bool) {
        return usedNullifiers[nullifier];
    }

    /// @notice Transfer admin role
    /// @param newAdmin The new admin address
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
    }
}
