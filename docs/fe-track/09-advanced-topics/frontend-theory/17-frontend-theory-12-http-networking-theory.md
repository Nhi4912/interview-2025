# HTTP and Networking Theory - Complete Guide

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

# Lý Thuyết HTTP và Networking - Hướng Dẫn Đầy Đủ

## Table of Contents / Mục Lục

### Part 1: HTTP Fundamentals
1. HTTP Protocol Overview
2. Request-Response Cycle
3. HTTP Methods
4. Status Codes
5. Headers

### Part 2: HTTP Versions
6. HTTP/1.0
7. HTTP/1.1
8. HTTP/2
9. HTTP/3 (QUIC)

### Part 3: Network Concepts
10. TCP/IP Stack
11. DNS Resolution
12. TLS/SSL
13. WebSockets
14. Server-Sent Events

### Part 4: Performance
15. Connection Management
16. Caching Strategies
17. Compression
18. CDN
19. Load Balancing

---

## Part 1: HTTP Fundamentals

### 1. HTTP Protocol Overview
### 1. Tổng Quan HTTP Protocol

**English:**

HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the World Wide Web.

**HTTP Definition:**

HTTP is an application-layer protocol for transmitting hypermedia documents. It's designed for communication between web browsers and web servers.

**Key Characteristics:**

1. **Stateless**: Each request is independent
2. **Text-based**: Human-readable format
3. **Request-Response**: Client-server model
4. **Extensible**: Headers allow extensions
5. **Application Layer**: Sits on top of TCP/IP

**Theory: Stateless Protocol**

HTTP is stateless, meaning:
- Server doesn't retain client state between requests
- Each request must contain all necessary information
- No memory of previous requests
- Simplifies server design
- Enables scalability

**Implications:**
- Need cookies/sessions for state
- Each request independent
- Can't assume previous context
- Must send auth with each request

**Benefits:**
- Simpler servers
- Better scalability
- Easier load balancing
- Fault tolerance

**Drawbacks:**
- Overhead (repeated data)
- Need state management
- More complex clients

**HTTP Architecture:**

```
Client (Browser)
    ↓ Request
Server (Web Server)
    ↓ Response
Client (Browser)
```

**Theory: Client-Server Model**

Client-Server architecture separates:
1. **Client**: Initiates requests, renders UI
2. **Server**: Processes requests, sends responses
3. **Clear separation**: Different responsibilities
4. **Scalability**: Can scale independently

**HTTP Layers:**

```
Application Layer (HTTP)
    ↓
Transport Layer (TCP)
    ↓
Internet Layer (IP)
    ↓
Link Layer (Ethernet/WiFi)
```

**Theory: Protocol Stack**

Each layer has specific responsibilities:
1. **HTTP**: Application logic
2. **TCP**: Reliable delivery
3. **IP**: Routing
4. **Link**: Physical transmission

**Vietnamese:**

HTTP (Hypertext Transfer Protocol) là nền tảng của data communication trên World Wide Web.

**Định Nghĩa HTTP:**

HTTP là application-layer protocol để transmitting hypermedia documents. Được thiết kế cho communication giữa web browsers và web servers.

**Đặc Điểm Chính:**

1. **Stateless**: Mỗi request độc lập
2. **Text-based**: Human-readable format
3. **Request-Response**: Client-server model
4. **Extensible**: Headers cho phép extensions
5. **Application Layer**: Sits trên TCP/IP

**Lý Thuyết: Stateless Protocol**

HTTP stateless, nghĩa là:
- Server không retain client state giữa requests
- Mỗi request phải chứa tất cả necessary information
- Không memory của previous requests
- Simplifies server design
- Enables scalability

**Benefits:**
- Servers đơn giản hơn
- Scalability tốt hơn
- Load balancing dễ hơn
- Fault tolerance

**Drawbacks:**
- Overhead (repeated data)
- Cần state management
- Clients phức tạp hơn

---

### 2. Request-Response Cycle
### 2. Chu Trình Request-Response

**English:**

The request-response cycle is the fundamental pattern of HTTP communication.

**Request-Response Flow:**

```
1. Client creates request
2. Client sends request to server
3. Server receives request
4. Server processes request
5. Server creates response
6. Server sends response to client
7. Client receives response
8. Client processes response
```

**HTTP Request Structure:**

```
Request Line: METHOD /path HTTP/version
Headers: Key: Value pairs
Empty Line
Body: Optional data
```

**Example Request:**
```
GET /api/users HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123

```

**Request Components:**

**1. Request Line:**
- Method: GET, POST, PUT, DELETE, etc.
- Path: /api/users
- Version: HTTP/1.1

**2. Headers:**
- Metadata about request
- Key-value pairs
- Optional but common

**3. Body:**
- Data sent to server
- Optional (not for GET)
- Various formats (JSON, form data, etc.)

**HTTP Response Structure:**

```
Status Line: HTTP/version StatusCode Reason
Headers: Key: Value pairs
Empty Line
Body: Response data
```

**Example Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1234
Cache-Control: max-age=3600

