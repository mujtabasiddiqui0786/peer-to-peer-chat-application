const crypto = require('crypto');

// RSA key generation
function generateRSAKeyPair() {
  return crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
}

// AES encryption
function encryptMessage(message, secretKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedMessage: encrypted, iv: iv.toString('hex') };
}

// AES decryption
function decryptMessage(encryptedMessage, secretKey, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { generateRSAKeyPair, encryptMessage, decryptMessage };
