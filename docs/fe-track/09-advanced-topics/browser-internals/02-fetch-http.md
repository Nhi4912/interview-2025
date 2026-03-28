# Fetch API & HTTP / API Fetch & HTTP

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Web APIs - Chapter 2 / API Web - Chương 2

[← Previous: Browser APIs](./01-browser-apis.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: WebSockets →](./03-websockets.md)

---

## Overview / Tổng Quan

**English:** Understanding HTTP protocol and the Fetch API is fundamental for modern web development. This chapter covers HTTP methods, status codes, headers, CORS, and advanced fetch patterns essential for technical interviews.

**Tiếng Việt:** Hiểu giao thức HTTP và API Fetch là nền tảng cho phát triển web hiện đại. Chương này bao gồm các phương thức HTTP, mã trạng thái, header, CORS và các mẫu fetch nâng cao cần thiết cho phỏng vấn kỹ thuật.

---

## Table of Contents / Mục Lục

1. [HTTP Fundamentals / Cơ Bản HTTP](#http-fundamentals--cơ-bản-http)
2. [Fetch API Basics / Cơ Bản API Fetch](#fetch-api-basics--cơ-bản-api-fetch)
3. [HTTP Methods / Phương Thức HTTP](#http-methods--phương-thức-http)
4. [Request & Response / Yêu Cầu & Phản Hồi](#request--response--yêu-cầu--phản-hồi)
5. [Headers / Header](#headers--header)
6. [CORS / CORS](#cors--cors)
7. [Error Handling / Xử Lý Lỗi](#error-handling--xử-lý-lỗi)
8. [Advanced Patterns / Mẫu Nâng Cao](#advanced-patterns--mẫu-nâng-cao)
9. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## HTTP Fundamentals / Cơ Bản HTTP

### HTTP Protocol / Giao Thức HTTP

**English:** HTTP (HyperText Transfer Protocol) is stateless request-response protocol for client-server communication.

**Tiếng Việt:** HTTP (Giao Thức Truyền Siêu Văn Bản) là giao thức yêu cầu-phản hồi không trạng thái cho giao tiếp client-server.

### HTTP Status Codes / Mã Trạng Thái HTTP

```
Category        | Range | Meaning
----------------|-------|----------------------------------
Informational   | 1xx   | Request received, continuing
Success         | 2xx   | Request successfully received
Redirection     | 3xx   | Further action needed
Client Error    | 4xx   | Request contains bad syntax
Server Error    | 5xx   | Server failed to fulfill request
```

### Common Status Codes / Mã Trạng Thái Phổ Biến

```typescript
const HTTP_STATUS = {
  // 2xx Success / Thành công
  OK: 200,                    // Request succeeded / Yêu cầu thành công
  CREATED: 201,               // Resource created / Tài nguyên đã tạo
  NO_CONTENT: 204,            // Success but no content / Thành công nhưng không có nội dung
  
  // 3xx Redirection / Chuyển hướng
  MOVED_PERMANENTLY: 301,     // Resource moved / Tài nguyên đã di chuyển
  FOUND: 302,                 // Temporary redirect / Chuyển hướng tạm thời
  NOT_MODIFIED: 304,          // Cached version valid / Phiên bản cache hợp lệ
  
  // 4xx Client Error / Lỗi Client
  BAD_REQUEST: 400,           // Invalid request / Yêu cầu không hợp lệ
  UNAUTHORIZED: 401,          // Authentication required / Yêu cầu xác thực
  FORBIDDEN: 403,             // Access denied / Truy cập bị từ chối
  NOT_FOUND: 404,             // Resource not found / Không tìm thấy tài nguyên
  METHOD_NOT_ALLOWED: 405,    // HTTP method not allowed / Phương thức HTTP không được phép
  CONFLICT: 409,              // Request conflicts / Yêu cầu xung đột
  TOO_MANY_REQUESTS: 429,     // Rate limit exceeded / Vượt quá giới hạn tốc độ
  
  // 5xx Server Error / Lỗi Server
  INTERNAL_SERVER_ERROR: 500, // Server error / Lỗi server
  NOT_IMPLEMENTED: 501,       // Not implemented / Chưa triển khai
  BAD_GATEWAY: 502,           // Invalid response / Phản hồi không hợp lệ
  SERVICE_UNAVAILABLE: 503,   // Service unavailable / Dịch vụ không khả dụng
  GATEWAY_TIMEOUT: 504        // Gateway timeout / Hết thời gian gateway
} as const;
```

---

## Fetch API Basics / Cơ Bản API Fetch

### Basic GET Request / Yêu Cầu GET Cơ Bản

```typescript
// Simple GET request / Yêu cầu GET đơn giản
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// With query parameters / Với tham số truy vấn
async function fetchWithParams(userId: number) {
  const params = new URLSearchParams({
    userId: userId.toString(),
    include: 'posts,comments',
    limit: '10'
  });
  
  const response = await fetch(`https://api.example.com/users?${params}`);
  return response.json();
}
```

### Response Methods / Phương Thức Response

```typescript
async function handleResponse(url: string) {
  const response = await fetch(url);
  
  // Check response type / Kiểm tra loại phản hồi
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return await response.json();
  } else if (contentType?.includes('text/html')) {
    return await response.text();
  } else if (contentType?.includes('application/octet-stream')) {
    return await response.blob();
  } else {
    return await response.arrayBuffer();
  }
}

// Response properties / Thuộc tính phản hồi
async function inspectResponse(url: string) {
  const response = await fetch(url);
  
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('OK:', response.ok); // true if 200-299
  console.log('Headers:', response.headers);
  console.log('URL:', response.url);
  console.log('Redirected:', response.redirected);
}
```

---

## HTTP Methods / Phương Thức HTTP

### GET - Retrieve Data / Lấy Dữ Liệu

```typescript
async function getUser(id: number) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  
  return response.json();
}
```

### POST - Create Resource / Tạo Tài Nguyên

```typescript
interface CreateUserData {
  name: string;
  email: string;
  age: number;
}

async function createUser(userData: CreateUserData) {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`);
  }
  
  return response.json();
}

// Usage / Sử dụng
const newUser = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});
```

### PUT - Update Resource / Cập Nhật Tài Nguyên

```typescript
async function updateUser(id: number, userData: Partial<CreateUserData>) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return response.json();
}
```

### PATCH - Partial Update / Cập Nhật Một Phần

```typescript
async function patchUser(id: number, updates: Partial<CreateUserData>) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  return response.json();
}
```

### DELETE - Remove Resource / Xóa Tài Nguyên

```typescript
async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`);
  }
}
```

---

## Request & Response / Yêu Cầu & Phản Hồi

### Request Options / Tùy Chọn Yêu Cầu

```typescript
interface FetchOptions {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  mode?: 'cors' | 'no-cors' | 'same-origin';
  credentials?: 'omit' | 'same-origin' | 'include';
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal;
}

// Complete example / Ví dụ đầy đủ
async function advancedFetch(url: string) {
  const controller = new AbortController();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    },
    body: JSON.stringify({ data: 'example' }),
    mode: 'cors',
    credentials: 'include',
    cache: 'no-cache',
    redirect: 'follow',
    signal: controller.signal
  });
  
  return response.json();
}
```

### Timeout Implementation / Triển Khai Timeout

```typescript
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 5000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

