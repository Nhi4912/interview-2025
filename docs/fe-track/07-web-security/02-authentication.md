# Frontend Authentication / Xác Thực Frontend

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Web Security - Chapter 2 / Bảo Mật Web - Chương 2

---

## Overview / Tổng Quan

- Mục tiêu: hiểu rõ cách frontend phối hợp với backend để xác thực an toàn, giảm rủi ro XSS/CSRF/token leakage/session hijack.
- Trọng tâm phỏng vấn senior: trade-off giữa cookie session và token-based auth trong SPA/SSR/hybrid app.

## Related Reading / Tài Liệu Liên Quan

- [Modern Auth Patterns (Shared)](../../shared/04-security/04-modern-auth-patterns.md)
- [Security Fundamentals (Shared)](../../shared/04-security/01-security-fundamentals.md)
- [Common Vulnerabilities](./01-common-vulnerabilities.md)

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### Concept 1: Authentication vs Authorization / Xác Thực vs Phân Quyền

> 🧠 **Memory Hook**: Authentication = proving you are who you say you are (ID card at the door). Authorization = proving you're allowed to enter THIS room (room key after showing ID). Xác thực = "bạn là ai?", phân quyền = "bạn được làm gì?"

**Tại sao tồn tại? / Why does this exist?**
Web servers originally had no concept of "user" — every request was stateless and anonymous.
→ **Why?** Multiple users accessing shared resources meant servers needed to distinguish WHO was making each request.
→ **Why?** Once identity is established, different users have different access rights — a junior employee shouldn't see payroll data even after logging in.

```
Authentication Flow:
  User ──→ Login (credentials) ──→ Server verifies identity ──→ Session/Token issued
                                                                       │
Authorization Flow:                                                    ↓
  Request + Token ──→ Server checks permissions ──→ Allow/Deny resource access
                              │
                   (Backend enforces — frontend only reflects!)
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng frontend route guard là đủ để chặn quyền | Client code có thể bị bypass, DevTools có thể xóa guard | Backend luôn phải re-validate permission tại mỗi endpoint |
| Lẫn lộn "logged in" với "authorized" | User có thể authenticated nhưng chưa có permission | Kiểm tra cả `isAuthenticated` VÀ `hasPermission(resource)` |
| Frontend quyết định role từ JWT claims | JWT claims có thể bị forged nếu verify không đúng | Backend verify JWT signature trước khi tin claims |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "sự khác biệt authentication vs authorization" hoặc "tại sao frontend không phải source of truth"
- → Nhớ đến: Frontend = presentation layer, backend = enforcement boundary
- → Mở đầu trả lời: _"Authentication answers 'who are you?' while authorization answers 'what are you allowed to do?' — and critically, frontend can only reflect authorization state, never enforce it, because client code can always be manipulated."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Security Fundamentals](../../shared/04-security/01-security-fundamentals.md)
- ➡️ Để hiểu tiếp: [Modern Auth Patterns](../../shared/04-security/04-modern-auth-patterns.md)

---

### Concept 2: Cookie-Based Auth & Flags / Xác Thực Bằng Cookie & Cờ Bảo Mật

> 🧠 **Memory Hook**: Cookie flags = 3 locks on a safe. **HttpOnly** = JS can't pick the lock. **Secure** = safe only opens over HTTPS. **SameSite** = safe won't open for requests from other websites.

**Tại sao tồn tại? / Why does this exist?**
HTTP là stateless — server không biết request thứ 2 có cùng user với request thứ 1 không.
→ **Why?** Browser cần tự động gửi "proof of identity" trên mọi request mà không cần user thao tác — cookie là cơ chế duy nhất làm được điều này.
→ **Why?** Nhưng cookie tự động gửi cũng tạo ra rủi ro: XSS có thể đọc cookie, CSRF có thể lợi dụng auto-send — nên các flags được thêm vào để giới hạn attack surface.

```
Cookie Attack Surface vs Flags:

  Attack      │  Cookie Flag  │  Mechanism
  ────────────┼───────────────┼─────────────────────────────────
  XSS         │  HttpOnly     │  document.cookie blocked for JS
  Network tap │  Secure       │  Cookie only sent over HTTPS
  CSRF        │  SameSite     │  Cookie not sent on cross-site req
  Expiry      │  Max-Age      │  Short-lived = less damage if stolen

  SameSite values:
  Strict ──→ Cookie never sent cross-site (breaks OAuth redirects)
  Lax    ──→ Cookie sent on top-level navigation GET (good default)
  None   ──→ Cookie always sent (requires Secure flag)
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng SameSite=None mà không có Secure | Browsers từ chối cookie không có Secure khi SameSite=None | Luôn pair: `SameSite=None; Secure` |
| Nghĩ HttpOnly là đủ để chống XSS | HttpOnly chỉ chặn đọc cookie, XSS vẫn có thể gọi API với cookie tự động | Kết hợp CSP + HttpOnly + SameSite |
| Dùng SameSite=Strict cho OAuth | Authorization redirect từ IdP bị chặn, login thất bại | Dùng SameSite=Lax cho auth cookies |
| Max-Age quá dài (30 ngày) không cần | Stolen cookie có thể dùng trong 30 ngày | Short-lived access cookie + long refresh cookie riêng |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: cookie flags, session security, httpOnly
- → Nhớ đến: Mỗi flag chặn một attack vector cụ thể
- → Mở đầu trả lời: _"Cookie flags are layered defenses — HttpOnly blocks XSS from reading tokens, Secure enforces HTTPS-only transmission, and SameSite with Lax or Strict prevents CSRF by controlling when the browser includes cookies in cross-site requests."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Common Vulnerabilities (XSS, CSRF)](./01-common-vulnerabilities.md)
- ➡️ Để hiểu tiếp: Concept 3 (JWT Storage Trade-offs)

---

### Concept 3: JWT — Structure, Storage & Trade-offs / JWT — Cấu Trúc, Lưu Trữ & Đánh Đổi

> 🧠 **Memory Hook**: JWT = a signed passport. Header = passport country. Payload = your identity claims. Signature = the government's stamp that can't be forged. Anyone can READ a passport, but only the issuer can SIGN it.

**Tại sao tồn tại? / Why does this exist?**
Traditional session: server phải lookup database cho mọi request — tốn I/O và khó scale horizontally.
→ **Why?** Microservices cần xác thực request mà không cần gọi về auth service mỗi lần — token cần tự chứa đủ thông tin.
→ **Why?** Nhưng nếu token tự chứa thông tin, server phải có cách verify nó chưa bị tampered — cryptographic signature giải quyết điều này.

```
JWT Structure:
  eyJhbGc...  .  eyJ1c2Vy...  .  SflKxwRJ...
  ─────────────────────────────────────────
  Header (alg)   Payload (claims)  Signature
  Base64URL      Base64URL         HMAC/RSA

  Payload example:
  {
    "sub": "user_123",        ← subject (user ID)
    "exp": 1711584000,        ← expiry (UNIX timestamp)
    "iat": 1711497600,        ← issued at
    "role": "admin"           ← custom claim
  }

Token Storage Comparison:
  Location      │ XSS Risk │ CSRF Risk │ Persistence │ Recommendation
  ──────────────┼──────────┼───────────┼─────────────┼────────────────
  localStorage  │  HIGH    │  Low      │  Yes        │  Avoid for tokens
  sessionStorage│  HIGH    │  Low      │  Tab only   │  Avoid for tokens
  httpOnly Cookie│ LOW     │  HIGH     │  Yes        │  Use + SameSite
  Memory (var)  │  LOW     │  Low      │  Page only  │  Best for access token
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Lưu access token trong localStorage | XSS script có thể `localStorage.getItem('token')` | Dùng httpOnly cookie hoặc memory variable |
| Tin rằng payload encrypted vì Base64 | Base64 là encoding, không phải encryption — ai cũng đọc được | Không đặt sensitive data trong payload (chỉ user ID + role) |
| Access token expiry quá dài (24h+) | Token bị steal có thể dùng 24h | Access token 15 phút, refresh token riêng |
| Không verify `alg` header | "alg: none" attack — token không cần signature | Backend luôn whitelist algorithm (HS256/RS256) |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: JWT vs session, token storage, stateless auth
- → Nhớ đến: JWT trade-off = scalability vs revocability. Session trade-off = revocable vs requires DB lookup
- → Mở đầu trả lời: _"JWT enables stateless authentication by encoding claims in a signed token — this scales beautifully across microservices, but the trade-off is revocation: you can't invalidate a JWT before it expires without a blocklist, which reintroduces server state."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Security Fundamentals — Cryptography basics](../../shared/04-security/01-security-fundamentals.md)
- ➡️ Để hiểu tiếp: Concept 4 (OAuth 2.0 + PKCE), Concept 5 (Token Refresh)

---

### Concept 4: OAuth 2.0 + PKCE / OAuth 2.0 + PKCE

> 🧠 **Memory Hook**: OAuth = a valet key. You give the valet (third-party app) a key that only opens the car door — not the glove box, not the trunk. PKCE = a secret handshake proving the app that asked for the key is the same one that picks it up.

**Tại sao tồn tại? / Why does this exist?**
Users shouldn't share their Google/GitHub passwords with every app that needs to access their data.
→ **Why?** Apps need delegated access — "access my Google Drive" — without getting full account credentials. OAuth provides a token with scoped permissions.
→ **Why?** But SPAs can't store client secrets (they run in the browser) — PKCE (Proof Key for Code Exchange) replaces the client secret with a cryptographic one-time challenge.

```
OAuth 2.0 Authorization Code + PKCE Flow:

  SPA                    Auth Server (IdP)           Resource Server
   │                           │                            │
   │── 1. Generate ────────────┤                            │
   │   code_verifier (random)  │                            │
   │   code_challenge = SHA256(verifier)                    │
   │                           │                            │
   │── 2. /authorize ─────────→│                            │
   │   ?code_challenge=...     │                            │
   │   &code_challenge_method=S256                          │
   │                           │                            │
   │←─ 3. redirect + code ─────│ (user logs in at IdP)      │
   │                           │                            │
   │── 4. /token ─────────────→│                            │
   │   code + code_VERIFIER    │ (verifier → hashed → match?)│
   │                           │                            │
   │←─ 5. access_token ────────│                            │
   │       refresh_token       │                            │
   │                           │                            │
   │── 6. API call ───────────────────────────────────────→│
   │   Authorization: Bearer <access_token>                 │
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng Implicit Flow cho SPA | Access token lộ qua URL fragment, dễ bị logs/referrer capture | Dùng Authorization Code + PKCE |
| Không validate `state` parameter | CSRF attack trên OAuth flow — attacker có thể inject auth code | Luôn generate + verify `state` trước khi exchange code |
| Redirect URI quá rộng (wildcard) | `redirect_uri=https://app.com/*` cho phép attacker redirect token | Đăng ký exact redirect URIs |
| Lưu `code` quá lâu trước khi exchange | Authorization code chỉ nên dùng một lần và ngay lập tức | Exchange code ngay, codes thường expire trong 60-300 giây |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: OAuth SPA, PKCE, implicit flow, social login
- → Nhớ đến: PKCE = client secret substitute for public clients
- → Mở đầu trả lời: _"For SPAs, OAuth 2.0 Authorization Code flow with PKCE is the standard — PKCE replaces the client secret with a one-time cryptographic challenge so there's nothing secret to protect in the browser, while still preventing authorization code interception attacks."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Concept 3 (JWT), HTTP redirect mechanics
- ➡️ Để hiểu tiếp: Concept 7 (SSO & OIDC), PKCE RFC 7636

