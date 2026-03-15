const https = require('https');
require('dotenv').config();

const INFURA_HOST = process.env.IPFS_HOST || 'ipfs.infura.io';
const INFURA_PORT = parseInt(process.env.IPFS_PORT) || 5001;

function getAuth() {
  const id = process.env.IPFS_PROJECT_ID;
  const secret = process.env.IPFS_PROJECT_SECRET;
  if (!id || !secret) {
    throw new Error('IPFS_PROJECT_ID and IPFS_PROJECT_SECRET must be set');
  }
  return 'Basic ' + Buffer.from(id + ':' + secret).toString('base64');
}

/**
 * Make a multipart/form-data POST to the Infura IPFS API
 * @param {string} endpoint - API path (e.g. /api/v0/add)
 * @param {Buffer} body - The multipart body
 * @param {string} boundary - The multipart boundary string
 * @returns {Promise<Object>} - Parsed JSON response
 */
function infuraRequest(endpoint, body, boundary) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: INFURA_HOST,
      port: INFURA_PORT,
      path: endpoint,
      method: 'POST',
      headers: {
        'Authorization': getAuth(),
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const responseBody = Buffer.concat(chunks).toString();
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`IPFS API error ${res.statusCode}: ${responseBody}`));
          return;
        }
        try {
          resolve(JSON.parse(responseBody));
        } catch (e) {
          reject(new Error(`Failed to parse IPFS response: ${responseBody}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Make a simple POST to the Infura IPFS API (no body)
 * @param {string} endpoint - API path with query params
 * @returns {Promise<Object>} - Parsed JSON response
 */
function infuraPost(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: INFURA_HOST,
      port: INFURA_PORT,
      path: endpoint,
      method: 'POST',
      headers: {
        'Authorization': getAuth(),
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const responseBody = Buffer.concat(chunks).toString();
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`IPFS API error ${res.statusCode}: ${responseBody}`));
          return;
        }
        try {
          resolve(JSON.parse(responseBody));
        } catch (e) {
          reject(new Error(`Failed to parse IPFS response: ${responseBody}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Build a multipart/form-data body for file upload
 * @param {Buffer} content - File content
 * @param {string} fileName - File name
 * @returns {{ body: Buffer, boundary: string }}
 */
function buildMultipartBody(content, fileName) {
  const boundary = '----IPFSBoundary' + Date.now().toString(16);
  const header = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
    `Content-Type: application/octet-stream\r\n\r\n`
  );
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
  return { body: Buffer.concat([header, content, footer]), boundary };
}

/**
 * Upload a file to IPFS
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - IPFS hash
 */
async function uploadToIPFS(fileBuffer, fileName) {
  try {
    const { body, boundary } = buildMultipartBody(fileBuffer, fileName);
    const result = await infuraRequest('/api/v0/add', body, boundary);
    console.log('File uploaded to IPFS:', result.Hash);
    return result.Hash;
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
    const content = Buffer.from(JSON.stringify(metadata));
    const { body, boundary } = buildMultipartBody(content, 'metadata.json');
    const result = await infuraRequest('/api/v0/add', body, boundary);
    console.log('Metadata uploaded to IPFS:', result.Hash);
    return result.Hash;
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
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: INFURA_HOST,
        port: INFURA_PORT,
        path: `/api/v0/cat?arg=${encodeURIComponent(hash)}`,
        method: 'POST',
        headers: {
          'Authorization': getAuth(),
        },
      };

      const req = https.request(options, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => reject(new Error(`IPFS API error ${res.statusCode}: ${Buffer.concat(chunks).toString()}`)));
          return;
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });

      req.on('error', reject);
      req.end();
    });
    return result;
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
    await infuraPost(`/api/v0/pin/add?arg=${encodeURIComponent(hash)}`);
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
