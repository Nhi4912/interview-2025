# Company-Specific Interview Patterns & Expectations

## Overview
Each Big Tech company has distinct interview styles, technical focuses, and cultural values. Understanding these patterns significantly improves preparation effectiveness.

---

## Google

### **Interview Structure**
- **Phone Screen**: 45 mins technical coding
- **Onsite**: 4-5 rounds (coding, system design, behavioral)
- **Focus**: Algorithms, scalability, clean code

### **Technical Emphasis**
```typescript
// Google favors algorithmic thinking and optimization
// Example: Implement autocomplete with trie optimization

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord = false;
  frequency = 0;
  suggestions: string[] = [];
}

class GoogleAutocomplete {
  private root = new TrieNode();
  private maxSuggestions = 10;

  // Google's approach: O(1) suggestion retrieval through preprocessing
  insert(word: string, frequency = 1): void {
    let node = this.root;
    
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      
      // Precompute top suggestions at each node (Google optimization)
      this.updateSuggestions(node, word, frequency);
    }
    
    node.isEndOfWord = true;
    node.frequency = frequency;
  }

  private updateSuggestions(node: TrieNode, word: string, frequency: number): void {
    // Keep suggestions sorted by frequency (descending)
    node.suggestions.push(word);
    node.suggestions.sort((a, b) => this.getFrequency(b) - this.getFrequency(a));
    
    if (node.suggestions.length > this.maxSuggestions) {
      node.suggestions = node.suggestions.slice(0, this.maxSuggestions);
    }
  }

  // O(k) where k is prefix length - Google's performance requirement
  getSuggestions(prefix: string): string[] {
    let node = this.root;
    
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }
    
    return node.suggestions;
  }
}
```

### **Behavioral Expectations**
- **Googleyness**: Intellectual humility, collaboration
- **Leadership**: "Lead without authority" examples
- **Problem-Solving**: Break down ambiguous problems

### **Common Questions**
1. "Design Google Search's autocomplete feature"
2. "Implement a web crawler respecting robots.txt"
3. "Design YouTube's video recommendation system"
4. "How would you handle 1B+ searches per day?"

### **Success Strategies**
- Think about scale from the beginning
- Discuss edge cases and error handling
- Consider internationalization (i18n)
- Mention accessibility (a11y) considerations

---

## Meta (Facebook)

### **Interview Structure**
- **Phone Screen**: 45 mins coding + React discussion
- **Onsite**: 2 coding, 1 system design, 1 behavioral
- **Focus**: React ecosystem, real-time systems, user engagement

### **Technical Emphasis**
{% raw %}
```typescript
// Meta emphasizes React patterns and real-time features
// Example: Implement Facebook's News Feed with optimistic updates

interface Post {
  id: string;
  content: string;
  author: User;
  timestamp: number;
  likes: number;
  comments: Comment[];
  isOptimistic?: boolean;
}

class NewsFeedManager {
  private posts: Map<string, Post> = new Map();
  private observers: Set<(posts: Post[]) => void> = new Set();
  private websocket: WebSocket;

  constructor(userId: string) {
    this.websocket = new WebSocket(`wss://api.facebook.com/realtime/${userId}`);
    this.setupRealTimeUpdates();
  }

  // Meta's optimistic update pattern
  async createPost(content: string, author: User): Promise<void> {
    const optimisticPost: Post = {
      id: `temp-${Date.now()}`,
      content,
      author,
      timestamp: Date.now(),
      likes: 0,
      comments: [],
      isOptimistic: true
    };

    // 1. Immediately update UI (optimistic)
    this.addPost(optimisticPost);

    try {
      // 2. Send to server
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorId: author.id })
      });

      const realPost: Post = await response.json();

      // 3. Replace optimistic post with real post
      this.posts.delete(optimisticPost.id);
      this.addPost(realPost);

    } catch (error) {
      // 4. Rollback on failure
      this.posts.delete(optimisticPost.id);
      this.notifyObservers();
      throw error;
    }
  }

  // Meta's infinite scroll pattern
  async loadMorePosts(cursor?: string): Promise<void> {
    const response = await fetch(`/api/feed?cursor=${cursor}&limit=20`);
    const { posts, nextCursor } = await response.json();

    posts.forEach((post: Post) => this.addPost(post));
    return nextCursor;
  }

  private setupRealTimeUpdates(): void {
    this.websocket.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      switch (update.type) {
        case 'new_post':
          this.addPost(update.post);
          break;
        case 'post_liked':
          this.updatePost(update.postId, { likes: update.newLikeCount });
          break;
        case 'new_comment':
          this.addComment(update.postId, update.comment);
          break;
      }
    };
  }

  subscribe(callback: (posts: Post[]) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }
}

