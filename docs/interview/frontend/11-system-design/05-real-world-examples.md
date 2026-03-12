# Real World System Design Examples

> Phân tích các case studies thực tế để chuẩn bị cho system design interviews.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMMON SD QUESTIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   HIGH FREQUENCY:                                               │
│   ───────────────                                                │
│   • Design News Feed (Facebook, Twitter)                        │
│   • Design Chat Application (Messenger, Slack)                  │
│   • Design Autocomplete/Typeahead                               │
│   • Design E-commerce Product Page                              │
│                                                                   │
│   MEDIUM FREQUENCY:                                             │
│   ─────────────────                                              │
│   • Design Video Player (YouTube, Netflix)                      │
│   • Design Photo Gallery (Instagram)                            │
│   • Design Real-time Dashboard                                  │
│   • Design Notification System                                  │
│                                                                   │
│   ADVANCED:                                                     │
│   ─────────                                                      │
│   • Design Collaborative Editor (Google Docs)                   │
│   • Design Spreadsheet (Google Sheets)                          │
│   • Design Map Application (Google Maps)                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Case Study 1: News Feed

### Requirements

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEWS FEED - REQUIREMENTS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   FUNCTIONAL:                                                   │
│   ───────────                                                    │
│   • Display posts from followed users                           │
│   • Support text, images, videos, links                         │
│   • Infinite scroll with pagination                             │
│   • Like, comment, share interactions                           │
│   • Real-time updates for new posts                             │
│   • Create new posts                                            │
│                                                                   │
│   NON-FUNCTIONAL:                                               │
│   ───────────────                                                │
│   • LCP < 2.5s                                                  │
│   • Smooth scrolling (60fps)                                    │
│   • Work on slow connections                                    │
│   • Accessible (WCAG 2.1 AA)                                    │
│   • Support 10M+ daily users                                    │
│                                                                   │
│   OUT OF SCOPE (clarify with interviewer):                      │
│   ─────────────────────────────────────────                      │
│   • Stories feature                                             │
│   • Ads                                                         │
│   • Ranking algorithm                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEWS FEED ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │                      APP SHELL                             │ │
│   │   Header │ Navigation │ Create Post Button                 │ │
│   └───────────────────────────────────────────────────────────┘ │
│                              │                                   │
│   ┌──────────────────────────┼──────────────────────────┐       │
│   │                          │                          │       │
│   ▼                          ▼                          ▼       │
│   ┌────────────┐    ┌───────────────┐    ┌────────────────┐    │
│   │   FEED    │    │   SIDEBAR     │    │   MODALS       │    │
│   │           │    │               │    │                │    │
│   │ PostList  │    │ Trending      │    │ CreatePost     │    │
│   │ PostCard  │    │ Suggestions   │    │ Comments       │    │
│   │ Comments  │    │ Contacts      │    │ Share          │    │
│   └────────────┘    └───────────────┘    └────────────────┘    │
│                                                                   │
│   STATE MANAGEMENT:                                             │
│   ─────────────────                                              │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │                                                            │ │
│   │   Server State          UI State          Global State    │ │
│   │   (React Query)         (useState)        (Zustand)       │ │
│   │                                                            │ │
│   │   • Posts               • Modal open      • User          │ │
│   │   • Comments            • Active tab      • Theme         │ │
│   │   • User profiles       • Form values     • Notifications │ │
│   │                                                            │ │
│   └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model

```typescript
// Core entities
interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified: boolean;
}

interface Post {
    id: string;
    authorId: string;
    content: string;
    media: Media[];
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    isLikedByMe: boolean;
}

interface Media {
    id: string;
    type: 'image' | 'video' | 'link';
    url: string;
    thumbnailUrl?: string;
    aspectRatio: number;
    alt?: string;
}

interface Comment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: string;
    likesCount: number;
    replies?: Comment[];
}

// API responses
interface FeedResponse {
    posts: Post[];
    users: Record<string, User>; // Embedded for fewer requests
    nextCursor: string | null;
}

// API endpoints
// GET /api/feed?cursor=xxx&limit=20
// POST /api/posts
// POST /api/posts/:id/like
// DELETE /api/posts/:id/like
// GET /api/posts/:id/comments?cursor=xxx
// POST /api/posts/:id/comments
```

