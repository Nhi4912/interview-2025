# Frontend System Design

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Designing Scalable Frontend Applications

**English:** Frontend system design involves architecting client-side applications that are scalable, maintainable, performant, and provide excellent user experience.

**Tiếng Việt:** Thiết kế hệ thống frontend liên quan đến việc thiết kế kiến trúc ứng dụng phía client có khả năng mở rộng, dễ bảo trì, hiệu suất cao và cung cấp trải nghiệm người dùng tuyệt vời.

## System Design Framework

### Requirements Gathering

**Functional Requirements:**
- Core features
- User interactions
- Data operations
- Business logic

**Non-Functional Requirements:**
- Performance targets
- Scalability needs
- Security requirements
- Accessibility standards
- Browser support
- Mobile responsiveness

### Capacity Estimation

**Metrics to Consider:**
- Daily/Monthly Active Users (DAU/MAU)
- Requests per second (RPS)
- Data transfer volume
- Storage requirements
- Concurrent users

**Example Calculation:**
```
1M DAU
Average 10 requests/user/day
= 10M requests/day
= 10M / 86400 seconds
≈ 116 RPS average
Peak: 3-5x average = 350-580 RPS
```

## Common Design Problems

### Design a News Feed

**Requirements:**
- Display posts from followed users
- Real-time updates
- Infinite scroll
- Like/comment functionality
- Image/video support

**Architecture:**

**Components:**
- Feed Container
- Post Component
- Infinite Scroll Handler
- Real-time Update Manager
- Media Loader

**Data Flow:**
```
User scrolls → Detect threshold → Fetch more posts
New post created → WebSocket notification → Update feed
User likes post → Optimistic update → API call → Confirm
```

**Optimization Strategies:**
- Virtual scrolling for performance
- Image lazy loading
- Pagination/cursor-based loading
- Optimistic UI updates
- WebSocket for real-time
- Service Worker for offline

**State Management:**
```javascript
{
  posts: {
    byId: { '1': {...}, '2': {...} },
    allIds: ['1', '2', '3'],
    hasMore: true,
    cursor: 'abc123'
  },
  ui: {
    loading: false,
    error: null
  }
}
```

### Design an Autocomplete System

**Requirements:**
- Search suggestions as user types
- Fast response (<100ms)
- Handle typos
- Ranking/relevance
- Support millions of queries

**Architecture:**

**Components:**
- Search Input
- Suggestions Dropdown
- Debounce Handler
- Cache Manager
- API Client

**Optimization:**
- Debounce input (300ms)
- Client-side caching
- Trie data structure
- Prefix matching
- CDN for static data

**Caching Strategy:**
```javascript
// Multi-level cache
L1: In-memory (LRU, 100 items)
L2: LocalStorage (1000 items)
L3: Service Worker cache
L4: CDN
L5: Backend
```

**Performance:**
```
User types → Debounce → Check L1 cache
Cache miss → Check L2 → Check L3
All miss → API call → Update caches
```

### Design a Photo Sharing App

**Requirements:**
- Upload photos
- View feed
- Like/comment
- User profiles
- Search functionality

**Architecture:**

**Upload Flow:**
```
Select image → Client-side resize → Generate thumbnail
→ Upload to CDN → Save metadata to DB
→ Update UI optimistically
```

**Image Optimization:**
- Multiple resolutions (thumbnail, medium, full)
- WebP format with fallback
- Lazy loading
- Progressive loading
- Blur placeholder

**CDN Strategy:**
```
images.cdn.com/
  /thumbnails/150x150/
  /medium/800x800/
  /full/original/
```

**State Management:**
```javascript
{
  photos: {
    byId: {},
    byUser: {},
    feed: []
  },
  upload: {
    queue: [],
    progress: {},
    failed: []
  }
}
```

### Design a Chat Application

**Requirements:**
- Real-time messaging
- Online status
- Read receipts
- Message history
- File sharing
- Group chats

**Architecture:**

**Real-time Communication:**
- WebSocket for messages
- Fallback to long polling
- Heartbeat for connection
- Reconnection logic

**Message Flow:**
```
User sends → Optimistic UI → WebSocket emit
→ Server processes → Broadcast to recipients
→ Confirm delivery → Update UI
```

**Offline Support:**
```
Message queue in IndexedDB
→ Retry on reconnection
→ Conflict resolution
→ Sync with server
```

**Data Structure:**
```javascript
{
  conversations: {
    byId: {
      'conv1': {
        id: 'conv1',
        participants: ['user1', 'user2'],
        lastMessage: {...},
        unreadCount: 3
      }
    }
  },
  messages: {
    byConversation: {
      'conv1': ['msg1', 'msg2', 'msg3']
    },
    byId: {
      'msg1': {
        id: 'msg1',
        text: 'Hello',
        sender: 'user1',
        timestamp: 1234567890,
        status: 'delivered'
      }
    }
  }
}
```

## Performance Optimization

### Code Splitting

