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

## Asymmetric Cryptography (RSA, ECDSA)
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

## Hashing and Password Hashing (SHA, bcrypt, argon2)
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

## Digital Signatures
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

## Public Key Infrastructure (PKI)
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

## TLS Handshake and HTTPS
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

## Key Management and Rotation
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

## Algorithm Comparison Tables
### Explanation / Giải thích
- Bảng dưới hỗ trợ trả lời nhanh khi interviewer hỏi so sánh thuật toán.

| Primitive | Best Use | Not Recommended For | Notes |
| --- | --- | --- | --- |
| AES-GCM | Data at rest/in transit with AEAD | Reusing nonce with same key | Fast, modern, authenticated |
| RSA | Compatibility and signatures | Bulk data encryption | Key size lớn, chậm hơn ECC |
| ECDSA | Efficient signatures | Legacy-only stacks lacking support | Key nhỏ, chữ ký gọn |
| Argon2id | Password hashing | General file hashing | Memory-hard chống GPU |
| SHA-256 | Integrity checks | Password storage trực tiếp | One-way hash, rất nhanh |

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

| Question | Level | Key Point |
|----------|-------|-----------|
| Symmetric vs asymmetric | 🟢 | Symmetric=fast+same key; asymmetric=key pair; TLS uses hybrid |
| Hashing vs encryption | 🟢 | Hash=one-way+integrity; bcrypt for passwords; SHA-256 for checksums |
| TLS/HTTPS | 🟡 | ECDHE key exchange → session keys; 1-RTT; forward secrecy |

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I explain the TLS 1.3 handshake in 3 steps and what "1-RTT" means?
- [ ] Can I explain why bcrypt (not SHA-256) for passwords — what makes bcrypt better?
- [ ] Can I explain forward secrecy and why it matters if private key is compromised later?
- [ ] Can I describe the difference between code signing and message authentication?
- 💬 **Feynman Prompt:** Giải thích tại sao HTTPS không chỉ là "encrypted" mà còn là "authenticated" — và tại sao MITM attack không thể work với valid HTTPS (hint: certificate chain).

## Connections / Liên Kết

- ⬅️ **Built on**: [Security Fundamentals](./01-security-fundamentals.md) — CIA Triad: confidentiality (encryption) + integrity (hashing)
- ➡️ **Applied in**: [Modern Auth](./04-modern-auth-patterns.md) — JWT uses RS256/HS256, OAuth uses PKCE
- ➡️ **Applied in**: [Networking](../../be-track/02-backend-knowledge/06-networking-go.md) — TLS in Go HTTP/gRPC
- 🔗 **Related**: [Web Security](./03-web-security-owasp.md) — cryptographic mitigations for OWASP vulnerabilities
