# HTTP Protocols: Complete Interview Guide

## Overview

HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web. Understanding HTTP is essential for frontend engineers as it governs how browsers communicate with servers, affects performance, and impacts security.

## 🌐 HTTP Fundamentals

### What is HTTP?

HTTP is an application-layer protocol that defines how messages are formatted and transmitted between web browsers and servers. It's stateless, meaning each request-response cycle is independent.

### Request-Response Cycle

```
Client (Browser)          Server
     |                      |
     |  1. HTTP Request     |
     |--------------------> |
     |                      |  2. Process Request
     |                      |     (Database, Logic)
     |  3. HTTP Response    |
     | <------------------- |
     |                      |
```

## 📝 HTTP Methods (Verbs)

### Common Methods

| Method | Purpose | Idempotent | Safe | Request Body | Response Body |
|--------|---------|------------|------|--------------|---------------|
| GET | Retrieve data | ✅ | ✅ | ❌ | ✅ |
| POST | Create resource | ❌ | ❌ | ✅ | ✅ |
| PUT | Update/Replace | ✅ | ❌ | ✅ | ✅ |
| PATCH | Partial update | ❌ | ❌ | ✅ | ✅ |
| DELETE | Remove resource | ✅ | ❌ | ❌ | ✅ |
| HEAD | Get headers only | ✅ | ✅ | ❌ | ❌ |
| OPTIONS | Check allowed methods | ✅ | ✅ | ❌ | ✅ |

### Properties Explained

- **Idempotent**: Multiple identical requests have the same effect
- **Safe**: Method doesn't modify server state
- **Cacheable**: Response can be cached

## 📊 HTTP Status Codes

### Categories

#### 1xx - Informational
- **100 Continue**: Server received request headers, client should continue
- **101 Switching Protocols**: Server switching protocols per client request

#### 2xx - Success
- **200 OK**: Request successful
- **201 Created**: Resource successfully created
- **202 Accepted**: Request accepted but not yet processed
- **204 No Content**: Request successful, no content to return

#### 3xx - Redirection
- **301 Moved Permanently**: Resource permanently moved to new URL
- **302 Found**: Resource temporarily moved
- **304 Not Modified**: Resource not modified since last request

#### 4xx - Client Errors
- **400 Bad Request**: Invalid request syntax
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Server understood but refuses to authorize
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded

#### 5xx - Server Errors
- **500 Internal Server Error**: Generic server error
- **502 Bad Gateway**: Invalid response from upstream server
- **503 Service Unavailable**: Server temporarily unavailable

## 🔄 HTTP Versions Comparison

### HTTP/1.1 (1997)

**Features:**
- Persistent connections (keep-alive)
- Pipelining support
- Chunked transfer encoding
- Host header requirement

**Limitations:**
- Head-of-line blocking
- Multiple connections needed for parallelism
- Text-based protocol (larger overhead)

### HTTP/2 (2015)

**Improvements:**
- Binary protocol (faster parsing)
- Multiplexing (multiple requests per connection)
- Server push
- Header compression (HPACK)
- Stream prioritization

### HTTP/3 (2022)

**Key Features:**
- QUIC transport protocol (UDP-based)
- Improved performance over unreliable networks
- Better handling of connection migration
- Reduced latency

## 🔒 HTTPS vs HTTP

### HTTP (Insecure)
- Plain text communication
- Vulnerable to eavesdropping
- No authentication or integrity protection

### HTTPS (Secure)
- TLS/SSL encryption
- Authentication through certificates
- Data integrity protection
- Required for modern web features

## 🔥 Common Interview Questions & Answers

### Q1: What happens when you type a URL in the browser?

**Answer:**

1. **DNS Resolution**: Browser resolves domain name to IP address
2. **TCP Connection**: Establish connection to server (3-way handshake)
3. **TLS Handshake**: If HTTPS, establish secure connection
4. **HTTP Request**: Send HTTP request with headers
5. **Server Processing**: Server processes request
6. **HTTP Response**: Server sends response with status code and data
7. **Rendering**: Browser parses and renders the content

### Q2: How do HTTP caches work?

**Answer:**

HTTP caching reduces latency and server load by storing frequently requested resources.

**Cache Types:**
1. **Browser Cache**: Local storage in user's browser
2. **Proxy Cache**: Shared cache between clients and servers
3. **CDN Cache**: Geographically distributed caches

