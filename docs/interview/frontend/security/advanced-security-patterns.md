# Advanced Frontend Security Patterns

## Overview
Modern frontend applications face sophisticated security threats. Big Tech companies expect deep understanding of security patterns, threat modeling, and defensive programming techniques.

---

## Advanced XSS Prevention Patterns

### **Content Security Policy (CSP) Implementation**

{% raw %}
```typescript
// csp-manager.ts
interface CSPDirective {
  [key: string]: string[] | string;
}

interface CSPReport {
  'csp-report': {
    'document-uri': string;
    'violated-directive': string;
    'blocked-uri': string;
    'source-file': string;
    'line-number': number;
    'column-number': number;
  };
}

class CSPManager {
  private directives: CSPDirective = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  };

  private nonces: Map<string, string> = new Map();
  private allowedDomains: Set<string> = new Set();

  // Generate cryptographically secure nonce
  generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const nonce = btoa(String.fromCharCode(...array));
    
    // Store nonce for validation
    this.nonces.set(nonce, new Date().toISOString());
    
    // Clean up old nonces (older than 1 hour)
    this.cleanupOldNonces();
    
    return nonce;
  }

  // Add script with nonce
  addScriptWithNonce(scriptContent: string, nonce?: string): HTMLScriptElement {
    const script = document.createElement('script');
    const scriptNonce = nonce || this.generateNonce();
    
    script.nonce = scriptNonce;
    script.textContent = scriptContent;
    
    // Validate nonce before execution
    if (this.validateNonce(scriptNonce)) {
      document.head.appendChild(script);
    } else {
      console.error('Invalid nonce, script execution blocked');
      throw new Error('CSP violation: Invalid nonce');
    }
    
    return script;
  }

  // Dynamic CSP policy adjustment
  adjustPolicyForThirdParty(domain: string, directives: string[]): void {
    if (!this.isAllowedDomain(domain)) {
      console.warn(`Attempting to add untrusted domain: ${domain}`);
      return;
    }

    directives.forEach(directive => {
      if (!this.directives[directive]) {
        this.directives[directive] = [];
      }
      
      if (Array.isArray(this.directives[directive])) {
        (this.directives[directive] as string[]).push(domain);
      }
    });

    this.updateCSPHeader();
  }

  // Strict CSP for high-security environments
  enableStrictCSP(): void {
    this.directives = {
      'default-src': ["'none'"],
      'script-src': ["'strict-dynamic'"],
      'style-src': ["'self'"],
      'img-src': ["'self'"],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'none'"],
      'require-trusted-types-for': ["'script'"],
      'trusted-types': ['default']
    };

    this.updateCSPHeader();
  }

  // CSP violation reporting
  setupViolationReporting(): void {
    // Set up reporting endpoint
    this.directives['report-uri'] = '/api/csp-violations';
    this.directives['report-to'] = 'csp-endpoint';

    // Handle CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation(event);
    });

    // Set up Reporting API endpoint
    if ('ReportingObserver' in window) {
      const observer = new ReportingObserver((reports) => {
        reports.forEach(report => {
          if (report.type === 'csp-violation') {
            this.logCSPViolation(report.body);
          }
        });
      });
      
      observer.observe();
    }
  }

  private validateNonce(nonce: string): boolean {
    return this.nonces.has(nonce);
  }

  private cleanupOldNonces(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [nonce, timestamp] of this.nonces.entries()) {
      if (new Date(timestamp) < oneHourAgo) {
        this.nonces.delete(nonce);
      }
    }
  }

  private isAllowedDomain(domain: string): boolean {
    // Implement domain validation logic
    const allowedPatterns = [
      /^https:\/\/.*\.googleapis\.com$/,
      /^https:\/\/.*\.gstatic\.com$/,
      /^https:\/\/cdnjs\.cloudflare\.com$/
    ];

    return allowedPatterns.some(pattern => pattern.test(domain));
  }

  private handleCSPViolation(event: SecurityPolicyViolationEvent): void {
    const violation = {
      documentURI: event.documentURI,
      violatedDirective: event.violatedDirective,
      blockedURI: event.blockedURI,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      columnNumber: event.columnNumber,
      originalPolicy: event.originalPolicy,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Send to security monitoring system
    this.reportViolation(violation);
    
    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('CSP Violation:', violation);
    }
  }

  private async reportViolation(violation: any): Promise<void> {
    try {
      await fetch('/api/security/csp-violations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(violation)
      });
    } catch (error) {
      console.error('Failed to report CSP violation:', error);
    }
  }

  private updateCSPHeader(): void {
    const policy = Object.entries(this.directives)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key} ${value.join(' ')}`;
        }
        return key;
      })
      .join('; ');

    // Update meta tag (fallback)
    let metaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.httpEquiv = 'Content-Security-Policy';
      document.head.appendChild(metaTag);
    }
    metaTag.content = policy;
  }

  generateCSPHeader(): string {
    return Object.entries(this.directives)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key} ${value.join(' ')}`;
        }
        return key;
      })
      .join('; ');
  }
}
```
{% endraw %}

