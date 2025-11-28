const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateNonce, verifySignature, generateToken } = require('../middleware/auth');

/**
 * GET /api/auth/nonce/:walletAddress
 * Get nonce for wallet authentication
 */
router.get('/nonce/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Find or create user
    let user = await User.findOne({ where: { walletAddress: walletAddress.toLowerCase() } });

    if (!user) {
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        nonce: generateNonce(),
      });
    } else {
      // Update nonce
      user.nonce = generateNonce();
      await user.save();
    }

    res.json({ nonce: user.nonce });
  } catch (error) {
    console.error('Error getting nonce:', error);
    res.status(500).json({ error: 'Failed to get nonce' });
  }
});

/**
 * POST /api/auth/verify
 * Verify wallet signature and return JWT
 */
router.post('/verify', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature required' });
    }

    // Find user
    const user = await User.findOne({ where: { walletAddress: walletAddress.toLowerCase() } });

    if (!user || !user.nonce) {
      return res.status(404).json({ error: 'User not found or nonce expired' });
    }

    // Verify signature
    const message = `Back Street Dogs - Sign this message to authenticate. Nonce: ${user.nonce}`;
    const isValid = verifySignature(message, signature, walletAddress);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Clear nonce (one-time use)
    user.nonce = null;
    await user.save();

    // Generate JWT
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        isArtist: user.isArtist,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

module.exports = router;
