# Web Security & OWASP Top 10 (2021) — Bảo mật web và OWASP Top 10
> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `fe-track/modules/08-security.md`, `be-track/02-backend-knowledge/04-auth-security.md`

---

## 1. OWASP Top 10 (2021) Overview

### 🟢 Q: What is OWASP Top 10? `[Junior]`

**A:** Danh sách 10 nhóm rủi ro bảo mật web phổ biến nhất, dùng để ưu tiên hardening và training.

| Mục tiêu | Ý nghĩa |
|---------|--------|
| Awareness | Đồng bộ ngôn ngữ security trong team |
| Prioritization | Ưu tiên fix risk có impact cao |
| Interview baseline | Nền cho câu hỏi bảo mật web phổ biến |

---

## 2. A01:2021 – Broken Access Control — Lỗi kiểm soát truy cập

### 🟢 Q: What is A01:2021 – Broken Access Control? `[Junior]`

**A:** Lỗi kiểm soát truy cập là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 3. A02:2021 – Cryptographic Failures — Thất bại mật mã

### 🟢 Q: What is A02:2021 – Cryptographic Failures? `[Junior]`

**A:** Thất bại mật mã là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 4. A03:2021 – Injection — Lỗi chèn mã

### 🟢 Q: What is A03:2021 – Injection? `[Junior]`

**A:** Lỗi chèn mã là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 5. A04:2021 – Insecure Design — Thiết kế không an toàn

### 🟢 Q: What is A04:2021 – Insecure Design? `[Junior]`

**A:** Thiết kế không an toàn là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 6. A05:2021 – Security Misconfiguration — Cấu hình bảo mật sai

### 🟢 Q: What is A05:2021 – Security Misconfiguration? `[Junior]`

**A:** Cấu hình bảo mật sai là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 7. A06:2021 – Vulnerable and Outdated Components — Thành phần lỗi thời/có lỗ hổng

### 🟢 Q: What is A06:2021 – Vulnerable and Outdated Components? `[Junior]`

**A:** Thành phần lỗi thời/có lỗ hổng là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 8. A07:2021 – Identification and Authentication Failures — Lỗi định danh và xác thực

### 🟢 Q: What is A07:2021 – Identification and Authentication Failures? `[Junior]`

**A:** Lỗi định danh và xác thực là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 9. A08:2021 – Software and Data Integrity Failures — Lỗi toàn vẹn phần mềm và dữ liệu

### 🟢 Q: What is A08:2021 – Software and Data Integrity Failures? `[Junior]`

**A:** Lỗi toàn vẹn phần mềm và dữ liệu là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 10. A09:2021 – Security Logging and Monitoring Failures — Thiếu logging/monitoring bảo mật

### 🟢 Q: What is A09:2021 – Security Logging and Monitoring Failures? `[Junior]`

**A:** Thiếu logging/monitoring bảo mật là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 11. A10:2021 – Server-Side Request Forgery (SSRF) — SSRF

### 🟢 Q: What is A10:2021 – Server-Side Request Forgery (SSRF)? `[Junior]`

**A:** SSRF là nhóm rủi ro khi ứng dụng thiếu kiểm soát quan trọng, tạo đường cho attacker vượt trust boundary.

### 🟡 Q: How does the attack usually work? `[Mid]`

**A:** Reconnaissance → tìm entry point → exploit → mở rộng quyền hoặc đọc dữ liệu → che giấu dấu vết.

### 🟡 Q: Give one realistic example `[Mid]`

**A:** Endpoint nội bộ bị expose hoặc validation không chặt, attacker chain nhiều lỗ hổng nhỏ để đạt impact lớn.

### 🟡 Q: Prevention techniques? `[Mid]`

1. Least privilege + deny by default
2. Input validation + output encoding
3. Hardened config và security headers
4. Logging + alerting + runbook
5. Dependency patching thường xuyên

### 🔴 Q: Vulnerable vs secure snippet `[Senior]`

```js
// ❌ vulnerable
app.get('/item/:id', async (req, res) => {
  const item = await db.items.findById(req.params.id)
  res.json(item)
})

// ✅ secure
app.get('/item/:id', async (req, res) => {
  validateId(req.params.id)
  const item = await db.items.findById(req.params.id)
  authorize(req.user, 'item:read', item)
  res.json(item)
})
```

```go
// ✅ safe parameterized query
row := db.QueryRowContext(ctx, "SELECT * FROM users WHERE email=$1", email)
```

