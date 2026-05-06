# Web Crypto & Payment APIs — Mã Hóa Trình Duyệt & Thanh Toán

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [XSS & CSRF](./01-xss-csrf.md), [Content Security Policy](./02-csp.md), [Auth Patterns](./03-auth-patterns.md)
> **See also**: [FE System Design](../08-fe-system-design/) | [Networking & HTTP](../10-networking/) | [Advanced Topics](../09-advanced-topics/)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Shopee cần lưu trữ ghi chú nhạy cảm phía client mà server không đọc được. Bạn thiết kế thế nào?"_

Hoặc: _"Grab muốn accept thanh toán thẻ tín dụng. Tại sao bạn **không bao giờ** tự viết form nhận số thẻ?"_

Đây là hai câu hỏi mà Junior trả lời sai nhiều nhất. Junior thường nghĩ: "Dùng `CryptoJS.AES.encrypt()`" cho câu đầu, và "Tạo `<input type='text'>` cho PAN rồi POST lên server" cho câu sau. Cả hai đều là **anti-pattern nghiêm trọng**.

Thực tế:

- **Bitwarden** mã hóa toàn bộ vault phía client bằng Web Crypto API — AES-256-CBC với key derive từ master password qua PBKDF2 (100,000 vòng). Server không bao giờ thấy plaintext.
- **Notion** E2EE workspace dùng X25519 key exchange + AES-GCM để đảm bảo Notion servers không đọc được nội dung.
- **Signal Web** implement Double Ratchet với X3DH key agreement hoàn toàn trong browser, sử dụng SubtleCrypto.
- **Stripe Elements** nhận raw PAN trong iframe cô lập — PAN không bao giờ chạm vào domain của merchant, giảm PCI-DSS scope từ SAQ-D (hàng trăm requirement) xuống SAQ-A (22 requirement).
- **MoMo** và **ZaloPay** tại Việt Nam dùng deep-link redirect + HMAC-SHA256/512 signature để verify tính toàn vẹn của payment callback — không verify signature là lỗi bảo mật chết người.
- **Apple Pay JS** và **Google Pay** tokenize card data trong secure enclave của device, merchant chỉ nhận payment token, không phải raw PAN.

Senior Engineer biết những điều này. Bài này là bản đồ đầy đủ.

---

## ASCII Concept Map / Bản Đồ Khái Niệm

```
WEB CRYPTO & PAYMENT — LANDSCAPE 2026
│
├── WEB CRYPTO API (SubtleCrypto)
│   │
│   ├── DIGEST (one-way hash)
│   │   ├── SHA-256, SHA-384, SHA-512
│   │   └── Use: SRI checksums, content fingerprint
│   │
│   ├── MAC (Message Authentication Code)
│   │   ├── HMAC-SHA256, HMAC-SHA512
│   │   └── Use: VNPay/MoMo signature verification, API auth
│   │
│   ├── SYMMETRIC ENCRYPTION
│   │   ├── AES-GCM (authenticated, preferred)
│   │   ├── AES-CBC (legacy, needs separate MAC)
│   │   └── Use: E2EE local storage, vault encryption (Bitwarden)
│   │
│   ├── ASYMMETRIC / KEY EXCHANGE
│   │   ├── ECDH (P-256, X25519 via WASM)
│   │   ├── RSA-OAEP (encrypt), RSA-PSS (sign)
│   │   └── Use: Signal key exchange, E2EE handshake
│   │
│   ├── DIGITAL SIGNATURE
│   │   ├── ECDSA (P-256, P-384)
│   │   ├── RSA-PSS
│   │   └── Use: Code signing, JWT verification
│   │
│   └── KEY DERIVATION
│       ├── PBKDF2 (native browser API)
│       ├── HKDF (native browser API)
│       └── Argon2 (WASM only — no native API)
│
├── SUBRESOURCE INTEGRITY (SRI)
│   ├── <script integrity="sha384-...">
│   ├── CDN supply-chain attack prevention
│   └── Limitation: same-origin bypass, dynamic scripts
│
└── PAYMENT APIs
    │
    ├── PAYMENT REQUEST API (browser-native)
    │   ├── navigator.payment.request()
    │   ├── Apple Pay in Safari
    │   ├── Google Pay in Chrome
    │   └── Reality: limited support, must fallback
    │
    ├── PAYMENT HANDLER API
    │   ├── Service Worker registers payment handler
    │   └── Google Pay PWA integration
    │
    ├── PAYMENT GATEWAYS (iframe/SDK)
    │   ├── Stripe Elements (iframe, SAQ-A)
    │   ├── Adyen Components (iframe, SAQ-A)
    │   └── PayPal Hosted Fields
    │
    ├── 3D SECURE 2 / SCA
    │   ├── Frictionless flow (risk-based, no user input)
    │   └── Challenge flow (OTP, biometric)
    │
    └── VIETNAMESE PAYMENT GATEWAYS 🇻🇳
        ├── MoMo (deep-link, in-app webview, QR)
        ├── ZaloPay (SDK, deep-link, QR)
        └── VNPay (redirect, HMAC-SHA512 verification)
```

---

## Comparison Matrix / Bảng So Sánh

### Web Crypto vs Libraries / Thư Viện Crypto

| Tiêu chí                | Web Crypto (SubtleCrypto) | CryptoJS               | libsodium-js          | @noble/curves         |
| ----------------------- | ------------------------- | ---------------------- | --------------------- | --------------------- |
| **Bundle size**         | 0KB (native)              | ~43KB gzip             | ~192KB                | ~32KB                 |
| **Performance**         | ✅ Native (hardware AES)  | ❌ JS (10–50× slower)  | 🟡 WASM (~2× slower)  | 🟡 JS (optimized)     |
| **Security audit**      | ✅ Browser vendor audited | ❌ Unmaintained (2012) | ✅ NaCl audited       | ✅ Audited            |
| **Key non-extractable** | ✅ Yes                    | ❌ Always extractable  | ❌ Always extractable | ❌ Always extractable |
| **Algorithms**          | Standard set              | AES/MD5/SHA            | Modern + legacy       | Elliptic curves       |
| **Async API**           | ✅ Promise-based          | ❌ Sync (blocks)       | 🟡 Both               | ✅ Both               |
| **IndexedDB persist**   | ✅ CryptoKey serializable | ❌ Must re-import      | ❌ Must re-import     | ❌ Must re-import     |
| **X25519/Ed25519**      | ❌ (not in spec)          | ❌                     | ✅                    | ✅                    |
| **Argon2**              | ❌                        | ❌                     | ✅ via WASM           | ❌                    |
| **Khi nào dùng**        | Default choice            | ❌ Tránh               | Cần modern curves     | Cần elliptic math     |

**Kết luận**: Với mọi tác vụ Web Crypto hỗ trợ (AES-GCM, PBKDF2, ECDH, HMAC, SHA), luôn dùng SubtleCrypto. Chỉ dùng thư viện bên ngoài khi cần thuật toán chưa có trong spec (Argon2, X25519, Ed25519).

---

### Payment Method Comparison / So Sánh Phương Thức Thanh Toán

| Phương thức                    | PCI Scope      | Browser support         | UX                   | Khi dùng                      |
| ------------------------------ | -------------- | ----------------------- | -------------------- | ----------------------------- |
| **Stripe Elements**            | SAQ-A          | All browsers            | ✅ Nhất quán         | SaaS, e-commerce quốc tế      |
| **Adyen Components**           | SAQ-A          | All browsers            | ✅ Nhất quán         | Enterprise, multi-currency    |
| **Payment Request API**        | SAQ-A          | Partial (Safari/Chrome) | ✅ Native wallet     | Khi target Safari/Chrome only |
| **Apple Pay JS**               | SAQ-A          | Safari only             | ✅ Touch ID/Face ID  | iOS/macOS checkout            |
| **Google Pay API**             | SAQ-A          | Chrome + GP app         | ✅ Android native    | Android-first users           |
| **Hosted Checkout (Stripe)**   | SAQ-A          | All                     | 🟡 Redirect off-site | MVP, ít dev time              |
| **MoMo deep-link** 🇻🇳          | N/A (e-wallet) | Mobile                  | ✅ Quen thuộc VN     | VN mobile users               |
| **ZaloPay SDK** 🇻🇳             | N/A (e-wallet) | Mobile                  | ✅ Tích hợp Zalo     | Zalo ecosystem                |
| **VNPay redirect** 🇻🇳          | N/A            | All                     | 🟡 Leave site        | Ngân hàng VN nội địa          |
| **Self-hosted form (raw PAN)** | SAQ-D          | All                     | ❌ Rủi ro cao        | ❌ KHÔNG BAO GIỜ              |

---

## Part 1: SubtleCrypto Deep Dive / Đi Sâu Vào SubtleCrypto

### 1.1 The Four Pillars / Bốn Trụ Cột

SubtleCrypto expose 4 nhóm operation cốt lõi:

```
crypto.subtle.digest()    → Hashing (SHA-256/384/512)
crypto.subtle.sign()      → Create MAC or digital signature
crypto.subtle.verify()    → Verify MAC or digital signature
crypto.subtle.encrypt()   → Symmetric/asymmetric encryption
crypto.subtle.decrypt()   → Symmetric/asymmetric decryption
crypto.subtle.generateKey()   → Create CryptoKey pair
crypto.subtle.importKey()     → Import raw key material
crypto.subtle.exportKey()     → Export CryptoKey (if extractable)
crypto.subtle.deriveKey()     → PBKDF2/HKDF key derivation
crypto.subtle.deriveBits()    → Raw bit derivation
crypto.subtle.wrapKey()       → Encrypt a key with another key
crypto.subtle.unwrapKey()     → Decrypt a wrapped key
```

### 1.2 Digest — Content Hashing / Băm Nội Dung

```typescript
// SHA-256 hash of a string — dùng cho SRI, content fingerprint
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// SHA-512 hash — dùng cho VNPay HMAC secret hashing
async function sha512(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
```

> **💡 Pitfall**: `crypto.subtle.digest` trả về **hash, không phải HMAC**. Hash không có key → không authenticate được. Để authenticate, dùng `crypto.subtle.sign` với HMAC.

### 1.3 HMAC — Message Authentication / Xác Thực Tin Nhắn

```typescript
// HMAC-SHA256: verify API webhook signatures (Stripe, MoMo)
async function createHMAC(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, // non-extractable
    ["sign"], // usages
  );

  const signature = await crypto.subtle.sign("HMAC", keyMaterial, encoder.encode(message));

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time compare (chống timing attack)
async function verifyHMAC(secret: string, message: string, expectedHex: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signatureBytes = new Uint8Array(expectedHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));

  return crypto.subtle.verify("HMAC", keyMaterial, signatureBytes, encoder.encode(message));
  // ✅ crypto.subtle.verify() is constant-time — no timing attack
}
```

### 1.4 AES-GCM Encryption / Mã Hóa Đối Xứng

AES-GCM là lựa chọn đúng đắn: **authenticated encryption** (tích hợp MAC vào ciphertext).

```typescript
interface EncryptedPayload {
  ciphertext: ArrayBuffer;
  iv: Uint8Array; // 12 bytes random nonce
  tag?: ArrayBuffer; // embedded in ciphertext with GCM
}

// Generate AES-256-GCM key
async function generateAESKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // extractable: false in production if storing in IndexedDB
    ["encrypt", "decrypt"],
  );
}

// Encrypt plaintext
async function encryptAES(key: CryptoKey, plaintext: string): Promise<EncryptedPayload> {
  const encoder = new TextEncoder();
  // ✅ ALWAYS use crypto.getRandomValues — NEVER Math.random()
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext),
  );

  return { ciphertext, iv };
}

// Decrypt ciphertext
async function decryptAES(key: CryptoKey, payload: EncryptedPayload): Promise<string> {
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: payload.iv },
    key,
    payload.ciphertext,
  );
  return new TextDecoder().decode(plaintext);
}
```

> **💡 AES-GCM vs AES-CBC**: AES-GCM tự cung cấp authentication tag. AES-CBC không có — phải dùng Encrypt-then-MAC pattern thủ công (dễ sai). Luôn chọn AES-GCM.

### 1.5 Key Derivation — PBKDF2 / Derive Key Từ Password

Bitwarden dùng PBKDF2 để derive AES key từ master password:

```typescript
// Derive AES-256 key from password (Bitwarden-style)
async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  iterations: number = 600_000, // OWASP 2024 minimum for SHA-256
): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  // Step 1: Import password as raw key material
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  // Step 2: Derive AES key
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false, // ✅ non-extractable — key can't be read from JS
    ["encrypt", "decrypt"],
  );
}

// Usage:
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await deriveKeyFromPassword("my-master-password", salt);
// key is a CryptoKey — not accessible as raw bytes from JavaScript
```

### 1.6 HKDF — Key Expansion / Mở Rộng Key

HKDF (HMAC-based Key Derivation Function) dùng khi đã có high-entropy material và cần derive nhiều keys:

```typescript
// HKDF: expand one shared secret into multiple purpose-specific keys
async function hkdfExpand(
  sharedSecret: ArrayBuffer,
  info: string, // purpose label: "encryption", "authentication", etc.
  outputLength: number = 32,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", sharedSecret, "HKDF", false, [
    "deriveBits",
  ]);

  return crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(32), // optional salt
      info: encoder.encode(info),
    },
    keyMaterial,
    outputLength * 8,
  );
}
```

---

## Part 2: Key Management / Quản Lý Key

### 2.1 CryptoKey Non-Extractable / Key Không Thể Rút Ra

Một trong những tính năng quan trọng nhất của Web Crypto API là **non-extractable keys**:

```typescript
// ✅ CORRECT: key cannot be read from JavaScript
const secureKey = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  false, // extractable = false
  ["encrypt", "decrypt"],
);

// This will THROW — cannot export non-extractable key
try {
  await crypto.subtle.exportKey("raw", secureKey); // ❌ DOMException
} catch (e) {
  console.error("Cannot extract key — as intended");
}

// ❌ WRONG: extractable key defeats security
const leakableKey = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true, // extractable = true
  ["encrypt", "decrypt"],
);
// Now attacker can do: crypto.subtle.exportKey("raw", leakableKey)
// Then store key in localStorage — readable by XSS
```

> **💡 Rule**: Non-extractable keys bảo vệ key ngay cả khi có XSS. Key tồn tại trong memory/IndexedDB nhưng JS code không thể đọc raw bytes.

### 2.2 IndexedDB Persistence / Lưu Key Lâu Dài

```typescript
// Store CryptoKey in IndexedDB (survives page reload)
async function storeKey(key: CryptoKey, keyId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("crypto-keys", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore("keys");
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("keys", "readwrite");
      // ✅ CryptoKey is structured-cloneable — stores directly
      tx.objectStore("keys").put(key, keyId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
}

async function loadKey(keyId: string): Promise<CryptoKey | undefined> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("crypto-keys", 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("keys", "readonly");
      const getReq = tx.objectStore("keys").get(keyId);
      getReq.onsuccess = () => resolve(getReq.result as CryptoKey);
      getReq.onerror = () => reject(getReq.error);
    };
  });
}

// ❌ ANTI-PATTERN: localStorage stores raw bytes — XSS-readable
// localStorage.setItem("aesKey", JSON.stringify(Array.from(rawKeyBytes)));
```

### 2.3 Key Wrapping / Bao Key Bằng Key Khác

```typescript
// Wrap (encrypt) a session key with a master key — safe to store wrapped
async function wrapSessionKey(
  masterKey: CryptoKey,
  sessionKey: CryptoKey,
): Promise<{ wrapped: ArrayBuffer; iv: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await crypto.subtle.wrapKey("raw", sessionKey, masterKey, {
    name: "AES-GCM",
    iv,
  });
  return { wrapped, iv };
}

async function unwrapSessionKey(
  masterKey: CryptoKey,
  wrapped: ArrayBuffer,
  iv: Uint8Array,
): Promise<CryptoKey> {
  return crypto.subtle.unwrapKey(
    "raw",
    wrapped,
    masterKey,
    { name: "AES-GCM", iv },
    { name: "AES-GCM", length: 256 },
    false, // non-extractable
    ["encrypt", "decrypt"],
  );
}
```

---

## Part 3: E2EE Patterns / Mã Hóa Đầu-Đến-Đầu

### 3.1 ECDH Key Exchange / Trao Đổi Key

Signal và Notion dùng ECDH để hai bên derive shared secret mà không truyền key:

```typescript
// Alice and Bob generate key pairs
async function generateECDHKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true, // extractable — public key needs to be shared
    ["deriveKey"],
  );
}

// Alice: export public key to send to Bob
async function exportPublicKey(keyPair: CryptoKeyPair): Promise<JsonWebKey> {
  return crypto.subtle.exportKey("jwk", keyPair.publicKey);
}

// Bob: import Alice's public key
async function importPublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    [], // no usages for public key
  );
}

// Derive shared AES key from Alice's private + Bob's public
// (Bob does the same with Bob's private + Alice's public → same result)
async function deriveSharedKey(
  myPrivateKey: CryptoKey,
  theirPublicKey: CryptoKey,
): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: "ECDH", public: theirPublicKey },
    myPrivateKey,
    { name: "AES-GCM", length: 256 },
    false, // non-extractable shared secret
    ["encrypt", "decrypt"],
  );
}

// Complete E2EE flow:
// Alice:  alicePair = generateECDHKeyPair()
// Bob:    bobPair   = generateECDHKeyPair()
// Alice → Bob: alicePair.publicKey (via server)
// Bob → Alice: bobPair.publicKey   (via server)
// Alice: sharedKey = deriveSharedKey(alicePair.privateKey, bobPublicKey)
// Bob:   sharedKey = deriveSharedKey(bobPair.privateKey, alicePublicKey)
// Both have identical sharedKey — server never sees it
```

### 3.2 Signal-Style Forward Secrecy / Bảo Mật Tương Lai

