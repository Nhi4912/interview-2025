# Modern Authentication & Authorization Patterns / Mẫu Xác Thực và Phân Quyền Hiện Đại

> **Track**: Shared | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Security Fundamentals](./01-security-fundamentals.md) | [Cryptography](./02-cryptography-and-protocols.md) | [Web Security](./03-web-security-owasp.md)

---

## Visual Overview / Sơ Đồ Tổng Quan

### OAuth 2.0 Authorization Code Flow
```
USER          APP (Client)      AUTH SERVER     RESOURCE SERVER
  │                │                 │                 │
  │  Click Login   │                 │                 │
  │──────────────►│                 │                 │
  │                │  redirect to    │                 │
  │                │  auth server    │                 │
  │◄───────────────│  /authorize     │                 │
  │                │                 │                 │
  │  Login + consent                 │                 │
  │─────────────────────────────────►│                 │
  │                │                 │                 │
  │                │◄── auth_code ───│                 │
  │                │    (redirect)   │                 │
  │                │                 │                 │
  │                │ POST /token     │                 │
  │                │ {code, secret}  │                 │
  │                │────────────────►│                 │
  │                │◄── access_token─│                 │
  │                │    refresh_token│                 │
  │                │                 │                 │
  │                │  GET /resource  │                 │
  │                │  Authorization: │                 │
  │                │  Bearer <token> │                 │
  │                │─────────────────────────────────►│
  │                │◄─────────────── data ────────────│
```

### JWT Structure / Cấu Trúc JWT
```
JWT = base64url(header) . base64url(payload) . signature

HEADER:
{
  "alg": "RS256",    ← algorithm
  "typ": "JWT"
}

PAYLOAD:
{
  "sub": "user123",  ← subject (user ID)
  "iss": "auth.app", ← issuer
  "aud": "api.app",  ← audience
  "exp": 1699999999, ← expiry (unix timestamp)
  "iat": 1699996399, ← issued at
  "roles": ["user"]  ← custom claims
}

SIGNATURE (RS256):
  RSASSA-PKCS1-v1_5(
    SHA256(base64url(header) + "." + base64url(payload)),
    private_key
  )

Verification: recipient uses PUBLIC key to verify signature
              → only auth server (with private key) could have signed it
```

### Session vs JWT Comparison
```
SESSION-BASED:                    JWT (Stateless):
┌─────────────────────┐          ┌─────────────────────────────┐
│ Login               │          │ Login                       │
│ Server creates      │          │ Server creates signed JWT    │
│ session in Redis    │          │ Sends to client (cookie/LS) │
│ session_id → cookie │          │                             │
│                     │          │ Subsequent requests:        │
│ Subsequent requests:│          │ Client sends JWT in header  │
│ Server looks up     │          │ Server VERIFIES SIGNATURE   │
│ session in Redis    │          │ NO DB lookup needed         │
│                     │          │                             │
│ Logout: delete      │          │ Logout: can't invalidate!   │
│ session from Redis  │          │ Token valid until exp       │
│                     │          │ → Use short TTL (15min)     │
│ Scale: Redis must   │          │ + refresh token in Redis    │
│ be shared           │          │ (for revocation)            │
└─────────────────────┘          └─────────────────────────────┘

Session: easy revocation, server state
JWT: stateless, fast, hard to revoke
```

---

## OAuth 2.0

### 🟢 [Junior] What is OAuth 2.0 and what problem does it solve?

- **Tổng Quan:**
  OAuth 2.0 là framework ủy quyền, cho phép ứng dụng truy cập tài nguyên thay mặt người dùng mà không cần chia sẻ mật khẩu.
- **Giải thích:**
  Thay vì đưa username/password cho ứng dụng bên thứ ba, người dùng đăng nhập trực tiếp với Authorization Server.
  Ứng dụng nhận access token giới hạn phạm vi (scope) và thời gian sống.
  OAuth 2.0 tập trung vào **authorization**, không định nghĩa đầy đủ cho **authentication** (đó là OIDC).
  Vai trò chính: Resource Owner, Client, Authorization Server, Resource Server.
- **Ví dụ:**
  Ứng dụng calendar xin quyền đọc email từ nhà cung cấp mail.
  Người dùng chỉ cấp scope `mail.read`, không cấp `mail.send`.

### 🟢 [Junior] What are OAuth 2.0 roles and core components?

- **Tổng Quan:**
  Có 4 vai trò cốt lõi và một số endpoint tiêu chuẩn.
- **Giải thích:**
  Resource Owner: người sở hữu dữ liệu.
  Client: ứng dụng yêu cầu quyền truy cập.
  Authorization Server: cấp token sau khi xác thực/đồng ý.
  Resource Server: API chứa tài nguyên.
  Endpoint thường gặp: authorization endpoint, token endpoint, revocation endpoint, introspection endpoint.
- **Ví dụ:**
  Mobile app (Client) gọi Authorization Server để lấy token,
  sau đó dùng token gọi API profile ở Resource Server.

### 🟡 [Mid] Explain Authorization Code Flow at a high level.

- **Tổng Quan:**
  Authorization Code Flow là flow an toàn cho ứng dụng có backend hoặc SPA dùng PKCE.
- **Giải thích:**
  Bước 1: Client chuyển hướng user đến authorization endpoint.
  Bước 2: User đăng nhập + consent.
  Bước 3: Authorization Server trả về `code` qua redirect URI.
  Bước 4: Client đổi `code` lấy access token ở token endpoint.
  Token không đi qua URL fragment như implicit flow.
  Có thể kèm refresh token tùy policy.
- **Ví dụ:**
  Web app server-side giữ client secret và thực hiện trao đổi code ở backend.

### 🟡 [Mid] Why is PKCE required for public clients?

- **Tổng Quan:**
  PKCE bảo vệ authorization code khỏi bị đánh cắp và tái sử dụng.
- **Giải thích:**
  Public client (SPA/mobile) không thể giữ bí mật client secret.
  Client tạo `code_verifier` ngẫu nhiên, băm thành `code_challenge` gửi ở bước authorize.
  Khi đổi code, client gửi `code_verifier`.
  Authorization Server kiểm tra challenge/verifier khớp mới cấp token.
  Kẻ tấn công lấy được `code` nhưng không có verifier thì không đổi được token.
- **Ví dụ:**
  PKCE method `S256` được khuyến nghị thay vì `plain`.

### 🟡 [Mid] Show OAuth 2.0 Authorization Code + PKCE flow.

- **Tổng Quan:**
  Flow dưới đây mô tả luồng chuẩn hiện đại cho web/mobile.
- **Giải thích:**
  Có 2 kênh: front-channel (browser redirect) và back-channel (token exchange).
  PKCE ràng buộc authorization code với đúng client instance.
- **Ví dụ:**

```text
Client App                   Browser                  Auth Server                 Resource API
   |                            |                           |                            |
   |--(1) Create code_verifier/challenge------------------>|                            |
   |--(2) Redirect /authorize?code_challenge------------->|                            |
   |                            |-- user login + consent -->                            |
   |<-(3) Redirect back with authorization code-----------|                            |
   |--(4) POST /token (code + code_verifier)------------->|                            |
   |<-(5) access_token (+refresh_token)-------------------|                            |
   |--(6) GET /resource Authorization: Bearer token----------------------------------->|
   |<-(7) Protected data----------------------------------------------------------------|
```

### 🟡 [Mid] What is Client Credentials flow and when should we use it?

- **Tổng Quan:**
  Client Credentials dành cho machine-to-machine, không có người dùng tương tác.
