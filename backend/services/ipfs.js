const https = require('https');
require('dotenv').config();

const PINATA_API_URL = 'api.pinata.cloud';

let _pinataConfigWarned = false;

function getPinataJWT() {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    if (!_pinataConfigWarned) {
      console.warn('Warning: PINATA_JWT is not set. IPFS operations will fail.');
      _pinataConfigWarned = true;
    }
    throw new Error('Pinata credentials not configured. Set PINATA_JWT environment variable.');
  }
  return jwt;
}

/**
 * Build a multipart/form-data body for file upload
 * @param {Buffer} content - File content
 * @param {string} fileName - File name
 * @returns {{ body: Buffer, boundary: string }}
 */
function buildMultipartBody(content, fileName) {
  const boundary = '----PinataBoundary' + Date.now().toString(16);
  const header = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
    `Content-Type: application/octet-stream\r\n\r\n`
  );
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
  return { body: Buffer.concat([header, content, footer]), boundary };
}

/**
 * Upload a file to IPFS via Pinata
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - IPFS hash
 */
async function uploadToIPFS(fileBuffer, fileName) {
  try {
    const { body, boundary } = buildMultipartBody(fileBuffer, fileName);

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: PINATA_API_URL,
        path: '/pinning/pinFileToIPFS',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getPinataJWT()}`,
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
            reject(new Error(`Pinata API error ${res.statusCode}: ${responseBody}`));
            return;
          }
          try {
            resolve(JSON.parse(responseBody));
          } catch (e) {
            reject(new Error(`Failed to parse Pinata response: ${responseBody}`));
          }
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });

    console.log('File uploaded to IPFS via Pinata:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * @param {Object} metadata - Metadata object
 * @returns {Promise<string>} - IPFS hash
 */
async function uploadMetadataToIPFS(metadata) {
  try {
    const jsonBody = JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: { name: 'metadata.json' },
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: PINATA_API_URL,
        path: '/pinning/pinJSONToIPFS',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getPinataJWT()}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(jsonBody),
        },
      };

      const req = https.request(options, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const responseBody = Buffer.concat(chunks).toString();
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`Pinata API error ${res.statusCode}: ${responseBody}`));
            return;
          }
          try {
            resolve(JSON.parse(responseBody));
          } catch (e) {
            reject(new Error(`Failed to parse Pinata response: ${responseBody}`));
          }
        });
      });

      req.on('error', reject);
      req.write(jsonBody);
      req.end();
    });

    console.log('Metadata uploaded to IPFS via Pinata:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Get file from IPFS via Pinata gateway
 * @param {string} hash - IPFS hash
 * @returns {Promise<Buffer>} - File buffer
 */
async function getFromIPFS(hash) {
  try {
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'gateway.pinata.cloud',
        path: `/ipfs/${encodeURIComponent(hash)}`,
        method: 'GET',
      };

      const req = https.request(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Follow redirect
          const redirectUrl = new URL(res.headers.location);
          const redirectOptions = {
            hostname: redirectUrl.hostname,
            path: redirectUrl.pathname + redirectUrl.search,
            method: 'GET',
          };
          const redirectReq = https.request(redirectOptions, (redirectRes) => {
            if (redirectRes.statusCode < 200 || redirectRes.statusCode >= 300) {
              const chunks = [];
              redirectRes.on('data', (chunk) => chunks.push(chunk));
              redirectRes.on('end', () => reject(new Error(`IPFS gateway error ${redirectRes.statusCode}: ${Buffer.concat(chunks).toString()}`)));
              return;
            }
            const chunks = [];
            redirectRes.on('data', (chunk) => chunks.push(chunk));
            redirectRes.on('end', () => resolve(Buffer.concat(chunks)));
          });
          redirectReq.on('error', reject);
          redirectReq.end();
          return;
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => reject(new Error(`IPFS gateway error ${res.statusCode}: ${Buffer.concat(chunks).toString()}`)));
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
 * Pin a file to ensure it stays on IPFS (already pinned on upload with Pinata)
 * @param {string} hash - IPFS hash
 */
async function pinToIPFS(hash) {
  try {
    const jsonBody = JSON.stringify({ hashToPin: hash });

    await new Promise((resolve, reject) => {
      const options = {
        hostname: PINATA_API_URL,
        path: '/pinning/pinByHash',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getPinataJWT()}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(jsonBody),
        },
      };

      const req = https.request(options, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`Pinata API error ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
            return;
          }
          resolve();
        });
      });

      req.on('error', reject);
      req.write(jsonBody);
      req.end();
    });

    console.log('Pinned to IPFS via Pinata:', hash);
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
