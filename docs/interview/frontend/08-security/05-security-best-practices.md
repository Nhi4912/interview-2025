# Security Best Practices - OWASP & Defense in Depth

> Best practices từ OWASP và industry standards. Áp dụng defense in depth cho web applications.

---

## 🎯 OWASP Top 10 (2021)

```
┌─────────────────────────────────────────────────────────────────┐
│                    OWASP TOP 10 - 2021                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   #  CATEGORY                          FRONTEND RELEVANCE        │
│   ─────────────────────────────────────────────────────────────  │
│   A1 Broken Access Control              ⭐⭐⭐                    │
│   A2 Cryptographic Failures             ⭐⭐                      │
│   A3 Injection (includes XSS)           ⭐⭐⭐⭐⭐                 │
│   A4 Insecure Design                    ⭐⭐⭐                    │
│   A5 Security Misconfiguration          ⭐⭐⭐                    │
│   A6 Vulnerable Components              ⭐⭐⭐⭐                   │
│   A7 Auth & Session Failures            ⭐⭐⭐⭐                   │
│   A8 Data Integrity Failures            ⭐⭐⭐                    │
│   A9 Logging & Monitoring Failures      ⭐⭐                      │
│   A10 Server-Side Request Forgery       ⭐                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Headers

### Essential Headers

```javascript
// All security headers in one place
const securityHeaders = {
    // Prevent XSS
    'Content-Security-Policy': "default-src 'self'; script-src 'self'",

    // Prevent MIME sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // or use CSP: frame-ancestors 'none'

    // Force HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Disable browser features
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

    // Legacy XSS filter (mostly deprecated)
    'X-XSS-Protection': '1; mode=block'
};

// Express implementation
const helmet = require('helmet');
app.use(helmet());

// Or manual
app.use((req, res, next) => {
    Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    next();
});
```

### Headers Deep Dive

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY HEADERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   STRICT-TRANSPORT-SECURITY (HSTS):                             │
│   ─────────────────────────────────                              │
│   Strict-Transport-Security: max-age=31536000; includeSubDomains│
│                                                                   │
│   • Forces HTTPS for specified duration                          │
│   • includeSubDomains: applies to all subdomains                │
│   • preload: submit to browser preload list                      │
│   • Prevents SSL stripping attacks                               │
│                                                                   │
│   X-CONTENT-TYPE-OPTIONS:                                        │
│   ───────────────────────                                        │
│   X-Content-Type-Options: nosniff                                │
│                                                                   │
│   • Prevents MIME type sniffing                                  │
│   • Browser trusts Content-Type header                           │
│   • Prevents script execution from non-script files             │
│                                                                   │
│   REFERRER-POLICY:                                               │
│   ────────────────                                               │
│   Referrer-Policy: strict-origin-when-cross-origin               │
│                                                                   │
│   • Controls Referer header                                      │
│   • Prevents URL leakage to other sites                         │
│   • Options: no-referrer, same-origin, strict-origin            │
│                                                                   │
│   PERMISSIONS-POLICY (formerly Feature-Policy):                  │
│   ────────────────────────────────────────────                   │
│   Permissions-Policy: camera=(), microphone=(), geolocation=()  │
│                                                                   │
│   • Disable unused browser features                              │
│   • Reduces attack surface                                       │
│   • Can allow for specific origins                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Input Validation & Sanitization

### Validation Best Practices

```javascript
// Client-side validation (UX only, not security!)
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePassword(password) {
    return {
        hasMinLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[!@#$%^&*]/.test(password)
    };
}

// Server-side validation (REQUIRED for security)
const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    age: Joi.number().integer().min(13).max(120),
    username: Joi.string().alphanum().min(3).max(30)
});

app.post('/register', async (req, res) => {
    try {
        const validated = await userSchema.validateAsync(req.body);
        // Process validated data...
    } catch (error) {
        res.status(400).json({ error: error.details[0].message });
    }
});

// TypeScript validation with Zod
import { z } from 'zod';

const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    age: z.number().int().min(13).max(120).optional()
});

type User = z.infer<typeof UserSchema>;
```

### Output Encoding

```javascript
// Context-specific encoding
import DOMPurify from 'dompurify';

// HTML context
function encodeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// URL context
function encodeURL(str) {
    return encodeURIComponent(str);
}

