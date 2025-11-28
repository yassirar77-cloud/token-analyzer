const { create } = require('ipfs-http-client');
require('dotenv').config();

// Create IPFS client
const ipfs = create({
  host: process.env.IPFS_HOST || 'localhost',
  port: process.env.IPFS_PORT || 5001,
  protocol: process.env.IPFS_PROTOCOL || 'http',
});

/**
 * Upload a file to IPFS
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - IPFS hash
 */
async function uploadToIPFS(fileBuffer, fileName) {
  try {
    const result = await ipfs.add({
      path: fileName,
      content: fileBuffer,
    });

    console.log('File uploaded to IPFS:', result.path);
    return result.path; // Returns the IPFS hash
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Upload JSON metadata to IPFS
 * @param {Object} metadata - Metadata object
 * @returns {Promise<string>} - IPFS hash
 */
async function uploadMetadataToIPFS(metadata) {
  try {
    const metadataString = JSON.stringify(metadata);
    const result = await ipfs.add(metadataString);

    console.log('Metadata uploaded to IPFS:', result.path);
    return result.path;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Get file from IPFS
 * @param {string} hash - IPFS hash
 * @returns {Promise<Buffer>} - File buffer
 */
async function getFromIPFS(hash) {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw new Error('Failed to retrieve file from IPFS');
  }
}

/**
 * Pin a file to ensure it stays on IPFS
 * @param {string} hash - IPFS hash
 */
async function pinToIPFS(hash) {
  try {
    await ipfs.pin.add(hash);
    console.log('Pinned to IPFS:', hash);
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    throw new Error('Failed to pin file to IPFS');
  }
}

module.exports = {
  uploadToIPFS,
  uploadMetadataToIPFS,
  getFromIPFS,
  pinToIPFS,
};
