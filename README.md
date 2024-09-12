# P2P Encrypted Chat Application

This is a decentralized peer-to-peer (P2P) chat application with **End-to-End Encryption (E2EE)**. It uses modern cryptographic techniques to ensure that all communications between peers are secure and private. The application is built using Node.js and key libraries like **Hyperswarm**, **Hypercore**, **Hyperbee**, and **HyperDHT** to enable decentralized communication, message storage, and peer discovery.

## Features

- **Peer-to-Peer (P2P) Communication**: Decentralized chat without the need for a central server.
- **End-to-End Encryption (E2EE)**: Messages are encrypted using AES-256 and keys are exchanged securely using RSA.
- **Peer Discovery**: Peers find each other using a distributed hash table (DHT) with **HyperDHT**.
- **Message Synchronization**: Messages are stored and synchronized using **Hypercore**, allowing peers to replicate messages.
- **Real-Time Chat**: Send and receive messages in real time across peers in a decentralized environment.
- **Public/Private Key Management**: Each peer generates a new RSA key pair at runtime for secure communication.

## Technologies Used

- **Node.js**: JavaScript runtime used to build the server and client.
- **Hyperswarm**: Decentralized networking stack for peer-to-peer communication.
- **Hypercore**: Append-only log for storing and replicating messages.
- **Hyperbee**: Key-value store built on top of Hypercore for managing metadata.
- **HyperDHT**: Distributed hash table for peer discovery.
- **crypto**: Node.js built-in module for encrypting and decrypting messages using AES and RSA.

## Getting Started

### Prerequisites

- **Node.js** and **npm** (Node Package Manager) must be installed on your system.
  - You can download and install Node.js from [here](https://nodejs.org/).
  - Verify installation by running:
    ```bash
    node -v
    npm -v
    ```

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/p2p-encrypted-chat.git
   cd p2p-encrypted-chat

2. **Install Dependencies**: Run the following command to install the required Node.js libraries:
    ```bash
npm install
This will install the following dependencies:

Hyperswarm: For P2P networking and connections.
Hypercore: For message storage and replication.
Hyperbee: For key-value storage.
HyperDHT: For peer discovery using the distributed hash table.
Readline: For handling user input from the command line.
Crypto: For implementing RSA and AES encryption.