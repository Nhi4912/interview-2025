# Frontend Caching Strategies — Browser · Service Worker · App Cache · CDN

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Specs**: [RFC 9111 — HTTP Caching](https://httpwg.org/specs/rfc9111.html) · [RFC 7232 — Conditional Requests](https://httpwg.org/specs/rfc7232.html) · [RFC 5861 — Stale Extensions](https://httpwg.org/specs/rfc5861.html)

---

## Concept Map / Bản Đồ Khái Niệm

```
Request Flow with Cache Layers
══════════════════════════════════════════════════════════════════

  Browser                                              Origin
  ┌──────────────────────────────────────────────────┐  Server
  │  ① Memory Cache  (fastest, tab-scoped)           │    │
  │       ↓ miss                                     │    │
  │  ② Service Worker Cache  (Cache API, offline)    │    │
  │       ↓ miss                                     │    │
  │  ③ Disk Cache  (HTTP cache, persistent)          │    │
  │       ↓ miss                                     │    │
  └──────────┬───────────────────────────────────────┘    │
             │                                            │
  ┌──────────▼───────────────────────────────────────┐    │
  │  ④ CDN / Edge Cache  (geographically distributed)│    │
  │       ↓ miss                                     │    │
  └──────────┬───────────────────────────────────────┘    │
             │                                            │
             └────────── ⑤ Origin Server ─────────────────┘
```

🧠 **Memory Hook — "MSDN"**: Memory → Service Worker → Disk → Network (CDN → Origin)

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. HTTP Cache Headers (RFC 9111)

| Directive                  | Ý nghĩa                                                    | Ví dụ                                                  |
| -------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| `max-age=N`                | Cache tối đa N giây kể từ response                         | `Cache-Control: max-age=31536000`                      |
| `s-maxage=N`               | Như max-age nhưng chỉ cho shared cache (CDN)               | `Cache-Control: s-maxage=3600`                         |
| `no-cache`                 | Cache ĐƯỢC lưu nhưng PHẢI revalidate trước khi dùng        | `Cache-Control: no-cache`                              |
| `no-store`                 | KHÔNG được lưu cache ở bất kỳ đâu                          | `Cache-Control: no-store`                              |
| `private`                  | Chỉ browser cache, CDN/proxy KHÔNG được cache              | `Cache-Control: private, max-age=600`                  |
| `public`                   | Cho phép mọi cache layer lưu                               | `Cache-Control: public, max-age=86400`                 |
| `must-revalidate`          | Khi stale, PHẢI revalidate — không dùng stale content      | `Cache-Control: max-age=60, must-revalidate`           |
| `stale-while-revalidate=N` | Serve stale trong N giây while fetching fresh (RFC 5861)   | `Cache-Control: max-age=60, stale-while-revalidate=30` |
| `immutable`                | Content sẽ không bao giờ thay đổi (dùng cho hashed assets) | `Cache-Control: max-age=31536000, immutable`           |

> ⚠️ **Critical distinction**: `no-cache` ≠ "don't cache". `no-cache` = "cache nhưng luôn hỏi lại server". `no-store` = "không cache gì cả".

### 2. Validation Mechanisms (RFC 7232)

```
Strong Validator (ETag):
  Client: GET /api/products
  Server: 200 OK
          ETag: "abc123"

  Client: GET /api/products
          If-None-Match: "abc123"
  Server: 304 Not Modified  ← no body, save bandwidth

Weak Validator (Last-Modified):
  Client: GET /api/products
  Server: 200 OK
          Last-Modified: Wed, 21 Oct 2025 07:28:00 GMT

  Client: GET /api/products
          If-Modified-Since: Wed, 21 Oct 2025 07:28:00 GMT
  Server: 304 Not Modified
```

| Aspect      | ETag                                             | Last-Modified                              |
| ----------- | ------------------------------------------------ | ------------------------------------------ |
| Precision   | Byte-level (strong) or semantic (weak `W/"..."`) | 1-second granularity                       |
| Use case    | API responses, dynamic content                   | Static files                               |
| Overhead    | Server must compute hash                         | Filesystem timestamp                       |
| Reliability | Cao — chính xác theo nội dung                    | Thấp hơn — 2 thay đổi trong 1 giây bị miss |

### 3. Cache Strategy Per Resource Type

```
Production SPA Cache Strategy
═══════════════════════════════════════════════════════

Resource          Cache-Control                     Why
─────────────────────────────────────────────────────
index.html        no-cache                          Always revalidate to get latest JS/CSS refs
app.[hash].js     max-age=31536000, immutable       Content hash = new URL on change
style.[hash].css  max-age=31536000, immutable       Same as JS
/api/*            no-cache or short max-age          Dynamic data needs freshness
images/logo.svg   max-age=86400, public             Rarely changes, CDN cacheable
fonts/*.woff2     max-age=31536000, immutable       Never changes once published
```

🧠 **Memory Hook — "HIN"**: HTML=no-cache, Immutable=hashed assets, No-store=sensitive data

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Section A: HTTP Cache Fundamentals

---

### Q01. What is browser caching and how does Cache-Control work?

**🟢 Junior**

**EN**: Browser caching stores HTTP responses locally so subsequent requests can be served without hitting the network. The `Cache-Control` header is the primary mechanism to control caching behavior, defined in RFC 9111.

When a browser receives a response with `Cache-Control: max-age=3600`, it stores the response and considers it "fresh" for 3600 seconds. During this time, the browser serves the cached version without making a network request.

**VI**: Browser caching lưu HTTP response ở local để request sau không cần đi qua network. `Cache-Control` header là cơ chế chính để kiểm soát cache, được định nghĩa trong RFC 9111. Khi browser nhận response có `max-age=3600`, nó lưu và coi là "fresh" trong 3600 giây.

```nginx
# Nginx configuration example
server {
    # HTML — always revalidate
    location / {
        add_header Cache-Control "no-cache";
    }

    # Hashed static assets — cache forever
    location ~* \.[0-9a-f]{8}\.(js|css)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API responses — short cache with revalidation
    location /api/ {
        add_header Cache-Control "private, max-age=0, must-revalidate";
        add_header ETag $request_id;
    }

    # Images — moderate cache
    location /images/ {
        add_header Cache-Control "public, max-age=86400";
    }
}
```

🎯 **Interview Signal**: Interviewer muốn nghe bạn phân biệt được `max-age` vs `s-maxage`, `private` vs `public`, và biết khi nào dùng `no-cache` vs `no-store`.

❌ **Common Mistake**: Nói "no-cache means don't cache" — sai. `no-cache` = cache nhưng phải revalidate trước khi dùng.

---

### Q02. Explain the difference between `no-cache` and `no-store`.

**🟢 Junior**

**EN**: These are the two most confused Cache-Control directives:

- **`no-cache`**: The response CAN be stored in cache, but the client MUST validate with the server (using ETag or Last-Modified) before using it. This means the browser always makes a conditional request, but if the content hasn't changed, it gets a fast `304 Not Modified` response with no body.

- **`no-store`**: The response MUST NOT be stored anywhere — not in browser cache, not in CDN, not in proxy. Every request goes to origin. Use this for sensitive data (banking, health records).

**VI**: Hai directive dễ nhầm nhất:

- `no-cache`: ĐƯỢC lưu cache, nhưng PHẢI hỏi lại server trước khi dùng → conditional request → 304 nếu không đổi
- `no-store`: KHÔNG ĐƯỢC lưu bất kỳ đâu → mọi request đều đi origin

```
                    no-cache                    no-store
                  ┌───────────┐              ┌───────────┐
  Request  ──────►│  Cache?   │   Request ──►│  Cache?   │
                  │   YES ✓   │              │   NO ✗    │
                  └─────┬─────┘              └─────┬─────┘
                        │                          │
                  ┌─────▼─────┐              ┌─────▼─────┐
                  │Revalidate │              │  Origin   │
                  │  Server   │              │  Server   │
                  └─────┬─────┘              └───────────┘
                   ┌────┴────┐
                   │         │
              304 (fast)  200 (full)
```

| Scenario             | Directive            | Lý do                                    |
| -------------------- | -------------------- | ---------------------------------------- |
| HTML entry point     | `no-cache`           | Luôn check phiên bản mới nhưng 304 nhanh |
| Bank account balance | `no-store`           | Không được lưu thông tin nhạy cảm        |
| User profile         | `private, no-cache`  | Cache riêng cho user, revalidate mỗi lần |
| Public product list  | `public, max-age=60` | CDN cache được, refresh mỗi 60s          |

🧠 **Memory Hook**: "no-cache = check first, no-store = forget everything"

---

### Q03. How do ETag and conditional requests work?

**🟡 Mid**

**EN**: ETag (Entity Tag) is a response header containing a unique identifier for a specific version of a resource. When the client makes a subsequent request, it sends the ETag value in the `If-None-Match` header. The server compares and returns either `304 Not Modified` (saving bandwidth) or `200 OK` with the new content.

**VI**: ETag là một header chứa mã định danh duy nhất cho phiên bản cụ thể của resource. Client gửi lại ETag qua `If-None-Match` → server so sánh → trả 304 (tiết kiệm bandwidth) hoặc 200 (nội dung mới).

```typescript
// Express server with ETag
import express from "express";
import crypto from "crypto";

const app = express();

app.get("/api/products", async (req, res) => {
  const products = await db.getProducts();
  const data = JSON.stringify(products);

  // Generate strong ETag from content hash
  const etag = `"${crypto.createHash("md5").update(data).digest("hex")}"`;

  // Check If-None-Match from client
  if (req.headers["if-none-match"] === etag) {
    return res.status(304).end(); // Not Modified — no body sent
  }

  res.set({
    ETag: etag,
    "Cache-Control": "private, no-cache", // Always revalidate
  });

  res.json(products);
});
```

```typescript
// Client-side: browser handles this automatically!
// But for custom caching (e.g., Service Worker):
async function fetchWithETag(url: string): Promise<Response> {
  const cached = await caches.match(url);
  const headers: HeadersInit = {};

  if (cached) {
    const etag = cached.headers.get("ETag");
    if (etag) {
      headers["If-None-Match"] = etag;
    }
  }

  const response = await fetch(url, { headers });

  if (response.status === 304 && cached) {
    return cached; // Use cached version
  }

  // Store new response in cache
  const cache = await caches.open("api-v1");
  await cache.put(url, response.clone());
  return response;
}
```

**Strong vs Weak ETag**:

- Strong: `"abc123"` — byte-for-byte identical
- Weak: `W/"abc123"` — semantically equivalent (e.g., different whitespace OK)

🎯 **Interview Signal**: Biết flow request/response hoàn chỉnh. Biết khi nào dùng strong vs weak ETag. Biết ETag ưu tiên hơn Last-Modified.

---

### Q04. Design a caching strategy for a production SPA.

**🟡 Mid**

**EN**: A production SPA needs different caching strategies for different resource types. The key insight is that **content-hashed filenames make assets immutable** — when content changes, the filename changes, so we can cache aggressively.

**VI**: Production SPA cần chiến lược cache khác nhau cho từng loại resource. Insight quan trọng: **filename chứa content hash → immutable** — khi nội dung thay đổi thì URL mới → cache mạnh được.

```typescript
// Vite config for content-hashed output
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // JS: app.a1b2c3d4.js
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "chunks/[name].[hash].js",
        // CSS: style.e5f6g7h8.css
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
  },
});
```

```nginx
# Complete Nginx config for production SPA
server {
    listen 443 ssl http2;
    root /var/www/app;

    # 1. HTML shell — ALWAYS revalidate
    location = /index.html {
        add_header Cache-Control "no-cache";
        add_header X-Content-Type-Options "nosniff";
    }

    # 2. Hashed JS/CSS — cache 1 year, immutable
    location ~* \.[0-9a-f]{8,}\.(js|css)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Vary "Accept-Encoding";
    }

    # 3. Fonts — cache 1 year
    location ~* \.(woff2?|ttf|otf|eot)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # 4. Images — cache 1 day, CDN cacheable
    location ~* \.(png|jpg|jpeg|gif|svg|webp|avif)$ {
        add_header Cache-Control "public, max-age=86400";
    }

    # 5. API proxy — no browser cache, let app-level cache handle
    location /api/ {
        proxy_pass http://backend;
        add_header Cache-Control "private, no-cache";
    }

    # SPA fallback
    location / {
        try_files $uri /index.html;
    }
}
```

```
Cache Strategy Matrix
═══════════════════════════════════════════════════════════════
Resource         Cache-Control                  TTL     ETag
─────────────────────────────────────────────────────────────
index.html       no-cache                       0*      ✓
app.[hash].js    public, immutable              1 year  ✗
style.[hash].css public, immutable              1 year  ✗
/api/products    private, max-age=60, swr=30    60s     ✓
/api/user        private, no-cache              0*      ✓
logo.svg         public, max-age=86400          1 day   ✓
*.woff2          public, immutable              1 year  ✗

* 0 = always revalidate, but 304 is fast
```

🧠 **Memory Hook — "HIFI"**: HTML=no-cache, Immutable=hashed, Fonts=immutable, Images=1day

❌ **Common Mistake**: Caching `index.html` with long max-age → users stuck on old version forever. HTML MUST be `no-cache`.

---

### Q05. You deployed a hotfix but users still see the old version. Debug this.

**🔴 Senior**

**EN**: This is a classic production caching incident. Systematic debugging approach:

**VI**: Đây là sự cố caching production kinh điển. Cần debug có hệ thống:

```
Debugging Stale Content — Decision Tree
════════════════════════════════════════════════════════════

User reports old version
         │
    ┌────▼─────┐
    │ Check    │──── Open DevTools → Network tab
    │ index.   │     → Disable cache → Reload
    │ html     │     → Is HTML fresh?
    └────┬─────┘
    YES  │  NO → Check Cache-Control on HTML
         │       → Is CDN caching HTML? Check s-maxage
         │       → Purge CDN: curl -X PURGE https://cdn.example.com/
         │
    ┌────▼─────┐
    │ Check    │──── Are JS/CSS URLs updated in HTML?
    │ asset    │     → New hash in <script src>?
    │ refs     │
    └────┬─────┘
    YES  │  NO → Build didn't run or deploy incomplete
         │       → Check CI/CD pipeline logs
         │
    ┌────▼──────┐
    │ Check     │──── navigator.serviceWorker.getRegistrations()
    │ Service   │     → Is SW serving stale from cache?
    │ Worker    │
    └────┬──────┘
    NO   │  YES → SW update not triggering
    SW   │       → skipWaiting() + clients.claim()
         │       → Or: unregister SW and reload
         │
    ┌────▼─────┐
    │ Check    │──── curl -I https://example.com/index.html
    │ CDN      │     → X-Cache: HIT or MISS?
    │ headers  │     → Age: header value?
    └──────────┘     → Purge CDN and check again
```

```typescript
// Emergency: force Service Worker update
async function forceUpdate(): Promise<void> {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.update(); // Force check for new SW
    }
  }
  // Hard reload bypassing all caches
  window.location.reload();
}

// In SW: ensure skipWaiting
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Don't wait for old tabs to close
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((name) => name !== CURRENT_CACHE).map((name) => caches.delete(name)),
        ),
      ),
  );
  self.clients.claim(); // Take control of all open tabs
});
```

```bash
# CDN debugging commands
# Check cache status
curl -sI https://example.com/ | grep -i 'cache\|age\|etag\|x-cache'

# Purge Cloudflare cache via API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Purge specific URLs
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  --data '{"files":["https://example.com/index.html"]}'
```

🎯 **Interview Signal**: Interviewer muốn thấy systematic debugging approach, không chỉ "clear cache". Cần biết check từng layer: browser → SW → CDN → origin.

**Real-world case**: Shopee flash sale — deploy hotfix for cart bug nhưng CDN vẫn serve old HTML vì `s-maxage=300`. Fix: purge CDN + set `s-maxage=0` cho HTML.

---

### Q06. How does `stale-while-revalidate` work at the HTTP level?

**🔴 Senior**

**EN**: `stale-while-revalidate` (RFC 5861) is a Cache-Control extension that lets the browser serve a stale response immediately while fetching a fresh one in the background. This gives users instant responses while keeping content eventually fresh.

**VI**: `stale-while-revalidate` cho phép browser trả stale response ngay lập tức trong khi fetch fresh version ở background. User thấy nội dung tức thì, và nội dung sẽ fresh cho request tiếp theo.

```
stale-while-revalidate Timeline
═══════════════════════════════════════════════════════════

Cache-Control: max-age=60, stale-while-revalidate=30

 0s          60s              90s
 ├───fresh───┤──stale-ok──────┤──must-revalidate──►
 │           │                │
 │ Serve     │ Serve stale    │ Must fetch
 │ from      │ immediately +  │ from origin
 │ cache     │ revalidate in  │ (blocking)
 │ (fast)    │ background     │
 │           │ (fast+fresh)   │
```

```typescript
// Server-side configuration
// Express middleware for API caching
function apiCache(maxAge: number, swr: number) {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.set("Cache-Control", `public, max-age=${maxAge}, stale-while-revalidate=${swr}`);
    next();
  };
}

app.get("/api/products", apiCache(60, 30), getProducts);
// Result: Cache-Control: public, max-age=60, stale-while-revalidate=30
// → Fresh for 60s, then serve stale for 30s while revalidating
```

```typescript
// Application-level SWR with TanStack Query
import { useQuery } from '@tanstack/react-query';

function ProductList() {
  const { data, isStale, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
    staleTime: 60_000,        // Fresh for 60s (like max-age)
    gcTime: 5 * 60_000,       // Keep in memory 5min (garbage collection)
    refetchOnWindowFocus: true, // Revalidate when tab gets focus
  });

  return (
    <div>
      {isFetching && <Spinner className="corner" />}
      {/* Data shown immediately even if stale */}
      <ProductGrid products={data ?? []} />
    </div>
  );
}
```

🧠 **Memory Hook**: SWR = "Serve stale, Worker revalidates" — instant UX, eventual freshness.

---

### Section B: Service Worker Cache

---

### Q07. What is the Service Worker Cache API?

**🟢 Junior**

**EN**: The Cache API provides a storage mechanism for Request/Response pairs within a Service Worker. Unlike HTTP cache (controlled by headers), the Cache API gives you programmatic control over what to cache and when.

**VI**: Cache API cung cấp cơ chế lưu trữ cặp Request/Response trong Service Worker. Khác với HTTP cache (do header quyết định), Cache API cho bạn quyền kiểm soát programmatic: cache gì, khi nào, và xóa khi nào.

```typescript
// Basic Cache API operations
// In service-worker.ts

const CACHE_NAME = "my-app-v1";

// Open a named cache
const cache = await caches.open(CACHE_NAME);

// Store a response
await cache.put("/api/products", new Response(JSON.stringify(data)));

// Match a request — returns Response | undefined
const response = await cache.match("/api/products");

// Add URL (fetch + store)
await cache.add("/styles/main.css");

// Add multiple URLs
await cache.addAll(["/", "/styles/main.css", "/scripts/app.js", "/images/logo.svg"]);

// Delete an entry
await cache.delete("/api/products");

// List all entries
const keys = await cache.keys(); // Request[]

// Delete entire cache
await caches.delete(CACHE_NAME);

// List all cache names
const names = await caches.keys(); // string[]
```

🎯 **Interview Signal**: Biết Cache API khác HTTP cache. Biết lifecycle: open → put/add → match → delete.

---

### Q08. Compare Workbox caching strategies.

**🟡 Mid**

**EN**: Workbox is Google's library that provides pre-built caching strategies for Service Workers. Each strategy represents a different trade-off between speed and freshness.

**VI**: Workbox là thư viện của Google cung cấp các chiến lược caching sẵn cho Service Worker. Mỗi strategy là một trade-off khác nhau giữa tốc độ và freshness.

| Strategy                 | Hành vi                      | Use Case                        | Speed  | Freshness |
| ------------------------ | ---------------------------- | ------------------------------- | ------ | --------- |
| **CacheFirst**           | Cache → fallback Network     | Fonts, images, hashed JS/CSS    | ⚡⚡⚡ | ⭐        |
| **NetworkFirst**         | Network → fallback Cache     | API data, user-specific content | ⚡     | ⭐⭐⭐    |
| **StaleWhileRevalidate** | Cache → + background Network | Semi-dynamic content            | ⚡⚡⚡ | ⭐⭐      |
| **NetworkOnly**          | Network only (no cache)      | Analytics, auth requests        | ⚡     | ⭐⭐⭐    |
| **CacheOnly**            | Cache only (no network)      | Pre-cached app shell            | ⚡⚡⚡ | ⭐        |

```typescript
// workbox-config.ts — complete Workbox setup
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// Pre-cache app shell (build-time manifest)
precacheAndRoute(self.__WB_MANIFEST);

// 1. CacheFirst — static assets (fonts, images)
registerRoute(
  ({ request }) => request.destination === "image" || request.destination === "font",
  new CacheFirst({
    cacheName: "static-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// 2. NetworkFirst — API data
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 3, // Fallback to cache after 3s
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  }),
);

// 3. StaleWhileRevalidate — CSS/JS without hash
registerRoute(
  ({ request }) => request.destination === "style" || request.destination === "script",
  new StaleWhileRevalidate({
    cacheName: "dynamic-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  }),
);
```

```
Strategy Decision Tree
═══════════════════════════════════════════

Is the resource hashed / immutable?
  YES → CacheFirst
  NO  ↓

Is freshness critical? (user data, prices)
  YES → NetworkFirst
  NO  ↓

Is it semi-dynamic? (blog posts, configs)
  YES → StaleWhileRevalidate
  NO  ↓

Should it never be cached? (analytics, auth)
  YES → NetworkOnly
  NO  → CacheOnly (pre-cached only)
```

🧠 **Memory Hook — "CNSNC"**: CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly, CacheOnly

---

### Q09. Pre-caching vs runtime caching — what's the difference?

**🟡 Mid**

**EN**:

- **Pre-caching** happens at Service Worker install time. You define a list of URLs (manifest) that gets cached before the SW activates. Used for the app shell — HTML, critical CSS, core JS.
- **Runtime caching** happens on-the-fly as the user navigates. When a request matches a route pattern, the SW applies a caching strategy. Used for dynamic content — API data, images loaded on scroll.

**VI**:

- **Pre-caching**: Cache tại thời điểm SW install. Định nghĩa danh sách URL cố định (manifest) → cache trước khi SW active. Dùng cho app shell.
- **Runtime caching**: Cache khi user duyệt web. Khi request match pattern → SW áp dụng strategy. Dùng cho nội dung động.

```typescript
// Pre-caching: defined at build time
// vite.config.ts with vite-plugin-pwa
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      workbox: {
        // Pre-cache these patterns
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // Runtime caching rules
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5,
              },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.example\.com\/images\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
});
```

| Aspect  | Pre-caching                   | Runtime Caching                   |
| ------- | ----------------------------- | --------------------------------- |
| When    | SW install event              | On each request                   |
| What    | Known URL list (manifest)     | Pattern-matched requests          |
| Updates | New SW version = new manifest | Cache expires or strategy decides |
| Size    | App shell only (~50-500KB)    | Grows with usage                  |
| Offline | Available immediately         | Only after first visit            |

---

### Q10. How do you handle Service Worker cache versioning and cleanup?

**🟡 Mid**

**EN**: Cache versioning prevents users from getting stuck on stale content. The pattern is: name caches with versions, and in the `activate` event, delete old caches.

**VI**: Cache versioning ngăn user bị kẹt với nội dung cũ. Pattern: đặt tên cache có version, và trong `activate` event, xóa cache cũ.

```typescript
// service-worker.ts
const CACHE_VERSION = "v3";
const CACHE_NAME = `app-${CACHE_VERSION}`;

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(["/", "/index.html", "/styles/main.css", "/scripts/app.js"])),
  );
  self.skipWaiting(); // Don't wait for old SW to die
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name.startsWith("app-") && name !== CACHE_NAME)
            .map((name) => {
              console.log(`[SW] Deleting old cache: ${name}`);
              return caches.delete(name);
            }),
        ),
      )
      .then(() => self.clients.claim()), // Take control immediately
  );
});
```

🎯 **Interview Signal**: Biết pattern `skipWaiting()` + `clients.claim()` + cleanup old caches. Biết rủi ro nếu không cleanup.

---

### Q11. Users report stale content after deploy. Service Worker is the culprit. Fix it.

**🔴 Senior**

**EN**: The classic Service Worker stale content problem. The SW lifecycle means a new SW won't activate until all tabs with the old SW are closed — unless you use `skipWaiting()`.

**VI**: Vấn đề kinh điển với SW. Lifecycle SW nghĩa là SW mới không activate cho đến khi tất cả tab dùng SW cũ đóng — trừ khi dùng `skipWaiting()`.

```typescript
// Problem: User has old SW active, new SW is "waiting"
// Solution 1: skipWaiting in SW
self.addEventListener("install", () => {
  self.skipWaiting(); // Activate immediately, don't wait
});

// Solution 2: Prompt user to update
// In main app:
if ("serviceWorker" in navigator) {
  const reg = await navigator.serviceWorker.register("/sw.js");

  reg.addEventListener("updatefound", () => {
    const newWorker = reg.installing;
    if (!newWorker) return;

    newWorker.addEventListener("statechange", () => {
      if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
        // New SW installed but old one still active
        showUpdateBanner(); // "New version available! Click to update."
      }
    });
  });
}

function showUpdateBanner() {
  const banner = document.createElement("div");
  banner.innerHTML = `
    <div class="update-banner">
      New version available!
      <button onclick="applyUpdate()">Update now</button>
    </div>
  `;
  document.body.appendChild(banner);
}

function applyUpdate() {
  navigator.serviceWorker.getRegistration().then((reg) => {
    reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
  });

  // Reload after new SW takes over
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

// In SW: listen for skip waiting message
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
```

❌ **Common Mistake**: Using `skipWaiting()` without `clients.claim()` → new SW active but old tabs still use old cache.

---

### Q12. Design an offline-first strategy using Service Worker.

**🔴 Senior**

**EN**: Offline-first means the app works without network and syncs when connected. Architecture: App Shell (pre-cached) + Dynamic Content (runtime cached) + Sync Queue (pending mutations).

**VI**: Offline-first nghĩa là app hoạt động không cần network và sync khi có kết nối. Kiến trúc: App Shell (pre-cached) + Dynamic Content (runtime cached) + Sync Queue (mutations chờ gửi).

```typescript
// Offline-first architecture
// 1. App Shell: pre-cache at install
// 2. API data: NetworkFirst with cache fallback
// 3. Mutations: queue in IndexedDB, replay when online

// Background Sync for queued mutations
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "sync-mutations") {
    event.waitUntil(replayMutations());
  }
});

async function replayMutations(): Promise<void> {
  const db = await openDB("sync-queue", 1);
  const tx = db.transaction("mutations", "readwrite");
  const store = tx.objectStore("mutations");
  const mutations = await store.getAll();

  for (const mutation of mutations) {
    try {
      await fetch(mutation.url, {
        method: mutation.method,
        headers: mutation.headers,
        body: mutation.body,
      });
      await store.delete(mutation.id);
    } catch {
      break; // Stop on first failure, retry later
    }
  }
}

// In the app: queue mutations when offline
async function apiMutate(url: string, options: RequestInit): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch {
    // Offline — queue for later
    const db = await openDB("sync-queue", 1);
    await db.add("mutations", {
      id: crypto.randomUUID(),
      url,
      method: options.method,
      headers: Object.fromEntries(new Headers(options.headers).entries()),
      body: options.body,
      timestamp: Date.now(),
    });

    // Register for background sync
    const reg = await navigator.serviceWorker.ready;
    await reg.sync.register("sync-mutations");

    // Return optimistic response
    return new Response(JSON.stringify({ queued: true }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

---

### Section C: Application-Level Cache

---

### Q13. What is TanStack Query and how does it cache server data?

**🟢 Junior**

**EN**: TanStack Query (formerly React Query) is a server-state management library that handles fetching, caching, synchronizing, and updating server data. It distinguishes between **client state** (UI state like modals, form inputs) and **server state** (data from APIs that can be stale, shared, and needs background updating).

**VI**: TanStack Query là thư viện quản lý server-state: fetch, cache, sync, và update dữ liệu từ server. Nó phân biệt rõ **client state** (UI: modal, form) và **server state** (API data: có thể stale, shared, cần background update).

```typescript
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure cache behavior globally
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,       // Data fresh for 60s
      gcTime: 5 * 60_000,      // Keep in memory 5min after last use
      retry: 3,                 // Retry failed requests 3 times
      refetchOnWindowFocus: true, // Refetch when tab gets focus
      refetchOnReconnect: true,   // Refetch when network reconnects
    },
  },
});

