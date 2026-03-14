# Security Fundamentals — Nền tảng Bảo mật

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

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

---

## 13. Security Models — Mô hình bảo mật kinh điển

### 🟡 Q: What are Bell-LaPadula, Biba, and Clark-Wilson models? `[Mid]`

**A:** Đây là các mô hình nền tảng giúp định nghĩa policy bảo mật một cách có hệ thống.

| Model | Trọng tâm | Quy tắc chính |
|------|-----------|---------------|
| Bell-LaPadula | Confidentiality | No Read Up, No Write Down |
| Biba | Integrity | No Read Down, No Write Up |
| Clark-Wilson | Integrity trong business systems | Chỉ cập nhật qua quy trình hợp lệ + audit |

### 🟡 Q: Bell-LaPadula được dùng để giải quyết vấn đề gì? `[Mid]`

**A:** Ngăn rò rỉ thông tin từ mức phân loại cao xuống thấp.

```text
Public < Internal < Confidential < Secret
User level Internal không được read Secret
User level Secret không được write Public
```

### 🟡 Q: Biba model khác Bell-LaPadula ở điểm nào? `[Mid]`

**A:** Biba bảo vệ tính toàn vẹn dữ liệu, tránh dữ liệu trust thấp làm bẩn dữ liệu trust cao.

### 🔴 Q: Why Clark-Wilson is practical for enterprise workflows? `[Senior]`

**A:** Vì nó phản ánh thực tế doanh nghiệp: thay đổi dữ liệu quan trọng phải qua transaction được kiểm soát, có separation of duties và audit trail.

---

## 14. Access Control Models — Mô hình kiểm soát truy cập

### 🟢 Q: What is DAC? `[Junior]`

**A:** DAC (Discretionary Access Control) cho phép owner tài nguyên tự cấp quyền cho người khác.

### 🟢 Q: What is MAC? `[Junior]`

**A:** MAC (Mandatory Access Control) dùng label và policy tập trung. User không tự chỉnh policy.

### 🟡 Q: What is RBAC? `[Mid]`

**A:** RBAC gán quyền vào role và gán role cho user. Dễ quản trị, dễ audit trong hệ thống doanh nghiệp.

### 🟡 Q: What is ABAC? `[Mid]`

**A:** ABAC quyết định truy cập bằng policy dựa trên attributes của user/resource/environment/action.

```rego
allow {
  input.user.team == input.resource.team
  input.user.clearance >= input.resource.classification
}
```

### 🔴 Q: Compare RBAC, ABAC, MAC, DAC `[Senior]`

| Model | Ưu điểm | Nhược điểm | Khi dùng |
|------|---------|------------|---------|
| DAC | Linh hoạt | Dễ cấp quyền sai | Chia sẻ ad-hoc |
| MAC | Rất chặt | Khó vận hành | Môi trường high-security |
| RBAC | Đơn giản, phổ biến | Role explosion | App doanh nghiệp phổ thông |
| ABAC | Linh hoạt theo ngữ cảnh | Policy phức tạp | Zero trust, multi-tenant |

---

## 15. Identity and Access Management (IAM) Concepts

### 🟢 Q: What is IAM? `[Junior]`

**A:** IAM quản lý danh tính, xác thực, phân quyền, và audit xuyên suốt vòng đời account.

### 🟡 Q: Identity vs principal vs credential? `[Mid]`

| Term | Mô tả |
|------|------|
| Identity | Danh tính logic của user/service |
| Principal | Identity đã được xác thực trong request context |
| Credential | Bằng chứng xác thực: password/key/cert/token |

### 🟡 Q: What are SSO and federation? `[Mid]`

**A:** SSO cho phép đăng nhập một lần dùng nhiều app; federation cho phép app tin cậy identity từ IdP bên ngoài.

### 🔴 Q: Explain Joiner-Mover-Leaver lifecycle `[Senior]`

| Phase | Risk nếu làm kém |
|------|-------------------|
| Joiner | Cấp quyền quá rộng |
| Mover | Privilege creep |
| Leaver | Tài khoản mồ côi bị lạm dụng |

### 🔴 Q: What is PAM in IAM architecture? `[Senior]`

**A:** PAM quản lý quyền đặc quyền: just-in-time access, session recording, approval flow, break-glass account governance.

---

## 16. Security Testing Types — SAST, DAST, Penetration Testing

### 🟢 Q: What is SAST? `[Junior]`