- **Giải thích:**
  Client xác thực bằng credential (secret, mTLS, private_key_jwt).
  Token đại diện cho ứng dụng/service, không đại diện user.
  Scope thường là service scope nội bộ.
  Không dùng flow này để thay thế user login.
- **Ví dụ:**
  Billing service gọi Invoice API nội bộ với scope `invoice.read`.

### 🟢 [Junior] Why is Implicit Flow deprecated?

- **Tổng Quan:**
  Implicit flow bị giảm an toàn vì token lộ ở front-channel.
- **Giải thích:**
  Access token trả về qua URL fragment trong browser.
  Dễ rò rỉ qua history, extensions, log, referrer leakage (một số tình huống).
  Không có code exchange nên khó tăng cường bảo mật như PKCE.
  Khuyến nghị hiện nay: Authorization Code + PKCE cho SPA/mobile.
- **Ví dụ:**
  SPA hiện đại dùng backend-for-frontend hoặc PKCE thay implicit.

### 🟡 [Mid] How do refresh tokens work securely?

- **Tổng Quan:**
  Refresh token dùng để lấy access token mới mà không bắt user đăng nhập lại.
- **Giải thích:**
  Refresh token có vòng đời dài hơn access token.
  Cần lưu trữ an toàn, ràng buộc client/device, hỗ trợ rotation.
  Nếu phát hiện reuse refresh token cũ -> revoke cả session chain.
  Access token nên ngắn hạn (5-15 phút), refresh token dài hơn.
- **Ví dụ:**
  Mỗi lần refresh thành công cấp refresh token mới và vô hiệu token cũ.

### 🔴 [Senior] What attack vectors exist in OAuth redirect handling?

- **Tổng Quan:**
  Redirect URI là điểm tấn công phổ biến nếu validation lỏng.
- **Giải thích:**
  Open redirect, wildcard callback, mismatch scheme/host/path là lỗi thường gặp.
  Cần đăng ký redirect URI exact-match.
  Dùng `state` chống CSRF và mix-up attacks.
  Không phản chiếu `redirect_uri` từ input không kiểm soát.
  Với native app: dùng claimed HTTPS hoặc custom URI scheme an toàn.
- **Ví dụ:**
  Không cho phép `https://example.com/*` nếu có thể đăng ký chính xác path.

---

## OpenID Connect (OIDC)

### 🟢 [Junior] What is OIDC and how is it different from OAuth 2.0?

- **Tổng Quan:**
  OIDC là lớp identity nằm trên OAuth 2.0 để chuẩn hóa đăng nhập.
- **Giải thích:**
  OAuth 2.0 trả lời câu hỏi "ứng dụng được phép làm gì".
  OIDC trả lời câu hỏi "người dùng là ai" qua ID Token và user claims.
  OIDC thêm scope `openid`, endpoint userinfo, discovery metadata.
  Vì vậy OIDC phù hợp cho SSO và authentication.
- **Ví dụ:**
  Ứng dụng thêm scope `openid profile email` để lấy thông tin user chuẩn hóa.

### 🟢 [Junior] What is an ID Token?

- **Tổng Quan:**
  ID Token là JWT chứa thông tin xác thực phiên đăng nhập của user.
- **Giải thích:**
  Claims quan trọng: `iss`, `sub`, `aud`, `exp`, `iat`, `nonce`.
  ID Token dành cho client xác minh danh tính, không dùng thay access token cho API.
  Resource Server không nên dùng ID Token để authorize API calls.
  Client phải verify chữ ký và các claim bắt buộc.
- **Ví dụ:**
  `aud` phải chứa client_id của ứng dụng nhận token.

### 🟡 [Mid] What is the UserInfo endpoint used for?

- **Tổng Quan:**
  UserInfo endpoint cung cấp profile claims bằng access token.
- **Giải thích:**
  ID Token nên gọn, không nhất thiết chứa tất cả thuộc tính người dùng.
  Client gọi UserInfo để lấy thêm claims (name, email, picture...).
  Cần kiểm tra tính nhất quán giữa `sub` trong ID Token và UserInfo response.
  Claims trả về phụ thuộc scope đã cấp.
- **Ví dụ:**
  Nếu chỉ cấp `openid`, có thể không nhận được email.

### 🟡 [Mid] Explain OIDC discovery and JWKS.

- **Tổng Quan:**
  Discovery giúp client tự động cấu hình endpoint và khóa xác minh chữ ký.
- **Giải thích:**
  Client truy cập `/.well-known/openid-configuration`.
  Metadata chứa issuer, authorization_endpoint, token_endpoint, jwks_uri...
  Khóa công khai lấy từ JWKS để verify ID Token/JWT.
  Cần cache JWKS và hỗ trợ key rotation bằng `kid`.
- **Ví dụ:**
  Khi token header có `kid=A1`, client chọn key tương ứng từ JWKS.

### 🔴 [Senior] How should nonce and state be used in OIDC flows?

- **Tổng Quan:**
  `state` và `nonce` bảo vệ trước nhiều kiểu tấn công front-channel.
- **Giải thích:**
  `state`: chống CSRF/mix-up cho request authorize.
  `nonce`: chống replay cho ID Token, đặc biệt implicit/hybrid.
  Client lưu state/nonce theo session tạm thời, verify khi callback.
  Nếu mismatch phải từ chối toàn bộ flow.
  Không tái sử dụng nonce qua nhiều login attempt.
- **Ví dụ:**
  Callback nhận ID Token có nonce khác nonce đã phát sinh -> reject login.

### 🔴 [Senior] Show OIDC login flow with discovery and token validation.

- **Tổng Quan:**
  Đây là flow chuẩn cho ứng dụng enterprise tích hợp IdP.
- **Giải thích:**
  Luồng gồm bootstrapping config, authorize, token exchange, verify claims.
- **Ví dụ:**

```text
Client              OIDC Provider
  |                      |
  |-- GET /.well-known/openid-configuration -->
  |<- issuer, endpoints, jwks_uri ------------
  |-- GET jwks_uri --------------------------->
  |<- JWKS keys -------------------------------
  |-- Redirect /authorize?scope=openid... --->
  |<- callback code ---------------------------
  |-- POST /token (code+PKCE) ---------------->
  |<- id_token + access_token -----------------
  |-- Verify signature + iss/aud/exp/nonce --->
  |-- (optional) GET /userinfo --------------->
  |<- profile claims --------------------------
```

---

## JWT Deep Dive

### 🟢 [Junior] What is the structure of a JWT?

- **Tổng Quan:**
  JWT gồm 3 phần: `header.payload.signature` (base64url-encoded).
- **Giải thích:**
  Header: mô tả thuật toán, kiểu token.
  Payload: chứa claims (sub, exp, role...).
  Signature: đảm bảo toàn vẹn, tạo từ header+payload+secret/private key.
  JWT không tự mã hóa nội dung (trừ khi dùng JWE).
  Ai có token đều đọc được payload đã decode.
- **Ví dụ:**
  Không đưa mật khẩu hay dữ liệu nhạy cảm trực tiếp vào payload.

### 🟢 [Junior] Is JWT encrypted by default?

- **Tổng Quan:**
  Không. JWT chuẩn thường là JWS (signed), không phải encrypted.
- **Giải thích:**
  Chữ ký giúp phát hiện sửa đổi token.
  Nhưng payload vẫn nhìn thấy được sau khi decode base64url.
  Nếu cần bí mật dữ liệu, dùng JWE hoặc không đặt dữ liệu nhạy cảm vào token.
  Trong thực tế, access token JWT nên chứa claim tối thiểu.