function ProductList() {
  const {
    data,        // Cached or fetched data
    isLoading,   // First load, no cached data
    isFetching,  // Background refetch (data may exist)
    isStale,     // Data older than staleTime
    error,       // Error object
  } = useQuery({
    queryKey: ['products', { category: 'electronics' }],
    queryFn: async () => {
      const res = await fetch('/api/products?category=electronics');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<Product[]>;
    },
    staleTime: 30_000, // Override: fresh for 30s
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback error={error} />;

  return (
    <>
      {isFetching && <RefreshIndicator />}
      <ProductGrid products={data} />
    </>
  );
}
```

| Term         | Ý nghĩa                                                   | Default          |
| ------------ | --------------------------------------------------------- | ---------------- |
| `staleTime`  | Thời gian data được coi là fresh                          | 0 (always stale) |
| `gcTime`     | Thời gian giữ data trong memory sau khi component unmount | 5 phút           |
| `isLoading`  | Đang fetch lần đầu (không có cache)                       | —                |
| `isFetching` | Đang fetch (có thể có cache)                              | —                |
| `isStale`    | Data đã cũ hơn staleTime                                  | —                |

🧠 **Memory Hook**: "staleTime = how long data stays VALID, gcTime = how long MEMORY keeps it"

---

### Q14. How do you design a queryKey hierarchy in TanStack Query?

**🟡 Mid**

**EN**: QueryKeys are arrays that uniquely identify cached data. A good hierarchy enables precise invalidation and automatic refetching.

**VI**: QueryKeys là array định danh duy nhất cho data trong cache. Hierarchy tốt cho phép invalidation chính xác và auto refetch.

```typescript
// QueryKey hierarchy pattern
// Level 1: Entity type
['products']

// Level 2: Entity type + filters
['products', { category: 'electronics', sort: 'price' }]

// Level 3: Single entity
['products', 42]

// Level 4: Nested resource
['products', 42, 'reviews']

// Factory pattern for queryKeys
const productKeys = {
  all:      ['products'] as const,
  lists:    () => [...productKeys.all, 'list'] as const,
  list:     (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details:  () => [...productKeys.all, 'detail'] as const,
  detail:   (id: number) => [...productKeys.details(), id] as const,
  reviews:  (id: number) => [...productKeys.detail(id), 'reviews'] as const,
};

// Usage
useQuery({ queryKey: productKeys.detail(42), queryFn: ... });

// Invalidation — fuzzy matching
const queryClient = useQueryClient();

// Invalidate ALL products (lists + details)
queryClient.invalidateQueries({ queryKey: productKeys.all });

// Invalidate only product lists (not details)
queryClient.invalidateQueries({ queryKey: productKeys.lists() });

// Invalidate single product + its reviews
queryClient.invalidateQueries({ queryKey: productKeys.detail(42) });
```

🎯 **Interview Signal**: Biết dùng factory pattern cho queryKey. Biết fuzzy matching cho invalidation.

---

### Q15. Explain Apollo Client's normalized cache.

**🟡 Mid**

**EN**: Apollo Client's `InMemoryCache` normalizes data by splitting query results into individual objects, each identified by `__typename:id`. This means if the same entity appears in multiple queries, it's stored once and updates propagate everywhere.

**VI**: `InMemoryCache` của Apollo normalize data bằng cách tách query results thành objects riêng lẻ, mỗi cái định danh bởi `__typename:id`. Entity xuất hiện ở nhiều queries chỉ lưu 1 lần → update lan truyền khắp nơi.

```typescript
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        // Custom key fields (default: id)
        keyFields: ["sku"],
        fields: {
          // Custom field merge for pagination
          reviews: {
            keyArgs: ["sort"],
            merge(existing = [], incoming, { args }) {
              if (args?.offset === 0) return incoming;
              return [...existing, ...incoming];
            },
          },
          // Computed field
          displayPrice: {
            read(_, { readField }) {
              const price = readField<number>("price");
              const currency = readField<string>("currency");
              return `${currency} ${price?.toFixed(2)}`;
            },
          },
        },
      },
      Query: {
        fields: {
          // Redirect single product to cached entity
          product(_, { args, toReference }) {
            return toReference({ __typename: "Product", sku: args?.sku });
          },
        },
      },
    },
  }),
});

