const { DataTypes, Model } = require('sequelize');
const db = require('../dbs');
const ReferralLinks = require ('./ReferralLinks');
const Influencers = require('./Influencers');
const Users = require('./users');

class PromoCode extends Model {}

PromoCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    influencersId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Influencers',
        key: 'id',
      },},
    referralLinkId:{
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    promoCodeUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add any other fields as needed
  },
  {
    sequelize: db,
    modelName: 'PromoCode',
  }
);
PromoCode.belongsTo(db.model('ReferralLinks'), { foreignKey: 'referralLinkId' });
PromoCode.belongsTo(db.model('Influencers'), { foreignKey: 'influencersId' });


module.exports = PromoCode;
