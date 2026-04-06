# Security Mind Map - Sơ Đồ Bảo Mật

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp tất cả kiến thức Security để review nhanh trước phỏng vấn

---

## Security Complete Mind Map

```
                                    ┌──────────────────────────────────────────────────────────┐
                                    │                       SECURITY                             │
                                    └──────────────────────────────────────────────────────────┘
                                                                │
         ┌──────────────────┬───────────────────────────────── ┼──────────────────┬─────────────────┐
         │                  │                                   │                  │                  │
 ┌───────▼──────┐  ┌────────▼───────┐                ┌─────────▼──────┐  ┌────────▼───────┐ ┌───────▼──────┐
 │     WEB      │  │ AUTHENTICATION │                │ AUTHORIZATION  │  │  HTTPS / TLS   │ │  API         │
 │   SECURITY   │  │                │                │                │  │                │ │  SECURITY    │
 └───────┬──────┘  └────────┬───────┘                └─────────┬──────┘  └────────┬───────┘ └───────┬──────┘
         │                  │                                   │                  │                  │
   ┌─────┼─────┐      ┌─────┼─────┐                    ┌───────┼───────┐          │           ┌──────┼──────┐
  XSS  CSRF SQLi     JWT OAuth2 Session              RBAC  ABAC  PDP           TLS Certs    Rate  Auth  CORS
```

---

