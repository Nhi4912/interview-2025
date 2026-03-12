# CSRF Protection - Cross-Site Request Forgery Defense

> CSRF attacks trick users into performing unwanted actions. Hiểu cách attack hoạt động và các phương pháp phòng chống.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSRF ATTACK FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. User logs into bank.com                                     │
│      ┌─────────────┐                  ┌─────────────┐            │
│      │   Browser   │ ── Login ──────▶ │  bank.com   │            │
│      │             │ ◀── Session ──── │             │            │
│      └─────────────┘   Cookie          └─────────────┘            │
│                                                                   │
│   2. User visits evil.com (in another tab)                       │
│      ┌─────────────┐                  ┌─────────────┐            │
│      │   Browser   │ ── Visit ──────▶ │  evil.com   │            │
│      │             │ ◀── Hidden Form ─ │             │            │
│      └─────────────┘                  └─────────────┘            │
│                                                                   │
│   3. evil.com submits form to bank.com                           │
│      ┌─────────────┐                  ┌─────────────┐            │
│      │   Browser   │ ── POST + ─────▶ │  bank.com   │            │
│      │             │    Cookies        │             │            │
│      └─────────────┘                  └─────────────┘            │
│      (Form auto-submits with user's session!)                    │
│                                                                   │
│   4. bank.com executes request as user!                          │
│      Money transferred to attacker 💀                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔴 How CSRF Works

### Attack Scenario

```html
<!-- On evil.com -->

<!-- 1. Image tag (GET request) -->
<img src="https://bank.com/transfer?to=attacker&amount=10000" />

<!-- 2. Hidden form (POST request) -->
<form action="https://bank.com/transfer" method="POST" id="stealForm">
    <input type="hidden" name="to" value="attacker" />
    <input type="hidden" name="amount" value="10000" />
</form>
<script>
    document.getElementById('stealForm').submit();
</script>

<!-- 3. Iframe with form -->
<iframe name="csrf-frame" style="display:none;"></iframe>
<form action="https://bank.com/transfer" method="POST" target="csrf-frame">
    <input type="hidden" name="to" value="attacker" />
    <input type="hidden" name="amount" value="10000" />
</form>
<script>document.forms[0].submit();</script>
```

### Why It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHY CSRF WORKS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Browser automatically includes cookies with requests        │
│      - User's session cookie sent to bank.com                   │
│      - Server can't tell if request is legitimate               │
│                                                                   │
│   2. Same-Origin Policy allows form submissions                  │
│      - SOP blocks reading response                               │
│      - But allows sending the request!                           │
│                                                                   │
│   3. Server trusts cookie-authenticated requests                 │
│      - Cookie present = valid user                               │
│      - No way to verify user's intent                            │
│                                                                   │
│   CONDITIONS FOR CSRF:                                           │
│   ✓ Action that changes state (transfer, delete, update)        │
│   ✓ Cookie-based authentication                                  │
│   ✓ No unpredictable parameters                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Prevention Methods

### 1. CSRF Tokens (Synchronizer Token Pattern)

```javascript
// Server: Generate and embed token
const crypto = require('crypto');

app.use((req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
});

// Template: Include token in forms
<form action="/transfer" method="POST">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
    <input name="to" />
    <input name="amount" />
    <button type="submit">Transfer</button>
</form>

// Server: Validate token
app.post('/transfer', (req, res) => {
    if (req.body._csrf !== req.session.csrfToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    // Process transfer...
});

// For AJAX requests: Include in header
fetch('/api/transfer', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({ to: 'recipient', amount: 100 })
});

// Server: Check header
app.post('/api/transfer', (req, res) => {
    const token = req.headers['x-csrf-token'];
    if (token !== req.session.csrfToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
});
```

### 2. SameSite Cookies

```javascript
// Modern and simple protection
res.cookie('session', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict' // or 'Lax'
});

/*
SameSite Values:

Strict:
- Cookie ONLY sent for same-site requests
- Most secure
- May break legitimate cross-site flows (OAuth redirects)

Lax (default in modern browsers):
- Cookie sent for same-site OR top-level navigation
- Allows links from other sites to work
- Blocks: forms, iframes, AJAX from other sites

None:
- Cookie always sent
- Requires Secure flag
- Use only when needed (3rd party cookies)
*/

// Comparison table:
// Request Type          | Strict | Lax    | None
// --------------------- | ------ | ------ | ------
// Same-site link        | ✅     | ✅     | ✅
// Same-site form GET    | ✅     | ✅     | ✅
// Same-site form POST   | ✅     | ✅     | ✅
// Cross-site link       | ❌     | ✅     | ✅
// Cross-site form GET   | ❌     | ❌     | ✅
// Cross-site form POST  | ❌     | ❌     | ✅
// Cross-site iframe     | ❌     | ❌     | ✅
// Cross-site AJAX       | ❌     | ❌     | ✅
```

### 3. Double Submit Cookie

```javascript
// Server: Set CSRF cookie
app.use((req, res, next) => {
    if (!req.cookies.csrfToken) {
        const token = crypto.randomBytes(32).toString('hex');
        res.cookie('csrfToken', token, {
            httpOnly: false, // JavaScript needs to read it
            secure: true,
            sameSite: 'Strict'
        });
    }
    next();
});

// Client: Read cookie, send in header
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

fetch('/api/transfer', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCookie('csrfToken')
    },
    body: JSON.stringify(data),
    credentials: 'include'
});

// Server: Compare cookie and header
app.post('/api/transfer', (req, res) => {
    const cookieToken = req.cookies.csrfToken;
    const headerToken = req.headers['x-csrf-token'];

    if (!cookieToken || cookieToken !== headerToken) {
        return res.status(403).json({ error: 'CSRF validation failed' });
    }
    // Process request...
});

// Why this works:
// - Attacker can make browser send cookie
// - Attacker cannot READ the cookie (Same-Origin Policy)
// - Attacker cannot set the header value
// - Must match = must be from our origin
```

### 4. Origin/Referer Header Validation

```javascript
// Check Origin or Referer header
function validateOrigin(req, res, next) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;

    // Trusted origins
    const trustedOrigins = [
        'https://myapp.com',
        'https://www.myapp.com'
    ];

    // Check Origin header first
    if (origin) {
        if (!trustedOrigins.includes(origin)) {
            return res.status(403).json({ error: 'Invalid origin' });
        }
        return next();
    }

    // Fall back to Referer
    if (referer) {
        const refererOrigin = new URL(referer).origin;
        if (!trustedOrigins.includes(refererOrigin)) {
            return res.status(403).json({ error: 'Invalid referer' });
        }
        return next();
    }

    // No Origin or Referer - could be direct API call
    // Decide based on your security requirements
    return res.status(403).json({ error: 'Missing origin' });
}

// Note: Not recommended as sole protection
// - Headers can be stripped by proxies
// - Some browsers don't send Referer
// - Use in combination with other methods
```

---

## 📱 Framework Implementations

### Express with csurf

```javascript
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Token available in res.locals
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Handle errors
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next(err);
});
```

### Next.js

```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // For state-changing requests
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
        const origin = request.headers.get('origin');
        const allowedOrigins = [process.env.NEXT_PUBLIC_BASE_URL];

        if (!origin || !allowedOrigins.includes(origin)) {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }

    return NextResponse.next();
}

// API route with CSRF token
// pages/api/csrf.ts
import { randomBytes } from 'crypto';

export default function handler(req, res) {
    const token = randomBytes(32).toString('hex');
    res.setHeader('Set-Cookie', `csrfToken=${token}; Path=/; HttpOnly; SameSite=Strict`);
    res.json({ csrfToken: token });
}
```

### React with Fetch

```javascript
// Custom hook for CSRF-protected requests
import { useState, useEffect, useCallback } from 'react';

function useCsrf() {
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        // Get CSRF token on mount
        fetch('/api/csrf')
            .then(res => res.json())
            .then(data => setCsrfToken(data.csrfToken));
    }, []);

    const csrfFetch = useCallback(async (url, options = {}) => {
        return fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...options.headers,
                'X-CSRF-Token': csrfToken
            }
        });
    }, [csrfToken]);

    return { csrfToken, csrfFetch };
}

// Usage
function TransferForm() {
    const { csrfToken, csrfFetch } = useCsrf();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await csrfFetch('/api/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: 'recipient', amount: 100 })
        });
        // Handle response...
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Hidden field for non-AJAX forms */}
            <input type="hidden" name="_csrf" value={csrfToken} />
            {/* Form fields... */}
        </form>
    );
}
```

---

## ⚠️ Common Mistakes

### Mistakes to Avoid

```javascript
// ❌ MISTAKE 1: Token in URL (visible in logs, history)
<a href="/delete?id=123&csrf=abc">Delete</a>

// ✅ Use POST with hidden field
<form action="/delete" method="POST">
    <input type="hidden" name="id" value="123" />
    <input type="hidden" name="_csrf" value="abc" />
    <button type="submit">Delete</button>
</form>

// ❌ MISTAKE 2: Static CSRF token (easily stolen)
const CSRF_TOKEN = 'static-secret-123';

// ✅ Generate unique token per session/request
const token = crypto.randomBytes(32).toString('hex');

// ❌ MISTAKE 3: Not validating on all state-changing endpoints
app.post('/profile', csrfProtection, ...); // Protected
app.delete('/account', ...); // NOT PROTECTED!

// ✅ Protect all state-changing endpoints
app.post('/profile', csrfProtection, ...);
app.put('/profile', csrfProtection, ...);
app.delete('/account', csrfProtection, ...);

// ❌ MISTAKE 4: CSRF token in localStorage (XSS can steal it)
localStorage.setItem('csrf', token);

// ✅ Keep in httpOnly cookie + require in header/body
// Or keep in memory (JavaScript variable)

// ❌ MISTAKE 5: Ignoring preflight requests
// OPTIONS requests don't include cookies
// Make sure actual request is still validated
```

---

## 🔍 CSRF vs XSS

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSRF vs XSS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   CSRF                           XSS                             │
│   ────                           ───                             │
│   Exploits trusted session       Executes attacker code         │
│   User performs unwanted action  Attacker steals data/session   │
│   Requires user to be logged in  Can work without session       │
│   Can't read response            Can read/modify anything       │
│   State-changing actions only    Any action possible            │
│                                                                   │
│   RELATIONSHIP:                                                  │
│   ─────────────                                                  │
│   XSS can defeat CSRF protection!                               │
│   - XSS can read CSRF token from page                           │
│   - XSS can submit forms with valid tokens                      │
│                                                                   │
│   Therefore:                                                     │
│   Must protect against BOTH                                     │
│   XSS is often more severe                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is CSRF?**

A: Cross-Site Request Forgery - attack that tricks logged-in users into submitting unwanted requests. Attacker creates a page that makes requests to target site using victim's session cookie.

**Q: How does SameSite cookie help?**

A: SameSite cookie attribute prevents browser from sending cookies with cross-site requests. `Strict` blocks all cross-site, `Lax` allows top-level navigation but blocks forms/AJAX from other sites.

### 🟡 Mid-level

**Q: Explain CSRF token pattern**

A:
1. Server generates random token, stores in session
2. Token embedded in form as hidden field
3. On submit, server compares submitted token with session token
4. If mismatch, reject request

Token works because attacker can't read values from our domain (Same-Origin Policy).

**Q: Double submit cookie vs synchronizer token?**

A:
- **Synchronizer**: Token stored in session, compared with form value. Requires session storage.
- **Double submit**: Token in cookie AND request body/header. Compare both values. Stateless - no session needed.

Double submit is simpler but slightly weaker (subdomain attacks possible).

### 🔴 Senior

**Q: How would you implement CSRF protection in microservices?**

A:
```
1. API Gateway approach:
   - Gateway generates and validates CSRF tokens
   - Internal services trust gateway
   - Single point of validation

2. JWT with custom claims:
   - Include origin in JWT claims
   - Validate origin matches request
   - Combine with SameSite cookies

3. Double submit with shared secret:
   - Token = HMAC(session_id, secret)
   - Services share secret for validation
   - Stateless validation

4. Additional layers:
   - Origin/Referer validation
   - SameSite=Strict cookies
   - Short token expiry
   - Rate limiting
```

---

## 📚 Active Recall

1. [ ] CSRF attack flow (5 steps)
2. [ ] SameSite cookie values và behavior
3. [ ] CSRF token implementation methods
4. [ ] Why double submit cookie works
5. [ ] CSRF vs XSS relationship

---

> **Tiếp theo:** [03-authentication.md](./03-authentication.md) - Authentication
