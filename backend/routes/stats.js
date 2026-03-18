const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Track = require('../models/Track');
const User = require('../models/User');

/**
 * GET /api/stats
 * Get platform-wide statistics
 */
router.get('/', async (req, res) => {
  try {
    const [totalTracks, totalArtists, streamsResult, revenueResult] = await Promise.all([
      Track.count(),
      User.count({ where: { isArtist: true } }),
      Track.sum('totalStreams'),
      sequelize.query(
        `SELECT COALESCE(SUM(CAST(price AS DECIMAL(18,8))), 0) as total FROM purchases`,
        { type: sequelize.QueryTypes.SELECT }
      ),
    ]);

    res.json({
      totalTracks: totalTracks || 0,
      totalArtists: totalArtists || 0,
      totalStreams: streamsResult || 0,
      totalRevenue: String(revenueResult[0]?.total || 0),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
