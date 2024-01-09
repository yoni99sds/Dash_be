// influencerPerformance.js
const express = require('express');
const router = express.Router();
const{ getInfluencerDetailsById, getInfluencerReferalById, getInfluencerPromoById  } = require('./influencerModel')
const {
  getClicksByInfluencerId,
  getSignupsByInfluencerId,
  getRegisteredPatientsByInfluencerId,
} = require('../models/performanceModel');

router.get('/influencersperformance/:influencerId/', async (req, res) => {
  try {
    const influencerId = req.params.influencerId;
    console.log('Influencer ID:', influencerId);

    const clicks = await getClicksByInfluencerId(influencerId);
    const signups = await getSignupsByInfluencerId(influencerId);
    const registeredPatients = await getRegisteredPatientsByInfluencerId(influencerId);
    const name = await getInfluencerDetailsById(influencerId);
    const referral_link =await getInfluencerReferalById(influencerId);
    const promo_codes =  await getInfluencerPromoById(influencerId);

    
    console.log('Name', name);
    console.log('Referral Link', referral_link);
    console.log('Promo Codes', promo_codes);
    console.log('Clicks:', clicks);
    console.log('Signups:', signups);
    console.log('Registered Patients:', registeredPatients);

    res.json({
      success: true,
      performance: {
        name,
        referral_link,
        promo_codes,
        clicks,
        signups,
        registeredPatients,
      },
    });
  } catch (error) {
    console.error('Error retrieving performance data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

  module.exports = router;
