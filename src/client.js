const Hyperswarm = require('hyperswarm');
const crypto = require('crypto');
const readline = require('readline');
const ram = require('random-access-memory');
const DHT = require('hyperdht');

let peerPublicKey = null;  // Store peer's public key
let peerSecretKey = null;  // AES key for encryption

// RSA key pair generation for each peer
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

// Hyperswarm setup and peer discovery
const swarm = new Hyperswarm();
const dht = new DHT();
const topic = DHT.hash(Buffer.from('p2p-encrypted-chat'));

// Discover peers and connect
dht.lookup(topic, (err, peer) => {
  if (err) throw err;
  const connection = swarm.connect(peer);

  // Send our public RSA key to the server
  connection.write(JSON.stringify({ publicKey }));
  console.log('Sent public key to server.');

  // Handle incoming data (RSA key, AES key, messages)
  connection.on('data', (data) => {
    const peerData = JSON.parse(data.toString());

    // Receive and decrypt the AES key
    if (peerData.encryptedKey && !peerSecretKey) {
      peerSecretKey = crypto.privateDecrypt(privateKey, Buffer.from(peerData.encryptedKey, 'hex'));
      console.log('AES key successfully exchanged!');

    // Receive and decrypt messages
    } else if (peerData.encryptedMessage && peerSecretKey) {
      const decryptedMessage = decryptMessage(peerData.encryptedMessage, peerSecretKey, peerData.iv);
      console.log(`Decrypted message: ${decryptedMessage}`);
    }
  });
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
      console.error('AES key exchange is not complete yet. Please wait...');
      return;
    }

    // Encrypt and send message to peers
    const { encryptedMessage, iv } = encryptMessage(message, peerSecretKey);
    const peers = swarm.connections;

    for (const peer of peers) {
      peer.write(JSON.stringify({ encryptedMessage, iv }));
    }

    rl.prompt();
  });
});
