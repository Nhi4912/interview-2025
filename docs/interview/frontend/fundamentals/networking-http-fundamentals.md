# Networking & HTTP Fundamentals for Frontend

## Overview
Understanding networking and HTTP protocols is crucial for building efficient, secure, and scalable frontend applications. This guide covers essential networking concepts with practical implementations.

---

## HTTP Protocol Deep Dive

### **HTTP Methods and Semantic Usage**

{% raw %}
```javascript
// Comprehensive HTTP client with advanced features
class AdvancedHTTPClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || '';
    this.defaultHeaders = options.headers || {};
    this.timeout = options.timeout || 30000;
    this.retryConfig = options.retry || { maxRetries: 3, backoffFactor: 2 };
    this.interceptors = { request: [], response: [] };
    this.cache = new Map();
    this.abortControllers = new Map();
  }

  // HTTP GET with caching and conditional requests
  async get(url, options = {}) {
    const cacheKey = this.generateCacheKey('GET', url, options);
    const cachedResponse = this.getFromCache(cacheKey);
    
    const headers = {
      ...this.defaultHeaders,
      ...options.headers
    };

    // Add conditional headers if cached response exists
    if (cachedResponse) {
      if (cachedResponse.etag) {
        headers['If-None-Match'] = cachedResponse.etag;
      }
      if (cachedResponse.lastModified) {
        headers['If-Modified-Since'] = cachedResponse.lastModified;
      }
    }

    const response = await this.request('GET', url, { ...options, headers });
    
    // Handle 304 Not Modified
    if (response.status === 304 && cachedResponse) {
      return {
        ...cachedResponse,
        fromCache: true,
        cacheHit: true
      };
    }

    // Cache successful responses
    if (response.ok) {
      this.setCache(cacheKey, response);
    }

    return response;
  }

  // HTTP POST with request deduplication
  async post(url, data, options = {}) {
    const requestKey = this.generateRequestKey('POST', url, data);
    
    // Check for duplicate in-flight requests
    if (this.abortControllers.has(requestKey)) {
      throw new Error('Duplicate request in progress');
    }

    return this.request('POST', url, { ...options, body: data });
  }

  // HTTP PUT for idempotent updates
  async put(url, data, options = {}) {
    return this.request('PUT', url, { ...options, body: data });
  }

  // HTTP PATCH for partial updates
  async patch(url, data, options = {}) {
    const headers = {
      'Content-Type': 'application/json-patch+json',
      ...options.headers
    };

    // Support JSON Patch format
    const patchData = Array.isArray(data) ? data : this.generateJsonPatch(data);
    
    return this.request('PATCH', url, { 
      ...options, 
      headers,
      body: JSON.stringify(patchData)
    });
  }

  // HTTP DELETE with confirmation
  async delete(url, options = {}) {
    return this.request('DELETE', url, options);
  }

  // HTTP HEAD for metadata only
  async head(url, options = {}) {
    return this.request('HEAD', url, options);
  }

  // HTTP OPTIONS for CORS preflight
  async options(url, options = {}) {
    return this.request('OPTIONS', url, options);
  }

  // Core request method with comprehensive error handling
  async request(method, url, options = {}) {
    const requestId = Math.random().toString(36).substr(2, 9);
    const fullURL = this.resolveURL(url);
    
    let attempt = 0;
    let lastError;

    while (attempt <= this.retryConfig.maxRetries) {
      try {
        const controller = new AbortController();
        const requestKey = this.generateRequestKey(method, url, options.body);
        this.abortControllers.set(requestKey, controller);

        // Apply request interceptors
        const processedOptions = await this.applyRequestInterceptors({
          method,
          url: fullURL,
          ...options,
          signal: controller.signal
        });

        // Set timeout
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, this.timeout);

        try {
          const response = await fetch(fullURL, processedOptions);
          clearTimeout(timeoutId);
          this.abortControllers.delete(requestKey);

          // Apply response interceptors
          const processedResponse = await this.applyResponseInterceptors(response);
          
          // Handle HTTP errors
          if (!processedResponse.ok) {
            throw new HTTPError(processedResponse);
          }

          return await this.parseResponse(processedResponse);
        } catch (error) {
          clearTimeout(timeoutId);
          this.abortControllers.delete(requestKey);
          throw error;
        }

      } catch (error) {
        lastError = error;
        
        // Don't retry certain errors
        if (this.isNonRetriableError(error) || attempt === this.retryConfig.maxRetries) {
          throw error;
        }

        // Wait before retry with exponential backoff
        const delay = Math.pow(this.retryConfig.backoffFactor, attempt) * 1000;
        await this.delay(delay);
        attempt++;
      }
    }

    throw lastError;
  }

  // Request/Response interceptors
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  async applyRequestInterceptors(config) {
    let processedConfig = { ...config };
    
    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  async applyResponseInterceptors(response) {
    let processedResponse = response;
    
    for (const interceptor of this.interceptors.response) {
      processedResponse = await interceptor(processedResponse);
    }
    
    return processedResponse;
  }

  // Advanced caching with TTL and size limits
  setCache(key, response, ttl = 300000) { // 5 minutes default
    const cacheEntry = {
      data: response,
      timestamp: Date.now(),
      ttl,
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      size: this.estimateResponseSize(response)
    };

    this.cache.set(key, cacheEntry);
    this.evictExpiredCache();
    this.enforceMaxCacheSize();
  }

  getFromCache(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  evictExpiredCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  enforceMaxCacheSize(maxSize = 50 * 1024 * 1024) { // 50MB default
    let totalSize = 0;
    const entries = Array.from(this.cache.entries());
    
    // Calculate total cache size
    for (const [, entry] of entries) {
      totalSize += entry.size;
    }
    
    if (totalSize > maxSize) {
      // Sort by access time (LRU eviction)
      entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      // Remove oldest entries until under limit
      for (const [key, entry] of entries) {
        this.cache.delete(key);
        totalSize -= entry.size;
        if (totalSize <= maxSize) break;
      }
    }
  }

  // Utility methods
  generateCacheKey(method, url, options) {
    const keyData = {
      method,
      url,
      headers: options.headers,
      searchParams: options.searchParams
    };
    return JSON.stringify(keyData);
  }

  generateRequestKey(method, url, body) {
    return `${method}:${url}:${this.hashObject(body)}`;
  }

  hashObject(obj) {
    if (!obj) return '';
    return btoa(JSON.stringify(obj)).slice(0, 16);
  }

  resolveURL(url) {
    if (url.startsWith('http')) return url;
    return `${this.baseURL}${url}`;
  }

  generateJsonPatch(changes) {
    const patches = [];
    for (const [path, value] of Object.entries(changes)) {
      patches.push({
        op: 'replace',
        path: `/${path}`,
        value
      });
    }
    return patches;
  }

  estimateResponseSize(response) {
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength) : 1024; // 1KB default estimate
  }

  isNonRetriableError(error) {
    if (error instanceof HTTPError) {
      const status = error.status;
      // Don't retry client errors (4xx) except 429 (Too Many Requests)
      return status >= 400 && status < 500 && status !== 429;
    }
    
    // Don't retry abort errors
    return error.name === 'AbortError';
  }

  async parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    
    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    };

    if (contentType.includes('application/json')) {
      result.data = await response.json();
    } else if (contentType.includes('text/')) {
      result.data = await response.text();
    } else if (contentType.includes('application/octet-stream')) {
      result.data = await response.arrayBuffer();
    } else {
      result.data = await response.blob();
    }

    return result;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cancel all pending requests
  cancelAllRequests() {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    let totalSize = 0;
    let expiredCount = 0;
    const now = Date.now();

    for (const entry of this.cache.values()) {
      totalSize += entry.size;
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      }
    }

    return {
      totalEntries: this.cache.size,
      totalSize,
      expiredEntries: expiredCount,
      hitRate: this.calculateHitRate()
    };
  }

  calculateHitRate() {
    // This would need to be tracked separately in a real implementation
    return 0;
  }
}

// Custom HTTP Error class
class HTTPError extends Error {
  constructor(response) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = 'HTTPError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.response = response;
  }
}
```
{% endraw %}

