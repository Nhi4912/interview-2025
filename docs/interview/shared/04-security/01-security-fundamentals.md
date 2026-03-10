# Security Fundamentals — Nền tảng Bảo mật
> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `fe-track/07-web-security/`, `be-track/02-backend-knowledge/04-auth-security.md`

---

## 1. CIA Triad — Tam giác CIA

### 🟢 Q: What is the CIA Triad?
**A:** Ba trụ cột cơ bản của information security:

| Pillar | Mô tả | Ví dụ |
|--------|--------|-------|
| **Confidentiality** (Bảo mật) | Chỉ người được phép mới truy cập được dữ liệu | Encryption, access control, authentication |
| **Integrity** (Toàn vẹn) | Dữ liệu không bị thay đổi trái phép | Checksums, digital signatures, version control |
| **Availability** (Sẵn sàng) | Hệ thống luôn hoạt động khi cần | Redundancy, load balancing, DDoS protection |

**Mở rộng (AAA Model):**
- **Authentication** — Xác thực: Bạn là ai?
- **Authorization** — Phân quyền: Bạn được làm gì?
- **Accounting** — Ghi nhận: Bạn đã làm gì?

---

## 2. Core Security Principles — Nguyên tắc bảo mật cốt lõi

### 🟢 Q: What are the fundamental security principles?

**1. Defense in Depth (Phòng thủ nhiều lớp)**
> Không dựa vào một lớp bảo mật duy nhất. Mỗi lớp bổ sung thêm protection.

```
Internet → Firewall/WAF → Load Balancer → API Gateway → Application → Database
                                            ↓
                                    Rate limiting, auth,
                                    input validation, encryption
```

**2. Principle of Least Privilege (Quyền tối thiểu)**
> Mỗi user/process/service chỉ được cấp quyền TỐI THIỂU cần thiết để hoàn thành công việc.
- Không dùng root/admin cho daily operations
- Service accounts chỉ access resources cần thiết
- Database users chỉ có quyền trên tables cần thiết

**3. Fail Securely (Thất bại an toàn)**
> Khi hệ thống gặp lỗi, phải fail vào trạng thái AN TOÀN, không phải trạng thái mở.

```
// ❌ Fail open — dangerous
if (error) {
  grantAccess(); // Lỗi → cho vào luôn
}

// ✅ Fail closed — secure  
if (error) {
  denyAccess(); // Lỗi → từ chối trước
  logSecurityEvent(error);
}
```

**4. Don't Trust User Input (Không tin input từ user)**
> MỌI dữ liệu từ client đều có thể bị tampered. Validate và sanitize ở server-side.
- Query parameters, form data, headers, cookies — tất cả đều untrusted
- Validate: kiểm tra format, type, range
- Sanitize: loại bỏ ký tự nguy hiểm
- Encode: escape output trước khi render

**5. Secure by Default**
> Cấu hình mặc định phải là AN TOÀN NHẤT. User phải chủ động opt-in để giảm security.
- HTTPS by default, không phải HTTP
- Strict CSP headers by default
- HttpOnly + Secure + SameSite cookies by default

**6. Separation of Duties (Phân tách trách nhiệm)**
> Không một người/hệ thống nào nên kiểm soát toàn bộ quy trình critical.
- Dev ≠ Reviewer ≠ Deployer
- API server ≠ Auth server

---

## 3. Authentication vs Authorization — Xác thực vs Phân quyền

### 🟡 Q: What is the difference between Authentication and Authorization?

| | Authentication (AuthN) | Authorization (AuthZ) |
|--|----------------------|---------------------|
| **Câu hỏi** | Bạn là AI? (Who are you?) | Bạn được làm GÌ? (What can you do?) |
| **Mục đích** | Verify identity | Verify permissions |
| **Thời điểm** | Xảy ra TRƯỚC | Xảy ra SAU authentication |
| **HTTP code** | `401 Unauthorized` (unauthenticated) | `403 Forbidden` (unauthorized) |
| **Ví dụ** | Login with username/password | Admin can delete users, viewer can only read |