- **Ví dụ:**
  Chỉ chứa `sub`, `scope`, `exp`, `iss`, `aud`.

### 🟡 [Mid] RS256 vs HS256: what are trade-offs?

- **Tổng Quan:**
  HS256 dùng shared secret; RS256 dùng cặp khóa public/private.
- **Giải thích:**
  HS256:
  - Nhanh, đơn giản.
  - Cần chia sẻ secret cho mọi verifier -> rủi ro lan rộng.
    RS256:
  - Sign bằng private key, verify bằng public key.
  - Hỗ trợ phân tách trách nhiệm, phù hợp distributed systems.
  - Dễ tích hợp key rotation qua JWKS.
- **Ví dụ:**
  IdP lớn thường dùng RS256 để API gateway và services chỉ cần public key.

### 🟡 [Mid] What validations are mandatory when consuming JWT?

- **Tổng Quan:**
  Không chỉ verify chữ ký; phải verify đầy đủ ngữ cảnh token.
- **Giải thích:**
  Kiểm tra `alg` đúng whitelist cho phép.
  Kiểm tra chữ ký với key phù hợp `kid`.
  Validate `iss`, `aud`, `exp`, `nbf`, `iat` (với clock skew hợp lý).
  Kiểm tra `sub` định danh chủ thể.
  Nếu có `jti`, đối chiếu danh sách revoke/replay theo yêu cầu hệ thống.
- **Ví dụ:**
  API của service A không chấp nhận token có `aud=serviceB`.

### 🟡 [Mid] How should expiration and clock skew be handled?

- **Tổng Quan:**
  Expiration ngắn giảm blast radius khi token lộ.
- **Giải thích:**
  Access token thường 5-15 phút.
  Cho phép clock skew nhỏ (ví dụ 30-120 giây) để tránh lỗi lệch giờ.
  Không cấp token sống quá lâu chỉ để "đỡ refresh".
  NTP synchronization trên server là bắt buộc.
  Với mobile offline, thiết kế refresh chiến lược rõ ràng.
- **Ví dụ:**
  API chấp nhận token hết hạn tối đa 60 giây để bù lệch đồng hồ.

### 🟡 [Mid] JWT vs opaque tokens: when should each be used?

- **Tổng Quan:**
  JWT tự chứa thông tin; opaque token là chuỗi tham chiếu, cần introspection.
- **Giải thích:**
  JWT:
  - Verify local, giảm call về auth server.
  - Khó revoke ngay lập tức nếu không có cơ chế bổ trợ.
    Opaque:
  - Revocation tập trung dễ hơn.
  - Mỗi lần kiểm tra có thể cần network/introspection cache.
    Chọn theo nhu cầu latency, revocation, độ phân tán hệ thống.
- **Ví dụ:**
  Hệ thống ngân hàng cần thu hồi tức thì thường ưu tiên opaque token.

### 🔴 [Senior] What is the “alg:none” vulnerability?

- **Tổng Quan:**
  `alg:none` là lỗ hổng khi thư viện chấp nhận token không chữ ký như hợp lệ.
- **Giải thích:**
  Attacker sửa header thành `{"alg":"none"}` rồi tự chỉnh payload quyền cao.
  Nếu backend không ép buộc thuật toán ký hợp lệ -> bypass authn/authz.
  Mitigation:
  - Whitelist thuật toán cố định.
  - Không tin thuật toán do token tự khai báo.
  - Dùng thư viện cập nhật và cấu hình verify nghiêm ngặt.
- **Ví dụ:**
  Chỉ cho phép `RS256`; từ chối mọi token có alg khác.

### 🔴 [Senior] What is JWT key confusion and how to prevent it?

- **Tổng Quan:**
  Key confusion xảy ra khi verifier dùng sai loại key/thuật toán để verify.
- **Giải thích:**
  Ví dụ kinh điển: chuyển RS256 -> HS256 và dùng public key làm HMAC secret.
  Nếu thư viện/config yếu, attacker forge được token hợp lệ giả.
  Mitigation:
  - Ràng buộc chặt giữa key type và algorithm.
  - Tách key store cho symmetric/asymmetric.
  - Validate `kid`, `kty`, `alg` nhất quán.
- **Ví dụ:**
  Endpoint chỉ nhận RS256 phải từ chối token HS256 tuyệt đối.

### 🔴 [Senior] Show secure JWT validation pipeline.

- **Tổng Quan:**
  Pipeline rõ ràng giúp tránh skip bước quan trọng.
- **Giải thích:**
  Mỗi bước fail phải trả lỗi rõ và không rò rỉ thông tin nhạy cảm.
- **Ví dụ:**

```text
Receive Bearer Token
        |
        v
Parse format (3 parts?) ----no----> Reject 401
        |
       yes
        v
Check alg in allowlist ----no----> Reject 401
        |
       yes
        v
Load key by kid + issuer ----fail-> Reject 401
        |
        v
Verify signature ----------fail---> Reject 401
        |
        v
Validate iss/aud/exp/nbf/sub ----fail-> Reject 401/403
        |
        v
Map scopes/roles -> authorization decision
```

### 🟡 [Mid] How to design refresh strategy with JWT access tokens?

- **Tổng Quan:**
  Access token ngắn hạn + refresh token rotation là mô hình phổ biến.
- **Giải thích:**
  Không kéo dài exp access token để tránh refresh.
  Refresh token lưu state server-side để có khả năng revoke và phát hiện reuse.
  Nên gắn refresh token với device/session identifier.
  Khi refresh thất bại do reuse -> đăng xuất toàn bộ phiên liên quan.
  Log sự kiện bất thường để SOC theo dõi.
- **Ví dụ:**
  Mỗi thiết bị có refresh token chain riêng, revoke theo chain thay vì toàn user.

---

## Session Management

### 🟢 [Junior] What are server-side sessions?

- **Tổng Quan:**
  Session ID lưu ở client (cookie), trạng thái thật lưu ở server.
- **Giải thích:**
  Khi login thành công, server tạo session record.
  Cookie chứa session ID random khó đoán.
  Mỗi request kèm cookie, server tra session store.
  Dễ revoke ngay lập tức bằng xóa record.
  Đòi hỏi session storage và scaling strategy.
- **Ví dụ:**
  Session store dùng Redis để chia sẻ giữa nhiều web node.

### 🟢 [Junior] Stateless tokens vs sessions: key difference?

- **Tổng Quan:**
  Stateless token tự chứa thông tin; session cần state server-side.
- **Giải thích:**
  Stateless thuận lợi horizontal scale, ít lookup.
  Session thuận lợi revoke/force logout tức thời.
  Token-based cần chiến lược revoke bổ sung.
  Session-based cần quản lý lưu trữ, TTL, failover.
  Không có mô hình "tốt tuyệt đối", chỉ có phù hợp ngữ cảnh.
- **Ví dụ:**
  Monolith nội bộ thường dùng session cookie.

### 🟡 [Mid] Where should session data be stored?

- **Tổng Quan:**
  Redis phổ biến cho hiệu năng; DB phù hợp truy vết dài hạn.
- **Giải thích:**
  In-memory local không phù hợp multi-instance nếu không sticky session.
  Redis: nhanh, hỗ trợ TTL tự động.
  DB: bền vững hơn, query audit tốt nhưng chậm hơn.
  Có thể hybrid: Redis hot path + DB audit events.
