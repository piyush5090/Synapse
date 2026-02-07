// utils/encryption.js
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.ENCRYPTION_KEY || "fallback_secret_key_DO_NOT_USE_IN_PROD";

export const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, SECRET).toString();
};

export const decryptPassword = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};