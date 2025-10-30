# GraphQL Advanced Theory
## Mastering Modern API Query Language

**English:** GraphQL is a query language for APIs and a runtime for executing those queries, providing a complete and understandable description of data, giving clients the power to ask for exactly what they need.

**Tiếng Việt:** GraphQL là ngôn ngữ truy vấn cho API và runtime để thực thi các truy vấn đó, cung cấp mô tả đầy đủ và dễ hiểu về dữ liệu, cho phép client yêu cầu chính xác những gì họ cần.

## Table of Contents
1. [GraphQL Fundamentals](#graphql-fundamentals)
2. [Schema Design](#schema-design)
3. [Resolvers](#resolvers)
4. [Data Loading](#data-loading)
5. [Subscriptions](#subscriptions)
6. [Error Handling](#error-handling)
7. [Security](#security)
8. [Performance](#performance)
9. [Testing](#testing)
10. [Best Practices](#best-practices)

## GraphQL Fundamentals

### Core Concepts

**Schema Definition Language (SDL):**
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
  published: Boolean!
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
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  createPost(input: CreatePostInput!): Post!
}

type Subscription {
  postCreated: Post!
  commentAdded(postId: ID!): Comment!
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  name: String
  email: String
}

input CreatePostInput {
  title: String!
  content: String!
  authorId: ID!
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

# Response
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

# Variables
{
  "userId": "123"
}
```

**Aliases:**
```graphql
query {
  user1: user(id: "123") {
    name
  }
  user2: user(id: "456") {
    name
  }
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
  createUser(input: {
    name: "Jane Doe"
    email: "jane@example.com"
    password: "secret123"
  }) {
    id
    name
    email
  }
}
```

**Update:**
```graphql
mutation {
  updateUser(
    id: "123"
    input: {
      name: "John Smith"
    }
  ) {
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

## Schema Design

### Scalar Types

**Built-in Scalars:**
```graphql
Int      # 32-bit integer
Float    # Double-precision floating-point
String   # UTF-8 character sequence
Boolean  # true or false
ID       # Unique identifier
```

**Custom Scalars:**
```javascript
const { GraphQLScalarType } = require('graphql');

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date and time as ISO 8601 string',
  
  serialize(value) {
    return value.toISOString();
  },
  
  parseValue(value) {
    return new Date(value);
  },
  
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
});

const EmailScalar = new GraphQLScalarType({
  name: 'Email',
  description: 'Email address',
  
  serialize(value) {
    return value;
  },
  
  parseValue(value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error('Invalid email format');
    }
    return value;
  }
});
```

### Object Types

**Type Definition:**
```graphql
type User {
  id: ID!
  name: String!
  email: Email!
  age: Int
  posts: [Post!]!
  friends: [User!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  tags: [String!]!
  publishedAt: DateTime
}
```

### Interfaces

**Definition:**
```graphql
interface Node {
  id: ID!
}

interface Timestamped {
  createdAt: DateTime!
  updatedAt: DateTime!
}

type User implements Node & Timestamped {
  id: ID!
  name: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Post implements Node & Timestamped {
  id: ID!
  title: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  node(id: ID!): Node
}
```

### Unions

**Definition:**
```graphql
union SearchResult = User | Post | Comment

type Query {
  search(query: String!): [SearchResult!]!
}

# Query
query {
  search(query: "graphql") {
    ... on User {
      name
      email
    }
    ... on Post {
      title
      content
    }
    ... on Comment {
      text
    }
  }
}
```

### Enums

**Definition:**
```graphql
enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type User {
  id: ID!
  name: String!
  role: UserRole!
}

type Post {
  id: ID!
  title: String!
  status: PostStatus!
}
```

### Input Types

**Definition:**
```graphql
input CreateUserInput {
  name: String!
  email: Email!
  password: String!
  role: UserRole = VIEWER
}

input UpdateUserInput {
  name: String
  email: Email
  role: UserRole
}

input PostFilter {
  authorId: ID
  status: PostStatus
  tags: [String!]
}

input Pagination {
  limit: Int = 20
  offset: Int = 0
}

type Query {
  users(filter: PostFilter, pagination: Pagination): [User!]!
}
```

## Resolvers

### Basic Resolvers

```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      return await context.db.User.findById(id);
    },
    
    users: async (parent, { limit, offset }, context) => {
      return await context.db.User.find()
        .limit(limit)
        .skip(offset);
    }
  },
  
  Mutation: {
    createUser: async (parent, { input }, context) => {
      const user = await context.db.User.create(input);
      return user;
    },
    
    updateUser: async (parent, { id, input }, context) => {
      const user = await context.db.User.findByIdAndUpdate(
        id,
        input,
        { new: true }
      );
      return user;
    }
  },
  
  User: {
    posts: async (parent, args, context) => {
      return await context.db.Post.find({ authorId: parent.id });
    },
    
    friends: async (parent, args, context) => {
      return await context.db.User.find({
        _id: { $in: parent.friendIds }
      });
    }
  },
  
  Post: {
    author: async (parent, args, context) => {
      return await context.db.User.findById(parent.authorId);
    },
    
    comments: async (parent, args, context) => {
      return await context.db.Comment.find({ postId: parent.id });
    }
  }
};
```

### Resolver Arguments

```javascript
const resolvers = {
  Query: {
    // parent: Result from parent resolver
    // args: Query arguments
    // context: Shared context (db, user, etc.)
    // info: Query AST and schema info
    user: (parent, args, context, info) => {
      console.log('Parent:', parent);
      console.log('Args:', args);
      console.log('Context:', context);
      console.log('Info:', info);
      
      return context.db.User.findById(args.id);
    }
  }
};
```

### Resolver Chains

```javascript
// Query
query {
  user(id: "123") {    // Query.user resolver
    name
    posts {            // User.posts resolver
      title
      author {         // Post.author resolver
        name
      }
    }
  }
}

// Execution
1. Query.user(parent, { id: "123" }, context)
   → Returns user object

2. User.posts(user, {}, context)
   → Returns array of posts

3. Post.author(post, {}, context)
   → Returns author for each post
```

## Data Loading

### N+1 Problem

**Problem:**
```javascript
// Bad: N+1 queries
const resolvers = {
  Query: {
    users: () => User.find()  // 1 query
  },
  User: {
    posts: (user) => Post.find({ authorId: user.id })  // N queries
  }
};

// Query
query {
  users {        // 1 query
    name
    posts {      // N queries (one per user)
      title
    }
  }
}

// Total: 1 + N queries
```

### DataLoader

**Solution:**
```javascript
const DataLoader = require('dataloader');

// Batch function
async function batchLoadPosts(userIds) {
  const posts = await Post.find({
    authorId: { $in: userIds }
  });
  
  // Group by authorId
  const postsByUser = {};
  posts.forEach(post => {
    if (!postsByUser[post.authorId]) {
      postsByUser[post.authorId] = [];
    }
    postsByUser[post.authorId].push(post);
  });
  
  // Return in same order as userIds
  return userIds.map(id => postsByUser[id] || []);
}

// Create loader
const postLoader = new DataLoader(batchLoadPosts);

// Resolver
const resolvers = {
  User: {
    posts: (user) => postLoader.load(user.id)
  }
};

// Now: 1 query for users + 1 batched query for all posts
```

**Caching:**
```javascript
// Per-request cache
const createLoaders = () => ({
  userLoader: new DataLoader(batchLoadUsers),
  postLoader: new DataLoader(batchLoadPosts),
  commentLoader: new DataLoader(batchLoadComments)
});

// Context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    db,
    loaders: createLoaders()
  })
});

// Usage
const resolvers = {
  Post: {
    author: (post, args, { loaders }) => {
      return loaders.userLoader.load(post.authorId);
    }
  }
};
```

## Subscriptions

### WebSocket Setup

```javascript
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
});

useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema
});

await server.start();
server.applyMiddleware({ app });

httpServer.listen(4000);
```

### Subscription Resolvers

```javascript
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
  Mutation: {
    createPost: async (parent, { input }, context) => {
      const post = await context.db.Post.create(input);
      
      // Publish event
      pubsub.publish('POST_CREATED', {
        postCreated: post
      });
      
      return post;
    },
    
    addComment: async (parent, { input }, context) => {
      const comment = await context.db.Comment.create(input);
      
      // Publish with filter
      pubsub.publish('COMMENT_ADDED', {
        commentAdded: comment,
        postId: comment.postId
      });
      
      return comment;
    }
  },
  
  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterator(['POST_CREATED'])
    },
    
    commentAdded: {
      subscribe: (parent, { postId }) => {
        return pubsub.asyncIterator(['COMMENT_ADDED']);
      },
      resolve: (payload, { postId }) => {
        // Filter by postId
        if (payload.postId === postId) {
          return payload.commentAdded;
        }
        return null;
      }
    }
  }
};
```

### Client Subscription

```javascript
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql'
  })
);

// Subscribe
const subscription = client.subscribe({
  query: gql`
    subscription {
      postCreated {
        id
        title
        author {
          name
        }
      }
    }
  `
}).subscribe({
  next: ({ data }) => {
    console.log('New post:', data.postCreated);
  },
  error: (error) => {
    console.error('Subscription error:', error);
  }
});

// Unsubscribe
subscription.unsubscribe();
```

## Error Handling

### Custom Errors

```javascript
const { ApolloError } = require('apollo-server-express');

class NotFoundError extends ApolloError {
  constructor(message) {
    super(message, 'NOT_FOUND');
  }
}

class ValidationError extends ApolloError {
  constructor(message, fields) {
    super(message, 'VALIDATION_ERROR');
    this.extensions.fields = fields;
  }
}

class UnauthorizedError extends ApolloError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED');
  }
}

// Usage
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      const user = await context.db.User.findById(id);
      
      if (!user) {
        throw new NotFoundError(`User ${id} not found`);
      }
      
      return user;
    }
  },
  
  Mutation: {
    createUser: async (parent, { input }, context) => {
      if (!context.user) {
        throw new UnauthorizedError();
      }
      
      if (!input.email.includes('@')) {
        throw new ValidationError('Invalid email', {
          email: 'Must be valid email address'
        });
      }
      
      return await context.db.User.create(input);
    }
  }
};
```

### Error Response

```json
{
  "errors": [
    {
      "message": "User 123 not found",
      "extensions": {
        "code": "NOT_FOUND"
      },
      "path": ["user"],
      "locations": [{ "line": 2, "column": 3 }]
    }
  ],
  "data": {
    "user": null
  }
}
```

### Error Formatting

```javascript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // Log error
    console.error(error);
    
    // Don't expose internal errors
    if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      return new Error('Internal server error');
    }
    
    // Return error
    return error;
  }
});
```

## Security

### Authentication

```javascript
const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

// Context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user, db };
      } catch (error) {
        throw new AuthenticationError('Invalid token');
      }
    }
    
    return { user: null, db };
  }
});

// Resolver
const resolvers = {
  Query: {
    me: (parent, args, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      return user;
    }
  }
};
```

### Authorization

```javascript
// Directive
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { role } = this.args;
    
    field.resolve = async function(...args) {
      const [, , context] = args;
      
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      if (role && context.user.role !== role) {
        throw new ForbiddenError('Insufficient permissions');
      }
      
      return resolve.apply(this, args);
    };
  }
}

// Schema
const typeDefs = gql`
  directive @auth(role: UserRole) on FIELD_DEFINITION
  
  type Query {
    users: [User!]! @auth(role: ADMIN)
    me: User! @auth
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective
  }
});
```

### Query Complexity

```javascript
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    createComplexityLimitRule(1000, {
      onCost: (cost) => {
        console.log('Query cost:', cost);
      }
    })
  ]
});

// Schema with complexity
const typeDefs = gql`
  type Query {
    users: [User!]! @complexity(value: 10, multipliers: ["limit"])
    posts: [Post!]! @complexity(value: 5)
  }
`;
```

### Rate Limiting

```javascript
const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const ip = req.ip;
    
    try {
      await rateLimiter.consume(ip);
    } catch (error) {
      throw new Error('Too many requests');
    }
    
    return { db };
  }
});
```

## Performance

### Query Batching

```javascript
// Client
import { BatchHttpLink } from '@apollo/client/link/batch-http';

const link = new BatchHttpLink({
  uri: 'http://localhost:4000/graphql',
  batchMax: 10,
  batchInterval: 20
});

// Multiple queries batched into single HTTP request
client.query({ query: QUERY1 });
client.query({ query: QUERY2 });
client.query({ query: QUERY3 });
```

### Persisted Queries

```javascript
// Generate query map
const queries = {
  'abc123': 'query GetUser($id: ID!) { user(id: $id) { name } }'
};

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: {
    cache: new Map(Object.entries(queries))
  }
});

// Client sends hash instead of full query
fetch('/graphql', {
  method: 'POST',
  body: JSON.stringify({
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: 'abc123'
      }
    },
    variables: { id: '123' }
  })
});
```

### Caching

```javascript
// Response caching
const { ApolloServer } = require('apollo-server-express');
const responseCachePlugin = require('apollo-server-plugin-response-cache');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    responseCachePlugin({
      sessionId: (context) => context.user?.id || null
    })
  ],
  cacheControl: {
    defaultMaxAge: 5
  }
});