**Request lifecycle:**
```
Client Request
  → Authentication: Ai đang gọi? (JWT/Session/API Key)
    → Authorization: Họ có quyền không? (RBAC/ABAC)
      → Business Logic
        → Response
```

---

## 4. Session-based Authentication — Xác thực bằng Session

### 🟡 Q: How does session-based authentication work?

**Flow:**
```
1. Client gửi credentials (username + password)
2. Server verify → tạo session (lưu trong memory/Redis/DB)
3. Server trả về Session ID trong Set-Cookie header
4. Client gửi Session ID trong Cookie header mỗi request
5. Server lookup Session ID → lấy user info → xử lý request
```

**Session storage options:**

| Storage | Pros | Cons |
|---------|------|------|
| In-memory | Nhanh nhất | Mất khi restart, không scale được (sticky sessions) |
| Redis | Nhanh, shared across instances | Cần maintain Redis cluster |
| Database | Persistent, queryable | Chậm hơn, cần cleanup expired sessions |

**Session fixation attack:**
> Attacker set sẵn session ID cho victim → victim login → attacker dùng session ID đó.
> **Prevention:** Regenerate session ID sau mỗi lần login.

---

## 5. JWT (JSON Web Token)

### 🟡 Q: What is JWT and how does it work?

**Structure:** `header.payload.signature`

```
Header: { "alg": "RS256", "typ": "JWT" }
  ↓ Base64Url encode
Payload: { "sub": "user123", "exp": 1700000000, "role": "admin" }
  ↓ Base64Url encode
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), secret)
```

**Claim types:**

| Type | Claims | Mô tả |
|------|--------|--------|
| Registered | `iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti` | Chuẩn RFC 7519, IANA registered |
| Public | `name`, `email`, `role` | Custom nhưng nên đăng ký để tránh collision |
| Private | App-specific claims | Thỏa thuận giữa producer và consumer |

### 🟡 Q: What signing algorithms should you use?

| Algorithm | Type | Khi nào dùng |
|-----------|------|-------------|
| **HS256** | Symmetric (shared secret) | Single service, internal APIs |
| **RS256** | Asymmetric (private/public key pair) | Microservices — sign with private, verify with public |
| **ES256** | Asymmetric (elliptic curve) | Compact tokens, mobile, high-performance systems |

> ⚠️ **Tuyệt đối KHÔNG dùng `alg: "none"`** — đây là lỗ hổng bảo mật nổi tiếng.

### 🔴 Q: Session vs JWT — when to use which?

| Criteria | Session | JWT |
|----------|---------|-----|
| **State** | Stateful (server lưu) | Stateless (client giữ) |
| **Scalability** | Cần shared storage (Redis) | Dễ scale (không cần shared state) |
| **Revocation** | Dễ (xóa session) | Khó (token valid đến khi expire) |
| **Size** | Small (chỉ session ID) | Lớn hơn (chứa claims) |
| **Microservices** | Khó (mỗi service cần check session store) | Dễ (mỗi service tự verify) |
| **Security** | Vulnerable to CSRF | Vulnerable to XSS (nếu lưu localStorage) |
| **Best for** | Monolith, traditional web apps | Microservices, SPAs, mobile apps |

**JWT Revocation Strategies:**
1. **Short-lived tokens** (15 min) + refresh token rotation
2. **Token blacklist** — lưu revoked JTI trong Redis (trade-off: thêm stateful check)
3. **Token versioning** — mỗi user có token version, increment khi logout/password change

---

## 6. OAuth 2.0

### 🟡 Q: What is OAuth 2.0 and what are its roles?

**4 Roles:**

| Role | Mô tả | Ví dụ |
|------|--------|-------|
| **Resource Owner** | User sở hữu data | End user |
| **Client** | App muốn access data | Your web/mobile app |
| **Authorization Server** | Cấp tokens | Google Auth, Auth0, Keycloak |
| **Resource Server** | API chứa protected data | Google Calendar API |

