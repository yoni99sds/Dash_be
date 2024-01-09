const { DataTypes, Model } = require('sequelize');
const db = require('../dbs');

class Influencers extends Model {}

Influencers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Role', 
        key: 'id',
      },
    },

    
  },
  {
    sequelize: db,
    modelName: 'Influencers',
  }
  
);


module.exports = Influencers;
