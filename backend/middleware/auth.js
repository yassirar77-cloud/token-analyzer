const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const User = require('../models/User');

/**
 * Generate a nonce for wallet authentication
 */
function generateNonce() {
  return Math.floor(Math.random() * 1000000).toString();
}

/**
 * Verify signature from MetaMask
 * @param {string} message - Original message
 * @param {string} signature - Signature from wallet
 * @param {string} address - Wallet address
 * @returns {boolean} - Whether signature is valid
 */
function verifySignature(message, signature, address) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      walletAddress: user.walletAddress,
      isArtist: user.isArtist,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
}

/**
 * Middleware to authenticate requests
 */
async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to check if user is an artist
 */
function requireArtist(req, res, next) {
  if (!req.user.isArtist) {
    return res.status(403).json({ error: 'Artist privileges required' });
  }
  next();
}

module.exports = {
  generateNonce,
  verifySignature,
  generateToken,
  authenticate,
  requireArtist,
};
