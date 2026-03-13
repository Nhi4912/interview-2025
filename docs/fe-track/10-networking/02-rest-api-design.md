# REST API Design - RESTful Principles


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> REST là architectural style phổ biến nhất cho Web APIs. Hiểu principles để design và consume APIs hiệu quả.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    REST PRINCIPLES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. CLIENT-SERVER                                               │
│      Separation of concerns                                      │
│                                                                   │
│   2. STATELESS                                                   │
│      Each request contains all needed info                       │
│                                                                   │
│   3. CACHEABLE                                                   │
│      Responses must define cacheability                          │
│                                                                   │
│   4. UNIFORM INTERFACE                                           │
│      Consistent resource-based URLs                              │
│                                                                   │
│   5. LAYERED SYSTEM                                              │
│      Can have intermediaries (proxies, load balancers)          │
│                                                                   │
│   6. CODE ON DEMAND (optional)                                   │
│      Server can send executable code                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Resource Naming

### URL Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    REST URL PATTERNS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ✅ Good - Nouns, plural                                        │
│   GET    /users              │ List all users                    │
│   GET    /users/123          │ Get user 123                      │
│   POST   /users              │ Create new user                   │
│   PUT    /users/123          │ Replace user 123                  │
│   PATCH  /users/123          │ Update user 123                   │
│   DELETE /users/123          │ Delete user 123                   │
│                                                                   │
│   ❌ Bad - Verbs in URL                                          │
│   GET  /getUsers                                                 │
│   POST /createUser                                               │
│   POST /deleteUser/123                                           │
│                                                                   │
│   Nested Resources:                                              │
│   GET  /users/123/posts      │ Posts by user 123                │
│   GET  /users/123/posts/456  │ Post 456 by user 123             │
│   POST /users/123/posts      │ Create post for user 123         │
│                                                                   │
│   Query Parameters:                                              │
│   GET  /users?role=admin     │ Filter by role                   │
│   GET  /users?sort=name&order=asc                                │
│   GET  /users?page=2&limit=20                                    │
│   GET  /posts?author=123&status=published                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Naming Conventions

```javascript
// Use kebab-case for multi-word resources
GET /user-profiles
GET /order-items

// Use lowercase
GET /users (not /Users)

// Avoid trailing slashes
GET /users (not /users/)

// Avoid file extensions
GET /users/123 (not /users/123.json)

// Use query params for filtering/sorting
GET /products?category=electronics&sort=price

// Use path params for identification
GET /products/123
GET /users/john-doe

// Versioning
GET /api/v1/users
GET /api/v2/users
```

---

## 📋 CRUD Operations

### Complete Example

```javascript
// Resource: /api/v1/posts

// CREATE - POST /posts
async function createPost(post) {
    const response = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(post)
    });

    if (response.status === 201) {
        return response.json(); // Returns created post with id
    }
    throw new Error('Failed to create post');
}

// Response: 201 Created
// Location: /api/v1/posts/123
// Body: { id: 123, title: "...", ... }

// READ - GET /posts, GET /posts/:id
async function getPosts(params = {}) {
    const query = new URLSearchParams(params);
    const response = await fetch(`/api/v1/posts?${query}`);
    return response.json();
}

async function getPost(id) {
    const response = await fetch(`/api/v1/posts/${id}`);
    if (response.status === 404) {
        throw new Error('Post not found');
    }
    return response.json();
}

// UPDATE - PUT /posts/:id (replace) or PATCH /posts/:id (partial)
async function updatePost(id, updates) {
    const response = await fetch(`/api/v1/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    return response.json();
}

// DELETE - DELETE /posts/:id
async function deletePost(id) {
    const response = await fetch(`/api/v1/posts/${id}`, {
        method: 'DELETE'
    });

    if (response.status === 204) {
        return true; // No content
    }
    throw new Error('Failed to delete');
}
```

---

## 📊 Response Formats

### Success Responses

```javascript
// Single resource
{
    "id": 123,
    "title": "My Post",
    "content": "...",
    "author": {
        "id": 456,
        "name": "John"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
}

// Collection with pagination
{
    "data": [
        { "id": 1, "title": "Post 1" },
        { "id": 2, "title": "Post 2" }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "totalPages": 5
    },
    "links": {
        "self": "/posts?page=1",
        "next": "/posts?page=2",
        "last": "/posts?page=5"
    }
}

// Or use Link header for pagination
// Link: </posts?page=2>; rel="next", </posts?page=5>; rel="last"
```

### Error Responses

```javascript
// Standard error format
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "The request data is invalid",
        "details": [
            {
                "field": "email",
                "message": "Email is required"
            },
            {
                "field": "password",
                "message": "Password must be at least 8 characters"
            }
        ]
    },
    "requestId": "abc-123-def",
    "timestamp": "2024-01-15T10:30:00Z"
}

// Different error types
// 400 Bad Request
{
    "error": {
        "code": "INVALID_JSON",
        "message": "Request body is not valid JSON"
    }
}

// 401 Unauthorized
{
    "error": {
        "code": "UNAUTHORIZED",
        "message": "Authentication required"
    }
}

// 404 Not Found
{
    "error": {
        "code": "NOT_FOUND",
        "message": "Resource not found",
        "resource": "Post",
        "id": "123"
    }
}