// React Hook for Meta-style state management
function useNewsFeed(userId: string) {
  const [feedManager] = useState(() => new NewsFeedManager(userId));
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return feedManager.subscribe(setPosts);
  }, [feedManager]);

  const createPost = useCallback(async (content: string, author: User) => {
    setLoading(true);
    try {
      await feedManager.createPost(content, author);
    } finally {
      setLoading(false);
    }
  }, [feedManager]);

  return { posts, createPost, loading };
}
```
{% endraw %}

### **Behavioral Expectations**
- **Move Fast**: Bias for action, rapid iteration
- **Be Bold**: Take calculated risks
- **Focus on Impact**: Measure success by user value

### **Common Questions**
1. "Build Facebook's like button with real-time updates"
2. "Design Instagram's photo upload and processing pipeline"
3. "Implement WhatsApp's message encryption"
4. "How would you optimize React for mobile performance?"

### **Success Strategies**
- Emphasize user experience first
- Discuss A/B testing strategies
- Consider mobile-first design
- Show understanding of React internals

---

## Amazon

### **Interview Structure**
- **Phone Screen**: 60 mins technical + leadership principles
- **Onsite**: 4-5 rounds including "Bar Raiser"
- **Focus**: Customer obsession, operational excellence, scalability

### **Technical Emphasis**
```typescript
// Amazon emphasizes scalability and customer-focused solutions
// Example: Design Amazon's product recommendation engine

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
}

interface UserBehavior {
  userId: string;
  productId: string;
  action: 'view' | 'purchase' | 'cart' | 'wishlist';
  timestamp: number;
}

class AmazonRecommendationEngine {
  private userBehaviors: Map<string, UserBehavior[]> = new Map();
  private productSimilarity: Map<string, Map<string, number>> = new Map();
  private userSimilarity: Map<string, Map<string, number>> = new Map();

  // Amazon's collaborative filtering approach
  generateRecommendations(userId: string, limit = 10): Product[] {
    const userBehaviors = this.userBehaviors.get(userId) || [];
    const recommendations: Map<string, number> = new Map();

    // 1. Item-based collaborative filtering
    for (const behavior of userBehaviors) {
      const similarProducts = this.productSimilarity.get(behavior.productId);
      
      if (similarProducts) {
        for (const [productId, similarity] of similarProducts) {
          if (!this.hasUserInteracted(userId, productId)) {
            const currentScore = recommendations.get(productId) || 0;
            recommendations.set(productId, currentScore + similarity * this.getActionWeight(behavior.action));
          }
        }
      }
    }

    // 2. User-based collaborative filtering
    const similarUsers = this.userSimilarity.get(userId);
    if (similarUsers) {
      for (const [similarUserId, userSimilarityScore] of similarUsers) {
        const similarUserBehaviors = this.userBehaviors.get(similarUserId) || [];
        
        for (const behavior of similarUserBehaviors) {
          if (!this.hasUserInteracted(userId, behavior.productId)) {
            const currentScore = recommendations.get(behavior.productId) || 0;
            recommendations.set(
              behavior.productId, 
              currentScore + userSimilarityScore * this.getActionWeight(behavior.action)
            );
          }
        }
      }
    }

    // 3. Sort and return top recommendations
    return Array.from(recommendations.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([productId]) => this.getProduct(productId))
      .filter(Boolean);
  }

  // Amazon's real-time behavior tracking
  trackUserBehavior(behavior: UserBehavior): void {
    const userBehaviors = this.userBehaviors.get(behavior.userId) || [];
    userBehaviors.push(behavior);
    this.userBehaviors.set(behavior.userId, userBehaviors);

    // Update similarities in background (Amazon's approach)
    this.scheduleModelUpdate();
  }

