const CryptoJS = require("crypto-js");
const secretKey = 'myTotallySecretKey';

const encryptString = (text) => {
    const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
    return encrypted;
}

const decryptString = (encryptedText) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey)
    return decrypted.toString(CryptoJS.enc.Utf8);
}

const matchText = (normalText, encryptedText) => {
    const decryptedText = decryptString(encryptedText);
    return normalText === decryptedText;
}

module.exports = {
    encryptString,
    decryptString,
    matchText
};
