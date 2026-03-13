# Authentication & Security

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Kiến thức Auth & Security cho Go Backend Developer (Middle/Senior)

> **Target**: Zalo (VNG), Grab, Axon, Employment Hero, Microsoft, Google
> **Mức độ**: Từ cơ bản đến chuyên sâu, ~85% lý thuyết + 15% code
> **Phong cách**: Q&A, song ngữ (English terms + Vietnamese giải thích)

---

## Table of Contents

1. [Authentication vs Authorization](#1-authentication-vs-authorization)
2. [Session-Based Authentication](#2-session-based-authentication)
3. [Token-Based Authentication (JWT)](#3-token-based-authentication-jwt)
4. [OAuth 2.0](#4-oauth-20)
5. [OpenID Connect (OIDC)](#5-openid-connect-oidc)
6. [API Key Authentication](#6-api-key-authentication)
7. [Mutual TLS (mTLS)](#7-mutual-tls-mtls)
8. [Access Control Models](#8-access-control-models)
9. [Password Security](#9-password-security)
10. [Common Security Vulnerabilities (OWASP)](#10-common-security-vulnerabilities-owasp)
11. [CORS (Cross-Origin Resource Sharing)](#11-cors-cross-origin-resource-sharing)
12. [Secrets Management](#12-secrets-management)
13. [Network Security for Backend](#13-network-security-for-backend)
14. [Security Checklist & Interview Tips](#14-security-checklist--interview-tips)

---

## 1. Authentication vs Authorization


## Câu Hỏi Phỏng Vấn / Interview Q&A
### Q: Phân biệt Authentication và Authorization? 🟢 🟢 [Junior]

**A:** Đây là hai khái niệm hoàn toàn khác nhau nhưng thường bị nhầm lẫn:

```
┌─────────────────────────────────────────────────────────────────────┐
│              Authentication vs Authorization                        │
├──────────────────┬──────────────────────────────────────────────────┤
│   Tiêu chí       │  Authentication (AuthN)  │  Authorization (AuthZ) │
├──────────────────┼─────────────────────────┼────────────────────────┤
│ Câu hỏi          │ "Who are you?"          │ "What can you do?"     │
│ Mục đích          │ Xác minh danh tính      │ Kiểm tra quyền truy cập│
│ Thứ tự            │ Xảy ra TRƯỚC            │ Xảy ra SAU             │
│ Dữ liệu cần      │ Credentials (user/pass) │ Roles, permissions     │
│ Thất bại → HTTP   │ 401 Unauthorized        │ 403 Forbidden          │
│ Ví dụ thực tế     │ Quẹt thẻ vào tòa nhà   │ Được vào phòng nào     │
│ Protocol          │ OIDC, SAML              │ OAuth 2.0, RBAC        │
└──────────────────┴─────────────────────────┴────────────────────────┘
```

**Vị trí trong request lifecycle:**

```
Client Request
    │
    ▼
┌──────────────┐
│  TLS/HTTPS   │  ← Encryption in transit
└──────┬───────┘
       ▼
┌──────────────┐
│   Gateway/   │  ← Rate limiting, IP filtering
│   WAF/LB     │
└──────┬───────┘
       ▼
┌──────────────┐
│ AUTHENTICATION│  ← "Bạn là ai?" - Verify JWT/session/API key
│  Middleware   │     → 401 nếu thất bại
└──────┬───────┘
       ▼
┌──────────────┐
│ AUTHORIZATION │  ← "Bạn được làm gì?" - Check RBAC/ABAC
│  Middleware   │     → 403 nếu không có quyền
└──────┬───────┘
       ▼
┌──────────────┐
│   Business   │  ← Xử lý logic nghiệp vụ
│    Logic     │
└──────────────┘
```

**Key insight**: Authentication luôn xảy ra trước Authorization. Bạn phải biết "ai" đang request trước khi quyết định "cho phép" hay không. Một request có thể authenticated nhưng không authorized (bạn đã đăng nhập, nhưng không có quyền admin).

---

## 2. Session-Based Authentication

### Q: Session-based authentication hoạt động như thế nào? 🟢 🟢 [Junior]

**A:** Session-based auth là phương pháp truyền thống, server lưu trạng thái đăng nhập của user.

```
  Client (Browser)                          Server
       │                                       │
       │  1. POST /login {user, password}       │
       │──────────────────────────────────────>│
       │                                       │  2. Validate credentials
       │                                       │  3. Create session in store
       │                                       │     session_id → {user_id, role, ...}
       │  4. Set-Cookie: sid=abc123; HttpOnly   │
       │<──────────────────────────────────────│
       │                                       │
       │  5. GET /api/profile                   │
       │  Cookie: sid=abc123                    │
       │──────────────────────────────────────>│
       │                                       │  6. Lookup session_id="abc123"
       │                                       │     → Found: {user_id: 42, role: admin}
       │  7. 200 OK {profile data}              │
       │<──────────────────────────────────────│
```

### Q: Có những cách nào lưu trữ session? So sánh ưu nhược điểm? 🟡 🟡 [Mid]

**A:**

```
┌──────────────┬──────────────┬──────────────┬──────────────────────┐
│ Storage       │ Speed        │ Scalability  │ Persistence          │
├──────────────┼──────────────┼──────────────┼──────────────────────┤
│ In-memory    │ Fastest      │ ✗ Single     │ ✗ Lost on restart    │
│ (map/sync)   │ ~nanoseconds │   server only│                      │
├──────────────┼──────────────┼──────────────┼──────────────────────┤
│ Redis        │ Very fast    │ ✓ Shared     │ ✓ Configurable       │
│              │ ~1ms         │   across     │   (RDB/AOF)          │
│              │              │   servers    │                      │
├──────────────┼──────────────┼──────────────┼──────────────────────┤
│ Database     │ Slower       │ ✓ Shared     │ ✓ Full durability    │
│ (PostgreSQL) │ ~5-10ms      │              │                      │
├──────────────┼──────────────┼──────────────┼──────────────────────┤
│ Encrypted    │ N/A (client) │ ✓ Stateless  │ ✓ Client-side        │
│ Cookie       │              │   server     │ ✗ Size limit (4KB)   │
└──────────────┴──────────────┴──────────────┴──────────────────────┘
```

**Production recommendation**: Redis là lựa chọn phổ biến nhất - cân bằng tốt giữa tốc độ, scalability, và persistence. Hầu hết framework Go (gorilla/sessions) đều có Redis adapter.

### Q: Session fixation attack là gì và cách phòng chống? 🟡 🟡 [Mid]

**A:** Attacker tạo sẵn một session ID, trick victim sử dụng session ID đó để đăng nhập. Sau khi victim đăng nhập thành công, attacker dùng session ID đã biết để truy cập.

```
Attacker                    Victim                     Server
   │                           │                          │
   │  1. GET /login             │                          │
   │──────────────────────────────────────────────────────>│
   │  Set-Cookie: sid=EVIL123   │                          │
   │<──────────────────────────────────────────────────────│
   │                           │                          │
   │  2. Gửi link cho victim   │                          │
   │  với cookie sid=EVIL123    │                          │
   │─────────────────────────>│                          │
   │                           │  3. POST /login           │
   │                           │  Cookie: sid=EVIL123      │
   │                           │─────────────────────────>│
   │                           │  (Login thành công,       │
   │                           │   session EVIL123 giờ     │
   │                           │   gắn với victim)         │
   │                           │                          │
   │  4. Attacker dùng EVIL123  │                          │
   │  để truy cập với tư cách  │                          │
   │  victim!                   │                          │
   │──────────────────────────────────────────────────────>│
```

**Phòng chống:**
1. **Regenerate session ID** sau mỗi lần đăng nhập thành công (quan trọng nhất)
2. **Bind session với IP/User-Agent** - thay đổi → invalidate
3. **Set session timeout** ngắn hợp lý
4. **Dùng HttpOnly + Secure + SameSite** cookie flags

### Q: Ưu nhược điểm của session-based auth? 🟢 🟢 [Junior]

**Ưu điểm:**
- **Dễ revoke**: Xóa session khỏi store → user bị logout ngay lập tức
- **Server kiểm soát hoàn toàn**: Có thể track active sessions, force logout
- **Không lộ sensitive data** ở client (chỉ có session ID)

**Nhược điểm:**
- **Stateful**: Server phải lưu trữ session → tốn memory
- **Khó scale horizontally**: Cần shared session store (Redis) hoặc sticky sessions
- **CSRF vulnerability**: Browser tự gửi cookie → attacker có thể lợi dụng
- **Không phù hợp cho mobile/API**: Cookie-based, khó dùng cross-domain

---

## 3. Token-Based Authentication (JWT)

### Q: JWT là gì? Cấu trúc như thế nào? 🟢 🟢 [Junior]

**A:** JWT (JSON Web Token) là một chuẩn mở (RFC 7519) dùng để truyền thông tin an toàn giữa các bên dưới dạng JSON object được ký số (digitally signed).

```
JWT Structure:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Header          Payload          Signature            │
│  (Base64URL)  .  (Base64URL)  .  (Base64URL)           │
│                                                         │
│  eyJhbGci...  .  eyJzdWIi...  .  SflKxwRJ...          │
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐   │
│  │{         │   │{         │   │ HMACSHA256(       │   │
│  │ "alg":   │   │ "sub":   │   │   base64Url(hdr)  │   │
│  │  "HS256",│   │  "1234", │   │   + "." +         │   │
│  │ "typ":   │   │ "name":  │   │   base64Url(pay), │   │
│  │  "JWT"   │   │  "John", │   │   secret          │   │
│  │}         │   │ "exp":   │   │ )                  │   │
│  │          │   │  168...  │   │                    │   │
│  └──────────┘   └──────────┘   └──────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**QUAN TRỌNG**: JWT payload KHÔNG được mã hóa (encrypted), chỉ được encode (Base64URL). Bất kỳ ai cũng có thể đọc payload. KHÔNG bao giờ đặt sensitive data (password, credit card) trong JWT payload.

### Q: So sánh các thuật toán ký JWT: HS256, RS256, ES256? 🟡 🟡 [Mid]

**A:**

```
┌──────────┬─────────────────┬──────────────────┬──────────────────┐
│ Thuật toán│ Loại             │ Ký (Sign)         │ Xác minh (Verify)│
├──────────┼─────────────────┼──────────────────┼──────────────────┤
│ HS256    │ Symmetric        │ Shared secret    │ Shared secret    │
│ (HMAC)   │ (cùng 1 key)     │                  │                  │
├──────────┼─────────────────┼──────────────────┼──────────────────┤
│ RS256    │ Asymmetric       │ Private key      │ Public key       │
│ (RSA)    │ (cặp key)        │ (chỉ auth server)│ (ai cũng verify) │
├──────────┼─────────────────┼──────────────────┼──────────────────┤
│ ES256    │ Asymmetric       │ Private key      │ Public key       │
│ (ECDSA)  │ (cặp key)        │ Key nhỏ hơn RSA  │ Nhanh hơn RSA    │
└──────────┴─────────────────┴──────────────────┴──────────────────┘

Khi nào dùng:
• HS256: Monolith, 1 service vừa sign vừa verify. Đơn giản, nhanh.
• RS256: Microservices - auth service sign, các service khác verify bằng public key.
          Dùng cho JWKS (JSON Web Key Set) endpoint.
• ES256: Như RS256 nhưng key nhỏ hơn, nhanh hơn. Phổ biến trong mobile/IoT.
```

### Q: JWT claims gồm những loại nào? 🟢 🟢 [Junior]

**A:**

- **Registered claims** (tiêu chuẩn, recommended): `iss` (issuer), `sub` (subject), `aud` (audience), `exp` (expiration), `nbf` (not before), `iat` (issued at), `jti` (JWT ID - dùng cho revocation)
- **Public claims**: Đăng ký tại IANA hoặc dùng URI tránh conflict. VD: `email`, `name`
- **Private claims**: Custom claims giữa các party đồng ý. VD: `role`, `tenant_id`

### Q: Access Token vs Refresh Token hoạt động như thế nào? Tại sao cần cả hai? 🟡 🟡 [Mid]

**A:**

**Lý do cần 2 token:**
- Access token ngắn hạn (15 phút) → nếu bị steal, thiệt hại giới hạn
- Refresh token dài hạn (7-30 ngày) → dùng để lấy access token mới khi hết hạn
- Refresh token chỉ gửi đến auth server, không gửi đến resource server → giảm bề mặt tấn công

```
Client                   Auth Server              Resource Server
  │                          │                          │
  │  1. POST /login          │                          │
  │  {email, password}       │                          │
  │─────────────────────────>│                          │
  │                          │ Validate credentials     │
  │  2. {                    │                          │
  │    access_token (15min), │                          │
  │    refresh_token (7d)    │                          │
  │  }                       │                          │
  │<─────────────────────────│                          │
  │                          │                          │
  │  3. GET /api/data        │                          │
  │  Authorization: Bearer   │                          │
  │    <access_token>        │                          │
  │─────────────────────────────────────────────────────>│
  │                          │      Verify JWT locally   │
  │  4. 200 OK {data}        │                          │
  │<─────────────────────────────────────────────────────│
  │                          │                          │
  │  ... 15 phút sau, access token hết hạn ...          │
  │                          │                          │
  │  5. GET /api/data        │                          │
  │  Authorization: Bearer   │                          │
  │    <expired_token>       │                          │
  │─────────────────────────────────────────────────────>│
  │  6. 401 Token Expired    │                          │
  │<─────────────────────────────────────────────────────│
  │                          │                          │
  │  7. POST /auth/refresh   │                          │
  │  {refresh_token}         │                          │
  │─────────────────────────>│                          │
  │                          │ Validate refresh token   │
  │                          │ Rotate: invalidate old,  │
  │                          │   issue new refresh token │
  │  8. {                    │                          │
  │    NEW access_token,     │                          │
  │    NEW refresh_token     │                          │
  │  }                       │                          │
  │<─────────────────────────│                          │
  │                          │                          │
  │  9. Retry with new       │                          │
  │     access_token         │                          │
  │─────────────────────────────────────────────────────>│
```

**Token Rotation** (bước 8): Mỗi lần dùng refresh token, server phát ra refresh token mới và invalidate cái cũ. Nếu attacker steal refresh token cũ và dùng lại → server phát hiện token đã bị dùng → revoke toàn bộ token family → user phải login lại.

### Q: JWT có những nhược điểm gì? Làm sao revoke JWT? 🔴 🔴 [Senior]

**A:**

**Nhược điểm:**
1. **Không thể revoke dễ dàng**: JWT stateless, server không track → sau khi sign, token valid cho đến khi hết hạn
2. **Payload size lớn**: JWT thường 800-2000 bytes vs session ID 32 bytes → overhead cho mỗi request
3. **Token theft**: Nếu access token bị steal, attacker dùng được cho đến khi hết hạn
4. **Clock skew**: Các server có clock khác nhau → cần buffer cho `exp` claim

**Chiến lược revocation:**

```
┌─────────────────────┬────────────────────────┬──────────────────────┐
│ Chiến lược           │ Cách hoạt động          │ Trade-off             │
├─────────────────────┼────────────────────────┼──────────────────────┤
│ Short TTL           │ Access token 5-15 phút │ Cân bằng UX vs       │
│                     │ → hết hạn nhanh         │ security              │
├─────────────────────┼────────────────────────┼──────────────────────┤
│ Token Blacklist     │ Lưu revoked JWT ID     │ Cần shared store      │
│ (denylist)          │ (jti) vào Redis        │ (Redis) → mất stateless│
├─────────────────────┼────────────────────────┼──────────────────────┤
│ Token Versioning    │ DB lưu token_version   │ Cần DB lookup mỗi     │
│                     │ per user. JWT chứa      │ request → chậm hơn    │
│                     │ version. Bump version  │                      │
│                     │ → tất cả token cũ fail  │                      │
├─────────────────────┼────────────────────────┼──────────────────────┤
│ Refresh token       │ Revoke refresh token   │ Access token vẫn      │
│ revocation          │ → không renew được      │ valid đến khi hết hạn │
└─────────────────────┴────────────────────────┴──────────────────────┘
```

**Production recommendation**: Kết hợp Short TTL (15 phút) + Refresh Token Rotation + Token Blacklist cho critical actions (password change, logout).

### Q: So sánh Session-based vs JWT-based authentication? 🟡 🟡 [Mid]

**A:**

```
┌──────────────────┬──────────────────────┬──────────────────────┐
│ Tiêu chí          │ Session-based         │ JWT-based             │
├──────────────────┼──────────────────────┼──────────────────────┤
│ State             │ Stateful (server)    │ Stateless             │
│ Storage           │ Server-side store    │ Client-side (token)   │
│ Scalability       │ Cần shared store     │ Dễ scale horizontally │
│ Revocation        │ ✓ Dễ (xóa session)  │ ✗ Khó (cần blacklist) │
│ Cross-domain      │ ✗ Khó (cookie)       │ ✓ Dễ (Authorization)  │
│ Mobile-friendly   │ ✗ Cookie-based       │ ✓ Header-based        │
│ Microservices     │ ✗ Cần shared store   │ ✓ Mỗi service verify  │
│ Bandwidth         │ Nhẹ (session ID)     │ Nặng hơn (full JWT)   │
│ CSRF vulnerable   │ ✓ Có (cookie auto)   │ ✗ Không (manual hdr)  │
│ XSS risk          │ Thấp (HttpOnly)      │ Cao (localStorage)    │
│ Best for          │ Monolith, web apps   │ APIs, microservices   │
└──────────────────┴──────────────────────┴──────────────────────┘
```

---

## 4. OAuth 2.0

### Q: OAuth 2.0 là gì? Giải quyết vấn đề gì? 🟢 🟢 [Junior]

**A:** OAuth 2.0 là **authorization framework** (KHÔNG phải authentication protocol) cho phép ứng dụng bên thứ 3 (third-party) truy cập tài nguyên của user mà KHÔNG cần biết password của user.

**Vấn đề giải quyết:** Trước OAuth, nếu app Trello muốn truy cập Google Calendar của bạn, bạn phải đưa Google password cho Trello → cực kỳ nguy hiểm. OAuth cho phép Trello request quyền giới hạn (scope) mà bạn cho phép, mà không cần chia sẻ password.

**4 vai trò (roles):**
```
┌─────────────────────────────────────────────────────────────────┐
│                        OAuth 2.0 Roles                          │
├──────────────────┬──────────────────────────────────────────────┤
│ Resource Owner   │ User - người sở hữu data (bạn)              │
│ Client           │ App muốn truy cập data (Trello)             │
│ Authorization    │ Server xác thực và cấp token                │
│   Server         │ (accounts.google.com)                       │
│ Resource Server  │ Server chứa data được bảo vệ                │
│                  │ (calendar.google.com/api)                   │
└──────────────────┴──────────────────────────────────────────────┘
```

### Q: Trình bày Authorization Code Flow? 🟡 🟡 [Mid]

**A:** Đây là flow phổ biến và an toàn nhất, dùng cho server-side web apps:

```
 User          Browser/Client        Your Server         Auth Server       Resource Server
  │                │                     │                    │                  │
  │ 1.Click        │                     │                    │                  │
  │ "Login with    │                     │                    │                  │
  │  Google"       │                     │                    │                  │
  │───────────────>│                     │                    │                  │
  │                │  2. Redirect to:    │                    │                  │
  │                │  auth-server.com/authorize?              │                  │
  │                │    response_type=code                    │                  │
  │                │    &client_id=xxx                        │                  │
  │                │    &redirect_uri=your-app.com/callback   │                  │
  │                │    &scope=email+profile                  │                  │
  │                │    &state=random123 (CSRF protection)    │                  │
  │                │─────────────────────────────────────────>│                  │
  │                │                     │                    │                  │
  │  3. Auth server shows consent screen │                    │                  │
  │  "Trello wants to access your       │                    │                  │
  │   calendar. Allow?"                  │                    │                  │
  │<─────────────────────────────────────────────────────────│                  │
  │                │                     │                    │                  │
  │ 4. User clicks │                     │                    │                  │
  │    "Allow"     │                     │                    │                  │
  │───────────────────────────────────────────────────────── >│                  │
  │                │                     │                    │                  │
  │                │  5. Redirect to:    │                    │                  │
  │                │  your-app.com/callback?code=AUTH_CODE    │                  │
  │                │    &state=random123 │                    │                  │
  │                │<────────────────────────────────────────│                  │
  │                │                     │                    │                  │
  │                │  6. Forward code    │                    │                  │
  │                │────────────────────>│                    │                  │
  │                │                     │  7. POST /token    │                  │
  │                │                     │  {code, client_id, │                  │
  │                │                     │   client_secret,   │                  │
  │                │                     │   redirect_uri}    │                  │
  │                │                     │  (SERVER-TO-SERVER) │                  │
  │                │                     │───────────────────>│                  │
  │                │                     │                    │                  │
  │                │                     │  8. {access_token, │                  │
  │                │                     │      refresh_token}│                  │
  │                │                     │<───────────────────│                  │
  │                │                     │                    │                  │
  │                │                     │  9. GET /userinfo  │                  │
  │                │                     │  Authorization:    │                  │
  │                │                     │   Bearer <token>   │                  │
  │                │                     │────────────────────────────────────── >│
  │                │                     │                    │                  │
  │                │                     │  10. {user data}   │                  │
  │                │                     │<──────────────────────────────────────│
```

**Điểm quan trọng:**
- **Bước 7**: Token exchange xảy ra server-to-server → client_secret không bao giờ lộ ở browser
- **state parameter**: Chống CSRF - server tạo random value, verify khi callback
- **Authorization code** chỉ dùng 1 lần, thời hạn rất ngắn (~10 phút)

### Q: PKCE là gì? Tại sao SPA/mobile cần PKCE? 🟡 🟡 [Mid]

**A:** PKCE (Proof Key for Code Exchange, đọc là "pixy") giải quyết vấn đề: SPA/mobile app KHÔNG CÓ client_secret (vì code chạy trên device của user, secret sẽ bị lộ).

```
Không có PKCE (nguy hiểm cho public client):
  Attacker có thể intercept authorization code trong redirect
  → Exchange lấy access token (vì không cần client_secret)

Với PKCE:
  Client tạo:
    code_verifier = random string (43-128 chars)
    code_challenge = BASE64URL(SHA256(code_verifier))

  Bước 1: Gửi code_challenge đến auth server
  Bước 2: Auth server lưu code_challenge
  Bước 3: Nhận auth code, gửi code_verifier để exchange token
  Bước 4: Auth server verify: SHA256(code_verifier) == code_challenge?
           → Chỉ client tạo ra code_verifier mới exchange được

  Attacker intercept auth code → nhưng KHÔNG có code_verifier → fail
```

**Hiện nay**: PKCE được khuyến nghị cho TẤT CẢ OAuth clients (kể cả server-side), không chỉ public clients. Đây là best practice theo OAuth 2.1 draft.

### Q: So sánh các OAuth 2.0 grant types? 🔴 🔴 [Senior]

**A:**

```
┌──────────────────────┬──────────────────┬──────────────────┬──────────────┐
│ Grant Type            │ Use Case          │ Has Secret?       │ Security      │
├──────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Authorization Code   │ Server-side web  │ ✓ client_secret  │ ★★★★★        │
│                      │ apps (Go, Node)  │                  │ Most secure  │
├──────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Auth Code + PKCE     │ SPA, Mobile,     │ ✗ public client  │ ★★★★★        │
│                      │ Desktop apps     │ + code_verifier  │              │
├──────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Client Credentials   │ Machine-to-      │ ✓ client_secret  │ ★★★★         │
│                      │ machine (no user)│                  │ No user ctx  │
├──────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Device Code          │ Smart TV, CLI,   │ ✗ limited input  │ ★★★★         │
│                      │ IoT devices      │                  │              │
├──────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Implicit (DEPRECATED)│ Cũ: SPA          │ ✗               │ ★★ Insecure  │
│                      │ → Dùng PKCE thay │                  │ Token in URL │
├──────────────────────┼──────────────────┼──────────────────┼──────────────┤
│ Password (DEPRECATED)│ Cũ: First-party  │ ✓               │ ★★ Insecure  │
│                      │ → Dùng Auth Code │                  │ Shares creds │
└──────────────────────┴──────────────────┴──────────────────┴──────────────┘
```

**Device Code Flow** (hay gặp trong phỏng vấn):
```
Device (TV)             Auth Server            User's Phone/PC
    │                       │                       │
    │ 1. POST /device/code  │                       │
    │  {client_id}          │                       │
    │──────────────────────>│                       │
    │                       │                       │
    │ 2. {device_code,      │                       │
    │     user_code="ABCD", │                       │
    │     verification_uri} │                       │
    │<──────────────────────│                       │
    │                       │                       │
    │ 3. Hiển thị:          │                       │
    │ "Go to https://...    │                       │
    │  Enter code: ABCD"    │                       │
    │                       │                       │
    │                       │   4. User mở browser  │
    │                       │   nhập code "ABCD"    │
    │                       │   và approve           │
    │                       │<──────────────────────│
    │                       │                       │
    │ 5. Poll POST /token   │                       │
    │ {device_code}         │                       │
    │──────────────────────>│                       │
    │ 6. {access_token}     │                       │
    │<──────────────────────│                       │
```

---

## 5. OpenID Connect (OIDC)

### Q: OIDC khác OAuth 2.0 như thế nào? 🟡 🟡 [Mid]

**A:**

```
┌────────────────────────────────────────────────────────────────┐
│                    OAuth 2.0 vs OIDC                           │
├────────────────────────┬───────────────────────────────────────┤
│ OAuth 2.0              │ OIDC (OpenID Connect)                 │
├────────────────────────┼───────────────────────────────────────┤
│ Authorization only     │ Authentication + Authorization        │
│ "What can you access?" │ "Who are you?" + "What can you do?"   │
├────────────────────────┼───────────────────────────────────────┤
│ Returns access_token   │ Returns access_token + ID Token (JWT) │
│ (opaque or JWT)        │                                       │
├────────────────────────┼───────────────────────────────────────┤
│ No standard for user   │ UserInfo endpoint + standard claims   │
│ identity               │ (sub, name, email, picture...)        │
├────────────────────────┼───────────────────────────────────────┤
│ No standard scopes for │ Standard scopes: openid, profile,     │
│ user info              │ email, address, phone                 │
├────────────────────────┼───────────────────────────────────────┤
│ Framework              │ Protocol (built on top of OAuth 2.0)  │
└────────────────────────┴───────────────────────────────────────┘

Nói đơn giản:
  OAuth 2.0 = "Cho Trello xem calendar của tôi"  (authorization)
  OIDC       = "Tôi là Nguyen Van A, email a@b.com" (authentication)
              + "Cho Trello xem calendar"           (authorization)
```

**ID Token** là một JWT chứa thông tin định danh user:
```json
{
  "iss": "https://accounts.google.com",
  "sub": "1234567890",
  "aud": "your-client-id",
  "exp": 1700000000,
  "iat": 1699999000,
  "nonce": "abc123",
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "email_verified": true,
  "picture": "https://..."
}
```

**Key insight cho phỏng vấn**: "OAuth 2.0 is for Authorization, OIDC adds an Authentication layer on top of it. If someone says they use OAuth for login, they probably mean OIDC."

---

## 6. API Key Authentication

### Q: API Key authentication hoạt động thế nào? Khi nào nên dùng? 🟢 🟢 [Junior]

**A:**

```
Client                                      Server
  │                                            │
  │  GET /api/weather?city=hanoi               │
  │  X-API-Key: sk_live_abc123def456           │
  │  (hoặc: ?api_key=sk_live_abc123def456)     │
  │───────────────────────────────────────────>│
  │                                            │  Lookup key trong DB
  │                                            │  → Tìm thấy: client "WeatherApp"
  │                                            │  → Check rate limit, permissions
  │  200 OK {weather data}                     │
  │<───────────────────────────────────────────│
```

**Nơi đặt API key** (theo thứ tự ưu tiên):
1. **Custom header** (`X-API-Key`): An toàn nhất, không log bởi proxy
2. **Authorization header** (`Authorization: ApiKey xxx`): Chuẩn hơn
3. **Query parameter** (`?api_key=xxx`): TRÁNH - bị log trong URL, browser history, server logs

```
┌─────────────────┬─────────────────────────────────────────────┐
│ Ưu điểm          │ Nhược điểm                                   │
├─────────────────┼─────────────────────────────────────────────┤
│ Đơn giản         │ Không xác định được user cụ thể              │
│ Dễ implement     │ Khó rotate (phải thông báo tất cả clients)  │
│ Tốt cho S2S      │ Dễ leak (commit lên git, log, share)        │
│ Rate limit dễ    │ Không có expiration tự động                  │
│                  │ Thường dùng long-lived → rủi ro cao          │
└─────────────────┴─────────────────────────────────────────────┘

Khi nào dùng:
  ✓ Server-to-server, internal APIs
  ✓ Public APIs cần tracking/rate limiting (Google Maps API)
  ✓ Webhook verification

Khi nào KHÔNG dùng:
  ✗ User authentication (không biết "ai" đang dùng)
  ✗ Khi cần fine-grained permissions per user
  ✗ Client-side apps (key sẽ bị lộ)
```

---

## 7. Mutual TLS (mTLS)

### Q: mTLS là gì? Khác gì so với TLS thông thường? 🔴 🔴 [Senior]

**A:**

```
TLS thông thường (one-way):
  Client verify Server → "Server có phải google.com thật không?"
  
  Client                          Server
    │   ← Server Certificate ───────│   Server chứng minh danh tính
    │   (Client verify)             │   Client KHÔNG cần chứng minh
    │   ✓ Encrypted channel         │
    

mTLS (two-way / mutual):
  Client verify Server VÀ Server verify Client
  
  Client                          Server
    │   ← Server Certificate ───────│   Server chứng minh danh tính
    │   (Client verify)             │
    │   ── Client Certificate →     │   Client CŨNG chứng minh danh tính
    │      (Server verify)          │
    │   ✓ Both parties verified     │
    │   ✓ Encrypted channel         │
```

**Use cases:**
- **Service-to-service** trong microservices: Service A gọi Service B, cả hai verify lẫn nhau
- **Zero-trust network**: Không tin tưởng bất kỳ ai trong network, kể cả internal
- **Financial/Healthcare APIs**: Yêu cầu bảo mật cao
- **Service Mesh (Istio, Linkerd)**: Automatic mTLS giữa tất cả services

**Certificate management challenges:**
```
Thách thức chính:
1. Certificate rotation    → Cert hết hạn, phải rotate không downtime
2. Certificate distribution → Mỗi service cần cert riêng
3. CA management           → Ai sign certificate? Internal CA?
4. Revocation              → CRL/OCSP để revoke cert bị compromise

Service Mesh giải quyết:
┌────────────────────────────────────────────────────┐
│ Istio automatic mTLS:                              │
│                                                    │
│ Service A  ←──mTLS──→  Sidecar  ←──mTLS──→  Sidecar  ←──mTLS──→  Service B │
│            (plain)    (Envoy)   (encrypted)  (Envoy)   (plain)              │
│                                                    │
│ • Istio CA tự động issue/rotate certificates       │
│ • Application code KHÔNG cần biết về mTLS          │
│ • Zero-config mTLS cho toàn mesh                   │
└────────────────────────────────────────────────────┘
```

---

## 8. Access Control Models

### Q: RBAC là gì? Thiết kế RBAC như thế nào? 🟢 🟢 [Junior]

**A:** RBAC (Role-Based Access Control) gán quyền dựa trên vai trò (role) của user.

```
┌──────────────────────────────────────────────────────────┐
│                     RBAC Model                           │
│                                                          │
│  User ──── has ───→ Role ──── has ───→ Permission        │
│                                                          │
│  ┌─────────┐       ┌─────────┐       ┌───────────────┐  │
│  │ Alice   │──────>│ Admin   │──────>│ create:user   │  │
│  │         │       │         │──────>│ delete:user   │  │
│  └─────────┘       │         │──────>│ read:report   │  │
│                    └─────────┘       │ write:report  │  │
│  ┌─────────┐       ┌─────────┐      └───────────────┘  │
│  │ Bob     │──────>│ Editor  │──────>│ read:report   │  │
│  │         │       │         │──────>│ write:report  │  │
│  └─────────┘       └─────────┘       └───────────────┘  │
│                                                          │
│  ┌─────────┐       ┌─────────┐       ┌───────────────┐  │
│  │ Carol   │──────>│ Viewer  │──────>│ read:report   │  │
│  └─────────┘       └─────────┘       └───────────────┘  │
└──────────────────────────────────────────────────────────┘

Role hierarchy (optional):
  Admin > Editor > Viewer
  (Admin kế thừa tất cả permissions của Editor và Viewer)
```

**Ưu điểm**: Đơn giản, dễ hiểu, dễ audit, phù hợp hầu hết ứng dụng.
**Nhược điểm**: Role explosion khi hệ thống phức tạp, không linh hoạt cho context-based decisions.

### Q: ABAC là gì? Khác RBAC như thế nào? 🟡 🟡 [Mid]

**A:** ABAC (Attribute-Based Access Control) quyết định quyền truy cập dựa trên attributes (thuộc tính) thay vì roles.

```
ABAC evaluates policies based on:

  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │ Subject      │   │ Resource     │   │ Environment  │
  │ Attributes   │   │ Attributes   │   │ Attributes   │
  ├──────────────┤   ├──────────────┤   ├──────────────┤
  │ role: doctor │   │ type: record │   │ time: 9AM    │
  │ dept: cardio │   │ dept: cardio │   │ ip: internal │
  │ clearance: 3 │   │ sensitivity:2│   │ location: VN │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         │                  │                   │
         └──────────┬───────┘───────────────────┘
                    ▼
           ┌──────────────┐
           │ Policy Engine │
           │              │
           │ IF subject.dept == resource.dept     │
           │ AND subject.clearance >= resource.sensitivity │
           │ AND environment.time BETWEEN 8AM-6PM │
           │ THEN → ALLOW                         │
           │ ELSE → DENY                          │
           └──────────────┘

Ví dụ: "Bác sĩ khoa tim (cardio) được xem hồ sơ bệnh nhân khoa tim,
         chỉ trong giờ làm việc, từ mạng nội bộ."
RBAC không thể diễn tả rule phức tạp này một cách tự nhiên.
```

### Q: ReBAC là gì? Google Zanzibar hoạt động thế nào? 🔴 🔴 [Senior]

**A:** ReBAC (Relationship-Based Access Control) xác định quyền dựa trên mối quan hệ (relationship) giữa các objects. Google Zanzibar là hệ thống authorization của Google, scale cho YouTube, Drive, Maps...

```
Concept:
  "User có quyền X trên resource Y nếu tồn tại relationship Z"

Ví dụ Google Drive:
  ┌──────────────────────────────────────────────────────┐
  │ document:doc1    owner     user:alice                │
  │ folder:folder1   parent    document:doc1             │
  │ folder:folder1   editor    user:bob                  │
  │                                                      │
  │ Rule: "editor of folder → editor of documents in it" │
  │                                                      │
  │ Question: Can bob edit doc1?                          │
  │ Answer:   bob ─editor→ folder1 ─parent→ doc1         │
  │           → YES (through relationship chain)         │
  └──────────────────────────────────────────────────────┘

  Tuple format: <object>#<relation>@<user>
    folder:folder1#editor@user:bob
    document:doc1#parent@folder:folder1
```

**Open-source implementations**: SpiceDB (by AuthZed), OpenFGA (by Okta/Auth0)

### Q: So sánh các access control models? 🟡 🟡 [Mid]

```
┌────────┬──────────────────┬──────────────────┬──────────────────┐
│ Model  │ Decision Based On│ Flexibility       │ Best For          │
├────────┼──────────────────┼──────────────────┼──────────────────┤
│ RBAC   │ Roles assigned   │ ★★★ Simple       │ Enterprise apps, │
│        │ to users         │ Dễ implement     │ admin panels     │
├────────┼──────────────────┼──────────────────┼──────────────────┤
│ ABAC   │ Attributes of    │ ★★★★★ Very      │ Healthcare,      │
│        │ user, resource,  │ flexible, complex│ government,      │
│        │ environment      │ to maintain      │ multi-tenant     │
├────────┼──────────────────┼──────────────────┼──────────────────┤
│ PBAC   │ Policies (OPA)   │ ★★★★ Decoupled  │ Microservices,   │
│        │ Rego language    │ from app code    │ Kubernetes       │
├────────┼──────────────────┼──────────────────┼──────────────────┤
│ ReBAC  │ Relationships    │ ★★★★★ Natural   │ Social, Drive,   │
│        │ between objects  │ for hierarchies  │ collaborative    │
│        │                  │                  │ apps             │
└────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

## 9. Password Security

### Q: Tại sao KHÔNG dùng MD5/SHA để hash password? Bcrypt và Argon2id khác gì? 🟢 🟢 [Junior]

**A:**

```
Vấn đề với MD5/SHA:
┌──────────────────────────────────────────────────────────┐
│ 1. TỐC ĐỘ QUÁ NHANH:                                   │
│    MD5:  ~10 BILLION hashes/sec trên GPU                 │
│    SHA256: ~5 BILLION hashes/sec trên GPU                │
│    → Brute force password 8 ký tự trong vài giờ          │
│                                                          │
│ 2. RAINBOW TABLE:                                         │
│    Bảng hash tính sẵn cho hàng tỷ passwords phổ biến     │
│    MD5("password") = 5f4dcc3b5aa765d61d8327deb882cf99    │
│    → Tra bảng → tìm ra password ngay lập tức              │
│                                                          │
│ 3. KHÔNG CÓ SALT (mặc định):                              │
│    Cùng password → cùng hash                              │
│    → 1000 users dùng "password123" → 1000 hash giống nhau │
└──────────────────────────────────────────────────────────┘

Tại sao bcrypt/argon2id an toàn:
┌──────────────────────────────────────────────────────────┐
│ 1. CỐ TÌNH CHẬM (work factor):                           │
│    bcrypt cost=12: ~250ms per hash                       │
│    → Brute force 10 billion passwords = ~79 NĂM          │
│                                                          │
│ 2. SALT TỰ ĐỘNG:                                          │
│    Mỗi hash có random salt riêng                         │
│    bcrypt("password") lần 1 ≠ bcrypt("password") lần 2   │
│    → Rainbow table vô dụng                               │
│                                                          │
│ 3. ADAPTIVE:                                              │
│    Tăng cost factor khi hardware mạnh hơn                │
│    cost=10 (2010) → cost=12 (2020) → cost=14 (2030)     │
└──────────────────────────────────────────────────────────┘
```

**Salt là gì:**
```
Không có salt:
  hash("password") → abc123   (luôn giống nhau)
  
Có salt:
  salt1 = random()  → "x9k2m"
  salt2 = random()  → "p3j7q"
  hash("password" + "x9k2m") → def456
  hash("password" + "p3j7q") → ghi789
  → Cùng password, khác hash → rainbow table không dùng được
  → Salt được lưu cùng hash (bcrypt tự động embed)
```

**Bcrypt vs Argon2id:**
```
┌──────────────┬──────────────────────┬──────────────────────┐
│ Tiêu chí      │ bcrypt                │ argon2id              │
├──────────────┼──────────────────────┼──────────────────────┤
│ Năm ra đời    │ 1999                  │ 2015 (PHC winner)    │
│ CPU-hard      │ ✓                    │ ✓                    │
│ Memory-hard   │ ✗ (~4KB)             │ ✓ (configurable MB)  │
│ GPU-resistant │ Vừa phải              │ Rất tốt (memory-hard)│
│ Max password  │ 72 bytes             │ Không giới hạn        │
│ Tuning        │ 1 param (cost)       │ 3 params (time,      │
│               │                      │  memory, parallelism) │
│ Recommendation│ Vẫn an toàn          │ ★ Recommended 2024+  │
└──────────────┴──────────────────────┴──────────────────────┘

Argon2id ưu việt hơn vì memory-hard: attacker cần NHIỀU RAM
để brute force, GPU thường thiếu RAM → không thể parallelize.
```

### Q: MFA (Multi-Factor Authentication) hoạt động thế nào? 🟡 🟡 [Mid]

**A:**

```
Authentication Factors:
┌─────────────────────────────────────────────────────────┐
│ Factor           │ Type              │ Example            │
├──────────────────┼───────────────────┼────────────────────┤
│ Something you    │ Knowledge         │ Password, PIN,     │
│ KNOW             │                   │ security question  │
├──────────────────┼───────────────────┼────────────────────┤
│ Something you    │ Possession        │ Phone (SMS/TOTP),  │
│ HAVE             │                   │ hardware key       │
├──────────────────┼───────────────────┼────────────────────┤
│ Something you    │ Inherence         │ Fingerprint, face, │
│ ARE              │                   │ voice              │
└──────────────────┴───────────────────┴────────────────────┘

MFA = kết hợp ≥ 2 factors KHÁC LOẠI
  Password + TOTP   = ✓ MFA (know + have)
  Password + PIN    = ✗ Không phải MFA (cả hai đều "know")
```

**TOTP (Time-based OTP):**
```
Setup:
  Server tạo secret key → QR code → User scan bằng Google Authenticator

Verify:
  TOTP = HMAC-SHA1(secret_key, floor(current_time / 30))
  → 6-digit code thay đổi mỗi 30 giây
  → Server và app tính cùng code (dựa trên shared secret + time)
```

**WebAuthn/FIDO2** (passwordless, strongest):
```
  Dùng public-key cryptography
  Private key lưu trên device (hardware key, phone biometric)
  Server chỉ lưu public key
  → Phishing-resistant: key gắn với domain, không thể dùng trên site giả
  → Không có shared secret → không thể bị steal từ server
```

---

## 10. Common Security Vulnerabilities (OWASP)

### Q: SQL Injection là gì? Tại sao parameterized queries ngăn chặn được? 🟢 🟢 [Junior]

**A:**

```
Vulnerable code (string concatenation):
  query = "SELECT * FROM users WHERE id = " + userInput
  
  userInput = "1; DROP TABLE users;--"
  → "SELECT * FROM users WHERE id = 1; DROP TABLE users;--"
  → Database thực thi CẢ lệnh DROP!

Parameterized query (safe):
  query = "SELECT * FROM users WHERE id = $1"
  db.Query(query, userInput)
  
  → Database nhận: parameter $1 = "1; DROP TABLE users;--"
  → Xử lý như một STRING VALUE, không phải SQL code
  → Tìm user có id = "1; DROP TABLE users;--" → không tìm thấy → safe
```

**Bản chất**: Parameterized queries TÁCH BIỆT code (SQL) và data (user input). Database parse SQL trước, rồi mới bind data vào → data không bao giờ được interpret là code.

### Q: Giải thích XSS, CSRF, SSRF? 🟡 🟡 [Mid]

**A:**

**XSS (Cross-Site Scripting):**
```
Attacker inject mã JavaScript vào trang web → chạy trên browser của victim

3 loại:
┌──────────────┬───────────────────────────────────────────────┐
│ Stored XSS   │ Script lưu trong DB (comment, profile)       │
│              │ Mọi user xem page đều bị → nguy hiểm nhất    │
├──────────────┼───────────────────────────────────────────────┤
│ Reflected XSS│ Script trong URL, server reflect lại response│
│              │ VD: search?q=<script>alert(1)</script>        │
├──────────────┼───────────────────────────────────────────────┤
│ DOM-based XSS│ Script chạy hoàn toàn ở client-side          │
│              │ Server không liên quan, JS xử lý sai input   │
└──────────────┴───────────────────────────────────────────────┘

Phòng chống: Output encoding, CSP header, sanitize input
```

**CSRF (Cross-Site Request Forgery):**
```
Attacker trick victim's browser gửi request đến site victim đã login

  Victim đã login bank.com (có session cookie)
      │
      ▼
  Victim mở evil.com
      │
      ▼
  evil.com chứa: <img src="https://bank.com/transfer?to=attacker&amount=1000">
      │
      ▼
  Browser TỰ ĐỘNG gửi request + cookie → bank.com thực hiện transfer!

Phòng chống:
  1. SameSite cookie (Lax/Strict): Browser không gửi cookie cho cross-site request
  2. CSRF token: Hidden field trong form, server verify mỗi request
  3. Check Origin/Referer header
```

**SSRF (Server-Side Request Forgery):**
```
Attacker trick SERVER gửi request đến internal resources

  User input:  url = "http://169.254.169.254/latest/meta-data/"
  Server code: resp = http.Get(url)  // Fetch user-provided URL
  
  → Server fetch AWS metadata → lộ IAM credentials!

Hoặc: url = "http://internal-db:6379/FLUSHALL"
  → Server gọi internal Redis → xóa hết data!

Phòng chống:
  1. Whitelist allowed domains/IPs
  2. Block private IP ranges (10.x, 172.16.x, 192.168.x, 169.254.x)
  3. Disable redirects hoặc validate redirect target
  4. Dùng network policies để restrict server outbound
```

### Q: IDOR và Mass Assignment là gì? 🟡 🟡 [Mid]

**A:**

**IDOR (Insecure Direct Object Reference):**
```
GET /api/invoices/123    ← User A xem invoice của mình
GET /api/invoices/124    ← User A đổi ID → xem invoice của User B!

Server không kiểm tra: "User A có quyền xem invoice 124 không?"

Phòng chống:
  1. Authorization check: Verify user owns/has access to resource
  2. Dùng UUID thay vì sequential ID (không đoán được, nhưng KHÔNG thay thế authz)
  3. Row-level security (PostgreSQL RLS)
```

**Mass Assignment:**
```
Request body:  {"name": "John", "email": "john@x.com", "role": "admin"}
Server code:   db.Model(&user).Updates(request.Body)

→ User tự set role=admin!

Phòng chống:
  1. Whitelist fields: Chỉ cho phép update các field cụ thể
  2. Dùng separate DTOs/structs cho input binding
  3. Go example: dùng separate CreateUserInput struct, 
     KHÔNG bind trực tiếp vào User model
```

### Q: Rate Limiting và Brute Force prevention? 🟡 🟡 [Mid]

**A:**

```
Rate Limiting strategies:
┌───────────────────┬────────────────────────────────────────────┐
│ Algorithm          │ Mô tả                                      │
├───────────────────┼────────────────────────────────────────────┤
│ Fixed Window      │ 100 req/phút, reset đầu mỗi phút          │
│                   │ Vấn đề: burst ở ranh giới (99+99=198)      │
├───────────────────┼────────────────────────────────────────────┤
│ Sliding Window    │ 100 req trong 60s gần nhất                  │
│                   │ Smooth hơn, tốn memory hơn                  │
├───────────────────┼────────────────────────────────────────────┤
│ Token Bucket      │ Bucket chứa tokens, mỗi req lấy 1 token   │
│                   │ Tokens refill theo rate. Cho phép burst     │
├───────────────────┼────────────────────────────────────────────┤
│ Leaky Bucket      │ Requests vào queue, xử lý ở fixed rate     │
│                   │ Smooth output, queue full → reject          │
└───────────────────┴────────────────────────────────────────────┘

Brute force prevention cho login:
  1. Rate limit per IP: 10 attempts/phút
  2. Rate limit per account: 5 failed attempts → lock 15 min
  3. Exponential backoff: 1s, 2s, 4s, 8s... giữa mỗi attempt
  4. CAPTCHA sau 3 failed attempts
  5. Account lockout notification (email)
```

---

## 11. CORS (Cross-Origin Resource Sharing)

### Q: Same-origin policy là gì? CORS giải quyết vấn đề gì? 🟢 🟢 [Junior]

**A:**

```
Same-origin policy (SOP):
  Browser chặn JavaScript gọi API đến domain khác

  Origin = scheme + host + port
  https://example.com:443/path

  ┌──────────────────────────┬──────────────────────────┬───────────┐
  │ Requesting Page          │ Target                   │ Allowed?  │
  ├──────────────────────────┼──────────────────────────┼───────────┤
  │ https://app.com          │ https://app.com/api      │ ✓ Same    │
  │ https://app.com          │ https://api.app.com      │ ✗ Diff host│
  │ https://app.com          │ http://app.com           │ ✗ Diff scheme│
  │ https://app.com:443      │ https://app.com:8080     │ ✗ Diff port│
  └──────────────────────────┴──────────────────────────┴───────────┘

CORS = cơ chế cho phép server "opt-in" cho cross-origin requests
  Server nói: "Tôi cho phép requests từ https://app.com"
```

### Q: CORS preflight request hoạt động thế nào? 🟡 🟡 [Mid]

**A:**

```
Simple requests (KHÔNG cần preflight):
  • Method: GET, HEAD, POST
  • Headers: chỉ Accept, Accept-Language, Content-Language,
    Content-Type (chỉ application/x-www-form-urlencoded, 
    multipart/form-data, text/plain)

Preflighted requests (CẦN preflight):
  • Method khác: PUT, DELETE, PATCH
  • Custom headers: Authorization, X-Custom-Header
  • Content-Type: application/json

Preflight flow:
  Browser                               Server
    │                                      │
    │  1. OPTIONS /api/users               │  ← Preflight
    │  Origin: https://app.com             │
    │  Access-Control-Request-Method: PUT  │
    │  Access-Control-Request-Headers:     │
    │    Authorization, Content-Type       │
    │─────────────────────────────────────>│
    │                                      │
    │  2. 204 No Content                   │
    │  Access-Control-Allow-Origin:        │
    │    https://app.com                   │
    │  Access-Control-Allow-Methods:       │
    │    GET, POST, PUT, DELETE            │
    │  Access-Control-Allow-Headers:       │
    │    Authorization, Content-Type       │
    │  Access-Control-Max-Age: 86400       │  ← Cache preflight 24h
    │<─────────────────────────────────────│
    │                                      │
    │  3. PUT /api/users                   │  ← Actual request
    │  Origin: https://app.com             │
    │  Authorization: Bearer xxx           │
    │  Content-Type: application/json      │
    │─────────────────────────────────────>│
    │                                      │
    │  4. 200 OK                           │
    │  Access-Control-Allow-Origin:        │
    │    https://app.com                   │
    │<─────────────────────────────────────│
```

**Common CORS mistakes:**
```
1. Access-Control-Allow-Origin: *  VỚI  credentials: true
   → Browser sẽ BLOCK (spec không cho phép * với credentials)
   → Phải specify exact origin

2. Không handle OPTIONS method → 404/405 → preflight fail

3. Không set Access-Control-Allow-Credentials: true
   → Cookie không được gửi cross-origin

4. Allow-Origin reflect request Origin mà không validate
   → Attacker domain cũng được allow → security hole
```

---

## 12. Secrets Management

### Q: Tại sao không nên đặt secrets trong code/config? Có những giải pháp nào? 🟡 🟡 [Mid]

**A:**

```
Vấn đề:
  1. Git history: Xóa secret khỏi code ≠ xóa khỏi git history
     → git log --all -p -- config.yaml → tìm lại được
  2. Container images: Secrets baked vào image → ai pull image đều có
  3. Shared configs: .env file commit lên repo → team member mới clone = có secret
  4. Log leaking: Secret trong URL/query param → ghi vào access log
```

**Giải pháp theo mức độ mature:**

```
Level 1: Environment Variables (12-factor app)
┌──────────────────────────────────────────────────────────┐
│ export DB_PASSWORD=secret123                              │
│ os.Getenv("DB_PASSWORD")                                 │
│                                                          │
│ ✓ Đơn giản, tách secret khỏi code                        │
│ ✗ Vẫn plaintext trong process env, container orchestrator│
│ ✗ Không có audit log, rotation, access control            │
└──────────────────────────────────────────────────────────┘

Level 2: Encrypted Secret Stores
┌──────────────────────────────────────────────────────────┐
│ AWS Secrets Manager / GCP Secret Manager                 │
│ • Encryption at rest (KMS)                                │
│ • Automatic rotation                                     │
│ • Audit trail (CloudTrail)                               │
│ • Fine-grained IAM access control                        │
│                                                          │
│ AWS Parameter Store (SSM)                                │
│ • Free tier, good for config + secrets                    │
│ • Hierarchical: /prod/db/password                         │
│ • SecureString type = encrypted                          │
└──────────────────────────────────────────────────────────┘

Level 3: HashiCorp Vault
┌──────────────────────────────────────────────────────────┐
│ • Dynamic secrets: Vault tạo DB credentials on-demand    │
│   → Mỗi app instance nhận credentials RIÊNG              │
│   → Credentials tự expire (lease)                        │
│ • Auto-rotation: Vault rotate credentials tự động         │
│ • Transit engine: Encrypt/decrypt as a service           │
│ • Multiple auth methods: Kubernetes, AWS IAM, LDAP       │
│ • Audit logging: Mọi access đều được log                 │
│                                                          │
│ App ──request──> Vault ──dynamic secret──> Database      │
│       (authenticated       (temp credentials,            │
│        via K8s SA)          TTL=1h, auto-revoke)         │
└──────────────────────────────────────────────────────────┘

Kubernetes Secrets (cẩn thận):
┌──────────────────────────────────────────────────────────┐
│ ⚠ K8s Secrets mặc định chỉ base64 encoded, KHÔNG encrypt│
│ → Ai có RBAC get secrets → đọc được plaintext            │
│ → etcd lưu plaintext (trừ khi enable encryption at rest) │
│                                                          │
│ Hardening:                                                │
│ 1. Enable etcd encryption at rest                        │
│ 2. RBAC: Restrict who can get/list secrets               │
│ 3. Dùng External Secrets Operator + Vault/AWS SM         │
│ 4. Sealed Secrets (Bitnami) cho GitOps                   │
└──────────────────────────────────────────────────────────┘
```

**Secret rotation strategy:**
```
1. Dual-secret pattern:
   → Tạo secret mới (V2) → deploy apps dùng V2 → xóa V1
   → Zero downtime vì cả V1 và V2 đều valid trong transition period

2. Dynamic secrets (Vault):
   → Mỗi app instance nhận unique, short-lived credentials
   → Credential hết hạn → Vault cấp mới tự động
   → Không cần rotate thủ công
```

---

## 13. Network Security for Backend

### Q: Những lớp bảo mật network nào cần cho backend? 🟡 🟡 [Mid]

**A:**

```
Defense in depth (bảo mật nhiều lớp):

Internet
    │
    ▼
┌──────────────┐
│ DDoS Shield  │  CloudFlare, AWS Shield
│              │  Absorb volumetric attacks (Layer 3/4)
└──────┬───────┘
       ▼
┌──────────────┐
│ WAF          │  Web Application Firewall
│              │  Block SQLi, XSS, known patterns (Layer 7)
└──────┬───────┘
       ▼
┌──────────────┐
│ Load Balancer│  TLS termination, rate limiting
│              │  
└──────┬───────┘
       ▼
┌──────────────┐
│ Public Subnet│  API Gateway, reverse proxy
│              │  Only exposed services
└──────┬───────┘
       ▼ (Security Group: allow only from LB)
┌──────────────┐
│ Private      │  Application servers
│ Subnet       │  No direct internet access
└──────┬───────┘
       ▼ (Security Group: allow only from app)
┌──────────────┐
│ Data Subnet  │  Database, Redis, queues
│              │  Most restricted access
└──────────────┘
```

**Encryption:**
```
In Transit:
  • TLS 1.3 everywhere (external + internal)
  • mTLS between services (service mesh)
  • Certificate management (Let's Encrypt, internal CA)

At Rest:
  • Database encryption (AES-256, transparent data encryption)
  • Disk encryption (LUKS, AWS EBS encryption)
  • Application-level encryption for sensitive fields
  • Key management: AWS KMS, GCP Cloud KMS, HashiCorp Vault
  
  Key hierarchy:
    Master Key (HSM) → Data Encryption Key (DEK) → Encrypted Data
    (never leaves HSM)  (encrypted by master key)
```

---

## 14. Security Checklist & Interview Tips

### Security Checklist for Go Backend Services

```
Authentication & Authorization:
  □ JWT with RS256/ES256 for microservices
  □ Short-lived access tokens (15 min) + refresh token rotation
  □ RBAC/ABAC implemented at middleware level
  □ API keys for service-to-service (or mTLS)
  □ MFA for admin accounts

Password & Credentials:
  □ Argon2id (preferred) or bcrypt for password hashing
  □ Secrets in Vault/Secrets Manager, NOT in code/env
  □ Secret rotation policy

Input Validation & Output Encoding:
  □ Parameterized queries everywhere (sqlx, GORM)
  □ Input validation (struct tags, custom validators)
  □ Output encoding to prevent XSS
  □ Request size limits

HTTP Security:
  □ CORS properly configured (specific origins, not *)
  □ Security headers: HSTS, X-Content-Type-Options, CSP
  □ SameSite cookies (Lax minimum, Strict preferred)
  □ Rate limiting (per IP + per user)
  □ Request timeout configured

Network:
  □ TLS 1.2+ everywhere (prefer 1.3)
  □ Private subnets for app/data tiers
  □ Security groups: least privilege
  □ No unnecessary open ports

Logging & Monitoring:
  □ Log authentication events (login, failed login, logout)
  □ Never log passwords, tokens, or secrets
  □ Anomaly detection (unusual login locations, brute force)
  □ Audit trail for admin actions
```

### Auth Decision Flowchart

```
Choosing the right auth method:

                    ┌────────────────────┐
                    │ What type of client │
                    │ is calling your API?│
                    └─────────┬──────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────────┐
        │ Browser/ │   │ Server/  │   │ IoT/Device   │
        │ Mobile   │   │ Service  │   │ (no browser) │
        └────┬─────┘   └────┬─────┘   └──────┬───────┘
             │              │                 │
             ▼              │                 ▼
     ┌───────────────┐      │         ┌──────────────┐
     │ User involved?│      │         │ Device Code  │
     └───┬───────┬───┘      │         │ Flow         │
         │Yes    │No        │         └──────────────┘
         ▼       ▼          ▼
  ┌────────┐ ┌────────┐ ┌──────────────────┐
  │ OIDC + │ │ N/A    │ │ User involved?   │
  │ Auth   │ │        │ └──┬────────┬──────┘
  │ Code + │ │        │    │Yes     │No
  │ PKCE   │ │        │    ▼        ▼
  └────────┘ │        │ ┌──────┐ ┌──────────────┐
             │        │ │Auth  │ │Client        │
             │        │ │Code  │ │Credentials   │
             │        │ │Flow  │ │(or API Key   │
             │        │ └──────┘ │ or mTLS)     │
             │        │          └──────────────┘
             └────────┘

Quick reference:
  SPA/Mobile + user login     → OIDC + Auth Code + PKCE
  Server-side web + user login→ OIDC + Auth Code
  Service-to-service          → Client Credentials / mTLS / API Key
  Device without browser      → Device Code Flow
  Internal microservices      → mTLS (via service mesh)
  Public API (3rd party devs) → OAuth 2.0 + API Key for rate limiting
```

### Interview Questions by Company

```
┌──────────────────┬──────────────────────────────────────────────────┐
│ Company           │ Likely Questions                                  │
├──────────────────┼──────────────────────────────────────────────────┤
│ Grab             │ • OAuth 2.0 flows, đặc biệt mobile (PKCE)       │
│                  │ • JWT revocation strategies at scale              │
│                  │ • mTLS in microservices                           │
│                  │ • Rate limiting distributed systems              │
├──────────────────┼──────────────────────────────────────────────────┤
│ VNG (Zalo)       │ • Session vs JWT trade-offs                      │
│                  │ • Password hashing best practices                │
│                  │ • RBAC design for multi-tenant                   │
│                  │ • OWASP vulnerabilities (SQLi, XSS, CSRF)       │
├──────────────────┼──────────────────────────────────────────────────┤
│ Axon             │ • Zero-trust architecture                        │
│                  │ • Encryption at rest / in transit                │
│                  │ • Secrets management (Vault)                     │
│                  │ • Compliance-driven security (law enforcement)   │
├──────────────────┼──────────────────────────────────────────────────┤
│ Employment Hero  │ • Multi-tenant authorization (RBAC/ABAC)        │
│                  │ • OIDC integration (SSO for enterprises)         │
│                  │ • Data privacy, PII protection                  │
│                  │ • CORS configuration for SPA                    │
├──────────────────┼──────────────────────────────────────────────────┤
│ Microsoft/Google │ • Design auth system from scratch                │
│                  │ • Zanzibar / ReBAC at scale                      │
│                  │ • OAuth 2.0 deep dive (all grant types)          │
│                  │ • Zero-trust network design                     │
│                  │ • Threat modeling for a given system             │
└──────────────────┴──────────────────────────────────────────────────┘
```

### Common Mistakes to Avoid

```
❌ Storing JWT in localStorage         → XSS can steal it
   ✅ HttpOnly cookie or in-memory

❌ Using symmetric JWT (HS256) in      → All services share the secret
   microservices
   ✅ Use RS256/ES256, distribute only public key

❌ Not validating JWT audience (aud)   → Token for service A used on service B
   ✅ Always check iss, aud, exp

❌ Logging tokens or passwords         → Log aggregation = credential leak
   ✅ Redact sensitive fields in logs

❌ Access-Control-Allow-Origin: *      → Any website can call your API
   with credentials
   ✅ Whitelist specific origins

❌ Rolling your own crypto/auth        → You WILL make mistakes
   ✅ Use battle-tested libraries (golang.org/x/crypto)

❌ Not rate limiting login endpoints   → Brute force paradise
   ✅ Rate limit per IP + per account + exponential backoff

❌ Checking permissions only in UI     → API still accessible directly
   ✅ Server-side authorization ALWAYS

❌ Sequential IDs without authz check  → IDOR vulnerability
   ✅ Always verify ownership/access before returning data

❌ Using API keys as sole auth for     → Keys can be shared, no user identity
   user-facing endpoints
   ✅ API keys for service-to-service, OAuth/JWT for users

❌ Hardcoding secrets in code          → Git history forever
   ✅ Use environment variables (minimum) or Vault (recommended)

❌ Not rotating secrets/certificates   → Compromised secret = permanent access
   ✅ Automated rotation with Vault or Secrets Manager
```

---

> **Tóm tắt cho phỏng vấn**: Authentication là "bạn là ai", Authorization là "bạn được làm gì". JWT cho stateless/microservices, session cho monolith. OAuth 2.0 cho delegated authorization, OIDC thêm authentication layer. Luôn hash password bằng argon2id/bcrypt. Bảo mật là defense in depth - không có silver bullet, phải kết hợp nhiều lớp.
