# Frontend Data Layer & Client-Side Storage Design

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## System Design - Chapter 5 / Thiết Kế Hệ Thống - Chương 5

[Back to Table of Contents](../../00-table-of-contents.md) | [← Microservices](./04-microservices.md) | [Microservices Patterns →](./06-microservices-patterns.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Grab Driver App (Southeast Asia):** Tài xế Grab ở vùng ngoại ô thường gặp mạng 2G chập chờn. Khi tài xế nhận đơn và mạng mất, app vẫn phải hiển thị bản đồ, lưu lại thao tác chấp nhận đơn, và đồng bộ khi có mạng lại. Giải pháp: **IndexedDB** lưu bản đồ tiles + pending mutations queue, **Service Worker** intercept network requests, khi reconnect replay queue tuần tự lên server. Conflict resolution: server timestamp wins (LWW), app hiển thị toast "Order updated from server".

**Bài học:** Frontend data layer không chỉ là `useState` hay `fetch()`. Ở production, cần nghĩ đến: dữ liệu nào cần persist, đồng bộ thế nào khi offline, conflict xảy ra thì ai thắng — giống như database design nhưng phía client.

**Shopee Flash Sale:** Hàng triệu user đồng thời xem trang flash sale. Nếu mỗi component gọi API riêng → N×M requests. Giải pháp: **TanStack Query** với shared queryKey, request deduplication, stale-while-revalidate. Cache normalized theo product ID — 1 update lan khắp UI ngay lập tức. Result: từ 50k RPS xuống 12k RPS với cùng DAU.

---

## What & Why / Cái Gì & Tại Sao

**Analogy:** Client-side data layer như hệ thống điện trong tòa nhà: localStorage là pin dự phòng (nhỏ, luôn sẵn), IndexedDB là máy phát điện (lớn, chậm hơn để khởi động), Service Worker Cache là UPS (chặn giữa chừng, đảm bảo continuity). Mỗi thứ có vai trò riêng — dùng sai chỗ gây cháy hoặc lãng phí.

**When data design matters:** Data layer không quan trọng với app đơn giản. Nó critical khi: offline requirement, >10k rows client-side, real-time sync, multi-tab consistency, hoặc GDPR compliance.

---

## Concept Map / Bản Đồ Khái Niệm

```
[Frontend Data Layer]
        │
        ├── Storage APIs
        │       ├── localStorage/sessionStorage ──► strings only, 5-10MB, sync
        │       ├── Cookies ──► sent with every request, HttpOnly option
        │       ├── IndexedDB ──► structured data, async, up to 50% disk
        │       └── Cache API (SW) ──► HTTP response caching
        │
        ├── State Architecture
        │       ├── UI State ──► Zustand, useState (transient, no persist)
        │       ├── Server State ──► TanStack Query, Apollo (cached API data)
        │       └── Persisted State ──► localStorage, IndexedDB (survives reload)
        │
        ├── Offline-First
        │       ├── Service Worker ──► intercept + cache network requests
        │       ├── Sync Queue ──► pending mutations stored in IndexedDB
        │       └── Conflict Resolution ──► LWW / CRDT / manual merge
        │
        ├── Data Fetching Patterns
        │       ├── Pagination ──► offset vs cursor vs keyset
        │       ├── Real-time ──► WebSocket vs SSE vs polling
        │       └── Optimistic Updates ──► local update → server confirm → rollback
        │
        └── Cross-cutting Concerns
                ├── Multi-tab sync ──► BroadcastChannel, SharedWorker
                ├── Data migration ──► versioned schemas
                └── Privacy ──► clear on logout, GDPR
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Client-Side Storage APIs: Comparison & Decision

**🧠 Memory Hook:** "**Cookies travel (every request), localStorage stays (until cleared), IndexedDB thinks (structured queries)**"

**Why does this exist? / Tại sao tồn tại?**

- Why do we need multiple storage APIs? Because different data has different needs: auth tokens need to travel with HTTP requests (cookies); UI preferences need to survive reload (localStorage); offline catalogs need structured queries over 50MB of data (IndexedDB)
- Why can't we just use one? localStorage is synchronous and blocks the main thread for large data; cookies are limited to 4KB and sent on every request (bandwidth waste for MB-sized data); IndexedDB has async overhead that's overkill for a 10-byte theme preference

**Definition:** Browser storage APIs are a spectrum from small/synchronous (localStorage) to large/async/structured (IndexedDB), each optimized for different data shapes, sizes, and access patterns.

**Visual — Storage Comparison Table:**

```
┌─────────────────┬──────────────┬──────────────┬────────────────┬─────────────────┐
│   Property      │ localStorage │sessionStorage│   Cookies      │   IndexedDB     │
├─────────────────┼──────────────┼──────────────┼────────────────┼─────────────────┤
│ Capacity        │  5-10 MB     │   5-10 MB    │    4 KB        │  up to 50% disk │
│ Persistence     │ Until cleared│  Tab session │ Expiry date    │  Until cleared  │
│ Accessible from │ Same origin  │  Same tab    │ Server+Client  │  Same origin    │
│ Sent to server  │     No       │     No       │  Yes (auto)    │      No         │
│ API type        │  Sync        │   Sync       │  Sync          │   Async         │
│ Data type       │  String only │  String only │ String only    │ Any (structured)│
│ XSS accessible  │     Yes      │     Yes      │ Yes (no HttpOnly)│    Yes         │
│ CSRF risk       │     No       │     No       │    Yes         │      No         │
│ Use case        │ Prefs, tokens│ Form draft   │ Auth session   │ Offline data   │
└─────────────────┴──────────────┴──────────────┴────────────────┴─────────────────┘
```

**Decision Tree — Which Storage to Use?**

```
Start: What are you storing?
         │
         ├── Auth token / session?
         │       └── → HttpOnly Cookie (server-set, invisible to JS)
         │
         ├── Small preference (theme, locale, <100KB)?
         │       └── localStorage (sync, simple)
         │
         ├── Data that dies with the tab (unsaved form, wizard step)?
         │       └── sessionStorage
         │
         ├── Large structured data (product catalog, offline map tiles, >1MB)?
         │       └── IndexedDB (async, queryable, transactional)
         │
         └── HTTP response caching for offline?
                 └── Cache API via Service Worker
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                                      | Đúng là                                                 |
| ------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------- |
| Lưu JWT access token trong localStorage    | XSS attack đọc được `localStorage.getItem('token')` trivially    | HttpOnly cookie — JS không đọc được                     |
| Lưu 50MB catalog trong localStorage        | Sync API blocks main thread, 5MB limit causes QuotaExceededError | IndexedDB với chunked writes                            |
| Parse JSON from localStorage in hot path   | JSON.parse() nhiều lần trong render loop → perf hit              | Cache parsed value trong memory, only read storage once |
| Không check `navigator.storage.estimate()` | App bị evict silently khi storage pressure                       | Kiểm tra quota trước khi write large data               |

**🎯 Interview Pattern:**

- **Trigger**: "how do you store X", "difference between localStorage and cookies", "where do you put auth tokens"
- **Opening**: "I start with the security boundary question first — if this data should be inaccessible to JavaScript (like auth tokens), it must be an HttpOnly cookie. If it's UI state that can live in JS context, then I choose by size: under 100KB and synchronous access needed → localStorage; structured data over 1MB or needing queries → IndexedDB..."

---

### 2. IndexedDB: Structured Data, Transactions & Indexes

**🧠 Memory Hook:** "**IndexedDB is SQLite in your browser** — object stores = tables, indexes = B-tree indexes, transactions = ACID guarantees"

**Why does this exist? / Tại sao tồn tại?**

- Why isn't localStorage enough for complex data? localStorage stores everything as strings — you JSON.stringify/parse every read/write, you can't query `products WHERE price < 100`, and it blocks the main thread
- Why does IndexedDB use async API? Because it sits on disk I/O — blocking the main thread while reading 20MB would freeze the UI for hundreds of ms
- Why do transactions matter client-side? Multi-step operations (write order + decrement stock + write history) must be atomic; if the user closes the tab mid-write, you need rollback

**Code Example — IndexedDB CRUD with idb library:**

```typescript
// Using 'idb' wrapper (https://github.com/jakearchibald/idb)
// npm install idb
import { openDB, IDBPDatabase } from "idb";

interface ProductRecord {
  id: string;
  name: string;
  price: number;
  category: string;
  updatedAt: number;
}

// 1. Open / upgrade database
async function initDB(): Promise<IDBPDatabase> {
  return openDB("shopee-offline", 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        // Create object store (like a table)
        const store = db.createObjectStore("products", { keyPath: "id" });
        // Create indexes for querying
        store.createIndex("by-category", "category");
        store.createIndex("by-price", "price");
        store.createIndex("by-updatedAt", "updatedAt");
      }
      if (oldVersion < 2) {
        // Migration: add new index in v2
        const store = db.transaction("products").objectStore("products");
        store.createIndex("by-category-price", ["category", "price"]);
      }
    },
  });
}

// 2. Write with transaction
async function saveProducts(products: ProductRecord[]): Promise<void> {
  const db = await initDB();
  // Batch write in single transaction (atomic)
  const tx = db.transaction("products", "readwrite");
  await Promise.all([
    ...products.map((p) => tx.store.put(p)),
    tx.done, // wait for transaction commit
  ]);
}

// 3. Query by index
async function getProductsByCategory(category: string): Promise<ProductRecord[]> {
  const db = await initDB();
  // Uses the index — O(log n) not O(n) full scan
  return db.getAllFromIndex("products", "by-category", category);
}

// 4. Range query
async function getProductsUnderPrice(maxPrice: number): Promise<ProductRecord[]> {
  const db = await initDB();
  const range = IDBKeyRange.upperBound(maxPrice);
  return db.getAllFromIndex("products", "by-price", range);
}

// 5. Check storage quota before large write
async function checkAndSave(products: ProductRecord[]): Promise<void> {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const available = quota - usage;
    const estimatedSize = JSON.stringify(products).length;

    if (estimatedSize > available * 0.8) {
      // Evict old entries before writing
      await evictStaleProducts();
    }
  }
  await saveProducts(products);
}

async function evictStaleProducts(): Promise<void> {
  const db = await initDB();
  const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
  const range = IDBKeyRange.upperBound(threshold);
  const tx = db.transaction("products", "readwrite");
  let cursor = await tx.store.index("by-updatedAt").openCursor(range);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}
```

**💡 Interview Signal:**

- ✅ Strong: Mentions transactions for atomic writes, indexes for query performance, quota management, and versioned upgrades
- ❌ Weak: "IndexedDB is just localStorage but bigger" — misses async nature, query capability, and transaction model

---

### 3. Security: XSS, HttpOnly Cookies & Storage Boundaries

**🧠 Memory Hook:** "**If JavaScript can read it, XSS can steal it.** The only storage XSS cannot reach is HttpOnly cookies."

**Why does this exist? / Tại sao tồn tại?**

- Why do people store auth tokens in localStorage? It's easy — `localStorage.setItem('token', jwt)`. But XSS on any page in your origin can call this trivially
- Why are HttpOnly cookies secure against XSS? The browser refuses to expose them via `document.cookie` — only the HTTP stack has access. XSS scripts cannot read them
- Why not just prevent XSS and then localStorage is fine? Defense in depth — you cannot guarantee zero XSS in a complex app with third-party scripts. Minimize damage by using HttpOnly cookies for tokens even if XSS somehow occurs

**Visual — XSS Attack Surface:**

```
XSS Attack (malicious script injected into your page)
        │
        ├── localStorage.getItem('token')  → ✅ CAN steal — token is gone
        ├── sessionStorage.getItem('...')  → ✅ CAN steal
        ├── document.cookie               → ✅ CAN steal non-HttpOnly cookies
        └── document.cookie (HttpOnly)    → ❌ CANNOT read — browser blocks
                                                   ← only HTTP stack can access
```

**Code Example — Secure Token Handling Pattern:**

```typescript
// ❌ BAD: Token visible to JavaScript (and XSS)
function loginBad(token: string) {
  localStorage.setItem("access_token", token);
  // Any XSS: localStorage.getItem('access_token') → stolen
}

// ✅ GOOD: Token set by server as HttpOnly cookie
// Backend sets: Set-Cookie: access_token=<jwt>; HttpOnly; Secure; SameSite=Strict
// Frontend just calls the API — token automatically sent via cookie
async function loginGood(credentials: { email: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include", // include cookies in request
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  // Server sets HttpOnly cookie — JS never touches the token
  return res.json();
}

// For SPAs that MUST store tokens in JS (e.g. cross-origin API without cookie support)
// Use memory-only storage as mitigation
class SecureTokenStore {
  // Stored in closure — not accessible from global scope
  // Still vulnerable to XSS but harder to exfiltrate (no persistence)
  private token: string | null = null;

  set(token: string) {
    this.token = token;
  }
  get(): string | null {
    return this.token;
  }
  clear() {
    this.token = null;
  }
}

// CSRF protection when using cookies
// Backend validates: SameSite=Strict prevents cross-site requests from including cookie
// Double-submit cookie pattern for SameSite=None scenarios
async function apiRequest(path: string, options: RequestInit = {}) {
  const csrfToken = document.cookie
    .split("; ")
    .find((c) => c.startsWith("csrf-token="))
    ?.split("=")[1];

  return fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "X-CSRF-Token": csrfToken ?? "",
    },
  });
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                   | Tại sao sai                                                                     | Đúng là                                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| "We use Content-Security-Policy, so localStorage is safe" | CSP giảm XSS surface nhưng không eliminate nó; defense in depth cần cả HttpOnly | HttpOnly cookie + CSP = defense in depth                                         |
| `SameSite=None` without understanding CSRF                | `None` cho phép cross-site requests gửi cookie → CSRF risk                      | `SameSite=Strict` default; `Lax` cho OAuth; `None` chỉ khi bắt buộc + CSRF token |
| Lưu PII (email, phone) trong localStorage lâu dài         | GDPR: data minimization — không persist dữ liệu không cần thiết                 | Chỉ lưu non-sensitive identifiers; clear on logout                               |

**🎯 Interview Pattern:**

- **Trigger**: "where do you store auth tokens", "security of client storage", "XSS implications"
- **Opening**: "The key question is: what's the XSS attack surface? HttpOnly cookies are the only storage JavaScript cannot access — so for auth tokens, the answer is always HttpOnly cookies set by the server. localStorage is convenient but any XSS vulnerability — including in a third-party analytics script — can exfiltrate it. For data that must be in JavaScript, in-memory closure variables are harder to steal than localStorage because they don't persist across tabs..."

---

### 4. UI State vs Server State vs Persisted State

**🧠 Memory Hook:** "**3 buckets: UI State lives and dies in RAM; Server State is a cache of what the API knows; Persisted State survives browser restarts.**"

**Why does this exist? / Tại sao tồn tại?**

- Why separate these categories? Mixing them causes common bugs: storing server data in Redux with manual cache invalidation → stale data bugs; storing UI state in cookies → unnecessary server round-trips
- Why did "server state" become its own concept? Server data has unique properties: it lives on another machine, multiple clients can change it, it gets stale, it needs background refresh — none of which apply to local UI state like "is this dropdown open?"
- Why does this separation matter for libraries? React Query was built specifically for server state (fetching, caching, synchronizing). Zustand/Redux are built for client UI state (ephemeral, client-controlled). Mixing them in one Redux store = fighting against the tool's design

**Visual — State Separation:**

```
┌─────────────────────────────────────────────────────────────┐
│                      State Categories                        │
├───────────────────┬─────────────────────┬───────────────────┤
│    UI State        │   Server State       │  Persisted State  │
│   (ephemeral)      │   (cache)            │   (durable)       │
├───────────────────┼─────────────────────┼───────────────────┤
│ • Modal open/close │ • Product listings   │ • Auth session    │
│ • Form field value │ • User profile       │ • User preferences│
│ • Tab selection    │ • Order history      │ • Cart (anonymous)│
│ • Sidebar expanded │ • Notifications      │ • Draft content   │
├───────────────────┼─────────────────────┼───────────────────┤
│ Tool: useState,    │ Tool: TanStack Query,│ Tool: localStorage│
│ Zustand, Jotai     │ Apollo, SWR          │ IndexedDB, Cookie │
│                    │                      │ + sync to server  │
├───────────────────┼─────────────────────┼───────────────────┤
│ Lifetime: Tab      │ Lifetime: staleTime  │ Lifetime: explicit│
│ Source: user input │ Source: API response │ Source: user intent│
└───────────────────┴─────────────────────┴───────────────────┘
```

**Code Example — Correct State Separation:**

```typescript
// ✅ UI State → useState / Zustand
function ProductModal() {
  const [isOpen, setIsOpen] = useState(false); // ephemeral UI state
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // ...
}

// ✅ Server State → TanStack Query
function useProducts(category: string) {
  return useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProducts(category),
    staleTime: 5 * 60 * 1000, // 5 min: don't refetch if data < 5 min old
    gcTime: 30 * 60 * 1000, // 30 min: keep in cache for 30 min
  });
}

