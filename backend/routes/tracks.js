const express = require('express');
const router = express.Router();
const multer = require('multer');
const Joi = require('joi');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Track = require('../models/Track');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const StreamingAnalytics = require('../models/StreamingAnalytics');
const { authenticate, requireArtist } = require('../middleware/auth');
const { uploadToIPFS, uploadMetadataToIPFS, getFromIPFS } = require('../services/ipfs');

// Validation schemas
const createTrackSchema = Joi.object({
  trackId: Joi.number().integer().required(),
  title: Joi.string().min(1).max(200).required(),
  artist: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(5000).allow('', null),
  genre: Joi.string().max(100).allow('', null),
  duration: Joi.number().integer().min(0).allow(null),
  ipfsHash: Joi.string().required(),
  coverImage: Joi.string().allow('', null),
  streamingPrice: Joi.string().allow('', null),
  nftPrice: Joi.string().allow('', null),
  maxEditions: Joi.number().integer().min(1).max(10000).required(),
});

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

    // Find the next available trackId
    const lastTrack = await Track.findOne({ order: [['trackId', 'DESC']] });
    const nextTrackId = lastTrack ? lastTrack.trackId + 1 : 1;

    // Save track to database
    const track = await Track.create({
      trackId: nextTrackId,
      artistId: req.user.id,
      title,
      artist: req.user.username || req.user.walletAddress,
      description: description || null,
      genre: genre || null,
      ipfsHash,
      coverImage: coverImageHash,
      streamingPrice: streamingPrice || null,
      nftPrice: nftPrice || null,
      maxEditions: parseInt(maxEditions) || 100,
    });

    res.json({
      success: true,
      track,
      ipfsHash,
      coverImageHash,
      metadataHash,
      message: 'Track uploaded and saved successfully.',
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
    const { error, value } = createTrackSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const track = await Track.create({
      ...value,
      artistId: req.user.id,
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
      // artistId query param might be a wallet address (0x...) instead of UUID
      if (artistId.startsWith('0x')) {
        const artistUser = await User.findOne({ where: { walletAddress: { [Op.iLike]: artistId } } });
        if (!artistUser) {
          return res.status(404).json({ error: 'Artist not found for wallet address' });
        }
        where.artistId = artistUser.id;
      } else {
        where.artistId = artistId;
      }
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
 * GET /api/tracks/:id/stream
 * Stream audio file from IPFS
 * NOTE: Must be defined before /:id to avoid route shadowing
 */
router.get('/:id/stream', authenticate, async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Check if user has access (either purchased or is the artist) BEFORE fetching
    const isArtist = track.artistId === req.user.id;
    if (!isArtist) {
      const hasPurchase = await Purchase.findOne({
        where: {
          userId: req.user.id,
          trackId: track.id,
          purchaseType: 'streaming',
        },
      });

      if (!hasPurchase) {
        return res.status(403).json({ error: 'You do not have access to this track' });
      }
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

    // Record streaming analytics after successful response (fire-and-forget)
    StreamingAnalytics.create({
      userId: req.user.id,
      trackId: track.id,
      duration: track.duration || 0,
      completed: false,
    }).then(() => {
      // Increment totalStreams counter
      return Track.increment('totalStreams', { where: { id: track.id } });
    }).catch(err => console.error('Error recording stream analytics:', err));
  } catch (error) {
    console.error('Error streaming track:', error);
    res.status(500).json({ error: 'Failed to stream track' });
  }
});

/**
 * GET /api/tracks/:id/analytics
 * Get analytics for a track (artist only)
 * NOTE: Must be defined before /:id to avoid route shadowing
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

    const [streamCount, purchases, revenueResult] = await Promise.all([
      StreamingAnalytics.count({ where: { trackId: track.id } }),
      Purchase.count({ where: { trackId: track.id } }),
      sequelize.query(
        `SELECT COALESCE(SUM(CAST(price AS DECIMAL(18,8))), 0) as total FROM purchases WHERE "trackId" = :trackId`,
        { replacements: { trackId: track.id }, type: sequelize.QueryTypes.SELECT }
      ),
    ]);
    const revenue = revenueResult[0]?.total || 0;

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

module.exports = router;
