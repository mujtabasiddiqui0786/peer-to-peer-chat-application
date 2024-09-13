const assert = require('assert');
const { generateRSAKeyPair, encryptMessage, decryptMessage } = require('../src/encryption');

describe('Encryption Tests', () => {
  it('should correctly encrypt and decrypt a message', () => {
    const { publicKey, privateKey } = generateRSAKeyPair();
    const secretKey = crypto.randomBytes(32); // AES-256 key
    const message = "Hello, World!";
    const { encryptedMessage, iv } = encryptMessage(message, secretKey);
    const decryptedMessage = decryptMessage(encryptedMessage, secretKey, iv);

    assert.strictEqual(message, decryptedMessage);
  });
});
