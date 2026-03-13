# Caching & CDN - Speed Through Strategic Storage

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Caching là key để performance. Hiểu HTTP caching, browser cache, và CDN để optimize loading speed.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING LAYERS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   USER REQUEST                                                   │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│   │   BROWSER   │───▶│     CDN     │───▶│   ORIGIN    │         │
│   │    CACHE    │    │    CACHE    │    │   SERVER    │         │
│   └─────────────┘    └─────────────┘    └─────────────┘         │
│        │                   │                   │                 │
│   Memory Cache        Edge Cache         Application            │
│   Disk Cache          Global              Cache                  │
│   Service Worker      Distribution        Database               │
│                                                                   │
│   CACHE BENEFITS:                                                │
│   • Faster response times                                        │
│   • Reduced server load                                          │
│   • Lower bandwidth costs                                        │
│   • Better user experience                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ HTTP Caching

### Cache-Control Header

```
┌─────────────────────────────────────────────────────────────────┐
│                    CACHE-CONTROL DIRECTIVES                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   RESPONSE DIRECTIVES:                                           │
│                                                                   │
│   max-age=<seconds>     │ How long to cache                     │
│   s-maxage=<seconds>    │ Shared cache max-age (CDN)            │
│   no-cache              │ Must revalidate before use            │
│   no-store              │ Never cache (sensitive data)          │
│   private               │ Only browser can cache                │
│   public                │ Any cache can store                   │
│   must-revalidate       │ Must check when stale                 │
│   immutable             │ Content never changes                 │
│                                                                   │
│   REQUEST DIRECTIVES:                                            │
│                                                                   │
│   no-cache              │ Get fresh response                    │
│   no-store              │ Don't store response                  │
│   max-age=0             │ Want fresh response                   │
│   max-stale=<seconds>   │ Accept stale by N seconds             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Common Caching Patterns

```javascript
// 1. Static assets with fingerprinting (immutable)
// URL: /static/app.a1b2c3.js
Cache-Control: public, max-age=31536000, immutable

// 2. HTML pages (always revalidate)
Cache-Control: no-cache
// or
Cache-Control: private, max-age=0, must-revalidate

// 3. API responses (short cache)
Cache-Control: private, max-age=60

// 4. Sensitive data (never cache)
Cache-Control: no-store

// 5. CDN with browser cache
Cache-Control: public, max-age=3600, s-maxage=86400
// Browser: 1 hour, CDN: 24 hours

// 6. Stale-while-revalidate
Cache-Control: max-age=3600, stale-while-revalidate=86400
// Serve stale for 24h while fetching fresh
```

### ETag & Conditional Requests

```
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDATION FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   FIRST REQUEST:                                                 │
│                                                                   │
│   Client ────────────────────────────────────▶ Server           │
│          GET /api/data                                           │
│                                                                   │
│   Client ◀──────────────────────────────────── Server           │
│          200 OK                                                  │
│          ETag: "abc123"                                          │
│          Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT           │
│          { data: "..." }                                         │
│                                                                   │
│   SUBSEQUENT REQUEST:                                            │
│                                                                   │
│   Client ────────────────────────────────────▶ Server           │
│          GET /api/data                                           │
│          If-None-Match: "abc123"                                 │
│          If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT       │
│                                                                   │
│   If unchanged:                                                  │
│   Client ◀──────────────────────────────────── Server           │
│          304 Not Modified (no body)                              │
│                                                                   │
│   If changed:                                                    │
│   Client ◀──────────────────────────────────── Server           │
│          200 OK                                                  │
│          ETag: "def456"                                          │
│          { data: "new..." }                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```javascript
// Server implementation (Express)
app.get('/api/data', (req, res) => {
    const data = getData();
    const etag = generateETag(data);

    // Check if client has current version
    if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
    }

    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
    res.json(data);
});

// Client handling 304
async function fetchWithCache(url) {
    const cached = localStorage.getItem(url);
    const headers = {};

    if (cached) {
        const { etag, data } = JSON.parse(cached);
        headers['If-None-Match'] = etag;
    }

    const response = await fetch(url, { headers });

    if (response.status === 304) {
        return JSON.parse(cached).data;
    }

    const data = await response.json();
    const etag = response.headers.get('ETag');

    localStorage.setItem(url, JSON.stringify({ etag, data }));
    return data;
}
```

---

## 🌐 Browser Caching

### Cache Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER CACHE HIERARCHY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. MEMORY CACHE (fastest)                                      │
│      ├─ Stores in RAM                                           │
│      ├─ Cleared on tab close                                    │
│      └─ Used for repeated requests on same page                 │
│                                                                   │
│   2. SERVICE WORKER CACHE                                        │
│      ├─ Programmable cache                                      │
│      ├─ Persists across sessions                                │
│      └─ Enables offline functionality                           │
│                                                                   │
│   3. DISK CACHE (HTTP cache)                                     │
│      ├─ Stored on disk                                          │
│      ├─ Controlled by Cache-Control headers                     │
│      └─ Persists across browser restarts                        │
│                                                                   │
│   4. PUSH CACHE (HTTP/2)                                         │
│      ├─ Stores server-pushed resources                          │
│      ├─ Session-based                                           │
│      └─ Cleared when connection closes                          │
│                                                                   │
│   LOOKUP ORDER: Memory → SW → Disk → Push → Network             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Service Worker Caching

