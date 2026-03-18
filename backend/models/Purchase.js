const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Track = require('./Track');

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  trackId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tracks',
      key: 'id',
    },
  },
  purchaseType: {
    type: DataTypes.ENUM('streaming', 'nft'),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  },
  transactionHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tokenId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'NFT token ID if purchase type is NFT',
  },
  editionNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'purchases',
  timestamps: true,
  updatedAt: false,
});

Purchase.belongsTo(User, { foreignKey: 'userId' });
Purchase.belongsTo(Track, { foreignKey: 'trackId' });

User.hasMany(Purchase, { as: 'purchases', foreignKey: 'userId' });
Track.hasMany(Purchase, { as: 'purchases', foreignKey: 'trackId' });

module.exports = Purchase;