**A:** SAST quét mã nguồn/binary tĩnh để phát hiện lỗi bảo mật sớm trong CI.

### 🟢 Q: What is DAST? `[Junior]`

**A:** DAST kiểm thử ứng dụng đang chạy từ góc nhìn bên ngoài để tìm runtime issues.

### 🟡 Q: SAST vs DAST differences `[Mid]`

| Tiêu chí | SAST | DAST |
|---------|------|------|
| Thời điểm | Sớm trong pipeline | Môi trường chạy/staging/prod-safe |
| Mức nhìn | Code-level | Behavior/runtime-level |
| Lỗi phát hiện tốt | Injection patterns, unsafe APIs | Auth bypass, misconfiguration |

### 🟡 Q: What is penetration testing? `[Mid]`

**A:** Pen test là hoạt động mô phỏng attacker do chuyên gia thực hiện, thường chain nhiều lỗ hổng để chứng minh impact.

### 🔴 Q: Why combine all three testing types? `[Senior]`

**A:** Vì không có một kỹ thuật nào phủ hết attack surface. Kết hợp giúp giảm điểm mù ở từng layer.

---

## 17. Security in SDLC — DevSecOps Basics

### 🟢 Q: What is DevSecOps? `[Junior]`

**A:** DevSecOps là tích hợp bảo mật vào mọi giai đoạn SDLC thay vì kiểm tra ở cuối.

### 🟡 Q: Security activities by phase `[Mid]`

| Phase | Hoạt động bảo mật |
|------|-------------------|
| Requirements | Data classification, compliance, abuse cases |
| Design | Threat modeling, trust boundaries |
| Coding | Secure coding + review checklist |
| Build | SAST, SCA, secret scan |
| Test | DAST, authorization tests |
| Release | Signed artifacts, security gates |
| Operate | Monitoring, incident response, patching |

### 🟡 Q: What is threat modeling and why shift-left? `[Mid]`

**A:** Threat modeling giúp phát hiện attack path sớm khi chi phí sửa còn thấp, tránh redesign muộn.

### 🔴 Q: Which DevSecOps metrics matter? `[Senior]`

| Metric | Ý nghĩa |
|-------|--------|
| MTTD | Thời gian phát hiện sự cố |
| MTTR | Thời gian xử lý sự cố |
| Vulnerability SLA | Tỷ lệ vá đúng hạn |
| Patch latency | Độ trễ cập nhật dependency critical |

---

## 18. Additional Interview Q&A — Câu hỏi mở rộng

### 🟢 Q: Why security is a process, not a one-time project? `[Junior]`

**A:** Vì attack landscape thay đổi liên tục, dependency thay đổi liên tục, và cấu hình có thể drift theo thời gian.

### 🟢 Q: What is the simplest high-impact security action for a small team? `[Junior]`

**A:** Bắt buộc MFA cho admin accounts + bật secret scanning trong CI.

### 🟡 Q: How to prioritize vulnerabilities in backlog? `[Mid]`

**A:** Dựa trên exploitability, exposure, data sensitivity, và blast radius; không chỉ nhìn severity label.

### 🟡 Q: What is security debt? `[Mid]`

**A:** Security debt là nợ tích lũy do trì hoãn hardening/patching/policy cleanup, khiến rủi ro incident tăng dần.

### 🔴 Q: Explain zero trust in practical terms `[Senior]`

**A:** Không tin implicit theo network. Mọi request phải authenticate, authorize theo policy context-aware và log đầy đủ.

### 🔴 Q: Incident response lifecycle quickly `[Senior]`

**A:** Preparation -> Identification -> Containment -> Eradication -> Recovery -> Lessons Learned.

---

## 19. Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: Compare Bell-LaPadula and Biba with one real system example each `[Mid]`
### Q2: When does RBAC become insufficient? `[Mid]`
### Q3: How to avoid role explosion in a growing organization? `[Senior]`
### Q4: How would you roll out DevSecOps in a 20-engineer team? `[Senior]`
### Q5: Why SAST findings need risk-context triage? `[Mid]`
### Q6: Design IAM offboarding controls for contractors `[Senior]`
### Q7: What security test should be mandatory before production release? `[Junior]`
### Q8: How do you measure whether security posture improved quarter-over-quarter? `[Senior]`

---

## Cross-References mở rộng