// 429 Rate Limited
{
    "error": {
        "code": "RATE_LIMITED",
        "message": "Too many requests",
        "retryAfter": 60
    }
}
```

---

## 🔐 Authentication

### Token-Based Auth

```javascript
// JWT in Authorization header
fetch('/api/posts', {
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
    }
});

// API Key in header
fetch('/api/posts', {
    headers: {
        'X-API-Key': 'your-api-key'
    }
});

// API Key in query param (less secure)
fetch('/api/posts?api_key=your-api-key');

// Handling token refresh
async function fetchWithAuth(url, options = {}) {
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });

    if (response.status === 401) {
        // Try to refresh token
        await refreshAccessToken();

        // Retry request
        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${getAccessToken()}`
            }
        });
    }

    return response;
}
```

---

## 📄 Pagination, Filtering, Sorting

### Pagination Strategies

```javascript
// Offset-based (simple but slow for large datasets)
GET /posts?page=2&limit=20
GET /posts?offset=20&limit=20

// Cursor-based (better for real-time data)
GET /posts?cursor=abc123&limit=20
// Response includes next cursor
{
    "data": [...],
    "nextCursor": "def456",
    "hasMore": true
}

// Keyset pagination (efficient for large datasets)
GET /posts?after_id=100&limit=20
```

### Filtering

```javascript
// Simple equality
GET /posts?status=published&author=123

// Operators
GET /posts?created_at[gte]=2024-01-01
GET /posts?price[lt]=100
GET /posts?title[contains]=javascript

// Multiple values
GET /posts?status[in]=draft,review
GET /posts?tags=javascript,react

// Complex filters (JSON)
GET /posts?filter={"status":"published","author.role":"admin"}
```

### Sorting

```javascript
// Simple sort
GET /posts?sort=created_at
GET /posts?sort=-created_at  // Descending (prefix -)

// Multiple fields
GET /posts?sort=author,-created_at

// Explicit direction
GET /posts?sort_by=created_at&order=desc
GET /posts?sort=created_at:desc,title:asc
```

---

## 🔄 API Versioning

### Strategies

```javascript
// 1. URL Path versioning (most common)
GET /api/v1/users
GET /api/v2/users

// 2. Query parameter
GET /api/users?version=1
GET /api/users?v=2

// 3. Header versioning
GET /api/users
Accept: application/vnd.api+json;version=1
// or
X-API-Version: 2

// 4. Content negotiation
Accept: application/vnd.company.api.v1+json
```

### Version Handling

```javascript
// Client library with version
class APIClient {
    constructor(version = 'v1') {
        this.baseURL = `https://api.example.com/${version}`;
    }

    async get(path) {
        return fetch(`${this.baseURL}${path}`);
    }
}

const apiV1 = new APIClient('v1');
const apiV2 = new APIClient('v2');
```

---

## 🏗️ Best Practices

### API Design Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    REST BEST PRACTICES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   NAMING                                                          │
│   □ Use plural nouns for resources                               │
│   □ Use kebab-case for multi-word                                │
│   □ Keep URLs lowercase                                          │
│   □ No trailing slashes                                          │
│                                                                   │
│   HTTP METHODS                                                    │
│   □ GET for reading (safe, idempotent)                          │
│   □ POST for creating                                            │
│   □ PUT for full updates (idempotent)                           │
│   □ PATCH for partial updates                                    │
│   □ DELETE for removing (idempotent)                            │
│                                                                   │
│   RESPONSES                                                       │
│   □ Use correct status codes                                     │
│   □ Return created resource on POST                              │
│   □ Consistent error format                                      │
│   □ Include pagination metadata                                  │
│                                                                   │
│   SECURITY                                                        │
│   □ Use HTTPS                                                     │
│   □ Authenticate all requests                                    │
│   □ Validate input                                               │
│   □ Rate limit endpoints                                         │
│                                                                   │
│   DOCUMENTATION                                                   │
│   □ OpenAPI/Swagger spec                                         │
│   □ Example requests/responses                                   │
│   □ Error code documentation                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: REST là gì?**

A: Representational State Transfer - architectural style for web services. Uses HTTP methods, stateless, resource-based URLs, standard status codes.

**Q: Tại sao dùng plural nouns?**

A: Consistency. `/users/123` means "user 123 from users collection". Easier to understand và predict URL patterns.

### 🟡 Mid-level

**Q: Offset vs Cursor pagination?**

A:
- Offset: Simple, can skip to any page, slow for large datasets, inconsistent with real-time data
- Cursor: Faster for large data, consistent with inserts/deletes, can't skip pages

**Q: Design API for e-commerce**

A:
```
/products                 - List/Create products
/products/:id            - Get/Update/Delete product
/products/:id/reviews    - Product reviews
/carts/:id               - User cart
/carts/:id/items         - Cart items
/orders                  - List/Create orders
/orders/:id              - Order details
```

### 🔴 Senior

**Q: API versioning strategy?**

A: URL path versioning (e.g., /api/v1/) is most practical:
- Clear and explicit
- Easy to route
- Works with all clients
- Easy to deprecate

Header versioning is cleaner but harder to test/debug.

---

## 📚 Active Recall

1. [ ] 6 REST constraints
2. [ ] CRUD to HTTP methods mapping
3. [ ] Pagination strategies (3 types)
4. [ ] API versioning approaches
5. [ ] Error response format

---

> **Tiếp theo:** [03-graphql-basics.md](./03-graphql-basics.md) - GraphQL Basics