```javascript
// sw.js - Service Worker

const CACHE_NAME = 'app-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/app.js',
    '/images/logo.png'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
```

### Caching Strategies

```javascript
// 1. CACHE FIRST (Static assets)
// Good for: images, fonts, CSS, JS
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
}

// 2. NETWORK FIRST (Dynamic content)
// Good for: API data, frequently updated content
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw error;
    }
}

// 3. STALE-WHILE-REVALIDATE
// Good for: content that should be fast but can be slightly outdated
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then(response => {
        cache.put(request, response.clone());
        return response;
    });

    return cached || fetchPromise;
}

// 4. CACHE ONLY (Offline-first)
// Good for: truly static assets, offline apps
async function cacheOnly(request) {
    const cached = await caches.match(request);
    if (!cached) {
        throw new Error('Not in cache');
    }
    return cached;
}

// 5. NETWORK ONLY (Real-time data)
// Good for: non-cacheable requests, analytics
async function networkOnly(request) {
    return fetch(request);
}

// Strategy selection in fetch handler
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith('/api/')) {
        // API calls: network first
        event.respondWith(networkFirst(event.request));
    } else if (url.pathname.startsWith('/static/')) {
        // Static assets: cache first
        event.respondWith(cacheFirst(event.request));
    } else {
        // HTML pages: stale-while-revalidate
        event.respondWith(staleWhileRevalidate(event.request));
    }
});
```

---

## 🌍 CDN (Content Delivery Network)

### How CDN Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    CDN ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                        ┌─────────────┐                           │
│                        │   ORIGIN    │                           │
│                        │   SERVER    │                           │
│                        │  (US East)  │                           │
│                        └──────┬──────┘                           │
│                               │                                  │
│              ┌────────────────┼────────────────┐                 │
│              │                │                │                 │
│        ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐          │
│        │   EDGE    │    │   EDGE    │    │   EDGE    │          │
│        │   (EU)    │    │  (APAC)   │    │   (US)    │          │
│        └─────┬─────┘    └─────┬─────┘    └─────┬─────┘          │
│              │                │                │                 │
│         ┌────┴────┐      ┌────┴────┐      ┌────┴────┐           │
│         │  User   │      │  User   │      │  User   │           │
│         │  (UK)   │      │ (Japan) │      │ (Calif) │           │
│         └─────────┘      └─────────┘      └─────────┘           │
│                                                                   │
│   BENEFITS:                                                      │
│   • Lower latency (geographically closer)                        │
│   • Reduced origin load                                          │
│   • DDoS protection                                              │
│   • Global availability                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### CDN Configuration

```javascript
// Next.js - Static assets automatically use CDN
// next.config.js
module.exports = {
    // Use CDN for static assets
    assetPrefix: 'https://cdn.example.com',

    // Optimize images via CDN
    images: {
        loader: 'cloudinary',
        path: 'https://res.cloudinary.com/example/'
    }
};

// Vercel headers configuration
// vercel.json
{
    "headers": [
        {
            "source": "/static/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, max-age=31536000, immutable"
                }
            ]
        },
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, max-age=0, must-revalidate"
                }
            ]
        }
    ]
}

// Cloudflare Page Rules (conceptual)
/*
URL Pattern: *.example.com/static/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 1 year

URL Pattern: example.com/api/*
Cache Level: Bypass
*/
```

### Cache Invalidation

```javascript
// 1. Version/Hash in filename (best practice)
// app.a1b2c3.js → app.d4e5f6.js

// 2. Cache tags/keys (CDN-specific)
// Cloudflare
fetch('https://api.cloudflare.com/client/v4/zones/:zone/purge_cache', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + API_TOKEN,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        files: ['https://example.com/styles.css'],
        // or purge by tag
        tags: ['static-assets', 'v1']
    })
});

// 3. Purge all (use sparingly)
// Clears entire CDN cache

// 4. Surrogate keys / Cache-Tag header
// Response header: Cache-Tag: product-123, category-shoes
// Then purge by tag when product updates
```

---

## 📊 Application-Level Caching

### React Query / SWR

