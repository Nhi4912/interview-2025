# Modern Authentication & Authorization Patterns / Mẫu Xác Thực và Phân Quyền Hiện Đại

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Security Fundamentals](./01-security-fundamentals.md) | [Cryptography](./02-cryptography-and-protocols.md) | [Web Security](./03-web-security-owasp.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki "Login with Google" incident:** Tiki implement OAuth 2.0 để cho phép login bằng Google. Developer dùng Implicit Flow (access token returned directly in redirect URL) — bị deprecated vì access token in URL fragment bị leak qua browser history và Referer header. Google Analytics log URL → token bị expose. Fix: migrate sang Authorization Code Flow with PKCE. Thêm 1 round-trip nhưng token không bao giờ xuất hiện trong URL.

**Bài học:** OAuth 2.0 có nhiều flows với security characteristics khác nhau. Chọn sai flow = security hole. Implicit Flow bị RFC recommend-against từ 2019.

## What & Why / Cái Gì & Tại Sao

**Analogy:** OAuth giống valet parking: bạn đưa chìa khóa đỗ xe (access token) cho valet (third-party app) để họ đỗ xe thay bạn — nhưng không cần đưa chìa khóa nhà (password). Authorization Code Flow là valet đưa phiếu giữ xe (authorization code) → exchange lấy chìa khóa thật (access token) ở bãi xe (server-side) — không qua URL.

**Why it matters:** OAuth 2.0 và OIDC là auth standard cho modern apps. Senior engineer phải biết các flows, PKCE, và khi nào dùng cái nào.

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

> 🧠 **Memory Hook:** OAuth = cho bạn mượn chìa khóa **phòng khách**, KHÔNG cho phòng ngủ. Bạn uỷ quyền truy cập giới hạn scope mà không cần đưa chìa khóa nhà (password).

**Tại sao tồn tại? / Why does this exist?**

Trước OAuth, ứng dụng bên thứ ba phải xin username/password để thay mặt bạn đăng nhập vào dịch vụ khác. Điều này nguy hiểm vì bạn không kiểm soát được ứng dụng sẽ làm gì với mật khẩu đó. Ứng dụng có toàn quyền truy cập — không giới hạn phạm vi hay thời gian.
→ **Why?** Ứng dụng biết password = có toàn quyền như chính chủ tài khoản, không thể thu hồi từng phần.
→ **Why?** Không có cơ chế uỷ quyền có giới hạn phạm vi (scoped delegation) trong HTTP truyền thống.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn có căn hộ nhiều phòng. Bạn thuê người dọn dẹp, nhưng chỉ cho họ vào phòng khách và bếp — không cho vào phòng ngủ và két sắt. OAuth làm điều tương tự: ứng dụng calendar xin quyền đọc email (phòng khách) nhưng không thể xóa email hay đọc tin nhắn riêng (phòng ngủ). Bạn đưa "chìa khóa phòng khách" (access token với scope `mail.read`), không đưa mật khẩu. Khi không cần nữa, chỉ cần thu lại chìa khóa đó — không cần đổi ổ toàn bộ căn hộ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
1. Ứng dụng redirect user → Authorization Server (/authorize?scope=mail.read&state=xyz)
2. User đăng nhập tại Auth Server + đồng ý scope
3. Auth Server redirect về → ứng dụng kèm authorization_code (one-time, short-lived)
4. Ứng dụng POST /token {code + code_verifier + client_id} → nhận access_token + refresh_token
5. Ứng dụng gọi Resource Server với Authorization: Bearer <access_token>
6. Resource Server verify token → trả dữ liệu trong scope đã cấp
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Client Credentials flow không có user — dành cho machine-to-machine (billing service gọi invoice API)
- Implicit flow bị deprecated vì token trả về trong URL fragment, bị leak qua browser history và Referer header
- PKCE bắt buộc cho public client (SPA, mobile) vì không thể giữ `client_secret` an toàn
- Refresh token cần rotation + reuse detection để phát hiện token bị đánh cắp
- `redirect_uri` phải exact-match để tránh open redirect attack — wildcard là lỗ hổng

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                 | Đúng là                                     |
| ----------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| Dùng Implicit flow cho SPA                | Token trong URL bị leak qua history/logs    | Dùng Authorization Code + PKCE              |
| Không validate `state` param sau redirect | CSRF có thể inject/swap session             | Luôn verify `state` khớp với giá trị đã gửi |
| Cấp scope rộng (`*` hoặc `admin`)         | Ứng dụng có quyền quá mức, blast radius lớn | Cấp minimal scope cần thiết cho use case    |

**🎯 Interview Pattern:**

- Khi thấy: "Login with Google/Facebook" hoặc "third-party app integration"
- → Nhớ đến: OAuth 2.0 Authorization Code + PKCE — không phải Implicit
- → Mở đầu: "OAuth 2.0 giải quyết bài toán uỷ quyền có giới hạn scope mà không chia sẻ password. Flow an toàn nhất hiện nay là Authorization Code + PKCE..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Cryptography & Protocols](./02-cryptography-and-protocols.md) — PKCE dùng SHA-256, token dùng RSA
- ➡️ Để hiểu tiếp: [OpenID Connect (OIDC)](#openid-connect-oidc) — identity layer on top of OAuth 2.0

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

> 🧠 **Memory Hook:** OIDC = OAuth + thẻ CCCD. OAuth cho biết "bạn được làm gì", OIDC còn cho biết "bạn là **ai**". ID Token là tờ giấy tờ tùy thân đính kèm cùng quyền truy cập.

**Tại sao tồn tại? / Why does this exist?**

OAuth 2.0 tốt cho ủy quyền nhưng không chuẩn hóa thông tin danh tính. Mỗi provider trả về user info theo cách khác nhau — không có tiêu chuẩn về format, endpoint, hay cách verify. Developer phải viết code riêng cho từng provider để parse thông tin user.
→ **Why?** Không có "identity layer" chuẩn hóa — Google trả `name`, Facebook trả `full_name`, Twitter không trả gì.
→ **Why?** OAuth được thiết kế cho delegation, không phải authentication — cần extend thêm một layer chuẩn.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Giả sử bạn vào hội nghị và bảo vệ cần biết 2 điều: bạn được phép vào khu vực nào, và bạn là ai. OAuth chỉ cấp badge cho phép vào khu vực nhất định. OIDC bổ sung thêm tấm thẻ CCCD đính kèm badge — ghi rõ họ tên, phòng ban, ảnh chân dung. Khi ứng dụng nhận ID Token, họ biết chính xác "người này là Nguyễn Văn A, email abc@company.com, đã xác minh lúc 9:00 sáng" — không cần hỏi thêm bất kỳ đâu. Và tấm CCCD có chữ ký số — không thể giả mạo.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Client              OIDC Provider
  |-- GET /.well-known/openid-configuration ──────────────────>
  |<─ {issuer, authorization_endpoint, token_endpoint, jwks_uri} ─
  |-- GET {jwks_uri} ─────────────────────────────────────────>
  |<─ {keys: [{kid, kty, n, e, alg}]} ────────────────────────
  |-- /authorize?scope=openid+profile+email&nonce=abc ────────>
  |   [User login + consent at IdP]
  |<─ callback?code=AUTH_CODE ─────────────────────────────────
  |-- POST /token {code + code_verifier} ─────────────────────>
  |<─ {access_token, id_token (JWT)} ──────────────────────────
  Client MUST verify: iss ✓  aud==client_id ✓  exp ✓  nonce ✓
  |-- (optional) GET /userinfo Authorization: Bearer access_token>
  |<─ {sub, name, email, picture} ─────────────────────────────
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ID Token chỉ dành cho client verify identity — KHÔNG gửi ID Token đến Resource Server thay access token
- `nonce` claim chống replay attack — phải generate mới cho mỗi login attempt, không tái sử dụng
- JWKS cần cache + hỗ trợ key rotation qua `kid` — khi Auth Server rotate key, client cần re-fetch JWKS
- `sub` là stable identifier (không thay đổi), `email` có thể thay đổi — dùng `sub` làm primary key user
- OIDC Discovery endpoint `.well-known/openid-configuration` giúp tự động cấu hình, không hardcode URL

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                              | Đúng là                                          |
| ------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| Gửi ID Token đến Resource Server để authorize API | ID Token cho client verify identity, không phải API auth | Dùng access token cho API calls                  |
| Không verify `nonce` trong ID Token               | Replay attack — attacker tái sử dụng ID Token cũ         | Luôn generate nonce mới và verify trong callback |
| Lưu `email` làm primary key user                  | Email có thể thay đổi → account merge lỗi                | Dùng `sub` (stable, provider-unique identifier)  |

**🎯 Interview Pattern:**

- Khi thấy: "Login with Google" / "federated identity" / "SSO với external IdP"
- → Nhớ đến: OIDC = authentication layer on top of OAuth 2.0, ID Token + UserInfo endpoint
- → Mở đầu: "OIDC bổ sung ID Token vào OAuth 2.0 để chuẩn hóa xác thực danh tính. OAuth trả lời 'bạn được làm gì', OIDC trả lời 'bạn là ai'..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [OAuth 2.0](#oauth-20) — OIDC build on top của OAuth 2.0 flows
- ➡️ Để hiểu tiếp: [SSO](#single-sign-on-sso) — OIDC là nền tảng của modern SSO

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

> 🧠 **Memory Hook:** JWT = giấy thông hành có con dấu quốc gia. Ai cũng **đọc được** nội dung (base64 không phải mã hóa), nhưng không **giả được** dấu nếu không có private key. Hết hạn là hết hạn — không gia hạn trực tiếp.

**Tại sao tồn tại? / Why does this exist?**

Hệ thống microservices cần xác minh danh tính và quyền mà không cần gọi về auth server cho mỗi request. Session server-side tốn một round-trip DB/Redis cho mỗi API call — với hàng nghìn request/giây, mỗi lookup thêm latency và tải DB.
→ **Why?** Mỗi service cần biết "người này là ai và được làm gì" — không thể gọi centralized auth server mỗi lần.
→ **Why?** Cần cơ chế xác minh stateless, self-contained, không phụ thuộc shared state — JWT là câu trả lời.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến hộ chiếu khi du lịch. Nhân viên hải quan có thể đọc ngay tên, quốc tịch, ngày sinh — không cần gọi về Hà Nội để xác minh. Con dấu và hologram đảm bảo không ai làm giả được. JWT cũng vậy: payload chứa thông tin user, chữ ký RSA đảm bảo không ai sửa nội dung. Nhưng khác hộ chiếu: JWT có ngày hết hạn rất ngắn (15 phút) và không thể thu hồi trước khi hết hạn — như vé tàu đã bán ra không thể vô hiệu hóa từng vé lẻ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
JWT = base64url(HEADER) . base64url(PAYLOAD) . SIGNATURE

HEADER:  {"alg":"RS256","typ":"JWT","kid":"key-2024-01"}
PAYLOAD: {"sub":"u123","iss":"auth.app","aud":"api.app",
          "exp":1699999999,"iat":1699996399,"scope":"invoice.read"}
SIGNATURE: RS256(base64url(header)+"."+base64url(payload), private_key)

Validation pipeline (skip ANY step = security hole):
┌─────────────────────────────────────────────────────┐
│ 1. Parse: đúng 3 phần?          → NO  = Reject 401 │
│ 2. alg trong allowlist?         → NO  = Reject 401 │  ← "alg:none" attack
│ 3. Load key bằng kid + issuer   → FAIL= Reject 401 │
│ 4. Verify signature             → FAIL= Reject 401 │
│ 5. Validate iss/aud/exp/nbf/sub → FAIL= Reject 403 │
│ 6. Map scopes → authz decision                     │
└─────────────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- `alg:none` attack — thư viện cũ chấp nhận token không chữ ký như hợp lệ; phải whitelist algorithm cứng
- Key confusion attack — attacker chuyển RS256 sang HS256, dùng public key làm HMAC secret để forge token
- JWT payload visible sau base64 decode — không đặt password, PII, hay secret trong payload (dùng JWE nếu cần)
- Không thể revoke trước `exp` — cần short TTL (5-15 phút) + refresh token rotation + denylist nếu cần immediate revocation
- Clock skew giữa các server có thể làm expired token hợp lệ trong window nhỏ — cho phép tối đa 60-120 giây skew

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                         | Đúng là                                                      |
| ------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------ |
| Không whitelist algorithm, tin `alg` trong token | `alg:none` bypass toàn bộ auth                      | Cấu hình allowlist cứng RS256/ES256, reject mọi giá trị khác |
| Đặt `exp` dài 24h+ để tránh refresh              | Token bị đánh cắp dùng được cả ngày                 | Short-lived 5-15min + refresh token với rotation             |
| Đặt password hoặc PII trong payload              | Base64 không phải encrypt — ai decode cũng đọc được | Chỉ để minimal claims: sub, scope, exp, iss, aud             |

**🎯 Interview Pattern:**

- Khi thấy: "stateless auth" / "microservices identity" / "token validation" / "API authentication"
- → Nhớ đến: JWT = self-contained signed token, verify locally, không thể revoke trước `exp`
- → Mở đầu: "JWT cho phép stateless verification — mỗi service tự verify chữ ký mà không cần shared state. Trade-off là không thể revoke ngay lập tức..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Cryptography](./02-cryptography-and-protocols.md) — RS256, HMAC, asymmetric keys
- ➡️ Để hiểu tiếp: [Session Management](#session-management) — so sánh JWT vs session-based approach

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

> 🧠 **Memory Hook:** Session = vòng tay công viên nước. Đeo vào là đăng nhập, nhân viên kiểm tra vòng tay mỗi lần vào khu vực. **Cắt vòng = đăng xuất ngay lập tức** — không cần chờ hết hạn.

**Tại sao tồn tại? / Why does this exist?**

HTTP là stateless — mỗi request độc lập, server không nhớ request trước. Người dùng cần đăng nhập một lần và duy trì phiên làm việc mà không nhập lại password mỗi lần click. Cần một cơ chế "nhớ" trạng thái đăng nhập giữa các request.
→ **Why?** HTTP thiết kế stateless để đơn giản và scalable — state quản lý phiên phải được build thêm ở tầng ứng dụng.
→ **Why?** Đặt toàn bộ state vào client (cookie/token) thì dễ scale nhưng khó revoke; giữ state server-side thì revoke dễ nhưng cần shared storage.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi vào công viên nước, bạn mua vé một lần và được đeo vòng tay. Suốt ngày hôm đó, nhân viên chỉ cần nhìn vòng tay để biết bạn có quyền sử dụng tất cả khu vực — không cần hỏi vé gốc nữa. Khi bạn cần về sớm hoặc vi phạm nội quy, nhân viên cắt vòng — từ đó vào lại phải mua vé mới. Session cookie hoạt động y hệt: server cấp `session_id` khi đăng nhập (đeo vòng), browser gửi kèm mỗi request (nhân viên kiểm tra), logout xóa session khỏi Redis (cắt vòng tức thì).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
[Login Success]
      │
      ▼
Server tạo session record trong Redis:
  KEY:   sess:abc123xyz  (random 256-bit, không đoán được)
  VALUE: {user_id, roles, created_at, last_seen, ip_hash}
  TTL:   30 phút idle / 8 giờ absolute
      │
      ▼
Response: Set-Cookie: sid=abc123xyz; HttpOnly; Secure; SameSite=Lax

[Subsequent Requests]
  Browser tự gửi Cookie: sid=abc123xyz
  Server: redis.get("sess:abc123xyz") → user data → serve request
  Server: redis.expire("sess:abc123xyz", 1800)  ← renew idle TTL

[Risk Event: MFA passed / privilege elevated]
  → Rotate session ID: redis.del(old) + redis.set(new_id, same_data)

[Logout / Admin revoke]
  → redis.del("sess:abc123xyz") → session vô hiệu tức thì
  → Set-Cookie: sid=; Max-Age=0
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Session fixation — attacker ép nạn nhân dùng session ID định sẵn → **rotate session ID ngay sau login**
- Session hijacking qua XSS — cookie không có `HttpOnly` bị đọc bằng `document.cookie`
- Sticky session khi dùng in-memory local — không hoạt động đúng với multi-instance; dùng Redis shared
- Absolute timeout vs idle timeout — cả hai cần thiết; chỉ idle timeout không đủ nếu session bị hijack và giữ active
- Redis failover ảnh hưởng toàn bộ active session — cần replication và persistence policy cho production

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                              | Đúng là                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| Giữ nguyên session ID trước và sau khi login | Session fixation — attacker đã biết session ID trước khi auth            | Rotate session ID ngay sau authentication thành công     |
| Cookie không set `HttpOnly` và `Secure`      | JavaScript đọc được cookie → XSS steal session; plain HTTP expose cookie | Luôn `HttpOnly; Secure; SameSite=Lax` trên production    |
| TTL session admin vô tận                     | Session không hết hạn = cửa luôn mở dù đã bỏ máy                         | Set absolute TTL ngắn hơn cho privileged sessions (2-4h) |

**🎯 Interview Pattern:**

- Khi thấy: "user login state" / "logout functionality" / "force logout all devices"
- → Nhớ đến: server-side session = easy revoke, cần shared store (Redis); so sánh với JWT stateless
- → Mở đầu: "Session server-side cho phép revoke ngay lập tức khi logout hoặc phát hiện compromise — trade-off là cần shared Redis và thêm latency per request..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [JWT Deep Dive](#jwt-deep-dive) — hiểu rõ JWT vs session trade-offs
- ➡️ Để hiểu tiếp: [API Security Patterns](#api-security-patterns) — session và token áp dụng vào API như thế nào

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

> 🧠 **Memory Hook:** API Security = quầy giao dịch ngân hàng nhiều lớp. CMND (identity) → số tài khoản (API key/token) → xác minh quyền hạn (scope) → giới hạn giao dịch (rate limit) → ghi sổ (audit log). **Bỏ lớp nào cũng thành lỗ hổng.**

**Tại sao tồn tại? / Why does this exist?**

API là "cửa sổ" vào hệ thống — ai gọi đúng endpoint với đúng tham số có thể đọc/ghi dữ liệu. Không có bảo vệ = bất kỳ ai trên internet cũng có thể truy cập. API không có giao diện đồ họa — không có captcha, không có browser protection tự nhiên.
→ **Why?** API được thiết kế cho machine-to-machine — phải explicitly thêm security, không có mặc định.
→ **Why?** Mỗi lớp bảo vệ chỉ giải quyết một rủi ro cụ thể; bỏ một lớp = blind spot cho một loại attack.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy hình dung quầy giao dịch ngân hàng. Đầu tiên bảo vệ kiểm tra CMND (authentication — bạn là ai). Sau đó nhân viên xác nhận bạn có tài khoản tại ngân hàng (authorization — bạn được làm gì). Rồi kiểm tra bạn có đủ quyền thực hiện giao dịch cụ thể này không — rút hay chuyển khoản (scope enforcement). Cuối cùng giới hạn số lần giao dịch một ngày (rate limiting). Và mọi giao dịch đều được ghi vào sổ (audit log). Bỏ bất kỳ bước nào, ngân hàng mất tiền.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Client Request
      │
      ▼
[WAF / CDN Layer]
  • Bot filtering, IP reputation, DDoS protection
  • Geographic blocking nếu cần
      │
      ▼
[API Gateway Layer]
  • TLS termination — HTTPS bắt buộc, không chấp nhận HTTP
  • Authentication: verify Bearer token (JWT signature + claims)
  • Rate limiting: per client_id / per IP / per endpoint
  • Basic scope pre-check trước khi route
      │
      ▼
[Service / Application Layer]
  • Business authorization: RBAC/ABAC, resource ownership check
  • Input validation: schema, type, range, injection prevention
  • Idempotency keys cho write operations
      │
      ▼
[Data Layer]
  • Row-level security / tenant isolation
  • Encryption at rest
  • Immutable audit logs (ai làm gì, lúc nào, với dữ liệu nào)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Bearer token trong query string (`?token=xxx`) bị leak qua server logs và Referer header — dùng `Authorization: Bearer` header
- API key bị commit vào public git repo là nguồn breach phổ biến — quét secret trong CI/CD pipeline
- Missing scope enforcement: token hợp lệ nhưng không đủ quyền cho endpoint cụ thể — check scope per endpoint
- mTLS cho service-to-service thêm lớp identity không forgeable — không chỉ dựa vào token
- HMAC request signing chống replay và man-in-the-middle trên backend channels (AWS Signature V4)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                  | Tại sao sai                                        | Đúng là                                                       |
| -------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| Truyền Bearer token qua query string                     | Token lộ trong URL, server logs, và Referer header | Dùng `Authorization: Bearer <token>` header                   |
| Chỉ check token hợp lệ, không enforce scope per endpoint | Mọi valid token = mọi quyền — privilege escalation | Mỗi endpoint phải check scope cụ thể (vd: `invoice.write`)    |
| Rate limit chỉ theo IP                                   | Botnet thay đổi IP dễ dàng, bypass rate limit      | Rate limit theo `client_id` và `sub` (authenticated identity) |

**🎯 Interview Pattern:**

- Khi thấy: "design a secure API" / "protect endpoints" / "API authentication strategy"
- → Nhớ đến: Defense in depth — authentication + authorization + rate limiting + audit log, không có "single layer"
- → Mở đầu: "API security hiệu quả là defense-in-depth: WAF → API Gateway (authn + rate limit) → Service (authz) → Data (RLS). Không có một cơ chế nào đủ một mình..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [OAuth 2.0](#oauth-20) — Bearer token, scopes, client credentials flow
- ➡️ Để hiểu tiếp: [Zero Trust Architecture](#zero-trust-architecture) — API security là một phần của ZT model

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

> 🧠 **Memory Hook:** MFA = **2 ổ khóa khác loại** trên cùng 1 cửa. Khóa thứ nhất (password) bị phá không ảnh hưởng khóa thứ hai (TOTP/passkey). Kẻ trộm cần cả 2 loại chìa hoàn toàn khác nhau.

**Tại sao tồn tại? / Why does this exist?**

Password một mình không đủ — có thể bị phishing, bị leak qua data breach, hoặc bị credential stuffing từ breach cũ. Hàng triệu tài khoản bị chiếm mà không cần hack trực tiếp — chỉ cần thử list password từ breach.
→ **Why?** Người dùng tái sử dụng password trên nhiều dịch vụ; khi một dịch vụ bị breach, domino effect xảy ra.
→ **Why?** Password là single point of failure — một yếu tố duy nhất, shared secret, có thể bị đánh cắp mà **không cần thiết bị của nạn nhân**.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng cửa nhà bạn có 2 ổ khóa: một ổ chìa thông thường và một ổ cần mã số thay đổi mỗi 30 giây (hiển thị trên điện thoại). Kẻ trộm cướp được chìa khóa (password bị phishing) vẫn không vào được — vì cần mã số mà chỉ điện thoại của bạn mới hiển thị. Quan trọng là 2 ổ **khác loại nhau**: nếu cùng loại 2 ổ chìa thì kém bảo vệ hơn nhiều. MFA mạnh khi yếu tố thứ hai thuộc **loại** khác (biết ≠ có ≠ là).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
[Login Attempt]
       │
       ▼
Bước 1: Nhập password ──── something you KNOW
       │
  ✓ password correct
       │
       ▼
Bước 2: Second factor challenge (chọn 1):
  ┌─────────────────────────────────────────────────────────┐
  │ TOTP (something you HAVE — phone/authenticator app)     │
  │   OTP = HMAC-SHA1(shared_secret, floor(time/30))        │
  │   Valid window: ±1 step (bù clock skew 90 giây)         │
  │   Yếu điểm: secret lưu server → breach = compromise all │
  ├─────────────────────────────────────────────────────────┤
  │ WebAuthn / Passkey (something you HAVE — device key)    │
  │   Challenge-response với private key (không rời thiết bị)│
  │   Origin-bound: chỉ hoạt động đúng domain → chống phishing│
  │   Gold standard — phishing-resistant theo thiết kế      │
  ├─────────────────────────────────────────────────────────┤
  │ Push Notification (something you HAVE — phone)          │
  │   Risk: MFA fatigue → thêm number matching bắt buộc     │
  └─────────────────────────────────────────────────────────┘
       │ ✓ second factor verified
       ▼
[Session/token issued → Login Success]
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- SMS OTP yếu nhất vì SIM swapping và SS7 protocol attacks — tránh cho high-security accounts
- MFA fatigue attack: attacker spam push notification → user mệt mỏi và bấm approve nhầm → thêm number matching
- Recovery codes phải hash trước khi lưu server (không lưu plaintext) — mỗi code chỉ dùng được một lần
- Step-up auth: không phải mọi action cần MFA — chỉ khi sensitive operation (transfer tiền, thay đổi email)
- WebAuthn passkeys là gold standard: private key không rời thiết bị, credential bound to origin → chống phishing tuyệt đối

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                                  | Đúng là                                              |
| --------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| Dùng SMS OTP cho high-security accounts | SIM swapping bypass MFA hoàn toàn, SS7 có thể intercept      | Dùng TOTP app hoặc WebAuthn/passkey thay thế         |
| Không giới hạn số lần nhập OTP sai      | Brute-force 6 chữ số TOTP (chỉ 1M combinations)              | Lock account sau 3-5 lần fail + notify user          |
| Không audit recovery code usage         | Recovery code là backdoor đặc biệt, giá trị cao cho attacker | Log + flag security alert mọi lần dùng recovery code |

**🎯 Interview Pattern:**

- Khi thấy: "account security" / "prevent account takeover" / "2FA/MFA implementation"
- → Nhớ đến: MFA = multiple factors of different _types_; hierarchy: WebAuthn > TOTP > Push > SMS
- → Mở đầu: "MFA giảm drastically rủi ro account takeover vì attacker cần cả knowledge (password) và physical possession (device). Trade-off là UX friction và recovery complexity..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Session Management](#session-management) — MFA kết hợp với session lifecycle
- ➡️ Để hiểu tiếp: [SSO](#single-sign-on-sso) — MFA tích hợp vào IdP centralized, tránh MFA per-app

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

> 🧠 **Memory Hook:** SSO = thẻ nhân viên tập đoàn đa tòa nhà. Quẹt thẻ **một lần** tại cổng bảo vệ, tất cả tòa nhà đều nhận ra bạn. **Mất thẻ = thu hồi quyền vào khắp nơi ngay lập tức.**

**Tại sao tồn tại? / Why does this exist?**

Người dùng làm việc với hàng chục ứng dụng — email, HR, CRM, wiki, Slack. Mỗi app một password khác nhau dẫn đến password fatigue, tái sử dụng password, và offboarding nhân viên nghỉ việc phải reset thủ công từng app.
→ **Why?** Với 50 ứng dụng, IT phải thu hồi quyền 50 lần khi nhân viên nghỉ — dễ bỏ sót, tạo lingering access.
→ **Why?** Identity phân tán = quản lý khó, security yếu. Cần tập trung identity tại một IdP để single point of control.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Nhân viên Vingroup được cấp một thẻ nhân viên. Mỗi sáng quẹt thẻ vào cổng công ty — đó là đăng nhập IdP một lần. Sau đó đến bất kỳ tòa nhà nào trong tập đoàn — từ Vincom, Vinmec, đến VinFast — cửa đều mở tự động vì hệ thống nhận ra thẻ đã xác minh. Khi nhân viên nghỉ việc, IT chỉ cần vô hiệu hóa **một thẻ duy nhất** — toàn bộ quyền truy cập bị thu hồi ngay lập tức ở mọi tòa nhà. SSO là thẻ nhân viên số hóa.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
[User truy cập App A (Service Provider / Relying Party)]
      │ Không có session → redirect
      ▼
[Identity Provider (IdP) — Google, Azure AD, Okta...]
      │ Chưa có SSO session → yêu cầu login
      ▼
[User login: username + password + MFA]
      │ ✓ auth success → tạo SSO session tại IdP
      ▼
[IdP phát assertion/token → callback App A]
      │ App A validate: signature ✓  issuer ✓  audience ✓
      │                 expiry ✓  replay check ✓
      ▼
[App A tạo local session → User vào App A]

[User truy cập App B (same browser, same IdP)]
      │ Redirect → IdP
      │ IdP đã có SSO session cookie → KHÔNG cần login lại
      ▼
[IdP phát token ngay → App B]
      ▼
[App B tạo local session → User vào App B ngay lập tức]
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- IdP là single point of failure — nếu IdP down, nhiều app bị ảnh hưởng cùng lúc; cần break-glass admin account
- SAML vs OIDC: SAML XML-based phức tạp nhưng legacy enterprise cần; OIDC JSON/REST phù hợp modern apps
- Account linking nguy hiểm — phải xác minh domain ownership trước khi link external identity, tránh account takeover
- SP-initiated vs IdP-initiated flow — IdP-initiated thiếu cơ chế state/nonce chống CSRF, nên prefer SP-initiated
- Group/claim mapping từ external IdP sang local roles cần whitelist chặt — tránh privilege escalation qua IdP claim

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                 | Đúng là                                                       |
| ----------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| Không verify SAML assertion signature     | Forged assertion bypass authentication hoàn toàn            | Luôn verify với certificate đã pin/trust, không trust tự khai |
| Dùng `email` làm unique identifier từ IdP | Email có thể thay đổi → account merge lỗi, account takeover | Dùng `sub` (stable, provider-unique identifier)               |
| Không có break-glass admin account        | IdP down → không ai có thể vào hệ thống quản trị            | Maintain local emergency admin account với MFA                |

**🎯 Interview Pattern:**

- Khi thấy: "enterprise authentication" / "multi-app login" / "SAML/OIDC integration" / "offboarding"
- → Nhớ đến: SSO = centralized IdP, federated trust, single login nhiều app, single revoke point
- → Mở đầu: "SSO tập trung identity tại IdP, giảm password fatigue và đơn giản hóa lifecycle management — trade-off là IdP trở thành single point of failure..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [OIDC](#openid-connect-oidc) — SSO hiện đại dùng OIDC cho federated identity
- ➡️ Để hiểu tiếp: [Authorization Patterns](#authorization-patterns) — sau SSO, cần map IdP claims sang local permissions

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

> 🧠 **Memory Hook:** Authorization = bảng phân công việc nhà máy. Công nhân A phụ trách dây chuyền 1-3 (role), công nhân B chỉ làm buổi sáng khi không hỏng máy (attribute+context). **Không phải ai vào nhà máy cũng làm được mọi việc.**

**Tại sao tồn tại? / Why does this exist?**

Authentication (xác thực "bạn là ai") chỉ là bước đầu. Hệ thống cần biết "bạn được làm gì với resource nào trong điều kiện nào" — đây là bài toán authorization. Một user có thể đọc tài liệu nhưng không được xóa, đọc dữ liệu phòng mình nhưng không phòng khác.
→ **Why?** Business rules phức tạp và đa chiều — phụ thuộc user, resource, action, context, thời gian, và tổ chức.
→ **Why?** Không có model nào "đúng cho tất cả" — mỗi model có trade-off về độ phức tạp, linh hoạt, và khả năng audit.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Trong nhà máy lớn, mỗi công nhân có bảng phân công khác nhau. Anh An là tổ trưởng (RBAC — role), được quản lý dây chuyền 1-5 và tất cả công nhân trong tổ. Chị Bình chỉ được vào kho nếu có phiếu xuất kho và đúng ca làm việc (ABAC — attribute + context). Khi có dự án đặc biệt, bảng phân công cập nhật theo "ai tham gia dự án nào" (ReBAC — quan hệ). Phòng IT quản lý policy tập trung và xuất báo cáo audit (PBAC). Không ai có quyền "tất cả" trừ giám đốc — và ngay cả giám đốc cũng phải qua cổng bảo vệ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
RBAC (Role-Based Access Control):
  User ──assigned──► Role ──has──► Permissions
  Admin  → [read, write, delete, manage_users]
  Editor → [read, write]
  Viewer → [read]
  ✓ Đơn giản, dễ audit  |  ✗ Role explosion khi business complex

ABAC (Attribute-Based Access Control):
  ALLOW if: user.department == resource.department
         AND current_time BETWEEN 09:00 AND 17:00
         AND device.managed == true
  ✓ Linh hoạt, context-aware  |  ✗ Khó debug, policy phức tạp

PBAC (Policy-Based, dùng OPA/Rego):
  App → PEP (enforcement) → PDP (OPA evaluate policy) → allow/deny
  Policy-as-code, version-controlled, centralized
  ✓ Consistent across services  |  ✗ Cần infra, latency

ReBAC (Relationship-Based):
  User ──[owner|editor|viewer]──► Document
  "Nguyễn Văn A là editor của document #42"
  ✓ Phù hợp collaborative apps  |  ✗ Graph query cost
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Role explosion: 50+ roles trong RBAC lớn hơn nhiều so với dự kiến khi business rules phức tạp
- ABAC silent deny — điều kiện không khớp → deny mà không có rõ lý do, khó debug trong production
- OPA fail-open vs fail-closed — nếu OPA down, cho qua hay block? (fail-closed = safer, nhưng impact UX)
- Tenant isolation trong multi-tenant SaaS — authorization phải enforce tenant boundary ở mọi query
- Privilege escalation qua group/claim mapping từ external IdP nếu không có whitelist

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                     | Đúng là                                                        |
| ---------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| Chỉ dùng RBAC cho mọi thứ → role explosion     | 100+ roles = không ai hiểu hết, audit nightmare | Hybrid RBAC (coarse-grained) + ABAC (fine-grained context)     |
| Không log authorization decision (deny)        | Không biết ai bị từ chối gì khi incident xảy ra | Audit log mọi allow/deny với context đủ để reconstruct         |
| Hardcode permission check trong business logic | Khó thay đổi policy khi scale, không consistent | Externalize policy ra PBAC engine (OPA) hoặc dedicated service |

**🎯 Interview Pattern:**

- Khi thấy: "who can access what" / "permission system" / "multi-tenant data isolation" / "RBAC design"
- → Nhớ đến: Spectrum RBAC → ABAC → PBAC → ReBAC; hệ thống lớn thường hybrid
- → Mở đầu: "Authorization là bài toán đa chiều — RBAC cho baseline coarse-grained, ABAC cho context runtime, PBAC để centralize enforcement, ReBAC cho collaborative sharing..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [OAuth 2.0 Scopes](#oauth-20) — scopes là authorization primitive đơn giản nhất
- ➡️ Để hiểu tiếp: [Zero Trust Architecture](#zero-trust-architecture) — ZT dùng continuous authorization, không chỉ one-time check

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

> 🧠 **Memory Hook:** Zero Trust = tòa nhà an ninh tối cao: **không tin ai kể cả người trong nội bộ**. Mỗi lần vào phòng mới phải xuất trình CCCD + mã PIN. Ngồi trong phòng rồi vẫn bị kiểm tra định kỳ.

**Tại sao tồn tại? / Why does this exist?**

Mô hình "tin tưởng mạng nội bộ" (castle-and-moat) thất bại vì attacker có thể đã ở trong mạng — lateral movement sau khi compromise một node. Remote work và cloud phá vỡ ranh giới perimeter network truyền thống.
→ **Why?** Khi nhân viên làm remote hoặc đối tác truy cập cloud, "bên trong firewall" không còn nghĩa là "đáng tin".
→ **Why?** Perimeter security giả định attackers luôn bên ngoài — không đúng trong breach, insider threat, và supply chain attacks.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung văn phòng an ninh tối cao: ngay cả nhân viên lâu năm cũng phải quét thẻ ở mỗi cánh cửa, không phải chỉ một lần ở cổng chính. Vào tòa nhà rồi nhưng muốn vào phòng server phải thêm mã PIN. Muốn truy cập tài liệu mật phải dùng thêm vân tay. Và bảo vệ vẫn nhìn camera kiểm tra hành vi trong suốt thời gian ở trong — không phải "vào rồi thì thôi". Zero Trust áp dụng triết lý này cho hệ thống số: không có "mạng nội bộ đáng tin mặc định" — mọi truy cập đều phải chứng minh.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
3 Nguyên tắc cốt lõi Zero Trust:
  1. Verify Explicitly   — luôn xác minh identity + device + context
  2. Least Privilege     — chỉ cấp đúng quyền tối thiểu cần thiết
  3. Assume Breach       — thiết kế như thể đã bị compromise

Access Decision Flow (mỗi request đều đi qua):
  Request
      │
      ▼
  Identity Verification (IdP + MFA status hiện tại)
      │
      ▼
  Device Posture Check (managed? patched? encrypted? compliant?)
      │
      ▼
  Context Evaluation (location / risk score / data sensitivity / velocity)
      │
      ├─ Insufficient trust ──► Deny / Step-up auth required
      │
      └─ Sufficient trust  ──► Least-privilege access grant
                                      │
                                      ▼
                             Continuous Monitoring
                         (revoke ngay khi risk thay đổi giữa phiên)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Zero Trust là **kiến trúc và triết lý**, không phải sản phẩm — mọi vendor đều gắn nhãn "Zero Trust", cần đánh giá thực chất
- Micro-segmentation giảm blast radius — khi một node bị compromise, không thể lateral move sang node khác
- Service-to-service cần workload identity (mTLS + SPIFFE/SPIRE) — không chỉ áp dụng cho users
- Continuous verification có thể impact UX — cần risk-based thresholds để tránh friction quá mức với user thường
- Migration pragmatic theo 5 giai đoạn — không thể migrate toàn bộ cùng lúc; bắt đầu từ identity centralization + MFA

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                   | Tại sao sai                                                   | Đúng là                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| Mua "Zero Trust product" là xong                          | ZT là kiến trúc không phải sản phẩm; không có silver bullet   | Thiết kế theo principles trước, chọn tooling phù hợp sau |
| Chỉ áp dụng ZT cho user access, bỏ qua service-to-service | Lateral movement vẫn xảy ra qua compromised service           | mTLS + workload identity (SPIFFE) cho service-to-service |
| Continuous monitoring nhưng không có automated response   | Alert mà không action = vô ích khi incident xảy ra 3 giờ sáng | Automate revocation khi risk score vượt threshold        |

**🎯 Interview Pattern:**

- Khi thấy: "network security architecture" / "remote work security" / "microservices security at scale"
- → Nhớ đến: Zero Trust = never trust, always verify, least privilege, assume breach — not a product
- → Mở đầu: "Zero Trust từ bỏ mô hình perimeter — mọi truy cập đều verify identity, device, và context bất kể source. Bắt đầu migrate bằng centralize identity + MFA trước..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Authorization Patterns](#authorization-patterns) — ZT cần fine-grained authz liên tục
- ➡️ Để hiểu tiếp: [Web Security OWASP](./03-web-security-owasp.md) — ZT giảm attack surface cho web threats

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

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                                                           |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔁 Retrieval   | Can I draw the OAuth 2.0 Authorization Code Flow with PKCE step by step — from redirect to token exchange — without looking at notes?                             |
| 2   | 👁️ Visual      | Can I sketch the JWT structure (header.payload.signature) and explain what each part contains, why base64 is not encryption, and where the signature is verified? |
| 3   | 🛠️ Application | Can I compare magic link vs TOTP vs Passkeys — security trade-offs, attack vectors for each, and when to recommend which?                                         |
| 4   | 🐛 Debug       | Given a JWT validation bug where `alg:none` tokens are accepted, can I trace why it happens, what the attacker can do, and how to fix it?                         |
| 5   | 🎓 Teach       | Can I explain to a junior dev why OAuth 2.0 is _authorization_ and OIDC is _authentication_ using a concrete real-world analogy?                                  |

💬 **Feynman Prompt:** Giải thích tại sao "Login with Google" không cho Google biết password của bạn ở Tiki — và điều gì thực sự được truyền giữa Tiki server và Google server.

## Connections / Liên Kết

- ⬅️ **Built on**: [Cryptography](./02-cryptography-and-protocols.md) — JWT uses RS256, PKCE uses SHA-256 hash
- ⬅️ **Built on**: [Security Fundamentals](./01-security-fundamentals.md) — authentication is the first CIA pillar defense
- ➡️ **Applied in**: [BE Auth Security](../../be-track/02-backend-knowledge/04-auth-security.md) — Go implementation of JWT and OAuth
- 🔗 **Related**: [Web Security OWASP](./03-web-security-owasp.md) — broken authentication is OWASP #7