// Direct cache manipulation
client.cache.modify({
  id: client.cache.identify({ __typename: "Product", sku: "ABC-123" }),
  fields: {
    stock: (prev: number) => prev - 1,
  },
});
```

```
Apollo Cache Normalization
═══════════════════════════════════════════

GraphQL Response:           Normalized Cache:
{                           ┌────────────────────────┐
  products: [               │ ROOT_QUERY             │
    {                       │   products: [→Ref, →Ref]│
      id: "1",             └─────┬──────────────────┘
      name: "Phone",             │
      reviews: [{                │
        id: "r1",          ┌─────▼──────────────┐
        text: "Great"      │ Product:1           │
      }]                   │   name: "Phone"     │
    },                     │   reviews: [→Ref]   │
    {                      └─────┬──────────────┘
      id: "2",                   │
      name: "Laptop"       ┌─────▼──────────────┐
    }                      │ Review:r1           │
  ]                        │   text: "Great"     │
}                          └────────────────────┘
                           ┌────────────────────┐
                           │ Product:2           │
                           │   name: "Laptop"    │
                           └────────────────────┘
```

---

### Q16. How do you implement optimistic updates with rollback?

**🟡 Mid**

**EN**: Optimistic updates show the expected result immediately before the server confirms. If the server rejects, you rollback to the previous state.

**VI**: Optimistic updates hiển thị kết quả mong đợi ngay trước khi server xác nhận. Nếu server reject → rollback về state cũ.

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function useTodoToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: Todo) =>
      fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !todo.completed }),
      }).then((r) => {
        if (!r.ok) throw new Error("Update failed");
        return r.json();
      }),

    // 1. Optimistic update BEFORE request
    onMutate: async (newTodo) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot previous value for rollback
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);

      // Optimistically update
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) => (t.id === newTodo.id ? { ...t, completed: !t.completed } : t)),
      );

      return { previous }; // Context for rollback
    },

    // 2. Rollback on error
    onError: (_err, _todo, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["todos"], context.previous);
      }
      toast.error("Failed to update. Reverted.");
    },

    // 3. Always refetch after mutation settles
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```

