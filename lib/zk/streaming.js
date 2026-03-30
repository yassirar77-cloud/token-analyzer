/**
 * ZK Streaming Helpers
 *
 * Generates ZK proofs for anonymous streaming access.
 * Users prove they hold a StreamingAccess NFT without revealing their wallet.
 */

const snarkjs = require("snarkjs");
const { buildPoseidon } = require("circomlibjs");

let poseidonInstance = null;

/**
 * Get or initialize the Poseidon hash function
 * @returns {Promise<Function>} Poseidon hash function
 */
async function getPoseidon() {
  if (!poseidonInstance) {
    poseidonInstance = await buildPoseidon();
  }
  return poseidonInstance;
}

/**
 * Compute Poseidon hash of inputs
 * @param {BigInt[]} inputs - Array of BigInt inputs
 * @returns {Promise<BigInt>} Hash output
 */
async function poseidonHash(inputs) {
  const poseidon = await getPoseidon();
  const hash = poseidon(inputs);
  return poseidon.F.toObject(hash);
}

/**
 * Compute a user's commitment from their secret and token ID
 * @param {BigInt} userSecret - The user's private secret
 * @param {BigInt} tokenId - The StreamingAccess token ID
 * @returns {Promise<BigInt>} The commitment hash
 */
async function computeCommitment(userSecret, tokenId) {
  return poseidonHash([userSecret, tokenId]);
}

/**
 * Compute an anonymous session token
 * @param {BigInt} userSecret - The user's private secret
 * @param {BigInt} sessionNonce - The session nonce from the server
 * @returns {Promise<BigInt>} The session token
 */
async function computeSessionToken(userSecret, sessionNonce) {
  return poseidonHash([userSecret, sessionNonce]);
}

/**
 * Generate a ZK proof for anonymous streaming access
 * @param {object} params
 * @param {BigInt} params.userSecret - User's private secret
 * @param {BigInt} params.tokenId - StreamingAccess token ID
 * @param {BigInt[]} params.pathElements - Merkle tree path elements
 * @param {number[]} params.pathIndices - Merkle tree path indices (0 or 1)
 * @param {BigInt} params.merkleRoot - Current Merkle root of holders
 * @param {BigInt} params.sessionNonce - Nonce for this session
 * @param {string} params.wasmPath - Path to compiled circuit WASM
 * @param {string} params.zkeyPath - Path to proving key
 * @returns {Promise<{proof: object, publicSignals: string[]}>}
 */
async function generateStreamingProof({
  userSecret,
  tokenId,
  pathElements,
  pathIndices,
  merkleRoot,
  sessionNonce,
  wasmPath = "/circuits/streaming/StreamingAccessProof.wasm",
  zkeyPath = "/circuits/streaming/streaming.zkey",
}) {
  const input = {
    userSecret: userSecret.toString(),
    tokenId: tokenId.toString(),
    pathElements: pathElements.map((e) => e.toString()),
    pathIndices: pathIndices,
    merkleRoot: merkleRoot.toString(),
    sessionNonce: sessionNonce.toString(),
  };

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );

  return { proof, publicSignals };
}

/**
 * Verify a streaming access proof off-chain
 * @param {object} proof - The groth16 proof
 * @param {string[]} publicSignals - The public signals
 * @param {string} vkeyPath - Path to verification key JSON
 * @returns {Promise<boolean>} Whether the proof is valid
 */
async function verifyStreamingProof(proof, publicSignals, vkeyPath) {
  const vKey = require(vkeyPath);
  return snarkjs.groth16.verify(vKey, publicSignals, proof);
}

/**
 * Request an anonymous streaming session from the backend
 * @param {string} apiUrl - Backend API URL
 * @param {object} proof - The ZK proof
 * @param {string[]} publicSignals - The public signals
 * @returns {Promise<{sessionToken: string, expiresAt: number}>}
 */
async function requestAnonymousSession(apiUrl, proof, publicSignals) {
  const response = await fetch(`${apiUrl}/api/stream/anonymous-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proof, publicSignals }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create anonymous session");
  }

  return response.json();
}

/**
 * Stream a track anonymously using a session token
 * @param {string} apiUrl - Backend API URL
 * @param {string} trackId - Track ID to stream
 * @param {string} sessionToken - Anonymous session token
 * @returns {Promise<Response>} Audio stream response
 */
async function streamAnonymously(apiUrl, trackId, sessionToken) {
  const response = await fetch(`${apiUrl}/api/stream/${trackId}`, {
    headers: { "x-session-token": sessionToken },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Streaming failed");
  }

  return response;
}

module.exports = {
  getPoseidon,
  poseidonHash,
  computeCommitment,
  computeSessionToken,
  generateStreamingProof,
  verifyStreamingProof,
  requestAnonymousSession,
  streamAnonymously,
};