// ✅ Persisted State → zustand + persist middleware
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not derived state
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// ❌ BAD: Server state in Redux with manual sync
// const productSlice = createSlice({
//   name: 'products',
//   reducers: {
//     setProducts: (state, action) => { state.list = action.payload },
//     invalidateProducts: (state) => { state.stale = true }
//   }
// })
// This requires manual cache invalidation, background refetch, error states...
// TanStack Query handles ALL of this out of the box
```

**💡 Interview Signal:**

- ✅ Strong: Names all 3 categories, maps them to libraries, explains WHY they need different tools (stale data + background sync is a server state concern, not a UI state concern)
- ❌ Weak: "I put everything in Redux" — hasn't thought about the fundamentally different nature of server data vs local UI state

---

### 5. TanStack Query: QueryKey Hierarchy, Invalidation & Prefetching

**🧠 Memory Hook:** "**queryKey is like a file path** — `['products', 'category', 'electronics']` — invalidating `['products']` nukes everything under it"

**Why does this exist? / Tại sao tồn tại?**

- Why does queryKey need a hierarchy? Because when you update a product, you want to invalidate all product-related queries (`['products', '*']`) without manually tracking which specific queries are cached
- Why staleTime vs gcTime? staleTime = "when does this data become potentially stale?" (triggers background refetch on next access). gcTime = "when do we garbage-collect from memory?" (remove if unused). Data can be stale but still in memory
- Why does request deduplication matter? On Shopee, the same product is shown in Recommended, Recent, and Search simultaneously. Without dedup, 3 identical API calls fire. TanStack Query: only 1 request, all 3 components share the result

**Code Example — Advanced TanStack Query Patterns:**

```typescript
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