### 🔴 Q: Explain the Authorization Code flow with PKCE

```
1. Client tạo code_verifier (random string) và code_challenge = SHA256(code_verifier)
2. Client redirect user → Authorization Server
   GET /authorize?response_type=code&client_id=xxx&redirect_uri=xxx
                  &code_challenge=xxx&code_challenge_method=S256
3. User login + consent → Authorization Server redirect về client
   GET /callback?code=AUTHORIZATION_CODE
4. Client đổi code lấy token (gửi kèm code_verifier)
   POST /token { grant_type: "authorization_code", code, code_verifier }
5. Authorization Server verify SHA256(code_verifier) == code_challenge
6. Authorization Server trả về access_token + refresh_token
```

**Tại sao cần PKCE?**
> Authorization Code flow gốc dùng `client_secret` — nhưng mobile/SPA apps không thể giữ secret an toàn (source code visible). PKCE thay thế secret bằng challenge/verifier để chống code interception attack.

**Grant types:**

| Grant Type | Use Case |
|-----------|----------|
| Authorization Code + PKCE | Web apps, mobile apps (RECOMMENDED) |
| Client Credentials | Machine-to-machine (no user involved) |
| Device Code | Smart TV, IoT (limited input devices) |
| ~~Implicit~~ | ~~SPAs~~ — **DEPRECATED**, dùng Auth Code + PKCE thay thế |
| ~~Password~~ | ~~Legacy~~ — **DEPRECATED**, chỉ dùng khi migrate |

### 🟡 Q: OAuth 2.0 vs OpenID Connect (OIDC)?

| | OAuth 2.0 | OIDC |
|--|-----------|------|
| **Purpose** | Authorization (access resources) | Authentication (verify identity) |
| **Token** | Access token (opaque or JWT) | ID token (always JWT) + access token |
| **Claims** | No standard user info | Standard claims: `sub`, `name`, `email` |
| **Scope** | Custom scopes | `openid`, `profile`, `email` |
| **UserInfo** | No standard endpoint | `/userinfo` endpoint |

> **Tóm lại:** OAuth 2.0 = "Cho app X quyền truy cập photos của tôi". OIDC = "Xác thực tôi là ai thông qua Google".

---

## 7. Password Security — Bảo mật mật khẩu

### 🟡 Q: Why not use MD5 or SHA for password hashing?

| Algorithm | Vấn đề |
|-----------|--------|
| MD5 | Broken — collision attacks, rainbow tables, ~10 billion hashes/sec trên GPU |
| SHA-256 | Quá nhanh — designed for speed, not password hashing |
| **bcrypt** | ✅ Adaptive cost factor, built-in salt, deliberately slow |
| **argon2id** | ✅ Memory-hard (chống GPU/ASIC attacks), winner of Password Hashing Competition |

**Tại sao cần salt?**
> Nếu không salt, 2 users cùng password → cùng hash → attacker crack 1 là crack hết.
> Salt = random bytes thêm vào trước khi hash → mỗi user có hash khác nhau dù cùng password.

**Recommended settings:**
- bcrypt: cost factor ≥ 12 (adjust based on server hardware — target ~250ms per hash)
- argon2id: memory=64MB, iterations=3, parallelism=4

### 🟡 Q: What is Multi-Factor Authentication (MFA)?

**3 Authentication factors:**

| Factor | Mô tả | Ví dụ |
|--------|--------|-------|
| **Knowledge** (Something you know) | Password, PIN, security question | |
| **Possession** (Something you have) | Phone, hardware key, smart card | TOTP, SMS OTP, YubiKey |
| **Inherence** (Something you are) | Biometrics | Fingerprint, Face ID |

**TOTP (Time-based One-Time Password):**
- Dùng shared secret + current time → generate 6-digit code
- Code thay đổi mỗi 30 giây
- Apps: Google Authenticator, Authy, 1Password