---

### Concept 5: Token Refresh & Session Management / Refresh Token & Quản Lý Phiên

> 🧠 **Memory Hook**: Refresh token = a hotel key-card that mints new room keys. The room key (access token) expires in 15 minutes. When it expires, you insert the key-card at the front desk (token endpoint) to get a fresh room key — without re-checking in (re-authenticating).

**Tại sao tồn tại? / Why does this exist?**
Access tokens need to be short-lived (security), but users shouldn't have to log in every 15 minutes (UX).
→ **Why?** If a short-lived access token is stolen, damage is limited to the expiry window — but forcing re-login on expiry destroys UX.
→ **Why?** Refresh tokens solve this: long-lived but stored securely (httpOnly cookie), used only at the token endpoint, and rotated on each use so theft is detectable.

```
Token Refresh Race Condition (The Real Problem):

  Tab A request → 401 → refreshing...   ┐
  Tab B request → 401 → refreshing...   ├─ Both try to refresh simultaneously!
  Tab C request → 401 → refreshing...   ┘
                                         │
  Solution: Promise singleton             ↓
  ┌─────────────────────────────────────────────┐
  │ let refreshPromise: Promise | null = null    │
  │                                             │
  │ if (isExpired) {                            │
  │   refreshPromise ??= doRefresh()            │
  │     .finally(() => refreshPromise = null)   │
  │   token = await refreshPromise              │
  │ }                                           │
  └─────────────────────────────────────────────┘

Refresh Token Rotation:
  1st refresh: RT_1 → new AT_1 + new RT_2 (RT_1 invalidated)
  2nd refresh: RT_2 → new AT_2 + new RT_3 (RT_2 invalidated)
  Theft detected: Attacker uses RT_1 → RT_2 already invalidated → server revokes all tokens for user
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Nhiều tab cùng refresh song song | Race condition → các request khác nhận invalid token cascade | Promise singleton pattern (như code ở trên) |
| Refresh token lưu trong localStorage | Nếu XSS steal refresh token, attacker có long-lived access | Refresh token chỉ trong httpOnly cookie |
| Không rotate refresh token | Stolen refresh token có thể dùng mãi | Mỗi refresh phát token mới, invalidate token cũ |
| Logout chỉ xóa client-side state | Server vẫn chấp nhận refresh token cũ | Logout phải revoke refresh token ở server |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: refresh token, session expiry, silent auth, remember me
- → Nhớ đến: Short-lived access + long-lived refresh + rotation + revoke
- → Mở đầu trả lời: _"Token refresh strategy has two axes: security and UX. Short-lived access tokens (15 min) limit theft damage; refresh token rotation detects if a stolen token is reused; and on the frontend, a Promise singleton prevents the thundering-herd problem of multiple tabs triggering simultaneous refresh calls."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Concept 3 (JWT expiry), Concept 2 (httpOnly cookie)
- ➡️ Để hiểu tiếp: Q17 (race condition), Q19 (secure logout), Q36 (offline-first auth)

---

### Concept 6: MFA / Step-Up Authentication / Xác Thực Đa Yếu Tố

> 🧠 **Memory Hook**: MFA = the vault at a bank. Your PIN opens the building (password). Your thumbprint opens the vault (second factor). Step-up = the vault only opens when you're actually at the vault — not just because you're inside the building.

**Tại sao tồn tại? / Why does this exist?**
Passwords alone are stolen constantly (data breaches, phishing, credential stuffing).
→ **Why?** Even strong passwords can be leaked — a second factor that attackers can't easily steal remotely (OTP, biometric, hardware key) dramatically raises the bar.
→ **Why?** But requiring MFA for every action kills UX — step-up auth challenges only for sensitive operations (transfer money, change email) after a lower-assurance session is already established.

```
MFA Assurance Levels:

  Password only    ──→ Level 1 (LoA 1): Read-only access
  + TOTP/SMS OTP   ──→ Level 2 (LoA 2): Write operations
  + Hardware key   ──→ Level 3 (LoA 3): Admin/financial ops
  + Biometric      ──→ Level 4 (LoA 4): High-value transactions

  Step-Up Flow:
  User logged in (LoA 1) → Clicks "Transfer $10,000"
  → Backend returns 401 with WWW-Authenticate: StepUp scope="finance"
  → Frontend shows MFA challenge (TOTP entry)
  → User completes MFA → Gets LoA 2 token
  → Retry transfer → Succeeds
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Lưu OTP trạng thái "đã verify" trong localStorage | XSS có thể fake verified state | MFA state chỉ tồn tại trong server session/claim |
| OTP không có expiry/rate limit | Brute force 6-digit OTP = 1M attempts | OTP expire 30s (TOTP) hoặc 10 phút (SMS), rate limit 5 attempts |
| Skip MFA challenge sau khi re-auth | Step-up thực sự yêu cầu re-verify tại thời điểm nhạy cảm | Backend verify MFA claim `amr` và thời gian verify (`auth_time`) |
| Không cung cấp recovery codes | User bị lockout khi mất device | Luôn generate và cho download recovery codes khi enable MFA |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: MFA, 2FA, step-up auth, passkey
- → Nhớ đến: MFA = second factor chống credential theft; step-up = just-in-time higher assurance
- → Mở đầu trả lời: _"MFA addresses the weakness that passwords alone are easily stolen — the second factor should be resistant to remote interception, so TOTP apps are better than SMS. For UX, step-up authentication means we only challenge users for a second factor when they attempt a sensitive operation, not on every login."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Concept 1 (Authentication), Concept 5 (Session Management)
- ➡️ Để hiểu tiếp: Concept 7 (SSO — MFA propagation), Q31 (WebAuthn/passkey)

---

### Concept 7: SSO & OpenID Connect / Đăng Nhập Một Lần & OpenID Connect

> 🧠 **Memory Hook**: SSO = a universal theme park pass. One check-in at the gate (IdP login), then every ride (app) scans your wristband without making you queue again. OIDC = the standard that defines what's printed on the wristband (ID Token).

**Tại sao tồn tại? / Why does this exist?**
Enterprise users work across dozens of apps — requiring separate login/password for each is a security nightmare (password reuse) and UX disaster.
→ **Why?** Centralizing identity at one IdP (Identity Provider) means one place for MFA, one place for access revocation, one audit log for compliance.
→ **Why?** But different apps need standardized ways to receive identity assertions — OIDC (built on OAuth 2.0) provides the ID Token format and UserInfo endpoint so any app can verify "who is this user" in a vendor-neutral way.

```
OIDC vs OAuth 2.0:

  OAuth 2.0:   Authorization framework — "can this app access this resource?"
               Returns: access_token (opaque or JWT)

  OIDC:        Identity layer ON TOP of OAuth — "who is the user?"
               Returns: access_token + ID Token (signed JWT with user claims)

  ID Token payload:
  {
    "iss": "https://accounts.google.com",  ← issuer
    "sub": "1234567890",                   ← user identifier (stable)
    "aud": "your-client-id",               ← intended audience
    "exp": 1711584000,
    "iat": 1711497600,
    "email": "user@example.com",
    "name": "Jane Doe",
    "nonce": "abc123"                      ← replay protection
  }

SSO Flow (Enterprise SAML vs OIDC):
  SAML: XML-based, IdP-initiated or SP-initiated, enterprise legacy
  OIDC: JSON/JWT-based, always SP-initiated, modern cloud-native
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng `sub` claim từ ID Token mà không verify signature | Attacker có thể craft fake ID Token | Backend phải verify JWT signature với IdP's JWKS endpoint |
| Không validate `nonce` trong ID Token | Replay attack — cùng ID Token dùng lại | Generate random nonce, store in session, verify in callback |
| Nghĩ SSO logout tự động đồng bộ | Khi user logout khỏi IdP, apps vẫn có live sessions | Implement backchannel logout hoặc front-channel logout |
| Tin access token từ OIDC là ID proof | Access token cho phép access resource, không phải proof of identity | Dùng ID Token hoặc UserInfo endpoint để lấy user identity |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: SSO, OIDC, OAuth vs OIDC, social login, enterprise auth
- → Nhớ đến: OAuth = authorization, OIDC = authentication (identity layer)
- → Mở đầu trả lời: _"OIDC is identity authentication built on top of OAuth 2.0's authorization framework — OAuth gives you an access token to call APIs, while OIDC additionally gives you an ID Token that cryptographically proves who the user is. For SSO, the IdP becomes the central identity source so logging in once propagates across all connected applications."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Concept 4 (OAuth 2.0 + PKCE), Concept 3 (JWT)
- ➡️ Để hiểu tiếp: Q20 (SSO frontend integration), Q21 (OIDC deep dive), Q22 (ID Token validation)

---

### Concept 8: BFF Pattern for Auth / Backend for Frontend trong Xác Thực

> 🧠 **Memory Hook**: BFF = a bodyguard for your frontend. The frontend tells the bodyguard "I want to talk to the API." The bodyguard holds ALL the real credentials and makes the call — the frontend never touches the sensitive tokens.

**Tại sao tồn tại? / Why does this exist?**
SPAs running in browsers are "public clients" — any token they hold is accessible to JavaScript and potentially to XSS attacks.
→ **Why?** OAuth refresh tokens and long-lived credentials are too sensitive to be in the browser's custody — a server-side component can hold them in memory/encrypted storage away from any browser vulnerability.
→ **Why?** The BFF (Backend for Frontend) sits between the SPA and the OAuth/API layer: it holds tokens server-side, exposes only a session cookie to the frontend, and proxies authenticated API calls — combining best security posture with good frontend DX.

```
Without BFF (tokens in browser):
  SPA ─ holds access_token + refresh_token ─→ API
         (XSS risk, token exposed)