- **Ví dụ:**
  Session active lưu Redis, logout history lưu Postgres.

### 🟡 [Mid] What is session fixation and how to prevent it?

- **Tổng Quan:**
  Session fixation là attacker ép nạn nhân dùng session ID đã biết trước.
- **Giải thích:**
  Nếu app giữ nguyên session ID trước/sau login, attacker có thể chiếm phiên.
  Phòng tránh:
  - Rotate session ID ngay sau auth thành công.
  - Đặt cookie `HttpOnly`, `Secure`, `SameSite` phù hợp.
  - Timeout phiên và kiểm tra bất thường IP/UA theo risk-based policy.
- **Ví dụ:**
  Login success -> invalidate old session ID -> cấp ID mới.

### 🟡 [Mid] Why rotate session identifiers?

- **Tổng Quan:**
  Rotation giảm nguy cơ session hijacking kéo dài.
- **Giải thích:**
  Rotate ở sự kiện nhạy cảm: login, MFA success, privilege elevation.
  Có thể rotate định kỳ với phiên sống lâu.
  Kèm cơ chế grace period ngắn để tránh race condition request song song.
  Theo dõi token/session binding để phát hiện reuse bất thường.
- **Ví dụ:**
  Sau khi user bật MFA, bắt buộc rotate toàn bộ session hiện tại.

### 🔴 [Senior] Show a secure web session lifecycle.

- **Tổng Quan:**
  Lifecycle đầy đủ giúp giảm lỗ hổng thực thi thực tế.
- **Giải thích:**
  Bao gồm phát hành, duy trì, gia hạn, vô hiệu hóa.
- **Ví dụ:**

```text
[Unauthenticated]
     |
     | Login success + password verified
     v
[Issue Session ID] --set cookie HttpOnly/Secure/SameSite--> [Authenticated]
     |
     | Risk event (MFA passed, role elevated)
     v
[Rotate Session ID]
     |
     | Idle timeout or absolute timeout
     v
[Session Expired] --> force re-auth
     |
     | Logout / revoke admin action
     v
[Invalidate Server Session Record]
```

---

## API Security Patterns

### 🟢 [Junior] What are API keys and when are they appropriate?

- **Tổng Quan:**
  API key là credential đơn giản để nhận diện client ứng dụng.
- **Giải thích:**
  API key phù hợp cho public API mức bảo vệ cơ bản hoặc internal service low-risk.
  Không nên coi API key như định danh user.
  Cần gắn quota, rate limit, scope theo key.
  Bắt buộc truyền qua HTTPS; tránh query string nếu có thể.
- **Ví dụ:**
  Header `x-api-key` + giới hạn 100 requests/phút/client.

### 🟡 [Mid] How should Bearer token APIs be protected?

- **Tổng Quan:**
  Bearer token phải đi cùng các lớp bảo vệ bổ sung.
- **Giải thích:**
  HTTPS bắt buộc, kiểm tra signature/claims đầy đủ.
  Enforce scopes/permissions theo endpoint.
  Dùng short-lived access token.
  Bổ sung rate limiting và anomaly detection.
  Trả mã lỗi nhất quán (401 vs 403) để client xử lý đúng.
- **Ví dụ:**
  Endpoint admin yêu cầu scope `admin:write` và role phù hợp.

### 🟡 [Mid] What is mTLS and where does it fit?

- **Tổng Quan:**
  mTLS xác thực hai chiều giữa client và server bằng certificate.
- **Giải thích:**
  TLS thường chỉ xác thực server.
  mTLS xác thực cả client, phù hợp service-to-service zero trust.
  Có thể dùng mTLS như lớp identity nền, kết hợp OAuth token cho quyền chi tiết.
  Vấn đề chính là lifecycle certificate và PKI vận hành.
- **Ví dụ:**
  Mesh nội bộ yêu cầu cert SPIFFE + policy cho từng workload.

### 🟡 [Mid] How do HMAC request signatures work?

- **Tổng Quan:**
  HMAC ký request để đảm bảo integrity và authenticity.
- **Giải thích:**
  Client và server chia sẻ secret.
  Client ký chuỗi canonical gồm method, path, body hash, timestamp, nonce.
  Server tính lại chữ ký để đối chiếu.
  Chống sửa request và giảm replay nếu kiểm nonce/timestamp.
  Cần đồng bộ thời gian và canonicalization chuẩn.
- **Ví dụ:**
  `Authorization: HMAC keyId=..., signature=..., ts=...`.

### 🟡 [Mid] Why enforce OAuth scopes per endpoint?

- **Tổng Quan:**
  Scope là cơ chế least privilege cấp quyền theo chức năng.
- **Giải thích:**
  Không nên chỉ kiểm tra token "hợp lệ".
  Mỗi endpoint map tới scope cụ thể.
  Scope coarse-grained có thể kết hợp RBAC/ABAC cho chi tiết hơn.
  Scope design nên ổn định, tránh nổ số lượng quá mức.
- **Ví dụ:**
  `invoice.read`, `invoice.write`, `invoice.refund`.

### 🔴 [Senior] Design rate limiting per client for protected APIs.

- **Tổng Quan:**
  Rate limit theo client giúp chống abuse và bảo vệ downstream.
- **Giải thích:**
  Key định danh limit có thể là client_id, API key, subject hoặc tổ hợp.
  Thuật toán phổ biến: token bucket, leaky bucket, sliding window.
  Cần tách limit theo endpoint nhạy cảm (login, token refresh).
  Trả headers quan sát được: remaining, reset, retry-after.
  Nên có burst + sustained limit để cân bằng UX và bảo vệ hệ thống.
- **Ví dụ:**
  `token endpoint`: 10 req/phút/client + lock tạm khi spike bất thường.

### 🔴 [Senior] Show layered API security architecture.

- **Tổng Quan:**
  Security API hiệu quả là defense-in-depth, không phụ thuộc một cơ chế.
- **Giải thích:**
  Mỗi lớp xử lý rủi ro khác nhau: transport, identity, authorization, abuse.
- **Ví dụ:**

```text
Client
  |
  v
[WAF/CDN] -> bot filtering, IP reputation
  |
  v
[API Gateway] -> TLS/mTLS, authn, JWT validation, scope pre-check
  |
  v
[Service Layer] -> business authz (RBAC/ABAC), input validation
  |
  v
[Data Layer] -> row-level controls, encryption, audit logs
```

---

## Multi-Factor Authentication (MFA)

### 🟢 [Junior] What is MFA and why does it matter?

- **Tổng Quan:**
  MFA yêu cầu từ 2 yếu tố khác nhau để đăng nhập.
- **Giải thích:**
  Yếu tố có thể là:
  - Something you know (password/PIN)
  - Something you have (phone/security key)
  - Something you are (biometric)
    MFA giảm rủi ro khi password bị lộ.
    Không phải mọi yếu tố đều mạnh như nhau.
- **Ví dụ:**
  Password + TOTP app (Authenticator).

### 🟡 [Mid] How does TOTP work conceptually?

- **Tổng Quan:**
  TOTP tạo mã OTP dựa trên secret chia sẻ và thời gian hiện tại.
- **Giải thích:**
  Secret seed được lưu khi enroll.
  Mã OTP đổi mỗi 30 giây (thường).
  Server và app người dùng cùng tính mã dựa trên time-step.
  Cần cho phép lệch thời gian nhỏ ±1 step.
  Secret phải lưu encrypted và bảo vệ chặt chẽ.
- **Ví dụ:**
  RFC 6238 là chuẩn TOTP phổ biến.

