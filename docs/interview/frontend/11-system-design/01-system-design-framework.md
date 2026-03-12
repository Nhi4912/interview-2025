# System Design Framework - RADIO Method

> RADIO là framework chuẩn cho Frontend System Design interviews tại Big Tech.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RADIO FRAMEWORK                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   R ──▶ Requirements        (5 min)   What to build?            │
│   A ──▶ Architecture        (10 min)  High-level design         │
│   D ──▶ Data Model          (10 min)  Data & APIs               │
│   I ──▶ Interface Design    (10 min)  Components & props        │
│   O ──▶ Optimizations       (10 min)  Performance & UX          │
│                                                                   │
│   FRONTEND VS BACKEND SD:                                       │
│   ───────────────────────                                        │
│   Backend: Databases, servers, scaling, distributed systems     │
│   Frontend: Components, state, rendering, user experience       │
│                                                                   │
│   DON'T focus on:                                               │
│   • Database schema design                                      │
│   • Load balancers, CDN infrastructure                          │
│   • Microservices architecture                                  │
│                                                                   │
│   DO focus on:                                                  │
│   • Component architecture                                      │
│   • State management                                            │
│   • Client-side performance                                     │
│   • User experience                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## R - Requirements Gathering

### Functional Requirements

```
┌─────────────────────────────────────────────────────────────────┐
│                    FUNCTIONAL REQUIREMENTS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   QUESTIONS TO ASK:                                             │
│   ─────────────────                                              │
│                                                                   │
│   1. Core Features                                              │
│      "What are the main features users need?"                   │
│      "What can users do with this product?"                     │
│                                                                   │
│   2. User Flows                                                 │
│      "What's the primary user journey?"                         │
│      "What actions should be prioritized?"                      │
│                                                                   │
│   3. Content Types                                              │
│      "What types of content are displayed?"                     │
│      "Text, images, videos, real-time data?"                    │
│                                                                   │
│   4. User Roles                                                 │
│      "Are there different user types?"                          │
│      "Admin vs regular user capabilities?"                      │
│                                                                   │
│   EXAMPLE - News Feed:                                          │
│   ─────────────────────                                          │
│   • Users can view posts in chronological order                 │
│   • Users can create posts (text, images, videos)               │
│   • Users can like, comment, share posts                        │
│   • Users can follow/unfollow other users                       │
│   • Real-time notifications for interactions                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Non-Functional Requirements

```
┌─────────────────────────────────────────────────────────────────┐
│                    NON-FUNCTIONAL REQUIREMENTS                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   PERFORMANCE:                                                  │
│   ────────────                                                   │
│   • Page load time: < 3s (LCP)                                  │
│   • Interaction response: < 200ms (INP)                         │
│   • Visual stability: CLS < 0.1                                 │
│                                                                   │
│   SCALE:                                                        │
│   ──────                                                         │
│   • How many concurrent users?                                  │
│   • How much data per user?                                     │
│   • Data update frequency?                                      │
│                                                                   │
│   DEVICE SUPPORT:                                               │
│   ───────────────                                                │
│   • Mobile-first or desktop-first?                              │
│   • Responsive design requirements?                             │
│   • Touch vs mouse interactions?                                │
│                                                                   │
│   ACCESSIBILITY:                                                │
│   ──────────────                                                 │
│   • WCAG 2.1 AA compliance?                                     │
│   • Screen reader support?                                      │
│   • Keyboard navigation?                                        │
│                                                                   │
│   OFFLINE SUPPORT:                                              │
│   ────────────────                                               │
│   • Works without network?                                      │
│   • Sync strategy?                                              │
│   • Data persistence?                                           │
│                                                                   │
│   INTERNATIONALIZATION:                                         │
│   ─────────────────────                                          │
│   • Multi-language support?                                     │
│   • RTL languages?                                              │
│   • Local date/currency formats?                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Scope and Prioritization

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCOPE MANAGEMENT                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   45-MINUTE INTERVIEW SCOPE:                                    │
│   ───────────────────────────                                    │
│   • Focus on 2-3 core features                                  │
│   • Deep dive on main user flow                                 │
│   • Acknowledge out-of-scope items                              │
│                                                                   │
│   PRIORITIZATION MATRIX:                                        │
│                                                                   │
│                    Impact                                       │
│                High        Low                                  │
│              ┌───────────┬──────────┐                          │
│   Effort     │   DO      │  MAYBE   │                          │
│   Low        │  FIRST    │          │                          │
│              ├───────────┼──────────┤                          │
│   High       │ DISCUSS   │  SKIP    │                          │
│              │ TRADE-OFFS│          │                          │
│              └───────────┴──────────┘                          │
│                                                                   │
│   SAY: "For this 45-minute discussion, I'll focus on..."       │
│        "If we have time, we can also discuss..."               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## A - Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │                        APPLICATION                         │ │
│   ├───────────────────────────────────────────────────────────┤ │
│   │                                                            │ │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│ │
│   │  │   VIEWS     │  │   STATE     │  │     SERVICES        ││ │
│   │  │             │  │   LAYER     │  │                     ││ │
│   │  │ Components  │◄─│             │◄─│  API Client         ││ │
│   │  │ Pages       │  │ UI State    │  │  WebSocket          ││ │
│   │  │ Layouts     │  │ Server State│  │  Storage            ││ │
│   │  │             │  │ Derived     │  │  Analytics          ││ │
│   │  └─────────────┘  └─────────────┘  └─────────────────────┘│ │
│   │                                                            │ │
│   └───────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │                      INFRASTRUCTURE                        │ │
│   │  CDN ─── API Gateway ─── Backend Services ─── Database    │ │
│   └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   LEVELS:                                                       │
│   ───────                                                        │
│                                                                   │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │  APP SHELL                                                 │ │
│   │  • Root layout, routing, global providers                  │ │
│   └───────────────────────────────────────────────────────────┘ │
│                              │                                   │
│          ┌───────────────────┴───────────────────┐              │
│          ▼                                       ▼              │
│   ┌──────────────┐                       ┌──────────────┐       │
│   │    PAGE      │                       │    PAGE      │       │
│   │  • Route     │                       │              │       │
│   │  • Data fetch│                       │              │       │
│   └──────────────┘                       └──────────────┘       │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │   FEATURE    │  │   FEATURE    │  │   FEATURE    │          │
│   │ • Business   │  │              │  │              │          │
│   │   logic      │  │              │  │              │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │    UI        │  │     UI       │  │     UI       │          │
│   │ • Presentat. │  │              │  │              │          │
│   │ • Reusable   │  │              │  │              │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Patterns

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FLOW PATTERNS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   UNIDIRECTIONAL (Flux/Redux):                                  │
│   ────────────────────────────                                   │
│                                                                   │
│       Actions ──▶ Dispatcher ──▶ Store ──▶ Views                │
│          ▲                                    │                  │
│          └────────────────────────────────────┘                  │
│                                                                   │
│   Benefits: Predictable, debuggable, time-travel                │
│   Use for: Complex state, many interactions                     │
│                                                                   │
│   ─────────────────────────────────────────────────────────────  │
│                                                                   │
│   BIDIRECTIONAL (Component State):                              │
│   ────────────────────────────────                               │
│                                                                   │
│       Parent ◄──▶ Child                                         │
│       (props down, callbacks up)                                │
│                                                                   │
│   Benefits: Simple, local state                                 │
│   Use for: Form inputs, UI state                                │
│                                                                   │
│   ─────────────────────────────────────────────────────────────  │
│                                                                   │
│   SERVER STATE (React Query/SWR):                               │
│   ────────────────────────────────                               │
│                                                                   │
│       Cache ◄──▶ API ◄──▶ Components                            │
│       (auto-sync, revalidation)                                 │
│                                                                   │
│   Benefits: Caching, background updates                         │
│   Use for: API data, real-time updates                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## D - Data Model

