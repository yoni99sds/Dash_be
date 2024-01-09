const express = require('express');
const router = express.Router();
const Click = require('../models/click');
const Influencers = require('../models/Influencers');
const Signup = require('../models/signup');
const Users = require('../models/users');
const PromoCode = require('../models/PromoCode');
const RegisteredPatients = require('../models/register');
const isClickExists = require('../utils/isClickExists');
const cors = require('cors');
const CryptoJS = require('crypto-js');
require('dotenv').config();

// Function to decrypt promo code and extract influencer name
const decryptPromoCode = (encryptedText, key, iv) => {
  try {
    console.log('COde ', encryptedText)
    console.log('key', key);
    console.log('iv ', iv);
    const bytes = CryptoJS.AES.decrypt(encryptedText, key, { iv: CryptoJS.enc.Hex.parse(iv) });
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted || ''; 
  } catch (error) {
    console.error('Decryptionnnnn error:', error);
    throw error;
  }
};



// Function to encrypt promo code and extract influencer name
const decryptPromoCodeAndInfluencer = (promoCodeParam) => {
  try {
    // Decode the URL component and extract the promo code and influencer name parameters
    const promoCodeUrl = decodeURIComponent(promoCodeParam);
    console.log('Decoded Promo Code URL:', promoCodeUrl);
    const promoCodeStartIndex = promoCodeUrl.indexOf('?code=') + 6;
    const promoCodeEndIndex = promoCodeUrl.indexOf('&', promoCodeStartIndex);
    const promoCodeEncrypted = promoCodeUrl.slice(
      promoCodeStartIndex,
      promoCodeEndIndex !== -1 ? promoCodeEndIndex : undefined
    );
 
    // Extract influencer name
    const influencerStartIndex = promoCodeUrl.indexOf('?ref=') + 5;
    const promoIndex = promoCodeUrl.indexOf('/promo');
    const influencerEndIndex = promoIndex !== -1 ? promoIndex : promoCodeUrl.indexOf('&', influencerStartIndex);
    const influencerName = promoCodeUrl.slice(
      influencerStartIndex,
      influencerEndIndex !== -1 ? influencerEndIndex : undefined
    );
      console.log('names: ', influencerName, 'and', promoCodeEncrypted)
    return {
 
      influencerName,
      promoCodeEncrypted
    };
  } catch (error) {
    console.error('Error encrypting promo code and influencer:', error);
    throw error;
  }
};
router.post('/get-influencer-and-promocode', async (req, res) => {
  try {
    const { promoCodeParam } = req.body;

    // Check if promoCodeParam is empty
    if (!promoCodeParam) {
      // Assign influencerId and promoCodeId as null
      console.log('Empty promoCodeParam, influencerId and promoCodeId set to null');
      return res.status(200).json({ success: true, influencerId: null, promoCodeId: null });
    }

    // Implement your logic to extract influencer name and promo code from promoCodeParam
    const { influencerName, promoCodeEncrypted } = decryptPromoCodeAndInfluencer(promoCodeParam);
    console.log('Influencer Name:', influencerName, ' Promo Code:', promoCodeEncrypted);

    // Find the influencer based on the name
    const influencerRecord = await Influencers.findOne({ where: { name: influencerName } });

    // Check if influencerRecord is found
    if (!influencerRecord) {
      console.log('Influencer not found');
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }

    const influencersId = influencerRecord.id;

    // Find all promo codes associated with the influencer
    const promoCodes = await PromoCode.findAll({ where: { influencersId } });

    let promoCodeId = null;

    // Loop through promo codes to find a match
    for (const promoCodeRecord of promoCodes) {
      console.log('Value: ', promoCodeRecord);
      const decryptedPromoCode = decryptPromoCode(promoCodeRecord.code, process.env.PROMO_CODE_ENCRYPTION_KEY, process.env.PROMO_CODE_ENCRYPTION_IV);

      if (decryptedPromoCode === promoCodeEncrypted) {
        promoCodeId = promoCodeRecord.id;
        break;
      }
    }

    if (!promoCodeId) {
      console.log('PromoCode not found');
      return res.status(404).json({ success: false, message: 'PromoCode not found' });
    }

        console.log('Passed Influencer ID:', influencersId);

    console.log('Passed PromoCode ID:', promoCodeId);

    res.status(200).json({ success: true, influencerId: influencersId, promoCodeId });
  } catch (error) {
    console.error('Error getting influencerId and promoCodeId:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to track clicks
router.post('/track-click', async (req, res) => {
  try {
    const { promoCodeParam } = req.body;
   
    const { influencerName, promoCodeEncrypted } = decryptPromoCodeAndInfluencer(promoCodeParam);
    const timestamp = new Date();

    // Check if a click with the same timestamp already exists
    const clickExists = await isClickExists(timestamp);

    if (!clickExists) {
      // Find the influencer based on the name
      const influencerRecord = await Influencers.findOne({ where: { name: influencerName } });

      if (!influencerRecord) {
        // Handle the case when the influencer is not found
        console.error('Influencer not found');
        return res.status(404).json({ success: false, message: 'Influencer not found' });
      }

      // Find the PromoCode based on the influencer's ID
      const promoCodeRecord = await PromoCode.findOne({
        where: {
          influencersId: influencerRecord.id
        }
      });

      if (!promoCodeRecord) {
        console.error('Promo code not found');
        return res.status(404).json({ success: false, message: 'Promo code not found' });
      }

      // Decrypt the stored promo code
      const decryptedPromoCode = decryptPromoCode(promoCodeRecord.code, process.env.PROMO_CODE_ENCRYPTION_KEY, process.env.PROMO_CODE_ENCRYPTION_IV);
      console.log('Fetched URL:', decryptedPromoCode);
      console.log('PromoCode on the URL:', promoCodeEncrypted);

      // Compare the decrypted promo codes
      if (decryptedPromoCode === promoCodeEncrypted) {
        // Track the click
        const trackingData = await Click.create({
          influencerId: influencerRecord.id,
          promoCode: promoCodeRecord.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        console.log('Click tracked successfully:', trackingData);
        return res.status(200).json({ success: true, message: 'Click tracked successfully.' });
      } else {
        console.log('Promo codes do not match.');
        return res.status(400).json({ success: false, message: 'Promo codes do not match.' });
      }
    } else {
      console.log('Click with the same timestamp already exists.');
      return res.status(200).json({ success: false, message: 'Click with the same timestamp already exists.' });
    }
  } catch (error) {
    console.error('Error tracking click:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

const extractInfluencerName = (promoCodeParam)=>{
  try{
  const promoCodeUrl = decodeURIComponent(promoCodeParam);
      // Extract influencer name
      const influencerStartIndex = promoCodeUrl.indexOf('?ref=') + 5;
      const promoIndex = promoCodeUrl.indexOf('/promo');
      const influencerEndIndex = promoIndex !== -1 ? promoIndex : promoCodeUrl.indexOf('&', influencerStartIndex);
      const influencerName = promoCodeUrl.slice(
        influencerStartIndex,
        influencerEndIndex !== -1 ? influencerEndIndex : undefined
      );
        console.log('Name :',  influencerName);
      return  influencerName;
      
    } catch (error) {
      console.error('Error encrypting promo code and influencer:', error);
      throw error;
    }
  
}
router.post('/get-influencer-id', async (req, res) => {
  try {
    const { promoCodeParam } = req.body;

    // Check if promoCodeParam is empty
    if (!promoCodeParam) {
      // Assign influencerId as null
      console.log('Empty promoCodeParam, influencerId set to null');
      return res.status(200).json({ success: true, influencerId: null });
    }

    // Implement your logic to extract influencer name from promoCodeParam
    const influencerName = extractInfluencerName(promoCodeParam);
    console.log('Name A', influencerName);

    // Find the influencer based on the name
    const influencerRecord = await Influencers.findOne({ where: { name: influencerName } });

    // Check if influencerRecord is found
    if (!influencerRecord) {
      console.log('Influencer not found');
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }

    const influencerId = influencerRecord.id;
    console.log('PassedID: ', influencerId);
    res.status(200).json({ success: true, influencerId: influencerId });
  } catch (error) {
    console.error('Error getting influencerId:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Route to track signups
router.post('/track-signup', async (req, res) => {
  try {
    const { promoCodeParam, userId } = req.body;

    const { influencerName, promoCodeEncrypted } = decryptPromoCodeAndInfluencer(promoCodeParam);

    // Find the influencer based on the name
    const influencerRecord = await Influencers.findOne({ where: { name: influencerName } });
    console.log('Influencers name: ', influencerRecord);

    if (!influencerRecord) {
      // Handle the case when the influencer is not found
      console.error('Influencer not found');
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }

    // Find all promo codes based on the influencer's ID
    const promoCodes = await PromoCode.findAll({
      where: {
        influencersId: influencerRecord.id,
      },
    });

    console.log('All Promo Codes for Influencer:', promoCodes);

    // Check each promo code for a match
    let matchingPromoCode = null;

    for (const promoCodeRecord of promoCodes) {
      // Decrypt the stored promo code
      const decryptedPromoCode = decryptPromoCode(
        promoCodeRecord.code,
        process.env.PROMO_CODE_ENCRYPTION_KEY,
        process.env.PROMO_CODE_ENCRYPTION_IV
      );

      // Compare the decrypted promo codes
      if (decryptedPromoCode === promoCodeEncrypted) {
        matchingPromoCode = promoCodeRecord;
        break; // Found a match, exit the loop
      }
    }

    if (matchingPromoCode) {
      const trackingData = await Signup.create({
        userId,
        influencerId: influencerRecord.id,
        promoCode: matchingPromoCode.id,
      });

      console.log('Signup tracked successfully:', trackingData);
      return res.status(200).json({ success: true, message: 'Signup tracked successfully.' });
    } else {
      console.log('No matching promo code found.');
      return res.status(400).json({ success: false, message: 'No matching promo code found.' });
    }
  } catch (error) {
    console.error('Error tracking Signup:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});
const getPromoCodeIdById = async (userId) => {
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return null; 
    }
    return user.promoCodeId;
  } catch (error) {
    console.error('Error getting promoCodeId:', error);
    throw error;
  }
};

router.post('/track-registered-patient', async (req, res) => {
  try {
    const { userId, promoCodeId, patientId } = req.body;

    // Fetch userId and promoCodeId from the users table based on user ID
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Add other relevant tracking data as needed
    const trackingData = await RegisteredPatients.create({
      userId,
      patientId,
      promoCodeId,
    });

    res.status(201).json({ success: true, trackingData });
  } catch (error) {
    console.error('Error tracking registered patient:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



module.exports = router;
