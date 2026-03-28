# Authentication & Security

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**Grab security incident (2021, public):** Một backend service expose internal API không có authentication vì developer nghĩ "service này chỉ dùng nội bộ". Attacker scan tìm được, gọi thẳng vào endpoint để lấy ride history của driver khác. Fix: mọi service-to-service call đều phải có mTLS + JWT validation, kể cả internal. "Internal" không có nghĩa là "safe".

**Bài học:** Security là defense in depth — không có single layer nào đủ. JWT, mTLS, rate limiting, và audit logging phải kết hợp cùng nhau.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Authentication là thẻ căn cước ("bạn là ai"), Authorization là thẻ nhân viên có in phòng ban ("bạn được vào đâu"). JWT là thẻ có QR code — bảo vệ tự verify được mà không cần gọi về trung tâm. Session token là thẻ vật lý — phải gọi về trung tâm để verify, nhưng có thể thu hồi ngay lập tức.

**Why it matters:** Mọi backend API đều cần authentication. Sai lựa chọn (dùng JWT khi cần revocation, dùng session khi cần stateless scale) gây ra security holes hoặc performance bottlenecks.

## Concept Map / Bản Đồ Khái Niệm

```
[Auth & Security]
        │
        ├── Authentication (Who are you?)
        │     ├── JWT: stateless, self-contained, hard to revoke
        │     ├── Session: stateful, easy revoke, needs session store
        │     └── mTLS: mutual cert validation (service-to-service)
        │
        ├── Authorization (What can you do?)
        │     ├── RBAC: role → permissions
        │     ├── ABAC: attributes (user, resource, environment)
        │     └── OAuth 2.0: delegated authorization (3rd party)
        │
        └── Security Patterns
              ├── Defense in depth: multiple layers
              ├── Least privilege: minimal access
              ├── Secret management: Vault/env vars, rotation
              └── Audit logging: who did what when

```

---

## Overview / Tổng Quan

Authentication & Security là foundation cho mọi backend system — từ internal microservices đến public APIs. File này cover 7 nhóm khái niệm:

| #   | Concept Group                    | Vai trò                                           | Interview Weight |
| --- | -------------------------------- | ------------------------------------------------- | ---------------- |
| 1   | Authentication vs Authorization  | Foundation — "who" vs "what can do"               | ⭐⭐⭐⭐⭐       |
| 2   | Session vs JWT                   | Stateful vs stateless auth — core tradeoff        | ⭐⭐⭐⭐⭐       |
| 3   | OAuth 2.0 & OIDC                 | Delegated authorization, third-party login        | ⭐⭐⭐⭐         |
| 4   | mTLS & API Keys                  | Service-to-service auth, external partner access  | ⭐⭐⭐           |
| 5   | Access Control (RBAC/ABAC)       | Permission models — who accesses what resources   | ⭐⭐⭐⭐         |
| 6   | Password Security & OWASP        | Hashing, common vulnerabilities, defense patterns | ⭐⭐⭐⭐         |
| 7   | CORS, Secrets & Network Security | Browser security, secret rotation, TLS/firewall   | ⭐⭐⭐           |

**Mối quan hệ:** AuthN/AuthZ (1) là foundation → Session/JWT (2) là implementation → OAuth/OIDC (3) extends for 3rd party → mTLS/API Keys (4) cho service-to-service → RBAC/ABAC (5) controls access → OWASP (6) protects against attacks → CORS/Secrets/Network (7) secures infrastructure.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: Authentication vs Authorization

> 🧠 **Memory Hook:** "**AuthN = passport (identity). AuthZ = visa (permissions).** You can have a passport but not be allowed into every country."

**Tại sao tồn tại? / Why does this exist?**

Hệ thống phải biết AI đang gửi request trước khi quyết định họ ĐƯỢC LÀM GÌ — không thể cho phép hoặc từ chối nếu chưa xác minh danh tính.
→ **Why?** Tách AuthN và AuthZ cho phép scale độc lập — identity provider (Keycloak, Auth0) xử lý AuthN, application xử lý AuthZ, hai phần có thể thay đổi mà không ảnh hưởng nhau.
→ **Why?** Zero Trust Architecture yêu cầu xác minh liên tục cả hai — "never trust, always verify" ngay cả trong mạng nội bộ, mọi request đều phải qua cả hai lớp kiểm tra.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn đến một tòa nhà văn phòng lớn. **Authentication** giống như bảo vệ kiểm tra chứng minh thư tại cửa — họ xác nhận _bạn là ai_. **Authorization** giống như thẻ từ nhân viên ghi sẵn "được vào phòng 101, 203, phòng họp tầng 5" — nó xác định _bạn được vào đâu_. Bạn có thể có CMND hợp lệ (đã authenticated) nhưng thẻ từ không có quyền vào phòng server (không authorized) — hai việc hoàn toàn tách biệt!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Mỗi HTTP request đi qua hai middleware tuần tự: AuthN xác minh danh tính, AuthZ kiểm tra quyền dựa trên danh tính đó.