With BFF (tokens on server):
  SPA ─── session cookie ──→ BFF ─── access_token ──→ API
           (httpOnly, safe)    │     (server holds token)
                               └── refresh_token (secure server storage)

BFF responsibilities:
  1. OAuth callback handling (code → token exchange)
  2. Token storage (server memory / Redis)
  3. Token refresh (transparent to frontend)
  4. Session cookie management
  5. API proxy with Authorization header injection
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| BFF không CSRF protect | Frontend gọi BFF qua session cookie — CSRF vẫn applicable | BFF cần SameSite cookie + CSRF token hoặc Origin check |
| BFF session timeout không đồng bộ với OAuth token | Session còn hạn nhưng refresh token expired → 401 surprise | BFF phải handle refresh failure → clear session + redirect login |
| Expose token từ BFF xuống frontend "cho tiện debug" | Token lộ ra client = mất điểm của BFF pattern | Chỉ expose session cookie và non-sensitive user claims |
| Dùng BFF cho mọi app kể cả mobile | Mobile app không benefit từ cookie-based BFF | BFF cho web SPA; mobile dùng Authorization Code + PKCE trực tiếp |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: BFF, token storage, SPA security architecture, Next.js auth
- → Nhớ đến: BFF = tokens on server, session cookie to frontend, proxy API calls
- → Mở đầu trả lời: _"The BFF pattern addresses the fundamental problem that browsers are untrusted environments — by moving token custody to a server-side backend-for-frontend, the SPA only ever holds a session cookie while the BFF handles OAuth flows, token refresh, and API proxying with proper Authorization headers."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Concept 2 (Cookie flags), Concept 3 (JWT), Concept 4 (OAuth)
- ➡️ Để hiểu tiếp: Q23 (BFF deep dive), Q34 (browser cache security)

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. Differentiate Authentication and Authorization in frontend systems.

**Tổng Quan:**

- Authentication trả lời “bạn là ai”, Authorization trả lời “bạn được làm gì”; frontend chỉ phản ánh state, không phải trust boundary cuối.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu rõ “frontend enforces nothing — it only reflects” và giải thích backend phải re-validate mọi request kể cả khi route guard đã block.
- ❌ Weak: Chỉ định nghĩa hai khái niệm mà không nói về security boundary và tại sao frontend không thể trust.

### 🟢 [Junior] Q2. Why frontend must not be the source of truth for authorization?

**Tổng Quan:**

- Client có thể bị sửa đổi nên mọi quyết định quyền truy cập phải được backend kiểm tra lại.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Đưa ví dụ cụ thể — DevTools có thể xóa `isAdmin = false`, React state có thể bị override qua console, chỉ backend validate JWT claims mới là trust boundary thực sự.
- ❌ Weak: Chỉ nói "vì user có thể hack frontend" mà không giải thích cơ chế cụ thể và giải pháp backend.

### 🟢 [Junior] Q3. Explain cookie-based auth for web apps.

**Tổng Quan:**

- Server tạo session, gửi cookie định danh; browser tự đính kèm cookie theo domain/path khi gọi API.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích trade-off giữa cookie-based (revocable, server-side state, CSRF risk) vs JWT (stateless, không revocable dễ, XSS risk) và khi nào nên chọn cái nào.
- ❌ Weak: Chỉ mô tả cơ chế cookie mà không nêu security risks hoặc khi nào cookie phù hợp hơn localStorage.

### 🟢 [Junior] Q4. Role of httpOnly, secure, sameSite cookie flags?

**Tổng Quan:**

- httpOnly chặn JS đọc cookie; secure bắt buộc HTTPS; sameSite giảm nguy cơ CSRF qua cross-site request.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

```http
Set-Cookie: sid=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1800
```

- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Map từng flag với attack vector cụ thể (HttpOnly → XSS; Secure → network eavesdropping; SameSite=Lax → CSRF) và biết khi nào SameSite=Strict gây break OAuth flows.
- ❌ Weak: Chỉ liệt kê tên flags mà không giải thích tại sao mỗi flag tồn tại và attack gì nó chặn.

### 🟢 [Junior] Q5. Compare localStorage vs cookie for JWT storage.

**Tổng Quan:**

- localStorage dễ dùng nhưng lộ khi XSS; httpOnly cookie an toàn hơn trước XSS nhưng cần CSRF defense.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu cả ba options (localStorage, httpOnly cookie, memory) với trade-off của mỗi loại, và recommend memory cho access token + httpOnly cookie cho refresh token như modern best practice.
- ❌ Weak: Chỉ nói "localStorage không an toàn" mà không giải thích tại sao httpOnly cookie cũng không hoàn hảo (CSRF) và solution là gì.

### 🟢 [Junior] Q6. When should in-memory token storage be considered?

**Tổng Quan:**

- Phù hợp app ưu tiên bảo mật cao, chấp nhận mất đăng nhập khi refresh hoặc cần silent refresh phức tạp.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nhận ra in-memory token không persist qua page refresh — cần silent refresh mechanism (httpOnly refresh cookie hoặc hidden iframe) để regenerate, và giải thích trade-off giữa security vs UX continuity.
- ❌ Weak: Chỉ nói "an toàn hơn" mà không nêu limitation (mất khi reload) và cách handle continuation.

### 🟢 [Junior] Q7. Explain OAuth 2.0 Authorization Code + PKCE for SPA.

**Tổng Quan:**

- SPA tạo code_verifier/code_challenge để đổi code lấy token an toàn, tránh lộ client secret ở trình duyệt.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

```ts
// PKCE helper (browser)
async function createCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hashBuffer);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
```

- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích PKCE giải quyết vấn đề gì (SPA không thể giữ client secret, nhưng attacker intercept authorization code cũng không thể exchange vì không có code_verifier), và nêu tầm quan trọng của `state` parameter để chống CSRF.
- ❌ Weak: Chỉ mô tả PKCE là "thêm security" mà không giải thích attack scenario nó ngăn chặn.

### 🟢 [Junior] Q8. Why implicit flow is discouraged for modern SPAs?

**Tổng Quan:**

- Implicit flow đưa access token qua URL fragment dễ rò rỉ qua logs/history/referrer, khó kiểm soát vòng đời token.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Liệt kê cụ thể các leak vectors: browser history, Referer header gửi đến third-party scripts, server access logs khi token appears in URL — và nêu OAuth 2.0 Security Best Current Practice (RFC 9700) chính thức deprecate implicit flow.
- ❌ Weak: Chỉ nói "không an toàn" mà không biết vì sao URL fragment nguy hiểm hơn code exchange.

### 🟢 [Junior] Q9. How does refresh token rotation improve security?

**Tổng Quan:**

- Mỗi lần refresh phát token mới và vô hiệu token cũ, giúp phát hiện replay attack nếu token cũ bị tái sử dụng.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích theft detection mechanism — nếu attacker steal RT và dùng nó, server thấy original client cũng cố refresh bằng RT đã expired → server revoke toàn bộ token family cho user đó như incident response.
- ❌ Weak: Chỉ nói "rotate để an toàn hơn" mà không giải thích tại sao việc detect reuse là cơ chế phát hiện breach.

### 🟢 [Junior] Q10. What is session fixation and mitigation?

**Tổng Quan:**

- Kẻ tấn công ép nạn nhân dùng session ID đã biết; cần rotate session ID sau login/privilege change.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả attack flow (attacker plants known session ID → victim logs in → attacker hijacks authenticated session) và mitigation (server MUST issue new session ID on any authentication state change — login, privilege elevation, logout).
- ❌ Weak: Mô tả session hijacking chung chung thay vì phân biệt fixation (attacker sets ID trước) vs hijacking (attacker steal ID sau).

### 🟢 [Junior] Q11. How to implement CSRF protection in React apps?

**Tổng Quan:**

- Dùng SameSite, CSRF token synchronizer/double-submit, và xác thực Origin/Referer ở backend.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

```tsx
// CSRF token gửi qua custom header
await fetch("/api/profile", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
  },
  body: JSON.stringify(payload),
});
```

- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết rằng custom header (X-CSRF-Token) là đủ vì cross-site forms không thể gửi custom headers — và phân biệt khi nào SameSite=Lax đủ vs khi nào cần synchronizer token (e.g., API đọc từ header không phải SameSite-protected).
- ❌ Weak: Chỉ nói "thêm CSRF token" mà không giải thích tại sao custom header approach hoạt động hay khi nào SameSite cookie là đủ.

### 🟢 [Junior] Q12. How to secure API calls from frontend?

**Tổng Quan:**

- Dùng HTTPS bắt buộc, timeout/retry kiểm soát, validate response schema, và central auth interceptor.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu centralized auth interceptor (Axios interceptor hoặc fetch wrapper) xử lý token attachment + 401 retry + refresh — tránh scattered token logic, và nhắc đến không log sensitive response data.
- ❌ Weak: Chỉ nói "dùng HTTPS và add Authorization header" mà không nêu về centralized error handling và graceful 401 recovery.

### 🟢 [Junior] Q13. What is Content Security Policy in auth context?

**Tổng Quan:**

- CSP giảm XSS injection, gián tiếp bảo vệ token/session bằng cách hạn chế script nguồn không tin cậy.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích CSP bảo vệ auth indirectly — nếu XSS bị block, script không thể đọc token từ memory hoặc gọi API với stolen credentials — và nêu Trusted Types API như next-gen defense.
- ❌ Weak: Mô tả CSP như một auth mechanism thay vì XSS mitigation mechanism có tác động đến auth security.