// Usage / Sử dụng
try {
  const response = await fetchWithTimeout('https://api.example.com/slow', {}, 3000);
  const data = await response.json();
} catch (error) {
  console.error('Request failed:', error);
}
```

---

## Headers / Header

### Common Headers / Header Phổ Biến

```typescript
const commonHeaders = {
  // Content negotiation / Thương lượng nội dung
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  
  // Authentication / Xác thực
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'API-Key': 'your-api-key',
  
  // Caching / Bộ nhớ đệm
  'Cache-Control': 'no-cache',
  'If-None-Match': 'etag-value',
  'If-Modified-Since': 'Wed, 21 Oct 2015 07:28:00 GMT',
  
  // CORS
  'Origin': 'https://example.com',
  'Access-Control-Request-Method': 'POST',
  'Access-Control-Request-Headers': 'Content-Type',
  
  // Custom headers / Header tùy chỉnh
  'X-Request-ID': 'unique-id-123',
  'X-Client-Version': '1.0.0'
};
```

### Working with Headers / Làm Việc Với Header

```typescript
// Reading headers / Đọc header
async function readHeaders(url: string) {
  const response = await fetch(url);
  
  // Get single header / Lấy header đơn
  const contentType = response.headers.get('content-type');
  console.log('Content-Type:', contentType);
  
  // Check if header exists / Kiểm tra header tồn tại
  const hasAuth = response.headers.has('authorization');
  console.log('Has Authorization:', hasAuth);
  
  // Iterate all headers / Lặp tất cả header
  response.headers.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  
  // Convert to object / Chuyển đổi thành object
  const headersObj = Object.fromEntries(response.headers.entries());
  console.log(headersObj);
}

