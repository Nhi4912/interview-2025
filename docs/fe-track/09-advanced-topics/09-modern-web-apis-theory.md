# Modern Web APIs - Advanced Theory / APIs Web Hiện Đại - Lý Thuyết Nâng Cao

## Table of Contents / Mục Lục

1. [Service Workers](#service-workers)
2. [Web Storage APIs](#web-storage-apis)
3. [Intersection Observer](#intersection-observer)
4. [Resize Observer](#resize-observer)
5. [Mutation Observer](#mutation-observer)
6. [Web Components](#web-components)
7. [Interview Questions](#interview-questions)

---

## Service Workers / Service Workers

### Service Worker Architecture / Kiến Trúc Service Worker

**English:** Service Workers are programmable network proxies that enable offline experiences, background sync, and push notifications.

**Tiếng Việt:** Service Workers là proxy mạng có thể lập trình cho phép trải nghiệm offline, đồng bộ nền và thông báo push.

#### Service Worker Lifecycle / Vòng Đời Service Worker

**Lifecycle States:**

**1. Installing**
- First registration
- Download service worker file
- Parse and execute
- Install event fired
- Cache resources

**2. Installed (Waiting)**
- Installation complete
- Waiting to activate
- Old service worker still active
- Can skip waiting

**3. Activating**
- Takes control
- Activate event fired
- Clean up old caches
- Prepare for fetch events

**4. Activated**
- Fully active
- Controls pages
- Handles fetch events
- Background sync
- Push notifications

**5. Redundant**
- Replaced by new version
- Installation failed
- No longer used

**Lifecycle Events:**

**Install Event:**
```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/script.js',
        '/offline.html'
      ]);
    })
  );
});
```

**Purpose:**
- Cache critical resources
- Prepare for offline
- One-time setup
- Can fail and retry

**Activate Event:**
```javascript
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== 'v1')
          .map(name => caches.delete(name))
      );
    })
  );
});
```

**Purpose:**
- Clean up old caches
- Migrate data
- Take control
- One-time per version

**Fetch Event:**
```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

**Purpose:**
- Intercept network requests
- Serve from cache
- Implement caching strategies
- Offline support

#### Caching Strategies / Chiến Lược Bộ Nhớ Đệm

**1. Cache First (Cache Falling Back to Network)**

**Strategy:**
- Check cache first
- Fetch from network if miss
- Good for static assets
- Fast but may be stale

**Use Cases:**
- Images
- Fonts
- CSS/JS files
- Static content

**2. Network First (Network Falling Back to Cache)**

**Strategy:**
- Try network first
- Fallback to cache if offline
- Good for dynamic content
- Always fresh when online

**Use Cases:**
- API responses
- User data
- Real-time content
- News feeds

**3. Cache Only**

**Strategy:**
- Only serve from cache
- Never network
- Must be pre-cached
- Offline-first apps

**Use Cases:**
- App shell
- Critical resources
- Offline pages
- Static assets

**4. Network Only**

**Strategy:**
- Always fetch from network
- Never cache
- Always fresh
- No offline support

**Use Cases:**
- Sensitive data
- Real-time data
- Analytics
- Non-cacheable content

**5. Stale While Revalidate**

**Strategy:**
- Serve from cache immediately
- Update cache in background
- Best user experience
- Always fast, eventually fresh

**Use Cases:**
- Frequently updated content
- News articles
- Social feeds
- Product listings

#### Background Sync / Đồng Bộ Nền

**Purpose**: Defer actions until connectivity

**Use Cases:**
- Send messages when online
- Upload photos
- Submit forms
- Sync data

**Registration:**
```javascript
// In page
navigator.serviceWorker.ready.then(registration => {
  return registration.sync.register('sync-messages');
});
```

**Handling:**
```javascript
// In service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(sendMessages());
  }
});
```

**Benefits:**
- Reliable delivery
- Battery efficient
- User doesn't wait
- Automatic retry

#### Push Notifications / Thông Báo Push

**Purpose**: Engage users with timely updates

**Components:**
1. **Push Service**: Browser vendor service
2. **Application Server**: Your backend
3. **Service Worker**: Receives and displays

**Flow:**
1. User grants permission
2. Subscribe to push service
3. Send subscription to server
4. Server sends push message
5. Service worker receives
6. Display notification

**Subscription:**
```javascript
navigator.serviceWorker.ready.then(registration => {
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey
  });
});
```

**Receiving:**
```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: data.url
    })
  );
});
```

**Click Handling:**
```javascript
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
```

---

## Web Storage APIs / APIs Lưu Trữ Web

### Storage Mechanisms Comparison / So Sánh Cơ Chế Lưu Trữ

**English:** Modern web provides multiple storage options with different characteristics.

**Tiếng Việt:** Web hiện đại cung cấp nhiều tùy chọn lưu trữ với các đặc điểm khác nhau.

#### IndexedDB Theory / Lý Thuyết IndexedDB

**Characteristics:**
- NoSQL database
- Transactional
- Asynchronous
- Large storage (50MB+)
- Indexed queries
- Object storage

**Architecture:**

**Database:**
- Contains object stores
- Versioned
- One per origin
- Persistent

**Object Store:**
- Like a table
- Stores JavaScript objects
- Has key path or key generator
- Can have indexes

**Transaction:**
- Read-only or read-write
- ACID properties
- Automatic rollback on error
- Scoped to object stores

**Index:**
- Query by non-key properties
- Unique or non-unique
- Multi-entry support
- Improves query performance

**Operations:**

**Create Database:**
```javascript
const request = indexedDB.open('MyDatabase', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  
  // Create object store
  const store = db.createObjectStore('users', { keyPath: 'id' });
  
  // Create indexes
  store.createIndex('email', 'email', { unique: true });
  store.createIndex('age', 'age', { unique: false });
};
```

**Add Data:**
```javascript
const transaction = db.transaction(['users'], 'readwrite');
const store = transaction.objectStore('users');

