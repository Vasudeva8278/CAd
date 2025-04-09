const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Block = sequelize.define('Block', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Files',
      key: 'id'
    }
  },
  x: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  y: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  width: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  rotation: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  scale: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#000000'
  },
  layer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  visible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Blocks',
  timestamps: true,
  indexes: [
    {
      name: 'blocks_file_id_idx',
      fields: ['fileId']
    },
    {
      name: 'blocks_name_idx',
      fields: ['name']
    }
  ]
});

module.exports = Block;
