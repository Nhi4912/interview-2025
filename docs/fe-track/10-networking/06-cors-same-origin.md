# CORS & Same-Origin Policy - Cross-Origin Security

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Same-Origin Policy bảo vệ users khỏi malicious websites. CORS cho phép controlled cross-origin access.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAME-ORIGIN POLICY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ORIGIN = Protocol + Host + Port                                │
│                                                                   │
│   https://example.com:443/path                                   │
│   └─┬──┘ └────┬─────┘└┬─┘                                       │
│     │         │       │                                          │
│   Protocol   Host    Port                                        │
│                                                                   │
│   SAME ORIGIN EXAMPLES:                                          │
│   ✅ https://example.com/page1 → https://example.com/page2      │
│   ✅ https://example.com:443 → https://example.com              │
│                                                                   │
│   DIFFERENT ORIGIN EXAMPLES:                                     │
│   ❌ https://example.com → http://example.com (protocol)        │
│   ❌ https://example.com → https://api.example.com (host)       │
│   ❌ https://example.com → https://example.com:8080 (port)      │
│                                                                   │
│   BLOCKED BY SOP:                                                │
│   • fetch() to different origin                                  │
│   • Reading cookies from different origin                        │
│   • Accessing DOM of different origin iframe                     │
│   • Reading response from different origin                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Same-Origin Policy (SOP)

### What SOP Protects

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOP PROTECTION                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   WITHOUT SOP (Dangerous):                                       │
│                                                                   │
│   evil.com                         bank.com                      │
│   ┌────────────┐                  ┌────────────┐                │
│   │            │ ── fetch() ───▶  │            │                │
│   │  Attacker  │                  │   Bank     │                │
│   │   Script   │ ◀── data ──────  │   API      │                │
│   └────────────┘                  └────────────┘                │
│        │                                                         │
│        ▼                                                         │
│   Steals user's bank data! ❌                                    │
│                                                                   │
│   WITH SOP (Protected):                                          │
│                                                                   │
│   evil.com                         bank.com                      │
│   ┌────────────┐                  ┌────────────┐                │
│   │            │ ── fetch() ───▶  │            │                │
│   │  Attacker  │                  │   Bank     │                │
│   │   Script   │ ◀── BLOCKED ──   │   API      │                │
│   └────────────┘                  └────────────┘                │
│        │                                                         │
│        ▼                                                         │
│   Cannot read response! ✅                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### What SOP Does NOT Block

```javascript
// ✅ ALLOWED (embedding cross-origin resources):

// Images
<img src="https://other-domain.com/image.png">

// Scripts
<script src="https://cdn.example.com/library.js"></script>

// Stylesheets
<link rel="stylesheet" href="https://fonts.googleapis.com/css">

// Iframes (embedding, not reading)
<iframe src="https://youtube.com/embed/video"></iframe>

// Form submissions
<form action="https://api.example.com/submit" method="POST">

// ❌ BLOCKED:

// Reading cross-origin fetch response
fetch('https://api.other-domain.com/data')
    .then(r => r.json()); // Blocked!

// Accessing iframe content
document.querySelector('iframe').contentDocument; // Blocked!

// Reading cross-origin cookies
document.cookie; // Only same-origin cookies
```

---

## 🔄 CORS (Cross-Origin Resource Sharing)

### CORS Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORS MECHANISM                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SIMPLE REQUEST (No Preflight):                                 │
│   • GET, HEAD, POST only                                         │
│   • Simple headers only                                          │
│   • Content-Type: text/plain, multipart/form-data,              │
│     application/x-www-form-urlencoded                           │
│                                                                   │
│   Browser ──── GET /api/data ────────────────────────▶ Server   │
│            Origin: https://app.com                               │
│                                                                   │
│   Browser ◀─── 200 OK ───────────────────────────────  Server   │
│            Access-Control-Allow-Origin: https://app.com         │
│            { data: "..." }                                       │
│                                                                   │
│   ─────────────────────────────────────────────────────────────  │
│                                                                   │
│   PREFLIGHTED REQUEST:                                           │
│   • PUT, DELETE, PATCH, etc.                                     │
│   • Custom headers (Authorization, X-Custom-Header)             │
│   • Content-Type: application/json                               │
│                                                                   │
│   Step 1: Preflight                                              │
│   Browser ──── OPTIONS /api/data ────────────────────▶ Server   │
│            Origin: https://app.com                               │
│            Access-Control-Request-Method: PUT                    │
│            Access-Control-Request-Headers: Content-Type         │
│                                                                   │
│   Browser ◀─── 204 No Content ───────────────────────  Server   │
│            Access-Control-Allow-Origin: https://app.com         │
│            Access-Control-Allow-Methods: GET, PUT, DELETE       │
│            Access-Control-Allow-Headers: Content-Type           │
│            Access-Control-Max-Age: 86400                         │
│                                                                   │
│   Step 2: Actual Request                                         │
│   Browser ──── PUT /api/data ────────────────────────▶ Server   │
│            Origin: https://app.com                               │
│            Content-Type: application/json                        │
│            { "update": "data" }                                  │
│                                                                   │
│   Browser ◀─── 200 OK ───────────────────────────────  Server   │
│            Access-Control-Allow-Origin: https://app.com         │
│            { "success": true }                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### CORS Headers

