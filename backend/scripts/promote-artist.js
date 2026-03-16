#!/usr/bin/env node

/**
 * One-time script to promote a user to artist role.
 *
 * Usage:
 *   node scripts/promote-artist.js 0x92...1b6C
 *   node scripts/promote-artist.js              # uses partial match 0x92%1b6c
 */

const { sequelize } = require('../config/database');
const User = require('../models/User');

async function main() {
  const walletArg = process.argv[2];

  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    let user;
    if (walletArg) {
      user = await User.findOne({
        where: { walletAddress: walletArg.toLowerCase() },
      });
    }

    // Fallback: partial match for 0x92...1b6c
    if (!user) {
      const { Op } = require('sequelize');
      const users = await User.findAll({
        where: {
          walletAddress: {
            [Op.and]: [
              { [Op.iLike]: '0x92%' },
              { [Op.iLike]: '%1b6c' },
            ],
          },
        },
      });

      if (users.length === 0) {
        console.error('No user found matching 0x92...1b6c');
        process.exit(1);
      }
      if (users.length > 1) {
        console.error('Multiple users found:');
        users.forEach((u) => console.error(`  ${u.walletAddress} (isArtist: ${u.isArtist})`));
        console.error('Please provide the full wallet address.');
        process.exit(1);
      }
      user = users[0];
    }

    console.log(`Found user: ${user.walletAddress} (isArtist: ${user.isArtist})`);

    if (user.isArtist) {
      console.log('User is already an artist. No changes needed.');
    } else {
      await user.update({ isArtist: true });
      console.log('User promoted to artist successfully!');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

main();
