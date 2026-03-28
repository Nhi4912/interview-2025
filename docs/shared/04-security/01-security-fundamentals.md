# Security Fundamentals — Nền tảng Bảo mật

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `fe-track/07-web-security/`, `be-track/02-backend-knowledge/04-auth-security.md`

---

## Real-World Scenario / Tình Huống Thực Tế

**2017 — Equifax Data Breach:**
Hacker khai thác một lỗ hổng Apache Struts chưa được vá. Trong 76 ngày, họ đánh cắp thông tin cá nhân của 147 triệu người (số CMND, địa chỉ, số thẻ tín dụng). Thiệt hại: $575 triệu tiền phạt, danh tiếng công ty sụp đổ.

**Nguyên nhân:** Không có bảo mật theo chiều sâu. Một lỗ hổng → toàn bộ database bị lộ.

**Câu hỏi:** Làm thế nào bạn thiết kế một hệ thống mà ngay cả khi bị xâm nhập vào một lớp, dữ liệu vẫn được bảo vệ?

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Ngân Hàng:**
Hãy tưởng tượng ngân hàng là hệ thống bảo mật hoàn hảo:

| Security Concept              | Ngân hàng analog                                                 |
| ----------------------------- | ---------------------------------------------------------------- |
| **Confidentiality** (Bảo mật) | Két sắt: chỉ chủ tài khoản mở được                               |
| **Integrity** (Toàn vẹn)      | Sổ giao dịch có chữ ký: không ai sửa số dư mà không bị phát hiện |
| **Availability** (Sẵn sàng)   | Ngân hàng mở cửa 24/7 ATM: luôn truy cập được khi cần            |
| **Authentication**            | Thẻ ATM + PIN: xác nhận bạn là chủ tài khoản                     |
| **Authorization**             | Nhân viên ngân hàng chỉ thấy tài khoản của branch mình           |
| **Defense in Depth**          | Cổng → bảo vệ → thẻ → PIN → két → camera → audit log             |

**Tại sao developer phải biết security?**

- OWASP Top 10: 90% các vụ hack khai thác lỗi trong code của developer (SQL injection, XSS, broken auth)
- Vá lỗi security sau khi release tốn gấp 30x so với phòng tránh từ đầu (IBM Systems Sciences Institute)
- Phỏng vấn Senior tại các công ty tài chính, healthcare luôn có câu hỏi security

---

## Concept Map / Bản Đồ Khái Niệm

```
              [SECURITY FUNDAMENTALS]
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
   [CIA Triad]    [Core Principles]  [Attack Vectors]
   Confidentiality  Least Privilege  - Injection (SQL/XSS)
   Integrity        Fail Securely    - Auth bypass
   Availability     Defense Depth    - IDOR
         │              │              │
         └──────────────┼──────────────┘
                        ▼
             [Authentication & Authorization]
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
   [Identity]     [Sessions]      [Tokens]
   Username/Pass  Cookie/JWT      OAuth 2.0
   MFA            Session hijack  OIDC/SSO
         │
         ▼
   [Cryptography basics]
   Hash → Encryption (symmetric/asymmetric) → TLS/HTTPS
```

**Bạn đang ở đây trong lộ trình học:**

```
CS Fundamentals → Networking → [SECURITY] → Web Security (XSS/CSRF) → Auth Systems → Penetration Testing
```

---

## 1. CIA Triad — Tam giác CIA

> 🧠 **Memory Hook:** Nghĩ đến két sắt ngân hàng 24/7 — Confidentiality = chỉ chủ mới mở được, Integrity = tờ tiền có watermark không giả được, Availability = ATM mở cửa mọi lúc bạn cần.

**Tại sao tồn tại? / Why does this exist?**

Trước khi có CIA Triad, security là vô tổ chức — mỗi team tập trung vào một khía cạnh mà không có framework chung để align.
→ **Why?** Thiếu framework chung dẫn đến blind spots: encrypt data nhưng quên backup → mất Availability.
→ **Why?** Security là multidimensional — không thể maximize chỉ một trục mà bỏ qua hai trục còn lại.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng ngân hàng của bạn là một két sắt đặc biệt. **Confidentiality** là chiếc khóa — chỉ bạn mới biết mã PIN, người khác không đọc được số dư. **Integrity** là tờ tiền có watermark — không ai photocopy mà ngân hàng không phát hiện ra. **Availability** là ATM mở 24/7 — ngay cả lúc 3 giờ sáng, bạn vẫn rút tiền được. Thiếu bất kỳ yếu tố nào, ngân hàng đó sẽ sụp đổ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
CIA Triad — Security Triangle

         Confidentiality
              /\
             /  \
            /    \
           /  CIA \
          /________\
   Integrity      Availability

Tension (đánh đổi):
- Tăng Confidentiality → có thể giảm Availability (thêm auth steps)
- Tăng Availability → có thể giảm Integrity (caching stale data)
- CIA = cân bằng 3 trục theo risk profile của hệ thống
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **CIA conflicts**: Backup encrypted (C↑) → restore chậm hơn (A↓). Cần trade-off có chủ đích.
- **DDoS là attack vào Availability**: Flood server → service down → CIA bị phá ở trục A.
- **Ransomware phá cả 3**: Encrypt files (C↓ vì attacker có key), xóa backup (I↓), lock out user (A↓).
- **HIPAA/PCI-DSS compliance** luôn map requirements vào CIA framework — biết CIA = hiểu compliance.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                            | Đúng là                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| "Availability không phải security"    | Availability là một trục trong CIA Triad — DoS/DDoS là security attack | Availability = khả năng service hoạt động đúng lúc cần                   |
| "Integrity chỉ là backup dữ liệu"     | Backup bảo vệ availability, không verify data chưa bị tampered         | Integrity dùng checksums/hashes/signatures để detect modification        |
| "CIA là framework cũ, không cần biết" | CIA là chuẩn ISO 27001, vẫn là nền tảng của mọi security certification | Mọi security decision đều map về CIA — phỏng vấn senior hỏi thường xuyên |

**🎯 Interview Pattern:**