### 🟢 [Junior] Q14. Explain CORS and credentialed requests.

**Tổng Quan:**

- Khi gửi cookie cross-origin cần withCredentials + Access-Control-Allow-Credentials + origin cụ thể (không wildcard).
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Biết rằng `Access-Control-Allow-Origin: *` KHÔNG hoạt động với credentialed requests — phải specify exact origin — và explain tại sao CORS preflight không bảo vệ chống CSRF (SameSite là defense cho CSRF).
- ❌ Weak: Nhầm CORS là security feature ngăn CSRF, thay vì hiểu CORS là browser policy cho cross-origin resource sharing.

### 🟡 [Mid] Q15. How to manage auth state in React safely?

**Tổng Quan:**

- Tách auth state machine, tránh lưu token vào global debug logs, đồng bộ tab bằng BroadcastChannel khi logout.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu BroadcastChannel API cho cross-tab logout synchronization, explain tại sao auth state nên là explicit state machine (loading/authenticated/unauthenticated) thay vì null-checks, và cảnh báo tránh để token leak vào Redux DevTools.
- ❌ Weak: Chỉ nói "dùng Context API" mà không nêu về multi-tab sync hoặc security risk của serialized state.

### 🟡 [Mid] Q16. What are protected routes and their limitations?

**Tổng Quan:**

- Route guard chỉ bảo vệ UX; backend vẫn phải từ chối truy cập trái phép ngay cả khi frontend bypass guard.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu "React Router guards = UX enhancement, not security" — demonstrate với ví dụ: manipulating `isAuthenticated` in DevTools console bypasses the guard but API calls still return 403 if backend is correct.
- ❌ Weak: Describe protected routes như là security mechanism thực sự mà không nhắc đến backend enforcement.

### 🟡 [Mid] Q17. How do you handle token expiry race conditions?

**Tổng Quan:**

- Queue request khi refresh đang diễn ra, tránh nhiều refresh song song gây invalid token cascade.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

```ts
let refreshing: Promise<string> | null = null;
async function getAccessToken(): Promise<string> {
  if (isExpired(token)) {
    refreshing ??= refreshToken().finally(() => {
      refreshing = null;
    });
    token = await refreshing;
  }
  return token;
}
```

- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích Promise singleton pattern — `??=` đảm bảo chỉ một refresh Promise tồn tại, mọi concurrent caller cùng await nó, `.finally()` cleanup đảm bảo next expiry cycle hoạt động bình thường — và nhắc "thundering herd" là thuật ngữ cho vấn đề này.
- ❌ Weak: Chỉ nói "lock token refresh" mà không show implementation pattern hoặc không biết tại sao concurrent refresh với rotation gây cascading failures.

### 🟡 [Mid] Q18. How to implement silent re-authentication?

**Tổng Quan:**

- Dùng refresh token/cookie session hoặc hidden iframe với IdP hỗ trợ, kèm timeout và fallback rõ ràng.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt hai approaches — (1) refresh token endpoint nếu RT còn hạn và (2) hidden iframe `prompt=none` với OIDC IdP để check SSO session — và nêu ITP/Intelligent Tracking Prevention của Safari block third-party cookies làm iframe approach không reliable.
- ❌ Weak: Chỉ mô tả "gọi refresh endpoint" mà không nêu đây là silent và phân biệt với interactive re-auth.

### 🟡 [Mid] Q19. How to secure logout flow?

**Tổng Quan:**

- Xóa state client, revoke server session/refresh token, invalidate cookie và broadcast logout đa tab.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu đủ 4 steps: (1) clear in-memory token, (2) call revoke endpoint to invalidate refresh token server-side, (3) clear httpOnly cookie via server response, (4) BroadcastChannel `'logout'` message để sync other tabs — và mention short-lived JWT vẫn valid đến expiry sau logout.
- ❌ Weak: Chỉ nói "xóa token local" hoặc "redirect về login page" mà không revoke server-side refresh token.

### 🟡 [Mid] Q20. How do SSO integrations work in frontend?

**Tổng Quan:**

- Frontend redirect tới IdP, nhận authorization code, backend/token endpoint xử lý và trả session nội bộ.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt SP-initiated vs IdP-initiated SSO, nêu `state` parameter cho CSRF protection trong SSO flow, và giải thích logout phức tạp hơn (backchannel logout để propagate đến all connected apps).
- ❌ Weak: Chỉ mô tả "redirect sang Google, nhận token về" mà không nêu security parameters hoặc SSO logout propagation.

### 🟡 [Mid] Q21. What is OpenID Connect and why important for frontend?

**Tổng Quan:**

- OIDC thêm identity layer trên OAuth 2.0 với ID Token + UserInfo để xác định danh tính chuẩn hóa.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu rõ OIDC = OAuth 2.0 + Identity layer, ID Token = signed JWT for identity (not for API access), access token = for calling APIs — và frontend dùng ID Token claims cho UX (display name, avatar) nhưng backend verify signature.
- ❌ Weak: Nhầm lẫn access token và ID token, hoặc dùng access token để "verify user identity" trên frontend.

### 🟡 [Mid] Q22. How to validate ID Token on frontend?

**Tổng Quan:**

- Frontend chỉ kiểm tra claim cơ bản cho UX; xác minh chữ ký đầy đủ nên ở backend/BFF để tăng trust.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu frontend có thể decode (not verify) ID Token để lấy `name`/`email` cho UX, nhưng NEVER trust payload cho security decisions — nêu `nonce` validation để prevent replay, `aud` để ensure token intended for your app.
- ❌ Weak: Nói frontend nên validate JWT signature — đây là computationally expensive và JWKS key fetching phức tạp; backend/BFF nên làm điều này.

### 🟡 [Mid] Q23. What is BFF (Backend for Frontend) in auth architecture?

**Tổng Quan:**

- BFF giữ token server-side, frontend chỉ giữ session cookie giúp giảm lộ token và đơn giản hóa policy.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

```ts
// BFF pattern: frontend never sees OAuth refresh token
export async function getSessionUser() {
  const res = await fetch("/bff/session", { credentials: "include" });
  if (!res.ok) throw new Error("Unauthenticated");
  return res.json();
}
```

- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu BFF = "Token Guardian" — giải thích token custody shift (browser → server), kết nối với "Token-Mediating Backend" pattern từ OAuth Security BCP, và nêu tradeoff: thêm một server component, CORS đơn giản hơn vì same-origin cookies.
- ❌ Weak: Mô tả BFF chỉ như một API aggregation layer mà không nêu security motivation (token không expose xuống browser).

### 🟡 [Mid] Q24. How to design role/permission UI without leaking security assumptions?

**Tổng Quan:**

- Ẩn/hiện theo role để UX tốt, nhưng mọi endpoint phải enforce permission ở server.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu "hide for UX, block for security" — frontend ẩn button Admin Dashboard cho non-admin users nhưng route `/admin/*` cũng phải return 403 từ backend; cảnh báo tránh hardcode `role === 'admin'` string trong frontend vì role names leak security model.
- ❌ Weak: Mô tả conditional rendering `{isAdmin && <AdminPanel />}` như là security mà không nêu backend enforcement requirement.

### 🟡 [Mid] Q25. How to mitigate XSS impact on auth?

**Tổng Quan:**

- Sanitize input/output, CSP strict, Trusted Types, tránh dangerouslySetInnerHTML và review third-party scripts.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Defense-in-depth approach — (1) prevent XSS: CSP + Trusted Types + sanitization; (2) limit damage if XSS occurs: httpOnly cookies, short-lived tokens, token binding — và nêu third-party scripts (analytics, ads) là major XSS vector qua supply chain.
- ❌ Weak: Chỉ nói "React auto-escapes" mà không nêu `dangerouslySetInnerHTML`, third-party script risks, hoặc defense nếu XSS vẫn xảy ra.

### 🟡 [Mid] Q26. How to mitigate replay attacks for tokens?

**Tổng Quan:**

- Token ngắn hạn + rotation + sender-constrained token (DPoP/mTLS) + device binding nếu hạ tầng hỗ trợ.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích DPoP (Demonstrating Proof of Possession) — token bị bind với private key trên device, nên attacker steal token nhưng không có key thì không replay được — và contrast với bearer tokens (steal + replay = win).
- ❌ Weak: Chỉ nói "short-lived tokens giảm replay risk" mà không nêu sender-constrained tokens như DPoP/mTLS cho high-security scenarios.

### 🟡 [Mid] Q27. How to handle auth in mobile web and desktop web consistently?

**Tổng Quan:**

- Chuẩn hóa auth contract (claims, expiry, refresh semantics) và policy cookie/cors theo platform behavior.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu platform-specific quirks — Safari ITP blocks third-party cookies affecting cross-domain auth; mobile browsers have inconsistent storage APIs; WebAuthn platform authenticator vs cross-platform authenticator — và recommend feature detection rather than user-agent sniffing.
- ❌ Weak: Nói "responsive design handles it" mà không nêu auth-specific mobile browser differences.

### 🟡 [Mid] Q28. How to handle multi-tenant authentication in frontend?

**Tổng Quan:**

- Encode tenant context trong subdomain/path/claim và đảm bảo switch tenant invalidate cache nhạy cảm.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu tenant isolation risk — if user switches tenant, old tenant's cached data (React Query, Redux cache, in-memory tokens) must be fully cleared; `tenant_id` claim in JWT must be backend-verified against requested resource tenant.
- ❌ Weak: Chỉ nói "lưu tenant ID" mà không nêu cross-tenant data leakage via stale cache là security risk thực sự.

### 🟡 [Mid] Q29. How to instrument auth security monitoring?

**Tổng Quan:**

- Log event theo chuẩn (login success/fail, refresh, revoke), gắn correlation ID và alert bất thường.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu signals đáng alert — high login failure rate (credential stuffing), refresh token reuse (theft), concurrent sessions from geographically impossible locations (account takeover) — và cảnh báo không log tokens/passwords trong log entries.
- ❌ Weak: Chỉ nói "log login events" mà không nêu anomaly detection signals hoặc PII/token scrubbing requirement.

### 🟡 [Mid] Q30. How to support MFA/2FA in SPA?

**Tổng Quan:**

