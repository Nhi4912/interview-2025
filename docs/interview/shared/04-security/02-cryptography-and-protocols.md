# Cryptography and Protocols — Mật mã học và giao thức bảo mật
> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `fe-track/modules/08-security.md`, `be-track/02-backend-knowledge/04-auth-security.md`

---

## 1. Symmetric Encryption — Mã hóa đối xứng

### 🟢 Q: What is symmetric encryption? `[Junior]`

**A:** Mã hóa đối xứng dùng cùng một key cho encrypt/decrypt. Rất nhanh, phù hợp mã hóa dữ liệu lớn.

```text
plaintext --Encrypt(K)--> ciphertext --Decrypt(K)--> plaintext
```

### 🟢 Q: Compare AES, DES, and 3DES `[Junior]`

| Algorithm | Key size | Status | Ghi chú |
|----------|----------|--------|--------|
| DES | 56-bit | Obsolete | Không còn an toàn |
| 3DES | 112/168-bit | Legacy | Chậm, đang bị loại khỏi chuẩn mới |
| AES | 128/192/256-bit | Recommended | Chuẩn hiện đại, có acceleration phần cứng |

### 🟡 Q: How do AES modes (ECB/CBC/GCM) differ? `[Mid]`

| Mode | Mức an toàn | Gợi ý |
|------|------------|------|
| ECB | ❌ Kém | Không dùng trong production |
| CBC | ⚠️ Trung bình | Cần IV random và MAC riêng |
| GCM | ✅ Tốt | AEAD: vừa mã hóa vừa xác thực |

```js
// JS pseudocode
const iv = randomBytes(12)
const { ciphertext, tag } = aesGcmEncrypt(key, iv, plaintext, aad)
const plain = aesGcmDecrypt(key, iv, ciphertext, tag, aad)
```

### 🔴 Q: Why nonce reuse is dangerous in AES-GCM? `[Senior]`

**A:** Reuse nonce với cùng key có thể phá confidentiality và integrity. Quy tắc vận hành: cặp `(key, nonce)` phải unique.

---

## 2. Asymmetric Cryptography — Mã hóa bất đối xứng

### 🟢 Q: What are public and private keys? `[Junior]`

**A:** Public key chia sẻ để verify/encrypt; private key giữ bí mật để sign/decrypt.

### 🟡 Q: Compare RSA, ECDSA, and Diffie-Hellman `[Mid]`

| Algorithm | Mục đích | Output |
|----------|----------|--------|
| RSA | Encryption/Signature | Ciphertext hoặc signature |
| ECDSA | Signature | Signature nhỏ gọn |
| Diffie-Hellman/ECDHE | Key exchange | Shared secret |

### 🟡 Q: Explain Diffie-Hellman in simple steps `[Mid]`

```text
Alice: private a, sends public A
Bob:   private b, sends public B
Alice computes s = f(B, a)
Bob computes   s = f(A, b)
=> both derive same shared secret s
```

### 🔴 Q: Why does modern TLS prefer ECDHE? `[Senior]`

**A:** ECDHE cho Perfect Forward Secrecy: lộ private key dài hạn hôm nay không giải mã được traffic cũ đã capture.

---

## 3. Hashing & Password Hashing

### 🟢 Q: What is SHA-256 used for? `[Junior]`

**A:** Dùng cho integrity/fingerprint/signature internals. Không dùng trực tiếp để lưu password.

### 🟢 Q: bcrypt vs argon2 `[Junior]`

| Algorithm | Dùng cho password | Ghi chú |
|----------|-------------------|--------|
| bcrypt | Có | Adaptive cost, phổ biến |
| argon2id | Có (khuyến nghị) | Memory-hard, chống GPU tốt |
| SHA-256 | Không nên dùng trực tiếp | Quá nhanh |

### 🟡 Q: Password hashing best practices `[Mid]`

1. Dùng argon2id hoặc bcrypt
2. Salt unique cho mỗi user
3. Optional pepper trong secret manager
4. Rehash khi policy cost thay đổi

```go
// Go-like pseudocode
salt := randomBytes(16)
hash := argon2id(password, salt, mem=64*1024, iterations=3, parallelism=4)
store(userID, salt, hash, paramsVersion)
```

### 🔴 Q: Why not encrypt passwords instead of hashing? `[Senior]`

**A:** Encrypt cần key decrypt; key lộ thì lộ toàn bộ plaintext passwords. Hashing one-way giảm rủi ro này.

---

## 4. Digital Signatures — Chữ ký số

### 🟢 Q: How digital signatures work? `[Junior]`

**A:** Signer ký hash của message bằng private key; verifier kiểm tra bằng public key.

```text
message -> hash -> sign(privateKey) => signature
verify(publicKey, hash(message), signature)
```