// Schema
const typeDefs = gql`
  type Query {
    users: [User!]! @cacheControl(maxAge: 60)
    user(id: ID!): User @cacheControl(maxAge: 300)
  }
`;
```

## Testing

### Unit Tests

```javascript
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

describe('User Resolvers', () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  
  it('should get user by id', async () => {
    const query = `
      query {
        user(id: "123") {
          id
          name
          email
        }
      }
    `;
    
    const result = await graphql({
      schema,
      source: query,
      contextValue: { db: mockDb }
    });
    
    expect(result.errors).toBeUndefined();
    expect(result.data.user).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    });
  });
});
```

### Integration Tests

```javascript
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server-express');

describe('GraphQL API', () => {
  let server, query, mutate;
  
  beforeAll(() => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({ db: testDb })
    });
    
    const client = createTestClient(server);
    query = client.query;
    mutate = client.mutate;
  });
  
  it('should create user', async () => {
    const CREATE_USER = gql`
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          name
          email
        }
      }
    `;
    
    const { data } = await mutate({
      mutation: CREATE_USER,
      variables: {
        input: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'secret123'
        }
      }
    });
    
    expect(data.createUser).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com'
    });
  });
});
```

## Best Practices

### Schema Design

**Use Descriptive Names:**
```graphql
# Good
type User {
  id: ID!
  fullName: String!
  emailAddress: Email!
}

