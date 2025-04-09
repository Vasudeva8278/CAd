const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = File;
