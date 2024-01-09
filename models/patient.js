
const { DataTypes,Model } = require('sequelize');
const db = require('../dbs'); 
const Users = require('../models/users');
const PromoCode = require ('../models/PromoCode');

class Patient extends Model{}

 Patient.init({
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  promoCodeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },},
  {
    sequelize: db,
    modelName: 'patient',
  },
);
Patient.belongsTo(Users, { foreignKey: 'userId' });
Patient.belongsTo(PromoCode, { foreignKey: 'promoCodeId' });
module.exports = Patient;
