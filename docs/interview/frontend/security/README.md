# Security Interview Preparation

## Core Concepts

### Frontend Security Fundamentals

- **Cross-Site Scripting (XSS)**: Malicious scripts injected into web pages
- **Cross-Site Request Forgery (CSRF)**: Unauthorized actions performed on behalf of users
- **Content Security Policy (CSP)**: Security headers to prevent code injection
- **Same-Origin Policy**: Browser security mechanism for isolating resources
- **Authentication & Authorization**: User identity verification and access control

### Security Headers

- **Content-Security-Policy**: Controls resource loading
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Strict-Transport-Security**: Enforces HTTPS connections
- **Referrer-Policy**: Controls referrer information

## Advanced Topics

### Modern Security Features

- **Subresource Integrity (SRI)**: Verifies external resource integrity
- **Trusted Types**: Prevents DOM-based XSS
- **Feature Policy**: Controls browser feature usage
- **Web Crypto API**: Client-side cryptography
- **Service Worker Security**: Secure offline functionality

### Security Testing

- **Static Analysis**: Code scanning for vulnerabilities
- **Dynamic Analysis**: Runtime security testing
- **Penetration Testing**: Manual security assessment
- **Security Headers Testing**: CSP and header validation
- **Dependency Scanning**: Third-party vulnerability detection

## Common Interview Questions & Answers

### Security Questions

**Q: What is XSS and how do you prevent it?**
A: XSS (Cross-Site Scripting) allows attackers to inject malicious scripts into web pages.

**Types of XSS:**

- **Stored XSS**: Malicious script stored in database
- **Reflected XSS**: Malicious script reflected in response
- **DOM-based XSS**: Malicious script manipulating DOM

**Prevention Techniques:**

```javascript
// 1. Input validation and sanitization
function sanitizeInput(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// 2. Use safe DOM methods
// ❌ Dangerous
element.innerHTML = userInput;

// ✅ Safe
element.textContent = userInput;

// 3. Use React's built-in XSS protection
function SafeComponent({ userInput }) {
  return <div>{userInput}</div>; // React automatically escapes
}

// 4. Content Security Policy
// Add to HTML head
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

**Q: What is CSRF and how do you prevent it?**
A: CSRF (Cross-Site Request Forgery) tricks users into performing unwanted actions.

**Prevention Techniques:**

{% raw %}
```javascript
// 1. CSRF Tokens
class CSRFProtection {
  constructor() {
    this.token = this.generateToken();
  }

  generateToken() {
    return crypto
      .getRandomValues(new Uint8Array(32))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), "");
  }

  addTokenToRequest(request) {
    request.headers["X-CSRF-Token"] = this.token;
    return request;
  }

  validateToken(token) {
    return token === this.token;
  }
}

// 2. SameSite Cookies
document.cookie = "sessionId=abc123; SameSite=Strict; Secure; HttpOnly";

// 3. Double Submit Cookie Pattern
class DoubleSubmitCookie {
  constructor() {
    this.token = this.generateToken();
    this.setCookie();
  }

  setCookie() {
    document.cookie = `csrf-token=${this.token}; SameSite=Strict; Secure`;
  }

  addTokenToForm(form) {
    const tokenInput = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "csrf-token";
    tokenInput.value = this.token;
    form.appendChild(tokenInput);
  }
}

// 4. Custom Headers
fetch("/api/update", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
    "X-Requested-With": "XMLHttpRequest",
  },
  body: JSON.stringify(data),
});
```
{% endraw %}

**Q: How do you implement Content Security Policy?**
A: CSP is a security header that controls which resources can be loaded.

```javascript
// 1. Basic CSP Implementation
const cspHeader = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": ["'self'", "data:", "https:"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "connect-src": ["'self'", "https://api.example.com"],
  "frame-src": ["'none'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

// 2. Dynamic CSP for different pages
class CSPManager {
  constructor() {
    this.basePolicy = {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "style-src": ["'self'"],
      "img-src": ["'self'", "data:"],
      "connect-src": ["'self'"],
    };
  }

  addPolicy(page, additionalRules) {
    const policy = { ...this.basePolicy };

    Object.keys(additionalRules).forEach((key) => {
      if (policy[key]) {
        policy[key] = [...policy[key], ...additionalRules[key]];
      } else {
        policy[key] = additionalRules[key];
      }
    });

    return this.stringifyPolicy(policy);
  }

  stringifyPolicy(policy) {
    return Object.entries(policy)
      .map(([key, values]) => `${key} ${values.join(" ")}`)
      .join("; ");
  }

  // 3. Nonce-based CSP
  generateNonce() {
    return crypto
      .getRandomValues(new Uint8Array(16))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), "");
  }

  addNonceToScript(nonce) {
    const script = document.createElement("script");
    script.nonce = nonce;
    script.textContent = 'console.log("Safe script");';
    document.head.appendChild(script);
  }
}

