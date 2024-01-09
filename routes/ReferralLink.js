const express = require('express');
const router = express.Router();
const ReferralLinks = require('../models/ReferralLinks');  
const Influencers = require('../models/Influencers'); 
const { encrypt } = require('../utils/cryptoUtils');
router.get('/referral-links', async (req, res) => {
  try {
    const referralLinks = await ReferralLinks.findAll({
      include: [{
        model: Influencers,
        attributes: ['id', 'name'],
      }],
    });

    res.status(200).json(referralLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/referral-links', async (req, res) => {
  try {
    const { link, influencerId } = req.body;

    // Check if the influencer exists
    const influencer = await Influencers.findByPk(influencerId);
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }

    // Include influencer's name as a query parameter in the referral link
    const referralLink = `${link}?ref=${encodeURIComponent(influencer.name)}`;

    // Create a new referral link
    const createdReferralLink = await ReferralLinks.create({
      link: referralLink,
      InfluencersId: influencerId,
    });

    // Encrypt the ID before sending it in the response
    const encryptedId = encrypt(influencerId.toString());

    res.status(201).json({ ...createdReferralLink.toJSON(), id: encryptedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