### 🟡 Q: What properties do signatures provide? `[Mid]`

| Property | Có? |
|----------|-----|
| Integrity | ✅ |
| Authenticity | ✅ |
| Non-repudiation | ✅ (tùy legal context) |
| Confidentiality | ❌ |

### 🔴 Q: Signature use cases in production `[Senior]`

**A:** JWT signing, artifact signing, firmware update verification, document e-signing, blockchain transactions.

---

## 5. PKI — Certificates, CAs, Chain of Trust

### 🟢 Q: What is PKI? `[Junior]`

**A:** PKI là hạ tầng quản lý certificate/public key để xác minh danh tính qua CA.

### 🟡 Q: Explain chain of trust `[Mid]`

```text
Leaf cert (example.com)
  signed by Intermediate CA
  signed by Root CA (trusted by OS/browser)
```

### 🟡 Q: What should clients verify in certificates? `[Mid]`

- SAN/hostname match
- Valid time range
- Valid signature chain
- Revocation signal (OCSP/CRL when applicable)

### 🔴 Q: Common PKI operational failures `[Senior]`

- Cert expiry outage
- Missing intermediate chain
- Private key leakage
- Manual, non-automated rotation

---

## 6. TLS/SSL Handshake — Step by Step

### 🟢 Q: What is TLS handshake? `[Junior]`

**A:** Quá trình client/server thỏa thuận phiên mã hóa và xác thực danh tính trước khi gửi dữ liệu ứng dụng.

### 🟡 Q: TLS 1.3 handshake steps `[Mid]`

1. ClientHello (versions, ciphers, key share)
2. ServerHello (chosen params, key share)
3. Certificate + CertificateVerify + Finished từ server
4. Client verify certificate chain + hostname
5. Client gửi Finished
6. Bắt đầu encrypted HTTP data

```text
Client                                 Server
  | --- ClientHello ------------------> |
  | <--- ServerHello ------------------ |
  | <--- Certificate + Finished ------- |
  | --- Finished ---------------------> |
  | ===== Encrypted application data == |
```

### 🔴 Q: TLS 1.2 vs TLS 1.3 differences `[Senior]`

| Topic | TLS 1.2 | TLS 1.3 |
|------|---------|---------|
| RTT | Cao hơn | Thấp hơn |
| Legacy ciphers | Nhiều hơn | Loại bỏ nhiều thuật toán yếu |
| Forward secrecy | Optional | Mặc định tốt hơn với (EC)DHE |

---

## 7. HTTPS — Hybrid Model

### 🟢 Q: How HTTPS combines asymmetric + symmetric crypto? `[Junior]`

**A:** Asymmetric dùng trong handshake để xác thực/trao đổi key, symmetric dùng để mã hóa traffic vì hiệu năng cao.

### 🟡 Q: Why not use asymmetric crypto for all data? `[Mid]`

**A:** Vì asymmetric chậm hơn nhiều. Hybrid model là cân bằng giữa bảo mật và hiệu năng.

### 🔴 Q: What is HSTS and why important? `[Senior]`

**A:** HSTS buộc browser dùng HTTPS, giảm downgrade và SSL stripping attacks.

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## 8. Key Management Best Practices

### 🟢 Q: What is key lifecycle? `[Junior]`

**A:** Generate → Store → Distribute → Rotate → Revoke → Destroy.

### 🟡 Q: KMS and HSM difference? `[Mid]`

| Tool | Vai trò |
|------|---------|
| KMS | Quản lý key qua service/API |
| HSM | Bảo vệ key bằng phần cứng chuyên dụng |

### 🟡 Q: What is envelope encryption? `[Mid]`

**A:** Dùng DEK mã hóa data, dùng KEK (KMS/HSM) mã hóa DEK.

```text
Data --encrypted with--> DEK
DEK  --encrypted with--> KEK
```

### 🔴 Q: Key management anti-patterns `[Senior]`

- Hardcode keys in source
- Share one key across environments
- Never rotate keys
- Log plaintext secrets

---

## 9. Interview Q&A

### 🟢 Q: Why is DES deprecated? `[Junior]`

**A:** DES key size nhỏ, brute-force thực tế khả thi.

### 🟢 Q: What does SHA-256 provide? `[Junior]`

**A:** Integrity/fingerprint, không phải password hashing trực tiếp.

### 🟡 Q: RSA vs ECC certificates: when to choose? `[Mid]`

**A:** ECC nhỏ/nhanh hơn, RSA tương thích rộng hơn.

### 🟡 Q: Why short-lived tokens are safer? `[Mid]`

**A:** Giảm cửa sổ lạm dụng khi token bị lộ.

### 🟡 Q: What is perfect forward secrecy? `[Mid]`

