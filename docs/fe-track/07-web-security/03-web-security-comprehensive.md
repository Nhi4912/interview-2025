# Web Security - Comprehensive Theoretical Guide

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Understanding Security from First Principles

[← Back to Authentication](./02-authentication.md) | [Next: Web APIs →](../09-advanced-topics/01-browser-apis.md)

---

## 📋 Table of Contents

1. [Security Fundamentals](#security-fundamentals)
2. [Same-Origin Policy](#same-origin-policy)
3. [Cross-Site Scripting (XSS)](#cross-site-scripting-xss)
4. [Cross-Site Request Forgery (CSRF)](#cross-site-request-forgery-csrf)
5. [Content Security Policy](#content-security-policy)
6. [Authentication Security](#authentication-security)
7. [Cryptography Basics](#cryptography-basics)
8. [HTTPS and TLS](#https-and-tls)
9. [Security Headers](#security-headers)
10. [Interview Questions](#interview-questions)

---

## 🎯 Learning Objectives

Master web security:

- Understand security principles
- Learn common vulnerabilities
- Apply security best practices
- Implement defense mechanisms
- Design secure systems
- Prevent security breaches

---

## Security Fundamentals

### What is Web Security?

**English Definition:** Web security encompasses the protective measures and protocols that protect websites, web applications, and web services from cyber threats and unauthorized access.

**Định nghĩa (Tiếng Việt):** Bảo mật web bao gồm các biện pháp bảo vệ và giao thức bảo vệ trang web, ứng dụng web và dịch vụ web khỏi các mối đe dọa mạng và truy cập trái phép.

### Security Mind Map

```
Web Security
│
├── Core Principles
│   ├── Confidentiality
│   ├── Integrity
│   ├── Availability
│   └── Authentication
│
├── Browser Security
│   ├── Same-Origin Policy
│   ├── CORS
│   ├── CSP
│   └── Sandboxing
│
├── Common Attacks
│   ├── XSS (Cross-Site Scripting)
│   ├── CSRF (Cross-Site Request Forgery)
│   ├── SQL Injection
│   ├── Clickjacking
│   └── Man-in-the-Middle
│
├── Defense Mechanisms
│   ├── Input Validation
│   ├── Output Encoding
│   ├── Security Headers
│   ├── HTTPS/TLS
│   └── Authentication
│
└── Best Practices
    ├── Principle of Least Privilege
    ├── Defense in Depth
    ├── Secure by Default
    └── Regular Updates
```

### CIA Triad

**Theory:** The CIA triad represents the three fundamental principles of information security.

**Định nghĩa:** Bộ ba CIA đại diện cho ba nguyên tắc cơ bản của bảo mật thông tin.

**1. Confidentiality (Tính bảo mật)**

**Definition:** Ensuring information is accessible only to authorized parties.

**Threats:**

- Unauthorized access
- Data breaches
- Eavesdropping
- Social engineering

**Protections:**

- Encryption
- Access controls
- Authentication
- Authorization

**2. Integrity (Tính toàn vẹn)**

**Definition:** Ensuring information remains accurate and unmodified by unauthorized parties.

**Threats:**

- Data tampering
- Man-in-the-middle attacks
- Malicious modifications
- Accidental corruption

**Protections:**

- Hashing
- Digital signatures
- Checksums
- Version control

**3. Availability (Tính khả dụng)**

**Definition:** Ensuring information and systems are accessible when needed.

**Threats:**

- DDoS attacks
- System failures
- Natural disasters
- Resource exhaustion

**Protections:**

- Redundancy
- Load balancing
- Backup systems
- Rate limiting

### Security Principles

**1. Defense in Depth**

**Theory:** Multiple layers of security controls throughout an IT system.

**Layers:**

- Physical security
- Network security
- Application security
- Data security
- User education

**Benefit:** If one layer fails, others provide protection.

**2. Principle of Least Privilege**

**Theory:** Users/processes should have minimum access necessary to perform their function.

**Application:**

- Minimal permissions
- Time-limited access
- Role-based access control
- Regular audits

**3. Fail Securely**

**Theory:** When systems fail, they should fail in a secure state.

**Examples:**

- Deny access on error
- Log failures
- Graceful degradation
- No sensitive data in errors

**4. Don't Trust User Input**

**Theory:** All user input is potentially malicious and must be validated.

**Validation:**

- Whitelist approach
- Input sanitization
- Type checking
- Length limits

---

### Phase 2 — Security Fundamentals Deep Dive

**🧠 Memory Hook:**
**CIA = "Can I Access?"** — three questions every attack either breaks or every defense tries to preserve.

**Tại sao tồn tại? / Why does this exist?**
The web allows anyone on the planet to talk to your server.
→ **Why?** Because browsers execute arbitrary code from arbitrary servers, any resource you load can try to read your data, impersonate you, or take you offline.
→ **Why?** Because HTTP was designed for document sharing, not adversarial multi-party applications — security was bolted on after the fact, which is why it's complex and layered.

**Visual — CIA Triad vs. Attack Mapping:**

```
CIA Goal          Threatened by             Defended by
─────────────────────────────────────────────────────────
Confidentiality   XSS (steals data),        Encryption, HTTPOnly
                  Eavesdropping             cookies, HTTPS
─────────────────────────────────────────────────────────
Integrity         CSRF (forged actions),    CSRF tokens, HMAC,
                  Data tampering            digital signatures
─────────────────────────────────────────────────────────
Availability      DDoS, Resource exhaustion Rate limiting,
                                            CDN, redundancy
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Defense in Depth = nhiều firewall" | Depth có nghĩa là các LOẠI lớp khác nhau, không phải nhiều cùng loại | Physical + Network + App + Data + People — each different |
| "Fail Securely = hiển thị thông báo lỗi chi tiết" | Stack trace tiết lộ cấu trúc hệ thống cho attacker | Log chi tiết server-side, hiển thị generic message cho user |
| "Least Privilege chỉ áp dụng cho users" | Process và service cũng cần minimal permissions | Database service không nên có quyền DROP TABLE |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Làm sao thiết kế hệ thống bảo mật?"
- → Nhớ đến: CIA Triad + Defense in Depth
- → Mở đầu trả lời: _"I'd start from the CIA triad to map what needs protecting, then layer defenses so no single failure is catastrophic."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: HTTP protocol, how browsers load resources
- ➡️ Để hiểu tiếp: Same-Origin Policy (the browser's first line of defense)

---

## Same-Origin Policy

### Same-Origin Policy Theory

**Definition:** The Same-Origin Policy (SOP) is a critical security mechanism that restricts how documents or scripts from one origin can interact with resources from another origin.

**Định nghĩa:** Same-Origin Policy (SOP) là cơ chế bảo mật quan trọng hạn chế cách tài liệu hoặc script từ một origin có thể tương tác với tài nguyên từ origin khác.

### Origin Definition

**Theory:** An origin is defined by the combination of scheme, host, and port.

**Origin Components:**

```
https://example.com:443/path
  ↓       ↓           ↓
scheme  host       port
```

**Same Origin Examples:**

```
https://example.com/page1
https://example.com/page2
✓ Same origin (same scheme, host, port)

https://example.com:443/page
https://example.com/page
✓ Same origin (443 is default HTTPS port)
```

**Different Origin Examples:**

```
https://example.com
http://example.com
✗ Different scheme

https://example.com
https://api.example.com
✗ Different host

https://example.com:443
https://example.com:8443
✗ Different port
```

### SOP Restrictions

**Theory:** SOP restricts cross-origin access to prevent malicious sites from reading sensitive data.

**Restricted Operations:**

**1. DOM Access**

- Cannot read DOM of different origin
- Cannot modify DOM of different origin
- Prevents data theft from other tabs

**2. Cookie Access**

- Cannot read cookies from different origin
- Prevents session hijacking
- Domain-based cookie scope

**3. AJAX Requests**

- Cannot read responses from different origin
- Can send requests (but can't read response)
- Requires CORS for cross-origin access

**Allowed Operations:**

**1. Resource Embedding**

- `<script src="">` - JavaScript files
- `<link href="">` - CSS files
- `<img src="">` - Images
- `<video>/<audio>` - Media
- `<iframe>` - Documents (with restrictions)

**2. Form Submissions**

- Can submit forms cross-origin
- Cannot read response
- Basis for CSRF attacks

### CORS (Cross-Origin Resource Sharing)

**Theory:** CORS is a mechanism that allows controlled relaxation of SOP.

**Định nghĩa:** CORS là cơ chế cho phép nới lỏng có kiểm soát của SOP.

**CORS Headers:**

**Request Headers:**

```
Origin: https://example.com
```

**Response Headers:**

```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

**Preflight Requests:**

**Theory:** For certain requests, browser sends OPTIONS request first to check permissions.

**Triggers:**

- Methods other than GET, POST, HEAD
- Custom headers
- Content-Type other than simple types

**Preflight Flow:**

```
1. Browser sends OPTIONS request
2. Server responds with allowed methods/headers
3. If allowed, browser sends actual request
4. Server responds with data
```

**Security Considerations:**

**Wildcard Origin:**

```
Access-Control-Allow-Origin: *
```

- Allows any origin
- Cannot use with credentials
- Avoid for sensitive APIs

**Credentials:**

```
Access-Control-Allow-Credentials: true
```

- Allows cookies/auth headers
- Requires specific origin (not \*)
- Higher security risk

---

### Phase 2 — Same-Origin Policy & CORS Deep Dive

**🧠 Memory Hook:**
**SOP = "Your browser is your bodyguard."** It refuses to let any other website read what your bank says back to you, even if your bank's server sends the response.

**Tại sao tồn tại? / Why does this exist?**
Without SOP, a malicious tab open in your browser could silently read your Gmail, Slack messages, and banking balance — all in one page load.
→ **Why?** Because cookies (including session tokens) are sent automatically with every matching request, so any tab can impersonate you to any site.
→ **Why?** Because the browser is a shared execution environment — tabs share the same network stack and credential store, so isolation must be enforced by the browser itself, not by servers.

**Visual — SOP vs. CORS Flow:**

```
                    ┌─────────────────────────────┐
                    │         BROWSER              │
  evil.com tab ─────┤                              │
  requests data     │  SOP CHECK:                  │
  from bank.com     │  evil.com ≠ bank.com         │
                    │  → BLOCK (reads) ❌           │
                    │  → ALLOW (writes/forms) ✓    │
                    └─────────────────────────────┘

                    ┌─────────────────────────────┐
                    │    CORS relaxes SOP           │
  app.com ──────────┤                              ├──→ api.app.com
  (OPTIONS) ─────── │  Preflight:                  │    returns
                    │  "Can app.com read me?"      │    Access-Control-Allow-Origin:
                    │  → YES → actual request ✓    │    https://app.com
                    └─────────────────────────────┘
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `Access-Control-Allow-Origin: *` với credentials | Wildcard + credentials bị browsers từ chối | Phải specify exact origin khi dùng `Allow-Credentials: true` |
| "SOP chặn mọi cross-origin request" | SOP chặn READING response, không chặn SENDING | CSRF exploit này — browser gửi request nhưng không đọc response |
| "CORS là server-side security" | CORS chỉ là browser-enforced policy, server nói "ai được phép đọc" | Attacker tự viết HTTP client bỏ qua CORS hoàn toàn |
| Tin tưởng Referer header để validate origin | Referer có thể bị strip bởi privacy tools hoặc HTTPS→HTTP redirect | Dùng CSRF token là primary defense |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Tại sao CORS preflight gây chậm?" hoặc "CORS là gì?"
- → Nhớ đến: SOP là root cause, CORS là controlled exception
- → Mở đầu trả lời: _"CORS exists because browsers enforce Same-Origin Policy — the preflight is the browser asking permission before breaking SOP on your behalf."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: How HTTP cookies work, how browsers enforce policies
- ➡️ Để hiểu tiếp: CSRF (exploits the "writes are allowed" loophole in SOP)

---

## Cross-Site Scripting (XSS)

### XSS Theory

**Definition:** XSS is a vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.

**Định nghĩa:** XSS là lỗ hổng cho phép kẻ tấn công chèn script độc hại vào các trang web được người dùng khác xem.

### XSS Types

**1. Stored XSS (Persistent)**

**Theory:** Malicious script is permanently stored on target server (database, file system).

**Attack Flow:**

```
Attacker ──POST /comment with <script>steal()</script>──► Server
                                                               │
                                                          stores in DB
                                                               │
Victim ──GET /page────────────────────────────────────► Response
                                                    (includes stored script)
                                                               │
                                                               ▼
                                                    Browser executes script
                                                    ┌─────────────────────────┐
                                                    │ steal document.cookie   │
                                                    │ POST to attacker.com    │
                                                    │ keylog / DOM manipulate │
                                                    └─────────────────────────┘
                                                      All future victims hit too
```

**Example Scenario:**

- Comment system
- User profile
- Forum post
- Message board

**Impact:**

- Affects all users viewing content
- Persistent threat
- Most dangerous XSS type

**2. Reflected XSS (Non-Persistent)**

**Theory:** Malicious script is reflected off web server in error message, search result, or any response that includes user input.

**Attack Flow:**

```
Attacker crafts URL:
  https://site.com/search?q=<script>steal()</script>
  └─ sends via email / social engineering
         │
         ▼
Victim clicks link ──GET /search?q=<script>steal()──► Server
                                                        │
                                               reflects q in HTML response
                                                        │
                                                        ▼
                                               Browser executes script
                                               → one-time hit (victim only)
```

**Example:**

```
https://example.com/search?q=<script>alert('XSS')</script>
```

**Impact:**

- Requires social engineering
- One-time attack
- Still dangerous

**3. DOM-Based XSS**

**Theory:** Vulnerability exists in client-side code rather than server-side.

**Attack Flow:**

```
Attacker crafts URL:
  https://site.com/page#<img src=x onerror=steal()>
         │
         ▼
Victim clicks ──► Browser loads page (server sees clean URL)
                       │
                  Client JS reads location.hash
                  writes to innerHTML / document.write
                       │
                       ▼
                  Browser executes injected payload
                  (server never saw malicious content)
```

**Example:**

```javascript
// Vulnerable code
const name = location.hash.substring(1);
document.write("Hello " + name);

// Attack URL
https://example.com/#<script>alert('XSS')</script>
```

**Impact:**

- Bypasses server-side protections
- Harder to detect
- Requires code review

### XSS Prevention

**Theory:** Defense requires multiple layers of protection.

**1. Input Validation**

**Whitelist Approach:**

- Define allowed characters
- Reject everything else
- Validate on server-side

**Validation Rules:**

- Check data type
- Verify format
- Enforce length limits
- Validate against schema

**2. Output Encoding**

**Theory:** Encode data before inserting into HTML to prevent script execution.

**Context-Specific Encoding:**

**HTML Context:**

```
< → &lt;
> → &gt;
& → &amp;
" → &quot;
' → &#x27;
```

**JavaScript Context:**

```
\ → \\
" → \"
' → \'
```

**URL Context:**

```
Use encodeURIComponent()
```

**CSS Context:**

```
Escape special characters
Validate values
```

**3. Content Security Policy (CSP)**

**Theory:** CSP restricts sources from which content can be loaded.

**Benefits:**

- Blocks inline scripts
- Restricts script sources
- Prevents eval()
- Mitigates XSS impact

**4. HTTPOnly Cookies**

**Theory:** Prevents JavaScript from accessing cookies.

**Protection:**

- Cookies not accessible via document.cookie
- Reduces session hijacking risk
- Should be default for session cookies

**5. X-XSS-Protection Header**

**Theory:** Enables browser's built-in XSS filter.

**Header:**

```
X-XSS-Protection: 1; mode=block
```

**Note:** Deprecated in favor of CSP, but still useful for older browsers.

---

### Phase 2 — XSS Deep Dive

**🧠 Memory Hook:**
**XSS = "Attacker rents a room in your browser."** Your browser trusts the page — if the page contains attacker code, the attacker has all the same trust your page has.

**Tại sao tồn tại? / Why does this exist?**
Browsers must run code from pages they display — that's what makes the web dynamic.
→ **Why?** When user-supplied content (comments, search terms, usernames) is placed in a page without encoding, it becomes part of the executable page, not just display text.
→ **Why?** Because HTML and JavaScript share the same text stream — `<` is simultaneously a safe character in a paragraph and a dangerous tag opener, and the browser can't know developer intent without explicit encoding.

**Visual — Three XSS Types at a Glance:**

```
STORED XSS (most dangerous)
Attacker ──POST malicious content──→ DB
                                      ↓
Victim ──GET page──→ Server reads DB ──→ Script in HTML ──→ Executes ❌

REFLECTED XSS
Attacker crafts URL: /search?q=<script>...
Victim clicks link ──→ Server echoes q in page ──→ Executes ❌

DOM-BASED XSS (bypasses server)
Attacker crafts URL: /page#<script>...
Page loads ──→ JS reads location.hash ──→ innerHTML = hash ──→ Executes ❌
              ^^^^ never hits server, server-side filtering useless
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Chỉ escape HTML entities là đủ | Context matters: JS context, CSS context, URL context cần encoding khác | Apply context-specific encoding (HTML/JS/URL/CSS) |
| `innerHTML = userInput` là OK nếu đã sanitize | Sanitization logic có thể bị bypass | Dùng `textContent` cho text, DOMParser cho trusted HTML |
| Server-side escaping bảo vệ khỏi DOM XSS | DOM XSS payload không bao giờ qua server | Review JS code cho `location.hash`, `document.URL`, `postMessage` sinks |
| CSP với `unsafe-inline` vẫn "có CSP" | `unsafe-inline` vô hiệu hóa XSS protection của CSP | Dùng nonces hoặc hashes thay vì unsafe-inline |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "React có bảo vệ khỏi XSS không?"
- → Nhớ đến: JSX auto-escapes, nhưng `dangerouslySetInnerHTML` và `href={userInput}` là sink
- → Mở đầu trả lời: _"React escapes by default via JSX, but there are four sinks that bypass this: dangerouslySetInnerHTML, href with javascript:, style injection, and ref.innerHTML."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: How browsers parse HTML, DOM API, cookie security flags
- ➡️ Để hiểu tiếp: Content Security Policy (the runtime mitigation layer for XSS)

---

## Cross-Site Request Forgery (CSRF)

### CSRF Theory

**Definition:** CSRF is an attack that forces authenticated users to execute unwanted actions on a web application.

**Định nghĩa:** CSRF là cuộc tấn công buộc người dùng đã xác thực thực hiện các hành động không mong muốn trên ứng dụng web.

### CSRF Attack Mechanism

**Theory:** CSRF exploits the trust a website has in the user's browser.

**Attack Flow:**

```
① Victim logs into bank.com
   Browser stores: Cookie: session=abc123

② Victim visits evil.com (new tab, still logged in)
   evil.com HTML:  <img src="bank.com/transfer?to=attacker&amount=1000">
         │
         ▼
③ Browser auto-sends request to bank.com
   GET bank.com/transfer?to=attacker&amount=1000
   Cookie: session=abc123  ← browser adds automatically
         │
         ▼
④ bank.com sees authenticated request
   → executes transfer  ✅  (victim never knew)

Key insight: browser adds cookies regardless of which site triggers the request
```

**Example Attack:**

```html
<!-- Malicious site -->
<img src="https://bank.com/transfer?to=attacker&amount=1000" />
```

**Why It Works:**

- Browser automatically sends cookies
- Site trusts authenticated requests
- No user interaction needed
- Victim unaware of attack

### CSRF Prevention

**1. CSRF Tokens**

**Theory:** Include unpredictable token in requests that server validates.

**Implementation:**

```
1. Server generates unique token per session
2. Token included in forms/AJAX requests
3. Server validates token on submission
4. Reject requests with invalid/missing token
```

**Token Properties:**

- Unpredictable (cryptographically random)
- Unique per session
- Tied to user session
- Validated on server

**2. SameSite Cookies**

**Theory:** Cookie attribute that controls when cookies are sent with cross-site requests.

**Values:**

**Strict:**

```
Set-Cookie: session=abc; SameSite=Strict
```

- Never sent with cross-site requests
- Most secure
- May affect usability

**Lax:**

```
Set-Cookie: session=abc; SameSite=Lax
```

- Sent with top-level navigation (GET)
- Not sent with cross-site POST
- Good balance

**None:**

```
Set-Cookie: session=abc; SameSite=None; Secure
```

- Sent with all requests
- Requires Secure flag
- Least secure

**3. Double Submit Cookie**

**Theory:** Send token both in cookie and request parameter, server compares.

**Flow:**

```
1. Server sets CSRF token in cookie
2. Client includes token in request (header/body)
3. Server compares cookie value with request value
4. Accept only if they match
```

**Advantage:**

- Stateless (no server-side storage)
- Simpler implementation

**4. Custom Headers**

**Theory:** Require custom header that can only be added by JavaScript.

**Implementation:**

```javascript
fetch("/api/data", {
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});
```

**Why It Works:**

- Simple requests can't add custom headers
- Requires CORS preflight
- Attacker can't forge

**5. Origin/Referer Validation**

**Theory:** Validate Origin or Referer header matches expected value.

**Checks:**

```
1. Verify Origin header exists
2. Check Origin matches expected domain
3. Fallback to Referer if Origin missing
4. Reject if neither present or mismatch
```

**Limitations:**

- Headers can be missing
- Privacy tools may strip headers
- Should be additional layer, not sole protection

---

### Phase 2 — CSRF Deep Dive

**🧠 Memory Hook:**
**CSRF = "Attacker borrows your hand."** The server sees your authenticated cookie; it has no idea someone else triggered the action.

**Tại sao tồn tại? / Why does this exist?**
Browsers automatically attach cookies to every request to a domain — you don't have to do anything.
→ **Why?** Because HTTP is stateless and cookies are the session mechanism — the browser attaches them so legitimate pages don't have to manage them manually.
→ **Why?** Because the web was designed before adversarial cross-origin requests were a concern: form submissions to any domain were allowed to enable payment redirects, partner integrations, etc. CSRF is the security cost of that openness.

**Visual — CSRF Attack vs. Legitimate Request:**

```
LEGITIMATE:
User on bank.com ──fills form──→ POST /transfer (cookie attached) ──→ Bank processes ✓

CSRF ATTACK:
User visits evil.com (logged in to bank.com in another tab)
evil.com auto-submits:
  <form action="https://bank.com/transfer" method="POST">
    <input name="to" value="attacker">
  </form>
Browser attaches bank.com session cookie automatically ──→ Bank processes ❌

CSRF TOKEN DEFENSE:
Server embeds secret token in form
evil.com cannot read it (SOP prevents reading bank.com DOM)
Server rejects requests without matching token ✓
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "GET requests không cần CSRF protection" | Nếu GET có side-effects (xóa, update), vẫn cần protect | GET nên idempotent; nếu không, add CSRF token |
| SameSite=Strict giải quyết mọi CSRF | Strict breaks OAuth flows, social login, cross-site links | SameSite=Lax cho phép top-level navigation, kết hợp với CSRF token |
| CORS header bảo vệ khỏi CSRF | CORS chặn attacker đọc response, không chặn browser gửi request | CSRF và CORS protect khác thứ hoàn toàn |
| Double Submit Cookie không cần HTTPS | Attacker trên network có thể set cookie nếu không có HTTPS | Double Submit chỉ an toàn trên HTTPS |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Tại sao API cần CSRF token?" hoặc "SPA có bị CSRF không?"
- → Nhớ đến: CSRF exploits cookie auto-attach; SPA dùng Authorization header thì an toàn hơn
- → Mở đầu trả lời: _"SPAs using Authorization: Bearer headers in localStorage are naturally CSRF-resistant because JavaScript can't be triggered cross-origin — but cookie-based auth still needs SameSite + CSRF tokens."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: HTTP cookies, SameSite attribute, SOP (why CSRF tokens work)
- ➡️ Để hiểu tiếp: Security Headers (additional layers like X-Frame-Options, HSTS)

---

## Content Security Policy

### CSP Theory

**Definition:** CSP is a security layer that helps detect and mitigate certain types of attacks, including XSS and data injection.

**Định nghĩa:** CSP là lớp bảo mật giúp phát hiện và giảm thiểu một số loại tấn công, bao gồm XSS và chèn dữ liệu.

```
CSP as Defense Layer / CSP là Tầng Phòng Thủ

Server sends header:
  Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com
         │
         ▼
Browser enforces policy on every resource load:

  <script src="/app.js">         ── 'self' ✅ allowed
  <script src="cdn.example.com"> ── listed  ✅ allowed
  <script src="evil.com/x.js">   ── not listed ❌ BLOCKED
  <script>inline code</script>   ── no 'unsafe-inline' ❌ BLOCKED
  eval("code")                   ── no 'unsafe-eval' ❌ BLOCKED

XSS injected script: <script>steal()</script>
  → browser checks CSP: inline not allowed → BLOCKED ✅
  → attack neutralized even if code was injected into HTML

Reporting:
  report-uri /csp-report → browser sends JSON log of violations
  → monitor before enforcing with Content-Security-Policy-Report-Only
```

### CSP Directives

**Theory:** CSP uses directives to control which resources can be loaded.

**Common Directives:**

**1. default-src**

- Fallback for other directives
- Applies to all resource types
- Should be restrictive

**2. script-src**

- Controls JavaScript sources
- Most critical for XSS prevention
- Can block inline scripts

**3. style-src**

- Controls CSS sources
- Prevents CSS injection
- Can block inline styles

**4. img-src**

- Controls image sources
- Prevents data exfiltration via images

**5. connect-src**

- Controls AJAX, WebSocket, EventSource
- Restricts API endpoints

**6. font-src**

- Controls font sources

**7. frame-src**

- Controls iframe sources
- Prevents clickjacking

**8. media-src**

- Controls audio/video sources

### CSP Values

**Source Values:**

**'none'**

- Block all sources
- Most restrictive

**'self'**

- Same origin only
- Recommended default

**'unsafe-inline'**

- Allow inline scripts/styles
- Defeats XSS protection
- Avoid if possible

**'unsafe-eval'**

- Allow eval(), Function()
- Security risk
- Avoid if possible

**nonce-'random'**

- Allow specific inline script/style
- Unique per request
- Secure alternative to unsafe-inline

**'strict-dynamic'**

- Trust scripts loaded by trusted scripts
- Modern approach
- Requires nonces

**Domain:**

- Specific domain
- Can use wildcards
- https://example.com

### CSP Implementation

**Header:**

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random123'
```

**Meta Tag:**

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
```

**Report-Only Mode:**

```
Content-Security-Policy-Report-Only: default-src 'self'
```

- Doesn't enforce policy
- Reports violations
- Test before enforcing

**Violation Reporting:**

```
Content-Security-Policy: default-src 'self'; report-uri /csp-report
```

- Sends violation reports to endpoint
- Monitor policy effectiveness
- Identify issues

---

### Phase 2 — CSP Deep Dive

**🧠 Memory Hook:**
**CSP = "Whitelist the neighborhood your browser is allowed to trust."** Every script, image, and font must have an invitation or it gets blocked at the door.

**Tại sao tồn tại? / Why does this exist?**
Even with perfect input sanitization, a single missed encoding means attacker code runs with full page trust.
→ **Why?** Output encoding is developer-enforced and error-prone at scale — one template, one library update, one edge case can open an XSS hole.
→ **Why?** Browsers need a runtime backstop that restricts script execution by origin/nonce, independent of whether the server correctly sanitized every byte of output. CSP provides that second line of defense.

**Visual — CSP as Defense Layers:**

```
Request for page
       ↓
Server sanitizes output ──── Layer 1 (input/output encoding)
       ↓
CSP header delivered ─────── Layer 2 (browser runtime policy)
       ↓
Browser enforces:
  script-src 'nonce-abc' ──→ Only scripts with nonce=abc run
  connect-src 'self' ──────→ Ajax only to same origin
  img-src https: ──────────→ Images only over HTTPS
       ↓
Even if XSS payload injected → no matching nonce → BLOCKED ✓
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `script-src *` để tiện | Cho phép mọi external script, loại bỏ XSS protection | Use explicit domains + nonces |
| CSP chỉ cần `default-src 'self'` | Không cover: `object-src`, `base-uri`, `form-action` — có thể bị bypass | Thêm `object-src 'none'` và `base-uri 'self'` tối thiểu |
| Nonce là tĩnh | Attacker có thể đoán hoặc replay nonce cũ | Nonce phải cryptographically random và unique per response |
| CSP report-uri là cổng bảo mật | Report-uri endpoint có thể bị DDoS với fake violations | Rate limit và validate report endpoint |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Làm sao harden React app khỏi XSS?"
- → Nhớ đến: CSP + nonces + no unsafe-inline là bộ ba quan trọng nhất
- → Mở đầu trả lời: _"React handles XSS by default in JSX, but I'd add a CSP with nonces to block any injected scripts at the browser level, plus set HTTPOnly on session cookies so even a successful XSS can't steal the token."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: XSS attack types, how browsers execute scripts, HTTP headers
- ➡️ Để hiểu tiếp: Security Headers (HSTS, X-Frame-Options, Permissions-Policy)

---

## Summary

### Key Security Concepts

1. **Security Principles**
   - CIA Triad
   - Defense in Depth
   - Least Privilege
   - Fail Securely

2. **Same-Origin Policy**
   - Origin definition
   - SOP restrictions
   - CORS mechanism
   - Security implications

3. **XSS Prevention**
   - Input validation
   - Output encoding
   - CSP implementation
   - HTTPOnly cookies

4. **CSRF Prevention**
   - CSRF tokens
   - SameSite cookies
   - Double submit
   - Header validation

5. **Content Security Policy**
   - Directive types
   - Source values
   - Implementation strategies
   - Violation reporting

### Security Best Practices

✅ **DO:**

- Validate all input
- Encode all output
- Use HTTPS everywhere
- Implement CSP
- Use security headers
- Keep dependencies updated
- Follow principle of least privilege

❌ **DON'T:**

- Trust user input
- Store sensitive data client-side
- Use eval() or innerHTML
- Ignore security headers
- Hardcode secrets
- Disable security features
- Assume security by obscurity

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q: What is the difference between XSS and CSRF? / XSS và CSRF khác nhau thế nào? 🟡 Mid

**A:** XSS injects attacker code into the victim's browser session on a trusted site. CSRF forces the victim's browser to make an authenticated request to a trusted site from a malicious origin.

XSS là attacker chèn code vào session của nạn nhân trên site mà browser tin tưởng — attacker mượn quyền của site với nạn nhân. CSRF là attacker khiến browser nạn nhân gửi authenticated request đến site tin cậy từ site độc hại — attacker mượn cookie của nạn nhân với site.

**Mnemonic:** XSS = site bị nhiễm code của attacker. CSRF = browser nạn nhân bị dùng như công cụ.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Explains that XSS injects code while CSRF abuses authentication state; notes that SameSite cookies fix CSRF but not XSS; notes that CSP/HTTPOnly fix XSS impact but not CSRF
- ❌ Weak: "XSS is client-side, CSRF is server-side" — imprecise and misses the mechanism entirely

---

### Q: How does Same-Origin Policy actually protect users? What are its limits? 🟡 Mid

**A:** SOP prevents scripts from one origin from reading data from another origin. It blocks DOM access, Cookie reads, and AJAX response bodies across origins. Limits: it allows writes (form POST, image load), it doesn't protect against CSRF, and it doesn't apply to server-to-server requests.

SOP ngăn script của origin A đọc dữ liệu từ origin B. Điều này bảo vệ session token, DOM content, cookie. Giới hạn: SOP cho phép _gửi_ request cross-origin (chỉ chặn đọc response), không chặn CSRF, và không ảnh hưởng đến server-side code.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Distinguishes "blocking reads" from "blocking sends" — this is the key nuance that explains why CSRF still works despite SOP
- ❌ Weak: "SOP blocks all cross-origin requests" — this is wrong; it only blocks reading the response

---

### Q: Explain CORS preflight. Why does the browser send OPTIONS first? 🟡 Mid

**A:** Preflight is the browser asking the server "I'm about to send a non-simple request from origin X — do you allow this?" before the actual request. It protects servers that don't expect cross-origin requests with custom methods or headers from receiving them unexpectedly.

Preflight là browser hỏi server trước khi gửi non-simple request: "Origin X có được phép gửi DELETE với Authorization header không?" Server có thể trả lời allow hoặc deny mà không cần process request thực. Mục đích: bảo vệ server legacy không biết CORS khỏi bị exploit bởi cross-origin request.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Notes that simple requests (GET, POST with simple headers) don't trigger preflight — explains WHY the threshold exists (legacy server compatibility)
- ❌ Weak: "Preflight checks security" — without explaining what it checks and why the threshold is where it is

---

### Q: What is Stored vs. Reflected vs. DOM-based XSS? Which is most dangerous and why? 🟡 Mid

**A:** Stored: payload persists in DB, executes for every visitor. Reflected: payload echoed in single response, requires tricking one user. DOM-based: never hits the server, JavaScript processes URL/hash directly. Stored is most dangerous (mass scale), DOM-based is hardest to detect (server-side filters useless).

Stored XSS nguy hiểm nhất vì một lần chèn, tất cả người dùng sau đó đều bị ảnh hưởng. DOM-based khó phát hiện nhất vì WAF và server-side sanitization hoàn toàn mù — code chạy ở client-side từ JS đọc URL fragment.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Specifically names DOM sinks (`location.hash`, `document.URL`, `postMessage`) and why server-side defenses can't catch DOM XSS
- ❌ Weak: Only explains the attack flow without discussing detectability and defense differences

---

### Q: How do CSRF tokens work? Why can't an attacker just read the token? 🟡 Mid

**A:** The server embeds a random token in the page/form. When the form is submitted, the token must match. An attacker on evil.com cannot read the token because SOP prevents evil.com from reading bank.com's DOM or AJAX responses. The token's security depends entirely on SOP being enforced.

CSRF token hoạt động vì SOP: attacker trên evil.com không thể đọc DOM của bank.com nên không lấy được token. Server so sánh token trong form/header với token trong session — nếu không match, từ chối request. Toàn bộ scheme collapse nếu có XSS vulnerability (attacker có thể đọc DOM từ trong site).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Notes that CSRF tokens and XSS are linked — XSS breaks CSRF token protection because attacker can now read the DOM from within the trusted origin
- ❌ Weak: "CSRF token is a secret key" — without explaining why the attacker can't just read it

---

### Q: What CSP directive most directly prevents XSS? How do nonces work? 🔴 Senior

**A:** `script-src` with nonces. The server generates a cryptographically random nonce per response, puts it in the CSP header, and adds `nonce="abc"` to legitimate script tags. Only scripts with matching nonces execute — attacker-injected scripts have no nonce.

`script-src 'nonce-{random}'` là directive trực tiếp ngăn XSS. Server tạo random nonce mỗi response (không thể đoán), đặt trong CSP header, và thêm `nonce=` attribute vào `<script>` tags hợp lệ. Attacker có thể inject `<script>` nhưng không biết nonce — browser block. Key: nonce phải unique per request, không thể tái sử dụng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Explains that `unsafe-inline` defeats the purpose of script-src; explains `strict-dynamic` for dynamically loaded scripts; notes that nonces must be per-response not per-deploy
- ❌ Weak: "Use CSP to block inline scripts" without explaining the nonce mechanism or why unsafe-inline is dangerous

---

### Q: What's the difference between SameSite=Strict and SameSite=Lax? When would each break your app? 🔴 Senior

**A:** Strict: cookie never sent with any cross-site request, including top-level navigation (clicking a link from another site). Lax: cookie sent with top-level GET navigation but not with cross-site POST/fetch. Strict breaks OAuth flows and "return to app" patterns. Lax is the secure default that preserves usability.

Strict phù hợp cho session cookie của banking app — không cần OAuth. Lax là default tốt cho hầu hết apps nhưng vẫn block CSRF POST attack. Lax có thể bị bypass bởi GET-based CSRF (nếu server dùng GET cho state-changing operations — anti-pattern). None + Secure cần thiết cho third-party cookie flows (embed widgets, payment SDKs).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Notes the OAuth redirect breakage with Strict; explains that Lax still blocks POST CSRF which covers most attacks; mentions SameSite=None requires Secure flag
- ❌ Weak: "Strict is always better" — misses that it breaks real use cases like social login

---

### Q: An attacker has achieved XSS on your app. What damage can they do, and what mitigations limit the blast radius? 🔴 Senior

**A:** Without mitigations: steal session cookies, read all page data, make authenticated API calls, keylog, redirect to phishing. With mitigations: HTTPOnly cookies stop cookie theft; CSP restricts what scripts can do; connect-src blocks data exfiltration to attacker's server; Subresource Integrity (SRI) prevents supply-chain injection.

Với HTTPOnly cookie: attacker không thể đánh cắp session token qua `document.cookie`. Với CSP `connect-src 'self'`: attacker không thể gửi stolen data về server của họ. Với CSP `script-src nonce`: injected script không chạy được. Defense in depth là lý do: bạn không thể 100% ngăn XSS, nhưng có thể limit damage khi nó xảy ra.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Explicitly links HTTPOnly to cookie theft prevention; connects connect-src to data exfiltration blocking; shows understanding that XSS mitigation is layered not binary
- ❌ Weak: "Just use input validation" — misses that defense-in-depth matters because no sanitization is perfect

---

## Study Cases / Tình Huống Thực Tế Sâu

### Case 1: British Airways Magecart Attack — 2018

**Tình huống**: Attackers injected 22 lines of JavaScript into British Airways' payment page that forwarded customer credit card details to attacker-controlled server `baways.com`. Ran undetected for 15 days, affecting ~500,000 customers.

**Quyết định**: The attack succeeded because BA had no Content Security Policy. The injected script could freely make fetch requests to a third-party domain.

**Kết quả**: £183 million GDPR fine (later reduced to £20 million). Massive reputational damage.

**Bài học**: CSP with `connect-src 'self'` would have blocked data exfiltration to `baways.com` — even after code injection, the exfiltration step would have been blocked by the browser. This is the canonical "defense in depth prevents breach escalation" case.

---

### Case 2: Samy Worm on MySpace — 2005

**Tình huống**: Samy Kamkar exploited a Stored XSS vulnerability in MySpace profiles. His worm spread by: when a user viewed a profile with the payload, their own profile was updated with the payload AND they added Samy as a friend. Over 1 million MySpace accounts affected in under 24 hours.

**Quyết định**: MySpace's HTML sanitizer blocked `<script>` tags but not CSS `style` attributes with JavaScript expressions (Internet Explorer `expression()` CSS hack). The worm also used `XMLHttpRequest` to read CSRF tokens and forge requests.

**Kết quả**: MySpace went offline to clean the worm. First large-scale XSS worm demonstration.

**Bài học**: (1) Sanitization via blocklist fails — new attack vectors emerge. Allowlist-based sanitization required. (2) XSS + CSRF combined: attacker used XSS to steal CSRF tokens, enabling authenticated actions. Shows the link between the two vulnerability classes.

---

### Case 3: GitHub CSRF — 2012

**Tình huống**: A researcher found GitHub's "Follow user" and repository "fork" actions lacked CSRF protection. A malicious page could force a logged-in GitHub user to follow any user or fork any repo by visiting the page.

**Quyết định**: GitHub added CSRF tokens to all state-changing forms. They also adopted SameSite cookie policies as an additional layer when browsers supported it.

**Kết quả**: No exploited users reported, but the vulnerability was publicly disclosed and fixed.

**Bài học**: CSRF doesn't require stealing money to be harmful — reputation manipulation (mass fake follows, forced actions) is a real threat. Also demonstrates that GET requests that cause side effects are a CSRF risk: GitHub had GET endpoints for some actions, violating HTTP idempotency principles.

---

### Case 4: Twitter XSS Worm — 2010

**Tình huống**: A zero-day XSS in Twitter's tweet display allowed a worm that auto-retweeted and redirected users to adult sites when they hovered over a tweet. Spread to ~5 million tweets in hours. Notable accounts including Sarah Palin and the UK Home Office were affected.

**Quyết định**: Twitter's server-side HTML sanitizer stripped `<script>` tags but failed to strip event handler attributes like `onmouseover`. This was a sanitizer design failure — the blocklist approach missed an entire class of injection vector. Twitter patched within hours but the spread showed real-time escalation.

**Kết quả**: No credentials stolen, but demonstrated mass-scale impact of even a "low impact" XSS.

**Bài học**: Event handler injection (`onmouseover=`, `onerror=`) is a separate XSS surface from `<script>` tags. Sanitizers that block `<script>` but not event attributes remain vulnerable. This is why CSP's `unsafe-inline` restriction covers both script elements AND inline event handlers.

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                              | Difficulty | Core Concept                   | Key Signal                                                                               |
| --- | -------------------------------------------------------------------- | ---------- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | XSS và CSRF khác nhau thế nào?                                       | 🟡 Mid     | XSS vs CSRF mechanics          | XSS injects code; CSRF abuses authentication state — different threat models             |
| 2   | Same-Origin Policy bảo vệ user thế nào? Giới hạn là gì?              | 🟡 Mid     | SOP semantics                  | Blocks reads, not sends — forms can POST cross-origin; key nuance                        |
| 3   | Giải thích CORS preflight — tại sao browser gửi OPTIONS trước?       | 🟡 Mid     | CORS preflight mechanism       | Simple requests don't trigger preflight; only "non-simple" methods/headers do            |
| 4   | Stored vs Reflected vs DOM-based XSS — cái nào nguy hiểm nhất?       | 🟡 Mid     | XSS type taxonomy              | DOM sinks: `location.hash`, `document.URL`, `postMessage` — server never sees payload    |
| 5   | CSRF tokens hoạt động thế nào? Attacker không thể đọc token?         | 🟡 Mid     | CSRF token mechanics           | CSRF + XSS linked: XSS breaks CSRF token protection (can read DOM)                       |
| 6   | CSP directive nào ngăn XSS trực tiếp nhất? Nonces hoạt động thế nào? | 🔴 Senior  | CSP nonce-based XSS prevention | `unsafe-inline` defeats script-src; `strict-dynamic` propagates trust to dynamic scripts |
| 7   | SameSite=Strict vs SameSite=Lax — khi nào mỗi cái break app?         | 🔴 Senior  | SameSite cookie semantics      | Strict breaks OAuth redirect flows; Lax still blocks cross-site POST                     |
| 8   | Attacker đã XSS được app — có thể gây hại gì? Mitigations?           | 🔴 Senior  | XSS blast radius & containment | HTTPOnly → prevents cookie theft; connect-src CSP → limits data exfiltration             |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Your React SPA uses cookie-based auth. Walk me through every security measure you'd apply and why."**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**

1. **Scope + define**: Cookie-based auth in SPA means CSRF is the primary risk since cookies are auto-attached cross-site, and XSS is secondary since injected JS can make authenticated calls.
2. **Core mechanism**: I'd set `SameSite=Lax; HttpOnly; Secure` on the session cookie — Lax blocks CSRF POST attacks, HttpOnly blocks JS cookie theft, Secure enforces HTTPS.
3. **Concrete example**: For state-changing API calls I'd add a CSRF token in an `X-CSRF-Token` header since custom headers require CORS preflight, which evil.com can't pass. For the CSP, `script-src 'nonce-{random}'; connect-src 'self'` limits XSS blast radius.
4. **Trade-off**: SameSite=Lax breaks if you need third-party embeds or OAuth redirects — in that case you use Strict where possible and add double-submit cookies for the None flows.

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                    |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Từ trí nhớ, giải thích 3 loại XSS (Stored, Reflected, DOM-based) và cách phòng chống từng loại.                                            |
| 2   | 🎨 Visual      | Vẽ flow của CSRF attack và flow của CSRF token defense từ trí nhớ — chỉ rõ bước nào token defense chặn được.                               |
| 3   | 🛠️ Application | Team muốn thêm user-provided "bio" text vào profile pages render qua `innerHTML`. Bạn làm gì?                                              |
| 4   | 🐛 Debug       | CSP header set `script-src 'self' 'unsafe-inline'` nhưng vẫn có XSS reports. Tại sao `unsafe-inline` không bảo vệ và nên dùng gì thay thế? |
| 5   | 🎓 Teach       | Giải thích XSS cho người không biết lập trình — dùng ví dụ không liên quan đến code.                                                       |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Stored**: payload lưu DB, execute khi victim xem → DOMPurify + output encoding; **Reflected**: payload trong URL/response, lừa click → validate input + encode output; **DOM-based**: JS đọc attacker-controlled data (hash/query) → dùng safe APIs (`textContent` không phải `innerHTML`). |
| 2   | CSRF attack: attacker tạo form hidden → victim click link → browser tự gửi session cookie → action execute as victim. CSRF token defense: server embed unique token trong form → attacker không biết token → server reject request thiếu/sai token.                                           |
| 3   | **Không dùng `innerHTML`** với user content. Thay bằng: (1) `textContent` nếu chỉ cần text; (2) `DOMPurify.sanitize(bio)` nếu cần render HTML; (3) Thêm CSP header `default-src 'self'` để limit fallback.                                                                                    |
| 4   | `unsafe-inline` cho phép **bất kỳ** inline script nào chạy — attacker inject inline script vẫn pass CSP. Dùng **nonce-based CSP**: `script-src 'nonce-{randomPerRequest}'` → chỉ scripts có đúng nonce được chạy → attacker không đoán được nonce.                                            |
| 5   | XSS = nhà hàng cho phép khách ghi lên menu — khách khác đọc và làm theo, kể cả "gọi số điện thoại này" do kẻ xấu ghi. Server tin tưởng nội dung mà không kiểm tra ai viết.                                                                                                                    |

> 🎯 **Feynman Prompt:** XSS giống nhà hàng cho khách ghi lên menu board — khách khác đọc và làm theo, kể cả hướng dẫn do kẻ xấu để lại. CSP thay đổi analogy này như thế nào?

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày**.

---

[← Back to Authentication](./02-authentication.md) | [Next: Web APIs →](../09-advanced-topics/01-browser-apis.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Common Vulnerabilities](./01-common-vulnerabilities.md) — XSS, CSRF, clickjacking fundamentals và quick reference
- [Authentication](./02-authentication.md) — JWT, OAuth, session security trong bối cảnh bảo mật
- [FE System Design: Architecture Patterns](../08-fe-system-design/01-architecture-patterns.md) — security considerations khi design hệ thống

### Khác track (Cross-track)
- [Security Fundamentals](../../shared/04-security/01-security-fundamentals.md) — CIA triad, threat modeling, defense-in-depth
- [Cryptography & Protocols](../../shared/04-security/02-cryptography-and-protocols.md) — TLS/HTTPS, CORS mechanics, hashing internals
- [Web Security OWASP](../../shared/04-security/03-web-security-owasp.md) — OWASP Top 10 reference đầy đủ kèm remediation