### 🟡 [Mid] What are strengths of WebAuthn/FIDO2?

- **Tổng Quan:**
  WebAuthn chống phishing tốt và loại bỏ chia sẻ secret server-side.
- **Giải thích:**
  Dùng cặp khóa bất đối xứng theo từng origin (RP ID).
  Private key nằm trong authenticator, không rời thiết bị.
  Challenge-response chống replay.
  Hỗ trợ passkeys đồng bộ đa thiết bị (tùy nền tảng).
  Trải nghiệm người dùng tốt hơn OTP trong nhiều trường hợp.
- **Ví dụ:**
  Đăng nhập bằng khóa bảo mật vật lý hoặc passkey sinh trắc học.

### 🟡 [Mid] Are push notifications secure for MFA?

- **Tổng Quan:**
  Push MFA tiện lợi nhưng có rủi ro "MFA fatigue".
- **Giải thích:**
  Attacker spam push khiến người dùng bấm chấp thuận nhầm.
  Mitigation:
  - Number matching
  - Hiển thị ngữ cảnh (location/device)
  - Rate limit và lock tạm
  - Risk scoring trước khi gửi push
    Push nên là một phần của chiến lược adaptive authentication.
- **Ví dụ:**
  User phải nhập mã 2 chữ số hiển thị trên trang đăng nhập để approve push.

### 🔴 [Senior] How should recovery codes be designed?

- **Tổng Quan:**
  Recovery codes là đường lui khi mất thiết bị MFA.
- **Giải thích:**
  Cấp danh sách one-time codes tại thời điểm enroll.
  Hash code trước khi lưu server (không lưu plaintext).
  Bắt user tải/lưu offline an toàn.
  Có quy trình re-issue sau khi dùng một mã.
  Audit mọi lần dùng recovery code và đánh dấu rủi ro cao.
- **Ví dụ:**
  Khi dùng recovery code thành công -> yêu cầu enroll MFA mới ngay.

### 🔴 [Senior] Show risk-based MFA decision flow.

- **Tổng Quan:**
  Không phải mọi login đều cần friction như nhau.
- **Giải thích:**
  Dựa trên context để quyết định challenge MFA.
- **Ví dụ:**

```text
Login attempt
    |
    v
Evaluate risk signals (IP, geo, device, velocity, impossible travel)
    |
    +--> Low risk  ----> allow with primary auth
    |
    +--> Medium risk -> require step-up MFA (TOTP/WebAuthn)
    |
    +--> High risk ---> block + alert + account protection flow
```

---

## Single Sign-On (SSO)

### 🟢 [Junior] What is Single Sign-On?

- **Tổng Quan:**
  SSO cho phép người dùng đăng nhập một lần để truy cập nhiều ứng dụng.
- **Giải thích:**
  Danh tính tập trung tại Identity Provider (IdP).
  Các ứng dụng (Service Provider / Relying Party) tin cậy assertion/token từ IdP.
  Giảm số lần nhập mật khẩu và tăng quản trị tập trung.
  Nhưng nếu IdP sự cố, nhiều app có thể bị ảnh hưởng.
- **Ví dụ:**
  Nhân viên đăng nhập cổng công ty và vào email, HR, wiki không login lại.

### 🟡 [Mid] SAML vs OIDC: key comparison?

- **Tổng Quan:**
  SAML cũ hơn, XML-based; OIDC hiện đại hơn, JSON/REST-friendly.
- **Giải thích:**
  SAML phổ biến trong enterprise legacy, browser SSO.
  OIDC phù hợp web/mobile/API ecosystem hiện đại.
  SAML assertion thường phức tạp hơn OIDC ID token.
  Cả hai đều dùng federation trust với metadata/cert.
- **Ví dụ:**
  SaaS B2B thường hỗ trợ cả OIDC và SAML để tương thích khách hàng lớn.

### 🟡 [Mid] What is identity federation?

- **Tổng Quan:**
  Federation là liên kết tin cậy danh tính giữa nhiều domain/tổ chức.
- **Giải thích:**
  Ứng dụng không tự quản password người dùng cuối.
  Tin cậy IdP của tổ chức đối tác để xác thực user.
  Cần quy trình mapping claims -> local roles/entitlements.
  Quản lý vòng đời người dùng phụ thuộc SCIM/provisioning hoặc JIT.
- **Ví dụ:**
  Công ty A dùng Azure AD để đăng nhập vào SaaS của công ty B.

### 🔴 [Senior] How to integrate enterprise SSO safely?

- **Tổng Quan:**
  Enterprise SSO cần chuẩn hóa onboarding tenant và kiểm soát mapping quyền.
- **Giải thích:**
  Bước quan trọng:
  - Xác minh domain ownership tenant.
  - Thiết lập metadata/cert rollover.
  - Mapping group/claim sang role nội bộ có whitelist.
  - Tách account linking rõ ràng tránh account takeover.
  - Audit tất cả thay đổi cấu hình SSO.
    Cần cơ chế fallback break-glass admin account.
- **Ví dụ:**
  Tenant admin cấu hình IdP, test login sandbox trước khi bật production.

### 🔴 [Senior] Show a federation login sequence.

- **Tổng Quan:**
  Sequence giúp hiểu điểm thất bại và nơi đặt kiểm tra.
- **Giải thích:**
  Bắt đầu từ SP-initiated hoặc IdP-initiated tùy mô hình.
- **Ví dụ:**

```text
User -> SaaS App (SP)
  |
  | (1) No session, detect tenant domain
  v
Redirect to Enterprise IdP
  |
  | (2) User authenticates at IdP
  v
IdP sends assertion/token to SaaS callback
  |
  | (3) SaaS validates signature, issuer, audience, replay
  | (4) Map claims/groups -> internal roles
  v
Create SaaS session / issue app token
```

---

## Authorization Patterns

### 🟢 [Junior] What is RBAC?

- **Tổng Quan:**
  RBAC (Role-Based Access Control) cấp quyền theo vai trò.
- **Giải thích:**
  User được gán một hoặc nhiều role.
  Role gắn permissions.
  Dễ hiểu, dễ quản trị giai đoạn đầu.
  Hạn chế: role explosion khi business rules phức tạp.
- **Ví dụ:**
  `Admin`, `Editor`, `Viewer`.

### 🟡 [Mid] What is ABAC and when is it useful?

- **Tổng Quan:**
  ABAC (Attribute-Based Access Control) dựa trên thuộc tính subject, resource, action, context.
- **Giải thích:**
  Quyết định quyền linh hoạt theo điều kiện runtime.
  Ví dụ thuộc tính: department, region, data classification, time, device trust.
  Phù hợp tổ chức có chính sách đa chiều và biến động cao.
  Đổi lại, policy khó debug hơn RBAC nếu không có tooling tốt.
- **Ví dụ:**
  "Nhân viên phòng Kế toán chỉ đọc hóa đơn của khu vực mình trong giờ làm việc".

### 🟡 [Mid] What is PBAC (policy-based access control)?

- **Tổng Quan:**
  PBAC nhấn mạnh quyết định quyền dựa trên policy engine trung tâm.
- **Giải thích:**
  Chính sách viết dưới dạng rule/policy-as-code.
  Ứng dụng gọi PDP (Policy Decision Point) để hỏi `allow/deny`.
  Tách logic quyền khỏi business code, dễ audit/versioning.
  Cần cache và thiết kế fail-open/fail-closed rõ ràng.
