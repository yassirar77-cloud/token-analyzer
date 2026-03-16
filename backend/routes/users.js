const express = require('express');
const router = express.Router();
const Joi = require('joi');
const User = require('../models/User');
const Track = require('../models/Track');
const Purchase = require('../models/Purchase');
const { authenticate } = require('../middleware/auth');

const updateProfileSchema = Joi.object({
  username: Joi.string().min(1).max(50).allow('', null),
  email: Joi.string().email().allow('', null),
  bio: Joi.string().max(1000).allow('', null),
  profileImage: Joi.string().uri().max(500).allow('', null),
  isArtist: Joi.boolean(),
}).min(1);

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
    const { error, value } = updateProfileSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    await req.user.update(value);

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