# Bad
type User {
  id: ID!
  name: String!
  email: String!
}
```

**Use Input Types:**
```graphql
# Good
input CreateUserInput {
  name: String!
  email: Email!
}

mutation {
  createUser(input: CreateUserInput!): User!
}

# Bad
mutation {
  createUser(name: String!, email: Email!): User!
}
```

**Pagination:**
```graphql
type Query {
  users(
    first: Int
    after: String
    last: Int
    before: String
  ): UserConnection!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### Error Handling

**Return Partial Data:**
```graphql
query {
  user(id: "123") {
    name
    posts {  # May fail
      title
    }
  }
}

# Response with partial data
{
  "data": {
    "user": {
      "name": "John Doe",
      "posts": null
    }
  },
  "errors": [
    {
      "message": "Failed to load posts",
      "path": ["user", "posts"]
    }
  ]
}
```

### Performance

**Avoid Over-Fetching:**
```graphql
# Good: Request only needed fields
query {
  user(id: "123") {
    name
    email
  }
}

# Bad: Request all fields
query {
  user(id: "123") {
    id
    name
    email
    bio
    avatar
    createdAt
    updatedAt
    # ... many more fields
  }
}
```

**Use DataLoader:**
```javascript
// Always use DataLoader for related data
const resolvers = {
  User: {
    posts: (user, args, { loaders }) => {
      return loaders.postLoader.load(user.id);
    }
  }
};
```

## Interview Questions

**Q: What are the main advantages of GraphQL over REST?**

A: GraphQL provides: precise data fetching (no over/under-fetching), single endpoint, strong typing, introspection, real-time with subscriptions, versioning not needed. REST is simpler for basic CRUD, better caching, easier to understand. Choose based on requirements.

**Q: Explain the N+1 problem and how to solve it.**

A: N+1 occurs when fetching related data requires N additional queries (one per parent). Example: fetching users (1 query) then posts for each user (N queries). Solution: Use DataLoader to batch and cache requests, reducing to 2 queries total.

**Q: How do GraphQL subscriptions work?**

A: Subscriptions use WebSocket for real-time updates. Client subscribes to events, server publishes events via PubSub, matching subscriptions receive updates. Use for real-time features like chat, notifications, live updates. More complex than queries/mutations.

**Q: What's the difference between Query and Mutation?**

A: Query is for reading data (idempotent, cacheable, parallel execution). Mutation is for writing data (side effects, not cacheable, sequential execution). Convention only - technically both can do anything, but separation clarifies intent and enables optimizations.

**Q: How do you handle authentication in GraphQL?**

A: Add user to context from token in headers, check authentication in resolvers or directives, throw AuthenticationError if not authenticated. Use directives for declarative auth (@auth), middleware for route-level auth. Context is per-request, perfect for auth state.

---

[← Back to WebAssembly](./08-webassembly-theory.md) | [Next: Testing Advanced →](../13-tools-ecosystem/05-testing-advanced-theory.md)
