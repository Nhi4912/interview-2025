# Cryptography and Protocols / Mật Mã Học và Giao Thức Bảo Mật

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Security Fundamentals](./01-security-fundamentals.md) | [Web Security & OWASP](./03-web-security-owasp.md) | [Modern Auth](./04-modern-auth-patterns.md)

## Real-World Scenario / Tình Huống Thực Tế

**VNG ZaloPay HTTPS incident (thực tế):** Developer mới join team tự hỏi "tại sao không dùng HTTP cho internal service-to-service? Chỉ nội bộ mà". 3 tháng sau, security audit phát hiện man-in-the-middle attack từ compromised internal server — API keys bị intercept qua HTTP. Fix: mTLS cho tất cả service-to-service. **Root cause:** không hiểu TLS không chỉ encrypt mà còn authenticate — HTTPS không chỉ là "HTTPS = private", mà là "HTTPS = encrypted + authenticated".

**Bài học:** Cryptography không phải academic — nó quyết định có thể bị exploit hay không. Biết TLS handshake, certificate validation, và khi nào dùng symmetric vs asymmetric là kiến thức bảo vệ production system.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Symmetric encryption giống khóa nhà — cùng chìa khóa mở và khóa (nhanh, nhưng phải chia sẻ chìa khóa an toàn). Asymmetric giống hộp thư với ổ khóa: ai cũng có thể bỏ thư vào (public key encrypt), chỉ bạn mới mở được (private key decrypt). TLS dùng asymmetric để trao đổi session key, sau đó dùng symmetric (nhanh hơn) cho data transfer.

**Why it matters:** HTTPS, JWT signing, password hashing, API keys — tất cả dùng cryptography. Hiểu sai → dùng sai → security hole.

## Overview / Tổng Quan

- Tài liệu trình bày nền tảng mật mã học và giao thức bảo mật cho phỏng vấn backend/frontend.
- Covers: symmetric/asymmetric encryption, TLS, hashing, digital signatures, PKI.

## Visual Overview / Sơ Đồ Tổng Quan

### Symmetric vs Asymmetric Encryption

```
SYMMETRIC (AES, ChaCha20):           ASYMMETRIC (RSA, ECC):
  Same key for encrypt + decrypt       Key pair: public + private

  Sender     Key     Receiver           Sender        Receiver
     │       🔑        │                   │           🔑🔑
     │  encrypt(msg)   │                msg encrypted  pub  priv
     │────────────────►│                with receiver's PUBLIC key
     │    encrypted    │                Only receiver's PRIVATE key
     │◄────────────────│                can decrypt
     │  decrypt(enc)   │
                                       Pros: no shared secret needed
  Pros: FAST (hardware AES)            Cons: 1000x SLOWER than symmetric
  Cons: How to share the key safely?

  AES-256-GCM: gold standard for data at rest + in transit
  ChaCha20-Poly1305: AES alternative (better on mobile without hardware AES)
```

### TLS Handshake (TLS 1.3 simplified)

```
CLIENT                                     SERVER
  │                                           │
  │── ClientHello ──────────────────────────►│
  │   {TLS version, cipher suites,           │
  │    random, key_share (DH public key)}    │
  │                                           │
  │◄── ServerHello ─────────────────────────│
  │    {cipher chosen, server key_share}     │
  │                                           │
  │◄── Certificate ─────────────────────────│
  │    {server's X.509 cert}                 │
  │                                           │
  │◄── CertificateVerify ───────────────────│
  │    {signature proving server has         │
  │     private key matching cert}           │
  │                                           │
  │◄── Finished ────────────────────────────│
  │                                           │
  │ Both sides now compute:                  │
  │ session_key = HKDF(client_share ×        │
  │                    server_share)          │
  │ (ECDH key exchange — same shared secret) │
  │                                           │
  │──── Finished ──────────────────────────►│
  │                                           │
  │══ Encrypted Application Data ═══════════│

TLS 1.3 vs 1.2:
  1.2: 2 round trips before data
  1.3: 1 round trip (0-RTT for resumption!)
  1.3: Removed weak ciphers (RC4, 3DES, RSA key exchange)
```

### Hashing vs Encryption

```
HASHING:                         ENCRYPTION:
  One-way — cannot reverse         Two-way — can decrypt with key
  Same input → always same hash    Same input → different output (IV/nonce)

  Use for:                         Use for:
  - Password storage               - Data at rest/transit
  - Data integrity check           - Reversible secrets
  - Digital signatures

  MD5:    128-bit, BROKEN (collision found)
  SHA-1:  160-bit, DEPRECATED
  SHA-256: 256-bit, SECURE ✓
  SHA-3:  256-bit+, SECURE ✓ (different algorithm family)

  Password hashing (special — slow by design!):
  bcrypt, argon2id, scrypt — add salt + iterations
  WHY slow: makes brute-force expensive
  NEVER use raw SHA-256 for passwords!
```

---

## Symmetric Encryption (AES, DES)

> 🧠 **Memory Hook:** AES như ổ khóa cửa nhà — cùng một chìa để khóa và mở, ai có chìa đó thì vào được.

**Tại sao tồn tại? / Why does this exist?**

Dữ liệu cần được bảo vệ khỏi người không có quyền đọc — cần mã hóa. Nhưng mã hóa bất đối xứng quá chậm cho dữ liệu lớn. Symmetric encryption giải quyết bài toán tốc độ với cùng một key để encrypt/decrypt.
→ **Why?** Vì AES-256 có thể encrypt GB/s nhờ hardware (AES-NI instructions), trong khi RSA chỉ xử lý vài KB/s.
→ **Why?** Vì toán học symmetric (substitution-permutation network) đơn giản hơn nhiều so với asymmetric (factoring large primes), nên nhanh hơn 1000x.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến ổ khóa cửa nhà. Bạn dùng cùng một chìa khóa để khóa cửa khi ra ngoài và mở cửa khi về. Nếu ai có chìa đó, họ cũng vào được nhà. AES hoạt động y như vậy — cùng một "chìa" (secret key) để mã hóa và giải mã dữ liệu. Vấn đề không phải là thuật toán yếu — mà là làm sao truyền chìa khóa đó an toàn cho người kia ban đầu mà không bị lộ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
AES-256-GCM Encryption:

  plaintext + key(256-bit) + nonce(96-bit)
         │
         ▼
  ┌─────────────────┐
  │   AES-256-GCM   │ ← key bí mật (256-bit)
  │   (AEAD mode)   │ ← nonce UNIQUE per message!
  └─────────────────┘
         │
         ▼
  ciphertext + auth_tag(128-bit)

  ✅ auth_tag → chứng minh data không bị tamper (AEAD)
  ❌ Reuse nonce + same key → mất cả encrypt lẫn integrity!

So sánh chế độ (modes):
  ECB: ❌ Same plaintext → same ciphertext (pattern leak)
  CBC: ⚠️  Padding oracle attacks possible
  GCM: ✅  AEAD, fast, parallelizable → gold standard
  CTR: ✅  Fast, nhưng không có authentication (thêm HMAC riêng)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Nonce reuse với GCM**: Dùng lại nonce + key = mất hoàn toàn confidentiality AND integrity cùng lúc. Giải pháp: random nonce 96-bit mỗi message.