**Strategy:**
- Route-based splitting
- Component-based splitting
- Vendor splitting
- Dynamic imports

**Implementation:**
```javascript
// Route splitting
const Dashboard = lazy(() => import('./Dashboard'));

// Component splitting
const HeavyChart = lazy(() => import('./HeavyChart'));

// Conditional loading
if (userHasPremium) {
  const PremiumFeature = await import('./Premium');
}
```

### Caching Strategy

**Levels:**
1. Memory cache (fastest)
2. Service Worker cache
3. Browser cache (HTTP)
4. CDN cache
5. Server cache

**Cache Invalidation:**
- Time-based (TTL)
- Event-based (on update)
- Version-based (cache busting)

### Asset Optimization

**Images:**
- Responsive images (srcset)
- Modern formats (WebP, AVIF)
- Lazy loading
- Blur placeholder
- CDN delivery

**JavaScript:**
- Minification
- Tree shaking
- Code splitting
- Compression (Brotli/Gzip)

**CSS:**
- Critical CSS inline
- Non-critical async
- Purge unused
- Minification

## Scalability Patterns

### Micro-Frontends

**Theory:** Split frontend into smaller, independent applications.

**Benefits:**
- Independent deployment
- Technology diversity
- Team autonomy
- Incremental upgrades

**Implementation:**
- Module Federation (Webpack 5)
- iframes (simple but limited)
- Web Components
- Single-SPA framework

**Challenges:**
- Shared dependencies
- Consistent styling
- Communication between apps
- Performance overhead

### State Management at Scale

**Patterns:**
- Normalized state
- Entity adapter
- Selector memoization
- Optimistic updates

**Structure:**
```javascript
{
  entities: {
    users: { byId: {}, allIds: [] },
    posts: { byId: {}, allIds: [] },
    comments: { byId: {}, allIds: [] }
  },
  ui: {
    currentUser: 'user1',
    selectedPost: 'post1'
  }
}
```

### API Design

**REST vs GraphQL:**

**REST:**
- Simple, cacheable
- Over-fetching/under-fetching
- Multiple endpoints

**GraphQL:**
- Single endpoint
- Precise data fetching
- Complex caching

**Optimization:**
- Request batching
- Response caching
- Pagination
- Field selection

## Security Considerations

### XSS Prevention

**Strategies:**
- Input sanitization
- Output encoding
- Content Security Policy
- HTTPOnly cookies
- Trusted Types API

### CSRF Protection

**Strategies:**
- CSRF tokens
- SameSite cookies
- Double submit cookie
- Custom headers

### Authentication

**Patterns:**
- JWT tokens
- Refresh token rotation
- Secure storage
- Token expiration

**Implementation:**
```javascript
// Token storage
- Access token: Memory (short-lived)
- Refresh token: HTTPOnly cookie (long-lived)

// Refresh flow
Access token expires → Use refresh token
→ Get new access token → Continue request
```

## Monitoring & Analytics

### Performance Monitoring

**Metrics:**
- Core Web Vitals (LCP, FID, CLS)
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Bundle size
- API latency

**Tools:**
- Lighthouse
- WebPageTest
- Chrome DevTools
- Real User Monitoring (RUM)

### Error Tracking

**Implementation:**
```javascript
// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  logError(event.error);
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason);
});
```

### Analytics

**Events to Track:**
- Page views
- User interactions
- Feature usage
- Conversion funnels
- Error rates

## Interview Approach

### Step-by-Step Process

**1. Clarify Requirements (5 min)**
- Ask about scale
- Identify core features
- Understand constraints
- Define success metrics

**2. High-Level Design (10 min)**
- Draw component architecture
- Define data flow
- Identify key technologies
- Discuss trade-offs

**3. Deep Dive (15 min)**
- Optimize critical paths
- Handle edge cases
- Discuss scalability
- Address security

**4. Wrap Up (5 min)**
- Summarize design
- Discuss alternatives
- Mention monitoring
- Answer questions

### Common Questions

**Q: How to handle 1M concurrent users?**

A: Horizontal scaling, CDN for static assets, caching at multiple levels, database read replicas, load balancing, microservices architecture, async processing.

**Q: How to optimize initial load time?**

A: Code splitting, lazy loading, critical CSS inline, image optimization, HTTP/2, compression, CDN, service worker caching, preloading critical resources.

**Q: How to ensure real-time updates?**

A: WebSocket for bidirectional communication, Server-Sent Events for server-to-client, long polling as fallback, optimistic updates, conflict resolution.

**Q: How to handle offline functionality?**

A: Service Worker for caching, IndexedDB for data storage, background sync, queue failed requests, conflict resolution on reconnection.

**Q: How to make app accessible?**

A: Semantic HTML, ARIA labels, keyboard navigation, screen reader support, color contrast, focus management, skip links.

---

[← Back to Coding Patterns](./11-interview-practice-04-coding-patterns.md) | [Next: Behavioral Questions →](./11-interview-practice-05-behavioral-questions.md)