store.add({ id: 1, name: 'John', email: 'john@example.com', age: 30 });
```

**Query Data:**
```javascript
// By key
const request = store.get(1);

// By index
const index = store.index('email');
const request = index.get('john@example.com');

// Range query
const range = IDBKeyRange.bound(20, 40);
const request = index.openCursor(range);
```

**Best Practices:**
- Use transactions appropriately
- Handle errors
- Close connections
- Use indexes for queries
- Batch operations
- Version migrations carefully

#### Cache API Theory / Lý Thuyết Cache API

**Purpose**: Store Request/Response pairs

**Characteristics:**
- Asynchronous
- Promise-based
- Service Worker integration
- Multiple caches
- Origin-scoped

**Operations:**

**Open Cache:**
```javascript
caches.open('v1').then(cache => {
  // Use cache
});
```

**Add to Cache:**
```javascript
// Single URL
cache.add('/page.html');

// Multiple URLs
cache.addAll(['/page1.html', '/page2.html']);

// Custom request/response
cache.put(request, response);
```

**Retrieve from Cache:**
```javascript
// Match request
cache.match(request).then(response => {
  if (response) {
    return response;
  }
  return fetch(request);
});

// Match all
cache.matchAll().then(responses => {
  // All cached responses
});
```

**Delete from Cache:**
```javascript
cache.delete(request);
```

**Cache Management:**
```javascript
// List all caches
caches.keys().then(names => {
  // Cache names
});

// Delete cache
caches.delete('old-cache');
```

**Best Practices:**
- Version caches
- Clean up old caches
- Set size limits
- Handle cache misses
- Use appropriate strategies

---

## Intersection Observer / Intersection Observer

### Intersection Observer Theory / Lý Thuyết Intersection Observer

**English:** Intersection Observer provides efficient way to observe element visibility changes.

**Tiếng Việt:** Intersection Observer cung cấp cách hiệu quả để quan sát thay đổi khả năng hiển thị của element.

#### How It Works / Cách Hoạt Động

**Concept:**
- Asynchronous observation
- No scroll event listeners
- Better performance
- Configurable thresholds
- Root element support

**Configuration:**

**Root:**
- Element to use as viewport
- Default: browser viewport
- Must be ancestor of target
- Null for viewport

**Root Margin:**
- Margin around root
- CSS margin syntax
- Positive: expand
- Negative: shrink
- Useful for preloading

**Threshold:**
- Visibility percentage
- 0 to 1
- Array for multiple
- Callback fires at each

**Use Cases:**

**1. Lazy Loading:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: '50px' // Preload 50px before visible
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

**2. Infinite Scroll:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMoreContent();
    }
  });
}, {
  threshold: 1.0 // Fully visible
});

observer.observe(sentinel);
```

**3. Analytics:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      trackImpression(entry.target);
    }
  });
}, {
  threshold: 0.5 // 50% visible
});
```

**4. Animations:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
});
```

