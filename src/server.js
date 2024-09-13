const Hypercore = require('hypercore');
const Hyperswarm = require('hyperswarm');
const crypto = require('crypto');
const readline = require('readline');
const ram = require('random-access-memory');

let peerPublicKey = null;  // Store peer's public key
let peerSecretKey = null;  // AES key for encryption

// RSA key pair generation
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// Encryption functions
function encryptMessage(message, secretKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedMessage: encrypted, iv: iv.toString('hex') };
}

function decryptMessage(encryptedMessage, secretKey, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Function to handle RSA key exchange and AES key generation
function handleKeyExchange(connection, data) {
  const peerData = JSON.parse(data.toString());

  // If peer sends its public key, store it
  if (peerData.publicKey && !peerPublicKey) {
    peerPublicKey = peerData.publicKey;

    console.log('Received peer public key, generating AES key...');

    // Generate AES key for this connection
    peerSecretKey = crypto.randomBytes(32);  // AES-256 key

    // Encrypt the AES key using the peer's public key
    const encryptedKey = crypto.publicEncrypt(peerPublicKey, peerSecretKey);

    // Send the encrypted AES key to the peer
    connection.write(JSON.stringify({ encryptedKey: encryptedKey.toString('hex') }));
    console.log('Encrypted AES key sent to peer.');
  }
}

// Hyperswarm setup
const swarm = new Hyperswarm();
swarm.on('connection', (connection) => {
  console.log('New peer connected!');

  // Handle key exchange and sync messages after key exchange
  connection.on('data', (data) => handleKeyExchange(connection, data));
});

// Readline for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter your username: ', (username) => {
  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', (message) => {
    if (!peerSecretKey) {
      console.error('No AES key has been exchanged yet.');
      return;
    }

    // Encrypt the message and broadcast to peers
    const { encryptedMessage, iv } = encryptMessage(message, peerSecretKey);
    console.log(`Broadcasting encrypted message: ${encryptedMessage}`);
    rl.prompt();
  });
});