// 4. Hash-based CSP
class HashCSP {
  constructor() {
    this.hashes = new Set();
  }

  addScriptHash(scriptContent) {
    const hash = this.generateHash(scriptContent);
    this.hashes.add(hash);
    return hash;
  }

  generateHash(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    return crypto.subtle.digest("SHA-256", data).then((hash) => {
      const hashArray = Array.from(new Uint8Array(hash));
      return `'sha256-${btoa(String.fromCharCode(...hashArray))}'`;
    });
  }

  getPolicy() {
    const scriptSrc = ["'self'", ...Array.from(this.hashes)];
    return `script-src ${scriptSrc.join(" ")}`;
  }
}
```

## Advanced Interview Questions

**Q: How would you implement secure authentication in a frontend application?**
A: Comprehensive authentication security implementation:

```javascript
class SecureAuthManager {
  constructor() {
    this.tokenKey = 'auth_token';
    this.refreshTokenKey = 'refresh_token';
    this.tokenExpiryKey = 'token_expiry';
  }

  // 1. Secure token storage
  storeTokens(accessToken, refreshToken, expiresIn) {
    const expiryTime = Date.now() + (expiresIn * 1000);

    // Store in memory for sensitive operations
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    // Store refresh token in httpOnly cookie (server-side)
    this.setHttpOnlyCookie(this.refreshTokenKey, refreshToken);

    // Store expiry time in localStorage
    localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
  }

  // 2. Token validation
  isTokenValid() {
    const expiryTime = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryTime) return false;

