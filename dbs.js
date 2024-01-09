const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nexlink', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
