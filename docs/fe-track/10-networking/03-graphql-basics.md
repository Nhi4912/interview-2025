# GraphQL Basics - Query Language for APIs


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> GraphQL là alternative to REST. Hiểu khi nào dùng GraphQL và trade-offs so với REST.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    GRAPHQL vs REST                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   REST                              GRAPHQL                      │
│   ┌─────────────────────┐          ┌─────────────────────┐      │
│   │ Multiple endpoints  │          │ Single endpoint     │      │
│   │ /users              │          │ /graphql            │      │
│   │ /users/123          │          │                     │      │
│   │ /users/123/posts    │          │ { query }           │      │
│   └─────────────────────┘          └─────────────────────┘      │
│                                                                   │
│   Over-fetching                    Client specifies data        │
│   GET /users returns               query { user { name } }      │
│   all fields                       returns only name            │
│                                                                   │
│   Under-fetching                   Single request               │
│   Multiple requests                query { user { posts } }     │
│   for related data                 returns user with posts      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Queries

### Basic Query

```graphql
# Query syntax
query GetUser {
    user(id: "123") {
        id
        name
        email
        avatar
    }
}

# Response
{
    "data": {
        "user": {
            "id": "123",
            "name": "John Doe",
            "email": "john@example.com",
            "avatar": "https://..."
        }
    }
}
```

### Nested Queries

```graphql
query GetUserWithPosts {
    user(id: "123") {
        name
        email
        posts {
            id
            title
            createdAt
            comments {
                id
                text
                author {
                    name
                }
            }
        }
    }
}
```

### Variables

```graphql
# Query with variables
query GetUser($userId: ID!) {
    user(id: $userId) {
        name
        email
    }
}

# Variables (separate JSON)
{
    "userId": "123"
}
```

### Fragments

```graphql
# Reusable field selections
fragment UserFields on User {
    id
    name
    email
    avatar
}

query GetUsers {
    users {
        ...UserFields
    }

    currentUser {
        ...UserFields
        isAdmin
    }
}
```

---

## ✏️ Mutations

### Basic Mutation

```graphql
mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
        id
        title
        content
        author {
            name
        }
    }
}

# Variables
{
    "input": {
        "title": "My New Post",
        "content": "Hello World!"
    }
}
```

### Multiple Mutations

```graphql
mutation UpdateUserAndPost($userId: ID!, $postId: ID!, $userData: UserInput!, $postData: PostInput!) {
    updateUser(id: $userId, input: $userData) {
        id
        name
    }

    updatePost(id: $postId, input: $postData) {
        id
        title
    }
}
```

---

## 📡 Subscriptions

### Real-time Updates

```graphql
subscription OnNewMessage($roomId: ID!) {
    messageAdded(roomId: $roomId) {
        id
        text
        createdAt
        author {
            name
            avatar
        }
    }
}
```

### Client Implementation

```javascript
// With Apollo Client
import { gql, useSubscription } from '@apollo/client';

const MESSAGE_SUBSCRIPTION = gql`
    subscription OnNewMessage($roomId: ID!) {
        messageAdded(roomId: $roomId) {
            id
            text
            author { name }
        }
    }
`;

function MessageList({ roomId }) {
    const { data, loading } = useSubscription(MESSAGE_SUBSCRIPTION, {
        variables: { roomId }
    });

    // data.messageAdded updates in real-time
}
```

---

## 🔧 Schema Definition

### Type Definitions

```graphql
# Scalar types: String, Int, Float, Boolean, ID

type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    createdAt: DateTime!
}

type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
}

# Input types for mutations
input CreatePostInput {
    title: String!
    content: String!
    published: Boolean = false
}

# Enums
enum PostStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
}

# Interfaces
interface Node {
    id: ID!
}

type User implements Node {
    id: ID!
    name: String!
}

# Union types
union SearchResult = User | Post | Comment

# Query and Mutation types
type Query {
    user(id: ID!): User
    users(limit: Int, offset: Int): [User!]!
    post(id: ID!): Post
    search(query: String!): [SearchResult!]!
}

type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post
    deletePost(id: ID!): Boolean!
}

type Subscription {
    postAdded: Post!
    messageAdded(roomId: ID!): Message!
}
```

---

## 🛠️ Client Libraries

### Apollo Client (React)

```javascript
// Setup
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://api.example.com/graphql',
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <MyApp />
        </ApolloProvider>
    );
}

// Query hook
import { useQuery, gql } from '@apollo/client';

const GET_USER = gql`
    query GetUser($id: ID!) {
        user(id: $id) {
            name
            email
        }
    }
