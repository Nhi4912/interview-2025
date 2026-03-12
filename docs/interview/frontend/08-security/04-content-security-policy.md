# Content Security Policy - Defense in Depth

> CSP là browser security feature mạnh nhất để prevent XSS. Hiểu cách configure và deploy CSP effectively.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT SECURITY POLICY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   CSP tells browser WHAT content is allowed to load              │
│                                                                   │
│   WITHOUT CSP:                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Browser loads ANY script, style, image from ANYWHERE    │   │
│   │ Attacker injects: <script src="evil.com/steal.js">     │   │
│   │ Browser: "OK, loading evil.com!" 💀                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   WITH CSP:                                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Browser only loads from WHITELISTED sources             │   │
│   │ Attacker injects: <script src="evil.com/steal.js">     │   │
│   │ Browser: "evil.com not in policy, BLOCKED!" ✅          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   CSP BENEFITS:                                                  │
│   • Mitigate XSS attacks                                         │
│   • Prevent data injection                                       │
│   • Control resource loading                                     │
│   • Report violations for monitoring                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 CSP Directives

### Core Directives

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSP DIRECTIVES                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   FETCH DIRECTIVES (what resources can be loaded)                │
│   ─────────────────────────────────────────────────────────────  │
│   default-src    │ Fallback for all resource types              │
│   script-src     │ JavaScript sources                           │
│   style-src      │ CSS sources                                  │
│   img-src        │ Image sources                                │
│   font-src       │ Web font sources                             │
│   connect-src    │ XHR, WebSocket, fetch                        │
│   media-src      │ Audio, video sources                         │
│   object-src     │ <object>, <embed>, <applet>                  │
│   frame-src      │ iframe sources                               │
│   worker-src     │ Web Workers, Service Workers                 │
│   child-src      │ Deprecated (use frame-src, worker-src)       │
│                                                                   │
│   DOCUMENT DIRECTIVES                                            │
│   ─────────────────────────────────────────────────────────────  │
│   base-uri       │ Restrict <base> element                      │
│   sandbox        │ Enable sandbox for page                      │
│   form-action    │ Where forms can submit                       │
│                                                                   │
│   NAVIGATION DIRECTIVES                                          │
│   ─────────────────────────────────────────────────────────────  │
│   navigate-to    │ Where document can navigate                  │
│   frame-ancestors│ Who can embed this page (X-Frame-Options)    │
│                                                                   │
│   REPORTING DIRECTIVES                                           │
│   ─────────────────────────────────────────────────────────────  │
│   report-uri     │ Where to send violation reports              │
│   report-to      │ Reporting API endpoint                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Source Values

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSP SOURCE VALUES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   KEYWORD VALUES:                                                │
│   'self'         │ Same origin as document                      │
│   'none'         │ Block all                                    │
│   'unsafe-inline'│ Allow inline <script>, <style> (dangerous!)  │
│   'unsafe-eval'  │ Allow eval(), Function() (dangerous!)        │
│   'strict-dynamic'│ Trust scripts loaded by trusted scripts     │
│   'unsafe-hashes'│ Allow specific inline event handlers         │
│                                                                   │
│   HOST VALUES:                                                   │
│   https://example.com       │ Specific host                     │
│   https://*.example.com     │ Subdomains                        │
│   https:                    │ Any HTTPS source                  │
│   data:                     │ data: URIs                        │
│   blob:                     │ blob: URIs                        │
│                                                                   │
│   NONCE/HASH:                                                    │
│   'nonce-abc123'            │ Allow script with matching nonce  │
│   'sha256-xyz...'           │ Allow script with matching hash   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Basic CSP Configuration

### Starter Policy

```http
# Minimal secure policy
Content-Security-Policy:
    default-src 'self';
    script-src 'self';
    style-src 'self';
    img-src 'self' data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';

# Explained:
# default-src 'self'     - Only load from same origin
# script-src 'self'      - No inline scripts
# style-src 'self'       - No inline styles
# img-src 'self' data:   - Images from self + data URIs
# font-src 'self'        - Fonts from self
# object-src 'none'      - Block Flash, plugins
# base-uri 'self'        - Prevent <base> hijacking
# form-action 'self'     - Forms only submit to self
# frame-ancestors 'none' - Prevent clickjacking
```

### Common Configurations