```
HTTP Request
     │
     ▼
┌─────────────────────┐
│   AuthN Middleware  │  ← Verify JWT / Session / mTLS cert
│                     │    Lấy user_id, email từ token
│  Thất bại → 401     │    Inject vào request context
└──────────┬──────────┘
           │ ✓ Biết "bạn là ai"
           ▼
┌─────────────────────┐
│   AuthZ Middleware  │  ← Kiểm tra roles / permissions
│                     │    "user có role 'admin' không?"
│  Thất bại → 403     │    "user có quyền DELETE resource này không?"
└──────────┬──────────┘
           │ ✓ Biết "bạn được làm gì"
           ▼
┌─────────────────────┐
│   Business Logic    │  ← Xử lý request an toàn
└─────────────────────┘

Mã lỗi:
  401 Unauthorized = AuthN thất bại (chưa đăng nhập / token hết hạn)
  403 Forbidden    = AuthZ thất bại (đã đăng nhập nhưng không có quyền)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Internal service có cần auth không?** Có — Grab 2021: internal service không có auth bị attacker scan và khai thác. Mọi service kể cả internal đều phải AuthN/AuthZ.
- **JWT permissions thay đổi sau khi issue?** JWT stateless không cập nhật ngay — user giữ permissions cũ cho đến khi token hết hạn. Dùng short TTL hoặc token versioning để giảm rủi ro.
- **AuthZ check ở đâu?** Bắt buộc phải server-side — ẩn UI button ở client không bảo vệ API endpoint khỏi direct call.
- **Service account?** Service cũng cần danh tính — dùng mTLS cert hoặc client credentials grant, không dùng hardcoded user account.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                    | Đúng là                                                      |
| ------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------ |
| Kết hợp AuthN và AuthZ trong cùng một middleware | Tightly coupled, khó thay đổi logic độc lập                    | Tách thành 2 middleware riêng biệt theo đúng thứ tự          |
| "Internal service không cần auth"                | Grab 2021: network nội bộ không đồng nghĩa với an toàn         | Mọi service đều cần AuthN/AuthZ, kể cả service-to-service    |
| Dùng API key để authenticate user cụ thể         | API key identify applications, không identify individual users | Dùng OAuth/JWT cho user auth, API key cho service-to-service |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "How do you secure a microservice API?" hoặc "Phân biệt 401 vs 403"
- → Nhớ đến: Tách AuthN (xác minh danh tính) vs AuthZ (kiểm tra quyền), middleware chain, defense in depth
- → Mở đầu trả lời: _"Authentication xác minh bạn là ai — qua JWT, session hoặc mTLS — trả về 401 nếu thất bại. Authorization kiểm tra bạn được làm gì — qua RBAC hoặc ABAC — trả về 403 nếu không đủ quyền. Hai việc này phải tách nhau để có thể thay đổi độc lập."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [API Design](./01-api-design.md) — HTTP status codes, request lifecycle, middleware pattern
- ➡️ Để hiểu tiếp: [Session vs JWT](./04-auth-security.md#concept-2-session-vs-jwt) — Cách implement AuthN trong thực tế

### Concept 2: Session vs JWT

> 🧠 **Memory Hook:** "**Session = hotel key card (front desk verifies). JWT = QR code badge (self-verifiable, hard to revoke).**"

**Tại sao tồn tại? / Why does this exist?**

HTTP là stateless — mỗi request hoàn toàn độc lập, server không nhớ bạn là ai từ request trước. Cần cơ chế để duy trì trạng thái đăng nhập giữa các request.
→ **Why?** Session lưu state ở server (Redis) — dễ revoke ngay lập tức nhưng cần shared store khi scale horizontal. JWT lưu state ở client (self-contained) — dễ scale nhưng không thể revoke trước khi hết hạn.
→ **Why?** Hybrid approach ra đời để kết hợp ưu điểm: JWT ngắn hạn (15 phút) + refresh token dài hạn với revocation list — stateless cho phần lớn request, vẫn có thể revoke qua refresh token.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

**Session** giống như thẻ phòng khách sạn vật lý: khi bạn check-in, lễ tân tạo bản ghi trong hệ thống và đưa bạn thẻ chìa khóa. Mỗi lần quẹt thẻ → hệ thống tra cứu → xác nhận. Muốn thu hồi? Lễ tân xóa bản ghi là xong ngay tức thì.

**JWT** giống như thẻ VIP có QR code in đầy đủ thông tin: tên, hạng thẻ, ngày hết hạn — ai quét cũng biết ngay mà không cần gọi lễ tân. Nhưng nếu thẻ bị mất trước hạn, bạn không thể "hủy" nó — phải đợi đến ngày hết hạn in sẵn trên thẻ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Session và JWT có cơ chế xác thực hoàn toàn khác nhau ở điểm then chốt: nơi lưu trữ state và cách verify.

```
SESSION FLOW:
  Client          Server            Redis
    │  POST /login   │                │
    │──────────────> │  Create session │
    │                │────────────────>  {sid:"abc", user:42}
    │  Set-Cookie:   │ <────────────────
    │  sid=abc       │
    │ <────────────  │
    │                │
    │  GET /profile  │
    │  Cookie:sid=abc│
    │──────────────> │  Lookup "abc"  │
    │                │────────────────> {user:42, role:admin}
    │  200 OK        │ <────────────────
    │ <────────────  │

JWT FLOW:
  Client          Server (stateless)
    │  POST /login   │
    │──────────────> │  Sign JWT {user:42, exp:+15min}
    │  JWT token     │  với private key
    │ <────────────  │
    │                │
    │  GET /profile  │
    │  Bearer <JWT>  │
    │──────────────> │  Verify signature locally
    │                │  Check exp, iss, aud
    │  200 OK        │  KHÔNG cần Redis lookup!
    │ <────────────  │

