const { DataTypes, Model } = require('sequelize');
const db = require('../dbs');

class RegisteredPatients extends Model {}

RegisteredPatients.init({

  promoCodeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  patientId:{
    type:DataTypes.INTEGER,
    allowNull:false,
  }

},
{
  sequelize: db,
  modelName: 'RegisteredPatients',
  tableName: 'registerPatient', 
});

module.exports = RegisteredPatients;