```typescript
// Simplified Double Ratchet concept (Signal-style)
// Each message uses a NEW derived key — compromise one message ≠ compromise all

interface RatchetState {
  rootKey: CryptoKey;
  sendingChainKey: CryptoKey;
  messageIndex: number;
}

async function ratchetSendKey(
  chainKey: CryptoKey,
): Promise<{ messageKey: CryptoKey; nextChainKey: CryptoKey }> {
  const encoder = new TextEncoder();

  // Derive message key (for this message only)
  const messageKeyBits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(32), info: encoder.encode("message") },
    chainKey,
    256,
  );

  // Derive next chain key (moves ratchet forward)
  const nextChainKeyBits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(32), info: encoder.encode("chain") },
    chainKey,
    256,
  );

  const messageKey = await crypto.subtle.importKey(
    "raw",
    messageKeyBits,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const nextChainKey = await crypto.subtle.importKey("raw", nextChainKeyBits, "HKDF", false, [
    "deriveBits",
  ]);

  return { messageKey, nextChainKey };
}
// Each message: use messageKey then DISCARD — forward secrecy achieved
```

### 3.3 Group Chat — Sender Keys / Chat Nhóm

```
Signal Group Chat approach (Sender Keys):
1. Alice generates SenderKey (symmetric) for the group
2. Alice encrypts SenderKey with each member's public key (Signal protocol)
3. Each member decrypts SenderKey with their private key
4. All messages encrypted with Alice's SenderKey (O(1) per message)
5. When Alice leaves → group rotates SenderKey (new key to remaining members)

Không dùng ECDH per-member per-message (O(n) expensive)
```

---

## Part 4: Client-Side Hashing Pitfalls / Bẫy Băm Phía Client

### 4.1 The Password Hashing Trap / Bẫy Mã Hóa Mật Khẩu

```typescript
// ❌ ANTI-PATTERN: Hash password client-side, send hash to server
async function badLogin(password: string) {
  const hash = await sha256(password); // SHA-256 of password
  await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ password: hash }),
  });
  // Server stores hash in DB
  // PROBLEM: The hash IS the password now!
  // Attacker intercepts hash → replay attack
  // No server-side bcrypt → rainbow tables work
}

// ✅ CORRECT: Send password over HTTPS, hash on SERVER
async function goodLogin(password: string) {
  await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ password }),
    // HTTPS encrypts in transit — TLS handles confidentiality
    // Server does: bcrypt.hash(password, 12) before storing
  });
}

// ✅ EXCEPTION: Bitwarden model — hash client-side to protect server
// But: server ALSO hashes the received hash (double hashing)
// Client sends: PBKDF2(masterPassword, email, 100000) → masterKeyHash
// Server stores: bcrypt(masterKeyHash, 12)
// This way: server breach doesn't expose masterPassword
```

### 4.2 Subresource Integrity (SRI) / Toàn Vẹn Tài Nguyên

```html
<!-- SRI protects against CDN compromise -->
<script
  src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
  integrity="sha384-3quD/ItanC0HVNi74l1oGl9PxRMPBE2xAo0a1UZFbXPyp5VBjmB2K8OJTB3XKRD"
  crossorigin="anonymous"
></script>

<!-- If CDN is compromised and serves different JS:
     Browser computes SHA-384 of received content
     Doesn't match → browser BLOCKS script execution
     Attacker's malicious code never runs -->
```

```typescript
// Generate SRI hash for your own assets
async function generateSRIHash(
  content: string,
  algorithm: "SHA-256" | "SHA-384" | "SHA-512" = "SHA-384",
): Promise<string> {
  const encoder = new TextEncoder();
  const algoMap = { "SHA-256": "SHA-256", "SHA-384": "SHA-384", "SHA-512": "SHA-512" };
  const hashBuffer = await crypto.subtle.digest(algoMap[algorithm], encoder.encode(content));
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  const prefix = algorithm.toLowerCase().replace("-", "");
  return `${prefix}-${base64}`;
}
```

**SRI Limitations / Giới Hạn của SRI:**

```
✅ Protects: Static scripts/styles loaded from external CDNs
❌ Does NOT protect:
   - Same-origin resources (attacker already has your origin)
   - Dynamically loaded scripts (require() / import() without hash)
   - Inline scripts (no src attribute)
   - Resources modified AFTER page load
   - Supply-chain attacks on your OWN code (npm packages)
```

---

## Part 5: VNPay HMAC-SHA512 Verification 🇻🇳

VNPay và nhiều cổng thanh toán VN sử dụng HMAC-SHA512 để ký payment callback. **Không verify signature = lỗ hổng bảo mật cho phép giả mạo giao dịch thành công**.

```typescript
// VNPay return URL signature verification
// Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html

interface VNPayReturnParams {
  vnp_TmnCode: string;
  vnp_Amount: string; // × 100 (integer cents)
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_PayDate: string; // yyyyMMddHHmmss
  vnp_OrderInfo: string;
  vnp_TransactionNo: string;
  vnp_ResponseCode: string; // "00" = success
  vnp_TransactionStatus: string;
  vnp_TxnRef: string; // your order ID
  vnp_SecureHash: string; // HMAC-SHA512 signature to verify
}

async function verifyVNPayReturn(
  params: VNPayReturnParams,
  secretKey: string, // your VNPay hash secret — NEVER expose to client
): Promise<boolean> {
  const { vnp_SecureHash, ...rest } = params;

  // Step 1: Sort params alphabetically, exclude vnp_SecureHash
  const sortedKeys = Object.keys(rest).sort();
  const queryString = sortedKeys
    .filter(
      (k) => rest[k as keyof typeof rest] !== "" && rest[k as keyof typeof rest] !== undefined,
    )
    .map((k) => `${k}=${rest[k as keyof typeof rest]}`)
    .join("&");

  // Step 2: HMAC-SHA512 with secret key
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", keyMaterial, encoder.encode(queryString));

  // Step 3: Convert to lowercase hex
  const computedHash = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Step 4: Constant-time comparison (prevent timing attacks)
  const keyForVerify = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["verify"],
  );

  const expectedBytes = new Uint8Array(vnp_SecureHash.match(/.{2}/g)!.map((b) => parseInt(b, 16)));

  const isValid = await crypto.subtle.verify(
    "HMAC",
    keyForVerify,
    expectedBytes,
    encoder.encode(queryString),
  );

  // Step 5: Also verify business logic
  if (!isValid) return false;
  if (params.vnp_ResponseCode !== "00") return false; // Payment failed
  if (params.vnp_TransactionStatus !== "00") return false;

  return true;
}

// ⚠️ CRITICAL: This verification MUST happen server-side
// The secretKey must NEVER be exposed to client JavaScript
// Client sends return params to your server → server verifies → server updates order status
```

**MoMo Signature Pattern (HMAC-SHA256)** 🇻🇳:

```typescript
// MoMo payment signature verification
async function verifyMoMoSignature(
  rawData: string, // partnerCode + ... concatenated per MoMo docs
  secretKey: string,
  receivedSignature: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const expectedBytes = new Uint8Array(
    receivedSignature.match(/.{2}/g)!.map((b) => parseInt(b, 16)),
  );

  return crypto.subtle.verify("HMAC", keyMaterial, expectedBytes, encoder.encode(rawData));
}

// ZaloPay: similar HMAC-SHA256 on key1, key2 (different for request vs callback)
// VNPay:   HMAC-SHA512 on sorted query params
// MoMo:    HMAC-SHA256 on concatenated fields per API docs
```

---

## Part 6: Payment APIs / API Thanh Toán

### 6.1 Payment Request API

```typescript
// Payment Request API — browser-native checkout UI
// Works in Chrome (Google Pay), Safari (Apple Pay)

async function requestPayment(amount: number, currency: string = "VND") {
  // Check support
  if (!window.PaymentRequest) {
    // Fallback to Stripe Elements or redirect
    return fallbackToStripe(amount, currency);
  }

  const supportedMethods: PaymentMethodData[] = [
    {
      supportedMethods: "https://google.com/pay",
      data: {
        environment: "TEST",
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantInfo: { merchantName: "Shopee VN", merchantId: "your-merchant-id" },
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["VISA", "MASTERCARD"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "stripe",
                "stripe:version": "2018-10-31",
                "stripe:publishableKey": "pk_live_...",
              },
            },
          },
        ],
      },
    },
  ];

  const details: PaymentDetailsInit = {
    displayItems: [
      { label: "Order Total", amount: { currency, value: (amount / 100).toFixed(2) } },
    ],
    total: { label: "Total", amount: { currency, value: (amount / 100).toFixed(2) } },
  };

  const request = new PaymentRequest(supportedMethods, details);

  try {
    const response = await request.show(); // Opens native payment UI
    // response.details contains payment token (NOT raw card)
    const serverResult = await processOnServer(response.details);
    await response.complete(serverResult.success ? "success" : "fail");
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      console.log("User cancelled payment");
    }
  }
}
```

### 6.2 Stripe Elements — PCI-DSS Scope Reduction / Giảm Phạm Vi PCI-DSS