**WebAuthn / FIDO2:**
- Passwordless authentication sử dụng public key cryptography
- Private key lưu trên device (hardware security module)
- Phishing-resistant — bound to specific origin
- Supported by all major browsers

---

## 8. Common Vulnerabilities (OWASP) — Lỗ hổng phổ biến

### 🟡 Q: Explain SQL Injection

**What:** Attacker chèn SQL code vào input → server execute SQL không mong muốn.

```
// Input: ' OR '1'='1' --
// Resulting query:
SELECT * FROM users WHERE username = '' OR '1'='1' --' AND password = '...'
// → Returns ALL users
```

**Types:**
| Type | Mô tả |
|------|--------|
| Union-based | Dùng UNION để kết hợp query, lấy data từ table khác |
| Blind (boolean) | Không thấy output, dựa vào TRUE/FALSE response |
| Blind (time-based) | Dùng SLEEP/WAITFOR, dựa vào response time |
| Second-order | Payload lưu vào DB, trigger khi được dùng ở query khác |

**Prevention:** **LUÔN dùng parameterized queries / prepared statements** — KHÔNG BAO GIỜ concatenate user input vào SQL string.

> Track-specific implementations:
> - FE: See `fe-track/07-web-security/01-common-vulnerabilities.md` (Prisma, pg library)
> - BE: See `be-track/02-backend-knowledge/04-auth-security.md` (Go database/sql, sqlx)

### 🟡 Q: Explain XSS (Cross-Site Scripting)

**What:** Attacker inject malicious script vào web page → script chạy trong browser của victim.

**3 Types:**

| Type | Mô tả | Persistence |
|------|--------|-------------|
| **Stored XSS** | Script lưu trong DB, render cho mọi user | Persistent |
| **Reflected XSS** | Script nằm trong URL, server reflect về response | Non-persistent |
| **DOM-based XSS** | Script modify DOM trực tiếp, không qua server | Client-side |

**Prevention layers:**
1. **Input validation** — Whitelist allowed characters
2. **Output encoding** — Escape HTML entities (`<` → `&lt;`)
3. **Content Security Policy** — Restrict script sources
4. **HttpOnly cookies** — Prevent JS access to session cookies

> Track-specific implementations:
> - FE: See `fe-track/07-web-security/01-common-vulnerabilities.md` (React JSX escaping, DOMPurify)
> - FE: See `fe-track/07-web-security/03-web-security-comprehensive.md` (CSP configuration)

### 🟡 Q: Explain CSRF (Cross-Site Request Forgery)

**What:** Attacker trick authenticated user thực hiện action không mong muốn.

**Attack flow:**
```
1. User login vào bank.com → browser lưu session cookie
2. User truy cập evil.com (attacker's site)
3. evil.com có hidden form: <form action="bank.com/transfer" method="POST">
4. Form auto-submit → browser gửi request kèm bank.com cookie
5. bank.com nhận request hợp lệ (có cookie) → thực hiện transfer
```

**Prevention methods:**

| Method | Mô tả |
|--------|--------|
| **Synchronizer Token** | Server generate random token, embed trong form, verify khi submit |
| **Double Submit Cookie** | Token trong cookie + token trong request body — compare cả hai |
| **SameSite Cookie** | `SameSite=Strict` hoặc `Lax` — browser không gửi cookie cross-site |
| **Custom Header** | Require `X-Requested-With` header — cross-origin requests không thể set custom headers |
| **Origin/Referer Check** | Verify Origin header matches expected domain |

### 🟡 Q: What is SSRF (Server-Side Request Forgery)?

**What:** Attacker trick server thực hiện HTTP request đến internal resources.

```
// Vulnerable endpoint: /api/fetch?url=https://example.com/image.png
// Attack: /api/fetch?url=http://169.254.169.254/latest/meta-data/
//         → Server fetches AWS metadata (IAM credentials!)
```

**Prevention:**
- Whitelist allowed URLs/domains
- Block private IP ranges (10.x, 172.16-31.x, 192.168.x, 169.254.x)
- Disable HTTP redirects
- Use network-level segmentation