    return Date.now() < parseInt(expiryTime);
  }

  // 3. Automatic token refresh
  async refreshTokenIfNeeded() {
    if (!this.isTokenValid() && this.refreshToken) {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.refreshToken}`
          }
        });

        if (response.ok) {
          const { accessToken, expiresIn } = await response.json();
          this.storeTokens(accessToken, this.refreshToken, expiresIn);
          return accessToken;
        } else {
          this.logout();
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        this.logout();
        throw error;
      }
    }

    return this.accessToken;
  }

  // 4. Secure logout
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem(this.tokenExpiryKey);

    // Clear httpOnly cookie
    this.clearHttpOnlyCookie(this.refreshTokenKey);

    // Redirect to login
    window.location.href = '/login';
  }

  // 5. Secure API requests
  async makeSecureRequest(url, options = {}) {
    const token = await this.refreshTokenIfNeeded();

    const secureOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    const response = await fetch(url, secureOptions);

    if (response.status === 401) {
      this.logout();
      throw new Error('Unauthorized');
    }

    return response;
  }

  // 6. Password strength validation
  validatePassword(password) {
    const requirements = {
      minLength: 8,
      hasUpperCase: /[A-Z]/,
      hasLowerCase: /[a-z]/,
      hasNumbers: /\d/,
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
    };

    const errors = [];

    if (password.length < requirements.minLength) {
      errors.push(`Password must be at least ${requirements.minLength} characters`);
    }

    if (!requirements.hasUpperCase.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!requirements.hasLowerCase.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!requirements.hasNumbers.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!requirements.hasSpecialChar.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 7. Rate limiting for login attempts
  constructor() {
    this.loginAttempts = new Map();
    this.maxAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
  }

  checkLoginAttempts(email) {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };

    if (attempts.count >= this.maxAttempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

      if (timeSinceLastAttempt < this.lockoutDuration) {
        const remainingTime = Math.ceil((this.lockoutDuration - timeSinceLastAttempt) / 1000 / 60);
        throw new Error(`Account temporarily locked. Try again in ${remainingTime} minutes.`);
      } else {
        // Reset attempts after lockout period
        this.loginAttempts.delete(email);
      }
    }
  }

  recordLoginAttempt(email, success) {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };

    if (success) {
      this.loginAttempts.delete(email);
    } else {
      attempts.count++;
      attempts.lastAttempt = Date.now();
      this.loginAttempts.set(email, attempts);
    }
  }
}
```

**Q: How do you implement secure file uploads?**
A: Secure file upload implementation with validation and scanning:

```javascript
class SecureFileUpload {
  constructor() {
    this.allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.maxFiles = 10;
  }

  // 1. File type validation
  validateFileType(file) {
    // Check MIME type
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error("File type not allowed");
    }

    // Check file extension
    const extension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "pdf"];

    if (!allowedExtensions.includes(extension)) {
      throw new Error("File extension not allowed");
    }

    // Check file signature (magic numbers)
    return this.checkFileSignature(file);
  }

  // 2. File signature validation
  async checkFileSignature(file) {
    const signatures = {
      "image/jpeg": [0xff, 0xd8, 0xff],
      "image/png": [0x89, 0x50, 0x4e, 0x47],
      "image/gif": [0x47, 0x49, 0x46],
      "application/pdf": [0x25, 0x50, 0x44, 0x46],
    };

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const expectedSignature = signatures[file.type];

    if (expectedSignature) {
      for (let i = 0; i < expectedSignature.length; i++) {
        if (bytes[i] !== expectedSignature[i]) {
          throw new Error("Invalid file signature");
        }
      }
    }

    return true;
  }

  // 3. File size validation
  validateFileSize(file) {
    if (file.size > this.maxFileSize) {
      throw new Error(
        `File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`
      );
    }
    return true;
  }

  // 4. Image processing and sanitization
  async processImage(file) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Resize image if too large
        const maxWidth = 1920;
        const maxHeight = 1080;

        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image to canvas (removes any embedded scripts)
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(resolve, "image/jpeg", 0.8);
      };

      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = URL.createObjectURL(file);
    });
  }

  // 5. Secure upload with progress
  async uploadFile(file, onProgress) {
    try {
      // Validate file
      this.validateFileType(file);
      this.validateFileSize(file);

      // Process file if it's an image
      let processedFile = file;
      if (file.type.startsWith("image/")) {
        processedFile = await this.processImage(file);
      }

      // Generate secure filename
      const secureFilename = this.generateSecureFilename(file.name);

      // Create FormData
      const formData = new FormData();
      formData.append("file", processedFile, secureFilename);
      formData.append("timestamp", Date.now().toString());

      // Upload with progress
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress?.(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
      });
    } catch (error) {
      throw error;
    }
  }

  // 6. Generate secure filename
  generateSecureFilename(originalName) {
    const extension = originalName.split(".").pop();
    const timestamp = Date.now();
    const randomString = crypto
      .getRandomValues(new Uint8Array(8))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), "");

    return `${timestamp}_${randomString}.${extension}`;
  }

  // 7. Multiple file upload with validation
  async uploadMultipleFiles(files, onProgress) {
    const validFiles = [];
    const errors = [];

    // Validate all files first
    for (let i = 0; i < files.length; i++) {
      try {
        this.validateFileType(files[i]);
        this.validateFileSize(files[i]);
        validFiles.push(files[i]);
      } catch (error) {
        errors.push({ file: files[i].name, error: error.message });
      }
    }

    if (validFiles.length === 0) {
      throw new Error("No valid files to upload");
    }

    // Upload valid files
    const uploadPromises = validFiles.map((file, index) => {
      return this.uploadFile(file, (progress) => {
        onProgress?.(index, progress);
      });
    });

    const results = await Promise.allSettled(uploadPromises);

    return {
      successful: results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value),
      failed: results
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason),
      validationErrors: errors,
    };
  }
}
```

## Practical Problems & Solutions

### Problem 1: Implement Secure Session Management

**Challenge**: Create a secure session management system with automatic cleanup and security features.

```javascript
class SecureSessionManager {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.maxSessionsPerUser = 5;
    this.cleanupInterval = 5 * 60 * 1000; // 5 minutes

    this.startCleanupTimer();
  }

  createSession(userId, userAgent, ipAddress) {
    // Check existing sessions for user
    const userSessions = this.getUserSessions(userId);

    if (userSessions.length >= this.maxSessionsPerUser) {
      // Remove oldest session
      const oldestSession = userSessions.sort(
        (a, b) => a.createdAt - b.createdAt
      )[0];
      this.removeSession(oldestSession.id);
    }

    const session = {
      id: this.generateSessionId(),
      userId,
      userAgent,
      ipAddress,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      isActive: true,
    };

    this.sessions.set(session.id, session);
    return session;
  }

  validateSession(sessionId, userAgent, ipAddress) {
    const session = this.sessions.get(sessionId);

    if (!session || !session.isActive) {
      return false;
    }

    // Check session timeout
    if (Date.now() - session.lastActivity > this.sessionTimeout) {
      this.removeSession(sessionId);
      return false;
    }

    // Check for suspicious activity
    if (session.userAgent !== userAgent || session.ipAddress !== ipAddress) {
      this.flagSuspiciousActivity(session);
      return false;
    }

    // Update last activity
    session.lastActivity = Date.now();
    return true;
  }

  removeSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  getUserSessions(userId) {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  generateSessionId() {
    return crypto
      .getRandomValues(new Uint8Array(32))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), "");
  }

  flagSuspiciousActivity(session) {
    session.isActive = false;
    // Log suspicious activity
    console.warn("Suspicious session activity detected:", session);
  }

  startCleanupTimer() {
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, this.cleanupInterval);
  }

  cleanupExpiredSessions() {
    const now = Date.now();

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.sessionTimeout) {
        this.removeSession(sessionId);
      }
    }
  }

  getSessionStats() {
    const totalSessions = this.sessions.size;
    const activeSessions = Array.from(this.sessions.values()).filter(
      (session) => session.isActive
    ).length;

    return {
      total: totalSessions,
      active: activeSessions,
      expired: totalSessions - activeSessions,
    };
  }
}
```

### Problem 2: Implement Secure Data Encryption

**Challenge**: Create a client-side encryption system for sensitive data.

```javascript
class SecureDataEncryption {
  constructor() {
    this.algorithm = "AES-GCM";
    this.keyLength = 256;
  }

  async generateKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(data, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await this.generateKey(password, salt);
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      encodedData
    );

    return {
      data: Array.from(new Uint8Array(encryptedData)),
      salt: Array.from(salt),
      iv: Array.from(iv),
    };
  }

  async decrypt(encryptedData, password) {
    const key = await this.generateKey(password, encryptedData.salt);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: new Uint8Array(encryptedData.iv),
      },
      key,
      new Uint8Array(encryptedData.data)
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedData));
  }

  // Secure storage with encryption
  async secureStore(key, data, password) {
    const encrypted = await this.encrypt(data, password);
    localStorage.setItem(key, JSON.stringify(encrypted));
  }

  async secureRetrieve(key, password) {
    const encrypted = JSON.parse(localStorage.getItem(key));
    if (!encrypted) return null;

    return await this.decrypt(encrypted, password);
  }

  // Secure communication
  async encryptForTransmission(data, publicKey) {
    // Generate a random AES key for data encryption
    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    // Encrypt data with AES key
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      encodedData
    );

    // Export AES key and encrypt it with public key
    const exportedAesKey = await crypto.subtle.exportKey("raw", aesKey);

    const encryptedKey = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      exportedAesKey
    );

    return {
      encryptedData: Array.from(new Uint8Array(encryptedData)),
      encryptedKey: Array.from(new Uint8Array(encryptedKey)),
      iv: Array.from(iv),
    };
  }
}
```

## Security Best Practices

### Input Validation

```javascript
class InputValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePassword(password) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
  }

  static sanitizeHTML(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  static validateURL(url) {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}
```

### Security Headers Implementation

```javascript
// Security headers middleware (server-side)
const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

// Client-side security checks
class SecurityChecker {
  static checkSecurityHeaders() {
    const requiredHeaders = [
      "content-security-policy",
      "x-frame-options",
      "x-content-type-options",
    ];

    const missingHeaders = [];

    requiredHeaders.forEach((header) => {
      if (!document.head.querySelector(`meta[http-equiv="${header}"]`)) {
        missingHeaders.push(header);
      }
    });

    if (missingHeaders.length > 0) {
      console.warn("Missing security headers:", missingHeaders);
    }
  }

  static checkHTTPS() {
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      console.error("Application should be served over HTTPS");
    }
  }
}
```

## Resources

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

### Tools

- [OWASP ZAP](https://owasp.org/www-project-zap/) - Security testing
- [Security Headers](https://securityheaders.com/) - Header analysis
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/) - CSP validation
- [Snyk](https://snyk.io/) - Vulnerability scanning

### Practice Platforms

- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) - Security training
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackerOne](https://hackerone.com/) - Bug bounty programs

---

_This guide covers essential security concepts for frontend interviews, including practical problems and advanced techniques commonly asked at Big Tech companies._
