const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const ReferralLink = require('../models/ReferralLinks');
const Influencers = require('../models/Influencers');
const { encryptAndGenerateUrl, decryptPromoCodeFromUrl, decryptPromoCode } = require('./generatePromoCodeUrl');

router.post('/promo-codes', async (req, res) => {
  try {
    const { referralLinkId, influencerId, code } = req.body;

    // Check if the referral link and influencer exist
    const referralLinkRecord = await ReferralLink.findByPk(referralLinkId);
    const influencer = await Influencers.findByPk(influencerId);

    if (!referralLinkRecord || !influencer) {
      return res.status(400).json({ error: 'Invalid referral link or influencer' });
    }

    // Generate a random IV
    const iv = process.env.PROMO_CODE_ENCRYPTION_IV;

    // Use the provided code and key for encryption
    const key = process.env.PROMO_CODE_ENCRYPTION_KEY; 
    const { ciphertext, promoCodeUrl } = await encryptAndGenerateUrl(code, key, iv, referralLinkId);

    // Check if the values are not null or undefined
    if (!ciphertext || !promoCodeUrl) {
      return res.status(500).json({ error: 'Invalid encryption result' });
    }

    // Create the promo code
    const promoCode = await PromoCode.create({
      code: ciphertext, // Save the encrypted code
      influencersId: influencerId,
      referralLinkId,
      key,
      iv,
      promoCodeUrl,
    });

    res.status(201).json(promoCode);
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/promo-codes-list', async (req, res) => {
  try {
    // Fetch data from the PromoCode table
    const promoCodes = await PromoCode.findAll({ attributes: ['id', 'referralLinkId', 'code', 'iv', 'key', 'promoCodeUrl'] });

    // Decrypt the code from the URL for each promo code
    const decryptedPromoCodes = promoCodes.map((promoCode) => {
      console.log('codes', promoCode);
      if (!promoCode.code || !promoCode.key || !promoCode.promoCodeUrl || !promoCode.iv) {
        console.error('Invalid promo code data');
        return null; // Or handle it accordingly
      }

      const decryptedCode = decryptPromoCode(
        promoCode.code,
        promoCode.key,
        promoCode.iv
      );
      const decryptedPromoCodeUrl = decryptPromoCodeFromUrl(
        promoCode.promoCodeUrl,
        promoCode.key,
        promoCode.iv
      ) || '/promo-code-error';

      // Handle decryption errors by providing a fallback value
  
      return {
        id: promoCode.id,
        referralLink: promoCode.referralLinkId,
        code: decryptedCode,
        promoCodeUrl: decryptedPromoCodeUrl,

      };
    });

    res.json(decryptedPromoCodes.filter(Boolean)); // Filter out null values
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
