const { DataTypes, Model } = require('sequelize');
const db = require('../dbs');
const Role = require('./Role');

class Admin extends Model {}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize: db,
    modelName: 'Admin',
    tableName: 'admin', 
  }
);

// Define associations
Admin.belongsTo(Role, { foreignKey: 'role_id' });

// Associate method to set up relationships
Admin.associate = (models) => {
  Admin.belongsTo(models.Role, { foreignKey: 'role_id' });
};

module.exports = Admin;
