const express = require('express');
const router = express.Router();
const snarkjs = require('snarkjs');
const path = require('path');
const AnonymousSession = require('../models/AnonymousSession');
const Track = require('../models/Track');

const SESSION_DURATION_MS = 3600000; // 1 hour

/**
 * POST /api/stream/anonymous-session
 * Create an anonymous streaming session using a ZK proof.
 * The proof demonstrates the user has streaming access without revealing their identity.
 */
router.post('/anonymous-session', async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;

    if (!proof || !publicSignals) {
      return res.status(400).json({ error: 'Missing proof or publicSignals' });
    }

    // publicSignals: [merkleRoot, sessionNonce, sessionToken]
    const [merkleRoot, sessionNonce, sessionToken] = publicSignals;

    if (!merkleRoot || !sessionNonce || !sessionToken) {
      return res.status(400).json({ error: 'Invalid public signals' });
    }

    // Check if session token already exists (replay prevention)
    const existingSession = await AnonymousSession.findOne({
      where: { sessionToken },
    });
    if (existingSession) {
      return res.status(409).json({ error: 'Session token already used' });
    }

    // Verify ZK proof using the streaming circuit verification key
    let vKey;
    try {
      vKey = require(
        path.resolve(__dirname, '../../build/streaming_vkey.json')
      );
    } catch {
      // Fallback for development — accept proof if vkey not yet generated
      if (process.env.NODE_ENV === 'development') {
        console.warn('WARNING: Streaming vkey not found, skipping proof verification in dev mode');
      } else {
        return res.status(500).json({ error: 'Verification key not configured' });
      }
    }

    if (vKey) {
      const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid ZK proof' });
      }
    }

    // Create anonymous session — NO userId, NO walletAddress
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await AnonymousSession.create({ sessionToken, expiresAt });

    res.json({
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Anonymous session error:', error);
    res.status(500).json({ error: 'Failed to create anonymous session' });
  }
});

/**
 * GET /api/stream/:trackId
 * Stream a track anonymously using a session token.
 * Header: x-session-token: <sessionToken>
 */
router.get('/:trackId', async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'];

    if (!sessionToken) {
      return res.status(401).json({ error: 'Missing session token' });
    }

    // Validate anonymous session
    const session = await AnonymousSession.findOne({
      where: { sessionToken },
    });

    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    if (new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Session expired' });
    }

    // Fetch track — we know someone valid is streaming, but NOT who
    const track = await Track.findByPk(req.params.trackId);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // If track has an IPFS hash, redirect to IPFS gateway
    if (track.ipfsHash) {
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${track.ipfsHash}`;
      return res.redirect(gatewayUrl);
    }

    // If track has a local audio path
    if (track.audioPath) {
      return res.sendFile(path.resolve(track.audioPath));
    }

    return res.status(404).json({ error: 'Audio not available' });
  } catch (error) {
    console.error('Anonymous streaming error:', error);
    res.status(500).json({ error: 'Streaming failed' });
  }
});

/**
 * GET /api/stream/session/validate
 * Validate an existing anonymous session (check if still active).
 */
router.get('/session/validate', async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'];

    if (!sessionToken) {
      return res.status(401).json({ valid: false, error: 'Missing session token' });
    }

    const session = await AnonymousSession.findOne({
      where: { sessionToken },
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ valid: false, error: 'Session expired or invalid' });
    }

    res.json({
      valid: true,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({ valid: false, error: 'Validation failed' });
  }
});

module.exports = router;