🧠 **Memory Hook — "SOR"**: Snapshot → Optimistic update → Rollback on error

❌ **Common Mistake**: Forgetting `cancelQueries` → race condition: refetch overwrites optimistic update.

---

### Q17. Compare React Query vs SWR vs Apollo Client caching.

**🟡 Mid**

| Feature               | TanStack Query          | SWR                             | Apollo Client               |
| --------------------- | ----------------------- | ------------------------------- | --------------------------- |
| **Protocol**          | REST / any              | REST / any                      | GraphQL                     |
| **Cache type**        | Query-key based         | Key-based                       | Normalized (entity)         |
| **Stale concept**     | staleTime + gcTime      | dedupingInterval + revalidation | `fetchPolicy`               |
| **Optimistic update** | `onMutate` snapshot     | `optimisticData` option         | `optimisticResponse`        |
| **DevTools**          | ✅ React Query DevTools | ✅ SWR DevTools                 | ✅ Apollo DevTools          |
| **Pagination**        | `useInfiniteQuery`      | `useSWRInfinite`                | `fetchMore` + merge         |
| **Bundle size**       | ~13KB gzip              | ~4KB gzip                       | ~33KB gzip                  |
| **Offline support**   | `persistQueryClient`    | Limited                         | `RetryLink` + cache persist |
| **Auto dedup**        | ✅ By queryKey          | ✅ By key                       | ✅ By query + variables     |
| **SSR**               | ✅ Hydration            | ✅ Hydration                    | ✅ `getDataFromTree`        |