// 1. Hierarchical queryKey design
const queryKeys = {
  products: () => ["products"] as const,
  productList: (filters: ProductFilters) => ["products", "list", filters] as const,
  productDetail: (id: string) => ["products", "detail", id] as const,
  productReviews: (id: string) => ["products", "detail", id, "reviews"] as const,
};

// 2. Invalidation patterns
const queryClient = useQueryClient();

// Invalidate ALL product queries
queryClient.invalidateQueries({ queryKey: queryKeys.products() });

// Invalidate only the detail for one product
queryClient.invalidateQueries({ queryKey: queryKeys.productDetail("prod-123") });

// 3. Optimistic update with rollback
function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (update: ProductUpdate) => apiUpdateProduct(update),

    onMutate: async (update) => {
      // Cancel in-flight queries (prevent race condition)
      await queryClient.cancelQueries({ queryKey: queryKeys.productDetail(update.id) });

      // Snapshot the previous value
      const previousProduct = queryClient.getQueryData(
        queryKeys.productDetail(update.id)
      );

      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.productDetail(update.id), (old: Product) => ({
        ...old,
        ...update,
      }));

      // Return context for rollback
      return { previousProduct };
    },

    onError: (err, update, context) => {
      // Rollback on error
      if (context?.previousProduct) {
        queryClient.setQueryData(
          queryKeys.productDetail(update.id),
          context.previousProduct
        );
      }
    },

    onSettled: (_, __, update) => {
      // Always refetch after mutation to sync with server
      queryClient.invalidateQueries({ queryKey: queryKeys.productDetail(update.id) });
    },
  });
}

// 4. Prefetching for instant navigation
function useProductListPrefetch() {
  const queryClient = useQueryClient();

  return (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.productDetail(productId),
      queryFn: () => fetchProductDetail(productId),
      staleTime: 10 * 60 * 1000,
    });
  };
}

// Usage: prefetch on hover
function ProductCard({ product }: { product: Product }) {
  const prefetch = useProductListPrefetch();

  return (
    <div onMouseEnter={() => prefetch(product.id)}>
      {/* When user clicks, detail page loads instantly from cache */}
    </div>
  );
}

