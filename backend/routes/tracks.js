const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Op } = require('sequelize');
const Track = require('../models/Track');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const StreamingAnalytics = require('../models/StreamingAnalytics');
const { authenticate, requireArtist } = require('../middleware/auth');
const { uploadToIPFS, uploadMetadataToIPFS, getFromIPFS } = require('../services/ipfs');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600, // 100MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      // Accept audio files
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        cb(new Error('Only audio files are allowed'));
      }
    } else if (file.fieldname === 'cover') {
      // Accept image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    } else {
      cb(null, true);
    }
  },
});

/**
 * POST /api/tracks/upload
 * Upload a new track (artists only)
 */
router.post('/upload', authenticate, requireArtist, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, genre, streamingPrice, nftPrice, maxEditions } = req.body;

    if (!title || !req.files.audio) {
      return res.status(400).json({ error: 'Title and audio file are required' });
    }

    // Upload audio to IPFS
    const audioFile = req.files.audio[0];
    const ipfsHash = await uploadToIPFS(audioFile.buffer, audioFile.originalname);

    // Upload cover image to IPFS if provided
    let coverImageHash = null;
    if (req.files.cover) {
      const coverFile = req.files.cover[0];
      coverImageHash = await uploadToIPFS(coverFile.buffer, coverFile.originalname);
    }

    // Create metadata
    const metadata = {
      title,
      artist: req.user.username || req.user.walletAddress,
      description,
      genre,
      audioHash: ipfsHash,
      coverImage: coverImageHash,
    };

    const metadataHash = await uploadMetadataToIPFS(metadata);

    // This will be created on-chain, for now we'll prepare the data
    res.json({
      success: true,
      ipfsHash,
      coverImageHash,
      metadataHash,
      message: 'Track uploaded to IPFS. Now create on-chain via smart contract.',
    });
  } catch (error) {
    console.error('Error uploading track:', error);
    res.status(500).json({ error: 'Failed to upload track' });
  }
});

/**
 * POST /api/tracks
 * Create track record in database after on-chain creation
 */
router.post('/', authenticate, requireArtist, async (req, res) => {
  try {
    const {
      trackId,
      title,
      artist,
      description,
      genre,
      duration,
      ipfsHash,
      coverImage,
      streamingPrice,
      nftPrice,
      maxEditions,
    } = req.body;

    const track = await Track.create({
      trackId,
      artistId: req.user.id,
      title,
      artist,
      description,
      genre,
      duration,
      ipfsHash,
      coverImage,
      streamingPrice,
      nftPrice,
      maxEditions,
    });

    res.status(201).json(track);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ error: 'Failed to create track' });
  }
});

/**
 * GET /api/tracks
 * Get all tracks with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { genre, artistId, search, limit = 50, offset = 0 } = req.query;

    const where = {};

    if (genre) {
      where.genre = genre;
    }

    if (artistId) {
      where.artistId = artistId;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { artist: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const tracks = await Track.findAll({
      where,
      include: [
        {
          model: User,
          as: 'artistUser',
          attributes: ['id', 'username', 'walletAddress', 'isVerified'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

/**
 * GET /api/tracks/:id
 * Get a single track by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'artistUser',
          attributes: ['id', 'username', 'walletAddress', 'isVerified', 'bio', 'profileImage'],
        },
      ],
    });

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

/**
 * GET /api/tracks/:id/stream
 * Stream audio file from IPFS
 */
router.get('/:id/stream', authenticate, async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Check if user has access (either purchased or is the artist)
    const hasPurchase = await Purchase.findOne({
      where: {
        userId: req.user.id,
        trackId: track.id,
        purchaseType: 'streaming',
      },
    });

    if (!hasPurchase && track.artistId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have access to this track' });
    }

    // Get file from IPFS
    const audioBuffer = await getFromIPFS(track.ipfsHash);

    // Set appropriate headers
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Accept-Ranges': 'bytes',
    });

    res.send(audioBuffer);

    // Record streaming analytics
    await StreamingAnalytics.create({
      userId: req.user.id,
      trackId: track.id,
      duration: track.duration || 0,
      completed: false,
    });
  } catch (error) {
    console.error('Error streaming track:', error);
    res.status(500).json({ error: 'Failed to stream track' });
  }
});

/**
 * GET /api/tracks/:id/analytics
 * Get analytics for a track (artist only)
 */
router.get('/:id/analytics', authenticate, requireArtist, async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    if (track.artistId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const [streamCount, purchases, revenue] = await Promise.all([
      StreamingAnalytics.count({ where: { trackId: track.id } }),
      Purchase.count({ where: { trackId: track.id } }),
      Purchase.sum('price', { where: { trackId: track.id } }),
    ]);

    res.json({
      trackId: track.id,
      title: track.title,
      streams: streamCount,
      purchases,
      revenue: revenue || '0',
      mintedEditions: track.mintedEditions,
      maxEditions: track.maxEditions,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