  private getActionWeight(action: UserBehavior['action']): number {
    // Amazon's action weighting strategy
    const weights = {
      'view': 1,
      'cart': 3,
      'wishlist': 2,
      'purchase': 5
    };
    return weights[action];
  }

  // Amazon's distributed computing approach
  private scheduleModelUpdate(): void {
    // Debounce updates to reduce computational load
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => {
      this.updateSimilarityMatrices();
    }, 60000); // Update every minute
  }

  private updateSimilarityMatrices(): void {
    // Compute item-item similarity using cosine similarity
    // This would typically run on distributed computing clusters
    this.computeProductSimilarity();
    this.computeUserSimilarity();
  }
}

// Amazon's microservices architecture pattern
class ProductRecommendationService {
  private recommendationEngine: AmazonRecommendationEngine;
  private cacheManager: CacheManager;
  private metricsCollector: MetricsCollector;

  async getRecommendations(userId: string): Promise<Product[]> {
    const cacheKey = `recommendations:${userId}`;
    
    // 1. Try cache first (Amazon's caching strategy)
    let recommendations = await this.cacheManager.get(cacheKey);
    
    if (!recommendations) {
      // 2. Generate recommendations
      const startTime = Date.now();
      recommendations = this.recommendationEngine.generateRecommendations(userId);
      
      // 3. Cache results
      await this.cacheManager.set(cacheKey, recommendations, 3600); // 1 hour TTL
      
      // 4. Collect metrics
      this.metricsCollector.recordLatency('recommendation_generation', Date.now() - startTime);
    }

    return recommendations;
  }
}
```

### **Leadership Principles Focus**
- **Customer Obsession**: Always start with customer needs
- **Ownership**: Think long-term, act on behalf of company
- **Invent and Simplify**: Seek innovative solutions
- **Learn and Be Curious**: Continuous improvement mindset

### **Common Questions**
1. "Design Amazon's shopping cart with persistence"
2. "Implement Amazon Prime's delivery optimization"
3. "Build a distributed logging system for AWS"
4. "Tell me about a time you had to make a decision with incomplete information"

### **Success Strategies**
- Use STAR method for behavioral questions
- Discuss trade-offs and customer impact
- Emphasize operational excellence
- Show data-driven decision making

---

## Microsoft

### **Interview Structure**
- **Phone Screen**: 45 mins technical
- **Onsite**: 4-5 rounds (coding, design, behavioral, role-specific)
- **Focus**: Collaboration, inclusive design, enterprise solutions

### **Technical Emphasis**
```typescript
// Microsoft emphasizes accessibility and enterprise-grade solutions
// Example: Implement Microsoft Teams' collaborative whiteboard

interface WhiteboardElement {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'text' | 'image';
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    fontSize?: number;
  };
  data: any;
  lastModified: number;
  modifiedBy: string;
}

class MicrosoftWhiteboard {
  private elements: Map<string, WhiteboardElement> = new Map();
  private undoStack: WhiteboardElement[][] = [];
  private redoStack: WhiteboardElement[][] = [];
  private collaborationHub: signalR.HubConnection;
  private accessibilityManager: AccessibilityManager;

  constructor(roomId: string) {
    this.setupSignalR(roomId);
    this.accessibilityManager = new AccessibilityManager();
    this.setupKeyboardShortcuts();
  }