### Entity Design

```typescript
// Core entities with TypeScript
interface User {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    createdAt: Date;
}

interface Post {
    id: string;
    authorId: string;
    content: string;
    mediaUrls: string[];
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
}

interface Comment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: Date;
    parentId?: string; // For nested comments
}

// Normalized state shape
interface AppState {
    entities: {
        users: Record<string, User>;
        posts: Record<string, Post>;
        comments: Record<string, Comment>;
    };
    ui: {
        feed: {
            postIds: string[];
            loading: boolean;
            error: string | null;
            cursor: string | null;
        };
    };
}
```

### API Contract Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    API DESIGN                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   REST ENDPOINTS:                                               │
│   ───────────────                                                │
│                                                                   │
│   GET /api/feed                                                 │
│       ?cursor=abc123                                            │
│       &limit=20                                                 │
│       Response: { posts: Post[], nextCursor: string }           │
│                                                                   │
│   POST /api/posts                                               │
│       Body: { content: string, mediaUrls: string[] }            │
│       Response: Post                                            │
│                                                                   │
│   PUT /api/posts/:id                                            │
│       Body: { content?: string }                                │
│       Response: Post                                            │
│                                                                   │
│   DELETE /api/posts/:id                                         │
│       Response: { success: boolean }                            │
│                                                                   │
│   POST /api/posts/:id/like                                      │
│       Response: { likesCount: number, liked: boolean }          │
│                                                                   │
│   GET /api/posts/:id/comments                                   │
│       ?cursor=abc&limit=10                                      │
│       Response: { comments: Comment[], nextCursor: string }     │
│                                                                   │
│   PAGINATION STRATEGIES:                                        │
│   ───────────────────────                                        │
│   Offset:   /posts?page=2&limit=20     (simple, can skip)       │
│   Cursor:   /posts?after=abc123        (real-time safe)         │
│   Keyset:   /posts?after_id=123        (performant)             │
│                                                                   │
│   CHOOSE CURSOR FOR: Social feeds, real-time content            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Real-time Data

