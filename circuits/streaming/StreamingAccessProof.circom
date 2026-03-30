pragma circom 2.1.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/mux1.circom";

/// @title MerkleTreeVerifier
/// @notice Verifies a leaf exists in a Merkle tree given path elements and indices
template MerkleTreeVerifier(levels) {
    signal input leaf;
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    signal hashes[levels + 1];
    hashes[0] <== leaf;

    component hashers[levels];
    component mux[levels];

    for (var i = 0; i < levels; i++) {
        // pathIndices[i] must be 0 or 1
        pathIndices[i] * (1 - pathIndices[i]) === 0;

        hashers[i] = Poseidon(2);
        mux[i] = MultiMux1(2);

        mux[i].c[0][0] <== hashes[i];
        mux[i].c[0][1] <== pathElements[i];
        mux[i].c[1][0] <== pathElements[i];
        mux[i].c[1][1] <== hashes[i];
        mux[i].s <== pathIndices[i];

        hashers[i].inputs[0] <== mux[i].out[0];
        hashers[i].inputs[1] <== mux[i].out[1];

        hashes[i + 1] <== hashers[i].out;
    }

    // Verify computed root matches public root
    root === hashes[levels];
}

/// @title StreamingAccessProof
/// @notice Proves a user has streaming access without revealing their identity.
///         User proves they know a secret whose commitment is in the holder Merkle tree,
///         and gets an anonymous session token derived from their secret + a session nonce.
template StreamingAccessProof(levels) {
    // Private inputs (known only to user)
    signal input userSecret;        // user's private key/secret
    signal input tokenId;           // their StreamingAccess token ID
    signal input pathElements[levels];
    signal input pathIndices[levels];

    // Public inputs
    signal input merkleRoot;        // current holder merkle root
    signal input sessionNonce;      // prevents replay

    // Public output
    signal output sessionToken;     // anonymous session token

    // 1. Compute user commitment from secret and tokenId
    component commitHash = Poseidon(2);
    commitHash.inputs[0] <== userSecret;
    commitHash.inputs[1] <== tokenId;
    signal commitment <== commitHash.out;

    // 2. Verify commitment exists in merkle tree of holders
    component tree = MerkleTreeVerifier(levels);
    tree.leaf <== commitment;
    tree.root <== merkleRoot;
    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }

    // 3. Generate anonymous session token
    component sessionHash = Poseidon(2);
    sessionHash.inputs[0] <== userSecret;
    sessionHash.inputs[1] <== sessionNonce;
    sessionToken <== sessionHash.out;
}

component main {public [merkleRoot, sessionNonce]} = StreamingAccessProof(20);
