const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AnonymousSession = sequelize.define('AnonymousSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sessionToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Anonymous session token derived from ZK proof (no user/wallet link)',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Session expiration timestamp',
  },
  // Intentionally NO userId, NO walletAddress — fully anonymous
}, {
  tableName: 'anonymous_sessions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['sessionToken'],
    },
    {
      fields: ['expiresAt'],
    },
  ],
});

module.exports = AnonymousSession;