```typescript
// Stripe Elements — raw PAN never touches your domain
// This is the CORRECT pattern for card payments

import Stripe from "stripe";

// Client-side: Stripe.js loads in iframe, captures card data
// Your domain never sees raw card numbers
async function initStripeCheckout() {
  const stripe = await loadStripe("pk_live_your-publishable-key");
  const elements = stripe!.elements();

  // ✅ CardElement renders inside Stripe's iframe
  // Raw PAN stays in Stripe's domain — SAQ-A applies (not SAQ-D)
  const cardElement = elements.create("card", {
    style: { base: { fontSize: "16px", color: "#32325d" } },
  });
  cardElement.mount("#card-element");

  // On submit: tokenize card (no PAN leaves Stripe iframe)
  const submitBtn = document.getElementById("submit")!;
  submitBtn.addEventListener("click", async () => {
    const { paymentMethod, error } = await stripe!.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    // paymentMethod.id = "pm_xxx" — a token, NOT a card number
    // Send this token to YOUR server
    await fetch("/api/charge", {
      method: "POST",
      body: JSON.stringify({ paymentMethodId: paymentMethod!.id, amount: 50000 }),
    });
  });
}

// Server-side (Node.js): use secret key to charge
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// const paymentIntent = await stripe.paymentIntents.create({
//   amount: 50000,
//   currency: "vnd",
//   payment_method: paymentMethodId,
//   confirm: true,
// });
```

**PCI-DSS Scope Comparison:**

```
SAQ-A (Stripe Elements / hosted):
  - Merchant never handles, processes, stores card data
  - All card capture in Stripe's iframe/redirect
  - ~22 requirements to comply with

SAQ-D (raw form, self-hosted):
  - Merchant builds own card input form
  - PAN travels through your server
  - ~300+ requirements
  - Quarterly vulnerability scans, penetration tests
  - Costs $50,000–$200,000/year for compliance

→ Use Stripe Elements. Never touch raw PAN.
```

### 6.3 3D Secure 2 / SCA Flow

```
3DS2 Flow (Stripe PaymentIntents):

1. Client: stripe.confirmCardPayment(clientSecret)
2. Stripe: assesses risk (device fingerprint, history, velocity)
3. If LOW risk → Frictionless flow
   ├── Bank approves silently
   └── Payment succeeds with no user interaction
4. If HIGH risk → Challenge flow
   ├── Browser opens 3DS2 iframe (OTP, biometric, app notification)
   ├── User completes challenge
   └── Payment proceeds or declines

EU requirement (PSD2 SCA):
  - All EU card payments > €30 require SCA
  - Strong Customer Authentication = 2 of 3:
    * Something you know (PIN/password)
    * Something you have (phone/OTP)
    * Something you are (biometric)
  - Exemptions: low-value (<€30), trusted merchants, low-risk transactions
```

```typescript
// 3DS2 handling with Stripe
async function handlePaymentWith3DS(clientSecret: string) {
  const stripe = await loadStripe("pk_live_...");
  const { paymentIntent, error } = await stripe!.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
    },
  });

  if (error) {
    if (error.code === "payment_intent_authentication_failure") {
      // 3DS challenge failed — show retry UI
      showError("Authentication failed. Please try again.");
    } else {
      showError(error.message ?? "Payment failed");
    }
    return;
  }

  if (paymentIntent?.status === "succeeded") {
    // ✅ NEVER trust this alone — always verify via webhook
    // Attacker could call this with a different paymentIntentId
    redirectToSuccess();
  }
}
```

### 6.4 Vietnamese Payment Integrations 🇻🇳

**MoMo Deep-Link Flow:**

```typescript
// MoMo payment flow — mobile deep-link
// Server creates payment request → MoMo returns payUrl
// Client redirects or opens deep-link

async function initMoMoPayment(orderId: string, amount: number) {
  // Step 1: Server creates MoMo payment request
  const response = await fetch("/api/momo/create", {
    method: "POST",
    body: JSON.stringify({ orderId, amount }),
  });
  const { payUrl, deeplink, qrCodeUrl } = await response.json();

  // Step 2: Detect platform and redirect accordingly
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);
  const hasMoMoApp = await checkDeeplinkAvailable("momo://");

  if (isMobile && hasMoMoApp) {
    // ✅ Open MoMo app directly
    window.location.href = deeplink;
    // deeplink format: momo://app?action=payWithApp&isScanQR=false&serviceType=app&...
  } else if (isMobile) {
    // MoMo app not installed → open mobile web
    window.location.href = payUrl;
  } else {
    // Desktop → show QR code
    renderQRCode(qrCodeUrl);
  }

  // Step 3: Handle return URL (MoMo redirects back)
  // MoMo appends: resultCode, message, orderId, requestId, amount, signature
  // Server MUST verify HMAC-SHA256 signature before updating order
}

// ⚠️ In-app webview (React Native, Flutter):
// Use deep-link within WebView — test carefully
// MoMo in-app: window.location.href = deeplink  →  MoMo app opens
// Some Android WebViews block app-scheme URLs → use Intent scheme
// intent://pay?...#Intent;scheme=momo;package=com.mservice.momotransfer;end
```

**ZaloPay Integration:**

```typescript
// ZaloPay flow — SDK or deep-link
// Similar pattern to MoMo: server creates order → redirect → verify callback

async function initZaloPayPayment(orderId: string, amount: number) {
  const { order_url, zp_trans_token } = await fetch("/api/zalopay/create", {
    method: "POST",
    body: JSON.stringify({ orderId, amount }),
  }).then((r) => r.json());

  // ZaloPay redirect URL
  window.location.href = order_url;
  // User completes in ZaloPay app or ZaloPay web
  // ZaloPay redirects to your callback_url

  // Server-side callback verification:
  // Verify HMAC-SHA256 of (app_id + "|" + zp_trans_id + "|" + amount + "|" + app_trans_id + "|" + server_time)
  // using key2 (separate from creation key1)
}
```

**VNPay QR / ATM Card:**

```typescript
// VNPay creates redirect URL with sorted params + HMAC-SHA512
// Client just redirects — ALL security is in server-side signature verification

async function redirectToVNPay(orderId: string, amount: number) {
  // Server creates VNPay URL (never create on client — secret key exposure)
  const { vnpayUrl } = await fetch("/api/vnpay/create", {
    method: "POST",
    body: JSON.stringify({ orderId, amount }),
  }).then((r) => r.json());

  // Simple redirect — VNPay handles card capture on THEIR domain
  window.location.href = vnpayUrl;

  // After payment, VNPay redirects to your vnp_ReturnUrl
  // with params + vnp_SecureHash
  // Your server MUST verify hash before showing success to user
  // (See verifyVNPayReturn() in Part 5)
}
```

---

## Part 7: Argon2 & PBKDF2 Tradeoff / Đánh Đổi

```
PBKDF2 (native browser):
  ✅ Built into SubtleCrypto — no extra download
  ✅ Hardware-accelerated (HMAC-SHA256)
  ❌ GPU-parallelizable — attackers use GPU farms
  ❌ No memory-hardness — cheap to brute-force with GPUs
  → Use: Bitwarden (100,000+ iterations), LastPass

Argon2 (WASM required):
  ✅ Memory-hard — requires GBs of RAM to run at speed
  ✅ Winner of Password Hashing Competition (2015)
  ✅ Argon2id = best of both (time + memory)
  ❌ No native browser API — must ship WASM binary (~400KB)
  ❌ WASM execution: 2-5× slower than native
  ❌ Safari Wasm memory limits in some versions
  → Use: When password cracking resistance is paramount

HKDF (native browser):
  ✅ For EXPANDING existing high-entropy key material
  ❌ NOT for passwords (no iteration, no memory-hardness)
  → Use: Derive multiple keys from ECDH shared secret

Decision 2026:
  Client-side password hashing → PBKDF2 (≥600,000 iterations, SHA-256)
  Need Argon2 → run server-side (Go/Rust) or accept WASM overhead
  Key expansion from ECDH → HKDF
```

---

## Part 8: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: Tại sao dùng Web Crypto API thay vì CryptoJS hoặc libsodium-js?

**A:**

Có ba lý do cốt lõi:

**1. Bundle size và performance**: SubtleCrypto là native browser API — 0KB thêm vào bundle. CryptoJS thêm ~43KB gzipped; libsodium-js thêm ~192KB. Quan trọng hơn, SubtleCrypto dùng **hardware acceleration** (AES-NI instruction set trên CPU hiện đại) — nhanh hơn CryptoJS pure-JS implementation 10–50 lần cho AES operations.

**2. Non-extractable keys**: SubtleCrypto cho phép tạo `CryptoKey` với `extractable: false`. Key tồn tại trong browser memory nhưng JavaScript **không thể đọc raw bytes**. Attacker có XSS không thể steal key. Với CryptoJS, key là plain JavaScript string/array — bất kỳ XSS nào đều đọc được.

**3. Audited và maintained**: Chromium và WebKit implement SubtleCrypto — được kiểm tra bởi Google/Apple security teams, cập nhật với browser. CryptoJS **không được maintain từ 2012** — có nhiều known issues với random number generation và IV handling.

Khi nào dùng thư viện: SubtleCrypto không có X25519/Ed25519 (dùng libsodium-js hoặc @noble/curves) và không có Argon2 (dùng argon2-wasm). Ngoài những trường hợp đó, luôn dùng SubtleCrypto.