```javascript
// Express middleware
const helmet = require('helmet');

// Strict CSP
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Often needed
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.example.com"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
    }
}));

// Next.js - next.config.js
const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-{nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

module.exports = {
    async headers() {
        return [{
            source: '/(.*)',
            headers: [{
                key: 'Content-Security-Policy',
                value: cspHeader.replace(/\s{2,}/g, ' ').trim()
            }]
        }];
    }
};
```

---

## 🔐 Nonce-Based CSP

### Why Nonces

```
┌─────────────────────────────────────────────────────────────────┐
│                    NONCE-BASED CSP                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   PROBLEM with 'unsafe-inline':                                  │
│   Allows ALL inline scripts (including attacker-injected)       │
│                                                                   │
│   SOLUTION: Nonces                                               │
│   - Server generates random nonce per request                   │
│   - Add nonce to CSP header                                      │
│   - Add same nonce to allowed <script> tags                     │
│   - Browser only executes scripts with matching nonce           │
│                                                                   │
│   CSP Header:                                                    │
│   script-src 'nonce-abc123'                                     │
│                                                                   │
│   Allowed:                                                       │
│   <script nonce="abc123">console.log('OK')</script>             │
│                                                                   │
│   Blocked:                                                       │
│   <script>alert('XSS')</script>  ← No nonce!                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// Express middleware
const crypto = require('crypto');

app.use((req, res, next) => {
    // Generate random nonce
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.nonce = nonce;

    // Set CSP with nonce
    res.setHeader('Content-Security-Policy', `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'nonce-${nonce}';
    `.replace(/\s+/g, ' ').trim());

    next();
});

// In template (EJS)
<script nonce="<%= nonce %>">
    // This will execute
    console.log('Safe script');
</script>

// React with Next.js
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const response = NextResponse.next();

    const csp = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'nonce-${nonce}';
    `;

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('x-nonce', nonce);

    return response;
}

// Component
function Layout({ children }) {
    const nonce = headers().get('x-nonce');

    return (
        <html>
            <head>
                <script nonce={nonce} src="/analytics.js" />
            </head>
            <body>{children}</body>
        </html>
    );
}
```

---

## 📊 Hash-Based CSP

### Using Hashes

```javascript
// For static inline scripts/styles, use hashes instead of nonces

// Step 1: Write your script
const inlineScript = `console.log('Hello World')`;

// Step 2: Generate SHA-256 hash
const crypto = require('crypto');
const hash = crypto
    .createHash('sha256')
    .update(inlineScript)
    .digest('base64');

// Step 3: Add to CSP
// script-src 'sha256-xyz123...'

// Example CSP
Content-Security-Policy: script-src 'sha256-qznLcsROx4GACP2dm0UCKCzCG-HiZ1guq6ZZDob_Tng='

// In HTML
<script>console.log('Hello World')</script>

// Browser will:
// 1. Hash the script content
// 2. Compare with CSP hashes
// 3. Execute if match, block if not

// Generate hash using openssl:
// echo -n "console.log('Hello World')" | openssl sha256 -binary | openssl base64
```

### Hash vs Nonce

```
┌─────────────────────────────────────────────────────────────────┐
│                    NONCE vs HASH                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   NONCE:                                                         │
│   ├─ Random per request                                         │
│   ├─ Works with dynamic scripts                                 │
│   ├─ Requires server-side generation                            │
│   └─ Better for: SSR, dynamic inline scripts                    │
│                                                                   │
│   HASH:                                                          │
│   ├─ Static, based on content                                   │
│   ├─ Only for static inline scripts                             │
│   ├─ Can be computed at build time                              │
│   └─ Better for: Static sites, known inline scripts             │
│                                                                   │
│   BEST PRACTICE:                                                 │
│   Use 'strict-dynamic' with nonce for modern apps               │
│                                                                   │
│   script-src 'nonce-abc123' 'strict-dynamic'                    │
│   - Trusted scripts (with nonce) can load other scripts         │
│   - Those dynamically loaded scripts are also trusted           │
│   - Works well with bundlers and dynamic imports                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Report-Only Mode

### Testing CSP Safely

```javascript
// Use report-only to test without breaking site
Content-Security-Policy-Report-Only:
    default-src 'self';
    script-src 'self';
    report-uri /csp-violation-report;

// Violations are reported but NOT blocked

// Violation report format
{
    "csp-report": {
        "document-uri": "https://example.com/page",
        "referrer": "https://google.com",
        "violated-directive": "script-src 'self'",
        "effective-directive": "script-src",
        "original-policy": "default-src 'self'; script-src 'self'",
        "blocked-uri": "https://evil.com/script.js",
        "status-code": 200,
        "source-file": "https://example.com/page",
        "line-number": 10,
        "column-number": 5
    }
}

// Server endpoint
app.post('/csp-violation-report', (req, res) => {
    const report = req.body['csp-report'];

    // Log to monitoring system
    logger.warn('CSP Violation', {
        documentUri: report['document-uri'],
        violatedDirective: report['violated-directive'],
        blockedUri: report['blocked-uri']
    });

    res.status(204).end();
});
```