  // Microsoft's accessibility-first approach
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      // Ensure keyboard navigation works for screen readers
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              this.redo();
            } else {
              this.undo();
            }
            break;
          case 'a':
            event.preventDefault();
            this.selectAll();
            break;
          case 'c':
            event.preventDefault();
            this.copy();
            break;
          case 'v':
            event.preventDefault();
            this.paste();
            break;
        }
      }

      // Arrow key navigation for accessibility
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.handleArrowKeyNavigation(event.key, event.shiftKey);
      }
    });
  }

  // Microsoft's real-time collaboration with conflict resolution
  addElement(element: Omit<WhiteboardElement, 'id' | 'lastModified' | 'modifiedBy'>): void {
    const newElement: WhiteboardElement = {
      ...element,
      id: crypto.randomUUID(),
      lastModified: Date.now(),
      modifiedBy: this.getCurrentUser().id
    };

    // Save state for undo
    this.saveStateForUndo();

    // Add to local state
    this.elements.set(newElement.id, newElement);

    // Broadcast to other users
    this.collaborationHub.invoke('ElementAdded', newElement);

    // Update accessibility tree
    this.accessibilityManager.announceChange(`Added ${element.type} element`);

    // Auto-save (Microsoft's enterprise approach)
    this.autoSave();
  }

  // Microsoft's conflict resolution strategy
  handleRemoteElementUpdate(element: WhiteboardElement): void {
    const localElement = this.elements.get(element.id);

    if (!localElement) {
      // New element from remote user
      this.elements.set(element.id, element);
    } else if (element.lastModified > localElement.lastModified) {
      // Remote element is newer - apply update
      this.elements.set(element.id, element);
      
      // Notify user of conflict resolution
      this.accessibilityManager.announceChange(
        `Element updated by ${element.modifiedBy}`
      );
    }
    // If local element is newer, ignore remote update

    this.render();
  }

  // Microsoft's enterprise-grade export functionality
  async exportToPowerPoint(): Promise<Blob> {
    const presentation = new PowerPointDocument();
    const slide = presentation.addSlide();

    // Convert whiteboard elements to PowerPoint shapes
    for (const element of this.elements.values()) {
      switch (element.type) {
        case 'rectangle':
          slide.addRectangle({
            x: element.position.x,
            y: element.position.y,
            width: element.size.width,
            height: element.size.height,
            fill: element.style.fillColor,
            stroke: element.style.strokeColor
          });
          break;
        case 'text':
          slide.addText({
            text: element.data.text,
            x: element.position.x,
            y: element.position.y,
            fontSize: element.style.fontSize,
            color: element.style.fillColor
          });
          break;
        // Handle other element types...
      }
    }

    return presentation.export();
  }

  // Microsoft's accessibility implementation
  private setupAccessibility(): void {
    // Ensure all elements have proper ARIA labels
    this.elements.forEach((element, id) => {
      const domElement = document.querySelector(`[data-element-id="${id}"]`);
      if (domElement) {
        domElement.setAttribute('role', this.getAriaRole(element.type));
        domElement.setAttribute('aria-label', this.getAriaLabel(element));
        domElement.setAttribute('tabindex', '0');
      }
    });

    // Implement focus management
    this.setupFocusManagement();
  }

  private getAriaRole(elementType: string): string {
    const roleMap = {
      'rectangle': 'img',
      'circle': 'img',
      'line': 'img',
      'text': 'textbox',
      'image': 'img'
    };
    return roleMap[elementType] || 'generic';
  }
}

// Microsoft's enterprise integration pattern
class TeamsWhiteboardIntegration {
  private whiteboard: MicrosoftWhiteboard;
  private teamsContext: microsoftTeams.Context;

  constructor(roomId: string) {
    this.whiteboard = new MicrosoftWhiteboard(roomId);
    this.setupTeamsIntegration();
  }

  private setupTeamsIntegration(): void {
    microsoftTeams.initialize();
    
    microsoftTeams.getContext((context) => {
      this.teamsContext = context;
      
      // Enable Teams-specific features
      this.enableTeamsFeatures();
    });
  }

  private enableTeamsFeatures(): void {
    // Share whiteboard in Teams chat
    microsoftTeams.shareDeepLink({
      subEntityId: this.whiteboard.getId(),
      subEntityLabel: 'Collaboration Whiteboard',
      subEntityWebUrl: window.location.href
    });

    // Integrate with Teams notifications
    this.whiteboard.onElementAdded((element) => {
      if (this.teamsContext.channelId) {
        this.sendTeamsNotification(`New ${element.type} added to whiteboard`);
      }
    });
  }
}
```

### **Cultural Values**
- **Respect**: Inclusive and diverse perspectives
- **Integrity**: Ethical decision-making
- **Accountability**: Own your commitments

### **Common Questions**
1. "Design Microsoft Office's real-time collaboration"
2. "Implement accessibility features for a web application"
3. "Build a plugin system for VS Code"
4. "How would you make an application work offline?"

### **Success Strategies**
- Emphasize accessibility from the start
- Discuss cross-platform compatibility
- Show understanding of enterprise needs
- Demonstrate inclusive design thinking

---

## Apple

### **Interview Structure**
- **Phone Screen**: 45 mins technical + attention to detail
- **Onsite**: 3-4 rounds (coding, design, behavioral)
- **Focus**: User experience, performance, attention to detail

### **Technical Emphasis**
```typescript
// Apple emphasizes user experience and performance optimization
// Example: Implement Safari's intelligent tab management

interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  lastAccessed: number;
  memoryUsage: number;
  isActive: boolean;
  isPinned: boolean;
  isPlaying: boolean;
  loadState: 'loading' | 'loaded' | 'suspended';
}

class SafariTabManager {
  private tabs: Map<string, Tab> = new Map();
  private activeTabId: string | null = null;
  private memoryThreshold = 1024 * 1024 * 512; // 512MB
  private suspensionDelay = 30 * 60 * 1000; // 30 minutes
  private performanceObserver: PerformanceObserver;

  constructor() {
    this.setupMemoryMonitoring();
    this.setupSuspensionScheduler();
    this.setupPerformanceOptimizations();
  }

  // Apple's memory-conscious tab management
  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memoryInfo = (performance as any).memory;
        
        if (memoryInfo.usedJSHeapSize > this.memoryThreshold) {
          this.intelligentlySuspendTabs();
        }
      }, 5000);
    }
  }

  // Apple's intelligent tab suspension algorithm
  private intelligentlySuspendTabs(): void {
    const candidatesForSuspension = Array.from(this.tabs.values())
      .filter(tab => !tab.isActive && !tab.isPinned && !tab.isPlaying)
      .filter(tab => tab.loadState === 'loaded')
      .sort((a, b) => a.lastAccessed - b.lastAccessed); // Least recently used first

    for (const tab of candidatesForSuspension) {
      if (Date.now() - tab.lastAccessed > this.suspensionDelay) {
        this.suspendTab(tab.id);
        
        // Only suspend one tab at a time to avoid UI jank
        break;
      }
    }
  }

  private suspendTab(tabId: string): void {
    const tab = this.tabs.get(tabId);
    if (!tab) return;

    // Save tab state before suspension
    const tabState = this.captureTabState(tab);
    
    // Update tab status
    tab.loadState = 'suspended';
    tab.memoryUsage = 0;

    // Store state for restoration
    sessionStorage.setItem(`tab-state-${tabId}`, JSON.stringify(tabState));

    // Remove from DOM to free memory
    this.removeTabFromDOM(tabId);

    console.log(`Tab ${tab.title} suspended to save memory`);
  }

  // Apple's smooth animations and transitions
  createTab(url: string): string {
    const tabId = crypto.randomUUID();
    const tab: Tab = {
      id: tabId,
      url,
      title: 'Loading...',
      lastAccessed: Date.now(),
      memoryUsage: 0,
      isActive: false,
      isPinned: false,
      isPlaying: false,
      loadState: 'loading'
    };

    this.tabs.set(tabId, tab);

    // Apple's signature smooth animation
    this.animateTabCreation(tab);
    
    return tabId;
  }

  private animateTabCreation(tab: Tab): void {
    const tabElement = this.createTabElement(tab);
    
    // Apple's smooth scaling animation
    tabElement.style.transform = 'scale(0.8)';
    tabElement.style.opacity = '0';
    
    requestAnimationFrame(() => {
      tabElement.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
      tabElement.style.transform = 'scale(1)';
      tabElement.style.opacity = '1';
    });
  }

  // Apple's attention to visual details
  private createTabElement(tab: Tab): HTMLElement {
    const tabElement = document.createElement('div');
    tabElement.className = 'safari-tab';
    tabElement.setAttribute('data-tab-id', tab.id);

    tabElement.innerHTML = `
      <div class="tab-favicon">
        <img src="${tab.favicon || '/default-favicon.ico'}" alt="" />
      </div>
      <div class="tab-title">${tab.title}</div>
      <div class="tab-close-button" aria-label="Close tab">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
      ${tab.isPlaying ? '<div class="tab-audio-indicator"></div>' : ''}
      ${tab.loadState === 'loading' ? '<div class="tab-loading-spinner"></div>' : ''}
    `;

    // Apple's hover effects
    tabElement.addEventListener('mouseenter', () => {
      tabElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });

    tabElement.addEventListener('mouseleave', () => {
      tabElement.style.backgroundColor = '';
    });

    return tabElement;
  }

  // Apple's performance optimization focus
  private setupPerformanceOptimizations(): void {
    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      for (const entry of entries) {
        if (entry.entryType === 'navigation') {
          const navigationEntry = entry as PerformanceNavigationTiming;
          
          // Track slow-loading tabs
          if (navigationEntry.loadEventEnd - navigationEntry.navigationStart > 5000) {
            console.warn(`Slow tab detected: ${navigationEntry.name}`);
            this.optimizeSlowTab(navigationEntry.name);
          }
        }
      }
    });

    this.performanceObserver.observe({ entryTypes: ['navigation', 'paint'] });
  }

  private optimizeSlowTab(url: string): void {
    // Apple's automatic optimization
    const tab = Array.from(this.tabs.values()).find(t => t.url === url);
    if (tab) {
      // Reduce image quality for slow connections
      this.injectPerformanceOptimizations(tab.id);
    }
  }

  // Apple's seamless tab restoration
  private async restoreTab(tabId: string): Promise<void> {
    const savedState = sessionStorage.getItem(`tab-state-${tabId}`);
    if (!savedState) return;

    const tabState = JSON.parse(savedState);
    const tab = this.tabs.get(tabId);
    
    if (tab) {
      tab.loadState = 'loading';
      
      // Smooth restoration animation
      const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
      if (tabElement) {
        tabElement.classList.add('restoring');
        
        setTimeout(() => {
          tab.loadState = 'loaded';
          tabElement.classList.remove('restoring');
        }, 500);
      }
    }
  }
}

