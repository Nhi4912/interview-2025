# Security Architecture for Frontend

## Table of Contents
- [Security Fundamentals](#security-fundamentals)
- [Authentication Systems](#authentication-systems)
- [Authorization Patterns](#authorization-patterns)
- [Cryptography in Frontend](#cryptography-in-frontend)
- [Secure Communication](#secure-communication)
- [Input Validation](#input-validation)
- [XSS Prevention](#xss-prevention)
- [CSRF Protection](#csrf-protection)

## Security Fundamentals

### Security Principles

**CIA Triad**:
```
Confidentiality: Data accessible only to authorized parties
Integrity: Data remains accurate and unaltered
Availability: Systems accessible when needed
```

**Defense in Depth**:
```javascript
class SecurityLayer {
  constructor() {
    this.layers = [
      this.networkSecurity,
      this.applicationSecurity,
      this.dataSecurity,
      this.endpointSecurity
    ];
  }

  async validateRequest(request) {
    for (const layer of this.layers) {
      const result = await layer(request);
      if (!result.valid) {
        return {
          valid: false,
          layer: result.layer,
          reason: result.reason
        };
      }
    }
    return { valid: true };
  }

  networkSecurity(request) {
    // Check IP whitelist, rate limiting, etc.
    return { valid: true, layer: 'network' };
  }

  applicationSecurity(request) {
    // Check authentication, authorization
    return { valid: true, layer: 'application' };
  }

  dataSecurity(request) {
    // Validate and sanitize data
    return { valid: true, layer: 'data' };
  }

  endpointSecurity(request) {
    // Check endpoint-specific rules
    return { valid: true, layer: 'endpoint' };
  }
}
```

### Threat Modeling

```javascript
class ThreatModel {
  constructor() {
    this.threats = new Map();
    this.mitigations = new Map();
  }

  addThreat(id, threat) {
    this.threats.set(id, {
      ...threat,
      severity: this.calculateSeverity(threat),
      likelihood: this.calculateLikelihood(threat)
    });
  }

  calculateSeverity(threat) {
    // DREAD model
    const damage = threat.damage || 5;
    const reproducibility = threat.reproducibility || 5;
    const exploitability = threat.exploitability || 5;
    const affectedUsers = threat.affectedUsers || 5;
    const discoverability = threat.discoverability || 5;
    
    return (damage + reproducibility + exploitability + 
            affectedUsers + discoverability) / 5;
  }

  calculateLikelihood(threat) {
    const skill = threat.skillRequired || 5;
    const motive = threat.motive || 5;
    const opportunity = threat.opportunity || 5;
    
    return (skill + motive + opportunity) / 3;
  }

  addMitigation(threatId, mitigation) {
    if (!this.mitigations.has(threatId)) {
      this.mitigations.set(threatId, []);
    }
    this.mitigations.get(threatId).push(mitigation);
  }

  getRiskScore(threatId) {
    const threat = this.threats.get(threatId);
    if (!threat) return 0;
    
    return threat.severity * threat.likelihood;
  }

  getPrioritizedThreats() {
    return Array.from(this.threats.entries())
      .map(([id, threat]) => ({
        id,
        ...threat,
        riskScore: this.getRiskScore(id),
        mitigations: this.mitigations.get(id) || []
      }))
      .sort((a, b) => b.riskScore - a.riskScore);
  }
}

// Usage
const model = new ThreatModel();

model.addThreat('XSS-001', {
  name: 'Stored XSS in comments',
  damage: 8,
  reproducibility: 9,
  exploitability: 7,
  affectedUsers: 9,
  discoverability: 6
});

model.addMitigation('XSS-001', {
  type: 'prevention',
  description: 'Sanitize user input',
  implementation: 'DOMPurify library'
});
```

## Authentication Systems

### JWT Implementation

```javascript
class JWTManager {
  constructor(secret) {
    this.secret = secret;
    this.algorithm = 'HS256';
  }

  async sign(payload, options = {}) {
    const header = {
      alg: this.algorithm,
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const claims = {
      ...payload,
      iat: now,
      exp: now + (options.expiresIn || 3600),
      iss: options.issuer || 'app',
      aud: options.audience || 'users'
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(claims));
    
    const signature = await this.createSignature(
      `${encodedHeader}.${encodedPayload}`
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  async verify(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Verify signature
    const expectedSignature = await this.createSignature(
      `${encodedHeader}.${encodedPayload}`
    );

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    // Decode payload
    const payload = JSON.parse(this.base64UrlDecode(encodedPayload));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }

    return payload;
  }

  async createSignature(data) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.secret);
    const messageData = encoder.encode(data);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      messageData
    );

    return this.base64UrlEncode(
      String.fromCharCode(...new Uint8Array(signature))
    );
  }

  base64UrlEncode(str) {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return atob(str);
  }

  async refresh(token) {
    const payload = await this.verify(token);
    
    // Remove old timestamps
    delete payload.iat;
    delete payload.exp;
    
    return this.sign(payload);
  }
}

// Usage
const jwtManager = new JWTManager('your-secret-key');

// Sign token
const token = await jwtManager.sign(
  { userId: 123, role: 'user' },
  { expiresIn: 3600 }
);

// Verify token
try {
  const payload = await jwtManager.verify(token);
  console.log('User:', payload.userId);
} catch (error) {
  console.error('Invalid token:', error.message);
}
```

### OAuth 2.0 Flow

```javascript
class OAuth2Client {
  constructor(config) {
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
    this.authorizationEndpoint = config.authorizationEndpoint;
    this.tokenEndpoint = config.tokenEndpoint;
    this.scope = config.scope || 'openid profile email';
  }

  generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(hash));
  }

  base64UrlEncode(buffer) {
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async startAuthorizationFlow() {
    // Generate PKCE parameters
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // Store verifier for later
    sessionStorage.setItem('code_verifier', codeVerifier);
    
    // Generate state for CSRF protection
    const state = this.generateCodeVerifier();
    sessionStorage.setItem('oauth_state', state);

    // Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `${this.authorizationEndpoint}?${params}`;
    
    // Redirect to authorization server
    window.location.href = authUrl;
  }

  async handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }

    // Verify state
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for tokens
    const codeVerifier = sessionStorage.getItem('code_verifier');
    const tokens = await this.exchangeCodeForTokens(code, codeVerifier);

    // Clean up
    sessionStorage.removeItem('code_verifier');
    sessionStorage.removeItem('oauth_state');

    return tokens;
  }

  async exchangeCodeForTokens(code, codeVerifier) {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        code_verifier: codeVerifier
      })
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    return response.json();
  }

  async refreshToken(refreshToken) {
    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId
      })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }
}

// Usage
const oauth = new OAuth2Client({
  clientId: 'your-client-id',
  redirectUri: 'https://yourapp.com/callback',
  authorizationEndpoint: 'https://auth.example.com/authorize',
  tokenEndpoint: 'https://auth.example.com/token',
  scope: 'openid profile email'
});

// Start flow
oauth.startAuthorizationFlow();

// Handle callback
const tokens = await oauth.handleCallback();
console.log('Access token:', tokens.access_token);
```

### Biometric Authentication

```javascript
class BiometricAuth {
  constructor() {
    this.supported = this.checkSupport();
  }

  checkSupport() {
    return window.PublicKeyCredential !== undefined &&
           navigator.credentials !== undefined;
  }

  async register(username) {
    if (!this.supported) {
      throw new Error('WebAuthn not supported');
    }

    // Generate challenge from server
    const challenge = await this.getChallenge();

    const publicKeyOptions = {
      challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
      rp: {
        name: 'Your App',
        id: window.location.hostname
      },
      user: {
        id: Uint8Array.from(username, c => c.charCodeAt(0)),
        name: username,
        displayName: username
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },  // ES256
        { type: 'public-key', alg: -257 } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required'
      },
      timeout: 60000,
      attestation: 'direct'
    };

    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions
      });

      // Send credential to server
      await this.registerCredential(credential);

      return {
        success: true,
        credentialId: credential.id
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async authenticate(username) {
    if (!this.supported) {
      throw new Error('WebAuthn not supported');
    }

    // Get challenge and credential IDs from server
    const { challenge, credentialIds } = await this.getAuthenticationOptions(username);

    const publicKeyOptions = {
      challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
      allowCredentials: credentialIds.map(id => ({
        type: 'public-key',
        id: Uint8Array.from(atob(id), c => c.charCodeAt(0))
      })),
      timeout: 60000,
      userVerification: 'required'
    };

    try {
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyOptions
      });

      // Verify assertion with server
      const result = await this.verifyAssertion(assertion);

      return {
        success: true,
        token: result.token
      };
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  async getChallenge() {
    const response = await fetch('/api/auth/challenge');
    const data = await response.json();
    return data.challenge;
  }

  async registerCredential(credential) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: credential.id,
        rawId: this.arrayBufferToBase64(credential.rawId),
        response: {
          clientDataJSON: this.arrayBufferToBase64(credential.response.clientDataJSON),
          attestationObject: this.arrayBufferToBase64(credential.response.attestationObject)
        },
        type: credential.type
      })
    });

    return response.json();
  }

  async getAuthenticationOptions(username) {
    const response = await fetch(`/api/auth/options?username=${username}`);
    return response.json();
  }

  async verifyAssertion(assertion) {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: assertion.id,
        rawId: this.arrayBufferToBase64(assertion.rawId),
        response: {
          clientDataJSON: this.arrayBufferToBase64(assertion.response.clientDataJSON),
          authenticatorData: this.arrayBufferToBase64(assertion.response.authenticatorData),
          signature: this.arrayBufferToBase64(assertion.response.signature),
          userHandle: assertion.response.userHandle ? 
            this.arrayBufferToBase64(assertion.response.userHandle) : null
        },
        type: assertion.type
      })
    });

    return response.json();
  }

  arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }
}

// Usage
const biometric = new BiometricAuth();

// Register
try {
  await biometric.register('user@example.com');
  console.log('Biometric registered');
} catch (error) {
  console.error('Registration failed:', error);
}

// Authenticate
try {
  const result = await biometric.authenticate('user@example.com');
  console.log('Authenticated:', result.token);
} catch (error) {
  console.error('Authentication failed:', error);
}
```

I'll continue with more security content by appending to this file:

<function_calls>
<invoke name="fsAppend">
<parameter name="path">docs/19-expert-topics/03-security-architecture.md


## Authorization Patterns

### Role-Based Access Control (RBAC)

```javascript
class RBACSystem {
  constructor() {
    this.roles = new Map();
    this.permissions = new Map();
    this.userRoles = new Map();
  }

  defineRole(roleName, permissions = []) {
    this.roles.set(roleName, {
      name: roleName,
      permissions: new Set(permissions),
      inherits: []
    });
  }

  addPermission(roleName, permission) {
    const role = this.roles.get(roleName);
    if (role) {
      role.permissions.add(permission);
    }
  }

  removePermission(roleName, permission) {
    const role = this.roles.get(roleName);
    if (role) {
      role.permissions.delete(permission);
    }
  }

  inheritRole(childRole, parentRole) {
    const child = this.roles.get(childRole);
    const parent = this.roles.get(parentRole);
    
    if (child && parent) {
      child.inherits.push(parentRole);
    }
  }

  assignRole(userId, roleName) {
    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set());
    }
    this.userRoles.get(userId).add(roleName);
  }

  revokeRole(userId, roleName) {
    const roles = this.userRoles.get(userId);
    if (roles) {
      roles.delete(roleName);
    }
  }

  getUserPermissions(userId) {
    const roles = this.userRoles.get(userId) || new Set();
    const permissions = new Set();

    const collectPermissions = (roleName) => {
      const role = this.roles.get(roleName);
      if (!role) return;

      // Add role's permissions
      role.permissions.forEach(p => permissions.add(p));

      // Add inherited permissions
      role.inherits.forEach(parentRole => {
        collectPermissions(parentRole);
      });
    };

    roles.forEach(roleName => collectPermissions(roleName));
    return Array.from(permissions);
  }

  hasPermission(userId, permission) {
    const permissions = this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  can(userId, action, resource) {
    const permission = `${action}:${resource}`;
    return this.hasPermission(userId, permission);
  }
}

// Usage
const rbac = new RBACSystem();

// Define roles
rbac.defineRole('admin', ['read:*', 'write:*', 'delete:*']);
rbac.defineRole('editor', ['read:*', 'write:posts', 'write:comments']);
rbac.defineRole('viewer', ['read:*']);

// Role inheritance
rbac.inheritRole('editor', 'viewer');

// Assign roles
rbac.assignRole('user123', 'editor');

// Check permissions
console.log(rbac.can('user123', 'write', 'posts')); // true
console.log(rbac.can('user123', 'delete', 'posts')); // false
```

### Attribute-Based Access Control (ABAC)

```javascript
class ABACSystem {
  constructor() {
    this.policies = [];
  }

  addPolicy(policy) {
    this.policies.push(policy);
  }

  evaluate(subject, action, resource, environment = {}) {
    for (const policy of this.policies) {
      const result = this.evaluatePolicy(policy, subject, action, resource, environment);
      
      if (result === 'deny') {
        return false; // Explicit deny
      }
      
      if (result === 'allow') {
        return true; // Explicit allow
      }
    }
    
    return false; // Default deny
  }

  evaluatePolicy(policy, subject, action, resource, environment) {
    // Check if policy applies
    if (!this.matchesTarget(policy.target, subject, action, resource)) {
      return 'not-applicable';
    }

    // Evaluate conditions
    if (policy.condition && !this.evaluateCondition(policy.condition, subject, resource, environment)) {
      return 'not-applicable';
    }

    return policy.effect; // 'allow' or 'deny'
  }

  matchesTarget(target, subject, action, resource) {
    if (target.subject && !this.matchAttribute(target.subject, subject)) {
      return false;
    }

    if (target.action && target.action !== action) {
      return false;
    }

    if (target.resource && !this.matchAttribute(target.resource, resource)) {
      return false;
    }

    return true;
  }

  matchAttribute(pattern, value) {
    if (typeof pattern === 'function') {
      return pattern(value);
    }

    if (pattern === '*') {
      return true;
    }

    return pattern === value;
  }

  evaluateCondition(condition, subject, resource, environment) {
    switch (condition.type) {
      case 'equals':
        return this.getValue(condition.left, subject, resource, environment) === 
               this.getValue(condition.right, subject, resource, environment);
      
      case 'greater-than':
        return this.getValue(condition.left, subject, resource, environment) > 
               this.getValue(condition.right, subject, resource, environment);
      
      case 'less-than':
        return this.getValue(condition.left, subject, resource, environment) < 
               this.getValue(condition.right, subject, resource, environment);
      
      case 'in':
        const value = this.getValue(condition.left, subject, resource, environment);
        const list = this.getValue(condition.right, subject, resource, environment);
        return list.includes(value);
      
      case 'and':
        return condition.conditions.every(c => 
          this.evaluateCondition(c, subject, resource, environment)
        );
      
      case 'or':
        return condition.conditions.some(c => 
          this.evaluateCondition(c, subject, resource, environment)
        );
      
      default:
        return false;
    }
  }

  getValue(path, subject, resource, environment) {
    if (typeof path !== 'string') return path;

    const parts = path.split('.');
    const context = parts[0];
    const attribute = parts.slice(1).join('.');

    switch (context) {
      case 'subject':
        return this.getNestedValue(subject, attribute);
      case 'resource':
        return this.getNestedValue(resource, attribute);
      case 'environment':
        return this.getNestedValue(environment, attribute);
      default:
        return undefined;
    }
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Usage
const abac = new ABACSystem();

// Policy: Users can edit their own posts
abac.addPolicy({
  effect: 'allow',
  target: {
    action: 'edit',
    resource: { type: 'post' }
  },
  condition: {
    type: 'equals',
    left: 'subject.id',
    right: 'resource.authorId'
  }
});

// Policy: Admins can edit any post
abac.addPolicy({
  effect: 'allow',
  target: {
    subject: { role: 'admin' },
    action: 'edit',
    resource: { type: 'post' }
  }
});

// Policy: Users can only edit during business hours
abac.addPolicy({
  effect: 'allow',
  target: {
    action: 'edit'
  },
  condition: {
    type: 'and',
    conditions: [
      {
        type: 'greater-than',
        left: 'environment.hour',
        right: 9
      },
      {
        type: 'less-than',
        left: 'environment.hour',
        right: 17
      }
    ]
  }
});

// Check access
const user = { id: 123, role: 'user' };
const post = { id: 456, authorId: 123, type: 'post' };
const env = { hour: new Date().getHours() };

console.log(abac.evaluate(user, 'edit', post, env)); // true if user owns post and during business hours
```

## Cryptography in Frontend

### Encryption/Decryption

```javascript
class CryptoManager {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
  }

  async generateKey() {
    return crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async exportKey(key) {
    const exported = await crypto.subtle.exportKey('jwk', key);
    return JSON.stringify(exported);
  }

  async importKey(keyData) {
    const keyObject = JSON.parse(keyData);
    return crypto.subtle.importKey(
      'jwk',
      keyObject,
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data, key) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv
      },
      key,
      encodedData
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return this.arrayBufferToBase64(combined);
  }

  async decrypt(encryptedData, key) {
    const combined = this.base64ToArrayBuffer(encryptedData);
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: iv
      },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      passwordKey,
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

// Usage
const crypto = new CryptoManager();

// Generate key
const key = await crypto.generateKey();

// Encrypt
const encrypted = await crypto.encrypt('Secret message', key);
console.log('Encrypted:', encrypted);

// Decrypt
const decrypted = await crypto.decrypt(encrypted, key);
console.log('Decrypted:', decrypted);

// Derive key from password
const derivedKey = await crypto.deriveKey('user-password', 'random-salt');
```

### Digital Signatures

```javascript
class SignatureManager {
  constructor() {
    this.algorithm = {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    };
  }

  async generateKeyPair() {
    return crypto.subtle.generateKey(
      this.algorithm,
      true,
      ['sign', 'verify']
    );
  }

  async exportPublicKey(publicKey) {
    const exported = await crypto.subtle.exportKey('spki', publicKey);
    return this.arrayBufferToBase64(exported);
  }

  async exportPrivateKey(privateKey) {
    const exported = await crypto.subtle.exportKey('pkcs8', privateKey);
    return this.arrayBufferToBase64(exported);
  }

  async importPublicKey(keyData) {
    const keyBuffer = this.base64ToArrayBuffer(keyData);
    return crypto.subtle.importKey(
      'spki',
      keyBuffer,
      this.algorithm,
      true,
      ['verify']
    );
  }

  async importPrivateKey(keyData) {
    const keyBuffer = this.base64ToArrayBuffer(keyData);
    return crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      this.algorithm,
      true,
      ['sign']
    );
  }

  async sign(data, privateKey) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const signature = await crypto.subtle.sign(
      this.algorithm.name,
      privateKey,
      encodedData
    );

    return this.arrayBufferToBase64(signature);
  }

  async verify(data, signature, publicKey) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const signatureBuffer = this.base64ToArrayBuffer(signature);

    return crypto.subtle.verify(
      this.algorithm.name,
      publicKey,
      signatureBuffer,
      encodedData
    );
  }

  arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

// Usage
const sigManager = new SignatureManager();

// Generate key pair
const keyPair = await sigManager.generateKeyPair();

// Sign data
const signature = await sigManager.sign('Important message', keyPair.privateKey);
console.log('Signature:', signature);

// Verify signature
const isValid = await sigManager.verify('Important message', signature, keyPair.publicKey);
console.log('Valid:', isValid);
```

## Secure Communication

### Content Security Policy (CSP)

```javascript
class CSPManager {
  constructor() {
    this.directives = new Map();
    this.reportUri = null;
    this.reportOnly = false;
  }

  setDirective(directive, values) {
    if (Array.isArray(values)) {
      this.directives.set(directive, values);
    } else {
      this.directives.set(directive, [values]);
    }
  }

  addSource(directive, source) {
    if (!this.directives.has(directive)) {
      this.directives.set(directive, []);
    }
    this.directives.get(directive).push(source);
  }

  setReportUri(uri) {
    this.reportUri = uri;
  }

  setReportOnly(reportOnly) {
    this.reportOnly = reportOnly;
  }

  build() {
    const parts = [];

    for (const [directive, values] of this.directives) {
      parts.push(`${directive} ${values.join(' ')}`);
    }

    if (this.reportUri) {
      parts.push(`report-uri ${this.reportUri}`);
    }

    return parts.join('; ');
  }

  getHeaderName() {
    return this.reportOnly 
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';
  }

  apply() {
    const meta = document.createElement('meta');
    meta.httpEquiv = this.getHeaderName();
    meta.content = this.build();
    document.head.appendChild(meta);
  }

  // Predefined policies
  static strict() {
    const csp = new CSPManager();
    csp.setDirective('default-src', ["'self'"]);
    csp.setDirective('script-src', ["'self'"]);
    csp.setDirective('style-src', ["'self'", "'unsafe-inline'"]);
    csp.setDirective('img-src', ["'self'", 'data:', 'https:']);
    csp.setDirective('font-src', ["'self'"]);
    csp.setDirective('connect-src', ["'self'"]);
    csp.setDirective('frame-ancestors', ["'none'"]);
    csp.setDirective('base-uri', ["'self'"]);
    csp.setDirective('form-action', ["'self'"]);
    return csp;
  }

  static moderate() {
    const csp = new CSPManager();
    csp.setDirective('default-src', ["'self'"]);
    csp.setDirective('script-src', ["'self'", "'unsafe-inline'"]);
    csp.setDirective('style-src', ["'self'", "'unsafe-inline'"]);
    csp.setDirective('img-src', ["'self'", 'data:', 'https:']);
    return csp;
  }
}

// Usage
const csp = CSPManager.strict();
csp.addSource('script-src', 'https://cdn.example.com');
csp.setReportUri('/api/csp-report');
csp.apply();

console.log('CSP:', csp.build());
```

### Subresource Integrity (SRI)

```javascript
class SRIManager {
  constructor() {
    this.algorithm = 'sha384';
  }

  async generateHash(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    const hashBuffer = await crypto.subtle.digest('SHA-384', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    
    return `${this.algorithm}-${hashBase64}`;
  }

  async generateHashFromUrl(url) {
    const response = await fetch(url);
    const content = await response.text();
    return this.generateHash(content);
  }

  createScriptTag(src, integrity, options = {}) {
    const script = document.createElement('script');
    script.src = src;
    script.integrity = integrity;
    script.crossOrigin = options.crossOrigin || 'anonymous';
    
    if (options.async) script.async = true;
    if (options.defer) script.defer = true;
    
    return script;
  }

  createLinkTag(href, integrity, options = {}) {
    const link = document.createElement('link');
    link.rel = options.rel || 'stylesheet';
    link.href = href;
    link.integrity = integrity;
    link.crossOrigin = options.crossOrigin || 'anonymous';
    
    return link;
  }

  async verifyIntegrity(url, expectedHash) {
    const actualHash = await this.generateHashFromUrl(url);
    return actualHash === expectedHash;
  }
}

// Usage
const sri = new SRIManager();

// Generate hash for external resource
const hash = await sri.generateHashFromUrl('https://cdn.example.com/library.js');
console.log('SRI Hash:', hash);

// Create script with SRI
const script = sri.createScriptTag(
  'https://cdn.example.com/library.js',
  hash,
  { async: true }
);
document.head.appendChild(script);

// Verify integrity
const isValid = await sri.verifyIntegrity(
  'https://cdn.example.com/library.js',
  hash
);
console.log('Integrity valid:', isValid);
```

## Input Validation

### Comprehensive Validator

```javascript
class InputValidator {
  constructor() {
    this.rules = new Map();
    this.customValidators = new Map();
  }

  addRule(field, rules) {
    this.rules.set(field, rules);
  }

  addCustomValidator(name, validator) {
    this.customValidators.set(name, validator);
  }

  validate(data) {
    const errors = {};

    for (const [field, rules] of this.rules) {
      const value = data[field];
      const fieldErrors = [];

      for (const rule of rules) {
        const error = this.validateRule(value, rule, data);
        if (error) {
          fieldErrors.push(error);
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  validateRule(value, rule, data) {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return rule.message || 'This field is required';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return rule.message || 'Invalid email address';
        }
        break;

      case 'min':
        if (typeof value === 'string' && value.length < rule.value) {
          return rule.message || `Minimum length is ${rule.value}`;
        }
        if (typeof value === 'number' && value < rule.value) {
          return rule.message || `Minimum value is ${rule.value}`;
        }
        break;

      case 'max':
        if (typeof value === 'string' && value.length > rule.value) {
          return rule.message || `Maximum length is ${rule.value}`;
        }
        if (typeof value === 'number' && value > rule.value) {
          return rule.message || `Maximum value is ${rule.value}`;
        }
        break;

      case 'pattern':
        if (value && !rule.value.test(value)) {
          return rule.message || 'Invalid format';
        }
        break;

      case 'custom':
        const validator = this.customValidators.get(rule.validator);
        if (validator && !validator(value, data)) {
          return rule.message || 'Validation failed';
        }
        break;

      case 'match':
        if (value !== data[rule.field]) {
          return rule.message || `Must match ${rule.field}`;
        }
        break;
    }

    return null;
  }

  sanitize(value, type) {
    switch (type) {
      case 'string':
        return String(value).trim();
      
      case 'number':
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      
      case 'email':
        return String(value).toLowerCase().trim();
      
      case 'html':
        return this.sanitizeHTML(value);
      
      default:
        return value;
    }
  }

  sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
}

// Usage
const validator = new InputValidator();

// Add validation rules
validator.addRule('email', [
  { type: 'required' },
  { type: 'email' }
]);

validator.addRule('password', [
  { type: 'required' },
  { type: 'min', value: 8, message: 'Password must be at least 8 characters' },
  { type: 'pattern', value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    message: 'Password must contain uppercase, lowercase, and number' }
]);

validator.addRule('confirmPassword', [
  { type: 'required' },
  { type: 'match', field: 'password', message: 'Passwords must match' }
]);

// Custom validator
validator.addCustomValidator('strongPassword', (value) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
});

// Validate data
const result = validator.validate({
  email: 'user@example.com',
  password: 'Password123',
  confirmPassword: 'Password123'
});

console.log('Valid:', result.valid);
console.log('Errors:', result.errors);
```

## Summary

Security architecture for frontend applications requires:
- **Authentication**: JWT, OAuth 2.0, biometric authentication
- **Authorization**: RBAC, ABAC for fine-grained access control
- **Cryptography**: Encryption, digital signatures, secure key management
- **Secure Communication**: CSP, SRI, HTTPS enforcement
- **Input Validation**: Comprehensive validation and sanitization
- **XSS Prevention**: Content sanitization, CSP policies
- **CSRF Protection**: Tokens, SameSite cookies

These patterns and implementations provide defense-in-depth security for modern web applications.