- Xây flow step-up auth rõ ràng, hạn chế bypass, timeout OTP hợp lý và backup recovery code.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả MFA state machine — `password_verified` → show MFA challenge → `mfa_verified` → issue full access token; backend issues intermediate "partial auth" token after password step; frontend never skips MFA based on local state.
- ❌ Weak: Chỉ nói "show OTP input form" mà không nêu intermediate token approach hoặc backend enforcement của MFA completion.

### 🔴 [Senior] Q31. WebAuthn basics for frontend engineers?

**Tổng Quan:**

- Frontend gọi WebAuthn API để tạo/đăng nhập passkey; private key nằm trên authenticator, chống phishing tốt hơn password.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

```ts
// WebAuthn registration (simplified)
const credential = await navigator.credentials.create({
  publicKey: publicKeyCreationOptions,
});
await fetch("/api/webauthn/register/finish", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(credential),
});
```

- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích why WebAuthn is phishing-resistant — credential is bound to the rpId (relying party origin), so a phishing site `bank-login.com` cannot use credentials registered for `bank.com` — private key never leaves the authenticator device.
- ❌ Weak: Mô tả WebAuthn như "just fingerprint login" mà không giải thích origin-binding anti-phishing property hay public/private key ceremony.

### 🔴 [Senior] Q32. How to combine passkey and password fallback?

**Tổng Quan:**

- Ưu tiên passkey, fallback password + MFA cho thiết bị chưa hỗ trợ; tránh UX gây lockout người dùng.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu progressive enhancement strategy — feature-detect `navigator.credentials` before offering passkey UI; account downgrade attack risk (if password fallback is too easy, attacker can bypass passkey); recommend password + TOTP fallback not password alone.
- ❌ Weak: Chỉ nói "hiện button passkey nếu browser support" mà không nêu account downgrade risk hoặc fallback security level.

### 🔴 [Senior] Q33. What is risk-based authentication?

**Tổng Quan:**

- Điểm rủi ro dựa trên device/location/behavior; frontend hiển thị challenge bổ sung khi backend yêu cầu.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu risk signals backend evaluates (new device fingerprint, unusual geolocation, velocity — same account from 2 countries in 1 hour), frontend role là nhận `stepup_required` signal và render appropriate challenge without knowing the risk score, preserving privacy.
- ❌ Weak: Chỉ nói "yêu cầu MFA khi location thay đổi" mà không giải thích kiến trúc backend risk engine → frontend challenge rendering.

### 🔴 [Senior] Q34. How to secure auth data in browser caches?

**Tổng Quan:**

- Đặt cache-control no-store cho response chứa token/PII, tránh lưu trong service worker cache sai phạm vi.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt các cache layers — HTTP cache (`Cache-Control: no-store`), Service Worker cache (must exclude auth endpoints from caching strategy), bfcache (back/forward cache may expose auth state), browser disk cache — và nêu logout must clear all layers.
- ❌ Weak: Chỉ nói "set no-cache header" mà không nêu Service Worker cache và bfcache như distinct layers với different risks.

### 🔴 [Senior] Q35. How to do secure API error handling?

**Tổng Quan:**

- Không lộ chi tiết nội bộ (stack/claim), trả mã lỗi nhất quán và map sang UX message an toàn.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu user enumeration risk — "Email not found" vs "Wrong password" reveals valid accounts; generic "Invalid credentials" is correct — và nêu correlation ID pattern: backend logs full details, frontend shows only correlation ID for support reference.
- ❌ Weak: Chỉ nói "không show error chi tiết" mà không nêu user enumeration as specific attack hoặc correlation ID pattern.

### 🔴 [Senior] Q36. How to design auth for offline-first app?

**Tổng Quan:**

- Tối thiểu hóa quyền offline, mã hóa local data, token ngắn hạn và revalidation bắt buộc khi online.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

```http
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
```

- Đảm bảo code mẫu đi kèm giải thích vì sao nó giảm rủi ro cụ thể.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu principle of least privilege for offline — only cache data needed for offline use, encrypt with device-bound key (WebCrypto API), define maximum offline window (e.g., 7 days) after which app forces re-auth even for local data, revocation cannot be enforced while offline.
- ❌ Weak: Chỉ nói "store token locally" mà không nêu encryption at rest requirement hoặc revocation impossibility problem khi offline.

### 🔴 [Senior] Q37. How to handle account linking (Google + Email) securely?

**Tổng Quan:**

- Xác minh quyền sở hữu cả hai identity trước khi liên kết, chống takeover qua email chưa verify.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu "pre-verified email linking" vulnerability — if Google account email matches unverified local email, auto-linking without verification lets attacker register `victim@email.com` locally then link to victim's Google account; require re-authentication of existing account before linking new identity.
- ❌ Weak: Chỉ nói "verify email" mà không nêu account takeover scenario qua unverified email matching.

### 🔴 [Senior] Q38. How to answer auth trade-off in interviews?

**Tổng Quan:**

- Bắt đầu bằng threat model, ràng buộc sản phẩm, compliance, rồi mới chọn kiến trúc lưu token/session.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Demonstrate structured thinking — first ask context questions (is this SPA or SSR? mobile? compliance requirements? team size?), then present 2-3 options with explicit trade-offs, then recommend with reasoning — interviewers reward process over memorized answers.
- ❌ Weak: Đưa ngay recommendation (e.g., "dùng JWT") mà không ask clarifying questions hoặc articulate trade-offs.

### 🔴 [Senior] Q39. How does zero-trust mindset apply to frontend auth?

**Tổng Quan:**

- Không tin client/network mặc định; mọi request phải được xác minh danh tính, ngữ cảnh và policy liên tục.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Zero-trust applied to frontend = "never trust the client, always verify" — short token lifetimes force frequent re-validation, every API call re-verifies claims server-side, risk-based auth continuously re-evaluates context (not just at login) — nêu NIST SP 800-207 như reference.
- ❌ Weak: Mô tả zero-trust như network security concept mà không translate sang frontend auth implications.

### 🔴 [Senior] Q40. What common auth mistakes do frontend teams make?

**Tổng Quan:**

- Tin tưởng route guard quá mức, lưu token trong localStorage không CSP, refresh logic race condition.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: List specific mistakes with consequences — (1) localStorage tokens + no CSP = XSS steals token → account takeover; (2) no refresh race protection = with rotation enabled, multiple tabs logout all users; (3) logout only clears React state = refresh token still valid on server; (4) `console.log(token)` in dev = token in CI logs.
- ❌ Weak: Liệt kê vague mistakes như "không secure" mà không map từng mistake sang consequence cụ thể.

### 🔴 [Senior] Q41. How to prepare for senior auth system design interviews?

**Tổng Quan:**

- Luyện trình bày end-to-end flow: login, refresh, revoke, logout, incident response, observability.
  **Giải thích:**
- Hãy nhấn mạnh frontend là lớp trình bày + orchestration, còn security enforcement cuối cùng thuộc về backend/IdP.
- Trong câu trả lời, nên nêu threat model (XSS, CSRF, token theft, replay) và cơ chế phòng thủ tương ứng.
  **Ví dụ:**
- Một flow tốt luôn gồm: login thành công, refresh ổn định, revoke khi rủi ro, logout toàn phiên, và audit log đầy đủ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Demonstrate holistic thinking — can draw the complete flow whiteboard (user → frontend → BFF → OAuth server → resource API), name the security properties of each hop, articulate what happens on breach at each layer, and propose observability signals for each auth event.
- ❌ Weak: Chỉ focus vào một piece (e.g., JWT structure) mà không show system-level thinking về how auth components interact end-to-end.

---

## Implementation Checklist / Checklist Triển Khai

- Ưu tiên cookie httpOnly + secure + sameSite phù hợp.
- Thiết kế refresh token rotation và revoke endpoint rõ ràng.
- Bật CSP đủ chặt để giảm nguy cơ XSS ảnh hưởng auth.
- Chuẩn hóa interceptor xử lý 401/403 và race refresh.
- Đo lường tỉ lệ login fail, token refresh fail, suspicious events.

## Cross References / Điều Hướng Kiến Thức

- [Modern Auth Patterns (Shared)](../../shared/04-security/04-modern-auth-patterns.md)
- [Security Fundamentals (Shared)](../../shared/04-security/01-security-fundamentals.md)
- [Common Vulnerabilities](./01-common-vulnerabilities.md)

## Advanced Drill Q&A / Bộ Câu Hỏi Nâng Cao

### 🟡 [Mid] Extra Q1. How to secure social login popup flows?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Popup phải đến từ legitimate IdP URL (verify opener origin via `postMessage` with exact origin check), `window.opener` phải được null sau khi done để tránh tabnabbing attack, và state parameter truyền qua postMessage phải match.
- ❌ Weak: Chỉ nói "dùng window.open" mà không nêu postMessage security hoặc tabnabbing risk.

### 🟡 [Mid] Extra Q2. How to protect against token exfiltration via browser extensions?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Browser extensions run in same origin as page, can read DOM/localStorage — defenses: httpOnly cookies (extensions cannot read), short-lived tokens (stolen token expires quickly), Manifest V3 reduces extension capability vs V2, DPoP binding makes stolen token unusable without private key.
- ❌ Weak: Nói "không thể ngăn extension" mà không nêu httpOnly cookie và DPoP như viable defenses.

### 🟡 [Mid] Extra Q3. How to design account recovery securely?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Recovery link phải single-use + short TTL (15-30 min) + invalidate all sessions on recovery completion; security questions are deprecated (guessable); email recovery is only as secure as user's email account — nêu email-to-email recovery chain risk.
- ❌ Weak: Chỉ nói "gửi email reset password" mà không nêu single-use enforcement, TTL, hoặc session invalidation sau recovery.

### 🟡 [Mid] Extra Q4. How to handle passwordless magic-link safely?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Magic link token = cryptographically random (not sequential/guessable), single-use (consumed on first click), device-bound if possible (bind to requesting browser session), và cảnh báo email referrer header có thể leak magic link token to tracking pixels — recommend stripping query params before loading analytics.
- ❌ Weak: Chỉ nói "link expiry" mà không nêu single-use enforcement hoặc referrer leak risk qua tracking pixels.

