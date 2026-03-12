# Authentication - Identity & Access Management

> Authentication xác định "bạn là ai". Hiểu JWT, OAuth, và session management là critical cho frontend security.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LANDSCAPE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   AUTHENTICATION                         │   │
│   │              "Who are you?"                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│          ┌─────────────────┼─────────────────┐                  │
│          │                 │                 │                   │
│   ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐          │
│   │   SESSION   │   │     JWT     │   │    OAUTH    │          │
│   │   BASED     │   │   TOKENS    │   │    2.0      │          │
│   ├─────────────┤   ├─────────────┤   ├─────────────┤          │
│   │ Server-side │   │  Stateless  │   │ Third-party │          │
│   │   storage   │   │  Self-cont  │   │    login    │          │
│   │  HttpOnly   │   │  Scalable   │   │  Delegated  │          │
│   │   cookie    │   │  Cross-svc  │   │   access    │          │
│   └─────────────┘   └─────────────┘   └─────────────┘          │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   AUTHORIZATION                          │   │
│   │          "What are you allowed to do?"                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🍪 Session-Based Authentication

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION FLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Login                                                       │
│   Client ──── POST /login ────────────────────────▶ Server      │
│          { email, password }                                     │
│                                                                   │
│   2. Server creates session                                      │
│   Server stores: { sessionId: "abc", userId: 123, ... }         │
│                                                                   │
│   3. Server sends session ID in cookie                           │
│   Client ◀─── Set-Cookie: session=abc ─────────── Server       │
│                                                                   │
│   4. Subsequent requests include cookie automatically            │
│   Client ──── GET /profile ───────────────────────▶ Server      │
│          Cookie: session=abc                                     │
│                                                                   │
│   5. Server looks up session                                     │
│   Server: sessions["abc"] → { userId: 123 } → return user data  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// Express session setup
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');

const redisClient = redis.createClient();

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,     // Prevent XSS access
        secure: true,       // HTTPS only
        sameSite: 'strict', // CSRF protection
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user.id;
    req.session.role = user.role;

    res.json({ user: { id: user.id, email: user.email } });
});

// Protected route
app.get('/profile', requireAuth, async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.json({ user });
});

// Middleware
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
}

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});
```

---

## 🔑 JWT (JSON Web Tokens)

### JWT Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    JWT STRUCTURE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                         │
│   eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4ifQ.               │
│   SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV                            │
│   └──────────┬─────────────┘                                     │
│              │                                                   │
│   HEADER.PAYLOAD.SIGNATURE                                       │
│                                                                   │
│   HEADER (base64url encoded):                                    │
│   {                                                              │
│     "alg": "HS256",    // Algorithm                             │
│     "typ": "JWT"       // Type                                  │
│   }                                                              │
│                                                                   │
│   PAYLOAD (base64url encoded):                                   │
│   {                                                              │
│     "sub": "1234567890",     // Subject (user ID)               │
│     "name": "John Doe",      // Custom claim                    │
│     "iat": 1516239022,       // Issued at                       │
│     "exp": 1516242622        // Expiration                      │
│   }                                                              │
│                                                                   │
│   SIGNATURE:                                                     │
│   HMACSHA256(                                                    │
│     base64UrlEncode(header) + "." + base64UrlEncode(payload),   │
│     secret                                                       │
│   )                                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### JWT Implementation

```javascript
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Generate tokens
function generateTokens(user) {
    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
}

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token (for revocation)
    await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Send refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Send access token in response body
    res.json({ accessToken, user: { id: user.id, email: user.email } });
});

// Verify middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

// Refresh token
app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    // Check if token exists and not revoked
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const user = await User.findById(decoded.userId);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // Rotate refresh token
        await RefreshToken.deleteOne({ token: refreshToken });
        await RefreshToken.create({
            token: newRefreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        res.json({ accessToken });
    });
});

// Logout - revoke refresh token
app.post('/logout', async (req, res) => {
    const { refreshToken } = req.cookies;
    await RefreshToken.deleteOne({ token: refreshToken });
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
});
```

### Frontend JWT Handling

```javascript
// Token storage and management
class AuthService {
    constructor() {
        this.accessToken = null;
    }

    // Store in memory (not localStorage!)
    setAccessToken(token) {
        this.accessToken = token;
    }

    getAccessToken() {
        return this.accessToken;
    }

    // Authenticated fetch
    async authFetch(url, options = {}) {
        let accessToken = this.getAccessToken();

        // Check if token is expired
        if (this.isTokenExpired(accessToken)) {
            accessToken = await this.refreshAccessToken();
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include' // For refresh token cookie
        });

        // Handle 401 - try refresh
        if (response.status === 401) {
            accessToken = await this.refreshAccessToken();
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'
            });
        }

        return response;
    }

    isTokenExpired(token) {
        if (!token) return true;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    }

    async refreshAccessToken() {
        const response = await fetch('/api/refresh', {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            // Refresh failed - redirect to login
            window.location.href = '/login';
            throw new Error('Session expired');
        }

        const { accessToken } = await response.json();
        this.setAccessToken(accessToken);
        return accessToken;
    }
}
```

---

## 🔐 OAuth 2.0

### OAuth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    OAUTH 2.0 AUTHORIZATION CODE FLOW             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   User        Client          Auth Server        Resource Server │
│     │           │                  │                    │        │
│     │──Click "Login with Google"──▶│                    │        │
│     │           │                  │                    │        │
│     │           │───Redirect───────▶│                    │        │
│     │           │  (client_id,      │                    │        │
│     │           │   redirect_uri,   │                    │        │
│     │           │   scope, state)   │                    │        │
│     │           │                  │                    │        │
│     │◀──────────Login & Consent────│                    │        │
│     │                              │                    │        │
│     │────────Approve───────────────▶│                    │        │
│     │                              │                    │        │
│     │           │◀──Redirect + Code│                    │        │
│     │           │                  │                    │        │
│     │           │───Exchange Code──▶│                    │        │
│     │           │   (code, secret)  │                    │        │
│     │           │                  │                    │        │
│     │           │◀──Access Token───│                    │        │
│     │           │   (+ Refresh)    │                    │        │
│     │           │                  │                    │        │
│     │           │───Get User Info──────────────────────▶│        │
│     │           │◀──User Data──────────────────────────│        │
│     │           │                  │                    │        │
│     │◀──Logged In───│                                   │        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### OAuth Implementation

```javascript
// Using passport.js with Google OAuth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        // Generate your own tokens
        const { accessToken, refreshToken } = generateTokens(req.user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        // Redirect to frontend with access token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}`);
    }
);
```

### Frontend OAuth Flow

```javascript
// Initiate OAuth
function loginWithGoogle() {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
}