---

## Advanced Request/Response Handling

### **WebSocket Implementation with Reconnection**

```javascript
// Robust WebSocket client with advanced features
class AdvancedWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.protocols = options.protocols;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    this.reconnectDelay = options.reconnectDelay || 1000;
    this.maxReconnectDelay = options.maxReconnectDelay || 30000;
    this.backoffFactor = options.backoffFactor || 1.5;
    this.heartbeatInterval = options.heartbeatInterval || 30000;
    this.messageQueue = [];
    this.eventListeners = new Map();
    this.isReconnecting = false;
    this.shouldReconnect = true;
    this.connectionId = null;
    this.lastActivity = Date.now();
    
    this.connect();
    this.startHeartbeat();
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url, this.protocols);
      this.setupEventHandlers();
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  setupEventHandlers() {
    this.ws.onopen = (event) => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.isReconnecting = false;
      this.connectionId = this.generateConnectionId();
      this.lastActivity = Date.now();
      
      // Send queued messages
      this.flushMessageQueue();
      
      this.emit('open', event);
    };

    this.ws.onmessage = (event) => {
      this.lastActivity = Date.now();
      
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        this.emit('message', { data: event.data, raw: true });
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.emit('close', event);
      
      if (this.shouldReconnect && !event.wasClean) {
        this.handleReconnection();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
      this.handleConnectionError(error);
    };
  }

  handleMessage(data) {
    // Handle different message types
    switch (data.type) {
      case 'ping':
        this.send({ type: 'pong', timestamp: Date.now() });
        break;
      case 'pong':
        this.handlePong(data);
        break;
      case 'auth_required':
        this.emit('auth_required', data);
        break;
      case 'auth_success':
        this.emit('auth_success', data);
        break;
      case 'auth_failed':
        this.emit('auth_failed', data);
        break;
      default:
        this.emit('message', data);
    }
  }

  handlePong(data) {
    const latency = Date.now() - data.timestamp;
    this.emit('latency', { latency, timestamp: data.timestamp });
  }

  send(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
      this.lastActivity = Date.now();
    } else {
      // Queue message for later
      this.messageQueue.push(message);
    }
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.ws.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
  }

  handleReconnection() {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;

    const delay = Math.min(
      this.reconnectDelay * Math.pow(this.backoffFactor, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.emit('reconnecting', { attempt: this.reconnectAttempts, delay });

    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect();
      }
    }, delay);
  }

  handleConnectionError(error) {
    if (this.shouldReconnect) {
      this.handleReconnection();
    }
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        const timeSinceLastActivity = Date.now() - this.lastActivity;
        
        if (timeSinceLastActivity > this.heartbeatInterval) {
          this.send({ type: 'ping', timestamp: Date.now() });
        }
      }
    }, this.heartbeatInterval);
  }

  authenticate(credentials) {
    this.send({
      type: 'auth',
      credentials,
      connectionId: this.connectionId
    });
  }

  subscribe(channel, params = {}) {
    this.send({
      type: 'subscribe',
      channel,
      params
    });
  }

  unsubscribe(channel) {
    this.send({
      type: 'unsubscribe',
      channel
    });
  }

  // Event emitter functionality
  on(event, listener) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(listener);
  }

  off(event, listener) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  close() {
    this.shouldReconnect = false;
    clearInterval(this.heartbeatTimer);
    
    if (this.ws) {
      this.ws.close(1000, 'Client closing connection');
    }
  }

  getConnectionState() {
    return {
      readyState: this.ws?.readyState,
      connectionId: this.connectionId,
      reconnectAttempts: this.reconnectAttempts,
      isReconnecting: this.isReconnecting,
      messageQueueLength: this.messageQueue.length,
      lastActivity: this.lastActivity
    };
  }

  generateConnectionId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
```