### Component Design

```tsx
// Feed with infinite scroll
function Feed() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ['feed'],
        queryFn: ({ pageParam }) => fetchFeed(pageParam),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: 30 * 1000,
    });

    // Flatten pages into single array
    const posts = data?.pages.flatMap(page => page.posts) ?? [];
    const users = data?.pages.reduce(
        (acc, page) => ({ ...acc, ...page.users }),
        {}
    ) ?? {};

    return (
        <div className="feed">
            {/* New posts indicator */}
            <NewPostsIndicator />

            {/* Virtual list for performance */}
            <VirtualList
                items={posts}
                estimateSize={() => 400}
                renderItem={(post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        author={users[post.authorId]}
                    />
                )}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                endReachedThreshold={500}
            />

            {/* Loading indicator */}
            {isFetchingNextPage && <PostSkeleton count={3} />}
        </div>
    );
}

// Post card with interactions
function PostCard({ post, author }: { post: Post; author: User }) {
    const likeMutation = useLikeMutation();
    const [showComments, setShowComments] = useState(false);

    const handleLike = () => {
        likeMutation.mutate({
            postId: post.id,
            liked: !post.isLikedByMe
        });
    };

    return (
        <article className="post-card" aria-labelledby={`post-${post.id}-title`}>
            {/* Author header */}
            <header className="post-header">
                <Avatar src={author.avatarUrl} alt="" />
                <div>
                    <Link to={`/user/${author.username}`}>
                        {author.displayName}
                        {author.isVerified && <VerifiedBadge />}
                    </Link>
                    <time dateTime={post.createdAt}>
                        {formatRelativeTime(post.createdAt)}
                    </time>
                </div>
            </header>

            {/* Content */}
            <div className="post-content">
                <p>{post.content}</p>
                {post.media.length > 0 && (
                    <MediaGallery media={post.media} />
                )}
            </div>

            {/* Interactions */}
            <footer className="post-footer">
                <button
                    onClick={handleLike}
                    aria-pressed={post.isLikedByMe}
                    aria-label={`Like, ${post.likesCount} likes`}
                >
                    <HeartIcon filled={post.isLikedByMe} />
                    <span>{formatCount(post.likesCount)}</span>
                </button>

                <button
                    onClick={() => setShowComments(true)}
                    aria-label={`Comments, ${post.commentsCount} comments`}
                >
                    <CommentIcon />
                    <span>{formatCount(post.commentsCount)}</span>
                </button>

                <ShareButton postId={post.id} />
            </footer>

            {/* Comments drawer */}
            {showComments && (
                <CommentsDrawer
                    postId={post.id}
                    onClose={() => setShowComments(false)}
                />
            )}
        </article>
    );
}
```

### Optimizations