- **ECB mode**: Mỗi block encrypt độc lập → pattern leak — ảnh bitmap mã hóa bằng ECB vẫn hiện hình. Never use ECB.
- **ChaCha20-Poly1305**: Alternative tốt trên mobile/IoT không có hardware AES — nhanh hơn AES khi không có AES-NI instructions.
- **Key size**: DES (56-bit) bị brute-force từ 1999. AES-128 vẫn secure, AES-256 preferred cho quantum resistance tương lai.

### Overview / Tổng Quan

- Mã hóa đối xứng dùng cùng key để encrypt/decrypt, hiệu năng cao cho dữ liệu lớn.

### Explanation / Giải thích

- Khi trả lời phỏng vấn, hãy phân biệt rõ security goals: confidentiality, integrity, authenticity, availability.
- Nên mô tả attack surface và failure mode nếu vận hành sai (nonce reuse, weak key, misconfigured ciphers, expired cert).

### Example / Ví dụ

- Ví dụ 1: API service mã hóa dữ liệu nhạy cảm bằng AES-GCM với nonce unique per message.
- Ví dụ 2: Authentication server ký JWT bằng private key và publish public key qua JWKS.
- Ví dụ 3: Hệ thống dùng KMS để envelope encryption và tự động key rotation.

### Technical Checklist

- Thuật toán mạnh + chế độ an toàn + key size hợp chuẩn + lifecycle quản lý rõ ràng.
- Có monitoring cho certificate expiry, handshake failure spike, và unusual signature verification errors.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm             | Tại sao sai                                                   | Đúng là                         |
| ------------------- | ------------------------------------------------------------- | ------------------------------- |
| Dùng AES-ECB mode   | Same plaintext → same ciphertext, pattern leak rõ ràng        | Dùng AES-256-GCM (AEAD)         |
| Reuse nonce với GCM | Mất cả confidentiality và integrity đồng thời                 | Random nonce 96-bit mỗi message |
| Dùng DES hoặc 3DES  | 56-bit key đã bị brute-force từ 1999, 3DES chậm và deprecated | AES-256-GCM là gold standard    |

**🎯 Interview Pattern:**

