# Web Security & OWASP Top 10 / Bảo Mật Web và OWASP

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Security Fundamentals](./01-security-fundamentals.md) | [Cryptography](./02-cryptography-and-protocols.md) | [FE Web Security](../../fe-track/07-web-security/) | [BE Auth](../../be-track/02-backend-knowledge/04-auth-security.md)

## Real-World Scenario / Tình Huống Thực Tế

**Shopee Vietnam SQL Injection (2020, disclosed):** Attacker tìm thấy search API không sanitize input: `GET /search?q=' OR 1=1--` → server return toàn bộ product table. Với prepared statements, query sẽ treat `' OR 1=1--` là literal string, không execute như SQL code. Fix: migrate tất cả raw SQL queries sang parameterized queries. 0 additional lines of business logic — chỉ thay đổi cách query được built.

**Bài học:** OWASP Top 10 không phải checklist academic — đây là danh sách những lỗi thực tế đã gây breach cho hàng nghìn companies. Injection (SQL, NoSQL, Command) vẫn là #1 sau 15 năm.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Web security vulnerabilities giống những lỗ hổng kiến trúc nhà: SQL Injection như cửa không khóa (attacker đi thẳng vào), XSS như ai đó để lại ghi chú độc hại trong nhà bếp (người khác bị lừa khi đọc), CSRF như ai đó mạo nhận chữ ký của bạn trên tài liệu. Mỗi loại cần "vật liệu xây dựng" khác nhau để fix.

**Why it matters:** Bất kỳ web service nào expose API đều cần defend against OWASP Top 10. Junior developer được expect biết SQL injection và XSS. Senior được expect biết tất cả 10 và defense-in-depth patterns.

## Overview / Tổng Quan

- Tài liệu tổng hợp rủi ro web phổ biến theo OWASP Top 10 (2021) và kỹ thuật phòng thủ nhiều lớp.
- Covers: injection, XSS, CSRF, IDOR, security misconfiguration, and mitigation patterns.

## OWASP Top 10 Snapshot

> 🧠 **Memory Hook:** Bản đồ 10 cửa mà trộm hay dùng nhất để vào nhà — biết tên cửa, biết cách khóa.

**Tại sao tồn tại? / Why does this exist?**

Web application phải expose chính mình ra internet để hoạt động — mỗi endpoint là một attack surface tiềm năng. Không thể defend against mọi thứ cùng lúc, nên OWASP gộp data từ hàng nghìn real breaches để xếp hạng 10 nhóm lỗ hổng có tần suất và impact cao nhất.
→ **Why?** Developers cần tập trung nguồn lực vào rủi ro thực sự xảy ra, không phải lý thuyết.
→ **Why?** Root cause: security bị bỏ qua ở design phase, deadline pressure, và thiếu automated security gate trong CI/CD.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng một khu chung cư. Bảo vệ có bản đồ "10 cửa mà trộm hay dùng nhất trong xóm": cửa hầm để xe không có camera (Broken Access Control), két sắt tầng hầm dùng mã 1234 (Cryptographic Failures), thùng nhận bưu kiện mà ai cũng nhét đồ vào được (Injection). OWASP là bản đồ đó — tổng hợp từ hàng nghìn vụ trộm thực tế. Nó không nói bạn sẽ bị tấn công qua cả 10 cửa, nhưng biết tên từng cửa giúp bạn ưu tiên lắp khóa đúng chỗ trước khi trộm đến.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
OWASP Top 10 (2021) — Risk = Frequency × Impact

Rank | Category                          | Key Weakness
-----|-----------------------------------|---------------------------
A01  | Broken Access Control             | Missing authz checks
A02  | Cryptographic Failures            | Weak/missing encryption
A03  | Injection                         | Untrusted data as commands
A04  | Insecure Design                   | No security in requirements
A05  | Security Misconfiguration         | Default/wrong settings
A06  | Vulnerable Components             | Outdated dependencies
A07  | Auth & Session Failures           | Weak passwords/sessions
A08  | Software/Data Integrity Failures  | No integrity verification
A09  | Logging & Monitoring Failures     | Blind to active attacks
A10  | SSRF                              | Server fetches internal URLs

Data: 5,000+ apps, 500+ contributors, CVE databases
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- OWASP Top 10 không phải compliance checklist — "check hết 10" không có nghĩa là secure, chỉ là ưu tiên đúng
- Ranking thay đổi mỗi 4 năm: Injection từng là A01 (2013, 2017), hiện A03 — threat landscape evolves
- Một breach thường span nhiều categories: SQLi (A03) → no logging (A09) → escalate to admin (A01)
- Internal apps và microservices cũng cần OWASP — insider threat và lateral movement là real attack vectors

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                        | Đúng là                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| "Fix A03 Injection là xong phần quan trọng nhất" | A01 Broken Access Control phổ biến hơn Injection theo data 2021    | Ưu tiên theo threat model cụ thể của hệ thống, không chỉ ranking |
| "Dùng framework nổi tiếng = tự động secure"      | Framework giúp nhưng không ngăn logic flaws hay misconfiguration   | Security cần explicit config + code review + automated testing   |
| "OWASP chỉ cho web app truyền thống"             | REST API, GraphQL, microservices đều expose HTTP và đều vulnerable | Apply OWASP cho mọi HTTP-exposed service                         |

**🎯 Interview Pattern:**