```tsx
// 1. Virtual scrolling
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualFeed({ posts }) {
    const parentRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: posts.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 400,
        overscan: 5,
    });

    return (
        <div ref={parentRef} className="feed-container">
            <div
                style={{
                    height: virtualizer.getTotalSize(),
                    position: 'relative',
                }}
            >
                {virtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            transform: `translateY(${virtualItem.start}px)`,
                            width: '100%',
                        }}
                    >
                        <PostCard post={posts[virtualItem.index]} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// 2. Optimistic updates for likes
function useLikeMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, liked }) =>
            liked ? likePost(postId) : unlikePost(postId),

        onMutate: async ({ postId, liked }) => {
            await queryClient.cancelQueries(['feed']);

            const previousData = queryClient.getQueryData(['feed']);

            queryClient.setQueryData(['feed'], (old) => ({
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    posts: page.posts.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                isLikedByMe: liked,
                                likesCount: post.likesCount + (liked ? 1 : -1),
                            }
                            : post
                    ),
                })),
            }));

            return { previousData };
        },

        onError: (err, variables, context) => {
            queryClient.setQueryData(['feed'], context.previousData);
        },
    });
}

// 3. Image lazy loading with blur placeholder
function MediaImage({ src, alt, aspectRatio, blurDataUrl }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            className="media-image"
            style={{ aspectRatio }}
        >
            {/* Blur placeholder */}
            {!isLoaded && blurDataUrl && (
                <img
                    src={blurDataUrl}
                    alt=""
                    className="blur-placeholder"
                    aria-hidden="true"
                />
            )}

            {/* Actual image */}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={isLoaded ? 'loaded' : 'loading'}
            />
        </div>
    );
}

// 4. Real-time updates
function useRealtimeFeed() {
    const queryClient = useQueryClient();
    const [newPostsCount, setNewPostsCount] = useState(0);

    useEffect(() => {
        const ws = new WebSocket('wss://api.example.com/ws');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'new_post') {
                setNewPostsCount((c) => c + 1);
                // Don't auto-insert - let user click to load
            }

            if (data.type === 'post_updated') {
                queryClient.setQueryData(['feed'], (old) => ({
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((post) =>
                            post.id === data.postId
                                ? { ...post, ...data.updates }
                                : post
                        ),
                    })),
                }));
            }
        };

        return () => ws.close();
    }, [queryClient]);

    const loadNewPosts = () => {
        queryClient.invalidateQueries(['feed']);
        setNewPostsCount(0);
    };

    return { newPostsCount, loadNewPosts };
}
```

---

## 💬 Case Study 2: Chat Application

### Requirements

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHAT APP - REQUIREMENTS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   FUNCTIONAL:                                                   │
│   ───────────                                                    │
│   • Real-time messaging                                         │
│   • 1:1 and group conversations                                 │
│   • Message types: text, images, files                          │
│   • Read receipts, typing indicators                            │
│   • Search conversations and messages                           │
│   • Offline message queue                                       │
│                                                                   │
│   NON-FUNCTIONAL:                                               │
│   ───────────────                                                │
│   • Message delivery < 100ms                                    │
│   • Support 1000+ messages per conversation                     │
│   • Work offline with sync                                      │
│   • End-to-end encryption (optional)                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHAT APP ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      LAYOUT                              │   │
│   ├─────────────────┬───────────────────────────────────────┤   │
│   │                 │                                        │   │
│   │  CONVERSATION   │         MESSAGE PANEL                  │   │
│   │     LIST        │                                        │   │
│   │                 │    ┌─────────────────────────────┐    │   │
│   │  • Search       │    │      MESSAGE LIST            │    │   │
│   │  • Filters      │    │      (Virtual scroll)        │    │   │
│   │  • Conv items   │    │                              │    │   │
│   │                 │    │      • Message bubble        │    │   │
│   │                 │    │      • Timestamp             │    │   │
│   │                 │    │      • Read receipt          │    │   │
│   │                 │    │                              │    │   │
│   │                 │    └─────────────────────────────┘    │   │
│   │                 │    ┌─────────────────────────────┐    │   │
│   │                 │    │      COMPOSER                │    │   │
│   │                 │    │  [Attach] [Input] [Send]     │    │   │
│   │                 │    └─────────────────────────────┘    │   │
│   └─────────────────┴───────────────────────────────────────┘   │
│                                                                   │
│   REAL-TIME LAYER:                                              │
│   ─────────────────                                              │
│   WebSocket ◄──────▶ Message Queue ◄──────▶ Local Store         │
│   (socket.io)        (optimistic)           (IndexedDB)          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Implementation

