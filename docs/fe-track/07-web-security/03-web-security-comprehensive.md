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
- Requires specific origin (not *)
- Higher security risk

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
1. Attacker submits malicious script
2. Server stores script in database
3. Victim requests page
4. Server includes malicious script in response
5. Script executes in victim's browser
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
1. Attacker crafts malicious URL
2. Victim clicks link
3. Server reflects input in response
4. Script executes in victim's browser
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
1. Attacker crafts malicious URL
2. Victim clicks link
3. Client-side JavaScript processes input
4. Script modifies DOM unsafely
5. Malicious code executes
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

## Cross-Site Request Forgery (CSRF)

### CSRF Theory

**Definition:** CSRF is an attack that forces authenticated users to execute unwanted actions on a web application.

**Định nghĩa:** CSRF là cuộc tấn công buộc người dùng đã xác thực thực hiện các hành động không mong muốn trên ứng dụng web.

### CSRF Attack Mechanism

**Theory:** CSRF exploits the trust a website has in the user's browser.

**Attack Flow:**
```
1. Victim logs into legitimate site
2. Site sets authentication cookie
3. Victim visits malicious site (while still logged in)
4. Malicious site triggers request to legitimate site
5. Browser automatically includes authentication cookie
6. Legitimate site processes request as if from victim
```

**Example Attack:**
```html
<!-- Malicious site -->
<img src="https://bank.com/transfer?to=attacker&amount=1000">
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
fetch('/api/data', {
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
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

## Content Security Policy

### CSP Theory

**Definition:** CSP is a security layer that helps detect and mitigate certain types of attacks, including XSS and data injection.

**Định nghĩa:** CSP là lớp bảo mật giúp phát hiện và giảm thiểu một số loại tấn công, bao gồm XSS và chèn dữ liệu.

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
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'">
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

[← Back to Authentication](./02-authentication.md) | [Next: Web APIs →](../09-advanced-topics/01-browser-apis.md)