```javascript
// SWR - Stale-While-Revalidate pattern
import useSWR from 'swr';

function UserProfile({ userId }) {
    const { data, error, isLoading, mutate } = useSWR(
        `/api/users/${userId}`,
        fetcher,
        {
            // Revalidation options
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            refreshInterval: 30000, // Poll every 30s

            // Cache options
            dedupingInterval: 2000, // Dedupe requests within 2s

            // Stale data handling
            revalidateIfStale: true,

            // Error handling
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    );

    // Optimistic update
    const updateUser = async (updates) => {
        // Immediately update cache
        mutate({ ...data, ...updates }, false);

        // Send request
        await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });

        // Revalidate to ensure consistency
        mutate();
    };

    if (isLoading) return <Loading />;
    if (error) return <Error />;
    return <Profile data={data} onUpdate={updateUser} />;
}

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Products() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => fetch('/api/products').then(r => r.json()),
        staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
        cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    });

    const mutation = useMutation({
        mutationFn: (newProduct) =>
            fetch('/api/products', {
                method: 'POST',
                body: JSON.stringify(newProduct)
            }),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
}
```

### In-Memory Caching

```javascript
// Simple LRU cache implementation
class LRUCache {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return undefined;

        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);

        return value;
    }

    set(key, value, ttl = 0) {
        // Remove oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            value,
            expires: ttl ? Date.now() + ttl : 0
        });
    }

    has(key) {
        if (!this.cache.has(key)) return false;

        const item = this.cache.get(key);
        if (item.expires && Date.now() > item.expires) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }
}

// Usage with API calls
const cache = new LRUCache(50);

async function fetchWithCache(url, options = {}) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;

    if (cache.has(cacheKey)) {
        return cache.get(cacheKey).value;
    }

    const response = await fetch(url, options);
    const data = await response.json();

    cache.set(cacheKey, data, 60000); // Cache for 1 minute

    return data;
}
```

---

## 🔄 Cache Strategies by Content Type

```
┌─────────────────────────────────────────────────────────────────┐
│                 CACHING STRATEGY BY CONTENT                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   CONTENT TYPE          STRATEGY            CACHE-CONTROL        │
│   ─────────────────────────────────────────────────────────────  │
│                                                                   │
│   Fingerprinted JS/CSS  Cache forever       max-age=31536000,   │
│   (app.a1b2c3.js)                           immutable            │
│                                                                   │
│   Non-fingerprinted     Short cache +       max-age=3600,       │
│   JS/CSS                revalidate          must-revalidate      │
│                                                                   │
│   HTML pages            Always check        no-cache             │
│                                             (or max-age=0)       │
│                                                                   │
│   Images (CDN)          Long cache          max-age=86400,      │
│                                             public               │
│                                                                   │
│   API (public)          Short cache         max-age=60,         │
│                                             public               │
│                                                                   │
│   API (user-specific)   No shared cache     private,            │
│                                             max-age=60           │
│                                                                   │
│   API (sensitive)       Never cache         no-store             │
│                                                                   │
│   Fonts                 Long cache          max-age=31536000    │
│                                                                   │
│   Favicon               Medium cache        max-age=86400       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Cache-Control: no-cache vs no-store?**

A:
- `no-cache`: Browser CAN cache but MUST revalidate with server before using
- `no-store`: Browser should NOT store the response at all (sensitive data)

**Q: What is ETag?**

A: Entity Tag - unique identifier for a specific version of a resource. Used for conditional requests. If ETag matches, server returns 304 Not Modified.

### 🟡 Mid-level

**Q: Explain stale-while-revalidate**

A: Caching strategy where:
1. Serve cached (stale) content immediately
2. Fetch fresh content in background
3. Update cache for next request

Benefits: Fast response + eventual consistency. Good for content that can be slightly outdated.

**Q: How do you invalidate CDN cache?**

A:
1. **Filename hashing**: Change filename when content changes (best)
2. **Purge API**: Use CDN's API to invalidate specific URLs/tags
3. **Cache tags**: Tag responses, purge by tag
4. **TTL expiry**: Let cache naturally expire

### 🔴 Senior

**Q: Design caching strategy for e-commerce site**

A:
```
1. Static Assets (JS/CSS/Images):
   - Fingerprint filenames
   - Cache-Control: max-age=31536000, immutable
   - CDN with global distribution

2. Product Pages:
   - ISR with 60s revalidation
   - CDN cache with cache tags per product
   - Invalidate on product update

3. Product API:
   - s-maxage=60 for CDN
   - ETag for conditional requests
   - Vary: Accept-Encoding, Cookie

4. User-specific data (cart, wishlist):
   - Cache-Control: private, no-store
   - Client-side state management

5. Search results:
   - Short CDN cache (60s)
   - stale-while-revalidate for UX

6. Checkout/Payment:
   - no-store (security)
```

---

## 📚 Active Recall

1. [ ] Cache-Control directives và meanings
2. [ ] Browser cache layers (4 types)
3. [ ] Service Worker caching strategies (5 patterns)
4. [ ] CDN cache invalidation methods
5. [ ] When to use no-cache vs no-store vs must-revalidate

---

> **Tiếp theo:** [06-cors-same-origin.md](./06-cors-same-origin.md) - CORS & Same-Origin Policy