```typescript
// WebSocket event types
interface WebSocketEvents {
    // Server -> Client
    'post:created': Post;
    'post:updated': Partial<Post> & { id: string };
    'post:deleted': { id: string };
    'comment:created': Comment;
    'notification:new': Notification;

    // Client -> Server
    'feed:subscribe': { userId: string };
    'feed:unsubscribe': { userId: string };
    'post:typing': { postId: string };
}

// Real-time update handling
function handleRealtimeUpdate(event: WebSocketEvent) {
    switch (event.type) {
        case 'post:created':
            // Prepend to feed if from followed user
            if (isFollowing(event.data.authorId)) {
                dispatch(prependPost(event.data));
            }
            break;

        case 'post:updated':
            // Optimistic update with server confirmation
            dispatch(updatePost(event.data));
            break;

        case 'notification:new':
            // Show toast and update badge
            showToast(event.data.message);
            dispatch(incrementNotificationCount());
            break;
    }
}
```

---

## I - Interface Design

### Component Interface

```tsx
// Define clear component contracts

// Feed container - smart component
interface FeedProps {
    userId?: string;           // Optional filter by user
    type: 'home' | 'profile' | 'explore';
    initialData?: Post[];      // SSR hydration
}

// Feed state
interface FeedState {
    posts: Post[];
    isLoading: boolean;
    isRefreshing: boolean;
    error: Error | null;
    hasMore: boolean;
    cursor: string | null;
}

// Post card - presentational component
interface PostCardProps {
    post: Post;
    author: User;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
    onShare: (postId: string) => void;
    onAuthorClick: (userId: string) => void;
}

// Reusable UI components
interface ButtonProps {
    variant: 'primary' | 'secondary' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

interface InfiniteScrollProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    loadMore: () => Promise<void>;
    hasMore: boolean;
    isLoading: boolean;
    threshold?: number;  // pixels before end to trigger
}
```

### State Interface

```tsx
// Global state slices
interface RootState {
    auth: AuthState;
    feed: FeedState;
    notifications: NotificationState;
    ui: UIState;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface UIState {
    theme: 'light' | 'dark' | 'system';
    sidebarOpen: boolean;
    modal: {
        type: ModalType | null;
        props: Record<string, unknown>;
    };
}

// Local component state
interface PostFormState {
    content: string;
    media: File[];
    isSubmitting: boolean;
    errors: ValidationError[];
}
```

---

## O - Optimizations