// Apple's focus on user privacy
class PrivacyManager {
  private trackingPrevention = true;
  private intelligentTrackingPrevention = true;

  blockTracker(url: string, type: 'cookie' | 'fingerprint' | 'script'): boolean {
    if (!this.trackingPrevention) return false;

    // Apple's Intelligent Tracking Prevention logic
    if (this.intelligentTrackingPrevention) {
      return this.evaluateTrackingRisk(url, type);
    }

    return type === 'cookie'; // Basic blocking
  }

  private evaluateTrackingRisk(url: string, type: string): boolean {
    // Simplified ITP algorithm
    const domain = new URL(url).hostname;
    const isFirstParty = domain === window.location.hostname;
    
    if (isFirstParty) return false;
    
    // Check against known tracking domains
    return this.isKnownTracker(domain);
  }
}
```

### **Design Philosophy**
- **Simplicity**: Elegant, minimal solutions
- **Performance**: Smooth, responsive interfaces
- **Privacy**: User data protection
- **Accessibility**: Inclusive design

### **Common Questions**
1. "Optimize a web page for 60 FPS scrolling"
2. "Implement Safari's Reader Mode"
3. "Design a privacy-focused analytics system"
4. "How would you reduce JavaScript bundle size?"

### **Success Strategies**
- Focus on user experience first
- Discuss performance implications
- Consider privacy and security
- Show attention to visual details

---

## Netflix

### **Interview Structure**
- **Phone Screen**: 45 mins technical
- **Onsite**: 4 rounds (coding, system design, culture fit)
- **Focus**: Scale, A/B testing, streaming optimization

### **Technical Emphasis**
```typescript
// Netflix emphasizes A/B testing and streaming optimization
// Example: Implement Netflix's video player with adaptive bitrate

interface VideoQuality {
  bitrate: number;
  resolution: { width: number; height: number };
  codec: string;
}

interface StreamingMetrics {
  bufferHealth: number;
  throughput: number;
  droppedFrames: number;
  playbackStalls: number;
  startupTime: number;
}

class NetflixVideoPlayer {
  private video: HTMLVideoElement;
  private availableQualities: VideoQuality[] = [];
  private currentQuality: VideoQuality;
  private metrics: StreamingMetrics;
  private abTestVariant: string;
  private bufferTarget = 30; // seconds
  private adaptationEngine: AdaptationEngine;

