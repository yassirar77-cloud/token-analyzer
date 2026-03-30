/**
 * ZK Identity Helpers
 *
 * Manages Semaphore-based anonymous identity for BSD members.
 * Users generate an identity locally and store it in localStorage.
 * The commitment is added to an on-chain Merkle group.
 * They can then prove membership without revealing their wallet.
 */

const STORAGE_KEY = "bsd-zk-identity";

/**
 * Generate a new Semaphore identity
 * @returns {import("@semaphore-protocol/core").Identity} The new identity
 */
async function createIdentity() {
  const { Identity } = await import("@semaphore-protocol/core");
  const identity = new Identity();
  return identity;
}

/**
 * Export identity to a storable string
 * @param {import("@semaphore-protocol/core").Identity} identity
 * @returns {string} Serialized identity
 */
function exportIdentity(identity) {
  return identity.export();
}

/**
 * Import identity from a stored string
 * @param {string} exported - Serialized identity string
 * @returns {import("@semaphore-protocol/core").Identity} Restored identity
 */
async function importIdentity(exported) {
  const { Identity } = await import("@semaphore-protocol/core");
  return new Identity(exported);
}

/**
 * Save identity to localStorage
 * @param {import("@semaphore-protocol/core").Identity} identity
 */
function saveIdentityToStorage(identity) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, exportIdentity(identity));
}

/**
 * Load identity from localStorage
 * @returns {Promise<import("@semaphore-protocol/core").Identity|null>}
 */
async function loadIdentityFromStorage() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  return importIdentity(stored);
}

/**
 * Check if identity exists in localStorage
 * @returns {boolean}
 */
function hasStoredIdentity() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(STORAGE_KEY);
}

/**
 * Remove identity from localStorage
 */
function clearStoredIdentity() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Generate a ZK membership proof using Semaphore
 * @param {import("@semaphore-protocol/core").Identity} identity - User's Semaphore identity
 * @param {object} group - The Semaphore group object (with members)
 * @param {string|number} message - The message to sign/prove
 * @param {string|number} scope - The scope (usually groupId)
 * @returns {Promise<object>} The generated proof
 */
async function generateMembershipProof(identity, group, message, scope) {
  const { generateProof } = await import("@semaphore-protocol/proof");
  return generateProof(identity, group, message, scope);
}

/**
 * Verify a Semaphore proof off-chain (for testing)
 * @param {object} proof - The proof to verify
 * @returns {Promise<boolean>} Whether the proof is valid
 */
async function verifyMembershipProof(proof) {
  const { verifyProof } = await import("@semaphore-protocol/proof");
  return verifyProof(proof);
}

module.exports = {
  createIdentity,
  exportIdentity,
  importIdentity,
  saveIdentityToStorage,
  loadIdentityFromStorage,
  hasStoredIdentity,
  clearStoredIdentity,
  generateMembershipProof,
  verifyMembershipProof,
  STORAGE_KEY,
};