- Cryptography & TLS: `docs/shared/04-security/02-cryptography-and-protocols.md`
- OWASP web attacks: `docs/shared/04-security/03-web-security-owasp.md`
- Networking: `docs/shared/01-cs-fundamentals/networking-theory.md`
- System design: `docs/shared/02-system-design/system-design-theory.md`
- Software engineering process: `docs/shared/05-software-engineering/software-engineering-theory.md`
- FE module security: `docs/fe-track/modules/08-security.md`
- BE auth security: `docs/be-track/02-backend-knowledge/04-auth-security.md`

---

## 20. Practice Drill Bank

### 🟢 Q: Security fundamentals drill #1? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #2? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #3? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #4? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #5? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #6? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #7? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #8? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #9? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #10? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #11? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #12? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #13? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #14? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #15? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #16? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #17? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #18? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #19? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #20? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #21? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #22? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #23? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟢 Q: Security fundamentals drill #24? `[Junior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #25? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #26? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #27? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #28? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #29? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #30? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #31? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #32? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #33? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #34? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #35? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #36? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #37? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #38? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #39? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #40? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #41? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #42? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #43? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #44? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #45? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #46? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🟡 Q: Security fundamentals drill #47? `[Mid]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #48? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #49? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #50? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #51? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #52? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #53? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #54? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #55? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #56? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #57? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #58? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #59? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #60? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #61? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #62? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #63? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #64? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #65? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #66? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #67? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #68? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #69? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

### 🔴 Q: Security fundamentals drill #70? `[Senior]`

**A:** Trả lời theo framework: xác định asset cần bảo vệ, trust boundary, threat, control kỹ thuật, control vận hành, và cách verify hiệu quả.

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is the CIA triad in security? / CIA triad trong security là gì? 🟢 Junior

**A:** Foundation of information security: **Confidentiality** (data accessible only to authorized parties), **Integrity** (data accurate and unmodified), **Availability** (systems accessible when needed). Security decisions balance all three.

```
CIA Triad:
┌─────────────────────────────────────┐
│ Confidentiality: data private        │ Threats: breach, eavesdrop
│ Integrity: data tamper-evident       │ Threats: MITM, SQLi, corruption
│ Availability: system accessible      │ Threats: DoS, hardware failure
└─────────────────────────────────────┘
```

Vietnamese explanation: Ví dụ: encryption at rest = Confidentiality. Checksum/digital signature = Integrity. Load balancer + redundancy = Availability. Conflict: very strong encryption (great C) có thể slow system (hurts A). Interview: "Secure a REST API" → answer by CIA dimension.

---

### Q: What is the difference between authentication and authorization? / AuthN vs AuthZ? 🟢 Junior

**A:** **Authentication (AuthN)**: verifying *who* you are — identity. **Authorization (AuthZ)**: verifying *what* you're allowed to do — permissions. HTTP status: 401 Unauthorized = authentication failed. 403 Forbidden = authenticated but not authorized.

```
Request flow:
1. AuthN: JWT decoded → user is 'alice', role='user'
2. AuthZ: alice requests DELETE /admin/users/123
          → check: role='user' not 'admin' → 403 Forbidden
```

Vietnamese explanation: Common mistake: confuse 401 vs 403. 401 = not logged in or expired token. 403 = logged in but wrong permissions. JWT: self-contained token includes claims (roles, permissions) — no DB lookup for AuthZ. Layered: API Gateway (coarse-grained: is endpoint accessible to role?) + Service layer (fine-grained: does user own resource?).

---

### Q: What is defense in depth? / Defense in depth là gì? 🟡 Mid

**A:** Layer multiple independent security controls. If one layer fails, others still protect. No single measure is perfect.

```
Web app defense layers:
WAF           → block known attack patterns
DDoS protection → availability
Authentication  → identity verification
Authorization   → permission checks
Input validation → injection prevention
Encryption      → data protection
Audit logging   → detection + forensics
```

Vietnamese explanation: Principle of least privilege: mỗi component chỉ có permissions cần thiết. Zero-trust: "never trust, always verify" — authenticate every request kể cả internal. Network segmentation: services không access DB directly unless needed. Interview: "How secure microservices?" → answer layer by layer.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| CIA triad | 🟢 | Confidentiality+Integrity+Availability; all decisions balance these |
| AuthN vs AuthZ | 🟢 | AuthN=who (401); AuthZ=what permissions (403) |
| Defense in depth | 🟡 | Multiple independent layers; compromise one, others still protect |