---

## 12. XSS Deep Dive — Stored, Reflected, DOM-based

### 🟢 Q: What are XSS variants? `[Junior]`

| Type | Mô tả |
|------|------|
| Stored | Payload lưu trong DB và phát tán |
| Reflected | Payload phản chiếu ngay trong response |
| DOM-based | Payload xử lý/chạy ở client-side DOM |

### 🟡 Q: How to prevent XSS effectively? `[Mid]`

1. Output encoding đúng context
2. Tránh `innerHTML` với untrusted input
3. Sanitizer cho rich text
4. CSP với nonce/hash
5. HttpOnly cookies để giảm token theft impact

### 🔴 Q: Vulnerable vs secure DOM code `[Senior]`

```js
// ❌ vulnerable
const q = new URLSearchParams(location.search).get('q')
result.innerHTML = 'Search: ' + q

// ✅ secure
const q = new URLSearchParams(location.search).get('q') || ''
result.textContent = `Search: ${q}`
```

---

## 13. CSRF — Cơ chế và phòng chống

### 🟢 Q: Why CSRF happens? `[Junior]`

**A:** Browser tự gửi cookie theo domain. Nếu server thiếu anti-CSRF controls, request giả mạo vẫn thành công.

### 🟡 Q: Token vs SameSite vs Origin check `[Mid]`

| Technique | Điểm mạnh |
|----------|-----------|
| Synchronizer token | Mạnh cho state-changing requests |
| Double-submit cookie | Tốt cho kiến trúc stateless |
| SameSite | Giảm bề mặt tấn công cross-site |
| Origin/Referer check | Layer bổ sung hiệu quả |

### 🔴 Q: Example CSRF middleware `[Senior]`

```go
func RequireCSRF(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodGet || r.Method == http.MethodHead {
      next.ServeHTTP(w, r); return
    }
    token := r.Header.Get("X-CSRF-Token")
    c, _ := r.Cookie("csrf")
    if c == nil || token == "" || token != c.Value {
      http.Error(w, "forbidden", http.StatusForbidden); return
    }
    next.ServeHTTP(w, r)
  })
}
```

---

## 14. SQL Injection — Parameterized queries, ORM safety

### 🟢 Q: What is SQL Injection? `[Junior]`

**A:** Chèn SQL độc hại qua input để làm thay đổi ý nghĩa truy vấn.

### 🟡 Q: Vulnerable vs secure query `[Mid]`

```js
// ❌ vulnerable
const sql = `SELECT * FROM users WHERE email='${email}'`

// ✅ secure
const sql = 'SELECT * FROM users WHERE email = ?'
await db.execute(sql, [email])
```

### 🔴 Q: Is ORM always safe? `[Senior]`

**A:** Không. ORM chỉ an toàn khi dùng parameter binding/query builder; raw interpolation vẫn có thể bị SQLi.

---

## 15. SSRF — Cloud-critical risk

### 🟢 Q: What is SSRF? `[Junior]`

**A:** SSRF là ép server gửi request đến địa chỉ mà attacker muốn, bao gồm internal endpoints.

### 🟡 Q: Why critical in cloud? `[Mid]`

**A:** Metadata service có thể lộ temporary credentials, tạo đường leo thang quyền.

### 🔴 Q: SSRF prevention checklist `[Senior]`

- Domain allowlist
- DNS/IP validation và block private/link-local/loopback
- Disable untrusted redirects
- Egress firewall
- Least-privilege runtime identity

---

## 16. Authentication Attacks

### 🟢 Q: Brute force vs credential stuffing? `[Junior]`

| Attack | Source |
|-------|--------|
| Brute force | Đoán password hàng loạt |
| Credential stuffing | Dùng credentials rò rỉ từ dịch vụ khác |

### 🟡 Q: Session hijacking vectors `[Mid]`

**A:** XSS token theft, MITM khi không HTTPS, session fixation, token leak qua logs/referrer.

### 🔴 Q: Defenses `[Senior]`

1. MFA/WebAuthn
2. Rate limiting + risk scoring
3. Session rotation
4. Short token TTL
5. Secure cookie flags

---

## 17. API Security

### 🟢 Q: Baseline controls for APIs `[Junior]`

**A:** AuthN, AuthZ, schema validation, rate limiting, secure errors, audit logs.

### 🟡 Q: Why per-principal rate limiting? `[Mid]`

