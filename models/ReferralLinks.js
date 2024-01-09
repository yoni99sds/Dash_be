const { DataTypes, Model } = require('sequelize');
const db = require('../dbs');
const Influencers = require('./Influencers');

class ReferralLinks extends Model {}

ReferralLinks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Add foreign key for the association
    InfluencersId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        modelName: 'Influencers',
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    modelName: 'ReferralLinks',
  }
);

ReferralLinks.belongsTo(Influencers, { foreignKey: 'InfluencersId' });

// Generate referral link with query parameter before creating a new referral link
ReferralLinks.beforeCreate(async (referralLink) => {
  try {
    const influencer = await Influencers.findByPk(referralLink.InfluencersId);
    if (!influencer) {
      throw new Error('Influencer not found');
    }
    referralLink.link = `${referralLink.link}`;
  } catch (error) {
    throw error;
  }
});

module.exports = ReferralLinks;