// Setting headers / Đặt header
async function setHeaders(url: string) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Bearer token');
  headers.set('X-Custom-Header', 'value'); // Overwrites if exists / Ghi đè nếu tồn tại
  
  const response = await fetch(url, { headers });
  return response.json();
}
```

---

## CORS / CORS

### Understanding CORS / Hiểu CORS

**English:** Cross-Origin Resource Sharing allows servers to specify who can access their resources.

**Tiếng Việt:** Chia Sẻ Tài Nguyên Nguồn Gốc Chéo cho phép server chỉ định ai có thể truy cập tài nguyên của họ.

```typescript
// Simple CORS request / Yêu cầu CORS đơn giản
async function simpleCORS() {
  const response = await fetch('https://api.example.com/data', {
    mode: 'cors' // Default / Mặc định
  });
  return response.json();
}

// Preflight request (for non-simple requests)
// Yêu cầu preflight (cho yêu cầu không đơn giản)
async function preflightCORS() {
  const response = await fetch('https://api.example.com/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'value' // Triggers preflight / Kích hoạt preflight
    },
    body: JSON.stringify({ data: 'example' })
  });
  return response.json();
}

// With credentials / Với thông tin xác thực
async function corsWithCredentials() {
  const response = await fetch('https://api.example.com/data', {
    mode: 'cors',
    credentials: 'include' // Send cookies / Gửi cookie
  });
  return response.json();
}
```

### CORS Headers / Header CORS

```typescript
// Server response headers / Header phản hồi server
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://example.com', // or '*'
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // Preflight cache time / Thời gian cache preflight
  'Access-Control-Expose-Headers': 'X-Custom-Header'
};
```

---

## Error Handling / Xử Lý Lỗi

### Comprehensive Error Handling / Xử Lý Lỗi Toàn Diện

```typescript
class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    // Handle HTTP errors / Xử lý lỗi HTTP
    if (!response.ok) {
      const errorBody = await response.text();
      throw new FetchError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      );
    }
    
    // Parse response / Phân tích phản hồi
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else {
      throw new FetchError('Expected JSON response');
    }
    
  } catch (error) {
    // Network errors / Lỗi mạng
    if (error instanceof TypeError) {
      throw new FetchError('Network error: ' + error.message);
    }
    
    // Abort errors / Lỗi hủy bỏ
    if (error instanceof Error && error.name === 'AbortError') {
      throw new FetchError('Request aborted');
    }
    
    throw error;
  }
}

