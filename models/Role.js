const { DataTypes, Model } = require('sequelize');
const db = require('../dbs');


class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Role',
    tableName: 'role', // Specify the table name here
  }
);

// Associate method to set up relationships
Role.associate = (models) => {
  Role.hasMany(models.Admin, { foreignKey: 'role_id' });
};

module.exports = Role;
