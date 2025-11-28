const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Track = sequelize.define('Track', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  trackId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    comment: 'On-chain track ID',
  },
  artistId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds',
  },
  ipfsHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  streamingPrice: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Price in BSD tokens (as string to handle big numbers)',
  },
  nftPrice: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'NFT price in BSD tokens',
  },
  maxEditions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mintedEditions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalStreams: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPurchases: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tracks',
  timestamps: true,
});

Track.belongsTo(User, { as: 'artistUser', foreignKey: 'artistId' });
User.hasMany(Track, { as: 'tracks', foreignKey: 'artistId' });

module.exports = Track;