`;

function UserProfile({ userId }) {
    const { loading, error, data, refetch } = useQuery(GET_USER, {
        variables: { id: userId }
    });

    if (loading) return <Loading />;
    if (error) return <Error message={error.message} />;

    return <Profile user={data.user} />;
}

// Mutation hook
import { useMutation, gql } from '@apollo/client';

const CREATE_POST = gql`
    mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
            id
            title
        }
    }
`;

function CreatePost() {
    const [createPost, { loading, error }] = useMutation(CREATE_POST, {
        refetchQueries: ['GetPosts'], // Refresh posts list
        onCompleted: (data) => {
            console.log('Created:', data.createPost);
        }
    });

    const handleSubmit = (formData) => {
        createPost({
            variables: { input: formData }
        });
    };
}
```

### Fetch API (No Library)

```javascript
async function graphqlFetch(query, variables = {}) {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query, variables })
    });

    const result = await response.json();

    if (result.errors) {
        throw new GraphQLError(result.errors);
    }

    return result.data;
}

// Usage
const data = await graphqlFetch(`
    query GetUser($id: ID!) {
        user(id: $id) {
            name
            email
        }
    }
`, { id: '123' });
```

---

## ⚖️ GraphQL vs REST

### Comparison

| Aspect | REST | GraphQL |
|--------|------|---------|
| Endpoints | Multiple | Single |
| Data fetching | Fixed structure | Client specifies |
| Over-fetching | Common | Eliminated |
| Under-fetching | Common | Eliminated |
| Versioning | URL/Header | Evolve schema |
| Caching | HTTP caching | Complex |
| File upload | Native | Requires spec |
| Learning curve | Lower | Higher |

### When to Use GraphQL

```
✅ Use GraphQL when:
• Complex data requirements
• Multiple clients (web, mobile) with different needs
• Rapid frontend iteration
• Real-time features needed
• Aggregating multiple services

✅ Use REST when:
• Simple CRUD operations
• Heavy caching requirements
• File uploads/downloads
• Strict HTTP semantics needed
• Team unfamiliar with GraphQL
```

---

## 🔒 Error Handling

### GraphQL Errors

```javascript
// Response with errors
{
    "data": {
        "user": null
    },
    "errors": [
        {
            "message": "User not found",
            "locations": [{ "line": 2, "column": 3 }],
            "path": ["user"],
            "extensions": {
                "code": "NOT_FOUND",
                "statusCode": 404
            }
        }
    ]
}

// Partial data with errors
{
    "data": {
        "user": {
            "name": "John",
            "posts": null  // Failed to fetch
        }
    },
    "errors": [
        {
            "message": "Could not fetch posts",
            "path": ["user", "posts"]
        }
    ]
}
```

### Client Error Handling

```javascript
const { data, error, loading } = useQuery(GET_DATA);

if (error) {
    // Check for specific errors
    const notFound = error.graphQLErrors?.find(
        e => e.extensions?.code === 'NOT_FOUND'
    );

    if (notFound) {
        return <NotFound />;
    }

    // Network error
    if (error.networkError) {
        return <NetworkError />;
    }

    return <GenericError />;
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: GraphQL là gì?**

A: Query language for APIs. Client specifies exactly what data it needs. Single endpoint, reduces over/under-fetching.

**Q: Query vs Mutation vs Subscription?**

A:
- Query: Read data (like GET)
- Mutation: Modify data (like POST/PUT/DELETE)
- Subscription: Real-time updates (WebSocket)

### 🟡 Mid-level

**Q: GraphQL caching challenges?**

A: HTTP caching không work vì single endpoint và POST requests. Need client-side caching (Apollo Cache). Normalized cache maps by ID. Cache invalidation phức tạp hơn REST.

**Q: N+1 problem trong GraphQL?**

A: Nested query có thể gây N+1 database queries. Solution: DataLoader để batch và cache database calls.

### 🔴 Senior

**Q: Design GraphQL schema for social network**

A:
```graphql
type User {
    id: ID!
    name: String!
    friends: [User!]!
    posts(first: Int, after: String): PostConnection!
}

type Post {
    id: ID!
    content: String!
    author: User!
    likes: Int!
    comments: CommentConnection!
}

# Pagination with Connections (Relay spec)
type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
}
```

---

## 📚 Active Recall

1. [ ] GraphQL 3 operation types
2. [ ] Fragment syntax
3. [ ] Apollo Client hooks
4. [ ] GraphQL vs REST trade-offs
5. [ ] N+1 problem solution

---

> **Tiếp theo:** [04-websockets-realtime.md](./04-websockets-realtime.md) - WebSockets & Real-time