- **Ví dụ:**
  Dùng OPA/Rego để đánh giá policy cho API gateway và services.

### 🟡 [Mid] What is ReBAC?

- **Tổng Quan:**
  ReBAC (Relationship-Based Access Control) cấp quyền dựa trên quan hệ giữa thực thể.
- **Giải thích:**
  Mô hình phù hợp collaborative apps (document sharing, org graph).
  Quyền kiểu "user là owner/editor/member của resource".
  Có thể biểu diễn bằng graph hoặc tuples.
  Truy vấn quyền cần tối ưu để tránh độ trễ cao.
- **Ví dụ:**
  User có quyền sửa tài liệu nếu là `editor` của document đó.

### 🔴 [Senior] How does OPA fit in modern authorization?

- **Tổng Quan:**
  OPA cung cấp engine đánh giá policy tách biệt khỏi ứng dụng.
- **Giải thích:**
  Thành phần:
  - PEP (Policy Enforcement Point): nơi chặn request.
  - PDP (Policy Decision Point): OPA evaluate policy.
  - Policy repo/version control.
    Ưu điểm: consistency đa dịch vụ, audit policy change.
    Cần chiến lược data input (JWT claims, resource metadata) rõ ràng.
- **Ví dụ:**
  API gateway gọi OPA sidecar trước khi route request vào service.

### 🔴 [Senior] Compare RBAC, ABAC, PBAC, ReBAC in real systems.

- **Tổng Quan:**
  Hệ thống lớn thường kết hợp nhiều mô hình thay vì chọn một.
- **Giải thích:**
  RBAC cho baseline coarse-grained.
  ABAC cho điều kiện ngữ cảnh.
  PBAC để chuẩn hóa policy execution.
  ReBAC cho permission theo quan hệ tài nguyên.
  Cần governance để tránh xung đột policy.
- **Ví dụ:**
  SaaS đa tenant: RBAC tenant-level + ABAC theo region + ReBAC cho sharing docs.

### 🔴 [Senior] Show an authorization decision pipeline.

- **Tổng Quan:**
  Pipeline minh họa cách kết hợp token claims với policy engine.
- **Giải thích:**
  Nên tách rõ authn và authz để dễ kiểm soát lỗi.
- **Ví dụ:**

```text
Incoming request
   |
   v
Authenticate (token/session)
   |
   v
Extract subject + tenant + scopes + resource context
   |
   v
Policy evaluation (RBAC + ABAC/PBAC/ReBAC)
   |
   +--> deny -> 403 + audit log
   |
   +--> allow -> execute business action + audit trail
```

---

## Zero Trust Architecture

### 🟢 [Junior] What is Zero Trust?

- **Tổng Quan:**
  Zero Trust nghĩa là "never trust, always verify".
- **Giải thích:**
  Không mặc định tin cậy chỉ vì nằm trong mạng nội bộ.
  Mọi truy cập phải xác minh identity, device posture, context.
  Least privilege và giám sát liên tục là nguyên tắc cốt lõi.
  Đây là mô hình kiến trúc và vận hành, không phải một sản phẩm.
- **Ví dụ:**
  Nhân viên truy cập app nội bộ vẫn phải qua IdP + policy check.

### 🟡 [Mid] What is BeyondCorp model?

- **Tổng Quan:**
  BeyondCorp chuyển kiểm soát truy cập từ network perimeter sang identity-centric.
- **Giải thích:**
  User/device được đánh giá trước khi cấp quyền từng request.
  Mạng nội bộ không còn là vùng "trusted" mặc định.
  Access proxy quyết định quyền dựa trên signal thời gian thực.
  Phù hợp mô hình làm việc hybrid/remote.
- **Ví dụ:**
  Truy cập app corporate từ internet an toàn mà không cần VPN truyền thống.

### 🟡 [Mid] Why continuous verification is important?

- **Tổng Quan:**
  Trust không cố định; trạng thái rủi ro thay đổi trong phiên.
- **Giải thích:**
  Device có thể mất compliance sau khi đã đăng nhập.
  Token có thể bị đánh cắp giữa phiên.
  Cần reevaluate theo thời gian hoặc theo sự kiện nguy cơ.
  Step-up auth khi phát hiện bất thường thay vì cho phép liên tục.
- **Ví dụ:**
  Phiên user bị yêu cầu re-auth khi đổi IP quốc gia đột ngột.

### 🟡 [Mid] What is micro-segmentation in Zero Trust?

- **Tổng Quan:**
  Micro-segmentation chia nhỏ vùng mạng/workload để hạn chế lateral movement.
- **Giải thích:**
  Mỗi service chỉ giao tiếp với service cần thiết (default deny).
  Policy ở layer workload identity thay vì subnet rộng.
  Kết hợp service mesh, mTLS, policy engine.
  Giảm tác động nếu một node bị compromise.
- **Ví dụ:**
  Service A chỉ được gọi B qua port/protocol cụ thể và identity đã định.

### 🔴 [Senior] How to start a Zero Trust migration pragmatically?

- **Tổng Quan:**
  Bắt đầu theo từng giai đoạn để giảm rủi ro triển khai.
- **Giải thích:**
  Giai đoạn 1: inventory users, devices, apps, data flows.
  Giai đoạn 2: centralize identity + MFA + conditional access.
  Giai đoạn 3: triển khai proxy/gateway policy-based access.
  Giai đoạn 4: workload identity + mTLS + segmentation.
  Giai đoạn 5: continuous monitoring + incident response automation.
- **Ví dụ:**
  Ưu tiên bảo vệ admin access và dữ liệu nhạy cảm trước.

### 🔴 [Senior] Show Zero Trust access decision flow.

- **Tổng Quan:**
  Flow thể hiện đánh giá đa tín hiệu trước khi cho phép truy cập.
- **Giải thích:**
  Quyết định quyền là động và có thể thay đổi giữa phiên.
- **Ví dụ:**