**A:** Chỉ limit theo IP không đủ vì attacker có thể rotate IP; cần kết hợp user/token/device.

### 🔴 Q: Multi-tenant API pitfalls `[Senior]`

- Missing tenant isolation in queries
- Trusting client-supplied tenantId
- Overbroad scopes
- Missing access matrix tests

---

## 18. Security Headers

| Header | Mục đích |
|-------|---------|
| CSP | Giảm XSS |
| HSTS | Bắt buộc HTTPS |
| X-Frame-Options / frame-ancestors | Chống clickjacking |
| X-Content-Type-Options | Chống MIME sniffing |
| Referrer-Policy | Giảm lộ thông tin referrer |
| Permissions-Policy | Giới hạn browser APIs |

### 🟡 Q: CSP nonce strategy `[Mid]`

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'
```

### 🔴 Q: Why headers are not enough? `[Senior]`

**A:** Header là lớp bổ sung, không thay thế authz đúng, validation đúng, và secure business logic.

---

## 19. Interview Q&A

### 🟢 Q: What is IDOR? `[Junior]`

**A:** Truy cập object ngoài quyền bằng cách đổi ID; cần object-level authorization.

### 🟢 Q: Why server-side validation is mandatory? `[Junior]`

**A:** Client validation có thể bị bypass.

### 🟡 Q: How to test broken access control quickly? `[Mid]`

**A:** Dùng matrix owner/non-owner/admin/anonymous trên cùng tài nguyên.

### 🟡 Q: Why verbose errors are risky? `[Mid]`

**A:** Lộ nội dung stack/schema giúp attacker reconnaissance.

### 🟡 Q: How to detect credential stuffing patterns? `[Mid]`

**A:** Theo dõi fail-login burst đa IP/device/user-agent.

### 🔴 Q: Design defense for public payment API `[Senior]`

**A:** Kết hợp auth mạnh, rate limits, fraud checks, immutable audit logs.

### 🔴 Q: First-hour incident response priorities? `[Senior]`

**A:** Contain blast radius, preserve evidence, rotate secrets, coordinate comms.

### 🔴 Q: How to validate control effectiveness long-term? `[Senior]`

**A:** Security tests định kỳ + drills + MTTD/MTTR metrics + postmortem loop.

### 🟢 Q: AuthN vs AuthZ in one line? `[Junior]`

**A:** AuthN: bạn là ai; AuthZ: bạn được làm gì.

### 🔴 Q: Why fail-closed default? `[Senior]`

**A:** Khi lỗi phải deny để tránh bypass control.

---

## 20. Practice Bank

### 🟢 Q: OWASP scenario drill #1? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #2? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #3? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #4? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #5? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #6? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #7? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #8? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #9? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #10? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #11? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #12? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #13? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #14? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #15? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #16? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #17? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #18? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #19? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #20? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #21? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #22? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #23? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #24? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #25? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #26? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #27? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #28? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #29? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #30? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #31? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟢 Q: OWASP scenario drill #32? `[Junior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #33? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #34? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #35? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #36? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #37? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #38? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #39? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #40? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #41? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #42? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #43? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #44? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #45? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #46? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #47? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #48? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #49? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #50? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #51? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #52? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #53? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #54? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #55? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #56? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #57? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #58? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #59? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #60? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #61? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #62? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #63? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🟡 Q: OWASP scenario drill #64? `[Mid]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #65? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #66? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #67? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #68? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #69? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #70? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #71? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #72? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #73? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #74? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #75? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #76? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #77? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #78? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #79? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #80? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #81? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #82? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #83? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #84? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #85? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #86? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #87? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #88? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #89? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #90? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #91? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #92? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #93? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #94? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.


### 🔴 Q: OWASP scenario drill #95? `[Senior]`

**A:** Trả lời theo flow: attack vector → điều kiện khai thác → impact → layered controls → verification bằng tests/logs/alerts.

---

## Cross-References

- Security fundamentals: `docs/interview/shared/04-security/01-security-fundamentals.md`
- Cryptography and protocols: `docs/interview/shared/04-security/02-cryptography-and-protocols.md`
- Networking theory: `docs/interview/shared/01-cs-fundamentals/networking-theory.md`
- System design theory: `docs/interview/shared/02-system-design/system-design-theory.md`
- FE security module: `docs/interview/fe-track/modules/08-security.md`
- BE auth-security: `docs/interview/be-track/02-backend-knowledge/04-auth-security.md`