**Performance Benefits:**
- No scroll listeners
- Batched callbacks
- Runs off main thread
- Efficient calculations
- Better battery life

---

## Resize Observer / Resize Observer

### Resize Observer Theory / Lý Thuyết Resize Observer

**English:** Resize Observer provides efficient way to observe element size changes.

**Tiếng Việt:** Resize Observer cung cấp cách hiệu quả để quan sát thay đổi kích thước của element.

#### How It Works / Cách Hoạt Động

**Concept:**
- Observe element dimensions
- No resize event listeners
- Better performance
- Content box or border box
- Device pixel ratio aware

**Observation Types:**

**Content Box:**
- Content area only
- Excludes padding and border
- Default observation

**Border Box:**
- Includes padding and border
- Excludes margin
- More common use case

**Device Pixel Content Box:**
- Physical pixels
- High DPI displays
- Canvas rendering

**Use Cases:**

**1. Responsive Components:**
```javascript
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const width = entry.contentRect.width;
    
    if (width < 400) {
      entry.target.classList.add('compact');
    } else {
      entry.target.classList.remove('compact');
    }
  });
});

observer.observe(component);
```

**2. Canvas Rendering:**
```javascript
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    const canvas = entry.target;
    const dpr = window.devicePixelRatio;
    
    canvas.width = entry.contentRect.width * dpr;
    canvas.height = entry.contentRect.height * dpr;
    
    render(canvas);
  });
});

observer.observe(canvas);
```

**3. Layout Calculations:**
```javascript
const observer = new ResizeObserver(entries => {
  entries.forEach(entry => {
    updateLayout(entry.contentRect);
  });
});
```

**Performance Benefits:**
- No window resize listeners
- Element-specific
- Batched notifications
- Efficient calculations
- Better performance

---

## Mutation Observer / Mutation Observer

### Mutation Observer Theory / Lý Thuyết Mutation Observer

**English:** Mutation Observer provides efficient way to observe DOM changes.

**Tiếng Việt:** Mutation Observer cung cấp cách hiệu quả để quan sát thay đổi DOM.

#### How It Works / Cách Hoạt Động

**Concept:**
- Observe DOM mutations
- Asynchronous notifications
- Batched changes
- Configurable observation
- Better than mutation events

**Observation Types:**

**Attributes:**
- Attribute changes
- Old value tracking
- Attribute filter

**Child List:**
- Added nodes
- Removed nodes
- Node tracking

**Character Data:**
- Text content changes
- Old value tracking

**Subtree:**
- Observe descendants
- Recursive observation

**Use Cases:**

**1. Dynamic Content:**
```javascript
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        initializeComponent(node);
      }
    });
  });
});

observer.observe(container, {
  childList: true,
  subtree: true
});
```

**2. Attribute Monitoring:**
```javascript
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes') {
      handleAttributeChange(
        mutation.target,
        mutation.attributeName,
        mutation.oldValue
      );
    }
  });
});

observer.observe(element, {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ['class', 'data-state']
});
```

**3. Content Changes:**
```javascript
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'characterData') {
      updateDisplay(mutation.target.textContent);
    }
  });
});

observer.observe(textNode, {
  characterData: true,
  characterDataOldValue: true
});
```

**Performance Considerations:**
- Disconnect when done
- Limit observation scope
- Batch processing
- Avoid infinite loops
- Use appropriate options

---

## Web Components / Web Components

### Web Components Theory / Lý Thuyết Web Components

**English:** Web Components are a set of standards for creating reusable custom elements.

**Tiếng Việt:** Web Components là một tập hợp các tiêu chuẩn để tạo các elements tùy chỉnh có thể tái sử dụng.

#### Core Technologies / Công Nghệ Cốt Lõi

**1. Custom Elements**

**Purpose**: Define new HTML elements

**Types:**
- **Autonomous**: Standalone elements
- **Customized Built-in**: Extend existing elements

**Lifecycle Callbacks:**
- `connectedCallback`: Added to DOM
- `disconnectedCallback`: Removed from DOM
- `attributeChangedCallback`: Attribute changed
- `adoptedCallback`: Moved to new document

**2. Shadow DOM**

**Purpose**: Encapsulation

**Benefits:**
- Style isolation
- DOM isolation
- Composition
- Reusability

**Modes:**
- **Open**: Accessible via `element.shadowRoot`
- **Closed**: Not accessible

**3. HTML Templates**