### **Trusted Types Implementation**

```typescript
// trusted-types.ts
interface TrustedTypesPolicy {
  createHTML(input: string): TrustedHTML;
  createScript(input: string): TrustedScript;
  createScriptURL(input: string): TrustedScriptURL;
}

class TrustedTypesManager {
  private policies: Map<string, TrustedTypesPolicy> = new Map();
  private sanitizer: HTMLSanitizer;

  constructor() {
    this.initializeTrustedTypes();
    this.setupHTMLSanitizer();
  }

  private initializeTrustedTypes(): void {
    if ('trustedTypes' in window) {
      // Create default policy for backward compatibility
      const defaultPolicy = trustedTypes.createPolicy('default', {
        createHTML: (input: string) => {
          return this.sanitizeHTML(input);
        },
        createScript: (input: string) => {
          return this.sanitizeScript(input);
        },
        createScriptURL: (input: string) => {
          return this.sanitizeScriptURL(input);
        }
      });

      // Create strict policy for sensitive operations
      const strictPolicy = trustedTypes.createPolicy('strict', {
        createHTML: (input: string) => {
          // Only allow very limited HTML
          return this.strictSanitizeHTML(input);
        },
        createScript: (input: string) => {
          // Block all dynamic script creation
          throw new Error('Dynamic script creation not allowed in strict mode');
        },
        createScriptURL: (input: string) => {
          // Only allow same-origin scripts
          if (!this.isSameOrigin(input)) {
            throw new Error('Cross-origin scripts not allowed in strict mode');
          }
          return input;
        }
      });

      this.policies.set('default', defaultPolicy);
      this.policies.set('strict', strictPolicy);
    }
  }

  private setupHTMLSanitizer(): void {
    // Use the new Sanitizer API when available
    if ('Sanitizer' in window) {
      this.sanitizer = new Sanitizer({
        allowElements: [
          'div', 'span', 'p', 'br', 'strong', 'em', 'u', 'i', 'b',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li',
          'a', 'img'
        ],
        allowAttributes: {
          'a': ['href', 'title'],
          'img': ['src', 'alt', 'title', 'width', 'height'],
          '*': ['class', 'id']
        },
        allowCustomElements: false
      });
    }
  }

  // Safe HTML creation with sanitization
  createSafeHTML(input: string, policyName = 'default'): TrustedHTML {
    const policy = this.policies.get(policyName);
    if (!policy) {
      throw new Error(`Unknown policy: ${policyName}`);
    }

    return policy.createHTML(input);
  }

  // Safe script creation with validation
  createSafeScript(input: string, policyName = 'default'): TrustedScript {
    const policy = this.policies.get(policyName);
    if (!policy) {
      throw new Error(`Unknown policy: ${policyName}`);
    }

    // Additional validation
    if (this.containsSuspiciousPatterns(input)) {
      throw new Error('Script contains suspicious patterns');
    }

    return policy.createScript(input);
  }

  // Safe script URL creation
  createSafeScriptURL(input: string, policyName = 'default'): TrustedScriptURL {
    const policy = this.policies.get(policyName);
    if (!policy) {
      throw new Error(`Unknown policy: ${policyName}`);
    }

    return policy.createScriptURL(input);
  }

  // Advanced HTML sanitization
  private sanitizeHTML(input: string): string {
    if (this.sanitizer) {
      // Use native Sanitizer API
      const fragment = this.sanitizer.sanitizeFor('div', input);
      return fragment.innerHTML;
    }

    // Fallback to DOMPurify-like sanitization
    return this.fallbackSanitize(input);
  }

  private strictSanitizeHTML(input: string): string {
    // Only allow plain text and basic formatting
    const allowedTags = ['strong', 'em', 'br'];
    const doc = new DOMParser().parseFromString(input, 'text/html');
    
    this.removeDisallowedElements(doc.body, allowedTags);
    return doc.body.innerHTML;
  }

  private sanitizeScript(input: string): string {
    // Validate script content
    if (this.containsMaliciousPatterns(input)) {
      throw new Error('Script contains malicious patterns');
    }

    // Remove dangerous functions
    const dangerousFunctions = [
      'eval', 'Function', 'setTimeout', 'setInterval',
      'document.write', 'document.writeln'
    ];

    let sanitized = input;
    dangerousFunctions.forEach(func => {
      const regex = new RegExp(`\\b${func}\\s*\\(`, 'gi');
      if (regex.test(sanitized)) {
        throw new Error(`Dangerous function detected: ${func}`);
      }
    });

    return sanitized;
  }

  private sanitizeScriptURL(input: string): string {
    try {
      const url = new URL(input);
      
      // Only allow HTTPS and same-origin
      if (url.protocol !== 'https:' && !this.isSameOrigin(input)) {
        throw new Error('Only HTTPS and same-origin URLs allowed');
      }

      // Check against allowlist
      if (!this.isAllowedScriptSource(url.hostname)) {
        throw new Error(`Script source not allowed: ${url.hostname}`);
      }

      return input;
    } catch (error) {
      throw new Error(`Invalid script URL: ${input}`);
    }
  }

  private containsSuspiciousPatterns(script: string): boolean {
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /onload\s*=/i,
      /onerror\s*=/i,
      /onclick\s*=/i,
      /<script/i,
      /<iframe/i,
      /document\.cookie/i,
      /localStorage/i,
      /sessionStorage/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(script));
  }

  private containsMaliciousPatterns(script: string): boolean {
    const maliciousPatterns = [
      /eval\s*\(/i,
      /Function\s*\(/i,
      /document\.write/i,
      /innerHTML\s*=/i,
      /outerHTML\s*=/i,
      /insertAdjacentHTML/i,
      /location\s*=/i,
      /window\.open/i
    ];

    return maliciousPatterns.some(pattern => pattern.test(script));
  }

  private isSameOrigin(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  private isAllowedScriptSource(hostname: string): boolean {
    const allowedHosts = [
      'cdnjs.cloudflare.com',
      'unpkg.com',
      'cdn.jsdelivr.net',
      'ajax.googleapis.com'
    ];

    return allowedHosts.includes(hostname) || hostname === window.location.hostname;
  }

  private removeDisallowedElements(element: Element, allowedTags: string[]): void {
    const children = Array.from(element.children);
    
    children.forEach(child => {
      if (!allowedTags.includes(child.tagName.toLowerCase())) {
        // Replace with text content
        const textNode = document.createTextNode(child.textContent || '');
        child.parentNode?.replaceChild(textNode, child);
      } else {
        // Recursively clean child elements
        this.removeDisallowedElements(child, allowedTags);
      }
    });
  }

  private fallbackSanitize(input: string): string {
    // Basic sanitization without external library
    const div = document.createElement('div');
    div.textContent = input;
    
    // Allow basic HTML tags
    let sanitized = div.innerHTML;
    
    // Remove script tags and event handlers
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    return sanitized;
  }
}
```

---

## Advanced Authentication & Authorization

### **JWT Security Implementation**

```typescript
// jwt-security.ts
interface JWTHeader {
  alg: string;
  typ: string;
  kid?: string;
}

interface JWTPayload {
  sub: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  scope?: string[];
  permissions?: string[];
}

interface SecurityConfig {
  allowedAlgorithms: string[];
  maxTokenAge: number;
  clockSkew: number;
  issuerWhitelist: string[];
  audienceWhitelist: string[];
}

class JWTSecurityManager {
  private config: SecurityConfig = {
    allowedAlgorithms: ['RS256', 'ES256'],
    maxTokenAge: 3600, // 1 hour
    clockSkew: 300, // 5 minutes
    issuerWhitelist: ['https://auth.company.com', 'https://auth.staging.company.com'],
    audienceWhitelist: ['https://app.company.com', 'https://api.company.com']
  };

  private publicKeys: Map<string, CryptoKey> = new Map();
  private tokenBlacklist: Set<string> = new Set();
  private rateLimiter: Map<string, number[]> = new Map();

  async validateToken(token: string): Promise<JWTPayload> {
    try {
      // 1. Parse token structure
      const { header, payload, signature } = this.parseJWT(token);

      // 2. Validate header
      this.validateHeader(header);

      // 3. Check token blacklist
      if (this.isTokenBlacklisted(token)) {
        throw new Error('Token is blacklisted');
      }

      // 4. Validate payload
      this.validatePayload(payload);

      // 5. Verify signature
      await this.verifySignature(token, header, payload);

      // 6. Check rate limiting
      this.checkRateLimit(payload.sub);

      return payload;
    } catch (error) {
      this.logSecurityEvent('JWT_VALIDATION_FAILED', { 
        error: error.message, 
        token: this.hashToken(token) 
      });
      throw error;
    }
  }

  private parseJWT(token: string): { header: JWTHeader; payload: JWTPayload; signature: string } {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    try {
      const header = JSON.parse(this.base64UrlDecode(parts[0]));
      const payload = JSON.parse(this.base64UrlDecode(parts[1]));
      const signature = parts[2];

      return { header, payload, signature };
    } catch (error) {
      throw new Error('Invalid JWT encoding');
    }
  }

  private validateHeader(header: JWTHeader): void {
    // Check algorithm
    if (!this.config.allowedAlgorithms.includes(header.alg)) {
      throw new Error(`Algorithm not allowed: ${header.alg}`);
    }

    // Ensure typ is JWT
    if (header.typ && header.typ !== 'JWT') {
      throw new Error(`Invalid token type: ${header.typ}`);
    }

    // Check for algorithm confusion attacks
    if (header.alg === 'none') {
      throw new Error('Algorithm "none" not allowed');
    }
  }

  private validatePayload(payload: JWTPayload): void {
    const now = Math.floor(Date.now() / 1000);

    // Check expiration
    if (!payload.exp || payload.exp < now - this.config.clockSkew) {
      throw new Error('Token expired');
    }

    // Check not before
    if (payload.iat && payload.iat > now + this.config.clockSkew) {
      throw new Error('Token not yet valid');
    }

    // Check max age
    if (payload.iat && (now - payload.iat) > this.config.maxTokenAge) {
      throw new Error('Token too old');
    }

    // Validate issuer
    if (!payload.iss || !this.config.issuerWhitelist.includes(payload.iss)) {
      throw new Error(`Invalid issuer: ${payload.iss}`);
    }

    // Validate audience
    if (!payload.aud || !this.config.audienceWhitelist.includes(payload.aud)) {
      throw new Error(`Invalid audience: ${payload.aud}`);
    }

    // Check required claims
    if (!payload.sub) {
      throw new Error('Missing subject claim');
    }
  }

  private async verifySignature(token: string, header: JWTHeader, payload: JWTPayload): Promise<void> {
    const parts = token.split('.');
    const signedData = `${parts[0]}.${parts[1]}`;
    const signature = this.base64UrlDecodeToUint8Array(parts[2]);

    // Get public key
    const publicKey = await this.getPublicKey(header.kid || 'default', payload.iss);

    // Verify signature
    const algorithm = this.getWebCryptoAlgorithm(header.alg);
    const encoder = new TextEncoder();
    const data = encoder.encode(signedData);

    const isValid = await crypto.subtle.verify(
      algorithm,
      publicKey,
      signature,
      data
    );

    if (!isValid) {
      throw new Error('Invalid signature');
    }
  }

  private async getPublicKey(keyId: string, issuer: string): Promise<CryptoKey> {
    const cacheKey = `${issuer}:${keyId}`;
    
    // Check cache first
    if (this.publicKeys.has(cacheKey)) {
      return this.publicKeys.get(cacheKey)!;
    }

    // Fetch from JWKS endpoint
    const jwksUrl = `${issuer}/.well-known/jwks.json`;
    const response = await fetch(jwksUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS: ${response.status}`);
    }

    const jwks = await response.json();
    const key = jwks.keys.find((k: any) => k.kid === keyId);
    
    if (!key) {
      throw new Error(`Key not found: ${keyId}`);
    }

    // Import public key
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      key,
      this.getWebCryptoAlgorithm(key.alg),
      false,
      ['verify']
    );

    // Cache the key
    this.publicKeys.set(cacheKey, publicKey);
    
    return publicKey;
  }

  private getWebCryptoAlgorithm(alg: string): AlgorithmIdentifier {
    switch (alg) {
      case 'RS256':
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
      case 'ES256':
        return { name: 'ECDSA', hash: 'SHA-256' };
      default:
        throw new Error(`Unsupported algorithm: ${alg}`);
    }
  }

  private checkRateLimit(userId: string): void {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;

    if (!this.rateLimiter.has(userId)) {
      this.rateLimiter.set(userId, []);
    }

    const requests = this.rateLimiter.get(userId)!;
    
    // Remove old requests
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (validRequests.length >= maxRequests) {
      throw new Error('Rate limit exceeded');
    }

    // Add current request
    validRequests.push(now);
    this.rateLimiter.set(userId, validRequests);
  }

  // Token revocation
  revokeToken(token: string): void {
    const tokenHash = this.hashToken(token);
    this.tokenBlacklist.add(tokenHash);
    
    this.logSecurityEvent('TOKEN_REVOKED', { tokenHash });
  }

  private isTokenBlacklisted(token: string): boolean {
    const tokenHash = this.hashToken(token);
    return this.tokenBlacklist.has(tokenHash);
  }

  private hashToken(token: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    
    // Use subtle crypto for consistent hashing
    return crypto.subtle.digest('SHA-256', data).then(hash => {
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
  }

  // Secure token storage
  storeToken(token: string): void {
    // Use secure storage mechanisms
    if (this.isSecureContext()) {
      // Store in secure HTTP-only cookie via API call
      this.storeInSecureCookie(token);
    } else {
      // Fallback to sessionStorage with encryption
      this.storeInSessionStorage(token);
    }
  }

  private isSecureContext(): boolean {
    return window.isSecureContext && window.location.protocol === 'https:';
  }

  private async storeInSecureCookie(token: string): Promise<void> {
    await fetch('/api/auth/store-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include'
    });
  }

  private storeInSessionStorage(token: string): void {
    // Encrypt token before storing
    const encryptedToken = this.encryptToken(token);
    sessionStorage.setItem('auth_token', encryptedToken);
  }

  private encryptToken(token: string): string {
    // Simple XOR encryption (use proper encryption in production)
    const key = this.generateSessionKey();
    const encrypted = token.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
    
    return btoa(encrypted);
  }

  private generateSessionKey(): string {
    return sessionStorage.getItem('session_key') || 
           (() => {
             const key = Math.random().toString(36).substring(2);
             sessionStorage.setItem('session_key', key);
             return key;
           })();
  }

  private base64UrlDecode(str: string): string {
    // Convert base64url to base64
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (str.length % 4) {
      str += '=';
    }
    
    return atob(str);
  }

  private base64UrlDecodeToUint8Array(str: string): Uint8Array {
    const decoded = this.base64UrlDecode(str);
    return new Uint8Array(decoded.split('').map(char => char.charCodeAt(0)));
  }

  private logSecurityEvent(event: string, data: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      userAgent: navigator.userAgent,
      ip: this.getClientIP(),
      sessionId: this.getSessionId()
    };

    // Send to security monitoring system
    fetch('/api/security/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry)
    }).catch(error => {
      console.error('Failed to log security event:', error);
    });
  }

  private getClientIP(): string {
    // This would typically be handled by the server
    return 'unknown';
  }

  private getSessionId(): string {
    return sessionStorage.getItem('session_id') || 'unknown';
  }
}
```

---

## Input Validation & Sanitization

### **Advanced Input Validation Framework**

```typescript
// input-validator.ts
interface ValidationRule {
  type: 'string' | 'number' | 'email' | 'url' | 'date' | 'custom';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  allowedValues?: any[];
  customValidator?: (value: any) => boolean | string;
  sanitizer?: (value: any) => any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

class SecureInputValidator {
  private commonPatterns = {
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    phone: /^\+?[\d\s\-\(\)]+$/,
    url: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/,
    creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/,
    ssn: /^\d{3}-\d{2}-\d{4}$/,
    ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  };

