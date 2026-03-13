# HTTP Protocols - Comprehensive Theory

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## From HTTP/1.1 to HTTP/3

**English:** HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the web. Understanding its evolution and mechanics is crucial for building performant web applications.

**Tiếng Việt:** HTTP (Hypertext Transfer Protocol) là nền tảng của truyền thông dữ liệu trên web. Hiểu được sự phát triển và cơ chế của nó là rất quan trọng để xây dựng ứng dụng web hiệu suất cao.

## HTTP Fundamentals

### Request-Response Model

**Theory:** HTTP follows a client-server model where clients send requests and servers send responses.

**Request Structure:**
```
GET /api/users HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123

[Optional Body]
```

**Response Structure:**
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1234
Cache-Control: max-age=3600

{"users": [...]}
```

### HTTP Methods

**GET:**
- Retrieve resource
- Idempotent
- Cacheable
- No body

**POST:**
- Create resource
- Not idempotent
- Not cacheable
- Has body

**PUT:**
- Update/replace resource
- Idempotent
- Not cacheable
- Has body

**PATCH:**
- Partial update
- Not idempotent
- Not cacheable
- Has body

**DELETE:**
- Remove resource
- Idempotent
- Not cacheable
- Optional body

**HEAD:**
- Like GET but no body
- Check resource existence
- Get metadata

**OPTIONS:**
- Describe communication options
- CORS preflight
- Discover allowed methods

### Status Codes

**1xx Informational:**
- 100 Continue
- 101 Switching Protocols

**2xx Success:**
- 200 OK
- 201 Created
- 204 No Content

**3xx Redirection:**
- 301 Moved Permanently
- 302 Found
- 304 Not Modified
- 307 Temporary Redirect
- 308 Permanent Redirect

**4xx Client Error:**
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 429 Too Many Requests

**5xx Server Error:**
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout

## HTTP/1.1

### Limitations

**Head-of-Line Blocking:**
- One request per connection at a time
- Subsequent requests wait
- Severe performance impact

**Connection Overhead:**
- TCP handshake per connection
- TLS negotiation per connection
- Expensive setup

**Header Redundancy:**
- Headers repeated on every request
- No compression
- Bandwidth waste

**Workarounds:**
- Domain sharding (multiple domains)
- Resource concatenation (sprites, bundles)
- Inlining (data URIs)
- Connection pooling (keep-alive)

### Persistent Connections

**Keep-Alive:**
```
Connection: keep-alive
Keep-Alive: timeout=5, max=100
```

**Benefits:**
- Reuse TCP connection
- Reduce handshake overhead
- Better performance

**Limitations:**
- Still one request at a time
- Head-of-line blocking remains

## HTTP/2

### Multiplexing

**Theory:** Multiple requests/responses over single connection simultaneously.

**Benefits:**
- No head-of-line blocking (at HTTP layer)
- Better connection utilization
- Reduced latency
- No need for domain sharding

**Streams:**
- Independent bidirectional sequences
- Identified by stream ID
- Can be prioritized
- Can be cancelled

**Frames:**
- Smallest unit of communication
- Types: HEADERS, DATA, PRIORITY, etc.
- Interleaved on connection
- Reassembled into messages

### Binary Protocol

**Theory:** HTTP/2 uses binary framing instead of text.

**Benefits:**
- More efficient parsing
- Less error-prone
- Smaller size
- Better compression

**Frame Structure:**
```
+-----------------------------------------------+
|                 Length (24)                   |
+---------------+---------------+---------------+
|   Type (8)    |   Flags (8)   |
+-+-------------+---------------+-------------------------------+
|R|                 Stream Identifier (31)                      |
+=+=============================================================+
|                   Frame Payload (0...)                      ...
+---------------------------------------------------------------+
```

### Header Compression (HPACK)

**Theory:** Compress headers using static and dynamic tables.

**Static Table:**
- Predefined common headers
- Index-based reference
- No transmission needed

**Dynamic Table:**
- Previously seen headers
- Built during connection
- Huffman encoding

**Benefits:**
- 85-95% header size reduction
- Faster transmission
- Lower bandwidth

### Server Push

**Theory:** Server proactively sends resources before client requests.

**Use Cases:**
- Push CSS with HTML
- Push JavaScript with HTML
- Push images referenced in CSS

**Benefits:**
- Eliminate round trips
- Faster page load
- Better resource utilization

**Challenges:**
- Cache awareness
- Over-pushing
- Client can reject (RST_STREAM)

### Stream Prioritization

**Theory:** Assign priority to streams for optimal resource delivery.

**Priority Tree:**
- Dependencies between streams
- Weights for siblings
- Critical resources first

**Example:**
```
HTML (highest priority)
  ├─ CSS (high priority)
  ├─ JavaScript (medium priority)
  └─ Images (low priority)