```text
Access Request
    |
    v
Verify identity (IdP, MFA status)
    |
    v
Assess device posture (managed? patched? encrypted?)
    |
    v
Evaluate context (location, risk score, sensitivity)
    |
    +--> insufficient trust -> deny or step-up auth
    |
    +--> sufficient trust -> least-privilege access token/session
    |
    v
Continuous monitoring + revoke on risk change
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Explain OAuth 2.0 authorization code flow with PKCE.

- **Tổng Quan:**
  Đây là flow chuẩn hiện đại cho app public và confidential.
- **Giải thích:**
  Client tạo `code_verifier` và `code_challenge`.
  User đăng nhập tại Authorization Server, nhận `authorization code`.
  Client đổi code bằng `code_verifier` để lấy token.
  PKCE ngăn attacker dùng code bị đánh cắp.
- **Ví dụ:**
  SPA nên dùng Authorization Code + PKCE thay implicit flow.

### 🟢 [Junior] JWT vs session tokens: when to use each?

- **Tổng Quan:**
  Chọn theo nhu cầu revoke, scale, và kiến trúc hệ thống.
- **Giải thích:**
  Session token (server-side): revoke dễ, phù hợp web truyền thống.
  JWT stateless: giảm lookup, phù hợp microservices.
  Nếu cần revoke tức thì mạnh, opaque/session thường dễ hơn.
  Với JWT, phải có cơ chế bổ sung cho logout/revocation.
- **Ví dụ:**
  B2C lớn dùng JWT cho API edge nhưng session cho web admin nội bộ.

### 🟡 [Mid] How to securely store and rotate refresh tokens?

- **Tổng Quan:**
  Refresh token cần bảo vệ như credential dài hạn.
- **Giải thích:**
  Lưu refresh token trong storage an toàn (cookie HttpOnly cho web, secure keystore cho mobile).
  Server-side lưu hash/token family metadata.
  Mỗi lần dùng refresh -> rotate token mới, token cũ vô hiệu.
  Phát hiện reuse token cũ -> revoke cả family và yêu cầu đăng nhập lại.
- **Ví dụ:**
  Thực hiện "refresh token rotation + reuse detection" theo RFC best practices.

### 🟡 [Mid] What is the “alg:none” JWT vulnerability?

- **Tổng Quan:**
  Là lỗi verify token sai cấu hình cho phép token không chữ ký.
- **Giải thích:**
  Attacker tạo token `alg:none` và nhét claim admin.
  Nếu backend không bắt buộc verify signature đúng thuật toán -> bypass.
  Cách phòng: algorithm allowlist cứng, thư viện cập nhật, verify strict.
- **Ví dụ:**
  Reject mọi token không phải `RS256` nếu hệ thống chỉ hỗ trợ `RS256`.

### 🟡 [Mid] OIDC vs OAuth 2.0: how do you explain in an interview?

- **Tổng Quan:**
  OAuth 2.0 cho ủy quyền; OIDC cho xác thực danh tính.
- **Giải thích:**
  OAuth trả access token để gọi API.
  OIDC thêm ID Token, UserInfo, Discovery để chuẩn hóa login.
  Câu ngắn gọn: OAuth = "can do", OIDC = "who are you".
- **Ví dụ:**
  Login với Google nên nói là OIDC trên nền OAuth 2.0.

### 🔴 [Senior] Design an auth system for a multi-tenant SaaS application.

- **Tổng Quan:**
  Thiết kế cần tách rõ tenant boundary, identity, authorization, audit.
- **Giải thích:**
  Identity layer:
  - Hỗ trợ local auth + enterprise SSO (OIDC/SAML).
  - Tenant discovery theo domain/email.
    Token/session layer:
  - Access token ngắn hạn + refresh rotation.
  - Claim bắt buộc: `tenant_id`, `sub`, `roles/scopes`.
    Authorization layer:
  - RBAC theo tenant + ABAC theo resource ownership.
    Isolation layer:
  - Enforce tenant filter ở mọi query (RLS nếu có).
    Security ops:
  - Audit log immutable, anomaly detection, break-glass controls.
- **Ví dụ:**
  API gateway validate token + tenant claim trước khi request vào service.

### 🔴 [Senior] How would you prevent token replay attacks?

- **Tổng Quan:**
  Replay prevention cần phối hợp token design + transport + runtime checks.
- **Giải thích:**
  Dùng TLS bắt buộc, token ngắn hạn.
  Với OIDC dùng nonce; với request signing dùng nonce/timestamp.
  Có thể áp dụng DPoP hoặc mTLS-bound access tokens cho PoP semantics.
  Theo dõi `jti` trong luồng nhạy cảm để phát hiện reuse.
  Refresh rotation giúp phát hiện replay ở refresh endpoint.
- **Ví dụ:**
  Request cũ có timestamp quá hạn hoặc nonce trùng -> từ chối.

### 🔴 [Senior] How do you decide between API keys, OAuth tokens, and mTLS?

- **Tổng Quan:**
  Quyết định dựa trên độ nhạy dữ liệu, loại client, và yêu cầu audit.
- **Giải thích:**
  API key: đơn giản, định danh app cơ bản.
  OAuth token: delegation/scopes tốt cho user-driven API.
  mTLS: identity mạnh cho service-to-service.
  Thực tế thường kết hợp: mTLS cho transport identity + OAuth cho quyền nghiệp vụ.
- **Ví dụ:**
  Internal mesh dùng mTLS, external partner API dùng OAuth client credentials.

### 🟡 [Mid] What are common mistakes in session management?

- **Tổng Quan:**
  Lỗi session thường đến từ cookie config và lifecycle yếu.
- **Giải thích:**
  Không set `HttpOnly/Secure/SameSite` phù hợp.
  Không rotate session ID sau login/privilege change.
  Timeout quá dài hoặc không có absolute timeout.
  Không invalidate session đúng cách khi logout/password reset.
- **Ví dụ:**
  Logout chỉ xóa cookie client nhưng không xóa session server là sai.

### 🟡 [Mid] How do scopes differ from roles?

- **Tổng Quan:**
  Scope gắn với token/client capability; role gắn với người dùng trong domain ứng dụng.
- **Giải thích:**
  Scope thường coarse-grained, portable giữa services.
  Role thường business-specific (Admin, Manager...).
  Cần map scope + role để quyết định cuối cùng.
  Không nên encode toàn bộ business logic vào scope.
- **Ví dụ:**
  Scope `invoice.write` + role `Accountant` mới được approve payment.

### 🔴 [Senior] How do you handle key rotation for JWT signing keys?

- **Tổng Quan:**
  Key rotation phải không làm gián đoạn dịch vụ xác thực token.
- **Giải thích:**
  Dùng JWKS với nhiều key song song (old + new) trong giai đoạn chuyển tiếp.
  Token mới ký bằng key mới, verifier vẫn chấp nhận key cũ đến khi hết hạn token cũ.
  Cache JWKS có TTL hợp lý và cơ chế refresh khi gặp `kid` mới.
  Lưu audit cho mọi lần thay key.
- **Ví dụ:**
  Rotation hàng quý + emergency rotation playbook khi nghi lộ private key.

### 🔴 [Senior] What is the right 401 vs 403 strategy in auth APIs?

- **Tổng Quan:**
  401 cho chưa xác thực/hết hạn credential; 403 cho đã xác thực nhưng không đủ quyền.
- **Giải thích:**
  401 nên kèm `WWW-Authenticate` khi phù hợp chuẩn.
  403 dùng khi token hợp lệ nhưng thiếu scope/role/policy deny.
  Trả lỗi nhất quán giúp client retry đúng và giảm bug.
  Không rò rỉ quá nhiều thông tin nội bộ trong error body.
- **Ví dụ:**
  Token hết hạn -> 401, token hợp lệ nhưng thiếu `admin:write` -> 403.

### 🔴 [Senior] How would you audit and monitor authentication systems?

- **Tổng Quan:**
  Monitoring auth cần cả security telemetry và business observability.
- **Giải thích:**
  Thu thập sự kiện: login success/fail, MFA challenge, token issuance, refresh reuse, policy deny.
  Correlate theo user, tenant, device, IP, geolocation.
  Thiết lập alert cho impossible travel, brute force, token anomaly.
  Log phải tamper-evident, retention theo compliance.
  Tích hợp SIEM/SOAR để phản ứng tự động.
- **Ví dụ:**
  5 lần refresh reuse trong 1 giờ -> khóa phiên tenant liên quan + tạo incident.

### 🔴 [Senior] Draw a reference architecture for modern auth in SaaS.

- **Tổng Quan:**
  Kiến trúc mẫu giúp trả lời câu hỏi system design trong interview.
- **Giải thích:**
  Tách lớp rõ ràng: IdP/Auth service, API gateway, policy engine, audit pipeline.
- **Ví dụ:**

```text
[User/Client]
    |
    v
[Frontend/BFF] -----> [Auth Service / IdP Integration]
    |                         |
    |                         +--> OIDC/SAML federation
    |                         +--> Token issuance (access/refresh)
    v
[API Gateway]
    |
    +--> JWT/session validation
    +--> Rate limit / anomaly checks
    v