**When to use which**:

- **TanStack Query**: REST APIs, complex mutations, need DevTools, large team
- **SWR**: Simple data fetching, minimal config, small bundle priority
- **Apollo**: GraphQL API, normalized cache needed, complex entity relationships

---

### Q18. How do you implement tag-based cache invalidation?

**🔴 Senior**

**EN**: Tag-based invalidation lets you invalidate groups of related queries using semantic tags rather than exact query keys. This is essential for complex UIs where a mutation affects multiple screens.

**VI**: Tag-based invalidation cho phép invalidate nhóm queries liên quan bằng tag semantic thay vì exact query key. Cần thiết cho UI phức tạp khi mutation ảnh hưởng nhiều màn hình.

```typescript
// TanStack Query: fuzzy matching IS tag-based invalidation
const queryClient = useQueryClient();

// After creating a new product:
// Invalidate all product-related queries
queryClient.invalidateQueries({ queryKey: ["products"] });
// This invalidates:
// ['products']
// ['products', 'list', { category: 'electronics' }]
// ['products', 'detail', 42]
// ['products', 42, 'reviews']

// More precise: predicate-based invalidation
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === "products" ||
    query.queryKey[0] === "cart" || // Cart shows product info too
    query.queryKey[0] === "recommendations",
});

// Server-driven invalidation via mutation response
const mutation = useMutation({
  mutationFn: updateProduct,
  onSuccess: (data) => {
    // Server tells us what to invalidate
    if (data.invalidateTags) {
      for (const tag of data.invalidateTags) {
        queryClient.invalidateQueries({ queryKey: [tag] });
      }
    }
  },
});
```

---

### Q19. Your app shows stale data after a mutation. Debug the cache.

**🔴 Senior**

**EN**: Systematic approach to debugging stale data after mutations.

**VI**: Debug có hệ thống khi data cũ sau mutation.

```
Stale Data After Mutation — Debug Flow
═══════════════════════════════════════════════════

Data still stale after mutation
         │
    ┌────▼─────────┐
    │ Open React   │  Is the mutation in the cache?
    │ Query DevTool│  Check mutation status
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Check        │  Is invalidateQueries called?
    │ onSuccess /  │  Is the queryKey matching?
    │ onSettled    │  Try: queryClient.getQueryState(['key'])
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Check        │  Is staleTime too high?
    │ staleTime    │  If staleTime=Infinity → never auto refetch
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Check query  │  queryKey: ['products', { sort: 'name' }]
    │ key match    │  invalidate: ['products']
    │              │  → ✅ Fuzzy match works
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Check        │  Network tab: is refetch request going out?
    │ network      │  Is response returning updated data?
    │ tab          │  If yes but UI stale → component not re-rendering
    └──────────────┘
```