// Handle callback (on /auth/callback page)
function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('token');

    if (accessToken) {
        authService.setAccessToken(accessToken);
        // Remove token from URL
        window.history.replaceState({}, '', '/');
        // Redirect to dashboard
        window.location.href = '/dashboard';
    }
}
```

---

## ⚖️ Session vs JWT Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION vs JWT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ASPECT              SESSION              JWT                   │
│   ──────────────────────────────────────────────────────────────  │
│                                                                   │
│   State               Stateful             Stateless             │
│                       (server stores)      (client stores)       │
│                                                                   │
│   Storage             Redis/DB             Client memory         │
│                                            or cookie             │
│                                                                   │
│   Revocation          Easy                 Hard                  │
│                       (delete session)     (need blacklist)      │
│                                                                   │
│   Scaling             Need shared store    Easy                  │
│                                            (any server)          │
│                                                                   │
│   Size                Small cookie ID      Larger token          │
│                       (32 bytes)           (>200 bytes)          │
│                                                                   │
│   XSS Risk            Low (httpOnly)       Higher if in JS       │
│                                            memory/localStorage   │
│                                                                   │
│   CSRF Risk           Higher               Lower                 │
│                       (auto-sent cookie)   (not auto-sent)       │
│                                                                   │
│   Microservices       Each needs session   Works well            │
│                       access               (self-contained)      │
│                                                                   │
│   RECOMMENDATION:                                                │
│   ─────────────────                                              │
│   Monolith: Sessions usually simpler and more secure            │
│   Microservices: JWT with short expiry + refresh tokens         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Token Storage Security

```javascript
// Storage options ranked by security

// 1. HttpOnly Cookie (BEST for refresh tokens)
// ✅ Not accessible via JavaScript (XSS safe)
// ⚠️ Needs CSRF protection
res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
});

// 2. JavaScript Memory (GOOD for access tokens)
// ✅ Not persisted, cleared on page close
// ⚠️ Lost on refresh, needs to re-fetch
class TokenStore {
    #accessToken = null;
    setToken(token) { this.#accessToken = token; }
    getToken() { return this.#accessToken; }
}

// 3. SessionStorage (ACCEPTABLE)
// ✅ Cleared when tab closes
// ⚠️ Accessible via XSS
sessionStorage.setItem('accessToken', token);

// 4. LocalStorage (AVOID for sensitive tokens)
// ❌ Persists forever
// ❌ Accessible via XSS
// ❌ Available to all tabs
// Only use for non-sensitive preferences
localStorage.setItem('accessToken', token); // DON'T DO THIS

// RECOMMENDED PATTERN:
// - Refresh token: HttpOnly cookie
// - Access token: Memory (with auto-refresh)
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is JWT?**

A: JSON Web Token - self-contained token with header, payload, and signature. Contains user info and is cryptographically signed. Used for stateless authentication.

**Q: Where should you store JWT?**

A: Best practice: Access token in memory, refresh token in HttpOnly cookie. Never store access tokens in localStorage (XSS risk).

### 🟡 Mid-level

**Q: JWT vs Session - when to use each?**

A:
- **Session**: Monolith apps, need easy revocation, lower XSS risk. Stored server-side.
- **JWT**: Microservices, stateless scaling, cross-service auth. Self-contained.

JWT with short expiry + refresh token rotation gives best of both.

**Q: How do you revoke a JWT?**

A:
1. Short expiry (15 min) - wait for natural expiration
2. Token blacklist - check against blacklist on each request
3. Token versioning - increment user's token version on logout
4. Refresh token rotation - invalidate refresh token in database

### 🔴 Senior

**Q: Design authentication for microservices**

A:
```
1. Auth Service:
   - Handles login, token generation
   - Stores refresh tokens
   - Issues short-lived JWTs (15 min)

2. API Gateway:
   - Validates JWT signature
   - Checks token expiry
   - Attaches user context to requests

3. Services:
   - Trust gateway-forwarded context
   - Don't validate JWT themselves

4. Token Strategy:
   - Access token: 15 min, in memory
   - Refresh token: 7 days, httpOnly cookie
   - Rotate refresh tokens on use

5. Revocation:
   - Token version in JWT
   - Check version against Redis cache
   - Propagate logout across services
```

---

## 📚 Active Recall

1. [ ] JWT structure (3 parts)
2. [ ] OAuth authorization code flow (steps)
3. [ ] Session vs JWT trade-offs
4. [ ] Secure token storage hierarchy
5. [ ] Refresh token rotation pattern

---

> **Tiếp theo:** [04-content-security-policy.md](./04-content-security-policy.md) - Content Security Policy
