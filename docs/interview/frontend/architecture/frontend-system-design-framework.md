# Frontend System Design Framework

## Table of Contents

- [System Design Interview Approach](#system-design-interview-approach)
- [Requirements Gathering Framework](#requirements-gathering-framework)
- [Architecture Patterns](#architecture-patterns)
- [Component Design Strategy](#component-design-strategy)
- [State Management Architecture](#state-management-architecture)
- [Performance & Scalability](#performance--scalability)
- [Real-World Examples](#real-world-examples)
- [Visual Design Patterns](#visual-design-patterns)
- [Evaluation Criteria](#evaluation-criteria)

## System Design Interview Approach

### The 6-Step Framework

**Step 1: Clarify Requirements (5 minutes)**

- Functional requirements
- Non-functional requirements
- Scale and constraints
- User personas

**Step 2: High-Level Architecture (10 minutes)**

- System components
- Data flow
- Technology stack
- Third-party integrations

**Step 3: Component Design (15 minutes)**

- Component hierarchy
- Props and state design
- Reusability patterns
- Component communication

**Step 4: State Management (10 minutes)**

- State architecture
- Data flow patterns
- Caching strategies
- Real-time updates

**Step 5: Performance & Scalability (10 minutes)**

- Loading strategies
- Bundle optimization
- Caching approaches
- Monitoring and metrics

**Step 6: Deep Dive & Trade-offs (10 minutes)**

- Specific implementation details
- Alternative approaches
- Trade-off analysis
- Future considerations

### Communication Strategy During Design

**Think Aloud Process:**

```
"Let me start by understanding the requirements..."
"I'm thinking about the user journey here..."
"There are a few architectural options - let me explore them..."
"The trade-off I see here is..."
"If I had more time, I would also consider..."
```

**Visual Communication:**

```
┌─────────────────────────────────────────────────────┐
│                Design Process                       │
│                                                     │
│  Requirements → Architecture → Components           │
│       ↓              ↓              ↓              │
│   Clarify      High-level     Component             │
│   Scope        Design         Details               │
│                                                     │
│  ←── Iterate and Refine Throughout ───→            │
└─────────────────────────────────────────────────────┘
```

## Requirements Gathering Framework

### Functional Requirements Analysis

**Template Questions:**

```
User Experience:
- Who are the primary users?
- What are the core user flows?
- What platforms (desktop, mobile, tablet)?
- What browsers need to be supported?

Features:
- What are the must-have features?
- What are the nice-to-have features?
- Are there any complex interactions?
- What about accessibility requirements?

Data:
- What data needs to be displayed?
- Where does the data come from?
- How often does data change?
- What's the data volume and structure?

Integration:
- Are there existing systems to integrate with?
- What APIs are available?
- Are there authentication requirements?
- What about third-party services?
```

### Non-Functional Requirements

**Performance Requirements:**

```
Loading Performance:
- Initial page load time target?
- Time to interactive requirements?
- Core Web Vitals goals?

Runtime Performance:
- Expected concurrent users?
- Response time requirements?
- Animation smoothness needs?

Scalability:
- Expected growth rate?
- Peak usage scenarios?
- Geographic distribution?
```

**Quality Requirements:**

```
Reliability:
- Uptime requirements?
- Error handling expectations?
- Offline functionality needs?

Security:
- Authentication/authorization needs?
- Data protection requirements?
- Compliance considerations?

Maintainability:
- Team size and skill level?
- Development timeline?
- Long-term maintenance plans?
```

### Example: Social Media Feed Requirements

**Question:** "Design a social media feed like Twitter"

**Requirements Gathering:**

```
Functional Requirements:
✓ Display posts in chronological order
✓ Real-time updates for new posts
✓ Like, comment, and share functionality
✓ User profiles and following/followers
✓ Image and video support
✓ Search functionality
✓ Trending topics

Non-Functional Requirements:
✓ Support 1M+ concurrent users
✓ Sub-second response times
✓ 99.9% uptime
✓ Mobile-first responsive design
✓ Accessibility compliance (WCAG 2.1)
✓ Real-time updates with WebSocket
✓ Offline reading capability

Constraints:
✓ Browser support: Chrome, Firefox, Safari (latest 2 versions)
✓ Bundle size limit: 2MB initial
✓ API rate limits: 1000 requests/hour per user
✓ Content moderation requirements
```

## Architecture Patterns

### Layered Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│                Presentation Layer                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   React     │ │   Vue.js    │ │   Angular   │   │
│  │ Components  │ │ Components  │ │ Components  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
├─────────────────────────────────────────────────────┤
│                Business Logic Layer                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   Custom    │ │   Hooks     │ │  Services   │   │
│  │   Hooks     │ │  & Utils    │ │  & Utils    │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
├─────────────────────────────────────────────────────┤
│                 Data Access Layer                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │     API     │ │   Cache     │ │   State     │   │
│  │   Client    │ │ Management  │ │ Management  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
├─────────────────────────────────────────────────────┤
│               Infrastructure Layer                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   CDN &     │ │   Service   │ │   Error     │   │
│  │   Static    │ │   Worker    │ │ Monitoring  │   │
│  │   Assets    │ │             │ │             │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Benefits:**

- Clear separation of concerns
- Easier testing and maintenance
- Scalable team structure
- Technology flexibility

**Implementation Example:**
{% raw %}

```typescript
// Presentation Layer
interface PostComponentProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}

const PostComponent: React.FC<PostComponentProps> = ({
  post,
  onLike,
  onComment,
}) => {
  return (
    <article className="post">
      <PostHeader author={post.author} timestamp={post.createdAt} />
      <PostContent content={post.content} media={post.media} />
      <PostActions
        likes={post.likes}
        onLike={() => onLike(post.id)}
        onComment={(comment) => onComment(post.id, comment)}
      />
    </article>
  );
};

// Business Logic Layer
const usePostInteractions = () => {
  const likePost = useCallback(async (postId: string) => {
    try {
      await PostService.likePost(postId);
      // Update local state
    } catch (error) {
      // Handle error
    }
  }, []);

  const addComment = useCallback(async (postId: string, comment: string) => {
    try {
      await PostService.addComment(postId, comment);
      // Update local state
    } catch (error) {
      // Handle error
    }
  }, []);

  return { likePost, addComment };
};

// Data Access Layer
class PostService {
  static async likePost(postId: string): Promise<void> {
    const response = await apiClient.post(`/posts/${postId}/like`);
    if (!response.ok) throw new Error("Failed to like post");
  }

  static async addComment(postId: string, comment: string): Promise<Comment> {
    const response = await apiClient.post(`/posts/${postId}/comments`, {
      comment,
    });
    if (!response.ok) throw new Error("Failed to add comment");
    return response.json();
  }
}
```

{% endraw %}

### Micro-Frontend Architecture

```
┌─────────────────────────────────────────────────────┐
│                Shell Application                    │
│  ┌─────────────────────────────────────────────┐   │
│  │            Shared Components                │   │
│  │     Header, Footer, Navigation              │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│               Micro-Frontend Apps                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │    Feed     │ │   Profile   │ │  Messaging  │   │
│  │   Module    │ │   Module    │ │   Module    │   │
│  │             │ │             │ │             │   │
│  │ React 18    │ │   Vue 3     │ │ Angular 15  │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
├─────────────────────────────────────────────────────┤
│              Shared Infrastructure                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │   State     │ │   Event     │ │    API      │   │
│  │  Manager    │ │    Bus      │ │   Gateway   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Benefits:**

- Team autonomy
- Technology diversity
- Independent deployment
- Scalable development

**Challenges:**

- Complexity overhead
- Bundle duplication
- Cross-module communication
- Consistent UX

### Component-Based Architecture

```
Application
├── Layout Components
│   ├── Header
│   ├── Sidebar
│   ├── Main Content
│   └── Footer
├── Feature Components
│   ├── User Profile
│   ├── Post Feed
│   ├── Search
│   └── Notifications
├── UI Components
│   ├── Button
│   ├── Input
│   ├── Modal
│   └── Card
└── Utility Components
    ├── Error Boundary
    ├── Loading Spinner
    ├── Infinite Scroll
    └── Virtual List
```

## Component Design Strategy

### Component Hierarchy Design

**Design Principles:**

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex UI through composition
3. **Props Down, Events Up**: Unidirectional data flow
4. **Reusability**: Design for multiple use cases
5. **Testability**: Components should be easily testable

**Example: Social Feed Component Design**


{% raw %}
```typescript
// High-level container component
interface FeedContainerProps {
  userId?: string;
  feedType: "home" | "user" | "trending";
}

const FeedContainer: React.FC<FeedContainerProps> = ({ userId, feedType }) => {
  const { posts, loading, error, loadMore, hasMore } = useFeed(
    feedType,
    userId
  );

  return (
    <div className="feed-container">
      <FeedHeader feedType={feedType} />
      <PostCreator onPostCreate={handlePostCreate} />
      <PostList
        posts={posts}
        loading={loading}
        error={error}
        onLoadMore={loadMore}
        hasMore={hasMore}
      />
    </div>
  );
};

// Post list with virtualization
interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onLoadMore: () => void;
  hasMore: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  error,
  onLoadMore,
  hasMore,
}) => {
  const { containerRef, visibleItems } = useVirtualization(posts, POST_HEIGHT);

  return (
    <div ref={containerRef} className="post-list">
      <InfiniteScroll onLoadMore={onLoadMore} hasMore={hasMore}>
        {visibleItems.map(({ item: post, index }) => (
          <PostCard
            key={post.id}
            post={post}
            style={{
              position: "absolute",
              top: index * POST_HEIGHT,
              height: POST_HEIGHT,
            }}
          />
        ))}
      </InfiniteScroll>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

// Individual post component
interface PostCardProps {
  post: Post;
  style?: React.CSSProperties;
}

const PostCard: React.FC<PostCardProps> = ({ post, style }) => {
  const { likePost, sharePost, reportPost } = usePostActions();

  return (
    <article className="post-card" style={style}>
      <PostHeader
        author={post.author}
        timestamp={post.createdAt}
        onReport={() => reportPost(post.id)}
      />
      <PostContent
        content={post.content}
        media={post.media}
        hashtags={post.hashtags}
      />
      <PostActions
        post={post}
        onLike={() => likePost(post.id)}
        onShare={() => sharePost(post.id)}
      />
      <CommentSection postId={post.id} />
    </article>
  );
};
```
{% endraw %}


### Component Patterns

**1. Container/Presentational Pattern**

```typescript
// Container (Smart Component)
const PostContainerComponent = ({ postId }: { postId: string }) => {
  const { post, loading, error } = usePost(postId);
  const { likePost, sharePost } = usePostActions();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!post) return <NotFound />;

  return (
    <PostPresentational
      post={post}
      onLike={() => likePost(postId)}
      onShare={() => sharePost(postId)}
    />
  );
};

// Presentational (Dumb Component)
interface PostPresentationalProps {
  post: Post;
  onLike: () => void;
  onShare: () => void;
}

const PostPresentational: React.FC<PostPresentationalProps> = ({
  post,
  onLike,
  onShare,
}) => (
  <div className="post">
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <button onClick={onLike}>Like ({post.likes})</button>
    <button onClick={onShare}>Share</button>
  </div>
);
```

**2. Compound Components Pattern**

```typescript
// API Design
<Tabs defaultActiveKey="tab1">
  <Tabs.TabList>
    <Tabs.Tab key="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab key="tab2">Tab 2</Tabs.Tab>
  </Tabs.TabList>
  <Tabs.TabPanels>
    <Tabs.TabPanel key="tab1">Panel 1 Content</Tabs.TabPanel>
    <Tabs.TabPanel key="tab2">Panel 2 Content</Tabs.TabPanel>
  </Tabs.TabPanels>
</Tabs>

// Implementation
const TabsContext = React.createContext<{
  activeKey: string;
  setActiveKey: (key: string) => void;
} | null>(null);

const Tabs: React.FC<TabsProps> & {
  TabList: typeof TabList;
  Tab: typeof Tab;
  TabPanels: typeof TabPanels;
  TabPanel: typeof TabPanel;
} = ({ children, defaultActiveKey }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  return (
    <TabsContext.Provider value={% raw %}{{ activeKey, setActiveKey }}{% endraw %}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanels = TabPanels;
Tabs.TabPanel = TabPanel;
```

**3. Render Props Pattern**

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => React.ReactNode;
}

const DataFetcher = <T>({ url, children }: DataFetcherProps<T>) => {
  const { data, loading, error, refetch } = useApiData<T>(url);

  return <>{children({ data, loading, error, refetch })}</>;
};

// Usage
<DataFetcher<User[]> url="/api/users">
  {({ data: users, loading, error, refetch }) => (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {users && <UserList users={users} />}
    </div>
  )}
</DataFetcher>;
```

## State Management Architecture

### State Architecture Patterns

**1. Local State Pattern**

```typescript
// For simple, component-specific state
const Counter = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => setCount(count + step)}>
        Increment by {step}
      </button>
      <input
        type="number"
        value={step}
        onChange={(e) => setStep(parseInt(e.target.value))}
      />
    </div>
  );
};
```

**2. Lifted State Pattern**

```typescript
// When multiple components need the same state
const ParentComponent = () => {
  const [sharedData, setSharedData] = useState(initialData);

  return (
    <div>
      <ChildA data={sharedData} onUpdate={setSharedData} />
      <ChildB data={sharedData} onUpdate={setSharedData} />
    </div>
  );
};
```

**3. Context State Pattern**

```typescript
// For application-wide state
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

const AppStateContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);

const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={% raw %}{{ state, dispatch }}{% endraw %}>
      {children}
    </AppStateContext.Provider>
  );
};
```


**4. External State Management**

```typescript
// Using Zustand for global state
interface StoreState {
  posts: Post[];
  currentUser: User | null;
  addPost: (post: Post) => void;
  setUser: (user: User) => void;
  likePost: (postId: string) => void;
}

const useStore = create<StoreState>((set, get) => ({
  posts: [],
  currentUser: null,

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  setUser: (user) => set({ currentUser: user }),

  likePost: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1, likedByUser: true }
          : post
      ),
    })),
}));
```

### Data Flow Patterns

**Unidirectional Data Flow:**

```
┌─────────────────────────────────────────────────────┐
│                 Data Flow Pattern                   │
│                                                     │
│  User Action → Event Handler → State Update         │
│       ↓              ↓              ↓              │
│   Component → Component Logic → Re-render           │
│                                                     │
│  ←── Props/State Flow (Downward) ─────             │
│  ──── Events/Callbacks (Upward) ────→              │
└─────────────────────────────────────────────────────┘
```

**Implementation Example:**

```typescript
// Parent manages state and provides actions
const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const addPost = useCallback((newPost: Post) => {
    setPosts((current) => [newPost, ...current]);
  }, []);

  const likePost = useCallback((postId: string) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  }, []);

  return (
    <div>
      <PostCreator onSubmit={addPost} />
      <PostList posts={posts} onLike={likePost} />
    </div>
  );
};

// Children receive data and callbacks
const PostList = ({ posts, onLike }) => (
  <div>
    {posts.map((post) => (
      <PostCard key={post.id} post={post} onLike={() => onLike(post.id)} />
    ))}
  </div>
);
```

## Performance & Scalability

### Loading Strategies

**1. Progressive Loading**

```typescript
// Code splitting with lazy loading
const FeedPage = lazy(() => import("./pages/FeedPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));

const App = () => (
  <Router>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </Suspense>
  </Router>
);

// Component-level lazy loading
const HeavyComponent = lazy(() =>
  import("./HeavyComponent").then((module) => ({
    default: module.HeavyComponent,
  }))
);

const ParentComponent = () => {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>Load Heavy Component</button>
      {showHeavy && (
        <Suspense fallback={<ComponentLoader />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
};
```

**2. Resource Prioritization**

```typescript
// Critical resource loading
const CriticalResourceLoader = () => {
  useEffect(() => {
    // Preload critical resources
    const criticalResources = [
      "/api/user/current",
      "/api/feed/recent",
      "/fonts/primary.woff2",
    ];

    criticalResources.forEach((resource) => {
      if (resource.startsWith("/api/")) {
        // Prefetch API data
        fetch(resource).then((response) => response.json());
      } else {
        // Preload static resources
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = resource;
        link.as = resource.includes("font") ? "font" : "fetch";
        document.head.appendChild(link);
      }
    });
  }, []);

  return null;
};
```

**3. Virtualization for Large Lists**


{% raw %}
```typescript
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

const VirtualList = <T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```
{% endraw %}


### Caching Strategies

**1. Browser Caching**

```typescript
// Service Worker caching strategy
const CACHE_NAME = "social-feed-v1";
const CACHE_STRATEGIES = {
  static: "cache-first", // CSS, JS, images
  api: "network-first", // API calls
  feed: "stale-while-revalidate", // Social feed data
};

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/feed")) {
    event.respondWith(staleWhileRevalidate(event.request));
  } else if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(event.request));
  } else if (url.pathname.match(/\.(css|js|png|jpg)$/)) {
    event.respondWith(cacheFirst(event.request));
  }
});
```

**2. Memory Caching**

```typescript
// React Query for API caching
const usePosts = (feedType: string) => {
  return useQuery({
    queryKey: ["posts", feedType],
    queryFn: () => fetchPosts(feedType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Custom hook with memory cache
const useMemoryCache = <T>(key: string, fetcher: () => Promise<T>) => {
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    const cached = cache.current.get(key);
    const now = Date.now();

    // Use cache if less than 5 minutes old
    if (cached && now - cached.timestamp < 5 * 60 * 1000) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    try {
      const result = await fetcher();
      cache.current.set(key, { data: result, timestamp: now });
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher]);

  useEffect(() => {
    getData();
  }, [getData]);

  return { data, loading, refetch: getData };
};
```

## Real-World Examples

### Example 1: Twitter-like Feed

**Requirements:**

- Real-time feed updates
- Infinite scrolling
- Media support (images, videos)
- User interactions (like, retweet, reply)
- 10M+ daily active users

**System Design:**

```
┌─────────────────────────────────────────────────────┐
│                Frontend Architecture                │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              Shell App                      │   │
│  │   Navigation, Auth, Global State           │   │
│  └─────────────────────────────────────────────┘   │
│                          │                         │
│  ┌─────────────────────────────────────────────┐   │
│  │               Feed Module                   │   │
│  │  ┌─────────────┐ ┌─────────────────────┐   │   │
│  │  │ Post List   │ │   Real-time         │   │   │
│  │  │ (Virtual)   │ │   Updates           │   │   │
│  │  └─────────────┘ │   (WebSocket)       │   │   │
│  │  ┌─────────────┐ └─────────────────────┘   │   │
│  │  │   Post      │ ┌─────────────────────┐   │   │
│  │  │ Composer    │ │   Media Upload      │   │   │
│  │  └─────────────┘ │   (Progressive)     │   │   │
│  └─────────────────────────────────────────────┘   │
│                          │                         │
│  ┌─────────────────────────────────────────────┐   │
│  │            State Management                 │   │
│  │  ┌─────────────┐ ┌─────────────────────┐   │   │
│  │  │   Posts     │ │     User Data       │   │   │
│  │  │   Cache     │ │     & Session       │   │   │
│  │  └─────────────┘ └─────────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Key Components:**


{% raw %}
```typescript
// Feed container with real-time updates
const FeedContainer = () => {
  const { posts, loading, error } = useFeed();
  const { socket } = useWebSocket();

  useEffect(() => {
    socket.on("new_post", (post: Post) => {
      // Add new post to feed
      queryClient.setQueryData(["feed"], (old: Post[]) => [post, ...old]);
    });

    socket.on("post_updated", (updatedPost: Post) => {
      // Update existing post
      queryClient.setQueryData(["feed"], (old: Post[]) =>
        old.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
    });

    return () => {
      socket.off("new_post");
      socket.off("post_updated");
    };
  }, [socket, queryClient]);

  return (
    <div className="feed-container">
      <PostComposer />
      <VirtualizedFeed posts={posts} loading={loading} error={error} />
    </div>
  );
};

// Virtualized feed for performance
const VirtualizedFeed = ({ posts, loading, error }) => {
  const { containerRef, visibleItems } = useVirtualization(posts, 200);

  return (
    <div ref={containerRef} className="feed">
      {visibleItems.map(({ item: post, index }) => (
        <PostCard
          key={post.id}
          post={post}
          style={{
            position: "absolute",
            top: index * 200,
            height: 200,
          }}
        />
      ))}
      {loading && <FeedLoader />}
      {error && <ErrorBoundary error={error} />}
    </div>
  );
};
```
{% endraw %}


### Example 2: Google Docs-like Editor

**Requirements:**

- Real-time collaborative editing
- Rich text formatting
- Document structure (headings, lists, etc.)
- Version history
- Offline support

**System Design:**

```
┌─────────────────────────────────────────────────────┐
│            Collaborative Editor Architecture        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              Editor Shell                   │   │
│  │   Toolbar, Menu, Document Navigator        │   │
│  └─────────────────────────────────────────────┘   │
│                          │                         │
│  ┌─────────────────────────────────────────────┐   │
│  │             Editor Core                     │   │
│  │  ┌─────────────┐ ┌─────────────────────┐   │   │
│  │  │   Content   │ │   Operational       │   │   │
│  │  │   Model     │ │   Transform         │   │   │
│  │  │ (ProseMirror│ │   (Conflict         │   │   │
│  │  │   Schema)   │ │   Resolution)       │   │   │
│  │  └─────────────┘ └─────────────────────┘   │   │
│  │  ┌─────────────┐ ┌─────────────────────┐   │   │
│  │  │  Selection  │ │   Collaboration     │   │   │
│  │  │  & Cursor   │ │   Awareness         │   │   │
│  │  │  Management │ │   (Other Users)     │   │   │
│  │  └─────────────┘ └─────────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
│                          │                         │
│  ┌─────────────────────────────────────────────┐   │
│  │           Real-time Sync                    │   │
│  │  ┌─────────────┐ ┌─────────────────────┐   │   │
│  │  │  WebSocket  │ │   Offline Queue     │   │   │
│  │  │ Connection  │ │   & Conflict        │   │   │
│  │  │             │ │   Resolution        │   │   │
│  │  └─────────────┘ └─────────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

This comprehensive framework provides the foundation for tackling any frontend system design interview, with practical examples and proven patterns that scale to real-world applications.