```

## HTTP/3 (QUIC)

### Why HTTP/3?

**HTTP/2 Limitation:**
- TCP head-of-line blocking
- One lost packet blocks all streams
- TCP doesn't know about streams

**Solution:**
- Use UDP instead of TCP
- Implement reliability in QUIC
- Stream-aware transport

### QUIC Protocol

**Features:**

**1. No Head-of-Line Blocking:**
- Independent streams
- Lost packet affects only one stream
- Other streams continue

**2. Faster Connection:**
- 0-RTT connection establishment
- Combined TCP + TLS handshake
- Resume previous connections

**3. Connection Migration:**
- Survive IP address changes
- Mobile network switching
- Better mobile experience

**4. Built-in Encryption:**
- Always encrypted
- TLS 1.3 integrated
- Better security

### Connection Establishment

**HTTP/1.1:**
```
TCP Handshake (1 RTT)
TLS Handshake (2 RTT)
HTTP Request (1 RTT)
Total: 4 RTT
```

**HTTP/2:**
```
TCP Handshake (1 RTT)
TLS Handshake (1-2 RTT)
HTTP Request (1 RTT)
Total: 3-4 RTT
```

**HTTP/3 (QUIC):**
```
QUIC Handshake (1 RTT)
HTTP Request (0 RTT with resumption)
Total: 0-1 RTT
```

### Stream Multiplexing

**Theory:** QUIC implements streams at transport layer.

**Benefits:**
- True multiplexing
- No TCP head-of-line blocking
- Independent stream flow control
- Better loss recovery

## Performance Comparison

### Latency Impact

**HTTP/1.1:**
- 6 parallel connections typical
- Head-of-line blocking per connection
- High latency on slow networks

**HTTP/2:**
- Single connection
- Multiplexing
- Better on high-latency networks
- TCP head-of-line blocking

**HTTP/3:**
- Single connection
- True multiplexing
- Best on high-latency/lossy networks
- No head-of-line blocking

### Packet Loss Impact

**Scenario:** 2% packet loss

**HTTP/1.1:**
- Affects one connection
- Other connections continue
- Moderate impact

**HTTP/2:**
- Affects all streams
- TCP retransmits
- Severe impact

**HTTP/3:**
- Affects only one stream
- Other streams continue
- Minimal impact

## Best Practices

### HTTP/2 Optimization

**Do:**
- Use single connection
- Remove domain sharding
- Unbundle resources
- Use server push carefully
- Enable compression

**Don't:**
- Concatenate all resources
- Inline everything
- Over-push resources
- Ignore priorities

### HTTP/3 Adoption

**Considerations:**
- Browser support
- CDN support
- Fallback to HTTP/2
- Monitor performance
- Test thoroughly

## Interview Questions

**Q: Difference between HTTP/1.1 and HTTP/2?**

A: HTTP/2 uses binary protocol, multiplexing, header compression (HPACK), and server push. HTTP/1.1 is text-based, one request per connection, and has head-of-line blocking.

**Q: What is HTTP/2 multiplexing?**

A: Multiplexing allows multiple requests/responses over single connection simultaneously using streams. Eliminates head-of-line blocking at HTTP layer.

**Q: Why HTTP/3 uses UDP?**

A: To eliminate TCP head-of-line blocking. QUIC implements reliability on UDP with stream-aware transport, allowing independent stream delivery.

**Q: What is 0-RTT in HTTP/3?**

A: Zero Round Trip Time allows resuming previous connections instantly by reusing cryptographic parameters, eliminating handshake delay.

**Q: How does server push work?**

A: Server proactively sends resources before client requests them, eliminating round trips. Client can reject unwanted pushes with RST_STREAM.

---

[Next: Database Theory →](./15-advanced-topics-01-http-protocols-theory.md)