### 🟡 [Mid] Extra Q5. How to secure device trust / remember-device features?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Device token = long-lived opaque value stored in httpOnly cookie, scoped to the device + user combination; on login, if device token present + valid → skip MFA; device token must be revocable via "manage trusted devices" UI; rotation on each successful use.
- ❌ Weak: Nói "lưu flag trong cookie" mà không nêu device token binding, revocability, hoặc rotation.

### 🟡 [Mid] Extra Q6. How to enforce step-up auth for sensitive operations?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Backend returns HTTP 401 with `WWW-Authenticate: StepUp` or 403 with body `{"error": "insufficient_auth_level", "required_amr": "mfa"}` — frontend intercepts this signal and renders MFA challenge modal without losing user's pending action context; step-up token scoped to specific operation.
- ❌ Weak: Chỉ nói "yêu cầu MFA cho sensitive action" mà không nêu server-driven signal pattern hoặc preserving pending action context.

### 🟡 [Mid] Extra Q7. How to prevent open redirect issues in auth callbacks?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: `?next=/dashboard` parameter after login — validate it is a relative path (starts with `/`, not `//` or `https://`) or matches allowlist; `new URL(next, window.location.origin).origin === window.location.origin` check; nêu `//evil.com` bypass trick where `//` is treated as protocol-relative URL.
- ❌ Weak: Chỉ nói "validate redirect URL" mà không nêu `//evil.com` bypass hoặc relative vs absolute URL distinction.

### 🟡 [Mid] Extra Q8. How to secure redirect_uri handling in SPA?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: IdP must enforce exact match (not prefix/pattern match) of registered redirect_uri — attacker registers `https://yourapp.com/callback/../evil` to redirect code to attacker; state parameter is CSRF protection for the OAuth flow itself, not for post-login navigation.
- ❌ Weak: Nhầm redirect_uri validation với post-login redirect protection, hoặc không biết exact match requirement.

### 🟡 [Mid] Extra Q9. How to support enterprise SAML SSO in frontend UX?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: SAML frontend UX = detect enterprise email domain → show "Sign in with SSO" → redirect to SP-initiated SAML flow → SAML assertion posted back to backend → backend creates internal session; SAML is XML/POST-based so frontend handles it as a form submission redirect, not JavaScript.
- ❌ Weak: Nhầm SAML với OIDC implementation, hoặc không biết SAML is typically all server-side with browser redirects, not a JS-driven flow.

### 🟡 [Mid] Extra Q10. How to handle clock skew in token validation?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: JWT `exp` check on frontend for UX (pre-emptive refresh before server rejects) should add clock skew buffer of ~60s; backend JWT validation should also allow small leeway; use server-authoritative time from response `Date` header rather than `Date.now()` which can be wrong on device with wrong clock.
- ❌ Weak: Nói "check token expiry" mà không nêu clock skew buffer hoặc không biết `Date.now()` có thể không đáng tin trên mobile devices.

### 🟡 [Mid] Extra Q11. How to secure impersonation/admin-switch-user flows?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Impersonation token should carry both `sub` (impersonated user) and `act` (admin actor) claims per RFC 8693 Token Exchange; frontend must show clear "Impersonating X" UI banner; impersonation session must NOT allow changing password/MFA/billing of impersonated user; every action logged with admin actor identity.
- ❌ Weak: Chỉ nói "admin có thể switch user" mà không nêu dual claim tracking, UI disclosure requirement, hoặc restricted permissions during impersonation.

### 🔴 [Senior] Extra Q12. How to log out from all devices?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Server-side: increment `token_version` counter in user record; all JWTs carry `token_version` claim; on next request with old version → reject; short-lived JWTs expire quickly anyway; active SSE/WebSocket sessions need push notification to logout; OIDC backchannel logout propagates to all registered clients.
- ❌ Weak: Chỉ nói "revoke refresh token" mà không nêu active access tokens still valid + push mechanism for real-time logout.

### 🔴 [Senior] Extra Q13. How to implement session concurrency limits?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu hai UX strategies — (1) kick oldest session when limit exceeded (streaming services) or (2) reject new session with "logged in elsewhere" — frontend needs to handle 429/403 with `session_limit_exceeded` error gracefully and show active sessions management UI for user to manually revoke.
- ❌ Weak: Chỉ nói "giới hạn số session" mà không nêu UX implications hoặc cách notify active session bị revoke.

### 🔴 [Senior] Extra Q14. How to secure GraphQL APIs with frontend auth?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: GraphQL single endpoint means auth must be field-level and resolver-level, not just route-level; disable introspection in production (leaks schema to attackers); query complexity limits prevent DoS; persisted queries reduce attack surface; auth interceptor same as REST but applied to all GraphQL requests.
- ❌ Weak: Áp dụng REST auth pattern trực tiếp vào GraphQL mà không nêu field-level authorization hoặc introspection risk.

### 🔴 [Senior] Extra Q15. How to handle auth when third-party cookies are blocked?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu alternatives — (1) same-site auth subdomain (`auth.yourapp.com`) with `Domain=.yourapp.com` cookie is first-party; (2) Authorization Code flow with PKCE doesn't need third-party cookies; (3) Storage Access API for cross-site embedded widgets; nêu Safari ITP impact on hidden-iframe silent auth.
- ❌ Weak: Nói "third-party cookies bị block nên không làm được SSO" mà không biết về same-site subdomain workaround hoặc Storage Access API.

### 🔴 [Senior] Extra Q16. How to protect against session hijacking on shared devices?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Idle timeout on both client (inactivity timer) and server (session TTL); `sessionStorage` instead of `localStorage` for tab-isolated state; "private browsing mode" recommendation for shared devices; on suspicious access (new IP after long inactivity), trigger step-up auth; bfcache restoration should check session validity.
- ❌ Weak: Chỉ nói "logout khi đóng browser" mà không nêu idle timeout, bfcache risk, hoặc shared device specific mitigations.

### 🔴 [Senior] Extra Q17. How to manage auth for embedded iframes/widgets?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: iframes blocked by `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'self'`; pass auth via `postMessage` with origin validation (never `*`); sandbox attribute limits iframe capabilities; third-party cookie blocking affects iframe auth — use Storage Access API or token passed via query param with tight TTL.
- ❌ Weak: Không biết X-Frame-Options và CSP frame-ancestors, hoặc truyền auth token qua postMessage mà không check origin.

### 🔴 [Senior] Extra Q18. How to design consent + auth flows together?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Consent must be granular (scope-based), revocable, and re-requested when scope changes; GDPR requires freely given consent (can't bundle with ToS); OAuth scope screen IS the consent UI — frontend must not pre-check all scopes; store consent timestamp + version so consent can be re-requested on policy update.
- ❌ Weak: Chỉ nói "show consent checkbox" mà không nêu GDPR freely given requirement, scope granularity, hoặc consent re-collection on policy change.

### 🔴 [Senior] Extra Q19. How to test auth security with automated E2E?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Test matrix includes — expired token handling (mock time), refresh race condition (concurrent requests), token tampering (modify JWT payload → expect 401), CSRF (submit form without token → expect 403), logout completeness (verify all tabs logged out via BroadcastChannel in test), and XSS payload in username/profile fields.
- ❌ Weak: Chỉ nói "test happy path login" mà không nêu negative/security test cases như expired token, tampered JWT, CSRF.

### 🔴 [Senior] Extra Q20. How to handle incident response for leaked refresh token?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Immediate steps — (1) revoke all refresh token families for affected users, (2) rotate signing keys (JWK rotation) to invalidate all outstanding access JWTs, (3) force re-authentication, (4) audit logs for what was accessed with stolen token, (5) notify affected users per breach notification laws (72h GDPR); nêu rotation detection (stolen RT already used → system detected it).
- ❌ Weak: Chỉ nói "revoke token và thông báo user" mà không nêu key rotation, audit log review, hoặc legal notification requirements.

### 🔴 [Senior] Extra Q21. How to pass compliance audits for frontend auth?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu specific compliance requirements — SOC2: audit logs + access controls + session timeout; PCI-DSS: MFA for privileged access, no token storage in logs, session timeout 15 min for payment pages; GDPR: consent mechanism, data minimization in tokens, right to erasure includes invalidating sessions; HIPAA: audit trail for PHI access.
- ❌ Weak: Chỉ nói "tuân theo standard" mà không biết specific requirements của SOC2/PCI/GDPR cho auth.

### 🔴 [Senior] Extra Q22. How to design migration from legacy auth to modern OIDC?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Migration phases — (1) run dual auth systems side by side, (2) new users → OIDC, legacy users → old system, (3) migrate legacy users on next login (password rehash + link OIDC identity), (4) cut over + deprecate old system — và nêu strangler fig pattern, feature flags for gradual rollout, zero-downtime requirement.
- ❌ Weak: Nói "replace old auth với OIDC" mà không nêu migration strategy cho existing users hoặc dual-running period.