```javascript
// Response Headers (Server → Browser)

// Required: Which origins are allowed
Access-Control-Allow-Origin: https://app.example.com
// or
Access-Control-Allow-Origin: * // Any origin (public APIs)

// Optional: Which methods are allowed
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS

// Optional: Which headers client can send
Access-Control-Allow-Headers: Content-Type, Authorization, X-Request-ID

// Optional: Allow cookies/credentials
Access-Control-Allow-Credentials: true

// Optional: Which headers client can read
Access-Control-Expose-Headers: X-Total-Count, X-Page-Size

// Optional: Cache preflight response
Access-Control-Max-Age: 86400 // 24 hours

// Request Headers (Browser → Server, set automatically)
Origin: https://app.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type, Authorization
```

### Server Implementation

```javascript
// Express.js CORS middleware
const cors = require('cors');

// Simple: Allow all origins
app.use(cors());

// Configured: Specific options
app.use(cors({
    origin: ['https://app.example.com', 'https://admin.example.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
    credentials: true, // Allow cookies
    maxAge: 86400 // Cache preflight for 24 hours
}));

// Dynamic origin validation
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://app.example.com',
            'https://admin.example.com'
        ];

        // Allow requests with no origin (mobile apps, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Manual implementation
app.use((req, res, next) => {
    const allowedOrigins = ['https://app.example.com'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.status(204).end();
    }

    next();
});
```

---

## 🍪 Credentials & Cookies

### Sending Credentials Cross-Origin

```javascript
// Client: Must explicitly include credentials
fetch('https://api.example.com/data', {
    credentials: 'include' // Send cookies
});

// axios
axios.get('https://api.example.com/data', {
    withCredentials: true
});

// Server: Must explicitly allow
Access-Control-Allow-Credentials: true

// IMPORTANT: Cannot use wildcard with credentials
// ❌ Access-Control-Allow-Origin: *
// ❌ Access-Control-Allow-Headers: *
// ❌ Access-Control-Allow-Methods: *

// ✅ Must specify exact values
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

### Cookie Attributes for Cross-Origin

```javascript
// Server setting cross-origin cookie
res.cookie('session', 'abc123', {
    httpOnly: true,
    secure: true, // Required for cross-origin
    sameSite: 'None', // Required for cross-origin
    domain: '.example.com', // Allow subdomains
    path: '/',
    maxAge: 24 * 60 * 60 * 1000
});

// SameSite values:
// 'Strict': Cookie only sent for same-site requests
// 'Lax': Cookie sent for navigation requests (default)
// 'None': Cookie sent for all requests (requires Secure)
```

---

## ⚠️ Common CORS Errors

### Error Types and Solutions

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORS ERROR TROUBLESHOOTING                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ERROR: "No 'Access-Control-Allow-Origin' header"              │
│   CAUSE: Server not sending CORS headers                         │
│   FIX: Add Access-Control-Allow-Origin header on server         │
│                                                                   │
│   ERROR: "Origin not allowed"                                    │
│   CAUSE: Server allows different origin than request             │
│   FIX: Add your origin to allowed list on server                 │
│                                                                   │
│   ERROR: "Preflight request failed"                              │
│   CAUSE: Server not handling OPTIONS request properly            │
│   FIX: Return 204 with CORS headers for OPTIONS                  │
│                                                                   │
│   ERROR: "Credentials not supported with wildcard"              │
│   CAUSE: Using * origin with credentials                         │
│   FIX: Specify exact origin, not wildcard                        │
│                                                                   │
│   ERROR: "Header not allowed"                                    │
│   CAUSE: Custom header not in Access-Control-Allow-Headers      │
│   FIX: Add header to allowed headers list                        │
│                                                                   │
│   ERROR: "Method not allowed"                                    │
│   CAUSE: HTTP method not in Access-Control-Allow-Methods        │
│   FIX: Add method to allowed methods list                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```javascript
// Debugging CORS issues

// 1. Check browser Network tab
// Look for OPTIONS preflight request
// Check response headers

// 2. Test with curl (bypasses CORS)
// curl -v https://api.example.com/data
// If this works, it's a CORS config issue

// 3. Check if preflight is cached
// Clear browser cache or use incognito

// 4. Verify origin matches exactly
console.log(window.location.origin);
// Must match Access-Control-Allow-Origin exactly

// 5. Common frontend mistakes
// ❌ Trailing slash mismatch
fetch('https://api.example.com/data/'); // trailing slash

// ❌ Wrong protocol
fetch('http://api.example.com/data'); // http vs https

