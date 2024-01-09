const CryptoJS = require('crypto-js');

const encrypt = (text) => {
  const key = CryptoJS.lib.WordArray.random(32);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv });
  return {
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
    key: key.toString(CryptoJS.enc.Hex),
    iv: iv.toString(CryptoJS.enc.Hex),
  };
};

const decrypt = (ciphertext, key, iv) => {
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Hex.parse(ciphertext) },
    CryptoJS.enc.Hex.parse(key),
    { iv: CryptoJS.enc.Hex.parse(iv) }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
