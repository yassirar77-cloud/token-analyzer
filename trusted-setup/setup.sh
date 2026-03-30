#!/bin/bash
# BSD ZK Privacy — Trusted Setup & Circuit Compilation
# This script compiles the circom circuits and generates proving/verification keys.
#
# Prerequisites:
#   - circom installed globally: npm install -g circom
#   - snarkjs installed: npm install snarkjs
#   - circomlib installed: npm install circomlib
#   - Powers of Tau file downloaded (see below)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/build"
PTAU_FILE="$SCRIPT_DIR/powersOfTau28_hez_final_15.ptau"

echo "=== BSD ZK Privacy — Circuit Setup ==="
echo ""

# Step 0: Download Powers of Tau if not present
if [ ! -f "$PTAU_FILE" ]; then
    echo "Downloading Powers of Tau ceremony file..."
    echo "This is a ~50MB file from the Hermez trusted setup ceremony."
    curl -L -o "$PTAU_FILE" \
        "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau"
    echo "✓ Downloaded ptau file"
    echo ""
fi

# Create build directory
mkdir -p "$BUILD_DIR"

# ============================================
# Step 1: Compile StreamingAccessProof circuit
# ============================================
echo "--- Compiling StreamingAccessProof circuit ---"
circom "$PROJECT_ROOT/circuits/streaming/StreamingAccessProof.circom" \
    --r1cs --wasm --sym \
    -o "$BUILD_DIR/" \
    -l "$PROJECT_ROOT/node_modules"
echo "✓ StreamingAccessProof compiled"

echo "Generating proving key (zkey)..."
npx snarkjs groth16 setup \
    "$BUILD_DIR/StreamingAccessProof.r1cs" \
    "$PTAU_FILE" \
    "$BUILD_DIR/streaming.zkey"
echo "✓ Streaming zkey generated"

echo "Exporting verification key..."
npx snarkjs zkey export verificationkey \
    "$BUILD_DIR/streaming.zkey" \
    "$BUILD_DIR/streaming_vkey.json"
echo "✓ Streaming verification key exported"

echo "Generating Solidity verifier..."
npx snarkjs zkey export solidityverifier \
    "$BUILD_DIR/streaming.zkey" \
    "$PROJECT_ROOT/contracts/zk/StreamingVerifier.sol"
echo "✓ StreamingVerifier.sol generated"

echo ""

# ============================================
# Step 2: Compile PrivateTransfer circuit
# ============================================
echo "--- Compiling PrivateTransfer circuit ---"
circom "$PROJECT_ROOT/circuits/transaction/PrivateTransfer.circom" \
    --r1cs --wasm --sym \
    -o "$BUILD_DIR/" \
    -l "$PROJECT_ROOT/node_modules"
echo "✓ PrivateTransfer compiled"

echo "Generating proving key (zkey)..."
npx snarkjs groth16 setup \
    "$BUILD_DIR/PrivateTransfer.r1cs" \
    "$PTAU_FILE" \
    "$BUILD_DIR/private_transfer.zkey"
echo "✓ PrivateTransfer zkey generated"

echo "Exporting verification key..."
npx snarkjs zkey export verificationkey \
    "$BUILD_DIR/private_transfer.zkey" \
    "$BUILD_DIR/private_transfer_vkey.json"
echo "✓ PrivateTransfer verification key exported"

echo "Generating Solidity verifier..."
npx snarkjs zkey export solidityverifier \
    "$BUILD_DIR/private_transfer.zkey" \
    "$PROJECT_ROOT/contracts/zk/TransferVerifier.sol"
echo "✓ TransferVerifier.sol generated"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Generated files:"
echo "  Build:"
echo "    $BUILD_DIR/StreamingAccessProof.r1cs"
echo "    $BUILD_DIR/StreamingAccessProof_js/StreamingAccessProof.wasm"
echo "    $BUILD_DIR/streaming.zkey"
echo "    $BUILD_DIR/streaming_vkey.json"
echo "    $BUILD_DIR/PrivateTransfer.r1cs"
echo "    $BUILD_DIR/PrivateTransfer_js/PrivateTransfer.wasm"
echo "    $BUILD_DIR/private_transfer.zkey"
echo "    $BUILD_DIR/private_transfer_vkey.json"
echo ""
echo "  Contracts:"
echo "    $PROJECT_ROOT/contracts/zk/StreamingVerifier.sol"
echo "    $PROJECT_ROOT/contracts/zk/TransferVerifier.sol"
echo ""
echo "Next steps:"
echo "  1. Run 'npx hardhat compile' to compile all contracts"
echo "  2. Run 'npm run deploy:zk' to deploy ZK contracts"