### 🔴 [Senior] Extra Q23. How to prevent auth regressions during rapid feature delivery?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Auth security regression suite = non-negotiable CI gate; include: (1) login/logout/refresh happy paths, (2) unauthorized access attempts to protected routes, (3) expired token handling, (4) CSRF token absence rejection — plus security-focused PR review checklist including "does this PR touch auth middleware/interceptor/cookie handling?"
- ❌ Weak: Chỉ nói "có test auth" mà không nêu specific regression categories hoặc CI gate enforcement.

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                        | Difficulty | Core Concept                    | Key Signal                                                                                     |
| --- | -------------------------------------------------------------- | ---------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Differentiate Authentication vs Authorization in frontend      | 🟢 Junior  | AuthN vs AuthZ concepts         | "Frontend enforces nothing — it only reflects"; backend always re-checks                       |
| 2   | Why frontend must not be source of truth for authorization?    | 🟢 Junior  | Client-side security limits     | DevTools can delete `isAdmin = false`; React state is mutable — never trust                    |
| 3   | Explain cookie-based auth for web apps                         | 🟢 Junior  | Cookie-based session auth       | Trade-off: cookie (revocable, CSRF risk) vs JWT (stateless, XSS risk)                          |
| 4   | Role of httpOnly, secure, sameSite cookie flags                | 🟢 Junior  | Cookie security flags           | Map each flag to attack vector: HttpOnly→XSS, Secure→network sniff, SameSite→CSRF              |
| 5   | Compare localStorage vs cookie for JWT storage                 | 🟢 Junior  | Token storage options           | 3 options: localStorage (XSS risk), httpOnly cookie, in-memory; with trade-offs                |
| 6   | When should in-memory token storage be considered?             | 🟢 Junior  | In-memory token storage         | Doesn't persist across page refresh — requires silent re-auth; high-security SPAs              |
| 7   | Explain OAuth 2.0 Authorization Code + PKCE for SPA            | 🟢 Junior  | OAuth 2.0 PKCE flow             | PKCE solves: SPA cannot keep client_secret; code interception attack prevention                |
| 8   | Why implicit flow is discouraged for modern SPAs?              | 🟢 Junior  | OAuth implicit flow risks       | Leak vectors: browser history, Referer header, fragment leakage to scripts                     |
| 9   | How does refresh token rotation improve security?              | 🟢 Junior  | Refresh token rotation          | Theft detection: if attacker uses stolen RT, server detects reuse → revoke family              |
| 10  | What is session fixation and mitigation?                       | 🟢 Junior  | Session fixation attack         | Rotate session ID after login; OWASP A02:2021 requirement                                      |
| 11  | How to implement CSRF protection in React apps?                | 🟢 Junior  | CSRF protection patterns        | Custom header (X-CSRF-Token) is sufficient — cross-site forms can't set custom headers         |
| 12  | How to secure API calls from frontend?                         | 🟢 Junior  | Secure API communication        | Centralized auth interceptor; timeout/retry control; validate response schema                  |
| 13  | What is Content Security Policy in auth context?               | 🟢 Junior  | CSP & auth security             | CSP blocks XSS → protects token indirectly; script-src controls exfiltration                   |
| 14  | Explain CORS and credentialed requests                         | 🟢 Junior  | CORS with credentials           | `Access-Control-Allow-Origin: *` does NOT work with credentials                                |
| 15  | How to manage auth state in React safely?                      | 🟡 Mid     | Auth state management           | BroadcastChannel for cross-tab logout synchronization                                          |
| 16  | What are protected routes and their limitations?               | 🟡 Mid     | Route guard limitations         | React Router guards = UX enhancement only, not security; backend must block                    |
| 17  | How do you handle token expiry race conditions?                | 🟡 Mid     | Token refresh race condition    | Promise singleton pattern — `??=` ensures exactly one refresh Promise exists                   |
| 18  | How to implement silent re-authentication?                     | 🟡 Mid     | Silent re-auth strategies       | refresh token endpoint vs hidden iframe (OIDC prompt=none); SPA vs SSR difference              |
| 19  | How to secure logout flow?                                     | 🟡 Mid     | Complete logout implementation  | 4 steps: clear in-memory token → revoke endpoint → clear cookies → notify other tabs           |
| 20  | How do SSO integrations work in frontend?                      | 🟡 Mid     | SSO flow in SPA                 | SP-initiated vs IdP-initiated SSO; `state` parameter for CSRF prevention                       |
| 21  | What is OpenID Connect and why important for frontend?         | 🟡 Mid     | OIDC vs OAuth 2.0               | OIDC = OAuth 2.0 + Identity layer; ID Token for identity, Access Token for API                 |
| 22  | How to validate ID Token on frontend?                          | 🟡 Mid     | ID Token validation             | Frontend decodes (not verifies) for UX; signature verification is backend's job                |
| 23  | What is BFF (Backend for Frontend) in auth architecture?       | 🟡 Mid     | BFF auth pattern                | BFF = "Token Guardian"; token custody shifts browser → BFF; httpOnly cookie for SPA            |
| 24  | How to design role/permission UI without leaking security?     | 🟡 Mid     | UI permission patterns          | "Hide for UX, block for security"; never expose full permission list to client                 |
| 25  | How to mitigate XSS impact on auth?                            | 🟡 Mid     | XSS defense in depth            | CSP + Trusted Types + sanitization (prevent) + httpOnly cookies (limit blast radius)           |
| 26  | How to mitigate replay attacks for tokens?                     | 🟡 Mid     | Token replay prevention         | DPoP (Demonstrating Proof of Possession): token bound to specific key pair                     |
| 27  | How to handle auth in mobile web and desktop web consistently? | 🟡 Mid     | Cross-platform auth             | Safari ITP blocks third-party cookies; adjust SameSite policy per platform                     |
| 28  | How to handle multi-tenant authentication in frontend?         | 🟡 Mid     | Multi-tenant auth isolation     | Tenant isolation risk: flush tenant-scoped caches on tenant switch                             |
| 29  | How to instrument auth security monitoring?                    | 🟡 Mid     | Auth event monitoring           | Alert signals: high login failure rate (credential stuffing), token reuse detection            |
| 30  | How to support MFA/2FA in SPA?                                 | 🟡 Mid     | MFA state machine               | MFA state machine: `password_verified` → MFA challenge → `fully_authenticated`                 |
| 31  | WebAuthn basics for frontend engineers?                        | 🔴 Senior  | WebAuthn / Passkeys             | Phishing-resistant: credential bound to origin; private key never leaves device                |
| 32  | How to combine passkey and password fallback?                  | 🔴 Senior  | Progressive passkey adoption    | Feature-detect `navigator.credentials`; progressive enhancement strategy                       |
| 33  | What is risk-based authentication?                             | 🔴 Senior  | Adaptive auth / risk signals    | Risk signals: new device fingerprint, unusual geo, velocity; step-up on high risk              |
| 34  | How to secure auth data in browser caches?                     | 🔴 Senior  | Cache security for auth data    | Differentiate layers: HTTP cache (`Cache-Control: no-store`), SW cache, local storage          |
| 35  | How to do secure API error handling?                           | 🔴 Senior  | Error message security          | User enumeration risk: "Email not found" vs "Wrong password" reveals valid accounts            |
| 36  | How to design auth for offline-first app?                      | 🔴 Senior  | Offline auth architecture       | Principle of least privilege offline; encrypt local data; short-lived offline tokens           |
| 37  | How to handle account linking (Google + Email) securely?       | 🔴 Senior  | Account linking security        | "Pre-verified email linking" vulnerability; verify ownership before linking                    |
| 38  | How to answer auth trade-off in interviews?                    | 🔴 Senior  | Interview framework for auth    | Start with threat model → constraints → compliance → recommend with justification              |
| 39  | How does zero-trust mindset apply to frontend auth?            | 🔴 Senior  | Zero-trust frontend             | "Never trust the client, always verify server-side"; every request re-authenticated            |
| 40  | What common auth mistakes do frontend teams make?              | 🔴 Senior  | Auth anti-patterns              | localStorage tokens + no CSP; route guards as only protection; no token rotation               |
| 41  | How to prepare for senior auth system design interviews?       | 🔴 Senior  | Auth interview preparation      | Draw complete flow: login, refresh, revoke, logout; link each decision to security requirement |
| E1  | How to secure social login popup flows?                        | 🟡 Mid     | Social login popup security     | Verify opener origin via `postMessage`; only trust expected IdP URL                            |
| E2  | Protect against token exfiltration via browser extensions?     | 🟡 Mid     | Extension threat model          | Extensions read DOM/localStorage in same origin; httpOnly cookies are safe                     |
| E3  | How to design account recovery securely?                       | 🟡 Mid     | Account recovery design         | Recovery link: single-use + 15-30 min TTL + invalidate all existing sessions                   |
| E4  | How to handle passwordless magic-link safely?                  | 🟡 Mid     | Magic link security             | Cryptographically random token; bind to email + IP + device fingerprint                        |
| E5  | How to secure device trust / remember-device features?         | 🟡 Mid     | Device trust tokens             | Device token = long-lived opaque value in httpOnly cookie, scoped to user+device               |
| E6  | How to enforce step-up auth for sensitive operations?          | 🟡 Mid     | Step-up authentication          | Backend returns 401 `WWW-Authenticate: StepUp`; frontend triggers re-auth modal                |
| E7  | How to prevent open redirect issues in auth callbacks?         | 🟡 Mid     | Open redirect prevention        | Validate `?next=` is relative path only; reject absolute URLs and protocol-relative            |
| E8  | How to secure redirect_uri handling in SPA?                    | 🟡 Mid     | redirect_uri security           | IdP must enforce exact match (not prefix/pattern); `state` parameter for CSRF                  |
| E9  | How to support enterprise SAML SSO in frontend UX?             | 🟡 Mid     | SAML SSO frontend UX            | Detect enterprise email domain → show "Sign in with SSO" — transparent to user                 |
| E10 | How to handle clock skew in token validation?                  | 🟡 Mid     | JWT clock skew handling         | Pre-emptive refresh (exp - 30s buffer) on frontend; server adds leeway tolerance               |
| E11 | How to secure impersonation/admin-switch-user flows?           | 🟡 Mid     | Admin impersonation security    | Impersonation token carries both `sub` (target user) and `actor` (admin); full audit log       |
| E12 | How to log out from all devices?                               | 🔴 Senior  | Global session revocation       | Increment `token_version` in user record; all JWTs with older version rejected                 |
| E13 | How to implement session concurrency limits?                   | 🔴 Senior  | Session concurrency control     | 2 strategies: kick oldest (streaming apps) or block new (banking); user-visible list           |
| E14 | How to secure GraphQL APIs with frontend auth?                 | 🔴 Senior  | GraphQL auth architecture       | Single endpoint → auth must be field-level and resolver-level, not just route-level            |
| E15 | How to handle auth when third-party cookies are blocked?       | 🔴 Senior  | Third-party cookie alternatives | Same-site subdomain auth; Storage Access API; CHIPS (partitioned cookies)                      |
| E16 | How to protect against session hijacking on shared devices?    | 🔴 Senior  | Shared device session security  | Idle timeout client+server; absolute session timeout regardless of activity                    |
| E17 | How to manage auth for embedded iframes/widgets?               | 🔴 Senior  | iframe auth isolation           | `X-Frame-Options: DENY`; `postMessage` with origin validation for iframe auth                  |
| E18 | How to design consent + auth flows together?                   | 🔴 Senior  | Consent + auth integration      | Consent: granular (scope-based), revocable, re-requested when scope expands                    |
| E19 | How to test auth security with automated E2E?                  | 🔴 Senior  | Auth regression testing         | Test matrix: expired token handling, refresh race conditions, logout across tabs               |
| E20 | How to handle incident response for leaked refresh token?      | 🔴 Senior  | Auth incident response          | Immediate: revoke all refresh token families → force re-login → audit scope of leak            |
| E21 | How to pass compliance audits for frontend auth?               | 🔴 Senior  | Compliance (SOC2/GDPR/PCI)      | SOC2: audit logs + access control; GDPR: consent + right-to-be-forgotten; PCI: session timeout |
| E22 | How to design migration from legacy auth to modern OIDC?       | 🔴 Senior  | Auth migration strategy         | Dual auth systems side-by-side; new users → OIDC; existing users migrated gradually            |
| E23 | How to prevent auth regressions during rapid feature delivery? | 🔴 Senior  | Auth regression prevention      | CI gate: login/logout/refresh happy paths + unauthorized access + expired token tests          |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Design the authentication architecture for a React SPA that needs to be secure, support SSO via Google, and remember the user for 30 days without compromising security."**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**

