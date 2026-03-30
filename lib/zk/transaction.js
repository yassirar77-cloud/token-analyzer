/**
 * ZK Transaction Helpers
 *
 * Enables private $BSD token deposits and withdrawals using
 * a commitment-nullifier scheme with Groth16 ZK proofs.
 */

const snarkjs = require("snarkjs");
const { buildPoseidon } = require("circomlibjs");
const crypto = require("crypto");

let poseidonInstance = null;

async function getPoseidon() {
  if (!poseidonInstance) {
    poseidonInstance = await buildPoseidon();
  }
  return poseidonInstance;
}

/**
 * Compute Poseidon hash
 * @param {BigInt[]} inputs
 * @returns {Promise<BigInt>}
 */
async function poseidonHash(inputs) {
  const poseidon = await getPoseidon();
  const hash = poseidon(inputs);
  return poseidon.F.toObject(hash);
}

/**
 * Generate a cryptographically secure random BigInt
 * @returns {BigInt} Random 31-byte value as BigInt
 */
function generateRandomSecret() {
  const bytes = crypto.randomBytes(31); // 31 bytes to stay within field
  return BigInt("0x" + bytes.toString("hex"));
}

/**
 * Generate a random salt for commitments
 * @returns {BigInt} Random salt
 */
function generateRandomSalt() {
  return generateRandomSecret();
}

/**
 * Compute a deposit commitment: Poseidon(secret, amount, salt)
 * @param {BigInt} secret - User's private secret
 * @param {BigInt} amount - Deposit amount
 * @param {BigInt} salt - Random salt
 * @returns {Promise<BigInt>} Commitment hash
 */
async function computeCommitment(secret, amount, salt) {
  return poseidonHash([secret, amount, salt]);
}

/**
 * Compute a nullifier: Poseidon(secret, salt)
 * @param {BigInt} secret - User's private secret
 * @param {BigInt} salt - The same salt used in the commitment
 * @returns {Promise<BigInt>} Nullifier hash
 */
async function computeNullifier(secret, salt) {
  return poseidonHash([secret, salt]);
}

/**
 * Create a deposit note containing all information needed for withdrawal
 * @param {BigInt} amount - Amount to deposit
 * @returns {Promise<{secret: BigInt, salt: BigInt, amount: BigInt, commitment: BigInt, nullifier: BigInt, note: string}>}
 */
async function createDepositNote(amount) {
  const secret = generateRandomSecret();
  const salt = generateRandomSalt();
  const commitment = await computeCommitment(secret, amount, salt);
  const nullifier = await computeNullifier(secret, salt);

  // The note is a JSON string that encodes everything needed for withdrawal
  const note = Buffer.from(
    JSON.stringify({
      secret: secret.toString(),
      salt: salt.toString(),
      amount: amount.toString(),
    })
  ).toString("base64");

  return { secret, salt, amount, commitment, nullifier, note };
}

/**
 * Parse a deposit note back into its components
 * @param {string} note - Base64-encoded note string
 * @returns {{secret: BigInt, salt: BigInt, amount: BigInt}}
 */
function parseDepositNote(note) {
  const decoded = JSON.parse(Buffer.from(note, "base64").toString());
  return {
    secret: BigInt(decoded.secret),
    salt: BigInt(decoded.salt),
    amount: BigInt(decoded.amount),
  };
}

/**
 * Generate a ZK proof for private withdrawal
 * @param {object} params
 * @param {BigInt} params.secret - The deposit secret
 * @param {BigInt} params.amount - The deposit amount
 * @param {BigInt} params.salt - The deposit salt
 * @param {string} params.wasmPath - Path to compiled circuit WASM
 * @param {string} params.zkeyPath - Path to proving key
 * @returns {Promise<{proof: object, publicSignals: string[]}>}
 */
async function generateWithdrawalProof({
  secret,
  amount,
  salt,
  wasmPath = "/circuits/transaction/PrivateTransfer.wasm",
  zkeyPath = "/circuits/transaction/private_transfer.zkey",
}) {
  const commitmentHash = await computeCommitment(secret, amount, salt);
  const nullifierHash = await computeNullifier(secret, salt);

  const input = {
    senderSecret: secret.toString(),
    amount: amount.toString(),
    salt: salt.toString(),
    commitmentHash: commitmentHash.toString(),
    nullifierHash: nullifierHash.toString(),
  };

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );

  return { proof, publicSignals };
}

/**
 * Verify a withdrawal proof off-chain
 * @param {object} proof - Groth16 proof
 * @param {string[]} publicSignals - Public signals
 * @param {string} vkeyPath - Path to verification key JSON
 * @returns {Promise<boolean>}
 */
async function verifyWithdrawalProof(proof, publicSignals, vkeyPath) {
  const vKey = require(vkeyPath);
  return snarkjs.groth16.verify(vKey, publicSignals, proof);
}

module.exports = {
  generateRandomSecret,
  generateRandomSalt,
  computeCommitment,
  computeNullifier,
  createDepositNote,
  parseDepositNote,
  generateWithdrawalProof,
  verifyWithdrawalProof,
  poseidonHash,
};