// 5. Infinite query for feed pagination
function useProductFeed(category: string) {
  return useInfiniteQuery({
    queryKey: ["products", "feed", category],
    queryFn: ({ pageParam }) =>
      fetchProducts({ category, cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                              | Tại sao sai                                                    | Đúng là                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- |
| `queryKey: ['products']` (no params)                 | Queries với filters khác nhau share cache → wrong data shown   | Include all relevant params: `['products', { category, page, sort }]` |
| `staleTime: 0` everywhere                            | Mỗi mount = network request → N×M requests trên trang phức tạp | Tune staleTime theo data freshness needs                              |
| Không dùng `onMutate` snapshot cho optimistic update | Nếu server reject, UI đã update nhưng không biết rollback gì   | Luôn snapshot trước, rollback `context.previous` trong `onError`      |

---

### 6. Apollo Client: InMemoryCache, Type Policies & cache.modify

**🧠 Memory Hook:** "**Apollo cache is a normalized graph** — `Product:123` exists once, referenced from everywhere. Update it once → all queries see the change."

**Why does this exist? / Tại sao tồn tại?**

- Why normalize the cache? Without normalization, if Product 123 appears in 10 queries, you have 10 copies that can get out of sync. Normalize → 1 canonical copy, all references point to it
- Why do type policies exist? Sometimes Apollo can't auto-normalize (no `id` field, or pagination merges). Type policies let you define custom merge behavior, key fields, and field-level transformations
- Why `cache.modify` instead of refetch? `cache.modify` is instant (no network), surgical (only changes what you specify), and doesn't trigger loading states — perfect for optimistic updates

**Code Example — Apollo Cache Patterns:**

```typescript
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// 1. InMemoryCache with type policies
const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        keyFields: ["id"], // normalize by id (default, but explicit)
        fields: {
          // Field-level policy: format price on read
          price: {
            read(price: number) {
              return price / 100; // stored in cents, read as dollars
            },
          },
        },
      },
      Query: {
        fields: {
          // Cursor-based pagination merge
          products: {
            keyArgs: ["category"], // separate cache entries per category
            merge(existing = { items: [], nextCursor: null }, incoming) {
              return {
                ...incoming,
                items: [...(existing.items ?? []), ...incoming.items],
              };
            },
          },
        },
      },
    },
  }),
});

// 2. Optimistic update with cache.modify
function useAddToCart() {
  const [addToCart] = useMutation(ADD_TO_CART_MUTATION, {
    // Optimistic response: immediate UI update
    optimisticResponse: ({ productId, quantity }) => ({
      __typename: "Mutation",
      addToCart: {
        __typename: "CartItem",
        id: `temp-${Date.now()}`,
        productId,
        quantity,
      },
    }),
    // Update cache directly (no refetch needed)
    update(cache, { data }) {
      cache.modify({
        id: cache.identify({ __typename: "Cart", id: "current-user-cart" }),
        fields: {
          items(existingItems = []) {
            const newItemRef = cache.writeFragment({
              data: data!.addToCart,
              fragment: gql`
                fragment NewCartItem on CartItem {
                  id
                  productId
                  quantity
                }
              `,
            });
            return [...existingItems, newItemRef];
          },
          totalCount(count) {
            return count + 1;
          },
        },
      });
    },
  });

  return addToCart;
}

// 3. Evicting stale cache entries
function evictProduct(productId: string) {
  client.cache.evict({
    id: client.cache.identify({ __typename: "Product", id: productId }),
  });
  client.cache.gc(); // garbage collect unreachable objects
}
```

**💡 Interview Signal:**

- ✅ Strong: Explains normalization as the key benefit, knows `keyArgs` for pagination, uses `cache.modify` for surgical updates
- ❌ Weak: "Apollo has a cache but I just call `refetchQueries` after mutations" — works but wasteful; shows doesn't understand cache model

---

### 7. Offline-First Architecture: Service Worker + IndexedDB

**🧠 Memory Hook:** "**Network Optional** — Service Worker is the receptionist that intercepts all requests; if the server is unavailable, it serves from its own filing cabinet (Cache API + IndexedDB)."

**Why does this exist? / Tại sao tồn tại?**

- Why can't users just see an error page when offline? In SE Asia, intermittent connectivity is normal — Grab drivers, Shopee shoppers in provinces. "Offline = unusable" loses real users and revenue
- Why does offline-first require architecture changes? You can't retrofit offline as an afterthought. Every mutation needs a queue, every read needs a cache fallback, every sync needs conflict resolution — these must be designed in from the start
- Why is IndexedDB central? It's the only durable, large-capacity storage accessible from both the main thread and Service Worker, making it the sync queue and data store for offline-first apps

**Visual — Offline-First Architecture:**

```
User Action (e.g. "Accept Order")
        │
        ▼
  App (Main Thread)
        │
        ├── Write to IndexedDB sync queue
        │       { id: uuid, action: 'ACCEPT_ORDER', payload: {...}, status: 'pending' }
        │
        ├── Update UI optimistically (Accepted!)
        │
        └── postMessage to Service Worker: "new pending mutation"

Service Worker
        │
        ├── Online? → POST /api/orders/accept → 200 OK
        │               └── Remove from queue
        │               └── postMessage to client: sync done
        │
        └── Offline? → Register sync event (Background Sync API)
                        └── When network returns → replay queue
                        └── On 409 Conflict → conflict resolution logic
```

**Code Example — Sync Queue Pattern:**

```typescript
// sync-queue.ts — runs in both main thread and SW
import { openDB } from "idb";

interface SyncItem {
  id: string;
  endpoint: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  body: unknown;
  timestamp: number;
  retryCount: number;
  status: "pending" | "syncing" | "failed";
}

const SYNC_STORE = "sync-queue";

async function getSyncDB() {
  return openDB("offline-sync", 1, {
    upgrade(db) {
      db.createObjectStore(SYNC_STORE, { keyPath: "id" });
    },
  });
}

// Queue a mutation when offline
export async function queueMutation(
  endpoint: string,
  method: SyncItem["method"],
  body: unknown,
): Promise<string> {
  const db = await getSyncDB();
  const item: SyncItem = {
    id: crypto.randomUUID(),
    endpoint,
    method,
    body,
    timestamp: Date.now(),
    retryCount: 0,
    status: "pending",
  };
  await db.put(SYNC_STORE, item);

  // Try to register background sync
  if ("serviceWorker" in navigator && "sync" in (await navigator.serviceWorker.ready)) {
    const sw = await navigator.serviceWorker.ready;
    await (sw.sync as any).register("sync-mutations");
  }

  return item.id;
}

// Replay queue (called by SW on sync event)
export async function replayQueue(): Promise<void> {
  const db = await getSyncDB();
  const pending = await db.getAll(SYNC_STORE);

  for (const item of pending.filter((i) => i.status === "pending")) {
    try {
      await db.put(SYNC_STORE, { ...item, status: "syncing" });

      const res = await fetch(item.endpoint, {
        method: item.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.body),
        credentials: "include",
      });

      if (res.ok) {
        await db.delete(SYNC_STORE, item.id);
      } else if (res.status === 409) {
        // Conflict — needs manual resolution
        const serverData = await res.json();
        await db.put(SYNC_STORE, {
          ...item,
          status: "failed",
          conflictData: serverData,
        });
      } else if (res.status >= 500 && item.retryCount < 3) {
        // Transient server error — retry with backoff
        await db.put(SYNC_STORE, {
          ...item,
          status: "pending",
          retryCount: item.retryCount + 1,
        });
      }
    } catch {
      // Network still unavailable — leave as pending
      await db.put(SYNC_STORE, { ...item, status: "pending" });
    }
  }
}
```

```typescript
// service-worker.ts
declare const self: ServiceWorkerGlobalScope;

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-mutations") {
    event.waitUntil(replayQueue());
  }
});

// Intercept fetch — cache-first for GET, queue for mutations
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === "GET" && url.pathname.startsWith("/api/")) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(event.request.method)) {
    event.respondWith(handleMutation(event.request));
    return;
  }
});

async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cache = await caches.open("api-cache-v1");
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then((res) => {
    cache.put(request, res.clone());
    return res;
  });

  return cached ?? networkPromise;
}

async function handleMutation(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    // Offline — queue and return optimistic 202
    const body = await request.clone().json();
    await queueMutation(request.url, request.method as SyncItem["method"], body);
    return new Response(JSON.stringify({ queued: true }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

**💡 Interview Signal:**

- ✅ Strong: Designs queue-first (not retry-first), handles 409 conflicts separately from 5xx errors, mentions Background Sync API, explains the SW as the interceptor
- ❌ Weak: "Just add a try-catch and retry fetch" — no queue, no persistence across restarts, no conflict handling

---

### 8. Conflict Resolution: LWW, CRDT & Optimistic Rollback

**🧠 Memory Hook:** "**3 conflict strategies: Let the server win (LWW), Let math win (CRDT), Let the user win (manual merge)**"

**Why does this exist? / Tại sao tồn tại?**

- Why does conflict happen? Two clients edit the same data offline → both sync → server gets two different states for the same entity. Someone wins, someone loses data
- Why not always Last-Write-Wins? For a `counter` (likes, view counts), LWW loses increments. If user A and B both increment from 5 → both write 6 → LWW gives 6 instead of 7
- Why are CRDTs relevant for frontend? Collaborative features (shared cart, real-time doc editing) need eventual consistency without server coordination for every op. CRDT operations are commutative and associative — merge order doesn't matter

**Visual — Conflict Scenarios:**

```
Scenario 1: LWW (Last-Write-Wins)
User A: updates profile name at t=10 → "Alice"
User B: updates profile name at t=12 → "Alicia"
Server: sees t=12 last → "Alicia" wins ✅ (both agree this is acceptable)

Scenario 2: LWW fails for counters
User A: likes post (count=5 → 6), offline, syncs at t=10
User B: likes post (count=5 → 6), offline, syncs at t=12
Server with LWW: t=12 wins → count=6 ❌ (should be 7)

Scenario 3: G-Counter CRDT (Grow-only counter)
User A state: { a: 2, b: 0 }  (A incremented twice)
User B state: { a: 0, b: 3 }  (B incremented three times)
Merge = max per key: { a: 2, b: 3 } → value = sum = 5 ✅ (correct!)

Scenario 4: LWW-Register (simple CRDT for non-counter fields)
Each write carries a Lamport timestamp
Merge = keep the entry with highest timestamp
Result: same as LWW but with logical clocks instead of wall clock
```

**Code Example — Optimistic Update with Rollback:**

```typescript
// React component with full optimistic update + rollback cycle
function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useMutation({
    mutationFn: (liked: boolean) =>
      fetch(`/api/posts/${postId}/like`, {
        method: liked ? "POST" : "DELETE",
        credentials: "include",
      }).then((r) => {
        if (!r.ok) throw new Error("Server rejected");
        return r.json();
      }),

    onMutate: async (liked: boolean) => {
      // 1. Cancel outgoing refetches (race condition prevention)
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // 2. Snapshot current state
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      // 3. Apply optimistic update instantly
      queryClient.setQueryData<Post>(["post", postId], (old) => ({
        ...old!,
        liked,
        likeCount: liked ? (old!.likeCount ?? 0) + 1 : (old!.likeCount ?? 1) - 1,
      }));

      // Return snapshot for rollback
      return { previousPost };
    },

    onError: (_err, _liked, context) => {
      // 4. Rollback on server rejection
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      toast.error("Failed to update like. Please try again.");
    },

    onSettled: () => {
      // 5. Always sync with server after settle (confirms or corrects optimistic state)
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  // ...
}

// G-Counter CRDT (Grow-only counter — for like counts that can't decrease)
interface GCounter {
  [clientId: string]: number;
}

function gcIncrement(counter: GCounter, clientId: string): GCounter {
  return { ...counter, [clientId]: (counter[clientId] ?? 0) + 1 };
}

function gcMerge(a: GCounter, b: GCounter): GCounter {
  const result: GCounter = { ...a };
  for (const [key, val] of Object.entries(b)) {
    result[key] = Math.max(result[key] ?? 0, val);
  }
  return result;
}

function gcValue(counter: GCounter): number {
  return Object.values(counter).reduce((sum, v) => sum + v, 0);
}

// Usage:
// Client A: gcIncrement({}, 'client-a') → { 'client-a': 1 }
// Client B: gcIncrement({}, 'client-b') → { 'client-b': 1 }
// Merge:    gcMerge({ 'client-a': 1 }, { 'client-b': 1 }) → { 'client-a': 1, 'client-b': 1 }
// Value:    gcValue({ 'client-a': 1, 'client-b': 1 }) → 2 ✅
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                | Tại sao sai                                                          | Đúng là                                                                         |
| ------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Không implement rollback trong optimistic update       | Server reject → UI hiển thị sai state mãi                            | Always implement `onError` với rollback từ snapshot `context`                   |
| Dùng LWW cho tất cả conflict                           | Counters, sets, và ordering-sensitive data bị data loss              | Chọn conflict strategy theo data type: LWW for scalar, CRDT for commutative ops |
| Không cancel in-flight queries trước optimistic update | Race: refetch response arrives sau optimistic update → overwrites nó | `queryClient.cancelQueries` trong `onMutate`                                    |

---

### 9. Normalized vs Denormalized Client Cache

**🧠 Memory Hook:** "**Normalize = one source of truth. Denormalize = fast reads but stale copies.**"

**Why does this exist? / Tại sao tồn tại?**

- Why normalize on the client? Same product appears in Search, Related, and Cart. Without normalization, you update Search but Cart still shows old price
- Why ever denormalize? Join queries on client are expensive. If you only ever display a list (no cross-component sync needed), flat response is faster to render than following references
- Why does Apollo normalize automatically? GraphQL has `__typename` + `id` on every object, giving Apollo the key to build a normalized entity store automatically

**Visual — Normalize vs Denormalize:**

```
API Response (denormalized):
  [
    { id: "order-1", product: { id: "p-1", name: "iPhone", price: 999 } },
    { id: "order-2", product: { id: "p-1", name: "iPhone", price: 999 } }
  ]

Denormalized store:
  orders: {
    "order-1": { product: { name: "iPhone", price: 999 } },  ← copy 1
    "order-2": { product: { name: "iPhone", price: 999 } }   ← copy 2
  }
  Update iPhone price: must find and update BOTH copies 😱

Normalized store (like Apollo InMemoryCache):
  entities: {
    "Product:p-1": { name: "iPhone", price: 999 }   ← ONE canonical copy
  }
  orders: {
    "order-1": { product: "Product:p-1" },  ← reference
    "order-2": { product: "Product:p-1" }   ← reference
  }
  Update iPhone price: update ONE entry → both orders see new price ✅
```

**Code Example — Manual Normalization with Zustand:**

```typescript
import { create } from "zustand";

interface NormalizedStore {
  products: Record<string, Product>;
  orders: Record<string, Order & { productId: string }>;
  mergeProducts: (products: Product[]) => void;
  updateProduct: (id: string, update: Partial<Product>) => void;
}

const useNormalizedStore = create<NormalizedStore>((set) => ({
  products: {},
  orders: {},

  mergeProducts: (products) =>
    set((state) => ({
      products: {
        ...state.products,
        ...Object.fromEntries(products.map((p) => [p.id, p])),
      },
    })),

  updateProduct: (id, update) =>
    set((state) => ({
      products: {
        ...state.products,
        [id]: { ...state.products[id], ...update },
      },
    })),
}));

// Selector: denormalize on read (cheap, always fresh)
function useOrder(orderId: string) {
  const order = useNormalizedStore((s) => s.orders[orderId]);
  const product = useNormalizedStore((s) => (order ? s.products[order.productId] : null));
  return order && product ? { ...order, product } : null;
}
```

**💡 Interview Signal:**

- ✅ Strong: Explains the "one source of truth" benefit, knows Apollo does this automatically, understands when denormalization is acceptable (read-only lists)
- ❌ Weak: "I normalize the API response on the server side" — misses that client-side normalization solves cross-component sync, not just data shape

---

### 10. Pagination: Offset vs Cursor vs Keyset

**🧠 Memory Hook:** "**Offset for admin tables, Cursor for infinite feeds, Keyset for high-volume sorted data**"

**Why does this exist? / Tại sao tồn tại?**

- Why is offset pagination problematic at scale? `OFFSET 10000` on a 10M row table = database scans 10,000 rows to discard them. Plus: new items inserted while user is paginating → items shift → duplicates or missed items on page 2
- Why cursor pagination? Server returns an opaque cursor (encoded row position). Next page: "give me records after cursor X". Database uses index seek, not scan. Stable because cursor points to a specific row, not a position
- Why keyset (seek method)? Cursor is often just encoded `WHERE id > last_id`. Keyset makes this explicit and transparent: client sends `?after_id=123&after_date=2024-01-01` for multi-column ordering

**Visual — Pagination Comparison:**

```
Offset Pagination:
  GET /products?page=3&limit=20 → OFFSET 40 LIMIT 20
  Problem: Item inserted at position 30 → "page 3" now shows item you already saw on page 2
  ↓ OK for: Admin tables where user controls page explicitly

Cursor Pagination:
  GET /products?cursor=eyJpZCI6MTIzfQ%3D%3D → WHERE id > 123 LIMIT 20
  No skips. No duplicates. Opaque cursor.
  ↓ OK for: Infinite scroll feeds (Twitter, Shopee homepage)

Keyset Pagination:
  GET /products?after_id=123&after_price=99.99&limit=20
  → WHERE (price > 99.99) OR (price = 99.99 AND id > 123) LIMIT 20
  Explicit, multi-column, uses composite index
  ↓ OK for: Sorted product listings with composite sort keys
```

**Code Example — Cursor-Based Infinite Scroll:**

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect } from "react";

interface ProductPage {
  items: Product[];
  nextCursor: string | null;
  hasMore: boolean;
}

function useInfiniteProducts(category: string) {
  return useInfiniteQuery<ProductPage>({
    queryKey: ["products", "infinite", category],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ category, limit: "20" });
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/products?${params}`);
      return res.json();
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });
}

// Virtual scroll: only render visible rows — handles 100k items
function InfiniteProductList({ category }: { category: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts(category);

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // estimated row height px
    overscan: 5, // render 5 extra rows above/below viewport
  });

  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;
    if (lastItem.index >= allItems.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualizer.getVirtualItems(), hasNextPage, isFetchingNextPage]);

  return (
    <div ref={parentRef} style={{ height: "600px", overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = allItems[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: virtualRow.start,
                height: virtualRow.size,
              }}
            >
              {item ? <ProductCard product={item} /> : <Spinner />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**💡 Interview Signal:**

- ✅ Strong: Explains why offset breaks on live data (row shifting), knows cursor = index seek not scan, adds virtual scroll for large lists
- ❌ Weak: "Use cursor pagination because it's better" — can't explain why or when offset is acceptable

---

### 11. Real-Time: WebSocket vs Server-Sent Events vs Polling

**🧠 Memory Hook:** "**Polling = pull every N seconds. SSE = server pushes one-way. WebSocket = full duplex channel. Choose by who talks.**"

**Why does this exist? / Tại sao tồn tại?**

- Why not always use WebSocket? WS requires persistent TCP connection on both ends. For 1M concurrent users, that's 1M open connections on your servers. SSE uses HTTP/2 multiplexing and auto-reconnects
- Why does SSE exist if WebSocket can do everything? SSE is simpler (regular HTTP, passes through proxies and CDNs without special config), auto-reconnects with `Last-Event-ID`, and is enough for read-only streams like notifications and live feeds
- Why still use polling in 2024? Some corporate networks block WebSocket and SSE. Some backend teams can't support persistent connections. Polling with `staleTime: 0` is reliable even if inefficient

**Visual — Decision Matrix:**

```
                   Client → Server?    Server → Client?   Connection
Polling            YES (request)       YES (response)     New per poll
Server-Sent Events No                  YES (stream)       Persistent (HTTP)
WebSocket          YES (any time)      YES (any time)     Persistent (WS)

Use Polling when:
  - Simple, low-frequency updates (every 30s+)
  - WebSocket/SSE blocked by network
  - Backend team can't support persistent connections

Use SSE when:
  - One-way push (notifications, live scores, activity feed)
  - Browser reconnect required
  - HTTP/2 already in use (no new infra)

Use WebSocket when:
  - Bidirectional (chat, multiplayer, collaborative editing)
  - Low latency required (<100ms round-trip)
  - Custom binary protocol needed
```

**Code Example — SSE with cache sync:**

```typescript
// Server-Sent Events: live order status updates
function useOrderStatusStream(orderId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const es = new EventSource(`/api/orders/${orderId}/stream`, {
      withCredentials: true,
    });

    es.addEventListener("status-update", (event) => {
      const update = JSON.parse(event.data) as OrderStatusUpdate;

      // Sync SSE event into React Query cache
      queryClient.setQueryData<Order>(["order", orderId], (old) => ({
        ...old!,
        status: update.status,
        updatedAt: update.timestamp,
      }));
    });

    es.addEventListener("error", () => {
      // EventSource auto-reconnects after error
      console.warn("SSE disconnected, will auto-reconnect");
    });

    return () => es.close();
  }, [orderId, queryClient]);
}

// WebSocket: chat with queue flush on reconnect
class ChatWebSocket {
  private ws: WebSocket | null = null;
  private pendingMessages: ChatMessage[] = [];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(roomId: string, onMessage: (msg: ChatMessage) => void) {
    this.ws = new WebSocket(`wss://chat.example.com/rooms/${roomId}`);

    this.ws.onopen = () => {
      // Flush pending messages from offline period
      this.pendingMessages.forEach((msg) => this.send(msg));
      this.pendingMessages = [];
    };

    this.ws.onmessage = (event) => onMessage(JSON.parse(event.data));

    this.ws.onclose = () => {
      // Exponential backoff reconnect
      this.reconnectTimer = setTimeout(
        () => this.connect(roomId, onMessage),
        Math.min(1000 * 2 ** this.reconnectCount++, 30_000),
      );
    };
  }

  private reconnectCount = 0;

  send(message: ChatMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.pendingMessages.push(message);
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                   | Đúng là                                        |
| ------------------------------------------ | --------------------------------------------- | ---------------------------------------------- |
| WebSocket for live product price display   | One-way push đơn giản hơn, SSE đủ dùng        | SSE for server→client only pushes              |
| Short polling (every 1s) for notifications | 1s × 1M users = 1M req/s chỉ từ polling       | Long polling (30s+) hoặc SSE/WS                |
| Không handle WS reconnect                  | Khi mạng tạm ngắt → app freeze, miss messages | Exponential backoff reconnect + message replay |
| SSE không có `Last-Event-ID`               | Missed events khi reconnect                   | Always set `id:` field in SSE events           |

---

### 12. Multi-Tab Synchronization: BroadcastChannel & SharedWorker

**🧠 Memory Hook:** "**BroadcastChannel = one-way radio broadcast across tabs. SharedWorker = shared background worker that all tabs connect to.**"

**Why does this exist? / Tại sao tồn tại?**

- Why is multi-tab sync a problem? User has Shopee cart open in 3 tabs. Adds item in tab 1 → tabs 2 and 3 show outdated cart count
- Why not just use storage events? `window.addEventListener('storage', ...)` fires in OTHER tabs when localStorage changes — it works but is limited to string key-value changes with no structured message protocol
- Why SharedWorker over BroadcastChannel? SharedWorker maintains state across tabs (e.g., single WebSocket connection shared by all tabs instead of each tab creating its own WS). BroadcastChannel is simpler (fire-and-forget messages) but stateless

**Code Example — BroadcastChannel for Cart Sync:**

```typescript
// cart-sync.ts
const CART_CHANNEL = "shopee-cart";

export function createCartSync(onUpdate: (event: CartSyncEvent) => void): () => void {
  const channel = new BroadcastChannel(CART_CHANNEL);

  channel.onmessage = (event: MessageEvent<CartSyncEvent>) => {
    onUpdate(event.data);
  };

  return () => channel.close();
}

export function broadcastCartUpdate(event: CartSyncEvent) {
  const channel = new BroadcastChannel(CART_CHANNEL);
  channel.postMessage(event);
  channel.close(); // fire-and-forget
}

type CartSyncEvent =
  | { type: "ITEM_ADDED"; item: CartItem }
  | { type: "ITEM_REMOVED"; itemId: string }
  | { type: "CART_CLEARED" };

// Usage in React
function useCartWithMultiTabSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cleanup = createCartSync((event) => {
      // Another tab changed the cart — sync this tab
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    });
    return cleanup;
  }, [queryClient]);

  const { mutate: addToCart } = useMutation({
    mutationFn: addToCartAPI,
    onSuccess: (_, item) => {
      // Notify other tabs
      broadcastCartUpdate({ type: "ITEM_ADDED", item });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return { addToCart };
}
```

**Code Example — SharedWorker for Single WebSocket:**

```typescript
// shared-worker.ts (runs once, shared across all tabs)
const connections: MessagePort[] = [];
let ws: WebSocket | null = null;

self.addEventListener("connect", (e: MessageEvent) => {
  const port = e.ports[0];
  connections.push(port);

  // First tab opens the WebSocket
  if (!ws) {
    ws = new WebSocket("wss://live.shopee.com/notifications");
    ws.onmessage = (event) => {
      // Broadcast to ALL connected tabs
      connections.forEach((p) => p.postMessage({ type: "NOTIFICATION", data: event.data }));
    };
  }

  port.onmessage = (event) => {
    if (event.data.type === "DISCONNECT") {
      const idx = connections.indexOf(port);
      if (idx > -1) connections.splice(idx, 1);
      if (connections.length === 0) ws?.close();
    }
  };

  port.start();
});

// Main thread usage
const worker = new SharedWorker("/shared-worker.js");
worker.port.onmessage = (event) => {
  if (event.data.type === "NOTIFICATION") {
    console.log("Notification from shared WS:", event.data.data);
  }
};
worker.port.start();
```

**💡 Interview Signal:**

- ✅ Strong: Knows both APIs, explains SharedWorker's advantage (stateful, single WS connection), mentions the storage event as the old alternative
- ❌ Weak: "I just use localStorage to share data between tabs" — works but has latency and is not a push mechanism

---

### 13. Storage Migration & Versioning

**🧠 Memory Hook:** "**Treat client storage like a database migration** — version the schema, write upgrade functions, never break reading old data."

**Why does this exist? / Tại sao tồn tại?**

- Why is client storage migration hard? You can't run a migration script on millions of users' browsers. Migration happens lazily when each user first loads the new version
- Why can't you just change the schema? If you change the shape of `localStorage('cart')` in v2, existing users have v1 data. On first load after update, reading v1 data as v2 schema crashes
- Why is IndexedDB's `upgrade` callback the right pattern? It runs once per version, in a transaction, with the old store accessible for reading during migration

**Code Example — Versioned Migration Pattern:**

```typescript
// storage-migration.ts
interface StorageVersion {
  version: number;
  migratedAt: number;
}

// v1: cart was an array of { productId, qty }
// v2: cart items now have { productId, qty, variantId, price }
// v3: cart has a top-level metadata field

type CartV1 = Array<{ productId: string; qty: number }>;
type CartV2 = Array<{ productId: string; qty: number; variantId: string; price: number }>;
type CartV3 = { items: CartV2; currency: string; lastUpdated: number };

const CURRENT_VERSION = 3;

function migrateCart(): CartV3 {
  const raw = localStorage.getItem("cart");
  const versionRaw = localStorage.getItem("cart-version");

  const storedVersion = versionRaw ? parseInt(versionRaw) : 1;

  if (!raw) {
    return { items: [], currency: "VND", lastUpdated: Date.now() };
  }

  let data: unknown = JSON.parse(raw);

  // Run migrations in sequence
  if (storedVersion < 2) {
    // v1 → v2: add variantId and price
    const v1 = data as CartV1;
    data = v1.map((item) => ({
      ...item,
      variantId: "default",
      price: 0, // price will be fetched from server
    })) as CartV2;
  }

  if (storedVersion < 3) {
    // v2 → v3: wrap items with metadata
    const v2 = data as CartV2;
    data = {
      items: v2,
      currency: "VND",
      lastUpdated: Date.now(),
    } as CartV3;
  }

  // Save migrated data
  localStorage.setItem("cart", JSON.stringify(data));
  localStorage.setItem("cart-version", String(CURRENT_VERSION));

  return data as CartV3;
}

// IndexedDB migration (built-in version upgrade)
const db = await openDB("shopee", 3, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (oldVersion < 1) {
      db.createObjectStore("cart", { keyPath: "productId" });
    }
    if (oldVersion < 2) {
      // Add variant support
      const store = transaction.objectStore("cart");
      store.createIndex("by-variant", "variantId");
      // Migrate existing records
      store.openCursor().then(function migrate(cursor) {
        if (!cursor) return;
        cursor.update({ ...cursor.value, variantId: "default" });
        cursor.continue().then(migrate);
      });
    }
    if (oldVersion < 3) {
      // Add new store for offline sync queue
      db.createObjectStore("sync-queue", { keyPath: "id" });
    }
  },
});
```

**💡 Interview Signal:**

- ✅ Strong: Treats storage migration like database migration, writes sequential version upgrades, handles missing data gracefully
- ❌ Weak: "I add a `localStorage.clear()` on app load" — deletes user data on every deploy

---

### 14. Privacy & GDPR: Clearing Sensitive Data on Logout

**🧠 Memory Hook:** "**Logout = destroy all traces.** If you have to list what you clear, you haven't thought about it enough — just nuke the origin's storage."

**Why does this exist? / Tại sao tồn tại?**

- Why is this a frontend concern? GDPR Article 17 "Right to erasure" applies to any device storage, not just server databases. Personal data in localStorage/IndexedDB is in scope
- Why is a simple logout button insufficient? Developers add new localStorage keys over time. A logout that hardcodes `localStorage.removeItem('user-profile')` misses new keys added in feature branches
- Why does shared device matter? In Vietnam and SE Asia, many users share family computers. Incomplete logout leaves another user's order history, payment info, and wishlist visible to the next person who opens the browser

**Code Example — Complete Logout Cleanup:**

```typescript
// logout.ts
export async function performSecureLogout(): Promise<void> {
  // 1. Invalidate server session first (prevents race condition)
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  // 2. Clear all localStorage (nuclear option — safest)
  localStorage.clear();

  // 3. Clear all sessionStorage
  sessionStorage.clear();

  // 4. Clear IndexedDB databases
  const databases = await indexedDB.databases();
  await Promise.all(
    databases.map(
      (db) =>
        new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase(db.name!);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        }),
    ),
  );

  // 5. Clear Service Worker caches
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));

  // 6. Broadcast logout to other tabs
  const channel = new BroadcastChannel("auth");
  channel.postMessage({ type: "LOGOUT" });
  channel.close();

  // 7. Unregister Service Workers (optional — for high-security apps)
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));

  // 8. Redirect to login
  window.location.replace("/login");
}

// Other tabs listen and also logout
const authChannel = new BroadcastChannel("auth");
authChannel.onmessage = (event) => {
  if (event.data.type === "LOGOUT") {
    window.location.replace("/login");
  }
};

// GDPR data export utility
export async function exportUserData(): Promise<Blob> {
  const db = await openDB("shopee", CURRENT_VERSION);
  const orders = await db.getAll("orders");
  const wishlist = await db.getAll("wishlist");

  const exportData = {
    exportedAt: new Date().toISOString(),
    orders,
    wishlist,
    localStorage: Object.entries(localStorage).reduce(
      (acc, [k, v]) => {
        try {
          acc[k] = JSON.parse(v);
        } catch {
          acc[k] = v;
        }
        return acc;
      },
      {} as Record<string, unknown>,
    ),
  };

  return new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
}
```

**💡 Interview Signal:**

- ✅ Strong: Mentions GDPR, clears ALL storage types, broadcasts to other tabs, explains why hardcoding keys is fragile
- ❌ Weak: `localStorage.removeItem('token'); localStorage.removeItem('user')` — misses IndexedDB, caches, other tabs, and future keys

---

### 15. Production Debugging: DevTools for Storage & Network

**🧠 Memory Hook:** "**Application tab = storage inspector. Network tab = cache headers. Sources > Service Workers = SW debugger.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do developers need storage debugging skills? localStorage corruption, IndexedDB schema mismatch, stale cache serving outdated JS — these are real production incidents that require knowing where to look
- Why is understanding cache headers critical? `Cache-Control: max-age=31536000` on an HTML file = users can't get your new deploy for a year. This is a production bug you can't fix by redeploying

**Debugging Reference:**

```
Chrome DevTools — Storage Debugging

Application Tab:
  ├── Storage > Local Storage: Key-value inspector, can edit values live
  ├── Storage > Session Storage: Same UI
  ├── Storage > IndexedDB: Browse object stores, see indexes, delete records
  ├── Storage > Cookies: See all cookies, including non-HttpOnly ones visible to JS
  │       NOTE: HttpOnly cookies show in this panel but JS cannot read them
  │       Look for: HttpOnly ✓, Secure ✓, SameSite: Strict
  ├── Cache > Cache Storage: See SW-cached responses, view response bodies
  └── Service Workers: Registration status, update on reload, bypass for network

Network Tab — Cache Headers:
  ├── Right-click any request → "Show all matching cache entries"
  ├── Status 304 = Not Modified (server validated ETag/Last-Modified, cache is fresh)
  ├── Status 200 (from cache) = browser served without network hit
  ├── Status 200 (from service worker) = SW intercepted, served locally
  ├── Response Headers to check:
  │       Cache-Control: max-age=3600, stale-while-revalidate=600
  │       ETag: "abc123"
  │       Vary: Accept-Encoding, Accept-Language (affects cache key)
  └── Disable Cache checkbox: bypasses browser cache (but not SW cache)

Sources > Service Workers:
  ├── See active SW, waiting SW
  ├── "Update on reload": forces SW update on each page load (dev mode)
  └── Breakpoint in SW fetch handler to debug caching logic
```

**Code Example — Debug Utility for Storage:**

```typescript
// debug-storage.ts — development only
export const storageDebug = {
  async dump() {
    const db = await openDB("shopee", CURRENT_VERSION);
    const stores = Array.from(db.objectStoreNames);

    const result: Record<string, unknown[]> = {
      localStorage: Object.entries(localStorage).map(([k, v]) => ({
        key: k,
        value: JSON.parse(v),
      })),
    };

    for (const store of stores) {
      result[`idb:${store}`] = await db.getAll(store);
    }

    result["cacheKeys"] = await caches.keys();

    console.table(result);
    return result;
  },

  async checkQuota() {
    const { usage, quota } = await navigator.storage.estimate();
    console.log(`Storage: ${formatBytes(usage!)} / ${formatBytes(quota!)}`);
    console.log(`Used: ${((usage! / quota!) * 100).toFixed(1)}%`);
  },

  async clearAll() {
    localStorage.clear();
    sessionStorage.clear();
    const dbs = await indexedDB.databases();
    await Promise.all(dbs.map((d) => indexedDB.deleteDatabase(d.name!)));
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((n) => caches.delete(n)));
    console.log("All storage cleared");
  },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)}MB`;
}

// In development, expose on window for console access
if (process.env.NODE_ENV === "development") {
  (window as any).__storageDebug = storageDebug;
  // Usage: window.__storageDebug.dump()
}
```

**💡 Interview Signal:**

- ✅ Strong: Knows Application tab for storage, Network tab for cache headers, explains 304 vs 200-from-cache difference
- ❌ Weak: "I use `console.log(localStorage)` to debug" — doesn't know DevTools inspection or how to read cache headers

---

## Interview Q&A Section / Phần Hỏi Đáp Phỏng Vấn

---

### Q: What is the difference between localStorage, sessionStorage, cookies, and IndexedDB? When would you use each? 🟢 Junior

**A:** Each storage API has a distinct use case:

- **localStorage**: Synchronous, ~5-10MB, strings only, survives tab/browser close. Use for user preferences (theme, locale), non-sensitive UI state.
- **sessionStorage**: Same API as localStorage but cleared when the tab closes. Use for form drafts or multi-step wizard progress you don't want to persist.
- **Cookies**: 4KB limit, sent with every HTTP request. HttpOnly cookies can't be read by JS. Use for auth tokens (set by server as HttpOnly), CSRF tokens, and consent flags.
- **IndexedDB**: Async, up to ~50% of disk, stores any serializable data, supports transactions and indexes. Use for offline product catalogs, image blobs, sync queues.

Không bao giờ lưu JWT/auth token trong localStorage — XSS attack đọc được bằng 1 dòng `localStorage.getItem()`. HttpOnly cookie là lựa chọn an toàn duy nhất.

**💡 Interview Signal:**

- ✅ Strong: Maps each API to a use case, immediately raises XSS risk for localStorage tokens
- ❌ Weak: "They're all the same, just different sizes" — misses async nature of IndexedDB, server-sent cookies, and security implications

---

### Q: How does TanStack Query differ from Redux for server data? Why not put API data in Redux? 🟡 Mid

**A:** Redux and TanStack Query solve different problems:

Redux is designed for **client UI state** — data your app controls: modal visibility, form values, user preferences. It has no concept of stale data, background refresh, deduplication, or retry.

TanStack Query is designed for **server state** — data owned by the server that your app caches. It provides: automatic background refetch when data goes stale, request deduplication (10 components mounting simultaneously → 1 request), cache invalidation with queryKey hierarchy, optimistic updates with rollback, and automatic retry with backoff.

Using Redux for server data requires you to manually implement all of the above. That's the "asynchronous Redux" problem: `isLoading`, `isError`, `lastFetched`, manual invalidation actions — hundreds of lines of boilerplate TanStack Query gives you for free.

Rule: **Server state (API data) → TanStack Query or Apollo. Client UI state → useState or Zustand.**

**💡 Interview Signal:**

- ✅ Strong: Names deduplication, stale-time, and background sync as features Redux lacks; gives the rule clearly
- ❌ Weak: "Redux works fine with thunks" — technically true but misses why it's the wrong tool

---

### Q: Design an offline-first order flow for Grab drivers in low-connectivity areas. / Thiết kế offline-first order flow cho tài xế Grab ở vùng sóng yếu. 🔴 Senior

**A:** The system needs to work regardless of network state and sync reliably when connectivity returns.

**Architecture:**

1. **Service Worker** intercepts all `/api/*` requests. GET requests use stale-while-revalidate from Cache API. POST/PUT/DELETE requests: try network first; if offline, clone request body to IndexedDB sync queue, return `202 Accepted` to app.

2. **Sync Queue** (IndexedDB): stores `{ id, endpoint, method, body, timestamp, retryCount, status }`. The SW registers a Background Sync event on network recovery.

3. **Optimistic UI**: On "Accept Order", app immediately updates UI and writes to queue. Tài xế sees "Accepted" instantly — no spinner, no block.

4. **Conflict resolution on sync**: If server returns `409 Conflict` (order already taken by another driver), SW marks item `status: failed`, sends `postMessage` to main thread. App shows: "This order was taken while you were offline" — manual resolution.

5. **Quota management**: Before storing map tiles or large catalogs, check `navigator.storage.estimate()`. Evict LRU data if usage > 80% of quota.

**Key decisions:**

- Background Sync API ensures replay survives browser restart (not just network reconnect)
- Per-item retry count with backoff to avoid hammering server on recovery
- Separate handling for 409 (conflict) vs 5xx (transient error) vs network error

SW intercept → queue mutations → optimistic UI → Background Sync replay → conflict resolution via postMessage to app.

**💡 Interview Signal:**

- ✅ Strong: Designs queue before retry, separates conflict from transient errors, mentions Background Sync API for persistence, adds quota management
- ❌ Weak: "Retry fetch in a loop" — no persistence, no conflict handling, no UX design for the offline period

---

### Q: How does Apollo InMemoryCache normalization prevent stale data across components? 🟡 Mid

**A:** Apollo normalizes GraphQL results by `__typename + id`. When a query returns `Product { id: "p-1", price: 999 }`, Apollo stores it as a single entity `Product:p-1` in the cache. Every other query that touches Product p-1 — whether it's search results, cart items, or recommendations — holds a reference to that same entity.

When you update `Product:p-1` (via mutation response or `cache.modify`), all references automatically reflect the new value. No need to manually track which queries contain this product and invalidate them individually.

This is the key difference from normalized REST caching: with REST, you often have 3 copies of the same product in different query caches. With Apollo's GraphQL normalization, there's one canonical entity — update once, visible everywhere.

Edge case: pagination queries use `keyArgs` to control cache separation — `keyArgs: ['category']` means each category gets its own paginated cache, while different sort orders on the same category share and merge pages.

**💡 Interview Signal:**

- ✅ Strong: Explains `__typename + id` as the normalization key, understands why `cache.modify` beats refetch, knows `keyArgs` for pagination
- ❌ Weak: "Apollo caches GraphQL queries" — describes the symptom not the mechanism

---

### Q: Explain cursor-based pagination vs offset pagination. When does offset break? 🟡 Mid

**A:**

**Offset pagination**: `GET /products?page=3&limit=20` translates to `OFFSET 40 LIMIT 20`. Problem 1: performance — the DB scans and discards 40 rows to reach page 3 (O(offset) scan). Problem 2: correctness — if a product is inserted between page 1 and page 2 while the user is paginating, every item shifts, causing duplicates on the next page or missed items. This is why you see "You've seen all items" errors on product feeds after new items are added.

**Cursor pagination**: Server encodes the last item's position as an opaque cursor. `GET /products?cursor=<encoded_last_id>` → `WHERE id > last_id LIMIT 20`. The DB uses an index seek (O(log n)), not a scan. New inserts don't affect the cursor position — you always get the correct next page. The tradeoff: users can't jump to "page 50" arbitrarily.

For Shopee/Tiki product feeds (append-only or insert-heavy), cursor pagination is correct. For an admin table where users need to jump to page 47, offset is acceptable.

**💡 Interview Signal:**

- ✅ Strong: Names both failure modes of offset (performance + correctness), explains cursor as index seek, states when each is appropriate
- ❌ Weak: "Cursor is better because it's faster" — misses the correctness argument and doesn't explain when offset is still fine

---

### Q: Design a real-time notification system for 1M concurrent Shopee users. 🔴 Senior

**A:** At 1M concurrent connections, the choice of protocol and architecture determines whether this works or collapses.

**Protocol choice: SSE over WebSocket.**
Notifications are server→client only. SSE uses HTTP/2 and multiplexes connections on existing infrastructure. It auto-reconnects with `Last-Event-ID` so no notifications are lost on reconnect. WebSocket requires stateful server-side connection tracking — harder to scale behind standard load balancers.

**Architecture:**

```
User Browser
    └── SSE connection to /api/notifications/stream

Load Balancer (sticky sessions for SSE)
    └── Notification Service (N instances)
            └── Redis Pub/Sub (fan-out)
                    └── Event Producer Services
                           (order service, chat service, promo service)
```

**Frontend handling:**

```typescript
function useNotifications() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const es = new EventSource("/api/notifications/stream", {
      withCredentials: true,
    });

    es.addEventListener("order-update", (e) => {
      const data = JSON.parse(e.data);
      queryClient.setQueryData(["order", data.orderId], (old: Order) => ({
        ...old,
        status: data.newStatus,
      }));
      showToast(`Order ${data.orderId} is now ${data.newStatus}`);
    });

    return () => es.close();
  }, []);
}
```

**Key concerns at 1M scale:**

- Sticky sessions: SSE connections must stay on one server. Use consistent hashing in LB
- Heartbeat: send comment `:keepalive\n\n` every 25s to prevent proxy timeouts
- Batching: coalesce multiple events within 100ms window before sending to reduce round-trips
- Graceful degradation: if SSE fails (corporate proxy blocks), fall back to long polling

SSE cho server→client. HTTP/2. Redis Pub/Sub cho fan-out. Sticky session trong LB. `Last-Event-ID` cho replay khi reconnect. Fallback về long polling khi SSE bị block.

**💡 Interview Signal:**

- ✅ Strong: Chooses SSE over WS with reasoning, knows Redis Pub/Sub for fan-out, mentions sticky sessions, `Last-Event-ID`, and fallback strategy
- ❌ Weak: "Use WebSocket" without discussing scale cost, or misses the fan-out architecture

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                                | Level | One-liner                                                                    |
| --- | ------------------------------------ | ----- | ---------------------------------------------------------------------------- |
| 1   | localStorage vs IndexedDB vs Cookies | 🟢    | XSS exposure → HttpOnly cookie; size → IndexedDB; preferences → localStorage |
| 2   | IndexedDB transactions & indexes     | 🟢    | Object stores + async API + ACID transactions; idb library for ergonomics    |
| 3   | XSS & HttpOnly cookies               | 🟢    | HttpOnly = only HTTP stack reads it; localStorage = any JS reads it          |
| 4   | UI vs Server vs Persisted state      | 🟡    | useState/Zustand, TanStack Query, localStorage — each for its domain         |
| 5   | TanStack Query patterns              | 🟡    | queryKey hierarchy, staleTime, optimistic + rollback, prefetch on hover      |
| 6   | Apollo InMemoryCache                 | 🟡    | Normalized entity store, `__typename:id`, cache.modify beats refetch         |
| 7   | Offline-first with Service Worker    | 🔴    | SW intercept → IndexedDB queue → optimistic UI → Background Sync replay      |
| 8   | Conflict resolution                  | 🔴    | LWW for scalars, CRDT for commutative ops, manual merge for UX-sensitive     |
| 9   | Normalized vs denormalized cache     | 🟡    | Normalize → one copy, update propagates everywhere; denormalize → fast read  |
| 10  | Cursor vs offset pagination          | 🟡    | Offset breaks on live data; cursor = index seek, stable, O(log n)            |
| 11  | WebSocket vs SSE vs polling          | 🟡    | SSE: push-only + auto-reconnect; WS: bidirectional; polling: fallback        |
| 12  | Multi-tab sync                       | 🟡    | BroadcastChannel for events; SharedWorker for shared WS connection           |
| 13  | Storage migration                    | 🟡    | Version-gated migration functions; IndexedDB upgrade callback                |
| 14  | GDPR logout cleanup                  | 🔴    | Clear ALL storage types + broadcast to other tabs + unregister SW            |
| 15  | DevTools debugging                   | 🟢    | Application tab, Network cache headers, SW breakpoints                       |

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                           | Difficulty | Core Concept                | Key Signal                                                   |
| --- | ------------------------------------------------- | ---------- | --------------------------- | ------------------------------------------------------------ |
| 1   | localStorage vs IndexedDB vs Cookie differences?  | 🟢 Junior  | Storage API comparison      | XSS security first; then size and access pattern             |
| 2   | Why TanStack Query instead of Redux for API data? | 🟡 Mid     | Server state vs UI state    | Dedup, stale-while-revalidate, invalidation hierarchy        |
| 3   | Offline-first Grab driver order flow?             | 🔴 Senior  | Offline architecture design | SW queue + Background Sync + conflict resolution             |
| 4   | How Apollo cache normalization works?             | 🟡 Mid     | Apollo InMemoryCache        | `__typename:id` as cache key; `cache.modify` not refetch     |
| 5   | Cursor vs offset pagination trade-offs?           | 🟡 Mid     | Pagination patterns         | Offset fails on live data; cursor = stable index seek        |
| 6   | Real-time notifications for 1M users?             | 🔴 Senior  | SSE at scale                | SSE over WS, Redis Pub/Sub, sticky sessions, `Last-Event-ID` |

---

## ⚡ Cold Call Simulation

**Q: "User adds an item to cart. Before the API response comes back, the cart count in the header updates instantly. How does that work, and what happens if the server rejects the request?"**

**30-second answer:**

"That's an optimistic update. Here's the flow: when the user clicks 'Add to Cart', the mutation fires two things simultaneously — the API request and a synchronous cache update that increments the cart count immediately. The user sees the change with zero latency.

If the server responds `200 OK`, we're done — optionally sync any server-authoritative data back to the cache. If the server returns an error — say the item is out of stock — we need to rollback. This is why, before making the optimistic update, you snapshot the current cache value. In TanStack Query's `onMutate`, you capture `previousCart = queryClient.getQueryData(['cart'])`, apply the optimistic update, and return `{ previousCart }` as context. In `onError`, you call `queryClient.setQueryData(['cart'], context.previousCart)` to restore the previous state, then show the user a toast explaining what happened.

The full cycle: snapshot → optimistic update → server request → `onSuccess` confirm OR `onError` rollback + toast → `onSettled` invalidate to ensure eventual sync."

---

[Back to Table of Contents](../../00-table-of-contents.md) | [← Microservices](./04-microservices.md) | [Microservices Patterns →](./06-microservices-patterns.md)

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                          |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Kể 4 storage APIs, capacity của mỗi loại, và 1 use case phù hợp nhất. Tại sao không lưu JWT trong localStorage?                                  |
| 2   | 🎨 Visual      | Vẽ sơ đồ offline-first flow: user action → SW intercept → queue → sync. Conflict resolution xảy ra ở bước nào?                                   |
| 3   | 🛠️ Application | App Shopee của bạn có cart open ở 3 tabs. User thêm item ở tab 1. Tab 2 và 3 cập nhật thế nào? Viết 10 dòng code.                                |
| 4   | 🐛 Debug       | User report: "add to cart không update header ngay, phải refresh mới thấy". Nguyên nhân có thể là gì? Debug từng bước.                           |
| 5   | 🎓 Teach       | Giải thích cursor pagination cho backend engineer quen với SQL: tại sao `OFFSET 10000` là vấn đề, và cursor giải quyết thế nào ở database layer? |
| 6   | 🔴 Design      | Thiết kế data layer cho Tiki flash sale: 500k products, real-time stock updates, offline browsing cần thiết. Chọn storage và sync strategy.      |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                                                                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | localStorage: 5-10MB, string-only, sync, XSS-accessible → preferences. Cookies: 4KB, sent with requests, HttpOnly → auth tokens. IndexedDB: ~50% disk, async, structured, transactional → offline catalogs. JWT in localStorage: any XSS script can call `localStorage.getItem('token')` and exfiltrate to attacker's server.                      |
| 2   | User Action → SW intercepts fetch → if offline: clone body → IndexedDB sync queue → return 202 Accepted → optimistic UI update. On network recovery: Background Sync fires → SW reads queue → replay requests → 200 OK: delete item, 409 Conflict: mark failed + notify user, 5xx: retry with backoff.                                             |
| 3   | `BroadcastChannel("cart").postMessage({ type: 'ITEM_ADDED', item })` from tab 1. Tabs 2 & 3: `channel.onmessage = () => queryClient.invalidateQueries({ queryKey: ['cart'] })`. Result: all tabs refetch and show updated cart.                                                                                                                    |
| 4   | Likely `staleTime > 0` + no `onSuccess` cache update after mutation. Fix options: (1) `queryClient.invalidateQueries(['cart'])` in `onSuccess`, (2) `queryClient.setQueryData(['cart'], updater)` for instant sync without refetch, (3) Check if `staleTime: Infinity` is preventing background refetch.                                           |
| 5   | `OFFSET 10000` = DB reads 10,000 rows then discards them → O(n) scan, slow on large tables. Also: new inserts during pagination shift row positions → page 3 shows duplicate items from page 2. Cursor: `WHERE id > last_id LIMIT 20` — DB uses B-tree index seek directly to `last_id` position, O(log n), immune to inserts.                     |
| 6   | Static catalog: IndexedDB (products cached offline), Cache API (product images). Real-time stock: SSE for push updates → `cache.modify` or `queryClient.setQueryData` for instant UI. Flash sale pricing: `staleTime: 0` or WebSocket for sub-second accuracy. BroadcastChannel for multi-tab cart sync. GDPR: clear IndexedDB + caches on logout. |

> 🎯 **Feynman Prompt:** Giải thích "offline-first" cho non-technical product manager — tại sao cần thiết kế từ đầu thay vì thêm sau, và lấy ví dụ cụ thể về bug sẽ xảy ra nếu retrofit.

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

---

## Connections / Liên Kết

- ⬅️ **Built on**: [Browser Performance](../06-browser-performance/04-web-performance-comprehensive.md) — storage I/O impacts paint and interaction metrics
- ⬅️ **Built on**: [Caching Strategies](./03-caching.md) — HTTP cache layer works alongside client storage
- 🔗 **Applied in**: [System Design Theory](../../shared/02-system-design/system-design-theory.md) — client data layer is part of full-stack design
- 🔗 **Applied in**: [Microservices](./04-microservices.md) — BFF pattern affects what client needs to cache
- ➡️ **Leads to**: [Microservices Patterns](./06-microservices-patterns.md) — event-driven patterns mirror offline sync queue design