Vietnamese: Dùng SubtleCrypto vì: (1) 0KB bundle, hardware-accelerated (nhanh 50×). (2) Non-extractable keys — XSS không đọc được raw key bytes. (3) Được browser vendors audit và maintain. Chỉ dùng lib khi cần X25519/Argon2 (SubtleCrypto chưa support).

**💡 Interview Signal:**

- ✅ Strong: Mentions all three (bundle/perf, non-extractable keys, audit/maintenance), gives specific numbers (50×, 0KB), knows when libraries ARE needed
- ❌ Weak: "Web Crypto is newer" — misses the key technical advantages

---

### 🟢 Q2: Hash, MAC, và Digital Signature khác nhau thế nào?

**A:**

Ba primitive khác nhau về **mục đích và key**:

```
HASH (digest):
  Input: message
  Output: fixed-length fingerprint
  Key: NONE
  Properties: deterministic, one-way, collision-resistant
  Use: content integrity (SRI), password storage base
  Attack: anyone can compute → NOT authentication
  Example: SHA-256("hello") → "2cf24db..."

MAC (Message Authentication Code):
  Input: message + shared secret key
  Output: authentication tag
  Key: SYMMETRIC (both parties share same key)
  Properties: only key-holders can generate/verify
  Use: API webhook signatures (Stripe, MoMo, VNPay), session tokens
  Attack: key leakage → anyone can forge
  Example: HMAC-SHA256(key, "hello") → "..."

DIGITAL SIGNATURE:
  Input: message + PRIVATE key (sign) / PUBLIC key (verify)
  Output: signature
  Key: ASYMMETRIC (different keys for sign/verify)
  Properties: non-repudiation (only private key holder can sign)
  Use: code signing, JWT RS256, TLS certificates, document signing
  Attack: private key theft → forgery possible
  Example: ECDSA(privateKey, sha256("hello")) → "..."
```

**Khi nào dùng gì**:

- Hash: content fingerprinting, SRI, building block for above
- MAC: two parties share secret, need fast authentication (webhook verification)
- Signature: one party signs, many verify (public verifiability, non-repudiation)

Vietnamese: Hash = fingerprint, không có key, ai cũng tính được. MAC = fingerprint có key đối xứng, chỉ ai có key mới verify được. Digital signature = key bất đối xứng: private key ký, public key verify — chỉ người có private key mới ký được nhưng ai cũng verify được.

**💡 Interview Signal:**

- ✅ Strong: Correctly identifies key types (none / symmetric / asymmetric), mentions non-repudiation for signatures, gives concrete use cases for each
- ❌ Weak: "Hash is encryption" — common misconception; hashing is one-way, encryption is reversible

---

### 🟡 Q3: Làm thế nào để generate và store CryptoKey an toàn?

**A:**

Ba nguyên tắc cốt lõi:

**Nguyên tắc 1: Non-extractable by default**

```typescript
// ✅ CORRECT
const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  false, // extractable: false — cannot read raw bytes from JS
  ["encrypt", "decrypt"],
);

// ❌ WRONG for keys you don't need to export
const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true, // XSS can now steal key via exportKey("raw", key)
  ["encrypt", "decrypt"],
);
```

**Nguyên tắc 2: IndexedDB, không phải localStorage**

```typescript
// ✅ CORRECT: IndexedDB stores CryptoKey as structured clone
// Key is non-extractable even when stored in IndexedDB
await db.put("keys", cryptoKey, "myKeyId");

// ❌ WRONG: localStorage stores raw bytes — XSS readable
const exported = await crypto.subtle.exportKey("raw", key);
localStorage.setItem("key", JSON.stringify(Array.from(new Uint8Array(exported))));
// Now any XSS script can do: JSON.parse(localStorage.getItem("key"))
```

**Nguyên tắc 3: Scope keys to usage**

```typescript
// Each key limited to specific operations
const encryptKey = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"], // NOT ["encrypt", "decrypt"] — principle of least privilege
);
```

**Khi session ends**: Non-extractable keys in IndexedDB persist across page reloads — đây là tính năng (không cần re-derive từ password). Khi user logs out, delete key from IndexedDB.

Vietnamese: Ba nguyên tắc: (1) `extractable: false` — XSS không đọc được raw bytes. (2) Lưu trong IndexedDB — CryptoKey là structured-cloneable, lưu được trực tiếp; localStorage chỉ lưu raw bytes không an toàn. (3) Scope usage — mỗi key chỉ có permission cần thiết (principle of least privilege).

**💡 Interview Signal:**

- ✅ Strong: Explains WHY non-extractable protects against XSS, knows CryptoKey is IndexedDB-compatible via structured clone, mentions usage scoping
- ❌ Weak: "Store key in sessionStorage" — sessionStorage is XSS-readable same as localStorage

---

### 🟡 Q4: PBKDF2 vs Argon2 — khi nào dùng cái nào?

**A:**

**Sự khác biệt cốt lõi**:

```
PBKDF2:
  Algorithm: HMAC(password, salt) × N iterations
  Cost factor: TIME only (iterations)
  GPU resistance: ❌ Weak — GPU can parallelize HMAC
  Native browser: ✅ SubtleCrypto built-in
  Memory: ~100KB
  OWASP recommendation: 600,000 iterations SHA-256

Argon2id (winner PHC 2015):
  Algorithm: Time-Memory hard function
  Cost factor: TIME + MEMORY + PARALLELISM
  GPU resistance: ✅ Strong — requires N MB RAM per instance
  Native browser: ❌ No browser API — must use WASM
  Memory: configurable (64MB recommended)
  OWASP recommendation: m=65536, t=3, p=4
```

**Tại sao frontend không thể run Argon2 natively**:

Browser SubtleCrypto spec chỉ include PBKDF2 và HKDF. Argon2 chưa được standardize vào Web Crypto — không có `crypto.subtle.deriveKey({ name: "Argon2id", ... })`. Phải dùng WASM binary (~400KB compiled).

```typescript
// PBKDF2 (native — prefer this for client-side)
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 600_000, hash: "SHA-256" },
  passwordKeyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"],
);

// Argon2 (WASM — significant overhead)
import { hash } from "argon2-wasm-esm";
const result = await hash({
  pass: password,
  salt: saltBytes,
  time: 3,
  mem: 65536, // 64MB
  parallelism: 4,
  type: ArgonType.Argon2id,
});
// WASM download: ~400KB; execution: slower than native
// BUT: much more resistant to GPU cracking
```

**Decision**:

- Client-side password KDF → PBKDF2 với iterations cao (≥600K) — native, no bundle cost
- Server-side (Go/Rust/Node) → Argon2id preferred — no WASM overhead
- Security-critical client (Bitwarden-level) → Ship Argon2 WASM, accept bundle cost

Vietnamese: PBKDF2 native trong browser (SubtleCrypto), chỉ tốn thời gian (có thể GPU bypass). Argon2 memory-hard — GPU khó tấn công hơn nhưng không có native browser API, phải WASM (~400KB). Kết luận: Client-side dùng PBKDF2 với ≥600K iterations. Server-side dùng Argon2id. Nếu security-critical (password manager), accept WASM overhead cho Argon2.

**💡 Interview Signal:**

- ✅ Strong: Correctly identifies no native Argon2 API, explains memory-hard property, gives OWASP iteration counts, knows the WASM tradeoff
- ❌ Weak: "Argon2 is better so always use Argon2" — ignores that browser has no native API and 400KB WASM is a real cost

---

### 🟡 Q5: Subresource Integrity hoạt động thế nào và khi nào KHÔNG giúp được?

**A:**

**Cách hoạt động**:

```html
<script
  src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"
  integrity="sha384-hash-here"
  crossorigin="anonymous"
></script>
```

Browser fetches script, computes SHA-384 of received bytes. Nếu không match `integrity` attribute → block script, throw error. Bảo vệ chống **CDN supply-chain attack**: CDN bị hack và serve malicious JS → browser phát hiện và block.

**Khi SRI KHÔNG giúp được**:

```
❌ Same-origin resources:
   <script src="/js/app.js"> — no integrity attribute
   Attacker already compromised YOUR server → SRI irrelevant

❌ Dynamic imports:
   import(/* webpackChunkName */ "chunk")
   Dynamic chunks không có SRI unless you configure it manually

❌ eval() / new Function():
   Code created at runtime — no resource to hash

❌ XSS on the page itself:
   SRI blocks external scripts
   But if attacker injects <script>evilCode()</script> inline → no SRI protection

❌ npm supply-chain attacks:
   lodash@4.17.21 in node_modules
   SRI only helps for loaded URLs, not bundled code

✅ SRI helps: Loading from external CDN a versioned, immutable file
✅ SRI + CSP: Combine for defense-in-depth
```

Vietnamese: SRI hash content của external scripts/styles — CDN bị hack serve file khác → browser block. KHÔNG giúp: same-origin resources, dynamic imports, XSS inline scripts, npm bundled code. Kết hợp với CSP `require-sri-for` để enforce SRI cho tất cả external resources.

**💡 Interview Signal:**

- ✅ Strong: Lists specific scenarios SRI doesn't help, knows it only applies to declared static resources, mentions CSP combination
- ❌ Weak: "SRI prevents XSS" — SRI prevents specific CDN attacks, not general XSS