1. **Define/scope**: "This touches three concerns — token storage security, OAuth integration, and long-lived sessions — each with different trade-offs."
2. **Core mechanism**: "I'd use OAuth 2.0 with PKCE for Google SSO, a BFF pattern to hold tokens server-side, and an httpOnly session cookie for the browser. The '30-day remember me' maps to a long-lived refresh token stored server-side, not in the browser."
3. **Real example**: "This is the pattern Next.js Auth.js and many auth libraries implement — the SPA never sees the OAuth refresh token; it only holds a session cookie. The BFF silently refreshes the access token as needed."
4. **Trade-off**: "The trade-off is added server infrastructure for the BFF, but this is the only approach that gives us revocability, XSS resistance, and long-lived sessions simultaneously. Pure JWT in localStorage would be simpler but fails on XSS risk; short-lived sessions would fail the '30-day' requirement."

---

## Study Cases / Tình Huống Thực Tế Sâu

### Case 1: Uber JWT Secret Leaked (2022)

**Tình huống**: Uber suffered a major security incident where an attacker gained access to internal systems. During investigation, it was found that sensitive credentials including JWT signing secrets were stored in a shared internal wiki (Confluence) accessible to employees. The attacker obtained contractor credentials through social engineering and traversed to find these secrets.

**Quyết định**: Uber had stored long-lived JWT signing secrets in plaintext in internal documentation rather than in a secrets management system (HashiCorp Vault, AWS Secrets Manager).

**Kết quả**: With the JWT signing secret, an attacker could forge tokens for any user ID, including admin accounts — effectively bypassing all JWT-based authorization in the system.

**Bài học**:

- JWT signing secrets are crown jewels — store ONLY in secrets management systems, never wikis, repos, or config files
- Use asymmetric keys (RS256) where possible — compromise of private key is detectable; rotate keys via JWKS endpoint without re-deploying
- Implement key rotation procedures and JWK versioning so old tokens can be invalidated
- Audit who has access to signing keys with same rigor as production database credentials
- Short-lived access tokens (15 min) limit the blast radius even if signing key is compromised temporarily

---

### Case 2: OAuth Misconfiguration — Redirect URI Bypass

**Tình huống**: A major developer platform (multiple companies have faced this pattern) had registered OAuth redirect URIs using loose matching — accepting any URI that _started with_ the registered domain rather than exact matching. Example: registered `https://app.example.com/callback`, but the IdP accepted `https://app.example.com/callback/../../../evil`.

**Quyết định**: The platform chose developer convenience (allowing wildcard-style redirect URIs) over strict security. This was a misconfiguration rather than an intentional design choice.

**Kết quả**: Attacker constructed a crafted authorization URL directing users to OAuth flow, with a manipulated `redirect_uri` that passed validation but redirected the authorization code to an attacker-controlled endpoint. Attacker could then exchange the code for tokens using their registered client credentials.

**Bài học**:

- IdPs must enforce **exact match** of redirect URIs, not prefix or pattern matching
- RFC 6749 and OAuth 2.0 Security BCP require exact redirect_uri matching
- Frontend must always validate the `state` parameter on callback to prevent CSRF on the OAuth flow
- Register only the specific redirect URIs needed — no wildcards

---

### Case 3: Session Fixation via Insecure Login Flow

**Tình huống**: A banking web application allowed pre-login session IDs to persist after successful authentication. An attacker discovered they could plant a known session ID in a victim's browser (via a crafted link or subdomain XSS), wait for the victim to log in, then use the now-authenticated session with the known ID.

**Quyết định**: The development team had assumed session IDs generated at app start were sufficient. They did not implement session ID rotation on privilege change events (login, role change, sudo operations).

**Kết quả**: Attacker hijacked authenticated sessions of multiple users, accessing account data and initiating transactions before the security team detected the pattern through anomalous session activity alerts.

**Bài học**:

- **Always** generate a new session ID immediately after any authentication state change (login, logout, privilege elevation)
- This is OWASP A02:2021 requirement — session IDs from before login must be invalidated
- Bind session to additional context: User-Agent + partial IP (careful with mobile IP changes) + creation timestamp
- Implement absolute session timeout (e.g., 24h max regardless of activity) in addition to idle timeout

---

### Case 4: Token Refresh Race Condition in Production

**Tình huống**: A SaaS dashboard application with many power users who worked with multiple browser tabs experienced mysterious "random logouts." Users would be working normally, then suddenly find themselves on the login page across all tabs simultaneously. Support tickets piled up, and the team initially suspected infrastructure issues.

**Quyết định**: The team had implemented refresh token rotation (good) but had NOT implemented a Promise singleton for the refresh call (bad). When a user had 4-5 tabs open and their access token expired, all tabs simultaneously detected the 401 and fired refresh requests.

**Kết quả**: With rotation enabled, the first refresh succeeded and invalidated the old refresh token. The 2nd, 3rd, 4th tab then attempted to refresh with the now-invalid token. The server, correctly detecting refresh token reuse (a breach signal), revoked the entire token family for that user — forcing a full logout. Ironically, the security feature worked correctly; the application's frontend logic was the bug.

**Bài học**:

- Refresh token rotation + multi-tab applications = **mandatory** Promise singleton for the refresh call
- Use `??=` (nullish assignment) or equivalent to ensure exactly one refresh Promise exists at a time
- BroadcastChannel can also be used to coordinate refresh across tabs — one "leader" tab refreshes, broadcasts new token to others
- Monitor for "rotation reuse detected" events — they can indicate both genuine attacks AND this implementation bug

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                                                     |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Giải thích sự khác biệt giữa JWT và session cookie — nêu ít nhất 3 trade-off cụ thể (revocability, scalability, XSS/CSRF risk). Liệt kê 3 cookie flags và attack vector mỗi flag ngăn chặn. |
| 2   | 🎨 Visual      | Vẽ OAuth 2.0 Authorization Code + PKCE flow từ trí nhớ — bao gồm code_verifier, code_challenge, authorization code, và token exchange.                                                      |
| 3   | 🛠️ Application | App cần "remember me 30 ngày". Bạn thiết kế như thế nào? JWT trong localStorage, httpOnly cookie, hay BFF + refresh token? Tại sao?                                                         |
| 4   | 🐛 Debug       | User đăng xuất nhưng JWT cũ vẫn còn hiệu lực 15 phút. Fix thế nào? Nêu 2 cách tiếp cận với trade-off của mỗi cách.                                                                          |
| 5   | 🎓 Teach       | Giải thích PKCE cho người không biết code bằng 1 câu liên tưởng. Sau đó giải thích OAuth 2.0 vs OIDC khác nhau gì trong 2 câu.                                                              |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | JWT: stateless (scalable), không revoke được ngay, XSS risk nếu localStorage, CSRF-safe; Session: stateful (server store), revocable instantly, CSRF risk nếu cookie, cần shared store khi scale. Cookie flags: `HttpOnly` (chặn XSS đọc cookie), `Secure` (chỉ HTTPS), `SameSite=Strict/Lax` (chặn CSRF). |
| 2   | (1) FE tạo `code_verifier` (random), hash thành `code_challenge`; (2) Redirect auth server với `code_challenge`; (3) Auth server trả `authorization code`; (4) FE exchange `code` + `code_verifier` → tokens; (5) Server verify `hash(code_verifier) == code_challenge`.                                   |
| 3   | **httpOnly cookie + BFF + refresh token rotation**: httpOnly bảo vệ XSS, BFF giữ access token ở server (không expose ra client), refresh token 30 ngày + access token 15 phút. KHÔNG dùng localStorage (XSS vulnerable).                                                                                   |
| 4   | Cách 1: **Token blocklist** (Redis store revoked token IDs) → revoke ngay lập tức, overhead O(1) lookup per request. Cách 2: **Shorten expiry** (<5 phút) + silent refresh — window nhỏ hơn, không cần blocklist nhưng vẫn có gap.                                                                         |
| 5   | PKCE: như "mật khẩu một lần hai bước" — gửi đi bằng chứng (hash), sau đó chứng minh biết bí mật gốc; authorization code bị đánh cắp cũng vô dụng. OAuth 2.0 = protocol cấp quyền; OIDC = OAuth 2.0 + identity layer (ID token, userinfo endpoint, `sub` claim).                                            |

> 🎯 **Feynman Prompt:** Giải thích sự khác biệt giữa authentication và authorization như đang giải thích cho người không biết code. Sau đó giải thích tại sao frontend không thể là "nguồn sự thật" cho authorization.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày**.

[Back to Table of Contents](../../00-table-of-contents.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Common Vulnerabilities](./01-common-vulnerabilities.md) — XSS/CSRF tấn công vào auth session và cookie
- [Web Security Comprehensive](./03-web-security-comprehensive.md) — bối cảnh bảo mật toàn diện bao gồm auth flows
- [FE System Design: Architecture Patterns](../08-fe-system-design/01-architecture-patterns.md) — BFF pattern liên quan đến token management

### Khác track (Cross-track)
- [Modern Auth Patterns](../../shared/04-security/04-modern-auth-patterns.md) — JWT, OAuth 2.0, OIDC, PKCE patterns chi tiết
- [Security Fundamentals](../../shared/04-security/01-security-fundamentals.md) — nguyên tắc bảo mật nền tảng cho auth design
- [Backend Auth & Security](../../be-track/02-backend-knowledge/04-auth-security.md) — triển khai auth phía server, token validation
