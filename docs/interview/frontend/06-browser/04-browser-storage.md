# Browser Storage - Client-Side Data Persistence

> Chọn đúng storage mechanism cho use case. Hiểu trade-offs giữa các options.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE OPTIONS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │  COOKIES    │  │ WEB STORAGE │  │  INDEXEDDB  │             │
│   ├─────────────┤  ├─────────────┤  ├─────────────┤             │
│   │ 4KB limit   │  │ 5-10MB      │  │ 50MB+       │             │
│   │ Sent to     │  │ Client only │  │ Client only │             │
│   │ server      │  │             │  │             │             │
│   │ Expiration  │  │ Persistent  │  │ Persistent  │             │
│   │             │  │ or session  │  │             │             │
│   └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                   │
│   ┌─────────────┐  ┌─────────────┐                              │
│   │ CACHE API   │  │  SESSION    │                              │
│   ├─────────────┤  │  STORAGE    │                              │
│   │ For SW      │  ├─────────────┤                              │
│   │ HTTP cache  │  │ Tab only    │                              │
│   │ Offline     │  │ Cleared on  │                              │
│   │             │  │ close       │                              │
│   └─────────────┘  └─────────────┘                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🍪 Cookies

### Basic Cookie Operations

```javascript
// Set cookie
document.cookie = "username=John";

// With options
document.cookie = "username=John; max-age=3600; path=/; secure; samesite=strict";

// Expiration date
const date = new Date();
date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
document.cookie = `username=John; expires=${date.toUTCString()}`;

// Read cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

// Delete cookie (set expired)
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

### Cookie Attributes

```javascript
// Cookie options
document.cookie = `
    name=value;
    max-age=3600;           // Seconds until expiry
    expires=Date;           // Specific expiry date
    path=/;                 // Cookie path
    domain=.example.com;    // Cookie domain
    secure;                 // HTTPS only
    samesite=strict;        // CSRF protection
    httponly;               // JS cannot access (set by server)
`;

// SameSite values:
// Strict: Cookie only sent for same-site requests
// Lax: Sent for same-site + top-level navigation
// None: Always sent (requires Secure)
```

### When to Use Cookies

```
✅ Use Cookies for:
• Authentication tokens (httpOnly)
• Session identifiers
• Server-side tracking
• Small data needed on server

❌ Don't use for:
• Large data (4KB limit)
• Client-only data
• Sensitive data without httpOnly
```

---

## 💾 Web Storage

### localStorage

```javascript
// Store data (persists indefinitely)
localStorage.setItem('user', JSON.stringify({ name: 'John', id: 1 }));

// Retrieve data
const user = JSON.parse(localStorage.getItem('user'));

// Remove item
localStorage.removeItem('user');

// Clear all
localStorage.clear();

// Check length
console.log(localStorage.length);

// Iterate
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(key, localStorage.getItem(key));
}

// Storage event (fires in OTHER tabs)
window.addEventListener('storage', (e) => {
    console.log('Key:', e.key);
    console.log('Old value:', e.oldValue);
    console.log('New value:', e.newValue);
    console.log('URL:', e.url);
});
```

### sessionStorage

```javascript
// Same API as localStorage
// But: cleared when tab closes

sessionStorage.setItem('tempData', 'value');
const data = sessionStorage.getItem('tempData');
sessionStorage.removeItem('tempData');
sessionStorage.clear();

// Use cases:
// • Form data during multi-step wizard
// • Shopping cart before checkout
// • Temporary session state
```

### Storage Wrapper

```javascript
// Type-safe storage wrapper
class Storage {
    constructor(storage = localStorage) {
        this.storage = storage;
    }

    get(key, defaultValue = null) {
        try {
            const item = this.storage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    set(key, value) {
        try {
            this.storage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            // QuotaExceededError
            console.error('Storage full:', e);
            return false;
        }
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }

    // With expiration
    setWithExpiry(key, value, ttlMs) {
        const item = {
            value,
            expiry: Date.now() + ttlMs
        };
        this.set(key, item);
    }

    getWithExpiry(key) {
        const item = this.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.remove(key);
            return null;
        }
        return item.value;
    }
}

const storage = new Storage();
storage.set('user', { name: 'John' });
storage.setWithExpiry('token', 'abc123', 3600000); // 1 hour
```

---

## 🗄️ IndexedDB

### Basic Operations

```javascript
// Open database
const request = indexedDB.open('MyDatabase', 1);

request.onerror = (event) => {
    console.error('Database error:', event.target.error);
};

request.onsuccess = (event) => {
    const db = event.target.result;
    console.log('Database opened:', db);
};

// Create/upgrade schema
request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create object store
    const store = db.createObjectStore('users', {
        keyPath: 'id',
        autoIncrement: true
    });