  constructor(videoElement: HTMLVideoElement, contentId: string) {
    this.video = videoElement;
    this.abTestVariant = this.getABTestVariant(contentId);
    this.adaptationEngine = new AdaptationEngine();
    this.setupEventListeners();
    this.initializeMetrics();
  }

  // Netflix's A/B testing framework integration
  private getABTestVariant(contentId: string): string {
    const userId = this.getCurrentUserId();
    const experiments = [
      { name: 'preroll_optimization', variants: ['control', 'fast_start'] },
      { name: 'quality_selection', variants: ['conservative', 'aggressive'] },
      { name: 'buffer_strategy', variants: ['small_buffer', 'large_buffer'] }
    ];

    // Consistent assignment based on user ID and content
    const hash = this.hashFunction(userId + contentId);
    return experiments[hash % experiments.length].variants[hash % 2];
  }

  // Netflix's adaptive bitrate algorithm
  private adaptBitrate(): void {
    const metrics = this.getCurrentMetrics();
    const recommendation = this.adaptationEngine.getQualityRecommendation(
      metrics,
      this.availableQualities,
      this.abTestVariant
    );

    if (recommendation !== this.currentQuality) {
      this.switchQuality(recommendation);
      
      // Log A/B test metrics
      this.logABTestMetric('quality_switch', {
        from: this.currentQuality.bitrate,
        to: recommendation.bitrate,
        reason: recommendation.reason,
        variant: this.abTestVariant
      });
    }
  }

  // Netflix's preloading strategy
  async preloadNextEpisode(nextEpisodeId: string): Promise<void> {
    // Only preload if user typically watches next episode
    const userBehavior = await this.getUserBehaviorAnalytics();
    
    if (userBehavior.nextEpisodeProbability > 0.7) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'video';
      preloadLink.href = this.getVideoUrl(nextEpisodeId, 'low');
      document.head.appendChild(preloadLink);

      this.logABTestMetric('preload_decision', {
        decision: 'preload',
        probability: userBehavior.nextEpisodeProbability,
        variant: this.abTestVariant
      });
    }
  }

  // Netflix's quality switching with smooth transitions
  private async switchQuality(newQuality: VideoQuality): Promise<void> {
    const currentTime = this.video.currentTime;
    const wasPlaying = !this.video.paused;

    // Netflix's seamless switching technique
    if (this.isSeamlessSwitchSupported()) {
      // Use MSE for gapless switching
      await this.switchQualitySeamlessly(newQuality);
    } else {
      // Fallback to source switching
      this.video.src = this.getVideoUrl(this.contentId, newQuality.bitrate.toString());
      this.video.currentTime = currentTime;
      
      if (wasPlaying) {
        await this.video.play();
      }
    }

    this.currentQuality = newQuality;
    this.notifyQualityChange(newQuality);
  }

  // Netflix's user engagement tracking
  private trackUserEngagement(): void {
    let watchTime = 0;
    let lastUpdateTime = Date.now();

    const updateWatchTime = () => {
      if (!this.video.paused) {
        const now = Date.now();
        watchTime += (now - lastUpdateTime) / 1000;
        lastUpdateTime = now;

        // Track engagement milestones
        this.trackEngagementMilestones(watchTime);
      }
    };

    setInterval(updateWatchTime, 1000);

    // Track user interactions
    this.video.addEventListener('seeking', () => {
      this.logABTestMetric('user_seeking', {
        timestamp: this.video.currentTime,
        variant: this.abTestVariant
      });
    });

    this.video.addEventListener('pause', () => {
      this.logABTestMetric('user_pause', {
        timestamp: this.video.currentTime,
        watchTime: watchTime,
        variant: this.abTestVariant
      });
    });
  }

  // Netflix's error recovery system
  private setupErrorRecovery(): void {
    this.video.addEventListener('error', (event) => {
      const error = this.video.error;
      
      this.logABTestMetric('playback_error', {
        code: error?.code,
        message: error?.message,
        currentQuality: this.currentQuality.bitrate,
        variant: this.abTestVariant
      });

      // Attempt recovery
      this.recoverFromError(error);
    });

    this.video.addEventListener('stalled', () => {
      this.metrics.playbackStalls++;
      
      // Try to recover by switching to lower quality
      if (this.currentQuality.bitrate > this.getMinimumBitrate()) {
        const lowerQuality = this.getLowerQuality(this.currentQuality);
        this.switchQuality(lowerQuality);
      }
    });
  }

  private async recoverFromError(error: MediaError | null): Promise<void> {
    if (!error) return;

    switch (error.code) {
      case MediaError.MEDIA_ERR_NETWORK:
        // Retry with exponential backoff
        await this.retryWithBackoff();
        break;
      
      case MediaError.MEDIA_ERR_DECODE:
        // Switch to different codec
        await this.switchToCompatibleCodec();
        break;
      
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        // Fall back to different format
        await this.fallbackToSupportedFormat();
        break;
    }
  }

  // Netflix's metrics collection for optimization
  private logABTestMetric(event: string, data: any): void {
    const metric = {
      event,
      data,
      variant: this.abTestVariant,
      timestamp: Date.now(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      contentId: this.contentId,
      playerMetrics: this.getCurrentMetrics()
    };

    // Send to Netflix's data pipeline
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    });
  }
}

