const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Track = require('../models/Track');
const Purchase = require('../models/Purchase');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/users/profile
 * Get current user profile
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['nonce'] },
    });

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, email, bio, profileImage, isArtist } = req.body;

    const updates = {};
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (profileImage !== undefined) updates.profileImage = profileImage;
    if (isArtist !== undefined) updates.isArtist = isArtist;

    await req.user.update(updates);

    res.json(req.user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * GET /api/users/library
 * Get user's purchased tracks
 * NOTE: Must be defined before /:id to avoid route shadowing
 */
router.get('/library', authenticate, async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Track,
          include: [
            {
              model: User,
              as: 'artistUser',
              attributes: ['id', 'username', 'walletAddress'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching library:', error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['nonce'] },
      include: [
        {
          model: Track,
          as: 'tracks',
          attributes: ['id', 'title', 'artist', 'coverImage', 'createdAt'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
