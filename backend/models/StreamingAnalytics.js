const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Track = require('./Track');

const StreamingAnalytics = sequelize.define('StreamingAnalytics', {
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
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration played in seconds',
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether the user listened to the full track',
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'streaming_analytics',
  timestamps: false,
});

StreamingAnalytics.belongsTo(User, { foreignKey: 'userId' });
StreamingAnalytics.belongsTo(Track, { foreignKey: 'trackId' });

module.exports = StreamingAnalytics;