class AdaptationEngine {
  getQualityRecommendation(
    metrics: StreamingMetrics,
    availableQualities: VideoQuality[],
    abTestVariant: string
  ): VideoQuality {
    // Netflix's machine learning-based adaptation
    const networkThroughput = this.estimateNetworkThroughput(metrics);
    const bufferHealth = metrics.bufferHealth;
    
    // A/B test different adaptation strategies
    switch (abTestVariant) {
      case 'conservative':
        return this.conservativeAdaptation(networkThroughput, bufferHealth, availableQualities);
      case 'aggressive':
        return this.aggressiveAdaptation(networkThroughput, bufferHealth, availableQualities);
      default:
        return this.defaultAdaptation(networkThroughput, bufferHealth, availableQualities);
    }
  }

  private conservativeAdaptation(
    throughput: number,
    bufferHealth: number,
    qualities: VideoQuality[]
  ): VideoQuality {
    // Conservative approach: only increase quality when very confident
    const safeBitrate = throughput * 0.7; // 70% of available bandwidth
    
    return qualities
      .filter(q => q.bitrate <= safeBitrate)
      .sort((a, b) => b.bitrate - a.bitrate)[0] || qualities[0];
  }
}
```

### **Company Culture**
- **Freedom & Responsibility**: High autonomy, high accountability
- **Context, Not Control**: Provide context, not detailed instructions
- **High Performance**: Continual excellence in everything

### **Common Questions**
1. "Design Netflix's recommendation algorithm"
2. "Implement video streaming with adaptive bitrate"
3. "Build A/B testing framework for video features"
4. "How would you handle global content delivery?"

### **Success Strategies**
- Think about massive scale from day one
- Discuss data-driven decision making
- Consider global and cultural differences
- Show understanding of streaming technologies

---

## Cross-Company Success Factors

### **Universal Preparation Tips**
1. **System Design Mastery**: All companies test scalability thinking
2. **Code Quality**: Clean, readable, maintainable code
3. **Trade-off Analysis**: Discuss pros/cons of different approaches
4. **User-Centric Thinking**: Always consider end-user impact
5. **Performance Awareness**: Understand optimization techniques

### **Technical Skills Matrix**

| Skill Area | Google | Meta | Amazon | Microsoft | Apple | Netflix |
|------------|--------|------|--------|-----------|-------|---------|
| Algorithms | ★★★★★ | ★★★★ | ★★★★ | ★★★★ | ★★★★ | ★★★ |
| React/Frontend | ★★★ | ★★★★★ | ★★★ | ★★★★ | ★★★★ | ★★★★ |
| System Design | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★ | ★★★★ | ★★★★★ |
| Performance | ★★★★ | ★★★★ | ★★★★ | ★★★ | ★★★★★ | ★★★★★ |
| Accessibility | ★★★ | ★★★ | ★★★ | ★★★★★ | ★★★★ | ★★ |
| Security | ★★★★ | ★★★★ | ★★★★ | ★★★★ | ★★★★★ | ★★★ |

Understanding these company-specific patterns significantly increases interview success rates by allowing targeted preparation that aligns with each company's values and technical priorities.