```typescript
// Debug helpers
const queryClient = useQueryClient();

// Check all queries and their state
const allQueries = queryClient.getQueryCache().getAll();
for (const query of allQueries) {
  console.log({
    key: query.queryKey,
    state: query.state.status,
    stale: query.isStale(),
    lastUpdated: new Date(query.state.dataUpdatedAt),
    data: query.state.data,
  });
}

// Force refetch specific query
queryClient.refetchQueries({ queryKey: ["products"], type: "active" });
```

---

### Section D: CDN & Edge Caching

---

### Q20. How does CDN caching work and how do you configure it?

**🟡 Mid**

**EN**: A CDN (Content Delivery Network) caches content at edge servers geographically close to users. CDN respects origin's `Cache-Control` headers but can also be controlled via CDN-specific headers.

**VI**: CDN cache content tại edge servers gần user về địa lý. CDN tuân theo `Cache-Control` từ origin nhưng cũng có thể kiểm soát bằng CDN-specific headers.

```typescript
// Cloudflare Workers — edge caching with custom logic
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Different cache rules per path
    const cacheRules: Record<string, string> = {
      "/api/products": "public, s-maxage=60, stale-while-revalidate=30",
      "/api/user": "private, no-store",
      "/static/": "public, max-age=31536000, immutable",
    };

    const response = await fetch(request);
    const newResponse = new Response(response.body, response);

    // Apply cache rules
    for (const [pattern, cacheControl] of Object.entries(cacheRules)) {
      if (url.pathname.startsWith(pattern)) {
        newResponse.headers.set("Cache-Control", cacheControl);
        break;
      }
    }

    // Add CDN-specific header
    newResponse.headers.set("CDN-Cache-Control", "max-age=300");

    return newResponse;
  },
};
```

| Header              | Scope                      | Ý nghĩa                              |
| ------------------- | -------------------------- | ------------------------------------ |
| `Cache-Control`     | All caches (browser + CDN) | Kiểm soát mọi cache layer            |
| `CDN-Cache-Control` | CDN only                   | Override cho CDN, browser không thấy |
| `Surrogate-Control` | CDN only (Fastly/Varnish)  | Tương tự CDN-Cache-Control           |
| `s-maxage`          | Shared caches (CDN/proxy)  | Override max-age cho CDN             |

---

### Q21. What is Surrogate-Key / Cache-Tag based invalidation?

**🟡 Mid**

**EN**: Surrogate-Key (Fastly) or Cache-Tag (Cloudflare) lets you tag cached responses and purge all responses with a specific tag in one API call. This enables surgical invalidation instead of purging everything.

**VI**: Surrogate-Key / Cache-Tag cho phép gắn tag vào cached responses và purge tất cả responses có tag cụ thể bằng 1 API call. Invalidation chính xác thay vì purge toàn bộ.

```typescript
// Origin server: tag responses
app.get("/api/products/:id", async (req, res) => {
  const product = await db.getProduct(req.params.id);

  res.set({
    "Cache-Control": "public, s-maxage=3600",
    // Cloudflare Cache-Tag
    "Cache-Tag": `product-${product.id}, category-${product.category}, all-products`,
    // Fastly Surrogate-Key
    "Surrogate-Key": `product-${product.id} category-${product.category}`,
  });

  res.json(product);
});

// When product is updated, purge by tag
async function purgeProductCache(productId: string): Promise<void> {
  // Cloudflare: purge by Cache-Tag
  await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags: [`product-${productId}`], // Purge all pages showing this product
    }),
  });
}
```

```
Tag-based Purge Example
═══════════════════════════════════════════

Product page /products/42 has tags:
  → product-42, category-electronics, all-products

Category page /category/electronics has tags:
  → category-electronics, all-products

When product 42 price changes:
  purge tag "product-42"
  → /products/42 purged ✓
  → /category/electronics NOT purged (different tag)

When new product added to electronics:
  purge tag "category-electronics"
  → /products/42 purged ✓
  → /category/electronics purged ✓
```

---

### Q22. Design a multi-layer cache architecture for an e-commerce app.

**🔴 Senior**

**EN**: Multi-layer cache architecture optimizes for both speed and freshness. Each layer has different TTLs and invalidation strategies.

**VI**: Kiến trúc cache nhiều tầng tối ưu cả tốc độ và freshness. Mỗi tầng có TTL và invalidation strategy khác nhau.

```
E-Commerce Multi-Layer Cache Architecture
═══════════════════════════════════════════════════════════════

Layer 1: Browser (per-user)
┌─────────────────────────────────────────────────┐
│  TanStack Query: staleTime=30s, gcTime=5min     │
│  Service Worker: CacheFirst for images/fonts     │
│  HTTP Cache: immutable for hashed assets         │
└────────────────────┬────────────────────────────┘
                     │ miss
Layer 2: CDN Edge (shared, geo-distributed)
┌────────────────────▼────────────────────────────┐
│  Cloudflare: s-maxage=60, swr=30                │
│  Cache-Tag per product/category for purge       │
│  Edge Worker: A/B test routing                   │
└────────────────────┬────────────────────────────┘
                     │ miss
Layer 3: API Gateway Cache (shared, region)
┌────────────────────▼────────────────────────────┐
│  Redis: TTL=300s for product listings            │
│  Response cache: hash(endpoint+params+user-tier) │
│  Stampede protection: lock + stale-serve         │
└────────────────────┬────────────────────────────┘
                     │ miss
Layer 4: Origin Server + Database
┌────────────────────▼────────────────────────────┐
│  PostgreSQL with query cache                     │
│  Materialized views for heavy aggregations       │
└─────────────────────────────────────────────────┘
```

```typescript
// Preventing cache stampede at API gateway level
class CacheWithStampedeProtection {
  private cache: Map<string, { data: unknown; expires: number }> = new Map();
  private locks: Map<string, Promise<unknown>> = new Map();

  async get<T>(key: string, fetcher: () => Promise<T>, ttlMs: number): Promise<T> {
    const cached = this.cache.get(key);

    // Fresh cache hit
    if (cached && cached.expires > Date.now()) {
      return cached.data as T;
    }

    // Check if another request is already fetching
    const existingLock = this.locks.get(key);
    if (existingLock) {
      // Wait for the other request, serve stale if available
      if (cached) return cached.data as T; // Stale-while-revalidate
      return existingLock as Promise<T>;
    }

    // This request wins the lock — fetch fresh data
    const fetchPromise = fetcher()
      .then((data) => {
        this.cache.set(key, { data, expires: Date.now() + ttlMs });
        this.locks.delete(key);
        return data;
      })
      .catch((err) => {
        this.locks.delete(key);
        if (cached) return cached.data as T; // Fallback to stale on error
        throw err;
      });

    this.locks.set(key, fetchPromise);
    return fetchPromise;
  }
}
```

🎯 **Interview Signal**: Biết thiết kế cache theo tầng với TTL khác nhau. Biết cache stampede và cách phòng tránh. Biết invalidation propagation qua các tầng.

---

### Q23. How do you handle cache consistency across multiple CDN PoPs?

**🔴 Senior**

**EN**: CDN has multiple Points of Presence (PoPs) worldwide. When you purge, the purge needs to propagate to all PoPs, which takes time (typically 1-30 seconds). During this window, different users may see different versions.

**VI**: CDN có nhiều PoPs trên toàn thế giới. Khi purge, cần propagate đến tất cả PoPs → mất thời gian (1-30 giây). Trong window này, user khác nhau có thể thấy phiên bản khác nhau.

```
CDN PoP Consistency Problem
═══════════════════════════════════════════

Timeline after purge at t=0:
  t=0    Origin purges cache
  t=0.1  US-East PoP purged ✓
  t=0.5  US-West PoP purged ✓
  t=2    EU PoP purged ✓
  t=5    Asia PoP purged ✓

User in Asia at t=1 still sees old content!
```

**Mitigation strategies**:

1. **Soft purge** (Fastly): mark as stale, serve stale while revalidating
2. **Content versioning**: URL changes = instant invalidation everywhere
3. **Short s-maxage + stale-while-revalidate**: reduces inconsistency window
4. **Accept eventual consistency**: for non-critical content (blog, product descriptions)
5. **Real-time via WebSocket**: for critical data (prices, stock), bypass CDN