  private dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /data:text\/html/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ];

  validate(input: any, rules: ValidationRule): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: []
    };

    try {
      // Check if required
      if (rules.required && this.isEmpty(input)) {
        result.isValid = false;
        result.errors.push('Field is required');
        return result;
      }

      // Skip validation for empty optional fields
      if (!rules.required && this.isEmpty(input)) {
        result.sanitizedValue = input;
        return result;
      }

      // Sanitize input first
      let sanitizedValue = rules.sanitizer ? rules.sanitizer(input) : input;
      
      // Detect and block malicious patterns
      if (typeof sanitizedValue === 'string' && this.containsMaliciousPatterns(sanitizedValue)) {
        result.isValid = false;
        result.errors.push('Input contains potentially malicious content');
        this.logSecurityThreat('MALICIOUS_INPUT_DETECTED', { input: this.hashSensitiveData(input) });
        return result;
      }

      // Type-specific validation
      const typeValidation = this.validateType(sanitizedValue, rules);
      if (!typeValidation.isValid) {
        result.isValid = false;
        result.errors.push(...typeValidation.errors);
      }

      // Length validation
      if (typeof sanitizedValue === 'string') {
        if (rules.minLength && sanitizedValue.length < rules.minLength) {
          result.isValid = false;
          result.errors.push(`Minimum length is ${rules.minLength}`);
        }
        
        if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
          result.isValid = false;
          result.errors.push(`Maximum length is ${rules.maxLength}`);
        }
      }

      // Numeric range validation
      if (typeof sanitizedValue === 'number') {
        if (rules.min !== undefined && sanitizedValue < rules.min) {
          result.isValid = false;
          result.errors.push(`Minimum value is ${rules.min}`);
        }
        
        if (rules.max !== undefined && sanitizedValue > rules.max) {
          result.isValid = false;
          result.errors.push(`Maximum value is ${rules.max}`);
        }
      }

      // Pattern validation
      if (rules.pattern && typeof sanitizedValue === 'string') {
        if (!rules.pattern.test(sanitizedValue)) {
          result.isValid = false;
          result.errors.push('Input format is invalid');
        }
      }

      // Allowed values validation
      if (rules.allowedValues && !rules.allowedValues.includes(sanitizedValue)) {
        result.isValid = false;
        result.errors.push('Value is not allowed');
      }

      // Custom validation
      if (rules.customValidator) {
        const customResult = rules.customValidator(sanitizedValue);
        if (customResult !== true) {
          result.isValid = false;
          result.errors.push(typeof customResult === 'string' ? customResult : 'Custom validation failed');
        }
      }

      result.sanitizedValue = sanitizedValue;
      return result;

    } catch (error) {
      result.isValid = false;
      result.errors.push('Validation error occurred');
      this.logSecurityThreat('VALIDATION_ERROR', { error: error.message });
      return result;
    }
  }

  // Comprehensive form validation
  validateForm(formData: Record<string, any>, schema: Record<string, ValidationRule>): {
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
  } {
    const errors: Record<string, string[]> = {};
    const sanitizedData: Record<string, any> = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(schema)) {
      const result = this.validate(formData[field], rules);
      
      if (!result.isValid) {
        errors[field] = result.errors;
        isValid = false;
      } else {
        sanitizedData[field] = result.sanitizedValue;
      }
    }

    // Cross-field validation
    const crossFieldErrors = this.validateCrossFields(sanitizedData, schema);
    if (crossFieldErrors.length > 0) {
      errors['_form'] = crossFieldErrors;
      isValid = false;
    }

    return { isValid, errors, sanitizedData };
  }

  private validateType(value: any, rules: ValidationRule): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [] };

    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          result.isValid = false;
          result.errors.push('Must be a string');
        }
        break;

      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue) || !isFinite(numValue)) {
          result.isValid = false;
          result.errors.push('Must be a valid number');
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !this.commonPatterns.email.test(value)) {
          result.isValid = false;
          result.errors.push('Must be a valid email address');
        }
        break;

      case 'url':
        if (typeof value !== 'string' || !this.isValidURL(value)) {
          result.isValid = false;
          result.errors.push('Must be a valid URL');
        }
        break;

      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          result.isValid = false;
          result.errors.push('Must be a valid date');
        }
        break;
    }

    return result;
  }

  private isValidURL(string: string): boolean {
    try {
      const url = new URL(string);
      // Only allow HTTP and HTTPS protocols
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  private containsMaliciousPatterns(input: string): boolean {
    return this.dangerousPatterns.some(pattern => pattern.test(input));
  }

  private isEmpty(value: any): boolean {
    return value === null || value === undefined || 
           (typeof value === 'string' && value.trim() === '') ||
           (Array.isArray(value) && value.length === 0);
  }

  private validateCrossFields(data: Record<string, any>, schema: Record<string, ValidationRule>): string[] {
    const errors: string[] = [];

    // Password confirmation validation
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    // Date range validation
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start >= end) {
        errors.push('End date must be after start date');
      }
    }

    // Business rule validations
    if (data.age && data.age < 18 && data.requiresParentalConsent !== true) {
      errors.push('Parental consent required for users under 18');
    }

    return errors;
  }

  // Advanced sanitization
  sanitizeHTML(input: string): string {
    // Remove script tags and event handlers
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:text\/html/gi, '');

    // Encode special characters
    const div = document.createElement('div');
    div.textContent = sanitized;
    return div.innerHTML;
  }

  sanitizeSQL(input: string): string {
    // Basic SQL injection prevention
    return input
      .replace(/['";\\]/g, '') // Remove dangerous characters
      .replace(/\b(DROP|DELETE|INSERT|UPDATE|EXEC|EXECUTE|UNION|SELECT)\b/gi, '') // Remove SQL keywords
      .trim();
  }

  // Security monitoring
  private logSecurityThreat(threat: string, data: any): void {
    const event = {
      timestamp: new Date().toISOString(),
      threat,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId()
    };

    fetch('/api/security/threats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    }).catch(error => {
      console.error('Failed to log security threat:', error);
    });
  }

  private hashSensitiveData(data: string): string {
    // Hash sensitive data for logging
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(data);
    
    return crypto.subtle.digest('SHA-256', dataArray).then(hash => {
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
  }

  private getSessionId(): string {
    return sessionStorage.getItem('session_id') || 'unknown';
  }
}

// Usage example with React
const useSecureForm = (schema: Record<string, ValidationRule>) => {
  const validator = new SecureInputValidator();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name: string, value: any) => {
    const result = validator.validate(value, schema[name]);
    
    setErrors(prev => ({
      ...prev,
      [name]: result.isValid ? [] : result.errors
    }));

    return result;
  }, [schema, validator]);

  const validateForm = useCallback((formData: Record<string, any>) => {
    const result = validator.validateForm(formData, schema);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result;
  }, [schema, validator]);

  return { validateField, validateForm, errors, isValid };
};
```

This comprehensive security framework provides defense-in-depth protection against common frontend vulnerabilities while maintaining usability and performance. The patterns demonstrated here are essential for building secure applications in enterprise environments.
