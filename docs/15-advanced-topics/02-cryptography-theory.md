# Cryptography Theory - Comprehensive Guide
## Understanding Cryptographic Principles and Security

**English:** Cryptography is the practice and study of techniques for secure communication in the presence of adversaries, encompassing encryption, hashing, digital signatures, and key management.

**Tiếng Việt:** Mật mã học là thực hành và nghiên cứu các kỹ thuật để truyền thông an toàn khi có kẻ thù, bao gồm mã hóa, băm, chữ ký số và quản lý khóa.

## Table of Contents
1. [Cryptography Fundamentals](#cryptography-fundamentals)
2. [Symmetric Encryption](#symmetric-encryption)
3. [Asymmetric Encryption](#asymmetric-encryption)
4. [Hash Functions](#hash-functions)
5. [Digital Signatures](#digital-signatures)
6. [Key Exchange](#key-exchange)
7. [Certificates and PKI](#certificates-and-pki)
8. [Web Cryptography](#web-cryptography)
9. [Common Attacks](#common-attacks)
10. [Best Practices](#best-practices)

## Cryptography Fundamentals

### Core Concepts

**Plaintext:** Original, readable message
**Ciphertext:** Encrypted, unreadable message
**Encryption:** Converting plaintext to ciphertext
**Decryption:** Converting ciphertext back to plaintext
**Key:** Secret value used in encryption/decryption
**Algorithm:** Mathematical procedure for encryption

**Basic Flow:**
```
Plaintext → [Encryption + Key] → Ciphertext → [Decryption + Key] → Plaintext
```

### Security Goals

**Confidentiality:**
- Information accessible only to authorized parties
- Prevents unauthorized disclosure
- Achieved through encryption

**Integrity:**
- Information hasn't been altered
- Detects unauthorized modification
- Achieved through hashing and MACs

**Authentication:**
- Verify identity of parties
- Ensures message origin
- Achieved through digital signatures

**Non-repudiation:**
- Sender cannot deny sending message
- Provides proof of origin
- Achieved through digital signatures

### Kerckhoffs's Principle

**Definition:** A cryptosystem should be secure even if everything about the system, except the key, is public knowledge.

**Implications:**
- Security relies on key secrecy, not algorithm secrecy
- Algorithms should be publicly scrutinized
- "Security through obscurity" is not sufficient
- Open algorithms are more trustworthy

**Example:**
```
Bad: Secret algorithm + Secret key
Good: Public algorithm (AES) + Secret key
```

## Symmetric Encryption

### Definition

**Symmetric encryption** uses the same key for both encryption and decryption.

**Characteristics:**
- Fast performance
- Suitable for large data
- Key distribution challenge
- Shared secret required

### Block Ciphers

**Definition:** Encrypts fixed-size blocks of data

**AES (Advanced Encryption Standard):**
```
Block Size: 128 bits
Key Sizes: 128, 192, or 256 bits
Rounds: 10, 12, or 14 (depending on key size)

Structure:
1. SubBytes (substitution)
2. ShiftRows (permutation)
3. MixColumns (mixing)
4. AddRoundKey (key addition)
```

**Example (Conceptual):**
```javascript
// AES-256 encryption
const crypto = require('crypto');

function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(16);  // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    iv: iv.toString('hex'),
    ciphertext: encrypted
  };
}

function decrypt(ciphertext, key, iv) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(iv, 'hex')
  );
  
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

**DES (Data Encryption Standard):**
```
Block Size: 64 bits
Key Size: 56 bits (effectively)
Status: Deprecated (too weak)
Replacement: AES
```

**3DES (Triple DES):**
```
Applies DES three times
Key Size: 168 bits (effectively 112 bits security)
Status: Legacy, being phased out
```

### Stream Ciphers

**Definition:** Encrypts data bit-by-bit or byte-by-byte

**ChaCha20:**
```
Modern stream cipher
Fast in software
Used in TLS 1.3
Mobile-friendly (no hardware acceleration needed)
```

**RC4:**
```
Status: Broken, do not use
Historical significance only
Vulnerabilities discovered
```

### Modes of Operation

**ECB (Electronic Codebook) - DO NOT USE:**
```
Each block encrypted independently
Same plaintext → Same ciphertext
Patterns visible in ciphertext
Security flaw: deterministic

Plaintext:  [Block1] [Block2] [Block3]
              ↓        ↓        ↓
Ciphertext: [Enc1]   [Enc2]   [Enc3]

Problem: If Block1 == Block3, then Enc1 == Enc3
```

**CBC (Cipher Block Chaining):**
```
Each block XORed with previous ciphertext
Requires Initialization Vector (IV)
IV must be random and unpredictable
Sequential encryption, parallel decryption

Encryption:
C₀ = IV
Cᵢ = Encrypt(Pᵢ ⊕ Cᵢ₋₁)

Decryption:
Pᵢ = Decrypt(Cᵢ) ⊕ Cᵢ₋₁
```

**CTR (Counter Mode):**
```
Converts block cipher to stream cipher
Parallel encryption and decryption
Random access to encrypted data
Requires unique nonce + counter

Encryption/Decryption:
Cᵢ = Pᵢ ⊕ Encrypt(Nonce || Counter)
```

**GCM (Galois/Counter Mode):**
```
Authenticated encryption
Provides confidentiality + integrity
Most recommended mode
Used in TLS 1.3

Output: Ciphertext + Authentication Tag
```

### Padding

**PKCS#7 Padding:**
```
Add N bytes, each with value N

Example (8-byte blocks):
"HELLO" (5 bytes) → "HELLO\x03\x03\x03"
"HELLOWORLD" (10 bytes) → "HELLOWORLD\x06\x06\x06\x06\x06\x06"

Full block → Add full block of padding
"HELLOWOR" (8 bytes) → "HELLOWOR\x08\x08\x08\x08\x08\x08\x08\x08"
```

## Asymmetric Encryption

### Definition

**Asymmetric encryption** uses different keys for encryption and decryption.

**Key Pair:**
- **Public Key:** Can be shared, used for encryption
- **Private Key:** Must be secret, used for decryption

**Characteristics:**
- Slower than symmetric
- Solves key distribution problem
- Enables digital signatures
- Typically used for key exchange

### RSA (Rivest-Shamir-Adleman)

**Mathematical Foundation:**
```
Based on difficulty of factoring large numbers

Key Generation:
1. Choose two large primes p and q
2. Compute n = p × q
3. Compute φ(n) = (p-1)(q-1)
4. Choose e such that gcd(e, φ(n)) = 1
5. Compute d such that d × e ≡ 1 (mod φ(n))

Public Key: (n, e)
Private Key: (n, d)

Encryption:
C = M^e mod n

Decryption:
M = C^d mod n
```

**Example:**
```javascript
const crypto = require('crypto');

// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Encrypt with public key
function encrypt(plaintext, publicKey) {
  return crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    Buffer.from(plaintext)
  );
}

// Decrypt with private key
function decrypt(ciphertext, privateKey) {
  return crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    ciphertext
  );
}
```

**Key Sizes:**
```
1024 bits: Deprecated (too weak)
2048 bits: Minimum recommended
3072 bits: Better security
4096 bits: High security (slower)
```

### Elliptic Curve Cryptography (ECC)

**Advantages over RSA:**
- Smaller key sizes for same security
- Faster operations
- Less bandwidth
- Better for mobile/IoT

**Security Comparison:**
```
RSA 1024 bits ≈ ECC 160 bits
RSA 2048 bits ≈ ECC 224 bits
RSA 3072 bits ≈ ECC 256 bits
RSA 15360 bits ≈ ECC 512 bits
```

**Common Curves:**
```
P-256 (secp256r1): NIST standard, widely supported
P-384 (secp384r1): Higher security
P-521 (secp521r1): Highest NIST security
Curve25519: Modern, fast, secure
```

**Example:**
```javascript
const crypto = require('crypto');

// Generate ECDH key pair
const alice = crypto.createECDH('secp256k1');
alice.generateKeys();

const bob = crypto.createECDH('secp256k1');
bob.generateKeys();

// Compute shared secret
const aliceSecret = alice.computeSecret(bob.getPublicKey());
const bobSecret = bob.computeSecret(alice.getPublicKey());

// Both secrets are identical
console.log(aliceSecret.equals(bobSecret)); // true
```

## Hash Functions

### Definition

**Hash function** converts input of any size to fixed-size output (digest).

**Properties:**
1. **Deterministic:** Same input → Same output
2. **Fast:** Quick to compute
3. **One-way:** Cannot reverse (preimage resistance)
4. **Avalanche Effect:** Small input change → Large output change
5. **Collision Resistant:** Hard to find two inputs with same output

### Common Hash Functions

**MD5 (Message Digest 5):**
```
Output: 128 bits (32 hex characters)
Status: BROKEN - Do not use for security
Use case: Checksums only (non-security)

Example:
"hello" → 5d41402abc4b2a76b9719d911017c592
```

**SHA-1 (Secure Hash Algorithm 1):**
```
Output: 160 bits (40 hex characters)
Status: BROKEN - Deprecated
Collision found in 2017

Example:
"hello" → aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
```

**SHA-256 (SHA-2 family):**
```
Output: 256 bits (64 hex characters)
Status: Secure, widely used
Part of SHA-2 family (224, 256, 384, 512)

Example:
"hello" → 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

**SHA-3:**
```
Output: Variable (224, 256, 384, 512 bits)
Status: Secure, modern alternative to SHA-2
Different internal structure (Keccak)
```

**BLAKE2:**
```
Faster than SHA-2
Secure as SHA-3
Configurable output size
Good for general purpose
```

### Hash Function Usage

**Password Hashing (DO NOT USE PLAIN HASHES):**
```javascript
// BAD: Plain hash
const hash = crypto.createHash('sha256')
  .update(password)
  .digest('hex');

// GOOD: Use password hashing function
const bcrypt = require('bcrypt');
const saltRounds = 12;

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

**Data Integrity:**
```javascript
// Verify file hasn't been tampered with
function computeFileHash(filePath) {
  const hash = crypto.createHash('sha256');
  const stream = fs.createReadStream(filePath);
  
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// Verify
const expectedHash = "abc123...";
const actualHash = await computeFileHash('file.zip');
if (actualHash === expectedHash) {
  console.log('File integrity verified');
}
```

### HMAC (Hash-based Message Authentication Code)

**Definition:** Hash function + secret key for authentication

**Purpose:**
- Verify message integrity
- Verify message authenticity
- Prevent tampering

**Example:**
```javascript
function createHMAC(message, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

function verifyHMAC(message, secret, receivedHMAC) {
  const computedHMAC = createHMAC(message, secret);
  return crypto.timingSafeEqual(
    Buffer.from(computedHMAC),
    Buffer.from(receivedHMAC)
  );
}

// Usage
const secret = 'shared-secret-key';
const message = 'Important message';
const hmac = createHMAC(message, secret);

// Send: message + hmac
// Verify on receive
if (verifyHMAC(message, secret, hmac)) {
  console.log('Message authentic and unmodified');
}
```

## Digital Signatures

### Definition

**Digital signature** proves authenticity and integrity of a message using asymmetric cryptography.

**Process:**
```
Signing:
1. Hash the message
2. Encrypt hash with private key
3. Attach signature to message

Verification:
1. Hash the received message
2. Decrypt signature with public key
3. Compare hashes
```

**Properties:**
- **Authentication:** Proves sender identity
- **Integrity:** Detects tampering
- **Non-repudiation:** Sender cannot deny

### RSA Signatures

**Example:**
```javascript
const crypto = require('crypto');

// Sign message
function sign(message, privateKey) {
  const sign = crypto.createSign('SHA256');
  sign.update(message);
  sign.end();
  return sign.sign(privateKey, 'hex');
}

// Verify signature
function verify(message, signature, publicKey) {
  const verify = crypto.createVerify('SHA256');
  verify.update(message);
  verify.end();
  return verify.verify(publicKey, signature, 'hex');
}

// Usage
const message = 'Important document';
const signature = sign(message, privateKey);

// Anyone with public key can verify
if (verify(message, signature, publicKey)) {
  console.log('Signature valid - message authentic');
} else {
  console.log('Signature invalid - message tampered or wrong sender');
}
```

### ECDSA (Elliptic Curve Digital Signature Algorithm)

**Advantages:**
- Smaller signatures than RSA
- Faster signing and verification
- Same security with smaller keys

**Example:**
```javascript
const crypto = require('crypto');

// Generate ECDSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'secp256k1',
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Sign with ECDSA
function signECDSA(message, privateKey) {
  return crypto.sign('sha256', Buffer.from(message), privateKey);
}

// Verify ECDSA signature
function verifyECDSA(message, signature, publicKey) {
  return crypto.verify('sha256', Buffer.from(message), publicKey, signature);
}
```

## Key Exchange

### Diffie-Hellman Key Exchange

**Purpose:** Establish shared secret over insecure channel

**Mathematical Foundation:**
```
Public parameters: prime p, generator g

Alice:
1. Choose secret a
2. Compute A = g^a mod p
3. Send A to Bob

Bob:
1. Choose secret b
2. Compute B = g^b mod p
3. Send B to Alice

Shared Secret:
Alice computes: s = B^a mod p = g^(ab) mod p
Bob computes: s = A^b mod p = g^(ab) mod p

Both arrive at same secret!
```

**Example:**
```javascript
const crypto = require('crypto');

// Alice
const alice = crypto.createDiffieHellman(2048);
const aliceKeys = alice.generateKeys();

// Bob
const bob = crypto.createDiffieHellman(
  alice.getPrime(),
  alice.getGenerator()
);
const bobKeys = bob.generateKeys();

// Compute shared secrets
const aliceSecret = alice.computeSecret(bobKeys);
const bobSecret = bob.computeSecret(aliceKeys);

console.log(aliceSecret.equals(bobSecret)); // true
```

### ECDH (Elliptic Curve Diffie-Hellman)

**Advantages:**
- Smaller key sizes
- Faster computation
- Same security level

**Example:**
```javascript
const crypto = require('crypto');

// Alice
const alice = crypto.createECDH('secp256k1');
alice.generateKeys();

// Bob  
const bob = crypto.createECDH('secp256k1');
bob.generateKeys();

// Exchange public keys and compute shared secret
const aliceSecret = alice.computeSecret(bob.getPublicKey());
const bobSecret = bob.computeSecret(alice.getPublicKey());

// Derive encryption key from shared secret
function deriveKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

const encryptionKey = deriveKey(aliceSecret);
```

## Certificates and PKI

### X.509 Certificates

**Purpose:** Bind public key to identity

**Certificate Contents:**
```
- Version
- Serial Number
- Signature Algorithm
- Issuer (CA)
- Validity Period (Not Before, Not After)
- Subject (Owner)
- Subject Public Key Info
  - Algorithm
  - Public Key
- Extensions
  - Key Usage
  - Subject Alternative Names
  - Basic Constraints
- Signature
```

**Certificate Chain:**
```
Root CA (Self-signed)
    ↓
Intermediate CA
    ↓
End Entity Certificate (example.com)
```

### Certificate Verification

**Steps:**
```
1. Check certificate validity period
2. Verify certificate signature
3. Check certificate revocation status (CRL/OCSP)
4. Verify certificate chain to trusted root
5. Check domain name matches
6. Verify key usage and constraints
```

**Example:**
```javascript
const https = require('https');
const tls = require('tls');

function verifyCertificate(hostname) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, hostname, {
      servername: hostname
    }, () => {
      const cert = socket.getPeerCertificate();
      
      console.log('Subject:', cert.subject);
      console.log('Issuer:', cert.issuer);
      console.log('Valid From:', cert.valid_from);
      console.log('Valid To:', cert.valid_to);
      console.log('Fingerprint:', cert.fingerprint);
      
      socket.end();
      resolve(cert);
    });
    
    socket.on('error', reject);
  });
}
```

## Web Cryptography

### Web Crypto API

**Browser-native cryptography:**
```javascript
// Generate key pair
async function generateKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt
async function encrypt(data, publicKey) {
  const encoded = new TextEncoder().encode(data);
  return await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encoded
  );
}

// Decrypt
async function decrypt(ciphertext, privateKey) {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}
```

### TLS/SSL

**Purpose:** Secure communication over network

**TLS Handshake:**
```
1. Client Hello
   - Supported cipher suites
   - Random number
   - TLS version

2. Server Hello
   - Chosen cipher suite
   - Random number
   - Server certificate

3. Key Exchange
   - Client verifies certificate
   - Generate pre-master secret
   - Encrypt with server public key

4. Finished
   - Both derive session keys
   - Switch to encrypted communication
```

**TLS 1.3 Improvements:**
```
- Faster handshake (1-RTT)
- 0-RTT resumption
- Removed weak ciphers
- Forward secrecy mandatory
- Encrypted handshake
```

## Common Attacks

### Brute Force

**Definition:** Try all possible keys

**Defense:**
- Use long keys (256-bit minimum)
- Use strong passwords
- Rate limiting
- Account lockout

**Time to Crack:**
```
56-bit key: Hours (DES)
128-bit key: Billions of years
256-bit key: Universe lifetime × 10^50
```

### Dictionary Attack

**Definition:** Try common passwords

**Defense:**
- Password complexity requirements
- Password strength meter
- Reject common passwords
- Use password hashing (bcrypt, Argon2)

### Rainbow Tables

**Definition:** Precomputed hash tables

**Defense:**
- Use salt (random value added to password)
- Unique salt per password
- Use slow hash functions (bcrypt, scrypt, Argon2)

**Example:**
```javascript
const bcrypt = require('bcrypt');

// Salt automatically generated and stored with hash
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Hash includes salt, so same password → different hashes
const hash1 = await hashPassword('password123');
const hash2 = await hashPassword('password123');
console.log(hash1 !== hash2); // true
```

### Timing Attacks

**Definition:** Exploit timing differences in comparisons

**Vulnerable Code:**
```javascript
// BAD: Early return reveals information
function compareHMAC(a, b) {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false; // Early return!
  }
  
  return true;
}
```

**Secure Code:**
```javascript
// GOOD: Constant-time comparison
function compareHMAC(a, b) {
  return crypto.timingSafeEqual(
    Buffer.from(a),
    Buffer.from(b)
  );
}
```

### Padding Oracle Attack

**Definition:** Exploit padding validation errors

**Defense:**
- Use authenticated encryption (GCM)
- Don't reveal padding errors
- Use constant-time operations

### Man-in-the-Middle (MITM)

**Definition:** Intercept and modify communication

**Defense:**
- Use TLS/SSL
- Certificate pinning
- HSTS (HTTP Strict Transport Security)
- Verify certificates

## Best Practices

### Key Management

**Generation:**
```javascript
// Use cryptographically secure random
const key = crypto.randomBytes(32); // 256 bits

// DON'T use Math.random()
// DON'T use predictable seeds
```

**Storage:**
```
- Never hardcode keys in source code
- Use environment variables
- Use key management services (AWS KMS, Azure Key Vault)
- Encrypt keys at rest
- Use hardware security modules (HSM) for high security
```

**Rotation:**
```
- Rotate keys periodically
- Have key rotation procedure
- Support multiple active keys during transition
- Revoke compromised keys immediately
```

### Algorithm Selection

**Symmetric Encryption:**
```
✅ AES-256-GCM
✅ ChaCha20-Poly1305
❌ DES, 3DES
❌ RC4
❌ ECB mode
```

**Asymmetric Encryption:**
```
✅ RSA-2048 or higher with OAEP
✅ ECC (P-256, Curve25519)
❌ RSA-1024
❌ RSA with PKCS#1 v1.5 padding
```

**Hashing:**
```
✅ SHA-256, SHA-384, SHA-512
✅ SHA-3
✅ BLAKE2
❌ MD5
❌ SHA-1
```

**Password Hashing:**
```
✅ Argon2id (best)
✅ bcrypt
✅ scrypt
❌ Plain SHA-256
❌ MD5
```

### Implementation Guidelines

**Random Number Generation:**
```javascript
// GOOD: Cryptographically secure
const crypto = require('crypto');
const randomBytes = crypto.randomBytes(32);

// BAD: Not cryptographically secure
const bad = Math.random();
```

**Constant-Time Operations:**
```javascript
// GOOD: Timing-safe comparison
crypto.timingSafeEqual(buffer1, buffer2);

// BAD: Timing attack vulnerable
buffer1.toString() === buffer2.toString();
```

**Error Handling:**
```javascript
// DON'T reveal cryptographic details in errors
try {
  decrypt(ciphertext, key);
} catch (error) {
  // BAD: Reveals padding error
  throw new Error('Padding invalid');
  
  // GOOD: Generic error
  throw new Error('Decryption failed');
}
```

## Interview Questions

**Q: Explain the difference between symmetric and asymmetric encryption.**

A: Symmetric uses the same key for encryption and decryption (fast, good for bulk data, key distribution challenge). Asymmetric uses key pairs - public key encrypts, private key decrypts (slower, solves key distribution, enables digital signatures). Typically use asymmetric to exchange symmetric key, then symmetric for data.

**Q: Why shouldn't you use MD5 or SHA-1 for security?**

A: Both have known collision vulnerabilities - attackers can create different inputs with same hash. MD5 is completely broken. SHA-1 collisions demonstrated in 2017. Use SHA-256 or SHA-3 instead. For passwords, use specialized functions like bcrypt or Argon2.

**Q: What is a salt and why is it important?**

A: A salt is random data added to passwords before hashing. It prevents rainbow table attacks and ensures same password produces different hashes. Each password should have unique salt. Salt doesn't need to be secret, just random and unique.

**Q: Explain how TLS/SSL works.**

A: TLS establishes secure connection through handshake: client/server exchange supported ciphers, server sends certificate, client verifies certificate, both perform key exchange (typically ECDHE), derive session keys, switch to encrypted communication. Provides confidentiality, integrity, and authentication.

**Q: What is the difference between encryption and hashing?**

A: Encryption is reversible (decrypt with key to get original data), used for confidentiality. Hashing is one-way (cannot reverse), produces fixed-size output, used for integrity verification and password storage. Encryption protects data in transit/storage, hashing verifies data hasn't changed.

---

[← Back to HTTP Protocols](./01-http-protocols-theory.md) | [Next: API Design →](./03-api-design-theory.md)