**Purpose**: Reusable markup

**Benefits:**
- Inert until cloned
- Not rendered
- Can contain any content
- Efficient cloning

**4. ES Modules**

**Purpose**: Component packaging

**Benefits:**
- Standard module system
- Dependency management
- Code splitting
- Tree shaking

#### Design Principles / Nguyên Tắc Thiết Kế

**Encapsulation:**
- Private implementation
- Public API
- Style isolation
- DOM isolation

**Reusability:**
- Self-contained
- Configurable
- Composable
- Framework-agnostic

**Interoperability:**
- Standard APIs
- Works everywhere
- Progressive enhancement
- Backward compatible

**Performance:**
- Lazy loading
- Code splitting
- Efficient rendering
- Minimal overhead

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: Explain Service Worker lifecycle

**English Answer:**

**Service Worker Lifecycle** has five states:

**1. Installing:**
- First registration
- Download and parse
- Install event fires
- Cache resources
- Can fail and retry

**2. Installed (Waiting):**
- Installation complete
- Waiting to activate
- Old SW still active
- Can skip waiting

**3. Activating:**
- Takes control
- Activate event fires
- Clean up old caches
- Prepare for fetch

**4. Activated:**
- Fully active
- Controls pages
- Handles fetch events
- Background sync
- Push notifications

**5. Redundant:**
- Replaced or failed
- No longer used

**Key Events:**
- **install**: Cache resources
- **activate**: Clean up
- **fetch**: Intercept requests

**Update Process:**
- New SW downloads
- Installs in parallel
- Waits for old to finish
- Activates when ready

**Tiếng Việt:**

Service Worker lifecycle: Installing (cache resources) → Installed (waiting) → Activating (cleanup) → Activated (handle fetch) → Redundant (replaced). Key events: install, activate, fetch.

### Q2: Compare storage mechanisms

**English Answer:**

**Storage Mechanisms:**

**Cookies:**
- Size: 4KB
- Sent with requests
- Expiration: Configurable
- Use: Session, auth

**LocalStorage:**
- Size: 5-10MB
- Synchronous
- Persistent
- Use: Preferences, state

**SessionStorage:**
- Size: 5-10MB
- Synchronous
- Session-scoped
- Use: Temporary data

**IndexedDB:**
- Size: 50MB+ (can request more)
- Asynchronous
- Transactional
- Use: Large datasets, offline

**Cache API:**
- Size: Large
- Asynchronous
- Request/Response pairs
- Use: Offline caching, PWA

**Selection Criteria:**
- Size requirements
- Persistence needs
- Performance (sync vs async)
- Data structure
- Use case

**Tiếng Việt:**

Storage: Cookies (4KB, sent with requests), LocalStorage (5-10MB, sync, persistent), SessionStorage (session-scoped), IndexedDB (large, async, transactional), Cache API (Request/Response, PWA).

### Q3: Explain Intersection Observer benefits

**English Answer:**

**Intersection Observer** efficiently observes element visibility.

**Benefits:**

**1. Performance:**
- No scroll listeners
- Runs off main thread
- Batched callbacks
- Efficient calculations
- Better battery life

**2. Flexibility:**
- Configurable thresholds
- Root margin support
- Multiple observers
- Custom root element

**3. Use Cases:**
- Lazy loading images
- Infinite scroll
- Analytics tracking
- Animation triggers
- Ad viewability

**Configuration:**
- **root**: Viewport element
- **rootMargin**: Margin around root
- **threshold**: Visibility percentage

**Advantages over Scroll:**
- Better performance
- Simpler code
- More reliable
- Battery efficient
- Async by design

**Tiếng Việt:**

Intersection Observer: no scroll listeners, runs off main thread, batched callbacks, efficient. Use cases: lazy loading, infinite scroll, analytics, animations. Configuration: root, rootMargin, threshold.

---

## Summary / Tóm Tắt

**Key Concepts:**

1. **Service Workers**: Programmable network proxy, offline support, background sync, push
2. **Storage**: Multiple options (Cookies, LocalStorage, IndexedDB, Cache API)
3. **Observers**: Efficient observation (Intersection, Resize, Mutation)
4. **Web Components**: Reusable custom elements with encapsulation

**Best Practices:**
- Choose appropriate storage
- Use observers for efficiency
- Implement offline support
- Cache strategically
- Monitor performance
- Handle errors gracefully

---

[← Previous: Web Performance](./08-web-performance-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