---

## Security and CORS

### **Advanced CORS and Security Headers**

```javascript
// CORS and security utilities for frontend applications
class NetworkSecurity {
  
  // CORS preflight request analyzer
  static async analyzeCORS(url, method = 'GET', headers = {}) {
    const analysis = {
      url,
      method,
      headers,
      preflightRequired: false,
      preflightResponse: null,
      actualRequestAllowed: false,
      corsHeaders: {},
      securityHeaders: {},
      warnings: [],
      recommendations: []
    };

    // Check if preflight is required
    analysis.preflightRequired = this.requiresPreflight(method, headers);

    if (analysis.preflightRequired) {
      try {
        // Send OPTIONS request
        const preflightResponse = await fetch(url, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': method,
            'Access-Control-Request-Headers': Object.keys(headers).join(', ')
          }
        });

        analysis.preflightResponse = {
          status: preflightResponse.status,
          headers: Object.fromEntries(preflightResponse.headers.entries())
        };

        // Parse CORS headers
        analysis.corsHeaders = this.parseCORSHeaders(preflightResponse.headers);
        analysis.actualRequestAllowed = this.isRequestAllowed(
          method, 
          headers, 
          analysis.corsHeaders
        );

      } catch (error) {
        analysis.warnings.push(`Preflight request failed: ${error.message}`);
      }
    } else {
      analysis.actualRequestAllowed = true;
    }

    // Security analysis
    analysis.securityHeaders = this.analyzeSecurityHeaders(analysis.preflightResponse?.headers);
    analysis.recommendations = this.generateSecurityRecommendations(analysis);

    return analysis;
  }

  static requiresPreflight(method, headers) {
    const simpleMethod = ['GET', 'HEAD', 'POST'].includes(method.toUpperCase());
    
    if (!simpleMethod) return true;

    const simpleHeaders = [
      'accept',
      'accept-language',
      'content-language',
      'content-type'
    ];

    const hasComplexHeaders = Object.keys(headers).some(header => 
      !simpleHeaders.includes(header.toLowerCase())
    );

    if (hasComplexHeaders) return true;

    const contentType = headers['content-type'] || headers['Content-Type'];
    if (contentType) {
      const simpleContentTypes = [
        'application/x-www-form-urlencoded',
        'multipart/form-data',
        'text/plain'
      ];
      
      const isSimpleContentType = simpleContentTypes.some(type => 
        contentType.includes(type)
      );
      
      if (!isSimpleContentType) return true;
    }

    return false;
  }

  static parseCORSHeaders(headers) {
    return {
      allowOrigin: headers.get('access-control-allow-origin'),
      allowMethods: headers.get('access-control-allow-methods')?.split(',').map(m => m.trim()),
      allowHeaders: headers.get('access-control-allow-headers')?.split(',').map(h => h.trim()),
      allowCredentials: headers.get('access-control-allow-credentials') === 'true',
      exposeHeaders: headers.get('access-control-expose-headers')?.split(',').map(h => h.trim()),
      maxAge: parseInt(headers.get('access-control-max-age')) || 0
    };
  }

  static isRequestAllowed(method, headers, corsHeaders) {
    // Check method
    if (corsHeaders.allowMethods && !corsHeaders.allowMethods.includes(method)) {
      return false;
    }

    // Check headers
    if (corsHeaders.allowHeaders) {
      const requestHeaders = Object.keys(headers).map(h => h.toLowerCase());
      const allowedHeaders = corsHeaders.allowHeaders.map(h => h.toLowerCase());
      
      for (const header of requestHeaders) {
        if (!allowedHeaders.includes(header)) {
          return false;
        }
      }
    }

    return true;
  }

  static analyzeSecurityHeaders(headers) {
    if (!headers) return {};

    return {
      contentSecurityPolicy: headers.get('content-security-policy'),
      strictTransportSecurity: headers.get('strict-transport-security'),
      xFrameOptions: headers.get('x-frame-options'),
      xContentTypeOptions: headers.get('x-content-type-options'),
      xXSSProtection: headers.get('x-xss-protection'),
      referrerPolicy: headers.get('referrer-policy'),
      permissionsPolicy: headers.get('permissions-policy'),
      crossOriginEmbedderPolicy: headers.get('cross-origin-embedder-policy'),
      crossOriginOpenerPolicy: headers.get('cross-origin-opener-policy'),
      crossOriginResourcePolicy: headers.get('cross-origin-resource-policy')
    };
  }

  static generateSecurityRecommendations(analysis) {
    const recommendations = [];
    const { securityHeaders, corsHeaders } = analysis;

    // CORS recommendations
    if (corsHeaders.allowOrigin === '*' && corsHeaders.allowCredentials) {
      recommendations.push({
        type: 'security',
        severity: 'high',
        message: 'Wildcard origin with credentials is not allowed'
      });
    }

    if (corsHeaders.allowOrigin === '*') {
      recommendations.push({
        type: 'security',
        severity: 'medium',
        message: 'Consider restricting allowed origins instead of using wildcard'
      });
    }

    // Security headers recommendations
    if (!securityHeaders.contentSecurityPolicy) {
      recommendations.push({
        type: 'security',
        severity: 'high',
        message: 'Content Security Policy header is missing'
      });
    }

    if (!securityHeaders.strictTransportSecurity) {
      recommendations.push({
        type: 'security',
        severity: 'medium',
        message: 'Strict Transport Security header is missing'
      });
    }

    if (!securityHeaders.xFrameOptions) {
      recommendations.push({
        type: 'security',
        severity: 'medium',
        message: 'X-Frame-Options header is missing'
      });
    }

    if (!securityHeaders.xContentTypeOptions) {
      recommendations.push({
        type: 'security',
        severity: 'low',
        message: 'X-Content-Type-Options header is missing'
      });
    }

    return recommendations;
  }

  // Content Security Policy helper
  static generateCSP(config = {}) {
    const {
      defaultSrc = ["'self'"],
      scriptSrc = ["'self'"],
      styleSrc = ["'self'", "'unsafe-inline'"],
      imgSrc = ["'self'", 'data:', 'https:'],
      fontSrc = ["'self'"],
      connectSrc = ["'self'"],
      objectSrc = ["'none'"],
      mediaSrc = ["'self'"],
      frameSrc = ["'none'"],
      reportUri = null,
      reportTo = null,
      upgradeInsecureRequests = true
    } = config;

    const directives = [];

    directives.push(`default-src ${defaultSrc.join(' ')}`);
    directives.push(`script-src ${scriptSrc.join(' ')}`);
    directives.push(`style-src ${styleSrc.join(' ')}`);
    directives.push(`img-src ${imgSrc.join(' ')}`);
    directives.push(`font-src ${fontSrc.join(' ')}`);
    directives.push(`connect-src ${connectSrc.join(' ')}`);
    directives.push(`object-src ${objectSrc.join(' ')}`);
    directives.push(`media-src ${mediaSrc.join(' ')}`);
    directives.push(`frame-src ${frameSrc.join(' ')}`);

    if (upgradeInsecureRequests) {
      directives.push('upgrade-insecure-requests');
    }

    if (reportUri) {
      directives.push(`report-uri ${reportUri}`);
    }

    if (reportTo) {
      directives.push(`report-to ${reportTo}`);
    }

    return directives.join('; ');
  }

  // Validate and sanitize URLs
  static validateURL(url, allowedProtocols = ['http:', 'https:']) {
    try {
      const parsedURL = new URL(url);
      
      if (!allowedProtocols.includes(parsedURL.protocol)) {
        throw new Error(`Protocol ${parsedURL.protocol} not allowed`);
      }

      // Check for dangerous patterns
      const dangerousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(url)) {
          throw new Error('URL contains dangerous pattern');
        }
      }

      return {
        isValid: true,
        url: parsedURL.href,
        protocol: parsedURL.protocol,
        hostname: parsedURL.hostname,
        pathname: parsedURL.pathname
      };

    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }

  // Request signing for API authentication
  static signRequest(request, secret, algorithm = 'SHA-256') {
    const { method, url, headers, body } = request;
    
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substr(2, 16);
    
    const signaturePayload = [
      method.toUpperCase(),
      url,
      timestamp,
      nonce,
      JSON.stringify(headers || {}),
      body || ''
    ].join('\n');

    return {
      timestamp,
      nonce,
      signature: this.hmacSign(signaturePayload, secret, algorithm),
      signatureMethod: algorithm
    };
  }

  static async hmacSign(message, secret, algorithm) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: algorithm },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );

    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Rate limiting client-side tracking
  static createRateLimiter(windowMs = 60000, maxRequests = 100) {
    const requests = [];
    
    return {
      isAllowed() {
        const now = Date.now();
        
        // Remove old requests outside the window
        while (requests.length > 0 && now - requests[0] > windowMs) {
          requests.shift();
        }
        
        if (requests.length >= maxRequests) {
          return {
            allowed: false,
            retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000)
          };
        }
        
        requests.push(now);
        return {
          allowed: true,
          remaining: maxRequests - requests.length
        };
      },
      
      reset() {
        requests.length = 0;
      },
      
      getStatus() {
        const now = Date.now();
        const validRequests = requests.filter(time => now - time <= windowMs);
        
        return {
          requestCount: validRequests.length,
          maxRequests,
          windowMs,
          resetTime: validRequests.length > 0 ? validRequests[0] + windowMs : now
        };
      }
    };
  }
}
```