- Khi thấy: "Bạn biết gì về web security?" hoặc "Kể các loại tấn công web phổ biến"
- → Nhớ đến: OWASP Top 10 là risk prioritization framework, không phải danh sách thuộc lòng
- → Mở đầu: "OWASP Top 10 là 10 nhóm rủi ro web phổ biến nhất theo data thực tế — tôi có thể giải thích attack path, impact và prevention cho bất kỳ nhóm nào..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Security Fundamentals](./01-security-fundamentals.md)
- ➡️ Để hiểu tiếp: [Cryptography & Protocols](./02-cryptography-and-protocols.md)

### Explanation / Giải thích

- OWASP là danh mục ưu tiên risk chứ không phải checklist hoàn chỉnh cho mọi hệ thống.
- Khi phỏng vấn, hãy nêu: attack path, impact, detection, prevention, verification.

### Example / Ví dụ

- Broken Access Control thường gây IDOR hoặc privilege escalation.
- Injection thường xuất hiện ở SQL/NoSQL/OS command khi thiếu validation và parameterization.

## A01:2021 Broken Access Control

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A02:2021 Cryptographic Failures

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A03:2021 Injection

> 🧠 **Memory Hook:** Viết lên phiếu đặt hàng nhà hàng "và hủy đơn của bàn kế bên" — server đọc và làm theo y lệnh.

**Tại sao tồn tại? / Why does this exist?**

Application thường xây dựng câu lệnh (SQL, OS command, LDAP) bằng cách nối chuỗi user input trực tiếp — trình thông dịch không phân biệt được đâu là "data" đâu là "lệnh". Kết quả là attacker có thể nhúng lệnh của riêng mình vào câu query.
→ **Why?** Developer dùng string concatenation vì tiện, không nghĩ đến trust boundary giữa data và code.
→ **Why?** Root cause: không có separation of intent — application treat user input như trusted instruction, không phải untrusted data.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn ghi phiếu đặt hàng cho nhà hàng: "Một tô phở, tái chín." Nhân viên đọc phiếu và ghi vào sổ bếp. Nhưng nếu bạn viết: "Một tô phở; xóa toàn bộ hóa đơn hôm nay" — và nhân viên chỉ copy nguyên xi vào sổ — bếp sẽ thực hiện cả lệnh xóa! SQL Injection là vậy: attacker nhét lệnh SQL vào trong "dữ liệu", và database thực hiện toàn bộ. Parameterized queries giống như in sẵn form với ô trống riêng — nhân viên không thể nhét thêm lệnh vào ô data.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Vulnerable (string concat):
  query = "SELECT * FROM users WHERE name='" + userInput + "'"
  userInput = "' OR '1'='1"
  → "SELECT * FROM users WHERE name='' OR '1'='1'"
  → Trả về toàn bộ users!

Parameterized (safe):
  query = "SELECT * FROM users WHERE name = ?"
  params = [userInput]
  → Database treat userInput là DATA, không phải SQL code
  → "' OR '1'='1" được escape → không có lỗ hổng

Injection types:
  SQL Injection      → databases (MySQL, Postgres, MSSQL)
  NoSQL Injection    → MongoDB ($where, $regex operators)
  OS Command         → shell(), exec(), system() calls
  LDAP Injection     → directory services
  Template Injection → server-side templates (Jinja2, Twig)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- ORM không đảm bảo safe — raw queries trong ORM (`db.raw()`, `$queryRaw`) vẫn vulnerable nếu concat input
- Stored procedures cũng vulnerable nếu chúng build dynamic SQL nội bộ
- Input escaping ≠ parameterization — escaping có thể bypass qua charset encoding tricks; parameterized là cách duy nhất đáng tin cậy
- Blind SQLi (không có error message visible) vẫn khai thác được qua timing attacks và boolean-based inference

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                                      | Đúng là                                                             |
| ----------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| "Dùng ORM là tự động safe khỏi SQLi"            | ORM raw query methods vẫn vulnerable nếu concat input            | Luôn dùng parameterized binding, kể cả trong ORM                    |
| "Escape single quotes là đủ để phòng injection" | Charset-level bypasses và các injection types khác không bị chặn | Chỉ dùng parameterized queries / prepared statements                |
| "WAF là đủ để block SQL injection"              | WAF có thể bypass bằng encoding, comments, whitespace tricks     | WAF là defense-in-depth layer, không thay thế parameterized queries |

**🎯 Interview Pattern:**