---

### 🟡 Q6: Payment Request API — thực tế browser support?

**A:**

Payment Request API (PRA) được ship bởi tất cả modern browsers nhưng có **significant UX caveats**:

```
Chrome/Edge: ✅ Full support
  → Shows Google Pay if user has it set up
  → Shows basic card form otherwise

Safari: ✅ Full support
  → Shows Apple Pay if device has a card
  → No fallback otherwise (shows nothing or errors)

Firefox: ❌ Removed support (was experimental, removed 2017)
  → Must always provide non-PRA fallback

Samsung Internet: ✅ Partial
  → Samsung Pay integration

Mobile browsers (Vietnam context):
  Chrome Android: ✅ Google Pay
  Safari iOS: ✅ Apple Pay
  In-app WebViews (MoMo, Zalo): ❌ PRA often blocked
```

**Thực tế khi nào dùng PRA vs Stripe Elements**:

```typescript
async function chooseBestPaymentUI() {
  const canUsePRA = window.PaymentRequest !== undefined;

  if (!canUsePRA) {
    // Firefox, old browsers → Stripe Elements always
    return renderStripeElements();
  }

  // Even with PRA support, check if any payment method is actually available
  const supportedMethods = [{ supportedMethods: "https://google.com/pay", data: gpayData }];
  const request = new PaymentRequest(supportedMethods, details);

  try {
    const canMakePayment = await request.canMakePayment();
    if (canMakePayment) {
      // ✅ User has Google Pay / Apple Pay configured → use PRA
      return showPaymentRequestButton(request);
    } else {
      // API exists but no wallet configured → fallback
      return renderStripeElements();
    }
  } catch {
    return renderStripeElements();
  }
}
```

**Recommendation**: PRA là **enhancement**, không phải replacement. Luôn có Stripe Elements hoặc hosted checkout làm fallback. PRA giúp users với Apple Pay / Google Pay checkout nhanh hơn — không phải solution cho mọi user.

Vietnamese: PRA support trong Chrome và Safari nhưng Firefox đã remove. Phải check `canMakePayment()` — API exists không có nghĩa là user có wallet configured. Luôn có fallback (Stripe Elements). PRA là progressive enhancement cho users có Apple/Google Pay, không phải replacement cho card form.

**💡 Interview Signal:**

- ✅ Strong: Knows Firefox removed support, uses `canMakePayment()` check, treats PRA as enhancement not replacement, mentions in-app WebView limitations
- ❌ Weak: "Just use Payment Request API everywhere" — ignores Firefox, no-wallet-configured scenarios

---

### 🔴 Q7: Thiết kế E2EE chat — key exchange, forward secrecy, group chat?

**A:**

Đây là câu hỏi system design cấp Senior. Signal Web là reference implementation.

**Phase 1: Initial Key Exchange (X3DH)**

```
Alice và Bob chưa bao giờ chat:

1. Bob publishes to server (prekey bundle):
   - Identity key (IK_B): long-term public key
   - Signed prekey (SPK_B): medium-term, signed by IK_B
   - One-time prekeys (OPK_B): batch of ephemeral keys

2. Alice fetches Bob's prekey bundle, generates:
   - Ephemeral key (EK_A): throwaway ECDH key

3. Alice computes 4 ECDH operations:
   DH1 = ECDH(IK_A_private, SPK_B_public)
   DH2 = ECDH(EK_A_private, IK_B_public)
   DH3 = ECDH(EK_A_private, SPK_B_public)
   DH4 = ECDH(EK_A_private, OPK_B_public)  // optional
   MasterSecret = HKDF(DH1 || DH2 || DH3 || DH4)

4. Alice encrypts first message with MasterSecret
   Alice sends: {IK_A_public, EK_A_public, encrypted_message}

5. Bob receives, recomputes SAME 4 ECDH operations → same MasterSecret
   → Bob decrypts message without prior communication
```

**Phase 2: Double Ratchet (per-message keys)**

```
After X3DH, both have root key.
For each message:
1. Ratchet generates unique message key (HKDF)
2. Message encrypted with message key
3. Message key DISCARDED after use

Forward secrecy: compromise today's key → cannot decrypt past messages
Break-in recovery: new keys generated each ratchet step
```

**Phase 3: Group Chat (Sender Keys)**

```
Signal Group approach:
1. Alice generates SenderKey (AES + HMAC pair)
2. Alice encrypts SenderKey to each member using 1-on-1 protocol
3. Members decrypt their copy of SenderKey
4. Alice encrypts ALL group messages with SenderKey (O(1) per message)
5. New member joins → Alice sends encrypted SenderKey to them
6. Member leaves → everyone generates new SenderKey (rotate)

Alternative: WhatsApp's "Whisper Groups" — same Sender Keys concept
```

```typescript
// Simplified: Alice initiates group with 3 members
async function setupGroupChat(memberPublicKeys: CryptoKey[]) {
  // Generate group sender key (Alice's)
  const senderKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // needs to be exportable to share with members
    ["encrypt", "decrypt"],
  );

  const exportedKey = await crypto.subtle.exportKey("raw", senderKey);

  // Encrypt sender key for each member using their ECDH key
  const encryptedKeyPerMember = await Promise.all(
    memberPublicKeys.map(async (memberPub) => {
      const sharedKey = await deriveSharedKey(alicePrivateKey, memberPub);
      return encryptAES(sharedKey, JSON.stringify(Array.from(new Uint8Array(exportedKey))));
    }),
  );

  // Send each member their encrypted copy
  return encryptedKeyPerMember;
}
```

Vietnamese: E2EE chat 3 giai đoạn: (1) X3DH key exchange — dùng prekey bundles để derive shared secret mà không cần prior contact, ephemeral keys cho forward secrecy. (2) Double Ratchet — mỗi tin nhắn derive new key, discard sau khi dùng, không compromise được tin nhắn cũ. (3) Group: Sender Keys — Alice chia sẻ symmetric key cho mỗi member qua 1-on-1 protocol, rotate khi ai đó rời nhóm.

**💡 Interview Signal:**

- ✅ Strong: Names X3DH + Double Ratchet specifically, explains why group uses SenderKeys not ECDH per-message, mentions rotation on membership change, understands forward secrecy vs break-in recovery
- ❌ Weak: "Everyone shares same key" — no forward secrecy, massive compromise radius

---

### 🔴 Q8: PCI-DSS scope — tại sao Stripe Elements đưa bạn vào SAQ-A?

**A:**

PCI-DSS (Payment Card Industry Data Security Standard) yêu cầu bất kỳ system nào **handle, process, store, hoặc transmit** card data phải comply.

**Scope determination**:

```
SAQ-D (full compliance):
  Your server receives raw card data (PAN, CVV, expiry)
  → Your server is "in scope"
  → ~300+ requirements
  → Quarterly external vulnerability scans
  → Annual penetration test
  → On-site assessment for large merchants
  → Cost: $50,000–$200,000/year

SAQ-A (minimal compliance):
  Raw card data NEVER touches your systems
  All card capture in third-party iframe (Stripe Elements)
  → Only your redirect/confirmation page is in scope
  → ~22 requirements
  → Annual self-assessment questionnaire
  → Cost: Near-zero compliance overhead
```

**Cách Stripe Elements achieve SAQ-A**:

```
Your page:                      Stripe's domain:
┌─────────────────────┐        ┌──────────────────────────────┐
│ <div id="payment">  │        │                              │
│   ┌─────────────┐   │        │  iframe src="js.stripe.com"  │
│   │  [iframe]   │◄──┼────────┤  - Card number input         │
│   │             │   │        │  - CVV input                 │
│   └─────────────┘   │        │  - Expiry input              │
│ </div>              │        │  PAN → Stripe servers only   │
│                     │        │  Token returned to parent    │
└─────────────────────┘        └──────────────────────────────┘

Your JS only receives: pm_xxxxx (payment method token)
RAW PAN = "4242 4242 4242 4242" never visible to your JavaScript
```

**Cách Adyen Components làm tương tự**: Hosted fields trong iframe. Merchant JS receives token, không phải PAN.

**Sai lầm phổ biến**:

```typescript
// ❌ CATASTROPHIC: Your form collects raw card data → SAQ-D scope
<input type="text" name="cardNumber" placeholder="4242 4242 4242 4242" />
// PAN goes to your server → millions in compliance cost

// ✅ CORRECT: Stripe Elements iframe
<div id="card-element"></div>  // Stripe injects iframe here
// Token goes to your server → SAQ-A
```

Vietnamese: SAQ-A (~22 requirements) vs SAQ-D (~300+ requirements, $200K/year). Stripe Elements inject một iframe từ domain của Stripe — raw PAN không bao giờ chạm domain của bạn. JS của bạn chỉ nhận token `pm_xxx`. Đây là cách giữ bạn trong SAQ-A. Nếu bạn tự tạo `<input>` cho card number → PAN qua server của bạn → SAQ-D scope explosion.

**💡 Interview Signal:**

