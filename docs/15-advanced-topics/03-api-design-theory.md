# API Design Theory - Comprehensive Guide
## Understanding API Architecture and Best Practices

**English:** API (Application Programming Interface) design encompasses the principles, patterns, and practices for creating interfaces that enable software components to communicate effectively.

**Tiếng Việt:** Thiết kế API (Giao diện Lập trình Ứng dụng) bao gồm các nguyên tắc, mẫu và thực hành để tạo giao diện cho phép các thành phần phần mềm giao tiếp hiệu quả.

## Table of Contents
1. [API Fundamentals](#api-fundamentals)
2. [REST Architecture](#rest-architecture)
3. [GraphQL](#graphql)
4. [gRPC](#grpc)
5. [API Versioning](#api-versioning)
6. [Authentication & Authorization](#authentication--authorization)
7. [Rate Limiting](#rate-limiting)
8. [Error Handling](#error-handling)
9. [Documentation](#documentation)
10. [Best Practices](#best-practices)

## API Fundamentals

### What is an API?

**Definition:** Contract between software components defining how they interact

**Types:**
- **Web APIs:** HTTP-based (REST, GraphQL, SOAP)
- **Library APIs:** Programming language interfaces
- **Operating System APIs:** System calls
- **Hardware APIs:** Device drivers


### API Design Principles

**Consistency:**
- Uniform naming conventions
- Predictable behavior
- Standard patterns across endpoints

**Simplicity:**
- Easy to understand
- Minimal learning curve
- Clear purpose

**Flexibility:**
- Support various use cases
- Extensible without breaking changes
- Backward compatible

**Efficiency:**
- Minimize network requests
- Optimize payload size
- Support caching

**Security:**
- Authentication and authorization
- Input validation
- Rate limiting
- HTTPS only

## REST Architecture

### REST Principles

**RE**presentational **S**tate **T**ransfer

**Six Constraints:**

**1. Client-Server:**
```
Separation of concerns
Client handles UI
Server handles data/logic
Independent evolution
```

**2. Stateless:**
```
Each request contains all information needed
Server doesn't store client state
Session state kept on client
Improves scalability
```

**3. Cacheable:**
```
Responses must define if cacheable
Reduces client-server interactions
Improves performance
```

**4. Uniform Interface:**
```
Resource identification (URIs)
Resource manipulation through representations
Self-descriptive messages
HATEOAS (Hypermedia)
```

**5. Layered System:**
```
Client can't tell if connected to end server
Intermediaries (proxies, gateways) allowed
Improves scalability
```

**6. Code on Demand (Optional):**
```
Server can extend client functionality
JavaScript, applets
Rarely used
```

### Resource Design

**Resource Naming:**
```
Good:
GET /users
GET /users/123
GET /users/123/orders
POST /users
PUT /users/123
DELETE /users/123

Bad:
GET /getUsers
GET /user_list
POST /createUser
GET /deleteUser/123
```

**URI Structure:**
```
Collection: /resources
Document: /resources/{id}
Nested: /resources/{id}/sub-resources
```

**Naming Conventions:**
```
✅ Use nouns, not verbs
✅ Use plural for collections
✅ Use lowercase
✅ Use hyphens for multi-word
✅ Keep URLs short and intuitive

❌ Don't use verbs in URLs
❌ Don't use underscores
❌ Don't use file extensions
❌ Don't expose implementation details
```

### HTTP Methods

**GET - Retrieve Resource:**
```http
GET /api/users/123
Response: 200 OK
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}

Properties:
- Safe (no side effects)
- Idempotent
- Cacheable
```

**POST - Create Resource:**
```http
POST /api/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response: 201 Created
Location: /api/users/124
{
  "id": 124,
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Properties:
- Not safe
- Not idempotent
- Not cacheable
```

**PUT - Update/Replace Resource:**
```http
PUT /api/users/123
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}

Response: 200 OK
{
  "id": 123,
  "name": "John Smith",
  "email": "john.smith@example.com"
}

Properties:
- Not safe
- Idempotent
- Complete replacement
```

**PATCH - Partial Update:**
```http
PATCH /api/users/123
Content-Type: application/json

{
  "email": "newemail@example.com"
}

Response: 200 OK
{
  "id": 123,
  "name": "John Doe",
  "email": "newemail@example.com"
}

Properties:
- Not safe
- Not necessarily idempotent
- Partial update
```

**DELETE - Remove Resource:**
```http
DELETE /api/users/123

Response: 204 No Content

Properties:
- Not safe
- Idempotent
- No response body typically
```

### Status Codes

**2xx Success:**
```
200 OK - Request succeeded
201 Created - Resource created
202 Accepted - Async processing started
204 No Content - Success, no body
```

**3xx Redirection:**
```
301 Moved Permanently - Resource moved
302 Found - Temporary redirect
304 Not Modified - Cached version valid
```

**4xx Client Errors:**
```
400 Bad Request - Invalid syntax
401 Unauthorized - Authentication required
403 Forbidden - No permission
404 Not Found - Resource doesn't exist
405 Method Not Allowed - Wrong HTTP method
409 Conflict - Resource conflict
422 Unprocessable Entity - Validation failed
429 Too Many Requests - Rate limit exceeded
```

**5xx Server Errors:**
```
500 Internal Server Error - Server error
502 Bad Gateway - Invalid upstream response
503 Service Unavailable - Temporary unavailable
504 Gateway Timeout - Upstream timeout
```

### Filtering, Sorting, Pagination

**Filtering:**
```http
GET /api/users?status=active
GET /api/users?role=admin&status=active
GET /api/products?price_min=10&price_max=100
GET /api/posts?created_after=2024-01-01
```

**Sorting:**
```http
GET /api/users?sort=name
GET /api/users?sort=-created_at  (descending)
GET /api/users?sort=name,-created_at  (multiple)
```

**Pagination:**
```http
Offset-based:
GET /api/users?limit=20&offset=40

Cursor-based:
GET /api/users?limit=20&cursor=eyJpZCI6MTIzfQ

Response:
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "limit": 20,
    "offset": 40,
    "next": "/api/users?limit=20&offset=60",
    "prev": "/api/users?limit=20&offset=20"
  }
}
```

**Field Selection:**
```http
GET /api/users?fields=id,name,email
GET /api/users/123?fields=name,email,profile.avatar
```

### HATEOAS

**Hypermedia As The Engine Of Application State**

**Example:**
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "_links": {
    "self": {
      "href": "/api/users/123"
    },
    "orders": {
      "href": "/api/users/123/orders"
    },
    "edit": {
      "href": "/api/users/123",
      "method": "PUT"
    },
    "delete": {
      "href": "/api/users/123",
      "method": "DELETE"
    }
  }
}
```

## GraphQL

### Core Concepts

**Schema Definition:**
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}

type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User!]!
  post(id: ID!): Post
  posts(authorId: ID): [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String, email: String): User!
  deleteUser(id: ID!): Boolean!
  createPost(title: String!, content: String!, authorId: ID!): Post!
}

type Subscription {
  postCreated: Post!
  commentAdded(postId: ID!): Comment!
}
```

### Queries

**Basic Query:**
```graphql
query {
  user(id: "123") {
    id
    name
    email
  }
}

Response:
{
  "data": {
    "user": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Nested Query:**
```graphql
query {
  user(id: "123") {
    name
    posts {
      title
      comments {
        text
        author {
          name
        }
      }
    }
  }
}
```

**Query with Variables:**
```graphql
query GetUser($userId: ID!) {
  user(id: $userId) {
    name
    email
  }
}

Variables:
{
  "userId": "123"
}
```

**Fragments:**
```graphql
fragment UserFields on User {
  id
  name
  email
}

query {
  user1: user(id: "123") {
    ...UserFields
  }
  user2: user(id: "456") {
    ...UserFields
  }
}
```

### Mutations

**Create:**
```graphql
mutation {
  createUser(name: "Jane Doe", email: "jane@example.com") {
    id
    name
    email
  }
}
```

**Update:**
```graphql
mutation {
  updateUser(id: "123", name: "John Smith") {
    id
    name
    email
  }
}
```

**Delete:**
```graphql
mutation {
  deleteUser(id: "123")
}
```

### Subscriptions

**Real-time Updates:**
```graphql
subscription {
  postCreated {
    id
    title
    author {
      name
    }
  }
}
```

### Advantages

**Precise Data Fetching:**
```
REST: Multiple endpoints, over-fetching
GET /users/123
GET /users/123/posts
GET /posts/456/comments

GraphQL: Single request, exact data
query {
  user(id: "123") {
    name
    posts {
      title
      comments {
        text
      }
    }
  }
}
```

**Strong Typing:**
```
Schema defines all types
Automatic validation
Better tooling (autocomplete, type checking)
Self-documenting
```

**Versioning Not Needed:**
```
Add new fields without breaking changes
Deprecate old fields gradually
Clients request only what they need
```

### Disadvantages

**Complexity:**
```
More complex than REST
Requires GraphQL server
Learning curve
```

**Caching:**
```
HTTP caching harder
Need specialized caching (DataLoader)
Can't use CDN easily
```

**Query Complexity:**
```
Malicious deep queries
Need query depth limiting
Need query complexity analysis
```

## gRPC

### Protocol Buffers

**Definition (.proto file):**
```protobuf
syntax = "proto3";

package user;

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser (CreateUserRequest) returns (User);
  rpc UpdateUser (UpdateUserRequest) returns (User);
  rpc DeleteUser (DeleteUserRequest) returns (DeleteUserResponse);
  rpc StreamUsers (StreamUsersRequest) returns (stream User);
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int64 created_at = 4;
}

message GetUserRequest {
  int32 id = 1;
}

message ListUsersRequest {
  int32 limit = 1;
  int32 offset = 2;
}

message ListUsersResponse {
  repeated User users = 1;
  int32 total = 2;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message UpdateUserRequest {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

message DeleteUserRequest {
  int32 id = 1;
}

message DeleteUserResponse {
  bool success = 1;
}

message StreamUsersRequest {
  int32 batch_size = 1;
}
```

### Communication Patterns

**Unary RPC:**
```
Client sends single request
Server sends single response
Like REST API call
```

**Server Streaming:**
```
Client sends single request
Server sends stream of responses
Good for large datasets
```

**Client Streaming:**
```
Client sends stream of requests
Server sends single response
Good for uploads
```

**Bidirectional Streaming:**
```
Client and server send streams
Independent read/write
Good for chat, real-time
```

### Advantages

**Performance:**
```
Binary protocol (smaller, faster)
HTTP/2 (multiplexing, compression)
Efficient serialization
```

**Strong Typing:**
```
Protocol Buffers schema
Code generation
Type safety
```

**Streaming:**
```
Built-in streaming support
Bidirectional communication
Real-time capabilities
```

**Language Agnostic:**
```
Generate code for many languages
Consistent across platforms
```

### Disadvantages

**Browser Support:**
```
Limited browser support
Requires gRPC-Web proxy
Not as universal as REST
```

**Human Readability:**
```
Binary format
Can't inspect with curl
Need special tools
```

**Learning Curve:**
```
More complex than REST
Protocol Buffers syntax
gRPC concepts
```

## API Versioning

### URL Versioning

```http
GET /api/v1/users
GET /api/v2/users

Pros:
- Clear and explicit
- Easy to route
- Easy to deprecate old versions

Cons:
- URL changes
- Multiple codebases
```

### Header Versioning

```http
GET /api/users
Accept: application/vnd.myapi.v1+json

Pros:
- Clean URLs
- Same endpoint
- Content negotiation

Cons:
- Less visible
- Harder to test
- Caching complexity
```

### Query Parameter Versioning

```http
GET /api/users?version=1
GET /api/users?v=2

Pros:
- Simple
- Easy to test
- Optional parameter

Cons:
- Pollutes query string
- Easy to forget
- Not RESTful
```

### Content Negotiation

```http
GET /api/users
Accept: application/vnd.myapi+json;version=1

Pros:
- RESTful
- Flexible
- Multiple versions per resource

Cons:
- Complex
- Harder to implement
- Less common
```

### Best Practices

**Semantic Versioning:**
```
v1.0.0 - Major.Minor.Patch

Major: Breaking changes
Minor: New features, backward compatible
Patch: Bug fixes, backward compatible
```

**Deprecation Strategy:**
```
1. Announce deprecation
2. Set sunset date
3. Provide migration guide
4. Support old version during transition
5. Remove old version after sunset
```

**Version Support:**
```
Support N-1 or N-2 versions
Clear deprecation timeline
Gradual migration path
```

## Authentication & Authorization

### Authentication Methods

**API Keys:**
```http
GET /api/users
X-API-Key: abc123def456

Pros:
- Simple
- Easy to implement
- Good for server-to-server

Cons:
- No user context
- Hard to revoke
- Security risk if leaked
```

**Bearer Tokens (JWT):**
```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

JWT Structure:
Header.Payload.Signature

{
  "alg": "HS256",
  "typ": "JWT"
}
.
{
  "sub": "123",
  "name": "John Doe",
  "exp": 1735689600
}
.
HMACSHA256(base64(header) + "." + base64(payload), secret)

Pros:
- Stateless
- Contains user info
- Widely supported

Cons:
- Can't revoke easily
- Size overhead
- Need to handle expiration
```

**OAuth 2.0:**
```
Authorization Code Flow:
1. Client redirects to authorization server
2. User authenticates and authorizes
3. Server returns authorization code
4. Client exchanges code for access token
5. Client uses access token for API calls

Pros:
- Industry standard
- Delegated authorization
- Refresh tokens
- Granular scopes

Cons:
- Complex
- Multiple flows
- Requires OAuth server
```

**Basic Authentication:**
```http
GET /api/users
Authorization: Basic dXNlcjpwYXNz

Base64(username:password)

Pros:
- Simple
- Built into HTTP

Cons:
- Credentials in every request
- Must use HTTPS
- No logout mechanism
```

### Authorization Patterns

**Role-Based Access Control (RBAC):**
```javascript
const roles = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read']
};

function authorize(user, action) {
  return roles[user.role]?.includes(action);
}
```

**Attribute-Based Access Control (ABAC):**
```javascript
function authorize(user, resource, action) {
  // Check multiple attributes
  if (action === 'delete') {
    return user.role === 'admin' || 
           resource.ownerId === user.id;
  }
  
  if (action === 'read') {
    return resource.visibility === 'public' ||
           resource.ownerId === user.id ||
           user.role === 'admin';
  }
  
  return false;
}
```

**Permission-Based:**
```javascript
const permissions = {
  'users:read': ['admin', 'editor', 'viewer'],
  'users:write': ['admin', 'editor'],
  'users:delete': ['admin']
};

function hasPermission(user, permission) {
  return permissions[permission]?.includes(user.role);
}
```

## Rate Limiting

### Strategies

**Fixed Window:**
```
100 requests per hour
Window: 00:00-01:00, 01:00-02:00, etc.

Problem: Burst at window boundaries
00:59: 100 requests
01:00: 100 requests (200 in 2 minutes)
```

**Sliding Window:**
```
100 requests per hour
Window slides with each request
More accurate than fixed window
```

**Token Bucket:**
```
Bucket holds N tokens
Tokens added at rate R
Request consumes 1 token
If no tokens, request rejected

Allows bursts up to bucket size
Smooth rate limiting
```

**Leaky Bucket:**
```
Requests added to queue
Processed at fixed rate
Queue has maximum size
Excess requests rejected

Smooths traffic
No bursts allowed
```

### Implementation

**Headers:**
```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 75
X-RateLimit-Reset: 1735689600

HTTP/1.1 429 Too Many Requests
Retry-After: 3600
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1735689600
```

**Example:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

## Error Handling

### Error Response Format

**Standard Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "age",
        "message": "Must be at least 18"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/users",
    "requestId": "abc-123-def"
  }
}
```

### Error Codes

**Application-Specific:**
```
USER_NOT_FOUND
INVALID_CREDENTIALS
INSUFFICIENT_PERMISSIONS
RESOURCE_CONFLICT
VALIDATION_ERROR
RATE_LIMIT_EXCEEDED
SERVICE_UNAVAILABLE
```

### Best Practices

**Consistent Format:**
```javascript
class APIError extends Error {
  constructor(code, message, statusCode, details = []) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
  
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Usage
throw new APIError(
  'VALIDATION_ERROR',
  'Invalid input data',
  400,
  [{ field: 'email', message: 'Invalid format' }]
);
```

**Don't Expose Internals:**
```javascript
// BAD
{
  "error": "MongoError: E11000 duplicate key error collection..."
}

// GOOD
{
  "error": {
    "code": "DUPLICATE_RESOURCE",
    "message": "A user with this email already exists"
  }
}
```

## Documentation

### OpenAPI/Swagger

**Specification:**
```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
  description: API for managing users

servers:
  - url: https://api.example.com/v1

paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
    
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
          format: email
        createdAt:
          type: string
          format: date-time
    
    CreateUserRequest:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
        email:
          type: string
          format: email
    
    Pagination:
      type: object
      properties:
        total:
          type: integer
        limit:
          type: integer
        offset:
          type: integer

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - bearerAuth: []
```

## Best Practices

### Design Principles

**1. Use Nouns for Resources:**
```
✅ /users
✅ /products
✅ /orders

❌ /getUsers
❌ /createProduct
❌ /deleteOrder
```

**2. Use HTTP Methods Correctly:**
```
✅ GET /users (retrieve)
✅ POST /users (create)
✅ PUT /users/123 (update)
✅ DELETE /users/123 (delete)

❌ GET /users/delete/123
❌ POST /users/get
```

**3. Use Proper Status Codes:**
```
✅ 200 for successful GET
✅ 201 for successful POST
✅ 204 for successful DELETE
✅ 400 for client errors
✅ 500 for server errors

❌ Always returning 200
❌ Using wrong codes
```

**4. Version Your API:**
```
✅ /api/v1/users
✅ /api/v2/users

❌ /api/users (no version)
```

**5. Use HTTPS:**
```
✅ https://api.example.com
❌ http://api.example.com
```

**6. Implement Rate Limiting:**
```
Protect against abuse
Fair resource allocation
Prevent DoS attacks
```

**7. Provide Good Documentation:**
```
Clear examples
All endpoints documented
Authentication explained
Error codes listed
```

**8. Handle Errors Gracefully:**
```
Consistent error format
Helpful error messages
Don't expose internals
Include error codes
```

**9. Use Pagination:**
```
Don't return all data
Limit default page size
Provide navigation links
Include total count
```

**10. Support Filtering and Sorting:**
```
Allow clients to filter
Support multiple sort fields
Use query parameters
Document available options
```

## Interview Questions

**Q: What's the difference between REST and GraphQL?**

A: REST uses multiple endpoints with fixed responses (may over-fetch or under-fetch data). GraphQL uses single endpoint where clients specify exact data needed. REST is simpler and cacheable, GraphQL is more flexible but complex. REST better for simple APIs, GraphQL better for complex data requirements.

**Q: Explain idempotency in APIs.**

A: Idempotent operations produce same result when called multiple times. GET, PUT, DELETE are idempotent - calling them repeatedly has same effect as calling once. POST is not idempotent - creates new resource each time. Important for retry logic and reliability.

**Q: How do you version an API?**

A: Common approaches: URL versioning (/v1/users), header versioning (Accept: application/vnd.api.v1+json), query parameters (?version=1). URL versioning is most common and explicit. Use semantic versioning, support multiple versions during transition, provide deprecation timeline.

**Q: What's the difference between authentication and authorization?**

A: Authentication verifies identity (who you are) - login with username/password, JWT token. Authorization determines permissions (what you can do) - RBAC, ABAC, permissions. Authentication comes first, then authorization checks if authenticated user can perform action.

**Q: Explain rate limiting strategies.**

A: Fixed window (simple but allows bursts), sliding window (more accurate), token bucket (allows controlled bursts), leaky bucket (smooth rate). Token bucket most common - bucket holds tokens, requests consume tokens, tokens refill at fixed rate. Prevents abuse and ensures fair usage.

---

[← Back to Cryptography](./02-cryptography-theory.md) | [Next: State Machines →](./04-state-machines-theory.md)
