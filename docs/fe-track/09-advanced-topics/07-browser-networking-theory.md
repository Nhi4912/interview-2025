# Browser Networking - Advanced Theory / Mạng Trình Duyệt - Lý Thuyết Nâng Cao

## Table of Contents / Mục Lục

1. [HTTP Protocol Evolution](#http-protocol-evolution)
2. [Connection Management](#connection-management)
3. [Resource Loading](#resource-loading)
4. [Caching Strategies](#caching-strategies)
5. [Network Security](#network-security)
6. [Performance Optimization](#performance-optimization)
7. [Interview Questions](#interview-questions)

---

## HTTP Protocol Evolution / Sự Phát Triển Giao Thức HTTP

### From HTTP/1.0 to HTTP/3 / Từ HTTP/1.0 đến HTTP/3

**English:** HTTP has evolved significantly to address performance and security challenges of modern web applications.

**Tiếng Việt:** HTTP đã phát triển đáng kể để giải quyết các thách thức về hiệu suất và bảo mật của ứng dụng web hiện đại.

#### HTTP/1.0 (1996)

**Characteristics:**
- One request per connection
- Connection closed after response
- No persistent connections
- Simple request/response model

**Limitations:**
- High latency (new connection per request)
- TCP handshake overhead
- Slow start for each connection
- No pipelining
- Inefficient resource usage

**Headers:**
- Basic headers only
- No compression
- No caching directives

#### HTTP/1.1 (1997)

**Major Improvements:**

**1. Persistent Connections**
- Keep-Alive by default
- Reuse TCP connections
- Reduces handshake overhead
- `Connection: keep-alive` header

**2. Pipelining**
- Multiple requests without waiting
- Requests sent in sequence
- Responses must be in order
- Rarely used (head-of-line blocking)

**3. Chunked Transfer Encoding**
- Stream response without knowing size
- Progressive rendering
- Better for dynamic content

**4. Host Header**
- Virtual hosting support
- Multiple domains on same IP
- Required header

**5. Better Caching**
- Cache-Control header
- ETag for validation
- Conditional requests
- More granular control

**6. Range Requests**
- Partial content delivery
- Resume downloads
- Video streaming support

**Limitations:**
- Head-of-line blocking
- No multiplexing
- Text-based protocol (overhead)
- Limited concurrent connections (6 per domain)

#### HTTP/2 (2015)

**Revolutionary Changes:**

**1. Binary Protocol**
- Binary framing layer
- More efficient parsing
- Less error-prone
- Smaller overhead

**2. Multiplexing**
- Multiple streams over single connection
- Concurrent requests/responses
- No head-of-line blocking at HTTP level
- Eliminates need for domain sharding

**3. Stream Prioritization**
- Assign priority to streams
- Critical resources first
- Better resource allocation
- Improved page load

**4. Server Push**
- Server sends resources proactively
- Before client requests
- Reduces round trips
- Improves performance

**5. Header Compression (HPACK)**
- Compresses HTTP headers
- Reduces overhead
- Maintains header table
- Significant bandwidth savings

**6. Single Connection**
- One TCP connection per origin
- Reduces connection overhead
- Better resource utilization
- Simplified connection management

**Benefits:**
- Faster page loads
- Better resource utilization
- Reduced latency
- Improved mobile performance

**Limitations:**
- TCP head-of-line blocking still exists
- Packet loss affects all streams
- Complex implementation
- Requires TLS (in practice)

#### HTTP/3 (2022)

**Paradigm Shift: QUIC Protocol**

**1. UDP-Based**
- Built on UDP instead of TCP
- Avoids TCP limitations
- Custom congestion control
- Faster connection establishment

**2. No Head-of-Line Blocking**
- Independent streams
- Packet loss affects only one stream
- Better performance on lossy networks
- Improved mobile experience

**3. Built-in Encryption**
- TLS 1.3 integrated
- Always encrypted
- Faster handshake
- Better security

**4. Connection Migration**
- Survives IP address changes
- Mobile network switching
- Better mobile experience
- Connection ID instead of 4-tuple

**5. 0-RTT Connection**
- Zero round-trip time resumption
- Faster reconnection
- Cached connection state
- Improved performance

**6. Improved Congestion Control**
- Better loss recovery
- Faster adaptation
- Pluggable algorithms
- Optimized for modern networks

**Benefits:**
- Significantly faster
- Better mobile performance
- Resilient to packet loss
- Improved security
- Future-proof

**Adoption:**
- Growing rapidly
- Supported by major browsers
- CDN support increasing
- Becoming standard

---

## Connection Management / Quản Lý Kết Nối

### TCP Connection Lifecycle / Vòng Đời Kết Nối TCP

**English:** Understanding TCP connection management is crucial for optimizing web performance.

**Tiếng Việt:** Hiểu quản lý kết nối TCP là rất quan trọng để tối ưu hóa hiệu suất web.

#### Connection Establishment / Thiết Lập Kết Nối

**Three-Way Handshake:**

**Step 1: SYN (Synchronize)**
- Client sends SYN packet
- Includes initial sequence number
- Requests connection

**Step 2: SYN-ACK (Synchronize-Acknowledge)**
- Server responds with SYN-ACK
- Acknowledges client's SYN
- Sends own sequence number

**Step 3: ACK (Acknowledge)**
- Client sends ACK
- Acknowledges server's SYN
- Connection established

**Latency Impact:**
- One full round trip (RTT)
- Delays first data transmission
- Significant on high-latency networks
- Optimization: TCP Fast Open

#### TLS Handshake / Bắt Tay TLS

**For HTTPS (Additional Steps):**

**TLS 1.2 Handshake:**
1. Client Hello (cipher suites, random)
2. Server Hello (chosen cipher, certificate)
3. Key exchange
4. Finished messages

**Cost**: 2 additional RTTs

**TLS 1.3 Handshake:**
1. Client Hello (with key share)
2. Server Hello (with key share)
3. Encrypted data immediately

**Cost**: 1 additional RTT

**0-RTT Resumption:**
- Use cached session
- Send encrypted data immediately
- No additional RTT
- Security trade-offs

#### Connection Pooling / Gộp Kết Nối

**Concept:**
- Reuse existing connections
- Avoid handshake overhead
- Maintain pool of connections
- Automatic management by browser

**HTTP/1.1 Pooling:**
- 6 connections per domain (typical)
- Persistent connections
- Keep-alive timeout
- Connection reuse

**HTTP/2 Pooling:**
- Single connection per origin
- Multiplexing eliminates need for multiple
- Connection coalescing
- Shared connections for same IP

**Benefits:**
- Reduced latency
- Lower CPU usage
- Better resource utilization
- Improved throughput

**Challenges:**
- Connection limits
- Timeout management
- Load balancing
- Connection state

#### Connection Coalescing / Hợp Nhất Kết Nối

**HTTP/2 Feature:**
- Share connection across domains
- Same IP and certificate
- Reduces connections
- Better performance

**Requirements:**
- Same IP address
- Valid certificate for both domains
- Same origin policy allows
- Browser support

**Example:**
```
www.example.com → 1.2.3.4
cdn.example.com → 1.2.3.4
→ Can share HTTP/2 connection
```

---

## Resource Loading / Tải Tài Nguyên

### Resource Prioritization / Ưu Tiên Tài Nguyên

**English:** Browsers use sophisticated algorithms to prioritize resource loading for optimal user experience.

**Tiếng Việt:** Trình duyệt sử dụng thuật toán tinh vi để ưu tiên tải tài nguyên cho trải nghiệm người dùng tối ưu.

#### Browser Resource Priorities / Ưu Tiên Tài Nguyên Trình Duyệt

**Priority Levels (Chrome):**

**Highest Priority:**
- Main HTML document
- CSS in `<head>`
- Fonts (if used immediately)
- Synchronous scripts in `<head>`

**High Priority:**
- Images in viewport
- Preload resources
- XHR/Fetch (high priority)

**Medium Priority:**
- Scripts (async/defer)
- Images below fold
- Media

**Low Priority:**
- Prefetch resources
- Images far below fold
- Background images

**Lowest Priority:**
- Speculative prefetch
- Service Worker scripts

#### Resource Hints / Gợi Ý Tài Nguyên

**1. DNS Prefetch**
```html
<link rel="dns-prefetch" href="//example.com">
```
- Resolve DNS early
- Reduces DNS lookup time
- Useful for third-party domains
- Low overhead

**2. Preconnect**
```html
<link rel="preconnect" href="https://example.com">
```
- Establish connection early
- DNS + TCP + TLS
- Higher overhead than dns-prefetch
- Use for critical origins

**3. Prefetch**
```html
<link rel="prefetch" href="/next-page.html">
```
- Fetch resource for future navigation
- Low priority
- Cached for later use
- Good for predicted navigation

**4. Preload**
```html
<link rel="preload" href="/critical.css" as="style">
```
- Fetch resource for current page
- High priority
- Must specify `as` attribute
- Critical resources only

**5. Prerender**
```html
<link rel="prerender" href="/next-page.html">
```
- Render entire page in background
- Highest overhead
- Instant navigation
- Use sparingly

**6. Modulepreload**
```html
<link rel="modulepreload" href="/module.js">
```
- Preload ES modules
- Includes dependencies
- Better than regular preload for modules

#### Loading Strategies / Chiến Lược Tải

**Script Loading:**

**1. Synchronous (Default)**
```html
<script src="script.js"></script>
```
- Blocks HTML parsing
- Executes immediately
- Maintains order
- Use for critical scripts

**2. Async**
```html
<script async src="script.js"></script>
```
- Downloads in parallel
- Executes when ready
- Doesn't block parsing
- No execution order guarantee
- Use for independent scripts

**3. Defer**
```html
<script defer src="script.js"></script>
```
- Downloads in parallel
- Executes after parsing
- Maintains order
- Before DOMContentLoaded
- Use for non-critical scripts

**4. Module**
```html
<script type="module" src="module.js"></script>
```
- Deferred by default
- Can use async
- Supports imports
- Modern browsers only

**Image Loading:**

**1. Eager (Default)**
```html
<img src="image.jpg">
```
- Loads immediately
- Blocks rendering
- Use for above-fold images

**2. Lazy**
```html
<img src="image.jpg" loading="lazy">
```
- Loads when near viewport
- Saves bandwidth
- Improves initial load
- Use for below-fold images

**3. Responsive Images**
```html
<img srcset="small.jpg 480w, large.jpg 1080w" 
     sizes="(max-width: 600px) 480px, 1080px">
```
- Appropriate size for device
- Saves bandwidth
- Better performance

---

## Caching Strategies / Chiến Lược Bộ Nhớ Đệm

### HTTP Caching / Bộ Nhớ Đệm HTTP

**English:** Effective caching is crucial for web performance, reducing server load and improving user experience.

**Tiếng Việt:** Bộ nhớ đệm hiệu quả rất quan trọng cho hiệu suất web, giảm tải server và cải thiện trải nghiệm người dùng.

#### Cache-Control Directives / Chỉ Thị Cache-Control

**Response Directives:**

**1. max-age**
```
Cache-Control: max-age=3600
```
- Cache for specified seconds
- Fresh for duration
- Most common directive

**2. s-maxage**
```
Cache-Control: s-maxage=3600
```
- Shared cache (CDN) only
- Overrides max-age for shared caches
- Private caches ignore

**3. no-cache**
```
Cache-Control: no-cache
```
- Must revalidate before use
- Can cache but must check
- Not "don't cache"

**4. no-store**
```
Cache-Control: no-store
```
- Don't cache at all
- Sensitive data
- Always fetch fresh

**5. public**
```
Cache-Control: public
```
- Can be cached by any cache
- Shared caches allowed
- Default for GET requests

**6. private**
```
Cache-Control: private
```
- Only browser cache
- No shared caches
- User-specific data

**7. must-revalidate**
```
Cache-Control: must-revalidate
```
- Must revalidate when stale
- Cannot serve stale
- Strict freshness

**8. immutable**
```
Cache-Control: immutable, max-age=31536000
```
- Never changes
- No revalidation needed
- Perfect for hashed assets

**Request Directives:**

**1. no-cache**
- Force revalidation
- Bypass cache

**2. no-store**
- Don't use cached response
- Fetch fresh

**3. max-age=0**
- Revalidate immediately

#### Cache Validation / Xác Thực Bộ Nhớ Đệm

**ETag (Entity Tag):**
```
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```
- Hash of resource content
- Strong or weak validator
- Conditional requests

**Conditional Request:**
```
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```
- Send ETag with request
- Server checks if changed
- 304 Not Modified if same
- Saves bandwidth

**Last-Modified:**
```
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
```
- Timestamp of last modification
- Less precise than ETag
- Fallback validator

**Conditional Request:**
```
If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT
```
- Check if modified since date
- 304 if not modified

#### Caching Strategies / Chiến Lược Bộ Nhớ Đệm

**1. Cache-First**
- Check cache first
- Fetch if miss
- Good for static assets
- Fast but may be stale

**2. Network-First**
- Try network first
- Fallback to cache
- Good for dynamic content
- Always fresh when online

**3. Stale-While-Revalidate**
```
Cache-Control: max-age=3600, stale-while-revalidate=86400
```
- Serve stale while updating
- Background revalidation
- Best user experience
- Always fast

**4. Cache-Only**
- Only use cache
- Never network
- Offline-first apps
- Must be pre-cached

**5. Network-Only**
- Never cache
- Always fresh
- Sensitive data
- Real-time content

#### Cache Hierarchy / Phân Cấp Bộ Nhớ Đệm

**1. Browser Cache (Private)**
- Per-user cache
- Fastest access
- Limited size
- Cleared by user

**2. Proxy Cache (Shared)**
- Corporate proxies
- ISP caches
- Shared by users
- Larger capacity

**3. CDN Cache (Edge)**
- Geographically distributed
- Closest to users
- Massive scale
- Best performance

**4. Reverse Proxy (Origin)**
- In front of origin server
- Reduces origin load
- Application-level caching
- Full control

---

## Network Security / Bảo Mật Mạng

### Transport Layer Security / Bảo Mật Tầng Vận Chuyển

**English:** TLS/SSL provides encryption, authentication, and integrity for web communications.

**Tiếng Việt:** TLS/SSL cung cấp mã hóa, xác thực và tính toàn vẹn cho giao tiếp web.

#### TLS/SSL Fundamentals / Cơ Bản TLS/SSL

**Purpose:**
- **Encryption**: Prevent eavesdropping
- **Authentication**: Verify server identity
- **Integrity**: Detect tampering

**TLS Versions:**
- TLS 1.0 (1999) - Deprecated
- TLS 1.1 (2006) - Deprecated
- TLS 1.2 (2008) - Widely used
- TLS 1.3 (2018) - Modern standard

**TLS 1.3 Improvements:**
- Faster handshake (1-RTT)
- 0-RTT resumption
- Removed weak ciphers
- Forward secrecy mandatory
- Simplified protocol

#### Certificate Validation / Xác Thực Chứng Chỉ

**Certificate Chain:**
1. **Server Certificate**: Identifies server
2. **Intermediate Certificates**: Chain of trust
3. **Root Certificate**: Trusted authority

**Validation Steps:**
1. Check certificate validity period
2. Verify domain name matches
3. Validate certificate chain
4. Check revocation status (OCSP/CRL)
5. Verify signature

**Certificate Types:**

**1. Domain Validated (DV)**
- Validates domain ownership only
- Quick issuance
- Basic encryption
- Free (Let's Encrypt)

**2. Organization Validated (OV)**
- Validates organization
- More trust
- Business verification
- Paid certificates

**3. Extended Validation (EV)**
- Highest validation
- Green address bar (deprecated)
- Extensive verification
- Most expensive

**4. Wildcard**
- Covers subdomains
- `*.example.com`
- Convenient
- Higher cost

#### HTTPS Best Practices / Thực Hành Tốt Nhất HTTPS

**1. Use TLS 1.3**
- Fastest and most secure
- Disable older versions
- Better performance

**2. HTTP Strict Transport Security (HSTS)**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
- Force HTTPS
- Prevent downgrade attacks
- Include in preload list

**3. Certificate Transparency**
- Public log of certificates
- Detect mis-issuance
- Improved security

**4. OCSP Stapling**
- Server provides revocation status
- Faster validation
- Better privacy
- Reduced load on CA

**5. Perfect Forward Secrecy**
- Ephemeral key exchange
- Past sessions secure even if key compromised
- Modern ciphers only

---

## Performance Optimization / Tối Ưu Hóa Hiệu Suất

### Network Performance Techniques / Kỹ Thuật Hiệu Suất Mạng

**English:** Optimizing network performance requires understanding and applying multiple techniques.

**Tiếng Việt:** Tối ưu hóa hiệu suất mạng yêu cầu hiểu và áp dụng nhiều kỹ thuật.

#### Compression / Nén

**1. Gzip**
- Widely supported
- Good compression ratio
- CPU overhead
- Default choice

**2. Brotli**
- Better compression than gzip
- 15-20% smaller
- Higher CPU usage
- Modern browsers

**3. Zstandard**
- Emerging standard
- Fast compression/decompression
- Good ratio
- Limited support

**Compression Levels:**
- Higher level = better compression
- Higher level = more CPU time
- Balance based on use case
- Pre-compress static assets

**What to Compress:**
- Text files (HTML, CSS, JS)
- JSON/XML data
- SVG images
- Fonts

**What Not to Compress:**
- Already compressed (images, video)
- Small files (<1KB)
- Real-time data (overhead)

#### Minification / Thu Nhỏ

**Purpose**: Remove unnecessary characters

**Techniques:**
- Remove whitespace
- Remove comments
- Shorten variable names
- Remove dead code
- Optimize syntax

**Benefits:**
- Smaller file size
- Faster downloads
- Better compression
- Reduced bandwidth

**Tools:**
- Terser (JavaScript)
- cssnano (CSS)
- html-minifier (HTML)

#### Bundling / Đóng Gói

**Purpose**: Combine multiple files

**Benefits:**
- Fewer HTTP requests
- Better compression
- Reduced overhead
- Simplified deployment

**Considerations:**
- Bundle size
- Code splitting
- Caching strategy
- Initial load time

**Modern Approach:**
- Code splitting
- Dynamic imports
- Route-based splitting
- Component-based splitting

#### CDN (Content Delivery Network) / Mạng Phân Phối Nội Dung

**Purpose**: Serve content from edge locations

**Benefits:**
- Reduced latency
- Geographic distribution
- DDoS protection
- Offload origin server
- Better availability

**How It Works:**
1. User requests resource
2. DNS routes to nearest edge
3. Edge serves from cache
4. Cache miss → fetch from origin
5. Cache for future requests

**CDN Features:**
- Global distribution
- Automatic caching
- SSL/TLS termination
- Compression
- Image optimization
- Security features

**Best Practices:**
- Use for static assets
- Long cache times
- Versioned URLs
- Purge when needed

#### HTTP/2 Optimizations / Tối Ưu HTTP/2

**1. Eliminate Domain Sharding**
- Single connection better
- Multiplexing handles concurrency
- Simpler configuration

**2. Reduce Concatenation**
- Smaller, individual files
- Better caching
- Faster updates
- Selective loading

**3. Use Server Push**
- Push critical resources
- Reduce round trips
- Careful not to over-push
- Monitor effectiveness

**4. Prioritize Streams**
- Critical resources first
- Better resource allocation
- Improved page load

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: Compare HTTP/1.1, HTTP/2, and HTTP/3

**English Answer:**

**HTTP/1.1:**
- Text protocol
- One request per connection (or pipelined)
- Head-of-line blocking
- 6 connections per domain
- No multiplexing

**HTTP/2:**
- Binary protocol
- Multiplexing over single connection
- Stream prioritization
- Server push
- Header compression (HPACK)
- Still uses TCP (HOL blocking at TCP level)

**HTTP/3:**
- Built on QUIC (UDP-based)
- No head-of-line blocking
- 0-RTT connection resumption
- Connection migration
- Built-in encryption (TLS 1.3)
- Better mobile performance

**Key Differences:**
- **Protocol**: Text → Binary → Binary over UDP
- **Connections**: Multiple → Single → Single (QUIC)
- **HOL Blocking**: Yes → Partial → No
- **Encryption**: Optional → Recommended → Required

**Tiếng Việt:**

HTTP/1.1: text, multiple connections, HOL blocking. HTTP/2: binary, multiplexing, single connection, TCP HOL. HTTP/3: QUIC (UDP), no HOL, 0-RTT, connection migration, built-in encryption.

### Q2: Explain browser caching strategies

**English Answer:**

**Cache-Control Directives:**

**max-age**: Cache duration in seconds
**no-cache**: Revalidate before use
**no-store**: Don't cache at all
**public**: Any cache can store
**private**: Only browser cache
**immutable**: Never changes

**Validation:**
- **ETag**: Content hash for validation
- **Last-Modified**: Timestamp validation
- **Conditional requests**: If-None-Match, If-Modified-Since
- **304 Not Modified**: Resource unchanged

**Strategies:**
1. **Cache-First**: Fast but may be stale
2. **Network-First**: Fresh but slower
3. **Stale-While-Revalidate**: Best UX
4. **Cache-Only**: Offline-first
5. **Network-Only**: Always fresh

**Best Practices:**
- Long cache for static assets (immutable)
- Short cache for dynamic content
- Use versioned URLs
- Implement validation
- Consider stale-while-revalidate

**Tiếng Việt:**

Cache-Control directives: max-age, no-cache, no-store, public, private, immutable. Validation: ETag, Last-Modified. Strategies: cache-first, network-first, stale-while-revalidate. Best practices: long cache for static, short for dynamic, versioned URLs.

### Q3: What is TLS and how does it work?

**English Answer:**

**TLS (Transport Layer Security)** provides secure communication.

**Purpose:**
- **Encryption**: Prevent eavesdropping
- **Authentication**: Verify identity
- **Integrity**: Detect tampering

**TLS Handshake (1.3):**
1. Client Hello (supported ciphers, key share)
2. Server Hello (chosen cipher, certificate, key share)
3. Encrypted communication begins

**Cost**: 1 RTT (TLS 1.3), 2 RTT (TLS 1.2)

**0-RTT Resumption:**
- Use cached session
- Send encrypted data immediately
- No additional RTT
- Security trade-offs

**Certificate Validation:**
1. Check validity period
2. Verify domain name
3. Validate certificate chain
4. Check revocation status
5. Verify signature

**Best Practices:**
- Use TLS 1.3
- Enable HSTS
- Implement OCSP stapling
- Use strong ciphers
- Perfect forward secrecy

**Tiếng Việt:**

TLS cung cấp encryption, authentication, integrity. TLS 1.3 handshake: 1 RTT. 0-RTT resumption: no additional RTT. Certificate validation: validity, domain, chain, revocation, signature. Best practices: TLS 1.3, HSTS, OCSP stapling.

### Q4: Explain resource loading priorities

**English Answer:**

**Browser Priority Levels:**

**Highest:**
- Main HTML
- CSS in `<head>`
- Synchronous scripts in `<head>`
- Fonts (if used immediately)

**High:**
- Images in viewport
- Preload resources
- XHR/Fetch (high priority)

**Medium:**
- Async/defer scripts
- Images below fold

**Low:**
- Prefetch resources
- Images far below fold

**Lowest:**
- Speculative prefetch

**Resource Hints:**
- **dns-prefetch**: Resolve DNS early
- **preconnect**: Establish connection
- **prefetch**: Fetch for future
- **preload**: Fetch for current page
- **prerender**: Render entire page

**Script Loading:**
- **Sync**: Blocks parsing
- **Async**: Execute when ready
- **Defer**: Execute after parsing
- **Module**: Deferred by default

**Best Practices:**
- Preload critical resources
- Defer non-critical scripts
- Lazy load below-fold images
- Use appropriate priorities

**Tiếng Việt:**

Priority levels: Highest (HTML, CSS, sync scripts) → High (viewport images, preload) → Medium (async scripts) → Low (prefetch) → Lowest (speculative). Resource hints: dns-prefetch, preconnect, prefetch, preload. Script loading: sync (blocks), async (when ready), defer (after parse).

---

## Summary / Tóm Tắt

**Key Concepts:**

1. **HTTP Evolution**: HTTP/1.1 → HTTP/2 (multiplexing) → HTTP/3 (QUIC)
2. **Connection Management**: TCP handshake, TLS, connection pooling, coalescing
3. **Resource Loading**: Priorities, resource hints, loading strategies
4. **Caching**: Cache-Control, validation, strategies, hierarchy
5. **Security**: TLS/SSL, certificates, HTTPS best practices
6. **Performance**: Compression, minification, bundling, CDN, HTTP/2 optimizations

**Best Practices:**
- Use HTTP/2 or HTTP/3
- Implement effective caching
- Optimize resource loading
- Enable compression
- Use CDN for static assets
- Implement HTTPS with TLS 1.3
- Monitor and measure performance

---

[← Previous: Browser Architecture](./06-browser-architecture-theory.md) | [Next: Web Performance →](./08-web-performance-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
