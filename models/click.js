const { DataTypes, Model } = require('sequelize');
const db = require('../dbs');
const Influencers = require('./Influencers');
const PromoCode = require('./PromoCode');

class Click extends Model {}

Click.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:true
    },
    influencerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Influencers,
        key: 'id',
      },
    },
    promoCode: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: PromoCode,
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'Click',
    timestamps: true,
  }
);

Click.belongsTo(Influencers, { foreignKey: 'influencerId' });
Click.belongsTo(PromoCode, { foreignKey: 'promoCode' });

module.exports = Click;
