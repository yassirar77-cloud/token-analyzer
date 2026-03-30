pragma circom 2.1.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

/// @title PrivateTransfer
/// @notice Enables private $BSD token transfers using a commitment-nullifier scheme.
///         Users deposit tokens with a commitment hash(secret, amount, salt) and later
///         withdraw by proving knowledge of the preimage without revealing the deposit wallet.
template PrivateTransfer() {
    // Private inputs
    signal input senderSecret;
    signal input amount;
    signal input salt;

    // Public inputs
    signal input commitmentHash;   // hash(secret, amount, salt)
    signal input nullifierHash;    // hash(secret, salt) — prevents double-spend

    // Verify commitment: Poseidon(senderSecret, amount, salt) === commitmentHash
    component cHash = Poseidon(3);
    cHash.inputs[0] <== senderSecret;
    cHash.inputs[1] <== amount;
    cHash.inputs[2] <== salt;
    cHash.out === commitmentHash;

    // Verify nullifier: Poseidon(senderSecret, salt) === nullifierHash
    component nHash = Poseidon(2);
    nHash.inputs[0] <== senderSecret;
    nHash.inputs[1] <== salt;
    nHash.out === nullifierHash;
}

component main {public [commitmentHash, nullifierHash]} = PrivateTransfer();