// JavaScript context
function encodeJS(str) {
    return JSON.stringify(str);
}

// When HTML is needed, sanitize
function sanitizeHTML(dirty) {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href']
    });
}

// React - auto-escapes, but beware dangerouslySetInnerHTML
function SafeContent({ text }) {
    return <div>{text}</div>; // Auto-escaped
}

function RichContent({ html }) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(html)
            }}
        />
    );
}
```

---

## 🔑 Secure Cookie Configuration

```javascript
// Cookie security attributes
res.cookie('session', sessionId, {
    // Prevent JavaScript access (XSS protection)
    httpOnly: true,

    // Only send over HTTPS
    secure: process.env.NODE_ENV === 'production',

    // Prevent CSRF
    sameSite: 'strict', // or 'lax'

    // Limit cookie scope
    path: '/',
    domain: '.example.com', // or omit for current domain

    // Expiration
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // or
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),

    // Signed cookie (requires cookieParser with secret)
    signed: true
});

// Cookie prefixes (modern browsers)
// __Host- prefix: Secure, no Domain, Path=/
res.cookie('__Host-session', sessionId, {
    secure: true,
    path: '/',
    httpOnly: true,
    sameSite: 'strict'
});

// __Secure- prefix: Secure required
res.cookie('__Secure-token', token, {
    secure: true,
    httpOnly: true
});
```

---

## 📦 Dependency Security

### npm Security

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (minor/patch)
npm audit fix

# Fix including major version changes
npm audit fix --force

# Generate report
npm audit --json > audit-report.json

# Use in CI/CD
npm audit --audit-level=high
# Fails if high or critical vulnerabilities found
```

### Automated Scanning

```yaml
# GitHub Actions - Dependabot
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    versioning-strategy: increase

# Snyk integration
# .github/workflows/security.yml
name: Security
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Lock File Security

```javascript
// Always use lock files
// package-lock.json (npm)
// yarn.lock (yarn)
// pnpm-lock.yaml (pnpm)

// Verify integrity
npm ci // Uses lockfile exactly, fails if mismatch

// Don't ignore lock files in .gitignore!
```

---

## 🔒 HTTPS & Transport Security

### HTTPS Configuration

```javascript
// Force HTTPS redirect
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});

// Or use helmet
app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
}));

// TLS configuration (nginx)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

---

## 🧪 Security Testing

### Manual Testing

```javascript
// Common tests to perform

// 1. XSS Testing
const xssPayloads = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '"><script>alert(1)</script>',
    "javascript:alert(1)",
    '<svg onload=alert(1)>'
];

// 2. CSRF Testing
// - Remove CSRF token, check if request succeeds
// - Try cross-origin request

// 3. Auth Testing
// - Access protected routes without auth
// - Try other users' resources
// - Test password reset flow

// 4. Injection Testing
// - SQL: ' OR '1'='1
// - NoSQL: {"$gt": ""}
// - Command: ; ls -la

// 5. Security Headers
// Use securityheaders.com or browser DevTools
```

### Automated Testing

```javascript
// Security testing in Jest
describe('Security', () => {
    test('XSS payloads are sanitized', () => {
        const payloads = ['<script>alert(1)</script>', '<img onerror=alert(1)>'];
        payloads.forEach(payload => {
            const sanitized = DOMPurify.sanitize(payload);
            expect(sanitized).not.toContain('<script');
            expect(sanitized).not.toContain('onerror');
        });
    });

    test('API requires authentication', async () => {
        const response = await fetch('/api/protected');
        expect(response.status).toBe(401);
    });

    test('CSRF token is validated', async () => {
        const response = await fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: 'test' })
            // No CSRF token
        });
        expect(response.status).toBe(403);
    });
});
```

---