┌────────────────┬──────────────────┬──────────────────┐
│ Tiêu chí        │ Session           │ JWT               │
├────────────────┼──────────────────┼──────────────────┤
│ State           │ Server-side       │ Client-side       │
│ Revoke          │ ✓ Ngay lập tức    │ ✗ Phải đợi exp    │
│ Scale           │ Cần Redis shared  │ Stateless         │
│ Mobile/SPA      │ Khó (cookie)      │ Dễ (header)       │
│ Payload size    │ ~32 bytes ID      │ ~800-2000 bytes   │
└────────────────┴──────────────────┴──────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **JWT payload readable:** JWT chỉ base64-encode, không encrypt — bất kỳ ai cũng đọc được payload. Tuyệt đối không lưu password, số thẻ ngân hàng trong JWT.
- **Token theft window:** JWT bị đánh cắp → attacker dùng được đến khi hết hạn. Giải pháp: TTL ngắn (15 phút) + refresh token rotation.
- **Clock skew:** Các server có thể lệch đồng hồ → JWT bị từ chối sớm. Thường cho phép buffer 30-60 giây.
- **Session store SPOF:** Redis down → tất cả user bị logout. Cần Redis Sentinel/Cluster để high availability.
- **Refresh token theft:** Bị đánh cắp → attacker dùng được nhiều ngày. Token rotation giúp phát hiện: nếu refresh token cũ được dùng lại → revoke toàn bộ token family.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                              | Tại sao sai                                               | Đúng là                                               |
| ---------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------- |
| Lưu sensitive data (password, PII) trong JWT payload | JWT chỉ base64-encoded, ai decode cũng đọc được           | Chỉ lưu user_id, roles, exp — không lưu data nhạy cảm |
| JWT long-lived (24h+) mà không có refresh mechanism  | 24h JWT bị đánh cắp = 24h attacker có full quyền truy cập | Access token 15 phút + refresh token rotation         |
| "JWT bảo mật hơn session"                            | Không có cái nào bảo mật hơn — chỉ là tradeoffs khác nhau | Hiểu tradeoffs và chọn đúng cho use case cụ thể       |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "JWT vs Session — khi nào dùng cái nào?" hoặc "How do you revoke JWT?"
- → Nhớ đến: Stateless vs stateful, revocation challenge, hybrid approach với refresh token rotation
- → Mở đầu trả lời: _"JWT phù hợp cho microservices và mobile vì stateless — mỗi service tự verify mà không cần shared store. Session phù hợp cho monolith web app vì dễ revoke ngay lập tức. Trong thực tế tôi dùng hybrid: JWT ngắn hạn 15 phút kết hợp với refresh token rotation để cân bằng scale và security."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [API Design](./01-api-design.md) — HTTP stateless protocol, cookie và header mechanics
- ➡️ Để hiểu tiếp: [OAuth 2.0 & OIDC](./04-auth-security.md#concept-3-oauth-20--oidc) — OAuth builds on top of token concepts

### Concept 3: OAuth 2.0 & OIDC

> 🧠 **Memory Hook:** "**OAuth 2.0 = valet key (limited access to your car). OIDC = OAuth + ID card (adds identity layer on top).**"

**Tại sao tồn tại? / Why does this exist?**

Người dùng muốn cho phép ứng dụng bên thứ ba truy cập tài nguyên của họ mà không cần chia sẻ password — chia sẻ password là rủi ro catastrophic nếu app đó bị hack.
→ **Why?** OAuth 2.0 tách authorization (cấp quyền truy cập bằng access_token) khỏi authentication — nhưng OAuth 2.0 chỉ xử lý "được làm gì", không xử lý "bạn là ai". OIDC bổ sung id_token để giải quyết vấn đề identity.
→ **Why?** Nhiều grant type cho các scenario khác nhau: Authorization Code (web app có server), Client Credentials (machine-to-machine), PKCE (mobile/SPA không có server) — mỗi loại tối ưu cho threat model riêng.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn thuê căn hộ và cần thợ sửa điện vào nhà trong khi bạn đi làm. **OAuth 2.0** giống như việc bạn cho thợ một chìa khóa phụ chỉ mở được cửa chính — không mở được két sắt hay phòng ngủ. Chìa khóa đó có hạn sử dụng và bạn có thể thu hồi bất cứ lúc nào. **OIDC** giống như chìa khóa phụ đó còn có thêm thẻ ghi tên thợ — bạn biết chính xác ai đã vào nhà, không chỉ biết "cửa đã được mở".

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

Authorization Code Flow là flow an toàn nhất — auth code trao đổi qua server-to-server, client_secret không bao giờ lộ ở browser.

```
User        Browser          Your Server      Auth Server
  │  Click    │                  │                 │
  │ "Login    │                  │                 │
  │ Google"   │                  │                 │
  │──────────>│                  │                 │
  │           │ Redirect to:     │                 │
  │           │ /authorize?      │                 │
  │           │  client_id=xxx   │                 │
  │           │  scope=email     │                 │
  │           │  state=csrf123   │                 │
  │           │─────────────────────────────────> │
  │           │                  │                 │
  │  Consent screen (Allow/Deny?)│                 │
  │ <─────────────────────────────────────────────│
  │  User clicks "Allow"         │                 │
  │──────────────────────────────────────────────>│
  │           │ Redirect:        │                 │
  │           │ /callback?       │                 │
  │           │  code=AUTH_CODE  │                 │
  │           │  state=csrf123   │                 │
  │           │ <───────────────────────────────── │
  │           │  Forward code   │                  │
  │           │─────────────────>│                 │
  │           │                  │ POST /token     │
  │           │                  │ {code,          │
  │           │                  │  client_secret} │
  │           │                  │────────────────>│
  │           │                  │ {access_token,  │
  │           │                  │  id_token}      │
  │           │                  │ <────────────── │

OIDC thêm id_token (JWT chứa identity):
  {"sub":"12345", "email":"user@gmail.com", "name":"Nguyen A"}

OAuth vs OIDC:
  OAuth 2.0  → access_token (what can you do?)
  OIDC       → access_token + id_token (who are you? + what can you do?)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Implicit flow deprecated:** Implicit flow trả token thẳng trong URL fragment → bị log, bị leak qua Referer header. Luôn dùng Authorization Code + PKCE cho SPA/mobile.
- **redirect_uri validation:** Không validate redirect_uri → open redirect → attacker chuyển auth code về domain của họ → token theft. Phải exact-match với registered URI.
- **state parameter:** Phải verify state khi nhận callback — nếu không có, CSRF attack có thể inject authorization code.
- **PKCE cho public clients:** SPA và mobile app không thể giữ client_secret an toàn — PKCE thay thế bằng code_verifier/code_challenge.
- **Token audience (aud) validation:** access_token cho service A không được dùng ở service B — phải check aud claim.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                                | Đúng là                                                     |
| ----------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Dùng Implicit flow cho SPA năm 2024 | Deprecated — token lộ trong URL, bị log bởi browser history và server logs | Dùng Authorization Code + PKCE cho mọi public client        |
| Không validate redirect_uri         | Open redirect: attacker đăng ký domain giống thật để nhận auth code        | Exact-match redirect_uri với danh sách whitelist đã đăng ký |
| Nhầm OAuth 2.0 là authentication    | OAuth 2.0 chỉ là authorization framework — không verify danh tính user     | Dùng OIDC (OAuth 2.0 + id_token) nếu cần authentication     |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Implement 'Login with Google'" hoặc "OAuth 2.0 grant types"
- → Nhớ đến: Authorization Code flow, PKCE cho public clients, OIDC cho identity, state parameter cho CSRF
- → Mở đầu trả lời: _"Tôi sẽ dùng OIDC Authorization Code flow với PKCE. User được redirect đến Google, sau khi consent, auth code được gửi về callback endpoint của server. Server exchange code lấy access_token và id_token — id_token chứa identity user, access_token dùng để gọi Google APIs."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Session vs JWT](./04-auth-security.md#concept-2-session-vs-jwt) — Token concepts, JWT structure
- ➡️ Để hiểu tiếp: [mTLS & API Keys](./04-auth-security.md#concept-4-mtls--api-keys) — Service-to-service auth alternatives

### Concept 4: mTLS & API Keys

> 🧠 **Memory Hook:** "**mTLS = both show IDs (mutual). API Key = membership card (identifies app, not person).**"

**Tại sao tồn tại? / Why does this exist?**

Giao tiếp service-to-service cần authentication mà không có user context — không có ai "đăng nhập", chỉ có hai service cần tin tưởng lẫn nhau.
→ **Why?** mTLS cung cấp strong identity qua X.509 certificates và mã hóa đường truyền — cả hai service đều verify cert của nhau, không thể giả mạo danh tính. API keys đơn giản hơn nhưng yếu hơn — chỉ identify ứng dụng, không mã hóa.
→ **Why?** Service mesh (Istio, Linkerd) giải quyết complexity của mTLS: tự động issue/rotate certificates, inject sidecar proxy, ứng dụng không cần biết về mTLS — zero-config security cho toàn bộ internal traffic.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

**TLS thông thường** giống như bạn đến ngân hàng: nhân viên ngân hàng phải đeo bảng tên có logo ngân hàng (server certificate), nhưng nhân viên không cần xác minh bạn là ai trước khi nói chuyện.

**mTLS** giống như cuộc họp bí mật giữa hai đặc vụ: cả hai phải xuất trình thẻ đặc vụ của mình trước khi bắt đầu trao đổi thông tin. Nếu một bên không có thẻ hợp lệ, cuộc họp không diễn ra. Đây là lý do mTLS là tiêu chuẩn trong microservices — mọi service đều phải "chứng minh mình là ai" trước khi được phục vụ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

TLS một chiều chỉ client verify server. mTLS thêm bước server verify client bằng client certificate.

```
TLS một chiều (HTTPS thông thường):
  Client                        Server
    │  ← Server Certificate ──── │  Server gửi cert
    │  Client verify:             │
    │  "Cert có phải của          │
    │   server.com thật không?"   │
    │  ✓ Trust channel            │  Client KHÔNG cần cert

mTLS (hai chiều):
  Client                        Server
    │  ← Server Certificate ──── │  Server gửi cert
    │  Client verify server cert  │
    │  ─── Client Certificate ─> │  Client cũng gửi cert
    │                             │  Server verify client cert
    │  ✓ Cả hai đã xác minh nhau  │

API Key (đơn giản hơn, yếu hơn):
  Service A                    Service B
    │  GET /internal/data         │
    │  X-API-Key: sk_svc_abc123   │
    │───────────────────────────> │  Lookup key trong DB/config
    │                             │  → Client "ServiceA" → rate limit OK
    │  200 OK                     │
    │ <─────────────────────────  │

So sánh:
  │            │ mTLS              │ API Key          │
  │────────────│──────────────────│──────────────────│
  │ Encryption │ ✓ Built-in        │ ✗ Cần TLS riêng  │
  │ Identity   │ X.509 cert        │ String token      │
  │ Revocation │ CRL/OCSP          │ Xóa khỏi DB       │
  │ Complexity │ High (cert mgmt)  │ Low               │
  │ Use case   │ Internal S2S      │ External partners │
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Certificate expiry outage:** mTLS cert hết hạn → service reject kết nối → outage. Phải có auto-rotation và alert trước khi hết hạn.
- **CA compromise:** Nếu Certificate Authority bị compromise, attacker có thể issue cert giả. Certificate pinning hoặc private CA giảm rủi ro này.
- **API key in logs:** API key trong query parameter bị ghi vào access log, server log, CDN log → leak. Luôn dùng header, không dùng query param.
- **mTLS trong service mesh:** Istio/Linkerd tự động inject sidecar proxy xử lý mTLS — application code hoàn toàn không cần thay đổi.
- **SPIFFE/SPIRE:** Standard để cấp phát cryptographic identity cho workloads — phần nền tảng của Zero Trust architecture.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                | Tại sao sai                                                                          | Đúng là                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Dùng API key là authentication duy nhất cho production | API key dễ leak qua logs, source code, shared configs — không có encryption built-in | Kết hợp API key với TLS, thêm mTLS cho critical internal services    |
| Không rotate mTLS certificates                         | Cert hết hạn = service outage; cert bị compromise = không thu hồi được               | Auto-rotation (Vault PKI, cert-manager) + alert 30 ngày trước expiry |
| Đặt API key trong URL query parameter                  | URL bị log bởi browser history, server access log, reverse proxy                     | Dùng custom header (X-API-Key) hoặc Authorization header             |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "How do microservices authenticate each other?" hoặc "Zero Trust internal network"
- → Nhớ đến: mTLS cho strong mutual identity + encryption, API keys cho external partners, service mesh cho automation
- → Mở đầu trả lời: _"Với internal microservices tôi dùng mTLS qua service mesh như Istio — tự động issue và rotate certificates, không cần thay đổi application code. Với external partners, API key kết hợp với TLS và rate limiting. mTLS đảm bảo cả hai service xác minh nhau, không chỉ một chiều."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Microservices](./02-microservices.md) — Service mesh, sidecar pattern, internal communication
- ➡️ Để hiểu tiếp: [Access Control RBAC/ABAC](./04-auth-security.md#concept-5-access-control-rbacabac) — Sau khi authenticate, cần authorize

### Concept 5: Access Control (RBAC/ABAC)

> 🧠 **Memory Hook:** "**RBAC = job title determines access. ABAC = context determines access (who + what + when + where).**"

**Tại sao tồn tại? / Why does this exist?**

Sau khi biết bạn là ai (AuthN), hệ thống cần quyết định bạn được làm gì với resource nào — cần mô hình kiểm soát quyền truy cập linh hoạt và có thể audit.
→ **Why?** RBAC (role-based) đơn giản và dễ hiểu nhưng coarse-grained — không thể diễn đạt "bác sĩ chỉ xem hồ sơ bệnh nhân trong ca trực của mình". ABAC (attribute-based) xử lý được các policy phức tạp dựa trên attributes của user, resource và môi trường.
→ **Why?** Policy engines như OPA/Casbin tách logic authorization khỏi application code — policy thay đổi không cần redeploy service, có thể audit policy independently, enable zero-trust authorization.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

**RBAC** giống như hệ thống thẻ nhân viên trong bệnh viện theo chức vụ: bác sĩ được vào phòng bệnh nhân, y tá được vào kho thuốc, kế toán được vào phòng tài chính. Đơn giản và rõ ràng, nhưng không xử lý được "bác sĩ khoa A không được vào hồ sơ bệnh nhân khoa B".

**ABAC** giống như hệ thống bảo mật thông minh hơn: tự hỏi nhiều câu trước khi mở cửa — "Người này có phải bác sĩ không? Bệnh nhân này có thuộc khoa của họ không? Hiện tại có trong giờ làm việc không? IP có phải từ mạng bệnh viện không?" — chỉ khi tất cả điều kiện thỏa mãn mới cho vào.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

RBAC và ABAC có cấu trúc quyết định rất khác nhau — RBAC tra bảng role, ABAC evaluate policy.

```
RBAC — Role-Based Access Control:
  User ──has──> Role ──has──> Permission
  Alice ──────> Admin ──────> [create:user, delete:user, read:report]
  Bob   ──────> Editor ─────> [read:report, write:report]
  Carol ──────> Viewer ─────> [read:report]

  Request: Alice DELETE /users/42
  Check: Alice → Admin → has delete:user → ALLOW ✓

ABAC — Attribute-Based Access Control:
  Request: Dr.Nguyen GET /records/patient-456

  Subject attrs:   {role: doctor, dept: cardio, shift: morning}
  Resource attrs:  {type: record, dept: cardio, sensitivity: 2}
  Environment:     {time: 09:30, ip: 10.0.1.5 (internal)}

  Policy evaluation:
  ┌──────────────────────────────────────────────────┐
  │ IF subject.role == "doctor"                      │
  │ AND subject.dept == resource.dept                │
  │ AND subject.clearance >= resource.sensitivity    │
  │ AND environment.time BETWEEN "08:00"-"18:00"     │
  │ AND environment.ip IN internal_ranges            │
  │ THEN ALLOW                                       │
  │ ELSE DENY                                        │
  └──────────────────────────────────────────────────┘
  → ALLOW (tất cả conditions thỏa mãn)

OPA (Open Policy Agent) Policy Engine:
  Application ──query──> OPA ──evaluate──> ALLOW/DENY
  (Rego policy)          (Sidecar hoặc        (+ reason)
                          embedded)
  Policy thay đổi → reload OPA, không cần redeploy app
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Role explosion:** RBAC với 100+ roles trở nên unmanageable — khó audit, khó onboard nhân viên mới. Khi vượt ~20 roles, cân nhắc chuyển sang ABAC hoặc hybrid.
- **Multi-tenant isolation:** RBAC đơn giản không đủ cho multi-tenant — user A không được xem data của tenant B dù cùng role "admin". Cần thêm tenant_id vào mọi policy check.
- **Policy hot-reload:** OPA cho phép reload policy mà không restart service — critical cho production system cần thay đổi policy nhanh.
- **Least privilege audit:** Định kỳ review xem role/permission nào không được dùng và remove — blast radius giảm khi account bị compromise.
- **ReBAC cho hierarchical data:** Google Drive model — folder permission kế thừa xuống document. RBAC/ABAC không diễn đạt tự nhiên, cần ReBAC (SpiceDB, OpenFGA).

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                                             | Đúng là                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Role explosion — tạo quá nhiều roles (100+) | Unmanageable, khó audit, không ai hiểu hết roles                        | Dùng ABAC hoặc hybrid khi hệ thống phức tạp hơn                     |
| Hardcode permissions trong application code | Policy thay đổi phải redeploy; khó audit; không nhất quán giữa services | Dùng policy engine (OPA/Casbin) để externalize authorization logic  |
| Admin role cho tất cả developer             | Blast radius lớn khi account bị compromise — admin có thể làm mọi thứ   | Áp dụng least privilege: chỉ cấp đúng quyền cần thiết cho từng role |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Design permission system for multi-tenant SaaS" hoặc "RBAC vs ABAC"
- → Nhớ đến: RBAC đơn giản/coarse → ABAC flexible/complex → OPA externalize policy → ReBAC cho hierarchical
- → Mở đầu trả lời: _"Tôi bắt đầu với RBAC cho các role cơ bản — admin, member, viewer. Khi cần tenant isolation hoặc context-based decisions như 'chỉ được edit resource của mình', tôi thêm ABAC attributes. Với hệ thống phức tạp, tôi externalize authorization vào OPA để policy có thể thay đổi mà không cần redeploy."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Authentication vs Authorization](./04-auth-security.md#concept-1-authentication-vs-authorization) — AuthZ là nền tảng của access control
- ➡️ Để hiểu tiếp: [Password Security & OWASP](./04-auth-security.md#concept-6-password-security--owasp) — Bảo vệ credentials và chống attack

### Concept 6: Password Security & OWASP

> 🧠 **Memory Hook:** "**bcrypt/argon2 = slow by design (10+ rounds). OWASP Top 10 = security exam syllabus.**"

**Tại sao tồn tại? / Why does this exist?**

Password lưu plaintext hoặc hash yếu (MD5/SHA1) là thảm họa khi có data breach — hàng triệu tài khoản bị compromise ngay lập tức vì attacker có thể crack offline với GPU farm.
→ **Why?** bcrypt thêm salt ngẫu nhiên + cost factor (cố tình chậm) — brute force từ tốc độ hàng tỷ/giây xuống còn vài hash/giây. Argon2id thêm memory-hardness — GPU thiếu RAM để parallelize, resists ASIC/FPGA attacks.
→ **Why?** OWASP Top 10 codify các lỗ hổng phổ biến nhất trong web applications — SQL Injection, Broken Auth, XSS, SSRF — mỗi vulnerability đều có root cause và defense pattern cụ thể, là "syllabus bắt buộc" cho mọi developer.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn cần khóa một chiếc két sắt chứa chìa khóa dự phòng (password hash). **MD5/SHA256** giống như ổ khóa số 4 chữ số — kẻ trộm có thiết bị chuyên dụng thử được 10 tỷ combination/giây, phá trong vài giây. **bcrypt/argon2** giống như ổ khóa sinh học đòi hỏi nhận diện vân tay + quét mống mắt + thêm 250ms xử lý mỗi lần thử — kẻ trộm thử nhanh nhất cũng chỉ được vài lần mỗi giây, brute force không khả thi trong cuộc đời người.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

bcrypt và argon2id cố tình chậm và sử dụng salt để chống brute force và rainbow table attacks.

```
SHA256 (NGUY HIỂM cho password):
  hash("password123") = ef92b778ba... (luôn giống nhau)
  GPU: ~5 tỷ hash/giây
  → Brute force 8 ký tự: vài giờ

bcrypt (AN TOÀN):
  bcrypt("password123", cost=12):
    1. Tạo random salt (16 bytes)
    2. Mở rộng key theo cost factor (2^12 = 4096 vòng lặp)
    3. Output: $2a$12$<22-char-salt><31-char-hash>
  Tốc độ: ~250ms/hash trên modern CPU
  GPU: ~1000 hash/giây (không parallelize tốt)
  → Brute force 8 ký tự: ~79 NĂM

Argon2id (TỐT NHẤT 2024):
  argon2id("password123",
    time=3,        // 3 vòng lặp
    memory=65536,  // 64MB RAM per hash
    parallelism=4  // 4 threads
  )
  → GPU thiếu RAM → không thể run nhiều threads song song
  → ASIC/FPGA không có lợi thế về memory

OWASP Top 10 Defense Map:
  ┌─────────────────────────────────────────────────────┐
  │ A01: Broken Access Control  → AuthZ checks server-side │
  │ A02: Cryptographic Failures → bcrypt/argon2, TLS     │
  │ A03: Injection              → Parameterized queries  │
  │ A07: Auth Failures          → MFA, short JWT TTL     │
  │ A09: Security Logging Failures → Audit logs          │
  └─────────────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **bcrypt 72-byte limit:** bcrypt chỉ xử lý 72 bytes đầu tiên của password — password dài hơn bị truncate. Argon2id không có giới hạn này.
- **Cost factor tuning:** Tăng cost factor khi hardware mạnh hơn — mục tiêu là ~100-250ms per hash. Quá nhanh = insecure, quá chậm = bad UX/DoS risk.
- **Pre-hashing risk:** Một số người hash password bằng SHA256 trước rồi mới bcrypt — SHA256 output là hex/bytes, không có entropy vấn đề, nhưng tạo thêm complexity không cần thiết.
- **OWASP không đủ:** Framework có thể mitigate nhiều OWASP issues nhưng không phải tất cả — developer vẫn cần hiểu để viết code đúng.
- **SQL Injection qua ORM:** ORM không miễn nhiễm — raw query, string interpolation trong ORM vẫn có thể bị injection.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                                                                              | Đúng là                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Dùng SHA256/MD5 để hash password | Fast hash = fast brute force — GPU crack được trong vài giờ                              | Dùng bcrypt (cost≥12) hoặc argon2id cho password hashing         |
| Không salt passwords             | Rainbow table: attacker precompute hash của triệu passwords phổ biến, tra lookup ngay    | bcrypt/argon2 tự động embed random salt — không cần làm thủ công |
| "Framework xử lý hết OWASP rồi"  | Framework mitigate nhưng không eliminate — raw queries, custom serializers vẫn có thể bị | Hiểu OWASP Top 10 và review code với security mindset            |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "How do you store passwords securely?" hoặc "Giải thích SQL Injection / XSS"
- → Nhớ đến: bcrypt/argon2 + salt + cost factor, OWASP Top 10 với defense patterns tương ứng
- → Mở đầu trả lời: _"Tôi dùng argon2id với memory=64MB, time=3 — đây là winner của Password Hashing Competition. Lý do không dùng SHA256 là vì fast hash cho phép GPU brute force hàng tỷ lần/giây. argon2id thêm memory-hardness nên GPU không thể parallelize hiệu quả."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Authentication vs Authorization](./04-auth-security.md#concept-1-authentication-vs-authorization) — Credential là gì, tại sao phải bảo vệ
- ➡️ Để hiểu tiếp: [CORS, Secrets & Network Security](./04-auth-security.md#concept-7-cors-secrets--network-security) — Bảo vệ infrastructure xung quanh

### Concept 7: CORS, Secrets & Network Security

> 🧠 **Memory Hook:** "**CORS = browser's bouncer (checks origin). Secrets = rotate like passwords (never hardcode).**"

**Tại sao tồn tại? / Why does this exist?**

Browsers enforce same-origin policy — nhưng modern apps cần gọi APIs cross-origin (SPA frontend gọi backend API khác domain).
→ **Why?** Nếu không có CORS, browser block mọi cross-origin request — nhưng `Access-Control-Allow-Origin: *` lại mở toàn bộ, tạo lỗ hổng.
→ **Why?** Secrets (API keys, DB passwords) bị leak trong code là breach ngay lập tức — cần centralized management + auto rotation.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

CORS giống như bảo vệ chung cư: cư dân (same-origin) ra vào tự do, nhưng khách (cross-origin) phải gọi intercom trước. Bảo vệ gọi lên hỏi chủ nhà "có cho vào không?" (preflight OPTIONS). Nếu chủ nhà đồng ý specific guests, bảo vệ mở cổng. `Allow-Origin: *` = bỏ bảo vệ, ai cũng vào. Secrets management giống két sắt ngân hàng: không giấu tiền dưới gối (hardcode) mà gửi ngân hàng (Vault), có khóa điện tử (auto rotation) và camera (audit log).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
CORS Preflight Flow:
Browser                        Server
  │                              │
  ├─── OPTIONS /api/data ───────►│
  │    Origin: https://app.com   │
  │    Access-Control-Request-   │
  │      Method: POST            │
  │    Access-Control-Request-   │
  │      Headers: Authorization  │
  │                              │
  │◄── 204 No Content ─────────┤
  │    Access-Control-Allow-     │
  │      Origin: https://app.com │
  │    Access-Control-Allow-     │
  │      Methods: GET,POST       │
  │    Access-Control-Max-Age:   │
  │      86400                   │
  │                              │
  ├─── POST /api/data ─────────►│
  │    Origin: https://app.com   │
  │◄── 200 OK ─────────────────┤

Secrets Management Architecture:
┌─────────┐     ┌──────────┐     ┌─────────────┐
│   App   │────►│  Vault   │────►│   KMS/HSM   │
│         │◄────│  Server  │◄────│  (encrypt)  │
└─────────┘     └──────────┘     └─────────────┘
     │               │
     │          ┌────┴────┐
     │          │ Audit   │
     │          │ Log     │
     │          └─────────┘
     │
  Dynamic secrets:
  1. App requests DB credentials
  2. Vault generates unique creds
  3. Vault sets TTL (e.g., 1 hour)
  4. App uses creds → auto-expire
  5. No static passwords anywhere
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- `Access-Control-Allow-Credentials: true` + `Allow-Origin: *` → browser REJECT — phải specify exact origin
- Preflight cache (`Max-Age`) quá dài → origin policy change không apply ngay; quá ngắn → preflight mỗi request tăng latency
- Vault single point of failure — nếu Vault down, app không lấy được secrets; cần caching strategy + HA deployment
- Kubernetes secrets are base64 encoded, NOT encrypted by default — cần enable encryption at rest + use external secret operators

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                                                         | Đúng là                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `Access-Control-Allow-Origin: *` với credentials | Browser reject combo này, nhưng dev thường bypass bằng proxy rồi quên fix — production vẫn wildcard | Specify exact allowed origins, dùng allowlist check dynamic           |
| Hardcode secrets trong environment variables     | Env vars visible trong process listing, container inspect, và CI logs — không phải "secure"         | Dùng Vault/KMS + inject at runtime, rotate automatically              |
| "HTTPS là đủ cho security"                       | HTTPS chỉ encrypt transport — không chống SSRF, injection, hay stolen tokens                        | Defense-in-depth: TLS + WAF + input validation + auth + rate limiting |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi "How do you manage secrets in production?" → Nhớ đến HashiCorp Vault / AWS Secrets Manager
- Mở đầu: "Tôi dùng centralized secrets management với dynamic secrets — never static credentials in code or env vars"

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Password Security & OWASP](./04-auth-security.md#concept-6-password-security--owasp) — Hiểu attack vectors để biết tại sao cần defense-in-depth
- ➡️ Để hiểu tiếp: [API Design](./01-api-design.md) — CORS headers là phần quan trọng của API security configuration

---

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

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                                             |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | JWT gồm 3 phần gì? Khi nào dùng Session-based auth thay vì JWT? Nêu 3 điểm khác biệt chính.                                                         |
| 2   | 🎨 Visual      | Vẽ OAuth 2.0 Authorization Code flow với PKCE — đánh số từng bước từ user click "Login with Google" đến nhận access token.                          |
| 3   | 🛠️ Application | Implement middleware kiểm tra JWT token trong Go: verify signature, check expiry, extract claims, handle refresh token rotation.                    |
| 4   | 🐛 Debug       | User bị logout random sau 15 phút dù refresh token còn valid — trace qua JWT expiry, Redis session store, load balancer sticky session. Root cause? |
| 5   | 🎓 Teach       | Giải thích cho junior: tại sao bcrypt tốt hơn SHA256 cho password hashing? Dùng ví dụ brute-force attack với cost factor.                           |

💬 **Feynman Prompt:** Giải thích cho một frontend developer tại sao không nên lưu JWT trong localStorage, và thiết kế luồng auth hoàn chỉnh với HttpOnly cookie + refresh token rotation — vẽ diagram cho từng bước.

### 📅 Spaced Repetition Schedule

| Round | When          | Focus                                                      |
| ----- | ------------- | ---------------------------------------------------------- |
| 1     | Day 1 (today) | Read all Memory Hooks, answer Self-Check from memory       |
| 2     | Day 3         | Redo 🟢 Q&As, review JWT anatomy and OAuth flows           |
| 3     | Day 7         | Redo 🟡 Q&As, whiteboard OAuth 2.0 Authorization Code flow |
| 4     | Day 14        | Full Cold Call simulation, tackle 🔴 Q&As                  |
| 5     | Day 30        | Mock interview: design auth system for multi-tenant SaaS   |

## Interview Q&A Summary / Tổng Hợp Q&A Phỏng Vấn

| #   | Question                              | Difficulty | Core Concept   | Key Signal                                           |
| --- | ------------------------------------- | ---------- | -------------- | ---------------------------------------------------- |
| 1   | AuthN vs AuthZ?                       | 🟢         | Foundation     | Identity vs permissions, separate concerns           |
| 2   | Session-based auth hoạt động thế nào? | 🟢         | Session        | Server-side store, session ID in cookie              |
| 3   | Session security vulnerabilities?     | 🟡         | Session        | Fixation, hijacking, CSRF, HttpOnly+Secure           |
| 4   | Distributed session management?       | 🟡         | Session        | Redis/Memcached, sticky sessions tradeoff            |
| 5   | JWT structure và cách hoạt động?      | 🟢         | JWT            | Header.Payload.Signature, base64, stateless          |
| 6   | JWT vs Session tradeoffs?             | 🟡         | JWT            | Stateless/scale vs revocation/size                   |
| 7   | JWT security best practices?          | 🟡         | JWT            | Short TTL, refresh token, RS256 for microservices    |
| 8   | HS256 vs RS256?                       | 🟡         | JWT            | Symmetric=shared secret, Asymmetric=public/private   |
| 9   | JWT revocation strategies?            | 🔴         | JWT            | Blacklist, short TTL, token versioning               |
| 10  | OAuth 2.0 grant types?                | 🟢         | OAuth          | Auth Code, Client Credentials, PKCE                  |
| 11  | Authorization Code flow?              | 🟡         | OAuth          | Code→token exchange, redirect_uri, state param       |
| 12  | OAuth security threats?               | 🔴         | OAuth          | CSRF, open redirect, token leakage                   |
| 13  | OIDC vs OAuth 2.0?                    | 🟡         | OIDC           | OIDC adds id_token, userinfo endpoint                |
| 14  | OIDC flows?                           | 🟡         | OIDC           | Same as OAuth + id_token, nonce validation           |
| 15  | API Key design?                       | 🟢         | API Keys       | Identify app not user, rate limiting, hashed storage |
| 16  | API Key security?                     | 🟡         | API Keys       | Rotation, scoping, never in URLs                     |
| 17  | mTLS hoạt động thế nào?               | 🟡         | mTLS           | Mutual cert validation, X.509, service mesh          |
| 18  | mTLS implementation?                  | 🔴         | mTLS           | Cert generation, CA, rotation, SPIFFE                |
| 19  | RBAC implementation?                  | 🟢         | Access Control | Role→permissions mapping, middleware check           |
| 20  | RBAC vs ABAC vs ReBAC?                | 🟡         | Access Control | Role=simple, Attribute=flexible, Relation=graph      |
| 21  | Policy engine (OPA)?                  | 🔴         | Access Control | Rego language, sidecar pattern, decision logs        |
| 22  | Password hashing?                     | 🟢         | Password       | bcrypt/argon2, salt, cost factor                     |
| 23  | Password security patterns?           | 🟡         | Password       | Rate limiting, breached password check, MFA          |
| 24  | OWASP Top 10?                         | 🟢         | OWASP          | Injection, broken auth, XSS, SSRF                    |
| 25  | SQL injection prevention?             | 🟢         | OWASP          | Parameterized queries, ORM, input validation         |
| 26  | XSS prevention?                       | 🟡         | OWASP          | Output encoding, CSP, HttpOnly cookies               |
| 27  | SSRF prevention?                      | 🟡         | OWASP          | URL allowlist, no internal access, metadata block    |
| 28  | CORS mechanism?                       | 🟢         | CORS           | Preflight OPTIONS, origin validation, credentials    |
| 29  | CORS misconfiguration?                | 🟡         | CORS           | Wildcard origin, credentials exposure                |
| 30  | Secrets management?                   | 🟢         | Secrets        | Vault/KMS, rotation, never in code                   |
| 31  | Network security layers?              | 🟡         | Network        | TLS, VPN, firewall, WAF, defense-in-depth            |
| 32  | Zero Trust architecture?              | 🔴         | Network        | Never trust, always verify, micro-segmentation       |

**Distribution:** 🟢 12 | 🟡 15 | 🔴 5

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "A user reports they were logged out unexpectedly. How do you debug this?"

**30-Second Answer:**
"I'd check three things: (1) Token expiry — if using JWT, the access token may have expired and the refresh token flow failed. Check refresh token validity and any blacklist. (2) Session invalidation — if session-based, check if Redis evicted the session (memory pressure) or if a deployment cleared the session store. (3) Security event — check audit logs for suspicious activity that triggered forced logout (IP change, concurrent sessions limit). I'd also check if the load balancer is sending requests to different instances without shared session store."

**Follow-up:** "How would you design a system to prevent this while maintaining security?"
→ "Short-lived JWT (15min) + long-lived refresh token (7 days) stored in HttpOnly cookie. Refresh token rotation on use — each refresh issues new pair. Redis blacklist for revoked refresh tokens. This gives stateless verification for most requests while maintaining revocation capability."

## Connections / Liên Kết

**Same track (be-track):**

- ↔️ [API Design](./01-api-design.md) — Auth headers, rate limiting, API key patterns
- ↔️ [Microservices](./02-microservices.md) — Service-to-service auth, service mesh mTLS
- ↔️ [Distributed Systems](./03-distributed-systems.md) — Stateless auth (JWT) for horizontal scaling
- ↔️ [Networking](./06-networking-go.md) — TLS, HTTPS, certificate management
- ↔️ [Resilience Patterns](./07-resilience-patterns.md) — Rate limiting, circuit breaker for auth services

**Cross-track:**

- 🔗 [Go Concurrency](../01-golang/03-concurrency.md) — Context propagation for auth tokens in goroutines
- 🔗 [Database Advanced](../03-database-advanced/01-sql-fundamentals.md) — Parameterized queries prevent SQL injection
- 🔗 [System Design](../04-be-system-design/01-design-framework.md) — Auth as cross-cutting concern in system design