- ✅ Strong: Explains iframe isolation mechanism, quantifies the compliance difference (22 vs 300+), knows Adyen uses same pattern, mentions CVV is also in iframe
- ❌ Weak: "Stripe handles security" — vague; need to explain WHY (iframe domain isolation)

---

### 🔴 Q9: 3D Secure 2 / SCA — frictionless vs challenge flow?

**A:**

**3DS2 là gì**: Authentication protocol cho card-not-present transactions. Card issuer (ngân hàng) authenticate cardholder — merchant không cần làm gì thêm ngoài việc trigger flow.

**Flow chi tiết**:

```
1. Merchant initiates: stripe.confirmCardPayment(clientSecret)
2. Stripe sends to card network: paymentIntent + device data
   Device data: browser fingerprint, IP, user agent, shipping address match, etc.

3. Card issuer runs risk engine:
   - Transaction amount
   - Device fingerprint match with cardholder history
   - IP geo vs billing address
   - Velocity (how many transactions today)
   - Behavioral biometrics (typing speed, mouse patterns)

4a. LOW RISK → Frictionless Authentication:
   ├── Issuer approves without user input
   ├── Payment proceeds silently
   └── User sees: payment succeeded immediately

4b. HIGH RISK → Challenge Flow:
   ├── Issuer opens challenge iframe (embedded by Stripe in your page)
   ├── User completes: OTP via SMS, app notification, biometric
   ├── Issuer responds: approved or declined
   └── Payment proceeds or fails
```

```typescript
// Stripe handles 3DS2 automatically via confirmCardPayment
const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: { card: cardElement, billing_details: { name: "Nguyen Van A" } },
});

if (error?.code === "payment_intent_authentication_failure") {
  // 3DS challenge was attempted but failed (wrong OTP, user cancelled)
  showError("Xác thực 3D Secure thất bại. Vui lòng thử lại.");
} else if (paymentIntent?.status === "requires_action") {
  // This shouldn't happen with confirmCardPayment — Stripe handles it
  // But possible in manual flows
}
```

**EU PSD2 / SCA Requirements**:

```
Mandatory for EU cards: Strong Customer Authentication (SCA) on:
- Any online card transaction
- Exceptions: <€30, recurring (first charge needs SCA), merchant-initiated

SCA = 2 of 3 factors:
  Knowledge: PIN/password
  Possession: Phone OTP, hardware token
  Inherence: Face ID, Touch ID, voice

3DS2 implements SCA via frictionless (bank approves without 2FA)
or challenge (bank requires 2FA) depending on risk score.
```

Vietnamese: 3DS2 là authentication protocol — card issuer quyết định risk của transaction. Low risk → frictionless (auto-approve, no user action). High risk → challenge (OTP, biometric). Stripe/Adyen handle 3DS2 flow tự động qua `confirmCardPayment`. EU PSD2 yêu cầu SCA (2 trong 3 factor) cho hầu hết card transactions — 3DS2 là cơ chế implement SCA. Merchant không cần implement authentication logic — chỉ cần handle `paymentIntent.status` sau khi flow complete.

**💡 Interview Signal:**

- ✅ Strong: Explains risk engine inputs (device fingerprint, velocity, geo), names the two flows (frictionless/challenge), knows EU PSD2 mandate and exemptions, handles error codes correctly
- ❌ Weak: "3DS is when you enter OTP" — correct for challenge flow only, misses that most 3DS2 is frictionless

---

### 🔴 Q10: Vietnamese payment integrations — MoMo, ZaloPay, VNPay — sự khác biệt và pitfalls?

**A:**

**MoMo** (e-wallet, 31M users VN):

```
Payment flows:
1. Deep-link (mobile): momo://... → opens MoMo app directly
2. In-app webview: window.location.href inside WebView
3. QR code (desktop/retail)
4. MoMo Widget (embed)

Signature: HMAC-SHA256 (key from MoMo partner portal)
Callback: IPN (Instant Payment Notification) to your server
         + redirect returnUrl to your client

Critical pitfall: Never trust returnUrl params alone
  → Attacker can modify resultCode=0 in URL
  → Always verify IPN from MoMo server + check HMAC signature
  → Cross-check orderId in YOUR database

Android WebView pitfall:
  → WebView may block momo:// scheme
  → Solution: Intent URL scheme
     window.location.href = "intent://pay?...#Intent;scheme=momo;package=com.mservice.momotransfer;end"
```

**ZaloPay** (backed by Zalo/VNG, 10M+ users):

```
Payment flows:
1. Order URL redirect
2. ZaloPay SDK (React Native)
3. QR code

Signatures:
  Request: HMAC-SHA256 with key1
  Callback: HMAC-SHA256 with key2 (DIFFERENT from key1!)
  → Common bug: using key1 to verify callback → always fails

Callback fields:
  zp_trans_id, zp_amount, zp_discount_amount, zp_trans_time
  verify_mac = HMAC-SHA256(key2, data)
```

**VNPay** (bank redirect, widest ATM coverage):

```
Flow: Always redirect to vnpay.vn domain
      User enters card/ATM info on VNPay's servers
      VNPay redirects back to your returnUrl

Signature: HMAC-SHA512 of SORTED query params + secretKey
Critical: params must be sorted ALPHABETICALLY before hashing
           vnp_Amount, vnp_BankCode, vnp_BankTranNo... (sorted)

Multiple hash algorithms exist in older docs — always use SHA-512
Common bug: include vnp_SecureHash in the hash calculation → always fails
→ Strip vnp_SecureHash before building hash string
```

```typescript
// Common Vietnamese payment bugs summary:
const pitfalls = [
  "MoMo: Trusting returnUrl result without IPN verification",
  "MoMo: Not handling Android WebView deep-link with Intent scheme",
  "ZaloPay: Using key1 (request) instead of key2 (callback) for verify",
  "VNPay: Including vnp_SecureHash in signature params (must exclude)",
  "VNPay: Not sorting params alphabetically before HMAC",
  "All: Showing success page before server confirms webhook",
  "All: Not handling timeout (user opens app, payment pending 15min)",
];
```

Vietnamese: Ba cổng thanh toán VN phổ biến — mỗi cái có quirk riêng. MoMo: deep-link mobile, verify IPN chứ không chỉ returnUrl, Android WebView cần Intent scheme. ZaloPay: key1 cho request, key2 cho callback — dùng nhầm là bug. VNPay: sort params alphabetically, exclude vnp_SecureHash trước khi hash, SHA-512. Quy tắc vàng cho tất cả: **không bao giờ tin client-side success — luôn verify server webhook/IPN trước khi update order status**.

**💡 Interview Signal:**

- ✅ Strong: Knows each gateway's signature algorithm, mentions key1/key2 distinction for ZaloPay, explains Android Intent URL fix, emphasizes IPN over returnUrl
- ❌ Weak: "Use their official SDK" — correct start but doesn't address verification, signature, and edge cases interviewers care about

---

## Anti-Patterns / Lỗi Thường Gặp

### ❌ Anti-Pattern 1: Hash Password Client-Side và Gửi Hash Lên Server

```typescript
// ❌ WRONG — hash IS the password
async function badLogin(password: string) {
  const hash = await sha256(password);
  fetch("/login", { body: JSON.stringify({ password: hash }) });
  // Server stores hash in DB without bcrypt
  // Attacker intercepts traffic → gets hash → replay attack works
  // Rainbow table on SHA-256(password) → fast crack
}

// ✅ CORRECT — send password over HTTPS, hash SERVER-SIDE
async function goodLogin(password: string) {
  fetch("/login", { body: JSON.stringify({ password }) });
  // Server: bcrypt.hash(password, 12) → stores bcrypt hash
  // HTTPS protects in transit; bcrypt protects at rest
}

// ✅ EXCEPTION: Password manager model (Bitwarden)
// Client-side PBKDF2 → masterKey
// Then ALSO hash before sending: HMAC(masterKey, email)
// Server also bcrypt the received hash
// Double-hashing: protects from server breach exposing master password
```

**Tại sao sai**: SHA-256(password) = 64-char hex string. Nếu server store raw hash, attacker steal DB → có thể **directly authenticate** bằng hash (replay attack). Server không bcrypt được hash vì hash không phải password nữa. Rainbow tables crack SHA-256 trong giây.

### ❌ Anti-Pattern 2: Store AES Keys trong localStorage

```typescript
// ❌ WRONG — any XSS can read this
const key = await crypto.subtle.generateKey(/* ... */, true, ["encrypt"]);
const exported = await crypto.subtle.exportKey("raw", key);
localStorage.setItem("encKey", btoa(String.fromCharCode(...new Uint8Array(exported))));
// XSS: atob(localStorage.getItem("encKey")) → raw key bytes → decrypt everything

// ✅ CORRECT — IndexedDB + non-extractable
const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  false,   // non-extractable!
  ["encrypt", "decrypt"]
);
await indexedDB_put("keys", key, "myKey");
// XSS cannot exportKey() — DOMException thrown
```

### ❌ Anti-Pattern 3: Wrong Encrypt-then-MAC Order