## 📋 Security Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY CHECKLIST                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   INPUT HANDLING                                                 │
│   □ Validate all input server-side                              │
│   □ Sanitize HTML before rendering                               │
│   □ Use parameterized queries                                    │
│   □ Limit input lengths                                          │
│                                                                   │
│   AUTHENTICATION                                                 │
│   □ Use HTTPS everywhere                                         │
│   □ Hash passwords with bcrypt/argon2                           │
│   □ Implement rate limiting                                      │
│   □ Use secure session/token storage                            │
│   □ Implement proper logout                                      │
│                                                                   │
│   AUTHORIZATION                                                  │
│   □ Check permissions server-side                                │
│   □ Validate resource ownership                                  │
│   □ Use principle of least privilege                            │
│                                                                   │
│   COOKIES & TOKENS                                               │
│   □ HttpOnly for session cookies                                │
│   □ Secure flag for HTTPS                                       │
│   □ SameSite for CSRF protection                                │
│   □ Short token expiry                                           │
│                                                                   │
│   HEADERS                                                        │
│   □ Content-Security-Policy                                      │
│   □ Strict-Transport-Security                                   │
│   □ X-Content-Type-Options                                      │
│   □ X-Frame-Options / frame-ancestors                           │
│                                                                   │
│   DEPENDENCIES                                                   │
│   □ Regular npm audit                                            │
│   □ Automated vulnerability scanning                            │
│   □ Keep dependencies updated                                    │
│   □ Use lockfiles                                                │
│                                                                   │
│   MONITORING                                                     │
│   □ Log security events                                          │
│   □ CSP violation reporting                                      │
│   □ Rate limit monitoring                                        │
│   □ Anomaly detection                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Security Mind Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEB SECURITY OVERVIEW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                         SECURITY                                 │
│                            │                                     │
│        ┌───────────────────┼───────────────────┐                 │
│        │                   │                   │                 │
│   ┌────▼────┐        ┌─────▼─────┐       ┌─────▼─────┐          │
│   │   XSS   │        │   CSRF    │       │   AUTH    │          │
│   │         │        │           │       │           │          │
│   │Reflected│        │ Token     │       │ JWT       │          │
│   │Stored   │        │ SameSite  │       │ Session   │          │
│   │DOM-based│        │ Origin    │       │ OAuth     │          │
│   │         │        │           │       │           │          │
│   │Solution:│        │Solution:  │       │Solution:  │          │
│   │Sanitize │        │CSRF Token │       │HttpOnly   │          │
│   │CSP      │        │Cookie Attr│       │Short exp  │          │
│   └─────────┘        └───────────┘       └───────────┘          │
│        │                   │                   │                 │
│        └───────────────────┼───────────────────┘                 │
│                            │                                     │
│                    ┌───────▼───────┐                             │
│                    │    HEADERS    │                             │
│                    │               │                             │
│                    │ CSP           │                             │
│                    │ HSTS          │                             │
│                    │ X-Frame       │                             │
│                    │ Referrer      │                             │
│                    └───────────────┘                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What are the most important security headers?**

A: CSP (prevent XSS), HSTS (force HTTPS), X-Content-Type-Options (prevent MIME sniffing), X-Frame-Options (prevent clickjacking).

**Q: How do you handle user input securely?**

A: Validate server-side, sanitize before output, use parameterized queries, encode based on context (HTML, JS, URL).

### 🟡 Mid-level

**Q: Explain defense in depth**

A: Multiple layers of security so if one fails, others still protect. Example: Input validation + output encoding + CSP + HttpOnly cookies. No single point of failure.

**Q: How do you secure npm dependencies?**

A: Regular `npm audit`, automated scanning (Snyk, Dependabot), lock files, pin versions, review before updating, minimize dependencies.

### 🔴 Senior

**Q: Design security architecture for financial application**

A:
```
1. Network Layer:
   - WAF for common attacks
   - DDoS protection
   - TLS 1.3 only

2. Application Layer:
   - Strict CSP with nonces
   - Input validation (allowlist)
   - Output encoding
   - CSRF tokens + SameSite

3. Authentication:
   - MFA required
   - Short sessions (15 min)
   - Secure token storage
   - Brute force protection

4. Data Layer:
   - Encryption at rest
   - Encrypted connections
   - Minimal data exposure

5. Monitoring:
   - Real-time alerting
   - Audit logging
   - Anomaly detection
   - Incident response plan
```

---

## 📚 Active Recall

1. [ ] OWASP Top 10 (name 5)
2. [ ] Essential security headers (4 main ones)
3. [ ] Cookie security attributes
4. [ ] Defense in depth concept
5. [ ] npm security commands

---

> **Module hoàn thành!** Quay lại [README.md](./README.md) để xem tổng quan module.