```tsx
// Message state with optimistic updates
interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'file';
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    createdAt: string;
    tempId?: string; // For optimistic updates
}

// WebSocket hook for real-time
function useChatSocket(conversationId: string) {
    const queryClient = useQueryClient();
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() => {
        const socket = io('wss://chat.example.com', {
            query: { conversationId }
        });

        socket.on('message:new', (message: Message) => {
            queryClient.setQueryData(
                ['messages', conversationId],
                (old: Message[]) => [...old, message]
            );
        });

        socket.on('message:status', ({ messageId, status }) => {
            queryClient.setQueryData(
                ['messages', conversationId],
                (old: Message[]) =>
                    old.map(m => m.id === messageId ? { ...m, status } : m)
            );
        });

        socket.on('typing:start', ({ userId }) => {
            setTypingUsers(prev => [...prev, userId]);
        });

        socket.on('typing:stop', ({ userId }) => {
            setTypingUsers(prev => prev.filter(id => id !== userId));
        });

        return () => socket.disconnect();
    }, [conversationId, queryClient]);

    return { typingUsers };
}

// Send message with optimistic update
function useSendMessage(conversationId: string) {
    const queryClient = useQueryClient();
    const socketRef = useRef<Socket>();

    return useMutation({
        mutationFn: async (content: string) => {
            const tempId = `temp-${Date.now()}`;

            // Optimistic update
            const optimisticMessage: Message = {
                id: tempId,
                tempId,
                conversationId,
                senderId: 'me',
                content,
                type: 'text',
                status: 'sending',
                createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData(
                ['messages', conversationId],
                (old: Message[]) => [...old, optimisticMessage]
            );

            // Send via WebSocket
            return new Promise((resolve, reject) => {
                socketRef.current?.emit('message:send', {
                    content,
                    conversationId,
                    tempId,
                }, (response: { message?: Message; error?: string }) => {
                    if (response.error) reject(response.error);
                    else resolve(response.message);
                });
            });
        },

        onSuccess: (serverMessage, _, context) => {
            // Replace temp message with server message
            queryClient.setQueryData(
                ['messages', conversationId],
                (old: Message[]) =>
                    old.map(m =>
                        m.tempId === serverMessage.tempId
                            ? serverMessage
                            : m
                    )
            );
        },

        onError: (error, content, context) => {
            // Mark message as failed
            queryClient.setQueryData(
                ['messages', conversationId],
                (old: Message[]) =>
                    old.map(m =>
                        m.status === 'sending'
                            ? { ...m, status: 'failed' }
                            : m
                    )
            );
        },
    });
}

// Virtual scroll for messages (reversed)
function MessageList({ conversationId }: { conversationId: string }) {
    const { data: messages = [] } = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => fetchMessages(conversationId),
    });

    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60,
        overscan: 10,
        // Reverse scroll (newest at bottom)
        getItemKey: (index) => messages[index].id,
    });

    // Auto-scroll to bottom on new message
    useEffect(() => {
        virtualizer.scrollToIndex(messages.length - 1);
    }, [messages.length]);

    return (
        <div ref={parentRef} className="message-list">
            <div style={{ height: virtualizer.getTotalSize() }}>
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const message = messages[virtualRow.index];
                    return (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            style={{
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
```

---

## 🔍 Case Study 3: Autocomplete/Typeahead

### Requirements & Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOCOMPLETE DESIGN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   REQUIREMENTS:                                                 │
│   • Show suggestions as user types                              │
│   • Debounce API calls (300ms)                                  │
│   • Support keyboard navigation                                 │
│   • Highlight matching text                                     │
│   • Recent searches                                             │
│   • Accessible (WCAG compliant)                                 │
│                                                                   │
│   ARCHITECTURE:                                                 │
│   ─────────────                                                  │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │   Input                                                  │   │
│   │   ┌─────────────────────────────────────────────────┐   │   │
│   │   │ [🔍] Search products...                     [x] │   │   │
│   │   └─────────────────────────────────────────────────┘   │   │
│   │                                                          │   │
│   │   Suggestions (role="listbox")                          │   │
│   │   ┌─────────────────────────────────────────────────┐   │   │
│   │   │ 🕐 Recent: iPhone case                          │   │   │
│   │   │ 🕐 Recent: laptop stand                         │   │   │
│   │   ├─────────────────────────────────────────────────┤   │   │
│   │   │ 📱 iPhone 15 Pro                           [→]  │   │   │
│   │   │ 📱 iPhone 15 case                          [→]  │   │   │
│   │   │ 📱 iPhone charger                          [→]  │   │   │
│   │   └─────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation

```tsx
interface Suggestion {
    id: string;
    text: string;
    type: 'product' | 'category' | 'recent';
    metadata?: {
        imageUrl?: string;
        category?: string;
    };
}

function Autocomplete({ onSelect }: { onSelect: (value: string) => void }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const listboxId = useId();

    // Debounced search
    const debouncedQuery = useDebounce(query, 300);

    // Fetch suggestions
    const { data: suggestions = [], isLoading } = useQuery({
        queryKey: ['suggestions', debouncedQuery],
        queryFn: () => fetchSuggestions(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
        staleTime: 60 * 1000,
    });

    // Recent searches from localStorage
    const recentSearches = useRecentSearches();

    // Combined suggestions
    const allSuggestions = query.length < 2
        ? recentSearches.map(text => ({ id: text, text, type: 'recent' as const }))
        : suggestions;

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(i =>
                    i < allSuggestions.length - 1 ? i + 1 : 0
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(i =>
                    i > 0 ? i - 1 : allSuggestions.length - 1
                );
                break;

            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0) {
                    handleSelect(allSuggestions[activeIndex]);
                }
                break;

            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSelect = (suggestion: Suggestion) => {
        setQuery(suggestion.text);
        setIsOpen(false);
        recentSearches.add(suggestion.text);
        onSelect(suggestion.text);
    };

    return (
        <div className="autocomplete" onKeyDown={handleKeyDown}>
            <div
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-owns={listboxId}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setActiveIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-activedescendant={
                        activeIndex >= 0
                            ? `suggestion-${allSuggestions[activeIndex]?.id}`
                            : undefined
                    }
                    placeholder="Search products..."
                />

                {query && (
                    <button
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                    >
                        <XIcon />
                    </button>
                )}
            </div>

            {isOpen && allSuggestions.length > 0 && (
                <ul
                    id={listboxId}
                    role="listbox"
                    className="suggestions"
                >
                    {allSuggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.id}
                            id={`suggestion-${suggestion.id}`}
                            role="option"
                            aria-selected={index === activeIndex}
                            className={index === activeIndex ? 'active' : ''}
                            onClick={() => handleSelect(suggestion)}
                        >
                            {suggestion.type === 'recent' && <ClockIcon />}
                            <HighlightedText
                                text={suggestion.text}
                                highlight={query}
                            />
                        </li>
                    ))}
                </ul>
            )}

            {isLoading && <Spinner className="loading" />}

            {/* Screen reader announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {allSuggestions.length} suggestions available
            </div>
        </div>
    );
}

// Highlight matching text
function HighlightedText({ text, highlight }: {
    text: string;
    highlight: string;
}) {
    if (!highlight) return <span>{text}</span>;

    const regex = new RegExp(`(${escapeRegex(highlight)})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i}>{part}</mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
```

---

## ❓ Interview Discussion Points

### Trade-offs to Discuss

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMMON TRADE-OFFS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. REAL-TIME VS POLLING                                       │
│      WebSocket: Lower latency, more complex, needs reconnection │
│      Polling: Simpler, higher latency, more server load         │
│                                                                   │
│   2. OPTIMISTIC VS PESSIMISTIC UPDATES                          │
│      Optimistic: Better UX, needs rollback logic                │
│      Pessimistic: Simpler, slower perceived performance         │
│                                                                   │
│   3. CLIENT VS SERVER RENDERING                                 │
│      CSR: Faster interactions, worse SEO, slower FCP            │
│      SSR: Better SEO, faster FCP, more server load              │
│                                                                   │
│   4. NORMALIZED VS DENORMALIZED STATE                           │
│      Normalized: No duplicates, more selectors needed           │
│      Denormalized: Simpler access, duplicate data issues        │
│                                                                   │
│   5. INFINITE SCROLL VS PAGINATION                              │
│      Infinite: Better mobile UX, memory concerns                │
│      Pagination: Easier bookmarking, more clicks                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Active Recall

1. [ ] Design the data model for a news feed
2. [ ] How do you handle real-time updates in a feed?
3. [ ] Implement optimistic updates for likes
4. [ ] Design keyboard navigation for autocomplete
5. [ ] What are the trade-offs of WebSocket vs polling?

---

> **Module hoàn thành!** Quay lại [README.md](./README.md) để xem tổng quan module.