---

## 9. CORS & Same-Origin Policy

### 🟡 Q: What is Same-Origin Policy (SOP)?

**Origin** = scheme + host + port

```
https://example.com:443/path
  ↓         ↓         ↓
scheme    host       port
```

**SOP restrictions (Những gì BỊ CHẶN):**

| Action | Bị chặn? |
|--------|----------|
| `fetch()` / `XMLHttpRequest` cross-origin | ✅ Chặn response reading |
| `document.cookie` cross-origin | ✅ Chặn |
| DOM access cross-origin (`iframe.contentDocument`) | ✅ Chặn |
| `<img>`, `<script>`, `<link>` embedding | ❌ Cho phép |
| Form submission (`<form action="...">`) | ❌ Cho phép (→ đây là lý do CSRF tồn tại) |

### 🟡 Q: How does CORS work?

**CORS** (Cross-Origin Resource Sharing) — cơ chế cho phép server opt-in để cho cross-origin requests.

**Simple request** (GET/POST với standard headers):
```
Client → Server: Origin: https://app.com
Server → Client: Access-Control-Allow-Origin: https://app.com
```

**Preflight request** (PUT/DELETE, custom headers, non-standard Content-Type):
```
1. Browser gửi OPTIONS request (preflight):
   Origin: https://app.com
   Access-Control-Request-Method: PUT
   Access-Control-Request-Headers: X-Custom-Header

2. Server respond:
   Access-Control-Allow-Origin: https://app.com
   Access-Control-Allow-Methods: GET, PUT, POST, DELETE
   Access-Control-Allow-Headers: X-Custom-Header
   Access-Control-Max-Age: 86400

3. Browser gửi actual PUT request
```

**Key headers:**

| Header | Direction | Mô tả |
|--------|-----------|--------|
| `Origin` | Request | Browser gửi, cho biết origin của request |
| `Access-Control-Allow-Origin` | Response | Server cho phép origin nào |
| `Access-Control-Allow-Methods` | Response | HTTP methods được phép |
| `Access-Control-Allow-Headers` | Response | Custom headers được phép |
| `Access-Control-Allow-Credentials` | Response | Cho phép gửi cookies cross-origin |
| `Access-Control-Max-Age` | Response | Cache preflight response bao lâu (seconds) |

**Common mistakes:**
- ❌ `Access-Control-Allow-Origin: *` + `Access-Control-Allow-Credentials: true` → Browser sẽ REJECT
- ❌ Reflect `Origin` header without whitelist → any site can make credentialed requests
- ✅ Maintain explicit whitelist of allowed origins

---

## 10. Encryption & Network Security Fundamentals

### 🟡 Q: Encryption in transit vs at rest?

| | In Transit | At Rest |
|--|-----------|---------|
| **What** | Data đang di chuyển (network) | Data đang lưu trữ (disk/DB) |
| **Protocol** | TLS 1.3 | AES-256 |
| **Example** | HTTPS, mTLS between services | Database encryption, file encryption |

**TLS 1.3 improvements over 1.2:**
- 1-RTT handshake (vs 2-RTT in TLS 1.2)
- 0-RTT resumption (with security trade-offs)
- Removed insecure algorithms (RC4, 3DES, SHA-1)
- Perfect Forward Secrecy (PFS) mandatory

**Key hierarchy:**
```
Master Key (HSM/KMS)
  └── Data Encryption Key (DEK) — encrypts actual data
        └── Encrypted data on disk
```

### 🟡 Q: What is mTLS (Mutual TLS)?

| | One-way TLS | Mutual TLS (mTLS) |
|--|------------|-------------------|
| Client verifies server | ✅ | ✅ |
| Server verifies client | ❌ | ✅ |
| Use case | Browser → Web server | Service → Service (microservices) |

> In microservice architectures, mTLS ensures both sides of every connection are verified. Service meshes (Istio, Envoy) automate mTLS certificate rotation.

---

## 11. Access Control Models — Mô hình phân quyền