## 1. Web Security / Bảo Mật Web

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 WEB SECURITY                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                    XSS (Cross-Site Scripting)                                 │   │
│  ├──────────────────────────────────┬──────────────────────────────────────────┤   │
│  │          TYPES                   │               PREVENTION                  │   │
│  ├──────────────────────────────────┼──────────────────────────────────────────┤   │
│  │                                  │                                          │   │
│  │ Reflected XSS:                   │ 1. Output encoding/escaping              │   │
│  │   Payload in URL/request,        │    < → &lt;  > → &gt;  " → &quot;       │   │
│  │   reflected in response          │                                          │   │
│  │                                  │ 2. Content-Security-Policy header        │   │
│  │ Stored XSS:                      │    CSP: script-src 'self'               │   │
│  │   Payload saved to DB,           │                                          │   │
│  │   served to all users            │ 3. HTTPOnly cookies                      │   │
│  │                                  │    (no JS access to cookies)             │   │
│  │ DOM XSS:                         │                                          │   │
│  │   Client-side JS writes          │ 4. Use textContent not innerHTML         │   │
│  │   attacker-controlled data       │                                          │   │
│  │   to DOM                         │ 5. DOMPurify for user HTML              │   │
│  │                                  │                                          │   │
│  └──────────────────────────────────┴──────────────────────────────────────────┘   │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                    CSRF (Cross-Site Request Forgery)                          │   │
│  ├──────────────────────────────────┬──────────────────────────────────────────┤   │
│  │           ATTACK                 │               PREVENTION                  │   │
│  ├──────────────────────────────────┼──────────────────────────────────────────┤   │
│  │                                  │                                          │   │
│  │ Malicious site makes browser     │ 1. CSRF tokens (synchronizer pattern)    │   │
│  │ send authenticated request to    │    Server-issued, validated per-request  │   │
│  │ victim site                      │                                          │   │
│  │                                  │ 2. SameSite cookie attribute             │   │
│  │ <img src="bank.com/transfer      │    SameSite=Strict / Lax / None          │   │
│  │   ?to=attacker&amount=1000">     │                                          │   │
│  │                                  │ 3. Double Submit Cookie pattern          │   │
│  │                                  │                                          │   │
│  │                                  │ 4. Custom request headers                │   │
│  │                                  │    (X-Requested-With)                    │   │
│  │                                  │                                          │   │
│  └──────────────────────────────────┴──────────────────────────────────────────┘   │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                         SQL INJECTION                                         │   │
│  ├──────────────────────────────────┬──────────────────────────────────────────┤   │
│  │           ATTACK                 │               PREVENTION                  │   │
│  ├──────────────────────────────────┼──────────────────────────────────────────┤   │
│  │                                  │                                          │   │
│  │ Input: ' OR '1'='1              │ 1. Parameterized queries / prepared stmts│   │
│  │                                  │    db.Query("SELECT * WHERE id = ?", id) │   │
│  │ Resulting query:                 │                                          │   │
│  │ SELECT * FROM users              │ 2. ORM (handles escaping automatically)  │   │
│  │   WHERE user='' OR '1'='1'      │                                          │   │
│  │                                  │ 3. Input validation & allowlisting       │   │
│  │ Types:                           │                                          │   │
│  │ • Classic (error-based)          │ 4. Least privilege DB user               │   │
│  │ • Blind (boolean/time-based)     │                                          │   │
│  │ • Union-based                    │ 5. WAF (Web Application Firewall)        │   │
│  │ • Out-of-band                    │                                          │   │
│  └──────────────────────────────────┴──────────────────────────────────────────┘   │
│                                                                                       │
│  CORS (Cross-Origin Resource Sharing):                                               │
│  Origin = scheme + host + port                                                       │
│  Same-origin policy: JS can only read responses from same origin by default         │
│                                                                                       │
│  CORS Headers:                                                                       │
│  Access-Control-Allow-Origin: https://trusted.com                                   │
│  Access-Control-Allow-Methods: GET, POST, PUT                                       │
│  Access-Control-Allow-Headers: Content-Type, Authorization                          │
│  Access-Control-Allow-Credentials: true                                             │
│                                                                                       │
│  Preflight: Browser sends OPTIONS request first for non-simple requests             │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication / Xác Thực

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               AUTHENTICATION                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                              JWT (JSON Web Token)                             │   │
│  ├──────────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                                │   │
│  │  Structure: Header.Payload.Signature (Base64URL encoded)                      │   │
│  │                                                                                │   │
│  │  Header:  { "alg": "HS256", "typ": "JWT" }                                   │   │
│  │  Payload: { "sub": "userId", "iat": 1234, "exp": 5678, "role": "admin" }     │   │
│  │  Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)       │   │
│  │                                                                                │   │
│  │  Pros:                               Cons:                                    │   │
│  │  • Stateless (no server storage)    • Cannot invalidate before expiry        │   │
│  │  • Works across services/microsvcs  • Payload visible (not encrypted)        │   │
│  │  • Carries claims                   • Larger than session ID                 │   │
│  │                                                                                │   │
│  │  Best practices:                                                               │   │
│  │  • Short expiry (15min) + refresh token                                      │   │
│  │  • Store in httpOnly cookie (not localStorage)                               │   │
│  │  • Use RS256 (asymmetric) for microservices                                  │   │
│  │  • Validate all claims: exp, iss, aud                                        │   │
│  │  • Revocation: token blacklist in Redis, rotate signing keys                 │   │
│  │                                                                                │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                           OAuth 2.0 / OIDC                                    │   │
│  ├──────────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                                │   │
│  │  Roles: Resource Owner, Client, Authorization Server, Resource Server        │   │
│  │                                                                                │   │
│  │  Flows:                                                                        │   │
│  │  ┌────────────────────────────┬───────────────────────────────────────────┐  │   │
│  │  │ Authorization Code + PKCE  │ Most secure for web/mobile apps           │  │   │
│  │  │ Client Credentials         │ Machine-to-machine (no user)              │  │   │
│  │  │ Device Code                │ Input-constrained devices (TV, CLI)       │  │   │
│  │  │ Implicit (deprecated)      │ Was for SPAs, now use Auth Code + PKCE   │  │   │
│  │  └────────────────────────────┴───────────────────────────────────────────┘  │   │
│  │                                                                                │   │
│  │  PKCE (Proof Key for Code Exchange):                                          │   │
│  │  code_verifier = random string                                                │   │
│  │  code_challenge = BASE64URL(SHA256(code_verifier))                           │   │
│  │                                                                                │   │
│  │  OIDC: OAuth 2.0 + Identity layer                                             │   │
│  │  Returns ID token (JWT) with user info                                        │   │
│  │                                                                                │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│  SESSION-BASED vs TOKEN-BASED:                                                       │
│  ┌──────────────────────────────┬──────────────────────────────────────────────┐   │
│  │     Session-based            │            Token-based (JWT)                 │   │
│  ├──────────────────────────────┼──────────────────────────────────────────────┤   │
│  │ Server stores session state  │ Client stores token                          │   │
│  │ SessionID in cookie          │ Sent in Authorization: Bearer <token>        │   │
│  │ Easy invalidation            │ Stateless, scales horizontally               │   │
│  │ Works for monoliths          │ Good for microservices, APIs                 │   │
│  │ Sticky sessions for scaling  │ Revocation is harder                         │   │
│  └──────────────────────────────┴──────────────────────────────────────────────┘   │
│                                                                                       │
│  PASSWORD HASHING:                                                                   │
│  ❌ MD5, SHA1, SHA256 (not for passwords — too fast, rainbow tables)                 │
│  ✅ bcrypt (work factor), scrypt, argon2id (memory-hard, recommended)               │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Authorization / Phân Quyền

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                AUTHORIZATION                                          │
├──────────────────────────────────────┬──────────────────────────────────────────────┤
│         RBAC                         │                ABAC                           │
│  (Role-Based Access Control)         │  (Attribute-Based Access Control)            │
├──────────────────────────────────────┼──────────────────────────────────────────────┤
│                                      │                                               │
│  Users → Roles → Permissions         │  Policy: Subject + Resource + Action + Env   │
│                                      │                                               │
│  User "Alice" has Role "editor"      │  Example policy:                              │
│  Role "editor" has Permission        │  IF user.dept == resource.dept               │
│    "post:create", "post:edit"        │  AND action == "read"                         │
│                                      │  AND time.hour BETWEEN 9 AND 17              │
│  Hierarchical RBAC:                  │  THEN ALLOW                                  │
│  admin ⊇ editor ⊇ viewer             │                                               │
│                                      │  More expressive but complex                 │
│  Pros: Simple, auditable             │  Pros: Fine-grained, context-aware          │
│  Cons: Role explosion risk           │  Cons: Complex policy management             │
│                                      │                                               │
├──────────────────────────────────────┴──────────────────────────────────────────────┤
│                            POLICY ENFORCEMENT                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  PEP (Policy Enforcement Point) ──request──▶ PDP (Policy Decision Point)           │
│                                               │                                      │
│                                               ├── Policy: RBAC rules                │
│                                               ├── PAP: Policy Administration Point  │
│                                               └── PIP: Policy Info Point            │
│                                                                                       │
│  Tools: OPA (Open Policy Agent), Casbin, Auth0 FGA, AWS IAM                        │
│                                                                                       │
│  Principle of Least Privilege:                                                       │
│  • Grant minimum permissions needed                                                 │
│  • Deny by default                                                                  │
│  • Regular access reviews                                                           │
│  • Separate duties                                                                  │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. HTTPS / TLS / Giao Thức Bảo Mật

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               HTTPS / TLS                                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  TLS HANDSHAKE (TLS 1.3 simplified):                                                │
│  ┌──────────────┐                               ┌──────────────┐                   │
│  │   CLIENT     │                               │    SERVER    │                   │
│  └──────┬───────┘                               └──────┬───────┘                   │
│         │──── ClientHello (supported ciphers) ────────▶│                           │
│         │                                               │                           │
│         │◀─── ServerHello + Certificate ───────────────│                           │
│         │     (server's public key)                     │                           │
│         │                                               │                           │
│         │──── Key Exchange (ECDHE) ─────────────────── │                           │
│         │     Verify certificate chain                  │                           │
│         │                                               │                           │
│         │◀═══ Encrypted Application Data ══════════════▶│                           │
│                                                                                      │
│  Certificates:                                                                       │
│  • X.509 certificate: public key + identity + CA signature                         │
│  • Chain of trust: Leaf → Intermediate CA → Root CA                                │
│  • Let's Encrypt: free automated certificates                                       │
│                                                                                       │
│  TLS Versions:                                                                       │
│  TLS 1.0/1.1 ← deprecated (POODLE, BEAST attacks)                                  │
│  TLS 1.2     ← widely supported, still okay                                        │
│  TLS 1.3     ← preferred: fewer round trips, no weak ciphers                       │
│                                                                                       │
│  HSTS (HTTP Strict Transport Security):                                             │
│  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload            │
│  Browser remembers: always use HTTPS for this domain                                │
│                                                                                       │
│  SECURITY HEADERS:                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │  Content-Security-Policy      ← mitigate XSS                                 │   │
│  │  X-Frame-Options: DENY        ← prevent clickjacking                         │   │
│  │  X-Content-Type-Options: nosniff ← prevent MIME sniffing                     │   │
│  │  Referrer-Policy              ← control referrer info                        │   │
│  │  Permissions-Policy           ← control browser features                     │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Security / Bảo Mật API

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                API SECURITY                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  RATE LIMITING:                                                                      │
│  ┌────────────────────┬──────────────────────────────────────────────────────────┐  │
│  │  Fixed Window      │  Count reqs in fixed time window. Simple but spike risk  │  │
│  │  Sliding Window    │  Rolling window, smoother. Use Redis sorted set          │  │
│  │  Token Bucket      │  Tokens replenish at fixed rate. Allow bursts            │  │
│  │  Leaky Bucket      │  Queue requests, process at fixed rate. Smooth output    │  │
│  └────────────────────┴──────────────────────────────────────────────────────────┘  │
│                                                                                       │
│  Rate limit by: IP, user ID, API key, endpoint                                      │
│  Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset               │
│  Response: 429 Too Many Requests + Retry-After                                      │
│                                                                                       │
│  INPUT VALIDATION:                                                                   │
│  • Validate type, length, format, range                                             │
│  • Allowlist (whitelist) not blocklist                                              │
│  • Validate at API boundary, not just DB layer                                     │
│  • Use schema validation: JSON Schema, Zod, class-validator                        │
│                                                                                       │
│  API KEY SECURITY:                                                                   │
│  • Hash API keys before storing (like passwords)                                   │
│  • Scope keys to specific operations                                               │
│  • Rotate keys regularly                                                           │
│  • Transmit in header, never in URL (logged)                                       │
│                                                                                       │
│  SENSITIVE DATA:                                                                     │
│  • Never log passwords, tokens, card numbers, PII                                  │
│  • Mask in responses: card = "****1234"                                            │
│  • Encrypt at rest (AES-256) and in transit (TLS)                                 │
│  • Use secrets manager (Vault, AWS Secrets Manager)                                │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. OWASP Top 10 / Top 10 Lỗ Hổng Phổ Biến

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              OWASP TOP 10 (2021)                                      │
├────┬──────────────────────────────────────┬─────────────────────────────────────────┤
│ #  │           Vulnerability              │              Prevention                 │
├────┼──────────────────────────────────────┼─────────────────────────────────────────┤
│ A1 │ Broken Access Control               │ Enforce on server, deny by default      │
│ A2 │ Cryptographic Failures              │ Use TLS, strong algorithms, no MD5/SHA1 │
│ A3 │ Injection (SQL, LDAP, OS)           │ Parameterized queries, input validation │
│ A4 │ Insecure Design                     │ Threat modeling, secure design patterns │
│ A5 │ Security Misconfiguration           │ Harden configs, disable defaults, patch │
│ A6 │ Vulnerable & Outdated Components    │ SCA tools, keep deps updated (Snyk)     │
│ A7 │ Identification & Authentication     │ MFA, strong passwords, anti-brute force │
│ A8 │ Software & Data Integrity Failures  │ Verify signatures, secure CI/CD         │
│ A9 │ Security Logging & Monitoring       │ Log auth, alerts, incident response     │
│ A10│ Server-Side Request Forgery (SSRF)  │ Allowlist URLs, disable redirects       │
├────┴──────────────────────────────────────┴─────────────────────────────────────────┤
│                                                                                       │
│  SSRF (Server-Side Request Forgery):                                                │
│  • Attacker tricks server into making requests to internal resources                │
│  • Example: fetch("http://169.254.169.254/metadata")  ← AWS metadata endpoint      │
│  • Prevention: allowlist outbound URLs, block cloud metadata IPs, no URL params     │
│                                                                                       │
│  IDOR (Insecure Direct Object Reference):                                           │
│  • GET /api/orders/12345 ← user can enumerate/access other orders                  │
│  • Prevention: check ownership in every request, use UUIDs over sequential IDs     │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Quick Reference / Tham Khảo Nhanh

| Topic            | Key Concept                          | Common Interview Question      |
| ---------------- | ------------------------------------ | ------------------------------ |
| XSS              | Inject script into web page          | Reflected vs Stored XSS        |
| CSRF             | Forged requests using user's session | SameSite cookie vs CSRF token  |
| SQL Injection    | Malicious SQL in user input          | Why use prepared statements?   |
| JWT              | Stateless token with claims          | JWT vs session cookies         |
| OAuth 2.0        | Delegated authorization framework    | Authorization Code + PKCE flow |
| RBAC             | Role-based permission model          | RBAC vs ABAC                   |
| TLS              | Encrypted transport layer            | What happens in TLS handshake? |
| Rate Limiting    | Prevent API abuse                    | Token bucket vs sliding window |
| OWASP A1         | Broken Access Control                | How to prevent IDOR?           |
| Password hashing | Argon2id, bcrypt, scrypt             | Why not SHA256 for passwords?  |

---

> **Sử dụng:** In ra hoặc lưu file này để review nhanh trước phỏng vấn