    // Create indexes
    store.createIndex('email', 'email', { unique: true });
    store.createIndex('name', 'name', { unique: false });
};
```

### CRUD Operations

```javascript
class IndexedDBStore {
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }

    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
        });
    }

    async add(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(item);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async put(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(item);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// Usage
const userStore = new IndexedDBStore('MyApp', 'users');
await userStore.open();
await userStore.add({ id: 1, name: 'John', email: 'john@example.com' });
const user = await userStore.get(1);
```

### When to Use IndexedDB

```
✅ Use IndexedDB for:
• Large amounts of structured data
• Offline-first applications
• Complex querying needs
• Binary data (blobs, files)
• PWA data storage

❌ Don't use for:
• Small, simple data (use localStorage)
• Server-synced data only
• When simplicity is priority
```

---

## 📦 Cache API

### Basic Cache Operations

```javascript
// Open cache
const cache = await caches.open('my-cache-v1');

// Add to cache
await cache.add('/api/data');
await cache.addAll(['/style.css', '/script.js', '/image.png']);

// Put (manual)
await cache.put('/api/data', new Response(JSON.stringify({ data: 'value' })));

// Match (retrieve)
const response = await cache.match('/api/data');
if (response) {
    const data = await response.json();
}

// Delete
await cache.delete('/api/data');

// List all caches
const cacheNames = await caches.keys();

// Delete old caches
const currentCache = 'my-cache-v2';
for (const name of cacheNames) {
    if (name !== currentCache) {
        await caches.delete(name);
    }
}
```

### Service Worker Caching

```javascript
// service-worker.js

const CACHE_NAME = 'app-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/styles/main.css',
    '/scripts/main.js',
    '/images/logo.png'
];

// Install - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Cache hit
                }
                return fetch(event.request); // Network
            })
    );
});

// Cache-first with network update
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                return response || fetchPromise;
            });
        })
    );
});
```

---

## 📊 Comparison Table

| Feature | Cookies | localStorage | sessionStorage | IndexedDB | Cache API |
|---------|---------|--------------|----------------|-----------|-----------|
| Capacity | 4KB | 5-10MB | 5-10MB | 50MB+ | Varies |
| Sent to server | Yes | No | No | No | No |
| Persistence | Configurable | Forever | Tab session | Forever | Forever |
| API | String | String | String | Async | Async |
| Data type | String | String | String | Any | Response |
| Indexed | No | No | No | Yes | No |
| Web Workers | No | No | No | Yes | Yes |

---

## 🔒 Security Considerations

```javascript
// 1. Don't store sensitive data in localStorage
// ❌ Bad
localStorage.setItem('password', 'secret123');
localStorage.setItem('creditCard', '4111111111111111');

// ✅ Use httpOnly cookies for auth tokens
// Set by server: Set-Cookie: token=abc; HttpOnly; Secure

// 2. Validate and sanitize stored data
const userData = JSON.parse(localStorage.getItem('user'));
if (userData && typeof userData.name === 'string') {
    // Safe to use
}

// 3. Clear sensitive data on logout
function logout() {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    // Clear cookies via server response
}

// 4. Use HTTPS for any sensitive operations
// 5. Be aware of XSS - stored data can be accessed by malicious scripts
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: localStorage vs sessionStorage?**

A:
- localStorage: Persists indefinitely, shared across tabs
- sessionStorage: Cleared when tab closes, per-tab isolated

**Q: Cookies vs localStorage?**

A:
- Cookies: Sent to server, 4KB limit, can be httpOnly
- localStorage: Client-only, 5-10MB, accessible via JS

### 🟡 Mid-level

**Q: When to use IndexedDB?**

A: Large amounts of structured data, offline-first apps, complex queries, binary data. Use localStorage for simple key-value, IndexedDB for complex data needs.

**Q: Cookie SameSite attribute?**

A:
- Strict: Only same-site requests
- Lax: Same-site + top-level navigation (default)
- None: Always sent (requires Secure)

Prevents CSRF attacks by controlling when cookies are sent.

### 🔴 Senior

**Q: Design offline-first storage strategy**

A:
1. IndexedDB for main data
2. Cache API for assets via Service Worker
3. localStorage for small preferences
4. Sync queue for pending changes
5. Conflict resolution strategy
6. Version migration for schema changes

---

## 📚 Active Recall

1. [ ] 5 storage options và limits
2. [ ] Cookie security attributes
3. [ ] localStorage vs sessionStorage
4. [ ] IndexedDB use cases
5. [ ] Cache API trong Service Worker

---

> **Tiếp theo:** [05-browser-apis.md](./05-browser-apis.md) - Browser APIs