### 🔴 Q: Compare RBAC, ABAC, and ReBAC

| Model | Mô tả | Ví dụ |
|-------|--------|-------|
| **RBAC** (Role-Based) | Quyền gắn với role, user được assign role | Admin, Editor, Viewer |
| **ABAC** (Attribute-Based) | Quyền dựa trên attributes (user, resource, environment) | "Allow if user.dept == resource.dept AND time < 18:00" |
| **PBAC** (Policy-Based) | Policies written in language (Rego, Cedar) | OPA (Open Policy Agent) |
| **ReBAC** (Relationship-Based) | Quyền dựa trên relationship graph | Google Zanzibar — "user:alice is editor of doc:123" |

**RBAC hierarchy:**
```
Super Admin → Admin → Editor → Viewer
     ↓          ↓        ↓        ↓
  All perms  Manage   Create/   Read
             users    Edit      only
```

**ReBAC / Zanzibar tuple format:**
```
object#relation@subject
document:budget#editor@user:alice
document:budget#viewer@group:finance#member
```

> **Khi nào dùng gì?**
> - RBAC: đủ cho hầu hết apps (< 10 roles)
> - ABAC: complex policies, context-dependent access
> - ReBAC: Google-scale, hierarchical permissions, sharing features

---

## 12. Secrets Management — Quản lý bí mật

### 🔴 Q: Where should you store secrets?

| Method | Security | Khi nào dùng |
|--------|----------|-------------|
| ❌ Hardcoded in source | Terrible | NEVER |
| ⚠️ Environment variables | Basic | Simple deployments, development |
| ✅ Cloud Secret Manager | Good | AWS Secrets Manager, GCP Secret Manager |
| ✅ HashiCorp Vault | Best | Enterprise, dynamic secrets, auto-rotation |
| ✅ K8s Sealed Secrets | Good | Kubernetes deployments |

**Principles:**
1. Never commit secrets to git (use `.env` in `.gitignore`)
2. Rotate secrets regularly (automate with Vault/cloud providers)
3. Use different secrets per environment (dev/staging/prod)
4. Audit secret access (who accessed what, when)
5. Encrypt secrets at rest in config stores

---

## Cross-Reference Map

| Shared Topic | FE Implementation | BE Implementation |
|-------------|-------------------|-------------------|
| SQL Injection | `fe-track/07-web-security/01-common-vulnerabilities.md` (Prisma) | `be-track/02-backend-knowledge/04-auth-security.md` (database/sql) |
| XSS Prevention | `fe-track/07-web-security/01-common-vulnerabilities.md` (React JSX) | `be-track/02-backend-knowledge/04-auth-security.md` (template escaping) |
| CSRF Prevention | `fe-track/07-web-security/03-web-security-comprehensive.md` (Next.js) | `be-track/02-backend-knowledge/04-auth-security.md` (Go middleware) |
| JWT Implementation | `fe-track/07-web-security/02-authentication.md` (jsonwebtoken) | `be-track/02-backend-knowledge/04-auth-security.md` (Go JWT libraries) |
| OAuth 2.0 Client | `fe-track/07-web-security/02-authentication.md` (TS/fetch) | `be-track/02-backend-knowledge/04-auth-security.md` (Go HTTP handlers) |
| CORS Configuration | `fe-track/07-web-security/03-web-security-comprehensive.md` (Next.js headers) | `be-track/02-backend-knowledge/04-auth-security.md` (rs/cors middleware) |
| Rate Limiting | `fe-track/07-web-security/01-common-vulnerabilities.md` (express-rate-limit) | `be-track/02-backend-knowledge/04-auth-security.md` (Go middleware, Redis) |
| CSP | `fe-track/07-web-security/03-web-security-comprehensive.md` (detailed) | N/A (FE-specific) |
| mTLS | N/A (BE-specific) | `be-track/02-backend-knowledge/04-auth-security.md` |
| Secrets Management | N/A | `be-track/02-backend-knowledge/04-auth-security.md` (Vault, K8s) |