### Modern Reporting API

```javascript
// Using Reporting API (newer)
Content-Security-Policy:
    default-src 'self';
    report-to csp-endpoint;

// Report-To header (defines endpoint)
Report-To: {
    "group": "csp-endpoint",
    "max_age": 10886400,
    "endpoints": [{
        "url": "https://example.com/csp-reports"
    }]
}

// Report format is slightly different (JSON array)
[{
    "type": "csp-violation",
    "age": 10,
    "url": "https://example.com/page",
    "user_agent": "Mozilla/5.0...",
    "body": {
        "documentURL": "https://example.com/page",
        "violatedDirective": "script-src-elem",
        "effectiveDirective": "script-src-elem",
        "originalPolicy": "...",
        "blockedURL": "https://evil.com/script.js",
        "statusCode": 200
    }
}]
```

---

## 🏗️ Framework-Specific CSP

### React (Create React App)

```javascript
// CRA uses 'unsafe-inline' for styles by default
// Custom CSP in public/index.html meta tag (limited)
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self';">

// Better: Configure server (nginx, Express)
// Or use CRACO to customize webpack

// For inline styles, either:
// 1. Use CSS Modules (external files)
// 2. Extract CSS (build step)
// 3. Use nonce (SSR only)
```

### Next.js

```typescript
// next.config.js with nonce
const crypto = require('crypto');

module.exports = {
    async headers() {
        return [{
            source: '/:path*',
            headers: [{
                key: 'Content-Security-Policy',
                value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
            }]
        }];
    }
};

// For dynamic nonce, use middleware
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
    `;

    const response = NextResponse.next();
    response.headers.set(
        'Content-Security-Policy',
        cspHeader.replace(/\s{2,}/g, ' ').trim()
    );

    return response;
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is CSP?**

A: Content Security Policy - HTTP header that tells browser what resources are allowed to load. Prevents XSS by blocking unauthorized scripts, even if attacker injects HTML.

**Q: What does 'self' mean in CSP?**

A: Same origin as the document. `script-src 'self'` means only load scripts from same protocol, host, and port as the page.

### 🟡 Mid-level

**Q: Explain nonce-based CSP**

A: Nonce (number-used-once) is random value generated per request. Server puts nonce in CSP header and on allowed script tags. Browser only executes scripts with matching nonce. Prevents XSS because attacker can't guess the nonce.

**Q: Why is 'unsafe-inline' dangerous?**

A: It allows ALL inline scripts and styles, including attacker-injected ones. Defeats the main purpose of CSP. Use nonces or hashes instead to allow specific inline content.

### 🔴 Senior

**Q: Design CSP strategy for enterprise application**

A:
```
1. Audit Phase (2-4 weeks):
   - Deploy report-only CSP
   - Collect all violations
   - Identify legitimate sources

2. Baseline Policy:
   default-src 'none';
   script-src 'self' 'nonce-xxx' 'strict-dynamic';
   style-src 'self' 'nonce-xxx';
   img-src 'self' data: https://cdn.company.com;
   font-src 'self' https://fonts.gstatic.com;
   connect-src 'self' https://api.company.com;
   object-src 'none';
   base-uri 'none';
   form-action 'self';
   frame-ancestors 'none';

3. Nonce Implementation:
   - Server generates per-request nonce
   - Pass nonce to templates
   - Add to all inline scripts/styles

4. Monitoring:
   - report-uri for violations
   - Alert on unusual patterns
   - Review weekly

5. Continuous Improvement:
   - Remove unnecessary sources
   - Tighten policy over time
   - Test before deployment
```

---

## 📚 Active Recall

1. [ ] Core CSP directives (5 main ones)
2. [ ] Source values ('self', 'none', 'unsafe-inline', etc.)
3. [ ] Nonce vs Hash: when to use each
4. [ ] strict-dynamic purpose
5. [ ] Report-only vs enforced mode

---

> **Tiếp theo:** [05-security-best-practices.md](./05-security-best-practices.md) - Security Best Practices
