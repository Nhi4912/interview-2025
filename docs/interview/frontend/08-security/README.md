# Web Security - Bảo Mật Ứng Dụng Web

> Security là non-negotiable cho production applications. Module này cover OWASP Top 10 vulnerabilities và prevention strategies.

---

## Tổng Quan

Web security không chỉ là backend concern. Frontend developers cần hiểu và implement security measures để protect users và data.

---

## Cấu Trúc Module

| File | Chủ Đề | Độ Quan Trọng |
|------|--------|---------------|
| [01-xss-prevention.md](./01-xss-prevention.md) | XSS Types & Prevention | ⭐⭐⭐⭐⭐ |
| [02-csrf-protection.md](./02-csrf-protection.md) | CSRF Tokens, SameSite | ⭐⭐⭐⭐⭐ |
| [03-authentication.md](./03-authentication.md) | JWT, OAuth, Sessions | ⭐⭐⭐⭐⭐ |
| [04-content-security-policy.md](./04-content-security-policy.md) | CSP Headers | ⭐⭐⭐⭐ |
| [05-security-best-practices.md](./05-security-best-practices.md) | OWASP Top 10 | ⭐⭐⭐⭐ |
| [mindmap-security.md](./mindmap-security.md) | Sơ Đồ Tổng Hợp | Review |

---

## XSS (Cross-Site Scripting)

### Types

```
┌─────────────────────────────────────────────────────────────────────┐
│                           XSS TYPES                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. REFLECTED XSS                                                    │
│     • Payload trong URL/request                                       │
│     • Server reflects back trong response                            │
│     • User clicks malicious link                                      │
│                                                                       │
│  2. STORED XSS                                                       │
│     • Payload stored in database                                      │
│     • Served to all users                                             │
│     • More dangerous - affects many users                             │
│                                                                       │
│  3. DOM-BASED XSS                                                    │
│     • Payload never sent to server                                    │
│     • JavaScript manipulates DOM unsafely                             │
│     • Harder to detect                                                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Prevention

```javascript
// ❌ Dangerous - innerHTML with user input
element.innerHTML = userInput;

// ✅ Safe - textContent
element.textContent = userInput;

// ✅ Safe - React auto-escapes
<div>{userInput}</div>

// ⚠️ Dangerous in React
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Sanitize if needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

---

## CSRF (Cross-Site Request Forgery)

### How It Works

```
1. User logs into bank.com (session cookie set)
2. User visits evil.com
3. evil.com has: <img src="bank.com/transfer?to=attacker&amount=1000">
4. Browser sends request WITH user's cookies
5. Money transferred!
```

### Prevention

```javascript
// 1. CSRF Tokens
// Server generates token, client sends in header
fetch('/api/transfer', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': csrfToken
    }
});

// 2. SameSite Cookies
Set-Cookie: session=abc123; SameSite=Strict

// SameSite values:
// Strict - cookie không được gửi cross-site
// Lax - cookie gửi với top-level navigation
// None - cookie luôn gửi (requires Secure)
```

---

## Authentication

### JWT vs Session

| JWT | Session |
|-----|---------|
| Stateless | Stateful |
| Stored client-side | Stored server-side |
| Can't revoke easily | Easy to revoke |
| Larger size | Small cookie |
| Good for microservices | Good for monolith |

### JWT Structure

```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiJ9.        // Header (base64)
eyJzdWIiOiIxMjM0NTY3ODkwIn0. // Payload (base64)
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV // Signature
```

### Secure Token Storage

```javascript
// ❌ localStorage - vulnerable to XSS
localStorage.setItem('token', jwt);

// ✅ HttpOnly Cookie - not accessible via JS
// Set by server:
Set-Cookie: token=jwt; HttpOnly; Secure; SameSite=Strict

// ✅ If must use localStorage, short-lived tokens + refresh
```

---

## Content Security Policy (CSP)

```http
Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://trusted.com;
    style-src 'self' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com;
```

### Directives

| Directive | Controls |
|-----------|----------|
| default-src | Fallback for other directives |
| script-src | JavaScript sources |
| style-src | CSS sources |
| img-src | Image sources |
| connect-src | XHR, WebSocket, fetch |
| font-src | Font sources |
| frame-src | iframe sources |

---

## OWASP Top 10 (2021)

| # | Vulnerability | Frontend Relevance |
|---|---------------|-------------------|
| 1 | Broken Access Control | ⭐⭐⭐ |
| 2 | Cryptographic Failures | ⭐⭐ |
| 3 | Injection (XSS) | ⭐⭐⭐⭐⭐ |
| 4 | Insecure Design | ⭐⭐⭐ |
| 5 | Security Misconfiguration | ⭐⭐⭐ |
| 6 | Vulnerable Components | ⭐⭐⭐⭐ |
| 7 | Auth Failures | ⭐⭐⭐⭐ |
| 8 | Data Integrity Failures | ⭐⭐⭐ |
| 9 | Logging Failures | ⭐⭐ |
| 10 | SSRF | ⭐ |

---

## Security Checklist

### Input Handling
- [ ] Validate all user input
- [ ] Sanitize before rendering
- [ ] Use parameterized queries (backend)

### Authentication
- [ ] Use HTTPS everywhere
- [ ] Secure password storage (backend)
- [ ] Implement proper session management
- [ ] Use HttpOnly, Secure, SameSite cookies

### Headers
- [ ] Content-Security-Policy
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Strict-Transport-Security

### Dependencies
- [ ] Regular npm audit
- [ ] Keep dependencies updated
- [ ] Use lockfile

---

## Top Interview Questions

| Question | Difficulty |
|----------|------------|
| Explain XSS types and prevention | 🟡 |
| How does CSRF work? Prevention? | 🟡 |
| JWT vs Session cookies | 🟡 |
| What is CSP? | 🟡 |
| Where to store JWT? | 🟡 |
| CORS explained | 🟡 |

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Web Security Academy](https://portswigger.net/web-security)

---

> **Thời gian ước tính:** 1 tuần