---

### Section E: Architecture & Trade-offs

---

### Q24. What is cache stampede and how do you prevent it?

**🟡 Mid**

**EN**: Cache stampede (thundering herd) happens when a cached item expires and hundreds of concurrent requests all try to regenerate it simultaneously, overwhelming the origin server.

**VI**: Cache stampede xảy ra khi cached item hết hạn và hàng trăm request đồng thời cùng cố fetch lại, làm quá tải origin server.

```
Cache Stampede
═══════════════════════════════════════════

Normal:    ──▮──▮──▮──▮──▮──────────────────────────
           Cache serves all requests

Stampede:  ──────────X (cache expires)
           ──────────┬──→ Origin
           ──────────┬──→ Origin   ← All at once!
           ──────────┬──→ Origin
           ──────────┬──→ Origin
           ──────────┬──→ Origin
                     └── 💥 Origin overwhelmed

Fixed:     ──────────X (cache expires)
           ──────────┬──→ Origin (lock holder)
           ──────────├──→ stale cache (others wait)
           ──────────├──→ stale cache
           ──────────├──→ stale cache
           ──────────└──→ fresh cache ✓ (lock released)
```

**Prevention strategies**:

```typescript
// Strategy 1: Stale-while-revalidate (HTTP level)
// Cache-Control: max-age=60, stale-while-revalidate=30
// → After 60s, serve stale while ONE request revalidates

// Strategy 2: Lock-based (application level)
async function getWithLock<T>(key: string, fetcher: () => Promise<T>, redis: Redis): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Try to acquire lock
  const lockKey = `lock:${key}`;
  const acquired = await redis.set(lockKey, "1", "NX", "EX", 10);

  if (acquired) {
    // This request fetches fresh data
    const data = await fetcher();
    await redis.set(key, JSON.stringify(data), "EX", 60);
    await redis.del(lockKey);
    return data;
  }

  // Another request holds the lock — wait and retry
  await new Promise((r) => setTimeout(r, 100));
  return getWithLock(key, fetcher, redis);
}

// Strategy 3: Jittered expiry (prevent synchronized expiration)
function jitteredTTL(baseTTL: number): number {
  const jitter = Math.random() * 0.2 * baseTTL; // ±20%
  return baseTTL + jitter;
}
```

🧠 **Memory Hook**: "Stampede = 100 horses through one gate. Lock = one horse goes, others wait."

---

### Q25. How do you monitor cache hit rates and debug cache misses?

**🔴 Senior**

**EN**: Monitoring cache effectiveness is critical for performance optimization. You need visibility into hit rates, miss reasons, and cache size across all layers.

**VI**: Giám sát hiệu quả cache rất quan trọng cho tối ưu performance. Cần visibility vào hit rates, lý do miss, và cache size ở mọi tầng.

```typescript
// 1. CDN: Check via response headers
// Cache-Status: "Cloudflare"; hit  (or miss, expired, stale)
// Cf-Cache-Status: HIT | MISS | EXPIRED | STALE | DYNAMIC
// Age: 45  (seconds since cached)

// 2. Browser: Navigation Timing API
const paintEntries = performance.getEntriesByType("resource");
for (const entry of paintEntries as PerformanceResourceTiming[]) {
  const cacheInfo = {
    name: entry.name,
    // transferSize = 0 means served from cache
    fromCache: entry.transferSize === 0,
    // decodedBodySize > 0 but transferSize = 0 → disk/memory cache
    fromDiskCache: entry.transferSize === 0 && entry.decodedBodySize > 0,
    duration: entry.duration,
  };
  console.log(cacheInfo);
}

// 3. TanStack Query: custom logger
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
});

// Monitor cache effectiveness
setInterval(() => {
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();
  const stats = {
    total: queries.length,
    fresh: queries.filter((q) => !q.isStale()).length,
    stale: queries.filter((q) => q.isStale()).length,
    fetching: queries.filter((q) => q.state.fetchStatus === "fetching").length,
    error: queries.filter((q) => q.state.status === "error").length,
  };
  console.log("[QueryCache Stats]", stats);
}, 30_000);

// 4. Service Worker: cache hit tracking
self.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Track cache hit
        analytics.track("sw_cache_hit", { url: event.request.url });
        return cached;
      }
      // Track cache miss
      analytics.track("sw_cache_miss", { url: event.request.url });
      return fetch(event.request);
    }),
  );
});
```

---

### Q26. Design a cache warming strategy for a new deployment.

**🔴 Senior**

**EN**: After deploying new code, caches are empty (cold start). Cache warming pre-populates caches to avoid slow first requests and potential stampedes.

**VI**: Sau deploy code mới, caches trống (cold start). Cache warming pre-populate caches để tránh request đầu tiên chậm và stampede.

```typescript
// Cache warming script — run post-deployment
// scripts/warm-cache.ts

const CRITICAL_URLS = [
  "/",
  "/products",
  "/categories/electronics",
  "/categories/clothing",
  // Top 50 product pages from analytics
  ...topProductUrls,
];

async function warmCache(): Promise<void> {
  console.log(`Warming ${CRITICAL_URLS.length} URLs...`);

  // Warm in batches to not overwhelm origin
  const BATCH_SIZE = 10;
  for (let i = 0; i < CRITICAL_URLS.length; i += BATCH_SIZE) {
    const batch = CRITICAL_URLS.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (url) => {
        const fullUrl = `https://example.com${url}`;
        try {
          const res = await fetch(fullUrl, {
            headers: {
              "X-Cache-Warm": "true", // For logging
              "User-Agent": "CacheWarmer/1.0",
            },
          });
          console.log(`  ${res.status} ${url} (${res.headers.get("cf-cache-status")})`);
        } catch (err) {
          console.error(`  FAIL ${url}: ${err}`);
        }
      }),
    );

    // Rate limit between batches
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("Cache warming complete.");
}

warmCache();
```

```yaml
# GitHub Actions: warm cache after deploy
name: Deploy & Warm Cache
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: npx wrangler deploy # Deploy to Cloudflare

      - name: Warm CDN Cache
        run: npx tsx scripts/warm-cache.ts
        env:
          SITE_URL: ${{ vars.SITE_URL }}
```

---

### Q27. Case Study: Shopee Flash Sale — millions of users hit the same page. Design the caching.

**🔴 Senior**

**EN**: Flash sale = millions of concurrent users hitting the same product pages. The challenge is balancing freshness (real-time stock) with speed (not crushing origin).

**VI**: Flash sale = hàng triệu user đồng thời truy cập cùng product pages. Thử thách: cân bằng freshness (stock real-time) với speed (không crush origin).

```
Flash Sale Caching Architecture
═══════════════════════════════════════════════════════════════

                    Static content        Dynamic content
                    (page shell, images)  (stock, price)
                         │                     │
                    ┌────▼────┐           ┌────▼────┐
                    │  CDN    │           │  Skip   │
                    │  1 year │           │  CDN    │
                    │  immut. │           │         │
                    └─────────┘           └────┬────┘
                                               │
                                          ┌────▼────┐
                                          │  Edge   │
                                          │  Worker │
                                          │  50ms   │
                                          │  Redis  │
                                          └────┬────┘
                                               │
                                          ┌────▼────┐
                                          │ WebSock │
                                          │ for     │
                                          │ real-   │
                                          │ time    │
                                          │ stock   │
                                          └─────────┘
```

```typescript
// Strategy: Split static shell from dynamic data

// 1. Page shell: aggressively cached at CDN
// Cache-Control: public, s-maxage=86400, immutable
// → Product name, images, description rarely change

// 2. Stock & price: real-time via WebSocket + Edge Redis
// Cloudflare Worker with Redis (Upstash)
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/stock/")) {
      const productId = url.pathname.split("/").pop();

      // Check Edge Redis (Upstash) — < 5ms
      const stock = await env.REDIS.get(`stock:${productId}`);

      if (stock !== null) {
        return new Response(JSON.stringify({ stock: Number(stock), cached: true }), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store", // Never cache stock
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // Fallback to origin
      return fetch(request);
    }
  },
};