**A:** Lộ private key dài hạn không giải mã được session cũ.

### 🔴 Q: How to rotate JWT signing keys safely? `[Senior]`

**A:** Dùng JWKS + kid, rollout key mới song song, retire key cũ theo plan.

### 🔴 Q: How to enforce crypto agility? `[Senior]`

**A:** Versioned config + test migration + central policy registry.

### 🔴 Q: How to avoid downtime during certificate rotation? `[Senior]`

**A:** Tự động renew trước hạn, health checks chain/SAN, deploy staged.

---

## 10. Practice Bank

### 🟢 Q: Cryptography scenario drill #1? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #2? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #3? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #4? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #5? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #6? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #7? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #8? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #9? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #10? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #11? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #12? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #13? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #14? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #15? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #16? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #17? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #18? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #19? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #20? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #21? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #22? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #23? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #24? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #25? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #26? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #27? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟢 Q: Cryptography scenario drill #28? `[Junior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #29? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #30? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #31? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #32? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #33? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #34? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #35? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #36? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #37? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #38? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #39? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #40? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #41? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #42? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #43? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #44? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #45? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #46? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #47? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #48? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #49? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #50? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #51? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #52? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #53? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #54? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #55? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #56? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🟡 Q: Cryptography scenario drill #57? `[Mid]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #58? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #59? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #60? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #61? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #62? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #63? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #64? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #65? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #66? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #67? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #68? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #69? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #70? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #71? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #72? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #73? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #74? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #75? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #76? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #77? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #78? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #79? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #80? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #81? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #82? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #83? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #84? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.


### 🔴 Q: Cryptography scenario drill #85? `[Senior]`

**A:** Trả lời theo khung: threat model → primitive phù hợp → key lifecycle → trade-off → verification bằng test/monitoring.

---

## Cross-References

- Security foundations: `docs/interview/shared/04-security/01-security-fundamentals.md`
- OWASP web security: `docs/interview/shared/04-security/03-web-security-owasp.md`
- Networking: `docs/interview/shared/01-cs-fundamentals/networking-theory.md`
- System design: `docs/interview/shared/02-system-design/system-design-theory.md`
- FE security module: `docs/interview/fe-track/modules/08-security.md`
- BE auth-security: `docs/interview/be-track/02-backend-knowledge/04-auth-security.md`

---

## 11. Supplemental Interview Drills

### 🟢 Q: Cryptography scenario drill #86? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟢 Q: Cryptography scenario drill #87? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟢 Q: Cryptography scenario drill #88? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟢 Q: Cryptography scenario drill #89? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟢 Q: Cryptography scenario drill #90? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟢 Q: Cryptography scenario drill #91? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟢 Q: Cryptography scenario drill #92? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟢 Q: Cryptography scenario drill #93? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟢 Q: Cryptography scenario drill #94? `[Junior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟡 Q: Cryptography scenario drill #95? `[Mid]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟡 Q: Cryptography scenario drill #96? `[Mid]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟡 Q: Cryptography scenario drill #97? `[Mid]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟡 Q: Cryptography scenario drill #98? `[Mid]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟡 Q: Cryptography scenario drill #99? `[Mid]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟡 Q: Cryptography scenario drill #100? `[Mid]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟡 Q: Cryptography scenario drill #101? `[Mid]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🟡 Q: Cryptography scenario drill #102? `[Mid]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🔴 Q: Cryptography scenario drill #103? `[Senior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🔴 Q: Cryptography scenario drill #104? `[Senior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🔴 Q: Cryptography scenario drill #105? `[Senior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🔴 Q: Cryptography scenario drill #106? `[Senior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🔴 Q: Cryptography scenario drill #107? `[Senior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🔴 Q: Cryptography scenario drill #108? `[Senior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🔴 Q: Cryptography scenario drill #109? `[Senior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.


### 🔴 Q: Cryptography scenario drill #110? `[Senior]`

**A:** Nêu rõ asset cần bảo vệ, adversary model, thuật toán phù hợp, cách quản lý key/cert, và cách kiểm chứng bằng test + quan sát runtime.

---

## 12. Quick Terms Review
- **Nonce:** Giá trị chỉ dùng một lần trong encryption/session setup.
- **Salt:** Random value cho password hash để chống rainbow tables.
- **Pepper:** Secret chung hệ thống lưu ngoài DB để tăng độ khó cracking.
- **AEAD:** Authenticated Encryption with Associated Data.
- **PFS:** Perfect Forward Secrecy cho session keys.
- **OCSP:** Kiểm tra trạng thái thu hồi certificate.
- **JWKS:** Endpoint chứa public keys để verify JWT.
- **KDF:** Hàm dẫn xuất khóa như HKDF/PBKDF2/Argon2.
