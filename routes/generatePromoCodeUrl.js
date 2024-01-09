const CryptoJS = require('crypto-js');
require('dotenv').config();
const ReferralLink = require('../models/ReferralLinks');
// Function to encrypt the text and generate the URL
const encryptAndGenerateUrl = async (text, key, iv, referralLinkId) => {
  try {
    // Fetch the referralLink based on referralLinkId from the ReferralLinks table
    const referralLinkRecord = await ReferralLink.findByPk(referralLinkId);

    if (!referralLinkRecord || !referralLinkRecord.link) {
      console.error('Invalid referralLink data');
      throw new Error('Invalid referralLink data');
    }

    const formattedReferralLink = referralLinkRecord.link.endsWith('/')
      ? referralLinkRecord.link
      : `${referralLinkRecord.link}/`;

    const ciphertext = CryptoJS.AES.encrypt(text, key, { iv: CryptoJS.enc.Hex.parse(iv) }).toString();
    const promoCodeUrl = `${formattedReferralLink}promo?code=${encodeURIComponent(ciphertext)}`;

    return {
      ciphertext,
      promoCodeUrl,
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

const decryptPromoCode = (encryptedText, key, iv) => {
  try {
    console.log('Text', encryptedText)
    const bytes = CryptoJS.AES.decrypt(encryptedText, key, { iv: CryptoJS.enc.Hex.parse(iv) });
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    console.log('Decrypted Promo Code', decrypted);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

const decryptPromoCodeFromUrl = (promoCodeParam, key, iv) => {
  try {
    // Decode the URL component and extract the promo code parameter
    const promoCodeUrl = decodeURIComponent(promoCodeParam);
    console.log('The whole URL:', promoCodeUrl);

    const promoCodeStartIndex = promoCodeUrl.indexOf('?code=') + 6;
    const promoCodeEndIndex = promoCodeUrl.indexOf('&', promoCodeStartIndex);

    const promoCodeEncrypted = promoCodeUrl.slice(promoCodeStartIndex, promoCodeEndIndex !== -1 ? promoCodeEndIndex : undefined);
    console.log('Extracted code from the URL:', promoCodeEncrypted);

    // Decode the promo code before decryption
    const decodedPromoCode = decodeURIComponent(promoCodeEncrypted);

    // Decrypt the promo code
    const decryptedCode = decryptPromoCode(
      decodedPromoCode,
      key,
      iv
    );

    // Check if decryption was successful
    if (!decryptedCode) {
      console.error('Decryption failed or returned null');
      throw new Error('Decryption failed or returned null');
    }

    // Modify to include the promo code in the URL
    const promoCodeUrlWithDecrypted = `${promoCodeUrl.substring(0, promoCodeStartIndex)}${encodeURIComponent(decryptedCode)}`;
    console.log('Decrypted Promo Code from URL:', promoCodeUrlWithDecrypted);

    return promoCodeUrlWithDecrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

module.exports = { encryptAndGenerateUrl, decryptPromoCode, decryptPromoCodeFromUrl };