// 3. Client: optimistic UI + real-time WebSocket
function useFlashSaleStock(productId: string) {
  const [stock, setStock] = useState<number | null>(null);

  // Initial fetch via TanStack Query
  const { data } = useQuery({
    queryKey: ["stock", productId],
    queryFn: () => fetch(`/api/stock/${productId}`).then((r) => r.json()),
    refetchInterval: 5_000, // Poll every 5s as fallback
  });

  // Real-time updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket(`wss://ws.example.com/stock/${productId}`);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setStock(update.stock);
    };
    return () => ws.close();
  }, [productId]);

  return stock ?? data?.stock ?? null;
}
```

**Key design decisions**:

1. **Separate static from dynamic**: Shell cached aggressively, stock never cached
2. **Edge Redis for stock**: 50ms latency instead of 200ms to origin
3. **WebSocket for real-time**: Stock updates pushed to client
4. **Graceful degradation**: If WebSocket fails, fall back to polling

🎯 **Interview Signal**: Biết tách static vs dynamic content. Biết dùng edge computing cho low-latency. Biết khi nào KHÔNG cache (real-time stock).

---

## Q&A Summary Table / Bảng Tổng Hợp

| Q#  | Topic                       | Difficulty | Key Concepts                                |
| --- | --------------------------- | ---------- | ------------------------------------------- |
| Q01 | Cache-Control basics        | 🟢         | max-age, private, public, nginx config      |
| Q02 | no-cache vs no-store        | 🟢         | Revalidate vs don't store                   |
| Q03 | ETag & conditional requests | 🟡         | If-None-Match, 304, strong/weak             |
| Q04 | Production SPA caching      | 🟡         | Content hash, per-resource strategy         |
| Q05 | Debug stale content         | 🔴         | SW, CDN, headers, systematic debug          |
| Q06 | stale-while-revalidate      | 🔴         | RFC 5861, instant UX + fresh data           |
| Q07 | Cache API basics            | 🟢         | caches.open, put, match, delete             |
| Q08 | Workbox strategies          | 🟡         | CacheFirst, NetworkFirst, SWR               |
| Q09 | Pre-cache vs runtime        | 🟡         | Manifest, route patterns                    |
| Q10 | Cache versioning            | 🟡         | Cache names, activate cleanup               |
| Q11 | Stale SW content            | 🔴         | skipWaiting, clients.claim, update flow     |
| Q12 | Offline-first design        | 🔴         | App shell, sync queue, Background Sync      |
| Q13 | TanStack Query caching      | 🟢         | staleTime, gcTime, queryKey                 |
| Q14 | QueryKey hierarchy          | 🟡         | Factory pattern, fuzzy invalidation         |
| Q15 | Apollo normalized cache     | 🟡         | InMemoryCache, type policies                |
| Q16 | Optimistic updates          | 🟡         | Snapshot, rollback, cancelQueries           |
| Q17 | Query vs SWR vs Apollo      | 🟡         | Feature comparison, when to use             |
| Q18 | Tag-based invalidation      | 🔴         | Predicate, server-driven                    |
| Q19 | Debug stale data            | 🔴         | DevTools, query state, network              |
| Q20 | CDN caching config          | 🟡         | s-maxage, CDN-Cache-Control                 |
| Q21 | Surrogate-Key purge         | 🟡         | Cache-Tag, targeted invalidation            |
| Q22 | Multi-layer architecture    | 🔴         | Browser→CDN→Gateway→Origin                  |
| Q23 | CDN PoP consistency         | 🔴         | Eventual consistency, soft purge            |
| Q24 | Cache stampede              | 🟡         | Lock, SWR, jitter                           |
| Q25 | Cache monitoring            | 🔴         | Hit rates, timing API, DevTools             |
| Q26 | Cache warming               | 🔴         | Post-deploy, batch warm, CI                 |
| Q27 | Flash sale case study       | 🔴         | Edge Redis, WebSocket, split static/dynamic |

---

## Common Mistakes / Lỗi Thường Gặp

| #   | Mistake                                  | Correct Approach                                                       |
| --- | ---------------------------------------- | ---------------------------------------------------------------------- |
| 1   | `no-cache` = "don't cache"               | `no-cache` = cache but always revalidate. Use `no-store` to not cache. |
| 2   | Long max-age on `index.html`             | HTML must be `no-cache`. Only hashed assets get long max-age.          |
| 3   | Not using content hash in filenames      | Without hash, users get stale JS/CSS even after deploy.                |
| 4   | Cache everything with same TTL           | Different resources need different strategies.                         |
| 5   | Forgetting `skipWaiting()` in SW         | New SW stays in "waiting" state → users stuck on old version.          |
| 6   | Not invalidating after mutations         | Data looks stale because cache wasn't told to refresh.                 |
| 7   | Setting `staleTime: Infinity` everywhere | Query never auto-refetches → permanently stale data.                   |
| 8   | Not handling cache stampede              | Popular cache key expires → origin overwhelmed by concurrent fetches.  |
| 9   | Storing sensitive data in CDN cache      | Use `private` or `no-store` for user-specific data.                    |
| 10  | Not monitoring cache hit rates           | Can't optimize what you don't measure.                                 |

---

## Self-Check / Tự Kiểm Tra

### 🟢 Junior — Bạn có thể giải thích được:

- [ ] Cache-Control directives: max-age, no-cache, no-store, private, public
- [ ] Sự khác biệt giữa no-cache và no-store
- [ ] ETag và conditional request hoạt động thế nào
- [ ] Browser cache hierarchy (Memory → SW → Disk → Network)
- [ ] Cache API cơ bản: open, put, match, delete

### 🟡 Mid — Bạn có thể thiết kế:

- [ ] Caching strategy cho production SPA (per-resource type)
- [ ] Workbox configuration cho Service Worker
- [ ] QueryKey hierarchy với factory pattern
- [ ] Optimistic update với rollback pattern
- [ ] CDN caching với Cache-Tag invalidation

### 🔴 Senior — Bạn có thể giải quyết:

- [ ] Debug stale content qua mọi cache layer
- [ ] Cache stampede prevention (lock + SWR + jitter)
- [ ] Multi-layer cache architecture design
- [ ] Flash sale caching (edge + WebSocket + split static/dynamic)
- [ ] Cache warming strategy post-deployment
- [ ] CDN PoP consistency và eventual consistency trade-offs

### 🧪 Feynman Prompt

> Hãy giải thích cho đồng nghiệp junior: "Tại sao `index.html` phải dùng `no-cache` trong khi `app.abc123.js` dùng `immutable` với max-age 1 năm? Cả hai đều là file tĩnh mà?"

### 📅 Spaced Repetition

- **Day 1**: Đọc Core Concepts + Q01-Q06
- **Day 3**: Ôn lại Q01-Q06, đọc Q07-Q12 (Service Worker)
- **Day 7**: Ôn Q01-Q12, đọc Q13-Q19 (App Cache)
- **Day 14**: Ôn tất cả, đọc Q20-Q27 (CDN + Architecture)
- **Day 30**: Full review, focus on 🔴 Senior questions

---

## References / Tài Liệu Tham Khảo

- [RFC 9111 — HTTP Caching](https://httpwg.org/specs/rfc9111.html)
- [RFC 7232 — Conditional Requests](https://httpwg.org/specs/rfc7232.html)
- [RFC 5861 — HTTP Cache-Control Extensions for Stale Content](https://httpwg.org/specs/rfc5861.html)
- [MDN — HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [web.dev — Caching best practices](https://web.dev/articles/http-cache)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [TanStack Query — Caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching)
- [Apollo Client — Caching](https://www.apollographql.com/docs/react/caching/overview)
- [Cloudflare — Cache-Tag Purge](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-tags/)