// Usage with specific error handling / Sử dụng với xử lý lỗi cụ thể
async function handleSpecificErrors() {
  try {
    const data = await safeFetch('https://api.example.com/data');
    console.log(data);
  } catch (error) {
    if (error instanceof FetchError) {
      switch (error.status) {
        case 401:
          console.error('Unauthorized - please login');
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Rate limit exceeded - try again later');
          break;
        case 500:
          console.error('Server error - try again later');
          break;
        default:
          console.error('Request failed:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

---

## Advanced Patterns / Mẫu Nâng Cao

### Retry with Exponential Backoff / Thử Lại Với Backoff Mũ

```typescript
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        // Don't retry client errors / Không thử lại lỗi client
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        // Retry server errors / Thử lại lỗi server
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

### Request Caching / Bộ Nhớ Đệm Yêu Cầu

```typescript
class FetchCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl: number;

  constructor(ttlSeconds: number = 300) {
    this.ttl = ttlSeconds * 1000;
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const cacheKey = this.getCacheKey(url, options);
    const cached = this.cache.get(cacheKey);
    
    // Return cached if valid / Trả về cache nếu hợp lệ
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      console.log('Cache hit:', url);
      return cached.data;
    }
    
    // Fetch and cache / Lấy và cache
    console.log('Cache miss:', url);
    const response = await fetch(url, options);
    const data = await response.json();
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    return `${url}:${JSON.stringify(options || {})}`;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Usage / Sử dụng
const cache = new FetchCache(60); // 60 seconds TTL
const data1 = await cache.fetch('https://api.example.com/data');
const data2 = await cache.fetch('https://api.example.com/data'); // From cache
```

### Parallel Requests / Yêu Cầu Song Song

```typescript
// Fetch multiple resources in parallel / Lấy nhiều tài nguyên song song
async function fetchMultiple() {
  const [users, posts, comments] = await Promise.all([
    fetch('https://api.example.com/users').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/comments').then(r => r.json())
  ]);
  
  return { users, posts, comments };
}

// With error handling / Với xử lý lỗi
async function fetchMultipleSafe() {
  const results = await Promise.allSettled([
    fetch('https://api.example.com/users').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/comments').then(r => r.json())
  ]);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Request ${index} failed:`, result.reason);
      return null;
    }
  });
}
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Question 1: Fetch vs XMLHttpRequest?

**English Answer:**
- **Fetch**: Promise-based, cleaner API, no CORS by default
- **XMLHttpRequest**: Callback-based, more verbose, older
- **Use Fetch** for modern applications

**Tiếng Việt:**
- **Fetch**: Dựa trên Promise, API sạch hơn, không CORS mặc định
- **XMLHttpRequest**: Dựa trên callback, dài dòng hơn, cũ hơn
- **Dùng Fetch** cho ứng dụng hiện đại

### Question 2: How to handle CORS errors?

**English Answer:**
1. Server must set appropriate CORS headers
2. Use proxy server for development
3. Request credentials: 'include' for cookies
4. Preflight requests for non-simple requests

**Tiếng Việt:**
1. Server phải đặt header CORS phù hợp
2. Sử dụng proxy server cho phát triển
3. Yêu cầu credentials: 'include' cho cookie
4. Yêu cầu preflight cho yêu cầu không đơn giản

### Question 3: When to use different HTTP methods?

**English Answer:**
- **GET**: Retrieve data, idempotent, cacheable
- **POST**: Create resource, not idempotent
- **PUT**: Replace entire resource, idempotent
- **PATCH**: Partial update, not necessarily idempotent
- **DELETE**: Remove resource, idempotent

**Tiếng Việt:**
- **GET**: Lấy dữ liệu, idempotent, có thể cache
- **POST**: Tạo tài nguyên, không idempotent
- **PUT**: Thay thế toàn bộ tài nguyên, idempotent
- **PATCH**: Cập nhật một phần, không nhất thiết idempotent
- **DELETE**: Xóa tài nguyên, idempotent

---

## Key Takeaways / Điểm Chính

**English:**
1. Fetch API is Promise-based and modern
2. Always handle errors and check response.ok
3. Understand HTTP methods and status codes
4. CORS requires server configuration
5. Implement retry logic for resilience
6. Cache responses when appropriate

**Tiếng Việt:**
1. API Fetch dựa trên Promise và hiện đại
2. Luôn xử lý lỗi và kiểm tra response.ok
3. Hiểu phương thức HTTP và mã trạng thái
4. CORS yêu cầu cấu hình server
5. Triển khai logic thử lại cho khả năng phục hồi
6. Cache phản hồi khi phù hợp

---

[← Previous: Browser APIs](./01-browser-apis.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: WebSockets →](./03-websockets.md)
