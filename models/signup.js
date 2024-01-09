  // models/Signup.js
  const { DataTypes, Model } = require('sequelize');
  const db = require('../dbs');
  const Influencers = require('./Influencers');
  const Users = require('../models/users');
  const PromoCode = require('./PromoCode');

  class Signup extends Model {}

  Signup.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      influencerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      promoCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE', // This is important for automatic deletion of associated records
      },
    },
    {
      sequelize: db,
      modelName: 'Signup',
      timestamps: true,
    }
  );

  Signup.belongsTo(Influencers, { foreignKey: 'influencerId' });
  Signup.belongsTo(Users, { foreignKey: 'userId' });
  Signup.belongsTo(PromoCode, { foreignKey: 'promoCode' });

  module.exports = Signup;