// ❌ Missing credentials
fetch(url); // Should be: fetch(url, { credentials: 'include' })
```

---

## 🛡️ Security Considerations

### CORS Security Best Practices

```javascript
// ❌ BAD: Allow all origins
Access-Control-Allow-Origin: *

// ❌ BAD: Dynamic origin without validation
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

// ✅ GOOD: Whitelist validation
const allowedOrigins = [
    'https://app.example.com',
    'https://admin.example.com'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin'); // Important for caching!
    }

    next();
});

// ✅ GOOD: Environment-based configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://app.example.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
};
```

### Avoiding CORS Pitfalls

```javascript
// 1. Don't expose sensitive headers
// ❌ Access-Control-Expose-Headers: Authorization
// ✅ Only expose non-sensitive custom headers

// 2. Limit allowed methods
// ❌ Access-Control-Allow-Methods: *
// ✅ Access-Control-Allow-Methods: GET, POST

// 3. Validate Content-Type
// Server should validate Content-Type for POST/PUT

// 4. Use CSRF tokens with CORS
// CORS doesn't prevent CSRF, add token validation

// 5. Don't disable CORS for convenience
// Use proxy in development instead
// vite.config.js
export default {
    server: {
        proxy: {
            '/api': {
                target: 'https://api.example.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
};
```

---

## 🔀 Alternatives to CORS

### JSONP (Legacy)

```javascript
// JSONP - JSON with Padding (old technique)
// Only works for GET, security risks

// Client
function handleResponse(data) {
    console.log(data);
}

const script = document.createElement('script');
script.src = 'https://api.example.com/data?callback=handleResponse';
document.body.appendChild(script);

// Server returns:
handleResponse({"name": "John", "age": 30});

// Don't use JSONP - use CORS instead
```

### Proxy Server

```javascript
// Development proxy (recommended)
// vite.config.js or webpack.config.js

// Production: API Gateway / Reverse Proxy
// nginx.conf
location /api/ {
    proxy_pass https://api.example.com/;
    proxy_set_header Host api.example.com;
    proxy_set_header X-Real-IP $remote_addr;
}

// BFF (Backend for Frontend)
// Your own server makes the cross-origin request
// app.example.com → your-server.com/api → external-api.com
```

### PostMessage (iframes)

```javascript
// Parent page
const iframe = document.querySelector('iframe');

iframe.contentWindow.postMessage(
    { type: 'getData', id: 123 },
    'https://trusted-origin.com'
);

window.addEventListener('message', (event) => {
    if (event.origin !== 'https://trusted-origin.com') return;
    console.log('Received:', event.data);
});

// In iframe
window.addEventListener('message', (event) => {
    if (event.origin !== 'https://parent-origin.com') return;

    if (event.data.type === 'getData') {
        event.source.postMessage(
            { data: 'response' },
            event.origin
        );
    }
});
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is CORS?**

A: Cross-Origin Resource Sharing - mechanism that allows servers to specify which origins can access their resources. Uses HTTP headers to tell browsers which cross-origin requests are allowed.

**Q: What is Same-Origin Policy?**

A: Security feature that restricts how scripts from one origin can interact with resources from another origin. Origin = protocol + host + port.

### 🟡 Mid-level

**Q: When does browser send preflight request?**

A: Preflight (OPTIONS) is sent when request is NOT "simple":
- Methods other than GET, HEAD, POST
- Custom headers (Authorization, X-*)
- Content-Type other than text/plain, multipart/form-data, application/x-www-form-urlencoded

**Q: Why can't you use `Access-Control-Allow-Origin: *` with credentials?**

A: Security reason. Wildcard would allow any website to make authenticated requests to your API. Must specify exact origin to prevent credential leakage.

### 🔴 Senior

**Q: How would you debug CORS issues in production?**

A:
1. Check server logs for incoming OPTIONS requests
2. Verify response headers using curl or Postman
3. Check if CDN/proxy is stripping CORS headers
4. Verify origin matching (exact match, case sensitive)
5. Check Vary header for proper caching
6. Look for multiple Access-Control-Allow-Origin headers (conflict)
7. Verify credentials configuration on both client and server

**Q: Design CORS policy for microservices architecture**

A:
```
1. API Gateway handles CORS centrally
   - Validates origins against whitelist
   - Adds CORS headers to all responses
   - Caches preflight responses

2. Internal services don't need CORS
   - Communication is server-to-server
   - Use service mesh for security

3. Public APIs:
   - Allow-Origin: * (no credentials)
   - Rate limiting by API key instead

4. Private APIs:
   - Strict origin whitelist
   - Credentials with specific origins
   - Short preflight cache

5. Monitoring:
   - Log blocked CORS requests
   - Alert on new origin patterns
```

---

## 📚 Active Recall

1. [ ] Components of an origin (3 parts)
2. [ ] Simple vs preflighted requests
3. [ ] Required headers for CORS with credentials
4. [ ] Why SOP exists and what it prevents
5. [ ] How to debug CORS errors

---

> **Tiếp theo:** [mindmap-networking.md](./mindmap-networking.md) - Networking Mind Map