**Cache Headers:**
- `Cache-Control`: Directives for caching behavior
- `ETag`: Resource version identifier
- `Last-Modified`: Resource modification timestamp
- `Expires`: Absolute expiration time

### Q3: What is CORS and why is it important?

**Answer:**

CORS (Cross-Origin Resource Sharing) is a security mechanism that allows web pages to access resources from different origins (different protocol, domain, or port).

**Same-Origin Policy:**
- Browser security feature that restricts cross-origin requests
- Prevents malicious scripts from accessing sensitive data
- CORS provides controlled relaxation of this policy

**CORS Headers:**
- `Access-Control-Allow-Origin`: Specifies allowed origins
- `Access-Control-Allow-Methods`: Allowed HTTP methods
- `Access-Control-Allow-Headers`: Allowed request headers

## 🛠️ Practical Examples

### 1. Making HTTP Requests

```javascript
// GET request
const response = await fetch('/api/users');
const users = await response.json();

// POST request with JSON
const newUser = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});

// PUT request for updates
await fetch('/api/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Smith',
    email: 'johnsmith@example.com'
  })
});

// DELETE request
await fetch('/api/users/123', {
  method: 'DELETE'
});
```

### 2. Error Handling

```javascript
async function handleRequest(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error('Bad request - check your data');
        case 401:
          throw new Error('Authentication required');
        case 403:
          throw new Error('Access forbidden');
        case 404:
          throw new Error('Resource not found');
        case 429:
          throw new Error('Rate limit exceeded');
        case 500:
          throw new Error('Server error - try again');
        default:
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}
```

### 3. Caching Implementation

```javascript
// Simple cache implementation
class HTTPCache {
  constructor() {
    this.cache = new Map();
  }
  
  async get(url, options = {}) {
    const key = `${options.method || 'GET'}:${url}`;
    
    // Check cache first
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (!this.isExpired(cached)) {
        return cached.response;
      }
    }
    
    // Fetch from network
    const response = await fetch(url, options);
    
    // Cache successful responses
    if (response.ok) {
      this.cache.set(key, {
        response: response.clone(),
        timestamp: Date.now(),
        maxAge: this.getMaxAge(response.headers.get('cache-control'))
      });
    }
    
    return response;
  }
  
  isExpired(cached) {
    return Date.now() - cached.timestamp > cached.maxAge * 1000;
  }
  
  getMaxAge(cacheControl) {
    if (!cacheControl) return 0;
    const match = cacheControl.match(/max-age=(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}
```

## 🎯 Best Practices

### 1. Use Appropriate HTTP Methods
- GET for data retrieval
- POST for creating resources
- PUT for replacing entire resources
- PATCH for partial updates
- DELETE for removing resources

### 2. Handle Status Codes Properly
- Check response.ok before processing
- Provide meaningful error messages
- Implement retry logic for 5xx errors
- Don't retry 4xx errors automatically

### 3. Implement Proper Caching
- Use Cache-Control headers effectively
- Implement conditional requests with ETags
- Consider cache invalidation strategies
- Use appropriate cache levels (browser, CDN, server)

### 4. Security Considerations
- Always use HTTPS in production
- Implement proper CORS policies
- Validate and sanitize all inputs
- Use security headers (CSP, HSTS, etc.)

## 📈 Performance Optimization

### Connection Management
- Use HTTP/2 when available
- Implement connection pooling for HTTP/1.1
- Minimize DNS lookups
- Use CDNs for static assets

### Request Optimization
- Batch multiple requests when possible
- Implement request deduplication
- Use compression (gzip, brotli)
- Optimize payload sizes

### Caching Strategies
- Implement multi-level caching
- Use appropriate cache TTLs
- Consider cache warming strategies
- Monitor cache hit rates

## 🎓 Summary

HTTP is fundamental to web development. Key concepts for interviews:

- **Methods**: GET, POST, PUT, PATCH, DELETE and their properties
- **Status Codes**: Understanding response codes and proper handling
- **Headers**: Caching, security, and content negotiation
- **Versions**: Differences between HTTP/1.1, HTTP/2, and HTTP/3
- **Security**: HTTPS, CORS, and security best practices
- **Performance**: Caching strategies and optimization techniques
- **Error Handling**: Proper error handling and retry mechanisms

Master these concepts to build robust web applications and excel in frontend interviews!