{"users": [...]}
```

**Response Components:**

**1. Status Line:**
- Version: HTTP/1.1
- Status Code: 200
- Reason: OK

**2. Headers:**
- Metadata about response
- Content type, length, etc.
- Caching directives

**3. Body:**
- Actual response data
- HTML, JSON, XML, etc.
- Can be empty

**Theory: Request-Response Timing**

**Phases:**
1. **DNS Lookup**: Resolve domain to IP
2. **TCP Connection**: Establish connection
3. **TLS Handshake**: Secure connection (HTTPS)
4. **Request Sent**: Send HTTP request
5. **Server Processing**: Server handles request
6. **Response Sent**: Server sends response
7. **Content Download**: Receive response body

**Timing Metrics:**
- **TTFB (Time to First Byte)**: Time until first response byte
- **Content Download**: Time to download full response
- **Total Time**: End-to-end request time

**Vietnamese:**

Request-response cycle là fundamental pattern của HTTP communication.

**Request-Response Flow:**

```
1. Client tạo request
2. Client gửi request đến server
3. Server nhận request
4. Server xử lý request
5. Server tạo response
6. Server gửi response đến client
7. Client nhận response
8. Client xử lý response
```

**HTTP Request Structure:**

```
Request Line: METHOD /path HTTP/version
Headers: Key: Value pairs
Empty Line
Body: Optional data
```

**Request Components:**

1. **Request Line**: Method, Path, Version
2. **Headers**: Metadata
3. **Body**: Data (optional)

**HTTP Response Structure:**

```
Status Line: HTTP/version StatusCode Reason
Headers: Key: Value pairs
Empty Line
Body: Response data
```

**Response Components:**

1. **Status Line**: Version, Status Code, Reason
2. **Headers**: Metadata
3. **Body**: Response data

---

### 3. HTTP Methods
### 3. HTTP Methods

**English:**

HTTP methods (also called verbs) indicate the desired action to be performed on a resource.

**Common HTTP Methods:**

**1. GET:**
- Retrieve resource
- Safe (no side effects)
- Idempotent (same result)
- Cacheable
- No request body

**Theory: GET Semantics**

GET should:
- Only retrieve data
- Not modify server state
- Be safe to repeat
- Be cacheable
- Have no side effects

**Use Cases:**
- Fetch web pages
- Get API data
- Load images
- Retrieve documents

**2. POST:**
- Create resource
- Not safe (has side effects)
- Not idempotent (different results)
- Not cacheable (usually)
- Has request body

**Theory: POST Semantics**

POST should:
- Create new resources
- Submit form data
- Trigger actions
- Have side effects

**Use Cases:**
- Submit forms
- Create users
- Upload files
- Trigger operations

**3. PUT:**
- Update/replace resource
- Not safe (has side effects)
- Idempotent (same result)
- Not cacheable
- Has request body

**Theory: PUT Semantics**

PUT should:
- Replace entire resource
- Be idempotent
- Create if not exists (sometimes)
- Update if exists

**Use Cases:**
- Update user profile
- Replace document
- Set configuration

**4. PATCH:**
- Partial update
- Not safe (has side effects)
- Not idempotent (usually)
- Not cacheable
- Has request body

**Theory: PATCH Semantics**

PATCH should:
- Update part of resource
- Not replace entire resource
- Be more efficient than PUT

**Use Cases:**
- Update single field
- Partial modifications
- Incremental updates

**5. DELETE:**
- Delete resource
- Not safe (has side effects)
- Idempotent (same result)
- Not cacheable
- May have request body

**Theory: DELETE Semantics**

DELETE should:
- Remove resource
- Be idempotent
- Return success even if already deleted

**Use Cases:**
- Delete user
- Remove file
- Cancel order

**6. HEAD:**
- Like GET but no body
- Safe
- Idempotent
- Cacheable
- No request body

**Theory: HEAD Semantics**

HEAD should:
- Return same headers as GET
- Not return body
- Check resource existence
- Get metadata

**Use Cases:**
- Check if resource exists
- Get content length
- Check last modified
- Validate cache

**7. OPTIONS:**
- Get allowed methods
- Safe
- Idempotent
- Not cacheable
- No request body

**Theory: OPTIONS Semantics**

OPTIONS should:
- Return allowed methods
- Support CORS preflight
- Describe communication options

**Use Cases:**
- CORS preflight
- Discover API capabilities
- Check allowed methods

**Method Properties:**

| Method | Safe | Idempotent | Cacheable | Body |
|--------|------|------------|-----------|------|
| GET | Yes | Yes | Yes | No |
| POST | No | No | No | Yes |
| PUT | No | Yes | No | Yes |
| PATCH | No | No | No | Yes |
| DELETE | No | Yes | No | Maybe |
| HEAD | Yes | Yes | Yes | No |
| OPTIONS | Yes | Yes | No | No |

**Theory: Safe Methods**

Safe methods:
- Don't modify server state
- Read-only operations
- Can be cached
- Can be prefetched

**Theory: Idempotent Methods**

Idempotent methods:
- Same result when repeated
- Safe to retry
- Important for reliability
- Network failures can retry

**Vietnamese:**

HTTP methods (còn gọi verbs) indicate desired action được performed trên resource.

**Common HTTP Methods:**

**1. GET:**
- Retrieve resource
- Safe (no side effects)
- Idempotent
- Cacheable
- No request body

**2. POST:**
- Create resource
- Not safe
- Not idempotent
- Not cacheable
- Has request body

**3. PUT:**
- Update/replace resource
- Not safe
- Idempotent
- Not cacheable
- Has request body

**4. PATCH:**
- Partial update
- Not safe
- Not idempotent
- Not cacheable
- Has request body

**5. DELETE:**
- Delete resource
- Not safe
- Idempotent
- Not cacheable

**Method Properties:**

| Method | Safe | Idempotent | Cacheable |
|--------|------|------------|-----------|
| GET | Có | Có | Có |
| POST | Không | Không | Không |
| PUT | Không | Có | Không |
| PATCH | Không | Không | Không |
| DELETE | Không | Có | Không |

**Lý Thuyết: Safe Methods**

Safe methods:
- Không modify server state
- Read-only operations
- Có thể cached
- Có thể prefetched

**Lý Thuyết: Idempotent Methods**

Idempotent methods:
- Same result khi repeated
- Safe để retry
- Quan trọng cho reliability
- Network failures có thể retry