[Application Services] <----> [Policy Engine (OPA)]
    |
    v
[Data Stores + Tenant Isolation Controls]
    |
    v
[Audit/Event Pipeline -> SIEM]
```

---

## Tổng Kết Nhanh / Quick Recap

- **Tổng Quan:**
  Các pattern hiện đại xoay quanh: identity chuẩn hóa (OIDC), ủy quyền theo ngữ cảnh (OAuth scopes + policy), và phòng thủ nhiều lớp.
- **Giải thích:**
  Nếu đi phỏng vấn, hãy trình bày theo khung:
  1. Authentication (ai là ai),
  2. Authorization (được làm gì),
  3. Session/token lifecycle,
  4. Threat model + mitigations,
  5. Observability + incident response.
     Nhấn mạnh khác biệt giữa lý thuyết protocol và thực thi production.
     Liên hệ lại kiến thức nền từ `01-security-fundamentals.md` và `02-cryptography-and-protocols.md`.
- **Ví dụ:**
  Trả lời tốt là trả lời có cấu trúc, có trade-off, có kiểm soát rủi ro và có cách vận hành thực tế.

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: Walk me through the OAuth 2.0 Authorization Code flow. Why is it preferred over Implicit flow? / Giải thích OAuth 2.0 Authorization Code flow. Tại sao nó được ưu tiên hơn Implicit flow? 🟡 Mid

**A:** The Authorization Code flow exchanges a short-lived authorization code for tokens via a back-channel server-to-server request. Steps: (1) Client redirects user to Authorization Server with `response_type=code`, `client_id`, `redirect_uri`, `scope`, and `state`. (2) User authenticates and consents. (3) Auth Server redirects back with a one-time `code`. (4) Client backend POSTs `code` + `client_secret` to `/token` endpoint and receives `access_token` + `refresh_token`. The Implicit flow returned the `access_token` directly in the URL fragment — visible in browser history, referrer headers, and server logs. Authorization Code never exposes tokens in the URL and authenticates the client with a `client_secret` on the back-channel.

Vietnamese explanation: Implicit flow bị deprecated vì token xuất hiện trong URL fragment — có thể bị lộ qua browser history, referrer header, hay log server. Authorization Code flow giải quyết bằng cách dùng back-channel (server-to-server) để đổi `code` lấy token. Trong phỏng vấn, nhấn mạnh: short-lived code, client authentication qua `client_secret`, và tại sao không đặt token trong URL là điểm cốt lõi.

---

### Q: What is PKCE and when must you use it? / PKCE là gì và khi nào bắt buộc dùng? 🟡 Mid

**A:** PKCE (Proof Key for Code Exchange, RFC 7636) defends against authorization code interception attacks in public clients that cannot securely store a `client_secret` (SPAs, mobile apps). The client generates a random `code_verifier`, hashes it with SHA-256 to produce `code_challenge`, and sends the challenge with the authorization request. At token exchange the server verifies the original `code_verifier` — an intercepted code is useless without it. PKCE is mandatory for public clients (no client secret) and recommended for confidential clients as an extra layer since OAuth 2.1 folds it in as a requirement for all flows.

Vietnamese explanation: Vì SPA và mobile app không thể giữ bí mật `client_secret` (code chạy ở client side), kẻ tấn công có thể intercept authorization code rồi đổi token. PKCE giải quyết bằng cách bind code với một `code_verifier` chỉ client gốc mới biết. Trade-off: không tốn overhead đáng kể, nên luôn dùng. Trong phỏng vấn, cần phân biệt public client vs confidential client và tại sao PKCE không thay thế hoàn toàn `client_secret` cho confidential clients.

---

### Q: What is refresh token rotation and why does it matter for security? / Refresh token rotation là gì và tại sao quan trọng? 🔴 Senior

**A:** Refresh token rotation issues a new `refresh_token` every time the old one is used to obtain a new `access_token`, then immediately invalidates the used token. If a refresh token is stolen and used by an attacker, the legitimate client's next refresh attempt will fail (the token it holds is now invalid), triggering a security alert or forced re-authentication. This converts a static long-lived secret into a rolling single-use token. Implementation details: store refresh tokens server-side as hashed values, set short absolute expiry (e.g., 30 days), detect token reuse by checking if an already-invalidated token is presented (replay detection), and revoke the entire token family on reuse to prevent a stolen-token race.

Vietnamese explanation: Không có rotation thì refresh token bị đánh cắp → attacker dùng mãi mãi mà không bị phát hiện. Với rotation, token chỉ dùng được một lần — khi bị replay, hệ thống biết có compromise và revoke toàn bộ family. Trade-off: nếu client request bị drop/retry, có thể tự invalidate token của mình → cần window nhỏ để xử lý race. Senior candidates cần biết: hashed storage, family revocation, và detection logic.

---

### Q: Compare JWT (stateless) vs opaque session tokens (stateful). When would you choose each? / So sánh JWT stateless và opaque session token stateful. Khi nào chọn cái nào? 🟡 Mid

**A:** JWT embeds claims directly in a signed token — the Resource Server validates it locally without a database call, enabling horizontal scaling with no shared session store. Downsides: tokens cannot be revoked before expiry (short expiry + refresh token rotation mitigates this), payload is Base64-encoded (not encrypted by default), and size grows with claims. Opaque session tokens are random strings; the server looks up session data in a store (Redis, DB) on every request — instant revocation, but requires a centralized store and adds latency. Choose JWT for stateless microservices, cross-domain APIs, and read-heavy systems. Choose opaque sessions for high-security contexts requiring instant revocation (banking, admin panels), or when the backend is monolithic with fast session store access.

Vietnamese explanation: JWT phù hợp khi cần scale ngang vì không cần shared state, nhưng không thể revoke trước expiry — chỉ giảm thiểu bằng short TTL (5-15 phút) kết hợp refresh token. Opaque token phù hợp khi cần revoke ngay lập tức (logout tức thì, ban user). Trade-off thực tế: nhiều hệ thống dùng hybrid — JWT ngắn hạn cho resource servers + opaque refresh token trong DB cho revocation.

---

### Q: How does passwordless authentication work, and what are its security trade-offs compared to passwords? / Passwordless authentication hoạt động thế nào và trade-off bảo mật so với password? 🔴 Senior

**A:** Passwordless replaces shared-secret passwords with cryptographic proof of identity. Main patterns: (1) **Magic link** — server emails a one-time signed URL; user clicks to authenticate. (2) **OTP/TOTP** — time-based one-time password from an authenticator app (TOTP, RFC 6238) or SMS OTP. (3) **Passkeys / WebAuthn** — the device generates an asymmetric key pair; private key never leaves the device; server stores only the public key; authentication is a challenge-response signed by the private key, optionally gated by biometrics. Security gains: eliminates password reuse, phishing (passkeys are origin-bound), credential stuffing, and breach exposure of hashed passwords. Trade-offs: magic links depend on email security; SMS OTP is vulnerable to SIM swapping; passkeys require device enrollment and recovery planning; account recovery flows become the new attack surface.

Vietnamese explanation: Passkeys (WebAuthn) là gold standard vì private key không bao giờ rời thiết bị và credential bị bind vào origin (chống phishing). Trade-off: recovery khi mất thiết bị phức tạp hơn reset password; cần backup authenticator hoặc recovery code. SMS OTP tiện lợi nhưng yếu vì SIM swap. Trong phỏng vấn Senior, cần thảo luận account recovery design và multi-device enrollment strategy.
