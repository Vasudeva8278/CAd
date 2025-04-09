
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('vasudev', 'postgres', 'vasu1234', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
