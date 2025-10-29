# Common Web Vulnerabilities
## Web Security - Chapter 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Authentication & Authorization →](./02-auth-authorization.md)

---

## Overview

Understanding common web vulnerabilities is crucial for building secure applications and succeeding in Big Tech interviews. This chapter covers OWASP Top 10 vulnerabilities with practical examples and prevention strategies.

---

## Table of Contents
1. [Cross-Site Scripting (XSS)](#cross-site-scripting-xss)
2. [Cross-Site Request Forgery (CSRF)](#cross-site-request-forgery-csrf)
3. [SQL Injection](#sql-injection)
4. [Broken Authentication](#broken-authentication)
5. [Sensitive Data Exposure](#sensitive-data-exposure)
6. [XML External Entities (XXE)](#xml-external-entities-xxe)
7. [Broken Access Control](#broken-access-control)
8. [Security Misconfiguration](#security-misconfiguration)
9. [Insecure Deserialization](#insecure-deserialization)
10. [Using Components with Known Vulnerabilities](#using-components-with-known-vulnerabilities)
11. [Interview Questions](#interview-questions)

---

## Cross-Site Scripting (XSS)

### What is XSS?

**Definition:** XSS allows attackers to inject malicious scripts into web pages viewed by other users.

### Types of XSS

```typescript
// 1. Stored XSS (Persistent)
// Malicious script stored in database

// ❌ Vulnerable code
function CommentSection({ comments }: { comments: Comment[] }) {
  return (
    <div>
      {comments.map(comment => (
        <div
          key={comment.id}
          dangerouslySetInnerHTML={{ __html: comment.text }}
        />
      ))}
    </div>
  );
}

// Attack: User submits comment with script
const maliciousComment = {
  text: '<script>alert("XSS")</script>'
};

// ✅ Safe: React automatically escapes
function CommentSection({ comments }: { comments: Comment[] }) {
  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>
          {comment.text} {/* Automatically escaped */}
        </div>
      ))}
    </div>
  );
}

// ✅ If HTML needed: Sanitize first
import DOMPurify from 'dompurify';

function CommentSection({ comments }: { comments: Comment[] }) {
  return (
    <div>
      {comments.map(comment => (
        <div
          key={comment.id}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(comment.text)
          }}
        />
      ))}
    </div>
  );
}

// 2. Reflected XSS (Non-Persistent)
// Script in URL parameter

// ❌ Vulnerable: Displaying URL parameter
function SearchResults() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  return (
    <div>
      <h1>Results for: {query}</h1> {/* Safe in React */}
      {/* But dangerous if using innerHTML */}
    </div>
  );
}

// Attack URL:
// https://example.com/search?q=<script>alert('XSS')</script>

// ✅ Safe: Always sanitize user input
function SearchResults() {
  const params = new URLSearchParams(window.location.search);
  const query = DOMPurify.sanitize(params.get('q') || '');

  return (
    <div>
      <h1>Results for: {query}</h1>
    </div>
  );
}

// 3. DOM-based XSS
// Script manipulates DOM directly

// ❌ Vulnerable
function updateDOM() {
  const hash = window.location.hash.substring(1);
  document.getElementById('content')!.innerHTML = hash;
}

// Attack URL:
// https://example.com/#<img src=x onerror=alert('XSS')>

// ✅ Safe: Use textContent or React
function SafeComponent() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    setContent(DOMPurify.sanitize(hash));
  }, []);

  return <div>{content}</div>;
}
```

### XSS Prevention

```typescript
// 1. Content Security Policy (CSP)
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.example.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

// 2. Input validation
function validateInput(input: string): boolean {
  // Whitelist approach
  const allowedPattern = /^[a-zA-Z0-9\s.,!?-]+$/;
  return allowedPattern.test(input);
}

function CommentForm() {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput(comment)) {
      setError('Invalid characters in comment');
      return;
    }

    // Submit comment
    submitComment(comment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}

// 3. Output encoding
function encodeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// 4. HTTPOnly cookies
// Set in server response
res.setHeader('Set-Cookie', [
  'sessionId=abc123; HttpOnly; Secure; SameSite=Strict'
]);
```

---

## Cross-Site Request Forgery (CSRF)

### What is CSRF?

**Definition:** CSRF tricks users into executing unwanted actions on a web application where they're authenticated.

### CSRF Attack Example

```typescript
// Victim is logged into bank.com
// Attacker creates malicious page:

// ❌ Vulnerable: No CSRF protection
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="10000" />
</form>
<script>
  document.forms[0].submit();
</script>

// When victim visits attacker's page, form auto-submits
// using victim's session cookies
```

### CSRF Prevention

```typescript
// 1. CSRF Tokens (Synchronizer Token Pattern)
// Server-side (Next.js API route)
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get('csrf_token');
  const sessionToken = request.headers.get('x-csrf-token');

  if (!token || token !== sessionToken) {
    return new Response('Invalid CSRF token', { status: 403 });
  }

  // Process request
  return new Response('Success');
}

// Client-side
function TransferForm() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Fetch CSRF token from server
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append('csrf_token', csrfToken);

    await fetch('/api/transfer', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      <input name="to" placeholder="Recipient" />
      <input name="amount" type="number" placeholder="Amount" />
      <button type="submit">Transfer</button>
    </form>
  );
}

// 2. SameSite Cookies
// Server-side
res.setHeader('Set-Cookie', [
  'sessionId=abc123; SameSite=Strict; Secure; HttpOnly'
]);

// SameSite values:
// - Strict: Cookie only sent for same-site requests
// - Lax: Cookie sent for top-level navigation
// - None: Cookie sent for all requests (requires Secure)

// 3. Double Submit Cookie Pattern
function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

// Set cookie and require same value in request
res.setHeader('Set-Cookie', [
  `csrf_token=${generateCSRFToken()}; SameSite=Strict`
]);

// 4. Custom Request Headers
// AJAX requests with custom headers
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Custom header
  },
  body: JSON.stringify({ to: 'recipient', amount: 100 })
});

// Server validates custom header exists
if (!request.headers.get('X-Requested-With')) {
  return new Response('Forbidden', { status: 403 });
}
```

---

## SQL Injection

### What is SQL Injection?

**Definition:** SQL injection allows attackers to interfere with database queries.

### SQL Injection Examples

```typescript
// ❌ Vulnerable: String concatenation
async function getUser(username: string) {
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  return db.query(query);
}

// Attack:
// username = "admin' OR '1'='1"
// Query becomes: SELECT * FROM users WHERE username = 'admin' OR '1'='1'
// Returns all users!

// ✅ Safe: Parameterized queries
async function getUser(username: string) {
  const query = 'SELECT * FROM users WHERE username = ?';
  return db.query(query, [username]);
}

// ✅ Safe: ORM (Prisma example)
async function getUser(username: string) {
  return prisma.user.findUnique({
    where: { username }
  });
}

// More attack examples:
// 1. Union-based injection
// username = "admin' UNION SELECT password FROM users--"

// 2. Blind SQL injection
// username = "admin' AND SLEEP(5)--"

// 3. Second-order injection
// Store malicious data, executed later
```

### SQL Injection Prevention

```typescript
// 1. Use ORMs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function searchUsers(query: string) {
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { email: { contains: query } }
      ]
    }
  });
}

// 2. Prepared statements
import { Pool } from 'pg';

const pool = new Pool();

async function getUser(id: number) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

// 3. Input validation
function validateUserId(id: string): number {
  const numId = parseInt(id, 10);
  if (isNaN(numId) || numId < 1) {
    throw new Error('Invalid user ID');
  }
  return numId;
}

// 4. Least privilege principle
// Database user should have minimal permissions
// CREATE USER app_user WITH PASSWORD 'password';
// GRANT SELECT, INSERT, UPDATE ON users TO app_user;
// REVOKE DELETE ON users FROM app_user;

// 5. Escape special characters (last resort)
function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}
```

---

## Broken Authentication

### Common Issues

```typescript
// 1. Weak password requirements
// ❌ Weak
function validatePassword(password: string): boolean {
  return password.length >= 6;
}

// ✅ Strong
function validatePassword(password: string): boolean {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
}

// 2. Insecure password storage
// ❌ Plain text
await db.user.create({
  data: {
    username,
    password // NEVER store plain text!
  }
});

// ❌ Simple hashing (MD5, SHA1)
import crypto from 'crypto';
const hash = crypto.createHash('md5').update(password).digest('hex');

// ✅ Proper hashing with salt (bcrypt)
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 3. Session management
// ❌ Predictable session IDs
const sessionId = `${userId}_${Date.now()}`;

// ✅ Cryptographically random
import { randomBytes } from 'crypto';

function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}

// 4. No rate limiting
// ❌ Unlimited login attempts
async function login(username: string, password: string) {
  const user = await getUser(username);
  if (user && await verifyPassword(password, user.password)) {
    return createSession(user);
  }
  throw new Error('Invalid credentials');
}

// ✅ Rate limiting
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // Login logic
});

// 5. Account enumeration
// ❌ Different messages
if (!user) {
  return 'Username not found';
}
if (!await verifyPassword(password, user.password)) {
  return 'Incorrect password';
}

// ✅ Generic message
if (!user || !await verifyPassword(password, user.password)) {
  return 'Invalid username or password';
}
```

---

## Sensitive Data Exposure

### Common Issues

```typescript
// 1. Exposing sensitive data in API responses
// ❌ Returning full user object
async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id }
  });
  // Returns: { id, email, password, ssn, creditCard, ... }
}

// ✅ Select only needed fields
async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true
      // Exclude sensitive fields
    }
  });
}

// 2. Logging sensitive data
// ❌ Logging passwords
console.log('Login attempt:', { username, password });

// ✅ Redact sensitive data
console.log('Login attempt:', { username, password: '[REDACTED]' });

// 3. Storing sensitive data in localStorage
// ❌ Storing tokens in localStorage (XSS vulnerable)
localStorage.setItem('authToken', token);

// ✅ Use httpOnly cookies
res.setHeader('Set-Cookie', [
  `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
]);

// 4. Transmitting data over HTTP
// ❌ HTTP
fetch('http://api.example.com/user');

// ✅ HTTPS
fetch('https://api.example.com/user');

// 5. Weak encryption
// ❌ Weak algorithm
import crypto from 'crypto';
const cipher = crypto.createCipher('des', 'password');

// ✅ Strong encryption
const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

## Broken Access Control

### Common Issues

```typescript
// 1. Insecure Direct Object References (IDOR)
// ❌ No authorization check
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const document = await prisma.document.findUnique({
    where: { id: params.id }
  });
  return Response.json(document);
}

// Attack: User can access any document by changing ID
// GET /api/documents/123
// GET /api/documents/456 (not their document!)

// ✅ Verify ownership
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  
  const document = await prisma.document.findFirst({
    where: {
      id: params.id,
      userId: session.userId // Verify ownership
    }
  });

  if (!document) {
    return new Response('Not found', { status: 404 });
  }

  return Response.json(document);
}

// 2. Missing function level access control
// ❌ No role check
export async function DELETE(request: Request) {
  const { userId } = await request.json();
  await prisma.user.delete({ where: { id: userId } });
  return Response.json({ success: true });
}

// ✅ Check user role
export async function DELETE(request: Request) {
  const session = await getSession(request);
  
  if (session.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }

  const { userId } = await request.json();
  await prisma.user.delete({ where: { id: userId } });
  return Response.json({ success: true });
}

// 3. Client-side access control
// ❌ Hiding UI elements only
function AdminPanel() {
  const { user } = useAuth();
  
  if (user.role !== 'admin') {
    return null; // Hidden but API still accessible!
  }
  
  return <AdminControls />;
}

// ✅ Server-side enforcement
export async function POST(request: Request) {
  const session = await getSession(request);
  
  // Always check on server
  if (session.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Process admin action
}
```

---

## Security Best Practices

### Security Checklist

```typescript
// 1. Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// 2. Output encoding
import DOMPurify from 'dompurify';

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
}

// 3. Authentication
// - Use strong password hashing (bcrypt, argon2)
// - Implement MFA
// - Use secure session management
// - Implement rate limiting

// 4. Authorization
// - Verify user permissions on every request
// - Use principle of least privilege
// - Implement role-based access control

// 5. Data protection
// - Encrypt sensitive data at rest
// - Use HTTPS for data in transit
// - Use httpOnly, secure cookies
// - Implement CSP headers

// 6. Error handling
// ❌ Exposing stack traces
try {
  await riskyOperation();
} catch (error) {
  res.status(500).json({ error: error.stack });
}

// ✅ Generic error messages
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({ error: 'Internal server error' });
}

// 7. Dependency management
// - Keep dependencies updated
// - Use npm audit / yarn audit
// - Use Snyk or similar tools
// - Review security advisories
```

---

## Interview Questions

### Q1: What's the difference between XSS and CSRF?

**Answer:**
- **XSS**: Injects malicious scripts into trusted websites, executes in victim's browser
- **CSRF**: Tricks victim into executing unwanted actions on a site where they're authenticated

### Q2: How do you prevent SQL injection?

**Answer:**
1. Use parameterized queries/prepared statements
2. Use ORMs (Prisma, TypeORM)
3. Input validation
4. Least privilege database access
5. Never concatenate user input into queries

### Q3: What are httpOnly cookies and why use them?

**Answer:**
httpOnly cookies cannot be accessed by JavaScript, preventing XSS attacks from stealing session tokens. Always use with Secure and SameSite flags.

### Q4: How do you implement CSRF protection?

**Answer:**
1. CSRF tokens (synchronizer token pattern)
2. SameSite cookies
3. Double submit cookie pattern
4. Custom request headers
5. Verify origin/referer headers

---

## Summary

- Always validate and sanitize user input
- Use parameterized queries to prevent SQL injection
- Implement CSRF tokens for state-changing operations
- Use httpOnly, Secure, SameSite cookies
- Enforce authorization on server-side
- Keep dependencies updated
- Follow principle of least privilege

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Authentication & Authorization →](./02-auth-authorization.md)