### Performance Optimizations

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE OPTIMIZATIONS                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   LOADING:                                                      │
│   ────────                                                       │
│   • Code splitting by route                                     │
│   • Lazy load below-fold content                                │
│   • Preload critical resources                                  │
│   • SSR/SSG for initial content                                 │
│                                                                   │
│   RENDERING:                                                    │
│   ──────────                                                     │
│   • Virtual scrolling for long lists (>100 items)               │
│   • Memoization (React.memo, useMemo, useCallback)              │
│   • Windowing for complex tables                                │
│   • Debounce expensive renders                                  │
│                                                                   │
│   NETWORK:                                                      │
│   ────────                                                       │
│   • Request batching                                            │
│   • Response caching (SWR, React Query)                         │
│   • Optimistic updates                                          │
│   • Prefetch on hover/focus                                     │
│                                                                   │
│   MEDIA:                                                        │
│   ──────                                                         │
│   • Responsive images (srcset)                                  │
│   • WebP/AVIF formats                                           │
│   • Lazy loading with blur placeholder                          │
│   • Video streaming (HLS/DASH)                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Caching Strategies

```tsx
// Multi-layer caching

// 1. Server state cache (React Query)
const { data, isLoading } = useQuery({
    queryKey: ['feed', userId],
    queryFn: () => fetchFeed(userId),
    staleTime: 30 * 1000,        // Fresh for 30s
    cacheTime: 5 * 60 * 1000,    // Keep in cache 5min
    refetchOnWindowFocus: true,
});

// 2. Normalized entity cache
// Avoid duplicate data across components
const selectPost = (state, postId) =>
    state.entities.posts[postId];

// 3. Browser caching
// Service Worker for offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cached) => cached || fetch(event.request))
    );
});

// 4. Local storage for user preferences
const theme = localStorage.getItem('theme') || 'system';
```

### Error Handling

```tsx
// Comprehensive error handling

// Error boundary for component errors
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}

// API error handling
async function fetchWithRetry(url, options, retries = 3) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new APIError(response.status, await response.json());
        }
        return response.json();
    } catch (error) {
        if (retries > 0 && isRetryable(error)) {
            await delay(1000 * (4 - retries));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

// User-friendly error messages
function getErrorMessage(error: Error): string {
    if (error instanceof NetworkError) {
        return 'Connection lost. Please check your internet.';
    }
    if (error instanceof APIError && error.status === 429) {
        return 'Too many requests. Please try again later.';
    }
    return 'Something went wrong. Please try again.';
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is the RADIO framework?**

A: RADIO is a structured approach to frontend system design:
- **R**equirements: Gather functional and non-functional needs
- **A**rchitecture: Design component hierarchy and data flow
- **D**ata Model: Define entities and API contracts
- **I**nterface: Specify component props and state
- **O**ptimizations: Address performance and UX improvements

### 🟡 Mid-level

**Q: How do you handle real-time updates in a feed?**

A:
1. **WebSocket connection** for instant updates
2. **Cursor-based pagination** to handle new items correctly
3. **Optimistic updates** for user actions (likes, comments)
4. **Queue incoming updates** when scrolled down
5. **"New posts" indicator** instead of auto-inserting

```tsx
// Show indicator for new posts
{newPostsCount > 0 && (
    <button onClick={loadNewPosts}>
        {newPostsCount} new posts
    </button>
)}
```

### 🔴 Senior

**Q: Design the architecture for a real-time collaborative editor**

A:
```
Architecture:
1. CRDT/OT for conflict resolution
2. WebSocket for real-time sync
3. Presence system for active users
4. Versioning for undo/redo
5. Offline queue for disconnected edits

Key challenges:
- Conflict resolution strategy
- Cursor/selection sync
- Large document performance
- Reconnection and state reconciliation
```

---

## 📚 Active Recall

1. [ ] List all 5 steps of RADIO framework
2. [ ] What questions should you ask in Requirements phase?
3. [ ] Draw a typical frontend architecture diagram
4. [ ] What are the 3 pagination strategies? When to use each?
5. [ ] List 5 performance optimizations for a feed

---

> **Tiếp theo:** [02-architecture-patterns.md](./02-architecture-patterns.md) - Architecture Patterns