- Khi thấy: "Thiết kế hệ thống bảo mật cho..." hoặc "Trade-off giữa security và performance?"
- → Nhớ đến: CIA Triad — xác định hệ thống này ưu tiên trục nào (banking = C+I, CDN = A)
- → Mở đầu: "Tôi sẽ đánh giá theo CIA Triad — với hệ thống này, Confidentiality quan trọng nhất vì..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Networking Fundamentals](../03-networking/) — hiểu data flow trước khi bảo vệ nó
- ➡️ Để hiểu tiếp: [Core Security Principles](#2-core-security-principles--nguyên-tắc-bảo-mật-cốt-lõi) — CIA là "cái gì", Principles là "làm thế nào"

### 🟢 Q: What is the CIA Triad?

**A:** Ba trụ cột cơ bản của information security:

| Pillar                        | Mô tả                                         | Ví dụ                                          |
| ----------------------------- | --------------------------------------------- | ---------------------------------------------- |
| **Confidentiality** (Bảo mật) | Chỉ người được phép mới truy cập được dữ liệu | Encryption, access control, authentication     |
| **Integrity** (Toàn vẹn)      | Dữ liệu không bị thay đổi trái phép           | Checksums, digital signatures, version control |
| **Availability** (Sẵn sàng)   | Hệ thống luôn hoạt động khi cần               | Redundancy, load balancing, DDoS protection    |

**Mở rộng (AAA Model):**

- **Authentication** — Xác thực: Bạn là ai?
- **Authorization** — Phân quyền: Bạn được làm gì?
- **Accounting** — Ghi nhận: Bạn đã làm gì?

---

## 2. Core Security Principles — Nguyên tắc bảo mật cốt lõi

> 🧠 **Memory Hook:** Chung cư hiện đại có 6 lớp bảo vệ — cổng bảo vệ, thẻ từ thang máy, camera, khóa cửa, két sắt, hệ thống báo cháy. Mỗi lớp là một principle: Defense in Depth, Least Privilege, Fail Securely...

**Tại sao tồn tại? / Why does this exist?**

Developers giỏi về features nhưng thường implement security sai — không phải vì thiếu kỹ năng, mà vì thiếu mental framework để nhận ra "đây là security issue".
→ **Why?** Không có nguyên tắc chỉ dẫn, từng developer sẽ tự phát minh lại bánh xe — và thường sai theo cách nguy hiểm.
→ **Why?** Security là counter-intuitive: "fail open" trông có vẻ user-friendly nhưng thực ra là lỗ hổng bảo mật nghiêm trọng.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến chung cư cao cấp với nhiều lớp bảo vệ. **Defense in Depth**: không chỉ có bảo vệ ở cổng — còn thẻ từ thang máy, camera hành lang, khóa cửa riêng từng căn. **Least Privilege**: thợ sửa điện có thẻ vào tầng hầm điện, nhưng không vào được căn hộ. **Fail Securely**: khi mất điện, thang máy dừng ở tầng an toàn, cửa tầng trệt tự khóa. Mỗi nguyên tắc này đều có thể áp dụng 1:1 vào code của bạn.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
6 Core Principles — áp dụng vào web app:

1. Defense in Depth
   Internet → WAF → API Gateway → App → DB
   (mỗi lớp có security riêng, lớp sau không trust lớp trước)

2. Least Privilege
   DB user chỉ SELECT/INSERT trên bảng cần thiết
   Service account chỉ đọc 1 S3 bucket

3. Fail Securely
   auth error → deny access (không phải grant)
   DB down → return 503 (không phải bypass)

4. Don't Trust Input
   client data → validate → sanitize → use
   (params, headers, cookies — ALL untrusted)

5. Secure by Default
   new endpoint → auth required by default
   new cookie → HttpOnly + Secure + SameSite

6. Separation of Duties
   Dev ≠ Reviewer ≠ Deployer (4-eyes principle)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Least Privilege vs. Practicality**: Quá granular làm devops phức tạp — cân bằng bằng role grouping có cấu trúc.
- **Fail Securely vs. UX**: Lỗi auth hiển thị generic message → user khó debug, nhưng specific message → attacker biết username tồn tại.
- **Defense in Depth có chi phí**: Thêm lớp = thêm latency và complexity — cần profile theo risk, không phải "thêm là tốt hơn".
- **Secure by Default bị resist bởi team**: Developers complain về overhead — cần champion security culture từ đầu.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                                 | Đúng là                                                    |
| ----------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| Validate input chỉ ở frontend                   | Client-side validation bypass được bằng curl/Burp Suite     | Validate tại server-side (frontend validation chỉ là UX)   |
| Dùng database admin account cho app thường      | Vi phạm Least Privilege — nếu app bị hack, toàn DB bị chiếm | Tạo dedicated service account với quyền minimal            |
| Catch exception và tiếp tục xử lý khi auth fail | Fail open — vi phạm Fail Securely principle                 | Catch exception → deny → log security event → return error |

**🎯 Interview Pattern:**

- Khi thấy: "Code review" hoặc "Bạn sẽ review PR này như thế nào?"
- → Nhớ đến: 6 principles — check từng principle xem code có vi phạm không
- → Mở đầu: "Tôi sẽ check Least Privilege trước — service này có nhiều quyền hơn cần thiết không?..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [CIA Triad](#1-cia-triad--tam-giác-cia) — principles là implementation của CIA values
- ➡️ Để hiểu tiếp: [Authentication vs Authorization](#3-authentication-vs-authorization--xác-thực-vs-phân-quyền) — áp dụng Least Privilege vào auth

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

> 🧠 **Memory Hook:** Đi máy bay có 2 bước kiểm tra: CCCD tại check-in (Authentication — bạn là ai?), sau đó vé hạng ghế tại cửa lên máy bay (Authorization — bạn được ngồi đâu?). Thiếu bước nào cũng không lên được máy bay đúng chỗ.

**Tại sao tồn tại? / Why does this exist?**

Nhiều developers nhầm lẫn giữa AuthN và AuthZ, dẫn đến HTTP code sai (trả 403 khi nên trả 401) hoặc implement authorization trước khi verify identity.
→ **Why?** Hai khái niệm xảy ra theo thứ tự cố định — AuthN luôn phải trước AuthZ, không thể đảo ngược.
→ **Why?** Hệ thống phân tán (microservices) cần phân tách rõ: service A authenticate, service B authorize — không thể gộp chung.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn đến sân bay với chuyến bay quốc tế. Bước đầu tiên, nhân viên kiểm tra **CCCD** của bạn — đây là **Authentication** (bạn là ai? — xác nhận danh tính). Sau đó, tại cửa lên máy bay, họ kiểm tra **vé** của bạn có đúng hạng ghế Business không — đây là **Authorization** (bạn được làm gì? — phân quyền). Người ngồi ghế Economy không thể vào khu Business Lounge dù CCCD hoàn toàn hợp lệ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Request Flow — AuthN trước, AuthZ sau:

Client Request → [AUTHN] → [AUTHZ] → Handler
                    ↓          ↓
               "Ai đây?"  "Được làm gì?"
               JWT/Session  RBAC/Permissions
                    ↓          ↓
               401 nếu     403 nếu
               unknown     không đủ quyền

HTTP Codes:
  401 Unauthorized  → thực ra là "Unauthenticated" (chưa xác thực)
  403 Forbidden     → đã xác thực nhưng không có quyền (unauthorized)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **API Key vs Bearer Token**: API key thường combine AuthN+AuthZ (key = identity + permissions), JWT tách biệt hai bước.
- **"Confused deputy" attack**: Service A trust service B blindly → B bị compromise → A bị exploit. Cần authorize từng inter-service call.
- **Token refresh**: Access token expire → dùng refresh token → server re-authenticate trước khi re-authorize.
- **OIDC = AuthN, OAuth = AuthZ**: OIDC trả về id_token (identity), OAuth trả về access_token (permissions) — thường bị nhầm.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                                               | Đúng là                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Trả 401 khi user đã login nhưng không có quyền | 401 = unauthenticated, 403 = unauthorized                                 | Login rồi mà thiếu quyền → 403 Forbidden                   |
| Check authorization trước authentication       | Nếu không biết user là ai, không thể check quyền                          | AuthN → AuthZ, không bao giờ đảo ngược                     |
| "Login là đủ để access mọi resource"           | Authorization là separate step — just being logged in ≠ having permission | Implement permission check riêng cho mỗi endpoint/resource |

**🎯 Interview Pattern:**

- Khi thấy: "Thiết kế hệ thống với user roles" hoặc "Lỗi 401 vs 403 khi nào dùng?"
- → Nhớ đến: AuthN (identity) → AuthZ (permission), theo thứ tự bất biến
- → Mở đầu: "Cần phân biệt: 401 khi chưa xác thực danh tính, 403 khi đã xác thực nhưng thiếu quyền..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Core Security Principles](#2-core-security-principles--nguyên-tắc-bảo-mật-cốt-lõi) — Least Privilege drives AuthZ design
- ➡️ Để hiểu tiếp: [Session Authentication](#4-session-based-authentication--xác-thực-bằng-session) — một cách implement AuthN cụ thể

### 🟡 Q: What is the difference between Authentication and Authorization?

|               | Authentication (AuthN)               | Authorization (AuthZ)                        |
| ------------- | ------------------------------------ | -------------------------------------------- |
| **Câu hỏi**   | Bạn là AI? (Who are you?)            | Bạn được làm GÌ? (What can you do?)          |
| **Mục đích**  | Verify identity                      | Verify permissions                           |
| **Thời điểm** | Xảy ra TRƯỚC                         | Xảy ra SAU authentication                    |
| **HTTP code** | `401 Unauthorized` (unauthenticated) | `403 Forbidden` (unauthorized)               |
| **Ví dụ**     | Login with username/password         | Admin can delete users, viewer can only read |

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

> 🧠 **Memory Hook:** Vòng tay nhựa ở công viên nước — bạn đóng tiền vé một lần (login), nhân viên đeo vòng tay lên (tạo session), mỗi lần vào khu vực nào họ chỉ scan vòng tay (validate session), không cần đóng tiền lại.

**Tại sao tồn tại? / Why does this exist?**

HTTP là stateless — mỗi request độc lập, server không nhớ bạn là ai từ request trước. Không có session, user phải gửi username+password với mỗi API call.
→ **Why?** Gửi credentials mỗi request = attack surface rất lớn (mỗi request có thể bị intercept lấy password).
→ **Why?** Session cho phép "đăng nhập một lần, hoạt động nhiều lần" — vừa UX tốt, vừa giảm exposure của credentials.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi vào công viên nước, bạn mua vé tại cổng (gửi username+password), nhân viên xác nhận và đeo **vòng tay** lên cổ tay bạn (tạo session ID). Suốt cả ngày, bạn chỉ cần đưa vòng tay cho nhân viên scan (gửi cookie có session ID) — không cần mua vé lại. Nhưng nếu ai đó lấy vòng tay của bạn (session hijacking), họ vào được khu vực của bạn. Khi bạn ra về (logout), nhân viên cắt vòng tay (invalidate session).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Session Authentication Flow:

1. POST /login {user, pass}
   Server verify credentials
        ↓
   Create session → store in Redis/DB
   sessionId = "abc123xyz" → TTL 30min
        ↓
   Set-Cookie: sessionId=abc123xyz; HttpOnly; Secure

2. GET /dashboard
   Cookie: sessionId=abc123xyz
        ↓
   Server lookup: sessions["abc123xyz"] → user info
        ↓
   Found + valid → authorize → handle request

3. POST /logout
        ↓
   Delete sessions["abc123xyz"]  ← key step!
   Clear-Cookie header
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Session fixation attack**: Attacker set session ID trước khi user login → sau login, attacker biết session ID. Fix: regenerate session ID after login.
- **Horizontal scaling**: 2 servers, session chỉ ở server 1 → request đến server 2 bị rejected. Fix: Redis shared session store.
- **Session vs Cookie**: Cookie là transport mechanism (lưu ở client), Session là storage mechanism (lưu ở server) — không đồng nhất.
- **CSRF với session**: Cookie tự động đính kèm → attacker có thể forge request nếu không có CSRF token. JWT in Authorization header an toàn hơn với CSRF.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                | Đúng là                                              |
| ----------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| Không invalidate session khi logout       | Session vẫn valid trên server → có thể reuse               | DELETE session từ store ngay khi logout              |
| Session ID trong URL (e.g., ?session=abc) | Logged trong server logs, browser history, referer headers | Luôn dùng HttpOnly Cookie cho session ID             |
| Session timeout quá dài (1 tuần)          | Stolen session có nhiều thời gian bị exploit               | Timeout phù hợp (15-30min inactivity) + absolute TTL |

**🎯 Interview Pattern:**

- Khi thấy: "Thiết kế auth system" hoặc "Scale authentication cho 1M users?"
- → Nhớ đến: Session → cần shared store (Redis) cho horizontal scaling
- → Mở đầu: "Session-based auth cần centralized store — tôi sẽ dùng Redis với TTL và proper invalidation..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Authentication vs Authorization](#3-authentication-vs-authorization--xác-thực-vs-phân-quyền) — session implements AuthN
- ➡️ Để hiểu tiếp: [JWT](#5-jwt-json-web-token) — stateless alternative to sessions

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

| Storage   | Pros                           | Cons                                                |
| --------- | ------------------------------ | --------------------------------------------------- |
| In-memory | Nhanh nhất                     | Mất khi restart, không scale được (sticky sessions) |
| Redis     | Nhanh, shared across instances | Cần maintain Redis cluster                          |
| Database  | Persistent, queryable          | Chậm hơn, cần cleanup expired sessions              |

**Session fixation attack:**

> Attacker set sẵn session ID cho victim → victim login → attacker dùng session ID đó.
> **Prevention:** Regenerate session ID sau mỗi lần login.

---

## 5. JWT (JSON Web Token)

> 🧠 **Memory Hook:** Giấy giới thiệu có đóng dấu đỏ — bạn mang theo trong túi, ai cũng đọc được nội dung (base64), nhưng không ai giả được con dấu (chữ ký HMAC/RSA) nếu không có khóa bí mật.

**Tại sao tồn tại? / Why does this exist?**

Microservices và mobile apps cần auth stateless — mỗi service không muốn gọi auth service để validate mỗi request (latency + single point of failure).
→ **Why?** Session cần centralized store — khi có 50 microservices, mỗi service lookup Redis cho mỗi request = bottleneck nghiêm trọng.
→ **Why?** JWT self-contained: token chứa claims + signature → mỗi service verify locally bằng public key, không cần network call.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến **công văn có đóng dấu của Bộ**. Người mang công văn (client) có thể đọc nội dung (JWT payload dạng base64), ai cũng biết công văn ghi gì. Nhưng không ai làm giả được dấu đỏ (chữ ký số) nếu không có con dấu gốc (secret key). Tại bất kỳ cơ quan nào (microservice), nhân viên chỉ cần nhìn dấu là biết công văn thật — không cần gọi điện về Bộ kiểm tra (không cần lookup database).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
JWT Structure: header.payload.signature

Header (base64):  {"alg":"HS256","typ":"JWT"}
Payload (base64): {"sub":"user123","role":"admin","exp":1735000000}
Signature:        HMACSHA256(header+"."+payload, secretKey)

JWT Lifecycle:
1. Login → Server tạo JWT, sign với secretKey → trả về client
2. Client lưu (localStorage / memory / cookie)
3. Request: Authorization: Bearer <jwt>
4. Server nhận → verify signature → decode payload
5. Check "exp" chưa expired → use claims
6. Token expire → client dùng refresh token → server issue new JWT

⚠️ JWT không thể revoke trước exp! (stateless limitation)
   Solution: short-lived access token (15min) + refresh token
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **"alg: none" attack**: Attacker gửi JWT với algorithm "none" — server skip signature check → bypass auth. Fix: whitelist allowed algorithms explicitly.
- **JWT trong localStorage vs Cookie**: localStorage dễ bị XSS steal, Cookie với HttpOnly bảo vệ hơn nhưng dễ bị CSRF.
- **Revocation problem**: Logout nhưng JWT vẫn valid đến expiry → cần token blacklist (DB) hoặc short TTL — làm mất đi stateless benefit.
- **Payload size**: JWT payload được gửi mỗi request → đừng nhét quá nhiều claims (roles, permissions array) → bandwidth waste.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                                         | Đúng là                                                            |
| ----------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| "JWT encrypted nên payload an toàn" | JWT chỉ base64-encoded (không phải encrypted) — ai cũng decode được | Đừng để sensitive data (password, SSN) trong JWT payload           |
| Access token TTL 7 ngày             | Token bị steal → attacker có 7 ngày access                          | Access token 15min, refresh token 7 ngày (short-lived + renewable) |
| Không verify "alg" header           | "alg:none" attack bypass signature verification                     | Hardcode expected algorithm, đừng trust header                     |

**🎯 Interview Pattern:**

- Khi thấy: "Session vs JWT?" hoặc "Stateless authentication design?"
- → Nhớ đến: JWT = self-contained, no DB lookup, nhưng không revocable trước expiry
- → Mở đầu: "JWT phù hợp cho microservices vì mỗi service verify locally — nhưng cần short TTL vì không thể revoke..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Session Authentication](#4-session-based-authentication--xác-thực-bằng-session) — stateful vs stateless tradeoff
- ➡️ Để hiểu tiếp: [OAuth 2.0](#6-oauth-20) — JWT thường được dùng làm access token trong OAuth

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

| Type       | Claims                                          | Mô tả                                       |
| ---------- | ----------------------------------------------- | ------------------------------------------- |
| Registered | `iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti` | Chuẩn RFC 7519, IANA registered             |
| Public     | `name`, `email`, `role`                         | Custom nhưng nên đăng ký để tránh collision |
| Private    | App-specific claims                             | Thỏa thuận giữa producer và consumer        |

### 🟡 Q: What signing algorithms should you use?

| Algorithm | Type                                 | Khi nào dùng                                          |
| --------- | ------------------------------------ | ----------------------------------------------------- |
| **HS256** | Symmetric (shared secret)            | Single service, internal APIs                         |
| **RS256** | Asymmetric (private/public key pair) | Microservices — sign with private, verify with public |
| **ES256** | Asymmetric (elliptic curve)          | Compact tokens, mobile, high-performance systems      |

> ⚠️ **Tuyệt đối KHÔNG dùng `alg: "none"`** — đây là lỗ hổng bảo mật nổi tiếng.

### 🔴 Q: Session vs JWT — when to use which?

| Criteria          | Session                                   | JWT                                      |
| ----------------- | ----------------------------------------- | ---------------------------------------- |
| **State**         | Stateful (server lưu)                     | Stateless (client giữ)                   |
| **Scalability**   | Cần shared storage (Redis)                | Dễ scale (không cần shared state)        |
| **Revocation**    | Dễ (xóa session)                          | Khó (token valid đến khi expire)         |
| **Size**          | Small (chỉ session ID)                    | Lớn hơn (chứa claims)                    |
| **Microservices** | Khó (mỗi service cần check session store) | Dễ (mỗi service tự verify)               |
| **Security**      | Vulnerable to CSRF                        | Vulnerable to XSS (nếu lưu localStorage) |
| **Best for**      | Monolith, traditional web apps            | Microservices, SPAs, mobile apps         |

**JWT Revocation Strategies:**

1. **Short-lived tokens** (15 min) + refresh token rotation
2. **Token blacklist** — lưu revoked JTI trong Redis (trade-off: thêm stateful check)
3. **Token versioning** — mỗi user có token version, increment khi logout/password change

---

## 6. OAuth 2.0

> 🧠 **Memory Hook:** Cho bạn mượn chìa khóa nhà — nhưng chỉ chìa khóa phòng khách, không phải phòng ngủ. Bạn không cần biết mã khóa cổng (password) — chỉ cần chìa khóa giới hạn phạm vi (scoped token).

**Tại sao tồn tại? / Why does this exist?**

Trước OAuth, app thứ ba (như calendar app) cần biết Gmail password để đọc contacts — cực kỳ nguy hiểm và không thể revoke một phần quyền.
→ **Why?** Password là "tất cả hoặc không có gì" — share password = share toàn bộ quyền.
→ **Why?** OAuth tạo ra khái niệm "delegated authorization" — cho phép access có giới hạn (scope) mà không cần share credentials.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn ở khách sạn và muốn nhờ đồng nghiệp lấy tài liệu từ phòng bạn. Thay vì đưa thẻ check-in chính (password), lễ tân cấp cho đồng nghiệp **thẻ tạm thời** chỉ mở được phòng bạn, chỉ có hiệu lực 2 giờ, không mở được minibar hay room service (scoped). Đồng nghiệp không bao giờ biết mã PIN thẻ chính của bạn. Đây chính xác là cách OAuth hoạt động — resource owner (bạn) authorize client (đồng nghiệp) qua authorization server (lễ tân).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
OAuth 2.0 Authorization Code Flow (most secure):

User → Client App → Authorization Server

1. "Login with Google" button clicked
2. Redirect: GET /authorize?client_id=X&scope=email&redirect_uri=...
3. Google shows consent screen
4. User approves → Google redirects back with "code"
5. Client backend exchanges code for tokens:
   POST /token {code, client_secret}
   ← {access_token, refresh_token, expires_in}
6. Client uses access_token to call Google APIs

Roles:
  Resource Owner      = User (bạn)
  Client              = App muốn access
  Authorization Server = Google/GitHub/Okta
  Resource Server     = Gmail API / GitHub API
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **PKCE (Proof Key for Code Exchange)**: Mobile/SPA không thể giữ client_secret an toàn → PKCE thay thế, dùng code_verifier/code_challenge.
- **Implicit Flow deprecated**: Trả access_token trực tiếp trong URL → bị logged → không dùng nữa. Dùng Auth Code + PKCE thay thế.
- **OAuth ≠ Authentication**: OAuth chỉ là authorization — để biết "user này là ai" cần OpenID Connect (OIDC) bổ sung id_token.
- **Token scope creep**: Request quá nhiều scope → user reject. Principle of Least Privilege: chỉ request scope cần thiết.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                      | Tại sao sai                                                         | Đúng là                                                                |
| ---------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Dùng OAuth để authentication | OAuth cấp access token, không verify identity của user              | Dùng OpenID Connect (OIDC) cho authentication, OAuth cho authorization |
| Implicit Flow cho SPA mới    | Deprecated — access_token exposed trong URL/history                 | Auth Code Flow + PKCE cho tất cả public clients                        |
| Không validate redirect_uri  | Open redirect attack — attacker chuyển hướng code đến server của họ | Whitelist exact redirect URIs tại authorization server                 |

**🎯 Interview Pattern:**

- Khi thấy: "Login with Google/Facebook" hoặc "Third-party API integration design?"
- → Nhớ đến: OAuth 2.0 flows — Authorization Code (web), PKCE (mobile/SPA), Client Credentials (server-to-server)
- → Mở đầu: "Tôi sẽ dùng OAuth Authorization Code flow với PKCE — đây là flow an toàn nhất cho web app có backend..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [JWT](#5-jwt-json-web-token) — JWT thường là format của OAuth access tokens
- ➡️ Để hiểu tiếp: [Access Control Models](#11-access-control-models--mô-hình-phân-quyền) — OAuth scopes là một dạng ABAC

### 🟡 Q: What is OAuth 2.0 and what are its roles?

**4 Roles:**

| Role                     | Mô tả                   | Ví dụ                        |
| ------------------------ | ----------------------- | ---------------------------- |
| **Resource Owner**       | User sở hữu data        | End user                     |
| **Client**               | App muốn access data    | Your web/mobile app          |
| **Authorization Server** | Cấp tokens              | Google Auth, Auth0, Keycloak |
| **Resource Server**      | API chứa protected data | Google Calendar API          |

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

| Grant Type                | Use Case                                                  |
| ------------------------- | --------------------------------------------------------- |
| Authorization Code + PKCE | Web apps, mobile apps (RECOMMENDED)                       |
| Client Credentials        | Machine-to-machine (no user involved)                     |
| Device Code               | Smart TV, IoT (limited input devices)                     |
| ~~Implicit~~              | ~~SPAs~~ — **DEPRECATED**, dùng Auth Code + PKCE thay thế |
| ~~Password~~              | ~~Legacy~~ — **DEPRECATED**, chỉ dùng khi migrate         |

### 🟡 Q: OAuth 2.0 vs OpenID Connect (OIDC)?

|              | OAuth 2.0                        | OIDC                                    |
| ------------ | -------------------------------- | --------------------------------------- |
| **Purpose**  | Authorization (access resources) | Authentication (verify identity)        |
| **Token**    | Access token (opaque or JWT)     | ID token (always JWT) + access token    |
| **Claims**   | No standard user info            | Standard claims: `sub`, `name`, `email` |
| **Scope**    | Custom scopes                    | `openid`, `profile`, `email`            |
| **UserInfo** | No standard endpoint             | `/userinfo` endpoint                    |

> **Tóm lại:** OAuth 2.0 = "Cho app X quyền truy cập photos của tôi". OIDC = "Xác thực tôi là ai thông qua Google".

---

## 7. Password Security — Bảo mật mật khẩu

> 🧠 **Memory Hook:** So sánh két sắt theo thời gian crack — MD5 như két giấy (crack trong giây), bcrypt như két thép cần 10 phút mỗi lần thử, Argon2 như két titan cần 1 giờ. Attacker muốn crack 1 triệu accounts → bcrypt làm nó thành công việc không khả thi.

**Tại sao tồn tại? / Why does this exist?**

"LinkedIn 2012 breach": 117 triệu passwords bị steal và crack trong vài ngày vì dùng SHA1 không có salt. Nếu dùng bcrypt, attacker sẽ cần hàng trăm năm.
→ **Why?** Password không được lưu dạng plaintext hay hash thường — database breach = attacker có tất cả passwords.
→ **Why?** Password hashing cần "chậm một cách có chủ đích" (work factor) để brute-force không khả thi, dù attacker có GPU farm.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến hai loại két sắt: **két giấy** (MD5/SHA1) có thể phá trong vài giây với dụng cụ thích hợp, và **két titanium** (bcrypt/Argon2) cần 10-60 phút cho mỗi lần thử. Nếu bạn phải thử 1 triệu mật khẩu, két giấy mất 1 giờ, két titanium mất... 19 năm. **Salt** giống như mỗi két có thiết kế khóa khác nhau — không thể dùng một key để mở tất cả (ngăn rainbow table attack).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Password Hashing Flow:

STORE:
password = "mySecret123"
salt = generateRandom32bytes()  // "a7f3b2..." — mỗi user khác nhau
hash = bcrypt(password + salt, cost_factor=12)
store: {salt, hash} in DB — KHÔNG bao giờ store plaintext

VERIFY:
user enters "mySecret123"
retrieve {salt, hash} from DB
candidate = bcrypt("mySecret123" + salt, cost=12)
return candidate === hash  // constant-time comparison!

Why bcrypt?
- cost_factor=12 → 2^12 = 4096 iterations
- cost_factor tăng 1 → thời gian x2 → future-proof
- vs MD5: deterministic, no cost, same hash = cracked

Comparison:
  MD5:     < 1ms per hash   ❌
  bcrypt:  ~250ms per hash  ✅
  Argon2:  ~500ms per hash  ✅✅ (memory-hard, GPU-resistant)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **bcrypt max 72 chars**: Input truncated at 72 bytes — long passwords past 72 chars have same hash. Fix: pre-hash with SHA256 before bcrypt.
- **Password spraying vs brute force**: Brute force = nhiều password cho 1 account (account lockout chặn), spraying = 1 password phổ biến cho nhiều accounts (khó detect hơn).
- **Timing attack trên comparison**: String comparison leak timing info. Fix: constant-time comparison (crypto.timingSafeEqual).
- **MFA là defense khi password bị leak**: Password DB bị steal nhưng MFA còn đó → attacker vẫn blocked.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                                        | Đúng là                                                 |
| ------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------- |
| Dùng SHA256/MD5 để hash password     | General-purpose hash: fast by design → brute force trivial với GPU | Dùng bcrypt/Argon2/scrypt — password-specific slow hash |
| Store password hash mà không có salt | Rainbow table attack — precomputed table crack hash trong giây     | Random salt per user — makes rainbow tables useless     |
| Dùng "==" để compare hash            | Timing attack leaks information về matching position               | Dùng crypto.timingSafeEqual() hoặc equivalent           |

**🎯 Interview Pattern:**

- Khi thấy: "Bạn sẽ lưu password như thế nào?" hoặc "Database bị breach, risk là gì?"
- → Nhớ đến: bcrypt + salt + work factor — không bao giờ plaintext hay fast hash
- → Mở đầu: "Tôi sẽ dùng bcrypt với work factor 12, random salt per user — nếu DB bị breach, brute force mất hàng chục năm..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Authentication vs Authorization](#3-authentication-vs-authorization--xác-thực-vs-phân-quyền) — password là credential trong AuthN
- ➡️ Để hiểu tiếp: [Encryption Fundamentals](#10-encryption--network-security-fundamentals) — hiểu hashing vs encryption

### 🟡 Q: Why not use MD5 or SHA for password hashing?

| Algorithm    | Vấn đề                                                                          |
| ------------ | ------------------------------------------------------------------------------- |
| MD5          | Broken — collision attacks, rainbow tables, ~10 billion hashes/sec trên GPU     |
| SHA-256      | Quá nhanh — designed for speed, not password hashing                            |
| **bcrypt**   | ✅ Adaptive cost factor, built-in salt, deliberately slow                       |
| **argon2id** | ✅ Memory-hard (chống GPU/ASIC attacks), winner of Password Hashing Competition |

**Tại sao cần salt?**

> Nếu không salt, 2 users cùng password → cùng hash → attacker crack 1 là crack hết.
> Salt = random bytes thêm vào trước khi hash → mỗi user có hash khác nhau dù cùng password.

**Recommended settings:**

- bcrypt: cost factor ≥ 12 (adjust based on server hardware — target ~250ms per hash)
- argon2id: memory=64MB, iterations=3, parallelism=4

### 🟡 Q: What is Multi-Factor Authentication (MFA)?

**3 Authentication factors:**

| Factor                              | Mô tả                            | Ví dụ                  |
| ----------------------------------- | -------------------------------- | ---------------------- |
| **Knowledge** (Something you know)  | Password, PIN, security question |                        |
| **Possession** (Something you have) | Phone, hardware key, smart card  | TOTP, SMS OTP, YubiKey |
| **Inherence** (Something you are)   | Biometrics                       | Fingerprint, Face ID   |

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

> 🧠 **Memory Hook:** Top 10 cách trộm vào nhà — SQL Injection = giả chìa khóa, XSS = để lại thiết bị nghe lén, CSRF = giả chữ ký, Broken Auth = ổ khóa gỉ sét, IDOR = đổi số phòng để vào phòng người khác.

**Tại sao tồn tại? / Why does this exist?**

90% các vụ breach thực tế đều khai thác các lỗ hổng đã được biết từ lâu — không phải zero-day mới lạ, mà là những lỗi developer mắc đi mắc lại.
→ **Why?** OWASP Top 10 được tổng hợp từ dữ liệu thực tế của hàng nghìn apps — đây là những gì attackers ưu tiên tấn công nhất.
→ **Why?** Biết Top 10 = biết checklist "vá trước khi release" — phòng 90% các loại tấn công phổ biến chỉ với kiến thức cơ bản.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

OWASP Top 10 như danh sách "10 cách trộm hay dùng nhất để vào nhà". **SQL Injection** như trộm học cách nhái chìa khóa từ khe cửa. **XSS** như trộm để lại thiết bị nghe lén bên trong nhà bạn. **CSRF** như kẻ gian giả chữ ký của bạn để rút tiền ngân hàng. **IDOR** như đổi số phòng khách sạn để vào phòng người khác. Biết danh sách này, bạn biết phải vá chỗ nào trước.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
OWASP Top 10 (2021) — Quick Reference:

A01 Broken Access Control   → IDOR, privilege escalation
A02 Cryptographic Failures  → weak hash, unencrypted PII
A03 Injection               → SQL, NoSQL, LDAP, XSS
A04 Insecure Design         → missing threat modeling
A05 Security Misconfiguration → default creds, open cloud storage
A06 Vulnerable Components   → outdated libraries (log4shell)
A07 Auth Failures           → weak passwords, no MFA, broken session
A08 Integrity Failures      → unsigned code, insecure deserialization
A09 Logging Failures        → no audit trail, no alerting
A10 SSRF                    → server fetches attacker-controlled URL

Top 3 Deep Dive:
SQL Injection:  "' OR '1'='1" in login → bypass auth
XSS:            <script>steal(document.cookie)</script> in comment
CSRF:           <img src="bank.com/transfer?to=attacker&amount=1000">
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **IDOR (A01)**: Thay đổi `/api/orders/123` thành `/api/orders/124` để xem đơn hàng người khác — validate ownership server-side.
- **Second-order SQL injection**: Input được store rồi sau đó dùng trong query khác — sanitize at use point, không chỉ at input point.
- **DOM-based XSS**: XSS xảy ra purely trong JavaScript, không qua server — CSP và avoid innerHTML với user data.
- **SSRF via webhooks**: User cung cấp URL cho webhook → server fetch internal endpoint (169.254.169.254 AWS metadata) → credential leak.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                       | Đúng là                                                         |
| ----------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| Dùng string concatenation cho SQL query   | SQL Injection trivial: `"SELECT * FROM users WHERE id=" + userId` | Parameterized queries / prepared statements luôn luôn           |
| Tin tưởng user-supplied HTML              | XSS: user nhập `<script>` → render → steal cookies                | Escape output khi render, dùng CSP header                       |
| Không check ownership khi access resource | IDOR: user A access data của user B bằng cách đổi ID              | Always verify: `resource.userId === currentUser.id` server-side |

**🎯 Interview Pattern:**

- Khi thấy: "Security review cho feature này" hoặc "Tại sao không dùng string concat cho query?"
- → Nhớ đến: OWASP A03 Injection — parameterized queries là non-negotiable
- → Mở đầu: "Đây là OWASP A03 Injection risk — fix duy nhất là parameterized queries, không phải sanitize input..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Core Security Principles](#2-core-security-principles--nguyên-tắc-bảo-mật-cốt-lõi) — Don't Trust Input là nguyên tắc chống injection
- ➡️ Để hiểu tiếp: [CORS & Same-Origin Policy](#9-cors--same-origin-policy) — liên quan đến XSS và CSRF prevention

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
>
> - FE: See `fe-track/07-web-security/01-common-vulnerabilities.md` (Prisma, pg library)
> - BE: See `be-track/02-backend-knowledge/04-auth-security.md` (Go database/sql, sqlx)

### 🟡 Q: Explain XSS (Cross-Site Scripting)

**What:** Attacker inject malicious script vào web page → script chạy trong browser của victim.

**3 Types:**

| Type              | Mô tả                                            | Persistence    |
| ----------------- | ------------------------------------------------ | -------------- |
| **Stored XSS**    | Script lưu trong DB, render cho mọi user         | Persistent     |
| **Reflected XSS** | Script nằm trong URL, server reflect về response | Non-persistent |
| **DOM-based XSS** | Script modify DOM trực tiếp, không qua server    | Client-side    |

**Prevention layers:**

1. **Input validation** — Whitelist allowed characters
2. **Output encoding** — Escape HTML entities (`<` → `&lt;`)
3. **Content Security Policy** — Restrict script sources
4. **HttpOnly cookies** — Prevent JS access to session cookies

> Track-specific implementations:
>
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

| Method                   | Mô tả                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Synchronizer Token**   | Server generate random token, embed trong form, verify khi submit                      |
| **Double Submit Cookie** | Token trong cookie + token trong request body — compare cả hai                         |
| **SameSite Cookie**      | `SameSite=Strict` hoặc `Lax` — browser không gửi cookie cross-site                     |
| **Custom Header**        | Require `X-Requested-With` header — cross-origin requests không thể set custom headers |
| **Origin/Referer Check** | Verify Origin header matches expected domain                                           |

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

> 🧠 **Memory Hook:** Hàng xóm muốn mượn đồ qua cửa sổ — Same-Origin Policy là quy tắc "không cho người lạ vào nhà", CORS là tờ giấy phép chính thức: "Tôi cho phép nhà số 42 gõ cửa và tôi sẽ mở".

**Tại sao tồn tại? / Why does this exist?**

Nếu không có Same-Origin Policy, JavaScript ở `evil.com` có thể đọc cookie/localStorage của `bank.com` khi user mở cả hai tab cùng lúc.
→ **Why?** Browser là shared environment — nhiều website chạy đồng thời, cần isolation để tránh một site đọc data của site khác.
→ **Why?** CORS là cơ chế để "loosening" SOP một cách có kiểm soát — API server cần nói "tôi tin frontend ở domain này".

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khu chung cư có quy tắc: **không ai được gõ cửa nhà người khác** (Same-Origin Policy). Nhưng bạn có thể để lại **danh sách bạn bè được phép vào** tại lễ tân (CORS header). Khi anh Nam ở nhà 42 (frontend ở `app.com`) muốn vào nhà bạn (API ở `api.com`), lễ tân kiểm tra danh sách — nếu `app.com` có tên thì cửa mở, nếu không thì bị từ chối. `evil.com` thì không bao giờ có tên trong danh sách.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
CORS Preflight Flow:

Browser (app.com) → API (api.com):

1. Preflight (OPTIONS — with complex requests):
   OPTIONS /api/data
   Origin: https://app.com
   Access-Control-Request-Method: POST

2. Server response:
   Access-Control-Allow-Origin: https://app.com
   Access-Control-Allow-Methods: GET, POST
   Access-Control-Allow-Headers: Content-Type
   Access-Control-Max-Age: 3600

3. Actual request proceeds if headers allow it

Simple Request (no preflight):
- GET/POST with basic content-types
- Browser adds Origin header automatically
- Server must respond with Allow-Origin

⚠️ CORS is browser-enforced only!
   curl / server-to-server bypass CORS completely
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **`Allow-Origin: *` với credentials**: Cannot combine `*` with `Allow-Credentials: true` — browser rejects. Must specify exact origin.
- **CORS bypass**: Server-side requests (curl, backend) không bị CORS — CORS chỉ protect browser, không phải API security.
- **Preflight caching**: `Access-Control-Max-Age` cache preflight responses — giảm latency nhưng stale nếu CORS config thay đổi.
- **Cookie với CORS**: Cần `withCredentials: true` (client) + `Allow-Credentials: true` + exact origin (server) — bộ ba thiếu một là không work.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                           | Đúng là                                                         |
| -------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| "CORS là security feature của API"           | CORS là browser policy — server-to-server requests không bị ảnh hưởng | CORS chỉ protect browser users, không thay thế auth/authz       |
| `Access-Control-Allow-Origin: *` cho mọi API | Cho phép mọi website gọi API — kết hợp với CSRF là thảm họa           | Whitelist specific origins; `*` chỉ cho public static APIs      |
| Thêm CORS header vào frontend code           | CORS header phải từ SERVER (backend), không phải client               | Config CORS tại Express/Nginx/API Gateway, không phải React app |

**🎯 Interview Pattern:**

- Khi thấy: "CORS error trong console" hoặc "Frontend không gọi được API?"
- → Nhớ đến: Missing `Access-Control-Allow-Origin` header từ server — không phải lỗi frontend
- → Mở đầu: "CORS error nghĩa là server chưa có header cho phép origin này — fix ở backend, không phải frontend..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Common Vulnerabilities](#8-common-vulnerabilities-owasp--lỗ-hổng-phổ-biến) — CSRF exploit SOP weaknesses
- ➡️ Để hiểu tiếp: [Encryption Fundamentals](#10-encryption--network-security-fundamentals) — HTTPS prevents MITM trong cross-origin requests

### 🟡 Q: What is Same-Origin Policy (SOP)?

**Origin** = scheme + host + port

```
https://example.com:443/path
  ↓         ↓         ↓
scheme    host       port
```

**SOP restrictions (Những gì BỊ CHẶN):**

| Action                                             | Bị chặn?                                  |
| -------------------------------------------------- | ----------------------------------------- |
| `fetch()` / `XMLHttpRequest` cross-origin          | ✅ Chặn response reading                  |
| `document.cookie` cross-origin                     | ✅ Chặn                                   |
| DOM access cross-origin (`iframe.contentDocument`) | ✅ Chặn                                   |
| `<img>`, `<script>`, `<link>` embedding            | ❌ Cho phép                               |
| Form submission (`<form action="...">`)            | ❌ Cho phép (→ đây là lý do CSRF tồn tại) |

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

| Header                             | Direction | Mô tả                                      |
| ---------------------------------- | --------- | ------------------------------------------ |
| `Origin`                           | Request   | Browser gửi, cho biết origin của request   |
| `Access-Control-Allow-Origin`      | Response  | Server cho phép origin nào                 |
| `Access-Control-Allow-Methods`     | Response  | HTTP methods được phép                     |
| `Access-Control-Allow-Headers`     | Response  | Custom headers được phép                   |
| `Access-Control-Allow-Credentials` | Response  | Cho phép gửi cookies cross-origin          |
| `Access-Control-Max-Age`           | Response  | Cache preflight response bao lâu (seconds) |

**Common mistakes:**

- ❌ `Access-Control-Allow-Origin: *` + `Access-Control-Allow-Credentials: true` → Browser sẽ REJECT
- ❌ Reflect `Origin` header without whitelist → any site can make credentialed requests
- ✅ Maintain explicit whitelist of allowed origins

---

## 10. Encryption & Network Security Fundamentals

> 🧠 **Memory Hook:** Thư mật mã — Symmetric = két một chìa (nhanh nhưng phải chia sẻ chìa khóa an toàn), Asymmetric = hộp thư hai chìa (public để gửi, private để mở), TLS = bắt tay bằng asymmetric rồi nói chuyện bằng symmetric.

**Tại sao tồn tại? / Why does this exist?**

Khi dữ liệu đi qua internet, mọi router trên đường đều có thể đọc nó nếu không được mã hóa — như gửi bưu thiếp postcard thay vì thư có phong bì kín.
→ **Why?** Mạng internet là shared infrastructure — ISP, router, wifi hotspot đều có thể intercept traffic.
→ **Why?** TLS/HTTPS mã hóa data in-transit để chỉ sender và receiver đọc được — ngay cả ISP chỉ thấy gibberish.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

**Symmetric** như két sắt với một chìa khóa — vừa nhanh, vừa đơn giản, nhưng phải tìm cách đưa chìa cho người kia mà không bị lộ. **Asymmetric** như hộp thư đặc biệt: ai cũng có thể bỏ thư vào (public key), nhưng chỉ chủ hộp mới mở được (private key). **TLS** dùng asymmetric để trao đổi chìa khóa symmetric an toàn, rồi dùng symmetric để mã hóa toàn bộ conversation — vì asymmetric quá chậm cho dữ liệu lớn.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
TLS Handshake (simplified):

Client → Server: "Xin chào, tôi support TLS 1.3"
Server → Client: Certificate (chứa public key) + server hello
Client:          Verify certificate against CA store
Client → Server: Encrypt(premaster_secret, server_public_key)
Server:          Decrypt(premaster_secret, server_private_key)
Both:            Derive session keys from premaster_secret
                 ← now all traffic encrypted with symmetric key →

Types:
  Symmetric:  AES-256        → fast, bulk encryption
  Asymmetric: RSA/ECC        → key exchange, signatures
  Hashing:    SHA-256/bcrypt → one-way, data integrity

At rest:    encrypt DB, S3 buckets → data breach = useless ciphertext
In transit: HTTPS/TLS → MITM gets encrypted noise
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **TLS termination at load balancer**: Traffic decrypted tại LB, re-encrypted to backend (or not!) — "internal" traffic vẫn cần encrypt nếu network không trusted.
- **Certificate pinning**: Mobile app pin expected certificate → MITM dùng self-signed cert sẽ bị detect. Nhưng pin sai cert = app broken.
- **Perfect Forward Secrecy (PFS)**: Session keys không derive từ long-term private key → compromising private key không decrypt past sessions.
- **Symmetric key rotation**: Encrypt data với key, key expire → cần re-encrypt → vừa tốn compute vừa phức tạp nhưng bắt buộc.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                                | Đúng là                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| "HTTPS là đủ, không cần encrypt DB"      | HTTPS chỉ protect data in-transit — DB breach = all data exposed plaintext | Encrypt sensitive columns/fields tại DB (encryption at rest) |
| Dùng MD5/SHA1 cho data integrity         | MD5 collision attacks đã được demo — không còn collision-resistant         | SHA-256 minimum cho integrity checks                         |
| Self-signed certificate trong production | Browser warning → users bypass → phishing vector                           | Use Let's Encrypt (free CA) hoặc trusted CA certificate      |

**🎯 Interview Pattern:**

- Khi thấy: "Bảo vệ data user như thế nào?" hoặc "HTTPS đã đủ chưa?"
- → Nhớ đến: Defense in depth — in-transit (TLS) + at-rest (encrypt DB) + key management
- → Mở đầu: "HTTPS bảo vệ in-transit nhưng chưa đủ — cần encrypt at rest và proper key rotation..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [CORS & Same-Origin Policy](#9-cors--same-origin-policy) — TLS là layer underneath HTTPS
- ➡️ Để hiểu tiếp: [Secrets Management](#12-secrets-management--quản-lý-bí-mật) — encryption keys là loại secret cần quản lý

### 🟡 Q: Encryption in transit vs at rest?

|              | In Transit                    | At Rest                              |
| ------------ | ----------------------------- | ------------------------------------ |
| **What**     | Data đang di chuyển (network) | Data đang lưu trữ (disk/DB)          |
| **Protocol** | TLS 1.3                       | AES-256                              |
| **Example**  | HTTPS, mTLS between services  | Database encryption, file encryption |

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

|                        | One-way TLS          | Mutual TLS (mTLS)                 |
| ---------------------- | -------------------- | --------------------------------- |
| Client verifies server | ✅                   | ✅                                |
| Server verifies client | ❌                   | ✅                                |
| Use case               | Browser → Web server | Service → Service (microservices) |

> In microservice architectures, mTLS ensures both sides of every connection are verified. Service meshes (Istio, Envoy) automate mTLS certificate rotation.

---

## 11. Access Control Models — Mô hình phân quyền

> 🧠 **Memory Hook:** Bảng phân quyền công ty — RBAC như "Giám đốc/Nhân viên/Thực tập sinh" (phân theo chức danh), ABAC như "Nhân viên Hà Nội chỉ xem dữ liệu chi nhánh HN, giờ hành chính" (phân theo thuộc tính), ReBAC như "bạn xem được tài liệu vì bạn được mời vào nhóm dự án đó".

**Tại sao tồn tại? / Why does this exist?**

Khi hệ thống lớn hơn, manage quyền từng user một trở nên không scalable — 10,000 users × 500 resources = 5 triệu permission entries cần quản lý.
→ **Why?** Cần abstraction layer — group users theo role hoặc attribute, assign permission cho group thay vì individual.
→ **Why?** Access control models là "policy language" — cho phép define rules một lần, apply tự động cho mọi user mới.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tòa nhà văn phòng có 3 cách cấp thẻ vào. **RBAC**: thẻ "Nhân viên" mở tầng 1-3, thẻ "Quản lý" mở tất cả — đơn giản, dễ quản lý. **ABAC**: thẻ của Lan chỉ hoạt động giờ 8-17h, chỉ ở tầng bộ phận Marketing — linh hoạt nhưng phức tạp hơn. **ReBAC**: bạn vào được phòng họp vì bạn được mời trong lịch họp đó — quyền dựa trên mối quan hệ. Mỗi mô hình có trade-off giữa đơn giản và linh hoạt.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Access Control Models Comparison:

RBAC (Role-Based):
  user → roles["admin", "editor"]
  role → permissions["read:all", "write:posts"]
  Check: user.roles.some(r => r.permissions.includes(action))

ABAC (Attribute-Based):
  subject: {dept: "finance", clearance: "secret"}
  resource: {type: "report", classification: "secret"}
  env:      {time: "09:00", ip: "internal"}
  policy:   subject.clearance >= resource.classification
            AND env.ip == "internal"

ReBAC (Relationship-Based, e.g., Google Zanzibar):
  document:123#viewer@user:alice
  document:123#editor@user:bob
  Check: "can alice view document:123?" → yes (direct viewer)
  Used by: Google Drive, GitHub

DAC → MAC → RBAC → ABAC → ReBAC (complexity increases →)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Role explosion**: RBAC với quá nhiều roles (1000+ custom roles) trở nên unmanageable — move to ABAC hay ReBAC.
- **Privilege escalation**: User A has role Admin; A exploit bug to assign Admin to user B. Fix: restrict role assignment permissions.
- **ReBAC performance**: Graph traversal cho relationship check expensive tại scale — Google Zanzibar dùng distributed caching.
- **Policy versioning**: ABAC policies cần version control và testing như code — policy change có thể accidentally lock out users.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                  | Tại sao sai                                                        | Đúng là                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| Hard-code permission check: `if (user.role === "admin")` | Không scalable — cần thêm role → sửa code ở 50 chỗ                 | Centralize permission check vào policy engine/middleware |
| "One super admin role cho everything"                    | Single point of compromise — admin account bị hack = toàn hệ thống | Least Privilege: break admin thành specific admin roles  |
| Không audit access control changes                       | Không biết ai thay đổi permission khi nào — compliance fail        | Log tất cả permission changes với timestamp và actor     |

**🎯 Interview Pattern:**

- Khi thấy: "Thiết kế permission system cho multi-tenant app" hoặc "RBAC vs ABAC?"
- → Nhớ đến: RBAC = simple và scalable cho hầu hết cases; ABAC khi cần fine-grained context-aware control
- → Mở đầu: "Tôi sẽ bắt đầu với RBAC — đủ cho hầu hết requirements và dễ implement. Nếu cần policy phức tạp hơn, upgrade lên ABAC..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Authentication vs Authorization](#3-authentication-vs-authorization--xác-thực-vs-phân-quyền) — access control models là cách implement AuthZ
- ➡️ Để hiểu tiếp: [Secrets Management](#12-secrets-management--quản-lý-bí-mật) — service accounts cũng cần access control

### 🔴 Q: Compare RBAC, ABAC, and ReBAC

| Model                          | Mô tả                                                   | Ví dụ                                                  |
| ------------------------------ | ------------------------------------------------------- | ------------------------------------------------------ |
| **RBAC** (Role-Based)          | Quyền gắn với role, user được assign role               | Admin, Editor, Viewer                                  |
| **ABAC** (Attribute-Based)     | Quyền dựa trên attributes (user, resource, environment) | "Allow if user.dept == resource.dept AND time < 18:00" |
| **PBAC** (Policy-Based)        | Policies written in language (Rego, Cedar)              | OPA (Open Policy Agent)                                |
| **ReBAC** (Relationship-Based) | Quyền dựa trên relationship graph                       | Google Zanzibar — "user:alice is editor of doc:123"    |

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
>
> - RBAC: đủ cho hầu hết apps (< 10 roles)
> - ABAC: complex policies, context-dependent access
> - ReBAC: Google-scale, hierarchical permissions, sharing features

---

## 12. Secrets Management — Quản lý bí mật

> 🧠 **Memory Hook:** Tủ đựng chìa khóa của quản lý tòa nhà — không ai được mang chìa khóa master về nhà, mỗi lần cần phải mượn từ tủ có log đầy đủ, chìa hết hạn tự động sau 8 tiếng, thay chìa không cần rebuild tòa nhà.

**Tại sao tồn tại? / Why does this exist?**

Secrets (API keys, DB passwords, certificates) hardcoded vào code → commit lên GitHub → bị scanner detect → bị exploit. Xảy ra hàng nghìn lần mỗi năm trên GitHub.
→ **Why?** Secrets thay đổi thường xuyên (rotation) nhưng code thay đổi ít hơn — tách riêng để rotate secret mà không redeploy app.
→ **Why?** Audit trail quan trọng — "ai access secret này lúc nào?" chỉ có secrets manager trả lời được, không phải .env file.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Quản lý tòa nhà có **tủ chìa khóa thông minh** (HashiCorp Vault / AWS Secrets Manager). Mỗi nhân viên không giữ chìa khóa riêng — khi cần, họ scan thẻ ID (authenticate), tủ ghi log "Lan mượn chìa phòng 304 lúc 9:05", chìa tự hết hạn sau 8 tiếng (TTL). Khi thay khóa (rotate secret), chỉ cần cập nhật tủ — không cần phát lại chìa cho 200 nhân viên. Nếu có nhân viên nghỉ việc, thu thẻ ID là xong.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Secrets Management Flow:

❌ BAD Pattern:
  code: DB_PASSWORD = "mypassword123"
  git commit → GitHub history → never fully deletable

✅ GOOD Pattern:
  App startup:
  1. Authenticate to Vault (AWS IAM / AppRole)
  2. Request secret: vault.get("prod/db/password")
  3. Vault returns secret + lease (TTL: 1hr)
  4. App uses secret → expires → renew or re-fetch

Secret Rotation:
  - Vault generates new DB password
  - Updates DB: ALTER USER SET PASSWORD
  - Old password invalidated
  - Apps that need it re-fetch automatically

Environment Variables (safer than code, not ideal):
  .env file → NOT committed → inject at deploy time
  Better: container secrets (Docker secrets, K8s secrets)
  Best:   HashiCorp Vault / AWS Secrets Manager / Azure KeyVault
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Secret sprawl**: Secrets scattered across .env files, config files, CI/CD variables — consolidate vào secrets manager.
- **Secret in logs**: `logger.info("Connecting with password: " + dbPass)` → secrets appear in log aggregator. Never log secrets.
- **Short-lived credentials**: AWS IAM roles với STS temp credentials (expire 1hr) tốt hơn long-lived access keys — nếu bị steal, window ngắn hơn.
- **Break-glass access**: Emergency access khi Vault down — cần pre-planned break-glass procedure với audit trail riêng.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                    | Đúng là                                                              |
| ----------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| Commit .env file lên git                  | Git history permanent — secret expose mãi mãi dù xóa file      | .gitignore .env; dùng .env.example; inject secrets at deploy         |
| Dùng cùng secret key cho dev/staging/prod | Dev environment leak expose prod credentials                   | Separate secrets per environment; prod secrets chỉ production team   |
| Không rotate secrets định kỳ              | Long-lived credentials = larger blast radius nếu bị compromise | Auto-rotation với secrets manager; short TTL cho service credentials |

**🎯 Interview Pattern:**

- Khi thấy: "Bạn manage credentials như thế nào?" hoặc "API key bị lộ phải làm gì?"
- → Nhớ đến: Immediate rotation → audit who accessed → investigate blast radius → implement secrets manager
- → Mở đầu: "Bước đầu tiên là rotate ngay lập tức — sau đó audit access logs xem ai đã dùng key đó..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Encryption Fundamentals](#10-encryption--network-security-fundamentals) — secrets thường là encryption keys
- ➡️ Để hiểu tiếp: [Security in SDLC](#17-security-in-sdlc--devsecops-basics) — secrets management là part of DevSecOps pipeline

### 🔴 Q: Where should you store secrets?

| Method                   | Security | Khi nào dùng                               |
| ------------------------ | -------- | ------------------------------------------ |
| ❌ Hardcoded in source   | Terrible | NEVER                                      |
| ⚠️ Environment variables | Basic    | Simple deployments, development            |
| ✅ Cloud Secret Manager  | Good     | AWS Secrets Manager, GCP Secret Manager    |
| ✅ HashiCorp Vault       | Best     | Enterprise, dynamic secrets, auto-rotation |
| ✅ K8s Sealed Secrets    | Good     | Kubernetes deployments                     |

**Principles:**

1. Never commit secrets to git (use `.env` in `.gitignore`)
2. Rotate secrets regularly (automate with Vault/cloud providers)
3. Use different secrets per environment (dev/staging/prod)
4. Audit secret access (who accessed what, when)
5. Encrypt secrets at rest in config stores

---

## Cross-Reference Map

| Shared Topic       | FE Implementation                                                             | BE Implementation                                                          |
| ------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| SQL Injection      | `fe-track/07-web-security/01-common-vulnerabilities.md` (Prisma)              | `be-track/02-backend-knowledge/04-auth-security.md` (database/sql)         |
| XSS Prevention     | `fe-track/07-web-security/01-common-vulnerabilities.md` (React JSX)           | `be-track/02-backend-knowledge/04-auth-security.md` (template escaping)    |
| CSRF Prevention    | `fe-track/07-web-security/03-web-security-comprehensive.md` (Next.js)         | `be-track/02-backend-knowledge/04-auth-security.md` (Go middleware)        |
| JWT Implementation | `fe-track/07-web-security/02-authentication.md` (jsonwebtoken)                | `be-track/02-backend-knowledge/04-auth-security.md` (Go JWT libraries)     |
| OAuth 2.0 Client   | `fe-track/07-web-security/02-authentication.md` (TS/fetch)                    | `be-track/02-backend-knowledge/04-auth-security.md` (Go HTTP handlers)     |
| CORS Configuration | `fe-track/07-web-security/03-web-security-comprehensive.md` (Next.js headers) | `be-track/02-backend-knowledge/04-auth-security.md` (rs/cors middleware)   |
| Rate Limiting      | `fe-track/07-web-security/01-common-vulnerabilities.md` (express-rate-limit)  | `be-track/02-backend-knowledge/04-auth-security.md` (Go middleware, Redis) |
| CSP                | `fe-track/07-web-security/03-web-security-comprehensive.md` (detailed)        | N/A (FE-specific)                                                          |
| mTLS               | N/A (BE-specific)                                                             | `be-track/02-backend-knowledge/04-auth-security.md`                        |
| Secrets Management | N/A                                                                           | `be-track/02-backend-knowledge/04-auth-security.md` (Vault, K8s)           |

---

## 13. Security Models — Mô hình bảo mật kinh điển

### 🟡 Q: What are Bell-LaPadula, Biba, and Clark-Wilson models? `[Mid]`

**A:** Đây là các mô hình nền tảng giúp định nghĩa policy bảo mật một cách có hệ thống.

| Model         | Trọng tâm                        | Quy tắc chính                             |
| ------------- | -------------------------------- | ----------------------------------------- |
| Bell-LaPadula | Confidentiality                  | No Read Up, No Write Down                 |
| Biba          | Integrity                        | No Read Down, No Write Up                 |
| Clark-Wilson  | Integrity trong business systems | Chỉ cập nhật qua quy trình hợp lệ + audit |

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

| Model | Ưu điểm                 | Nhược điểm       | Khi dùng                   |
| ----- | ----------------------- | ---------------- | -------------------------- |
| DAC   | Linh hoạt               | Dễ cấp quyền sai | Chia sẻ ad-hoc             |
| MAC   | Rất chặt                | Khó vận hành     | Môi trường high-security   |
| RBAC  | Đơn giản, phổ biến      | Role explosion   | App doanh nghiệp phổ thông |
| ABAC  | Linh hoạt theo ngữ cảnh | Policy phức tạp  | Zero trust, multi-tenant   |

---

## 15. Identity and Access Management (IAM) Concepts

### 🟢 Q: What is IAM? `[Junior]`

**A:** IAM quản lý danh tính, xác thực, phân quyền, và audit xuyên suốt vòng đời account.

### 🟡 Q: Identity vs principal vs credential? `[Mid]`

| Term       | Mô tả                                           |
| ---------- | ----------------------------------------------- |
| Identity   | Danh tính logic của user/service                |
| Principal  | Identity đã được xác thực trong request context |
| Credential | Bằng chứng xác thực: password/key/cert/token    |

### 🟡 Q: What are SSO and federation? `[Mid]`

**A:** SSO cho phép đăng nhập một lần dùng nhiều app; federation cho phép app tin cậy identity từ IdP bên ngoài.

### 🔴 Q: Explain Joiner-Mover-Leaver lifecycle `[Senior]`

| Phase  | Risk nếu làm kém             |
| ------ | ---------------------------- |
| Joiner | Cấp quyền quá rộng           |
| Mover  | Privilege creep              |
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

| Tiêu chí          | SAST                            | DAST                              |
| ----------------- | ------------------------------- | --------------------------------- |
| Thời điểm         | Sớm trong pipeline              | Môi trường chạy/staging/prod-safe |
| Mức nhìn          | Code-level                      | Behavior/runtime-level            |
| Lỗi phát hiện tốt | Injection patterns, unsafe APIs | Auth bypass, misconfiguration     |

### 🟡 Q: What is penetration testing? `[Mid]`

**A:** Pen test là hoạt động mô phỏng attacker do chuyên gia thực hiện, thường chain nhiều lỗ hổng để chứng minh impact.

### 🔴 Q: Why combine all three testing types? `[Senior]`

**A:** Vì không có một kỹ thuật nào phủ hết attack surface. Kết hợp giúp giảm điểm mù ở từng layer.

---

## 17. Security in SDLC — DevSecOps Basics

### 🟢 Q: What is DevSecOps? `[Junior]`

**A:** DevSecOps là tích hợp bảo mật vào mọi giai đoạn SDLC thay vì kiểm tra ở cuối.

### 🟡 Q: Security activities by phase `[Mid]`

| Phase        | Hoạt động bảo mật                            |
| ------------ | -------------------------------------------- |
| Requirements | Data classification, compliance, abuse cases |
| Design       | Threat modeling, trust boundaries            |
| Coding       | Secure coding + review checklist             |
| Build        | SAST, SCA, secret scan                       |
| Test         | DAST, authorization tests                    |
| Release      | Signed artifacts, security gates             |
| Operate      | Monitoring, incident response, patching      |

### 🟡 Q: What is threat modeling and why shift-left? `[Mid]`

**A:** Threat modeling giúp phát hiện attack path sớm khi chi phí sửa còn thấp, tránh redesign muộn.

### 🔴 Q: Which DevSecOps metrics matter? `[Senior]`

| Metric            | Ý nghĩa                             |
| ----------------- | ----------------------------------- |
| MTTD              | Thời gian phát hiện sự cố           |
| MTTR              | Thời gian xử lý sự cố               |
| Vulnerability SLA | Tỷ lệ vá đúng hạn                   |
| Patch latency     | Độ trễ cập nhật dependency critical |

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

**A:** **Authentication (AuthN)**: verifying _who_ you are — identity. **Authorization (AuthZ)**: verifying _what_ you're allowed to do — permissions. HTTP status: 401 Unauthorized = authentication failed. 403 Forbidden = authenticated but not authorized.

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

| Question         | Level | Key Point                                                           |
| ---------------- | ----- | ------------------------------------------------------------------- |
| CIA triad        | 🟢    | Confidentiality+Integrity+Availability; all decisions balance these |
| AuthN vs AuthZ   | 🟢    | AuthN=who (401); AuthZ=what permissions (403)                       |
| Defense in depth | 🟡    | Multiple independent layers; compromise one, others still protect   |

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu. Trả lời trong 2 phút. Nếu < 4/5 đúng → review lại section tương ứng.

| #   | Loại           | Câu hỏi                                                                                   |
| --- | -------------- | ----------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | CIA Triad là gì? Kể tên 3 trục và cho ví dụ thực tế cho mỗi trục                          |
| 2   | 🎨 Visual      | Vẽ sơ đồ OAuth 2.0 Authorization Code Flow với 4 roles và các bước trao đổi token         |
| 3   | 🛠️ Application | Hệ thống banking cần lưu passwords mới cho 10M users — bạn chọn thuật toán gì và tại sao? |
| 4   | 🐛 Debug       | Tìm lỗi: `SELECT * FROM users WHERE id=" + req.params.id` — lỗi gì, fix thế nào?          |
| 5   | 🎓 Teach       | Giải thích cho junior dev tại sao JWT không nên có TTL 7 ngày cho access token            |

💬 **Feynman Prompt:** Giải thích "Defense in Depth" cho một người không biết lập trình, dùng ví dụ như nhà có nhiều lớp khóa, chuông báo động, camera...

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Networking Fundamentals](../03-networking/) — hiểu HTTP/HTTPS/TLS trước khi học security
- ➡️ **Enables:** [Web Security](../../fe-track/07-web-security/) | [Auth & Security](../../be-track/02-backend-knowledge/04-auth-security.md) — apply security concepts vào frontend và backend
- 🔗 **Standards:** OWASP Top 10, NIST Cybersecurity Framework — industry references cho security decisions
