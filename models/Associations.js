const Influencers = require('./Influencers');
const ReferralLinks = require('./ReferralLinks');
const PromoCode = require('./PromoCode');

// Existing associations
Influencers.hasMany(PromoCode);
Influencers.hasMany(ReferralLinks);


ReferralLinks.belongsTo(Influencers, { foreignKey: 'InfluencersId' });

// New association to fetch referral links with influencer details
Influencers.hasMany(ReferralLinks, { foreignKey: 'InfluencersId' });

module.exports = {
  Influencers,
  ReferralLinks,
  PromoCode,
};
