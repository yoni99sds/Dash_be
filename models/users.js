const {DataTypes, Model} = require('sequelize');
const db = require('../dbs');
const Influencers = require('./Influencers');
const PromoCode = require('./PromoCode');

class Users extends Model{}

    Users.init(
      {  
        id:{ 
           type: DataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        influencerId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references:{
            modelName: 'Influencers',
            key: 'id',
          },
        },
   
        role_id: {
          type:DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Role', 
            key: 'id',
          },
        },
        promoCodeId:{
          type:DataTypes.INTEGER,
          allowNull:true,
        },
       
      },
      {
        sequelize:db,
        modelName:'Users',
      }
      );
    Users.belongsTo(Influencers, { foreignKey: 'influencerId'});
    Users.belongsTo(PromoCode, {foreignKey:'promoCodeId'});
    
module.exports = Users;