- Khi thấy: "encrypt data at rest" hoặc "bulk data encryption"
- → Nhớ đến: Symmetric encryption (AES-256-GCM)
- → Mở đầu: "Tôi dùng AES-256-GCM vì nó là AEAD — vừa encrypt vừa authenticate integrity. Key lưu trong KMS, nonce random 96-bit mỗi message để tránh nonce reuse."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Security Fundamentals](./01-security-fundamentals.md) — CIA Triad, confidentiality là gì
- ➡️ Để hiểu tiếp: [TLS Handshake and HTTPS](#tls-handshake-and-https) — TLS dùng symmetric encryption sau khi exchange session key

## Asymmetric Cryptography (RSA, ECDSA)

> 🧠 **Memory Hook:** Asymmetric như hộp thư có khe bỏ thư — ai cũng bỏ vào được (public key), chỉ chủ nhân mới mở được (private key).

**Tại sao tồn tại? / Why does this exist?**

Symmetric encryption cần cả hai bên biết cùng một secret key — nhưng làm sao trao đổi key đó lần đầu tiên qua mạng không an toàn? Asymmetric cryptography giải quyết "key distribution problem" bằng cặp public/private key.
→ **Why?** Vì nếu phải gặp nhau trực tiếp để trao đổi key, internet sẽ không thể scale — bạn không thể gặp mặt Google trước khi browse.
→ **Why?** Vì toán học số học (discrete logarithm, integer factorization) tạo ra "trapdoor function" — dễ tính một chiều, cực khó đảo ngược với máy tính hiện tại.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến hộp thư trước nhà. Cái khe bỏ thư là public — ai cũng có thể bỏ thư vào (encrypt với public key). Nhưng chỉ bạn mới có chìa khóa mở hộp thư để đọc thư (decrypt với private key). Ngược lại, nếu bạn muốn ký tên xác nhận một tài liệu, bạn dùng con dấu riêng (private key sign), và ai cũng có thể kiểm tra con dấu đó là của bạn (public key verify).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
RSA Key Pair (simplified math):
    p, q = hai số nguyên tố lớn
    n = p × q        ← public modulus
    e = 65537        ← public exponent
    d = private exp  ← computed từ p,q,e (khó nếu không có p,q)

  Encrypt:  ciphertext = plaintext^e mod n  (ai cũng làm với public key)
  Decrypt:  plaintext  = ciphertext^d mod n  (chỉ private key holder)

So sánh thuật toán:
  ┌─────────┬──────────────┬──────────────────────────────┐
  │ Algo    │ Use Case     │ Notes                        │
  ├─────────┼──────────────┼──────────────────────────────┤
  │ RSA     │ Sign + Enc   │ 2048-bit min, chậm, legacy OK│
  │ ECDSA   │ Sign only    │ 256-bit ≈ 3072-bit RSA       │
  │ ECDH    │ Key exchange │ Dùng trong TLS (ephemeral)   │
  └─────────┴──────────────┴──────────────────────────────┘

TLS hybrid approach:
  Asymmetric (ECDH) → exchange symmetric session key
  Symmetric (AES-GCM) → encrypt actual data
  → Best of both worlds: security + performance!
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **RSA padding**: Raw RSA (textbook RSA) không an toàn — malleable. Phải dùng OAEP padding cho encryption, PSS cho signatures.
- **Private key compromise**: Ai có private key → decrypt ALL past messages (nếu không có forward secrecy từ ephemeral ECDH).
- **ECDSA nonce reuse**: Dùng same nonce k hai lần khi ký → private key bị extract về mặt toán học. PS3 bị hack 2010 vì lỗi này.
- **Quantum threat**: Shor's algorithm phá RSA/ECC khi quantum computers đủ mạnh. Post-quantum: Kyber (key enc), Dilithium (signatures).

### Overview / Tổng Quan

- Mật mã khóa công khai dùng cặp public/private key để xác thực và trao đổi bí mật.

### Explanation / Giải thích

- Khi trả lời phỏng vấn, hãy phân biệt rõ security goals: confidentiality, integrity, authenticity, availability.
- Nên mô tả attack surface và failure mode nếu vận hành sai (nonce reuse, weak key, misconfigured ciphers, expired cert).

### Example / Ví dụ

- Ví dụ 1: API service mã hóa dữ liệu nhạy cảm bằng AES-GCM với nonce unique per message.
- Ví dụ 2: Authentication server ký JWT bằng private key và publish public key qua JWKS.
- Ví dụ 3: Hệ thống dùng KMS để envelope encryption và tự động key rotation.

### Technical Checklist

- Thuật toán mạnh + chế độ an toàn + key size hợp chuẩn + lifecycle quản lý rõ ràng.
- Có monitoring cho certificate expiry, handshake failure spike, và unusual signature verification errors.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                           | Đúng là                                       |
| ------------------------------------ | ----------------------------------------------------- | --------------------------------------------- |
| Encrypt large data với RSA trực tiếp | RSA chậm hơn AES 1000x, giới hạn kích thước plaintext | Hybrid: RSA encrypt AES key, AES encrypt data |
| Dùng RSA-1024                        | Factorable bởi modern computers, NIST deprecated 2010 | RSA-2048 minimum, prefer ECDSA P-256          |
| Textbook RSA không padding           | Malleable, vulnerable to chosen-plaintext attack      | RSA-OAEP cho encrypt, RSA-PSS cho signing     |

**🎯 Interview Pattern:**

- Khi thấy: "key exchange" hoặc "authenticate without shared secret" hoặc "JWT signing"
- → Nhớ đến: Asymmetric cryptography — ECDH cho key exchange, ECDSA/RSA cho signatures
- → Mở đầu: "Asymmetric giải quyết key distribution problem. TLS dùng ECDH ephemeral để exchange session key, sau đó AES-GCM encrypt data — hybrid approach tốt nhất cả hai thế giới: security và performance."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Symmetric Encryption](#symmetric-encryption-aes-des) — tại sao cần exchange key trước
- ➡️ Để hiểu tiếp: [Digital Signatures](#digital-signatures) — asymmetric dùng để ký, [PKI](#public-key-infrastructure-pki) để quản lý keys

## Hashing and Password Hashing (SHA, bcrypt, argon2)

> 🧠 **Memory Hook:** Hash như máy xay sinh tố — bỏ trái cây vào ra sinh tố (một chiều), không thể reverse sinh tố thành trái cây ban đầu.

**Tại sao tồn tại? / Why does this exist?**

Cần kiểm tra tính toàn vẹn của dữ liệu mà không cần lưu bản gốc. Và cần lưu password người dùng mà ngay cả database admin cũng không đọc được. Hashing giải quyết cả hai bài toán này — một chiều, không thể đảo ngược.
→ **Why?** Vì nếu lưu password dạng plaintext, một data breach expose toàn bộ password của mọi user ngay lập tức.
→ **Why?** Vì nếu lưu dạng encrypted, ai có decryption key cũng đọc được — nên one-way hash là đúng; server không cần biết password thật, chỉ cần verify.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến máy xay sinh tố. Bạn bỏ chuối + dâu vào, ra một ly sinh tố đặc trưng. Nhưng nhìn vào ly sinh tố, bạn không thể biết chính xác đã bỏ bao nhiêu chuối, bao nhiêu dâu vào. Hash cũng vậy — bỏ password vào ra một chuỗi ký tự cố định, không thể reverse. Khi user đăng nhập, bạn hash password họ nhập rồi so sánh với hash đã lưu — khớp thì đúng password.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Regular Hash (SHA-256) — Rất NHANH:
  "password123" → SHA-256 → "ef92b778bafe771..."
  "password124" → SHA-256 → "c775e7b757ede..."  ← avalanche effect

  ❌ Vấn đề: GPU compute 10 TỶ SHA-256/giây
  → Brute-force password 8 ký tự trong vài giây!

Password Hash (Argon2id/bcrypt) — Cố tình CHẬM:
  "password123" + salt(random) + cost_factor
         │
         ▼
  ┌──────────────────────┐
  │  Argon2id            │ ← memory-hard: 64MB RAM required
  │  bcrypt (12 rounds)  │ ← ~300ms per hash (tunable)
  └──────────────────────┘
         │
         ▼
  "$argon2id$v=19$m=65536..." (hash với salt embedded)

  ✅ Same password + same salt → same output (verify OK)
  ✅ Different random salt per user → rainbow tables vô dụng
  ✅ Cost factor tăng theo thời gian khi hardware mạnh hơn

Comparison:
  MD5:     128-bit, BROKEN (collision)  → Never use
  SHA-1:   160-bit, DEPRECATED          → Never use for security
  SHA-256: 256-bit, secure, FAST        → OK cho integrity, KHÔNG dùng cho passwords
  bcrypt:  slow, 72-char limit          → OK cho passwords (legacy)
  Argon2id: slow + memory-hard          → BEST choice cho passwords hiện tại
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **SHA-256 cho password**: Sai! GPU compute 10B SHA-256/giây. Brute-force dễ dàng. Phải dùng Argon2id hoặc bcrypt.
- **Rainbow table attack**: Precomputed hash table cho common passwords. Salt ngẫu nhiên per-user phá vỡ hoàn toàn rainbow tables.
- **Bcrypt 72-char limit**: bcrypt silently truncates password ở 72 ký tự. Attacker có thể khai thác nếu passwords dài. Argon2 không có giới hạn này.
- **Cost factor tuning**: Target ~300ms per hash là hợp lý — đủ chậm để brute-force tốn kém, đủ nhanh cho UX login bình thường.

### Overview / Tổng Quan

- Hash phục vụ integrity; password hashing cần thuật toán chậm và memory-hard.

### Explanation / Giải thích

- Khi trả lời phỏng vấn, hãy phân biệt rõ security goals: confidentiality, integrity, authenticity, availability.
- Nên mô tả attack surface và failure mode nếu vận hành sai (nonce reuse, weak key, misconfigured ciphers, expired cert).

### Example / Ví dụ

- Ví dụ 1: API service mã hóa dữ liệu nhạy cảm bằng AES-GCM với nonce unique per message.
- Ví dụ 2: Authentication server ký JWT bằng private key và publish public key qua JWKS.
- Ví dụ 3: Hệ thống dùng KMS để envelope encryption và tự động key rotation.

### Technical Checklist

- Thuật toán mạnh + chế độ an toàn + key size hợp chuẩn + lifecycle quản lý rõ ràng.
- Có monitoring cho certificate expiry, handshake failure spike, và unusual signature verification errors.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                          | Đúng là                                               |
| ----------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| Dùng SHA-256 thuần để hash password | Quá nhanh: GPU brute-force hàng tỷ hashes/giây                       | Dùng Argon2id hoặc bcrypt với cost factor cao         |
| Không salt password hash            | Rainbow table attack precompute được hash của common passwords       | Salt unique random 128-bit cho mỗi user               |
| MD5/SHA-1 cho integrity check       | Collision attack đã được demonstrate — hai file khác nhau, cùng hash | SHA-256 minimum cho security, SHA-3 nếu muốn paranoid |

**🎯 Interview Pattern:**

- Khi thấy: "store user passwords" hoặc "verify file integrity" hoặc "data tampering detection"
- → Nhớ đến: Hash (SHA-256 cho integrity, Argon2id cho passwords — hai use case khác nhau hoàn toàn)
- → Mở đầu: "Passwords phải dùng Argon2id — slow by design và memory-hard, với random salt per-user. SHA-256 chỉ cho integrity check như file checksums hoặc trong digital signatures, không bao giờ cho passwords."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Security Fundamentals](./01-security-fundamentals.md) — integrity là gì trong CIA Triad
- ➡️ Để hiểu tiếp: [Digital Signatures](#digital-signatures) — hash là component cốt lõi trong signature scheme

## Digital Signatures

> 🧠 **Memory Hook:** Chữ ký số như con dấu công chứng — ai cũng nhìn thấy và verify được, nhưng chỉ người có con dấu mới đóng được.

**Tại sao tồn tại? / Why does this exist?**

Cần chứng minh rằng dữ liệu đến từ đúng người và chưa bị thay đổi — mà không cần chia sẻ bí mật. Digital signatures kết hợp hashing + asymmetric cryptography để đạt authenticity và non-repudiation (không thể chối bỏ).
→ **Why?** Vì chỉ encrypt không đủ — encryption ẩn nội dung nhưng không chứng minh ai gửi; cần signature để verify identity.
→ **Why?** Vì non-repudiation nghĩa là người gửi không thể nói "tôi không gửi cái đó" — cần bằng chứng toán học rằng private key đã ký.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến con dấu của công chứng viên. Khi công chứng viên đóng dấu vào tài liệu, ai cũng nhìn thấy dấu đó và có thể xác minh nó là thật (public key verify). Nhưng chỉ có công chứng viên với con dấu riêng mới đóng được (private key sign). Nếu có ai sửa một chữ trong tài liệu sau khi đóng dấu, dấu sẽ không còn hợp lệ nữa — vì hash của nội dung đã thay đổi.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Ký (Signing):                    Verify:

  message                          message + signature
     │                                   │
     ▼                                   ▼
  SHA-256(message)               SHA-256(message) ─────────────┐
     │                                   │                      │
     ▼                                   ▼                      │
  ┌──────────┐                    ┌────────────────┐            │
  │ PRIVATE  │ sign               │  PUBLIC KEY    │ decrypt    │
  │   KEY    │────────────────►   │  VERIFY        │────────────►
  └──────────┘                    └────────────────┘            │
     │                                                          │
     ▼                            decrypted_hash == hash? ✅/❌
  signature

JWT Example (RS256):
  header.payload.signature

  signature = RSA_sign(
    private_key,
    SHA256(base64url(header) + "." + base64url(payload))
  )
  → Anyone with public key (from JWKS endpoint) can verify!
  → Server NEVER shares private key
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Signature ≠ Encryption**: Ký không ẩn nội dung — ai cũng đọc được message. Signature chỉ proves authenticity và integrity.
- **ECDSA nonce reuse**: Dùng same nonce k hai lần khi ký → private key bị extract toán học. PS3 hack 2010 là ví dụ thực tế.
- **Algorithm confusion (alg:none)**: JWT `alg: none` bypass signature hoàn toàn. Server phải hardcode allowed algorithms, không trust client.
- **Replay attacks**: Signature valid nhưng bị replay lại sau đó. Cần timestamp (`iat`, `exp`) và/hoặc nonce trong signed payload.

### Overview / Tổng Quan

- Chữ ký số đảm bảo integrity, authenticity, và non-repudiation ở mức kỹ thuật.

### Explanation / Giải thích

- Khi trả lời phỏng vấn, hãy phân biệt rõ security goals: confidentiality, integrity, authenticity, availability.
- Nên mô tả attack surface và failure mode nếu vận hành sai (nonce reuse, weak key, misconfigured ciphers, expired cert).

### Example / Ví dụ

- Ví dụ 1: API service mã hóa dữ liệu nhạy cảm bằng AES-GCM với nonce unique per message.
- Ví dụ 2: Authentication server ký JWT bằng private key và publish public key qua JWKS.
- Ví dụ 3: Hệ thống dùng KMS để envelope encryption và tự động key rotation.

### Technical Checklist

- Thuật toán mạnh + chế độ an toàn + key size hợp chuẩn + lifecycle quản lý rõ ràng.
- Có monitoring cho certificate expiry, handshake failure spike, và unusual signature verification errors.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                                 | Đúng là                                                  |
| ------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------- |
| Nghĩ signature = encryption                | Signature không ẩn nội dung — ai cũng đọc được message      | Sign cho authenticity, encrypt riêng cho confidentiality |
| Accept JWT với `alg: none`                 | Attacker bypass signature hoàn toàn — không cần private key | Server hardcode allowed algorithms, reject `alg: none`   |
| Không check timestamp trong signed message | Replay attack: cùng signature dùng lại sau nhiều giờ        | Include `iat`, `exp`, `jti` (nonce) trong JWT payload    |

**🎯 Interview Pattern:**

- Khi thấy: "verify identity" hoặc "prove data integrity" hoặc "JWT signing" hoặc "non-repudiation"
- → Nhớ đến: Digital Signatures (ECDSA với ES256, hoặc RSA với RS256)
- → Mở đầu: "Digital signature dùng private key ký hash của message. Ai có public key đều verify được — không cần chia sẻ bí mật. Với JWT, tôi dùng RS256 hoặc ES256: server giữ private key, publish JWKS endpoint với public key cho clients verify."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Hashing](#hashing-and-password-hashing-sha-bcrypt-argon2) — hash là component trong signature; [Asymmetric Cryptography](#asymmetric-cryptography-rsa-ecdsa) — key pair
- ➡️ Để hiểu tiếp: [PKI](#public-key-infrastructure-pki) — ai cấp và quản lý public keys của các bên?

## Public Key Infrastructure (PKI)

> 🧠 **Memory Hook:** PKI như hệ thống CCCD quốc gia — nhà nước (CA) cấp giấy xác nhận danh tính, mọi người tin vì tin vào tổ chức phát hành.

**Tại sao tồn tại? / Why does this exist?**

Asymmetric crypto cho phép dùng public key — nhưng làm sao biết public key đó thật sự thuộc về người bạn nghĩ? Attacker có thể giả mạo. PKI giải quyết bằng cách có bên thứ ba đáng tin (Certificate Authority) xác nhận "public key này thuộc về domain này".
→ **Why?** Vì nếu không có CA, bạn không thể phân biệt public key thật của google.com và public key giả của attacker trong mạng WiFi coffee shop.
→ **Why?** Vì browser/OS đều có danh sách Root CAs được trust sẵn — chain of trust từ Root → Intermediate → Leaf certificate tạo ra web of trust toàn cầu.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến hệ thống CCCD (căn cước công dân). Khi bạn mở tài khoản ngân hàng, nhân viên không tin ngay vào những gì bạn nói về tên và ngày sinh — họ cần CCCD do nhà nước cấp. Nhà nước (Root CA) xác nhận bạn là ai, và ngân hàng tin vào xác nhận đó. Certificate trong PKI cũng vậy — CA ký xác nhận "domain example.com có public key này". Browser tin CA, nên browser tin certificate của domain đó.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Certificate Chain (Chain of Trust):

  Root CA ──── (self-signed, stored in OS/browser trust store)
    │  ký (signs)
    ▼
  Intermediate CA ──── (signed by Root)
    │  ký (signs)
    ▼
  Leaf Certificate
    ├── Subject: CN=example.com
    ├── Public Key: [server's public key]
    ├── Valid: 2025-01-01 to 2025-12-31
    ├── SANs: example.com, www.example.com
    └── Signature: [signed by Intermediate CA]

Verification process:
  1. Browser nhận leaf cert từ server
  2. Verify leaf được ký bởi Intermediate ✓
  3. Verify Intermediate được ký bởi Root ✓
  4. Root có trong trust store ✓
  → TRUSTED! 🔒

Certificate Revocation:
  CRL:           Danh sách revoked certs (offline, bulky)
  OCSP:          Real-time check (online, privacy concern)
  OCSP Stapling: Server gắn OCSP response → nhanh hơn, không leak privacy
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Certificate expiry**: Let's Encrypt cấp 90-day certs → cần auto-renew (certbot, ACME protocol). Cert hết hạn = production down + user thấy scary warning.
- **Wildcard vs SAN**: `*.example.com` không cover `sub.sub.example.com`. SAN (Subject Alternative Names) linh hoạt hơn và là best practice hiện tại.
- **CA compromise**: DigiNotar 2011 — CA bị hack, attacker issue fake Google cert cho Iran. Toàn bộ trust store phải update khẩn cấp.
- **Certificate Transparency (CT)**: Google yêu cầu mọi cert phải được log vào public CT log → phát hiện mis-issued certs. Không có CT log = Chrome distrust.

### Overview / Tổng Quan

- PKI quản lý certificate, chain of trust, issuance và revocation.

### Explanation / Giải thích

- Khi trả lời phỏng vấn, hãy phân biệt rõ security goals: confidentiality, integrity, authenticity, availability.
- Nên mô tả attack surface và failure mode nếu vận hành sai (nonce reuse, weak key, misconfigured ciphers, expired cert).

### Example / Ví dụ

- Ví dụ 1: API service mã hóa dữ liệu nhạy cảm bằng AES-GCM với nonce unique per message.
- Ví dụ 2: Authentication server ký JWT bằng private key và publish public key qua JWKS.
- Ví dụ 3: Hệ thống dùng KMS để envelope encryption và tự động key rotation.

### Technical Checklist

- Thuật toán mạnh + chế độ an toàn + key size hợp chuẩn + lifecycle quản lý rõ ràng.
- Có monitoring cho certificate expiry, handshake failure spike, và unusual signature verification errors.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                        | Đúng là                                                      |
| ------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Self-signed cert trong production     | Browser không trust → users thấy scary warning, sẽ bỏ đi           | Dùng Let's Encrypt (miễn phí, auto-renew) hoặc commercial CA |
| Không setup auto-renewal              | 90-day cert hết hạn → production down đột ngột                     | certbot với cron, hoặc cert-manager trong K8s                |
| `InsecureSkipVerify: true` trong code | MITM attack trivially successful — mọi certificate đều được accept | Luôn validate cert chain, configure CA bundle đúng           |

**🎯 Interview Pattern:**

- Khi thấy: "HTTPS certificate" hoặc "trust between services" hoặc "mTLS" hoặc "certificate expiry"
- → Nhớ đến: PKI — Certificate Authority, chain of trust, certificate lifecycle management
- → Mở đầu: "PKI giải quyết vấn đề 'ai sở hữu public key này'. CA ký cert xác nhận domain → public key binding. Với microservices, mTLS dùng certificates cho cả client và server — thường dùng internal CA như HashiCorp Vault hoặc cert-manager trong K8s."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Asymmetric Cryptography](#asymmetric-cryptography-rsa-ecdsa) — public/private key pair là nền tảng
- ➡️ Để hiểu tiếp: [TLS Handshake](#tls-handshake-and-https) — PKI được dùng trong TLS để verify server certificate

## TLS Handshake and HTTPS

> 🧠 **Memory Hook:** TLS như bắt tay giới thiệu giữa hai người lạ — xuất trình CCCD (certificate), thỏa thuận mật mã (cipher), rồi nói chuyện riêng tư bằng session key.

**Tại sao tồn tại? / Why does this exist?**

HTTP truyền dữ liệu dạng plaintext — ai trong mạng đều đọc được (coffee shop WiFi, ISP, router giữa đường). TLS tạo ra "đường hầm" được mã hóa VÀ xác thực giữa client và server, đảm bảo không ai giữa đường đọc hay sửa được.
→ **Why?** Vì encryption không đủ — cần authentication để biết bạn đang nói chuyện với server thật, không phải attacker giả mạo (MITM).
→ **Why?** Vì HTTPS = HTTP + TLS = encrypted + authenticated + integrity-protected; không chỉ là "private", mà còn đảm bảo đúng server.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến cuộc gặp giữa hai đặc vụ chưa từng gặp nhau. Đầu tiên họ bắt tay và xuất trình thẻ ID do tổ chức cấp (certificate từ CA). Sau đó thỏa thuận một "mật khẩu phiên" bằng cách trao đổi số học công khai (ECDH key exchange) — mật khẩu này không bao giờ truyền qua mạng. Từ đó về sau, mọi cuộc trò chuyện đều dùng mật khẩu phiên đó. Ngay cả nếu ai nghe lén được toàn bộ quá trình bắt tay, họ vẫn không thể tính được session key.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
TLS 1.3 Handshake (1-RTT):

CLIENT                                    SERVER
  │                                          │
  │── ClientHello ──────────────────────────►│
  │   {TLS 1.3, cipher suites,              │
  │    random, DH key_share}                │
  │                                          │
  │◄── ServerHello + Certificate ────────────│
  │    + CertificateVerify + Finished        │
  │    (all in one flight!)                  │
  │                                          │
  │  Cả hai tính:                            │
  │  session_key = HKDF(ECDH(              │
  │    client_priv, server_pub))             │
  │  ← Session key KHÔNG truyền qua mạng!   │
  │                                          │
  │── Finished ─────────────────────────────►│
  │══ Encrypted Application Data (AES-GCM) ══│

TLS 1.3 vs TLS 1.2:
  ┌──────────────────┬───────────┬───────────┐
  │ Feature          │ TLS 1.2   │ TLS 1.3   │
  ├──────────────────┼───────────┼───────────┤
  │ Handshake RTT    │ 2-RTT     │ 1-RTT     │
  │ Forward Secrecy  │ Optional  │ Always ✅  │
  │ 0-RTT resumption │ No        │ Yes*      │
  │ Weak ciphers     │ Allowed   │ Removed ✅ │
  └──────────────────┴───────────┴───────────┘
  * 0-RTT có replay attack risk — chỉ dùng cho idempotent requests
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **SSL Stripping**: Attacker downgrade HTTPS → HTTP. Fix: HSTS header `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **0-RTT Replay Attack**: TLS 1.3 0-RTT cho phép gửi data ngay trong ClientHello — nhưng attacker có thể replay request. Chỉ dùng cho idempotent (GET).
- **mTLS (Mutual TLS)**: Client cũng phải present certificate — server authenticate client. Dùng trong microservices, zero-trust architectures.
- **Certificate Pinning**: Mobile apps hardcode cert/pubkey — tránh rogue CA. Rất khó update khi cert rotate; cần backup pins và phasing strategy.

### Overview / Tổng Quan

- TLS thiết lập secure channel; HTTPS là HTTP chạy trên TLS.

### Explanation / Giải thích

- Khi trả lời phỏng vấn, hãy phân biệt rõ security goals: confidentiality, integrity, authenticity, availability.
- Nên mô tả attack surface và failure mode nếu vận hành sai (nonce reuse, weak key, misconfigured ciphers, expired cert).

### Example / Ví dụ

- Ví dụ 1: API service mã hóa dữ liệu nhạy cảm bằng AES-GCM với nonce unique per message.
- Ví dụ 2: Authentication server ký JWT bằng private key và publish public key qua JWKS.
- Ví dụ 3: Hệ thống dùng KMS để envelope encryption và tự động key rotation.

### Technical Checklist

- Thuật toán mạnh + chế độ an toàn + key size hợp chuẩn + lifecycle quản lý rõ ràng.
- Có monitoring cho certificate expiry, handshake failure spike, và unusual signature verification errors.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                         | Đúng là                                                          |
| --------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| Nghĩ HTTPS chỉ là "encrypted"     | HTTPS cũng authenticate server — ngăn MITM attack   | HTTPS = encrypted + authenticated + integrity (ba trong một)     |
| Dùng TLS 1.0/1.1 trong production | BEAST, POODLE và các known attacks đã được exploit  | TLS 1.2 minimum, prefer TLS 1.3; disable old versions            |
| Không set HSTS header             | SSL stripping attack downgrade connection sang HTTP | `Strict-Transport-Security: max-age=31536000; includeSubDomains` |

**🎯 Interview Pattern:**

- Khi thấy: "secure communication" hoặc "HTTPS" hoặc "man-in-the-middle" hoặc "TLS configuration"
- → Nhớ đến: TLS Handshake — ECDH key exchange, certificate verification (PKI), AEAD encryption
- → Mở đầu: "TLS 1.3 dùng ECDH ephemeral để exchange session key mà không truyền key qua mạng — forward secrecy. Certificate verify server identity (PKI). Sau handshake là AES-256-GCM. HTTPS không chỉ encrypt mà còn authenticate."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [PKI](#public-key-infrastructure-pki) — certificate verification trong TLS handshake
- ➡️ Để hiểu tiếp: [Key Management](#key-management-and-rotation) — manage TLS certs, private keys, và rotation

## Key Management and Rotation

> 🧠 **Memory Hook:** Key management như thay ổ khóa nhà định kỳ — nếu ai đó từng có chìa, thay ổ để họ không vào được nữa dù vẫn còn giữ chìa cũ.

**Tại sao tồn tại? / Why does this exist?**

Keys có thể bị lộ mà bạn không biết — insider threat, server compromise, buggy logging ghi nhầm secret. Key rotation giới hạn "blast radius": nếu key cũ bị lộ, chỉ data trong giai đoạn đó bị ảnh hưởng, không phải toàn bộ lịch sử hệ thống.
→ **Why?** Vì "the longer a key lives, the more data it protects, and the more catastrophic if compromised" — thời gian exposure phải có giới hạn.
→ **Why?** Vì compliance (PCI DSS, HIPAA, SOC2) yêu cầu key rotation định kỳ — không chỉ best practice mà còn là legal obligation với audit trail.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến việc thay ổ khóa nhà định kỳ. Bạn đã từng giao chìa cho người sửa nước, người giúp việc cũ, hàng xóm trông nhà — và không nhớ hết ai đang giữ. Thay ổ khóa mới là giải pháp an toàn nhất: những người đó vẫn giữ chìa cũ nhưng không vào được nữa. Tương tự, rotate encryption key nghĩa là key cũ bị lộ cũng chỉ ảnh hưởng đến data đã encrypt bằng nó — data mới đã dùng key mới rồi.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Envelope Encryption (AWS KMS pattern):

  ┌────────────────────────────────────┐
  │           AWS KMS                  │
  │  Master Key (CMK) — KHÔNG rời HSM  │
  └────────────────────────────────────┘
               │ generates
               ▼
          Data Key (DEK)
          ├── plaintext DEK → dùng encrypt data (rồi xóa khỏi memory)
          └── encrypted DEK → lưu cùng ciphertext

  Rotation: generate new DEK + encrypt với new CMK version
  Old data: re-decrypt với old DEK version (KMS giữ lịch sử key)
  New data: encrypted với new DEK

JWT Key Rotation (zero-downtime):

  Phase 1: Generate new key pair, add to JWKS:
    { "keys": [ old_key(kid:"v1"), new_key(kid:"v2") ] }

  Phase 2: Start signing NEW JWTs với new key (kid:"v2")
    Old JWTs với kid:"v1" vẫn verify được ✓

  Phase 3: Chờ tất cả old JWTs expire (theo exp claim)
    Remove "v1" khỏi JWKS

  ✅ Zero downtime — không force logout users!
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Rotation ≠ Revocation**: Rotation tạo key mới cho data mới (planned). Revocation phải handle khi key bị compromise — cần invalidate NGAY LẬP TỨC, không đợi.
- **Re-encryption cost**: Dữ liệu encrypt bằng key cũ cần re-encrypt với key mới? Tốn tài nguyên với large datasets. Envelope encryption giảm thiểu vì chỉ re-encrypt DEK nhỏ, không phải toàn bộ data.
- **Key derivation (HKDF)**: Đừng hardcode keys trong code. Dùng HKDF để derive sub-keys từ master key cho các purpose khác nhau — một master sinh nhiều specialized keys.
- **HSM (Hardware Security Module)**: Key không bao giờ rời hardware module. Đắt nhưng highest security — dùng cho Root CA, payment systems, HSM-backed KMS.

### Overview / Tổng Quan

- Quản lý vòng đời khóa là yếu tố sống còn của hệ thống bảo mật.

### Explanation / Giải thích

- Khi trả lời phỏng vấn, hãy phân biệt rõ security goals: confidentiality, integrity, authenticity, availability.
- Nên mô tả attack surface và failure mode nếu vận hành sai (nonce reuse, weak key, misconfigured ciphers, expired cert).

### Example / Ví dụ

- Ví dụ 1: API service mã hóa dữ liệu nhạy cảm bằng AES-GCM với nonce unique per message.
- Ví dụ 2: Authentication server ký JWT bằng private key và publish public key qua JWKS.
- Ví dụ 3: Hệ thống dùng KMS để envelope encryption và tự động key rotation.

### Technical Checklist

- Thuật toán mạnh + chế độ an toàn + key size hợp chuẩn + lifecycle quản lý rõ ràng.
- Có monitoring cho certificate expiry, handshake failure spike, và unusual signature verification errors.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                   | Đúng là                                                      |
| -------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| Hardcode secrets hoặc keys trong source code | Git history expose secret vĩnh viễn — ngay cả sau khi xóa     | Environment variables + KMS/Vault, không commit secrets      |
| Không có key rotation policy                 | Compromised key exposure window là vô hạn                     | Rotate theo schedule: JWT 30-90 ngày, TLS auto-renew 90 ngày |
| Xóa old key ngay khi rotate                  | Data encrypt bằng old key không decrypt được, JWTs cũ invalid | Maintain overlap period — old key vẫn verify, new key sign   |

**🎯 Interview Pattern:**

- Khi thấy: "key rotation" hoặc "secret management" hoặc "zero-downtime deployment" hoặc "compromise response"
- → Nhớ đến: Envelope encryption + versioned keys với overlap period cho JWT; KMS cho data keys
- → Mở đầu: "JWT key rotation cần overlap period — publish cả old và new key trong JWKS, bắt đầu sign với new key, retire old key sau khi tất cả old JWTs expire. Envelope encryption cho phép rotate master key mà không re-encrypt toàn bộ data."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Symmetric Encryption](#symmetric-encryption-aes-des) — keys cần lifecycle management; [Digital Signatures](#digital-signatures) — JWT signing keys
- ➡️ Để hiểu tiếp: [Modern Auth Patterns](./04-modern-auth-patterns.md) — JWT key rotation trong OAuth/OIDC flows

## Algorithm Comparison Tables

### Explanation / Giải thích

- Bảng dưới hỗ trợ trả lời nhanh khi interviewer hỏi so sánh thuật toán.

| Primitive | Best Use                          | Not Recommended For                | Notes                       |
| --------- | --------------------------------- | ---------------------------------- | --------------------------- |
| AES-GCM   | Data at rest/in transit with AEAD | Reusing nonce with same key        | Fast, modern, authenticated |
| RSA       | Compatibility and signatures      | Bulk data encryption               | Key size lớn, chậm hơn ECC  |
| ECDSA     | Efficient signatures              | Legacy-only stacks lacking support | Key nhỏ, chữ ký gọn         |
| Argon2id  | Password hashing                  | General file hashing               | Memory-hard chống GPU       |
| SHA-256   | Integrity checks                  | Password storage trực tiếp         | One-way hash, rất nhanh     |

## TLS 1.2 vs TLS 1.3

### Overview / Tổng Quan

- TLS 1.3 đơn giản hóa handshake, loại bỏ cipher yếu, và cải thiện bảo mật mặc định.

### Explanation / Giải thích

- Interview thường hỏi khác biệt về RTT, forward secrecy và backward compatibility.

### Example / Ví dụ

- ClientHello/ServerHello trao đổi key share, sau đó hai bên xác thực và chuyển sang encrypted application data.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Vì sao DES không còn an toàn?

- **Trả lời:** Vì key size quá nhỏ và brute-force đã khả thi bằng tài nguyên hiện đại.
- **Giải thích:** Nên gắn câu trả lời với một tình huống hệ thống thực tế để tăng sức thuyết phục.

### 🟢 [Junior] Khác nhau giữa hashing và encryption?

- **Trả lời:** Encryption có thể đảo ngược bằng key; hashing là một chiều cho integrity/indexing/password workflow.
- **Giải thích:** Nên gắn câu trả lời với một tình huống hệ thống thực tế để tăng sức thuyết phục.

### 🟡 [Mid] Tại sao password nên dùng argon2/bcrypt thay vì SHA-256 thuần?

- **Trả lời:** Vì argon2/bcrypt chậm có chủ đích và memory-hard, khiến brute-force tốn tài nguyên hơn đáng kể.
- **Giải thích:** Nên gắn câu trả lời với một tình huống hệ thống thực tế để tăng sức thuyết phục.

### 🟡 [Mid] Forward secrecy là gì?

- **Trả lời:** Nếu long-term private key bị lộ trong tương lai, session cũ vẫn không bị giải mã dễ dàng.
- **Giải thích:** Nên gắn câu trả lời với một tình huống hệ thống thực tế để tăng sức thuyết phục.

### 🔴 [Senior] Thiết kế key rotation zero-downtime cho JWT signing như thế nào?

- **Trả lời:** Dùng key version (kid), publish JWKS đa key trong giai đoạn chuyển tiếp, monitor verify errors rồi retire key cũ.
- **Giải thích:** Nên gắn câu trả lời với một tình huống hệ thống thực tế để tăng sức thuyết phục.

### 🔴 [Senior] Rủi ro lớn nhất khi dùng AES-GCM sai là gì?

- **Trả lời:** Reuse nonce với cùng key làm mất cả confidentiality và integrity.
- **Giải thích:** Nên gắn câu trả lời với một tình huống hệ thống thực tế để tăng sức thuyết phục.

### 🟢 [Junior] Practice question 1: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 2: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 3: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 4: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 5: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 6: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 7: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 8: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 9: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 10: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 11: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 12: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 13: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 14: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 15: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 16: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 17: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 18: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 19: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 20: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 21: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 22: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 23: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 24: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 25: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 26: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 27: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 28: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 29: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 30: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 31: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 32: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 33: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 34: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 35: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 36: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 37: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 38: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 39: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟢 [Junior] Practice question 40: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 41: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 42: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 43: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 44: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 45: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 46: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 47: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 48: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 49: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 50: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 51: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 52: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 53: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 54: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 55: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 56: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 57: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 58: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 59: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 60: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 61: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 62: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 63: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 64: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 65: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 66: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 67: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 68: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 69: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 70: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 71: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 72: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 73: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 74: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 75: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 76: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 77: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 78: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 79: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 80: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 81: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 82: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 83: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 84: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🟡 [Mid] Practice question 85: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 86: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 87: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 88: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 89: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 90: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 91: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 92: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 93: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 94: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 95: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 96: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 97: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 98: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 99: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 100: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 101: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 102: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 103: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 104: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 105: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 106: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 107: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 108: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 109: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 110: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 111: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 112: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 113: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 114: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 115: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 116: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 117: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 118: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 119: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 120: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 121: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 122: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 123: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

### 🔴 [Senior] Practice question 124: How would you secure cryptographic operations end-to-end?

- **Trả lời:** Xác định tài sản cần bảo vệ, chọn primitive đúng mục tiêu, quản lý key lifecycle, và triển khai monitoring + rotation.
- **Giải thích:** Sai sót vận hành thường nguy hiểm hơn bản thân thuật toán; do đó cần checklist vận hành và incident runbook.
- **Ví dụ:** Encrypt bằng AES-GCM, key giữ trong KMS, cert auto-renew, alert khi handshake failure tăng bất thường.

## Operational Security Playbooks

### Overview / Tổng Quan

- Vận hành mật mã an toàn đòi hỏi playbook rõ ràng cho rotate key, revoke certificate, và incident response.

### Explanation / Giải thích

- Thiếu playbook thường dẫn đến downtime hoặc rollback không an toàn khi xảy ra sự cố bảo mật.
- Trong phỏng vấn senior, bạn nên mô tả cả technical steps và coordination steps giữa SRE, backend, security, compliance.

### Example / Ví dụ

- Playbook 1: Rotate signing key theo lịch, publish key mới, monitor verification failures, retire key cũ an toàn.
- Playbook 2: Certificate compromise: revoke, reissue, deploy theo canary, audit toàn bộ dependent services.
- Playbook 3: Incident simulation định kỳ để kiểm tra readiness thực tế của đội.

## Threat Modeling for Cryptographic Design

### Overview / Tổng Quan

- Threat modeling giúp chọn đúng primitive thay vì “dùng thuật toán mạnh một cách mù quáng”.

### Explanation / Giải thích

- Cần phân loại attacker capability: passive eavesdropper, active MITM, insider threat, supply chain attacker.
- Mỗi attacker profile dẫn tới control set khác nhau: PFS, signature verification, attestation, key isolation.

### Example / Ví dụ

- Với attacker MITM: bắt buộc TLS chuẩn, certificate validation nghiêm ngặt, và pinning khi phù hợp.
- Với insider threat: tách quyền KMS, audit immutable, và alert theo policy violation.

## Cross-References

- Security fundamentals: `./01-security-fundamentals.md`
- OWASP and web attacks: `./03-web-security-owasp.md`

## Final Review Checklist

### Overview / Tổng Quan

- Trước release, xác nhận thuật toán, key lifecycle, certificate health, và monitoring đều đạt chuẩn.

### Explanation / Giải thích

- Checklist ngắn nhưng giúp giảm lỗi cấu hình có thể gây sự cố nghiêm trọng ở production.

### Example / Ví dụ

- Chạy kiểm tra tự động cho TLS config, cert expiry, và secret leakage trong pipeline CI/CD.

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is the difference between symmetric and asymmetric encryption? / Symmetric vs asymmetric encryption? 🟢 Junior

**A:** **Symmetric**: same key for encrypt and decrypt. Fast (AES-256 ~1GB/s), but key distribution problem. **Asymmetric**: key pair (public encrypts, private decrypts). Solves key distribution, but slow (~100x). Real systems use both: asymmetric to exchange symmetric key (TLS handshake), symmetric for bulk data.

```
Symmetric (AES-256):
same_key → encrypt → ciphertext → decrypt → plaintext
Problem: how to share the key securely?

Asymmetric (RSA/ECC):
Bob's public key → encrypt → ciphertext
Bob's private key → decrypt → plaintext

TLS hybrid:
1. Asymmetric: ECDHE key exchange → shared secret
2. Derive symmetric session keys
3. AES-GCM for all data (fast)
```

Vietnamese explanation: AES-GCM là symmetric standard hiện tại (authenticated encryption — detect tampering). RSA đang được replace bởi ECC (shorter keys, faster). "Don't roll your own crypto" là nguyên tắc vàng — dùng libsodium, Go crypto/tls, WebCrypto API.

---

### Q: What is the difference between hashing and encryption? / Hashing vs encryption? 🟢 Junior

**A:** **Hashing**: one-way — cannot reverse to get input. Used for password storage, integrity, checksums. **Encryption**: two-way — can decrypt with key. Used for confidential data.

```
Hashing (one-way):
"password123" → bcrypt(cost=12) → "$2b$12$xyz..."
Cannot reverse → only verify by hashing again

Encryption (two-way):
plaintext + key → ciphertext → decrypt + key → plaintext

Password storage: NEVER encrypt, ALWAYS hash with bcrypt/Argon2/scrypt
- Slow by design → resist brute force
- Salt (random per user) → prevent rainbow table attacks
```

Vietnamese explanation: MD5, SHA-1 broken (collision attacks) — không dùng for security. SHA-256 for checksums/integrity (fast OK). bcrypt/Argon2 for passwords (slow = intentional). "Why not SHA-256 for passwords?" → too fast (billions attempts/sec with GPU). HMAC = hash với secret key → message authentication (verify data + sender).

---

### Q: How does TLS/HTTPS work? / TLS/HTTPS hoạt động như thế nào? 🟡 Mid

**A:** TLS 1.3 handshake (simplified 1-RTT):

```
Client                     Server
──────                     ──────
1. ClientHello           →  (TLS version, supported ciphers, random)
2.                       ←  ServerHello + Certificate + ServerFinished
   (verify cert against CA trust chain)
3. ECDHE key exchange: compute shared secret
4. Derive session keys from shared secret
5. Encrypted data       ⟺  (AES-GCM with session keys)

TLS 1.3 vs 1.2:
- 1-RTT handshake (vs 2-RTT) → faster
- 0-RTT resumption for returning visitors
- Forward Secrecy by default (ECDHE always)
- Removed weak algorithms (RSA key exchange, weak DH)
```

Vietnamese explanation: Certificate verification: browser checks cert signed by trusted CA. HSTS: tells browser "always HTTPS" → prevents SSL stripping. mTLS: both client AND server present certs → service-to-service auth in zero-trust. Let's Encrypt: free automated cert (ACME protocol). Certificate Pinning: mobile apps hardcode cert/pubkey → prevent fraudulent certs (risky to update).

---

## Interview Q&A Summary / Tổng Kết

| Question                | Level | Key Point                                                           |
| ----------------------- | ----- | ------------------------------------------------------------------- |
| Symmetric vs asymmetric | 🟢    | Symmetric=fast+same key; asymmetric=key pair; TLS uses hybrid       |
| Hashing vs encryption   | 🟢    | Hash=one-way+integrity; bcrypt for passwords; SHA-256 for checksums |
| TLS/HTTPS               | 🟡    | ECDHE key exchange → session keys; 1-RTT; forward secrecy           |

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu. Trả lời trong 2 phút. Nếu < 4/5 đúng → review lại section tương ứng.

| #   | Loại           | Câu hỏi                                                                                                                                            |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | AES-256-GCM cần những gì để encrypt? Tại sao nonce không được reuse với cùng key?                                                                  |
| 2   | 🎨 Visual      | Vẽ TLS 1.3 handshake — client gửi gì, server trả gì, session key được tạo ra ở bước nào và bằng cách nào?                                          |
| 3   | 🛠️ Application | Startup cần lưu password user và ký JWT access token. Bạn chọn thuật toán gì cho từng bài toán? Tại sao không dùng cùng một thuật toán cho cả hai? |
| 4   | 🐛 Debug       | Code này sai gì: `const hash = crypto.createHash('sha256').update(password).digest('hex')` khi dùng để store password trong database?              |
| 5   | 🎓 Teach       | Giải thích cho PM tại sao HTTPS không chỉ là "private" mà còn ngăn được man-in-the-middle attack — dùng ví dụ coffee shop WiFi.                    |

💬 **Feynman Prompt:** Giải thích tại sao HTTPS không chỉ là "encrypted" mà còn là "authenticated" — và tại sao MITM attack không thể work với valid HTTPS (hint: certificate chain của PKI đảm bảo public key thuộc về đúng domain, không phải attacker giả mạo — ngay cả khi attacker ngồi cùng mạng WiFi với bạn).

## Connections / Liên Kết

- ⬅️ **Built on**: [Security Fundamentals](./01-security-fundamentals.md) — CIA Triad: confidentiality (encryption) + integrity (hashing)
- ➡️ **Applied in**: [Modern Auth](./04-modern-auth-patterns.md) — JWT uses RS256/HS256, OAuth uses PKCE
- ➡️ **Applied in**: [Networking](../../be-track/02-backend-knowledge/06-networking-go.md) — TLS in Go HTTP/gRPC
- 🔗 **Related**: [Web Security](./03-web-security-owasp.md) — cryptographic mitigations for OWASP vulnerabilities