- Khi thấy: câu hỏi về SQL injection hoặc "làm sao fix login form bị inject"
- → Nhớ đến: separation of data vs code + parameterized queries là fix duy nhất đáng tin
- → Mở đầu: "SQL Injection xảy ra khi user input được nhúng trực tiếp vào SQL query — fix đúng là parameterized queries, không phải escaping, vì..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [OWASP Top 10 Overview](#owasp-top-10-snapshot)
- ➡️ Để hiểu tiếp: [XSS Deep Dive](#xss-deep-dive)

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A04:2021 Insecure Design

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A05:2021 Security Misconfiguration

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A06:2021 Vulnerable and Outdated Components

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A07:2021 Identification and Authentication Failures

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A08:2021 Software and Data Integrity Failures

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A09:2021 Security Logging and Monitoring Failures

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## A10:2021 Server-Side Request Forgery (SSRF)

### Overview / Tổng Quan

- Đây là nhóm rủi ro có impact cao và xuất hiện thường xuyên trong sản phẩm thực tế.

### Explanation / Giải thích

- Cần defense-in-depth: secure design + secure coding + secure config + monitoring + incident response.
- Không có một control đơn lẻ nào đủ mạnh cho mọi trường hợp; cần phối hợp nhiều tầng.

### Example / Ví dụ

- Ví dụ khai thác: attacker tìm input vector, bypass validation, sau đó mở rộng phạm vi tấn công.
- Ví dụ phòng thủ: deny-by-default, object-level authorization, strict validation, structured logging.

### Interview Angle

- Nêu rõ cách test: unit security tests, integration tests, DAST/SAST, pentest, chaos security drills.
- Nêu rõ metrics: attack blocked rate, false positive rate, MTTD/MTTR, patch lead time.

## XSS Deep Dive

> 🧠 **Memory Hook:** Dán tờ rơi lừa đảo lên bảng thông báo chung cư — mọi cư dân đọc bảng đều bị lừa.

**Tại sao tồn tại? / Why does this exist?**

Browser tin tưởng và execute mọi script có trong HTML của một trang — đó là cách web hoạt động. Nếu attacker inject được script của mình vào HTML đó, browser của victim sẽ chạy script đó với full quyền của trang web đó.
→ **Why?** Application render user-generated content vào HTML mà không escape — browser không phân biệt được script của developer và script của attacker.
→ **Why?** Root cause: trust boundary bị phá vỡ — untrusted data được treat như trusted HTML/JS code.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bảng thông báo chung cư có nội quy: "Ai cũng có thể dán thông báo." Một người ác ý dán tờ rơi: "Quản lý gửi thông báo khẩn: vui lòng nhập mật khẩu WiFi tại đây." Mọi cư dân đọc bảng đều nghĩ đây là thông báo chính thức và nhập mật khẩu. XSS là vậy: attacker inject script vào trang web, và mọi user ghé thăm trang đó đều chạy script đó — script có thể đánh cắp cookie, redirect đến phishing page, hay thực hiện hành động thay user.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
3 loại XSS:

1. Stored XSS (Persistent):
   Attacker → POST comment "<script>stealCookies()</script>"
   Server lưu vào DB
   Victim load page → server render script → browser execute
   → Nguy hiểm nhất: ảnh hưởng tất cả users

2. Reflected XSS (Non-Persistent):
   Attacker gửi link: "https://site.com/search?q=<script>...</script>"
   Server render q trong response HTML
   Victim click link → browser execute script
   → Cần social engineering để victim click

3. DOM-based XSS:
   JS client-side đọc location.hash → innerHTML = hash value
   Không qua server → không server-side fix được
   → Fix: never use innerHTML with untrusted data

Prevention:
  ✓ Output encoding (HTML escape: < → &lt;)
  ✓ React/Vue auto-escape JSX/template interpolation
  ✓ DOMPurify for rich text (user HTML)
  ✓ Content-Security-Policy header (defense in depth)
  ✗ NEVER: dangerouslySetInnerHTML with user input
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- React auto-escapes `{userInput}` trong JSX nhưng `dangerouslySetInnerHTML` bypass hoàn toàn — cần DOMPurify
- CSP là defense-in-depth, không phải primary fix — nếu inject được vào existing script tag thì CSP không giúp
- HttpOnly cookie flag giới hạn thiệt hại — attacker không đọc được cookie qua JS, nhưng vẫn có thể thực hiện hành động
- DOM XSS ngày càng phổ biến hơn trong SPA vì nhiều data flow qua client-side JS

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                                   | Đúng là                                                                 |
| --------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| "Dùng React là tự động safe khỏi XSS"         | `dangerouslySetInnerHTML`, `eval()`, DOM sinks vẫn vulnerable | Tránh DOM sinks với user data; dùng DOMPurify khi cần render HTML       |
| "CSP header là fix cho XSS"                   | CSP là defense-in-depth layer, không ngăn injection tại gốc   | Primary fix là output encoding; CSP giảm thiệt hại nếu injection xảy ra |
| "Server-side input validation đủ để chặn XSS" | XSS là output problem, không phải input problem               | Fix ở output layer: escape theo context (HTML, JS, URL, CSS)            |

**🎯 Interview Pattern:**

- Khi thấy: "Làm sao bảo vệ comment section?" hoặc "Rich text editor có rủi ro gì?"
- → Nhớ đến: XSS = inject script qua untrusted content; fix = output encoding + DOMPurify + CSP
- → Mở đầu: "Đây là Stored XSS risk — attacker có thể inject script vào comment, và mọi user load trang đều chạy script đó. Fix cần 3 lớp..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Injection Attacks](#a032021-injection)
- ➡️ Để hiểu tiếp: [CSRF](#csrf)

### Overview / Tổng Quan

- Phần này đi sâu vào XSS Deep Dive để chuẩn bị câu hỏi phỏng vấn senior-level.

### Explanation / Giải thích

- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.

### Example / Ví dụ

- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.

### Practical Checklist

- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## CSRF

> 🧠 **Memory Hook:** Giả chữ ký trên đơn rút tiền ngân hàng — ngân hàng tin vì đúng cookie, không cần biết bạn có ký thật không.

**Tại sao tồn tại? / Why does this exist?**

Browser tự động gửi kèm cookie (kể cả session cookie) với mọi request đến domain tương ứng — đây là tính năng thiết kế của web, không phải bug. Attacker lợi dụng hành vi này để làm browser của victim gửi request đến server mà server tin là hợp lệ vì có cookie đúng.
→ **Why?** Server không thể phân biệt được request do user chủ động gửi hay do attacker "bắt tay" gửi thay.
→ **Why?** Root cause: cookie được gửi tự động theo domain, không theo "ai tạo ra request" — không có mechanism xác nhận intent.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bạn vào ngân hàng buổi sáng và họ nhận diện được bạn qua thẻ VIP (session cookie). Buổi chiều, một kẻ gian gửi đơn rút tiền đến ngân hàng có ghi "Khách hàng VIP số 123 xin rút 50 triệu" — và nhét thẻ VIP của bạn vào phong bì (browser tự gửi cookie). Ngân hàng thấy thẻ VIP hợp lệ, chấp thuận. CSRF là vậy: bạn không ký đơn, nhưng ngân hàng không kiểm tra chữ ký — chỉ kiểm tra thẻ VIP. CSRF token là yêu cầu "phải ký tên thật" vào từng đơn.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Attack flow:
  1. Alice đăng nhập bank.com → session cookie được set
  2. Alice ghé evil.com (vẫn đang đăng nhập bank.com)
  3. evil.com chứa: <img src="https://bank.com/transfer?to=hacker&amount=1000000">
  4. Browser Alice tự gửi GET request đến bank.com KÈM session cookie
  5. Bank.com thấy cookie hợp lệ → thực hiện transfer!

Prevention options:

  Option 1 — CSRF Token:
    Server tạo random token → embed vào form
    Client gửi token trong header/body
    Attacker không đọc được token (same-origin policy) → fail

  Option 2 — SameSite Cookie:
    SameSite=Lax:    không gửi cookie với cross-site POST
    SameSite=Strict: không gửi cookie bất kỳ cross-site request nào
    → Modern browsers default Lax

  Option 3 — JWT in Authorization header:
    Browser không auto-send Authorization header
    → Immune to CSRF by design
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- SPA + JWT trong Authorization header = không cần CSRF token vì browser không auto-send custom headers
- Nhưng JWT trong localStorage = vulnerable to XSS → đây là tradeoff: CSRF-safe vs XSS-safe
- SameSite=Lax vẫn allow GET cross-site requests — state-changing actions phải dùng POST/PUT/DELETE
- Subdomain isolation: CSRF token trong cookie phải set `Domain` cẩn thận vì subdomain có thể đọc cookie của parent

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                                          | Đúng là                                                      |
| ---------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| "SPA dùng JWT trong cookie vẫn immune to CSRF" | JWT trong cookie cũng được auto-sent như session cookie              | JWT phải để trong Authorization header, hoặc thêm CSRF token |
| "CORS header là fix cho CSRF"                  | CORS kiểm soát đọc response, không ngăn browser gửi request          | CSRF token hoặc SameSite cookie là fix đúng                  |
| "Only POST requests are vulnerable to CSRF"    | GET requests cũng vulnerable nếu có side effects (xem ví dụ img tag) | State-changing operations phải dùng POST + CSRF token        |

**🎯 Interview Pattern:**

- Khi thấy: "Tại sao SPA + JWT an toàn hơn session cookie với CSRF?" hoặc "Giải thích SameSite cookie"
- → Nhớ đến: CSRF = attacker lợi dụng browser auto-gửi cookie; fix = không dùng cookie hoặc thêm proof-of-intent
- → Mở đầu: "CSRF xảy ra vì browser tự động gửi cookie — server không biết request đến từ user thật hay attacker. Có 3 cách fix..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [XSS Deep Dive](#xss-deep-dive)
- ➡️ Để hiểu tiếp: [SSRF](#ssrf)

### Overview / Tổng Quan

- Phần này đi sâu vào CSRF để chuẩn bị câu hỏi phỏng vấn senior-level.

### Explanation / Giải thích

- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.

### Example / Ví dụ

- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.

### Practical Checklist

- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## SQL Injection

### Overview / Tổng Quan

- Phần này đi sâu vào SQL Injection để chuẩn bị câu hỏi phỏng vấn senior-level.

### Explanation / Giải thích

- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.

### Example / Ví dụ

- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.

### Practical Checklist

- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## SSRF

> 🧠 **Memory Hook:** Nhờ nhân viên văn phòng gửi thư nội bộ — họ có thể vào khu vực mà bạn không được phép vào.

**Tại sao tồn tại? / Why does this exist?**

Server thường có quyền truy cập vào internal network, metadata services, và các services nội bộ mà client bên ngoài không được phép. Nếu server fetch URL theo yêu cầu của user mà không kiểm tra URL đó trỏ đến đâu, attacker có thể làm server trở thành proxy để truy cập các resource nội bộ.
→ **Why?** Internal services thường assume "nếu request từ trong network = trusted" — thiếu authentication vì không expect external access.
→ **Why?** Root cause: trust boundary không được enforce tại application layer — chỉ dựa vào network perimeter.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng một công ty có nhân viên lễ tân (web server) nhận bưu kiện từ bên ngoài. Khách hàng gửi yêu cầu: "Vui lòng chuyển gói này đến địa chỉ X." Nhân viên lễ tân có thẻ từ vào được tất cả phòng trong tòa nhà — kể cả phòng server, phòng giám đốc, phòng lưu trữ mật. Attacker gửi yêu cầu: "Chuyển đến phòng server tầng B1." Nhân viên ngây thơ đi vào và mang thông tin ra ngoài. SSRF là vậy: bạn không vào được khu nội bộ, nhưng bạn nhờ nhân viên đi thay.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Attack flow:
  User input: "https://169.254.169.254/latest/meta-data/iam/credentials"
       ↓
  Web server fetch URL (ví dụ: để preview link)
       ↓
  AWS/GCP metadata service trả về cloud credentials!
       ↓
  Attacker nhận credentials → full AWS account access

Common SSRF targets:
  • Cloud metadata:   169.254.169.254 (AWS/GCP/Azure)
  • Internal services: http://internal-db:5432, http://redis:6379
  • Admin panels:      http://localhost:8080/admin
  • File system:       file:///etc/passwd

Prevention:
  ✓ Allowlist: chỉ cho phép fetch từ approved external domains
  ✓ Block private IP ranges: 10.x, 172.16.x, 192.168.x, 127.x, 169.254.x
  ✓ Disable HTTP redirects (attacker dùng redirect để bypass IP check)
  ✓ Egress firewall: server không được connect ra ngoài allowlist
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- DNS rebinding attack: URL ban đầu resolve ra public IP (pass IP check), sau đó DNS rebind sang private IP
- HTTP redirect bypass: attacker dùng URL redirect từ trusted domain sang private IP — phải check final destination IP
- Protocol smuggling: `gopher://`, `file://`, `dict://` có thể bypass HTTP-only filters
- Cloud environments đặc biệt nguy hiểm vì metadata service luôn available tại `169.254.169.254`

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                      | Đúng là                                                                       |
| ------------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| "Block IP 127.0.0.1 là đủ"                       | Private ranges, IPv6 loopback, cloud metadata IPs đều là targets | Block toàn bộ private IP ranges + metadata IPs + chỉ allowlist public domains |
| "DNS lookup trước khi connect là đủ để check IP" | DNS rebinding: IP thay đổi giữa lookup và connect                | Check IP tại thời điểm connect, không phải lookup; dùng egress firewall       |
| "SSRF chỉ nguy hiểm nếu có response leak"        | Blind SSRF vẫn có thể port scan nội bộ, trigger internal actions | SSRF nguy hiểm kể cả khi response không trả về cho attacker                   |

**🎯 Interview Pattern:**

- Khi thấy: "Thiết kế service fetch URL từ user" hoặc "Webhook handler có rủi ro gì?"
- → Nhớ đến: SSRF = server trở thành proxy vào internal network; fix = allowlist + block private IPs + egress firewall
- → Mở đầu: "Service này có SSRF risk — server có thể bị dùng để fetch cloud metadata hoặc internal services. Cần 3 lớp phòng thủ..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [CSRF](#csrf)
- ➡️ Để hiểu tiếp: [API Security](#api-security)

### Overview / Tổng Quan

- Phần này đi sâu vào SSRF để chuẩn bị câu hỏi phỏng vấn senior-level.

### Explanation / Giải thích

- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.

### Example / Ví dụ

- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.

### Practical Checklist

- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## Authentication Attacks

### Overview / Tổng Quan

- Phần này đi sâu vào Authentication Attacks để chuẩn bị câu hỏi phỏng vấn senior-level.

### Explanation / Giải thích

- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.

### Example / Ví dụ

- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.

### Practical Checklist

- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## API Security

> 🧠 **Memory Hook:** Bảo vệ quầy giao dịch ngân hàng — mỗi khách chỉ xem tài khoản của mình, có giới hạn số lượt giao dịch mỗi ngày.

**Tại sao tồn tại? / Why does this exist?**

API là attack surface chính của modern applications — REST, GraphQL, mobile backend đều expose business logic trực tiếp. Không giống web page (có browser protection), API thường accessible bởi script, curl, và automated tools — attacker có thể probe với tốc độ cao và tự động.
→ **Why?** Developer thường build API functional-first, bỏ qua authentication, rate limiting, và input validation cho đến khi deploy.
→ **Why?** Root cause: API security đòi hỏi mọi endpoint phải được explicitly secured — không có "secure by default" mechanism nào.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Quầy giao dịch ngân hàng có nhiều quy tắc bảo vệ: giao dịch viên chỉ xem tài khoản của đúng khách hàng đang đứng trước mặt (authentication + authorization), mỗi khách chỉ được 10 giao dịch mỗi ngày (rate limiting), phải điền đúng form và có chữ ký (input validation), và camera ghi lại tất cả (audit logging). Nếu thiếu bất kỳ quy tắc nào, kẻ gian sẽ lợi dụng đúng chỗ đó. API security là thiết kế những quy tắc đó cho từng endpoint.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
API Security Layers:

┌──────────────────────────────────────────────┐
│  1. Authentication — "Bạn là ai?"            │
│     JWT, API key, OAuth2, mTLS               │
├──────────────────────────────────────────────┤
│  2. Authorization — "Bạn được làm gì?"       │
│     RBAC/ABAC, object-level authz (BOLA)    │
├──────────────────────────────────────────────┤
│  3. Rate Limiting — "Bạn được làm bao nhiêu?"│
│     Per-IP, per-user, per-token              │
├──────────────────────────────────────────────┤
│  4. Input Validation — "Dữ liệu có đúng?"   │
│     Schema validation, type check, size cap  │
├──────────────────────────────────────────────┤
│  5. Audit Logging — "Ai đã làm gì?"         │
│     Request ID, user ID, timestamp, action   │
└──────────────────────────────────────────────┘

OWASP API Security Top 10 (2023):
  API1 — Broken Object Level Auth (BOLA/IDOR)  ← most common
  API2 — Broken Authentication
  API3 — Broken Object Property Level Auth
  API4 — Unrestricted Resource Consumption
  API5 — Broken Function Level Auth
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- GraphQL có thể bypass rate limiting nếu chỉ limit per-request thay vì per-query complexity score
- API versioning: legacy endpoints vẫn được maintain → có thể miss security patches trong version cũ
- Mobile app API often hardcode API keys → key rotation strategy phải được design upfront
- Microservices internal APIs cũng cần auth — không assume "nếu từ internal network = trusted" (zero trust)

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                                                             | Đúng là                                                                               |
| -------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| "Rate limit theo IP là đủ"       | Attacker rotate IP qua proxy/VPN; legitimate users share IP qua NAT     | Rate limit theo user ID + token fingerprint + IP kết hợp                              |
| "Authentication = Authorization" | Authenticated user vẫn có thể truy cập object của user khác (BOLA/IDOR) | Luôn check object ownership: `if (resource.userId !== req.user.id) return 403`        |
| "Internal API không cần auth"    | Compromised service hoặc insider threat có thể abuse internal APIs      | Zero trust: mọi service-to-service call đều cần authentication (mTLS, service tokens) |

**🎯 Interview Pattern:**

- Khi thấy: "Design API cho e-commerce" hoặc "API này có vấn đề bảo mật gì?"
- → Nhớ đến: 5 layers (authn, authz, rate limit, validation, logging) + BOLA là #1 OWASP API risk
- → Mở đầu: "Trước tiên tôi sẽ kiểm tra authentication và object-level authorization — BOLA là lỗi phổ biến nhất trong API..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SSRF](#ssrf)
- ➡️ Để hiểu tiếp: [Security Headers](#security-headers)

### Overview / Tổng Quan

- Phần này đi sâu vào API Security để chuẩn bị câu hỏi phỏng vấn senior-level.

### Explanation / Giải thích

- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.

### Example / Ví dụ

- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.

### Practical Checklist

- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## Security Headers

> 🧠 **Memory Hook:** Biển báo giao thông cho trình duyệt — chỉ dẫn trình duyệt nên tin ai, chặn ai, không tự quyết.

**Tại sao tồn tại? / Why does this exist?**

Browser cần được chỉ dẫn rõ ràng về security policy vì mặc định nó sẽ tin tưởng nhiều thứ hơn cần thiết. HTTP security headers là cơ chế để server nói với browser "đây là policy cho trang này — follow it."
→ **Why?** Browser không tự biết được script nào là legitimate của developer và script nào là injected — cần server khai báo rõ ràng.
→ **Why?** Root cause: web được thiết kế với open trust model (mọi script trong trang đều tin tưởng) — security headers là cách retrofit security policy vào sau.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hệ thống biển báo giao thông không chờ tài xế tự quyết định có nên vượt đèn đỏ hay không — biển báo chỉ dẫn rõ ràng: "Dừng," "Cấm rẽ trái," "Tốc độ tối đa 60km/h." Security headers là biển báo đó cho trình duyệt: Content-Security-Policy nói "chỉ chạy script từ những domain này," Strict-Transport-Security nói "chỉ kết nối HTTPS trong 1 năm tới," X-Frame-Options nói "không cho phép trang này nhúng vào iframe của ai." Trình duyệt nghe theo và từ chối những gì không được phép.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Header                         | Chống lại            | Ví dụ giá trị
-------------------------------|----------------------|---------------------------------------------
Content-Security-Policy (CSP)  | XSS, data injection  | "default-src 'self'; script-src 'nonce-xxx'"
Strict-Transport-Security      | SSL stripping/MITM   | "max-age=31536000; includeSubDomains; preload"
X-Frame-Options                | Clickjacking         | "DENY" hoặc "SAMEORIGIN"
X-Content-Type-Options         | MIME sniffing        | "nosniff"
Referrer-Policy                | Info leakage         | "strict-origin-when-cross-origin"
Permissions-Policy             | Feature abuse        | "camera=(), microphone=(), geolocation=()"
Cross-Origin-Resource-Policy   | Spectre/data leak    | "same-origin"

CSP Levels:
  Basic:   "default-src 'self'"           → chỉ cho phép same-origin resources
  Better:  + "script-src 'nonce-{rand}'"  → chỉ script có nonce mới chạy được
  Best:    + "report-uri /csp-report"     → log violations để detect attack attempts
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- CSP `unsafe-inline` defeats toàn bộ XSS protection của CSP — nếu cần inline script thì dùng nonce/hash thay vì unsafe-inline
- HSTS preload list có ý nghĩa lớn — khi submit vào browser's built-in list, không thể revert trong nhiều năm; test kỹ trước
- CSP quá strict có thể break third-party scripts (analytics, chat widgets) — phải balance security vs functionality
- `X-Frame-Options` bị replace bởi `Content-Security-Policy: frame-ancestors` trong modern spec — nhưng cả hai nên set để backward compat

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                  | Tại sao sai                                                                         | Đúng là                                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| "Có CSP là không cần sanitize input"                     | CSP là defense-in-depth — nếu inject được vào existing script tag, CSP không giúp   | Input sanitization là primary fix; CSP giảm blast radius nếu injection xảy ra |
| "Chỉ cần `Content-Type: application/json` là đủ cho API" | Thiếu CORS, HSTS, X-Content-Type-Options làm API vulnerable thêm                    | API cũng cần đầy đủ security headers                                          |
| "`unsafe-inline` trong CSP là ok nếu chỉ tạm thời"       | "Tạm thời" thường trở thành permanent; unsafe-inline defeats toàn bộ XSS protection | Dùng nonce hoặc hash cho inline scripts ngay từ đầu                           |

**🎯 Interview Pattern:**

- Khi thấy: "Làm sao thêm security cho web app?" hoặc "CSP là gì và tại sao cần?"
- → Nhớ đến: Security headers là browser-level policy enforcement — không thay thế server-side fix nhưng là critical defense layer
- → Mở đầu: "Security headers là cách server chỉ dẫn browser về policy — tôi sẽ bắt đầu với CSP để giới hạn script execution, HSTS để enforce HTTPS, và..."

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [API Security](#api-security)
- ➡️ Để hiểu tiếp: [BE Auth Security](../../be-track/02-backend-knowledge/04-auth-security.md)

### Overview / Tổng Quan

- Phần này đi sâu vào Security Headers để chuẩn bị câu hỏi phỏng vấn senior-level.

### Explanation / Giải thích

- Mô tả đầy đủ: entry points, prerequisites, exploit chain, business impact, and layered mitigations.
- Liên hệ thực tế với web app hiện đại: SPA + API backend + CDN + reverse proxy + cloud services.

### Example / Ví dụ

- Tình huống 1: triển khai thiếu policy dẫn tới bypass.
- Tình huống 2: khắc phục bằng secure-by-default và automation checks trong CI/CD.
- Tình huống 3: thêm observability để phát hiện bất thường theo thời gian thực.

### Practical Checklist

- Input validation theo schema, output encoding theo context, strict authz checks.
- Secret management chuẩn, headers chuẩn, and least-privilege service identity.
- Thêm regression tests để không tái phát lỗ hổng sau refactor.

## Defense in Depth Blueprint

### Overview / Tổng Quan

- Thiết kế web security nên theo nhiều lớp từ client, edge, app, data, đến ops.

### Explanation / Giải thích

- Nếu một lớp bị bypass, lớp tiếp theo vẫn phải giảm thiểu blast radius.

### Example / Ví dụ

- Client: CSP + input constraints.
- Edge: WAF + bot protection + rate limiting.
- App: authz + validation + secure session management.
- Data: encryption + least privilege + audit log.
- Ops: patch cadence + incident runbook + tabletop exercise.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] IDOR là gì?

- **Trả lời:** IDOR là lỗi truy cập object theo ID mà không kiểm tra quyền sở hữu/ủy quyền tương ứng.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🟢 [Junior] Vì sao server-side validation bắt buộc?

- **Trả lời:** Vì attacker có thể bypass mọi kiểm tra phía client bằng request thủ công.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🟡 [Mid] Làm sao giảm rủi ro XSS trong SPA?

- **Trả lời:** Dùng output encoding đúng context, tránh dangerouslySetInnerHTML, bật CSP nonce/hash, và sanitize dữ liệu giàu định dạng.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🟡 [Mid] Rate limiting nên đặt theo gì?

- **Trả lời:** Kết hợp IP, user ID, token fingerprint, và hành vi để tránh bypass khi attacker rotate IP.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🔴 [Senior] Thiết kế chống SSRF cho dịch vụ fetch URL như thế nào?

- **Trả lời:** Bắt buộc allowlist domain, chặn private CIDR/link-local, disable redirect không tin cậy, và egress firewall.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🔴 [Senior] Ưu tiên gì trong giờ đầu incident security?

- **Trả lời:** Containment trước, bảo toàn evidence, rotate secrets, thông báo stakeholders, và bắt đầu timeline điều tra.
- **Giải thích:** Luôn nhấn mạnh cả prevention lẫn detection để thể hiện tư duy vận hành.

### 🟢 [Junior] Practice question 1: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 2: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 3: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 4: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 5: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 6: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 7: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 8: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 9: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 10: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 11: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 12: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 13: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 14: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 15: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 16: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 17: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 18: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 19: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 20: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 21: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 22: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 23: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 24: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 25: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 26: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 27: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 28: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 29: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 30: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 31: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 32: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 33: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 34: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 35: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 36: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 37: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 38: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 39: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 40: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 41: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 42: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 43: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 44: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 45: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 46: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 47: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 48: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 49: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟢 [Junior] Practice question 50: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 51: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 52: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 53: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 54: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 55: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 56: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 57: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 58: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 59: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 60: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 61: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 62: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 63: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 64: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 65: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 66: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 67: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 68: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 69: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 70: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 71: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 72: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 73: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 74: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 75: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 76: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 77: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 78: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 79: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 80: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 81: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 82: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 83: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 84: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 85: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 86: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 87: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 88: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 89: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 90: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 91: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 92: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 93: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 94: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 95: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 96: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 97: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 98: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 99: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 100: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 101: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 102: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 103: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 104: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🟡 [Mid] Practice question 105: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 106: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 107: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 108: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 109: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 110: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 111: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 112: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 113: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 114: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 115: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 116: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 117: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 118: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 119: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 120: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 121: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 122: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 123: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 124: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 125: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 126: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 127: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 128: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 129: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 130: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 131: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 132: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 133: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 134: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 135: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 136: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 137: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 138: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 139: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 140: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 141: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 142: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 143: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 144: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 145: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 146: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 147: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 148: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 149: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

### 🔴 [Senior] Practice question 150: How would you analyze and mitigate a web security risk under OWASP?

- **Trả lời:** Xác định vector tấn công, điều kiện khai thác, mức impact, sau đó áp dụng layered controls và xác minh bằng test + telemetry.
- **Giải thích:** Nếu chỉ nêu mitigation mà không nêu detection/verification thì câu trả lời chưa đủ production-grade.
- **Ví dụ:** Với API public, áp dụng schema validation, authz theo resource owner, rate limit đa chiều, và cảnh báo bất thường theo baseline.

## Cross-References

- Security fundamentals: `./01-security-fundamentals.md`
- Cryptography and protocols: `./02-cryptography-and-protocols.md`

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is SQL injection and how do you prevent it? / SQL injection và cách phòng chống? 🟢 Junior

**A:** SQL injection: user input concatenated into SQL queries → attacker modifies query structure to extract/modify data.

```sql
-- VULNERABLE:
query = "SELECT * FROM users WHERE email = '" + userInput + "'";
-- userInput = "admin' OR '1'='1"
-- → "...WHERE email = 'admin' OR '1'='1'" → ALL users returned!

-- PREVENTION — parameterized queries:
query = "SELECT * FROM users WHERE email = $1", [userInput]
-- Input treated as DATA not SQL → cannot escape string context
```

Prevention priority: (1) Parameterized queries (only reliable defense), (2) ORM (uses params by default), (3) Input validation (secondary), (4) WAF (last resort).

Vietnamese explanation: SQLi là OWASP #1 nhiều năm. Parameterized queries là ONLY reliable prevention — input validation không đủ (attackers encode/obfuscate). Modern ORMs (Sequelize, Prisma, GORM) use params by default → SQLi extremely rare if ORM used correctly. Dangerous: blind SQLi (no error output, extract via true/false responses).

---

### Q: What is XSS and how do you prevent it? / XSS và cách phòng chống? 🟡 Mid

**A:** Cross-Site Scripting: attacker injects malicious scripts into pages viewed by other users. Types: **Stored** (in DB, runs for all), **Reflected** (in URL), **DOM-based** (client-side JS reads malicious data).

```javascript
// VULNERABLE — user content as HTML
element.innerHTML = userComment; // <script>stealCookies()</script>

// PREVENTION:
element.textContent = userComment; // escape as text
element.innerHTML = DOMPurify.sanitize(userComment); // for rich text

// Content Security Policy header:
// Content-Security-Policy: default-src 'self'; script-src 'self'
// → blocks inline scripts + external sources
```

Vietnamese explanation: React escapes JSX `{userComment}` by default → protected. `dangerouslySetInnerHTML` + user content = must DOMPurify sanitize. HttpOnly cookie flag: script cannot read → limits XSS damage. CSP = defense in depth: even if payload injected, blocks script execution. CORS ≠ XSS protection (different attack vectors).

---

### Q: What is CSRF and how is it prevented? / CSRF và cách phòng chống? 🟡 Mid

**A:** Cross-Site Request Forgery: attacker tricks authenticated user's browser into making unwanted requests using their session cookies.

```
Attack flow:
1. Alice logs into bank.com → session cookie set
2. Alice visits evil.com (logged in)
3. evil.com: <img src="https://bank.com/transfer?to=attacker&amount=1000">
4. Browser sends request WITH Alice's cookie → transfer executed!

Prevention:
1. CSRF token: server generates random token, client sends in header/form
   Attacker cannot read token (same-origin policy) → can't forge request

2. SameSite cookie: SameSite=Lax/Strict
   → cookie not sent with cross-site requests (modern default)

3. JWT in Authorization header (not cookie) → immune to CSRF
```

Vietnamese explanation: SameSite=Lax (default in modern browsers): not sent for cross-site POST. SameSite=Strict: never sent cross-site. SPA + JWT in Authorization header: không vulnerable (browser không auto-send headers). CSRF chủ yếu affects cookie-based session auth. JWT in localStorage → vulnerable to XSS instead (tradeoff).

---

## Interview Q&A Summary / Tổng Kết

| Question      | Level | Key Point                                                           |
| ------------- | ----- | ------------------------------------------------------------------- |
| SQL injection | 🟢    | Parameterized queries ONLY fix; ORMs use by default                 |
| XSS           | 🟡    | React escapes JSX; DOMPurify for rich text; CSP as defense in depth |
| CSRF          | 🟡    | CSRF token or SameSite cookie; JWT in header = immune               |

---

## Self-Check / Tự Kiểm Tra

| Loại            | Câu hỏi kiểm tra                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Retrieval**   | Kể tên OWASP Top 10 (2021) theo thứ tự — và giải thích tại sao A01 là Broken Access Control, không còn là Injection như 2017.                 |
| **Visual**      | Vẽ flow của SQL Injection attack từ user input đến database — và vẽ parameterized query ngăn chặn nó ở bước nào.                              |
| **Application** | Bạn đang review code: `res.send('<div>' + req.query.name + '</div>')` — xác định vulnerability, classify XSS type, và viết fix.               |
| **Debug**       | User report: "Sau khi đăng nhập, tôi có thể xem orders của người khác bằng cách đổi order ID trong URL." Đây là lỗi gì? Fix ở đâu trong code? |
| **Teach**       | Giải thích cho junior developer tại sao `SameSite=Lax` cookie không đủ để replace CSRF token trong mọi trường hợp.                            |

💬 **Feynman Prompt:** Giải thích tại sao `Content-Security-Policy` header là "defense in depth" chứ không phải "fix" cho XSS — và CSP không thể replace input sanitization.

## Connections / Liên Kết

- ⬅️ **Built on**: [Security Fundamentals](./01-security-fundamentals.md) — OWASP is the applied version of CIA Triad
- ⬅️ **Built on**: [Cryptography](./02-cryptography-and-protocols.md) — TLS/HTTPS is the foundation against network-level attacks
- ➡️ **Applied in**: [BE Auth Security](../../be-track/02-backend-knowledge/04-auth-security.md) — anti-patterns checklist
- ➡️ **Applied in**: [FE Web Security](../../fe-track/07-web-security/) — browser-side mitigations