```typescript
// ❌ WRONG: MAC-then-Encrypt
// Sign plaintext → encrypt (signature + plaintext)
// Problem: verifying MAC requires decryption first → padding oracle attacks
const mac = await hmac(key, plaintext);
const ciphertext = await aesEncrypt(encKey, plaintext + mac);

// ❌ ALSO WRONG: Encrypt-and-MAC (parallel)
// Sign plaintext AND encrypt separately
// Signature may leak plaintext info

// ✅ CORRECT: Encrypt-then-MAC (or use AES-GCM which does both)
// Encrypt first → MAC the ciphertext
// Verify MAC without decryption → reject tampered data early
const ciphertext = await aesEncrypt(encKey, plaintext);
const mac = await hmac(macKey, ciphertext);
// OR better: Just use AES-GCM — authenticated encryption built-in
```

**Rule**: `AES-GCM > Encrypt-then-MAC(AES-CBC) > anything else`. AES-GCM includes authentication tag — no separate MAC needed.

### ❌ Anti-Pattern 4: Touching Raw Card PAN in Your Domain

```typescript
// ❌ CATASTROPHIC — PCI-DSS SAQ-D scope explosion
<form onSubmit={handleSubmit}>
  <input
    type="text"
    value={cardNumber}                  // RAW PAN in React state
    onChange={(e) => setCardNumber(e.target.value)}
    placeholder="4242 4242 4242 4242"
  />
  <button type="submit">Pay</button>
</form>

async function handleSubmit() {
  await fetch("/api/charge", {
    body: JSON.stringify({ cardNumber, cvv, expiry }), // PAN to your server
    // Your server is now PCI-DSS SAQ-D scope
    // ~300 requirements, $200K/year compliance cost
    // One breach = massive fines + reputational damage
  });
}

// ✅ CORRECT: Stripe Elements iframe captures PAN in Stripe's domain
<div id="card-element" />  // Stripe's iframe — PAN stays in Stripe domain
// Your server receives: paymentMethod.id = "pm_xxx" token only
```

### ❌ Anti-Pattern 5: Trust Client-Side Payment Success

```typescript
// ❌ WRONG: Show success based on client callback alone
async function handlePaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("resultCode") === "0") {
    // Attacker modified URL resultCode → fake success!
    showSuccessPage();
    await updateOrderStatus("paid"); // Order updated without real payment!
  }
}

// ✅ CORRECT: Server verifies webhook before showing success
// Client:
async function handlePaymentReturn() {
  const params = Object.fromEntries(new URLSearchParams(window.location.search));
  const orderId = params["orderId"];
  // Ask YOUR server to check order status (not the returnUrl params)
  const { status } = await fetch(`/api/orders/${orderId}/status`).then((r) => r.json());
  if (status === "paid") {
    // Server verified IPN/webhook and updated DB
    showSuccessPage();
  } else {
    showPendingPage(); // Payment may still process async
  }
}
// Server: receives IPN → verifies signature → updates DB → client polls
```

### ❌ Anti-Pattern 6: Using Math.random() for Crypto Purposes

```typescript
// ❌ WRONG — Math.random() is NOT cryptographically secure
function generateSessionToken() {
  return Math.random().toString(36).slice(2); // Predictable!
}
function generateIV() {
  return new Uint8Array(12).map(() => Math.floor(Math.random() * 256)); // ❌
}

// ✅ CORRECT — crypto.getRandomValues() is CSPRNG
function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12)); // ✅ CSPRNG
}
```

**Tại sao Math.random() nguy hiểm**: V8 engine dùng xorshift128 — nếu attacker observe một số Math.random() outputs, họ có thể predict toàn bộ sequence. IV predictable → IV reuse attack. Token predictable → session hijack.

### ❌ Anti-Pattern 7: Encrypt-then-Sign vs Sign-then-Encrypt confusion

```
Scenario: Alice sends encrypted + signed message to Bob

❌ Sign-then-Encrypt:
  1. Alice signs plaintext → signature
  2. Alice encrypts (plaintext + signature) for Bob
  Problem: Bob can strip Alice's signature and re-encrypt for Charlie
           → Charlie thinks Alice signed this message for Charlie (surreptitious forwarding)

✅ Encrypt-then-Sign:
  1. Alice encrypts plaintext for Bob → ciphertext
  2. Alice signs ciphertext
  Result: Signature is over the ciphertext → binding to recipient context
  Bob can verify Alice signed THIS ciphertext (not a repackaged one)

Signal protocol handles this correctly via X3DH binding.
```

---

## 🧠 Memory Hook / Gợi Nhớ

**CRYPTO**: **"Hash No-Key, MAC Shared-Key, Sig Split-Key"**

- No key → Hash (digest)
- Shared key → MAC (HMAC)
- Split key (private sign / public verify) → Digital Signature

**PAYMENT**: **"PAN in iframe = SAQ-A, PAN on your server = SAQ-D = Disaster"**

**KEY STORAGE**: **"IndexedDB yes, localStorage no, non-extractable always"**

**VN PAYMENTS** 🇻🇳: **"Sort-Sign-Verify — Signature phải verify server-side, không bao giờ trust returnUrl"**

**CRYPTO ORDER**: **"AES-GCM or Encrypt-then-MAC, never MAC-then-Encrypt"**

---

## Q&A Summary Table / Bảng Tóm Tắt

| #   | Câu hỏi                           | Difficulty | Answer anchor                                               |
| --- | --------------------------------- | ---------- | ----------------------------------------------------------- |
| Q1  | Web Crypto vs CryptoJS/libsodium  | 🟢         | 0KB bundle, non-extractable keys, audited                   |
| Q2  | Hash vs MAC vs Digital Signature  | 🟢         | No-key / Shared-key / Split-key                             |
| Q3  | Generate & store CryptoKey safely | 🟡         | `extractable:false` + IndexedDB                             |
| Q4  | PBKDF2 vs Argon2 tradeoffs        | 🟡         | PBKDF2 native; Argon2 memory-hard but WASM                  |
| Q5  | SRI — when it helps, when not     | 🟡         | CDN attacks ✅; XSS inline, same-origin ❌                  |
| Q6  | Payment Request API reality       | 🟡         | Enhancement only; `canMakePayment()` check; always fallback |
| Q7  | E2EE chat design                  | 🔴         | X3DH + Double Ratchet + Sender Keys                         |
| Q8  | PCI-DSS scope & tokenization      | 🔴         | iframe isolation → SAQ-A; raw PAN → SAQ-D                   |
| Q9  | 3D Secure 2 / SCA                 | 🔴         | Frictionless vs challenge; EU PSD2 mandate                  |
| Q10 | VN payment integrations           | 🔴         | Sort+HMAC verify server-side; key1/key2; Intent URL         |

---

## Cold Call / Câu Hỏi Nhanh

Interviewer có thể hỏi các câu này trong 30 giây đầu để gauge knowledge:

**1.** _"Tại sao `Math.random()` không dùng được cho crypto?"_
→ Predictable PRNG (xorshift128), attacker can predict sequence. Dùng `crypto.getRandomValues()`.

**2.** _"AES-GCM khác AES-CBC thế nào?"_
→ GCM là authenticated encryption — bao gồm authentication tag. CBC là encryption only — cần thêm HMAC riêng (Encrypt-then-MAC). GCM tốt hơn.

**3.** _"Non-extractable CryptoKey có nghĩa là gì?"_
→ Key tồn tại trong browser memory nhưng `crypto.subtle.exportKey()` throw exception. XSS không steal được raw bytes. Key vẫn dùng được cho encrypt/decrypt operations.

**4.** _"Tại sao MoMo returnUrl không đủ tin tưởng?"_
→ URL params có thể bị attacker modify. Chỉ tin IPN (server-to-server) có HMAC-SHA256 signature từ MoMo server.

**5.** _"Stripe Elements giúp gì về PCI-DSS?"_
→ Card input trong Stripe's iframe — PAN không bao giờ vào domain của merchant. SAQ-A (22 requirements) thay vì SAQ-D (300+ requirements).

---

## Self-Check / Tự Kiểm Tra

Sau khi đọc xong bài này, bạn nên trả lời được:

- [ ] Viết TypeScript code tạo AES-GCM key non-extractable và store vào IndexedDB
- [ ] Giải thích tại sao `AES-GCM > Encrypt-then-MAC(AES-CBC) > MAC-then-Encrypt`
- [ ] Implement HMAC-SHA512 verification cho VNPay return params từ scratch
- [ ] Describe X3DH key exchange flow (tên 4 ECDH operations)
- [ ] Explain SAQ-A vs SAQ-D scope với ví dụ cụ thể về iframe isolation
- [ ] List 3 pitfalls khi verify MoMo payment (returnUrl trust, Android WebView, IPN)
- [ ] Know khi nào dùng PBKDF2 vs Argon2 vs HKDF
- [ ] Biết `Math.random()` không an toàn và thay thế bằng gì
- [ ] Mô tả frictionless vs challenge flow của 3DS2
- [ ] List 3 things SRI KHÔNG protect against

---

> **See also**: [XSS & CSRF Defense](./01-xss-csrf.md) | [Content Security Policy](./02-csp.md) | [Auth Patterns (JWT, OAuth, Sessions)](./03-auth-patterns.md) | [FE System Design](../08-fe-system-design/) | [Browser Performance](../06-browser-performance/)
