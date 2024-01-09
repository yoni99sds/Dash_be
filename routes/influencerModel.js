
const db = require('../db'); 

const getInfluencerByReferralLink = async (referralLink) => {
  try {
    const [rows] = await db.query('SELECT * FROM influencers WHERE referral_link = ?', [referralLink]);

    if (rows.length > 0) {
      return rows[0];
    }

    return null;
  } catch (error) {
    throw error;
  }
};

const getInfluencerDetailsById = async (influencerId) => {
  try {
    const [rows] = await db.query('SELECT name FROM influencers WHERE id = ?', [influencerId]);

    if (rows.length > 0) {
      return rows[0].name;
      
    }

    return null; 
  } catch (error) {
    throw error;
  }
};

const getInfluencerReferalById = async (influencerId) => {
  try {
    const [rows] = await db.query('SELECT referral_link FROM influencers WHERE id = ?', [influencerId]);

    if (rows.length > 0) {
      return rows[0].referral_link;
      
    }

    return null; 
  } catch (error) {
    throw error;
  }
};
const getInfluencerPromoById = async (influencerId) => {
  try {
    const [rows] = await db.query('SELECT promo_codes FROM influencers WHERE id = ?', [influencerId]);

    if (rows.length > 0) {
      return rows[0].promo_codes;
      
    }

    return null; 
  } catch (error) {
    throw error;
  }
};



module.exports = {
  getInfluencerByReferralLink,
  getInfluencerDetailsById,
  getInfluencerReferalById,
  getInfluencerPromoById
};
