---
layout: page
title: "Frontend System Design for FAANG Interviews"
difficulty: Hard
category: System Design
tags: [Architecture, Scalability, Performance, React, TypeScript]
companies: [Google, Meta, Amazon, Microsoft, Apple, Netflix]
---

# Frontend System Design for FAANG Interviews

## 🏗️ Essential System Design Patterns

### 1. Design a Social Media Feed (Meta/Instagram Style)

#### Requirements Gathering (Always Start Here!)
```typescript
// Functional Requirements
interface FeedRequirements {
  displayPosts: boolean;        // Show user posts
  infiniteScroll: boolean;      // Load more content
  realTimeUpdates: boolean;     // Live notifications
  interactions: boolean;        // Like, comment, share
  mediaSupport: boolean;        // Images, videos
  personalization: boolean;     // Algorithm-based feed
}

// Non-Functional Requirements
interface PerformanceRequirements {
  initialLoadTime: number;      // < 2 seconds
  scrollPerformance: number;    // 60 FPS
  memoryUsage: number;          // < 100MB
  offlineSupport: boolean;      // PWA capabilities
  accessibility: boolean;       // WCAG compliance
}
```

#### High-Level Architecture
```typescript
// Component Architecture
interface FeedArchitecture {
  // Data Layer
  dataStore: {
    posts: PostStore;
    users: UserStore;
    interactions: InteractionStore;
    cache: CacheLayer;
  };
  
  // Business Logic Layer
  services: {
    feedService: FeedService;
    mediaService: MediaService;
    notificationService: NotificationService;
    analyticsService: AnalyticsService;
  };
  
  // Presentation Layer
  components: {
    feedContainer: FeedContainer;
    postCard: PostCard;
    virtualScroller: VirtualScroller;
    mediaPlayer: MediaPlayer;
  };
}

// State Management Strategy
class FeedStore {
  private posts: Map<string, Post> = new Map();
  private feedOrder: string[] = [];
  private hasMore: boolean = true;
  private loading: boolean = false;
  
  async loadInitialFeed(): Promise<void> {
    this.loading = true;
    try {
      const response = await this.feedService.getFeed({ limit: 20 });
      this.posts.clear();
      this.feedOrder = [];
      
      response.posts.forEach(post => {
        this.posts.set(post.id, post);
        this.feedOrder.push(post.id);
      });
      
      this.hasMore = response.hasMore;
    } finally {
      this.loading = false;
    }
  }
  
  async loadMorePosts(): Promise<void> {
    if (this.loading || !this.hasMore) return;
    
    this.loading = true;
    try {
      const lastPostId = this.feedOrder[this.feedOrder.length - 1];
      const response = await this.feedService.getFeed({
        after: lastPostId,
        limit: 10
      });
      
      response.posts.forEach(post => {
        this.posts.set(post.id, post);
        this.feedOrder.push(post.id);
      });
      
      this.hasMore = response.hasMore;
    } finally {
      this.loading = false;
    }
  }
}
```

#### Virtual Scrolling Implementation
```typescript
// High-performance virtual scrolling for large feeds
interface VirtualScrollerProps {
  items: string[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (id: string, index: number) => React.ReactNode;
  onLoadMore: () => void;
}

const VirtualScroller: React.FC<VirtualScrollerProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  onLoadMore
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate visible range
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  // Preload buffer for smooth scrolling
  const bufferSize = 5;
  const visibleStartIndex = Math.max(0, startIndex - bufferSize);
  const visibleEndIndex = Math.min(items.length, endIndex + bufferSize);
  
  const handleScroll = useCallback(
    throttle((e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      setScrollTop(scrollTop);
      
      // Load more when near bottom
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      
      if (scrollTop + clientHeight >= scrollHeight - 1000) {
        onLoadMore();
      }
    }, 16), // 60 FPS
    [onLoadMore]
  );
  
  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {items.slice(visibleStartIndex, visibleEndIndex).map((itemId, index) => (
          <div
            key={itemId}
            style={{
              position: 'absolute',
              top: (visibleStartIndex + index) * itemHeight,
              width: '100%',
              height: itemHeight
            }}
          >
            {renderItem(itemId, visibleStartIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 2. Design a Real-Time Chat Application (WhatsApp/Slack Style)

#### WebSocket Architecture
```typescript
// Real-time messaging system
class ChatService {
  private ws: WebSocket | null = null;
  private messageQueue: Message[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`wss://api.chat.com/ws?userId=${userId}`);
      
      this.ws.onopen = () => {
        console.log('Connected to chat service');
        this.reconnectAttempts = 0;
        this.flushMessageQueue();
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleIncomingMessage(message);
      };
      
      this.ws.onclose = () => {
        console.log('Disconnected from chat service');
        this.attemptReconnect(userId);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });
  }
  
  sendMessage(message: Message): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
    }
  }
  
  private attemptReconnect(userId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect(userId);
      }, delay);
    }
  }
  
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      this.sendMessage(message);
    }
  }
}

// Message state management with optimistic updates
class MessageStore {
  private messages: Map<string, Message> = new Map();
  private conversations: Map<string, string[]> = new Map();
  
  addMessage(message: Message): void {
    // Optimistic update
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      ...message,
      id: tempId,
      status: 'sending' as const,
      timestamp: new Date()
    };
    
    this.messages.set(tempId, optimisticMessage);
    this.addToConversation(message.conversationId, tempId);
    
    // Send to server
    this.chatService.sendMessage(message).then(
      (serverMessage) => {
        // Replace optimistic message with server response
        this.messages.delete(tempId);
        this.messages.set(serverMessage.id, {
          ...serverMessage,
          status: 'sent'
        });
        this.replaceInConversation(message.conversationId, tempId, serverMessage.id);
      },
      (error) => {
        // Mark as failed
        this.messages.set(tempId, {
          ...optimisticMessage,
          status: 'failed'
        });
      }
    );
  }
}
```

## 🎯 FAANG Interview Focus Areas

### Google: Technical Excellence
- **Scalability**: How does your solution handle 1B+ users?
- **Performance**: Core Web Vitals optimization
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: Unit, integration, and E2E testing strategies

### Meta: User Experience
- **Real-time Features**: WebSocket, Server-Sent Events
- **Mobile Performance**: React Native considerations
- **A/B Testing**: Feature flag implementations
- **Analytics**: User behavior tracking

### Amazon: Customer Obsession
- **Reliability**: Error handling and fallback strategies
- **Cost Optimization**: Bundle size, CDN usage
- **Global Scale**: Internationalization, localization
- **Security**: XSS, CSRF protection

## 📊 System Design Interview Template

### 1. Requirements Clarification (5 minutes)
```typescript
// Always ask these questions:
interface SystemRequirements {
  // Functional
  coreFeatures: string[];
  userTypes: string[];
  platforms: string[];
  
  // Non-functional
  expectedUsers: number;
  readWriteRatio: number;
  latencyRequirements: number;
  availabilityRequirements: number;
}
```

### 2. High-Level Design (10 minutes)
- Draw main components
- Show data flow
- Identify APIs needed

### 3. Detailed Design (20 minutes)
- Component architecture
- State management
- Performance optimizations
- Error handling

### 4. Scale & Optimize (10 minutes)
- Caching strategies
- CDN implementation
- Database considerations
- Monitoring and alerting

## 💡 Pro Tips for System Design Interviews

1. **Start simple, then add complexity**
2. **Always consider mobile-first design**
3. **Discuss trade-offs explicitly**
4. **Include monitoring and observability**
5. **Consider accessibility from the start**
6. **Think about edge cases and error states**