---

## Network Performance Optimization

### **Connection Optimization Strategies**

```javascript
// Network performance optimization utilities
class NetworkOptimization {
  
  // Connection monitoring and optimization
  static monitorConnection() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) {
      return {
        supported: false,
        message: 'Network Information API not supported'
      };
    }

    const monitor = {
      supported: true,
      current: this.getConnectionInfo(connection),
      history: [],
      listeners: [],
      
      onChange(callback) {
        this.listeners.push(callback);
        connection.addEventListener('change', () => {
          const newInfo = NetworkOptimization.getConnectionInfo(connection);
          this.history.push({
            ...newInfo,
            timestamp: Date.now()
          });
          callback(newInfo);
        });
      },
      
      getOptimizationStrategy() {
        return NetworkOptimization.getOptimizationStrategy(this.current);
      },
      
      shouldOptimizeForLowBandwidth() {
        return this.current.effectiveType === 'slow-2g' || 
               this.current.effectiveType === '2g' ||
               (this.current.downlink && this.current.downlink < 1);
      },
      
      shouldPreloadResources() {
        return this.current.effectiveType === '4g' ||
               (this.current.downlink && this.current.downlink > 10);
      }
    };

    return monitor;
  }

  static getConnectionInfo(connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      downlinkMax: connection.downlinkMax,
      rtt: connection.rtt,
      saveData: connection.saveData,
      type: connection.type
    };
  }

  static getOptimizationStrategy(connectionInfo) {
    const { effectiveType, downlink, saveData } = connectionInfo;
    
    if (saveData) {
      return {
        strategy: 'data-saver',
        recommendations: [
          'Enable aggressive compression',
          'Reduce image quality',
          'Minimize non-essential requests',
          'Use text instead of images where possible'
        ]
      };
    }

    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return {
          strategy: 'low-bandwidth',
          recommendations: [
            'Use critical CSS inline',
            'Defer non-critical JavaScript',
            'Compress all resources aggressively',
            'Use WebP images with low quality',
            'Implement aggressive caching'
          ]
        };
      
      case '3g':
        return {
          strategy: 'moderate-bandwidth',
          recommendations: [
            'Preload critical resources',
            'Use responsive images',
            'Enable resource hints',
            'Implement smart bundling'
          ]
        };
      
      case '4g':
        return {
          strategy: 'high-bandwidth',
          recommendations: [
            'Preload next page resources',
            'Use high-quality images',
            'Enable speculative loading',
            'Implement aggressive prefetching'
          ]
        };
      
      default:
        return {
          strategy: 'adaptive',
          recommendations: [
            'Monitor connection changes',
            'Adapt strategy dynamically',
            'Use progressive enhancement'
          ]
        };
    }
  }

  // Resource hints optimization
  static optimizeResourceHints(resources, connectionInfo) {
    const optimized = {
      preload: [],
      prefetch: [],
      preconnect: [],
      dnsPrefetch: []
    };

    const strategy = this.getOptimizationStrategy(connectionInfo);
    
    for (const resource of resources) {
      if (resource.critical && strategy.strategy !== 'low-bandwidth') {
        optimized.preload.push({
          href: resource.url,
          as: resource.type,
          crossorigin: resource.crossorigin
        });
      }
      
      if (resource.nextPage && strategy.strategy === 'high-bandwidth') {
        optimized.prefetch.push({
          href: resource.url
        });
      }
      
      if (resource.externalDomain) {
        if (strategy.strategy === 'high-bandwidth') {
          optimized.preconnect.push({
            href: resource.domain,
            crossorigin: resource.crossorigin
          });
        } else {
          optimized.dnsPrefetch.push({
            href: resource.domain
          });
        }
      }
    }

    return optimized;
  }

  // HTTP/2 Push optimization
  static optimizeHTTP2Push(criticalResources, requestHistory = []) {
    const pushCandidates = [];
    const requestMap = new Map();
    
    // Analyze request patterns
    for (const request of requestHistory) {
      const key = `${request.url}:${request.referer}`;
      if (!requestMap.has(key)) {
        requestMap.set(key, []);
      }
      requestMap.get(key).push(request.timestamp);
    }

    for (const resource of criticalResources) {
      const score = this.calculatePushScore(resource, requestMap);
      
      if (score > 0.7) { // High confidence threshold
        pushCandidates.push({
          ...resource,
          pushScore: score,
          priority: this.getPushPriority(resource)
        });
      }
    }

    // Sort by priority and push score
    pushCandidates.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.pushScore - a.pushScore;
    });

    return pushCandidates.slice(0, 6); // Limit to 6 resources
  }

  static calculatePushScore(resource, requestMap) {
    const key = `${resource.url}:${resource.referer}`;
    const requests = requestMap.get(key) || [];
    
    if (requests.length < 2) return 0;
    
    // Calculate request frequency
    const timeSpan = Math.max(...requests) - Math.min(...requests);
    const frequency = requests.length / (timeSpan || 1);
    
    // Calculate consistency (lower variance in timing = higher score)
    const intervals = [];
    for (let i = 1; i < requests.length; i++) {
      intervals.push(requests[i] - requests[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avgInterval, 2);
    }, 0) / intervals.length;
    
    const consistency = 1 / (1 + Math.sqrt(variance) / avgInterval);
    
    return Math.min(frequency * consistency, 1);
  }

  static getPushPriority(resource) {
    const priorityMap = {
      'script': 3,
      'style': 4,
      'font': 2,
      'image': 1,
      'document': 5
    };
    
    return priorityMap[resource.type] || 1;
  }

  // Service Worker caching strategy optimizer
  static optimizeCachingStrategy(resources, usage = {}) {
    const strategies = {
      cacheFirst: [],
      networkFirst: [],
      staleWhileRevalidate: [],
      networkOnly: [],
      cacheOnly: []
    };

    for (const resource of resources) {
      const strategy = this.selectCachingStrategy(resource, usage[resource.url]);
      strategies[strategy].push(resource);
    }

    return {
      strategies,
      swConfig: this.generateSWConfig(strategies)
    };
  }

  static selectCachingStrategy(resource, usageStats = {}) {
    const { updateFrequency = 0, accessFrequency = 0, size = 0 } = usageStats;
    
    // Static assets that rarely change
    if (resource.type === 'font' || resource.type === 'image') {
      return 'cacheFirst';
    }
    
    // API responses that change frequently
    if (resource.type === 'api' && updateFrequency > 0.8) {
      return 'networkFirst';
    }
    
    // Content that's acceptable to be stale
    if (resource.type === 'api' && updateFrequency < 0.3) {
      return 'staleWhileRevalidate';
    }
    
    // Large files accessed infrequently
    if (size > 1000000 && accessFrequency < 0.2) {
      return 'networkOnly';
    }
    
    // Default to network first for dynamic content
    return 'networkFirst';
  }

  static generateSWConfig(strategies) {
    const config = {
      runtimeCaching: []
    };

    for (const [strategy, resources] of Object.entries(strategies)) {
      if (resources.length === 0) continue;
      
      const urlPatterns = resources.map(r => r.pattern || r.url);
      
      config.runtimeCaching.push({
        urlPattern: new RegExp(urlPatterns.join('|')),
        handler: this.strategyToHandler(strategy),
        options: this.getStrategyOptions(strategy, resources)
      });
    }

    return config;
  }

  static strategyToHandler(strategy) {
    const handlerMap = {
      cacheFirst: 'CacheFirst',
      networkFirst: 'NetworkFirst',
      staleWhileRevalidate: 'StaleWhileRevalidate',
      networkOnly: 'NetworkOnly',
      cacheOnly: 'CacheOnly'
    };
    
    return handlerMap[strategy];
  }

  static getStrategyOptions(strategy, resources) {
    const options = {
      cacheName: `${strategy}-cache`,
      cacheKeyWillBeUsed: ({ request }) => {
        // Custom cache key logic
        return request.url;
      }
    };

    if (strategy === 'networkFirst' || strategy === 'staleWhileRevalidate') {
      options.networkTimeoutSeconds = 3;
    }

    if (strategy === 'cacheFirst') {
      options.cacheableResponse = {
        statuses: [0, 200]
      };
    }

    // Set expiration based on resource type
    const maxAge = this.getMaxAge(resources);
    if (maxAge) {
      options.expiration = {
        maxAgeSeconds: maxAge,
        maxEntries: 100
      };
    }

    return options;
  }

  static getMaxAge(resources) {
    const types = resources.map(r => r.type);
    
    if (types.includes('font')) return 365 * 24 * 60 * 60; // 1 year
    if (types.includes('image')) return 30 * 24 * 60 * 60; // 30 days
    if (types.includes('style') || types.includes('script')) return 7 * 24 * 60 * 60; // 7 days
    if (types.includes('api')) return 60 * 60; // 1 hour
    
    return 24 * 60 * 60; // 1 day default
  }
}
```

This comprehensive networking and HTTP fundamentals guide provides the essential knowledge for building secure, performant, and reliable frontend applications that communicate effectively with backend services and handle various network conditions.