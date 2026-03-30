// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title IGroth16Verifier
/// @notice Interface for the auto-generated Groth16 verifier from snarkjs
interface IGroth16Verifier {
    function verifyProof(
        uint256[2] calldata pA,
        uint256[2][2] calldata pB,
        uint256[2] calldata pC,
        uint256[2] calldata pubSignals
    ) external view returns (bool);
}

/// @title BSDPrivatePool
/// @notice Enables private $BSD token transfers using a commitment-nullifier scheme.
///         Users deposit tokens with a commitment and later withdraw with a ZK proof
///         from any wallet, breaking the on-chain link between deposit and withdrawal.
contract BSDPrivatePool {
    IGroth16Verifier public verifier;
    IERC20 public bsdToken;
    address public admin;

    // Fixed denomination amounts for privacy (like Tornado Cash)
    // Using fixed amounts prevents amount-based correlation
    mapping(uint256 => bool) public supportedAmounts;
    uint256[] public denominationList;

    // Deposit commitments
    mapping(bytes32 => bool) public commitments;
    // Spent nullifiers
    mapping(bytes32 => bool) public nullifiers;
    // Commitment to deposit amount
    mapping(bytes32 => uint256) public commitmentAmounts;

    event Deposit(bytes32 indexed commitment, uint256 amount);
    event Withdrawal(bytes32 indexed nullifier, address recipient, uint256 amount);
    event DenominationAdded(uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(address _verifier, address _bsdToken) {
        verifier = IGroth16Verifier(_verifier);
        bsdToken = IERC20(_bsdToken);
        admin = msg.sender;

        // Default denominations: 10, 100, 1000, 10000 BSD (in wei)
        uint256[4] memory defaults = [
            10 ether,
            100 ether,
            1000 ether,
            10000 ether
        ];
        for (uint256 i = 0; i < defaults.length; i++) {
            supportedAmounts[defaults[i]] = true;
            denominationList.push(defaults[i]);
        }
    }

    /// @notice Deposit $BSD privately
    /// @param commitment Hash commitment = Poseidon(secret, amount, salt)
    /// @param amount Amount of $BSD to deposit (must be a supported denomination)
    function deposit(bytes32 commitment, uint256 amount) external {
        require(!commitments[commitment], "Commitment already exists");
        require(supportedAmounts[amount], "Unsupported denomination");

        bool success = bsdToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        commitments[commitment] = true;
        commitmentAmounts[commitment] = amount;

        emit Deposit(commitment, amount);
    }

    /// @notice Withdraw $BSD with ZK proof — no link to depositor
    /// @param pA Proof point A
    /// @param pB Proof point B
    /// @param pC Proof point C
    /// @param pubSignals Public signals [commitmentHash, nullifierHash]
    /// @param amount The withdrawal amount (must match deposit)
    function withdraw(
        uint256[2] calldata pA,
        uint256[2][2] calldata pB,
        uint256[2] calldata pC,
        uint256[2] calldata pubSignals,
        uint256 amount
    ) external {
        bytes32 commitmentHash = bytes32(pubSignals[0]);
        bytes32 nullifier = bytes32(pubSignals[1]);

        require(commitments[commitmentHash], "Unknown commitment");
        require(!nullifiers[nullifier], "Already withdrawn");
        require(commitmentAmounts[commitmentHash] == amount, "Amount mismatch");

        bool isValid = verifier.verifyProof(pA, pB, pC, pubSignals);
        require(isValid, "Invalid ZK proof");

        nullifiers[nullifier] = true;

        bool success = bsdToken.transfer(msg.sender, amount);
        require(success, "Token transfer failed");

        emit Withdrawal(nullifier, msg.sender, amount);
    }

    /// @notice Add a new supported denomination
    /// @param amount The denomination amount in wei
    function addDenomination(uint256 amount) external onlyAdmin {
        require(!supportedAmounts[amount], "Already supported");
        supportedAmounts[amount] = true;
        denominationList.push(amount);
        emit DenominationAdded(amount);
    }

    /// @notice Get all supported denominations
    /// @return Array of supported denomination amounts
    function getDenominations() external view returns (uint256[] memory) {
        return denominationList;
    }

    /// @notice Check if a commitment exists
    /// @param commitment The commitment hash to check
    /// @return True if the commitment exists
    function hasCommitment(bytes32 commitment) external view returns (bool) {
        return commitments[commitment];
    }

    /// @notice Check if a nullifier has been spent
    /// @param nullifier The nullifier hash to check
    /// @return True if the nullifier has been spent
    function isNullifierSpent(bytes32 nullifier) external view returns (bool) {
        return nullifiers[nullifier];
    }

    /// @notice Transfer admin role
    /// @param newAdmin The new admin address
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
    }
}
